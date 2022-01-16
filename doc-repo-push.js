/*
 * @Author       : HCLonely
 * @Date         : 2022-01-16 17:31:53
 * @LastEditTime : 2022-01-16 18:52:25
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task-new/doc-repo-push.js
 * @Description  : 同步auto-task-doc仓库
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const { spawnSync } = require('child_process');
const dayjs = require('dayjs');

const git = (...args) => {
  const { stdout, stderr } = spawnSync('git', args, { cwd: 'doc' });
  console.log(`stdout:
  ${stdout}
stderr:
  ${stderr}`);
};
git('config', '--global', 'init.defaultBranch', 'gh-pages');
git('config', '--global', 'user.name', 'HCLonely');
git('config', '--global', 'user.email', 'h1606051253@gmail.com');
git('init');
git('remote', 'add', 'origin', `https://${process.env.TOKEN}@github.com/HCLonely/auto-task-doc`);
git('add', '-A');
git('commit', '-m', `Update at ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`);
git('push', 'origin', 'gh-pages', '--force');
