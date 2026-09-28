import * as fs from 'fs';
import path from 'node:path';
import typescript from '@rollup/plugin-typescript';
import progress from 'rollup-plugin-progress';
import sizes from 'rollup-plugin-sizes';
import { visualizer } from "rollup-plugin-visualizer";
import { fileURLToPath } from 'node:url';
import * as sass from 'sass';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import svg from 'rollup-plugin-svg-import';

const VERSION = JSON.parse(fs.readFileSync('package.json')).version;
const NAME = 'auto-task';

const i18nGlobals = new Map([
  [path.resolve('src/modules/i18n'), 'AutoTaskI18n'],
  [path.resolve('src/modules/i18n/index'), 'AutoTaskI18n']
]);

const moduleGlobals = new Map(Object.entries({
  social: 'social',
  'social/results': 'social',
  'social/adapter': 'social',
  steam: 'steam',
  'steam/steamWeb': 'steamWeb',
  'steam/steamASF': 'steamASF',
  vk: 'vk',
  twitch: 'twitch',
  twitter: 'twitter',
  reddit: 'reddit',
  youtube: 'youtube'
}).map(([entry, namespace]) => [path.resolve('src/modules/social', entry), `AutoTaskModules.${namespace}`]));

const websiteGlobals = new Map([
  [path.resolve('src/modules/website/index'), 'AutoTaskWebsite'],
  [path.resolve('src/modules/website/options'), 'AutoTaskWebsite.options'],
  ...Object.entries({
    'ui/dialog': 'dialog',
    globalOptions: 'globalOptions',
    globalOptionsEdit: 'globalOptionsEdit',
    echoLog: 'echoLog',
    'tools/i18n': 'i18n',
    'tools/debug': 'debug',
    'social/moduleBridge': 'moduleBridge',
    'social/SteamASF': 'SteamASF'
  }).map(([entry, namespace]) => [path.resolve('src/scripts', entry), `AutoTaskWebsite.${namespace}`])
]);

const externalize = mappings => ({
  name: 'userscript-modules',
  resolveId(source, importer) {
    if (!importer || !source.startsWith('.')) return null;
    const id = path.resolve(path.dirname(importer), source).replace(/\.ts$/, '');
    return mappings.has(id) ? { id, external: true } : null;
  }
});

const externalGlobals = {
  'browser-tool': 'browser',
  'node-inspect-extracted': 'util'
};
const globals = id => i18nGlobals.get(id) || moduleGlobals.get(id) || websiteGlobals.get(id) || externalGlobals[id];
const interop = id => i18nGlobals.has(id) || moduleGlobals.has(id) || websiteGlobals.has(id) ? 'esModule' : 'default';

const i18nBuild = {
  input: 'src/modules/i18n/index.ts',
  output: {
    file: 'dist/auto-task.i18n.js',
    format: 'umd',
    name: 'AutoTaskI18n',
    exports: 'named',
    plugins: [
      getBabelOutputPlugin({ presets: ['@babel/preset-env'], allowAllFormats: true }),
      terser({ format: { comments: false } })
    ]
  },
  plugins: [nodeResolve(), typescript()]
};

const modulesBuild = {
  input: 'src/modules/social/browser.ts',
  output: {
    file: 'dist/auto-task.modules.js',
    format: 'iife',
    name: 'AutoTaskModules',
    plugins: [
      getBabelOutputPlugin({ presets: ['@babel/preset-env'], allowAllFormats: true }),
      terser({ format: { comments: false } })
    ]
  },
  plugins: [nodeResolve(), typescript()]
};

