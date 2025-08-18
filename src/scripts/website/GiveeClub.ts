/*
 * @Author       : HCLonely
 * @Date         : 2021-11-14 11:46:52
 * @LastEditTime : 2025-08-18 19:07:00
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/website/GiveeClub.ts
 * @Description  : https://givee.club/
 */

import Swal from 'sweetalert2';
import throwError from '../tools/throwError';
import echoLog from '../echoLog';
import __ from '../tools/i18n';
import { delay, getRedirectLink } from '../tools/tools';
import { GiveawaySu, defaultTasks } from './Giveawaysu';
import { globalOptions } from '../globalOptions';
import { debug } from '../tools/debug';

/**
 * GiveeClub 类用于处理 GiveeClub 抽奖活动的相关操作。
 *
 * @class GiveeClub
 * @extends GiveawaySu
 *
 * @property {string} name - GiveeClub 的名称。
 * @property {Array<string>} buttons - 包含可执行操作的按钮名称数组，包括 'doTask'、'undoTask' 和 'verifyTask'。
 *
 * @description
 * 该类继承自 GiveawaySu 类，专门处理 GiveeClub 网站的抽奖任务。
 * 提供了任务分类、验证和检查等功能。
 * 使用扁平化的代码结构和提前返回模式来处理各种任务类型。
 * 支持多种社交平台的任务处理，包括 Steam、Discord、Twitter 等。
 *
 * @method static test - 检查当前 URL 是否为有效的 GiveeClub 事件页面。
 * @returns {boolean} 如果当前 URL 匹配 GiveeClub 事件页面的格式，则返回 true；否则返回 false。
 *
 * @method async after - 抽奖后续操作的异步方法。
 * @returns {Promise<void>} 无返回值。
 * @throws {Error} 如果在处理过程中发生错误，将抛出错误。
 *
 * @method init - 初始化方法。
 * @returns {boolean} 如果初始化成功，则返回 true；否则返回 false。
 * @throws {Error} 如果在初始化过程中发生错误，将抛出错误。
 *
 * @method async classifyTask - 分类任务的异步方法。
 * @param {'do' | 'undo'} action - 要执行的操作类型，'do' 表示执行任务，'undo' 表示撤销任务。
 * @returns {Promise<boolean>} 如果任务分类成功，则返回 true；否则返回 false。
 * @throws {Error} 如果在分类过程中发生错误，将抛出错误。
 *
 * @method async verifyTask - 验证任务的异步方法。
 * @returns {Promise<boolean>} 如果任务验证成功，则返回 true；否则返回 false。
 * @throws {Error} 如果在验证过程中发生错误，将抛出错误。
 *
 * @method #checkLogin - 检查用户是否已登录的私有方法。
 * @returns {boolean} 如果用户已登录，则返回 true；否则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 *
 * @method #getGiveawayId - 获取抽奖ID的方法。
 * @returns {boolean} 如果成功获取抽奖ID，则返回 true；否则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 *
 * @method async #checkLeftKey - 检查剩余密钥的私有异步方法。
 * @returns {Promise<boolean>} 如果检查成功或不需要检查，则返回 true；如果发生错误，则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 */
class GiveeClub extends GiveawaySu {
  name = 'GiveeClub';
  buttons: Array<string> = [
    'doTask',
    'undoTask',
    'verifyTask'
  ];

  /**
   * 检查当前URL是否为有效的GiveeClub事件页面的静态方法
   *
   * @returns {boolean} 如果当前URL匹配GiveeClub事件页面的格式，则返回 true；否则返回 false。
   *
   * @description
   * 该方法使用正则表达式检查当前窗口的URL是否符合GiveeClub事件页面的格式。
   * 格式为：以 "http://" 或 "https://" 开头，后跟 "givee.club/" 和 "/event/" 以及一个数字ID。
   */
  static test(): boolean {
    const url = window.location.href;
    const isMatch = /^https?:\/\/givee\.club\/.*?\/event\/[\d]+/.test(url);
    debug('检查网站匹配', { url, isMatch });
    return isMatch;
  }

