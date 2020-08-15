// ==UserScript==
// @name           自动任务
// @name:en        Auto Task Test
// @namespace      auto-task
// @version        3.0.7
// @description    自动完成赠key站任务
// @description:en Automatically complete giveaway tasks
// @author         HCLonely
// @license        MIT
// @iconURL        https://auto-task-test.hclonely.com/img/favicon.ico
// @homepage       https://blog.hclonely.com/posts/777c60d5/
// @supportURL     https://github.com/HCLonely/auto-task/issues/new/choose
// @updateURL      https://github.com/HCLonely/auto-task/raw/master/auto-task-test.user.js

// @include        *://giveaway.su/giveaway/view/*
// @include        *://marvelousga.com/*
// @include        *://www.grabfreegame.com/giveaway/*
// @include        *://www.bananagiveaway.com/giveaway/*
// @include        /https?:\/\/gamehag.com\/.*?giveaway\/.*/
// @include        *://prys.revadike.com/giveaway/?id=*
// @include        *://www.indiedb.com/giveaways*
// @include        *://www.opiumpulses.com/giveaways
// @include        *://takekey.ru/distribution/*
// @include        *://*freegamelottery.com*
// @include        *://gleam.io/*
// @include        *://discord.com/app
// @include        *://www.twitch.tv/*
// @exclude        *googleads*
// @include        https://auto-task-test.hclonely.com/setting.html

// @require        https://cdn.jsdelivr.net/npm/js-cookie@rc/dist/js.cookie.min.js
// @require        https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @require        https://cdn.jsdelivr.net/npm/components-jqueryui@1.12.1/ui/effect.min.js
// @require        https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js
// @require        https://cdn.jsdelivr.net/gh/HCLonely/auto-task@3.0.7/require/bootstrap.min.js
// @require        https://cdn.jsdelivr.net/npm/regenerator-runtime@0.13.5/runtime.min.js
// @require        https://cdn.jsdelivr.net/npm/sweetalert2@9
// @require        https://cdn.jsdelivr.net/npm/promise-polyfill@8.1.3/dist/polyfill.min.js
// @require        https://cdn.jsdelivr.net/gh/HCLonely/auto-task@3.0.7/require/overhang.min.js
// @resource       CSS https://cdn.jsdelivr.net/gh/HCLonely/auto-task@3.0.7/require/fuck-task.min.css

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

// @connect        auto-task-test.hclonely.com
// @connect        cdn.jsdelivr.net
// @connect        store.steampowered.com
// @connect        steamcommunity.com
// @connect        twitter.com
// @connect        youtube.com
// @connect        facebook.com
// @connect        instagram.com
// @connect        vk.com
// @connect        twitch.tv
// @connect        github.com
// @connect        discordapp.com
// @connect        discord.gg
// @connect        discord.com
// @connect        raw.githubusercontent.com
// @connect        *
// @run-at         document-end
// ==/UserScript==

/* eslint-disable no-unsafe-finally,no-void,camelcase,no-mixed-operators,promise/param-names,no-fallthrough,no-unused-vars,no-new,no-unused-expressions,no-sequences,no-undef-init,no-unused-vars,no-func-assign */
/* global loadSettings,loadAnnouncement,regeneratorRuntime,checkClick,getURLParameter,showAlert,urlPath,checkUser,Centrifuge,DashboardApp,captchaCheck,commonOptions */
function _defineProperty (obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }) } else { obj[key] = value } return obj }

function asyncGeneratorStep (gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value } catch (error) { reject(error); return } if (info.done) { resolve(value) } else { Promise.resolve(value).then(_next, _throw) } }

function _asyncToGenerator (fn) { return function () { var self = this; var args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next (value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value) } function _throw (err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err) } _next(undefined) }) } }

function _createForOfIteratorHelper (o, allowArrayLike) { var it; if (typeof Symbol === 'undefined' || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === 'number') { if (it) o = it; var i = 0; var F = function F () {}; return { s: F, n: function n () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] } }, e: function e (_e2) { throw _e2 }, f: F } } throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') } var normalCompletion = true; var didErr = false; var err; return { s: function s () { it = o[Symbol.iterator]() }, n: function n () { var step = it.next(); normalCompletion = step.done; return step }, e: function e (_e3) { didErr = true; err = _e3 }, f: function f () { try { if (!normalCompletion && it.return != null) it.return() } finally { if (didErr) throw err } } } }

function _slicedToArray (arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest() }

function _nonIterableRest () { throw new TypeError('Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

function _iterableToArrayLimit (arr, i) { if (typeof Symbol === 'undefined' || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break } } catch (err) { _d = true; _e = err } finally { try { if (!_n && _i.return != null) _i.return() } finally { if (_d) throw _e } } return _arr }

function _arrayWithHoles (arr) { if (Array.isArray(arr)) return arr }

function _toConsumableArray (arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread() }

function _nonIterableSpread () { throw new TypeError('Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

function _unsupportedIterableToArray (o, minLen) { if (!o) return; if (typeof o === 'string') return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor) n = o.constructor.name; if (n === 'Map' || n === 'Set') return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen) }

function _iterableToArray (iter) { if (typeof Symbol !== 'undefined' && Symbol.iterator in Object(iter)) return Array.from(iter) }

function _arrayWithoutHoles (arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr) }

function _arrayLikeToArray (arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2 }

