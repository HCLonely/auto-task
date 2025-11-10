/*
 * @Author       : HCLonely
 * @Date         : 2021-10-26 15:44:54
 * @LastEditTime : 2025-10-15 10:21:46
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/index.ts
 * @Description  : 入口文件
 */

import consoleLogHook from './scripts/tools/consoleLogHook';
import { globalOptions } from './scripts/globalOptions';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import style from './style/auto-task.scss';
import { Websites } from './scripts/website/index';
import websiteOptions from './scripts/website/options';
import __ from './scripts/tools/i18n';
import { changeGlobalOptions } from './scripts/globalOptionsEdit';
import keyboardJS from 'keyboardjs';
import updateChecker from './scripts/updateChecker';
import echoLog from './scripts/echoLog';
import SteamASF from './scripts/social/SteamASF';
import { debug } from './scripts/tools/debug';
import { getAllLocalStorageAsObjects } from './scripts/tools/tools';
import browser from 'browser-tool';
import { v4 as uuidv4 } from 'uuid';
// import fawExtension from './scripts/website/freeanywhereExtension';

try {
  consoleLogHook();
} catch (error) {
  console.error('Auto-Task[Warning]: consoleLogHook 初始化失败', error);
}

window.STYLE = GM_addStyle(style + GM_getResourceText('style'));
window.DEBUG = !!globalOptions.other?.debug;
window.TRACE = !!globalOptions.other?.debug && typeof console.trace === 'function';