  /**
   * 抽奖后续操作的异步方法
   *
   * @returns {Promise<void>} 无返回值。
   *
   * @throws {Error} 如果在处理过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法首先检查用户是否已登录，如果未登录，则记录警告信息。
   * 然后检查剩余密钥的状态，如果检查失败，则记录相应的警告信息。
   */
  async after(): Promise<void> {
    try {
      debug('开始执行后续操作');
      if (!this.#checkLogin()) {
        debug('登录检查失败');
        echoLog({}).warning(__('checkLoginFailed'));
      }
      if (!await this.#checkLeftKey()) {
        debug('检查剩余密钥失败');
        echoLog({}).warning(__('checkLeftKeyFailed'));
      }
    } catch (error) {
      debug('后续操作失败', { error });
      throwError(error as Error, 'GiveeClub.after');
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
   * 首先记录初始化状态。如果用户未登录，则记录警告信息并返回 false。
   * 然后调用私有方法获取抽奖ID，如果获取失败，则返回 false。
   * 如果成功获取抽奖ID，则将 `initialized` 属性设置为 true，并记录成功信息。
   */
  init(): boolean {
    try {
      debug('初始化 GiveeClub');
      const logStatus = echoLog({ text: __('initing') });

      if (!this.#checkLogin()) {
        debug('登录检查失败');
        logStatus.warning(__('needLogin'));
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
      debug('初始化失败', { error });
      throwError(error as Error, 'GiveeClub.init');
      return false;
    }
  }

  /**
   * 分类任务的异步方法
   *
   * @param {'do' | 'undo'} action - 要执行的操作类型，'do' 表示执行任务，'undo' 表示撤销任务。
   * @returns {Promise<boolean>} 如果任务分类成功，则返回 true；否则返回 false。
   * @throws {Error} 如果在分类过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法根据传入的操作类型分类任务。
   * 如果操作为 'undo'，则从存储中获取任务信息并返回 true。
   * 否则，初始化未完成任务列表，并处理每个任务元素。
   * 任务处理完成后，更新任务列表并保存到存储中。
   */
  async classifyTask(action: 'do' | 'undo'): Promise<boolean> {
    try {
      debug('开始分类任务', { action });
      const logStatus = echoLog({ text: __('getTasksInfo') });

      if (action === 'undo') {
        debug('恢复已保存的任务信息');
        this.socialTasks = GM_getValue<gasGMTasks>(`gcTasks-${this.giveawayId}`)?.tasks || defaultTasks;
        return true;
      }

      debug('初始化未完成任务列表');
      this.undoneTasks = defaultTasks;
      const tasks = $('.event-actions tr');

      const processTask = async (task: Element): Promise<boolean> => {
        const taskDes = $(task).find('.event-action-label a');
        const taskIcon = $(task).find('.event-action-icon i')
          .attr('class') || '';
        const taskName = taskDes.text().trim();
        const taskType = $(task).find('button[data-type]')
          ?.attr('data-type') || '';
        const taskFinished = $(task).find('.event-action-buttons .btn-success')?.length;
        const appId = taskDes.attr('data-steam-wishlist-appid');

        debug('处理任务', { taskName, taskType, taskIcon, taskFinished, appId });

        if (taskIcon.includes('ban') || /AdBlock/i.test(taskName) ||
          taskIcon.includes('envelope') || taskFinished) {
          debug('跳过无效或已完成任务');
          return true;
        }

        const taskHref = taskDes.attr('href');
        if (!taskHref) {
          debug('任务链接为空');
          return false;
        }

        try {
          debug('获取重定向链接', { taskHref });
          const taskLink = await getRedirectLink(taskHref, taskType.includes('steam'));
          if (!taskLink) {
            debug('获取重定向链接失败');
            return false;
          }

          if (taskType === 'steam.game.wishlist' && appId) {
            debug('添加 Steam 愿望单任务', { appId });
            this.undoneTasks.steam.wishlistLinks.push(`https://store.steampowered.com/app/${appId}`);
            return true;
          }

          debug('分类任务', { taskLink, taskType });
          this.#classifyTaskByType(taskLink, taskType, taskIcon, taskName, taskDes);
          return true;
        } catch (error) {
          debug('获取重定向链接失败', { error });
          throwError(error as Error, 'GiveeClub.classifyTask->getRedirectLink');
          return false;
        }
      };

      debug('开始处理所有任务');
      await Promise.all(Array.from(tasks).map(processTask));
      debug('任务处理完成');
      logStatus.success();

      this.undoneTasks = this.uniqueTasks(this.undoneTasks) as gasSocialTasks;
      this.socialTasks = this.undoneTasks;

      debug('保存任务信息');
      GM_setValue(`gcTasks-${this.giveawayId}`, {
        tasks: this.socialTasks,
        time: new Date().getTime()
      });

      return true;
    } catch (error) {
      debug('任务分类失败', { error });
      throwError(error as Error, 'GiveeClub.classifyTask');
      return false;
    }
  }

  /**
   * 分类单个任务类型的私有方法
   *
   * @param {string} taskLink - 任务链接
   * @param {string | undefined} taskType - 任务类型
   * @param {string} taskIcon - 任务图标类名
   * @param {string} taskName - 任务名称
   * @param {JQuery} taskDes - 任务描述元素
   * @returns {void}
   * @throws {Error} 如果在分类过程中发生错误，将抛出错误
   *
   * @description
   * 该方法根据任务的各种属性（链接、类型、图标、名称等）将任务分类到相应的类别中。
   * 使用提前返回的方式处理每种任务类型，避免复杂的嵌套结构。
   * 支持多种社交平台的任务分类，包括Steam、YouTube、Twitter等。
   */
  #classifyTaskByType(taskLink: string, taskType: string | undefined,
    taskIcon: string, taskName: string, taskDes: JQuery): void {
    try {
      debug('开始分类任务', { taskLink, taskType, taskIcon, taskName });

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
        this.undoneTasks.steam.wishlistLinks.push(
          `https://store.steampowered.com/app/${taskDes.attr('data-steam-wishlist-appid')}`
        );
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
        debug('添加 Steam 游戏时长任务', { time });
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
        // debug('添加 Instagram 关注任务');
        // this.undoneTasks.instagram.userLinks.push(taskLink);
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

      if (/(watch|like).*youtube.*video/gim.test(taskName) ||
        ((taskIcon.includes('youtube') || taskIcon.includes('thumbs-up')) && /(watch|like).*video/gim.test(taskName))) {
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

      debug('未识别的任务类型', { taskLink, taskType, taskIcon, taskName });
    } catch (error) {
      debug('任务分类失败', { error });
      throwError(error as Error, 'GiveeClub.classifyTaskByType');
      return;
    }
  }

  /**
   * 验证任务的异步方法
   *
   * @returns {Promise<boolean>} 如果任务验证成功，则返回 true；否则返回 false。
   *
   * @throws {Error} 如果在验证过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法遍历页面中的所有任务按钮，点击每个按钮以验证任务。
   * 在点击按钮后，如果按钮的类型不是 'steam.game.wishlist'，则等待 1 秒。
   * 验证完成后，记录成功信息并返回 true。
   * 如果在过程中发生错误，则记录错误信息并返回 false。
   */
  async verifyTask(): Promise<boolean> {
    try {
      debug('开始验证任务');
      const logStatus = echoLog({ text: __('giveeClubVerifyNotice') });

      const taskButtons = $('.event-actions tr button').has('i.glyphicon-refresh')
        .not('[data-type="user.adblock"]');
      debug('找到需要验证的任务按钮', { count: taskButtons.length });

      for (const button of taskButtons) {
        debug('点击验证按钮', { type: $(button).attr('data-type') });
        button.click();
        if ($(button).attr('data-type') !== 'steam.game.wishlist') {
          debug('等待1秒');
          await delay(1000);
        }
      }

      debug('任务验证完成');
      logStatus.warning(__('giveeClubVerifyFinished'));
      return true;
    } catch (error) {
      debug('任务验证失败', { error });
      throwError(error as Error, 'Givekey.verifyTask');
      return false;
    }
  }

  /**
   * 检查用户是否已登录的私有方法
   *
   * @returns {boolean} 如果用户已登录，则返回 true；否则返回 false。
   *
   * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法检查全局选项中是否启用了登录检查功能。
   * 如果启用且页面中存在登录链接，则重定向用户到登录页面。
   * 如果没有找到登录链接，则返回 true，表示用户已登录或不需要登录。
   */
  #checkLogin(): boolean {
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
      debug('登录检查完成', { needLogin });
      return true;
    } catch (error) {
      debug('登录检查失败', { error });
      throwError(error as Error, 'GiveeClub.checkLogin');
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
   * 该方法从当前窗口的URL中提取抽奖ID。
   * 使用正则表达式匹配URL中的抽奖ID部分。
   * 如果成功匹配到抽奖ID，则将其赋值给实例属性 `giveawayId` 并返回 true。
   * 如果未能匹配到抽奖ID，则记录错误信息并返回 false。
   */
  #getGiveawayId(): boolean {
    try {
      debug('从URL获取抽奖ID');
      const giveawayId = window.location.href.match(/\/event\/([\d]+)/)?.[1];
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
      throwError(error as Error, 'GiveeClub.getGiveawayId');
      return false;
    }
  }

  /**
   * 检查剩余密钥的私有异步方法
   *
   * @returns {Promise<boolean>} 如果检查成功或不需要检查，则返回 true；如果发生错误，则返回 false。
   * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法首先检查全局选项中是否启用了检查剩余密钥的功能。
   * 如果未启用，直接返回 true。
   * 检查活动是否已结束且没有获奖者：
   * - 如果两个条件都满足，显示确认对话框
   * - 如果用户确认，关闭当前窗口
   * - 如果用户取消或对话框关闭，继续执行
   * 所有情况下都返回 true，除非发生错误。
   */
  async #checkLeftKey(): Promise<boolean> {
    try {
      debug('检查剩余密钥');
      if (!globalOptions.other.checkLeftKey) {
        debug('跳过密钥检查');
        return true;
      }

      const isEnded = $('.event-ended').length > 0;
      const hasNoWinner = $('.event-winner').length === 0;
      debug('检查抽奖状态', { isEnded, hasNoWinner });

      if (!(isEnded && hasNoWinner)) {
        return true;
      }

      debug('没有剩余密钥，显示确认对话框');
      const { value } = await Swal.fire({
        icon: 'warning',
        title: __('notice'),
        text: __('giveawayEnded'),
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
      throwError(error as Error, 'GiveeClub.checkLeftKey');
      return false;
    }
  }
}

export default GiveeClub;
