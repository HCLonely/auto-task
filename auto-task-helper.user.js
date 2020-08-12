// ==UserScript==
// @name           自动任务辅助
// @name:en        Auto Task Helper
// @namespace      auto-task-helper
// @version        3.0.6
// @description    自动任务脚本的辅助脚本，用于获取discord auth
// @description:en Auxiliary script of automatic task script, used to obtain discord auth
// @author         HCLonely
// @license        MIT
// @iconURL        https://auto-task-test.hclonely.com/img/favicon.ico
// @homepage       https://blog.hclonely.com/posts/777c60d5/
// @supportURL     https://github.com/HCLonely/auto-task/issues/new/choose
// @updateURL      https://github.com/HCLonely/auto-task/raw/V3/auto-task-helper.user.js
// @include        *://discord.com/app
// @grant          unsafeWindow
// @run-at         document-start
// ==/UserScript==

(function () {
  unsafeWindow.discordAuth = window.localStorage.getItem('token')
})()