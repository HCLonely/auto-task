// ==UserScript==
// @name               自动任务__TEST__
// @name:en            Auto Task__TEST__
// @name:zh-CN         自动任务__TEST__
// @namespace          auto-task
// @version            __VERSION__
// @description        自动完成赠key站任务
// @description:en     Automatically complete giveaway tasks
// @description:zh-CN  自动完成赠key站任务
// @author             HCLonely
// @license            MIT
// @iconURL            https://__SITEURL__/img/favicon.ico
// @homepage           https://github.com/HCLonely/auto-task
// @supportURL         https://github.com/HCLonely/auto-task/issues/new/choose
// @updateURL          https://__SITEURL__/__FILENAME__

// @include            *://giveaway.su/giveaway/view/*
// @include            *://marvelousga.com/*
// @include            *://www.grabfreegame.com/giveaway/*
// @include            *://www.bananagiveaway.com/giveaway/*
// @include            /https?:\/\/gamehag.com\/.*?giveaway\/.*/
// @include            *://prys.revadike.com/giveaway/?id=*
// @include            *://www.indiedb.com/giveaways*
// @include            *://www.opiumpulses.com/giveaways
// @exclude            *://takekey.ru/distribution/*
// @include            *://*freegamelottery.com*
// @include            *://gleam.io/*
// @include            *://keylol.com/*
// @include            *://discord.com/app
// @include            *://www.twitch.tv/*
// @include            *://www.youtube.com/*
// @exclude            *googleads*
// @include            https://__SITEURL__/setting.html

// @require            https://cdn.jsdelivr.net/gh/HCLonely/auto-task@__VERSION__/require/require.min.js
// @resource           CSS https://cdn.jsdelivr.net/gh/HCLonely/auto-task@__VERSION__/require/fuck-task.min.css

// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_listValues
// @grant              GM_deleteValue
// @grant              GM_addStyle
// @grant              GM_xmlhttpRequest
// @grant              GM_getResourceText
// @grant              GM_registerMenuCommand
// @grant              GM_info
// @grant              GM_openInTab
// @grant              unsafeWindow
// @grant              window.close

// @connect            __SITEURL__
// @connect            cdn.jsdelivr.net
// @connect            store.steampowered.com
// @connect            steamcommunity.com
// @connect            twitter.com
// @connect            api.twitter.com
// @connect            youtube.com
// @connect            www.youtube.com
// @connect            facebook.com
// @connect            instagram.com
// @connect            vk.com
// @connect            twitch.tv
// @connect            www.twitch.tv
// @connect            gql.twitch.tv
// @connect            github.com
// @connect            discordapp.com
// @connect            discord.gg
// @connect            discord.com
// @connect            www.reddit.com
// @connect            oauth.reddit.com
// @connect            raw.githubusercontent.com
// @connect            *
// @run-at             document-end
// ==/UserScript==

/* eslint-disable no-unsafe-finally,no-void,camelcase,no-mixed-operators,promise/param-names,no-fallthrough,no-unused-vars,no-new,no-unused-expressions,no-sequences,no-undef-init,no-unused-vars,no-func-assign,no-eval */
/* global loadSettings,loadAnnouncement,regeneratorRuntime,checkClick,getURLParameter,showAlert,urlPath,checkUser,Centrifuge,DashboardApp,captchaCheck,commonOptions */
