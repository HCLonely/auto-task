// ==UserScript==
// @name           自动任务
// @name:en        Auto Task
// @namespace      auto-task
// @version        3.0.1
// @description    自动完成赠key站任务
// @description:en Automatically complete giveaway tasks
// @author         HCLonely
// @license        Apache-2.0
// @iconURL        https://cdn.jsdelivr.net/gh/HCLonely/auto-task@V3/public/favicon.ico
// @homepage       https://blog.hclonely.com/posts/777c60d5/
// @supportURL     https://github.com/HCLonely/auto-task/issues/new/choose
// @updateURL      https://github.com/HCLonely/auto-task/raw/V3/auto-task.user.js

// @include        *://giveaway.su/giveaway/view/*
// @include        *://marvelousga.com/*
// @include        *://www.grabfreegame.com/giveaway/*
// @include        *://www.bananagiveaway.com/giveaway/*
// @include        /https?:\/\/gamehag.com\/.*?giveaway\/.*/
// @include        *://prys.revadike.com/giveaway/?id=*
// @include        *://www.indiedb.com/giveaways*
// @include        *://www.opiumpulses.com/giveaways
// @include        *://gkey.fun/distribution/*
// @include        *://takekey.ru/distribution/*
// @include        *://giveawayhopper.com/giveaway/*
// @include        *://*freegamelottery.com*
// @include        *://gleam.io/*
// @exclude        *googleads*
// @include        https://auto-task.hclonely.com/setting.html
// @include        https://auto-task.hclonely.com/announcement.html

// @require        https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @require        https://cdn.jsdelivr.net/npm/components-jqueryui@1.12.1/ui/effect.min.js
// @require        https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js
// @require        https://cdn.jsdelivr.net/gh/HCLonely/auto-task@V3/lib/bootstrap.min.js
// @require        https://cdn.jsdelivr.net/npm/regenerator-runtime@0.13.5/runtime.min.js
// @require        https://cdn.jsdelivr.net/npm/sweetalert2@9
// @require        https://cdn.jsdelivr.net/npm/promise-polyfill@8.1.3/dist/polyfill.min.js
// @require        https://cdn.jsdelivr.net/gh/HCLonely/auto-task@V3/lib/overhang.min.js
// @resource       CSS https://cdn.jsdelivr.net/gh/HCLonely/auto-task@V3/lib/fuck-task.min.css

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
// @connect        twitch.tv
// @connect        github.com
// @connect        raw.githubusercontent.com
// @connect        *
// @run-at         document-end
// ==/UserScript==

/* eslint-disable no-unsafe-finally,no-void,camelcase,no-mixed-operators,promise/param-names,no-fallthrough,no-unused-vars,no-new,no-unused-expressions,no-sequences,no-undef-init,no-unused-vars */
/* global loadSettings,loadAnnouncement,$,regeneratorRuntime,checkClick,getURLParameter,showAlert,urlPath,checkUser,Centrifuge,DashboardApp,captchaCheck */

function _defineProperty (obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }) } else { obj[key] = value } return obj }

function asyncGeneratorStep (gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value } catch (error) { reject(error); return } if (info.done) { resolve(value) } else { Promise.resolve(value).then(_next, _throw) } }

function _asyncToGenerator (fn) { return function () { var self = this; var args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next (value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value) } function _throw (err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err) } _next(undefined) }) } }

function _createForOfIteratorHelper (o, allowArrayLike) { var it; if (typeof Symbol === 'undefined' || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === 'number') { if (it) o = it; var i = 0; var F = function F () {}; return { s: F, n: function n () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] } }, e: function e (_e2) { throw _e2 }, f: F } } throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') } var normalCompletion = true; var didErr = false; var err; return { s: function s () { it = o[Symbol.iterator]() }, n: function n () { var step = it.next(); normalCompletion = step.done; return step }, e: function e (_e3) { didErr = true; err = _e3 }, f: function f () { try { if (!normalCompletion && it.return != null) it.return() } finally { if (didErr) throw err } } } }

function _toConsumableArray (arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread() }

function _nonIterableSpread () { throw new TypeError('Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

function _iterableToArray (iter) { if (typeof Symbol !== 'undefined' && Symbol.iterator in Object(iter)) return Array.from(iter) }

function _arrayWithoutHoles (arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr) }

function _slicedToArray (arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest() }

function _nonIterableRest () { throw new TypeError('Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

function _unsupportedIterableToArray (o, minLen) { if (!o) return; if (typeof o === 'string') return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor) n = o.constructor.name; if (n === 'Map' || n === 'Set') return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen) }

function _arrayLikeToArray (arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2 }

function _iterableToArrayLimit (arr, i) { if (typeof Symbol === 'undefined' || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break } } catch (err) { _d = true; _e = err } finally { try { if (!_n && _i.return != null) _i.return() } finally { if (_d) throw _e } } return _arr }

function _arrayWithHoles (arr) { if (Array.isArray(arr)) return arr }

