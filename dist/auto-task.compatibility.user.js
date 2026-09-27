// ==UserScript==
// @name               auto-task.compatibility
// @namespace          auto-task.compatibility
// @version            5.2.2
// @description        自动完成 Freeanywhere，Giveawaysu，GiveeClub，Givekey，Gleam，Indiedb，keyhub，OpiumPulses，Opquests，SweepWidget 等网站的任务。
// @description:en     Automatically complete the tasks of FreeAnyWhere, GiveawaySu, GiveeClub, Givekey, Gleam, Indiedb, keyhub, OpiumPulses, Opquests, SweepWidget websites.
// @author             HCLonely
// @license            MIT
// @run-at             document-start
// @homepage           https://auto-task-doc.js.org/
// @supportURL         https://github.com/HCLonely/auto-task/issues
// @updateURL          https://github.com/HCLonely/auto-task/raw/main/dist/auto-task.compatibility.user.js
// @installURL         https://github.com/HCLonely/auto-task/raw/main/dist/auto-task.compatibility.user.js
// @downloadURL        https://github.com/HCLonely/auto-task/raw/main/dist/auto-task.compatibility.user.js
// @icon               https://auto-task.hclonely.com/favicon.ico
// @tag                games

// @include            *://freeanywhere.net/*
// @include            *://giveaway.su/giveaway/view/*
// @include            *://givee.club/*/event/*
// @include            *://givekey.ru/giveaway/*
// @include            *://www.indiedb.com/giveaways*
// @include            *://key-hub.eu/giveaway/*
// @include            *://keylol.com/*
// @include            *://www.opiumpulses.com/giveaways
// @include            *://prys.revadike.com/giveaway/?id=*
// @include            *://opquests.com/quests/*
// @include            *://gleam.io/*
// @include            *://sweepwidget.com/view/*
// @include            *://giveawayhopper.com/c/*
// @include            *://freeru.cc/en/games/giveaways/games/*

// @include            *://www.twitch.tv/*
// @include            *://twitch.tv/*
// @include            *://www.youtube.com/*
// @include            *://m.youtube.com/*
// @include            *://*.reddit.com/*
// @include            *://twitter.com/settings/account?k*
// @include            *://x.com/settings/account*
// @include            *://steamcommunity.com/*
// @include            *://store.steampowered.com/*

// @include            *://give.gamesforfarm.local/*
// @include            *://gamesforfarm-testing.ru/*
// @include            *://mee6.xyz/*
// @include            *://gamesforfarm.com/*

// @include            https://auto-task.hclonely.com/setting.html
// @include            https://auto-task.hclonely.com/history.html
// @include            https://auto-task-doc.js.org/setting.html
// @include            https://auto-task-doc.js.org/history.html

// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_listValues
// @grant              GM_deleteValue
// @grant              GM_addStyle
// @grant              GM_xmlhttpRequest
// @grant              GM_registerMenuCommand
// @grant              GM_info
// @grant              GM_openInTab
// @grant              GM_setClipboard
// @grant              GM_getResourceText
// @grant              GM_cookie
// @grant              GM_addValueChangeListener
// @grant              GM_removeValueChangeListener
// @grant              unsafeWindow
// @grant              window.close
// @grant              window.localStorage
// @grant              window.sessionStorage
// @grant              window.focus

// @connect            login.vk.com
// @connect            web.api.vk.com
// @connect            web.api.vk.ru
// @connect            vk.ru
// @connect            auto-task.hclonely.com
// @connect            auto-task-doc.js.org
// @connect            cdn.jsdelivr.net
// @connect            store.steampowered.com
// @connect            steamcommunity.com
// @connect            login.steampowered.com
// @connect            twitter.com
// @connect            x.com
// @connect            abs.twimg.com
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
// @connect            www.reddit.com
// @connect            oauth.reddit.com
// @connect            raw.githubusercontent.com
// @connect            t.me
// @connect            bit.ly
// @connect            giveaway.su
// @connect            google.com
// @connect            www.vloot.io
// @connect            givee.club
// @connect            gleam.io
// @connect            www.indiedb.com
// @connect            key-hub.eu
// @connect            opquests.com
// @connect            itch.io
// @connect            auto-task.hclonely.com
// @connect            giveawayhopper.com
// @connect            freeanywhere.net
// @connect            *

// @require            https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require            https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js
// @require            https://cdn.jsdelivr.net/npm/js-sha1@0.6.0/src/sha1.min.js
// @require            https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.js
// @resource           style https://cdn.jsdelivr.net/npm/sweetalert2@11.3.5/dist/sweetalert2.min.css
// @require            https://cdn.jsdelivr.net/npm/keyboardjs@2.6.4/dist/keyboard.min.js
// @require            https://cdn.jsdelivr.net/npm/dayjs@1.10.7/dayjs.min.js
// @require            https://cdn.jsdelivr.net/gh/tinygo-org/tinygo@3e60eeb368f25f237a512e7553fd6d70f36dc74c/targets/wasm_exec.min.js
// @require            https://cdn.jsdelivr.net/npm/node-inspect-extracted@3.1.0/dist/inspect.min.js
// @require            https://cdn.jsdelivr.net/npm/browser-tool@1.3.2/dist/browser.min.js
// @require            https://github.com/HCLonely/auto-task/raw/main/dist/auto-task.modules.js
// @require            https://github.com/HCLonely/auto-task/raw/main/dist/auto-task.website.js

// @noframes
// ==/UserScript==

console.log('%c%s', 'color:blue', 'Auto-Task[Load]: 脚本开始加载');

/*
 * @Author       : HCLonely
 * @Date         : 2025-06-15 14:59:17
 * @LastEditTime : 2025-08-18 19:05:01
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/checkDependence.js
 * @Description  :
 */
const neededDependencies = ['jQuery', 'Cookies', 'sha1', 'Swal', 'keyboardJS', 'dayjs', 'Go', 'util', 'browser'];

const missingDependencies = neededDependencies.filter(dependency => typeof window[dependency] === 'undefined');
if (typeof AutoTaskModules === 'undefined') missingDependencies.push('AutoTaskModules');
if (typeof AutoTaskWebsite === 'undefined') missingDependencies.push('AutoTaskWebsite');

if (missingDependencies.length > 0) {
  console.log('%c%s', 'color:red', `[Auto-Task] 脚本加载失败，缺少的依赖：${missingDependencies.join(', ')}`);
  if (confirm(`[Auto-Task] 脚本依赖加载失败，请刷新重试或安装全依赖版本，是否前往安装全依赖版本？\n缺少的依赖：${missingDependencies.join(', ')}`)) {
    GM_openInTab('https://github.com/HCLonely/auto-task/raw/main/dist/auto-task.compatibility.all.user.js', { active: true });
  }
}


function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}

function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : 'undefined' != typeof Symbol && r[Symbol.iterator] || r['@@iterator'];
  if (null != t) {
    var e, n, i, u, a = [], f = !0, o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) {
          return;
        }
        f = !1;
      } else {
        for (;!(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0) {}
      }
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) {
          return;
        }
      } finally {
        if (o) {
          throw n;
        }
      }
    }
    return a;
  }
}

function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter((function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    }))), t.push.apply(t, o);
  }
  return t;
}

function _objectSpread(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach((function(r) {
      _defineProperty(e, r, t[r]);
    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach((function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    }));
  }
  return e;
}

function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}

