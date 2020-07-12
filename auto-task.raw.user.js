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

(function () {
  'use strict'

  GM_addStyle(GM_getResourceText('CSS'))
  const i18n = {
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
  let language = getLanguage()
  function getLanguage () {
    let lan = GM_getValue('language') || 'auto'
    if (lan === 'auto') {
      const browserLanguage = (navigator?.browserLanguage || navigator?.language || '').toLowerCase()
      lan = browserLanguage.includes('en') ? 'en' : 'zh-CN'
    }
    return lan
  }
  function getI18n (name, str = null) {
    let value = 'null'
    if (str) value = i18n[language][name] ? i18n[language][name].replace(/s%/g, str) : 'null'
    else value = i18n[language][name] || 'null'
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
    /* eslint-disable no-unused-vars */
    if (GM_getValue('conf') && window.location.host.includes('hclonely.com/setting')) {
      if (typeof GM_getValue('conf')?.global?.fuck?.joinSteamGroup !== 'boolean') {
        Swal.fire({
          icon: 'warning',
          text: getI18n('firstUpdate'),
          confirmButtonText: getI18n('goSetting'),
          cancelButtonText: getI18n('cancel'),
          showCancelButton: true
        })
      }
    }
    const steamInfo = Object.assign({
      userName: '',
      steam64Id: '',
      communitySessionID: '',
      storeSessionID: '',
      updateTime: 0
    }, GM_getValue('steamInfo'))
    const defaultConf = {
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
      givekey: {
        fuck: {
          joinSteamGroup: true,
          followCurator: true,
          addToWishlist: true,
          followGame: true,
          visitLink: true
        },
        remove: {
          leaveSteamGroup: true,
          unfollowCurator: true,
          removeFromWishlist: true,
          unfollowGame: true
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
    const config = Object.assign(JSON.parse(JSON.stringify(defaultConf)), GM_getValue('conf') || {})
    for (const [k, v] of Object.entries(config)) {
      const defaultConfig = JSON.parse(JSON.stringify(defaultConf))
      if (defaultConfig[k]) config[k] = Object.assign(defaultConfig[k], config[k])
    }
    const globalConf = config.global
    const debug = !!globalConf.other.showDetails

    const fuc = {
      httpRequest (e) {
        e.method = e.method.toUpperCase()
        if (e.dataType) e.responseType = e.dataType
        const requestObj = Object.assign({
          timeout: 30000,
          ontimeout (data) {
            if (debug) console.log(data)
            if (e.status) e.status.error('Error:Timeout(0)')
            if (e.r) e.r({ result: 'error', statusText: 'Timeout', status: 0, option: e })
          },
          onabort (data) {
            if (debug) console.log(data)
            if (e.status) e.status.error('Error:Aborted(0)')
            if (e.r) e.r({ result: 'error', statusText: 'Aborted', status: 0, option: e })
          },
          onerror (data) {
            if (debug) console.log(data)
            if (e.status) e.status.error('Error:Error(0)')
            if (e.r) e.r({ result: 'error', statusText: 'Error', status: 0, option: e })
          }
        }, e)
        if (debug) console.log('发送请求:', requestObj)
        GM_xmlhttpRequest(requestObj)
      },
      updateSteamInfo (r, type = 'all', update = false) {
        if (new Date().getTime() - steamInfo.updateTime > 10 * 60 * 1000 || update) {
          const pro = []
          if (type === 'community' || type === 'all') {
            pro.push(new Promise((resolve, reject) => {
              const status = this.echoLog({ type: 'updateSteamCommunity' })
              this.httpRequest({
                url: 'https://steamcommunity.com/my',
                method: 'GET',
                onload (response) {
                  if (debug) console.log(response)
                  if (response.status === 200) {
                    if ($(response.responseText).find('a[href*="/login/home"]').length > 0) {
                      status.error('Error:' + getI18n('loginSteamCommunity'), true)
                      reject(Error('Not Login'))
                    } else {
                      const [
                        steam64Id,
                        communitySessionID,
                        userName
                      ] = [
                        response.responseText.match(/g_steamID = "(.+?)";/),
                        response.responseText.match(/g_sessionID = "(.+?)";/),
                        response.responseText.match(/steamcommunity.com\/id\/(.+?)\/friends\//)
                      ]
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
                status
              })
            }))
          }
          if (type === 'store' || type === 'all') {
            pro.push(new Promise((resolve, reject) => {
              const status = this.echoLog({ type: 'updateSteamStore' })

              this.httpRequest({
                url: 'https://store.steampowered.com/stats/',
                method: 'GET',
                onload (response) {
                  if (debug) console.log(response)
                  if (response.status === 200) {
                    if ($(response.responseText).find('a[href*="/login/"]').length > 0) {
                      status.error('Error:' + getI18n('loginSteamStore'), true)
                      reject(Error('Not Login'))
                    } else {
                      const storeSessionID = response.responseText.match(/g_sessionID = "(.+?)";/)
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
                status
              })
            }))
          }
          Promise.all(pro).then(() => {
            steamInfo.updateTime = new Date().getTime()
            GM_setValue('steamInfo', steamInfo)
            r(1)
          }).catch(err => {
            console.error(err)
          })
        } else {
          r(1)
        }
      },
      joinSteamGroup (r, group) {
        const status = this.echoLog({ type: 'joinSteamGroup', text: group })

        this.httpRequest({
          url: 'https://steamcommunity.com/groups/' + group,
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
          data: $.param({ action: 'join', sessionID: steamInfo.communitySessionID }),
          onload (response) {
            if (debug) console.log(response)
            if (response.status === 200 && !response.responseText.includes('grouppage_join_area')) {
              status.success()
              r({ result: 'success', statusText: response.statusText, status: response.status })
            } else {
              status.error('Error:' + response.statusText + '(' + response.status + ')')
              r({ result: 'error', statusText: response.statusText, status: response.status })
            }
          },
          r,
          status
        })
      },
      getGroupID (groupName, callback) {
        const [
          status,
          groupNameToId
        ] = [
          this.echoLog({ type: 'getGroupId', text: groupName }),
          GM_getValue('groupNameToId') || {}
        ]
        if (groupNameToId[groupName]) {
          status.success()
          callback(groupName, groupNameToId[groupName])
        } else {
          new Promise(resolve => {
            this.httpRequest({
              url: 'https://steamcommunity.com/groups/' + groupName,
              method: 'GET',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
              onload (response) {
                if (debug) console.log(response)
                if (response.status === 200) {
                  const groupId = response.responseText.match(/OpenGroupChat\( '([0-9]+)'/)
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
              status,
              r () {
                resolve(false)
              }
            })
          }).then(groupId => {
            if (groupId !== false && callback) callback(groupName, groupId)
          }).catch(err => {
            console.error(err)
          })
        }
      },
      leaveSteamGroup (r, groupName) {
        this.getGroupID(groupName, (groupName, groupId) => {
          const status = this.echoLog({ type: 'leaveSteamGroup', text: groupName })

          this.httpRequest({
            url: 'https://steamcommunity.com/id/' + steamInfo.userName + '/home_process',
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            data: $.param({ sessionID: steamInfo.communitySessionID, action: 'leaveGroup', groupId: groupId }),
            onload (response) {
              if (debug) console.log(response)
              if (response.status === 200 && response.finalUrl.includes('groups') && $(response.responseText.toLowerCase()).find(`a[href='https://steamcommunity.com/groups/${groupName.toLowerCase()}']`).length === 0) {
                status.success()
                r({ result: 'success', statusText: response.statusText, status: response.status })
              } else {
                status.error('Error:' + response.statusText + '(' + response.status + ')')
                r({ result: 'error', statusText: response.statusText, status: response.status })
              }
            },
            r,
            status
          })
        })
      },
      followCurator (r, curatorId, follow = '1', status = '') {
        status = status || this.echoLog({ type: follow === '1' ? 'followCurator' : 'unfollowCurator', text: curatorId })

        this.httpRequest({
          url: 'https://store.steampowered.com/curators/ajaxfollow',
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
          data: $.param({ clanid: curatorId, sessionid: steamInfo.storeSessionID, follow: follow }),
          dataType: 'json',
          onload (response) {
            if (debug) console.log(response)
            if (response.status === 200 && response?.response?.success?.success === 1) {
              status.success()
              r({ result: 'success', statusText: response.statusText, status: response.status })
            } else {
              status.error(`Error:${response.response?.msg || response.statusText}(${response.response?.success || response.status})`)
              r({ result: 'error', statusText: response.statusText, status: response.status })
            }
          },
          r,
          status
        })
      },
      unfollowCurator (r, curatorId) {
        this.followCurator(r, curatorId, '0')
      },
      getCuratorID (developerName, callback, type, path) {
        const [
          status,
          developerNameToId
        ] = [
          this.echoLog({ type: 'getCuratorId', text: developerName }),
          GM_getValue('developerNameToId') || {}
        ]
        if (developerNameToId[developerName]) {
          status.success()
          callback(developerName, developerNameToId[developerName])
        } else {
          new Promise(resolve => {
            this.httpRequest({
              url: `https://store.steampowered.com/${path}/${developerName}`,
              method: 'GET',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
              onload (response) {
                if (debug) console.log(response)
                if (response.status === 200) {
                  const developerId = response.responseText.match(/g_pagingData.*?"clanid":([\d]+)/)
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
              status,
              r () { resolve(false) }
            })
          }).then(curatorId => {
            if (curatorId !== false && callback) callback(developerName, curatorId)
          }).catch(err => {
            console.error(err)
          })
        }
      },
      followDeveloper (r, developerName, type = 'followDeveloper', path = 'developer') {
        this.getCuratorID(developerName, (developerName, curatorId) => {
          const status = this.echoLog({ type, text: developerName })
          this.followCurator(r, curatorId, '1', status)
        }, type, path)
      },
      unfollowDeveloper (r, developerName, type = 'unfollowDeveloper', path = 'developer') {
        this.getCuratorID(developerName, (developerName, curatorId) => {
          const status = this.echoLog({ type, text: developerName })
          this.followCurator(r, curatorId, '0', status)
        }, type, path)
      },
      followPublisher (r, publisherName) {
        this.followDeveloper(r, publisherName, 'followPublisher', 'publisher')
      },
      unfollowPublisher (r, publisherName) {
        this.unfollowDeveloper(r, publisherName, 'unfollowPublisher', 'publisher')
      },
      followFranchise (r, franchiseName) {
        this.followDeveloper(r, franchiseName, 'followFranchise', 'franchise')
      },
      unfollowFranchise (r, franchiseName) {
        this.unfollowDeveloper(r, franchiseName, 'unfollowFranchise', 'franchise')
      },
      addWishlist (r, gameId) {
        const status = this.echoLog({ type: 'addWishlist', text: gameId })
        new Promise(resolve => {
          this.httpRequest({
            url: 'https://store.steampowered.com/api/addtowishlist',
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            data: $.param({ sessionid: steamInfo.storeSessionID, appid: gameId }),
            dataType: 'json',
            onload (response) {
              if (debug) console.log(response)
              if (response.status === 200 && response.response?.success === true) {
                status.success()
                resolve({ result: 'success', statusText: response.statusText, status: response.status })
              } else {
                resolve({ result: 'error', statusText: response.statusText, status: response.status })
              }
            },
            onabort (response) { resolve({ result: 'error', statusText: response.statusText, status: response.status }) },
            onerror (response) { resolve({ result: 'error', statusText: response.statusText, status: response.status }) },
            ontimeout (response) { resolve({ result: 'error', statusText: response.statusText, status: response.status }) },
            r: resolve,
            status
          })
        }).then(result => {
          if (result.result === 'success') {
            r(result)
          } else {
            this.httpRequest({
              url: 'https://store.steampowered.com/app/' + gameId,
              method: 'GET',
              onload (response) {
                if (debug) console.log(response)
                if (response.status === 200) {
                  if (response.responseText.includes('class="queue_actions_ctn"') && response.responseText.includes('已在库中')) {
                    status.success()
                    r({ result: 'success', statusText: response.statusText, status: response.status, own: true })
                  } else if ((response.responseText.includes('class="queue_actions_ctn"') && response.responseText.includes('添加至您的愿望单')) || !response.responseText.includes('class="queue_actions_ctn"')) {
                    status.error('Error:' + result.statusText + '(' + result.status + ')')
                    r({ result: 'error', statusText: response.statusText, status: response.status })
                  } else {
                    status.success()
                    r({ result: 'success', statusText: response.statusText, status: response.status })
                  }
                } else {
                  status.error('Error:' + result.statusText + '(' + result.status + ')')
                  r({ result: 'error', statusText: response.statusText, status: response.status })
                }
              },
              r,
              status
            })
          }
        }).catch(err => {
          console.error(err)
        })
      },
      removeWishlist (r, gameId) {
        const status = this.echoLog({ type: 'removeWishlist', text: gameId })
        new Promise(resolve => {
          this.httpRequest({
            url: 'https://store.steampowered.com/api/removefromwishlist',
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            data: $.param({ sessionid: steamInfo.storeSessionID, appid: gameId }),
            dataType: 'json',
            onload (response) {
              if (debug) console.log(response)
              if (response.status === 200 && response.response?.success === true) {
                status.success()
                resolve({ result: 'success', statusText: response.statusText, status: response.status })
              } else {
                resolve({ result: 'error', statusText: response.statusText, status: response.status })
              }
            },
            onabort (response) { resolve({ result: 'error', statusText: response.statusText, status: response.status }) },
            onerror (response) { resolve({ result: 'error', statusText: response.statusText, status: response.status }) },
            ontimeout (response) { resolve({ result: 'error', statusText: response.statusText, status: response.status }) },
            r: resolve,
            status
          })
        }).then(result => {
          if (result.result === 'success') {
            r(result)
          } else {
            this.httpRequest({
              url: 'https://store.steampowered.com/app/' + gameId,
              method: 'GET',
              onload (response) {
                if (debug) console.log(response)
                if (response.status === 200) {
                  if (response.responseText.includes('class="queue_actions_ctn"') && (response.responseText.includes('已在库中') || response.responseText.includes('添加至您的愿望单'))) {
                    status.success()
                    r({ result: 'success', statusText: response.statusText, status: response.status })
                  } else {
                    status.error('Error:' + result.statusText + '(' + result.status + ')')
                    r({ result: 'error', statusText: response.statusText, status: response.status })
                  }
                } else {
                  status.error('Error:' + result.statusText + '(' + result.status + ')')
                  r({ result: 'error', statusText: response.statusText, status: response.status })
                }
              },
              r,
              status
            })
          }
        }).catch(err => {
          console.error(err)
        })
      },
      followGame (r, gameId) {
        const status = this.echoLog({ type: 'followGame', text: gameId })
        new Promise(resolve => {
          this.httpRequest({
            url: 'https://store.steampowered.com/explore/followgame/',
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            data: $.param({ sessionid: steamInfo.storeSessionID, appid: gameId }),
            onload (response) {
              if (debug) console.log(response)
              if (response.status === 200 && response.responseText === 'true') {
                status.success()
                resolve({ result: 'success', statusText: response.statusText, status: response.status })
              } else {
                resolve({ result: 'error', statusText: response.statusText, status: response.status })
              }
            },
            onabort (response) { resolve({ result: 'error', statusText: response.statusText, status: response.status }) },
            onerror (response) { resolve({ result: 'error', statusText: response.statusText, status: response.status }) },
            ontimeout (response) { resolve({ result: 'error', statusText: response.statusText, status: response.status }) },
            r: resolve,
            status
          })
        }).then(result => {
          if (result.result === 'success') {
            r(result)
          } else {
            this.httpRequest({
              url: 'https://store.steampowered.com/app/' + gameId,
              method: 'GET',
              onload (response) {
                if (debug) console.log(response)
                if (response.status === 200) {
                  if (response.responseText.includes('class="queue_actions_ctn"') && response.responseText.includes('class="btnv6_blue_hoverfade btn_medium queue_btn_active" style="">')) {
                    status.success()
                    r({ result: 'success', statusText: response.statusText, status: response.status })
                  } else {
                    status.error('Error:' + result.statusText + '(' + result.status + ')')
                    r({ result: 'error', statusText: response.statusText, status: response.status })
                  }
                } else {
                  status.error('Error:' + result.statusText + '(' + result.status + ')')
                  r({ result: 'error', statusText: response.statusText, status: response.status })
                }
              },
              r,
              status
            })
          }
        }).catch(err => {
          console.error(err)
        })
      },
      unfollowGame (r, gameId) {
        const status = this.echoLog({ type: 'unfollowGame', text: gameId })
        new Promise(resolve => {
          this.httpRequest({
            url: 'https://store.steampowered.com/explore/followgame/',
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            data: $.param({ sessionid: steamInfo.storeSessionID, appid: gameId, unfollow: '1' }),
            onload (response) {
              if (debug) console.log(response)
              if (response.status === 200 && response.responseText === 'true') {
                status.success()
                resolve({ result: 'success', statusText: response.statusText, status: response.status })
              } else {
                resolve({ result: 'error', statusText: response.statusText, status: response.status })
              }
            },
            onabort (response) { resolve({ result: 'error', statusText: response.statusText, status: response.status }) },
            onerror (response) { resolve({ result: 'error', statusText: response.statusText, status: response.status }) },
            ontimeout (response) { resolve({ result: 'error', statusText: response.statusText, status: response.status }) },
            r: resolve,
            status
          })
        }).then(result => {
          if (result.result === 'success') {
            r(result)
          } else {
            this.httpRequest({
              url: 'https://store.steampowered.com/app/' + gameId,
              method: 'GET',
              onload (response) {
                if (debug) console.log(response)
                if (response.status === 200) {
                  if (response.responseText.includes('class="queue_actions_ctn"') && response.responseText.includes('class="btnv6_blue_hoverfade btn_medium queue_btn_active" style="">')) {
                    status.error('Error:' + result.statusText + '(' + result.status + ')')
                    r({ result: 'error', statusText: response.statusText, status: response.status })
                  } else {
                    status.success()
                    r({ result: 'success', statusText: response.statusText, status: response.status })
                  }
                } else {
                  status.error('Error:' + result.statusText + '(' + result.status + ')')
                  r({ result: 'error', statusText: response.statusText, status: response.status })
                }
              },
              r,
              status
            })
          }
        }).catch(err => {
          console.error(err)
        })
      },
      likeAnnouncements (r, url, id) {
        const status = this.echoLog({ type: 'likeAnnouncements', url, id })

        this.httpRequest({
          url: url.replace('/detail/', '/rate/'),
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
          data: $.param({ sessionid: steamInfo.communitySessionID, voteup: true }),
          dataType: 'json',
          onload (response) {
            if (debug) console.log(response)
            if (response.status === 200 && response.response?.success === 1) {
              status.success()
              r({ result: 'success', statusText: response.statusText, status: response.status })
            } else {
              status.error(`Error:${response.response?.msg || response.statusText}(${response.response?.success || response.status})`)
              r({ result: 'error', statusText: response.statusText, status: response.status })
            }
          },
          r,
          status
        })
      },
      getFinalUrl (r, url, options = null) {
        const conf = Object.assign({
          url,
          method: 'GET',
          onload (response) {
            r({ result: 'success', finalUrl: response.finalUrl, url })
          },
          r
        }, options)
        this.httpRequest(conf)
      },
      visitLink (r, url, options = {}) {
        if (!options.method) options.method = 'HEAD'
        const status = this.echoLog({ type: 'visitLink', text: url })
        new Promise(resolve => {
          this.getFinalUrl(resolve, url, options)
        }).then(() => {
          status.warning('Complete')
          r(1)
        }).catch(err => {
          console.error(err)
        })
      },
      checkUpdate (s = false) {
        let status = false
        const echoLog = this.echoLog
        if (s) status = echoLog({ type: 'custom', text: `<li>${getI18n('checkingUpdate')}<font></font></li>` })
        this.httpRequest({
          url: 'https://auto-task.hclonely.com/version.json?t=' + new Date().getTime(),
          method: 'get',
          dataType: 'json',
          onload (response) {
            if (debug) console.log(response)
            if (response.response?.version === GM_info.script.version) {
              if (s) status.success(getI18n('thisIsNew'))
            } else if (response.response?.version) {
              echoLog({ type: 'custom', text: `<li>${getI18n('newVer') + 'V' + response.response.version}<a href="https://github.com/HCLonely/auto-task/raw/V3/auto-task.user.js" target="_blank">${getI18n('updateNow')}</a><font></font></li>` })
              if (s) status.success(getI18n('newVer') + response.response.version)
            } else {
              if (s) status.error('Error:' + (response.statusText || response.status))
            }
          },
          ontimeout (response) {
            if (debug) console.log(response)
            if (s) status.error('Error:Timeout(0)')
          },
          onabort (response) {
            if (debug) console.log(response)
            if (s) status.error('Error:Abort(0)')
          },
          onerror (response) {
            if (debug) console.log(response)
            if (s) status.error('Error:Error(0)')
          },
          status
        })
      },
      newTabBlock () {
        const [d, cookiename] = [new Date(), 'haveVisited1']
        document.cookie = cookiename + '=1; path=/'
        document.cookie = cookiename + '=' + (d.getUTCMonth() + 1) + '/' + d.getUTCDate() + '/' + d.getUTCFullYear() + '; path=/'
      },
      echoLog (e) { // switch case !!
        let ele = ''
        switch (e.type) {
          case 'updateSteamCommunity':
            ele = $(`<li>${getI18n('updateCommunityId')}<font></font></li>`)
            break
          case 'updateSteamStore':
            ele = $(`<li>${getI18n('updateStoreId')}<font></font></li>`)
            break
          case 'joinSteamGroup':
            ele = $(`<li>${getI18n('joinGroup')}<a href="https://steamcommunity.com/groups/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
            break
          case 'getGroupId':
            ele = $(`<li>${getI18n('getGroupId')}<a href="https://steamcommunity.com/groups/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
            break
          case 'leaveSteamGroup':
            ele = $(`<li>${getI18n('leaveGroup')}<a href="https://steamcommunity.com/groups/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
            break
          case 'followCurator':
            ele = $(`<li>${getI18n('followCurator')}<a href="https://store.steampowered.com/curator/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
            break
          case 'unfollowCurator':
            ele = $(`<li>${getI18n('unfollowCurator')}<a href="https://store.steampowered.com/curator/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
            break
          case 'getDeveloperId':
            ele = $(`<li>${getI18n('getDeveloperId')}<a href="https://store.steampowered.com/developer/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
            break
          case 'followDeveloper':
            ele = $(`<li>${getI18n('followDeveloper')}<a href="https://store.steampowered.com/developer/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
            break
          case 'unfollowDeveloper':
            ele = $(`<li>${getI18n('unfollowDeveloper')}<a href="https://store.steampowered.com/developer/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
            break
          case 'getPublisherId':
            ele = $(`<li>${getI18n('getPublisherId')}<a href="https://store.steampowered.com/publisher/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
            break
          case 'followPublisher':
            ele = $(`<li>${getI18n('followPublisher')}<a href="https://store.steampowered.com/publisher/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
            break
          case 'unfollowPublisher':
            ele = $(`<li>${getI18n('unfollowPublisher')}<a href="https://store.steampowered.com/publisher/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
            break
          case 'getFranchiseId':
            ele = $(`<li>${getI18n('getFranchiseId')}<a href="https://store.steampowered.com/franchise/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
            break
          case 'followFranchise':
            ele = $(`<li>${getI18n('followFranchise')}<a href="https://store.steampowered.com/franchise/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
            break
          case 'unfollowFranchise':
            ele = $(`<li>${getI18n('unfollowFranchise')}<a href="https://store.steampowered.com/franchise/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
            break
          case 'addWishlist':
            ele = $(`<li>${getI18n('addWishlist')}<a href="https://store.steampowered.com/app/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
            break
          case 'removeWishlist':
            ele = $(`<li>${getI18n('removeWishlist')}<a href="https://store.steampowered.com/app/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
            break
          case 'followGame':
            ele = $(`<li>${getI18n('followGame')}<a href="https://store.steampowered.com/app/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
            break
          case 'unfollowGame':
            ele = $(`<li>${getI18n('unfollowGame')}<a href="https://store.steampowered.com/app/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
            break
          case 'likeAnnouncements':
            ele = $(`<li>${getI18n('likeAnnouncements')}<a href="${e.url}" target="_blank">${e.id}</a>...<font></font></li>`)
            break
          case 'visitLink':
            ele = $(`<li>${getI18n('visitLink')}...<a href="${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
            break
          case 'custom':
            ele = $(e.text)
            break
          default:
            ele = $(`<li>${getI18n('unknown')}<font></font></li>`)
            break
        }
        ele.addClass('card-text')
        $('#fuck-task-info .card-textarea').append(ele)
        ele[0].scrollIntoView()
        const font = ele.find('font')
        const status = {
          font,
          success (text = 'Success', html = false) {
            this.font.attr('class', '').addClass('success')
            html ? this.font.html(text) : this.font.text(text)
          },
          error (text = 'Error', html = false) {
            this.font.attr('class', '').addClass('error')
            html ? this.font.html(text) : this.font.text(text)
          },
          warning (text = 'Warning', html = false) {
            this.font.attr('class', '').addClass('warning')
            html ? this.font.html(text) : this.font.text(text)
          },
          info (text = 'Info', html = false) {
            this.font.attr('class', '').addClass('info')
            html ? this.font.html(text) : this.font.text(text)
          }
        }
        return status
      },
      toggleLogs () {
        const btn = $('#toggle-logs')
        const taskInfoDiv = $('#fuck-task-info')
        if (taskInfoDiv.is(':hidden')) {
          btn.text('HideLogs').attr('title', getI18n('hideLog'))
          taskInfoDiv.show().animate({ right: '16px' }, 'fast')
        } else {
          btn.text('ShowLogs').attr('title', getI18n('showLog'))
          taskInfoDiv.animate({ right: '-100%' }, 'fast', () => { taskInfoDiv.hide() })
        }
      },
      unique: e => [...new Set(e)],
      getUrlQuery (url) {
        const q = {}
        if (url) {
          if (url.includes('?')) url.split('?')[1].replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => { q[k] = v })
        } else {
          window.location.search.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => { q[k] = v })
        }
        return q
      },
      dateFormat (fmt, date) {
        let ret = null
        const opt = {
          'Y+': date.getFullYear().toString(),
          'm+': (date.getMonth() + 1).toString(),
          'd+': date.getDate().toString(),
          'H+': date.getHours().toString(),
          'M+': date.getMinutes().toString(),
          'S+': date.getSeconds().toString()
        }
        for (const k in opt) {
          ret = new RegExp('(' + k + ')').exec(fmt)
          if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
          }
        }
        return fmt
      },
      isEmptyObjArr (object) {
        for (const value of Object.values(object)) {
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
      toggleActions ({ website, type, elements, resolve, action, toFinalUrl = {} }) {
        const pro = []
        for (const element of fuc.unique(elements)) {
          let elementName = null
          if (website === 'giveawaysu' && toFinalUrl[element]) {
            const toFinalUrlElement = toFinalUrl[element] || ''
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
              case 'franchise':
                elementName = toFinalUrlElement.match(/franchise\/(.+)\/?/)
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
          if (elementName?.[1]) {
            switch (type) {
              case 'group':
                pro.push(new Promise(resolve => {
                  action === 'fuck' ? fuc.joinSteamGroup(resolve, elementName[1]) : fuc.leaveSteamGroup(resolve, elementName[1])
                }))
                break
              case 'curator':
                pro.push(new Promise(resolve => {
                  action === 'fuck' ? fuc.followCurator(resolve, elementName[1]) : fuc.unfollowCurator(resolve, elementName[1])
                }))
                break
              case 'publisher':
                pro.push(new Promise(resolve => {
                  action === 'fuck' ? fuc.followPublisher(resolve, elementName[1]) : fuc.unfollowPublisher(resolve, elementName[1])
                }))
                break
              case 'developer':
                pro.push(new Promise(resolve => {
                  action === 'fuck' ? fuc.followDeveloper(resolve, elementName[1]) : fuc.unfollowDeveloper(resolve, elementName[1])
                }))
                break
              case 'franchise':
                pro.push(new Promise(resolve => {
                  action === 'fuck' ? fuc.followFranchise(resolve, elementName[1]) : fuc.unfollowFranchise(resolve, elementName[1])
                }))
                break
              case 'wishlist':
                pro.push(new Promise(resolve => {
                  action === 'fuck' ? fuc.addWishlist(resolve, elementName[1]) : fuc.removeWishlist(resolve, elementName[1])
                }))
                break
              case 'game':
                pro.push(new Promise(resolve => {
                  action === 'fuck' ? fuc.followGame(resolve, elementName[1]) : fuc.unfollowGame(resolve, elementName[1])
                }))
                break
              case 'announcement':
                pro.push(new Promise(resolve => {
                  if (action === 'like') {
                    fuc.likeAnnouncements(resolve, elementName.input, elementName[1])
                  }
                }))
                break
            }
          }
        }
        Promise.all(pro).finally(() => {
          resolve()
        })
      }
    }

    const banana = {
      test () { return (window.location.host.includes('grabfreegame') || window.location.host.includes('bananagiveaway')) },
      fuck () {
        const [needBanana, needPoints] = [$("p:contains('Collect'):contains('banana')"), $("p:contains('Collect'):contains('point')")]
        let msg = ''
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
          }).then((result) => {
            if (result.value) {
              this.get_tasks('do_task')
            }
          })
        } else {
          this.get_tasks('do_task')
        }
      },
      get_tasks (callback = 'do_task') {
        const taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
        if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory
        if (callback === 'remove' && taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
          this.remove(true)
        } else {
          [this.tasks, this.links, this.groups, this.curators, this.wishlists, this.fGames, this.taskIds] = [[], [], [], [], [], [], []]

          const [
            status,
            tasksUl,
            pro
          ] = [
            fuc.echoLog({ type: 'custom', text: `<li>${getI18n('processTasksInfo')}<font></font></li>` }),
            $('ul.tasks li:not(:contains(Completed))'),
            []
          ]

          for (const task of tasksUl) { // 遍历任务信息
            const [taskDes, verifyBtn] = [$(task).find('p'), $(task).find('button:contains(Verify)')]
            const taskId = verifyBtn.length > 0 ? verifyBtn.attr('onclick').match(/\?verify=([\d]+)/) : ''
            if (taskId) {
              this.tasks.push({ taskId: taskId[1], taskDes: taskDes.text() })
              if (/join.*?steam.*?group/gim.test(taskDes.text())) {
                pro.push(new Promise(res => {
                  new Promise(resolve => {
                    fuc.getFinalUrl(resolve, window.location.origin + window.location.pathname + '?q=' + taskId[1])
                  }).then(r => {
                    if (r.result === 'success') {
                      const groupName = r.finalUrl.match(/groups\/(.+)\/?/)
                      if (groupName) {
                        this.groups.push(groupName[1])
                        this.taskInfo.groups.push(groupName[1])
                      } else {
                        this.taskIds.push(taskId[1])
                      }
                    } else {
                      this.taskIds.push(taskId[1])
                    }
                    res(1)
                  })
                }))
              } else if (/follow.*?curator/gim.test(taskDes.text())) {
                pro.push(new Promise(res => {
                  new Promise(resolve => {
                    fuc.getFinalUrl(resolve, window.location.origin + window.location.pathname + '?q=' + taskId[1])
                  }).then(r => {
                    if (r.result === 'success') {
                      const curatorId = r.finalUrl.match(/curator\/([\d]+)/)
                      if (curatorId) {
                        this.curators.push(curatorId[1])
                        this.taskInfo.curators.push(curatorId[1])
                      } else {
                        this.taskIds.push(taskId[1])
                      }
                    } else {
                      this.taskIds.push(taskId[1])
                    }
                    res(1)
                  })
                }))
              } else if (/wishlist/gim.test(taskDes.text())) {
                pro.push(new Promise(res => {
                  new Promise(resolve => {
                    fuc.getFinalUrl(resolve, window.location.origin + window.location.pathname + '?q=' + taskId[1])
                  }).then(r => {
                    if (r.result === 'success') {
                      const appId = r.finalUrl.match(/store.steampowered.com\/app\/([\d]+)/)
                      if (appId) {
                        this.wishlists.push(appId[1])
                        this.taskInfo.wishlists.push(appId[1])
                      } else {
                        this.taskIds.push(taskId[1])
                      }
                    } else {
                      this.taskIds.push(taskId[1])
                    }
                    res(1)
                  })
                }))
              } else {
                if (/(Subscribe.*channel)|(Retweet)|(Twitter)/gim.test(taskDes.text())) {
                  if (!this.verifyBtn) this.verifyBtn = taskDes.parent().find('button:contains(Verify)')
                  if (callback === 'do_task' && globalConf.other.autoOpen) {
                    taskDes.parent().find('button')[0].click()
                  }
                }
                pro.push(new Promise(resolve => {
                  this.links.push(window.location.origin + window.location.pathname + '?q=' + taskId[1])
                  this.taskIds.push(taskId[1])
                  resolve(1)
                }))
              }
            }
          }
          Promise.all(pro).finally(() => {
            [
              this.links,
              this.groups,
              this.curators,
              this.wishlists,
              this.fGames,
              this.taskInfo.groups,
              this.taskInfo.curators,
              this.taskInfo.wishlists,
              this.taskInfo.fGames,
              this.taskIds,
              this.tasks
            ] = [
              fuc.unique(this.links),
              fuc.unique(this.groups),
              fuc.unique(this.curators),
              fuc.unique(this.wishlists),
              fuc.unique(this.fGames),
              fuc.unique(this.taskInfo.groups),
              fuc.unique(this.taskInfo.curators),
              fuc.unique(this.taskInfo.wishlists),
              fuc.unique(this.taskInfo.fGames),
              fuc.unique(this.taskIds),
              fuc.unique(this.tasks)
            ]
            GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
            status.success()
            if (debug) console.log(this)
            if (callback === 'do_task') {
              this.do_task()
            } else if (callback === 'verify') {
              this.tasks.length > 0 ? this.verify(true) : fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
            } else {
              !fuc.isEmptyObjArr(this.taskInfo) ? this.remove(true) : fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('cannotRemove')}</font></li>` })
            }
          })
        }
      },
      do_task () {
        this.updateSteamInfo(async () => {
          const [pro, links] = [[], fuc.unique(this.links)]
          await this.toggleActions('fuck', pro)
          if (this.conf.fuck.visitLink) {
            for (const link of links) {
              pro.push(new Promise(resolve => {
                fuc.visitLink(resolve, link)
              }))
            }
          }
          Promise.all(pro).finally(() => {
            fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
            if (this.conf.fuck.verifyTask) this.verify()
          })
        })
      },
      verify (verify = false) {
        if (verify) {
          const pro = []
          for (const task of fuc.unique(this.tasks)) {
            const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('verifyingTask')}${task.taskDes}...<font></font></li>` })
            pro.push(new Promise(resolve => {
              fuc.httpRequest({
                url: window.location.origin + window.location.pathname + '?verify=' + task.taskId,
                method: 'GET',
                onload (response) {
                  if (debug) console.log(response)
                  status.warning('Complete')
                  resolve({ result: 'success', statusText: response.statusText, status: response.status })
                },
                r: resolve,
                status
              })
            }))
          }
          Promise.all(pro).finally(() => {
            fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('verifyTasksComplete')}</font></li>` })
            this.verifyBtn.length > 0 ? this.verifyBtn.removeAttr('disabled')[0].click() : window.location.reload(true)
          })
        } else {
          this.get_tasks('verify')
        }
      },
      remove (remove = false) {
        const pro = []
        if (remove) {
          this.updateSteamInfo(async () => {
            await this.toggleActions('remove', pro)
            Promise.all(pro).finally(() => {
              fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
            })
          })
        } else {
          this.get_tasks('remove')
        }
      },
      toggleActions (action, pro) {
        const [groups, curators, wishlists, fGames] = action === 'fuck'
          ? [this.groups, this.curators, this.wishlists, this.fGames]
          : [this.taskInfo.groups, this.taskInfo.curators, this.taskInfo.wishlists, this.taskInfo.fGames]
        if (this.conf[action][action === 'fuck' ? 'joinSteamGroup' : 'leaveSteamGroup'] && groups.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'banana', type: 'group', elements: groups, resolve, action })
          }))
        }
        if (this.conf[action][action === 'fuck' ? 'followCurator' : 'unfollowCurator'] && curators.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'banana', type: 'curator', elements: curators, resolve, action })
          }))
        }
        if (this.conf[action][action === 'fuck' ? 'addToWishlist' : 'removeFromWishlist'] && wishlists.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'banana', type: 'wishlist', elements: wishlists, resolve, action })
          }))
        }
        if (this.conf[action][action === 'fuck' ? 'followGame' : 'unfollowGame'] && fGames.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'banana', type: 'game', elements: fGames, resolve, action })
          }))
        }
      },
      get_giveawayId () {
        const id = window.location.href.match(/\/giveaway\/([\w\d-]+)/)
        return id?.[1] || window.location.href
      },
      updateSteamInfo (callback) {
        new Promise(resolve => {
          if (this.taskInfo.groups.length > 0) {
            if (this.taskInfo.curators.length > 0 || this.taskInfo.fGames.length > 0 || this.taskInfo.wishlists.length > 0) {
              fuc.updateSteamInfo(resolve, 'all')
            } else {
              fuc.updateSteamInfo(resolve, 'community')
            }
          } else if (this.taskInfo.curators.length > 0 || this.taskInfo.fGames.length > 0 || this.taskInfo.wishlists.length > 0) {
            fuc.updateSteamInfo(resolve, 'store')
          } else {
            resolve(1)
          }
        }).then(s => {
          if (s === 1) callback()
        }).catch(err => {
          console.error(err)
        })
      },
      checkLogin () {
        if ($('a.steam[title*=team]').length > 0) window.open('/giveaway/steam/', '_self')
      },
      checkLeft () {
        if ($('.left b').text() === '0') {
          Swal.fire({
            icon: 'warning',
            title: getI18n('notice'),
            text: getI18n('noKeysLeft'),
            confirmButtonText: getI18n('confirm'),
            cancelButtonText: getI18n('cancel'),
            showCancelButton: true
          }).then((result) => {
            if (result.value) {
              window.close()
            }
          })
        }
      },
      verifyBtn: 0,
      links: [], // 需要浏览的页面链接
      groups: [], // 所有任务需要加的组
      curators: [], // 所有任务需要关注的鉴赏家
      wishlists: [], // 所有务需要添加愿望单的游戏
      fGames: [], // 所有任务需要关注的的游戏
      taskIds: [], // 处理失败的任务
      taskInfo: {
        groups: [], // 任务需要加的组
        curators: [], // 任务需要关注的鉴赏家
        wishlists: [], // 任务需要添加愿望单的游戏
        fGames: []// 任务需要关注的的游戏
      },
      tasks: [], // 所有任务ID
      setting: {},
      conf: config?.banana?.enable ? config.banana : globalConf
    }

    const freegamelottery = {
      test () { return window.location.host.includes('freegamelottery') },
      after () {
        if (window.location.host === 'd.freegamelottery.com' && GM_getValue('lottery') === 1) this.draw()
      },
      fuck () {
        GM_setValue('lottery', 1)
        if ($('a.registration-button').length > 0) {
          if (this.conf.fuck.autoLogin) {
            const userInfo = GM_getValue('conf').freegamelottery.userInfo
            if (userInfo) {
              const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('logining')}<font></font></li>` })
              fuc.httpRequest({
                url: 'https://freegamelottery.com/user/login',
                method: 'POST',
                data: `username=${userInfo.username}&password=${userInfo.password}&rememberMe=1`,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                onload (data) {
                  if (data.status === 200) {
                    status.success()
                    window.location.reload(true)
                  } else {
                    status.error('Error:' + (data.statusText || data.status))
                  }
                },
                status
              })
            } else {
              $('body').overHang({
                type: 'warn',
                activity: 'notification',
                message: getI18n('needLogin')
              })
              $('a.registration-button')[0].click()
              $('button[value=Login]').click(() => {
                const conf = GM_getValue('conf')
                conf.freegamelottery.userInfo = { username: $('#modal_login').val(), password: $('#modal_password').val() }
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
      draw () {
        GM_setValue('lottery', 0)
        if (this.conf.fuck.doTask) {
          const main = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('fglTimeout', 'Visit MAIN DRAW')}<font></font></li>` })
          $.post('/draw/register-visit', { drawId: DashboardApp.draws.main.actual.id })
            .done(() => {
              DashboardApp.draws.main.actual.haveVisited = true
              main.success()
              const survey = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('fglTimeout', 'Visit SURVEY DRAW')}<font></font></li>` })
              $.post('/draw/register-visit', { type: 'survey', drawId: DashboardApp.draws.survey.actual.id })
                .done(() => {
                  DashboardApp.draws.survey.actual.haveVisited = 1
                  survey.success()
                  const video = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('fglTimeout', 'Visit VIDEO DRAW')}<font></font></li>` })
                  $.post('/draw/register-visit', { drawId: DashboardApp.draws.video.actual.id })
                    .done(() => {
                      DashboardApp.draws.video.actual.haveVisited = true
                      video.success()
                      const stackpot = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('fglTimeout', 'Visit STACKPOT')}<font></font></li>` })
                      $.post('/draw/register-visit', { type: 'stackpot', drawId: DashboardApp.draws.stackpot.actual.id })
                        .done(() => {
                          DashboardApp.draws.stackpot.actual.haveVisited = 1
                          stackpot.success()
                          fuc.echoLog({ type: 'custom', text: `<li>${getI18n('fglComplete')}<font></font></li>` })
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
      conf: config?.freegamelottery?.enable ? config.freegamelottery : globalConf
    }

    const gamehag = {
      test () { return window.location.host.includes('gamehag') },
      before () {
        $('#getkey').removeAttr('disabled')
        if (globalConf.other.reCaptcha) $('body').append('<script>window.bannedCountries = ["en"];window.geo ="en";window.respCaptch="";</script>')
      },
      fuck () { this.get_tasks('do_task') },
      get_tasks (callback = 'do_task') {
        const [
          status,
          verifyBtns
        ] = [
          fuc.echoLog({ type: 'custom', text: `<li>${getI18n('getTasksInfo')}<font></font></li>` }),
          $('button[data-id]')
        ]
        if (callback === 'do_task') {
          [this.groups, this.tasks] = [[], []]
          const pro = []
          const taskInfo = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
          if (taskInfo && !fuc.isEmptyObjArr(taskInfo)) this.taskInfo = taskInfo
          for (const btn of verifyBtns) {
            const [taskId, taskDes] = [$(btn).attr('data-id'), $(btn).parent().prev().text()]
            if ($(btn).parents('.task-content').next().text().includes('+1')) {
              if (/join.*?steam.*?group/gim.test($(btn).parent().prev().text())) {
                const groupurl = $(btn).parent().find('a:contains("to do")').attr('href')
                pro.push(new Promise(res => {
                  new Promise(resolve => {
                    fuc.getFinalUrl(resolve, groupurl)
                  }).then(r => {
                    if (r.result === 'success') {
                      const groupName = r.finalUrl.match(/groups\/(.+)\/?/)
                      if (groupName) {
                        this.groups.push(groupName[1])
                        this.taskInfo.groups.push(groupName[1])
                      } else {
                        fuc.echoLog({ type: 'custom', text: `<li>${getI18n('getGroupError', groupurl)}<font></font></li>` })
                      }
                    } else {
                      fuc.echoLog({ type: 'custom', text: `<li>${getI18n('getGroupError', groupurl)}<font></font></li>` })
                    }
                    res(1)
                  })
                }))
              }
              this.tasks.push({ taskId, taskDes })
            }
          }
          if ($('a.giveaway-survey').length > 0) {
            const [taskId, taskDes] = [$('a.giveaway-survey').attr('data-task_id'), 'Complete the survey']
            this.tasks.push({ taskId, taskDes })
          }

          Promise.all(pro).finally(() => {
            [
              this.groups,
              this.taskInfo.groups,
              this.tasks
            ] = [
              fuc.unique(this.groups),
              fuc.unique(this.taskInfo.groups),
              fuc.unique(this.tasks)
            ]
            status.success()
            GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
            if (this.tasks.length > 0) {
              this.do_task()
            } else {
              fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
              if (this.conf.fuck.verifyTask) this.verify()
            }
          })
        } else if (callback === 'verify') {
          this.tasks = []
          for (const btn of verifyBtns) {
            const [taskId, taskDes] = [$(btn).attr('data-id'), $(btn).parent().prev().text()]
            if ($(btn).parents('.task-content').next().text().includes('+1')) this.tasks.push({ taskId, taskDes })
          }
          this.tasks = fuc.unique(this.tasks)
          if (this.tasks.length > 0) {
            this.verify(true)
          } else {
            fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('verifyTasksComplete')}</font></li>` })
          }
          status.success()
        } else if (callback === 'remove') {
          status.success()
          fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('cannotRemove')}</font></li>` })
        } else {
          status.success()
          fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n('unknown')}！</font></li>` })
        }
        if (debug) console.log(this)
      },
      async do_task () {
        const [pro, tasks] = [[], fuc.unique(this.tasks)]
        for (let i = 0; i < tasks.length; i++) {
          const task = tasks[i]
          pro.push(new Promise(resolve => {
            fuc.visitLink(resolve, '/giveaway/click/' + task.taskId, { headers: { 'x-csrf-token': $('meta[name="csrf-token"]').attr('content') } })
          }))
          if (/play.*?games/gim.test(task.taskDes)) {
            pro.push(new Promise(resolve => {
              fuc.visitLink(resolve, '/games', { headers: { 'x-csrf-token': $('meta[name="csrf-token"]').attr('content') } })
            }))
            pro.push(new Promise(resolve => {
              fuc.visitLink(resolve, '/games/war-thunder/play', { headers: { 'x-csrf-token': $('meta[name="csrf-token"]').attr('content') } })
            }))
          }
          await new Promise(resolve => {
            setTimeout(() => { resolve() }, 1000)
          })
        }
        Promise.all(pro).finally(() => {
          this.updateSteamInfo(async () => {
            const pro = []
            await this.toggleActions('fuck', pro)
            Promise.all(pro).finally(() => {
              fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
              if (this.conf.fuck.verifyTask) this.verify()
            })
          })
        })
      },
      async verify (verify = false) {
        if (verify) {
          const [pro, tasks] = [[], fuc.unique(this.tasks)]
          for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i]
            const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('verifyingTask')}<a href="/giveaway/click/${task.taskId}" target="_blank">${task.taskDes.trim()}</a>...<font></font></li>` })
            pro.push(new Promise(resolve => {
              fuc.httpRequest({
                url: '/api/v1/giveaway/sendtask',
                method: 'POST',
                dataType: 'json',
                headers: {
                  'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                  'x-csrf-token': $('meta[name="csrf-token"]').attr('content')
                },
                data: 'task_id=' + task.taskId,
                onload (response) {
                  if (debug) console.log(response)
                  if (response.response) {
                    if (response.response.status === 'success') {
                      status.success()
                      $(`div.task-reward[href="#task-${task.taskId}-collapse"]`).html('<svg class="nc-icon nc-align-to-text grid-24 glyph"><use xlink:href="/icons/nci-fill.svg#nc-icon-check-simple" /></svg>')
                      resolve({ result: 'success', statusText: response.statusText, status: response.status })
                    } else {
                      status.error('Error:' + (response.response.message || response.statusText || response.status || 'error'))
                      if (globalConf.other.autoOpen) window.open(`/giveaway/click/${task.taskId}`, '_blank')
                      resolve({ result: 'error', statusText: response.statusText, status: response.status })
                    }
                  } else {
                    status.error('Error:' + response.statusText)
                    resolve({ result: 'error', statusText: response.statusText, status: response.status })
                  }
                },
                r: resolve,
                status
              })
            }))
            await new Promise(resolve => {
              setTimeout(() => { resolve() }, 1000)
            })
          }
          Promise.all(pro).finally(() => {
            fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('verifyTasksComplete')}</font></li>` })
          })
        } else {
          this.get_tasks('verify')
        }
      },
      remove (remove = false) {
        if (this.conf.remove.leaveSteamGroup && this.groups.length > 0) {
          this.updateSteamInfo(async () => {
            const pro = []
            await this.toggleActions('remove', pro)
            Promise.all(pro).finally(() => {
              fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
            })
          })
        } else {
          fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('cannotRemove')}</font></li>` })
        }
      },
      toggleActions (action, pro) {
        const groups = action === 'fuck' ? this.groups : this.taskInfo.groups
        if (this.conf[action][action === 'fuck' ? 'joinSteamGroup' : 'leaveSteamGroup'] && groups.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'banana', type: 'group', elements: groups, resolve, action })
          }))
        }
      },
      updateSteamInfo (callback) {
        new Promise(resolve => {
          if (this.taskInfo.groups.length > 0) {
            fuc.updateSteamInfo(resolve, 'community')
          } else {
            resolve(1)
          }
        }).then(s => {
          if (s === 1) callback()
        }).catch(err => {
          console.error(err)
        })
      },
      get_giveawayId () {
        const id = window.location.href.match(/\/giveaway\/([\d]+)/)
        return id ? id[1] : window.location.href
      },
      checkLeft () {
        if ($('.giveaway-counter:first .strong').text() === '0') {
          Swal.fire({
            icon: 'warning',
            title: getI18n('notice'),
            text: getI18n('noKeysLeft'),
            confirmButtonText: getI18n('confirm'),
            cancelButtonText: getI18n('cancel'),
            showCancelButton: true
          }).then((result) => {
            if (result.value) {
              window.close()
            }
          })
        }
      },
      groups: [], // 任务需要加的组
      taskInfo: {
        groups: []// 所有任务需要加的组
      },
      tasks: [], // 任务信息
      setting: {},
      conf: config?.gamehag?.enable ? config.gamehag : globalConf
    }

    const giveawaysu = {
      test () { return window.location.host.includes('giveaway.su') },
      get_tasks (e) {
        // 获取任务信息
        const taskInfo = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
        if (taskInfo && !fuc.isEmptyObjArr(taskInfo) && e === 'remove') {
          this.taskInfo = taskInfo
          this.do_task('remove')
        } else {
          if (taskInfo && !fuc.isEmptyObjArr(taskInfo)) this.taskInfo = taskInfo
          const [
            status,
            tasks
          ] = [
            fuc.echoLog({ type: 'custom', text: `<li>${getI18n('getTasksInfo')}<font></font></li>` }),
            $('#actions tr')
          ]
          for (const task of tasks) {
            const taskDes = $(task).find('td').eq(1).find('a:not([data-trigger="link"])')
            const taskInfo = this.which_task(taskDes)
            for (const info of taskInfo) {
              if (info.name !== 'nonSteam' && this.taskInfo[info.name + 's']) {
                this.taskInfo[info.name + 's'].push(info.link)
                this.taskInfo.links.push(info.link)
              }
            }
          }
          status.success()
          this.getFinalUrl(e)
        }
      },
      which_task (taskDes) {
        const [taskInfo, taskName, link] = [[], taskDes.text().trim(), taskDes.attr('href')]
        if (/disable adblock/gim.test(taskName)) {
          return [{ name: 'nonSteam' }]
        } else if (/join.*group/gim.test(taskName)) {
          taskInfo.push({ name: 'group', link })
          this.community = 1
        } else if (/like.*announcement/gim.test(taskName)) {
          taskInfo.push({ name: 'announcement', link })
          this.community = 1
        } else if (/follow.*publisher/gim.test(taskName)) {
          taskInfo.push({ name: 'publisher', link })
          this.store = 1
        } else if (/follow.*franchise/gim.test(taskName)) {
          taskInfo.push({ name: 'franchise', link })
          this.store = 1
        } else if (/follow.*developer/gim.test(taskName)) {
          taskInfo.push({ name: 'developer', link })
          this.store = 1
        } else if (/follow.*curator|subscribe.*curator/gim.test(taskName)) {
          taskInfo.push({ name: 'curator', link })
          this.store = 1
        } else {
          if (/(Subscribe.*YouTube)|(Like.*YouTube)|(Follow.*Instagram)|(on twitter)|(Join.*Discord.*server)|(Follow.*on.*Facebook)/gim.test(taskName)) {
            this.links.push(link)
          } else {
            if (/wishlist.*game|add.*wishlist/gim.test(taskName)) {
              taskInfo.push({ name: 'wGame', link })
              this.store = 1
            }
            if (/follow.*button/gim.test(taskName)) {
              taskInfo.push({ name: 'fGame', link })
              this.store = 1
            }
          }
          if (taskInfo.length === 0) return [{ name: 'nonSteam' }]
        }
        return taskInfo
      },
      getFinalUrl (e) {
        // 处理任务链接
        const [status, pro] = [fuc.echoLog({ type: 'custom', text: `<li>${getI18n('processTasksUrl')}<font></font></li>` }), []]

        for (const link of this.taskInfo.links) {
          pro.push(new Promise(resolve => {
            if (this.taskInfo.toFinalUrl[link]) {
              resolve({ result: 'success' })
            } else {
              fuc.getFinalUrl(resolve, link)
            }
          }))
        }
        Promise.all(pro).then(data => {
          for (const r of data) {
            if (r.finalUrl) {
              this.taskInfo.toFinalUrl[r.url] = r.finalUrl
            }
          }

          [
            this.links,
            this.taskInfo.groups,
            this.taskInfo.curators,
            this.taskInfo.publishers,
            this.taskInfo.developers,
            this.taskInfo.franchises,
            this.taskInfo.fGames,
            this.taskInfo.wGames,
            this.taskInfo.announcements,
            this.taskInfo.links
          ] = [
            fuc.unique(this.links),
            fuc.unique(this.taskInfo.groups),
            fuc.unique(this.taskInfo.curators),
            fuc.unique(this.taskInfo.publishers),
            fuc.unique(this.taskInfo.developers),
            fuc.unique(this.taskInfo.franchises),
            fuc.unique(this.taskInfo.fGames),
            fuc.unique(this.taskInfo.wGames),
            fuc.unique(this.taskInfo.announcements),
            fuc.unique(this.taskInfo.links)
          ]
          // 任务链接处理完成
          GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
          status.success()
          if (debug) console.log(this)
          e === 'doTask' ? this.do_task('fuck') : this.do_task('remove')
        }).catch(error => {
          status.error()
          if (debug) console.log(error)
        })
      },
      do_task (act) {
        if ($('div.bind-discord').is(':visible')) $('div.bind-discord a')[0].click()
        if ($('div.bind-twitch').is(':visible')) $('div.bind-twitch a')[0].click()
        new Promise(resolve => {
          if (this.taskInfo.groups.length > 0 || this.taskInfo.announcements.length > 0) {
            if (this.taskInfo.curators.length > 0 || this.taskInfo.publishers.length > 0 || this.taskInfo.developers.length > 0 || this.taskInfo.fGames.length > 0 || this.taskInfo.wGames.length > 0) {
              fuc.updateSteamInfo(resolve, 'all')
            } else {
              fuc.updateSteamInfo(resolve, 'community')
            }
          } else if (this.taskInfo.curators.length > 0 || this.taskInfo.publishers.length > 0 || this.taskInfo.developers.length > 0 || this.taskInfo.fGames.length > 0 || this.taskInfo.wGames.length > 0) {
            fuc.updateSteamInfo(resolve, 'store')
          } else {
            resolve(1)
          }
        }).then(s => {
          if (s === 1) {
            const pro = []
            if (this.conf[act][act === 'fuck' ? 'joinSteamGroup' : 'leaveSteamGroup'] && this.taskInfo.groups.length > 0) {
              pro.push(new Promise(resolve => {
                fuc.toggleActions({ website: 'giveawaysu', type: 'group', elements: this.taskInfo.groups, resolve, action: act, toFinalUrl: this.taskInfo.toFinalUrl })
              }))
            }
            if (this.conf[act][act === 'fuck' ? 'followCurator' : 'unfollowCurator'] && this.taskInfo.curators.length > 0) {
              pro.push(new Promise(resolve => {
                fuc.toggleActions({ website: 'giveawaysu', type: 'curator', elements: this.taskInfo.curators, resolve, action: act, toFinalUrl: this.taskInfo.toFinalUrl })
              }))
            }
            if (this.conf[act][act === 'fuck' ? 'followPublisher' : 'unfollowPublisher'] && this.taskInfo.publishers.length > 0) {
              pro.push(new Promise(resolve => {
                fuc.toggleActions({ website: 'giveawaysu', type: 'publisher', elements: this.taskInfo.publishers, resolve, action: act, toFinalUrl: this.taskInfo.toFinalUrl })
              }))
            }
            if (this.conf[act][act === 'fuck' ? 'followDeveloper' : 'unfollowDeveloper'] && this.taskInfo.developers.length > 0) {
              pro.push(new Promise(resolve => {
                fuc.toggleActions({ website: 'giveawaysu', type: 'developer', elements: this.taskInfo.developers, resolve, action: act, toFinalUrl: this.taskInfo.toFinalUrl })
              }))
            }
            if (this.conf[act][act === 'fuck' ? 'followFranchise' : 'unfollowFranchise'] && this.taskInfo.franchises.length > 0) {
              pro.push(new Promise(resolve => {
                fuc.toggleActions({ website: 'giveawaysu', type: 'franchise', elements: this.taskInfo.franchises, resolve, action: act, toFinalUrl: this.taskInfo.toFinalUrl })
              }))
            }
            if (this.conf[act][act === 'fuck' ? 'followGame' : 'unfollowGame'] && this.taskInfo.fGames.length > 0) {
              pro.push(new Promise(resolve => {
                fuc.toggleActions({ website: 'giveawaysu', type: 'game', elements: this.taskInfo.fGames, resolve, action: act, toFinalUrl: this.taskInfo.toFinalUrl })
              }))
            }
            if (this.conf[act][act === 'fuck' ? 'addToWishlist' : 'removeFromWishlist'] && this.taskInfo.wGames.length > 0) {
              pro.push(new Promise(resolve => {
                fuc.toggleActions({ website: 'giveawaysu', type: 'wishlist', elements: this.taskInfo.wGames, resolve, action: act, toFinalUrl: this.taskInfo.toFinalUrl })
              }))
            }
            if (act === 'fuck' && this.conf.fuck.likeAnnouncement && this.taskInfo.announcements.length > 0) {
              pro.push(new Promise(resolve => {
                fuc.toggleActions({ website: 'giveawaysu', type: 'announcement', elements: this.taskInfo.announcements, resolve, action: act, toFinalUrl: this.taskInfo.toFinalUrl })
              }))
            }
            Promise.all(pro).finally(() => {
              fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
              if (act === 'fuck') fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('closeExtensions')}</font></li>` })
            })
          }
        })
      },
      fuck () { this.get_tasks('doTask') },
      verify () { },
      remove () { this.get_tasks('remove') },
      get_giveawayId () {
        const id = window.location.href.match(/view\/([\d]+)/)
        return id?.[1] || window.location.href
      },
      checkLogin () {
        if ($('a.steam-login').length > 0) window.open('/steam/redirect', '_self')
      },
      checkLeft () {
        if ($('.giveaway-ended').length > 0) {
          Swal.fire({
            icon: 'warning',
            title: getI18n('notice'),
            text: getI18n('noKeysLeft'),
            confirmButtonText: getI18n('confirm'),
            cancelButtonText: getI18n('cancel'),
            showCancelButton: true
          }).then((result) => {
            if (result.value) {
              window.close()
            }
          })
        }
      },
      community: 0,
      store: 0,
      links: [], // 非steam任务
      taskInfo: {
        groups: [], // 任务需要加的组
        curators: [], // 任务需要关注的鉴赏家
        publishers: [], // 任务需要关注的发行商
        developers: [], // 任务需要关注的开发商
        franchises: [], // 任务需要关注的系列
        fGames: [], // 任务需要关注的游戏
        wGames: [], // 任务需要加愿望单的游戏
        announcements: [], // 任务需要点赞的通知
        links: [], // 原始链接
        toFinalUrl: {}// 链接转换
      },
      setting: {
        verify: {
          show: false
        }
      },
      conf: config?.giveawaysu?.enable ? config.giveawaysu : globalConf
    }

    const gleam = {
      test () { return window.location.host.includes('gleam.io') },
      fuck () { this.get_tasks('do_task') },
      get_tasks (callback = 'do_task') {
        const taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
        if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory
        if (callback === 'remove' && taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
          this.remove(true)
        } else {
          [this.twitters, this.facebooks, this.youtubes, this.discords, this.others, this.groups, this.links] = [[], [], [], [], [], [], []]

          const [
            status,
            tasksContainer
          ] = [
            fuc.echoLog({ type: 'custom', text: `<li>${getI18n('getTasksInfo')}<font></font></li>` }),
            $('div.entry-content .entry-method')
          ]

          for (const task of tasksContainer) { // 遍历任务信息
            if ($(task).find('i.fa-question').length > 0) {
              if ($(task).hasClass('visit') || $(task).find('span:contains(Visit):contains(seconds)').length > 0) {
                this.links.push(task)
              } else {
                const icon = $(task).find('.icon-wrapper i')
                if (icon.hasClass('fa-twitter')) {
                  this.twitters.push(task)
                } else if (icon.hasClass('fa-facebook')) {
                  this.facebooks.push(task)
                } else if (icon.hasClass('fa-youtube')) {
                  this.youtubes.push(task)
                } else if (icon.hasClass('fa-discord')) {
                  this.discords.push(task)
                } else if (icon.hasClass('fa-steam') || icon.hasClass('fa-steam-symbol')) {
                  const title = $(task).find('.entry-method-title')
                  if (/join.*group/gim.test(title.text())) {
                    const groupA = $(task).find("a[href*='steamcommunity.com/groups']:first").attr('href')
                    if (groupA) {
                      const groupName = groupA.match(/steamcommunity.com\/groups\/([\w\d\-_]*)/)[1]
                      this.groups.push(groupName)
                      this.taskInfo.groups.push(groupName)
                    } else {
                      fuc.echoLog({
                        type: 'custom',
                        text: `<li><font class="error">${getI18n('getGroupFailed')}</font></li>`
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
              const icon = $(task).find('.icon-wrapper i')
              if (icon.hasClass('fa-steam')) {
                const title = $(task).find('.entry-method-title')
                if (/join.*group/gim.test(title.text())) {
                  const groupA = $(task).find("a[href*='steamcommunity.com/groups']:first").attr('href')
                  if (groupA) {
                    const groupName = groupA.match(/steamcommunity.com\/groups\/([\w\d\-_]*)/)[1]
                    this.taskInfo.groups.push(groupName)
                  } else {
                    fuc.echoLog({
                      type: 'custom',
                      text: `<li><font class="error">${getI18n('getGroupFailed')}</font></li>`
                    })
                  }
                }
              }
            }
          }
          [
            this.groups,
            this.twitters,
            this.facebooks,
            this.youtubes,
            this.discords,
            this.others,
            this.taskInfo.groups
          ] = [
            fuc.unique(this.groups),
            fuc.unique(this.twitters),
            fuc.unique(this.facebooks),
            fuc.unique(this.youtubes),
            fuc.unique(this.discords),
            fuc.unique(this.others),
            fuc.unique(this.taskInfo.groups)
          ]

          GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
          status.success()
          if (debug) console.log(this)
          if (callback === 'do_task') {
            this.do_task()
          } else if (callback === 'verify') {
            this.verify(true)
          } else {
            !fuc.isEmptyObjArr(this.taskInfo) ? this.remove(true) : fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('cannotRemove')}</font></li>` })
          }
        }
      },
      do_task () {
        this.updateSteamInfo(() => {
          const [
            pro,
            twitters,
            discords,
            facebooks,
            youtubes,
            others,
            links
          ] = [
            [],
            fuc.unique(this.twitters),
            fuc.unique(this.discords),
            fuc.unique(this.facebooks),
            fuc.unique(this.youtubes),
            fuc.unique(this.others),
            fuc.unique(this.links)
          ]
          const socals = [...discords, ...facebooks, ...youtubes]
          if (this.conf.fuck.joinSteamGroup && this.groups.length > 0) {
            pro.push(new Promise(resolve => {
              fuc.toggleActions({ website: 'gleam', type: 'group', elements: this.groups, resolve, action: 'fuck' })
            }))
          }
          if (globalConf.other.autoOpen) {
            if (twitters.length > 0) {
              for (const twitter of twitters) {
                const title = $(twitter).find('.entry-method-title').text().trim()
                const [
                  status,
                  followButton,
                  retweetButton
                ] = [
                  fuc.echoLog({ type: 'custom', text: `<li>${getI18n('doing')}:${title}...<font></font></li>` }),
                  $(twitter).find('a.twitter-button:contains(Follow)').attr('href'),
                  $(twitter).find('a.twitter-button:contains(Retweet)').attr('href')
                ]
                const button = followButton || retweetButton
                if (button) {
                  window.open(button, '_blank')
                  status.warning(getI18n('openPage'))
                } else {
                  status.error(getI18n('getTaskUrlFailed'))
                }
              }
            }
            if (socals.length > 0) {
              for (const task of socals) {
                const title = $(task).find('.entry-method-title').text().trim()
                const [
                  status,
                  button
                ] = [
                  fuc.echoLog({ type: 'custom', text: `<li>${getI18n('doing')}:${title}...<font></font></li>` }),
                  $(task).find('a.btn-info:first').attr('href')
                ]
                if (button) {
                  window.open(button, '_blank')
                  status.warning(getI18n('openPage'))
                } else {
                  status.error(getI18n('getTaskUrlFailed'))
                }
              }
            }
          }
          if ((globalConf.other.autoOpen || this.conf.fuck.visit) && links.length > 0) {
            pro.push(new Promise(resolve => {
              this.visit_link(links, 0, resolve)
            }))
          }
          for (const other of others) {
            const icon = $(other).find('.icon-wrapper i')
            if (icon.hasClass('fa-steam')) {
              const title = $(other).find('.entry-method-title').text().trim()
              fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('unknowntype')}:${title}</font></li>` })
            } else {
              const taskType = icon.attr('class').match(/fa-([\w]+)/) ? icon.attr('class').match(/fa-([\w]+)/)[1] : icon.attr('class')
              fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('unknowntype')}:${taskType}</font></li>` })
            }
          }
          Promise.all(pro).finally(() => {
            fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
            if (this.conf.fuck.verifyTask) this.verify(0)
          })
        })
      },
      verify (i = 0) {
        if ($('.ng-scope[ng-include*=challenge]').is(':visible')) {
          fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n('notRobot')}</font></li>` })
          return
        }
        const tasks = $('div.entry-content .entry-method')
        if (i < tasks.length) {
          if (tasks.eq(i).find('i.fa-question').length > 0) {
            const title = tasks.eq(i).find('.entry-method-title').text().trim()
            const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('verifyingTask')}:${title}...<font></font></li>` })
            tasks.eq(i).find('a.enter-link')[0].click()
            const enterBtn = tasks.eq(i).find('.form-actions.center .btn-primary:contains(Continue)').removeAttr('disabled')
            if (enterBtn.length > 0) {
              setTimeout(() => {
                enterBtn[0].click()
                status.warning('Complete')
                setTimeout(() => { gleam.verify(++i) }, 1000)
              }, 1000)
            } else {
              setTimeout(() => { gleam.verify(++i) }, 1000)
            }
          } else {
            this.verify(++i)
          }
        } else {
          fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font><font class="warning">${getI18n('finishSelf')}</font></li>` })
        }
      },
      remove (remove = false) {
        const pro = []
        if (remove) {
          this.updateSteamInfo(() => {
            if (this.conf.remove.leaveSteamGroup && this.taskInfo.groups.length > 0) {
              pro.push(new Promise(resolve => {
                fuc.toggleActions({ website: 'gleam', type: 'group', elements: this.taskInfo.groups, resolve, action: 'remove' })
              }))
            }
            Promise.all(pro).finally(() => {
              fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
            })
          })
        } else {
          this.get_tasks('remove')
        }
      },
      visit_link (links, i, r) {
        if (i < links.length) {
          const title = $(links[i]).find('.entry-method-title').text().trim()
          const [
            status,
            taskTime
          ] = [
            fuc.echoLog({ type: 'custom', text: `<li>${getI18n('doing')}:${title}...<font></font></li>` }),
            $(links[i]).find('.form-actions.center span:contains(Visit):contains(seconds)').text()
          ]
          if (taskTime) {
            const taskBtn = $(links[i]).find('a.btn-info')
            const href = taskBtn.attr('href')
            taskBtn.removeAttr('href')[0].click()
            const time = taskTime.match(/[\d]+/)
            if (time) {
              const url = language === 'en' ? 'https://userjs.hclonely.com/time_en.html?time=' : 'https://userjs.hclonely.com/time.html?time='
              GM_openInTab(url + time[0], { active: 1, setParent: 1 }).onclose = () => {
                status.warning('Complete')
                taskBtn.attr('target', '_blank').attr('href', href)
                gleam.visit_link(links, ++i, r)
              }
            } else {
              GM_openInTab('javascript:setTimeout(()=>{window.close()},1000)', { active: 1, setParent: 1 }).onclose = () => {
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
      get_giveawayId () {
        return window.location.pathname.replace(/\?.*/, '') || window.location.href
      },
      updateSteamInfo (callback) {
        new Promise(resolve => {
          if (this.taskInfo.groups.length > 0) {
            fuc.updateSteamInfo(resolve, 'community')
          } else {
            resolve(1)
          }
        }).then(s => {
          if (s === 1) callback()
        }).catch(err => {
          console.error(err)
        })
      },
      checkLeft () {
        if ($('.massive-message:contains(ended)').is(':visible')) {
          Swal.fire({
            icon: 'warning',
            title: getI18n('notice'),
            text: getI18n('noKeysLeft'),
            confirmButtonText: getI18n('confirm'),
            cancelButtonText: getI18n('cancel'),
            showCancelButton: true
          }).then((result) => {
            if (result.value) {
              window.close()
            }
          })
        }
      },
      groups: [], // 任务需要加的组
      links: [], // 需要浏览的页面链接
      twitters: [], // twitter任务
      discords: [], // discord任务
      facebooks: [], // facebook任务
      youtubes: [], // youtube任务
      others: [], // 位置类型任务
      taskInfo: {
        groups: []// 所有任务需要加的组
      },
      tasks: [], // 任务信息
      setting: {},
      conf: config?.gleam?.enable ? config.gleam : globalConf
    }

    const indiedb = {
      test () { return window.location.host.includes('indiedb') },
      fuck () {
        if ($('a.buttonenter:contains(Register to join)').length > 0) fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n('needLogin')}</font></li>` })
        const currentoption = $('a.buttonenter.buttongiveaway')
        if (/join giveaway/gim.test(currentoption.text())) {
          const [
            status,
            doTask
          ] = [
            fuc.echoLog({ type: 'custom', text: `<li>${getI18n('joinGiveaway')}<font></font></li>` }),
            this.do_task
          ]
          fuc.httpRequest({
            url: currentoption.attr('href'),
            method: 'POST',
            data: 'ajax=t',
            dataType: 'json',
            headers: {
              'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
              accept: 'application/json, text/javascript, */*; q=0.01'
            },
            onload (response) {
              if (debug) console.log(response)
              if (response.status === 200) {
                if (response.response?.success) {
                  currentoption.addClass('buttonentered').text('Success - Giveaway joined')
                  $('#giveawaysjoined').slideDown()
                  $('#giveawaysrecommend').slideDown()
                  status.success('Success' + (response.response?.text ? (':' + response.response?.text) : ''))
                  doTask()
                } else {
                  status.error('Error' + (response.response?.text ? (':' + response.response?.text) : ''))
                }
              } else {
                status.error('Error:' + (response.statusText || response.status))
              }
            }
          })
        } else if (/success/gim.test($('a.buttonenter.buttongiveaway').text())) {
          this.do_task()
        } else {
          fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n('needJoinGiveaway')}</font></li>` })
        }
      },
      do_task () {
        const id = $('script').map((i, e) => {
          if (/\$\(document\)/gim.test(e.innerHTML)) {
            return [
              e.innerHTML.match(/"\/[\d]+"/gim)[0].match(/[\d]+/)[0],
              e.innerHTML.match(/"\/newsletter\/ajax\/subscribeprofile\/optin\/[\d]+"/gim)[0].match(/[\d]+/)[0]
            ]
          }
        })
        if (id.length === 2) {
          const [tasks, pro] = [$('#giveawaysjoined a[class*=promo]'), []]
          for (const task of tasks) {
            const promo = $(task)
            if (!promo.hasClass('buttonentered')) {
              const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('doing')}:${promo.parents('p').text()}...<font></font></li>` })
              if (/facebookpromo|twitterpromo|visitpromo/gim.test(task.className)) {
                pro.push(new Promise(resolve => {
                  $.ajax({
                    type: 'POST',
                    url: urlPath('/giveaways/ajax/' + (promo.hasClass('facebookpromo') ? 'facebookpromo' : (promo.hasClass('twitterpromo') ? 'twitterpromo' : 'visitpromo')) + '/' + id[0]),
                    timeout: 60000,
                    dataType: 'json',
                    data: { ajax: 't' },
                    error (response, error, exception) {
                      if (debug) console.log({ response, error, exception })
                      status.error('Error:An error has occurred performing the action requested. Please try again shortly.')
                      resolve(0)
                    },
                    success (response) {
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
                pro.push(new Promise(resolve => {
                  $.ajax({
                    type: 'POST',
                    url: urlPath('/newsletter/ajax/subscribeprofile/optin/' + id[1]),
                    timeout: 60000,
                    dataType: 'json',
                    data: { ajax: 't', emailsystoggle: 4 },
                    error (response, error, exception) {
                      if (debug) console.log({ response, error, exception })
                      status.error('Error:An error has occurred performing the action requested. Please try again shortly.')
                      resolve(0)
                    },
                    success (response) {
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
                pro.push(new Promise(resolve => {
                  const data = fuc.getUrlQuery(promo.attr('href'))
                  data.ajax = 't'
                  $.ajax({
                    type: 'POST',
                    url: urlPath(promo.attr('href').split(/[?#]/)[0]),
                    timeout: 60000,
                    dataType: 'json',
                    data: data,
                    error (response, error, exception) {
                      if (debug) console.log({ response, error, exception })
                      status.error('Error:An error has occurred performing the action requested. Please try again shortly.')
                      resolve(0)
                    },
                    success (response) {
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
                pro.push(new Promise(resolve => {
                  $.ajax({
                    type: 'POST',
                    url: urlPath(promo.attr('href')),
                    timeout: 60000,
                    dataType: 'json',
                    data: { ajax: 't' },
                    error (response, error, exception) {
                      if (debug) console.log({ response, error, exception })
                      status.error('Error:An error has occurred performing the action requested. Please try again shortly.')
                      resolve(0)
                    },
                    success (response) {
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
          Promise.all(pro).finally(() => {
            fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('allTasksComplete')}</font></li>` })
          })
        } else {
          fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n('getIdFailed')}</font></li>` })
        }
      },
      checkLogin () {
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
      conf: config?.indiedb?.enable ? config.indiedb : globalConf
    }

    const marvelousga = {
      test () { return (window.location.host.includes('marvelousga') || window.location.host.includes('dupedornot')) },
      before () { fuc.newTabBlock() },
      fuck () { this.get_tasks('do_task') },
      get_tasks (callback = 'do_task') {
        const taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
        if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory
        if (callback === 'remove' && taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
          this.remove(true)
        } else {
          [this.tasks, this.groups, this.curators, this.links] = [[], [], [], []]

          const [
            status,
            tasksContainer
          ] = [
            fuc.echoLog({ type: 'custom', text: `<li>${getI18n('getTasksInfo')}<font></font></li>` }),
            $('.container_task')
          ]

          for (const task of tasksContainer) { // 遍历任务信息
            const [
              taskDes,
              verifyBtn
            ] = [
              $(task).find('.card-body p.card-text.monospace'),
              $(task).find('button[id^=task_]:not(:contains(VERIFIED))')
            ]
            if (/join[\w\W]*?steamcommunity.com\/groups/gim.test(taskDes.html())) { // 加组任务
              const groupName = taskDes.find('a[href*="steamcommunity.com/groups"]').attr('href').match(/steamcommunity.com\/groups\/([\w\d\-_]*)/)[1]
              if (verifyBtn.length > 0) {
                this.groups.push(groupName)
              }
              this.taskInfo.groups.push(groupName)
            }
            if (/follow[\w\W]*?store.steampowered.com\/curator/gim.test(taskDes.html())) { // 关注鉴赏家任务
              const curatorName = taskDes.find('a[href*="store.steampowered.com/curator"]').attr('href').match(/store.steampowered.com\/curator\/([\d]*)/)[1]
              if (verifyBtn.length > 0) {
                this.curators.push(curatorName)
              }
              this.taskInfo.curators.push(curatorName)
            }
            if (/visit.*?this.*?page/gim.test(taskDes.text()) && verifyBtn.length > 0) { // 浏览页面任务
              const pageUrl = taskDes.find('a[id^="task_webpage_clickedLink"]').attr('href')
              this.links.push({ pageUrl: pageUrl, taskId: verifyBtn.attr('id').split('_')[3] })
            }
            if (verifyBtn.length > 0) { // 任务验证信息
              const ids = verifyBtn.attr('id').split('_')
              const [provider, taskRoute, taskId] = [ids[1], ids[2], ids[3]]
              this.tasks.push({ provider, taskRoute, taskId, taskDes: taskDes.html() })
            }
          }
          [
            this.groups,
            this.curators,
            this.links,
            this.taskInfo.groups,
            this.taskInfo.curators,
            this.tasks
          ] = [
            fuc.unique(this.groups),
            fuc.unique(this.curators),
            fuc.unique(this.links),
            fuc.unique(this.taskInfo.groups),
            fuc.unique(this.taskInfo.curators),
            fuc.unique(this.tasks)
          ]
          GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
          status.success()
          if (debug) console.log(this)
          if (callback === 'do_task') {
            if (this.tasks.length === 0) {
              fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
              if (this.conf.fuck.verifyTask) this.verify()
            } else {
              this.do_task()
            }
          } else if (callback === 'verify') {
            this.tasks.length > 0 ? this.verify(true) : fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('verifyTasksComplete')}</font></li>` })
          } else {
            !fuc.isEmptyObjArr(this.taskInfo) ? this.remove(true) : fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('cannotRemove')}</font></li>` })
          }
        }
      },
      do_task () {
        this.updateSteamInfo(async () => {
          const [pro, links] = [[], fuc.unique(this.links)]
          await this.toggleActions('fuck', pro)
          if (this.conf.fuck.visitLink) {
            for (const link of links) {
              pro.push(new Promise(resolve => {
                fuc.visitLink(resolve, link.pageUrl, {
                  url: '/ajax/verifyTasks/webpage/clickedLink',
                  method: 'POST',
                  headers: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'x-csrf-token': $('meta[name="csrf-token"]').attr('content')
                  },
                  data: $.param({
                    giveaway_slug: this.get_giveawayId(),
                    giveaway_task_id: link.taskId
                  })
                })
              }))
            }
          }
          Promise.all(pro).finally(() => {
            fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
            if (this.conf.fuck.verifyTask) this.verify()
          })
        })
      },
      verify (verify = false) {
        if (verify) {
          const pro = []
          for (const task of fuc.unique(this.tasks)) {
            const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('verifyingTask')}${task.taskDes}...<font></font></li>` })
            pro.push(new Promise(resolve => {
              fuc.httpRequest({
                url: '/ajax/verifyTasks/' + task.provider + '/' + task.taskRoute,
                method: 'POST',
                dataType: 'json',
                headers: {
                  'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                  'x-csrf-token': $('meta[name="csrf-token"]').attr('content')
                },
                data: $.param({
                  giveaway_slug: this.get_giveawayId(),
                  giveaway_task_id: task.taskId
                }),
                onload (response) {
                  if (debug) console.log(response)
                  if (response.status === 200) {
                    if (response.response.status === 1) {
                      $(`#task_${task.provider}_${task.taskRoute}_${task.taskId}`).text('VERIFIED')
                      status.success(response.response.percentageNanoBar.toFixed(2) + '%')
                      resolve({ result: 'success', statusText: response.statusText, status: response.status })
                    } else {
                      status.error('Error:' + (response.response.message || 'error'))
                      if (globalConf.other.autoOpen) {
                        if (/Visit[\w\W]*?this[\w\W]*?webpage/gim.test(task.taskDes)) {
                          $(`task_webpage_clickedLink_${task.taskId}`).click()
                        } else {
                          window.open($(`<div>${task.taskDes}</div>`).find('a').attr('href'), '_blank')
                        }
                      }
                      resolve({ result: 'error', statusText: response.statusText, status: response.status })
                    }
                  } else {
                    status.error('Error:' + (response.response.message || response.statusText || response.status))
                    if (globalConf.other.autoOpen) {
                      if (/Visit[\w\W]*?this[\w\W]*?webpage/gim.test(task.taskDes)) {
                        $(`task_webpage_clickedLink_${task.taskId}`).click()
                      } else {
                        window.open($(`<div>${task.taskDes}</div>`).find('a').attr('href'), '_blank')
                      }
                    }
                    resolve({ result: 'error', statusText: response.statusText, status: response.status })
                  }
                },
                r: resolve,
                status
              })
            }))
          }
          Promise.all(pro).finally(() => {
            fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('verifyTasksComplete')}</font><font class="warning">${getI18n('doYourself')}<a class="hclonely-google" href="javascript:void(0)" target="_self">${getI18n('googleVerify')}</a>${getI18n('getKey')}!</font></li>` })
            $('#get_key_container').show()
            $('.hclonely-google').unbind()
            $('.hclonely-google').click(() => { $('#get_key_container')[0].scrollIntoView() })
          })
        } else {
          this.get_tasks('verify')
        }
      },
      remove (remove = false) {
        const pro = []
        if (remove) {
          this.updateSteamInfo(async () => {
            await this.toggleActions('remove', pro)
            Promise.all(pro).finally(() => {
              fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
            })
          })
        } else {
          this.get_tasks('remove')
        }
      },
      toggleActions (action, pro) {
        const [groups, curators] = action === 'fuck'
          ? [this.groups, this.curators]
          : [this.taskInfo.groups, this.taskInfo.curators]
        if (this.conf[action][action === 'fuck' ? 'joinSteamGroup' : 'leaveSteamGroup'] && groups.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'marvelousga', type: 'group', elements: groups, resolve, action })
          }))
        }
        if (this.conf[action][action === 'fuck' ? 'followCurator' : 'unfollowCurator'] && curators.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'marvelousga', type: 'curator', elements: curators, resolve, action })
          }))
        }
      },
      get_giveawayId () {
        return $('#giveawaySlug').val() || window.location.href
      },
      updateSteamInfo (callback) {
        new Promise(resolve => {
          if (this.taskInfo.groups.length > 0) {
            if (this.taskInfo.curators.length > 0) {
              fuc.updateSteamInfo(resolve, 'all')
            } else {
              fuc.updateSteamInfo(resolve, 'community')
            }
          } else if (this.taskInfo.curators.length > 0) {
            fuc.updateSteamInfo(resolve, 'store')
          } else {
            resolve(1)
          }
        }).then(s => {
          if (s === 1) callback()
        }).catch(err => {
          console.error(err)
        })
      },
      checkLogin () {
        if ($('a[href*=login]').length > 0) window.open('/login', '_self')
      },
      checkLeft () {
        if ($('h3.text-danger:contains(this giveaway is closed)').length > 0) {
          $('#link_to_click').remove()
          Swal.fire({
            icon: 'warning',
            title: getI18n('notice'),
            text: getI18n('noKeysLeft'),
            confirmButtonText: getI18n('confirm'),
            cancelButtonText: getI18n('cancel'),
            showCancelButton: true
          }).then((result) => {
            if (result.value) {
              window.close()
            }
          })
        }
      },
      groups: [], // 任务需要加的组
      curators: [], // 任务需要关注的鉴赏家
      links: [], // 需要浏览的页面链接
      taskInfo: {
        groups: [], // 所有任务需要加的组
        curators: []// 所有任务需要关注的鉴赏家
      },
      tasks: [], // 任务信息
      setting: {},
      conf: config?.marvelousga?.enable ? config.marvelousga : globalConf
    }

    const opiumpulses = {
      test () { return window.location.host.includes('opiumpulses') },
      fuck () { this.get_tasks('FREE') },
      async get_tasks (type = 'FREE') {
        const [
          items,
          maxPoint
        ] = [
          $(`.giveaways-page-item:contains('${type}'):not(:contains('ENTERED'))`),
          this.maxPoint()
        ]
        let myPoint = this.myPoints
        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          const needPoints = $(item).find('.giveaways-page-item-header-points').text().match(/[\d]+/gim)
          if (type === 'points' && needPoints && parseInt(needPoints[0]) > myPoint) {
            fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('noPoints')}</font></li>` })
          } else if (type === 'points' && !needPoints) {
            fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('getNeedPointsFailed')}</font></li>` })
          } else if (!(type === 'points' && parseInt(needPoints[0]) > maxPoint)) {
            const [
              status,
              a
            ] = [
              fuc.echoLog({ type: 'custom', text: `<li>${getI18n('joinLottery')}<a href="${$(item).find('a.giveaways-page-item-img-btn-more').attr('href')}" target="_blank">${$(item).find('.giveaways-page-item-footer-name').text().trim()}</a>...<font></font></li>` }),
              $(item).find("a.giveaways-page-item-img-btn-enter:contains('enter')")
            ]
            if (a.attr('onclick') && a.attr('onclick').includes('checkUser')) {
              const giveawayId = a.attr('onclick').match(/[\d]+/)
              if (giveawayId) checkUser(giveawayId[0])
            }
            await new Promise(resolve => {
              fuc.httpRequest({
                url: a.attr('href'),
                method: 'GET',
                onload (response) {
                  if (debug) console.log(response)
                  if (response.responseText && /You've entered this giveaway/gim.test(response.responseText)) {
                    status.success()
                    const points = response.responseText.match(/Points:[\s]*?([\d]+)/)
                    if (type === 'points' && points) {
                      if (debug) console.log(getI18n('pointsLeft') + points[1])
                      myPoint = parseInt(points[1])
                    }
                  } else {
                    status.error('Error:' + (response.status || response.statusText))
                  }
                  resolve(1)
                },
                status,
                r: resolve
              })
            }).then(data => {
              return true
            }).catch(() => {
              return false
            })
          }
        }
        fuc.echoLog({ type: 'custom', text: '<li>-----END-----</li>' })
      },
      verify () {
        const myPoints = $('.page-header__nav-func-user-nav-items.points-items').text().match(/[\d]+/gim)
        if (myPoints) {
          this.myPoints = Number(myPoints[0])
          this.get_tasks('points')
        } else {
          fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n('getPointsFailed')}</font></li>` })
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
      conf: config?.opiumpulses?.enable ? config.opiumpulses : globalConf,
      maxPoint () { return this.conf?.other?.limitPoint ? Number(this.conf.other.limitPoint) : Infinity }
    }

    const prys = {
      test () { return window.location.host.includes('prys.revadike') },
      fuck () { this.get_tasks('do_task') },
      get_tasks (callback = 'do_task') {
        const [
          status,
          steps
        ] = [
          fuc.echoLog({ type: 'custom', text: `<li>${getI18n('getTasksInfo')}<font></font></li>` }),
          $('#steps tbody tr')
        ]
        for (let i = 0; i < steps.length; i++) {
          if (steps.eq(i).find('span:contains(Success)').length === 0) checkClick(i)
        }
        if (callback === 'do_task') {
          [this.groups, this.curators] = [[], []]
          const [
            taskInfoHistory,
            pro
          ] = [
            GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']'),
            []
          ]
          if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory

          for (const step of steps) {
            if ($(step).find('span:contains(Success)').length === 0) {
              if ($(step).find("a[href*='store.steampowered.com/curator/']").length > 0) {
                const link = $(step).find("a[href*='store.steampowered.com/curator/']").attr('href')
                const curatorId = link.match(/curator\/([\d]+)/)
                if (curatorId) {
                  this.curators.push(curatorId[1])
                  this.taskInfo.curators.push(curatorId[1])
                }
              } else if ($(step).find("a[href*='steampowered.com/groups/']").length > 0) {
                const link = $(step).find("a[href*='steampowered.com/groups/']").attr('href')
                const groupName = link.match(/groups\/(.+)\/?/)
                if (groupName) {
                  this.groups.push(groupName[1])
                  this.taskInfo.groups.push(groupName[1])
                }
              } else if ($(step).find("a[href*='steamcommunity.com/gid']").length > 0) {
                const link = $(step).find("a[href*='steamcommunity.com/gid']").attr('href')
                pro.push(new Promise(r => {
                  new Promise(resolve => {
                    fuc.getFinalUrl(resolve, link)
                  }).then(data => {
                    if (data.result === 'success') {
                      const groupName = data.finalUrl.match(/groups\/(.+)\/?/)
                      if (groupName) {
                        this.groups.push(groupName[1])
                        this.taskInfo.groups.push(groupName[1])
                      }
                    }
                    r(1)
                  }).catch(() => {
                    r(1)
                  })
                }))
              }
            }
          }
          if (pro.length > 0) {
            Promise.all(pro).finally(() => {
              [
                this.groups,
                this.curators,
                this.taskInfo.groups,
                this.taskInfo.curators
              ] = [
                fuc.unique(this.groups),
                fuc.unique(this.curators),
                fuc.unique(this.taskInfo.groups),
                fuc.unique(this.taskInfo.curators)
              ]
              GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
              if (this.groups.length > 0 || this.curators.length > 0) {
                this.do_task()
              } else {
                fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
                if (this.conf.fuck.verifyTask) this.verify()
              }
            })
          } else {
            [
              this.groups,
              this.curators,
              this.taskInfo.groups,
              this.taskInfo.curators
            ] = [
              fuc.unique(this.groups),
              fuc.unique(this.curators),
              fuc.unique(this.taskInfo.groups),
              fuc.unique(this.taskInfo.curators)
            ]
            GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
            if (this.groups.length > 0 || this.curators.length > 0) {
              this.do_task()
            } else {
              fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
              if (this.conf.fuck.verifyTask) this.verify()
            }
          }
        } else if (callback === 'verify') {
          this.tasks = []
          const checks = $('#steps tbody a[id^=check]')
          if (checks.length > 0) {
            for (const check of checks) {
              const id = $(check).attr('id').match(/[\d]+/)
              if (id) this.tasks.push({ id: id[0], taskDes: $(check).parent().prev().html().trim() })
            }
            this.verify(true)
          } else {
            fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('prysAllTasksComplete')}</font></li>` })
          }
        } else if (callback === 'remove') {
          const taskInfo = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
          if (taskInfo && !fuc.isEmptyObjArr(taskInfo)) {
            this.taskInfo = taskInfo
            this.remove(true)
          } else {
            const pro = []
            for (const step of steps) {
              if ($(step).find("a[href*='store.steampowered.com/curator/']").length > 0) {
                const link = $(step).find("a[href*='store.steampowered.com/curator/']").attr('href')
                const curatorId = link.match(/curator\/([\d]+)/)
                if (curatorId) this.taskInfo.curators.push(curatorId[1])
              } else if ($(step).find("a[href*='steampowered.com/groups/']").length > 0) {
                const link = $(step).find("a[href*='steampowered.com/groups/']").attr('href')
                const groupName = link.match(/groups\/(.+)\/?/)
                if (groupName) this.taskInfo.groups.push(groupName[1])
              } else if ($(step).find("a[href*='steamcommunity.com/gid']").length > 0) {
                const link = $(step).find("a[href*='steamcommunity.com/gid']").attr('href')
                pro.push(new Promise(r => {
                  new Promise(resolve => {
                    fuc.getFinalUrl(resolve, link)
                  }).then(data => {
                    if (data.result === 'success') {
                      const groupName = data.finalUrl.match(/groups\/(.+)\/?/)
                      if (groupName) {
                        this.taskInfo.groups.push(groupName[1])
                      }
                    }
                    r(1)
                  })
                }))
              }
            }
            if (pro.length > 0) {
              Promise.all(pro).finally(() => {
                [this.taskInfo.groups, this.taskInfo.curators] = [fuc.unique(this.taskInfo.groups), fuc.unique(this.taskInfo.curators)]
                GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
                if (this.taskInfo.groups.length > 0 || this.taskInfo.curators.length > 0) {
                  this.remove(true)
                } else {
                  fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('cannotRemove')}</font></li>` })
                }
              })
            } else {
              [this.taskInfo.groups, this.taskInfo.curators] = [fuc.unique(this.taskInfo.groups), fuc.unique(this.taskInfo.curators)]
              GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
              if (this.taskInfo.groups.length > 0 || this.taskInfo.curators.length > 0) {
                this.remove(true)
              } else {
                fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('cannotRemove')}</font></li>` })
              }
            }
          }
        } else {
          fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n('unknown')}！</font></li>` })
        }
        status.success()
        if (debug) console.log(this)
      },
      do_task () {
        this.updateSteamInfo(async () => {
          const pro = []
          await this.toggleActions('fuck', pro)
          Promise.all(pro).finally(() => {
            fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
            if (this.conf.fuck.verifyTask) this.verify()
          })
        })
      },
      verify (verify = false) {
        if (verify) {
          const pro = []
          for (const task of fuc.unique(this.tasks)) {
            const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('verifyingTask')}${task.taskDes}...<font></font></li>` })
            pro.push(new Promise(resolve => {
              this.checkStep(task.id, resolve, status)
            }))
          }
          Promise.all(pro).finally(() => {
            fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('prysAllTasksComplete')}</font></li>` })
          })
        } else {
          this.get_tasks('verify')
        }
      },
      checkStep (step, r, status, captcha) {
        if (!captcha) captcha = null
        if (step !== 'captcha') {
          $('#check' + step).replaceWith('<span id="check' + step + '"><i class="fa fa-refresh fa-spin fa-fw"></i> Checking...</span>')
        }
        $.post('/api/check_step', {
          step: step,
          id: getURLParameter('id'),
          'g-recaptcha-response': captcha
        }, json => {
          r(1)
          if (json.success && step !== 'captcha') {
            $('#check' + step).replaceWith('<span class="text-success" id="check' + step + '"><i class="fa fa-check"></i> Success</span>')
            status.success()
          } else if (step !== 'captcha') {
            $('#check' + step).replaceWith('<a id="check' + step + '" href="javascript:checkStep(' + step + ')"><i class="fa fa-question"></i> Check</a>')
            status.error((json.response ? json.response.error ? json.response.error : 'Error' : 'Error'))
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
        }).fail(() => {
          r(1)
          $('#check' + step).replaceWith('<a id="check' + step + '" href="javascript:checkStep(' + step + ')"><i class="fa fa-question"></i> Check</a>')
          status.error('Error:0')
        })
      },
      remove (remove = false) {
        const pro = []
        if (remove) {
          this.updateSteamInfo(async () => {
            await this.toggleActions('remove', pro)
            Promise.all(pro).finally(() => {
              fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
            })
          })
        } else {
          this.get_tasks('remove')
        }
      },
      toggleActions (action, pro) {
        const groups = action === 'fuck' ? this.groups : this.taskInfo.groups
        const curators = action === 'fuck' ? this.curators : this.taskInfo.curators
        if (this.conf[action][action === 'fuck' ? 'joinSteamGroup' : 'leaveSteamGroup'] && groups.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'prys', type: 'group', elements: groups, resolve, action })
          }))
        }
        if (this.conf[action][action === 'fuck' ? 'followCurator' : 'unfollowCurator'] && curators.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'prys', type: 'curator', elements: curators, resolve, action })
          }))
        }
      },
      get_giveawayId () {
        const id = window.location.search.match(/id=([\d]+)/)
        return id?.[1] || window.location.href
      },
      updateSteamInfo (callback) {
        new Promise(resolve => {
          if (this.taskInfo.groups.length > 0) {
            if (this.taskInfo.curators.length > 0) {
              fuc.updateSteamInfo(resolve, 'all')
            } else {
              fuc.updateSteamInfo(resolve, 'community')
            }
          } else if (this.taskInfo.curators.length > 0) {
            fuc.updateSteamInfo(resolve, 'store')
          } else {
            resolve(1)
          }
        }).then(s => {
          if (s === 1) callback()
        }).catch(err => {
          console.error(err)
        })
      },
      checkLeft () {
        const left = $('#header').text().match(/([\d]+).*?prize.*?left/)
        if (!(left.length > 0 && left[1] !== '0')) {
          Swal.fire({
            icon: 'warning',
            title: getI18n('notice'),
            text: getI18n('noKeysLeft'),
            confirmButtonText: getI18n('confirm'),
            cancelButtonText: getI18n('cancel'),
            showCancelButton: true
          }).then((result) => {
            if (result.value) {
              window.close()
            }
          })
        }
      },
      groups: [], // 任务需要加的组
      curators: [], // 任务需要关注的鉴赏家
      taskInfo: {
        groups: [], // 所有任务需要加的组
        curators: []// 所有任务需要关注的鉴赏家
      },
      tasks: [], // 任务信息
      setting: {},
      conf: config?.prys?.enable ? config.prys : globalConf
    }

    const takekey = {
      test () { return window.location.host.includes('takekey') },
      fuck () { this.get_tasks('do_task') },
      get_tasks (callback = 'do_task') {
        const taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
        if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory
        if (callback === 'remove' && taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
          this.remove(true)
        } else {
          [this.tasks, this.groups, this.curators, this.links] = [[], [], [], []]
          const [
            pro,
            status,
            tasksContainer
          ] = [
            [],
            fuc.echoLog({ type: 'custom', text: `<li>${getI18n('getTasksInfo')}<font></font></li>` }),
            $('#usl>div')
          ]

          for (const task of tasksContainer) { // 遍历任务信息
            this.tasks.push(task)
            const [
              icon,
              link,
              id
            ] = [
              $(task).find('i'),
              $(task).children('a[id]').attr('href'),
              $(task).children('a[id]').attr('id')
            ]
            if (icon.hasClass('fa-steam')) {
              if (link && /gid\/[\d]+/.test(link)) {
                pro.push(new Promise(r => {
                  new Promise(resolve => {
                    fuc.getFinalUrl(resolve, link)
                  }).then(data => {
                    if (data.result === 'success') {
                      const groupName = data.finalUrl.match(/steamcommunity.com\/groups\/([\w\d\-_]*)/)[1]
                      if (groupName) {
                        this.groups.push(groupName)
                        this.taskInfo.groups.push(groupName)
                        r(1)
                      } else {
                        r(0)
                      }
                    } else {
                      r(0)
                    }
                  }).catch(() => {
                    r(0)
                  })
                }))
              }
            } else if (icon.hasClass('fa-link')) {
              this.links.push(id)
            } else if (icon.hasClass('fa-vk')) {
              this.vks.push(link)
            } else {
              this.others.push(icon)
            }
          }
          Promise.all(pro).finally(() => {
            [
              this.groups,
              this.curators,
              this.links,
              this.others,
              this.taskInfo.groups,
              this.taskInfo.curators,
              this.tasks
            ] = [
              fuc.unique(this.groups),
              fuc.unique(this.curators),
              fuc.unique(this.links),
              fuc.unique(this.others),
              fuc.unique(this.taskInfo.groups),
              fuc.unique(this.taskInfo.curators),
              fuc.unique(this.tasks)
            ]
            GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
            status.success()
            if (debug) console.log(this)
            if (callback === 'do_task') {
              if (this.tasks.length === 0) {
                fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
                if (this.conf.fuck.verifyTask) this.verify()
              } else {
                this.do_task()
              }
            } else {
              !fuc.isEmptyObjArr(this.taskInfo) ? this.remove(true) : fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('cannotRemove')}</font></li>` })
            }
          })
        }
      },
      do_task () {
        this.updateSteamInfo(async () => {
          const [
            pro,
            links,
            others,
            vks
          ] = [
            [],
            fuc.unique(this.links),
            fuc.unique(this.others),
            fuc.unique(this.vks)
          ]
          await this.toggleActions('fuck', pro)
          if (this.conf.fuck.visit) {
            for (const link of links) {
              const a = $(`a[id='${link}']`).attr('onclick', 'return false;')
              a[0].click()
              a.removeAttr('onclick')
              pro.push(new Promise(resolve => {
                fuc.visitLink(resolve, $(`a[id='${link}']`).attr('href'))
              }))
            }
          }
          if (globalConf.other.autoOpen) {
            for (const vk of vks) {
              window.open(vk, '_blank')
            }
          }
          for (const other of others) {
            fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('unknowntype')}:${$(other).attr('class')}</font></li>` })
          }
          Promise.all(pro).finally(() => {
            fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
            if (this.conf.fuck.verifyTask) this.verify()
          })
        })
      },
      verify () {
        setTimeout(() => { $('.fa-check').click() }, 1000)
      },
      remove (remove = false) {
        const pro = []
        if (remove) {
          this.updateSteamInfo(async () => {
            await this.toggleActions('remove', pro)
            Promise.all(pro).finally(() => {
              fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
            })
          })
        } else {
          this.get_tasks('remove')
        }
      },
      toggleActions (action, pro) {
        const groups = action === 'fuck' ? this.groups : this.taskInfo.groups
        if (this.conf[action][action === 'fuck' ? 'joinSteamGroup' : 'leaveSteamGroup'] && groups.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'takekey', type: 'group', elements: groups, resolve, action })
          }))
        }
      },
      get_giveawayId () {
        const id = window.location.href.match(/distribution\/([\d]+)/)
        return id?.[1] || window.location.href
      },
      updateSteamInfo (callback) {
        new Promise(resolve => {
          if (this.taskInfo.groups.length > 0) {
            if (this.taskInfo.curators.length > 0) {
              fuc.updateSteamInfo(resolve, 'all')
            } else {
              fuc.updateSteamInfo(resolve, 'community')
            }
          } else if (this.taskInfo.curators.length > 0) {
            fuc.updateSteamInfo(resolve, 'store')
          } else {
            resolve(1)
          }
        }).then(s => {
          if (s === 1) callback()
        }).catch(err => {
          console.error(err)
        })
      },
      checkLogin () {
        if ($('i.fa-sign-in').length > 0) window.open('/auth/steam', '_self')
      },
      checkLeft () {
        const leftKey = $('span:contains(Осталось ключей),span:contains(Keys Left)').text().match(/[\d]+/)
        if (!(leftKey && parseInt(leftKey[0]) > 0)) {
          Swal.fire({
            icon: 'warning',
            title: getI18n('notice'),
            text: getI18n('noKeysLeft'),
            confirmButtonText: getI18n('confirm'),
            cancelButtonText: getI18n('cancel'),
            showCancelButton: true
          }).then((result) => {
            if (result.value) {
              window.close()
            }
          })
        }
      },
      groups: [], // 任务需要加的组
      curators: [], // 任务需要关注的鉴赏家
      links: [], // 需要浏览的页面链接
      others: [],
      vks: [],
      taskInfo: {
        groups: [], // 所有任务需要加的组
        curators: []// 所有任务需要关注的鉴赏家
      },
      tasks: [], // 任务信息
      setting: {},
      conf: config?.takekey?.enable ? config.takekey : globalConf
    }

    const plugins = [banana, freegamelottery, gamehag, giveawaysu, gleam, indiedb, marvelousga, opiumpulses, prys, takekey]

    if (window.location.host.includes('hclonely')) {
      if (window.location.pathname.includes('setting')) {
        unsafeWindow.GM_info = GM_info // eslint-disable-line camelcase
        unsafeWindow.GM_setValue = GM_setValue // eslint-disable-line camelcase
        unsafeWindow.language = language
        unsafeWindow.branch = 'V3'
        typeof GM_getValue('conf')?.global?.fuck?.joinSteamGroup !== 'boolean' ? loadSettings(defaultConf) : loadSettings(config)
      } else if (window.location.pathname.includes('announcement')) {
        loadAnnouncement()
      }
    } else if ((window.location.host.includes('marvelousga') || window.location.host.includes('dupedornot') || window.location.host.includes('gamecode.win')) && (!window.location.pathname.includes('giveaway'))) {
      fuc.newTabBlock()
    } else {
      let website = {}
      plugins.map((e, i) => {
        if (e.test()) {
          website = e
          if (website.before) website.before()
        }
      })

      if (globalConf.other.checkLogin && website.checkLogin) website.checkLogin()
      if (globalConf.other.checkLeft && website.checkLeft) website.checkLeft()

      let buttons = ''
      const defaultBtn = {
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
      const showLogs = globalConf?.other?.showLogs
      const websiteSettings = Object.assign(defaultBtn, website.setting)
      for (const [k, v] of Object.entries(websiteSettings)) {
        if (v.show) buttons += `<button id="${k}" type="button" class="btn btn-primary" title="${v.title}">${v.text}</button>`
      }
      if (showLogs) buttons += `<button id="toggle-logs" type="button" class="btn btn-primary" title="${!showLogs ? getI18n('showLog') : getI18n('hideLog')}">${!showLogs ? 'ShowLogs' : 'HideLogs'}</button>`

      const buttonGroup = `<div class="btn-group-vertical" role="group" aria-label="button">${buttons}</div>`
      $('body').append(`<div id="fuck-task-btn"><button id="toggle-btn-group" type="button" class="btn btn-outline-primary">&gt;</button>${buttonGroup}</div>`)

      for (const [k, v] of Object.entries(websiteSettings)) {
        if (v.show) {
          $('#' + k).click(() => {
            website[k]()
          })
        }
      }
      $('#toggle-logs').click(fuc.toggleLogs)
      $('#toggle-btn-group').click(() => {
        const btnGroup = $('#fuck-task-btn .btn-group-vertical')
        if (btnGroup.css('width') === '0px') {
          btnGroup.css('width', '')
          $('#toggle-btn-group').attr('title', getI18n('hide')).text('>')
        } else {
          btnGroup.css('width', '0')
          $('#toggle-btn-group').attr('title', getI18n('show')).text('<')
        }
      })

      // 快捷键功能
      $(document).keydown(e => {
        const hotKey = globalConf.hotKey || {}
        for (const [k, v] of Object.entries(hotKey)) {
          const keys = v.split('+')
          const functionKey = keys.length === 2 ? e[keys[0].toLowerCase().trim() + 'Key'] : true
          if (functionKey && keys[1].toLowerCase().trim() === e.key) {
            switch (k) {
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

      $('body').append(`<div id="fuck-task-info" class="card">
  <div class="card-body">
    <h3 class="card-title">${getI18n('taskLog')}</h3>
    <h4 class="card-subtitle">
      <a id="check-update" href="javascript:void(0)" targrt="_self" class="card-link iconfont icon-update_1" title="${getI18n('checkUpdate')}"></a>
      <a id="auto-task-setting" href="javascript:void(0)" data-href="https://auto-task.hclonely.com/setting${language === 'en' ? '_en' : ''}.html" targrt="_self" class="card-link iconfont icon-setting" title="${getI18n('setting')}"></a>
      <a id="auto-task-announcement" href="javascript:void(0)" data-href="https://auto-task.hclonely.com/announcement.html" targrt="_blank" class="card-link iconfont icon-announcement" title="${getI18n('visitUpdateText')}"></a>
      <a id="clean-cache" href="javascript:void(0)" targrt="_self" class="card-link iconfont icon-clean" title="${getI18n('cleanCache')}"></a>
      <a id="auto-task-feedback" href="javascript:void(0)" data-href="https://github.com/HCLonely/auto-task/issues/new/choose" targrt="_blank" class="card-link iconfont icon-feedback" title="${getI18n('feedback')}"></a>
    </h4>
    <div class="card-textarea">
    </div>
  </div>
</div>`)
      $('#clean-cache').click(() => {
        const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('cleaning')}<font></font></li>` })
        const listValues = GM_listValues()
        for (const value of listValues) {
          if (value !== 'conf' && value !== 'language') GM_deleteValue(value)
        }
        status.success()
      })
      $('#check-update').click(() => {
        fuc.checkUpdate(true)
      })
      $('#auto-task-setting,#auto-task-feedback,#auto-task-announcement').click(function () {
        window.open($(this).attr('data-href'), '_blank')
      })
      fuc.checkUpdate()

      // $('.fuck-task-logs .el-notification__content').show()
      if (!showLogs) {
        $('#fuck-task-logs').animate({
          right: '-100%',
          display: '-webkit-box',
          display: '-ms-flexbox', // eslint-disable-line no-dupe-keys
          display: 'flex' // eslint-disable-line no-dupe-keys
        }, 0)
      }
      if (website.after) website.after()
    }

    GM_registerMenuCommand(getI18n('readme'), () => { window.open('https://blog.hclonely.com/posts/777c60d5/', '_blank') })
    GM_registerMenuCommand(getI18n('updateSteamInfo'), () => {
      new Promise(resolve => {
        fuc.updateSteamInfo(resolve, 'all', true)
      }).then(r => {
        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('updateSteamInfoComplete')}</font></li>` })
      })
    })
    GM_registerMenuCommand('Language', () => {
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
      }).then((result) => {
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
