// ==UserScript==
// @name           自动任务
// @name:en        Auto Task__TEST__
// @namespace      auto-task
// @version        __VERSION__
// @description    自动完成赠key站任务
// @description:en Automatically complete giveaway tasks
// @author         HCLonely
// @license        MIT
// @iconURL        https://__SITEURL__/img/favicon.ico
// @homepage       https://blog.hclonely.com/posts/777c60d5/
// @supportURL     https://github.com/HCLonely/auto-task/issues/new/choose
// @updateURL      https://github.com/HCLonely/auto-task/raw/master/__FILENAME__

// @include        *://giveaway.su/giveaway/view/*
// @include        *://marvelousga.com/*
// @include        *://www.grabfreegame.com/giveaway/*
// @include        *://www.bananagiveaway.com/giveaway/*
// @exclude        /https?:\/\/gamehag.com\/.*?giveaway\/.*/
// @include        *://prys.revadike.com/giveaway/?id=*
// @include        *://www.indiedb.com/giveaways*
// @include        *://www.opiumpulses.com/giveaways
// @include        *://takekey.ru/distribution/*
// @include        *://*freegamelottery.com*
// @include        *://gleam.io/*
// @include        *://discord.com/app
// @include        *://www.twitch.tv/*
// @exclude        *googleads*
// @include        https://__SITEURL__/setting.html

// @require        https://cdn.jsdelivr.net/npm/js-cookie@rc/dist/js.cookie.min.js
// @require        https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @require        https://cdn.jsdelivr.net/npm/components-jqueryui@1.12.1/ui/effect.min.js
// @require        https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js
// @require        https://cdn.jsdelivr.net/gh/HCLonely/auto-task@__VERSION__/require/bootstrap.min.js
// @require        https://cdn.jsdelivr.net/npm/regenerator-runtime@0.13.5/runtime.min.js
// @require        https://cdn.jsdelivr.net/npm/sweetalert2@9
// @require        https://cdn.jsdelivr.net/npm/promise-polyfill@8.1.3/dist/polyfill.min.js
// @require        https://cdn.jsdelivr.net/gh/HCLonely/auto-task@__VERSION__/require/overhang.min.js
// @resource       CSS https://cdn.jsdelivr.net/gh/HCLonely/auto-task@__VERSION__/require/fuck-task.min.css

// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_deleteValue
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @grant          GM_getResourceText
// @grant          GM_registerMenuCommand
// @grant          GM_info
// @grant          GM_openInTab
// @grant          unsafeWindow
// @grant          window.close

// @connect        __SITEURL__
// @connect        cdn.jsdelivr.net
// @connect        store.steampowered.com
// @connect        steamcommunity.com
// @connect        twitter.com
// @connect        youtube.com
// @connect        facebook.com
// @connect        instagram.com
// @connect        vk.com
// @connect        twitch.tv
// @connect        www.twitch.tv
// @connect        github.com
// @connect        discordapp.com
// @connect        discord.gg
// @connect        discord.com
// @connect        www.reddit.com
// @connect        raw.githubusercontent.com
// @connect        *
// @run-at         document-end
// ==/UserScript==

/* eslint-disable no-unsafe-finally,no-void,camelcase,no-mixed-operators,promise/param-names,no-fallthrough,no-unused-vars,no-new,no-unused-expressions,no-sequences,no-undef-init,no-unused-vars,no-func-assign */
/* global loadSettings,loadAnnouncement,regeneratorRuntime,checkClick,getURLParameter,showAlert,urlPath,checkUser,Centrifuge,DashboardApp,captchaCheck,commonOptions */