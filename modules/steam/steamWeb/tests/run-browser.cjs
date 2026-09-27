const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { pathToFileURL } = require('node:url');
const { execFileSync } = require('node:child_process');
const { rollup } = require('rollup');
const ts = require('typescript');

async function main() {
  const browser = process.env.STEAMWEB_TEST_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
  if (!fs.existsSync(browser)) throw new Error('Set STEAMWEB_TEST_BROWSER to a Chromium/Edge executable');
  const bundle = await rollup({
    input: path.join(__dirname, 'browser.test.mjs'),
    plugins: [{
      name: 'local-typescript',
      resolveId(id, importer) {
        if (!importer || !id.startsWith('.')) return null;
        const resolved = path.resolve(path.dirname(importer), id);
        return fs.existsSync(resolved) ? resolved : `${resolved}.ts`;
      },
      transform(code, id) {
        if (!id.endsWith('.ts')) return null;
        return { code: ts.transpileModule(code, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText, map: null };
      }
    }]
  });
  const { output } = await bundle.generate({ format: 'es' });
  await bundle.close();
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'steamweb-browser-'));
  const html = path.join(directory, 'test.html');
  fs.writeFileSync(html, `<html><body><pre id="results">pending</pre><script type="module">${output[0].code.replace(/<\/script/gi, '<\\/script')}</script></body></html>`);
  const rendered = execFileSync(browser, [
    '--headless', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    `--user-data-dir=${path.join(directory, 'profile')}`, '--dump-dom', '--virtual-time-budget=5000', pathToFileURL(html).href
  ], { encoding: 'utf8', timeout: 30000, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  const result = rendered.match(/<pre id="results">([\s\S]*?)<\/pre>/)?.[1];
  console.log(result || rendered);
  if (!rendered.includes('data-test-status="passed"')) throw new Error('Browser regression failed');
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; });
