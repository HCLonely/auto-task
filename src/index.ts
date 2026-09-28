/*
 * @Author       : HCLonely
 * @Date         : 2021-10-26 15:44:54
 * @LastEditTime : 2026-04-28 09:14:01
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/index.ts
 * @Description  : 入口文件
 */

import consoleLogHook from './scripts/tools/consoleLogHook';
import { globalOptions } from './scripts/globalOptions';
import Swal from 'sweetalert2';
import { handleSteamAuthPage } from '../modules/social/steam';
import { handleTwitchAuthPage } from '../modules/social/twitch';
import { moduleNamespace, projectGM } from './scripts/social/moduleBridge';
import { Websites } from '../modules/website/index';
import websiteOptions from '../modules/website/options';
import __ from './scripts/tools/i18n';
import { changeGlobalOptions } from './scripts/globalOptionsEdit';
import keyboardJS from 'keyboardjs';
import updateChecker from './scripts/updateChecker';
import echoLog from './scripts/echoLog';
import SteamASF from './scripts/social/SteamASF';
import { debug } from './scripts/tools/debug';
// import { getAllLocalStorageAsObjects } from './scripts/tools/tools';
// import browser from 'browser-tool';
// import { v4 as uuidv4 } from 'uuid';
// import fawExtension from '../modules/website/freeanywhereExtension';

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
window.DEBUG = !!globalOptions.other?.debug;
window.TRACE = !!globalOptions.other?.debug && typeof console.trace === 'function';

// 初始化UI元素
const initializeUI = (website: Website): void => {
  debug('初始化UI元素', { website: website.name });
  const $body = $('body');
  $body.append(`
    <div id="auto-task-info"
        style="display:${globalOptions.other.defaultShowLog ? 'block' : 'none'};
                ${globalOptions.position.logSideX}:${globalOptions.position.logDistance.split(',')[0]}px;
                ${globalOptions.position.logSideY}:${globalOptions.position.logDistance.split(',')[1]}px;
                opacity: 0;
                animation: fadeInUp 0.6s ease forwards;">
    </div>
    <div id="auto-task-buttons"
        style="display:${globalOptions.other.defaultShowButton ? 'block' : 'none'};
                ${globalOptions.position.buttonSideX}:${globalOptions.position.buttonDistance.split(',')[0]}px;
                ${globalOptions.position.buttonSideY}:${globalOptions.position.buttonDistance.split(',')[1]}px;
                opacity: 0;
                animation: fadeInUp 0.6s ease 0.2s forwards;">
    </div>
    <div class="show-button-div"
        style="display:${globalOptions.other.defaultShowButton ? 'none' : 'block'};
                ${globalOptions.position.showButtonSideX}:${globalOptions.position.showButtonDistance.split(',')[0]}px;
                ${globalOptions.position.showButtonSideY}:${globalOptions.position.showButtonDistance.split(',')[1]}px;
                opacity: 0;
                animation: fadeInScale 0.5s ease 0.4s forwards;">
      <a class="auto-task-website-btn show-button-link"
        href="javascript:void(0);"
        target="_self"
        title="${__('showButton')}">
      </a>
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
    steamASF?.dispose();
    steamASF = null; // 释放 SteamASF 实例
  }
};

// 检查版本和通知
const checkVersionAndNotice = (): void => {
  debug('检查版本和通知');
  const { scriptHandler } = GM_info;
  if (scriptHandler === 'Tampermonkey') {
    const [v1, v2] = GM_info.version?.split('.') || [];
    if (!(parseInt(v1, 10) >= 5 && parseInt(v2, 10) >= 2)) {
      echoLog({}).error(__('versionNotMatched'));
    }
  } else if (scriptHandler !== 'Violentmonkey') {
    const [v1, v2] = GM_info.version?.split('.') || [];
    if (!(parseInt(v1, 10) >= 2 && parseInt(v2, 10) >= 36)) {
      echoLog({}).error(__('versionNotMatched'));
    }
  } else {
    debug('未知脚本管理器', { scriptHandler });
    echoLog({}).warning(__('unknownScriptHandler'));
    return;
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

// Authentication replies must use the same GM namespace as the requesting module.
const bootstrap = async (): Promise<void> => {
  try {
    if (await handleSteamAuthPage({ namespace: moduleNamespace('steam'), gm: projectGM('steam') })) return;
    if (await handleTwitchAuthPage({ namespace: moduleNamespace('twitch'), gm: projectGM('twitch') })) return;
    if (window.location.hostname === 'key-hub.eu') {
      // @ts-ignore
      unsafeWindow.keyhubtracker = 1;
      // @ts-ignore
      unsafeWindow.gaData = {};
    }
    await loadScript();
  } catch (error) {
    debug('主程序入口发生异常', { error });
  }
};
if (window.location.hostname === 'opquests.com') void bootstrap();
else $(bootstrap);
