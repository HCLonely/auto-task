/*
 * @Author       : HCLonely
 * @Date         : 2022-01-16 15:10:54
 * @LastEditTime : 2022-01-16 15:53:44
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task-new/doc-sync.js
 * @Description  : 文档同步
 */

(async () => {
  /* eslint-disable @typescript-eslint/no-var-requires */
  const fs = require('fs-extra');
  const chalk = await import('chalk');

  const currentContext = fs.readFileSync('./doc/docs/logs/README.md').toString();
  const { version, change } = fs.readJSONSync('./package.json');
  const bigVersion = version.replace(/\.[\d]+(-[\w]+)?$/, '');

  if (currentContext.includes(`## V${version}`)) {
    return console.log(chalk.default.yellow('No new version!'));
  }

  if (currentContext.includes(`## V${bigVersion}`)) {
    fs.writeFileSync('./doc/docs/logs/README.md', currentContext.replace(`## V${bigVersion}`, `## V${bigVersion}

### V${version}

[Release](https://github.com/HCLonely/auto-task/releases/tag/v${version})

- ${change.join('\n- ').replace(/\(#([\d]+?)\)/g, '([#$1](https://github.com/HCLonely/auto-task/issues/$1))')}`));
  } else {
    fs.writeFileSync('./doc/docs/logs/README.md', currentContext.replace(/---[\s]+?##/, `---

## V${bigVersion}

### V${version}

[Release](https://github.com/HCLonely/auto-task/releases/tag/v${version})

- ${change.join('\n- ').replace(/\(#([\d]+?)\)/g, '([#$1](https://github.com/HCLonely/auto-task/issues/$1))')}

##`));
  }

  console.log(`Document updated ${chalk.default.green.bold('successfully')}!`);

})();
