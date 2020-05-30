// ==UserScript==
// @name           自动任务预览版
// @name:en        Auto Task Preview Edition
// @namespace      auto-task
// @version        pre-3.0.0
// @description    自动完成赠key站任务
// @description:en Automatically complete giveaway tasks
// @author         HCLonely
// @license        MIT
// @iconURL        https://cdn.jsdelivr.net/gh/HCLonely/auto-task@preview/favicon.ico
// @homepage       https://blog.hclonely.com/posts/777c60d5/
// @supportURL     https://github.com/HCLonely/auto-task/issues/new/choose
// @updateURL      https://github.com/HCLonely/auto-task/raw/preview/auto-task.user.js
// @include        *://giveaway.su/giveaway/view/*
// @include        *://marvelousga.com/*
// @include        *://dupedornot.com/*
// @include        *://www.grabfreegame.com/giveaway/*
// @include        *://www.bananagiveaway.com/giveaway/*
// @include        /https?:\/\/gamehag.com\/.*?giveaway\/.*/
// @include        *://prys.revadike.com/giveaway/?id=*
// @include        *://www.indiedb.com/giveaways*
// @include        *://www.opiumpulses.com/giveaways
// @include        *://gkey.fun/distribution/*
// @include        *://givekey.ru/distribution/*
// @include        *://takekey.ru/distribution/*
// @include        *://chubkeys.com/giveaway/*
// @include        *://giveawayhopper.com/giveaway/*
// @include        *://*freegamelottery.com*
// @include        *://gleam.io/*
// @include        *://www.spoune.com/index.php*
// @exclude        *googleads*
// @include        https://auto-task.hclonely.com/setting.html
// @include        https://auto-task.hclonely.com/announcement.html

// @require        https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js
// @require        https://cdn.jsdelivr.net/npm/element-ui@2.12.0/lib/index.min.js

// @require        https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @require        https://cdn.jsdelivr.net/npm/regenerator-runtime@0.13.5/runtime.min.js
// @require        https://cdn.jsdelivr.net/npm/sweetalert2@9
// @require        https://cdn.jsdelivr.net/npm/promise-polyfill
// @resource       autoTaskCss https://cdn.jsdelivr.net/gh/HCLonely/auto-task@preview/lib/auto-task.min.css
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
// @connect        auto-task.hclonely.com
// @connect        cdn.jsdelivr.net
// @connect        store.steampowered.com
// @connect        steamcommunity.com
// @connect        twitter.com
// @connect        youtube.com
// @connect        facebook.com
// @connect        instagram.com
// @connect        vk.com
// @connect        discordapp.com
// @connect        github.com
// @connect        twitch.tv
// @connect        *
// @run-at         document-end
// ==/UserScript==

/* global loadSetting,loadAnnouncement,$,Vue,regeneratorRuntime,checkClick,getURLParameter,showAlert,urlPath,checkUser,Centrifuge,DashboardApp,captchaCheck */
/* eslint-disable no-unsafe-finally,no-void,camelcase,no-mixed-operators,promise/param-names,no-fallthrough,no-unused-vars,no-new,no-unused-expressions,no-sequences */

function _defineProperty (obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }) } else { obj[key] = value } return obj }

function asyncGeneratorStep (gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value } catch (error) { reject(error); return } if (info.done) { resolve(value) } else { Promise.resolve(value).then(_next, _throw) } }

function _asyncToGenerator (fn) { return function () { var self = this; var args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next (value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value) } function _throw (err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err) } _next(undefined) }) } }

function _createForOfIteratorHelper (o) { if (typeof Symbol === 'undefined' || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F () {}; return { s: F, n: function n () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] } }, e: function e (_e) { throw _e }, f: F } } throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') } var it; var normalCompletion = true; var didErr = false; var err; return { s: function s () { it = o[Symbol.iterator]() }, n: function n () { var step = it.next(); normalCompletion = step.done; return step }, e: function e (_e2) { didErr = true; err = _e2 }, f: function f () { try { if (!normalCompletion && it.return != null) it.return() } finally { if (didErr) throw err } } } }

function _toConsumableArray (arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread() }

function _nonIterableSpread () { throw new TypeError('Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

function _unsupportedIterableToArray (o, minLen) { if (!o) return; if (typeof o === 'string') return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor) n = o.constructor.name; if (n === 'Map' || n === 'Set') return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen) }

function _iterableToArray (iter) { if (typeof Symbol !== 'undefined' && Symbol.iterator in Object(iter)) return Array.from(iter) }

function _arrayWithoutHoles (arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr) }

function _arrayLikeToArray (arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2 }

