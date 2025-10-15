/*
 * @Author       : HCLonely
 * @Date         : 2021-11-19 14:42:43
 * @LastEditTime : 2025-10-02 23:11:23
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/website/Gleam.ts
 * @Description  : https://gleam.io
 */

import Swal from 'sweetalert2';
import Website from './Website';
import throwError from '../tools/throwError';
import echoLog from '../echoLog';
import __ from '../tools/i18n';
import httpRequest from '../tools/httpRequest';
import { delay } from '../tools/tools';
import { globalOptions } from '../globalOptions';
import { debug } from '../tools/debug';

declare global {
  interface Window {
    _OxA: string;
  }
}

const defaultTasksTemplate: gleamSocialTasks = {
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
const defaultTasks = JSON.stringify(defaultTasksTemplate);

/**
 * 表示 Gleam 网站的任务处理类。
 *
 * @class Gleam
 * @extends Website
 *
 * @property {string} name - 网站名称，默认为 'Gleam'。
 * @property {gleamSocialTasks} undoneTasks - 社交任务列表。
 * @property {gleamSocialTasks} socialTasks - 存储已完成的社交任务。
 * @property {Array<string>} buttons - 可用的操作按钮数组，包括 'doTask'、'undoTask' 和 'verifyTask'。
 *
 * @static
 * @method test - 检查当前域名是否为 Gleam 网站。
 * @returns {boolean} 如果当前域名为 'gleam.io'，则返回 true；否则返回 false。
 *
 * @method before - 在执行操作之前重写全局的确认、警告和提示对话框。
 * @returns {void} 无返回值。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 *
 * @method after - 页面加载后的异步方法，执行后续操作。
 * @returns {Promise<void>} 无返回值。
 * @throws {Error} 如果在处理过程中发生错误，将抛出错误。
 *
 * @method init - 初始化方法，尝试初始化抽奖功能。
 * @returns {boolean} 如果初始化成功，则返回 true；否则返回 false。
 * @throws {Error} 如果在初始化过程中发生错误，将抛出错误。
 *
 * @method classifyTask - 分类任务的异步方法。
 * @param {'do' | 'undo'} action - 要执行的操作类型，'do' 表示执行任务，'undo' 表示撤销任务。
 * @returns {Promise<boolean>} 如果任务分类成功，则返回 true；否则返回 false。
 * @throws {Error} 如果在分类过程中发生错误，将抛出错误。
 *
 * @method extraDoTask - 执行额外任务的异步方法。
 * @param {Object} params - 方法参数对象。
 * @param {Array<string>} params.gleam - 包含要执行的Gleam任务链接的数组。
 * @returns {Promise<boolean>} 如果所有任务成功执行，则返回 true；否则返回 false。
 * @throws {Error} 如果在执行过程中发生错误，将抛出错误。
 *
 * @method verifyTask - 验证任务的异步方法。
 * @returns {Promise<any>} 如果所有任务成功验证，则返回 true；如果发生错误，则返回 false；如果需要人机验证，则返回验证提示。
 * @throws {Error} 如果在验证过程中发生错误，将抛出错误。
 *
 * @private
 * @method #checkSync - 检查同步状态的私有异步方法。
 * @returns {Promise<boolean>} 如果同步完成，则返回 true；如果发生错误，则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 *
 * @private
 * @method #doGleamTask - 执行Gleam任务的私有异步方法。
 * @param {string} link - 要执行的Gleam任务链接。
 * @returns {Promise<boolean>} 如果任务成功执行，则返回 true；否则返回 false。
 * @throws {Error} 如果在执行过程中发生错误，将抛出错误。
 *
 * @private
 * @method #getGiveawayId - 获取抽奖ID的方法。
 * @returns {boolean} 如果成功获取抽奖ID，则返回 true；否则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 *
 * @private
 * @method #checkLeftKey - 检查剩余密钥的私有异步方法。
 * @returns {Promise<boolean>} 如果检查成功，则返回 true；如果发生错误，则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 */
class Gleam extends Website {
  name = 'Gleam';
  undoneTasks: gleamSocialTasks = JSON.parse(defaultTasks);
  socialTasks: gleamSocialTasks = JSON.parse(defaultTasks);
  buttons: Array<string> = [
    'doTask',
    'undoTask',
    'verifyTask'
  ];

  /**
   * 检查当前域名是否为 Gleam 网站的静态方法
   *
   * @returns {boolean} 如果当前域名为 'gleam.io'，则返回 true；否则返回 false。
   *
   * @description
   * 该方法通过比较当前窗口的域名来判断是否为 Gleam 网站。
   * 如果域名匹配，则返回 true；否则返回 false。
   */
  static test(): boolean {
    const { host } = window.location;
    const isMatch = host === 'gleam.io';
    debug('检查网站匹配', { host, isMatch });
    return isMatch;
  }

  /**
   * 在执行操作之前重写全局的确认、警告和提示对话框
   *
   * @returns {void} 无返回值。
   *
   * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法在执行操作之前，将全局的 `confirm`、`alert` 和 `prompt` 方法重写为空函数。
   * 这样可以防止在执行过程中弹出任何对话框，确保用户体验不受干扰。
   */
  before(): void {
    try {
      debug('重写全局对话框函数');
      // @ts-ignore
      unsafeWindow.confirm = () => { };
      unsafeWindow.alert = () => { };
      // @ts-ignore
      unsafeWindow.prompt = () => { };
    } catch (error) {
      debug('重写全局对话框函数失败', { error });
      throwError(error as Error, 'Gleam.before');
    }
  }

  /**
   * 页面加载后的异步方法
   *
   * @returns {Promise<void>} 无返回值。
   *
   * @throws {Error} 如果在处理过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法在特定条件下执行后续操作。
   * 首先检查当前URL中是否包含特定的查询参数。
   * 如果包含，则设置一个定时器，检查任务是否完成。
   * 遍历页面中的每个任务，查找可点击的元素并执行点击操作。
   * 在每次点击后，等待 1 秒钟以确保操作完成。
   * 如果未找到特定查询参数，则检查剩余密钥的状态。
   * 如果检查失败，则记录相应的警告信息。
   */
  async after(): Promise<void> {
    try {
      debug('开始执行后续操作');
      if (window.location.search.includes('8b07d23f4bfa65f9')) {
        debug('检测到特殊查询参数，开始处理任务');
        const checkComplete = setInterval(() => {
          if ($('.entry-content .entry-method i.fa-check').length > 0) {
            debug('任务已完成，关闭窗口');
            clearInterval(checkComplete);
            window.close();
          }
        });

        await this.verifyTask();
        echoLog({}).warning(__('gleamTaskNotice'));
      } else if (!await this.#checkLeftKey()) {
        debug('检查剩余密钥失败');
        echoLog({}).warning(__('checkLeftKeyFailed'));
      }
    } catch (error) {
      debug('后续操作失败', { error });
      throwError(error as Error, 'Gleam.after');
    }
  }

  /**
   * 初始化方法
   *
   * @returns {boolean} 如果初始化成功，则返回 true；否则返回 false。
   *
   * @throws {Error} 如果在初始化过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法尝试初始化抽奖功能。
   * 首先记录初始化状态。如果获取抽奖ID失败，则返回 false。
   * 如果成功获取抽奖ID，则将 `initialized` 属性设置为 true，并记录成功信息。
   */
  init(): boolean {
    try {
      debug('初始化 Gleam');
      const logStatus = echoLog({ text: __('initing') });
      if (!this.#getGiveawayId()) {
        debug('获取抽奖ID失败');
        return false;
      }
      this.initialized = true;
      debug('初始化完成');
      logStatus.success();
      return true;
    } catch (error) {
      debug('初始化失败', { error });
      throwError(error as Error, 'Gleam.init');
      return false;
    }
  }

  /**
   * 分类任务的异步方法
   *
   * @param {'do' | 'undo'} action - 要执行的操作类型，'do' 表示执行任务，'undo' 表示撤销任务。
   * @returns {Promise<boolean>} 如果任务分类成功，则返回 true；否则返回 false。
   *
   * @throws {Error} 如果在分类过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法根据传入的操作类型分类任务。
   * 首先检查操作类型，如果是'undo'，则从存储中获取任务信息。
   * 然后遍历页面中的任务，按以下步骤处理每个任务：
   * 1. 跳过已完成的任务
   * 2. 处理可点击元素
   * 3. 根据社交平台图标和任务文本，将任务分类到相应的列表中：
   *    - Twitter（关注和转发）
   *    - Twitch（关注）
   *    - Discord（加入服务器）
   *    - YouTube（订阅）
   *    - Steam（加入组、关注鉴赏家、游戏时长）
   *    - Gleam（完成任务）
   * 4. 跳过已知的其他任务类型
   * 5. 记录未知任务类型
   * 最后去重并保存任务列表到本地存储。
   */
  async classifyTask(action: 'do' | 'undo'): Promise<boolean> {
    try {
      debug('开始分类任务', { action });
      const logStatus = echoLog({ text: __('getTasksInfo') });
      if (action === 'undo') {
        debug('恢复已保存的任务信息');
        this.socialTasks = GM_getValue<gleamGMTasks>(`gleamTasks-${this.giveawayId}`)?.tasks || JSON.parse(defaultTasks);
      }

      const tasks = $('.entry-content .entry-method');
      debug('找到任务元素', { count: tasks.length });

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

        debug('处理任务', { taskText });

        if (aElements.length > 0) {
          debug('处理可点击元素', { count: aElements.length });
          for (const element of aElements) {
            const $element = $(element);
            const href = $element.attr('href');
            $element.removeAttr('href')[0].click();
            $element.attr('href', href as string);
          }
        }

        // 处理Twitter任务
        if (socialIcon.hasClass('fa-twitter') || socialIcon.hasClass('fa-x-twitter')) {
          const link = $task.find('a[href^="https://twitter.com/"],a[href^="https://x.com/"]').attr('href');
          if (!link) continue;

          if (/follow/gi.test(taskText)) {
            if (action === 'undo') this.socialTasks.twitter.userLinks.push(link);
            if (action === 'do') this.undoneTasks.twitter.userLinks.push(link);
            continue;
          }

          if (/retweet/gim.test(taskText)) {
            if (action === 'undo') this.socialTasks.twitter.retweetLinks.push(link);
            if (action === 'do') this.undoneTasks.twitter.retweetLinks.push(link);
            continue;
          }
        }

        // 处理Twitch任务
        if (socialIcon.hasClass('fa-twitch') && /follow/gim.test(taskText)) {
          const link = $task.find('a[href^="https://twitch.tv/"]').attr('href');
          if (!link) continue;

          if (action === 'undo') this.socialTasks.twitch.channelLinks.push(link);
          if (action === 'do') this.undoneTasks.twitch.channelLinks.push(link);
          continue;
        }

        // 处理Discord任务
        if (socialIcon.hasClass('fa-discord') && /join/gim.test(taskText)) {
          let link = $task.find('a[href^="https://discord.com/invite/"]').attr('href');
          if (!link) {
            const ggLink = $task.find('a[href^="https://discord.gg/"]').attr('href')
              ?.match(/discord\.gg\/([^/]+)/)?.[1];
            if (!ggLink) continue;
            link = `https://discord.com/invite/${ggLink}`;
          }

          if (action === 'undo') this.socialTasks.discord.serverLinks.push(link);
          if (action === 'do') this.undoneTasks.discord.serverLinks.push(link);
          continue;
        }

        // 跳过外部链接任务
        if (socialIcon.hasClass('fa-external-link-square-alt')) continue;

        // 处理YouTube任务
        if (socialIcon.hasClass('fa-youtube') && /subscribe/gim.test(taskText)) {
          const link = $task.find('a[href^="https://www.youtube.com/channel/"]').attr('href');
          if (!link) continue;

          if (action === 'undo') this.socialTasks.youtube.channelLinks.push(link);
          if (action === 'do') this.undoneTasks.youtube.channelLinks.push(link);
          continue;
        }

        // 处理Steam任务
        if (socialIcon.attr('class')?.includes('steam')) {
          if (/join.*group/gi.test(taskText)) {
            const link = $task.find('a[href^="https://steamcommunity.com/groups/"]').attr('href');
            if (!link) continue;

            if (action === 'undo') this.socialTasks.steam.groupLinks.push(link);
            if (action === 'do') this.undoneTasks.steam.groupLinks.push(link);
            continue;
          }

          if (/follow.*curator/gi.test(taskText)) {
            const link = $task.find('a[href^="https://store.steampowered.com/curator/"]').attr('href');
            if (!link) continue;

            if (action === 'undo') this.socialTasks.steam.curatorLinks.push(link);
            if (action === 'do') this.undoneTasks.steam.curatorLinks.push(link);
            continue;
          }

          if (/play[\w\W]*hours/gi.test(taskText)) {
            const link = $task.find('a[href^="https://steamcommunity.com/app/"],a[href^="https://store.steampowered.com/app/"]').attr('href');
            const time = [...taskText.matchAll(/(\d+?(\.\d+)?)\s*?hour/gi)];
            if (!link || !time[0]?.[1]) continue;

            const trueTime = parseFloat(time[0][1]) * 60;
            // if (action === 'undo') this.socialTasks.steam.playTimeLinks.push(`${trueTime}-${link}`);
            if (action === 'do') this.undoneTasks.steam.playTimeLinks.push(`${trueTime}-${link}`);
            continue;
          }

          if (/Sign up/gi.test(taskText)) {
            continue;
          }
        }

        // 处理Gleam任务
        if (socialIcon.hasClass('fa-bullhorn') && (/Complete|Increase/gi.test(taskText))) {
          if (action !== 'do') continue;

          const gleamLink = await this.#getGleamLink(taskText);
          if (!gleamLink) continue;

          this.undoneTasks.extra.gleam.push(gleamLink);
          continue;
        }

        // 跳过已知的其他任务类型
        if (
          socialIcon.hasClass('fa-question') ||
          socialIcon.hasClass('fa-reddit') ||
          socialIcon.hasClass('fa-instagram') ||
          socialIcon.hasClass('fa-facebook-f') ||
          socialIcon.hasClass('fa-telegram-plane') ||
          socialIcon.hasClass('fa-telegram') ||
          socialIcon.hasClass('fa-vk') ||
          socialIcon.hasClass('fa-envelope') ||
          socialIcon.hasClass('fa-gift') ||
          socialIcon.hasClass('fa-square-up-right') ||
          socialIcon.hasClass('fa-gamepad-modern') ||
          socialIcon.hasClass('fa-dollar-sign') ||
          socialIcon.hasClass('fa-tiktok') ||
          socialIcon.hasClass('fa-gamepad-alt') ||
          socialIcon.hasClass('fa-bag-shopping') ||
          socialIcon.hasClass('fa-swords') ||
          (socialIcon.hasClass('fa-shield') && taskText.includes('one of our giveaways')) ||
          (socialIcon.hasClass('fa-shield') && taskText.includes('Check out')) ||
          (socialIcon.hasClass('fa-shield') && taskText.includes('vloot.io'))
        ) {
          continue;
        }

        echoLog({}).warning(`${__('unKnownTaskType')}: ${taskText}`);
      }
      debug('任务分类完成');
      logStatus.success();
      this.undoneTasks = this.uniqueTasks(this.undoneTasks) as gleamSocialTasks;
      this.socialTasks = this.uniqueTasks(this.socialTasks) as gleamSocialTasks;

      debug('保存任务信息');
      GM_setValue(`gleamTasks-${this.giveawayId}`, { tasks: this.socialTasks, time: new Date().getTime() });
      return true;
    } catch (error) {
      debug('任务分类失败', { error });
      throwError(error as Error, 'Gleam.classifyTask');
      return false;
    }
  }

  /**
   * 执行额外任务的异步方法
   *
   * @param {Object} params - 方法参数对象。
   * @param {Array<string>} params.gleam - 包含要执行的Gleam任务链接的数组。
   * @returns {Promise<boolean>} 如果所有任务成功执行，则返回 true；否则返回 false。
   *
   * @throws {Error} 如果在执行过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法遍历传入的Gleam任务链接数组，并为每个链接调用私有方法 `#doGleamTask`。
   * 所有任务的执行结果将通过 `Promise.all` 进行处理。
   * 如果所有任务成功完成，则返回 true；如果发生错误，则记录错误信息并返回 false。
   */
  async extraDoTask({ gleam }: { gleam: Array<string> }): Promise<boolean> {
    try {
      debug('开始执行额外任务', { count: gleam.length });
      const pro = [];
      for (const link of gleam) {
        pro.push(this.#doGleamTask(link));
      }
      return Promise.all(pro).then(() => true);
    } catch (error) {
      debug('执行额外任务失败', { error });
      throwError(error as Error, 'Gleam.extraDoTask');
      return false;
    }
  }

  /**
   * 检查人机验证的私有异步方法
   *
   * @returns {Promise<boolean>} 如果检测到人机验证，则返回 true；否则返回 false。
   *
   * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法检查页面中是否存在人机验证。
   * 如果检测到验证元素（campaign-key属性），则：
   * 1. 等待3秒
   * 2. 显示重试提示
   * 3. 递归调用自身直到验证消失
   * 验证通过后记录成功状态。
   */
  async #checkCampaign(): Promise<boolean> {
    try {
      debug('检测人机验证');
      let logStatus: logStatus | undefined;
      if ($('[campaign-key="campaign.key"]').length > 0) {
        logStatus = echoLog({ text: __('campaign') });
        debug('检测到人机验证');
        await delay(3000);
        logStatus.warning(__('retry'));
        await this.#checkCampaign();
        return true;
      }
      logStatus?.success();
      return false;
    } catch (error) {
      debug('检测人机验证失败', { error });
      throwError(error as Error, 'Gleam.checkCampaign');
      return false;
    }
  }

  /**
   * 验证任务的异步方法
   *
   * @returns {Promise<any>} 如果所有任务成功验证，则返回 true；如果发生错误，则返回 false；如果需要人机验证，则返回验证提示。
   *
   * @throws {Error} 如果在验证过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法遍历页面中的所有任务，按顺序执行以下步骤：
   * 1. 检查是否存在人机验证，如果存在则立即返回
   * 2. 对于每个未完成的任务：
   *    - 点击任务信息展开详情
   *    - 处理可点击的按钮元素
   *    - 处理计时器相关的操作
   *    - 处理输入框（如果存在）
   *    - 等待同步完成
   *    - 点击继续按钮完成验证
   * 3. 记录任务验证完成的状态
   * 所有任务处理完成后返回true，如果发生错误则返回false。
   */
  async verifyTask(): Promise<any> {
    try {
      debug('开始验证任务');
      echoLog({ text: `${__('verifyingTask')}...` });

      const tasks = $('.entry-content .entry-method');
      unsafeWindow._OxA = '_OxA';

      for (const task of tasks) {
        const campaign = await this.#checkCampaign();
        if (campaign) return this.verifyTask();

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
          debug('处理可点击元素', { count: aElements.length });
          for (const element of aElements) {
            const $element = $(element);
            const href = $element.attr('href');
            $element.removeAttr('href')[0].click();
            $element.attr('href', href as string);
          }
        }

        // 处理计时器
        debug('处理计时器');
        // @ts-ignore
        unsafeWindow.$hookTimer?.setSpeed(1000);
        const visitBtn = $task.find('.expandable').find('span:contains(more seconds),button:contains(more seconds)')
          .filter(':visible');
        // @ts-ignore
        if (visitBtn.length > 0 && unsafeWindow.$hookTimer) {
          debug('处理访问按钮');
          const newTab = GM_openInTab('', { active: true });
          await delay(1000);
          newTab?.close();
          window.focus();
        }
        await delay(3000);
        // @ts-ignore
        unsafeWindow.$hookTimer?.setSpeed(1);

        // 处理输入框
        const expandInfo = $task.find('.expandable');
        const [input] = expandInfo.find('input');
        if (input) {
          debug('处理输入框');
          const evt = new Event('input', { bubbles: true, cancelable: true, composed: true });
          const valuelimit = [...expandInfo.text().matchAll(/"(.+?)"/g)].at(-1)?.[1];
          input.value = valuelimit || 'vloot';
          input.dispatchEvent(evt);
          await delay(1000);
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
      echoLog({ text: __('verifiedGleamTasks') });
      return true;
    } catch (error) {
      debug('任务验证失败', { error });
      throwError(error as Error, 'Gleam.verifyTask');
      return false;
    }
  }

  /**
   * 检查同步状态的私有异步方法
   *
   * @returns {Promise<boolean>} 如果同步完成，则返回 true；如果发生错误，则返回 false。
   *
   * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法使用定时器检查页面中是否存在同步图标。
   * 如果同步图标不存在，则清除定时器并解析 Promise 为 true。
   * 如果在过程中发生错误，则记录错误信息并返回 false。
   */
  async #checkSync(): Promise<boolean> {
    try {
      debug('开始检查同步状态');
      return await new Promise((resolve) => {
        const checker = setInterval(() => {
          if ($('.entry-content .entry-method i.fa-sync').length === 0) {
            debug('同步完成');
            clearInterval(checker);
            resolve(true);
          }
        }, 500);
      });
    } catch (error) {
      debug('检查同步状态失败', { error });
      throwError(error as Error, 'Gleam.checkSync');
      return false;
    }
  }

  /**
   * 执行Gleam任务的私有异步方法
   *
   * @param {string} link - 要执行的Gleam任务链接。
   * @returns {Promise<boolean>} 如果任务成功执行，则返回 true；否则返回 false。
   *
   * @throws {Error} 如果在执行过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法打开一个新的标签页以执行指定的Gleam任务。
   * 使用 `GM_openInTab` 方法打开任务链接，并在标签页关闭时记录成功信息。
   * 如果在过程中发生错误，则记录错误信息并返回 false。
   */
  async #doGleamTask(link: string): Promise<boolean> {
    try {
      debug('执行 Gleam 任务', { link });
      const logStatus = echoLog({ text: __('doingGleamTask') });
      return await new Promise((resolve) => {
        GM_openInTab(`${link}?8b07d23f4bfa65f9`,
          { active: true, insert: true, setParent: true })
          .onclose = () => {
            debug('任务完成');
            logStatus.success();
            resolve(true);
          };
      });
    } catch (error) {
      debug('执行 Gleam 任务失败', { error });
      throwError(error as Error, 'Gleam.doGleamTask');
      return false;
    }
  }

  /**
   * 获取抽奖ID的方法
   *
   * @returns {boolean} 如果成功获取抽奖ID，则返回 true；否则返回 false。
   *
   * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法从当前窗口的路径中提取抽奖ID。
   * 如果成功获取到抽奖ID，则将其赋值给实例属性 `giveawayId` 并返回 true。
   * 如果未能获取到抽奖ID，则记录错误信息并返回 false。
   */
  #getGiveawayId(): boolean {
    try {
      debug('获取抽奖ID');
      const giveawayId = window.location.pathname;
      if (giveawayId) {
        this.giveawayId = giveawayId;
        debug('获取抽奖ID成功', { giveawayId });
        return true;
      }
      debug('获取抽奖ID失败');
      echoLog({ text: __('getFailed', 'GiveawayId') });
      return false;
    } catch (error) {
      debug('获取抽奖ID出错', { error });
      throwError(error as Error, 'Gleam.getGiveawayId');
      return false;
    }
  }

  /**
   * 获取Gleam链接的异步方法
   *
   * @param {string} title - 要查找的抽奖标题。
   * @returns {Promise<string | false>} 如果成功获取链接，则返回链接字符串；如果失败，则返回 false。
   *
   * @throws {Error} 如果在获取过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法通过以下步骤获取Gleam任务链接：
   * 1. 向vloot.io的API发送GET请求获取抽奖列表
   * 2. 检查API响应的有效性：
   *    - 确保HTTP状态码为200
   *    - 确保响应成功标志为true
   *    - 确保返回数据不为空
   * 3. 在返回的数据中查找标题匹配的抽奖活动
   * 4. 如果找到匹配的活动，返回其链接
   * 5. 如果任何步骤失败，记录相应的错误信息并返回false
   */
  async #getGleamLink(title: string): Promise<string | false> {
    try {
      debug('获取 Gleam 链接', { title });
      const logStatus = echoLog({ text: __('gettingGleamLink') });
      const { result, statusText, status, data } = await httpRequest({
        url: 'https://www.vloot.io/api/v1/giveaways',
        method: 'GET',
        responseType: 'json'
      });
      if (result === 'Success') {
        if (data?.status === 200 && data?.response?.Success === true && data?.response?.Data) {
          const { link } = (data.response as vlootData).Data.find((giveaway) => title.replace(/[\s]/g, '').toLowerCase()
            .includes(giveaway.title.replace(/[\s]/g, '').toLowerCase())) || {};
          if (link) {
            debug('获取链接成功', { link });
            logStatus.success();
            return link;
          }
          debug('获取链接失败');
          logStatus.error(`Error:${__('getLinkFailed')}`);
          return false;
        }
        debug('API响应错误', { status: data?.status, statusText: data?.statusText });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }
      debug('请求失败', { result, status, statusText });
      logStatus.error(`${result}:${statusText}(${status})`);
      return false;
    } catch (error) {
      debug('获取 Gleam 链接失败', { error });
      throwError(error as Error, 'Gleam.getGleamLink');
      return false;
    }
  }

  /**
   * 检查剩余密钥的私有异步方法
   *
   * @returns {Promise<boolean>} 如果检查成功，则返回 true；如果发生错误，则返回 false。
   *
   * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法按以下步骤检查抽奖活动的状态：
   * 1. 如果未启用检查功能，直接返回true
   * 2. 获取并解析活动配置信息，如果获取失败则返回false
   * 3. 检查用户是否已拥有密钥
   * 4. 验证活动状态是否有效（未被禁止、未结束、未暂停、已开始）
   * 5. 如果活动状态无效：
   *    - 显示警告对话框
   *    - 如果用户确认，则关闭窗口
   * 6. 返回检查结果
   */
  async #checkLeftKey(): Promise<boolean> {
    try {
      debug('检查剩余密钥');
      if (!globalOptions.other.checkLeftKey) {
        debug('跳过密钥检查');
        return true;
      }

      const campaignString = $('div.popup-blocks-container').attr('ng-init')
        ?.match(/initCampaign\(([\w\W]+?)\)$/)?.[1];
      if (!campaignString) {
        debug('未找到活动配置信息');
        return false;
      }

      const { campaign, incentive } = JSON.parse(campaignString);
      const controllerString = $('div.campaign.reward').attr('ng-init')
        ?.match(/initContestant\(([\w\W]+?)\);/)?.[1];

      let ownedKey = false;
      if (controllerString) {
        if (JSON.parse(controllerString).contestant?.claims?.incentives?.[incentive.id]?.length) {
          debug('用户已拥有密钥');
          ownedKey = true;
        }
      }

      const isGiveawayInvalid = campaign.banned ||
        (campaign.finished && !ownedKey) ||
        campaign.paused ||
        new Date().getTime() < (campaign.starts_at * 1000);

      debug('检查抽奖状态', {
        banned: campaign.banned,
        finished: campaign.finished,
        ownedKey,
        paused: campaign.paused,
        notStarted: new Date().getTime() < (campaign.starts_at * 1000)
      });

      if (!isGiveawayInvalid) return true;

      debug('抽奖无效，显示确认对话框');
      const { value } = await Swal.fire({
        icon: 'warning',
        title: __('notice'),
        text: __('giveawayNotWork'),
        confirmButtonText: __('confirm'),
        cancelButtonText: __('cancel'),
        showCancelButton: true
      });

      if (value) {
        debug('用户确认关闭窗口');
        window.close();
      }

      return true;
    } catch (error) {
      debug('检查剩余密钥失败', { error });
      throwError(error as Error, 'Gleam.checkLeftKey');
      return false;
    }
  }
}

export default Gleam;
