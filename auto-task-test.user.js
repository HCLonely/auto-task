// ==UserScript==
// @name               自动任务 Test
// @name:en            Auto Task Test
// @name:zh-CN         自动任务 Test
// @namespace          auto-task
// @version            3.1.2
// @description        自动完成赠key站任务
// @description:en     Automatically complete giveaway tasks
// @description:zh-CN  自动完成赠key站任务
// @author             HCLonely
// @license            MIT
// @iconURL            https://auto-task-test.hclonely.com/img/favicon.ico
// @homepage           https://github.com/HCLonely/auto-task
// @supportURL         https://github.com/HCLonely/auto-task/issues/new/choose
// @updateURL          https://auto-task-test.hclonely.com/auto-task-test.user.js

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
// @include            https://auto-task-test.hclonely.com/setting.html

// @require            https://cdn.jsdelivr.net/gh/HCLonely/auto-task@3.1.2/require/require.min.js
// @resource           CSS https://cdn.jsdelivr.net/gh/HCLonely/auto-task@3.1.2/require/fuck-task.min.css

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

// @connect            auto-task-test.hclonely.com
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
function _defineProperty (obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }) } else { obj[key] = value } return obj }

function _createForOfIteratorHelper (o, allowArrayLike) { var it; if (typeof Symbol === 'undefined' || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === 'number') { if (it) o = it; var i = 0; var F = function F () {}; return { s: F, n: function n () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] } }, e: function e (_e2) { throw _e2 }, f: F } } throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') } var normalCompletion = true; var didErr = false; var err; return { s: function s () { it = o[Symbol.iterator]() }, n: function n () { var step = it.next(); normalCompletion = step.done; return step }, e: function e (_e3) { didErr = true; err = _e3 }, f: function f () { try { if (!normalCompletion && it.return != null) it.return() } finally { if (didErr) throw err } } } }

function asyncGeneratorStep (gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value } catch (error) { reject(error); return } if (info.done) { resolve(value) } else { Promise.resolve(value).then(_next, _throw) } }

function _asyncToGenerator (fn) { return function () { var self = this; var args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next (value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value) } function _throw (err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err) } _next(undefined) }) } }

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

