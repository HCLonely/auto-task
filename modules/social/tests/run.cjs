const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const types = spawnSync(process.execPath, ['node_modules/typescript/bin/tsc', '-p', 'modules/social/tsconfig.json'], { stdio: 'inherit' });
if (types.error) throw types.error;
if (types.status !== 0) process.exit(types.status ?? 1);
const collect = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? collect(file) : entry.name.endsWith('.test.cjs') ? [file] : [];
});
const result = spawnSync(process.execPath, ['--test', ...collect('modules')], { stdio: 'inherit' });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
