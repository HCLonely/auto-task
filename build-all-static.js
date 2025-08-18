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

  const headerText = fs.readFileSync('./src/scripts/header.js').toString();
  const requireJsName = [...headerText.matchAll(/\/\/ @require[\s]+?(http.+)/g)]
    .map((text) => text[1].split('/').at(-1));
  const requireJsText = requireJsName.map((file) => fs.readFileSync(path.join('./src/static', file)).toString()).join('\n');
  const resourcesFileName = [...headerText.matchAll(/\/\/ @resource[\s]+?([\w]+?)[\s]+?(http.+)/g)]
    .map((text) => [text[1], text[2].split('/').at(-1)]);
  const resourcesFile = Object.fromEntries(resourcesFileName
    .map((file) => [file[0], fs.readFileSync(path.join('./src/static', file[1])).toString()]));

  fs.writeFileSync('./dist/auto-task.all.user.js', fs.readFileSync('./dist/auto-task.user.js').toString()
    .replace(/\/\/ @require.+\n/g, '')
    .replace(/\/\/ @resource.+\n/g, '')
    .replace('// ==/UserScript==', () => `// ==/UserScript==\n\n${requireJsText}`)
    .replace(new RegExp(`GM_getResourceText\\(("|')(${Object.keys(resourcesFile).join('|')})("|')\\)`, 'g'),
      (match, p1, name) => `\`${resourcesFile[name]}\``));

  fs.writeFileSync('./dist/auto-task.compatibility.all.user.js', fs.readFileSync('./dist/auto-task.compatibility.user.js').toString()
    .replace(/\/\/ @require.+\n/g, '')
    .replace(/\/\/ @resource.+\n/g, '')
    .replace('// ==/UserScript==', () => `// ==/UserScript==\n\n${requireJsText}`)
    .replace(new RegExp(`GM_getResourceText\\(("|')(${Object.keys(resourcesFile).join('|')})("|')\\)`, 'g'),
      (match, p1, name) => `\`${resourcesFile[name]}\``));

  fs.writeFileSync('./dist/auto-task.min.all.user.js', fs.readFileSync('./dist/auto-task.min.user.js').toString()
    .replace(/\/\/ @require.+\n/g, '')
    .replace(/\/\/ @resource.+\n/g, '')
    .replace('// ==/UserScript==', () => `// ==/UserScript==\n\n${requireJsText}`)
    .replace(new RegExp(`GM_getResourceText\\(("|')(${Object.keys(resourcesFile).join('|')})("|')\\)`, 'g'),
      (match, p1, name) => `\`${resourcesFile[name]}\``));

  console.log(`All static version files generated ${chalk.default.green.bold('successfully')}!`);
})();
