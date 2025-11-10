// ==UserScript==
// @name               auto-task.compatibility
// @namespace          auto-task.compatibility
// @version            5.1.0
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

// @include            *://discord.com/*
// @include            *://www.twitch.tv/*
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

if (missingDependencies.length > 0) {
  console.log('%c%s', 'color:red', `[Auto-Task] 脚本加载失败，缺少的依赖：${missingDependencies.join(', ')}`);
  if (confirm(`[Auto-Task] 脚本依赖加载失败，请刷新重试或安装全依赖版本，是否前往安装全依赖版本？\n缺少的依赖：${missingDependencies.join(', ')}`)) {
    GM_openInTab('https://github.com/HCLonely/auto-task/raw/main/dist/auto-task.compatibility.all.user.js', { active: true });
  }
}


(function(Swal, Cookies, browser, util, dayjs, keyboardJS) {
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
          return groups.map((seg => seg.length > 8 ? `${seg.slice(0, 4)}***${seg.slice(-4)}` : seg)).join('.');
        }
        if (match.length > 8) {
          return `${match.slice(0, 4)}***${match.slice(-4)}`;
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
  const defaultGlobalOptions = {
    doTask: {
      discord: {
        servers: true
      },
      twitch: {
        channels: true
      },
      twitter: {
        users: true,
        retweets: true
      },
      vk: {
        names: true
      },
      youtube: {
        channels: true,
        likes: true
      },
      reddit: {
        reddits: true
      },
      steam: {
        groups: true,
        officialGroups: true,
        wishlists: true,
        follows: true,
        forums: true,
        workshops: true,
        curators: true,
        workshopVotes: true,
        announcements: true,
        licenses: true,
        playtests: true,
        playTime: true
      }
    },
    undoTask: {
      discord: {
        servers: true
      },
      twitch: {
        channels: true
      },
      twitter: {
        users: true,
        retweets: true
      },
      vk: {
        names: true
      },
      youtube: {
        channels: true,
        likes: true
      },
      reddit: {
        reddits: true
      },
      steam: {
        groups: true,
        officialGroups: true,
        wishlists: true,
        follows: true,
        forums: true,
        workshops: true,
        curators: true,
        playTime: true
      }
    },
    ASF: {
      AsfEnabled: false,
      AsfIpcUrl: '',
      AsfIpcPassword: '',
      AsfBotname: 'asf',
      steamWeb: false,
      preferASF: false,
      steamWebApiKey: ''
    },
    position: {
      buttonSideX: 'right',
      buttonSideY: 'top',
      buttonDistance: '15,30',
      showButtonSideX: 'right',
      showButtonSideY: 'top',
      showButtonDistance: '15,30',
      logSideX: 'right',
      logSideY: 'bottom',
      logDistance: '10,10'
    },
    hotKey: {
      doTaskKey: 'alt + d',
      undoTaskKey: 'alt + u',
      toggleLogKey: 'alt + l'
    },
    other: {
      twitterVerifyId: '783214',
      youtubeVerifyChannel: 'UCrXUsMBcfTVqwAS7DKg9C0Q',
      autoUpdateSource: 'jsdelivr',
      language: 'zh',
      checkLogin: true,
      checkLeftKey: true,
      defaultShowButton: true,
      defaultShowLog: true,
      debug: false,
      receivePreview: true
    }
  };
  const userDefinedGlobalOptions = GM_getValue('globalOptions') || {};
  const deepMerge = (target, source) => {
    try {
      const result = {
        ...target
      };
      for (const [key, value] of Object.entries(source)) {
        const targetValue = target[key];
        if (isObject(value) && isObject(targetValue)) {
          result[key] = deepMerge(targetValue, value);
        } else if (value !== undefined) {
          if (typeof value === typeof targetValue) {
            result[key] = value;
          } else {
            console.log('%c%s', 'color:yellow;background:black', `Auto-Task[Warning]: Type mismatch for key "${key}". Expected ${typeof targetValue}, got ${typeof value}. Using default value.`);
          }
        }
      }
      return result;
    } catch (error) {
      console.log('%c%s', 'color:white;background:red', `Auto-Task[Error]: deepMerge\n${error.stack}`);
      return target;
    }
  };
  const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const globalOptions = deepMerge(defaultGlobalOptions, userDefinedGlobalOptions);
  var style = '.colorful-button,#auto-task-buttons a.auto-task-website-btn,.show-button-div a.auto-task-website-btn,body.auto-task-options .auto-task-form table button{position:relative !important;padding:14px 28px !important;text-align:center !important;color:#fff !important;text-decoration:none !important;background:#2196f3 !important;border-radius:30px !important;text-transform:capitalize !important;font-weight:600 !important;letter-spacing:.5px !important;border:none !important;transition:all .2s ease !important;display:inline-block !important;line-height:1.5 !important;margin:8px !important;margin-bottom:12px !important;box-sizing:border-box !important;min-height:50px !important;min-width:140px !important;outline:none !important;vertical-align:middle !important;white-space:nowrap !important;font-size:18px !important}.colorful-button:hover,#auto-task-buttons a.auto-task-website-btn:hover,.show-button-div a.auto-task-website-btn:hover,body.auto-task-options .auto-task-form table button:hover{background:#1976d2 !important;box-shadow:0 4px 8px rgba(0,0,0,.1) !important;cursor:pointer !important;color:#fff !important;text-decoration:none !important}.colorful-button:active,#auto-task-buttons a.auto-task-website-btn:active,.show-button-div a.auto-task-website-btn:active,body.auto-task-options .auto-task-form table button:active{transform:translateY(1px) !important;color:#fff !important;text-decoration:none !important}.colorful-button:focus,#auto-task-buttons a.auto-task-website-btn:focus,.show-button-div a.auto-task-website-btn:focus,body.auto-task-options .auto-task-form table button:focus{color:#fff !important;text-decoration:none !important;outline:none !important}#auto-task-info{position:fixed;bottom:10px;right:10px;width:60%;max-width:500px;max-height:60%;overflow-y:auto;color:#000;background-color:#fff;padding-left:5px;z-index:999999999 !important;border:solid 2px #add8e6;border-radius:10px;font-size:14px !important}#auto-task-info li{text-align:left;display:block !important;align-items:baseline !important}#auto-task-info li .before-icon{display:inline-block !important;width:14px !important;height:14px !important;position:relative !important;top:2px !important;margin-right:5px !important;background-size:14px !important;background-repeat:no-repeat !important;flex-shrink:0 !important}#auto-task-info li font.before{color:#57bae8;margin-right:5px}#auto-task-info li a.high-light{color:#00aeff;font-weight:bold}#auto-task-info .success{color:green}#auto-task-info .error{color:red}#auto-task-info .warning{color:blue}#auto-task-info .info{color:#ff0}#auto-task-info .update-text{color:green;border:solid 2px #8dcb69;margin:5px 10px 5px 20px;border-radius:10px;padding:5px 20px}.auto-task-keylol{display:inline-block;text-transform:capitalize;margin-left:10px;text-decoration:none !important;border:solid 1px;border-radius:5px;padding:0 2px}.auto-task-keylol[selected=selected]{background-color:blue !important;color:#fff !important}.auto-task-form table{font-family:verdana,arial,sans-serif;font-size:11px;color:#333;border-width:1px;border-color:#999;border-collapse:collapse;width:100%}.auto-task-form table thead td{border-width:1px;padding:8px;border-style:solid;border-color:#a9c6c9;font-weight:bold;background-color:#fff}.auto-task-form table tbody tr{background-color:#d4e3e5}.auto-task-form table tbody tr:hover{background-color:#ff6 !important}.auto-task-form table tbody tr th{background-color:#c3dde0;border-width:1px;padding:8px;border-style:solid;border-color:#a9c6c9;text-transform:capitalize}.auto-task-form table tbody tr td{border-width:1px;padding:8px;border-style:solid;border-color:#a9c6c9}.swal2-modal{width:70% !important;max-width:1000px !important}.swal2-modal #swal2-title{text-align:center !important}body.auto-task-options{padding-top:10px;text-align:center}body.auto-task-options .auto-task-form{width:80%;max-width:1000px;margin:0 auto;padding-bottom:20px}body.auto-task-options .auto-task-form table input.editOption{width:80%}body.auto-task-options .auto-task-form table #getTwitterUserId,body.auto-task-options .auto-task-form table #getYoutubeChannelId{margin-top:5px}body.auto-task-options .auto-task-form table button{z-index:1;position:relative !important;padding:5px 20px !important;text-align:center !important;color:#fff !important;text-decoration:none !important;background:#2196f3 !important;border-radius:30px !important;text-transform:capitalize !important;font-weight:600 !important;letter-spacing:.5px !important;border:none !important;transition:all .2s ease !important;display:inline-block !important;line-height:1 !important;margin:8px !important;box-sizing:border-box !important;min-height:30px !important;min-width:140px !important;outline:none !important;vertical-align:middle !important;white-space:nowrap !important;font-size:15px !important}body.auto-task-options .auto-task-form table input[type=text]{outline-style:none;border:1px solid #ccc;border-radius:3px;padding:5px 10px;font-size:14px}body.auto-task-options .auto-task-form table input[type=text]:focus{border-color:#66afe9;outline:0;box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)}body.auto-task-options .auto-task-form table label{position:relative;width:160px;height:80px;cursor:pointer;transform:scale(0.25);margin:-25% 0;top:-30px;display:inline-block}body.auto-task-options .auto-task-form table label input{position:relative;z-index:1;appearance:none}body.auto-task-options .auto-task-form table label input:checked~span{background:#05be05;box-shadow:0 15px 25px rgba(5,190,5,.4)}body.auto-task-options .auto-task-form table label input:checked~span i{left:84px}body.auto-task-options .auto-task-form table label input:checked~span i::before{background:#05be05;box-shadow:35px 0 0 #05be05}body.auto-task-options .auto-task-form table label input:checked~span i::after{bottom:12px;height:15px;border-bottom-left-radius:15px;border-bottom-right-radius:15px;background:#05be05}body.auto-task-options .auto-task-form table label span{position:absolute;top:0;left:0;width:100%;height:100%;background:#fe0000;border-radius:80px;transition:.5s;box-shadow:0 15px 25px rgba(254,0,0,.4)}body.auto-task-options .auto-task-form table label span i{position:absolute;top:4px;left:4px;width:72px;height:72px;background:#fff;border-radius:50%}body.auto-task-options .auto-task-form table label span i::before{content:"";position:absolute;top:22px;left:12px;width:12px;height:12px;border-radius:50%;background:#fe0000;box-shadow:35px 0 0 #fe0000;transition:.5s}body.auto-task-options .auto-task-form table label span i::after{content:"";position:absolute;bottom:15px;left:calc(50% - 15px);width:30px;height:6px;border-radius:6px;background:#fe0000;transition:.5s}body.auto-task-history{font-size:15px;font-weight:400;line-height:1.5}body.auto-task-history .container a{color:#007bff;text-decoration:none;background-color:rgba(0,0,0,0)}body.auto-task-history .container .card{width:80%;max-width:800px;border-radius:10px;background:rgba(118,118,118,.1019607843);border-top:1px solid hsla(0,0%,100%,.5019607843);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);box-shadow:0 15px 25px rgba(0,0,0,.1019607843);margin:20px auto;position:relative;display:flex;flex-direction:column;word-wrap:break-word;-webkit-background-clip:border-box;background-clip:border-box;border:1px solid rgba(0,0,0,.125);border-radius:.25rem}body.auto-task-history .container .card .title{text-align:center;font-size:30px;font-weight:bold;margin:5px 0}body.auto-task-history .container .card .title a:hover{text-decoration:none;background:#93e1ff;border-radius:10px;padding:3px}body.auto-task-history .container .card ul{margin-bottom:25px}body.auto-task-history .container .card ul li{margin-bottom:5px;line-height:20px}body.auto-task-history .container .card ul a:hover{text-decoration:underline}body.auto-task-history .container .card .delete-task{right:10px;width:38px;height:35px;position:absolute;font-size:24px;cursor:pointer;border-radius:10px}body.auto-task-history .container .card .delete-task:hover{background:#fff}body.auto-task-history .container .card .time{right:5px;position:absolute;bottom:0;color:#e83e8c;font-family:\'SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace\';font-size:15px}#auto-task-buttons,.show-button-div{position:fixed !important;top:30px;right:15px;width:150px !important;z-index:999999999 !important;padding:8px !important;border-radius:12px !important}#auto-task-buttons p,.show-button-div p{line-height:normal !important;height:auto !important;text-align:center !important;margin:8px 0 !important;padding:0 !important;font-size:16px !important;color:#333 !important}#auto-task-buttons a.auto-task-website-btn,.show-button-div a.auto-task-website-btn{width:140px !important;min-height:30px !important;line-height:1.5 !important;font-size:16px !important;display:block !important;margin:0 auto !important;padding:8px 16px !important}.show-button-div{width:40px !important;cursor:pointer !important;padding:4px !important}.show-button-div a.auto-task-website-btn{right:-15px !important}.show-button-div a.auto-task-website-btn::after{content:"✓" !important;position:absolute !important;left:12px !important;top:50% !important;transform:translateY(-50%) !important;font-size:18px !important;font-weight:bold !important;color:#fff !important}.auto-task-capitalize{text-transform:capitalize !important}.swal2-file:focus,.swal2-input:focus,.swal2-textarea:focus{box-shadow:inset 0px 0px 4px 1px rgba(100,150,200,.5) !important}.swal2-checkbox-custom{align-items:center;justify-content:center;background:#fff;color:inherit;margin:1em auto}.swal2-checkbox-custom input{flex-shrink:0;margin:0 .4em}.giveaway-actions #getKey{display:none !important}.auto-task-giveaway-status{color:#fff;border-radius:10px;padding:0 5px;margin-left:5px}.auto-task-giveaway-status.active{background-color:#5cb85c}.auto-task-giveaway-status.not-active{background-color:#d9534f}';
  const data$1 = {
    website: '网站',
    type: '类型',
    edit: '编辑',
    whiteList: '白名单',
    skipTask: '跳过撤销任务',
    whiteListOptions: '白名单设置',
    changeWhiteListOption: '设置白名单(%0)',
    whiteListNotFound: '找不到此项白名单: %0',
    changeWhiteListSuccess: '白名单修改成功，刷新生效！',
    changeWebsiteOptions: '网站设置',
    changeGlobalOptions: '全局设置',
    ok: '是',
    save: '保存',
    close: '关闭',
    return: '返回',
    option: '选项',
    value: '值',
    websiteOptions: '当前网站设置',
    changeWebsiteOptionsSuccess: '更改当前网站设置成功，刷新生效！',
    changeGlobalOptionsSuccess: '更改全局设置成功，刷新生效！',
    needLogin: '请先登录！',
    getTasksInfo: '正在获取并处理任务信息...',
    gettingKey: '正在获取Key...',
    verifyingTask: '正在验证任务',
    notice: '自动任务脚本提醒',
    noKeysLeft: '此页面已经没有剩余key了，是否关闭？',
    giveawayEnded: '此活动已结束，是否关闭？',
    giveawayNotWork: '此活动因某些原因(已结束/暂停/未开始...)不可用(如果是脚本误判请及时反馈)，是否关闭？',
    confirm: '确定',
    cancel: '取消',
    unKnown: '未知',
    unKnownTaskType: '未识别的任务 %0',
    doing: '正在做任务',
    allTasksComplete: '所有任务已完成！',
    getTaskIdFailed: '获取任务Id失败！',
    initSuccess: '%0 初始化成功！',
    initFailed: '%0 初始化失败！',
    errorLink: '链接错误: %0',
    needInit: '请先初始化',
    verifyingAuth: '正在验证%0凭证...',
    updatingAuth: '正在更新%0凭证...',
    refreshingToken: '正在刷新%0凭证...',
    settingToken: '正在设置%0凭证...',
    steamStoreTab: 'Steam商店(弹窗)',
    steamCommunityTab: 'Steam社区(弹窗)',
    initing: '正在初始化...',
    getFailed: '获取%0失败！',
    checkLoginFailed: '检测登录状态失败！',
    checkLeftKeyFailed: '检测剩余Key失败！',
    userId: '用户Id',
    joiningGiveaway: '正在加入赠Key',
    needJoinGiveaway: '需要先加入赠Key',
    cannotUndo: '此网站不支持取消任务',
    verifyAuth: '正在验证 %0 凭证...',
    closePageNotice: '如果此页面没有自动关闭，请自行关闭本页面。',
    errorReport: '检测到脚本报错，是否前往反馈BUG？',
    visitingLink: '正在访问链接...',
    doTask: '做任务',
    undoTask: '撤销任务',
    verifyTask: '验证任务',
    getKey: '获取Key',
    selectAll: '全选',
    selectNone: '全不选',
    invertSelect: '反选',
    doFreeTask: '加入免费赠品',
    doPointTask: '加入点数赠品',
    skipTaskOption: '设置中已配置跳过任务',
    other: '其他',
    globalOptions: '全局设置',
    checkLogin: '登录检测</br>需要登录的网站自动登录，部分网站支持',
    checkLeftKey: '剩余Key检测</br>赠Key活动结束提示是否关闭，部分网站支持',
    twitterVerifyId: '通过尝试关注该账号验证Twitter凭证</br>默认为Twitter官方帐号 783214</br>不想关注官方账号可以改为自己的帐号',
    youtubeVerifyChannel: '通过尝试订阅该频道验证YouTube凭证</br>默认为YouTube官方频道 UCrXUsMBcfTVqwAS7DKg9C0Q</br>不想关注官方频道可以改为自己的频道',
    autoUpdateSource: '更新源</br>github: 需代理，实时更新</br>jsdelivr: 可不用代理，更新有延迟</br>standby: 备用</br>auto: 依次使用github, jsdelivr, standby源进行尝试更新',
    saveGlobalOptions: '保存设置',
    settingPage: '设置页面',
    name: '名称',
    version: '版本',
    scriptManager: '脚本管理器',
    script: '脚本',
    environment: '环境',
    os: '系统',
    browser: '浏览器',
    getId: '获取 %0 id',
    getTwitterUserId: '获取Twitter用户id(获取id功能仅在设置页面可用)',
    getYoutubeChannelId: '获取Youtube频道id(获取id功能仅在设置页面可用)',
    showButton: '显示按钮',
    hideButton: '隐藏按钮',
    showLog: '显示日志',
    hideLog: '隐藏日志',
    defaultShowButton: '默认显示按钮',
    defaultShowLog: '默认显示日志',
    debug: '输出调试日志，不要开启此选项！',
    receivePreview: '接收预览版更新',
    position: '组件位置',
    buttonSideX: '按钮区域水平方向定位(实时预览功能仅在设置页面可用)</br>left: 靠左 | right: 靠右',
    buttonSideY: '按钮区域垂直方向定位(实时预览功能仅在设置页面可用)</br>top: 靠上 | bottom: 靠下',
    buttonDistance: '按钮区域距边缘的距离(实时预览功能仅在设置页面可用)</br>格式: X距离,Y距离',
    showButtonSideX: '显示按钮水平方向定位(实时预览功能仅在设置页面可用)</br>left: 靠左 | right: 靠右',
    showButtonSideY: '显示按钮垂直方向定位(实时预览功能仅在设置页面可用)</br>top: 靠上 | bottom: 靠下',
    showButtonDistance: '显示按钮距边缘的距离(实时预览功能仅在设置页面可用)</br>格式: X距离,Y距离',
    logSideX: '日志区域水平方向定位(实时预览功能仅在设置页面可用)</br>left: 靠左 | right: 靠右',
    logSideY: '日志区域垂直方向定位(实时预览功能仅在设置页面可用)</br>top: 靠上 | bottom: 靠下',
    logDistance: '日志区域距边缘的距离(实时预览功能仅在设置页面可用)</br>格式: X距离,Y距离',
    hotKey: '快捷键',
    doTaskKey: '做任务快捷键</br>(实时预览功能仅在设置页面可用)',
    undoTaskKey: '撤销任务快捷键</br>(实时预览功能仅在设置页面可用)',
    toggleLogKey: '显示/隐藏日志快捷键</br>(实时预览功能仅在设置页面可用)',
    tasksHistory: '任务历史',
    clearHistory: '清空历史',
    clearHistoryFinished: '已清空任务历史！',
    deleteTask: '删除任务',
    lastChangeTime: '最后一次修改时间',
    clearTaskFinished: '删除以下任务完成！',
    clearTaskFailed: '删除任务失败，没有找到任务名！',
    syncData: '数据同步',
    settingData: '正在上传数据...',
    gettingData: '正在获取数据...',
    help: '帮助',
    fileName: '文件名',
    upload2gist: '同步到Gist',
    downloadFromGist: '从Gist同步',
    saveAndTest: '保存配置并测试',
    testSuccess: '测试成功！',
    testFailed: '测试失败！',
    saveAndTestNotice: '请先保存配置并测试！',
    processingData: '正在处理数据...',
    updatingData: '正在上传数据...',
    syncDataSuccess: '同步数据成功！',
    syncDataFailed: '同步数据失败，请在控制台查看错误信息！',
    downloadingData: '正在下载数据...',
    checkedNoData: '没有检测到远程数据，请确认配置是否正确！',
    savingData: '正在保存数据...',
    syncHistory: '同步任务历史',
    checkUpdateFailed: '检测更新失败',
    newVersionNotice: '检测到新版本V%0, <a class="high-light" href="%1" target="_blank">点此更新</a>',
    language: '语言</br>目前仅支持zh: 中文, en: 英文',
    gistOptions: 'Gist 设置',
    swalNotice: '检测到您第一次安装V4版本脚本，请前往阅读用前必读内容！',
    echoNotice: '检测到您第一次安装V4版本脚本，请<a class="high-light" href="%0" target="_blank">点此前往</a>阅读用前必读内容！',
    noticeLink: 'https://auto-task-doc.js.org/guide/#用前必读',
    toGithub: '前往Github反馈',
    toKeylol: '前往其乐论坛反馈',
    copySuccess: '错误信息已复制到剪切板，是否前往其乐论坛反馈？',
    copyFailed: '请复制下方错误信息后前往Keylol论坛反馈！',
    updateText: '%0 版本更新内容：',
    Active: '进行中',
    Ended: '已结束',
    Banned: '已封禁',
    Paused: '已暂停',
    notStart: '未开始',
    noRemoteData: '检测到远程无数据',
    errorRemoteDataFormat: '远程数据格式错误',
    updateHistory: '历史更新记录<a class="high-light" href="https://auto-task-doc.js.org/logs/" target="_blank">点此查看</a>',
    AsfEnabled: '使用ASF做Steam相关任务(需<a href="https://github.com/chr233/ASFEnhance" target="_blank">ASFEnhance</a>插件)',
    steamWeb: '同时使用Steam Web API做任务',
    preferASF: '优先使用ASF',
    AsfIpcUrl: 'ASF IPC 地址',
    AsfIpcPassword: 'ASF IPC 密码',
    versionNotMatched: '脚本管理器版本过低，需TamperMonkey >= 5.2.0或TamperMonkey Beta >= 5.2.6196',
    curatorLimitNotice: '失败：可能是鉴赏家关注数量限制，请<a class="high-light" href="https://store.steampowered.com/curators/home/" target="_blank">取关部分鉴赏家</a>后再试',
    unknownScriptHandler: '未知脚本管理器，适用性未知',
    debugModeNotice: '检测到 DEBUG 模式已开启，非必要请关闭！',
    steamWebApiKey: 'Steam Web API 密钥<br>用于检测游戏挂机状态，<a href="https://steamcommunity.com/dev/apikey" target="_blank">点此申请</a>',
    groups: '组',
    officialGroups: '官方组',
    wishlists: '愿望单',
    follows: '游戏关注',
    forums: '论坛',
    workshops: '创意工坊收藏',
    curators: '鉴赏家',
    workshopVotes: '创意工坊点赞',
    announcements: '社区通知',
    steamCommunity: 'Steam社区',
    steamStore: 'Steam商店',
    licenses: '入库免费游戏',
    playtests: '请求访问权限',
    playTime: '挂时长',
    needLoginSteamStore: '请先<a href="https://store.steampowered.com/login/" target="_blank">登录Steam商店</a>',
    needLoginSteamCommunity: '请先<a href="https://steamcommunity.com/login/home/" target="_blank">登录Steam社区</a>',
    joiningSteamGroup: '正在加入Steam组',
    leavingSteamGroup: '正在退出Steam组',
    gettingSteamGroupId: '正在获取Steam组Id',
    joiningSteamOfficialGroup: '正在加入Steam官方组',
    leavingSteamOfficialGroup: '正在退出Steam官方组',
    gettingSteamOfficialGroupId: '正在获取Steam官方组Id',
    subscribingForum: '正在订阅Steam论坛',
    unsubscribingForum: '正在取消订阅Steam论坛',
    gettingForumId: '正在获取Steam论坛Id',
    followingCurator: '正在关注Steam鉴赏家',
    unfollowingCurator: '正在取关Steam鉴赏家',
    gettingCuratorId: '正在获取Steam鉴赏家Id',
    addingToWishlist: '正在添加游戏到Steam愿望单',
    removingFromWishlist: '正在从Steam愿望单移除游戏',
    followingGame: '正在关注Steam游戏',
    unfollowingGame: '正在取关Steam游戏',
    favoritingWorkshop: '正在收藏Steam创意工坊物品',
    unfavoritingWorkshop: '正在取消收藏Steam创意工坊物品',
    gettingWorkshopAppId: '正在获取Steam创意工坊物品Id',
    votingUpWorkshop: '正在点赞Steam创意工坊物品',
    gettingAnnouncementParams: '正在获取Steam通知信息',
    likingAnnouncement: '正在点赞Steam通知',
    changingArea: '正在更换Steam地区: %0...',
    notNeededChangeArea: '当前地区不需要更换',
    noAnotherArea: '请检测是否开启正确开启代理',
    gettingAreaInfo: '正在获取Steam地区信息...',
    changeAreaNotice: '疑似锁区游戏，尝试换区执行',
    steamFinishNotice: 'Steam任务完成，尝试将购物车地区换回',
    gettingSubid: '正在获取游戏subid',
    addingFreeLicense: '正在入库',
    missParams: '缺少参数',
    gettingLicenses: '正在获取Licenses...',
    requestingPlayTestAccess: '正在请求访问权限',
    gettingDemoAppid: '正在获取Steam游戏的Demo Appid',
    tryChangeAreaNotice: '此功能无法检测游戏是否限区，因此会尝试换区后再入库，换区失败也不影响后续入库',
    gettingUserInfo: '正在获取Steam用户社区凭证...',
    retry: '重试',
    owned: '已拥有',
    redirect: '重定向',
    noSubid: '无法获取，跳过',
    noASFInstance: '未启用ASF，跳过挂时长任务',
    initingASF: '正在初始化ASF...',
    playingGames: '正在挂游戏时长[%0]...',
    stoppingPlayGames: '正在停止挂游戏时长...',
    stopPlayTimeTitle: 'Steam游戏挂机时长满足，是否结束挂机？',
    stopPlayTimeText: '挂机已超时：%0 分钟',
    ASFNotSupportted: '当前功能(%0)ASF无法实现，跳过',
    checkingPlayGamesStatus: '正在检查挂游戏时长状态...',
    gettingSteamId: '正在获取Steam ID...',
    checkingPlayStatus: '正在检查挂机状态...',
    noPlayStatus: '游戏未运行',
    servers: '服务器',
    joiningDiscordServer: '正在加入Discord服务器',
    leavingDiscordServer: '正在退出Discord服务器',
    gettingDiscordGuild: '正在获取Discord服务器Id',
    getDiscordAuthFailed: '获取Discord凭证失败，请检测Discord帐号是否已登录',
    discordImportantNotice: '重要提醒！！！',
    discordImportantNoticeText: '由于Discord网站后台更新，目前使用此脚本加组后可能会导致Discord帐号被强制退出，且需要两步验证才能正常登录，请谨慎使用！！！',
    continueDiscordTask: '本次执行Discord任务',
    skipDiscordTask: '本次跳过Discord任务',
    continueAndDontRemindAgain: '总是执行Discord任务且不再提醒',
    gettingDiscordXContextProperties: '正在获取Discord加群参数',
    captchaNeeded: '检测到人机验证，请手动完成！',
    users: '用户',
    loginIns: '请先<a href="https://www.instagram.com/accounts/login/" target="_blank">登录Instagram</a>',
    insBanned: '您的Instagram账户已被封禁',
    verifyingInsAuth: '正在验证Instagram凭证...',
    gettingInsUserId: '正在获取Instagram用户Id',
    followingIns: '正在关注Instagram用户',
    unfollowingIns: '正在取关Instagram用户',
    reddits: '社区/用户',
    loginReddit: '请先<a href="https://www.reddit.com/login/" target="_blank">登录Reddit</a>',
    changingRedditVersion: '正在切换Reddit为新版页面...',
    joiningReddit: '正在加入Reddit社区',
    leavingReddit: '正在退出Reddit社区',
    followingRedditUser: '正在关注Reddit用户',
    unfollowingRedditUser: '正在取关Reddit用户',
    channels: '频道',
    followingTwitchChannel: '正在关注Twitch频道',
    unfollowingTwitchChannel: '正在取关Twitch频道',
    gettingTwitchChannelId: '正在获取Twitch频道Id',
    checkingTwitchIntegrity: '正在检查Twitch完整性...',
    twitterUser: '推特用户',
    retweets: '转推',
    gettingTwitterUserId: '正在获取推特用户Id',
    followingTwitterUser: '正在关注推特用户',
    unfollowingTwitterUser: '正在取关推特用户',
    retweetting: '正在转推',
    unretweetting: '正在撤销转推',
    names: '组/社区/动态',
    loginVk: '请先<a href="https://vk.com/login/" target="_blank">登录Vk</a>',
    gettingVkId: '正在获取Vk任务Id',
    joiningVkGroup: '正在加入Vk组',
    leavingVkGroup: '正在退出Vk组',
    joiningVkPublic: '正在加入Vk社区',
    leavingVkPublic: '正在退出Vk社区',
    sendingVkWall: '正在转发Vk动态',
    deletingVkWall: '正在撤销转发Vk动态',
    youtubeChannel: 'YouTube频道',
    likes: '点赞',
    loginYtb: '请先<a href="https://accounts.google.com/ServiceLogin?service=youtube" target="_blank">登录YouTube</a>',
    tryUpdateYtbAuth: '请尝试<a href="https://www.youtube.com/#auth" target="_blank">更新YouTube凭证</a>',
    gettingYtbToken: '正在获取YouTube Token...',
    followingYtbChannel: '正在订阅YouTube频道',
    unfollowingYtbChannel: '正在退订YouTube频道',
    likingYtbVideo: '正在点赞YouTube视频',
    unlikingYtbVideo: '正在取消点赞YouTube视频',
    giveKeyNoticeBefore: '每次验证间隔15s',
    giveKeyNoticeAfter: '如果没有key, 请在<a href="https://givekey.ru/profile" target="_blank">https://givekey.ru/profile</a>查看',
    noPoints: '点数不够，跳过抽奖',
    getNeedPointsFailed: '获取所需点数失败，跳过抽奖',
    joiningLottery: '正在加入抽奖',
    doingGleamTask: '正在做Gleam任务...',
    gettingGleamLink: '正在获取Gleam任务链接...',
    gleamTaskNotice: '如果此页面长时间未关闭，请完成任一任务后自行关闭！',
    verifiedGleamTasks: '已尝试验证所有任务，验证失败的任务请尝试手动验证或完成！',
    campaign: '检测到人机验证，请手动完成！3秒后重新检测...',
    gsNotice: '为避免得到"0000-0000-0000"key, 已自动屏蔽"Grab Key"按钮，获取key时请关闭脚本！',
    giveeClubVerifyNotice: '正在验证任务...',
    giveeClubVerifyFinished: '请等待验证完成后自行加入赠Key',
    doingKeyhubTask: '正在做Keyhub任务...',
    SweepWidgetNotice: '正在处理并验证任务，每次验证任务有1~3s间隔防止触发验证过快警告...',
    tasksNotCompleted: '任务未完成',
    notConnect: '社交平台未连接，跳过任务: %0',
    tgTaskNotice: '检测到Telegram任务，需要手动完成',
    updatingUserData: '正在更新用户数据...',
    gettingUserGames: '正在获取用户游戏...',
    confirmingTask: '正在跳过警告页面...',
    unSupporttedTaskType: '不支持的任务类型: %0',
    taskNotFinished: '有任务未完成，不获取密钥',
    logCopied: '完整日志已复制到剪切板，请前往反馈！'
  };
  const data = {
    website: 'Website',
    type: 'Type',
    edit: 'Edit',
    whiteList: 'Whitelist',
    skipTask: 'Skip undo task',
    whiteListOptions: 'Whitelist options',
    changeWhiteListOption: 'Whitelist option(%0)',
    whiteListNotFound: 'Cannot find this whitelist: %0',
    changeWhiteListSuccess: 'The whitelist is successfully modified, and the page refresh will take effect!',
    changeWebsiteOptions: 'Website options',
    changeGlobalOptions: 'Global options',
    ok: 'OK',
    save: 'Save',
    close: 'Close',
    return: 'Return',
    option: 'Option',
    value: 'Value',
    websiteOptions: 'Current website settings',
    changeWebsiteOptionsSuccess: 'The current website setting is changed successfully, and the page refresh will take effect!',
    changeGlobalOptionsSuccess: 'The global setting is changed successfully, and the refresh will take effect!',
    needLogin: 'Please log in first!',
    getTasksInfo: 'Obtaining and processing task information...',
    gettingKey: 'Getting Key...',
    verifyingTask: 'Verifying task',
    notice: 'Automatic task script notice',
    noKeysLeft: 'There are no more keys left on this page. Do you want to close it?',
    giveawayEnded: 'This event has ended, do you want to close it?',
    giveawayNotWork: 'This activity is unavailable for some reasons (banned/ended/paused/not started...)' + ' (if it is a script misjudgment, please give us feedback in time), is it closed?',
    confirm: 'Confirm',
    cancel: 'Cancel',
    unKnown: 'Unknown',
    unKnownTaskType: 'Unrecognized task %0',
    doing: 'Doing a task',
    allTasksComplete: 'All tasks have been completed!',
    getTaskIdFailed: 'Failed to obtain task Id!',
    initSuccess: '%0 was initialized successfully!',
    initFailed: '%0 initialization failed!',
    errorLink: 'Link error: %0',
    needInit: 'Please initialize first',
    verifyingAuth: 'Verifying %0 token...',
    updatingAuth: 'Update %0 token...',
    refreshingToken: 'Refreshing %0 token...',
    settingToken: 'Setting %0 token...',
    steamStoreTab: 'Steam store (new tab)',
    steamCommunityTab: 'Steam community(new tab)',
    initing: 'Initializing...',
    getFailed: 'Failed to get %0!',
    checkLoginFailed: 'Failed to detect login status!',
    checkLeftKeyFailed: 'Failed to detect the remaining keys!',
    userId: 'User Id',
    joiningGiveaway: 'Joining giveaway',
    needJoinGiveaway: 'Need to join the giveaway first',
    cannotUndo: 'This website does not support canceling tasks',
    verifyAuth: 'Verifying %0 token...',
    closePageNotice: 'f this page does not close automatically, please close this page yourself.',
    errorReport: 'A script error is detected, do you want to report the BUG?',
    visitingLink: 'Visiting link ...',
    doTask: 'DoTask',
    undoTask: 'UndoTask',
    verifyTask: 'Verify',
    getKey: 'GetKey',
    selectAll: 'SelectAll',
    selectNone: 'SelectNone',
    invertSelect: 'InvertSelect',
    doFreeTask: 'FreeTask',
    doPointTask: 'PointTask',
    skipTaskOption: 'Skip task has been configured in the settings',
    other: 'Other',
    globalOptions: 'Global Options',
    checkLogin: 'Login detection</br>Need to log in to the website automatically log in, part of this website supports.',
    checkLeftKey: 'Key remaining detection</br>The end of the giveaway event prompts whether to close or not, part of this website supports.',
    twitterVerifyId: 'Verify Twitter token by trying to follow the account.</br>The default is the official Twitter account 783214.</br>' + 'If you don\'t want to follow the official account, you can change it to your own account.',
    youtubeVerifyChannel: 'Verify YouTube token by trying to subscribe to the channel.</br>' + 'The default is the official YouTube channel UCrXUsMBcfTVqwAS7DKg9C0Q.</br>' + 'If you don\'t want to follow the official channel, you can change it to your own channel.',
    autoUpdateSource: 'The source to update</br>github: Fast update.</br>jsdelivr: Update is delayed.</br>' + 'standby: Standby source.</br>auto: Try to update using github, jsdelivr, standby sources in turn.',
    saveGlobalOptions: 'SaveSettings',
    settingPage: 'Setting Page',
    name: 'Name',
    version: 'Version',
    scriptManager: 'Script Manager',
    script: 'Script',
    environment: 'Environment',
    os: 'OS',
    browser: 'Browser',
    getId: 'Get %0 id',
    getTwitterUserId: 'Get Twitter user id (Get id function is only available on the settings page).',
    getYoutubeChannelId: 'Get Youtube channel id (Get id function is only available on the settings page).',
    showButton: 'ShowButton',
    hideButton: 'HideButton',
    showLog: 'ShowLog',
    hideLog: 'HideLog',
    defaultShowButton: 'Default display button',
    defaultShowLog: 'Display log by default',
    debug: 'Output debug log, do not enable this option!',
    receivePreview: 'Receive preview updates',
    position: 'Component position',
    buttonSideX: 'Horizontal positioning of the button area (real-time preview function is only available on the setting page).' + '</br>left: left | right: right',
    buttonSideY: 'The button area is positioned in the vertical direction (real-time preview function is only available on the settings page).' + '</br>top: top | bottom: bottom',
    buttonDistance: 'The distance between the button area and the edge (the real-time preview function is only available on the setting page).' + '</br> Format: X distance, Y distance',
    showButtonSideX: 'ShowButton horizontal positioning (real-time preview function is only available on the setting page).' + '</br>left: left | right: right',
    showButtonSideY: 'ShowButton vertical positioning (real-time preview function is only available on the setting page).' + '</br>top: top | bottom: bottom',
    showButtonDistance: 'The distance between the ShowButton and the edge (real-time preview function is only available on the setting page).' + '</br> Format: X distance, Y distance',
    logSideX: 'Horizontal positioning of the log area (real-time preview function is only available on the setting page).' + '</br>left: left | right: right',
    logSideY: 'Vertical positioning of the log area (real-time preview function is only available on the setting page).' + '</br>top: top | bottom: bottom',
    logDistance: 'The distance between the log area and the edge (the real-time preview function is only available on the setting page).' + '</br> Format: X distance, Y distance',
    hotKey: 'Shortcut key',
    doTaskKey: 'DoTask shortcut keys</br> (real-time preview function is only available on the settings page).',
    undoTaskKey: 'UndoTask shortcut keys</br> (real-time preview function is only available on the settings page).',
    toggleLogKey: 'ShowLog/HideLog shortcut keys</br> (real-time preview function is only available on the settings page).',
    tasksHistory: 'TasksHistory',
    clearHistory: 'Clear history',
    clearHistoryFinished: 'The mission history has been cleared!',
    deleteTask: 'Delete task',
    lastChangeTime: 'Last Change Time',
    clearTaskFinished: 'Delete the following tasks completed!',
    clearTaskFailed: 'Failed to delete the task, the task name was not found!',
    syncData: 'DataSync',
    settingData: 'Uploading data...',
    gettingData: 'Getting data...',
    help: 'Help',
    fileName: 'Filename',
    upload2gist: 'Sync to Gist',
    downloadFromGist: 'Sync from Gist',
    saveAndTest: 'Save configuration and test',
    testSuccess: 'Test success!',
    testFailed: 'Test failed!',
    saveAndTestNotice: 'Please save the configuration and test first!',
    processingData: 'Processing data...',
    updatingData: 'Uploading data...',
    syncDataSuccess: 'Synchronized data successfully!',
    syncDataFailed: 'Failed to synchronize data, please check the error message on the console!',
    downloadingData: 'Downloading data...',
    checkedNoData: 'No remote data is detected, please confirm whether the configuration is correct!',
    savingData: 'Saving data...',
    syncHistory: 'Synchronize tasks history',
    checkUpdateFailed: 'Check update failed',
    newVersionNotice: 'Checked a new version V%0, <a class="high-light" href="%1" target="_blank">click to update</a>',
    language: 'Language</br> Currently only supports zh: Chinese, en: English',
    gistOptions: 'Gist Settings',
    swalNotice: 'It is detected that you are installing the V4 version script for the first time' + ', please go to read the READ ME FIRST content before use!',
    echoNotice: 'It is detected that you are installing the V4 version script for the first time' + ', please <a class="high-light" href="%0" target="_blank">click here</a> to read the READ ME FIRST content before use!',
    noticeLink: 'https://auto-task-doc.js.org/en/guide/#read-me-first',
    toGithub: 'Feedback(Github)',
    toKeylol: 'Feedback(Keylol)',
    copySuccess: 'The error message has been copied to the clipboard. Do you want to go to the Keylol forum to give feedback?',
    copyFailed: 'Please copy the error information below and report back to the Keylol forum!',
    updateText: 'Updates in version %0:',
    Active: 'Active',
    Ended: 'Ended',
    Banned: 'Banned',
    Paused: 'Paused',
    notStart: 'notStart',
    noRemoteData: 'No data remotely',
    errorRemoteDataFormat: 'Remote data has wrong format',
    updateHistory: '<a class="high-light" href="https://auto-task-doc.js.org/logs/" target="_blank">Click here</a>' + ' to view the historical update record.',
    AsfEnabled: 'Use ASF to do Steam related tasks (requires <a href="https://github.com/chr233/ASFEnhance" target="_blank">ASFEnhance</a> plugin)',
    steamWeb: 'Use Steam Web API to do Steam related tasks simultaneously',
    preferASF: 'Prefer ASF to do Steam related tasks',
    AsfIpcUrl: 'ASF IPC URL',
    AsfIpcPassword: 'ASF IPC Password',
    curatorLimitNotice: 'Failed: Maybe the curator follow limit is reached, please <a class="high-light" href="https://store.steampowered.com/curators/home/" target="_blank">unfollow some curators</a> and try again',
    unknownScriptHandler: 'Unknown script handler, compatibility unknown',
    debugModeNotice: 'Detected DEBUG mode enabled, please close it if it is not needed!',
    steamWebApiKey: 'Steam Web API Key<br>Used to detect game idle status, <a href="https://steamcommunity.com/dev/apikey" target="_blank">click to apply</a>',
    groups: 'Group',
    officialGroups: 'Official Group',
    wishlists: 'Wishlist',
    follows: 'Follow Game',
    forums: 'Forum',
    workshops: 'Favorite Workshop',
    curators: 'Curator',
    workshopVotes: 'Voteup Workshop',
    announcements: 'Announcement',
    steamCommunity: 'Steam Community',
    steamStore: 'Steam Store',
    licenses: 'Add License',
    playtests: 'Playtest Access',
    needLoginSteamStore: 'Please <a href="https://store.steampowered.com/login/" target="_blank">log in to the Steam Store</a>',
    needLoginSteamCommunity: 'Please <a href="https://steamcommunity.com/login/home/" target="_blank">log in to the Steam Community</a>',
    joiningSteamGroup: 'Joining Steam Group',
    leavingSteamGroup: 'Leaving Steam Group',
    gettingSteamGroupId: 'Getting Steam Group Id',
    joiningSteamOfficialGroup: 'Joining Steam Official Group',
    leavingSteamOfficialGroup: 'Leaving Steam Official Group',
    gettingSteamOfficialGroupId: 'Getting Steam Official Group Id',
    subscribingForum: 'Subscribing the Steam Forum',
    unsubscribingForum: 'Unsubscribing the Steam Forum',
    gettingForumId: 'Getting Steam Forum Id',
    followingCurator: 'Following Steam Curator',
    unfollowingCurator: 'Unfollowing Steam Curator',
    gettingCuratorId: 'Getting Steam Curator Id',
    addingToWishlist: 'Adding the game to the Steam wishlist',
    removingFromWishlist: 'Removing the game from the Steam wishlist',
    followingGame: 'Following Steam games',
    unfollowingGame: 'Unfollowing Steam games',
    favoritingWorkshop: 'Favouring Steam Workshop Items',
    unfavoritingWorkshop: 'Unfavoriting Steam Workshop Items',
    gettingWorkshopAppId: 'Getting Steam Workshop Item Id',
    votingUpWorkshop: 'Liking Steam workshop items',
    gettingAnnouncementParams: 'Getting Steam announcement information',
    likingAnnouncement: 'Liking Steam announcement',
    changingArea: 'Changing Steam area: %0...',
    notNeededChangeArea: 'The current area does not need to be changed',
    noAnotherArea: 'Please check whether the proxy is turned on correctly',
    gettingAreaInfo: 'Getting Steam area information...',
    changeAreaNotice: 'Suspected of a locked zone game, try to change the zone to execute',
    steamFinishNotice: 'Steam task completed, try to change the shopping cart area back to ',
    gettingSubid: 'Getting subid',
    addingFreeLicense: 'Adding free license',
    missParams: 'Missing parameters',
    gettingLicenses: 'Getting licenses...',
    requestingPlayTestAccess: 'Requesting play test access',
    gettingDemoAppid: 'Getting demo appid for steam game',
    tryChangeAreaNotice: 'This function cannot detect whether the game is limited, so it will try to change the area before entering the library' + '. Failure to change the area will not affect the subsequent storage.',
    versionNotMatched: 'The script manager version is too low, requiring TamperMonkey >= 5.2.0 or TamperMonkey Beta >= 5.2.6196',
    gettingUserInfo: 'Getting steam user community credentials...',
    retry: 'Retry',
    owned: 'Owned',
    redirect: 'Redirect',
    noSubid: 'skip due to unrecognized',
    noASFInstance: 'ASF is not enabled, skip idle time task',
    initingASF: 'Initing ASF...',
    playingGames: 'Playing games [%0]...',
    stoppingPlayGames: 'Stopping play games...',
    stopPlayTimeTitle: 'The Steam game idle time has finished. Do you want to end it?',
    stopPlayTimeText: 'Time out: %0 minutes',
    ASFNotSupportted: 'The current function (%0) cannot be implemented by ASF, skipping',
    checkingPlayGamesStatus: 'Checking play games status...',
    gettingSteamId: 'Getting Steam ID...',
    checkingPlayStatus: 'Checking play status...',
    noPlayStatus: 'Game not running',
    servers: 'Server',
    joiningDiscordServer: 'Joining Discord Server',
    leavingDiscordServer: 'Leaving Discord Server',
    gettingDiscordGuild: 'Getting Discord server Id',
    getDiscordAuthFailed: 'Failed to get Discord token, please check whether the Discord account is logged in',
    discordImportantNotice: 'Important Reminder! ! !',
    discordImportantNoticeText: 'Due to the background update of the Discord website, currently using this script to join a group may cause the Discord account to be forcibly logged out, and two-step verification is required to log in normally, please use it with caution! ! !',
    continueDiscordTask: 'Do Discord tasks this time.',
    skipDiscordTask: 'Skip Discord tasks this time.',
    continueAndDontRemindAgain: 'Always do Discord tasks and do not remind again.',
    gettingDiscordXContextProperties: 'Getting Discord X context properties...',
    captchaNeeded: 'Captcha detected, please complete it manually!',
    users: 'User',
    loginIns: 'Please <a href="https://www.instagram.com/accounts/login/" target="_blank">log in to Instagram</a>',
    insBanned: 'Your Instagram account has been banned',
    verifyingInsAuth: 'Verifying Instagram token...',
    gettingInsUserId: 'Getting Instagram user Id',
    followingIns: 'Following Instagram user',
    unfollowingIns: 'Unfollowing Instagram user',
    reddits: 'Reddit/User',
    loginReddit: 'Please <a href="https://www.reddit.com/login/" target="_blank">log in to Reddit</a>',
    changingRedditVersion: 'Switching Reddit to a new version page...',
    joiningReddit: 'Joining the Reddit',
    leavingReddit: 'Leaving the Reddit',
    followingRedditUser: 'Following Reddit User',
    unfollowingRedditUser: 'Unfollowing Reddit User',
    channels: 'Channel',
    followingTwitchChannel: 'Following Twitch Channel',
    unfollowingTwitchChannel: 'Unfollowing Twitch Channel',
    gettingTwitchChannelId: 'Getting Twitch Channel Id',
    checkingTwitchIntegrity: 'Checking Twitch integrity...',
    twitterUser: 'Twitter User',
    retweets: 'Retweet',
    gettingTwitterUserId: 'Getting Twitter User Id',
    followingTwitterUser: 'Following Twitter User',
    unfollowingTwitterUser: 'Unfollowing Twitter User',
    retweetting: 'Retweetting',
    unretweetting: 'Unretweetting',
    names: 'Group/Public/Wall',
    loginVk: 'Please <a href="https://vk.com/login/" target="_blank">log in to Vk</a>',
    gettingVkId: 'Getting Vk task Id',
    joiningVkGroup: 'Joining Vk Group',
    leavingVkGroup: 'Leaving Vk Group',
    joiningVkPublic: 'Joining Vk Public',
    leavingVkPublic: 'Leaving Vk Public',
    sendingVkWall: 'Sending Vk Wall',
    deletingVkWall: 'Deleting Vk Wall',
    youtubeChannel: 'YouTube Channel',
    likes: 'Like',
    loginYtb: 'Please <a href="https://accounts.google.com/ServiceLogin?service=youtube" target="_blank">log in to YouTube</a>',
    tryUpdateYtbAuth: 'Please try to <a href="https://www.youtube.com/#auth" target="_blank">update YouTube token</a>',
    gettingYtbToken: 'Getting YouTube Token...',
    followingYtbChannel: 'Subscribing to YouTube channel',
    unfollowingYtbChannel: 'Unsubscribing to YouTube channel',
    likingYtbVideo: 'Liking YouTube video',
    unlikingYtbVideo: 'Unliking YouTube video',
    giveKeyNoticeBefore: 'Each verification interval is 15s',
    giveKeyNoticeAfter: 'If there is no key, please check at <a href="https://givekey.ru/profile" target="_blank">https://givekey.ru/profile</a>',
    noPoints: 'Not enough points, skip the lottery',
    getNeedPointsFailed: 'ailed to obtain the required points, skip the lottery',
    joiningLottery: 'Joining the lottery',
    doingGleamTask: 'Doing Gleam Task...',
    gettingGleamLink: 'Getting Gleam task link...',
    gleamTaskNotice: 'If this page has not been closed for a long time, please close it yourself after completing any task!',
    verifiedGleamTasks: 'Attempted to verify all tasks. If the verification fails, please try to verify manually or complete it!',
    campaign: 'ReCAPTCHA detected, please complete it manually! 3 seconds later, re-verify...',
    gsNotice: 'In order to avoid getting the "0000-0000-0000" key, the "Grab Key" button has been hidden,' + ' please close the script when obtaining the key!',
    giveeClubVerifyNotice: 'Verifying task...',
    giveeClubVerifyFinished: 'Wait for the verification to complete and join it by yourself',
    doingKeyhubTask: 'Doing Keyhub Task...',
    SweepWidgetNotice: 'The task is being processed and verified. ' + 'There is an interval of 1~3s for each verification task to prevent the triggering of too fast verification warning...',
    tasksNotCompleted: 'Tasks Not Completed',
    notConnect: 'Social platform is not connectted, skip task: %0',
    tgTaskNotice: 'The telegram task is checked, need to do it yourself!',
    updatingUserData: 'Updating user data...',
    gettingUserGames: 'Getting user games...',
    confirmingTask: 'Confirming task...',
    unSupporttedTaskType: 'Unsupportted task type: %0',
    taskNotFinished: 'There are tasks not completed, do not get the key',
    logCopied: 'Full log has been copied to the clipboard, please go to feedback!'
  };
  const languages = {
    zh: data$1,
    en: data
  };
  const SUPPORTED_LANGUAGES = [ 'zh', 'en' ];
  const getCurrentLanguage = () => {
    const userLanguage = globalOptions.other.language;
    return SUPPORTED_LANGUAGES.includes(userLanguage) ? userLanguage : 'en';
  };
  const replacePlaceholders = (text, args) => text.replace(/%([\d]+)/g, ((_, index) => args[parseInt(index, 10)] || ''));
  const I18n = function(key) {
    const currentLanguage = getCurrentLanguage();
    const translation = languages[currentLanguage]?.[key];
    if (!translation) {
      console.warn(`Missing translation for key: ${key} in language: ${currentLanguage}`);
      return key;
    }
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }
    return replacePlaceholders(translation, args);
  };
  var DebugLevel;
  (function(DebugLevel) {
    DebugLevel['ERROR'] = 'error';
    DebugLevel['WARN'] = 'warn';
    DebugLevel['INFO'] = 'info';
    DebugLevel['DEBUG'] = 'debug';
    DebugLevel['TRACE'] = 'trace';
  })(DebugLevel || (DebugLevel = {}));
  const defaultConfig = {
    enabled: false,
    level: DebugLevel.INFO,
    prefix: 'Auto-Task',
    styles: {
      error: 'color:#ff0000;font-weight:bold',
      warn: 'color:#ffa500',
      info: 'color:#a7a7a7',
      debug: 'color:#808080',
      trace: 'color:#87ceeb'
    },
    showTimestamp: true
  };
  class Debugger {
    config;
    levelPriority;
    constructor() {
      let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.config = {
        ...defaultConfig,
        ...config
      };
      this.levelPriority = {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3,
        trace: 4
      };
    }
    getTimestamp() {
      return (new Date).toLocaleString();
    }
    shouldLog(level) {
      return this.config.enabled && this.levelPriority[level] <= this.levelPriority[this.config.level];
    }
    formatMessage(level, message) {
      const parts = [ this.config.prefix ];
      if (this.config.showTimestamp) {
        parts.push(`[${this.getTimestamp()}]`);
      }
      parts.push(`[${level.toUpperCase()}]:`);
      parts.push(message);
      return parts.join(' ');
    }
    log(level, message) {
      if (!this.shouldLog(level)) {
        return;
      }
      const formattedMessage = this.formatMessage(level, message);
      const style = this.config.styles[level];
      for (var _len4 = arguments.length, args = new Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
        args[_key4 - 2] = arguments[_key4];
      }
      if (args.length > 0) {
        console.groupCollapsed('%c%s', style, formattedMessage);
        args.forEach((arg => {
          console.log(util.inspect(arg, {
            showHidden: true,
            depth: null,
            colors: false
          }));
        }));
        console.groupEnd();
      } else {
        console.log('%c%s', style, formattedMessage);
      }
    }
    error(message) {
      for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        args[_key5 - 1] = arguments[_key5];
      }
      this.log(DebugLevel.ERROR, message, ...args);
    }
    warn(message) {
      for (var _len6 = arguments.length, args = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
        args[_key6 - 1] = arguments[_key6];
      }
      this.log(DebugLevel.WARN, message, ...args);
    }
    info(message) {
      for (var _len7 = arguments.length, args = new Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
        args[_key7 - 1] = arguments[_key7];
      }
      this.log(DebugLevel.INFO, message, ...args);
    }
    debug(message) {
      for (var _len8 = arguments.length, args = new Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
        args[_key8 - 1] = arguments[_key8];
      }
      this.log(DebugLevel.DEBUG, message, ...args);
    }
    trace(message) {
      for (var _len9 = arguments.length, args = new Array(_len9 > 1 ? _len9 - 1 : 0), _key9 = 1; _key9 < _len9; _key9++) {
        args[_key9 - 1] = arguments[_key9];
      }
      this.log(DebugLevel.TRACE, message, ...args);
      if (this.shouldLog(DebugLevel.TRACE)) {
        console.trace();
      }
    }
    updateConfig(config) {
      this.config = {
        ...this.config,
        ...config
      };
    }
    enable() {
      this.config.enabled = true;
    }
    disable() {
      this.config.enabled = false;
    }
    setLevel(level) {
      this.config.level = level;
    }
  }
  let debugInstance;
  const initDebug = () => {
    if (!debugInstance) {
      debugInstance = new Debugger({
        enabled: window.DEBUG || false
      });
      if (window.DEBUG) {
        debugInstance.setLevel(DebugLevel.DEBUG);
      }
    }
    return debugInstance;
  };
  const debug = function() {
    const instance = initDebug();
    return instance.debug(...arguments);
  };
  const getRunLogs = () => {
    debug('开始获取运行日志');
    const logElements = $('#auto-task-info>li');
    const logs = logElements.length > 0 ? $.makeArray(logElements).map((element => element.innerText)).join('\n') : '';
    debug('运行日志获取完成', {
      logsLength: logs.length
    });
    return logs;
  };
  const getEnvironmentInfo = async () => {
    debug('开始获取环境信息');
    const envInfo = {
      website: window.location.href,
      browser: JSON.stringify(await browser.getInfo(), null, 2),
      manager: `${GM_info.scriptHandler} ${GM_info.version}`,
      userScript: GM_info.script.version,
      logs: '',
      runLogs: getRunLogs()
    };
    debug('环境信息获取完成', envInfo);
    return envInfo;
  };
  const buildGithubIssueParams = async (name, errorStack, envInfo) => {
    debug('开始构建GitHub Issue参数', {
      name: name,
      errorStackLength: errorStack.length
    });
    const params = {
      title: `[BUG] 脚本报错: ${name}`,
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
    debug('GitHub Issue参数构建完成', params);
    return params;
  };
  const generateGithubLink = async (name, errorStack, envInfo) => {
    debug('开始生成GitHub Issue链接');
    const params = new URLSearchParams(await buildGithubIssueParams(name, errorStack, envInfo));
    const link = `https://github.com/HCLonely/auto-task/issues/new?${params.toString()}`;
    debug('GitHub Issue链接生成完成', {
      link: link
    });
    return link;
  };
  const logError = (name, errorStack) => {
    debug('记录错误日志', {
      name: name
    });
    console.log('%c%s', 'color:white;background:red', `Auto-Task[Error]: ${name}\n${errorStack}`);
  };
  const handleErrorReport = async (platform, name, errorStack, envInfo) => {
    debug('开始处理错误报告', {
      platform: platform,
      name: name
    });
    {
      const githubLink = await generateGithubLink(name, errorStack, envInfo);
      debug('打开GitHub Issue链接', {
        githubLink: githubLink
      });
      GM_openInTab(githubLink, {
        active: true
      });
    }
  };
  async function throwError(error, name) {
    debug('开始处理错误', {
      name: name,
      error: error
    });
    if (window.TRACE) {
      debug('启用跟踪模式');
      console.trace('%cAuto-Task[Trace]:', 'color:blue');
    }
    const errorStack = error.stack || '';
    logError(name, errorStack);
    debug('获取环境信息');
    const envInfo = await getEnvironmentInfo();
    envInfo.logs = errorStack;
    debug('显示错误报告对话框');
    const {isConfirmed: isConfirmed} = await Swal.fire({
      title: I18n('errorReport'),
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: I18n('toGithub'),
      cancelButtonText: I18n('close')
    });
    if (isConfirmed) {
      debug('用户确认提交错误报告');
      await handleErrorReport('github', name, errorStack, envInfo);
      Swal.fire({
        title: I18n('logCopied'),
        icon: 'success',
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: I18n('close')
      });
    } else {
      debug('用户取消提交错误报告');
    }
  }
  const parseHeaders = headerString => {
    debug('开始解析HTTP头', {
      headerString: headerString
    });
    const headers = {};
    if (!headerString) {
      debug('HTTP头为空，返回空对象');
      return headers;
    }
    headerString.split('\n').forEach((header => {
      const [name, ...values] = header.trim().split(':');
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
    debug('HTTP头解析完成', {
      headers: headers
    });
    return headers;
  };
  const processResponse = (data, options) => {
    debug('开始处理响应数据', {
      responseType: options.responseType
    });
    const headers = parseHeaders(data.responseHeaders);
    data.responseHeadersText = data.responseHeaders;
    data.responseHeaders = headers;
    data.finalUrl = headers.location || data.finalUrl;
    debug('响应头处理完成', {
      finalUrl: data.finalUrl
    });
    if (options.responseType === 'json' && data?.response && typeof data.response !== 'object') {
      debug('尝试解析JSON响应');
      try {
        data.response = JSON.parse(data.responseText);
        debug('JSON解析成功');
      } catch {
        debug('JSON解析失败，保持原始响应');
      }
    }
  };
  const httpRequest = async function(options) {
    let times = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    debug('开始HTTP请求', {
      url: options.url,
      method: options.method,
      retryTimes: times
    });
    if (window.TRACE) {
      console.trace('%cAuto-Task[Trace]:', 'color:blue');
    }
    try {
      const result = await new Promise((resolve => {
        const requestObj = {
          fetch: true,
          timeout: 3e4,
          ontimeout: data => {
            debug('请求超时', {
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
            debug('请求被中止', {
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
            debug('请求发生错误', {
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
            debug('请求加载完成', {
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
          },
          ...options,
          responseType: options.dataType || options.responseType
        };
        debug('发送请求', {
          requestObj: requestObj
        });
        GM_xmlhttpRequest(requestObj);
      }));
      if (window.DEBUG) {
        console.log('%cAuto-Task[httpRequest]:', 'color:blue', result);
      }
      if (result.status !== 600 && times < 2) {
        debug('请求失败，准备重试', {
          status: result.status,
          retryTimes: times + 1
        });
        return await httpRequest(options, times + 1);
      }
      debug('请求完成', {
        status: result.status,
        result: result.result
      });
      return result;
    } catch (error) {
      debug('请求发生JavaScript错误', {
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
  var ASF = '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16" version="1.1">\n<g id="surface1">\n<path style=" stroke:none;fill-rule:nonzero;fill:rgb(11.372549%,17.254902%,26.274511%);fill-opacity:1;" d="M 7.652344 0.175781 C 8.046875 0.351562 8.210938 0.59375 8.441406 0.953125 C 9.007812 1.746094 9.644531 2.539062 10.640625 2.761719 C 12.011719 2.949219 13.429688 2.882812 14.808594 2.796875 C 14.90625 2.792969 15.003906 2.785156 15.101562 2.78125 C 15.1875 2.773438 15.273438 2.769531 15.363281 2.761719 C 15.429688 2.769531 15.496094 2.777344 15.566406 2.78125 C 15.761719 3.082031 15.757812 3.191406 15.75 3.539062 C 15.75 3.625 15.746094 3.710938 15.746094 3.800781 C 15.742188 3.867188 15.742188 3.933594 15.738281 4 C 15.824219 4.027344 15.910156 4.058594 16 4.085938 C 15.988281 4.34375 15.976562 4.597656 15.960938 4.851562 C 15.957031 4.925781 15.957031 5 15.953125 5.074219 C 15.945312 5.175781 15.945312 5.175781 15.941406 5.285156 C 15.9375 5.378906 15.9375 5.378906 15.929688 5.480469 C 15.914062 5.652344 15.914062 5.652344 15.824219 5.914062 C 15.816406 6.058594 15.8125 6.203125 15.8125 6.34375 C 15.8125 6.433594 15.8125 6.519531 15.808594 6.613281 C 15.808594 6.707031 15.808594 6.800781 15.808594 6.898438 C 15.804688 7.097656 15.804688 7.300781 15.800781 7.5 C 15.796875 7.816406 15.792969 8.132812 15.792969 8.449219 C 15.789062 8.753906 15.785156 9.058594 15.78125 9.363281 C 15.78125 9.457031 15.78125 9.550781 15.78125 9.648438 C 15.777344 9.738281 15.777344 9.824219 15.773438 9.914062 C 15.773438 10.03125 15.773438 10.03125 15.773438 10.148438 C 15.738281 10.347656 15.738281 10.347656 15.625 10.503906 C 15.386719 10.671875 15.152344 10.625 14.871094 10.609375 C 14.867188 10.675781 14.859375 10.742188 14.855469 10.808594 C 14.816406 11.367188 14.746094 11.890625 14.609375 12.433594 C 14.3125 12.535156 14.105469 12.507812 13.804688 12.441406 C 13.6875 12.414062 13.6875 12.414062 13.570312 12.390625 C 13.480469 12.367188 13.480469 12.367188 13.390625 12.347656 C 13.359375 12.515625 13.359375 12.515625 13.324219 12.683594 C 13.226562 13.144531 13.054688 13.566406 12.871094 14 C 12.75 13.988281 12.628906 13.980469 12.511719 13.96875 C 12.410156 13.957031 12.410156 13.957031 12.308594 13.949219 C 12.050781 13.90625 11.8125 13.828125 11.566406 13.738281 C 11.492188 13.867188 11.492188 13.867188 11.417969 14 C 11.355469 14.113281 11.292969 14.222656 11.226562 14.335938 C 11.195312 14.394531 11.164062 14.449219 11.132812 14.507812 C 11 14.738281 10.882812 14.941406 10.695312 15.128906 C 10.257812 15.097656 9.957031 14.863281 9.601562 14.625 C 9.402344 14.503906 9.402344 14.503906 9.222656 14.542969 C 9.015625 14.617188 8.925781 14.703125 8.777344 14.863281 C 8.730469 14.914062 8.683594 14.964844 8.632812 15.019531 C 8.535156 15.125 8.433594 15.234375 8.335938 15.339844 C 7.972656 15.726562 7.972656 15.726562 7.675781 15.792969 C 7.4375 15.726562 7.367188 15.660156 7.21875 15.460938 C 7 15.1875 6.773438 14.941406 6.523438 14.695312 C 6.375 14.550781 6.230469 14.40625 6.085938 14.261719 C 6.023438 14.195312 5.957031 14.128906 5.890625 14.0625 C 2.175781 10.347656 2.175781 10.347656 1.945312 10.117188 C 1.738281 9.910156 1.527344 9.707031 1.316406 9.503906 C 1.160156 9.351562 1 9.199219 0.84375 9.042969 C 0.722656 8.925781 0.722656 8.925781 0.597656 8.808594 C 0.519531 8.734375 0.445312 8.660156 0.363281 8.582031 C 0.296875 8.515625 0.226562 8.445312 0.152344 8.375 C -0.03125 8.132812 -0.0351562 8.039062 0 7.738281 C 0.117188 7.570312 0.117188 7.570312 0.28125 7.402344 C 0.34375 7.339844 0.40625 7.277344 0.472656 7.210938 C 0.542969 7.144531 0.613281 7.074219 0.683594 7.003906 C 0.757812 6.933594 0.828125 6.859375 0.902344 6.785156 C 1.101562 6.585938 1.304688 6.386719 1.503906 6.1875 C 1.714844 5.980469 1.921875 5.773438 2.132812 5.5625 C 2.480469 5.214844 2.832031 4.863281 3.183594 4.515625 C 3.683594 4.023438 4.175781 3.53125 4.671875 3.039062 C 5.015625 2.695312 5.359375 2.355469 5.699219 2.015625 C 5.785156 1.929688 5.867188 1.847656 5.949219 1.765625 C 6.222656 1.492188 6.496094 1.222656 6.773438 0.949219 C 6.839844 0.882812 6.910156 0.8125 6.980469 0.742188 C 7.078125 0.648438 7.078125 0.648438 7.171875 0.550781 C 7.226562 0.496094 7.285156 0.441406 7.339844 0.386719 C 7.476562 0.261719 7.476562 0.261719 7.652344 0.175781 Z M 7.652344 0.175781 "/>\n<path style=" stroke:none;fill-rule:nonzero;fill:rgb(5.490196%,7.843138%,14.901961%);fill-opacity:1;" d="M 10.433594 2.78125 C 11.101562 2.777344 11.765625 2.773438 12.433594 2.769531 C 12.742188 2.769531 13.050781 2.765625 13.359375 2.761719 C 13.714844 2.757812 14.070312 2.757812 14.425781 2.757812 C 14.539062 2.753906 14.648438 2.753906 14.761719 2.753906 C 14.867188 2.753906 14.96875 2.753906 15.074219 2.753906 C 15.210938 2.753906 15.210938 2.753906 15.347656 2.75 C 15.421875 2.761719 15.492188 2.773438 15.566406 2.78125 C 15.761719 3.082031 15.757812 3.191406 15.75 3.539062 C 15.75 3.625 15.746094 3.710938 15.746094 3.800781 C 15.742188 3.867188 15.742188 3.933594 15.738281 4 C 15.824219 4.027344 15.910156 4.058594 16 4.085938 C 15.988281 4.332031 15.980469 4.578125 15.96875 4.824219 C 15.964844 4.929688 15.964844 4.929688 15.960938 5.035156 C 15.9375 5.492188 15.863281 5.90625 15.738281 6.347656 C 15.675781 6.3125 15.613281 6.273438 15.546875 6.234375 C 15.011719 5.921875 14.472656 5.609375 13.9375 5.296875 C 13.761719 5.195312 13.582031 5.089844 13.40625 4.988281 C 12.996094 4.746094 12.585938 4.507812 12.167969 4.273438 C 10.847656 3.527344 10.847656 3.527344 10.433594 2.957031 C 10.433594 2.898438 10.433594 2.839844 10.433594 2.78125 Z M 10.433594 2.78125 "/>\n<path style=" stroke:none;fill-rule:nonzero;fill:rgb(95.686275%,96.078432%,96.470588%);fill-opacity:1;" d="M 7.566406 5.304688 C 7.878906 5.410156 7.90625 5.480469 8.058594 5.761719 C 8.117188 5.859375 8.117188 5.859375 8.175781 5.964844 C 8.269531 6.195312 8.277344 6.363281 8.261719 6.609375 C 8.355469 6.550781 8.449219 6.492188 8.550781 6.433594 C 8.777344 6.296875 8.855469 6.261719 9.128906 6.261719 C 9.136719 6.425781 9.140625 6.589844 9.148438 6.753906 C 9.152344 6.894531 9.152344 6.894531 9.15625 7.035156 C 9.125 7.34375 9.058594 7.492188 8.871094 7.738281 C 8.703125 7.871094 8.703125 7.871094 8.527344 7.972656 C 8.46875 8.007812 8.410156 8.042969 8.351562 8.078125 C 8.292969 8.109375 8.234375 8.140625 8.175781 8.175781 C 8.113281 8.207031 8.054688 8.238281 7.996094 8.273438 C 7.710938 8.398438 7.511719 8.335938 7.21875 8.261719 C 6.832031 8.070312 6.476562 7.859375 6.261719 7.476562 C 6.167969 7.203125 6.164062 7.007812 6.167969 6.722656 C 6.167969 6.636719 6.171875 6.550781 6.171875 6.460938 C 6.171875 6.394531 6.171875 6.328125 6.175781 6.261719 C 6.492188 6.332031 6.753906 6.457031 7.042969 6.609375 C 7.050781 6.480469 7.050781 6.480469 7.058594 6.347656 C 7.113281 5.9375 7.332031 5.636719 7.566406 5.304688 Z M 7.566406 5.304688 "/>\n<path style=" stroke:none;fill-rule:nonzero;fill:rgb(5.882353%,8.235294%,15.294118%);fill-opacity:1;" d="M 15.652344 6.433594 C 15.679688 6.433594 15.710938 6.433594 15.738281 6.433594 C 15.746094 6.988281 15.75 7.539062 15.753906 8.09375 C 15.753906 8.28125 15.757812 8.46875 15.757812 8.65625 C 15.761719 8.925781 15.761719 9.195312 15.765625 9.464844 C 15.765625 9.550781 15.765625 9.636719 15.769531 9.722656 C 15.769531 9.800781 15.769531 9.878906 15.769531 9.960938 C 15.769531 10.027344 15.769531 10.097656 15.769531 10.167969 C 15.730469 10.398438 15.664062 10.472656 15.476562 10.609375 C 15.15625 10.625 15.15625 10.625 14.871094 10.609375 C 14.867188 10.675781 14.859375 10.742188 14.855469 10.808594 C 14.816406 11.367188 14.746094 11.890625 14.609375 12.433594 C 14.3125 12.535156 14.105469 12.507812 13.804688 12.441406 C 13.726562 12.421875 13.648438 12.40625 13.570312 12.390625 C 13.480469 12.367188 13.480469 12.367188 13.390625 12.347656 C 13.449219 12.027344 13.535156 11.730469 13.644531 11.425781 C 13.679688 11.332031 13.710938 11.238281 13.746094 11.144531 C 13.78125 11.046875 13.816406 10.953125 13.851562 10.851562 C 13.902344 10.710938 13.902344 10.710938 13.957031 10.566406 C 14.054688 10.289062 14.160156 10.015625 14.261719 9.738281 C 14.292969 9.65625 14.320312 9.574219 14.351562 9.488281 C 14.613281 8.792969 14.613281 8.792969 14.929688 8.523438 C 15.359375 8.140625 15.347656 7.753906 15.40625 7.203125 C 15.441406 6.886719 15.472656 6.707031 15.652344 6.433594 Z M 15.652344 6.433594 "/>\n<path style=" stroke:none;fill-rule:nonzero;fill:rgb(13.725491%,18.431373%,37.254903%);fill-opacity:1;" d="M 13.566406 9.824219 C 13.609375 9.914062 13.609375 9.914062 13.652344 10 C 13.539062 10.21875 13.417969 10.425781 13.289062 10.636719 C 13.207031 10.769531 13.125 10.90625 13.046875 11.039062 C 13.003906 11.109375 12.960938 11.183594 12.914062 11.253906 C 12.691406 11.632812 12.46875 12.015625 12.25 12.398438 C 12.207031 12.472656 12.160156 12.550781 12.117188 12.628906 C 11.8125 13.160156 11.53125 13.703125 11.269531 14.253906 C 11.113281 14.582031 10.933594 14.855469 10.695312 15.128906 C 10.3125 15.078125 10.042969 14.933594 9.710938 14.734375 C 9.574219 14.648438 9.574219 14.648438 9.429688 14.566406 C 9.359375 14.523438 9.289062 14.480469 9.21875 14.433594 C 9.253906 14.046875 9.523438 13.835938 9.789062 13.582031 C 9.832031 13.539062 9.875 13.496094 9.921875 13.449219 C 10.15625 13.21875 10.402344 12.996094 10.65625 12.78125 C 11.15625 12.34375 11.621094 11.871094 12.089844 11.398438 C 12.25 11.238281 12.414062 11.078125 12.574219 10.914062 C 12.679688 10.8125 12.78125 10.707031 12.886719 10.605469 C 12.933594 10.554688 12.980469 10.507812 13.03125 10.457031 C 13.234375 10.253906 13.40625 10.066406 13.566406 9.824219 Z M 13.566406 9.824219 "/>\n<path style=" stroke:none;fill-rule:nonzero;fill:rgb(95.294118%,95.686275%,96.078432%);fill-opacity:1;" d="M 6.175781 10.347656 C 6.503906 10.464844 6.769531 10.617188 7.054688 10.820312 C 7.128906 10.871094 7.203125 10.925781 7.277344 10.976562 C 7.445312 11.105469 7.59375 11.234375 7.738281 11.390625 C 7.769531 11.316406 7.769531 11.316406 7.800781 11.238281 C 7.941406 10.992188 8.105469 10.882812 8.335938 10.722656 C 8.410156 10.671875 8.488281 10.617188 8.566406 10.5625 C 8.761719 10.449219 8.90625 10.386719 9.128906 10.347656 C 9.21875 11.453125 9.21875 11.453125 8.914062 11.832031 C 8.617188 12.113281 8.285156 12.273438 7.914062 12.433594 C 7.882812 12.921875 7.855469 13.410156 7.824219 13.914062 C 7.683594 13.914062 7.539062 13.914062 7.390625 13.914062 C 7.390625 13.398438 7.390625 12.878906 7.390625 12.347656 C 7.246094 12.320312 7.105469 12.289062 6.957031 12.261719 C 6.5625 12.078125 6.359375 11.875 6.175781 11.476562 C 6.144531 11.097656 6.152344 10.726562 6.175781 10.347656 Z M 6.175781 10.347656 "/>\n<path style=" stroke:none;fill-rule:nonzero;fill:rgb(8.235294%,11.764706%,23.137255%);fill-opacity:1;" d="M 14.433594 9.042969 C 14.523438 9.21875 14.523438 9.21875 14.484375 9.378906 C 14.460938 9.445312 14.4375 9.507812 14.414062 9.574219 C 14.386719 9.648438 14.359375 9.71875 14.335938 9.792969 C 14.308594 9.871094 14.277344 9.949219 14.25 10.027344 C 14.222656 10.105469 14.195312 10.183594 14.164062 10.265625 C 14.007812 10.703125 13.84375 11.132812 13.675781 11.566406 C 13.503906 11.996094 13.386719 12.429688 13.285156 12.878906 C 13.179688 13.269531 13.03125 13.632812 12.871094 14 C 12.378906 13.96875 12 13.910156 11.566406 13.652344 C 11.703125 13.144531 11.960938 12.71875 12.222656 12.265625 C 12.269531 12.1875 12.316406 12.105469 12.363281 12.023438 C 12.460938 11.859375 12.554688 11.695312 12.648438 11.53125 C 12.765625 11.332031 12.882812 11.128906 12.996094 10.925781 C 13.402344 10.222656 13.859375 9.621094 14.433594 9.042969 Z M 14.433594 9.042969 "/>\n<path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 10.433594 2.78125 C 11.101562 2.777344 11.765625 2.773438 12.433594 2.769531 C 12.742188 2.769531 13.050781 2.765625 13.359375 2.761719 C 13.714844 2.757812 14.070312 2.757812 14.425781 2.757812 C 14.539062 2.753906 14.648438 2.753906 14.761719 2.753906 C 14.867188 2.753906 14.96875 2.753906 15.074219 2.753906 C 15.210938 2.753906 15.210938 2.753906 15.347656 2.75 C 15.421875 2.761719 15.492188 2.773438 15.566406 2.78125 C 15.761719 3.082031 15.757812 3.191406 15.75 3.539062 C 15.75 3.625 15.746094 3.710938 15.746094 3.800781 C 15.742188 3.867188 15.742188 3.933594 15.738281 4 C 14.917969 3.957031 14.128906 3.839844 13.324219 3.6875 C 13.066406 3.640625 12.808594 3.59375 12.546875 3.550781 C 12.363281 3.515625 12.175781 3.484375 11.992188 3.449219 C 11.78125 3.414062 11.566406 3.378906 11.355469 3.34375 C 11.226562 3.324219 11.226562 3.324219 11.097656 3.304688 C 11.027344 3.292969 10.953125 3.28125 10.878906 3.273438 C 10.664062 3.207031 10.570312 3.132812 10.433594 2.957031 C 10.433594 2.898438 10.433594 2.839844 10.433594 2.78125 Z M 10.433594 2.78125 "/>\n<path style=" stroke:none;fill-rule:nonzero;fill:rgb(95.686275%,96.078432%,96.470588%);fill-opacity:1;" d="M 9.128906 8.261719 C 9.183594 9.257812 9.183594 9.257812 9.011719 9.695312 C 8.605469 10.082031 8.152344 10.3125 7.597656 10.398438 C 7.09375 10.3125 6.6875 10.128906 6.347656 9.738281 C 6.074219 9.320312 6.136719 8.828125 6.175781 8.347656 C 6.539062 8.394531 6.765625 8.519531 7.066406 8.734375 C 7.140625 8.789062 7.214844 8.839844 7.292969 8.894531 C 7.476562 9.042969 7.476562 9.042969 7.566406 9.21875 C 7.621094 9.21875 7.679688 9.21875 7.738281 9.21875 C 7.835938 9.117188 7.933594 9.015625 8.03125 8.914062 C 8.738281 8.261719 8.738281 8.261719 9.128906 8.261719 Z M 9.128906 8.261719 "/>\n<path style=" stroke:none;fill-rule:nonzero;fill:rgb(7.843138%,11.372549%,22.745098%);fill-opacity:1;" d="M 11.042969 3.476562 C 11.648438 3.675781 12.246094 3.886719 12.84375 4.101562 C 12.984375 4.152344 12.984375 4.152344 13.125 4.207031 C 14.054688 4.542969 14.984375 4.878906 15.914062 5.21875 C 15.867188 5.597656 15.816406 5.972656 15.738281 6.347656 C 15.675781 6.3125 15.613281 6.273438 15.546875 6.234375 C 15.011719 5.921875 14.472656 5.609375 13.9375 5.296875 C 13.667969 5.140625 13.402344 4.984375 13.132812 4.828125 C 12.804688 4.636719 12.476562 4.445312 12.148438 4.253906 C 12.011719 4.179688 11.878906 4.101562 11.746094 4.023438 C 11.683594 3.988281 11.621094 3.949219 11.558594 3.914062 C 11.140625 3.671875 11.140625 3.671875 11.042969 3.476562 Z M 11.042969 3.476562 "/>\n<path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0.392157%);fill-opacity:1;" d="M 15.652344 6.433594 C 15.679688 6.433594 15.710938 6.433594 15.738281 6.433594 C 15.746094 6.988281 15.75 7.539062 15.753906 8.09375 C 15.753906 8.28125 15.757812 8.46875 15.757812 8.65625 C 15.761719 8.925781 15.761719 9.195312 15.765625 9.464844 C 15.765625 9.550781 15.765625 9.636719 15.769531 9.722656 C 15.769531 9.839844 15.769531 9.839844 15.769531 9.960938 C 15.769531 10.027344 15.769531 10.097656 15.769531 10.167969 C 15.730469 10.394531 15.664062 10.472656 15.476562 10.609375 C 15.199219 10.625 15.199219 10.625 14.957031 10.609375 C 14.875 10.285156 14.871094 10.046875 14.933594 9.71875 C 14.949219 9.636719 14.964844 9.550781 14.980469 9.464844 C 15 9.378906 15.015625 9.289062 15.03125 9.199219 C 15.050781 9.113281 15.066406 9.027344 15.082031 8.933594 C 15.203125 8.289062 15.203125 8.289062 15.304688 8.085938 C 15.34375 7.792969 15.375 7.5 15.40625 7.203125 C 15.441406 6.886719 15.472656 6.707031 15.652344 6.433594 Z M 15.652344 6.433594 "/>\n<path style=" stroke:none;fill-rule:nonzero;fill:rgb(86.274511%,87.450981%,89.019608%);fill-opacity:1;" d="M 8.609375 3.390625 C 8.78125 3.390625 8.953125 3.390625 9.128906 3.390625 C 9.128906 4.109375 9.128906 4.824219 9.128906 5.566406 C 8.988281 5.59375 8.84375 5.621094 8.695312 5.652344 C 8.609375 5.566406 8.609375 5.566406 8.597656 5.355469 C 8.597656 5.265625 8.601562 5.175781 8.601562 5.082031 C 8.601562 4.984375 8.601562 4.886719 8.601562 4.785156 C 8.601562 4.683594 8.601562 4.578125 8.601562 4.472656 C 8.605469 4.371094 8.605469 4.265625 8.605469 4.160156 C 8.605469 3.902344 8.605469 3.648438 8.609375 3.390625 Z M 8.609375 3.390625 "/>\n<path style=" stroke:none;fill-rule:nonzero;fill:rgb(93.725491%,94.117647%,94.509804%);fill-opacity:1;" d="M 6.175781 3.390625 C 6.316406 3.390625 6.460938 3.390625 6.609375 3.390625 C 6.609375 4.136719 6.609375 4.882812 6.609375 5.652344 C 6.464844 5.625 6.320312 5.59375 6.175781 5.566406 C 6.175781 4.847656 6.175781 4.128906 6.175781 3.390625 Z M 6.175781 3.390625 "/>\n<path style=" stroke:none;fill-rule:nonzero;fill:rgb(93.333334%,93.725491%,94.117647%);fill-opacity:1;" d="M 7.476562 2.433594 C 7.59375 2.433594 7.707031 2.433594 7.824219 2.433594 C 7.824219 3.179688 7.824219 3.925781 7.824219 4.695312 C 7.683594 4.695312 7.539062 4.695312 7.390625 4.695312 C 7.390625 4.335938 7.386719 3.976562 7.386719 3.613281 C 7.386719 3.511719 7.382812 3.410156 7.382812 3.300781 C 7.382812 3.203125 7.382812 3.105469 7.382812 3.003906 C 7.382812 2.914062 7.382812 2.824219 7.382812 2.730469 C 7.390625 2.523438 7.390625 2.523438 7.476562 2.433594 Z M 7.476562 2.433594 "/>\n<path style=" stroke:none;fill-rule:nonzero;fill:rgb(5.490196%,7.843138%,14.901961%);fill-opacity:1;" d="M 15.390625 6.871094 C 15.511719 7.203125 15.449219 7.484375 15.390625 7.824219 C 15.304688 7.769531 15.21875 7.710938 15.128906 7.652344 C 15.171875 7.328125 15.207031 7.148438 15.390625 6.871094 Z M 15.390625 6.871094 "/>\n</g>\n</svg>\n';
  var Web = '<svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16">\n\t<title>favicon</title>\n\t<defs>\n\t\t<image  width="256" height="256" id="img1" href="data:image/png;base64,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"/>\n\t</defs>\n\t<style>\n\t</style>\n\t<use id="Background" href="#img1" x="0" y="0"/>\n</svg>\n';
  var Discord$1 = '<svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16">\n\t<title>favicon</title>\n\t<defs>\n\t\t<image  width="256" height="256" id="img1" href="data:image/png;base64,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"/>\n\t</defs>\n\t<style>\n\t</style>\n\t<use id="Background" href="#img1" x="0" y="0"/>\n</svg>\n';
  var Twitch$1 = '<svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16">\n\t<title>favicon-32-e29e246c157142c94346</title>\n\t<defs>\n\t\t<image  width="28" height="32" id="img1" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAgBAMAAADzmwVxAAAAAXNSR0IB2cksfwAAACdQTFRFAAAAk0b/kUb/////wZf/yKP/j0b/j0X/j0b/kUb/j0D/kUb/j0j/8nvBLQAAAA10Uk5TAH//////gJCgzxDfIMV/78EAAACZSURBVHicY2RgYFRkgANGBgYhAWQuUFIQxnvPCJJE4oJ0InFBOpG4Sgxg7ntBMKI9F81ebFzGdyhc+SvIXKa3dshc+as3kbhMb+MawFygANNbBga2GwwwrvwFBoaKNBhXGCjJXp4A4xoAJWe4McC4QMA51QGZO8sFEuwMDEoQKQS3KoUBiQsyFIkb18CAxFW/yYDMTVgA4wIAtrc0x9ZZthYAAAAASUVORK5CYII="/>\n\t</defs>\n\t<style>\n\t</style>\n\t<use id="Background" href="#img1" x="2" y="0"/>\n</svg>\n';
  var Instagram = '<svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 76" width="16" height="16">\n\t<title>lam-fZmwmvn</title>\n\t<defs>\n\t\t<image  width="76" height="76" id="img1" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAABMCAMAAADwSaEZAAAAAXNSR0IB2cksfwAAAvdQTFRFR3BM1TeUehf6exj7gBn8bxf9bxX9eA32hAnukgXlngTjqATisAPguQLewAThxAHdygLd0AHazwDU3gDA3gDB7ROe1gDY3wDI2gDHYBlFeBf9cxn8gRf9ihf9kQvx3ADW6AC/kRf9oQzxrw3v4wDX5gDO7AC0uAnomRf86wDV8ADG8QPR8wC69AqfoBf8qBf74BTc6xTW8wCr9xOVvzT24WHu3oP39qzy9sr5+N78/ej6/t31+Xrj+lbX9xvS9wnJ//7+//////n69QCesRn7/gLD/gG+/gGy/8vq/ivO/gG5//X7/QKq9wea6k3l+zrS+yq8/gCj+ACPuhr6/gq3/gCc7xbO/A/BxRr4/RO4/gCW/VDD/2nM/gCQ0hzz/7Pe/gGJ/gmw/UG4+h2r/gGC3Bru6Bvd/QJ79BrD/hOt/pDO5Rro/hKk9xu2/gJ08Brf+x6g/hKY/S+j/QJt/SCW/hOQ/SKQ/m+3/haH/SKI/lul/+vw/QBn/EOT/h2B/hV8/iF6/iR0/idu/uHk/i1//QFi/its/oar/T94/ixm/Spd/mON/lZw/snV/i5V/omZ/hNw/kNZ//r2/jNO/jtT/jNi/gBf/l1c/jpJ/nh//tfS/jlc/jFH/jND/khR/jk//T9D/hFn/ipM/kM6/js1/kZB/sS1/R1k/lA9/Us1/kEq/oN1/qmz/g5c/nNI/lEv/hZb/lg2/kgf/h5Z/lgq/lQX/l8m/mI4/iJS/mMY/oxO/mch/mcv/FEP/FwG/pdo/m0b/WUB/rd//mwC/nQY/nQn/m4s/nMC/qOJ/ndk/vHc/noV/noC/oQd/p0//oIS/nsi/unI/tuq/oIC/rA9/ooB/owT/vbn/pAE/pUP/pYB/pwI/p0A/qkf/tBr/GMY/XQD+3QI/qQC/qoC/td8+4QW/q8A/rsW/rQA/rgA/rsA/r4A/YUD/SGH/sEA/JUF/sUA/JIG/skA/DJm/JgH/asD/s0A/EFI+68J/bcE+1E0+0w6/L0Fi9deiwAAAP10Uk5TAA5AcL3X////////////////5a9+QP//zwL/nP////////////////7/////xP//////df/////////////////////////////////l/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+XBcP///z/////////V1f+M/6v/oavV/9VwwMFw5VUJIaQAAAukSURBVHicbZhbbBxXGYD/f2Zn9uZL7NiNL4nTFLnUqZpKlaqKRCBIgApIWhKE1PahPKAiRFNaCdSqL4U+0odKlUorQXkAoSCQQLRqSwlKpIKaFAJNlFtDTdzarr221/a63uvc+S9nZ9eB8Xr27Myc7/zXc/4zCOmBcph2wg35kZ7wxg9Kl9WkQ0gbltVp/y8q/Qik3XZYhHAt2QIbhWU7RQ3B2va1/y8QYEpUko4aZUqjAKVRReBYOSUBrA3D6nD5JmqVsSMJWLAFBJCHJuZa3IrWktHSaAm7WEOCoz4oJFjtkCzoVk1AdLQURe3qetIeilkpiS9lIshwawlTUofDnZ2A/tQUm/lmHty19ZES/x61ykpKx7cjRi2PLI8vqs9Svdq81EtAVDq7sO4wbHR5pBtFmCz4plViEDJhC4cFo3MozYawACplcgBmhg1pC4qaJbrKpDZIEe0jJILERKOnxrDsZRLV3mGlQZIhlAtYS1G7u+JHjpaVNhPU+Gr08PA9gP9CtEduQEENBiQXcAumjY0gcRDXYGhVaAz3XRYtuIzWmLGkaMgsx7Jy3CvR0w2sBKwYIWllNGHWYqH10GngItpjDApZKkENb9pZxhOqm4byW12olwK0XSiNLQKMc5QOAGxgZpfcMihwMjkjqbELSHc0jS2XchixQtGCoa3gbfKEq0oMbzg5MELxx8rfYLNmDGmEJej3IcyNQ3kMFkkwKOC+jj2GYcPJ8qMJeLEzKNb3b6BxeCZBxtEe/rAfcdws7t6k3/14pz7DsQb9C2L5wuqOOUAOgiEjcjsK0qOwNNRg+bI9VY5BBzYHiYpfTB/oh/kCs7wggFpv644rjBpc7zJgt1ebkcteCosO0zYH1/vp8jfaDzjBLBksQW9ojh/2KV/dwQpIzGjmqKGMHzJOOUtm9SeqDj/iAE0g+ABnqibKTJHGLq5Q4mLr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"/>\n\t</defs>\n\t<style>\n\t</style>\n\t<use id="Background" href="#img1" x="0" y="0"/>\n</svg>';
  var Twitter$1 = '<svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="16" height="16">\n\t<title>icon-ios</title>\n\t<defs>\n\t\t<image  width="1024" height="1024" id="img1" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAQACAMAAABIw9uxAAAAAXNSR0IB2cksfwAAAwBQTFRFAAAABAQEFxcXGBgYDAwMERERCgoKfn5+wMDAv7+/k5OTFhYWKioqp6enq6urJycnPDw83Nzc////+/v7f39/BwcHKSkpu7u78vLyc3NzXl5e7+/v6+vrU1NTExMTra2t9/f3e3t7BgYGCQkJiIiI+fn50tLSLy8vDw8Pjo6O/f39mJiYrq6ur6+vGRkZCAgIh4eH/v7+Gxsb1NTUhISEAQEBZGRk8PDwvLy8ICAgVVVV6enp7OzsVlZWAwMDWFhY4+Pj0NDQODg4AgIC1tbWNTU1QkJC4eHh2NjYPz8/pKSktLS0Li4uxcXFy8vL+vr6wsLC7u7ubW1tBQUFSEhI5eXl8/PzfHx89vb2Nzc3EhISkpKS/Pz8nZ2dEBAQDQ0NuLi4hYWFIyMjwcHBi4uLYmJi7e3tvr6+Q0ND3d3dXFxczMzMZ2dn8fHx29vbOzs72traQEBAj4+Pvb29Hh4eMjIyx8fHHR0dt7e3JiYmaGhoNjY2oaGh39/fmZmZpqamFRUVrKysl5eXZmZmw8PDJCQkMDAwz8/Pa2tr6urqycnJMzMzUFBQ4uLifX19+Pj4xMTE5+fnFBQUo6OjnJycISEhb29vR0dH5OTkRUVFmpqalJSUcHBw9fX1xsbGJSUleHh4Dg4ObGxsKCgodHR0QUFB5ubmPj4+1dXV4ODgGhoaubm5eXl5hoaGOTk56Ojom5ubkZGRXV1dd3d3qKioUVFRysrKRkZGqqqqtra29PT0aWlpg4ODHBwcCwsLlpaWenp6sbGxcXFxT09Pzs7O19fXSkpK3t7e2dnZIiIijIyMgICAYGBgbm5u0dHRUlJScnJylZWVsLCwurq6Tk5OVFRU09PTNDQ0Ojo6KysrPT09Y2NjZWVlW1tbjY2NtbW1yMjIYWFhn5+fWlpadnZ2TU1Nzc3NpaWlLS0tgYGBV1dXoqKiWVlZS0tLdXV1s7OzHx8fgoKCoKCgkJCQREREX19fTExMSUlJqampMTExLCwsiYmJsrKyampqioqKnp6enA0qUQAAUvtJREFUeJzt3X1gjmX/P/DrZFt5aNTQ4reNzTC5Lasrj9tks7Kk1iwNbR5KMVHa8rDGPM00NzeNodCEydMippIVlqhMSTGR4ksSIk+F7HfXfd9luGzXcb2P6zyv83i//vne9/fb8TnOb+y96zrO4/gcmoWIlKXp/QBEpB8GAJHCGABECmMAECmMAUCkMAYAkcIYAEQKYwAQKYwBQKQwBgCRwhgARApjABApjAFApDAGAJHCGABECmMAECmMAUCkMAYAkcIYAEQKYwAQKYwBQKQwBgCRwhgARApjABApjAFApDAGAJHCGABECmMAECmMAUCkMAYAkcIYAEQKYwAQKYwBQKQwBgCRwhgARApjABApjAFApDAGAJHCGABECmMAECmMAUCkMAYAkcIYAEQKYwAQKYwBQKQwBgCRwhgARApjABApjAFApDAGAJHCGABECmMAECmMAUCkMAYAkcIYAEQKYwAQKYwBQKQwBgCRwhgARApjABApjAFApDAGAJHCGABECmMAECmMAUCkMAYAkcIYAEQKYwAQKYwBQKQwBgCRwhgARApjABApjAFApDAGAJHCGABECmMAECmMAUCkMAYAkcIYAEQKYwAQKYwBQKQwBgCRwhgARApjABApjAFApDAGAJHCGABECmMAECmMAUCkMAYAkcIYAEQKYwAQKYwBQKQwBgCRwhgARApjABApjAFApDAGAJHCGABECmMAECmMAUCkMAYAkcIYAEQKYwAQKYwBQKQwBgCRwhgARApjABApjAFApDAGAJHCGABECmMAECmMAUCkMAYAkcIYAEQKYwAQKYwBQKQwBgCRwhgARApjABApjAFApDAGAJHCGABECmMAECmMAUCkMAYAkcIYAEQKYwAQKYwBQKQwBgCRwhgARApjABApjAFApDAGAJHCGABECmMAECmMAUCkMAYAkcIYAEQKYwAQKYwBQKQwBgCRwhgARApjABApjAFApDAGAJHCGABECmMAECmMAUCkMAYAkcIYAEQKYwAQKYwBQKQwBgCRwhgARApjABApjAFApDAGAJHCGABECmMAECmMAUCkMAYAkcIYAEQKYwAQKYwBQKQwBgCRwhgARApjABApjAFApDAGAJHCGABECmMAECmMAUCkMAYAkcIYAEQKYwAQKYwBQKQwBgCRwhgARApjABApjAFApDAGAJHCGABECmMAECmMAUCkMAYAkcIYAEQKYwAQKYwBQKQwBgCRwhgARApjABApjAFApDAGAJHCGABECmMAECmMAUCkMAYAkcIYAEQKYwAQKYwB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ABApjAFApDAGAJHCGABECmMAECmMAUCkMAYAkcIYAEQKYwAQKYwBQKQwBgCRwhgARApjABApjAFApDAGAJHCGABECmMAECmMAUCkMAYAkcIYAEQKYwAQKYwBQKQwBgCRwhgARApjABApjAFApDAGAJHCGABECmMAECmMAUCkMAYAkcIYAEQKYwAQKYwBQKQwBgCRwhgARApjABApjAFApDAGAJHCGABECmMAECmMAUCkMAYAkcIYAEQKYwAQKYwBQKQwBgCRwhgARApjABApjAFApDAGAJHCGABECmMAECmMAUCkMAYAkcIYAEQKYwAQKYwBQKQwBgCRwhgARApjABApjAFApDAGAJHCGABECmMAECmMAUCkMAYAkcIYAEQKYwAQKYwBQKQwBgCRwhgARApjABApjAFApDAGAJHCGABECmMAECmMAUCkMAYAkcIYAEQKYwAQKYwBQKQwBgCRwhgARApjABApjAFApDAGAJHCGABECmMAECmMAUCkMAYAkcIYAEQKYwAQKYwBQKQwBgCRwhgARApjABApjAFApDAGAJHCGABECmMAECmMAUCkMAYAkcIYAEQKYwAQKYwBQKQwBgCRwhgARApjABApjAFApDAGAJHC/j9GYmsPmw8LugAAAABJRU5ErkJggg=="/>\n\t</defs>\n\t<style>\n\t</style>\n\t<use id="Background" href="#img1" x="0" y="0"/>\n</svg>\n';
  var Reddit$1 = '<svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" width="16" height="16">\n\t<title>192x192</title>\n\t<defs>\n\t\t<image  width="192" height="192" id="img1" href="data:image/png;base64,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"/>\n\t</defs>\n\t<style>\n\t</style>\n\t<use id="Background" href="#img1" x="0" y="0"/>\n</svg>';
  var Youtube$1 = '<svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="16" height="16">\n\t<title>favicon_48x48</title>\n\t<defs>\n\t\t<image  width="48" height="48" id="img1" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAAXNSR0IB2cksfwAAARRQTFRF////AAAA/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/xBA/wAz/56x/5uv/xZF/wAz/wAz/6Cz/////+/y/26L/wQ2/wAz/wAz/9Pc/0Bm/6m6/x1K/wAz//X3/3uV/wg5/wAz/93k/01x/7fF/yVR/yZR/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAz/wAzgb8Y2wAAAFx0Uk5TAAAJNFp0i52ptMDQ3ODl8Pj/99uoWS+z+zD6uxL+DEhAcm2Vkav/v////7zU///////T6P/////0////8///////8ufSlEEUDVe1/bkyOF13jKC2wd3mqp92XDdJ2BKpAAABRElEQVR4nO2VwUtCQRDG53vV0/DwEhNDXoREdCjC0CK6Rlj9vYHdg04SiSAUEUFE8gwJi0roNb0tHwS7Gzu3iOawh5nvt+zOzs6AhIZ/wAXA1/rdxl7ERMz+K3PukXlmwJwCRWDksHeGvd4nMDv14nic6ShOAK/kqk+Itz5QfnbWE/kRQjwJgIyPhaFATxSg8iAC8lgciIAClu41Z7FvByawHGnOEnBnA8pYvdWcoaqPazNQQe3KACQJx6URiBF4RoAoiwsD8I6tcwtAOaCrxVaQ13cJ008SoKMFfwTUO7WFgHcmAYxHEl56XZ7WnVMjYH84YWnU5MUnLu/dlj1qsIL8iwqbwAYaXVGbqcobGeYgbJW015Y14yTvdZw4yLeBw3SgzFdVNXTW0Dw42myNvWqANJrM+zyJURY4vlHS3zgU/wDwAXpXWYPo2LOhAAAAAElFTkSuQmCC"/>\n\t</defs>\n\t<style>\n\t</style>\n\t<use id="Background" href="#img1" x="0" y="0"/>\n</svg>';
  var Vk$1 = '<svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16">\n\t<title>fav_logo</title>\n\t<defs>\n\t\t<image  width="256" height="256" id="img1" href="data:image/png;base64,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"/>\n\t</defs>\n\t<style>\n\t</style>\n\t<use id="Background" href="#img1" x="0" y="0"/>\n</svg>';
  var AutoTask = '<svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16">\n\t<title>favicon</title>\n\t<defs>\n\t\t<image  width="32" height="32" id="img1" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAAXNSR0IB2cksfwAAAgdQTFRFPHjYPnnYUIXbR3/ZUofbaJbgZpTfSIDaPXjYUYfbapfhbJnhZ5XgRn7ZP3rYU4jca5jhbZriaZfgR3/aVIncapjhZZTgRn/aVIjcbpvicp3iZ5bgQXvZVYncjrHorsfutMvvvtLyj7HoVorcdqDj0+H26/H7/v7+////1eH2apfgYpLfm7nq8fX87fP71uL2vNDxnLrq7fL7/v7/7PL7faXkWIvdRH3ZfqXk7vP7/f3+1+P2k7TpkbPpnLrrY5PfRn/ZPXnYXo/eu9DweqPkeKHjtMvwdaDjRX7ZQXvYWYzd1OL2dJ/jaJfgeKHk1eL2bpriWozdkLLoaZfhbZrhdZ/i7PH7WozeeKLk8/b8nbvrr8fvQHrYb5vitszwuM7wapjgfKTkz971/P3+9/n9mrnqtczwuM3wZpXgcp7jwdTyl7fqeaLkvtLxxtfzc53i1OH2+vz+t83wkrPoxNbzdJ7jZpTgjbDo6fD62uX39Pf8rsfvkbPoT4TaYZLfr8fuc57jcJviQnzYja/n+vv+rcbucZziYJHfXpDeqsTtkrPpQnzZd6Dj0+D21uP2UYbcYZHfdqHj8vb8q8Xussnv7/T7YpPfSoLaQHvYX5Dfnbrr0+D1h6vmYJHegajln7zrSYHZw9XzTIPaUIbbT4XbXY7ea5nhUofcW43dV4rdXI7dXI7eX5DeWOgbkgAAAmNJREFUeJx10l1IFFEUB/DzT/c6uTpb9CCIbYFBZVIhpuXLYD6oYCTSt9LXkgj7lL1kPVVbSSGbD5ZhUqD0AUKxrNqTK5KhRoo+WFgbZUHuw6Ls+jEz7jbdGbVYZ3deZuacH/ece+4FxTwAousisX9JXCiJgcDTfJFwIiDqeb1MMD4Q0hDR36oVgXgAGTJ4EdJkdRN+mYFokyPpeg1NS5pNmTGD7JANKz1wgUkz2AMss9UVdInhdeCgHvTLerM7QlY5Dej/D4oHpOHdbCM+ruJ8zIczx/LeroFyvEeRP2Ur+pixzdQc2xdtJz5EAisAlT4UT/+xjpYNzemiBD1sc/5X66gxD5BY7iUmCrtGZHXbjMLUI+P70SsUfM7vUVUhTKiZmgJVYKTQw9sr9Sgn9Ga76PiAtOilk08VFPA8nUJfyXOq5qmOs2ERniBd7K7AE1KdTZAmaA3U4g0qX1fhIY84uwygXkVhaRNbK3FGeUdVFjRzYBOkzAeEOQl089V3RitNWq782A7cW2YkaXqTqUHJxxsQG1wsd2GD3Td/q7Ha3kiaZZGlC0LN3fkok41B3Y+4mF0pyxr0phmDslDZgbbagcFr9drqqOG+fgcvTzf/NiZJatHRsbyhQ7gs/zusVtS7W4UCz5IekiYahiYd/Z0xp5l1o97dNrtXsX2jnMAnONNdftOVEyqWfy4YF8YaXVi6fd4E+NK59ox9NB6Y3tLdXiubQUcdn1g2+b2U7K4xXzn+2Qmn8XH42AU5HqDycw59ny1Jl0IUFxBe1IFakh/5KAEgZAXxzBGihIDEx5b23pjIX32q0uJJAW9GAAAAAElFTkSuQmCC"/>\n\t</defs>\n\t<style>\n\t</style>\n\t<use id="Background" href="#img1" x="0" y="0"/>\n</svg>';
  const ICONS = {
    '[ASF]': ASF,
    '[Web]': Web,
    '[Discord]': Discord$1,
    '[Twitch]': Twitch$1,
    '[Instagram]': Instagram,
    '[Twitter]': Twitter$1,
    '[Reddit]': Reddit$1,
    '[Youtube]': Youtube$1,
    '[Vk]': Vk$1,
    '[AutoTask]': AutoTask
  };
  const generateLink = (url, text) => `<a href="${url}" target="_blank">${text}</a>`;
  const createBaseElement = content => $(`<li>${content}<font class="log-status"></font></li>`).addClass('card-text');
  const createPlatformElement = (type, text, id) => {
    const urlGenerators = {
      group: text => `https://steamcommunity.com/groups/${text}`,
      officialGroup: text => `https://steamcommunity.com/games/${text}`,
      forum: text => `https://steamcommunity.com/app/${text}/discussions/`,
      curator: text => `https://store.steampowered.com/${text?.includes('/') ? text : `curator/${text}`}`,
      app: text => `https://store.steampowered.com/app/${text}`,
      sub: text => `https://steamdb.info/sub/${text}/`,
      workshop: text => `https://steamcommunity.com/sharedfiles/filedetails/?id=${text}`,
      announcement: (text, id) => `https://store.steampowered.com/news/app/${text}/view/${id}`,
      discord: {
        invite: text => `https://discord.com/invite/${text}`,
        server: text => `https://discord.com/channels/@me/${text}`
      },
      twitch: text => `https://www.twitch.tv/${text}`,
      instagram: text => `https://www.instagram.com/${text}/`,
      twitter: text => `https://x.com/${text}`,
      reddit: {
        subreddit: text => `https://www.reddit.com/r/${text}/`,
        user: text => `https://www.reddit.com/user/${text?.replace('u_', '')}`
      },
      youtube: {
        channel: text => `https://www.youtube.com/channel/${text}`,
        video: text => `https://www.youtube.com/watch?v=${text}`
      },
      vk: text => `https://vk.com/${text}/`
    };
    const typeMap = {
      joiningSteamGroup: [ 'group' ],
      leavingSteamGroup: [ 'group' ],
      gettingSteamGroupId: [ 'group' ],
      joiningSteamOfficialGroup: [ 'officialGroup' ],
      leavingSteamOfficialGroup: [ 'officialGroup' ],
      gettingSteamOfficialGroupId: [ 'officialGroup' ],
      subscribingForum: [ 'forum' ],
      unsubscribingForum: [ 'forum' ],
      gettingForumId: [ 'forum' ],
      followingCurator: [ 'curator' ],
      unfollowingCurator: [ 'curator' ],
      gettingCuratorId: [ 'curator' ],
      addingToWishlist: [ 'app' ],
      removingFromWishlist: [ 'app' ],
      followingGame: [ 'app' ],
      unfollowingGame: [ 'app' ],
      gettingSubid: [ 'app' ],
      addingFreeLicense: [ 'app', 'sub' ],
      requestingPlayTestAccess: [ 'app' ],
      gettingDemoAppid: [ 'app' ],
      favoritingWorkshop: [ 'workshop' ],
      unfavoritingWorkshop: [ 'workshop' ],
      gettingWorkshopAppId: [ 'workshop' ],
      votingUpWorkshop: [ 'workshop' ],
      gettingAnnouncementParams: [ 'announcement' ],
      likingAnnouncement: [ 'announcement' ],
      joiningDiscordServer: [ 'discord', 'invite' ],
      gettingDiscordGuild: [ 'discord', 'invite' ],
      gettingDiscordXContextProperties: [ 'discord', 'invite' ],
      leavingDiscordServer: [ 'discord', 'server' ],
      followingTwitchChannel: [ 'twitch' ],
      unfollowingTwitchChannel: [ 'twitch' ],
      gettingTwitchChannelId: [ 'twitch' ],
      gettingInsUserId: [ 'instagram' ],
      followingIns: [ 'instagram' ],
      unfollowingIns: [ 'instagram' ],
      gettingTwitterUserId: [ 'twitter' ],
      followingTwitterUser: [ 'twitter' ],
      unfollowingTwitterUser: [ 'twitter' ],
      joiningReddit: [ 'reddit', 'subreddit' ],
      leavingReddit: [ 'reddit', 'subreddit' ],
      followingRedditUser: [ 'reddit', 'user' ],
      unfollowingRedditUser: [ 'reddit', 'user' ],
      followingYtbChannel: [ 'youtube', 'channel' ],
      unfollowingYtbChannel: [ 'youtube', 'channel' ],
      likingYtbVideo: [ 'youtube', 'video' ],
      unlikingYtbVideo: [ 'youtube', 'video' ],
      gettingVkId: [ 'vk' ],
      joiningVkGroup: [ 'vk' ],
      leavingVkGroup: [ 'vk' ],
      joiningVkPublic: [ 'vk' ],
      leavingVkPublic: [ 'vk' ],
      sendingVkWall: [ 'vk' ],
      deletingVkWall: [ 'vk' ]
    };
    const urlConfig = typeMap[type];
    if (!urlConfig || !text) {
      return null;
    }
    const [platform, subType] = urlConfig;
    const urlGenerator = urlGenerators[platform];
    if (typeof urlGenerator === 'function') {
      const url = urlGenerator(text, id);
      const displayText = platform === 'announcement' ? id || '' : text;
      return createBaseElement(`${I18n(type)}[${generateLink(url, displayText)}]...`);
    }
    if (subType && typeof urlGenerator === 'object') {
      const subGenerator = urlGenerator[subType];
      if (typeof subGenerator === 'function') {
        const displayText = type.includes('RedditUser') ? text.replace('u_', '') : text;
        return createBaseElement(`${I18n(type)}[${generateLink(subGenerator(text), displayText)}]...`);
      }
    }
    return null;
  };
  const createSpecialElement = (type, text, html, id) => {
    switch (type) {
     case 'retweetting':
     case 'unretweetting':
      return createBaseElement(`${I18n(type)}${text}...`);

     case 'visitingLink':
      return createBaseElement(`${I18n('visitingLink')}[${generateLink(text || '', text || '')}]...`);

     case 'verifyingInsAuth':
     case 'text':
      return createBaseElement(I18n(text || ''));

     case 'html':
      return $(text || html || '');

     case 'whiteList':
      return $(`<li><font class="warning">${I18n('skipTask')}[${text}(${id})](${I18n('whiteList')})</font></li>`);

     case 'globalOptionsSkip':
      return $(`<li>${I18n('skipTaskOption')}<font class="warning">${text}</font></li>`);

     default:
      return createBaseElement(`${I18n('unKnown')}:${type}(${text})...`);
    }
  };
  const echoLog = _ref => {
    let {type: type, text: text, html: html, id: id, before: before} = _ref;
    const emptyStatus = {
      success: () => emptyStatus,
      error: () => emptyStatus,
      warning: () => emptyStatus,
      info: () => emptyStatus,
      view: () => emptyStatus,
      remove: () => emptyStatus
    };
    try {
      let ele;
      if (!type && !text && !html) {
        ele = createBaseElement('');
      } else if (text && !type) {
        ele = createBaseElement(text);
      } else if (html && !type) {
        ele = $(html);
      } else if (type) {
        const platformElement = createPlatformElement(type, text, id);
        ele = platformElement || createSpecialElement(type, text, html, id);
      } else {
        ele = createBaseElement('');
      }
      if (before) {
        if (before in ICONS) {
          const iconKey = before;
          const svgContent = ICONS[iconKey];
          const base64Svg = btoa(svgContent);
          ele.prepend(`<font class="before-icon" style="background-image: url('data:image/svg+xml;base64,${base64Svg}')"></font>`);
        } else {
          ele.prepend(`<font class="before">${before}</font>`);
        }
      } else {
        const base64Svg = btoa(ICONS['[AutoTask]']);
        ele.prepend(`<font class="before-icon" style="background-image: url('data:image/svg+xml;base64,${base64Svg}')"></font>`);
      }
      ele.addClass('card-text');
      $('#auto-task-info').append(ele);
      ele[0]?.scrollIntoView();
      const font = ele.find('font.log-status');
      const status = {
        font: font,
        success() {
          let text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Success';
          let html = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
          this.font?.attr('class', '').addClass('success');
          html ? this.font?.html(text) : this.font?.text(text);
          return this;
        },
        error() {
          let text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Error';
          let html = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
          this.font?.attr('class', '').addClass('error');
          html ? this.font?.html(text) : this.font?.text(text);
          return this;
        },
        warning() {
          let text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Warning';
          let html = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
          this.font?.attr('class', '').addClass('warning');
          html ? this.font?.html(text) : this.font?.text(text);
          return this;
        },
        info() {
          let text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Info';
          let html = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
          this.font?.attr('class', '').addClass('info');
          html ? this.font?.html(text) : this.font?.text(text);
          return this;
        },
        view() {
          this.font?.[0].scrollIntoView();
          return this;
        },
        remove() {
          this.font?.parent().remove();
          return this;
        }
      };
      return status;
    } catch (error) {
      throwError(error, 'echoLog');
      return emptyStatus;
    }
  };
  const unique = array => {
    try {
      return Array.from(new Set(array));
    } catch (error) {
      throwError(error, 'unique');
      return [];
    }
  };
  const delay = function() {
    let time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1e3;
    return new Promise((resolve => setTimeout((() => resolve(true)), time)));
  };
  const getRedirectLink = async function(link) {
    let redirectOnce = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    try {
      if (!link) {
        return null;
      }
      const redirectLinksCache = GM_getValue('redirectLinks') || {};
      const cachedLink = redirectLinksCache[link];
      if (cachedLink) {
        debug('使用缓存的重定向链接', {
          original: link,
          cached: cachedLink
        });
        return cachedLink;
      }
      const {data: data} = await httpRequest({
        url: link,
        method: 'GET',
        redirect: redirectOnce ? 'manual' : 'follow'
      });
      if (data?.finalUrl) {
        redirectLinksCache[link] = data.finalUrl;
        GM_setValue('redirectLinks', redirectLinksCache);
        debug('获取新的重定向链接', {
          original: link,
          final: data.finalUrl
        });
        return data.finalUrl;
      }
      debug('未找到重定向链接', {
        link: link
      });
      return null;
    } catch (error) {
      throwError(error, 'getRedirectLink');
      return null;
    }
  };
  const visitLink = async (link, options) => {
    try {
      debug('开始访问链接', {
        link: link,
        options: options
      });
      const logStatus = echoLog({
        type: 'visitLink',
        text: link
      });
      const {result: result, statusText: statusText, status: status} = await httpRequest({
        url: link,
        method: 'GET',
        ...options
      });
      if (result === 'Success') {
        debug('链接访问成功', {
          link: link
        });
        logStatus.success();
        return true;
      }
      debug('链接访问失败', {
        link: link,
        result: result,
        statusText: statusText,
        status: status
      });
      logStatus.error(`${result}:${statusText}(${status})`);
      return false;
    } catch (error) {
      throwError(error, 'visitLink');
      return false;
    }
  };
  const getUrlQuery = url => {
    try {
      debug('开始解析URL查询参数', {
        url: url || window.location.href
      });
      const searchParams = url ? new URL(url, window.location.origin).searchParams : new URLSearchParams(window.location.search);
      const query = {};
      for (const [key, value] of searchParams.entries()) {
        query[key] = value;
      }
      debug('URL查询参数解析结果', query);
      return query;
    } catch (error) {
      throwError(error, 'getUrlQuery');
      return {};
    }
  };
  const stringToColour = str => {
    try {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      const rgb = Array.from({
        length: 3
      }, ((_, i) => {
        const value = hash >> i * 8 & 255;
        return value.toString(16).padStart(2, '0');
      }));
      const color = `#${rgb.join('')}`;
      return color;
    } catch (error) {
      throwError(error, 'stringToColour');
      return '#ffffff';
    }
  };
  const getAllLocalStorageAsObjects = localStorage => {
    try {
      debug('开始将所有LocalStorage转换为对象');
      const result = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) {
          continue;
        }
        const value = localStorage.getItem(key);
        try {
          result[key] = JSON.parse(value);
        } catch (error) {
          result[key] = value;
          console.error(error);
        }
      }
      debug('所有LocalStorage转换为对象完成', result);
      return result;
    } catch (error) {
      debug('将所有LocalStorage转换为对象失败', {
        error: error
      });
      throwError(error, 'getAllLocalStorageAsObjects');
      return {};
    }
  };
  class Social {
    tasks;
    getRealParams(name, links, doTask, link2param) {
      try {
        debug('开始获取实际参数', {
          name: name,
          linksCount: links.length,
          doTask: doTask
        });
        let realParams = [];
        if (links.length > 0) {
          debug('处理链接参数');
          const convertedLinks = links.map((link => link2param(link))).filter((link => link !== undefined));
          debug('链接参数处理结果', {
            convertedLinksCount: convertedLinks.length
          });
          realParams = [ ...realParams, ...convertedLinks ];
        }
        if (!doTask && this.tasks[name]?.length) {
          debug('处理任务参数', {
            taskCount: this.tasks[name].length
          });
          realParams = [ ...realParams, ...this.tasks[name] ];
        }
        const uniqueParams = unique(realParams);
        debug('参数处理完成', {
          originalCount: realParams.length,
          uniqueCount: uniqueParams.length
        });
        return uniqueParams;
      } catch (error) {
        debug('获取实际参数时发生错误', {
          error: error
        });
        throwError(error, 'Social.getRealParams');
        return [];
      }
    }
  }
  class Discord extends Social {
    tasks;
    whiteList;
    #auth=(() => GM_getValue('discordAuth') || {})();
    #cache=(() => GM_getValue('discordCache') || {})();
    #xContextPropertiesCache=(() => GM_getValue('discordXContextPropertiesCache') || {})();
    #initialized=false;
    constructor() {
      super();
      const defaultTasksTemplate = {
        servers: []
      };
      this.tasks = defaultTasksTemplate;
      this.whiteList = {
        ...defaultTasksTemplate,
        ...GM_getValue('whiteList')?.discord || {}
      };
    }
    async init(action) {
      try {
        debug('开始初始化Discord模块', {
          action: action
        });
        if (!GM_getValue('dontRemindDiscordAgain')) {
          debug('显示Discord重要提示对话框');
          const result = await Swal.fire({
            title: I18n('discordImportantNotice'),
            text: I18n('discordImportantNoticeText'),
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: I18n('continueDiscordTask'),
            cancelButtonText: I18n('skipDiscordTask'),
            denyButtonText: I18n('continueAndDontRemindAgain')
          }).then((_ref2 => {
            let {isConfirmed: isConfirmed, isDenied: isDenied} = _ref2;
            if (isConfirmed) {
              return true;
            }
            if (isDenied) {
              GM_setValue('dontRemindDiscordAgain', true);
              return true;
            }
            return false;
          }));
          if (!result) {
            this.#initialized = false;
            return 'skip';
          }
        }
        if (action === 'do' && !globalOptions.doTask.discord.servers || action === 'undo' && !globalOptions.undoTask.discord.servers) {
          this.#initialized = false;
          debug('检测到用户已禁用Discord任务，跳过初始化');
          return 'skip';
        }
        if (this.#initialized) {
          debug('Discord模块已初始化');
          return true;
        }
        if (!this.#auth.auth || !this.#auth.xSuperProperties) {
          debug('未找到Discord授权信息，尝试更新授权');
          if (await this.#updateAuth()) {
            this.#initialized = true;
            return true;
          }
          return false;
        }
        const isVerified = await this.#verifyAuth();
        if (isVerified) {
          debug('Discord授权验证成功');
          echoLog({
            before: '[Discord]'
          }).success(I18n('initSuccess', 'Discord'));
          this.#initialized = true;
          return true;
        }
        GM_setValue('discordAuth', {
          auth: null
        });
        debug('Discord授权验证失败，尝试重新获取授权');
        if (await this.#updateAuth()) {
          echoLog({
            before: '[Discord]'
          }).success(I18n('initSuccess', 'Discord'));
          this.#initialized = true;
          return true;
        }
        echoLog({
          before: '[Discord]'
        }).error(I18n('initFailed', 'Discord'));
        return false;
      } catch (error) {
        throwError(error, 'Discord.init');
        return false;
      }
    }
    async #verifyAuth() {
      try {
        debug('开始验证Discord授权');
        const logStatus = echoLog({
          text: I18n('verifyingAuth', 'Discord'),
          before: '[Discord]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: 'https://discord.com/api/v6/users/@me',
          method: 'HEAD',
          headers: {
            authorization: this.#auth.auth
          }
        });
        if (result !== 'Success') {
          debug('Discord授权验证请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status !== 200) {
          debug('Discord授权验证状态码错误', {
            status: data?.status,
            statusText: data?.statusText
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        debug('Discord授权验证成功');
        logStatus.success();
        return true;
      } catch (error) {
        throwError(error, 'Discord.verifyAuth');
        return false;
      }
    }
    async #updateAuth() {
      try {
        debug('开始更新Discord授权');
        const logStatus = echoLog({
          text: I18n('updatingAuth', 'Discord'),
          before: '[Discord]'
        });
        return await new Promise((resolve => {
          const newTab = GM_openInTab('https://discord.com/channels/@me', {
            active: true,
            insert: true,
            setParent: true
          });
          newTab.name = 'ATv4_discordAuth';
          newTab.onclose = async () => {
            const {auth: auth, xSuperProperties: xSuperProperties} = GM_getValue('discordAuth');
            if (auth && xSuperProperties) {
              debug('成功获取新的Discord授权');
              this.#auth = {
                auth: auth,
                xSuperProperties: xSuperProperties
              };
              logStatus.success();
              resolve(await this.#verifyAuth());
            } else {
              debug('获取Discord授权失败');
              logStatus.error('Error: Update discord auth failed!');
              resolve(false);
            }
          };
        }));
      } catch (error) {
        throwError(error, 'Discord.updateAuth');
        return false;
      }
    }
    async #joinServer(inviteId) {
      try {
        debug('开始加入Discord服务器', {
          inviteId: inviteId
        });
        const logStatus = echoLog({
          type: 'joiningDiscordServer',
          text: inviteId,
          before: '[Discord]'
        });
        const xContextProperties = await this.#getXContextProperties(inviteId);
        if (!xContextProperties) {
          debug('获取加群参数失败，无法加入服务器', {
            inviteId: inviteId
          });
          logStatus.error('Error: Failed to get xContextProperties');
          return false;
        }
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: `https://discord.com/api/v9/invites/${inviteId}`,
          method: 'POST',
          dataType: 'json',
          headers: {
            'content-type': 'application/json',
            authorization: this.#auth.auth,
            origin: 'https://discord.com',
            referer: `https://discord.com/invite/${inviteId}`,
            'x-super-properties': this.#auth.xSuperProperties,
            'x-context-properties': xContextProperties
          },
          data: '{"session_id":null}'
        });
        if (result !== 'Success' || data?.status !== 200) {
          debug('加入Discord服务器失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          if (status === 400) {
            debug('加入Discord服务器失败，状态码为400，需完成人机验证');
            logStatus.error(I18n('captchaNeeded'));
            return false;
          }
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        const guild = data.response?.guild?.id;
        if (!guild) {
          debug('获取服务器ID失败');
          logStatus.error('Error: Failed to get guild ID');
          return false;
        }
        debug('成功加入Discord服务器', {
          guild: guild
        });
        logStatus.success();
        this.#setCache(inviteId, guild);
        this.tasks.servers = unique([ ...this.tasks.servers, inviteId ]);
        return true;
      } catch (error) {
        throwError(error, 'Discord.joinServer');
        return false;
      }
    }
    async #leaveServer(inviteId) {
      try {
        debug('开始退出Discord服务器', {
          inviteId: inviteId
        });
        if (this.whiteList.servers.includes(inviteId)) {
          debug('服务器在白名单中，跳过退出操作', {
            inviteId: inviteId
          });
          echoLog({
            type: 'whiteList',
            text: 'Discord.leaveServer',
            id: inviteId,
            before: '[Discord]'
          });
          return true;
        }
        const guild = await this.#getGuild(inviteId);
        if (!guild) {
          debug('获取服务器ID失败，无法退出服务器', {
            inviteId: inviteId
          });
          return false;
        }
        const logStatus = echoLog({
          type: 'leavingDiscordServer',
          text: guild,
          before: '[Discord]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: `https://discord.com/api/v9/users/@me/guilds/${guild}`,
          method: 'DELETE',
          headers: {
            authorization: this.#auth.auth,
            'x-super-properties': this.#auth.xSuperProperties
          }
        });
        if (result !== 'Success' || data?.status !== 204) {
          debug('退出Discord服务器失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        debug('成功退出Discord服务器', {
          guild: guild
        });
        logStatus.success();
        return true;
      } catch (error) {
        throwError(error, 'Discord.leaveServer');
        return false;
      }
    }
    async #getXContextProperties(inviteId) {
      try {
        debug('开始获取Discord加群参数', {
          inviteId: inviteId
        });
        const logStatus = echoLog({
          type: 'gettingDiscordXContextProperties',
          text: inviteId,
          before: '[Discord]'
        });
        const cachedXContextProperties = this.#xContextPropertiesCache[inviteId];
        if (cachedXContextProperties) {
          debug('从缓存中获取到加群参数', {
            inviteId: inviteId,
            cachedXContextProperties: cachedXContextProperties
          });
          logStatus.success();
          return cachedXContextProperties;
        }
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: `https://discord.com/api/v9/invites/${inviteId}?with_counts=true&with_expiration=true&with_permissions=true`,
          responseType: 'json',
          method: 'GET',
          headers: {
            authorization: this.#auth.auth,
            'x-super-properties': this.#auth.xSuperProperties
          }
        });
        if (result !== 'Success' || data?.status !== 200) {
          debug('获取加群参数失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        const guild = data.response?.guild?.id;
        if (!guild) {
          debug('加群参数中未找到ID', {
            inviteId: inviteId
          });
          logStatus.error('Error: Failed to get guild ID');
          return false;
        }
        const xContextProperties = {
          location: 'Accept Invite Page',
          location_guild_id: data.response?.guild?.id,
          location_channel_id: data.response?.channel?.id,
          location_channel_type: data.response?.channel?.type
        };
        debug('成功获取加群参数', xContextProperties);
        logStatus.success();
        this.#setXContextPropertiesCache(inviteId, window.btoa(JSON.stringify(xContextProperties)));
        this.#setCache(inviteId, guild);
        return window.btoa(JSON.stringify(xContextProperties));
      } catch (error) {
        throwError(error, 'Discord.getXContextProperties');
        return false;
      }
    }
    async #getGuild(inviteId) {
      try {
        debug('开始获取Discord服务器ID', {
          inviteId: inviteId
        });
        const logStatus = echoLog({
          type: 'gettingDiscordGuild',
          text: inviteId,
          before: '[Discord]'
        });
        const cachedGuild = this.#cache[inviteId];
        if (cachedGuild) {
          debug('从缓存中获取到服务器ID', {
            inviteId: inviteId,
            cachedGuild: cachedGuild
          });
          logStatus.success();
          return cachedGuild;
        }
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: `https://discord.com/api/v9/invites/${inviteId}`,
          responseType: 'json',
          method: 'GET',
          headers: {
            authorization: this.#auth.auth,
            'x-super-properties': this.#auth.xSuperProperties
          }
        });
        if (result !== 'Success' || data?.status !== 200) {
          debug('获取服务器信息失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        const guild = data.response?.guild?.id;
        if (!guild) {
          debug('服务器信息中未找到ID', {
            inviteId: inviteId
          });
          logStatus.error('Error: Failed to get guild ID');
          return false;
        }
        debug('成功获取服务器ID', {
          inviteId: inviteId,
          guild: guild
        });
        logStatus.success();
        this.#setCache(inviteId, guild);
        return guild;
      } catch (error) {
        throwError(error, 'Discord.getGuild');
        return false;
      }
    }
    async toggle(_ref3) {
      let {doTask: doTask = true, serverLinks: serverLinks = []} = _ref3;
      try {
        debug('开始处理Discord服务器任务', {
          doTask: doTask,
          serverLinksCount: serverLinks.length
        });
        if (!this.#initialized) {
          debug('Discord模块未初始化');
          echoLog({
            text: I18n('needInit'),
            before: '[Discord]'
          });
          return false;
        }
        if (doTask && !globalOptions.doTask.discord.servers || !doTask && !globalOptions.undoTask.discord.servers) {
          debug('根据全局选项跳过Discord服务器任务', {
            doTask: doTask
          });
          echoLog({
            type: 'globalOptionsSkip',
            text: 'discord.servers',
            before: '[Discord]'
          });
          return true;
        }
        const realServers = this.getRealParams('servers', serverLinks, doTask, (link => link.match(/invite\/(.+)/)?.[1]));
        debug('处理后的服务器列表', {
          count: realServers.length,
          servers: realServers
        });
        if (realServers.length === 0) {
          debug('没有需要处理的服务器');
          return true;
        }
        const results = [];
        for (const server of realServers) {
          results.push(doTask ? this.#joinServer(server) : this.#leaveServer(server));
          await delay(1e3);
        }
        return await Promise.allSettled(results).then((() => true));
      } catch (error) {
        throwError(error, 'Discord.toggleServers');
        return false;
      }
    }
    #setCache(inviteId, guild) {
      try {
        debug('设置Discord服务器缓存', {
          inviteId: inviteId,
          guild: guild
        });
        this.#cache[inviteId] = guild;
        GM_setValue('discordCache', this.#cache);
        debug('Discord服务器缓存设置成功');
      } catch (error) {
        debug('设置Discord服务器缓存失败', {
          error: error
        });
        throwError(error, 'Discord.setCache');
      }
    }
    #setXContextPropertiesCache(inviteId, xContextProperties) {
      try {
        debug('设置Discord加群参数缓存', {
          inviteId: inviteId,
          xContextProperties: xContextProperties
        });
        this.#xContextPropertiesCache[inviteId] = xContextProperties;
        GM_setValue('discordXContextPropertiesCache', this.#xContextPropertiesCache);
      } catch (error) {
        debug('设置Discord加群参数缓存失败', {
          error: error
        });
        throwError(error, 'Discord.setXContextPropertiesCache');
      }
    }
  }
  class Reddit extends Social {
    tasks;
    whiteList;
    #auth;
    #initialized=false;
    constructor() {
      super();
      const defaultTasksTemplate = {
        reddits: []
      };
      debug('初始化Reddit实例');
      this.tasks = defaultTasksTemplate;
      this.whiteList = {
        ...defaultTasksTemplate,
        ...GM_getValue('whiteList')?.reddit || {}
      };
    }
    async init() {
      try {
        debug('开始初始化Reddit模块');
        if (this.#initialized) {
          debug('Reddit模块已初始化');
          return true;
        }
        const isVerified = await this.#updateAuth();
        if (isVerified) {
          debug('Reddit授权验证成功');
          echoLog({
            before: '[Reddit]'
          }).success(I18n('initSuccess', 'Reddit'));
          this.#initialized = true;
          return true;
        }
        debug('Reddit初始化失败');
        echoLog({
          before: '[Reddit]'
        }).error(I18n('initFailed', 'Reddit'));
        return false;
      } catch (error) {
        debug('Reddit初始化发生错误', {
          error: error
        });
        throwError(error, 'Reddit.init');
        return false;
      }
    }
    async #useBeta() {
      try {
        debug('开始切换Reddit为新版');
        const logStatus = echoLog({
          text: I18n('changingRedditVersion'),
          before: '[Reddit]'
        });
        return await new Promise((resolve => {
          const newTab = GM_openInTab('https://www.reddit.com/', {
            active: true,
            insert: true,
            setParent: true
          });
          newTab.name = 'ATv4_redditAuth';
          newTab.onclose = async () => {
            debug('新版Reddit标签页已关闭');
            logStatus.success();
            resolve(await this.#updateAuth(true));
          };
        }));
      } catch (error) {
        debug('切换Reddit版本时发生错误', {
          error: error
        });
        throwError(error, 'Reddit.useBeta');
        return false;
      }
    }
    async #updateAuth() {
      let beta = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      try {
        debug('开始更新Reddit授权', {
          beta: beta
        });
        const logStatus = echoLog({
          text: I18n('updatingAuth', 'Reddit'),
          before: '[Reddit]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: 'https://www.reddit.com/',
          method: 'GET',
          nochche: true,
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        if (result !== 'Success') {
          debug('获取Reddit页面失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.responseText.includes('www.reddit.com/login/')) {
          debug('需要登录Reddit');
          logStatus.error(`Error:${I18n('loginReddit')}`, true);
          return false;
        }
        if (data?.status !== 200) {
          debug('Reddit页面状态码错误', {
            status: data?.status,
            statusText: data?.statusText
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        if (data.responseText.includes('redesign-beta-optin-btn') && !beta) {
          debug('检测到旧版Reddit，需要切换到新版');
          return await this.#useBeta();
        }
        const accessToken = data.responseText.match(/"accessToken":"(.*?)","expires":"(.*?)"/)?.[1];
        if (!accessToken) {
          debug('未找到Reddit访问令牌');
          logStatus.error('Error: Parameter "accessToken" not found!');
          return false;
        }
        debug('成功获取Reddit访问令牌');
        this.#auth = {
          token: accessToken
        };
        logStatus.success();
        return true;
      } catch (error) {
        debug('更新Reddit授权时发生错误', {
          error: error
        });
        throwError(error, 'Reddit.updateAuth');
        return false;
      }
    }
    async #toggleTask(_ref4) {
      let {name: name, doTask: doTask = true} = _ref4;
      try {
        debug('开始处理Reddit任务', {
          name: name,
          doTask: doTask
        });
        if (!doTask && this.whiteList.reddits.includes(name)) {
          debug('Reddit在白名单中，跳过取消订阅', {
            name: name
          });
          echoLog({
            type: 'whiteList',
            text: 'Reddit.undoTask',
            id: name,
            before: '[Reddit]'
          });
          return true;
        }
        let type = doTask ? 'joiningReddit' : 'leavingReddit';
        if (/^u_/.test(name)) {
          type = doTask ? 'followingRedditUser' : 'unfollowingRedditUser';
        }
        debug('任务类型', {
          type: type,
          name: name
        });
        const logStatus = echoLog({
          type: type,
          text: name,
          before: '[Reddit]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: 'https://oauth.reddit.com/api/subscribe?redditWebClient=desktop2x&app=desktop2x-client-production&raw_json=1&gilding_detail=1',
          method: 'POST',
          headers: {
            authorization: `Bearer ${this.#auth.token}`,
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: $.param({
            action: doTask ? 'sub' : 'unsub',
            sr_name: name,
            api_type: 'json'
          })
        });
        if (result !== 'Success') {
          debug('Reddit任务请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status !== 200) {
          debug('Reddit任务状态码错误', {
            status: data?.status,
            statusText: data?.statusText
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        debug('Reddit任务处理成功', {
          name: name,
          doTask: doTask
        });
        logStatus.success();
        if (doTask) {
          this.tasks.reddits = unique([ ...this.tasks.reddits, name ]);
        }
        return true;
      } catch (error) {
        debug('处理Reddit任务时发生错误', {
          error: error
        });
        throwError(error, 'Reddit.toggleTask');
        return false;
      }
    }
    async toggle(_ref5) {
      let {doTask: doTask = true, redditLinks: redditLinks = []} = _ref5;
      try {
        debug('开始处理Reddit链接任务', {
          doTask: doTask,
          redditLinksCount: redditLinks.length
        });
        if (!this.#initialized) {
          debug('Reddit模块未初始化');
          echoLog({
            text: I18n('needInit'),
            before: '[Reddit]'
          });
          return false;
        }
        if (doTask && !globalOptions.doTask.reddit.reddits || !doTask && !globalOptions.undoTask.reddit.reddits) {
          debug('根据全局选项跳过Reddit任务', {
            doTask: doTask
          });
          echoLog({
            type: 'globalOptionsSkip',
            text: 'reddit.reddits',
            before: '[Reddit]'
          });
          return true;
        }
        const realReddits = this.getRealParams('reddits', redditLinks, doTask, (link => {
          const name = link.match(/https?:\/\/www\.reddit\.com\/r\/([^/]*)/)?.[1];
          const userName = link.match(/https?:\/\/www\.reddit\.com\/user\/([^/]*)/)?.[1];
          if (userName) {
            return name || userName;
          }
          return name;
        }));
        debug('处理后的Reddit列表', {
          count: realReddits.length,
          reddits: realReddits
        });
        if (realReddits.length === 0) {
          debug('没有需要处理的Reddit链接');
          return true;
        }
        const prom = [];
        for (const name of realReddits) {
          prom.push(this.#toggleTask({
            name: name,
            doTask: doTask
          }));
          await delay(1e3);
        }
        return await Promise.all(prom).then((() => true));
      } catch (error) {
        debug('处理Reddit链接任务时发生错误', {
          error: error
        });
        throwError(error, 'Reddit.toggle');
        return false;
      }
    }
  }
  class Twitch extends Social {
    tasks;
    whiteList;
    #auth=(() => GM_getValue('twitchAuth') || {})();
    #cache=(() => GM_getValue('twitchCache') || {})();
    #initialized=false;
    #integrityToken;
    constructor() {
      super();
      const defaultTasksTemplate = {
        channels: []
      };
      debug('初始化Twitch实例');
      this.tasks = defaultTasksTemplate;
      this.whiteList = {
        ...defaultTasksTemplate,
        ...GM_getValue('whiteList')?.twitch || {}
      };
    }
    async init() {
      try {
        debug('开始初始化Twitch模块');
        if (this.#initialized) {
          debug('Twitch模块已初始化');
          return true;
        }
        if (!this.#auth.authToken || !this.#auth.clientId || !this.#auth.clientVersion || !this.#auth.deviceId || !this.#auth.clientSessionId) {
          if (await this.#updateAuth()) {
            this.#initialized = true;
            return true;
          }
          return false;
        }
        const isVerified = await this.#verifyAuth(true);
        if (isVerified) {
          debug('Twitch授权验证成功');
          echoLog({
            before: '[Twitch]'
          }).success(I18n('initSuccess', 'Twitch'));
          this.#initialized = true;
          return true;
        }
        GM_setValue('twitchAuth', null);
        if (await this.#updateAuth()) {
          debug('Twitch重新授权成功');
          echoLog({
            before: '[Twitch]'
          }).success(I18n('initSuccess', 'Twitch'));
          this.#initialized = true;
          return true;
        }
        debug('Twitch初始化失败');
        echoLog({
          before: '[Twitch]'
        }).error(I18n('initFailed', 'Twitch'));
        return false;
      } catch (error) {
        debug('Twitch初始化发生错误', {
          error: error
        });
        throwError(error, 'Twitch.init');
        return false;
      }
    }
    async #verifyAuth(isFirst) {
      try {
        debug('开始验证Twitch授权');
        const logStatus = echoLog({
          text: I18n('verifyingAuth', 'Twitch'),
          before: '[Twitch]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: 'https://gql.twitch.tv/gql',
          method: 'POST',
          dataType: 'json',
          headers: {
            Authorization: `OAuth ${this.#auth.authToken}`,
            'Client-Id': this.#auth.clientId
          },
          data: '[{"operationName":"FrontPageNew_User","variables":{"limit":1},"extensions":{"persistedQuery":{"version":1,' + '"sha256Hash":"64bd07a2cbaca80699d62636d966cf6395a5d14a1f0a14282067dcb28b13eb11"}}}]'
        });
        if (result !== 'Success') {
          debug('Twitch授权验证请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status !== 200 || !data.response?.[0]?.data?.currentUser) {
          debug('Twitch授权验证状态错误', {
            status: data?.status,
            statusText: data?.statusText
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        await this.#integrity(isFirst);
        debug('Twitch授权验证成功');
        logStatus.success();
        return true;
      } catch (error) {
        debug('Twitch授权验证发生错误', {
          error: error
        });
        throwError(error, 'Twitch.verifyAuth');
        return false;
      }
    }
    async #integrity() {
      let isFirst = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      let ct = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      try {
        debug('开始检查Twitch完整性', {
          isFirst: isFirst,
          ct: ct
        });
        const logStatus = echoLog({
          text: I18n('checkingTwitchIntegrity'),
          before: '[Twitch]'
        });
        if (isFirst && (!this.#auth.authToken || !this.#auth.clientId || !this.#auth.clientVersion || !this.#auth.deviceId || !this.#auth.clientSessionId)) {
          return await this.#updateAuth(false);
        }
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: 'https://gql.twitch.tv/integrity',
          method: 'POST',
          dataType: 'json',
          anonymous: true,
          headers: {
            Origin: 'https://www.twitch.tv',
            Referer: 'https://www.twitch.tv/',
            Authorization: `OAuth ${this.#auth.authToken}`,
            'Client-Id': this.#auth.clientId,
            'Client-Version': this.#auth.clientVersion,
            'X-Device-Id': this.#auth.deviceId,
            'Client-Session-Id': this.#auth.clientSessionId,
            'x-kpsdk-ct': ct
          }
        });
        if (result !== 'Success') {
          debug('Twitch完整性检查请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (!ct && data?.responseHeaders?.['x-kpsdk-ct']) {
          debug('需要重新检查Twitch完整性');
          return await this.#integrity(isFirst, data.responseHeaders['x-kpsdk-ct']);
        }
        if (data?.status !== 200 || !data.response?.token) {
          debug('Twitch完整性检查状态错误', {
            status: data?.status,
            statusText: data?.statusText
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        this.#integrityToken = data.response.token;
        debug('Twitch完整性检查成功');
        logStatus.success();
        return true;
      } catch (error) {
        debug('Twitch完整性检查发生错误', {
          error: error
        });
        throwError(error, 'Twitch.integrity');
        return false;
      }
    }
    async #updateAuth() {
      let isFirst = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      try {
        debug('开始更新Twitch授权', {
          isFirst: isFirst
        });
        const logStatus = echoLog({
          text: I18n('updatingAuth', 'Twitch'),
          before: '[Twitch]'
        });
        return await new Promise((resolve => {
          const newTab = GM_openInTab('https://www.twitch.tv/', {
            active: true,
            insert: true,
            setParent: true
          });
          newTab.name = 'ATv4_twitchAuth';
          newTab.onclose = async () => {
            const auth = GM_getValue('twitchAuth');
            if (auth) {
              debug('成功获取新的Twitch授权');
              this.#auth = auth;
              logStatus.success();
              resolve(await this.#verifyAuth(isFirst));
            } else {
              debug('获取Twitch授权失败');
              logStatus.error('Error: Update twitch auth failed!');
              resolve(false);
            }
          };
        }));
      } catch (error) {
        debug('更新Twitch授权时发生错误', {
          error: error
        });
        throwError(error, 'Twitch.updateAuth');
        return false;
      }
    }
    async #toggleChannel(_ref6) {
      let {name: name, doTask: doTask = true} = _ref6;
      try {
        debug('开始处理Twitch频道任务', {
          name: name,
          doTask: doTask
        });
        if (!doTask && this.whiteList.channels.includes(name)) {
          debug('Twitch频道在白名单中，跳过取消关注', {
            name: name
          });
          echoLog({
            type: 'whiteList',
            text: 'Twitch.unfollowChannel',
            id: name,
            before: '[Twitch]'
          });
          return true;
        }
        const channelId = await this.#getChannelId(name);
        if (!channelId) {
          return false;
        }
        const logStatus = echoLog({
          type: `${doTask ? '' : 'un'}followingTwitchChannel`,
          text: name,
          before: '[Twitch]'
        });
        const followData = `[{"operationName":"FollowButton_FollowUser","variables":{"input":{"disableNotifications":false,"targetID":"${channelId}` + '"}},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"800e7346bdf7e5278a3c1d3f21b2b56e2639928f86815677a7126b093b2fdd08"}}}]';
        const unfollowData = `[{"operationName":"FollowButton_UnfollowUser","variables":{"input":{"targetID":"${channelId}"}},` + '"extensions":{"persistedQuery":{"version":1,"sha256Hash":"f7dae976ebf41c755ae2d758546bfd176b4eeb856656098bb40e0a672ca0d880"}}}]';
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: 'https://gql.twitch.tv/gql',
          method: 'POST',
          dataType: 'json',
          anonymous: true,
          headers: {
            Origin: 'https://www.twitch.tv',
            Referer: 'https://www.twitch.tv/',
            Authorization: `OAuth ${this.#auth.authToken}`,
            'Client-Id': this.#auth.clientId,
            'Client-Version': this.#auth.clientVersion,
            'X-Device-Id': this.#auth.deviceId,
            'Client-Session-Id': this.#auth.clientSessionId,
            'Client-Integrity': this.#integrityToken
          },
          data: doTask ? followData : unfollowData
        });
        if (result !== 'Success') {
          debug('Twitch频道操作请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status !== 200 || data.response?.[0] && data.response[0].errors) {
          debug('Twitch频道操作状态错误', {
            status: data?.status,
            statusText: data?.statusText,
            errors: data?.response?.[0].errors
          });
          logStatus.error(`Error:${data?.response?.[0].errors?.[0]?.message || `${data?.statusText}(${data?.status})`}`);
          return false;
        }
        debug('Twitch频道操作成功', {
          name: name,
          doTask: doTask
        });
        logStatus.success();
        if (doTask) {
          this.tasks.channels = unique([ ...this.tasks.channels, name ]);
        }
        return true;
      } catch (error) {
        debug('处理Twitch频道任务时发生错误', {
          error: error
        });
        throwError(error, 'Twitch.toggleChannel');
        return false;
      }
    }
    async #getChannelId(name) {
      try {
        debug('开始获取Twitch频道ID', {
          name: name
        });
        const logStatus = echoLog({
          type: 'gettingTwitchChannelId',
          text: name,
          before: '[Twitch]'
        });
        const cachedChannelId = this.#cache[name];
        if (cachedChannelId) {
          debug('从缓存获取到Twitch频道ID', {
            name: name,
            id: cachedChannelId
          });
          logStatus.success();
          return cachedChannelId;
        }
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: 'https://gql.twitch.tv/gql',
          method: 'POST',
          headers: {
            Authorization: `OAuth ${this.#auth.authToken}`,
            'Client-Id': this.#auth.clientId
          },
          responseType: 'json',
          data: `[{"operationName":"ActiveWatchParty","variables":{"channelLogin":"${name}"},` + '"extensions":{"persistedQuery":{"version":1,"sha256Hash":"4a8156c97b19e3a36e081cf6d6ddb5dbf9f9b02ae60e4d2ff26ed70aebc80a30"}}}]'
        });
        if (result !== 'Success') {
          debug('获取Twitch频道ID请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status !== 200) {
          debug('获取Twitch频道ID状态错误', {
            status: data?.status,
            statusText: data?.statusText
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        const newChannelId = data.response?.[0]?.data?.user?.id;
        if (!newChannelId) {
          debug('未找到Twitch频道ID', {
            name: name
          });
          logStatus.error(`Error:${data?.statusText || 'Unknown'}(${data?.status || 'Unknown'})`);
          return false;
        }
        debug('成功获取Twitch频道ID', {
          name: name,
          id: newChannelId
        });
        this.#setCache(name, newChannelId);
        logStatus.success();
        return newChannelId;
      } catch (error) {
        debug('获取Twitch频道ID时发生错误', {
          error: error
        });
        throwError(error, 'Twitch.getChannelId');
        return false;
      }
    }
    async toggle(_ref7) {
      let {doTask: doTask = true, channelLinks: channelLinks = []} = _ref7;
      try {
        debug('开始处理Twitch链接任务', {
          doTask: doTask,
          channelLinksCount: channelLinks.length
        });
        if (!this.#initialized) {
          debug('Twitch模块未初始化');
          echoLog({
            text: I18n('needInit'),
            before: '[Twitch]'
          });
          return false;
        }
        const prom = [];
        if (doTask && !globalOptions.doTask.twitch.channels || !doTask && !globalOptions.undoTask.twitch.channels) {
          debug('根据全局选项跳过Twitch任务', {
            doTask: doTask
          });
          echoLog({
            type: 'globalOptionsSkip',
            text: 'twitch.channels',
            before: '[Twitch]'
          });
        } else {
          const realChannels = this.getRealParams('channels', channelLinks, doTask, (link => link.match(/https:\/\/(www\.)?twitch\.tv\/(.+)/)?.[2]));
          debug('处理后的Twitch频道列表', {
            count: realChannels.length,
            channels: realChannels
          });
          if (realChannels.length > 0) {
            for (const channel of realChannels) {
              prom.push(this.#toggleChannel({
                name: channel,
                doTask: doTask
              }));
              await delay(1e3);
            }
          }
        }
        return Promise.all(prom).then((() => true));
      } catch (error) {
        debug('处理Twitch链接任务时发生错误', {
          error: error
        });
        throwError(error, 'Twitch.toggle');
        return false;
      }
    }
    #setCache(name, id) {
      try {
        debug('设置Twitch频道ID缓存', {
          name: name,
          id: id
        });
        this.#cache[name] = id;
        GM_setValue('twitchCache', this.#cache);
      } catch (error) {
        debug('设置Twitch频道ID缓存时发生错误', {
          error: error
        });
        throwError(error, 'Twitch.setCache');
      }
    }
  }
  const encodeSha256 = async data => {
    const encoder = new TextEncoder;
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    return Array.from(new Uint8Array(hashBuffer));
  };
  const encodeBase64 = data => {
    let binary = '';
    const bytes = new Uint8Array(data);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/=/g, '');
  };
  const decodeBase64 = data => {
    const binaryString = atob(data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return Array.from(bytes);
  };
  const generateTransactionId = async (method, path, key, animationKey) => {
    const DEFAULT_KEYWORD = 'obfiowerehiring';
    const ADDITIONAL_RANDOM_NUMBER = 3;
    const timeNow = Math.floor((Date.now() - 1682924400 * 1e3) / 1e3);
    const timeNowBytes = [ timeNow & 255, timeNow >> 8 & 255, timeNow >> 16 & 255, timeNow >> 24 & 255 ];
    const data = `${method}!${path}!${timeNow}${DEFAULT_KEYWORD}${animationKey}`;
    const hashBytes = await encodeSha256(data);
    const keyBytes = decodeBase64(key);
    const randomNum = Math.floor(Math.random() * 256);
    const bytesArr = [ ...keyBytes, ...timeNowBytes, ...hashBytes.slice(0, 16), ADDITIONAL_RANDOM_NUMBER ];
    const out = new Uint8Array(bytesArr.length + 1);
    out[0] = randomNum;
    bytesArr.forEach(((item, index) => {
      out[index + 1] = item ^ randomNum;
    }));
    return encodeBase64(out);
  };
  const url = 'https://raw.githubusercontent.com/fa0311/x-client-transaction-id-pair-dict/refs/heads/main/pair.json';
  const getTID = async () => {
    const res = await fetch(url);
    const json = await res.json();
    return async (method, path) => {
      const randomPair = json[Math.floor(Math.random() * json.length)];
      const {animationKey: animationKey, verification: verification} = randomPair;
      const tid = await generateTransactionId(method, path, verification, animationKey);
      return tid;
    };
  };
  const parseResponseHeaders = headerStr => {
    const headers = {};
    if (!headerStr) {
      return headers;
    }
    headerStr.split('\r\n').forEach((line => {
      if (line) {
        const parts = line.split(':');
        const key = parts.shift()?.trim();
        const value = parts.join(':').trim();
        if (key) {
          if (key.toLowerCase() === 'set-cookie') {
            if (headers[key]) {
              if (Array.isArray(headers[key])) {
                headers[key].push(value);
              } else {
                headers[key] = [ headers[key], value ];
              }
            } else {
              headers[key] = value;
            }
          } else {
            headers[key] = value;
          }
        }
      }
    }));
    return headers;
  };
  const axiosGM = function(config) {
    const finalConfig = {
      ...axiosGM.defaults,
      ...config
    };
    const retries = finalConfig.retry ?? 0;
    const retryDelay = finalConfig.retryDelay ?? 0;
    const requestAttempt = attempt => new Promise(((resolve, reject) => {
      GM_xmlhttpRequest({
        method: finalConfig.method ? finalConfig.method.toUpperCase() : 'GET',
        url: finalConfig.url,
        headers: finalConfig.headers,
        data: finalConfig.data,
        responseType: finalConfig.responseType || 'json',
        timeout: finalConfig.timeout,
        fetch: finalConfig.fetch ?? true,
        onload(response) {
          const axiosResponse = {
            data: response.response || response.responseText,
            status: response.status,
            statusText: response.statusText,
            headers: parseResponseHeaders(response.responseHeaders),
            config: finalConfig,
            request: response
          };
          resolve(axiosResponse);
        },
        onerror(error) {
          if (attempt < retries) {
            setTimeout((() => {
              requestAttempt(attempt + 1).then(resolve).catch(reject);
            }), retryDelay);
          } else {
            reject(error);
          }
        },
        ontimeout() {
          if (attempt < retries) {
            setTimeout((() => {
              requestAttempt(attempt + 1).then(resolve).catch(reject);
            }), retryDelay);
          } else {
            reject('Error: timeout');
          }
        }
      });
    }));
    return requestAttempt(0);
  };
  axiosGM.defaults = {};
  axiosGM.get = function(url) {
    let config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return axiosGM({
      ...config,
      url: url,
      method: 'GET'
    });
  };
  axiosGM.post = function(url, data) {
    let config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return axiosGM({
      ...config,
      url: url,
      data: data,
      method: 'POST'
    });
  };
  axiosGM.head = function(url) {
    let config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return axiosGM({
      ...config,
      url: url,
      method: 'HEAD'
    });
  };
  axiosGM.create = function() {
    let instanceDefaults = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const instance = config => {
      const mergedConfig = {
        ...axiosGM.defaults,
        ...instanceDefaults,
        ...config
      };
      return axiosGM(mergedConfig);
    };
    instance.defaults = {
      ...axiosGM.defaults,
      ...instanceDefaults
    };
    instance.get = function(url) {
      let config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return instance({
        ...config,
        url: url,
        method: 'GET'
      });
    };
    instance.post = function(url, data) {
      let config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return instance({
        ...config,
        url: url,
        data: data,
        method: 'POST'
      });
    };
    instance.head = function(url) {
      let config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return instance({
        ...config,
        url: url,
        method: 'HEAD'
      });
    };
    instance.create = axiosGM.create;
    return instance;
  };
  const getFwdForSdkUrl = async () => {
    const rawHtml = await axiosGM({
      url: 'https://x.com',
      method: 'GET'
    });
    return [ ...rawHtml.data.matchAll(/"(loader\.FwdForSdk)":"([^"]+?)"/g) ];
  };
  const fwdForSdkExpoter = async url => {
    const {data: data} = await axiosGM.get(url);
    const regex = /Uint8Array\(\w\)\.set\(\[(.*?)\]\)/;
    if (!regex.test(data)) {
      return false;
    }
    const json = `[${data.match(regex)?.[1]}]`;
    const obj = JSON.parse(json);
    return new Uint8Array(obj);
  };
  const getWasmData = async () => {
    const fwdForSdkUrl = await getFwdForSdkUrl();
    for (const url of fwdForSdkUrl) {
      const sdkData = await fwdForSdkExpoter(`https://abs.twimg.com/responsive-web/client-web/${url[1]}.${url[2]}a.js`);
      if (sdkData) {
        return sdkData;
      }
    }
    return false;
  };
  const getFwdForSdk = async () => {
    debug('开始获取 XFwdForSdk');
    const wasmData = await getWasmData();
    debug('获取 wasmData 成功', {
      wasmData: wasmData
    });
    const go = new Go;
    const wasmModule = await WebAssembly.instantiate(wasmData, {
      ...go.importObject,
      env: {
        ...go.importObject.env,
        memory: new WebAssembly.Memory({
          initial: 10
        }),
        table: new WebAssembly.Table({
          initial: 0,
          element: 'anyfunc'
        })
      }
    });
    debug('初始化 wasmModule 成功');
    go.run(wasmModule.instance);
    debug('运行 wasmModule 成功');
    const {str: str, expiryTimeMillis: expiryTimeMillis} = await globalThis.getForwardedForStr();
    debug('获取 XFwdForSdk 成功', {
      str: str,
      expiryTimeMillis: expiryTimeMillis
    });
    return {
      str: str,
      expiryTimeMillis: parseInt(expiryTimeMillis, 10)
    };
  };
  const generateSecCHUA = () => {
    if (navigator.userAgentData && navigator.userAgentData.brands) {
      return navigator.userAgentData.brands.map((brand => `"${brand.brand}";v="${brand.version}"`)).join(', ');
    }
    return '"Google Chrome";v="125", "Chromium";v="125", "Not-A.Brand";v="99"';
  };
  class Twitter extends Social {
    tasks;
    whiteList;
    #verifyId=(() => globalOptions.other.twitterVerifyId)();
    #auth=(() => GM_getValue('twitterAuth') || {})();
    #cache=(() => GM_getValue('twitterCache') || {})();
    #initialized=false;
    #getTID;
    #FwdForSdk;
    #headers={};
    constructor() {
      super();
      const defaultTasksTemplate = {
        users: [],
        retweets: [],
        likes: []
      };
      debug('初始化Twitter实例');
      this.tasks = defaultTasksTemplate;
      this.whiteList = {
        ...defaultTasksTemplate,
        ...GM_getValue('whiteList')?.twitter || {}
      };
      this.#headers = {
        authorization: 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
        'X-Twitter-Auth-Type': 'OAuth2Session',
        'X-Twitter-Active-User': 'yes',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'sec-ch-ua-platform': '"Windows"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua': generateSecCHUA()
      };
    }
    async init() {
      try {
        debug('开始初始化Twitter模块');
        if (this.#initialized) {
          debug('Twitter模块已初始化');
          return true;
        }
        debug('获取Twitter授权信息');
        if (!await this.#updateAuth()) {
          return false;
        }
        debug('创建Twitter会话和SDK');
        this.#getTID = await getTID();
        this.#FwdForSdk = await getFwdForSdk();
        const isVerified = await this.#verifyAuth();
        if (isVerified) {
          debug('Twitter授权验证成功');
          echoLog({
            before: '[Twitter]'
          }).success(I18n('initSuccess', 'Twitter'));
          this.#initialized = true;
          return true;
        }
        debug('Twitter授权失效，尝试重新获取');
        GM_setValue('twitterAuth', null);
        if (await this.#updateAuth()) {
          debug('Twitter重新授权成功');
          echoLog({
            before: '[Twitter]'
          }).success(I18n('initSuccess', 'Twitter'));
          this.#initialized = true;
          return true;
        }
        debug('Twitter初始化失败');
        echoLog({
          before: '[Twitter]'
        }).error(I18n('initFailed', 'Twitter'));
        return false;
      } catch (error) {
        debug('Twitter初始化发生错误', {
          error: error
        });
        throwError(error, 'Twitter.init');
        return false;
      }
    }
    async #verifyAuth() {
      try {
        debug('开始验证Twitter授权');
        return await this.#toggleUser({
          name: 'verify',
          doTask: true,
          verify: true
        });
      } catch (error) {
        debug('Twitter授权验证发生错误', {
          error: error
        });
        throwError(error, 'Twitter.verifyAuth');
        return false;
      }
    }
    async #updateAuth() {
      try {
        debug('开始更新Twitter授权');
        const logStatus = echoLog({
          text: I18n('updatingAuth', 'Twitter'),
          before: '[Twitter]'
        });
        return await new Promise((resolve => {
          GM_cookie.list({
            url: 'https://x.com/settings/account'
          }, (async (cookies, error) => {
            if (!error) {
              const ct0 = cookies.find((cookie => cookie.name === 'ct0'))?.value;
              const isLogin = cookies.find((cookie => cookie.name === 'twid'))?.value;
              if (isLogin && ct0) {
                debug('成功获取Twitter授权信息');
                GM_setValue('twitterAuth', {
                  ct0: ct0
                });
                this.#auth = {
                  ct0: ct0
                };
                this.#headers['x-csrf-token'] = ct0;
                this.#headers['x-twitter-client-language'] = cookies.find((cookie => cookie.name === 'lang'))?.value || 'en';
                logStatus.success();
                resolve(true);
              } else {
                debug('获取Twitter授权失败：未登录');
                logStatus.error(I18n('needLogin'));
                resolve(false);
              }
            } else {
              debug('获取Twitter授权失败', {
                error: error
              });
              logStatus.error('Error: Update twitter auth failed!');
              resolve(false);
            }
          }));
        }));
      } catch (error) {
        debug('更新Twitter授权时发生错误', {
          error: error
        });
        throwError(error, 'Twitter.updateToken');
        return false;
      }
    }
    async #toggleUser(_ref8) {
      let {name: name, doTask: doTask = true, verify: verify = false, retry: retry = false} = _ref8;
      try {
        debug('开始处理Twitter用户任务', {
          name: name,
          doTask: doTask,
          verify: verify,
          retry: retry
        });
        if (!doTask && !verify && this.whiteList.users.includes(name)) {
          debug('Twitter用户在白名单中，跳过取消关注', {
            name: name
          });
          echoLog({
            type: 'whiteList',
            text: 'Twitter.unfollowUser',
            id: name,
            before: '[Twitter]'
          });
          return true;
        }
        const userId = verify ? this.#verifyId : await this.userName2id(name);
        if (!userId) {
          return false;
        }
        const logStatus = verify ? echoLog({
          text: I18n('verifyingAuth', 'Twitter'),
          before: '[Twitter]'
        }) : echoLog({
          type: `${doTask ? '' : 'un'}followingTwitterUser`,
          text: name,
          before: '[Twitter]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: `https://x.com/i/api/1.1/friendships/${doTask ? 'create' : 'destroy'}.json`,
          method: 'POST',
          headers: {
            ...this.#headers,
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-client-transaction-id': await this.#getTID('POST', `/i/api/1.1/friendships/${doTask ? 'create' : 'destroy'}.json`),
            'x-xp-forwarded-for': this.#FwdForSdk.str
          },
          responseType: 'json',
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
        });
        if (result !== 'Success') {
          debug('Twitter用户操作请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status === 200) {
          debug('Twitter用户操作成功', {
            name: name,
            doTask: doTask
          });
          logStatus.success();
          if (doTask && !verify) {
            this.tasks.users = unique([ ...this.tasks.users, name ]);
          }
          return true;
        }
        if (verify && data?.status === 403) {
          if (data.response?.errors?.[0]?.code === 158) {
            debug('Twitter授权验证成功（已关注）');
            logStatus.success();
            return true;
          }
          if (data.response?.errors?.[0]?.code === 353 && !retry && data.responseHeaders?.['set-cookie']) {
            const newCt0 = data.responseHeaders['set-cookie']?.find((cookie => cookie.includes('ct0=')))?.split(';')?.at(0)?.split('=')?.at(-1);
            if (newCt0) {
              debug('获取到新的Twitter授权Token，重试操作');
              this.#auth.ct0 = newCt0;
              GM_setValue('twitterAuth', this.#auth);
              logStatus.warning(I18n('retry'));
              return this.#toggleUser({
                name: name,
                doTask: doTask,
                verify: verify,
                retry: true
              });
            }
          }
        }
        debug('Twitter用户操作失败', {
          status: data?.status,
          statusText: data?.statusText
        });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      } catch (error) {
        debug('处理Twitter用户任务时发生错误', {
          error: error
        });
        throwError(error, 'Twitter.toggleUser');
        return false;
      }
    }
    async userName2id(name) {
      try {
        debug('开始获取Twitter用户ID', {
          name: name
        });
        const logStatus = echoLog({
          type: 'gettingTwitterUserId',
          text: name,
          before: '[Twitter]'
        });
        const cachedUserId = this.#cache[name];
        if (cachedUserId) {
          debug('从缓存获取到Twitter用户ID', {
            name: name,
            id: cachedUserId
          });
          logStatus.success();
          return cachedUserId;
        }
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: 'https://x.com/i/api/graphql/jUKA--0QkqGIFhmfRZdWrQ/UserByScreenName' + `?variables=%7B%22screen_name%22%3A%22${name}%22%7D&features=%7B%22responsive_web_grok_bio_auto_translation_is_enabled%22%3Afalse%2C%22hidden_profile_subscriptions_enabled%22%3Atrue%2C%22payments_enabled%22%3Afalse%2C%22profile_label_improvements_pcf_label_in_post_enabled%22%3Atrue%2C%22rweb_tipjar_consumption_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22subscriptions_verification_info_is_identity_verified_enabled%22%3Atrue%2C%22subscriptions_verification_info_verified_since_enabled%22%3Atrue%2C%22highlights_tweets_tab_ui_enabled%22%3Atrue%2C%22responsive_web_twitter_article_notes_tab_enabled%22%3Atrue%2C%22subscriptions_feature_can_gift_premium%22%3Atrue%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%7D&fieldToggles=%7B%22withAuxiliaryUserLabels%22%3Atrue%7D`,
          method: 'GET',
          headers: {
            ...this.#headers,
            'content-type': 'application/json',
            referer: `https://x.com/${name}`,
            'x-client-transaction-id': await this.#getTID('GET', '/i/api/graphql/jUKA--0QkqGIFhmfRZdWrQ/UserByScreenName' + `?variables=%7B%22screen_name%22%3A%22${name}%22%7D&features=%7B%22responsive_web_grok_bio_auto_translation_is_enabled%22%3Afalse%2C%22hidden_profile_subscriptions_enabled%22%3Atrue%2C%22payments_enabled%22%3Afalse%2C%22profile_label_improvements_pcf_label_in_post_enabled%22%3Atrue%2C%22rweb_tipjar_consumption_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22subscriptions_verification_info_is_identity_verified_enabled%22%3Atrue%2C%22subscriptions_verification_info_verified_since_enabled%22%3Atrue%2C%22highlights_tweets_tab_ui_enabled%22%3Atrue%2C%22responsive_web_twitter_article_notes_tab_enabled%22%3Atrue%2C%22subscriptions_feature_can_gift_premium%22%3Atrue%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%7D&fieldToggles=%7B%22withAuxiliaryUserLabels%22%3Atrue%7D`),
            'x-xp-forwarded-for': this.#FwdForSdk.str
          },
          responseType: 'json'
        });
        if (result !== 'Success') {
          debug('获取Twitter用户ID请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status !== 200) {
          debug('获取Twitter用户ID状态错误', {
            status: data?.status,
            statusText: data?.statusText
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        let response = data.response || (typeof data.responseText === 'object' ? data.responseText : null);
        if (!response) {
          try {
            response = JSON.parse(data.responseText);
          } catch (error) {
            response = null;
          }
        }
        const fetchedUserId = response?.data?.user?.result?.rest_id;
        if (!fetchedUserId) {
          debug('未找到Twitter用户ID', {
            name: name
          });
          logStatus.error(`Error:${data.statusText}(${data.status})`);
          return false;
        }
        debug('成功获取Twitter用户ID', {
          name: name,
          id: fetchedUserId
        });
        this.#setCache(name, fetchedUserId);
        logStatus.success();
        return fetchedUserId;
      } catch (error) {
        debug('获取Twitter用户ID时发生错误', {
          error: error
        });
        throwError(error, 'Twitter.getUserId');
        return false;
      }
    }
    async #toggleRetweet(_ref9) {
      let {retweetId: retweetId, doTask: doTask = true, retry: retry = false} = _ref9;
      try {
        debug('开始处理Twitter转推任务', {
          retweetId: retweetId,
          doTask: doTask,
          retry: retry
        });
        if (!doTask && this.whiteList.retweets.includes(retweetId)) {
          debug('Twitter转推在白名单中，跳过取消', {
            retweetId: retweetId
          });
          echoLog({
            type: 'whiteList',
            text: 'Twitter.unretweet',
            id: retweetId,
            before: '[Twitter]'
          });
          return true;
        }
        const logStatus = echoLog({
          type: `${doTask ? '' : 'un'}retweetting`,
          text: retweetId,
          before: '[Twitter]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: `https://x.com/i/api/graphql/${doTask ? 'ojPdsZsimiJrUGLR1sjUtA/CreateRetweet' : 'iQtK4dl5hBmXewYZuEOKVw/DeleteRetweet'}`,
          method: 'POST',
          headers: {
            ...this.#headers,
            'Content-Type': 'application/json',
            origin: 'https://x.com',
            referer: 'https://x.com/home',
            'x-client-transaction-id': await this.#getTID('POST', `/i/api/graphql/${doTask ? 'ojPdsZsimiJrUGLR1sjUtA/CreateRetweet' : 'iQtK4dl5hBmXewYZuEOKVw/DeleteRetweet'}`),
            'x-xp-forwarded-for': this.#FwdForSdk.str
          },
          data: `{"variables":{"${doTask ? '' : 'source_'}tweet_id":"${retweetId}","dark_request":false},"queryId":"${doTask ? 'ojPdsZsimiJrUGLR1sjUtA' : 'iQtK4dl5hBmXewYZuEOKVw'}"}`,
          responseType: 'json'
        });
        if (result !== 'Success') {
          debug('Twitter转推操作请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status === 403 && data.response?.errors?.[0]?.code === 353 && !retry && data.responseHeaders?.['set-cookie']) {
          const newCt0 = data.responseHeaders['set-cookie']?.find((cookie => cookie.includes('ct0=')))?.split(';')?.at(0)?.split('=')?.at(-1);
          if (newCt0) {
            debug('获取到新的Twitter授权Token，重试操作');
            this.#auth.ct0 = newCt0;
            GM_setValue('twitterAuth', this.#auth);
            logStatus.warning(I18n('retry'));
            return this.#toggleRetweet({
              retweetId: retweetId,
              doTask: doTask,
              retry: true
            });
          }
        }
        if (data?.status !== 200 && !(data?.status === 403 && data.response?.errors?.[0]?.code === 327)) {
          debug('Twitter转推操作状态错误', {
            status: data?.status,
            statusText: data?.statusText
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        if (data.response?.errors && data.response?.errors?.[0]?.code !== 327) {
          debug('Twitter转推操作出错', {
            error: data.response?.errors?.[0]?.message
          });
          logStatus.error(`Error:${data.response?.errors?.[0]?.message}`);
          return false;
        }
        debug('Twitter转推操作成功', {
          retweetId: retweetId,
          doTask: doTask
        });
        logStatus.success();
        if (doTask) {
          this.tasks.retweets = unique([ ...this.tasks.retweets, retweetId ]);
        }
        return true;
      } catch (error) {
        debug('处理Twitter转推任务时发生错误', {
          error: error
        });
        throwError(error, 'Twitter.toggleRetweet');
        return false;
      }
    }
    async toggle(_ref0) {
      let {doTask: doTask = true, userLinks: userLinks = [], retweetLinks: retweetLinks = []} = _ref0;
      try {
        debug('开始处理Twitter链接任务', {
          doTask: doTask,
          userLinksCount: userLinks.length,
          retweetLinksCount: retweetLinks.length
        });
        if (!this.#initialized) {
          debug('Twitter模块未初始化');
          echoLog({
            text: I18n('needInit'),
            before: '[Twitter]'
          });
          return false;
        }
        if (doTask && !globalOptions.doTask.twitter.users || !doTask && !globalOptions.undoTask.twitter.users) {
          debug('根据全局选项跳过Twitter用户任务', {
            doTask: doTask
          });
          echoLog({
            type: 'globalOptionsSkip',
            text: 'twitter.users',
            before: '[Twitter]'
          });
        } else {
          const realUsers = this.getRealParams('users', userLinks, doTask, (link => link.match(/https:\/\/x\.com\/([^/]+)/)?.[1] || link.match(/https:\/\/twitter\.com\/([^/]+)/)?.[1]));
          debug('处理后的Twitter用户列表', {
            count: realUsers.length,
            users: realUsers
          });
          if (realUsers.length > 0) {
            for (const user of realUsers) {
              if (Date.now() > this.#FwdForSdk.expiryTimeMillis) {
                debug('Twitter SDK过期，重新获取', {
                  expiryTimeMillis: this.#FwdForSdk.expiryTimeMillis
                });
                this.#FwdForSdk = await getFwdForSdk();
              }
              await this.#toggleUser({
                name: user,
                doTask: doTask
              });
              await delay(1e3);
            }
          }
        }
        if (doTask && !globalOptions.doTask.twitter.retweets || !doTask && !globalOptions.undoTask.twitter.retweets) {
          debug('根据全局选项跳过Twitter转推任务', {
            doTask: doTask
          });
          echoLog({
            type: 'globalOptionsSkip',
            text: 'twitter.retweets',
            before: '[Twitter]'
          });
        } else {
          const realRetweets = this.getRealParams('retweets', retweetLinks, doTask, (link => link.match(/https:\/\/x\.com\/.*?\/status\/([\d]+)/)?.[1] || link.match(/https:\/\/twitter\.com\/.*?\/status\/([\d]+)/)?.[1]));
          debug('处理后的Twitter转推列表', {
            count: realRetweets.length,
            retweets: realRetweets
          });
          if (realRetweets.length > 0) {
            for (const retweet of realRetweets) {
              if (Date.now() > this.#FwdForSdk.expiryTimeMillis) {
                debug('Twitter SDK过期，重新获取');
                this.#FwdForSdk = await getFwdForSdk();
              }
              await this.#toggleRetweet({
                retweetId: retweet,
                doTask: doTask
              });
              await delay(1e3);
            }
          }
        }
        return true;
      } catch (error) {
        debug('处理Twitter链接任务时发生错误', {
          error: error
        });
        throwError(error, 'Twitter.toggle');
        return false;
      }
    }
    #setCache(name, id) {
      try {
        debug('设置Twitter用户ID缓存', {
          name: name,
          id: id
        });
        this.#cache[name] = id;
        GM_setValue('twitterCache', this.#cache);
      } catch (error) {
        debug('设置Twitter用户ID缓存时发生错误', {
          error: error
        });
        throwError(error, 'Twitter.setCache');
      }
    }
  }
  class Vk extends Social {
    tasks;
    whiteList;
    #username='';
    #cache=(() => GM_getValue('vkCache') || {})();
    #initialized=false;
    constructor() {
      super();
      const defaultTasksTemplate = {
        names: []
      };
      debug('初始化Vk实例');
      this.tasks = defaultTasksTemplate;
      this.whiteList = {
        ...defaultTasksTemplate,
        ...GM_getValue('whiteList')?.vk || {}
      };
    }
    async init() {
      try {
        debug('开始初始化Vk模块');
        if (this.#initialized) {
          debug('Vk模块已初始化');
          return true;
        }
        const isVerified = await this.#verifyAuth();
        if (isVerified) {
          debug('Vk授权验证成功');
          echoLog({
            before: '[Vk]'
          }).success(I18n('initSuccess', 'Vk'));
          this.#initialized = true;
          return true;
        }
        debug('Vk初始化失败');
        echoLog({
          before: '[Vk]'
        }).error(I18n('initFailed', 'Vk'));
        return false;
      } catch (error) {
        debug('Vk初始化发生错误', {
          error: error
        });
        throwError(error, 'Vk.init');
        return false;
      }
    }
    async #verifyAuth() {
      try {
        debug('开始验证Vk授权');
        const logStatus = echoLog({
          text: I18n('verifyAuth', 'Vk'),
          before: '[Vk]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: 'https://vk.com/im',
          method: 'GET'
        });
        if (result !== 'Success') {
          debug('Vk授权验证请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.finalUrl.includes('vk.com/login')) {
          debug('Vk授权验证失败：需要登录');
          logStatus.error(`Error:${I18n('loginVk')}`, true);
          return false;
        }
        if (data?.status !== 200) {
          debug('Vk授权验证状态错误', {
            status: data?.status,
            statusText: data?.statusText
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        this.#username = data.responseText.match(/TopNavBtn__profileLink" href="\/(.*?)"/)?.[1] || '';
        debug('Vk授权验证成功');
        logStatus.success();
        return true;
      } catch (error) {
        debug('Vk授权验证发生错误', {
          error: error
        });
        throwError(error, 'Vk.verifyAuth');
        return false;
      }
    }
    async #toggleGroup(name, dataParam) {
      let doTask = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      try {
        debug('开始处理Vk群组任务', {
          name: name,
          doTask: doTask
        });
        const logStatus = echoLog({
          type: doTask ? 'joiningVkGroup' : 'leavingVkGroup',
          text: name,
          before: '[Vk]'
        });
        if (dataParam.groupAct === 'enter' && !doTask || dataParam.groupAct === 'leave' && doTask) {
          debug('Vk群组操作已完成，跳过', {
            name: name,
            doTask: doTask
          });
          logStatus.success();
          return true;
        }
        const reqData = {
          act: doTask ? 'enter' : 'leave',
          al: 1,
          gid: dataParam.groupId,
          hash: dataParam.groupHash
        };
        if (doTask) {
          reqData.context = '_';
        }
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: 'https://vk.com/al_groups.php',
          method: 'POST',
          headers: {
            origin: 'https://vk.com',
            referer: `https://vk.com/${name}`,
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: $.param(reqData)
        });
        if (result !== 'Success') {
          debug('Vk群组操作请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status !== 200) {
          debug('Vk群组操作状态错误', {
            status: data?.status,
            statusText: data?.statusText
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        debug('Vk群组操作成功', {
          name: name,
          doTask: doTask
        });
        logStatus.success();
        if (doTask) {
          this.tasks.names = unique([ ...this.tasks.names, name ]);
        }
        return true;
      } catch (error) {
        debug('处理Vk群组任务时发生错误', {
          error: error
        });
        throwError(error, 'Vk.toggleGroup');
        return false;
      }
    }
    async #togglePublic(name, dataParam) {
      let doTask = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      try {
        debug('开始处理Vk公共页面任务', {
          name: name,
          doTask: doTask
        });
        const logStatus = echoLog({
          type: doTask ? 'joiningVkPublic' : 'leavingVkPublic',
          text: name,
          before: '[Vk]'
        });
        if (dataParam.publicJoined && doTask || !dataParam.publicJoined && !doTask) {
          debug('Vk公共页面操作已完成，跳过', {
            name: name,
            doTask: doTask
          });
          logStatus.success();
          return true;
        }
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: 'https://vk.com/al_public.php',
          method: 'POST',
          headers: {
            origin: 'https://vk.com',
            referer: `https://vk.com/${name}`,
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: $.param({
            act: doTask ? 'a_enter' : 'a_leave',
            al: 1,
            pid: dataParam.publicPid,
            hash: dataParam.publicHash
          })
        });
        if (result !== 'Success') {
          debug('Vk公共页面操作请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status !== 200) {
          debug('Vk公共页面操作状态错误', {
            status: data?.status,
            statusText: data?.statusText
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        debug('Vk公共页面操作成功', {
          name: name,
          doTask: doTask
        });
        logStatus.success();
        if (doTask) {
          this.tasks.names = unique([ ...this.tasks.names, name ]);
        }
        return true;
      } catch (error) {
        debug('处理Vk公共页面任务时发生错误', {
          error: error
        });
        throwError(error, 'Vk.togglePublic');
        return false;
      }
    }
    async #toggleLikeWall(name, dataParam) {
      let doTask = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      try {
        debug('开始处理Vk点赞任务', {
          name: name,
          doTask: doTask
        });
        const logStatus = echoLog({
          type: doTask ? 'likingVkPublic' : 'unlikingVkPublic',
          text: name,
          before: '[Vk]'
        });
        const postData = {
          act: 'a_set_reaction',
          al: 1,
          event_subtype: 'post_modal',
          from: 'wall_page',
          hash: dataParam.hash,
          object: dataParam.object,
          track_code: dataParam.trackCode,
          wall: 2
        };
        if (doTask) {
          postData.reaction_id = 0;
        }
        const {result: resultR, statusText: statusTextR, status: statusR, data: dataR} = await httpRequest({
          url: 'https://vk.com/like.php?act=a_set_reaction',
          method: 'POST',
          headers: {
            origin: 'https://vk.com',
            referer: `https://vk.com/${name}`,
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: $.param(postData)
        });
        if (resultR !== 'Success') {
          debug('Vk点赞操作请求失败', {
            result: resultR,
            statusText: statusTextR,
            status: statusR
          });
          logStatus.error(`${resultR}:${statusTextR}(${statusR})`);
          return false;
        }
        if (dataR?.status !== 200) {
          debug('Vk点赞操作状态错误', {
            status: dataR?.status,
            statusText: dataR?.statusText
          });
          logStatus.error(`Error:${dataR?.statusText}(${dataR?.status})`);
          return false;
        }
        if (dataR.response?.payload?.[1]?.[1]?.like_my !== true) {
          debug('Vk点赞操作验证失败');
          logStatus.error(`Error:${dataR?.statusText}(${dataR?.status})`);
          return false;
        }
        debug('Vk点赞操作成功', {
          name: name,
          doTask: doTask
        });
        logStatus.success();
        return true;
      } catch (error) {
        debug('处理Vk点赞任务时发生错误', {
          error: error
        });
        throwError(error, 'Vk.sendWall');
        return false;
      }
    }
    async #sendWall(name) {
      try {
        debug('开始处理Vk转发任务', {
          name: name
        });
        const logStatus = echoLog({
          type: 'sendingVkWall',
          text: name,
          before: '[Vk]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: 'https://vk.com/like.php',
          method: 'POST',
          headers: {
            origin: 'https://vk.com',
            referer: `https://vk.com/${name}`,
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: $.param({
            act: 'publish_box',
            al: 1,
            object: name
          })
        });
        if (result !== 'Success') {
          debug('Vk转发操作请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status !== 200) {
          debug('Vk转发操作状态错误', {
            status: data?.status,
            statusText: data?.statusText
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        const hash = data.responseText.match(/shHash:[\s]*'(.*?)'/)?.[1];
        if (!hash) {
          debug('获取Vk转发hash失败');
          logStatus.error('Error: Get "hash" failed');
          return false;
        }
        const {result: resultR, statusText: statusTextR, status: statusR, data: dataR} = await httpRequest({
          url: 'https://vk.com/like.php',
          method: 'POST',
          headers: {
            origin: 'https://vk.com',
            referer: `https://vk.com/${name}`,
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
        });
        if (resultR !== 'Success') {
          debug('Vk转发确认请求失败', {
            result: resultR,
            statusText: statusTextR,
            status: statusR
          });
          logStatus.error(`${resultR}:${statusTextR}(${statusR})`);
          return false;
        }
        if (dataR?.status !== 200) {
          debug('Vk转发确认状态错误', {
            status: dataR?.status,
            statusText: dataR?.statusText
          });
          logStatus.error(`Error:${dataR?.statusText}(${dataR?.status})`);
          return false;
        }
        const jsonData = JSON.parse(dataR.responseText?.replace('\x3c!--', '') || '{}');
        if (jsonData?.payload?.[1]?.[1]?.share_my !== true) {
          debug('Vk转发确认验证失败');
          logStatus.error(`Error:${dataR?.statusText}(${dataR?.status})`);
          return false;
        }
        debug('Vk转发操作成功', {
          name: name
        });
        logStatus.success();
        const postId = jsonData?.payload?.[1]?.[1]?.post_id;
        const ownerId = jsonData?.payload?.[1]?.[1]?.owner_id;
        if (postId && ownerId) {
          this.#setCache(name, `${ownerId}_${postId}`);
        }
        this.tasks.names = unique([ ...this.tasks.names, name ]);
        return true;
      } catch (error) {
        debug('处理Vk转发任务时发生错误', {
          error: error
        });
        throwError(error, 'Vk.sendWall');
        return false;
      }
    }
    async #deleteWall(name, dataParams) {
      try {
        debug('开始处理Vk删除墙任务', {
          name: name
        });
        const logStatus = echoLog({
          type: 'deletingVkWall',
          text: name,
          before: '[Vk]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: 'https://vk.com/al_wall.php?act=delete',
          method: 'POST',
          headers: {
            origin: 'https://vk.com',
            referer: `https://vk.com/${this.#username}?w=wall${this.#cache[name]}%2Fall`,
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: $.param({
            act: 'delete',
            al: 1,
            confirm: 0,
            from: 'wkview',
            hash: dataParams.wallHash,
            post: this.#cache[name]
          })
        });
        if (result !== 'Success') {
          debug('Vk删除墙请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status !== 200) {
          debug('Vk删除墙状态错误', {
            status: data?.status,
            statusText: data?.statusText
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        const jsonData = JSON.parse(data.responseText?.replace('\x3c!--', '') || '{}');
        if (!jsonData?.payload?.[1]?.[1]) {
          debug('Vk删除墙验证失败');
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        debug('Vk删除墙操作成功', {
          name: name
        });
        logStatus.success();
        return true;
      } catch (error) {
        debug('处理Vk删除墙任务时发生错误', {
          error: error
        });
        throwError(error, 'Vk.deleteWall');
        return false;
      }
    }
    async #getId(name, doTask) {
      try {
        debug('开始获取Vk ID', {
          name: name,
          doTask: doTask
        });
        let url = `https://vk.com/${name}`;
        if (/^wall-/.test(name)) {
          if (doTask) {
            return {
              type: 'sendWall'
            };
          }
          if (!this.#cache[name]) {
            return {
              type: 'unSupport'
            };
          }
          url = `https://vk.com/${this.#username}?w=wall${this.#cache[name]}`;
        }
        const logStatus = echoLog({
          type: 'gettingVkId',
          text: name,
          before: '[Vk]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: url,
          method: 'GET'
        });
        if (result !== 'Success') {
          debug('获取Vk ID请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status !== 200) {
          debug('获取Vk ID状态错误', {
            status: data?.status,
            statusText: data?.statusText
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        const [, groupAct, groupId, , groupHash] = data.responseText.match(/Groups.(enter|leave)\(.*?,.*?([\d]+?), (&#39;|')(.*?)(&#39;|')/) || [];
        const publicHash = data.responseText.match(/"enterHash":"(.*?)"/)?.[1];
        const publicPid = data.responseText.match(/"public_id":([\d]+?),/)?.[1];
        const publicJoined = !data.responseText.includes('Public.subscribe');
        if (groupAct && groupId && groupHash) {
          debug('获取到Vk群组ID', {
            groupAct: groupAct,
            groupId: groupId,
            groupHash: groupHash
          });
          logStatus.success();
          return {
            groupAct: groupAct,
            groupId: groupId,
            groupHash: groupHash,
            type: 'group'
          };
        }
        if (publicHash && publicPid) {
          debug('获取到Vk公共页面ID', {
            publicHash: publicHash,
            publicPid: publicPid,
            publicJoined: publicJoined
          });
          logStatus.success();
          return {
            publicHash: publicHash,
            publicPid: publicPid,
            publicJoined: publicJoined,
            type: 'public'
          };
        }
        if (name.includes('action=like')) {
          const hash = data.responseText.match(/data-reaction-hash="(.*?)"/)?.[1];
          const trackCode = data.responseText.match(/data-post-track-code="(.*?)"/)?.[1];
          const object = name.match(/wall-[\w_]+/)?.[0];
          if (hash && trackCode && object) {
            debug('获取到Vk点赞ID', {
              hash: hash,
              trackCode: trackCode,
              object: object
            });
            logStatus.success();
            return {
              type: 'likeWall',
              hash: hash,
              trackCode: trackCode,
              object: object
            };
          }
        }
        if (data.responseText.includes('wall.deletePost') && !doTask) {
          const wallHash = data.responseText.match(/wall\.deletePost\(this, '.*?', '(.*?)'\)/)?.[1];
          if (wallHash) {
            debug('获取到Vk删除墙ID', {
              wallHash: wallHash
            });
            logStatus.success();
            return {
              type: 'deleteWall',
              wallHash: wallHash
            };
          }
        }
        if (name.includes('wall') && doTask) {
          debug('获取到Vk墙ID');
          logStatus.success();
          return {
            type: 'sendWall'
          };
        }
        debug('未找到Vk ID参数');
        logStatus.error('Error: Parameters not found!');
        return false;
      } catch (error) {
        debug('获取Vk ID时发生错误', {
          error: error
        });
        throwError(error, 'Vk.getId');
        return false;
      }
    }
    async #toggleVk(_ref1) {
      let {name: name, doTask: doTask = true} = _ref1;
      try {
        debug('开始处理Vk任务', {
          name: name,
          doTask: doTask
        });
        if (!doTask && this.whiteList.names.includes(name)) {
          debug('Vk任务在白名单中，跳过', {
            name: name
          });
          echoLog({
            type: 'whiteList',
            text: 'Vk.undoTask',
            id: name,
            before: '[Vk]'
          });
          return true;
        }
        const formatName = name.replace(/\/$/, '');
        const data = await this.#getId(formatName, doTask);
        if (!data) {
          return false;
        }
        switch (data.type) {
         case 'group':
          return await this.#toggleGroup(formatName, data, doTask);

         case 'public':
          return await this.#togglePublic(formatName, data, doTask);

         case 'likeWall':
          return await this.#toggleLikeWall(formatName, data, doTask);

         case 'sendWall':
          return doTask ? await this.#sendWall(formatName) : true;

         case 'deleteWall':
          return doTask ? true : await this.#deleteWall(formatName, data);

         default:
          debug('未知的Vk任务类型', {
            type: data.type
          });
          return false;
        }
      } catch (error) {
        debug('处理Vk任务时发生错误', {
          error: error
        });
        throwError(error, 'Vk.toggleVk');
        return false;
      }
    }
    async toggle(_ref10) {
      let {doTask: doTask = true, nameLinks: nameLinks = []} = _ref10;
      try {
        debug('开始处理Vk链接任务', {
          doTask: doTask,
          nameLinksCount: nameLinks.length
        });
        if (!this.#initialized) {
          debug('Vk模块未初始化');
          echoLog({
            text: I18n('needInit'),
            before: '[Vk]'
          });
          return false;
        }
        const prom = [];
        if (doTask && !globalOptions.doTask.vk.names || !doTask && !globalOptions.undoTask.vk.names) {
          debug('根据全局选项跳过Vk任务', {
            doTask: doTask
          });
          echoLog({
            type: 'globalOptionsSkip',
            text: 'vk.names',
            before: '[Vk]'
          });
        } else {
          const realNames = this.getRealParams('names', nameLinks, doTask, (link => link.match(/https:\/\/vk\.com\/([^/]+)/)?.[1]));
          debug('处理后的Vk链接列表', {
            count: realNames.length,
            names: realNames
          });
          if (realNames.length > 0) {
            for (const name of realNames) {
              prom.push(this.#toggleVk({
                name: name,
                doTask: doTask
              }));
              await delay(1e3);
            }
          }
        }
        return Promise.all(prom).then((() => true));
      } catch (error) {
        debug('处理Vk链接任务时发生错误', {
          error: error
        });
        throwError(error, 'Vk.toggle');
        return false;
      }
    }
    #setCache(name, postId) {
      try {
        debug('设置Vk缓存', {
          name: name,
          postId: postId
        });
        this.#cache[name] = postId;
        GM_setValue('vkCache', this.#cache);
      } catch (error) {
        debug('设置Vk缓存时发生错误', {
          error: error
        });
        throwError(error, 'Vk.setCache');
      }
    }
  }
  const getInfo = async function(link, type) {
    try {
      debug('开始获取YouTube信息', {
        link: link,
        type: type
      });
      const logStatus = echoLog({
        text: I18n('gettingYtbToken'),
        before: '[Youtube]'
      });
      const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
        url: link,
        method: 'GET'
      });
      if (result !== 'Success') {
        debug('获取YouTube信息请求失败', {
          result: result,
          statusText: statusText,
          status: status
        });
        logStatus.error(`${result}:${statusText}(${status})`);
        return {};
      }
      if (data?.status !== 200) {
        debug('获取YouTube信息状态错误', {
          status: data?.status,
          statusText: data?.statusText
        });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return {};
      }
      if (data.responseText.includes('accounts.google.com/ServiceLogin?service=youtube')) {
        debug('获取YouTube信息失败：需要登录');
        logStatus.error(`Error:${I18n('loginYtb')}`, true);
        return {
          needLogin: true
        };
      }
      const apiKey = data.responseText.match(/"INNERTUBE_API_KEY":"(.*?)"/)?.[1];
      const context = (data.responseText.match(/\(\{"INNERTUBE_CONTEXT":([\w\W]*?)\}\)/) || data.responseText.match(/"INNERTUBE_CONTEXT":([\w\W]*?\}),"INNERTUBE/))?.[1] || '{}';
      const {client: client, request: request} = JSON.parse(context);
      if (!apiKey || !client || !request) {
        debug('获取YouTube信息失败：缺少必要参数');
        logStatus.error('Error: Parameter "apiKey" not found!');
        return {};
      }
      client.hl = 'en';
      if (type === 'channel') {
        const channelId = data.responseText.match(/"channelId":"(.+?)"/)?.[1];
        if (!channelId) {
          debug('获取YouTube频道ID失败');
          logStatus.error('Error: Get "channelId" failed!');
          return {};
        }
        debug('成功获取YouTube频道信息', {
          channelId: channelId
        });
        logStatus.success();
        return {
          params: {
            apiKey: apiKey,
            client: client,
            request: request,
            channelId: channelId
          }
        };
      }
      if (type === 'likeVideo') {
        const videoId = data.responseText.match(/<link rel="shortlinkUrl" href="https:\/\/youtu\.be\/(.*?)">/)?.[1];
        const likeParams = data.responseText.match(/"likeParams":"(.*?)"/)?.[1];
        if (!videoId) {
          debug('获取YouTube视频ID失败');
          logStatus.error('Error: Get "videoId" failed!');
          return {};
        }
        debug('成功获取YouTube视频信息', {
          videoId: videoId
        });
        logStatus.success();
        return {
          params: {
            apiKey: apiKey,
            client: client,
            request: request,
            videoId: videoId,
            likeParams: likeParams
          }
        };
      }
      debug('未知的YouTube信息类型', {
        type: type
      });
      logStatus.error('Error: Unknown type');
      return {};
    } catch (error) {
      debug('获取YouTube信息时发生错误', {
        error: error
      });
      throwError(error, 'Youtube.getInfo');
      return {};
    }
  };
  class Youtube extends Social {
    tasks;
    whiteList;
    #auth=(() => GM_getValue('youtubeAuth') || {})();
    #initialized=false;
    #verifyChannel=(() => `https://www.youtube.com/channel/${globalOptions.other.youtubeVerifyChannel}`)();
    constructor() {
      super();
      const defaultTasksTemplate = {
        channels: [],
        likes: []
      };
      debug('初始化YouTube实例');
      this.tasks = defaultTasksTemplate;
      this.whiteList = {
        ...defaultTasksTemplate,
        ...GM_getValue('whiteList')?.youtube || {}
      };
    }
    async init() {
      try {
        debug('开始初始化YouTube模块');
        if (this.#initialized) {
          debug('YouTube模块已初始化');
          return true;
        }
        if (!this.#auth.PAPISID) {
          debug('YouTube授权信息不完整，需要更新授权');
          if (await this.#updateAuth()) {
            this.#initialized = true;
            return true;
          }
          return false;
        }
        const isVerified = await this.#verifyAuth();
        if (isVerified) {
          debug('YouTube授权验证成功');
          echoLog({
            before: '[Youtube]'
          }).success(I18n('initSuccess', 'Youtube'));
          this.#initialized = true;
          return true;
        }
        debug('YouTube授权失效，尝试重新获取');
        GM_setValue('youtubeAuth', null);
        if (await this.#updateAuth()) {
          debug('YouTube重新授权成功');
          echoLog({
            before: '[Youtube]'
          }).success(I18n('initSuccess', 'Youtube'));
          this.#initialized = true;
          return true;
        }
        debug('YouTube初始化失败');
        echoLog({
          before: '[Youtube]'
        }).error(I18n('initFailed', 'Youtube'));
        return false;
      } catch (error) {
        debug('YouTube初始化发生错误', {
          error: error
        });
        throwError(error, 'Youtube.init');
        return false;
      }
    }
    async #verifyAuth() {
      try {
        debug('开始验证YouTube授权');
        return await this.#toggleChannel({
          link: this.#verifyChannel,
          doTask: true,
          verify: true
        });
      } catch (error) {
        debug('YouTube授权验证发生错误', {
          error: error
        });
        throwError(error, 'Youtube.verifyAuth');
        return false;
      }
    }
    async #updateAuth() {
      try {
        debug('开始更新YouTube授权');
        const logStatus = echoLog({
          text: I18n('updatingAuth', 'Youtube'),
          before: '[Youtube]'
        });
        return await new Promise((resolve => {
          GM_cookie.list({
            url: 'https://www.youtube.com/@YouTube'
          }, (async (cookies, error) => {
            if (!error) {
              const PAPISID = cookies.find((cookie => cookie.name === '__Secure-3PAPISID'))?.value;
              if (PAPISID) {
                debug('成功获取YouTube新授权信息');
                GM_setValue('youtubeAuth', {
                  PAPISID: PAPISID
                });
                this.#auth = {
                  PAPISID: PAPISID
                };
                logStatus.success();
                resolve(await this.#verifyAuth());
              } else {
                debug('获取YouTube授权失败：未登录');
                logStatus.error(I18n('needLogin'));
                resolve(false);
              }
            } else {
              debug('获取YouTube授权失败', {
                error: error
              });
              logStatus.error('Error: Update youtube auth failed!');
              resolve(false);
            }
          }));
        }));
      } catch (error) {
        debug('更新YouTube授权时发生错误', {
          error: error
        });
        throwError(error, 'Youtube.updateAuth');
        return false;
      }
    }
    #getInfo(link, type) {
      debug('调用获取YouTube信息方法', {
        link: link,
        type: type
      });
      return getInfo(link, type);
    }
    async #toggleChannel(_ref11) {
      let {link: link, doTask: doTask = true, verify: verify = false} = _ref11;
      try {
        debug('开始处理YouTube频道任务', {
          link: link,
          doTask: doTask,
          verify: verify
        });
        const {params: params, needLogin: needLogin} = await this.#getInfo(link, 'channel');
        const {apiKey: apiKey, client: client, request: request, channelId: channelId} = params || {};
        if (needLogin) {
          debug('YouTube频道操作失败：需要登录');
          echoLog({
            html: I18n('loginYtb'),
            before: '[Youtube]'
          });
          return false;
        }
        if (!(apiKey && client && request && channelId)) {
          debug('YouTube频道操作失败：获取参数失败');
          echoLog({
            text: '"getYtbToken" failed',
            before: '[Youtube]'
          });
          return false;
        }
        if (!doTask && !verify && this.whiteList.channels.includes(channelId)) {
          debug('YouTube频道在白名单中，跳过取消订阅', {
            channelId: channelId
          });
          echoLog({
            type: 'whiteList',
            text: 'Youtube.unfollowChannel',
            id: channelId,
            before: '[Youtube]'
          });
          return true;
        }
        const logStatus = verify ? echoLog({
          text: I18n('verifyingAuth', 'Youtube'),
          before: '[Youtube]'
        }) : echoLog({
          type: doTask ? 'followingYtbChannel' : 'unfollowingYtbChannel',
          text: channelId,
          before: '[Youtube]'
        });
        const nowTime = parseInt(String((new Date).getTime() / 1e3), 10);
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: `https://www.youtube.com/youtubei/v1/subscription/${doTask ? '' : 'un'}subscribe?key=${apiKey}&prettyPrint=false`,
          method: 'POST',
          headers: {
            origin: 'https://www.youtube.com',
            referer: `https://www.youtube.com/channel/${channelId}`,
            'content-type': 'application/json',
            'x-goog-authuser': '0',
            'x-goog-visitor-id': client?.visitorData,
            'x-origin': 'https://www.youtube.com',
            authorization: `SAPISIDHASH ${nowTime}_${sha1(`${nowTime} ${this.#auth.PAPISID} https://www.youtube.com`)}`
          },
          data: JSON.stringify({
            context: {
              client: client,
              request: {
                sessionId: request?.sessionId,
                internalExperimentFlags: [],
                consistencyTokenJars: []
              },
              user: {}
            },
            channelIds: [ channelId ],
            params: doTask ? 'EgIIAhgA' : 'CgIIAhgA'
          })
        });
        if (result !== 'Success') {
          debug('YouTube频道操作请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status !== 200) {
          debug('YouTube频道操作状态错误', {
            status: data?.status,
            statusText: data?.statusText
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        const isSubscribed = doTask && (/"subscribed":true/.test(data.responseText) || data.responseText.includes('The subscription already exists'));
        const isUnsubscribed = !doTask && /"subscribed":false/.test(data.responseText);
        const isVerified = verify && data.responseText.includes('You may not subscribe to yourself');
        if (isSubscribed || isUnsubscribed || isVerified) {
          debug('YouTube频道操作成功', {
            doTask: doTask,
            verify: verify
          });
          logStatus.success();
          if (doTask && !verify) {
            this.tasks.channels = unique([ ...this.tasks.channels, link ]);
          }
          return true;
        }
        debug('YouTube频道操作失败，需要更新授权');
        logStatus.error(I18n('tryUpdateYtbAuth'), true);
        return false;
      } catch (error) {
        debug('处理YouTube频道任务时发生错误', {
          error: error
        });
        throwError(error, 'Youtube.toggleChannel');
        return false;
      }
    }
    async #toggleLikeVideo(_ref12) {
      let {link: link, doTask: doTask = true} = _ref12;
      try {
        debug('开始处理YouTube视频点赞任务', {
          link: link,
          doTask: doTask
        });
        const {params: params, needLogin: needLogin} = await this.#getInfo(link, 'likeVideo');
        const {apiKey: apiKey, client: client, request: request, videoId: videoId, likeParams: likeParams} = params || {};
        if (needLogin) {
          debug('YouTube视频点赞失败：需要登录');
          echoLog({
            html: `${I18n('loginYtb')}`,
            before: '[Youtube]'
          });
          return false;
        }
        if (!(apiKey && client && request && videoId && likeParams)) {
          debug('YouTube视频点赞失败：获取参数失败');
          echoLog({
            text: '"getYtbToken" failed',
            before: '[Youtube]'
          });
          return false;
        }
        if (!doTask && this.whiteList.likes.includes(videoId)) {
          debug('YouTube视频在白名单中，跳过取消点赞', {
            videoId: videoId
          });
          echoLog({
            type: 'whiteList',
            text: 'Youtube.unlikeVideo',
            id: videoId,
            before: '[Youtube]'
          });
          return true;
        }
        const logStatus = echoLog({
          type: doTask ? 'likingYtbVideo' : 'unlikingYtbVideo',
          text: videoId,
          before: '[Youtube]'
        });
        const nowTime = parseInt(String((new Date).getTime() / 1e3), 10);
        const likeVideoData = {
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
        };
        if (doTask && !likeParams) {
          debug('YouTube视频点赞失败：缺少likeParams参数');
          logStatus.error('Empty likeParams');
          return false;
        }
        if (doTask) {
          likeVideoData.params = likeParams;
        }
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: `https://www.youtube.com/youtubei/v1/like/${doTask ? '' : 'remove'}like?key=${apiKey}`,
          method: 'POST',
          headers: {
            origin: 'https://www.youtube.com',
            referer: `https://www.youtube.com/watch?v=${videoId}`,
            'content-type': 'application/json',
            'x-goog-authuser': '0',
            'x-goog-visitor-id': client.visitorData,
            'x-origin': 'https://www.youtube.com',
            authorization: `SAPISIDHASH ${nowTime}_${sha1(`${nowTime} ${this.#auth.PAPISID} https://www.youtube.com`)}`
          },
          data: JSON.stringify(likeVideoData)
        });
        if (result !== 'Success') {
          debug('YouTube视频点赞请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status !== 200) {
          debug('YouTube视频点赞状态错误', {
            status: data?.status,
            statusText: data?.statusText
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        const isLiked = doTask && data.responseText.includes('Added to Liked videos');
        const isUnliked = !doTask && (data.responseText.includes('Removed from Liked videos') || data.responseText.includes('Dislike removed'));
        if (isLiked || isUnliked) {
          debug('YouTube视频点赞操作成功', {
            doTask: doTask
          });
          logStatus.success();
          if (doTask) {
            this.tasks.likes = unique([ ...this.tasks.likes, link ]);
          }
          return true;
        }
        debug('YouTube视频点赞失败，需要更新授权');
        logStatus.error(I18n('tryUpdateYtbAuth'), true);
        return false;
      } catch (error) {
        debug('处理YouTube视频点赞任务时发生错误', {
          error: error
        });
        throwError(error, 'Youtube.toggleLikeVideo');
        return false;
      }
    }
    async toggle(_ref13) {
      let {doTask: doTask = true, channelLinks: channelLinks = [], videoLinks: videoLinks = []} = _ref13;
      try {
        debug('开始处理YouTube链接任务', {
          doTask: doTask,
          channelLinksCount: channelLinks.length,
          videoLinksCount: videoLinks.length
        });
        if (!this.#initialized) {
          debug('YouTube模块未初始化');
          echoLog({
            text: I18n('needInit'),
            before: '[Youtube]'
          });
          return false;
        }
        const prom = [];
        const shouldProcessChannels = doTask && globalOptions.doTask.youtube.channels || !doTask && globalOptions.undoTask.youtube.channels;
        const shouldProcessVideos = doTask && globalOptions.doTask.youtube.likes || !doTask && globalOptions.undoTask.youtube.likes;
        if (!shouldProcessChannels) {
          debug('根据全局选项跳过YouTube频道任务', {
            doTask: doTask
          });
          echoLog({
            type: 'globalOptionsSkip',
            text: 'youtube.channels',
            before: '[Youtube]'
          });
        } else {
          const realChannels = this.getRealParams('channels', channelLinks, doTask, (link => {
            if (/^https:\/\/(www\.)?google\.com.*?\/url\?.*?url=https:\/\/www\.youtube\.com\/.*/.test(link)) {
              return link.match(/url=(https:\/\/www\.youtube\.com\/.*)/)?.[1];
            }
            return link;
          }));
          debug('处理后的YouTube频道链接列表', {
            count: realChannels.length,
            channels: realChannels
          });
          if (realChannels.length > 0) {
            for (const channel of realChannels) {
              prom.push(this.#toggleChannel({
                link: channel,
                doTask: doTask
              }));
              await delay(1e3);
            }
          }
        }
        if (!shouldProcessVideos) {
          debug('根据全局选项跳过YouTube视频任务', {
            doTask: doTask
          });
          echoLog({
            type: 'globalOptionsSkip',
            text: 'youtube.likes',
            before: '[Youtube]'
          });
        } else {
          const realLikes = this.getRealParams('likes', videoLinks, doTask, (link => {
            if (/^https:\/\/(www\.)?google\.com.*?\/url\?.*?url=https:\/\/www\.youtube\.com\/.*/.test(link)) {
              return link.match(/url=(https:\/\/www\.youtube\.com\/.*)/)?.[1];
            }
            return link;
          }));
          debug('处理后的YouTube视频链接列表', {
            count: realLikes.length,
            videos: realLikes
          });
          if (realLikes.length > 0) {
            for (const video of realLikes) {
              prom.push(this.#toggleLikeVideo({
                link: video,
                doTask: doTask
              }));
              await delay(1e3);
            }
          }
        }
        return Promise.all(prom).then((() => true));
      } catch (error) {
        debug('处理YouTube链接任务时发生错误', {
          error: error
        });
        throwError(error, 'Youtube.toggle');
        return false;
      }
    }
  }
  class SteamASF {
    #asfOptions;
    #botName='asf';
    #groupInfo;
    #steamWebApiKey;
    #steamId;
    constructor(_ref14) {
      let {AsfIpcUrl: AsfIpcUrl, AsfIpcPassword: AsfIpcPassword, AsfBotname: AsfBotname, steamWebApiKey: steamWebApiKey} = _ref14;
      debug('初始化SteamASF实例', {
        AsfIpcUrl: AsfIpcUrl,
        AsfBotname: AsfBotname
      });
      const asfCommandsUrl = new URL('/Api/Command/', AsfIpcUrl);
      this.#asfOptions = {
        url: asfCommandsUrl.href,
        method: 'POST',
        responseType: 'json',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Host: asfCommandsUrl.host,
          Origin: asfCommandsUrl.origin,
          Referer: asfCommandsUrl.href,
          Authentication: AsfIpcPassword
        }
      };
      if (AsfBotname) {
        this.#botName = AsfBotname;
      }
      if (steamWebApiKey) {
        this.#steamWebApiKey = steamWebApiKey;
      }
      debug('SteamASF实例初始化完成', {
        botName: this.#botName
      });
    }
    async init() {
      try {
        debug('开始初始化ASF');
        const logStatus = echoLog({
          text: I18n('initingASF'),
          before: '[ASF]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          ...this.#asfOptions,
          data: '{"Command":"!stats"}'
        });
        if (result !== 'Success') {
          debug('ASF初始化请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.response?.Success === true && data.response.Message === 'OK' && data.response.Result) {
          debug('ASF初始化成功');
          logStatus.success();
          return true;
        }
        if (data?.response?.Result || data?.response?.Message) {
          debug('ASF初始化失败', {
            result: data?.response?.Result,
            message: data?.response?.Message
          });
          logStatus.error(data?.response?.Result || data.response.Message);
          return false;
        }
        debug('ASF初始化失败', {
          statusText: data?.statusText,
          status: data?.status
        });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      } catch (error) {
        debug('ASF初始化发生错误', {
          error: error
        });
        throwError(error, 'SteamASF.init');
        return false;
      }
    }
    async joinGroup(groupName) {
      try {
        debug('开始加入Steam组', {
          groupName: groupName
        });
        const logStatus = echoLog({
          type: 'joiningSteamGroup',
          text: groupName,
          before: '[ASF]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          ...this.#asfOptions,
          data: JSON.stringify({
            Command: `!JOINGROUP ${this.#botName} ${groupName}`
          })
        });
        if (result !== 'Success') {
          debug('加入Steam组请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status === 200 && [ '已加入', '已申请', 'Joined', 'Applied', 'Присоединился', 'costs' ].find((text => data.response?.Result?.includes(text)))) {
          debug('成功加入Steam组', {
            groupName: groupName
          });
          logStatus.success();
          return true;
        }
        debug('加入Steam组失败', {
          result: data?.response?.Result,
          message: data?.response?.Message
        });
        logStatus.error(`Error:${data?.response?.Result || data?.response?.Message || data?.statusText}(${data?.status})`);
        return false;
      } catch (error) {
        debug('加入Steam组时发生错误', {
          error: error,
          groupName: groupName
        });
        throwError(error, 'SteamASF.joinGroup');
        return false;
      }
    }
    joinOfficialGroup=this.joinGroup;
    leaveOfficialGroup=this.leaveGroup;
    async leaveGroup(groupName) {
      try {
        debug('开始退出Steam组', {
          groupName: groupName
        });
        if (!this.#groupInfo) {
          debug('未找到组信息，尝试获取组ID');
          if (!await this.#getGroupId()) {
            return false;
          }
        }
        const groupId = await this.#groupInfo[groupName];
        if (!groupId) {
          debug('未找到组ID', {
            groupName: groupName
          });
          return false;
        }
        const logStatus = echoLog({
          type: 'leavingSteamGroup',
          text: groupName,
          before: '[ASF]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          ...this.#asfOptions,
          data: JSON.stringify({
            Command: `!LEAVEGROUP ${this.#botName} ${groupId}`
          })
        });
        if (result !== 'Success') {
          debug('退出Steam组请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status === 200 && [ '成功', 'Success', 'Успех' ].find((text => data.response?.Result?.includes(text)))) {
          debug('成功退出Steam组', {
            groupName: groupName
          });
          logStatus.success();
          return true;
        }
        debug('退出Steam组失败', {
          result: data?.response?.Result,
          message: data?.response?.Message
        });
        logStatus.error(`Error:${data?.response?.Result || data?.response?.Message || data?.statusText}(${data?.status})`);
        return false;
      } catch (error) {
        debug('退出Steam组时发生错误', {
          error: error,
          groupName: groupName
        });
        throwError(error, 'SteamASF.leaveGroup');
        return false;
      }
    }
    async #getGroupId() {
      try {
        debug('开始获取Steam组ID列表');
        const logStatus = echoLog({
          type: 'gettingSteamGroupId',
          text: 'All',
          before: '[ASF]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          ...this.#asfOptions,
          data: JSON.stringify({
            Command: `!GROUPLIST ${this.#botName}`
          })
        });
        if (result !== 'Success') {
          debug('获取Steam组ID列表请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status === 200 && data.response?.Result?.includes('|')) {
          this.#groupInfo = Object.fromEntries(data.response.Result.split('\n').map((line => {
            const [, name, id] = line.trim().split('|');
            if (name && id) {
              return [ name, id ];
            }
            return null;
          })).filter((ele => ele)));
          debug('成功获取Steam组ID列表', {
            groupCount: Object.keys(this.#groupInfo).length
          });
          logStatus.success();
          return true;
        }
        debug('获取Steam组ID列表失败', {
          result: data?.response?.Result,
          message: data?.response?.Message
        });
        logStatus.error(`Error:${data?.response?.Result || data?.response?.Message || data?.statusText}(${data?.status})`);
        return false;
      } catch (error) {
        debug('获取Steam组ID列表时发生错误', {
          error: error
        });
        throwError(error, 'SteamASF.getGroupID');
        return false;
      }
    }
    async addToWishlist(gameId) {
      try {
        debug('开始添加游戏到愿望单', {
          gameId: gameId
        });
        const logStatus = echoLog({
          type: 'addingToWishlist',
          text: gameId,
          before: '[ASF]'
        });
        const gameStatus = await this.#checkGame(gameId);
        if (gameStatus.wishlist === true) {
          debug('游戏已在愿望单中', {
            gameId: gameId
          });
          logStatus.success();
          return true;
        }
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          ...this.#asfOptions,
          data: JSON.stringify({
            Command: `!ADDWISHLIST ${this.#botName} ${gameId}`
          })
        });
        if (result !== 'Success') {
          debug('添加游戏到愿望单请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status === 200 && [ '成功', 'Success', 'Успех' ].find((text => data.response?.Result?.includes(text)))) {
          debug('成功添加游戏到愿望单', {
            gameId: gameId
          });
          logStatus.success();
          return true;
        }
        debug('添加游戏到愿望单失败', {
          result: data?.response?.Result,
          message: data?.response?.Message
        });
        logStatus.error(`Error:${data?.response?.Result || data?.response?.Message || data?.statusText}(${data?.status})`);
        return false;
      } catch (error) {
        debug('添加游戏到愿望单时发生错误', {
          error: error,
          gameId: gameId
        });
        throwError(error, 'SteamASF.addToWishlist');
        return false;
      }
    }
    async removeFromWishlist(gameId) {
      try {
        debug('开始从愿望单移除游戏', {
          gameId: gameId
        });
        const logStatus = echoLog({
          type: 'removingFromWishlist',
          text: gameId,
          before: '[ASF]'
        });
        const gameStatus = await this.#checkGame(gameId);
        if (gameStatus.wishlist === false) {
          debug('游戏已不在愿望单中', {
            gameId: gameId
          });
          logStatus.success();
          return true;
        }
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          ...this.#asfOptions,
          data: JSON.stringify({
            Command: `!REMOVEWISHLIST ${this.#botName} ${gameId}`
          })
        });
        if (result !== 'Success') {
          debug('从愿望单移除游戏请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status === 200 && [ '成功', 'Success', 'Успех' ].find((text => data.response?.Result?.includes(text)))) {
          debug('成功从愿望单移除游戏', {
            gameId: gameId
          });
          logStatus.success();
          return true;
        }
        debug('从愿望单移除游戏失败', {
          result: data?.response?.Result,
          message: data?.response?.Message
        });
        logStatus.error(`Error:${data?.response?.Result || data?.response?.Message || data?.statusText}(${data?.status})`);
        return false;
      } catch (error) {
        debug('从愿望单移除游戏时发生错误', {
          error: error,
          gameId: gameId
        });
        throwError(error, 'SteamASF.removeFromWishlist');
        return false;
      }
    }
    async toggleFollowGame(gameId, doTask) {
      try {
        debug('开始处理游戏关注状态', {
          gameId: gameId,
          doTask: doTask
        });
        const logStatus = echoLog({
          type: `${doTask ? '' : 'un'}followingGame`,
          text: gameId,
          before: '[ASF]'
        });
        const gameStatus = await this.#checkGame(gameId);
        if (doTask && gameStatus.followed === true || !doTask && gameStatus.followed === false) {
          debug('游戏关注状态已符合要求', {
            gameId: gameId,
            doTask: doTask,
            currentStatus: gameStatus.followed
          });
          logStatus.success();
          return true;
        }
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          ...this.#asfOptions,
          data: JSON.stringify({
            Command: `!${doTask ? '' : 'UN'}FOLLOWGAME ${this.#botName} ${gameId}`
          })
        });
        if (result !== 'Success') {
          debug('处理游戏关注状态请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status === 200 && [ '成功', 'Success', 'Успех' ].find((text => data.response?.Result?.includes(text)))) {
          debug('成功处理游戏关注状态', {
            gameId: gameId,
            doTask: doTask
          });
          logStatus.success();
          return true;
        }
        debug('处理游戏关注状态失败', {
          result: data?.response?.Result,
          message: data?.response?.Message
        });
        logStatus.error(`Error:${data?.response?.Result || data?.response?.Message || data?.statusText}(${data?.status})`);
        return false;
      } catch (error) {
        debug('处理游戏关注状态时发生错误', {
          error: error,
          gameId: gameId,
          doTask: doTask
        });
        throwError(error, 'SteamASF.toggleFollowGame');
        return false;
      }
    }
    async #checkGame(gameId) {
      try {
        debug('开始检查游戏状态', {
          gameId: gameId
        });
        const {result: result, data: data} = await httpRequest({
          ...this.#asfOptions,
          data: JSON.stringify({
            Command: `!CHECK ${this.#botName} ${gameId}`
          })
        });
        if (result !== 'Success') {
          debug('检查游戏状态请求失败', {
            result: result
          });
          return {};
        }
        if (data?.status !== 200 || !data.response?.Result?.includes(gameId)) {
          debug('检查游戏状态响应无效', {
            status: data?.status
          });
          return {};
        }
        const matchedResult = data.response.Result.split('\n').find((result => result.includes(gameId)))?.split('|');
        if (!matchedResult || matchedResult.length <= 3) {
          debug('未找到游戏状态信息', {
            gameId: gameId
          });
          return {};
        }
        const status = {
          wishlist: matchedResult.at(-3).trim() === '√' || matchedResult.at(-2).trim() === '√',
          followed: matchedResult.at(-1).trim() === '√'
        };
        debug('成功获取游戏状态', {
          gameId: gameId,
          status: status
        });
        return status;
      } catch (error) {
        debug('检查游戏状态时发生错误', {
          error: error,
          gameId: gameId
        });
        throwError(error, 'SteamASF.checkGame');
        return {};
      }
    }
    async toggleCurator(curatorId) {
      let doTask = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      try {
        debug('开始处理鉴赏家关注状态', {
          curatorId: curatorId,
          doTask: doTask
        });
        const logStatus = echoLog({
          type: doTask ? 'followingCurator' : 'unfollowingCurator',
          text: curatorId,
          before: '[ASF]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          ...this.#asfOptions,
          data: JSON.stringify({
            Command: `!${doTask ? '' : 'UN'}FOLLOWCURATOR ${this.#botName} ${curatorId}`
          })
        });
        if (result !== 'Success') {
          debug('处理鉴赏家关注状态请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status === 200 && [ '成功', 'Success', 'Успех' ].find((text => data.response?.Result?.includes(text)))) {
          debug('成功处理鉴赏家关注状态', {
            curatorId: curatorId,
            doTask: doTask
          });
          logStatus.success();
          return true;
        }
        if (data?.status === 200) {
          debug('处理鉴赏家关注状态失败', {
            result: data?.response?.Result,
            message: data?.response?.Message
          });
          logStatus.error(I18n('curatorLimitNotice'));
          return false;
        }
        debug('处理鉴赏家关注状态失败', {
          result: data?.response?.Result,
          message: data?.response?.Message
        });
        logStatus.error(`Error:${data?.response?.Result || data?.response?.Message || data?.statusText}(${data?.status})`);
        return false;
      } catch (error) {
        debug('处理鉴赏家关注状态时发生错误', {
          error: error,
          curatorId: curatorId,
          doTask: doTask
        });
        throwError(error, 'Steam.toggleCurator');
        return false;
      }
    }
    async addLicense(id) {
      try {
        debug('开始添加许可证', {
          id: id
        });
        const [type, ids] = id.split('-');
        const idsArr = ids.split(',');
        if (type === 'appid') {
          const logStatus = echoLog({
            type: 'addingFreeLicense',
            text: ids,
            before: '[ASF]'
          });
          const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
            ...this.#asfOptions,
            data: JSON.stringify({
              Command: `!addlicense ${this.#botName} ${idsArr.map((id => `app/${id}`)).join(',')}`
            })
          });
          if (result !== 'Success') {
            debug('添加应用许可证请求失败', {
              result: result,
              statusText: statusText,
              status: status
            });
            logStatus.error(`${result}:${statusText}(${status})`);
            return false;
          }
          if (data?.status === 200 && [ 'AlreadyPurchased', 'OK' ].find((text => data.response?.Result?.includes(text)))) {
            debug('成功添加应用许可证', {
              ids: ids
            });
            logStatus.success();
            return true;
          }
          debug('添加应用许可证失败', {
            result: data?.response?.Result,
            message: data?.response?.Message
          });
          logStatus.error(`Error:${data?.response?.Result || data?.response?.Message || data?.statusText}(${data?.status})`);
          return false;
        }
        if (type === 'subid') {
          const logStatus = echoLog({
            type: 'addingFreeLicenseSubid',
            text: ids,
            before: '[ASF]'
          });
          const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
            ...this.#asfOptions,
            data: JSON.stringify({
              Command: `!addlicense ${this.#botName} ${idsArr.map((id => `sub/${id}`)).join(',')}`
            })
          });
          if (result !== 'Success') {
            debug('添加订阅许可证请求失败', {
              result: result,
              statusText: statusText,
              status: status
            });
            logStatus.error(`${result}:${statusText}(${status})`);
            return false;
          }
          if (data?.status === 200 && data.response?.Result) {
            const resultLines = data.response.Result.split('\n');
            debug('处理订阅许可证结果', {
              resultLines: resultLines
            });
            idsArr.forEach((subid => {
              const targetLine = resultLines.find((text => text.includes(subid)));
              if (targetLine && [ '成功', 'Success', 'Успех' ].find((text => targetLine.includes(text)))) {
                debug('成功添加订阅许可证', {
                  subid: subid
                });
                echoLog({
                  before: '[ASF]'
                }).success(targetLine);
              } else {
                debug('添加订阅许可证失败', {
                  subid: subid,
                  targetLine: targetLine
                });
                echoLog({
                  before: '[ASF]'
                }).error(targetLine);
              }
            }));
            return true;
          }
          debug('添加订阅许可证失败', {
            result: data?.response?.Result,
            message: data?.response?.Message
          });
          logStatus.error(`Error:${data?.response?.Result || data?.response?.Message || data?.statusText}(${data?.status})`);
          return false;
        }
        debug('无效的许可证类型', {
          type: type
        });
        return false;
      } catch (error) {
        debug('添加许可证时发生错误', {
          error: error,
          id: id
        });
        throwError(error, 'SteamASF.addLicense');
        return false;
      }
    }
    async requestPlayTestAccess(id) {
      try {
        debug('开始请求游戏试玩权限', {
          id: id
        });
        const logStatus = echoLog({
          type: 'requestingPlayTestAccess',
          text: id,
          before: '[ASF]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          ...this.#asfOptions,
          data: JSON.stringify({
            Command: `!REQUESTACCESS ${this.#botName} ${id}`
          })
        });
        if (result !== 'Success') {
          debug('请求游戏试玩权限请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status === 200 && [ '成功', 'Success', 'Успех' ].find((text => data.response?.Result?.includes(text)))) {
          debug('成功请求游戏试玩权限', {
            id: id
          });
          logStatus.success();
          return true;
        }
        debug('请求游戏试玩权限失败', {
          result: data?.response?.Result,
          message: data?.response?.Message
        });
        logStatus.error(`Error:${data?.response?.Result || data?.response?.Message || data?.statusText}(${data?.status})`);
        return false;
      } catch (error) {
        debug('请求游戏试玩权限时发生错误', {
          error: error,
          id: id
        });
        throwError(error, 'SteamASF.requestPlayTestAccess');
        return false;
      }
    }
    async playGames(ids) {
      try {
        debug('开始挂游戏时长', {
          ids: ids
        });
        const logStatus = echoLog({
          text: I18n('playingGames', ids),
          before: '[ASF]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          ...this.#asfOptions,
          data: JSON.stringify({
            Command: `!play ${this.#botName} ${ids}`
          })
        });
        if (result !== 'Success') {
          debug('挂游戏时长请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status === 200 && [ '正在运行', '正在掛', 'Playing', 'Играет' ].find((text => data.response?.Result?.includes(text)))) {
          debug('成功开始挂游戏时长', {
            ids: ids
          });
          logStatus.success();
          return true;
        }
        debug('开始挂游戏时长失败', {
          result: data?.response?.Result,
          message: data?.response?.Message
        });
        logStatus.error(`Error:${data?.response?.Result || data?.response?.Message || data?.statusText}(${data?.status})`);
        return false;
      } catch (error) {
        debug('挂游戏时长时发生错误', {
          error: error,
          ids: ids
        });
        throwError(error, 'SteamASF.playGames');
        return false;
      }
    }
    async getSteamIdASF() {
      try {
        debug('开始获取Steam ID');
        const logStatus = echoLog({
          text: I18n('gettingSteamId'),
          before: '[ASF]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          ...this.#asfOptions,
          data: JSON.stringify({
            Command: `!steamid ${this.#botName}`
          })
        });
        if (result !== 'Success' || data?.status !== 200) {
          debug('获取Steam ID请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return '';
        }
        if (data.response?.Result) {
          const steamId = data.response.Result.trim()?.split(/\s+/)?.at(-1);
          if (steamId) {
            debug('成功获取Steam ID', steamId);
            logStatus.success();
            return steamId;
          }
        }
        debug('获取Steam ID失败', {
          result: data?.response?.Result,
          message: data?.response?.Message
        });
        logStatus.error(`Error:${data?.response?.Result || data?.response?.Message || data?.statusText}(${data?.status})`);
        return '';
      } catch (error) {
        debug('获取Steam ID时发生错误', {
          error: error
        });
        throwError(error, 'SteamASF.getSteamIdASF');
        return '';
      }
    }
    async getSteamIdWeb() {
      try {
        debug('开始获取Steam ID');
        const logStatus = echoLog({
          text: I18n('gettingSteamId'),
          before: '[Web]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: 'https://store.steampowered.com',
          method: 'GET',
          headers: {
            host: 'store.steampowered.com'
          }
        });
        if (result !== 'Success' || data?.status !== 200) {
          debug('获取Steam ID请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return '';
        }
        const steamId = data.responseText.match(/steamid&quot;:&quot;(\d+)/)?.[1];
        if (steamId) {
          debug('成功获取Steam ID', steamId);
          logStatus.success();
          return steamId;
        }
        debug('获取Steam ID失败', {
          data: data
        });
        logStatus.error(`${result}:${statusText}(${status})`);
        return '';
      } catch (error) {
        debug('获取Steam ID时发生错误', {
          error: error
        });
        throwError(error, 'SteamASF.getSteamIdWeb');
        return '';
      }
    }
    async getSteamId() {
      const steamId = await this.getSteamIdWeb();
      if (steamId) {
        return steamId;
      }
      return this.getSteamIdASF();
    }
    async checkPlayStatus(ids) {
      try {
        debug('开始检查挂游戏时长状态');
        if (!this.#steamWebApiKey) {
          debug('未设置Steam Web API Key');
          return 'skip';
        }
        if (!this.#steamId) {
          const steamId = await this.getSteamId();
          if (!steamId) {
            debug('未获取到Steam ID');
            return 'skip';
          }
          this.#steamId = steamId;
        }
        const logStatus = echoLog({
          text: I18n('checkingPlayStatus'),
          before: '[Web]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${this.#steamWebApiKey}&steamids=${this.#steamId}`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (result !== 'Success') {
          debug('检查挂游戏时长状态请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status === 200) {
          debug('挂游戏时长状态正常', {
            data: data
          });
          const playedIds = new Set(data.responseText?.match(/\d+/g));
          const neededIds = new Set(ids.match(/\d+/g));
          if (neededIds.intersection(playedIds).size > 0) {
            logStatus.success();
            return true;
          }
          logStatus.warning(I18n('noPlayStatus'));
          return false;
        }
        debug('挂游戏时长状态异常', {
          data: data
        });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      } catch (error) {
        debug('检查挂游戏时长状态时发生错误', {
          error: error
        });
        throwError(error, 'SteamASF.checkPlayStatus');
        return false;
      }
    }
    async stopPlayGames() {
      try {
        debug('开始停止挂游戏时长');
        const logStatus = echoLog({
          text: I18n('stoppingPlayGames'),
          before: '[ASF]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          ...this.#asfOptions,
          data: JSON.stringify({
            Command: `!resume ${this.#botName}`
          })
        });
        if (result !== 'Success') {
          debug('停止挂游戏时长请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status === 200 && [ '已经恢复', '已恢复', '已經繼續', '已繼續', 'resumed', 'возобновлён' ].find((text => data.response?.Result?.includes(text)))) {
          debug('成功停止挂游戏时长');
          logStatus.success();
          return true;
        }
        debug('停止挂游戏时长失败', {
          result: data?.response?.Result,
          message: data?.response?.Message
        });
        logStatus.error(`Error:${data?.response?.Result || data?.response?.Message || data?.statusText}(${data?.status})`);
        return false;
      } catch (error) {
        debug('停止挂游戏时长时发生错误', {
          error: error
        });
        throwError(error, 'SteamASF.stopPlayGames');
        return false;
      }
    }
    async #unsupportted(name) {
      try {
        debug('尝试使用不支持的功能', {
          name: name
        });
        echoLog({
          before: '[ASF]'
        }).warning(I18n('ASFNotSupportted', name));
        return false;
      } catch (error) {
        debug('处理不支持的功能时发生错误', {
          error: error,
          name: name
        });
        throwError(error, 'SteamASF.unsupportted');
        return false;
      }
    }
    async toggleForum() {
      return this.#unsupportted('toggleForum');
    }
    async toggleFavoriteWorkshop() {
      return this.#unsupportted('toggleFavoriteWorkshop');
    }
    async voteUpWorkshop() {
      return this.#unsupportted('voteUpWorkshop');
    }
    async likeAnnouncement() {
      return this.#unsupportted('likeAnnouncement');
    }
  }
  class SteamWeb {
    #cache={
      ...{
        group: {},
        officialGroup: {},
        forum: {},
        workshop: {},
        curator: {}
      },
      ...GM_getValue('steamCache')
    };
    #auth={};
    #storeInitialized=false;
    #communityInitialized=false;
    #area='CN';
    #oldArea;
    #areaStatus='end';
    constructor() {
      debug('初始化SteamWeb实例');
    }
    async init() {
      let type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'all';
      try {
        debug('开始初始化SteamWeb', {
          type: type
        });
        const initStoreResult = await this.initStore();
        debug('Steam商店初始化完成', {
          initStoreResult: initStoreResult
        });
        if (type === 'store') {
          return initStoreResult;
        }
        const initCommunityResult = await this.initCommunity(initStoreResult);
        debug('Steam社区初始化完成', {
          initCommunityResult: initCommunityResult
        });
        return initCommunityResult;
      } catch (error) {
        debug('SteamWeb初始化发生错误', {
          error: error,
          type: type
        });
        throwError(error, 'SteamWeb.init');
        return false;
      }
    }
    async initStore() {
      try {
        debug('开始初始化Steam商店');
        if (this.#storeInitialized) {
          return true;
        }
        let storeInitialized = await this.#updateStoreAuth();
        if (!storeInitialized) {
          storeInitialized = await this.#updateStoreAuthTab();
        }
        this.#storeInitialized = storeInitialized;
        if (!this.#storeInitialized) {
          echoLog({
            before: '[Web]'
          }).error(I18n('initFailed', 'Steam'));
          return false;
        }
        echoLog({
          before: '[Web]'
        }).success(I18n('initSuccess', 'SteamStore'));
        debug('Steam商店初始化完成');
        return true;
      } catch (error) {
        debug('Steam商店初始化发生错误', {
          error: error
        });
        throwError(error, 'SteamWeb.initStore');
        return false;
      }
    }
    async initCommunity(initStoreResult) {
      try {
        debug('开始初始化Steam社区');
        if (this.#communityInitialized) {
          return true;
        }
        let communityInitialized = await this.#updateCommunityAuth(initStoreResult);
        if (!communityInitialized) {
          communityInitialized = await this.#updateCommunityAuthTab();
          GM_setValue('steamCommunityAuth', null);
        }
        this.#communityInitialized = communityInitialized;
        if (!this.#communityInitialized) {
          echoLog({
            before: '[Web]'
          }).error(I18n('initFailed', 'Steam'));
          return false;
        }
        echoLog({
          before: '[Web]'
        }).success(I18n('initSuccess', 'SteamCommunity'));
        debug('Steam社区初始化完成');
        return true;
      } catch (error) {
        debug('Steam社区初始化发生错误', {
          error: error
        });
        throwError(error, 'SteamWeb.initCommunity');
        return false;
      }
    }
    async #refreshToken() {
      let type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'steamStore';
      try {
        debug('开始刷新令牌', {
          type: type
        });
        const host = {
          steamStore: 'store.steampowered.com',
          steamCommunity: 'steamcommunity.com'
        };
        const logStatus = echoLog({
          text: I18n('refreshingToken', I18n(type)),
          before: '[Web]'
        });
        debug('准备刷新令牌请求数据');
        const formData = new FormData;
        formData.append('redir', `https://${host[type]}/`);
        debug('发送刷新令牌请求');
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: 'https://login.steampowered.com/jwt/ajaxrefresh',
          method: 'POST',
          responseType: 'json',
          headers: {
            Host: 'login.steampowered.com',
            Origin: `https://${host[type]}`,
            Referer: `https://${host[type]}/`
          },
          data: formData
        });
        debug('收到刷新令牌响应', {
          result: result,
          status: status,
          statusText: statusText
        });
        if (result !== 'Success') {
          debug('请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (!data?.response?.success) {
          debug('响应不成功', {
            status: data?.status,
            statusText: data?.statusText
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        debug('开始设置新令牌');
        if (!await this.#setToken(data.response, type)) {
          debug('设置新令牌失败');
          logStatus.error('Error');
          return false;
        }
        debug('成功刷新令牌');
        logStatus.success();
        return true;
      } catch (error) {
        debug('刷新令牌时发生错误', {
          error: error
        });
        throwError(error, 'SteamWeb.refreshToken');
        return false;
      }
    }
    async #setToken(param, type) {
      try {
        const host = {
          steamStore: 'store.steampowered.com',
          steamCommunity: 'steamcommunity.com'
        };
        debug('开始设置Steam令牌', {
          type: type
        });
        const logStatus = echoLog({
          text: I18n('settingToken', I18n(type)),
          before: '[Web]'
        });
        debug('准备表单数据');
        const formData = new FormData;
        formData.append('steamID', param.steamID);
        formData.append('nonce', param.nonce);
        formData.append('redir', param.redir);
        formData.append('auth', param.auth);
        debug('表单数据准备完成', {
          steamID: param.steamID,
          nonce: param.nonce,
          redir: param.redir
        });
        debug('发送设置令牌请求');
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: `https://${host[type]}/login/settoken`,
          method: 'POST',
          headers: {
            Accept: 'application/json, text/plain, */*',
            Host: host[type],
            Origin: `https://${host[type]}`
          },
          data: formData
        });
        debug('收到设置令牌响应', {
          result: result,
          status: status,
          statusText: statusText
        });
        if (result !== 'Success') {
          debug('请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status !== 200) {
          debug('响应状态错误', {
            status: data?.status,
            statusText: data?.statusText
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        debug('成功设置令牌');
        logStatus.success();
        return true;
      } catch (error) {
        debug('设置令牌时发生错误', {
          error: error,
          type: type
        });
        throwError(error, 'SteamWeb.setToken');
        return false;
      }
    }
    async #updateStoreAuth() {
      let retry = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      try {
        debug('开始更新Steam商店身份验证');
        const logStatus = echoLog({
          text: I18n('updatingAuth', I18n('steamStore')),
          before: '[Web]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: 'https://store.steampowered.com/',
          method: 'GET',
          headers: {
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Upgrade-Insecure-Requests': '1'
          },
          redirect: 'manual'
        });
        debug('收到Steam商店身份验证响应', {
          result: result,
          statusText: statusText,
          status: status
        });
        if (data?.status !== 200) {
          if (![ 301, 302 ].includes(data?.status)) {
            debug('Steam商店身份验证状态错误', {
              status: data?.status
            });
            logStatus.error(`${result}:${statusText}(${status})`);
            return false;
          }
          if (!await this.#refreshToken('steamStore')) {
            debug('Steam商店身份验证刷新失败');
            logStatus.error(`Error:${I18n('needLoginSteamStore')}`, true);
            return false;
          }
          if (retry) {
            debug('Steam商店身份验证重试失败');
            logStatus.error(`Error:${I18n('needLoginSteamStore')}`, true);
            return false;
          }
          debug('Steam商店身份验证重试中');
          logStatus.warning(I18n('retry'));
          return this.#updateStoreAuth(true);
        }
        if (!data.responseText.includes('data-miniprofile=')) {
          if (await this.#refreshToken('steamStore')) {
            debug('Steam商店身份验证需要重试');
            logStatus.warning(I18n('retry'));
            if (retry) {
              debug('Steam商店身份验证重试次数超限');
              logStatus.error(`Error:${I18n('needLoginSteamStore')}`, true);
              return false;
            }
            return this.#updateStoreAuth(true);
          }
          debug('Steam商店身份验证失败：需要登录');
          logStatus.error(`Error:${I18n('needLoginSteamStore')}`, true);
          return false;
        }
        const storeSessionID = data.responseText.match(/g_sessionID = "(.+?)";/)?.[1];
        if (!storeSessionID) {
          debug('Steam商店身份验证失败：获取sessionID失败');
          logStatus.error('Error: Get "sessionID" failed');
          return false;
        }
        this.#auth.storeSessionID = storeSessionID;
        debug('Steam商店身份验证更新成功', {
          storeSessionID: storeSessionID
        });
        logStatus.success();
        return true;
      } catch (error) {
        debug('更新Steam商店身份验证时发生错误', {
          error: error
        });
        throwError(error, 'SteamWeb.updateStoreAuth');
        return false;
      }
    }
    async #updateStoreAuthTab() {
      try {
        debug('开始通过新标签页更新Steam商店身份验证');
        const logStatus = echoLog({
          text: I18n('updatingAuth', I18n('steamStoreTab')),
          before: '[Web]'
        });
        return await new Promise((resolve => {
          GM_deleteValue('steamStoreAuth');
          GM_setValue('ATv4_updateStoreAuth', true);
          const newTab = GM_openInTab('https://store.steampowered.com/', {
            active: true,
            setParent: true
          });
          debug('打开Steam商店新标签页');
          newTab.name = 'ATv4_updateStoreAuth';
          const listenerId = GM_addValueChangeListener('steamStoreAuth', ((key, oldValue, newValue) => {
            debug('监听到Steam商店身份验证值变化', {
              oldValue: oldValue,
              newValue: newValue
            });
            GM_removeValueChangeListener(listenerId);
            GM_deleteValue('ATv4_updateStoreAuth');
            newTab?.close();
            window.focus();
            if (newValue && JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
              this.#auth.storeSessionID = newValue.storeSessionID;
              debug('Steam商店身份验证更新成功', {
                storeSessionID: newValue.storeSessionID
              });
              logStatus.success();
              resolve(true);
              return;
            }
            debug('Steam商店身份验证更新失败');
            logStatus.error('Failed');
            resolve(false);
          }));
          newTab.onclose = () => {
            debug('Steam商店新标签页已关闭');
            GM_deleteValue('ATv4_updateStoreAuth');
          };
        }));
      } catch (error) {
        debug('通过新标签页更新Steam商店身份验证时发生错误', {
          error: error
        });
        throwError(error, 'SteamWeb.updateStoreAuthTab');
        return false;
      }
    }
    async #updateCommunityAuthTab() {
      try {
        debug('开始通过新标签页更新Steam社区身份验证');
        const logStatus = echoLog({
          text: I18n('updatingAuth', I18n('steamCommunityTab')),
          before: '[Web]'
        });
        return await new Promise((resolve => {
          GM_deleteValue('steamCommunityAuth');
          GM_setValue('ATv4_updateCommunityAuth', true);
          const newTab = GM_openInTab('https://steamcommunity.com/my', {
            active: true,
            setParent: true
          });
          debug('打开Steam社区新标签页');
          newTab.name = 'ATv4_updateCommunityAuth';
          const listenerId = GM_addValueChangeListener('steamCommunityAuth', ((key, oldValue, newValue) => {
            debug('监听到Steam社区身份验证值变化', {
              oldValue: oldValue,
              newValue: newValue
            });
            GM_removeValueChangeListener(listenerId);
            GM_deleteValue('ATv4_updateCommunityAuth');
            newTab?.close();
            window.focus();
            if (newValue && JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
              this.#auth.steam64Id = newValue.steam64Id;
              this.#auth.communitySessionID = newValue.communitySessionID;
              debug('Steam社区身份验证更新成功', {
                steam64Id: newValue.steam64Id,
                communitySessionID: newValue.communitySessionID
              });
              logStatus.success();
              resolve(true);
              return;
            }
            debug('Steam社区身份验证更新失败');
            logStatus.error('Failed');
            resolve(false);
          }));
          newTab.onclose = () => {
            debug('Steam社区新标签页已关闭');
            GM_deleteValue('ATv4_updateCommunityAuth');
          };
        }));
      } catch (error) {
        debug('通过新标签页更新Steam社区身份验证时发生错误', {
          error: error
        });
        throwError(error, 'SteamWeb.updateCommunityAuthTab');
        return false;
      }
    }
    async #updateCommunityAuth(initStoreResult) {
      let retry = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      try {
        debug('开始更新Steam社区身份验证');
        const logStatus = echoLog({
          text: I18n('gettingUserInfo'),
          before: '[Web]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: 'https://steamcommunity.com/my',
          method: 'GET',
          headers: {
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            Host: 'steamcommunity.com',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate'
          },
          redirect: 'follow'
        });
        debug('收到Steam社区身份验证响应', {
          result: result,
          statusText: statusText,
          status: status
        });
        if (data?.status !== 200) {
          debug('Steam社区身份验证状态错误', {
            status: data?.status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data.finalUrl.includes('https://steamcommunity.com/login/home')) {
          if (initStoreResult) {
            if (await this.#refreshToken('steamCommunity')) {
              debug('Steam社区身份验证需要重试');
              logStatus.warning(I18n('retry'));
              if (retry) {
                debug('Steam社区身份验证重试次数超限');
                logStatus.error(`Error:${I18n('needLoginSteamCommunity')}`, true);
                return false;
              }
              return this.#updateCommunityAuth(initStoreResult, retry);
            }
          }
          debug('Steam社区身份验证失败：需要登录');
          logStatus.error(`Error:${I18n('needLoginSteamCommunity')}`, true);
          return false;
        }
        const steam64Id = data.responseText.match(/g_steamID = "(.+?)";/)?.[1];
        const communitySessionID = data.responseText.match(/g_sessionID = "(.+?)";/)?.[1];
        if (!steam64Id || !communitySessionID) {
          debug('Steam社区身份验证失败：获取身份信息失败');
          logStatus.error('Error: Get "sessionID" failed');
          return false;
        }
        this.#auth.steam64Id = steam64Id;
        this.#auth.communitySessionID = communitySessionID;
        debug('Steam社区身份验证更新成功', {
          steam64Id: steam64Id,
          communitySessionID: communitySessionID
        });
        logStatus.success();
        return true;
      } catch (error) {
        debug('更新Steam社区身份验证时发生错误', {
          error: error
        });
        throwError(error, 'SteamWeb.updateCommunityAuth');
        return false;
      }
    }
    async #getAreaInfo() {
      try {
        debug('开始获取Steam地区信息');
        const logStatus = echoLog({
          text: I18n('gettingAreaInfo'),
          before: '[Web]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: 'https://store.steampowered.com/cart/',
          method: 'GET'
        });
        debug('获取地区信息请求结果', {
          result: result,
          statusText: statusText,
          status: status
        });
        if (result !== 'Success' || data?.status !== 200) {
          debug('获取地区信息失败', {
            result: result,
            status: data?.status,
            statusText: data?.statusText
          });
          logStatus.error(result === 'Success' ? `Error:${data?.statusText}(${data?.status})` : `${result}:${statusText}(${status})`);
          return {};
        }
        const cartConfigRaw = data.responseText.match(/data-cart_config="(.*?)"/)?.[1];
        debug('cartConfigRaw提取结果', {
          cartConfigRaw: cartConfigRaw
        });
        const temp = document.createElement('div');
        temp.innerHTML = cartConfigRaw || '{}';
        const cartConfigStr = temp.textContent || temp.innerText;
        let cartConfig;
        try {
          cartConfig = JSON.parse(cartConfigStr);
          debug('cartConfig解析成功', {
            cartConfig: cartConfig
          });
        } catch (error) {
          debug('cartConfig解析失败', {
            error: error
          });
          logStatus.error('Error: get country info filed');
          console.error(error);
          return {};
        }
        if (!cartConfig.rgUserCountryOptions) {
          debug('未找到可更换地区');
          logStatus.warning('Warning: Area cannot be changed');
          return {};
        }
        const userInfoRaw = data.responseText.match(/data-userinfo="(.*?)"/)?.[1];
        debug('userInfoRaw提取结果', {
          userInfoRaw: userInfoRaw
        });
        const temp1 = document.createElement('div');
        temp1.innerHTML = userInfoRaw || '{}';
        const userInfoStr = temp1.textContent || temp1.innerText;
        let userInfo;
        try {
          userInfo = JSON.parse(userInfoStr);
          debug('userInfo解析成功', {
            userInfo: userInfo
          });
        } catch (error) {
          debug('userInfo解析失败', {
            error: error
          });
          logStatus.error('Error: get country info filed');
          console.error(error);
          return {};
        }
        const currentArea = userInfo.country_code;
        const areas = Object.keys(cartConfig.rgUserCountryOptions).filter((area => area !== 'help'));
        debug('地区信息提取', {
          currentArea: currentArea,
          areas: areas
        });
        if (!currentArea || areas.length === 0) {
          debug('未获取到当前地区或可更换地区为空', {
            currentArea: currentArea,
            areas: areas
          });
          logStatus.error('Error: get country info filed');
          return {};
        }
        this.#area = currentArea;
        debug('获取地区信息成功', {
          currentArea: currentArea,
          areas: areas
        });
        logStatus.success();
        return {
          currentArea: currentArea,
          areas: areas
        };
      } catch (error) {
        debug('获取地区信息时发生异常', {
          error: error
        });
        throwError(error, 'SteamWeb.getAreaInfo');
        return {};
      }
    }
    async #changeArea(area) {
      try {
        debug('开始更换Steam地区', {
          area: area
        });
        if (this.#areaStatus === 'waiting') {
          debug('当前地区状态为waiting，等待状态改变');
          await new Promise((resolve => {
            const checker = setInterval((() => {
              if (this.#areaStatus !== 'waiting') {
                clearInterval(checker);
                resolve(true);
              }
            }));
          }));
        }
        if (this.#area === area || !area && this.#area !== 'CN') {
          debug('无需更换地区', {
            currentArea: this.#area,
            targetArea: area
          });
          return true;
        }
        this.#areaStatus = 'waiting';
        let aimedArea = area;
        if (!aimedArea) {
          debug('未指定目标地区，自动获取可用地区');
          const {currentArea: currentArea, areas: areas} = await this.#getAreaInfo();
          debug('获取到地区信息', {
            currentArea: currentArea,
            areas: areas
          });
          if (!currentArea || !areas) {
            debug('获取地区信息失败', {
              currentArea: currentArea,
              areas: areas
            });
            this.#areaStatus = 'error';
            return false;
          }
          if (currentArea !== 'CN') {
            debug('当前地区不是CN，无需更换', {
              currentArea: currentArea
            });
            this.#areaStatus = 'skip';
            echoLog({
              text: I18n('notNeededChangeArea'),
              before: '[Web]'
            });
            return 'skip';
          }
          const anotherArea = areas.filter((area => area && area !== 'CN'));
          debug('可更换的其他地区', {
            anotherArea: anotherArea
          });
          if (!anotherArea || anotherArea.length === 0) {
            debug('没有可用的其他地区');
            this.#areaStatus = 'noAnotherArea';
            echoLog({
              text: I18n('noAnotherArea'),
              before: '[Web]'
            });
            return false;
          }
          [aimedArea] = anotherArea;
          debug('选定目标地区', {
            aimedArea: aimedArea
          });
        }
        const logStatus = echoLog({
          text: I18n('changingArea', aimedArea),
          before: '[Web]'
        });
        debug('发送更换地区请求', {
          aimedArea: aimedArea
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: 'https://store.steampowered.com/country/setcountry',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: $.param({
            cc: aimedArea,
            sessionid: this.#auth.storeSessionID
          })
        });
        debug('更换地区请求结果', {
          result: result,
          statusText: statusText,
          status: status
        });
        if (result !== 'Success' || data?.status !== 200 || data.responseText !== 'true') {
          debug('更换地区失败', {
            result: result,
            status: data?.status,
            statusText: data?.statusText,
            responseText: data?.responseText
          });
          this.#areaStatus = 'error';
          logStatus.error(result === 'Success' ? `Error:${data?.statusText}(${data?.status})` : `${result}:${statusText}(${status})`);
          return 'CN';
        }
        const {currentArea: currentArea} = await this.#getAreaInfo();
        debug('更换后获取到的当前地区', {
          currentArea: currentArea
        });
        if (currentArea) {
          this.#area = currentArea;
          if (!this.#oldArea) {
            this.#oldArea = currentArea;
          }
        }
        if (currentArea !== aimedArea) {
          debug('更换后当前地区与目标地区不符', {
            currentArea: currentArea,
            aimedArea: aimedArea
          });
          this.#areaStatus = 'error';
          logStatus.error('Error: change country filed');
          return 'CN';
        }
        this.#areaStatus = 'success';
        debug('更换地区成功', {
          currentArea: currentArea
        });
        logStatus.success();
        return currentArea;
      } catch (error) {
        debug('更换地区时发生异常', {
          error: error
        });
        this.#areaStatus = 'error';
        throwError(error, 'SteamWeb.changeArea');
        return false;
      }
    }
    async joinGroup(groupName) {
      try {
        debug('开始加入Steam组', {
          groupName: groupName
        });
        const logStatus = echoLog({
          type: 'joiningSteamGroup',
          text: groupName,
          before: '[Web]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: `https://steamcommunity.com/groups/${groupName}`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: $.param({
            action: 'join',
            sessionID: this.#auth.communitySessionID
          })
        });
        if (result !== 'Success') {
          debug('加入Steam组请求失败', {
            result: result
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status !== 200 || data.responseText.includes('grouppage_join_area')) {
          debug('加入Steam组失败', {
            status: data?.status
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        debug('成功加入Steam组', {
          groupName: groupName
        });
        logStatus.success();
        return true;
      } catch (error) {
        debug('加入Steam组时发生错误', {
          error: error,
          groupName: groupName
        });
        throwError(error, 'SteamWeb.joinGroup');
        return false;
      }
    }
    async leaveGroup(groupName) {
      try {
        debug('开始退出Steam组', {
          groupName: groupName
        });
        const groupId = await this.#getGroupId(groupName);
        if (!groupId) {
          return false;
        }
        const logStatus = echoLog({
          type: 'leavingSteamGroup',
          text: groupName,
          before: '[Web]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: `https://steamcommunity.com/profiles/${this.#auth.steam64Id}/home_process`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: $.param({
            sessionID: this.#auth.communitySessionID,
            action: 'leaveGroup',
            groupId: groupId
          })
        });
        if (result !== 'Success') {
          debug('退出Steam组请求失败', {
            result: result
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status !== 200 || !data.finalUrl.includes('groups')) {
          debug('退出Steam组失败', {
            status: data?.status
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        const hasGroupLink = $(data.responseText.replace(/<img.*?>/g, '').toLowerCase()).find(`a[href='https://steamcommunity.com/groups/${groupName.toLowerCase()}']`).length > 0;
        if (hasGroupLink) {
          debug('Error: Group link still exists');
          return false;
        }
        debug('成功退出Steam组', {
          groupName: groupName
        });
        logStatus.success();
        return true;
      } catch (error) {
        debug('退出Steam组时发生错误', {
          error: error,
          groupName: groupName
        });
        throwError(error, 'SteamWeb.leaveGroup');
        return false;
      }
    }
    async #getGroupId(groupName) {
      try {
        debug('开始获取Steam组ID', {
          groupName: groupName
        });
        const logStatus = echoLog({
          type: 'gettingSteamGroupId',
          text: groupName,
          before: '[Web]'
        });
        const cachedGroupId = this.#cache.group[groupName];
        if (cachedGroupId) {
          debug('从缓存中获取到组ID', {
            groupName: groupName,
            cachedGroupId: cachedGroupId
          });
          logStatus.success();
          return cachedGroupId;
        }
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: `https://steamcommunity.com/groups/${groupName}`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          }
        });
        debug('获取组ID请求结果', {
          result: result,
          statusText: statusText,
          status: status
        });
        if (result !== 'Success') {
          debug('获取组ID请求失败', {
            result: result
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status !== 200) {
          debug('获取组ID响应状态错误', {
            status: data?.status,
            statusText: data?.statusText
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        const matchedGroupId = data.responseText.match(/OpenGroupChat\( '([0-9]+)'/)?.[1];
        debug('正则提取组ID结果', {
          matchedGroupId: matchedGroupId
        });
        if (!matchedGroupId) {
          debug('未能提取到组ID', {
            groupName: groupName
          });
          logStatus.error(`Error:${data.statusText}(${data.status})`);
          return false;
        }
        this.#setCache('group', groupName, matchedGroupId);
        debug('组ID已缓存', {
          groupName: groupName,
          matchedGroupId: matchedGroupId
        });
        logStatus.success();
        return matchedGroupId;
      } catch (error) {
        debug('获取组ID时发生异常', {
          error: error,
          groupName: groupName
        });
        throwError(error, 'SteamWeb.getGroupID');
        return false;
      }
    }
    async joinOfficialGroup(gameId) {
      try {
        debug('开始加入Steam官方组', {
          gameId: gameId
        });
        const logStatus = echoLog({
          type: 'joiningSteamOfficialGroup',
          text: gameId,
          before: '[Web]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: `https://steamcommunity.com/games/${gameId}?action=join&sessionID=${this.#auth.communitySessionID}`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          }
        });
        if (result !== 'Success') {
          debug('加入Steam官方组请求失败', {
            result: result
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status !== 200 || data.responseText.includes('id="publicGroupJoin"')) {
          debug('加入Steam官方组失败', {
            status: data?.status
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        const groupId = data.responseText.match(/steam:\/\/friends\/joinchat\/([0-9]+)/)?.[1];
        if (groupId) {
          this.#setCache('officialGroup', gameId, groupId);
        }
        debug('成功加入Steam官方组', {
          gameId: gameId
        });
        logStatus.success();
        return true;
      } catch (error) {
        debug('加入Steam官方组时发生错误', {
          error: error,
          gameId: gameId
        });
        throwError(error, 'SteamWeb.joinOfficialGroup');
        return false;
      }
    }
    async leaveOfficialGroup(gameId) {
      try {
        debug('开始退出Steam官方组', {
          gameId: gameId
        });
        const groupId = await this.#getOfficialGroupId(gameId);
        if (!groupId) {
          return false;
        }
        const logStatus = echoLog({
          type: 'leavingSteamOfficialGroup',
          text: gameId,
          before: '[Web]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: `https://steamcommunity.com/profiles/${this.#auth.steam64Id}/home_process`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: $.param({
            sessionID: this.#auth.communitySessionID,
            action: 'leaveGroup',
            groupId: groupId
          })
        });
        if (result !== 'Success') {
          debug('退出Steam官方组请求失败', {
            result: result
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status !== 200) {
          debug('退出Steam官方组失败', {
            status: data?.status
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        const {result: resultR, statusText: statusTextR, status: statusR, data: dataR} = await httpRequest({
          url: `https://steamcommunity.com/games/${gameId}`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          }
        });
        if (resultR !== 'Success') {
          debug('退出Steam官方组时发生错误', {
            error: resultR,
            status: statusR,
            statusText: statusTextR
          });
          logStatus.error(`${resultR}:${statusTextR}(${statusR})`);
          return false;
        }
        if (dataR?.status !== 200 || !dataR.responseText.includes('id="publicGroupJoin"')) {
          debug('退出Steam官方组失败', {
            status: dataR?.status
          });
          logStatus.error(`Error:${dataR?.statusText}(${dataR?.status})`);
          return false;
        }
        debug('成功退出Steam官方组', {
          gameId: gameId
        });
        logStatus.success();
        return true;
      } catch (error) {
        debug('退出Steam官方组时发生错误', {
          error: error,
          gameId: gameId
        });
        throwError(error, 'SteamWeb.leaveOfficialGroup');
        return false;
      }
    }
    async #getOfficialGroupId(gameId) {
      try {
        debug('开始获取Steam官方群组ID', {
          gameId: gameId
        });
        const logStatus = echoLog({
          type: 'gettingSteamOfficialGroupId',
          text: gameId,
          before: '[Web]'
        });
        const cachedGroupId = this.#cache.officialGroup[gameId];
        if (cachedGroupId) {
          debug('从缓存中获取到官方群组ID', {
            gameId: gameId,
            cachedGroupId: cachedGroupId
          });
          logStatus.success();
          return cachedGroupId;
        }
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: `https://steamcommunity.com/games/${gameId}`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          }
        });
        debug('获取官方群组ID请求结果', {
          result: result,
          statusText: statusText,
          status: status
        });
        if (result !== 'Success') {
          debug('获取官方群组ID请求失败', {
            result: result
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status !== 200) {
          debug('获取官方群组ID响应状态错误', {
            status: data?.status,
            statusText: data?.statusText
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        const matchedGroupId = data.responseText.match(/steam:\/\/friends\/joinchat\/([0-9]+)/)?.[1];
        debug('正则提取官方群组ID结果', {
          matchedGroupId: matchedGroupId
        });
        if (!matchedGroupId) {
          debug('未能提取到官方群组ID', {
            gameId: gameId
          });
          logStatus.error(`Error:${data.statusText}(${data.status})`);
          return false;
        }
        this.#setCache('officialGroup', gameId, matchedGroupId);
        debug('官方群组ID已缓存', {
          gameId: gameId,
          matchedGroupId: matchedGroupId
        });
        logStatus.success();
        return matchedGroupId;
      } catch (error) {
        debug('获取官方群组ID时发生异常', {
          error: error,
          gameId: gameId
        });
        throwError(error, 'SteamWeb.getGroupID');
        return false;
      }
    }
    async addToWishlist(gameId) {
      try {
        debug('开始添加游戏到愿望单', {
          gameId: gameId
        });
        const logStatus = echoLog({
          type: 'addingToWishlist',
          text: gameId,
          before: '[Web]'
        });
        const {result: result, data: data} = await httpRequest({
          url: 'https://store.steampowered.com/api/addtowishlist',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: $.param({
            sessionid: this.#auth.storeSessionID,
            appid: gameId
          }),
          dataType: 'json'
        });
        if (result === 'Success' && data?.status === 200 && data.response?.success === true) {
          debug('成功添加游戏到愿望单', {
            gameId: gameId
          });
          logStatus.success();
          return true;
        }
        const {result: resultR, statusText: statusTextR, status: statusR, data: dataR} = await httpRequest({
          url: `https://store.steampowered.com/app/${gameId}`,
          method: 'GET'
        });
        if (resultR !== 'Success') {
          debug('添加游戏到愿望单请求失败', {
            result: resultR,
            status: statusR,
            statusText: statusTextR
          });
          logStatus.error(`${resultR}:${statusTextR}(${statusR})`);
          return false;
        }
        if (dataR?.status !== 200) {
          debug('添加游戏到愿望单失败', {
            status: dataR?.status
          });
          logStatus.error(`Error:${dataR?.statusText}(${dataR?.status})`);
          return false;
        }
        if (this.#area === 'CN' && dataR.responseText.includes('id="error_box"')) {
          debug('changeAreaNotice');
          if (!await this.#changeArea()) {
            return false;
          }
          return await this.addToWishlist(gameId);
        }
        if (dataR.responseText.includes('class="queue_actions_ctn"') && dataR.responseText.includes('class="already_in_library"')) {
          debug('成功添加游戏到愿望单', {
            gameId: gameId
          });
          logStatus.success();
          return true;
        }
        if (dataR.responseText.includes('class="queue_actions_ctn"') && dataR.responseText.includes('id="add_to_wishlist_area_success" style="display: none;') || !dataR.responseText.includes('class="queue_actions_ctn"')) {
          debug('添加游戏到愿望单失败', {
            status: dataR.statusText
          });
          logStatus.error(`Error:${dataR.statusText}(${dataR.status})`);
          return false;
        }
        debug('成功添加游戏到愿望单', {
          gameId: gameId
        });
        logStatus.success();
        return true;
      } catch (error) {
        debug('添加游戏到愿望单时发生错误', {
          error: error,
          gameId: gameId
        });
        throwError(error, 'SteamWeb.addToWishlist');
        return false;
      }
    }
    async removeFromWishlist(gameId) {
      try {
        debug('开始从愿望单移除游戏', {
          gameId: gameId
        });
        const logStatus = echoLog({
          type: 'removingFromWishlist',
          text: gameId,
          before: '[Web]'
        });
        const {result: result, data: data} = await httpRequest({
          url: 'https://store.steampowered.com/api/removefromwishlist',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: $.param({
            sessionid: this.#auth.storeSessionID,
            appid: gameId
          }),
          dataType: 'json'
        });
        if (result === 'Success' && data?.status === 200 && data.response?.success === true) {
          debug('成功从愿望单移除游戏', {
            gameId: gameId
          });
          logStatus.success();
          return true;
        }
        const {result: resultR, statusText: statusTextR, status: statusR, data: dataR} = await httpRequest({
          url: `https://store.steampowered.com/app/${gameId}`,
          method: 'GET'
        });
        if (resultR !== 'Success') {
          debug('从愿望单移除游戏请求失败', {
            result: resultR,
            status: statusR,
            statusText: statusTextR
          });
          logStatus.error(`${resultR}:${statusTextR}(${statusR})`);
          return false;
        }
        if (dataR?.status !== 200) {
          debug('从愿望单移除游戏失败', {
            status: dataR?.status
          });
          logStatus.error(`Error:${dataR?.statusText}(${dataR?.status})`);
          return false;
        }
        if (this.#area === 'CN' && dataR.responseText.includes('id="error_box"')) {
          debug('changeAreaNotice');
          const result = await this.#changeArea();
          if (!result || result === 'CN' || result === 'skip') {
            return false;
          }
          return await this.removeFromWishlist(gameId);
        }
        if (dataR.responseText.includes('class="queue_actions_ctn"') && (dataR.responseText.includes('ds_owned_flag ds_flag') || dataR.responseText.includes('add_to_wishlist_area'))) {
          debug('成功从愿望单移除游戏', {
            gameId: gameId
          });
          logStatus.success();
          return true;
        }
        debug('从愿望单移除游戏请求失败', {
          result: resultR,
          status: statusR,
          statusText: statusTextR
        });
        logStatus.error(`Error:${dataR.statusText}(${dataR.status})`);
        return false;
      } catch (error) {
        debug('从愿望单移除游戏时发生错误', {
          error: error,
          gameId: gameId
        });
        throwError(error, 'SteamWeb.removeFromWishlist');
        return false;
      }
    }
    async toggleFollowGame(gameId, doTask) {
      try {
        debug('开始处理游戏关注状态', {
          gameId: gameId,
          doTask: doTask
        });
        const logStatus = echoLog({
          type: `${doTask ? '' : 'un'}followingGame`,
          text: gameId,
          before: '[Web]'
        });
        const requestData = {
          sessionid: this.#auth.storeSessionID,
          appid: gameId
        };
        if (!doTask) {
          requestData.unfollow = '1';
        }
        const {result: result, data: data} = await httpRequest({
          url: 'https://store.steampowered.com/explore/followgame/',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: $.param(requestData)
        });
        if (result === 'Success' && data?.status === 200 && data.responseText === 'true') {
          debug('成功处理游戏关注状态', {
            gameId: gameId,
            doTask: doTask
          });
          logStatus.success();
          return true;
        }
        const followed = await this.#isFollowedGame(gameId);
        if (this.#area === 'CN' && followed === 'areaLocked') {
          debug('changeAreaNotice');
          if (!await this.#changeArea()) {
            return false;
          }
          return await this.toggleFollowGame(gameId, doTask);
        }
        if (doTask === followed) {
          debug('成功处理游戏关注状态', {
            gameId: gameId,
            doTask: doTask
          });
          logStatus.success();
          return true;
        }
        debug('处理游戏关注状态请求失败', {
          result: result
        });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      } catch (error) {
        debug('处理游戏关注状态时发生错误', {
          error: error,
          gameId: gameId,
          doTask: doTask
        });
        throwError(error, 'SteamWeb.toggleFollowGame');
        return false;
      }
    }
    async #isFollowedGame(gameId) {
      try {
        debug('开始判断Steam游戏是否已关注', {
          gameId: gameId
        });
        const {result: result, data: data} = await httpRequest({
          url: `https://store.steampowered.com/app/${gameId}`,
          method: 'GET'
        });
        debug('获取游戏页面请求结果', {
          result: result,
          status: data?.status
        });
        if (result !== 'Success') {
          debug('请求失败', {
            result: result
          });
          return false;
        }
        if (data?.status !== 200) {
          debug('响应状态错误', {
            status: data?.status
          });
          return false;
        }
        if (this.#area === 'CN' && data.responseText.includes('id="error_box"')) {
          debug('地区锁定，返回areaLocked', {
            area: this.#area
          });
          return 'areaLocked';
        }
        const isFollowed = $(data.responseText.replace(/<img.*?>/g, '')).find('.queue_control_button.queue_btn_follow>.btnv6_blue_hoverfade.btn_medium.queue_btn_active').css('display') !== 'none';
        debug('关注状态判断结果', {
          isFollowed: isFollowed
        });
        return isFollowed;
      } catch (error) {
        debug('判断游戏关注状态时发生异常', {
          error: error,
          gameId: gameId
        });
        throwError(error, 'SteamWeb.isFollowedGame');
        return false;
      }
    }
    async toggleForum(gameId) {
      let doTask = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      try {
        debug('开始处理论坛订阅状态', {
          gameId: gameId,
          doTask: doTask
        });
        const forumId = await this.#getForumId(gameId);
        if (!forumId) {
          return false;
        }
        const logStatus = echoLog({
          type: `${doTask ? '' : 'un'}subscribingForum`,
          text: gameId,
          before: '[Web]'
        });
        const [id, feature] = forumId.split('_');
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: `https://steamcommunity.com/forum/${id}/General/${doTask ? '' : 'un'}subscribe/${feature || '0'}/`,
          method: 'POST',
          responseType: 'json',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: $.param({
            sessionid: this.#auth.communitySessionID
          })
        });
        if (result !== 'Success') {
          debug('处理论坛订阅状态请求失败', {
            result: result
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return true;
        }
        if (data?.status !== 200 || data.response?.success !== 1 && data.response?.success !== 29) {
          debug('处理论坛订阅状态失败', {
            status: data?.status
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return true;
        }
        debug('成功处理论坛订阅状态', {
          gameId: gameId,
          doTask: doTask
        });
        logStatus.success();
        return true;
      } catch (error) {
        debug('处理论坛订阅状态时发生错误', {
          error: error,
          gameId: gameId,
          doTask: doTask
        });
        throwError(error, 'SteamWeb.toggleForum');
        return false;
      }
    }
    async #getForumId(gameId) {
      try {
        debug('开始获取Steam论坛ID', {
          gameId: gameId
        });
        const logStatus = echoLog({
          type: 'gettingForumId',
          text: gameId,
          before: '[Web]'
        });
        const cachedForumId = this.#cache.forum[gameId];
        if (cachedForumId) {
          debug('从缓存中获取到论坛ID', {
            gameId: gameId,
            cachedForumId: cachedForumId
          });
          logStatus.success();
          return cachedForumId;
        }
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: `https://steamcommunity.com/app/${gameId}/discussions/`,
          method: 'GET'
        });
        debug('获取论坛ID请求结果', {
          result: result,
          statusText: statusText,
          status: status
        });
        if (result !== 'Success') {
          debug('获取论坛ID请求失败', {
            result: result
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status !== 200) {
          debug('获取论坛ID响应状态错误', {
            status: data?.status,
            statusText: data?.statusText
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        const matchedForumId = data.responseText?.match(/General_([\d]+(_[\d]+)?)/)?.[1];
        debug('正则提取论坛ID结果', {
          matchedForumId: matchedForumId
        });
        if (!matchedForumId) {
          debug('未能提取到论坛ID', {
            gameId: gameId
          });
          logStatus.error(`Error:${data.statusText}(${data.status})`);
          return false;
        }
        this.#setCache('forum', gameId, matchedForumId);
        debug('论坛ID已缓存', {
          gameId: gameId,
          matchedForumId: matchedForumId
        });
        logStatus.success();
        return matchedForumId;
      } catch (error) {
        debug('获取论坛ID时发生异常', {
          error: error,
          gameId: gameId
        });
        throwError(error, 'SteamWeb.getForumId');
        return false;
      }
    }
    async toggleFavoriteWorkshop(id) {
      let doTask = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      try {
        debug('开始处理创意工坊收藏状态', {
          id: id,
          doTask: doTask
        });
        const appid = await this.#getWorkshopAppId(id);
        if (!appid) {
          return false;
        }
        const logStatus = echoLog({
          type: doTask ? 'favoritingWorkshop' : 'unfavoritingWorkshop',
          text: id,
          before: '[Web]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: `https://steamcommunity.com/sharedfiles/${doTask ? '' : 'un'}favorite`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: $.param({
            id: id,
            appid: appid,
            sessionid: this.#auth.communitySessionID
          })
        });
        if (result !== 'Success') {
          debug('处理创意工坊收藏状态请求失败', {
            result: result
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status !== 200 || data.responseText) {
          debug('处理创意工坊收藏状态失败', {
            status: data?.status
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        debug('成功处理创意工坊收藏状态', {
          id: id,
          doTask: doTask
        });
        logStatus.success();
        return true;
      } catch (error) {
        debug('处理创意工坊收藏状态时发生错误', {
          error: error,
          id: id,
          doTask: doTask
        });
        throwError(error, 'SteamWeb.toggleFavoriteWorkshop');
        return false;
      }
    }
    async #getWorkshopAppId(id) {
      try {
        debug('开始获取Steam创意工坊AppId', {
          id: id
        });
        const logStatus = echoLog({
          type: 'gettingWorkshopAppId',
          text: id,
          before: '[Web]'
        });
        const cachedAppId = this.#cache.workshop[id];
        if (cachedAppId) {
          debug('从缓存中获取到AppId', {
            id: id,
            cachedAppId: cachedAppId
          });
          logStatus.success();
          return cachedAppId;
        }
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: `https://steamcommunity.com/sharedfiles/filedetails/?id=${id}`,
          method: 'GET'
        });
        debug('获取创意工坊AppId请求结果', {
          result: result,
          statusText: statusText,
          status: status
        });
        if (result !== 'Success') {
          debug('获取创意工坊AppId请求失败', {
            result: result
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status !== 200) {
          debug('获取创意工坊AppId响应状态错误', {
            status: data?.status,
            statusText: data?.statusText
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        const matchedAppId = data.responseText.match(/<input type="hidden" name="appid" value="([\d]+?)" \/>/)?.[1];
        debug('正则提取AppId结果', {
          matchedAppId: matchedAppId
        });
        if (!matchedAppId) {
          debug('未能提取到AppId', {
            id: id
          });
          logStatus.error('Error: getWorkshopAppId failed');
          return false;
        }
        debug('AppId已缓存', {
          id: id,
          matchedAppId: matchedAppId
        });
        return matchedAppId;
      } catch (error) {
        debug('获取创意工坊AppId时发生异常', {
          error: error,
          id: id
        });
        throwError(error, 'SteamWeb.getWorkshopAppId');
        return false;
      }
    }
    async voteUpWorkshop(id) {
      try {
        debug('开始点赞创意工坊物品', {
          id: id
        });
        const logStatus = echoLog({
          type: 'votingUpWorkshop',
          text: id,
          before: '[Web]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: 'https://steamcommunity.com/sharedfiles/voteup',
          method: 'POST',
          responseType: 'json',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: $.param({
            id: id,
            sessionid: this.#auth.communitySessionID
          })
        });
        if (result !== 'Success') {
          debug('点赞创意工坊物品请求失败', {
            result: result
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return true;
        }
        if (data?.status !== 200 || data.response?.success !== 1) {
          debug('点赞创意工坊物品失败', {
            status: data?.status
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return true;
        }
        debug('成功点赞创意工坊物品', {
          id: id
        });
        logStatus.success();
        return true;
      } catch (error) {
        debug('点赞创意工坊物品时发生错误', {
          error: error,
          id: id
        });
        throwError(error, 'SteamWeb.voteUpWorkshop');
        return false;
      }
    }
    async toggleCurator(curatorId) {
      let doTask = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      try {
        debug('开始处理鉴赏家关注状态', {
          curatorId: curatorId,
          doTask: doTask
        });
        const logStatus = echoLog({
          type: doTask ? 'followingCurator' : 'unfollowingCurator',
          text: curatorId,
          before: '[Web]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: 'https://store.steampowered.com/curators/ajaxfollow',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: $.param({
            clanid: curatorId,
            sessionid: this.#auth.storeSessionID,
            follow: doTask
          }),
          dataType: 'json'
        });
        if (result !== 'Success') {
          debug('处理鉴赏家关注状态请求失败', {
            result: result
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.response?.success?.success === 25) {
          debug('处理鉴赏家关注状态失败', {
            status: data?.status,
            success: data?.response?.success,
            message: data?.response?.msg
          });
          logStatus.error(I18n('curatorLimitNotice'));
          return false;
        }
        if (data?.status !== 200 || data.response?.success?.success !== 1) {
          debug('处理鉴赏家关注状态失败', {
            status: data?.status,
            success: data?.response?.success
          });
          logStatus.error(`Error:${data?.statusText}(${data?.response?.success}` || `${data?.status})`);
          return false;
        }
        debug('成功处理鉴赏家关注状态', {
          curatorId: curatorId,
          doTask: doTask
        });
        logStatus.success();
        return true;
      } catch (error) {
        debug('处理鉴赏家关注状态时发生错误', {
          error: error,
          curatorId: curatorId,
          doTask: doTask
        });
        throwError(error, 'SteamWeb.toggleCurator');
        return false;
      }
    }
    async #getAnnouncementParams(appId, viewId) {
      try {
        debug('开始获取Steam公告参数', {
          appId: appId,
          viewId: viewId
        });
        const logStatus = echoLog({
          type: 'gettingAnnouncementParams',
          text: appId,
          id: viewId,
          before: '[Web]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: `https://store.steampowered.com/events/ajaxgetpartnerevent?appid=${appId}&announcement_gid=${viewId}&lang_list=6_0&last_modified_time=0&origin=https:%2F%2Fstore.steampowered.com&for_edit=false`,
          method: 'GET',
          responseType: 'json',
          headers: {
            Host: 'store.steampowered.com',
            Referer: `https://store.steampowered.com/news/app/${appId}/view/${viewId}`
          }
        });
        debug('获取公告参数请求结果', {
          result: result,
          statusText: statusText,
          status: status
        });
        if (result !== 'Success') {
          debug('获取公告参数请求失败', {
            result: result
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return {};
        }
        if (data?.status !== 200 || data?.response?.success !== 1) {
          debug('获取公告参数响应状态错误', {
            status: data?.status,
            statusText: data?.statusText,
            response: data?.response
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return {};
        }
        const {clanid: clanid, gid: gid} = data.response.event?.announcement_body || {};
        debug('公告参数提取', {
          clanid: clanid,
          gid: gid
        });
        if (!clanid) {
          debug('未能提取到clanid', {
            appId: appId,
            viewId: viewId
          });
          logStatus.error(`Error:${data.statusText}(${data.status})`);
          return {};
        }
        logStatus.success();
        debug('获取公告参数成功', {
          clanId: clanid,
          gid: gid
        });
        return {
          clanId: clanid,
          gid: gid
        };
      } catch (error) {
        debug('获取公告参数时发生异常', {
          error: error,
          appId: appId,
          viewId: viewId
        });
        throwError(error, 'SteamWeb.likeAnnouncement');
        return {};
      }
    }
    async likeAnnouncement(id) {
      try {
        debug('开始点赞公告', {
          id: id
        });
        const [appId, viewId] = id.split('/');
        if (!(appId && viewId)) {
          echoLog({
            before: '[Web]'
          }).error(`${I18n('missParams')}(id)`);
          return false;
        }
        const {clanId: clanId, gid: gid} = await this.#getAnnouncementParams(appId, viewId);
        if (!clanId) {
          return false;
        }
        const logStatus = echoLog({
          type: 'likingAnnouncement',
          text: appId,
          id: viewId,
          before: '[Web]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: `https://store.steampowered.com/updated/ajaxrateupdate/${gid || viewId}`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Host: 'store.steampowered.com',
            Origin: 'https://store.steampowered.com',
            Referer: `https://store.steampowered.com/news/app/${appId}/view/${viewId}`
          },
          data: $.param({
            sessionid: this.#auth.storeSessionID,
            voteup: 1,
            clanid: clanId,
            ajax: 1
          }),
          dataType: 'json'
        });
        if (result !== 'Success') {
          debug('点赞公告请求失败', {
            result: result
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status !== 200 || data.response.success !== 1) {
          debug('点赞公告失败', {
            status: data?.status
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        debug('成功点赞公告', {
          id: id
        });
        logStatus.success();
        return true;
      } catch (error) {
        debug('点赞公告时发生错误', {
          error: error,
          id: id
        });
        throwError(error, 'SteamWeb.likeAnnouncement');
        return false;
      }
    }
    async #appid2subid(id) {
      try {
        debug('开始将AppId转换为SubId', {
          id: id
        });
        const logStatus = echoLog({
          type: 'gettingSubid',
          text: id,
          before: '[Web]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: `https://store.steampowered.com/app/${id}`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          }
        });
        debug('获取App页面请求结果', {
          result: result,
          statusText: statusText,
          status: status
        });
        if (result !== 'Success') {
          debug('获取App页面请求失败', {
            result: result
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status !== 200) {
          debug('获取App页面响应状态错误', {
            status: data?.status,
            statusText: data?.statusText
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        if (data.responseText.includes('ds_owned_flag ds_flag') || data.responseText.includes('class="already_in_library"')) {
          debug('App已拥有', {
            id: id
          });
          logStatus.success(I18n('owned'));
          return true;
        }
        if (this.#area === 'CN' && data.responseText.includes('id="error_box"')) {
          debug('地区锁定，尝试更换地区', {
            area: this.#area
          });
          logStatus.warning(I18n('changeAreaNotice'));
          const result = await this.#changeArea();
          if (!result || result === 'CN' || result === 'skip') {
            debug('更换地区失败或未更换', {
              result: result
            });
            return false;
          }
          return await this.#appid2subid(id);
        }
        let subid = data.responseText.match(/name="subid" value="([\d]+?)"/)?.[1];
        debug('正则提取subid结果1', {
          subid: subid
        });
        if (subid) {
          logStatus.success();
          return subid;
        }
        subid = data.responseText.match(/AddFreeLicense\(\s*(\d+)/)?.[1];
        debug('正则提取subid结果2', {
          subid: subid
        });
        if (subid) {
          logStatus.success();
          return subid;
        }
        debug('未能提取到subid', {
          id: id
        });
        logStatus.error(`Error:${I18n('noSubid')}`);
        return false;
      } catch (error) {
        debug('AppId转SubId时发生异常', {
          error: error,
          id: id
        });
        throwError(error, 'SteamWeb.appid2subid');
        return false;
      }
    }
    async #getLicenses() {
      try {
        debug('开始获取Steam用户许可证信息');
        const logStatus = echoLog({
          text: I18n('gettingLicenses'),
          before: '[Web]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: `https://store.steampowered.com/dynamicstore/userdata/?t=${(new Date).getTime()}`,
          method: 'GET',
          responseType: 'json'
        });
        debug('获取许可证请求结果', {
          result: result,
          statusText: statusText,
          status: status
        });
        if (result !== 'Success') {
          debug('获取许可证请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status !== 200) {
          debug('获取许可证响应状态错误', {
            status: data?.status,
            statusText: data?.statusText
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        debug('获取到的许可证列表', {
          licenses: data.response?.rgOwnedPackages
        });
        logStatus.remove();
        return data.response?.rgOwnedPackages;
      } catch (error) {
        debug('获取许可证时发生异常', {
          error: error
        });
        throwError(error, 'SteamWeb.getLicenses');
        return false;
      }
    }
    async addLicense(id) {
      try {
        debug('开始添加许可证', {
          id: id
        });
        const [type, ids] = id.split('-');
        debug('解析许可证ID', {
          type: type,
          ids: ids
        });
        if (type !== 'appid' && type !== 'subid') {
          debug('无效的许可证类型', {
            type: type
          });
          return false;
        }
        if (type === 'appid') {
          debug('处理appid类型许可证', {
            ids: ids
          });
          const subid = await this.#appid2subid(ids);
          debug('appid转换为subid结果', {
            appid: ids,
            subid: subid
          });
          if (!subid) {
            debug('appid转换失败', {
              appid: ids
            });
            return false;
          }
          if (subid === true) {
            debug('appid已拥有', {
              appid: ids
            });
            return true;
          }
          const logStatus = echoLog({
            type: 'addingFreeLicense',
            text: ids,
            before: '[Web]'
          });
          debug('开始添加免费许可证', {
            subid: subid
          });
          if (!await this.#addFreeLicense(subid, logStatus)) {
            debug('添加免费许可证失败', {
              subid: subid
            });
            return false;
          }
          const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
            url: `https://store.steampowered.com/app/${ids}`,
            method: 'GET'
          });
          debug('验证许可证添加状态', {
            result: result,
            status: status,
            statusText: statusText
          });
          if (result !== 'Success') {
            debug('验证请求失败', {
              result: result,
              status: status,
              statusText: statusText
            });
            logStatus.error(`${result}:${statusText}(${status})`);
            return false;
          }
          if (data?.status !== 200) {
            debug('验证响应状态错误', {
              status: data?.status,
              statusText: data?.statusText
            });
            logStatus.error(`Error:${data?.statusText}(${data?.status})`);
            return false;
          }
          if (!data.responseText.includes('ds_owned_flag ds_flag') && !data.responseText.includes('class="already_in_library"')) {
            debug('未找到游戏拥有标记', {
              status: data.status,
              statusText: data.statusText
            });
            logStatus.error(`Error:${data.statusText}(${data.status})`);
            return false;
          }
          debug('appid许可证添加成功', {
            appid: ids
          });
          logStatus.success();
          return true;
        }
        if (this.#area === 'CN') {
          debug('当前区域为CN，尝试更改区域', {
            currentArea: this.#area
          });
          echoLog({
            before: '[Web]'
          }).success(I18n('tryChangeAreaNotice'));
          await this.#changeArea();
        }
        const logStatusArr = {};
        const idsArr = ids.split(',');
        debug('处理subid类型许可证', {
          idsArr: idsArr
        });
        for (const subid of idsArr) {
          debug('开始处理单个subid', {
            subid: subid
          });
          const logStatus = echoLog({
            type: 'addingFreeLicense',
            text: subid,
            before: '[Web]'
          });
          if (!await this.#addFreeLicense(subid, logStatus)) {
            debug('添加subid许可证失败', {
              subid: subid
            });
            return false;
          }
          logStatusArr[subid] = logStatus;
        }
        const licenses = await this.#getLicenses();
        debug('获取许可证列表', {
          licenses: licenses
        });
        if (!licenses) {
          debug('获取许可证列表失败');
          return false;
        }
        for (const subid of idsArr) {
          const hasLicense = licenses.includes(parseInt(subid, 10));
          debug('验证许可证添加状态', {
            subid: subid,
            hasLicense: hasLicense
          });
          if (hasLicense) {
            logStatusArr[subid].success();
          } else {
            logStatusArr[subid].error();
          }
        }
        debug('所有subid许可证处理完成', {
          idsArr: idsArr
        });
        return true;
      } catch (error) {
        debug('添加许可证过程发生错误', {
          error: error,
          id: id
        });
        throwError(error, 'SteamWeb.addLicense');
        return false;
      }
    }
    async #addFreeLicense(id, logStatusPre) {
      try {
        debug('开始添加免费Steam游戏许可证', {
          id: id
        });
        const logStatus = logStatusPre || echoLog({
          type: 'addingFreeLicenseSubid',
          text: id,
          before: '[Web]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: `https://store.steampowered.com/freelicense/addfreelicense/${id}`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Host: 'store.steampowered.com',
            Origin: 'https://store.steampowered.com',
            Referer: 'https://store.steampowered.com/account/licenses/'
          },
          data: $.param({
            ajax: true,
            sessionid: this.#auth.storeSessionID
          }),
          dataType: 'json'
        });
        debug('添加免费许可证请求结果', {
          result: result,
          statusText: statusText,
          status: status
        });
        if (result !== 'Success') {
          debug('添加免费许可证请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status !== 200) {
          debug('添加免费许可证响应状态错误', {
            status: data?.status,
            statusText: data?.statusText
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        if (this.#area === 'CN' && data.responseText.includes('id="error_box"')) {
          debug('地区锁定，尝试更换地区', {
            area: this.#area
          });
          logStatus.warning(I18n('changeAreaNotice'));
          const result = await this.#changeArea();
          if (!result || [ 'CN', 'skip' ].includes(result)) {
            debug('更换地区失败或未更换', {
              result: result
            });
            return false;
          }
          return await this.#addFreeLicense(id);
        }
        debug('成功添加免费许可证', {
          id: id
        });
        logStatus.success();
        return true;
      } catch (error) {
        debug('添加免费许可证时发生异常', {
          error: error,
          id: id
        });
        throwError(error, 'SteamWeb.addFreeLicense');
        return false;
      }
    }
    async requestPlayTestAccess(id) {
      debug('开始请求游戏试玩权限', {
        id: id
      });
      try {
        debug('开始请求游戏试玩权限', {
          id: id
        });
        const logStatus = echoLog({
          type: 'requestingPlayTestAccess',
          text: id,
          before: '[Web]'
        });
        debug('准备发送试玩权限请求', {
          id: id
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: `https://store.steampowered.com/ajaxrequestplaytestaccess/${id}`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Host: 'store.steampowered.com',
            Origin: 'https://store.steampowered.com',
            Referer: `https://store.steampowered.com/app/${id}`
          },
          data: $.param({
            sessionid: this.#auth.storeSessionID
          }),
          dataType: 'json'
        });
        debug('收到试玩权限请求响应', {
          result: result,
          status: status,
          statusText: statusText,
          responseData: data
        });
        if (result !== 'Success') {
          debug('请求失败', {
            result: result,
            status: status,
            statusText: statusText
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status !== 200 || data?.response?.success !== 1) {
          debug('响应状态错误', {
            status: data?.status,
            statusText: data?.statusText,
            success: data?.response?.success
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        debug('成功请求游戏试玩权限', {
          id: id
        });
        logStatus.success();
        return true;
      } catch (error) {
        debug('请求游戏试玩权限时发生错误', {
          error: error,
          id: id
        });
        throwError(error, 'SteamWeb.requestPlayTestAccess');
        return false;
      }
    }
    async resetArea() {
      try {
        debug('检查区域设置状态', {
          currentArea: this.#area,
          oldArea: this.#oldArea,
          needReset: Boolean(this.#oldArea && this.#area !== this.#oldArea)
        });
        if (this.#oldArea && this.#area !== this.#oldArea) {
          debug('需要重置区域', {
            fromArea: this.#area,
            toArea: this.#oldArea
          });
          echoLog({
            before: '[Web]'
          }).warning(I18n('steamFinishNotice') + this.#oldArea);
          const changeResult = await this.#changeArea(this.#oldArea);
          debug('区域重置结果', {
            success: changeResult,
            targetArea: this.#oldArea
          });
        } else {
          debug('无需重置区域', {
            currentArea: this.#area,
            oldArea: this.#oldArea
          });
        }
        debug('区域重置流程完成');
        return true;
      } catch (error) {
        debug('重置区域时发生错误', {
          error: error
        });
        throwError(error, 'SteamWeb.resetArea');
        return false;
      }
    }
    #setCache(type, name, id) {
      try {
        debug('开始设置缓存', {
          type: type,
          name: name,
          id: id
        });
        this.#cache[type][name] = id;
        GM_setValue('steamCache', this.#cache);
        debug('设置缓存成功', {
          type: type,
          name: name,
          id: id
        });
      } catch (error) {
        debug('设置缓存时发生异常', {
          error: error,
          type: type,
          name: name,
          id: id
        });
        throwError(error, 'SteamWeb.setCache');
      }
    }
  }
  class Steam extends Social {
    tasks;
    whiteList;
    #cache={
      ...{
        group: {},
        officialGroup: {},
        forum: {},
        workshop: {},
        curator: {}
      },
      ...GM_getValue('steamCache')
    };
    #TaskExecutor=[];
    constructor() {
      super();
      debug('初始化Steam实例');
      const defaultTasksTemplate = {
        groups: [],
        officialGroups: [],
        wishlists: [],
        follows: [],
        forums: [],
        workshops: [],
        workshopVotes: [],
        curators: [],
        curatorLikes: [],
        announcements: [],
        licenses: [],
        playtests: [],
        playTime: []
      };
      this.tasks = defaultTasksTemplate;
      this.whiteList = {
        ...defaultTasksTemplate,
        ...GM_getValue('whiteList')?.steam || {}
      };
      this.#TaskExecutor = this.#getTaskExecutionOrder(globalOptions.ASF.AsfEnabled, globalOptions.ASF.steamWeb, globalOptions.ASF.preferASF);
      debug('Steam实例初始化完成', {
        taskExecutorCount: this.#TaskExecutor.length
      });
    }
    async init() {
      let type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'all';
      try {
        debug('开始初始化Steam模块', {
          type: type
        });
        for (let i = 0; i < this.#TaskExecutor.length; i++) {
          debug(`初始化执行器 ${i + 1}/${this.#TaskExecutor.length}`);
          if (!await this.#TaskExecutor[i].init(type)) {
            debug(`执行器 ${i + 1} 初始化失败，移除该执行器`);
            this.#TaskExecutor.splice(i, 1);
          }
        }
        debug('Steam模块初始化完成', {
          remainingExecutors: this.#TaskExecutor.length
        });
        return this.#TaskExecutor.length > 0;
      } catch (error) {
        debug('Steam初始化发生错误', {
          error: error
        });
        throwError(error, 'Steam.init');
        return false;
      }
    }
    async #joinGroup(groupName) {
      try {
        debug('开始加入Steam组', {
          groupName: groupName
        });
        for (const taskExecutor of this.#TaskExecutor) {
          if (await taskExecutor.joinGroup(groupName)) {
            debug('成功加入Steam组', {
              groupName: groupName
            });
            this.tasks.groups = unique([ ...this.tasks.groups, groupName ]);
            return true;
          }
        }
        debug('加入Steam组失败', {
          groupName: groupName
        });
        return false;
      } catch (error) {
        debug('加入Steam组时发生错误', {
          error: error,
          groupName: groupName
        });
        throwError(error, 'Steam.joinGroup');
        return false;
      }
    }
    async #leaveGroup(groupName) {
      try {
        debug('开始退出Steam组', {
          groupName: groupName
        });
        if (this.whiteList.groups.includes(groupName)) {
          debug('Steam组在白名单中，跳过退出', {
            groupName: groupName
          });
          echoLog({
            type: 'whiteList',
            text: 'Steam.leaveGroup',
            id: groupName
          });
          return true;
        }
        for (const taskExecutor of this.#TaskExecutor) {
          if (await taskExecutor.leaveGroup(groupName)) {
            debug('成功退出Steam组', {
              groupName: groupName
            });
            return true;
          }
        }
        debug('退出Steam组失败', {
          groupName: groupName
        });
        return false;
      } catch (error) {
        debug('退出Steam组时发生错误', {
          error: error,
          groupName: groupName
        });
        throwError(error, 'Steam.leaveGroup');
        return false;
      }
    }
    async #joinOfficialGroup(gameId) {
      try {
        debug('开始加入Steam官方组', {
          gameId: gameId
        });
        for (const taskExecutor of this.#TaskExecutor) {
          if (await taskExecutor.joinOfficialGroup(gameId)) {
            debug('成功加入Steam官方组', {
              gameId: gameId
            });
            return true;
          }
        }
        debug('加入Steam官方组失败', {
          gameId: gameId
        });
        return false;
      } catch (error) {
        debug('加入Steam官方组时发生错误', {
          error: error,
          gameId: gameId
        });
        throwError(error, 'Steam.joinOfficialGroup');
        return false;
      }
    }
    async #leaveOfficialGroup(gameId) {
      try {
        debug('开始退出Steam官方组', {
          gameId: gameId
        });
        if (this.whiteList.officialGroups.includes(gameId)) {
          debug('Steam官方组在白名单中，跳过退出', {
            gameId: gameId
          });
          echoLog({
            type: 'whiteList',
            text: 'Steam.leaveOfficialGroup',
            id: gameId
          });
          return true;
        }
        for (const taskExecutor of this.#TaskExecutor) {
          if (await taskExecutor.leaveOfficialGroup(gameId)) {
            debug('成功退出Steam官方组', {
              gameId: gameId
            });
            this.tasks.officialGroups = unique([ ...this.tasks.officialGroups, gameId ]);
            return true;
          }
        }
        debug('退出Steam官方组失败', {
          gameId: gameId
        });
        return false;
      } catch (error) {
        debug('退出Steam官方组时发生错误', {
          error: error,
          gameId: gameId
        });
        throwError(error, 'Steam.leaveOfficialGroup');
        return false;
      }
    }
    async #addToWishlist(gameId) {
      try {
        debug('开始添加游戏到愿望单', {
          gameId: gameId
        });
        for (const taskExecutor of this.#TaskExecutor) {
          if (await taskExecutor.addToWishlist(gameId)) {
            debug('成功添加游戏到愿望单', {
              gameId: gameId
            });
            this.tasks.wishlists = unique([ ...this.tasks.wishlists, gameId ]);
            return true;
          }
        }
        debug('添加游戏到愿望单失败', {
          gameId: gameId
        });
        return false;
      } catch (error) {
        debug('添加游戏到愿望单时发生错误', {
          error: error,
          gameId: gameId
        });
        throwError(error, 'Steam.addToWishlist');
        return false;
      }
    }
    async #removeFromWishlist(gameId) {
      try {
        debug('开始从愿望单移除游戏', {
          gameId: gameId
        });
        if (this.whiteList.wishlists.includes(gameId)) {
          debug('游戏在愿望单白名单中，跳过移除', {
            gameId: gameId
          });
          echoLog({
            type: 'whiteList',
            text: 'Steam.removeFromWishlist',
            id: gameId
          });
          return true;
        }
        for (const taskExecutor of this.#TaskExecutor) {
          if (await taskExecutor.removeFromWishlist(gameId)) {
            debug('成功从愿望单移除游戏', {
              gameId: gameId
            });
            return true;
          }
        }
        debug('从愿望单移除游戏失败', {
          gameId: gameId
        });
        return false;
      } catch (error) {
        debug('从愿望单移除游戏时发生错误', {
          error: error,
          gameId: gameId
        });
        throwError(error, 'Steam.removeFromWishlist');
        return false;
      }
    }
    async #toggleFollowGame(gameId, doTask) {
      try {
        debug('开始处理游戏关注状态', {
          gameId: gameId,
          doTask: doTask
        });
        if (!doTask && this.whiteList.follows.includes(gameId)) {
          debug('游戏在关注白名单中，跳过取关', {
            gameId: gameId
          });
          echoLog({
            type: 'whiteList',
            text: 'Steam.unfollowGame',
            id: gameId
          });
          return true;
        }
        for (const taskExecutor of this.#TaskExecutor) {
          if (await taskExecutor.toggleFollowGame(gameId, doTask)) {
            if (doTask) {
              debug('成功关注游戏', {
                gameId: gameId
              });
              this.tasks.follows = unique([ ...this.tasks.follows, gameId ]);
            } else {
              debug('成功取关游戏', {
                gameId: gameId
              });
            }
            return true;
          }
        }
        debug('处理游戏关注状态失败', {
          gameId: gameId,
          doTask: doTask
        });
        return false;
      } catch (error) {
        debug('处理游戏关注状态时发生错误', {
          error: error,
          gameId: gameId,
          doTask: doTask
        });
        throwError(error, 'Steam.toggleFollowGame');
        return false;
      }
    }
    async #toggleForum(gameId) {
      let doTask = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      try {
        debug('开始处理论坛订阅状态', {
          gameId: gameId,
          doTask: doTask
        });
        if (!doTask && this.whiteList.forums.includes(gameId)) {
          debug('论坛在白名单中，跳过取消订阅', {
            gameId: gameId
          });
          echoLog({
            type: 'whiteList',
            text: 'Steam.unsubscribeForum',
            id: gameId
          });
          return true;
        }
        for (const taskExecutor of this.#TaskExecutor) {
          if (await taskExecutor.toggleForum(gameId, doTask)) {
            if (doTask) {
              debug('成功订阅论坛', {
                gameId: gameId
              });
              this.tasks.forums = unique([ ...this.tasks.forums, gameId ]);
            } else {
              debug('成功取消订阅论坛', {
                gameId: gameId
              });
            }
            return true;
          }
        }
        debug('处理论坛订阅状态失败', {
          gameId: gameId,
          doTask: doTask
        });
        return false;
      } catch (error) {
        debug('处理论坛订阅状态时发生错误', {
          error: error,
          gameId: gameId,
          doTask: doTask
        });
        throwError(error, 'Steam.toggleForum');
        return true;
      }
    }
    async #toggleFavoriteWorkshop(id) {
      let doTask = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      try {
        debug('开始处理创意工坊收藏状态', {
          id: id,
          doTask: doTask
        });
        if (!doTask && this.whiteList.workshops.includes(id)) {
          debug('创意工坊物品在白名单中，跳过取消收藏', {
            id: id
          });
          echoLog({
            type: 'whiteList',
            text: 'Steam.unfavoriteWorkshop',
            id: id
          });
          return true;
        }
        for (const taskExecutor of this.#TaskExecutor) {
          if (await taskExecutor.toggleFavoriteWorkshop(id)) {
            if (doTask) {
              debug('成功收藏创意工坊物品', {
                id: id
              });
              this.tasks.workshops = unique([ ...this.tasks.workshops, id ]);
            } else {
              debug('成功取消收藏创意工坊物品', {
                id: id
              });
            }
            return true;
          }
        }
        debug('处理创意工坊收藏状态失败', {
          id: id,
          doTask: doTask
        });
        return false;
      } catch (error) {
        debug('处理创意工坊收藏状态时发生错误', {
          error: error,
          id: id,
          doTask: doTask
        });
        throwError(error, 'Steam.toggleFavoriteWorkshop');
        return false;
      }
    }
    async #voteUpWorkshop(id) {
      try {
        debug('开始点赞创意工坊物品', {
          id: id
        });
        for (const taskExecutor of this.#TaskExecutor) {
          if (await taskExecutor.voteUpWorkshop(id)) {
            debug('成功点赞创意工坊物品', {
              id: id
            });
            return true;
          }
        }
        debug('点赞创意工坊物品失败', {
          id: id
        });
        return false;
      } catch (error) {
        debug('点赞创意工坊物品时发生错误', {
          error: error,
          id: id
        });
        throwError(error, 'Steam.voteupWorkshop');
        return true;
      }
    }
    async #toggleCurator(curatorId) {
      let doTask = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      try {
        debug('开始处理鉴赏家关注状态', {
          curatorId: curatorId,
          doTask: doTask
        });
        if (!doTask && this.whiteList.curators.includes(curatorId)) {
          debug('鉴赏家在白名单中，跳过取关', {
            curatorId: curatorId
          });
          echoLog({
            type: 'whiteList',
            text: 'Steam.unfollowCurator',
            id: curatorId
          });
          return true;
        }
        for (const taskExecutor of this.#TaskExecutor) {
          if (await taskExecutor.toggleCurator(curatorId, doTask)) {
            if (doTask) {
              debug('成功关注鉴赏家', {
                curatorId: curatorId
              });
              this.tasks.curators = unique([ ...this.tasks.curators, curatorId ]);
            } else {
              debug('成功取关鉴赏家', {
                curatorId: curatorId
              });
            }
            return true;
          }
        }
        debug('处理鉴赏家关注状态失败', {
          curatorId: curatorId,
          doTask: doTask
        });
        return false;
      } catch (error) {
        debug('处理鉴赏家关注状态时发生错误', {
          error: error,
          curatorId: curatorId,
          doTask: doTask
        });
        throwError(error, 'Steam.toggleCurator');
        return false;
      }
    }
    async getCuratorId(path, name) {
      try {
        debug('开始获取鉴赏家ID', {
          path: path,
          name: name
        });
        const logStatus = echoLog({
          type: 'gettingCuratorId',
          text: `${path}/${name}`,
          before: '[Web]'
        });
        const curatorId = this.#cache.curator[`${path}/${name}`];
        if (curatorId) {
          debug('从缓存获取到鉴赏家ID', {
            path: path,
            name: name,
            curatorId: curatorId
          });
          logStatus.success();
          return curatorId;
        }
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: `https://store.steampowered.com/${path}/${name}`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          }
        });
        if (result === 'Success') {
          if (data?.status === 200) {
            const curatorId = data.responseText.match(/g_pagingData.*?"clanid":([\d]+)/)?.[1];
            if (curatorId) {
              debug('成功获取鉴赏家ID', {
                path: path,
                name: name,
                curatorId: curatorId
              });
              this.#setCache('curator', `${path}/${name}`, curatorId);
              logStatus.success();
              return curatorId;
            }
            debug('未找到鉴赏家ID', {
              path: path,
              name: name,
              status: data.status
            });
            logStatus.error(`Error:${data.statusText}(${data.status})`);
            return false;
          }
          debug('获取鉴赏家页面失败', {
            path: path,
            name: name,
            status: data?.status
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        debug('请求鉴赏家页面失败', {
          path: path,
          name: name,
          result: result,
          status: status
        });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      } catch (error) {
        debug('获取鉴赏家ID时发生错误', {
          error: error,
          path: path,
          name: name
        });
        throwError(error, 'SteamWeb.getCuratorID');
        return false;
      }
    }
    async #toggleCuratorLike(link) {
      let doTask = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      try {
        debug('开始处理鉴赏家点赞状态', {
          link: link,
          doTask: doTask
        });
        const [path, name] = link.split('/');
        if (!(path && name)) {
          debug('无效的鉴赏家链接', {
            link: link
          });
          echoLog({
            text: I18n('errorLink', link),
            before: '[Web]'
          });
          return false;
        }
        const curatorId = await this.getCuratorId(path, name);
        if (curatorId) {
          debug('获取到鉴赏家ID，开始处理点赞', {
            curatorId: curatorId,
            doTask: doTask
          });
          return await this.#toggleCurator(curatorId, doTask);
        }
        debug('未获取到鉴赏家ID', {
          link: link
        });
        return false;
      } catch (error) {
        debug('处理鉴赏家点赞状态时发生错误', {
          error: error,
          link: link,
          doTask: doTask
        });
        throwError(error, 'Steam.toggleCuratorLike');
        return false;
      }
    }
    async #likeAnnouncement(id) {
      try {
        debug('开始点赞公告', {
          id: id
        });
        for (const taskExecutor of this.#TaskExecutor) {
          if (await taskExecutor.likeAnnouncement(id)) {
            debug('成功点赞公告', {
              id: id
            });
            return true;
          }
        }
        debug('点赞公告失败', {
          id: id
        });
        return false;
      } catch (error) {
        debug('点赞公告时发生错误', {
          error: error,
          id: id
        });
        throwError(error, 'Steam.likeAnnouncement');
        return false;
      }
    }
    async #addLicense(id) {
      try {
        debug('开始添加许可证', {
          id: id
        });
        for (const taskExecutor of this.#TaskExecutor) {
          if (await taskExecutor.addLicense(id)) {
            debug('成功添加许可证', {
              id: id
            });
            return true;
          }
        }
        debug('添加许可证失败', {
          id: id
        });
        return false;
      } catch (error) {
        debug('添加许可证时发生错误', {
          error: error,
          id: id
        });
        throwError(error, 'Steam.addLicense');
        return false;
      }
    }
    async #requestPlayTestAccess(id) {
      try {
        debug('开始请求游戏试玩权限', {
          id: id
        });
        for (const taskExecutor of this.#TaskExecutor) {
          if (await taskExecutor.requestPlayTestAccess(id)) {
            debug('成功请求游戏试玩权限', {
              id: id
            });
            return true;
          }
        }
        debug('请求游戏试玩权限失败', {
          id: id
        });
        return false;
      } catch (error) {
        debug('请求游戏试玩权限时发生错误', {
          error: error,
          id: id
        });
        throwError(error, 'Steam.requestPlayTestAccess');
        return false;
      }
    }
    async #getDemoAppid(id) {
      try {
        debug('开始获取游戏试玩ID', {
          id: id
        });
        const logStatus = echoLog({
          type: 'gettingDemoAppid',
          text: id,
          before: '[Web]'
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: `https://store.steampowered.com/app/${id}`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Host: 'store.steampowered.com',
            Origin: 'https://store.steampowered.com',
            Referer: `https://store.steampowered.com/app/${id}`
          }
        });
        if (result === 'Success') {
          if (data?.status === 200) {
            const demoAppid = data.responseText.match(/steam:\/\/(install|run)\/(\d+)/)?.[2];
            debug('成功获取游戏试玩ID', {
              id: id,
              demoAppid: demoAppid
            });
            logStatus.success();
            return demoAppid || false;
          }
          debug('获取游戏页面失败', {
            id: id,
            status: data?.status
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        debug('请求游戏页面失败', {
          id: id,
          result: result,
          status: status
        });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      } catch (error) {
        debug('获取游戏试玩ID时发生错误', {
          error: error,
          id: id
        });
        throwError(error, 'Steam.getDemoAppid');
        return false;
      }
    }
    async #playGames(ids, playTime) {
      let doTask = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      try {
        debug('开始处理游戏挂时长', {
          ids: ids,
          playTime: playTime,
          doTask: doTask
        });
        if (playTime <= 0) {
          debug('游戏时长小于等于0，跳过挂时长');
          return true;
        }
        const asf = this.#TaskExecutor.find((e => e instanceof SteamASF));
        if (!asf) {
          debug('未找到ASF实例');
          echoLog({}).warning(I18n('noASFInstance'));
          return false;
        }
        if (!doTask) {
          debug('停止挂时长');
          return await asf.stopPlayGames();
        }
        const idsArr = await Promise.all(ids.split(',').map((async id => {
          try {
            const demoAppid = await this.#getDemoAppid(id);
            return demoAppid ? `${id},${demoAppid}` : id;
          } catch (error) {
            debug('获取游戏试玩ID失败', {
              error: error,
              id: id
            });
            return id;
          }
        })));
        const uniqueIds = unique(idsArr.join(',').split(','));
        debug('处理后的游戏ID列表', {
          uniqueIds: uniqueIds
        });
        debug('开始尝试入库游戏', {
          uniqueIds: uniqueIds
        });
        await Promise.all(uniqueIds.map((async id => {
          for (const taskExecutor of this.#TaskExecutor) {
            if (await taskExecutor.addLicense(`appid-${id}`)) {
              debug('成功入库游戏', {
                id: id
              });
              return true;
            }
          }
          return false;
        })));
        await asf.playGames(uniqueIds.join(','));
        const status = await asf.checkPlayStatus(uniqueIds.join(','));
        if (status !== true) {
          await delay(3e3);
          await asf.playGames(uniqueIds.join(','));
          const status = await asf.checkPlayStatus(uniqueIds.join(','));
          if (!status) {
            debug('启动游戏失败');
            return false;
          }
        }
        const stopPlayTime = Date.now() + (playTime + 10) * 60 * 1e3;
        const stopPlayTimeOld = GM_getValue('stopPlayTime', 0) || 0;
        GM_setValue('stopPlayTime', Math.max(stopPlayTime, stopPlayTimeOld));
        const playedGames = GM_getValue('playedGames', []) || [];
        GM_setValue('playedGames', unique([ ...playedGames, ...uniqueIds ]));
        const taskLink = GM_getValue('taskLink', []) || [];
        GM_setValue('taskLink', unique([ ...taskLink, window.location.href ]));
        debug('游戏挂时长状态更新完成');
        return true;
      } catch (error) {
        debug('处理游戏挂时长时发生错误', {
          error: error,
          ids: ids,
          playTime: playTime
        });
        throwError(error, 'Steam.playGames');
        return false;
      }
    }
    async toggle(_ref15) {
      let {doTask: doTask = true, groupLinks: groupLinks = [], officialGroupLinks: officialGroupLinks = [], wishlistLinks: wishlistLinks = [], followLinks: followLinks = [], forumLinks: forumLinks = [], workshopLinks: workshopLinks = [], workshopVoteLinks: workshopVoteLinks = [], curatorLinks: curatorLinks = [], curatorLikeLinks: curatorLikeLinks = [], announcementLinks: announcementLinks = [], licenseLinks: licenseLinks = [], playtestLinks: playtestLinks = [], playTimeLinks: playTimeLinks = []} = _ref15;
      try {
        debug('开始处理Steam任务', {
          doTask: doTask,
          linksCount: {
            groups: groupLinks.length,
            officialGroups: officialGroupLinks.length,
            wishlists: wishlistLinks.length,
            follows: followLinks.length,
            forums: forumLinks.length,
            workshops: workshopLinks.length,
            workshopVotes: workshopVoteLinks.length,
            curators: curatorLinks.length,
            curatorLikes: curatorLikeLinks.length,
            announcements: announcementLinks.length,
            licenses: licenseLinks.length,
            playtests: playtestLinks.length,
            playTime: playTimeLinks.length
          }
        });
        const allLinks = [ ...groupLinks, ...officialGroupLinks, ...forumLinks, ...workshopLinks, ...workshopVoteLinks, ...wishlistLinks, ...followLinks, ...curatorLinks, ...curatorLikeLinks, ...announcementLinks, ...licenseLinks, ...playtestLinks, ...playTimeLinks ];
        if (allLinks.length > 0 && this.#TaskExecutor.length === 0) {
          debug('Steam模块未初始化');
          echoLog({
            text: I18n('needInit')
          });
          return false;
        }
        const tasks = [];
        if (this.shouldProcessTask('groups', doTask)) {
          debug('开始处理群组任务');
          const realGroups = this.getRealParams('groups', groupLinks, doTask, (link => link.match(/groups\/(.+)\/?/)?.[1]?.split('/')?.[0]));
          debug('处理后的群组列表', {
            count: realGroups.length,
            groups: realGroups
          });
          for (const group of realGroups) {
            tasks.push(doTask ? this.#joinGroup(group) : this.#leaveGroup(group));
            await delay(1e3);
          }
        }
        if (this.shouldProcessTask('officialGroups', doTask)) {
          const realOfficialGroups = this.getRealParams('officialGroups', officialGroupLinks, doTask, (link => link.match(/games\/(.+)\/?/)?.[1]));
          for (const officialGroup of realOfficialGroups) {
            tasks.push(doTask ? this.#joinOfficialGroup(officialGroup) : this.#leaveOfficialGroup(officialGroup));
            await delay(1e3);
          }
        }
        if (this.shouldProcessTask('wishlists', doTask)) {
          const realWishlists = this.getRealParams('wishlists', wishlistLinks, doTask, (link => link.match(/app\/([\d]+)/)?.[1]));
          for (const game of realWishlists) {
            tasks.push(doTask ? this.#addToWishlist(game) : this.#removeFromWishlist(game));
            await delay(1e3);
          }
        }
        if (this.shouldProcessTask('follows', doTask)) {
          const realFollows = this.getRealParams('follows', followLinks, doTask, (link => link.match(/app\/([\d]+)/)?.[1]));
          for (const game of realFollows) {
            tasks.push(this.#toggleFollowGame(game, doTask));
            await delay(1e3);
          }
        }
        if (this.shouldProcessTask('playTime', doTask)) {
          const realGames = this.getRealParams('playTime', playTimeLinks, doTask, (link => `${link.split('-')[0]}-${link.match(/app\/([\d]+)/)?.[1] || ''}`));
          if (realGames.length > 0) {
            const maxTime = Math.max(...realGames.map((info => parseInt(info.split('-')[0], 10) || 0)));
            const games = realGames.filter((info => {
              const [time, game] = info.split('-');
              return (parseInt(time, 10) || 0) > 0 && game;
            })).map((info => info.split('-')[1]));
            tasks.push(this.#playGames(games.join(','), maxTime, doTask));
            await delay(1e3);
          }
        }
        if (this.shouldProcessTask('forums', doTask)) {
          const realForums = this.getRealParams('forums', forumLinks, doTask, (link => link.match(/app\/([\d]+)/)?.[1]));
          for (const forum of realForums) {
            tasks.push(this.#toggleForum(forum, doTask));
            await delay(1e3);
          }
        }
        if (this.shouldProcessTask('workshops', doTask)) {
          const realWorkshops = this.getRealParams('workshops', workshopLinks, doTask, (link => link.match(/\?id=([\d]+)/)?.[1]));
          for (const workshop of realWorkshops) {
            tasks.push(this.#toggleFavoriteWorkshop(workshop, doTask));
            await delay(1e3);
          }
        }
        if (doTask && globalOptions.doTask.steam.workshopVotes) {
          const realworkshopVotes = this.getRealParams('workshopVotes', workshopVoteLinks, doTask, (link => link.match(/\?id=([\d]+)/)?.[1]));
          for (const workshop of realworkshopVotes) {
            tasks.push(this.#voteUpWorkshop(workshop));
            await delay(1e3);
          }
        }
        if (this.shouldProcessTask('curators', doTask)) {
          const realCurators = this.getRealParams('curators', curatorLinks, doTask, (link => link.match(/curator\/([\d]+)/)?.[1]));
          const realCuratorLikes = this.getRealParams('curatorLikes', curatorLikeLinks, doTask, (link => link.match(/https?:\/\/store\.steampowered\.com\/(.*?)\/([^/?]+)/)?.slice(1, 3).join('/')));
          for (const curator of realCurators) {
            tasks.push(this.#toggleCurator(curator, doTask));
            await delay(1e3);
          }
          for (const curatorLike of realCuratorLikes) {
            tasks.push(this.#toggleCuratorLike(curatorLike, doTask));
            await delay(1e3);
          }
        }
        if (doTask && globalOptions.doTask.steam.announcements) {
          const realAnnouncements = this.getRealParams('announcements', announcementLinks, doTask, (link => {
            if (link.includes('store.steampowered.com')) {
              return link.match(/store\.steampowered\.com\/news\/app\/([\d]+)\/view\/([\d]+)/)?.slice(1, 3).join('/');
            }
            return link.match(/steamcommunity\.com\/games\/([\d]+)\/announcements\/detail\/([\d]+)/)?.slice(1, 3).join('/');
          }));
          for (const id of realAnnouncements) {
            tasks.push(this.#likeAnnouncement(id));
            await delay(1e3);
          }
        }
        if (doTask && globalOptions.doTask.steam.licenses && licenseLinks.length > 0) {
          for (const ids of licenseLinks) {
            const [type, idsStr] = ids.split('-');
            const idsArr = idsStr.split(',');
            for (const id of idsArr) {
              tasks.push(this.#addLicense(`${type}-${id}`));
              await delay(1e3);
            }
          }
        }
        if (doTask && globalOptions.doTask.steam.playtests) {
          const realPlaytests = this.getRealParams('playtests', playtestLinks, doTask, (link => link.match(/app\/([\d]+)/)?.[1]));
          for (const id of realPlaytests) {
            tasks.push(this.#requestPlayTestAccess(id));
            await delay(1e3);
          }
        }
        debug('开始执行所有任务');
        const results = await Promise.all(tasks);
        this.#TaskExecutor.find((e => e instanceof SteamWeb))?.resetArea();
        debug('所有任务执行完成', {
          success: results.every((result => result))
        });
        return results.every((result => result));
      } catch (error) {
        debug('处理Steam任务时发生错误', {
          error: error
        });
        throwError(error, 'Steam.toggle');
        return false;
      }
    }
    shouldProcessTask(taskType, doTask) {
      debug('检查是否处理任务', {
        taskType: taskType,
        doTask: doTask
      });
      if (doTask) {
        const result = globalOptions.doTask.steam[taskType];
        debug('检查doTask配置', {
          taskType: taskType,
          result: result
        });
        return globalOptions.doTask.steam[taskType];
      }
      const undoTaskType = taskType;
      return undoTaskType in globalOptions.undoTask.steam && globalOptions.undoTask.steam[undoTaskType];
    }
    #setCache(type, name, id) {
      try {
        this.#cache[type][name] = id;
        GM_setValue('steamCache', this.#cache);
      } catch (error) {
        throwError(error, 'SteamWeb.setCache');
      }
    }
    #getTaskExecutionOrder(asfEnabled, steamWebEnabled, preferASF) {
      if (!asfEnabled) {
        return [ new SteamWeb ];
      }
      if (!steamWebEnabled) {
        return [ new SteamASF(globalOptions.ASF) ];
      }
      return preferASF ? [ new SteamASF(globalOptions.ASF), new SteamWeb ] : [ new SteamWeb, new SteamASF(globalOptions.ASF) ];
    }
  }
  class Website {
    undoneTasks;
    socialTasks;
    giveawayId;
    socialInitialized={
      discord: false,
      instagram: false,
      reddit: false,
      twitch: false,
      twitter: false,
      vk: false,
      youtube: false,
      steamStore: false,
      steamCommunity: false
    };
    initialized=false;
    steamTaskType={
      steamStore: false,
      steamCommunity: false
    };
    social={};
    async #bind(name, init) {
      try {
        debug('开始绑定社交媒体', {
          name: name
        });
        const result = await init;
        debug('绑定结果', {
          name: name,
          result: result
        });
        return {
          name: name,
          result: result
        };
      } catch (error) {
        debug('绑定失败', {
          name: name,
          error: error
        });
        throwError(error, 'Website.bind');
        return {
          name: name,
          result: false
        };
      }
    }
    async initSocial(action) {
      try {
        debug('开始初始化社交媒体', {
          action: action
        });
        const pro = [];
        const tasks = action === 'do' ? this.undoneTasks : this.socialTasks;
        if (tasks.discord) {
          const hasDiscord = Object.values(tasks.discord).reduce(((total, arr) => [ ...total, ...arr ])).length > 0;
          debug('检查 Discord 任务', {
            hasDiscord: hasDiscord
          });
          if (hasDiscord && (!this.socialInitialized.discord || !this.social.discord)) {
            debug('初始化 Discord');
            this.social.discord = new Discord;
            pro.push(this.#bind('discord', this.social.discord.init(action)));
          }
        }
        if (tasks.reddit) {
          const hasReddit = Object.values(tasks.reddit).reduce(((total, arr) => [ ...total, ...arr ])).length > 0;
          debug('检查 Reddit 任务', {
            hasReddit: hasReddit
          });
          if (hasReddit && (!this.socialInitialized.reddit || !this.social.reddit)) {
            debug('初始化 Reddit');
            this.social.reddit = new Reddit;
            pro.push(this.#bind('reddit', this.social.reddit.init()));
          }
        }
        if (tasks.twitch) {
          const hasTwitch = Object.values(tasks.twitch).reduce(((total, arr) => [ ...total, ...arr ])).length > 0;
          debug('检查 Twitch 任务', {
            hasTwitch: hasTwitch
          });
          if (hasTwitch && (!this.socialInitialized.twitch || !this.social.twitch)) {
            debug('初始化 Twitch');
            this.social.twitch = new Twitch;
            pro.push(this.#bind('twitch', this.social.twitch.init()));
          }
        }
        if (tasks.twitter) {
          const hasTwitter = Object.values(tasks.twitter).reduce(((total, arr) => [ ...total, ...arr ])).length > 0;
          debug('检查 Twitter 任务', {
            hasTwitter: hasTwitter
          });
          if (hasTwitter && (!this.socialInitialized.twitter || !this.social.twitter)) {
            debug('初始化 Twitter');
            this.social.twitter = new Twitter;
            pro.push(this.#bind('twitter', this.social.twitter.init()));
          }
        }
        if (tasks.vk) {
          const hasVk = Object.values(tasks.vk).reduce(((total, arr) => [ ...total, ...arr ])).length > 0;
          debug('检查 VK 任务', {
            hasVk: hasVk
          });
          if (hasVk && (!this.socialInitialized.vk || !this.social.vk)) {
            debug('初始化 VK');
            this.social.vk = new Vk;
            pro.push(this.#bind('vk', this.social.vk.init()));
          }
        }
        if (tasks.youtube) {
          const hasYoutube = Object.values(tasks.youtube).reduce(((total, arr) => [ ...total, ...arr ])).length > 0;
          debug('检查 YouTube 任务', {
            hasYoutube: hasYoutube
          });
          if (hasYoutube && (!this.socialInitialized.youtube || !this.social.youtube)) {
            debug('初始化 YouTube');
            this.social.youtube = new Youtube;
            pro.push(this.#bind('youtube', this.social.youtube.init()));
          }
        }
        if (tasks.steam) {
          const steamLength = Object.values(tasks.steam).reduce(((total, arr) => [ ...total, ...arr ])).length;
          debug('检查 Steam 任务', {
            steamLength: steamLength
          });
          if (steamLength > 0) {
            if (!this.social.steam) {
              debug('创建 Steam 实例');
              this.social.steam = new Steam;
            }
            const steamCommunityLength = Object.keys(tasks.steam).map((type => [ 'groupLinks', 'officialGroupLinks', 'forumLinks', 'workshopLinks', 'workshopVoteLinks' ].includes(type) ? tasks.steam?.[type]?.length || 0 : 0)).reduce(((total, number) => total + number), 0);
            debug('Steam 社区任务数量', {
              steamCommunityLength: steamCommunityLength
            });
            if (steamLength - steamCommunityLength > 0) {
              this.steamTaskType.steamStore = true;
              if (!this.socialInitialized.steamStore) {
                debug('初始化 Steam 商店');
                pro.push(this.#bind('steamStore', this.social.steam.init('store')));
              }
            }
            if (steamCommunityLength > 0) {
              if (!this.socialInitialized.steamCommunity) {
                this.steamTaskType.steamCommunity = true;
                debug('初始化 Steam 社区');
                pro.push(this.#bind('steamCommunity', this.social.steam.init('community')));
              }
            }
          }
        }
        if (tasks.links && tasks.links.length > 0) {
          debug('初始化链接访问', {
            linksCount: tasks.links.length
          });
          this.social.visitLink = visitLink;
        }
        debug('等待所有社交媒体初始化完成');
        return await Promise.all(pro).then((result => {
          let checked = true;
          for (const data of result) {
            if (data.result) {
              debug('社交媒体初始化成功', {
                name: data.name
              });
              this.socialInitialized[data.name] = data.result;
            } else {
              debug('社交媒体初始化失败', {
                name: data.name
              });
              checked = false;
            }
          }
          debug('社交媒体初始化完成', {
            allSuccess: checked
          });
          return checked;
        }));
      } catch (error) {
        debug('初始化社交媒体失败', {
          error: error
        });
        throwError(error, 'Website.initSocial');
        return false;
      }
    }
    uniqueTasks(allTasks) {
      try {
        debug('开始去重任务');
        const result = {};
        for (const [social, types] of Object.entries(allTasks)) {
          debug('处理社交媒体任务', {
            social: social
          });
          result[social] = {};
          for (const [type, tasks] of Object.entries(types)) {
            debug('处理任务类型', {
              social: social,
              type: type
            });
            result[social][type] = unique(tasks);
          }
        }
        debug('任务去重完成');
        return result;
      } catch (error) {
        debug('任务去重失败', {
          error: error
        });
        throwError(error, 'Website.uniqueTasks');
        return allTasks;
      }
    }
    async toggleTask(action) {
      try {
        debug('开始切换任务状态', {
          action: action
        });
        if (!this.initialized && !this.init()) {
          debug('初始化失败');
          return false;
        }
        if (!await this.classifyTask(action)) {
          debug('任务分类失败');
          return false;
        }
        debug('初始化社交媒体');
        await this.initSocial(action);
        const pro = [];
        const doTask = action === 'do';
        const tasks = doTask ? this.undoneTasks : this.socialTasks;
        if (this.socialInitialized.discord === true && this.social.discord) {
          debug('处理 Discord 任务');
          pro.push(this.social.discord.toggle({
            doTask: doTask,
            ...tasks.discord
          }));
        }
        if (this.socialInitialized.reddit === true && this.social.reddit) {
          debug('处理 Reddit 任务');
          pro.push(this.social.reddit.toggle({
            doTask: doTask,
            ...tasks.reddit
          }));
        }
        if (this.socialInitialized.twitch === true && this.social.twitch) {
          debug('处理 Twitch 任务');
          pro.push(this.social.twitch.toggle({
            doTask: doTask,
            ...tasks.twitch
          }));
        }
        if (this.socialInitialized.twitter === true && this.social.twitter) {
          debug('处理 Twitter 任务');
          pro.push(this.social.twitter.toggle({
            doTask: doTask,
            ...tasks.twitter
          }));
        }
        if (this.socialInitialized.vk === true && this.social.vk) {
          debug('处理 VK 任务');
          pro.push(this.social.vk.toggle({
            doTask: doTask,
            ...tasks.vk
          }));
        }
        if (this.socialInitialized.youtube === true && this.social.youtube) {
          debug('处理 YouTube 任务');
          pro.push(this.social.youtube.toggle({
            doTask: doTask,
            ...tasks.youtube
          }));
        }
        if ((this.steamTaskType.steamCommunity ? this.socialInitialized.steamCommunity === true : true) && (this.steamTaskType.steamStore ? this.socialInitialized.steamStore === true : true) && this.social.steam) {
          debug('处理 Steam 任务');
          pro.push(this.social.steam.toggle({
            doTask: doTask,
            ...tasks.steam
          }));
        }
        if (this.social.visitLink && tasks.links && doTask) {
          debug('处理链接任务', {
            linksCount: tasks.links.length
          });
          for (const link of tasks.links) {
            pro.push(this.social.visitLink(link));
          }
        }
        if (doTask && tasks.extra && this.extraDoTask) {
          const hasExtra = Object.values(tasks.extra).reduce(((total, arr) => [ ...total, ...arr ])).length > 0;
          if (hasExtra) {
            debug('处理额外任务');
            pro.push(this.extraDoTask(tasks.extra));
          }
        }
        debug('等待所有任务完成');
        await Promise.all(pro);
        debug('所有任务完成');
        echoLog({}).success(I18n('allTasksComplete'));
        return true;
      } catch (error) {
        debug('切换任务失败', {
          error: error
        });
        throwError(error, 'Website.toggleTask');
        return false;
      }
    }
    async doTask() {
      try {
        debug('开始执行任务');
        const result = await this.toggleTask('do');
        debug('任务执行完成', {
          success: result
        });
        return result;
      } catch (error) {
        debug('执行任务失败', {
          error: error
        });
        throwError(error, 'Website.doTask');
        return false;
      }
    }
    async undoTask() {
      try {
        debug('开始撤销任务');
        const result = await this.toggleTask('undo');
        debug('任务撤销完成', {
          success: result
        });
        return result;
      } catch (error) {
        debug('撤销任务失败', {
          error: error
        });
        throwError(error, 'Website.undoTask');
        return false;
      }
    }
  }
  const defaultTasksTemplate$7 = {
    steam: {
      groupLinks: [],
      wishlistLinks: [],
      curatorLinks: [],
      followLinks: [],
      playTimeLinks: []
    },
    discord: {
      serverLinks: []
    },
    vk: {
      nameLinks: []
    },
    youtube: {
      channelLinks: []
    },
    extra: {
      website: []
    }
  };
  const defaultTasks$9 = JSON.stringify(defaultTasksTemplate$7);
  class FreeAnyWhere extends Website {
    name='FreeAnyWhere';
    tasks=[];
    socialTasks=(() => JSON.parse(defaultTasks$9))();
    undoneTasks=(() => JSON.parse(defaultTasks$9))();
    games;
    buttons=[ 'doTask', 'undoTask', 'verifyTask', 'getKey' ];
    static test() {
      const isMatch = window.location.host === 'freeanywhere.net';
      debug('检查网站匹配', {
        host: window.location.host,
        isMatch: isMatch
      });
      return isMatch;
    }
    async init() {
      try {
        debug('初始化 FreeAnyWhere', {
          url: window.location.href
        });
        const logStatus = echoLog({
          text: I18n('initing')
        });
        debug('检测登录状态');
        if ($('div.header__login a[href*=logout]').length === 0) {
          debug('未登录，准备跳转到登录页面');
          window.open('https://freeanywhere.net/game.php?steam_login', '_self');
          logStatus.warning(I18n('needLogin'));
          return false;
        }
        debug('检测是否为登录页面');
        if (window.location.href.includes('/login')) {
          logStatus.warning(I18n('needLogin'));
          return false;
        }
        if (!await this.#checkLeftKey()) {
          debug('检查剩余密钥失败');
          echoLog({}).warning(I18n('checkLeftKeyFailed'));
        }
        const giveawayIdSuccess = this.#getGiveawayId();
        debug('获取抽奖ID结果', {
          success: giveawayIdSuccess,
          id: this.giveawayId
        });
        this.initialized = true;
        logStatus.success();
        return true;
      } catch (error) {
        debug('初始化失败', {
          error: error
        });
        throwError(error, 'Freeanywhere.init');
        return false;
      }
    }
    async classifyTask(action) {
      try {
        debug('开始分类任务', {
          action: action
        });
        const logStatus = echoLog({
          text: I18n('getTasksInfo')
        });
        if (action === 'undo') {
          debug('获取已保存的任务信息');
          this.socialTasks = GM_getValue(`fawTasks-${this.giveawayId}`)?.tasks || JSON.parse(defaultTasks$9);
        }
        const tasks = $('div.game__content-tasks__task').map(((index, element) => ({
          id: $(element).attr('data-id'),
          social: $(element).find('div.task-img img').attr('alt'),
          link: $(element).find('div.task-link a').attr('href'),
          title: $(element).find('div.task-link').text().trim(),
          type: $(element).attr('data-type'),
          data: $(element).attr('data-data'),
          isSuccess: $(element).hasClass('done')
        }))).toArray();
        debug('获取到的任务列表', {
          tasksCount: tasks.length,
          tasks: tasks
        });
        if (tasks.length === 0) {
          logStatus.success();
          return false;
        }
        if (action === 'verify') {
          this.tasks = [];
        }
        for (const task of tasks) {
          await this.#processTask(task, action);
        }
        logStatus.success();
        this.undoneTasks = this.uniqueTasks(this.undoneTasks);
        this.socialTasks = this.uniqueTasks(this.socialTasks);
        debug('任务分类结果', {
          undoneTasks: this.undoneTasks,
          socialTasks: this.socialTasks
        });
        GM_setValue(`fawTasks-${this.giveawayId}`, {
          tasks: this.socialTasks,
          time: (new Date).getTime()
        });
        return true;
      } catch (error) {
        debug('任务分类失败', {
          error: error
        });
        throwError(error, 'Freeanywhere.classifyTask');
        return false;
      }
    }
    async #processTask(task, action) {
      try {
        debug('处理任务', {
          task: task,
          action: action
        });
        const {id: id, social: social, title: title, type: type, link: link, data: data, isSuccess: isSuccess} = task;
        const taskInfo = {
          id: id,
          title: title,
          social: social,
          type: type,
          data: data
        };
        if (action === 'verify' && !isSuccess) {
          debug('添加到验证任务列表', taskInfo);
          this.tasks.push(taskInfo);
          return;
        }
        debug('处理特定类型任务', {
          type: type,
          action: action,
          isSuccess: isSuccess
        });
        switch (type) {
         case 'steam_account_verify':
         case 'site_email_verify':
          debug('跳过任务', {
            type: type
          });
          break;

         case 'steam_game_sub':
          if (action === 'undo' && link) {
            this.socialTasks.steam.followLinks.push(link);
          }
          if (action === 'do' && !isSuccess && link) {
            this.undoneTasks.steam.followLinks.push(link);
          }
          break;

         case 'steam_game_wishlist':
          if (action === 'undo' && link) {
            this.socialTasks.steam.wishlistLinks.push(link);
          }
          if (action === 'do' && !isSuccess && link) {
            this.undoneTasks.steam.wishlistLinks.push(link);
          }
          break;

         case 'steam_group_sub':
          if (action === 'undo' && link) {
            this.socialTasks.steam.groupLinks.push(link);
          }
          if (action === 'do' && !isSuccess && link) {
            this.undoneTasks.steam.groupLinks.push(link);
          }
          break;

         case 'steam_curator_sub':
          if (action === 'undo' && link) {
            this.socialTasks.steam.curatorLinks.push(link);
          }
          if (action === 'do' && !isSuccess && link) {
            this.undoneTasks.steam.curatorLinks.push(link);
          }
          break;

         case 'site_visit':
          if (action === 'do' && !isSuccess) {
            this.undoneTasks.extra.website.push(`id=${id}&type=${type}&task=true`);
          }
          break;

         case 'vk_community_sub':
          if (action === 'undo' && link) {
            this.socialTasks.vk.nameLinks.push(link);
          }
          if (action === 'do' && !isSuccess && link) {
            this.undoneTasks.vk.nameLinks.push(link);
          }
          break;

         case 'vk_post_like':
          if (action === 'undo' && link) {
            this.socialTasks.vk.nameLinks.push(`${link}&action=like`);
          }
          if (action === 'do' && !isSuccess && link) {
            this.undoneTasks.vk.nameLinks.push(`${link}&action=like`);
          }
          break;

         case 'discord_server_sub':
          if (action === 'undo' && link) {
            this.socialTasks.discord.serverLinks.push(link);
          }
          if (action === 'do' && !isSuccess && link) {
            this.undoneTasks.discord.serverLinks.push(link);
          }
          break;

         case 'youtube_channel_sub':
          if (action === 'undo' && link) {
            this.socialTasks.youtube.channelLinks.push(link);
          }
          if (action === 'do' && !isSuccess && link) {
            this.undoneTasks.youtube.channelLinks.push(link);
          }
          break;

         case 'steam_game_playtime':
          if (action === 'undo' && link) {
            this.socialTasks.steam.playTimeLinks.push(`${title.match(/(\d+)\s*min/)?.[1] || '0'}-${link}`);
          }
          if (action === 'do' && !isSuccess && link) {
            this.undoneTasks.steam.playTimeLinks.push(`${title.match(/(\d+)\s*min/)?.[1] || '0'}-${link}`);
          }
          break;

         case 'telegram_channel_sub':
          debug('跳过 Telegram 任务');
          echoLog({}).warning(`${I18n('tgTaskNotice')}`);
          break;

         case 'none':
          debug('跳过未连接的任务', {
            type: type
          });
          echoLog({}).warning(`${I18n('notConnect', type)}`);
          break;

         default:
          debug('未知任务类型', {
            type: type
          });
          echoLog({}).warning(`${I18n('unKnownTaskType', type)}`);
          break;
        }
      } catch (error) {
        debug('处理任务失败', {
          error: error
        });
        throwError(error, 'FreeAnyWhere.processTask');
      }
    }
    async verifyTask() {
      try {
        debug('开始验证任务');
        if (!this.initialized && !await this.init()) {
          debug('未初始化');
          return false;
        }
        if (this.tasks.length === 0 && !await this.classifyTask('verify')) {
          debug('任务列表为空', this.tasks);
          return false;
        }
        debug('开始验证任务列表', {
          tasks: this.tasks
        });
        const pro = [];
        for (const task of this.tasks) {
          pro.push(this.#verify(task));
          await delay(1e3);
        }
        const result = await Promise.allSettled(pro);
        debug('任务验证结果', {
          result: result
        });
        echoLog({}).success(I18n('allTasksComplete'));
        if (result.every((item => item.status === 'fulfilled' && item.value === true))) {
          return !!await this.getKey(true);
        }
        return false;
      } catch (error) {
        debug('验证任务失败', {
          error: error
        });
        throwError(error, 'Freeanywhere.verifyTask');
        return false;
      }
    }
    async extraDoTask(_ref16) {
      let {website: website} = _ref16;
      try {
        debug('执行额外任务', {
          website: website
        });
        const promises = website.map((link => this.#doVisitWebsite(link)));
        const results = await Promise.allSettled(promises);
        debug('额外任务执行结果', {
          results: results
        });
        return true;
      } catch (error) {
        debug('执行额外任务失败', {
          error: error
        });
        throwError(error, 'FreeAnyWhere.extraDoTask');
        return false;
      }
    }
    async #doVisitWebsite(link) {
      try {
        debug('访问网站', {
          link: link
        });
        const logStatus = echoLog({
          text: I18n('visitingLink')
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: 'https://freeanywhere.net/php/task_site_visit_done.php',
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: link
        });
        if (result !== 'Success') {
          debug('访问失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.responseText.indexOf('bad') !== -1 || data?.responseText.length > 50) {
          debug('访问响应异常', {
            responseText: data?.responseText
          });
          logStatus.error(data?.responseText);
          return false;
        }
        debug('访问成功');
        logStatus.success();
        return true;
      } catch (error) {
        debug('访问网站失败', {
          error: error
        });
        throwError(error, 'FreeAnyWhere.doVisitWebsite');
        return false;
      }
    }
    async getKey(initialized) {
      try {
        debug('开始获取密钥', {
          initialized: initialized
        });
        if (!initialized && !this.initialized && !await this.init()) {
          debug('未初始化');
          return false;
        }
        const logStatus = echoLog({
          text: I18n('gettingKey')
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: 'https://freeanywhere.net/php/user_get_key.php',
          method: 'POST'
        });
        if (result !== 'Success') {
          debug('获取密钥失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.responseText.indexOf('bad') !== -1 || data?.responseText.length > 50) {
          debug('密钥响应异常', {
            responseText: data?.responseText
          });
          logStatus.error(data?.responseText);
          return false;
        }
        debug('获取密钥成功', {
          key: data.responseText
        });
        logStatus.success();
        echoLog({}).success(data.responseText);
        return data.responseText;
      } catch (error) {
        debug('获取密钥失败', {
          error: error
        });
        throwError(error, 'FreeAnyWhere.getKey');
        return false;
      }
    }
    async #verify(task) {
      try {
        if ($('.task-check-extension').length > 0) {
          return this.#verifyWithExtension(task);
        }
        return this.#verifyWithoutExtension(task);
      } catch (error) {
        debug('验证任务失败', {
          error: error
        });
        throwError(error, 'Freeanywhere.verify');
        return false;
      }
    }
    async #verifyWithExtension(task) {
      try {
        await this.#updateUserData();
        debug('验证任务', {
          task: task
        });
        const logStatus = echoLog({
          text: `${I18n('verifyingTask')}${task.title.trim()}...`
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: 'https://freeanywhere.net/php/extension/user_task_update.php',
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: `id=${task.id}&type=${task.type}${task.data && task.data !== 'none' ? `&data=${task.data}` : ''}`
        });
        if (result !== 'Success' || !data?.responseText) {
          debug('验证请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        const response = data.responseText.trim();
        if (response !== 'good') {
          debug('验证响应异常', {
            response: response,
            statusText: data?.statusText,
            status: data?.status
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        debug('验证成功');
        logStatus.success();
        return true;
      } catch (error) {
        debug('验证任务失败', {
          error: error
        });
        throwError(error, 'Freeanywhere.verifyWithExtension');
        return false;
      }
    }
    async #verifyWithoutExtension(task) {
      try {
        debug('验证任务', {
          task: task
        });
        const logStatus = echoLog({
          text: `${I18n('verifyingTask')}${task.title.trim()}...`
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: 'https://freeanywhere.net/php/user_task_update.php',
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: `id=${task.id}&type=${task.type}${task.data && task.data !== 'none' ? `&data=${task.data}` : ''}`
        });
        if (result !== 'Success' || !data?.responseText) {
          debug('验证请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        const response = data.responseText.trim();
        if (response !== 'good') {
          debug('验证响应异常', {
            response: response,
            statusText: data?.statusText,
            status: data?.status
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        debug('验证成功');
        logStatus.success();
        return true;
      } catch (error) {
        debug('验证任务失败', {
          error: error
        });
        throwError(error, 'Freeanywhere.verifyWithoutExtension');
        return false;
      }
    }
    async #updateUserData() {
      try {
        let postData = '';
        const userData = GM_getValue('FAW_STORAGE') || {};
        if (Object.keys(userData).length === 0 || !userData.tasks || !userData.user || !userData.games || !userData.settings) {
          if (!this.games) {
            await this.#userGamesGet();
          }
          if (!this.games) {
            debug('获取用户游戏失败');
            return false;
          }
          postData = `extension=${encodeURIComponent(JSON.stringify({
            games: this.games,
            settings: {
              game_update: Math.floor(Date.now() / 1e3)
            },
            tasks: {},
            user: {
              avatar: $('header.games_for_farm_site').attr('data-avatar'),
              lang: $('header.games_for_farm_site').attr('data-lang'),
              name: $('header.games_for_farm_site').attr('data-name'),
              steam: $('header.games_for_farm_site').attr('data-steam')
            }
          }))}`;
        } else {
          postData = `extension=${encodeURIComponent(JSON.stringify(userData))}`;
        }
        debug('更新用户数据');
        const logStatus = echoLog({
          text: `${I18n('updatingUserData')}`
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: 'https://freeanywhere.net/php/extension/user_data_update.php',
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: postData
        });
        if (data?.status !== 200) {
          debug('验证请求失败', {
            result: result,
            statusText: statusText,
            status: status,
            data: data
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        debug('验证成功');
        logStatus.success();
        return true;
      } catch (error) {
        debug('验证任务失败', {
          error: error
        });
        throwError(error, 'Freeanywhere.updateUserData');
        return false;
      }
    }
    async #userGamesGet() {
      try {
        debug('获取用户游戏');
        const logStatus = echoLog({
          text: `${I18n('gettingUserGames')}`
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: 'https://freeanywhere.net/php/extension/user_games_get.php',
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: `steam=${$('header.games_for_farm_site').attr('data-steam')}`,
          dataType: 'json'
        });
        if (result !== 'Success' || data?.status !== 200 || !data?.responseText) {
          debug('验证请求失败', {
            result: result,
            statusText: statusText,
            status: status,
            data: data
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        debug('验证成功');
        this.games = data.response;
        logStatus.success();
        return true;
      } catch (error) {
        debug('验证任务失败', {
          error: error
        });
        throwError(error, 'Freeanywhere.userGamesGet');
        return false;
      }
    }
    async #checkLeftKey() {
      try {
        debug('检查剩余密钥');
        if (!globalOptions.other.checkLeftKey) {
          debug('跳过密钥检查');
          return true;
        }
        const giveawayStatus = $('div.card-info__lable-info').text()?.includes('Giveaway ended');
        debug('Giveaway状态', {
          giveawayStatus: giveawayStatus
        });
        if (!giveawayStatus) {
          return true;
        }
        debug('没有剩余密钥，显示确认对话框');
        const {value: value} = await Swal.fire({
          icon: 'warning',
          title: I18n('notice'),
          text: I18n('giveawayEnded'),
          confirmButtonText: I18n('confirm'),
          cancelButtonText: I18n('cancel'),
          showCancelButton: true
        });
        if (value) {
          debug('用户确认关闭窗口');
          window.close();
        }
        return true;
      } catch (error) {
        debug('检查剩余密钥失败', {
          error: error
        });
        throwError(error, 'FreeAnyWhere.checkLeftKey');
        return false;
      }
    }
    #getGiveawayId() {
      try {
        debug('开始获取抽奖ID');
        const giveawayId = $('link[rel="canonical"]').attr('href')?.match(/n=([\d]+)/)?.[1];
        if (giveawayId) {
          this.giveawayId = giveawayId;
          debug('获取抽奖ID成功', {
            giveawayId: giveawayId
          });
          return true;
        }
        debug('获取抽奖ID失败');
        echoLog({}).error(I18n('getFailed', 'GiveawayId'));
        return false;
      } catch (error) {
        debug('获取抽奖ID出错', {
          error: error
        });
        throwError(error, 'FreeAnyWhere.getGiveawayId');
        return false;
      }
    }
  }
  const defaultTasks$8 = {
    steam: {
      groupLinks: [],
      wishlistLinks: [],
      curatorLinks: [],
      curatorLikeLinks: [],
      followLinks: [],
      forumLinks: [],
      announcementLinks: [],
      workshopVoteLinks: [],
      playtestLinks: [],
      playTimeLinks: []
    },
    discord: {
      serverLinks: []
    },
    vk: {
      nameLinks: []
    },
    twitch: {
      channelLinks: []
    },
    reddit: {
      redditLinks: []
    },
    youtube: {
      channelLinks: [],
      likeLinks: []
    },
    twitter: {
      userLinks: [],
      retweetLinks: []
    }
  };
  class GiveawaySu extends Website {
    name='GiveawaySu';
    socialTasks=(() => defaultTasks$8)();
    undoneTasks=(() => defaultTasks$8)();
    buttons=[ 'doTask', 'undoTask' ];
    static test() {
      const url = window.location.href;
      const isMatch = /^https?:\/\/giveaway\.su\/giveaway\/view\/[\d]+/.test(url);
      debug('检查网站匹配', {
        url: url,
        isMatch: isMatch
      });
      return isMatch;
    }
    async after() {
      try {
        debug('开始执行后续操作');
        if (!this.#checkLogin()) {
          debug('登录检查失败');
          echoLog({}).warning(I18n('checkLoginFailed'));
        }
        if (!await this.#checkLeftKey()) {
          debug('检查剩余密钥失败');
          echoLog({}).warning(I18n('checkLeftKeyFailed'));
        }
        debug('显示网站通知');
        echoLog({}).warning(I18n('gsNotice'));
      } catch (error) {
        debug('后续操作失败', {
          error: error
        });
        throwError(error, 'Giveawaysu.after');
      }
    }
    init() {
      try {
        debug('初始化 GiveawaySu');
        const logStatus = echoLog({
          text: I18n('initing')
        });
        if ($('a.steam-login').length > 0) {
          debug('发现未登录状态，重定向到 Steam 登录');
          window.open('/steam/redirect', '_self');
          logStatus.warning(I18n('needLogin'));
          return false;
        }
        const giveawayIdResult = this.#getGiveawayId();
        if (!giveawayIdResult) {
          debug('获取抽奖ID失败');
          return false;
        }
        this.initialized = true;
        debug('初始化完成');
        logStatus.success();
        return true;
      } catch (error) {
        debug('初始化失败', {
          error: error
        });
        throwError(error, 'Giveawaysu.init');
        return false;
      }
    }
    async classifyTask(action) {
      try {
        debug('开始分类任务', {
          action: action
        });
        const logStatus = echoLog({
          text: I18n('getTasksInfo')
        });
        if (action === 'undo') {
          debug('恢复已保存的任务信息');
          this.socialTasks = GM_getValue(`gasTasks-${this.giveawayId}`)?.tasks || defaultTasks$8;
          return true;
        }
        const tasks = $('#actions tr');
        if (!tasks.length) {
          debug('未找到任务');
          logStatus.warning(I18n('noTasks'));
          return true;
        }
        debug('检查并处理 Discord 和 Twitch 绑定');
        if ($('div.bind-discord').is(':visible')) {
          debug('点击 Discord 绑定按钮');
          $('div.bind-discord a')[0]?.click();
        }
        if ($('div.bind-twitch').is(':visible')) {
          debug('点击 Twitch 绑定按钮');
          $('div.bind-twitch a')[0]?.click();
        }
        const processTask = async task => {
          const td = $(task).find('td:not(".hidden")');
          const colorfulTask = td.eq(1).find('a:not([data-trigger="link"])');
          const colorlessTask = td.eq(2).find('a:not([data-trigger="link"])');
          const taskDes = colorfulTask.length > 0 ? colorfulTask : colorlessTask;
          if (!taskDes.length) {
            debug('跳过无效任务');
            return true;
          }
          const taskIcon = td.eq(0).find('i').attr('class') || '';
          const taskName = taskDes.text().trim();
          const taskHref = taskDes.attr('href');
          debug('处理任务', {
            taskIcon: taskIcon,
            taskName: taskName,
            taskHref: taskHref
          });
          if (taskIcon.includes('ban') || /disable adblock/gi.test(taskName)) {
            debug('跳过禁用任务');
            return true;
          }
          if (!taskHref) {
            debug('任务链接为空');
            return false;
          }
          try {
            debug('获取重定向链接');
            const taskLink = await getRedirectLink(taskHref);
            if (!taskLink) {
              debug('获取重定向链接失败');
              return false;
            }
            debug('分类任务', {
              taskLink: taskLink,
              taskIcon: taskIcon,
              taskName: taskName
            });
            this.#classifyTaskByType(taskLink, taskIcon, taskName);
            return true;
          } catch (error) {
            debug('获取重定向链接失败', {
              error: error
            });
            throwError(error, 'Giveawaysu.classifyTask->getRedirectLink');
            return false;
          }
        };
        debug('开始处理所有任务');
        const results = await Promise.all(Array.from(tasks).map(processTask));
        const success = results.some((result => result));
        if (!success) {
          debug('所有任务处理失败');
          logStatus.error(I18n('allTasksFailed'));
          return false;
        }
        debug('任务处理完成');
        logStatus.success();
        this.undoneTasks = this.uniqueTasks(this.undoneTasks);
        this.socialTasks = this.undoneTasks;
        debug('保存任务信息');
        GM_setValue(`gasTasks-${this.giveawayId}`, {
          tasks: this.socialTasks,
          time: (new Date).getTime()
        });
        return true;
      } catch (error) {
        debug('任务分类失败', {
          error: error
        });
        throwError(error, 'Giveawaysu.classifyTask');
        return false;
      }
    }
    static TASK_PATTERNS={
      wishlist: /wishlist.*game|add.*wishlist/gim,
      follow: /follow.*button/gim,
      twitter: /(on twitter)|(Follow.*on.*Facebook)/gim,
      vkGroup: /join.*vk.*group/gim,
      youtubeVideo: /(watch|like).*video/gim,
      youtubeChannel: /subscribe.*youtube.*channel/gim,
      watchArt: /watch.*art/gim,
      reddit: /subscribe.*subreddit|follow.*reddit/gim,
      twitchChannel: /follow.*twitch.*channel/gim,
      instagram: /follow.*instagram/gim,
      discord: /join.*discord/gim,
      playtest: /request.*playtest/gim,
      steamForum: /subscribe.*steam.*forum/gim,
      curator: /(follow|subscribe).*curator/gim,
      curatorLink: /^https?:\/\/store\.steampowered\.com\/curator\//,
      announcement: /like.*announcement/gim,
      steamGroup: /join/gi
    };
    #classifyTaskByType(taskLink, taskIcon, taskName) {
      try {
        debug('开始分类任务', {
          taskLink: taskLink,
          taskIcon: taskIcon,
          taskName: taskName
        });
        const {TASK_PATTERNS: TASK_PATTERNS} = GiveawaySu;
        if (taskIcon.includes('steam') && TASK_PATTERNS.steamGroup.test(taskName)) {
          debug('添加 Steam 组任务');
          this.undoneTasks.steam.groupLinks.push(taskLink);
          return;
        }
        if (TASK_PATTERNS.announcement.test(taskName)) {
          debug('添加 Steam 公告任务');
          this.undoneTasks.steam.announcementLinks.push(taskLink);
          return;
        }
        if (TASK_PATTERNS.curator.test(taskName) && TASK_PATTERNS.curatorLink.test(taskLink)) {
          debug('添加 Steam 鉴赏家关注任务');
          this.undoneTasks.steam.curatorLinks.push(taskLink);
          return;
        }
        if (taskIcon.includes('steam') && /follow|subscribe/gim.test(taskName)) {
          debug('添加 Steam 鉴赏家点赞任务');
          this.undoneTasks.steam.curatorLikeLinks.push(taskLink);
          return;
        }
        if (TASK_PATTERNS.steamForum.test(taskName)) {
          debug('添加 Steam 论坛任务');
          this.undoneTasks.steam.forumLinks.push(taskLink);
          return;
        }
        if (taskIcon.includes('thumbs-up') && /^https?:\/\/steamcommunity\.com\/sharedfiles\/filedetails\/\?id=[\d]+/.test(taskLink)) {
          debug('添加 Steam 创意工坊投票任务');
          this.undoneTasks.steam.workshopVoteLinks.push(taskLink);
          return;
        }
        if (taskIcon.includes('plus') && TASK_PATTERNS.playtest.test(taskName)) {
          debug('添加 Steam 游戏测试任务');
          this.undoneTasks.steam.playtestLinks.push(taskLink);
          return;
        }
        if (taskIcon.includes('discord') || TASK_PATTERNS.discord.test(taskName)) {
          debug('添加 Discord 服务器任务');
          this.undoneTasks.discord.serverLinks.push(taskLink);
          return;
        }
        if (taskIcon.includes('instagram') || TASK_PATTERNS.instagram.test(taskName)) {
          debug('跳过 Instagram 任务');
          return;
        }
        if (taskIcon.includes('twitch') || TASK_PATTERNS.twitchChannel.test(taskName)) {
          debug('添加 Twitch 频道任务');
          this.undoneTasks.twitch.channelLinks.push(taskLink);
          return;
        }
        if (taskIcon.includes('reddit') || TASK_PATTERNS.reddit.test(taskName)) {
          debug('添加 Reddit 任务');
          this.undoneTasks.reddit.redditLinks.push(taskLink);
          return;
        }
        if (TASK_PATTERNS.watchArt.test(taskName)) {
          debug('添加创意工坊物品任务');
          this.undoneTasks.steam.workshopVoteLinks.push(taskLink);
          return;
        }
        if (TASK_PATTERNS.youtubeChannel.test(taskName)) {
          debug('添加 YouTube 频道任务');
          this.undoneTasks.youtube.channelLinks.push(taskLink);
          return;
        }
        if (TASK_PATTERNS.youtubeVideo.test(taskName) || (taskIcon.includes('youtube') || taskIcon.includes('thumbs-up')) && TASK_PATTERNS.youtubeVideo.test(taskName)) {
          debug('添加 YouTube 视频任务');
          this.undoneTasks.youtube.likeLinks.push(taskLink);
          return;
        }
        if (taskIcon.includes('vk') || TASK_PATTERNS.vkGroup.test(taskName)) {
          debug('添加 VK 任务');
          this.undoneTasks.vk.nameLinks.push(taskLink);
          return;
        }
        if (TASK_PATTERNS.twitter.test(taskName)) {
          debug('跳过 Twitter 任务');
          return;
        }
        if (TASK_PATTERNS.wishlist.test(taskName)) {
          debug('添加 Steam 愿望单任务');
          this.undoneTasks.steam.wishlistLinks.push(taskLink);
        }
        if (TASK_PATTERNS.follow.test(taskName)) {
          debug('添加 Steam 关注任务');
          this.undoneTasks.steam.followLinks.push(taskLink);
          return;
        }
        debug('未识别的任务类型', {
          taskLink: taskLink,
          taskIcon: taskIcon,
          taskName: taskName
        });
      } catch (error) {
        debug('任务分类失败', {
          error: error
        });
        throwError(error, 'Giveawaysu.classifyTaskByType');
      }
    }
    #checkLogin() {
      try {
        debug('检查登录状态');
        if (!globalOptions.other.checkLogin) {
          debug('跳过登录检查');
          return true;
        }
        const needLogin = $('a.steam-login').length > 0;
        if (needLogin) {
          debug('未登录，重定向到 Steam 登录');
          window.open('/steam/redirect', '_self');
        }
        debug('登录检查完成', {
          needLogin: needLogin
        });
        return true;
      } catch (error) {
        debug('登录检查失败', {
          error: error
        });
        throwError(error, 'Giveawaysu.checkLogin');
        return false;
      }
    }
    async #checkLeftKey() {
      try {
        debug('检查剩余密钥');
        if (!globalOptions.other.checkLeftKey) {
          debug('跳过密钥检查');
          return true;
        }
        const isEnded = $('.giveaway-ended').length > 0;
        const hasNoKeys = $('.giveaway-key').length === 0;
        debug('检查抽奖状态', {
          isEnded: isEnded,
          hasNoKeys: hasNoKeys
        });
        if (!(isEnded && hasNoKeys)) {
          return true;
        }
        debug('没有剩余密钥，显示确认对话框');
        const {value: value} = await Swal.fire({
          icon: 'warning',
          title: I18n('notice'),
          text: I18n('noKeysLeft'),
          confirmButtonText: I18n('confirm'),
          cancelButtonText: I18n('cancel'),
          showCancelButton: true
        });
        if (value) {
          debug('用户确认关闭窗口');
          window.close();
        }
        return true;
      } catch (error) {
        debug('检查剩余密钥失败', {
          error: error
        });
        throwError(error, 'Giveawaysu.checkLeftKey');
        return false;
      }
    }
    #getGiveawayId() {
      try {
        debug('从URL获取抽奖ID');
        const giveawayId = window.location.href.match(/\/view\/([\d]+)/)?.[1];
        if (giveawayId) {
          this.giveawayId = giveawayId;
          debug('获取抽奖ID成功', {
            giveawayId: giveawayId
          });
          return true;
        }
        debug('获取抽奖ID失败');
        echoLog({
          text: I18n('getFailed', 'GiveawayId')
        });
        return false;
      } catch (error) {
        debug('获取抽奖ID出错', {
          error: error
        });
        throwError(error, 'Giveawaysu.getGiveawayId');
        return false;
      }
    }
  }
  class Indiedb {
    name='Indiedb';
    buttons=[ 'doTask' ];
    static test() {
      const {host: host} = window.location;
      const isMatch = host === 'www.indiedb.com';
      debug('检查网站匹配', {
        host: host,
        isMatch: isMatch
      });
      return isMatch;
    }
    async after() {
      try {
        debug('开始执行后续操作');
        if (!this.#checkLogin()) {
          debug('检查登录失败');
          echoLog({}).warning(I18n('checkLoginFailed'));
        }
        if (!await this.#checkLeftKey()) {
          debug('检查剩余密钥失败');
          echoLog({}).warning(I18n('checkLeftKeyFailed'));
        }
      } catch (error) {
        debug('后续操作失败', {
          error: error
        });
        throwError(error, 'Indiedb.after');
      }
    }
    async doTask() {
      try {
        debug('开始执行任务');
        if (!await this.#join()) {
          debug('加入抽奖失败');
          return false;
        }
        return await this.#do();
      } catch (error) {
        debug('执行任务失败', {
          error: error
        });
        throwError(error, 'Indiedb.doTask');
        return false;
      }
    }
    async #join() {
      try {
        debug('开始加入抽奖');
        if ($('a.buttonenter:contains(Register to join)').length > 0) {
          debug('需要登录');
          echoLog({}).error(I18n('needLogin'));
          return false;
        }
        const currentoption = $('a.buttonenter.buttongiveaway');
        const buttonText = currentoption.text();
        debug('检查按钮状态', {
          buttonText: buttonText
        });
        if (/success/gim.test($('a.buttonenter.buttongiveaway').text())) {
          debug('已成功加入抽奖');
          return true;
        }
        if (!/join giveaway/gim.test(buttonText)) {
          debug('需要加入抽奖');
          echoLog({}).warning(I18n('needJoinGiveaway'));
          return false;
        }
        const logStatus = echoLog({
          text: `${I18n('joiningGiveaway')}...`
        });
        debug('发送加入请求');
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: currentoption.attr('href'),
          method: 'POST',
          data: 'ajax=t',
          dataType: 'json',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Accept: 'application/json, text/javascript, */*; q=0.01',
            Origin: window.location.origin,
            referer: window.location.href
          }
        });
        if (result !== 'Success') {
          debug('请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status !== 200) {
          debug('尝试备用加入方法');
          if (await this.#join2()) {
            debug('备用加入方法成功');
            logStatus.success('Success');
            return true;
          }
          debug('加入失败', {
            status: data?.status,
            statusText: data?.statusText
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        if (!data.response?.success) {
          debug('响应失败', {
            text: data.response?.text
          });
          logStatus.error(`Error${data.response?.text ? `:${data.response?.text}` : ''}`);
          return false;
        }
        debug('加入成功');
        currentoption.addClass('buttonentered').text('Success - Giveaway joined');
        $('#giveawaysjoined').slideDown();
        $('#giveawaysrecommend').slideDown();
        logStatus.success(`Success${data.response?.text ? `:${data.response?.text}` : ''}`);
        return true;
      } catch (error) {
        debug('加入抽奖失败', {
          error: error
        });
        throwError(error, 'Indiedb.join');
        return false;
      }
    }
    async #join2() {
      try {
        debug('开始备用加入方法');
        return await new Promise((resolve => {
          const targetNode = document.getElementById('giveawaysjoined');
          const config = {
            attributes: true
          };
          const observer = new MutationObserver((() => {
            if ($('#giveawaysjoined').is(':visible')) {
              debug('检测到加入成功');
              resolve(true);
              observer.disconnect();
            }
          }));
          observer.observe(targetNode, config);
          debug('点击加入按钮');
          $('a.buttonenter.buttongiveaway')[0]?.click();
          setTimeout((() => {
            debug('加入超时');
            resolve(false);
            observer.disconnect();
          }), 3e4);
        }));
      } catch (error) {
        debug('备用加入方法失败', {
          error: error
        });
        throwError(error, 'Indiedb.join2');
        return false;
      }
    }
    async #do() {
      try {
        debug('开始执行任务');
        const id = $('script').map(((index, script) => {
          if (!/\$\(document\)/gim.test(script.innerHTML)) {
            return null;
          }
          return [ script.innerHTML.match(/"\/[\d]+"/gim)?.[0]?.match(/[\d]+/)?.[0], script.innerHTML.match(/"\/newsletter\/ajax\/subscribeprofile\/optin\/[\d]+"/gim)?.[0]?.match(/[\d]+/)?.[0] ];
        }));
        if (id.length < 2) {
          debug('获取任务ID失败');
          echoLog({}).error(I18n('getFailed', 'TaskId'));
          return false;
        }
        const pro = [];
        const tasks = $('#giveawaysjoined a[class*=promo]');
        debug('找到任务', {
          count: tasks.length
        });
        for (const task of tasks) {
          const promo = $(task);
          if (promo.hasClass('buttonentered')) {
            debug('跳过已完成任务');
            continue;
          }
          const taskText = promo.parents('p').text();
          debug('处理任务', {
            taskText: taskText
          });
          const status = echoLog({
            text: `${I18n('doing')}:${taskText}...`
          });
          if (/the-challenge-of-adblock/gim.test(promo.attr('href'))) {
            debug('跳过未知任务类型');
            status.error(`Error:${I18n('unKnownTaskType')}`);
            continue;
          }
          if (/facebookpromo|twitterpromo|visitpromo/gim.test(task.className)) {
            let text = '';
            if (promo.hasClass('facebookpromo')) {
              text = 'facebookpromo';
            } else if (promo.hasClass('twitterpromo')) {
              text = 'twitterpromo';
            } else {
              text = 'visitpromo';
            }
            debug('处理社交媒体任务', {
              type: text
            });
            pro.push(this.#handleSocialPromo(text, id[0], status, promo));
          } else if (promo.hasClass('emailoptinpromo')) {
            debug('处理邮件订阅任务');
            pro.push(this.#handleEmailPromo(id[1], status, promo));
          } else if (promo.hasClass('watchingpromo')) {
            debug('处理关注任务');
            pro.push(this.#handleWatchingPromo(promo, status));
          } else {
            debug('处理默认任务');
            pro.push(this.#handleDefaultPromo(promo, status));
          }
        }
        await Promise.all(pro);
        debug('所有任务完成');
        echoLog({}).success(I18n('allTasksComplete'));
        return true;
      } catch (error) {
        debug('执行任务失败', {
          error: error
        });
        throwError(error, 'Indiedb.do');
        return false;
      }
    }
    async #handleSocialPromo(text, id, status, promo) {
      try {
        debug('处理社交媒体任务', {
          text: text,
          id: id
        });
        return await new Promise((resolve => {
          $.ajax({
            type: 'POST',
            url: urlPath(`/giveaways/ajax/${text}/${id}`),
            timeout: 6e4,
            dataType: 'json',
            data: {
              ajax: 't'
            },
            error(response, error, exception) {
              debug('请求失败', {
                response: response,
                error: error,
                exception: exception
              });
              if (window.DEBUG) {
                console.log('%cAuto-Task[Debug]:', 'color:red', {
                  response: response,
                  error: error,
                  exception: exception
                });
              }
              status.error('Error:An error has occurred performing the action requested. Please try again shortly.');
              resolve(true);
            },
            success(response) {
              if (response.success) {
                debug('任务完成', {
                  response: response
                });
                status.success(`Success:${response.text}`);
                promo.addClass('buttonentered').closest('p').html(promo.closest('p').find('span').html());
              } else {
                debug('任务失败', {
                  response: response
                });
                status.error(`Error:${response.text}`);
              }
              resolve(true);
            }
          });
        }));
      } catch (error) {
        debug('处理社交媒体任务失败', {
          error: error
        });
        throwError(error, 'Indiedb.handleSocialPromo');
        return false;
      }
    }
    async #handleEmailPromo(id, status, promo) {
      try {
        debug('处理邮件订阅任务', {
          id: id
        });
        return await new Promise((resolve => {
          $.ajax({
            type: 'POST',
            url: urlPath(`/newsletter/ajax/subscribeprofile/optin/${id}`),
            timeout: 6e4,
            dataType: 'json',
            data: {
              ajax: 't',
              emailsystoggle: 4
            },
            error(response, error, exception) {
              debug('请求失败', {
                response: response,
                error: error,
                exception: exception
              });
              if (window.DEBUG) {
                console.log('%cAuto-Task[Debug]:', 'color:red', {
                  response: response,
                  error: error,
                  exception: exception
                });
              }
              status.error('Error:An error has occurred performing the action requested. Please try again shortly.');
              resolve(true);
            },
            success(response) {
              if (response.success) {
                debug('任务完成', {
                  response: response
                });
                status.success(`Success:${response.text}`);
                promo.toggleClass('buttonentered').closest('p').html(promo.closest('p').find('span').html());
              } else {
                debug('任务失败', {
                  response: response
                });
                status.error(`Error:${response.text}`);
              }
              resolve(true);
            }
          });
        }));
      } catch (error) {
        debug('处理邮件订阅任务失败', {
          error: error
        });
        throwError(error, 'Indiedb.handleEmailPromo');
        return false;
      }
    }
    async #handleWatchingPromo(promo, status) {
      try {
        debug('处理关注任务');
        return await new Promise((resolve => {
          const href = promo.attr('href');
          if (!href) {
            debug('无效的链接');
            status.error('Error: Invalid href');
            resolve(true);
            return;
          }
          const data = getUrlQuery(href);
          data.ajax = 't';
          const [baseUrl] = href.split(/[?#]/);
          if (!baseUrl) {
            debug('无效的URL');
            status.error('Error: Invalid URL');
            resolve(true);
            return;
          }
          debug('发送请求', {
            url: baseUrl,
            data: data
          });
          $.ajax({
            type: 'POST',
            url: urlPath(baseUrl),
            timeout: 6e4,
            dataType: 'json',
            data: data,
            error(response, error, exception) {
              debug('请求失败', {
                response: response,
                error: error,
                exception: exception
              });
              if (window.DEBUG) {
                console.log('%cAuto-Task[Debug]:', 'color:red', {
                  response: response,
                  error: error,
                  exception: exception
                });
              }
              status.error('Error:An error has occurred performing the action requested. Please try again shortly.');
              resolve(true);
            },
            success(response) {
              if (response.success) {
                debug('任务完成', {
                  response: response
                });
                status.success(`Success:${response.text}`);
                promo.toggleClass('buttonentered').closest('p').html(promo.closest('p').find('span').html());
              } else {
                debug('任务失败', {
                  response: response
                });
                status.error(`Error:${response.text}`);
              }
              resolve(true);
            }
          });
        }));
      } catch (error) {
        debug('处理关注任务失败', {
          error: error
        });
        throwError(error, 'Indiedb.handleWatchingPromo');
        return false;
      }
    }
    async #handleDefaultPromo(promo, status) {
      try {
        debug('处理默认任务');
        return await new Promise((resolve => {
          const href = promo.attr('href');
          if (!href) {
            debug('无效的链接');
            status.error('Error: Invalid href');
            resolve(true);
            return;
          }
          debug('发送请求', {
            url: href
          });
          $.ajax({
            type: 'POST',
            url: urlPath(href),
            timeout: 6e4,
            dataType: 'json',
            data: {
              ajax: 't'
            },
            error(response, error, exception) {
              debug('请求失败', {
                response: response,
                error: error,
                exception: exception
              });
              if (window.DEBUG) {
                console.log('%cAuto-Task[Debug]:', 'color:red', {
                  response: response,
                  error: error,
                  exception: exception
                });
              }
              status.error('Error:An error has occurred performing the action requested. Please try again shortly.');
              resolve(true);
            },
            success(response) {
              if (response.success) {
                debug('任务完成', {
                  response: response
                });
                status.success(`Success:${response.text}`);
                promo.toggleClass('buttonentered').closest('p').html(promo.closest('p').find('span').html());
              } else {
                debug('任务失败', {
                  response: response
                });
                status.error(`Error:${response.text}`);
              }
              resolve(true);
            }
          });
        }));
      } catch (error) {
        debug('处理默认任务失败', {
          error: error
        });
        throwError(error, 'Indiedb.handleDefaultPromo');
        return false;
      }
    }
    #checkLogin() {
      try {
        debug('检查登录状态');
        if (!globalOptions.other.checkLogin) {
          debug('跳过登录检查');
          return true;
        }
        if ($('a.buttonenter:contains(Register to join)').length > 0) {
          debug('未登录，重定向到登录页面');
          window.open('/members/login', '_self');
        }
        debug('登录检查完成');
        return true;
      } catch (error) {
        debug('检查登录失败', {
          error: error
        });
        throwError(error, 'Indiedb.checkLogin');
        return false;
      }
    }
    async #checkLeftKey() {
      try {
        debug('检查剩余密钥');
        if (!globalOptions.other.checkLeftKey) {
          debug('跳过密钥检查');
          return true;
        }
        const hasEndedButton = $('a.buttonenter:contains("next time"), a.buttonenter:contains("Giveaway is closed")').length > 0;
        debug('检查抽奖状态', {
          hasEndedButton: hasEndedButton
        });
        if (!hasEndedButton) {
          return true;
        }
        debug('抽奖已结束，显示确认对话框');
        const {value: value} = await Swal.fire({
          icon: 'warning',
          title: I18n('notice'),
          text: I18n('giveawayEnded'),
          confirmButtonText: I18n('confirm'),
          cancelButtonText: I18n('cancel'),
          showCancelButton: true
        });
        if (value) {
          debug('用户确认关闭窗口');
          window.close();
        }
        return true;
      } catch (error) {
        debug('检查剩余密钥失败', {
          error: error
        });
        throwError(error, 'Indiedb.checkLeftKey');
        return false;
      }
    }
  }
  const defaultTasksTemplate$6 = {
    steam: {
      groupLinks: [],
      officialGroupLinks: [],
      wishlistLinks: [],
      curatorLinks: []
    },
    discord: {
      serverLinks: []
    },
    extra: {
      videoTasks: []
    },
    links: []
  };
  const defaultTasks$7 = JSON.stringify(defaultTasksTemplate$6);
  class Keyhub extends Website {
    name='Keyhub';
    socialTasks=(() => JSON.parse(defaultTasks$7))();
    undoneTasks=(() => JSON.parse(defaultTasks$7))();
    buttons=[ 'doTask', 'undoTask' ];
    static test() {
      const {host: host} = window.location;
      const isMatch = host === 'key-hub.eu';
      debug('检查网站匹配', {
        host: host,
        isMatch: isMatch
      });
      return isMatch;
    }
    async after() {
      try {
        debug('开始执行后续操作');
        if (!this.#checkLogin()) {
          debug('检查登录失败');
          echoLog({}).warning(I18n('checkLoginFailed'));
        }
        if (!await this.#checkLeftKey()) {
          debug('检查剩余密钥失败');
          echoLog({}).warning(I18n('checkLeftKeyFailed'));
        }
        debug('隐藏 NSFW 内容');
        $('.NSFW').hide();
      } catch (error) {
        debug('后续操作失败', {
          error: error
        });
        throwError(error, 'Keyhub.after');
      }
    }
    init() {
      try {
        debug('开始初始化');
        const logStatus = echoLog({
          text: I18n('initing')
        });
        if ($('a[href*="/connect/steam"]').length > 0) {
          debug('需要登录 Steam');
          window.open('/connect/steam', '_self');
          logStatus.warning(I18n('needLogin'));
          return false;
        }
        if (!this.#getGiveawayId()) {
          debug('获取抽奖ID失败');
          return false;
        }
        debug('隐藏 VPN 覆盖层');
        $('#VPNoverlay').hide();
        $('#mainArticleSection').show();
        this.initialized = true;
        debug('初始化完成');
        logStatus.success();
        return true;
      } catch (error) {
        debug('初始化失败', {
          error: error
        });
        throwError(error, 'Keyhub.init');
        return false;
      }
    }
    async classifyTask(action) {
      try {
        debug('开始分类任务', {
          action: action
        });
        const logStatus = echoLog({
          text: I18n('getTasksInfo')
        });
        if (action === 'undo') {
          debug('恢复已保存的任务信息');
          this.socialTasks = GM_getValue(`khTasks-${this.giveawayId}`)?.tasks || JSON.parse(defaultTasks$7);
        }
        const tasks = $('.task:not(".googleads")').filter(((index, element) => action === 'do' ? $(element).find('i.fa-check-circle:visible').length === 0 : true)).find('a');
        debug('找到任务', {
          count: tasks.length
        });
        for (const task of tasks) {
          let link = $(task).attr('href');
          const taskDes = $(task).text().trim();
          debug('处理任务', {
            taskDes: taskDes,
            link: link
          });
          if (!link) {
            debug('跳过无链接任务');
            continue;
          }
          if (/\/away\?data=/.test(link) || /steamcommunity\.com\/gid\//.test(link)) {
            debug('获取重定向链接');
            link = await getRedirectLink(link) || link;
          }
          if (/https?:\/\/key-hub\.eu\/connect\/discord/.test(link)) {
            debug('处理 Discord 连接任务');
            GM_openInTab(link, {
              active: true
            });
            continue;
          }
          if (/steamcommunity\.com\/groups\//.test(link)) {
            debug('处理 Steam 组任务');
            if (action === 'undo') {
              this.socialTasks.steam.groupLinks.push(link);
            }
            if (action === 'do') {
              this.undoneTasks.steam.groupLinks.push(link);
            }
            continue;
          }
          if (/steamcommunity\.com\/games\/[\d]+/.test(link)) {
            debug('处理 Steam 官方组任务');
            if (action === 'undo') {
              this.socialTasks.steam.officialGroupLinks.push(link);
            }
            if (action === 'do') {
              this.undoneTasks.steam.officialGroupLinks.push(link);
            }
            continue;
          }
          if (/store\.steampowered\.com\/app\//.test(link) && /wishlist/gim.test(taskDes)) {
            debug('处理 Steam 愿望单任务');
            if (action === 'undo') {
              this.socialTasks.steam.wishlistLinks.push(link);
            }
            if (action === 'do') {
              this.undoneTasks.steam.wishlistLinks.push(link);
            }
            continue;
          }
          if (/store\.steampowered\.com\/curator\//.test(link)) {
            debug('处理 Steam 鉴赏家任务');
            if (action === 'undo') {
              this.socialTasks.steam.curatorLinks.push(link);
            }
            if (action === 'do') {
              this.undoneTasks.steam.curatorLinks.push(link);
            }
            continue;
          }
          if (/^https?:\/\/discord\.com\/invite\//.test(link)) {
            debug('处理 Discord 服务器任务');
            if (action === 'undo') {
              this.socialTasks.discord.serverLinks.push(link);
            }
            if (action === 'do') {
              this.undoneTasks.discord.serverLinks.push(link);
            }
            continue;
          }
          if (/^javascript:videoTask.+/.test(link)) {
            debug('处理视频任务');
            if (action === 'do') {
              const taskData = link.match(/javascript:videoTask\('.+?','(.+?)'/)?.[1];
              if (taskData) {
                debug('添加视频任务', {
                  taskData: taskData
                });
                this.undoneTasks.extra.videoTasks.push(taskData);
              }
            }
            continue;
          }
          if (this.#isSkippableLink(link)) {
            debug('跳过可忽略的链接', {
              link: link
            });
            continue;
          }
          debug('未知任务类型', {
            taskDes: taskDes,
            link: link
          });
          echoLog({}).warning(`${I18n('unKnownTaskType')}: ${taskDes}(${link})`);
        }
        debug('任务分类完成');
        logStatus.success();
        this.undoneTasks = this.uniqueTasks(this.undoneTasks);
        this.socialTasks = this.uniqueTasks(this.socialTasks);
        if (window.DEBUG) {
          console.log('%cAuto-Task[Debug]:', 'color:blue', JSON.stringify(this));
        }
        debug('保存任务信息');
        GM_setValue(`khTasks-${this.giveawayId}`, {
          tasks: this.socialTasks,
          time: (new Date).getTime()
        });
        return true;
      } catch (error) {
        debug('任务分类失败', {
          error: error
        });
        throwError(error, 'Keyhub.classifyTask');
        return false;
      }
    }
    #isSkippableLink(link) {
      return /^https?:\/\/www\.instagram\.com\/.*/.test(link) || /^https?:\/\/twitter\.com\/.*/.test(link) || /^https?:\/\/www\.twitch\.tv\/.*/.test(link) || /^https?:\/\/www\.facebook\.com\/.*/.test(link) || /^https?:\/\/www\.youtube\.com\/.*/.test(link) || /^https?:\/\/store\.steampowered\.com\/developer\//.test(link) || /^https?:\/\/.*?\.itch\.io\/.*/.test(link) || /^https?:\/\/key-hub\.eu.*/.test(link) || /^https?:\/\/store\.steampowered\.com\/app\/.*/.test(link) || /^https?:\/\/qr\.streamelements\.com\/.*/.test(link) || /^https?:\/\/store\.steampowered\.com\/news\/app\/.*/.test(link);
    }
    async #doScriptTask(data) {
      try {
        debug('执行脚本任务', {
          data: data
        });
        const logStatus = echoLog({
          text: I18n('doingKeyhubTask')
        });
        const {result: result, statusText: statusText, status: status, data: response} = await httpRequest({
          url: `/away?data=${data}`,
          method: 'GET',
          headers: {
            origin: 'https://key-hub.eu',
            referer: 'https://key-hub.eu/'
          }
        });
        if (result !== 'Success') {
          debug('请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (response?.status !== 200) {
          debug('响应错误', {
            status: response?.status,
            statusText: response?.statusText
          });
          logStatus.error(`Error:${response?.statusText}(${response?.status})`);
          return false;
        }
        debug('任务完成');
        logStatus.success();
        return true;
      } catch (error) {
        debug('执行脚本任务失败', {
          error: error
        });
        throwError(error, 'Keyhub.doScriptTask');
        return false;
      }
    }
    async extraDoTask(_ref17) {
      let {videoTasks: videoTasks} = _ref17;
      try {
        debug('开始执行额外任务', {
          count: videoTasks.length
        });
        const pro = [];
        for (const data of videoTasks) {
          pro.push(this.#doScriptTask(data));
        }
        return Promise.all(pro).then((() => {
          debug('所有额外任务完成');
          return true;
        }));
      } catch (error) {
        debug('执行额外任务失败', {
          error: error
        });
        throwError(error, 'Keyhub.extraDoTask');
        return false;
      }
    }
    #getGiveawayId() {
      try {
        debug('获取抽奖ID');
        const giveawayId = window.location.href.match(/giveaway\/([\d]+)/)?.[1];
        if (giveawayId) {
          this.giveawayId = giveawayId;
          debug('获取抽奖ID成功', {
            giveawayId: giveawayId
          });
          return true;
        }
        debug('获取抽奖ID失败');
        echoLog({}).error(I18n('getFailed', 'GiveawayId'));
        return false;
      } catch (error) {
        debug('获取抽奖ID出错', {
          error: error
        });
        throwError(error, 'Keyhub.getGiveawayId');
        return false;
      }
    }
    async #checkLeftKey() {
      try {
        debug('检查剩余密钥');
        if (!globalOptions.other.checkLeftKey) {
          debug('跳过密钥检查');
          return true;
        }
        const leftKey = $('#keysleft').text().trim();
        debug('检查剩余密钥数量', {
          leftKey: leftKey
        });
        if (leftKey !== '0') {
          return true;
        }
        debug('没有剩余密钥，显示确认对话框');
        const {value: value} = await Swal.fire({
          icon: 'warning',
          title: I18n('notice'),
          text: I18n('noKeysLeft'),
          confirmButtonText: I18n('confirm'),
          cancelButtonText: I18n('cancel'),
          showCancelButton: true
        });
        if (value) {
          debug('用户确认关闭窗口');
          window.close();
        }
        return true;
      } catch (error) {
        debug('检查剩余密钥失败', {
          error: error
        });
        throwError(error, 'Keyhub.checkLeftKey');
        return false;
      }
    }
    #checkLogin() {
      try {
        debug('检查登录状态');
        if (!globalOptions.other.checkLogin) {
          debug('跳过登录检查');
          return true;
        }
        if ($('a[href*="/connect/steam"]').length > 0) {
          debug('未登录，重定向到 Steam 登录页面');
          window.open('/connect/steam', '_self');
        }
        debug('登录检查完成');
        return true;
      } catch (error) {
        debug('检查登录失败', {
          error: error
        });
        throwError(error, 'Keyhub.checkLogin');
        return false;
      }
    }
  }
  const defaultTasksTemplate$5 = {
    steam: {
      groupLinks: [],
      wishlistLinks: [],
      curatorLinks: [],
      curatorLikeLinks: []
    },
    twitter: {
      userLinks: []
    },
    vk: {
      nameLinks: []
    },
    discord: {
      serverLinks: []
    }
  };
  const defaultTasks$6 = JSON.stringify(defaultTasksTemplate$5);
  class Givekey extends Website {
    name='Givekey';
    tasks=[];
    socialTasks=(() => JSON.parse(defaultTasks$6))();
    undoneTasks=(() => JSON.parse(defaultTasks$6))();
    userId;
    buttons=[ 'doTask', 'undoTask', 'verifyTask' ];
    static test() {
      const url = window.location.host;
      const isMatch = url === 'givekey.ru';
      debug('检查网站匹配', {
        url: url,
        isMatch: isMatch
      });
      return isMatch;
    }
    async after() {
      try {
        debug('开始执行后续操作');
        await new Promise((resolve => {
          const checker = setInterval((() => {
            if ($('#navbarDropdown').length > 0) {
              debug('导航栏元素已加载');
              clearInterval(checker);
              resolve(true);
            }
          }), 500);
        }));
        if (!await this.#checkLeftKey()) {
          debug('检查剩余密钥失败');
          echoLog({}).warning(I18n('checkLeftKeyFailed'));
        }
      } catch (error) {
        debug('后续操作失败', {
          error: error
        });
        throwError(error, 'Givekey.after');
      }
    }
    init() {
      try {
        debug('初始化 Givekey');
        const logStatus = echoLog({
          text: I18n('initing')
        });
        if ($('a[href*="/auth/steam"]').length > 0) {
          debug('未登录，重定向到 Steam 登录页面');
          window.open('/auth/steam', '_self');
          logStatus.warning(I18n('needLogin'));
          return false;
        }
        if (!this.#getGiveawayId()) {
          debug('获取抽奖ID失败');
          return false;
        }
        const userId = $('meta[name="user-id"]').attr('content');
        if (!userId) {
          debug('获取用户ID失败');
          logStatus.error(I18n('getFailed', I18n('userId')));
          return false;
        }
        this.userId = userId;
        this.initialized = true;
        debug('初始化完成', {
          userId: userId
        });
        logStatus.success();
        return true;
      } catch (error) {
        debug('初始化失败', {
          error: error
        });
        throwError(error, 'Givekey.init');
        return false;
      }
    }
    async classifyTask(action) {
      try {
        debug('开始分类任务', {
          action: action
        });
        const logStatus = echoLog({
          text: I18n('getTasksInfo')
        });
        if (action === 'undo') {
          debug('恢复已保存的任务信息');
          this.socialTasks = GM_getValue(`gkTasks-${this.giveawayId}`)?.tasks || JSON.parse(defaultTasks$6);
        }
        const tasks = $('.card-body:has("button") .row');
        debug('找到任务元素', {
          count: tasks.length
        });
        for (const task of tasks) {
          const taskEle = $(task);
          const button = taskEle.find('button');
          const isSuccess = /Complete/i.test(button.text().trim());
          debug('处理任务', {
            isSuccess: isSuccess
          });
          if (isSuccess && action !== 'undo') {
            debug('跳过已完成的任务');
            continue;
          }
          const checkButton = taskEle.find('#task_check');
          const taskId = checkButton.attr('data-id');
          if (taskId) {
            debug('添加任务ID', {
              taskId: taskId
            });
            this.tasks.push(taskId);
          }
          if (action === 'verify') {
            continue;
          }
          const taskLink = taskEle.find('a');
          let href = taskLink.attr('href');
          if (!href) {
            debug('任务链接为空');
            continue;
          }
          const text = taskLink.text().trim();
          if (!text) {
            debug('任务描述为空');
            continue;
          }
          if (/^https?:\/\/givekey\.ru\/giveaway\/[\d]+\/execution_task/.test(href)) {
            debug('获取重定向链接', {
              href: href
            });
            href = await getRedirectLink(href);
          }
          if (!href) {
            debug('获取重定向链接失败');
            continue;
          }
          const icon = taskEle.find('i');
          await this.#classifyTaskByType(href, text, icon, isSuccess, action);
        }
        debug('任务分类完成');
        logStatus.success();
        this.tasks = unique(this.tasks);
        this.undoneTasks = this.uniqueTasks(this.undoneTasks);
        this.socialTasks = this.uniqueTasks(this.socialTasks);
        debug('保存任务信息');
        GM_setValue(`gkTasks-${this.giveawayId}`, {
          tasks: this.socialTasks,
          time: (new Date).getTime()
        });
        return true;
      } catch (error) {
        debug('任务分类失败', {
          error: error
        });
        throwError(error, 'Givekey.classifyTask');
        return false;
      }
    }
    async verifyTask() {
      try {
        debug('开始验证任务');
        if (!this.initialized && !this.init()) {
          debug('初始化失败');
          return false;
        }
        if (this.tasks.length === 0 && !await this.classifyTask('verify')) {
          debug('任务分类失败');
          return false;
        }
        echoLog({}).warning(I18n('giveKeyNoticeBefore'));
        const taskLength = this.tasks.length;
        debug('开始验证任务', {
          taskCount: taskLength
        });
        for (let i = 0; i < taskLength; i++) {
          await this.#verify(this.tasks[i]);
          if (i < taskLength - 1) {
            debug('等待15秒');
            await delay(15e3);
          }
        }
        debug('所有任务验证完成');
        echoLog({}).success(I18n('allTasksComplete'));
        echoLog({
          html: `<li><font class="warning">${I18n('giveKeyNoticeAfter')}</font></li>`
        });
        return true;
      } catch (error) {
        debug('任务验证失败', {
          error: error
        });
        throwError(error, 'Givekey.verifyTask');
        return false;
      }
    }
    async #verify(task) {
      try {
        debug('验证任务', {
          taskId: task
        });
        const logStatus = echoLog({
          html: `<li>${I18n('verifyingTask')}${task}...<font></font></li>`
        });
        const csrfToken = $('meta[name="csrf-token"]').attr('content');
        if (!csrfToken) {
          debug('CSRF token 未找到');
          logStatus.error('CSRF token not found');
          return false;
        }
        debug('发送验证请求');
        const response = await $.ajax({
          url: 'https://givekey.ru/giveaway/task',
          method: 'POST',
          data: `id=${task}&user_id=${this.userId}`,
          dataType: 'json',
          headers: {
            'X-CSRF-TOKEN': csrfToken
          }
        });
        if (!response) {
          debug('未收到响应');
          logStatus.error('No response received');
          return false;
        }
        debug('处理响应', {
          response: response
        });
        if (response.btn) {
          $(`button[data-id=${this.userId}]`).html(response.btn);
        }
        if (response.status === 'ok') {
          $(`.task_check_${response.id}`).html(`<button class="btn btn-success mb-2 btn-block" disabled>${response.btn}</button>`);
          debug('任务验证成功');
          logStatus.success();
          return true;
        }
        if (response.status === 'end') {
          debug('获得密钥');
          logStatus.success();
          echoLog({}).success(response.key);
          return true;
        }
        debug('验证失败', {
          error: response.msg
        });
        logStatus.error(`Error:${response.msg}`);
        return false;
      } catch (error) {
        debug('验证过程出错', {
          error: error
        });
        throwError(error, 'Givekey.verify');
        return false;
      }
    }
    #getGiveawayId() {
      try {
        debug('从URL获取抽奖ID');
        const giveawayId = window.location.href.match(/giveaway\/([\d]+)/)?.[1];
        if (giveawayId) {
          this.giveawayId = giveawayId;
          debug('获取抽奖ID成功', {
            giveawayId: giveawayId
          });
          return true;
        }
        debug('获取抽奖ID失败');
        echoLog({
          text: I18n('getFailed', 'GiveawayId')
        });
        return false;
      } catch (error) {
        debug('获取抽奖ID出错', {
          error: error
        });
        throwError(error, 'Givekey.getGiveawayId');
        return false;
      }
    }
    async #checkLeftKey() {
      try {
        debug('检查剩余密钥');
        if (!globalOptions.other.checkLeftKey) {
          debug('跳过密钥检查');
          return true;
        }
        const keysCount = $('#keys_count').text();
        debug('检查密钥数量', {
          keysCount: keysCount
        });
        if (keysCount) {
          return true;
        }
        debug('没有剩余密钥，显示确认对话框');
        const {value: value} = await Swal.fire({
          icon: 'warning',
          title: I18n('notice'),
          text: I18n('noKeysLeft'),
          confirmButtonText: I18n('confirm'),
          cancelButtonText: I18n('cancel'),
          showCancelButton: true
        });
        if (value) {
          debug('用户确认关闭窗口');
          window.close();
        }
        return true;
      } catch (error) {
        debug('检查剩余密钥失败', {
          error: error
        });
        throwError(error, 'Givekey.checkLeftKey');
        return false;
      }
    }
    async #classifyTaskByType(href, text, icon, isSuccess, action) {
      try {
        debug('开始分类任务类型', {
          href: href,
          text: text,
          isSuccess: isSuccess,
          action: action
        });
        if (/^https?:\/\/vk\.com\//.test(href)) {
          debug('添加 VK 任务');
          this.socialTasks.vk.nameLinks.push(href);
          if (action === 'do' && !isSuccess) {
            this.undoneTasks.vk.nameLinks.push(href);
          }
          return;
        }
        if (/^https?:\/\/steamcommunity\.com\/groups/.test(href)) {
          debug('添加 Steam 组任务');
          this.socialTasks.steam.groupLinks.push(href);
          if (action === 'do' && !isSuccess) {
            this.undoneTasks.steam.groupLinks.push(href);
          }
          return;
        }
        if (/^https?:\/\/store\.steampowered\.com\/app\//.test(href)) {
          debug('添加 Steam 愿望单任务');
          this.socialTasks.steam.wishlistLinks.push(href);
          if (action === 'do' && !isSuccess) {
            this.undoneTasks.steam.wishlistLinks.push(href);
          }
          return;
        }
        if (/Subscribe/gi.test(text) && icon.hasClass('fa-steam-square')) {
          if (/^https?:\/\/store\.steampowered\.com\/curator\//.test(href)) {
            debug('添加 Steam 鉴赏家关注任务');
            this.socialTasks.steam.curatorLinks.push(href);
            if (action === 'do' && !isSuccess) {
              this.undoneTasks.steam.curatorLinks.push(href);
            }
          } else {
            debug('添加 Steam 鉴赏家点赞任务');
            this.socialTasks.steam.curatorLikeLinks.push(href);
            if (action === 'do' && !isSuccess) {
              this.undoneTasks.steam.curatorLikeLinks.push(href);
            }
          }
          return;
        }
        if (/^https?:\/\/twitter\.com\//.test(href) && /Subscribe/gi.test(text)) {
          debug('添加 Twitter 关注任务');
          this.socialTasks.twitter.userLinks.push(href);
          if (action === 'do' && !isSuccess) {
            this.undoneTasks.twitter.userLinks.push(href);
          }
          return;
        }
        if (icon.hasClass('fa-discord') || /^https?:\/\/discord\.com\/invite\//.test(href)) {
          debug('添加 Discord 服务器任务');
          this.socialTasks.discord.serverLinks.push(href);
          if (action === 'do' && !isSuccess) {
            this.undoneTasks.discord.serverLinks.push(href);
          }
          return;
        }
        debug('未识别的任务类型', {
          href: href,
          text: text
        });
        echoLog({}).warning(`${I18n('unKnownTaskType')}: ${text}(${href})`);
      } catch (error) {
        debug('任务类型分类失败', {
          error: error
        });
        throwError(error, 'Givekey.classifyTaskByType');
      }
    }
  }
  class GiveeClub extends GiveawaySu {
    name='GiveeClub';
    buttons=[ 'doTask', 'undoTask', 'verifyTask' ];
    static test() {
      const url = window.location.href;
      const isMatch = /^https?:\/\/givee\.club\/.*?\/event\/[\d]+/.test(url);
      debug('检查网站匹配', {
        url: url,
        isMatch: isMatch
      });
      return isMatch;
    }
    async after() {
      try {
        debug('开始执行后续操作');
        if (!this.#checkLogin()) {
          debug('登录检查失败');
          echoLog({}).warning(I18n('checkLoginFailed'));
        }
        if (!await this.#checkLeftKey()) {
          debug('检查剩余密钥失败');
          echoLog({}).warning(I18n('checkLeftKeyFailed'));
        }
      } catch (error) {
        debug('后续操作失败', {
          error: error
        });
        throwError(error, 'GiveeClub.after');
      }
    }
    init() {
      try {
        debug('初始化 GiveeClub');
        const logStatus = echoLog({
          text: I18n('initing')
        });
        if (!this.#checkLogin()) {
          debug('登录检查失败');
          logStatus.warning(I18n('needLogin'));
          return false;
        }
        const giveawayIdResult = this.#getGiveawayId();
        if (!giveawayIdResult) {
          debug('获取抽奖ID失败');
          return false;
        }
        this.initialized = true;
        debug('初始化完成');
        logStatus.success();
        return true;
      } catch (error) {
        debug('初始化失败', {
          error: error
        });
        throwError(error, 'GiveeClub.init');
        return false;
      }
    }
    async classifyTask(action) {
      try {
        debug('开始分类任务', {
          action: action
        });
        const logStatus = echoLog({
          text: I18n('getTasksInfo')
        });
        if (action === 'undo') {
          debug('恢复已保存的任务信息');
          this.socialTasks = GM_getValue(`gcTasks-${this.giveawayId}`)?.tasks || defaultTasks$8;
          return true;
        }
        debug('初始化未完成任务列表');
        this.undoneTasks = defaultTasks$8;
        const tasks = $('.event-actions tr');
        const processTask = async task => {
          const taskDes = $(task).find('.event-action-label a');
          const taskIcon = $(task).find('.event-action-icon i').attr('class') || '';
          const taskName = taskDes.text().trim();
          const taskType = $(task).find('button[data-type]')?.attr('data-type') || '';
          const taskFinished = $(task).find('.event-action-buttons .btn-success')?.length;
          const appId = taskDes.attr('data-steam-wishlist-appid');
          debug('处理任务', {
            taskName: taskName,
            taskType: taskType,
            taskIcon: taskIcon,
            taskFinished: taskFinished,
            appId: appId
          });
          if (taskIcon.includes('ban') || /AdBlock/i.test(taskName) || taskIcon.includes('envelope') || taskFinished) {
            debug('跳过无效或已完成任务');
            return true;
          }
          const taskHref = taskDes.attr('href');
          if (!taskHref) {
            debug('任务链接为空');
            return false;
          }
          try {
            debug('获取重定向链接', {
              taskHref: taskHref
            });
            const taskLink = await getRedirectLink(taskHref, taskType.includes('steam'));
            if (!taskLink) {
              debug('获取重定向链接失败');
              return false;
            }
            if (taskType === 'steam.game.wishlist' && appId) {
              debug('添加 Steam 愿望单任务', {
                appId: appId
              });
              this.undoneTasks.steam.wishlistLinks.push(`https://store.steampowered.com/app/${appId}`);
              return true;
            }
            debug('分类任务', {
              taskLink: taskLink,
              taskType: taskType
            });
            this.#classifyTaskByType(taskLink, taskType, taskIcon, taskName, taskDes);
            return true;
          } catch (error) {
            debug('获取重定向链接失败', {
              error: error
            });
            throwError(error, 'GiveeClub.classifyTask->getRedirectLink');
            return false;
          }
        };
        debug('开始处理所有任务');
        await Promise.all(Array.from(tasks).map(processTask));
        debug('任务处理完成');
        logStatus.success();
        this.undoneTasks = this.uniqueTasks(this.undoneTasks);
        this.socialTasks = this.undoneTasks;
        debug('保存任务信息');
        GM_setValue(`gcTasks-${this.giveawayId}`, {
          tasks: this.socialTasks,
          time: (new Date).getTime()
        });
        return true;
      } catch (error) {
        debug('任务分类失败', {
          error: error
        });
        throwError(error, 'GiveeClub.classifyTask');
        return false;
      }
    }
    #classifyTaskByType(taskLink, taskType, taskIcon, taskName, taskDes) {
      try {
        debug('开始分类任务', {
          taskLink: taskLink,
          taskType: taskType,
          taskIcon: taskIcon,
          taskName: taskName
        });
        if (taskType === 'steam.group.join' && /^https?:\/\/steamcommunity\.com\/groups/.test(taskLink)) {
          debug('添加 Steam 组任务');
          this.undoneTasks.steam.groupLinks.push(taskLink);
          return;
        }
        if (/like.*announcement/gi.test(taskName)) {
          debug('添加 Steam 公告任务');
          this.undoneTasks.steam.announcementLinks.push(taskLink);
          return;
        }
        if (taskType === 'steam.game.wishlist' && /^https?:\/\/store\.steampowered\.com\/app\//.test(taskLink)) {
          debug('添加 Steam 愿望单任务');
          this.undoneTasks.steam.wishlistLinks.push(taskLink);
          return;
        }
        if (taskType === 'steam.game.wishlist' && taskDes.attr('data-steam-wishlist-appid')) {
          debug('添加 Steam 愿望单任务（通过 appId）');
          this.undoneTasks.steam.wishlistLinks.push(`https://store.steampowered.com/app/${taskDes.attr('data-steam-wishlist-appid')}`);
          return;
        }
        if (taskType === 'steam.game.follow' && /^https?:\/\/store\.steampowered\.com\/app\//.test(taskLink)) {
          debug('添加 Steam 游戏关注任务');
          this.undoneTasks.steam.followLinks.push(taskLink);
          return;
        }
        if (/^https?:\/\/store\.steampowered\.com\/curator\//.test(taskLink)) {
          debug('添加 Steam 鉴赏家关注任务');
          this.undoneTasks.steam.curatorLinks.push(taskLink);
          return;
        }
        if (taskIcon.includes('steam') && /follow|subscribe/gim.test(taskName)) {
          debug('添加 Steam 鉴赏家点赞任务');
          this.undoneTasks.steam.curatorLikeLinks.push(taskLink);
          return;
        }
        if (/subscribe.*steam.*forum/gim.test(taskName)) {
          debug('添加 Steam 论坛任务');
          this.undoneTasks.steam.forumLinks.push(taskLink);
          return;
        }
        if (taskType === 'steam.game.playtime' && /^https?:\/\/store\.steampowered\.com\/app\//.test(taskLink)) {
          const time = taskDes.text().match(/(\d+)(?:\.\d+)?/gim)?.[0] || '0';
          debug('添加 Steam 游戏时长任务', {
            time: time
          });
          this.undoneTasks.steam.playTimeLinks.push(`${time}-${taskLink}`);
          return;
        }
        if (taskIcon.includes('discord')) {
          debug('添加 Discord 服务器任务');
          this.undoneTasks.discord.serverLinks.push(taskLink);
          return;
        }
        if (taskIcon.includes('instagram')) {
          debug('跳过 Instagram 任务');
          return;
        }
        if (taskIcon.includes('twitch')) {
          debug('添加 Twitch 频道任务');
          this.undoneTasks.twitch.channelLinks.push(taskLink);
          return;
        }
        if (taskIcon.includes('reddit')) {
          debug('添加 Reddit 任务');
          this.undoneTasks.reddit.redditLinks.push(taskLink);
          return;
        }
        if (/watch.*art/gim.test(taskName)) {
          debug('添加创意工坊物品任务');
          this.undoneTasks.steam.workshopVoteLinks.push(taskLink);
          return;
        }
        if (/subscribe.*youtube.*channel/gim.test(taskName)) {
          debug('添加 YouTube 频道任务');
          this.undoneTasks.youtube.channelLinks.push(taskLink);
          return;
        }
        if (/(watch|like).*youtube.*video/gim.test(taskName) || (taskIcon.includes('youtube') || taskIcon.includes('thumbs-up')) && /(watch|like).*video/gim.test(taskName)) {
          debug('添加 YouTube 视频任务');
          this.undoneTasks.youtube.likeLinks.push(taskLink);
          return;
        }
        if (taskIcon.includes('vk') || /join.*vk.*group/gim.test(taskName)) {
          debug('添加 VK 任务');
          this.undoneTasks.vk.nameLinks.push(taskLink);
          return;
        }
        if (taskIcon.includes('twitter')) {
          if (/https?:\/\/(twitter|x)\.com\/[^/]+\/?$/gim.test(taskLink)) {
            debug('添加 Twitter 用户关注任务');
            this.undoneTasks.twitter.userLinks.push(taskLink);
            return;
          }
          if (/https?:\/\/(twitter|x)\.com\/[^/]+?\/status\/[\d]+/gim.test(taskLink)) {
            debug('添加 Twitter 转发任务');
            this.undoneTasks.twitter.retweetLinks.push(taskLink);
            return;
          }
        }
        if (/(on twitter)|(Follow.*on.*Facebook)/gim.test(taskName)) {
          debug('跳过 Twitter/Facebook 任务');
          return;
        }
        if (/follow.*button/gim.test(taskName)) {
          debug('添加 Steam 关注任务');
          this.undoneTasks.steam.followLinks.push(taskLink);
          return;
        }
        debug('未识别的任务类型', {
          taskLink: taskLink,
          taskType: taskType,
          taskIcon: taskIcon,
          taskName: taskName
        });
      } catch (error) {
        debug('任务分类失败', {
          error: error
        });
        throwError(error, 'GiveeClub.classifyTaskByType');
        return;
      }
    }
    async verifyTask() {
      try {
        debug('开始验证任务');
        const logStatus = echoLog({
          text: I18n('giveeClubVerifyNotice')
        });
        const taskButtons = $('.event-actions tr button').has('i.glyphicon-refresh').not('[data-type="user.adblock"]');
        debug('找到需要验证的任务按钮', {
          count: taskButtons.length
        });
        for (const button of taskButtons) {
          debug('点击验证按钮', {
            type: $(button).attr('data-type')
          });
          button.click();
          if ($(button).attr('data-type') !== 'steam.game.wishlist') {
            debug('等待1秒');
            await delay(1e3);
          }
        }
        debug('任务验证完成');
        logStatus.warning(I18n('giveeClubVerifyFinished'));
        return true;
      } catch (error) {
        debug('任务验证失败', {
          error: error
        });
        throwError(error, 'Givekey.verifyTask');
        return false;
      }
    }
    #checkLogin() {
      try {
        debug('检查登录状态');
        if (!globalOptions.other.checkLogin) {
          debug('跳过登录检查');
          return true;
        }
        const needLogin = $('a[href*="/account/auth"]').length > 0;
        if (needLogin) {
          debug('未登录，重定向到登录页面');
          window.open($('a[href*="/account/auth"]').attr('href'), '_self');
        }
        debug('登录检查完成', {
          needLogin: needLogin
        });
        return true;
      } catch (error) {
        debug('登录检查失败', {
          error: error
        });
        throwError(error, 'GiveeClub.checkLogin');
        return false;
      }
    }
    #getGiveawayId() {
      try {
        debug('从URL获取抽奖ID');
        const giveawayId = window.location.href.match(/\/event\/([\d]+)/)?.[1];
        if (giveawayId) {
          this.giveawayId = giveawayId;
          debug('获取抽奖ID成功', {
            giveawayId: giveawayId
          });
          return true;
        }
        debug('获取抽奖ID失败');
        echoLog({
          text: I18n('getFailed', 'GiveawayId')
        });
        return false;
      } catch (error) {
        debug('获取抽奖ID出错', {
          error: error
        });
        throwError(error, 'GiveeClub.getGiveawayId');
        return false;
      }
    }
    async #checkLeftKey() {
      try {
        debug('检查剩余密钥');
        if (!globalOptions.other.checkLeftKey) {
          debug('跳过密钥检查');
          return true;
        }
        const isEnded = $('.event-ended').length > 0;
        const hasNoWinner = $('.event-winner').length === 0;
        debug('检查抽奖状态', {
          isEnded: isEnded,
          hasNoWinner: hasNoWinner
        });
        if (!(isEnded && hasNoWinner)) {
          return true;
        }
        debug('没有剩余密钥，显示确认对话框');
        const {value: value} = await Swal.fire({
          icon: 'warning',
          title: I18n('notice'),
          text: I18n('giveawayEnded'),
          confirmButtonText: I18n('confirm'),
          cancelButtonText: I18n('cancel'),
          showCancelButton: true
        });
        if (value) {
          debug('用户确认关闭窗口');
          window.close();
        }
        return true;
      } catch (error) {
        debug('检查剩余密钥失败', {
          error: error
        });
        throwError(error, 'GiveeClub.checkLeftKey');
        return false;
      }
    }
  }
  const defaultOptions$1 = {
    maxPoint: '99999999'
  };
  class OpiumPulses {
    name='OpiumPulses';
    options={
      ...defaultOptions$1,
      ...GM_getValue('OpiumPulsesOptions')
    };
    maxPoints=99999999;
    myPoints=0;
    buttons=[ 'doFreeTask', 'doPointTask' ];
    static test() {
      const {host: host} = window.location;
      const isMatch = host === 'www.opiumpulses.com';
      debug('检查网站匹配', {
        host: host,
        isMatch: isMatch
      });
      return isMatch;
    }
    async after() {
      try {
        debug('开始执行后续操作');
        if (!this.#checkLogin()) {
          debug('检查登录失败');
          echoLog({}).warning(I18n('checkLoginFailed'));
        }
        debug('解析最大积分', {
          maxPoint: this.options.maxPoint
        });
        this.maxPoints = parseInt(this.options.maxPoint, 10);
      } catch (error) {
        debug('后续操作失败', {
          error: error
        });
        throwError(error, 'OpiumPulses.after');
      }
    }
    async doFreeTask() {
      try {
        debug('开始执行免费任务');
        this.#toggleTask('FREE');
      } catch (error) {
        debug('执行免费任务失败', {
          error: error
        });
        throwError(error, 'OpiumPulses.doFreeTask');
      }
    }
    async doPointTask() {
      try {
        debug('开始执行积分任务');
        const pointsText = $('.page-header__nav-func-user-nav-items.points-items').text();
        const pointsMatch = pointsText.match(/[\d]+/gim)?.[0] || '0';
        this.myPoints = parseInt(pointsMatch, 10);
        debug('获取当前积分', {
          pointsText: pointsText,
          pointsMatch: pointsMatch,
          myPoints: this.myPoints
        });
        this.#toggleTask('points');
      } catch (error) {
        debug('执行积分任务失败', {
          error: error
        });
        throwError(error, 'OpiumPulses.doPointTask');
      }
    }
    async #toggleTask(type) {
      try {
        debug('开始切换任务', {
          type: type
        });
        const items = $(`.giveaways-page-item:contains('${type}'):not(:contains('ENTERED'))`);
        debug('找到未参与的抽奖项目', {
          count: items.length
        });
        for (const item of items) {
          const pointsText = $(item).find('.giveaways-page-item-header-points').text();
          const needPoints = parseInt(pointsText.match(/[\d]+/gim)?.[0] || '999999', 10);
          const name = $(item).find('.giveaways-page-item-footer-name').text().trim();
          debug('处理抽奖项目', {
            name: name,
            needPoints: needPoints
          });
          if (type === 'points') {
            if (needPoints > this.myPoints) {
              debug('积分不足', {
                needPoints: needPoints,
                myPoints: this.myPoints
              });
              echoLog({}).warning(`${I18n('noPoints')}: ${name}`);
              continue;
            }
            if (!needPoints) {
              debug('获取所需积分失败');
              echoLog({}).warning(`${I18n('getNeedPointsFailed')}: ${name}`);
              continue;
            }
            if (needPoints > this.maxPoints) {
              debug('超过最大积分限制', {
                needPoints: needPoints,
                maxPoints: this.maxPoints
              });
              continue;
            }
          }
          const logStatus = echoLog({
            text: `${I18n('joiningLottery')}<a href="${$(item).find('a.giveaways-page-item-img-btn-more').attr('href')}" target="_blank">${name}</a>...`
          });
          const aElement = $(item).find('a.giveaways-page-item-img-btn-enter:contains(\'enter\')');
          if (aElement?.attr('onclick')?.includes('checkUser')) {
            const giveawayId = aElement.attr('onclick')?.match(/[\d]+/)?.[0];
            if (giveawayId) {
              debug('执行用户检查', {
                giveawayId: giveawayId
              });
              checkUser(giveawayId);
            }
          }
          if (!aElement.attr('href')) {
            debug('无效的链接');
            logStatus.error('Error: No "href".');
            continue;
          }
          debug('发送加入请求', {
            url: aElement.attr('href')
          });
          const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
            url: aElement.attr('href'),
            method: 'GET'
          });
          if (result !== 'Success') {
            debug('请求失败', {
              result: result,
              statusText: statusText,
              status: status
            });
            logStatus.error(`${result}:${statusText}(${status})`);
            continue;
          }
          debug('发送最终请求', {
            url: data?.finalUrl
          });
          const {result: result0, statusText: statusText0, status: status0, data: data0} = await httpRequest({
            url: data?.finalUrl,
            method: 'GET'
          });
          if (!data0?.responseText) {
            debug('响应无效', {
              result: result0,
              statusText: statusText0,
              status: status0
            });
            logStatus.error(`${result0}:${statusText0}(${status0})`);
            continue;
          }
          if (/You're not eligible to enter/gim.test(data0.responseText)) {
            debug('用户不符合参与条件');
            logStatus.error('You\'re not eligible to enter');
            continue;
          }
          if (!/You've entered this giveaway/gim.test(data0.responseText)) {
            debug('加入抽奖失败', {
              result: result0,
              statusText: statusText0,
              status: status0
            });
            logStatus.error(`${result0}:${statusText0}(${status0})`);
            continue;
          }
          debug('加入抽奖成功');
          logStatus.success();
          if (type === 'points') {
            const points = data0.responseText.match(/Points:[\s]*?([\d]+)/)?.[1];
            if (points) {
              debug('更新用户积分', {
                points: points
              });
              this.myPoints = parseInt(points, 10);
            }
          }
        }
        debug('任务处理完成');
        echoLog({
          text: '-----END-----'
        });
      } catch (error) {
        debug('切换任务失败', {
          error: error
        });
        throwError(error, 'OpiumPulses.toggleTask');
      }
    }
    init() {
      debug('初始化完成');
      return true;
    }
    classifyTask() {
      debug('任务分类完成');
      return true;
    }
    #checkLogin() {
      try {
        debug('检查登录状态');
        if (!globalOptions.other.checkLogin) {
          debug('跳过登录检查');
          return true;
        }
        if ($('a[href*="/site/login"]').length > 1) {
          debug('未登录，重定向到登录页面');
          window.open('/site/login', '_self');
        }
        debug('登录检查完成');
        return true;
      } catch (error) {
        debug('检查登录失败', {
          error: error
        });
        throwError(error, 'OpiumPulses.checkLogin');
        return false;
      }
    }
  }
  const leftKeyChecker = {
    async classify(link) {
      try {
        debug('开始分类链接', {
          link: link
        });
        let result = false;
        if (/^https?:\/\/giveaway\.su\/giveaway\/view\/[\d]+/.test(link)) {
          debug('匹配到 giveaway.su 链接');
          result = await this.giveawaySu(link);
        } else if (/^https?:\/\/givee\.club\/[\w]+?\/event\/[\d]+/.test(link)) {
          debug('匹配到 givee.club 链接');
          result = await this.giveeClub(link);
        } else if (/^https?:\/\/gleam\.io\/.+?\/.+/.test(link)) {
          debug('匹配到 gleam.io 链接');
          result = await this.gleam(link);
        } else if (/^https?:\/\/www\.indiedb\.com\/giveaways\/.+/.test(link)) {
          debug('匹配到 indiedb.com 链接');
          result = await this.indieDb(link);
        } else if (/^https?:\/\/key-hub\.eu\/giveaway\/[\d]+/.test(link)) {
          debug('匹配到 key-hub.eu 链接');
          result = await this.keyhub(link);
        } else if (/^https?:\/\/opquests\.com\/quests\/[\d]+/.test(link)) {
          debug('匹配到 opquests.com 链接');
          result = await this.opquests(link);
        } else if (/^https?:\/\/itch\.io\/s\/[\d]+?\/.*/.test(link)) {
          debug('匹配到 itch.io 链接');
          result = await this.itch(link);
        } else if (/^https?:\/\/freeanywhere\.net\/game\?n=[\d]+/.test(link)) {
          debug('匹配到 freeanywhere.net 链接');
          result = await this.freeanywhere(link);
        } else {
          debug('未匹配到支持的链接格式');
        }
        debug('链接分类完成', {
          result: result
        });
        return result;
      } catch (error) {
        debug('链接分类出错', {
          error: error
        });
        throwError(error, 'leftKeyChecker.classify');
        return false;
      }
    },
    async giveawaySu(link) {
      try {
        debug('开始检查 giveaway.su 链接', {
          link: link
        });
        const {result: result, data: data} = await httpRequest({
          url: link,
          method: 'GET'
        });
        if (result !== 'Success' || data?.status !== 200) {
          debug('请求失败', {
            result: result,
            status: data?.status
          });
          return false;
        }
        if (data.responseText.includes('class="steam-login"')) {
          debug('检测到未登录状态');
          return false;
        }
        if (data.responseText.includes('class="giveaway-ended"')) {
          debug('检测到抽奖已结束');
          return 'Ended';
        }
        debug('检测到抽奖进行中');
        return 'Active';
      } catch (error) {
        debug('检查 giveaway.su 链接出错', {
          error: error
        });
        throwError(error, 'leftKeyChecker.giveawaySu');
        return false;
      }
    },
    async giveeClub(link) {
      try {
        debug('开始检查 givee.club 链接', {
          link: link
        });
        const {result: result, data: data} = await httpRequest({
          url: link,
          method: 'GET'
        });
        if (result !== 'Success' || data?.status !== 200) {
          debug('请求失败', {
            result: result,
            status: data?.status
          });
          return false;
        }
        if (data.responseText.includes('class="event-winner"')) {
          debug('检测到已中奖');
          return 'Won';
        }
        if (data.responseText.includes('class="event-ended"')) {
          debug('检测到活动已结束');
          return 'Ended';
        }
        debug('检测到活动进行中');
        return 'Active';
      } catch (error) {
        debug('检查 givee.club 链接出错', {
          error: error
        });
        throwError(error, 'leftKeyChecker.giveeClub');
        return false;
      }
    },
    async gleam(link) {
      try {
        debug('开始检查 gleam.io 链接', {
          link: link
        });
        const {result: result, data: data} = await httpRequest({
          url: link,
          method: 'GET'
        });
        if (result !== 'Success' || data?.status !== 200) {
          debug('请求失败', {
            result: result,
            status: data?.status
          });
          return false;
        }
        if (/incentives&quot;:{&quot;[\d]+?&quot;:\[&quot;.+?&quot;\]/.test(data.responseText)) {
          debug('检测到已中奖');
          return 'Won';
        }
        const campaignDiv = data.responseText.match(/<div class='popup-blocks-container'[\w\W]+?'>/)?.[0];
        if (!campaignDiv) {
          debug('未找到活动信息');
          return false;
        }
        const campaignString = $(campaignDiv).attr('ng-init')?.match(/initCampaign\(([\w\W]+?)\)$/)?.[1];
        if (!campaignString) {
          debug('未找到活动初始化数据');
          return false;
        }
        const {campaign: campaign} = JSON.parse(campaignString);
        debug('解析活动数据', {
          campaign: campaign
        });
        if (campaign.banned) {
          debug('检测到活动已被禁止');
          return 'Banned';
        }
        if (campaign.finished) {
          debug('检测到活动已结束');
          return 'Ended';
        }
        if (campaign.paused) {
          debug('检测到活动已暂停');
          return 'Paused';
        }
        if ((new Date).getTime() < campaign.starts_at * 1e3) {
          debug('检测到活动未开始');
          return 'NotStart';
        }
        debug('检测到活动进行中');
        return 'Active';
      } catch (error) {
        debug('检查 gleam.io 链接出错', {
          error: error
        });
        throwError(error, 'leftKeyChecker.gleam');
        return false;
      }
    },
    async indieDb(link) {
      try {
        debug('开始检查 indiedb.com 链接', {
          link: link
        });
        const {result: result, data: data} = await httpRequest({
          url: link,
          method: 'GET'
        });
        if (result !== 'Success' || data?.status !== 200) {
          debug('请求失败', {
            result: result,
            status: data?.status
          });
          return false;
        }
        if (data.responseText.includes('Congrats you WON')) {
          debug('检测到已中奖');
          return 'Won';
        }
        if (data.responseText.includes('Giveaway is closed') || data.responseText.includes('next time')) {
          debug('检测到抽奖已结束');
          return 'Ended';
        }
        debug('检测到抽奖进行中');
        return 'Active';
      } catch (error) {
        debug('检查 indiedb.com 链接出错', {
          error: error
        });
        throwError(error, 'leftKeyChecker.indieDb');
        return false;
      }
    },
    async keyhub(link) {
      try {
        debug('开始检查 key-hub.eu 链接', {
          link: link
        });
        const {result: result, data: data} = await httpRequest({
          url: link,
          method: 'GET'
        });
        if (result !== 'Success' || data?.status !== 200) {
          debug('请求失败', {
            result: result,
            status: data?.status
          });
          return false;
        }
        const keysleft = data.responseText.match(/<span id="keysleft">([\d]+?)<\/span>/)?.[1];
        if (!keysleft) {
          debug('未找到剩余密钥信息');
          return false;
        }
        debug('检测到剩余密钥数量', {
          keysleft: keysleft
        });
        if (keysleft === '0') {
          debug('检测到密钥已用完');
          return 'Ended';
        }
        debug('检测到活动进行中');
        return `Active(${keysleft})`;
      } catch (error) {
        debug('检查 key-hub.eu 链接出错', {
          error: error
        });
        throwError(error, 'leftKeyChecker.keyhub');
        return false;
      }
    },
    async opquests(link) {
      try {
        debug('开始检查 opquests.com 链接', {
          link: link
        });
        const {result: result, data: data} = await httpRequest({
          url: link,
          method: 'GET'
        });
        if (data?.status === 404) {
          debug('检测到活动不存在');
          return 'Ended';
        }
        if (result !== 'Success' || data?.status !== 200) {
          debug('请求失败', {
            result: result,
            status: data?.status
          });
          return false;
        }
        const keysleft = data.responseText.match(/<div class="">[\s]*?([\d]+?)[\s]*?of/)?.[1];
        if (!keysleft) {
          debug('未找到剩余密钥信息');
          return false;
        }
        debug('检测到剩余密钥数量', {
          keysleft: keysleft
        });
        if (keysleft === '0') {
          debug('检测到密钥已用完');
          return 'Ended';
        }
        debug('检测到活动进行中');
        return `Active(${keysleft})`;
      } catch (error) {
        debug('检查 opquests.com 链接出错', {
          error: error
        });
        throwError(error, 'leftKeyChecker.opquests');
        return false;
      }
    },
    async itch(link) {
      try {
        debug('开始检查 itch.io 链接', {
          link: link
        });
        const {result: result, data: data} = await httpRequest({
          url: link,
          method: 'GET'
        });
        if (result !== 'Success' || data?.status !== 200) {
          debug('请求失败', {
            result: result,
            status: data?.status
          });
          return false;
        }
        const endDate = data.responseText.match(/{"start_date":"[0-9A-Z-:]+?".*?"end_date":"([0-9A-Z-:]+?)".*?}/)?.[1];
        if (!endDate) {
          debug('未找到结束日期信息');
          return false;
        }
        debug('检测到活动结束日期', {
          endDate: endDate
        });
        if ((new Date).getTime() > new Date(endDate).getTime()) {
          debug('检测到活动已结束');
          return 'Ended';
        }
        const formattedEndDate = dayjs(endDate).format('YYYY-MM-DD HH:mm:ss');
        debug('检测到活动进行中', {
          formattedEndDate: formattedEndDate
        });
        return `Active(${formattedEndDate})`;
      } catch (error) {
        debug('检查 itch.io 链接出错', {
          error: error
        });
        throwError(error, 'leftKeyChecker.itch');
        return false;
      }
    },
    async freeanywhere(link) {
      try {
        debug('开始检查 freeanywhere.net 链接', {
          link: link
        });
        const {result: result, data: data} = await httpRequest({
          url: link,
          method: 'GET'
        });
        if (result !== 'Success' || data?.status !== 200) {
          debug('请求失败', {
            result: result,
            status: data?.status
          });
          return false;
        }
        const giveawayStatus = data.responseText.includes('Giveaway ended');
        if (giveawayStatus) {
          debug('检测到活动已结束');
          return 'Ended';
        }
        debug('检测到活动进行中');
        return 'Active';
      } catch (error) {
        debug('检查 freeanywhere.net 链接出错', {
          error: error
        });
        throwError(error, 'leftKeyChecker.freeanywhere');
        return false;
      }
    }
  };
  const defaultTasksTemplate$4 = {
    steam: {
      groupLinks: [],
      wishlistLinks: [],
      curatorLinks: [],
      curatorLikeLinks: [],
      followLinks: [],
      forumLinks: [],
      announcementLinks: [],
      workshopVoteLinks: [],
      licenseLinks: []
    },
    discord: {
      serverLinks: []
    },
    vk: {
      nameLinks: []
    },
    twitch: {
      channelLinks: []
    },
    reddit: {
      redditLinks: []
    },
    twitter: {
      userLinks: [],
      retweetLinks: []
    },
    youtube: {
      channelLinks: [],
      likeLinks: []
    }
  };
  const defaultTasks$5 = JSON.stringify(defaultTasksTemplate$4);
  class Keylol extends Website {
    name='Keylol';
    socialTasks=(() => JSON.parse(defaultTasks$5))();
    undoneTasks=(() => JSON.parse(defaultTasks$5))();
    buttons=[ 'doTask', 'undoTask', 'selectAll', 'selectNone', 'invertSelect' ];
    static CONFIG={
      LINK_PATTERNS: {
        DISCORD: /^https?:\/\/discord\.com\/invite\/.+/,
        REDDIT: /^https?:\/\/www\.reddit\.com\/(r|user)\/.+/,
        INSTAGRAM: /^https:\/\/www\.instagram\.com\/.+/,
        TWITTER: /^https:\/\/(twitter|x)\.com\/.+/,
        TWITTER_RETWEET: /https:\/\/(twitter|x)\.com\/.*?\/status\/[\d]+/,
        TWITCH: /^https:\/\/(www\.)?twitch\.tv\/.+/,
        VK: /^https:\/\/vk\.com\/.+/,
        STEAM_CURATOR: /curator\/[\d]+/,
        STEAM_PUBLISHER: /(publisher|developer|franchise)\/.+/,
        STEAM_NEWS: /news(hub)?\/app\/[\d]+\/view\/[\d]+/,
        STEAM_APP: /app\/[\d]+/,
        STEAM_GROUP: /groups\/.+/,
        STEAM_ANNOUNCEMENT: /announcements\/detail\/[\d]+/,
        YOUTUBE: /youtube\.com/
      },
      SELECTORS: {
        MAIN_POST: {
          KEYLOL: '#postlist>div[id^="post_"]:first',
          DEFAULT: 'div.container'
        }
      }
    };
    static test() {
      const {host: host} = window.location;
      const link = $('.subforum_left_title_left_up a').eq(3).attr('href');
      const isMatch = host === 'keylol.com' && (!!link?.includes('319') || !!link?.includes('234'));
      debug('检查网站匹配', {
        host: host,
        link: link,
        isMatch: isMatch
      });
      return isMatch;
    }
    init() {
      debug('初始化 Keylol');
      return true;
    }
    after() {
      try {
        debug('开始处理页面链接');
        const mainPost = $(this.name === 'Keylol' ? Keylol.CONFIG.SELECTORS.MAIN_POST.KEYLOL : Keylol.CONFIG.SELECTORS.MAIN_POST.DEFAULT);
        const allLinks = mainPost.find('a');
        debug('找到所有链接', {
          count: allLinks.length
        });
        allLinks.each(((_, link) => {
          const $link = $(link);
          const href = $link.attr('href');
          if (!href) {
            return;
          }
          this.#classifyAndProcessLink($link, href);
        }));
        debug('开始处理抽奖链接');
        this.#processGiveawayLinks(mainPost);
        if (this.name === 'Keylol') {
          debug('开始处理 Keylol 特定链接');
          this.#processKeylolSpecificLinks(mainPost);
        }
        debug('设置 MutationObserver');
        this.#setupMutationObserver();
      } catch (error) {
        debug('处理页面链接失败', {
          error: error
        });
        throwError(error, 'keylol.after');
      }
    }
    #classifyAndProcessLink($link, href) {
      debug('分类处理链接', {
        href: href
      });
      const {LINK_PATTERNS: LINK_PATTERNS} = Keylol.CONFIG;
      switch (true) {
       case LINK_PATTERNS.DISCORD.test(href):
        debug('发现 Discord 链接');
        this.#addBtn($link[0], 'discord', 'serverLinks', href);
        break;

       case LINK_PATTERNS.REDDIT.test(href):
        debug('发现 Reddit 链接');
        this.#addBtn($link[0], 'reddit', 'redditLinks', href);
        break;

       case LINK_PATTERNS.TWITTER.test(href):
        if (LINK_PATTERNS.TWITTER_RETWEET.test(href)) {
          debug('发现 Twitter 转发链接');
          this.#addBtn($link[0], 'twitter', 'retweetLinks', href);
        } else {
          debug('发现 Twitter 用户链接');
          this.#addBtn($link[0], 'twitter', 'userLinks', href);
        }
        break;

       case LINK_PATTERNS.TWITCH.test(href):
        debug('发现 Twitch 链接');
        this.#addBtn($link[0], 'twitch', 'channelLinks', href);
        break;

       case LINK_PATTERNS.VK.test(href):
        debug('发现 VK 链接');
        this.#addBtn($link[0], 'vk', 'nameLinks', href);
        break;

       case href.includes('store.steampowered.com'):
        debug('发现 Steam 商店链接');
        this.#processSteamStoreLink($link[0], href);
        break;

       case href.includes('steamcommunity.com'):
        debug('发现 Steam 社区链接');
        this.#processSteamCommunityLink($link[0], href);
        break;

       case LINK_PATTERNS.YOUTUBE.test(href):
        debug('发现 YouTube 链接');
        this.#addBtn($link[0], 'youtube', 'channelLinks', href);
        this.#addBtn($link[0], 'youtube', 'likeLinks', href);
        break;
      }
    }
    #processSteamStoreLink(element, href) {
      debug('处理 Steam 商店链接', {
        href: href
      });
      const {LINK_PATTERNS: LINK_PATTERNS} = Keylol.CONFIG;
      if (LINK_PATTERNS.STEAM_CURATOR.test(href)) {
        debug('发现 Steam 鉴赏家链接');
        this.#addBtn(element, 'steam', 'curatorLinks', href);
      } else if (LINK_PATTERNS.STEAM_PUBLISHER.test(href)) {
        debug('发现 Steam 发行商链接');
        this.#addBtn(element, 'steam', 'curatorLikeLinks', href);
      } else if (LINK_PATTERNS.STEAM_NEWS.test(href)) {
        debug('发现 Steam 新闻链接');
        this.#addBtn(element, 'steam', 'announcementLinks', href);
      } else if (LINK_PATTERNS.STEAM_APP.test(href)) {
        debug('发现 Steam 应用链接');
        this.#addBtn(element, 'steam', 'followLinks', href);
        this.#addBtn(element, 'steam', 'wishlistLinks', href);
      }
    }
    #processSteamCommunityLink(element, href) {
      debug('处理 Steam 社区链接', {
        href: href
      });
      const {LINK_PATTERNS: LINK_PATTERNS} = Keylol.CONFIG;
      if (LINK_PATTERNS.STEAM_GROUP.test(href)) {
        debug('发现 Steam 组链接');
        this.#addBtn(element, 'steam', 'groupLinks', href);
      } else if (LINK_PATTERNS.STEAM_ANNOUNCEMENT.test(href)) {
        debug('发现 Steam 公告链接');
        this.#addBtn(element, 'steam', 'announcementLinks', href);
      }
    }
    #processGiveawayLinks(mainPost) {
      debug('开始处理抽奖链接');
      const giveawayLinks = mainPost.find('a[href*="giveaway.su/giveaway/view/"],' + 'a[href*="givee.club/"],' + 'a[href*="gleam.io/"],' + 'a[href*="www.indiedb.com/giveaways/"],' + 'a[href*="key-hub.eu/giveaway/"],' + 'a[href*="opquests.com/quests/"],' + 'a[href*="freeanywhere.net/game?n="],' + 'a[href*="itch.io/s/"]:visible');
      debug('找到抽奖链接', {
        count: giveawayLinks.length
      });
      giveawayLinks.each(((_, link) => {
        const href = $(link).attr('href');
        if (!href) {
          return;
        }
        debug('检查抽奖链接状态', {
          href: href
        });
        leftKeyChecker.classify(href).then((status => {
          if (!status) {
            return;
          }
          const statusClass = /^Active/.test(status) ? 'active' : 'not-active';
          const statusTitle = /^Active/.test(status) ? I18n('Active') : I18n(status);
          debug('更新抽奖链接状态', {
            href: href,
            status: status,
            statusClass: statusClass
          });
          $(`a[href="${href}"]`).after(`<font class="auto-task-giveaway-status ${statusClass}" title="${statusTitle}">${status}</font>`);
        })).catch((error => {
          debug('检查抽奖链接状态失败', {
            href: href,
            error: error
          });
          throwError(error, 'keylol.after -> leftKeyChecker');
        }));
      }));
    }
    #processKeylolSpecificLinks(mainPost) {
      debug('开始处理 Keylol 特定链接');
      const asfLinks = mainPost.find('a[href^="#asf"]:visible');
      debug('找到 ASF 链接', {
        count: asfLinks.length
      });
      asfLinks.each(((_, link) => {
        const href = $(link).attr('href');
        if (!href) {
          return;
        }
        debug('处理 ASF 链接', {
          href: href
        });
        const $link = $(`a[href="${href}"]`);
        $link.after('<span style="color: #ccc; margin: 0 -5px 0 5px"> | </span>');
        this.#addBtn($link.next()[0], 'steam', 'licenseLinks', `appid-${href.replace('#asf', '')}`);
      }));
      const steamDbLinks = mainPost.find('a[href*="steamdb.info/sub/"]:visible');
      debug('找到 SteamDB 链接', {
        count: steamDbLinks.length
      });
      steamDbLinks.each(((_, link) => {
        const href = $(link).attr('href');
        if (!href) {
          return;
        }
        const subid = href.match(/^https:\/\/steamdb\.info\/sub\/([\d]+)/)?.[1];
        if (!subid) {
          return;
        }
        debug('处理 SteamDB 链接', {
          href: href,
          subid: subid
        });
        this.#addBtn(link, 'steam', 'licenseLinks', `subid-${subid}`);
      }));
      const asfBlocks = mainPost.find('.blockcode:contains("addlicense"):visible');
      debug('找到 ASF 代码块', {
        count: asfBlocks.length
      });
      asfBlocks.each(((_, block) => {
        const appid = [ ...block.innerText.matchAll(/a(pp)?\/([\d]+)/g) ].map((matched => matched?.[2])).filter((id => id));
        if (appid.length > 0) {
          debug('处理 ASF 代码块 appid', {
            appid: appid
          });
          this.#addBtn($(block).children('em')[0], 'steam', 'licenseLinks', `appid-${appid.join(',')}`);
        }
        const subid = block.innerText.match(/[\d]+/g)?.filter((matched => !appid.includes(matched)));
        if (subid?.length) {
          debug('处理 ASF 代码块 subid', {
            subid: subid
          });
          this.#addBtn($(block).children('em')[0], 'steam', 'licenseLinks', `subid-${subid.join(',')}`);
        }
      }));
    }
    #setupMutationObserver() {
      debug('设置 MutationObserver');
      if ($('#threadindex').length > 0) {
        const [elementTargetNode] = $('#postlist').children('div[id^="post_"]');
        const elementObserver = new MutationObserver((() => {
          debug('检测到 DOM 变化，重新处理页面');
          elementObserver.disconnect();
          this.after();
        }));
        elementObserver.observe(elementTargetNode, {
          childList: true
        });
        debug('MutationObserver 设置完成');
      }
    }
    classifyTask(action) {
      try {
        debug('开始分类任务', {
          action: action
        });
        this.socialTasks = JSON.parse(defaultTasks$5);
        this.undoneTasks = JSON.parse(defaultTasks$5);
        const selectedBtns = $('.auto-task-keylol[selected="selected"]:visible').get();
        debug('找到选中的按钮', {
          count: selectedBtns.length
        });
        for (const btn of selectedBtns) {
          const social = btn.getAttribute('data-social');
          const type = btn.getAttribute('data-type');
          const link = btn.getAttribute('data-link');
          debug('处理任务按钮', {
            social: social,
            type: type,
            link: link
          });
          if (!(social && type && link)) {
            debug('跳过无效任务按钮');
            continue;
          }
          if (!(social in this.undoneTasks)) {
            debug('跳过未知社交平台', {
              social: social
            });
            continue;
          }
          if (action === 'do' && type in this.undoneTasks[social]) {
            debug('添加到未完成任务', {
              social: social,
              type: type,
              link: link
            });
            this.undoneTasks[social][type].push(link);
          }
          if (action === 'undo' && type in this.socialTasks[social]) {
            debug('添加到社交任务', {
              social: social,
              type: type,
              link: link
            });
            this.socialTasks[social][type].push(link);
          }
        }
        this.undoneTasks = this.uniqueTasks(this.undoneTasks);
        this.socialTasks = this.uniqueTasks(this.socialTasks);
        debug('任务分类完成', {
          undoneTasks: this.undoneTasks,
          socialTasks: this.socialTasks
        });
        return true;
      } catch (error) {
        debug('任务分类失败', {
          error: error
        });
        throwError(error, 'Keylol.classifyTask');
        return false;
      }
    }
    selectAll() {
      try {
        debug('选择所有可见任务');
        const tasks = $('.auto-task-keylol:visible');
        tasks.attr('selected', 'selected');
        debug('选择完成', {
          count: tasks.length
        });
      } catch (error) {
        debug('选择所有任务失败', {
          error: error
        });
        throwError(error, 'Keylol.selectAll');
      }
    }
    selectNone() {
      try {
        debug('取消选择所有可见任务');
        const tasks = $('.auto-task-keylol:visible');
        tasks.removeAttr('selected');
        debug('取消选择完成', {
          count: tasks.length
        });
      } catch (error) {
        debug('取消选择所有任务失败', {
          error: error
        });
        throwError(error, 'Keylol.selectNone');
      }
    }
    invertSelect() {
      try {
        debug('反转选择所有可见任务');
        const tasks = $('.auto-task-keylol:visible');
        tasks.each(((_, element) => {
          const $element = $(element);
          if ($element.attr('selected')) {
            $element.removeAttr('selected');
          } else {
            $element.attr('selected', 'selected');
          }
        }));
        debug('反转选择完成', {
          count: tasks.length
        });
      } catch (error) {
        debug('反转选择任务失败', {
          error: error
        });
        throwError(error, 'Keylol.invertSelect');
      }
    }
    #addBtn(before, social, linkType, link) {
      try {
        debug('添加任务按钮', {
          social: social,
          linkType: linkType,
          link: link
        });
        if (!before || !social || !linkType || !link) {
          debug('跳过无效按钮参数');
          return;
        }
        const button = $('<a>', {
          href: 'javascript:void(0);',
          class: 'auto-task-keylol',
          target: '_self',
          'data-social': social,
          'data-type': linkType,
          'data-link': link,
          text: linkType.replace('Links', ''),
          onclick: 'this.getAttribute("selected") ? this.removeAttribute("selected") : this.setAttribute("selected", "selected")'
        });
        $(before).after(button);
        debug('按钮添加成功');
      } catch (error) {
        debug('添加按钮失败', {
          error: error,
          social: social,
          linkType: linkType
        });
        throwError(error, `keylol.addBtn: ${social}/${linkType}`);
      }
    }
  }
  const defaultTasks$4 = {
    steam: {
      groupLinks: [],
      wishlistLinks: [],
      followLinks: [],
      curatorLikeLinks: [],
      playTimeLinks: []
    },
    twitter: {
      userLinks: [],
      retweetLinks: []
    },
    discord: {
      serverLinks: []
    }
  };
  class Opquests extends Website {
    name='Opquests';
    undoneTasks={
      ...defaultTasks$4
    };
    buttons=[ 'doTask', 'verifyTask', 'getKey' ];
    static test() {
      const {host: host} = window.location;
      const isMatch = host === 'opquests.com';
      debug('检查网站匹配', {
        host: host,
        isMatch: isMatch
      });
      return isMatch;
    }
    async after() {
      try {
        debug('开始执行后续操作');
        if (!this.#checkLogin()) {
          debug('检查登录失败');
          echoLog({}).warning(I18n('checkLoginFailed'));
        }
        const opquestsVerifyTasks = GM_getValue('opquestsVerifyTasks') || [];
        debug('获取待验证任务', {
          count: opquestsVerifyTasks.length
        });
        if (opquestsVerifyTasks.length > 0) {
          const taskId = opquestsVerifyTasks.pop();
          debug('处理任务', {
            taskId: taskId
          });
          GM_setValue('opquestsVerifyTasks', opquestsVerifyTasks);
          const [verifyBtn] = $(`#task_id[value="${taskId}"]`).parent().find('button[type="button"],button[type="submit"]').has('i.fa-check');
          if (verifyBtn) {
            debug('点击验证按钮');
            verifyBtn.click();
            return;
          }
          debug('未找到验证按钮，继续处理下一个任务');
          this.after();
          return;
        }
        if (GM_getValue('opquestsVerifyTasks')) {
          debug('清除验证任务缓存');
          GM_deleteValue('opquestsVerifyTasks');
        }
      } catch (error) {
        debug('后续操作失败', {
          error: error
        });
        throwError(error, 'Opquests.after');
      }
    }
    init() {
      try {
        debug('开始初始化');
        const logStatus = echoLog({
          text: I18n('initing')
        });
        if ($('a[href*="/auth/redirect"]').length > 0) {
          debug('需要登录');
          window.open('/auth/redirect', '_self');
          logStatus.warning(I18n('needLogin'));
          return false;
        }
        if (!this.#getGiveawayId()) {
          debug('获取抽奖ID失败');
          return false;
        }
        this.initialized = true;
        debug('初始化完成');
        logStatus.success();
        return true;
      } catch (error) {
        debug('初始化失败', {
          error: error
        });
        throwError(error, 'Opquests.init');
        return false;
      }
    }
    async classifyTask(action) {
      try {
        debug('开始分类任务', {
          action: action
        });
        if (action === 'undo') {
          debug('不支持撤销操作');
          echoLog({
            text: I18n('cannotUndo')
          });
          return false;
        }
        const logStatus = echoLog({
          text: I18n('getTasksInfo')
        });
        const tasks = $('.w-full:contains("Validate") .items-center');
        debug('找到任务', {
          count: tasks.length
        });
        for (const task of tasks) {
          const link = $(task).find('a:contains("Open")').attr('href');
          if (!link) {
            debug('跳过无链接任务');
            continue;
          }
          const taskDes = $(task).find('div').eq(1).text().trim();
          debug('处理任务', {
            taskDes: taskDes,
            link: link
          });
          if (/steamcommunity\.com\/groups\//.test(link)) {
            debug('添加 Steam 组任务');
            this.undoneTasks.steam.groupLinks.push(link);
            continue;
          }
          if (/store\.steampowered\.com\/app\//.test(link)) {
            if (/wishlist/gim.test(taskDes)) {
              debug('添加 Steam 愿望单任务');
              this.undoneTasks.steam.wishlistLinks.push(link);
            } else if (/follow/gim.test(taskDes)) {
              debug('添加 Steam 关注任务');
              this.undoneTasks.steam.followLinks.push(link);
            } else if (/play/gim.test(taskDes)) {
              const time = parseInt(taskDes.replace(/\s/gim, '').match(/(\d+)hours/im)?.[1] || '0', 10) * 60;
              debug('添加 Steam 游戏时长任务', {
                time: time
              });
              this.undoneTasks.steam.playTimeLinks.push(`${time}-${link}`);
            }
            continue;
          }
          if (/store\.steampowered\.com\/(publisher|developer|curator)\//.test(link) && /follow/gim.test(taskDes)) {
            debug('添加 Steam 鉴赏家关注任务');
            this.undoneTasks.steam.curatorLikeLinks.push(link);
            continue;
          }
          if (link.includes('//x.com/')) {
            if (/follow/gim.test(taskDes)) {
              debug('添加 Twitter 关注任务');
              this.undoneTasks.twitter.userLinks.push(link);
              continue;
            }
            if (link.includes('status') && /Repost/gim.test(taskDes)) {
              debug('添加 Twitter 转发任务');
              this.undoneTasks.twitter.retweetLinks.push(link);
              continue;
            }
          }
          if (link.includes('//discord.com/')) {
            if (/join/gim.test(taskDes)) {
              debug('添加 Discord 加入任务');
              this.undoneTasks.discord.serverLinks.push(link);
              continue;
            }
          }
          if (link.includes('//discord.gg/') && /join/gim.test(taskDes)) {
            debug('获取重定向链接', {
              link: link
            });
            const taskLink = await getRedirectLink(link, false);
            if (!taskLink) {
              debug('获取重定向链接失败');
              continue;
            }
            debug('添加 Discord 加入任务');
            this.undoneTasks.discord.serverLinks.push(taskLink);
            continue;
          }
          if (/clash\.gg/.test(link)) {
            debug('跳过不支持的 Clash.gg 任务');
            echoLog({}).warning(`${I18n('unSupporttedTaskType')}: ${taskDes}(${link})`);
            continue;
          }
          debug('未知任务类型');
          echoLog({}).warning(`${I18n('unKnownTaskType')}: ${taskDes}(${link})`);
        }
        debug('任务分类完成');
        logStatus.success();
        this.undoneTasks = this.uniqueTasks(this.undoneTasks);
        if (window.DEBUG) {
          console.log('%cAuto-Task[Debug]:', 'color:blue', JSON.stringify(this));
        }
        return true;
      } catch (error) {
        debug('任务分类失败', {
          error: error
        });
        throwError(error, 'Opquests.classifyTask');
        return false;
      }
    }
    async verifyTask() {
      try {
        debug('开始验证任务');
        if (!this.initialized) {
          debug('未初始化，执行初始化');
          this.init();
        }
        const tasks = $.makeArray($('.items-center').has('input[name="task_id"]')).map((ele => $(ele).find('input[name="task_id"]').val()));
        debug('获取待验证任务', {
          count: tasks.length
        });
        GM_setValue('opquestsVerifyTasks', tasks);
        await this.#confirm();
        debug('执行后续操作');
        this.after();
        return true;
      } catch (error) {
        debug('验证任务失败', {
          error: error
        });
        throwError(error, 'Opquests.verifyTask');
        return false;
      }
    }
    async #confirm() {
      try {
        debug('开始确认任务');
        const logStatus = echoLog({
          html: `<li>${I18n('confirmingTask')}...<font></font></li>`
        });
        debug('发送确认请求');
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: `https://opquests.com/quests/${this.giveawayId}?confirm=1`,
          method: 'GET',
          nochche: true,
          headers: {
            origin: 'https://opquests.com',
            referer: `https://opquests.com/warning?id=${this.giveawayId}`
          }
        });
        if (result !== 'Success') {
          debug('请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status !== 200) {
          debug('响应错误', {
            status: data?.status,
            statusText: data?.statusText
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        debug('确认成功');
        logStatus.success();
        return true;
      } catch (error) {
        debug('确认任务失败', {
          error: error
        });
        throwError(error, 'Opquests.confirm');
        return false;
      }
    }
    async getKey(isButton) {
      try {
        if ($('[name="task_id"]').length > 0) {
          debug('有任务未完成，不获取密钥');
          echoLog({}).warning(I18n('taskNotFinished'));
          return false;
        }
        debug('开始获取密钥', {
          isButton: isButton
        });
        const logStatus = echoLog({
          text: I18n('gettingKey')
        });
        debug('发送获取密钥请求');
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: 'https://opquests.com/keys',
          method: 'GET'
        });
        if (result !== 'Success') {
          debug('请求失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (!data?.responseText) {
          debug('响应无效', {
            status: data?.status,
            statusText: data?.statusText
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        const questTitle = $('h1.font-bold').text().trim().replace(' Quest', '');
        const key = $(data.responseText).find(`div.items-center:contains("${questTitle}")`).find('div.font-bold').next().text();
        debug('查找密钥', {
          questTitle: questTitle,
          hasKey: !!key
        });
        if (!key) {
          debug('未找到密钥');
          logStatus.error('Error: Key was not found');
          if (isButton) {
            debug('重定向到密钥页面');
            window.open('https://opquests.com/keys', '_self');
          }
          return false;
        }
        debug('获取密钥成功');
        logStatus.success();
        echoLog({}).success(key);
        return true;
      } catch (error) {
        debug('获取密钥失败', {
          error: error
        });
        throwError(error, 'Opquests.getKey');
        return false;
      }
    }
    #getGiveawayId() {
      try {
        debug('开始获取抽奖ID');
        const giveawayId = window.location.href.match(/quests\/([\d]+)/)?.[1];
        if (giveawayId) {
          this.giveawayId = giveawayId;
          debug('获取抽奖ID成功', {
            giveawayId: giveawayId
          });
          return true;
        }
        debug('获取抽奖ID失败');
        echoLog({}).error(I18n('getFailed', 'GiveawayId'));
        return false;
      } catch (error) {
        debug('获取抽奖ID出错', {
          error: error
        });
        throwError(error, 'Opquests.getGiveawayId');
        return false;
      }
    }
    #checkLogin() {
      try {
        debug('检查登录状态');
        if (!globalOptions.other.checkLogin) {
          debug('跳过登录检查');
          return true;
        }
        if ($('a[href*="/auth/redirect"]').length > 0) {
          debug('未登录，重定向到登录页面');
          window.open('/auth/redirect', '_self');
        }
        debug('登录检查完成');
        return true;
      } catch (error) {
        debug('检查登录失败', {
          error: error
        });
        throwError(error, 'Opquests.checkLogin');
        return false;
      }
    }
  }
  const defaultTasksTemplate$3 = {
    steam: {
      groupLinks: [],
      wishlistLinks: [],
      followLinks: [],
      curatorLinks: [],
      curatorLikeLinks: [],
      playTimeLinks: []
    },
    twitter: {
      userLinks: [],
      retweetLinks: []
    },
    twitch: {
      channelLinks: []
    },
    discord: {
      serverLinks: []
    },
    youtube: {
      channelLinks: []
    },
    extra: {
      gleam: []
    }
  };
  const defaultTasks$3 = JSON.stringify(defaultTasksTemplate$3);
  class Gleam extends Website {
    name='Gleam';
    undoneTasks=(() => JSON.parse(defaultTasks$3))();
    socialTasks=(() => JSON.parse(defaultTasks$3))();
    buttons=[ 'doTask', 'undoTask', 'verifyTask' ];
    static test() {
      const {host: host} = window.location;
      const isMatch = host === 'gleam.io';
      debug('检查网站匹配', {
        host: host,
        isMatch: isMatch
      });
      return isMatch;
    }
    before() {
      try {
        debug('重写全局对话框函数');
        unsafeWindow.confirm = () => {};
        unsafeWindow.alert = () => {};
        unsafeWindow.prompt = () => {};
      } catch (error) {
        debug('重写全局对话框函数失败', {
          error: error
        });
        throwError(error, 'Gleam.before');
      }
    }
    async after() {
      try {
        debug('开始执行后续操作');
        if (window.location.search.includes('8b07d23f4bfa65f9')) {
          debug('检测到特殊查询参数，开始处理任务');
          const checkComplete = setInterval((() => {
            if ($('.entry-content .entry-method i.fa-check').length > 0) {
              debug('任务已完成，关闭窗口');
              clearInterval(checkComplete);
              window.close();
            }
          }));
          await this.verifyTask();
          echoLog({}).warning(I18n('gleamTaskNotice'));
        } else if (!await this.#checkLeftKey()) {
          debug('检查剩余密钥失败');
          echoLog({}).warning(I18n('checkLeftKeyFailed'));
        }
      } catch (error) {
        debug('后续操作失败', {
          error: error
        });
        throwError(error, 'Gleam.after');
      }
    }
    init() {
      try {
        debug('初始化 Gleam');
        const logStatus = echoLog({
          text: I18n('initing')
        });
        if (!this.#getGiveawayId()) {
          debug('获取抽奖ID失败');
          return false;
        }
        this.initialized = true;
        debug('初始化完成');
        logStatus.success();
        return true;
      } catch (error) {
        debug('初始化失败', {
          error: error
        });
        throwError(error, 'Gleam.init');
        return false;
      }
    }
    async classifyTask(action) {
      try {
        debug('开始分类任务', {
          action: action
        });
        const logStatus = echoLog({
          text: I18n('getTasksInfo')
        });
        if (action === 'undo') {
          debug('恢复已保存的任务信息');
          this.socialTasks = GM_getValue(`gleamTasks-${this.giveawayId}`)?.tasks || JSON.parse(defaultTasks$3);
        }
        const tasks = $('.entry-content .entry-method');
        debug('找到任务元素', {
          count: tasks.length
        });
        for (const task of tasks) {
          const $task = $(task);
          if (action === 'do' && $task.find('i.fa-question').length === 0) {
            debug('跳过已完成的任务');
            continue;
          }
          const socialIcon = $task.find('.icon-wrapper i');
          const taskInfo = $task.find('.user-links');
          const taskText = taskInfo.text().trim();
          const expandInfo = $task.find('.expandable');
          const aElements = expandInfo.find('a.btn');
          debug('处理任务', {
            taskText: taskText
          });
          if (aElements.length > 0) {
            debug('处理可点击元素', {
              count: aElements.length
            });
            for (const element of aElements) {
              const $element = $(element);
              const href = $element.attr('href');
              $element.removeAttr('href')[0].click();
              $element.attr('href', href);
            }
          }
          if (socialIcon.hasClass('fa-twitter') || socialIcon.hasClass('fa-x-twitter')) {
            const link = $task.find('a[href^="https://twitter.com/"],a[href^="https://x.com/"]').attr('href');
            if (!link) {
              continue;
            }
            if (/follow/gi.test(taskText)) {
              if (action === 'undo') {
                this.socialTasks.twitter.userLinks.push(link);
              }
              if (action === 'do') {
                this.undoneTasks.twitter.userLinks.push(link);
              }
              continue;
            }
            if (/retweet/gim.test(taskText)) {
              if (action === 'undo') {
                this.socialTasks.twitter.retweetLinks.push(link);
              }
              if (action === 'do') {
                this.undoneTasks.twitter.retweetLinks.push(link);
              }
              continue;
            }
          }
          if (socialIcon.hasClass('fa-twitch') && /follow/gim.test(taskText)) {
            const link = $task.find('a[href^="https://twitch.tv/"]').attr('href');
            if (!link) {
              continue;
            }
            if (action === 'undo') {
              this.socialTasks.twitch.channelLinks.push(link);
            }
            if (action === 'do') {
              this.undoneTasks.twitch.channelLinks.push(link);
            }
            continue;
          }
          if (socialIcon.hasClass('fa-discord') && /join/gim.test(taskText)) {
            let link = $task.find('a[href^="https://discord.com/invite/"]').attr('href');
            if (!link) {
              const ggLink = $task.find('a[href^="https://discord.gg/"]').attr('href')?.match(/discord\.gg\/([^/]+)/)?.[1];
              if (!ggLink) {
                continue;
              }
              link = `https://discord.com/invite/${ggLink}`;
            }
            if (action === 'undo') {
              this.socialTasks.discord.serverLinks.push(link);
            }
            if (action === 'do') {
              this.undoneTasks.discord.serverLinks.push(link);
            }
            continue;
          }
          if (socialIcon.hasClass('fa-external-link-square-alt')) {
            continue;
          }
          if (socialIcon.hasClass('fa-youtube') && /subscribe/gim.test(taskText)) {
            const link = $task.find('a[href^="https://www.youtube.com/channel/"]').attr('href');
            if (!link) {
              continue;
            }
            if (action === 'undo') {
              this.socialTasks.youtube.channelLinks.push(link);
            }
            if (action === 'do') {
              this.undoneTasks.youtube.channelLinks.push(link);
            }
            continue;
          }
          if (socialIcon.attr('class')?.includes('steam')) {
            if (/join.*group/gi.test(taskText)) {
              const link = $task.find('a[href^="https://steamcommunity.com/groups/"]').attr('href');
              if (!link) {
                continue;
              }
              if (action === 'undo') {
                this.socialTasks.steam.groupLinks.push(link);
              }
              if (action === 'do') {
                this.undoneTasks.steam.groupLinks.push(link);
              }
              continue;
            }
            if (/follow.*curator/gi.test(taskText)) {
              const link = $task.find('a[href^="https://store.steampowered.com/curator/"]').attr('href');
              if (!link) {
                continue;
              }
              if (action === 'undo') {
                this.socialTasks.steam.curatorLinks.push(link);
              }
              if (action === 'do') {
                this.undoneTasks.steam.curatorLinks.push(link);
              }
              continue;
            }
            if (/play[\w\W]*hours/gi.test(taskText)) {
              const link = $task.find('a[href^="https://steamcommunity.com/app/"],a[href^="https://store.steampowered.com/app/"]').attr('href');
              const time = [ ...taskText.matchAll(/(\d+?(\.\d+)?)\s*?hour/gi) ];
              if (!link || !time[0]?.[1]) {
                continue;
              }
              const trueTime = parseFloat(time[0][1]) * 60;
              if (action === 'do') {
                this.undoneTasks.steam.playTimeLinks.push(`${trueTime}-${link}`);
              }
              continue;
            }
            if (/wishlist/gi.test(taskText)) {
              const link = $task.find('a[href^="https://steamcommunity.com/app/"],a[href^="https://store.steampowered.com/app/"]').attr('href');
              if (!link) {
                continue;
              }
              if (action === 'undo') {
                this.socialTasks.steam.wishlistLinks.push(link);
              }
              if (action === 'do') {
                this.undoneTasks.steam.wishlistLinks.push(link);
              }
            }
            if (/follow/gi.test(taskText)) {
              const link = $task.find('a[href^="https://steamcommunity.com/app/"],a[href^="https://store.steampowered.com/app/"]').attr('href');
              if (!link) {
                continue;
              }
              if (action === 'undo') {
                this.socialTasks.steam.followLinks.push(link);
              }
              if (action === 'do') {
                this.undoneTasks.steam.followLinks.push(link);
              }
              continue;
            }
            if (/Sign up/gi.test(taskText)) {
              continue;
            }
          }
          if (socialIcon.hasClass('fa-bullhorn') && /Complete|Increase/gi.test(taskText)) {
            if (action !== 'do') {
              continue;
            }
            const gleamLink = await this.#getGleamLink(taskText);
            if (!gleamLink) {
              continue;
            }
            this.undoneTasks.extra.gleam.push(gleamLink);
            continue;
          }
          if (socialIcon.hasClass('fa-question') || socialIcon.hasClass('fa-reddit') || socialIcon.hasClass('fa-instagram') || socialIcon.hasClass('fa-facebook-f') || socialIcon.hasClass('fa-telegram-plane') || socialIcon.hasClass('fa-telegram') || socialIcon.hasClass('fa-vk') || socialIcon.hasClass('fa-envelope') || socialIcon.hasClass('fa-gift') || socialIcon.hasClass('fa-square-up-right') || socialIcon.hasClass('fa-gamepad-modern') || socialIcon.hasClass('fa-dollar-sign') || socialIcon.hasClass('fa-tiktok') || socialIcon.hasClass('fa-gamepad-alt') || socialIcon.hasClass('fa-bag-shopping') || socialIcon.hasClass('fa-swords') || socialIcon.hasClass('fa-dinosaur') || socialIcon.hasClass('fa-shield') && taskText.includes('one of our giveaways') || socialIcon.hasClass('fa-shield') && taskText.includes('Check out') || socialIcon.hasClass('fa-shield') && taskText.includes('vloot.io')) {
            continue;
          }
          echoLog({}).warning(`${I18n('unKnownTaskType')}: ${taskText}`);
        }
        debug('任务分类完成');
        logStatus.success();
        this.undoneTasks = this.uniqueTasks(this.undoneTasks);
        this.socialTasks = this.uniqueTasks(this.socialTasks);
        debug('保存任务信息');
        GM_setValue(`gleamTasks-${this.giveawayId}`, {
          tasks: this.socialTasks,
          time: (new Date).getTime()
        });
        return true;
      } catch (error) {
        debug('任务分类失败', {
          error: error
        });
        throwError(error, 'Gleam.classifyTask');
        return false;
      }
    }
    async extraDoTask(_ref18) {
      let {gleam: gleam} = _ref18;
      try {
        debug('开始执行额外任务', {
          count: gleam.length
        });
        const pro = [];
        for (const link of gleam) {
          pro.push(this.#doGleamTask(link));
        }
        return Promise.all(pro).then((() => true));
      } catch (error) {
        debug('执行额外任务失败', {
          error: error
        });
        throwError(error, 'Gleam.extraDoTask');
        return false;
      }
    }
    async #checkCampaign() {
      try {
        debug('检测人机验证');
        let logStatus;
        if ($('[campaign-key="campaign.key"]').length > 0) {
          logStatus = echoLog({
            text: I18n('campaign')
          });
          debug('检测到人机验证');
          await delay(3e3);
          logStatus.warning(I18n('retry'));
          await this.#checkCampaign();
          return true;
        }
        logStatus?.success();
        return false;
      } catch (error) {
        debug('检测人机验证失败', {
          error: error
        });
        throwError(error, 'Gleam.checkCampaign');
        return false;
      }
    }
    async verifyTask() {
      try {
        debug('开始验证任务');
        echoLog({
          text: `${I18n('verifyingTask')}...`
        });
        const tasks = $('.entry-content .entry-method');
        unsafeWindow._OxA = '_OxA';
        for (const task of tasks) {
          const campaign = await this.#checkCampaign();
          if (campaign) {
            return this.verifyTask();
          }
          const $task = $(task);
          if ($task.find('i.fa-check').length > 0) {
            debug('跳过已完成的任务');
            continue;
          }
          debug('处理任务验证');
          const taskInfo = $task.find('.user-links');
          taskInfo[0].click();
          const aElements = $task.find('.expandable').find('a.btn');
          if (aElements.length > 0) {
            debug('处理可点击元素', {
              count: aElements.length
            });
            for (const element of aElements) {
              const $element = $(element);
              const href = $element.attr('href');
              $element.removeAttr('href')[0].click();
              $element.attr('href', href);
            }
          }
          debug('处理计时器');
          unsafeWindow.$hookTimer?.setSpeed(1e3);
          const visitBtn = $task.find('.expandable').find('span:contains(more seconds),button:contains(more seconds)').filter(':visible');
          if (visitBtn.length > 0 && unsafeWindow.$hookTimer) {
            debug('处理访问按钮');
            const newTab = GM_openInTab('', {
              active: true
            });
            await delay(1e3);
            newTab?.close();
            window.focus();
          }
          await delay(3e3);
          unsafeWindow.$hookTimer?.setSpeed(1);
          const expandInfo = $task.find('.expandable');
          const [input] = expandInfo.find('input');
          if (input) {
            debug('处理输入框');
            const evt = new Event('input', {
              bubbles: true,
              cancelable: true,
              composed: true
            });
            const valuelimit = [ ...expandInfo.text().matchAll(/"(.+?)"/g) ].at(-1)?.[1];
            input.value = valuelimit || 'vloot';
            input.dispatchEvent(evt);
            await delay(1e3);
          }
          await this.#checkSync();
          const continueBtn = $task.find('.expandable').find('span:contains(Continue),button:contains(Continue),a:contains(Continue)');
          for (const button of continueBtn) {
            debug('点击继续按钮');
            button.click();
            await delay(500);
            await this.#checkSync();
          }
        }
        debug('任务验证完成');
        echoLog({
          text: I18n('verifiedGleamTasks')
        });
        return true;
      } catch (error) {
        debug('任务验证失败', {
          error: error
        });
        throwError(error, 'Gleam.verifyTask');
        return false;
      }
    }
    async #checkSync() {
      try {
        debug('开始检查同步状态');
        return await new Promise((resolve => {
          const checker = setInterval((() => {
            if ($('.entry-content .entry-method i.fa-sync').length === 0) {
              debug('同步完成');
              clearInterval(checker);
              resolve(true);
            }
          }), 500);
        }));
      } catch (error) {
        debug('检查同步状态失败', {
          error: error
        });
        throwError(error, 'Gleam.checkSync');
        return false;
      }
    }
    async #doGleamTask(link) {
      try {
        debug('执行 Gleam 任务', {
          link: link
        });
        const logStatus = echoLog({
          text: I18n('doingGleamTask')
        });
        return await new Promise((resolve => {
          GM_openInTab(`${link}?8b07d23f4bfa65f9`, {
            active: true,
            insert: true,
            setParent: true
          }).onclose = () => {
            debug('任务完成');
            logStatus.success();
            resolve(true);
          };
        }));
      } catch (error) {
        debug('执行 Gleam 任务失败', {
          error: error
        });
        throwError(error, 'Gleam.doGleamTask');
        return false;
      }
    }
    #getGiveawayId() {
      try {
        debug('获取抽奖ID');
        const giveawayId = window.location.pathname;
        if (giveawayId) {
          this.giveawayId = giveawayId;
          debug('获取抽奖ID成功', {
            giveawayId: giveawayId
          });
          return true;
        }
        debug('获取抽奖ID失败');
        echoLog({
          text: I18n('getFailed', 'GiveawayId')
        });
        return false;
      } catch (error) {
        debug('获取抽奖ID出错', {
          error: error
        });
        throwError(error, 'Gleam.getGiveawayId');
        return false;
      }
    }
    async #getGleamLink(title) {
      try {
        debug('获取 Gleam 链接', {
          title: title
        });
        const logStatus = echoLog({
          text: I18n('gettingGleamLink')
        });
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: 'https://www.vloot.io/api/v1/giveaways',
          method: 'GET',
          responseType: 'json'
        });
        if (result === 'Success') {
          if (data?.status === 200 && data?.response?.Success === true && data?.response?.Data) {
            const {link: link} = data.response.Data.find((giveaway => title.replace(/[\s]/g, '').toLowerCase().includes(giveaway.title.replace(/[\s]/g, '').toLowerCase()))) || {};
            if (link) {
              debug('获取链接成功', {
                link: link
              });
              logStatus.success();
              return link;
            }
            debug('获取链接失败');
            logStatus.error(`Error:${I18n('getLinkFailed')}`);
            return false;
          }
          debug('API响应错误', {
            status: data?.status,
            statusText: data?.statusText
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        debug('请求失败', {
          result: result,
          status: status,
          statusText: statusText
        });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      } catch (error) {
        debug('获取 Gleam 链接失败', {
          error: error
        });
        throwError(error, 'Gleam.getGleamLink');
        return false;
      }
    }
    async #checkLeftKey() {
      try {
        debug('检查剩余密钥');
        if (!globalOptions.other.checkLeftKey) {
          debug('跳过密钥检查');
          return true;
        }
        const campaignString = $('div.popup-blocks-container').attr('ng-init')?.match(/initCampaign\(([\w\W]+?)\)$/)?.[1];
        if (!campaignString) {
          debug('未找到活动配置信息');
          return false;
        }
        const {campaign: campaign, incentive: incentive} = JSON.parse(campaignString);
        const controllerString = $('div.campaign.reward').attr('ng-init')?.match(/initContestant\(([\w\W]+?)\);/)?.[1];
        let ownedKey = false;
        if (controllerString) {
          if (JSON.parse(controllerString).contestant?.claims?.incentives?.[incentive.id]?.length) {
            debug('用户已拥有密钥');
            ownedKey = true;
          }
        }
        const isGiveawayInvalid = campaign.banned || campaign.finished && !ownedKey || campaign.paused || (new Date).getTime() < campaign.starts_at * 1e3;
        debug('检查抽奖状态', {
          banned: campaign.banned,
          finished: campaign.finished,
          ownedKey: ownedKey,
          paused: campaign.paused,
          notStarted: (new Date).getTime() < campaign.starts_at * 1e3
        });
        if (!isGiveawayInvalid) {
          return true;
        }
        debug('抽奖无效，显示确认对话框');
        const {value: value} = await Swal.fire({
          icon: 'warning',
          title: I18n('notice'),
          text: I18n('giveawayNotWork'),
          confirmButtonText: I18n('confirm'),
          cancelButtonText: I18n('cancel'),
          showCancelButton: true
        });
        if (value) {
          debug('用户确认关闭窗口');
          window.close();
        }
        return true;
      } catch (error) {
        debug('检查剩余密钥失败', {
          error: error
        });
        throwError(error, 'Gleam.checkLeftKey');
        return false;
      }
    }
  }
  const defaultOptions = {
    username: '',
    email: ''
  };
  class SweepWidget extends Website {
    name='SweepWidget';
    options={
      ...defaultOptions,
      ...GM_getValue('SweepWidgetOptions')
    };
    buttons=[ 'doTask' ];
    static test() {
      const {host: host} = window.location;
      const isMatch = /^sweepwidget\.com$/.test(host);
      debug('检查网站匹配', {
        host: host,
        isMatch: isMatch
      });
      return /^https?:\/\/sweepwidget\.com\/view\/[\d]+/.test(window.location.href);
    }
    async after() {
      try {
        debug('开始执行后续操作');
        if (!this.#checkLogin()) {
          debug('检查登录失败');
          echoLog({}).warning(I18n('checkLoginFailed'));
        }
      } catch (error) {
        debug('后续操作失败', {
          error: error
        });
        throwError(error, 'SweepWidget.after');
      }
    }
    init() {
      try {
        debug('开始初始化');
        const logStatus = echoLog({
          text: I18n('initing')
        });
        if (!this.#checkLogin()) {
          debug('需要登录');
          logStatus.warning(I18n('needLogin'));
          return false;
        }
        if (!this.#getGiveawayId()) {
          debug('获取抽奖ID失败');
          return false;
        }
        this.initialized = true;
        debug('初始化完成');
        logStatus.success();
        return true;
      } catch (error) {
        debug('初始化失败', {
          error: error
        });
        throwError(error, 'SweepWidget.init');
        return false;
      }
    }
    classifyTask() {
      debug('任务分类完成');
      return true;
    }
    async doTask() {
      try {
        debug('开始执行任务');
        if ($('#unlock_rewards_main_wrapper').length === 0) {
          debug('未显示奖励界面，尝试登录');
          if ($('input[name="sw__login_name"]:visible').length > 0) {
            debug('填写用户名', {
              username: this.options.username
            });
            $('input[name="sw__login_name"]').val(this.options.username);
          }
          if ($('input[name="sw__login_email"]:visible').length > 0) {
            debug('填写邮箱', {
              email: this.options.email
            });
            $('input[name="sw__login_email"]').val(this.options.email);
          }
          if ($('#sw_login_button:visible').length > 0) {
            debug('点击登录按钮');
            $('#sw_login_button')[0].click();
          }
          const isEntered = await this.#checkEnter();
          if (!isEntered) {
            debug('进入抽奖失败');
            return false;
          }
        }
        const logStatus = echoLog({
          text: I18n('SweepWidgetNotice')
        });
        const tasks = $('#sw_inner_entry_methods_l2_wrapper>div.sw_entry');
        debug('找到任务列表', {
          count: tasks.length
        });
        for (const task of tasks) {
          const $task = $(task);
          if ($task.find('i.fa-check:visible').length > 0) {
            debug('跳过已完成的任务');
            continue;
          }
          const title = $task.find('.sw_text_inner');
          const aElement = $task.find('a.sw_link');
          const link = aElement.attr('href');
          if (!link) {
            debug('跳过无效链接的任务');
            continue;
          }
          debug('处理任务', {
            title: title.text(),
            link: link
          });
          title[0].click();
          aElement.attr('href', '#a').attr('target', '_self');
          aElement[0]?.click();
          await delay(300);
          aElement.attr('href', link).attr('target', '_blank');
          debug('填写测试文本');
          $task.find('input[type="text"]').val('test');
          const verifyBtn = $task.find('input.sw_verify');
          if (verifyBtn.prop('disabled') === true) {
            debug('验证按钮被禁用，尝试重新激活');
            title[0].click();
            await delay(300);
            title[0].click();
            await delay(300);
          }
          debug('点击验证按钮');
          $task.find('input.sw_verify').removeAttr('disabled')[0]?.click();
          await this.#checkFinish($task);
          const randomDelay = parseInt(`${Math.random() * (3e3 - 1e3 + 1) + 1e3}`, 10);
          debug('等待随机延迟', {
            delay: randomDelay
          });
          await delay(randomDelay);
        }
        debug('所有任务执行完成');
        logStatus.success();
        return true;
      } catch (error) {
        debug('执行任务失败', {
          error: error
        });
        throwError(error, 'SweepWidget.doTask');
        return false;
      }
    }
    #checkLogin() {
      try {
        debug('检查登录状态');
        if ($('#twitter_login_button').length > 0) {
          debug('点击 Twitter 登录按钮');
          $('#twitter_login_button')[0].click();
        }
        debug('登录检查完成');
        return true;
      } catch (error) {
        debug('检查登录失败', {
          error: error
        });
        throwError(error, 'SweepWidget.checkLogin');
        return false;
      }
    }
    #getGiveawayId() {
      try {
        debug('开始获取抽奖ID');
        const giveawayId = window.location.href.match(/\/view\/([\d]+)/)?.[1];
        if (!giveawayId) {
          debug('获取抽奖ID失败');
          echoLog({
            text: I18n('getFailed', 'GiveawayId')
          });
          return false;
        }
        this.giveawayId = giveawayId;
        debug('获取抽奖ID成功', {
          giveawayId: giveawayId
        });
        return true;
      } catch (error) {
        debug('获取抽奖ID出错', {
          error: error
        });
        throwError(error, 'SweepWidget.getGiveawayId');
        return false;
      }
    }
    async #checkEnter() {
      try {
        debug('开始检查是否进入抽奖');
        return new Promise((resolve => {
          const checker = setInterval((() => {
            if ($('#unlock_rewards_main_wrapper').length === 0) {
              debug('等待进入抽奖...');
              return;
            }
            debug('成功进入抽奖');
            clearInterval(checker);
            resolve(true);
          }), 500);
        }));
      } catch (error) {
        debug('检查进入抽奖失败', {
          error: error
        });
        throwError(error, 'SweepWidget.checkEnter');
        return false;
      }
    }
    async #checkFinish($task) {
      try {
        debug('开始检查任务完成状态');
        return new Promise((resolve => {
          const checker = setInterval((() => {
            const isCompleted = $task.find('i.fa-check:visible').length > 0 || $task.find('.sw_entry_input:visible').length === 0;
            if (!isCompleted) {
              debug('等待任务完成...');
              return;
            }
            debug('任务完成');
            clearInterval(checker);
            resolve(true);
          }), 500);
        }));
      } catch (error) {
        debug('检查任务完成状态失败', {
          error: error
        });
        throwError(error, 'SweepWidget.checkFinish');
        return false;
      }
    }
  }
  const processFormData = formData => {
    debug('开始处理表单数据', {
      formDataLength: formData.length
    });
    const data = {};
    formData.forEach((value => {
      data[value.name] = value.value;
    }));
    debug('表单数据处理完成', {
      processedData: data
    });
    return data;
  };
  const updateGlobalOption = (element, data) => {
    const name = $(element).attr('name');
    if (!name) {
      debug('元素缺少name属性', {
        element: element
      });
      return;
    }
    debug('开始更新全局选项', {
      name: name
    });
    const keys = name.split('.');
    const value = data[name];
    const processedValue = value ? value === 'on' ? true : value : value ?? false;
    debug('处理选项值', {
      keys: keys,
      originalValue: value,
      processedValue: processedValue
    });
    if (keys.length === 3) {
      globalOptions[keys[0]][keys[1]][keys[2]] = processedValue;
      debug('更新三级选项', {
        path: keys.join('.'),
        value: processedValue
      });
    } else if (keys.length === 2) {
      globalOptions[keys[0]][keys[1]] = processedValue;
      debug('更新二级选项', {
        path: keys.join('.'),
        value: processedValue
      });
    }
  };
  const generateFormRow = (type, option, data, isFirstOption, totalOptions) => {
    debug('开始生成表单行', {
      type: type,
      option: option,
      isFirstOption: isFirstOption,
      totalOptions: totalOptions
    });
    const backgroundColor = `${stringToColour(type)}44`;
    const headerBackgroundColor = `${stringToColour(type)}66`;
    if ([ 'other', 'position', 'hotKey', 'ASF' ].includes(type)) {
      const header = isFirstOption ? `<th rowspan="${totalOptions}" style="background-color: ${headerBackgroundColor}">${I18n(type)}</th>` : '';
      if (typeof data === 'boolean') {
        debug('生成布尔类型选项行', {
          type: type,
          option: option,
          value: data
        });
        return `\n        <tr style="background-color: ${backgroundColor}">\n          ${header}\n          <td>${I18n(option)}</td>\n          <td>\n            <label>\n              <input type="checkbox" name="${type}.${option}"${data ? ' checked="checked"' : ''}/>\n              <span><i></i></span>\n            </label>\n          </td>\n        </tr>`;
      }
      debug('生成文本类型选项行', {
        type: type,
        option: option,
        value: data
      });
      return `\n      <tr style="background-color: ${backgroundColor}">\n        ${header}\n        <td>${I18n(option)}</td>\n        <td>\n          <input class="editOption" type="text" name="${type}.${option}" value="${data}"/>\n        </td>\n      </tr>`;
    }
    debug('生成社交媒体选项行', {
      type: type,
      option: option,
      dataKeys: Object.keys(data)
    });
    return Object.entries(data).map((_ref19 => {
      let [socialType, value] = _ref19;
      return `\n    <tr style="background-color: ${stringToColour(option)}66">\n      ${isFirstOption ? `<th rowspan="${totalOptions}" style="background-color: ${headerBackgroundColor}">${I18n(type)}</th>` : ''}\n      <td>${option}.${I18n(socialType)}</td>\n      <td>\n        <label>\n          <input type="checkbox" name="${type}.${option}.${socialType}"${value ? ' checked="checked"' : ''}/>\n          <span><i></i></span>\n        </label>\n      </td>\n    </tr>`;
    })).join('');
  };
  const generateGlobalOptionsForm = () => {
    debug('开始生成全局选项表单');
    const formRows = Object.entries(globalOptions).map((_ref20 => {
      let [type, data1] = _ref20;
      debug('处理选项类型', {
        type: type,
        optionsCount: Object.keys(data1).length
      });
      return Object.entries(data1).map(((_ref21, index) => {
        let [option, data2] = _ref21;
        const totalOptions = [ 'other', 'position', 'hotKey', 'ASF' ].includes(type) ? Object.keys(data1).length : Object.values(data1).reduce(((acc, cur) => acc + Object.keys(cur).length), 0);
        return generateFormRow(type, option, data2, index === 0, totalOptions);
      })).join('');
    })).join('');
    debug('表单生成完成');
    return `\n    <form id="globalOptionsForm" class="auto-task-form">\n      <table class="auto-task-table">\n        <thead>\n          <tr>\n            <td>${I18n('type')}</td>\n            <td>${I18n('option')}</td>\n            <td>${I18n('value')}</td>\n          </tr>\n        </thead>\n        <tbody>\n          ${formRows}\n        </tbody>\n      </table>\n    </form>`;
  };
  const saveData = () => {
    try {
      debug('开始保存全局选项数据');
      const formData = $('#globalOptionsForm').serializeArray();
      debug('获取表单数据', {
        formDataLength: formData.length
      });
      const data = processFormData(formData);
      debug('开始更新全局选项');
      $.makeArray($('#globalOptionsForm input')).forEach((element => {
        updateGlobalOption(element, data);
      }));
      GM_setValue('globalOptions', globalOptions);
      debug('全局选项保存完成');
      Swal.fire({
        title: I18n('changeGlobalOptionsSuccess'),
        icon: 'success'
      });
    } catch (error) {
      debug('保存全局选项时发生错误', {
        error: error
      });
      throwError(error, 'saveData');
    }
  };
  const changeGlobalOptions = showType => {
    try {
      debug('开始显示全局选项配置界面', {
        showType: showType
      });
      const formHtml = generateGlobalOptionsForm();
      if (showType === 'swal') {
        debug('使用弹窗显示选项');
        Swal.fire({
          title: I18n('globalOptions'),
          html: formHtml,
          showConfirmButton: true,
          confirmButtonText: I18n('save'),
          showCancelButton: true,
          cancelButtonText: I18n('close')
        }).then((_ref22 => {
          let {isConfirmed: isConfirmed} = _ref22;
          if (isConfirmed) {
            debug('用户确认保存选项');
            saveData();
          } else {
            debug('用户取消保存选项');
          }
        }));
      } else {
        debug('使用页面内显示选项');
        $('body').append(`<h2>${I18n('globalOptions')}</h2>${formHtml}`);
      }
    } catch (error) {
      debug('显示全局选项配置界面时发生错误', {
        error: error
      });
      throwError(error, 'changeGlobalOptions');
    }
  };
  const defaultWhiteList = {
    discord: {
      servers: []
    },
    instagram: {
      users: []
    },
    twitch: {
      channels: []
    },
    twitter: {
      users: [],
      retweets: [],
      likes: []
    },
    vk: {
      names: []
    },
    youtube: {
      channels: [],
      likes: []
    },
    reddit: {
      reddits: []
    },
    steam: {
      groups: [],
      officialGroups: [],
      wishlists: [],
      follows: [],
      forums: [],
      workshops: [],
      curators: [],
      workshopVotes: [],
      curatorLikes: [],
      announcements: [],
      licenses: [],
      playtests: [],
      playTime: []
    }
  };
  const REGEX_PATTERNS = {
    DISCORD_INVITE: /invite\/(.+)/,
    INSTAGRAM_USER: /https:\/\/www\.instagram\.com\/(.+)?\//,
    TWITCH_CHANNEL: /https:\/\/(www\.)?twitch\.tv\/(.+)/,
    TWITTER_USER: /https:\/\/twitter\.com\/(.+)/,
    TWITTER_STATUS: /https:\/\/twitter\.com\/.*?\/status\/([\d]+)/,
    VK_NAME: /https:\/\/vk\.com\/([^/]+)/,
    REDDIT_USER: /https?:\/\/www\.reddit\.com\/user\/([^/]*)/,
    REDDIT_SUBREDDIT: /https?:\/\/www\.reddit\.com\/r\/([^/]*)/,
    STEAM_GROUP: /groups\/(.+)\/?/,
    STEAM_APP: /app\/([\d]+)/,
    STEAM_WORKSHOP: /\?id=([\d]+)/,
    STEAM_CURATOR: /curator\/([\d]+)/,
    STEAM_STORE: /https?:\/\/store\.steampowered\.com\/(.*?)\/([^/?]+)/
  };
  const link2id = async function(type) {
    try {
      debug('开始从链接获取ID', {
        type: type
      });
      const link = $('#socialLink').val();
      let id = '';
      switch (type) {
       case 'discord.servers':
        id = REGEX_PATTERNS.DISCORD_INVITE.exec(link)?.[1] || '';
        break;

       case 'instagram.users':
        id = REGEX_PATTERNS.INSTAGRAM_USER.exec(link)?.[1] || '';
        break;

       case 'twitch.channels':
        id = REGEX_PATTERNS.TWITCH_CHANNEL.exec(link)?.[2] || '';
        break;

       case 'twitter.users':
        id = REGEX_PATTERNS.TWITTER_USER.exec(link)?.[1] || '';
        break;

       case 'twitter.retweets':
        id = REGEX_PATTERNS.TWITTER_STATUS.exec(link)?.[1] || '';
        break;

       case 'vk.names':
        id = REGEX_PATTERNS.VK_NAME.exec(link)?.[1] || '';
        break;

       case 'youtube.channels':
        id = (await getInfo(link, 'channel'))?.params?.channelId || '';
        break;

       case 'youtube.likes':
        id = (await getInfo(link, 'likeVideo'))?.params?.videoId || '';
        break;

       case 'reddit.reddits':
        {
          const userMatch = REGEX_PATTERNS.REDDIT_USER.exec(link);
          const subredditMatch = REGEX_PATTERNS.REDDIT_SUBREDDIT.exec(link);
          id = userMatch?.[1] || subredditMatch?.[1] || '';
          break;
        }

       case 'steam.groups':
        id = REGEX_PATTERNS.STEAM_GROUP.exec(link)?.[1] || '';
        break;

       case 'steam.wishlists':
       case 'steam.follows':
       case 'steam.forums':
       case 'steam.playtests':
       case 'steam.playTime':
        id = REGEX_PATTERNS.STEAM_APP.exec(link)?.[1] || '';
        break;

       case 'steam.workshops':
        id = REGEX_PATTERNS.STEAM_WORKSHOP.exec(link)?.[1] || '';
        break;

       case 'steam.curators':
        {
          if (link.includes('curator')) {
            id = REGEX_PATTERNS.STEAM_CURATOR.exec(link)?.[1] || '';
          } else {
            const storeMatch = REGEX_PATTERNS.STEAM_STORE.exec(link);
            if (!storeMatch) {
              break;
            }
            const [, param1, param2] = storeMatch;
            const steam = new Steam;
            if (await steam.init()) {
              id = await steam.getCuratorId(param1, param2) || '';
            }
          }
          break;
        }
      }
      debug('从链接获取ID结果', {
        type: type,
        id: id
      });
      return id;
    } catch (error) {
      debug('从链接获取ID时发生错误', {
        error: error
      });
      throwError(error, 'link2id');
      return I18n('getFailed', 'id');
    }
  };
  const disabledType = {
    steam: [ 'workshopVotes', 'curatorLikes', 'announcements' ],
    twitter: [ 'likes' ]
  };
  const assignWhiteList = whiteList => {
    try {
      debug('开始合并白名单');
      const newWhiteList = {};
      for (const [key, value] of Object.entries(defaultWhiteList)) {
        newWhiteList[key] = {
          ...value,
          ...whiteList[key]
        };
      }
      debug('白名单合并完成');
      return newWhiteList;
    } catch (error) {
      debug('合并白名单时发生错误', {
        error: error
      });
      throwError(error, 'assignWhiteList');
      return defaultWhiteList;
    }
  };
  const whiteListOptions = function(showType) {
    try {
      debug('开始显示白名单选项', {
        showType: showType
      });
      const whiteList = assignWhiteList(GM_getValue('whiteList') || {});
      let whiteListOptionsForm = `<form id="whiteListForm" class="auto-task-form">\n      <table class="auto-task-table">\n        <thead>\n          <tr>\n            <td>${I18n('website')}</td>\n            <td>${I18n('type')}</td>\n            <td>${I18n('edit')}</td>\n          </tr>\n        </thead>\n        <tbody>`;
      for (const [social, types] of Object.entries(whiteList)) {
        const validTypes = Object.keys(types).filter((type => !disabledType[social]?.includes(type)));
        whiteListOptionsForm += validTypes.map(((type, index) => {
          const bgColor = `${stringToColour(social)}66`;
          return `\n          <tr style="background-color: ${bgColor}">\n            ${index === 0 ? `<th rowspan="${validTypes.length}" style="background-color: ${bgColor}">${social}</th>` : ''}\n            <td>${I18n(type)}</td>\n            <td><button type="button" class="editWhiteList" data-value="${social}.${type}">${I18n('edit')}</button></td>\n          </tr>`;
        })).join('');
      }
      whiteListOptionsForm += '</tbody></table></form>';
      if (showType === 'swal') {} else {
        debug('使用页面显示白名单选项');
        $('body').append(`<h2>${I18n('whiteList')}</h2>${whiteListOptionsForm}`);
      }
      $('.editWhiteList').on('click', (function() {
        const value = $(this).attr('data-value');
        if (!value) {
          return;
        }
        const [social, type] = value.split('.');
        const currentList = whiteList[social]?.[type];
        if (!currentList) {
          debug('未找到白名单配置', {
            social: social,
            type: type
          });
          echoLog({}).warning(I18n('whiteListNotFound', value));
          return;
        }
        debug('编辑白名单', {
          social: social,
          type: type
        });
        Swal.fire({
          title: I18n('changeWhiteListOption', value),
          input: 'textarea',
          html: `\n          <input id="socialLink" class="swal2-input" placeholder="在此处输入链接获取id">\n          <button id="link2id" data-type="${value}" class="swal2-confirm swal2-styled">获取id</button>\n          <p style="margin-bottom:0 !important;">在下方填写白名单，每行一个</p>\n        `,
          inputValue: currentList.join('\n'),
          showConfirmButton: true,
          confirmButtonText: I18n('save'),
          showCancelButton: true,
          cancelButtonText: I18n('close'),
          showDenyButton: true,
          denyButtonText: I18n('return')
        }).then((_ref23 => {
          let {isDenied: isDenied, isConfirmed: isConfirmed, value: value} = _ref23;
          if (isDenied) {
            debug('返回白名单选项');
            if (showType === 'swal') {}
            return;
          }
          if (isConfirmed && value) {
            debug('保存白名单更改', {
              social: social,
              type: type,
              value: value
            });
            whiteList[social][type] = value.split('\n').filter(Boolean);
            GM_setValue('whiteList', whiteList);
            Swal.fire({
              title: I18n('changeWhiteListSuccess'),
              icon: 'success'
            });
          }
        }));
        $('#link2id').on('click', (async function() {
          const type = $(this).attr('data-type');
          if (!type) {
            return;
          }
          debug('从链接获取ID按钮点击', {
            type: type
          });
          const id = await link2id(type);
          $('#socialLink').val(id);
        }));
      }));
    } catch (error) {
      debug('显示白名单选项时发生错误', {
        error: error
      });
      throwError(error, 'whiteListOptions');
    }
  };
  const setGistData = async (token, gistId, fileName, content) => {
    try {
      debug('开始设置Gist数据', {
        gistId: gistId,
        fileName: fileName
      });
      const logStatus = echoLog({
        text: I18n('settingData')
      });
      const contentData = JSON.stringify({
        files: {
          [fileName]: {
            content: JSON.stringify(content)
          }
        }
      });
      debug('准备发送的数据', {
        contentData: contentData
      });
      const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
        url: `https://api.github.com/gists/${gistId}`,
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `token ${token}`
        },
        data: contentData,
        responseType: 'json',
        method: 'POST',
        timeout: 3e4
      });
      if (result !== 'Success') {
        debug('设置Gist数据失败', {
          result: result,
          statusText: statusText,
          status: status
        });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }
      const expectedContent = JSON.stringify(content);
      if (data?.status !== 200 || data?.response?.files?.[fileName]?.content !== expectedContent) {
        debug('设置Gist数据验证失败', {
          status: data?.status,
          content: data?.response?.files?.[fileName]?.content
        });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }
      debug('设置Gist数据成功');
      logStatus.success();
      return true;
    } catch (error) {
      debug('设置Gist数据发生错误', {
        error: error
      });
      throwError(error, 'setGistData');
      return false;
    }
  };
  const getGistData = async function(token, gistId, fileName) {
    let test = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    try {
      debug('开始获取Gist数据', {
        gistId: gistId,
        fileName: fileName,
        test: test
      });
      const logStatus = echoLog({
        text: I18n('gettingData')
      });
      const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
        url: `https://api.github.com/gists/${gistId}`,
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `token ${token}`
        },
        responseType: 'json',
        method: 'GET',
        timeout: 3e4
      });
      if (result !== 'Success') {
        debug('获取Gist数据失败', {
          result: result,
          statusText: statusText,
          status: status
        });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }
      if (data?.status !== 200) {
        debug('获取Gist数据状态码错误', {
          status: data?.status
        });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }
      const content = data.response?.files?.[fileName]?.content;
      if (!content) {
        debug('获取的Gist数据为空');
        logStatus.error(`Error:${I18n('noRemoteData')}`);
        return false;
      }
      if (test) {
        debug('Gist数据测试成功');
        logStatus.success();
        return true;
      }
      try {
        const formatedContent = JSON.parse(content);
        debug('Gist数据解析成功', {
          contentLength: Object.keys(formatedContent).length
        });
        logStatus.success();
        return formatedContent;
      } catch (error) {
        debug('Gist数据解析失败', {
          error: error
        });
        logStatus.error(`Error:${I18n('errorRemoteDataFormat')}`);
        console.log('%c%s', 'color:white;background:red', `Auto-Task[Error]: getGistData\n${error.stack}`);
        return false;
      }
    } catch (error) {
      debug('获取Gist数据发生错误', {
        error: error
      });
      throwError(error, 'getGistData');
      return false;
    }
  };
  const syncOptions = async () => {
    try {
      debug('开始同步选项配置');
      const defaultOptions = {
        TOKEN: '',
        GIST_ID: '',
        FILE_NAME: '',
        SYNC_HISTORY: true
      };
      let syncOptions = GM_getValue('gistOptions') || defaultOptions;
      debug('获取已保存的同步选项', syncOptions);
      const createForm = options => `\n      <div class="gist-options-form">\n        <p>\n          <label for="github-token">Github Token</label>\n          <input\n            id="github-token"\n            class="swal2-input"\n            placeholder="Github Token"\n            value="${options.TOKEN}"\n            autocomplete="off"\n            spellcheck="false"\n          />\n        </p>\n        <p>\n          <label for="gist-id">Gist ID</label>\n          <input\n            id="gist-id"\n            class="swal2-input"\n            placeholder="Gist ID"\n            value="${options.GIST_ID}"\n            autocomplete="off"\n            spellcheck="false"\n          />\n        </p>\n        <p>\n          <label for="file-name">${I18n('fileName')}</label>\n          <input\n            id="file-name"\n            class="swal2-input"\n            placeholder="${I18n('fileName')}"\n            value="${options.FILE_NAME}"\n            autocomplete="off"\n            spellcheck="false"\n          />\n        </p>\n        <p class="sync-history-wrapper">\n          <label for="sync-history" class="swal2-checkbox-custom">\n            <input\n              id="sync-history"\n              type="checkbox"\n              ${options.SYNC_HISTORY ? 'checked="checked"' : ''}\n            />\n            <span class="swal2-label">${I18n('syncHistory')}</span>\n          </label>\n        </p>\n        <div class="button-group">\n          <button id="upload-data" type="button" class="swal2-confirm swal2-styled" onclick="handleUpload()">\n            ${I18n('upload2gist')}\n          </button>\n          <button id="download-data" type="button" class="swal2-confirm swal2-styled" onclick="handleDownload()">\n            ${I18n('downloadFromGist')}\n          </button>\n        </div>\n      </div>\n    `;
      const showConfigDialog = async () => {
        debug('显示配置对话框');
        const result = await Swal.fire({
          title: I18n('gistOptions'),
          html: createForm(syncOptions),
          focusConfirm: false,
          showLoaderOnConfirm: true,
          footer: `<a href="https://auto-task-doc.js.org/guide/#%E6%95%B0%E6%8D%AE%E5%90%8C%E6%AD%A5" target="_blank">${I18n('help')}</a>`,
          preConfirm: async () => {
            const options = {
              TOKEN: $('#github-token').val().trim(),
              GIST_ID: $('#gist-id').val().trim(),
              FILE_NAME: $('#file-name').val().trim(),
              SYNC_HISTORY: $('#sync-history').prop('checked')
            };
            debug('保存新的同步选项', options);
            GM_setValue('gistOptions', options);
            syncOptions = options;
            return await getGistData(options.TOKEN, options.GIST_ID, options.FILE_NAME, true);
          },
          allowOutsideClick: () => !Swal.isLoading(),
          confirmButtonText: I18n('saveAndTest'),
          showCancelButton: true,
          cancelButtonText: I18n('close')
        });
        if (result.value) {
          debug('配置测试成功');
          await Swal.fire({
            icon: 'success',
            title: I18n('testSuccess'),
            timer: 2e3,
            timerProgressBar: true
          });
          await showConfigDialog();
        } else if (result.value !== undefined) {
          debug('配置测试失败');
          await Swal.fire({
            icon: 'error',
            title: I18n('testFailed'),
            timer: 2e3,
            timerProgressBar: true
          });
          await showConfigDialog();
        }
      };
      const handleUpload = async () => {
        debug('开始处理数据上传');
        const options = GM_getValue('gistOptions');
        if (!options?.TOKEN || !options?.GIST_ID || !options?.FILE_NAME) {
          debug('配置信息不完整');
          await Swal.fire({
            icon: 'error',
            title: I18n('saveAndTestNotice')
          });
          await showConfigDialog();
          return;
        }
        debug('显示数据处理提示');
        Swal.fire({
          icon: 'info',
          title: I18n('processingData'),
          allowOutsideClick: false
        });
        const data = {};
        const names = GM_listValues();
        const syncHistory = $('#sync-history').prop('checked');
        debug('开始收集数据', {
          namesCount: names.length,
          syncHistory: syncHistory
        });
        for (const name of names) {
          if (name === 'gistOptions' || /^[\w]+?Auth$/.test(name)) {
            continue;
          }
          if (!syncHistory && /^[\w]+?Tasks-/.test(name)) {
            continue;
          }
          data[name] = GM_getValue(name);
        }
        debug('数据收集完成', {
          dataKeysCount: Object.keys(data).length
        });
        Swal.update({
          icon: 'info',
          title: I18n('updatingData')
        });
        const success = await setGistData(options.TOKEN, options.GIST_ID, options.FILE_NAME, data);
        debug('数据上传完成', {
          success: success
        });
        await Swal.fire({
          icon: success ? 'success' : 'error',
          title: I18n(success ? 'syncDataSuccess' : 'syncDataFailed'),
          timer: 2e3,
          timerProgressBar: true
        });
      };
      const handleDownload = async () => {
        debug('开始处理数据下载');
        const options = GM_getValue('gistOptions');
        if (!options?.TOKEN || !options?.GIST_ID || !options?.FILE_NAME) {
          debug('配置信息不完整');
          await Swal.fire({
            icon: 'error',
            title: I18n('saveAndTestNotice')
          });
          await showConfigDialog();
          return;
        }
        debug('显示数据下载提示');
        Swal.fire({
          icon: 'info',
          title: I18n('downloadingData'),
          allowOutsideClick: false
        });
        const data = await getGistData(options.TOKEN, options.GIST_ID, options.FILE_NAME);
        if (!data || typeof data === 'boolean') {
          debug('未检测到远程数据');
          await Swal.fire({
            icon: 'error',
            title: I18n('checkedNoData')
          });
          await showConfigDialog();
          return;
        }
        debug('开始保存数据');
        Swal.update({
          icon: 'info',
          title: I18n('savingData')
        });
        const syncHistory = $('#sync-history').prop('checked');
        let savedCount = 0;
        for (const [name, value] of Object.entries(data)) {
          if (!syncHistory && /^[\w]+?Tasks-/.test(name)) {
            continue;
          }
          GM_setValue(name, value);
          savedCount += 1;
        }
        debug('数据保存完成', {
          savedCount: savedCount
        });
        await Swal.fire({
          icon: 'success',
          title: I18n('syncDataSuccess'),
          timer: 2e3,
          timerProgressBar: true
        });
      };
      unsafeWindow.handleUpload = handleUpload;
      unsafeWindow.handleDownload = handleDownload;
      await showConfigDialog();
    } catch (error) {
      debug('同步选项发生错误', {
        error: error
      });
      throwError(error, 'syncOptions');
      await Swal.fire({
        icon: 'error',
        title: I18n('error'),
        text: error instanceof Error ? error.message : 'Unknown error occurred',
        timer: 3e3,
        timerProgressBar: true
      });
    }
  };
  const VALID_SIDES_X = [ 'right', 'left' ];
  const VALID_SIDES_Y = [ 'top', 'bottom' ];
  class Setting {
    name='Setting';
    buttons=[ 'saveGlobalOptions', 'syncData', 'tasksHistory' ];
    syncData=(() => syncOptions)();
    selectors={
      body: 'body',
      autoTaskInfo: '#auto-task-info',
      autoTaskButtons: '#auto-task-buttons',
      showButtonDiv: 'div.show-button-div',
      positionInputs: 'input[name^="position"]',
      hotKeyInputs: 'input[name^="hotKey"]'
    };
    tasksHistory() {
      debug('打开任务历史记录页面');
      GM_openInTab('https://auto-task.hclonely.com/history.html', {
        active: true
      });
    }
    static test() {
      const {host: host, pathname: pathname} = window.location;
      const isMatch = [ 'auto-task.hclonely.com', 'auto-task-doc.js.org' ].includes(host) && pathname === '/setting.html';
      debug('检查设置页面匹配', {
        host: host,
        pathname: pathname,
        isMatch: isMatch
      });
      return isMatch;
    }
    before() {
      try {
        debug('开始清空页面内容');
        $(this.selectors.body).html('').addClass('auto-task-options');
        debug('页面内容已清空');
      } catch (error) {
        debug('清空页面内容失败', {
          error: error
        });
        throwError(error, 'Setting.before');
      }
    }
    async after() {
      try {
        debug('开始初始化设置页面');
        await this.#initializeEnvironment();
        this.#initializeGlobalSettings();
        this.#setupSocialButtons();
        this.#setupPositionHandlers();
        this.#setupHotKeyHandlers();
        debug('设置页面初始化完成');
      } catch (error) {
        debug('设置页面初始化失败', {
          error: error
        });
        throwError(error, 'Setting.after');
      }
    }
    saveGlobalOptions() {
      try {
        debug('开始保存全局选项');
        saveData();
        debug('全局选项保存完成');
      } catch (error) {
        debug('保存全局选项失败', {
          error: error
        });
        throwError(error, 'Setting.saveGlobalOptions');
      }
    }
    async #initializeEnvironment() {
      try {
        debug('开始初始化环境信息');
        const userAgent = await browser.getInfo();
        debug('获取用户代理信息', {
          userAgent: userAgent
        });
        const environmentHtml = this.#generateEnvironmentHtml(userAgent);
        $(this.selectors.body).append(`<h2>${I18n('environment')}</h2>${environmentHtml}`);
        debug('环境信息初始化完成');
      } catch (error) {
        debug('初始化环境信息失败', {
          error: error
        });
        throwError(error, 'Setting.initializeEnvironment');
      }
    }
    #generateEnvironmentHtml(userAgent) {
      return `\n      <form id="environmentForm" class="auto-task-form">\n        <table class="auto-task-table">\n          <thead>\n            <tr>\n              <td>${I18n('type')}</td>\n              <td>${I18n('name')}</td>\n              <td>${I18n('version')}</td>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td>${I18n('os')}</td>\n              <td>${userAgent.system}</td>\n              <td>${userAgent.systemVersion}</td>\n            </tr>\n            <tr>\n              <td>${I18n('browser')}</td>\n              <td>${userAgent.browser}</td>\n              <td>${userAgent.browserVersion}</td>\n            </tr>\n            <tr>\n              <td>${I18n('scriptManager')}</td>\n              <td>${GM_info.scriptHandler}</td>\n              <td>${GM_info.version}</td>\n            </tr>\n            <tr>\n              <td>${I18n('script')}</td>\n              <td>${GM_info.script.name}</td>\n              <td>${GM_info.script.version}</td>\n            </tr>\n          </tbody>\n        </table>\n      </form>\n    `;
    }
    #initializeGlobalSettings() {
      debug('开始初始化全局设置');
      changeGlobalOptions('page');
      whiteListOptions('page');
      debug('全局设置初始化完成');
    }
    #setupSocialButtons() {
      debug('开始设置社交媒体按钮');
      this.#addSocialButton('other.twitterVerifyId', 'getTwitterUserId', 'twitterUser');
      this.#addSocialButton('other.youtubeVerifyChannel', 'getYoutubeChannelId', 'youtubeChannel');
      debug('社交媒体按钮设置完成');
    }
    #addSocialButton(inputName, buttonId, socialType) {
      debug('添加社交媒体按钮', {
        inputName: inputName,
        buttonId: buttonId,
        socialType: socialType
      });
      $(`input[name="${inputName}"]`).after(`<button id="${buttonId}" type="button">${I18n(`get${buttonId}`)}</button>`);
      $(`#${buttonId}`).on('click', (() => this.#getId(socialType)));
      debug('社交媒体按钮添加完成');
    }
    #setupPositionHandlers() {
      debug('开始设置位置处理器');
      $(this.selectors.positionInputs).on('input', (event => {
        const input = $(event.target);
        const type = input.attr('name')?.replace('position.', '');
        if (!type) {
          debug('无效的位置类型');
          return;
        }
        debug('处理位置变化', {
          type: type
        });
        this.#handlePositionChange(type);
      }));
      debug('位置处理器设置完成');
    }
    #handlePositionChange(type) {
      debug('开始处理位置变化', {
        type: type
      });
      const config = this.#getPositionConfig(type);
      if (!config) {
        debug('获取位置配置失败');
        return;
      }
      const {distance: distance, sideX: sideX, sideY: sideY} = config;
      if (!this.#isValidPosition(distance, sideX, sideY)) {
        debug('无效的位置配置', {
          distance: distance,
          sideX: sideX,
          sideY: sideY
        });
        return;
      }
      const [x, y] = distance.split(',');
      const target = this.#getPositionTarget(type);
      if (!target) {
        debug('获取目标元素失败');
        return;
      }
      debug('更新元素位置', {
        target: target,
        sideX: sideX,
        sideY: sideY,
        x: x,
        y: y
      });
      this.#updateElementPosition(target, sideX, sideY, x, y);
    }
    #getPositionConfig(type) {
      debug('获取位置配置', {
        type: type
      });
      const baseType = type.replace(/(?:button|log|show)(?:SideX|SideY|Distance)$/, '');
      const distance = $(`input[name="position.${baseType}Distance"]`).val();
      const sideX = $(`input[name="position.${baseType}SideX"]`).val();
      const sideY = $(`input[name="position.${baseType}SideY"]`).val();
      const config = {
        distance: distance,
        sideX: sideX,
        sideY: sideY
      };
      debug('位置配置', config);
      return config;
    }
    #isValidPosition(distance, sideX, sideY) {
      const isValid = VALID_SIDES_X.includes(sideX) && VALID_SIDES_Y.includes(sideY) && /^[\d]+?,[\d]+$/.test(distance);
      debug('验证位置配置', {
        distance: distance,
        sideX: sideX,
        sideY: sideY,
        isValid: isValid
      });
      return isValid;
    }
    #getPositionTarget(type) {
      const targetMap = {
        button: this.selectors.autoTaskButtons,
        showButton: this.selectors.showButtonDiv,
        log: this.selectors.autoTaskInfo
      };
      const baseType = type.replace(/(?:SideX|SideY|Distance)$/, '');
      return targetMap[baseType];
    }
    #updateElementPosition(selector, sideX, sideY, x, y) {
      debug('更新元素位置', {
        selector: selector,
        sideX: sideX,
        sideY: sideY,
        x: x,
        y: y
      });
      const $element = $(selector);
      const oppositeX = sideX === 'right' ? 'left' : 'right';
      const oppositeY = sideY === 'top' ? 'bottom' : 'top';
      $element.css(sideX, `${x}px`).css(sideY, `${y}px`).css(oppositeX, '').css(oppositeY, '');
      debug('元素位置更新完成');
    }
    #setupHotKeyHandlers() {
      debug('开始设置热键处理器');
      $(this.selectors.hotKeyInputs).attr('readonly', 'readonly').off('keydown').on('keydown', this.#handleHotKeyPress);
      debug('热键处理器设置完成');
    }
    #handleHotKeyPress(event) {
      debug('处理热键按下事件', {
        key: event.key
      });
      const functionKeys = [];
      if (event.altKey) {
        functionKeys.push('alt');
      }
      if (event.ctrlKey) {
        functionKeys.push('ctrl');
      }
      if (event.shiftKey) {
        functionKeys.push('shift');
      }
      const key = event.key.length === 1 ? event.key.toLowerCase() : '';
      const value = functionKeys.length ? `${functionKeys.join(' + ')} + ${key}` : key;
      debug('设置热键值', {
        functionKeys: functionKeys,
        key: key,
        value: value
      });
      $(event.target).val(value);
    }
    async #getId(social) {
      try {
        debug('开始获取社交媒体ID', {
          social: social
        });
        const result = await Swal.fire({
          title: I18n('getId', I18n(social)),
          html: this.#generateIdInputHtml(social),
          showCancelButton: true,
          cancelButtonText: I18n('close'),
          showConfirmButton: false
        });
        if (!result.isDismissed) {
          debug('用户确认获取ID');
          await this.#handleIdRetrieval(social);
        } else {
          debug('用户取消获取ID');
        }
      } catch (error) {
        debug('获取社交媒体ID失败', {
          error: error
        });
        throwError(error, 'Setting.getId');
      }
    }
    #generateIdInputHtml(social) {
      return `\n      <input id="socialLink" class="swal2-input" placeholder="在此处输入链接获取id">\n      <button id="link2id" data-type="${social}" class="swal2-confirm swal2-styled">获取id</button>\n    `;
    }
    async #handleIdRetrieval(social) {
      const link = $('#socialLink').val();
      if (!link) {
        debug('链接为空');
        return;
      }
      debug('开始处理ID获取', {
        social: social,
        link: link
      });
      let id = '';
      if (social === 'twitterUser') {
        const name = link.match(/https:\/\/twitter\.com\/(.+)/)?.[1] || link;
        debug('获取Twitter用户ID', {
          name: name
        });
        id = await (new Twitter).userName2id(name) || '';
      } else if (social === 'youtubeChannel') {
        const name = this.#extractYoutubeUrl(link);
        debug('获取YouTube频道信息', {
          name: name
        });
        const info = await getInfo(name, 'channel');
        id = info?.params?.channelId || '';
      }
      debug('ID获取结果', {
        id: id
      });
      $('#socialLink').val(id);
    }
    #extractYoutubeUrl(link) {
      debug('提取YouTube URL', {
        link: link
      });
      if (/^https:\/\/(www\.)?google\.com.*?\/url\?.*?url=https:\/\/www.youtube.com\/.*/.test(link)) {
        const extractedUrl = link.match(/url=(https:\/\/www\.youtube\.com\/.*)/)?.[1] || link;
        debug('从Google搜索结果提取URL', {
          extractedUrl: extractedUrl
        });
        return extractedUrl;
      }
      return link;
    }
  }
  class History extends Keylol {
    name='History';
    buttons=[ 'doTask', 'undoTask', 'selectAll', 'selectNone', 'invertSelect', 'clearHistory' ];
    static test() {
      try {
        const {host: host, pathname: pathname} = window.location;
        const isMatch = [ 'auto-task.hclonely.com', 'auto-task-doc.js.org' ].includes(host) && pathname === '/history.html';
        debug('检查是否为历史记录页面', {
          host: host,
          pathname: pathname,
          isMatch: isMatch
        });
        return isMatch;
      } catch (error) {
        debug('检查历史记录页面时出错', {
          error: error
        });
        throwError(error, 'History.test');
        return false;
      }
    }
    before() {
      try {
        debug('开始初始化历史记录页面');
        $('body').html('<div class="container"></div>').addClass('auto-task-history');
        debug('页面基础结构已创建');
        const data = GM_listValues() || [];
        debug('获取存储的所有值', {
          count: data.length
        });
        const tasksHistory = data.map((value => /^[\w]+?Tasks-/.test(value) ? value : null)).filter((value => value));
        debug('筛选任务历史记录', {
          count: tasksHistory.length
        });
        tasksHistory.forEach((item => {
          debug('处理任务项', {
            item: item
          });
          this.#addItem(item);
        }));
        debug('历史记录页面初始化完成');
      } catch (error) {
        debug('初始化历史记录页面时出错', {
          error: error
        });
        throwError(error, 'History.before');
      }
    }
    clearHistory() {
      try {
        debug('开始清除历史记录');
        const data = GM_listValues() || [];
        debug('获取存储的所有值', {
          count: data.length
        });
        const tasksHistory = data.map((value => /^[\w]+?Tasks-/.test(value) ? value : null)).filter((value => value));
        debug('筛选要清除的任务历史记录', {
          count: tasksHistory.length
        });
        tasksHistory.forEach((item => {
          debug('删除任务项', {
            item: item
          });
          GM_deleteValue(item);
        }));
        debug('历史记录清除完成');
        Swal.fire({
          title: I18n('clearHistoryFinished'),
          icon: 'success'
        });
      } catch (error) {
        debug('清除历史记录时出错', {
          error: error
        });
        throwError(error, 'History.clearHistory');
      }
    }
    #addItem(item) {
      try {
        debug('开始添加任务项', {
          item: item
        });
        const tasksData = GM_getValue(item);
        if (!tasksData?.tasks) {
          debug('任务数据无效', {
            item: item
          });
          return;
        }
        const {title: title, link: link} = this.#getTaskInfo(item);
        if (!title || !link) {
          debug('获取任务信息失败', {
            item: item
          });
          return;
        }
        debug('生成任务HTML', {
          item: item,
          title: title,
          link: link
        });
        const html = this.#generateTaskHtml(tasksData.tasks);
        this.#appendTaskToContainer(item, title, link, html, tasksData.time);
        this.#bindDeleteEvent();
        debug('任务项添加完成', {
          item: item
        });
      } catch (error) {
        debug('添加任务项时出错', {
          error: error,
          item: item
        });
        throwError(error, 'History.addItem');
      }
    }
    #getTaskInfo(item) {
      try {
        debug('开始获取任务信息', {
          item: item
        });
        const [website, id] = item.split('-');
        debug('解析任务标识符', {
          website: website,
          id: id
        });
        const taskInfoMap = {
          fawTasks: {
            title: `Freeanywhere[${id}]`,
            link: `https://freeanywhere.net/#/giveaway/${id}`
          },
          gasTasks: {
            title: `Giveawaysu[${id}]`,
            link: `https://giveaway.su/giveaway/view/${id}`
          },
          gcTasks: {
            title: `GiveeClub[${id}]`,
            link: `https://givee.club/event/${id}`
          },
          gkTasks: {
            title: `Givekey[${id}]`,
            link: `https://givekey.ru/giveaway/${id}`
          },
          gleamTasks: {
            title: `Gleam[${id}]`,
            link: `https://gleam.io${id}`
          },
          khTasks: {
            title: `keyhub[${id}]`,
            link: `https://key-hub.eu/giveaway/${id}`
          },
          prysTasks: {
            title: `Prys[${id}]`,
            link: `https://prys.revadike.com/giveaway/?id=${id}`
          }
        };
        const result = taskInfoMap[website] || {
          title: '',
          link: ''
        };
        debug('获取任务信息结果', {
          result: result
        });
        return result;
      } catch (error) {
        debug('获取任务信息时出错', {
          error: error,
          item: item
        });
        throwError(error, 'History.getTaskInfo');
        return {
          title: '',
          link: ''
        };
      }
    }
    #generateTaskHtml(tasks) {
      try {
        debug('开始生成任务HTML');
        let html = '';
        for (const [social, types] of Object.entries(tasks)) {
          for (const [type, taskList] of Object.entries(types)) {
            for (const task of taskList) {
              debug('处理任务', {
                social: social,
                type: type,
                task: task
              });
              const displayTask = task.length > 55 ? `${task.slice(0, 55)}...` : task;
              html += `<li>\n              <font class="auto-task-capitalize">${social}.${I18n(type.replace('Link', ''))}: </font>\n              <a href="${task}" target="_blank">${displayTask}</a>\n            </li>`;
            }
          }
        }
        debug('任务HTML生成完成');
        return html;
      } catch (error) {
        debug('生成任务HTML时出错', {
          error: error
        });
        throwError(error, 'History.generateTaskHtml');
        return '';
      }
    }
    #appendTaskToContainer(item, title, link, html, time) {
      try {
        debug('开始添加任务到容器', {
          item: item,
          title: title,
          link: link
        });
        $('.container').append(`\n        <div class="card" data-name="${item}">\n          <div class="title">\n            <a href="${link}" target="_blank">${title}</a>\n            <span class="delete-task" data-name="${item}" title="${I18n('deleteTask')}">\n              <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2734" width="32" height="32">\n                <path d="M607.897867 768.043004c-17.717453 0-31.994625-14.277171-31.994625-31.994625L575.903242 383.935495c0-17.717453 14.277171-31.994625 31.994625-31.994625s31.994625 14.277171 31.994625 31.994625l0 351.94087C639.892491 753.593818 625.61532 768.043004 607.897867 768.043004z" p-id="2735" fill="#d81e06"></path>\n                <path d="M415.930119 768.043004c-17.717453 0-31.994625-14.277171-31.994625-31.994625L383.935495 383.935495c0-17.717453 14.277171-31.994625 31.994625-31.994625 17.717453 0 31.994625 14.277171 31.994625 31.994625l0 351.94087C447.924744 753.593818 433.647573 768.043004 415.930119 768.043004z" p-id="2736" fill="#d81e06"></path>\n                <path d="M928.016126 223.962372l-159.973123 0L768.043004 159.973123c0-52.980346-42.659499-95.983874-95.295817-95.983874L351.94087 63.989249c-52.980346 0-95.983874 43.003528-95.983874 95.983874l0 63.989249-159.973123 0c-17.717453 0-31.994625 14.277171-31.994625 31.994625s14.277171 31.994625 31.994625 31.994625l832.032253 0c17.717453 0 31.994625-14.277171 31.994625-31.994625S945.73358 223.962372 928.016126 223.962372zM319.946246 159.973123c0-17.545439 14.449185-31.994625 31.994625-31.994625l320.806316 0c17.545439 0 31.306568 14.105157 31.306568 31.994625l0 63.989249L319.946246 223.962372 319.946246 159.973123 319.946246 159.973123z" p-id="2737" fill="#d81e06"></path>\n                <path d="M736.048379 960.010751 288.123635 960.010751c-52.980346 0-95.983874-43.003528-95.983874-95.983874L192.139761 383.591466c0-17.717453 14.277171-31.994625 31.994625-31.994625s31.994625 14.277171 31.994625 31.994625l0 480.435411c0 17.717453 14.449185 31.994625 31.994625 31.994625l448.096758 0c17.717453 0 31.994625-14.277171 31.994625-31.994625L768.215018 384.795565c0-17.717453 14.277171-31.994625 31.994625-31.994625s31.994625 14.277171 31.994625 31.994625l0 479.231312C832.032253 916.835209 789.028725 960.010751 736.048379 960.010751z" p-id="2738" fill="#d81e06"></path>\n              </svg>\n            </span>\n          </div>\n          <ul>${html}</ul>\n          <span class="time">${I18n('lastChangeTime')}: ${dayjs(time).format('YYYY-MM-DD HH:mm:ss')}</span>\n        </div>\n      `);
        debug('任务已添加到容器', {
          item: item
        });
      } catch (error) {
        debug('添加任务到容器时出错', {
          error: error,
          item: item
        });
        throwError(error, 'History.appendTaskToContainer');
      }
    }
    #bindDeleteEvent() {
      try {
        debug('开始绑定删除事件');
        $('span.delete-task').on('click', (function() {
          const itemName = $(this).attr('data-name');
          debug('点击删除按钮', {
            itemName: itemName
          });
          if (!itemName) {
            debug('删除失败：未找到任务名称');
            Swal.fire({
              title: I18n('clearTaskFailed'),
              icon: 'error'
            });
            return;
          }
          GM_deleteValue(itemName);
          $(`div.card[data-name="${itemName}"]`).remove();
          debug('任务删除成功', {
            itemName: itemName
          });
          Swal.fire({
            title: I18n('clearTaskFinished'),
            text: itemName,
            icon: 'success'
          });
        }));
        debug('删除事件绑定完成');
      } catch (error) {
        debug('绑定删除事件时出错', {
          error: error
        });
        throwError(error, 'History.bindDeleteEvent');
      }
    }
  }
  const defaultTasksTemplate$2 = {
    steam: {
      groupLinks: [],
      wishlistLinks: [],
      followLinks: [],
      curatorLinks: [],
      curatorLikeLinks: []
    },
    twitter: {
      userLinks: [],
      retweetLinks: []
    },
    twitch: {
      channelLinks: []
    },
    discord: {
      serverLinks: []
    },
    youtube: {
      channelLinks: []
    },
    extra: {
      giveawayHopper: []
    }
  };
  const defaultTasks$2 = JSON.stringify(defaultTasksTemplate$2);
  class GiveawayHopper extends Website {
    name='GiveawayHopper';
    undoneTasks=(() => JSON.parse(defaultTasks$2))();
    socialTasks=(() => JSON.parse(defaultTasks$2))();
    tasks=[];
    buttons=[ 'doTask', 'undoTask', 'verifyTask' ];
    static test() {
      const {host: host} = window.location;
      const isMatch = host === 'giveawayhopper.com';
      debug('检查网站匹配', {
        host: host,
        isMatch: isMatch
      });
      return isMatch;
    }
    async after() {
      try {
        debug('开始执行后续操作');
        if (!this.#checkLogin()) {
          debug('登录检查失败');
          echoLog({}).warning(I18n('checkLoginFailed'));
        }
        const giveawayIdResult = this.#getGiveawayId();
        debug('获取抽奖ID', {
          success: giveawayIdResult,
          id: this.giveawayId
        });
      } catch (error) {
        debug('后续操作失败', {
          error: error
        });
        throwError(error, 'GiveawayHopper.after');
      }
    }
    async init() {
      try {
        debug('初始化 GiveawayHopper');
        const logStatus = echoLog({
          text: I18n('initing')
        });
        const leftKeyResult = await this.#checkLeftKey();
        if (!leftKeyResult) {
          debug('检查剩余密钥失败');
          echoLog({}).warning(I18n('checkLeftKeyFailed'));
        }
        this.initialized = true;
        debug('初始化完成');
        logStatus.success();
        return true;
      } catch (error) {
        debug('初始化失败', {
          error: error
        });
        throwError(error, 'GiveawayHopper.init');
        return false;
      }
    }
    async classifyTask(action) {
      try {
        debug('开始分类任务', {
          action: action
        });
        if (!this.giveawayId) {
          debug('未找到抽奖ID，尝试获取');
          await this.#getGiveawayId();
        }
        const logStatus = echoLog({
          text: I18n('getTasksInfo')
        });
        if (action === 'undo') {
          debug('恢复已保存的任务信息');
          this.socialTasks = GM_getValue(`giveawayHopperTasks-${this.giveawayId}`)?.tasks || JSON.parse(defaultTasks$2);
        }
        debug('请求任务列表');
        const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
          url: `https://giveawayhopper.com/api/v1/campaigns/${this.giveawayId}/with-auth`,
          method: 'GET',
          responseType: 'json',
          headers: {
            authorization: `Bearer ${window.sessionStorage.gw_auth}`,
            'x-xsrf-token': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1])
          }
        });
        if (result !== 'Success') {
          debug('请求任务列表失败', {
            result: result,
            statusText: statusText,
            status: status
          });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }
        if (data?.status !== 200 || !data?.response?.tasks) {
          debug('任务列表数据异常', {
            status: data?.status,
            response: data?.response
          });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }
        debug('获取到任务列表', {
          count: data.response.tasks.length
        });
        this.tasks = data.response.tasks;
        for (const task of data.response.tasks) {
          if (task.isDone) {
            debug('跳过已完成任务', {
              taskId: task.id,
              type: task.type
            });
            continue;
          }
          debug('处理任务', {
            taskId: task.id,
            category: task.category,
            type: task.type
          });
          await httpRequest({
            url: `https://giveawayhopper.com/api/v1/campaigns/${this.giveawayId}/tasks/${task.id}/visited`,
            method: 'GET',
            responseType: 'json',
            headers: {
              authorization: `Bearer ${window.sessionStorage.gw_auth}`,
              'x-xsrf-token': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1])
            }
          });
          if (task.category === 'Steam' && task.type === 'JoinGroup') {
            debug('处理 Steam 组任务');
            const steamGroupLink = await getRedirectLink(`https://steamcommunity.com/gid/${task.group_id}`);
            if (!steamGroupLink) {
              debug('获取 Steam 组链接失败');
              continue;
            }
            debug('添加 Steam 组链接', {
              action: action,
              link: steamGroupLink
            });
            if (action === 'undo') {
              this.socialTasks.steam.groupLinks.push(steamGroupLink);
            }
            if (action === 'do') {
              this.undoneTasks.steam.groupLinks.push(steamGroupLink);
            }
            continue;
          }
          if (task.category === 'Discord' && task.type === 'JoinServer') {
            const discordLink = `https://discord.gg/${task.invite_code}`;
            debug('添加 Discord 服务器链接', {
              action: action,
              link: discordLink
            });
            if (action === 'undo') {
              this.socialTasks.discord.serverLinks.push(discordLink);
            }
            if (action === 'do') {
              this.undoneTasks.discord.serverLinks.push(discordLink);
            }
            continue;
          }
          if ([ 'TikTok', 'YouTube', 'General' ].includes(task.category)) {
            debug('跳过特殊任务类型', {
              category: task.category
            });
            continue;
          }
          debug('发现未知任务类型', {
            category: task.category,
            type: task.type
          });
          echoLog({}).warning(`${I18n('unKnownTaskType')}: ${task.category}-${task.type}`);
        }
        logStatus.success();
        this.undoneTasks = this.uniqueTasks(this.undoneTasks);
        this.socialTasks = this.uniqueTasks(this.socialTasks);
        debug('任务分类完成', {
          undoneTasks: this.undoneTasks,
          socialTasks: this.socialTasks
        });
        GM_setValue(`giveawayHopperTasks-${this.giveawayId}`, {
          tasks: this.socialTasks,
          time: (new Date).getTime()
        });
        return true;
      } catch (error) {
        debug('任务分类失败', {
          error: error
        });
        throwError(error, 'GiveawayHopper.classifyTask');
        return false;
      }
    }
    async verifyTask() {
      try {
        debug('开始验证任务');
        for (const task of this.tasks) {
          if (task.isDone) {
            debug('跳过已完成任务', {
              taskId: task.id
            });
            continue;
          }
          debug('验证任务', {
            taskId: task.id,
            name: task.displayName?.replace(':target', task.targetName) || task.name
          });
          const logStatus = echoLog({
            text: `${I18n('verifyingTask')}[${task.displayName?.replace(':target', task.targetName) || task.name}]...`
          });
          if (!task.link) {
            debug('获取任务链接');
            task.link = this.#getTaskLink(task);
          }
          if (task.link) {
            debug('访问任务链接', {
              link: task.link
            });
            await this.#visitTaskLink(task);
          }
          await delay(1e3);
          const verifyResult = await this.#verifyTask(task, logStatus);
          debug('任务验证结果', {
            taskId: task.id,
            success: verifyResult
          });
          if (!verifyResult) {
            continue;
          }
        }
        debug('所有任务验证完成');
        return true;
      } catch (error) {
        debug('任务验证失败', {
          error: error
        });
        throwError(error, 'GiveawayHopper.verifyTask');
        return false;
      }
    }
    #getTaskLink(task) {
      try {
        debug('生成任务链接', {
          category: task.category,
          type: task.type
        });
        let link = '';
        if (task.category === 'YouTube' && task.type === 'FollowAccount') {
          link = `https://www.youtube.com/@${task.targetName}`;
        } else if (task.category === 'TikTok' && task.type === 'FollowAccount') {
          link = `https://www.tiktok.com/@${task.targetName}`;
        } else if (task.category === 'Steam' && task.type === 'JoinGroup') {
          link = '';
        } else if (task.category === 'Discord' && task.type === 'JoinServer') {
          link = '';
        }
        debug('生成的任务链接', {
          link: link
        });
        return link;
      } catch (error) {
        debug('生成任务链接失败', {
          error: error
        });
        throwError(error, 'GiveawayHopper.getTaskLink');
        return '';
      }
    }
    async #visitTaskLink(task) {
      debug('访问任务链接', {
        taskId: task.id,
        link: task.link
      });
      await httpRequest({
        url: `https://giveawayhopper.com/fw?url=${encodeURIComponent(task.link)}&src=campaign&src_id=${this.giveawayId}&ref=task&ref_id=${task.id}&token=${window.sessionStorage.gw_auth}`,
        method: 'GET',
        headers: {
          authorization: `Bearer ${window.sessionStorage.gw_auth}`,
          'x-xsrf-token': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1])
        }
      });
    }
    async #verifyTask(task, logStatus) {
      debug('验证任务', {
        taskId: task.id,
        category: task.category,
        type: task.type
      });
      const postData = {
        taskcategory: task.category,
        taskname: task.type
      };
      if ([ 'YouTube', 'TikTok' ].includes(task.category)) {
        postData.username = '1';
      }
      const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
        url: `https://giveawayhopper.com/api/v1/campaigns/${this.giveawayId}/tasks/${task.id}/complete`,
        method: 'POST',
        headers: {
          authorization: `Bearer ${window.sessionStorage.gw_auth}`,
          'x-xsrf-token': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1]),
          'content-type': 'application/json'
        },
        dataType: 'json',
        data: JSON.stringify(postData)
      });
      if (result !== 'Success') {
        debug('任务验证请求失败', {
          result: result,
          statusText: statusText,
          status: status
        });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }
      if (data?.status !== 200 || !data?.response?.completed) {
        debug('任务验证响应异常', {
          status: data?.status,
          response: data?.response
        });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }
      debug('任务验证成功', {
        taskId: task.id
      });
      logStatus.success();
      return true;
    }
    #getGiveawayId() {
      try {
        debug('从URL获取抽奖ID');
        const giveawayId = window.location.pathname.split('/').at(-1);
        if (!giveawayId) {
          debug('获取抽奖ID失败');
          echoLog({
            text: I18n('getFailed', 'GiveawayId')
          });
          return false;
        }
        this.giveawayId = giveawayId;
        debug('获取抽奖ID成功', {
          giveawayId: giveawayId
        });
        return true;
      } catch (error) {
        debug('获取抽奖ID出错', {
          error: error
        });
        throwError(error, 'GiveawayHopper.getGiveawayId');
        return false;
      }
    }
    #checkLogin() {
      try {
        debug('检查登录状态');
        if (!globalOptions.other.checkLogin) {
          debug('跳过登录检查');
          return true;
        }
        const needLogin = $('div.widget-connections-edit:contains("Log in")').length > 0;
        if (needLogin) {
          debug('未登录，自动点击登录按钮');
          $('div.widget-connections-edit:contains("Log in") a')[0].click();
        }
        debug('登录检查完成', {
          needLogin: needLogin
        });
        return true;
      } catch (error) {
        debug('登录检查失败', {
          error: error
        });
        throwError(error, 'GiveawayHopper.checkLogin');
        return false;
      }
    }
    async #checkLeftKey() {
      try {
        debug('检查剩余密钥');
        if (!globalOptions.other.checkLeftKey) {
          debug('跳过密钥检查');
          return true;
        }
        const keyCount = parseInt($('p.widget-single-prize span').text()?.match(/\d+/)?.[0] || '0', 10);
        debug('剩余密钥数量', {
          keyCount: keyCount
        });
        if (keyCount > 0) {
          return true;
        }
        debug('没有剩余密钥，显示确认对话框');
        const {value: value} = await Swal.fire({
          icon: 'warning',
          title: I18n('notice'),
          text: I18n('noKeysLeft'),
          confirmButtonText: I18n('confirm'),
          cancelButtonText: I18n('cancel'),
          showCancelButton: true
        });
        if (value) {
          debug('用户确认关闭窗口');
          window.close();
        }
        return true;
      } catch (error) {
        debug('检查剩余密钥失败', {
          error: error
        });
        throwError(error, 'GiveawayHopper.checkLeftKey');
        return false;
      }
    }
  }
  const defaultTasksTemplate$1 = {
    steam: {
      groupLinks: [],
      curatorLinks: [],
      wishlistLinks: [],
      followLinks: []
    },
    youtube: {
      channelLinks: []
    }
  };
  const defaultTasks$1 = JSON.stringify(defaultTasksTemplate$1);
  class Prys extends Website {
    name='Prys';
    socialTasks=(() => JSON.parse(defaultTasks$1))();
    undoneTasks=(() => JSON.parse(defaultTasks$1))();
    buttons=[ 'doTask', 'undoTask', 'verifyTask' ];
    static test() {
      const {host: host} = window.location;
      const isMatch = host === 'prys.revadike.com';
      debug('检查网站匹配', {
        host: host,
        isMatch: isMatch
      });
      return isMatch;
    }
    async after() {
      try {
        debug('开始执行后续操作');
        if (!this.#checkLogin()) {
          debug('检查登录失败');
          echoLog({}).warning(I18n('checkLoginFailed'));
        }
        if (!await this.#checkLeftKey()) {
          debug('检查剩余密钥失败');
          echoLog({}).warning(I18n('checkLeftKeyFailed'));
        }
      } catch (error) {
        debug('后续操作失败', {
          error: error
        });
        throwError(error, 'Prys.after');
      }
    }
    init() {
      try {
        debug('开始初始化');
        const logStatus = echoLog({
          text: I18n('initing')
        });
        if ($('button:contains("Sign")').length > 0) {
          debug('需要登录');
          logStatus.warning(I18n('needLogin'));
          return false;
        }
        if (!this.#getGiveawayId()) {
          debug('获取抽奖ID失败');
          return false;
        }
        this.initialized = true;
        debug('初始化完成');
        logStatus.success();
        return true;
      } catch (error) {
        debug('初始化失败', {
          error: error
        });
        throwError(error, 'Prys.init');
        return false;
      }
    }
    async classifyTask(action) {
      try {
        debug('开始分类任务', {
          action: action
        });
        const logStatus = echoLog({
          text: I18n('getTasksInfo')
        });
        if (action === 'undo') {
          debug('恢复已保存的任务信息');
          this.socialTasks = GM_getValue(`prysTasks-${this.giveawayId}`)?.tasks || JSON.parse(defaultTasks$1);
        }
        const steps = $('#steps tbody tr');
        debug('找到任务步骤', {
          count: steps.length
        });
        for (let eq = 0; eq < steps.length; eq += 1) {
          if (steps.eq(eq).find('span:contains(Success)').length === 0) {
            debug('点击检查按钮', {
              step: eq
            });
            checkClick(eq);
          }
        }
        const pro = [];
        for (const step of steps) {
          const isSuccess = $(step).find('span:contains(Success)').length > 0;
          if (isSuccess && action === 'do') {
            debug('跳过已完成的任务');
            continue;
          }
          const appLink = $(step).find('a[href*=\'store.steampowered.com/app/\']').attr('href');
          if (appLink) {
            const taskType = $(step).find('a[href*=\'store.steampowered.com/app/\']').text().includes('wishlist') ? 'wishlistLinks' : 'followLinks';
            debug('添加 Steam 应用任务', {
              type: taskType,
              link: appLink
            });
            if (action === 'undo') {
              this.socialTasks.steam[taskType].push(appLink);
            }
            if (action === 'do') {
              this.undoneTasks.steam[taskType].push(appLink);
            }
            continue;
          }
          const curatorLink = $(step).find('a[href*=\'store.steampowered.com/curator/\']').attr('href');
          if (curatorLink) {
            debug('添加 Steam 鉴赏家任务', {
              link: curatorLink
            });
            if (action === 'undo') {
              this.socialTasks.steam.curatorLinks.push(curatorLink);
            }
            if (action === 'do') {
              this.undoneTasks.steam.curatorLinks.push(curatorLink);
            }
            continue;
          }
          const groupLink = $(step).find('a[href*=\'steamcommunity.com/groups/\']').attr('href');
          if (groupLink) {
            debug('添加 Steam 组任务', {
              link: groupLink
            });
            if (action === 'undo') {
              this.socialTasks.steam.groupLinks.push(groupLink);
            }
            if (action === 'do') {
              this.undoneTasks.steam.groupLinks.push(groupLink);
            }
            continue;
          }
          const gidLink = $(step).find('a[href*=\'steamcommunity.com/gid\']').attr('href');
          if (gidLink) {
            debug('处理 Steam GID 链接', {
              link: gidLink
            });
            pro.push(getRedirectLink(gidLink).then((finalUrl => {
              if (!finalUrl || !/^https?:\/\/steamcommunity\.com\/groups\//.test(finalUrl)) {
                debug('无效的 Steam 组链接', {
                  finalUrl: finalUrl
                });
                return false;
              }
              debug('添加 Steam 组任务（从 GID）', {
                link: finalUrl
              });
              if (action === 'undo') {
                this.socialTasks.steam.groupLinks.push(finalUrl);
              }
              if (action === 'do') {
                this.undoneTasks.steam.groupLinks.push(finalUrl);
              }
            })));
          }
        }
        await Promise.allSettled(pro);
        debug('任务分类完成');
        logStatus.success();
        this.undoneTasks = this.uniqueTasks(this.undoneTasks);
        this.socialTasks = this.uniqueTasks(this.socialTasks);
        if (window.DEBUG) {
          console.log('%cAuto-Task[Debug]:', 'color:blue', JSON.stringify(this));
        }
        GM_setValue(`prysTasks-${this.giveawayId}`, {
          tasks: this.socialTasks,
          time: (new Date).getTime()
        });
        return true;
      } catch (error) {
        debug('任务分类失败', {
          error: error
        });
        throwError(error, 'Prys.classifyTask');
        return false;
      }
    }
    async verifyTask() {
      try {
        debug('开始验证任务');
        const checks = $('#steps tbody a[id^=check]');
        if (checks.length === 0) {
          debug('没有需要验证的任务');
          echoLog({}).success(I18n('allTasksComplete'));
          return;
        }
        const pro = [];
        for (const check of checks) {
          const id = $(check).attr('id')?.match(/[\d]+/)?.[0];
          if (!id) {
            debug('跳过无效任务ID');
            continue;
          }
          const taskDes = $(check).parent()?.prev()?.html()?.trim();
          debug('验证任务', {
            id: id,
            taskDes: taskDes
          });
          const status = echoLog({
            text: `${I18n('verifyingTask')}${taskDes}...`
          });
          pro.push(new Promise((resolve => {
            this.#checkStep(id, resolve, status);
          })));
        }
        await Promise.all(pro);
        debug('所有任务验证完成');
        echoLog({}).success(I18n('allTasksComplete'));
      } catch (error) {
        debug('验证任务失败', {
          error: error
        });
        throwError(error, 'Prys.verifyTask');
      }
    }
    #getGiveawayId() {
      try {
        debug('开始获取抽奖ID');
        const giveawayId = window.location.search.match(/id=([\d]+)/)?.[1];
        if (giveawayId) {
          this.giveawayId = giveawayId;
          debug('获取抽奖ID成功', {
            giveawayId: giveawayId
          });
          return true;
        }
        debug('获取抽奖ID失败');
        echoLog({}).error(I18n('getFailed', 'GiveawayId'));
        return false;
      } catch (error) {
        debug('获取抽奖ID出错', {
          error: error
        });
        throwError(error, 'Prys.getGiveawayId');
        return false;
      }
    }
    async #checkLeftKey() {
      try {
        debug('检查剩余密钥');
        if (!globalOptions.other.checkLeftKey) {
          debug('跳过密钥检查');
          return true;
        }
        const leftKey = $('#header').text().match(/([\d]+).*?prize.*?left/)?.[1];
        debug('检查剩余密钥数量', {
          leftKey: leftKey
        });
        if (leftKey !== '0') {
          return true;
        }
        debug('没有剩余密钥，显示确认对话框');
        const {value: value} = await Swal.fire({
          icon: 'warning',
          title: I18n('notice'),
          text: I18n('noKeysLeft'),
          confirmButtonText: I18n('confirm'),
          cancelButtonText: I18n('cancel'),
          showCancelButton: true
        });
        if (value) {
          debug('用户确认关闭窗口');
          window.close();
        }
        return true;
      } catch (error) {
        debug('检查剩余密钥失败', {
          error: error
        });
        throwError(error, 'Prys.checkLeftKey');
        return false;
      }
    }
    #checkLogin() {
      try {
        debug('检查登录状态');
        if (!globalOptions.other.checkLogin) {
          debug('跳过登录检查');
          return true;
        }
        if ($('button:contains("Sign")').length > 0) {
          debug('未登录');
          echoLog({}).warning(I18n('needLogin'));
        }
        debug('登录检查完成');
        return true;
      } catch (error) {
        debug('检查登录失败', {
          error: error
        });
        throwError(error, 'Prys.checkLogin');
        return false;
      }
    }
    #checkStep(step, resolve, status) {
      let captcha = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      try {
        debug('开始检查步骤', {
          step: step,
          hasCaptcha: !!captcha
        });
        if (step !== 'captcha') {
          debug('更新步骤状态为检查中');
          $(`#check${step}`).replaceWith(`<span id="check${step}"><i class="fa fa-refresh fa-spin fa-fw"></i> Checking...</span>`);
        }
        debug('发送检查请求');
        $.post('/api/check_step', {
          step: step,
          id: getURLParameter('id'),
          'g-recaptcha-response': captcha
        }, (json => {
          resolve();
          debug('收到检查响应', {
            success: json.success
          });
          if (step !== 'captcha') {
            if (json.success) {
              debug('步骤检查成功');
              $(`#check${step}`).replaceWith(`<span class="text-success" id="check${step}"><i class="fa fa-check"></i> Success</span>`);
              status.success();
            } else {
              debug('步骤检查失败');
              $(`#check${step}`).replaceWith(`<a id="check${step}" href="javascript:checkStep(${step})"><i class="fa fa-question"></i> Check</a>`);
              status.error(json.response?.error || 'Error');
            }
          }
          if (!json.response) {
            return;
          }
          if (json.response.prize) {
            debug('获得奖品', {
              prize: json.response.prize
            });
            showAlert('success', `Here is your prize:<h1 role="button" align="middle" style="word-wrap: break-word;">${json.response.prize}</h2>`);
          }
          if (!json.response.captcha) {
            return;
          }
          debug('需要验证码');
          if (json.success) {
            showAlert('info', json.response.captcha);
          } else {
            showAlert('warning', json.response.captcha);
          }
          captchaCheck();
        })).fail((() => {
          resolve();
          debug('请求失败');
          $(`#check${step}`).replaceWith(`<a id="check${step}" href="javascript:checkStep(${step})"><i class="fa fa-question"></i> Check</a>`);
          status.error('Error:0');
        }));
      } catch (error) {
        debug('检查步骤失败', {
          error: error
        });
        throwError(error, 'prys.checkStep');
        resolve(false);
      }
    }
  }
  const defaultTasksTemplate = {
    extra: {
      visitLink: []
    }
  };
  const defaultTasks = JSON.stringify(defaultTasksTemplate);
  class FreeRu extends Website {
    name='FreeRu';
    socialTasks=(() => JSON.parse(defaultTasks))();
    undoneTasks=(() => JSON.parse(defaultTasks))();
    games;
    buttons=[ 'doTask', 'verifyTask' ];
    static test() {
      const isMatch = window.location.host === 'freeru.cc';
      debug('检查网站匹配', {
        host: window.location.host,
        isMatch: isMatch
      });
      return isMatch;
    }
    async init() {
      try {
        debug('初始化 FreeRu', {
          url: window.location.href
        });
        const logStatus = echoLog({
          text: I18n('initing')
        });
        debug('检测登录状态');
        if ($('.auth-button').length > 0) {
          debug('未登录，准备跳转到登录页面');
          $('.auth-button')[0].click();
          logStatus.warning(I18n('needLogin'));
          return false;
        }
        if (!await this.#checkLeftKey()) {
          debug('检查剩余密钥失败');
          echoLog({}).warning(I18n('checkLeftKeyFailed'));
        }
        this.initialized = true;
        logStatus.success();
        return true;
      } catch (error) {
        debug('初始化失败', {
          error: error
        });
        throwError(error, 'FreeRu.init');
        return false;
      }
    }
    async classifyTask(action) {
      try {
        debug('开始分类任务', {
          action: action
        });
        const logStatus = echoLog({
          text: I18n('getTasksInfo')
        });
        $('.giveaway-tasks__list a.task-card__button').toArray().forEach((elem => {
          this.undoneTasks.extra.visitLink.push(elem.getAttribute('href'));
        }));
        logStatus.success();
        this.undoneTasks = this.uniqueTasks(this.undoneTasks);
        debug('任务分类结果', {
          undoneTasks: this.undoneTasks
        });
        return true;
      } catch (error) {
        debug('任务分类失败', {
          error: error
        });
        throwError(error, 'FreeRu.classifyTask');
        return false;
      }
    }
    async extraDoTask(_ref24) {
      let {visitLink: visitLink} = _ref24;
      try {
        debug('执行额外任务', {
          visitLink: visitLink
        });
        const logStatus = echoLog({
          text: I18n('visitingLink')
        });
        const promises = visitLink.map((link => getRedirectLink(link)));
        const results = await Promise.allSettled(promises);
        logStatus.success();
        debug('额外任务执行结果', {
          results: results
        });
        return true;
      } catch (error) {
        debug('执行额外任务失败', {
          error: error
        });
        throwError(error, 'FreeRu.extraDoTask');
        return false;
      }
    }
    async verifyTask() {
      try {
        debug('开始验证任务');
        if (!this.initialized && !await this.init()) {
          debug('未初始化');
          return false;
        }
        const logStatus = echoLog({
          text: I18n('giveeClubVerifyNotice')
        });
        const tasks = $('.giveaway-tasks__list button.task-card__button').toArray();
        if (tasks.length === 0) {
          debug('任务列表为空', tasks);
          return false;
        }
        debug('开始验证任务列表', {
          tasks: tasks
        });
        for (const task of tasks) {
          task.click();
          await delay(1e3);
        }
        logStatus.success();
        echoLog({}).success(I18n('verifiedGleamTasks'));
        return false;
      } catch (error) {
        debug('验证任务失败', {
          error: error
        });
        throwError(error, 'FreeRu.verifyTask');
        return false;
      }
    }
    async #checkLeftKey() {
      try {
        debug('检查剩余密钥');
        if (!globalOptions.other.checkLeftKey) {
          debug('跳过密钥检查');
          return true;
        }
        const giveawayStatus = $('.giveaway-summary__info-text')[0].innerText?.match(/\d+/)?.[0];
        debug('Giveaway状态', {
          giveawayStatus: giveawayStatus
        });
        if (giveawayStatus === '0') {
          debug('没有剩余密钥，显示确认对话框');
          const {value: value} = await Swal.fire({
            icon: 'warning',
            title: I18n('notice'),
            text: I18n('giveawayEnded'),
            confirmButtonText: I18n('confirm'),
            cancelButtonText: I18n('cancel'),
            showCancelButton: true
          });
          if (value) {
            debug('用户确认关闭窗口');
            window.close();
          }
          return true;
        }
        return true;
      } catch (error) {
        debug('检查剩余密钥失败', {
          error: error
        });
        throwError(error, 'FreeRu.checkLeftKey');
        return false;
      }
    }
  }
  const Websites = [ FreeAnyWhere, GiveawaySu, Indiedb, Keyhub, Givekey, GiveeClub, OpiumPulses, Keylol, Opquests, Gleam, SweepWidget, Setting, History, GiveawayHopper, Prys, FreeRu ];
  const generateFormHtml = options => {
    debug('开始生成网站选项表单HTML', {
      options: options
    });
    const tableRows = Object.entries(options).map((_ref25 => {
      let [option, value] = _ref25;
      return `\n      <tr>\n        <td>${option}</td>\n        <td>\n          <input\n            class="editOption"\n            type="text"\n            name="${option}"\n            value="${value}"\n          />\n        </td>\n      </tr>\n    `;
    })).join('');
    const formHtml = `\n    <form id="websiteOptionsForm" class="auto-task-form">\n      <table class="auto-task-table">\n        <thead>\n          <tr>\n            <td>${I18n('option')}</td>\n            <td>${I18n('value')}</td>\n          </tr>\n        </thead>\n        <tbody>\n          ${tableRows}\n        </tbody>\n      </table>\n    </form>\n  `;
    debug('表单HTML生成完成');
    return formHtml;
  };
  const saveOptions = (website, options, formValues) => {
    debug('开始保存网站选项', {
      website: website,
      formValues: formValues
    });
    formValues.forEach((_ref26 => {
      let {name: name, value: value} = _ref26;
      options[name] = value;
      debug('更新选项值', {
        name: name,
        value: value
      });
    }));
    GM_setValue(`${website}Options`, options);
    debug('选项已保存到存储', {
      website: website
    });
    Swal.fire({
      title: I18n('changeWebsiteOptionsSuccess'),
      icon: 'success'
    });
  };
  const websiteOptions = async (website, options) => {
    try {
      debug('开始设置网站选项', {
        website: website
      });
      if (!website || typeof website !== 'string') {
        debug('无效的网站参数', {
          website: website
        });
        throw new Error('Invalid website parameter');
      }
      if (!options || typeof options !== 'object') {
        debug('无效的选项参数', {
          options: options
        });
        throw new Error('Invalid options parameter');
      }
      debug('显示选项编辑对话框');
      const result = await Swal.fire({
        title: I18n('websiteOptions'),
        html: generateFormHtml(options),
        showConfirmButton: true,
        confirmButtonText: I18n('save'),
        showCancelButton: true,
        cancelButtonText: I18n('close')
      });
      if (result.isConfirmed) {
        debug('用户确认保存选项');
        const form = document.getElementById('websiteOptionsForm');
        if (!form) {
          debug('未找到表单元素');
          throw new Error('Form element not found');
        }
        const formData = $('#websiteOptionsForm').serializeArray();
        debug('获取表单数据', {
          formData: formData
        });
        saveOptions(website, options, formData);
      } else {
        debug('用户取消保存选项');
      }
    } catch (error) {
      debug('设置网站选项时发生错误', {
        error: error
      });
      throwError(error, 'websiteOptions');
    }
  };
  const UPDATE_LINKS = {
    github: 'https://github.com/HCLonely/auto-task/raw/main/',
    jsdelivr: 'https://cdn.jsdelivr.net/gh/HCLonely/auto-task@main/',
    standby: 'https://auto-task.hclonely.com/'
  };
  const checkUpdate = async (updateLink, auto) => {
    try {
      debug('开始检查更新', {
        updateLink: updateLink,
        auto: auto
      });
      const checkUrl = `${updateLink}package.json?time=${Date.now()}`;
      debug('构建检查URL', {
        checkUrl: checkUrl
      });
      const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
        url: checkUrl,
        responseType: 'json',
        method: 'GET',
        timeout: 3e4
      });
      if (result === 'Success' && data?.response?.version) {
        debug('成功获取更新信息', {
          version: data.response.version
        });
        return data.response;
      }
      if (!auto) {
        const errorMessage = data?.response?.version ? `${I18n('checkUpdateFailed')}[${data?.statusText}(${data?.status})]` : `${I18n('checkUpdateFailed')}[${result}:${statusText}(${status})]`;
        debug('检查更新失败', {
          errorMessage: errorMessage
        });
        echoLog({}).error(errorMessage);
      } else {
        debug('自动检查更新失败', {
          result: result,
          statusText: statusText,
          status: status
        });
      }
      return false;
    } catch (error) {
      debug('检查更新发生错误', {
        error: error
      });
      throwError(error, 'checkUpdate');
      return false;
    }
  };
  const hasNewVersion = (currentVersion, remoteVersion) => {
    try {
      debug('开始比较版本号', {
        currentVersion: currentVersion,
        remoteVersion: remoteVersion
      });
      const [currentRealVersion] = currentVersion.split('-');
      const [remoteRealVersion, isPreview] = remoteVersion.split('-');
      if (isPreview && !globalOptions.other.receivePreview) {
        debug('不接收预览版本', {
          isPreview: isPreview
        });
        return false;
      }
      const currentVersionParts = currentRealVersion.split('.').map(Number);
      const remoteVersionParts = remoteRealVersion.split('.').map(Number);
      debug('版本号解析', {
        currentVersionParts: currentVersionParts,
        remoteVersionParts: remoteVersionParts
      });
      for (let i = 0; i < 3; i++) {
        if (remoteVersionParts[i] > currentVersionParts[i]) {
          debug('发现新版本', {
            position: i,
            current: currentVersion,
            remote: remoteVersion
          });
          return true;
        }
        if (remoteVersionParts[i] < currentVersionParts[i]) {
          debug('远程版本较旧', {
            position: i,
            current: currentVersion,
            remote: remoteVersion
          });
          return false;
        }
      }
      debug('版本号相同');
      return false;
    } catch (error) {
      debug('比较版本号时发生错误', {
        error: error
      });
      throwError(error, 'compareVersion');
      return false;
    }
  };
  const getUpdateLink = updateSource => {
    debug('获取更新链接', {
      updateSource: updateSource
    });
    const source = updateSource.toLowerCase();
    const link = UPDATE_LINKS[source] || UPDATE_LINKS.github;
    debug('选择的更新链接', {
      source: source,
      link: link
    });
    return link;
  };
  const showUpdateInfo = (packageData, currentVersion, updateLink) => {
    debug('准备显示更新信息', {
      currentVersion: currentVersion,
      newVersion: packageData.version
    });
    if (hasNewVersion(currentVersion, packageData.version)) {
      const scriptUrl = `${updateLink}dist/${GM_info.script.name}.user.js`;
      debug('发现新版本，显示更新通知', {
        scriptUrl: scriptUrl
      });
      echoLog({
        html: `<li><font>${I18n('newVersionNotice', packageData.version, scriptUrl)}</font></li>`
      });
      const changeList = packageData.change?.map((change => `<li>${change}</li>`)).join('') || '';
      debug('显示更新日志', {
        changeListLength: packageData.change?.length
      });
      echoLog({
        html: `<li>${I18n('updateText', packageData.version)}</li><ol class="update-text">${changeList}<li>${I18n('updateHistory')}</li></ol>`
      });
    } else {
      debug('当前已是最新版本');
    }
  };
  const updateChecker = async () => {
    try {
      debug('开始检查更新流程');
      const currentVersion = GM_info.script.version;
      const updateSource = globalOptions.other.autoUpdateSource;
      debug('当前配置', {
        currentVersion: currentVersion,
        updateSource: updateSource
      });
      let packageData = false;
      if ([ 'github', 'jsdelivr', 'standby' ].includes(updateSource.toLowerCase())) {
        debug('使用指定的更新源', {
          updateSource: updateSource
        });
        const updateLink = getUpdateLink(updateSource);
        packageData = await checkUpdate(updateLink, false);
      } else {
        debug('按优先级尝试不同的更新源');
        for (const source of [ 'github', 'jsdelivr', 'standby' ]) {
          debug('尝试更新源', {
            source: source
          });
          packageData = await checkUpdate(UPDATE_LINKS[source], true);
          if (packageData) {
            debug('成功获取更新信息', {
              source: source
            });
            break;
          }
        }
      }
      if (!packageData) {
        debug('所有更新源检查失败');
        echoLog({}).error(I18n('checkUpdateFailed'));
        return;
      }
      showUpdateInfo(packageData, currentVersion, getUpdateLink(updateSource));
    } catch (error) {
      debug('更新检查过程发生错误', {
        error: error
      });
      throwError(error, 'updateChecker');
    }
  };
  const byteToHex = [];
  for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 256).toString(16).slice(1));
  }
  function unsafeStringify(arr) {
    let offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
  }
  let getRandomValues;
  const rnds8 = new Uint8Array(16);
  function rng() {
    if (!getRandomValues) {
      if (typeof crypto === 'undefined' || !crypto.getRandomValues) {
        throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
      }
      getRandomValues = crypto.getRandomValues.bind(crypto);
    }
    return getRandomValues(rnds8);
  }
  const randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
  var native = {
    randomUUID: randomUUID
  };
  function v4(options, buf, offset) {
    if (native.randomUUID && true && !options) {
      return native.randomUUID();
    }
    options = options || {};
    const rnds = options.random ?? options.rng?.() ?? rng();
    if (rnds.length < 16) {
      throw new Error('Random bytes length must be >= 16');
    }
    rnds[6] = rnds[6] & 15 | 64;
    rnds[8] = rnds[8] & 63 | 128;
    return unsafeStringify(rnds);
  }
  try {
    consoleLogHook();
  } catch (error) {
    console.error('Auto-Task[Warning]: consoleLogHook 初始化失败', error);
  }
  window.STYLE = GM_addStyle(style + GM_getResourceText('style'));
  window.DEBUG = !!globalOptions.other?.debug;
  window.TRACE = !!globalOptions.other?.debug && typeof console.trace === 'function';
  const handleTwitchAuth = async () => {
    debug('开始处理Twitch认证');
    const authToken = Cookies.get('auth-token');
    const isLogin = !!Cookies.get('login');
    if (isLogin) {
      const authData = {
        authToken: authToken,
        clientVersion: window.__twilightBuildID,
        clientId: window.commonOptions?.headers?.['Client-ID'],
        deviceId: window.commonOptions?.headers?.['Device-ID'],
        clientSessionId: window.localStorage.local_storage_app_session_id.replace(/"/g, '')
      };
      GM_setValue('twitchAuth', authData);
      window.close();
      await Swal.fire('', I18n('closePageNotice'));
    } else {
      await Swal.fire('', I18n('needLogin'));
    }
  };
  const handleRedditAuth = async () => {
    debug('开始处理Reddit认证');
    const betaButton = $('#redesign-beta-optin-btn');
    if (betaButton.length > 0) {
      betaButton[0].click();
      return;
    }
    window.close();
    await Swal.fire('', I18n('closePageNotice'));
  };
  const handleDiscordAuth = async () => {
    debug('开始处理Discord认证');
    const LocalStorage = window.localStorage;
    const allLocalStorage = getAllLocalStorageAsObjects(LocalStorage);
    const discordAuth = allLocalStorage.token;
    if (discordAuth && discordAuth.length > 0) {
      const browserInfo = await browser.getInfo();
      GM_setValue('discordAuth', {
        auth: discordAuth,
        xSuperProperties: window.btoa(JSON.stringify({
          os: browserInfo.system,
          browser: browserInfo.browser,
          device: '',
          system_locale: browserInfo.language,
          ...allLocalStorage.deviceProperties || {},
          browser_user_agent: navigator.userAgent,
          browser_version: browserInfo.browserVersion,
          os_version: browserInfo.systemVersion,
          referrer: '',
          referring_domain: '',
          referrer_current: '',
          referring_domain_current: '',
          release_channel: 'stable',
          client_build_number: unsafeWindow.GLOBAL_ENV.BUILD_NUMBER,
          client_event_source: null,
          has_client_mods: false,
          client_launch_id: v4(),
          client_heartbeat_session_id: allLocalStorage.LAST_CLIENT_HEARTBEAT_SESSION?.uuid,
          client_app_state: 'focused'
        }))
      });
      window.close();
      Swal.fire('', I18n('closePageNotice'));
    } else {
      Swal.fire({
        text: I18n('getDiscordAuthFailed'),
        icon: 'error'
      });
    }
  };
  const handleSteamStoreAuth = async () => {
    debug('开始处理Steam商店认证');
    const storeSessionID = document.body.innerHTML.match(/g_sessionID = "(.+?)";/)?.[1];
    if (storeSessionID) {
      GM_deleteValue('ATv4_updateStoreAuth');
      GM_setValue('steamStoreAuth', {
        storeSessionID: storeSessionID
      });
      window.close();
      await Swal.fire('', I18n('closePageNotice'));
    } else {
      await Swal.fire({
        title: 'Error: Get "sessionID" failed',
        icon: 'error'
      });
    }
  };
  const handleSteamCommunityAuth = async () => {
    debug('开始处理Steam社区认证');
    const steam64Id = document.body.innerHTML.match(/g_steamID = "(.+?)";/)?.[1];
    const communitySessionID = document.body.innerHTML.match(/g_sessionID = "(.+?)";/)?.[1];
    if (steam64Id && communitySessionID) {
      GM_deleteValue('ATv4_updateCommunityAuth');
      GM_setValue('steamCommunityAuth', {
        steam64Id: steam64Id,
        communitySessionID: communitySessionID
      });
      window.close();
      await Swal.fire('', I18n('closePageNotice'));
    } else {
      setTimeout((async () => {
        await Swal.fire({
          title: 'Error: Get "sessionID" failed',
          icon: 'error'
        });
      }), 3e3);
    }
  };
  const initializeUI = website => {
    debug('初始化UI元素', {
      website: website.name
    });
    const $body = $('body');
    $body.append(`\n    <div id="auto-task-info"\n        style="display:${globalOptions.other.defaultShowLog ? 'block' : 'none'};\n                ${globalOptions.position.logSideX}:${globalOptions.position.logDistance.split(',')[0]}px;\n                ${globalOptions.position.logSideY}:${globalOptions.position.logDistance.split(',')[1]}px;">\n    </div>\n    <div id="auto-task-buttons"\n        style="display:${globalOptions.other.defaultShowButton ? 'block' : 'none'};\n                ${globalOptions.position.buttonSideX}:${globalOptions.position.buttonDistance.split(',')[0]}px;\n                ${globalOptions.position.buttonSideY}:${globalOptions.position.buttonDistance.split(',')[1]}px;">\n    </div>\n    <div class="show-button-div"\n        style="display:${globalOptions.other.defaultShowButton ? 'none' : 'block'};\n                ${globalOptions.position.showButtonSideX}:${globalOptions.position.showButtonDistance.split(',')[0]}px;\n                ${globalOptions.position.showButtonSideY}:${globalOptions.position.showButtonDistance.split(',')[1]}px;">\n      <a class="auto-task-website-btn"\n        href="javascript:void(0);"\n        target="_self"\n        title="${I18n('showButton')}"> </a>\n    </div>\n  `);
    const $autoTaskInfo = $('#auto-task-info');
    const $autoTaskButtons = $('#auto-task-buttons');
    const $showButtonDiv = $('div.show-button-div');
    $showButtonDiv.on('click', (() => {
      $autoTaskButtons.show();
      $showButtonDiv.hide();
    }));
    if (website.buttons && $autoTaskButtons.children().length === 0) {
      $autoTaskButtons.addClass(`${website.name}-buttons`);
      for (const button of website.buttons) {
        if (website[button]) {
          const btnElement = $(`<p><a class="auto-task-website-btn ${website.name}-button" href="javascript:void(0);" target="_self">${I18n(button)}</a></p>`);
          btnElement.find('a.auto-task-website-btn').on('click', (() => {
            website[button]();
          }));
          $autoTaskButtons.append(btnElement);
        }
      }
    }
    const hideButtonElement = $(`<p><a class="auto-task-website-btn ${website.name}-button" href="javascript:void(0);" target="_self">${I18n('hideButton')}</a></p>`);
    hideButtonElement.find('a.auto-task-website-btn').on('click', (() => {
      $autoTaskButtons.hide();
      $showButtonDiv.show();
    }));
    const toggleLogElement = $(`<p><a id="toggle-log" class="auto-task-website-btn ${website.name}-button" href="javascript:void(0);" target="_self" data-status="${globalOptions.other.defaultShowLog ? 'show' : 'hide'}">${globalOptions.other.defaultShowLog ? I18n('hideLog') : I18n('showLog')}</a></p>`);
    const toggleLog = () => {
      const $toggleLog = $('#toggle-log');
      const status = $toggleLog.attr('data-status');
      if (status === 'show') {
        $autoTaskInfo.hide();
        $toggleLog.attr('data-status', 'hide').text(I18n('showLog'));
      } else {
        $autoTaskInfo.show();
        $toggleLog.attr('data-status', 'show').text(I18n('hideLog'));
      }
    };
    toggleLogElement.find('a.auto-task-website-btn').on('click', toggleLog);
    $autoTaskButtons.append(hideButtonElement).append(toggleLogElement);
    if (website.options) {
      GM_registerMenuCommand(I18n('changeWebsiteOptions'), (() => {
        websiteOptions(website.name, website.options);
      }));
    }
  };
  const initializeHotkeys = website => {
    debug('初始化热键', {
      website: website.name
    });
    keyboardJS.bind(globalOptions.hotKey.doTaskKey, (() => {
      if (website.doTask) {
        website.doTask();
      }
    }));
    keyboardJS.bind(globalOptions.hotKey.undoTaskKey, (() => {
      if (website.undoTask) {
        website.undoTask();
      }
    }));
    keyboardJS.bind(globalOptions.hotKey.toggleLogKey, (() => {
      const $toggleLog = $('#toggle-log');
      const status = $toggleLog.attr('data-status');
      const $autoTaskInfo = $('#auto-task-info');
      if (status === 'show') {
        $autoTaskInfo.hide();
        $toggleLog.attr('data-status', 'hide').text(I18n('showLog'));
      } else {
        $autoTaskInfo.show();
        $toggleLog.attr('data-status', 'show').text(I18n('hideLog'));
      }
    }));
  };
  const checkSteamASFStatus = async () => {
    debug('检查Steam ASF状态');
    if (!globalOptions.ASF.AsfEnabled || !globalOptions.ASF.AsfIpcUrl || !globalOptions.ASF.AsfIpcPassword) {
      return;
    }
    const stopPlayTime = GM_getValue('stopPlayTime', 0) || 0;
    if (stopPlayTime === 0 || stopPlayTime >= Date.now()) {
      return;
    }
    const stopPlayTimeMinutes = Math.floor((Date.now() - stopPlayTime) / 6e4);
    const {value: value} = await Swal.fire({
      title: I18n('stopPlayTimeTitle'),
      text: I18n('stopPlayTimeText', stopPlayTimeMinutes.toString()),
      icon: 'warning',
      confirmButtonText: I18n('confirm'),
      cancelButtonText: I18n('cancel'),
      showCancelButton: true
    });
    if (!value) {
      return;
    }
    let steamASF = new SteamASF(globalOptions.ASF);
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
      steamASF = null;
    }
  };
  const checkVersionAndNotice = () => {
    debug('检查版本和通知');
    const {scriptHandler: scriptHandler} = GM_info;
    if (scriptHandler !== 'Tampermonkey') {
      debug('未知脚本管理器', {
        scriptHandler: scriptHandler
      });
      echoLog({}).warning(I18n('unknownScriptHandler'));
      return;
    }
    const [v1, v2] = GM_info.version?.split('.') || [];
    if (!(parseInt(v1, 10) >= 5 && parseInt(v2, 10) >= 2)) {
      echoLog({}).error(I18n('versionNotMatched'));
    }
    if (!GM_getValue('notice')) {
      Swal.fire({
        title: I18n('swalNotice'),
        icon: 'warning'
      }).then((() => {
        GM_openInTab(I18n('noticeLink'), {
          active: true
        });
        GM_setValue('notice', (new Date).getTime());
      }));
      echoLog({
        html: `<li><font class="warning">${I18n('echoNotice', I18n('noticeLink'))}</font></li>`
      }).font?.find('a').on('click', (() => {
        GM_setValue('notice', (new Date).getTime());
      }));
    }
  };
  const loadScript = async () => {
    debug('主程序入口 loadScript 开始');
    if (window.name === 'ATv4_twitchAuth' && window.location.hostname === 'www.twitch.tv') {
      debug('检测到Twitch认证窗口');
      await handleTwitchAuth();
      return;
    }
    if (window.name === 'ATv4_redditAuth' && window.location.hostname === 'www.reddit.com') {
      debug('检测到Reddit认证窗口');
      await handleRedditAuth();
      return;
    }
    let website;
    for (const Website of Websites) {
      if (Website.test()) {
        debug('识别到支持的网站', {
          website: Website.name
        });
        website = new Website;
        break;
      }
    }
    if (!website) {
      debug('未识别到支持的网站，脚本停止加载');
      console.log('%c%s', 'color:#ff0000', 'Auto-Task[Warning]: 脚本停止加载，当前网站不支持！');
      return;
    }
    if (website.before) {
      debug('执行网站 before 钩子');
      await website.before();
    }
    initializeUI(website);
    initializeHotkeys(website);
    if (website.after) {
      debug('执行网站 after 钩子');
      await website.after();
    }
    if (website.name !== 'Setting') {
      debug('注册全局菜单命令');
      GM_registerMenuCommand(I18n('changeGlobalOptions'), (() => {
        changeGlobalOptions('swal');
      }));
      GM_registerMenuCommand(I18n('settingPage'), (() => {
        GM_openInTab('https://auto-task.hclonely.com/setting.html', {
          active: true
        });
      }));
    }
    debug('脚本加载完成');
    console.log('%c%s', 'color:#1bbe1a', 'Auto-Task[Load]: 脚本加载完成');
    if (window.DEBUG) {
      echoLog({}).warning(I18n('debugModeNotice'));
    }
    await checkSteamASFStatus();
    checkVersionAndNotice();
    updateChecker();
  };
  try {
    debug('主程序入口开始', {
      hostname: window.location.hostname,
      windowName: window.name
    });
    if (window.location.hostname === 'discord.com') {
      if (window.name === 'ATv4_discordAuth') {
        debug('检测到Discord认证窗口');
        handleDiscordAuth();
      } else {
        debug('检测到Discord主站');
        const discordAuth = window.localStorage?.getItem('token')?.replace(/^"|"$/g, '');
        if (discordAuth && discordAuth.length > 0) {
          debug('获取到Discord认证token');
          GM_setValue('discordAuth', {
            auth: discordAuth
          });
        }
      }
    } else if (window.location.hostname === 'opquests.com') {
      debug('检测到opquests.com，加载主脚本');
      loadScript();
    } else if ((window.name === 'ATv4_updateStoreAuth' || GM_getValue('ATv4_updateStoreAuth')) && window.location.host === 'store.steampowered.com') {
      debug('检测到Steam商店认证窗口');
      $((() => {
        if ($('[data-miniprofile]').length === 0) {
          return;
        }
        handleSteamStoreAuth();
      }));
    } else if ((window.name === 'ATv4_updateCommunityAuth' || GM_getValue('ATv4_updateCommunityAuth')) && window.location.host === 'steamcommunity.com') {
      debug('检测到Steam社区认证窗口');
      $((() => {
        handleSteamCommunityAuth();
      }));
    } else {
      if (window.location.hostname === 'key-hub.eu') {
        debug('检测到key-hub.eu，设置全局变量');
        unsafeWindow.keyhubtracker = 1;
        unsafeWindow.gaData = {};
      }
      debug('加载主脚本');
      $(loadScript);
    }
  } catch (error) {
    debug('主程序入口发生异常', {
      error: error
    });
  }
})(Swal, Cookies, browser, util, dayjs, keyboardJS);