(function () {
  'use strict'

  GM_addStyle(GM_getResourceText('CSS'))
  var i18n = {
    'zh-CN': {
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
      updateNow: '立即更新',
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
      getCuratorId: '正在获取鉴赏家ID',
      followCurator: '正在关注鉴赏家',
      unfollowCurator: '正在取关鉴赏家',
      getDeveloperId: '正在获取开发商ID',
      followDeveloper: '正在关注开发商',
      unfollowDeveloper: '正在取关开发商',
      getPublisherId: '正在获取发行商ID',
      followPublisher: '正在关注发行商',
      unfollowPublisher: '正在取关发行商',
      getFranchiseId: '正在获取系列ID',
      followFranchise: '正在关注系列',
      unfollowFranchise: '正在取关系列',
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
      ajaxError: 'Ajax请求出错',
      firstUpdate: '首次更新到3.0+需要重新设置，是否前往设置？',
      goSetting: '前往设置',
      getGroupError: '获取steam组信息失败 <a href="s%" target="_blank">s%</a>'
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
      updateNow: 'Update now',
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
      getCuratorId: 'Getting curator ID',
      followCurator: 'Following curator',
      unfollowCurator: 'Unfollowing curator',
      getDeveloperId: 'Getting developer ID',
      followDeveloper: 'Following developer',
      unfollowDeveloper: 'Unfollowing developer',
      getPublisherId: 'Getting publisher ID',
      followPublisher: 'Following publisher',
      unfollowPublisher: 'Unfollowing publisher',
      getFranchiseId: 'Getting franchise ID',
      followFranchise: 'Following franchise',
      unfollowFranchise: 'Unfollowing franchise',
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
      ajaxError: 'Ajax request error',
      firstUpdate: 'The first update to 3.0+ requires re-setting. Do you want to go to the setting?',
      goSetting: 'Yes',
      getGroupError: 'Failed to get steam group information. <a href="s%" target="_blank">s%</a>'
    }
  }
  var language = getLanguage()

  function getLanguage () {
    var lan = GM_getValue('language') || 'auto'

    if (lan === 'auto') {
      var _navigator, _navigator2

      var browserLanguage = (((_navigator = navigator) === null || _navigator === void 0 ? void 0 : _navigator.browserLanguage) || ((_navigator2 = navigator) === null || _navigator2 === void 0 ? void 0 : _navigator2.language) || '').toLowerCase()
      lan = browserLanguage.includes('en') ? 'en' : 'zh-CN'
    }

    return lan
  }

  function getI18n (name) {
    var str = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null
    var value = 'null'
    if (str) value = i18n[language][name] ? i18n[language][name].replace(/s%/g, str) : 'null'; else value = i18n[language][name] || 'null'
    return value
  }

  $(document).ajaxError(function (event, xhr, options, exc) {
    Swal.fire({
      icon: 'error',
      text: getI18n('jsError')
    })
    console.log('%c%s', 'color:white;background:red', getI18n('ajaxError') + '：')
    console.log('Event:', event)
    console.log('XMLHttpRequest :', xhr)
    console.log('Options:', options)
    console.log('JavaScript exception:', exc)
  })

  try {
    var _config$banana, _config$freegamelotte, _config$gamehag, _config$giveawaysu, _config$gleam, _config$indiedb, _config$marvelousga, _config$opiumpulses, _config$prys, _config$takekey

    /* eslint-disable no-unused-vars */
    if (GM_getValue('conf') && window.location.host.includes('hclonely.com/setting')) {
      var _GM_getValue$global, _GM_getValue$global$f

      if (typeof ((_GM_getValue$global = GM_getValue('conf').global) === null || _GM_getValue$global === void 0 ? void 0 : (_GM_getValue$global$f = _GM_getValue$global.fuck) === null || _GM_getValue$global$f === void 0 ? void 0 : _GM_getValue$global$f.joinSteamGroup) !== 'boolean') {
        Swal.fire({
          icon: 'warning',
          text: getI18n('firstUpdate'),
          confirmButtonText: getI18n('goSetting'),
          cancelButtonText: getI18n('cancel'),
          showCancelButton: true
        })
      }
    }

    var steamInfo = Object.assign({
      userName: '',
      steam64Id: '',
      communitySessionID: '',
      storeSessionID: '',
      updateTime: 0
    }, GM_getValue('steamInfo'))
    var defaultConf = {
      global: {
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
          showDetails: true,
          checkLogin: true,
          checkLeft: true,
          autoOpen: true,
          reCaptcha: false
        },
        hotKey: {
          fuckKey: 'Alt + A',
          verifyKey: 'Alt + V',
          removeKey: 'Alt + R',
          toggleLogKey: 'Alt + L'
        }
      },
      giveawaysu: {
        fuck: {
          joinSteamGroup: true,
          followCurator: true,
          followDeveloper: true,
          followPublisher: true,
          likeAnnouncement: true,
          addToWishlist: true,
          followGame: true,
          visitLink: true
        },
        remove: {
          leaveSteamGroup: true,
          unfollowCurator: true,
          unfollowDeveloper: true,
          unfollowPublisher: true,
          removeFromWishlist: true,
          unfollowGame: true
        },
        enable: false
      },
      marvelousga: {
        fuck: {
          joinSteamGroup: true,
          followCurator: true,
          followDeveloper: true,
          followPublisher: true,
          likeAnnouncement: true,
          addToWishlist: true,
          followGame: true,
          visitLink: true,
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
        enable: false
      },
      banana: {
        fuck: {
          joinSteamGroup: true,
          followCurator: true,
          followDeveloper: true,
          followPublisher: true,
          likeAnnouncement: true,
          addToWishlist: true,
          followGame: true,
          visitLink: true,
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
        enable: false
      },
      gamehag: {
        fuck: {
          joinSteamGroup: true,
          visitLink: true,
          verifyTask: true
        },
        remove: {
          leaveSteamGroup: true
        },
        enable: false
      },
      prys: {
        fuck: {
          joinSteamGroup: true,
          followCurator: true,
          verifyTask: true
        },
        remove: {
          leaveSteamGroup: true,
          unfollowCurator: true
        },
        enable: false
      },
      takekey: {
        fuck: {
          joinSteamGroup: true,
          visitLink: true
        },
        remove: {
          leaveSteamGroup: true
        },
        enable: false
      },
      gleam: {
        fuck: {
          joinSteamGroup: true,
          visitLink: true,
          verifyTask: true
        },
        remove: {
          leaveSteamGroup: true
        },
        enable: false
      },
      opiumpulses: {
        other: {
          limitPoint: ''
        },
        enable: false
      },
      freegamelottery: {
        fuck: {
          autoLogin: true,
          doTask: true
        },
        userInfo: {
          username: '',
          password: ''
        },
        enable: false
      },
      announcement: ''
    }
    var config = Object.assign(JSON.parse(JSON.stringify(defaultConf)), GM_getValue('conf') || {})

    for (var _i = 0, _Object$entries = Object.entries(config); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2)
      var k = _Object$entries$_i[0]
      var v = _Object$entries$_i[1]

      var defaultConfig = JSON.parse(JSON.stringify(defaultConf))
      config[k] = defaultConfig[k] ? Object.assign(defaultConfig[k], config[k]) : null
    }

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
                      var _ref = [response.responseText.match(/g_steamID = "(.+?)";/), response.responseText.match(/g_sessionID = "(.+?)";/), response.responseText.match(/steamcommunity.com\/id\/(.+?)\/friends\//)]
                      var steam64Id = _ref[0]
                      var communitySessionID = _ref[1]
                      var userName = _ref[2]
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

        var _ref2 = [this.echoLog({
          type: 'getGroupId',
          text: groupName
        }), GM_getValue('groupNameToId') || {}]
        var status = _ref2[0]
        var groupNameToId = _ref2[1]

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
      getCuratorID: function getCuratorID (developerName, callback, type, path) {
        var _this4 = this

        var _ref3 = [this.echoLog({
          type: 'getCuratorId',
          text: ''.concat(path, '/').concat(developerName)
        }), GM_getValue('developerNameToId') || {}]
        var status = _ref3[0]
        var developerNameToId = _ref3[1]

        if (developerNameToId[developerName]) {
          status.success()
          callback(developerName, developerNameToId[developerName])
        } else {
          new Promise(function (resolve) {
            _this4.httpRequest({
              url: 'https://store.steampowered.com/'.concat(path, '/').concat(developerName),
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

        var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'followDeveloper'
        var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'developer'
        this.getCuratorID(developerName, function (developerName, curatorId) {
          var status = _this5.echoLog({
            type: type,
            text: developerName
          })

          _this5.followCurator(r, curatorId, '1', status)
        }, type, path)
      },
      unfollowDeveloper: function unfollowDeveloper (r, developerName) {
        var _this6 = this

        var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'unfollowDeveloper'
        var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'developer'
        this.getCuratorID(developerName, function (developerName, curatorId) {
          var status = _this6.echoLog({
            type: type,
            text: developerName
          })

          _this6.followCurator(r, curatorId, '0', status)
        }, type, path)
      },
      followPublisher: function followPublisher (r, publisherName) {
        this.followDeveloper(r, publisherName, 'followPublisher', 'publisher')
      },
      unfollowPublisher: function unfollowPublisher (r, publisherName) {
        this.unfollowDeveloper(r, publisherName, 'unfollowPublisher', 'publisher')
      },
      followFranchise: function followFranchise (r, franchiseName) {
        this.followDeveloper(r, franchiseName, 'followFranchise', 'franchise')
      },
      unfollowFranchise: function unfollowFranchise (r, franchiseName) {
        this.unfollowDeveloper(r, franchiseName, 'unfollowFranchise', 'franchise')
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
      likeAnnouncements: function likeAnnouncements (r, rawMatch) {
        var url = ''
        var status = null
        var data = {}

        if (rawMatch.length === 5) {
          status = this.echoLog({
            type: 'likeAnnouncements',
            url: rawMatch[1],
            id: rawMatch[2]
          })
          url = 'https://store.steampowered.com/updated/ajaxrateupdate/' + rawMatch[2]
          data = {
            sessionid: steamInfo.storeSessionID,
            wgauthtoken: rawMatch[3],
            voteup: 1,
            clanid: rawMatch[4],
            ajax: 1
          }
        } else {
          status = this.echoLog({
            type: 'likeAnnouncements',
            url: rawMatch.input,
            id: rawMatch[1]
          })
          url = rawMatch.input.replace('/detail/', '/rate/')
          data = {
            sessionid: steamInfo.communitySessionID,
            voteup: true
          }
        }

        this.httpRequest({
          url: url,
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: $.param(data),
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
      checkUpdate: function checkUpdate () {
        var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false
        var status = false
        var echoLog = this.echoLog
        if (s) {
          status = echoLog({
            type: 'custom',
            text: '<li>'.concat(getI18n('checkingUpdate'), '<font></font></li>')
          })
        }
        this.httpRequest({
          url: 'https://auto-task.hclonely.com/version.json?t=' + new Date().getTime(),
          method: 'get',
          dataType: 'json',
          onload: function onload (response) {
            var _response$response9, _response$response10

            if (debug) console.log(response)

            if (((_response$response9 = response.response) === null || _response$response9 === void 0 ? void 0 : _response$response9.version) === GM_info.script.version) {
              if (s) status.success(getI18n('thisIsNew'))
            } else if ((_response$response10 = response.response) === null || _response$response10 === void 0 ? void 0 : _response$response10.version) {
              echoLog({
                type: 'custom',
                text: '<li>'.concat(getI18n('newVer') + 'V' + response.response.version, '<a href="https://github.com/HCLonely/auto-task/raw/V3/auto-task.user.js" target="_blank">').concat(getI18n('updateNow'), '</a><font></font></li>')
              })
              if (s) status.success(getI18n('newVer') + response.response.version)
            } else {
              if (s) status.error('Error:' + (response.statusText || response.status))
            }
          },
          ontimeout: function ontimeout (response) {
            if (debug) console.log(response)
            if (s) status.error('Error:Timeout(0)')
          },
          onabort: function onabort (response) {
            if (debug) console.log(response)
            if (s) status.error('Error:Abort(0)')
          },
          onerror: function onerror (response) {
            if (debug) console.log(response)
            if (s) status.error('Error:Error(0)')
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
        // switch case !!
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

          case 'getCuratorId':
            ele = $('<li>'.concat(getI18n('getCuratorId'), '<a href="https://store.steampowered.com/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
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

          case 'getFranchiseId':
            ele = $('<li>'.concat(getI18n('getFranchiseId'), '<a href="https://store.steampowered.com/franchise/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'followFranchise':
            ele = $('<li>'.concat(getI18n('followFranchise'), '<a href="https://store.steampowered.com/franchise/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'unfollowFranchise':
            ele = $('<li>'.concat(getI18n('unfollowFranchise'), '<a href="https://store.steampowered.com/franchise/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
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
            ele = $('<li>'.concat(getI18n('unknown'), ':').concat(e.type, '...<font></font></li>'))
            break
        }

        ele.addClass('card-text')
        $('#fuck-task-info .card-textarea').append(ele)
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
      toggleLogs: function toggleLogs () {
        var btn = $('#toggle-logs')
        var taskInfoDiv = $('#fuck-task-info')

        if (taskInfoDiv.is(':hidden')) {
          btn.text('HideLogs').attr('title', getI18n('hideLog'))
          taskInfoDiv.show().animate({
            right: '16px'
          }, 'fast')
        } else {
          btn.text('ShowLogs').attr('title', getI18n('showLog'))
          taskInfoDiv.animate({
            right: '-100%'
          }, 'fast', function () {
            taskInfoDiv.hide()
          })
        }
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

        for (var _k in opt) {
          ret = new RegExp('(' + _k + ')').exec(fmt)

          if (ret) {
            fmt = fmt.replace(ret[1], ret[1].length === 1 ? opt[_k] : opt[_k].padStart(ret[1].length, '0'))
          }
        }

        return fmt
      },
      isEmptyObjArr: function isEmptyObjArr (object) {
        for (var _i2 = 0, _Object$values = Object.values(object); _i2 < _Object$values.length; _i2++) {
          var value = _Object$values[_i2]

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
      toggleActions: function toggleActions (_ref4) {
        var website = _ref4.website
        var type = _ref4.type
        var elements = _ref4.elements
        var resolve = _ref4.resolve
        var action = _ref4.action
        var _ref4$toFinalUrl = _ref4.toFinalUrl
        var toFinalUrl = _ref4$toFinalUrl === void 0 ? {} : _ref4$toFinalUrl
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
                case 'developer':
                  elementName = toFinalUrlElement.includes('publisher') ? toFinalUrlElement.match(/publisher\/(.+)\/?/) : toFinalUrlElement.includes('developer') ? toFinalUrlElement.match(/developer\/(.+)\/?/) : toFinalUrlElement.match(/pub\/(.+)\/?/) || toFinalUrlElement.match(/dev\/(.+)\/?/)
                  break

                case 'franchise':
                  elementName = toFinalUrlElement.match(/franchise\/(.+)\/?/)
                  break

                case 'game':
                case 'wishlist':
                  elementName = toFinalUrlElement.match(/app\/([\d]+)/)
                  break

                case 'announcement':
                {
                  if (toFinalUrlElement.includes('announcements/detail')) {
                    elementName = toFinalUrlElement.match(/announcements\/detail\/([\d]+)/)
                  } else {
                    elementName = toFinalUrlElement.match(/(https?:\/\/store\.steampowered\.com\/newshub\/app\/[\d]+\/view\/([\d]+))\?authwgtoken=(.+?)&clanid=(.+)/)
                  }

                  break
                }

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

                case 'franchise':
                  pro.push(new Promise(function (resolve) {
                    action === 'fuck' ? fuc.followFranchise(resolve, elementName[1]) : fuc.unfollowFranchise(resolve, elementName[1])
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
                    if (action === 'fuck') {
                      fuc.likeAnnouncements(resolve, elementName)
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
      fuck: function fuck () {
        var _this12 = this

        var _ref5 = [$("p:contains('Collect'):contains('banana')"), $("p:contains('Collect'):contains('point')")]
        var needBanana = _ref5[0]
        var needPoints = _ref5[1]
        var msg = ''
        if (needBanana.length > 0) msg = getI18n('needBanana', needBanana.text().match(/[\d]+/gim)[0])
        if (needPoints.length > 0) msg = getI18n('needPoints', needPoints.text().replace(/Collect/gi, ''))

        if (needPoints.length > 0 || needBanana.length > 0) {
          Swal.fire({
            icon: 'warning',
            title: getI18n('notice'),
            text: msg,
            confirmButtonText: getI18n('confirm'),
            cancelButtonText: getI18n('cancel'),
            showCancelButton: true
          }).then(function (result) {
            if (result.value) {
              _this12.get_tasks('do_task')
            }
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
          var _ref6 = [[], [], [], [], [], [], []]
          this.tasks = _ref6[0]
          this.links = _ref6[1]
          this.groups = _ref6[2]
          this.curators = _ref6[3]
          this.wishlists = _ref6[4]
          this.fGames = _ref6[5]
          this.taskIds = _ref6[6]
          var _ref7 = [fuc.echoLog({
            type: 'custom',
            text: '<li>'.concat(getI18n('processTasksInfo'), '<font></font></li>')
          }), $('ul.tasks li:not(:contains(Completed))'), []]
          var status = _ref7[0]
          var tasksUl = _ref7[1]
          var pro = _ref7[2]

          var _iterator2 = _createForOfIteratorHelper(tasksUl)
          var _step2

          try {
            var _loop2 = function _loop2 () {
              var task = _step2.value
              // 遍历任务信息
              var _ref9 = [$(task).find('p'), $(task).find('button:contains(Verify)')]
              var taskDes = _ref9[0]
              var verifyBtn = _ref9[1]
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
            var _ref8 = [fuc.unique(_this13.links), fuc.unique(_this13.groups), fuc.unique(_this13.curators), fuc.unique(_this13.wishlists), fuc.unique(_this13.fGames), fuc.unique(_this13.taskInfo.groups), fuc.unique(_this13.taskInfo.curators), fuc.unique(_this13.taskInfo.wishlists), fuc.unique(_this13.taskInfo.fGames), fuc.unique(_this13.taskIds), fuc.unique(_this13.tasks)]
            _this13.links = _ref8[0]
            _this13.groups = _ref8[1]
            _this13.curators = _ref8[2]
            _this13.wishlists = _ref8[3]
            _this13.fGames = _ref8[4]
            _this13.taskInfo.groups = _ref8[5]
            _this13.taskInfo.curators = _ref8[6]
            _this13.taskInfo.wishlists = _ref8[7]
            _this13.taskInfo.fGames = _ref8[8]
            _this13.taskIds = _ref8[9]
            _this13.tasks = _ref8[10]
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
          var _ref11, pro, links, _iterator3, _step3, _loop3

          return regeneratorRuntime.wrap(function _callee$ (_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _ref11 = [[], fuc.unique(_this14.links)], pro = _ref11[0], links = _ref11[1]
                  _context.next = 3
                  return _this14.toggleActions('fuck', pro)

                case 3:
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
                    if (_this14.conf.fuck.verifyTask) _this14.verify()
                  })

                case 5:
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
                    return _this16.toggleActions('remove', pro)

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
        var _ref13 = action === 'fuck' ? [this.groups, this.curators, this.wishlists, this.fGames] : [this.taskInfo.groups, this.taskInfo.curators, this.taskInfo.wishlists, this.taskInfo.fGames]
        var _ref14 = _slicedToArray(_ref13, 4)
        var groups = _ref14[0]
        var curators = _ref14[1]
        var wishlists = _ref14[2]
        var fGames = _ref14[3]

        if (this.conf[action][action === 'fuck' ? 'joinSteamGroup' : 'leaveSteamGroup'] && groups.length > 0) {
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

        if (this.conf[action][action === 'fuck' ? 'followCurator' : 'unfollowCurator'] && curators.length > 0) {
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

        if (this.conf[action][action === 'fuck' ? 'addToWishlist' : 'removeFromWishlist'] && wishlists.length > 0) {
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

        if (this.conf[action][action === 'fuck' ? 'followGame' : 'unfollowGame'] && fGames.length > 0) {
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
      checkLeft: function checkLeft () {
        if ($('.left b').text() === '0') {
          Swal.fire({
            icon: 'warning',
            title: getI18n('notice'),
            text: getI18n('noKeysLeft'),
            confirmButtonText: getI18n('confirm'),
            cancelButtonText: getI18n('cancel'),
            showCancelButton: true
          }).then(function (result) {
            if (result.value) {
              window.close()
            }
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
      setting: {},
      conf: (config === null || config === void 0 ? void 0 : (_config$banana = config.banana) === null || _config$banana === void 0 ? void 0 : _config$banana.enable) ? config.banana : globalConf
    }
    var freegamelottery = {
      test: function test () {
        return window.location.host.includes('freegamelottery')
      },
      after: function after () {
        if (window.location.host === 'd.freegamelottery.com' && GM_getValue('lottery') === 1) this.draw()
      },
      fuck: function fuck () {
        GM_setValue('lottery', 1)

        if ($('a.registration-button').length > 0) {
          if (this.conf.fuck.autoLogin) {
            var userInfo = GM_getValue('conf').freegamelottery.userInfo

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
              $('body').overHang({
                type: 'warn',
                activity: 'notification',
                message: getI18n('needLogin')
              })
              $('a.registration-button')[0].click()
              $('button[value=Login]').click(function () {
                var conf = GM_getValue('conf')
                conf.freegamelottery.userInfo = {
                  username: $('#modal_login').val(),
                  password: $('#modal_password').val()
                }
                GM_setValue('conf', conf)
              })
            }
          } else {
            $('body').overHang({
              type: 'warn',
              activity: 'notification',
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
        verify: {
          show: false
        },
        remove: {
          show: false
        }
      },
      conf: (config === null || config === void 0 ? void 0 : (_config$freegamelotte = config.freegamelottery) === null || _config$freegamelotte === void 0 ? void 0 : _config$freegamelotte.enable) ? config.freegamelottery : globalConf
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
        var _this18 = this

        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'do_task'
        var _ref15 = [fuc.echoLog({
          type: 'custom',
          text: '<li>'.concat(getI18n('getTasksInfo'), '<font></font></li>')
        }), $('button[data-id]')]
        var status = _ref15[0]
        var verifyBtns = _ref15[1]

        if (callback === 'do_task') {
          var _ref16 = [[], []]
          this.groups = _ref16[0]
          this.tasks = _ref16[1]
          var _pro2 = []
          var taskInfo = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
          if (taskInfo && !fuc.isEmptyObjArr(taskInfo)) this.taskInfo = taskInfo

          var _iterator5 = _createForOfIteratorHelper(verifyBtns)
          var _step5

          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var btn = _step5.value
              var _ref19 = [$(btn).attr('data-id'), $(btn).parent().prev().text()]
              var _taskId = _ref19[0]
              var _taskDes = _ref19[1]

              if ($(btn).parents('.task-content').next().text().includes('+1')) {
                if (/join.*?steam.*?group/gim.test($(btn).parent().prev().text())) {
                  (function () {
                    var groupurl = $(btn).parent().find('a:contains("to do")').attr('href')

                    _pro2.push(new Promise(function (res) {
                      new Promise(function (resolve) {
                        fuc.getFinalUrl(resolve, groupurl)
                      }).then(function (r) {
                        if (r.result === 'success') {
                          var groupName = r.finalUrl.match(/groups\/(.+)\/?/)

                          if (groupName) {
                            _this18.groups.push(groupName[1])

                            _this18.taskInfo.groups.push(groupName[1])
                          } else {
                            fuc.echoLog({
                              type: 'custom',
                              text: '<li>'.concat(getI18n('getGroupError', groupurl), '<font></font></li>')
                            })
                          }
                        } else {
                          fuc.echoLog({
                            type: 'custom',
                            text: '<li>'.concat(getI18n('getGroupError', groupurl), '<font></font></li>')
                          })
                        }

                        res(1)
                      })
                    }))
                  })()
                }

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
            var _ref17 = [$('a.giveaway-survey').attr('data-task_id'), 'Complete the survey']
            var taskId = _ref17[0]
            var taskDes = _ref17[1]
            this.tasks.push({
              taskId: taskId,
              taskDes: taskDes
            })
          }

          Promise.all(_pro2).finally(function () {
            var _ref18 = [fuc.unique(_this18.groups), fuc.unique(_this18.taskInfo.groups), fuc.unique(_this18.tasks)]
            _this18.groups = _ref18[0]
            _this18.taskInfo.groups = _ref18[1]
            _this18.tasks = _ref18[2]
            status.success()
            GM_setValue('taskInfo[' + window.location.host + _this18.get_giveawayId() + ']', _this18.taskInfo)

            if (_this18.tasks.length > 0) {
              _this18.do_task()
            } else {
              fuc.echoLog({
                type: 'custom',
                text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
              })
              if (_this18.conf.fuck.verifyTask) _this18.verify()
            }
          })
        } else if (callback === 'verify') {
          this.tasks = []

          var _iterator6 = _createForOfIteratorHelper(verifyBtns)
          var _step6

          try {
            for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
              var _btn = _step6.value
              var _ref20 = [$(_btn).attr('data-id'), $(_btn).parent().prev().text()]
              var _taskId2 = _ref20[0]
              var _taskDes2 = _ref20[1]
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

          status.success()
        } else if (callback === 'remove') {
          status.success()
          fuc.echoLog({
            type: 'custom',
            text: '<li><font class="success">'.concat(getI18n('cannotRemove'), '</font></li>')
          })
        } else {
          status.success()
          fuc.echoLog({
            type: 'custom',
            text: '<li><font class="error">'.concat(getI18n('unknown'), '\uFF01</font></li>')
          })
        }

        if (debug) console.log(this)
      },
      do_task: function do_task () {
        var _this19 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee4 () {
          var _ref21, pro, tasks, _loop5, i

          return regeneratorRuntime.wrap(function _callee4$ (_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _ref21 = [[], fuc.unique(_this19.tasks)], pro = _ref21[0], tasks = _ref21[1]
                  _loop5 = /* #__PURE__ */regeneratorRuntime.mark(function _loop5 (i) {
                    var task
                    return regeneratorRuntime.wrap(function _loop5$ (_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
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

                            _context4.next = 5
                            return new Promise(function (resolve) {
                              setTimeout(function () {
                                resolve()
                              }, 1000)
                            })

                          case 5:
                          case 'end':
                            return _context4.stop()
                        }
                      }
                    }, _loop5)
                  })
                  i = 0

                case 3:
                  if (!(i < tasks.length)) {
                    _context5.next = 8
                    break
                  }

                  return _context5.delegateYield(_loop5(i), 't0', 5)

                case 5:
                  i++
                  _context5.next = 3
                  break

                case 8:
                  Promise.all(pro).finally(function () {
                    _this19.updateSteamInfo(/* #__PURE__ */_asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee3 () {
                      var pro
                      return regeneratorRuntime.wrap(function _callee3$ (_context3) {
                        while (1) {
                          switch (_context3.prev = _context3.next) {
                            case 0:
                              pro = []
                              _context3.next = 3
                              return _this19.toggleActions('fuck', pro)

                            case 3:
                              Promise.all(pro).finally(function () {
                                fuc.echoLog({
                                  type: 'custom',
                                  text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                                })
                                if (_this19.conf.fuck.verifyTask) _this19.verify()
                              })

                            case 4:
                            case 'end':
                              return _context3.stop()
                          }
                        }
                      }, _callee3)
                    })))
                  })

                case 9:
                case 'end':
                  return _context5.stop()
              }
            }
          }, _callee4)
        }))()
      },
      verify: function verify () {
        var _arguments = arguments
        var _this20 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee5 () {
          var verify, _ref23, _pro3, tasks, _loop6, i

          return regeneratorRuntime.wrap(function _callee5$ (_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  verify = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : false

                  if (!verify) {
                    _context7.next = 13
                    break
                  }

                  _ref23 = [[], fuc.unique(_this20.tasks)], _pro3 = _ref23[0], tasks = _ref23[1]
                  _loop6 = /* #__PURE__ */regeneratorRuntime.mark(function _loop6 (i) {
                    var task, status
                    return regeneratorRuntime.wrap(function _loop6$ (_context6) {
                      while (1) {
                        switch (_context6.prev = _context6.next) {
                          case 0:
                            task = tasks[i]
                            status = fuc.echoLog({
                              type: 'custom',
                              text: '<li>'.concat(getI18n('verifyingTask'), '<a href="/giveaway/click/').concat(task.taskId, '" target="_blank">').concat(task.taskDes.trim(), '</a>...<font></font></li>')
                            })

                            _pro3.push(new Promise(function (resolve) {
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

                            _context6.next = 5
                            return new Promise(function (resolve) {
                              setTimeout(function () {
                                resolve()
                              }, 1000)
                            })

                          case 5:
                          case 'end':
                            return _context6.stop()
                        }
                      }
                    }, _loop6)
                  })
                  i = 0

                case 5:
                  if (!(i < tasks.length)) {
                    _context7.next = 10
                    break
                  }

                  return _context7.delegateYield(_loop6(i), 't0', 7)

                case 7:
                  i++
                  _context7.next = 5
                  break

                case 10:
                  Promise.all(_pro3).finally(function () {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="success">'.concat(getI18n('verifyTasksComplete'), '</font></li>')
                    })
                  })
                  _context7.next = 14
                  break

                case 13:
                  _this20.get_tasks('verify')

                case 14:
                case 'end':
                  return _context7.stop()
              }
            }
          }, _callee5)
        }))()
      },
      remove: function remove () {
        var _this21 = this

        var remove = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false

        if (this.conf.remove.leaveSteamGroup && this.groups.length > 0) {
          this.updateSteamInfo(/* #__PURE__ */_asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee6 () {
            var pro
            return regeneratorRuntime.wrap(function _callee6$ (_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    pro = []
                    _context8.next = 3
                    return _this21.toggleActions('remove', pro)

                  case 3:
                    Promise.all(pro).finally(function () {
                      fuc.echoLog({
                        type: 'custom',
                        text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                      })
                    })

                  case 4:
                  case 'end':
                    return _context8.stop()
                }
              }
            }, _callee6)
          })))
        } else {
          fuc.echoLog({
            type: 'custom',
            text: '<li><font class="success">'.concat(getI18n('cannotRemove'), '</font></li>')
          })
        }
      },
      toggleActions: function toggleActions (action, pro) {
        var groups = action === 'fuck' ? this.groups : this.taskInfo.groups

        if (this.conf[action][action === 'fuck' ? 'joinSteamGroup' : 'leaveSteamGroup'] && groups.length > 0) {
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
      },
      updateSteamInfo: function updateSteamInfo (callback) {
        var _this22 = this

        new Promise(function (resolve) {
          if (_this22.taskInfo.groups.length > 0) {
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
      get_giveawayId: function get_giveawayId () {
        var id = window.location.href.match(/\/giveaway\/([\d]+)/)
        return id ? id[1] : window.location.href
      },
      checkLeft: function checkLeft () {
        if ($('.giveaway-counter:first .strong').text() === '0') {
          Swal.fire({
            icon: 'warning',
            title: getI18n('notice'),
            text: getI18n('noKeysLeft'),
            confirmButtonText: getI18n('confirm'),
            cancelButtonText: getI18n('cancel'),
            showCancelButton: true
          }).then(function (result) {
            if (result.value) {
              window.close()
            }
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
      setting: {},
      conf: (config === null || config === void 0 ? void 0 : (_config$gamehag = config.gamehag) === null || _config$gamehag === void 0 ? void 0 : _config$gamehag.enable) ? config.gamehag : globalConf
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
          var _ref25 = [fuc.echoLog({
            type: 'custom',
            text: '<li>'.concat(getI18n('getTasksInfo'), '<font></font></li>')
          }), $('#actions tr')]
          var status = _ref25[0]
          var tasks = _ref25[1]

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
        var _ref26 = [[], taskDes.text().trim(), taskDes.attr('href')]
        var taskInfo = _ref26[0]
        var taskName = _ref26[1]
        var link = _ref26[2]

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
        } else if (/(follow|subscribe).*publisher/gim.test(taskName)) {
          taskInfo.push({
            name: 'publisher',
            link: link
          })
          this.store = 1
        } else if (/(follow|subscribe).*franchise/gim.test(taskName)) {
          taskInfo.push({
            name: 'franchise',
            link: link
          })
          this.store = 1
        } else if (/(follow|subscribe).*developer/gim.test(taskName)) {
          taskInfo.push({
            name: 'developer',
            link: link
          })
          this.store = 1
        } else if (/(follow|subscribe).*curator/gim.test(taskName)) {
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
        var _this23 = this

        // 处理任务链接
        var _ref27 = [fuc.echoLog({
          type: 'custom',
          text: '<li>'.concat(getI18n('processTasksUrl'), '<font></font></li>')
        }), []]
        var status = _ref27[0]
        var pro = _ref27[1]

        var _iterator9 = _createForOfIteratorHelper(this.taskInfo.links)
        var _step9

        try {
          var _loop7 = function _loop7 () {
            var link = _step9.value
            pro.push(new Promise(function (resolve) {
              if (_this23.taskInfo.toFinalUrl[link]) {
                resolve({
                  result: 'success'
                })
              } else {
                fuc.getFinalUrl(resolve, link, {
                  onload: function onload (response) {
                    if (response.finalUrl.includes('newshub/app')) {
                      var _response$responseTex

                      var div = (_response$responseTex = response.responseText.match(/<div id="application_config"[\w\W]*?>/)) === null || _response$responseTex === void 0 ? void 0 : _response$responseTex[0]

                      if (!div) {
                        resolve({
                          result: 'success',
                          finalUrl: response.finalUrl,
                          url: link
                        })
                        return
                      }

                      var appConfig = $(div)

                      var _JSON$parse = JSON.parse(appConfig.attr('data-userinfo'))
                      var authwgtoken = _JSON$parse.authwgtoken

                      var clanAccountID = JSON.parse(appConfig.attr('data-groupvanityinfo'))[0].clanAccountID
                      resolve({
                        result: 'success',
                        finalUrl: ''.concat(response.finalUrl, '?authwgtoken=').concat(authwgtoken, '&clanid=').concat(clanAccountID),
                        url: link
                      })
                    } else {
                      resolve({
                        result: 'success',
                        finalUrl: response.finalUrl,
                        url: link
                      })
                    }
                  }
                })
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
                _this23.taskInfo.toFinalUrl[r.url] = r.finalUrl
              }
            }
          } catch (err) {
            _iterator10.e(err)
          } finally {
            _iterator10.f()
          }

          var _ref28 = [fuc.unique(_this23.links), fuc.unique(_this23.taskInfo.groups), fuc.unique(_this23.taskInfo.curators), fuc.unique(_this23.taskInfo.publishers), fuc.unique(_this23.taskInfo.developers), fuc.unique(_this23.taskInfo.franchises), fuc.unique(_this23.taskInfo.fGames), fuc.unique(_this23.taskInfo.wGames), fuc.unique(_this23.taskInfo.announcements), fuc.unique(_this23.taskInfo.links)]
          _this23.links = _ref28[0]
          _this23.taskInfo.groups = _ref28[1]
          _this23.taskInfo.curators = _ref28[2]
          _this23.taskInfo.publishers = _ref28[3]
          _this23.taskInfo.developers = _ref28[4]
          _this23.taskInfo.franchises = _ref28[5]
          _this23.taskInfo.fGames = _ref28[6]
          _this23.taskInfo.wGames = _ref28[7]
          _this23.taskInfo.announcements = _ref28[8]
          _this23.taskInfo.links = _ref28[9]
          // 任务链接处理完成
          GM_setValue('taskInfo[' + window.location.host + _this23.get_giveawayId() + ']', _this23.taskInfo)
          status.success()
          if (debug) console.log(_this23)
          e === 'doTask' ? _this23.do_task('fuck') : _this23.do_task('remove')
        }).catch(function (error) {
          status.error()
          if (debug) console.log(error)
        })
      },
      do_task: function do_task (act) {
        var _this24 = this

        if ($('div.bind-discord').is(':visible')) $('div.bind-discord a')[0].click()
        if ($('div.bind-twitch').is(':visible')) $('div.bind-twitch a')[0].click()
        new Promise(function (resolve) {
          if (_this24.taskInfo.groups.length > 0 || _this24.taskInfo.announcements.length > 0) {
            if (_this24.taskInfo.curators.length > 0 || _this24.taskInfo.publishers.length > 0 || _this24.taskInfo.developers.length > 0 || _this24.taskInfo.fGames.length > 0 || _this24.taskInfo.wGames.length > 0) {
              fuc.updateSteamInfo(resolve, 'all')
            } else {
              fuc.updateSteamInfo(resolve, 'community')
            }
          } else if (_this24.taskInfo.curators.length > 0 || _this24.taskInfo.publishers.length > 0 || _this24.taskInfo.developers.length > 0 || _this24.taskInfo.fGames.length > 0 || _this24.taskInfo.wGames.length > 0) {
            fuc.updateSteamInfo(resolve, 'store')
          } else {
            resolve(1)
          }
        }).then(function (s) {
          if (s === 1) {
            var _pro4 = []

            if (_this24.conf[act][act === 'fuck' ? 'joinSteamGroup' : 'leaveSteamGroup'] && _this24.taskInfo.groups.length > 0) {
              _pro4.push(new Promise(function (resolve) {
                fuc.toggleActions({
                  website: 'giveawaysu',
                  type: 'group',
                  elements: _this24.taskInfo.groups,
                  resolve: resolve,
                  action: act,
                  toFinalUrl: _this24.taskInfo.toFinalUrl
                })
              }))
            }

            if (_this24.conf[act][act === 'fuck' ? 'followCurator' : 'unfollowCurator'] && _this24.taskInfo.curators.length > 0) {
              _pro4.push(new Promise(function (resolve) {
                fuc.toggleActions({
                  website: 'giveawaysu',
                  type: 'curator',
                  elements: _this24.taskInfo.curators,
                  resolve: resolve,
                  action: act,
                  toFinalUrl: _this24.taskInfo.toFinalUrl
                })
              }))
            }

            if (_this24.conf[act][act === 'fuck' ? 'followPublisher' : 'unfollowPublisher'] && _this24.taskInfo.publishers.length > 0) {
              _pro4.push(new Promise(function (resolve) {
                fuc.toggleActions({
                  website: 'giveawaysu',
                  type: 'publisher',
                  elements: _this24.taskInfo.publishers,
                  resolve: resolve,
                  action: act,
                  toFinalUrl: _this24.taskInfo.toFinalUrl
                })
              }))
            }

            if (_this24.conf[act][act === 'fuck' ? 'followDeveloper' : 'unfollowDeveloper'] && _this24.taskInfo.developers.length > 0) {
              _pro4.push(new Promise(function (resolve) {
                fuc.toggleActions({
                  website: 'giveawaysu',
                  type: 'developer',
                  elements: _this24.taskInfo.developers,
                  resolve: resolve,
                  action: act,
                  toFinalUrl: _this24.taskInfo.toFinalUrl
                })
              }))
            }

            if (_this24.conf[act][act === 'fuck' ? 'followFranchise' : 'unfollowFranchise'] && _this24.taskInfo.franchises.length > 0) {
              _pro4.push(new Promise(function (resolve) {
                fuc.toggleActions({
                  website: 'giveawaysu',
                  type: 'franchise',
                  elements: _this24.taskInfo.franchises,
                  resolve: resolve,
                  action: act,
                  toFinalUrl: _this24.taskInfo.toFinalUrl
                })
              }))
            }

            if (_this24.conf[act][act === 'fuck' ? 'followGame' : 'unfollowGame'] && _this24.taskInfo.fGames.length > 0) {
              _pro4.push(new Promise(function (resolve) {
                fuc.toggleActions({
                  website: 'giveawaysu',
                  type: 'game',
                  elements: _this24.taskInfo.fGames,
                  resolve: resolve,
                  action: act,
                  toFinalUrl: _this24.taskInfo.toFinalUrl
                })
              }))
            }

            if (_this24.conf[act][act === 'fuck' ? 'addToWishlist' : 'removeFromWishlist'] && _this24.taskInfo.wGames.length > 0) {
              _pro4.push(new Promise(function (resolve) {
                fuc.toggleActions({
                  website: 'giveawaysu',
                  type: 'wishlist',
                  elements: _this24.taskInfo.wGames,
                  resolve: resolve,
                  action: act,
                  toFinalUrl: _this24.taskInfo.toFinalUrl
                })
              }))
            }

            if (act === 'fuck' && _this24.conf.fuck.likeAnnouncement && _this24.taskInfo.announcements.length > 0) {
              _pro4.push(new Promise(function (resolve) {
                fuc.toggleActions({
                  website: 'giveawaysu',
                  type: 'announcement',
                  elements: _this24.taskInfo.announcements,
                  resolve: resolve,
                  action: act,
                  toFinalUrl: _this24.taskInfo.toFinalUrl
                })
              }))
            }

            Promise.all(_pro4).finally(function () {
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
      checkLeft: function checkLeft () {
        if ($('.giveaway-ended').length > 0) {
          Swal.fire({
            icon: 'warning',
            title: getI18n('notice'),
            text: getI18n('noKeysLeft'),
            confirmButtonText: getI18n('confirm'),
            cancelButtonText: getI18n('cancel'),
            showCancelButton: true
          }).then(function (result) {
            if (result.value) {
              window.close()
            }
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
        franchises: [],
        // 任务需要关注的系列
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
        verify: {
          show: false
        }
      },
      conf: (config === null || config === void 0 ? void 0 : (_config$giveawaysu = config.giveawaysu) === null || _config$giveawaysu === void 0 ? void 0 : _config$giveawaysu.enable) ? config.giveawaysu : globalConf
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
          var _ref29 = [[], [], [], [], [], [], []]
          this.twitters = _ref29[0]
          this.facebooks = _ref29[1]
          this.youtubes = _ref29[2]
          this.discords = _ref29[3]
          this.others = _ref29[4]
          this.groups = _ref29[5]
          this.links = _ref29[6]
          var _ref30 = [fuc.echoLog({
            type: 'custom',
            text: '<li>'.concat(getI18n('getTasksInfo'), '<font></font></li>')
          }), $('div.entry-content .entry-method')]
          var status = _ref30[0]
          var tasksContainer = _ref30[1]

          var _iterator11 = _createForOfIteratorHelper(tasksContainer)
          var _step11

          try {
            for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
              var task = _step11.value

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
            _iterator11.e(err)
          } finally {
            _iterator11.f()
          }

          var _ref31 = [fuc.unique(this.groups), fuc.unique(this.twitters), fuc.unique(this.facebooks), fuc.unique(this.youtubes), fuc.unique(this.discords), fuc.unique(this.others), fuc.unique(this.taskInfo.groups)]
          this.groups = _ref31[0]
          this.twitters = _ref31[1]
          this.facebooks = _ref31[2]
          this.youtubes = _ref31[3]
          this.discords = _ref31[4]
          this.others = _ref31[5]
          this.taskInfo.groups = _ref31[6]
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
        var _this25 = this

        this.updateSteamInfo(function () {
          var _ref32 = [[], fuc.unique(_this25.twitters), fuc.unique(_this25.discords), fuc.unique(_this25.facebooks), fuc.unique(_this25.youtubes), fuc.unique(_this25.others), fuc.unique(_this25.links)]
          var pro = _ref32[0]
          var twitters = _ref32[1]
          var discords = _ref32[2]
          var facebooks = _ref32[3]
          var youtubes = _ref32[4]
          var others = _ref32[5]
          var links = _ref32[6]
          var socals = [].concat(_toConsumableArray(discords), _toConsumableArray(facebooks), _toConsumableArray(youtubes))

          if (_this25.conf.fuck.joinSteamGroup && _this25.groups.length > 0) {
            pro.push(new Promise(function (resolve) {
              fuc.toggleActions({
                website: 'gleam',
                type: 'group',
                elements: _this25.groups,
                resolve: resolve,
                action: 'fuck'
              })
            }))
          }

          if (globalConf.other.autoOpen) {
            if (twitters.length > 0) {
              var _iterator12 = _createForOfIteratorHelper(twitters)
              var _step12

              try {
                for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
                  var twitter = _step12.value
                  var title = $(twitter).find('.entry-method-title').text().trim()
                  var _ref33 = [fuc.echoLog({
                    type: 'custom',
                    text: '<li>'.concat(getI18n('doing'), ':').concat(title, '...<font></font></li>')
                  }), $(twitter).find('a.twitter-button:contains(Follow)').attr('href'), $(twitter).find('a.twitter-button:contains(Retweet)').attr('href')]
                  var status = _ref33[0]
                  var followButton = _ref33[1]
                  var retweetButton = _ref33[2]
                  var button = followButton || retweetButton

                  if (button) {
                    window.open(button, '_blank')
                    status.warning(getI18n('openPage'))
                  } else {
                    status.error(getI18n('getTaskUrlFailed'))
                  }
                }
              } catch (err) {
                _iterator12.e(err)
              } finally {
                _iterator12.f()
              }
            }

            if (socals.length > 0) {
              var _iterator13 = _createForOfIteratorHelper(socals)
              var _step13

              try {
                for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
                  var task = _step13.value

                  var _title2 = $(task).find('.entry-method-title').text().trim()

                  var _ref34 = [fuc.echoLog({
                    type: 'custom',
                    text: '<li>'.concat(getI18n('doing'), ':').concat(_title2, '...<font></font></li>')
                  }), $(task).find('a.btn-info:first').attr('href')]
                  var _status = _ref34[0]
                  var _button = _ref34[1]

                  if (_button) {
                    window.open(_button, '_blank')

                    _status.warning(getI18n('openPage'))
                  } else {
                    _status.error(getI18n('getTaskUrlFailed'))
                  }
                }
              } catch (err) {
                _iterator13.e(err)
              } finally {
                _iterator13.f()
              }
            }
          }

          if ((globalConf.other.autoOpen || _this25.conf.fuck.visit) && links.length > 0) {
            pro.push(new Promise(function (resolve) {
              _this25.visit_link(links, 0, resolve)
            }))
          }

          var _iterator14 = _createForOfIteratorHelper(others)
          var _step14

          try {
            for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
              var other = _step14.value
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
            _iterator14.e(err)
          } finally {
            _iterator14.f()
          }

          Promise.all(pro).finally(function () {
            fuc.echoLog({
              type: 'custom',
              text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
            })
            if (_this25.conf.fuck.verifyTask) _this25.verify(0)
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
        var _this26 = this

        var remove = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false
        var pro = []

        if (remove) {
          this.updateSteamInfo(function () {
            if (_this26.conf.remove.leaveSteamGroup && _this26.taskInfo.groups.length > 0) {
              pro.push(new Promise(function (resolve) {
                fuc.toggleActions({
                  website: 'gleam',
                  type: 'group',
                  elements: _this26.taskInfo.groups,
                  resolve: resolve,
                  action: 'remove'
                })
              }))
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
          var _ref35 = [fuc.echoLog({
            type: 'custom',
            text: '<li>'.concat(getI18n('doing'), ':').concat(title, '...<font></font></li>')
          }), $(links[i]).find('.form-actions.center span:contains(Visit):contains(seconds)').text()]
          var status = _ref35[0]
          var taskTime = _ref35[1]

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
        var _this27 = this

        new Promise(function (resolve) {
          if (_this27.taskInfo.groups.length > 0) {
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
      checkLeft: function checkLeft () {
        if ($('.massive-message:contains(ended)').is(':visible')) {
          Swal.fire({
            icon: 'warning',
            title: getI18n('notice'),
            text: getI18n('noKeysLeft'),
            confirmButtonText: getI18n('confirm'),
            cancelButtonText: getI18n('cancel'),
            showCancelButton: true
          }).then(function (result) {
            if (result.value) {
              window.close()
            }
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
      setting: {},
      conf: (config === null || config === void 0 ? void 0 : (_config$gleam = config.gleam) === null || _config$gleam === void 0 ? void 0 : _config$gleam.enable) ? config.gleam : globalConf
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
          var _ref36 = [fuc.echoLog({
            type: 'custom',
            text: '<li>'.concat(getI18n('joinGiveaway'), '<font></font></li>')
          }), this.do_task]
          var status = _ref36[0]
          var doTask = _ref36[1]
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
                var _response$response11

                if ((_response$response11 = response.response) === null || _response$response11 === void 0 ? void 0 : _response$response11.success) {
                  var _response$response12, _response$response13

                  currentoption.addClass('buttonentered').text('Success - Giveaway joined')
                  $('#giveawaysjoined').slideDown()
                  $('#giveawaysrecommend').slideDown()
                  status.success('Success' + (((_response$response12 = response.response) === null || _response$response12 === void 0 ? void 0 : _response$response12.text) ? ':' + ((_response$response13 = response.response) === null || _response$response13 === void 0 ? void 0 : _response$response13.text) : ''))
                  doTask()
                } else {
                  var _response$response14, _response$response15

                  status.error('Error' + (((_response$response14 = response.response) === null || _response$response14 === void 0 ? void 0 : _response$response14.text) ? ':' + ((_response$response15 = response.response) === null || _response$response15 === void 0 ? void 0 : _response$response15.text) : ''))
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
            return [e.innerHTML.match(/"\/[\d]+"/gim)[0].match(/[\d]+/)[0], e.innerHTML.match(/"\/newsletter\/ajax\/subscribeprofile\/optin\/[\d]+"/gim)[0].match(/[\d]+/)[0]]
          }
        })

        if (id.length === 2) {
          var _ref37 = [$('#giveawaysjoined a[class*=promo]'), []]
          var tasks = _ref37[0]
          var _pro5 = _ref37[1]

          var _iterator15 = _createForOfIteratorHelper(tasks)
          var _step15

          try {
            var _loop8 = function _loop8 () {
              var task = _step15.value
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

            for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
              _loop8()
            }
          } catch (err) {
            _iterator15.e(err)
          } finally {
            _iterator15.f()
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
        verify: {
          show: false
        },
        remove: {
          show: false
        }
      },
      conf: (config === null || config === void 0 ? void 0 : (_config$indiedb = config.indiedb) === null || _config$indiedb === void 0 ? void 0 : _config$indiedb.enable) ? config.indiedb : globalConf
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
          var _ref38 = [[], [], [], []]
          this.tasks = _ref38[0]
          this.groups = _ref38[1]
          this.curators = _ref38[2]
          this.links = _ref38[3]
          var _ref39 = [fuc.echoLog({
            type: 'custom',
            text: '<li>'.concat(getI18n('getTasksInfo'), '<font></font></li>')
          }), $('.container_task')]
          var status = _ref39[0]
          var tasksContainer = _ref39[1]

          var _iterator16 = _createForOfIteratorHelper(tasksContainer)
          var _step16

          try {
            for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
              var task = _step16.value
              // 遍历任务信息
              var _ref41 = [$(task).find('.card-body p.card-text.monospace'), $(task).find('button[id^=task_]:not(:contains(VERIFIED))')]
              var taskDes = _ref41[0]
              var verifyBtn = _ref41[1]

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
                var ids = verifyBtn.attr('id').split('_')
                var _ref42 = [ids[1], ids[2], ids[3]]
                var provider = _ref42[0]
                var taskRoute = _ref42[1]
                var taskId = _ref42[2]
                this.tasks.push({
                  provider: provider,
                  taskRoute: taskRoute,
                  taskId: taskId,
                  taskDes: taskDes.html()
                })
              }
            }
          } catch (err) {
            _iterator16.e(err)
          } finally {
            _iterator16.f()
          }

          var _ref40 = [fuc.unique(this.groups), fuc.unique(this.curators), fuc.unique(this.links), fuc.unique(this.taskInfo.groups), fuc.unique(this.taskInfo.curators), fuc.unique(this.tasks)]
          this.groups = _ref40[0]
          this.curators = _ref40[1]
          this.links = _ref40[2]
          this.taskInfo.groups = _ref40[3]
          this.taskInfo.curators = _ref40[4]
          this.tasks = _ref40[5]
          GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
          status.success()
          if (debug) console.log(this)

          if (callback === 'do_task') {
            if (this.tasks.length === 0) {
              fuc.echoLog({
                type: 'custom',
                text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
              })
              if (this.conf.fuck.verifyTask) this.verify()
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
        var _this28 = this

        this.updateSteamInfo(/* #__PURE__ */_asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee7 () {
          var _ref44, pro, links, _iterator17, _step17, _loop9

          return regeneratorRuntime.wrap(function _callee7$ (_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  _ref44 = [[], fuc.unique(_this28.links)], pro = _ref44[0], links = _ref44[1]
                  _context9.next = 3
                  return _this28.toggleActions('fuck', pro)

                case 3:
                  if (_this28.conf.fuck.visitLink) {
                    _iterator17 = _createForOfIteratorHelper(links)

                    try {
                      _loop9 = function _loop9 () {
                        var link = _step17.value
                        pro.push(new Promise(function (resolve) {
                          fuc.visitLink(resolve, link.pageUrl, {
                            url: '/ajax/verifyTasks/webpage/clickedLink',
                            method: 'POST',
                            headers: {
                              'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                              'x-csrf-token': $('meta[name="csrf-token"]').attr('content')
                            },
                            data: $.param({
                              giveaway_slug: _this28.get_giveawayId(),
                              giveaway_task_id: link.taskId
                            })
                          })
                        }))
                      }

                      for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
                        _loop9()
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
                    if (_this28.conf.fuck.verifyTask) _this28.verify()
                  })

                case 5:
                case 'end':
                  return _context9.stop()
              }
            }
          }, _callee7)
        })))
      },
      verify: function verify () {
        var _this29 = this

        var verify = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false

        if (verify) {
          var _pro6 = []

          var _iterator18 = _createForOfIteratorHelper(fuc.unique(this.tasks))
          var _step18

          try {
            var _loop10 = function _loop10 () {
              var task = _step18.value
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
                    giveaway_slug: _this29.get_giveawayId(),
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

                        if (globalConf.other.autoOpen) {
                          if (/Visit[\w\W]*?this[\w\W]*?webpage/gim.test(task.taskDes)) {
                            $('task_webpage_clickedLink_'.concat(task.taskId)).click()
                          } else {
                            window.open($('<div>'.concat(task.taskDes, '</div>')).find('a').attr('href'), '_blank')
                          }
                        }

                        resolve({
                          result: 'error',
                          statusText: response.statusText,
                          status: response.status
                        })
                      }
                    } else {
                      status.error('Error:' + (response.response.message || response.statusText || response.status))

                      if (globalConf.other.autoOpen) {
                        if (/Visit[\w\W]*?this[\w\W]*?webpage/gim.test(task.taskDes)) {
                          $('task_webpage_clickedLink_'.concat(task.taskId)).click()
                        } else {
                          window.open($('<div>'.concat(task.taskDes, '</div>')).find('a').attr('href'), '_blank')
                        }
                      }

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

            for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
              _loop10()
            }
          } catch (err) {
            _iterator18.e(err)
          } finally {
            _iterator18.f()
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
        var _this30 = this

        var remove = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false
        var pro = []

        if (remove) {
          this.updateSteamInfo(/* #__PURE__ */_asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee8 () {
            return regeneratorRuntime.wrap(function _callee8$ (_context10) {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                    _context10.next = 2
                    return _this30.toggleActions('remove', pro)

                  case 2:
                    Promise.all(pro).finally(function () {
                      fuc.echoLog({
                        type: 'custom',
                        text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                      })
                    })

                  case 3:
                  case 'end':
                    return _context10.stop()
                }
              }
            }, _callee8)
          })))
        } else {
          this.get_tasks('remove')
        }
      },
      toggleActions: function toggleActions (action, pro) {
        var _ref46 = action === 'fuck' ? [this.groups, this.curators] : [this.taskInfo.groups, this.taskInfo.curators]
        var _ref47 = _slicedToArray(_ref46, 2)
        var groups = _ref47[0]
        var curators = _ref47[1]

        if (this.conf[action][action === 'fuck' ? 'joinSteamGroup' : 'leaveSteamGroup'] && groups.length > 0) {
          pro.push(new Promise(function (resolve) {
            fuc.toggleActions({
              website: 'marvelousga',
              type: 'group',
              elements: groups,
              resolve: resolve,
              action: action
            })
          }))
        }

        if (this.conf[action][action === 'fuck' ? 'followCurator' : 'unfollowCurator'] && curators.length > 0) {
          pro.push(new Promise(function (resolve) {
            fuc.toggleActions({
              website: 'marvelousga',
              type: 'curator',
              elements: curators,
              resolve: resolve,
              action: action
            })
          }))
        }
      },
      get_giveawayId: function get_giveawayId () {
        return $('#giveawaySlug').val() || window.location.href
      },
      updateSteamInfo: function updateSteamInfo (callback) {
        var _this31 = this

        new Promise(function (resolve) {
          if (_this31.taskInfo.groups.length > 0) {
            if (_this31.taskInfo.curators.length > 0) {
              fuc.updateSteamInfo(resolve, 'all')
            } else {
              fuc.updateSteamInfo(resolve, 'community')
            }
          } else if (_this31.taskInfo.curators.length > 0) {
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
      checkLeft: function checkLeft () {
        if ($('h3.text-danger:contains(this giveaway is closed)').length > 0) {
          $('#link_to_click').remove()
          Swal.fire({
            icon: 'warning',
            title: getI18n('notice'),
            text: getI18n('noKeysLeft'),
            confirmButtonText: getI18n('confirm'),
            cancelButtonText: getI18n('cancel'),
            showCancelButton: true
          }).then(function (result) {
            if (result.value) {
              window.close()
            }
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
      setting: {},
      conf: (config === null || config === void 0 ? void 0 : (_config$marvelousga = config.marvelousga) === null || _config$marvelousga === void 0 ? void 0 : _config$marvelousga.enable) ? config.marvelousga : globalConf
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
        var _this32 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee10 () {
          var type, _ref48, items, maxPoint, myPoint, i, item, needPoints

          return regeneratorRuntime.wrap(function _callee10$ (_context12) {
            while (1) {
              switch (_context12.prev = _context12.next) {
                case 0:
                  type = _arguments2.length > 0 && _arguments2[0] !== undefined ? _arguments2[0] : 'FREE'
                  _ref48 = [$(".giveaways-page-item:contains('".concat(type, "'):not(:contains('ENTERED'))")), _this32.maxPoint()], items = _ref48[0], maxPoint = _ref48[1]
                  myPoint = _this32.myPoints
                  i = 0

                case 4:
                  if (!(i < items.length)) {
                    _context12.next = 20
                    break
                  }

                  item = items[i]
                  needPoints = $(item).find('.giveaways-page-item-header-points').text().match(/[\d]+/gim)

                  if (!(type === 'points' && needPoints && parseInt(needPoints[0]) > myPoint)) {
                    _context12.next = 11
                    break
                  }

                  fuc.echoLog({
                    type: 'custom',
                    text: '<li><font class="warning">'.concat(getI18n('noPoints'), '</font></li>')
                  })
                  _context12.next = 17
                  break

                case 11:
                  if (!(type === 'points' && !needPoints)) {
                    _context12.next = 15
                    break
                  }

                  fuc.echoLog({
                    type: 'custom',
                    text: '<li><font class="warning">'.concat(getI18n('getNeedPointsFailed'), '</font></li>')
                  })
                  _context12.next = 17
                  break

                case 15:
                  if (type === 'points' && parseInt(needPoints[0]) > maxPoint) {
                    _context12.next = 17
                    break
                  }

                  return _context12.delegateYield(/* #__PURE__ */regeneratorRuntime.mark(function _callee9 () {
                    var _ref49, status, a, giveawayId

                    return regeneratorRuntime.wrap(function _callee9$ (_context11) {
                      while (1) {
                        switch (_context11.prev = _context11.next) {
                          case 0:
                            _ref49 = [fuc.echoLog({
                              type: 'custom',
                              text: '<li>'.concat(getI18n('joinLottery'), '<a href="').concat($(item).find('a.giveaways-page-item-img-btn-more').attr('href'), '" target="_blank">').concat($(item).find('.giveaways-page-item-footer-name').text().trim(), '</a>...<font></font></li>')
                            }), $(item).find("a.giveaways-page-item-img-btn-enter:contains('enter')")], status = _ref49[0], a = _ref49[1]

                            if (a.attr('onclick') && a.attr('onclick').includes('checkUser')) {
                              giveawayId = a.attr('onclick').match(/[\d]+/)
                              if (giveawayId) checkUser(giveawayId[0])
                            }

                            _context11.next = 4
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
                                      myPoint = parseInt(points[1])
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

                          case 4:
                          case 'end':
                            return _context11.stop()
                        }
                      }
                    }, _callee9)
                  })(), 't0', 17)

                case 17:
                  i++
                  _context12.next = 4
                  break

                case 20:
                  fuc.echoLog({
                    type: 'custom',
                    text: '<li>-----END-----</li>'
                  })

                case 21:
                case 'end':
                  return _context12.stop()
              }
            }
          }, _callee10)
        }))()
      },
      verify: function verify () {
        var myPoints = $('.page-header__nav-func-user-nav-items.points-items').text().match(/[\d]+/gim)

        if (myPoints) {
          this.myPoints = Number(myPoints[0])
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
        fuck: {
          show: true,
          text: 'Free',
          title: getI18n('joinFreeLottery')
        },
        verify: {
          show: true,
          text: 'Point',
          title: getI18n('joinPointLottery')
        },
        remove: {
          show: false
        }
      },
      conf: (config === null || config === void 0 ? void 0 : (_config$opiumpulses = config.opiumpulses) === null || _config$opiumpulses === void 0 ? void 0 : _config$opiumpulses.enable) ? config.opiumpulses : globalConf,
      maxPoint: function maxPoint () {
        var _this$conf, _this$conf$other

        return ((_this$conf = this.conf) === null || _this$conf === void 0 ? void 0 : (_this$conf$other = _this$conf.other) === null || _this$conf$other === void 0 ? void 0 : _this$conf$other.limitPoint) ? Number(this.conf.other.limitPoint) : Infinity
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
        var _this33 = this

        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'do_task'
        var _ref50 = [fuc.echoLog({
          type: 'custom',
          text: '<li>'.concat(getI18n('getTasksInfo'), '<font></font></li>')
        }), $('#steps tbody tr')]
        var status = _ref50[0]
        var steps = _ref50[1]

        for (var i = 0; i < steps.length; i++) {
          if (steps.eq(i).find('span:contains(Success)').length === 0) checkClick(i)
        }

        if (callback === 'do_task') {
          var _ref51 = [[], []]
          this.groups = _ref51[0]
          this.curators = _ref51[1]
          var _ref52 = [GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']'), []]
          var taskInfoHistory = _ref52[0]
          var _pro7 = _ref52[1]
          if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory

          var _iterator19 = _createForOfIteratorHelper(steps)
          var _step19

          try {
            for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
              var step = _step19.value

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
                            _this33.groups.push(_groupName2[1])

                            _this33.taskInfo.groups.push(_groupName2[1])
                          }
                        }

                        r(1)
                      }).catch(function () {
                        r(1)
                      })
                    }))
                  })()
                }
              }
            }
          } catch (err) {
            _iterator19.e(err)
          } finally {
            _iterator19.f()
          }

          if (_pro7.length > 0) {
            Promise.all(_pro7).finally(function () {
              var _ref53 = [fuc.unique(_this33.groups), fuc.unique(_this33.curators), fuc.unique(_this33.taskInfo.groups), fuc.unique(_this33.taskInfo.curators)]
              _this33.groups = _ref53[0]
              _this33.curators = _ref53[1]
              _this33.taskInfo.groups = _ref53[2]
              _this33.taskInfo.curators = _ref53[3]
              GM_setValue('taskInfo[' + window.location.host + _this33.get_giveawayId() + ']', _this33.taskInfo)

              if (_this33.groups.length > 0 || _this33.curators.length > 0) {
                _this33.do_task()
              } else {
                fuc.echoLog({
                  type: 'custom',
                  text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                })
                if (_this33.conf.fuck.verifyTask) _this33.verify()
              }
            })
          } else {
            var _ref54 = [fuc.unique(this.groups), fuc.unique(this.curators), fuc.unique(this.taskInfo.groups), fuc.unique(this.taskInfo.curators)]
            this.groups = _ref54[0]
            this.curators = _ref54[1]
            this.taskInfo.groups = _ref54[2]
            this.taskInfo.curators = _ref54[3]
            GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)

            if (this.groups.length > 0 || this.curators.length > 0) {
              this.do_task()
            } else {
              fuc.echoLog({
                type: 'custom',
                text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
              })
              if (this.conf.fuck.verifyTask) this.verify()
            }
          }
        } else if (callback === 'verify') {
          this.tasks = []
          var checks = $('#steps tbody a[id^=check]')

          if (checks.length > 0) {
            var _iterator20 = _createForOfIteratorHelper(checks)
            var _step20

            try {
              for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {
                var check = _step20.value
                var id = $(check).attr('id').match(/[\d]+/)
                if (id) {
                  this.tasks.push({
                    id: id[0],
                    taskDes: $(check).parent().prev().html().trim()
                  })
                }
              }
            } catch (err) {
              _iterator20.e(err)
            } finally {
              _iterator20.f()
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

            var _iterator21 = _createForOfIteratorHelper(steps)
            var _step21

            try {
              for (_iterator21.s(); !(_step21 = _iterator21.n()).done;) {
                var _step22 = _step21.value

                if ($(_step22).find("a[href*='store.steampowered.com/curator/']").length > 0) {
                  var _link2 = $(_step22).find("a[href*='store.steampowered.com/curator/']").attr('href')

                  var _curatorId = _link2.match(/curator\/([\d]+)/)

                  if (_curatorId) this.taskInfo.curators.push(_curatorId[1])
                } else if ($(_step22).find("a[href*='steampowered.com/groups/']").length > 0) {
                  var _link3 = $(_step22).find("a[href*='steampowered.com/groups/']").attr('href')

                  var _groupName3 = _link3.match(/groups\/(.+)\/?/)

                  if (_groupName3) this.taskInfo.groups.push(_groupName3[1])
                } else if ($(_step22).find("a[href*='steamcommunity.com/gid']").length > 0) {
                  (function () {
                    var link = $(_step22).find("a[href*='steamcommunity.com/gid']").attr('href')

                    _pro8.push(new Promise(function (r) {
                      new Promise(function (resolve) {
                        fuc.getFinalUrl(resolve, link)
                      }).then(function (data) {
                        if (data.result === 'success') {
                          var _groupName4 = data.finalUrl.match(/groups\/(.+)\/?/)

                          if (_groupName4) {
                            _this33.taskInfo.groups.push(_groupName4[1])
                          }
                        }

                        r(1)
                      })
                    }))
                  })()
                }
              }
            } catch (err) {
              _iterator21.e(err)
            } finally {
              _iterator21.f()
            }

            if (_pro8.length > 0) {
              Promise.all(_pro8).finally(function () {
                var _ref55 = [fuc.unique(_this33.taskInfo.groups), fuc.unique(_this33.taskInfo.curators)]
                _this33.taskInfo.groups = _ref55[0]
                _this33.taskInfo.curators = _ref55[1]
                GM_setValue('taskInfo[' + window.location.host + _this33.get_giveawayId() + ']', _this33.taskInfo)

                if (_this33.taskInfo.groups.length > 0 || _this33.taskInfo.curators.length > 0) {
                  _this33.remove(true)
                } else {
                  fuc.echoLog({
                    type: 'custom',
                    text: '<li><font class="success">'.concat(getI18n('cannotRemove'), '</font></li>')
                  })
                }
              })
            } else {
              var _ref56 = [fuc.unique(this.taskInfo.groups), fuc.unique(this.taskInfo.curators)]
              this.taskInfo.groups = _ref56[0]
              this.taskInfo.curators = _ref56[1]
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
        var _this34 = this

        this.updateSteamInfo(/* #__PURE__ */_asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee11 () {
          var pro
          return regeneratorRuntime.wrap(function _callee11$ (_context13) {
            while (1) {
              switch (_context13.prev = _context13.next) {
                case 0:
                  pro = []
                  _context13.next = 3
                  return _this34.toggleActions('fuck', pro)

                case 3:
                  Promise.all(pro).finally(function () {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                    })
                    if (_this34.conf.fuck.verifyTask) _this34.verify()
                  })

                case 4:
                case 'end':
                  return _context13.stop()
              }
            }
          }, _callee11)
        })))
      },
      verify: function verify () {
        var _this35 = this

        var verify = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false

        if (verify) {
          var _pro9 = []

          var _iterator22 = _createForOfIteratorHelper(fuc.unique(this.tasks))
          var _step23

          try {
            var _loop11 = function _loop11 () {
              var task = _step23.value
              var status = fuc.echoLog({
                type: 'custom',
                text: '<li>'.concat(getI18n('verifyingTask')).concat(task.taskDes, '...<font></font></li>')
              })

              _pro9.push(new Promise(function (resolve) {
                _this35.checkStep(task.id, resolve, status)
              }))
            }

            for (_iterator22.s(); !(_step23 = _iterator22.n()).done;) {
              _loop11()
            }
          } catch (err) {
            _iterator22.e(err)
          } finally {
            _iterator22.f()
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
        var _this36 = this

        var remove = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false
        var pro = []

        if (remove) {
          this.updateSteamInfo(/* #__PURE__ */_asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee12 () {
            return regeneratorRuntime.wrap(function _callee12$ (_context14) {
              while (1) {
                switch (_context14.prev = _context14.next) {
                  case 0:
                    _context14.next = 2
                    return _this36.toggleActions('remove', pro)

                  case 2:
                    Promise.all(pro).finally(function () {
                      fuc.echoLog({
                        type: 'custom',
                        text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                      })
                    })

                  case 3:
                  case 'end':
                    return _context14.stop()
                }
              }
            }, _callee12)
          })))
        } else {
          this.get_tasks('remove')
        }
      },
      toggleActions: function toggleActions (action, pro) {
        var groups = action === 'fuck' ? this.groups : this.taskInfo.groups
        var curators = action === 'fuck' ? this.curators : this.taskInfo.curators

        if (this.conf[action][action === 'fuck' ? 'joinSteamGroup' : 'leaveSteamGroup'] && groups.length > 0) {
          pro.push(new Promise(function (resolve) {
            fuc.toggleActions({
              website: 'prys',
              type: 'group',
              elements: groups,
              resolve: resolve,
              action: action
            })
          }))
        }

        if (this.conf[action][action === 'fuck' ? 'followCurator' : 'unfollowCurator'] && curators.length > 0) {
          pro.push(new Promise(function (resolve) {
            fuc.toggleActions({
              website: 'prys',
              type: 'curator',
              elements: curators,
              resolve: resolve,
              action: action
            })
          }))
        }
      },
      get_giveawayId: function get_giveawayId () {
        var id = window.location.search.match(/id=([\d]+)/)
        return (id === null || id === void 0 ? void 0 : id[1]) || window.location.href
      },
      updateSteamInfo: function updateSteamInfo (callback) {
        var _this37 = this

        new Promise(function (resolve) {
          if (_this37.taskInfo.groups.length > 0) {
            if (_this37.taskInfo.curators.length > 0) {
              fuc.updateSteamInfo(resolve, 'all')
            } else {
              fuc.updateSteamInfo(resolve, 'community')
            }
          } else if (_this37.taskInfo.curators.length > 0) {
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
      checkLeft: function checkLeft () {
        var left = $('#header').text().match(/([\d]+).*?prize.*?left/)

        if (!(left.length > 0 && left[1] !== '0')) {
          Swal.fire({
            icon: 'warning',
            title: getI18n('notice'),
            text: getI18n('noKeysLeft'),
            confirmButtonText: getI18n('confirm'),
            cancelButtonText: getI18n('cancel'),
            showCancelButton: true
          }).then(function (result) {
            if (result.value) {
              window.close()
            }
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
      setting: {},
      conf: (config === null || config === void 0 ? void 0 : (_config$prys = config.prys) === null || _config$prys === void 0 ? void 0 : _config$prys.enable) ? config.prys : globalConf
    }
    var takekey = {
      test: function test () {
        return window.location.host.includes('takekey')
      },
      fuck: function fuck () {
        this.get_tasks('do_task')
      },
      get_tasks: function get_tasks () {
        var _this38 = this

        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'do_task'
        var taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
        if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory

        if (callback === 'remove' && taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
          this.remove(true)
        } else {
          var _ref59 = [[], [], [], []]
          this.tasks = _ref59[0]
          this.groups = _ref59[1]
          this.curators = _ref59[2]
          this.links = _ref59[3]
          var _ref60 = [[], fuc.echoLog({
            type: 'custom',
            text: '<li>'.concat(getI18n('getTasksInfo'), '<font></font></li>')
          }), $('#usl>div')]
          var _pro10 = _ref60[0]
          var status = _ref60[1]
          var tasksContainer = _ref60[2]

          var _iterator23 = _createForOfIteratorHelper(tasksContainer)
          var _step24

          try {
            var _loop12 = function _loop12 () {
              var task = _step24.value

              // 遍历任务信息
              _this38.tasks.push(task)

              var _ref62 = [$(task).find('i'), $(task).children('a[id]').attr('href'), $(task).children('a[id]').attr('id')]
              var icon = _ref62[0]
              var link = _ref62[1]
              var id = _ref62[2]

              if (icon.hasClass('fa-steam')) {
                if (link && /gid\/[\d]+/.test(link)) {
                  _pro10.push(new Promise(function (r) {
                    new Promise(function (resolve) {
                      fuc.getFinalUrl(resolve, link)
                    }).then(function (data) {
                      if (data.result === 'success') {
                        var groupName = data.finalUrl.match(/steamcommunity.com\/groups\/([\w\d\-_]*)/)[1]

                        if (groupName) {
                          _this38.groups.push(groupName)

                          _this38.taskInfo.groups.push(groupName)

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
                _this38.links.push(id)
              } else if (icon.hasClass('fa-vk')) {
                _this38.vks.push(link)
              } else {
                _this38.others.push(icon)
              }
            }

            for (_iterator23.s(); !(_step24 = _iterator23.n()).done;) {
              _loop12()
            }
          } catch (err) {
            _iterator23.e(err)
          } finally {
            _iterator23.f()
          }

          Promise.all(_pro10).finally(function () {
            var _ref61 = [fuc.unique(_this38.groups), fuc.unique(_this38.curators), fuc.unique(_this38.links), fuc.unique(_this38.others), fuc.unique(_this38.taskInfo.groups), fuc.unique(_this38.taskInfo.curators), fuc.unique(_this38.tasks)]
            _this38.groups = _ref61[0]
            _this38.curators = _ref61[1]
            _this38.links = _ref61[2]
            _this38.others = _ref61[3]
            _this38.taskInfo.groups = _ref61[4]
            _this38.taskInfo.curators = _ref61[5]
            _this38.tasks = _ref61[6]
            GM_setValue('taskInfo[' + window.location.host + _this38.get_giveawayId() + ']', _this38.taskInfo)
            status.success()
            if (debug) console.log(_this38)

            if (callback === 'do_task') {
              if (_this38.tasks.length === 0) {
                fuc.echoLog({
                  type: 'custom',
                  text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                })
                if (_this38.conf.fuck.verifyTask) _this38.verify()
              } else {
                _this38.do_task()
              }
            } else {
              !fuc.isEmptyObjArr(_this38.taskInfo) ? _this38.remove(true) : fuc.echoLog({
                type: 'custom',
                text: '<li><font class="warning">'.concat(getI18n('cannotRemove'), '</font></li>')
              })
            }
          })
        }
      },
      do_task: function do_task () {
        var _this39 = this

        this.updateSteamInfo(/* #__PURE__ */_asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee13 () {
          var _ref64, pro, links, others, vks, _iterator24, _step25, _loop13, _iterator25, _step26, vk, _iterator26, _step27, other

          return regeneratorRuntime.wrap(function _callee13$ (_context15) {
            while (1) {
              switch (_context15.prev = _context15.next) {
                case 0:
                  _ref64 = [[], fuc.unique(_this39.links), fuc.unique(_this39.others), fuc.unique(_this39.vks)], pro = _ref64[0], links = _ref64[1], others = _ref64[2], vks = _ref64[3]
                  _context15.next = 3
                  return _this39.toggleActions('fuck', pro)

                case 3:
                  if (_this39.conf.fuck.visit) {
                    _iterator24 = _createForOfIteratorHelper(links)

                    try {
                      _loop13 = function _loop13 () {
                        var link = _step25.value
                        var a = $("a[id='".concat(link, "']")).attr('onclick', 'return false;')
                        a[0].click()
                        a.removeAttr('onclick')
                        pro.push(new Promise(function (resolve) {
                          fuc.visitLink(resolve, $("a[id='".concat(link, "']")).attr('href'))
                        }))
                      }

                      for (_iterator24.s(); !(_step25 = _iterator24.n()).done;) {
                        _loop13()
                      }
                    } catch (err) {
                      _iterator24.e(err)
                    } finally {
                      _iterator24.f()
                    }
                  }

                  if (globalConf.other.autoOpen) {
                    _iterator25 = _createForOfIteratorHelper(vks)

                    try {
                      for (_iterator25.s(); !(_step26 = _iterator25.n()).done;) {
                        vk = _step26.value
                        window.open(vk, '_blank')
                      }
                    } catch (err) {
                      _iterator25.e(err)
                    } finally {
                      _iterator25.f()
                    }
                  }

                  _iterator26 = _createForOfIteratorHelper(others)

                  try {
                    for (_iterator26.s(); !(_step27 = _iterator26.n()).done;) {
                      other = _step27.value
                      fuc.echoLog({
                        type: 'custom',
                        text: '<li><font class="warning">'.concat(getI18n('unknowntype'), ':').concat($(other).attr('class'), '</font></li>')
                      })
                    }
                  } catch (err) {
                    _iterator26.e(err)
                  } finally {
                    _iterator26.f()
                  }

                  Promise.all(pro).finally(function () {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                    })
                    if (_this39.conf.fuck.verifyTask) _this39.verify()
                  })

                case 8:
                case 'end':
                  return _context15.stop()
              }
            }
          }, _callee13)
        })))
      },
      verify: function verify () {
        setTimeout(function () {
          $('.fa-check').click()
        }, 1000)
      },
      remove: function remove () {
        var _this40 = this

        var remove = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false
        var pro = []

        if (remove) {
          this.updateSteamInfo(/* #__PURE__ */_asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee14 () {
            return regeneratorRuntime.wrap(function _callee14$ (_context16) {
              while (1) {
                switch (_context16.prev = _context16.next) {
                  case 0:
                    _context16.next = 2
                    return _this40.toggleActions('remove', pro)

                  case 2:
                    Promise.all(pro).finally(function () {
                      fuc.echoLog({
                        type: 'custom',
                        text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                      })
                    })

                  case 3:
                  case 'end':
                    return _context16.stop()
                }
              }
            }, _callee14)
          })))
        } else {
          this.get_tasks('remove')
        }
      },
      toggleActions: function toggleActions (action, pro) {
        var groups = action === 'fuck' ? this.groups : this.taskInfo.groups

        if (this.conf[action][action === 'fuck' ? 'joinSteamGroup' : 'leaveSteamGroup'] && groups.length > 0) {
          pro.push(new Promise(function (resolve) {
            fuc.toggleActions({
              website: 'takekey',
              type: 'group',
              elements: groups,
              resolve: resolve,
              action: action
            })
          }))
        }
      },
      get_giveawayId: function get_giveawayId () {
        var id = window.location.href.match(/distribution\/([\d]+)/)
        return (id === null || id === void 0 ? void 0 : id[1]) || window.location.href
      },
      updateSteamInfo: function updateSteamInfo (callback) {
        var _this41 = this

        new Promise(function (resolve) {
          if (_this41.taskInfo.groups.length > 0) {
            if (_this41.taskInfo.curators.length > 0) {
              fuc.updateSteamInfo(resolve, 'all')
            } else {
              fuc.updateSteamInfo(resolve, 'community')
            }
          } else if (_this41.taskInfo.curators.length > 0) {
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
      checkLeft: function checkLeft () {
        var leftKey = $('span:contains(Осталось ключей),span:contains(Keys Left)').text().match(/[\d]+/)

        if (!(leftKey && parseInt(leftKey[0]) > 0)) {
          Swal.fire({
            icon: 'warning',
            title: getI18n('notice'),
            text: getI18n('noKeysLeft'),
            confirmButtonText: getI18n('confirm'),
            cancelButtonText: getI18n('cancel'),
            showCancelButton: true
          }).then(function (result) {
            if (result.value) {
              window.close()
            }
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
      setting: {},
      conf: (config === null || config === void 0 ? void 0 : (_config$takekey = config.takekey) === null || _config$takekey === void 0 ? void 0 : _config$takekey.enable) ? config.takekey : globalConf
    }
    var plugins = [banana, freegamelottery, gamehag, giveawaysu, gleam, indiedb, marvelousga, opiumpulses, prys, takekey]

    if (window.location.host.includes('hclonely')) {
      if (window.location.pathname.includes('setting')) {
        var _GM_getValue, _GM_getValue$global2, _GM_getValue$global2$

        unsafeWindow.GM_info = GM_info // eslint-disable-line camelcase

        unsafeWindow.GM_setValue = GM_setValue // eslint-disable-line camelcase

        unsafeWindow.language = language
        unsafeWindow.branch = 'V3'
        typeof ((_GM_getValue = GM_getValue('conf')) === null || _GM_getValue === void 0 ? void 0 : (_GM_getValue$global2 = _GM_getValue.global) === null || _GM_getValue$global2 === void 0 ? void 0 : (_GM_getValue$global2$ = _GM_getValue$global2.fuck) === null || _GM_getValue$global2$ === void 0 ? void 0 : _GM_getValue$global2$.joinSteamGroup) !== 'boolean' ? loadSettings(defaultConf) : loadSettings(config)
      } else if (window.location.pathname.includes('announcement')) {
        loadAnnouncement()
      }
    } else if ((window.location.host.includes('marvelousga') || window.location.host.includes('dupedornot') || window.location.host.includes('gamecode.win')) && !window.location.pathname.includes('giveaway')) {
      fuc.newTabBlock()
    } else {
      (function () {
        var _globalConf$other

        var website = {}
        plugins.map(function (e, i) {
          if (e.test()) {
            website = e
            if (website.before) website.before()
          }
        })
        if (globalConf.other.checkLogin && website.checkLogin) website.checkLogin()
        if (globalConf.other.checkLeft && website.checkLeft) website.checkLeft()
        var buttons = ''
        var defaultBtn = {
          fuck: {
            show: true,
            title: getI18n('fuckBtnTitle'),
            text: 'FuckTask'
          },
          verify: {
            show: true,
            title: getI18n('verifyBtnTitle'),
            text: 'Verify'
          },
          remove: {
            show: true,
            title: getI18n('removeBtnTitle'),
            text: 'Remove'
          }
        }
        var showLogs = globalConf === null || globalConf === void 0 ? void 0 : (_globalConf$other = globalConf.other) === null || _globalConf$other === void 0 ? void 0 : _globalConf$other.showLogs
        var websiteSettings = Object.assign(defaultBtn, website.setting)

        for (var _i3 = 0, _Object$entries2 = Object.entries(websiteSettings); _i3 < _Object$entries2.length; _i3++) {
          var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i3], 2)
          var _k2 = _Object$entries2$_i[0]
          var _v = _Object$entries2$_i[1]

          if (_v.show) buttons += '<button id="'.concat(_k2, '" type="button" class="btn btn-primary" title="').concat(_v.title, '">').concat(_v.text, '</button>')
        }

        if (showLogs) buttons += '<button id="toggle-logs" type="button" class="btn btn-primary" title="'.concat(!showLogs ? getI18n('showLog') : getI18n('hideLog'), '">').concat(!showLogs ? 'ShowLogs' : 'HideLogs', '</button>')
        var buttonGroup = '<div class="btn-group-vertical" role="group" aria-label="button">'.concat(buttons, '</div>')
        $('body').append('<div id="fuck-task-btn"><button id="toggle-btn-group" type="button" class="btn btn-outline-primary">&gt;</button>'.concat(buttonGroup, '</div>'))

        var _loop14 = function _loop14 () {
          var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i4], 2)
          var k = _Object$entries3$_i[0]
          var v = _Object$entries3$_i[1]

          if (v.show) {
            $('#' + k).click(function () {
              website[k]()
            })
          }
        }

        for (var _i4 = 0, _Object$entries3 = Object.entries(websiteSettings); _i4 < _Object$entries3.length; _i4++) {
          _loop14()
        }

        $('#toggle-logs').click(fuc.toggleLogs)
        $('#toggle-btn-group').click(function () {
          var btnGroup = $('#fuck-task-btn .btn-group-vertical')

          if (btnGroup.css('width') === '0px') {
            btnGroup.css('width', '')
            $('#toggle-btn-group').attr('title', getI18n('hide')).text('>')
          } else {
            btnGroup.css('width', '0')
            $('#toggle-btn-group').attr('title', getI18n('show')).text('<')
          }
        }) // 快捷键功能

        $(document).keydown(function (e) {
          var hotKey = globalConf.hotKey || {}

          for (var _i5 = 0, _Object$entries4 = Object.entries(hotKey); _i5 < _Object$entries4.length; _i5++) {
            var _Object$entries4$_i = _slicedToArray(_Object$entries4[_i5], 2)
            var _k3 = _Object$entries4$_i[0]
            var _v2 = _Object$entries4$_i[1]

            var keys = _v2.split('+')

            var functionKey = keys.length === 2 ? e[keys[0].toLowerCase().trim() + 'Key'] : true

            if (functionKey && keys[1].toLowerCase().trim() === e.key) {
              switch (_k3) {
                case 'fuckKey':
                  website.fuck()
                  break

                case 'verifyKey':
                  website.verify()
                  break

                case 'removeKey':
                  website.remove()
                  break

                case 'toggleLogKey':
                  fuc.toggleLogs()
                  break
              }
            }
          }
        })
        $('body').append('<div id="fuck-task-info" class="card">\n  <div class="card-body">\n    <h3 class="card-title">'.concat(getI18n('taskLog'), '</h3>\n    <h4 class="card-subtitle">\n      <a id="check-update" href="javascript:void(0)" targrt="_self" class="card-link iconfont icon-update_1" title="').concat(getI18n('checkUpdate'), '"></a>\n      <a id="auto-task-setting" href="javascript:void(0)" data-href="https://auto-task.hclonely.com/setting').concat(language === 'en' ? '_en' : '', '.html" targrt="_self" class="card-link iconfont icon-setting" title="').concat(getI18n('setting'), '"></a>\n      <a id="auto-task-announcement" href="javascript:void(0)" data-href="https://auto-task.hclonely.com/announcement.html" targrt="_blank" class="card-link iconfont icon-announcement" title="').concat(getI18n('visitUpdateText'), '"></a>\n      <a id="clean-cache" href="javascript:void(0)" targrt="_self" class="card-link iconfont icon-clean" title="').concat(getI18n('cleanCache'), '"></a>\n      <a id="auto-task-feedback" href="javascript:void(0)" data-href="https://github.com/HCLonely/auto-task/issues/new/choose" targrt="_blank" class="card-link iconfont icon-feedback" title="').concat(getI18n('feedback'), '"></a>\n    </h4>\n    <div class="card-textarea">\n    </div>\n  </div>\n</div>'))
        $('#clean-cache').click(function () {
          var status = fuc.echoLog({
            type: 'custom',
            text: '<li>'.concat(getI18n('cleaning'), '<font></font></li>')
          })
          var listValues = GM_listValues()

          var _iterator27 = _createForOfIteratorHelper(listValues)
          var _step28

          try {
            for (_iterator27.s(); !(_step28 = _iterator27.n()).done;) {
              var value = _step28.value
              if (value !== 'conf' && value !== 'language') GM_deleteValue(value)
            }
          } catch (err) {
            _iterator27.e(err)
          } finally {
            _iterator27.f()
          }

          status.success()
        })
        $('#check-update').click(function () {
          fuc.checkUpdate(true)
        })
        $('#auto-task-setting,#auto-task-feedback,#auto-task-announcement').click(function () {
          window.open($(this).attr('data-href'), '_blank')
        })
        fuc.checkUpdate() // $('.fuck-task-logs .el-notification__content').show()

        if (!showLogs) {
          var _$$animate

          $('#fuck-task-logs').animate((_$$animate = {
            right: '-100%',
            display: '-webkit-box'
          }, _defineProperty(_$$animate, 'display', '-ms-flexbox'), _defineProperty(_$$animate, 'display', 'flex'), _$$animate), 0)
        }

        if (website.after) website.after()
      })()
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
      Swal.fire({
        title: getI18n('language') + ' : ' + language,
        input: 'select',
        inputOptions: {
          auto: getI18n('auto'),
          'zh-CN': '简体中文',
          en: 'English'
        },
        confirmButtonText: getI18n('confirm'),
        cancelButtonText: getI18n('cancel'),
        showCancelButton: true
      }).then(function (result) {
        if (result.value) {
          GM_setValue('language', result.value)
          language = getLanguage()
        }
      })
    })
  } catch (e) {
    Swal.fire({
      icon: 'error',
      text: getI18n('jsError')
    })
    console.log('%c%s', 'color:white;background:red', e.stack)
  }
})()
