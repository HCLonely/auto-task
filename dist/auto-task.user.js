// ==UserScript==
// @name               auto-task
// @namespace          auto-task
// @version            5.2.2
// @description        自动完成 Freeanywhere，Giveawaysu，GiveeClub，Givekey，Gleam，Indiedb，keyhub，OpiumPulses，Opquests，SweepWidget 等网站的任务。
// @description:en     Automatically complete the tasks of FreeAnyWhere, GiveawaySu, GiveeClub, Givekey, Gleam, Indiedb, keyhub, OpiumPulses, Opquests, SweepWidget websites.
// @author             HCLonely
// @license            MIT
// @run-at             document-start
// @homepage           https://auto-task-doc.js.org/
// @supportURL         https://github.com/HCLonely/auto-task/issues
// @updateURL          https://github.com/HCLonely/auto-task/raw/main/dist/auto-task.user.js
// @installURL         https://github.com/HCLonely/auto-task/raw/main/dist/auto-task.user.js
// @downloadURL        https://github.com/HCLonely/auto-task/raw/main/dist/auto-task.user.js
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
// @require            https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.js
// @resource           autoTaskStyle https://cdn.jsdelivr.net/gh/HCLonely/auto-task@v5.2.2/dist/auto-task.css
// @resource           style https://cdn.jsdelivr.net/npm/sweetalert2@11.3.5/dist/sweetalert2.min.css
// @require            https://cdn.jsdelivr.net/npm/node-inspect-extracted@3.1.0/dist/inspect.min.js
// @require            https://cdn.jsdelivr.net/npm/browser-tool@1.3.2/dist/browser.min.js
// @require            https://cdn.jsdelivr.net/gh/HCLonely/auto-task@v5.2.2/dist/auto-task.modules.js
// @require            https://cdn.jsdelivr.net/gh/HCLonely/auto-task@v5.2.2/dist/auto-task.website.js

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
const neededDependencies = ['jQuery', 'Swal', 'util', 'browser'];

const missingDependencies = neededDependencies.filter(dependency => typeof window[dependency] === 'undefined');
if (typeof AutoTaskModules === 'undefined') missingDependencies.push('AutoTaskModules');
if (typeof AutoTaskWebsite === 'undefined') missingDependencies.push('AutoTaskWebsite');

if (missingDependencies.length > 0) {
  console.log('%c%s', 'color:red', `[Auto-Task] 脚本加载失败，缺少的依赖：${missingDependencies.join(', ')}`);
  if (confirm(`[Auto-Task] 脚本依赖加载失败，请刷新重试或安装全依赖版本，是否前往安装全依赖版本？\n缺少的依赖：${missingDependencies.join(', ')}`)) {
    GM_openInTab('https://github.com/HCLonely/auto-task/raw/main/dist/auto-task.all.user.js', { active: true });
  }
}


