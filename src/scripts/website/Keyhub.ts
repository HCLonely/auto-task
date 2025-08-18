/*
 * @Author       : HCLonely
 * @Date         : 2021-11-11 14:02:46
 * @LastEditTime : 2025-08-18 19:06:20
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/website/Keyhub.ts
 * @Description  : https://key-hub.eu/
 */

import Swal from 'sweetalert2';
import Website from './Website';
import throwError from '../tools/throwError';
import echoLog from '../echoLog';
import __ from '../tools/i18n';
import { getRedirectLink } from '../tools/tools';
import { globalOptions } from '../globalOptions';
import httpRequest from '../tools/httpRequest';
import { debug } from '../tools/debug';

const defaultTasksTemplate: khSocialTasks = {
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
const defaultTasks = JSON.stringify(defaultTasksTemplate);

/**
 * Keyhub 类用于处理与 Keyhub 网站相关的任务和操作。
 *
 * @class Keyhub
 * @extends Website
 *
 * @property {string} name - 网站名称，默认为 'Keyhub'。
 * @property {khSocialTasks} socialTasks - 存储社交任务的对象。
 * @property {khSocialTasks} undoneTasks - 存储未完成任务的对象。
 * @property {Array<string>} buttons - 可用的操作按钮数组。
 *
 * @method static test - 检查当前域名是否为 Keyhub 网站。
 * @returns {boolean} 如果当前域名为 'key-hub.eu'，则返回 true；否则返回 false。
 *
 * @method after - 页面加载后的异步方法，检查用户登录状态和剩余密钥。
 * @returns {Promise<void>} 无返回值。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 *
 * @method init - 初始化方法，尝试初始化抽奖功能。
 * @returns {boolean} 如果初始化成功，则返回 true；否则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 *
 * @method classifyTask - 分类任务的异步方法，根据操作类型分类任务。
 * @param {string} action - 要执行的操作类型，'do' 表示执行任务，'undo' 表示撤销任务。
 * @returns {Promise<boolean>} 如果任务分类成功，则返回 true；否则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 *
 * @method extraDoTask - 执行额外视频任务的异步方法。
 * @param {Object} params - 方法参数对象。
 * @param {Array<string>} params.videoTasks - 包含要执行的视频任务数据的数组。
 * @returns {Promise<boolean>} 如果所有任务成功执行，则返回 true；否则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 *
 * @private
 * @method #doScriptTask - 执行脚本任务的私有异步方法。
 * @param {string} data - 要执行的任务数据。
 * @returns {Promise<boolean>} 如果任务成功执行，则返回 true；否则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
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
 *
 * @private
 * @method #checkLogin - 检查用户是否已登录的私有方法。
 * @returns {boolean} 如果用户已登录，则返回 true；否则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 */
class Keyhub extends Website {
  name = 'Keyhub';
  socialTasks: khSocialTasks = JSON.parse(defaultTasks);
  undoneTasks: khSocialTasks = JSON.parse(defaultTasks);
  buttons: Array<string> = [
    'doTask',
    'undoTask'
  ];

  /**
   * 检查当前域名是否为 Keyhub 网站的静态方法
   *
   * @returns {boolean} 如果当前域名为 'key-hub.eu'，则返回 true；否则返回 false。
   *
   * @description
   * 该方法通过比较当前窗口的域名来判断是否为 Keyhub 网站。
   * 如果域名匹配，则返回 true；否则返回 false。
   */
  static test(): boolean {
    const { host } = window.location;
    const isMatch = host === 'key-hub.eu';
    debug('检查网站匹配', { host, isMatch });
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
   * 最后，隐藏页面中的 NSFW 内容。
   */
  async after(): Promise<void> {
    try {
      debug('开始执行后续操作');
      if (!this.#checkLogin()) {
        debug('检查登录失败');
        echoLog({}).warning(__('checkLoginFailed'));
      }
      if (!await this.#checkLeftKey()) {
        debug('检查剩余密钥失败');
        echoLog({}).warning(__('checkLeftKeyFailed'));
      }
      debug('隐藏 NSFW 内容');
      $('.NSFW').hide();
    } catch (error) {
      debug('后续操作失败', { error });
      throwError(error as Error, 'Keyhub.after');
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
   * 首先记录初始化状态。如果页面中存在 Steam 登录链接，则重定向用户到 Steam 登录页面，并记录警告信息。
   * 然后调用私有方法获取抽奖ID，如果获取失败，则返回 false。
   * 隐藏 VPN 覆盖层并显示主文章部分。
   * 如果成功初始化，则将 `initialized` 属性设置为 true，并记录成功信息。
   */
  init(): boolean {
    try {
      debug('开始初始化');
      const logStatus = echoLog({ text: __('initing') });
      if ($('a[href*="/connect/steam"]').length > 0) {
        debug('需要登录 Steam');
        window.open('/connect/steam', '_self');
        logStatus.warning(__('needLogin'));
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
      debug('初始化失败', { error });
      throwError(error as Error, 'Keyhub.init');
      return false;
    }
  }

  /**
   * 分类任务的异步方法
   *
   * @param {string} action - 要执行的操作类型，'do' 表示执行任务，'undo' 表示撤销任务。
   * @returns {Promise<boolean>} 如果任务分类成功，则返回 true；否则返回 false。
   *
   * @throws {Error} 如果在分类过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法根据传入的操作类型分类任务。
   * 如果操作为 'undo'，则从存储中获取任务信息。
   * 遍历页面中的任务，提取任务链接并根据任务类型分类到相应的社交任务列表中。
   * 处理完成后，记录成功信息并将分类后的任务存储到本地。
   */
  async classifyTask(action: string): Promise<boolean> {
    try {
      debug('开始分类任务', { action });
      const logStatus = echoLog({ text: __('getTasksInfo') });
      if (action === 'undo') {
        debug('恢复已保存的任务信息');
        this.socialTasks = GM_getValue<khGMTasks>(`khTasks-${this.giveawayId}`)?.tasks || JSON.parse(defaultTasks);
      }

      const tasks = $('.task:not(".googleads")')
        .filter((index, element) => (action === 'do' ? $(element).find('i.fa-check-circle:visible').length === 0 : true))
        .find('a');
      debug('找到任务', { count: tasks.length });

      for (const task of tasks) {
        let link = $(task).attr('href');
        const taskDes = $(task).text()
          .trim();
        debug('处理任务', { taskDes, link });

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
          GM_openInTab(link, { active: true });
          continue;
        }

        if (/steamcommunity\.com\/groups\//.test(link)) {
          debug('处理 Steam 组任务');
          if (action === 'undo') this.socialTasks.steam.groupLinks.push(link);
          if (action === 'do') this.undoneTasks.steam.groupLinks.push(link);
          continue;
        }

        if (/steamcommunity\.com\/games\/[\d]+/.test(link)) {
          debug('处理 Steam 官方组任务');
          if (action === 'undo') this.socialTasks.steam.officialGroupLinks.push(link);
          if (action === 'do') this.undoneTasks.steam.officialGroupLinks.push(link);
          continue;
        }

        if (/store\.steampowered\.com\/app\//.test(link) && /wishlist/gim.test(taskDes)) {
          debug('处理 Steam 愿望单任务');
          if (action === 'undo') this.socialTasks.steam.wishlistLinks.push(link);
          if (action === 'do') this.undoneTasks.steam.wishlistLinks.push(link);
          continue;
        }

        if (/store\.steampowered\.com\/curator\//.test(link)) {
          debug('处理 Steam 鉴赏家任务');
          if (action === 'undo') this.socialTasks.steam.curatorLinks.push(link);
          if (action === 'do') this.undoneTasks.steam.curatorLinks.push(link);
          continue;
        }

        if (/^https?:\/\/discord\.com\/invite\//.test(link)) {
          debug('处理 Discord 服务器任务');
          if (action === 'undo') this.socialTasks.discord.serverLinks.push(link);
          if (action === 'do') this.undoneTasks.discord.serverLinks.push(link);
          continue;
        }

        if (/^javascript:videoTask.+/.test(link)) {
          debug('处理视频任务');
          if (action === 'do') {
            const taskData = link.match(/javascript:videoTask\('.+?','(.+?)'/)?.[1];
            if (taskData) {
              debug('添加视频任务', { taskData });
              this.undoneTasks.extra.videoTasks.push(taskData);
            }
          }
          continue;
        }

        if (this.#isSkippableLink(link)) {
          debug('跳过可忽略的链接', { link });
          continue;
        }

        debug('未知任务类型', { taskDes, link });
        echoLog({}).warning(`${__('unKnownTaskType')}: ${taskDes}(${link})`);
      }

      debug('任务分类完成');
      logStatus.success();
      this.undoneTasks = this.uniqueTasks(this.undoneTasks) as khSocialTasks;
      this.socialTasks = this.uniqueTasks(this.socialTasks) as khSocialTasks;
      if (window.DEBUG) console.log('%cAuto-Task[Debug]:', 'color:blue', JSON.stringify(this));
      debug('保存任务信息');
      GM_setValue(`khTasks-${this.giveawayId}`, { tasks: this.socialTasks, time: new Date().getTime() });
      return true;
    } catch (error) {
      debug('任务分类失败', { error });
      throwError(error as Error, 'Keyhub.classifyTask');
      return false;
    }
  }

  /**
   * 检查链接是否为可跳过的类型
   *
   * @param {string} link - 要检查的链接
   * @returns {boolean} 如果链接属于可跳过的类型则返回 true，否则返回 false
   *
   * @description
   * 该方法检查给定的链接是否属于以下可跳过的类型：
   * - Instagram 链接
   * - Twitter 链接
   * - Twitch 链接
   * - Facebook 链接
   * - YouTube 链接
   * - Steam 开发者链接
   * - itch.io 链接
   * - key-hub.eu 链接
   * - Steam 应用链接
   * - StreamElements 链接
   * - Steam 新闻链接
   */
  #isSkippableLink(link: string): boolean {
    return /^https?:\/\/www\.instagram\.com\/.*/.test(link) ||
      /^https?:\/\/twitter\.com\/.*/.test(link) ||
      /^https?:\/\/www\.twitch\.tv\/.*/.test(link) ||
      /^https?:\/\/www\.facebook\.com\/.*/.test(link) ||
      /^https?:\/\/www\.youtube\.com\/.*/.test(link) ||
      /^https?:\/\/store\.steampowered\.com\/developer\//.test(link) ||
      /^https?:\/\/.*?\.itch\.io\/.*/.test(link) ||
      /^https?:\/\/key-hub\.eu.*/.test(link) ||
      /^https?:\/\/store\.steampowered\.com\/app\/.*/.test(link) ||
      /^https?:\/\/qr\.streamelements\.com\/.*/.test(link) ||
      /^https?:\/\/store\.steampowered\.com\/news\/app\/.*/.test(link);
  }

  /**
   * 执行脚本任务的私有异步方法
   *
   * @param {string} data - 要执行的任务数据。
   * @returns {Promise<boolean>} 如果任务成功执行，则返回 true；否则返回 false。
   *
   * @throws {Error} 如果在执行过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法按以下顺序执行：
   * 1. 向指定的 URL 发送 GET 请求以执行脚本任务
   * 2. 如果请求结果不是 'Success'，记录错误信息并返回 false
   * 3. 如果响应状态码不是 200，记录错误信息并返回 false
   * 4. 如果以上检查都通过，记录成功信息并返回 true
   * 请求头中包含来源和引用信息以确保请求的合法性
   */
  async #doScriptTask(data: string): Promise<boolean> {
    try {
      debug('执行脚本任务', { data });
      const logStatus = echoLog({ text: __('doingKeyhubTask') });
      const { result, statusText, status, data: response } = await httpRequest({
        url: `/away?data=${data}`,
        method: 'GET',
        headers: {
          origin: 'https://key-hub.eu',
          referer: 'https://key-hub.eu/'
        }
      });

      if (result !== 'Success') {
        debug('请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (response?.status !== 200) {
        debug('响应错误', { status: response?.status, statusText: response?.statusText });
        logStatus.error(`Error:${response?.statusText}(${response?.status})`);
        return false;
      }

      debug('任务完成');
      logStatus.success();
      return true;
    } catch (error) {
      debug('执行脚本任务失败', { error });
      throwError(error as Error, 'Keyhub.doScriptTask');
      return false;
    }
  }

  /**
   * 执行额外视频任务的异步方法
   *
   * @param {Object} params - 方法参数对象。
   * @param {Array<string>} params.videoTasks - 包含要执行的视频任务数据的数组。
   * @returns {Promise<boolean>} 如果所有任务成功执行，则返回 true；否则返回 false。
   *
   * @throws {Error} 如果在执行过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法遍历传入的视频任务数组，并为每个任务调用私有方法 `#doScriptTask`。
   * 所有任务的执行结果将通过 `Promise.all` 进行处理。
   * 如果所有任务成功完成，则返回 true；如果发生错误，则记录错误信息并返回 false。
   */
  async extraDoTask({ videoTasks }: { videoTasks: Array<string> }): Promise<boolean> {
    try {
      debug('开始执行额外任务', { count: videoTasks.length });
      const pro = [];
      for (const data of videoTasks) {
        pro.push(this.#doScriptTask(data));
      }
      return Promise.all(pro).then(() => {
        debug('所有额外任务完成');
        return true;
      });
    } catch (error) {
      debug('执行额外任务失败', { error });
      throwError(error as Error, 'Keyhub.extraDoTask');
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
      debug('获取抽奖ID');
      const giveawayId = window.location.href.match(/giveaway\/([\d]+)/)?.[1];
      if (giveawayId) {
        this.giveawayId = giveawayId;
        debug('获取抽奖ID成功', { giveawayId });
        return true;
      }
      debug('获取抽奖ID失败');
      echoLog({}).error(__('getFailed', 'GiveawayId'));
      return false;
    } catch (error) {
      debug('获取抽奖ID出错', { error });
      throwError(error as Error, 'Keyhub.getGiveawayId');
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
   * 该方法检查全局选项中是否启用了检查剩余密钥的功能。
   * 如果启用且剩余密钥为 0，则弹出警告框提示用户没有剩余密钥。
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

      const leftKey = $('#keysleft').text()
        .trim();
      debug('检查剩余密钥数量', { leftKey });
      if (leftKey !== '0') return true;

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
      throwError(error as Error, 'Keyhub.checkLeftKey');
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
   * 如果启用且页面中存在"连接Steam"的链接，则重定向用户到Steam登录页面。
   * 如果没有找到登录链接，则返回 true，表示用户已登录或不需要登录。
   */
  #checkLogin(): boolean {
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
      debug('检查登录失败', { error });
      throwError(error as Error, 'Keyhub.checkLogin');
      return false;
    }
  }
}

export default Keyhub;
