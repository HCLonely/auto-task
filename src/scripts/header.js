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
// @homepage           https://auto-task-doc.js.org
// @supportURL         https://github.com/HCLonely/auto-task/issues/new/choose
// @updateURL          https://__SITEURL__/__FILENAME__
// @downloadURL        https://__SITEURL__/__FILENAME__

// @include            *://giveaway.su/giveaway/view/*
// @include            *://marvelousga.com/*
// @include            *://www.grabfreegame.com/giveaway/*
// @include            *://www.bananagiveaway.com/giveaway/*
// @include            *://prys.revadike.com/giveaway/?id=*
// @include            *://www.indiedb.com/giveaways*
// @include            *://www.opiumpulses.com/giveaways
// @include            *://takekey.ru/distribution/*
// @include            *://*freegamelottery.com*
// @include            *://gleam.io/*
// @include            *://keylol.com/*
// @include            *://givekey.ru/giveaway/*
// @include            *://key-hub.eu/giveaway/*
// @include            *://freeanywhere.net/*
// @include            *://discord.com/*
// @include            *://www.twitch.tv/*
// @include            *://www.youtube.com/*
// @include            *://twitter.com/settings/account?k*
// @exclude            *googleads*
// @include            https://__SITEURL__/setting.html
// @include            https://__SITEURL__/notice-list.html

// @require            https://cdn.jsdelivr.net/gh/HCLonely/auto-task@__VERSION__/require/require.min.js#md5=__JSMD5__
// @resource           CSS https://cdn.jsdelivr.net/gh/HCLonely/auto-task@__VERSION__/require/fuck-task.min.css#md5=__CSSMD5__

// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_listValues
// @grant              GM_deleteValue
// @grant              GM_addValueChangeListener
// @grant              GM_addStyle
// @grant              GM_xmlhttpRequest
// @grant              GM_getResourceText
// @grant              GM_registerMenuCommand
// @grant              GM_info
// @grant              GM_openInTab
// @grant              GM_notification
// @grant              unsafeWindow
// @grant              window.close
// @grant              window.localStorage

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
// @connect            t.me
// @connect            bit.ly
// @connect            giveaway.su
// @connect            google.com
// @connect            *
// @run-at             document-end
// ==/UserScript==

/* eslint-disable no-unsafe-finally,no-void,camelcase,no-mixed-operators,no-fallthrough,no-unused-vars,no-new,no-unused-expressions,no-sequences,no-undef-init,no-unused-vars,no-func-assign,no-eval,multiline-ternary */
/* esling-disable security/detect-non-literal-fs-filename */
/* global loadSettings,loadAnnouncement,regeneratorRuntime,checkClick,getURLParameter,showAlert,urlPath,checkUser,Centrifuge,DashboardApp,captchaCheck,commonOptions,VerifyTasks */
