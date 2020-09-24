// ==UserScript==
// @name               自动任务辅助
// @name:en            Auto Task Helper
// @name:zh-CN         自动任务辅助
// @namespace          auto-task-helper
// @version            3.1.0
// @description        自动任务脚本的辅助脚本，用于获取discord auth
// @description:en     Auxiliary script of automatic task script, used to obtain discord auth
// @description:zh-CN  自动任务脚本的辅助脚本，用于获取discord auth
// @author             HCLonely
// @license            MIT
// @iconURL            https://auto-task-test.hclonely.com/img/favicon.ico
// @homepage           https://github.com/HCLonely/auto-task
// @supportURL         https://github.com/HCLonely/auto-task/issues/new/choose
// @updateURL          https://auto-task-test.hclonely.com/auto-task-helper.user.js
// @include            *://discord.com/app
// @grant              unsafeWindow
// @run-at             document-start
// ==/UserScript==

(function () {
  unsafeWindow.discordAuth = window.localStorage.getItem('token')
})()