function _toPropertyKey(t) {
  var i = _toPrimitive(t, 'string');
  return 'symbol' == typeof i ? i : i + '';
}

function _toPrimitive(t, r) {
  if ('object' != typeof t || !t) {
    return t;
  }
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || 'default');
    if ('object' != typeof i) {
      return i;
    }
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return ('string' === r ? String : Number)(t);
}

function _toArray(r) {
  return _arrayWithHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableRest();
}

function _nonIterableRest() {
  throw new TypeError('Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.');
}

function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ('string' == typeof r) {
      return _arrayLikeToArray(r, a);
    }
    var t = {}.toString.call(r).slice(8, -1);
    return 'Object' === t && r.constructor && (t = r.constructor.name), 'Map' === t || 'Set' === t ? Array.from(r) : 'Arguments' === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) {
    n[e] = r[e];
  }
  return n;
}

function _iterableToArray(r) {
  if ('undefined' != typeof Symbol && null != r[Symbol.iterator] || null != r['@@iterator']) {
    return Array.from(r);
  }
}

function _arrayWithHoles(r) {
  if (Array.isArray(r)) {
    return r;
  }
}

(function(globalOptions, Swal, steam, twitch, moduleBridge, index, websiteOptions, __, globalOptionsEdit, keyboardJS, browser, debug, echoLog, SteamASF, _globalOptions$global, _globalOptions$global2) {
  'use strict';
  const tokenKeyPattern = /token|auth|session|jwt|key|secret|api[-_]?key|bearer|authorization|access[-_]?token|refresh[-_]?token|sid/i;
  const tokenStringPatterns = [ /([A-Za-z0-9-_]{10,})\.([A-Za-z0-9-_]{10,})\.([A-Za-z0-9-_]{10,})/g, /(Bearer|Basic)\s+([A-Za-z0-9\-._~+/]+=*)/gi, /\b([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\b/gi, /\b(eyJ[A-Za-z0-9\-_]+)\b/g ];
  const maskToken = str => {
    if (typeof str !== 'string' || str.length < 8) {
      return str;
    }
    return str.replace(/^([A-Za-z0-9\-_+/=]{4})[A-Za-z0-9\-_+/=]+([A-Za-z0-9\-_+/=]{4})$/, '$1***$2');
  };
  const maskObject = obj => {
    if (Array.isArray(obj)) {
      return obj.map(maskObject);
    } else if (obj && typeof obj === 'object') {
      const newObj = {};
      for (const key in obj) {
        if (tokenKeyPattern.test(key) && typeof obj[key] === 'string') {
          newObj[key] = maskToken(obj[key]);
        } else {
          newObj[key] = maskObject(obj[key]);
        }
      }
      return newObj;
    }
    if (typeof obj === 'string' && obj.length > 8) {
      return maskString(obj);
    }
    return obj;
  };
  const maskString = str => {
    let masked = str;
    for (const pattern of tokenStringPatterns) {
      masked = masked.replace(pattern, (function(match) {
        for (var _len = arguments.length, groups = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          groups[_key - 1] = arguments[_key];
        }
        if (groups.length >= 3 && match.includes('.')) {
          return groups.map((seg => seg.length > 8 ? ''.concat(seg.slice(0, 4), '***').concat(seg.slice(-4)) : seg)).join('.');
        }
        if (match.length > 8) {
          return ''.concat(match.slice(0, 4), '***').concat(match.slice(-4));
        }
        return match;
      }));
    }
    return masked;
  };
  const maskArgs = args => args.map((arg => {
    if (typeof arg === 'string') {
      return maskString(arg);
    } else if (typeof arg === 'object' && arg !== null) {
      return maskObject(arg);
    }
    return arg;
  }));
  const consoleLogHook = () => {
    const originalLog = console.log;
    window.__allLogs = window.__allLogs || [];
    console.log = function() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      const maskedArgs = maskArgs(args);
      window.__allLogs.push(maskedArgs);
      originalLog.apply(console, maskedArgs);
    };
  };
  var style = ':root{--at-primary: #2563eb;--at-primary-dark: #1d4ed8;--at-primary-light: #3b82f6;--at-primary-50: rgba(37, 99, 235, 0.05);--at-primary-100: rgba(37, 99, 235, 0.1);--at-primary-200: rgba(37, 99, 235, 0.2);--at-primary-400: rgba(37, 99, 235, 0.4);--at-success: #10b981;--at-success-bg: rgba(16, 185, 129, 0.08);--at-success-border: rgba(16, 185, 129, 0.25);--at-error: #ef4444;--at-warning: #f59e0b;--at-info: #3b82f6;--at-surface: rgba(255, 255, 255, 0.95);--at-border: rgba(226, 232, 240, 0.8);--at-border-light: rgba(226, 232, 240, 0.4);--at-text: #1e293b;--at-text-muted: #64748b;--at-text-light: #94a3b8;--at-radius-sm: 8px;--at-radius: 12px;--at-radius-lg: 16px;--at-shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);--at-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 4px 10px -5px rgba(0, 0, 0, 0.04);--at-shadow-lg: 0 20px 40px -10px rgba(0, 0, 0, 0.12), 0 8px 16px -5px rgba(0, 0, 0, 0.06);--at-shadow-btn: 0 4px 14px rgba(37, 99, 235, 0.3);--at-shadow-btn-hover: 0 8px 24px rgba(37, 99, 235, 0.4);--at-transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);--at-transition-fast: 0.2s cubic-bezier(0.4, 0, 0.2, 1);--at-blur: blur(20px) saturate(180%)}@keyframes at-fade-in-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@keyframes at-fade-in{from{opacity:0}to{opacity:1}}@keyframes at-shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}@keyframes at-pulse-glow{0%,100%{box-shadow:0 4px 14px rgba(37,99,235,.3)}50%{box-shadow:0 4px 24px rgba(37,99,235,.55)}}.colorful-button,body.auto-task-options .auto-task-form table button,#auto-task-buttons a.auto-task-website-btn{position:relative !important;display:inline-flex !important;align-items:center !important;justify-content:center !important;padding:7px 14px !important;color:#fff !important;text-decoration:none !important;text-transform:capitalize !important;font-weight:600 !important;font-size:13px !important;letter-spacing:.3px !important;line-height:1.5 !important;background:linear-gradient(135deg, var(--at-primary-dark) 0%, var(--at-primary) 50%, var(--at-primary-light) 100%) !important;background-size:200% 200% !important;border:none !important;border-radius:var(--at-radius) !important;box-shadow:var(--at-shadow-btn) !important;-webkit-backdrop-filter:var(--at-blur) !important;backdrop-filter:var(--at-blur) !important;overflow:hidden !important;cursor:pointer !important;outline:none !important;transition:transform .25s cubic-bezier(0.4, 0, 0.2, 1),box-shadow .25s cubic-bezier(0.4, 0, 0.2, 1),background-position .4s ease !important;-webkit-user-select:none !important;user-select:none !important;-webkit-tap-highlight-color:rgba(0,0,0,0) !important}.colorful-button::after,body.auto-task-options .auto-task-form table button::after,#auto-task-buttons a.auto-task-website-btn::after{content:"" !important;position:absolute !important;top:0 !important;left:0 !important;width:100% !important;height:100% !important;background:linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.12) 45%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.12) 55%, transparent 60%) !important;transform:translateX(-100%);transition:transform .6s ease !important}.colorful-button:hover,body.auto-task-options .auto-task-form table button:hover,#auto-task-buttons a.auto-task-website-btn:hover{background-position:100% 100% !important;box-shadow:var(--at-shadow-btn-hover) !important;transform:translateY(-2px) !important;color:#fff !important;text-decoration:none !important}.colorful-button:hover::after,body.auto-task-options .auto-task-form table button:hover::after,#auto-task-buttons a.auto-task-website-btn:hover::after{transform:translateX(100%)}.colorful-button:active,body.auto-task-options .auto-task-form table button:active,#auto-task-buttons a.auto-task-website-btn:active{transform:translateY(0px) scale(0.98) !important;box-shadow:var(--at-shadow-btn) !important;color:#fff !important;text-decoration:none !important;transition:transform .1s ease,box-shadow .1s ease !important}.colorful-button:focus-visible,body.auto-task-options .auto-task-form table button:focus-visible,#auto-task-buttons a.auto-task-website-btn:focus-visible{color:#fff !important;text-decoration:none !important;outline:2px solid var(--at-primary-400) !important;outline-offset:2px !important}#auto-task-info{position:fixed !important;bottom:20px !important;right:20px !important;width:60% !important;max-width:480px !important;max-height:50% !important;overflow-y:auto !important;color:var(--at-text) !important;background:linear-gradient(145deg, var(--at-surface) 0%, rgba(248, 250, 252, 0.96) 100%) !important;padding:12px 16px !important;z-index:999999999 !important;border:1px solid var(--at-border) !important;border-radius:var(--at-radius-lg) !important;font-size:13px !important;box-shadow:var(--at-shadow-lg) !important;-webkit-backdrop-filter:var(--at-blur) !important;backdrop-filter:var(--at-blur) !important;opacity:1 !important;animation:at-fade-in-up .35s cubic-bezier(0.4, 0, 0.2, 1) both !important;transition:transform var(--at-transition),box-shadow var(--at-transition) !important}#auto-task-info:hover{box-shadow:0 25px 50px -12px rgba(0,0,0,.12),0 12px 24px -6px rgba(0,0,0,.06)}#auto-task-info::-webkit-scrollbar{width:5px}#auto-task-info::-webkit-scrollbar-track{background:rgba(0,0,0,0);margin:8px 0}#auto-task-info::-webkit-scrollbar-thumb{background:linear-gradient(180deg, var(--at-primary-dark), var(--at-primary-light));border-radius:10px}#auto-task-info::-webkit-scrollbar-thumb:hover{background:linear-gradient(180deg, var(--at-primary), var(--at-primary-light))}#auto-task-info li{list-style:none;align-items:flex-start !important;text-align:left;padding:3px 8px;border-bottom:1px solid var(--at-border-light);border-radius:6px;transition:background var(--at-transition-fast),padding var(--at-transition-fast)}#auto-task-info li:hover{background:var(--at-primary-50);padding-left:12px;padding-right:12px}#auto-task-info li:last-child{border-bottom:none}#auto-task-info li .before-icon{display:inline-block !important;width:14px !important;height:14px !important;flex-shrink:0 !important;margin-top:1px;margin-right:8px;background-size:14px !important;background-repeat:no-repeat !important;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,.1)}#auto-task-info li font.before{color:var(--at-primary) !important;margin-right:6px !important;font-weight:600 !important;font-size:12px !important;flex-shrink:0}#auto-task-info li a.high-light{color:var(--at-primary) !important;font-weight:600 !important;text-decoration:none !important;border-bottom:1.5px solid rgba(0,0,0,0);transition:border-color var(--at-transition-fast)}#auto-task-info li a.high-light:hover{border-bottom-color:var(--at-primary)}#auto-task-info .log-status-icon{display:inline-block;margin-left:.4em;vertical-align:middle;line-height:1}#auto-task-info .log-status-icon[data-status=loading]{width:.85em;height:.85em;border:2px solid var(--at-border);border-top-color:var(--at-primary);border-radius:50%;animation:at-log-spin .8s linear infinite}@media(prefers-reduced-motion: reduce){#auto-task-info .log-status-icon[data-status=loading]{animation:none}}@keyframes at-log-spin{to{transform:rotate(360deg)}}#auto-task-info font{display:contents}#auto-task-info .success{color:var(--at-success);font-weight:600}#auto-task-info .error{color:var(--at-error);font-weight:600}#auto-task-info .warning{color:var(--at-warning);font-weight:600}#auto-task-info .info{color:var(--at-info);font-weight:600}#auto-task-info .update-text{color:var(--at-success);background:var(--at-success-bg);border:1px solid var(--at-success-border);margin:12px 0;border-radius:var(--at-radius);padding:12px 16px;font-weight:500;box-shadow:0 2px 8px rgba(16,185,129,.08);transition:box-shadow var(--at-transition-fast),transform var(--at-transition-fast)}#auto-task-info .update-text:hover{box-shadow:0 4px 12px rgba(16,185,129,.12);transform:translateY(-1px)}#auto-task-buttons{position:fixed !important;top:30px !important;right:15px !important;width:138px !important;min-width:138px !important;max-width:138px !important;opacity:1 !important;background:linear-gradient(145deg, var(--at-surface) 0%, rgba(248, 250, 252, 0.96) 100%) !important;-webkit-backdrop-filter:var(--at-blur) !important;backdrop-filter:var(--at-blur) !important;border:1px solid var(--at-border) !important;border-radius:var(--at-radius) !important;padding:10px 8px !important;box-shadow:var(--at-shadow) !important;z-index:999999998 !important;animation:at-fade-in-up .35s cubic-bezier(0.4, 0, 0.2, 1) both !important;transition:box-shadow var(--at-transition),transform var(--at-transition) !important}#auto-task-buttons:hover{box-shadow:var(--at-shadow-lg)}#auto-task-buttons p{margin:5px 0 !important;line-height:normal !important;height:auto !important;text-align:center !important;padding:0 !important;font-size:13px !important;color:var(--at-text-muted) !important}#auto-task-buttons p:first-child{margin-top:0 !important}#auto-task-buttons p:last-child{margin-bottom:0 !important}#auto-task-buttons a.auto-task-website-btn{width:118px !important;min-height:30px !important;font-size:13px !important;display:flex !important;margin:0 auto !important;padding:6px 12px !important}.show-button-div{position:fixed !important;top:30px !important;right:15px !important;width:40px !important;cursor:pointer !important;padding:4px !important;z-index:999999998 !important;opacity:1 !important;animation:at-fade-in .3s ease both !important}.show-button-div .show-button-link{display:flex !important;align-items:center !important;justify-content:center !important;width:38px !important;height:38px !important;background:linear-gradient(135deg, var(--at-primary-dark) 0%, var(--at-primary) 50%, var(--at-primary-light) 100%) !important;background-size:200% 200% !important;border-radius:50% !important;color:#fff !important;text-decoration:none !important;box-shadow:0 6px 16px rgba(37,99,235,.35) !important;border:none !important;outline:none !important;transition:transform .3s cubic-bezier(0.4, 0, 0.2, 1),box-shadow .3s cubic-bezier(0.4, 0, 0.2, 1),background-position .4s ease !important}.show-button-div .show-button-link:hover{background-position:100% 100% !important;box-shadow:0 10px 28px rgba(37,99,235,.5) !important;transform:translateY(-3px) scale(1.05) !important;animation:at-pulse-glow 2s infinite !important;color:#fff !important;text-decoration:none !important}.show-button-div .show-button-link:active{transform:translateY(-1px) scale(1.02) !important;color:#fff !important;text-decoration:none !important}.show-button-div .show-button-link:focus-visible{outline:2px solid var(--at-primary-400) !important;outline-offset:2px !important;color:#fff !important;text-decoration:none !important}.show-button-div .show-button-link svg{transition:transform .25s ease !important}.show-button-div .show-button-link:hover svg{transform:translateX(2px) !important}.show-button-div a.auto-task-website-btn{right:-15px !important}.show-button-div a.auto-task-website-btn::after{content:"✓" !important;position:absolute !important;top:50% !important;transform:translateY(-50%) !important;font-size:20px !important;font-weight:bold !important;color:#fff !important}.auto-task-keylol{display:inline-block;text-transform:capitalize;margin-left:10px;text-decoration:none !important;border:1.5px solid var(--at-border);border-radius:6px;padding:1px 6px;font-size:13px;transition:background var(--at-transition-fast),color var(--at-transition-fast),border-color var(--at-transition-fast)}.auto-task-keylol[selected=selected]{background:linear-gradient(135deg, var(--at-primary-dark), var(--at-primary)) !important;color:#fff !important;border-color:rgba(0,0,0,0) !important;box-shadow:0 2px 8px var(--at-primary-200)}.auto-task-form table{width:100%;font-size:13px;color:var(--at-text);border-collapse:separate;border-spacing:0;border:1px solid var(--at-border-light);border-radius:var(--at-radius);overflow:hidden;box-shadow:var(--at-shadow-sm)}.auto-task-form table thead td{padding:10px 12px;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:.5px;color:var(--at-text-muted);background:linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);border-bottom:2px solid var(--at-border);border-right:1px solid var(--at-border-light)}.auto-task-form table thead td:last-child{border-right:none}.auto-task-form table tbody tr{background:#fff;transition:background var(--at-transition-fast),box-shadow var(--at-transition-fast)}.auto-task-form table tbody tr:nth-child(even){background:#f8fafc}.auto-task-form table tbody tr:hover{background:#eff6ff !important;box-shadow:inset 0 0 0 1px rgba(37,99,235,.1)}.auto-task-form table tbody tr th{padding:10px 12px;font-weight:600;font-size:12px;text-transform:capitalize;color:var(--at-text);background:#f1f5f9;border-right:1px solid var(--at-border-light);border-bottom:1px solid var(--at-border-light)}.auto-task-form table tbody tr td{padding:9px 12px;border-right:1px solid var(--at-border-light);border-bottom:1px solid var(--at-border-light)}.auto-task-form table tbody tr td:last-child{border-right:none}.auto-task-form table tbody tr:last-child th,.auto-task-form table tbody tr:last-child td{border-bottom:none}body.auto-task-options{padding-top:20px;text-align:center;background:linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);min-height:100vh}body.auto-task-options .auto-task-form{width:80%;max-width:1000px;margin:0 auto;padding-bottom:30px}body.auto-task-options .auto-task-form table input.editOption{width:80%}body.auto-task-options .auto-task-form table #getTwitterUserId,body.auto-task-options .auto-task-form table #getYoutubeChannelId{margin-top:6px}body.auto-task-options .auto-task-form table button{position:relative !important;padding:6px 12px !important;font-size:12px !important;min-height:28px !important;min-width:80px !important;vertical-align:middle !important;white-space:nowrap !important}body.auto-task-options .auto-task-form table input[type=text]{outline:none;border:1.5px solid #e2e8f0;border-radius:8px;padding:8px 12px;font-size:14px;color:var(--at-text);background:#fff;transition:border-color var(--at-transition-fast),box-shadow var(--at-transition-fast)}body.auto-task-options .auto-task-form table input[type=text]::placeholder{color:var(--at-text-light)}body.auto-task-options .auto-task-form table input[type=text]:focus{border-color:var(--at-primary-light);box-shadow:0 0 0 3px var(--at-primary-100),0 1px 3px rgba(0,0,0,.04)}body.auto-task-options .auto-task-form table label{position:relative;display:inline-block;width:44px;height:24px;cursor:pointer;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:rgba(0,0,0,0);vertical-align:middle}body.auto-task-options .auto-task-form table label input{position:absolute;opacity:0;width:0;height:0}body.auto-task-options .auto-task-form table label span{position:absolute;top:0;left:0;width:100%;height:100%;background:#cbd5e1;border-radius:24px;transition:background var(--at-transition-fast),box-shadow var(--at-transition-fast)}body.auto-task-options .auto-task-form table label span i{position:absolute;top:2px;left:2px;width:20px;height:20px;background:#fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.08);transition:transform var(--at-transition-fast)}body.auto-task-options .auto-task-form table label input:checked~span{background:var(--at-success);box-shadow:0 0 0 2px rgba(16,185,129,.15)}body.auto-task-options .auto-task-form table label input:checked~span i{transform:translateX(20px)}body.auto-task-options .auto-task-form table label input:focus-visible~span{box-shadow:0 0 0 3px var(--at-primary-100)}body.auto-task-history{font-size:15px;font-weight:400;line-height:1.6;color:var(--at-text);background:linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);min-height:100vh}body.auto-task-history .container{padding:20px 0}body.auto-task-history .container a{color:var(--at-primary);text-decoration:none;transition:color var(--at-transition-fast)}body.auto-task-history .container a:hover{color:var(--at-primary-dark)}body.auto-task-history .container .card{width:85%;max-width:800px;margin:24px auto;padding:20px 24px;background:linear-gradient(145deg, var(--at-surface) 0%, rgba(248, 250, 252, 0.97) 100%);border:1px solid var(--at-border);border-radius:var(--at-radius-lg);-webkit-backdrop-filter:var(--at-blur);backdrop-filter:var(--at-blur);box-shadow:var(--at-shadow);position:relative;word-wrap:break-word;animation:at-fade-in-up .5s cubic-bezier(0.4, 0, 0.2, 1);transition:box-shadow var(--at-transition),transform var(--at-transition)}body.auto-task-history .container .card:hover{box-shadow:var(--at-shadow-lg);transform:translateY(-2px)}body.auto-task-history .container .card .title{text-align:center;font-size:26px;font-weight:700;margin:6px 0 12px;color:var(--at-text)}body.auto-task-history .container .card .title a{color:var(--at-primary);padding:2px 8px;border-radius:8px;transition:background var(--at-transition-fast),color var(--at-transition-fast)}body.auto-task-history .container .card .title a:hover{text-decoration:none;background:rgba(147,225,255,.25);color:var(--at-primary-dark)}body.auto-task-history .container .card ul{margin-bottom:20px;padding-left:0;list-style:none}body.auto-task-history .container .card ul li{position:relative;margin-bottom:6px;padding:4px 0 4px 20px;line-height:1.6}body.auto-task-history .container .card ul li::before{content:"•";position:absolute;left:4px;color:var(--at-primary-light);font-weight:bold}body.auto-task-history .container .card ul li a:hover{text-decoration:underline}body.auto-task-history .container .card .delete-task{position:absolute;right:12px;top:12px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:20px;cursor:pointer;border-radius:var(--at-radius-sm);color:var(--at-text-muted);transition:background var(--at-transition-fast),color var(--at-transition-fast)}body.auto-task-history .container .card .delete-task:hover{background:rgba(239,68,68,.1);color:var(--at-error)}body.auto-task-history .container .card .time{position:absolute;right:16px;bottom:14px;color:#e83e8c;font-family:"SF Mono","Fira Code","Cascadia Code",Menlo,Monaco,Consolas,monospace;font-size:13px;font-weight:500;letter-spacing:-0.2px}.swal2-modal{width:70% !important;max-width:1000px !important;border-radius:var(--at-radius-lg) !important;overflow:hidden}.swal2-modal #swal2-title{text-align:center !important;font-weight:600 !important}.swal2-file:focus,.swal2-input:focus,.swal2-textarea:focus{border-color:var(--at-primary-light) !important;box-shadow:0 0 0 3px var(--at-primary-100) !important}.swal2-checkbox-custom{display:flex;align-items:center;justify-content:center;background:#fff;color:inherit;margin:1em auto;gap:6px}.swal2-checkbox-custom input{flex-shrink:0;margin:0 .4em;accent-color:var(--at-primary)}.auto-task-capitalize{text-transform:capitalize !important}.giveaway-actions #getKey{display:none !important}.auto-task-giveaway-status{color:#fff;border-radius:20px;padding:2px 8px;margin-left:6px;font-size:12px;font-weight:600;letter-spacing:.2px}.auto-task-giveaway-status.active{background:linear-gradient(135deg, var(--at-success), #059669);box-shadow:0 2px 6px rgba(16,185,129,.3)}.auto-task-giveaway-status.not-active{background:linear-gradient(135deg, var(--at-error), #dc2626);box-shadow:0 2px 6px rgba(239,68,68,.3)}';
  const getRunLogs = () => {
    debug.debug('开始获取运行日志');
    const logElements = $('#auto-task-info>li');
    const logs = logElements.length > 0 ? $.makeArray(logElements).map((element => element.innerText)).join('\n') : '';
    debug.debug('运行日志获取完成', {
      logsLength: logs.length
    });
    return logs;
  };
  const getEnvironmentInfo = async () => {
    debug.debug('开始获取环境信息');
    const envInfo = {
      website: window.location.href,
      browser: JSON.stringify(await browser.getInfo(), null, 2),
      manager: ''.concat(GM_info.scriptHandler, ' ').concat(GM_info.version),
      userScript: GM_info.script.version,
      logs: '',
      runLogs: getRunLogs()
    };
    debug.debug('环境信息获取完成', envInfo);
    return envInfo;
  };
  const buildGithubIssueParams = async (name, errorStack, envInfo) => {
    debug.debug('开始构建GitHub Issue参数', {
      name: name,
      errorStackLength: errorStack.length
    });
    const params = {
      title: '[BUG] 脚本报错: '.concat(name),
      labels: 'bug',
      template: 'bug_report.yml',
      website: envInfo.website,
      browser: envInfo.browser,
      manager: envInfo.manager,
      'user-script': envInfo.userScript,
      logs: errorStack || '',
      'run-logs': ''
    };
    const runLogs = window.__allLogs.join('\n');
    await GM_setClipboard(runLogs);
    debug.debug('GitHub Issue参数构建完成', params);
    return params;
  };
  const generateGithubLink = async (name, errorStack, envInfo) => {
    debug.debug('开始生成GitHub Issue链接');
    const params = new URLSearchParams(await buildGithubIssueParams(name, errorStack, envInfo));
    const link = 'https://github.com/HCLonely/auto-task/issues/new?'.concat(params.toString());
    debug.debug('GitHub Issue链接生成完成', {
      link: link
    });
    return link;
  };
  const logError = (name, errorStack) => {
    debug.debug('记录错误日志', {
      name: name
    });
    console.log('%c%s', 'color:white;background:red', 'Auto-Task[Error]: '.concat(name, '\n').concat(errorStack));
  };
  const handleErrorReport = async (platform, name, errorStack, envInfo) => {
    debug.debug('开始处理错误报告', {
      platform: platform,
      name: name
    });
    {
      const githubLink = await generateGithubLink(name, errorStack, envInfo);
      debug.debug('打开GitHub Issue链接', {
        githubLink: githubLink
      });
      GM_openInTab(githubLink, {
        active: true
      });
    }
  };
  async function throwError(error, name) {
    debug.debug('开始处理错误', {
      name: name,
      error: error
    });
    if (window.TRACE) {
      debug.debug('启用跟踪模式');
      console.trace('%cAuto-Task[Trace]:', 'color:blue');
    }
    const errorStack = error.stack || '';
    logError(name, errorStack);
    debug.debug('获取环境信息');
    const envInfo = await getEnvironmentInfo();
    envInfo.logs = errorStack;
    debug.debug('显示错误报告对话框');
    const _await$Swal$fire = await Swal.fire({
      title: __.default('errorReport'),
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: __.default('toGithub'),
      cancelButtonText: __.default('close')
    }), isConfirmed = _await$Swal$fire.isConfirmed;
    if (isConfirmed) {
      debug.debug('用户确认提交错误报告');
      await handleErrorReport('github', name, errorStack, envInfo);
      Swal.fire({
        title: __.default('logCopied'),
        icon: 'success',
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: __.default('close')
      });
    } else {
      debug.debug('用户取消提交错误报告');
    }
  }
  const parseHeaders = headerString => {
    debug.debug('开始解析HTTP头', {
      headerString: headerString
    });
    const headers = {};
    if (!headerString) {
      debug.debug('HTTP头为空，返回空对象');
      return headers;
    }
    headerString.split('\n').forEach((header => {
      const _header$trim$split = header.trim().split(':'), _header$trim$split2 = _toArray(_header$trim$split), name = _header$trim$split2[0], values = _header$trim$split2.slice(1);
      const value = values.join(':').trim();
      if (!name || !value) {
        return;
      }
      if (headers[name]) {
        headers[name] = Array.isArray(headers[name]) ? [ ...headers[name], value ] : [ headers[name], value ];
      } else {
        headers[name] = value;
      }
    }));
    if (headers['set-cookie'] && !Array.isArray(headers['set-cookie'])) {
      headers['set-cookie'] = [ headers['set-cookie'] ];
    }
    debug.debug('HTTP头解析完成', {
      headers: headers
    });
    return headers;
  };
  const processResponse = (data, options) => {
    debug.debug('开始处理响应数据', {
      responseType: options.responseType
    });
    const headers = parseHeaders(data.responseHeaders);
    data.responseHeadersText = data.responseHeaders;
    data.responseHeaders = headers;
    data.finalUrl = headers.location || data.finalUrl;
    debug.debug('响应头处理完成', {
      finalUrl: data.finalUrl
    });
    if (options.responseType === 'json' && data !== null && data !== void 0 && data.response && typeof data.response !== 'object') {
      debug.debug('尝试解析JSON响应');
      try {
        data.response = JSON.parse(data.responseText);
        debug.debug('JSON解析成功');
      } catch (_unused) {
        debug.debug('JSON解析失败，保持原始响应');
      }
    }
  };
  const httpRequest = async function(options) {
    let times = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    debug.debug('开始HTTP请求', {
      url: options.url,
      method: options.method,
      retryTimes: times
    });
    if (window.TRACE) {
      console.trace('%cAuto-Task[Trace]:', 'color:blue');
    }
    try {
      const result = await new Promise((resolve => {
        const requestObj = _objectSpread(_objectSpread({
          fetch: true,
          timeout: 3e4,
          ontimeout: data => {
            debug.debug('请求超时', {
              url: options.url
            });
            resolve({
              result: 'Error',
              statusText: 'Timeout',
              status: 601,
              data: data,
              options: options
            });
          },
          onabort: () => {
            debug.debug('请求被中止', {
              url: options.url
            });
            resolve({
              result: 'Error',
              statusText: 'Aborted',
              status: 602,
              data: undefined,
              options: options
            });
          },
          onerror: data => {
            debug.debug('请求发生错误', {
              url: options.url,
              error: data
            });
            resolve({
              result: 'Error',
              statusText: 'Error',
              status: 603,
              data: data,
              options: options
            });
          },
          onload: data => {
            debug.debug('请求加载完成', {
              url: options.url,
              status: data.status
            });
            processResponse(data, options);
            resolve({
              result: 'Success',
              statusText: 'Load',
              status: 600,
              data: data,
              options: options
            });
          }
        }, options), {}, {
          responseType: options.dataType || options.responseType
        });
        debug.debug('发送请求', {
          requestObj: requestObj
        });
        GM_xmlhttpRequest(requestObj);
      }));
      if (window.DEBUG) {
        console.log('%cAuto-Task[httpRequest]:', 'color:blue', result);
      }
      if (result.status !== 600 && times < 2) {
        debug.debug('请求失败，准备重试', {
          status: result.status,
          retryTimes: times + 1
        });
        return await httpRequest(options, times + 1);
      }
      debug.debug('请求完成', {
        status: result.status,
        result: result.result
      });
      return result;
    } catch (error) {
      debug.debug('请求发生JavaScript错误', {
        error: error
      });
      console.log('%cAuto-Task[httpRequest]:', 'color:red', JSON.stringify({
        errorMsg: error,
        options: options
      }));
      throwError(error, 'httpRequest');
      return {
        result: 'JsError',
        statusText: 'Error',
        status: 604,
        error: error,
        options: options
      };
    }
  };
  const UPDATE_LINKS = {
    github: 'https://github.com/HCLonely/auto-task/raw/main/',
    jsdelivr: 'https://cdn.jsdelivr.net/gh/HCLonely/auto-task@main/',
    standby: 'https://auto-task.hclonely.com/'
  };
  const checkUpdate = async (updateLink, auto) => {
    try {
      var _data$response;
      debug.debug('开始检查更新', {
        updateLink: updateLink,
        auto: auto
      });
      const checkUrl = ''.concat(updateLink, 'package.json?time=').concat(Date.now());
      debug.debug('构建检查URL', {
        checkUrl: checkUrl
      });
      const _await$httpRequest = await httpRequest({
        url: checkUrl,
        responseType: 'json',
        method: 'GET',
        timeout: 3e4
      }), result = _await$httpRequest.result, statusText = _await$httpRequest.statusText, status = _await$httpRequest.status, data = _await$httpRequest.data;
      if (result === 'Success' && data !== null && data !== void 0 && (_data$response = data.response) !== null && _data$response !== void 0 && _data$response.version) {
        debug.debug('成功获取更新信息', {
          version: data.response.version
        });
        return data.response;
      }
      if (!auto) {
        var _data$response2;
        const errorMessage = data !== null && data !== void 0 && (_data$response2 = data.response) !== null && _data$response2 !== void 0 && _data$response2.version ? ''.concat(__.default('checkUpdateFailed'), '[').concat(data === null || data === void 0 ? void 0 : data.statusText, '(').concat(data === null || data === void 0 ? void 0 : data.status, ')]') : ''.concat(__.default('checkUpdateFailed'), '[').concat(result, ':').concat(statusText, '(').concat(status, ')]');
        debug.debug('检查更新失败', {
          errorMessage: errorMessage
        });
        echoLog.default({}).error(errorMessage);
      } else {
        debug.debug('自动检查更新失败', {
          result: result,
          statusText: statusText,
          status: status
        });
      }
      return false;
    } catch (error) {
      debug.debug('检查更新发生错误', {
        error: error
      });
      throwError(error, 'checkUpdate');
      return false;
    }
  };
  const hasNewVersion = (currentVersion, remoteVersion) => {
    try {
      debug.debug('开始比较版本号', {
        currentVersion: currentVersion,
        remoteVersion: remoteVersion
      });
      const _currentVersion$split = currentVersion.split('-'), _currentVersion$split2 = _slicedToArray(_currentVersion$split, 1), currentRealVersion = _currentVersion$split2[0];
      const _remoteVersion$split = remoteVersion.split('-'), _remoteVersion$split2 = _slicedToArray(_remoteVersion$split, 2), remoteRealVersion = _remoteVersion$split2[0], isPreview = _remoteVersion$split2[1];
      if (isPreview && !globalOptions.globalOptions.other.receivePreview) {
        debug.debug('不接收预览版本', {
          isPreview: isPreview
        });
        return false;
      }
      const currentVersionParts = currentRealVersion.split('.').map(Number);
      const remoteVersionParts = remoteRealVersion.split('.').map(Number);
      debug.debug('版本号解析', {
        currentVersionParts: currentVersionParts,
        remoteVersionParts: remoteVersionParts
      });
      for (let i = 0; i < 3; i++) {
        if (remoteVersionParts[i] > currentVersionParts[i]) {
          debug.debug('发现新版本', {
            position: i,
            current: currentVersion,
            remote: remoteVersion
          });
          return true;
        }
        if (remoteVersionParts[i] < currentVersionParts[i]) {
          debug.debug('远程版本较旧', {
            position: i,
            current: currentVersion,
            remote: remoteVersion
          });
          return false;
        }
      }
      debug.debug('版本号相同');
      return false;
    } catch (error) {
      debug.debug('比较版本号时发生错误', {
        error: error
      });
      throwError(error, 'compareVersion');
      return false;
    }
  };
  const getUpdateLink = updateSource => {
    debug.debug('获取更新链接', {
      updateSource: updateSource
    });
    const source = updateSource.toLowerCase();
    const link = UPDATE_LINKS[source] || UPDATE_LINKS.github;
    debug.debug('选择的更新链接', {
      source: source,
      link: link
    });
    return link;
  };
  const showUpdateInfo = (packageData, currentVersion, updateLink) => {
    debug.debug('准备显示更新信息', {
      currentVersion: currentVersion,
      newVersion: packageData.version
    });
    if (hasNewVersion(currentVersion, packageData.version)) {
      var _packageData$change, _packageData$change2;
      const scriptUrl = ''.concat(updateLink, 'dist/').concat(GM_info.script.name, '.user.js');
      debug.debug('发现新版本，显示更新通知', {
        scriptUrl: scriptUrl
      });
      echoLog.default({
        html: '<li><font>'.concat(__.default('newVersionNotice', packageData.version, scriptUrl), '</font></li>')
      });
      const changeList = ((_packageData$change = packageData.change) === null || _packageData$change === void 0 ? void 0 : _packageData$change.map((change => '<li>'.concat(change, '</li>'))).join('')) || '';
      debug.debug('显示更新日志', {
        changeListLength: (_packageData$change2 = packageData.change) === null || _packageData$change2 === void 0 ? void 0 : _packageData$change2.length
      });
      echoLog.default({
        html: '<li>'.concat(__.default('updateText', packageData.version), '</li><ol class="update-text">').concat(changeList, '<li>').concat(__.default('updateHistory'), '</li></ol>')
      });
    } else {
      debug.debug('当前已是最新版本');
    }
  };
  const updateChecker = async () => {
    try {
      debug.debug('开始检查更新流程');
      const currentVersion = GM_info.script.version;
      const updateSource = globalOptions.globalOptions.other.autoUpdateSource;
      debug.debug('当前配置', {
        currentVersion: currentVersion,
        updateSource: updateSource
      });
      let packageData = false;
      if ([ 'github', 'jsdelivr', 'standby' ].includes(updateSource.toLowerCase())) {
        debug.debug('使用指定的更新源', {
          updateSource: updateSource
        });
        const updateLink = getUpdateLink(updateSource);
        packageData = await checkUpdate(updateLink, false);
      } else {
        debug.debug('按优先级尝试不同的更新源');
        for (const source of [ 'github', 'jsdelivr', 'standby' ]) {
          debug.debug('尝试更新源', {
            source: source
          });
          packageData = await checkUpdate(UPDATE_LINKS[source], true);
          if (packageData) {
            debug.debug('成功获取更新信息', {
              source: source
            });
            break;
          }
        }
      }
      if (!packageData) {
        debug.debug('所有更新源检查失败');
        echoLog.default({}).error(__.default('checkUpdateFailed'));
        return;
      }
      showUpdateInfo(packageData, currentVersion, getUpdateLink(updateSource));
    } catch (error) {
      debug.debug('更新检查过程发生错误', {
        error: error
      });
      throwError(error, 'updateChecker');
    }
  };
  try {
    consoleLogHook();
  } catch (error) {
    console.error('Auto-Task[Warning]: consoleLogHook 初始化失败', error);
  }
  window.STYLE = GM_addStyle(style + GM_getResourceText('style'));
  window.DEBUG = !!((_globalOptions$global = globalOptions.globalOptions.other) !== null && _globalOptions$global !== void 0 && _globalOptions$global.debug);
  window.TRACE = !!((_globalOptions$global2 = globalOptions.globalOptions.other) !== null && _globalOptions$global2 !== void 0 && _globalOptions$global2.debug) && typeof console.trace === 'function';
  const initializeUI = website => {
    debug.debug('初始化UI元素', {
      website: website.name
    });
    const $body = $('body');
    $body.append('\n    <div id="auto-task-info"\n        style="display:'.concat(globalOptions.globalOptions.other.defaultShowLog ? 'block' : 'none', ';\n                ').concat(globalOptions.globalOptions.position.logSideX, ':').concat(globalOptions.globalOptions.position.logDistance.split(',')[0], 'px;\n                ').concat(globalOptions.globalOptions.position.logSideY, ':').concat(globalOptions.globalOptions.position.logDistance.split(',')[1], 'px;\n                opacity: 0;\n                animation: fadeInUp 0.6s ease forwards;">\n    </div>\n    <div id="auto-task-buttons"\n        style="display:').concat(globalOptions.globalOptions.other.defaultShowButton ? 'block' : 'none', ';\n                ').concat(globalOptions.globalOptions.position.buttonSideX, ':').concat(globalOptions.globalOptions.position.buttonDistance.split(',')[0], 'px;\n                ').concat(globalOptions.globalOptions.position.buttonSideY, ':').concat(globalOptions.globalOptions.position.buttonDistance.split(',')[1], 'px;\n                opacity: 0;\n                animation: fadeInUp 0.6s ease 0.2s forwards;">\n    </div>\n    <div class="show-button-div"\n        style="display:').concat(globalOptions.globalOptions.other.defaultShowButton ? 'none' : 'block', ';\n                ').concat(globalOptions.globalOptions.position.showButtonSideX, ':').concat(globalOptions.globalOptions.position.showButtonDistance.split(',')[0], 'px;\n                ').concat(globalOptions.globalOptions.position.showButtonSideY, ':').concat(globalOptions.globalOptions.position.showButtonDistance.split(',')[1], 'px;\n                opacity: 0;\n                animation: fadeInScale 0.5s ease 0.4s forwards;">\n      <a class="auto-task-website-btn show-button-link"\n        href="javascript:void(0);"\n        target="_self"\n        title="').concat(__.default('showButton'), '">\n      </a>\n    </div>\n  '));
    const $autoTaskInfo = $('#auto-task-info');
    const $autoTaskButtons = $('#auto-task-buttons');
    const $showButtonDiv = $('div.show-button-div');
    $showButtonDiv.on('click', (() => {
      $autoTaskButtons.show();
      $showButtonDiv.hide();
    }));
    if (website.buttons && $autoTaskButtons.children().length === 0) {
      $autoTaskButtons.addClass(''.concat(website.name, '-buttons'));
      for (const button of website.buttons) {
        if (website[button]) {
          const btnElement = $('<p><a class="auto-task-website-btn '.concat(website.name, '-button" href="javascript:void(0);" target="_self">').concat(__.default(button), '</a></p>'));
          btnElement.find('a.auto-task-website-btn').on('click', (() => {
            website[button]();
          }));
          $autoTaskButtons.append(btnElement);
        }
      }
    }
    const hideButtonElement = $('<p><a class="auto-task-website-btn '.concat(website.name, '-button" href="javascript:void(0);" target="_self">').concat(__.default('hideButton'), '</a></p>'));
    hideButtonElement.find('a.auto-task-website-btn').on('click', (() => {
      $autoTaskButtons.hide();
      $showButtonDiv.show();
    }));
    const toggleLogElement = $('<p><a id="toggle-log" class="auto-task-website-btn '.concat(website.name, '-button" href="javascript:void(0);" target="_self" data-status="').concat(globalOptions.globalOptions.other.defaultShowLog ? 'show' : 'hide', '">').concat(globalOptions.globalOptions.other.defaultShowLog ? __.default('hideLog') : __.default('showLog'), '</a></p>'));
    const toggleLog = () => {
      const $toggleLog = $('#toggle-log');
      const status = $toggleLog.attr('data-status');
      if (status === 'show') {
        $autoTaskInfo.hide();
        $toggleLog.attr('data-status', 'hide').text(__.default('showLog'));
      } else {
        $autoTaskInfo.show();
        $toggleLog.attr('data-status', 'show').text(__.default('hideLog'));
      }
    };
    toggleLogElement.find('a.auto-task-website-btn').on('click', toggleLog);
    $autoTaskButtons.append(hideButtonElement).append(toggleLogElement);
    if (website.options) {
      GM_registerMenuCommand(__.default('changeWebsiteOptions'), (() => {
        websiteOptions.default(website.name, website.options);
      }));
    }
  };
  const initializeHotkeys = website => {
    debug.debug('初始化热键', {
      website: website.name
    });
    keyboardJS.bind(globalOptions.globalOptions.hotKey.doTaskKey, (() => {
      if (website.doTask) {
        website.doTask();
      }
    }));
    keyboardJS.bind(globalOptions.globalOptions.hotKey.undoTaskKey, (() => {
      if (website.undoTask) {
        website.undoTask();
      }
    }));
    keyboardJS.bind(globalOptions.globalOptions.hotKey.toggleLogKey, (() => {
      const $toggleLog = $('#toggle-log');
      const status = $toggleLog.attr('data-status');
      const $autoTaskInfo = $('#auto-task-info');
      if (status === 'show') {
        $autoTaskInfo.hide();
        $toggleLog.attr('data-status', 'hide').text(__.default('showLog'));
      } else {
        $autoTaskInfo.show();
        $toggleLog.attr('data-status', 'show').text(__.default('hideLog'));
      }
    }));
  };
  const checkSteamASFStatus = async () => {
    debug.debug('检查Steam ASF状态');
    if (!globalOptions.globalOptions.ASF.AsfEnabled || !globalOptions.globalOptions.ASF.AsfIpcUrl || !globalOptions.globalOptions.ASF.AsfIpcPassword) {
      return;
    }
    const stopPlayTime = GM_getValue('stopPlayTime', 0) || 0;
    if (stopPlayTime === 0 || stopPlayTime >= Date.now()) {
      return;
    }
    const stopPlayTimeMinutes = Math.floor((Date.now() - stopPlayTime) / 6e4);
    const _await$Swal$fire2 = await Swal.fire({
      title: __.default('stopPlayTimeTitle'),
      text: __.default('stopPlayTimeText', stopPlayTimeMinutes.toString()),
      icon: 'warning',
      confirmButtonText: __.default('confirm'),
      cancelButtonText: __.default('cancel'),
      showCancelButton: true
    }), value = _await$Swal$fire2.value;
    if (!value) {
      return;
    }
    let steamASF = new SteamASF.default(globalOptions.globalOptions.ASF);
    try {
      const isInitialized = await steamASF.init();
      if (!isInitialized) {
        return;
      }
      const isGamesStopped = await steamASF.stopPlayGames();
      if (!isGamesStopped) {
        return;
      }
      const taskLink = GM_getValue('taskLink', []) || [];
      for (const link of taskLink) {
        GM_openInTab(link, {
          active: true
        });
      }
      GM_setValue('stopPlayTime', 0);
      GM_setValue('playedGames', []);
      GM_setValue('taskLink', []);
    } catch (error) {
      console.error('SteamASF operation failed:', error);
    } finally {
      var _steamASF;
      (_steamASF = steamASF) === null || _steamASF === void 0 || _steamASF.dispose();
      steamASF = null;
    }
  };
  const checkVersionAndNotice = () => {
    debug.debug('检查版本和通知');
    const _GM_info = GM_info, scriptHandler = _GM_info.scriptHandler;
    if (scriptHandler === 'Tampermonkey') {
      var _GM_info$version;
      const _ref = ((_GM_info$version = GM_info.version) === null || _GM_info$version === void 0 ? void 0 : _GM_info$version.split('.')) || [], _ref2 = _slicedToArray(_ref, 2), v1 = _ref2[0], v2 = _ref2[1];
      if (!(parseInt(v1, 10) >= 5 && parseInt(v2, 10) >= 2)) {
        echoLog.default({}).error(__.default('versionNotMatched'));
      }
    } else if (scriptHandler !== 'Violentmonkey') {
      var _GM_info$version2;
      const _ref3 = ((_GM_info$version2 = GM_info.version) === null || _GM_info$version2 === void 0 ? void 0 : _GM_info$version2.split('.')) || [], _ref4 = _slicedToArray(_ref3, 2), v1 = _ref4[0], v2 = _ref4[1];
      if (!(parseInt(v1, 10) >= 2 && parseInt(v2, 10) >= 36)) {
        echoLog.default({}).error(__.default('versionNotMatched'));
      }
    } else {
      debug.debug('未知脚本管理器', {
        scriptHandler: scriptHandler
      });
      echoLog.default({}).warning(__.default('unknownScriptHandler'));
      return;
    }
    if (!GM_getValue('notice')) {
      var _echoLog$default$font;
      Swal.fire({
        title: __.default('swalNotice'),
        icon: 'warning'
      }).then((() => {
        GM_openInTab(__.default('noticeLink'), {
          active: true
        });
        GM_setValue('notice', (new Date).getTime());
      }));
      (_echoLog$default$font = echoLog.default({
        html: '<li><font class="warning">'.concat(__.default('echoNotice', __.default('noticeLink')), '</font></li>')
      }).font) === null || _echoLog$default$font === void 0 || _echoLog$default$font.find('a').on('click', (() => {
        GM_setValue('notice', (new Date).getTime());
      }));
    }
  };
  const loadScript = async () => {
    debug.debug('主程序入口 loadScript 开始');
    let website;
    for (const Website of index.Websites) {
      if (Website.test()) {
        debug.debug('识别到支持的网站', {
          website: Website.name
        });
        website = new Website;
        break;
      }
    }
    if (!website) {
      debug.debug('未识别到支持的网站，脚本停止加载');
      console.log('%c%s', 'color:#ff0000', 'Auto-Task[Warning]: 脚本停止加载，当前网站不支持！');
      return;
    }
    if (website.before) {
      debug.debug('执行网站 before 钩子');
      await website.before();
    }
    initializeUI(website);
    initializeHotkeys(website);
    if (website.after) {
      debug.debug('执行网站 after 钩子');
      await website.after();
    }
    if (website.name !== 'Setting') {
      debug.debug('注册全局菜单命令');
      GM_registerMenuCommand(__.default('changeGlobalOptions'), (() => {
        globalOptionsEdit.changeGlobalOptions('swal');
      }));
      GM_registerMenuCommand(__.default('settingPage'), (() => {
        GM_openInTab('https://auto-task.hclonely.com/setting.html', {
          active: true
        });
      }));
    }
    debug.debug('脚本加载完成');
    console.log('%c%s', 'color:#1bbe1a', 'Auto-Task[Load]: 脚本加载完成');
    if (window.DEBUG) {
      echoLog.default({}).warning(__.default('debugModeNotice'));
    }
    await checkSteamASFStatus();
    checkVersionAndNotice();
    updateChecker();
  };
  const bootstrap = async () => {
    try {
      if (await steam.handleSteamAuthPage({
        namespace: moduleBridge.moduleNamespace('steam'),
        gm: moduleBridge.projectGM('steam')
      })) {
        return;
      }
      if (await twitch.handleTwitchAuthPage({
        namespace: moduleBridge.moduleNamespace('twitch'),
        gm: moduleBridge.projectGM('twitch')
      })) {
        return;
      }
      if (window.location.hostname === 'key-hub.eu') {
        unsafeWindow.keyhubtracker = 1;
        unsafeWindow.gaData = {};
      }
      await loadScript();
    } catch (error) {
      debug.debug('主程序入口发生异常', {
        error: error
      });
    }
  };
  if (window.location.hostname === 'opquests.com') {
    void bootstrap();
  } else {
    $(bootstrap);
  }
})(AutoTaskWebsite.globalOptions, Swal, AutoTaskModules.steam, AutoTaskModules.twitch, AutoTaskWebsite.moduleBridge, AutoTaskWebsite, AutoTaskWebsite.options, AutoTaskWebsite.i18n, AutoTaskWebsite.globalOptionsEdit, keyboardJS, browser, AutoTaskWebsite.debug, AutoTaskWebsite.echoLog, AutoTaskWebsite.SteamASF);
