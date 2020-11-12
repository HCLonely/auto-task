// ==UserScript==
// @name               自动任务 Test
// @name:en            Auto Task Test
// @name:zh-CN         自动任务 Test
// @namespace          auto-task
// @version            3.2.5
// @description        自动完成赠key站任务
// @description:en     Automatically complete giveaway tasks
// @description:zh-CN  自动完成赠key站任务
// @author             HCLonely
// @license            MIT
// @iconURL            https://auto-task-test.hclonely.com/img/favicon.ico
// @homepage           https://auto-task-doc.js.org
// @supportURL         https://github.com/HCLonely/auto-task/issues/new/choose
// @updateURL          https://auto-task-test.hclonely.com/auto-task-test.user.js
// @downloadURL        https://auto-task-test.hclonely.com/auto-task-test.user.js

// @include            *://giveaway.su/giveaway/view/*
// @include            *://marvelousga.com/*
// @include            *://www.grabfreegame.com/giveaway/*
// @include            *://www.bananagiveaway.com/giveaway/*
// @include            /https?:\/\/gamehag.com\/.*?giveaway\/.*/
// @include            *://prys.revadike.com/giveaway/?id=*
// @include            *://www.indiedb.com/giveaways*
// @include            *://www.opiumpulses.com/giveaways
// @include            *://takekey.ru/distribution/*
// @include            *://*freegamelottery.com*
// @include            *://gleam.io/*
// @include            *://keylol.com/*
// @include            *://givekey.ru/giveaway/*
// @include            *://key-hub.eu/giveaway/*
// @include            *://discord.com/*
// @include            *://www.twitch.tv/*
// @include            *://www.youtube.com/*
// @exclude            *googleads*
// @include            https://auto-task-test.hclonely.com/setting.html

// @require            https://cdn.jsdelivr.net/gh/HCLonely/auto-task@3.2.5/require/require.min.js
// @resource           CSS https://cdn.jsdelivr.net/gh/HCLonely/auto-task@3.2.5/require/fuck-task.min.css

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

/* eslint-disable no-unsafe-finally,no-void,camelcase,no-mixed-operators,no-fallthrough,no-unused-vars,no-new,no-unused-expressions,no-sequences,no-undef-init,no-unused-vars,no-func-assign,no-eval,multiline-ternary */
/* esling-disable security/detect-non-literal-fs-filename */
/* global loadSettings,loadAnnouncement,regeneratorRuntime,checkClick,getURLParameter,showAlert,urlPath,checkUser,Centrifuge,DashboardApp,captchaCheck,commonOptions,VerifyTasks */
function _defineProperty (obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }) } else { obj[key] = value } return obj }

function _slicedToArray (arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest() }

function _nonIterableRest () { throw new TypeError('Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

function _iterableToArrayLimit (arr, i) { if (typeof Symbol === 'undefined' || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break } } catch (err) { _d = true; _e = err } finally { try { if (!_n && _i.return != null) _i.return() } finally { if (_d) throw _e } } return _arr }

function _arrayWithHoles (arr) { if (Array.isArray(arr)) return arr }

function _toConsumableArray (arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread() }

function _nonIterableSpread () { throw new TypeError('Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

function _iterableToArray (iter) { if (typeof Symbol !== 'undefined' && Symbol.iterator in Object(iter)) return Array.from(iter) }

function _arrayWithoutHoles (arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr) }

function _createForOfIteratorHelper (o, allowArrayLike) { var it; if (typeof Symbol === 'undefined' || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === 'number') { if (it) o = it; var i = 0; var F = function F () {}; return { s: F, n: function n () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] } }, e: function e (_e2) { throw _e2 }, f: F } } throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') } var normalCompletion = true; var didErr = false; var err; return { s: function s () { it = o[Symbol.iterator]() }, n: function n () { var step = it.next(); normalCompletion = step.done; return step }, e: function e (_e3) { didErr = true; err = _e3 }, f: function f () { try { if (!normalCompletion && it.return != null) it.return() } finally { if (didErr) throw err } } } }

function _unsupportedIterableToArray (o, minLen) { if (!o) return; if (typeof o === 'string') return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor) n = o.constructor.name; if (n === 'Map' || n === 'Set') return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen) }

function _arrayLikeToArray (arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2 }

function asyncGeneratorStep (gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value } catch (error) { reject(error); return } if (info.done) { resolve(value) } else { Promise.resolve(value).then(_next, _throw) } }

function _asyncToGenerator (fn) { return function () { var self = this; var args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next (value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value) } function _throw (err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err) } _next(undefined) }) } }

