/*
 * @Author       : HCLonely
 * @Date         : 2022-01-03 14:18:53
 * @LastEditTime : 2025-08-11 14:13:24
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/copy.js
 * @Description  : 复制文件到备用源网站
 */

(async () => {
  /* eslint-disable @typescript-eslint/no-var-requires */
  const fs = require('fs-extra');
  const chalk = await import('chalk');

  fs.copySync('./dist', './page/dist');
  fs.copySync('./package.json', './page/package.json');

  fs.copySync('./page', './doc/docs/.vuepress/public', {
    filter: (src) => {
      return !src.includes('index.html') && !src.includes('vercel.json') && !src.includes('package.json');
    }
  });

  console.log(`Files copied ${chalk.default.green.bold('successfully')}!`);
})();