const userscriptBuild = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/auto-task.user.js',
      format: 'iife',
      globals,
      interop,
      plugins: [
        // Generate one report; concurrent outputs must not write the same file.
        visualizer({
          gzipSize: true,
          filename: 'doc/docs/.vuepress/public/report.html'
        }),
        terser({
          sourceMap: false,
          compress: false,
          mangle: false,
          output: {
            beautify: true,
            indent_level: 2,
            braces: true,
            quote_style: 1,
            preamble: fs.readFileSync('./src/scripts/header.js').toString()
              .replace(/__VERSION__/g, VERSION)
              .replace(/__NAME__/g, NAME)
              .replace(/__UPDATE_URL__/g, `https://github.com/HCLonely/auto-task/raw/main/dist/${NAME}.user.js`)
              .replace(/__CHECK_DEPENDENCIES__/g, fs.readFileSync('./src/scripts/checkDependence.js').toString())
              .replace(/__ALL_URL__/g, `https://github.com/HCLonely/auto-task/raw/main/dist/${NAME}.all.user.js`)
          },
        })
      ]
    },
    {
      file: 'dist/auto-task.compatibility.user.js',
      format: 'iife',
      globals,
      interop,
      plugins: [
        getBabelOutputPlugin({
          presets: [
            '@babel/preset-env'
          ],
          allowAllFormats: true
        }),
        terser({
          sourceMap: false,
          compress: false,
          mangle: false,
          output: {
            beautify: true,
            indent_level: 2,
            braces: true,
            quote_style: 1,
            preamble: fs.readFileSync('./src/scripts/header.js').toString()
              .replace(/__VERSION__/g, VERSION)
              .replace(/__NAME__/g, `${NAME}.compatibility`)
              .replace(/__UPDATE_URL__/g, `https://github.com/HCLonely/auto-task/raw/main/dist/${NAME}.compatibility.user.js`)
              .replace(/__CHECK_DEPENDENCIES__/g, fs.readFileSync('./src/scripts/checkDependence.js').toString())
              .replace(/__ALL_URL__/g, `https://github.com/HCLonely/auto-task/raw/main/dist/${NAME}.compatibility.all.user.js`)
          },
        })
      ]
    },
    {
      file: 'dist/auto-task.min.user.js',
      format: 'iife',
      globals,
      interop,
      plugins: [
        getBabelOutputPlugin({
          presets: [
            '@babel/preset-env'
          ],
          allowAllFormats: true
        }),
        terser({
          sourceMap: false,
          compress: true,
          mangle: {
            toplevel: true
          },
          output: {
            beautify: false,
            indent_level: 2,
            braces: true,
            quote_style: 1,
            preamble: fs.readFileSync('./src/scripts/header.js').toString()
              .replace(/__VERSION__/g, VERSION)
              .replace(/__NAME__/g, `${NAME}.min`)
              .replace(/__UPDATE_URL__/g, `https://github.com/HCLonely/auto-task/raw/main/dist/${NAME}.min.user.js`)
              .replace(/__CHECK_DEPENDENCIES__/g, fs.readFileSync('./src/scripts/checkDependence.js').toString())
              .replace(/__ALL_URL__/g, `https://github.com/HCLonely/auto-task/raw/main/dist/${NAME}.min.all.user.js`)
          },
        })
      ]
    }
  ],
  plugins: [
    externalize(new Map([...i18nGlobals, ...moduleGlobals, ...websiteGlobals])),
    progress(),
    sizes({
      details: true,
    }),
    nodeResolve(),
    typescript(),
    {
      name: 'project-style',
      async buildStart() {
        const compiled = await sass.compileAsync('src/style/auto-task.scss', { style: 'compressed' });
        for (const url of compiled.loadedUrls) {
          if (url.protocol === 'file:') this.addWatchFile(fileURLToPath(url));
        }
        const result = await postcss([autoprefixer()]).process(compiled.css, { from: undefined });
        // Write once before the three script outputs, including in watch mode.
        fs.mkdirSync('dist', { recursive: true });
        fs.writeFileSync('dist/auto-task.css', result.css.replace(/^\uFEFF/, ''));
      }
    },
    svg({
      stringify: true
    })
  ],
  external: Object.keys(externalGlobals)
};

const websiteBuild = {
  input: 'src/modules/website/browser.ts',
  output: {
    file: 'dist/auto-task.website.js',
    format: 'iife',
    name: 'AutoTaskWebsite',
    globals,
    interop,
    plugins: [
      getBabelOutputPlugin({ presets: ['@babel/preset-env'], allowAllFormats: true }),
      terser({ format: { comments: false } })
    ]
  },
  plugins: [externalize(new Map([...i18nGlobals, ...moduleGlobals])), nodeResolve(), typescript(), svg({ stringify: true })],
  external: Object.keys(externalGlobals)
};

export default [i18nBuild, modulesBuild, websiteBuild, userscriptBuild];
