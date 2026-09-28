# 用户脚本模块

- [i18n](i18n/README.md)：独立翻译模块和语言包，入口为 `modules/i18n/index.ts`，UMD 产物为 `dist/auto-task.i18n.js`（`AutoTaskI18n`），支持 `require()` 和 `@require`。

- [social](social/README.md)：社交平台模块，统一源码入口为 `modules/social/index.ts`，浏览器产物为 `dist/auto-task.modules.js`（`AutoTaskModules`）。
- [website](website/README.md)：网站任务模块，统一源码入口为 `modules/website/index.ts`，浏览器产物为 `dist/auto-task.website.js`（`AutoTaskWebsite`）。

运行 `npm run rollup` 构建三个模块和主脚本。主脚本通过 `@require` 依次加载 i18n、社交模块和网站模块；全依赖版本按相同顺序内嵌产物。
