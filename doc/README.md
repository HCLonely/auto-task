## [auto-task](https://github.com/HCLonely/auto-task) 脚本的使用文档
## Documentation for the use of [auto-task](https://github.com/HCLonely/auto-task) scripts

## 本地开发与构建

请在完整的 `auto-task` 源码仓库中运行。TSDoc 生成需要上级目录中的 `src/`、`tsconfig.json`、`typedoc.json` 和根目录依赖，仅复制 `doc/` 目录无法生成 API 文档。

在仓库根目录执行：

```bash
npm ci
npm --prefix doc ci
npm --prefix doc run docs:dev
```

构建静态站点：`npm --prefix doc run docs:build`。

两条文档站命令都会先生成 API 文档。也可在根目录单独执行 `npm run docs:api`；开发服务器运行期间修改源码注释后，重新执行此命令并刷新页面。

文档入口为 `/tsdoc/`，完整 API 页面为 `/api/index.html`。生成目录 `docs/.vuepress/public/api/` 不提交 Git，VuePress 构建会将其复制到站点输出目录。若单独部署文档仓库，需要先在完整源码仓库生成 API，再一并同步生成目录。
