/*
 * @Author       : HCLonely
 * @Date         : 2022-01-16 19:03:01
 * @LastEditTime : 2025-08-11 14:34:19
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task-v5/release.js
 * @Description  : 自动发布Release
 */

(async () => {
  /* eslint-disable @typescript-eslint/no-var-requires, camelcase */
  const fs = require('fs-extra');
  const yaml = require('js-yaml');
  const chalk = await import('chalk');

  const writeIfChanged = async (file, content) => {
    if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === content) {
      return;
    }
    for (let attempt = 0; ; attempt += 1) {
      try {
        fs.writeFileSync(file, content);
        return;
      } catch (error) {
        // Windows may temporarily deny opening a file held by another process.
        if (process.platform !== 'win32' || error.syscall !== 'open'
          || !['UNKNOWN', 'EBUSY', 'EPERM', 'EACCES'].includes(error.code) || attempt >= 4) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 100 * (attempt + 1)));
      }
    }
  };

  const settings = yaml.load(fs.readFileSync('./.github/workflows/Release.yml', 'utf8'));
  if (!settings) {
    return console.log(`'./.github/workflows/Release.yml' ${chalk.default.red.bold('not found')}!`);
  }

  const steps = settings.jobs?.release?.steps;
  const releaseStep = steps[steps.length - 1];
  if (releaseStep?.name !== 'Release') {
    return console.log(`Release action chenged ${chalk.default.red.bold('failed [no Release step]')}!`);
  }
  const options = {};

  if (!fs.existsSync('./CHANGELOG.md')) {
    await writeIfChanged('./CHANGELOG.md', '');
  }
  const changelog = fs.readFileSync('./CHANGELOG.md', 'utf8').trim();
  const package = fs.readJSONSync('./package.json');
  const changes = changelog.split('\n').map(line => line.replace(/^-\s*/, '').trim()).filter(line => line);
  if (JSON.stringify(package.change) !== JSON.stringify(changes)) {
    package.change = changes;
    await writeIfChanged('./package.json', JSON.stringify(package, null, 2));
  }
  if (package.version === releaseStep.with.name) {
    settings.on = 'workflow_dispatch';
    await writeIfChanged('./.github/workflows/Release.yml', yaml.dump(settings));
    console.log(`Version ${chalk.default.yellow.bold('not be changed')}!`);
  }
  settings.on = {
    push: {
      branches: ['main'],
      paths: ['src/**', 'modules/**', '.github/workflows/Release.yml']
    }
  };
  options.prerelease = package.version.includes('-');
  options.tag_name = `v${package.version}`;
  options.name = package.version;
  options.body = changelog;
  options.files = `dist/auto-task.user.js
dist/auto-task.css
dist/auto-task.modules.js
dist/auto-task.i18n.js
dist/auto-task.website.js
dist/auto-task.min.user.js
dist/auto-task.compatibility.user.js
dist/auto-task.all.user.js
dist/auto-task.min.all.user.js
dist/auto-task.compatibility.all.user.js`;
  options.token = '${{ github.TOKEN }}';
  releaseStep.with = options;
  await writeIfChanged('./.github/workflows/Release.yml', yaml.dump(settings));
  console.log(`Release action changed ${chalk.default.green.bold('successfully')}!`);

})();