(function () {
  'use strict'

  var i18n = {
    'zh-cn': {
      language: '语言',
      auto: '自动',
      needBanana: '此key需要收集 s% 个香蕉, 是否继续?',
      needPoints: '此key需要收集 s% , 是否继续?',
      notice: '提示',
      confirm: '确定',
      cancel: '取消',
      canceled: '已取消',
      processTasksInfo: '正在处理任务信息...',
      processTasksUrl: '正在处理任务链接（用时取决于Steam任务数量，请耐心等待）...',
      getTasksInfo: '正在获取任务信息...',
      allTasksComplete: '所有任务已完成！',
      prysAllTasksComplete: '所有任务验证完成，请手动完成人机验证获取key!',
      verifyTasksComplete: '所有任务验证完成！',
      verifyingTask: '正在验证任务',
      noKeysLeft: '此页面已经没有剩余key了, 是否关闭?',
      logining: '正在登录...',
      needLogin: '请先登录！',
      fglTimeout: '正在 s% (如果长时间没反应，请打开控制台查看错误日志)...',
      fglComplete: '任务完成，正在刷新页面（如果页面没有自动刷新，请手动刷新查看结果）...',
      checkingUpdate: '正在检测更新...',
      checkUpdate: '检查更新',
      thisIsNew: '当前脚本为最新版本！',
      updateNow: '立即更新至 ',
      newVer: '检测到新版本: ',
      getAnnouncement: '正在获取更新公告...',
      visitHistory: '查看历史更新内容',
      close: '关闭',
      websiteSetting: '网站设置',
      updateCommunityId: '正在更新Steam社区SessionID(用于加组退组)...',
      updateStoreId: '正在更新Steam商店SessionID(用于添加愿望单、关注游戏、关注鉴赏家等)...',
      loginSteamCommunity: '请先登录<a href="https://steamcommunity.com/login/home" target="_blank">Steam社区</a>',
      loginSteamStore: '请先登录<a href="https://store.steampowered.com/login" target="_blank">Steam商店</a>',
      joinGroup: '正在加入Steam组',
      getGroupId: '正在获取Steam组ID',
      leaveGroup: '正在退出Steam组',
      followCurator: '正在关注鉴赏家',
      unfollowCurator: '正在取关鉴赏家',
      getDeveloperId: '正在获取开发商ID',
      followDeveloper: '正在关注开发商',
      unfollowDeveloper: '正在取关开发商',
      getPublisherId: '正在获取发行商ID',
      followPublisher: '正在关注发行商',
      unfollowPublisher: '正在取关发行商',
      addWishlist: '正在添加愿望单',
      removeWishlist: '正在移除愿望单',
      followGame: '正在关注游戏',
      unfollowGame: '正在取关游戏',
      likeAnnouncements: '正在点赞通知',
      visitLink: '正在访问页面',
      unknown: '未知操作',
      joinGiveaway: '正在加入赠key...',
      needJoinGiveaway: '请检查是否已加入此赠key!',
      doing: '正在做任务',
      unknowntype: '未知任务类型',
      getIdFailed: '获取任务id失败！',
      loadAnnouncementFailed: '加载公告失败',
      checkConsole: '，详情请查看控制台',
      setting: '设置',
      visitUpdateText: '查看更新内容',
      cleanCache: '清理缓存',
      feedback: '提交建议/BUG',
      cleaning: '正在清理缓存...',
      readme: '脚本说明',
      updateSteamInfo: '更新Steam信息',
      updateSteamInfoComplete: 'Steam信息更新完成',
      cannotRemove: '没有可以移除的任务！',
      joinLotteryComplete: '所有抽奖参加完成！',
      noPoints: '点数不足，任务中止！',
      getNeedPointsFailed: '获取抽奖需要点数失败，任务中止！',
      joinLottery: '正在参加抽奖',
      pointsLeft: '剩余点数: ',
      getPointsFailed: '获取当前拥有点数失败！',
      joinFreeLottery: '参加免费抽奖',
      joinPointLottery: '参加点数抽奖',
      getTaskIdFailed: '获取 s% 任务id失败!',
      noAutoFinish: '没有检测到可以自动完成的任务！',
      finishSelf: '没完成的请手动完成！',
      getUrlFailed: '获取任务链接失败( s% )',
      closeExtensions: '建议关闭脚本管理器和广告屏蔽插件再获取key！',
      changeLanguage: '需要将页面语言设置为"English"或"Русский"(将页面右下角的自动翻译关闭)！如果已设置，请忽视本条信息',
      gkrobot: '请在弹出的页面完成验证（如果有的话），然后关闭页面',
      connectWss: '正在连接WSS...',
      connectWssWait: '正在连接WSS, 请稍候！',
      beforeFuck: '每次点击"Fuck"按钮前请手动完成人机验证！！！',
      getTaskStatus: '正在获取任务完成状态(时间稍长，请耐心等待)...',
      wssConnected: 'WSS已连接!',
      wssConnectSuccess: 'WSS连接成功',
      wssDisconnected: 'WSS连接断开！',
      wssReconnect: 'WSS连接断开，正在重连...',
      noLogin: '您尚未登录！',
      accessDenied: '访问被拒绝！',
      notFound: '错误，找不到页面！',
      serverError: '服务器错误！',
      errorRefresh: '错误，请刷新页面！',
      initFirst: '请先Init再做任务！',
      initPlease: '请先点击Init按钮再点此按钮！',
      getGroupFailed: '获取Steam组信息失败！',
      openPage: '已打开任务页面',
      getTaskUrlFailed: '获取任务链接失败',
      notRobot: '触发人机验证，请完成验证后再点击"Verify"按钮验证任务！',
      getVisitTimeFailed: '获取浏览时间失败',
      doYourself: '请手动完成',
      googleVerify: '谷歌验证',
      getKey: '获取key',
      fuckBtnTitle: '一键做任务+验证',
      verifyBtnTitle: '一键验证任务',
      joinBtnTitle: '一键加组、关注鉴赏家、关注游戏、添加愿望单...',
      removeBtnTitle: '一键退组、取关鉴赏家、取关游戏、移除愿望单...',
      showLog: '显示执行日志',
      hideLog: '隐藏执行日志',
      show: '展开',
      hide: '收起',
      taskLog: '任务执行日志',
      saveSetting: '保存设置',
      saveSuccess: '保存成功',
      resetSetting: '重置所有设置',
      resetSettingNotice: '是否重置所有设置?',
      resetSettingSuccess: '重置成功',
      resetSettingFailed: '重置失败',
      resetSettingCancel: '已取消重置',
      downloadSetting: '下载设置文件',
      processSetting: '正在处理设置...',
      creatUrlFailed: '创建下载链接失败！',
      jsError: '脚本执行出错，详细信息请查看控制台(红色背景部分)！',
      ajaxError: 'Ajax请求出错'
    },
    en: {
      language: 'Language',
      auto: 'Auto',
      needBanana: 'This key needs to collect s% banana, do you want to continue?',
      needPoints: 'This key needs to collect s%, do you want to continue?',
      notice: 'Notice',
      confirm: 'OK',
      cancel: 'Cancel',
      cancelled: 'Cancelled',
      processTasksInfo: 'Processing task information...',
      processTasksUrl: 'Processing task link (time depends on the number of Steam tasks, please be patient)...',
      getTasksInfo: 'Getting task information...',
      allTasksComplete: 'All tasks completed!',
      prysAllTasksComplete: 'All tasks are verified, please complete the man-machine verification to get the key!',
      verifyTasksComplete: 'All tasks verified!',
      verifyingTask: 'Verifying task',
      noKeysLeft: 'This page has no remaining keys, do you want to close?',
      logining: 'Logining...',
      needLogin: 'Login please!',
      fglTimeout: 'Doing "s%" (If there is no response for a long time, please open the console to view the error log)...',
      fglComplete: 'The task is completed and the page is being refreshed (if the page does not refresh automatically, please refresh it manually to view the results)...',
      checkingUpdate: 'Checking for updates...',
      checkUpdate: 'Check for updates',
      thisIsNew: 'The current script is the latest version!',
      updateNow: 'Update to ',
      newVer: 'New version available: ',
      getAnnouncement: 'Getting update announcement...',
      visitHistory: 'History',
      close: 'Close',
      websiteSetting: ' website settings',
      updateCommunityId: 'Updating Steam Community SessionID (for joining and leaving groups)...',
      updateStoreId: 'Updating Steam Store SessionID (for adding to wishlist, following game, following curator, etc.)...',
      loginSteamCommunity: 'Please log in to the <a href="https://steamcommunity.com/login/home" target="_blank">Steam Community</a>.',
      loginSteamStore: 'Please log in to the <a href="https://store.steampowered.com/login" target="_blank">Steam Store</a>.',
      joinGroup: 'Joining the Steam group',
      getGroupId: 'Getting Steam group ID',
      leaveGroup: 'Leaving Steam group',
      followCurator: 'Following curator',
      unfollowCurator: 'Unfollowing curator',
      getDeveloperId: 'Getting developer ID',
      followDeveloper: 'Following developer',
      unfollowDeveloper: 'Unfollowing developer',
      getPublisherId: 'Getting publisher ID',
      followPublisher: 'Following publisher',
      unfollowPublisher: 'Unfollowing publisher',
      addWishlist: 'Adding to wishlist',
      removeWishlist: 'Removing from wishlist',
      followGame: 'Following game',
      unfollowGame: 'Unfollowing gema',
      likeAnnouncements: 'Liking announcement',
      visitLink: 'Visiting page',
      unknown: 'Unknown operation',
      joinGiveaway: 'Joining giveaway...',
      needJoinGiveaway: 'Please check if this giveaway has been joined!',
      doing: 'Doing task',
      unknowntype: 'Unknown task type',
      getIdFailed: 'Failed to get task id!',
      loadAnnouncementFailed: 'Loading announcement failed',
      checkConsole: ', see console for details',
      setting: 'Setting',
      visitUpdateText: 'View updates',
      cleanCache: 'Clear cache',
      feedback: 'Feedback',
      cleaning: 'Clearing cache...',
      readme: 'Script description',
      updateSteamInfo: 'Update Steam Information',
      updateSteamInfoComplete: 'Steam information update completed',
      cannotRemove: 'No tasks can be removed!',
      joinLotteryComplete: 'All giveaways have been joined!',
      noPoints: 'Not enough points, task aborted!',
      getNeedPointsFailed: 'Failed to get points for joining giveaway, task aborted!',
      joinLottery: 'Joining giveaway',
      pointsLeft: 'Points remaining: ',
      getPointsFailed: 'Failed to get points currently owned!',
      joinFreeLottery: 'Join free giveaway',
      joinPointLottery: 'Join points giveaway',
      getTaskIdFailed: 'Failed to get s% task id!',
      noAutoFinish: 'No tasks detected that could be done automatically!',
      finishSelf: 'Unfinished tasks please do it yourself!',
      getUrlFailed: 'Failed to get task link( s% )',
      closeExtensions: 'It is recommended to close the script manager and the ad blocking plugin before obtaining the key!',
      changeLanguage: 'Need to set the page language to "English" or "Русский" (Turn off automatic translation in the bottom right corner of the page)! If it is set to "English" or "Русский", please ignore this message.',
      gkrobot: 'Please complete the verification on the pop-up page (if any), and then close the page.',
      connectWss: 'Connecting to WSS...',
      connectWssWait: 'Connecting to WSS, please wait!',
      beforeFuck: 'Please complete the verification before clicking the "Fuck" button!!!',
      getTaskStatus: 'Getting task completion status (a little longer, please be patient)...',
      wssConnected: 'WSS is connected!',
      wssConnectSuccess: 'WSS connection succeeded',
      wssDisconnected: 'WSS is disconnected!',
      wssReconnect: 'WSS is disconnected, reconnecting...',
      noLogin: 'You have not logged in!',
      accessDenied: 'Access denied!',
      notFound: 'Error, page not found!',
      serverError: 'Server error!',
      errorRefresh: 'Error, please refresh the page!',
      initFirst: 'Please Init before doing the task!',
      initPlease: 'Please click the Init button before clicking this button!',
      getGroupFailed: 'Failed to get Steam group information!',
      openPage: 'Task page opened',
      getTaskUrlFailed: 'Failed to get task link',
      notRobot: 'Trigger human-machine verification, please complete the verification and then click the "Verify" button to verify the task',
      getVisitTimeFailed: 'Failed to get visit time',
      doYourself: 'Please complete ',
      googleVerify: 'Google verification',
      getKey: ' to get key',
      fuckBtnTitle: 'Complete and verify tasks',
      verifyBtnTitle: 'Verify tasks',
      joinBtnTitle: 'Join group, follow curator, follow game, add to wishlist...',
      removeBtnTitle: 'Leave group, unfollow curator, unfollow game, remove from wishlist...',
      showLog: 'Show execution log',
      hideLog: 'Hide execution log',
      show: 'Show',
      hide: 'Hide',
      taskLog: 'Task execution log',
      saveSetting: 'Save settings',
      saveSuccess: 'Saved successfully',
      resetSetting: 'Reset all settings',
      resetSettingNotice: 'Do you want to reset all settings?',
      resetSettingSuccess: 'Reset succeeded',
      resetSettingFailed: 'Reset failed',
      resetSettingCancel: 'Canceled reset',
      downloadSetting: 'Download the settings file',
      processSetting: 'Processing settings...',
      jsError: 'Script execution error, please see the console for details (red background part)!',
      ajaxError: 'Ajax request error'
    }
  }
  var language = getLanguage()

  function getLanguage () {
    var lan = GM_getValue('language') || 'auto'

    if (lan === 'auto') {
      var _navigator, _navigator2

      var browserLanguage = (((_navigator = navigator) === null || _navigator === void 0 ? void 0 : _navigator.browserLanguage) || ((_navigator2 = navigator) === null || _navigator2 === void 0 ? void 0 : _navigator2.language) || '').toLowerCase()
      lan = browserLanguage.includes('en') ? 'en' : 'zh-cn'
    }

    return lan
  }

  function getI18n (name) {
    var str = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null
    var value = 'null'
    if (str) value = i18n[language][name] ? i18n[language][name].replace('s%', str) : 'null'; else value = i18n[language][name] || 'null'
    return value
  }

  GM_addStyle(GM_getResourceText('css'))
  $('body').append('<div v-cloak id="vue-ui"></div>')
  var vueUi = new Vue({
    el: '#vue-ui'
  })

  Vue.config.errorHandler = function (err, vm, info) {
    setTimeout(function () {
      vueUi.$message({
        type: 'error',
        duration: 0,
        message: getI18n('jsError'),
        showClose: true
      })
    }, 500)
    console.log('%c%s', 'color:white;background:red', 'Info:' + info + '\nError:' + err.stack)
  }

  $(document).ajaxError(function (event, xhr, options, exc) {
    vueUi.$message({
      type: 'error',
      duration: 0,
      message: getI18n('jsError'),
      showClose: true
    })
    console.log('%c%s', 'color:white;background:red', getI18n('ajaxError') + '：')
    console.log('Event:', event)
    console.log('XMLHttpRequest :', xhr)
    console.log('Options:', options)
    console.log('JavaScript exception:', exc)
  })

  try {
    var _config$banana, _GM_getValue, _GM_getValue$freegame, _GM_getValue2, _GM_getValue3, _GM_getValue3$gamehag, _GM_getValue4, _config$giveawaysu, _GM_getValue5, _GM_getValue5$givekey, _GM_getValue6, _GM_getValue7, _GM_getValue8, _GM_getValue8$gleam, _GM_getValue9, _GM_getValue10, _GM_getValue10$indied, _GM_getValue11, _GM_getValue12, _GM_getValue12$marvel, _GM_getValue13, _GM_getValue14, _GM_getValue14$opiump, _GM_getValue15, _GM_getValue16, _GM_getValue16$prys, _GM_getValue17, _GM_getValue18, _GM_getValue18$spoune, _GM_getValue19, _GM_getValue20, _GM_getValue20$takeke, _GM_getValue21

    var steamInfo = Object.assign({
      userName: '',
      steam64Id: '',
      communitySessionID: '',
      storeSessionID: '',
      updateTime: 0
    }, GM_getValue('steamInfo'))
    var defaultConf = {
      fuck: {
        joinSteamGroup: true,
        followCurator: true,
        followDeveloper: true,
        followPublisher: true,
        likeAnnouncement: true,
        addToWishlist: true,
        followGame: true,
        visitLink: true,
        verifyTask: true,
        doTask: true,
        autoLogin: false
      },
      verify: {
        verifyTask: true
      },
      remove: {
        leaveSteamGroup: true,
        unfollowCurator: true,
        unfollowDeveloper: true,
        unfollowPublisher: true,
        removeFromWishlist: true,
        unfollowGame: true
      },
      other: {
        showLogs: true,
        showDetails: false,
        checkLogin: true,
        checkLeft: true,
        autoOpen: false,
        reCaptcha: false
      },
      announcement: ''
    }
    var config = Object.assign(defaultConf, GM_getValue('conf') || {})
    var globalConf = config.global
    var debug = !!globalConf.other.showDetails
    var fuc = {
      httpRequest: function httpRequest (e) {
        e.method = e.method.toUpperCase()
        if (e.dataType) e.responseType = e.dataType
        var requestObj = Object.assign({
          timeout: 30000,
          ontimeout: function ontimeout (data) {
            if (debug) console.log(data)
            if (e.status) e.status.error('Error:Timeout(0)')
            if (e.r) {
              e.r({
                result: 'error',
                statusText: 'Timeout',
                status: 0,
                option: e
              })
            }
          },
          onabort: function onabort (data) {
            if (debug) console.log(data)
            if (e.status) e.status.error('Error:Aborted(0)')
            if (e.r) {
              e.r({
                result: 'error',
                statusText: 'Aborted',
                status: 0,
                option: e
              })
            }
          },
          onerror: function onerror (data) {
            if (debug) console.log(data)
            if (e.status) e.status.error('Error:Error(0)')
            if (e.r) {
              e.r({
                result: 'error',
                statusText: 'Error',
                status: 0,
                option: e
              })
            }
          }
        }, e)
        if (debug) console.log('发送请求:', requestObj)
        GM_xmlhttpRequest(requestObj)
      },
      updateSteamInfo: function updateSteamInfo (r) {
        var _this = this

        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'all'
        var update = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false

        if (new Date().getTime() - steamInfo.updateTime > 10 * 60 * 1000 || update) {
          var pro = []

          if (type === 'community' || type === 'all') {
            pro.push(new Promise(function (resolve, reject) {
              var status = _this.echoLog({
                type: 'updateSteamCommunity'
              })

              _this.httpRequest({
                url: 'https://steamcommunity.com/my',
                method: 'GET',
                onload: function onload (response) {
                  if (debug) console.log(response)

                  if (response.status === 200) {
                    if ($(response.responseText).find('a[href*="/login/home"]').length > 0) {
                      status.error('Error:' + getI18n('loginSteamCommunity'), true)
                      reject(Error('Not Login'))
                    } else {
                      var steam64Id = response.responseText.match(/g_steamID = "(.+?)";/)
                      var communitySessionID = response.responseText.match(/g_sessionID = "(.+?)";/)
                      var userName = response.responseText.match(/steamcommunity.com\/id\/(.+?)\/friends\//)
                      if (steam64Id) steamInfo.steam64Id = steam64Id[1]
                      if (communitySessionID) steamInfo.communitySessionID = communitySessionID[1]
                      if (userName) steamInfo.userName = userName[1]
                      status.success()
                      resolve()
                    }
                  } else {
                    status.error('Error:' + response.statusText + '(' + response.status + ')')
                    reject(Error('Request Failed'))
                  }
                },
                r: resolve,
                status: status
              })
            }))
          }

          if (type === 'store' || type === 'all') {
            pro.push(new Promise(function (resolve, reject) {
              var status = _this.echoLog({
                type: 'updateSteamStore'
              })

              _this.httpRequest({
                url: 'https://store.steampowered.com/stats/',
                method: 'GET',
                onload: function onload (response) {
                  if (debug) console.log(response)

                  if (response.status === 200) {
                    if ($(response.responseText).find('a[href*="/login/"]').length > 0) {
                      status.error('Error:' + getI18n('loginSteamStore'), true)
                      reject(Error('Not Login'))
                    } else {
                      var storeSessionID = response.responseText.match(/g_sessionID = "(.+?)";/)
                      if (storeSessionID) steamInfo.storeSessionID = storeSessionID[1]
                      status.success()
                      resolve()
                    }
                  } else {
                    status.error('Error:' + response.statusText + '(' + response.status + ')')
                    reject(Error('Request Failed'))
                  }
                },
                r: resolve,
                status: status
              })
            }))
          }

          Promise.all(pro).then(function () {
            steamInfo.updateTime = new Date().getTime()
            GM_setValue('steamInfo', steamInfo)
            r(1)
          }).catch(function (err) {
            console.error(err)
          })
        } else {
          r(1)
        }
      },
      joinSteamGroup: function joinSteamGroup (r, group) {
        var status = this.echoLog({
          type: 'joinSteamGroup',
          text: group
        })
        this.httpRequest({
          url: 'https://steamcommunity.com/groups/' + group,
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: $.param({
            action: 'join',
            sessionID: steamInfo.communitySessionID
          }),
          onload: function onload (response) {
            if (debug) console.log(response)

            if (response.status === 200 && !response.responseText.includes('grouppage_join_area')) {
              status.success()
              r({
                result: 'success',
                statusText: response.statusText,
                status: response.status
              })
            } else {
              status.error('Error:' + response.statusText + '(' + response.status + ')')
              r({
                result: 'error',
                statusText: response.statusText,
                status: response.status
              })
            }
          },
          r: r,
          status: status
        })
      },
      getGroupID: function getGroupID (groupName, callback) {
        var _this2 = this

        var status = this.echoLog({
          type: 'getGroupId',
          text: groupName
        })
        var groupNameToId = GM_getValue('groupNameToId') || {}

        if (groupNameToId[groupName]) {
          status.success()
          callback(groupName, groupNameToId[groupName])
        } else {
          new Promise(function (resolve) {
            _this2.httpRequest({
              url: 'https://steamcommunity.com/groups/' + groupName,
              method: 'GET',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
              },
              onload: function onload (response) {
                if (debug) console.log(response)

                if (response.status === 200) {
                  var groupId = response.responseText.match(/OpenGroupChat\( '([0-9]+)'/)

                  if (groupId === null) {
                    status.error('Error:' + response.statusText + '(' + response.status + ')')
                    resolve(false)
                  } else {
                    status.success()
                    groupNameToId[groupName] = groupId[1]
                    GM_setValue('groupNameToId', groupNameToId)
                    resolve(groupId[1])
                  }
                } else {
                  status.error('Error:' + response.statusText + '(' + response.status + ')')
                  resolve(false)
                }
              },
              status: status,
              r: function r () {
                resolve(false)
              }
            })
          }).then(function (groupId) {
            if (groupId !== false && callback) callback(groupName, groupId)
          }).catch(function (err) {
            console.error(err)
          })
        }
      },
      leaveSteamGroup: function leaveSteamGroup (r, groupName) {
        var _this3 = this

        this.getGroupID(groupName, function (groupName, groupId) {
          var status = _this3.echoLog({
            type: 'leaveSteamGroup',
            text: groupName
          })

          _this3.httpRequest({
            url: 'https://steamcommunity.com/id/' + steamInfo.userName + '/home_process',
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: $.param({
              sessionID: steamInfo.communitySessionID,
              action: 'leaveGroup',
              groupId: groupId
            }),
            onload: function onload (response) {
              if (debug) console.log(response)

              if (response.status === 200 && response.finalUrl.includes('groups') && $(response.responseText.toLowerCase()).find("a[href='https://steamcommunity.com/groups/".concat(groupName.toLowerCase(), "']")).length === 0) {
                status.success()
                r({
                  result: 'success',
                  statusText: response.statusText,
                  status: response.status
                })
              } else {
                status.error('Error:' + response.statusText + '(' + response.status + ')')
                r({
                  result: 'error',
                  statusText: response.statusText,
                  status: response.status
                })
              }
            },
            r: r,
            status: status
          })
        })
      },
      followCurator: function followCurator (r, curatorId) {
        var follow = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '1'
        var status = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ''
        status = status || this.echoLog({
          type: follow === '1' ? 'followCurator' : 'unfollowCurator',
          text: curatorId
        })
        this.httpRequest({
          url: 'https://store.steampowered.com/curators/ajaxfollow',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: $.param({
            clanid: curatorId,
            sessionid: steamInfo.storeSessionID,
            follow: follow
          }),
          dataType: 'json',
          onload: function onload (response) {
            var _response$response, _response$response$su

            if (debug) console.log(response)

            if (response.status === 200 && (response === null || response === void 0 ? void 0 : (_response$response = response.response) === null || _response$response === void 0 ? void 0 : (_response$response$su = _response$response.success) === null || _response$response$su === void 0 ? void 0 : _response$response$su.success) === 1) {
              status.success()
              r({
                result: 'success',
                statusText: response.statusText,
                status: response.status
              })
            } else {
              var _response$response2, _response$response3

              status.error('Error:'.concat(((_response$response2 = response.response) === null || _response$response2 === void 0 ? void 0 : _response$response2.msg) || response.statusText, '(').concat(((_response$response3 = response.response) === null || _response$response3 === void 0 ? void 0 : _response$response3.success) || response.status, ')'))
              r({
                result: 'error',
                statusText: response.statusText,
                status: response.status
              })
            }
          },
          r: r,
          status: status
        })
      },
      unfollowCurator: function unfollowCurator (r, curatorId) {
        this.followCurator(r, curatorId, '0')
      },
      getCuratorID: function getCuratorID (developerName, callback) {
        var _this4 = this

        var isPublisher = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0
        var status = this.echoLog({
          type: isPublisher ? 'getPublisherId' : 'getDeveloperId',
          text: developerName
        })
        var developerNameToId = GM_getValue('developerNameToId') || {}

        if (developerNameToId[developerName]) {
          status.success()
          callback(developerName, developerNameToId[developerName])
        } else {
          new Promise(function (resolve) {
            _this4.httpRequest({
              url: 'https://store.steampowered.com/'.concat(isPublisher ? 'publisher' : 'developer', '/').concat(developerName),
              method: 'GET',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
              },
              onload: function onload (response) {
                if (debug) console.log(response)

                if (response.status === 200) {
                  var developerId = response.responseText.match(/g_pagingData.*?"clanid":([\d]+)/)

                  if (developerId === null) {
                    status.error('Error:' + response.statusText + '(' + response.status + ')')
                    resolve(false)
                  } else {
                    status.success()
                    developerNameToId[developerName] = developerId[1]
                    GM_setValue('developerNameToId', developerNameToId)
                    resolve(developerId[1])
                  }
                } else {
                  status.error('Error:' + response.statusText + '(' + response.status + ')')
                  resolve(false)
                }
              },
              status: status,
              r: function r () {
                resolve(false)
              }
            })
          }).then(function (curatorId) {
            if (curatorId !== false && callback) callback(developerName, curatorId)
          }).catch(function (err) {
            console.error(err)
          })
        }
      },
      followDeveloper: function followDeveloper (r, developerName) {
        var _this5 = this

        var isPublisher = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0
        this.getCuratorID(developerName, function (developerName, curatorId) {
          var status = _this5.echoLog({
            type: isPublisher ? 'followPublisher' : 'followDeveloper',
            text: developerName
          })

          _this5.followCurator(r, curatorId, '1', status)
        }, isPublisher)
      },
      unfollowDeveloper: function unfollowDeveloper (r, developerName) {
        var _this6 = this

        var isPublisher = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0
        this.getCuratorID(developerName, function (developerName, curatorId) {
          var status = _this6.echoLog({
            type: isPublisher ? 'unfollowPublisher' : 'unfollowDeveloper',
            text: developerName
          })

          _this6.followCurator(r, curatorId, '0', status)
        }, isPublisher)
      },
      followPublisher: function followPublisher (r, publisherName) {
        this.followDeveloper(r, publisherName, 1)
      },
      unfollowPublisher: function unfollowPublisher (r, publisherName) {
        this.unfollowDeveloper(r, publisherName, 1)
      },
      addWishlist: function addWishlist (r, gameId) {
        var _this7 = this

        var status = this.echoLog({
          type: 'addWishlist',
          text: gameId
        })
        new Promise(function (resolve) {
          _this7.httpRequest({
            url: 'https://store.steampowered.com/api/addtowishlist',
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: $.param({
              sessionid: steamInfo.storeSessionID,
              appid: gameId
            }),
            dataType: 'json',
            onload: function onload (response) {
              var _response$response4

              if (debug) console.log(response)

              if (response.status === 200 && ((_response$response4 = response.response) === null || _response$response4 === void 0 ? void 0 : _response$response4.success) === true) {
                status.success()
                resolve({
                  result: 'success',
                  statusText: response.statusText,
                  status: response.status
                })
              } else {
                resolve({
                  result: 'error',
                  statusText: response.statusText,
                  status: response.status
                })
              }
            },
            onabort: function onabort (response) {
              resolve({
                result: 'error',
                statusText: response.statusText,
                status: response.status
              })
            },
            onerror: function onerror (response) {
              resolve({
                result: 'error',
                statusText: response.statusText,
                status: response.status
              })
            },
            ontimeout: function ontimeout (response) {
              resolve({
                result: 'error',
                statusText: response.statusText,
                status: response.status
              })
            },
            r: resolve,
            status: status
          })
        }).then(function (result) {
          if (result.result === 'success') {
            r(result)
          } else {
            _this7.httpRequest({
              url: 'https://store.steampowered.com/app/' + gameId,
              method: 'GET',
              onload: function onload (response) {
                if (debug) console.log(response)

                if (response.status === 200) {
                  if (response.responseText.includes('class="queue_actions_ctn"') && response.responseText.includes('已在库中')) {
                    status.success()
                    r({
                      result: 'success',
                      statusText: response.statusText,
                      status: response.status,
                      own: true
                    })
                  } else if (response.responseText.includes('class="queue_actions_ctn"') && response.responseText.includes('添加至您的愿望单') || !response.responseText.includes('class="queue_actions_ctn"')) {
                    status.error('Error:' + result.statusText + '(' + result.status + ')')
                    r({
                      result: 'error',
                      statusText: response.statusText,
                      status: response.status
                    })
                  } else {
                    status.success()
                    r({
                      result: 'success',
                      statusText: response.statusText,
                      status: response.status
                    })
                  }
                } else {
                  status.error('Error:' + result.statusText + '(' + result.status + ')')
                  r({
                    result: 'error',
                    statusText: response.statusText,
                    status: response.status
                  })
                }
              },
              r: r,
              status: status
            })
          }
        }).catch(function (err) {
          console.error(err)
        })
      },
      removeWishlist: function removeWishlist (r, gameId) {
        var _this8 = this

        var status = this.echoLog({
          type: 'removeWishlist',
          text: gameId
        })
        new Promise(function (resolve) {
          _this8.httpRequest({
            url: 'https://store.steampowered.com/api/removefromwishlist',
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: $.param({
              sessionid: steamInfo.storeSessionID,
              appid: gameId
            }),
            dataType: 'json',
            onload: function onload (response) {
              var _response$response5

              if (debug) console.log(response)

              if (response.status === 200 && ((_response$response5 = response.response) === null || _response$response5 === void 0 ? void 0 : _response$response5.success) === true) {
                status.success()
                resolve({
                  result: 'success',
                  statusText: response.statusText,
                  status: response.status
                })
              } else {
                resolve({
                  result: 'error',
                  statusText: response.statusText,
                  status: response.status
                })
              }
            },
            onabort: function onabort (response) {
              resolve({
                result: 'error',
                statusText: response.statusText,
                status: response.status
              })
            },
            onerror: function onerror (response) {
              resolve({
                result: 'error',
                statusText: response.statusText,
                status: response.status
              })
            },
            ontimeout: function ontimeout (response) {
              resolve({
                result: 'error',
                statusText: response.statusText,
                status: response.status
              })
            },
            r: resolve,
            status: status
          })
        }).then(function (result) {
          if (result.result === 'success') {
            r(result)
          } else {
            _this8.httpRequest({
              url: 'https://store.steampowered.com/app/' + gameId,
              method: 'GET',
              onload: function onload (response) {
                if (debug) console.log(response)

                if (response.status === 200) {
                  if (response.responseText.includes('class="queue_actions_ctn"') && (response.responseText.includes('已在库中') || response.responseText.includes('添加至您的愿望单'))) {
                    status.success()
                    r({
                      result: 'success',
                      statusText: response.statusText,
                      status: response.status
                    })
                  } else {
                    status.error('Error:' + result.statusText + '(' + result.status + ')')
                    r({
                      result: 'error',
                      statusText: response.statusText,
                      status: response.status
                    })
                  }
                } else {
                  status.error('Error:' + result.statusText + '(' + result.status + ')')
                  r({
                    result: 'error',
                    statusText: response.statusText,
                    status: response.status
                  })
                }
              },
              r: r,
              status: status
            })
          }
        }).catch(function (err) {
          console.error(err)
        })
      },
      followGame: function followGame (r, gameId) {
        var _this9 = this

        var status = this.echoLog({
          type: 'followGame',
          text: gameId
        })
        new Promise(function (resolve) {
          _this9.httpRequest({
            url: 'https://store.steampowered.com/explore/followgame/',
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: $.param({
              sessionid: steamInfo.storeSessionID,
              appid: gameId
            }),
            onload: function onload (response) {
              if (debug) console.log(response)

              if (response.status === 200 && response.responseText === 'true') {
                status.success()
                resolve({
                  result: 'success',
                  statusText: response.statusText,
                  status: response.status
                })
              } else {
                resolve({
                  result: 'error',
                  statusText: response.statusText,
                  status: response.status
                })
              }
            },
            onabort: function onabort (response) {
              resolve({
                result: 'error',
                statusText: response.statusText,
                status: response.status
              })
            },
            onerror: function onerror (response) {
              resolve({
                result: 'error',
                statusText: response.statusText,
                status: response.status
              })
            },
            ontimeout: function ontimeout (response) {
              resolve({
                result: 'error',
                statusText: response.statusText,
                status: response.status
              })
            },
            r: resolve,
            status: status
          })
        }).then(function (result) {
          if (result.result === 'success') {
            r(result)
          } else {
            _this9.httpRequest({
              url: 'https://store.steampowered.com/app/' + gameId,
              method: 'GET',
              onload: function onload (response) {
                if (debug) console.log(response)

                if (response.status === 200) {
                  if (response.responseText.includes('class="queue_actions_ctn"') && response.responseText.includes('class="btnv6_blue_hoverfade btn_medium queue_btn_active" style="">')) {
                    status.success()
                    r({
                      result: 'success',
                      statusText: response.statusText,
                      status: response.status
                    })
                  } else {
                    status.error('Error:' + result.statusText + '(' + result.status + ')')
                    r({
                      result: 'error',
                      statusText: response.statusText,
                      status: response.status
                    })
                  }
                } else {
                  status.error('Error:' + result.statusText + '(' + result.status + ')')
                  r({
                    result: 'error',
                    statusText: response.statusText,
                    status: response.status
                  })
                }
              },
              r: r,
              status: status
            })
          }
        }).catch(function (err) {
          console.error(err)
        })
      },
      unfollowGame: function unfollowGame (r, gameId) {
        var _this10 = this

        var status = this.echoLog({
          type: 'unfollowGame',
          text: gameId
        })
        new Promise(function (resolve) {
          _this10.httpRequest({
            url: 'https://store.steampowered.com/explore/followgame/',
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: $.param({
              sessionid: steamInfo.storeSessionID,
              appid: gameId,
              unfollow: '1'
            }),
            onload: function onload (response) {
              if (debug) console.log(response)

              if (response.status === 200 && response.responseText === 'true') {
                status.success()
                resolve({
                  result: 'success',
                  statusText: response.statusText,
                  status: response.status
                })
              } else {
                resolve({
                  result: 'error',
                  statusText: response.statusText,
                  status: response.status
                })
              }
            },
            onabort: function onabort (response) {
              resolve({
                result: 'error',
                statusText: response.statusText,
                status: response.status
              })
            },
            onerror: function onerror (response) {
              resolve({
                result: 'error',
                statusText: response.statusText,
                status: response.status
              })
            },
            ontimeout: function ontimeout (response) {
              resolve({
                result: 'error',
                statusText: response.statusText,
                status: response.status
              })
            },
            r: resolve,
            status: status
          })
        }).then(function (result) {
          if (result.result === 'success') {
            r(result)
          } else {
            _this10.httpRequest({
              url: 'https://store.steampowered.com/app/' + gameId,
              method: 'GET',
              onload: function onload (response) {
                if (debug) console.log(response)

                if (response.status === 200) {
                  if (response.responseText.includes('class="queue_actions_ctn"') && response.responseText.includes('class="btnv6_blue_hoverfade btn_medium queue_btn_active" style="">')) {
                    status.error('Error:' + result.statusText + '(' + result.status + ')')
                    r({
                      result: 'error',
                      statusText: response.statusText,
                      status: response.status
                    })
                  } else {
                    status.success()
                    r({
                      result: 'success',
                      statusText: response.statusText,
                      status: response.status
                    })
                  }
                } else {
                  status.error('Error:' + result.statusText + '(' + result.status + ')')
                  r({
                    result: 'error',
                    statusText: response.statusText,
                    status: response.status
                  })
                }
              },
              r: r,
              status: status
            })
          }
        }).catch(function (err) {
          console.error(err)
        })
      },
      likeAnnouncements: function likeAnnouncements (r, url, id) {
        var status = this.echoLog({
          type: 'likeAnnouncements',
          url: url,
          id: id
        })
        this.httpRequest({
          url: url.replace('/detail/', '/rate/'),
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: $.param({
            sessionid: steamInfo.communitySessionID,
            voteup: true
          }),
          dataType: 'json',
          onload: function onload (response) {
            var _response$response6

            if (debug) console.log(response)

            if (response.status === 200 && ((_response$response6 = response.response) === null || _response$response6 === void 0 ? void 0 : _response$response6.success) === 1) {
              status.success()
              r({
                result: 'success',
                statusText: response.statusText,
                status: response.status
              })
            } else {
              var _response$response7, _response$response8

              status.error('Error:'.concat(((_response$response7 = response.response) === null || _response$response7 === void 0 ? void 0 : _response$response7.msg) || response.statusText, '(').concat(((_response$response8 = response.response) === null || _response$response8 === void 0 ? void 0 : _response$response8.success) || response.status, ')'))
              r({
                result: 'error',
                statusText: response.statusText,
                status: response.status
              })
            }
          },
          r: r,
          status: status
        })
      },
      getFinalUrl: function getFinalUrl (r, url) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null
        var conf = Object.assign({
          url: url,
          method: 'GET',
          onload: function onload (response) {
            r({
              result: 'success',
              finalUrl: response.finalUrl,
              url: url
            })
          },
          r: r
        }, options)
        this.httpRequest(conf)
      },
      visitLink: function visitLink (r, url) {
        var _this11 = this

        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {}
        if (!options.method) options.method = 'HEAD'
        var status = this.echoLog({
          type: 'visitLink',
          text: url
        })
        new Promise(function (resolve) {
          _this11.getFinalUrl(resolve, url, options)
        }).then(function () {
          status.warning('Complete')
          r(1)
        }).catch(function (err) {
          console.error(err)
        })
      },
      checkUpdate: function checkUpdate (v) {
        var s = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false
        v.icon = 'el-icon-loading'
        var status = false
        if (s) {
          status = this.echoLog({
            type: 'custom',
            text: '<li>'.concat(getI18n('checkingUpdate'), '<font></font></li>')
          })
        }
        this.httpRequest({
          url: 'https://github.com/HCLonely/auto-task/raw/master/version.json?t=' + new Date().getTime(),
          method: 'get',
          dataType: 'json',
          onload: function onload (response) {
            var _response$response9, _response$response10, _response$response11

            if (debug) console.log(response)

            if (((_response$response9 = response.response) === null || _response$response9 === void 0 ? void 0 : _response$response9.version) === GM_info.script.version) {
              v.icon = 'el-icon-refresh'
              v.title = getI18n('checkUpdate')
              if (s) status.success(getI18n('thisIsNew'))
              v.hidden = true
            } else if ((_response$response10 = response.response) === null || _response$response10 === void 0 ? void 0 : _response$response10.version) {
              v.icon = 'el-icon-download'
              v.title = getI18n('updateNow') + response.response.version

              v.checkUpdate = function () {
                window.open('https://github.com/HCLonely/auto-task/raw/master/auto-task.user.js', '_blank')
              }

              if (s) status.success(getI18n('newVer') + response.response.version)
              v.hidden = false
            } else {
              v.icon = 'el-icon-refresh'
              v.title = getI18n('checkUpdate')
              if (s) status.error('Error:' + (response.statusText || response.status))
            }

            var conf = GM_getValue('conf') || defaultConf

            if (((_response$response11 = response.response) === null || _response$response11 === void 0 ? void 0 : _response$response11.time) !== conf.announcement) {
              v.announcementHidden = false
              conf.announcement = response.response.time
              GM_setValue('conf', conf)
            }
          },
          ontimeout: function ontimeout (response) {
            if (debug) console.log(response)
            v.icon = 'el-icon-refresh'
            v.title = getI18n('checkUpdate')
            if (s) status.error('Error:Timeout(0)')
          },
          onabort: function onabort (response) {
            if (debug) console.log(response)
            v.icon = 'el-icon-refresh'
            v.title = getI18n('checkUpdate')
            if (s) status.error('Error:Abort(0)')
          },
          onerror: function onerror (response) {
            if (debug) console.log(response)
            v.icon = 'el-icon-refresh'
            v.title = getI18n('checkUpdate')
            if (s) status.error('Error:Error(0)')
          },
          status: status
        })
      },
      getAnnouncement: function getAnnouncement (v) {
        v.announcementIcon = 'el-icon-loading'
        var status = this.echoLog({
          type: 'custom',
          text: '<li>'.concat(getI18n('getAnnouncement'), '<font></font></li>')
        })
        this.httpRequest({
          url: 'https://github.com/HCLonely/auto-task/raw/master/version.json?t=' + new Date().getTime(),
          method: 'get',
          dataType: 'json',
          onload: function onload (response) {
            if (debug) console.log(response)

            if (response.responseText && response.response) {
              status.success()
              var data = response.response
              var conf = GM_getValue('conf') || defaultConf
              conf.announcement = data.time
              GM_setValue('conf', conf)
              v.announcementHidden = true
              var h = vueUi.$createElement
              var hArr = []

              for (var index in data.text) {
                if (/^[\d]+$/.test(index)) hArr.push(h('p', null, ''.concat(parseInt(index) + 1, '.').concat(data.text[index])))
              }

              vueUi.$msgbox({
                title: 'pre-'.concat(data.version, '(').concat(fuc.dateFormat('YYYY-mm-dd HH:MM', new Date(data.time)), ')'),
                message: h('div', null, hArr),
                showCancelButton: true,
                confirmButtonText: getI18n('visitHistory'),
                cancelButtonText: getI18n('close')
              }).then(function () {
                window.open('https://userjs.hclonely.com/announcement.html', '_blank')
              }).catch(function () {})
            } else {
              status.error('Error:' + (response.statusText || response.status))
            }

            v.announcementIcon = 'el-icon-document'
          },
          ontimeout: function ontimeout (response) {
            if (debug) console.log(response)
            v.announcementIcon = 'el-icon-document'
            status.error('Error:Timeout(0)')
          },
          onabort: function onabort (response) {
            if (debug) console.log(response)
            v.announcementIcon = 'el-icon-document'
            status.error('Error:Abort(0)')
          },
          onerror: function onerror (response) {
            if (debug) console.log(response)
            v.announcementIcon = 'el-icon-document'
            status.error('Error:Error(0)')
          },
          status: status
        })
      },
      newTabBlock: function newTabBlock () {
        var d = new Date()
        var cookiename = 'haveVisited1'
        document.cookie = cookiename + '=1; path=/'
        document.cookie = cookiename + '=' + (d.getUTCMonth() + 1) + '/' + d.getUTCDate() + '/' + d.getUTCFullYear() + '; path=/'
      },
      echoLog: function echoLog (e) {
        var ele = ''

        switch (e.type) {
          case 'updateSteamCommunity':
            ele = $('<li>'.concat(getI18n('updateCommunityId'), '<font></font></li>'))
            break

          case 'updateSteamStore':
            ele = $('<li>'.concat(getI18n('updateStoreId'), '<font></font></li>'))
            break

          case 'joinSteamGroup':
            ele = $('<li>'.concat(getI18n('joinGroup'), '<a href="https://steamcommunity.com/groups/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'getGroupId':
            ele = $('<li>'.concat(getI18n('getGroupId'), '<a href="https://steamcommunity.com/groups/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'leaveSteamGroup':
            ele = $('<li>'.concat(getI18n('leaveGroup'), '<a href="https://steamcommunity.com/groups/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'followCurator':
            ele = $('<li>'.concat(getI18n('followCurator'), '<a href="https://store.steampowered.com/curator/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'unfollowCurator':
            ele = $('<li>'.concat(getI18n('unfollowCurator'), '<a href="https://store.steampowered.com/curator/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'getDeveloperId':
            ele = $('<li>'.concat(getI18n('getDeveloperId'), '<a href="https://store.steampowered.com/developer/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'followDeveloper':
            ele = $('<li>'.concat(getI18n('followDeveloper'), '<a href="https://store.steampowered.com/developer/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'unfollowDeveloper':
            ele = $('<li>'.concat(getI18n('unfollowDeveloper'), '<a href="https://store.steampowered.com/developer/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'getPublisherId':
            ele = $('<li>'.concat(getI18n('getPublisherId'), '<a href="https://store.steampowered.com/publisher/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'followPublisher':
            ele = $('<li>'.concat(getI18n('followPublisher'), '<a href="https://store.steampowered.com/publisher/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'unfollowPublisher':
            ele = $('<li>'.concat(getI18n('unfollowPublisher'), '<a href="https://store.steampowered.com/publisher/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'addWishlist':
            ele = $('<li>'.concat(getI18n('addWishlist'), '<a href="https://store.steampowered.com/app/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'removeWishlist':
            ele = $('<li>'.concat(getI18n('removeWishlist'), '<a href="https://store.steampowered.com/app/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'followGame':
            ele = $('<li>'.concat(getI18n('followGame'), '<a href="https://store.steampowered.com/app/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'unfollowGame':
            ele = $('<li>'.concat(getI18n('unfollowGame'), '<a href="https://store.steampowered.com/app/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'likeAnnouncements':
            ele = $('<li>'.concat(getI18n('likeAnnouncements'), '<a href="').concat(e.url, '" target="_blank">').concat(e.id, '</a>...<font></font></li>'))
            break

          case 'visitLink':
            ele = $('<li>'.concat(getI18n('visitLink'), '...<a href="').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'custom':
            ele = $(e.text)
            break

          default:
            ele = $('<li>'.concat(getI18n('unknown'), '<font></font></li>'))
            break
        }

        $('.fuck-task-logs .el-notification__content').append(ele)
        ele[0].scrollIntoView()
        var font = ele.find('font')
        var status = {
          font: font,
          success: function success () {
            var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Success'
            var html = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false
            this.font.attr('class', '').addClass('success')
            html ? this.font.html(text) : this.font.text(text)
          },
          error: function error () {
            var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Error'
            var html = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false
            this.font.attr('class', '').addClass('error')
            html ? this.font.html(text) : this.font.text(text)
          },
          warning: function warning () {
            var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Warning'
            var html = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false
            this.font.attr('class', '').addClass('warning')
            html ? this.font.html(text) : this.font.text(text)
          },
          info: function info () {
            var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Info'
            var html = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false
            this.font.attr('class', '').addClass('info')
            html ? this.font.html(text) : this.font.text(text)
          }
        }
        return status
      },
      unique: function unique (e) {
        return _toConsumableArray(new Set(e))
      },
      getUrlQuery: function getUrlQuery (url) {
        var q = {}

        if (url) {
          if (url.includes('?')) {
            url.split('?')[1].replace(/([^?&=]+)=([^&]+)/g, function (_, k, v) {
              q[k] = v
            })
          }
        } else {
          window.location.search.replace(/([^?&=]+)=([^&]+)/g, function (_, k, v) {
            q[k] = v
          })
        }

        return q
      },
      dateFormat: function dateFormat (fmt, date) {
        var ret = null
        var opt = {
          'Y+': date.getFullYear().toString(),
          'm+': (date.getMonth() + 1).toString(),
          'd+': date.getDate().toString(),
          'H+': date.getHours().toString(),
          'M+': date.getMinutes().toString(),
          'S+': date.getSeconds().toString()
        }

        for (var k in opt) {
          ret = new RegExp('(' + k + ')').exec(fmt)

          if (ret) {
            fmt = fmt.replace(ret[1], ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'))
          }
        }

        return fmt
      },
      isEmptyObjArr: function isEmptyObjArr (object) {
        for (var _i = 0, _Object$values = Object.values(object); _i < _Object$values.length; _i++) {
          var value = _Object$values[_i]

          if (Object.prototype.toString.call(value) === '[object Array]') {
            if (value.length !== 0) return false
          } else if (Object.prototype.toString.call(value) === '[object Object]') {
            if (Object.keys(value).length !== 0) return false
          } else if (Object.prototype.toString.call(value) === '[object String]') {
            if (value !== '') return false
          }
        }

        return true
      },
      toggleActions: function toggleActions (_ref) {
        var website = _ref.website
        var type = _ref.type
        var elements = _ref.elements
        var resolve = _ref.resolve
        var action = _ref.action
        var _ref$toFinalUrl = _ref.toFinalUrl
        var toFinalUrl = _ref$toFinalUrl === void 0 ? {} : _ref$toFinalUrl
        var pro = []

        var _iterator = _createForOfIteratorHelper(fuc.unique(elements))
        var _step

        try {
          var _loop = function _loop () {
            var _elementName

            var element = _step.value
            var elementName = null

            if (website === 'giveawaysu' && toFinalUrl[element]) {
              var toFinalUrlElement = toFinalUrl[element] || ''

              switch (type) {
                case 'group':
                  elementName = toFinalUrlElement.match(/groups\/(.+)\/?/)
                  break

                case 'curator':
                  elementName = toFinalUrlElement.match(/curator\/([\d]+)/)
                  break

                case 'publisher':
                  elementName = toFinalUrlElement.includes('publisher') ? toFinalUrlElement.match(/publisher\/(.+)\/?/) : toFinalUrlElement.match(/pub\/(.+)\/?/)
                  break

                case 'developer':
                  elementName = toFinalUrlElement.includes('developer') ? toFinalUrlElement.match(/developer\/(.+)\/?/) : toFinalUrlElement.match(/dev\/(.+)\/?/)
                  break

                case 'game':
                case 'wishlist':
                  elementName = toFinalUrlElement.match(/app\/([\d]+)/)
                  break

                case 'announcement':
                  elementName = toFinalUrlElement.match(/announcements\/detail\/([\d]+)/)
                  break

                default:
                  elementName = null
              }
            } else {
              elementName = [null, element]
            }

            if ((_elementName = elementName) === null || _elementName === void 0 ? void 0 : _elementName[1]) {
              switch (type) {
                case 'group':
                  pro.push(new Promise(function (resolve) {
                    action === 'fuck' ? fuc.joinSteamGroup(resolve, elementName[1]) : fuc.leaveSteamGroup(resolve, elementName[1])
                  }))
                  break

                case 'curator':
                  pro.push(new Promise(function (resolve) {
                    action === 'fuck' ? fuc.followCurator(resolve, elementName[1]) : fuc.unfollowCurator(resolve, elementName[1])
                  }))
                  break

                case 'publisher':
                  pro.push(new Promise(function (resolve) {
                    action === 'fuck' ? fuc.followPublisher(resolve, elementName[1]) : fuc.unfollowPublisher(resolve, elementName[1])
                  }))
                  break

                case 'developer':
                  pro.push(new Promise(function (resolve) {
                    action === 'fuck' ? fuc.followDeveloper(resolve, elementName[1]) : fuc.unfollowDeveloper(resolve, elementName[1])
                  }))
                  break

                case 'wishlist':
                  pro.push(new Promise(function (resolve) {
                    action === 'fuck' ? fuc.addWishlist(resolve, elementName[1]) : fuc.removeWishlist(resolve, elementName[1])
                  }))
                  break

                case 'game':
                  pro.push(new Promise(function (resolve) {
                    action === 'fuck' ? fuc.followGame(resolve, elementName[1]) : fuc.unfollowGame(resolve, elementName[1])
                  }))
                  break

                case 'announcement':
                  pro.push(new Promise(function (resolve) {
                    if (action === 'like') {
                      fuc.likeAnnouncements(resolve, elementName.input, elementName[1])
                    }
                  }))
                  break
              }
            }
          }

          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            _loop()
          }
        } catch (err) {
          _iterator.e(err)
        } finally {
          _iterator.f()
        }

        Promise.all(pro).finally(function () {
          resolve()
        })
      }
    }
    var banana = {
      test: function test () {
        return window.location.host.includes('grabfreegame') || window.location.host.includes('bananagiveaway')
      },
      fuck: function fuck (vue) {
        var _this12 = this

        var needBanana = $("p:contains('Collect'):contains('banana')")
        var needPoints = $("p:contains('Collect'):contains('point')")
        var msg = ''
        if (needBanana.length > 0) msg = getI18n('needBanana', needBanana.text().match(/[\d]+/gim)[0])
        if (needPoints.length > 0) msg = getI18n('needPoints', needPoints.text().replace(/Collect/gi, ''))

        if (needPoints.length > 0 || needBanana.length > 0) {
          vue.$confirm(msg, getI18n('notice'), {
            confirmButtonText: getI18n('confirm'),
            cancelButtonText: getI18n('cancel'),
            type: 'warning'
          }).then(function () {
            _this12.get_tasks('do_task')
          }).catch(function (err) {
            console.error(err)
          })
        } else {
          this.get_tasks('do_task')
        }
      },
      get_tasks: function get_tasks () {
        var _this13 = this

        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'do_task'
        var taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
        if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory

        if (callback === 'remove' && taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
          this.remove(true)
        } else {
          this.tasks = []
          this.links = []
          this.groups = []
          this.curators = []
          this.wishlists = []
          this.fGames = []
          this.taskIds = []
          var status = fuc.echoLog({
            type: 'custom',
            text: '<li>'.concat(getI18n('processTasksInfo'), '<font></font></li>')
          })
          var tasksUl = $('ul.tasks li:not(:contains(Completed))')
          var pro = []

          var _iterator2 = _createForOfIteratorHelper(tasksUl)
          var _step2

          try {
            var _loop2 = function _loop2 () {
              var task = _step2.value
              // 遍历任务信息
              var taskDes = $(task).find('p')
              var verifyBtn = $(task).find('button:contains(Verify)')
              var taskId = verifyBtn.length > 0 ? verifyBtn.attr('onclick').match(/\?verify=([\d]+)/) : ''

              if (taskId) {
                _this13.tasks.push({
                  taskId: taskId[1],
                  taskDes: taskDes.text()
                })

                if (/join.*?steam.*?group/gim.test(taskDes.text())) {
                  pro.push(new Promise(function (res) {
                    new Promise(function (resolve) {
                      fuc.getFinalUrl(resolve, window.location.origin + window.location.pathname + '?q=' + taskId[1])
                    }).then(function (r) {
                      if (r.result === 'success') {
                        var groupName = r.finalUrl.match(/groups\/(.+)\/?/)

                        if (groupName) {
                          _this13.groups.push(groupName[1])

                          _this13.taskInfo.groups.push(groupName[1])
                        } else {
                          _this13.taskIds.push(taskId[1])
                        }
                      } else {
                        _this13.taskIds.push(taskId[1])
                      }

                      res(1)
                    })
                  }))
                } else if (/follow.*?curator/gim.test(taskDes.text())) {
                  pro.push(new Promise(function (res) {
                    new Promise(function (resolve) {
                      fuc.getFinalUrl(resolve, window.location.origin + window.location.pathname + '?q=' + taskId[1])
                    }).then(function (r) {
                      if (r.result === 'success') {
                        var curatorId = r.finalUrl.match(/curator\/([\d]+)/)

                        if (curatorId) {
                          _this13.curators.push(curatorId[1])

                          _this13.taskInfo.curators.push(curatorId[1])
                        } else {
                          _this13.taskIds.push(taskId[1])
                        }
                      } else {
                        _this13.taskIds.push(taskId[1])
                      }

                      res(1)
                    })
                  }))
                } else if (/wishlist/gim.test(taskDes.text())) {
                  pro.push(new Promise(function (res) {
                    new Promise(function (resolve) {
                      fuc.getFinalUrl(resolve, window.location.origin + window.location.pathname + '?q=' + taskId[1])
                    }).then(function (r) {
                      if (r.result === 'success') {
                        var appId = r.finalUrl.match(/store.steampowered.com\/app\/([\d]+)/)

                        if (appId) {
                          _this13.wishlists.push(appId[1])

                          _this13.taskInfo.wishlists.push(appId[1])
                        } else {
                          _this13.taskIds.push(taskId[1])
                        }
                      } else {
                        _this13.taskIds.push(taskId[1])
                      }

                      res(1)
                    })
                  }))
                } else {
                  if (/(Subscribe.*channel)|(Retweet)|(Twitter)/gim.test(taskDes.text())) {
                    if (!_this13.verifyBtn) _this13.verifyBtn = taskDes.parent().find('button:contains(Verify)')

                    if (callback === 'do_task' && globalConf.other.autoOpen) {
                      taskDes.parent().find('button')[0].click()
                    }
                  }

                  pro.push(new Promise(function (resolve) {
                    _this13.links.push(window.location.origin + window.location.pathname + '?q=' + taskId[1])

                    _this13.taskIds.push(taskId[1])

                    resolve(1)
                  }))
                }
              }
            }

            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              _loop2()
            }
          } catch (err) {
            _iterator2.e(err)
          } finally {
            _iterator2.f()
          }

          Promise.all(pro).finally(function () {
            _this13.links = fuc.unique(_this13.links)
            _this13.groups = fuc.unique(_this13.groups)
            _this13.curators = fuc.unique(_this13.curators)
            _this13.wishlists = fuc.unique(_this13.wishlists)
            _this13.fGames = fuc.unique(_this13.fGames)
            _this13.taskInfo.groups = fuc.unique(_this13.taskInfo.groups)
            _this13.taskInfo.curators = fuc.unique(_this13.taskInfo.curators)
            _this13.taskInfo.wishlists = fuc.unique(_this13.taskInfo.wishlists)
            _this13.taskInfo.fGames = fuc.unique(_this13.taskInfo.fGames)
            _this13.taskIds = fuc.unique(_this13.taskIds)
            _this13.tasks = fuc.unique(_this13.tasks)
            GM_setValue('taskInfo[' + window.location.host + _this13.get_giveawayId() + ']', _this13.taskInfo)
            status.success()
            if (debug) console.log(_this13)

            if (callback === 'do_task') {
              _this13.do_task()
            } else if (callback === 'verify') {
              _this13.tasks.length > 0 ? _this13.verify(true) : fuc.echoLog({
                type: 'custom',
                text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
              })
            } else {
              !fuc.isEmptyObjArr(_this13.taskInfo) ? _this13.remove(true) : fuc.echoLog({
                type: 'custom',
                text: '<li><font class="warning">'.concat(getI18n('cannotRemove'), '</font></li>')
              })
            }
          })
        }
      },
      do_task: function do_task () {
        var _this14 = this

        this.updateSteamInfo(/* #__PURE__ */_asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee () {
          var pro, links, _iterator3, _step3, _loop3

          return regeneratorRuntime.wrap(function _callee$ (_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  pro = []
                  links = fuc.unique(_this14.links)
                  _context.next = 4
                  return _this14.toggleActions('fuck', pro)

                case 4:
                  if (_this14.conf.fuck.visitLink) {
                    _iterator3 = _createForOfIteratorHelper(links)

                    try {
                      _loop3 = function _loop3 () {
                        var link = _step3.value
                        pro.push(new Promise(function (resolve) {
                          fuc.visitLink(resolve, link)
                        }))
                      }

                      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                        _loop3()
                      }
                    } catch (err) {
                      _iterator3.e(err)
                    } finally {
                      _iterator3.f()
                    }
                  }

                  Promise.all(pro).finally(function () {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                    })
                    if (_this14.conf.fuck.verify) _this14.verify()
                  })

                case 6:
                case 'end':
                  return _context.stop()
              }
            }
          }, _callee)
        })))
      },
      verify: function verify () {
        var _this15 = this

        var verify = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false

        if (verify) {
          var _pro = []

          var _iterator4 = _createForOfIteratorHelper(fuc.unique(this.tasks))
          var _step4

          try {
            var _loop4 = function _loop4 () {
              var task = _step4.value
              var status = fuc.echoLog({
                type: 'custom',
                text: '<li>'.concat(getI18n('verifyingTask')).concat(task.taskDes, '...<font></font></li>')
              })

              _pro.push(new Promise(function (resolve) {
                fuc.httpRequest({
                  url: window.location.origin + window.location.pathname + '?verify=' + task.taskId,
                  method: 'GET',
                  onload: function onload (response) {
                    if (debug) console.log(response)
                    status.warning('Complete')
                    resolve({
                      result: 'success',
                      statusText: response.statusText,
                      status: response.status
                    })
                  },
                  r: resolve,
                  status: status
                })
              }))
            }

            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              _loop4()
            }
          } catch (err) {
            _iterator4.e(err)
          } finally {
            _iterator4.f()
          }

          Promise.all(_pro).finally(function () {
            fuc.echoLog({
              type: 'custom',
              text: '<li><font class="success">'.concat(getI18n('verifyTasksComplete'), '</font></li>')
            })
            _this15.verifyBtn.length > 0 ? _this15.verifyBtn.removeAttr('disabled')[0].click() : window.location.reload(true)
          })
        } else {
          this.get_tasks('verify')
        }
      },
      remove: function remove () {
        var _this16 = this

        var remove = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false
        var pro = []

        if (remove) {
          this.updateSteamInfo(/* #__PURE__ */_asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee2 () {
            return regeneratorRuntime.wrap(function _callee2$ (_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2
                    return _this16.toggleActions('fuck', pro)

                  case 2:
                    Promise.all(pro).finally(function () {
                      fuc.echoLog({
                        type: 'custom',
                        text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                      })
                    })

                  case 3:
                  case 'end':
                    return _context2.stop()
                }
              }
            }, _callee2)
          })))
        } else {
          this.get_tasks('remove')
        }
      },
      toggleActions: function toggleActions (action, pro) {
        var groups = action === 'fuck' ? this.groups : this.taskInfo.groups
        var curators = action === 'fuck' ? this.curators : this.taskInfo.curators
        var wishlists = action === 'fuck' ? this.wishlists : this.taskInfo.wishlists
        var fGames = action === 'fuck' ? this.fGames : this.taskInfo.fGames

        if (this.conf[action].joinSteamGroup && groups.length > 0) {
          pro.push(new Promise(function (resolve) {
            fuc.toggleActions({
              website: 'banana',
              type: 'group',
              elements: groups,
              resolve: resolve,
              action: action
            })
          }))
        }

        if (this.conf.fuck.followCurator && curators.length > 0) {
          pro.push(new Promise(function (resolve) {
            fuc.toggleActions({
              website: 'banana',
              type: 'curator',
              elements: curators,
              resolve: resolve,
              action: action
            })
          }))
        }

        if (this.conf.fuck.addToWishlist && wishlists.length > 0) {
          pro.push(new Promise(function (resolve) {
            fuc.toggleActions({
              website: 'banana',
              type: 'wishlist',
              elements: wishlists,
              resolve: resolve,
              action: action
            })
          }))
        }

        if (this.conf.fuck.followGame && fGames.length > 0) {
          pro.push(new Promise(function (resolve) {
            fuc.toggleActions({
              website: 'banana',
              type: 'game',
              elements: fGames,
              resolve: resolve,
              action: action
            })
          }))
        }
      },
      get_giveawayId: function get_giveawayId () {
        var id = window.location.href.match(/\/giveaway\/([\w\d-]+)/)
        return (id === null || id === void 0 ? void 0 : id[1]) || window.location.href
      },
      updateSteamInfo: function updateSteamInfo (callback) {
        var _this17 = this

        new Promise(function (resolve) {
          if (_this17.taskInfo.groups.length > 0) {
            if (_this17.taskInfo.curators.length > 0 || _this17.taskInfo.fGames.length > 0 || _this17.taskInfo.wishlists.length > 0) {
              fuc.updateSteamInfo(resolve, 'all')
            } else {
              fuc.updateSteamInfo(resolve, 'community')
            }
          } else if (_this17.taskInfo.curators.length > 0 || _this17.taskInfo.fGames.length > 0 || _this17.taskInfo.wishlists.length > 0) {
            fuc.updateSteamInfo(resolve, 'store')
          } else {
            resolve(1)
          }
        }).then(function (s) {
          if (s === 1) callback()
        }).catch(function (err) {
          console.error(err)
        })
      },
      checkLogin: function checkLogin () {
        if ($('a.steam[title*=team]').length > 0) window.open('/giveaway/steam/', '_self')
      },
      checkLeft: function checkLeft (ui) {
        if ($('.left b').text() === '0') {
          ui.$confirm(getI18n('noKeysLeft'), getI18n('notice'), {
            confirmButtonText: getI18n('confirm'),
            cancelButtonText: getI18n('cancel'),
            type: 'warning',
            center: true
          }).then(function () {
            window.close()
          })
        }
      },
      verifyBtn: 0,
      links: [],
      // 需要浏览的页面链接
      groups: [],
      // 所有任务需要加的组
      curators: [],
      // 所有任务需要关注的鉴赏家
      wishlists: [],
      // 所有务需要添加愿望单的游戏
      fGames: [],
      // 所有任务需要关注的的游戏
      taskIds: [],
      // 处理失败的任务
      taskInfo: {
        groups: [],
        // 任务需要加的组
        curators: [],
        // 任务需要关注的鉴赏家
        wishlists: [],
        // 任务需要添加愿望单的游戏
        fGames: [] // 任务需要关注的的游戏

      },
      tasks: [],
      // 所有任务ID
      setting: {
        fuck: true,
        verify: true,
        remove: true
      },
      conf: (config === null || config === void 0 ? void 0 : (_config$banana = config.banana) === null || _config$banana === void 0 ? void 0 : _config$banana.load) ? config.banana : globalConf
    }
    var freegamelottery = {
      test: function test () {
        return window.location.host.includes('freegamelottery')
      },
      after: function after (website) {
        if (window.location.host === 'd.freegamelottery.com' && GM_getValue('lottery') === 1) website.draw()
      },
      fuck: function fuck (vue) {
        GM_setValue('lottery', 1)

        if ($('a.registration-button').length > 0) {
          if (this.conf.fuck.autoLogin) {
            var userInfo = GM_getValue('conf').lotteryUserInfo

            if (userInfo) {
              var status = fuc.echoLog({
                type: 'custom',
                text: '<li>'.concat(getI18n('logining'), '<font></font></li>')
              })
              fuc.httpRequest({
                url: 'https://freegamelottery.com/user/login',
                method: 'POST',
                data: 'username='.concat(userInfo.username, '&password=').concat(userInfo.password, '&rememberMe=1'),
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                onload: function onload (data) {
                  if (data.status === 200) {
                    status.success()
                    window.location.reload(true)
                  } else {
                    status.error('Error:' + (data.statusText || data.status))
                  }
                },
                status: status
              })
            } else {
              vue.$message({
                type: 'warning',
                message: getI18n('needLogin')
              })
              $('a.registration-button')[0].click()
              $('button[value=Login]').click(function () {
                var conf = GM_getValue('conf')
                conf.lotteryUserInfo = {
                  username: $('#modal_login').val(),
                  password: $('#modal_password').val()
                }
                GM_setValue('conf', conf)
              })
            }
          } else {
            vue.$message({
              type: 'warning',
              message: getI18n('needLogin')
            })
            $('a.registration-button')[0].click()
          }
        } else {
          this.draw()
        }
      },
      draw: function draw () {
        GM_setValue('lottery', 0)

        if (this.conf.fuck.doTask) {
          var main = fuc.echoLog({
            type: 'custom',
            text: '<li>'.concat(getI18n('fglTimeout', 'Visit MAIN DRAW'), '<font></font></li>')
          })
          $.post('/draw/register-visit', {
            drawId: DashboardApp.draws.main.actual.id
          }).done(function () {
            DashboardApp.draws.main.actual.haveVisited = true
            main.success()
            var survey = fuc.echoLog({
              type: 'custom',
              text: '<li>'.concat(getI18n('fglTimeout', 'Visit SURVEY DRAW'), '<font></font></li>')
            })
            $.post('/draw/register-visit', {
              type: 'survey',
              drawId: DashboardApp.draws.survey.actual.id
            }).done(function () {
              DashboardApp.draws.survey.actual.haveVisited = 1
              survey.success()
              var video = fuc.echoLog({
                type: 'custom',
                text: '<li>'.concat(getI18n('fglTimeout', 'Visit VIDEO DRAW'), '<font></font></li>')
              })
              $.post('/draw/register-visit', {
                drawId: DashboardApp.draws.video.actual.id
              }).done(function () {
                DashboardApp.draws.video.actual.haveVisited = true
                video.success()
                var stackpot = fuc.echoLog({
                  type: 'custom',
                  text: '<li>'.concat(getI18n('fglTimeout', 'Visit STACKPOT'), '<font></font></li>')
                })
                $.post('/draw/register-visit', {
                  type: 'stackpot',
                  drawId: DashboardApp.draws.stackpot.actual.id
                }).done(function () {
                  DashboardApp.draws.stackpot.actual.haveVisited = 1
                  stackpot.success()
                  fuc.echoLog({
                    type: 'custom',
                    text: '<li>'.concat(getI18n('fglComplete'), '<font></font></li>')
                  })
                  window.location.href = '/#/draw/stackpot'
                  window.location.reload(true)
                })
              })
            })
          })
        }
      },
      setting: {
        fuck: true,
        verify: false,
        join: false,
        remove: false
      },
      conf: ((_GM_getValue = GM_getValue('conf')) === null || _GM_getValue === void 0 ? void 0 : (_GM_getValue$freegame = _GM_getValue.freegamelottery) === null || _GM_getValue$freegame === void 0 ? void 0 : _GM_getValue$freegame.load) ? GM_getValue('conf').freegamelottery : ((_GM_getValue2 = GM_getValue('conf')) === null || _GM_getValue2 === void 0 ? void 0 : _GM_getValue2.global) || defaultConf
    }
    var gamehag = {
      test: function test () {
        return window.location.host.includes('gamehag')
      },
      before: function before () {
        $('#getkey').removeAttr('disabled')
        if (globalConf.other.reCaptcha) $('body').append('<script>window.bannedCountries = ["en"];window.geo ="en";window.respCaptch="";</script>')
      },
      fuck: function fuck () {
        this.get_tasks('do_task')
      },
      get_tasks: function get_tasks () {
        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'do_task'
        var status = fuc.echoLog({
          type: 'custom',
          text: '<li>'.concat(getI18n('getTasksInfo'), '<font></font></li>')
        })
        var verifyBtns = $('button[data-id]')

        if (callback === 'do_task') {
          var taskInfo = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
          if (taskInfo && !fuc.isEmptyObjArr(taskInfo)) this.taskInfo = taskInfo
          this.groups = []
          this.tasks = []

          var _iterator5 = _createForOfIteratorHelper(verifyBtns)
          var _step5

          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var btn = _step5.value

              var _taskId = $(btn).attr('data-id')

              var _taskDes = $(btn).parent().prev().text()

              if ($(btn).parents('.task-content').next().text().includes('+1')) {
                this.tasks.push({
                  taskId: _taskId,
                  taskDes: _taskDes
                })
              }
            }
          } catch (err) {
            _iterator5.e(err)
          } finally {
            _iterator5.f()
          }

          if ($('a.giveaway-survey').length > 0) {
            var taskId = $('a.giveaway-survey').attr('data-task_id')
            var taskDes = 'Complete the survey'
            this.tasks.push({
              taskId: taskId,
              taskDes: taskDes
            })
          }

          this.groups = fuc.unique(this.groups)
          this.taskInfo.groups = fuc.unique(this.taskInfo.groups)
          this.tasks = fuc.unique(this.tasks)
          GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)

          if (this.tasks.length > 0) {
            this.do_task()
          } else {
            fuc.echoLog({
              type: 'custom',
              text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
            })
            if (this.conf.fuck.verify) this.verify()
          }
        } else if (callback === 'verify') {
          this.tasks = []

          var _iterator6 = _createForOfIteratorHelper(verifyBtns)
          var _step6

          try {
            for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
              var _btn = _step6.value

              var _taskId2 = $(_btn).attr('data-id')

              var _taskDes2 = $(_btn).parent().prev().text()

              if ($(_btn).parents('.task-content').next().text().includes('+1')) {
                this.tasks.push({
                  taskId: _taskId2,
                  taskDes: _taskDes2
                })
              }
            }
          } catch (err) {
            _iterator6.e(err)
          } finally {
            _iterator6.f()
          }

          this.tasks = fuc.unique(this.tasks)

          if (this.tasks.length > 0) {
            this.verify(true)
          } else {
            fuc.echoLog({
              type: 'custom',
              text: '<li><font class="success">'.concat(getI18n('verifyTasksComplete'), '</font></li>')
            })
          }
        } else if (callback === 'remove') {
          fuc.echoLog({
            type: 'custom',
            text: '<li><font class="success">'.concat(getI18n('cannotRemove'), '</font></li>')
          })
        } else {
          fuc.echoLog({
            type: 'custom',
            text: '<li><font class="error">'.concat(getI18n('unknown'), '\uFF01</font></li>')
          })
        }

        status.success()
        if (debug) console.log(this)
      },
      do_task: function do_task () {
        var _this18 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee3 () {
          var pro, tasks, _loop5, i

          return regeneratorRuntime.wrap(function _callee3$ (_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  pro = []
                  tasks = fuc.unique(_this18.tasks)
                  _loop5 = /* #__PURE__ */regeneratorRuntime.mark(function _loop5 (i) {
                    var task
                    return regeneratorRuntime.wrap(function _loop5$ (_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            task = tasks[i]
                            pro.push(new Promise(function (resolve) {
                              fuc.visitLink(resolve, '/giveaway/click/' + task.taskId, {
                                headers: {
                                  'x-csrf-token': $('meta[name="csrf-token"]').attr('content')
                                }
                              })
                            }))

                            if (/play.*?games/gim.test(task.taskDes)) {
                              pro.push(new Promise(function (resolve) {
                                fuc.visitLink(resolve, '/games', {
                                  headers: {
                                    'x-csrf-token': $('meta[name="csrf-token"]').attr('content')
                                  }
                                })
                              }))
                              pro.push(new Promise(function (resolve) {
                                fuc.visitLink(resolve, '/games/war-thunder/play', {
                                  headers: {
                                    'x-csrf-token': $('meta[name="csrf-token"]').attr('content')
                                  }
                                })
                              }))
                            }

                            _context3.next = 5
                            return new Promise(function (resolve) {
                              setTimeout(function () {
                                resolve()
                              }, 1000)
                            })

                          case 5:
                          case 'end':
                            return _context3.stop()
                        }
                      }
                    }, _loop5)
                  })
                  i = 0

                case 4:
                  if (!(i < tasks.length)) {
                    _context4.next = 9
                    break
                  }

                  return _context4.delegateYield(_loop5(i), 't0', 6)

                case 6:
                  i++
                  _context4.next = 4
                  break

                case 9:
                  Promise.all(pro).finally(function () {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                    })
                    if (_this18.conf.fuck.verify) _this18.verify()
                  })

                case 10:
                case 'end':
                  return _context4.stop()
              }
            }
          }, _callee3)
        }))()
      },
      verify: function verify () {
        var _arguments = arguments
        var _this19 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee4 () {
          var verify, _pro2, tasks, _loop6, i

          return regeneratorRuntime.wrap(function _callee4$ (_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  verify = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : false

                  if (!verify) {
                    _context6.next = 14
                    break
                  }

                  _pro2 = []
                  tasks = fuc.unique(_this19.tasks)
                  _loop6 = /* #__PURE__ */regeneratorRuntime.mark(function _loop6 (i) {
                    var task, status
                    return regeneratorRuntime.wrap(function _loop6$ (_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            task = tasks[i]
                            status = fuc.echoLog({
                              type: 'custom',
                              text: '<li>'.concat(getI18n('verifyingTask'), '<a href="/giveaway/click/').concat(task.taskId, '" target="_blank">').concat(task.taskDes.trim(), '</a>...<font></font></li>')
                            })

                            _pro2.push(new Promise(function (resolve) {
                              fuc.httpRequest({
                                url: '/api/v1/giveaway/sendtask',
                                method: 'POST',
                                dataType: 'json',
                                headers: {
                                  'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                                  'x-csrf-token': $('meta[name="csrf-token"]').attr('content')
                                },
                                data: 'task_id=' + task.taskId,
                                onload: function onload (response) {
                                  if (debug) console.log(response)

                                  if (response.response) {
                                    if (response.response.status === 'success') {
                                      status.success()
                                      $('div.task-reward[href="#task-'.concat(task.taskId, '-collapse"]')).html('<svg class="nc-icon nc-align-to-text grid-24 glyph"><use xlink:href="/icons/nci-fill.svg#nc-icon-check-simple" /></svg>')
                                      resolve({
                                        result: 'success',
                                        statusText: response.statusText,
                                        status: response.status
                                      })
                                    } else {
                                      status.error('Error:' + (response.response.message || response.statusText || response.status || 'error'))
                                      if (globalConf.other.autoOpen) window.open('/giveaway/click/'.concat(task.taskId), '_blank')
                                      resolve({
                                        result: 'error',
                                        statusText: response.statusText,
                                        status: response.status
                                      })
                                    }
                                  } else {
                                    status.error('Error:' + response.statusText)
                                    resolve({
                                      result: 'error',
                                      statusText: response.statusText,
                                      status: response.status
                                    })
                                  }
                                },
                                r: resolve,
                                status: status
                              })
                            }))

                            _context5.next = 5
                            return new Promise(function (resolve) {
                              setTimeout(function () {
                                resolve()
                              }, 1000)
                            })

                          case 5:
                          case 'end':
                            return _context5.stop()
                        }
                      }
                    }, _loop6)
                  })
                  i = 0

                case 6:
                  if (!(i < tasks.length)) {
                    _context6.next = 11
                    break
                  }

                  return _context6.delegateYield(_loop6(i), 't0', 8)

                case 8:
                  i++
                  _context6.next = 6
                  break

                case 11:
                  Promise.all(_pro2).finally(function () {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="success">'.concat(getI18n('verifyTasksComplete'), '</font></li>')
                    })
                  })
                  _context6.next = 15
                  break

                case 14:
                  _this19.get_tasks('verify')

                case 15:
                case 'end':
                  return _context6.stop()
              }
            }
          }, _callee4)
        }))()
      },
      remove: function remove () {
        var remove = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false
        fuc.echoLog({
          type: 'custom',
          text: '<li><font class="success">'.concat(getI18n('cannotRemove'), '</font></li>')
        })
      },
      get_giveawayId: function get_giveawayId () {
        var id = window.location.href.match(/\/giveaway\/([\d]+)/)
        return id ? id[1] : window.location.href
      },
      checkLeft: function checkLeft (ui) {
        if ($('.giveaway-counter:first .strong').text() === '0') {
          ui.$confirm(getI18n('noKeysLeft'), getI18n('notice'), {
            confirmButtonText: getI18n('confirm'),
            cancelButtonText: getI18n('cancel'),
            type: 'warning',
            center: true
          }).then(function () {
            window.close()
          })
        }
      },
      groups: [],
      // 任务需要加的组
      taskInfo: {
        groups: [] // 所有任务需要加的组

      },
      tasks: [],
      // 任务信息
      setting: {
        fuck: true,
        verify: true,
        join: false,
        remove: true
      },
      conf: ((_GM_getValue3 = GM_getValue('conf')) === null || _GM_getValue3 === void 0 ? void 0 : (_GM_getValue3$gamehag = _GM_getValue3.gamehag) === null || _GM_getValue3$gamehag === void 0 ? void 0 : _GM_getValue3$gamehag.load) ? GM_getValue('conf').gamehag : ((_GM_getValue4 = GM_getValue('conf')) === null || _GM_getValue4 === void 0 ? void 0 : _GM_getValue4.global) || defaultConf
    }
    var giveawaysu = {
      test: function test () {
        return window.location.host.includes('giveaway.su')
      },
      get_tasks: function get_tasks (e) {
        // 获取任务信息
        var taskInfo = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')

        if (taskInfo && !fuc.isEmptyObjArr(taskInfo) && e === 'remove') {
          this.taskInfo = taskInfo
          this.do_task('remove')
        } else {
          if (taskInfo && !fuc.isEmptyObjArr(taskInfo)) this.taskInfo = taskInfo
          var status = fuc.echoLog({
            type: 'custom',
            text: '<li>'.concat(getI18n('getTasksInfo'), '<font></font></li>')
          })
          var tasks = $('#actions tr')

          var _iterator7 = _createForOfIteratorHelper(tasks)
          var _step7

          try {
            for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
              var task = _step7.value
              var taskDes = $(task).find('td').eq(1).find('a:not([data-trigger="link"])')

              var _taskInfo = this.which_task(taskDes)

              var _iterator8 = _createForOfIteratorHelper(_taskInfo)
              var _step8

              try {
                for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                  var info = _step8.value

                  if (info.name !== 'nonSteam' && this.taskInfo[info.name + 's']) {
                    this.taskInfo[info.name + 's'].push(info.link)
                    this.taskInfo.links.push(info.link)
                  }
                }
              } catch (err) {
                _iterator8.e(err)
              } finally {
                _iterator8.f()
              }
            }
          } catch (err) {
            _iterator7.e(err)
          } finally {
            _iterator7.f()
          }

          status.success()
          this.getFinalUrl(e)
        }
      },
      which_task: function which_task (taskDes) {
        var taskInfo = []
        var taskName = taskDes.text().trim()
        var link = taskDes.attr('href')

        if (/disable adblock/gim.test(taskName)) {
          return [{
            name: 'nonSteam'
          }]
        } else if (/join.*group/gim.test(taskName)) {
          taskInfo.push({
            name: 'group',
            link: link
          })
          this.community = 1
        } else if (/like.*announcement/gim.test(taskName)) {
          taskInfo.push({
            name: 'announcement',
            link: link
          })
          this.community = 1
        } else if (/follow.*publisher/gim.test(taskName)) {
          taskInfo.push({
            name: 'publisher',
            link: link
          })
          this.store = 1
        } else if (/follow.*developer/gim.test(taskName)) {
          taskInfo.push({
            name: 'developer',
            link: link
          })
          this.store = 1
        } else if (/follow.*curator|subscribe.*curator/gim.test(taskName)) {
          taskInfo.push({
            name: 'curator',
            link: link
          })
          this.store = 1
        } else {
          if (/(Subscribe.*YouTube)|(Like.*YouTube)|(Follow.*Instagram)|(on twitter)|(Join.*Discord.*server)|(Follow.*on.*Facebook)/gim.test(taskName)) {
            this.links.push(link)
          } else {
            if (/wishlist.*game|add.*wishlist/gim.test(taskName)) {
              taskInfo.push({
                name: 'wGame',
                link: link
              })
              this.store = 1
            }

            if (/follow.*button/gim.test(taskName)) {
              taskInfo.push({
                name: 'fGame',
                link: link
              })
              this.store = 1
            }
          }

          if (taskInfo.length === 0) {
            return [{
              name: 'nonSteam'
            }]
          }
        }

        return taskInfo
      },
      getFinalUrl: function getFinalUrl (e) {
        var _this20 = this

        // 处理任务链接
        var status = fuc.echoLog({
          type: 'custom',
          text: '<li>'.concat(getI18n('processTasksUrl'), '<font></font></li>')
        })
        var pro = []

        var _iterator9 = _createForOfIteratorHelper(this.taskInfo.links)
        var _step9

        try {
          var _loop7 = function _loop7 () {
            var link = _step9.value
            pro.push(new Promise(function (resolve) {
              if (_this20.taskInfo.toFinalUrl[link]) {
                resolve({
                  result: 'success'
                })
              } else {
                fuc.getFinalUrl(resolve, link)
              }
            }))
          }

          for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
            _loop7()
          }
        } catch (err) {
          _iterator9.e(err)
        } finally {
          _iterator9.f()
        }

        Promise.all(pro).then(function (data) {
          var _iterator10 = _createForOfIteratorHelper(data)
          var _step10

          try {
            for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
              var r = _step10.value

              if (r.finalUrl) {
                _this20.taskInfo.toFinalUrl[r.url] = r.finalUrl
              }
            }
          } catch (err) {
            _iterator10.e(err)
          } finally {
            _iterator10.f()
          }

          _this20.links = fuc.unique(_this20.links)
          _this20.taskInfo.groups = fuc.unique(_this20.taskInfo.groups)
          _this20.taskInfo.curators = fuc.unique(_this20.taskInfo.curators)
          _this20.taskInfo.publishers = fuc.unique(_this20.taskInfo.publishers)
          _this20.taskInfo.developers = fuc.unique(_this20.taskInfo.developers)
          _this20.taskInfo.fGames = fuc.unique(_this20.taskInfo.fGames)
          _this20.taskInfo.wGames = fuc.unique(_this20.taskInfo.wGames)
          _this20.taskInfo.announcements = fuc.unique(_this20.taskInfo.announcements)
          _this20.taskInfo.links = fuc.unique(_this20.taskInfo.links) // 任务链接处理完成

          GM_setValue('taskInfo[' + window.location.host + _this20.get_giveawayId() + ']', _this20.taskInfo)
          status.success()
          if (debug) console.log(_this20)
          e === 'doTask' ? _this20.do_task('fuck') : _this20.do_task('remove')
        }).catch(function (error) {
          status.error()
          if (debug) console.log(error)
        })
      },
      do_task: function do_task (act) {
        var _this21 = this

        if ($('div.bind-discord').is(':visible')) $('div.bind-discord a')[0].click()
        if ($('div.bind-twitch').is(':visible')) $('div.bind-twitch a')[0].click()
        new Promise(function (resolve) {
          if (_this21.taskInfo.groups.length > 0 || _this21.taskInfo.announcements.length > 0) {
            if (_this21.taskInfo.curators.length > 0 || _this21.taskInfo.publishers.length > 0 || _this21.taskInfo.developers.length > 0 || _this21.taskInfo.fGames.length > 0 || _this21.taskInfo.wGames.length > 0) {
              fuc.updateSteamInfo(resolve, 'all')
            } else {
              fuc.updateSteamInfo(resolve, 'community')
            }
          } else if (_this21.taskInfo.curators.length > 0 || _this21.taskInfo.publishers.length > 0 || _this21.taskInfo.developers.length > 0 || _this21.taskInfo.fGames.length > 0 || _this21.taskInfo.wGames.length > 0) {
            fuc.updateSteamInfo(resolve, 'store')
          } else {
            resolve(1)
          }
        }).then(function (s) {
          if (s === 1) {
            var _pro3 = []

            if (_this21.conf.fuck.joinSteamGroup && _this21.taskInfo.groups.length > 0) {
              _pro3.push(new Promise(function (resolve) {
                fuc.toggleActions({
                  website: 'giveawaysu',
                  type: 'group',
                  elements: _this21.taskInfo.groups,
                  resolve: resolve,
                  action: act,
                  toFinalUrl: _this21.taskInfo.toFinalUrl
                })
              }))
            }

            if (_this21.conf.fuck.followCurator && _this21.taskInfo.curators.length > 0) {
              _pro3.push(new Promise(function (resolve) {
                fuc.toggleActions({
                  website: 'giveawaysu',
                  type: 'curator',
                  elements: _this21.taskInfo.curators,
                  resolve: resolve,
                  action: act,
                  toFinalUrl: _this21.taskInfo.toFinalUrl
                })
              }))
            }

            if (_this21.conf.fuck.followPublisher && _this21.taskInfo.publishers.length > 0) {
              _pro3.push(new Promise(function (resolve) {
                fuc.toggleActions({
                  website: 'giveawaysu',
                  type: 'publisher',
                  elements: _this21.taskInfo.publishers,
                  resolve: resolve,
                  action: act,
                  toFinalUrl: _this21.taskInfo.toFinalUrl
                })
              }))
            }

            if (_this21.conf.fuck.followDeveloper && _this21.taskInfo.developers.length > 0) {
              _pro3.push(new Promise(function (resolve) {
                fuc.toggleActions({
                  website: 'giveawaysu',
                  type: 'developer',
                  elements: _this21.taskInfo.developers,
                  resolve: resolve,
                  action: act,
                  toFinalUrl: _this21.taskInfo.toFinalUrl
                })
              }))
            }

            if (_this21.conf.fuck.followGame && _this21.taskInfo.fGames.length > 0) {
              _pro3.push(new Promise(function (resolve) {
                fuc.toggleActions({
                  website: 'giveawaysu',
                  type: 'game',
                  elements: _this21.taskInfo.fGames,
                  resolve: resolve,
                  action: act,
                  toFinalUrl: _this21.taskInfo.toFinalUrl
                })
              }))
            }

            if (_this21.conf.fuck.addToWishlist && _this21.taskInfo.wGames.length > 0) {
              _pro3.push(new Promise(function (resolve) {
                fuc.toggleActions({
                  website: 'giveawaysu',
                  type: 'wishlist',
                  elements: _this21.taskInfo.wGames,
                  resolve: resolve,
                  action: act,
                  toFinalUrl: _this21.taskInfo.toFinalUrl
                })
              }))
            }

            if (_this21.conf.fuck.likeAnnouncement && _this21.taskInfo.announcements.length > 0) {
              _pro3.push(new Promise(function (resolve) {
                fuc.toggleActions({
                  website: 'giveawaysu',
                  type: 'announcement',
                  elements: _this21.taskInfo.announcements,
                  resolve: resolve,
                  action: act,
                  toFinalUrl: _this21.taskInfo.toFinalUrl
                })
              }))
            }

            Promise.all(_pro3).finally(function () {
              fuc.echoLog({
                type: 'custom',
                text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
              })
              if (act === 'fuck') {
                fuc.echoLog({
                  type: 'custom',
                  text: '<li><font class="warning">'.concat(getI18n('closeExtensions'), '</font></li>')
                })
              }
            })
          }
        })
      },
      fuck: function fuck () {
        this.get_tasks('doTask')
      },
      verify: function verify () {},
      remove: function remove () {
        this.get_tasks('remove')
      },
      get_giveawayId: function get_giveawayId () {
        var id = window.location.href.match(/view\/([\d]+)/)
        return (id === null || id === void 0 ? void 0 : id[1]) || window.location.href
      },
      checkLogin: function checkLogin () {
        if ($('a.steam-login').length > 0) window.open('/steam/redirect', '_self')
      },
      checkLeft: function checkLeft (ui) {
        if ($('.giveaway-ended').length > 0) {
          ui.$confirm(getI18n('noKeysLeft'), getI18n('notice'), {
            confirmButtonText: getI18n('confirm'),
            cancelButtonText: getI18n('cancel'),
            type: 'warning',
            center: true
          }).then(function () {
            window.close()
          })
        }
      },
      community: 0,
      store: 0,
      links: [],
      // 非steam任务
      taskInfo: {
        groups: [],
        // 任务需要加的组
        curators: [],
        // 任务需要关注的鉴赏家
        publishers: [],
        // 任务需要关注的发行商
        developers: [],
        // 任务需要关注的开发商
        fGames: [],
        // 任务需要关注的游戏
        wGames: [],
        // 任务需要加愿望单的游戏
        announcements: [],
        // 任务需要点赞的通知
        links: [],
        // 原始链接
        toFinalUrl: {} // 链接转换

      },
      setting: {
        fuck: true,
        verify: false,
        remove: true
      },
      conf: (config === null || config === void 0 ? void 0 : (_config$giveawaysu = config.giveawaysu) === null || _config$giveawaysu === void 0 ? void 0 : _config$giveawaysu.load) ? config.giveawaysu : globalConf
    }
    var givekey = {
      test: function test () {
        return window.location.host.includes('gkey') || window.location.host.includes('givekey')
      },
      before: function before (website) {
        var init = setInterval(function () {
          try {
            if (typeof Centrifuge !== 'undefined') {
              clearInterval(init)
              website.creat_app()
            }
          } catch (e) {}
        }, 500)
      },
      after: function after () {
        $('#verify-task').addClass('is-disabled').attr('disabled', 'disabled')
      },
      fuck: function fuck (btnArea) {
        var transBtn = $('.yt-button__icon.yt-button__icon_type_right')
        if (transBtn.css('background-position') === '-68px 0px') transBtn[0].click()
        fuc.echoLog({
          type: 'custom',
          text: '<li><font class="error">'.concat(getI18n('changeLanguage'), '</font></li>')
        })
        givekey.wssApp.message = btnArea.$message({
          message: getI18n('connectWss'),
          duration: 0
        })
        $(function () {
          return givekey.wssApp.init(btnArea)
        })
        fuc.echoLog({
          type: 'custom',
          text: '<li><font class="warning">'.concat(getI18n('connectWssWait'), '</font></li>')
        })
        fuc.echoLog({
          type: 'custom',
          text: '<li><font class="warning">'.concat(getI18n('beforeFuck'), '</font></li>')
        })
        fuc.echoLog({
          type: 'custom',
          text: '<li><font class="error">'.concat(getI18n('gkrobot'), '</font></li>')
        })
        window.open($('a[id^="task_"').attr('href'), '_blank')
      },
      analyze_tasks: function analyze_tasks (tasks) {
        var _this22 = this

        var status = fuc.echoLog({
          type: 'custom',
          text: '<li>'.concat(getI18n('processTasksUrl'), '<font></font></li>')
        })
        var pro = []
        this.groups = []
        this.wGames = []
        this.fGames = []
        this.links = []
        var taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
        if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory

        var _iterator11 = _createForOfIteratorHelper(tasks)
        var _step11

        try {
          var _loop8 = function _loop8 () {
            var id = _step11.value
            var task = $('#task_' + id)
            var href = task.attr('href')

            if (href.includes('vk.com')) {} else if (href.includes('steamcommunity.com/groups')) {
              _this22.groups.push(href.match(/groups\/(.+)/)[1])

              _this22.taskInfo.groups.push(href.match(/groups\/(.+)/)[1])
            } else if (/Add to wishlist|加入愿望单/i.test(task.text())) {
              pro.push(new Promise(function (r) {
                new Promise(function (resolve) {
                  fuc.getFinalUrl(resolve, href)
                }).then(function (data) {
                  if (data.result === 'success') {
                    var appId = data.finalUrl.match(/app\/([\d]+)/)

                    if (appId) {
                      _this22.wGames.push(appId[1])

                      _this22.taskInfo.wGames.push(appId[1])

                      r(1)
                    } else {
                      r(0)
                    }
                  } else {
                    r(0)
                  }
                })
              }))
            } else if (href.includes('store.steampowered.com/app')) {
              _this22.fGames.push(href.match(/app\/([\d]+)/)[1])

              _this22.taskInfo.fGames.push(href.match(/app\/([\d]+)/)[1])
            } else {
              _this22.links.push(href)
            }
          }

          for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
            _loop8()
          }
        } catch (err) {
          _iterator11.e(err)
        } finally {
          _iterator11.f()
        }

        Promise.all(pro).finally(function () {
          _this22.groups = fuc.unique(_this22.groups)
          _this22.wGames = fuc.unique(_this22.wGames)
          _this22.fGames = fuc.unique(_this22.fGames)
          _this22.links = fuc.unique(_this22.links)
          _this22.taskInfo.groups = fuc.unique(_this22.taskInfo.groups)
          _this22.taskInfo.fGames = fuc.unique(_this22.taskInfo.fGames)
          _this22.taskInfo.wGames = fuc.unique(_this22.taskInfo.wGames)

          if (_this22.groups.length > 0 || _this22.fGames.length > 0 || _this22.links.length > 0 || _this22.wGames.length > 0) {
            _this22.do_task()
          } else {
            fuc.echoLog({
              type: 'custom',
              text: '<li><font class="warning">'.concat(getI18n('noAutoFinish'), '</font></li>')
            })
          }

          GM_setValue('taskInfo[' + window.location.host + _this22.get_giveawayId() + ']', _this22.taskInfo)
          status.success()
          if (debug) console.log(_this22)
        })
      },
      get_tasks: function get_tasks () {
        var _this23 = this

        var taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')

        if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
          this.taskInfo = taskInfoHistory
          this.remove(true)
        } else {
          var _pro4 = []
          var status = fuc.echoLog({
            type: 'custom',
            text: '<li>'.concat(getI18n('getTasksInfo'), '<font></font></li>')
          })
          var tasksContainer = $('a[id^=task_]')

          var _iterator12 = _createForOfIteratorHelper(tasksContainer)
          var _step12

          try {
            var _loop9 = function _loop9 () {
              var task = _step12.value
              // 遍历任务信息
              var href = task.attr('href')

              if (href.includes('vk.com')) {} else if (href.includes('steamcommunity.com/groups/')) {
                _this23.taskInfo.groups.push(href.match(/groups\/(.+)/)[1])
              } else if (/Add to wishlist|加入愿望单/i.test(task.text())) {
                _pro4.push(new Promise(function (r) {
                  new Promise(function (resolve) {
                    fuc.getFinalUrl(resolve, href)
                  }).then(function (data) {
                    if (data.result === 'success') {
                      var appId = data.finalUrl.match(/app\/([\d]+)/)

                      if (appId) {
                        _this23.wGames.push(appId[1])

                        _this23.taskInfo.wGames.push(appId[1])

                        r(1)
                      } else {
                        r(0)
                      }
                    } else {
                      r(0)
                    }
                  })
                }))
              } else if (href.includes('store.steampowered.com/app/')) {
                _this23.taskInfo.fGames.push(href.match(/app\/([\d]+)/)[1])
              }
            }

            for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
              _loop9()
            }
          } catch (err) {
            _iterator12.e(err)
          } finally {
            _iterator12.f()
          }

          Promise.all(_pro4).finally(function () {
            _this23.taskInfo.groups = fuc.unique(_this23.taskInfo.groups)
            _this23.taskInfo.curators = fuc.unique(_this23.taskInfo.curators)
            _this23.taskInfo.wGames = fuc.unique(_this23.taskInfo.wGames)
            GM_setValue('taskInfo[' + window.location.host + _this23.get_giveawayId() + ']', _this23.taskInfo)
            status.success()
            if (debug) console.log(_this23)

            if (_this23.taskInfo.groups.length > 0 || _this23.taskInfo.curators.length > 0 || _this23.taskInfo.wGames.length > 0) {
              _this23.remove(true)
            } else {
              fuc.echoLog({
                type: 'custom',
                text: '<li><font class="warning">'.concat(getI18n('cannotRemove'), '</font></li>')
              })
            }
          })
        }
      },
      do_task: function do_task () {
        var _this24 = this

        this.updateSteamInfo(function () {
          var pro = []
          var groups = fuc.unique(_this24.groups)
          var fGames = fuc.unique(_this24.fGames)
          var wGames = fuc.unique(_this24.wGames)
          var curators = fuc.unique(_this24.curators)
          var links = fuc.unique(_this24.links)

          if (_this24.conf.fuck.group) {
            var _iterator13 = _createForOfIteratorHelper(groups)
            var _step13

            try {
              var _loop10 = function _loop10 () {
                var group = _step13.value
                pro.push(new Promise(function (resolve) {
                  fuc.joinSteamGroup(resolve, group)
                }))
              }

              for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
                _loop10()
              }
            } catch (err) {
              _iterator13.e(err)
            } finally {
              _iterator13.f()
            }
          }

          if (_this24.conf.fuck.wishlist) {
            var _iterator14 = _createForOfIteratorHelper(wGames)
            var _step14

            try {
              var _loop11 = function _loop11 () {
                var game = _step14.value
                pro.push(new Promise(function (resolve) {
                  fuc.addWishlist(resolve, game)
                }))
              }

              for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
                _loop11()
              }
            } catch (err) {
              _iterator14.e(err)
            } finally {
              _iterator14.f()
            }
          }

          if (_this24.conf.fuck.followGame) {
            var _iterator15 = _createForOfIteratorHelper(fGames)
            var _step15

            try {
              var _loop12 = function _loop12 () {
                var game = _step15.value
                pro.push(new Promise(function (resolve) {
                  fuc.followGame(resolve, game)
                }))
              }

              for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
                _loop12()
              }
            } catch (err) {
              _iterator15.e(err)
            } finally {
              _iterator15.f()
            }
          }

          if (_this24.conf.fuck.curator) {
            var _iterator16 = _createForOfIteratorHelper(curators)
            var _step16

            try {
              var _loop13 = function _loop13 () {
                var curator = _step16.value
                pro.push(new Promise(function (resolve) {
                  fuc.followCurator(resolve, curator)
                }))
              }

              for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
                _loop13()
              }
            } catch (err) {
              _iterator16.e(err)
            } finally {
              _iterator16.f()
            }
          }

          if (_this24.conf.fuck.visit) {
            var _iterator17 = _createForOfIteratorHelper(links)
            var _step17

            try {
              var _loop14 = function _loop14 () {
                var link = _step17.value
                pro.push(new Promise(function (resolve) {
                  fuc.visitLink(resolve, link)
                }))
              }

              for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
                _loop14()
              }
            } catch (err) {
              _iterator17.e(err)
            } finally {
              _iterator17.f()
            }
          }

          Promise.all(pro).finally(function () {
            fuc.echoLog({
              type: 'custom',
              text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
            })
          })
        })
      },
      verify: function verify () {
        givekey.wssApp.status = fuc.echoLog({
          type: 'custom',
          text: '<li>'.concat(getI18n('getTaskStatus'), '<font></font></li>')
        })
        givekey.wssApp.request('/distribution/check', 'post', {
          id: window.location.href.match(/[\d]+/)[0],
          g_captcha: $('[name="g-recaptcha-response"]').val()
        })
      },
      remove: function remove () {
        var _this25 = this

        var remove = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false
        var pro = []

        if (remove) {
          this.updateSteamInfo(function () {
            if (_this25.conf.remove.group) {
              var _iterator18 = _createForOfIteratorHelper(fuc.unique(_this25.taskInfo.groups))
              var _step18

              try {
                var _loop15 = function _loop15 () {
                  var group = _step18.value
                  pro.push(new Promise(function (resolve) {
                    fuc.leaveSteamGroup(resolve, group)
                  }))
                }

                for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
                  _loop15()
                }
              } catch (err) {
                _iterator18.e(err)
              } finally {
                _iterator18.f()
              }
            }

            if (_this25.conf.remove.unfollowGame) {
              var _iterator19 = _createForOfIteratorHelper(fuc.unique(_this25.taskInfo.fGames))
              var _step19

              try {
                var _loop16 = function _loop16 () {
                  var game = _step19.value
                  pro.push(new Promise(function (resolve) {
                    fuc.unfollowCurator(resolve, game)
                  }))
                }

                for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
                  _loop16()
                }
              } catch (err) {
                _iterator19.e(err)
              } finally {
                _iterator19.f()
              }
            }

            if (_this25.conf.remove.wishlist) {
              var _iterator20 = _createForOfIteratorHelper(fuc.unique(_this25.taskInfo.wGames))
              var _step20

              try {
                var _loop17 = function _loop17 () {
                  var game = _step20.value
                  pro.push(new Promise(function (resolve) {
                    fuc.removeWishlist(resolve, game)
                  }))
                }

                for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {
                  _loop17()
                }
              } catch (err) {
                _iterator20.e(err)
              } finally {
                _iterator20.f()
              }
            }

            if (_this25.conf.remove.curator) {
              var _iterator21 = _createForOfIteratorHelper(fuc.unique(_this25.taskInfo.curators))
              var _step21

              try {
                var _loop18 = function _loop18 () {
                  var curator = _step21.value
                  pro.push(new Promise(function (resolve) {
                    fuc.unfollowCurator(resolve, curator)
                  }))
                }

                for (_iterator21.s(); !(_step21 = _iterator21.n()).done;) {
                  _loop18()
                }
              } catch (err) {
                _iterator21.e(err)
              } finally {
                _iterator21.f()
              }
            }

            Promise.all(pro).finally(function () {
              fuc.echoLog({
                type: 'custom',
                text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
              })
            })
          })
        } else {
          this.get_tasks('remove')
        }
      },
      creat_app: function creat_app () {
        this.wssApp = {
          status: {},
          message: {},
          loading: false,
          centrifuge: new Centrifuge(/givekey.ru/.test(window.location.href) ? 'wss://app.givekey.ru/connection/websocket' : 'wss://app.gkey.fun/connection/websocket'),
          uid: $('meta[name="uid"]').attr('content'),
          init: function init (m) {
            this.centrifuge.setToken($('meta[name="cent_token"]').attr('content'))
            this.centrifuge.connect()
            this.centrifuge.on('connect', function (e) {
              if (debug) console.log(getI18n('wssConnected'))
              $('#verify-task').removeClass('is-disabled').removeAttr('disabled')
              givekey.wssApp.message.close()
              m.$message({
                message: getI18n('wssConnectSuccess'),
                type: 'success'
              })

              var _iterator22 = _createForOfIteratorHelper($('a[id^=task_]'))
              var _step22

              try {
                for (_iterator22.s(); !(_step22 = _iterator22.n()).done;) {
                  var a = _step22.value
                  $(a).html($(a).html().replace('Посмотреть обзор на игру', '查看游戏评论').replace('Подписаться на разработчика', '订阅开发商').replace('Подписаться на куратора', '订阅鉴赏家').replace('Поставить лайк', '点赞').replace('Подписаться на игру', '关注游戏').replace(/Subscribe|Подписаться/, '订阅/加组').replace('Сделать репост', '转发').replace('Добавить в список желаемого', '加入愿望单').replace('Сделать обзор на игру', '评论').replace('Посетить web-сайт', '访问页面'))
                }
              } catch (err) {
                _iterator22.e(err)
              } finally {
                _iterator22.f()
              }
            })
            this.centrifuge.on('disconnect', function (e) {
              if (debug) console.log(''.concat(getI18n('wssDisconnected'), '\n').concat(e.reason))
              $('#verify-task').addClass('is-disabled').attr('disabled', 'disabled')
              givekey.wssApp.message = m.$message({
                message: getI18n('wssReconnect'),
                type: 'warning',
                duration: 0
              })
            })

            if (this.uid) {
              this.centrifuge.subscribe('usr#'.concat(this.uid), function (data) {
                if (debug) console.log(data)
                givekey.wssApp.status.success()

                if (data.data.js) {
                  var taskA = data.data.js.split(';')

                  if (taskA) {
                    var tasks = []
                    taskA.map(function (e) {
                      if (e.includes('btn-danger')) tasks.push(e.match(/[\d]+/)[0])
                    })
                    givekey.analyze_tasks(tasks)
                  }
                }
              })
            }
          },
          request: function request (url, type, data, page) {
            if (url) {
              data = data || {}
              type = type || 'post'

              if (type.toLowerCase() === 'get') {
                if (givekey.wssApp.loading) {
                  return
                }

                givekey.wssApp.loading = !0
              }

              $.ajax({
                url: url,
                type: type,
                data: data,
                headers: {
                  'x-csrf-token': $('meta[name="csrf-token"]').attr('content')
                },
                success: function success (data) {
                  if (debug) console.log(data)
                  if (data.msg && !data.msg.data.includes('Проверяем! Пожалуйста подождите')) givekey.wssApp.status.error(data.msg.data.replace('Вы уже участвовали в этой раздаче!', '你已经参与了此赠key!'))
                },
                error: function error (e) {
                  if (debug) console.log(e)

                  switch (e.status) {
                    case 401:
                      givekey.wssApp.status.error(getI18n('noLogin'))
                      break

                    case 403:
                      givekey.wssApp.status.error(getI18n('accessDenied'))
                      break

                    case 404:
                      givekey.wssApp.status.error(getI18n('notFound'))
                      break

                    case 500:
                      givekey.wssApp.status.error(getI18n('serverError'))
                      break

                    case 503:
                      givekey.wssApp.status.error(getI18n('errorRefresh'))
                      break

                    default:
                      givekey.wssApp.status.error('Error:' + e.status)
                      break
                  }

                  givekey.wssApp.loading = !1
                }
              })
            }
          }
        }
      },
      get_giveawayId: function get_giveawayId () {
        var id = window.location.href.match(/distribution\/([\d]+)/)
        return id ? id[1] : window.location.href
      },
      updateSteamInfo: function updateSteamInfo (callback) {
        var _this26 = this

        new Promise(function (resolve) {
          if (_this26.taskInfo.groups.length > 0) {
            if (_this26.taskInfo.curators.length > 0 || _this26.taskInfo.fGames.length > 0 || _this26.taskInfo.wGames.length > 0) {
              fuc.updateSteamInfo(resolve, 'all')
            } else {
              fuc.updateSteamInfo(resolve, 'community')
            }
          } else if (_this26.taskInfo.curators.length > 0 || _this26.taskInfo.fGames.length > 0 || _this26.taskInfo.wGames.length > 0) {
            fuc.updateSteamInfo(resolve, 'store')
          } else {
            resolve(1)
          }
        }).then(function (s) {
          if (s === 1) callback()
        }).catch(function (err) {
          console.error(err)
        })
      },
      checkLogin: function checkLogin () {
        if ($("a[href='/auth']").length > 0) window.open('/auth/steam', '_self')
      },
      checkLeft: function checkLeft (ui) {
        if ($('#keys_count').text() === '0') {
          ui.$confirm(getI18n('noKeysLeft'), getI18n('notice'), {
            confirmButtonText: getI18n('confirm'),
            cancelButtonText: getI18n('cancel'),
            type: 'warning',
            center: true
          }).then(function () {
            window.close()
          })
        }
      },
      groups: [],
      // 任务需要加的组
      curators: [],
      // 任务需要关注的鉴赏家
      fGames: [],
      // 任务需要关注的游戏
      wGames: [],
      // 任务需要加愿望单的游戏
      links: [],
      // 需要浏览的页面链接
      taskInfo: {
        groups: [],
        // 所有任务需要加的组
        curators: [],
        // 所有任务需要关注的鉴赏家
        fGames: [],
        // 所有任务需要关注的游戏
        wGames: [] // 所有任务需要加愿望单的游戏

      },
      tasks: [],
      // 任务信息
      setting: {
        fuck: true,
        fuckText: 'Init',
        fuckTitle: getI18n('initFirst'),
        verify: true,
        verifyText: 'Fuck',
        verifyTitle: getI18n('initPlease'),
        join: false,
        remove: true
      },
      conf: ((_GM_getValue5 = GM_getValue('conf')) === null || _GM_getValue5 === void 0 ? void 0 : (_GM_getValue5$givekey = _GM_getValue5.givekey) === null || _GM_getValue5$givekey === void 0 ? void 0 : _GM_getValue5$givekey.load) ? GM_getValue('conf').givekey : ((_GM_getValue6 = GM_getValue('conf')) === null || _GM_getValue6 === void 0 ? void 0 : _GM_getValue6.global) || defaultConf
    }
    var gleam = {
      test: function test () {
        return window.location.host.includes('gleam.io')
      },
      fuck: function fuck () {
        this.get_tasks('do_task')
      },
      get_tasks: function get_tasks () {
        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'do_task'
        var taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
        if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory

        if (callback === 'remove' && taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
          this.remove(true)
        } else {
          this.twitters = []
          this.facebooks = []
          this.youtubes = []
          this.discords = []
          this.others = []
          this.groups = []
          this.links = []
          var status = fuc.echoLog({
            type: 'custom',
            text: '<li>'.concat(getI18n('getTasksInfo'), '<font></font></li>')
          })
          var tasksContainer = $('div.entry-content .entry-method')

          var _iterator23 = _createForOfIteratorHelper(tasksContainer)
          var _step23

          try {
            for (_iterator23.s(); !(_step23 = _iterator23.n()).done;) {
              var task = _step23.value

              // 遍历任务信息
              if ($(task).find('i.fa-question').length > 0) {
                if ($(task).hasClass('visit') || $(task).find('span:contains(Visit):contains(seconds)').length > 0) {
                  this.links.push(task)
                } else {
                  var icon = $(task).find('.icon-wrapper i')

                  if (icon.hasClass('fa-twitter')) {
                    this.twitters.push(task)
                  } else if (icon.hasClass('fa-facebook')) {
                    this.facebooks.push(task)
                  } else if (icon.hasClass('fa-youtube')) {
                    this.youtubes.push(task)
                  } else if (icon.hasClass('fa-discord')) {
                    this.discords.push(task)
                  } else if (icon.hasClass('fa-steam') || icon.hasClass('fa-steam-symbol')) {
                    var title = $(task).find('.entry-method-title')

                    if (/join.*group/gim.test(title.text())) {
                      var groupA = $(task).find("a[href*='steamcommunity.com/groups']:first").attr('href')

                      if (groupA) {
                        var groupName = groupA.match(/steamcommunity.com\/groups\/([\w\d\-_]*)/)[1]
                        this.groups.push(groupName)
                        this.taskInfo.groups.push(groupName)
                      } else {
                        fuc.echoLog({
                          type: 'custom',
                          text: '<li><font class="error">'.concat(getI18n('getGroupFailed'), '</font></li>')
                        })
                      }
                    } else {
                      this.others.push(task)
                    }
                  } else {
                    this.others.push(task)
                  }
                }
              } else if (callback === 'remove') {
                var _icon = $(task).find('.icon-wrapper i')

                if (_icon.hasClass('fa-steam')) {
                  var _title = $(task).find('.entry-method-title')

                  if (/join.*group/gim.test(_title.text())) {
                    var _groupA = $(task).find("a[href*='steamcommunity.com/groups']:first").attr('href')

                    if (_groupA) {
                      var _groupName = _groupA.match(/steamcommunity.com\/groups\/([\w\d\-_]*)/)[1]

                      this.taskInfo.groups.push(_groupName)
                    } else {
                      fuc.echoLog({
                        type: 'custom',
                        text: '<li><font class="error">'.concat(getI18n('getGroupFailed'), '</font></li>')
                      })
                    }
                  }
                }
              }
            }
          } catch (err) {
            _iterator23.e(err)
          } finally {
            _iterator23.f()
          }

          this.groups = fuc.unique(this.groups)
          this.twitters = fuc.unique(this.twitters)
          this.facebooks = fuc.unique(this.facebooks)
          this.youtubes = fuc.unique(this.youtubes)
          this.discords = fuc.unique(this.discords)
          this.groups = fuc.unique(this.groups)
          this.others = fuc.unique(this.others)
          this.taskInfo.groups = fuc.unique(this.taskInfo.groups)
          GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
          status.success()
          if (debug) console.log(this)

          if (callback === 'do_task') {
            this.do_task()
          } else if (callback === 'verify') {
            this.verify(true)
          } else {
            !fuc.isEmptyObjArr(this.taskInfo) ? this.remove(true) : fuc.echoLog({
              type: 'custom',
              text: '<li><font class="warning">'.concat(getI18n('cannotRemove'), '</font></li>')
            })
          }
        }
      },
      do_task: function do_task () {
        var _this27 = this

        this.updateSteamInfo(function () {
          var pro = []
          var groups = fuc.unique(_this27.groups)
          var twitters = fuc.unique(_this27.twitters)
          var discords = fuc.unique(_this27.discords)
          var facebooks = fuc.unique(_this27.facebooks)
          var youtubes = fuc.unique(_this27.youtubes)
          var others = fuc.unique(_this27.others)
          var links = fuc.unique(_this27.links)
          var socals = [].concat(_toConsumableArray(discords), _toConsumableArray(facebooks), _toConsumableArray(youtubes))

          if (_this27.conf.fuck.group && groups.length > 0) {
            var _iterator24 = _createForOfIteratorHelper(groups)
            var _step24

            try {
              var _loop19 = function _loop19 () {
                var group = _step24.value
                pro.push(new Promise(function (resolve) {
                  fuc.joinSteamGroup(resolve, group)
                }))
              }

              for (_iterator24.s(); !(_step24 = _iterator24.n()).done;) {
                _loop19()
              }
            } catch (err) {
              _iterator24.e(err)
            } finally {
              _iterator24.f()
            }
          }

          if (globalConf.other.autoOpen) {
            if (twitters.length > 0) {
              var _iterator25 = _createForOfIteratorHelper(twitters)
              var _step25

              try {
                for (_iterator25.s(); !(_step25 = _iterator25.n()).done;) {
                  var twitter = _step25.value
                  var title = $(twitter).find('.entry-method-title').text().trim()
                  var status = fuc.echoLog({
                    type: 'custom',
                    text: '<li>'.concat(getI18n('doing'), ':').concat(title, '...<font></font></li>')
                  })
                  var followButton = $(twitter).find('a.twitter-button:contains(Follow)').attr('href')
                  var retweetButton = $(twitter).find('a.twitter-button:contains(Retweet)').attr('href')
                  var button = followButton || retweetButton

                  if (button) {
                    window.open(button, '_blank')
                    status.warning(getI18n('openPage'))
                  } else {
                    status.error(getI18n('getTaskUrlFailed'))
                  }
                }
              } catch (err) {
                _iterator25.e(err)
              } finally {
                _iterator25.f()
              }
            }

            if (socals.length > 0) {
              var _iterator26 = _createForOfIteratorHelper(socals)
              var _step26

              try {
                for (_iterator26.s(); !(_step26 = _iterator26.n()).done;) {
                  var task = _step26.value

                  var _title2 = $(task).find('.entry-method-title').text().trim()

                  var _status = fuc.echoLog({
                    type: 'custom',
                    text: '<li>'.concat(getI18n('doing'), ':').concat(_title2, '...<font></font></li>')
                  })

                  var _button = $(task).find('a.btn-info:first').attr('href')

                  if (_button) {
                    window.open(_button, '_blank')

                    _status.warning(getI18n('openPage'))
                  } else {
                    _status.error(getI18n('getTaskUrlFailed'))
                  }
                }
              } catch (err) {
                _iterator26.e(err)
              } finally {
                _iterator26.f()
              }
            }
          }

          if ((globalConf.other.autoOpen || _this27.conf.fuck.visit) && links.length > 0) {
            pro.push(new Promise(function (resolve) {
              _this27.visit_link(links, 0, resolve)
            }))
          }

          var _iterator27 = _createForOfIteratorHelper(others)
          var _step27

          try {
            for (_iterator27.s(); !(_step27 = _iterator27.n()).done;) {
              var other = _step27.value
              var icon = $(other).find('.icon-wrapper i')

              if (icon.hasClass('fa-steam')) {
                var _title3 = $(other).find('.entry-method-title').text().trim()

                fuc.echoLog({
                  type: 'custom',
                  text: '<li><font class="warning">'.concat(getI18n('unknowntype'), ':').concat(_title3, '</font></li>')
                })
              } else {
                var taskType = icon.attr('class').match(/fa-([\w]+)/) ? icon.attr('class').match(/fa-([\w]+)/)[1] : icon.attr('class')
                fuc.echoLog({
                  type: 'custom',
                  text: '<li><font class="warning">'.concat(getI18n('unknowntype'), ':').concat(taskType, '</font></li>')
                })
              }
            }
          } catch (err) {
            _iterator27.e(err)
          } finally {
            _iterator27.f()
          }

          Promise.all(pro).finally(function () {
            fuc.echoLog({
              type: 'custom',
              text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
            })
            if (_this27.conf.fuck.verify) _this27.verify(0)
          })
        })
      },
      verify: function verify () {
        var i = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0

        if ($('.ng-scope[ng-include*=challenge]').is(':visible')) {
          fuc.echoLog({
            type: 'custom',
            text: '<li><font class="error">'.concat(getI18n('notRobot'), '</font></li>')
          })
          return
        }

        var tasks = $('div.entry-content .entry-method')

        if (i < tasks.length) {
          if (tasks.eq(i).find('i.fa-question').length > 0) {
            var title = tasks.eq(i).find('.entry-method-title').text().trim()
            var status = fuc.echoLog({
              type: 'custom',
              text: '<li>'.concat(getI18n('verifyingTask'), ':').concat(title, '...<font></font></li>')
            })
            tasks.eq(i).find('a.enter-link')[0].click()
            var enterBtn = tasks.eq(i).find('.form-actions.center .btn-primary:contains(Continue)').removeAttr('disabled')

            if (enterBtn.length > 0) {
              setTimeout(function () {
                enterBtn[0].click()
                status.warning('Complete')
                setTimeout(function () {
                  gleam.verify(++i)
                }, 1000)
              }, 1000)
            } else {
              setTimeout(function () {
                gleam.verify(++i)
              }, 1000)
            }
          } else {
            this.verify(++i)
          }
        } else {
          fuc.echoLog({
            type: 'custom',
            text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font><font class="warning">').concat(getI18n('finishSelf'), '</font></li>')
          })
        }
      },
      remove: function remove () {
        var _this28 = this

        var remove = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false
        var pro = []

        if (remove) {
          this.updateSteamInfo(function () {
            if (_this28.conf.remove.group) {
              var _iterator28 = _createForOfIteratorHelper(fuc.unique(_this28.taskInfo.groups))
              var _step28

              try {
                var _loop20 = function _loop20 () {
                  var group = _step28.value
                  pro.push(new Promise(function (resolve) {
                    fuc.leaveSteamGroup(resolve, group)
                  }))
                }

                for (_iterator28.s(); !(_step28 = _iterator28.n()).done;) {
                  _loop20()
                }
              } catch (err) {
                _iterator28.e(err)
              } finally {
                _iterator28.f()
              }
            }

            Promise.all(pro).finally(function () {
              fuc.echoLog({
                type: 'custom',
                text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
              })
            })
          })
        } else {
          this.get_tasks('remove')
        }
      },
      visit_link: function visit_link (links, i, r) {
        if (i < links.length) {
          var title = $(links[i]).find('.entry-method-title').text().trim()
          var status = fuc.echoLog({
            type: 'custom',
            text: '<li>'.concat(getI18n('doing'), ':').concat(title, '...<font></font></li>')
          })
          var taskTime = $(links[i]).find('.form-actions.center span:contains(Visit):contains(seconds)').text()

          if (taskTime) {
            var taskBtn = $(links[i]).find('a.btn-info')
            var href = taskBtn.attr('href')
            taskBtn.removeAttr('href')[0].click()
            var time = taskTime.match(/[\d]+/)

            if (time) {
              var url = language === 'en' ? 'https://userjs.hclonely.com/time_en.html?time=' : 'https://userjs.hclonely.com/time.html?time='

              GM_openInTab(url + time[0], {
                active: 1,
                setParent: 1
              }).onclose = function () {
                status.warning('Complete')
                taskBtn.attr('target', '_blank').attr('href', href)
                gleam.visit_link(links, ++i, r)
              }
            } else {
              GM_openInTab('javascript:setTimeout(()=>{window.close()},1000)', {
                active: 1,
                setParent: 1
              }).onclose = function () {
                status.warning('Complete')
                taskBtn.attr('target', '_blank').attr('href', href)
                gleam.visit_link(links, ++i, r)
              }
            }
          } else {
            status.error(getI18n('getVisitTimeFailed'))
          }
        } else {
          r(1)
        }
      },
      get_giveawayId: function get_giveawayId () {
        return window.location.pathname.replace(/\?.*/, '') || window.location.href
      },
      updateSteamInfo: function updateSteamInfo (callback) {
        var _this29 = this

        new Promise(function (resolve) {
          if (_this29.taskInfo.groups.length > 0) {
            fuc.updateSteamInfo(resolve, 'community')
          } else {
            resolve(1)
          }
        }).then(function (s) {
          if (s === 1) callback()
        }).catch(function (err) {
          console.error(err)
        })
      },
      checkLeft: function checkLeft (ui) {
        if ($('.massive-message:contains(ended)').is(':visible')) {
          ui.$confirm(getI18n('noKeysLeft'), getI18n('notice'), {
            confirmButtonText: getI18n('confirm'),
            cancelButtonText: getI18n('cancel'),
            type: 'warning',
            center: true
          }).then(function () {
            window.close()
          })
        }
      },
      groups: [],
      // 任务需要加的组
      links: [],
      // 需要浏览的页面链接
      twitters: [],
      // twitter任务
      discords: [],
      // discord任务
      facebooks: [],
      // facebook任务
      youtubes: [],
      // youtube任务
      others: [],
      // 位置类型任务
      taskInfo: {
        groups: [] // 所有任务需要加的组

      },
      tasks: [],
      // 任务信息
      setting: {
        fuck: true,
        verify: true,
        join: false,
        remove: true
      },
      conf: ((_GM_getValue7 = GM_getValue('conf')) === null || _GM_getValue7 === void 0 ? void 0 : _GM_getValue7.gleam) && ((_GM_getValue8 = GM_getValue('conf')) === null || _GM_getValue8 === void 0 ? void 0 : (_GM_getValue8$gleam = _GM_getValue8.gleam) === null || _GM_getValue8$gleam === void 0 ? void 0 : _GM_getValue8$gleam.load) ? GM_getValue('conf').gleam : ((_GM_getValue9 = GM_getValue('conf')) === null || _GM_getValue9 === void 0 ? void 0 : _GM_getValue9.global) || defaultConf
    }
    var indiedb = {
      test: function test () {
        return window.location.host.includes('indiedb')
      },
      fuck: function fuck () {
        if ($('a.buttonenter:contains(Register to join)').length > 0) {
          fuc.echoLog({
            type: 'custom',
            text: '<li><font class="error">'.concat(getI18n('needLogin'), '</font></li>')
          })
        }
        var currentoption = $('a.buttonenter.buttongiveaway')

        if (/join giveaway/gim.test(currentoption.text())) {
          var status = fuc.echoLog({
            type: 'custom',
            text: '<li>'.concat(getI18n('joinGiveaway'), '<font></font></li>')
          })
          var doTask = this.do_task
          fuc.httpRequest({
            url: currentoption.attr('href'),
            method: 'POST',
            data: 'ajax=t',
            dataType: 'json',
            headers: {
              'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
              accept: 'application/json, text/javascript, */*; q=0.01'
            },
            onload: function onload (response) {
              if (debug) console.log(response)

              if (response.status === 200) {
                var _response$response12

                if ((_response$response12 = response.response) === null || _response$response12 === void 0 ? void 0 : _response$response12.success) {
                  var _response$response13, _response$response14

                  currentoption.addClass('buttonentered').text('Success - Giveaway joined')
                  $('#giveawaysjoined').slideDown()
                  $('#giveawaysrecommend').slideDown()
                  status.success('Success' + (((_response$response13 = response.response) === null || _response$response13 === void 0 ? void 0 : _response$response13.text) ? ':' + ((_response$response14 = response.response) === null || _response$response14 === void 0 ? void 0 : _response$response14.text) : ''))
                  doTask()
                } else {
                  var _response$response15, _response$response16

                  status.error('Error' + (((_response$response15 = response.response) === null || _response$response15 === void 0 ? void 0 : _response$response15.text) ? ':' + ((_response$response16 = response.response) === null || _response$response16 === void 0 ? void 0 : _response$response16.text) : ''))
                }
              } else {
                status.error('Error:' + (response.statusText || response.status))
              }
            }
          })
        } else if (/success/gim.test($('a.buttonenter.buttongiveaway').text())) {
          this.do_task()
        } else {
          fuc.echoLog({
            type: 'custom',
            text: '<li><font class="error">'.concat(getI18n('needJoinGiveaway'), '</font></li>')
          })
        }
      },
      do_task: function do_task () {
        var id = $('script').map(function (i, e) {
          if (/\$\(document\)/gim.test(e.innerHTML)) {
            var optionId = e.innerHTML.match(/"\/newsletter\/ajax\/subscribeprofile\/optin\/[\d]+"/gim)[0].match(/[\d]+/)[0]
            var taskId = e.innerHTML.match(/"\/[\d]+"/gim)[0].match(/[\d]+/)[0]
            return [taskId, optionId]
          }
        })

        if (id.length === 2) {
          var tasks = $('#giveawaysjoined a[class*=promo]')
          var _pro5 = []

          var _iterator29 = _createForOfIteratorHelper(tasks)
          var _step29

          try {
            var _loop21 = function _loop21 () {
              var task = _step29.value
              var promo = $(task)

              if (!promo.hasClass('buttonentered')) {
                var status = fuc.echoLog({
                  type: 'custom',
                  text: '<li>'.concat(getI18n('doing'), ':').concat(promo.parents('p').text(), '...<font></font></li>')
                })

                if (/facebookpromo|twitterpromo|visitpromo/gim.test(task.className)) {
                  _pro5.push(new Promise(function (resolve) {
                    $.ajax({
                      type: 'POST',
                      url: urlPath('/giveaways/ajax/' + (promo.hasClass('facebookpromo') ? 'facebookpromo' : promo.hasClass('twitterpromo') ? 'twitterpromo' : 'visitpromo') + '/' + id[0]),
                      timeout: 60000,
                      dataType: 'json',
                      data: {
                        ajax: 't'
                      },
                      error: function error (response, _error, exception) {
                        if (debug) {
                          console.log({
                            response: response,
                            error: _error,
                            exception: exception
                          })
                        }
                        status.error('Error:An error has occurred performing the action requested. Please try again shortly.')
                        resolve(0)
                      },
                      success: function success (response) {
                        if (debug) console.log(response)

                        if (response.success) {
                          status.success('Success:' + response.text)
                          promo.addClass('buttonentered').closest('p').html(promo.closest('p').find('span').html())
                          resolve(1)
                        } else {
                          status.error('Error:' + response.text)
                          resolve(0)
                        }
                      }
                    })
                  }))
                } else if (promo.hasClass('emailoptinpromo')) {
                  _pro5.push(new Promise(function (resolve) {
                    $.ajax({
                      type: 'POST',
                      url: urlPath('/newsletter/ajax/subscribeprofile/optin/' + id[1]),
                      timeout: 60000,
                      dataType: 'json',
                      data: {
                        ajax: 't',
                        emailsystoggle: 4
                      },
                      error: function error (response, _error2, exception) {
                        if (debug) {
                          console.log({
                            response: response,
                            error: _error2,
                            exception: exception
                          })
                        }
                        status.error('Error:An error has occurred performing the action requested. Please try again shortly.')
                        resolve(0)
                      },
                      success: function success (response) {
                        if (debug) console.log(response)

                        if (response.success) {
                          status.success('Success:' + response.text)
                          promo.toggleClass('buttonentered').closest('p').html(promo.closest('p').find('span').html())
                          resolve(1)
                        } else {
                          status.error('Error:' + response.text)
                          resolve(0)
                        }
                      }
                    })
                  }))
                } else if (promo.hasClass('watchingpromo')) {
                  _pro5.push(new Promise(function (resolve) {
                    var data = fuc.getUrlQuery(promo.attr('href'))
                    data.ajax = 't'
                    $.ajax({
                      type: 'POST',
                      url: urlPath(promo.attr('href').split(/[?#]/)[0]),
                      timeout: 60000,
                      dataType: 'json',
                      data: data,
                      error: function error (response, _error3, exception) {
                        if (debug) {
                          console.log({
                            response: response,
                            error: _error3,
                            exception: exception
                          })
                        }
                        status.error('Error:An error has occurred performing the action requested. Please try again shortly.')
                        resolve(0)
                      },
                      success: function success (response) {
                        if (debug) console.log(response)

                        if (response.success) {
                          status.success('Success:' + response.text)
                          promo.toggleClass('buttonentered').closest('p').html(promo.closest('p').find('span').html())
                          resolve(1)
                        } else {
                          status.error('Error:' + response.text)
                          resolve(0)
                        }
                      }
                    })
                  }))
                } else if (!/the-challenge-of-adblock/gim.test(promo.attr('href'))) {
                  _pro5.push(new Promise(function (resolve) {
                    $.ajax({
                      type: 'POST',
                      url: urlPath(promo.attr('href')),
                      timeout: 60000,
                      dataType: 'json',
                      data: {
                        ajax: 't'
                      },
                      error: function error (response, _error4, exception) {
                        if (debug) {
                          console.log({
                            response: response,
                            error: _error4,
                            exception: exception
                          })
                        }
                        status.error('Error:An error has occurred performing the action requested. Please try again shortly.')
                        resolve(0)
                      },
                      success: function success (response) {
                        if (debug) console.log(response)

                        if (response.success) {
                          status.success('Success:' + response.text)
                          promo.toggleClass('buttonentered').closest('p').html(promo.closest('p').find('span').html())
                          resolve(1)
                        } else {
                          status.error('Error:' + response.text)
                          resolve(0)
                        }
                      }
                    })
                  }))
                } else {
                  status.error('Error:' + getI18n('unknowntype'))
                }
              }
            }

            for (_iterator29.s(); !(_step29 = _iterator29.n()).done;) {
              _loop21()
            }
          } catch (err) {
            _iterator29.e(err)
          } finally {
            _iterator29.f()
          }

          Promise.all(_pro5).finally(function () {
            fuc.echoLog({
              type: 'custom',
              text: '<li><font class="warning">'.concat(getI18n('allTasksComplete'), '</font></li>')
            })
          })
        } else {
          fuc.echoLog({
            type: 'custom',
            text: '<li><font class="error">'.concat(getI18n('getIdFailed'), '</font></li>')
          })
        }
      },
      checkLogin: function checkLogin () {
        if ($('a.buttonenter:contains(Register to join)').length > 0) window.open('/members/login', '_self')
      },
      setting: {
        fuck: true,
        verify: false,
        join: false,
        remove: false
      },
      conf: ((_GM_getValue10 = GM_getValue('conf')) === null || _GM_getValue10 === void 0 ? void 0 : (_GM_getValue10$indied = _GM_getValue10.indiedb) === null || _GM_getValue10$indied === void 0 ? void 0 : _GM_getValue10$indied.load) ? GM_getValue('conf').indiedb : ((_GM_getValue11 = GM_getValue('conf')) === null || _GM_getValue11 === void 0 ? void 0 : _GM_getValue11.global) || defaultConf
    }
    var marvelousga = {
      test: function test () {
        return window.location.host.includes('marvelousga') || window.location.host.includes('dupedornot')
      },
      before: function before () {
        fuc.newTabBlock()
      },
      fuck: function fuck () {
        this.get_tasks('do_task')
      },
      get_tasks: function get_tasks () {
        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'do_task'
        var taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
        if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory

        if (callback === 'remove' && taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
          this.remove(true)
        } else {
          this.tasks = []
          this.groups = []
          this.curators = []
          this.links = []
          var status = fuc.echoLog({
            type: 'custom',
            text: '<li>'.concat(getI18n('getTasksInfo'), '<font></font></li>')
          })
          var tasksContainer = $('.container_task')

          var _iterator30 = _createForOfIteratorHelper(tasksContainer)
          var _step30

          try {
            for (_iterator30.s(); !(_step30 = _iterator30.n()).done;) {
              var task = _step30.value
              // 遍历任务信息
              var taskDes = $(task).find('.card-body p.card-text.monospace')
              var verifyBtn = $(task).find('button[id^=task_]:not(:contains(VERIFIED))')

              if (/join[\w\W]*?steamcommunity.com\/groups/gim.test(taskDes.html())) {
                // 加组任务
                var groupName = taskDes.find('a[href*="steamcommunity.com/groups"]').attr('href').match(/steamcommunity.com\/groups\/([\w\d\-_]*)/)[1]

                if (verifyBtn.length > 0) {
                  this.groups.push(groupName)
                }

                this.taskInfo.groups.push(groupName)
              }

              if (/follow[\w\W]*?store.steampowered.com\/curator/gim.test(taskDes.html())) {
                // 关注鉴赏家任务
                var curatorName = taskDes.find('a[href*="store.steampowered.com/curator"]').attr('href').match(/store.steampowered.com\/curator\/([\d]*)/)[1]

                if (verifyBtn.length > 0) {
                  this.curators.push(curatorName)
                }

                this.taskInfo.curators.push(curatorName)
              }

              if (/visit.*?this.*?page/gim.test(taskDes.text()) && verifyBtn.length > 0) {
                // 浏览页面任务
                var pageUrl = taskDes.find('a[id^="task_webpage_clickedLink"]').attr('href')
                this.links.push({
                  pageUrl: pageUrl,
                  taskId: verifyBtn.attr('id').split('_')[3]
                })
              }

              if (verifyBtn.length > 0) {
                // 任务验证信息
                var provider = verifyBtn.attr('id').split('_')[1]
                var taskRoute = verifyBtn.attr('id').split('_')[2]
                var taskId = verifyBtn.attr('id').split('_')[3]
                this.tasks.push({
                  provider: provider,
                  taskRoute: taskRoute,
                  taskId: taskId,
                  taskDes: taskDes.html()
                })
              }
            }
          } catch (err) {
            _iterator30.e(err)
          } finally {
            _iterator30.f()
          }

          this.groups = fuc.unique(this.groups)
          this.curators = fuc.unique(this.curators)
          this.links = fuc.unique(this.links)
          this.taskInfo.groups = fuc.unique(this.taskInfo.groups)
          this.taskInfo.curators = fuc.unique(this.taskInfo.curators)
          this.tasks = fuc.unique(this.tasks)
          GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
          status.success()
          if (debug) console.log(this)

          if (callback === 'do_task') {
            if (this.tasks.length === 0) {
              fuc.echoLog({
                type: 'custom',
                text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
              })
              if (this.conf.fuck.verify) this.verify()
            } else {
              this.do_task()
            }
          } else if (callback === 'verify') {
            this.tasks.length > 0 ? this.verify(true) : fuc.echoLog({
              type: 'custom',
              text: '<li><font class="success">'.concat(getI18n('verifyTasksComplete'), '</font></li>')
            })
          } else {
            !fuc.isEmptyObjArr(this.taskInfo) ? this.remove(true) : fuc.echoLog({
              type: 'custom',
              text: '<li><font class="warning">'.concat(getI18n('cannotRemove'), '</font></li>')
            })
          }
        }
      },
      do_task: function do_task () {
        var _this30 = this

        this.updateSteamInfo(function () {
          var pro = []
          var groups = fuc.unique(_this30.groups)
          var curators = fuc.unique(_this30.curators)
          var links = fuc.unique(_this30.links)

          if (_this30.conf.fuck.group) {
            var _iterator31 = _createForOfIteratorHelper(groups)
            var _step31

            try {
              var _loop22 = function _loop22 () {
                var group = _step31.value
                pro.push(new Promise(function (resolve) {
                  fuc.joinSteamGroup(resolve, group)
                }))
              }

              for (_iterator31.s(); !(_step31 = _iterator31.n()).done;) {
                _loop22()
              }
            } catch (err) {
              _iterator31.e(err)
            } finally {
              _iterator31.f()
            }
          }

          if (_this30.conf.fuck.curator) {
            var _iterator32 = _createForOfIteratorHelper(curators)
            var _step32

            try {
              var _loop23 = function _loop23 () {
                var curator = _step32.value
                pro.push(new Promise(function (resolve) {
                  fuc.followCurator(resolve, curator)
                }))
              }

              for (_iterator32.s(); !(_step32 = _iterator32.n()).done;) {
                _loop23()
              }
            } catch (err) {
              _iterator32.e(err)
            } finally {
              _iterator32.f()
            }
          }

          if (_this30.conf.fuck.visit) {
            var _iterator33 = _createForOfIteratorHelper(links)
            var _step33

            try {
              var _loop24 = function _loop24 () {
                var link = _step33.value
                pro.push(new Promise(function (resolve) {
                  fuc.visitLink(resolve, link.pageUrl, {
                    url: '/ajax/verifyTasks/webpage/clickedLink',
                    method: 'POST',
                    headers: {
                      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                      'x-csrf-token': $('meta[name="csrf-token"]').attr('content')
                    },
                    data: $.param({
                      giveaway_slug: _this30.get_giveawayId(),
                      giveaway_task_id: link.taskId
                    })
                  })
                }))
              }

              for (_iterator33.s(); !(_step33 = _iterator33.n()).done;) {
                _loop24()
              }
            } catch (err) {
              _iterator33.e(err)
            } finally {
              _iterator33.f()
            }
          }

          Promise.all(pro).finally(function () {
            fuc.echoLog({
              type: 'custom',
              text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
            })
            if (_this30.conf.fuck.verify) _this30.verify()
          })
        })
      },
      verify: function verify () {
        var _this31 = this

        var verify = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false

        if (verify) {
          var _pro6 = []

          var _iterator34 = _createForOfIteratorHelper(fuc.unique(this.tasks))
          var _step34

          try {
            var _loop25 = function _loop25 () {
              var task = _step34.value
              var status = fuc.echoLog({
                type: 'custom',
                text: '<li>'.concat(getI18n('verifyingTask')).concat(task.taskDes, '...<font></font></li>')
              })

              _pro6.push(new Promise(function (resolve) {
                fuc.httpRequest({
                  url: '/ajax/verifyTasks/' + task.provider + '/' + task.taskRoute,
                  method: 'POST',
                  dataType: 'json',
                  headers: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'x-csrf-token': $('meta[name="csrf-token"]').attr('content')
                  },
                  data: $.param({
                    giveaway_slug: _this31.get_giveawayId(),
                    giveaway_task_id: task.taskId
                  }),
                  onload: function onload (response) {
                    if (debug) console.log(response)

                    if (response.status === 200) {
                      if (response.response.status === 1) {
                        $('#task_'.concat(task.provider, '_').concat(task.taskRoute, '_').concat(task.taskId)).text('VERIFIED')
                        status.success(response.response.percentageNanoBar.toFixed(2) + '%')
                        resolve({
                          result: 'success',
                          statusText: response.statusText,
                          status: response.status
                        })
                      } else {
                        status.error('Error:' + (response.response.message || 'error'))
                        if (globalConf.other.autoOpen) window.open($('<div>'.concat(task.taskDes, '</div>')).find('a').attr('href'), '_blank')
                        resolve({
                          result: 'error',
                          statusText: response.statusText,
                          status: response.status
                        })
                      }
                    } else {
                      status.error('Error:' + (response.response.message || response.statusText || response.status))
                      if (globalConf.other.autoOpen) window.open($('<div>'.concat(task.taskDes, '</div>')).find('a').attr('href'), '_blank')
                      resolve({
                        result: 'error',
                        statusText: response.statusText,
                        status: response.status
                      })
                    }
                  },
                  r: resolve,
                  status: status
                })
              }))
            }

            for (_iterator34.s(); !(_step34 = _iterator34.n()).done;) {
              _loop25()
            }
          } catch (err) {
            _iterator34.e(err)
          } finally {
            _iterator34.f()
          }

          Promise.all(_pro6).finally(function () {
            fuc.echoLog({
              type: 'custom',
              text: '<li><font class="success">'.concat(getI18n('verifyTasksComplete'), '</font><font class="warning">').concat(getI18n('doYourself'), '<a class="hclonely-google" href="javascript:void(0)" target="_self">').concat(getI18n('googleVerify'), '</a>').concat(getI18n('getKey'), '!</font></li>')
            })
            $('#get_key_container').show()
            $('.hclonely-google').unbind()
            $('.hclonely-google').click(function () {
              $('#get_key_container')[0].scrollIntoView()
            })
          })
        } else {
          this.get_tasks('verify')
        }
      },
      remove: function remove () {
        var _this32 = this

        var remove = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false
        var pro = []

        if (remove) {
          this.updateSteamInfo(function () {
            if (_this32.conf.remove.group) {
              var _iterator35 = _createForOfIteratorHelper(fuc.unique(_this32.taskInfo.groups))
              var _step35

              try {
                var _loop26 = function _loop26 () {
                  var group = _step35.value
                  pro.push(new Promise(function (resolve) {
                    fuc.leaveSteamGroup(resolve, group)
                  }))
                }

                for (_iterator35.s(); !(_step35 = _iterator35.n()).done;) {
                  _loop26()
                }
              } catch (err) {
                _iterator35.e(err)
              } finally {
                _iterator35.f()
              }
            }

            if (_this32.conf.remove.curator) {
              var _iterator36 = _createForOfIteratorHelper(fuc.unique(_this32.taskInfo.curators))
              var _step36

              try {
                var _loop27 = function _loop27 () {
                  var curator = _step36.value
                  pro.push(new Promise(function (resolve) {
                    fuc.unfollowCurator(resolve, curator)
                  }))
                }

                for (_iterator36.s(); !(_step36 = _iterator36.n()).done;) {
                  _loop27()
                }
              } catch (err) {
                _iterator36.e(err)
              } finally {
                _iterator36.f()
              }
            }

            Promise.all(pro).finally(function () {
              fuc.echoLog({
                type: 'custom',
                text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
              })
            })
          })
        } else {
          this.get_tasks('remove')
        }
      },
      get_giveawayId: function get_giveawayId () {
        return $('#giveawaySlug').val() || window.location.href
      },
      updateSteamInfo: function updateSteamInfo (callback) {
        var _this33 = this

        new Promise(function (resolve) {
          if (_this33.taskInfo.groups.length > 0) {
            if (_this33.taskInfo.curators.length > 0) {
              fuc.updateSteamInfo(resolve, 'all')
            } else {
              fuc.updateSteamInfo(resolve, 'community')
            }
          } else if (_this33.taskInfo.curators.length > 0) {
            fuc.updateSteamInfo(resolve, 'store')
          } else {
            resolve(1)
          }
        }).then(function (s) {
          if (s === 1) callback()
        }).catch(function (err) {
          console.error(err)
        })
      },
      checkLogin: function checkLogin () {
        if ($('a[href*=login]').length > 0) window.open('/login', '_self')
      },
      checkLeft: function checkLeft (ui) {
        if ($('h3.text-danger:contains(this giveaway is closed)').length > 0) {
          $('#link_to_click').remove()
          ui.$confirm(getI18n('noKeysLeft'), getI18n('notice'), {
            confirmButtonText: getI18n('confirm'),
            cancelButtonText: getI18n('cancel'),
            type: 'warning',
            center: true
          }).then(function () {
            window.close()
          })
        }
      },
      groups: [],
      // 任务需要加的组
      curators: [],
      // 任务需要关注的鉴赏家
      links: [],
      // 需要浏览的页面链接
      taskInfo: {
        groups: [],
        // 所有任务需要加的组
        curators: [] // 所有任务需要关注的鉴赏家

      },
      tasks: [],
      // 任务信息
      setting: {
        fuck: true,
        verify: true,
        join: false,
        remove: true
      },
      conf: ((_GM_getValue12 = GM_getValue('conf')) === null || _GM_getValue12 === void 0 ? void 0 : (_GM_getValue12$marvel = _GM_getValue12.marvelousga) === null || _GM_getValue12$marvel === void 0 ? void 0 : _GM_getValue12$marvel.load) ? GM_getValue('conf').marvelousga : ((_GM_getValue13 = GM_getValue('conf')) === null || _GM_getValue13 === void 0 ? void 0 : _GM_getValue13.global) || defaultConf
    }
    var opiumpulses = {
      test: function test () {
        return window.location.host.includes('opiumpulses')
      },
      fuck: function fuck () {
        this.get_tasks('FREE')
      },
      get_tasks: function get_tasks () {
        var _arguments2 = arguments
        var _this34 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee6 () {
          var type, items, myPoint, maxPoint, i, item, needPoints
          return regeneratorRuntime.wrap(function _callee6$ (_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  type = _arguments2.length > 0 && _arguments2[0] !== undefined ? _arguments2[0] : 'FREE'
                  items = $(".giveaways-page-item:contains('".concat(type, "'):not(:contains('ENTERED'))"))
                  myPoint = _this34.myPoints
                  maxPoint = _this34.maxPoint()
                  i = 0

                case 5:
                  if (!(i < items.length)) {
                    _context8.next = 21
                    break
                  }

                  item = items[i]
                  needPoints = $(item).find('.giveaways-page-item-header-points').text().match(/[\d]+/gim)

                  if (!(type === 'points' && needPoints && parseInt(needPoints[0]) > myPoint)) {
                    _context8.next = 12
                    break
                  }

                  fuc.echoLog({
                    type: 'custom',
                    text: '<li><font class="warning">'.concat(getI18n('noPoints'), '</font></li>')
                  })
                  _context8.next = 18
                  break

                case 12:
                  if (!(type === 'points' && !needPoints)) {
                    _context8.next = 16
                    break
                  }

                  fuc.echoLog({
                    type: 'custom',
                    text: '<li><font class="warning">'.concat(getI18n('getNeedPointsFailed'), '</font></li>')
                  })
                  _context8.next = 18
                  break

                case 16:
                  if (type === 'points' && parseInt(needPoints[0]) > maxPoint) {
                    _context8.next = 18
                    break
                  }

                  return _context8.delegateYield(/* #__PURE__ */regeneratorRuntime.mark(function _callee5 () {
                    var status, a, giveawayId
                    return regeneratorRuntime.wrap(function _callee5$ (_context7) {
                      while (1) {
                        switch (_context7.prev = _context7.next) {
                          case 0:
                            status = fuc.echoLog({
                              type: 'custom',
                              text: '<li>'.concat(getI18n('joinLottery'), '<a href="').concat($(item).find('a.giveaways-page-item-img-btn-more').attr('href'), '" target="_blank">').concat($(item).find('.giveaways-page-item-footer-name').text().trim(), '</a>...<font></font></li>')
                            })
                            a = $(item).find("a.giveaways-page-item-img-btn-enter:contains('enter')")

                            if (a.attr('onclick') && a.attr('onclick').includes('checkUser')) {
                              giveawayId = a.attr('onclick').match(/[\d]+/)
                              if (giveawayId) checkUser(giveawayId[0])
                            }

                            _context7.next = 5
                            return new Promise(function (resolve) {
                              fuc.httpRequest({
                                url: a.attr('href'),
                                method: 'GET',
                                onload: function onload (response) {
                                  if (debug) console.log(response)

                                  if (response.responseText && /You've entered this giveaway/gim.test(response.responseText)) {
                                    status.success()
                                    var points = response.responseText.match(/Points:[\s]*?([\d]+)/)

                                    if (type === 'points' && points) {
                                      if (debug) console.log(getI18n('pointsLeft') + points[1])
                                      opiumpulses.myPoints = parseInt(points[1])
                                    }
                                  } else {
                                    status.error('Error:' + (response.status || response.statusText))
                                  }

                                  resolve(1)
                                },
                                status: status,
                                r: resolve
                              })
                            }).then(function (data) {
                              return true
                            }).catch(function () {
                              return false
                            })

                          case 5:
                          case 'end':
                            return _context7.stop()
                        }
                      }
                    }, _callee5)
                  })(), 't0', 18)

                case 18:
                  i++
                  _context8.next = 5
                  break

                case 21:
                  fuc.echoLog({
                    type: 'custom',
                    text: '<li>-----END-----</li>'
                  })

                case 22:
                case 'end':
                  return _context8.stop()
              }
            }
          }, _callee6)
        }))()
      },
      verify: function verify () {
        var myPoints = $('.page-header__nav-func-user-nav-items.points-items').text().match(/[\d]+/gim)

        if (myPoints) {
          this.myPoints = myPoints
          this.get_tasks('points')
        } else {
          fuc.echoLog({
            type: 'custom',
            text: '<li><font class="error">'.concat(getI18n('getPointsFailed'), '</font></li>')
          })
        }
      },
      myPoints: 0,
      setting: {
        fuck: true,
        fuckText: 'Free',
        fuckTitle: getI18n('joinFreeLottery'),
        verify: true,
        verifyText: 'Point',
        verifyTitle: getI18n('joinPointLottery'),
        join: false,
        remove: false
      },
      conf: ((_GM_getValue14 = GM_getValue('conf')) === null || _GM_getValue14 === void 0 ? void 0 : (_GM_getValue14$opiump = _GM_getValue14.opiumpulses) === null || _GM_getValue14$opiump === void 0 ? void 0 : _GM_getValue14$opiump.load) ? GM_getValue('conf').opiumpulses : ((_GM_getValue15 = GM_getValue('conf')) === null || _GM_getValue15 === void 0 ? void 0 : _GM_getValue15.global) || defaultConf,
      maxPoint: function maxPoint () {
        return this.conf.maxPoint || Infinity
      }
    }
    var prys = {
      test: function test () {
        return window.location.host.includes('prys.revadike')
      },
      fuck: function fuck () {
        this.get_tasks('do_task')
      },
      get_tasks: function get_tasks () {
        var _this35 = this

        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'do_task'
        var status = fuc.echoLog({
          type: 'custom',
          text: '<li>'.concat(getI18n('getTasksInfo'), '<font></font></li>')
        })
        var steps = $('#steps tbody tr')

        for (var i = 0; i < steps.length; i++) {
          if (steps.eq(i).find('span:contains(Success)').length === 0) checkClick(i)
        }

        if (callback === 'do_task') {
          var taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
          if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory
          this.groups = []
          this.curators = []
          var _pro7 = []

          var _iterator37 = _createForOfIteratorHelper(steps)
          var _step37

          try {
            for (_iterator37.s(); !(_step37 = _iterator37.n()).done;) {
              var step = _step37.value

              if ($(step).find('span:contains(Success)').length === 0) {
                if ($(step).find("a[href*='store.steampowered.com/curator/']").length > 0) {
                  var link = $(step).find("a[href*='store.steampowered.com/curator/']").attr('href')
                  var curatorId = link.match(/curator\/([\d]+)/)

                  if (curatorId) {
                    this.curators.push(curatorId[1])
                    this.taskInfo.curators.push(curatorId[1])
                  }
                } else if ($(step).find("a[href*='steampowered.com/groups/']").length > 0) {
                  var _link = $(step).find("a[href*='steampowered.com/groups/']").attr('href')

                  var groupName = _link.match(/groups\/(.+)\/?/)

                  if (groupName) {
                    this.groups.push(groupName[1])
                    this.taskInfo.groups.push(groupName[1])
                  }
                } else if ($(step).find("a[href*='steamcommunity.com/gid']").length > 0) {
                  (function () {
                    var link = $(step).find("a[href*='steamcommunity.com/gid']").attr('href')

                    _pro7.push(new Promise(function (r) {
                      new Promise(function (resolve) {
                        fuc.getFinalUrl(resolve, link)
                      }).then(function (data) {
                        if (data.result === 'success') {
                          var _groupName2 = data.finalUrl.match(/groups\/(.+)\/?/)

                          if (_groupName2) {
                            _this35.groups.push(_groupName2[1])

                            _this35.taskInfo.groups.push(_groupName2[1])
                          }
                        }

                        r(1)
                      })
                    }))
                  })()
                }
              }
            }
          } catch (err) {
            _iterator37.e(err)
          } finally {
            _iterator37.f()
          }

          if (_pro7.length > 0) {
            Promise.all(_pro7).finally(function () {
              _this35.groups = fuc.unique(_this35.groups)
              _this35.curators = fuc.unique(_this35.curators)
              _this35.taskInfo.groups = fuc.unique(_this35.taskInfo.groups)
              _this35.taskInfo.curators = fuc.unique(_this35.taskInfo.curators)
              GM_setValue('taskInfo[' + window.location.host + _this35.get_giveawayId() + ']', _this35.taskInfo)

              if (_this35.groups.length > 0 || _this35.curators.length > 0) {
                _this35.do_task()
              } else {
                fuc.echoLog({
                  type: 'custom',
                  text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                })
                if (_this35.conf.fuck.verify) _this35.verify()
              }
            })
          } else {
            this.groups = fuc.unique(this.groups)
            this.curators = fuc.unique(this.curators)
            this.taskInfo.groups = fuc.unique(this.taskInfo.groups)
            this.taskInfo.curators = fuc.unique(this.taskInfo.curators)
            GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)

            if (this.groups.length > 0 || this.curators.length > 0) {
              this.do_task()
            } else {
              fuc.echoLog({
                type: 'custom',
                text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
              })
              if (this.conf.fuck.verify) this.verify()
            }
          }
        } else if (callback === 'verify') {
          this.tasks = []
          var checks = $('#steps tbody a[id^=check]')

          if (checks.length > 0) {
            var _iterator38 = _createForOfIteratorHelper(checks)
            var _step38

            try {
              for (_iterator38.s(); !(_step38 = _iterator38.n()).done;) {
                var check = _step38.value
                var id = $(check).attr('id').match(/[\d]+/)
                if (id) {
                  this.tasks.push({
                    id: id[0],
                    taskDes: $(check).parent().prev().html().trim()
                  })
                }
              }
            } catch (err) {
              _iterator38.e(err)
            } finally {
              _iterator38.f()
            }

            this.verify(true)
          } else {
            fuc.echoLog({
              type: 'custom',
              text: '<li><font class="success">'.concat(getI18n('prysAllTasksComplete'), '</font></li>')
            })
          }
        } else if (callback === 'remove') {
          var taskInfo = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')

          if (taskInfo && !fuc.isEmptyObjArr(taskInfo)) {
            this.taskInfo = taskInfo
            this.remove(true)
          } else {
            var _pro8 = []

            var _iterator39 = _createForOfIteratorHelper(steps)
            var _step39

            try {
              for (_iterator39.s(); !(_step39 = _iterator39.n()).done;) {
                var _step40 = _step39.value

                if ($(_step40).find("a[href*='store.steampowered.com/curator/']").length > 0) {
                  var _link2 = $(_step40).find("a[href*='store.steampowered.com/curator/']").attr('href')

                  var _curatorId = _link2.match(/curator\/([\d]+)/)

                  if (_curatorId) this.taskInfo.curators.push(_curatorId[1])
                } else if ($(_step40).find("a[href*='steampowered.com/groups/']").length > 0) {
                  var _link3 = $(_step40).find("a[href*='steampowered.com/groups/']").attr('href')

                  var _groupName3 = _link3.match(/groups\/(.+)\/?/)

                  if (_groupName3) this.taskInfo.groups.push(_groupName3[1])
                } else if ($(_step40).find("a[href*='steamcommunity.com/gid']").length > 0) {
                  (function () {
                    var link = $(_step40).find("a[href*='steamcommunity.com/gid']").attr('href')

                    _pro8.push(new Promise(function (r) {
                      new Promise(function (resolve) {
                        fuc.getFinalUrl(resolve, link)
                      }).then(function (data) {
                        if (data.result === 'success') {
                          var _groupName4 = data.finalUrl.match(/groups\/(.+)\/?/)

                          if (_groupName4) {
                            _this35.taskInfo.groups.push(_groupName4[1])
                          }
                        }

                        r(1)
                      })
                    }))
                  })()
                }
              }
            } catch (err) {
              _iterator39.e(err)
            } finally {
              _iterator39.f()
            }

            if (_pro8.length > 0) {
              Promise.all(_pro8).finally(function () {
                _this35.taskInfo.groups = fuc.unique(_this35.taskInfo.groups)
                _this35.taskInfo.curators = fuc.unique(_this35.taskInfo.curators)
                GM_setValue('taskInfo[' + window.location.host + _this35.get_giveawayId() + ']', _this35.taskInfo)

                if (_this35.taskInfo.groups.length > 0 || _this35.taskInfo.curators.length > 0) {
                  _this35.remove(true)
                } else {
                  fuc.echoLog({
                    type: 'custom',
                    text: '<li><font class="success">'.concat(getI18n('cannotRemove'), '</font></li>')
                  })
                }
              })
            } else {
              this.taskInfo.groups = fuc.unique(this.taskInfo.groups)
              this.taskInfo.curators = fuc.unique(this.taskInfo.curators)
              GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)

              if (this.taskInfo.groups.length > 0 || this.taskInfo.curators.length > 0) {
                this.remove(true)
              } else {
                fuc.echoLog({
                  type: 'custom',
                  text: '<li><font class="success">'.concat(getI18n('cannotRemove'), '</font></li>')
                })
              }
            }
          }
        } else {
          fuc.echoLog({
            type: 'custom',
            text: '<li><font class="error">'.concat(getI18n('unknown'), '\uFF01</font></li>')
          })
        }

        status.success()
        if (debug) console.log(this)
      },
      do_task: function do_task () {
        var _this36 = this

        this.updateSteamInfo(function () {
          var pro = []
          var groups = fuc.unique(_this36.groups)
          var curators = fuc.unique(_this36.curators)

          if (_this36.conf.fuck.group) {
            var _iterator40 = _createForOfIteratorHelper(groups)
            var _step41

            try {
              var _loop28 = function _loop28 () {
                var group = _step41.value
                pro.push(new Promise(function (resolve) {
                  fuc.joinSteamGroup(resolve, group)
                }))
              }

              for (_iterator40.s(); !(_step41 = _iterator40.n()).done;) {
                _loop28()
              }
            } catch (err) {
              _iterator40.e(err)
            } finally {
              _iterator40.f()
            }
          }

          if (_this36.conf.fuck.curator) {
            var _iterator41 = _createForOfIteratorHelper(curators)
            var _step42

            try {
              var _loop29 = function _loop29 () {
                var curator = _step42.value
                pro.push(new Promise(function (resolve) {
                  fuc.followCurator(resolve, curator)
                }))
              }

              for (_iterator41.s(); !(_step42 = _iterator41.n()).done;) {
                _loop29()
              }
            } catch (err) {
              _iterator41.e(err)
            } finally {
              _iterator41.f()
            }
          }

          Promise.all(pro).finally(function () {
            fuc.echoLog({
              type: 'custom',
              text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
            })
            if (_this36.conf.fuck.verify) _this36.verify()
          })
        })
      },
      verify: function verify () {
        var _this37 = this

        var verify = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false

        if (verify) {
          var _pro9 = []

          var _iterator42 = _createForOfIteratorHelper(fuc.unique(this.tasks))
          var _step43

          try {
            var _loop30 = function _loop30 () {
              var task = _step43.value
              var status = fuc.echoLog({
                type: 'custom',
                text: '<li>'.concat(getI18n('verifyingTask')).concat(task.taskDes, '...<font></font></li>')
              })

              _pro9.push(new Promise(function (resolve) {
                _this37.checkStep(task.id, resolve, status)
              }))
            }

            for (_iterator42.s(); !(_step43 = _iterator42.n()).done;) {
              _loop30()
            }
          } catch (err) {
            _iterator42.e(err)
          } finally {
            _iterator42.f()
          }

          Promise.all(_pro9).finally(function () {
            fuc.echoLog({
              type: 'custom',
              text: '<li><font class="success">'.concat(getI18n('prysAllTasksComplete'), '</font></li>')
            })
          })
        } else {
          this.get_tasks('verify')
        }
      },
      checkStep: function checkStep (step, r, status, captcha) {
        if (!captcha) captcha = null

        if (step !== 'captcha') {
          $('#check' + step).replaceWith('<span id="check' + step + '"><i class="fa fa-refresh fa-spin fa-fw"></i> Checking...</span>')
        }

        $.post('/api/check_step', {
          step: step,
          id: getURLParameter('id'),
          'g-recaptcha-response': captcha
        }, function (json) {
          r(1)

          if (json.success && step !== 'captcha') {
            $('#check' + step).replaceWith('<span class="text-success" id="check' + step + '"><i class="fa fa-check"></i> Success</span>')
            status.success()
          } else if (step !== 'captcha') {
            $('#check' + step).replaceWith('<a id="check' + step + '" href="javascript:checkStep(' + step + ')"><i class="fa fa-question"></i> Check</a>')
            status.error(json.response ? json.response.error ? json.response.error : 'Error' : 'Error')
          }

          if (json.response) {
            if (json.response.captcha && json.success) {
              showAlert('info', json.response.captcha)
              captchaCheck()
            } else if (json.response.captcha) {
              showAlert('warning', json.response.captcha)
              captchaCheck()
            }

            if (json.response.prize) {
              showAlert('success', 'Here is your prize:<h1 role="button" align="middle" style="word-wrap: break-word;">' + json.response.prize + '</h2>')
            }
          }
        }).fail(function () {
          r(1)
          $('#check' + step).replaceWith('<a id="check' + step + '" href="javascript:checkStep(' + step + ')"><i class="fa fa-question"></i> Check</a>')
          status.error('Error:0')
        })
      },
      remove: function remove () {
        var _this38 = this

        var remove = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false
        var pro = []

        if (remove) {
          this.updateSteamInfo(function () {
            if (_this38.conf.remove.group) {
              var _iterator43 = _createForOfIteratorHelper(fuc.unique(_this38.taskInfo.groups))
              var _step44

              try {
                var _loop31 = function _loop31 () {
                  var group = _step44.value
                  pro.push(new Promise(function (resolve) {
                    fuc.leaveSteamGroup(resolve, group)
                  }))
                }

                for (_iterator43.s(); !(_step44 = _iterator43.n()).done;) {
                  _loop31()
                }
              } catch (err) {
                _iterator43.e(err)
              } finally {
                _iterator43.f()
              }
            }

            if (_this38.conf.remove.curator) {
              var _iterator44 = _createForOfIteratorHelper(fuc.unique(_this38.taskInfo.curators))
              var _step45

              try {
                var _loop32 = function _loop32 () {
                  var curator = _step45.value
                  pro.push(new Promise(function (resolve) {
                    fuc.unfollowCurator(resolve, curator)
                  }))
                }

                for (_iterator44.s(); !(_step45 = _iterator44.n()).done;) {
                  _loop32()
                }
              } catch (err) {
                _iterator44.e(err)
              } finally {
                _iterator44.f()
              }
            }

            Promise.all(pro).finally(function () {
              fuc.echoLog({
                type: 'custom',
                text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
              })
            })
          })
        } else {
          this.get_tasks('remove')
        }
      },
      get_giveawayId: function get_giveawayId () {
        var id = window.location.search.match(/id=([\d]+)/)
        return id ? id[1] : window.location.href
      },
      updateSteamInfo: function updateSteamInfo (callback) {
        var _this39 = this

        new Promise(function (resolve) {
          if (_this39.taskInfo.groups.length > 0) {
            if (_this39.taskInfo.curators.length > 0) {
              fuc.updateSteamInfo(resolve, 'all')
            } else {
              fuc.updateSteamInfo(resolve, 'community')
            }
          } else if (_this39.taskInfo.curators.length > 0) {
            fuc.updateSteamInfo(resolve, 'store')
          } else {
            resolve(1)
          }
        }).then(function (s) {
          if (s === 1) callback()
        }).catch(function (err) {
          console.error(err)
        })
      },
      checkLeft: function checkLeft (ui) {
        var left = $('#header').text().match(/([\d]+).*?prize.*?left/)

        if (!(left.length > 0 && left[1] !== '0')) {
          ui.$confirm(getI18n('noKeysLeft'), getI18n('notice'), {
            confirmButtonText: getI18n('confirm'),
            cancelButtonText: getI18n('cancel'),
            type: 'warning',
            center: true
          }).then(function () {
            window.close()
          })
        }
      },
      groups: [],
      // 任务需要加的组
      curators: [],
      // 任务需要关注的鉴赏家
      taskInfo: {
        groups: [],
        // 所有任务需要加的组
        curators: [] // 所有任务需要关注的鉴赏家

      },
      tasks: [],
      // 任务信息
      setting: {
        fuck: true,
        verify: true,
        join: false,
        remove: true
      },
      conf: ((_GM_getValue16 = GM_getValue('conf')) === null || _GM_getValue16 === void 0 ? void 0 : (_GM_getValue16$prys = _GM_getValue16.prys) === null || _GM_getValue16$prys === void 0 ? void 0 : _GM_getValue16$prys.load) ? GM_getValue('conf').prys : ((_GM_getValue17 = GM_getValue('conf')) === null || _GM_getValue17 === void 0 ? void 0 : _GM_getValue17.global) || defaultConf
    }
    var spoune = {
      test: function test () {
        return window.location.host.includes('spoune')
      },
      fuck: function fuck () {
        this.get_tasks()
      },
      get_tasks: function get_tasks () {
        var status = fuc.echoLog({
          type: 'custom',
          text: '<li>'.concat(getI18n('getTasksInfo'), '<font></font></li>')
        })
        var giveawayTasks = $('#GiveawayTasks button')

        var _iterator45 = _createForOfIteratorHelper(giveawayTasks)
        var _step46

        try {
          for (_iterator45.s(); !(_step46 = _iterator45.n()).done;) {
            var task = _step46.value
            var taskClick = $(task).attr('onclick')

            if (taskClick) {
              var taskId = taskClick.match(/loadTask\(([\d]+)/)

              if (taskId) {
                this.tasks.push({
                  id: taskId[1],
                  text: $(task).text()
                })
              } else {
                fuc.echoLog({
                  type: 'custom',
                  text: '<li><font class="error">'.concat(getI18n('getTaskIdFailed', $(task).text()), '</font></li>')
                })
              }
            } else {
              fuc.echoLog({
                type: 'custom',
                text: '<li><font class="error">'.concat(getI18n('getTaskIdFailed', $(task).text()), '</font></li>')
              })
            }
          }
        } catch (err) {
          _iterator45.e(err)
        } finally {
          _iterator45.f()
        }

        status.warning('Complete')

        if (this.tasks.length > 0) {
          this.verify()
        } else {
          fuc.echoLog({
            type: 'custom',
            text: '<li><font class="warning">'.concat(getI18n('noAutoFinish'), '</font></li>')
          })
        }
      },
      verify: function verify (_ref4) {
        var _this40 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee7 () {
          var arr, i, end, tasks, _loop33, _i2

          return regeneratorRuntime.wrap(function _callee7$ (_context10) {
            while (1) {
              switch (_context10.prev = _context10.next) {
                case 0:
                  arr = _ref4.arr, i = _ref4.i, end = _ref4.end
                  tasks = fuc.unique(_this40.tasks)
                  _loop33 = /* #__PURE__ */regeneratorRuntime.mark(function _loop33 (_i2) {
                    var task, status
                    return regeneratorRuntime.wrap(function _loop33$ (_context9) {
                      while (1) {
                        switch (_context9.prev = _context9.next) {
                          case 0:
                            task = tasks[_i2]
                            status = fuc.echoLog({
                              type: 'custom',
                              text: '<li>'.concat(getI18n('doing')).concat(task.text, '...<font></font></li>')
                            })
                            _context9.next = 4
                            return new Promise(function (resolve) {
                              fuc.httpRequest({
                                url: '/controller.php?taskDetail='.concat(task.id, '&show'),
                                method: 'get',
                                onload: function onload (response) {
                                  if (debug) console.log(response)

                                  if (response.status === 200) {
                                    var src = response.responseText.match(/src="\.([\w\W]*?)">/)

                                    if (src) {
                                      fuc.httpRequest({
                                        url: src[1],
                                        method: 'get',
                                        onload: function onload (response) {
                                          if (debug) console.log(response)

                                          if (response.status === 200) {
                                            var href = response.responseText.match(/href="\.(\/verify[\w\W]*?)"/) || response.responseText.match(/href="\.(\/steamgroup[\w\W]*?)"/)

                                            if (href) {
                                              fuc.httpRequest({
                                                url: '/werbung' + href[1],
                                                method: 'get',
                                                onload: function onload (response) {
                                                  if (debug) console.log(response)

                                                  if (response.status === 200 && /Task.*completed/gim.test(response.responseText)) {
                                                    status.success()
                                                    resolve()
                                                  } else {
                                                    var _href = response.responseText.match(/href="\.(\/verify[\w\W]*?)"/) || response.responseText.match(/href="\.(\/steamgroup[\w\W]*?)"/)

                                                    if (_href) {
                                                      fuc.httpRequest({
                                                        url: '/werbung' + _href[1],
                                                        method: 'get',
                                                        onload: function onload (response) {
                                                          if (debug) console.log(response)

                                                          if (response.status === 200 && /Task.*completed/gim.test(response.responseText)) {
                                                            status.success()
                                                          } else {
                                                            status.error('Error:' + (response.statusText || response.status))
                                                          }

                                                          resolve()
                                                        },
                                                        r: resolve,
                                                        status: status
                                                      })
                                                    } else {
                                                      status.error('Error:' + (response.statusText || response.status))
                                                      resolve()
                                                    }
                                                  }
                                                },
                                                r: resolve,
                                                status: status
                                              })
                                            } else {
                                              status.error('Error:' + getI18n('getUrlFailed', '2'))
                                              resolve()
                                            }
                                          } else {
                                            status.error('Error:' + (response.statusText || response.status))
                                            resolve()
                                          }
                                        },
                                        r: resolve,
                                        status: status
                                      })
                                    } else {
                                      status.error('Error:' + getI18n('getUrlFailed', '1'))
                                      resolve()
                                    }
                                  } else {
                                    status.error('Error:' + (response.statusText || response.status))
                                    resolve()
                                  }
                                },
                                r: resolve,
                                status: status
                              })
                            }).then(function () {
                              return true
                            }).catch(function () {
                              return false
                            })

                          case 4:
                          case 'end':
                            return _context9.stop()
                        }
                      }
                    }, _loop33)
                  })
                  _i2 = 0

                case 4:
                  if (!(_i2 < tasks.length)) {
                    _context10.next = 9
                    break
                  }

                  return _context10.delegateYield(_loop33(_i2), 't0', 6)

                case 6:
                  _i2++
                  _context10.next = 4
                  break

                case 9:
                  fuc.echoLog({
                    type: 'custom',
                    text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font>\uFF0C<font class="warning">').concat(getI18n('finishSelf'), '</font></li>')
                  })

                case 10:
                case 'end':
                  return _context10.stop()
              }
            }
          }, _callee7)
        }))()
      },
      checkLeft: function checkLeft (ui) {
        var checkLeft = setInterval(function () {
          if ($('#keysAvailable').length > 0) {
            clearInterval(checkLeft)

            if ($('#keysAvailable').text() === '0') {
              ui.$confirm(getI18n('noKeysLeft'), getI18n('notice'), {
                confirmButtonText: getI18n('confirm'),
                cancelButtonText: getI18n('cancel'),
                type: 'warning',
                center: true
              }).then(function () {
                window.close()
              })
            }
          }
        }, 500)
      },
      tasks: [],
      // 任务信息
      setting: {
        fuck: true,
        verify: false,
        join: false,
        remove: false
      },
      conf: ((_GM_getValue18 = GM_getValue('conf')) === null || _GM_getValue18 === void 0 ? void 0 : (_GM_getValue18$spoune = _GM_getValue18.spoune) === null || _GM_getValue18$spoune === void 0 ? void 0 : _GM_getValue18$spoune.load) ? GM_getValue('conf').spoune : ((_GM_getValue19 = GM_getValue('conf')) === null || _GM_getValue19 === void 0 ? void 0 : _GM_getValue19.global) || defaultConf
    }
    var takekey = {
      test: function test () {
        return window.location.host.includes('takekey')
      },
      fuck: function fuck () {
        this.get_tasks('do_task')
      },
      get_tasks: function get_tasks () {
        var _this41 = this

        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'do_task'
        var taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
        if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory

        if (callback === 'remove' && taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
          this.remove(true)
        } else {
          this.tasks = []
          this.groups = [] // this.curators=[];

          this.links = []
          var _pro10 = []
          var status = fuc.echoLog({
            type: 'custom',
            text: '<li>'.concat(getI18n('getTasksInfo'), '<font></font></li>')
          })
          var tasksContainer = $('#usl>div')

          var _iterator46 = _createForOfIteratorHelper(tasksContainer)
          var _step47

          try {
            var _loop34 = function _loop34 () {
              var task = _step47.value

              // 遍历任务信息
              _this41.tasks.push(task)

              var icon = $(task).find('i')
              var link = $(task).children('a[id]').attr('href')
              var id = $(task).children('a[id]').attr('id')

              if (icon.hasClass('fa-steam')) {
                if (link && /gid\/[\d]+/.test(link)) {
                  _pro10.push(new Promise(function (r) {
                    new Promise(function (resolve) {
                      fuc.getFinalUrl(resolve, link)
                    }).then(function (data) {
                      if (data.result === 'success') {
                        var groupName = data.finalUrl.match(/steamcommunity.com\/groups\/([\w\d\-_]*)/)[1]

                        if (groupName) {
                          _this41.groups.push(groupName)

                          _this41.taskInfo.groups.push(groupName)

                          r(1)
                        } else {
                          r(0)
                        }
                      } else {
                        r(0)
                      }
                    }).catch(function () {
                      r(0)
                    })
                  }))
                }
              } else if (icon.hasClass('fa-link')) {
                _this41.links.push(id)
              } else if (icon.hasClass('fa-vk')) {
                _this41.vks.push(link)
              } else {
                _this41.others.push(icon)
              }
            }

            for (_iterator46.s(); !(_step47 = _iterator46.n()).done;) {
              _loop34()
            }
          } catch (err) {
            _iterator46.e(err)
          } finally {
            _iterator46.f()
          }

          Promise.all(_pro10).finally(function () {
            _this41.groups = fuc.unique(_this41.groups) // this.curators=fuc.unique(this.curators);

            _this41.links = fuc.unique(_this41.links)
            _this41.others = fuc.unique(_this41.others)
            _this41.taskInfo.groups = fuc.unique(_this41.taskInfo.groups) // this.taskInfo.curators=fuc.unique(this.taskInfo.curators);

            _this41.tasks = fuc.unique(_this41.tasks)
            GM_setValue('taskInfo[' + window.location.host + _this41.get_giveawayId() + ']', _this41.taskInfo)
            status.success()
            if (debug) console.log(_this41)

            if (callback === 'do_task') {
              if (_this41.tasks.length === 0) {
                fuc.echoLog({
                  type: 'custom',
                  text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                })
                if (_this41.conf.fuck.verify) _this41.verify()
              } else {
                _this41.do_task()
              }
            } else {
              !fuc.isEmptyObjArr(_this41.taskInfo) ? _this41.remove(true) : fuc.echoLog({
                type: 'custom',
                text: '<li><font class="warning">'.concat(getI18n('cannotRemove'), '</font></li>')
              })
            }
          })
        }
      },
      do_task: function do_task () {
        var _this42 = this

        this.updateSteamInfo(function () {
          var pro = []
          var groups = fuc.unique(_this42.groups) // let curators = fuc.unique(this.curators);

          var links = fuc.unique(_this42.links)
          var others = fuc.unique(_this42.others)
          var vks = fuc.unique(_this42.vks)

          if (_this42.conf.fuck.group) {
            var _iterator47 = _createForOfIteratorHelper(groups)
            var _step48

            try {
              var _loop35 = function _loop35 () {
                var group = _step48.value
                pro.push(new Promise(function (resolve) {
                  fuc.joinSteamGroup(resolve, group)
                }))
              }

              for (_iterator47.s(); !(_step48 = _iterator47.n()).done;) {
                _loop35()
              }
            } catch (err) {
              _iterator47.e(err)
            } finally {
              _iterator47.f()
            }
          }

          if (_this42.conf.fuck.visit) {
            var _iterator48 = _createForOfIteratorHelper(links)
            var _step49

            try {
              var _loop36 = function _loop36 () {
                var link = _step49.value
                var a = $("a[id='".concat(link, "']")).attr('onclick', 'return false;')
                a[0].click()
                a.removeAttr('onclick')
                pro.push(new Promise(function (resolve) {
                  fuc.visitLink(resolve, $("a[id='".concat(link, "']")).attr('href'))
                }))
              }

              for (_iterator48.s(); !(_step49 = _iterator48.n()).done;) {
                _loop36()
              }
            } catch (err) {
              _iterator48.e(err)
            } finally {
              _iterator48.f()
            }
          }

          if (globalConf.other.autoOpen) {
            var _iterator49 = _createForOfIteratorHelper(vks)
            var _step50

            try {
              for (_iterator49.s(); !(_step50 = _iterator49.n()).done;) {
                var vk = _step50.value
                window.open(vk, '_blank')
              }
            } catch (err) {
              _iterator49.e(err)
            } finally {
              _iterator49.f()
            }
          }

          var _iterator50 = _createForOfIteratorHelper(others)
          var _step51

          try {
            for (_iterator50.s(); !(_step51 = _iterator50.n()).done;) {
              var other = _step51.value
              fuc.echoLog({
                type: 'custom',
                text: '<li><font class="warning">'.concat(getI18n('unknowntype'), ':').concat($(other).attr('class'), '</font></li>')
              })
            }
          } catch (err) {
            _iterator50.e(err)
          } finally {
            _iterator50.f()
          }

          Promise.all(pro).finally(function () {
            fuc.echoLog({
              type: 'custom',
              text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
            })
            if (_this42.conf.fuck.verify) _this42.verify()
          })
        })
      },
      verify: function verify () {
        setTimeout(function () {
          $('.fa-check').click()
        }, 1000)
      },
      remove: function remove () {
        var _this43 = this

        var remove = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false
        var pro = []

        if (remove) {
          this.updateSteamInfo(function () {
            if (_this43.conf.remove.group) {
              var _iterator51 = _createForOfIteratorHelper(fuc.unique(_this43.taskInfo.groups))
              var _step52

              try {
                var _loop37 = function _loop37 () {
                  var group = _step52.value
                  pro.push(new Promise(function (resolve) {
                    fuc.leaveSteamGroup(resolve, group)
                  }))
                }

                for (_iterator51.s(); !(_step52 = _iterator51.n()).done;) {
                  _loop37()
                }
              } catch (err) {
                _iterator51.e(err)
              } finally {
                _iterator51.f()
              }
            }

            Promise.all(pro).finally(function () {
              fuc.echoLog({
                type: 'custom',
                text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
              })
            })
          })
        } else {
          this.get_tasks('remove')
        }
      },
      get_giveawayId: function get_giveawayId () {
        var id = window.location.href.match(/distribution\/([\d]+)/)
        return id ? id[1] : window.location.href
      },
      updateSteamInfo: function updateSteamInfo (callback) {
        var _this44 = this

        new Promise(function (resolve) {
          if (_this44.taskInfo.groups.length > 0) {
            if (_this44.taskInfo.curators.length > 0) {
              fuc.updateSteamInfo(resolve, 'all')
            } else {
              fuc.updateSteamInfo(resolve, 'community')
            }
          } else if (_this44.taskInfo.curators.length > 0) {
            fuc.updateSteamInfo(resolve, 'store')
          } else {
            resolve(1)
          }
        }).then(function (s) {
          if (s === 1) callback()
        }).catch(function (err) {
          console.error(err)
        })
      },
      checkLogin: function checkLogin () {
        if ($('i.fa-sign-in').length > 0) window.open('/auth/steam', '_self')
      },
      checkLeft: function checkLeft (ui) {
        var leftKey = $('span:contains(Осталось ключей)').text().match(/[\d]+/)

        if (!(leftKey && parseInt(leftKey[0]) > 0)) {
          ui.$confirm(getI18n('noKeysLeft'), getI18n('notice'), {
            confirmButtonText: getI18n('confirm'),
            cancelButtonText: getI18n('cancel'),
            type: 'warning',
            center: true
          }).then(function () {
            window.close()
          })
        }
      },
      groups: [],
      // 任务需要加的组
      curators: [],
      // 任务需要关注的鉴赏家
      links: [],
      // 需要浏览的页面链接
      others: [],
      vks: [],
      taskInfo: {
        groups: [],
        // 所有任务需要加的组
        curators: [] // 所有任务需要关注的鉴赏家

      },
      tasks: [],
      // 任务信息
      setting: {
        fuck: true,
        verify: true,
        join: false,
        remove: true
      },
      conf: ((_GM_getValue20 = GM_getValue('conf')) === null || _GM_getValue20 === void 0 ? void 0 : (_GM_getValue20$takeke = _GM_getValue20.takekey) === null || _GM_getValue20$takeke === void 0 ? void 0 : _GM_getValue20$takeke.load) ? GM_getValue('conf').takekey : ((_GM_getValue21 = GM_getValue('conf')) === null || _GM_getValue21 === void 0 ? void 0 : _GM_getValue21.global) || defaultConf
    }
    var plugins = [banana, freegamelottery, gamehag, giveawaysu, givekey, gleam, indiedb, marvelousga, opiumpulses, prys, spoune, takekey]

    if (window.location.host.includes('hclonely')) {
      if (window.location.pathname.includes('setting')) {
        loadSetting(config)
      } else if (window.location.pathname.includes('announcement')) {
        loadAnnouncement()
      }
    } else if ((window.location.host.includes('marvelousga') || window.location.host.includes('dupedornot') || window.location.host.includes('gamecode.win')) && !window.location.pathname.includes('giveaway')) {
      fuc.newTabBlock()
    } else {
      var website = {}
      plugins.map(function (e, i) {
        if (e.test()) {
          website = e
          if (website.before) website.before(website)
        }
      })
      if (globalConf.other.checkLogin && website.checkLogin) website.checkLogin()
      if (globalConf.other.checkLeft && website.checkLeft) website.checkLeft(vueUi)
      $('body').append('\n<div id="fuck-task-app">\n  <div v-cloak id="fuck-task-btn">\n  <el-button :style="style" @click="toggleThisDiv" :icon="icon" :title="title" :show="show"></el-button>\n    <el-button type="primary" v-for="item in buttons" v-if="item.show" @click="item.click" :id="item.id" :title="item.title">{{item.text}}</el-button>\n    <el-button type="primary" @click="toggle" :id="drawerBtn.id" :title="drawerBtn.title">{{drawerBtn.text}}</el-button>\n  </div>\n  <div id="fuck-task-info"></div>\n</div>\n')
      var showLogs = globalConf.other ? globalConf.other.showLogs : defaultConf.other.showLogs
      var btnNum = 1

      for (var _i3 = 0, _Object$values2 = Object.values(website.setting); _i3 < _Object$values2.length; _i3++) {
        var _boolean = _Object$values2[_i3]
        if (_boolean === true) btnNum++
      }

      var btnArea = new Vue({
        el: '#fuck-task-btn',
        data: {
          icon: 'el-icon-arrow-right',
          title: getI18n('hide'),
          show: true,
          style: 'position:absolute;left:-20px;width:20px;border:0px;border-top-right-radius:0px;border-bottom-right-radius:0px;padding:0;height:'.concat(btnNum * 40, 'px;opacity:80%;'),
          buttons: [{
            id: 'fuck-task',
            text: website.setting.fuckText || 'FuckTask',
            title: website.setting.fuckTitle || getI18n('fuckBtnTitle'),
            show: website.setting.fuck,
            click: function click () {
              website.fuck(btnArea)
            }
          }, {
            id: 'verify-task',
            text: website.setting.verifyText || 'Verify',
            title: website.setting.verifyTitle || getI18n('verifyBtnTitle'),
            show: website.setting.verify,
            click: function click () {
              website.verify()
            }
          }, {
            id: 'join-task',
            text: website.setting.joinText || 'Join',
            title: website.setting.joinDes || getI18n('joinBtnTitle'),
            show: website.setting.join,
            click: function click () {
              website.join()
            }
          }, {
            id: 'remove-task',
            text: website.setting.removeText || 'Remove',
            title: website.setting.removeTitle || getI18n('removeBtnTitle'),
            show: website.setting.remove,
            click: function click () {
              website.remove()
            }
          }],
          drawerBtn: {
            id: 'show-logs',
            text: !showLogs ? 'ShowLogs' : 'HideLogs',
            title: !showLogs ? getI18n('showLog') : getI18n('hideLog'),
            show: !!showLogs
          }
        },
        methods: {
          toggleThisDiv: function toggleThisDiv () {
            if (this.show) {
              this.icon = 'el-icon-arrow-left'
              this.title = getI18n('show')
              $('#fuck-task-btn').animate({
                width: '0'
              })
            } else {
              this.icon = 'el-icon-arrow-right'
              this.title = getI18n('hide')
              $('#fuck-task-btn').animate({
                width: '110'
              })
            }

            this.show = !this.show
          },
          toggle: function toggle () {
            if (this.drawerBtn.show) {
              this.drawerBtn.text = 'ShowLogs'
              this.drawerBtn.title = getI18n('showLog')
              $('.fuck-task-logs').animate({
                right: '-100%'
              }, 'fast')
            } else {
              this.drawerBtn.text = 'HideLogs'
              this.drawerBtn.title = getI18n('hideLog')
              $('.fuck-task-logs').animate({
                right: '16px'
              }, 'fast')
            }

            this.drawerBtn.show = !this.drawerBtn.show
          }
        }
      })
      new Vue({
        el: '#fuck-task-info'
      }).$notify({
        title: getI18n('taskLog'),
        iconClass: '',
        duration: 0,
        position: 'bottom-right',
        showClose: false,
        customClass: 'fuck-task-logs',
        dangerouslyUseHTMLString: true,
        message: ''
      })
      $('.fuck-task-logs .el-notification__title').before('\n<h2 v-cloak id="extraBtn" class="el-notification__title">\n<el-badge is-dot class="item" :hidden="hidden">\n  <el-button :icon="icon" :title="title" @click="checkUpdate" circle></el-button>\n</el-badge>\n<el-badge is-dot class="item" :hidden="settingHidden">\n  <el-button icon="el-icon-setting" title="'.concat(getI18n('setting'), '" @click="setting" circle></el-button>\n</el-badge>\n<el-badge is-dot class="item" :hidden="announcementHidden">\n  <el-button :icon="announcementIcon" title="').concat(getI18n('visitUpdateText'), '" @click="updateText" circle></el-button>\n</el-badge>\n<el-badge is-dot class="item" :hidden="otherHidden">\n  <el-button icon="el-icon-brush" title="').concat(getI18n('cleanCache'), '" @click="clearTemp" circle></el-button>\n</el-badge>\n<el-badge is-dot class="item" :hidden="otherHidden">\n  <el-button icon="el-icon-s-promotion" title="').concat(getI18n('feedback'), '" @click="updateBug" circle></el-button>\n</el-badge>\n</h2>\n'))
      var extraBtn = new Vue({
        el: '#extraBtn',
        data: {
          title: getI18n('checkUpdate'),
          icon: 'el-icon-refresh',
          hidden: true,
          settingHidden: !!GM_getValue('conf'),
          otherHidden: true,
          announcementHidden: true,
          announcementIcon: 'el-icon-document'
        },
        methods: {
          setting: function setting () {
            language === 'en' ? window.open('https://userjs.hclonely.com/setting_en.html', '_blank') : window.open('https://userjs.hclonely.com/setting.html', '_blank')
          },
          updateText: function updateText () {
            fuc.getAnnouncement(this)
          },
          updateBug: function updateBug () {
            window.open('https://github.com/HCLonely/auto-task/issues/new/choose', '_blank')
          },
          checkUpdate: function checkUpdate () {
            fuc.checkUpdate(this, true)
          },
          clearTemp: function clearTemp () {
            var status = fuc.echoLog({
              type: 'custom',
              text: '<li>'.concat(getI18n('cleaning'), '<font></font></li>')
            })
            var listValues = GM_listValues()

            var _iterator52 = _createForOfIteratorHelper(listValues)
            var _step53

            try {
              for (_iterator52.s(); !(_step53 = _iterator52.n()).done;) {
                var value = _step53.value
                if (value !== 'conf' && value !== 'language') GM_deleteValue(value)
              }
            } catch (err) {
              _iterator52.e(err)
            } finally {
              _iterator52.f()
            }

            status.success()
          }
        }
      })
      if (globalConf.other.checkUpdate) fuc.checkUpdate(extraBtn)
      $('.fuck-task-logs .el-notification__content').show()

      if (!showLogs) {
        var _$$animate

        $('.fuck-task-logs').animate((_$$animate = {
          right: '-100%',
          display: '-webkit-box'
        }, _defineProperty(_$$animate, 'display', '-ms-flexbox'), _defineProperty(_$$animate, 'display', 'flex'), _$$animate), 0)
      }

      if (website.after) website.after(website)
    }

    GM_registerMenuCommand(getI18n('readme'), function () {
      window.open('https://blog.hclonely.com/posts/777c60d5/', '_blank')
    })
    GM_registerMenuCommand(getI18n('updateSteamInfo'), function () {
      new Promise(function (resolve) {
        fuc.updateSteamInfo(resolve, 'all', true)
      }).then(function (r) {
        fuc.echoLog({
          type: 'custom',
          text: '<li><font class="success">'.concat(getI18n('updateSteamInfoComplete'), '</font></li>')
        })
      })
    })
    GM_registerMenuCommand('Language', function () {
      vueUi.$msgbox({
        title: getI18n('language') + ' : ' + language,
        message: '<select id="auto-task-language"><option value="auto">'.concat(getI18n('auto'), '</option><option value="zh-cn">\u7B80\u4F53\u4E2D\u6587</option><option value="en">English</option></select>'),
        dangerouslyUseHTMLString: true,
        confirmButtonText: getI18n('confirm'),
        cancelButtonText: getI18n('cancel'),
        type: 'info'
      }).then(function (value) {
        if (value) GM_setValue('language', $('#auto-task-language option:selected').val())
        language = getLanguage()
      })
    })
  } catch (e) {
    setTimeout(function () {
      vueUi.$message({
        type: 'error',
        duration: 0,
        message: getI18n('jsError'),
        showClose: true
      })
    }, 500)
    console.log('%c%s', 'color:white;background:red', e.stack)
  }
})()
