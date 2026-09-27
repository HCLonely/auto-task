# 网站模块

原 `src/scripts/website/` 已迁移至此目录。`index.ts` 导出 `Websites` 网站列表、各网站类、`Website` 基类、`websiteOptions` 和任务转换工具。

浏览器构建入口为 `browser.ts`，产物为 `dist/auto-task.website.js`，可通过用户脚本的 `@require` 加载：

```js
// @require https://github.com/HCLonely/auto-task/raw/main/dist/auto-task.modules.js
// @require https://github.com/HCLonely/auto-task/raw/main/dist/auto-task.website.js

const WebsiteClass = AutoTaskWebsite.Websites.find(Website => Website.test());
```

网站模块运行于浏览器用户脚本环境，沿用项目头部的第三方依赖、GM 授权和页面环境；上面两个 `@require` 应放在第三方依赖之后。加载只提供 API，主脚本负责网站识别、实例化及 UI 初始化。它不是供 Node.js 直接执行的 CommonJS 包。

网站实现继续复用 `src/scripts/` 中的配置、日志、工具和社交兼容层。浏览器入口同时暴露主脚本使用的共享运行时命名空间，构建时将主脚本的对应引用指向同一实例，避免配置和日志状态重复。

运行 `npm run test:modules` 构建并验证 `@require` 加载、网站导出、共享配置及三个全依赖版本的内嵌顺序。
