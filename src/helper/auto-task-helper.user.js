// ==UserScript==
// @name               自动任务辅助
// @name:en            Auto Task Helper
// @name:zh-CN         自动任务辅助
// @namespace          auto-task-helper
// @version            __VERSION__
// @description        自动任务脚本的辅助脚本，用于获取discord auth
// @description:en     Auxiliary script of automatic task script, used to obtain discord auth
// @description:zh-CN  自动任务脚本的辅助脚本，用于获取discord auth
// @author             HCLonely
// @license            MIT
// @iconURL            https://__SITEURL__/img/favicon.ico
// @homepage           https://github.com/HCLonely/auto-task
// @supportURL         https://github.com/HCLonely/auto-task/issues/new/choose
// @updateURL          https://__SITEURL__/__FILENAME__
// @include            *://discord.com/*
// @grant              unsafeWindow
// @run-at             document-start
// @grant              window.localStorage
// ==/UserScript==

(function () {
  unsafeWindow.discordAuth = window.localStorage.getItem('token')
})()