try {
  (function () {
    var _config$banana, _config$freegamelotte, _config$gamehag, _config$giveawaysu, _config$givekay, _config$gleam, _config$indiedb, _config$keyhub, _config$marvelousga, _config$opiumpulses, _config$prys, _config$takekey

    var echoLog = function echoLog (e) {
      try {
        var ele = null

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
            ele = $('<li>'.concat(getI18n(e.type), '<a href="https://store.steampowered.com/').concat(e.text.includes('/') ? e.text : 'curator/'.concat(e.text), '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
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

          case 'likeYtbVideo':
          case 'unlikeYtbVideo':
            ele = $('<li>'.concat(getI18n(e.type), '<a href="https://www.youtube.com/watch?v=').concat(e.text, '" target="_blank">').concat(e.text, '</a>...<font></font></li>'))
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
          case 'repostVkWall':
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
          },
          scrollIntoView: function scrollIntoView () {
            this.font[0].scrollIntoView()
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

    var getSteamInfo = function getSteamInfo () {
      try {
        return Object.assign({
          userName: '',
          steam64Id: '',
          communitySessionID: '',
          storeSessionID: '',
          storeUpdateTime: 0,
          communityUpdateTime: 0
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

    var getWhiteList = function getWhiteList () {
      try {
        return Object.assign(defaultConf.whiteList, config.whiteList)
      } catch (e) {
        throwError(e, 'getWhiteList')
      }
    }

    var httpRequest = function httpRequest (options) {
      return new Promise(function (resolve) {
        options.method = options.method.toUpperCase()
        if (options.dataType) options.responseType = options.dataType
        var requestObj = Object.assign({
          timeout: 30000,
          ontimeout: function ontimeout (data) {
            resolve({
              result: 'Error',
              statusText: 'Timeout',
              status: 601,
              data: data,
              options: options
            })
          },
          onabort: function onabort (data) {
            resolve({
              result: 'Error',
              statusText: 'Aborted',
              status: 602,
              data: data,
              options: options
            })
          },
          onerror: function onerror (data) {
            resolve({
              result: 'Error',
              statusText: 'Error',
              status: 603,
              data: data,
              options: options
            })
          },
          onload: function onload (data) {
            resolve({
              result: 'Success',
              statusText: 'Load',
              status: 600,
              data: data,
              options: options
            })
          }
        }, options)
        GM_xmlhttpRequest(requestObj)
      }).then(function (result) {
        if (debug) console.log('发送请求:', result)
        return result
      }).catch(function (error) {
        throwError(error, 'httpRequest')
        if (debug) {
          console.log('发送请求:', {
            errorMsg: error,
            options: options
          })
        }
        return {
          result: 'JsError',
          statusText: 'Error',
          status: 604,
          error: error,
          options: options
        }
      })
    }

    var getFinalUrl = /* #__PURE__ */(function () {
      var _ref = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee (url) {
        var options
        var conf
        var _yield$httpRequest
        var result
        var statusText
        var status
        var data
        var _args = arguments

        return regeneratorRuntime.wrap(function _callee$ (_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options = _args.length > 1 && _args[1] !== undefined ? _args[1] : null
                _context.prev = 1
                conf = Object.assign({
                  url: url,
                  method: 'GET'
                }, options)
                _context.next = 5
                return httpRequest(conf)

              case 5:
                _yield$httpRequest = _context.sent
                result = _yield$httpRequest.result
                statusText = _yield$httpRequest.statusText
                status = _yield$httpRequest.status
                data = _yield$httpRequest.data

                if (!(result === 'Success')) {
                  _context.next = 14
                  break
                }

                return _context.abrupt('return', {
                  result: result,
                  statusText: statusText,
                  status: status,
                  finalUrl: data.finalUrl,
                  url: url
                })

              case 14:
                return _context.abrupt('return', {
                  result: result,
                  statusText: statusText,
                  status: status,
                  url: url
                })

              case 15:
                _context.next = 21
                break

              case 17:
                _context.prev = 17
                _context.t0 = _context.catch(1)
                throwError(_context.t0, 'getFinalUrl')
                return _context.abrupt('return', {
                  result: 'FunctionError',
                  statusText: 'getFinalUrl',
                  status: 605,
                  url: url
                })

              case 21:
              case 'end':
                return _context.stop()
            }
          }
        }, _callee, null, [[1, 17]])
      }))

      return function getFinalUrl (_x) {
        return _ref.apply(this, arguments)
      }
    }())

    var visitLink = /* #__PURE__ */(function () {
      var _ref2 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee2 (url) {
        var options
        var logStatus
        var _yield$getFinalUrl
        var result
        var statusText
        var status
        var _args2 = arguments

        return regeneratorRuntime.wrap(function _callee2$ (_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                options = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {
                  method: 'HEAD'
                }
                _context2.prev = 1
                logStatus = echoLog({
                  type: 'visitLink',
                  text: url
                })
                _context2.next = 5
                return getFinalUrl(url, options)

              case 5:
                _yield$getFinalUrl = _context2.sent
                result = _yield$getFinalUrl.result
                statusText = _yield$getFinalUrl.statusText
                status = _yield$getFinalUrl.status

                if (result === 'Success') {
                  logStatus.warning('Complete')
                } else {
                  logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                }

                _context2.next = 16
                break

              case 12:
                _context2.prev = 12
                _context2.t0 = _context2.catch(1)
                if (debug) console.error(_context2.t0)
                throwError(_context2.t0, 'visitLink')

              case 16:
              case 'end':
                return _context2.stop()
            }
          }
        }, _callee2, null, [[1, 12]])
      }))

      return function visitLink (_x2) {
        return _ref2.apply(this, arguments)
      }
    }())

    var updateSteamCommunityInfo = /* #__PURE__ */(function () {
      var _ref3 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee3 () {
        var logStatus, _yield$httpRequest2, result, statusText, status, data, _data$responseText$ma, _data$responseText$ma2, _data$responseText$ma3, steam64Id, communitySessionID, userName

        return regeneratorRuntime.wrap(function _callee3$ (_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0
                logStatus = echoLog({
                  type: 'updateSteamCommunity'
                })
                _context3.next = 4
                return httpRequest({
                  url: 'https://steamcommunity.com/my',
                  method: 'GET'
                })

              case 4:
                _yield$httpRequest2 = _context3.sent
                result = _yield$httpRequest2.result
                statusText = _yield$httpRequest2.statusText
                status = _yield$httpRequest2.status
                data = _yield$httpRequest2.data

                if (!(result === 'Success')) {
                  _context3.next = 36
                  break
                }

                if (!(data.status === 200)) {
                  _context3.next = 32
                  break
                }

                if (!($(data.responseText).find('a[href*="/login/home"]').length > 0)) {
                  _context3.next = 16
                  break
                }

                logStatus.error('Error:' + getI18n('loginSteamCommunity'), true)
                return _context3.abrupt('return', false)

              case 16:
                steam64Id = (_data$responseText$ma = data.responseText.match(/g_steamID = "(.+?)";/)) === null || _data$responseText$ma === void 0 ? void 0 : _data$responseText$ma[1]
                communitySessionID = (_data$responseText$ma2 = data.responseText.match(/g_sessionID = "(.+?)";/)) === null || _data$responseText$ma2 === void 0 ? void 0 : _data$responseText$ma2[1]
                userName = (_data$responseText$ma3 = data.responseText.match(/steamcommunity.com\/id\/(.+?)\/friends\//)) === null || _data$responseText$ma3 === void 0 ? void 0 : _data$responseText$ma3[1]
                if (steam64Id) steamInfo.steam64Id = steam64Id
                if (userName) steamInfo.userName = userName

                if (!communitySessionID) {
                  _context3.next = 28
                  break
                }

                steamInfo.communitySessionID = communitySessionID
                steamInfo.communityUpdateTime = new Date().getTime()
                logStatus.success()
                return _context3.abrupt('return', true)

              case 28:
                logStatus.error('Error: Get "sessionID" failed')
                return _context3.abrupt('return', false)

              case 30:
                _context3.next = 34
                break

              case 32:
                logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                return _context3.abrupt('return', false)

              case 34:
                _context3.next = 38
                break

              case 36:
                logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                return _context3.abrupt('return', false)

              case 38:
                _context3.next = 43
                break

              case 40:
                _context3.prev = 40
                _context3.t0 = _context3.catch(0)
                throwError(_context3.t0, 'updateSteamCommunityInfo')

              case 43:
              case 'end':
                return _context3.stop()
            }
          }
        }, _callee3, null, [[0, 40]])
      }))

      return function updateSteamCommunityInfo () {
        return _ref3.apply(this, arguments)
      }
    }())

    var updateSteamStoreInfo = /* #__PURE__ */(function () {
      var _ref4 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee4 () {
        var logStatus, _yield$httpRequest3, result, statusText, status, data, _data$responseText$ma4, storeSessionID

        return regeneratorRuntime.wrap(function _callee4$ (_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0
                logStatus = echoLog({
                  type: 'updateSteamStore'
                })
                _context4.next = 4
                return httpRequest({
                  url: 'https://store.steampowered.com/stats/',
                  method: 'GET'
                })

              case 4:
                _yield$httpRequest3 = _context4.sent
                result = _yield$httpRequest3.result
                statusText = _yield$httpRequest3.statusText
                status = _yield$httpRequest3.status
                data = _yield$httpRequest3.data

                if (!(result === 'Success')) {
                  _context4.next = 32
                  break
                }

                if (!(data.status === 200)) {
                  _context4.next = 28
                  break
                }

                if (!($(data.responseText).find('a[href*="/login/"]').length > 0)) {
                  _context4.next = 16
                  break
                }

                logStatus.error('Error:' + getI18n('loginSteamStore'), true)
                return _context4.abrupt('return', false)

              case 16:
                storeSessionID = (_data$responseText$ma4 = data.responseText.match(/g_sessionID = "(.+?)";/)) === null || _data$responseText$ma4 === void 0 ? void 0 : _data$responseText$ma4[1]

                if (!storeSessionID) {
                  _context4.next = 24
                  break
                }

                steamInfo.storeSessionID = storeSessionID
                steamInfo.storeUpdateTime = new Date().getTime()
                logStatus.success()
                return _context4.abrupt('return', true)

              case 24:
                logStatus.error('Error: Get "sessionID" failed')
                return _context4.abrupt('return', false)

              case 26:
                _context4.next = 30
                break

              case 28:
                logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                return _context4.abrupt('return', false)

              case 30:
                _context4.next = 34
                break

              case 32:
                logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                return _context4.abrupt('return', false)

              case 34:
                _context4.next = 39
                break

              case 36:
                _context4.prev = 36
                _context4.t0 = _context4.catch(0)
                throwError(_context4.t0, 'updateSteamStoreInfo')

              case 39:
              case 'end':
                return _context4.stop()
            }
          }
        }, _callee4, null, [[0, 36]])
      }))

      return function updateSteamStoreInfo () {
        return _ref4.apply(this, arguments)
      }
    }())

    var updateSteamInfo = function updateSteamInfo () {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'all'
      var update = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false

      try {
        var pro = []

        if ((new Date().getTime() - steamInfo.communityUpdateTime > 10 * 60 * 1000 || update) && (type === 'community' || type === 'all')) {
          pro.push(updateSteamCommunityInfo())
        }

        if ((new Date().getTime() - steamInfo.storeUpdateTime > 10 * 60 * 1000 || update) && (type === 'store' || type === 'all')) {
          pro.push(updateSteamStoreInfo())
        }

        return Promise.all(pro).then(function (data) {
          GM_setValue('steamInfo', steamInfo)
          var length = data.length

          if (length === 1) {
            return data[0]
          } else if (length === 2) {
            return data[0] && data[1]
          } else {
            return false
          }
        }).catch(function () {
          return false
        })
      } catch (e) {
        throwError(e, 'updateSteamInfo')
      }
    }

    var joinSteamGroup = /* #__PURE__ */(function () {
      var _ref5 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee5 (group) {
        var logStatus, _yield$httpRequest4, result, statusText, status, data

        return regeneratorRuntime.wrap(function _callee5$ (_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0
                logStatus = echoLog({
                  type: 'joinSteamGroup',
                  text: group
                })
                _context5.next = 4
                return httpRequest({
                  url: 'https://steamcommunity.com/groups/' + group,
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                  },
                  data: $.param({
                    action: 'join',
                    sessionID: steamInfo.communitySessionID
                  })
                })

              case 4:
                _yield$httpRequest4 = _context5.sent
                result = _yield$httpRequest4.result
                statusText = _yield$httpRequest4.statusText
                status = _yield$httpRequest4.status
                data = _yield$httpRequest4.data

                if (result === 'Success') {
                  if (data.status === 200 && !data.responseText.includes('grouppage_join_area')) {
                    logStatus.success()
                  } else {
                    logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                  }
                } else {
                  logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                }

                _context5.next = 15
                break

              case 12:
                _context5.prev = 12
                _context5.t0 = _context5.catch(0)
                throwError(_context5.t0, 'joinSteamGroup')

              case 15:
              case 'end':
                return _context5.stop()
            }
          }
        }, _callee5, null, [[0, 12]])
      }))

      return function joinSteamGroup (_x3) {
        return _ref5.apply(this, arguments)
      }
    }())

    var getGroupID = /* #__PURE__ */(function () {
      var _ref6 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee6 (groupName) {
        var logStatus, groupNameToId, _yield$httpRequest5, result, statusText, status, data, _data$responseText$ma5, groupId

        return regeneratorRuntime.wrap(function _callee6$ (_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0
                logStatus = echoLog({
                  type: 'getSteamGroupId',
                  text: groupName
                })
                groupNameToId = GM_getValue('groupNameToId') || {}

                if (!groupNameToId[groupName]) {
                  _context6.next = 8
                  break
                }

                logStatus.success()
                return _context6.abrupt('return', groupNameToId[groupName])

              case 8:
                _context6.next = 10
                return httpRequest({
                  url: 'https://steamcommunity.com/groups/' + groupName,
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                  }
                })

              case 10:
                _yield$httpRequest5 = _context6.sent
                result = _yield$httpRequest5.result
                statusText = _yield$httpRequest5.statusText
                status = _yield$httpRequest5.status
                data = _yield$httpRequest5.data

                if (!(result === 'Success')) {
                  _context6.next = 33
                  break
                }

                if (!(data.status === 200)) {
                  _context6.next = 29
                  break
                }

                groupId = (_data$responseText$ma5 = data.responseText.match(/OpenGroupChat\( '([0-9]+)'/)) === null || _data$responseText$ma5 === void 0 ? void 0 : _data$responseText$ma5[1]

                if (!groupId) {
                  _context6.next = 25
                  break
                }

                logStatus.success()
                groupNameToId[groupName] = groupId
                GM_setValue('groupNameToId', groupNameToId)
                return _context6.abrupt('return', groupId)

              case 25:
                logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                return _context6.abrupt('return', false)

              case 27:
                _context6.next = 31
                break

              case 29:
                logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                return _context6.abrupt('return', false)

              case 31:
                _context6.next = 35
                break

              case 33:
                logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                return _context6.abrupt('return', false)

              case 35:
                _context6.next = 40
                break

              case 37:
                _context6.prev = 37
                _context6.t0 = _context6.catch(0)
                throwError(_context6.t0, 'getGroupID')

              case 40:
              case 'end':
                return _context6.stop()
            }
          }
        }, _callee6, null, [[0, 37]])
      }))

      return function getGroupID (_x4) {
        return _ref6.apply(this, arguments)
      }
    }())

    var leaveSteamGroup = /* #__PURE__ */(function () {
      var _ref7 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee7 (groupName) {
        var groupId, logStatus, _yield$httpRequest6, result, statusText, status, data

        return regeneratorRuntime.wrap(function _callee7$ (_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0

                if (!(whiteList.enable && whiteList.steam.group.includes(groupName))) {
                  _context7.next = 3
                  break
                }

                return _context7.abrupt('return', {
                  result: 'Skiped',
                  statusText: 'OK',
                  status: 605
                })

              case 3:
                _context7.next = 5
                return getGroupID(groupName)

              case 5:
                groupId = _context7.sent

                if (groupId) {
                  _context7.next = 8
                  break
                }

                return _context7.abrupt('return')

              case 8:
                logStatus = echoLog({
                  type: 'leaveSteamGroup',
                  text: groupName
                })
                _context7.next = 11
                return httpRequest({
                  url: 'https://steamcommunity.com/id/' + steamInfo.userName + '/home_process',
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                  },
                  data: $.param({
                    sessionID: steamInfo.communitySessionID,
                    action: 'leaveGroup',
                    groupId: groupId
                  })
                })

              case 11:
                _yield$httpRequest6 = _context7.sent
                result = _yield$httpRequest6.result
                statusText = _yield$httpRequest6.statusText
                status = _yield$httpRequest6.status
                data = _yield$httpRequest6.data

                if (result === 'Success') {
                  if (data.status === 200 && data.finalUrl.includes('groups') && $(data.responseText.toLowerCase()).find("a[href='https://steamcommunity.com/groups/".concat(groupName.toLowerCase(), "']")).length === 0) {
                    logStatus.success()
                  } else {
                    logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                  }
                } else {
                  logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                }

                _context7.next = 22
                break

              case 19:
                _context7.prev = 19
                _context7.t0 = _context7.catch(0)
                throwError(_context7.t0, 'leaveSteamGroup')

              case 22:
              case 'end':
                return _context7.stop()
            }
          }
        }, _callee7, null, [[0, 19]])
      }))

      return function leaveSteamGroup (_x5) {
        return _ref7.apply(this, arguments)
      }
    }())

    var toggleCurator = /* #__PURE__ */(function () {
      var _ref8 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee8 (curatorId) {
        var follow
        var logStatus
        var _yield$httpRequest7
        var result
        var statusText
        var status
        var data
        var _data$response
        var _data$response$succes
        var _data$response2
        var _args8 = arguments

        return regeneratorRuntime.wrap(function _callee8$ (_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                follow = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : true
                logStatus = _args8.length > 2 && _args8[2] !== undefined ? _args8[2] : null
                _context8.prev = 2

                if (!(whiteList.enable && !follow && whiteList.steam.curator.includes(curatorId))) {
                  _context8.next = 5
                  break
                }

                return _context8.abrupt('return', {
                  result: 'Skiped',
                  statusText: 'OK',
                  status: 605
                })

              case 5:
                logStatus = logStatus || echoLog({
                  type: follow ? 'followCurator' : 'unfollowCurator',
                  text: curatorId
                })
                _context8.next = 8
                return httpRequest({
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
                  dataType: 'json'
                })

              case 8:
                _yield$httpRequest7 = _context8.sent
                result = _yield$httpRequest7.result
                statusText = _yield$httpRequest7.statusText
                status = _yield$httpRequest7.status
                data = _yield$httpRequest7.data

                if (result === 'Success') {
                  if (data.status === 200 && ((_data$response = data.response) === null || _data$response === void 0 ? void 0 : (_data$response$succes = _data$response.success) === null || _data$response$succes === void 0 ? void 0 : _data$response$succes.success) === 1) {
                    logStatus.success()
                  } else {
                    logStatus.error('Error:' + data.statusText + '(' + ((_data$response2 = data.response) === null || _data$response2 === void 0 ? void 0 : _data$response2.success) || data.status + ')')
                  }
                } else {
                  logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                }

                _context8.next = 19
                break

              case 16:
                _context8.prev = 16
                _context8.t0 = _context8.catch(2)
                throwError(_context8.t0, 'toggleCurator')

              case 19:
              case 'end':
                return _context8.stop()
            }
          }
        }, _callee8, null, [[2, 16]])
      }))

      return function toggleCurator (_x6) {
        return _ref8.apply(this, arguments)
      }
    }())

    var getCuratorID = /* #__PURE__ */(function () {
      var _ref9 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee9 (developerName, path) {
        var logStatus, developerNameToId, _yield$httpRequest8, result, statusText, status, data, _data$responseText$ma6, developerId

        return regeneratorRuntime.wrap(function _callee9$ (_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.prev = 0
                logStatus = echoLog({
                  type: 'getCuratorId',
                  text: ''.concat(path, '/').concat(developerName)
                })
                developerNameToId = GM_getValue('developerNameToId') || {}

                if (!developerNameToId[developerName]) {
                  _context9.next = 8
                  break
                }

                logStatus.success()
                return _context9.abrupt('return', developerNameToId[developerName])

              case 8:
                _context9.next = 10
                return httpRequest({
                  url: 'https://store.steampowered.com/'.concat(path, '/').concat(developerName),
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                  }
                })

              case 10:
                _yield$httpRequest8 = _context9.sent
                result = _yield$httpRequest8.result
                statusText = _yield$httpRequest8.statusText
                status = _yield$httpRequest8.status
                data = _yield$httpRequest8.data

                if (!(result === 'Success')) {
                  _context9.next = 33
                  break
                }

                if (!(data.status === 200)) {
                  _context9.next = 29
                  break
                }

                developerId = (_data$responseText$ma6 = data.responseText.match(/g_pagingData.*?"clanid":([\d]+)/)) === null || _data$responseText$ma6 === void 0 ? void 0 : _data$responseText$ma6[1]

                if (!developerId) {
                  _context9.next = 25
                  break
                }

                logStatus.success()
                developerNameToId[developerName] = developerId
                GM_setValue('developerNameToId', developerNameToId)
                return _context9.abrupt('return', developerId)

              case 25:
                logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                return _context9.abrupt('return', false)

              case 27:
                _context9.next = 31
                break

              case 29:
                logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                return _context9.abrupt('return', false)

              case 31:
                _context9.next = 35
                break

              case 33:
                logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                return _context9.abrupt('return', false)

              case 35:
                _context9.next = 40
                break

              case 37:
                _context9.prev = 37
                _context9.t0 = _context9.catch(0)
                throwError(_context9.t0, 'getCuratorID')

              case 40:
              case 'end':
                return _context9.stop()
            }
          }
        }, _callee9, null, [[0, 37]])
      }))

      return function getCuratorID (_x7, _x8) {
        return _ref9.apply(this, arguments)
      }
    }())

    var toggleOtherCurator = /* #__PURE__ */(function () {
      var _ref10 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee10 (name, path) {
        var follow
        var curatorId
        var logStatus
        var _args10 = arguments
        return regeneratorRuntime.wrap(function _callee10$ (_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                follow = _args10.length > 2 && _args10[2] !== undefined ? _args10[2] : true
                _context10.prev = 1

                if (!(whiteList.enable && !follow && whiteList.steam.otherCurator.includes(name))) {
                  _context10.next = 4
                  break
                }

                return _context10.abrupt('return', {
                  result: 'Skiped',
                  statusText: 'OK',
                  status: 605
                })

              case 4:
                _context10.next = 6
                return getCuratorID(name, path)

              case 6:
                curatorId = _context10.sent

                if (curatorId) {
                  logStatus = echoLog({
                    type: ''.concat(follow ? '' : 'un', 'follow').concat(path.replace(/^\S/, function (s) {
                      return s.toUpperCase()
                    })),
                    text: name
                  })
                  toggleCurator(curatorId, follow, logStatus)
                }

                _context10.next = 13
                break

              case 10:
                _context10.prev = 10
                _context10.t0 = _context10.catch(1)
                throwError(_context10.t0, 'toggleOtherCurator')

              case 13:
              case 'end':
                return _context10.stop()
            }
          }
        }, _callee10, null, [[1, 10]])
      }))

      return function toggleOtherCurator (_x9, _x10) {
        return _ref10.apply(this, arguments)
      }
    }())

    var addWishlist = /* #__PURE__ */(function () {
      var _ref11 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee11 (gameId) {
        var _data$response3, logStatus, _yield$httpRequest9, result, data, _yield$httpRequest10, resultR, statusTextR, statusR, dataR

        return regeneratorRuntime.wrap(function _callee11$ (_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.prev = 0
                logStatus = echoLog({
                  type: 'addWishlist',
                  text: gameId
                })
                _context11.next = 4
                return httpRequest({
                  url: 'https://store.steampowered.com/api/addtowishlist',
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                  },
                  data: $.param({
                    sessionid: steamInfo.storeSessionID,
                    appid: gameId
                  }),
                  dataType: 'json'
                })

              case 4:
                _yield$httpRequest9 = _context11.sent
                result = _yield$httpRequest9.result
                data = _yield$httpRequest9.data

                if (!(result === 'Success' && data.status === 200 && ((_data$response3 = data.response) === null || _data$response3 === void 0 ? void 0 : _data$response3.success) === true)) {
                  _context11.next = 9
                  break
                }

                return _context11.abrupt('return', logStatus.success())

              case 9:
                _context11.next = 11
                return httpRequest({
                  url: 'https://store.steampowered.com/app/' + gameId,
                  method: 'GET'
                })

              case 11:
                _yield$httpRequest10 = _context11.sent
                resultR = _yield$httpRequest10.result
                statusTextR = _yield$httpRequest10.statusText
                statusR = _yield$httpRequest10.status
                dataR = _yield$httpRequest10.data

                if (resultR === 'Success') {
                  if (dataR.status === 200) {
                    if (dataR.responseText.includes('class="queue_actions_ctn"') && dataR.responseText.includes('已在库中')) {
                      logStatus.success()
                    } else if (dataR.responseText.includes('class="queue_actions_ctn"') && dataR.responseText.includes('添加至您的愿望单') || !dataR.responseText.includes('class="queue_actions_ctn"')) {
                      logStatus.error('Error:' + dataR.statusText + '(' + dataR.status + ')')
                    } else {
                      logStatus.success()
                    }
                  } else {
                    logStatus.error('Error:' + dataR.statusText + '(' + dataR.status + ')')
                  }
                } else {
                  logStatus.error(''.concat(resultR, ':').concat(statusTextR, '(').concat(statusR, ')'))
                }

                _context11.next = 22
                break

              case 19:
                _context11.prev = 19
                _context11.t0 = _context11.catch(0)
                throwError(_context11.t0, 'addWishlist')

              case 22:
              case 'end':
                return _context11.stop()
            }
          }
        }, _callee11, null, [[0, 19]])
      }))

      return function addWishlist (_x11) {
        return _ref11.apply(this, arguments)
      }
    }())

    var removeWishlist = /* #__PURE__ */(function () {
      var _ref12 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee12 (gameId) {
        var _data$response4, logStatus, _yield$httpRequest11, result, data, _yield$httpRequest12, resultR, statusTextR, statusR, dataR

        return regeneratorRuntime.wrap(function _callee12$ (_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.prev = 0

                if (!(whiteList.enable && whiteList.steam.wishlist.includes(gameId))) {
                  _context12.next = 3
                  break
                }

                return _context12.abrupt('return', {
                  result: 'Skiped',
                  statusText: 'OK',
                  status: 605
                })

              case 3:
                logStatus = echoLog({
                  type: 'removeWishlist',
                  text: gameId
                })
                _context12.next = 6
                return httpRequest({
                  url: 'https://store.steampowered.com/api/removefromwishlist',
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                  },
                  data: $.param({
                    sessionid: steamInfo.storeSessionID,
                    appid: gameId
                  }),
                  dataType: 'json'
                })

              case 6:
                _yield$httpRequest11 = _context12.sent
                result = _yield$httpRequest11.result
                data = _yield$httpRequest11.data

                if (!(result === 'Success' && data.status === 200 && ((_data$response4 = data.response) === null || _data$response4 === void 0 ? void 0 : _data$response4.success) === true)) {
                  _context12.next = 11
                  break
                }

                return _context12.abrupt('return', logStatus.success())

              case 11:
                _context12.next = 13
                return httpRequest({
                  url: 'https://store.steampowered.com/app/' + gameId,
                  method: 'GET'
                })

              case 13:
                _yield$httpRequest12 = _context12.sent
                resultR = _yield$httpRequest12.result
                statusTextR = _yield$httpRequest12.statusText
                statusR = _yield$httpRequest12.status
                dataR = _yield$httpRequest12.data

                if (resultR === 'Success') {
                  if (dataR.status === 200) {
                    if (dataR.responseText.includes('class="queue_actions_ctn"') && (dataR.responseText.includes('已在库中') || dataR.responseText.includes('添加至您的愿望单'))) {
                      logStatus.success()
                    } else {
                      logStatus.error('Error:' + dataR.statusText + '(' + dataR.status + ')')
                    }
                  } else {
                    logStatus.error('Error:' + dataR.statusText + '(' + dataR.status + ')')
                  }
                } else {
                  logStatus.error(''.concat(resultR, ':').concat(statusTextR, '(').concat(statusR, ')'))
                }

                _context12.next = 24
                break

              case 21:
                _context12.prev = 21
                _context12.t0 = _context12.catch(0)
                throwError(_context12.t0, 'removeWishlist')

              case 24:
              case 'end':
                return _context12.stop()
            }
          }
        }, _callee12, null, [[0, 21]])
      }))

      return function removeWishlist (_x12) {
        return _ref12.apply(this, arguments)
      }
    }())

    var toggleGame = /* #__PURE__ */(function () {
      var _ref13 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee13 (gameId, follow) {
        var logStatus, requestData, _yield$httpRequest13, result, data, _yield$httpRequest14, resultR, statusTextR, statusR, dataR

        return regeneratorRuntime.wrap(function _callee13$ (_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.prev = 0

                if (!(whiteList.enable && !follow && whiteList.steam.game.includes(gameId))) {
                  _context13.next = 3
                  break
                }

                return _context13.abrupt('return', {
                  result: 'Skiped',
                  statusText: 'OK',
                  status: 605
                })

              case 3:
                logStatus = echoLog({
                  type: ''.concat(follow ? '' : 'un', 'followGame'),
                  text: gameId
                })
                requestData = {
                  sessionid: steamInfo.storeSessionID,
                  appid: gameId
                }
                if (!follow) requestData.unfollow = '1'
                _context13.next = 8
                return httpRequest({
                  url: 'https://store.steampowered.com/explore/followgame/',
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                  },
                  data: $.param(requestData)
                })

              case 8:
                _yield$httpRequest13 = _context13.sent
                result = _yield$httpRequest13.result
                data = _yield$httpRequest13.data

                if (!(result === 'Success' && data.status === 200 && data.responseText === 'true')) {
                  _context13.next = 13
                  break
                }

                return _context13.abrupt('return', logStatus.success())

              case 13:
                _context13.next = 15
                return httpRequest({
                  url: 'https://store.steampowered.com/app/' + gameId,
                  method: 'GET'
                })

              case 15:
                _yield$httpRequest14 = _context13.sent
                resultR = _yield$httpRequest14.result
                statusTextR = _yield$httpRequest14.statusText
                statusR = _yield$httpRequest14.status
                dataR = _yield$httpRequest14.data

                if (resultR === 'Success') {
                  if (dataR.status === 200) {
                    if (follow && dataR.responseText.includes('class="queue_actions_ctn"') && dataR.responseText.includes('class="btnv6_blue_hoverfade btn_medium queue_btn_active" style="">') || !follow && !(dataR.responseText.includes('class="queue_actions_ctn"') && dataR.responseText.includes('class="btnv6_blue_hoverfade btn_medium queue_btn_active" style="">'))) {
                      logStatus.success()
                    } else {
                      logStatus.error('Error:' + dataR.statusText + '(' + dataR.status + ')')
                    }
                  } else {
                    logStatus.error('Error:' + dataR.statusText + '(' + dataR.status + ')')
                  }
                } else {
                  logStatus.error(''.concat(resultR, ':').concat(statusTextR, '(').concat(statusR, ')'))
                }

                _context13.next = 26
                break

              case 23:
                _context13.prev = 23
                _context13.t0 = _context13.catch(0)
                throwError(_context13.t0, 'toggleGame')

              case 26:
              case 'end':
                return _context13.stop()
            }
          }
        }, _callee13, null, [[0, 23]])
      }))

      return function toggleGame (_x13, _x14) {
        return _ref13.apply(this, arguments)
      }
    }())

    var likeAnnouncements = /* #__PURE__ */(function () {
      var _ref14 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee14 (rawMatch) {
        var url, logStatus, requestData, _yield$httpRequest15, result, statusText, status, data, _data$response5, _data$response6, _data$response7

        return regeneratorRuntime.wrap(function _callee14$ (_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.prev = 0
                url = '', logStatus = null, requestData = {}

                if (rawMatch.length === 5) {
                  logStatus = echoLog({
                    type: 'likeAnnouncements',
                    url: rawMatch[1],
                    id: rawMatch[2]
                  })
                  url = 'https://store.steampowered.com/updated/ajaxrateupdate/' + rawMatch[2]
                  requestData = {
                    sessionid: steamInfo.storeSessionID,
                    wgauthtoken: rawMatch[3],
                    voteup: 1,
                    clanid: rawMatch[4],
                    ajax: 1
                  }
                } else {
                  logStatus = echoLog({
                    type: 'likeAnnouncements',
                    url: rawMatch.input,
                    id: rawMatch[1]
                  })
                  url = rawMatch.input.replace('/detail/', '/rate/')
                  requestData = {
                    sessionid: steamInfo.communitySessionID,
                    voteup: true
                  }
                }

                _context14.next = 5
                return httpRequest({
                  url: url,
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                  },
                  data: $.param(requestData),
                  dataType: 'json'
                })

              case 5:
                _yield$httpRequest15 = _context14.sent
                result = _yield$httpRequest15.result
                statusText = _yield$httpRequest15.statusText
                status = _yield$httpRequest15.status
                data = _yield$httpRequest15.data

                if (result === 'Success') {
                  if (data.status === 200 && ((_data$response5 = data.response) === null || _data$response5 === void 0 ? void 0 : _data$response5.success) === 1) {
                    logStatus.success()
                  } else {
                    logStatus.error('Error:' + (((_data$response6 = data.response) === null || _data$response6 === void 0 ? void 0 : _data$response6.msg) || data.statusText) + '(' + (((_data$response7 = data.response) === null || _data$response7 === void 0 ? void 0 : _data$response7.success) || data.status) + ')')
                  }
                } else {
                  logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                }

                _context14.next = 16
                break

              case 13:
                _context14.prev = 13
                _context14.t0 = _context14.catch(0)
                throwError(_context14.t0, 'likeAnnouncements')

              case 16:
              case 'end':
                return _context14.stop()
            }
          }
        }, _callee14, null, [[0, 13]])
      }))

      return function likeAnnouncements (_x15) {
        return _ref14.apply(this, arguments)
      }
    }())

    var toggleForum = /* #__PURE__ */(function () {
      var _ref15 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee15 (gameId) {
        var subscribe
        var forumId
        var logStatus
        var _yield$httpRequest16
        var result
        var statusText
        var status
        var data
        var _data$response8
        var _data$response9
        var _args15 = arguments

        return regeneratorRuntime.wrap(function _callee15$ (_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                subscribe = _args15.length > 1 && _args15[1] !== undefined ? _args15[1] : true
                _context15.prev = 1

                if (!(whiteList.enable && whiteList.steam.forum.includes(gameId))) {
                  _context15.next = 4
                  break
                }

                return _context15.abrupt('return', {
                  result: 'Skiped',
                  statusText: 'OK',
                  status: 605
                })

              case 4:
                _context15.next = 6
                return getForumId(gameId)

              case 6:
                forumId = _context15.sent

                if (forumId) {
                  _context15.next = 9
                  break
                }

                return _context15.abrupt('return')

              case 9:
                logStatus = echoLog({
                  type: ''.concat(subscribe ? '' : 'un', 'subscribeForum'),
                  text: gameId
                })
                _context15.next = 12
                return httpRequest({
                  url: 'https://steamcommunity.com/forum/'.concat(forumId, '/General/').concat(subscribe ? '' : 'un', 'subscribe/0/'),
                  method: 'POST',
                  responseType: 'json',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                  },
                  data: $.param({
                    sessionid: steamInfo.communitySessionID
                  })
                })

              case 12:
                _yield$httpRequest16 = _context15.sent
                result = _yield$httpRequest16.result
                statusText = _yield$httpRequest16.statusText
                status = _yield$httpRequest16.status
                data = _yield$httpRequest16.data

                if (result === 'Success') {
                  if (data.status === 200 && (((_data$response8 = data.response) === null || _data$response8 === void 0 ? void 0 : _data$response8.success) === 1 || ((_data$response9 = data.response) === null || _data$response9 === void 0 ? void 0 : _data$response9.success) === 29)) {
                    logStatus.success()
                  } else {
                    logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                  }
                } else {
                  logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                }

                _context15.next = 23
                break

              case 20:
                _context15.prev = 20
                _context15.t0 = _context15.catch(1)
                throwError(_context15.t0, 'subscribeForum')

              case 23:
              case 'end':
                return _context15.stop()
            }
          }
        }, _callee15, null, [[1, 20]])
      }))

      return function toggleForum (_x16) {
        return _ref15.apply(this, arguments)
      }
    }())

    var getForumId = /* #__PURE__ */(function () {
      var _ref16 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee16 (gameId) {
        var logStatus, _yield$httpRequest17, result, statusText, status, data, _data$responseText, _data$responseText$ma7, forumId

        return regeneratorRuntime.wrap(function _callee16$ (_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                _context16.prev = 0
                logStatus = echoLog({
                  type: 'getForumId',
                  text: gameId
                })
                _context16.next = 4
                return httpRequest({
                  url: 'https://steamcommunity.com/app/' + gameId + '/discussions/',
                  method: 'GET'
                })

              case 4:
                _yield$httpRequest17 = _context16.sent
                result = _yield$httpRequest17.result
                statusText = _yield$httpRequest17.statusText
                status = _yield$httpRequest17.status
                data = _yield$httpRequest17.data

                if (!(result === 'Success')) {
                  _context16.next = 20
                  break
                }

                if (!(data.status === 200)) {
                  _context16.next = 16
                  break
                }

                forumId = (_data$responseText = data.responseText) === null || _data$responseText === void 0 ? void 0 : (_data$responseText$ma7 = _data$responseText.match(/General_([\d]+)/)) === null || _data$responseText$ma7 === void 0 ? void 0 : _data$responseText$ma7[1]

                if (forumId) {
                  logStatus.success()
                } else {
                  logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                }

                return _context16.abrupt('return', forumId)

              case 16:
                logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                return _context16.abrupt('return', false)

              case 18:
                _context16.next = 22
                break

              case 20:
                logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                return _context16.abrupt('return', false)

              case 22:
                _context16.next = 27
                break

              case 24:
                _context16.prev = 24
                _context16.t0 = _context16.catch(0)
                throwError(_context16.t0, 'getForumId')

              case 27:
              case 'end':
                return _context16.stop()
            }
          }
        }, _callee16, null, [[0, 24]])
      }))

      return function getForumId (_x17) {
        return _ref16.apply(this, arguments)
      }
    }())

    var toggleSteamActions = /* #__PURE__ */(function () {
      var _ref18 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee17 (_ref17) {
        var website, type, elements, action, _ref17$toFinalUrl, toFinalUrl, pro, _iterator, _step, _elementName, element, elementName, toFinalUrlElement

        return regeneratorRuntime.wrap(function _callee17$ (_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                website = _ref17.website, type = _ref17.type, elements = _ref17.elements, action = _ref17.action, _ref17$toFinalUrl = _ref17.toFinalUrl, toFinalUrl = _ref17$toFinalUrl === void 0 ? {} : _ref17$toFinalUrl
                _context17.prev = 1
                pro = []
                _iterator = _createForOfIteratorHelper(unique(elements))
                _context17.prev = 4

                _iterator.s()

              case 6:
                if ((_step = _iterator.n()).done) {
                  _context17.next = 47
                  break
                }

                element = _step.value
                elementName = Array.isArray(element) ? [null].concat(_toConsumableArray(element)) : [null, element]

                if (!(website === 'giveawaysu' && toFinalUrl[element])) {
                  _context17.next = 25
                  break
                }

                toFinalUrlElement = toFinalUrl[element] || ''
                _context17.t0 = type
                _context17.next = _context17.t0 === 'group' ? 14 : _context17.t0 === 'forum' ? 16 : _context17.t0 === 'curator' ? 18 : _context17.t0 === 'publisher' ? 18 : _context17.t0 === 'developer' ? 18 : _context17.t0 === 'franchise' ? 18 : _context17.t0 === 'game' ? 21 : _context17.t0 === 'wishlist' ? 21 : _context17.t0 === 'announcement' ? 23 : 25
                break

              case 14:
                elementName = toFinalUrlElement.match(/groups\/(.+)\/?/)
                return _context17.abrupt('break', 25)

              case 16:
                elementName = toFinalUrlElement.match(/app\/([\d]+)/)
                return _context17.abrupt('break', 25)

              case 18:
                elementName = toFinalUrlElement.match(/curator\/([\d]+)/)

                if (elementName) {
                  type = 'curator'
                } else {
                  elementName = (toFinalUrlElement.includes('publisher') ? toFinalUrlElement.match(/publisher\/(.+)\/?/) : toFinalUrlElement.includes('developer') ? toFinalUrlElement.match(/developer\/(.+)\/?/) : toFinalUrlElement.match(/pub\/(.+)\/?/) || toFinalUrlElement.match(/dev\/(.+)\/?/)) || toFinalUrlElement.match(/franchise\/(.+)\/?/)
                }

                return _context17.abrupt('break', 25)

              case 21:
                elementName = toFinalUrlElement.match(/app\/([\d]+)/)
                return _context17.abrupt('break', 25)

              case 23:
                if (toFinalUrlElement.includes('announcements/detail')) {
                  elementName = toFinalUrlElement.match(/announcements\/detail\/([\d]+)/)
                } else {
                  elementName = toFinalUrlElement.match(/(https?:\/\/store\.steampowered\.com\/newshub\/app\/[\d]+\/view\/([\d]+))\?authwgtoken=(.+?)&clanid=(.+)/)
                }

                return _context17.abrupt('break', 25)

              case 25:
                if (!((_elementName = elementName) === null || _elementName === void 0 ? void 0 : _elementName[1])) {
                  _context17.next = 43
                  break
                }

                _context17.t1 = type
                _context17.next = _context17.t1 === 'group' ? 29 : _context17.t1 === 'forum' ? 31 : _context17.t1 === 'curator' ? 33 : _context17.t1 === 'publisher' ? 35 : _context17.t1 === 'franchise' ? 35 : _context17.t1 === 'developer' ? 35 : _context17.t1 === 'wishlist' ? 37 : _context17.t1 === 'game' ? 39 : _context17.t1 === 'announcement' ? 41 : 43
                break

              case 29:
                pro.push(action === 'fuck' ? joinSteamGroup(elementName[1]) : leaveSteamGroup(elementName[1]))
                return _context17.abrupt('break', 43)

              case 31:
                pro.push(toggleForum(elementName[1], action === 'fuck'))
                return _context17.abrupt('break', 43)

              case 33:
                pro.push(toggleCurator(elementName[1], action === 'fuck'))
                return _context17.abrupt('break', 43)

              case 35:
                pro.push(toggleOtherCurator(elementName[1], type, action === 'fuck'))
                return _context17.abrupt('break', 43)

              case 37:
                pro.push(action === 'fuck' ? addWishlist(elementName[1]) : removeWishlist(elementName[1]))
                return _context17.abrupt('break', 43)

              case 39:
                pro.push(toggleGame(elementName[1], action === 'fuck'))
                return _context17.abrupt('break', 43)

              case 41:
                pro.push(likeAnnouncements(elementName))
                return _context17.abrupt('break', 43)

              case 43:
                _context17.next = 45
                return delay(1000)

              case 45:
                _context17.next = 6
                break

              case 47:
                _context17.next = 52
                break

              case 49:
                _context17.prev = 49
                _context17.t2 = _context17.catch(4)

                _iterator.e(_context17.t2)

              case 52:
                _context17.prev = 52

                _iterator.f()

                return _context17.finish(52)

              case 55:
                return _context17.abrupt('return', Promise.all(pro))

              case 58:
                _context17.prev = 58
                _context17.t3 = _context17.catch(1)
                throwError(_context17.t3, 'toggleSteamActions')

              case 61:
              case 'end':
                return _context17.stop()
            }
          }
        }, _callee17, null, [[1, 58], [4, 49, 52, 55]])
      }))

      return function toggleSteamActions (_x18) {
        return _ref18.apply(this, arguments)
      }
    }())

    var verifyDiscordAuth = /* #__PURE__ */(function () {
      var _ref19 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee18 () {
        var logStatus, _yield$httpRequest18, result, statusText, status, data

        return regeneratorRuntime.wrap(function _callee18$ (_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                _context18.prev = 0
                logStatus = echoLog({
                  type: 'verifyDiscordAuth'
                })
                _context18.next = 4
                return httpRequest({
                  url: 'https://discord.com/api/v6/users/@me',
                  method: 'HEAD',
                  headers: {
                    authorization: discordInfo.authorization
                  }
                })

              case 4:
                _yield$httpRequest18 = _context18.sent
                result = _yield$httpRequest18.result
                statusText = _yield$httpRequest18.statusText
                status = _yield$httpRequest18.status
                data = _yield$httpRequest18.data

                if (!(result === 'Success')) {
                  _context18.next = 19
                  break
                }

                if (!(data.status === 200)) {
                  _context18.next = 15
                  break
                }

                logStatus.success()
                return _context18.abrupt('return', true)

              case 15:
                logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                return _context18.abrupt('return', false)

              case 17:
                _context18.next = 21
                break

              case 19:
                logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                return _context18.abrupt('return', false)

              case 21:
                _context18.next = 27
                break

              case 23:
                _context18.prev = 23
                _context18.t0 = _context18.catch(0)
                throwError(_context18.t0, 'verifyDiscordAuth')
                return _context18.abrupt('return', false)

              case 27:
              case 'end':
                return _context18.stop()
            }
          }
        }, _callee18, null, [[0, 23]])
      }))

      return function verifyDiscordAuth () {
        return _ref19.apply(this, arguments)
      }
    }())

    var joinDiscordServer = /* #__PURE__ */(function () {
      var _ref20 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee19 (inviteId) {
        var logStatus, _yield$httpRequest19, result, statusText, status, data, _data$response10, _data$response10$guil

        return regeneratorRuntime.wrap(function _callee19$ (_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                _context19.prev = 0
                logStatus = echoLog({
                  type: 'joinDiscordServer',
                  text: inviteId
                })
                _context19.next = 4
                return httpRequest({
                  url: 'https://discord.com/api/v6/invites/' + inviteId,
                  method: 'POST',
                  dataType: 'json',
                  headers: {
                    authorization: discordInfo.authorization
                  }
                })

              case 4:
                _yield$httpRequest19 = _context19.sent
                result = _yield$httpRequest19.result
                statusText = _yield$httpRequest19.statusText
                status = _yield$httpRequest19.status
                data = _yield$httpRequest19.data

                if (!(result === 'Success' && data.status === 200)) {
                  _context19.next = 14
                  break
                }

                logStatus.success()
                return _context19.abrupt('return', {
                  result: result,
                  statusText: data.statusText,
                  status: data.status,
                  guild: [inviteId, (_data$response10 = data.response) === null || _data$response10 === void 0 ? void 0 : (_data$response10$guil = _data$response10.guild) === null || _data$response10$guil === void 0 ? void 0 : _data$response10$guil.id]
                })

              case 14:
                logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                return _context19.abrupt('return', {
                  result: result,
                  statusText: (data === null || data === void 0 ? void 0 : data.statusText) || statusText,
                  status: (data === null || data === void 0 ? void 0 : data.status) || status
                })

              case 16:
                _context19.next = 21
                break

              case 18:
                _context19.prev = 18
                _context19.t0 = _context19.catch(0)
                throwError(_context19.t0, 'joinDiscordServer')

              case 21:
              case 'end':
                return _context19.stop()
            }
          }
        }, _callee19, null, [[0, 18]])
      }))

      return function joinDiscordServer (_x19) {
        return _ref20.apply(this, arguments)
      }
    }())

    var leaveDiscordServer = /* #__PURE__ */(function () {
      var _ref21 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee20 (inviteId, guild) {
        var logStatus, _yield$httpRequest20, result, statusText, status, data

        return regeneratorRuntime.wrap(function _callee20$ (_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                _context20.prev = 0

                if (!(whiteList.enable && whiteList.discord.server.includes(inviteId))) {
                  _context20.next = 3
                  break
                }

                return _context20.abrupt('return', {
                  result: 'Skiped',
                  statusText: 'OK',
                  status: 605
                })

              case 3:
                logStatus = echoLog({
                  type: 'leaveDiscordServer',
                  text: inviteId
                })
                _context20.next = 6
                return httpRequest({
                  url: 'https://discord.com/api/v6/users/@me/guilds/' + guild,
                  method: 'DELETE',
                  headers: {
                    authorization: discordInfo.authorization
                  }
                })

              case 6:
                _yield$httpRequest20 = _context20.sent
                result = _yield$httpRequest20.result
                statusText = _yield$httpRequest20.statusText
                status = _yield$httpRequest20.status
                data = _yield$httpRequest20.data

                if (!(result === 'Success' && data.status === 204)) {
                  _context20.next = 16
                  break
                }

                logStatus.success()
                return _context20.abrupt('return', {
                  result: result,
                  statusText: data.statusText,
                  status: data.status
                })

              case 16:
                logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                return _context20.abrupt('return', {
                  result: result,
                  statusText: (data === null || data === void 0 ? void 0 : data.statusText) || statusText,
                  status: (data === null || data === void 0 ? void 0 : data.status) || status
                })

              case 18:
                _context20.next = 23
                break

              case 20:
                _context20.prev = 20
                _context20.t0 = _context20.catch(0)
                throwError(_context20.t0, 'leaveDiscordServer')

              case 23:
              case 'end':
                return _context20.stop()
            }
          }
        }, _callee20, null, [[0, 20]])
      }))

      return function leaveDiscordServer (_x20, _x21) {
        return _ref21.apply(this, arguments)
      }
    }())

    var toggleDiscordActions = /* #__PURE__ */(function () {
      var _ref23 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee21 (_ref22) {
        var website, elements, action, _ref22$toFinalUrl, toFinalUrl, _ref22$toGuild, toGuild, verifyResult, pro, _iterator2, _step2, element, inviteId, _toFinalUrlElement$ma, toFinalUrlElement, guild

        return regeneratorRuntime.wrap(function _callee21$ (_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                website = _ref22.website, elements = _ref22.elements, action = _ref22.action, _ref22$toFinalUrl = _ref22.toFinalUrl, toFinalUrl = _ref22$toFinalUrl === void 0 ? {} : _ref22$toFinalUrl, _ref22$toGuild = _ref22.toGuild, toGuild = _ref22$toGuild === void 0 ? {} : _ref22$toGuild
                _context21.prev = 1

                if (!(new Date().getTime() - discordInfo.updateTime > 10 * 60 * 1000 || discordInfo.expired)) {
                  _context21.next = 14
                  break
                }

                _context21.next = 5
                return verifyDiscordAuth()

              case 5:
                verifyResult = _context21.sent

                if (!verifyResult) {
                  _context21.next = 12
                  break
                }

                discordInfo.updateTime = new Date().getTime()
                discordInfo.expired = false
                GM_setValue('discordInfo', discordInfo)
                _context21.next = 14
                break

              case 12:
                echoLog({
                  type: 'updateDiscordAuth'
                })
                return _context21.abrupt('return')

              case 14:
                pro = []
                _iterator2 = _createForOfIteratorHelper(unique(elements))
                _context21.prev = 16

                _iterator2.s()

              case 18:
                if ((_step2 = _iterator2.n()).done) {
                  _context21.next = 27
                  break
                }

                element = _step2.value
                inviteId = element

                if (website === 'giveawaysu' && toFinalUrl[element]) {
                  toFinalUrlElement = toFinalUrl[element] || ''
                  inviteId = (_toFinalUrlElement$ma = toFinalUrlElement.match(/invite\/(.+)/)) === null || _toFinalUrlElement$ma === void 0 ? void 0 : _toFinalUrlElement$ma[1]
                }

                if (inviteId) {
                  guild = toGuild[inviteId]

                  if (action === 'fuck') {
                    pro.push(joinDiscordServer(inviteId))
                  } else if (guild) {
                    pro.push(leaveDiscordServer(inviteId, guild))
                  }
                }

                _context21.next = 25
                return delay(1000)

              case 25:
                _context21.next = 18
                break

              case 27:
                _context21.next = 32
                break

              case 29:
                _context21.prev = 29
                _context21.t0 = _context21.catch(16)

                _iterator2.e(_context21.t0)

              case 32:
                _context21.prev = 32

                _iterator2.f()

                return _context21.finish(32)

              case 35:
                return _context21.abrupt('return', Promise.all(pro))

              case 38:
                _context21.prev = 38
                _context21.t1 = _context21.catch(1)
                throwError(_context21.t1, 'toggleDiscordActions')

              case 41:
              case 'end':
                return _context21.stop()
            }
          }
        }, _callee21, null, [[1, 38], [16, 29, 32, 35]])
      }))

      return function toggleDiscordActions (_x22) {
        return _ref23.apply(this, arguments)
      }
    }())

    var getInsInfo = /* #__PURE__ */(function () {
      var _ref24 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee22 (name) {
        var logStatus, _yield$httpRequest21, result, statusText, status, data, _data$responseText2, _data$responseText2$m, _data, _data2$config, _data2$entry_data, _data2$entry_data$Pro, _data2$entry_data$Pro2, _data2$entry_data$Pro3, _data2$entry_data$Pro4, _data2, id

        return regeneratorRuntime.wrap(function _callee22$ (_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                _context22.prev = 0
                logStatus = echoLog({
                  type: 'getInsInfo',
                  text: name
                })
                _context22.next = 4
                return httpRequest({
                  url: 'https://www.instagram.com/'.concat(name, '/'),
                  method: 'GET'
                })

              case 4:
                _yield$httpRequest21 = _context22.sent
                result = _yield$httpRequest21.result
                statusText = _yield$httpRequest21.statusText
                status = _yield$httpRequest21.status
                data = _yield$httpRequest21.data

                if (!(result === 'Success')) {
                  _context22.next = 35
                  break
                }

                if (!data.finalUrl.includes('accounts/login')) {
                  _context22.next = 15
                  break
                }

                logStatus.error('Error:' + getI18n('loginIns'), true)
                return _context22.abrupt('return', null)

              case 15:
                if (!data.finalUrl.includes('www.instagram.com/challenge')) {
                  _context22.next = 18
                  break
                }

                logStatus.error('Error:' + getI18n('insBanned'))
                return _context22.abrupt('return', null)

              case 18:
                if (!(data.status === 200)) {
                  _context22.next = 33
                  break
                }

                _data = (_data$responseText2 = data.responseText) === null || _data$responseText2 === void 0 ? void 0 : (_data$responseText2$m = _data$responseText2.match(/window._sharedData[\s]*=[\s]*?(\{[\w\W]*?\});/)) === null || _data$responseText2$m === void 0 ? void 0 : _data$responseText2$m[1]

                if (!_data) {
                  _context22.next = 29
                  break
                }

                _data2 = JSON.parse(_data)
                insInfo.csrftoken = _data2 === null || _data2 === void 0 ? void 0 : (_data2$config = _data2.config) === null || _data2$config === void 0 ? void 0 : _data2$config.csrf_token // eslint-disable-line camelcase

                insInfo.hash = _data2 === null || _data2 === void 0 ? void 0 : _data2.rollout_hash // eslint-disable-line camelcase

                id = _data2 === null || _data2 === void 0 ? void 0 : (_data2$entry_data = _data2.entry_data) === null || _data2$entry_data === void 0 ? void 0 : (_data2$entry_data$Pro = _data2$entry_data.ProfilePage) === null || _data2$entry_data$Pro === void 0 ? void 0 : (_data2$entry_data$Pro2 = _data2$entry_data$Pro[0]) === null || _data2$entry_data$Pro2 === void 0 ? void 0 : (_data2$entry_data$Pro3 = _data2$entry_data$Pro2.graphql) === null || _data2$entry_data$Pro3 === void 0 ? void 0 : (_data2$entry_data$Pro4 = _data2$entry_data$Pro3.user) === null || _data2$entry_data$Pro4 === void 0 ? void 0 : _data2$entry_data$Pro4.id // eslint-disable-line camelcase

                if (id) logStatus.success()
                return _context22.abrupt('return', id)

              case 29:
                logStatus.error('Error: Get ins data error!')
                return _context22.abrupt('return', null)

              case 31:
                _context22.next = 35
                break

              case 33:
                logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                return _context22.abrupt('return', null)

              case 35:
                _context22.next = 41
                break

              case 37:
                _context22.prev = 37
                _context22.t0 = _context22.catch(0)
                throwError(_context22.t0, 'getInsInfo')
                return _context22.abrupt('return', null)

              case 41:
              case 'end':
                return _context22.stop()
            }
          }
        }, _callee22, null, [[0, 37]])
      }))

      return function getInsInfo (_x23) {
        return _ref24.apply(this, arguments)
      }
    }())

    var followIns = /* #__PURE__ */(function () {
      var _ref25 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee23 (name) {
        var id, logStatus, _yield$httpRequest22, result, statusText, status, data, _data$response11, _data$response12

        return regeneratorRuntime.wrap(function _callee23$ (_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                _context23.prev = 0
                _context23.next = 3
                return getInsInfo(name)

              case 3:
                id = _context23.sent

                if (id) {
                  _context23.next = 6
                  break
                }

                return _context23.abrupt('return')

              case 6:
                logStatus = echoLog({
                  type: 'followIns',
                  text: name
                })
                _context23.next = 9
                return httpRequest({
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
                  }
                })

              case 9:
                _yield$httpRequest22 = _context23.sent
                result = _yield$httpRequest22.result
                statusText = _yield$httpRequest22.statusText
                status = _yield$httpRequest22.status
                data = _yield$httpRequest22.data

                if (result === 'Success') {
                  if (data.status === 200 && ((_data$response11 = data.response) === null || _data$response11 === void 0 ? void 0 : _data$response11.result) === 'following') {
                    logStatus.success()
                  } else {
                    logStatus.error('Error:' + (((_data$response12 = data.response) === null || _data$response12 === void 0 ? void 0 : _data$response12.feedback_message) || data.statusText + '(' + data.status + ')'))
                  }
                } else {
                  logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                }

                _context23.next = 20
                break

              case 17:
                _context23.prev = 17
                _context23.t0 = _context23.catch(0)
                throwError(_context23.t0, 'followIns')

              case 20:
              case 'end':
                return _context23.stop()
            }
          }
        }, _callee23, null, [[0, 17]])
      }))

      return function followIns (_x24) {
        return _ref25.apply(this, arguments)
      }
    }())

    var unfollowIns = /* #__PURE__ */(function () {
      var _ref26 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee24 (name) {
        var id, logStatus, _yield$httpRequest23, result, statusText, status, data, _data$response13

        return regeneratorRuntime.wrap(function _callee24$ (_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                _context24.prev = 0

                if (!(whiteList.enable && whiteList.instagram.user.includes(name))) {
                  _context24.next = 3
                  break
                }

                return _context24.abrupt('return', {
                  result: 'Skiped',
                  statusText: 'OK',
                  status: 605
                })

              case 3:
                _context24.next = 5
                return getInsInfo(name)

              case 5:
                id = _context24.sent

                if (id) {
                  _context24.next = 8
                  break
                }

                return _context24.abrupt('return')

              case 8:
                logStatus = echoLog({
                  type: 'unfollowIns',
                  text: name
                })
                _context24.next = 11
                return httpRequest({
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
                  }
                })

              case 11:
                _yield$httpRequest23 = _context24.sent
                result = _yield$httpRequest23.result
                statusText = _yield$httpRequest23.statusText
                status = _yield$httpRequest23.status
                data = _yield$httpRequest23.data

                if (result === 'Success') {
                  if (data.status === 200 && ((_data$response13 = data.response) === null || _data$response13 === void 0 ? void 0 : _data$response13.status) === 'ok') {
                    logStatus.success()
                  } else {
                    logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                  }
                } else {
                  logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                }

                _context24.next = 22
                break

              case 19:
                _context24.prev = 19
                _context24.t0 = _context24.catch(0)
                throwError(_context24.t0, 'unfollowIns')

              case 22:
              case 'end':
                return _context24.stop()
            }
          }
        }, _callee24, null, [[0, 19]])
      }))

      return function unfollowIns (_x25) {
        return _ref26.apply(this, arguments)
      }
    }())

    var toggleInsActions = /* #__PURE__ */(function () {
      var _ref28 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee25 (_ref27) {
        var website, elements, action, _ref27$toFinalUrl, toFinalUrl, pro, _iterator3, _step3, element, name, _toFinalUrlElement$ma2, toFinalUrlElement

        return regeneratorRuntime.wrap(function _callee25$ (_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                website = _ref27.website, elements = _ref27.elements, action = _ref27.action, _ref27$toFinalUrl = _ref27.toFinalUrl, toFinalUrl = _ref27$toFinalUrl === void 0 ? {} : _ref27$toFinalUrl
                _context25.prev = 1
                pro = []
                _iterator3 = _createForOfIteratorHelper(unique(elements))
                _context25.prev = 4

                _iterator3.s()

              case 6:
                if ((_step3 = _iterator3.n()).done) {
                  _context25.next = 15
                  break
                }

                element = _step3.value
                name = element

                if (website === 'giveawaysu' && toFinalUrl[element]) {
                  toFinalUrlElement = toFinalUrl[element] || ''
                  name = (_toFinalUrlElement$ma2 = toFinalUrlElement.match(/https:\/\/www\.instagram\.com\/(.+)?\//)) === null || _toFinalUrlElement$ma2 === void 0 ? void 0 : _toFinalUrlElement$ma2[1]
                }

                if (name) {
                  if (action === 'fuck') {
                    pro.push(followIns(name))
                  } else {
                    pro.push(unfollowIns(name))
                  }
                }

                _context25.next = 13
                return delay(1000)

              case 13:
                _context25.next = 6
                break

              case 15:
                _context25.next = 20
                break

              case 17:
                _context25.prev = 17
                _context25.t0 = _context25.catch(4)

                _iterator3.e(_context25.t0)

              case 20:
                _context25.prev = 20

                _iterator3.f()

                return _context25.finish(20)

              case 23:
                return _context25.abrupt('return', Promise.all(pro))

              case 26:
                _context25.prev = 26
                _context25.t1 = _context25.catch(1)
                throwError(_context25.t1, 'toggleInsActions')

              case 29:
              case 'end':
                return _context25.stop()
            }
          }
        }, _callee25, null, [[1, 26], [4, 17, 20, 23]])
      }))

      return function toggleInsActions (_x26) {
        return _ref28.apply(this, arguments)
      }
    }())

    var updateTwitterInfo = /* #__PURE__ */(function () {
      var _ref29 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee26 () {
        var logStatus, _yield$httpRequest24, result, statusText, status, data, _data$responseHeaders, ct0

        return regeneratorRuntime.wrap(function _callee26$ (_context26) {
          while (1) {
            switch (_context26.prev = _context26.next) {
              case 0:
                _context26.prev = 0
                logStatus = echoLog({
                  type: 'updateTwitterInfo'
                })
                _context26.next = 4
                return httpRequest({
                  url: 'https://twitter.com/settings/account?k',
                  method: 'HEAD',
                  cookie: 'ct0='
                })

              case 4:
                _yield$httpRequest24 = _context26.sent
                result = _yield$httpRequest24.result
                statusText = _yield$httpRequest24.statusText
                status = _yield$httpRequest24.status
                data = _yield$httpRequest24.data

                if (!(result === 'Success')) {
                  _context26.next = 31
                  break
                }

                if (!data.finalUrl.includes('twitter.com/login')) {
                  _context26.next = 13
                  break
                }

                logStatus.error('Error:' + getI18n('loginTwitter'), true)
                return _context26.abrupt('return', false)

              case 13:
                if (!(data.status === 200)) {
                  _context26.next = 27
                  break
                }

                ct0 = (_data$responseHeaders = data.responseHeaders.match(/ct0=(.+?);/)) === null || _data$responseHeaders === void 0 ? void 0 : _data$responseHeaders[1]

                if (!ct0) {
                  _context26.next = 23
                  break
                }

                twitterInfo.ct0 = ct0
                twitterInfo.updateTime = new Date().getTime()
                GM_setValue('twitterInfo', twitterInfo)
                logStatus.success()
                return _context26.abrupt('return', true)

              case 23:
                logStatus.error('Error: Parameter "ct0" not found!')
                return _context26.abrupt('return', false)

              case 25:
                _context26.next = 29
                break

              case 27:
                logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                return _context26.abrupt('return', false)

              case 29:
                _context26.next = 33
                break

              case 31:
                logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                return _context26.abrupt('return', false)

              case 33:
                _context26.next = 38
                break

              case 35:
                _context26.prev = 35
                _context26.t0 = _context26.catch(0)
                throwError(_context26.t0, 'updateTwitterInfo')

              case 38:
              case 'end':
                return _context26.stop()
            }
          }
        }, _callee26, null, [[0, 35]])
      }))

      return function updateTwitterInfo () {
        return _ref29.apply(this, arguments)
      }
    }())

    var toggleTwitterUser = /* #__PURE__ */(function () {
      var _ref30 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee27 (name) {
        var follow
        var userId
        var logStatus
        var _yield$httpRequest25
        var result
        var statusText
        var status
        var data
        var _args27 = arguments

        return regeneratorRuntime.wrap(function _callee27$ (_context27) {
          while (1) {
            switch (_context27.prev = _context27.next) {
              case 0:
                follow = _args27.length > 1 && _args27[1] !== undefined ? _args27[1] : true
                _context27.prev = 1

                if (!(whiteList.enable && !follow && whiteList.twitter.user.includes(name))) {
                  _context27.next = 4
                  break
                }

                return _context27.abrupt('return', {
                  result: 'Skiped',
                  statusText: 'OK',
                  status: 605
                })

              case 4:
                _context27.next = 6
                return getTwitterUserId(name)

              case 6:
                userId = _context27.sent

                if (userId) {
                  _context27.next = 9
                  break
                }

                return _context27.abrupt('return')

              case 9:
                logStatus = echoLog({
                  type: ''.concat(follow ? '' : 'un', 'followTwitterUser'),
                  text: name
                })
                _context27.next = 12
                return httpRequest({
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
                  })
                })

              case 12:
                _yield$httpRequest25 = _context27.sent
                result = _yield$httpRequest25.result
                statusText = _yield$httpRequest25.statusText
                status = _yield$httpRequest25.status
                data = _yield$httpRequest25.data

                if (result === 'Success') {
                  if (data.status === 200) {
                    logStatus.success()
                  } else {
                    logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                  }
                } else {
                  logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                }

                _context27.next = 23
                break

              case 20:
                _context27.prev = 20
                _context27.t0 = _context27.catch(1)
                throwError(_context27.t0, 'toggleTwitterUser')

              case 23:
              case 'end':
                return _context27.stop()
            }
          }
        }, _callee27, null, [[1, 20]])
      }))

      return function toggleTwitterUser (_x27) {
        return _ref30.apply(this, arguments)
      }
    }())

    var toggleRetweet = /* #__PURE__ */(function () {
      var _ref31 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee28 (retweetId) {
        var retweet
        var logStatus
        var _yield$httpRequest26
        var result
        var statusText
        var status
        var data
        var _data$response14
        var _data$response14$erro
        var _data$response14$erro2
        var _args28 = arguments

        return regeneratorRuntime.wrap(function _callee28$ (_context28) {
          while (1) {
            switch (_context28.prev = _context28.next) {
              case 0:
                retweet = _args28.length > 1 && _args28[1] !== undefined ? _args28[1] : true
                _context28.prev = 1

                if (!(whiteList.enable && !retweet && whiteList.twitter.tweet.includes(retweetId))) {
                  _context28.next = 4
                  break
                }

                return _context28.abrupt('return', {
                  result: 'Skiped',
                  statusText: 'OK',
                  status: 605
                })

              case 4:
                logStatus = echoLog({
                  type: ''.concat(retweet ? '' : 'un', 'retweet'),
                  text: retweetId
                })
                _context28.next = 7
                return httpRequest({
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
                  responseType: 'json'
                })

              case 7:
                _yield$httpRequest26 = _context28.sent
                result = _yield$httpRequest26.result
                statusText = _yield$httpRequest26.statusText
                status = _yield$httpRequest26.status
                data = _yield$httpRequest26.data

                if (result === 'Success') {
                  if (data.status === 200 || data.status === 403 && ((_data$response14 = data.response) === null || _data$response14 === void 0 ? void 0 : (_data$response14$erro = _data$response14.errors) === null || _data$response14$erro === void 0 ? void 0 : (_data$response14$erro2 = _data$response14$erro[0]) === null || _data$response14$erro2 === void 0 ? void 0 : _data$response14$erro2.code) === 327) {
                    logStatus.success()
                  } else {
                    logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                  }
                } else {
                  logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                }

                _context28.next = 18
                break

              case 15:
                _context28.prev = 15
                _context28.t0 = _context28.catch(1)
                throwError(_context28.t0, 'toggleRetweet')

              case 18:
              case 'end':
                return _context28.stop()
            }
          }
        }, _callee28, null, [[1, 15]])
      }))

      return function toggleRetweet (_x28) {
        return _ref31.apply(this, arguments)
      }
    }())

    var getTwitterUserId = /* #__PURE__ */(function () {
      var _ref32 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee29 (name) {
        var logStatus, _yield$httpRequest27, result, statusText, status, data, _data$response15, _data$response15$data, _data$response15$data2, userId

        return regeneratorRuntime.wrap(function _callee29$ (_context29) {
          while (1) {
            switch (_context29.prev = _context29.next) {
              case 0:
                _context29.prev = 0
                logStatus = echoLog({
                  type: 'getTwitterUserId',
                  text: name
                })
                _context29.next = 4
                return httpRequest({
                  url: 'https://api.twitter.com/graphql/-xfUfZsnR_zqjFd-IfrN5A/UserByScreenName?variables=%7B%22screen_name%22%3A%22' + name + '%22%2C%22withHighlightedLabel%22%3Atrue%7D',
                  method: 'GET',
                  headers: {
                    authorization: 'Bearer ' + twitterInfo.authorization,
                    'content-type': 'application/json'
                  },
                  responseType: 'json',
                  anonymous: true
                })

              case 4:
                _yield$httpRequest27 = _context29.sent
                result = _yield$httpRequest27.result
                statusText = _yield$httpRequest27.statusText
                status = _yield$httpRequest27.status
                data = _yield$httpRequest27.data

                if (!(result === 'Success')) {
                  _context29.next = 25
                  break
                }

                if (!(data.status === 200)) {
                  _context29.next = 21
                  break
                }

                userId = (_data$response15 = data.response) === null || _data$response15 === void 0 ? void 0 : (_data$response15$data = _data$response15.data) === null || _data$response15$data === void 0 ? void 0 : (_data$response15$data2 = _data$response15$data.user) === null || _data$response15$data2 === void 0 ? void 0 : _data$response15$data2.rest_id // eslint-disable-line camelcase

                if (!userId) {
                  _context29.next = 17
                  break
                }

                logStatus.success()
                return _context29.abrupt('return', userId)

              case 17:
                logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                return _context29.abrupt('return', false)

              case 19:
                _context29.next = 23
                break

              case 21:
                logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                return _context29.abrupt('return', false)

              case 23:
                _context29.next = 27
                break

              case 25:
                logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                return _context29.abrupt('return', false)

              case 27:
                _context29.next = 32
                break

              case 29:
                _context29.prev = 29
                _context29.t0 = _context29.catch(0)
                throwError(_context29.t0, 'getTwitterUserId')

              case 32:
              case 'end':
                return _context29.stop()
            }
          }
        }, _callee29, null, [[0, 29]])
      }))

      return function getTwitterUserId (_x29) {
        return _ref32.apply(this, arguments)
      }
    }())

    var toggleTwitterActions = /* #__PURE__ */(function () {
      var _ref34 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee30 (_ref33) {
        var _toFinalUrlElement$ma3, _toFinalUrlElement$ma4

        var website, type, elements, action, _ref33$toFinalUrl, toFinalUrl, _iterator4, _step4, element, id, toFinalUrlElement

        return regeneratorRuntime.wrap(function _callee30$ (_context30) {
          while (1) {
            switch (_context30.prev = _context30.next) {
              case 0:
                website = _ref33.website, type = _ref33.type, elements = _ref33.elements, action = _ref33.action, _ref33$toFinalUrl = _ref33.toFinalUrl, toFinalUrl = _ref33$toFinalUrl === void 0 ? {} : _ref33$toFinalUrl
                _context30.prev = 1
                _iterator4 = _createForOfIteratorHelper(unique(elements))
                _context30.prev = 3

                _iterator4.s()

              case 5:
                if ((_step4 = _iterator4.n()).done) {
                  _context30.next = 29
                  break
                }

                element = _step4.value
                id = element

                if (!(website === 'giveawaysu' && toFinalUrl[element])) {
                  _context30.next = 17
                  break
                }

                toFinalUrlElement = toFinalUrl[element] || ''
                _context30.t0 = type
                _context30.next = _context30.t0 === 'follow' ? 13 : _context30.t0 === 'retweet' ? 15 : 17
                break

              case 13:
                id = (_toFinalUrlElement$ma3 = toFinalUrlElement.match(/https:\/\/twitter\.com\/(.+)/)) === null || _toFinalUrlElement$ma3 === void 0 ? void 0 : _toFinalUrlElement$ma3[1]
                return _context30.abrupt('break', 17)

              case 15:
                id = (_toFinalUrlElement$ma4 = toFinalUrlElement.match(/https:\/\/twitter\.com\/.*?\/status\/([\d]+)/)) === null || _toFinalUrlElement$ma4 === void 0 ? void 0 : _toFinalUrlElement$ma4[1]
                return _context30.abrupt('break', 17)

              case 17:
                if (!id) {
                  _context30.next = 27
                  break
                }

                _context30.t1 = type
                _context30.next = _context30.t1 === 'follow' ? 21 : _context30.t1 === 'retweet' ? 24 : 27
                break

              case 21:
                _context30.next = 23
                return toggleTwitterUser(id, action === 'fuck')

              case 23:
                return _context30.abrupt('break', 27)

              case 24:
                _context30.next = 26
                return toggleRetweet(id, action === 'fuck')

              case 26:
                return _context30.abrupt('break', 27)

              case 27:
                _context30.next = 5
                break

              case 29:
                _context30.next = 34
                break

              case 31:
                _context30.prev = 31
                _context30.t2 = _context30.catch(3)

                _iterator4.e(_context30.t2)

              case 34:
                _context30.prev = 34

                _iterator4.f()

                return _context30.finish(34)

              case 37:
                _context30.next = 42
                break

              case 39:
                _context30.prev = 39
                _context30.t3 = _context30.catch(1)
                throwError(_context30.t3, 'toggleTwitterActions')

              case 42:
              case 'end':
                return _context30.stop()
            }
          }
        }, _callee30, null, [[1, 39], [3, 31, 34, 37]])
      }))

      return function toggleTwitterActions (_x30) {
        return _ref34.apply(this, arguments)
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
        if (debug) console.error(e)

        if (notice) {
          Swal.fire({
            title: getI18n('updateTwitchInfoError'),
            icon: 'error'
          })
        }
      }
    }

    var verifyTwitchAuth = /* #__PURE__ */(function () {
      var _ref35 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee31 () {
        var logStatus, _yield$httpRequest28, result, statusText, status, data, _data$response16, _data$response16$, _data$response16$$dat

        return regeneratorRuntime.wrap(function _callee31$ (_context31) {
          while (1) {
            switch (_context31.prev = _context31.next) {
              case 0:
                _context31.prev = 0
                logStatus = echoLog({
                  type: 'verifyTwitchAuth'
                })
                _context31.next = 4
                return httpRequest({
                  url: 'https://gql.twitch.tv/gql',
                  method: 'POST',
                  dataType: 'json',
                  headers: {
                    Authorization: 'OAuth ' + twitchInfo.authToken,
                    'Client-Id': twitchInfo.clientId
                  },
                  data: '[{"operationName":"FrontPageNew_User","variables":{"limit":1},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"64bd07a2cbaca80699d62636d966cf6395a5d14a1f0a14282067dcb28b13eb11"}}}]'
                })

              case 4:
                _yield$httpRequest28 = _context31.sent
                result = _yield$httpRequest28.result
                statusText = _yield$httpRequest28.statusText
                status = _yield$httpRequest28.status
                data = _yield$httpRequest28.data

                if (!(result === 'Success')) {
                  _context31.next = 19
                  break
                }

                if (!(data.status === 200 && ((_data$response16 = data.response) === null || _data$response16 === void 0 ? void 0 : (_data$response16$ = _data$response16[0]) === null || _data$response16$ === void 0 ? void 0 : (_data$response16$$dat = _data$response16$.data) === null || _data$response16$$dat === void 0 ? void 0 : _data$response16$$dat.currentUser))) {
                  _context31.next = 15
                  break
                }

                logStatus.success()
                return _context31.abrupt('return', true)

              case 15:
                logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                return _context31.abrupt('return', false)

              case 17:
                _context31.next = 21
                break

              case 19:
                logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                return _context31.abrupt('return', false)

              case 21:
                _context31.next = 26
                break

              case 23:
                _context31.prev = 23
                _context31.t0 = _context31.catch(0)
                throwError(_context31.t0, 'verifyTwitchAuth')

              case 26:
              case 'end':
                return _context31.stop()
            }
          }
        }, _callee31, null, [[0, 23]])
      }))

      return function verifyTwitchAuth () {
        return _ref35.apply(this, arguments)
      }
    }())

    var toggleTwitchChannel = /* #__PURE__ */(function () {
      var _ref36 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee32 (name) {
        var follow
        var channelId
        var logStatus
        var followData
        var unfollowData
        var _yield$httpRequest29
        var result
        var statusText
        var status
        var data
        var _args32 = arguments

        return regeneratorRuntime.wrap(function _callee32$ (_context32) {
          while (1) {
            switch (_context32.prev = _context32.next) {
              case 0:
                follow = _args32.length > 1 && _args32[1] !== undefined ? _args32[1] : true
                _context32.prev = 1

                if (!(whiteList.enable && whiteList.twitch.channel.includes(name))) {
                  _context32.next = 4
                  break
                }

                return _context32.abrupt('return', {
                  result: 'Skiped',
                  statusText: 'OK',
                  status: 605
                })

              case 4:
                _context32.next = 6
                return getTwitchChannelId(name)

              case 6:
                channelId = _context32.sent

                if (channelId) {
                  _context32.next = 9
                  break
                }

                return _context32.abrupt('return')

              case 9:
                logStatus = echoLog({
                  type: ''.concat(follow ? '' : 'un', 'followTwitchChannel'),
                  text: name
                })
                followData = '[{"operationName":"FollowButton_FollowUser","variables":{"input":{"disableNotifications":false,"targetID":"' + channelId + '"}},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"3efee1acda90efdff9fef6e6b4a29213be3ee490781c5b54469717b6131ffdfe"}}}]'
                unfollowData = '[{"operationName":"FollowButton_UnfollowUser","variables":{"input":{"targetID":"' + channelId + '"}},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"d7fbdb4e9780dcdc0cc1618ec783309471cd05a59584fc3c56ea1c52bb632d41"}}}]'
                _context32.next = 14
                return httpRequest({
                  url: 'https://gql.twitch.tv/gql',
                  method: 'POST',
                  dataType: 'json',
                  headers: {
                    Authorization: 'OAuth ' + twitchInfo.authToken
                  },
                  data: follow ? followData : unfollowData
                })

              case 14:
                _yield$httpRequest29 = _context32.sent
                result = _yield$httpRequest29.result
                statusText = _yield$httpRequest29.statusText
                status = _yield$httpRequest29.status
                data = _yield$httpRequest29.data

                if (result === 'Success') {
                  if (data.status === 200) {
                    logStatus.success()
                  } else {
                    logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                  }
                } else {
                  logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                }

                _context32.next = 25
                break

              case 22:
                _context32.prev = 22
                _context32.t0 = _context32.catch(1)
                throwError(_context32.t0, 'toggleTwitchChannel')

              case 25:
              case 'end':
                return _context32.stop()
            }
          }
        }, _callee32, null, [[1, 22]])
      }))

      return function toggleTwitchChannel (_x31) {
        return _ref36.apply(this, arguments)
      }
    }())

    var getTwitchChannelId = /* #__PURE__ */(function () {
      var _ref37 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee33 (name) {
        var logStatus, _yield$httpRequest30, result, statusText, status, data, _data$response17, _data$response17$, _data$response17$$dat, _data$response17$$dat2, channelId

        return regeneratorRuntime.wrap(function _callee33$ (_context33) {
          while (1) {
            switch (_context33.prev = _context33.next) {
              case 0:
                _context33.prev = 0
                logStatus = echoLog({
                  type: 'getTwitchChannelId',
                  text: name
                })
                _context33.next = 4
                return httpRequest({
                  url: 'https://gql.twitch.tv/gql',
                  method: 'POST',
                  headers: {
                    Authorization: 'OAuth ' + twitchInfo.authToken,
                    'Client-Id': twitchInfo.clientId
                  },
                  responseType: 'json',
                  data: '[{"operationName":"ActiveWatchParty","variables":{"channelLogin":"' + name + '"},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"4a8156c97b19e3a36e081cf6d6ddb5dbf9f9b02ae60e4d2ff26ed70aebc80a30"}}}]'
                })

              case 4:
                _yield$httpRequest30 = _context33.sent
                result = _yield$httpRequest30.result
                statusText = _yield$httpRequest30.statusText
                status = _yield$httpRequest30.status
                data = _yield$httpRequest30.data

                if (!(result === 'Success')) {
                  _context33.next = 25
                  break
                }

                if (!(data.status === 200)) {
                  _context33.next = 21
                  break
                }

                channelId = (_data$response17 = data.response) === null || _data$response17 === void 0 ? void 0 : (_data$response17$ = _data$response17[0]) === null || _data$response17$ === void 0 ? void 0 : (_data$response17$$dat = _data$response17$.data) === null || _data$response17$$dat === void 0 ? void 0 : (_data$response17$$dat2 = _data$response17$$dat.user) === null || _data$response17$$dat2 === void 0 ? void 0 : _data$response17$$dat2.id

                if (!channelId) {
                  _context33.next = 17
                  break
                }

                logStatus.success()
                return _context33.abrupt('return', channelId)

              case 17:
                logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                return _context33.abrupt('return', false)

              case 19:
                _context33.next = 23
                break

              case 21:
                logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                return _context33.abrupt('return', false)

              case 23:
                _context33.next = 27
                break

              case 25:
                logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                return _context33.abrupt('return', false)

              case 27:
                _context33.next = 32
                break

              case 29:
                _context33.prev = 29
                _context33.t0 = _context33.catch(0)
                throwError(_context33.t0, 'getTwitchChannelId')

              case 32:
              case 'end':
                return _context33.stop()
            }
          }
        }, _callee33, null, [[0, 29]])
      }))

      return function getTwitchChannelId (_x32) {
        return _ref37.apply(this, arguments)
      }
    }())

    var toggleTwitchActions = /* #__PURE__ */(function () {
      var _ref39 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee34 (_ref38) {
        var website, type, elements, action, _ref38$toFinalUrl, toFinalUrl, result, _iterator5, _step5, element, name, _toFinalUrlElement$ma5, toFinalUrlElement

        return regeneratorRuntime.wrap(function _callee34$ (_context34) {
          while (1) {
            switch (_context34.prev = _context34.next) {
              case 0:
                website = _ref38.website, type = _ref38.type, elements = _ref38.elements, action = _ref38.action, _ref38$toFinalUrl = _ref38.toFinalUrl, toFinalUrl = _ref38$toFinalUrl === void 0 ? {} : _ref38$toFinalUrl
                _context34.prev = 1

                if (!(new Date().getTime() - twitchInfo.updateTime > 10 * 60 * 1000)) {
                  _context34.next = 8
                  break
                }

                _context34.next = 5
                return verifyTwitchAuth()

              case 5:
                result = _context34.sent

                if (result) {
                  _context34.next = 8
                  break
                }

                return _context34.abrupt('return')

              case 8:
                _iterator5 = _createForOfIteratorHelper(unique(elements))
                _context34.prev = 9

                _iterator5.s()

              case 11:
                if ((_step5 = _iterator5.n()).done) {
                  _context34.next = 20
                  break
                }

                element = _step5.value
                name = element

                if (website === 'giveawaysu' && toFinalUrl[element]) {
                  toFinalUrlElement = toFinalUrl[element] || ''
                  name = (_toFinalUrlElement$ma5 = toFinalUrlElement.match(/https:\/\/www\.twitch\.tv\/(.+)/)) === null || _toFinalUrlElement$ma5 === void 0 ? void 0 : _toFinalUrlElement$ma5[1]
                }

                if (!name) {
                  _context34.next = 18
                  break
                }

                _context34.next = 18
                return toggleTwitchChannel(name, action === 'fuck')

              case 18:
                _context34.next = 11
                break

              case 20:
                _context34.next = 25
                break

              case 22:
                _context34.prev = 22
                _context34.t0 = _context34.catch(9)

                _iterator5.e(_context34.t0)

              case 25:
                _context34.prev = 25

                _iterator5.f()

                return _context34.finish(25)

              case 28:
                _context34.next = 33
                break

              case 30:
                _context34.prev = 30
                _context34.t1 = _context34.catch(1)
                throwError(_context34.t1, 'toggleTwitchActions')

              case 33:
              case 'end':
                return _context34.stop()
            }
          }
        }, _callee34, null, [[1, 30], [9, 22, 25, 28]])
      }))

      return function toggleTwitchActions (_x33) {
        return _ref39.apply(this, arguments)
      }
    }())

    var updateRedditInfo = /* #__PURE__ */(function () {
      var _ref40 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee35 () {
        var logStatus, _yield$httpRequest31, result, statusText, status, data, _ref41, _ref42, accessToken, expiresTime

        return regeneratorRuntime.wrap(function _callee35$ (_context35) {
          while (1) {
            switch (_context35.prev = _context35.next) {
              case 0:
                _context35.prev = 0
                logStatus = echoLog({
                  type: 'updateRedditInfo'
                })
                _context35.next = 4
                return httpRequest({
                  url: 'https://www.reddit.com/',
                  method: 'GET',
                  nochche: true
                })

              case 4:
                _yield$httpRequest31 = _context35.sent
                result = _yield$httpRequest31.result
                statusText = _yield$httpRequest31.statusText
                status = _yield$httpRequest31.status
                data = _yield$httpRequest31.data

                if (!(result === 'Success')) {
                  _context35.next = 31
                  break
                }

                if (!(data.status === 200)) {
                  _context35.next = 27
                  break
                }

                if (!data.responseText.includes('www.reddit.com/login/')) {
                  _context35.next = 14
                  break
                }

                logStatus.error('Error:' + getI18n('loginReddit'), true)
                return _context35.abrupt('return', false)

              case 14:
                _ref41 = data.responseText.match(/"accessToken":"(.*?)","expires":"(.*?)"/) || [], _ref42 = _slicedToArray(_ref41, 3), accessToken = _ref42[1], expiresTime = _ref42[2]

                if (!accessToken) {
                  _context35.next = 23
                  break
                }

                redditInfo.accessToken = accessToken
                redditInfo.expiresTime = new Date(expiresTime).getTime()
                GM_setValue('redditInfo', redditInfo)
                logStatus.success()
                return _context35.abrupt('return', true)

              case 23:
                logStatus.error('Error: Parameter "accessToken" not found!')
                return _context35.abrupt('return', false)

              case 25:
                _context35.next = 29
                break

              case 27:
                logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                return _context35.abrupt('return', false)

              case 29:
                _context35.next = 33
                break

              case 31:
                logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                return _context35.abrupt('return', false)

              case 33:
                _context35.next = 38
                break

              case 35:
                _context35.prev = 35
                _context35.t0 = _context35.catch(0)
                throwError(_context35.t0, 'updateRedditInfo')

              case 38:
              case 'end':
                return _context35.stop()
            }
          }
        }, _callee35, null, [[0, 35]])
      }))

      return function updateRedditInfo () {
        return _ref40.apply(this, arguments)
      }
    }())

    var toggleReddit = /* #__PURE__ */(function () {
      var _ref43 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee36 (name) {
        var join
        var type
        var logStatus
        var _yield$httpRequest32
        var result
        var statusText
        var status
        var data
        var _args36 = arguments

        return regeneratorRuntime.wrap(function _callee36$ (_context36) {
          while (1) {
            switch (_context36.prev = _context36.next) {
              case 0:
                join = _args36.length > 1 && _args36[1] !== undefined ? _args36[1] : true
                _context36.prev = 1

                if (!(whiteList.enable && !join && whiteList.reddit.reddit.includes(name))) {
                  _context36.next = 4
                  break
                }

                return _context36.abrupt('return', {
                  result: 'Skiped',
                  statusText: 'OK',
                  status: 605
                })

              case 4:
                type = join ? 'joinReddit' : 'leaveReddit'

                if (/^u_/.test(name)) {
                  type = join ? 'followRedditUser' : 'unfollowRedditUser'
                }

                logStatus = echoLog({
                  type: type,
                  text: name
                })
                _context36.next = 9
                return httpRequest({
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
                  })
                })

              case 9:
                _yield$httpRequest32 = _context36.sent
                result = _yield$httpRequest32.result
                statusText = _yield$httpRequest32.statusText
                status = _yield$httpRequest32.status
                data = _yield$httpRequest32.data

                if (result === 'Success') {
                  if (data.status === 200) {
                    logStatus.success()
                  } else {
                    logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                  }
                } else {
                  logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                }

                _context36.next = 20
                break

              case 17:
                _context36.prev = 17
                _context36.t0 = _context36.catch(1)
                throwError(_context36.t0, 'toggleReddit')

              case 20:
              case 'end':
                return _context36.stop()
            }
          }
        }, _callee36, null, [[1, 17]])
      }))

      return function toggleReddit (_x34) {
        return _ref43.apply(this, arguments)
      }
    }())

    var toggleRedditActions = /* #__PURE__ */(function () {
      var _ref45 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee37 (_ref44) {
        var website, type, elements, action, _ref44$toFinalUrl, toFinalUrl, result, _iterator6, _step6, element, name, _toFinalUrlElement$ma6, _toFinalUrlElement$ma7, toFinalUrlElement, userName

        return regeneratorRuntime.wrap(function _callee37$ (_context37) {
          while (1) {
            switch (_context37.prev = _context37.next) {
              case 0:
                website = _ref44.website, type = _ref44.type, elements = _ref44.elements, action = _ref44.action, _ref44$toFinalUrl = _ref44.toFinalUrl, toFinalUrl = _ref44$toFinalUrl === void 0 ? {} : _ref44$toFinalUrl
                _context37.prev = 1

                if (!(new Date().getTime() > redditInfo.expiresTime)) {
                  _context37.next = 8
                  break
                }

                _context37.next = 5
                return updateRedditInfo()

              case 5:
                result = _context37.sent

                if (result) {
                  _context37.next = 8
                  break
                }

                return _context37.abrupt('return')

              case 8:
                _iterator6 = _createForOfIteratorHelper(unique(elements))
                _context37.prev = 9

                _iterator6.s()

              case 11:
                if ((_step6 = _iterator6.n()).done) {
                  _context37.next = 20
                  break
                }

                element = _step6.value
                name = element

                if (website === 'giveawaysu' && toFinalUrl[element]) {
                  toFinalUrlElement = toFinalUrl[element] || ''
                  name = (_toFinalUrlElement$ma6 = toFinalUrlElement.match(/https?:\/\/www\.reddit\.com\/r\/([^/]*)/)) === null || _toFinalUrlElement$ma6 === void 0 ? void 0 : _toFinalUrlElement$ma6[1]
                  userName = (_toFinalUrlElement$ma7 = toFinalUrlElement.match(/https?:\/\/www\.reddit\.com\/user\/([^/]*)/)) === null || _toFinalUrlElement$ma7 === void 0 ? void 0 : _toFinalUrlElement$ma7[1]
                  if (userName) userName = 'u_' + userName
                  name = name || userName
                }

                if (!name) {
                  _context37.next = 18
                  break
                }

                _context37.next = 18
                return toggleReddit(name, action === 'fuck')

              case 18:
                _context37.next = 11
                break

              case 20:
                _context37.next = 25
                break

              case 22:
                _context37.prev = 22
                _context37.t0 = _context37.catch(9)

                _iterator6.e(_context37.t0)

              case 25:
                _context37.prev = 25

                _iterator6.f()

                return _context37.finish(25)

              case 28:
                _context37.next = 33
                break

              case 30:
                _context37.prev = 30
                _context37.t1 = _context37.catch(1)
                throwError(_context37.t1, 'toggleRedditActions')

              case 33:
              case 'end':
                return _context37.stop()
            }
          }
        }, _callee37, null, [[1, 30], [9, 22, 25, 28]])
      }))

      return function toggleRedditActions (_x35) {
        return _ref45.apply(this, arguments)
      }
    }())

    var verifyVkLogin = /* #__PURE__ */(function () {
      var _ref46 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee38 () {
        var logStatus, _yield$httpRequest33, result, statusText, status, data

        return regeneratorRuntime.wrap(function _callee38$ (_context38) {
          while (1) {
            switch (_context38.prev = _context38.next) {
              case 0:
                _context38.prev = 0
                logStatus = echoLog({
                  type: 'verifyVkLogin'
                })
                _context38.next = 4
                return httpRequest({
                  url: 'https://vk.com/im',
                  method: 'GET'
                })

              case 4:
                _yield$httpRequest33 = _context38.sent
                result = _yield$httpRequest33.result
                statusText = _yield$httpRequest33.statusText
                status = _yield$httpRequest33.status
                data = _yield$httpRequest33.data

                if (!(result === 'Success')) {
                  _context38.next = 22
                  break
                }

                if (!data.finalUrl.includes('vk.com/login')) {
                  _context38.next = 13
                  break
                }

                logStatus.error('Error:' + getI18n('loginVk'), true)
                return _context38.abrupt('return', false)

              case 13:
                if (!(data.status === 200)) {
                  _context38.next = 18
                  break
                }

                logStatus.success()
                return _context38.abrupt('return', true)

              case 18:
                logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                return _context38.abrupt('return', false)

              case 20:
                _context38.next = 24
                break

              case 22:
                logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                return _context38.abrupt('return', false)

              case 24:
                _context38.next = 29
                break

              case 26:
                _context38.prev = 26
                _context38.t0 = _context38.catch(0)
                throwError(_context38.t0, 'verifyVkLogin')

              case 29:
              case 'end':
                return _context38.stop()
            }
          }
        }, _callee38, null, [[0, 26]])
      }))

      return function verifyVkLogin () {
        return _ref46.apply(this, arguments)
      }
    }())

    var toggleVk = /* #__PURE__ */(function () {
      var _ref47 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee39 (name) {
        var join
        var data
        var _args39 = arguments
        return regeneratorRuntime.wrap(function _callee39$ (_context39) {
          while (1) {
            switch (_context39.prev = _context39.next) {
              case 0:
                join = _args39.length > 1 && _args39[1] !== undefined ? _args39[1] : true
                _context39.prev = 1

                if (!(whiteList.enable && !join && whiteList.vk.vk.includes(name))) {
                  _context39.next = 4
                  break
                }

                return _context39.abrupt('return', {
                  result: 'Skiped',
                  statusText: 'OK',
                  status: 605
                })

              case 4:
                _context39.next = 6
                return getVkId(name)

              case 6:
                data = _context39.sent

                if (data) {
                  _context39.next = 9
                  break
                }

                return _context39.abrupt('return')

              case 9:
                _context39.t0 = data.type
                _context39.next = _context39.t0 === 'group' ? 12 : _context39.t0 === 'public' ? 15 : _context39.t0 === 'wall' ? 18 : 21
                break

              case 12:
                _context39.next = 14
                return toggleVkGroup(name, data, join)

              case 14:
                return _context39.abrupt('break', 21)

              case 15:
                _context39.next = 17
                return toggleVkPublic(name, data, join)

              case 17:
                return _context39.abrupt('break', 21)

              case 18:
                _context39.next = 20
                return toggleVkWall(name, join)

              case 20:
                return _context39.abrupt('break', 21)

              case 21:
                _context39.next = 26
                break

              case 23:
                _context39.prev = 23
                _context39.t1 = _context39.catch(1)
                throwError(_context39.t1, 'toggleVk')

              case 26:
              case 'end':
                return _context39.stop()
            }
          }
        }, _callee39, null, [[1, 23]])
      }))

      return function toggleVk (_x36) {
        return _ref47.apply(this, arguments)
      }
    }())

    var toggleVkWall = /* #__PURE__ */(function () {
      var _ref48 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee40 (name, join) {
        var logStatus, _yield$httpRequest34, result, statusText, status, data, _data$responseText$ma8, hash, _yield$httpRequest35, resultR, statusTextR, statusR, dataR, _dataR$responseText, _jsonData$payload, _jsonData$payload$, _jsonData$payload$$, jsonData

        return regeneratorRuntime.wrap(function _callee40$ (_context40) {
          while (1) {
            switch (_context40.prev = _context40.next) {
              case 0:
                logStatus = echoLog({
                  type: 'repostVkWall',
                  text: name
                })
                _context40.next = 3
                return httpRequest({
                  url: 'https://vk.com/like.php',
                  method: 'POST',
                  headers: {
                    origin: 'https://vk.com',
                    referer: 'https://vk.com/' + name,
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  data: $.param({
                    act: 'publish_box',
                    al: 1,
                    object: name
                  })
                })

              case 3:
                _yield$httpRequest34 = _context40.sent
                result = _yield$httpRequest34.result
                statusText = _yield$httpRequest34.statusText
                status = _yield$httpRequest34.status
                data = _yield$httpRequest34.data

                if (!(result === 'Success')) {
                  _context40.next = 28
                  break
                }

                if (!(data.status === 200)) {
                  _context40.next = 25
                  break
                }

                hash = (_data$responseText$ma8 = data.responseText.match(/shHash:[\s]*'(.*?)'/)) === null || _data$responseText$ma8 === void 0 ? void 0 : _data$responseText$ma8[1]

                if (!hash) {
                  _context40.next = 22
                  break
                }

                _context40.next = 14
                return httpRequest({
                  url: 'https://vk.com/like.php',
                  method: 'POST',
                  headers: {
                    origin: 'https://vk.com',
                    referer: 'https://vk.com/' + name,
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  data: $.param({
                    Message: '',
                    act: 'a_do_publish',
                    al: 1,
                    close_comments: 0,
                    friends_only: 0,
                    from: 'box',
                    hash: hash,
                    list: '',
                    mark_as_ads: 0,
                    mute_notifications: 0,
                    object: name,
                    ret_data: 1,
                    to: 0
                  })
                })

              case 14:
                _yield$httpRequest35 = _context40.sent
                resultR = _yield$httpRequest35.result
                statusTextR = _yield$httpRequest35.statusText
                statusR = _yield$httpRequest35.status
                dataR = _yield$httpRequest35.data

                if (resultR === 'Success') {
                  if (dataR.status === 200) {
                    jsonData = JSON.parse(((_dataR$responseText = dataR.responseText) === null || _dataR$responseText === void 0 ? void 0 : _dataR$responseText.replace('<!--', '')) || '{}')

                    if ((jsonData === null || jsonData === void 0 ? void 0 : (_jsonData$payload = jsonData.payload) === null || _jsonData$payload === void 0 ? void 0 : (_jsonData$payload$ = _jsonData$payload[1]) === null || _jsonData$payload$ === void 0 ? void 0 : (_jsonData$payload$$ = _jsonData$payload$[1]) === null || _jsonData$payload$$ === void 0 ? void 0 : _jsonData$payload$$.share_my) === true) {
                      // eslint-disable-line camelcase
                      logStatus.success()
                    } else {
                      logStatus.error('Error:' + dataR.statusText + '(' + dataR.status + ')')
                    }
                  } else {
                    logStatus.error('Error:' + dataR.statusText + '(' + dataR.status + ')')
                  }
                } else {
                  logStatus.error(''.concat(resultR, ':').concat(statusTextR, '(').concat(statusR, ')'))
                }

                _context40.next = 23
                break

              case 22:
                logStatus.error('Error: Get "hash" failed')

              case 23:
                _context40.next = 26
                break

              case 25:
                logStatus.error('Error:' + data.statusText + '(' + data.status + ')')

              case 26:
                _context40.next = 29
                break

              case 28:
                logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))

              case 29:
              case 'end':
                return _context40.stop()
            }
          }
        }, _callee40)
      }))

      return function toggleVkWall (_x37, _x38) {
        return _ref48.apply(this, arguments)
      }
    }())

    var toggleVkGroup = /* #__PURE__ */(function () {
      var _ref49 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee41 (name, dataParam) {
        var join
        var logStatus
        var reqData
        var _yield$httpRequest36
        var result
        var statusText
        var status
        var data
        var _args41 = arguments

        return regeneratorRuntime.wrap(function _callee41$ (_context41) {
          while (1) {
            switch (_context41.prev = _context41.next) {
              case 0:
                join = _args41.length > 2 && _args41[2] !== undefined ? _args41[2] : true
                _context41.prev = 1
                logStatus = echoLog({
                  type: join ? 'joinVkGroup' : 'leaveVkGroup',
                  text: name
                })

                if (!(dataParam.groupAct === 'enter' && !join || dataParam.groupAct === 'leave' && join)) {
                  _context41.next = 5
                  break
                }

                return _context41.abrupt('return', logStatus.success())

              case 5:
                reqData = {
                  act: join ? 'enter' : 'leave',
                  al: 1,
                  gid: dataParam.groupId,
                  hash: dataParam.groupHash
                }
                if (join) reqData.context = '_'
                _context41.next = 9
                return httpRequest({
                  url: 'https://vk.com/al_groups.php',
                  method: 'POST',
                  headers: {
                    origin: 'https://vk.com',
                    referer: 'https://vk.com/' + name,
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  data: $.param(reqData)
                })

              case 9:
                _yield$httpRequest36 = _context41.sent
                result = _yield$httpRequest36.result
                statusText = _yield$httpRequest36.statusText
                status = _yield$httpRequest36.status
                data = _yield$httpRequest36.data

                if (result === 'Success') {
                  if (data.status === 200) {
                    logStatus.success()
                  } else {
                    logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                  }
                } else {
                  logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                }

                _context41.next = 20
                break

              case 17:
                _context41.prev = 17
                _context41.t0 = _context41.catch(1)
                throwError(_context41.t0, 'toggleVkGroup')

              case 20:
              case 'end':
                return _context41.stop()
            }
          }
        }, _callee41, null, [[1, 17]])
      }))

      return function toggleVkGroup (_x39, _x40) {
        return _ref49.apply(this, arguments)
      }
    }())

    var toggleVkPublic = /* #__PURE__ */(function () {
      var _ref50 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee42 (name, dataParam) {
        var join
        var logStatus
        var _yield$httpRequest37
        var result
        var statusText
        var status
        var data
        var _args42 = arguments

        return regeneratorRuntime.wrap(function _callee42$ (_context42) {
          while (1) {
            switch (_context42.prev = _context42.next) {
              case 0:
                join = _args42.length > 2 && _args42[2] !== undefined ? _args42[2] : true
                _context42.prev = 1
                logStatus = echoLog({
                  type: join ? 'joinVkPublic' : 'leaveVkPublic',
                  text: name
                })

                if (!(dataParam.publicJoined && join || !dataParam.publicJoined && !join)) {
                  _context42.next = 5
                  break
                }

                return _context42.abrupt('return', logStatus.success())

              case 5:
                _context42.next = 7
                return httpRequest({
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
                    pid: dataParam.publicPid,
                    hash: dataParam.publicHash
                  })
                })

              case 7:
                _yield$httpRequest37 = _context42.sent
                result = _yield$httpRequest37.result
                statusText = _yield$httpRequest37.statusText
                status = _yield$httpRequest37.status
                data = _yield$httpRequest37.data

                if (result === 'Success') {
                  if (data.status === 200) {
                    logStatus.success()
                  } else {
                    logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                  }
                } else {
                  logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                }

                _context42.next = 18
                break

              case 15:
                _context42.prev = 15
                _context42.t0 = _context42.catch(1)
                throwError(_context42.t0, 'toggleVkPublic')

              case 18:
              case 'end':
                return _context42.stop()
            }
          }
        }, _callee42, null, [[1, 15]])
      }))

      return function toggleVkPublic (_x41, _x42) {
        return _ref50.apply(this, arguments)
      }
    }())

    var getVkId = /* #__PURE__ */(function () {
      var _ref51 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee43 (name) {
        var logStatus, _yield$httpRequest38, result, statusText, status, data, _data$responseText$ma9, _data$responseText$ma10, _ref52, _ref53, groupAct, groupId, groupHash, publicHash, publicPid, publicJoined

        return regeneratorRuntime.wrap(function _callee43$ (_context43) {
          while (1) {
            switch (_context43.prev = _context43.next) {
              case 0:
                _context43.prev = 0

                if (!/^wall-/.test(name)) {
                  _context43.next = 3
                  break
                }

                return _context43.abrupt('return', {
                  type: 'wall'
                })

              case 3:
                logStatus = echoLog({
                  type: 'getVkId',
                  text: name
                })
                _context43.next = 6
                return httpRequest({
                  url: 'https://vk.com/' + name,
                  method: 'GET'
                })

              case 6:
                _yield$httpRequest38 = _context43.sent
                result = _yield$httpRequest38.result
                statusText = _yield$httpRequest38.statusText
                status = _yield$httpRequest38.status
                data = _yield$httpRequest38.data

                if (!(result === 'Success')) {
                  _context43.next = 35
                  break
                }

                if (!(data.status === 200)) {
                  _context43.next = 31
                  break
                }

                _ref52 = data.responseText.match(/Groups.(enter|leave)\(.*?,.*?([\d]+?), '(.*?)'/) || [], _ref53 = _slicedToArray(_ref52, 4), groupAct = _ref53[1], groupId = _ref53[2], groupHash = _ref53[3]
                publicHash = (_data$responseText$ma9 = data.responseText.match(/"enterHash":"(.*?)"/)) === null || _data$responseText$ma9 === void 0 ? void 0 : _data$responseText$ma9[1]
                publicPid = (_data$responseText$ma10 = data.responseText.match(/"public_id":([\d]+?),/)) === null || _data$responseText$ma10 === void 0 ? void 0 : _data$responseText$ma10[1]
                publicJoined = !data.responseText.includes('Public.subscribe')

                if (!(groupAct && groupId && groupHash)) {
                  _context43.next = 22
                  break
                }

                logStatus.success()
                return _context43.abrupt('return', {
                  groupAct: groupAct,
                  groupId: groupId,
                  groupHash: groupHash,
                  type: 'group'
                })

              case 22:
                if (!(publicHash && publicPid)) {
                  _context43.next = 27
                  break
                }

                logStatus.success()
                return _context43.abrupt('return', {
                  publicHash: publicHash,
                  publicPid: publicPid,
                  publicJoined: publicJoined,
                  type: 'public'
                })

              case 27:
                logStatus.error('Error: Parameter "id" not found!')
                return _context43.abrupt('return', false)

              case 29:
                _context43.next = 33
                break

              case 31:
                logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                return _context43.abrupt('return', false)

              case 33:
                _context43.next = 37
                break

              case 35:
                logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                return _context43.abrupt('return', false)

              case 37:
                _context43.next = 42
                break

              case 39:
                _context43.prev = 39
                _context43.t0 = _context43.catch(0)
                throwError(_context43.t0, 'getVkId')

              case 42:
              case 'end':
                return _context43.stop()
            }
          }
        }, _callee43, null, [[0, 39]])
      }))

      return function getVkId (_x43) {
        return _ref51.apply(this, arguments)
      }
    }())

    var toggleVkActions = /* #__PURE__ */(function () {
      var _ref55 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee44 (_ref54) {
        var website, type, elements, action, _ref54$toFinalUrl, toFinalUrl, isLogin, _iterator7, _step7, element, name, _toFinalUrlElement$ma8, toFinalUrlElement

        return regeneratorRuntime.wrap(function _callee44$ (_context44) {
          while (1) {
            switch (_context44.prev = _context44.next) {
              case 0:
                website = _ref54.website, type = _ref54.type, elements = _ref54.elements, action = _ref54.action, _ref54$toFinalUrl = _ref54.toFinalUrl, toFinalUrl = _ref54$toFinalUrl === void 0 ? {} : _ref54$toFinalUrl
                _context44.prev = 1
                _context44.next = 4
                return verifyVkLogin()

              case 4:
                isLogin = _context44.sent

                if (isLogin) {
                  _context44.next = 7
                  break
                }

                return _context44.abrupt('return')

              case 7:
                _iterator7 = _createForOfIteratorHelper(unique(elements))
                _context44.prev = 8

                _iterator7.s()

              case 10:
                if ((_step7 = _iterator7.n()).done) {
                  _context44.next = 19
                  break
                }

                element = _step7.value
                name = element

                if (website === 'giveawaysu' && toFinalUrl[element]) {
                  toFinalUrlElement = toFinalUrl[element] || ''
                  name = (_toFinalUrlElement$ma8 = toFinalUrlElement.match(/https:\/\/vk\.com\/([^/]+)/)) === null || _toFinalUrlElement$ma8 === void 0 ? void 0 : _toFinalUrlElement$ma8[1]
                }

                if (!name) {
                  _context44.next = 17
                  break
                }

                _context44.next = 17
                return toggleVk(name, action === 'fuck')

              case 17:
                _context44.next = 10
                break

              case 19:
                _context44.next = 24
                break

              case 21:
                _context44.prev = 21
                _context44.t0 = _context44.catch(8)

                _iterator7.e(_context44.t0)

              case 24:
                _context44.prev = 24

                _iterator7.f()

                return _context44.finish(24)

              case 27:
                _context44.next = 32
                break

              case 29:
                _context44.prev = 29
                _context44.t1 = _context44.catch(1)
                throwError(_context44.t1, 'toggleVkActions')

              case 32:
              case 'end':
                return _context44.stop()
            }
          }
        }, _callee44, null, [[1, 29], [8, 21, 24, 27]])
      }))

      return function toggleVkActions (_x44) {
        return _ref55.apply(this, arguments)
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
        throwError(e, 'updateYtbInfo')

        if (notice) {
          Swal.fire({
            title: getI18n('updateYtbInfoError'),
            icon: 'error'
          })
        }
      }
    }

    var toggleYtbChannel = /* #__PURE__ */(function () {
      var _ref56 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee45 (link) {
        var follow
        var _yield$getYtbToken
        var params
        var unknownLink
        var needLogin
        var _ref57
        var apiKey
        var client
        var request
        var channelId
        var logStatus
        var nowTime
        var _yield$httpRequest39
        var result
        var statusText
        var status
        var data
        var _args45 = arguments

        return regeneratorRuntime.wrap(function _callee45$ (_context45) {
          while (1) {
            switch (_context45.prev = _context45.next) {
              case 0:
                follow = _args45.length > 1 && _args45[1] !== undefined ? _args45[1] : true
                _context45.prev = 1
                _context45.next = 4
                return getYtbToken(link, 'channel')

              case 4:
                _yield$getYtbToken = _context45.sent
                params = _yield$getYtbToken.params
                unknownLink = _yield$getYtbToken.unknownLink
                needLogin = _yield$getYtbToken.needLogin
                _ref57 = params || {}, apiKey = _ref57.apiKey, client = _ref57.client, request = _ref57.request, channelId = _ref57.channelId

                if (!(whiteList.enable && !follow && whiteList.youtube.channel.includes(channelId))) {
                  _context45.next = 11
                  break
                }

                return _context45.abrupt('return', {
                  result: 'Skiped',
                  statusText: 'OK',
                  status: 605
                })

              case 11:
                if (!needLogin) {
                  _context45.next = 13
                  break
                }

                return _context45.abrupt('return', echoLog({
                  type: 'custom',
                  text: getI18n('loginYtb')
                }))

              case 13:
                if (!unknownLink) {
                  _context45.next = 15
                  break
                }

                return _context45.abrupt('return', echoLog({
                  type: 'custom',
                  text: getI18n('unsupportedLink')
                }))

              case 15:
                if (apiKey) {
                  _context45.next = 17
                  break
                }

                return _context45.abrupt('return', echoLog({
                  type: 'custom',
                  text: '"getYtbToken" failed'
                }))

              case 17:
                logStatus = echoLog({
                  type: follow ? 'followYtbChannel' : 'unfollowYtbChannel',
                  text: channelId
                })
                nowTime = parseInt(new Date().getTime() / 1000)
                _context45.next = 21
                return httpRequest({
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
                  })
                })

              case 21:
                _yield$httpRequest39 = _context45.sent
                result = _yield$httpRequest39.result
                statusText = _yield$httpRequest39.statusText
                status = _yield$httpRequest39.status
                data = _yield$httpRequest39.data

                if (result === 'Success') {
                  if (data.status === 200) {
                    if (follow && (/"subscribed": true/.test(data.responseText) || data.responseText.includes('The subscription already exists')) || !follow && /"subscribed": false/.test(data.responseText)) {
                      logStatus.success()
                    } else {
                      logStatus.error(getI18n('tryUpdateYtbAuth'), true)
                    }
                  } else {
                    logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                  }
                } else {
                  logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                }

                _context45.next = 32
                break

              case 29:
                _context45.prev = 29
                _context45.t0 = _context45.catch(1)
                throwError(_context45.t0, 'toggleYtbChannel')

              case 32:
              case 'end':
                return _context45.stop()
            }
          }
        }, _callee45, null, [[1, 29]])
      }))

      return function toggleYtbChannel (_x45) {
        return _ref56.apply(this, arguments)
      }
    }())

    var toggleLikeYtbVideo = /* #__PURE__ */(function () {
      var _ref58 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee46 (link) {
        var like
        var _yield$getYtbToken2
        var params
        var unknownLink
        var needLogin
        var _ref59
        var apiKey
        var client
        var request
        var videoId
        var likeParams
        var logStatus
        var nowTime
        var likeVideoData
        var _yield$httpRequest40
        var result
        var statusText
        var status
        var data
        var _args46 = arguments

        return regeneratorRuntime.wrap(function _callee46$ (_context46) {
          while (1) {
            switch (_context46.prev = _context46.next) {
              case 0:
                like = _args46.length > 1 && _args46[1] !== undefined ? _args46[1] : true
                _context46.prev = 1
                _context46.next = 4
                return getYtbToken(link, 'likeVideo')

              case 4:
                _yield$getYtbToken2 = _context46.sent
                params = _yield$getYtbToken2.params
                unknownLink = _yield$getYtbToken2.unknownLink
                needLogin = _yield$getYtbToken2.needLogin
                _ref59 = params || {}, apiKey = _ref59.apiKey, client = _ref59.client, request = _ref59.request, videoId = _ref59.videoId, likeParams = _ref59.likeParams

                if (!(whiteList.enable && !link && whiteList.youtube.video.includes(videoId))) {
                  _context46.next = 11
                  break
                }

                return _context46.abrupt('return', {
                  result: 'Skiped',
                  statusText: 'OK',
                  status: 605
                })

              case 11:
                if (!needLogin) {
                  _context46.next = 13
                  break
                }

                return _context46.abrupt('return', echoLog({
                  type: 'custom',
                  text: '<li>'.concat(getI18n('loginYtb'), '</li>')
                }))

              case 13:
                if (!unknownLink) {
                  _context46.next = 15
                  break
                }

                return _context46.abrupt('return', echoLog({
                  type: 'custom',
                  text: '<li>'.concat(getI18n('unsupportedLink'), '</li>')
                }))

              case 15:
                if (apiKey) {
                  _context46.next = 17
                  break
                }

                return _context46.abrupt('return', echoLog({
                  type: 'custom',
                  text: '<li>"getYtbToken" failed</li>'
                }))

              case 17:
                logStatus = echoLog({
                  type: like ? 'likeYtbVideo' : 'unlikeYtbVideo',
                  text: videoId
                })
                nowTime = parseInt(new Date().getTime() / 1000)
                likeVideoData = {
                  context: {
                    client: client,
                    request: {
                      sessionId: request.sessionId,
                      internalExperimentFlags: [],
                      consistencyTokenJars: []
                    },
                    user: {}
                  },
                  target: {
                    videoId: videoId
                  }
                }

                if (!like) {
                  _context46.next = 26
                  break
                }

                if (!likeParams) {
                  _context46.next = 25
                  break
                }

                likeVideoData.params = likeParams
                _context46.next = 26
                break

              case 25:
                return _context46.abrupt('return', logStatus.error('Empty likeParams'))

              case 26:
                _context46.next = 28
                return httpRequest({
                  url: 'https://www.youtube.com/youtubei/v1/like/'.concat(like ? '' : 'remove', 'like?key=').concat(apiKey),
                  method: 'POST',
                  headers: {
                    origin: 'https://www.youtube.com',
                    referer: 'https://www.youtube.com/watch?v=' + videoId,
                    'content-type': 'application/json',
                    'x-goog-authuser': 0,
                    'x-goog-visitor-id': client.visitorData,
                    'x-origin': 'https://www.youtube.com',
                    authorization: 'SAPISIDHASH '.concat(nowTime, '_').concat(sha1(''.concat(nowTime, ' ').concat(youtubeInfo.PAPISID, ' https://www.youtube.com')))
                  },
                  data: JSON.stringify(likeVideoData)
                })

              case 28:
                _yield$httpRequest40 = _context46.sent
                result = _yield$httpRequest40.result
                statusText = _yield$httpRequest40.statusText
                status = _yield$httpRequest40.status
                data = _yield$httpRequest40.data

                if (result === 'Success') {
                  if (data.status === 200) {
                    if (like && data.responseText.includes('Added to Liked videos') || !like && (data.responseText.includes('Removed from Liked videos') || data.responseText.includes('Dislike removed'))) {
                      logStatus.success()
                    } else {
                      logStatus.error(getI18n('tryUpdateYtbAuth'), true)
                    }
                  } else {
                    logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                  }
                } else {
                  logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                }

                _context46.next = 39
                break

              case 36:
                _context46.prev = 36
                _context46.t0 = _context46.catch(1)
                throwError(_context46.t0, 'toggleYtbChannel')

              case 39:
              case 'end':
                return _context46.stop()
            }
          }
        }, _callee46, null, [[1, 36]])
      }))

      return function toggleLikeYtbVideo (_x46) {
        return _ref58.apply(this, arguments)
      }
    }())

    var getYtbToken = /* #__PURE__ */(function () {
      var _ref60 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee47 (link, type) {
        var logStatus, _yield$httpRequest41, result, statusText, status, data, _data$responseText$ma11, _data$responseText$ma12, apiKey, context, _JSON$parse, client, request, _data$responseText$ma13, channelId, _data$responseText$ma14, _data$responseText$ma15, videoId, likeParams

        return regeneratorRuntime.wrap(function _callee47$ (_context47) {
          while (1) {
            switch (_context47.prev = _context47.next) {
              case 0:
                _context47.prev = 0
                logStatus = echoLog({
                  type: 'getYtbToken'
                })
                _context47.next = 4
                return httpRequest({
                  url: link,
                  method: 'GET'
                })

              case 4:
                _yield$httpRequest41 = _context47.sent
                result = _yield$httpRequest41.result
                statusText = _yield$httpRequest41.statusText
                status = _yield$httpRequest41.status
                data = _yield$httpRequest41.data

                if (!(result === 'Success')) {
                  _context47.next = 54
                  break
                }

                if (!(data.status === 200)) {
                  _context47.next = 50
                  break
                }

                if (!data.responseText.includes('accounts.google.com/ServiceLogin?service=youtube')) {
                  _context47.next = 14
                  break
                }

                logStatus.error('Error:' + getI18n('loginYtb'), true)
                return _context47.abrupt('return', {
                  needLogin: true
                })

              case 14:
                apiKey = (_data$responseText$ma11 = data.responseText.match(/"INNERTUBE_API_KEY":"(.*?)"/)) === null || _data$responseText$ma11 === void 0 ? void 0 : _data$responseText$ma11[1]
                context = ((_data$responseText$ma12 = data.responseText.match(/\(\{"INNERTUBE_CONTEXT":([\w\W]*?)\}\)/)) === null || _data$responseText$ma12 === void 0 ? void 0 : _data$responseText$ma12[1]) || '{}'
                _JSON$parse = JSON.parse(context), client = _JSON$parse.client, request = _JSON$parse.request

                if (!(apiKey && client && request)) {
                  _context47.next = 46
                  break
                }

                client.hl = 'en'

                if (!(type === 'channel')) {
                  _context47.next = 30
                  break
                }

                channelId = (_data$responseText$ma13 = data.responseText.match(/<meta itemprop="channelId" content="(.+?)">/)) === null || _data$responseText$ma13 === void 0 ? void 0 : _data$responseText$ma13[1]

                if (!channelId) {
                  _context47.next = 26
                  break
                }

                logStatus.success()
                return _context47.abrupt('return', {
                  params: {
                    apiKey: apiKey,
                    client: client,
                    request: request,
                    channelId: channelId
                  }
                })

              case 26:
                logStatus.error('Error: Get "channelId" failed!')
                return _context47.abrupt('return', {})

              case 28:
                _context47.next = 44
                break

              case 30:
                if (!(type === 'likeVideo')) {
                  _context47.next = 42
                  break
                }

                videoId = (_data$responseText$ma14 = data.responseText.match(/<link rel="shortlink" href="https:\/\/youtu\.be\/(.*?)">/)) === null || _data$responseText$ma14 === void 0 ? void 0 : _data$responseText$ma14[1]
                likeParams = (_data$responseText$ma15 = data.responseText.match(/"likeParams":"(.*?)"/)) === null || _data$responseText$ma15 === void 0 ? void 0 : _data$responseText$ma15[1]

                if (!videoId) {
                  _context47.next = 38
                  break
                }

                logStatus.success()
                return _context47.abrupt('return', {
                  params: {
                    apiKey: apiKey,
                    client: client,
                    request: request,
                    videoId: videoId,
                    likeParams: likeParams
                  }
                })

              case 38:
                logStatus.error('Error: Get "videoId" failed!')
                return _context47.abrupt('return', {})

              case 40:
                _context47.next = 44
                break

              case 42:
                logStatus.error('Error: Unknown type')
                return _context47.abrupt('return', {})

              case 44:
                _context47.next = 48
                break

              case 46:
                logStatus.error('Error: Parameter "apiKey" not found!')
                return _context47.abrupt('return', {})

              case 48:
                _context47.next = 52
                break

              case 50:
                logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                return _context47.abrupt('return', {})

              case 52:
                _context47.next = 56
                break

              case 54:
                logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                return _context47.abrupt('return', {})

              case 56:
                _context47.next = 61
                break

              case 58:
                _context47.prev = 58
                _context47.t0 = _context47.catch(0)
                throwError(_context47.t0, 'getYtbToken')

              case 61:
              case 'end':
                return _context47.stop()
            }
          }
        }, _callee47, null, [[0, 58]])
      }))

      return function getYtbToken (_x47, _x48) {
        return _ref60.apply(this, arguments)
      }
    }())

    var toggleYtbActions = /* #__PURE__ */(function () {
      var _ref62 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee48 (_ref61) {
        var website, type, elements, action, _ref61$toFinalUrl, toFinalUrl, _iterator8, _step8, element, link

        return regeneratorRuntime.wrap(function _callee48$ (_context48) {
          while (1) {
            switch (_context48.prev = _context48.next) {
              case 0:
                website = _ref61.website, type = _ref61.type, elements = _ref61.elements, action = _ref61.action, _ref61$toFinalUrl = _ref61.toFinalUrl, toFinalUrl = _ref61$toFinalUrl === void 0 ? {} : _ref61$toFinalUrl
                _context48.prev = 1

                if (youtubeInfo.PAPISID) {
                  _context48.next = 4
                  break
                }

                return _context48.abrupt('return', echoLog({
                  type: 'custom',
                  text: '<li style="color:red;">'.concat(getI18n('updateYtbInfo'), '</li>')
                }))

              case 4:
                _iterator8 = _createForOfIteratorHelper(unique(elements))
                _context48.prev = 5

                _iterator8.s()

              case 7:
                if ((_step8 = _iterator8.n()).done) {
                  _context48.next = 23
                  break
                }

                element = _step8.value
                link = element

                if (website === 'giveawaysu' && toFinalUrl[element]) {
                  link = toFinalUrl[element] || ''
                }

                if (!link) {
                  _context48.next = 21
                  break
                }

                _context48.t0 = type
                _context48.next = _context48.t0 === 'channel' ? 15 : _context48.t0 === 'video' ? 18 : 21
                break

              case 15:
                _context48.next = 17
                return toggleYtbChannel(link, action === 'fuck')

              case 17:
                return _context48.abrupt('break', 21)

              case 18:
                _context48.next = 20
                return toggleLikeYtbVideo(link, action === 'fuck')

              case 20:
                return _context48.abrupt('break', 21)

              case 21:
                _context48.next = 7
                break

              case 23:
                _context48.next = 28
                break

              case 25:
                _context48.prev = 25
                _context48.t1 = _context48.catch(5)

                _iterator8.e(_context48.t1)

              case 28:
                _context48.prev = 28

                _iterator8.f()

                return _context48.finish(28)

              case 31:
                _context48.next = 36
                break

              case 33:
                _context48.prev = 33
                _context48.t2 = _context48.catch(1)
                throwError(_context48.t2, 'toggleYtbActions')

              case 36:
              case 'end':
                return _context48.stop()
            }
          }
        }, _callee48, null, [[1, 33], [5, 25, 28, 31]])
      }))

      return function toggleYtbActions (_x49) {
        return _ref62.apply(this, arguments)
      }
    }())

    var toggleActions = /* #__PURE__ */(function () {
      var _ref63 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee49 (e) {
        return regeneratorRuntime.wrap(function _callee49$ (_context49) {
          while (1) {
            switch (_context49.prev = _context49.next) {
              case 0:
                _context49.prev = 0
                _context49.t0 = e.social
                _context49.next = _context49.t0 === 'discord' ? 4 : _context49.t0 === 'ins' ? 5 : _context49.t0 === 'twitter' ? 6 : _context49.t0 === 'twitch' ? 7 : _context49.t0 === 'reddit' ? 8 : _context49.t0 === 'vk' ? 9 : _context49.t0 === 'youtube' ? 10 : 11
                break

              case 4:
                return _context49.abrupt('return', toggleDiscordActions(e))

              case 5:
                return _context49.abrupt('return', toggleInsActions(e))

              case 6:
                return _context49.abrupt('return', toggleTwitterActions(e))

              case 7:
                return _context49.abrupt('return', toggleTwitchActions(e))

              case 8:
                return _context49.abrupt('return', toggleRedditActions(e))

              case 9:
                return _context49.abrupt('return', toggleVkActions(e))

              case 10:
                return _context49.abrupt('return', toggleYtbActions(e))

              case 11:
                return _context49.abrupt('return', toggleSteamActions(e))

              case 12:
                _context49.next = 17
                break

              case 14:
                _context49.prev = 14
                _context49.t1 = _context49.catch(0)
                throwError(_context49.t1, 'toggleActions')

              case 17:
              case 'end':
                return _context49.stop()
            }
          }
        }, _callee49, null, [[0, 14]])
      }))

      return function toggleActions (_x50) {
        return _ref63.apply(this, arguments)
      }
    }())

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

    var assignment = function assignment (_ref64, config, action, website) {
      var groups = _ref64.groups
      var forums = _ref64.forums
      var curators = _ref64.curators
      var publishers = _ref64.publishers
      var developers = _ref64.developers
      var franchises = _ref64.franchises
      var fGames = _ref64.fGames
      var wGames = _ref64.wGames
      var announcements = _ref64.announcements
      var discords = _ref64.discords
      var instagrams = _ref64.instagrams
      var twitchs = _ref64.twitchs
      var reddits = _ref64.reddits
      var vks = _ref64.vks
      var twitterUsers = _ref64.twitterUsers
      var retweets = _ref64.retweets
      var youtubeChannels = _ref64.youtubeChannels
      var youtubeVideos = _ref64.youtubeVideos
      var toFinalUrl = _ref64.toFinalUrl
      var toGuild = _ref64.toGuild
      var pro = []
      var fuck = action === 'fuck'

      if (groups && groups.length > 0 && config[fuck ? 'joinSteamGroup' : 'leaveSteamGroup']) {
        pro.push(toggleActions({
          website: website,
          type: 'group',
          elements: groups,
          action: action,
          toFinalUrl: toFinalUrl
        }))
      }

      if (forums && forums.length > 0 && config[fuck ? 'subscribeSteamForum' : 'unsubscribeSteamForum']) {
        pro.push(toggleActions({
          website: website,
          type: 'forum',
          elements: forums,
          action: action,
          toFinalUrl: toFinalUrl
        }))
      }

      if (curators && curators.length > 0 && config[fuck ? 'followCurator' : 'unfollowCurator']) {
        pro.push(toggleActions({
          website: website,
          type: 'curator',
          elements: curators,
          action: action,
          toFinalUrl: toFinalUrl
        }))
      }

      if (publishers && publishers.length > 0 && config[fuck ? 'followPublisher' : 'unfollowPublisher']) {
        pro.push(toggleActions({
          website: website,
          type: 'publisher',
          elements: publishers,
          action: action,
          toFinalUrl: toFinalUrl
        }))
      }

      if (developers && developers.length > 0 && config[fuck ? 'followDeveloper' : 'unfollowDeveloper']) {
        pro.push(toggleActions({
          website: website,
          type: 'developer',
          elements: developers,
          action: action,
          toFinalUrl: toFinalUrl
        }))
      }

      if (franchises && franchises.length > 0 && config[fuck ? 'followFranchise' : 'unfollowFranchise']) {
        pro.push(toggleActions({
          website: website,
          type: 'franchise',
          elements: franchises,
          action: action,
          toFinalUrl: toFinalUrl
        }))
      }

      if (fGames && fGames.length > 0 && config[fuck ? 'followGame' : 'unfollowGame']) {
        pro.push(toggleActions({
          website: website,
          type: 'game',
          elements: fGames,
          action: action,
          toFinalUrl: toFinalUrl
        }))
      }

      if (wGames && wGames.length > 0 && config[fuck ? 'addToWishlist' : 'removeFromWishlist']) {
        pro.push(toggleActions({
          website: website,
          type: 'wishlist',
          elements: wGames,
          action: action,
          toFinalUrl: toFinalUrl
        }))
      }

      if (fuck && announcements && announcements.length > 0 && config.fuck.likeAnnouncement) {
        pro.push(toggleActions({
          website: website,
          type: 'announcement',
          elements: announcements,
          action: action,
          toFinalUrl: toFinalUrl
        }))
      }

      if (instagrams && instagrams.length > 0 && config[fuck ? 'followIns' : 'unfollowIns']) {
        pro.push(toggleActions({
          website: website,
          social: 'ins',
          elements: instagrams,
          action: action,
          toFinalUrl: toFinalUrl
        }))
      }

      if (twitchs && twitchs.length > 0 && config[fuck ? 'followTwitchChannel' : 'unfollowTwitchChannel']) {
        pro.push(toggleActions({
          website: website,
          social: 'twitch',
          elements: twitchs,
          action: action,
          toFinalUrl: toFinalUrl
        }))
      }

      if (reddits && reddits.length > 0 && config[fuck ? 'joinReddit' : 'leaveReddit']) {
        pro.push(toggleActions({
          website: website,
          social: 'reddit',
          elements: reddits,
          action: action,
          toFinalUrl: toFinalUrl
        }))
      }

      if (youtubeChannels && youtubeChannels.length > 0 && config[fuck ? 'followYoutubeChannel' : 'unfollowYoutubeChannel']) {
        pro.push(toggleActions({
          website: website,
          social: 'youtube',
          type: 'channel',
          elements: youtubeChannels,
          action: action,
          toFinalUrl: toFinalUrl
        }))
      }

      if (youtubeVideos && youtubeVideos.length > 0 && config[fuck ? 'likeYoutubeVideo' : 'unlikeYoutubeVideo']) {
        pro.push(toggleActions({
          website: website,
          social: 'youtube',
          type: 'video',
          elements: youtubeVideos,
          action: action,
          toFinalUrl: toFinalUrl
        }))
      }

      if (vks && vks.length > 0 && config[fuck ? 'joinVk' : 'leaveVk']) {
        pro.push(toggleActions({
          website: website,
          social: 'vk',
          elements: vks,
          action: action,
          toFinalUrl: toFinalUrl
        }))
      }

      if (twitterUsers && twitterUsers.length > 0 && config[fuck ? 'followTwitterUser' : 'unfollowTwitterUser']) {
        pro.push(toggleActions({
          website: website,
          social: 'twitter',
          type: 'follow',
          elements: twitterUsers,
          action: action,
          toFinalUrl: toFinalUrl
        }))
      }

      if (retweets && retweets.length > 0 && config[fuck ? 'retweet' : 'unretweet']) {
        pro.push(toggleActions({
          website: website,
          social: 'twitter',
          type: 'retweet',
          elements: retweets,
          action: action,
          toFinalUrl: toFinalUrl
        }))
      }

      if (discords && discords.length > 0 && config[fuck ? 'joinDiscordServer' : 'leaveDiscordServer']) {
        pro.push(toggleActions({
          website: website,
          social: 'discord',
          elements: discords,
          action: action,
          toFinalUrl: toFinalUrl,
          toGuild: toGuild
        }))
      }

      return Promise.all(pro)
    }

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
        var _i18n$language, _i18n$language2

        var value = 'null'
        if (str) value = ((_i18n$language = i18n[language]) === null || _i18n$language === void 0 ? void 0 : _i18n$language[name]) ? i18n[language][name].replace(/s%/g, str) : name; else value = ((_i18n$language2 = i18n[language]) === null || _i18n$language2 === void 0 ? void 0 : _i18n$language2[name]) || name
        return value
      } catch (e) {
        throwError(e, 'getI18n')
      }
    }

    var getDiscordAuth = function getDiscordAuth (notice) {
      try {
        if (typeof discordAuth === 'string') {
          GM_setValue('discordInfo', {
            authorization: discordAuth.replace(/"/g, ''),
            expired: false,
            updateTime: new Date().getTime()
          })

          if (notice) {
            Swal.fire({
              title: getI18n('updateDiscordInfoSuccess'),
              icon: 'success'
            })
          }
        } else {
          if (notice) {
            Swal.fire({
              title: getI18n('updateDiscordInfoError'),
              icon: 'error'
            })
          }
        }
      } catch (e) {
        throwError(e, 'getDiscordAuth')

        if (notice) {
          Swal.fire({
            title: getI18n('updateDiscordInfoError'),
            icon: 'error'
          })
        }
      }
    }

    var newTabBlock = function newTabBlock () {
      try {
        var date = new Date()
        var cookiename = 'haveVisited1'
        document.cookie = cookiename + '=1; path=/'
        document.cookie = cookiename + '=' + (date.getUTCMonth() + 1) + '/' + date.getUTCDate() + '/' + date.getUTCFullYear() + '; path=/'
      } catch (e) {
        throwError(e, 'newTabBlock')
      }
    }

    var checkUpdate = /* #__PURE__ */(function () {
      var _ref65 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee50 () {
        var s
        var logStatus
        var _yield$httpRequest42
        var result
        var statusText
        var status
        var data
        var _data$response18
        var _GM_info$script$versi
        var _GM_info$script$versi2
        var ov1
        var ov2
        var ov3
        var _data$response$versio
        var _data$response$versio2
        var nv1
        var nv2
        var nv3
        var _args50 = arguments

        return regeneratorRuntime.wrap(function _callee50$ (_context50) {
          while (1) {
            switch (_context50.prev = _context50.next) {
              case 0:
                s = _args50.length > 0 && _args50[0] !== undefined ? _args50[0] : false
                _context50.prev = 1
                logStatus = false
                if (s) {
                  logStatus = echoLog({
                    type: 'custom',
                    text: '<li>'.concat(getI18n('checkingUpdate'), '<font></font></li>')
                  })
                }
                _context50.next = 6
                return httpRequest({
                  url: 'https://auto-task-test.hclonely.com/version.json?t=' + new Date().getTime(),
                  method: 'get',
                  dataType: 'json'
                })

              case 6:
                _yield$httpRequest42 = _context50.sent
                result = _yield$httpRequest42.result
                statusText = _yield$httpRequest42.statusText
                status = _yield$httpRequest42.status
                data = _yield$httpRequest42.data

                if (result === 'Success') {
                  _GM_info$script$versi = GM_info.script.version.split('.'), _GM_info$script$versi2 = _slicedToArray(_GM_info$script$versi, 3), ov1 = _GM_info$script$versi2[0], ov2 = _GM_info$script$versi2[1], ov3 = _GM_info$script$versi2[2]

                  if ((_data$response18 = data.response) === null || _data$response18 === void 0 ? void 0 : _data$response18.version) {
                    _data$response$versio = data.response.version.split('.'), _data$response$versio2 = _slicedToArray(_data$response$versio, 3), nv1 = _data$response$versio2[0], nv2 = _data$response$versio2[1], nv3 = _data$response$versio2[2]

                    if (nv1 > ov1 || nv1 === ov1 && nv2 > ov2 || nv1 === ov1 && nv2 === ov2 && nv3 > ov3) {
                      echoLog({
                        type: 'custom',
                        text: '<li>'.concat(getI18n('newVer') + 'V' + data.response.version, '<a href="https://auto-task-test.hclonely.com/auto-task-test.user.js?t=').concat(new Date().getTime(), '" target="_blank">').concat(getI18n('updateNow'), '</a><font></font></li>')
                      })
                      if (s) logStatus.success(getI18n('newVer') + data.response.version)
                    } else {
                      if (s) logStatus.success(getI18n('thisIsNew'))
                    }
                  } else {
                    if (s) logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                  }
                } else {
                  if (s) logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                }

                _context50.next = 17
                break

              case 14:
                _context50.prev = 14
                _context50.t0 = _context50.catch(1)
                throwError(_context50.t0, 'checkUpdate')

              case 17:
              case 'end':
                return _context50.stop()
            }
          }
        }, _callee50, null, [[1, 14]])
      }))

      return function checkUpdate () {
        return _ref65.apply(this, arguments)
      }
    }())

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
          retweets: [],
          youtubeChannels: [],
          youtubeVideos: []
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
        var pro = []

        if (steamStore && steamCommunity) {
          pro.push(updateSteamInfo('all'))
        } else if (steamStore) {
          pro.push(updateSteamInfo('store'))
        } else if (steamCommunity) {
          pro.push(updateSteamInfo('community'))
        }

        if (twitter && new Date().getTime() - twitterInfo.updateTime > 15 * 60 * 1000) {
          pro.push(updateTwitterInfo())
        }

        return Promise.all(pro)
      } catch (e) {
        throwError(e, 'updateInfo')
      }
    }

    var getId = /* #__PURE__ */(function () {
      var _ref99 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee96 () {
        var _link$match7, _link$match8, _link$match9, _ref102, _link$match10, _link$match11, _link$match14, _link$match15, _link$match16, _link$match17

        var _yield$Swal$fire$then, _yield$Swal$fire$then2, type, link, result, _link$match12, _link$match13, userName, _yield$getYtbToken3, params, _yield$getYtbToken4, _params

        return regeneratorRuntime.wrap(function _callee96$ (_context97) {
          while (1) {
            switch (_context97.prev = _context97.next) {
              case 0:
                _context97.prev = 0
                _context97.next = 3
                return Swal.fire({
                  title: 'Select type',
                  input: 'select',
                  inputOptions: {
                    Steam: {
                      's-group': 'group',
                      's-wishlist': 'wishlist',
                      's-game': 'game',
                      's-curator': 'curator',
                      's-otherCurator': 'otherCurator',
                      's-forum': 'forum'
                    },
                    discord: {
                      'd-server': 'server'
                    },
                    instagram: {
                      'i-user': 'user'
                    },
                    reddit: {
                      'r-reddit': 'reddit'
                    },
                    twitch: {
                      'tc-channel': 'channel'
                    },
                    twitter: {
                      'tt-user': 'user',
                      'tt-tweet': 'tweet'
                    },
                    vk: {
                      'v-vk': 'vk'
                    },
                    youtube: {
                      'y-channel': 'channel',
                      'y-video': 'video'
                    }
                  },
                  inputPlaceholder: 'Select a type',
                  showCancelButton: true
                }).then(/* #__PURE__ */function () {
                  var _ref101 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee95 (_ref100) {
                    var type, _yield$Swal$fire, url

                    return regeneratorRuntime.wrap(function _callee95$ (_context96) {
                      while (1) {
                        switch (_context96.prev = _context96.next) {
                          case 0:
                            type = _ref100.value
                            _context96.next = 3
                            return Swal.fire({
                              input: 'url',
                              inputLabel: 'Link',
                              inputPlaceholder: 'Enter the URL'
                            })

                          case 3:
                            _yield$Swal$fire = _context96.sent
                            url = _yield$Swal$fire.value

                            if (!(url && type)) {
                              _context96.next = 7
                              break
                            }

                            return _context96.abrupt('return', [type, url])

                          case 7:
                          case 'end':
                            return _context96.stop()
                        }
                      }
                    }, _callee95)
                  }))

                  return function (_x57) {
                    return _ref101.apply(this, arguments)
                  }
                }())

              case 3:
                _yield$Swal$fire$then = _context97.sent
                _yield$Swal$fire$then2 = _slicedToArray(_yield$Swal$fire$then, 2)
                type = _yield$Swal$fire$then2[0]
                link = _yield$Swal$fire$then2[1]

                if (!(type && link)) {
                  _context97.next = 49
                  break
                }

                _context97.t0 = type
                _context97.next = _context97.t0 === 's-group' ? 11 : _context97.t0 === 's-game' ? 13 : _context97.t0 === 's-wishlist' ? 13 : _context97.t0 === 's-forum' ? 13 : _context97.t0 === 's-curator' ? 15 : _context97.t0 === 's-otherCurator' ? 17 : _context97.t0 === 'd-server' ? 19 : _context97.t0 === 'i-user' ? 21 : _context97.t0 === 'r-reddit' ? 23 : _context97.t0 === 'tc-channel' ? 28 : _context97.t0 === 'tt-user' ? 30 : _context97.t0 === 'tt-tweet' ? 32 : _context97.t0 === 'v-vk' ? 34 : _context97.t0 === 'y-channel' ? 36 : _context97.t0 === 'y-video' ? 42 : 48
                break

              case 11:
                result = (_link$match7 = link.match(/steamcommunity\.com\/groups\/([^/]+)/)) === null || _link$match7 === void 0 ? void 0 : _link$match7[1]
                return _context97.abrupt('break', 48)

              case 13:
                result = (_link$match8 = link.match(/store\.steampowered\.com\/app\/([\d]+)/)) === null || _link$match8 === void 0 ? void 0 : _link$match8[1]
                return _context97.abrupt('break', 48)

              case 15:
                result = (_link$match9 = link.match(/store\.steampowered\.com\/curator\/([\d]+)/)) === null || _link$match9 === void 0 ? void 0 : _link$match9[1]
                return _context97.abrupt('break', 48)

              case 17:
                result = (_ref102 = (link.includes('publisher') ? link.match(/store\.steampowered\.com\/publisher\/(.+)\/?/) : link.includes('developer') ? link.match(/store\.steampowered\.com\/developer\/(.+)\/?/) : link.match(/pub\/(.+)\/?/) || link.match(/dev\/(.+)\/?/)) || link.match(/franchise\/(.+)\/?/)) === null || _ref102 === void 0 ? void 0 : _ref102[1]
                return _context97.abrupt('break', 48)

              case 19:
                result = (_link$match10 = link.match(/discord\.com\/invite\/(.+)/)) === null || _link$match10 === void 0 ? void 0 : _link$match10[1]
                return _context97.abrupt('break', 48)

              case 21:
                result = (_link$match11 = link.match(/www\.instagram\.com\/(.+)?\//)) === null || _link$match11 === void 0 ? void 0 : _link$match11[1]
                return _context97.abrupt('break', 48)

              case 23:
                result = (_link$match12 = link.match(/www\.reddit\.com\/r\/([^/]*)/)) === null || _link$match12 === void 0 ? void 0 : _link$match12[1]
                userName = (_link$match13 = link.match(/www\.reddit\.com\/user\/([^/]*)/)) === null || _link$match13 === void 0 ? void 0 : _link$match13[1]
                if (userName) userName = 'u_' + userName
                result = result || userName
                return _context97.abrupt('break', 48)

              case 28:
                result = (_link$match14 = link.match(/www\.twitch\.tv\/(.+)/)) === null || _link$match14 === void 0 ? void 0 : _link$match14[1]
                return _context97.abrupt('break', 48)

              case 30:
                result = (_link$match15 = link.match(/twitter\.com\/(.+)/)) === null || _link$match15 === void 0 ? void 0 : _link$match15[1]
                return _context97.abrupt('break', 48)

              case 32:
                result = (_link$match16 = link.match(/twitter\.com\/.*?\/status\/([\d]+)/)) === null || _link$match16 === void 0 ? void 0 : _link$match16[1]
                return _context97.abrupt('break', 48)

              case 34:
                result = (_link$match17 = link.match(/vk\.com\/([^/]+)/)) === null || _link$match17 === void 0 ? void 0 : _link$match17[1]
                return _context97.abrupt('break', 48)

              case 36:
                _context97.next = 38
                return getYtbToken(link, 'channel')

              case 38:
                _yield$getYtbToken3 = _context97.sent
                params = _yield$getYtbToken3.params
                result = params === null || params === void 0 ? void 0 : params.channelId
                return _context97.abrupt('break', 48)

              case 42:
                _context97.next = 44
                return getYtbToken(link, 'likeVideo')

              case 44:
                _yield$getYtbToken4 = _context97.sent
                _params = _yield$getYtbToken4.params
                result = _params === null || _params === void 0 ? void 0 : _params.videoId
                return _context97.abrupt('break', 48)

              case 48:
                if (result) {
                  Swal.fire({
                    icon: 'success',
                    title: link,
                    text: result
                  })
                }

              case 49:
                _context97.next = 54
                break

              case 51:
                _context97.prev = 51
                _context97.t1 = _context97.catch(0)
                throwError(_context97.t1, 'getId')

              case 54:
              case 'end':
                return _context97.stop()
            }
          }
        }, _callee96, null, [[0, 51]])
      }))

      return function getId () {
        return _ref99.apply(this, arguments)
      }
    }())

    unsafeWindow.AutoTask = {}
    'use strict'

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
          likeYoutubeVideo: true,
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
          unlikeYoutubeVideo: true,
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
          likeYoutubeVideo: true,
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
          unlikeYoutubeVideo: true,
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
      givekey: {
        fuck: {
          joinSteamGroup: true,
          followCurator: true,
          addToWishlist: true,
          followGame: true,
          joinVk: true,
          visitLink: true
        },
        remove: {
          leaveSteamGroup: true,
          unfollowCurator: true,
          removeFromWishlist: true,
          leaveVk: true,
          unfollowGame: true
        },
        enable: false
      },
      takekey: {
        fuck: {
          joinSteamGroup: true,

          joinVk: true,
          visitLink: true,

          verifyTask: true
        },
        remove: {
          leaveSteamGroup: true,

          leaveVk: true
        },
        enable: false
      },
      keyhub: {
        fuck: {
          joinSteamGroup: true,
          addToWishlist: true,
          visitLink: true,
          verifyTask: true
        },
        remove: {
          leaveSteamGroup: true,
          removeFromWishlist: true
        },
        enable: false
      },
      gleam: {
        fuck: {
          joinSteamGroup: true,
          followTwitterUser: true,
          retweet: true,
          joinDiscordServer: true,
          visitLink: true,
          verifyTask: true
        },
        remove: {
          leaveSteamGroup: true,
          unfollowTwitterUser: true,
          unretweet: true,
          leaveDiscordServer: true
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
      whiteList: {
        steam: {
          group: [],
          wishlist: [],
          game: [],
          curator: [],
          otherCurator: [],
          forum: []
        },
        discord: {
          server: []
        },
        instagram: {
          user: []
        },
        reddit: {
          reddit: []
        },
        twitch: {
          channel: []
        },
        twitter: {
          user: [],
          tweet: []
        },
        vk: {
          vk: []
          /*
          group: [],
          public: [],
          wall: []
          */

        },
        youtube: {
          channel: [],
          video: []
        },
        enable: false
      }
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

            if (Object.prototype.toString.call(defaultConfig[k][k1]) === '[object Object]') {
              config[k][k1] = Object.assign(defaultConfig[k][k1], config[k][k1])
            } else {
              var _config$k$k

              config[k][k1] = (_config$k$k = config[k][k1]) !== null && _config$k$k !== void 0 ? _config$k$k : defaultConfig[k][k1]
            }
          }
        } else {
          var _config$k

          config[k] = (_config$k = config[k]) !== null && _config$k !== void 0 ? _config$k : defaultConfig[k]
        }
      }
    }

    var globalConf = config.global
    var debug = globalConf.other.showDetails
    window.whiteList = getWhiteList()
    var language = getLanguage()
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
      assignment: assignment,
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
          return window.location.host === 'www.bananagiveaway.com' || window.location.host === 'www.grabfreegame.com'
        } catch (e) {
          throwError(e, 'banana.test')
        }
      },
      fuck: function fuck () {
        var _this = this

        try {
          var needBanana = $("p:contains('Collect'):contains('banana')")
          var needPoints = $("p:contains('Collect'):contains('point')")
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
            }).then(function (_ref66) {
              var value = _ref66.value

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
            var status = fuc.echoLog({
              type: 'custom',
              text: '<li>'.concat(getI18n('processTasksInfo'), '<font></font></li>')
            })
            var tasksUl = $('ul.tasks li:not(:contains(Completed))')
            var pro = []

            var _iterator9 = _createForOfIteratorHelper(tasksUl)
            var _step9

            try {
              var _loop = function _loop () {
                var _verifyBtn$attr, _verifyBtn$attr$match

                var task = _step9.value
                var taskDes = $(task).find('p')
                var verifyBtn = $(task).find('button:contains(Verify)')
                var taskId = (_verifyBtn$attr = verifyBtn.attr('onclick')) === null || _verifyBtn$attr === void 0 ? void 0 : (_verifyBtn$attr$match = _verifyBtn$attr.match(/\?verify=([\d]+)/)) === null || _verifyBtn$attr$match === void 0 ? void 0 : _verifyBtn$attr$match[1]

                if (taskId) {
                  _this2.currentTaskInfo.tasks.push({
                    taskId: taskId,
                    taskDes: taskDes.text()
                  })

                  if (/join.*?steam.*?group/gim.test(taskDes.text())) {
                    pro.push(fuc.getFinalUrl(window.location.origin + window.location.pathname + '?q=' + taskId).then(function (_ref67) {
                      var result = _ref67.result
                      var finalUrl = _ref67.finalUrl

                      if (result === 'Success') {
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
                    }))
                  } else if (/follow.*?curator/gim.test(taskDes.text())) {
                    pro.push(fuc.getFinalUrl(window.location.origin + window.location.pathname + '?q=' + taskId).then(function (_ref68) {
                      var result = _ref68.result
                      var finalUrl = _ref68.finalUrl

                      if (result === 'Success') {
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
                    }))
                  } else if (/wishlist/gim.test(taskDes.text())) {
                    pro.push(fuc.getFinalUrl(window.location.origin + window.location.pathname + '?q=' + taskId).then(function (_ref69) {
                      var result = _ref69.result
                      var finalUrl = _ref69.finalUrl

                      if (result === 'Success') {
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
                    }))
                  } else if (/Retweet/gim.test(taskDes.text())) {
                    pro.push(fuc.getFinalUrl(window.location.origin + window.location.pathname + '?q=' + taskId).then(function (_ref70) {
                      var result = _ref70.result
                      var finalUrl = _ref70.finalUrl

                      if (result === 'Success') {
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
                    }))
                  } else {
                    if (/(Subscribe.*channel)|(Twitter)|(Retweet)/gim.test(taskDes.text())) {
                      if (!_this2.verifyBtn) _this2.verifyBtn = taskDes.parent().find('button:contains(Verify)')

                      if (callback === 'do_task' && globalConf.other.autoOpen) {
                        taskDes.parent().find('button')[0].click()
                      }
                    }

                    pro.push(new Promise(function (resolve) {
                      _this2.currentTaskInfo.links.push(window.location.origin + window.location.pathname + '?q=' + taskId)

                      _this2.currentTaskInfo.taskIds.push(taskId)

                      resolve(1)
                    }))
                  }
                }
              }

              for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
                _loop()
              }
            } catch (err) {
              _iterator9.e(err)
            } finally {
              _iterator9.f()
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
        } catch (e) {
          throwError(e, 'banana.get_tasks')
        }
      },
      do_task: function do_task () {
        var _this3 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee51 () {
          var pro, links, _iterator10, _step10, link

          return regeneratorRuntime.wrap(function _callee51$ (_context51) {
            while (1) {
              switch (_context51.prev = _context51.next) {
                case 0:
                  _context51.prev = 0
                  pro = []
                  pro.push(_this3.toggleActions('fuck'))
                  links = fuc.unique(_this3.currentTaskInfo.links)

                  if (!_this3.conf.fuck.visitLink) {
                    _context51.next = 23
                    break
                  }

                  _iterator10 = _createForOfIteratorHelper(links)
                  _context51.prev = 6

                  _iterator10.s()

                case 8:
                  if ((_step10 = _iterator10.n()).done) {
                    _context51.next = 15
                    break
                  }

                  link = _step10.value
                  pro.push(fuc.visitLink(link))
                  _context51.next = 13
                  return fuc.delay(1000)

                case 13:
                  _context51.next = 8
                  break

                case 15:
                  _context51.next = 20
                  break

                case 17:
                  _context51.prev = 17
                  _context51.t0 = _context51.catch(6)

                  _iterator10.e(_context51.t0)

                case 20:
                  _context51.prev = 20

                  _iterator10.f()

                  return _context51.finish(20)

                case 23:
                  Promise.all(pro).finally(function () {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                    })
                    if (_this3.conf.fuck.verifyTask) _this3.verify()
                  })
                  _context51.next = 29
                  break

                case 26:
                  _context51.prev = 26
                  _context51.t1 = _context51.catch(0)
                  throwError(_context51.t1, 'banana.do_task')

                case 29:
                case 'end':
                  return _context51.stop()
              }
            }
          }, _callee51, null, [[0, 26], [6, 17, 20, 23]])
        }))()
      },
      verifyTask: function verifyTask (task) {
        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee52 () {
          var logStatus, _yield$fuc$httpReques, result, statusText, status

          return regeneratorRuntime.wrap(function _callee52$ (_context52) {
            while (1) {
              switch (_context52.prev = _context52.next) {
                case 0:
                  logStatus = fuc.echoLog({
                    type: 'custom',
                    text: '<li>'.concat(getI18n('verifyingTask')).concat(task.taskDes, '...<font></font></li>')
                  })
                  _context52.next = 3
                  return fuc.httpRequest({
                    url: window.location.origin + window.location.pathname + '?verify=' + task.taskId,
                    method: 'GET'
                  })

                case 3:
                  _yield$fuc$httpReques = _context52.sent
                  result = _yield$fuc$httpReques.result
                  statusText = _yield$fuc$httpReques.statusText
                  status = _yield$fuc$httpReques.status

                  if (result === 'Success') {
                    logStatus.warning('Complete')
                  } else {
                    logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                  }

                case 8:
                case 'end':
                  return _context52.stop()
              }
            }
          }, _callee52)
        }))()
      },
      verify: function verify () {
        var _arguments = arguments
        var _this4 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee53 () {
          var verify, pro, _iterator11, _step11, task

          return regeneratorRuntime.wrap(function _callee53$ (_context53) {
            while (1) {
              switch (_context53.prev = _context53.next) {
                case 0:
                  verify = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : false
                  _context53.prev = 1

                  if (!verify) {
                    _context53.next = 25
                    break
                  }

                  pro = []
                  _iterator11 = _createForOfIteratorHelper(fuc.unique(_this4.currentTaskInfo.tasks))
                  _context53.prev = 5

                  _iterator11.s()

                case 7:
                  if ((_step11 = _iterator11.n()).done) {
                    _context53.next = 14
                    break
                  }

                  task = _step11.value
                  pro.push(_this4.verifyTask(task))
                  _context53.next = 12
                  return fuc.delay(500)

                case 12:
                  _context53.next = 7
                  break

                case 14:
                  _context53.next = 19
                  break

                case 16:
                  _context53.prev = 16
                  _context53.t0 = _context53.catch(5)

                  _iterator11.e(_context53.t0)

                case 19:
                  _context53.prev = 19

                  _iterator11.f()

                  return _context53.finish(19)

                case 22:
                  Promise.all(pro).finally(function () {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="success">'.concat(getI18n('verifyTasksComplete'), '</font></li>')
                    })
                    _this4.verifyBtn.length > 0 ? _this4.verifyBtn.removeAttr('disabled')[0].click() : window.location.reload(true)
                  })
                  _context53.next = 26
                  break

                case 25:
                  _this4.get_tasks('verify')

                case 26:
                  _context53.next = 31
                  break

                case 28:
                  _context53.prev = 28
                  _context53.t1 = _context53.catch(1)
                  throwError(_context53.t1, 'banana.verify')

                case 31:
                case 'end':
                  return _context53.stop()
              }
            }
          }, _callee53, null, [[1, 28], [5, 16, 19, 22]])
        }))()
      },
      remove: function remove () {
        var _arguments2 = arguments
        var _this5 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee54 () {
          var remove
          return regeneratorRuntime.wrap(function _callee54$ (_context54) {
            while (1) {
              switch (_context54.prev = _context54.next) {
                case 0:
                  remove = _arguments2.length > 0 && _arguments2[0] !== undefined ? _arguments2[0] : false
                  _context54.prev = 1

                  if (!remove) {
                    _context54.next = 8
                    break
                  }

                  _context54.next = 5
                  return _this5.toggleActions('remove')

                case 5:
                  fuc.echoLog({
                    type: 'custom',
                    text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                  })
                  _context54.next = 9
                  break

                case 8:
                  _this5.get_tasks('remove')

                case 9:
                  _context54.next = 14
                  break

                case 11:
                  _context54.prev = 11
                  _context54.t0 = _context54.catch(1)
                  throwError(_context54.t0, 'banana.remove')

                case 14:
                case 'end':
                  return _context54.stop()
              }
            }
          }, _callee54, null, [[1, 11]])
        }))()
      },
      toggleActions: function toggleActions (action) {
        var _this6 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee55 () {
          var fuck, taskInfo
          return regeneratorRuntime.wrap(function _callee55$ (_context55) {
            while (1) {
              switch (_context55.prev = _context55.next) {
                case 0:
                  _context55.prev = 0
                  fuck = action === 'fuck'
                  taskInfo = fuck ? _this6.currentTaskInfo : _this6.taskInfo
                  _context55.next = 5
                  return fuc.updateInfo(taskInfo)

                case 5:
                  _context55.next = 7
                  return fuc.assignment(taskInfo, _this6.conf[action], action, 'banana')

                case 7:
                  _context55.next = 12
                  break

                case 9:
                  _context55.prev = 9
                  _context55.t0 = _context55.catch(0)
                  throwError(_context55.t0, 'banana.toggleActions')

                case 12:
                case 'end':
                  return _context55.stop()
              }
            }
          }, _callee55, null, [[0, 9]])
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
            }).then(function (_ref71) {
              var value = _ref71.value

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
      conf: (config === null || config === void 0 ? void 0 : (_config$banana = config.banana) === null || _config$banana === void 0 ? void 0 : _config$banana.enable) ? config.banana : globalConf
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
        var _this7 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee56 () {
          var userInfo, logStatus, _yield$fuc$httpReques2, result, statusText, status, data

          return regeneratorRuntime.wrap(function _callee56$ (_context56) {
            while (1) {
              switch (_context56.prev = _context56.next) {
                case 0:
                  _context56.prev = 0
                  GM_setValue('lottery', 1)

                  if (!($('a.registration-button').length > 0)) {
                    _context56.next = 26
                    break
                  }

                  if (!_this7.conf.fuck.autoLogin) {
                    _context56.next = 22
                    break
                  }

                  userInfo = GM_getValue('conf').freegamelottery.userInfo

                  if (!userInfo) {
                    _context56.next = 17
                    break
                  }

                  logStatus = fuc.echoLog({
                    type: 'custom',
                    text: '<li>'.concat(getI18n('logining'), '<font></font></li>')
                  })
                  _context56.next = 9
                  return fuc.httpRequest({
                    url: 'https://freegamelottery.com/user/login',
                    method: 'POST',
                    data: 'username='.concat(userInfo.username, '&password=').concat(userInfo.password, '&rememberMe=1'),
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                  })

                case 9:
                  _yield$fuc$httpReques2 = _context56.sent
                  result = _yield$fuc$httpReques2.result
                  statusText = _yield$fuc$httpReques2.statusText
                  status = _yield$fuc$httpReques2.status
                  data = _yield$fuc$httpReques2.data

                  if (result === 'Success') {
                    if (data.status === 200) {
                      logStatus.success()
                      window.location.reload(true)
                    } else {
                      logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                    }
                  } else {
                    logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                  }

                  _context56.next = 20
                  break

                case 17:
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

                case 20:
                  _context56.next = 24
                  break

                case 22:
                  $('body').overhang({
                    type: 'warn',
                    activity: 'notification',
                    message: getI18n('needLogin')
                  })
                  $('a.registration-button')[0].click()

                case 24:
                  _context56.next = 27
                  break

                case 26:
                  _this7.draw()

                case 27:
                  _context56.next = 32
                  break

                case 29:
                  _context56.prev = 29
                  _context56.t0 = _context56.catch(0)
                  throwError(_context56.t0, 'freegamelottery.fuck')

                case 32:
                case 'end':
                  return _context56.stop()
              }
            }
          }, _callee56, null, [[0, 29]])
        }))()
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
      conf: (config === null || config === void 0 ? void 0 : (_config$freegamelotte = config.freegamelottery) === null || _config$freegamelotte === void 0 ? void 0 : _config$freegamelotte.enable) ? config.freegamelottery : globalConf
    }
    var gamehag = {
      test: function test () {
        try {
          return window.location.host === 'gamehag.com'
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
        var _this8 = this

        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'do_task'

        try {
          var status = fuc.echoLog({
            type: 'custom',
            text: '<li>'.concat(getI18n('getTasksInfo'), '<font></font></li>')
          })
          var verifyBtns = $('button[data-id]')
          var taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
          if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory

          if (callback === 'remove' && taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
            status.success()
            this.remove(true)
          } else if (callback === 'do_task') {
            this.currentTaskInfo = fuc.clearTaskInfo(this.currentTaskInfo)
            var pro = []

            var _iterator12 = _createForOfIteratorHelper(verifyBtns)
            var _step12

            try {
              for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
                var btn = _step12.value
                var _ref72 = [$(btn).attr('data-id'), $(btn).parent().prev().text(), $(btn).parent().parent().prev().find('use').attr('xlink:href') || '', $(btn).parent().find('a:contains("to do")').attr('href')]
                var _taskId = _ref72[0]
                var _taskDes = _ref72[1]
                var taskIcon = _ref72[2]
                var taskUrl = _ref72[3]

                if ($(btn).parents('.task-content').next().text().includes('+1')) {
                  (function () {
                    var isSteamGroup = taskIcon.includes('steam') && /join.*?steam.*?group/gim.test(_taskDes)
                    var isTwitterUser = taskIcon.includes('twitter') && /follow/gim.test(_taskDes)
                    var isRetweet = taskIcon.includes('twitter') && /retweet/gim.test(_taskDes)

                    if (isSteamGroup || isTwitterUser || isRetweet) {
                      pro.push(fuc.getFinalUrl(taskUrl).then(function (_ref73) {
                        var result = _ref73.result
                        var finalUrl = _ref73.finalUrl

                        if (result === 'Success') {
                          var _finalUrl$match5, _finalUrl$match6, _finalUrl$match7

                          var groupName = finalUrl === null || finalUrl === void 0 ? void 0 : (_finalUrl$match5 = finalUrl.match(/groups\/(.+)\/?/)) === null || _finalUrl$match5 === void 0 ? void 0 : _finalUrl$match5[1]
                          var userName = finalUrl === null || finalUrl === void 0 ? void 0 : (_finalUrl$match6 = finalUrl.match(/https:\/\/twitter.com\/(.+)/)) === null || _finalUrl$match6 === void 0 ? void 0 : _finalUrl$match6[1]
                          var tweetId = finalUrl === null || finalUrl === void 0 ? void 0 : (_finalUrl$match7 = finalUrl.match(/https:\/\/twitter.com\/.*?\/status\/([\d]+)/)) === null || _finalUrl$match7 === void 0 ? void 0 : _finalUrl$match7[1]

                          if (isSteamGroup && groupName) {
                            _this8.currentTaskInfo.groups.push(groupName)

                            _this8.taskInfo.groups.push(groupName)
                          } else if (isTwitterUser && userName) {
                            _this8.currentTaskInfo.twitterUsers.push(userName)

                            _this8.taskInfo.twitterUsers.push(userName)
                          } else if (isRetweet && tweetId) {
                            _this8.currentTaskInfo.retweets.push(tweetId)

                            _this8.taskInfo.retweets.push(tweetId)
                          }
                        }
                      }))
                    }

                    _this8.currentTaskInfo.tasks.push({
                      taskId: _taskId,
                      taskDes: _taskDes
                    })
                  })()
                }
              }
            } catch (err) {
              _iterator12.e(err)
            } finally {
              _iterator12.f()
            }

            if ($('a.giveaway-survey').length > 0) {
              var taskId = $('a.giveaway-survey').attr('data-task_id')
              var taskDes = 'Complete the survey'
              this.currentTaskInfo.tasks.push({
                taskId: taskId,
                taskDes: taskDes
              })
            }

            Promise.all(pro).finally(function () {
              _this8.currentTaskInfo = fuc.uniqueTaskInfo(_this8.currentTaskInfo)
              _this8.taskInfo = fuc.uniqueTaskInfo(_this8.taskInfo)
              status.success()
              GM_setValue('taskInfo[' + window.location.host + _this8.get_giveawayId() + ']', _this8.taskInfo)

              if (_this8.currentTaskInfo.tasks.length > 0) {
                _this8.do_task()
              } else {
                fuc.echoLog({
                  type: 'custom',
                  text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                })
                if (_this8.conf.fuck.verifyTask) _this8.verify()
              }
            })
          } else if (callback === 'verify') {
            this.currentTaskInfo.tasks = []

            var _iterator13 = _createForOfIteratorHelper(verifyBtns)
            var _step13

            try {
              for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
                var _btn = _step13.value

                var _taskId2 = $(_btn).attr('data-id')

                var _taskDes2 = $(_btn).parent().prev().text()

                if ($(_btn).parents('.task-content').next().text().includes('+1')) {
                  this.currentTaskInfo.tasks.push({
                    taskId: _taskId2,
                    taskDes: _taskDes2
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
        var _this9 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee58 () {
          var pro, tasks, _iterator14, _step14, task

          return regeneratorRuntime.wrap(function _callee58$ (_context58) {
            while (1) {
              switch (_context58.prev = _context58.next) {
                case 0:
                  _context58.prev = 0
                  pro = []
                  tasks = fuc.unique(_this9.currentTaskInfo.tasks)
                  _iterator14 = _createForOfIteratorHelper(tasks)
                  _context58.prev = 4

                  _iterator14.s()

                case 6:
                  if ((_step14 = _iterator14.n()).done) {
                    _context58.next = 20
                    break
                  }

                  task = _step14.value
                  pro.push(fuc.visitLink('/giveaway/click/' + task.taskId, {
                    headers: {
                      'x-csrf-token': $('meta[name="csrf-token"]').attr('content')
                    }
                  }))
                  _context58.next = 11
                  return fuc.delay(500)

                case 11:
                  if (!/play.*?games/gim.test(task.taskDes)) {
                    _context58.next = 16
                    break
                  }

                  pro.push(fuc.visitLink('/games', {
                    headers: {
                      'x-csrf-token': $('meta[name="csrf-token"]').attr('content')
                    }
                  }))
                  _context58.next = 15
                  return fuc.delay(500)

                case 15:
                  pro.push(fuc.visitLink('/games/war-thunder/play', {
                    headers: {
                      'x-csrf-token': $('meta[name="csrf-token"]').attr('content')
                    }
                  }))

                case 16:
                  _context58.next = 18
                  return fuc.delay(1000)

                case 18:
                  _context58.next = 6
                  break

                case 20:
                  _context58.next = 25
                  break

                case 22:
                  _context58.prev = 22
                  _context58.t0 = _context58.catch(4)

                  _iterator14.e(_context58.t0)

                case 25:
                  _context58.prev = 25

                  _iterator14.f()

                  return _context58.finish(25)

                case 28:
                  Promise.all(pro).finally(/* #__PURE__ */_asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee57 () {
                    return regeneratorRuntime.wrap(function _callee57$ (_context57) {
                      while (1) {
                        switch (_context57.prev = _context57.next) {
                          case 0:
                            _context57.next = 2
                            return _this9.toggleActions('fuck')

                          case 2:
                            fuc.echoLog({
                              type: 'custom',
                              text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                            })
                            if (_this9.conf.fuck.verifyTask) _this9.verify()

                          case 4:
                          case 'end':
                            return _context57.stop()
                        }
                      }
                    }, _callee57)
                  })))
                  _context58.next = 34
                  break

                case 31:
                  _context58.prev = 31
                  _context58.t1 = _context58.catch(0)
                  throwError(_context58.t1, 'gamehag.do_task')

                case 34:
                case 'end':
                  return _context58.stop()
              }
            }
          }, _callee58, null, [[0, 31], [4, 22, 25, 28]])
        }))()
      },
      verifyTask: function verifyTask (task) {
        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee59 () {
          var logStatus, _yield$fuc$httpReques3, result, statusText, status, data

          return regeneratorRuntime.wrap(function _callee59$ (_context59) {
            while (1) {
              switch (_context59.prev = _context59.next) {
                case 0:
                  logStatus = fuc.echoLog({
                    type: 'custom',
                    text: '<li>'.concat(getI18n('verifyingTask'), '<a href="/giveaway/click/').concat(task.taskId, '" target="_blank">').concat(task.taskDes.trim(), '</a>...<font></font></li>')
                  })
                  _context59.next = 3
                  return fuc.httpRequest({
                    url: '/api/v1/giveaway/sendtask',
                    method: 'POST',
                    dataType: 'json',
                    headers: {
                      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                      'x-csrf-token': $('meta[name="csrf-token"]').attr('content')
                    },
                    data: 'task_id=' + task.taskId
                  })

                case 3:
                  _yield$fuc$httpReques3 = _context59.sent
                  result = _yield$fuc$httpReques3.result
                  statusText = _yield$fuc$httpReques3.statusText
                  status = _yield$fuc$httpReques3.status
                  data = _yield$fuc$httpReques3.data

                  if (result === 'Success') {
                    if (data.response) {
                      if (data.response.status === 'success') {
                        logStatus.success()
                        $('div.task-reward[href="#task-'.concat(task.taskId, '-collapse"]')).html('<svg class="nc-icon nc-align-to-text grid-24 glyph"><use xlink:href="/icons/nci-fill.svg#nc-icon-check-simple" /></svg>')
                      } else {
                        logStatus.error('Error:' + (data.response.message || data.statusText || data.status || 'error'))
                        if (globalConf.other.autoOpen) window.open('/giveaway/click/'.concat(task.taskId), '_blank')
                      }
                    } else {
                      logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                    }
                  } else {
                    logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                  }

                case 9:
                case 'end':
                  return _context59.stop()
              }
            }
          }, _callee59)
        }))()
      },
      verify: function verify () {
        var _arguments3 = arguments
        var _this10 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee60 () {
          var verify, pro, tasks, _iterator15, _step15, task

          return regeneratorRuntime.wrap(function _callee60$ (_context60) {
            while (1) {
              switch (_context60.prev = _context60.next) {
                case 0:
                  verify = _arguments3.length > 0 && _arguments3[0] !== undefined ? _arguments3[0] : false
                  _context60.prev = 1

                  if (!verify) {
                    _context60.next = 26
                    break
                  }

                  pro = []
                  tasks = fuc.unique(_this10.currentTaskInfo.tasks)
                  _iterator15 = _createForOfIteratorHelper(tasks)
                  _context60.prev = 6

                  _iterator15.s()

                case 8:
                  if ((_step15 = _iterator15.n()).done) {
                    _context60.next = 15
                    break
                  }

                  task = _step15.value
                  pro.push(_this10.verifyTask(task))
                  _context60.next = 13
                  return fuc.delay(1000)

                case 13:
                  _context60.next = 8
                  break

                case 15:
                  _context60.next = 20
                  break

                case 17:
                  _context60.prev = 17
                  _context60.t0 = _context60.catch(6)

                  _iterator15.e(_context60.t0)

                case 20:
                  _context60.prev = 20

                  _iterator15.f()

                  return _context60.finish(20)

                case 23:
                  Promise.all(pro).finally(function () {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="success">'.concat(getI18n('verifyTasksComplete'), '</font></li>')
                    })
                  })
                  _context60.next = 27
                  break

                case 26:
                  _this10.get_tasks('verify')

                case 27:
                  _context60.next = 32
                  break

                case 29:
                  _context60.prev = 29
                  _context60.t1 = _context60.catch(1)
                  throwError(_context60.t1, 'gamehag.verify')

                case 32:
                case 'end':
                  return _context60.stop()
              }
            }
          }, _callee60, null, [[1, 29], [6, 17, 20, 23]])
        }))()
      },
      remove: function remove () {
        var _arguments4 = arguments
        var _this11 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee61 () {
          var remove
          return regeneratorRuntime.wrap(function _callee61$ (_context61) {
            while (1) {
              switch (_context61.prev = _context61.next) {
                case 0:
                  remove = _arguments4.length > 0 && _arguments4[0] !== undefined ? _arguments4[0] : false
                  _context61.prev = 1

                  if (!remove) {
                    _context61.next = 8
                    break
                  }

                  _context61.next = 5
                  return _this11.toggleActions('remove')

                case 5:
                  fuc.echoLog({
                    type: 'custom',
                    text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                  })
                  _context61.next = 9
                  break

                case 8:
                  _this11.get_tasks('remove')

                case 9:
                  _context61.next = 14
                  break

                case 11:
                  _context61.prev = 11
                  _context61.t0 = _context61.catch(1)
                  throwError(_context61.t0, 'gamehag.remove')

                case 14:
                case 'end':
                  return _context61.stop()
              }
            }
          }, _callee61, null, [[1, 11]])
        }))()
      },
      toggleActions: function toggleActions (action) {
        var _this12 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee62 () {
          var fuck, taskInfo
          return regeneratorRuntime.wrap(function _callee62$ (_context62) {
            while (1) {
              switch (_context62.prev = _context62.next) {
                case 0:
                  _context62.prev = 0
                  fuck = action === 'fuck'
                  taskInfo = fuck ? _this12.currentTaskInfo : _this12.taskInfo
                  _context62.next = 5
                  return fuc.updateInfo(taskInfo)

                case 5:
                  _context62.next = 7
                  return fuc.assignment(taskInfo, _this12.conf[action], action, 'gamehag')

                case 7:
                  _context62.next = 12
                  break

                case 9:
                  _context62.prev = 9
                  _context62.t0 = _context62.catch(0)
                  throwError(_context62.t0, 'gamehag.toggleActions')

                case 12:
                case 'end':
                  return _context62.stop()
              }
            }
          }, _callee62, null, [[0, 9]])
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
            }).then(function (_ref75) {
              var value = _ref75.value

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
      conf: (config === null || config === void 0 ? void 0 : (_config$gamehag = config.gamehag) === null || _config$gamehag === void 0 ? void 0 : _config$gamehag.enable) ? config.gamehag : globalConf
    }
    var giveawaysu = {
      test: function test () {
        try {
          return window.location.host === 'giveaway.su'
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
            var status = fuc.echoLog({
              type: 'custom',
              text: '<li>'.concat(getI18n('getTasksInfo'), '<font></font></li>')
            })
            var tasks = $('#actions tr')
            if ($('div.bind-discord').is(':visible')) $('div.bind-discord a')[0].click()
            if ($('div.bind-twitch').is(':visible')) $('div.bind-twitch a')[0].click()

            var _iterator16 = _createForOfIteratorHelper(tasks)
            var _step16

            try {
              for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
                var task = _step16.value
                var td = $(task).find('td:not(".hidden")')
                var colorfulTask = td.eq(1).find('a:not([data-trigger="link"])')
                var colorlessTask = td.eq(2).find('a:not([data-trigger="link"])')
                var taskDes = colorfulTask.length > 0 ? colorfulTask : colorlessTask
                var taskIcon = td.eq(0).find('i').attr('class')

                var _taskInfo = this.which_task(taskDes, taskIcon)

                var _iterator17 = _createForOfIteratorHelper(_taskInfo)
                var _step17

                try {
                  for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
                    var info = _step17.value

                    if (info.name !== 'nonSteam' && this.taskInfo[info.name + 's']) {
                      this.taskInfo[info.name + 's'].push(info.link)
                      this.taskInfo.links.push(info.link)
                    }
                  }
                } catch (err) {
                  _iterator17.e(err)
                } finally {
                  _iterator17.f()
                }
              }
            } catch (err) {
              _iterator16.e(err)
            } finally {
              _iterator16.f()
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
          var _ref76 = [[], taskDes.text().trim(), taskDes.attr('href')]
          var taskInfo = _ref76[0]
          var taskName = _ref76[1]
          var link = _ref76[2]

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
          } else if (/subscribe.*youtube.*channel/gim.test(taskName)) {
            taskInfo.push({
              name: 'youtubeChannel',
              link: link
            })
          } else if (/(watch|like).*youtube.*video/gim.test(taskName) || (taskIcon.includes('youtube') || taskIcon.includes('thumbs-up')) && /(watch|like).*video/gim.test(taskName)) {
            taskInfo.push({
              name: 'youtubeVideo',
              link: link
            })
          } else if (taskIcon.includes('vk') || /join.*vk.*group/gim.test(taskName)) {
            taskInfo.push({
              name: 'vk',
              link: link
            })
          } else {
            if (/(on twitter)|(Follow.*on.*Facebook)/gim.test(taskName)) { // this.taskInfo.links.push(link)
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
        var _this13 = this

        try {
          var status = fuc.echoLog({
            type: 'custom',
            text: '<li>'.concat(getI18n('processTasksUrl'), '<font></font></li>')
          })
          var pro = []

          var _iterator18 = _createForOfIteratorHelper(this.taskInfo.links)
          var _step18

          try {
            var _loop2 = function _loop2 () {
              var link = _step18.value
              if (_this13.taskInfo.toFinalUrl[link]) return 'continue'
              pro.push(fuc.httpRequest({
                url: link,
                method: 'GET'
              }).then(function (_ref77) {
                var _data$finalUrl

                var result = _ref77.result
                var statusText = _ref77.statusText
                var status = _ref77.status
                var data = _ref77.data

                if (data === null || data === void 0 ? void 0 : (_data$finalUrl = data.finalUrl) === null || _data$finalUrl === void 0 ? void 0 : _data$finalUrl.includes('newshub/app')) {
                  var _data$responseText$ma16

                  var div = (_data$responseText$ma16 = data.responseText.match(/<div id="application_config"[\w\W]*?>/)) === null || _data$responseText$ma16 === void 0 ? void 0 : _data$responseText$ma16[0]

                  if (!div) {
                    return {
                      finalUrl: data.finalUrl,
                      url: link
                    }
                  }

                  var appConfig = $(div)

                  var _JSON$parse2 = JSON.parse(appConfig.attr('data-userinfo'))
                  var authwgtoken = _JSON$parse2.authwgtoken

                  var clanAccountID = JSON.parse(appConfig.attr('data-groupvanityinfo'))[0].clanAccountID
                  return {
                    finalUrl: ''.concat(data.finalUrl, '?authwgtoken=').concat(authwgtoken, '&clanid=').concat(clanAccountID),
                    url: link
                  }
                } else {
                  return {
                    finalUrl: data.finalUrl,
                    url: link
                  }
                }
              }))
            }

            for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
              var _ret = _loop2()

              if (_ret === 'continue') continue
            }
          } catch (err) {
            _iterator18.e(err)
          } finally {
            _iterator18.f()
          }

          Promise.all(pro).then(function (data) {
            var _iterator19 = _createForOfIteratorHelper(data)
            var _step19

            try {
              for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
                var r = _step19.value

                if (r.finalUrl) {
                  _this13.taskInfo.toFinalUrl[r.url] = r.finalUrl
                }
              }
            } catch (err) {
              _iterator19.e(err)
            } finally {
              _iterator19.f()
            }

            _this13.links = fuc.unique(_this13.links)
            _this13.taskInfo = fuc.uniqueTaskInfo(_this13.taskInfo)
            GM_setValue('taskInfo[' + window.location.host + _this13.get_giveawayId() + ']', _this13.taskInfo)
            status.success()
            if (debug) console.log(_this13)
            e === 'doTask' ? _this13.do_task('fuck') : _this13.do_task('remove')
          }).catch(function (error) {
            status.error()
            if (debug) console.log(error)
          })
        } catch (e) {
          throwError(e, 'giveawaysu.getFinalUrl')
        }
      },
      do_task: function do_task (action) {
        var _this14 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee63 () {
          var data, toGuild, _iterator20, _step20, $data, _iterator21, _step21, e, _ref78, _ref79, inviteId, guild

          return regeneratorRuntime.wrap(function _callee63$ (_context63) {
            while (1) {
              switch (_context63.prev = _context63.next) {
                case 0:
                  _context63.prev = 0
                  _context63.next = 3
                  return fuc.updateInfo(_this14.taskInfo)

                case 3:
                  _context63.next = 5
                  return fuc.assignment(_this14.taskInfo, _this14.conf[action], action, 'giveawaysu')

                case 5:
                  data = _context63.sent
                  toGuild = _this14.taskInfo.toGuild
                  console.log(data)

                  if (action === 'fuck') {
                    _iterator20 = _createForOfIteratorHelper(data)

                    try {
                      for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {
                        $data = _step20.value

                        if ($data) {
                          _iterator21 = _createForOfIteratorHelper($data)

                          try {
                            for (_iterator21.s(); !(_step21 = _iterator21.n()).done;) {
                              e = _step21.value
                              _ref78 = (e === null || e === void 0 ? void 0 : e.guild) || [], _ref79 = _slicedToArray(_ref78, 2), inviteId = _ref79[0], guild = _ref79[1]
                              if (inviteId && guild) toGuild[inviteId] = guild
                            }
                          } catch (err) {
                            _iterator21.e(err)
                          } finally {
                            _iterator21.f()
                          }
                        }
                      }
                    } catch (err) {
                      _iterator20.e(err)
                    } finally {
                      _iterator20.f()
                    }

                    GM_setValue('taskInfo[' + window.location.host + _this14.get_giveawayId() + ']', _this14.taskInfo)
                  }

                  fuc.echoLog({
                    type: 'custom',
                    text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                  })
                  if (action === 'fuck') {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="warning">'.concat(getI18n('closeExtensions'), '</font></li>')
                    })
                  }
                  _context63.next = 16
                  break

                case 13:
                  _context63.prev = 13
                  _context63.t0 = _context63.catch(0)
                  throwError(_context63.t0, 'giveawaysu.do_task')

                case 16:
                case 'end':
                  return _context63.stop()
              }
            }
          }, _callee63, null, [[0, 13]])
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
            }).then(function (_ref80) {
              var value = _ref80.value

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
        youtubeChannels: [],
        youtubeVideos: [],
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
      conf: (config === null || config === void 0 ? void 0 : (_config$giveawaysu = config.giveawaysu) === null || _config$giveawaysu === void 0 ? void 0 : _config$giveawaysu.enable) ? config.giveawaysu : globalConf
    }
    var givekey = {
      test: function test () {
        try {
          return window.location.host === 'givekey.ru'
        } catch (e) {
          throwError(e, 'givekey.test')
        }
      },
      fuck: function fuck () {
        try {
          this.get_tasks('do_task')
        } catch (e) {
          throwError(e, 'givekey.fuck')
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
            var status = fuc.echoLog({
              type: 'custom',
              text: '<li><font class="warning">'.concat(getI18n('getTasksInfo'), '</font></li>')
            })
            var tasks = $('a[id^=task_]:not(.btn-success)')

            var _iterator22 = _createForOfIteratorHelper(tasks)
            var _step22

            try {
              for (_iterator22.s(); !(_step22 = _iterator22.n()).done;) {
                var task = _step22.value
                var taskEle = $(task)
                var href = taskEle.attr('href')
                var text = taskEle.text().trim()

                if (href.includes('vk.com') && /Subscribe|Repost/gi.test(text)) {
                  var _href$match

                  var name = (_href$match = href.match(/vk\.com\/([^/]*)/)) === null || _href$match === void 0 ? void 0 : _href$match[1]

                  if (name) {
                    this.currentTaskInfo.vks.push(name)
                    this.taskInfo.vks.push(name)
                  }
                } else if (href.includes('steamcommunity.com/groups')) {
                  var _href$match2

                  var _name = (_href$match2 = href.match(/groups\/([^/]*)/)) === null || _href$match2 === void 0 ? void 0 : _href$match2[1]

                  if (_name) {
                    this.currentTaskInfo.groups.push(_name)
                    this.taskInfo.groups.push(_name)
                  }
                } else if (/https?:\/\/givekey\.ru\/giveaway\/away\/[\d]+/.test(href)) {
                  this.currentTaskInfo.links.push(href)
                } else {
                  fuc.echoLog({
                    type: 'custom',
                    text: '<li>'.concat(getI18n('unknownTaskType', ''.concat(text, '(').concat(href, ')')), '<font></font></li>')
                  })
                }

                this.currentTaskInfo = fuc.uniqueTaskInfo(this.currentTaskInfo)
                this.taskInfo = fuc.uniqueTaskInfo(this.taskInfo)
                GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
                status.success()
              }
            } catch (err) {
              _iterator22.e(err)
            } finally {
              _iterator22.f()
            }

            this.currentTaskInfo = fuc.uniqueTaskInfo(this.currentTaskInfo)
            this.taskInfo = fuc.uniqueTaskInfo(this.taskInfo)
            GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
            status.success()
            if (debug) console.log(this)

            if (callback === 'do_task') {
              this.do_task()
            } else if (callback === 'verify') {
              this.currentTaskInfo.tasks.length > 0 ? this.verify(true) : fuc.echoLog({
                type: 'custom',
                text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
              })
            } else {
              !fuc.isEmptyObjArr(this.taskInfo) ? this.remove(true) : fuc.echoLog({
                type: 'custom',
                text: '<li><font class="warning">'.concat(getI18n('cannotRemove'), '</font></li>')
              })
            }
          }
        } catch (e) {
          throwError(e, 'givekey.get_tasks')
        }
      },
      do_task: function do_task () {
        var _this15 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee64 () {
          var pro, links, _iterator23, _step23, link

          return regeneratorRuntime.wrap(function _callee64$ (_context64) {
            while (1) {
              switch (_context64.prev = _context64.next) {
                case 0:
                  _context64.prev = 0
                  pro = []
                  pro.push(_this15.toggleActions('fuck'))
                  links = fuc.unique(_this15.currentTaskInfo.links)

                  if (!_this15.conf.fuck.visitLink) {
                    _context64.next = 23
                    break
                  }

                  _iterator23 = _createForOfIteratorHelper(links)
                  _context64.prev = 6

                  _iterator23.s()

                case 8:
                  if ((_step23 = _iterator23.n()).done) {
                    _context64.next = 15
                    break
                  }

                  link = _step23.value
                  pro.push(fuc.visitLink(link))
                  _context64.next = 13
                  return fuc.delay(1000)

                case 13:
                  _context64.next = 8
                  break

                case 15:
                  _context64.next = 20
                  break

                case 17:
                  _context64.prev = 17
                  _context64.t0 = _context64.catch(6)

                  _iterator23.e(_context64.t0)

                case 20:
                  _context64.prev = 20

                  _iterator23.f()

                  return _context64.finish(20)

                case 23:
                  Promise.all(pro).finally(function () {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                    })
                    if (_this15.conf.fuck.verifyTask) _this15.verify()
                  })
                  _context64.next = 29
                  break

                case 26:
                  _context64.prev = 26
                  _context64.t1 = _context64.catch(0)
                  throwError(_context64.t1, 'givekey.do_task')

                case 29:
                case 'end':
                  return _context64.stop()
              }
            }
          }, _callee64, null, [[0, 26], [6, 17, 20, 23]])
        }))()
      },

      verify: function verify () {
        var verify = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false

        try {
          $('#btngo').click()
        } catch (e) {
          throwError(e, 'givekey.verify')
        }
      },
      remove: function remove () {
        var _arguments5 = arguments
        var _this16 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee65 () {
          var remove
          return regeneratorRuntime.wrap(function _callee65$ (_context65) {
            while (1) {
              switch (_context65.prev = _context65.next) {
                case 0:
                  remove = _arguments5.length > 0 && _arguments5[0] !== undefined ? _arguments5[0] : false
                  _context65.prev = 1

                  if (!remove) {
                    _context65.next = 8
                    break
                  }

                  _context65.next = 5
                  return _this16.toggleActions('remove')

                case 5:
                  fuc.echoLog({
                    type: 'custom',
                    text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                  })
                  _context65.next = 9
                  break

                case 8:
                  _this16.get_tasks('remove')

                case 9:
                  _context65.next = 14
                  break

                case 11:
                  _context65.prev = 11
                  _context65.t0 = _context65.catch(1)
                  throwError(_context65.t0, 'givekey.remove')

                case 14:
                case 'end':
                  return _context65.stop()
              }
            }
          }, _callee65, null, [[1, 11]])
        }))()
      },
      toggleActions: function toggleActions (action) {
        var _this17 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee66 () {
          var fuck, taskInfo
          return regeneratorRuntime.wrap(function _callee66$ (_context66) {
            while (1) {
              switch (_context66.prev = _context66.next) {
                case 0:
                  _context66.prev = 0
                  fuck = action === 'fuck'
                  taskInfo = fuck ? _this17.currentTaskInfo : _this17.taskInfo
                  _context66.next = 5
                  return fuc.updateInfo(taskInfo)

                case 5:
                  _context66.next = 7
                  return fuc.assignment(taskInfo, _this17.conf[action], action, 'givekey')

                case 7:
                  _context66.next = 12
                  break

                case 9:
                  _context66.prev = 9
                  _context66.t0 = _context66.catch(0)
                  throwError(_context66.t0, 'givekey.toggleActions')

                case 12:
                case 'end':
                  return _context66.stop()
              }
            }
          }, _callee66, null, [[0, 9]])
        }))()
      },
      get_giveawayId: function get_giveawayId () {
        try {
          var _window$location$href4

          return ((_window$location$href4 = window.location.href.match(/\/giveaway\/([\d]+)/)) === null || _window$location$href4 === void 0 ? void 0 : _window$location$href4[1]) || window.location.href
        } catch (e) {
          throwError(e, 'givekey.get_giveawayId')
        }
      },
      checkLogin: function checkLogin () {
        try {
          if ($('a[href="/auth/steam"]').length > 0) window.open('/auth/steam', '_self')
        } catch (e) {
          throwError(e, 'givekey.checkLogin')
        }
      },
      checkLeft: function checkLeft () {
        try {
          if (!$('#keys_count').text()) {
            Swal.fire({
              icon: 'warning',
              title: getI18n('notice'),
              text: getI18n('noKeysLeft'),
              confirmButtonText: getI18n('confirm'),
              cancelButtonText: getI18n('cancel'),
              showCancelButton: true
            }).then(function (_ref81) {
              var value = _ref81.value

              if (value) {
                window.close()
              }
            })
          }
        } catch (e) {
          throwError(e, 'givekey.checkLeft')
        }
      },
      currentTaskInfo: {
        links: [],
        groups: [],
        curators: [],
        wishlists: [],
        fGames: [],
        vks: [],
        tasks: []
      },
      taskInfo: {
        groups: [],
        curators: [],
        wishlists: [],
        fGames: [],
        vks: []
      },
      setting: {},
      conf: (config === null || config === void 0 ? void 0 : (_config$givekay = config.givekay) === null || _config$givekay === void 0 ? void 0 : _config$givekay.enable) ? config.givekay : globalConf
    }

    var gleam = {
      test: function test () {
        try {
          return window.location.host === 'gleam.io'
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
            var status = fuc.echoLog({
              type: 'custom',
              text: '<li>'.concat(getI18n('getTasksInfo'), '<font></font></li>')
            })
            var tasksContainer = $('div.entry-content .entry-method')

            var _iterator24 = _createForOfIteratorHelper(tasksContainer)
            var _step24

            try {
              for (_iterator24.s(); !(_step24 = _iterator24.n()).done;) {
                var task = _step24.value

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
                    } else if (icon.hasClass('fa-twitch')) {
                      var twitchTaskInfo = $(task).find('.user-links')

                      if (/follow/gim.test(twitchTaskInfo.text())) {
                        var _twitchTaskInfo$find$, _twitchTaskInfo$find$2

                        var _name2 = (_twitchTaskInfo$find$ = twitchTaskInfo.find('a[href^="https://twitch.tv/"]').attr('href')) === null || _twitchTaskInfo$find$ === void 0 ? void 0 : (_twitchTaskInfo$find$2 = _twitchTaskInfo$find$.match(/https:\/\/twitch.tv\/(.+)/)) === null || _twitchTaskInfo$find$2 === void 0 ? void 0 : _twitchTaskInfo$find$2[1]

                        if (_name2) {
                          this.currentTaskInfo.twitchs.push(_name2)
                          this.taskInfo.twitchs.push(_name2)
                        }
                      }
                    } else if (icon.hasClass('fa-discord')) {
                      if (/join/gim.test($(task).find('.user-links').text())) {
                        var _$$find$attr, _$$find$attr$match

                        var inviteId = (_$$find$attr = $(task).find('a.btn-info[ng-click^="triggerVisit"][href^="https://discord.com/invite/"]').attr('href')) === null || _$$find$attr === void 0 ? void 0 : (_$$find$attr$match = _$$find$attr.match(/https:\/\/discord.com\/invite\/(.+)/)) === null || _$$find$attr$match === void 0 ? void 0 : _$$find$attr$match[1]

                        if (inviteId) {
                          this.currentTaskInfo.discords.push(inviteId)
                          this.taskInfo.discords.push(inviteId)
                        } else {
                          this.currentTaskInfo.discords.push(task)
                        }
                      } else {
                        this.currentTaskInfo.discords.push(task)
                      }
                    } else if (icon.hasClass('fa-facebook')) {
                      this.currentTaskInfo.facebooks.push(task)
                    } else if (icon.hasClass('fa-youtube')) {
                      this.currentTaskInfo.youtubes.push(task)
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
              _iterator24.e(err)
            } finally {
              _iterator24.f()
            }

            this.currentTaskInfo = fuc.uniqueTaskInfo(this.currentTaskInfo)
            this.taskInfo = fuc.uniqueTaskInfo(this.taskInfo)
            GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
            status.success()
            if (debug) console.log(this)

            if (callback === 'do_task') {
              this.do_task()
            } else if (callback === 'verify') {
              this.verify()
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
        var _this18 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee67 () {
          var pro, data, toGuild, _iterator25, _step25, $data, _iterator28, _step28, e, _ref82, _ref83, inviteId, guild, _this18$currentTaskIn, facebooks, youtubes, others, links, socialPlatforms, _iterator26, _step26, task, title, status, button, _iterator27, _step27, other, icon, _title2, taskType

          return regeneratorRuntime.wrap(function _callee67$ (_context67) {
            while (1) {
              switch (_context67.prev = _context67.next) {
                case 0:
                  _context67.prev = 0
                  pro = []
                  _context67.next = 4
                  return fuc.updateInfo(_this18.currentTaskInfo)

                case 4:
                  _context67.next = 6
                  return fuc.assignment(_this18.currentTaskInfo, _this18.conf.fuck, 'fuck', 'gleam')

                case 6:
                  data = _context67.sent
                  toGuild = _this18.taskInfo.toGuild
                  _iterator25 = _createForOfIteratorHelper(data)

                  try {
                    for (_iterator25.s(); !(_step25 = _iterator25.n()).done;) {
                      $data = _step25.value
                      _iterator28 = _createForOfIteratorHelper($data)

                      try {
                        for (_iterator28.s(); !(_step28 = _iterator28.n()).done;) {
                          e = _step28.value
                          _ref82 = (e === null || e === void 0 ? void 0 : e.guild) || [], _ref83 = _slicedToArray(_ref82, 2), inviteId = _ref83[0], guild = _ref83[1]
                          if (inviteId && guild) toGuild[inviteId] = guild
                        }
                      } catch (err) {
                        _iterator28.e(err)
                      } finally {
                        _iterator28.f()
                      }
                    }
                  } catch (err) {
                    _iterator25.e(err)
                  } finally {
                    _iterator25.f()
                  }

                  GM_setValue('taskInfo[' + window.location.host + _this18.get_giveawayId() + ']', _this18.taskInfo)
                  _this18$currentTaskIn = _this18.currentTaskInfo, facebooks = _this18$currentTaskIn.facebooks, youtubes = _this18$currentTaskIn.youtubes, others = _this18$currentTaskIn.others, links = _this18$currentTaskIn.links
                  socialPlatforms = [].concat(_toConsumableArray(facebooks), _toConsumableArray(youtubes))

                  if (globalConf.other.autoOpen) {
                    if (socialPlatforms.length > 0) {
                      _iterator26 = _createForOfIteratorHelper(socialPlatforms)

                      try {
                        for (_iterator26.s(); !(_step26 = _iterator26.n()).done;) {
                          task = _step26.value
                          title = $(task).find('.entry-method-title').text().trim()
                          status = fuc.echoLog({
                            type: 'custom',
                            text: '<li>'.concat(getI18n('doing'), ':').concat(title, '...<font></font></li>')
                          })
                          button = $(task).find('a.btn-info:first').attr('href')

                          if (button) {
                            window.open(button, '_blank')
                            status.warning(getI18n('openPage'))
                          } else {
                            status.error(getI18n('getTaskUrlFailed'))
                          }
                        }
                      } catch (err) {
                        _iterator26.e(err)
                      } finally {
                        _iterator26.f()
                      }
                    }
                  }

                  if ((globalConf.other.autoOpen || _this18.conf.fuck.visit) && links.length > 0) {
                    pro.push(_this18.visit_link(links))
                  }

                  _iterator27 = _createForOfIteratorHelper(others)

                  try {
                    for (_iterator27.s(); !(_step27 = _iterator27.n()).done;) {
                      other = _step27.value
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
                    _iterator27.e(err)
                  } finally {
                    _iterator27.f()
                  }

                  Promise.all(pro).finally(function () {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                    })
                    if (_this18.conf.fuck.verifyTask) _this18.verify()
                  })
                  _context67.next = 23
                  break

                case 20:
                  _context67.prev = 20
                  _context67.t0 = _context67.catch(0)
                  throwError(_context67.t0, 'gleam.do_task')

                case 23:
                case 'end':
                  return _context67.stop()
              }
            }
          }, _callee67, null, [[0, 20]])
        }))()
      },
      verify: function verify () {
        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee68 () {
          var tasks, _iterator29, _step29, task, title, status, enterBtn

          return regeneratorRuntime.wrap(function _callee68$ (_context68) {
            while (1) {
              switch (_context68.prev = _context68.next) {
                case 0:
                  _context68.prev = 0

                  if (!$('.ng-scope[ng-include*=challenge]').is(':visible')) {
                    _context68.next = 3
                    break
                  }

                  return _context68.abrupt('return', fuc.echoLog({
                    type: 'custom',
                    text: '<li><font class="error">'.concat(getI18n('notRobot'), '</font></li>')
                  }))

                case 3:
                  tasks = $('div.entry-content .entry-method')
                  _iterator29 = _createForOfIteratorHelper(tasks)
                  _context68.prev = 5

                  _iterator29.s()

                case 7:
                  if ((_step29 = _iterator29.n()).done) {
                    _context68.next = 23
                    break
                  }

                  task = _step29.value

                  if (!($(task).find('i.fa-question').length > 0)) {
                    _context68.next = 19
                    break
                  }

                  title = $(task).find('.entry-method-title').text().trim()
                  status = fuc.echoLog({
                    type: 'custom',
                    text: '<li>'.concat(getI18n('verifyingTask'), ':').concat(title, '...<font></font></li>')
                  })
                  $(task).find('a.enter-link')[0].click()
                  enterBtn = $(task).find('.form-actions.center .btn-primary:contains(Continue)').removeAttr('disabled')

                  if (!(enterBtn.length > 0)) {
                    _context68.next = 19
                    break
                  }

                  _context68.next = 17
                  return fuc.delay(1000)

                case 17:
                  enterBtn[0].click()
                  status.warning('Complete')

                case 19:
                  _context68.next = 21
                  return fuc.delay(1000)

                case 21:
                  _context68.next = 7
                  break

                case 23:
                  _context68.next = 28
                  break

                case 25:
                  _context68.prev = 25
                  _context68.t0 = _context68.catch(5)

                  _iterator29.e(_context68.t0)

                case 28:
                  _context68.prev = 28

                  _iterator29.f()

                  return _context68.finish(28)

                case 31:
                  fuc.echoLog({
                    type: 'custom',
                    text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font><font class="warning">').concat(getI18n('finishSelf'), '</font></li>')
                  })

                  _context68.next = 37
                  break

                case 34:
                  _context68.prev = 34
                  _context68.t1 = _context68.catch(0)
                  throwError(_context68.t1, 'gleam.verify')

                case 37:
                case 'end':
                  return _context68.stop()
              }
            }
          }, _callee68, null, [[0, 34], [5, 25, 28, 31]])
        }))()
      },
      remove: function remove () {
        var _arguments6 = arguments
        var _this19 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee69 () {
          var remove
          return regeneratorRuntime.wrap(function _callee69$ (_context69) {
            while (1) {
              switch (_context69.prev = _context69.next) {
                case 0:
                  remove = _arguments6.length > 0 && _arguments6[0] !== undefined ? _arguments6[0] : false
                  _context69.prev = 1

                  if (!remove) {
                    _context69.next = 10
                    break
                  }

                  _context69.next = 5
                  return fuc.updateInfo(_this19.taskInfo)

                case 5:
                  _context69.next = 7
                  return fuc.assignment(_this19.taskInfo, _this19.conf.remove, 'remove', 'gleam')

                case 7:
                  fuc.echoLog({
                    type: 'custom',
                    text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                  })
                  _context69.next = 11
                  break

                case 10:
                  _this19.get_tasks('remove')

                case 11:
                  _context69.next = 16
                  break

                case 13:
                  _context69.prev = 13
                  _context69.t0 = _context69.catch(1)
                  throwError(_context69.t0, 'gleam.remove')

                case 16:
                case 'end':
                  return _context69.stop()
              }
            }
          }, _callee69, null, [[1, 13]])
        }))()
      },
      visit_link: function visit_link (links) {
        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee70 () {
          var _iterator30, _step30, _loop3, _ret2

          return regeneratorRuntime.wrap(function _callee70$ (_context71) {
            while (1) {
              switch (_context71.prev = _context71.next) {
                case 0:
                  _context71.prev = 0
                  _iterator30 = _createForOfIteratorHelper(links)
                  _context71.prev = 2
                  _loop3 = /* #__PURE__ */regeneratorRuntime.mark(function _loop3 () {
                    var link, title, status, taskTime, url, timer, _taskTime$match, taskBtn, href

                    return regeneratorRuntime.wrap(function _loop3$ (_context70) {
                      while (1) {
                        switch (_context70.prev = _context70.next) {
                          case 0:
                            link = _step30.value
                            title = $(link).find('.entry-method-title').text().trim()
                            status = fuc.echoLog({
                              type: 'custom',
                              text: '<li>'.concat(getI18n('doing'), ':').concat(title, '...<font></font></li>')
                            })
                            taskTime = $(link).find('.form-actions.center span:contains(Visit):contains(seconds)').text()
                            url = language === 'en' ? 'https://auto-task-test.hclonely.com/time_en.html?time=' : 'https://auto-task-test.hclonely.com/time.html?time='
                            timer = null

                            if (taskTime) {
                              timer = (_taskTime$match = taskTime.match(/[\d]+/)) === null || _taskTime$match === void 0 ? void 0 : _taskTime$match[0]
                            }

                            taskBtn = $(link).find('a.btn-info')

                            if (!(taskBtn.length === 0)) {
                              _context70.next = 11
                              break
                            }

                            status.warning('End')
                            return _context70.abrupt('return', 'continue')

                          case 11:
                            href = taskBtn.attr('href')
                            taskBtn.removeAttr('href')[0].click()
                            _context70.next = 15
                            return new Promise(function (resolve) {
                              GM_openInTab(timer ? url + timer : 'javascript:setTimeout(()=>{window.close()},1000)', {
                                active: 1,
                                setParent: 1
                              }).onclose = function () {
                                status.warning('Complete')
                                taskBtn.attr('target', '_blank').attr('href', href)
                                resolve()
                              }
                            })

                          case 15:
                          case 'end':
                            return _context70.stop()
                        }
                      }
                    }, _loop3)
                  })

                  _iterator30.s()

                case 5:
                  if ((_step30 = _iterator30.n()).done) {
                    _context71.next = 12
                    break
                  }

                  return _context71.delegateYield(_loop3(), 't0', 7)

                case 7:
                  _ret2 = _context71.t0

                  if (!(_ret2 === 'continue')) {
                    _context71.next = 10
                    break
                  }

                  return _context71.abrupt('continue', 10)

                case 10:
                  _context71.next = 5
                  break

                case 12:
                  _context71.next = 17
                  break

                case 14:
                  _context71.prev = 14
                  _context71.t1 = _context71.catch(2)

                  _iterator30.e(_context71.t1)

                case 17:
                  _context71.prev = 17

                  _iterator30.f()

                  return _context71.finish(17)

                case 20:
                  _context71.next = 25
                  break

                case 22:
                  _context71.prev = 22
                  _context71.t2 = _context71.catch(0)
                  throwError(_context71.t2, 'gleam.visit_link')

                case 25:
                case 'end':
                  return _context71.stop()
              }
            }
          }, _callee70, null, [[0, 22], [2, 14, 17, 20]])
        }))()
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
            }).then(function (_ref84) {
              var value = _ref84.value

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
        tasks: [],
        toGuild: {}
      },
      taskInfo: {
        groups: [],
        twitterUsers: [],
        retweets: [],
        discords: [],
        toGuild: {}
      },
      setting: {},
      conf: (config === null || config === void 0 ? void 0 : (_config$gleam = config.gleam) === null || _config$gleam === void 0 ? void 0 : _config$gleam.enable) ? config.gleam : globalConf
    }

    var indiedb = {
      test: function test () {
        try {
          return window.location.host === 'www.indiedb.com'
        } catch (e) {
          throwError(e, 'indiedb.test')
        }
      },
      fuck: function fuck () {
        var _this20 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee71 () {
          var currentoption, logStatus, _yield$fuc$httpReques4, result, statusText, status, data, _data$response19, _data$response20, _data$response21, _data$response22, _data$response23

          return regeneratorRuntime.wrap(function _callee71$ (_context72) {
            while (1) {
              switch (_context72.prev = _context72.next) {
                case 0:
                  _context72.prev = 0
                  if ($('a.buttonenter:contains(Register to join)').length > 0) {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="error">'.concat(getI18n('needLogin'), '</font></li>')
                    })
                  }
                  currentoption = $('a.buttonenter.buttongiveaway')

                  if (!/join giveaway/gim.test(currentoption.text())) {
                    _context72.next = 15
                    break
                  }

                  logStatus = fuc.echoLog({
                    type: 'custom',
                    text: '<li>'.concat(getI18n('joinGiveaway'), '<font></font></li>')
                  })
                  _context72.next = 7
                  return fuc.httpRequest({
                    url: currentoption.attr('href'),
                    method: 'POST',
                    data: 'ajax=t',
                    dataType: 'json',
                    headers: {
                      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                      accept: 'application/json, text/javascript, */*; q=0.01'
                    }
                  })

                case 7:
                  _yield$fuc$httpReques4 = _context72.sent
                  result = _yield$fuc$httpReques4.result
                  statusText = _yield$fuc$httpReques4.statusText
                  status = _yield$fuc$httpReques4.status
                  data = _yield$fuc$httpReques4.data

                  if (result === 'Success') {
                    if (data.status === 200) {
                      if ((_data$response19 = data.response) === null || _data$response19 === void 0 ? void 0 : _data$response19.success) {
                        currentoption.addClass('buttonentered').text('Success - Giveaway joined')
                        $('#giveawaysjoined').slideDown()
                        $('#giveawaysrecommend').slideDown()
                        logStatus.success('Success' + (((_data$response20 = data.response) === null || _data$response20 === void 0 ? void 0 : _data$response20.text) ? ':' + ((_data$response21 = data.response) === null || _data$response21 === void 0 ? void 0 : _data$response21.text) : ''))

                        _this20.do_task()
                      } else {
                        logStatus.error('Error' + (((_data$response22 = data.response) === null || _data$response22 === void 0 ? void 0 : _data$response22.text) ? ':' + ((_data$response23 = data.response) === null || _data$response23 === void 0 ? void 0 : _data$response23.text) : ''))
                      }
                    } else {
                      logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                    }
                  } else {
                    logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                  }

                  _context72.next = 16
                  break

                case 15:
                  if (/success/gim.test($('a.buttonenter.buttongiveaway').text())) {
                    _this20.do_task()
                  } else {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="error">'.concat(getI18n('needJoinGiveaway'), '</font></li>')
                    })
                  }

                case 16:
                  _context72.next = 21
                  break

                case 18:
                  _context72.prev = 18
                  _context72.t0 = _context72.catch(0)
                  throwError(_context72.t0, 'indiedb.fuck')

                case 21:
                case 'end':
                  return _context72.stop()
              }
            }
          }, _callee71, null, [[0, 18]])
        }))()
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
              var pro = []
              var tasks = $('#giveawaysjoined a[class*=promo]')

              var _iterator31 = _createForOfIteratorHelper(tasks)
              var _step31

              try {
                var _loop4 = function _loop4 () {
                  var task = _step31.value
                  var promo = $(task)

                  if (!promo.hasClass('buttonentered')) {
                    var status = fuc.echoLog({
                      type: 'custom',
                      text: '<li>'.concat(getI18n('doing'), ':').concat(promo.parents('p').text(), '...<font></font></li>')
                    })

                    if (/facebookpromo|twitterpromo|visitpromo/gim.test(task.className)) {
                      pro.push(new Promise(function (resolve) {
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
                            resolve()
                          },
                          success: function success (response) {
                            if (debug) console.log(response)

                            if (response.success) {
                              status.success('Success:' + response.text)
                              promo.addClass('buttonentered').closest('p').html(promo.closest('p').find('span').html())
                              resolve()
                            } else {
                              status.error('Error:' + response.text)
                              resolve()
                            }
                          }
                        })
                      }))
                    } else if (promo.hasClass('emailoptinpromo')) {
                      pro.push(new Promise(function (resolve) {
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
                            resolve()
                          },
                          success: function success (response) {
                            if (debug) console.log(response)

                            if (response.success) {
                              status.success('Success:' + response.text)
                              promo.toggleClass('buttonentered').closest('p').html(promo.closest('p').find('span').html())
                              resolve()
                            } else {
                              status.error('Error:' + response.text)
                              resolve()
                            }
                          }
                        })
                      }))
                    } else if (promo.hasClass('watchingpromo')) {
                      pro.push(new Promise(function (resolve) {
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
                            resolve()
                          },
                          success: function success (response) {
                            if (debug) console.log(response)

                            if (response.success) {
                              status.success('Success:' + response.text)
                              promo.toggleClass('buttonentered').closest('p').html(promo.closest('p').find('span').html())
                              resolve()
                            } else {
                              status.error('Error:' + response.text)
                              resolve()
                            }
                          }
                        })
                      }))
                    } else if (!/the-challenge-of-adblock/gim.test(promo.attr('href'))) {
                      pro.push(new Promise(function (resolve) {
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
                            resolve()
                          },
                          success: function success (response) {
                            if (debug) console.log(response)

                            if (response.success) {
                              status.success('Success:' + response.text)
                              promo.toggleClass('buttonentered').closest('p').html(promo.closest('p').find('span').html())
                              resolve()
                            } else {
                              status.error('Error:' + response.text)
                              resolve()
                            }
                          }
                        })
                      }))
                    } else {
                      status.error('Error:' + getI18n('unknowntype'))
                    }
                  }
                }

                for (_iterator31.s(); !(_step31 = _iterator31.n()).done;) {
                  _loop4()
                }
              } catch (err) {
                _iterator31.e(err)
              } finally {
                _iterator31.f()
              }

              Promise.all(pro).finally(function () {
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
      conf: (config === null || config === void 0 ? void 0 : (_config$indiedb = config.indiedb) === null || _config$indiedb === void 0 ? void 0 : _config$indiedb.enable) ? config.indiedb : globalConf
    }

    var keyhub = {
      test: function test () {
        try {
          return window.location.host === 'key-hub.eu'
        } catch (e) {
          throwError(e, 'keyhub.test')
        }
      },
      fuck: function fuck () {
        try {
          $('#VPNoverlay').hide()
          $('#mainArticleSection').show()
          this.get_tasks('do_task')
        } catch (e) {
          throwError(e, 'keyhub.fuck')
        }
      },
      get_tasks: function get_tasks () {
        var _arguments7 = arguments
        var _this21 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee72 () {
          var callback, taskInfoHistory, status, tasks, pro, _iterator32, _step32, task, link, taskDes, _link$match, groupName, _link$match2, gameId

          return regeneratorRuntime.wrap(function _callee72$ (_context73) {
            while (1) {
              switch (_context73.prev = _context73.next) {
                case 0:
                  callback = _arguments7.length > 0 && _arguments7[0] !== undefined ? _arguments7[0] : 'do_task'

                  try {
                    taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + _this21.get_giveawayId() + ']')
                    if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) _this21.taskInfo = taskInfoHistory

                    if (callback === 'remove' && taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
                      _this21.remove(true)
                    } else {
                      _this21.currentTaskInfo = fuc.clearTaskInfo(_this21.currentTaskInfo)
                      status = fuc.echoLog({
                        type: 'custom',
                        text: '<li>'.concat(getI18n('getTasksInfo'), '<font></font></li>')
                      })
                      tasks = $('.task a')
                      pro = []
                      _iterator32 = _createForOfIteratorHelper(tasks)

                      try {
                        for (_iterator32.s(); !(_step32 = _iterator32.n()).done;) {
                          task = _step32.value

                          link = $(task).attr('href')
                          taskDes = $(task).text().trim()

                          if (/steamcommunity\.com\/gid\//.test(link) && /join/gim.test(taskDes)) {
                            pro.push(fuc.getFinalUrl(link).then(function (_ref85) {
                              var result = _ref85.result
                              var finalUrl = _ref85.finalUrl

                              if (result === 'Success') {
                                var _finalUrl$match8

                                var groupName = (_finalUrl$match8 = finalUrl.match(/steamcommunity\.com\/groups\/([\w\d\-_]*)/)) === null || _finalUrl$match8 === void 0 ? void 0 : _finalUrl$match8[1]

                                if (groupName) {
                                  _this21.currentTaskInfo.groups.push(groupName)

                                  _this21.taskInfo.groups.push(groupName)
                                }
                              }
                            }))
                          } else if (/steamcommunity\.com\/groups\//.test(link) && /join/gim.test(taskDes)) {
                            groupName = (_link$match = link.match(/steamcommunity\.com\/groups\/([\w\d\-_]*)/)) === null || _link$match === void 0 ? void 0 : _link$match[1]

                            if (groupName) {
                              _this21.currentTaskInfo.groups.push(groupName)

                              _this21.taskInfo.groups.push(groupName)
                            }
                          } else if (/store\.steampowered\.com\/app\//.test(link) && /wishlist/gim.test(taskDes)) {
                            gameId = (_link$match2 = link.match(/app\/([\d]+)/)) === null || _link$match2 === void 0 ? void 0 : _link$match2[1]

                            if (gameId) {
                              _this21.currentTaskInfo.wGames.push(gameId)

                              _this21.taskInfo.wGames.push(gameId)
                            }
                          } else if (/\/away\?data=.*/.test(link)) {
                            _this21.currentTaskInfo.links.push(link)
                          } else {
                            fuc.echoLog({
                              type: 'custom',
                              text: '<li>'.concat(getI18n('unknownTaskType', ''.concat(taskDes, '(').concat(link, ')')), '<font></font></li>')
                            })
                          }
                        }
                      } catch (err) {
                        _iterator32.e(err)
                      } finally {
                        _iterator32.f()
                      }

                      Promise.all(pro).finally(function () {
                        _this21.currentTaskInfo = fuc.uniqueTaskInfo(_this21.currentTaskInfo)
                        _this21.taskInfo = fuc.uniqueTaskInfo(_this21.taskInfo)
                        GM_setValue('taskInfo[' + window.location.host + _this21.get_giveawayId() + ']', _this21.taskInfo)
                        status.success()
                        if (debug) console.log(_this21)

                        if (callback === 'do_task') {
                          _this21.do_task()
                        } else {
                          !fuc.isEmptyObjArr(_this21.taskInfo) ? _this21.remove(true) : fuc.echoLog({
                            type: 'custom',
                            text: '<li><font class="warning">'.concat(getI18n('cannotRemove'), '</font></li>')
                          })
                        }
                      })
                    }
                  } catch (e) {
                    throwError(e, 'keyhub.get_tasks')
                  }

                case 2:
                case 'end':
                  return _context73.stop()
              }
            }
          }, _callee72)
        }))()
      },
      do_task: function do_task () {
        var _this22 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee73 () {
          var pro, links, _iterator33, _step33, link

          return regeneratorRuntime.wrap(function _callee73$ (_context74) {
            while (1) {
              switch (_context74.prev = _context74.next) {
                case 0:
                  _context74.prev = 0
                  pro = []
                  pro.push(_this22.toggleActions('fuck'))
                  links = fuc.unique(_this22.currentTaskInfo.links)

                  if (!_this22.conf.fuck.visitLink) {
                    _context74.next = 23
                    break
                  }

                  _iterator33 = _createForOfIteratorHelper(links)
                  _context74.prev = 6

                  _iterator33.s()

                case 8:
                  if ((_step33 = _iterator33.n()).done) {
                    _context74.next = 15
                    break
                  }

                  link = _step33.value
                  pro.push(fuc.visitLink(link, {
                    method: 'GET'
                  }))
                  _context74.next = 13
                  return fuc.delay(1000)

                case 13:
                  _context74.next = 8
                  break

                case 15:
                  _context74.next = 20
                  break

                case 17:
                  _context74.prev = 17
                  _context74.t0 = _context74.catch(6)

                  _iterator33.e(_context74.t0)

                case 20:
                  _context74.prev = 20

                  _iterator33.f()

                  return _context74.finish(20)

                case 23:
                  Promise.all(pro).finally(function () {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                    })
                    if (_this22.conf.fuck.verifyTask) _this22.verify()
                  })
                  _context74.next = 29
                  break

                case 26:
                  _context74.prev = 26
                  _context74.t1 = _context74.catch(0)
                  throwError(_context74.t1, 'keyhub.do_task')

                case 29:
                case 'end':
                  return _context74.stop()
              }
            }
          }, _callee73, null, [[0, 26], [6, 17, 20, 23]])
        }))()
      },
      verify: function verify () {
        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee74 () {
          return regeneratorRuntime.wrap(function _callee74$ (_context75) {
            while (1) {
              switch (_context75.prev = _context75.next) {
                case 0:
                  try {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li>'.concat(getI18n('verifyingTask'), '...<font></font></li>')
                    })
                    $.get(window.location.href, function (res) {
                      VerifyTasks(res.match(/onclick="javascript:VerifyTasks\('(.*?)'\)"/)[1])
                    })
                  } catch (e) {
                    throwError(e, 'keyhub.verify')
                  }

                case 1:
                case 'end':
                  return _context75.stop()
              }
            }
          }, _callee74)
        }))()
      },
      toggleActions: function toggleActions (action) {
        var _this23 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee75 () {
          var fuck, taskInfo
          return regeneratorRuntime.wrap(function _callee75$ (_context76) {
            while (1) {
              switch (_context76.prev = _context76.next) {
                case 0:
                  _context76.prev = 0
                  fuck = action === 'fuck'
                  taskInfo = fuck ? _this23.currentTaskInfo : _this23.taskInfo
                  _context76.next = 5
                  return fuc.updateInfo(taskInfo)

                case 5:
                  _context76.next = 7
                  return fuc.assignment(taskInfo, _this23.conf[action], action, 'keyhub')

                case 7:
                  _context76.next = 12
                  break

                case 9:
                  _context76.prev = 9
                  _context76.t0 = _context76.catch(0)
                  throwError(_context76.t0, 'keyhub.toggleActions')

                case 12:
                case 'end':
                  return _context76.stop()
              }
            }
          }, _callee75, null, [[0, 9]])
        }))()
      },
      remove: function remove () {
        var _arguments8 = arguments
        var _this24 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee76 () {
          var remove
          return regeneratorRuntime.wrap(function _callee76$ (_context77) {
            while (1) {
              switch (_context77.prev = _context77.next) {
                case 0:
                  remove = _arguments8.length > 0 && _arguments8[0] !== undefined ? _arguments8[0] : false
                  _context77.prev = 1

                  if (!remove) {
                    _context77.next = 8
                    break
                  }

                  _context77.next = 5
                  return _this24.toggleActions('remove')

                case 5:
                  fuc.echoLog({
                    type: 'custom',
                    text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                  })
                  _context77.next = 9
                  break

                case 8:
                  _this24.get_tasks('remove')

                case 9:
                  _context77.next = 14
                  break

                case 11:
                  _context77.prev = 11
                  _context77.t0 = _context77.catch(1)
                  throwError(_context77.t0, 'keyhub.remove')

                case 14:
                case 'end':
                  return _context77.stop()
              }
            }
          }, _callee76, null, [[1, 11]])
        }))()
      },
      get_giveawayId: function get_giveawayId () {
        try {
          var id = window.location.href.match(/giveaway\/([\d]+)/)
          return (id === null || id === void 0 ? void 0 : id[1]) || window.location.href
        } catch (e) {
          throwError(e, 'keyhub.get_giveawayId')
        }
      },
      checkLogin: function checkLogin () {
        try {
          if ($('a[href="/connect/steam"]').length > 0) window.open('/connect/steam', '_self')
        } catch (e) {
          throwError(e, 'keyhub.checkLogin')
        }
      },
      checkLeft: function checkLeft () {
        try {
          var leftKey = $('#keysleft').text().trim()

          if (leftKey === '0') {
            Swal.fire({
              icon: 'warning',
              title: getI18n('notice'),
              text: getI18n('noKeysLeft'),
              confirmButtonText: getI18n('confirm'),
              cancelButtonText: getI18n('cancel'),
              showCancelButton: true
            }).then(function (_ref86) {
              var value = _ref86.value

              if (value) {
                window.close()
              }
            })
          }
        } catch (e) {
          throwError(e, 'keyhub.checkLeft')
        }
      },
      currentTaskInfo: {
        links: [],
        groups: [],
        wGames: []
      },
      taskInfo: {
        groups: [],
        wGames: []
      },
      setting: {},
      conf: (config === null || config === void 0 ? void 0 : (_config$keyhub = config.keyhub) === null || _config$keyhub === void 0 ? void 0 : _config$keyhub.enable) ? config.keyhub : globalConf
    }

    var keylol = {
      test: function test () {
        try {
          var _$$eq$attr

          return window.location.host === 'keylol.com' && !window.location.href.includes('mod=forumdisplay') && ((_$$eq$attr = $('.subforum_left_title_left_up a').eq(3).attr('href')) === null || _$$eq$attr === void 0 ? void 0 : _$$eq$attr.includes('319'))
        } catch (e) {
          throwError(e, 'keylol.test')
        }
      },
      after: function after () {
        var _this25 = this

        try {
          AutoTask.toggleDiscord = function (action, inviteId) {
            var taskInfo = GM_getValue('taskInfo[' + window.location.host + _this25.get_giveawayId() + ']') || {}
            var toGuild = taskInfo.toGuild || {}
            return fuc.toggleActions({
              social: 'discord',
              website: 'keylol',
              elements: [inviteId],
              action: action,
              toGuild: toGuild
            }).then(function (data) {
              if (action === 'fuck') {
                var _data$

                var _ref87 = (data === null || data === void 0 ? void 0 : (_data$ = data[0]) === null || _data$ === void 0 ? void 0 : _data$.guild) || []
                var _ref88 = _slicedToArray(_ref87, 2)
                var _inviteId = _ref88[0]
                var guild = _ref88[1]

                if (_inviteId && guild) {
                  toGuild[_inviteId] = guild
                  taskInfo.toGuild = toGuild
                  GM_setValue('taskInfo[' + window.location.host + _this25.get_giveawayId() + ']', taskInfo)
                }
              }
            })
          }

          AutoTask.toggleREDDIT = function (action, name) {
            return fuc.toggleActions({
              social: 'reddit',
              website: 'keylol',
              elements: [name],
              action: action
            })
          }

          AutoTask.toggleINS = function (action, name) {
            return fuc.toggleActions({
              social: 'ins',
              website: 'keylol',
              elements: [name],
              action: action
            })
          }

          AutoTask.toggleTWITTER = /* #__PURE__ */(function () {
            var _ref89 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee77 (action, name, type) {
              return regeneratorRuntime.wrap(function _callee77$ (_context78) {
                while (1) {
                  switch (_context78.prev = _context78.next) {
                    case 0:
                      _context78.next = 2
                      return fuc.updateInfo({}, {
                        twitter: true
                      })

                    case 2:
                      return _context78.abrupt('return', fuc.toggleActions({
                        social: 'twitter',
                        website: 'keylol',
                        elements: [name],
                        type: type,
                        action: action
                      }))

                    case 3:
                    case 'end':
                      return _context78.stop()
                  }
                }
              }, _callee77)
            }))

            return function (_x51, _x52, _x53) {
              return _ref89.apply(this, arguments)
            }
          }())

          AutoTask.toggleTWITCH = function (action, name) {
            return fuc.toggleActions({
              social: 'twitch',
              website: 'keylol',
              elements: [name],
              action: action
            })
          }

          AutoTask.toggleVK = function (action, name) {
            return fuc.toggleActions({
              social: 'vk',
              website: 'keylol',
              elements: [name],
              action: action
            })
          }

          AutoTask.toggleSTEAM = /* #__PURE__ */(function () {
            var _ref90 = _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee78 (action, name, type) {
              var isAnnouncement
              var isGroup
              var elements
              var _len
              var args
              var _key
              var _args79 = arguments

              return regeneratorRuntime.wrap(function _callee78$ (_context79) {
                while (1) {
                  switch (_context79.prev = _context79.next) {
                    case 0:
                      isAnnouncement = type === 'announcement'
                      isGroup = type === 'group'
                      _context79.next = 4
                      return fuc.updateInfo({}, {
                        steamStore: !isGroup || isAnnouncement,
                        steamCommunity: isGroup
                      })

                    case 4:
                      elements = [name]

                      for (_len = _args79.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
                        args[_key - 3] = _args79[_key]
                      }

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

                      return _context79.abrupt('return', fuc.toggleActions({
                        social: 'steam',
                        website: 'keylol',
                        elements: elements,
                        action: action,
                        type: type
                      }))

                    case 8:
                    case 'end':
                      return _context79.stop()
                  }
                }
              }, _callee78)
            }))

            return function (_x54, _x55, _x56) {
              return _ref90.apply(this, arguments)
            }
          }())

          AutoTask.toggleAutoTaskSelect = function (event, ele) {
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
            var _iterator34 = _createForOfIteratorHelper(discordLinks)
            var _step34

            try {
              for (_iterator34.s(); !(_step34 = _iterator34.n()).done;) {
                var _link$match3

                var discordLink = _step34.value
                var link = $(discordLink).attr('href')
                var inviteId = link === null || link === void 0 ? void 0 : (_link$match3 = link.match(/invite\/(.+)/)) === null || _link$match3 === void 0 ? void 0 : _link$match3[1]

                if (inviteId) {
                  this.addBtn(discordLink, 'toggleDiscord', inviteId, '', ['加入', '退出'])
                }
              }
            } catch (err) {
              _iterator34.e(err)
            } finally {
              _iterator34.f()
            }
          }

          if (redditLinks.length > 0) {
            var _iterator35 = _createForOfIteratorHelper(redditLinks)
            var _step35

            try {
              for (_iterator35.s(); !(_step35 = _iterator35.n()).done;) {
                var _link$match4

                var redditLink = _step35.value

                var _link = $(redditLink).attr('href')

                var name = _link === null || _link === void 0 ? void 0 : (_link$match4 = _link.match(/https?:\/\/www\.reddit\.com\/r\/([^/]*)/)) === null || _link$match4 === void 0 ? void 0 : _link$match4[1]

                if (name) {
                  this.addBtn(redditLink, 'toggleREDDIT', name, '', ['加入', '退出'])
                }
              }
            } catch (err) {
              _iterator35.e(err)
            } finally {
              _iterator35.f()
            }
          }

          if (insLinks.length > 0) {
            var _iterator36 = _createForOfIteratorHelper(insLinks)
            var _step36

            try {
              for (_iterator36.s(); !(_step36 = _iterator36.n()).done;) {
                var _link2$match

                var insLink = _step36.value

                var _link2 = $(insLink).attr('href')

                var _name3 = _link2 === null || _link2 === void 0 ? void 0 : (_link2$match = _link2.match(/https:\/\/www\.instagram\.com\/(.+)?\//)) === null || _link2$match === void 0 ? void 0 : _link2$match[1]

                if (_name3) {
                  this.addBtn(insLink, 'toggleINS', _name3, '', ['关注', '取关'])
                }
              }
            } catch (err) {
              _iterator36.e(err)
            } finally {
              _iterator36.f()
            }
          }

          if (twitterLinks.length > 0) {
            var _iterator37 = _createForOfIteratorHelper(twitterLinks)
            var _step37

            try {
              for (_iterator37.s(); !(_step37 = _iterator37.n()).done;) {
                var _link3$match, _link3$match2

                var twitterLink = _step37.value

                var _link3 = $(twitterLink).attr('href')

                var userId = _link3 === null || _link3 === void 0 ? void 0 : (_link3$match = _link3.match(/https:\/\/twitter\.com\/(.+)/)) === null || _link3$match === void 0 ? void 0 : _link3$match[1]
                var tweetId = _link3 === null || _link3 === void 0 ? void 0 : (_link3$match2 = _link3.match(/https:\/\/twitter\.com\/.*?\/status\/([\d]+)/)) === null || _link3$match2 === void 0 ? void 0 : _link3$match2[1]

                if (tweetId) {
                  this.addBtn(twitterLink, 'toggleTWITTER', tweetId, 'retweet', ['转推', '撤销转推'])
                } else {
                  this.addBtn(twitterLink, 'toggleTWITTER', userId, 'follow', ['关注', '取关'])
                }
              }
            } catch (err) {
              _iterator37.e(err)
            } finally {
              _iterator37.f()
            }
          }

          if (twitchLinks.length > 0) {
            var _iterator38 = _createForOfIteratorHelper(twitchLinks)
            var _step38

            try {
              for (_iterator38.s(); !(_step38 = _iterator38.n()).done;) {
                var _link4$match

                var twitchLink = _step38.value

                var _link4 = $(twitchLink).attr('href')

                var _name4 = _link4 === null || _link4 === void 0 ? void 0 : (_link4$match = _link4.match(/https:\/\/www\.twitch\.tv\/(.+)/)) === null || _link4$match === void 0 ? void 0 : _link4$match[1]

                if (_name4) {
                  this.addBtn(twitchLink, 'toggleTWITCH', _name4, '', ['关注', '取关'])
                }
              }
            } catch (err) {
              _iterator38.e(err)
            } finally {
              _iterator38.f()
            }
          }

          if (vkLinks.length > 0) {
            var _iterator39 = _createForOfIteratorHelper(vkLinks)
            var _step39

            try {
              for (_iterator39.s(); !(_step39 = _iterator39.n()).done;) {
                var _link5$match

                var vkLink = _step39.value

                var _link5 = $(vkLink).attr('href')

                var _name5 = _link5 === null || _link5 === void 0 ? void 0 : (_link5$match = _link5.match(/https:\/\/vk\.com\/([^/]+)/)) === null || _link5$match === void 0 ? void 0 : _link5$match[1]

                if (_name5) {
                  this.addBtn(vkLink, 'toggleVK', _name5, '', ['加入', '退出'])
                }
              }
            } catch (err) {
              _iterator39.e(err)
            } finally {
              _iterator39.f()
            }
          }

          if (steamStoreLinks.length > 0) {
            var _iterator40 = _createForOfIteratorHelper(steamStoreLinks)
            var _step40

            try {
              for (_iterator40.s(); !(_step40 = _iterator40.n()).done;) {
                var _link6$match, _link6$match2, _link6$match3, _link6$match4, _link6$match5, _link6$match6, _link6$match7

                var steamStoreLink = _step40.value

                var _link6 = $(steamStoreLink).attr('href')

                var gameId = _link6 === null || _link6 === void 0 ? void 0 : (_link6$match = _link6.match(/app\/([\d]+)/)) === null || _link6$match === void 0 ? void 0 : _link6$match[1]
                var curatorId = _link6 === null || _link6 === void 0 ? void 0 : (_link6$match2 = _link6.match(/curator\/([\d]+)/)) === null || _link6$match2 === void 0 ? void 0 : _link6$match2[1]
                var publisherName = (_link6 === null || _link6 === void 0 ? void 0 : (_link6$match3 = _link6.match(/publisher\/(.+)\/?/)) === null || _link6$match3 === void 0 ? void 0 : _link6$match3[1]) || (_link6 === null || _link6 === void 0 ? void 0 : (_link6$match4 = _link6.match(/pub\/(.+)\/?/)) === null || _link6$match4 === void 0 ? void 0 : _link6$match4[1])
                var developerName = (_link6 === null || _link6 === void 0 ? void 0 : (_link6$match5 = _link6.match(/developer\/(.+)\/?/)) === null || _link6$match5 === void 0 ? void 0 : _link6$match5[1]) || (_link6 === null || _link6 === void 0 ? void 0 : (_link6$match6 = _link6.match(/dev\/(.+)\/?/)) === null || _link6$match6 === void 0 ? void 0 : _link6$match6[1])
                var franchiseName = _link6 === null || _link6 === void 0 ? void 0 : (_link6$match7 = _link6.match(/franchise\/(.+)\/?/)) === null || _link6$match7 === void 0 ? void 0 : _link6$match7[1]

                var _ref91 = (_link6 === null || _link6 === void 0 ? void 0 : _link6.match(/(https?:\/\/store\.steampowered\.com\/newshub\/app\/[\d]+\/view\/([\d]+))\?authwgtoken=(.+?)&clanid=(.+)/)) || []
                var _ref92 = _slicedToArray(_ref91, 5)
                var url = _ref92[1]
                var announcementId = _ref92[2]
                var wgauthtoken = _ref92[3]
                var clanid = _ref92[4]

                if (gameId) {
                  this.addBtn(steamStoreLink, 'toggleSTEAM', gameId, 'game', ['关注', '取关'])
                  this.addBtn(steamStoreLink, 'toggleSTEAM', gameId, 'wishlist', ['加入愿望单', '移出愿望单'])
                } else if (curatorId) {
                  this.addBtn(steamStoreLink, 'toggleSTEAM', curatorId, 'curator', ['关注', '取关'])
                } else if (publisherName) {
                  this.addBtn(steamStoreLink, 'toggleSTEAM', publisherName, 'publisher', ['关注', '取关'])
                } else if (developerName) {
                  this.addBtn(steamStoreLink, 'toggleSTEAM', developerName, 'developer', ['关注', '取关'])
                } else if (franchiseName) {
                  this.addBtn(steamStoreLink, 'toggleSTEAM', franchiseName, 'franchise', ['关注', '取关'])
                } else if (announcementId) {
                  this.addBtn(steamStoreLink, 'toggleSTEAM', announcementId, 'announcement', ['点赞'], url, wgauthtoken, clanid)
                }
              }
            } catch (err) {
              _iterator40.e(err)
            } finally {
              _iterator40.f()
            }
          }

          if (steamCommunityLinks.length > 0) {
            var _iterator41 = _createForOfIteratorHelper(steamCommunityLinks)
            var _step41

            try {
              for (_iterator41.s(); !(_step41 = _iterator41.n()).done;) {
                var _link7$match

                var steamCommunityLink = _step41.value

                var _link7 = $(steamCommunityLink).attr('href')

                var groupId = _link7 === null || _link7 === void 0 ? void 0 : (_link7$match = _link7.match(/groups\/(.+)\/?/)) === null || _link7$match === void 0 ? void 0 : _link7$match[1]
                var announcement = _link7 === null || _link7 === void 0 ? void 0 : _link7.match(/announcements\/detail\/([\d]+)/)

                if (groupId) {
                  this.addBtn(steamCommunityLink, 'toggleSTEAM', groupId, 'group', ['加入', '退出'])
                } else if (announcement) {
                  this.addBtn(steamCommunityLink, 'toggleSTEAM', announcement[1], 'announcement', ['点赞'], announcement.input)
                }
              }
            } catch (err) {
              _iterator41.e(err)
            } finally {
              _iterator41.f()
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
        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee79 () {
          var selectedBtns, _iterator42, _step42, btn, action

          return regeneratorRuntime.wrap(function _callee79$ (_context80) {
            while (1) {
              switch (_context80.prev = _context80.next) {
                case 0:
                  _context80.prev = 0
                  selectedBtns = $('.auto-task-keylol[selected="selected"]')
                  _iterator42 = _createForOfIteratorHelper(selectedBtns)
                  _context80.prev = 3

                  _iterator42.s()

                case 5:
                  if ((_step42 = _iterator42.n()).done) {
                    _context80.next = 13
                    break
                  }

                  btn = _step42.value
                  action = $(btn).attr('onclick')
                  _context80.next = 10
                  return eval(action)

                case 10:
                  // eslint-disable-line no-eval
                  btn.removeAttribute('selected')

                case 11:
                  _context80.next = 5
                  break

                case 13:
                  _context80.next = 18
                  break

                case 15:
                  _context80.prev = 15
                  _context80.t0 = _context80.catch(3)

                  _iterator42.e(_context80.t0)

                case 18:
                  _context80.prev = 18

                  _iterator42.f()

                  return _context80.finish(18)

                case 21:
                  _context80.next = 26
                  break

                case 23:
                  _context80.prev = 23
                  _context80.t1 = _context80.catch(0)
                  throwError(_context80.t1, 'keylol.fuck')

                case 26:
                case 'end':
                  return _context80.stop()
              }
            }
          }, _callee79, null, [[0, 23], [3, 15, 18, 21]])
        }))()
      },
      verify: function verify () {},
      remove: function remove () {},
      get_giveawayId: function get_giveawayId () {
        try {
          var _window$location$href5, _window$location$href6

          return ((_window$location$href5 = window.location.href.match(/t([\d]+?)-/)) === null || _window$location$href5 === void 0 ? void 0 : _window$location$href5[1]) || ((_window$location$href6 = window.location.href.match(/tid=([\d]+)/)) === null || _window$location$href6 === void 0 ? void 0 : _window$location$href6[1]) || window.location.href
        } catch (e) {
          throwError(e, 'keylol.get_giveawayId')
        }
      },
      addBtn: function addBtn (before, func, name, type, text) {
        try {
          for (var _len2 = arguments.length, args = new Array(_len2 > 5 ? _len2 - 5 : 0), _key2 = 5; _key2 < _len2; _key2++) {
            args[_key2 - 5] = arguments[_key2]
          }

          var joinBtn = text[0] ? $('<a href="javascript:void(0);" class="auto-task-keylol" oncontextmenu="return false" onmousedown="AutoTask.toggleAutoTaskSelect(event, this)" onclick="AutoTask.'.concat(func, "('fuck','").concat(name, "'").concat(type ? ",'".concat(type, "'") : '').concat(args && args.length === 3 ? ",'".concat(args[0], "','").concat(args[1], "','").concat(args[2], "'") : '').concat(args && args.length === 1 ? ",'".concat(args[0], "'") : '', ')" target="_self">').concat(text[0], '</a>')) : ''
          var leaveBtn = text[1] ? $('<a href="javascript:void(0);" class="auto-task-keylol" oncontextmenu="return false" onmousedown="AutoTask.toggleAutoTaskSelect(event, this)" onclick="AutoTask.'.concat(func, "('remove','").concat(name, "','").concat(type, "')\" target=\"_self\">").concat(text[1], '</a>')) : ''
          $(before).after(leaveBtn).after(joinBtn)
        } catch (e) {
          throwError(e, 'keylol.addBtn')
        }
      },
      updateSteamInfo: function updateSteamInfo (callback) {
        var _this26 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee80 () {
          var result
          return regeneratorRuntime.wrap(function _callee80$ (_context81) {
            while (1) {
              switch (_context81.prev = _context81.next) {
                case 0:
                  _context81.prev = 0
                  result = false

                  if (!(_this26.taskInfo.groups.length > 0)) {
                    _context81.next = 14
                    break
                  }

                  if (!(_this26.taskInfo.curators.length > 0 || _this26.taskInfo.fGames.length > 0 || _this26.taskInfo.wishlists.length > 0)) {
                    _context81.next = 9
                    break
                  }

                  _context81.next = 6
                  return fuc.updateSteamInfo('all')

                case 6:
                  result = _context81.sent
                  _context81.next = 12
                  break

                case 9:
                  _context81.next = 11
                  return fuc.updateSteamInfo('community')

                case 11:
                  result = _context81.sent

                case 12:
                  _context81.next = 21
                  break

                case 14:
                  if (!(_this26.taskInfo.curators.length > 0 || _this26.taskInfo.fGames.length > 0 || _this26.taskInfo.wishlists.length > 0)) {
                    _context81.next = 20
                    break
                  }

                  _context81.next = 17
                  return fuc.updateSteamInfo('store')

                case 17:
                  result = _context81.sent
                  _context81.next = 21
                  break

                case 20:
                  result = true

                case 21:
                  if (result) callback()
                  _context81.next = 27
                  break

                case 24:
                  _context81.prev = 24
                  _context81.t0 = _context81.catch(0)
                  throwError(_context81.t0, 'keylol.updateSteamInfo')

                case 27:
                case 'end':
                  return _context81.stop()
              }
            }
          }, _callee80, null, [[0, 24]])
        }))()
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
          return window.location.host === 'marvelousga.com'
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
            var status = fuc.echoLog({
              type: 'custom',
              text: '<li>'.concat(getI18n('getTasksInfo'), '<font></font></li>')
            })
            var tasksContainer = $('.container_task')

            var _iterator43 = _createForOfIteratorHelper(tasksContainer)
            var _step43

            try {
              for (_iterator43.s(); !(_step43 = _iterator43.n()).done;) {
                var task = _step43.value
                var taskDes = $(task).find('.card-body p.card-text.monospace')
                var verifyBtn = $(task).find('button[id^=task_]:not(:contains(VERIFIED))')

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

                  var _name6 = (_taskDes$find$attr$ma2 = taskDes.find('a[href*="twitch.tv"]').attr('href').match(/twitch\.tv\/([^/]+)/)) === null || _taskDes$find$attr$ma2 === void 0 ? void 0 : _taskDes$find$attr$ma2[1]

                  if (_name6) {
                    if (verifyBtn.length > 0) {
                      this.currentTaskInfo.twitchChannels.push(_name6)
                    }

                    this.taskInfo.twitchChannels.push(_name6)
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
              _iterator43.e(err)
            } finally {
              _iterator43.f()
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
        var _this27 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee81 () {
          var pro, links, _iterator44, _step44, link

          return regeneratorRuntime.wrap(function _callee81$ (_context82) {
            while (1) {
              switch (_context82.prev = _context82.next) {
                case 0:
                  _context82.prev = 0
                  pro = []
                  pro.push(_this27.toggleActions('fuck'))
                  links = fuc.unique(_this27.currentTaskInfo.links)

                  if (!_this27.conf.fuck.visitLink) {
                    _context82.next = 23
                    break
                  }

                  _iterator44 = _createForOfIteratorHelper(links)
                  _context82.prev = 6

                  _iterator44.s()

                case 8:
                  if ((_step44 = _iterator44.n()).done) {
                    _context82.next = 15
                    break
                  }

                  link = _step44.value
                  pro.push(fuc.visitLink(link.pageUrl, {
                    url: '/ajax/verifyTasks/webpage/clickedLink',
                    method: 'POST',
                    headers: {
                      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                      'x-csrf-token': $('meta[name="csrf-token"]').attr('content')
                    },
                    data: $.param({
                      giveaway_slug: _this27.get_giveawayId(),
                      giveaway_task_id: link.taskId
                    })
                  }))
                  _context82.next = 13
                  return delay(500)

                case 13:
                  _context82.next = 8
                  break

                case 15:
                  _context82.next = 20
                  break

                case 17:
                  _context82.prev = 17
                  _context82.t0 = _context82.catch(6)

                  _iterator44.e(_context82.t0)

                case 20:
                  _context82.prev = 20

                  _iterator44.f()

                  return _context82.finish(20)

                case 23:
                  Promise.all(pro).finally(function () {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                    })
                    if (_this27.conf.fuck.verifyTask) _this27.verify()
                  })
                  _context82.next = 29
                  break

                case 26:
                  _context82.prev = 26
                  _context82.t1 = _context82.catch(0)
                  throwError(_context82.t1, 'marvelousga.do_task')

                case 29:
                case 'end':
                  return _context82.stop()
              }
            }
          }, _callee81, null, [[0, 26], [6, 17, 20, 23]])
        }))()
      },
      verifyTask: function verifyTask (task) {
        var _this28 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee82 () {
          var logStatus, _yield$fuc$httpReques5, result, statusText, status, data

          return regeneratorRuntime.wrap(function _callee82$ (_context83) {
            while (1) {
              switch (_context83.prev = _context83.next) {
                case 0:
                  logStatus = fuc.echoLog({
                    type: 'custom',
                    text: '<li>'.concat(getI18n('verifyingTask')).concat(task.taskDes, '...<font></font></li>')
                  })
                  _context83.next = 3
                  return fuc.httpRequest({
                    url: '/ajax/verifyTasks/' + task.provider + '/' + task.taskRoute,
                    method: 'POST',
                    dataType: 'json',
                    headers: {
                      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                      'x-csrf-token': $('meta[name="csrf-token"]').attr('content')
                    },
                    data: $.param({
                      giveaway_slug: _this28.get_giveawayId(),
                      giveaway_task_id: task.taskId
                    })
                  })

                case 3:
                  _yield$fuc$httpReques5 = _context83.sent
                  result = _yield$fuc$httpReques5.result
                  statusText = _yield$fuc$httpReques5.statusText
                  status = _yield$fuc$httpReques5.status
                  data = _yield$fuc$httpReques5.data

                  if (result === 'Success') {
                    if (data.status === 200) {
                      if (data.response.status === 1) {
                        $('#task_'.concat(task.provider, '_').concat(task.taskRoute, '_').concat(task.taskId)).text('VERIFIED')
                        logStatus.success(data.response.percentageNanoBar.toFixed(2) + '%')
                      } else {
                        logStatus.error('Error:' + (data.response.message || 'error'))

                        if (globalConf.other.autoOpen) {
                          if (/Visit[\w\W]*?this[\w\W]*?webpage/gim.test(task.taskDes)) {
                            $('task_webpage_clickedLink_'.concat(task.taskId)).click()
                          } else {
                            window.open($('<div>'.concat(task.taskDes, '</div>')).find('a').attr('href'), '_blank')
                          }
                        }
                      }
                    } else {
                      logStatus.error('Error:' + (data.response.message || data.statusText || data.status))

                      if (globalConf.other.autoOpen) {
                        if (/Visit[\w\W]*?this[\w\W]*?webpage/gim.test(task.taskDes)) {
                          $('task_webpage_clickedLink_'.concat(task.taskId)).click()
                        } else {
                          window.open($('<div>'.concat(task.taskDes, '</div>')).find('a').attr('href'), '_blank')
                        }
                      }
                    }
                  } else {
                    logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                  }

                case 9:
                case 'end':
                  return _context83.stop()
              }
            }
          }, _callee82)
        }))()
      },
      verify: function verify () {
        var _arguments9 = arguments
        var _this29 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee83 () {
          var verify, pro, _iterator45, _step45, task

          return regeneratorRuntime.wrap(function _callee83$ (_context84) {
            while (1) {
              switch (_context84.prev = _context84.next) {
                case 0:
                  verify = _arguments9.length > 0 && _arguments9[0] !== undefined ? _arguments9[0] : false
                  _context84.prev = 1

                  if (!verify) {
                    _context84.next = 25
                    break
                  }

                  pro = []
                  _iterator45 = _createForOfIteratorHelper(fuc.unique(_this29.currentTaskInfo.tasks))
                  _context84.prev = 5

                  _iterator45.s()

                case 7:
                  if ((_step45 = _iterator45.n()).done) {
                    _context84.next = 14
                    break
                  }

                  task = _step45.value
                  pro.push(_this29.verifyTask(task))
                  _context84.next = 12
                  return fuc.delay(500)

                case 12:
                  _context84.next = 7
                  break

                case 14:
                  _context84.next = 19
                  break

                case 16:
                  _context84.prev = 16
                  _context84.t0 = _context84.catch(5)

                  _iterator45.e(_context84.t0)

                case 19:
                  _context84.prev = 19

                  _iterator45.f()

                  return _context84.finish(19)

                case 22:
                  Promise.all(pro).finally(function () {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="success">'.concat(getI18n('verifyTasksComplete'), '</font><font class="warning">').concat(getI18n('doYourself'), '<a class="hclonely-google" href="javascript:void(0)" target="_self">').concat(getI18n('googleVerify'), '</a>').concat(getI18n('getKey'), '!</font></li>')
                    })
                    $('#get_key_container').show()
                    $('.hclonely-google').unbind().click(function () {
                      $('#get_key_container')[0].scrollIntoView()
                    })
                  })
                  _context84.next = 26
                  break

                case 25:
                  _this29.get_tasks('verify')

                case 26:
                  _context84.next = 31
                  break

                case 28:
                  _context84.prev = 28
                  _context84.t1 = _context84.catch(1)
                  throwError(_context84.t1, 'marvelousga.verify')

                case 31:
                case 'end':
                  return _context84.stop()
              }
            }
          }, _callee83, null, [[1, 28], [5, 16, 19, 22]])
        }))()
      },
      remove: function remove () {
        var _arguments10 = arguments
        var _this30 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee84 () {
          var remove
          return regeneratorRuntime.wrap(function _callee84$ (_context85) {
            while (1) {
              switch (_context85.prev = _context85.next) {
                case 0:
                  remove = _arguments10.length > 0 && _arguments10[0] !== undefined ? _arguments10[0] : false
                  _context85.prev = 1

                  if (!remove) {
                    _context85.next = 8
                    break
                  }

                  _context85.next = 5
                  return _this30.toggleActions('remove')

                case 5:
                  fuc.echoLog({
                    type: 'custom',
                    text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                  })
                  _context85.next = 9
                  break

                case 8:
                  _this30.get_tasks('remove')

                case 9:
                  _context85.next = 14
                  break

                case 11:
                  _context85.prev = 11
                  _context85.t0 = _context85.catch(1)
                  throwError(_context85.t0, 'marvelousga.remove')

                case 14:
                case 'end':
                  return _context85.stop()
              }
            }
          }, _callee84, null, [[1, 11]])
        }))()
      },
      toggleActions: function toggleActions (action) {
        var _this31 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee85 () {
          var fuck, taskInfo
          return regeneratorRuntime.wrap(function _callee85$ (_context86) {
            while (1) {
              switch (_context86.prev = _context86.next) {
                case 0:
                  _context86.prev = 0
                  fuck = action === 'fuck'
                  taskInfo = fuck ? _this31.currentTaskInfo : _this31.taskInfo
                  _context86.next = 5
                  return fuc.updateInfo(taskInfo)

                case 5:
                  _context86.next = 7
                  return fuc.assignment(taskInfo, _this31.conf[action], action, 'marvelousga')

                case 7:
                  _context86.next = 12
                  break

                case 9:
                  _context86.prev = 9
                  _context86.t0 = _context86.catch(0)
                  throwError(_context86.t0, 'marvelousga.toggleActions')

                case 12:
                case 'end':
                  return _context86.stop()
              }
            }
          }, _callee85, null, [[0, 9]])
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
            }).then(function (_ref93) {
              var value = _ref93.value

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
      conf: (config === null || config === void 0 ? void 0 : (_config$marvelousga = config.marvelousga) === null || _config$marvelousga === void 0 ? void 0 : _config$marvelousga.enable) ? config.marvelousga : globalConf
    }

    var opiumpulses = {
      test: function test () {
        try {
          return window.location.host === 'www.opiumpulses.com'
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
        var _arguments11 = arguments
        var _this32 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee86 () {
          var type, items, maxPoint, myPoint, _iterator46, _step46, item, needPoints, logStatus, a, _a$attr$match, giveawayId, _yield$fuc$httpReques6, result, statusText, status, data, _data$responseText$ma17, points

          return regeneratorRuntime.wrap(function _callee86$ (_context87) {
            while (1) {
              switch (_context87.prev = _context87.next) {
                case 0:
                  type = _arguments11.length > 0 && _arguments11[0] !== undefined ? _arguments11[0] : 'FREE'
                  _context87.prev = 1
                  items = $(".giveaways-page-item:contains('".concat(type, "'):not(:contains('ENTERED'))"))
                  maxPoint = _this32.maxPoint()
                  myPoint = _this32.myPoints
                  _iterator46 = _createForOfIteratorHelper(items)
                  _context87.prev = 6

                  _iterator46.s()

                case 8:
                  if ((_step46 = _iterator46.n()).done) {
                    _context87.next = 33
                    break
                  }

                  item = _step46.value
                  needPoints = $(item).find('.giveaways-page-item-header-points').text().match(/[\d]+/gim)

                  if (!(type === 'points' && needPoints && parseInt(needPoints[0]) > myPoint)) {
                    _context87.next = 15
                    break
                  }

                  fuc.echoLog({
                    type: 'custom',
                    text: '<li><font class="warning">'.concat(getI18n('noPoints'), '</font></li>')
                  })
                  _context87.next = 31
                  break

                case 15:
                  if (!(type === 'points' && !needPoints)) {
                    _context87.next = 19
                    break
                  }

                  fuc.echoLog({
                    type: 'custom',
                    text: '<li><font class="warning">'.concat(getI18n('getNeedPointsFailed'), '</font></li>')
                  })
                  _context87.next = 31
                  break

                case 19:
                  if (type === 'points' && parseInt(needPoints[0]) > maxPoint) {
                    _context87.next = 31
                    break
                  }

                  logStatus = fuc.echoLog({
                    type: 'custom',
                    text: '<li>'.concat(getI18n('joinLottery'), '<a href="').concat($(item).find('a.giveaways-page-item-img-btn-more').attr('href'), '" target="_blank">').concat($(item).find('.giveaways-page-item-footer-name').text().trim(), '</a>...<font></font></li>')
                  })
                  a = $(item).find("a.giveaways-page-item-img-btn-enter:contains('enter')")

                  if (a.attr('onclick') && a.attr('onclick').includes('checkUser')) {
                    giveawayId = (_a$attr$match = a.attr('onclick').match(/[\d]+/)) === null || _a$attr$match === void 0 ? void 0 : _a$attr$match[0]
                    if (giveawayId) checkUser(giveawayId)
                  }

                  _context87.next = 25
                  return fuc.httpRequest({
                    url: a.attr('href'),
                    method: 'GET'
                  })

                case 25:
                  _yield$fuc$httpReques6 = _context87.sent
                  result = _yield$fuc$httpReques6.result
                  statusText = _yield$fuc$httpReques6.statusText
                  status = _yield$fuc$httpReques6.status
                  data = _yield$fuc$httpReques6.data

                  if (result === 'Success') {
                    if (data.responseText && /You've entered this giveaway/gim.test(data.responseText)) {
                      logStatus.success()
                      points = (_data$responseText$ma17 = data.responseText.match(/Points:[\s]*?([\d]+)/)) === null || _data$responseText$ma17 === void 0 ? void 0 : _data$responseText$ma17[1]

                      if (type === 'points' && points) {
                        if (debug) console.log(getI18n('pointsLeft') + points)
                        myPoint = parseInt(points)
                      }
                    } else {
                      logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
                    }
                  } else {
                    logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                  }

                case 31:
                  _context87.next = 8
                  break

                case 33:
                  _context87.next = 38
                  break

                case 35:
                  _context87.prev = 35
                  _context87.t0 = _context87.catch(6)

                  _iterator46.e(_context87.t0)

                case 38:
                  _context87.prev = 38

                  _iterator46.f()

                  return _context87.finish(38)

                case 41:
                  fuc.echoLog({
                    type: 'custom',
                    text: '<li>-----END-----</li>'
                  })
                  _context87.next = 47
                  break

                case 44:
                  _context87.prev = 44
                  _context87.t1 = _context87.catch(1)
                  throwError(_context87.t1, 'opiumpulses.get_tasks')

                case 47:
                case 'end':
                  return _context87.stop()
              }
            }
          }, _callee86, null, [[1, 44], [6, 35, 38, 41]])
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
      conf: (config === null || config === void 0 ? void 0 : (_config$opiumpulses = config.opiumpulses) === null || _config$opiumpulses === void 0 ? void 0 : _config$opiumpulses.enable) ? config.opiumpulses : globalConf,
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
          return window.location.host === 'prys.revadike.com'
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
        var _this33 = this

        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'do_task'

        try {
          var status = fuc.echoLog({
            type: 'custom',
            text: '<li>'.concat(getI18n('getTasksInfo'), '<font></font></li>')
          })
          var steps = $('#steps tbody tr')

          for (var i = 0; i < steps.length; i++) {
            if (steps.eq(i).find('span:contains(Success)').length === 0) checkClick(i)
          }

          if (callback === 'do_task') {
            this.currentTaskInfo = fuc.clearTaskInfo(this.currentTaskInfo)
            var pro = []
            var taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
            if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory

            var _iterator47 = _createForOfIteratorHelper(steps)
            var _step47

            try {
              for (_iterator47.s(); !(_step47 = _iterator47.n()).done;) {
                var step = _step47.value

                if ($(step).find('span:contains(Success)').length === 0) {
                  if ($(step).find("a[href*='store.steampowered.com/curator/']").length > 0) {
                    var _link$match5

                    var link = $(step).find("a[href*='store.steampowered.com/curator/']").attr('href')
                    var curatorId = (_link$match5 = link.match(/curator\/([\d]+)/)) === null || _link$match5 === void 0 ? void 0 : _link$match5[1]

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
                    var _link9 = $(step).find("a[href*='steamcommunity.com/gid']").attr('href')

                    pro.push(fuc.getFinalUrl(_link9).then(function (_ref94) {
                      var result = _ref94.result
                      var finalUrl = _ref94.finalUrl

                      if (result === 'Success') {
                        var _finalUrl$match9

                        var _groupName2 = (_finalUrl$match9 = finalUrl.match(/groups\/(.+)\/?/)) === null || _finalUrl$match9 === void 0 ? void 0 : _finalUrl$match9[1]

                        if (_groupName2) {
                          _this33.currentTaskInfo.groups.push(_groupName2)

                          _this33.taskInfo.groups.push(_groupName2)
                        }
                      }
                    }))
                  }
                }
              }
            } catch (err) {
              _iterator47.e(err)
            } finally {
              _iterator47.f()
            }

            Promise.all(pro).finally(function () {
              _this33.currentTaskInfo = fuc.uniqueTaskInfo(_this33.currentTaskInfo)
              _this33.taskInfo = fuc.uniqueTaskInfo(_this33.taskInfo)
              GM_setValue('taskInfo[' + window.location.host + _this33.get_giveawayId() + ']', _this33.taskInfo)

              if (_this33.currentTaskInfo.groups.length > 0 || _this33.currentTaskInfo.curators.length > 0) {
                _this33.do_task()
              } else {
                fuc.echoLog({
                  type: 'custom',
                  text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                })
                if (_this33.conf.fuck.verifyTask) _this33.verify()
              }
            })
          } else if (callback === 'verify') {
            this.currentTaskInfo.tasks = []
            var checks = $('#steps tbody a[id^=check]')

            if (checks.length > 0) {
              var _iterator48 = _createForOfIteratorHelper(checks)
              var _step48

              try {
                for (_iterator48.s(); !(_step48 = _iterator48.n()).done;) {
                  var _$$attr$match

                  var check = _step48.value
                  var id = (_$$attr$match = $(check).attr('id').match(/[\d]+/)) === null || _$$attr$match === void 0 ? void 0 : _$$attr$match[0]
                  if (id) {
                    this.currentTaskInfo.tasks.push({
                      id: id,
                      taskDes: $(check).parent().prev().html().trim()
                    })
                  }
                }
              } catch (err) {
                _iterator48.e(err)
              } finally {
                _iterator48.f()
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
              var _pro = []

              var _iterator49 = _createForOfIteratorHelper(steps)
              var _step49

              try {
                for (_iterator49.s(); !(_step49 = _iterator49.n()).done;) {
                  var _step50 = _step49.value

                  if ($(_step50).find("a[href*='store.steampowered.com/curator/']").length > 0) {
                    var _link10$match

                    var _link10 = $(_step50).find("a[href*='store.steampowered.com/curator/']").attr('href')

                    var _curatorId = (_link10$match = _link10.match(/curator\/([\d]+)/)) === null || _link10$match === void 0 ? void 0 : _link10$match[1]

                    if (_curatorId) this.taskInfo.curators.push(_curatorId)
                  } else if ($(_step50).find("a[href*='steampowered.com/groups/']").length > 0) {
                    var _link11$match

                    var _link11 = $(_step50).find("a[href*='steampowered.com/groups/']").attr('href')

                    var _groupName3 = (_link11$match = _link11.match(/groups\/(.+)\/?/)) === null || _link11$match === void 0 ? void 0 : _link11$match[1]

                    if (_groupName3) this.taskInfo.groups.push(_groupName3)
                  } else if ($(_step50).find("a[href*='steamcommunity.com/gid']").length > 0) {
                    var _link12 = $(_step50).find("a[href*='steamcommunity.com/gid']").attr('href')

                    _pro.push(fuc.getFinalUrl(_link12).then(function (_ref95) {
                      var result = _ref95.result
                      var finalUrl = _ref95.finalUrl

                      if (result === 'Success') {
                        var _finalUrl$match10

                        var _groupName4 = (_finalUrl$match10 = finalUrl.match(/groups\/(.+)\/?/)) === null || _finalUrl$match10 === void 0 ? void 0 : _finalUrl$match10[1]

                        if (_groupName4) {
                          _this33.taskInfo.groups.push(_groupName4)
                        }
                      }
                    }))
                  }
                }
              } catch (err) {
                _iterator49.e(err)
              } finally {
                _iterator49.f()
              }

              if (_pro.length > 0) {
                Promise.all(_pro).finally(function () {
                  _this33.taskInfo = fuc.uniqueTaskInfo(_this33.taskInfo)
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
        var _this34 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee87 () {
          return regeneratorRuntime.wrap(function _callee87$ (_context88) {
            while (1) {
              switch (_context88.prev = _context88.next) {
                case 0:
                  _context88.prev = 0
                  _context88.next = 3
                  return _this34.toggleActions('fuck')

                case 3:
                  fuc.echoLog({
                    type: 'custom',
                    text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                  })
                  if (_this34.conf.fuck.verifyTask) _this34.verify()
                  _context88.next = 10
                  break

                case 7:
                  _context88.prev = 7
                  _context88.t0 = _context88.catch(0)
                  throwError(_context88.t0, 'prys.do_task')

                case 10:
                case 'end':
                  return _context88.stop()
              }
            }
          }, _callee87, null, [[0, 7]])
        }))()
      },
      verify: function verify () {
        var _this35 = this

        var verify = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false

        try {
          if (verify) {
            var pro = []

            var _iterator50 = _createForOfIteratorHelper(fuc.unique(this.currentTaskInfo.tasks))
            var _step51

            try {
              var _loop5 = function _loop5 () {
                var task = _step51.value
                var status = fuc.echoLog({
                  type: 'custom',
                  text: '<li>'.concat(getI18n('verifyingTask')).concat(task.taskDes, '...<font></font></li>')
                })
                pro.push(new Promise(function (resolve) {
                  _this35.checkStep(task.id, resolve, status)
                }))
              }

              for (_iterator50.s(); !(_step51 = _iterator50.n()).done;) {
                _loop5()
              }
            } catch (err) {
              _iterator50.e(err)
            } finally {
              _iterator50.f()
            }

            Promise.all(pro).finally(function () {
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
      checkStep: function checkStep (step, resolve, status) {
        var captcha = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null

        try {
          if (step !== 'captcha') {
            $('#check' + step).replaceWith('<span id="check' + step + '"><i class="fa fa-refresh fa-spin fa-fw"></i> Checking...</span>')
          }

          $.post('/api/check_step', {
            step: step,
            id: getURLParameter('id'),
            'g-recaptcha-response': captcha
          }, function (json) {
            resolve()

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
            resolve()
            $('#check' + step).replaceWith('<a id="check' + step + '" href="javascript:checkStep(' + step + ')"><i class="fa fa-question"></i> Check</a>')
            status.error('Error:0')
          })
        } catch (e) {
          throwError(e, 'prys.checkStep')
        }
      },
      remove: function remove () {
        var _arguments12 = arguments
        var _this36 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee88 () {
          var remove
          return regeneratorRuntime.wrap(function _callee88$ (_context89) {
            while (1) {
              switch (_context89.prev = _context89.next) {
                case 0:
                  remove = _arguments12.length > 0 && _arguments12[0] !== undefined ? _arguments12[0] : false
                  _context89.prev = 1

                  if (!remove) {
                    _context89.next = 8
                    break
                  }

                  _context89.next = 5
                  return _this36.toggleActions('remove')

                case 5:
                  fuc.echoLog({
                    type: 'custom',
                    text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                  })
                  _context89.next = 9
                  break

                case 8:
                  _this36.get_tasks('remove')

                case 9:
                  _context89.next = 14
                  break

                case 11:
                  _context89.prev = 11
                  _context89.t0 = _context89.catch(1)
                  throwError(_context89.t0, 'prys.remove')

                case 14:
                case 'end':
                  return _context89.stop()
              }
            }
          }, _callee88, null, [[1, 11]])
        }))()
      },
      toggleActions: function toggleActions (action) {
        var _this37 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee89 () {
          var fuck, taskInfo
          return regeneratorRuntime.wrap(function _callee89$ (_context90) {
            while (1) {
              switch (_context90.prev = _context90.next) {
                case 0:
                  _context90.prev = 0
                  fuck = action === 'fuck'
                  taskInfo = fuck ? _this37.currentTaskInfo : _this37.taskInfo
                  _context90.next = 5
                  return fuc.updateInfo(taskInfo)

                case 5:
                  _context90.next = 7
                  return fuc.assignment(taskInfo, _this37.conf[action], action, 'prys')

                case 7:
                  _context90.next = 12
                  break

                case 9:
                  _context90.prev = 9
                  _context90.t0 = _context90.catch(0)
                  throwError(_context90.t0, 'prys.toggleActions')

                case 12:
                case 'end':
                  return _context90.stop()
              }
            }
          }, _callee89, null, [[0, 9]])
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
            }).then(function (_ref96) {
              var value = _ref96.value

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
      conf: (config === null || config === void 0 ? void 0 : (_config$prys = config.prys) === null || _config$prys === void 0 ? void 0 : _config$prys.enable) ? config.prys : globalConf
    }
    var takekey = {
      test: function test () {
        try {
          return window.location.host === 'takekey.ru'
        } catch (e) {
          throwError(e, 'takekey.test')
        }
      },
      fuck: function fuck () {
        try {
          this.get_tasks('do_task')
        } catch (e) {
          throwError(e, 'takekey.fuck')
        }
      },
      get_tasks: function get_tasks () {
        var _arguments13 = arguments
        var _this38 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee90 () {
          var callback, taskInfoHistory, status, tasksContainer, pro, _iterator51, _step52, task, icon, a, link, _link$match6, path

          return regeneratorRuntime.wrap(function _callee90$ (_context91) {
            while (1) {
              switch (_context91.prev = _context91.next) {
                case 0:
                  callback = _arguments13.length > 0 && _arguments13[0] !== undefined ? _arguments13[0] : 'do_task'

                  try {
                    taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + _this38.get_giveawayId() + ']')
                    if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) _this38.taskInfo = taskInfoHistory

                    if (callback === 'remove' && taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
                      _this38.remove(true)
                    } else {
                      _this38.currentTaskInfo = fuc.clearTaskInfo(_this38.currentTaskInfo)
                      status = fuc.echoLog({
                        type: 'custom',
                        text: '<li>'.concat(getI18n('getTasksInfo'), '<font></font></li>')
                      })
                      tasksContainer = $('#usl>div')
                      pro = []
                      _iterator51 = _createForOfIteratorHelper(tasksContainer)

                      try {
                        for (_iterator51.s(); !(_step52 = _iterator51.n()).done;) {
                          task = _step52.value

                          _this38.currentTaskInfo.tasks.push(task)

                          icon = $(task).find('i')
                          a = $(task).children('a[id]').attr('onclick', 'return false;')
                          link = a.attr('href')

                          a[0].click()
                          a.removeAttr('onclick')

                          if (icon.hasClass('fa-steam')) {
                            if (link && /gid\/[\d]+/.test(link)) {
                              pro.push(fuc.getFinalUrl(link).then(function (_ref97) {
                                var result = _ref97.result
                                var finalUrl = _ref97.finalUrl

                                if (result === 'Success') {
                                  var _finalUrl$match11

                                  var groupName = (_finalUrl$match11 = finalUrl.match(/steamcommunity.com\/groups\/([\w\d\-_]*)/)) === null || _finalUrl$match11 === void 0 ? void 0 : _finalUrl$match11[1]

                                  if (groupName) {
                                    _this38.currentTaskInfo.groups.push(groupName)

                                    _this38.taskInfo.groups.push(groupName)
                                  }
                                }
                              }))
                            }
                          } else if (icon.hasClass('fa-link')) {
                            _this38.currentTaskInfo.links.push(link)
                          } else if (icon.hasClass('fa-vk')) {
                            path = (_link$match6 = link.match(/https:\/\/vk.com\/([^/]+)/)) === null || _link$match6 === void 0 ? void 0 : _link$match6[1]

                            if (path) {
                              _this38.currentTaskInfo.vks.push(path)

                              _this38.taskInfo.vks.push(path)
                            }
                          } else {
                            fuc.echoLog({
                              type: 'custom',
                              text: '<li>'.concat(getI18n('unknownTaskType', ''.concat(icon, '(').concat(link, ')')), '<font></font></li>')
                            })
                          }
                        }
                      } catch (err) {
                        _iterator51.e(err)
                      } finally {
                        _iterator51.f()
                      }

                      Promise.all(pro).finally(function () {
                        _this38.currentTaskInfo = fuc.uniqueTaskInfo(_this38.currentTaskInfo)
                        _this38.taskInfo = fuc.uniqueTaskInfo(_this38.taskInfo)
                        GM_setValue('taskInfo[' + window.location.host + _this38.get_giveawayId() + ']', _this38.taskInfo)
                        status.success()
                        if (debug) console.log(_this38)

                        if (callback === 'do_task') {
                          if (_this38.currentTaskInfo.tasks.length === 0) {
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
                  } catch (e) {
                    throwError(e, 'takekey.get_tasks')
                  }

                case 2:
                case 'end':
                  return _context91.stop()
              }
            }
          }, _callee90)
        }))()
      },
      do_task: function do_task () {
        var _this39 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee91 () {
          var pro, links, _iterator52, _step53, link

          return regeneratorRuntime.wrap(function _callee91$ (_context92) {
            while (1) {
              switch (_context92.prev = _context92.next) {
                case 0:
                  _context92.prev = 0

                  pro = []
                  pro.push(_this39.toggleActions('fuck'))
                  links = fuc.unique(_this39.currentTaskInfo.links)

                  if (!_this39.conf.fuck.visitLink) {
                    _context92.next = 23
                    break
                  }

                  _iterator52 = _createForOfIteratorHelper(links)
                  _context92.prev = 6

                  _iterator52.s()

                case 8:
                  if ((_step53 = _iterator52.n()).done) {
                    _context92.next = 15
                    break
                  }

                  link = _step53.value
                  pro.push(fuc.visitLink(link, {
                    method: 'GET'
                  }))
                  _context92.next = 13
                  return fuc.delay(1000)

                case 13:
                  _context92.next = 8
                  break

                case 15:
                  _context92.next = 20
                  break

                case 17:
                  _context92.prev = 17
                  _context92.t0 = _context92.catch(6)

                  _iterator52.e(_context92.t0)

                case 20:
                  _context92.prev = 20

                  _iterator52.f()

                  return _context92.finish(20)

                case 23:
                  Promise.all(pro).finally(function () {
                    fuc.echoLog({
                      type: 'custom',
                      text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                    })
                    if (_this39.conf.fuck.verifyTask) _this39.verify()
                  })
                  _context92.next = 29
                  break

                case 26:
                  _context92.prev = 26
                  _context92.t1 = _context92.catch(0)
                  throwError(_context92.t1, 'takekey.do_task')

                case 29:
                case 'end':
                  return _context92.stop()
              }
            }
          }, _callee91, null, [[0, 26], [6, 17, 20, 23]])
        }))()
      },
      verify: function verify () {
        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee92 () {
          var logStatus, _yield$fuc$httpReques7, result, statusText, status, data, _data$response24, _data$response25, _data$response26

          return regeneratorRuntime.wrap(function _callee92$ (_context93) {
            while (1) {
              switch (_context93.prev = _context93.next) {
                case 0:
                  _context93.prev = 0
                  logStatus = fuc.echoLog({
                    type: 'custom',
                    text: '<li>'.concat(getI18n('verifyingTask'), '...<font></font></li>')
                  })
                  _context93.next = 4
                  return fuc.httpRequest({
                    url: window.location.href,
                    method: 'POST',
                    dataType: 'json'
                  })

                case 4:
                  _yield$fuc$httpReques7 = _context93.sent
                  result = _yield$fuc$httpReques7.result
                  statusText = _yield$fuc$httpReques7.statusText
                  status = _yield$fuc$httpReques7.status
                  data = _yield$fuc$httpReques7.data

                  if (result === 'Success') {
                    if (data.status === 200 && (data === null || data === void 0 ? void 0 : (_data$response24 = data.response) === null || _data$response24 === void 0 ? void 0 : _data$response24.status) === 'success') {
                      logStatus.success(data === null || data === void 0 ? void 0 : (_data$response25 = data.response) === null || _data$response25 === void 0 ? void 0 : _data$response25.msg, true)
                    } else {
                      logStatus.error('Error:' + ((data === null || data === void 0 ? void 0 : (_data$response26 = data.response) === null || _data$response26 === void 0 ? void 0 : _data$response26.msg) || data.statusText + '(' + data.status + ')'), true)
                    }
                  } else {
                    logStatus.error(''.concat(result, ':').concat(statusText, '(').concat(status, ')'))
                  }

                  logStatus.scrollIntoView()

                  _context93.next = 16
                  break

                case 13:
                  _context93.prev = 13
                  _context93.t0 = _context93.catch(0)
                  throwError(_context93.t0, 'takekey.verify')

                case 16:
                case 'end':
                  return _context93.stop()
              }
            }
          }, _callee92, null, [[0, 13]])
        }))()
      },
      toggleActions: function toggleActions (action) {
        var _this40 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee93 () {
          var fuck, taskInfo
          return regeneratorRuntime.wrap(function _callee93$ (_context94) {
            while (1) {
              switch (_context94.prev = _context94.next) {
                case 0:
                  _context94.prev = 0
                  fuck = action === 'fuck'
                  taskInfo = fuck ? _this40.currentTaskInfo : _this40.taskInfo
                  _context94.next = 5
                  return fuc.updateInfo(taskInfo)

                case 5:
                  _context94.next = 7
                  return fuc.assignment(taskInfo, _this40.conf[action], action, 'takekey')

                case 7:
                  _context94.next = 12
                  break

                case 9:
                  _context94.prev = 9
                  _context94.t0 = _context94.catch(0)
                  throwError(_context94.t0, 'takekey.toggleActions')

                case 12:
                case 'end':
                  return _context94.stop()
              }
            }
          }, _callee93, null, [[0, 9]])
        }))()
      },
      remove: function remove () {
        var _arguments14 = arguments
        var _this41 = this

        return _asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee94 () {
          var remove
          return regeneratorRuntime.wrap(function _callee94$ (_context95) {
            while (1) {
              switch (_context95.prev = _context95.next) {
                case 0:
                  remove = _arguments14.length > 0 && _arguments14[0] !== undefined ? _arguments14[0] : false
                  _context95.prev = 1

                  if (!remove) {
                    _context95.next = 8
                    break
                  }

                  _context95.next = 5
                  return _this41.toggleActions('remove')

                case 5:
                  fuc.echoLog({
                    type: 'custom',
                    text: '<li><font class="success">'.concat(getI18n('allTasksComplete'), '</font></li>')
                  })
                  _context95.next = 9
                  break

                case 8:
                  _this41.get_tasks('remove')

                case 9:
                  _context95.next = 14
                  break

                case 11:
                  _context95.prev = 11
                  _context95.t0 = _context95.catch(1)
                  throwError(_context95.t0, 'takekey.remove')

                case 14:
                case 'end':
                  return _context95.stop()
              }
            }
          }, _callee94, null, [[1, 11]])
        }))()
      },
      get_giveawayId: function get_giveawayId () {
        try {
          var id = window.location.href.match(/distribution\/([\d]+)/)
          return (id === null || id === void 0 ? void 0 : id[1]) || window.location.href
        } catch (e) {
          throwError(e, 'takekey.get_giveawayId')
        }
      },
      checkLogin: function checkLogin () {
        try {
          if ($('i.fa-sign-in').length > 0) window.open('/auth/steam', '_self')
        } catch (e) {
          throwError(e, 'takekey.checkLogin')
        }
      },
      checkLeft: function checkLeft () {
        try {
          var _$$text$match2

          var leftKey = (_$$text$match2 = $('span:contains(Осталось ключей),span:contains(Keys Left)').text().match(/[\d]+/)) === null || _$$text$match2 === void 0 ? void 0 : _$$text$match2[0]

          if (!(leftKey && parseInt(leftKey[0]) > 0)) {
            Swal.fire({
              icon: 'warning',
              title: getI18n('notice'),
              text: getI18n('noKeysLeft'),
              confirmButtonText: getI18n('confirm'),
              cancelButtonText: getI18n('cancel'),
              showCancelButton: true
            }).then(function (_ref98) {
              var value = _ref98.value

              if (value) {
                window.close()
              }
            })
          }
        } catch (e) {
          throwError(e, 'takekey.checkLeft')
        }
      },
      currentTaskInfo: {
        links: [],
        groups: [],

        vks: [],

        tasks: []
      },
      taskInfo: {
        groups: [],

        vks: []
      },
      setting: {},
      conf: (config === null || config === void 0 ? void 0 : (_config$takekey = config.takekey) === null || _config$takekey === void 0 ? void 0 : _config$takekey.enable) ? config.takekey : globalConf
    }
    var website = null
    var websites = [banana, freegamelottery, gamehag, giveawaysu, givekey, gleam, indiedb, keyhub, keylol, marvelousga, opiumpulses, prys, takekey]

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

      if (pageHost === 'auto-task.hclonely.com' || pageHost === 'auto-task-test.hclonely.com') {
        if (window.location.pathname.includes('setting')) {
          var _GM_getValue, _GM_getValue$global2, _GM_getValue$global2$

          unsafeWindow.GM_info = GM_info // eslint-disable-line camelcase

          unsafeWindow.GM_setValue = GM_setValue // eslint-disable-line camelcase

          unsafeWindow.language = language
          unsafeWindow.getId = getId
          typeof ((_GM_getValue = GM_getValue('conf')) === null || _GM_getValue === void 0 ? void 0 : (_GM_getValue$global2 = _GM_getValue.global) === null || _GM_getValue$global2 === void 0 ? void 0 : (_GM_getValue$global2$ = _GM_getValue$global2.fuck) === null || _GM_getValue$global2$ === void 0 ? void 0 : _GM_getValue$global2$.joinSteamGroup) !== 'boolean' ? loadSettings(defaultConf) : loadSettings(config)
        } else if (window.location.pathname.includes('announcement')) {
          loadAnnouncement()
        }
      } else if (pageHost === 'marvelousga.com' && !window.location.pathname.includes('giveaway')) {
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

        var _loop6 = function _loop6 () {
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
          _loop6()
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
        $('body').append('<div id="fuck-task-info" class="card">\n  <div class="card-body">\n    <h3 class="card-title">'.concat(getI18n('taskLog'), '</h3>\n    <h4 class="card-subtitle">\n      <a id="check-update" href="javascript:void(0)" terget="_self" class="card-link iconfont icon-update_1" title="').concat(getI18n('checkUpdate'), '"></a>\n      <a id="auto-task-setting" href="javascript:void(0)" data-href="https://auto-task-test.hclonely.com/setting.html" terget="_self" class="card-link iconfont icon-setting" title="').concat(getI18n('setting'), '"></a>\n      <a id="clean-cache" href="javascript:void(0)" terget="_self" class="card-link iconfont icon-clean" title="').concat(getI18n('cleanCache'), '"></a>\n      <a id="auto-task-feedback" href="javascript:void(0)" data-href="https://github.com/HCLonely/auto-task/issues/new/choose" terget="_blank" class="card-link iconfont icon-feedback" title="').concat(getI18n('feedback'), '"></a>\n    </h4>\n    <div class="card-textarea">\n    </div>\n  </div>\n</div>'))
        $('#clean-cache').click(function () {
          try {
            var status = fuc.echoLog({
              type: 'custom',
              text: '<li>'.concat(getI18n('cleaning'), '<font></font></li>')
            })
            var listValues = GM_listValues()

            var _iterator53 = _createForOfIteratorHelper(listValues)
            var _step54

            try {
              for (_iterator53.s(); !(_step54 = _iterator53.n()).done;) {
                var value = _step54.value
                if (!['conf', 'language', 'steamInfo', 'discordInfo', 'insInfo', 'twitchInfo', 'twitterInfo', 'redditInfo', 'youtubeInfo'].includes(value)) GM_deleteValue(value)
              }
            } catch (err) {
              _iterator53.e(err)
            } finally {
              _iterator53.f()
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
        $('#auto-task-setting,#auto-task-feedback').click(function () {
          try {
            window.open($(this).attr('data-href'), '_blank')
          } catch (e) {
            throwError(e, '$(\'#auto-task-setting,#auto-task-feedback\').click')
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
        GM_addValueChangeListener('steamInfo', function (name, oldValue, newValue, remote) {
          window.steamInfo = Object.assign(steamInfo, newValue)
        })
        GM_addValueChangeListener('discordInfo', function (name, oldValue, newValue, remote) {
          window.discordInfo = Object.assign(discordInfo, newValue)
        })
        GM_addValueChangeListener('twitchInfo', function (name, oldValue, newValue, remote) {
          window.twitchInfo = Object.assign(twitchInfo, newValue)
        })
        GM_addValueChangeListener('twitterInfo', function (name, oldValue, newValue, remote) {
          window.twitterInfo = Object.assign(twitterInfo, newValue)
        })
        GM_addValueChangeListener('redditInfo', function (name, oldValue, newValue, remote) {
          window.redditInfo = Object.assign(redditInfo, newValue)
        })
        GM_addValueChangeListener('youtubeInfo', function (name, oldValue, newValue, remote) {
          window.youtubeInfo = Object.assign(youtubeInfo, newValue)
        })
      }

      GM_registerMenuCommand(getI18n('readme'), function () {
        try {
          window.open('https://auto-task-doc.js.org', '_blank')
        } catch (e) {
          throwError(e, 'GM_registerMenuCommand(\'readme\')')
        }
      })
      GM_registerMenuCommand(getI18n('updateSteamInfo'), /* #__PURE__ */_asyncToGenerator(/* #__PURE__ */regeneratorRuntime.mark(function _callee97 () {
        return regeneratorRuntime.wrap(function _callee97$ (_context98) {
          while (1) {
            switch (_context98.prev = _context98.next) {
              case 0:
                _context98.prev = 0
                _context98.next = 3
                return fuc.updateSteamInfo('all', true)

              case 3:
                if (!_context98.sent) {
                  _context98.next = 7
                  break
                }

                fuc.echoLog({
                  type: 'custom',
                  text: '<li><font class="success">'.concat(getI18n('updateSteamInfoComplete'), '</font></li>')
                })
                _context98.next = 8
                break

              case 7:
                fuc.echoLog({
                  type: 'custom',
                  text: '<li><font class="error">'.concat(getI18n('updateSteamInfoFailed'), '</font></li>')
                })

              case 8:
                _context98.next = 13
                break

              case 10:
                _context98.prev = 10
                _context98.t0 = _context98.catch(0)
                throwError(_context98.t0, 'GM_registerMenuCommand(\'updateSteamInfo\')')

              case 13:
              case 'end':
                return _context98.stop()
            }
          }
        }, _callee97, null, [[0, 10]])
      })))
      GM_registerMenuCommand('Language', function () {
        try {
          var inputOptions = {
            auto: getI18n('auto')
          }

          var _iterator54 = _createForOfIteratorHelper(i18n)
          var _step55

          try {
            for (_iterator54.s(); !(_step55 = _iterator54.n()).done;) {
              var lang = _step55.value
              var ISO = lang.ISO
              var languageName = lang.languageName
              if (ISO && languageName) inputOptions[ISO] = languageName
            }
          } catch (err) {
            _iterator54.e(err)
          } finally {
            _iterator54.f()
          }

          Swal.fire({
            title: getI18n('language') + ' : ' + language,
            input: 'select',
            inputOptions: inputOptions,
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
    } else if (pageHost === 'discord.com') {
      fuc.getDiscordAuth()
    } else if (pageHost === 'www.twitch.tv') {
      if (pageHref.includes('#updateTwitchInfo')) {
        fuc.updateTwitchInfo(true)
      } else if (!pageHref.includes('/login')) {
        fuc.updateTwitchInfo(false)
      }
    } else if (pageHost === 'www.youtube.com') {
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
