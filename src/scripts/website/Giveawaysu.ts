/*
 * @Author       : HCLonely
 * @Date         : 2021-11-08 10:37:13
 * @LastEditTime : 2025-08-18 19:07:08
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/website/Giveawaysu.ts
 * @Description  : https://giveaway.su/
 */

import Swal from 'sweetalert2';
import Website from './Website';
import throwError from '../tools/throwError';
import echoLog from '../echoLog';
import __ from '../tools/i18n';
import { getRedirectLink } from '../tools/tools';
import { globalOptions } from '../globalOptions';
import { debug } from '../tools/debug';

const defaultTasks: gasSocialTasks = {
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
  // instagram: {
  //   userLinks: []
  // },
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

/**
 * GiveawaySu 类用于处理 GiveawaySu 网站的抽奖任务。
 *
 * @class GiveawaySu
 * @extends Website
 *
 * @property {string} name - 网站名称。
 * @property {gasSocialTasks} socialTasks - 社交任务列表。
 * @property {gasSocialTasks} undoneTasks - 未完成的社交任务。
 * @property {Array<string>} buttons - 可用的操作按钮。
 *
 * @static
 * @method test - 检查当前URL是否为有效的抽奖页面。
 * @returns {boolean} 如果当前URL匹配抽奖页面的格式，则返回 true；否则返回 false。
 *
 * @method after - 处理抽奖后续操作的异步方法。
 * @returns {Promise<void>} 无返回值。
 * @throws {Error} 如果在处理过程中发生错误，将抛出错误。
 *
 * @method init - 初始化方法。
 * @returns {boolean} 如果初始化成功，则返回 true；否则返回 false。
 * @throws {Error} 如果在初始化过程中发生错误，将抛出错误。
 *
 * @method classifyTask - 分类任务的异步方法。
 * @param {'do' | 'undo'} action - 要执行的操作类型，'do' 表示执行任务，'undo' 表示撤销任务。
 * @returns {Promise<boolean>} 如果任务分类成功，则返回 true；否则返回 false。
 * @throws {Error} 如果在分类过程中发生错误，将抛出错误。
 *
 * @private
 * @method #checkLogin - 检查用户是否已登录的私有方法。
 * @returns {boolean} 如果用户已登录，则返回 true；否则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 *
 * @private
 * @method #checkLeftKey - 检查剩余密钥的私有异步方法。
 * @returns {Promise<boolean>} 如果检查成功，则返回 true；如果发生错误，则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 *
 * @private
 * @method #getGiveawayId - 获取抽奖ID的方法。
 * @returns {boolean} 如果成功获取抽奖ID，则返回 true；否则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 */
class GiveawaySu extends Website {
  name = 'GiveawaySu';
  socialTasks: gasSocialTasks = defaultTasks;
  undoneTasks: gasSocialTasks = defaultTasks;
  buttons: Array<string> = [
    'doTask',
    'undoTask'
  ];

  /**
   * 检查当前URL是否为有效的抽奖页面的静态方法
   *
   * @returns {boolean} 如果当前URL匹配抽奖页面的格式，则返回 true；否则返回 false。
   *
   * @description
   * 该方法使用正则表达式检查当前窗口的URL是否符合抽奖页面的格式。
   * 格式为：以 "http://" 或 "https://" 开头，后跟 "giveaway.su/giveaway/view/" 和一个数字ID。
   */
  static test(): boolean {
    const url = window.location.href;
    const isMatch = /^https?:\/\/giveaway\.su\/giveaway\/view\/[\d]+/.test(url);
    debug('检查网站匹配', { url, isMatch });
    return isMatch;
  }

  /**
   * 页面加载后的异步方法
   *
   * @returns {Promise<void>} 无返回值。
   *
   * @throws {Error} 如果在处理过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法首先检查用户是否已登录，如果未登录，则记录警告信息。
   * 然后检查剩余密钥的状态，如果检查失败，则记录相应的警告信息。
   * 最后，记录一个通用的通知信息。
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
      debug('显示网站通知');
      echoLog({}).warning(__('gsNotice'));
    } catch (error) {
      debug('后续操作失败', { error });
      throwError(error as Error, 'Giveawaysu.after');
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
   * 首先记录初始化状态。如果页面中存在 Steam 登录链接，则重定向到 Steam 登录页面，并记录警告信息。
   * 然后调用私有方法获取抽奖ID，如果获取失败，则返回 false。
   * 如果成功获取抽奖ID，则将 `initialized` 属性设置为 true，并记录成功信息。
   */
  init(): boolean {
    try {
      debug('初始化 GiveawaySu');
      const logStatus = echoLog({ text: __('initing') });

      if ($('a.steam-login').length > 0) {
        debug('发现未登录状态，重定向到 Steam 登录');
        window.open('/steam/redirect', '_self');
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
      throwError(error as Error, 'Giveawaysu.init');
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
   * 如果操作为 'undo'，则从存储中获取任务信息并返回 true。
   * 否则，遍历页面中的任务行，提取任务链接并根据任务类型分类到相应的未完成任务列表中。
   * 处理完成后，记录成功信息并将分类后的任务存储到本地。
   */
  async classifyTask(action: 'do' | 'undo'): Promise<boolean> {
    try {
      debug('开始分类任务', { action });
      const logStatus = echoLog({ text: __('getTasksInfo') });

      if (action === 'undo') {
        debug('恢复已保存的任务信息');
        this.socialTasks = GM_getValue<gasGMTasks>(`gasTasks-${this.giveawayId}`)?.tasks || defaultTasks;
        return true;
      }

      const tasks = $('#actions tr');
      if (!tasks.length) {
        debug('未找到任务');
        logStatus.warning(__('noTasks'));
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

      const processTask = async (task: Element): Promise<boolean> => {
        const td = $(task).find('td:not(".hidden")');
        const colorfulTask = td.eq(1).find('a:not([data-trigger="link"])');
        const colorlessTask = td.eq(2).find('a:not([data-trigger="link"])');
        const taskDes = colorfulTask.length > 0 ? colorfulTask : colorlessTask;

        if (!taskDes.length) {
          debug('跳过无效任务');
          return true;
        }

        const taskIcon = td.eq(0).find('i')
          .attr('class') || '';
        const taskName = taskDes.text().trim();
        const taskHref = taskDes.attr('href');

        debug('处理任务', { taskIcon, taskName, taskHref });

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
          debug('分类任务', { taskLink, taskIcon, taskName });
          this.#classifyTaskByType(taskLink, taskIcon, taskName);
          return true;
        } catch (error) {
          debug('获取重定向链接失败', { error });
          throwError(error as Error, 'Giveawaysu.classifyTask->getRedirectLink');
          return false;
        }
      };

      debug('开始处理所有任务');
      const results = await Promise.all(Array.from(tasks).map(processTask));
      const success = results.some((result) => result);

      if (!success) {
        debug('所有任务处理失败');
        logStatus.error(__('allTasksFailed'));
        return false;
      }

      debug('任务处理完成');
      logStatus.success();

      this.undoneTasks = this.uniqueTasks(this.undoneTasks) as gasSocialTasks;
      this.socialTasks = this.undoneTasks;

      debug('保存任务信息');
      GM_setValue(`gasTasks-${this.giveawayId}`, {
        tasks: this.socialTasks,
        time: new Date().getTime()
      });

      return true;
    } catch (error) {
      debug('任务分类失败', { error });
      throwError(error as Error, 'Giveawaysu.classifyTask');
      return false;
    }
  }

  // 预编译正则表达式以提高性能
  static readonly TASK_PATTERNS = {
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

  #classifyTaskByType(taskLink: string, taskIcon: string, taskName: string): void {
    try {
      debug('开始分类任务', { taskLink, taskIcon, taskName });
      const { TASK_PATTERNS } = GiveawaySu;

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
        // debug('添加 Instagram 关注任务');
        // this.undoneTasks.instagram.userLinks.push(taskLink);
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

      if (TASK_PATTERNS.youtubeVideo.test(taskName) ||
        ((taskIcon.includes('youtube') || taskIcon.includes('thumbs-up')) && TASK_PATTERNS.youtubeVideo.test(taskName))) {
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

      debug('未识别的任务类型', { taskLink, taskIcon, taskName });
    } catch (error) {
      debug('任务分类失败', { error });
      throwError(error as Error, 'Giveawaysu.classifyTaskByType');
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
   * 如果启用且页面中存在 Steam 登录链接，则重定向用户到 Steam 登录页面。
   * 如果没有找到登录链接，则返回 true，表示用户已登录或不需要登录。
   */
  #checkLogin(): boolean {
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
      debug('登录检查完成', { needLogin });
      return true;
    } catch (error) {
      debug('登录检查失败', { error });
      throwError(error as Error, 'Giveawaysu.checkLogin');
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
   * 该方法首先检查全局选项中是否启用了检查剩余密钥的功能。
   * 如果启用且当前抽奖已结束且没有剩余密钥，则弹出警告框提示用户没有剩余密钥。
   * 用户可以选择确认或取消，确认后将关闭窗口。
   * 如果没有错误发生，则返回 true。
   */
  async #checkLeftKey(): Promise<boolean> {
    try {
      debug('检查剩余密钥');
      if (!globalOptions.other.checkLeftKey) {
        debug('跳过密钥检查');
        return true;
      }

      const isEnded = $('.giveaway-ended').length > 0;
      const hasNoKeys = $('.giveaway-key').length === 0;
      debug('检查抽奖状态', { isEnded, hasNoKeys });

      if (!(isEnded && hasNoKeys)) {
        return true;
      }

      debug('没有剩余密钥，显示确认对话框');
      const { value } = await Swal.fire({
        icon: 'warning',
        title: __('notice'),
        text: __('noKeysLeft'),
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
      throwError(error as Error, 'Giveawaysu.checkLeftKey');
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
      const giveawayId = window.location.href.match(/\/view\/([\d]+)/)?.[1];
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
      throwError(error as Error, 'Giveawaysu.getGiveawayId');
      return false;
    }
  }
}

export { GiveawaySu, defaultTasks };