(function () {
  'use strict'

  var _config$banana, _config$freegamelotte, _config$gamehag, _config$giveawaysu, _config$gleam, _config$indiedb, _config$marvelousga, _config$opiumpulses, _config$prys, _config$takekey

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
      getGroupError: '获取steam组信息失败 <a href="s%" target="_blank">s%</a>',
      verifyDiscordAuth: '正在验证discord凭证',
      joinDiscordServer: '正在加入discord服务器',
      leaveDiscordServer: '正在退出discord服务器',
      updateDiscordAuth: 'Discord凭证失效，请<a href="https://discord.com/app" target="_blank">更新凭证</a>！',
      getAuthSuccess: '更新凭证成功！',
      getAuthError: '更新凭证失败，请确认已正确安装<a href="https://github.com/HCLonely/auto-task/raw/master/auto-task-helper.user.js" target="_blank">辅助脚本</a>！',
      getInsInfo: '正在获ins用户id',
      followIns: '正在关注ins用户',
      unfollowIns: '正在取关ins用户',
      loginIns: '请先<a href="https://www.instagram.com/accounts/login/" target="_blank">登录ins</a>',
      updateTwitterInfo: '正在更新twitter凭证',
      loginTwitter: '请先<a href="https://twitter.com/login" target="_blank">登录twitter</a>',
      followTwitterUser: '正在关注twitter用户',
      unfollowTwitterUser: '正在取关twitter用户',
      retweet: '正在转推',
      unretweet: '正在撤销转推',
      getTwitterUserId: '正在获取twitter用户id'
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
      getGroupError: 'Failed to get steam group information. <a href="s%" target="_blank">s%</a>',
      verifyDiscordAuth: 'Verifying discord authorization',
      joinDiscordServer: 'Joining discord server',
      leaveDiscordServer: 'Leaving discord server',
      updateDiscordAuth: 'Discord authorization is invalid, please <a href="https://discord.com/app" target="_blank">update the authorization</a>!',
      getAuthSuccess: 'Successfully updated auth!',
      getAuthError: 'Failed to update auth, please confirm that the <a href="https://github.com/HCLonely/auto-task/raw/master/auto-task-helper.user.js" target="_blank">helper script</a> has been installed correctly!',
      getInsInfo: 'Getting ins user id',
      followIns: 'Following ins user',
      unfollowIns: 'Unfollowing ins user',
      loginIns: 'Please <a href="https://www.instagram.com/accounts/login/" target="_blank">login ins</a>',
      updateTwitterInfo: 'Updating twitter auth',
      loginTwitter: 'Please <a href="https://twitter.com/login" target="_blank">log in to twitter</a>',
      followTwitterUser: 'Following twitter user',
      unfollowTwitterUser: 'Unfollowing twitter user',
      retweet: 'Retweeting',
      unretweet: 'Unretweeting',
      getTwitterUserId: 'Getting twitter user id'
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
        joinDiscordServer: true,
        followIns: true,
        followTwitterUser: true,
        retweet: true,
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
        unfollowGame: true,
        leaveDiscordServer: true,
        unfollowIns: true,
        unfollowTwitterUser: true,
        unretweet: true
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
        joinDiscordServer: true,
        followIns: true,
        visitLink: true
      },
      remove: {
        leaveSteamGroup: true,
        unfollowCurator: true,
        unfollowDeveloper: true,
        unfollowPublisher: true,
        removeFromWishlist: true,
        unfollowGame: true,
        leaveDiscordServer: true,
        unfollowIns: true
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
        followTwitterUser: true,
        retweet: true,
        visitLink: true,
        verifyTask: true
      },
      remove: {
        leaveSteamGroup: true,
        unfollowCurator: true,
        unfollowDeveloper: true,
        unfollowPublisher: true,
        removeFromWishlist: true,
        unfollowGame: true,
        unfollowTwitterUser: true,
        unretweet: true
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

  window.steamInfo = getSteamInfo()
  window.discordInfo = getDiscordInfo()
  window.insInfo = {}
  window.twitchInfo = getTwitchInfo()
  window.twitterInfo = getTwitterInfo()
  var config = Object.assign(JSON.parse(JSON.stringify(defaultConf)), GM_getValue('conf') || {})

  for (var _i = 0, _Object$keys = Object.keys(config); _i < _Object$keys.length; _i++) {
    var k = _Object$keys[_i]
    var defaultConfig = JSON.parse(JSON.stringify(defaultConf))
    config[k] = defaultConfig[k] ? Object.assign(defaultConfig[k], config[k]) : null
  }

  var globalConf = config.global
  var debug = !!globalConf.other.showDetails

  function getSteamInfo () {
    return Object.assign({
      userName: '',
      steam64Id: '',
      communitySessionID: '',
      storeSessionID: '',
      updateTime: 0
    }, GM_getValue('steamInfo'))
  }

  function getDiscordInfo () {
    return Object.assign({
      authorization: '',
      expired: true,
      updateTime: 0
    }, GM_getValue('discordInfo'))
  }

  function getTwitchInfo () {
    return Object.assign({
      authToken: '',
      isLogin: false,
      updateTime: 0
    }, GM_getValue('twitchInfo'))
  }

  function getTwitterInfo () {
    return Object.assign({
      authorization: 'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
      ct0: '',
      updateTime: 0
    }, GM_getValue('twitterInfo'))
  }

  function echoLog (e) {
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

      case 'verifyDiscordAuth':
        ele = $('<li>'.concat(getI18n('verifyDiscordAuth'), '...<font></font></li>'))
        break

      case 'joinDiscordServer':
        ele = $('<li>'.concat(getI18n('joinDiscordServer'), '<a href="https://discord.com/invite/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
        break

      case 'leaveDiscordServer':
        ele = $('<li>'.concat(getI18n('leaveDiscordServer'), '<a href="https://discord.com/invite/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
        break

      case 'updateDiscordAuth':
        ele = $('<li style="color:red;">'.concat(getI18n('updateDiscordAuth'), '</li>'))
        break

      case 'getInsInfo':
        ele = $('<li>'.concat(getI18n('getInsInfo'), '<a href="https://www.instagram.com/').concat(e.text, '/" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
        break

      case 'followIns':
        ele = $('<li>'.concat(getI18n('followIns'), '<a href="https://www.instagram.com/').concat(e.text, '/" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
        break

      case 'unfollowIns':
        ele = $('<li>'.concat(getI18n('unfollowIns'), '<a href="https://www.instagram.com/').concat(e.text, '/" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
        break

      case 'updateTwitterInfo':
        ele = $('<li>'.concat(getI18n('updateTwitterInfo'), '...</li>'))
        break

      case 'getTwitterUserId':
        ele = $('<li>'.concat(getI18n('getTwitterUserId'), '<a href="https://twitter.com/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...</li>'))
        break

      case 'followTwitterUser':
        ele = $('<li>'.concat(getI18n('followTwitterUser'), '<a href="https://twitter.com/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
        break

      case 'unfollowTwitterUser':
        ele = $('<li>'.concat(getI18n('unfollowTwitterUser'), '<a href="https://twitter.com/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
        break

      case 'retweet':
        ele = $('<li>'.concat(getI18n('retweet')).concat(e.text, '...<font></font></li>'))
        break

      case 'unretweet':
        ele = $('<li>'.concat(getI18n('unretweet')).concat(e.text, '...<font></font></li>'))
        break

      case 'visitLink':
        ele = $('<li>'.concat(getI18n('visitLink'), '<a href="').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
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
  }

  function toggleLogs () {
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
  }

  function httpRequest (e) {
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
  }

  function getFinalUrl (r, url) {
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
    httpRequest(conf)
  }

  function visitLink (r, url) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {}
    if (!options.method) options.method = 'HEAD'
    var status = echoLog({
      type: 'visitLink',
      text: url
    })
    new Promise(function (resolve) {
      getFinalUrl(resolve, url, options)
    }).then(function () {
      status.warning('Complete')
      r(1)
    }).catch(function (err) {
      console.error(err)
    })
  }

  function unique (e) {
    return _toConsumableArray(new Set(e))
  }

  function getUrlQuery (url) {
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
  }

  function dateFormat (fmt, date) {
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
  }

  function isEmptyObjArr (object) {
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
  }

  function clearArray (arr) {
    if (Array.isArray(arr[0])) {
      return arr.map(function () {
        return []
      })
    } else {
      return []
    }
  }

  function clearTaskInfo (data) {
    if (Array.isArray(data)) {
      return clearArray(data)
    } else {
      for (var _i3 = 0, _Object$entries = Object.entries(data); _i3 < _Object$entries.length; _i3++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i3], 2)
        var _k2 = _Object$entries$_i[0]
        var v = _Object$entries$_i[1]

        if (Array.isArray(v)) data[_k2] = clearArray(v)
      }

      return data
    }
  }

  function uniqueTaskInfo (data) {
    if (Array.isArray(data)) {
      if (Array.isArray(data[0])) {
        for (var i = 0; i < data.length; i++) {
          data[i] = unique(data[i])
        }
      } else {
        data = unique(data)
      }
    } else {
      for (var _i4 = 0, _Object$entries2 = Object.entries(data); _i4 < _Object$entries2.length; _i4++) {
        var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i4], 2)
        var _k3 = _Object$entries2$_i[0]
        var v = _Object$entries2$_i[1]

        if (Array.isArray(v)) data[_k3] = unique(v)
      }
    }

    return data
  }

  function updateSteamInfo (r) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'all'
    var update = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false

    if (new Date().getTime() - steamInfo.updateTime > 10 * 60 * 1000 || update) {
      var pro = []

      if (type === 'community' || type === 'all') {
        pro.push(new Promise(function (resolve, reject) {
          var status = echoLog({
            type: 'updateSteamCommunity'
          })
          httpRequest({
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
                reject(new Error('Request Failed'))
              }
            },
            r: resolve,
            status: status
          })
        }))
      }

      if (type === 'store' || type === 'all') {
        pro.push(new Promise(function (resolve, reject) {
          var status = echoLog({
            type: 'updateSteamStore'
          })
          httpRequest({
            url: 'https://store.steampowered.com/stats/',
            method: 'GET',
            onload: function onload (response) {
              if (debug) console.log(response)

              if (response.status === 200) {
                if ($(response.responseText).find('a[href*="/login/"]').length > 0) {
                  status.error('Error:' + getI18n('loginSteamStore'), true)
                  reject(new Error('Not Login'))
                } else {
                  var storeSessionID = response.responseText.match(/g_sessionID = "(.+?)";/)
                  if (storeSessionID) steamInfo.storeSessionID = storeSessionID[1]
                  status.success()
                  resolve()
                }
              } else {
                status.error('Error:' + response.statusText + '(' + response.status + ')')
                reject(new Error('Request Failed'))
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
        r(0)
      })
    } else {
      r(1)
    }
  }

  function joinSteamGroup (r, group) {
    var status = echoLog({
      type: 'joinSteamGroup',
      text: group
    })
    httpRequest({
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
  }

  function getGroupID (groupName, callback) {
    var _ref2 = [echoLog({
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
        httpRequest({
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
  }

  function leaveSteamGroup (r, groupName) {
    getGroupID(groupName, function (groupName, groupId) {
      var status = echoLog({
        type: 'leaveSteamGroup',
        text: groupName
      })
      httpRequest({
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
  }

  function followCurator (r, curatorId) {
    var follow = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '1'
    var status = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ''
    status = status || echoLog({
      type: follow === '1' ? 'followCurator' : 'unfollowCurator',
      text: curatorId
    })
    httpRequest({
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
  }

  function unfollowCurator (r, curatorId) {
    followCurator(r, curatorId, '0')
  }

  function getCuratorID (developerName, callback, type, path) {
    var _ref3 = [echoLog({
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
        httpRequest({
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
  }

  function followDeveloper (r, developerName) {
    var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'followDeveloper'
    var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'developer'
    getCuratorID(developerName, function (developerName, curatorId) {
      var status = echoLog({
        type: type,
        text: developerName
      })
      followCurator(r, curatorId, '1', status)
    }, type, path)
  }

  function unfollowDeveloper (r, developerName) {
    var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'unfollowDeveloper'
    var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'developer'
    getCuratorID(developerName, function (developerName, curatorId) {
      var status = echoLog({
        type: type,
        text: developerName
      })
      followCurator(r, curatorId, '0', status)
    }, type, path)
  }

  function followPublisher (r, publisherName) {
    followDeveloper(r, publisherName, 'followPublisher', 'publisher')
  }

  function unfollowPublisher (r, publisherName) {
    unfollowDeveloper(r, publisherName, 'unfollowPublisher', 'publisher')
  }

  function followFranchise (r, franchiseName) {
    followDeveloper(r, franchiseName, 'followFranchise', 'franchise')
  }

  function unfollowFranchise (r, franchiseName) {
    unfollowDeveloper(r, franchiseName, 'unfollowFranchise', 'franchise')
  }

  function addWishlist (r, gameId) {
    var status = echoLog({
      type: 'addWishlist',
      text: gameId
    })
    new Promise(function (resolve) {
      httpRequest({
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
        httpRequest({
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
  }

  function removeWishlist (r, gameId) {
    var status = echoLog({
      type: 'removeWishlist',
      text: gameId
    })
    new Promise(function (resolve) {
      httpRequest({
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
        httpRequest({
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
  }

  function followGame (r, gameId) {
    var status = echoLog({
      type: 'followGame',
      text: gameId
    })
    new Promise(function (resolve) {
      httpRequest({
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
        httpRequest({
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
  }

  function unfollowGame (r, gameId) {
    var status = echoLog({
      type: 'unfollowGame',
      text: gameId
    })
    new Promise(function (resolve) {
      httpRequest({
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
        httpRequest({
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
  }

  function likeAnnouncements (r, rawMatch) {
    var url = ''
    var status = null
    var data = {}

    if (rawMatch.length === 5) {
      status = echoLog({
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
      status = echoLog({
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

    httpRequest({
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
  }

  function toggleSteamActions (_ref4) {
    var website = _ref4.website
    var type = _ref4.type
    var elements = _ref4.elements
    var resolve = _ref4.resolve
    var action = _ref4.action
    var _ref4$toFinalUrl = _ref4.toFinalUrl
    var toFinalUrl = _ref4$toFinalUrl === void 0 ? {} : _ref4$toFinalUrl
    var pro = []

    var _iterator = _createForOfIteratorHelper(unique(elements))
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
                action === 'fuck' ? joinSteamGroup(resolve, elementName[1]) : leaveSteamGroup(resolve, elementName[1])
              }))
              break

            case 'curator':
              pro.push(new Promise(function (resolve) {
                action === 'fuck' ? followCurator(resolve, elementName[1]) : unfollowCurator(resolve, elementName[1])
              }))
              break

            case 'publisher':
              pro.push(new Promise(function (resolve) {
                action === 'fuck' ? followPublisher(resolve, elementName[1]) : unfollowPublisher(resolve, elementName[1])
              }))
              break

            case 'developer':
              pro.push(new Promise(function (resolve) {
                action === 'fuck' ? followDeveloper(resolve, elementName[1]) : unfollowDeveloper(resolve, elementName[1])
              }))
              break

            case 'franchise':
              pro.push(new Promise(function (resolve) {
                action === 'fuck' ? followFranchise(resolve, elementName[1]) : unfollowFranchise(resolve, elementName[1])
              }))
              break

            case 'wishlist':
              pro.push(new Promise(function (resolve) {
                action === 'fuck' ? addWishlist(resolve, elementName[1]) : removeWishlist(resolve, elementName[1])
              }))
              break

            case 'game':
              pro.push(new Promise(function (resolve) {
                action === 'fuck' ? followGame(resolve, elementName[1]) : unfollowGame(resolve, elementName[1])
              }))
              break

            case 'announcement':
              pro.push(new Promise(function (resolve) {
                if (action === 'fuck') {
                  likeAnnouncements(resolve, elementName)
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

  /* 未完成任务: i18n */

  function updateTwitchInfo (notice) {
    try {
      var authToken = Cookies.get('auth-token')
      var isLogin = !!Cookies.get('login')

      if (authToken && isLogin) {
        var _commonOptions

        twitchInfo.authToken = authToken
        twitchInfo.isLogin = isLogin
        twitchInfo.clientId = (_commonOptions = commonOptions) === null || _commonOptions === void 0 ? void 0 : _commonOptions.headers['Client-ID']
        twitchInfo.updateTime = new Date().getTime()
        GM_setValue('twitchInfo', twitchInfo)

        if (notice) {
          Swal.fire({
            title: getI18n('updateTwitchInfoSuccess'),
            icon: 'success'
          })
        }
      } else {
        if (notice) {
          Swal.fire({
            title: getI18n('needLogin'),
            icon: 'warning'
          })
        }
      }
    } catch (e) {
      if (debug) console.log(e)

      if (notice) {
        Swal.fire({
          title: getI18n('updateTwitchInfoError'),
          icon: 'error'
        })
      }
    }
  }

  function verifyTwitchAuth () {
    var status = echoLog({
      type: 'verifyTwitchAuth'
    })
    return new Promise(function (resolve) {
      httpRequest({
        url: 'https://gql.twitch.tv/gql',
        method: 'POST',
        dataType: 'json',
        headers: {
          Authorization: 'OAuth ' + twitchInfo.authToken,
          'Client-Id': twitchInfo.clientId
        },
        data: '[{"operationName":"FrontPageNew_User","variables":{"limit":1},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"64bd07a2cbaca80699d62636d966cf6395a5d14a1f0a14282067dcb28b13eb11"}}}]',
        onload: function onload (response) {
          var _response$response9, _response$response9$, _response$response9$$

          if (debug) console.log(response)

          if (response.status === 200 && ((_response$response9 = response.response) === null || _response$response9 === void 0 ? void 0 : (_response$response9$ = _response$response9[0]) === null || _response$response9$ === void 0 ? void 0 : (_response$response9$$ = _response$response9$.data) === null || _response$response9$$ === void 0 ? void 0 : _response$response9$$.currentUser)) {
            status.success()
            resolve({
              result: 'success',
              statusText: response.statusText,
              status: response.status
            })
          } else {
            status.error('Error:' + response.statusText + '(' + response.status + ')')
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
    }).then(function (data) {
      return (data === null || data === void 0 ? void 0 : data.result) === 'success'
    }).catch(function (error) {
      if (debug) console.log(error)
      return false
    })
  }

  function toggleTwitchChannel (_x, _x2) {
    return _toggleTwitchChannel.apply(this, arguments)
  }

  function _toggleTwitchChannel () {
    _toggleTwitchChannel = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee16 (resolve, name) {
      var follow
      var channelId
      var status
      var followData
      var unfollowData
      var _args18 = arguments
      return regeneratorRuntime.wrap(function _callee16$ (_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              follow = _args18.length > 2 && _args18[2] !== undefined ? _args18[2] : true
              _context18.next = 3
              return getTwitchChannelId(name)

            case 3:
              channelId = _context18.sent

              if (channelId) {
                _context18.next = 6
                break
              }

              return _context18.abrupt('return', resolve({
                result: 'error',
                statusText: '"getTwitchChannelId" failed',
                status: 0
              }))

            case 6:
              status = echoLog({
                type: ''.concat(follow ? '' : 'un', 'followTwitchChannel'),
                text: name
              })
              followData = '[{"operationName":"FollowButton_FollowUser","variables":{"input":{"disableNotifications":false,"targetID":"' + channelId + '"}},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"3efee1acda90efdff9fef6e6b4a29213be3ee490781c5b54469717b6131ffdfe"}}}]'
              unfollowData = '[{"operationName":"FollowButton_UnfollowUser","variables":{"input":{"targetID":"' + channelId + '"}},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"d7fbdb4e9780dcdc0cc1618ec783309471cd05a59584fc3c56ea1c52bb632d41"}}}]'
              httpRequest({
                url: 'https://gql.twitch.tv/gql',
                method: 'POST',
                dataType: 'json',
                headers: {
                  Authorization: 'OAuth ' + twitchInfo.authToken
                },
                data: follow ? followData : unfollowData,
                onload: function onload (response) {
                  if (debug) console.log(response)

                  if (response.status === 200) {
                    status.success()
                    resolve({
                      result: 'success',
                      statusText: response.statusText,
                      status: response.status
                    })
                  } else {
                    status.error('Error:' + response.statusText + '(' + response.status + ')')
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

            case 10:
            case 'end':
              return _context18.stop()
          }
        }
      }, _callee16)
    }))
    return _toggleTwitchChannel.apply(this, arguments)
  }

  function getTwitchChannelId (name) {
    return new Promise(function (resolve) {
      var status = echoLog({
        type: 'getTwitchChannelId',
        text: name
      })
      httpRequest({
        url: 'https://gql.twitch.tv/gql',
        method: 'POST',
        headers: {
          Authorization: 'OAuth ' + twitchInfo.authToken,
          'Client-Id': twitchInfo.clientId
        },
        responseType: 'json',
        data: '[{"operationName":"ActiveWatchParty","variables":{"channelLogin":"' + name + '"},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"4a8156c97b19e3a36e081cf6d6ddb5dbf9f9b02ae60e4d2ff26ed70aebc80a30"}}}]',
        onload: function onload (response) {
          if (debug) console.log(response)

          if (response.status === 200) {
            var _response$response10, _response$response10$, _response$response10$2, _response$response10$3

            var channelId = (_response$response10 = response.response) === null || _response$response10 === void 0 ? void 0 : (_response$response10$ = _response$response10[0]) === null || _response$response10$ === void 0 ? void 0 : (_response$response10$2 = _response$response10$.data) === null || _response$response10$2 === void 0 ? void 0 : (_response$response10$3 = _response$response10$2.user) === null || _response$response10$3 === void 0 ? void 0 : _response$response10$3.id

            if (channelId) {
              status.success()
              resolve({
                result: 'success',
                statusText: response.statusText,
                status: response.status,
                channelId: channelId
              })
            } else {
              status.error('Error:' + response.statusText + '(' + response.status + ')')
              resolve({
                result: 'error',
                statusText: response.statusText,
                status: response.status
              })
            }
          } else {
            status.error('Error:' + response.statusText + '(' + response.status + ')')
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
    }).then(function (data) {
      var channelId = data.result === 'success' ? data === null || data === void 0 ? void 0 : data.channelId : null
      return channelId || false
    }).catch(function () {
      return false
    })
  }

  function toggleTwitchActions (_x3) {
    return _toggleTwitchActions.apply(this, arguments)
  }

  function _toggleTwitchActions () {
    _toggleTwitchActions = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee17 (_ref5) {
      var website, type, elements, resolve, action, _ref5$toFinalUrl, toFinalUrl, _iterator29, _step30, _loop15

      return regeneratorRuntime.wrap(function _callee17$ (_context20) {
        while (1) {
          switch (_context20.prev = _context20.next) {
            case 0:
              website = _ref5.website, type = _ref5.type, elements = _ref5.elements, resolve = _ref5.resolve, action = _ref5.action, _ref5$toFinalUrl = _ref5.toFinalUrl, toFinalUrl = _ref5$toFinalUrl === void 0 ? {} : _ref5$toFinalUrl

              if (!(new Date().getTime() - twitterInfo.updateTime > 10 * 60 * 1000)) {
                _context20.next = 4
                break
              }

              _context20.next = 4
              return verifyTwitchAuth()

            case 4:
              _iterator29 = _createForOfIteratorHelper(unique(elements))
              _context20.prev = 5
              _loop15 = /* #__PURE__ */regeneratorRuntime.mark(function _loop15 () {
                var element, name, _toFinalUrlElement$ma, toFinalUrlElement

                return regeneratorRuntime.wrap(function _loop15$ (_context19) {
                  while (1) {
                    switch (_context19.prev = _context19.next) {
                      case 0:
                        element = _step30.value
                        name = element

                        if (website === 'giveawaysu' && toFinalUrl[element]) {
                          toFinalUrlElement = toFinalUrl[element] || ''
                          name = (_toFinalUrlElement$ma = toFinalUrlElement.match(/https:\/\/www.twitch.tv\/(.+)/)) === null || _toFinalUrlElement$ma === void 0 ? void 0 : _toFinalUrlElement$ma[1]
                        }

                        _context19.next = 5
                        return new Promise(function (resolve) {
                          toggleTwitchChannel(resolve, name, action === 'fuck')
                        })

                      case 5:
                      case 'end':
                        return _context19.stop()
                    }
                  }
                }, _loop15)
              })

              _iterator29.s()

            case 8:
              if ((_step30 = _iterator29.n()).done) {
                _context20.next = 12
                break
              }

              return _context20.delegateYield(_loop15(), 't0', 10)

            case 10:
              _context20.next = 8
              break

            case 12:
              _context20.next = 17
              break

            case 14:
              _context20.prev = 14
              _context20.t1 = _context20.catch(5)

              _iterator29.e(_context20.t1)

            case 17:
              _context20.prev = 17

              _iterator29.f()

              return _context20.finish(17)

            case 20:
              resolve()

            case 21:
            case 'end':
              return _context20.stop()
          }
        }
      }, _callee17, null, [[5, 14, 17, 20]])
    }))
    return _toggleTwitchActions.apply(this, arguments)
  }

  function verifyDiscordAuth () {
    var status = echoLog({
      type: 'verifyDiscordAuth'
    })
    return new Promise(function (resolve) {
      httpRequest({
        url: 'https://discord.com/api/v6/users/@me',
        method: 'HEAD',
        headers: {
          authorization: discordInfo.authorization
        },
        onload: function onload (response) {
          if (debug) console.log(response)

          if (response.status === 200) {
            status.success()
            resolve({
              result: 'success',
              statusText: response.statusText,
              status: response.status
            })
          } else {
            status.error('Error:' + response.statusText + '(' + response.status + ')')
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
    })
  }

  function joinDiscordServer (r, inviteId) {
    var status = echoLog({
      type: 'joinDiscordServer',
      text: inviteId
    })
    httpRequest({
      url: 'https://discord.com/api/v6/invites/' + inviteId,
      method: 'POST',
      dataType: 'json',
      headers: {
        authorization: discordInfo.authorization
      },
      onload: function onload (response) {
        if (debug) console.log(response)

        if (response.status === 200) {
          var _response$response11, _response$response11$

          status.success()
          r({
            result: 'success',
            statusText: response.statusText,
            status: response.status,
            guild: [inviteId, (_response$response11 = response.response) === null || _response$response11 === void 0 ? void 0 : (_response$response11$ = _response$response11.guild) === null || _response$response11$ === void 0 ? void 0 : _response$response11$.id]
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
  }

  function leaveDiscordServer (r, inviteId, guild) {
    var status = echoLog({
      type: 'leaveDiscordServer',
      text: inviteId
    })
    httpRequest({
      url: 'https://discord.com/api/v6/users/@me/guilds/' + guild,
      method: 'DELETE',
      headers: {
        authorization: discordInfo.authorization
      },
      onload: function onload (response) {
        if (debug) console.log(response)

        if (response.status === 204) {
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
  }

  function toggleDiscordActions (_x4) {
    return _toggleDiscordActions.apply(this, arguments)
  }

  function _toggleDiscordActions () {
    _toggleDiscordActions = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee18 (_ref6) {
      var website, elements, resolve, action, _ref6$toFinalUrl, toFinalUrl, _ref6$toGuild, toGuild, verifyResult, pro, _iterator30, _step31, _loop16

      return regeneratorRuntime.wrap(function _callee18$ (_context21) {
        while (1) {
          switch (_context21.prev = _context21.next) {
            case 0:
              website = _ref6.website, elements = _ref6.elements, resolve = _ref6.resolve, action = _ref6.action, _ref6$toFinalUrl = _ref6.toFinalUrl, toFinalUrl = _ref6$toFinalUrl === void 0 ? {} : _ref6$toFinalUrl, _ref6$toGuild = _ref6.toGuild, toGuild = _ref6$toGuild === void 0 ? {} : _ref6$toGuild

              if (!(new Date().getTime() - discordInfo.updateTime > 10 * 60 * 1000 || discordInfo.expired)) {
                _context21.next = 14
                break
              }

              _context21.next = 4
              return verifyDiscordAuth()

            case 4:
              verifyResult = _context21.sent

              if (!verifyResult) {
                _context21.next = 11
                break
              }

              discordInfo.updateTime = new Date().getTime()
              discordInfo.expired = false
              GM_setValue('discordInfo', discordInfo)
              _context21.next = 14
              break

            case 11:
              echoLog({
                type: 'updateDiscordAuth'
              })
              resolve({})
              return _context21.abrupt('return')

            case 14:
              pro = []
              _iterator30 = _createForOfIteratorHelper(unique(elements))

              try {
                _loop16 = function _loop16 () {
                  var element = _step31.value
                  var inviteId = null

                  if (website === 'giveawaysu' && toFinalUrl[element]) {
                    var _toFinalUrlElement$ma2

                    var toFinalUrlElement = toFinalUrl[element] || ''
                    inviteId = (_toFinalUrlElement$ma2 = toFinalUrlElement.match(/invite\/(.+)/)) === null || _toFinalUrlElement$ma2 === void 0 ? void 0 : _toFinalUrlElement$ma2[1]

                    if (inviteId) {
                      pro.push(new Promise(function (resolve) {
                        var guild = toGuild[inviteId]

                        if (action === 'fuck') {
                          joinDiscordServer(resolve, inviteId)
                        } else if (guild) {
                          leaveDiscordServer(resolve, inviteId, guild)
                        } else {
                          resolve({})
                        }
                      }))
                    }
                  }
                }

                for (_iterator30.s(); !(_step31 = _iterator30.n()).done;) {
                  _loop16()
                }
              } catch (err) {
                _iterator30.e(err)
              } finally {
                _iterator30.f()
              }

              Promise.all(pro).then(function (data) {
                resolve(data)
              }).catch(function () {
                resolve()
              })

            case 18:
            case 'end':
              return _context21.stop()
          }
        }
      }, _callee18)
    }))
    return _toggleDiscordActions.apply(this, arguments)
  }

  function getInsInfo (name) {
    return new Promise(function (resolve) {
      var status = echoLog({
        type: 'getInsInfo',
        text: name
      })
      httpRequest({
        url: 'https://www.instagram.com/'.concat(name, '/'),
        method: 'GET',
        onload: function onload (response) {
          if (debug) console.log(response)

          if (response.finalUrl.includes('accounts/login')) {
            status.error('Error:' + getI18n('loginIns'), true)
            resolve({
              result: 'error',
              statusText: response.statusText,
              status: response.status
            })
            return
          }

          if (response.status === 200) {
            var _response$responseTex, _response$responseTex2

            var _data = (_response$responseTex = response.responseText) === null || _response$responseTex === void 0 ? void 0 : (_response$responseTex2 = _response$responseTex.match(/window._sharedData[\s]*=[\s]*?(\{[\w\W]*?\});/)) === null || _response$responseTex2 === void 0 ? void 0 : _response$responseTex2[1]

            if (_data) {
              var _data$config, _data$entry_data, _data$entry_data$Prof, _data$entry_data$Prof2, _data$entry_data$Prof3, _data$entry_data$Prof4

              var data = JSON.parse(_data)
              insInfo.csrftoken = data === null || data === void 0 ? void 0 : (_data$config = data.config) === null || _data$config === void 0 ? void 0 : _data$config.csrf_token // eslint-disable-line camelcase

              insInfo.hash = data === null || data === void 0 ? void 0 : data.rollout_hash // eslint-disable-line camelcase

              status.success()
              resolve({
                result: 'success',
                statusText: response.statusText,
                status: response.status,
                id: data === null || data === void 0 ? void 0 : (_data$entry_data = data.entry_data) === null || _data$entry_data === void 0 ? void 0 : (_data$entry_data$Prof = _data$entry_data.ProfilePage) === null || _data$entry_data$Prof === void 0 ? void 0 : (_data$entry_data$Prof2 = _data$entry_data$Prof[0]) === null || _data$entry_data$Prof2 === void 0 ? void 0 : (_data$entry_data$Prof3 = _data$entry_data$Prof2.graphql) === null || _data$entry_data$Prof3 === void 0 ? void 0 : (_data$entry_data$Prof4 = _data$entry_data$Prof3.user) === null || _data$entry_data$Prof4 === void 0 ? void 0 : _data$entry_data$Prof4.id
              }) // eslint-disable-line camelcase
            } else {
              status.error('Error: Ins data error!')
              resolve({
                result: 'error',
                statusText: response.statusText,
                status: response.status
              })
            }
          } else {
            status.error('Error:' + response.statusText + '(' + response.status + ')')
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
    }).then(function (data) {
      return {
        id: data === null || data === void 0 ? void 0 : data.id,
        error: !(data === null || data === void 0 ? void 0 : data.id)
      }
    }).catch(function (error) {
      return {
        id: null,
        error: error
      }
    })
  }

  function followIns (_x5, _x6) {
    return _followIns.apply(this, arguments)
  }

  function _followIns () {
    _followIns = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee19 (r, name) {
      var _yield$getInsInfo, id, error, status

      return regeneratorRuntime.wrap(function _callee19$ (_context22) {
        while (1) {
          switch (_context22.prev = _context22.next) {
            case 0:
              _context22.next = 2
              return getInsInfo(name)

            case 2:
              _yield$getInsInfo = _context22.sent
              id = _yield$getInsInfo.id
              error = _yield$getInsInfo.error

              if (!error) {
                _context22.next = 8
                break
              }

              r({
                result: 'error',
                statusText: 'getInsInfo error'
              })
              return _context22.abrupt('return', error)

            case 8:
              status = echoLog({
                type: 'followIns',
                text: name
              })
              httpRequest({
                url: 'https://www.instagram.com/web/friendships/'.concat(id, '/follow/'),
                method: 'POST',
                dataType: 'json',
                headers: {
                  'x-csrftoken': insInfo.csrftoken,
                  origin: 'https://www.instagram.com',
                  referer: 'https://www.instagram.com/'.concat(name, '/'),
                  'content-type': 'application/x-www-form-urlencoded',
                  'sec-fetch-site': 'same-origin',
                  'x-instagram-ajax': insInfo.hash
                },
                onload: function onload (response) {
                  var _response$response20

                  if (debug) console.log(response)

                  if (response.status === 200 && ((_response$response20 = response.response) === null || _response$response20 === void 0 ? void 0 : _response$response20.result) === 'following') {
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

            case 10:
            case 'end':
              return _context22.stop()
          }
        }
      }, _callee19)
    }))
    return _followIns.apply(this, arguments)
  }

  function unfollowIns (_x7, _x8) {
    return _unfollowIns.apply(this, arguments)
  }

  function _unfollowIns () {
    _unfollowIns = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee20 (r, name) {
      var _yield$getInsInfo2, id, error, status

      return regeneratorRuntime.wrap(function _callee20$ (_context23) {
        while (1) {
          switch (_context23.prev = _context23.next) {
            case 0:
              _context23.next = 2
              return getInsInfo(name)

            case 2:
              _yield$getInsInfo2 = _context23.sent
              id = _yield$getInsInfo2.id
              error = _yield$getInsInfo2.error

              if (!error) {
                _context23.next = 8
                break
              }

              r({
                result: 'error',
                statusText: 'getInsInfo error'
              })
              return _context23.abrupt('return', error)

            case 8:
              status = echoLog({
                type: 'unfollowIns',
                text: name
              })
              httpRequest({
                url: 'https://www.instagram.com/web/friendships/'.concat(id, '/unfollow/'),
                method: 'POST',
                dataType: 'json',
                headers: {
                  'x-csrftoken': insInfo.csrftoken,
                  origin: 'https://www.instagram.com',
                  referer: 'https://www.instagram.com/'.concat(name, '/'),
                  'content-type': 'application/x-www-form-urlencoded',
                  'sec-fetch-site': 'same-origin',
                  'x-instagram-ajax': insInfo.hash
                },
                onload: function onload (response) {
                  var _response$response21

                  if (debug) console.log(response)

                  if (response.status === 200 && ((_response$response21 = response.response) === null || _response$response21 === void 0 ? void 0 : _response$response21.status) === 'ok') {
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

            case 10:
            case 'end':
              return _context23.stop()
          }
        }
      }, _callee20)
    }))
    return _unfollowIns.apply(this, arguments)
  }

  function toggleInsActions (_x9) {
    return _toggleInsActions.apply(this, arguments)
  }

  function _toggleInsActions () {
    _toggleInsActions = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee21 (_ref7) {
      var website, elements, resolve, action, _ref7$toFinalUrl, toFinalUrl, pro, _iterator31, _step32, _loop17

      return regeneratorRuntime.wrap(function _callee21$ (_context24) {
        while (1) {
          switch (_context24.prev = _context24.next) {
            case 0:
              website = _ref7.website, elements = _ref7.elements, resolve = _ref7.resolve, action = _ref7.action, _ref7$toFinalUrl = _ref7.toFinalUrl, toFinalUrl = _ref7$toFinalUrl === void 0 ? {} : _ref7$toFinalUrl
              pro = []
              _iterator31 = _createForOfIteratorHelper(unique(elements))

              try {
                _loop17 = function _loop17 () {
                  var element = _step32.value
                  var name = null

                  if (website === 'giveawaysu' && toFinalUrl[element]) {
                    var _toFinalUrlElement$ma3

                    var toFinalUrlElement = toFinalUrl[element] || ''
                    name = (_toFinalUrlElement$ma3 = toFinalUrlElement.match(/https:\/\/www.instagram.com\/(.+)?\//)) === null || _toFinalUrlElement$ma3 === void 0 ? void 0 : _toFinalUrlElement$ma3[1]

                    if (name) {
                      pro.push(new Promise(function (resolve) {
                        if (action === 'fuck') {
                          followIns(resolve, name)
                        } else {
                          unfollowIns(resolve, name)
                        }
                      }))
                    }
                  }
                }

                for (_iterator31.s(); !(_step32 = _iterator31.n()).done;) {
                  _loop17()
                }
              } catch (err) {
                _iterator31.e(err)
              } finally {
                _iterator31.f()
              }

              Promise.all(pro).finally(function () {
                resolve()
              })

            case 5:
            case 'end':
              return _context24.stop()
          }
        }
      }, _callee21)
    }))
    return _toggleInsActions.apply(this, arguments)
  }

  function updateTwitterInfo () {
    return new Promise(function (resolve) {
      var status = echoLog({
        type: 'updateTwitterInfo'
      })
      httpRequest({
        url: 'https://twitter.com/settings/account?k',
        method: 'HEAD',
        onload: function onload (response) {
          if (debug) console.log(response)

          if (response.finalUrl.includes('twitter.com/login')) {
            status.error('Error:' + getI18n('loginTwitter'), true)
            resolve({
              result: 'error',
              statusText: response.statusText,
              status: response.status
            })
            return
          }

          if (response.status === 200) {
            var _response$responseHea

            var ct0 = (_response$responseHea = response.responseHeaders.match(/ct0=(.+?);/)) === null || _response$responseHea === void 0 ? void 0 : _response$responseHea[1]

            if (ct0) {
              twitterInfo.ct0 = ct0
              twitterInfo.updateTime = new Date().getTime()
              status.success()
              resolve({
                result: 'success',
                statusText: response.statusText,
                status: response.status
              })
            } else {
              status.error('Error: Parameter "ct0" not found!')
              resolve({
                result: 'error',
                statusText: response.statusText,
                status: response.status
              })
            }
          } else {
            status.error('Error:' + response.statusText + '(' + response.status + ')')
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
    })
  }

  function toggleTwitterUser (_x10, _x11) {
    return _toggleTwitterUser.apply(this, arguments)
  }

  function _toggleTwitterUser () {
    _toggleTwitterUser = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee22 (r, name) {
      var follow
      var userId
      var status
      var _args25 = arguments
      return regeneratorRuntime.wrap(function _callee22$ (_context25) {
        while (1) {
          switch (_context25.prev = _context25.next) {
            case 0:
              follow = _args25.length > 2 && _args25[2] !== undefined ? _args25[2] : true
              _context25.next = 3
              return getTwitterUserId(name)

            case 3:
              userId = _context25.sent

              if (userId) {
                _context25.next = 6
                break
              }

              return _context25.abrupt('return', r({
                result: 'error',
                statusText: '"getTwitterUserId" failed',
                status: 0
              }))

            case 6:
              status = echoLog({
                type: ''.concat(follow ? '' : 'un', 'followTwitterUser'),
                text: name
              })
              httpRequest({
                url: 'https://api.twitter.com/1.1/friendships/'.concat(follow ? 'create' : 'destroy', '.json'),
                method: 'POST',
                headers: {
                  authorization: 'Bearer ' + twitterInfo.authorization,
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'x-csrf-token': twitterInfo.ct0
                },
                data: $.param({
                  include_profile_interstitial_type: 1,
                  include_blocking: 1,
                  include_blocked_by: 1,
                  include_followed_by: 1,
                  include_want_retweets: 1,
                  include_mute_edge: 1,
                  include_can_dm: 1,
                  include_can_media_tag: 1,
                  skip_status: 1,
                  id: userId
                }),
                onload: function onload (response) {
                  if (debug) console.log(response)

                  if (response.status === 200) {
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

            case 8:
            case 'end':
              return _context25.stop()
          }
        }
      }, _callee22)
    }))
    return _toggleTwitterUser.apply(this, arguments)
  }

  function toggleRetweet (_x12, _x13) {
    return _toggleRetweet.apply(this, arguments)
  }

  function _toggleRetweet () {
    _toggleRetweet = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee23 (r, retweetId) {
      var retweet
      var status
      var _args26 = arguments
      return regeneratorRuntime.wrap(function _callee23$ (_context26) {
        while (1) {
          switch (_context26.prev = _context26.next) {
            case 0:
              retweet = _args26.length > 2 && _args26[2] !== undefined ? _args26[2] : true
              status = echoLog({
                type: ''.concat(retweet ? '' : 'un', 'retweet'),
                text: retweetId
              })
              httpRequest({
                url: 'https://api.twitter.com/1.1/statuses/'.concat(retweet ? '' : 'un', 'retweet.json'),
                method: 'POST',
                headers: {
                  authorization: 'Bearer ' + twitterInfo.authorization,
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'x-csrf-token': twitterInfo.ct0
                },
                data: $.param({
                  tweet_mode: 'extended',
                  id: retweetId
                }),
                responseType: 'json',
                onload: function onload (response) {
                  var _response$response22, _response$response22$, _response$response22$2

                  if (debug) console.log(response)

                  if (response.status === 200 || response.status === 403 && ((_response$response22 = response.response) === null || _response$response22 === void 0 ? void 0 : (_response$response22$ = _response$response22.errors) === null || _response$response22$ === void 0 ? void 0 : (_response$response22$2 = _response$response22$[0]) === null || _response$response22$2 === void 0 ? void 0 : _response$response22$2.code) === 327) {
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

            case 3:
            case 'end':
              return _context26.stop()
          }
        }
      }, _callee23)
    }))
    return _toggleRetweet.apply(this, arguments)
  }

  function getTwitterUserId (name) {
    return new Promise(function (resolve) {
      var status = echoLog({
        type: 'getTwitterUserId',
        text: name
      })
      httpRequest({
        url: 'https://api.twitter.com/graphql/-xfUfZsnR_zqjFd-IfrN5A/UserByScreenName?variables=%7B%22screen_name%22%3A%22' + name + '%22%2C%22withHighlightedLabel%22%3Atrue%7D',
        method: 'POST',
        headers: {
          authorization: 'Bearer ' + twitterInfo.authorization,
          'content-type': 'application/json'
        },
        responseType: 'json',
        anonymous: true,
        onload: function onload (response) {
          if (debug) console.log(response)

          if (response.status === 200) {
            var _response$response12, _response$response12$, _response$response12$2

            var userId = (_response$response12 = response.response) === null || _response$response12 === void 0 ? void 0 : (_response$response12$ = _response$response12.data) === null || _response$response12$ === void 0 ? void 0 : (_response$response12$2 = _response$response12$.user) === null || _response$response12$2 === void 0 ? void 0 : _response$response12$2.rest_id // eslint-disable-line camelcase

            if (userId) {
              status.success()
              resolve({
                result: 'success',
                statusText: response.statusText,
                status: response.status,
                userId: userId
              })
            } else {
              status.error('Error:' + response.statusText + '(' + response.status + ')')
              resolve({
                result: 'error',
                statusText: response.statusText,
                status: response.status
              })
            }
          } else {
            status.error('Error:' + response.statusText + '(' + response.status + ')')
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
    }).then(function (data) {
      var userId = data.result === 'success' ? data === null || data === void 0 ? void 0 : data.userId : null
      return userId || false
    }).catch(function () {
      return false
    })
  }

  function toggleTwitterActions (_x14) {
    return _toggleTwitterActions.apply(this, arguments)
  }

  function _toggleTwitterActions () {
    _toggleTwitterActions = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee24 (_ref8) {
      var website, type, elements, resolve, action, _ref8$toFinalUrl, toFinalUrl, _iterator32, _step33, _loop18

      return regeneratorRuntime.wrap(function _callee24$ (_context28) {
        while (1) {
          switch (_context28.prev = _context28.next) {
            case 0:
              website = _ref8.website, type = _ref8.type, elements = _ref8.elements, resolve = _ref8.resolve, action = _ref8.action, _ref8$toFinalUrl = _ref8.toFinalUrl, toFinalUrl = _ref8$toFinalUrl === void 0 ? {} : _ref8$toFinalUrl

              if (!(new Date().getTime() - twitterInfo.updateTime > 10 * 60 * 1000)) {
                _context28.next = 4
                break
              }

              _context28.next = 4
              return updateTwitterInfo()

            case 4:
              _iterator32 = _createForOfIteratorHelper(unique(elements))
              _context28.prev = 5
              _loop18 = /* #__PURE__ */regeneratorRuntime.mark(function _loop18 () {
                var _toFinalUrlElement$ma4, _toFinalUrlElement$ma5

                var element, id, toFinalUrlElement
                return regeneratorRuntime.wrap(function _loop18$ (_context27) {
                  while (1) {
                    switch (_context27.prev = _context27.next) {
                      case 0:
                        element = _step33.value
                        id = element

                        if (!(website === 'giveawaysu' && toFinalUrl[element])) {
                          _context27.next = 11
                          break
                        }

                        toFinalUrlElement = toFinalUrl[element] || ''
                        _context27.t0 = type
                        _context27.next = _context27.t0 === 'follow' ? 7 : _context27.t0 === 'retweet' ? 9 : 11
                        break

                      case 7:
                        id = (_toFinalUrlElement$ma4 = toFinalUrlElement.match(/https:\/\/twitter.com\/(.+)/)) === null || _toFinalUrlElement$ma4 === void 0 ? void 0 : _toFinalUrlElement$ma4[1]
                        return _context27.abrupt('break', 11)

                      case 9:
                        id = (_toFinalUrlElement$ma5 = toFinalUrlElement.match(/https:\/\/twitter.com\/.*?\/status\/([\d]+)/)) === null || _toFinalUrlElement$ma5 === void 0 ? void 0 : _toFinalUrlElement$ma5[1]
                        return _context27.abrupt('break', 11)

                      case 11:
                        _context27.t1 = type
                        _context27.next = _context27.t1 === 'follow' ? 14 : _context27.t1 === 'retweet' ? 17 : 20
                        break

                      case 14:
                        _context27.next = 16
                        return new Promise(function (resolve) {
                          toggleTwitterUser(resolve, id, action === 'fuck')
                        })

                      case 16:
                        return _context27.abrupt('break', 20)

                      case 17:
                        _context27.next = 19
                        return new Promise(function (resolve) {
                          toggleRetweet(resolve, id, action === 'fuck')
                        })

                      case 19:
                        return _context27.abrupt('break', 20)

                      case 20:
                      case 'end':
                        return _context27.stop()
                    }
                  }
                }, _loop18)
              })

              _iterator32.s()

            case 8:
              if ((_step33 = _iterator32.n()).done) {
                _context28.next = 12
                break
              }

              return _context28.delegateYield(_loop18(), 't0', 10)

            case 10:
              _context28.next = 8
              break

            case 12:
              _context28.next = 17
              break

            case 14:
              _context28.prev = 14
              _context28.t1 = _context28.catch(5)

              _iterator32.e(_context28.t1)

            case 17:
              _context28.prev = 17

              _iterator32.f()

              return _context28.finish(17)

            case 20:
              resolve()

            case 21:
            case 'end':
              return _context28.stop()
          }
        }
      }, _callee24, null, [[5, 14, 17, 20]])
    }))
    return _toggleTwitterActions.apply(this, arguments)
  }

  function toggleActions (e) {
    switch (e.social) {
      case 'discord':
        toggleDiscordActions(e)
        break

      case 'ins':
        toggleInsActions(e)
        break

      case 'twitter':
        toggleTwitterActions(e)
        break

      case 'twitch':
        toggleTwitchActions(e)
        break

      default:
        toggleSteamActions(e)
    }
  }

  function getDiscordAuth () {
    if (typeof discordAuth === 'string') {
      GM_setValue('discordInfo', {
        authorization: discordAuth.replace(/"/g, ''),
        expired: false,
        updateTime: new Date().getTime()
      })
      $('body').overhang({
        type: 'success',
        activity: 'notification',
        message: getI18n('getAuthSuccess')
      })
    } else {
      $('body').overhang({
        type: 'error',
        activity: 'notification',
        message: getI18n('getAuthError')
      })
    }
  }

  var fuc = {
    httpRequest: httpRequest,
    updateSteamInfo: updateSteamInfo,
    getFinalUrl: getFinalUrl,
    visitLink: visitLink,
    echoLog: echoLog,
    toggleLogs: toggleLogs,
    unique: unique,
    getUrlQuery: getUrlQuery,
    dateFormat: dateFormat,
    isEmptyObjArr: isEmptyObjArr,
    toggleActions: toggleActions,
    getDiscordAuth: getDiscordAuth,
    updateTwitchInfo: updateTwitchInfo,
    clearTaskInfo: clearTaskInfo,
    uniqueTaskInfo: uniqueTaskInfo,
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
        url: 'https://auto-task-test.hclonely.com/version.json?t=' + new Date().getTime(),
        method: 'get',
        dataType: 'json',
        onload: function onload (response) {
          var _response$response13, _response$response14

          if (debug) console.log(response)

          if (((_response$response13 = response.response) === null || _response$response13 === void 0 ? void 0 : _response$response13.version) === GM_info.script.version) {
            if (s) status.success(getI18n('thisIsNew'))
          } else if ((_response$response14 = response.response) === null || _response$response14 === void 0 ? void 0 : _response$response14.version) {
            echoLog({
              type: 'custom',
              text: '<li>'.concat(getI18n('newVer') + 'V' + response.response.version, '<a href="https://github.com/HCLonely/auto-task/raw/master/auto-task-test.user.js" target="_blank">').concat(getI18n('updateNow'), '</a><font></font></li>')
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
    }
  }
  var banana = {
    test: function test () {
      return window.location.host.includes('grabfreegame') || window.location.host.includes('bananagiveaway')
    },
    fuck: function fuck () {
      var _this = this

      var _ref9 = [$("p:contains('Collect'):contains('banana')"), $("p:contains('Collect'):contains('point')")]
      var needBanana = _ref9[0]
      var needPoints = _ref9[1]
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
            _this.get_tasks('do_task')
          }
        })
      } else {
        this.get_tasks('do_task')
      }
    },
    get_tasks: function get_tasks () {
      var _this2 = this

      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'do_task'
      var taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
      if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory

      if (callback === 'remove' && taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
        this.remove(true)
      } else {
        this.currentTaskInfo = fuc.clearTaskInfo(this.currentTaskInfo)
        var _ref10 = [fuc.echoLog({
          type: 'custom',
          text: '<li>'.concat(getI18n('processTasksInfo'), '<font></font></li>')
        }), $('ul.tasks li:not(:contains(Completed))'), []]
        var status = _ref10[0]
        var tasksUl = _ref10[1]
        var pro = _ref10[2]

        var _iterator2 = _createForOfIteratorHelper(tasksUl)
        var _step2

        try {
          var _loop2 = function _loop2 () {
            var task = _step2.value
            // 遍历任务信息
            var _ref11 = [$(task).find('p'), $(task).find('button:contains(Verify)')]
            var taskDes = _ref11[0]
            var verifyBtn = _ref11[1]
            var taskId = verifyBtn.length > 0 ? verifyBtn.attr('onclick').match(/\?verify=([\d]+)/) : ''

            if (taskId) {
              _this2.currentTaskInfo.tasks.push({
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
                        _this2.currentTaskInfo.groups.push(groupName[1])

                        _this2.taskInfo.groups.push(groupName[1])
                      } else {
                        _this2.currentTaskInfo.taskIds.push(taskId[1])
                      }
                    } else {
                      _this2.currentTaskInfo.taskIds.push(taskId[1])
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
                        _this2.currentTaskInfo.curators.push(curatorId[1])

                        _this2.currentTaskInfo.taskInfo.curators.push(curatorId[1])
                      } else {
                        _this2.currentTaskInfo.taskIds.push(taskId[1])
                      }
                    } else {
                      _this2.currentTaskInfo.taskIds.push(taskId[1])
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
                        _this2.currentTaskInfo.wishlists.push(appId[1])

                        _this2.currentTaskInfo.taskInfo.wishlists.push(appId[1])
                      } else {
                        _this2.currentTaskInfo.taskIds.push(taskId[1])
                      }
                    } else {
                      _this2.currentTaskInfo.taskIds.push(taskId[1])
                    }

                    res(1)
                  })
                }))
              } else {
                if (/(Subscribe.*channel)|(Retweet)|(Twitter)/gim.test(taskDes.text())) {
                  if (!_this2.verifyBtn) _this2.verifyBtn = taskDes.parent().find('button:contains(Verify)')

                  if (callback === 'do_task' && globalConf.other.autoOpen) {
                    taskDes.parent().find('button')[0].click()
                  }
                }

                pro.push(new Promise(function (resolve) {
                  _this2.currentTaskInfo.links.push(window.location.origin + window.location.pathname + '?q=' + taskId[1])

                  _this2.currentTaskInfo.taskIds.push(taskId[1])

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
          _this2.currentTaskInfo = fuc.uniqueTaskInfo(_this2.currentTaskInfo)
          _this2.taskInfo = fuc.uniqueTaskInfo(_this2.taskInfo)
          GM_setValue('taskInfo[' + window.location.host + _this2.get_giveawayId() + ']', _this2.taskInfo)
          status.success()
          if (debug) console.log(_this2)

          if (callback === 'do_task') {
            _this2.do_task()
          } else if (callback === 'verify') {
            _this2.currentTaskInfo.tasks.length > 0 ? _this2.verify(true) : fuc.echoLog({
              type: 'custom',
              text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
            })
          } else {
            !fuc.isEmptyObjArr(_this2.taskInfo) ? _this2.remove(true) : fuc.echoLog({
              type: 'custom',
              text: '<li><font class="warning">'.concat(getI18n('cannotRemove'), '</font></li>')
            })
          }
        })
      }
    },
    do_task: function do_task () {
      var _this3 = this

      this.updateSteamInfo(/* #__PURE__ */_asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee () {
        var _ref13, pro, links, _iterator3, _step3, _loop3

        return regeneratorRuntime.wrap(function _callee$ (_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _ref13 = [[], fuc.unique(_this3.currentTaskInfo.links)], pro = _ref13[0], links = _ref13[1]
                _context.next = 3
                return _this3.toggleActions('fuck', pro)

              case 3:
                if (_this3.conf.fuck.visitLink) {
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
                  if (_this3.conf.fuck.verifyTask) _this3.verify()
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
      var _this4 = this

      var verify = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false

      if (verify) {
        var _pro = []

        var _iterator4 = _createForOfIteratorHelper(fuc.unique(this.currentTaskInfo.tasks))
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
          _this4.verifyBtn.length > 0 ? _this4.verifyBtn.removeAttr('disabled')[0].click() : window.location.reload(true)
        })
      } else {
        this.get_tasks('verify')
      }
    },
    remove: function remove () {
      var _this5 = this

      var remove = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false
      var pro = []

      if (remove) {
        this.updateSteamInfo(/* #__PURE__ */_asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee2 () {
          return regeneratorRuntime.wrap(function _callee2$ (_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2
                  return _this5.toggleActions('remove', pro)

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
      var _ref15 = action === 'fuck' ? this.currentTaskInfo : this.taskInfo
      var groups = _ref15.groups
      var curators = _ref15.curators
      var wishlists = _ref15.wishlists
      var fGames = _ref15.fGames

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
      var _this6 = this

      new Promise(function (resolve) {
        if (_this6.taskInfo.groups.length > 0) {
          if (_this6.taskInfo.curators.length > 0 || _this6.taskInfo.fGames.length > 0 || _this6.taskInfo.wishlists.length > 0) {
            fuc.updateSteamInfo(resolve, 'all')
          } else {
            fuc.updateSteamInfo(resolve, 'community')
          }
        } else if (_this6.taskInfo.curators.length > 0 || _this6.taskInfo.fGames.length > 0 || _this6.taskInfo.wishlists.length > 0) {
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
    currentTaskInfo: {
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
      tasks: [] // 所有任务ID

    },
    taskInfo: {
      groups: [],
      // 任务需要加的组
      curators: [],
      // 任务需要关注的鉴赏家
      wishlists: [],
      // 任务需要添加愿望单的游戏
      fGames: [] // 任务需要关注的的游戏

    },
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
            $('body').overhang({
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
          $('body').overhang({
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
      var _this7 = this

      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'do_task'
      var _ref16 = [fuc.echoLog({
        type: 'custom',
        text: '<li>'.concat(getI18n('getTasksInfo'), '<font></font></li>')
      }), $('button[data-id]')]
      var status = _ref16[0]
      var verifyBtns = _ref16[1]

      if (callback === 'do_task') {
        this.currentTaskInfo = fuc.clearTaskInfo(this.currentTaskInfo)
        var _pro2 = []
        var taskInfo = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
        if (taskInfo && !fuc.isEmptyObjArr(taskInfo)) this.taskInfo = taskInfo

        var _iterator5 = _createForOfIteratorHelper(verifyBtns)
        var _step5

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var btn = _step5.value
            var _ref18 = [$(btn).attr('data-id'), $(btn).parent().prev().text()]
            var _taskId = _ref18[0]
            var _taskDes = _ref18[1]

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
                          _this7.currentTaskInfo.groups.push(groupName[1])

                          _this7.taskInfo.groups.push(groupName[1])
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

              this.currentTaskInfo.tasks.push({
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
          this.currentTaskInfo.tasks.push({
            taskId: taskId,
            taskDes: taskDes
          })
        }

        Promise.all(_pro2).finally(function () {
          _this7.currentTaskInfo = fuc.uniqueTaskInfo(_this7.currentTaskInfo)
          _this7.taskInfo = fuc.uniqueTaskInfo(_this7.taskInfo)
          status.success()
          GM_setValue('taskInfo[' + window.location.host + _this7.get_giveawayId() + ']', _this7.taskInfo)

          if (_this7.currentTaskInfo.tasks.length > 0) {
            _this7.do_task()
          } else {
            fuc.echoLog({
              type: 'custom',
              text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
            })
            if (_this7.conf.fuck.verifyTask) _this7.verify()
          }
        })
      } else if (callback === 'verify') {
        this.currentTaskInfo.tasks = []

        var _iterator6 = _createForOfIteratorHelper(verifyBtns)
        var _step6

        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var _btn = _step6.value
            var _ref19 = [$(_btn).attr('data-id'), $(_btn).parent().prev().text()]
            var _taskId2 = _ref19[0]
            var _taskDes2 = _ref19[1]
            if ($(_btn).parents('.task-content').next().text().includes('+1')) {
              this.currentTaskInfo.tasks.push({
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

        this.currentTaskInfo.tasks = fuc.unique(this.currentTaskInfo.tasks)

        if (this.currentTaskInfo.tasks.length > 0) {
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
      var _this8 = this

      return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee4 () {
        var _ref20, pro, tasks, _loop5, i

        return regeneratorRuntime.wrap(function _callee4$ (_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _ref20 = [[], fuc.unique(_this8.currentTaskInfo.tasks)], pro = _ref20[0], tasks = _ref20[1]
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
                  _this8.updateSteamInfo(/* #__PURE__ */_asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee3 () {
                    var pro
                    return regeneratorRuntime.wrap(function _callee3$ (_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            pro = []
                            _context3.next = 3
                            return _this8.toggleActions('fuck', pro)

                          case 3:
                            Promise.all(pro).finally(function () {
                              fuc.echoLog({
                                type: 'custom',
                                text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                              })
                              if (_this8.conf.fuck.verifyTask) _this8.verify()
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
      var _this9 = this

      return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee5 () {
        var verify, _ref22, _pro3, tasks, _loop6, i

        return regeneratorRuntime.wrap(function _callee5$ (_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                verify = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : false

                if (!verify) {
                  _context7.next = 13
                  break
                }

                _ref22 = [[], fuc.unique(_this9.currentTaskInfo.tasks)], _pro3 = _ref22[0], tasks = _ref22[1]
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
                _this9.get_tasks('verify')

              case 14:
              case 'end':
                return _context7.stop()
            }
          }
        }, _callee5)
      }))()
    },
    remove: function remove () {
      var _this10 = this

      var remove = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false

      if (this.conf.remove.leaveSteamGroup && this.currentTaskInfo.groups.length > 0) {
        this.updateSteamInfo(/* #__PURE__ */_asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee6 () {
          var pro
          return regeneratorRuntime.wrap(function _callee6$ (_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  pro = []
                  _context8.next = 3
                  return _this10.toggleActions('remove', pro)

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
      var groups = action === 'fuck' ? this.currentTaskInfo.groups : this.taskInfo.groups

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
      var _this11 = this

      new Promise(function (resolve) {
        if (_this11.taskInfo.groups.length > 0) {
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
    currentTaskInfo: {
      groups: [],
      // 任务需要加的组
      tasks: [] // 任务信息

    },
    taskInfo: {
      groups: [] // 所有任务需要加的组

    },
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
        var _ref24 = [fuc.echoLog({
          type: 'custom',
          text: '<li>'.concat(getI18n('getTasksInfo'), '<font></font></li>')
        }), $('#actions tr')]
        var status = _ref24[0]
        var tasks = _ref24[1]

        var _iterator7 = _createForOfIteratorHelper(tasks)
        var _step7

        try {
          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            var task = _step7.value
            var colorfulTask = $(task).find('td').eq(1).find('a:not([data-trigger="link"])')
            var colorlessTask = $(task).find('td').eq(2).find('a:not([data-trigger="link"])')
            var taskDes = colorfulTask.length > 0 ? colorfulTask : colorlessTask

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
      var _ref25 = [[], taskDes.text().trim(), taskDes.attr('href')]
      var taskInfo = _ref25[0]
      var taskName = _ref25[1]
      var link = _ref25[2]

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
      } else if (/join.*discord/gim.test(taskName)) {
        taskInfo.push({
          name: 'discord',
          link: link
        })
      } else if (/follow.*instagram/gim.test(taskName)) {
        taskInfo.push({
          name: 'instagram',
          link: link
        })
      } else {
        if (/(Subscribe.*YouTube)|(Like.*YouTube)|(on twitter)|(Follow.*on.*Facebook)/gim.test(taskName)) {
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
      var _this12 = this

      // 处理任务链接
      var _ref26 = [fuc.echoLog({
        type: 'custom',
        text: '<li>'.concat(getI18n('processTasksUrl'), '<font></font></li>')
      }), []]
      var status = _ref26[0]
      var pro = _ref26[1]

      var _iterator9 = _createForOfIteratorHelper(this.taskInfo.links)
      var _step9

      try {
        var _loop7 = function _loop7 () {
          var link = _step9.value
          pro.push(new Promise(function (resolve) {
            if (_this12.taskInfo.toFinalUrl[link]) {
              resolve({
                result: 'success'
              })
            } else {
              fuc.getFinalUrl(resolve, link, {
                onload: function onload (response) {
                  if (response.finalUrl.includes('newshub/app')) {
                    var _response$responseTex3

                    var div = (_response$responseTex3 = response.responseText.match(/<div id="application_config"[\w\W]*?>/)) === null || _response$responseTex3 === void 0 ? void 0 : _response$responseTex3[0]

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
              _this12.taskInfo.toFinalUrl[r.url] = r.finalUrl
            }
          }
        } catch (err) {
          _iterator10.e(err)
        } finally {
          _iterator10.f()
        }

        _this12.links = fuc.unique(_this12.links)
        _this12.taskInfo = fuc.uniqueTaskInfo(_this12.taskInfo) // 任务链接处理完成

        GM_setValue('taskInfo[' + window.location.host + _this12.get_giveawayId() + ']', _this12.taskInfo)
        status.success()
        if (debug) console.log(_this12)
        e === 'doTask' ? _this12.do_task('fuck') : _this12.do_task('remove')
      }).catch(function (error) {
        status.error()
        if (debug) console.log(error)
      })
    },
    do_task: function do_task (act) {
      var _this13 = this

      return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee7 () {
        var pro
        return regeneratorRuntime.wrap(function _callee7$ (_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:

                if ($('div.bind-discord').is(':visible')) $('div.bind-discord a')[0].click()
                if ($('div.bind-twitch').is(':visible')) $('div.bind-twitch a')[0].click()
                pro = []
                _context9.next = 5
                return new Promise(function (resolve) {
                  if (_this13.taskInfo.groups.length > 0 || _this13.taskInfo.announcements.length > 0) {
                    if (_this13.taskInfo.curators.length > 0 || _this13.taskInfo.publishers.length > 0 || _this13.taskInfo.developers.length > 0 || _this13.taskInfo.fGames.length > 0 || _this13.taskInfo.wGames.length > 0) {
                      fuc.updateSteamInfo(resolve, 'all')
                    } else {
                      fuc.updateSteamInfo(resolve, 'community')
                    }
                  } else if (_this13.taskInfo.curators.length > 0 || _this13.taskInfo.publishers.length > 0 || _this13.taskInfo.developers.length > 0 || _this13.taskInfo.fGames.length > 0 || _this13.taskInfo.wGames.length > 0) {
                    fuc.updateSteamInfo(resolve, 'store')
                  } else {
                    resolve(1)
                  }
                }).then(function (s) {
                  if (s === 1) {
                    if (_this13.conf[act][act === 'fuck' ? 'joinSteamGroup' : 'leaveSteamGroup'] && _this13.taskInfo.groups.length > 0) {
                      pro.push(new Promise(function (resolve) {
                        fuc.toggleActions({
                          website: 'giveawaysu',
                          type: 'group',
                          elements: _this13.taskInfo.groups,
                          resolve: resolve,
                          action: act,
                          toFinalUrl: _this13.taskInfo.toFinalUrl
                        })
                      }))
                    }

                    if (_this13.conf[act][act === 'fuck' ? 'followCurator' : 'unfollowCurator'] && _this13.taskInfo.curators.length > 0) {
                      pro.push(new Promise(function (resolve) {
                        fuc.toggleActions({
                          website: 'giveawaysu',
                          type: 'curator',
                          elements: _this13.taskInfo.curators,
                          resolve: resolve,
                          action: act,
                          toFinalUrl: _this13.taskInfo.toFinalUrl
                        })
                      }))
                    }

                    if (_this13.conf[act][act === 'fuck' ? 'followPublisher' : 'unfollowPublisher'] && _this13.taskInfo.publishers.length > 0) {
                      pro.push(new Promise(function (resolve) {
                        fuc.toggleActions({
                          website: 'giveawaysu',
                          type: 'publisher',
                          elements: _this13.taskInfo.publishers,
                          resolve: resolve,
                          action: act,
                          toFinalUrl: _this13.taskInfo.toFinalUrl
                        })
                      }))
                    }

                    if (_this13.conf[act][act === 'fuck' ? 'followDeveloper' : 'unfollowDeveloper'] && _this13.taskInfo.developers.length > 0) {
                      pro.push(new Promise(function (resolve) {
                        fuc.toggleActions({
                          website: 'giveawaysu',
                          type: 'developer',
                          elements: _this13.taskInfo.developers,
                          resolve: resolve,
                          action: act,
                          toFinalUrl: _this13.taskInfo.toFinalUrl
                        })
                      }))
                    }

                    if (_this13.conf[act][act === 'fuck' ? 'followFranchise' : 'unfollowFranchise'] && _this13.taskInfo.franchises.length > 0) {
                      pro.push(new Promise(function (resolve) {
                        fuc.toggleActions({
                          website: 'giveawaysu',
                          type: 'franchise',
                          elements: _this13.taskInfo.franchises,
                          resolve: resolve,
                          action: act,
                          toFinalUrl: _this13.taskInfo.toFinalUrl
                        })
                      }))
                    }

                    if (_this13.conf[act][act === 'fuck' ? 'followGame' : 'unfollowGame'] && _this13.taskInfo.fGames.length > 0) {
                      pro.push(new Promise(function (resolve) {
                        fuc.toggleActions({
                          website: 'giveawaysu',
                          type: 'game',
                          elements: _this13.taskInfo.fGames,
                          resolve: resolve,
                          action: act,
                          toFinalUrl: _this13.taskInfo.toFinalUrl
                        })
                      }))
                    }

                    if (_this13.conf[act][act === 'fuck' ? 'addToWishlist' : 'removeFromWishlist'] && _this13.taskInfo.wGames.length > 0) {
                      pro.push(new Promise(function (resolve) {
                        fuc.toggleActions({
                          website: 'giveawaysu',
                          type: 'wishlist',
                          elements: _this13.taskInfo.wGames,
                          resolve: resolve,
                          action: act,
                          toFinalUrl: _this13.taskInfo.toFinalUrl
                        })
                      }))
                    }

                    if (act === 'fuck' && _this13.conf.fuck.likeAnnouncement && _this13.taskInfo.announcements.length > 0) {
                      pro.push(new Promise(function (resolve) {
                        fuc.toggleActions({
                          website: 'giveawaysu',
                          type: 'announcement',
                          elements: _this13.taskInfo.announcements,
                          resolve: resolve,
                          action: act,
                          toFinalUrl: _this13.taskInfo.toFinalUrl
                        })
                      }))
                    }
                  }
                })

              case 5:
                if (_this13.conf[act][act === 'fuck' ? 'joinDiscordServer' : 'leaveDiscordServer'] && _this13.taskInfo.discords.length > 0) {
                  pro.push(new Promise(function (resolve) {
                    fuc.toggleActions({
                      social: 'discord',
                      website: 'giveawaysu',
                      elements: _this13.taskInfo.discords,
                      resolve: resolve,
                      action: act,
                      toFinalUrl: _this13.taskInfo.toFinalUrl,
                      toGuild: _this13.taskInfo.toGuild
                    })
                  }).then(function (data) {
                    if (act === 'fuck') {
                      var _iterator11 = _createForOfIteratorHelper(data)
                      var _step11

                      try {
                        for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
                          var e = _step11.value

                          var _ref27 = e.guild || [null, null]
                          var _ref28 = _slicedToArray(_ref27, 2)
                          var inviteId = _ref28[0]
                          var guild = _ref28[1]

                          _this13.taskInfo.toGuild[inviteId] = guild
                        }
                      } catch (err) {
                        _iterator11.e(err)
                      } finally {
                        _iterator11.f()
                      }

                      GM_setValue('taskInfo[' + window.location.host + _this13.get_giveawayId() + ']', _this13.taskInfo)
                    }
                  }))
                }

                if (_this13.conf[act][act === 'fuck' ? 'followIns' : 'unfollowIns'] && _this13.taskInfo.instagrams.length > 0) {
                  pro.push(new Promise(function (resolve) {
                    fuc.toggleActions({
                      social: 'ins',
                      website: 'giveawaysu',
                      elements: _this13.taskInfo.instagrams,
                      resolve: resolve,
                      action: act,
                      toFinalUrl: _this13.taskInfo.toFinalUrl
                    })
                  }))
                }

                Promise.all(pro).finally(function () {
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

              case 8:
              case 'end':
                return _context9.stop()
            }
          }
        }, _callee7)
      }))()
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
      discords: [],
      // 任务需要加入的discord服务器
      instagrams: [],
      // 任务需要加入的instagram服务器
      links: [],
      // 原始链接
      toFinalUrl: {},
      // 链接转换
      toGuild: {} // discord 邀请链接转id

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

        var _iterator12 = _createForOfIteratorHelper(tasksContainer)
        var _step12

        try {
          for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
            var task = _step12.value

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
          _iterator12.e(err)
        } finally {
          _iterator12.f()
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
      var _this14 = this

      this.updateSteamInfo(function () {
        var _ref32 = [[], fuc.unique(_this14.twitters), fuc.unique(_this14.discords), fuc.unique(_this14.facebooks), fuc.unique(_this14.youtubes), fuc.unique(_this14.others), fuc.unique(_this14.links)]
        var pro = _ref32[0]
        var twitters = _ref32[1]
        var discords = _ref32[2]
        var facebooks = _ref32[3]
        var youtubes = _ref32[4]
        var others = _ref32[5]
        var links = _ref32[6]
        var socals = [].concat(_toConsumableArray(discords), _toConsumableArray(facebooks), _toConsumableArray(youtubes))

        if (_this14.conf.fuck.joinSteamGroup && _this14.groups.length > 0) {
          pro.push(new Promise(function (resolve) {
            fuc.toggleActions({
              website: 'gleam',
              type: 'group',
              elements: _this14.groups,
              resolve: resolve,
              action: 'fuck'
            })
          }))
        }

        if (globalConf.other.autoOpen) {
          if (twitters.length > 0) {
            var _iterator13 = _createForOfIteratorHelper(twitters)
            var _step13

            try {
              for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
                var twitter = _step13.value
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
              _iterator13.e(err)
            } finally {
              _iterator13.f()
            }
          }

          if (socals.length > 0) {
            var _iterator14 = _createForOfIteratorHelper(socals)
            var _step14

            try {
              for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
                var task = _step14.value

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
              _iterator14.e(err)
            } finally {
              _iterator14.f()
            }
          }
        }

        if ((globalConf.other.autoOpen || _this14.conf.fuck.visit) && links.length > 0) {
          pro.push(new Promise(function (resolve) {
            _this14.visit_link(links, 0, resolve)
          }))
        }

        var _iterator15 = _createForOfIteratorHelper(others)
        var _step15

        try {
          for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
            var other = _step15.value
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
          _iterator15.e(err)
        } finally {
          _iterator15.f()
        }

        Promise.all(pro).finally(function () {
          fuc.echoLog({
            type: 'custom',
            text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
          })
          if (_this14.conf.fuck.verifyTask) _this14.verify(0)
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
      var _this15 = this

      var remove = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false
      var pro = []

      if (remove) {
        this.updateSteamInfo(function () {
          if (_this15.conf.remove.leaveSteamGroup && _this15.taskInfo.groups.length > 0) {
            pro.push(new Promise(function (resolve) {
              fuc.toggleActions({
                website: 'gleam',
                type: 'group',
                elements: _this15.taskInfo.groups,
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
      var _this16 = this

      new Promise(function (resolve) {
        if (_this16.taskInfo.groups.length > 0) {
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
              var _response$response15

              if ((_response$response15 = response.response) === null || _response$response15 === void 0 ? void 0 : _response$response15.success) {
                var _response$response16, _response$response17

                currentoption.addClass('buttonentered').text('Success - Giveaway joined')
                $('#giveawaysjoined').slideDown()
                $('#giveawaysrecommend').slideDown()
                status.success('Success' + (((_response$response16 = response.response) === null || _response$response16 === void 0 ? void 0 : _response$response16.text) ? ':' + ((_response$response17 = response.response) === null || _response$response17 === void 0 ? void 0 : _response$response17.text) : ''))
                doTask()
              } else {
                var _response$response18, _response$response19

                status.error('Error' + (((_response$response18 = response.response) === null || _response$response18 === void 0 ? void 0 : _response$response18.text) ? ':' + ((_response$response19 = response.response) === null || _response$response19 === void 0 ? void 0 : _response$response19.text) : ''))
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
        var _pro4 = _ref37[1]

        var _iterator16 = _createForOfIteratorHelper(tasks)
        var _step16

        try {
          var _loop8 = function _loop8 () {
            var task = _step16.value
            var promo = $(task)

            if (!promo.hasClass('buttonentered')) {
              var status = fuc.echoLog({
                type: 'custom',
                text: '<li>'.concat(getI18n('doing'), ':').concat(promo.parents('p').text(), '...<font></font></li>')
              })

              if (/facebookpromo|twitterpromo|visitpromo/gim.test(task.className)) {
                _pro4.push(new Promise(function (resolve) {
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
                _pro4.push(new Promise(function (resolve) {
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
                _pro4.push(new Promise(function (resolve) {
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
                _pro4.push(new Promise(function (resolve) {
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

          for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
            _loop8()
          }
        } catch (err) {
          _iterator16.e(err)
        } finally {
          _iterator16.f()
        }

        Promise.all(_pro4).finally(function () {
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
      return window.location.host.includes('marvelousga')
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
        this.currentTaskInfo = fuc.clearTaskInfo(this.currentTaskInfo)
        var _ref38 = [fuc.echoLog({
          type: 'custom',
          text: '<li>'.concat(getI18n('getTasksInfo'), '<font></font></li>')
        }), $('.container_task')]
        var status = _ref38[0]
        var tasksContainer = _ref38[1]

        var _iterator17 = _createForOfIteratorHelper(tasksContainer)
        var _step17

        try {
          for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
            var task = _step17.value
            // 遍历任务信息
            var _ref39 = [$(task).find('.card-body p.card-text.monospace'), $(task).find('button[id^=task_]:not(:contains(VERIFIED))')]
            var taskDes = _ref39[0]
            var verifyBtn = _ref39[1]

            if (/join[\w\W]*?steamcommunity.com\/groups/gim.test(taskDes.html())) {
              // 加组任务
              var groupName = taskDes.find('a[href*="steamcommunity.com/groups"]').attr('href').match(/steamcommunity.com\/groups\/([\w\d\-_]*)/)[1]

              if (verifyBtn.length > 0) {
                this.currentTaskInfo.groups.push(groupName)
              }

              this.taskInfo.groups.push(groupName)
            }

            if (/follow[\w\W]*?store.steampowered.com\/curator/gim.test(taskDes.html())) {
              // 关注鉴赏家任务
              var curatorName = taskDes.find('a[href*="store.steampowered.com/curator"]').attr('href').match(/store.steampowered.com\/curator\/([\d]*)/)[1]

              if (verifyBtn.length > 0) {
                this.currentTaskInfo.curators.push(curatorName)
              }

              this.taskInfo.curators.push(curatorName)
            }

            if (/follow[\w\W]*?https?:\/\/twitter.com\//gim.test(taskDes.html())) {
              var _taskDes$find$attr$ma

              // 关注twitter
              var name = (_taskDes$find$attr$ma = taskDes.find('a[href*="twitter.com"]').attr('href').match(/twitter.com\/([^/]+)/)) === null || _taskDes$find$attr$ma === void 0 ? void 0 : _taskDes$find$attr$ma[1]

              if (name) {
                if (verifyBtn.length > 0) {
                  this.currentTaskInfo.twitterUsers.push(name)
                }

                this.taskInfo.twitterUsers.push(name)
              }
            }

            if (/visit.*?this.*?page/gim.test(taskDes.text()) && verifyBtn.length > 0) {
              // 浏览页面任务
              var pageUrl = taskDes.find('a[id^="task_webpage_clickedLink"]').attr('href')
              this.currentTaskInfo.links.push({
                pageUrl: pageUrl,
                taskId: verifyBtn.attr('id').split('_')[3]
              })
            }

            if (verifyBtn.length > 0) {
              // 任务验证信息
              var ids = verifyBtn.attr('id').split('_')

              var _ids = _slicedToArray(ids, 4)
              var provider = _ids[1]
              var taskRoute = _ids[2]
              var taskId = _ids[3]

              this.currentTaskInfo.tasks.push({
                provider: provider,
                taskRoute: taskRoute,
                taskId: taskId,
                taskDes: taskDes.html()
              })
            }
          }
        } catch (err) {
          _iterator17.e(err)
        } finally {
          _iterator17.f()
        }

        this.currentTaskInfo = fuc.uniqueTaskInfo(this.currentTaskInfo)
        this.taskInfo = fuc.uniqueTaskInfo(this.taskInfo)
        GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
        status.success()
        if (debug) console.log(this)

        if (callback === 'do_task') {
          if (this.currentTaskInfo.tasks.length === 0) {
            fuc.echoLog({
              type: 'custom',
              text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
            })
            if (this.conf.fuck.verifyTask) this.verify()
          } else {
            this.do_task()
          }
        } else if (callback === 'verify') {
          this.currentTaskInfo.tasks.length > 0 ? this.verify(true) : fuc.echoLog({
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
      var _this17 = this

      this.updateSteamInfo(/* #__PURE__ */_asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee8 () {
        var _ref41, pro, links, _iterator18, _step18, _loop9

        return regeneratorRuntime.wrap(function _callee8$ (_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _ref41 = [[], fuc.unique(_this17.currentTaskInfo.links)], pro = _ref41[0], links = _ref41[1]
                _context10.next = 3
                return _this17.toggleActions('fuck', pro)

              case 3:
                if (_this17.conf.fuck.visitLink) {
                  _iterator18 = _createForOfIteratorHelper(links)

                  try {
                    _loop9 = function _loop9 () {
                      var link = _step18.value
                      pro.push(new Promise(function (resolve) {
                        fuc.visitLink(resolve, link.pageUrl, {
                          url: '/ajax/verifyTasks/webpage/clickedLink',
                          method: 'POST',
                          headers: {
                            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'x-csrf-token': $('meta[name="csrf-token"]').attr('content')
                          },
                          data: $.param({
                            giveaway_slug: _this17.get_giveawayId(),
                            giveaway_task_id: link.taskId
                          })
                        })
                      }))
                    }

                    for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
                      _loop9()
                    }
                  } catch (err) {
                    _iterator18.e(err)
                  } finally {
                    _iterator18.f()
                  }
                }

                Promise.all(pro).finally(function () {
                  fuc.echoLog({
                    type: 'custom',
                    text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                  })
                  if (_this17.conf.fuck.verifyTask) _this17.verify()
                })

              case 5:
              case 'end':
                return _context10.stop()
            }
          }
        }, _callee8)
      })))
    },
    verify: function verify () {
      var _this18 = this

      var verify = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false

      if (verify) {
        var _pro5 = []

        var _iterator19 = _createForOfIteratorHelper(fuc.unique(this.currentTaskInfo.tasks))
        var _step19

        try {
          var _loop10 = function _loop10 () {
            var task = _step19.value
            var status = fuc.echoLog({
              type: 'custom',
              text: '<li>'.concat(getI18n('verifyingTask')).concat(task.taskDes, '...<font></font></li>')
            })

            _pro5.push(new Promise(function (resolve) {
              fuc.httpRequest({
                url: '/ajax/verifyTasks/' + task.provider + '/' + task.taskRoute,
                method: 'POST',
                dataType: 'json',
                headers: {
                  'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                  'x-csrf-token': $('meta[name="csrf-token"]').attr('content')
                },
                data: $.param({
                  giveaway_slug: _this18.get_giveawayId(),
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

          for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
            _loop10()
          }
        } catch (err) {
          _iterator19.e(err)
        } finally {
          _iterator19.f()
        }

        Promise.all(_pro5).finally(function () {
          fuc.echoLog({
            type: 'custom',
            text: '<li><font class="success">'.concat(getI18n('verifyTasksComplete'), '</font><font class="warning">').concat(getI18n('doYourself'), '<a class="hclonely-google" href="javascript:void(0)" target="_self">').concat(getI18n('googleVerify'), '</a>').concat(getI18n('getKey'), '!</font></li>')
          })
          $('#get_key_container').show()
          $('.hclonely-google').unbind().click(function () {
            $('#get_key_container')[0].scrollIntoView()
          })
        })
      } else {
        this.get_tasks('verify')
      }
    },
    remove: function remove () {
      var _this19 = this

      var remove = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false
      var pro = []

      if (remove) {
        this.updateSteamInfo(/* #__PURE__ */_asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee9 () {
          return regeneratorRuntime.wrap(function _callee9$ (_context11) {
            while (1) {
              switch (_context11.prev = _context11.next) {
                case 0:
                  _context11.next = 2
                  return _this19.toggleActions('remove', pro)

                case 2:
                  Promise.all(pro).finally(function () {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                    })
                  })

                case 3:
                case 'end':
                  return _context11.stop()
              }
            }
          }, _callee9)
        })))
      } else {
        this.get_tasks('remove')
      }
    },
    toggleActions: function toggleActions (action, pro) {
      var _ref43 = action === 'fuck' ? this.currentTaskInfo : this.taskInfo
      var groups = _ref43.groups
      var curators = _ref43.curators
      var twitterUsers = _ref43.twitterUsers

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

      if (this.conf[action][action === 'fuck' ? 'followTwitterUser' : 'unfollowTwitterUser'] && twitterUsers.length > 0) {
        pro.push(new Promise(function (resolve) {
          fuc.toggleActions({
            website: 'marvelousga',
            social: 'twitter',
            type: 'follow',
            elements: twitterUsers,
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
      var _this20 = this

      new Promise(function (resolve) {
        if (_this20.taskInfo.groups.length > 0) {
          if (_this20.taskInfo.curators.length > 0) {
            fuc.updateSteamInfo(resolve, 'all')
          } else {
            fuc.updateSteamInfo(resolve, 'community')
          }
        } else if (_this20.taskInfo.curators.length > 0) {
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
    currentTaskInfo: {
      groups: [],
      // 任务需要加的组
      curators: [],
      // 任务需要关注的鉴赏家
      twitterUsers: [],
      // 任务需要关注的twitter
      links: [],
      // 需要浏览的页面链接
      tasks: [] // 任务信息

    },
    taskInfo: {
      groups: [],
      // 所有任务需要加的组
      curators: [],
      // 所有任务需要关注的鉴赏家
      twitterUsers: [] // 任务需要关注的twitter

    },
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
      var _this21 = this

      return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee11 () {
        var type, _ref44, items, maxPoint, myPoint, i, item, needPoints

        return regeneratorRuntime.wrap(function _callee11$ (_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                type = _arguments2.length > 0 && _arguments2[0] !== undefined ? _arguments2[0] : 'FREE'
                _ref44 = [$(".giveaways-page-item:contains('".concat(type, "'):not(:contains('ENTERED'))")), _this21.maxPoint()], items = _ref44[0], maxPoint = _ref44[1]
                myPoint = _this21.myPoints
                i = 0

              case 4:
                if (!(i < items.length)) {
                  _context13.next = 20
                  break
                }

                item = items[i]
                needPoints = $(item).find('.giveaways-page-item-header-points').text().match(/[\d]+/gim)

                if (!(type === 'points' && needPoints && parseInt(needPoints[0]) > myPoint)) {
                  _context13.next = 11
                  break
                }

                fuc.echoLog({
                  type: 'custom',
                  text: '<li><font class="warning">'.concat(getI18n('noPoints'), '</font></li>')
                })
                _context13.next = 17
                break

              case 11:
                if (!(type === 'points' && !needPoints)) {
                  _context13.next = 15
                  break
                }

                fuc.echoLog({
                  type: 'custom',
                  text: '<li><font class="warning">'.concat(getI18n('getNeedPointsFailed'), '</font></li>')
                })
                _context13.next = 17
                break

              case 15:
                if (type === 'points' && parseInt(needPoints[0]) > maxPoint) {
                  _context13.next = 17
                  break
                }

                return _context13.delegateYield(/* #__PURE__ */regeneratorRuntime.mark(function _callee10 () {
                  var _ref45, status, a, giveawayId

                  return regeneratorRuntime.wrap(function _callee10$ (_context12) {
                    while (1) {
                      switch (_context12.prev = _context12.next) {
                        case 0:
                          _ref45 = [fuc.echoLog({
                            type: 'custom',
                            text: '<li>'.concat(getI18n('joinLottery'), '<a href="').concat($(item).find('a.giveaways-page-item-img-btn-more').attr('href'), '" target="_blank">').concat($(item).find('.giveaways-page-item-footer-name').text().trim(), '</a>...<font></font></li>')
                          }), $(item).find("a.giveaways-page-item-img-btn-enter:contains('enter')")], status = _ref45[0], a = _ref45[1]

                          if (a.attr('onclick') && a.attr('onclick').includes('checkUser')) {
                            giveawayId = a.attr('onclick').match(/[\d]+/)
                            if (giveawayId) checkUser(giveawayId[0])
                          }

                          _context12.next = 4
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
                          return _context12.stop()
                      }
                    }
                  }, _callee10)
                })(), 't0', 17)

              case 17:
                i++
                _context13.next = 4
                break

              case 20:
                fuc.echoLog({
                  type: 'custom',
                  text: '<li>-----END-----</li>'
                })

              case 21:
              case 'end':
                return _context13.stop()
            }
          }
        }, _callee11)
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
      var _this22 = this

      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'do_task'
      var _ref46 = [fuc.echoLog({
        type: 'custom',
        text: '<li>'.concat(getI18n('getTasksInfo'), '<font></font></li>')
      }), $('#steps tbody tr')]
      var status = _ref46[0]
      var steps = _ref46[1]

      for (var i = 0; i < steps.length; i++) {
        if (steps.eq(i).find('span:contains(Success)').length === 0) checkClick(i)
      }

      if (callback === 'do_task') {
        this.currentTaskInfo = fuc.clearTaskInfo(this.currentTaskInfo)
        var _ref47 = [GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']'), []]
        var taskInfoHistory = _ref47[0]
        var _pro6 = _ref47[1]
        if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory

        var _iterator20 = _createForOfIteratorHelper(steps)
        var _step20

        try {
          for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {
            var step = _step20.value

            if ($(step).find('span:contains(Success)').length === 0) {
              if ($(step).find("a[href*='store.steampowered.com/curator/']").length > 0) {
                var link = $(step).find("a[href*='store.steampowered.com/curator/']").attr('href')
                var curatorId = link.match(/curator\/([\d]+)/)

                if (curatorId) {
                  this.currentTaskInfo.curators.push(curatorId[1])
                  this.taskInfo.curators.push(curatorId[1])
                }
              } else if ($(step).find("a[href*='steampowered.com/groups/']").length > 0) {
                var _link = $(step).find("a[href*='steampowered.com/groups/']").attr('href')

                var groupName = _link.match(/groups\/(.+)\/?/)

                if (groupName) {
                  this.currentTaskInfo.groups.push(groupName[1])
                  this.taskInfo.groups.push(groupName[1])
                }
              } else if ($(step).find("a[href*='steamcommunity.com/gid']").length > 0) {
                (function () {
                  var link = $(step).find("a[href*='steamcommunity.com/gid']").attr('href')

                  _pro6.push(new Promise(function (r) {
                    new Promise(function (resolve) {
                      fuc.getFinalUrl(resolve, link)
                    }).then(function (data) {
                      if (data.result === 'success') {
                        var _groupName2 = data.finalUrl.match(/groups\/(.+)\/?/)

                        if (_groupName2) {
                          _this22.currentTaskInfo.groups.push(_groupName2[1])

                          _this22.taskInfo.groups.push(_groupName2[1])
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
          _iterator20.e(err)
        } finally {
          _iterator20.f()
        }

        if (_pro6.length > 0) {
          Promise.all(_pro6).finally(function () {
            _this22.currentTaskInfo = fuc.uniqueTaskInfo(_this22.currentTaskInfo)
            _this22.taskInfo = fuc.uniqueTaskInfo(_this22.taskInfo)
            GM_setValue('taskInfo[' + window.location.host + _this22.get_giveawayId() + ']', _this22.taskInfo)

            if (_this22.currentTaskInfo.groups.length > 0 || _this22.currentTaskInfo.curators.length > 0) {
              _this22.do_task()
            } else {
              fuc.echoLog({
                type: 'custom',
                text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
              })
              if (_this22.conf.fuck.verifyTask) _this22.verify()
            }
          })
        } else {
          this.currentTaskInfo = fuc.uniqueTaskInfo(this.currentTaskInfo)
          this.taskInfo = fuc.uniqueTaskInfo(this.taskInfo)
          GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)

          if (this.currentTaskInfo.groups.length > 0 || this.currentTaskInfo.curators.length > 0) {
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
        this.currentTaskInfo.tasks = []
        var checks = $('#steps tbody a[id^=check]')

        if (checks.length > 0) {
          var _iterator21 = _createForOfIteratorHelper(checks)
          var _step21

          try {
            for (_iterator21.s(); !(_step21 = _iterator21.n()).done;) {
              var check = _step21.value
              var id = $(check).attr('id').match(/[\d]+/)
              if (id) {
                this.currentTaskInfo.tasks.push({
                  id: id[0],
                  taskDes: $(check).parent().prev().html().trim()
                })
              }
            }
          } catch (err) {
            _iterator21.e(err)
          } finally {
            _iterator21.f()
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
          var _pro7 = []

          var _iterator22 = _createForOfIteratorHelper(steps)
          var _step22

          try {
            for (_iterator22.s(); !(_step22 = _iterator22.n()).done;) {
              var _step23 = _step22.value

              if ($(_step23).find("a[href*='store.steampowered.com/curator/']").length > 0) {
                var _link2 = $(_step23).find("a[href*='store.steampowered.com/curator/']").attr('href')

                var _curatorId = _link2.match(/curator\/([\d]+)/)

                if (_curatorId) this.taskInfo.curators.push(_curatorId[1])
              } else if ($(_step23).find("a[href*='steampowered.com/groups/']").length > 0) {
                var _link3 = $(_step23).find("a[href*='steampowered.com/groups/']").attr('href')

                var _groupName3 = _link3.match(/groups\/(.+)\/?/)

                if (_groupName3) this.taskInfo.groups.push(_groupName3[1])
              } else if ($(_step23).find("a[href*='steamcommunity.com/gid']").length > 0) {
                (function () {
                  var link = $(_step23).find("a[href*='steamcommunity.com/gid']").attr('href')

                  _pro7.push(new Promise(function (r) {
                    new Promise(function (resolve) {
                      fuc.getFinalUrl(resolve, link)
                    }).then(function (data) {
                      if (data.result === 'success') {
                        var _groupName4 = data.finalUrl.match(/groups\/(.+)\/?/)

                        if (_groupName4) {
                          _this22.taskInfo.groups.push(_groupName4[1])
                        }
                      }

                      r(1)
                    })
                  }))
                })()
              }
            }
          } catch (err) {
            _iterator22.e(err)
          } finally {
            _iterator22.f()
          }

          if (_pro7.length > 0) {
            Promise.all(_pro7).finally(function () {
              _this22.taskInfo = fuc.uniqueTaskInfo(_this22.taskInfo)
              GM_setValue('taskInfo[' + window.location.host + _this22.get_giveawayId() + ']', _this22.taskInfo)

              if (_this22.taskInfo.groups.length > 0 || _this22.taskInfo.curators.length > 0) {
                _this22.remove(true)
              } else {
                fuc.echoLog({
                  type: 'custom',
                  text: '<li><font class="success">'.concat(getI18n('cannotRemove'), '</font></li>')
                })
              }
            })
          } else {
            this.taskInfo = fuc.uniqueTaskInfo(this.taskInfo)
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
      var _this23 = this

      this.updateSteamInfo(/* #__PURE__ */_asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee12 () {
        var pro
        return regeneratorRuntime.wrap(function _callee12$ (_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                pro = []
                _context14.next = 3
                return _this23.toggleActions('fuck', pro)

              case 3:
                Promise.all(pro).finally(function () {
                  fuc.echoLog({
                    type: 'custom',
                    text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                  })
                  if (_this23.conf.fuck.verifyTask) _this23.verify()
                })

              case 4:
              case 'end':
                return _context14.stop()
            }
          }
        }, _callee12)
      })))
    },
    verify: function verify () {
      var _this24 = this

      var verify = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false

      if (verify) {
        var _pro8 = []

        var _iterator23 = _createForOfIteratorHelper(fuc.unique(this.currentTaskInfo.tasks))
        var _step24

        try {
          var _loop11 = function _loop11 () {
            var task = _step24.value
            var status = fuc.echoLog({
              type: 'custom',
              text: '<li>'.concat(getI18n('verifyingTask')).concat(task.taskDes, '...<font></font></li>')
            })

            _pro8.push(new Promise(function (resolve) {
              _this24.checkStep(task.id, resolve, status)
            }))
          }

          for (_iterator23.s(); !(_step24 = _iterator23.n()).done;) {
            _loop11()
          }
        } catch (err) {
          _iterator23.e(err)
        } finally {
          _iterator23.f()
        }

        Promise.all(_pro8).finally(function () {
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
      var _this25 = this

      var remove = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false
      var pro = []

      if (remove) {
        this.updateSteamInfo(/* #__PURE__ */_asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee13 () {
          return regeneratorRuntime.wrap(function _callee13$ (_context15) {
            while (1) {
              switch (_context15.prev = _context15.next) {
                case 0:
                  _context15.next = 2
                  return _this25.toggleActions('remove', pro)

                case 2:
                  Promise.all(pro).finally(function () {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                    })
                  })

                case 3:
                case 'end':
                  return _context15.stop()
              }
            }
          }, _callee13)
        })))
      } else {
        this.get_tasks('remove')
      }
    },
    toggleActions: function toggleActions (action, pro) {
      var groups = action === 'fuck' ? this.currentTaskInfo.groups : this.taskInfo.groups
      var curators = action === 'fuck' ? this.currentTaskInfo.curators : this.taskInfo.curators

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
      var _this26 = this

      new Promise(function (resolve) {
        if (_this26.taskInfo.groups.length > 0) {
          if (_this26.taskInfo.curators.length > 0) {
            fuc.updateSteamInfo(resolve, 'all')
          } else {
            fuc.updateSteamInfo(resolve, 'community')
          }
        } else if (_this26.taskInfo.curators.length > 0) {
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
    currentTaskInfo: {
      groups: [],
      // 任务需要加的组
      curators: [],
      // 任务需要关注的鉴赏家
      tasks: [] // 任务信息

    },
    taskInfo: {
      groups: [],
      // 所有任务需要加的组
      curators: [] // 所有任务需要关注的鉴赏家

    },
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
      var _this27 = this

      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'do_task'
      var taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
      if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory

      if (callback === 'remove' && taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
        this.remove(true)
      } else {
        var _ref50 = [[], [], [], []]
        this.tasks = _ref50[0]
        this.groups = _ref50[1]
        this.curators = _ref50[2]
        this.links = _ref50[3]
        var _ref51 = [[], fuc.echoLog({
          type: 'custom',
          text: '<li>'.concat(getI18n('getTasksInfo'), '<font></font></li>')
        }), $('#usl>div')]
        var _pro9 = _ref51[0]
        var status = _ref51[1]
        var tasksContainer = _ref51[2]

        var _iterator24 = _createForOfIteratorHelper(tasksContainer)
        var _step25

        try {
          var _loop12 = function _loop12 () {
            var task = _step25.value

            // 遍历任务信息
            _this27.tasks.push(task)

            var _ref53 = [$(task).find('i'), $(task).children('a[id]').attr('href'), $(task).children('a[id]').attr('id')]
            var icon = _ref53[0]
            var link = _ref53[1]
            var id = _ref53[2]

            if (icon.hasClass('fa-steam')) {
              if (link && /gid\/[\d]+/.test(link)) {
                _pro9.push(new Promise(function (r) {
                  new Promise(function (resolve) {
                    fuc.getFinalUrl(resolve, link)
                  }).then(function (data) {
                    if (data.result === 'success') {
                      var groupName = data.finalUrl.match(/steamcommunity.com\/groups\/([\w\d\-_]*)/)[1]

                      if (groupName) {
                        _this27.groups.push(groupName)

                        _this27.taskInfo.groups.push(groupName)

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
              _this27.links.push(id)
            } else if (icon.hasClass('fa-vk')) {
              _this27.vks.push(link)
            } else {
              _this27.others.push(icon)
            }
          }

          for (_iterator24.s(); !(_step25 = _iterator24.n()).done;) {
            _loop12()
          }
        } catch (err) {
          _iterator24.e(err)
        } finally {
          _iterator24.f()
        }

        Promise.all(_pro9).finally(function () {
          var _ref52 = [fuc.unique(_this27.groups), fuc.unique(_this27.curators), fuc.unique(_this27.links), fuc.unique(_this27.others), fuc.unique(_this27.taskInfo.groups), fuc.unique(_this27.taskInfo.curators), fuc.unique(_this27.tasks)]
          _this27.groups = _ref52[0]
          _this27.curators = _ref52[1]
          _this27.links = _ref52[2]
          _this27.others = _ref52[3]
          _this27.taskInfo.groups = _ref52[4]
          _this27.taskInfo.curators = _ref52[5]
          _this27.tasks = _ref52[6]
          GM_setValue('taskInfo[' + window.location.host + _this27.get_giveawayId() + ']', _this27.taskInfo)
          status.success()
          if (debug) console.log(_this27)

          if (callback === 'do_task') {
            if (_this27.tasks.length === 0) {
              fuc.echoLog({
                type: 'custom',
                text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
              })
              if (_this27.conf.fuck.verifyTask) _this27.verify()
            } else {
              _this27.do_task()
            }
          } else {
            !fuc.isEmptyObjArr(_this27.taskInfo) ? _this27.remove(true) : fuc.echoLog({
              type: 'custom',
              text: '<li><font class="warning">'.concat(getI18n('cannotRemove'), '</font></li>')
            })
          }
        })
      }
    },
    do_task: function do_task () {
      var _this28 = this

      this.updateSteamInfo(/* #__PURE__ */_asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee14 () {
        var _ref55, pro, links, others, vks, _iterator25, _step26, _loop13, _iterator26, _step27, vk, _iterator27, _step28, other

        return regeneratorRuntime.wrap(function _callee14$ (_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                _ref55 = [[], fuc.unique(_this28.links), fuc.unique(_this28.others), fuc.unique(_this28.vks)], pro = _ref55[0], links = _ref55[1], others = _ref55[2], vks = _ref55[3]
                _context16.next = 3
                return _this28.toggleActions('fuck', pro)

              case 3:
                if (_this28.conf.fuck.visit) {
                  _iterator25 = _createForOfIteratorHelper(links)

                  try {
                    _loop13 = function _loop13 () {
                      var link = _step26.value
                      var a = $("a[id='".concat(link, "']")).attr('onclick', 'return false;')
                      a[0].click()
                      a.removeAttr('onclick')
                      pro.push(new Promise(function (resolve) {
                        fuc.visitLink(resolve, $("a[id='".concat(link, "']")).attr('href'))
                      }))
                    }

                    for (_iterator25.s(); !(_step26 = _iterator25.n()).done;) {
                      _loop13()
                    }
                  } catch (err) {
                    _iterator25.e(err)
                  } finally {
                    _iterator25.f()
                  }
                }

                if (globalConf.other.autoOpen) {
                  _iterator26 = _createForOfIteratorHelper(vks)

                  try {
                    for (_iterator26.s(); !(_step27 = _iterator26.n()).done;) {
                      vk = _step27.value
                      window.open(vk, '_blank')
                    }
                  } catch (err) {
                    _iterator26.e(err)
                  } finally {
                    _iterator26.f()
                  }
                }

                _iterator27 = _createForOfIteratorHelper(others)

                try {
                  for (_iterator27.s(); !(_step28 = _iterator27.n()).done;) {
                    other = _step28.value
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="warning">'.concat(getI18n('unknowntype'), ':').concat($(other).attr('class'), '</font></li>')
                    })
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
                  if (_this28.conf.fuck.verifyTask) _this28.verify()
                })

              case 8:
              case 'end':
                return _context16.stop()
            }
          }
        }, _callee14)
      })))
    },
    verify: function verify () {
      setTimeout(function () {
        $('.fa-check').click()
      }, 1000)
    },
    remove: function remove () {
      var _this29 = this

      var remove = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false
      var pro = []

      if (remove) {
        this.updateSteamInfo(/* #__PURE__ */_asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee15 () {
          return regeneratorRuntime.wrap(function _callee15$ (_context17) {
            while (1) {
              switch (_context17.prev = _context17.next) {
                case 0:
                  _context17.next = 2
                  return _this29.toggleActions('remove', pro)

                case 2:
                  Promise.all(pro).finally(function () {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                    })
                  })

                case 3:
                case 'end':
                  return _context17.stop()
              }
            }
          }, _callee15)
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
      var _this30 = this

      new Promise(function (resolve) {
        if (_this30.taskInfo.groups.length > 0) {
          if (_this30.taskInfo.curators.length > 0) {
            fuc.updateSteamInfo(resolve, 'all')
          } else {
            fuc.updateSteamInfo(resolve, 'community')
          }
        } else if (_this30.taskInfo.curators.length > 0) {
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
  var website = null
  var websites = [banana, freegamelottery, gamehag, giveawaysu, gleam, indiedb, marvelousga, opiumpulses, prys, takekey]

  for (var _i5 = 0, _websites = websites; _i5 < _websites.length; _i5++) {
    var e = _websites[_i5]

    if (e.test()) {
      website = e
      break
    }
  }

  try {
    GM_addStyle(GM_getResourceText('CSS'))
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

    if (window.location.host.includes('hclonely')) {
      if (window.location.pathname.includes('setting')) {
        var _GM_getValue, _GM_getValue$global2, _GM_getValue$global2$

        unsafeWindow.GM_info = GM_info // eslint-disable-line camelcase

        unsafeWindow.GM_setValue = GM_setValue // eslint-disable-line camelcase

        unsafeWindow.language = language
        typeof ((_GM_getValue = GM_getValue('conf')) === null || _GM_getValue === void 0 ? void 0 : (_GM_getValue$global2 = _GM_getValue.global) === null || _GM_getValue$global2 === void 0 ? void 0 : (_GM_getValue$global2$ = _GM_getValue$global2.fuck) === null || _GM_getValue$global2$ === void 0 ? void 0 : _GM_getValue$global2$.joinSteamGroup) !== 'boolean' ? loadSettings(defaultConf) : loadSettings(config)
      } else if (window.location.pathname.includes('announcement')) {
        loadAnnouncement()
      }
    } else if (window.location.host.includes('marvelousga') && !window.location.pathname.includes('giveaway')) {
      fuc.newTabBlock()
    } else if (window.location.href.includes('discord.com/app')) {
      fuc.getDiscordAuth()
    } else if (window.location.href.includes('www.twitch.tv')) {
      if (window.location.href.includes('#updateTwitchInfo')) {
        fuc.updateTwitchInfo(true)
      } else if (!window.location.href.includes('/login')) {
        fuc.updateTwitchInfo(false)
      }
    } else {
      var _globalConf$other

      if (website.before) website.before()
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

      for (var _i6 = 0, _Object$entries3 = Object.entries(websiteSettings); _i6 < _Object$entries3.length; _i6++) {
        var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i6], 2)
        var _k4 = _Object$entries3$_i[0]
        var v = _Object$entries3$_i[1]

        if (v.show) buttons += '<button id="'.concat(_k4, '" type="button" class="btn btn-primary" title="').concat(v.title, '">').concat(v.text, '</button>')
      }

      if (showLogs) buttons += '<button id="toggle-logs" type="button" class="btn btn-primary" title="'.concat(!showLogs ? getI18n('showLog') : getI18n('hideLog'), '">').concat(!showLogs ? 'ShowLogs' : 'HideLogs', '</button>')
      var buttonGroup = '<div class="btn-group-vertical" role="group" aria-label="button">'.concat(buttons, '</div>')
      $('body').append('<div id="fuck-task-btn"><button id="toggle-btn-group" type="button" class="btn btn-outline-primary">&gt;</button>'.concat(buttonGroup, '</div>'))

      var _loop14 = function _loop14 () {
        var _Object$entries4$_i = _slicedToArray(_Object$entries4[_i7], 2)
        var k = _Object$entries4$_i[0]
        var v = _Object$entries4$_i[1]

        if (v.show) {
          $('#' + k).click(function () {
            website[k]()
          })
        }
      }

      for (var _i7 = 0, _Object$entries4 = Object.entries(websiteSettings); _i7 < _Object$entries4.length; _i7++) {
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

        for (var _i8 = 0, _Object$entries5 = Object.entries(hotKey); _i8 < _Object$entries5.length; _i8++) {
          var _Object$entries5$_i = _slicedToArray(_Object$entries5[_i8], 2)
          var _k5 = _Object$entries5$_i[0]
          var _v = _Object$entries5$_i[1]

          var keys = _v.split('+')

          var functionKey = keys.length === 2 ? e[keys[0].toLowerCase().trim() + 'Key'] : true

          if (functionKey && keys[1].toLowerCase().trim() === e.key) {
            switch (_k5) {
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
      $('body').append('<div id="fuck-task-info" class="card">\n  <div class="card-body">\n    <h3 class="card-title">'.concat(getI18n('taskLog'), '</h3>\n    <h4 class="card-subtitle">\n      <a id="check-update" href="javascript:void(0)" targrt="_self" class="card-link iconfont icon-update_1" title="').concat(getI18n('checkUpdate'), '"></a>\n      <a id="auto-task-setting" href="javascript:void(0)" data-href="https://auto-task-test.hclonely.com/setting.html" targrt="_self" class="card-link iconfont icon-setting" title="').concat(getI18n('setting'), '"></a>\n      <a id="auto-task-announcement" href="javascript:void(0)" data-href="https://auto-task-test.hclonely.com/announcement.html" targrt="_blank" class="card-link iconfont icon-announcement" title="').concat(getI18n('visitUpdateText'), '"></a>\n      <a id="clean-cache" href="javascript:void(0)" targrt="_self" class="card-link iconfont icon-clean" title="').concat(getI18n('cleanCache'), '"></a>\n      <a id="auto-task-feedback" href="javascript:void(0)" data-href="https://github.com/HCLonely/auto-task/issues/new/choose" targrt="_blank" class="card-link iconfont icon-feedback" title="').concat(getI18n('feedback'), '"></a>\n    </h4>\n    <div class="card-textarea">\n    </div>\n  </div>\n</div>'))
      $('#clean-cache').click(function () {
        var status = fuc.echoLog({
          type: 'custom',
          text: '<li>'.concat(getI18n('cleaning'), '<font></font></li>')
        })
        var listValues = GM_listValues()

        var _iterator28 = _createForOfIteratorHelper(listValues)
        var _step29

        try {
          for (_iterator28.s(); !(_step29 = _iterator28.n()).done;) {
            var value = _step29.value
            if (!['conf', 'language', 'steamInfo', 'discordInfo', 'insInfo', 'twitchInfo', 'twitterInfo'].includes(value)) GM_deleteValue(value)
          }
        } catch (err) {
          _iterator28.e(err)
        } finally {
          _iterator28.f()
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