(function(globalOptions, Swal, steam, twitch, moduleBridge, index, websiteOptions, __, globalOptionsEdit, browser, debug, echoLog, SteamASF) {
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
      masked = masked.replace(pattern, ((match, ...groups) => {
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
    console.log = function(...args) {
      const maskedArgs = maskArgs(args);
      window.__allLogs.push(maskedArgs);
      originalLog.apply(console, maskedArgs);
    };
  };
  const bindHotkey = (shortcut, callback, target = document) => {
    const normalized = shortcut.toLowerCase().trim().replace(/\+\s*\+$/, '+ plus');
    const parts = (normalized === '+' ? [ 'plus' ] : normalized.split(/\s*\+\s*/)).map((part => part.trim()));
    const aliases = {
      control: 'ctrl',
      command: 'meta',
      cmd: 'meta',
      option: 'alt',
      esc: 'escape',
      space: ' ',
      plus: '+'
    };
    const keys = parts.map((part => aliases[part] || part));
    const modifiers = [ 'alt', 'ctrl', 'shift', 'meta' ];
    const mainKeys = keys.filter((key => !modifiers.some((modifier => modifier === key))));
    if (mainKeys.length !== 1 || !mainKeys[0]) {
      return () => {};
    }
    const [key] = mainKeys;
    const listener = event => {
      if (event.repeat || event.isComposing) {
        return;
      }
      if (modifiers.some((modifier => event[`${modifier}Key`] !== keys.includes(modifier)))) {
        return;
      }
      const pressed = /^[a-z]$/.test(key) && /^Key[A-Z]$/.test(event.code) ? event.code.slice(3).toLowerCase() : event.key.toLowerCase();
      if (pressed === key) {
        callback();
      }
    };
    target.addEventListener('keydown', listener);
    return () => target.removeEventListener('keydown', listener);
  };
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
      manager: `${GM_info.scriptHandler} ${GM_info.version}`,
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
    debug.debug('GitHub Issue参数构建完成', params);
    return params;
  };
  const generateGithubLink = async (name, errorStack, envInfo) => {
    debug.debug('开始生成GitHub Issue链接');
    const params = new URLSearchParams(await buildGithubIssueParams(name, errorStack, envInfo));
    const link = `https://github.com/HCLonely/auto-task/issues/new?${params.toString()}`;
    debug.debug('GitHub Issue链接生成完成', {
      link: link
    });
    return link;
  };
  const logError = (name, errorStack) => {
    debug.debug('记录错误日志', {
      name: name
    });
    console.log('%c%s', 'color:white;background:red', `Auto-Task[Error]: ${name}\n${errorStack}`);
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
    const {isConfirmed: isConfirmed} = await Swal.fire({
      title: __.default('errorReport'),
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: __.default('toGithub'),
      cancelButtonText: __.default('close')
    });
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
    if (options.responseType === 'json' && data?.response && typeof data.response !== 'object') {
      debug.debug('尝试解析JSON响应');
      try {
        data.response = JSON.parse(data.responseText);
        debug.debug('JSON解析成功');
      } catch {
        debug.debug('JSON解析失败，保持原始响应');
      }
    }
  };
  const httpRequest = async (options, times = 0) => {
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
        const requestObj = {
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
          },
          ...options,
          responseType: options.dataType || options.responseType
        };
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
      debug.debug('开始检查更新', {
        updateLink: updateLink,
        auto: auto
      });
      const checkUrl = `${updateLink}package.json?time=${Date.now()}`;
      debug.debug('构建检查URL', {
        checkUrl: checkUrl
      });
      const {result: result, statusText: statusText, status: status, data: data} = await httpRequest({
        url: checkUrl,
        responseType: 'json',
        method: 'GET',
        timeout: 3e4
      });
      if (result === 'Success' && data?.response?.version) {
        debug.debug('成功获取更新信息', {
          version: data.response.version
        });
        return data.response;
      }
      if (!auto) {
        const errorMessage = data?.response?.version ? `${__.default('checkUpdateFailed')}[${data?.statusText}(${data?.status})]` : `${__.default('checkUpdateFailed')}[${result}:${statusText}(${status})]`;
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
      const [currentRealVersion] = currentVersion.split('-');
      const [remoteRealVersion, isPreview] = remoteVersion.split('-');
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
      const scriptUrl = `${updateLink}dist/${GM_info.script.name}.user.js`;
      debug.debug('发现新版本，显示更新通知', {
        scriptUrl: scriptUrl
      });
      echoLog.default({
        html: `<li><font>${__.default('newVersionNotice', packageData.version, scriptUrl)}</font></li>`
      });
      const changeList = packageData.change?.map((change => `<li>${change}</li>`)).join('') || '';
      debug.debug('显示更新日志', {
        changeListLength: packageData.change?.length
      });
      echoLog.default({
        html: `<li>${__.default('updateText', packageData.version)}</li><ol class="update-text">${changeList}<li>${__.default('updateHistory')}</li></ol>`
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
  try {
    const style = GM_getResourceText('autoTaskStyle');
    if (!style?.trim()) {
      throw new Error('Auto-Task CSS resource is empty');
    }
    window.STYLE = GM_addStyle(style + GM_getResourceText('style'));
  } catch (error) {
    console.error('Auto-Task[Error]: 样式初始化失败，请重新安装脚本或使用全资源版本 (.all.user.js)', error);
    throw error;
  }
  window.DEBUG = !!globalOptions.globalOptions.other?.debug;
  window.TRACE = !!globalOptions.globalOptions.other?.debug && typeof console.trace === 'function';
  const initializeUI = website => {
    debug.debug('初始化UI元素', {
      website: website.name
    });
    const $body = $('body');
    $body.append(`\n    <div id="auto-task-info"\n        style="display:${globalOptions.globalOptions.other.defaultShowLog ? 'block' : 'none'};\n                ${globalOptions.globalOptions.position.logSideX}:${globalOptions.globalOptions.position.logDistance.split(',')[0]}px;\n                ${globalOptions.globalOptions.position.logSideY}:${globalOptions.globalOptions.position.logDistance.split(',')[1]}px;\n                opacity: 0;\n                animation: fadeInUp 0.6s ease forwards;">\n    </div>\n    <div id="auto-task-buttons"\n        style="display:${globalOptions.globalOptions.other.defaultShowButton ? 'block' : 'none'};\n                ${globalOptions.globalOptions.position.buttonSideX}:${globalOptions.globalOptions.position.buttonDistance.split(',')[0]}px;\n                ${globalOptions.globalOptions.position.buttonSideY}:${globalOptions.globalOptions.position.buttonDistance.split(',')[1]}px;\n                opacity: 0;\n                animation: fadeInUp 0.6s ease 0.2s forwards;">\n    </div>\n    <div class="show-button-div"\n        style="display:${globalOptions.globalOptions.other.defaultShowButton ? 'none' : 'block'};\n                ${globalOptions.globalOptions.position.showButtonSideX}:${globalOptions.globalOptions.position.showButtonDistance.split(',')[0]}px;\n                ${globalOptions.globalOptions.position.showButtonSideY}:${globalOptions.globalOptions.position.showButtonDistance.split(',')[1]}px;\n                opacity: 0;\n                animation: fadeInScale 0.5s ease 0.4s forwards;">\n      <a class="auto-task-website-btn show-button-link"\n        href="javascript:void(0);"\n        target="_self"\n        title="${__.default('showButton')}">\n      </a>\n    </div>\n  `);
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
          const btnElement = $(`<p><a class="auto-task-website-btn ${website.name}-button" href="javascript:void(0);" target="_self">${__.default(button)}</a></p>`);
          btnElement.find('a.auto-task-website-btn').on('click', (() => {
            website[button]();
          }));
          $autoTaskButtons.append(btnElement);
        }
      }
    }
    const hideButtonElement = $(`<p><a class="auto-task-website-btn ${website.name}-button" href="javascript:void(0);" target="_self">${__.default('hideButton')}</a></p>`);
    hideButtonElement.find('a.auto-task-website-btn').on('click', (() => {
      $autoTaskButtons.hide();
      $showButtonDiv.show();
    }));
    const toggleLogElement = $(`<p><a id="toggle-log" class="auto-task-website-btn ${website.name}-button" href="javascript:void(0);" target="_self" data-status="${globalOptions.globalOptions.other.defaultShowLog ? 'show' : 'hide'}">${globalOptions.globalOptions.other.defaultShowLog ? __.default('hideLog') : __.default('showLog')}</a></p>`);
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
    bindHotkey(globalOptions.globalOptions.hotKey.doTaskKey, (() => {
      if (website.doTask) {
        website.doTask();
      }
    }));
    bindHotkey(globalOptions.globalOptions.hotKey.undoTaskKey, (() => {
      if (website.undoTask) {
        website.undoTask();
      }
    }));
    bindHotkey(globalOptions.globalOptions.hotKey.toggleLogKey, (() => {
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
    const {value: value} = await Swal.fire({
      title: __.default('stopPlayTimeTitle'),
      text: __.default('stopPlayTimeText', stopPlayTimeMinutes.toString()),
      icon: 'warning',
      confirmButtonText: __.default('confirm'),
      cancelButtonText: __.default('cancel'),
      showCancelButton: true
    });
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
      steamASF?.dispose();
      steamASF = null;
    }
  };
  const checkVersionAndNotice = () => {
    debug.debug('检查版本和通知');
    const {scriptHandler: scriptHandler} = GM_info;
    if (scriptHandler === 'Tampermonkey') {
      const [v1, v2] = GM_info.version?.split('.') || [];
      if (!(parseInt(v1, 10) >= 5 && parseInt(v2, 10) >= 2)) {
        echoLog.default({}).error(__.default('versionNotMatched'));
      }
    } else if (scriptHandler !== 'Violentmonkey') {
      const [v1, v2] = GM_info.version?.split('.') || [];
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
      Swal.fire({
        title: __.default('swalNotice'),
        icon: 'warning'
      }).then((() => {
        GM_openInTab(__.default('noticeLink'), {
          active: true
        });
        GM_setValue('notice', (new Date).getTime());
      }));
      echoLog.default({
        html: `<li><font class="warning">${__.default('echoNotice', __.default('noticeLink'))}</font></li>`
      }).font?.find('a').on('click', (() => {
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
})(AutoTaskWebsite.globalOptions, Swal, AutoTaskModules.steam, AutoTaskModules.twitch, AutoTaskWebsite.moduleBridge, AutoTaskWebsite, AutoTaskWebsite.options, AutoTaskWebsite.i18n, AutoTaskWebsite.globalOptionsEdit, browser, AutoTaskWebsite.debug, AutoTaskWebsite.echoLog, AutoTaskWebsite.SteamASF);