try {
  var zh_CN
  var en_US;

  (function () {
    var _config$banana, _config$freegamelotte, _config$gamehag, _config$giveawaysu, _config$gleam, _config$indiedb, _config$marvelousga, _config$opiumpulses, _config$prys

    var getLanguage = function getLanguage () {
      try {
        var lan = GM_getValue('language') || 'auto'

        if (lan === 'auto') {
          var _navigator, _navigator2

          var browserLanguage = (((_navigator = navigator) === null || _navigator === void 0 ? void 0 : _navigator.browserLanguage) || ((_navigator2 = navigator) === null || _navigator2 === void 0 ? void 0 : _navigator2.language) || '').toLowerCase()
          lan = browserLanguage.includes('en') ? 'en-US' : 'zh-CN'
        }

        return lan
      } catch (e) {
        throwError(e, 'getLanguage')
      }
    }

    var getI18n = function getI18n (name) {
      var str = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null

      try {
        var value = 'null'
        if (str) value = i18n[language][name] ? i18n[language][name].replace(/s%/g, str) : name; else value = i18n[language][name] || name
        return value
      } catch (e) {
        throwError(e, 'getI18n')
      }
    }

    var getSteamInfo = function getSteamInfo () {
      try {
        return Object.assign({
          userName: '',
          steam64Id: '',
          communitySessionID: '',
          storeSessionID: '',
          updateTime: 0
        }, GM_getValue('steamInfo'))
      } catch (e) {
        throwError(e, 'getSteamInfo')
      }
    }

    var getDiscordInfo = function getDiscordInfo () {
      try {
        return Object.assign({
          authorization: '',
          expired: true,
          updateTime: 0
        }, GM_getValue('discordInfo'))
      } catch (e) {
        throwError(e, 'getDiscordInfo')
      }
    }

    var getTwitchInfo = function getTwitchInfo () {
      try {
        return Object.assign({
          authToken: '',
          isLogin: false,
          updateTime: 0
        }, GM_getValue('twitchInfo'))
      } catch (e) {
        throwError(e, 'getTwitchInfo')
      }
    }

    var getTwitterInfo = function getTwitterInfo () {
      try {
        return Object.assign({
          authorization: 'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
          ct0: '',
          updateTime: 0
        }, GM_getValue('twitterInfo'))
      } catch (e) {
        throwError(e, 'getTwitterInfo')
      }
    }

    var getRedditInfo = function getRedditInfo () {
      try {
        return Object.assign({
          accessToken: '',
          expiresTime: 0
        }, GM_getValue('redditInfo'))
      } catch (e) {
        throwError(e, 'getRedditInfo')
      }
    }

    var getYtbInfo = function getYtbInfo () {
      try {
        return Object.assign({
          PAPISID: '',
          updateTime: 0
        }, GM_getValue('youtubeInfo'))
      } catch (e) {
        throwError(e, 'getYtbInfo')
      }
    }

    var unique = function unique (e) {
      try {
        return _toConsumableArray(new Set(e))
      } catch (e) {
        throwError(e, 'unique')
      }
    }

    var getUrlQuery = function getUrlQuery (url) {
      try {
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
      } catch (e) {
        throwError(e, 'getUrlQuery')
      }
    }

    var dateFormat = function dateFormat (fmt, date) {
      try {
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
      } catch (e) {
        throwError(e, 'dateFormat')
      }
    }

    var isEmptyObjArr = function isEmptyObjArr (object) {
      try {
        for (var _i3 = 0, _Object$values = Object.values(object); _i3 < _Object$values.length; _i3++) {
          var value = _Object$values[_i3]

          if (Object.prototype.toString.call(value) === '[object Array]') {
            if (value.length !== 0) return false
          } else if (Object.prototype.toString.call(value) === '[object Object]') {
            if (Object.keys(value).length !== 0) return false
          } else if (Object.prototype.toString.call(value) === '[object String]') {
            if (value !== '') return false
          }
        }

        return true
      } catch (e) {
        throwError(e, 'isEmptyObjArr')
      }
    }

    var clearArray = function clearArray (arr) {
      try {
        if (Array.isArray(arr[0])) {
          return arr.map(function () {
            return []
          })
        } else {
          return []
        }
      } catch (e) {
        throwError(e, 'clearArray')
      }
    }

    var clearTaskInfo = function clearTaskInfo (data) {
      try {
        if (Array.isArray(data)) {
          return clearArray(data)
        } else {
          for (var _i4 = 0, _Object$entries = Object.entries(data); _i4 < _Object$entries.length; _i4++) {
            var _Object$entries$_i = _slicedToArray(_Object$entries[_i4], 2)
            var _k2 = _Object$entries$_i[0]
            var v = _Object$entries$_i[1]

            if (Array.isArray(v)) data[_k2] = clearArray(v)
          }

          return data
        }
      } catch (e) {
        throwError(e, 'clearTaskInfo')
      }
    }

    var uniqueTaskInfo = function uniqueTaskInfo (data) {
      try {
        if (Array.isArray(data)) {
          if (Array.isArray(data[0])) {
            for (var i = 0; i < data.length; i++) {
              data[i] = unique(data[i])
            }
          } else {
            data = unique(data)
          }
        } else {
          for (var _i5 = 0, _Object$entries2 = Object.entries(data); _i5 < _Object$entries2.length; _i5++) {
            var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i5], 2)
            var _k3 = _Object$entries2$_i[0]
            var v = _Object$entries2$_i[1]

            if (Array.isArray(v)) data[_k3] = unique(v)
          }
        }

        return data
      } catch (e) {
        throwError(e, 'uniqueTaskInfo')
      }
    }

    var throwError = function throwError (e, name) {
      Swal.fire({
        icon: 'error',
        text: getI18n('functionError', name)
      })
      console.log('%c%s', 'color:white;background:red', name + '\n' + e.stack)
    }

    var delay = function delay () {
      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve()
        }, time)
      })
    }

    var echoLog = function echoLog (e) {
      try {
        var ele = ''

        switch (e.type) {
          case 'updateSteamCommunity':
            ele = $('<li>'.concat(getI18n('updateCommunityId'), '<font></font></li>'))
            break

          case 'updateSteamStore':
            ele = $('<li>'.concat(getI18n('updateStoreId'), '<font></font></li>'))
            break

          case 'joinSteamGroup':
          case 'leaveSteamGroup':
          case 'getSteamGroupId':
            ele = $('<li>'.concat(getI18n(e.type), '<a href="https://steamcommunity.com/groups/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'subscribeForum':
          case 'unsubscribeForum':
          case 'getForumId':
            ele = $('<li>'.concat(getI18n(e.type), '<a href="https://steamcommunity.com/app/').concat(e.text, '/discussions/" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'followCurator':
          case 'unfollowCurator':
          case 'getCuratorId':
            ele = $('<li>'.concat(getI18n(e.type), '<a href="https://store.steampowered.com/curator/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'getDeveloperId':
          case 'followDeveloper':
          case 'unfollowDeveloper':
            ele = $('<li>'.concat(getI18n(e.type), '<a href="https://store.steampowered.com/developer/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'getPublisherId':
          case 'followPublisher':
          case 'unfollowPublisher':
            ele = $('<li>'.concat(getI18n(e.type), '<a href="https://store.steampowered.com/publisher/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'getFranchiseId':
          case 'followFranchise':
          case 'unfollowFranchise':
            ele = $('<li>'.concat(getI18n(e.type), '<a href="https://store.steampowered.com/franchise/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'addWishlist':
          case 'removeWishlist':
          case 'followGame':
          case 'unfollowGame':
            ele = $('<li>'.concat(getI18n(e.type), '<a href="https://store.steampowered.com/app/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'likeAnnouncements':
            ele = $('<li>'.concat(getI18n('likeAnnouncements'), '<a href="').concat(e.url, '" target="_blank">').concat(e.id, '</a>...<font></font></li>'))
            break

          case 'verifyDiscordAuth':
            ele = $('<li>'.concat(getI18n('verifyDiscordAuth'), '...<font></font></li>'))
            break

          case 'joinDiscordServer':
          case 'leaveDiscordServer':
            ele = $('<li>'.concat(getI18n(e.type), '<a href="https://discord.com/invite/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'updateDiscordAuth':
            ele = $('<li style="color:red;">'.concat(getI18n('updateDiscordAuth'), '</li>'))
            break

          case 'verifyTwitchAuth':
            ele = $('<li>'.concat(getI18n('verifyTwitchAuth'), '...<font></font></li>'))
            break

          case 'followTwitchChannel':
          case 'unfollowTwitchChannel':
          case 'getTwitchChannelId':
            ele = $('<li>'.concat(getI18n(e.type), '<a href="https://www.twitch.tv/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'getInsInfo':
            ele = $('<li>'.concat(getI18n('getInsInfo'), '<a href="https://www.instagram.com/').concat(e.text, '/" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'followIns':
          case 'unfollowIns':
            ele = $('<li>'.concat(getI18n(e.type), '<a href="https://www.instagram.com/').concat(e.text, '/" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'updateTwitterInfo':
            ele = $('<li>'.concat(getI18n('updateTwitterInfo'), '...<font></font></li>'))
            break

          case 'getTwitterUserId':
          case 'followTwitterUser':
          case 'unfollowTwitterUser':
            ele = $('<li>'.concat(getI18n(e.type), '<a href="https://twitter.com/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'retweet':
          case 'unretweet':
            ele = $('<li>'.concat(getI18n(e.type)).concat(e.text, '...<font></font></li>'))
            break

          case 'updateRedditInfo':
            ele = $('<li>'.concat(getI18n('updateRedditInfo'), '...<font></font></li>'))
            break

          case 'joinReddit':
          case 'leaveReddit':
            ele = $('<li>'.concat(getI18n(e.type), '<a href="https://www.reddit.com/r/').concat(e.text, '/" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'followRedditUser':
          case 'unfollowRedditUser':
            ele = $('<li>'.concat(getI18n(e.type), '<a href="https://www.reddit.com/user/').concat(e.text.replace('u_', ''), '" target="_blank">').concat(e.text.replace('u_', ''), '</a>...<font></font></li>'))
            break

          case 'followYtbChannel':
          case 'unfollowYtbChannel':
            ele = $('<li>'.concat(getI18n(e.type), '<a href="https://www.youtube.com/channel/').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
            break

          case 'getYtbToken':
            ele = $('<li>'.concat(getI18n('getYtbToken'), '...<font></font></li>'))
            break

          case 'verifyVkLogin':
            ele = $('<li>'.concat(getI18n('verifyVkLogin'), '...<font></font></li>'))
            break

          case 'getVkId':
          case 'joinVkGroup':
          case 'leaveVkGroup':
          case 'joinVkPublic':
          case 'leaveVkPublic':
            ele = $('<li>'.concat(getI18n(e.type), '<a href="https://vk.com/').concat(e.text, '/" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
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
      } catch (e) {
        throwError(e, 'echoLog')
      }
    }

    var toggleLogs = function toggleLogs () {
      try {
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
      } catch (e) {
        throwError(e, 'toggleLogs')
      }
    }

    var httpRequest = function httpRequest (e) {
      try {
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
      } catch (e) {
        throwError(e, 'httpRequest')
      }
    }

    var getFinalUrl = function getFinalUrl (r, url) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null

      try {
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
      } catch (e) {
        throwError(e, 'getFinalUrl')
      }
    }

    var visitLink = function visitLink (r, url) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {}

      try {
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
      } catch (e) {
        throwError(e, 'visitLink')
      }
    }

    var updateSteamInfo = function updateSteamInfo (r) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'all'
      var update = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false

      try {
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
      } catch (e) {
        throwError(e, 'updateSteamInfo')
      }
    }

    var joinSteamGroup = function joinSteamGroup (r, group) {
      try {
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
      } catch (e) {
        throwError(e, 'joinSteamGroup')
      }
    }

    var getGroupID = function getGroupID (groupName, callback) {
      try {
        var _ref2 = [echoLog({
          type: 'getSteamGroupId',
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
                  var _response$responseTex

                  var groupId = (_response$responseTex = response.responseText.match(/OpenGroupChat\( '([0-9]+)'/)) === null || _response$responseTex === void 0 ? void 0 : _response$responseTex[1]

                  if (groupId) {
                    status.success()
                    groupNameToId[groupName] = groupId
                    GM_setValue('groupNameToId', groupNameToId)
                    resolve(groupId)
                  } else {
                    status.error('Error:' + response.statusText + '(' + response.status + ')')
                    resolve(false)
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
            if (groupId && callback) callback(groupName, groupId)
          }).catch(function (err) {
            console.error(err)
          })
        }
      } catch (e) {
        throwError(e, 'getGroupID')
      }
    }

    var leaveSteamGroup = function leaveSteamGroup (r, groupName) {
      try {
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
      } catch (e) {
        throwError(e, 'leaveSteamGroup')
      }
    }

    var followCurator = function followCurator (r, curatorId) {
      var follow = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '1'
      var status = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ''

      try {
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

            if (response.status === 200 && ((_response$response = response.response) === null || _response$response === void 0 ? void 0 : (_response$response$su = _response$response.success) === null || _response$response$su === void 0 ? void 0 : _response$response$su.success) === 1) {
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
      } catch (e) {
        throwError(e, 'followCurator')
      }
    }

    var unfollowCurator = function unfollowCurator (r, curatorId) {
      followCurator(r, curatorId, '0')
    }

    var getCuratorID = function getCuratorID (developerName, callback, type, path) {
      try {
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
                  var _response$responseTex2

                  var developerId = (_response$responseTex2 = response.responseText.match(/g_pagingData.*?"clanid":([\d]+)/)) === null || _response$responseTex2 === void 0 ? void 0 : _response$responseTex2[1]

                  if (developerId) {
                    status.success()
                    developerNameToId[developerName] = developerId
                    GM_setValue('developerNameToId', developerNameToId)
                    resolve(developerId)
                  } else {
                    status.error('Error:' + response.statusText + '(' + response.status + ')')
                    resolve(false)
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
            if (curatorId && callback) callback(developerName, curatorId)
          }).catch(function (err) {
            console.error(err)
          })
        }
      } catch (e) {
        throwError(e, 'getCuratorID')
      }
    }

    var followDeveloper = function followDeveloper (r, developerName) {
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

    var unfollowDeveloper = function unfollowDeveloper (r, developerName) {
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

    var followPublisher = function followPublisher (r, publisherName) {
      followDeveloper(r, publisherName, 'followPublisher', 'publisher')
    }

    var unfollowPublisher = function unfollowPublisher (r, publisherName) {
      unfollowDeveloper(r, publisherName, 'unfollowPublisher', 'publisher')
    }

    var followFranchise = function followFranchise (r, franchiseName) {
      followDeveloper(r, franchiseName, 'followFranchise', 'franchise')
    }

    var unfollowFranchise = function unfollowFranchise (r, franchiseName) {
      unfollowDeveloper(r, franchiseName, 'unfollowFranchise', 'franchise')
    }

    var addWishlist = function addWishlist (r, gameId) {
      try {
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
      } catch (e) {
        throwError(e, 'addWishlist')
      }
    }

    var removeWishlist = function removeWishlist (r, gameId) {
      try {
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
      } catch (e) {
        throwError(e, 'removeWishlist')
      }
    }

    var followGame = function followGame (r, gameId) {
      try {
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
      } catch (e) {
        throwError(e, 'followGame')
      }
    }

    var unfollowGame = function unfollowGame (r, gameId) {
      try {
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
      } catch (e) {
        throwError(e, 'unfollowGame')
      }
    }

    var likeAnnouncements = function likeAnnouncements (r, rawMatch) {
      try {
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
      } catch (e) {
        throwError(e, 'likeAnnouncements')
      }
    }

    var subscribeForum = /* #__PURE__ */(function () {
      var _ref4 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee (r, gameId) {
        var subscribe
        var _yield$getForumId
        var forumId
        var status
        var _args = arguments

        return regeneratorRuntime.wrap(function _callee$ (_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                subscribe = _args.length > 2 && _args[2] !== undefined ? _args[2] : true
                _context.prev = 1
                _context.next = 4
                return getForumId(gameId)

              case 4:
                _yield$getForumId = _context.sent
                forumId = _yield$getForumId.forumId

                if (forumId) {
                  _context.next = 8
                  break
                }

                return _context.abrupt('return', r({
                  result: 'error',
                  statusText: 'GetForumIdError',
                  status: 0
                }))

              case 8:
                status = echoLog({
                  type: ''.concat(subscribe ? '' : 'un', 'subscribeForum'),
                  text: gameId
                })
                httpRequest({
                  url: 'https://steamcommunity.com/forum/'.concat(forumId, '/General/').concat(subscribe ? '' : 'un', 'subscribe/0/'),
                  method: 'POST',
                  responseType: 'json',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                  },
                  data: $.param({
                    sessionid: steamInfo.communitySessionID
                  }),
                  onload: function onload (response) {
                    var _response$response9, _response$response10

                    if (debug) console.log(response)

                    if (response.status === 200 && (((_response$response9 = response.response) === null || _response$response9 === void 0 ? void 0 : _response$response9.success) === 1 || ((_response$response10 = response.response) === null || _response$response10 === void 0 ? void 0 : _response$response10.success) === 29)) {
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
                _context.next = 15
                break

              case 12:
                _context.prev = 12
                _context.t0 = _context.catch(1)
                throwError(_context.t0, 'subscribeForum')

              case 15:
              case 'end':
                return _context.stop()
            }
          }
        }, _callee, null, [[1, 12]])
      }))

      return function subscribeForum (_x, _x2) {
        return _ref4.apply(this, arguments)
      }
    }())

    var getForumId = function getForumId (gameId) {
      try {
        var status = echoLog({
          type: 'getForumId',
          text: gameId
        })
        return new Promise(function (resolve) {
          httpRequest({
            url: 'https://steamcommunity.com/app/' + gameId + '/discussions/',
            method: 'GET',
            onload: function onload (response) {
              if (debug) console.log(response)

              if (response.status === 200) {
                var _response$responseTex3, _response$responseTex4

                var forumId = (_response$responseTex3 = response.responseText) === null || _response$responseTex3 === void 0 ? void 0 : (_response$responseTex4 = _response$responseTex3.match(/General_([\d]+)/)) === null || _response$responseTex4 === void 0 ? void 0 : _response$responseTex4[1]

                if (forumId) {
                  status.success()
                  resolve({
                    result: 'success',
                    statusText: response.statusText,
                    status: response.status,
                    forumId: forumId
                  })
                } else {
                  status.error('Error')
                  resolve({
                    result: 'error',
                    statusText: 'GetForumIdError',
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
      } catch (e) {
        throwError(e, 'getForumId')
      }
    }

    var toggleSteamActions = /* #__PURE__ */(function () {
      var _ref6 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee2 (_ref5) {
        var website, type, elements, resolve, action, _ref5$toFinalUrl, toFinalUrl, pro, _iterator, _step, _loop

        return regeneratorRuntime.wrap(function _callee2$ (_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                website = _ref5.website, type = _ref5.type, elements = _ref5.elements, resolve = _ref5.resolve, action = _ref5.action, _ref5$toFinalUrl = _ref5.toFinalUrl, toFinalUrl = _ref5$toFinalUrl === void 0 ? {} : _ref5$toFinalUrl
                _context3.prev = 1
                pro = []
                _iterator = _createForOfIteratorHelper(unique(elements))
                _context3.prev = 4
                _loop = /* #__PURE__ */regeneratorRuntime.mark(function _loop () {
                  var _elementName

                  var element, elementName, toFinalUrlElement
                  return regeneratorRuntime.wrap(function _loop$ (_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          element = _step.value
                          elementName = Array.isArray(element) ? [null].concat(_toConsumableArray(element)) : [null, element]

                          if (!(website === 'giveawaysu' && toFinalUrl[element])) {
                            _context2.next = 21
                            break
                          }

                          toFinalUrlElement = toFinalUrl[element] || ''
                          _context2.t0 = type
                          _context2.next = _context2.t0 === 'group' ? 7 : _context2.t0 === 'forum' ? 9 : _context2.t0 === 'curator' ? 11 : _context2.t0 === 'publisher' ? 13 : _context2.t0 === 'developer' ? 13 : _context2.t0 === 'franchise' ? 15 : _context2.t0 === 'game' ? 17 : _context2.t0 === 'wishlist' ? 17 : _context2.t0 === 'announcement' ? 19 : 21
                          break

                        case 7:
                          elementName = toFinalUrlElement.match(/groups\/(.+)\/?/)
                          return _context2.abrupt('break', 21)

                        case 9:
                          elementName = toFinalUrlElement.match(/app\/([\d]+)/)
                          return _context2.abrupt('break', 21)

                        case 11:
                          elementName = toFinalUrlElement.match(/curator\/([\d]+)/)
                          return _context2.abrupt('break', 21)

                        case 13:
                          elementName = (toFinalUrlElement.includes('publisher') ? toFinalUrlElement.match(/publisher\/(.+)\/?/) : toFinalUrlElement.includes('developer') ? toFinalUrlElement.match(/developer\/(.+)\/?/) : toFinalUrlElement.match(/pub\/(.+)\/?/) || toFinalUrlElement.match(/dev\/(.+)\/?/)) || toFinalUrlElement.match(/curator\/([\d]+)/)
                          return _context2.abrupt('break', 21)

                        case 15:
                          elementName = toFinalUrlElement.match(/franchise\/(.+)\/?/) || toFinalUrlElement.match(/curator\/([\d]+)/)
                          return _context2.abrupt('break', 21)

                        case 17:
                          elementName = toFinalUrlElement.match(/app\/([\d]+)/)
                          return _context2.abrupt('break', 21)

                        case 19:
                          if (toFinalUrlElement.includes('announcements/detail')) {
                            elementName = toFinalUrlElement.match(/announcements\/detail\/([\d]+)/)
                          } else {
                            elementName = toFinalUrlElement.match(/(https?:\/\/store\.steampowered\.com\/newshub\/app\/[\d]+\/view\/([\d]+))\?authwgtoken=(.+?)&clanid=(.+)/)
                          }

                          return _context2.abrupt('break', 21)

                        case 21:
                          if (!((_elementName = elementName) === null || _elementName === void 0 ? void 0 : _elementName[1])) {
                            _context2.next = 43
                            break
                          }

                          _context2.t1 = type
                          _context2.next = _context2.t1 === 'group' ? 25 : _context2.t1 === 'forum' ? 27 : _context2.t1 === 'curator' ? 29 : _context2.t1 === 'publisher' ? 31 : _context2.t1 === 'developer' ? 33 : _context2.t1 === 'franchise' ? 35 : _context2.t1 === 'wishlist' ? 37 : _context2.t1 === 'game' ? 39 : _context2.t1 === 'announcement' ? 41 : 43
                          break

                        case 25:
                          pro.push(new Promise(function (resolve) {
                            action === 'fuck' ? joinSteamGroup(resolve, elementName[1]) : leaveSteamGroup(resolve, elementName[1])
                          }))
                          return _context2.abrupt('break', 43)

                        case 27:
                          pro.push(new Promise(function (resolve) {
                            action === 'fuck' ? subscribeForum(resolve, elementName[1]) : subscribeForum(resolve, elementName[1], false)
                          }))
                          return _context2.abrupt('break', 43)

                        case 29:
                          pro.push(new Promise(function (resolve) {
                            action === 'fuck' ? followCurator(resolve, elementName[1]) : unfollowCurator(resolve, elementName[1])
                          }))
                          return _context2.abrupt('break', 43)

                        case 31:
                          pro.push(new Promise(function (resolve) {
                            action === 'fuck' ? followPublisher(resolve, elementName[1]) : unfollowPublisher(resolve, elementName[1])
                          }))
                          return _context2.abrupt('break', 43)

                        case 33:
                          pro.push(new Promise(function (resolve) {
                            action === 'fuck' ? followDeveloper(resolve, elementName[1]) : unfollowDeveloper(resolve, elementName[1])
                          }))
                          return _context2.abrupt('break', 43)

                        case 35:
                          pro.push(new Promise(function (resolve) {
                            action === 'fuck' ? followFranchise(resolve, elementName[1]) : unfollowFranchise(resolve, elementName[1])
                          }))
                          return _context2.abrupt('break', 43)

                        case 37:
                          pro.push(new Promise(function (resolve) {
                            action === 'fuck' ? addWishlist(resolve, elementName[1]) : removeWishlist(resolve, elementName[1])
                          }))
                          return _context2.abrupt('break', 43)

                        case 39:
                          pro.push(new Promise(function (resolve) {
                            action === 'fuck' ? followGame(resolve, elementName[1]) : unfollowGame(resolve, elementName[1])
                          }))
                          return _context2.abrupt('break', 43)

                        case 41:
                          pro.push(new Promise(function (resolve) {
                            if (action === 'fuck') {
                              likeAnnouncements(resolve, elementName)
                            }
                          }))
                          return _context2.abrupt('break', 43)

                        case 43:
                          _context2.next = 45
                          return delay(1000)

                        case 45:
                        case 'end':
                          return _context2.stop()
                      }
                    }
                  }, _loop)
                })

                _iterator.s()

              case 7:
                if ((_step = _iterator.n()).done) {
                  _context3.next = 11
                  break
                }

                return _context3.delegateYield(_loop(), 't0', 9)

              case 9:
                _context3.next = 7
                break

              case 11:
                _context3.next = 16
                break

              case 13:
                _context3.prev = 13
                _context3.t1 = _context3.catch(4)

                _iterator.e(_context3.t1)

              case 16:
                _context3.prev = 16

                _iterator.f()

                return _context3.finish(16)

              case 19:
                Promise.all(pro).finally(function () {
                  resolve()
                })
                _context3.next = 25
                break

              case 22:
                _context3.prev = 22
                _context3.t2 = _context3.catch(1)
                throwError(_context3.t2, 'toggleSteamActions')

              case 25:
              case 'end':
                return _context3.stop()
            }
          }
        }, _callee2, null, [[1, 22], [4, 13, 16, 19]])
      }))

      return function toggleSteamActions (_x3) {
        return _ref6.apply(this, arguments)
      }
    }())

    var updateTwitchInfo = function updateTwitchInfo (notice) {
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

    var verifyTwitchAuth = function verifyTwitchAuth () {
      try {
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
              var _response$response11, _response$response11$, _response$response11$2

              if (debug) console.log(response)

              if (response.status === 200 && ((_response$response11 = response.response) === null || _response$response11 === void 0 ? void 0 : (_response$response11$ = _response$response11[0]) === null || _response$response11$ === void 0 ? void 0 : (_response$response11$2 = _response$response11$.data) === null || _response$response11$2 === void 0 ? void 0 : _response$response11$2.currentUser)) {
                status.success()
                resolve({
                  result: 'success',
                  statusText: response.statusText,
                  status: response.status
                })
              } else {
                status.error('Error:' + getI18n('updateTwitchAuth', true))
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
        }).then(function (_ref7) {
          var result = _ref7.result
          return result === 'success'
        }).catch(function (error) {
          if (debug) console.log(error)
          return false
        })
      } catch (e) {
        throwError(e, 'verifyTwitchAuth')
      }
    }

    var toggleTwitchChannel = /* #__PURE__ */(function () {
      var _ref8 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee3 (resolve, name) {
        var follow
        var channelId
        var status
        var followData
        var unfollowData
        var _args4 = arguments
        return regeneratorRuntime.wrap(function _callee3$ (_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                follow = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : true
                _context4.prev = 1
                _context4.next = 4
                return getTwitchChannelId(name)

              case 4:
                channelId = _context4.sent

                if (channelId) {
                  _context4.next = 7
                  break
                }

                return _context4.abrupt('return', resolve({
                  result: 'error',
                  statusText: '"getTwitchChannelId" failed',
                  status: 0
                }))

              case 7:
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
                _context4.next = 16
                break

              case 13:
                _context4.prev = 13
                _context4.t0 = _context4.catch(1)
                throwError(_context4.t0, 'toggleTwitchChannel')

              case 16:
              case 'end':
                return _context4.stop()
            }
          }
        }, _callee3, null, [[1, 13]])
      }))

      return function toggleTwitchChannel (_x4, _x5) {
        return _ref8.apply(this, arguments)
      }
    }())

    var getTwitchChannelId = function getTwitchChannelId (name) {
      try {
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
                var _response$response12, _response$response12$, _response$response12$2, _response$response12$3

                var channelId = (_response$response12 = response.response) === null || _response$response12 === void 0 ? void 0 : (_response$response12$ = _response$response12[0]) === null || _response$response12$ === void 0 ? void 0 : (_response$response12$2 = _response$response12$.data) === null || _response$response12$2 === void 0 ? void 0 : (_response$response12$3 = _response$response12$2.user) === null || _response$response12$3 === void 0 ? void 0 : _response$response12$3.id

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
        }).then(function (_ref9) {
          var channelId = _ref9.channelId
          return channelId
        }).catch(function () {
          return false
        })
      } catch (e) {
        throwError(e, 'getTwitchChannelId')
      }
    }

    var toggleTwitchActions = /* #__PURE__ */(function () {
      var _ref11 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee4 (_ref10) {
        var website, type, elements, resolve, action, _ref10$toFinalUrl, toFinalUrl, result, _iterator2, _step2, _loop2

        return regeneratorRuntime.wrap(function _callee4$ (_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                website = _ref10.website, type = _ref10.type, elements = _ref10.elements, resolve = _ref10.resolve, action = _ref10.action, _ref10$toFinalUrl = _ref10.toFinalUrl, toFinalUrl = _ref10$toFinalUrl === void 0 ? {} : _ref10$toFinalUrl
                _context6.prev = 1

                if (!(new Date().getTime() - twitchInfo.updateTime > 10 * 60 * 1000)) {
                  _context6.next = 8
                  break
                }

                _context6.next = 5
                return verifyTwitchAuth()

              case 5:
                result = _context6.sent

                if (result) {
                  _context6.next = 8
                  break
                }

                return _context6.abrupt('return', resolve())

              case 8:
                _iterator2 = _createForOfIteratorHelper(unique(elements))
                _context6.prev = 9
                _loop2 = /* #__PURE__ */regeneratorRuntime.mark(function _loop2 () {
                  var element, name, _toFinalUrlElement$ma, toFinalUrlElement

                  return regeneratorRuntime.wrap(function _loop2$ (_context5) {
                    while (1) {
                      switch (_context5.prev = _context5.next) {
                        case 0:
                          element = _step2.value
                          name = element

                          if (website === 'giveawaysu' && toFinalUrl[element]) {
                            toFinalUrlElement = toFinalUrl[element] || ''
                            name = (_toFinalUrlElement$ma = toFinalUrlElement.match(/https:\/\/www.twitch.tv\/(.+)/)) === null || _toFinalUrlElement$ma === void 0 ? void 0 : _toFinalUrlElement$ma[1]
                          }

                          if (!name) {
                            _context5.next = 6
                            break
                          }

                          _context5.next = 6
                          return new Promise(function (resolve) {
                            toggleTwitchChannel(resolve, name, action === 'fuck')
                          })

                        case 6:
                        case 'end':
                          return _context5.stop()
                      }
                    }
                  }, _loop2)
                })

                _iterator2.s()

              case 12:
                if ((_step2 = _iterator2.n()).done) {
                  _context6.next = 16
                  break
                }

                return _context6.delegateYield(_loop2(), 't0', 14)

              case 14:
                _context6.next = 12
                break

              case 16:
                _context6.next = 21
                break

              case 18:
                _context6.prev = 18
                _context6.t1 = _context6.catch(9)

                _iterator2.e(_context6.t1)

              case 21:
                _context6.prev = 21

                _iterator2.f()

                return _context6.finish(21)

              case 24:
                resolve()
                _context6.next = 30
                break

              case 27:
                _context6.prev = 27
                _context6.t2 = _context6.catch(1)
                throwError(_context6.t2, 'toggleTwitchActions')

              case 30:
              case 'end':
                return _context6.stop()
            }
          }
        }, _callee4, null, [[1, 27], [9, 18, 21, 24]])
      }))

      return function toggleTwitchActions (_x6) {
        return _ref11.apply(this, arguments)
      }
    }())

    var updateTwitterInfo = function updateTwitterInfo (resolve) {
      try {
        var status = echoLog({
          type: 'updateTwitterInfo'
        })
        httpRequest({
          url: 'https://twitter.com/settings/account?k',
          method: 'HEAD',
          cookie: 'ct0=',
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
                GM_setValue('twitterInfo', twitterInfo)
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
      } catch (e) {
        throwError(e, 'updateTwitterInfo')
      }
    }

    var toggleTwitterUser = /* #__PURE__ */(function () {
      var _ref12 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee5 (r, name) {
        var follow
        var userId
        var status
        var _args7 = arguments
        return regeneratorRuntime.wrap(function _callee5$ (_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                follow = _args7.length > 2 && _args7[2] !== undefined ? _args7[2] : true
                _context7.prev = 1
                _context7.next = 4
                return getTwitterUserId(name)

              case 4:
                userId = _context7.sent

                if (userId) {
                  _context7.next = 7
                  break
                }

                return _context7.abrupt('return', r({
                  result: 'error',
                  statusText: '"getTwitterUserId" failed',
                  status: 0
                }))

              case 7:
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
                _context7.next = 14
                break

              case 11:
                _context7.prev = 11
                _context7.t0 = _context7.catch(1)
                throwError(_context7.t0, 'toggleTwitterUser')

              case 14:
              case 'end':
                return _context7.stop()
            }
          }
        }, _callee5, null, [[1, 11]])
      }))

      return function toggleTwitterUser (_x7, _x8) {
        return _ref12.apply(this, arguments)
      }
    }())

    var toggleRetweet = /* #__PURE__ */(function () {
      var _ref13 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee6 (r, retweetId) {
        var retweet
        var status
        var _args8 = arguments
        return regeneratorRuntime.wrap(function _callee6$ (_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                retweet = _args8.length > 2 && _args8[2] !== undefined ? _args8[2] : true

                try {
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
                      var _response$response13, _response$response13$, _response$response13$2

                      if (debug) console.log(response)

                      if (response.status === 200 || response.status === 403 && ((_response$response13 = response.response) === null || _response$response13 === void 0 ? void 0 : (_response$response13$ = _response$response13.errors) === null || _response$response13$ === void 0 ? void 0 : (_response$response13$2 = _response$response13$[0]) === null || _response$response13$2 === void 0 ? void 0 : _response$response13$2.code) === 327) {
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
                } catch (e) {
                  throwError(e, 'toggleRetweet')
                }

              case 2:
              case 'end':
                return _context8.stop()
            }
          }
        }, _callee6)
      }))

      return function toggleRetweet (_x9, _x10) {
        return _ref13.apply(this, arguments)
      }
    }())

    var getTwitterUserId = function getTwitterUserId (name) {
      try {
        return new Promise(function (resolve) {
          var status = echoLog({
            type: 'getTwitterUserId',
            text: name
          })
          httpRequest({
            url: 'https://api.twitter.com/graphql/-xfUfZsnR_zqjFd-IfrN5A/UserByScreenName?variables=%7B%22screen_name%22%3A%22' + name + '%22%2C%22withHighlightedLabel%22%3Atrue%7D',
            method: 'GET',
            headers: {
              authorization: 'Bearer ' + twitterInfo.authorization,
              'content-type': 'application/json'
            },
            responseType: 'json',
            anonymous: true,
            onload: function onload (response) {
              if (debug) console.log(response)

              if (response.status === 200) {
                var _response$response14, _response$response14$, _response$response14$2

                var userId = (_response$response14 = response.response) === null || _response$response14 === void 0 ? void 0 : (_response$response14$ = _response$response14.data) === null || _response$response14$ === void 0 ? void 0 : (_response$response14$2 = _response$response14$.user) === null || _response$response14$2 === void 0 ? void 0 : _response$response14$2.rest_id // eslint-disable-line camelcase

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
        }).then(function (_ref14) {
          var userId = _ref14.userId
          return userId
        }).catch(function () {
          return false
        })
      } catch (e) {
        throwError(e, 'getTwitterUserId')
      }
    }

    var toggleTwitterActions = /* #__PURE__ */(function () {
      var _ref16 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee7 (_ref15) {
        var website, type, elements, resolve, action, _ref15$toFinalUrl, toFinalUrl, _iterator3, _step3, _loop3

        return regeneratorRuntime.wrap(function _callee7$ (_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                website = _ref15.website, type = _ref15.type, elements = _ref15.elements, resolve = _ref15.resolve, action = _ref15.action, _ref15$toFinalUrl = _ref15.toFinalUrl, toFinalUrl = _ref15$toFinalUrl === void 0 ? {} : _ref15$toFinalUrl
                _context10.prev = 1
                _iterator3 = _createForOfIteratorHelper(unique(elements))
                _context10.prev = 3
                _loop3 = /* #__PURE__ */regeneratorRuntime.mark(function _loop3 () {
                  var _toFinalUrlElement$ma2, _toFinalUrlElement$ma3

                  var element, id, toFinalUrlElement
                  return regeneratorRuntime.wrap(function _loop3$ (_context9) {
                    while (1) {
                      switch (_context9.prev = _context9.next) {
                        case 0:
                          element = _step3.value
                          id = element

                          if (!(website === 'giveawaysu' && toFinalUrl[element])) {
                            _context9.next = 11
                            break
                          }

                          toFinalUrlElement = toFinalUrl[element] || ''
                          _context9.t0 = type
                          _context9.next = _context9.t0 === 'follow' ? 7 : _context9.t0 === 'retweet' ? 9 : 11
                          break

                        case 7:
                          id = (_toFinalUrlElement$ma2 = toFinalUrlElement.match(/https:\/\/twitter.com\/(.+)/)) === null || _toFinalUrlElement$ma2 === void 0 ? void 0 : _toFinalUrlElement$ma2[1]
                          return _context9.abrupt('break', 11)

                        case 9:
                          id = (_toFinalUrlElement$ma3 = toFinalUrlElement.match(/https:\/\/twitter.com\/.*?\/status\/([\d]+)/)) === null || _toFinalUrlElement$ma3 === void 0 ? void 0 : _toFinalUrlElement$ma3[1]
                          return _context9.abrupt('break', 11)

                        case 11:
                          if (!id) {
                            _context9.next = 21
                            break
                          }

                          _context9.t1 = type
                          _context9.next = _context9.t1 === 'follow' ? 15 : _context9.t1 === 'retweet' ? 18 : 21
                          break

                        case 15:
                          _context9.next = 17
                          return new Promise(function (resolve) {
                            toggleTwitterUser(resolve, id, action === 'fuck')
                          })

                        case 17:
                          return _context9.abrupt('break', 21)

                        case 18:
                          _context9.next = 20
                          return new Promise(function (resolve) {
                            toggleRetweet(resolve, id, action === 'fuck')
                          })

                        case 20:
                          return _context9.abrupt('break', 21)

                        case 21:
                        case 'end':
                          return _context9.stop()
                      }
                    }
                  }, _loop3)
                })

                _iterator3.s()

              case 6:
                if ((_step3 = _iterator3.n()).done) {
                  _context10.next = 10
                  break
                }

                return _context10.delegateYield(_loop3(), 't0', 8)

              case 8:
                _context10.next = 6
                break

              case 10:
                _context10.next = 15
                break

              case 12:
                _context10.prev = 12
                _context10.t1 = _context10.catch(3)

                _iterator3.e(_context10.t1)

              case 15:
                _context10.prev = 15

                _iterator3.f()

                return _context10.finish(15)

              case 18:
                resolve()
                _context10.next = 24
                break

              case 21:
                _context10.prev = 21
                _context10.t2 = _context10.catch(1)
                throwError(_context10.t2, 'toggleTwitterActions')

              case 24:
              case 'end':
                return _context10.stop()
            }
          }
        }, _callee7, null, [[1, 21], [3, 12, 15, 18]])
      }))

      return function toggleTwitterActions (_x11) {
        return _ref16.apply(this, arguments)
      }
    }())

    var updateYtbInfo = function updateYtbInfo (notice) {
      try {
        var PAPISID = Cookies.get('__Secure-3PAPISID')

        if (PAPISID) {
          youtubeInfo.PAPISID = PAPISID
          youtubeInfo.updateTime = new Date().getTime()
          GM_setValue('youtubeInfo', youtubeInfo)

          if (notice) {
            Swal.fire({
              title: getI18n('updateYtbInfoSuccess'),
              icon: 'success'
            })
          }
        } else {
          if (notice) {
            Swal.fire({
              title: getI18n('updateYtbInfoError'),
              icon: 'error'
            })
          }
        }
      } catch (e) {
        if (debug) console.log(e)

        if (notice) {
          Swal.fire({
            title: getI18n('updateYtbInfoError'),
            icon: 'error'
          })
        }
      }
    }

    var toggleYtbChannel = /* #__PURE__ */(function () {
      var _ref17 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee8 (r, link) {
        var follow
        var _yield$getYtbToken
        var data
        var unknownLink
        var needLogin
        var _ref18
        var apiKey
        var client
        var request
        var channelId
        var status
        var nowTime
        var _args11 = arguments

        return regeneratorRuntime.wrap(function _callee8$ (_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                follow = _args11.length > 2 && _args11[2] !== undefined ? _args11[2] : true
                _context11.prev = 1
                _context11.next = 4
                return getYtbToken(link)

              case 4:
                _yield$getYtbToken = _context11.sent
                data = _yield$getYtbToken.data
                unknownLink = _yield$getYtbToken.unknownLink
                needLogin = _yield$getYtbToken.needLogin
                _ref18 = data || {}, apiKey = _ref18.apiKey, client = _ref18.client, request = _ref18.request, channelId = _ref18.channelId

                if (!needLogin) {
                  _context11.next = 11
                  break
                }

                return _context11.abrupt('return', r({
                  result: 'error',
                  statusText: 'needLogin',
                  status: 0
                }))

              case 11:
                if (apiKey) {
                  _context11.next = 13
                  break
                }

                return _context11.abrupt('return', r({
                  result: 'error',
                  statusText: '"getYtbToken" failed',
                  status: 0
                }))

              case 13:
                if (!unknownLink) {
                  _context11.next = 15
                  break
                }

                return _context11.abrupt('return', r({
                  result: 'error',
                  statusText: 'unsupportedLink',
                  status: 0
                }))

              case 15:
                status = echoLog({
                  type: follow ? 'followYtbChannel' : 'unfollowYtbChannel',
                  text: channelId
                })
                nowTime = parseInt(new Date().getTime() / 1000)
                httpRequest({
                  url: 'https://www.youtube.com/youtubei/v1/subscription/'.concat(follow ? '' : 'un', 'subscribe?key=').concat(apiKey),
                  method: 'POST',
                  headers: {
                    origin: 'https://www.youtube.com',
                    referer: 'https://www.youtube.com/channel/' + channelId,
                    'content-type': 'application/json',
                    'x-goog-authuser': 0,
                    'x-goog-visitor-id': client.visitorData,
                    'x-origin': 'https://www.youtube.com',
                    authorization: 'SAPISIDHASH '.concat(nowTime, '_').concat(sha1(''.concat(nowTime, ' ').concat(youtubeInfo.PAPISID, ' https://www.youtube.com')))
                  },
                  data: JSON.stringify({
                    context: {
                      client: client,
                      request: {
                        sessionId: request.sessionId,
                        internalExperimentFlags: [],
                        consistencyTokenJars: []
                      },
                      user: {}
                    },
                    channelIds: [channelId],
                    params: follow ? 'EgIIAhgA' : 'CgIIAhgA'
                  }),
                  onload: function onload (response) {
                    if (debug) console.log(response)

                    if (response.status === 200) {
                      if (follow && /"subscribed": true/.test(response.responseText) || !follow && /"subscribed": false/.test(response.responseText)) {
                        status.success()
                        r({
                          result: 'success',
                          statusText: response.statusText,
                          status: response.status
                        })
                      } else {
                        status.error(getI18n('tryUpdateYtbAuth'))
                        r({
                          result: 'error',
                          statusText: response.statusText,
                          status: response.status
                        })
                      }
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
                _context11.next = 23
                break

              case 20:
                _context11.prev = 20
                _context11.t0 = _context11.catch(1)
                throwError(_context11.t0, 'toggleYtbChannel')

              case 23:
              case 'end':
                return _context11.stop()
            }
          }
        }, _callee8, null, [[1, 20]])
      }))

      return function toggleYtbChannel (_x12, _x13) {
        return _ref17.apply(this, arguments)
      }
    }())

    var getYtbToken = function getYtbToken (link) {
      try {
        return new Promise(function (resolve) {
          if (!/https?:\/\/www\.youtube\.com\/c(hannel)?\/.+/.test(link)) {
            return resolve({
              unknownLink: true
            })
          }

          var status = echoLog({
            type: 'getYtbToken'
          })
          httpRequest({
            url: link,
            method: 'GET',
            onload: function onload (response) {
              if (debug) console.log(response)

              if (response.status === 200) {
                var _response$responseTex5, _response$responseTex6, _response$responseTex7

                if (response.responseText.includes('accounts.google.com/ServiceLogin?service=youtube')) {
                  status.error('Error:' + getI18n('loginYtb'), true)
                  return resolve({
                    result: 'error',
                    statusText: response.statusText,
                    status: response.status,
                    needLogin: true
                  })
                }

                var apiKey = (_response$responseTex5 = response.responseText.match(/"INNERTUBE_API_KEY":"(.*?)"/)) === null || _response$responseTex5 === void 0 ? void 0 : _response$responseTex5[1]
                var channelId = (_response$responseTex6 = response.responseText.match(/<meta itemprop="channelId" content="(.+?)">/)) === null || _response$responseTex6 === void 0 ? void 0 : _response$responseTex6[1]
                var context = ((_response$responseTex7 = response.responseText.match(/\(\{"INNERTUBE_CONTEXT":([\w\W]*?)\}\)/)) === null || _response$responseTex7 === void 0 ? void 0 : _response$responseTex7[1]) || '{}'

                var _JSON$parse = JSON.parse(context)
                var client = _JSON$parse.client
                var request = _JSON$parse.request

                if (apiKey && client && request && channelId) {
                  status.success()
                  resolve({
                    result: 'success',
                    statusText: response.statusText,
                    status: response.status,
                    data: {
                      apiKey: apiKey,
                      client: client,
                      request: request,
                      channelId: channelId
                    }
                  })
                } else {
                  status.error('Error: Parameter "apiKey" not found!')
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
      } catch (e) {
        throwError(e, 'getYtbToken')
      }
    }

    var toggleYtbActions = /* #__PURE__ */(function () {
      var _ref20 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee9 (_ref19) {
        var website, type, elements, resolve, action, _ref19$toFinalUrl, toFinalUrl, _iterator4, _step4, _loop4

        return regeneratorRuntime.wrap(function _callee9$ (_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                website = _ref19.website, type = _ref19.type, elements = _ref19.elements, resolve = _ref19.resolve, action = _ref19.action, _ref19$toFinalUrl = _ref19.toFinalUrl, toFinalUrl = _ref19$toFinalUrl === void 0 ? {} : _ref19$toFinalUrl
                _context13.prev = 1

                if (youtubeInfo.PAPISID) {
                  _context13.next = 5
                  break
                }

                echoLog({
                  type: 'custom',
                  text: '<li style="color:red;">'.concat(getI18n('updateYtbInfo'), '</li>')
                })
                return _context13.abrupt('return', resolve())

              case 5:
                _iterator4 = _createForOfIteratorHelper(unique(elements))
                _context13.prev = 6
                _loop4 = /* #__PURE__ */regeneratorRuntime.mark(function _loop4 () {
                  var element, link
                  return regeneratorRuntime.wrap(function _loop4$ (_context12) {
                    while (1) {
                      switch (_context12.prev = _context12.next) {
                        case 0:
                          element = _step4.value
                          link = element

                          if (website === 'giveawaysu' && toFinalUrl[element]) {
                            link = toFinalUrl[element] || ''
                          }

                          if (!link) {
                            _context12.next = 6
                            break
                          }

                          _context12.next = 6
                          return new Promise(function (resolve) {
                            toggleYtbChannel(resolve, link, action === 'fuck')
                          })

                        case 6:
                        case 'end':
                          return _context12.stop()
                      }
                    }
                  }, _loop4)
                })

                _iterator4.s()

              case 9:
                if ((_step4 = _iterator4.n()).done) {
                  _context13.next = 13
                  break
                }

                return _context13.delegateYield(_loop4(), 't0', 11)

              case 11:
                _context13.next = 9
                break

              case 13:
                _context13.next = 18
                break

              case 15:
                _context13.prev = 15
                _context13.t1 = _context13.catch(6)

                _iterator4.e(_context13.t1)

              case 18:
                _context13.prev = 18

                _iterator4.f()

                return _context13.finish(18)

              case 21:
                resolve()
                _context13.next = 27
                break

              case 24:
                _context13.prev = 24
                _context13.t2 = _context13.catch(1)
                throwError(_context13.t2, 'toggleYtbActions')

              case 27:
              case 'end':
                return _context13.stop()
            }
          }
        }, _callee9, null, [[1, 24], [6, 15, 18, 21]])
      }))

      return function toggleYtbActions (_x14) {
        return _ref20.apply(this, arguments)
      }
    }())

    var verifyDiscordAuth = function verifyDiscordAuth () {
      try {
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
      } catch (e) {
        throwError(e, 'verifyDiscordAuth')
      }
    }

    var joinDiscordServer = function joinDiscordServer (r, inviteId) {
      try {
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
              var _response$response15, _response$response15$

              status.success()
              r({
                result: 'success',
                statusText: response.statusText,
                status: response.status,
                guild: [inviteId, (_response$response15 = response.response) === null || _response$response15 === void 0 ? void 0 : (_response$response15$ = _response$response15.guild) === null || _response$response15$ === void 0 ? void 0 : _response$response15$.id]
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
      } catch (e) {
        throwError(e, 'joinDiscordServer')
      }
    }

    var leaveDiscordServer = function leaveDiscordServer (r, inviteId, guild) {
      try {
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
      } catch (e) {
        throwError(e, 'leaveDiscordServer')
      }
    }

    var toggleDiscordActions = /* #__PURE__ */(function () {
      var _ref22 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee10 (_ref21) {
        var website, elements, resolve, action, _ref21$toFinalUrl, toFinalUrl, _ref21$toGuild, toGuild, verifyResult, pro, _iterator5, _step5, _loop5

        return regeneratorRuntime.wrap(function _callee10$ (_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                website = _ref21.website, elements = _ref21.elements, resolve = _ref21.resolve, action = _ref21.action, _ref21$toFinalUrl = _ref21.toFinalUrl, toFinalUrl = _ref21$toFinalUrl === void 0 ? {} : _ref21$toFinalUrl, _ref21$toGuild = _ref21.toGuild, toGuild = _ref21$toGuild === void 0 ? {} : _ref21$toGuild
                _context14.prev = 1

                if (!(new Date().getTime() - discordInfo.updateTime > 10 * 60 * 1000 || discordInfo.expired)) {
                  _context14.next = 14
                  break
                }

                _context14.next = 5
                return verifyDiscordAuth()

              case 5:
                verifyResult = _context14.sent

                if (!verifyResult) {
                  _context14.next = 12
                  break
                }

                discordInfo.updateTime = new Date().getTime()
                discordInfo.expired = false
                GM_setValue('discordInfo', discordInfo)
                _context14.next = 14
                break

              case 12:
                echoLog({
                  type: 'updateDiscordAuth'
                })
                return _context14.abrupt('return', resolve({}))

              case 14:
                pro = []
                _iterator5 = _createForOfIteratorHelper(unique(elements))

                try {
                  _loop5 = function _loop5 () {
                    var element = _step5.value
                    var inviteId = element

                    if (website === 'giveawaysu' && toFinalUrl[element]) {
                      var _toFinalUrlElement$ma4

                      var toFinalUrlElement = toFinalUrl[element] || ''
                      inviteId = (_toFinalUrlElement$ma4 = toFinalUrlElement.match(/invite\/(.+)/)) === null || _toFinalUrlElement$ma4 === void 0 ? void 0 : _toFinalUrlElement$ma4[1]
                    }

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

                  for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                    _loop5()
                  }
                } catch (err) {
                  _iterator5.e(err)
                } finally {
                  _iterator5.f()
                }

                Promise.all(pro).then(function (data) {
                  resolve(data)
                }).catch(function () {
                  resolve()
                })
                _context14.next = 23
                break

              case 20:
                _context14.prev = 20
                _context14.t0 = _context14.catch(1)
                throwError(_context14.t0, 'toggleDiscordActions')

              case 23:
              case 'end':
                return _context14.stop()
            }
          }
        }, _callee10, null, [[1, 20]])
      }))

      return function toggleDiscordActions (_x15) {
        return _ref22.apply(this, arguments)
      }
    }())

    var getInsInfo = function getInsInfo (name) {
      try {
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
              } else if (response.finalUrl.includes('www.instagram.com/challenge')) {
                status.error('Error:' + getI18n('insBanned'))
                resolve({
                  result: 'error',
                  statusText: response.statusText,
                  status: response.status
                })
                return
              }

              if (response.status === 200) {
                var _response$responseTex8, _response$responseTex9

                var _data = (_response$responseTex8 = response.responseText) === null || _response$responseTex8 === void 0 ? void 0 : (_response$responseTex9 = _response$responseTex8.match(/window._sharedData[\s]*=[\s]*?(\{[\w\W]*?\});/)) === null || _response$responseTex9 === void 0 ? void 0 : _response$responseTex9[1]

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
        }).then(function (_ref23) {
          var id = _ref23.id
          return {
            id: id,
            error: !id
          }
        }).catch(function (error) {
          return {
            id: null,
            error: error
          }
        })
      } catch (e) {
        throwError(e, 'getInsInfo')
        return {
          id: null,
          e: e
        }
      }
    }

    var followIns = /* #__PURE__ */(function () {
      var _ref24 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee11 (r, name) {
        var _yield$getInsInfo, id, error, status

        return regeneratorRuntime.wrap(function _callee11$ (_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.prev = 0
                _context15.next = 3
                return getInsInfo(name)

              case 3:
                _yield$getInsInfo = _context15.sent
                id = _yield$getInsInfo.id
                error = _yield$getInsInfo.error

                if (!error) {
                  _context15.next = 9
                  break
                }

                r({
                  result: 'error',
                  statusText: 'getInsInfo error'
                })
                return _context15.abrupt('return', error)

              case 9:
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
                    var _response$response16

                    if (debug) console.log(response)

                    if (response.status === 200 && ((_response$response16 = response.response) === null || _response$response16 === void 0 ? void 0 : _response$response16.result) === 'following') {
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
                _context15.next = 16
                break

              case 13:
                _context15.prev = 13
                _context15.t0 = _context15.catch(0)
                throwError(_context15.t0, 'followIns')

              case 16:
              case 'end':
                return _context15.stop()
            }
          }
        }, _callee11, null, [[0, 13]])
      }))

      return function followIns (_x16, _x17) {
        return _ref24.apply(this, arguments)
      }
    }())

    var unfollowIns = /* #__PURE__ */(function () {
      var _ref25 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee12 (r, name) {
        var _yield$getInsInfo2, id, error, status

        return regeneratorRuntime.wrap(function _callee12$ (_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                _context16.prev = 0
                _context16.next = 3
                return getInsInfo(name)

              case 3:
                _yield$getInsInfo2 = _context16.sent
                id = _yield$getInsInfo2.id
                error = _yield$getInsInfo2.error

                if (!error) {
                  _context16.next = 9
                  break
                }

                r({
                  result: 'error',
                  statusText: 'getInsInfo error'
                })
                return _context16.abrupt('return', error)

              case 9:
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
                    var _response$response17

                    if (debug) console.log(response)

                    if (response.status === 200 && ((_response$response17 = response.response) === null || _response$response17 === void 0 ? void 0 : _response$response17.status) === 'ok') {
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
                _context16.next = 16
                break

              case 13:
                _context16.prev = 13
                _context16.t0 = _context16.catch(0)
                throwError(_context16.t0, 'unfollowIns')

              case 16:
              case 'end':
                return _context16.stop()
            }
          }
        }, _callee12, null, [[0, 13]])
      }))

      return function unfollowIns (_x18, _x19) {
        return _ref25.apply(this, arguments)
      }
    }())

    var toggleInsActions = /* #__PURE__ */(function () {
      var _ref27 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee13 (_ref26) {
        var website, elements, resolve, action, _ref26$toFinalUrl, toFinalUrl, _pro, _iterator6, _step6, _loop6

        return regeneratorRuntime.wrap(function _callee13$ (_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                website = _ref26.website, elements = _ref26.elements, resolve = _ref26.resolve, action = _ref26.action, _ref26$toFinalUrl = _ref26.toFinalUrl, toFinalUrl = _ref26$toFinalUrl === void 0 ? {} : _ref26$toFinalUrl

                try {
                  _pro = []
                  _iterator6 = _createForOfIteratorHelper(unique(elements))

                  try {
                    _loop6 = function _loop6 () {
                      var element = _step6.value
                      var name = element

                      if (website === 'giveawaysu' && toFinalUrl[element]) {
                        var _toFinalUrlElement$ma5

                        var toFinalUrlElement = toFinalUrl[element] || ''
                        name = (_toFinalUrlElement$ma5 = toFinalUrlElement.match(/https:\/\/www\.instagram\.com\/(.+)?\//)) === null || _toFinalUrlElement$ma5 === void 0 ? void 0 : _toFinalUrlElement$ma5[1]
                      }

                      if (name) {
                        _pro.push(new Promise(function (resolve) {
                          if (action === 'fuck') {
                            followIns(resolve, name)
                          } else {
                            unfollowIns(resolve, name)
                          }
                        }))
                      }
                    }

                    for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                      _loop6()
                    }
                  } catch (err) {
                    _iterator6.e(err)
                  } finally {
                    _iterator6.f()
                  }

                  Promise.all(_pro).finally(function () {
                    resolve()
                  })
                } catch (e) {
                  throwError(e, 'toggleInsActions')
                }

              case 2:
              case 'end':
                return _context17.stop()
            }
          }
        }, _callee13)
      }))

      return function toggleInsActions (_x20) {
        return _ref27.apply(this, arguments)
      }
    }())

    var updateRedditInfo = function updateRedditInfo () {
      try {
        return new Promise(function (resolve) {
          var status = echoLog({
            type: 'updateRedditInfo'
          })
          httpRequest({
            url: 'https://www.reddit.com/',
            method: 'GET',
            nochche: true,
            onload: function onload (response) {
              if (debug) console.log(response)

              if (response.status === 200) {
                if (response.responseText.includes('www.reddit.com/login/')) {
                  status.error('Error:' + getI18n('loginReddit'), true)
                  resolve({
                    result: 'error',
                    statusText: response.statusText,
                    status: response.status
                  })
                  return
                }

                var _ref28 = response.responseText.match(/"accessToken":"(.*?)","expires":"(.*?)"/) || []
                var _ref29 = _slicedToArray(_ref28, 3)
                var accessToken = _ref29[1]
                var expiresTime = _ref29[2]

                if (accessToken) {
                  redditInfo.accessToken = accessToken
                  redditInfo.expiresTime = new Date(expiresTime).getTime()
                  GM_setValue('redditInfo', redditInfo)
                  status.success()
                  resolve({
                    result: 'success',
                    statusText: response.statusText,
                    status: response.status
                  })
                } else {
                  status.error('Error: Parameter "accessToken" not found!')
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
      } catch (e) {
        throwError(e, 'updateRedditInfo')
      }
    }

    var toggleReddit = function toggleReddit (r, name) {
      var join = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true

      try {
        var type = join ? 'joinReddit' : 'leaveReddit'

        if (/^u_/.test(name)) {
          type = join ? 'followRedditUser' : 'unfollowRedditUser'
        }

        var status = echoLog({
          type: type,
          text: name
        })
        httpRequest({
          url: 'https://oauth.reddit.com/api/subscribe?redditWebClient=desktop2x&app=desktop2x-client-production&raw_json=1&gilding_detail=1',
          method: 'POST',
          headers: {
            authorization: 'Bearer ' + redditInfo.accessToken,
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: $.param({
            action: join ? 'sub' : 'unsub',
            sr_name: name,
            api_type: 'json'
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
      } catch (e) {
        throwError(e, 'toggleReddit')
      }
    }

    var toggleRedditActions = /* #__PURE__ */(function () {
      var _ref31 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee14 (_ref30) {
        var website, type, elements, resolve, action, _ref30$toFinalUrl, toFinalUrl, result, _iterator7, _step7, _loop7

        return regeneratorRuntime.wrap(function _callee14$ (_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                website = _ref30.website, type = _ref30.type, elements = _ref30.elements, resolve = _ref30.resolve, action = _ref30.action, _ref30$toFinalUrl = _ref30.toFinalUrl, toFinalUrl = _ref30$toFinalUrl === void 0 ? {} : _ref30$toFinalUrl
                _context19.prev = 1

                if (!(new Date().getTime() > redditInfo.expiresTime)) {
                  _context19.next = 8
                  break
                }

                _context19.next = 5
                return updateRedditInfo()

              case 5:
                result = _context19.sent

                if (!(!(result === null || result === void 0 ? void 0 : result.result) === 'success')) {
                  _context19.next = 8
                  break
                }

                return _context19.abrupt('return', resolve())

              case 8:
                _iterator7 = _createForOfIteratorHelper(unique(elements))
                _context19.prev = 9
                _loop7 = /* #__PURE__ */regeneratorRuntime.mark(function _loop7 () {
                  var element, name, _toFinalUrlElement$ma6, _toFinalUrlElement$ma7, toFinalUrlElement, userName

                  return regeneratorRuntime.wrap(function _loop7$ (_context18) {
                    while (1) {
                      switch (_context18.prev = _context18.next) {
                        case 0:
                          element = _step7.value
                          name = element

                          if (website === 'giveawaysu' && toFinalUrl[element]) {
                            toFinalUrlElement = toFinalUrl[element] || ''
                            name = (_toFinalUrlElement$ma6 = toFinalUrlElement.match(/https?:\/\/www.reddit.com\/r\/([^/]*)/)) === null || _toFinalUrlElement$ma6 === void 0 ? void 0 : _toFinalUrlElement$ma6[1]
                            userName = (_toFinalUrlElement$ma7 = toFinalUrlElement.match(/https?:\/\/www.reddit.com\/user\/([^/]*)/)) === null || _toFinalUrlElement$ma7 === void 0 ? void 0 : _toFinalUrlElement$ma7[1]
                            if (userName) userName = 'u_' + userName
                            name = name || userName
                          }

                          if (!name) {
                            _context18.next = 6
                            break
                          }

                          _context18.next = 6
                          return new Promise(function (resolve) {
                            toggleReddit(resolve, name, action === 'fuck')
                          })

                        case 6:
                        case 'end':
                          return _context18.stop()
                      }
                    }
                  }, _loop7)
                })

                _iterator7.s()

              case 12:
                if ((_step7 = _iterator7.n()).done) {
                  _context19.next = 16
                  break
                }

                return _context19.delegateYield(_loop7(), 't0', 14)

              case 14:
                _context19.next = 12
                break

              case 16:
                _context19.next = 21
                break

              case 18:
                _context19.prev = 18
                _context19.t1 = _context19.catch(9)

                _iterator7.e(_context19.t1)

              case 21:
                _context19.prev = 21

                _iterator7.f()

                return _context19.finish(21)

              case 24:
                resolve()
                _context19.next = 30
                break

              case 27:
                _context19.prev = 27
                _context19.t2 = _context19.catch(1)
                throwError(_context19.t2, 'toggleRedditActions')

              case 30:
              case 'end':
                return _context19.stop()
            }
          }
        }, _callee14, null, [[1, 27], [9, 18, 21, 24]])
      }))

      return function toggleRedditActions (_x21) {
        return _ref31.apply(this, arguments)
      }
    }())

    var verifyVkLogin = function verifyVkLogin () {
      try {
        return new Promise(function (resolve) {
          var status = echoLog({
            type: 'verifyVkLogin'
          })
          httpRequest({
            url: 'https://vk.com/im',
            method: 'HEAD',
            onload: function onload (response) {
              if (debug) console.log(response)

              if (response.toFinalUrl.includes('vk.com/login')) {
                status.error('Error:' + getI18n('loginVk'), true)
                resolve({
                  result: 'error',
                  statusText: response.statusText,
                  status: response.status
                })
              } else if (response.status === 200) {
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
        }).then(function (_ref32) {
          var result = _ref32.result
          return result === 'success'
        }).catch(function () {
          return false
        })
      } catch (e) {
        throwError(e, 'verifyVkLogin')
      }
    }

    var toggleVk = /* #__PURE__ */(function () {
      var _ref33 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee15 (r, name) {
        var join
        var _yield$getVkId
        var data
        var _args20 = arguments

        return regeneratorRuntime.wrap(function _callee15$ (_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                join = _args20.length > 2 && _args20[2] !== undefined ? _args20[2] : true
                _context20.prev = 1
                _context20.next = 4
                return getVkId(name)

              case 4:
                _yield$getVkId = _context20.sent
                data = _yield$getVkId.data

                if (data) {
                  _context20.next = 8
                  break
                }

                return _context20.abrupt('return')

              case 8:
                _context20.t0 = data.type
                _context20.next = _context20.t0 === 'group' ? 11 : _context20.t0 === 'public' ? 13 : 14
                break

              case 11:
                toggleVkGroup(r, name, data, join)
                return _context20.abrupt('break', 14)

              case 13:
                toggleVkPublic(r, name, data, join)

              case 14:
                _context20.next = 19
                break

              case 16:
                _context20.prev = 16
                _context20.t1 = _context20.catch(1)
                throwError(_context20.t1, 'toggleVk')

              case 19:
              case 'end':
                return _context20.stop()
            }
          }
        }, _callee15, null, [[1, 16]])
      }))

      return function toggleVk (_x22, _x23) {
        return _ref33.apply(this, arguments)
      }
    }())

    var toggleVkGroup = function toggleVkGroup (r, name, data) {
      var join = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true

      try {
        var status = echoLog({
          type: join ? 'joinVkGroup' : 'leaveVkGroup',
          text: name
        })

        if (data.groupAct === 'enter' && !join || data.groupAct === 'leave' && join) {
          status.success()
          r({
            result: 'success'
          })
        }

        var reqData = {
          act: join ? 'enter' : 'leave',
          al: 1,
          gid: data.groupId,
          hash: data.groupHash
        }
        if (join) reqData.context = '_'
        httpRequest({
          url: 'https://vk.com/al_groups.php',
          method: 'POST',
          headers: {
            origin: 'https://vk.com',
            referer: 'https://vk.com/' + name,
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: $.param(reqData),
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
      } catch (e) {
        throwError(e, 'toggleVkGroup')
      }
    }

    var toggleVkPublic = function toggleVkPublic (r, name, data) {
      var join = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true

      try {
        var status = echoLog({
          type: join ? 'joinVkPublic' : 'leaveVkPublic',
          text: name
        })

        if (data.publicJoined && join || !data.publicJoined && !join) {
          status.success()
          r({
            result: 'success'
          })
        }

        httpRequest({
          url: 'https://vk.com/al_public.php',
          method: 'POST',
          headers: {
            origin: 'https://vk.com',
            referer: 'https://vk.com/' + name,
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: $.param({
            act: join ? 'a_enter' : 'a_leave',
            al: 1,
            pid: data.publicPid,
            hash: data.publicHash
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
      } catch (e) {
        throwError(e, 'toggleVkPublic')
      }
    }

    var getVkId = function getVkId (name) {
      try {
        return new Promise(function (resolve) {
          var status = echoLog({
            type: 'getVkId',
            text: name
          })
          httpRequest({
            url: 'https://vk.com/' + name,
            method: 'GET',
            onload: function onload (response) {
              if (debug) console.log(response)

              if (response.status === 200) {
                var _response$responseTex10, _response$responseTex11

                var _ref34 = response.responseText.match(/Groups.(enter|leave)\(.*?,.*?([\d]+?), '(.*?)'/) || []
                var _ref35 = _slicedToArray(_ref34, 4)
                var groupAct = _ref35[1]
                var groupId = _ref35[2]
                var groupHash = _ref35[3]

                var publicHash = (_response$responseTex10 = response.responseText.match(/"enterHash":"(.*?)"/)) === null || _response$responseTex10 === void 0 ? void 0 : _response$responseTex10[1]
                var publicPid = (_response$responseTex11 = response.responseText.match(/"public_id":([\d]+?),/)) === null || _response$responseTex11 === void 0 ? void 0 : _response$responseTex11[1]
                var publicJoined = !response.responseText.includes('Public.subscribe')

                if (groupAct && groupId && groupHash) {
                  status.success()
                  resolve({
                    result: 'success',
                    statusText: response.statusText,
                    status: response.status,
                    data: {
                      groupAct: groupAct,
                      groupId: groupId,
                      groupHash: groupHash,
                      type: 'group'
                    }
                  })
                } else if (publicHash && publicPid) {
                  status.success()
                  resolve({
                    result: 'success',
                    statusText: response.statusText,
                    status: response.status,
                    data: {
                      publicHash: publicHash,
                      publicPid: publicPid,
                      publicJoined: publicJoined,
                      type: 'public'
                    }
                  })
                } else {
                  status.error('Error: Parameter "id" not found!')
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
      } catch (e) {
        throwError(e, 'getVkId')
      }
    }

    var toggleVkActions = /* #__PURE__ */(function () {
      var _ref37 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee16 (_ref36) {
        var website, type, elements, resolve, action, _ref36$toFinalUrl, toFinalUrl, isLogin, _iterator8, _step8, _loop8

        return regeneratorRuntime.wrap(function _callee16$ (_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                website = _ref36.website, type = _ref36.type, elements = _ref36.elements, resolve = _ref36.resolve, action = _ref36.action, _ref36$toFinalUrl = _ref36.toFinalUrl, toFinalUrl = _ref36$toFinalUrl === void 0 ? {} : _ref36$toFinalUrl
                _context22.prev = 1
                _context22.next = 4
                return verifyVkLogin()

              case 4:
                isLogin = _context22.sent

                if (isLogin) {
                  _context22.next = 7
                  break
                }

                return _context22.abrupt('return', resolve())

              case 7:
                _iterator8 = _createForOfIteratorHelper(unique(elements))
                _context22.prev = 8
                _loop8 = /* #__PURE__ */regeneratorRuntime.mark(function _loop8 () {
                  var element, name, _toFinalUrlElement$ma8, toFinalUrlElement

                  return regeneratorRuntime.wrap(function _loop8$ (_context21) {
                    while (1) {
                      switch (_context21.prev = _context21.next) {
                        case 0:
                          element = _step8.value
                          name = element

                          if (website === 'giveawaysu' && toFinalUrl[element]) {
                            toFinalUrlElement = toFinalUrl[element] || ''
                            name = (_toFinalUrlElement$ma8 = toFinalUrlElement.match(/https:\/\/vk.com\/([^/]+)/)) === null || _toFinalUrlElement$ma8 === void 0 ? void 0 : _toFinalUrlElement$ma8[1]
                          }

                          if (!name) {
                            _context21.next = 6
                            break
                          }

                          _context21.next = 6
                          return new Promise(function (resolve) {
                            toggleVk(resolve, name, action === 'fuck')
                          })

                        case 6:
                        case 'end':
                          return _context21.stop()
                      }
                    }
                  }, _loop8)
                })

                _iterator8.s()

              case 11:
                if ((_step8 = _iterator8.n()).done) {
                  _context22.next = 15
                  break
                }

                return _context22.delegateYield(_loop8(), 't0', 13)

              case 13:
                _context22.next = 11
                break

              case 15:
                _context22.next = 20
                break

              case 17:
                _context22.prev = 17
                _context22.t1 = _context22.catch(8)

                _iterator8.e(_context22.t1)

              case 20:
                _context22.prev = 20

                _iterator8.f()

                return _context22.finish(20)

              case 23:
                resolve()
                _context22.next = 29
                break

              case 26:
                _context22.prev = 26
                _context22.t2 = _context22.catch(1)
                throwError(_context22.t2, 'toggleVkActions')

              case 29:
              case 'end':
                return _context22.stop()
            }
          }
        }, _callee16, null, [[1, 26], [8, 17, 20, 23]])
      }))

      return function toggleVkActions (_x24) {
        return _ref37.apply(this, arguments)
      }
    }())

    var toggleActions = function toggleActions (e) {
      try {
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

          case 'reddit':
            toggleRedditActions(e)
            break

          case 'vk':
            toggleVkActions(e)
            break

          case 'youtube':
            toggleYtbActions(e)
            break

          default:
            toggleSteamActions(e)
        }
      } catch (e) {
        throwError(e, 'toggleActions')
      }
    }

    var getDiscordAuth = function getDiscordAuth () {
      try {
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
      } catch (e) {
        throwError(e, 'getDiscordAuth')
      }
    }

    var newTabBlock = function newTabBlock () {
      try {
        var d = new Date()
        var cookiename = 'haveVisited1'
        document.cookie = cookiename + '=1; path=/'
        document.cookie = cookiename + '=' + (d.getUTCMonth() + 1) + '/' + d.getUTCDate() + '/' + d.getUTCFullYear() + '; path=/'
      } catch (e) {
        throwError(e, 'newTabBlock')
      }
    }

    var checkUpdate = function checkUpdate () {
      var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false

      try {
        var status = false
        if (s) {
          status = echoLog({
            type: 'custom',
            text: '<li>'.concat(getI18n('checkingUpdate'), '<font></font></li>')
          })
        }
        httpRequest({
          url: 'https://auto-task-test.hclonely.com/version.json?t=' + new Date().getTime(),
          method: 'get',
          dataType: 'json',
          onload: function onload (response) {
            var _response$response18

            if (debug) console.log(response)

            var _GM_info$script$versi = GM_info.script.version.split('.')
            var _GM_info$script$versi2 = _slicedToArray(_GM_info$script$versi, 3)
            var ov1 = _GM_info$script$versi2[0]
            var ov2 = _GM_info$script$versi2[1]
            var ov3 = _GM_info$script$versi2[2]

            if ((_response$response18 = response.response) === null || _response$response18 === void 0 ? void 0 : _response$response18.version) {
              var _response$response$ve = response.response.version.split('.')
              var _response$response$ve2 = _slicedToArray(_response$response$ve, 3)
              var nv1 = _response$response$ve2[0]
              var nv2 = _response$response$ve2[1]
              var nv3 = _response$response$ve2[2]

              if (nv1 > ov1 || nv1 === ov1 && nv2 > ov2 || nv1 === ov1 && nv2 === ov2 && nv3 > ov3) {
                echoLog({
                  type: 'custom',
                  text: '<li>'.concat(getI18n('newVer') + 'V' + response.response.version, '<a href="https://auto-task-test.hclonely.com/auto-task-test.user.js?t=').concat(new Date().getTime(), '" target="_blank">').concat(getI18n('updateNow'), '</a><font></font></li>')
                })
                if (s) status.success(getI18n('newVer') + response.response.version)
              } else {
                if (s) status.success(getI18n('thisIsNew'))
              }
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
      } catch (e) {
        throwError(e, 'checkUpdate')
      }
    }

    var updateInfo = function updateInfo () {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
      var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}

      try {
        var _steamStore, _steamCommunity, _twitter

        var steamStore = args.steamStore
        var steamCommunity = args.steamCommunity
        var twitter = args.twitter
        var defaultData = {
          groups: [],
          forums: [],
          curators: [],
          publishers: [],
          developers: [],
          franchises: [],
          fGames: [],
          wGames: [],
          announcements: [],
          discords: [],
          instagrams: [],
          twitchs: [],
          reddits: [],
          vks: [],
          twitterUsers: [],
          retweets: []
        }

        var _Object$assign = Object.assign(defaultData, data)
        var groups = _Object$assign.groups
        var forums = _Object$assign.forums
        var curators = _Object$assign.curators
        var publishers = _Object$assign.publishers
        var developers = _Object$assign.developers
        var franchises = _Object$assign.franchises
        var fGames = _Object$assign.fGames
        var wGames = _Object$assign.wGames
        var announcements = _Object$assign.announcements
        var twitterUsers = _Object$assign.twitterUsers
        var retweets = _Object$assign.retweets

        steamStore = (_steamStore = steamStore) !== null && _steamStore !== void 0 ? _steamStore : [].concat(_toConsumableArray(curators), _toConsumableArray(publishers), _toConsumableArray(developers), _toConsumableArray(franchises), _toConsumableArray(fGames), _toConsumableArray(wGames), _toConsumableArray(announcements)).length > 0
        steamCommunity = (_steamCommunity = steamCommunity) !== null && _steamCommunity !== void 0 ? _steamCommunity : [].concat(_toConsumableArray(groups), _toConsumableArray(forums), _toConsumableArray(announcements)).length > 0
        twitter = (_twitter = twitter) !== null && _twitter !== void 0 ? _twitter : [].concat(_toConsumableArray(twitterUsers), _toConsumableArray(retweets)).length > 0
        var _pro2 = []

        if (steamStore && steamCommunity) {
          _pro2.push(new Promise(function (resolve) {
            updateSteamInfo(resolve, 'all')
          }))
        } else if (steamStore) {
          _pro2.push(new Promise(function (resolve) {
            updateSteamInfo(resolve, 'store')
          }))
        } else if (steamCommunity) {
          _pro2.push(new Promise(function (resolve) {
            updateSteamInfo(resolve, 'community')
          }))
        }

        if (twitter) {
          _pro2.push(new Promise(function (resolve) {
            if (new Date().getTime() - twitterInfo.updateTime > 15 * 60 * 1000) {
              updateTwitterInfo(resolve)
            } else {
              resolve()
            }
          }))
        }

        return Promise.all(_pro2)
      } catch (e) {
        throwError(e, 'updateInfo')
      }
    }

    'use strict'

    zh_CN = {
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
      joinSteamGroup: '正在加入Steam组',
      getSteamGroupId: '正在获取Steam组ID',
      leaveSteamGroup: '正在退出Steam组',
      subscribeForum: '正在订阅Steam论坛',
      getForumId: '正在获取Steam论坛ID',
      unsubscribeForum: '正在取消订阅Steam论坛',
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
      functionError: 's%函数执行出错，详细信息请查看控制台(红色背景部分)！',
      ajaxError: 'Ajax请求出错',
      firstUpdate: '首次更新到3.0+需要重新设置，是否前往设置？',
      goSetting: '前往设置',
      getGroupError: '获取steam组信息失败 <a href="s%" target="_blank">s%</a>',
      verifyDiscordAuth: '正在验证discord凭证',
      joinDiscordServer: '正在加入discord服务器',
      leaveDiscordServer: '正在退出discord服务器',
      updateDiscordAuth: 'Discord凭证失效，请<a href="https://discord.com/app" target="_blank">更新凭证</a>！',
      getAuthSuccess: '更新凭证成功！',
      getAuthError: '更新凭证失败，请确认已正确安装辅助脚本！',
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
      getTwitterUserId: '正在获取twitter用户id',
      updateYtbInfoSuccess: '更新youtube凭证成功',
      updateYtbInfoError: '更新youtube凭证失败',
      tryUpdateYtbAuth: '请尝试<a href="https://www.youtube.com/#updateYtbInfo" target="_blank">更新youtube凭证</a>',
      updateYtbInfo: '请先<a href="https://www.youtube.com/#updateYtbInfo" target="_blank">更新youtube凭证</a>',
      loginYtb: '请先<a href="https://accounts.google.com/ServiceLogin?service=youtube" target="_blank">登录youtube</a>',
      updateTwitchInfoSuccess: '更新twitch凭证成功',
      updateTwitchInfoError: '更新twitch凭证失败',
      updateTwitchAuth: '请<a href="https://www.twitch.tv/#updateTwitchInfo" target="_blank">更新凭证</a>',
      verifyTwitchAuth: '正在验证twitch凭证',
      followTwitchChannel: '正在关注twitch频道',
      unfollowTwitchChannel: '正在取关twitch频道',
      getTwitchChannelId: '正在获取twitch频道id',
      updateRedditInfo: '正在更新reddit凭证',
      loginReddit: '请先<a href="https://www.reddit.com/login/" target="_blank">登录reddit</a>',
      joinReddit: '正在加入subreddit',
      leaveReddit: '正在退出subreddit',
      followRedditUser: '正在关注reddit用户',
      unfollowRedditUser: '正在取关reddit用户',
      verifyVkLogin: '正在检测vk是否登录',
      loginVk: '请先<a href="https://vk.com/login" target="_blank">登录vk</a>',
      joinVkGroup: '正在加入vk群',
      leaveVkGroup: '正在退出vk群',
      joinVkPublic: '正在加入vk社区',
      leaveVkPublic: '正在退出vk社区',
      getVkId: '正在获取vk群/社区id',
      insBanned: '你的Ins账户已被封禁',
      gsNotice: '为避免得到"0000-0000-0000"key, 已自动屏蔽"Grab Key"按钮，获取key时请关闭脚本！'
    }
    en_US = {
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
      joinSteamGroup: 'Joining the Steam group',
      getSteamGroupId: 'Getting Steam group ID',
      leaveSteamGroup: 'Leaving Steam group',
      getCuratorId: 'Getting Curator ID',
      subscribeForum: 'Subscribing Steam Forum',
      unsubscribeForum: 'Unsubscribing Steam Forum',
      getForumId: 'Getting Steam Forum Id',
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
      unfollowGame: 'Unfollowing game',
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
      functionError: 'Function:s% execution error, please see the console for details (red background part)!',
      ajaxError: 'Ajax request error',
      firstUpdate: 'The first update to 3.0+ requires re-setting. Do you want to go to the setting?',
      goSetting: 'Yes',
      getGroupError: 'Failed to get steam group information. <a href="s%" target="_blank">s%</a>',
      verifyDiscordAuth: 'Verifying discord authorization',
      joinDiscordServer: 'Joining discord server',
      leaveDiscordServer: 'Leaving discord server',
      updateDiscordAuth: 'Discord authorization is invalid, please <a href="https://discord.com/app" target="_blank">update the authorization</a>!',
      getAuthSuccess: 'Successfully updated auth!',
      getAuthError: 'Failed to update auth, please confirm that the helper script has been installed correctly!',
      getInsInfo: 'Getting ins user id',
      followIns: 'Following ins user',
      unfollowIns: 'Unfollowing ins user',
      loginIns: 'Please <a href="https://www.instagram.com/accounts/login/" target="_blank">login to ins</a>',
      updateTwitterInfo: 'Updating twitter auth',
      loginTwitter: 'Please <a href="https://twitter.com/login" target="_blank">login to twitter</a>',
      followTwitterUser: 'Following twitter user',
      unfollowTwitterUser: 'Unfollowing twitter user',
      retweet: 'Retweeting',
      unretweet: 'Unretweeting',
      getTwitterUserId: 'Getting twitter user id',
      updateYtbInfoSuccess: 'Successfully updated youtube auth',
      updateYtbInfoError: 'Failed to update youtube auth',
      tryUpdateYtbAuth: 'Please try to <a href="https://www.youtube.com/#updateYtbInfo" target="_blank">update youtube auth</a>',
      updateYtbInfo: 'Please <a href="https://www.youtube.com/#updateYtbInfo" target="_blank">update youtube auth</a> first',
      loginYtb: 'Please <a href="https://accounts.google.com/ServiceLogin?service=youtube" target="_blank">login to youtube</a>',
      updateTwitchInfoSuccess: 'Successfully updated twitch auth',
      updateTwitchInfoError: 'Failed to update twitch auth',
      updateTwitchAuth: 'Please <a href="https://www.twitch.tv/#updateTwitchInfo" target="_blank">update auth</a>',
      verifyTwitchAuth: 'Verifying twitch authorization',
      followTwitchChannel: 'Following twitch channel',
      unfollowTwitchChannel: 'Unfollowing twitch channel',
      getTwitchChannelId: 'Getting twitch channel id',
      updateRedditInfo: 'Updating reddit auth',
      loginReddit: 'Please <a href="https://www.reddit.com/login/" target="_blank">login to reddit</a>',
      joinReddit: 'Joining subreddit',
      leaveReddit: 'Leaving subreddit',
      followRedditUser: 'Following reddit user',
      unfollowRedditUser: 'Unfollowing reddit user',
      verifyVkLogin: 'Checking whether vk is logged in',
      loginVk: 'Please <a href="https://vk.com/login" target="_blank">login to vk</a>',
      joinVkGroup: 'Joining vk group',
      leaveVkGroup: 'Leaving vk group',
      joinVkPublic: 'Joining vk public',
      leaveVkPublic: 'Leaving vk public',
      getVkId: 'Getting vk group/public id',
      insBanned: 'Your Instagram account has been banned',
      gsNotice: 'In order to avoid getting the "0000-0000-0000"key, the "Grab Key" button has been hidden, please close the script when obtaining the key!'
    }
    var i18n = {
      'zh-CN': zh_CN,
      'en-US': en_US
    }
    var language = getLanguage()
    var defaultConf = {
      global: {
        fuck: {
          joinSteamGroup: true,
          subscribeSteamForum: true,
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
          followTwitchChannel: true,
          joinReddit: true,
          followRedditUser: true,
          followYoutubeChannel: true,
          joinVk: true,
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
          unsubscribeSteamForum: true,
          unfollowCurator: true,
          unfollowDeveloper: true,
          unfollowPublisher: true,
          removeFromWishlist: true,
          unfollowGame: true,
          leaveDiscordServer: true,
          unfollowIns: true,
          unfollowTwitterUser: true,
          unretweet: true,
          unfollowTwitchChannel: true,
          leaveReddit: true,
          unfollowRedditUser: true,
          unfollowYoutubeChannel: true,
          leaveVk: true
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
          subscribeSteamForum: true,
          followCurator: true,
          followDeveloper: true,
          followPublisher: true,
          likeAnnouncement: true,
          addToWishlist: true,
          followGame: true,
          joinDiscordServer: true,
          followIns: true,
          followTwitchChannel: true,
          joinReddit: true,
          followRedditUser: true,
          followYoutubeChannel: true,
          joinVk: true,
          visitLink: true
        },
        remove: {
          leaveSteamGroup: true,
          unsubscribeSteamForum: true,
          unfollowCurator: true,
          unfollowDeveloper: true,
          unfollowPublisher: true,
          removeFromWishlist: true,
          unfollowGame: true,
          leaveDiscordServer: true,
          unfollowIns: true,
          unfollowTwitchChannel: true,
          leaveReddit: true,
          unfollowRedditUser: true,
          unfollowYoutubeChannel: true,
          leaveVk: true
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
          unretweet: true
        },
        enable: false
      },

      gamehag: {
        fuck: {
          joinSteamGroup: true,
          followCurator: true,
          followTwitterUser: true,
          retweet: true,
          visitLink: true,
          verifyTask: true
        },
        remove: {
          leaveSteamGroup: true,
          unfollowCurator: true,
          unfollowTwitterUser: true,
          unretweet: true
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

      gleam: {
        fuck: {
          joinSteamGroup: true,
          followTwitterUser: true,
          retweet: true,
          visitLink: true,
          verifyTask: true
        },
        remove: {
          leaveSteamGroup: true,
          unfollowTwitterUser: true,
          unretweet: true
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
    window.redditInfo = getRedditInfo()
    window.youtubeInfo = getYtbInfo()
    var config = Object.assign(JSON.parse(JSON.stringify(defaultConf)), GM_getValue('conf') || {})

    for (var _i = 0, _Object$keys = Object.keys(config); _i < _Object$keys.length; _i++) {
      var k = _Object$keys[_i]
      var defaultConfig = JSON.parse(JSON.stringify(defaultConf))

      if (defaultConfig[k]) {
        if (Object.prototype.toString.call(defaultConfig[k]) === '[object Object]') {
          for (var _i2 = 0, _Object$keys2 = Object.keys(defaultConfig[k]); _i2 < _Object$keys2.length; _i2++) {
            var k1 = _Object$keys2[_i2]
            config[k][k1] = Object.assign(defaultConfig[k][k1], config[k][k1])
          }
        } else {
          config[k] = config[k] || defaultConfig[k]
        }
      }
    }

    var globalConf = config.global
    var debug = globalConf.other.showDetails
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
      updateYtbInfo: updateYtbInfo,
      clearTaskInfo: clearTaskInfo,
      uniqueTaskInfo: uniqueTaskInfo,
      updateInfo: updateInfo,
      checkUpdate: checkUpdate,
      newTabBlock: newTabBlock,
      delay: delay
    }
    var banana = {
      test: function test () {
        try {
          return window.location.host.includes('grabfreegame') || window.location.host.includes('bananagiveaway')
        } catch (e) {
          throwError(e, 'banana.test')
        }
      },
      fuck: function fuck () {
        var _this = this

        try {
          var _ref38 = [$("p:contains('Collect'):contains('banana')"), $("p:contains('Collect'):contains('point')")]
          var needBanana = _ref38[0]
          var needPoints = _ref38[1]
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
            }).then(function (_ref39) {
              var value = _ref39.value

              if (value) {
                _this.get_tasks('do_task')
              }
            })
          } else {
            this.get_tasks('do_task')
          }
        } catch (e) {
          throwError(e, 'banana.fuck')
        }
      },
      get_tasks: function get_tasks () {
        var _this2 = this

        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'do_task'

        try {
          var taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
          if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory

          if (callback === 'remove' && taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
            this.remove(true)
          } else {
            this.currentTaskInfo = fuc.clearTaskInfo(this.currentTaskInfo)
            var _ref40 = [fuc.echoLog({
              type: 'custom',
              text: '<li>'.concat(getI18n('processTasksInfo'), '<font></font></li>')
            }), $('ul.tasks li:not(:contains(Completed))'), []]
            var status = _ref40[0]
            var tasksUl = _ref40[1]
            var _pro3 = _ref40[2]

            var _iterator9 = _createForOfIteratorHelper(tasksUl)
            var _step9

            try {
              var _loop9 = function _loop9 () {
                var _verifyBtn$attr, _verifyBtn$attr$match

                var task = _step9.value

                var _ref41 = [$(task).find('p'), $(task).find('button:contains(Verify)')]
                var taskDes = _ref41[0]
                var verifyBtn = _ref41[1]
                var taskId = (_verifyBtn$attr = verifyBtn.attr('onclick')) === null || _verifyBtn$attr === void 0 ? void 0 : (_verifyBtn$attr$match = _verifyBtn$attr.match(/\?verify=([\d]+)/)) === null || _verifyBtn$attr$match === void 0 ? void 0 : _verifyBtn$attr$match[1]

                if (taskId) {
                  _this2.currentTaskInfo.tasks.push({
                    taskId: taskId,
                    taskDes: taskDes.text()
                  })

                  if (/join.*?steam.*?group/gim.test(taskDes.text())) {
                    _pro3.push(new Promise(function (resolve) {
                      new Promise(function (resolve) {
                        fuc.getFinalUrl(resolve, window.location.origin + window.location.pathname + '?q=' + taskId)
                      }).then(function (_ref42) {
                        var result = _ref42.result
                        var finalUrl = _ref42.finalUrl

                        if (result === 'success') {
                          var _finalUrl$match

                          var groupName = (_finalUrl$match = finalUrl.match(/groups\/(.+)\/?/)) === null || _finalUrl$match === void 0 ? void 0 : _finalUrl$match[1]

                          if (groupName) {
                            _this2.currentTaskInfo.groups.push(groupName)

                            _this2.taskInfo.groups.push(groupName)
                          } else {
                            _this2.currentTaskInfo.taskIds.push(taskId)
                          }
                        } else {
                          _this2.currentTaskInfo.taskIds.push(taskId)
                        }

                        resolve(1)
                      }).catch(function (error) {
                        if (debug) console.error(error)
                        resolve(0)
                      })
                    }))
                  } else if (/follow.*?curator/gim.test(taskDes.text())) {
                    _pro3.push(new Promise(function (resolve) {
                      new Promise(function (resolve) {
                        fuc.getFinalUrl(resolve, window.location.origin + window.location.pathname + '?q=' + taskId)
                      }).then(function (_ref43) {
                        var result = _ref43.result
                        var finalUrl = _ref43.finalUrl

                        if (result === 'success') {
                          var _finalUrl$match2

                          var curatorId = (_finalUrl$match2 = finalUrl.match(/curator\/([\d]+)/)) === null || _finalUrl$match2 === void 0 ? void 0 : _finalUrl$match2[1]

                          if (curatorId) {
                            _this2.currentTaskInfo.curators.push(curatorId)

                            _this2.taskInfo.curators.push(curatorId)
                          } else {
                            _this2.currentTaskInfo.taskIds.push(taskId)
                          }
                        } else {
                          _this2.currentTaskInfo.taskIds.push(taskId)
                        }

                        resolve(1)
                      }).catch(function (error) {
                        if (debug) console.error(error)
                        resolve(0)
                      })
                    }))
                  } else if (/wishlist/gim.test(taskDes.text())) {
                    _pro3.push(new Promise(function (resolve) {
                      new Promise(function (resolve) {
                        fuc.getFinalUrl(resolve, window.location.origin + window.location.pathname + '?q=' + taskId)
                      }).then(function (_ref44) {
                        var result = _ref44.result
                        var finalUrl = _ref44.finalUrl

                        if (result === 'success') {
                          var _finalUrl$match3

                          var appId = (_finalUrl$match3 = finalUrl.match(/store.steampowered.com\/app\/([\d]+)/)) === null || _finalUrl$match3 === void 0 ? void 0 : _finalUrl$match3[1]

                          if (appId) {
                            _this2.currentTaskInfo.wishlists.push(appId)

                            _this2.taskInfo.wishlists.push(appId)
                          } else {
                            _this2.currentTaskInfo.taskIds.push(taskId)
                          }
                        } else {
                          _this2.currentTaskInfo.taskIds.push(taskId)
                        }

                        resolve(1)
                      }).catch(function (error) {
                        if (debug) console.error(error)
                        resolve(0)
                      })
                    }))
                  } else if (/Retweet/gim.test(taskDes.text())) {
                    _pro3.push(new Promise(function (resolve) {
                      new Promise(function (resolve) {
                        fuc.getFinalUrl(resolve, window.location.origin + window.location.pathname + '?q=' + taskId)
                      }).then(function (_ref45) {
                        var result = _ref45.result
                        var finalUrl = _ref45.finalUrl

                        if (result === 'success') {
                          var _finalUrl$match4

                          var appId = (_finalUrl$match4 = finalUrl.match(/status\/([\d]+)/)) === null || _finalUrl$match4 === void 0 ? void 0 : _finalUrl$match4[1]

                          if (appId) {
                            _this2.currentTaskInfo.retweets.push(appId)

                            _this2.taskInfo.retweets.push(appId)
                          } else {
                            _this2.currentTaskInfo.taskIds.push(taskId)
                          }
                        } else {
                          _this2.currentTaskInfo.taskIds.push(taskId)
                        }

                        resolve(1)
                      }).catch(function (error) {
                        if (debug) console.error(error)
                        resolve(0)
                      })
                    }))
                  } else {
                    if (/(Subscribe.*channel)|(Twitter)|(Retweet)/gim.test(taskDes.text())) {
                      if (!_this2.verifyBtn) _this2.verifyBtn = taskDes.parent().find('button:contains(Verify)')

                      if (callback === 'do_task' && globalConf.other.autoOpen) {
                        taskDes.parent().find('button')[0].click()
                      }
                    }

                    _pro3.push(new Promise(function (resolve) {
                      _this2.currentTaskInfo.links.push(window.location.origin + window.location.pathname + '?q=' + taskId)

                      _this2.currentTaskInfo.taskIds.push(taskId)

                      resolve(1)
                    }))
                  }
                }
              }

              for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
                _loop9()
              }
            } catch (err) {
              _iterator9.e(err)
            } finally {
              _iterator9.f()
            }

            Promise.all(_pro3).finally(function () {
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
        } catch (e) {
          throwError(e, 'banana.get_tasks')
        }
      },
      do_task: function do_task () {
        var _this3 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee17 () {
          var _pro4, links, _iterator10, _step10, _loop10

          return regeneratorRuntime.wrap(function _callee17$ (_context23) {
            while (1) {
              switch (_context23.prev = _context23.next) {
                case 0:
                  _context23.prev = 0
                  _context23.next = 3
                  return _this3.toggleActions('fuck')

                case 3:
                  _pro4 = _context23.sent
                  links = fuc.unique(_this3.currentTaskInfo.links)

                  if (_this3.conf.fuck.visitLink) {
                    _iterator10 = _createForOfIteratorHelper(links)

                    try {
                      _loop10 = function _loop10 () {
                        var link = _step10.value

                        _pro4.push(new Promise(function (resolve) {
                          fuc.visitLink(resolve, link)
                        }))
                      }

                      for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
                        _loop10()
                      }
                    } catch (err) {
                      _iterator10.e(err)
                    } finally {
                      _iterator10.f()
                    }
                  }

                  Promise.all(_pro4).finally(function () {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                    })
                    if (_this3.conf.fuck.verifyTask) _this3.verify()
                  })
                  _context23.next = 12
                  break

                case 9:
                  _context23.prev = 9
                  _context23.t0 = _context23.catch(0)
                  throwError(_context23.t0, 'banana.do_task')

                case 12:
                case 'end':
                  return _context23.stop()
              }
            }
          }, _callee17, null, [[0, 9]])
        }))()
      },
      verify: function verify () {
        var _this4 = this

        var verify = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false

        try {
          if (verify) {
            var _pro5 = []

            var _iterator11 = _createForOfIteratorHelper(fuc.unique(this.currentTaskInfo.tasks))
            var _step11

            try {
              var _loop11 = function _loop11 () {
                var task = _step11.value
                var status = fuc.echoLog({
                  type: 'custom',
                  text: '<li>'.concat(getI18n('verifyingTask')).concat(task.taskDes, '...<font></font></li>')
                })

                _pro5.push(new Promise(function (resolve) {
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

              for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
                _loop11()
              }
            } catch (err) {
              _iterator11.e(err)
            } finally {
              _iterator11.f()
            }

            Promise.all(_pro5).finally(function () {
              fuc.echoLog({
                type: 'custom',
                text: '<li><font class="success">'.concat(getI18n('verifyTasksComplete'), '</font></li>')
              })
              _this4.verifyBtn.length > 0 ? _this4.verifyBtn.removeAttr('disabled')[0].click() : window.location.reload(true)
            })
          } else {
            this.get_tasks('verify')
          }
        } catch (e) {
          throwError(e, 'banana.verify')
        }
      },
      remove: function remove () {
        var _arguments = arguments
        var _this5 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee18 () {
          var remove, _pro6

          return regeneratorRuntime.wrap(function _callee18$ (_context24) {
            while (1) {
              switch (_context24.prev = _context24.next) {
                case 0:
                  remove = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : false
                  _context24.prev = 1

                  if (!remove) {
                    _context24.next = 9
                    break
                  }

                  _context24.next = 5
                  return _this5.toggleActions('remove')

                case 5:
                  _pro6 = _context24.sent
                  Promise.all(_pro6).finally(function () {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                    })
                  })
                  _context24.next = 10
                  break

                case 9:
                  _this5.get_tasks('remove')

                case 10:
                  _context24.next = 15
                  break

                case 12:
                  _context24.prev = 12
                  _context24.t0 = _context24.catch(1)
                  throwError(_context24.t0, 'banana.remove')

                case 15:
                case 'end':
                  return _context24.stop()
              }
            }
          }, _callee18, null, [[1, 12]])
        }))()
      },
      toggleActions: function toggleActions (action) {
        var _this6 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee19 () {
          var _pro7, fuck, taskInfo, groups, curators, wishlists, fGames, retweets

          return regeneratorRuntime.wrap(function _callee19$ (_context25) {
            while (1) {
              switch (_context25.prev = _context25.next) {
                case 0:
                  _context25.prev = 0
                  _pro7 = []
                  fuck = action === 'fuck'
                  taskInfo = fuck ? _this6.currentTaskInfo : _this6.taskInfo
                  _context25.next = 6
                  return fuc.updateInfo(taskInfo)

                case 6:
                  groups = taskInfo.groups, curators = taskInfo.curators, wishlists = taskInfo.wishlists, fGames = taskInfo.fGames, retweets = taskInfo.retweets

                  if (_this6.conf[action][fuck ? 'joinSteamGroup' : 'leaveSteamGroup'] && groups.length > 0) {
                    _pro7.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        website: 'banana',
                        type: 'group',
                        elements: groups,
                        resolve: resolve,
                        action: action
                      })
                    }))
                  }

                  if (_this6.conf[action][fuck ? 'followCurator' : 'unfollowCurator'] && curators.length > 0) {
                    _pro7.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        website: 'banana',
                        type: 'curator',
                        elements: curators,
                        resolve: resolve,
                        action: action
                      })
                    }))
                  }

                  if (_this6.conf[action][fuck ? 'addToWishlist' : 'removeFromWishlist'] && wishlists.length > 0) {
                    _pro7.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        website: 'banana',
                        type: 'wishlist',
                        elements: wishlists,
                        resolve: resolve,
                        action: action
                      })
                    }))
                  }

                  if (_this6.conf[action][fuck ? 'followGame' : 'unfollowGame'] && fGames.length > 0) {
                    _pro7.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        website: 'banana',
                        type: 'game',
                        elements: fGames,
                        resolve: resolve,
                        action: action
                      })
                    }))
                  }

                  if (_this6.conf[action][fuck ? 'retweet' : 'unretweet'] && retweets.length > 0) {
                    _pro7.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        website: 'banana',
                        social: 'twitter',
                        type: 'retweet',
                        elements: retweets,
                        resolve: resolve,
                        action: action
                      })
                    }))
                  }

                  return _context25.abrupt('return', _pro7)

                case 15:
                  _context25.prev = 15
                  _context25.t0 = _context25.catch(0)
                  throwError(_context25.t0, 'banana.toggleActions')

                case 18:
                case 'end':
                  return _context25.stop()
              }
            }
          }, _callee19, null, [[0, 15]])
        }))()
      },
      get_giveawayId: function get_giveawayId () {
        try {
          var _window$location$href

          return ((_window$location$href = window.location.href.match(/\/giveaway\/([\w\d-]+)/)) === null || _window$location$href === void 0 ? void 0 : _window$location$href[1]) || window.location.href
        } catch (e) {
          throwError(e, 'banana.get_giveawayId')
        }
      },
      checkLogin: function checkLogin () {
        try {
          if ($('a.steam[title*=team]').length > 0) window.open('/giveaway/steam/', '_self')
        } catch (e) {
          throwError(e, 'banana.checkLogin')
        }
      },
      checkLeft: function checkLeft () {
        try {
          if ($('.left b').text() === '0') {
            Swal.fire({
              icon: 'warning',
              title: getI18n('notice'),
              text: getI18n('noKeysLeft'),
              confirmButtonText: getI18n('confirm'),
              cancelButtonText: getI18n('cancel'),
              showCancelButton: true
            }).then(function (_ref46) {
              var value = _ref46.value

              if (value) {
                window.close()
              }
            })
          }
        } catch (e) {
          throwError(e, 'banana.checkLeft')
        }
      },
      verifyBtn: 0,
      currentTaskInfo: {
        links: [],
        groups: [],
        curators: [],
        wishlists: [],
        fGames: [],
        retweets: [],
        taskIds: [],
        tasks: []
      },
      taskInfo: {
        groups: [],
        curators: [],
        wishlists: [],
        fGames: [],
        retweets: []
      },
      setting: {},
      conf: (config === null || config === void 0 ? void 0 : (_config$banana = config.banana) === null || _config$banana === void 0 ? void 0 : _config$banana.enable.valueOf()) ? config.banana : globalConf
    }

    var freegamelottery = {
      test: function test () {
        try {
          return window.location.host.includes('freegamelottery')
        } catch (e) {
          throwError(e, 'freegamelottery.test')
        }
      },
      after: function after () {
        try {
          if (window.location.host === 'd.freegamelottery.com' && GM_getValue('lottery') === 1) this.draw()
        } catch (e) {
          throwError(e, 'freegamelottery.after')
        }
      },
      fuck: function fuck () {
        try {
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
        } catch (e) {
          throwError(e, 'freegamelottery.fuck')
        }
      },
      draw: function draw () {
        try {
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
        } catch (e) {
          throwError(e, 'freegamelottery.draw')
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
      conf: (config === null || config === void 0 ? void 0 : (_config$freegamelotte = config.freegamelottery) === null || _config$freegamelotte === void 0 ? void 0 : _config$freegamelotte.enable.valueOf()) ? config.freegamelottery : globalConf
    }
    var gamehag = {
      test: function test () {
        try {
          return window.location.host.includes('gamehag')
        } catch (e) {
          throwError(e, 'gamehag.test')
        }
      },
      before: function before () {
        try {
          $('#getkey').removeAttr('disabled')
          if (globalConf.other.reCaptcha) $('body').append('<script>window.bannedCountries=["a"];window.geo="a";window.respCaptch="";window.isSolveMediaCaptcha=false;window.moneytizergeo="a";</script>')
        } catch (e) {
          throwError(e, 'gamehag.before')
        }
      },
      fuck: function fuck () {
        try {
          this.get_tasks('do_task')
        } catch (e) {
          throwError(e, 'gamehag.fuck')
        }
      },
      get_tasks: function get_tasks () {
        var _this7 = this

        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'do_task'

        try {
          var _ref47 = [fuc.echoLog({
            type: 'custom',
            text: '<li>'.concat(getI18n('getTasksInfo'), '<font></font></li>')
          }), $('button[data-id]')]
          var status = _ref47[0]
          var verifyBtns = _ref47[1]
          var taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
          if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory

          if (callback === 'remove' && taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
            status.success()
            this.remove(true)
          } else if (callback === 'do_task') {
            this.currentTaskInfo = fuc.clearTaskInfo(this.currentTaskInfo)
            var _pro8 = []

            var _iterator12 = _createForOfIteratorHelper(verifyBtns)
            var _step12

            try {
              var _loop12 = function _loop12 () {
                var btn = _step12.value
                var _ref49 = [$(btn).attr('data-id'), $(btn).parent().prev().text(), $(btn).parent().parent().prev().find('use').attr('xlink:href') || '', $(btn).parent().find('a:contains("to do")').attr('href')]
                var taskId = _ref49[0]
                var taskDes = _ref49[1]
                var taskIcon = _ref49[2]
                var taskUrl = _ref49[3]

                if ($(btn).parents('.task-content').next().text().includes('+1')) {
                  var isSteamGroup = taskIcon.includes('steam') && /join.*?steam.*?group/gim.test(taskDes)
                  var isTwitterUser = taskIcon.includes('twitter') && /follow/gim.test(taskDes)
                  var isRetweet = taskIcon.includes('twitter') && /retweet/gim.test(taskDes)

                  if (isSteamGroup || isTwitterUser || isRetweet) {
                    _pro8.push(new Promise(function (resolve) {
                      new Promise(function (resolve) {
                        fuc.getFinalUrl(resolve, taskUrl)
                      }).then(function (_ref50) {
                        var result = _ref50.result
                        var finalUrl = _ref50.finalUrl

                        if (result === 'success') {
                          var _finalUrl$match5, _finalUrl$match6, _finalUrl$match7

                          var groupName = finalUrl === null || finalUrl === void 0 ? void 0 : (_finalUrl$match5 = finalUrl.match(/groups\/(.+)\/?/)) === null || _finalUrl$match5 === void 0 ? void 0 : _finalUrl$match5[1]
                          var userName = finalUrl === null || finalUrl === void 0 ? void 0 : (_finalUrl$match6 = finalUrl.match(/https:\/\/twitter.com\/(.+)/)) === null || _finalUrl$match6 === void 0 ? void 0 : _finalUrl$match6[1]
                          var tweetId = finalUrl === null || finalUrl === void 0 ? void 0 : (_finalUrl$match7 = finalUrl.match(/https:\/\/twitter.com\/.*?\/status\/([\d]+)/)) === null || _finalUrl$match7 === void 0 ? void 0 : _finalUrl$match7[1]

                          if (isSteamGroup && groupName) {
                            _this7.currentTaskInfo.groups.push(groupName)

                            _this7.taskInfo.groups.push(groupName)
                          } else if (isTwitterUser && userName) {
                            _this7.currentTaskInfo.twitterUsers.push(userName)

                            _this7.taskInfo.twitterUsers.push(userName)
                          } else if (isRetweet && tweetId) {
                            _this7.currentTaskInfo.retweets.push(tweetId)

                            _this7.taskInfo.retweets.push(tweetId)
                          }
                        }
                      }).catch(function (error) {
                        if (debug) console.error(error)
                      }).finally(function () {
                        resolve(1)
                      })
                    }))
                  }

                  _this7.currentTaskInfo.tasks.push({
                    taskId: taskId,
                    taskDes: taskDes
                  })
                }
              }

              for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
                _loop12()
              }
            } catch (err) {
              _iterator12.e(err)
            } finally {
              _iterator12.f()
            }

            if ($('a.giveaway-survey').length > 0) {
              var _ref48 = [$('a.giveaway-survey').attr('data-task_id'), 'Complete the survey']
              var taskId = _ref48[0]
              var taskDes = _ref48[1]
              this.currentTaskInfo.tasks.push({
                taskId: taskId,
                taskDes: taskDes
              })
            }

            Promise.all(_pro8).finally(function () {
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

            var _iterator13 = _createForOfIteratorHelper(verifyBtns)
            var _step13

            try {
              for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
                var btn = _step13.value
                var _ref51 = [$(btn).attr('data-id'), $(btn).parent().prev().text()]
                var _taskId = _ref51[0]
                var _taskDes = _ref51[1]
                if ($(btn).parents('.task-content').next().text().includes('+1')) {
                  this.currentTaskInfo.tasks.push({
                    taskId: _taskId,
                    taskDes: _taskDes
                  })
                }
              }
            } catch (err) {
              _iterator13.e(err)
            } finally {
              _iterator13.f()
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
          } else {
            status.success()

            if (['remove', 'do_task', 'verify'].includes(callback)) {
              fuc.echoLog({
                type: 'custom',
                text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
              })
            } else {
              fuc.echoLog({
                type: 'custom',
                text: '<li><font class="error">'.concat(getI18n('unknown'), '\uFF01</font></li>')
              })
            }
          }

          if (debug) console.log(this)
        } catch (e) {
          throwError(e, 'gamehag.get_tasks')
        }
      },
      do_task: function do_task () {
        var _this8 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee21 () {
          var _ref52, _pro9, tasks, _loop13, i

          return regeneratorRuntime.wrap(function _callee21$ (_context28) {
            while (1) {
              switch (_context28.prev = _context28.next) {
                case 0:
                  _context28.prev = 0
                  _ref52 = [[], fuc.unique(_this8.currentTaskInfo.tasks)], _pro9 = _ref52[0], tasks = _ref52[1]
                  _loop13 = /* #__PURE__ */regeneratorRuntime.mark(function _loop13 (i) {
                    var task
                    return regeneratorRuntime.wrap(function _loop13$ (_context27) {
                      while (1) {
                        switch (_context27.prev = _context27.next) {
                          case 0:
                            task = tasks[i]

                            _pro9.push(new Promise(function (resolve) {
                              fuc.visitLink(resolve, '/giveaway/click/' + task.taskId, {
                                headers: {
                                  'x-csrf-token': $('meta[name="csrf-token"]').attr('content')
                                }
                              })
                            }))

                            if (/play.*?games/gim.test(task.taskDes)) {
                              _pro9.push(new Promise(function (resolve) {
                                fuc.visitLink(resolve, '/games', {
                                  headers: {
                                    'x-csrf-token': $('meta[name="csrf-token"]').attr('content')
                                  }
                                })
                              }))

                              _pro9.push(new Promise(function (resolve) {
                                fuc.visitLink(resolve, '/games/war-thunder/play', {
                                  headers: {
                                    'x-csrf-token': $('meta[name="csrf-token"]').attr('content')
                                  }
                                })
                              }))
                            }

                            _context27.next = 5
                            return fuc.delay(1000)

                          case 5:
                          case 'end':
                            return _context27.stop()
                        }
                      }
                    }, _loop13)
                  })
                  i = 0

                case 4:
                  if (!(i < tasks.length)) {
                    _context28.next = 9
                    break
                  }

                  return _context28.delegateYield(_loop13(i), 't0', 6)

                case 6:
                  i++
                  _context28.next = 4
                  break

                case 9:
                  Promise.all(_pro9).finally(/* #__PURE__ */_asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee20 () {
                    var pro
                    return regeneratorRuntime.wrap(function _callee20$ (_context26) {
                      while (1) {
                        switch (_context26.prev = _context26.next) {
                          case 0:
                            _context26.next = 2
                            return _this8.toggleActions('fuck')

                          case 2:
                            pro = _context26.sent
                            Promise.all(pro).finally(function () {
                              fuc.echoLog({
                                type: 'custom',
                                text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                              })
                              if (_this8.conf.fuck.verifyTask) _this8.verify()
                            })

                          case 4:
                          case 'end':
                            return _context26.stop()
                        }
                      }
                    }, _callee20)
                  })))
                  _context28.next = 15
                  break

                case 12:
                  _context28.prev = 12
                  _context28.t1 = _context28.catch(0)
                  throwError(_context28.t1, 'gamehag.do_task')

                case 15:
                case 'end':
                  return _context28.stop()
              }
            }
          }, _callee21, null, [[0, 12]])
        }))()
      },
      verify: function verify () {
        var _arguments2 = arguments
        var _this9 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee22 () {
          var verify, _ref54, _pro10, tasks, _loop14, i

          return regeneratorRuntime.wrap(function _callee22$ (_context30) {
            while (1) {
              switch (_context30.prev = _context30.next) {
                case 0:
                  verify = _arguments2.length > 0 && _arguments2[0] !== undefined ? _arguments2[0] : false
                  _context30.prev = 1

                  if (!verify) {
                    _context30.next = 14
                    break
                  }

                  _ref54 = [[], fuc.unique(_this9.currentTaskInfo.tasks)], _pro10 = _ref54[0], tasks = _ref54[1]
                  _loop14 = /* #__PURE__ */regeneratorRuntime.mark(function _loop14 (i) {
                    var task, status
                    return regeneratorRuntime.wrap(function _loop14$ (_context29) {
                      while (1) {
                        switch (_context29.prev = _context29.next) {
                          case 0:
                            task = tasks[i]
                            status = fuc.echoLog({
                              type: 'custom',
                              text: '<li>'.concat(getI18n('verifyingTask'), '<a href="/giveaway/click/').concat(task.taskId, '" target="_blank">').concat(task.taskDes.trim(), '</a>...<font></font></li>')
                            })

                            _pro10.push(new Promise(function (resolve) {
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

                            _context29.next = 5
                            return new Promise(function (resolve) {
                              setTimeout(function () {
                                resolve()
                              }, 1000)
                            })

                          case 5:
                          case 'end':
                            return _context29.stop()
                        }
                      }
                    }, _loop14)
                  })
                  i = 0

                case 6:
                  if (!(i < tasks.length)) {
                    _context30.next = 11
                    break
                  }

                  return _context30.delegateYield(_loop14(i), 't0', 8)

                case 8:
                  i++
                  _context30.next = 6
                  break

                case 11:
                  Promise.all(_pro10).finally(function () {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="success">'.concat(getI18n('verifyTasksComplete'), '</font></li>')
                    })
                  })
                  _context30.next = 15
                  break

                case 14:
                  _this9.get_tasks('verify')

                case 15:
                  _context30.next = 20
                  break

                case 17:
                  _context30.prev = 17
                  _context30.t1 = _context30.catch(1)
                  throwError(_context30.t1, 'gamehag.verify')

                case 20:
                case 'end':
                  return _context30.stop()
              }
            }
          }, _callee22, null, [[1, 17]])
        }))()
      },
      remove: function remove () {
        var _arguments3 = arguments
        var _this10 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee23 () {
          var remove, _pro11

          return regeneratorRuntime.wrap(function _callee23$ (_context31) {
            while (1) {
              switch (_context31.prev = _context31.next) {
                case 0:
                  remove = _arguments3.length > 0 && _arguments3[0] !== undefined ? _arguments3[0] : false
                  _context31.prev = 1

                  if (!remove) {
                    _context31.next = 9
                    break
                  }

                  _context31.next = 5
                  return _this10.toggleActions('remove')

                case 5:
                  _pro11 = _context31.sent
                  Promise.all(_pro11).finally(function () {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                    })
                  })
                  _context31.next = 10
                  break

                case 9:
                  _this10.get_tasks('remove')

                case 10:
                  _context31.next = 15
                  break

                case 12:
                  _context31.prev = 12
                  _context31.t0 = _context31.catch(1)
                  throwError(_context31.t0, 'gamehag.remove')

                case 15:
                case 'end':
                  return _context31.stop()
              }
            }
          }, _callee23, null, [[1, 12]])
        }))()
      },
      toggleActions: function toggleActions (action) {
        var _this11 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee24 () {
          var _pro12, fuck, taskInfo, groups, curators, twitterUsers, retweets

          return regeneratorRuntime.wrap(function _callee24$ (_context32) {
            while (1) {
              switch (_context32.prev = _context32.next) {
                case 0:
                  _context32.prev = 0
                  _pro12 = []
                  fuck = action === 'fuck'
                  taskInfo = fuck ? _this11.currentTaskInfo : _this11.taskInfo
                  _context32.next = 6
                  return fuc.updateInfo(taskInfo)

                case 6:
                  groups = taskInfo.groups, curators = taskInfo.curators, twitterUsers = taskInfo.twitterUsers, retweets = taskInfo.retweets

                  if (_this11.conf[action][fuck ? 'joinSteamGroup' : 'leaveSteamGroup'] && groups.length > 0) {
                    _pro12.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        website: 'gamehag',
                        type: 'group',
                        elements: groups,
                        resolve: resolve,
                        action: action
                      })
                    }))
                  }

                  if (_this11.conf[action][fuck ? 'followCurator' : 'unfollowCurator'] && curators.length > 0) {
                    _pro12.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        website: 'gamehag',
                        type: 'curator',
                        elements: curators,
                        resolve: resolve,
                        action: action
                      })
                    }))
                  }

                  if (_this11.conf[action][fuck ? 'followTwitterUser' : 'unfollowTwitterUser'] && twitterUsers.length > 0) {
                    _pro12.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        website: 'gamehag',
                        social: 'twitter',
                        type: 'follow',
                        elements: twitterUsers,
                        resolve: resolve,
                        action: action
                      })
                    }))
                  }

                  if (_this11.conf[action][fuck ? 'retweet' : 'unretweet'] && retweets.length > 0) {
                    _pro12.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        website: 'gamehag',
                        social: 'twitter',
                        type: 'retweet',
                        elements: retweets,
                        resolve: resolve,
                        action: action
                      })
                    }))
                  }

                  return _context32.abrupt('return', _pro12)

                case 14:
                  _context32.prev = 14
                  _context32.t0 = _context32.catch(0)
                  throwError(_context32.t0, 'gamehag.toggleActions')

                case 17:
                case 'end':
                  return _context32.stop()
              }
            }
          }, _callee24, null, [[0, 14]])
        }))()
      },
      get_giveawayId: function get_giveawayId () {
        try {
          var _window$location$href2

          return ((_window$location$href2 = window.location.href.match(/\/giveaway\/([\d]+)/)) === null || _window$location$href2 === void 0 ? void 0 : _window$location$href2[1]) || window.location.href
        } catch (e) {
          throwError(e, 'gamehag.get_giveawayId')
        }
      },
      checkLeft: function checkLeft () {
        try {
          if ($('.giveaway-counter:first .strong').text() === '0') {
            Swal.fire({
              icon: 'warning',
              title: getI18n('notice'),
              text: getI18n('noKeysLeft'),
              confirmButtonText: getI18n('confirm'),
              cancelButtonText: getI18n('cancel'),
              showCancelButton: true
            }).then(function (_ref55) {
              var value = _ref55.value

              if (value) {
                window.close()
              }
            })
          }
        } catch (e) {
          throwError(e, 'gamehag.checkLeft')
        }
      },
      currentTaskInfo: {
        groups: [],
        curators: [],
        twitterUsers: [],
        retweets: [],
        tasks: []
      },
      taskInfo: {
        groups: [],
        curators: [],
        twitterUsers: [],
        retweets: []
      },
      setting: {},
      conf: (config === null || config === void 0 ? void 0 : (_config$gamehag = config.gamehag) === null || _config$gamehag === void 0 ? void 0 : _config$gamehag.enable.valueOf()) ? config.gamehag : globalConf
    }
    var giveawaysu = {
      test: function test () {
        try {
          return window.location.host.includes('giveaway.su')
        } catch (e) {
          throwError(e, 'giveawaysu.test')
        }
      },
      after: function after () {
        try {
          GM_addStyle('#getKey{display:none!important;}')
          fuc.echoLog({
            type: 'custom',
            text: '<li style="color:blue !important;">'.concat(getI18n('gsNotice'), '<font></font></li>')
          })
        } catch (e) {
          throwError(e, 'giveawaysu.after')
        }
      },
      get_tasks: function get_tasks (e) {
        try {
          var taskInfo = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')

          if (taskInfo && !fuc.isEmptyObjArr(taskInfo) && e === 'remove') {
            this.taskInfo = taskInfo
            this.do_task('remove')
          } else {
            if (taskInfo && !fuc.isEmptyObjArr(taskInfo)) this.taskInfo = taskInfo
            var _ref56 = [fuc.echoLog({
              type: 'custom',
              text: '<li>'.concat(getI18n('getTasksInfo'), '<font></font></li>')
            }), $('#actions tr')]
            var status = _ref56[0]
            var tasks = _ref56[1]
            if ($('div.bind-discord').is(':visible')) $('div.bind-discord a')[0].click()
            if ($('div.bind-twitch').is(':visible')) $('div.bind-twitch a')[0].click()

            var _iterator14 = _createForOfIteratorHelper(tasks)
            var _step14

            try {
              for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
                var task = _step14.value
                var td = $(task).find('td:not(".hidden")')
                var colorfulTask = td.eq(1).find('a:not([data-trigger="link"])')
                var colorlessTask = td.eq(2).find('a:not([data-trigger="link"])')
                var taskDes = colorfulTask.length > 0 ? colorfulTask : colorlessTask
                var taskIcon = td.eq(0).find('i').attr('class')

                var _taskInfo = this.which_task(taskDes, taskIcon)

                var _iterator15 = _createForOfIteratorHelper(_taskInfo)
                var _step15

                try {
                  for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
                    var info = _step15.value

                    if (info.name !== 'nonSteam' && this.taskInfo[info.name + 's']) {
                      this.taskInfo[info.name + 's'].push(info.link)
                      this.taskInfo.links.push(info.link)
                    }
                  }
                } catch (err) {
                  _iterator15.e(err)
                } finally {
                  _iterator15.f()
                }
              }
            } catch (err) {
              _iterator14.e(err)
            } finally {
              _iterator14.f()
            }

            status.success()
            this.getFinalUrl(e)
          }
        } catch (e) {
          throwError(e, 'giveawaysu.get_tasks')
        }
      },
      which_task: function which_task (taskDes) {
        var taskIcon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ''

        try {
          var _ref57 = [[], taskDes.text().trim(), taskDes.attr('href')]
          var taskInfo = _ref57[0]
          var taskName = _ref57[1]
          var link = _ref57[2]

          if (taskIcon.includes('ban') || /disable adblock/gim.test(taskName)) {
            return [{
              name: 'nonSteam'
            }]
          } else if (/join.*steam.*group/gim.test(taskName)) {
            taskInfo.push({
              name: 'group',
              link: link
            })
          } else if (/like.*announcement/gim.test(taskName)) {
            taskInfo.push({
              name: 'announcement',
              link: link
            })
          } else if (/(follow|subscribe).*publisher/gim.test(taskName)) {
            taskInfo.push({
              name: 'publisher',
              link: link
            })
          } else if (/(follow|subscribe).*franchise/gim.test(taskName)) {
            taskInfo.push({
              name: 'franchise',
              link: link
            })
          } else if (/(follow|subscribe).*developer/gim.test(taskName)) {
            taskInfo.push({
              name: 'developer',
              link: link
            })
          } else if (/(follow|subscribe).*curator/gim.test(taskName)) {
            taskInfo.push({
              name: 'curator',
              link: link
            })
          } else if (/subscribe.*steam.*forum/gim.test(taskName)) {
            taskInfo.push({
              name: 'forum',
              link: link
            })
          } else if (taskIcon.includes('discord') || /join.*discord/gim.test(taskName)) {
            taskInfo.push({
              name: 'discord',
              link: link
            })
          } else if (taskIcon.includes('instagram') || /follow.*instagram/gim.test(taskName)) {
            taskInfo.push({
              name: 'instagram',
              link: link
            })
          } else if (taskIcon.includes('twitch') || /follow.*twitch.*channel/gim.test(taskName)) {
            taskInfo.push({
              name: 'twitch',
              link: link
            })
          } else if (taskIcon.includes('reddit') || /subscribe.*subreddit/gim.test(taskName) || /follow.*reddit/gim.test(taskName)) {
            taskInfo.push({
              name: 'reddit',
              link: link
            })
          } else if (taskIcon.includes('vk') || /join.*vk.*group/gim.test(taskName)) {
            taskInfo.push({
              name: 'vk',
              link: link
            })
          } else {
            if (/(Like.*YouTube)|(on twitter)|(Follow.*on.*Facebook)/gim.test(taskName)) { // this.taskInfo.links.push(link)
            } else {
              if (/wishlist.*game|add.*wishlist/gim.test(taskName)) {
                taskInfo.push({
                  name: 'wGame',
                  link: link
                })
              }

              if (/follow.*button/gim.test(taskName)) {
                taskInfo.push({
                  name: 'fGame',
                  link: link
                })
              }
            }

            if (taskInfo.length === 0) {
              return [{
                name: 'nonSteam'
              }]
            }
          }

          return taskInfo
        } catch (e) {
          throwError(e, 'giveawaysu.which_task')
        }
      },
      getFinalUrl: function getFinalUrl (e) {
        var _this12 = this

        try {
          var _ref58 = [fuc.echoLog({
            type: 'custom',
            text: '<li>'.concat(getI18n('processTasksUrl'), '<font></font></li>')
          }), []]
          var status = _ref58[0]
          var _pro13 = _ref58[1]

          var _iterator16 = _createForOfIteratorHelper(this.taskInfo.links)
          var _step16

          try {
            var _loop15 = function _loop15 () {
              var link = _step16.value

              _pro13.push(new Promise(function (resolve) {
                if (_this12.taskInfo.toFinalUrl[link]) {
                  resolve({
                    result: 'success'
                  })
                } else {
                  fuc.getFinalUrl(resolve, link, {
                    onload: function onload (response) {
                      if (response.finalUrl.includes('newshub/app')) {
                        var _response$responseTex12

                        var div = (_response$responseTex12 = response.responseText.match(/<div id="application_config"[\w\W]*?>/)) === null || _response$responseTex12 === void 0 ? void 0 : _response$responseTex12[0]

                        if (!div) {
                          resolve({
                            result: 'success',
                            finalUrl: response.finalUrl,
                            url: link
                          })
                          return
                        }

                        var appConfig = $(div)

                        var _JSON$parse2 = JSON.parse(appConfig.attr('data-userinfo'))
                        var authwgtoken = _JSON$parse2.authwgtoken

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

            for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
              _loop15()
            }
          } catch (err) {
            _iterator16.e(err)
          } finally {
            _iterator16.f()
          }

          Promise.all(_pro13).then(function (data) {
            var _iterator17 = _createForOfIteratorHelper(data)
            var _step17

            try {
              for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
                var r = _step17.value

                if (r.finalUrl) {
                  _this12.taskInfo.toFinalUrl[r.url] = r.finalUrl
                }
              }
            } catch (err) {
              _iterator17.e(err)
            } finally {
              _iterator17.f()
            }

            _this12.links = fuc.unique(_this12.links)
            _this12.taskInfo = fuc.uniqueTaskInfo(_this12.taskInfo)

            GM_setValue('taskInfo[' + window.location.host + _this12.get_giveawayId() + ']', _this12.taskInfo)
            status.success()
            if (debug) console.log(_this12)
            e === 'doTask' ? _this12.do_task('fuck') : _this12.do_task('remove')
          }).catch(function (error) {
            status.error()
            if (debug) console.log(error)
          })
        } catch (e) {
          throwError(e, 'giveawaysu.getFinalUrl')
        }
      },
      do_task: function do_task (action) {
        var _this13 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee25 () {
          var _this13$taskInfo, groups, forums, curators, publishers, developers, franchises, fGames, wGames, announcements, discords, instagrams, twitchs, reddits, youtubes, vks, _toFinalUrl, _toGuild, _pro14, fuck

          return regeneratorRuntime.wrap(function _callee25$ (_context33) {
            while (1) {
              switch (_context33.prev = _context33.next) {
                case 0:
                  _context33.prev = 0
                  _this13$taskInfo = _this13.taskInfo, groups = _this13$taskInfo.groups, forums = _this13$taskInfo.forums, curators = _this13$taskInfo.curators, publishers = _this13$taskInfo.publishers, developers = _this13$taskInfo.developers, franchises = _this13$taskInfo.franchises, fGames = _this13$taskInfo.fGames, wGames = _this13$taskInfo.wGames, announcements = _this13$taskInfo.announcements, discords = _this13$taskInfo.discords, instagrams = _this13$taskInfo.instagrams, twitchs = _this13$taskInfo.twitchs, reddits = _this13$taskInfo.reddits, youtubes = _this13$taskInfo.youtubes, vks = _this13$taskInfo.vks, _toFinalUrl = _this13$taskInfo.toFinalUrl, _toGuild = _this13$taskInfo.toGuild
                  _pro14 = []
                  fuck = action === 'fuck'
                  _context33.next = 6
                  return fuc.updateInfo(_this13.taskInfo)

                case 6:
                  if (_this13.conf[action][fuck ? 'joinSteamGroup' : 'leaveSteamGroup'] && groups.length > 0) {
                    _pro14.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        website: 'giveawaysu',
                        type: 'group',
                        elements: groups,
                        resolve: resolve,
                        action: action,
                        toFinalUrl: _toFinalUrl
                      })
                    }))
                  }

                  if (_this13.conf[action][fuck ? 'subscribeSteamForum' : 'unsubscribeSteamForum'] && forums.length > 0) {
                    _pro14.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        website: 'giveawaysu',
                        type: 'forum',
                        elements: forums,
                        resolve: resolve,
                        action: action,
                        toFinalUrl: _toFinalUrl
                      })
                    }))
                  }

                  if (_this13.conf[action][fuck ? 'followCurator' : 'unfollowCurator'] && curators.length > 0) {
                    _pro14.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        website: 'giveawaysu',
                        type: 'curator',
                        elements: curators,
                        resolve: resolve,
                        action: action,
                        toFinalUrl: _toFinalUrl
                      })
                    }))
                  }

                  if (_this13.conf[action][fuck ? 'followPublisher' : 'unfollowPublisher'] && publishers.length > 0) {
                    _pro14.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        website: 'giveawaysu',
                        type: 'publisher',
                        elements: publishers,
                        resolve: resolve,
                        action: action,
                        toFinalUrl: _toFinalUrl
                      })
                    }))
                  }

                  if (_this13.conf[action][fuck ? 'followDeveloper' : 'unfollowDeveloper'] && developers.length > 0) {
                    _pro14.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        website: 'giveawaysu',
                        type: 'developer',
                        elements: developers,
                        resolve: resolve,
                        action: action,
                        toFinalUrl: _toFinalUrl
                      })
                    }))
                  }

                  if (_this13.conf[action][fuck ? 'followFranchise' : 'unfollowFranchise'] && franchises.length > 0) {
                    _pro14.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        website: 'giveawaysu',
                        type: 'franchise',
                        elements: franchises,
                        resolve: resolve,
                        action: action,
                        toFinalUrl: _toFinalUrl
                      })
                    }))
                  }

                  if (_this13.conf[action][fuck ? 'followGame' : 'unfollowGame'] && fGames.length > 0) {
                    _pro14.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        website: 'giveawaysu',
                        type: 'game',
                        elements: fGames,
                        resolve: resolve,
                        action: action,
                        toFinalUrl: _toFinalUrl
                      })
                    }))
                  }

                  if (_this13.conf[action][fuck ? 'addToWishlist' : 'removeFromWishlist'] && wGames.length > 0) {
                    _pro14.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        website: 'giveawaysu',
                        type: 'wishlist',
                        elements: wGames,
                        resolve: resolve,
                        action: action,
                        toFinalUrl: _toFinalUrl
                      })
                    }))
                  }

                  if (fuck && _this13.conf.fuck.likeAnnouncement && announcements.length > 0) {
                    _pro14.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        website: 'giveawaysu',
                        type: 'announcement',
                        elements: announcements,
                        resolve: resolve,
                        action: action,
                        toFinalUrl: _toFinalUrl
                      })
                    }))
                  }

                  if (_this13.conf[action][fuck ? 'joinDiscordServer' : 'leaveDiscordServer'] && discords.length > 0) {
                    _pro14.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        social: 'discord',
                        website: 'giveawaysu',
                        elements: discords,
                        resolve: resolve,
                        action: action,
                        toFinalUrl: _toFinalUrl,
                        toGuild: _toGuild
                      })
                    }).then(function (data) {
                      if (fuck) {
                        var _iterator18 = _createForOfIteratorHelper(data)
                        var _step18

                        try {
                          for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
                            var e = _step18.value

                            var _ref59 = e.guild || []
                            var _ref60 = _slicedToArray(_ref59, 2)
                            var inviteId = _ref60[0]
                            var guild = _ref60[1]

                            if (inviteId && guild) _toGuild[inviteId] = guild
                          }
                        } catch (err) {
                          _iterator18.e(err)
                        } finally {
                          _iterator18.f()
                        }

                        GM_setValue('taskInfo[' + window.location.host + _this13.get_giveawayId() + ']', _this13.taskInfo)
                      }
                    }))
                  }

                  if (_this13.conf[action][fuck ? 'followIns' : 'unfollowIns'] && instagrams.length > 0) {
                    _pro14.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        social: 'ins',
                        website: 'giveawaysu',
                        elements: instagrams,
                        resolve: resolve,
                        action: action,
                        toFinalUrl: _toFinalUrl
                      })
                    }))
                  }

                  if (_this13.conf[action][fuck ? 'followTwitchChannel' : 'unfollowTwitchChannel'] && twitchs.length > 0) {
                    _pro14.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        social: 'twitch',
                        website: 'giveawaysu',
                        elements: twitchs,
                        resolve: resolve,
                        action: action,
                        toFinalUrl: _toFinalUrl
                      })
                    }))
                  }

                  if (_this13.conf[action][fuck ? 'joinReddit' : 'leaveReddit'] && reddits.length > 0) {
                    _pro14.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        social: 'reddit',
                        website: 'giveawaysu',
                        elements: reddits,
                        resolve: resolve,
                        action: action,
                        toFinalUrl: _toFinalUrl
                      })
                    }))
                  }

                  if (_this13.conf[action][fuck ? 'followYoutubeChannel' : 'unfollowYoutubeChannel'] && youtubes.length > 0) {
                    _pro14.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        social: 'youtube',
                        website: 'giveawaysu',
                        elements: youtubes,
                        resolve: resolve,
                        action: action,
                        toFinalUrl: _toFinalUrl
                      })
                    }))
                  }

                  if (_this13.conf[action][fuck ? 'joinVk' : 'leaveVk'] && vks.length > 0) {
                    _pro14.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        social: 'vk',
                        website: 'giveawaysu',
                        elements: vks,
                        resolve: resolve,
                        action: action,
                        toFinalUrl: _toFinalUrl
                      })
                    }))
                  }

                  Promise.all(_pro14).finally(function () {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                    })
                    if (fuck) {
                      fuc.echoLog({
                        type: 'custom',
                        text: '<li><font class="warning">'.concat(getI18n('closeExtensions'), '</font></li>')
                      })
                    }
                  })
                  _context33.next = 27
                  break

                case 24:
                  _context33.prev = 24
                  _context33.t0 = _context33.catch(0)
                  throwError(_context33.t0, 'giveawaysu.do_task')

                case 27:
                case 'end':
                  return _context33.stop()
              }
            }
          }, _callee25, null, [[0, 24]])
        }))()
      },
      fuck: function fuck () {
        try {
          this.get_tasks('doTask')
        } catch (e) {
          throwError(e, 'giveawaysu.fuck')
        }
      },
      verify: function verify () {},
      remove: function remove () {
        try {
          this.get_tasks('remove')
        } catch (e) {
          throwError(e, 'giveawaysu.remove')
        }
      },
      get_giveawayId: function get_giveawayId () {
        try {
          var _window$location$href3

          return ((_window$location$href3 = window.location.href.match(/view\/([\d]+)/)) === null || _window$location$href3 === void 0 ? void 0 : _window$location$href3[1]) || window.location.href
        } catch (e) {
          throwError(e, 'giveawaysu.get_giveawayId')
        }
      },
      checkLogin: function checkLogin () {
        try {
          if ($('a.steam-login').length > 0) window.open('/steam/redirect', '_self')
        } catch (e) {
          throwError(e, 'giveawaysu.checkLogin')
        }
      },
      checkLeft: function checkLeft () {
        try {
          if ($('.giveaway-ended').length > 0) {
            Swal.fire({
              icon: 'warning',
              title: getI18n('notice'),
              text: getI18n('noKeysLeft'),
              confirmButtonText: getI18n('confirm'),
              cancelButtonText: getI18n('cancel'),
              showCancelButton: true
            }).then(function (_ref61) {
              var value = _ref61.value

              if (value) {
                window.close()
              }
            })
          }
        } catch (e) {
          throwError(e, 'giveawaysu.checkLeft')
        }
      },
      taskInfo: {
        groups: [],
        forums: [],
        curators: [],
        publishers: [],
        developers: [],
        franchises: [],
        fGames: [],
        wGames: [],
        announcements: [],
        discords: [],
        instagrams: [],
        twitchs: [],
        reddits: [],
        youtubes: [],
        vks: [],
        links: [],
        toFinalUrl: {},
        toGuild: {}
      },
      setting: {
        verify: {
          show: false
        }
      },
      conf: (config === null || config === void 0 ? void 0 : (_config$giveawaysu = config.giveawaysu) === null || _config$giveawaysu === void 0 ? void 0 : _config$giveawaysu.enable.valueOf()) ? config.giveawaysu : globalConf
    }
    var gleam = {
      test: function test () {
        try {
          return window.location.host.includes('gleam.io')
        } catch (e) {
          throwError(e, 'gleam.test')
        }
      },
      fuck: function fuck () {
        try {
          this.get_tasks('do_task')
        } catch (e) {
          throwError(e, 'gleam.fuck')
        }
      },
      get_tasks: function get_tasks () {
        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'do_task'

        try {
          var taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
          if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory

          if (callback === 'remove' && taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
            this.remove(true)
          } else {
            this.currentTaskInfo = fuc.clearTaskInfo(this.currentTaskInfo)
            var _ref62 = [fuc.echoLog({
              type: 'custom',
              text: '<li>'.concat(getI18n('getTasksInfo'), '<font></font></li>')
            }), $('div.entry-content .entry-method')]
            var status = _ref62[0]
            var tasksContainer = _ref62[1]

            var _iterator19 = _createForOfIteratorHelper(tasksContainer)
            var _step19

            try {
              for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
                var task = _step19.value

                if ($(task).find('i.fa-question').length > 0) {
                  if ($(task).hasClass('visit') || $(task).find('span:contains(Visit):contains(seconds)').length > 0) {
                    this.currentTaskInfo.links.push(task)
                  } else {
                    var icon = $(task).find('.icon-wrapper i')

                    if (icon.hasClass('fa-twitter')) {
                      var twitterTaskInfo = $(task).find('.user-links')

                      if (/follow/gim.test(twitterTaskInfo.text())) {
                        var _twitterTaskInfo$find, _twitterTaskInfo$find2

                        var name = (_twitterTaskInfo$find = twitterTaskInfo.find('a[href^="https://twitter.com/"]').attr('href')) === null || _twitterTaskInfo$find === void 0 ? void 0 : (_twitterTaskInfo$find2 = _twitterTaskInfo$find.match(/https:\/\/twitter.com\/(.+)/)) === null || _twitterTaskInfo$find2 === void 0 ? void 0 : _twitterTaskInfo$find2[1]

                        if (name) {
                          this.currentTaskInfo.twitterUsers.push(name)
                          this.taskInfo.twitterUsers.push(name)
                        }
                      } else if (/retweet/gim.test(twitterTaskInfo.text())) {
                        var _twitterTaskInfo$find3, _twitterTaskInfo$find4

                        var id = (_twitterTaskInfo$find3 = twitterTaskInfo.find('a[href^="https://twitter.com/"]').attr('href')) === null || _twitterTaskInfo$find3 === void 0 ? void 0 : (_twitterTaskInfo$find4 = _twitterTaskInfo$find3.match(/https:\/\/twitter.com\/.*?\/status\/([\d]+)/)) === null || _twitterTaskInfo$find4 === void 0 ? void 0 : _twitterTaskInfo$find4[1]

                        if (id) {
                          this.currentTaskInfo.retweets.push(id)
                          this.taskInfo.retweets.push(id)
                        }
                      }
                    } else if (icon.hasClass('fa-facebook')) {
                      this.currentTaskInfo.facebooks.push(task)
                    } else if (icon.hasClass('fa-youtube')) {
                      this.currentTaskInfo.youtubes.push(task)
                    } else if (icon.hasClass('fa-discord')) {
                      this.currentTaskInfo.discords.push(task)
                    } else if (icon.hasClass('fa-steam') || icon.hasClass('fa-steam-symbol')) {
                      var title = $(task).find('.entry-method-title')

                      if (/join.*group/gim.test(title.text())) {
                        var groupA = $(task).find("a[href*='steamcommunity.com/groups']:first").attr('href')

                        if (groupA) {
                          var groupName = groupA.match(/steamcommunity.com\/groups\/([\w\d\-_]*)/)[1]
                          this.currentTaskInfo.groups.push(groupName)
                          this.taskInfo.groups.push(groupName)
                        } else {
                          fuc.echoLog({
                            type: 'custom',
                            text: '<li><font class="error">'.concat(getI18n('getGroupFailed'), '</font></li>')
                          })
                        }
                      } else {
                        this.currentTaskInfo.others.push(task)
                      }
                    } else {
                      this.currentTaskInfo.others.push(task)
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
              _iterator19.e(err)
            } finally {
              _iterator19.f()
            }

            this.currentTaskInfo = fuc.uniqueTaskInfo(this.currentTaskInfo)
            this.taskInfo = fuc.uniqueTaskInfo(this.taskInfo)
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
        } catch (e) {
          throwError(e, 'gleam.get_tasks')
        }
      },
      do_task: function do_task () {
        var _this14 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee26 () {
          var _pro15, _this14$currentTaskIn, groups, twitterUsers, retweets, discords, facebooks, youtubes, others, links, socialPlatforms, _iterator20, _step20, task, title, _ref63, status, button, _iterator21, _step21, other, icon, _title2, taskType

          return regeneratorRuntime.wrap(function _callee26$ (_context34) {
            while (1) {
              switch (_context34.prev = _context34.next) {
                case 0:
                  _context34.prev = 0
                  _pro15 = []
                  _context34.next = 4
                  return fuc.updateInfo(_this14.currentTaskInfo)

                case 4:
                  _this14$currentTaskIn = _this14.currentTaskInfo, groups = _this14$currentTaskIn.groups, twitterUsers = _this14$currentTaskIn.twitterUsers, retweets = _this14$currentTaskIn.retweets, discords = _this14$currentTaskIn.discords, facebooks = _this14$currentTaskIn.facebooks, youtubes = _this14$currentTaskIn.youtubes, others = _this14$currentTaskIn.others, links = _this14$currentTaskIn.links
                  socialPlatforms = [].concat(_toConsumableArray(discords), _toConsumableArray(facebooks), _toConsumableArray(youtubes))

                  if (_this14.conf.fuck.joinSteamGroup && groups.length > 0) {
                    _pro15.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        website: 'gleam',
                        type: 'group',
                        elements: groups,
                        resolve: resolve,
                        action: 'fuck'
                      })
                    }))
                  }

                  if (_this14.conf.fuck.followTwitterUser && twitterUsers.length > 0) {
                    _pro15.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        website: 'gleam',
                        social: 'twitter',
                        type: 'follow',
                        elements: twitterUsers,
                        resolve: resolve,
                        action: 'fuck'
                      })
                    }))
                  }

                  if (_this14.conf.fuck.retweet && retweets.length > 0) {
                    _pro15.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        website: 'gleam',
                        social: 'twitter',
                        type: 'retweet',
                        elements: retweets,
                        resolve: resolve,
                        action: 'fuck'
                      })
                    }))
                  }

                  if (globalConf.other.autoOpen) {
                    if (socialPlatforms.length > 0) {
                      _iterator20 = _createForOfIteratorHelper(socialPlatforms)

                      try {
                        for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {
                          task = _step20.value
                          title = $(task).find('.entry-method-title').text().trim()
                          _ref63 = [fuc.echoLog({
                            type: 'custom',
                            text: '<li>'.concat(getI18n('doing'), ':').concat(title, '...<font></font></li>')
                          }), $(task).find('a.btn-info:first').attr('href')], status = _ref63[0], button = _ref63[1]

                          if (button) {
                            window.open(button, '_blank')
                            status.warning(getI18n('openPage'))
                          } else {
                            status.error(getI18n('getTaskUrlFailed'))
                          }
                        }
                      } catch (err) {
                        _iterator20.e(err)
                      } finally {
                        _iterator20.f()
                      }
                    }
                  }

                  if ((globalConf.other.autoOpen || _this14.conf.fuck.visit) && links.length > 0) {
                    _pro15.push(new Promise(function (resolve) {
                      _this14.visit_link(links, 0, resolve)
                    }))
                  }

                  _iterator21 = _createForOfIteratorHelper(others)

                  try {
                    for (_iterator21.s(); !(_step21 = _iterator21.n()).done;) {
                      other = _step21.value
                      icon = $(other).find('.icon-wrapper i')

                      if (icon.hasClass('fa-steam')) {
                        _title2 = $(other).find('.entry-method-title').text().trim()
                        fuc.echoLog({
                          type: 'custom',
                          text: '<li><font class="warning">'.concat(getI18n('unknowntype'), ':').concat(_title2, '</font></li>')
                        })
                      } else {
                        taskType = icon.attr('class').match(/fa-([\w]+)/) ? icon.attr('class').match(/fa-([\w]+)/)[1] : icon.attr('class')
                        fuc.echoLog({
                          type: 'custom',
                          text: '<li><font class="warning">'.concat(getI18n('unknowntype'), ':').concat(taskType, '</font></li>')
                        })
                      }
                    }
                  } catch (err) {
                    _iterator21.e(err)
                  } finally {
                    _iterator21.f()
                  }

                  Promise.all(_pro15).finally(function () {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                    })
                    if (_this14.conf.fuck.verifyTask) _this14.verify(0)
                  })
                  _context34.next = 19
                  break

                case 16:
                  _context34.prev = 16
                  _context34.t0 = _context34.catch(0)
                  throwError(_context34.t0, 'gleam.do_task')

                case 19:
                case 'end':
                  return _context34.stop()
              }
            }
          }, _callee26, null, [[0, 16]])
        }))()
      },
      verify: function verify () {
        var i = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0

        try {
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
        } catch (e) {
          throwError(e, 'gleam.verify')
        }
      },
      remove: function remove () {
        var _arguments4 = arguments
        var _this15 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee27 () {
          var remove, _pro16, _this15$taskInfo, groups, twitterUsers, retweets

          return regeneratorRuntime.wrap(function _callee27$ (_context35) {
            while (1) {
              switch (_context35.prev = _context35.next) {
                case 0:
                  remove = _arguments4.length > 0 && _arguments4[0] !== undefined ? _arguments4[0] : false
                  _context35.prev = 1
                  _pro16 = []

                  if (!remove) {
                    _context35.next = 13
                    break
                  }

                  _context35.next = 6
                  return fuc.updateInfo(_this15.taskInfo)

                case 6:
                  _this15$taskInfo = _this15.taskInfo, groups = _this15$taskInfo.groups, twitterUsers = _this15$taskInfo.twitterUsers, retweets = _this15$taskInfo.retweets

                  if (_this15.conf.remove.leaveSteamGroup && groups.length > 0) {
                    _pro16.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        website: 'gleam',
                        type: 'group',
                        elements: groups,
                        resolve: resolve,
                        action: 'remove'
                      })
                    }))
                  }

                  if (_this15.conf.remove.unfollowTwitterUser && twitterUsers.length > 0) {
                    _pro16.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        website: 'gleam',
                        social: 'twitter',
                        type: 'follow',
                        elements: twitterUsers,
                        resolve: resolve,
                        action: 'remove'
                      })
                    }))
                  }

                  if (_this15.conf.remove.unretweet && retweets.length > 0) {
                    _pro16.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        website: 'gleam',
                        social: 'twitter',
                        type: 'retweet',
                        elements: retweets,
                        resolve: resolve,
                        action: 'remove'
                      })
                    }))
                  }

                  Promise.all(_pro16).finally(function () {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                    })
                  })
                  _context35.next = 14
                  break

                case 13:
                  _this15.get_tasks('remove')

                case 14:
                  _context35.next = 19
                  break

                case 16:
                  _context35.prev = 16
                  _context35.t0 = _context35.catch(1)
                  throwError(_context35.t0, 'gleam.remove')

                case 19:
                case 'end':
                  return _context35.stop()
              }
            }
          }, _callee27, null, [[1, 16]])
        }))()
      },
      visit_link: function visit_link (links, i, r) {
        try {
          if (i < links.length) {
            var title = $(links[i]).find('.entry-method-title').text().trim()
            var status = fuc.echoLog({
              type: 'custom',
              text: '<li>'.concat(getI18n('doing'), ':').concat(title, '...<font></font></li>')
            })
            var taskTime = $(links[i]).find('.form-actions.center span:contains(Visit):contains(seconds)').text()
            var url = language === 'en' ? 'https://auto-task-test.hclonely.com/time_en.html?time=' : 'https://auto-task-test.hclonely.com/time.html?time='
            var timer = null

            if (taskTime) {
              var _taskTime$match

              timer = (_taskTime$match = taskTime.match(/[\d]+/)) === null || _taskTime$match === void 0 ? void 0 : _taskTime$match[0]
            }

            var taskBtn = $(links[i]).find('a.btn-info')
            var href = taskBtn.attr('href')
            taskBtn.removeAttr('href')[0].click()

            GM_openInTab(timer ? url + timer : 'javascript:setTimeout(()=>{window.close()},1000)', {
              active: 1,
              setParent: 1
            }).onclose = function () {
              status.warning('Complete')
              taskBtn.attr('target', '_blank').attr('href', href)
              gleam.visit_link(links, ++i, r)
            }
          } else {
            r(1)
          }
        } catch (e) {
          throwError(e, 'gleam.visit_link')
        }
      },
      get_giveawayId: function get_giveawayId () {
        try {
          return window.location.pathname.replace(/\?.*/, '') || window.location.href
        } catch (e) {
          throwError(e, 'gleam.get_giveawayId')
        }
      },
      checkLeft: function checkLeft () {
        try {
          if ($('.massive-message:contains(ended)').is(':visible')) {
            Swal.fire({
              icon: 'warning',
              title: getI18n('notice'),
              text: getI18n('noKeysLeft'),
              confirmButtonText: getI18n('confirm'),
              cancelButtonText: getI18n('cancel'),
              showCancelButton: true
            }).then(function (_ref64) {
              var value = _ref64.value

              if (value) {
                window.close()
              }
            })
          }
        } catch (e) {
          throwError(e, 'gleam.checkLeft')
        }
      },
      currentTaskInfo: {
        groups: [],
        links: [],
        twitterUsers: [],
        retweets: [],
        discords: [],
        facebooks: [],
        youtubes: [],
        others: [],
        tasks: []
      },
      taskInfo: {
        groups: [],
        twitterUsers: [],
        retweets: [],
        discords: []
      },
      setting: {},
      conf: (config === null || config === void 0 ? void 0 : (_config$gleam = config.gleam) === null || _config$gleam === void 0 ? void 0 : _config$gleam.enable.valueOf()) ? config.gleam : globalConf
    }

    var indiedb = {
      test: function test () {
        try {
          return window.location.host.includes('indiedb')
        } catch (e) {
          throwError(e, 'indiedb.test')
        }
      },
      fuck: function fuck () {
        try {
          if ($('a.buttonenter:contains(Register to join)').length > 0) {
            fuc.echoLog({
              type: 'custom',
              text: '<li><font class="error">'.concat(getI18n('needLogin'), '</font></li>')
            })
          }
          var currentoption = $('a.buttonenter.buttongiveaway')

          if (/join giveaway/gim.test(currentoption.text())) {
            var _ref65 = [fuc.echoLog({
              type: 'custom',
              text: '<li>'.concat(getI18n('joinGiveaway'), '<font></font></li>')
            }), this.do_task]
            var status = _ref65[0]
            var doTask = _ref65[1]
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
                  var _response$response19

                  if ((_response$response19 = response.response) === null || _response$response19 === void 0 ? void 0 : _response$response19.success) {
                    var _response$response20, _response$response21

                    currentoption.addClass('buttonentered').text('Success - Giveaway joined')
                    $('#giveawaysjoined').slideDown()
                    $('#giveawaysrecommend').slideDown()
                    status.success('Success' + (((_response$response20 = response.response) === null || _response$response20 === void 0 ? void 0 : _response$response20.text) ? ':' + ((_response$response21 = response.response) === null || _response$response21 === void 0 ? void 0 : _response$response21.text) : ''))
                    doTask()
                  } else {
                    var _response$response22, _response$response23

                    status.error('Error' + (((_response$response22 = response.response) === null || _response$response22 === void 0 ? void 0 : _response$response22.text) ? ':' + ((_response$response23 = response.response) === null || _response$response23 === void 0 ? void 0 : _response$response23.text) : ''))
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
        } catch (e) {
          throwError(e, 'indiedb.fuck')
        }
      },
      do_task: function do_task () {
        try {
          (function () {
            var id = $('script').map(function (i, e) {
              if (/\$\(document\)/gim.test(e.innerHTML)) {
                return [e.innerHTML.match(/"\/[\d]+"/gim)[0].match(/[\d]+/)[0], e.innerHTML.match(/"\/newsletter\/ajax\/subscribeprofile\/optin\/[\d]+"/gim)[0].match(/[\d]+/)[0]]
              }
            })

            if (id.length === 2) {
              var _ref66 = [$('#giveawaysjoined a[class*=promo]'), []]
              var tasks = _ref66[0]
              var _pro17 = _ref66[1]

              var _iterator22 = _createForOfIteratorHelper(tasks)
              var _step22

              try {
                var _loop16 = function _loop16 () {
                  var task = _step22.value
                  var promo = $(task)

                  if (!promo.hasClass('buttonentered')) {
                    var status = fuc.echoLog({
                      type: 'custom',
                      text: '<li>'.concat(getI18n('doing'), ':').concat(promo.parents('p').text(), '...<font></font></li>')
                    })

                    if (/facebookpromo|twitterpromo|visitpromo/gim.test(task.className)) {
                      _pro17.push(new Promise(function (resolve) {
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
                      _pro17.push(new Promise(function (resolve) {
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
                      _pro17.push(new Promise(function (resolve) {
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
                      _pro17.push(new Promise(function (resolve) {
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

                for (_iterator22.s(); !(_step22 = _iterator22.n()).done;) {
                  _loop16()
                }
              } catch (err) {
                _iterator22.e(err)
              } finally {
                _iterator22.f()
              }

              Promise.all(_pro17).finally(function () {
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
          })()
        } catch (e) {
          throwError(e, 'indiedb.do_task')
        }
      },
      checkLogin: function checkLogin () {
        try {
          if ($('a.buttonenter:contains(Register to join)').length > 0) window.open('/members/login', '_self')
        } catch (e) {
          throwError(e, 'indiedb.checkLogin')
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
      conf: (config === null || config === void 0 ? void 0 : (_config$indiedb = config.indiedb) === null || _config$indiedb === void 0 ? void 0 : _config$indiedb.enable.valueOf()) ? config.indiedb : globalConf
    }

    var keylol = {
      test: function test () {
        try {
          var _$$eq$attr

          return window.location.host.includes('keylol.com') && !window.location.href.includes('mod=forumdisplay') && ((_$$eq$attr = $('.subforum_left_title_left_up a').eq(3).attr('href')) === null || _$$eq$attr === void 0 ? void 0 : _$$eq$attr.includes('319'))
        } catch (e) {
          throwError(e, 'keylol.test')
        }
      },
      after: function after () {
        var _this16 = this

        try {
          unsafeWindow.toggleDiscord = function (action, inviteId) {
            var taskInfo = GM_getValue('taskInfo[' + window.location.host + _this16.get_giveawayId() + ']') || {}
            var toGuild = taskInfo.toGuild || {}
            return new Promise(function (resolve) {
              fuc.toggleActions({
                social: 'discord',
                website: 'keylol',
                elements: [inviteId],
                resolve: resolve,
                action: action,
                toGuild: toGuild
              })
            }).then(function (data) {
              if (action === 'fuck') {
                var _data$

                var _ref67 = (data === null || data === void 0 ? void 0 : (_data$ = data[0]) === null || _data$ === void 0 ? void 0 : _data$.guild) || []
                var _ref68 = _slicedToArray(_ref67, 2)
                var _inviteId = _ref68[0]
                var guild = _ref68[1]

                if (_inviteId && guild) {
                  toGuild[_inviteId] = guild
                  taskInfo.toGuild = toGuild
                  GM_setValue('taskInfo[' + window.location.host + _this16.get_giveawayId() + ']', taskInfo)
                }
              }
            })
          }

          unsafeWindow.toggleReddit = function (action, name) {
            return new Promise(function (resolve) {
              fuc.toggleActions({
                social: 'reddit',
                website: 'keylol',
                elements: [name],
                resolve: resolve,
                action: action
              })
            })
          }

          unsafeWindow.toggleIns = function (action, name) {
            return new Promise(function (resolve) {
              fuc.toggleActions({
                social: 'ins',
                website: 'keylol',
                elements: [name],
                resolve: resolve,
                action: action
              })
            })
          }

          unsafeWindow.toggleTwitter = /* #__PURE__ */(function () {
            var _ref69 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee28 (action, name, type) {
              return regeneratorRuntime.wrap(function _callee28$ (_context36) {
                while (1) {
                  switch (_context36.prev = _context36.next) {
                    case 0:
                      _context36.next = 2
                      return fuc.updateInfo({}, {
                        twitter: true
                      })

                    case 2:
                      return _context36.abrupt('return', new Promise(function (resolve) {
                        fuc.toggleActions({
                          social: 'twitter',
                          website: 'keylol',
                          elements: [name],
                          resolve: resolve,
                          type: type,
                          action: action
                        })
                      }))

                    case 3:
                    case 'end':
                      return _context36.stop()
                  }
                }
              }, _callee28)
            }))

            return function (_x25, _x26, _x27) {
              return _ref69.apply(this, arguments)
            }
          }())

          unsafeWindow.toggleTwitch = function (action, name) {
            return new Promise(function (resolve) {
              fuc.toggleActions({
                social: 'twitch',
                website: 'keylol',
                elements: [name],
                resolve: resolve,
                action: action
              })
            })
          }

          unsafeWindow.toggleVk = function (action, name) {
            return new Promise(function (resolve) {
              fuc.toggleActions({
                social: 'vk',
                website: 'keylol',
                elements: [name],
                resolve: resolve,
                action: action
              })
            })
          }

          unsafeWindow.toggleSteam = /* #__PURE__ */(function () {
            var _ref70 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee29 (action, name, type) {
              var _len
              var args
              var _key
              var isAnnouncement
              var isGroup
              var _args37 = arguments

              return regeneratorRuntime.wrap(function _callee29$ (_context37) {
                while (1) {
                  switch (_context37.prev = _context37.next) {
                    case 0:
                      for (_len = _args37.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
                        args[_key - 3] = _args37[_key]
                      }

                      isAnnouncement = type === 'announcement'
                      isGroup = type === 'group'
                      _context37.next = 5
                      return fuc.updateInfo({}, {
                        steamStore: isGroup || isAnnouncement,
                        steamCommunity: !isGroup
                      })

                    case 5:
                      return _context37.abrupt('return', new Promise(function (resolve) {
                        var elements = [name]

                        if (args) {
                          if (args.length === 3) {
                            elements = [[args[0], name, args[1], args[2]]]
                          } else if (args.length === 1) {
                            elements = {
                              1: name,
                              input: args[0]
                            }
                          }
                        }

                        fuc.toggleActions({
                          social: 'steam',
                          website: 'keylol',
                          elements: elements,
                          resolve: resolve,
                          action: action,
                          type: type
                        })
                      }))

                    case 6:
                    case 'end':
                      return _context37.stop()
                  }
                }
              }, _callee29)
            }))

            return function (_x28, _x29, _x30) {
              return _ref70.apply(this, arguments)
            }
          }())

          unsafeWindow.toggleAutoTaskSelect = function (event, ele) {
            if (event.button === 2) {
              var isSelected = ele.getAttribute('selected')
              isSelected ? ele.removeAttribute('selected') : ele.setAttribute('selected', 'selected')
            }
          }

          var mainPost = $('#postlist>div[id^="post_"]:first')
          var discordLinks = mainPost.find('a[href*="discord.com"]')
          var redditLinks = mainPost.find('a[href*="reddit.com"]')
          var insLinks = mainPost.find('a[href*="instagram.com"]')
          var twitterLinks = mainPost.find('a[href*="twitter.com"]')
          var twitchLinks = mainPost.find('a[href*="twitch.tv"]')
          var vkLinks = mainPost.find('a[href*="vk.com"]')
          var steamStoreLinks = mainPost.find('a[href*="store.steampowered.com"]')
          var steamCommunityLinks = mainPost.find('a[href*="steamcommunity.com"]')

          if (discordLinks.length > 0) {
            var _iterator23 = _createForOfIteratorHelper(discordLinks)
            var _step23

            try {
              for (_iterator23.s(); !(_step23 = _iterator23.n()).done;) {
                var _link$match

                var discordLink = _step23.value
                var link = $(discordLink).attr('href')
                var inviteId = link === null || link === void 0 ? void 0 : (_link$match = link.match(/invite\/(.+)/)) === null || _link$match === void 0 ? void 0 : _link$match[1]

                if (inviteId) {
                  this.addBtn(discordLink, 'toggleDiscord', inviteId, '', ['加入', '退出'])
                }
              }
            } catch (err) {
              _iterator23.e(err)
            } finally {
              _iterator23.f()
            }
          }

          if (redditLinks.length > 0) {
            var _iterator24 = _createForOfIteratorHelper(redditLinks)
            var _step24

            try {
              for (_iterator24.s(); !(_step24 = _iterator24.n()).done;) {
                var _link$match2

                var redditLink = _step24.value

                var _link = $(redditLink).attr('href')

                var name = _link === null || _link === void 0 ? void 0 : (_link$match2 = _link.match(/https?:\/\/www\.reddit\.com\/r\/([^/]*)/)) === null || _link$match2 === void 0 ? void 0 : _link$match2[1]

                if (name) {
                  this.addBtn(redditLink, 'toggleReddit', name, '', ['加入', '退出'])
                }
              }
            } catch (err) {
              _iterator24.e(err)
            } finally {
              _iterator24.f()
            }
          }

          if (insLinks.length > 0) {
            var _iterator25 = _createForOfIteratorHelper(insLinks)
            var _step25

            try {
              for (_iterator25.s(); !(_step25 = _iterator25.n()).done;) {
                var _link2$match

                var insLink = _step25.value

                var _link2 = $(insLink).attr('href')

                var _name = _link2 === null || _link2 === void 0 ? void 0 : (_link2$match = _link2.match(/https:\/\/www\.instagram\.com\/(.+)?\//)) === null || _link2$match === void 0 ? void 0 : _link2$match[1]

                if (_name) {
                  this.addBtn(insLink, 'toggleIns', _name, '', ['关注', '取关'])
                }
              }
            } catch (err) {
              _iterator25.e(err)
            } finally {
              _iterator25.f()
            }
          }

          if (twitterLinks.length > 0) {
            var _iterator26 = _createForOfIteratorHelper(twitterLinks)
            var _step26

            try {
              for (_iterator26.s(); !(_step26 = _iterator26.n()).done;) {
                var _link3$match, _link3$match2

                var twitterLink = _step26.value

                var _link3 = $(twitterLink).attr('href')

                var userId = _link3 === null || _link3 === void 0 ? void 0 : (_link3$match = _link3.match(/https:\/\/twitter\.com\/(.+)/)) === null || _link3$match === void 0 ? void 0 : _link3$match[1]
                var tweetId = _link3 === null || _link3 === void 0 ? void 0 : (_link3$match2 = _link3.match(/https:\/\/twitter\.com\/.*?\/status\/([\d]+)/)) === null || _link3$match2 === void 0 ? void 0 : _link3$match2[1]

                if (tweetId) {
                  this.addBtn(twitterLink, 'toggleTwitter', tweetId, 'retweet', ['转推', '撤销转推'])
                } else {
                  this.addBtn(twitterLink, 'toggleTwitter', userId, 'follow', ['关注', '取关'])
                }
              }
            } catch (err) {
              _iterator26.e(err)
            } finally {
              _iterator26.f()
            }
          }

          if (twitchLinks.length > 0) {
            var _iterator27 = _createForOfIteratorHelper(twitchLinks)
            var _step27

            try {
              for (_iterator27.s(); !(_step27 = _iterator27.n()).done;) {
                var _link4$match

                var twitchLink = _step27.value

                var _link4 = $(twitchLink).attr('href')

                var _name2 = _link4 === null || _link4 === void 0 ? void 0 : (_link4$match = _link4.match(/https:\/\/www\.twitch\.tv\/(.+)/)) === null || _link4$match === void 0 ? void 0 : _link4$match[1]

                if (_name2) {
                  this.addBtn(twitchLink, 'toggleTwitch', _name2, '', ['关注', '取关'])
                }
              }
            } catch (err) {
              _iterator27.e(err)
            } finally {
              _iterator27.f()
            }
          }

          if (vkLinks.length > 0) {
            var _iterator28 = _createForOfIteratorHelper(vkLinks)
            var _step28

            try {
              for (_iterator28.s(); !(_step28 = _iterator28.n()).done;) {
                var _link5$match

                var vkLink = _step28.value

                var _link5 = $(vkLink).attr('href')

                var _name3 = _link5 === null || _link5 === void 0 ? void 0 : (_link5$match = _link5.match(/https:\/\/vk\.com\/([^/]+)/)) === null || _link5$match === void 0 ? void 0 : _link5$match[1]

                if (_name3) {
                  this.addBtn(vkLink, 'toggleVk', _name3, '', ['加入', '退出'])
                }
              }
            } catch (err) {
              _iterator28.e(err)
            } finally {
              _iterator28.f()
            }
          }

          if (steamStoreLinks.length > 0) {
            var _iterator29 = _createForOfIteratorHelper(steamStoreLinks)
            var _step29

            try {
              for (_iterator29.s(); !(_step29 = _iterator29.n()).done;) {
                var _link6$match, _link6$match2, _link6$match3, _link6$match4, _link6$match5, _link6$match6, _link6$match7

                var steamStoreLink = _step29.value

                var _link6 = $(steamStoreLink).attr('href')

                var gameId = _link6 === null || _link6 === void 0 ? void 0 : (_link6$match = _link6.match(/app\/([\d]+)/)) === null || _link6$match === void 0 ? void 0 : _link6$match[1]
                var curatorId = _link6 === null || _link6 === void 0 ? void 0 : (_link6$match2 = _link6.match(/curator\/([\d]+)/)) === null || _link6$match2 === void 0 ? void 0 : _link6$match2[1]
                var publisherName = (_link6 === null || _link6 === void 0 ? void 0 : (_link6$match3 = _link6.match(/publisher\/(.+)\/?/)) === null || _link6$match3 === void 0 ? void 0 : _link6$match3[1]) || (_link6 === null || _link6 === void 0 ? void 0 : (_link6$match4 = _link6.match(/pub\/(.+)\/?/)) === null || _link6$match4 === void 0 ? void 0 : _link6$match4[1])
                var developerName = (_link6 === null || _link6 === void 0 ? void 0 : (_link6$match5 = _link6.match(/developer\/(.+)\/?/)) === null || _link6$match5 === void 0 ? void 0 : _link6$match5[1]) || (_link6 === null || _link6 === void 0 ? void 0 : (_link6$match6 = _link6.match(/dev\/(.+)\/?/)) === null || _link6$match6 === void 0 ? void 0 : _link6$match6[1])
                var franchiseName = _link6 === null || _link6 === void 0 ? void 0 : (_link6$match7 = _link6.match(/franchise\/(.+)\/?/)) === null || _link6$match7 === void 0 ? void 0 : _link6$match7[1]

                var _ref71 = (_link6 === null || _link6 === void 0 ? void 0 : _link6.match(/(https?:\/\/store\.steampowered\.com\/newshub\/app\/[\d]+\/view\/([\d]+))\?authwgtoken=(.+?)&clanid=(.+)/)) || []
                var _ref72 = _slicedToArray(_ref71, 5)
                var url = _ref72[1]
                var announcementId = _ref72[2]
                var wgauthtoken = _ref72[3]
                var clanid = _ref72[4]

                if (gameId) {
                  this.addBtn(steamStoreLink, 'toggleSteam', gameId, 'game', ['关注', '取关'])
                  this.addBtn(steamStoreLink, 'toggleSteam', gameId, 'wishlist', ['加入愿望单', '移出愿望单'])
                } else if (curatorId) {
                  this.addBtn(steamStoreLink, 'toggleSteam', curatorId, 'curator', ['关注', '取关'])
                } else if (publisherName) {
                  this.addBtn(steamStoreLink, 'toggleSteam', publisherName, 'publisher', ['关注', '取关'])
                } else if (developerName) {
                  this.addBtn(steamStoreLink, 'toggleSteam', developerName, 'developer', ['关注', '取关'])
                } else if (franchiseName) {
                  this.addBtn(steamStoreLink, 'toggleSteam', franchiseName, 'franchise', ['关注', '取关'])
                } else if (announcementId) {
                  this.addBtn(steamStoreLink, 'toggleSteam', announcementId, 'announcement', ['点赞'], url, wgauthtoken, clanid)
                }
              }
            } catch (err) {
              _iterator29.e(err)
            } finally {
              _iterator29.f()
            }
          }

          if (steamCommunityLinks.length > 0) {
            var _iterator30 = _createForOfIteratorHelper(steamCommunityLinks)
            var _step30

            try {
              for (_iterator30.s(); !(_step30 = _iterator30.n()).done;) {
                var _link7$match

                var steamCommunityLink = _step30.value

                var _link7 = $(steamCommunityLink).attr('href')

                var groupId = _link7 === null || _link7 === void 0 ? void 0 : (_link7$match = _link7.match(/groups\/(.+)\/?/)) === null || _link7$match === void 0 ? void 0 : _link7$match[1]
                var announcement = _link7 === null || _link7 === void 0 ? void 0 : _link7.match(/announcements\/detail\/([\d]+)/)

                if (groupId) {
                  this.addBtn(steamCommunityLink, 'toggleSteam', groupId, 'group', ['加入', '退出'])
                } else if (announcement) {
                  this.addBtn(steamCommunityLink, 'toggleSteam', announcement[1], 'announcement', ['点赞'], announcement.input)
                }
              }
            } catch (err) {
              _iterator30.e(err)
            } finally {
              _iterator30.f()
            }
          }

          $('.auto-task-keylol').bind('contextmenu', function () {
            return false
          })
        } catch (e) {
          throwError(e, 'keylol.after')
        }
      },
      fuck: function fuck () {
        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee30 () {
          var selectedBtns, _iterator31, _step31, btn, _action

          return regeneratorRuntime.wrap(function _callee30$ (_context38) {
            while (1) {
              switch (_context38.prev = _context38.next) {
                case 0:
                  _context38.prev = 0
                  selectedBtns = $('.auto-task-keylol[selected="selected"]')
                  _iterator31 = _createForOfIteratorHelper(selectedBtns)
                  _context38.prev = 3

                  _iterator31.s()

                case 5:
                  if ((_step31 = _iterator31.n()).done) {
                    _context38.next = 13
                    break
                  }

                  btn = _step31.value
                  _action = $(btn).attr('onclick')
                  _context38.next = 10
                  return eval(_action)

                case 10:
                  // eslint-disable-line no-eval
                  btn.removeAttribute('selected')

                case 11:
                  _context38.next = 5
                  break

                case 13:
                  _context38.next = 18
                  break

                case 15:
                  _context38.prev = 15
                  _context38.t0 = _context38.catch(3)

                  _iterator31.e(_context38.t0)

                case 18:
                  _context38.prev = 18

                  _iterator31.f()

                  return _context38.finish(18)

                case 21:
                  _context38.next = 26
                  break

                case 23:
                  _context38.prev = 23
                  _context38.t1 = _context38.catch(0)
                  throwError(_context38.t1, 'keylol.fuck')

                case 26:
                case 'end':
                  return _context38.stop()
              }
            }
          }, _callee30, null, [[0, 23], [3, 15, 18, 21]])
        }))()
      },
      verify: function verify () {},
      remove: function remove () {},
      get_giveawayId: function get_giveawayId () {
        try {
          var _window$location$href4, _window$location$href5

          return ((_window$location$href4 = window.location.href.match(/t([\d]+?)-/)) === null || _window$location$href4 === void 0 ? void 0 : _window$location$href4[1]) || ((_window$location$href5 = window.location.href.match(/tid=([\d]+)/)) === null || _window$location$href5 === void 0 ? void 0 : _window$location$href5[1]) || window.location.href
        } catch (e) {
          throwError(e, 'keylol.get_giveawayId')
        }
      },
      addBtn: function addBtn (before, func, name, type, text) {
        try {
          for (var _len2 = arguments.length, args = new Array(_len2 > 5 ? _len2 - 5 : 0), _key2 = 5; _key2 < _len2; _key2++) {
            args[_key2 - 5] = arguments[_key2]
          }

          var joinBtn = text[0] ? $('<a href="javascript:void(0);" class="auto-task-keylol" oncontextmenu="return false" onmousedown="toggleAutoTaskSelect(event, this)" onclick="'.concat(func, "('fuck','").concat(name, "'").concat(type ? ",'".concat(type, "'") : '').concat(args && args.length === 3 ? ",'".concat(args[0], "','").concat(args[1], "','").concat(args[2], "'") : '').concat(args && args.length === 1 ? ",'".concat(args[0], "'") : '', ')" target="_self">').concat(text[0], '</a>')) : ''
          var leaveBtn = text[1] ? $('<a href="javascript:void(0);" class="auto-task-keylol" oncontextmenu="return false" onmousedown="toggleAutoTaskSelect(event, this)" onclick="'.concat(func, "('remove','").concat(name, "','").concat(type, "')\" target=\"_self\">").concat(text[1], '</a>')) : ''
          $(before).after(leaveBtn).after(joinBtn)
        } catch (e) {
          throwError(e, 'keylol.addBtn')
        }
      },
      updateSteamInfo: function updateSteamInfo (callback) {
        var _this17 = this

        try {
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
        } catch (e) {
          throwError(e, 'keylol.updateSteamInfo')
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
      conf: globalConf
    }
    var marvelousga = {
      test: function test () {
        try {
          return window.location.host.includes('marvelousga')
        } catch (e) {
          throwError(e, 'marvelousga.test')
        }
      },
      before: function before () {
        try {
          fuc.newTabBlock()
        } catch (e) {
          throwError(e, 'marvelousga.before')
        }
      },
      fuck: function fuck () {
        try {
          this.get_tasks('do_task')
        } catch (e) {
          throwError(e, 'marvelousga.fuck')
        }
      },
      get_tasks: function get_tasks () {
        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'do_task'

        try {
          var taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
          if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory

          if (callback === 'remove' && taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
            this.remove(true)
          } else {
            this.currentTaskInfo = fuc.clearTaskInfo(this.currentTaskInfo)
            var _ref73 = [fuc.echoLog({
              type: 'custom',
              text: '<li>'.concat(getI18n('getTasksInfo'), '<font></font></li>')
            }), $('.container_task')]
            var status = _ref73[0]
            var tasksContainer = _ref73[1]

            var _iterator32 = _createForOfIteratorHelper(tasksContainer)
            var _step32

            try {
              for (_iterator32.s(); !(_step32 = _iterator32.n()).done;) {
                var task = _step32.value

                var _ref74 = [$(task).find('.card-body p.card-text.monospace'), $(task).find('button[id^=task_]:not(:contains(VERIFIED))')]
                var taskDes = _ref74[0]
                var verifyBtn = _ref74[1]

                if (/join[\w\W]*?steamcommunity\.com\/groups/gim.test(taskDes.html())) {
                  var groupName = taskDes.find('a[href*="steamcommunity.com/groups"]').attr('href').match(/steamcommunity.com\/groups\/([\w\d\-_]*)/)[1]

                  if (verifyBtn.length > 0) {
                    this.currentTaskInfo.groups.push(groupName)
                  }

                  this.taskInfo.groups.push(groupName)
                }

                if (/follow[\w\W]*?store\.steampowered\.com\/curator/gim.test(taskDes.html())) {
                  var curatorName = taskDes.find('a[href*="store.steampowered.com/curator"]').attr('href').match(/store\.steampowered\.com\/curator\/([\d]*)/)[1]

                  if (verifyBtn.length > 0) {
                    this.currentTaskInfo.curators.push(curatorName)
                  }

                  this.taskInfo.curators.push(curatorName)
                }

                if (/follow[\w\W]*?https?:\/\/twitter\.com\//gim.test(taskDes.html())) {
                  var _taskDes$find$attr$ma

                  var name = (_taskDes$find$attr$ma = taskDes.find('a[href*="twitter.com"]').attr('href').match(/twitter\.com\/([^/]+)/)) === null || _taskDes$find$attr$ma === void 0 ? void 0 : _taskDes$find$attr$ma[1]

                  if (name) {
                    if (verifyBtn.length > 0) {
                      this.currentTaskInfo.twitterUsers.push(name)
                    }

                    this.taskInfo.twitterUsers.push(name)
                  }
                }

                if (/follow[\w\W]*?https?:\/\/twitch\.tv\//gim.test(taskDes.html())) {
                  var _taskDes$find$attr$ma2

                  var _name4 = (_taskDes$find$attr$ma2 = taskDes.find('a[href*="twitch.tv"]').attr('href').match(/twitch\.tv\/([^/]+)/)) === null || _taskDes$find$attr$ma2 === void 0 ? void 0 : _taskDes$find$attr$ma2[1]

                  if (_name4) {
                    if (verifyBtn.length > 0) {
                      this.currentTaskInfo.twitchChannels.push(_name4)
                    }

                    this.taskInfo.twitchChannels.push(_name4)
                  }
                }

                if (/visit.*?this.*?page/gim.test(taskDes.text()) && verifyBtn.length > 0) {
                  var pageUrl = taskDes.find('a[id^="task_webpage_clickedLink"]').attr('href')
                  this.currentTaskInfo.links.push({
                    pageUrl: pageUrl,
                    taskId: verifyBtn.attr('id').split('_')[3]
                  })
                }

                if (verifyBtn.length > 0) {
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
              _iterator32.e(err)
            } finally {
              _iterator32.f()
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
        } catch (e) {
          throwError(e, 'marvelousga.get_tasks')
        }
      },
      do_task: function do_task () {
        var _this18 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee31 () {
          var _pro18, links, _iterator33, _step33, _loop17

          return regeneratorRuntime.wrap(function _callee31$ (_context39) {
            while (1) {
              switch (_context39.prev = _context39.next) {
                case 0:
                  _context39.prev = 0
                  _context39.next = 3
                  return _this18.toggleActions('fuck')

                case 3:
                  _pro18 = _context39.sent
                  links = fuc.unique(_this18.currentTaskInfo.links)

                  if (_this18.conf.fuck.visitLink) {
                    _iterator33 = _createForOfIteratorHelper(links)

                    try {
                      _loop17 = function _loop17 () {
                        var link = _step33.value

                        _pro18.push(new Promise(function (resolve) {
                          fuc.visitLink(resolve, link.pageUrl, {
                            url: '/ajax/verifyTasks/webpage/clickedLink',
                            method: 'POST',
                            headers: {
                              'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                              'x-csrf-token': $('meta[name="csrf-token"]').attr('content')
                            },
                            data: $.param({
                              giveaway_slug: _this18.get_giveawayId(),
                              giveaway_task_id: link.taskId
                            })
                          })
                        }))
                      }

                      for (_iterator33.s(); !(_step33 = _iterator33.n()).done;) {
                        _loop17()
                      }
                    } catch (err) {
                      _iterator33.e(err)
                    } finally {
                      _iterator33.f()
                    }
                  }

                  Promise.all(_pro18).finally(function () {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                    })
                    if (_this18.conf.fuck.verifyTask) _this18.verify()
                  })
                  _context39.next = 12
                  break

                case 9:
                  _context39.prev = 9
                  _context39.t0 = _context39.catch(0)
                  throwError(_context39.t0, 'marvelousga.do_task')

                case 12:
                case 'end':
                  return _context39.stop()
              }
            }
          }, _callee31, null, [[0, 9]])
        }))()
      },
      verify: function verify () {
        var _arguments5 = arguments
        var _this19 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee32 () {
          var verify, _pro19, _iterator34, _step34, _loop18

          return regeneratorRuntime.wrap(function _callee32$ (_context41) {
            while (1) {
              switch (_context41.prev = _context41.next) {
                case 0:
                  verify = _arguments5.length > 0 && _arguments5[0] !== undefined ? _arguments5[0] : false
                  _context41.prev = 1

                  if (!verify) {
                    _context41.next = 23
                    break
                  }

                  _pro19 = []
                  _iterator34 = _createForOfIteratorHelper(fuc.unique(_this19.currentTaskInfo.tasks))
                  _context41.prev = 5
                  _loop18 = /* #__PURE__ */regeneratorRuntime.mark(function _loop18 () {
                    var task, status
                    return regeneratorRuntime.wrap(function _loop18$ (_context40) {
                      while (1) {
                        switch (_context40.prev = _context40.next) {
                          case 0:
                            task = _step34.value
                            status = fuc.echoLog({
                              type: 'custom',
                              text: '<li>'.concat(getI18n('verifyingTask')).concat(task.taskDes, '...<font></font></li>')
                            })

                            _pro19.push(new Promise(function (resolve) {
                              fuc.httpRequest({
                                url: '/ajax/verifyTasks/' + task.provider + '/' + task.taskRoute,
                                method: 'POST',
                                dataType: 'json',
                                headers: {
                                  'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                                  'x-csrf-token': $('meta[name="csrf-token"]').attr('content')
                                },
                                data: $.param({
                                  giveaway_slug: _this19.get_giveawayId(),
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

                            _context40.next = 5
                            return fuc.delay(500)

                          case 5:
                          case 'end':
                            return _context40.stop()
                        }
                      }
                    }, _loop18)
                  })

                  _iterator34.s()

                case 8:
                  if ((_step34 = _iterator34.n()).done) {
                    _context41.next = 12
                    break
                  }

                  return _context41.delegateYield(_loop18(), 't0', 10)

                case 10:
                  _context41.next = 8
                  break

                case 12:
                  _context41.next = 17
                  break

                case 14:
                  _context41.prev = 14
                  _context41.t1 = _context41.catch(5)

                  _iterator34.e(_context41.t1)

                case 17:
                  _context41.prev = 17

                  _iterator34.f()

                  return _context41.finish(17)

                case 20:
                  Promise.all(_pro19).finally(function () {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="success">'.concat(getI18n('verifyTasksComplete'), '</font><font class="warning">').concat(getI18n('doYourself'), '<a class="hclonely-google" href="javascript:void(0)" target="_self">').concat(getI18n('googleVerify'), '</a>').concat(getI18n('getKey'), '!</font></li>')
                    })
                    $('#get_key_container').show()
                    $('.hclonely-google').unbind().click(function () {
                      $('#get_key_container')[0].scrollIntoView()
                    })
                  })
                  _context41.next = 24
                  break

                case 23:
                  _this19.get_tasks('verify')

                case 24:
                  _context41.next = 29
                  break

                case 26:
                  _context41.prev = 26
                  _context41.t2 = _context41.catch(1)
                  throwError(_context41.t2, 'marvelousga.verify')

                case 29:
                case 'end':
                  return _context41.stop()
              }
            }
          }, _callee32, null, [[1, 26], [5, 14, 17, 20]])
        }))()
      },
      remove: function remove () {
        var _arguments6 = arguments
        var _this20 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee33 () {
          var remove, _pro20

          return regeneratorRuntime.wrap(function _callee33$ (_context42) {
            while (1) {
              switch (_context42.prev = _context42.next) {
                case 0:
                  remove = _arguments6.length > 0 && _arguments6[0] !== undefined ? _arguments6[0] : false
                  _context42.prev = 1

                  if (!remove) {
                    _context42.next = 9
                    break
                  }

                  _context42.next = 5
                  return _this20.toggleActions('remove')

                case 5:
                  _pro20 = _context42.sent
                  Promise.all(_pro20).finally(function () {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                    })
                  })
                  _context42.next = 10
                  break

                case 9:
                  _this20.get_tasks('remove')

                case 10:
                  _context42.next = 15
                  break

                case 12:
                  _context42.prev = 12
                  _context42.t0 = _context42.catch(1)
                  throwError(_context42.t0, 'marvelousga.remove')

                case 15:
                case 'end':
                  return _context42.stop()
              }
            }
          }, _callee33, null, [[1, 12]])
        }))()
      },
      toggleActions: function toggleActions (action) {
        var _this21 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee34 () {
          var _pro21, fuck, taskInfo, groups, curators, twitterUsers, twitchChannels

          return regeneratorRuntime.wrap(function _callee34$ (_context43) {
            while (1) {
              switch (_context43.prev = _context43.next) {
                case 0:
                  _context43.prev = 0
                  _pro21 = []
                  fuck = action === 'fuck'
                  taskInfo = fuck ? _this21.currentTaskInfo : _this21.taskInfo
                  _context43.next = 6
                  return fuc.updateInfo(taskInfo)

                case 6:
                  groups = taskInfo.groups, curators = taskInfo.curators, twitterUsers = taskInfo.twitterUsers, twitchChannels = taskInfo.twitchChannels

                  if (_this21.conf[action][fuck ? 'joinSteamGroup' : 'leaveSteamGroup'] && groups.length > 0) {
                    _pro21.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        website: 'marvelousga',
                        type: 'group',
                        elements: groups,
                        resolve: resolve,
                        action: action
                      })
                    }))
                  }

                  if (_this21.conf[action][fuck ? 'followCurator' : 'unfollowCurator'] && curators.length > 0) {
                    _pro21.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        website: 'marvelousga',
                        type: 'curator',
                        elements: curators,
                        resolve: resolve,
                        action: action
                      })
                    }))
                  }

                  if (_this21.conf[action][fuck ? 'followTwitterUser' : 'unfollowTwitterUser'] && twitterUsers.length > 0) {
                    _pro21.push(new Promise(function (resolve) {
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

                  if (_this21.conf[action][fuck ? 'followTwitchChannel' : 'unfollowTwitchChannel'] && twitchChannels.length > 0) {
                    _pro21.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        website: 'marvelousga',
                        social: 'twitch',
                        elements: twitchChannels,
                        resolve: resolve,
                        action: action
                      })
                    }))
                  }

                  return _context43.abrupt('return', _pro21)

                case 14:
                  _context43.prev = 14
                  _context43.t0 = _context43.catch(0)
                  throwError(_context43.t0, 'marvelousga.toggleActions')

                case 17:
                case 'end':
                  return _context43.stop()
              }
            }
          }, _callee34, null, [[0, 14]])
        }))()
      },
      get_giveawayId: function get_giveawayId () {
        try {
          return $('#giveawaySlug').val() || window.location.href
        } catch (e) {
          throwError(e, 'marvelousga.get_giveawayId')
        }
      },
      checkLogin: function checkLogin () {
        try {
          if ($('a[href*=login]').length > 0) window.open('/login', '_self')
        } catch (e) {
          throwError(e, 'marvelousga.checkLogin')
        }
      },
      checkLeft: function checkLeft () {
        try {
          if ($('h3.text-danger:contains(this giveaway is closed)').length > 0) {
            $('#link_to_click').remove()
            Swal.fire({
              icon: 'warning',
              title: getI18n('notice'),
              text: getI18n('noKeysLeft'),
              confirmButtonText: getI18n('confirm'),
              cancelButtonText: getI18n('cancel'),
              showCancelButton: true
            }).then(function (_ref75) {
              var value = _ref75.value

              if (value) {
                window.close()
              }
            })
          }
        } catch (e) {
          throwError(e, 'marvelousga.checkLeft')
        }
      },
      currentTaskInfo: {
        groups: [],
        curators: [],
        twitterUsers: [],
        twitchChannels: [],
        links: [],
        tasks: []
      },
      taskInfo: {
        groups: [],
        curators: [],
        twitterUsers: [],
        twitchChannels: []
      },
      setting: {},
      conf: (config === null || config === void 0 ? void 0 : (_config$marvelousga = config.marvelousga) === null || _config$marvelousga === void 0 ? void 0 : _config$marvelousga.enable.valueOf()) ? config.marvelousga : globalConf
    }

    var opiumpulses = {
      test: function test () {
        try {
          return window.location.host.includes('opiumpulses')
        } catch (e) {
          throwError(e, 'opiumpulses.test')
        }
      },
      fuck: function fuck () {
        try {
          this.get_tasks('FREE')
        } catch (e) {
          throwError(e, 'opiumpulses.fuck')
        }
      },
      get_tasks: function get_tasks () {
        var _arguments7 = arguments
        var _this22 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee36 () {
          var type, _ref76, items, maxPoint, myPoint, i, item, needPoints

          return regeneratorRuntime.wrap(function _callee36$ (_context45) {
            while (1) {
              switch (_context45.prev = _context45.next) {
                case 0:
                  type = _arguments7.length > 0 && _arguments7[0] !== undefined ? _arguments7[0] : 'FREE'
                  _context45.prev = 1
                  _ref76 = [$(".giveaways-page-item:contains('".concat(type, "'):not(:contains('ENTERED'))")), _this22.maxPoint()], items = _ref76[0], maxPoint = _ref76[1]
                  myPoint = _this22.myPoints
                  i = 0

                case 5:
                  if (!(i < items.length)) {
                    _context45.next = 21
                    break
                  }

                  item = items[i]
                  needPoints = $(item).find('.giveaways-page-item-header-points').text().match(/[\d]+/gim)

                  if (!(type === 'points' && needPoints && parseInt(needPoints[0]) > myPoint)) {
                    _context45.next = 12
                    break
                  }

                  fuc.echoLog({
                    type: 'custom',
                    text: '<li><font class="warning">'.concat(getI18n('noPoints'), '</font></li>')
                  })
                  _context45.next = 18
                  break

                case 12:
                  if (!(type === 'points' && !needPoints)) {
                    _context45.next = 16
                    break
                  }

                  fuc.echoLog({
                    type: 'custom',
                    text: '<li><font class="warning">'.concat(getI18n('getNeedPointsFailed'), '</font></li>')
                  })
                  _context45.next = 18
                  break

                case 16:
                  if (type === 'points' && parseInt(needPoints[0]) > maxPoint) {
                    _context45.next = 18
                    break
                  }

                  return _context45.delegateYield(/* #__PURE__ */regeneratorRuntime.mark(function _callee35 () {
                    var _ref77, status, a, _a$attr$match, giveawayId

                    return regeneratorRuntime.wrap(function _callee35$ (_context44) {
                      while (1) {
                        switch (_context44.prev = _context44.next) {
                          case 0:
                            _ref77 = [fuc.echoLog({
                              type: 'custom',
                              text: '<li>'.concat(getI18n('joinLottery'), '<a href="').concat($(item).find('a.giveaways-page-item-img-btn-more').attr('href'), '" target="_blank">').concat($(item).find('.giveaways-page-item-footer-name').text().trim(), '</a>...<font></font></li>')
                            }), $(item).find("a.giveaways-page-item-img-btn-enter:contains('enter')")], status = _ref77[0], a = _ref77[1]

                            if (a.attr('onclick') && a.attr('onclick').includes('checkUser')) {
                              giveawayId = (_a$attr$match = a.attr('onclick').match(/[\d]+/)) === null || _a$attr$match === void 0 ? void 0 : _a$attr$match[0]
                              if (giveawayId) checkUser(giveawayId)
                            }

                            _context44.next = 4
                            return new Promise(function (resolve) {
                              fuc.httpRequest({
                                url: a.attr('href'),
                                method: 'GET',
                                onload: function onload (response) {
                                  if (debug) console.log(response)

                                  if (response.responseText && /You've entered this giveaway/gim.test(response.responseText)) {
                                    var _response$responseTex13

                                    status.success()
                                    var points = (_response$responseTex13 = response.responseText.match(/Points:[\s]*?([\d]+)/)) === null || _response$responseTex13 === void 0 ? void 0 : _response$responseTex13[1]

                                    if (type === 'points' && points) {
                                      if (debug) console.log(getI18n('pointsLeft') + points)
                                      myPoint = parseInt(points)
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
                            return _context44.stop()
                        }
                      }
                    }, _callee35)
                  })(), 't0', 18)

                case 18:
                  i++
                  _context45.next = 5
                  break

                case 21:
                  fuc.echoLog({
                    type: 'custom',
                    text: '<li>-----END-----</li>'
                  })
                  _context45.next = 27
                  break

                case 24:
                  _context45.prev = 24
                  _context45.t1 = _context45.catch(1)
                  throwError(_context45.t1, 'opiumpulses.get_tasks')

                case 27:
                case 'end':
                  return _context45.stop()
              }
            }
          }, _callee36, null, [[1, 24]])
        }))()
      },
      verify: function verify () {
        try {
          var _$$text$match

          var myPoints = (_$$text$match = $('.page-header__nav-func-user-nav-items.points-items').text().match(/[\d]+/gim)) === null || _$$text$match === void 0 ? void 0 : _$$text$match[0]

          if (myPoints) {
            this.myPoints = Number(myPoints)
            this.get_tasks('points')
          } else {
            fuc.echoLog({
              type: 'custom',
              text: '<li><font class="error">'.concat(getI18n('getPointsFailed'), '</font></li>')
            })
          }
        } catch (e) {
          throwError(e, 'opiumpulses.verify')
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
      conf: (config === null || config === void 0 ? void 0 : (_config$opiumpulses = config.opiumpulses) === null || _config$opiumpulses === void 0 ? void 0 : _config$opiumpulses.enable.valueOf()) ? config.opiumpulses : globalConf,
      maxPoint: function maxPoint () {
        try {
          var _this$conf, _this$conf$other

          return ((_this$conf = this.conf) === null || _this$conf === void 0 ? void 0 : (_this$conf$other = _this$conf.other) === null || _this$conf$other === void 0 ? void 0 : _this$conf$other.limitPoint) ? Number(this.conf.other.limitPoint) : Infinity
        } catch (e) {
          throwError(e, 'opiumpulses.maxPoint')
        }
      }
    }

    var prys = {
      test: function test () {
        try {
          return window.location.host.includes('prys.revadike')
        } catch (e) {
          throwError(e, 'prys.test')
        }
      },
      fuck: function fuck () {
        try {
          this.get_tasks('do_task')
        } catch (e) {
          throwError(e, 'prys.fuck')
        }
      },
      get_tasks: function get_tasks () {
        var _this23 = this

        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'do_task'

        try {
          var _ref78 = [fuc.echoLog({
            type: 'custom',
            text: '<li>'.concat(getI18n('getTasksInfo'), '<font></font></li>')
          }), $('#steps tbody tr')]
          var status = _ref78[0]
          var steps = _ref78[1]

          for (var i = 0; i < steps.length; i++) {
            if (steps.eq(i).find('span:contains(Success)').length === 0) checkClick(i)
          }

          if (callback === 'do_task') {
            this.currentTaskInfo = fuc.clearTaskInfo(this.currentTaskInfo)
            var _ref79 = [GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']'), []]
            var taskInfoHistory = _ref79[0]
            var _pro22 = _ref79[1]
            if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory

            var _iterator35 = _createForOfIteratorHelper(steps)
            var _step35

            try {
              for (_iterator35.s(); !(_step35 = _iterator35.n()).done;) {
                var step = _step35.value

                if ($(step).find('span:contains(Success)').length === 0) {
                  if ($(step).find("a[href*='store.steampowered.com/curator/']").length > 0) {
                    var _link$match3

                    var link = $(step).find("a[href*='store.steampowered.com/curator/']").attr('href')
                    var curatorId = (_link$match3 = link.match(/curator\/([\d]+)/)) === null || _link$match3 === void 0 ? void 0 : _link$match3[1]

                    if (curatorId) {
                      this.currentTaskInfo.curators.push(curatorId)
                      this.taskInfo.curators.push(curatorId)
                    }
                  } else if ($(step).find("a[href*='steampowered.com/groups/']").length > 0) {
                    var _link8$match

                    var _link8 = $(step).find("a[href*='steampowered.com/groups/']").attr('href')

                    var groupName = (_link8$match = _link8.match(/groups\/(.+)\/?/)) === null || _link8$match === void 0 ? void 0 : _link8$match[1]

                    if (groupName) {
                      this.currentTaskInfo.groups.push(groupName)
                      this.taskInfo.groups.push(groupName)
                    }
                  } else if ($(step).find("a[href*='steamcommunity.com/gid']").length > 0) {
                    (function () {
                      var link = $(step).find("a[href*='steamcommunity.com/gid']").attr('href')

                      _pro22.push(new Promise(function (resolve) {
                        new Promise(function (resolve) {
                          fuc.getFinalUrl(resolve, link)
                        }).then(function (data) {
                          if (data.result === 'success') {
                            var _data$finalUrl$match

                            var _groupName2 = (_data$finalUrl$match = data.finalUrl.match(/groups\/(.+)\/?/)) === null || _data$finalUrl$match === void 0 ? void 0 : _data$finalUrl$match[1]

                            if (_groupName2) {
                              _this23.currentTaskInfo.groups.push(_groupName2)

                              _this23.taskInfo.groups.push(_groupName2)
                            }
                          }

                          resolve(1)
                        }).catch(function () {
                          resolve(1)
                        })
                      }))
                    })()
                  }
                }
              }
            } catch (err) {
              _iterator35.e(err)
            } finally {
              _iterator35.f()
            }

            if (_pro22.length > 0) {
              Promise.all(_pro22).finally(function () {
                _this23.currentTaskInfo = fuc.uniqueTaskInfo(_this23.currentTaskInfo)
                _this23.taskInfo = fuc.uniqueTaskInfo(_this23.taskInfo)
                GM_setValue('taskInfo[' + window.location.host + _this23.get_giveawayId() + ']', _this23.taskInfo)

                if (_this23.currentTaskInfo.groups.length > 0 || _this23.currentTaskInfo.curators.length > 0) {
                  _this23.do_task()
                } else {
                  fuc.echoLog({
                    type: 'custom',
                    text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                  })
                  if (_this23.conf.fuck.verifyTask) _this23.verify()
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
              var _iterator36 = _createForOfIteratorHelper(checks)
              var _step36

              try {
                for (_iterator36.s(); !(_step36 = _iterator36.n()).done;) {
                  var _$$attr$match

                  var check = _step36.value
                  var id = (_$$attr$match = $(check).attr('id').match(/[\d]+/)) === null || _$$attr$match === void 0 ? void 0 : _$$attr$match[0]
                  if (id) {
                    this.currentTaskInfo.tasks.push({
                      id: id,
                      taskDes: $(check).parent().prev().html().trim()
                    })
                  }
                }
              } catch (err) {
                _iterator36.e(err)
              } finally {
                _iterator36.f()
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
              var _pro23 = []

              var _iterator37 = _createForOfIteratorHelper(steps)
              var _step37

              try {
                for (_iterator37.s(); !(_step37 = _iterator37.n()).done;) {
                  var _step38 = _step37.value

                  if ($(_step38).find("a[href*='store.steampowered.com/curator/']").length > 0) {
                    var _link9$match

                    var _link9 = $(_step38).find("a[href*='store.steampowered.com/curator/']").attr('href')

                    var _curatorId = (_link9$match = _link9.match(/curator\/([\d]+)/)) === null || _link9$match === void 0 ? void 0 : _link9$match[1]

                    if (_curatorId) this.taskInfo.curators.push(_curatorId)
                  } else if ($(_step38).find("a[href*='steampowered.com/groups/']").length > 0) {
                    var _link10$match

                    var _link10 = $(_step38).find("a[href*='steampowered.com/groups/']").attr('href')

                    var _groupName3 = (_link10$match = _link10.match(/groups\/(.+)\/?/)) === null || _link10$match === void 0 ? void 0 : _link10$match[1]

                    if (_groupName3) this.taskInfo.groups.push(_groupName3)
                  } else if ($(_step38).find("a[href*='steamcommunity.com/gid']").length > 0) {
                    (function () {
                      var link = $(_step38).find("a[href*='steamcommunity.com/gid']").attr('href')

                      _pro23.push(new Promise(function (resolve) {
                        new Promise(function (resolve) {
                          fuc.getFinalUrl(resolve, link)
                        }).then(function (data) {
                          if (data.result === 'success') {
                            var _data$finalUrl$match2

                            var _groupName4 = (_data$finalUrl$match2 = data.finalUrl.match(/groups\/(.+)\/?/)) === null || _data$finalUrl$match2 === void 0 ? void 0 : _data$finalUrl$match2[1]

                            if (_groupName4) {
                              _this23.taskInfo.groups.push(_groupName4)
                            }
                          }

                          resolve(1)
                        }).catch(function (error) {
                          if (debug) console.error(error)
                          resolve(0)
                        })
                      }))
                    })()
                  }
                }
              } catch (err) {
                _iterator37.e(err)
              } finally {
                _iterator37.f()
              }

              if (_pro23.length > 0) {
                Promise.all(_pro23).finally(function () {
                  _this23.taskInfo = fuc.uniqueTaskInfo(_this23.taskInfo)
                  GM_setValue('taskInfo[' + window.location.host + _this23.get_giveawayId() + ']', _this23.taskInfo)

                  if (_this23.taskInfo.groups.length > 0 || _this23.taskInfo.curators.length > 0) {
                    _this23.remove(true)
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
        } catch (e) {
          throwError(e, 'prys.get_tasks')
        }
      },
      do_task: function do_task () {
        var _this24 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee37 () {
          var _pro24

          return regeneratorRuntime.wrap(function _callee37$ (_context46) {
            while (1) {
              switch (_context46.prev = _context46.next) {
                case 0:
                  _context46.prev = 0
                  _context46.next = 3
                  return _this24.toggleActions('fuck')

                case 3:
                  _pro24 = _context46.sent
                  Promise.all(_pro24).finally(function () {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                    })
                    if (_this24.conf.fuck.verifyTask) _this24.verify()
                  })
                  _context46.next = 10
                  break

                case 7:
                  _context46.prev = 7
                  _context46.t0 = _context46.catch(0)
                  throwError(_context46.t0, 'prys.do_task')

                case 10:
                case 'end':
                  return _context46.stop()
              }
            }
          }, _callee37, null, [[0, 7]])
        }))()
      },
      verify: function verify () {
        var _this25 = this

        var verify = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false

        try {
          if (verify) {
            var _pro25 = []

            var _iterator38 = _createForOfIteratorHelper(fuc.unique(this.currentTaskInfo.tasks))
            var _step39

            try {
              var _loop19 = function _loop19 () {
                var task = _step39.value
                var status = fuc.echoLog({
                  type: 'custom',
                  text: '<li>'.concat(getI18n('verifyingTask')).concat(task.taskDes, '...<font></font></li>')
                })

                _pro25.push(new Promise(function (resolve) {
                  _this25.checkStep(task.id, resolve, status)
                }))
              }

              for (_iterator38.s(); !(_step39 = _iterator38.n()).done;) {
                _loop19()
              }
            } catch (err) {
              _iterator38.e(err)
            } finally {
              _iterator38.f()
            }

            Promise.all(_pro25).finally(function () {
              fuc.echoLog({
                type: 'custom',
                text: '<li><font class="success">'.concat(getI18n('prysAllTasksComplete'), '</font></li>')
              })
            })
          } else {
            this.get_tasks('verify')
          }
        } catch (e) {
          throwError(e, 'prys.verify')
        }
      },
      checkStep: function checkStep (step, r, status, captcha) {
        try {
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
        } catch (e) {
          throwError(e, 'prys.checkStep')
        }
      },
      remove: function remove () {
        var _arguments8 = arguments
        var _this26 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee38 () {
          var remove, _pro26

          return regeneratorRuntime.wrap(function _callee38$ (_context47) {
            while (1) {
              switch (_context47.prev = _context47.next) {
                case 0:
                  remove = _arguments8.length > 0 && _arguments8[0] !== undefined ? _arguments8[0] : false
                  _context47.prev = 1

                  if (!remove) {
                    _context47.next = 9
                    break
                  }

                  _context47.next = 5
                  return _this26.toggleActions('remove')

                case 5:
                  _pro26 = _context47.sent
                  Promise.all(_pro26).finally(function () {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                    })
                  })
                  _context47.next = 10
                  break

                case 9:
                  _this26.get_tasks('remove')

                case 10:
                  _context47.next = 15
                  break

                case 12:
                  _context47.prev = 12
                  _context47.t0 = _context47.catch(1)
                  throwError(_context47.t0, 'prys.remove')

                case 15:
                case 'end':
                  return _context47.stop()
              }
            }
          }, _callee38, null, [[1, 12]])
        }))()
      },
      toggleActions: function toggleActions (action) {
        var _this27 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee39 () {
          var _pro27, fuck, taskInfo, groups, curators

          return regeneratorRuntime.wrap(function _callee39$ (_context48) {
            while (1) {
              switch (_context48.prev = _context48.next) {
                case 0:
                  _context48.prev = 0
                  _pro27 = []
                  fuck = action === 'fuck'
                  taskInfo = fuck ? _this27.currentTaskInfo : _this27.taskInfo
                  _context48.next = 6
                  return fuc.updateInfo(taskInfo)

                case 6:
                  groups = taskInfo.groups, curators = taskInfo.curators

                  if (_this27.conf[action][fuck ? 'joinSteamGroup' : 'leaveSteamGroup'] && groups.length > 0) {
                    _pro27.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        website: 'prys',
                        type: 'group',
                        elements: groups,
                        resolve: resolve,
                        action: action
                      })
                    }))
                  }

                  if (_this27.conf[action][fuck ? 'followCurator' : 'unfollowCurator'] && curators.length > 0) {
                    _pro27.push(new Promise(function (resolve) {
                      fuc.toggleActions({
                        website: 'prys',
                        type: 'curator',
                        elements: curators,
                        resolve: resolve,
                        action: action
                      })
                    }))
                  }

                  return _context48.abrupt('return', _pro27)

                case 12:
                  _context48.prev = 12
                  _context48.t0 = _context48.catch(0)
                  throwError(_context48.t0, 'prys.toggleActions')

                case 15:
                case 'end':
                  return _context48.stop()
              }
            }
          }, _callee39, null, [[0, 12]])
        }))()
      },
      get_giveawayId: function get_giveawayId () {
        try {
          var _window$location$sear

          return ((_window$location$sear = window.location.search.match(/id=([\d]+)/)) === null || _window$location$sear === void 0 ? void 0 : _window$location$sear[1]) || window.location.href
        } catch (e) {
          throwError(e, 'prys.get_giveawayId')
        }
      },
      checkLeft: function checkLeft () {
        try {
          var left = $('#header').text().match(/([\d]+).*?prize.*?left/)

          if (!(left.length > 0 && left[1] !== '0')) {
            Swal.fire({
              icon: 'warning',
              title: getI18n('notice'),
              text: getI18n('noKeysLeft'),
              confirmButtonText: getI18n('confirm'),
              cancelButtonText: getI18n('cancel'),
              showCancelButton: true
            }).then(function (_ref80) {
              var value = _ref80.value

              if (value) {
                window.close()
              }
            })
          }
        } catch (e) {
          throwError(e, 'prys.checkLeft')
        }
      },
      currentTaskInfo: {
        groups: [],
        curators: [],
        tasks: []
      },
      taskInfo: {
        groups: [],
        curators: []
      },
      setting: {},
      conf: (config === null || config === void 0 ? void 0 : (_config$prys = config.prys) === null || _config$prys === void 0 ? void 0 : _config$prys.enable.valueOf()) ? config.prys : globalConf
    }
    var website = null
    var websites = [banana, freegamelottery, gamehag, giveawaysu, gleam, indiedb, keylol, marvelousga, opiumpulses, prys]

    for (var _i6 = 0, _websites = websites; _i6 < _websites.length; _i6++) {
      var e = _websites[_i6]

      if (e.test()) {
        website = e
        break
      }
    }

    var pageHref = window.location.href
    var pageHost = window.location.host

    if (website || pageHost.includes('hclonely')) {
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

      if (pageHost.includes('hclonely')) {
        if (window.location.pathname.includes('setting')) {
          var _GM_getValue, _GM_getValue$global2, _GM_getValue$global2$

          unsafeWindow.GM_info = GM_info // eslint-disable-line camelcase

          unsafeWindow.GM_setValue = GM_setValue // eslint-disable-line camelcase

          unsafeWindow.language = language
          typeof ((_GM_getValue = GM_getValue('conf')) === null || _GM_getValue === void 0 ? void 0 : (_GM_getValue$global2 = _GM_getValue.global) === null || _GM_getValue$global2 === void 0 ? void 0 : (_GM_getValue$global2$ = _GM_getValue$global2.fuck) === null || _GM_getValue$global2$ === void 0 ? void 0 : _GM_getValue$global2$.joinSteamGroup) !== 'boolean' ? loadSettings(defaultConf) : loadSettings(config)
        } else if (window.location.pathname.includes('announcement')) {
          loadAnnouncement()
        }
      } else if (pageHost.includes('marvelousga') && !window.location.pathname.includes('giveaway')) {
        fuc.newTabBlock()
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

        for (var _i7 = 0, _Object$entries3 = Object.entries(websiteSettings); _i7 < _Object$entries3.length; _i7++) {
          var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i7], 2)
          var _k4 = _Object$entries3$_i[0]
          var v = _Object$entries3$_i[1]

          if (v.show) buttons += '<button id="'.concat(_k4, '" type="button" class="btn btn-primary" title="').concat(v.title, '">').concat(v.text, '</button>')
        }

        if (showLogs) buttons += '<button id="toggle-logs" type="button" class="btn btn-primary" title="'.concat(!showLogs ? getI18n('showLog') : getI18n('hideLog'), '">').concat(!showLogs ? 'ShowLogs' : 'HideLogs', '</button>')
        var buttonGroup = '<div class="btn-group-vertical" role="group" aria-label="button">'.concat(buttons, '</div>')
        $('body').append('<div id="fuck-task-btn"><button id="toggle-btn-group" type="button" class="btn btn-outline-primary">&gt;</button>'.concat(buttonGroup, '</div>'))

        var _loop20 = function _loop20 () {
          var _Object$entries4$_i = _slicedToArray(_Object$entries4[_i8], 2)
          var k = _Object$entries4$_i[0]
          var v = _Object$entries4$_i[1]

          if (v.show) {
            $('#' + k).click(function () {
              website[k]()
            })
          }
        }

        for (var _i8 = 0, _Object$entries4 = Object.entries(websiteSettings); _i8 < _Object$entries4.length; _i8++) {
          _loop20()
        }

        $('#toggle-logs').click(fuc.toggleLogs)
        $('#toggle-btn-group').click(function () {
          try {
            var btnGroup = $('#fuck-task-btn .btn-group-vertical')

            if (btnGroup.css('width') === '0px') {
              btnGroup.css('width', '')
              $('#toggle-btn-group').attr('title', getI18n('hide')).text('>')
            } else {
              btnGroup.css('width', '0')
              $('#toggle-btn-group').attr('title', getI18n('show')).text('<')
            }
          } catch (e) {
            throwError(e, '$(\'#toggle-btn-group\').click')
          }
        })

        $(document).keydown(function (e) {
          try {
            var hotKey = globalConf.hotKey || {}

            for (var _i9 = 0, _Object$entries5 = Object.entries(hotKey); _i9 < _Object$entries5.length; _i9++) {
              var _Object$entries5$_i = _slicedToArray(_Object$entries5[_i9], 2)
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
          } catch (e) {
            throwError(e, '$(document).keydown')
          }
        })
        $('body').append('<div id="fuck-task-info" class="card">\n  <div class="card-body">\n    <h3 class="card-title">'.concat(getI18n('taskLog'), '</h3>\n    <h4 class="card-subtitle">\n      <a id="check-update" href="javascript:void(0)" terget="_self" class="card-link iconfont icon-update_1" title="').concat(getI18n('checkUpdate'), '"></a>\n      <a id="auto-task-setting" href="javascript:void(0)" data-href="https://auto-task-test.hclonely.com/setting.html" terget="_self" class="card-link iconfont icon-setting" title="').concat(getI18n('setting'), '"></a>\n      <a id="auto-task-announcement" href="javascript:void(0)" data-href="https://auto-task-test.hclonely.com/announcement.html" terget="_blank" class="card-link iconfont icon-announcement" title="').concat(getI18n('visitUpdateText'), '"></a>\n      <a id="clean-cache" href="javascript:void(0)" terget="_self" class="card-link iconfont icon-clean" title="').concat(getI18n('cleanCache'), '"></a>\n      <a id="auto-task-feedback" href="javascript:void(0)" data-href="https://github.com/HCLonely/auto-task/issues/new/choose" terget="_blank" class="card-link iconfont icon-feedback" title="').concat(getI18n('feedback'), '"></a>\n    </h4>\n    <div class="card-textarea">\n    </div>\n  </div>\n</div>'))
        $('#clean-cache').click(function () {
          try {
            var status = fuc.echoLog({
              type: 'custom',
              text: '<li>'.concat(getI18n('cleaning'), '<font></font></li>')
            })
            var listValues = GM_listValues()

            var _iterator39 = _createForOfIteratorHelper(listValues)
            var _step40

            try {
              for (_iterator39.s(); !(_step40 = _iterator39.n()).done;) {
                var value = _step40.value
                if (!['conf', 'language', 'steamInfo', 'discordInfo', 'insInfo', 'twitchInfo', 'twitterInfo', 'redditInfo'].includes(value)) GM_deleteValue(value)
              }
            } catch (err) {
              _iterator39.e(err)
            } finally {
              _iterator39.f()
            }

            status.success()
          } catch (e) {
            throwError(e, '$(\'#clean-cache\').click')
          }
        })
        $('#check-update').click(function () {
          try {
            fuc.checkUpdate(true)
          } catch (e) {
            throwError(e, '$(\'#check-update\').click')
          }
        })
        $('#auto-task-setting,#auto-task-feedback,#auto-task-announcement').click(function () {
          try {
            window.open($(this).attr('data-href'), '_blank')
          } catch (e) {
            throwError(e, '$(\'#auto-task-setting,#auto-task-feedback,#auto-task-announcement\').click')
          }
        })
        fuc.checkUpdate()

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
        try {
          window.open('https://blog.hclonely.com/posts/777c60d5/', '_blank')
        } catch (e) {
          throwError(e, 'GM_registerMenuCommand(\'readme\')')
        }
      })
      GM_registerMenuCommand(getI18n('updateSteamInfo'), function () {
        try {
          new Promise(function (resolve) {
            fuc.updateSteamInfo(resolve, 'all', true)
          }).then(function (r) {
            fuc.echoLog({
              type: 'custom',
              text: '<li><font class="success">'.concat(getI18n('updateSteamInfoComplete'), '</font></li>')
            })
          })
        } catch (e) {
          throwError(e, 'GM_registerMenuCommand(\'updateSteamInfo\')')
        }
      })
      GM_registerMenuCommand('Language', function () {
        try {
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
        } catch (e) {
          throwError(e, 'GM_registerMenuCommand(\'Language\')')
        }
      })
    } else if (pageHref.includes('discord.com/app')) {
      fuc.getDiscordAuth()
    } else if (pageHref.includes('www.twitch.tv')) {
      if (pageHref.includes('#updateTwitchInfo')) {
        fuc.updateTwitchInfo(true)
      } else if (!pageHref.includes('/login')) {
        fuc.updateTwitchInfo(false)
      }
    } else if (pageHref.includes('www.youtube.com')) {
      if (pageHref.includes('#updateYtbInfo')) {
        fuc.updateYtbInfo(true)
      } else {
        fuc.updateYtbInfo(false)
      }
    }
  })()
} catch (e) {
  Swal.fire({
    icon: 'error',
    html: '脚本执行出错，详细信息请查看控制台(红色背景部分)！<br>Script execution error, please see the console for details (red background part)!'
  })
  console.log('%c%s', 'color:white;background:red', e.stack)
}
