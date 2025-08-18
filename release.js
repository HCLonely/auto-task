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

  const changelog = fs.readFileSync('./CHANGELOG.md', 'utf8').trim();
  const package = fs.readJSONSync('./package.json');
  package.change = changelog.split('\n').map(line => line.replace(/^-\s*/, '').trim()).filter(line => line);
  fs.writeFileSync('./package.json', JSON.stringify(package, null, 2));
  if (package.version === releaseStep.with.name) {
    settings.on = 'workflow_dispatch';
    fs.writeFileSync('./.github/workflows/Release.yml', yaml.dump(settings));
    console.log(`Version ${chalk.default.yellow.bold('not be changed')}!`);
  }
  settings.on = {
    push: {
      branches: ['main'],
      paths: ['src/**', '.github/workflows/Release.yml']
    }
  };
  options.prerelease = package.version.includes('-');
  options.tag_name = `v${package.version}`;
  options.name = package.version;
  options.body = changelog;
  options.files = `dist/auto-task.user.js
dist/auto-task.min.user.js
dist/auto-task.compatibility.user.js
dist/auto-task.all.user.js
dist/auto-task.min.all.user.js
dist/auto-task.compatibility.all.user.js`;
  options.token = '${{ github.TOKEN }}';
  releaseStep.with = options;
  fs.writeFileSync('./.github/workflows/Release.yml', yaml.dump(settings));
  console.log(`Release action changed ${chalk.default.green.bold('successfully')}!`);

})();
