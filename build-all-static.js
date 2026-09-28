/*
 * @Author       : HCLonely
 * @Date         : 2022-05-22 10:13:54
 * @LastEditTime : 2025-06-17 09:15:23
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task-v5/build-all-static.js
 * @Description  : 构建全资源版本
 */
/* eslint-disable @typescript-eslint/no-var-requires */

(async () => {
  const fs = require('fs-extra');
  const path = require('path');
  const chalk = await import('chalk');

  const resourcePaths = {
    autoTaskStyle: './dist/auto-task.css',
    style: './src/static/sweetalert2.min.css'
  };
  for (const name of ['auto-task', 'auto-task.compatibility', 'auto-task.min']) {
    const source = fs.readFileSync(`./dist/${name}.user.js`, 'utf8');
    const headerText = source.slice(0, source.indexOf('// ==/UserScript=='));
    const requireJsName = [...headerText.matchAll(/\/\/ @require[^\S\r\n]+(https?:\/\/\S+)/g)]
      .map((match) => path.posix.basename(new URL(match[1]).pathname));
    const requireJsText = requireJsName.map((file) => fs.readFileSync(path.join(
      ['auto-task.modules.js', 'auto-task.website.js'].includes(file) ? './dist' : './src/static', file
    ), 'utf8')).join('\n');
    const resources = Object.fromEntries([...headerText.matchAll(/\/\/ @resource[^\S\r\n]+(\w+)[^\S\r\n]+(https?:\/\/\S+)/g)]
      .map((match) => {
        const resourcePath = resourcePaths[match[1]];
        if (!resourcePath) throw new Error(`Unknown resource: ${match[1]}`);
        return [match[1], fs.readFileSync(resourcePath, 'utf8')];
      }));
    const output = source
      .replace(/\/\/ @require[^\r\n]*\r?\n/g, '')
      .replace(/\/\/ @resource[^\r\n]*\r?\n/g, '')
      .replace(/GM_getResourceText\(\s*(['"])(\w+)\1\s*\)/g, (match, quote, resourceName) => {
        if (!Object.hasOwn(resources, resourceName)) throw new Error(`Missing resource: ${resourceName}`);
        return JSON.stringify(resources[resourceName]);
      })
      .replace('// ==/UserScript==', () => `// ==/UserScript==\n\n${requireJsText}`);
    fs.writeFileSync(`./dist/${name}.all.user.js`, output);
  }

  console.log(`All static version files generated ${chalk.default.green.bold('successfully')}!`);
})();