// 处理Twitch认证
const handleTwitchAuth = async (): Promise<void> => {
  debug('开始处理Twitch认证');
  const authToken = Cookies.get('auth-token');
  const isLogin = !!Cookies.get('login');

  if (isLogin) {
    const authData: AuthData = {
      authToken,
      clientVersion: window.__twilightBuildID,
      clientId: window.commonOptions?.headers?.['Client-ID'],
      deviceId: window.commonOptions?.headers?.['Device-ID'],
      clientSessionId: window.localStorage.local_storage_app_session_id.replace(/"/g, '')
    };
    GM_setValue('twitchAuth', authData);
    window.close();
    await Swal.fire('', __('closePageNotice'));
  } else {
    await Swal.fire('', __('needLogin'));
  }
};

// 处理Reddit认证
const handleRedditAuth = async (): Promise<void> => {
  debug('开始处理Reddit认证');
  const betaButton = $('#redesign-beta-optin-btn');
  if (betaButton.length > 0) {
    betaButton[0].click();
    return;
  }
  window.close();
  await Swal.fire('', __('closePageNotice'));
};

// 处理Discord认证
const handleDiscordAuth = async (): Promise<void> => {
  debug('开始处理Discord认证');
  const LocalStorage = window.localStorage;
  const allLocalStorage = getAllLocalStorageAsObjects(LocalStorage);
  const discordAuth = allLocalStorage.token as string;

  if (discordAuth && discordAuth.length > 0) {
    const browserInfo = await browser.getInfo();
    GM_setValue('discordAuth', {
      auth: discordAuth,
      xSuperProperties: window.btoa(JSON.stringify({
        os: browserInfo.system,
        browser: browserInfo.browser,
        device: '',
        system_locale: browserInfo.language,
        ...((allLocalStorage.deviceProperties as Record<string, string>) || {}),
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
        client_launch_id: uuidv4(),
        client_heartbeat_session_id: (allLocalStorage.LAST_CLIENT_HEARTBEAT_SESSION as Record<string, string>)?.uuid,
        client_app_state: 'focused'
      }))
    });
    window.close();
    Swal.fire('', __('closePageNotice'));
  } else {
    Swal.fire({
      text: __('getDiscordAuthFailed'),
      icon: 'error'
    });
  }
};

// 处理Steam商店认证
const handleSteamStoreAuth = async (): Promise<void> => {
  debug('开始处理Steam商店认证');
  const storeSessionID = document.body.innerHTML.match(/g_sessionID = "(.+?)";/)?.[1];

  if (storeSessionID) {
    GM_deleteValue('ATv4_updateStoreAuth');
    GM_setValue('steamStoreAuth', { storeSessionID });
    window.close();
    await Swal.fire('', __('closePageNotice'));
  } else {
    await Swal.fire({
      title: 'Error: Get "sessionID" failed',
      icon: 'error'
    });
  }
};

// 处理Steam社区认证
const handleSteamCommunityAuth = async (): Promise<void> => {
  debug('开始处理Steam社区认证');
  const steam64Id = document.body.innerHTML.match(/g_steamID = "(.+?)";/)?.[1];
  const communitySessionID = document.body.innerHTML.match(/g_sessionID = "(.+?)";/)?.[1];

  if (steam64Id && communitySessionID) {
    GM_deleteValue('ATv4_updateCommunityAuth');
    GM_setValue('steamCommunityAuth', { steam64Id, communitySessionID });
    window.close();
    await Swal.fire('', __('closePageNotice'));
  } else {
    setTimeout(async () => {
      await Swal.fire({
        title: 'Error: Get "sessionID" failed',
        icon: 'error'
      });
    }, 3000);
  }
};

// 初始化UI元素
const initializeUI = (website: Website): void => {
  debug('初始化UI元素', { website: website.name });
  const $body = $('body');
  $body.append(`
    <div id="auto-task-info"
        style="display:${globalOptions.other.defaultShowLog ? 'block' : 'none'};
                ${globalOptions.position.logSideX}:${globalOptions.position.logDistance.split(',')[0]}px;
                ${globalOptions.position.logSideY}:${globalOptions.position.logDistance.split(',')[1]}px;">
    </div>
    <div id="auto-task-buttons"
        style="display:${globalOptions.other.defaultShowButton ? 'block' : 'none'};
                ${globalOptions.position.buttonSideX}:${globalOptions.position.buttonDistance.split(',')[0]}px;
                ${globalOptions.position.buttonSideY}:${globalOptions.position.buttonDistance.split(',')[1]}px;">
    </div>
    <div class="show-button-div"
        style="display:${globalOptions.other.defaultShowButton ? 'none' : 'block'};
                ${globalOptions.position.showButtonSideX}:${globalOptions.position.showButtonDistance.split(',')[0]}px;
                ${globalOptions.position.showButtonSideY}:${globalOptions.position.showButtonDistance.split(',')[1]}px;">
      <a class="auto-task-website-btn"
        href="javascript:void(0);"
        target="_self"
        title="${__('showButton')}"> </a>
    </div>
  `);

  const $autoTaskInfo = $('#auto-task-info');
  const $autoTaskButtons = $('#auto-task-buttons');
  const $showButtonDiv = $('div.show-button-div');

  $showButtonDiv.on('click', () => {
    $autoTaskButtons.show();
    $showButtonDiv.hide();
  });

  if (website.buttons && $autoTaskButtons.children().length === 0) {
    $autoTaskButtons.addClass(`${website.name}-buttons`);

    for (const button of website.buttons) {
      // const buttonMethod = website[button] as (() => void) | undefined;
      if (website[button]) {
        const btnElement = $(`<p><a class="auto-task-website-btn ${website.name}-button" href="javascript:void(0);" target="_self">${__(button)}</a></p>`);
        btnElement.find('a.auto-task-website-btn').on('click', () => { website[button](); });
        $autoTaskButtons.append(btnElement);
      }
    }
  }

  const hideButtonElement = $(`<p><a class="auto-task-website-btn ${website.name}-button" href="javascript:void(0);" target="_self">${__('hideButton')}</a></p>`);
  hideButtonElement.find('a.auto-task-website-btn').on('click', () => {
    $autoTaskButtons.hide();
    $showButtonDiv.show();
  });

  const toggleLogElement = $(`<p><a id="toggle-log" class="auto-task-website-btn ${website.name}-button" href="javascript:void(0);" target="_self" data-status="${globalOptions.other.defaultShowLog ? 'show' : 'hide'}">${globalOptions.other.defaultShowLog ? __('hideLog') : __('showLog')}</a></p>`);

  const toggleLog = () => {
    const $toggleLog = $('#toggle-log');
    const status = $toggleLog.attr('data-status');

    if (status === 'show') {
      $autoTaskInfo.hide();
      $toggleLog.attr('data-status', 'hide').text(__('showLog'));
    } else {
      $autoTaskInfo.show();
      $toggleLog.attr('data-status', 'show').text(__('hideLog'));
    }
  };

  toggleLogElement.find('a.auto-task-website-btn').on('click', toggleLog);

  $autoTaskButtons.append(hideButtonElement).append(toggleLogElement);

  if (website.options) {
    GM_registerMenuCommand(__('changeWebsiteOptions'), () => {
      websiteOptions(website.name, website.options as WebsiteOptions);
    });
  }
};

// 初始化热键
const initializeHotkeys = (website: Website): void => {
  debug('初始化热键', { website: website.name });
  keyboardJS.bind(globalOptions.hotKey.doTaskKey, () => {
    if (website.doTask) website.doTask();
  });

  keyboardJS.bind(globalOptions.hotKey.undoTaskKey, () => {
    if (website.undoTask) website.undoTask();
  });

  keyboardJS.bind(globalOptions.hotKey.toggleLogKey, () => {
    const $toggleLog = $('#toggle-log');
    const status = $toggleLog.attr('data-status');
    const $autoTaskInfo = $('#auto-task-info');

    if (status === 'show') {
      $autoTaskInfo.hide();
      $toggleLog.attr('data-status', 'hide').text(__('showLog'));
    } else {
      $autoTaskInfo.show();
      $toggleLog.attr('data-status', 'show').text(__('hideLog'));
    }
  });
};

// 检查Steam ASF状态
const checkSteamASFStatus = async (): Promise<void> => {
  debug('检查Steam ASF状态');
  if (!globalOptions.ASF.AsfEnabled || !globalOptions.ASF.AsfIpcUrl || !globalOptions.ASF.AsfIpcPassword) {
    return;
  }

  const stopPlayTime = GM_getValue<number>('stopPlayTime', 0) || 0;
  if (stopPlayTime === 0 || stopPlayTime >= Date.now()) {
    return;
  }

  const stopPlayTimeMinutes = Math.floor((Date.now() - stopPlayTime) / 60000);
  const { value } = await Swal.fire({
    title: __('stopPlayTimeTitle'),
    text: __('stopPlayTimeText', stopPlayTimeMinutes.toString()),
    icon: 'warning',
    confirmButtonText: __('confirm'),
    cancelButtonText: __('cancel'),
    showCancelButton: true
  });

  if (!value) return;

  let steamASF: SteamASF | null = new SteamASF(globalOptions.ASF);
  try {
    const isInitialized = await steamASF.init();
    if (!isInitialized) return;

    const isGamesStopped = await steamASF.stopPlayGames();
    if (!isGamesStopped) return;

    const taskLink = GM_getValue<Array<string>>('taskLink', []) || [];
    for (const link of taskLink) {
      GM_openInTab(link, { active: true });
    }

    GM_setValue('stopPlayTime', 0);
    GM_setValue('playedGames', []);
    GM_setValue('taskLink', []);
  } catch (error) {
    console.error('SteamASF operation failed:', error);
  } finally {
    steamASF = null; // 释放 SteamASF 实例
  }
};

// 检查版本和通知
const checkVersionAndNotice = (): void => {
  debug('检查版本和通知');
  const { scriptHandler } = GM_info;
  if (scriptHandler !== 'Tampermonkey') {
    debug('未知脚本管理器', { scriptHandler });
    echoLog({}).warning(__('unknownScriptHandler'));
    return;
  }
  const [v1, v2] = GM_info.version?.split('.') || [];
  if (!(parseInt(v1, 10) >= 5 && parseInt(v2, 10) >= 2)) {
    echoLog({}).error(__('versionNotMatched'));
  }

  if (!GM_getValue<number>('notice')) {
    Swal.fire({
      title: __('swalNotice'),
      icon: 'warning'
    }).then(() => {
      GM_openInTab(__('noticeLink'), { active: true });
      GM_setValue('notice', new Date().getTime());
    });

    echoLog({ html: `<li><font class="warning">${__('echoNotice', __('noticeLink'))}</font></li>` })
      .font?.find('a').on('click', () => {
        GM_setValue('notice', new Date().getTime());
      });
  }
};

const loadScript = async (): Promise<void> => {
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

  let website: Website | undefined;
  for (const Website of (Websites as unknown as WebsiteClass[])) {
    if (Website.test()) {
      debug('识别到支持的网站', { website: Website.name });
      website = new Website();
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
    GM_registerMenuCommand(__('changeGlobalOptions'), () => { changeGlobalOptions('swal'); });
    GM_registerMenuCommand(__('settingPage'), () => {
      GM_openInTab('https://auto-task.hclonely.com/setting.html', { active: true });
    });
  }

  debug('脚本加载完成');
  console.log('%c%s', 'color:#1bbe1a', 'Auto-Task[Load]: 脚本加载完成');

  if (window.DEBUG) {
    echoLog({}).warning(__('debugModeNotice'));
  }

  await checkSteamASFStatus();
  checkVersionAndNotice();
  updateChecker();
};

// 主程序入口
try {
  debug('主程序入口开始', { hostname: window.location.hostname, windowName: window.name });

  // if (['freeanywhere.net', 'give.gamesforfarm.local', 'gamesforfarm-testing.ru', 'store.steampowered.com', 'steamcommunity.com', 'www.youtube.com', 'm.youtube.com', 'mee6.xyz', 'gamesforfarm.com'].includes(window.location.hostname) && $('.task-check-extension').length > 0) {
  //   debug('检测到freeanywhere.com，加载扩展');
  //   fawExtension();
  // }

  if (window.location.hostname === 'discord.com') {
    if (window.name === 'ATv4_discordAuth') {
      debug('检测到Discord认证窗口');
      handleDiscordAuth();
    } else {
      debug('检测到Discord主站');
      const discordAuth = window.localStorage?.getItem('token')?.replace(/^"|"$/g, '');
      if (discordAuth && discordAuth.length > 0) {
        debug('获取到Discord认证token');
        GM_setValue('discordAuth', { auth: discordAuth });
      }
    }
  } else if (window.location.hostname === 'opquests.com') {
    debug('检测到opquests.com，加载主脚本');
    loadScript();
  } else if ((window.name === 'ATv4_updateStoreAuth' || GM_getValue('ATv4_updateStoreAuth')) && window.location.host === 'store.steampowered.com') {
    debug('检测到Steam商店认证窗口');
    $(() => {
      if ($('[data-miniprofile]').length === 0) return;
      handleSteamStoreAuth();
    });
  } else if ((window.name === 'ATv4_updateCommunityAuth' || GM_getValue('ATv4_updateCommunityAuth')) && window.location.host === 'steamcommunity.com') {
    debug('检测到Steam社区认证窗口');
    $(() => {
      handleSteamCommunityAuth();
    });
  } else {
    if (window.location.hostname === 'key-hub.eu') {
      debug('检测到key-hub.eu，设置全局变量');
      // @ts-ignore
      unsafeWindow.keyhubtracker = 1;
      // @ts-ignore
      unsafeWindow.gaData = {};
    }
    debug('加载主脚本');
    $(loadScript);
  }
} catch (error) {
  debug('主程序入口发生异常', { error });
}
