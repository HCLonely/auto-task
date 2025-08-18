/*
 * @Author       : HCLonely
 * @Date         : 2021-11-13 17:57:40
 * @LastEditTime : 2025-08-18 19:06:52
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/website/Givekey.ts
 * @Description  : https://givekey.ru
 */

import Swal from 'sweetalert2';
import Website from './Website';
import echoLog from '../echoLog';
import __ from '../tools/i18n';
import { delay, getRedirectLink, unique } from '../tools/tools';
import throwError from '../tools/throwError';
import { globalOptions } from '../globalOptions';
import { debug } from '../tools/debug';

const defaultTasksTemplate: gkSocialTasks = {
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
const defaultTasks = JSON.stringify(defaultTasksTemplate);

/**
 * 表示 Givekey 网站的任务处理类。
 *
 * @class Givekey
 * @extends Website
 *
 * @property {string} name - 网站名称。
 * @property {Array<string>} tasks - 存储任务ID的数组。
 * @property {gkSocialTasks} socialTasks - 存储社交任务的对象。
 * @property {gkSocialTasks} undoneTasks - 存储未完成任务的对象。
 * @property {string} userId - 用户ID。
 * @property {Array<string>} buttons - 包含 'doTask'、'undoTask' 和 'verifyTask' 的按钮数组。
 *
 * @method static test - 检查当前域名是否为 Givekey 网站。
 * @returns {boolean} 如果当前域名为 'givekey.ru'，则返回 true；否则返回 false。
 *
 * @method after - 页面加载后的异步方法。
 * @returns {Promise<void>} 无返回值。
 * @throws {Error} 如果在处理过程中发生错误，将抛出错误。
 *
 * @method init - 初始化方法。
 * @returns {boolean} 如果初始化成功，则返回 true；否则返回 false。
 * @throws {Error} 如果在初始化过程中发生错误，将抛出错误。
 *
 * @method classifyTask - 分类任务的异步方法。
 * @param {'do' | 'undo' | 'verify'} action - 要执行的操作类型。
 * @returns {Promise<boolean>} 如果任务分类成功，则返回 true；否则返回 false。
 * @throws {Error} 如果在分类过程中发生错误，将抛出错误。
 *
 * @method verifyTask - 验证任务的异步方法。
 * @returns {Promise<boolean>} 如果所有任务成功验证，则返回 true；否则返回 false。
 * @throws {Error} 如果在验证过程中发生错误，将抛出错误。
 *
 * @method #verify - 验证任务的私有异步方法。
 * @param {string} task - 要验证的任务ID。
 * @returns {Promise<boolean>} 如果任务验证成功，则返回 true；否则返回 false。
 * @throws {Error} 如果在验证过程中发生错误，将抛出错误。
 *
 * @method #getGiveawayId - 获取抽奖ID的方法。
 * @returns {boolean} 如果成功获取抽奖ID，则返回 true；否则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 *
 * @method #checkLeftKey - 检查剩余密钥的私有异步方法。
 * @returns {Promise<boolean>} 如果检查成功，则返回 true；如果发生错误，则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 */
class Givekey extends Website {
  name = 'Givekey';
  tasks: Array<string> = [];
  socialTasks: gkSocialTasks = JSON.parse(defaultTasks);
  undoneTasks: gkSocialTasks = JSON.parse(defaultTasks);
  userId!: string;
  buttons: Array<string> = [
    'doTask',
    'undoTask',
    'verifyTask'
  ];

  /**
   * 检查当前域名是否为 Givekey 网站的静态方法
   *
   * @returns {boolean} 如果当前域名为 'givekey.ru'，则返回 true；否则返回 false。
   *
   * @description
   * 该方法通过比较当前窗口的域名来判断是否为 Givekey 网站。
   * 如果域名匹配，则返回 true；否则返回 false。
   */
  static test(): boolean {
    const url = window.location.host;
    const isMatch = url === 'givekey.ru';
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
   * 该方法首先等待导航栏元素的出现，使用定时器检查元素是否存在。
   * 一旦找到元素，清除定时器并继续执行后续操作。
   * 然后检查剩余密钥的状态，如果检查失败，则记录相应的警告信息。
   */
  async after(): Promise<void> {
    try {
      debug('开始执行后续操作');
      await new Promise((resolve) => {
        const checker = setInterval(() => {
          if ($('#navbarDropdown').length > 0) {
            debug('导航栏元素已加载');
            clearInterval(checker);
            resolve(true);
          }
        }, 500);
      });
      if (!await this.#checkLeftKey()) {
        debug('检查剩余密钥失败');
        echoLog({}).warning(__('checkLeftKeyFailed'));
      }
    } catch (error) {
      debug('后续操作失败', { error });
      throwError(error as Error, 'Givekey.after');
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
   * 接着从页面的 meta 标签中获取用户ID，如果未找到用户ID，则记录错误信息并返回 false。
   * 如果成功获取用户ID，则将其赋值给实例属性 `userId`，并将 `initialized` 属性设置为 true，最后记录成功信息。
   */
  init(): boolean {
    try {
      debug('初始化 Givekey');
      const logStatus = echoLog({ text: __('initing') });
      if ($('a[href*="/auth/steam"]').length > 0) {
        debug('未登录，重定向到 Steam 登录页面');
        window.open('/auth/steam', '_self');
        logStatus.warning(__('needLogin'));
        return false;
      }
      if (!this.#getGiveawayId()) {
        debug('获取抽奖ID失败');
        return false;
      }
      const userId = $('meta[name="user-id"]').attr('content');
      if (!userId) {
        debug('获取用户ID失败');
        logStatus.error(__('getFailed', __('userId')));
        return false;
      }
      this.userId = userId;
      this.initialized = true;
      debug('初始化完成', { userId });
      logStatus.success();
      return true;
    } catch (error) {
      debug('初始化失败', { error });
      throwError(error as Error, 'Givekey.init');
      return false;
    }
  }

  /**
   * 分类任务的异步方法
   *
   * @param {'do' | 'undo' | 'verify'} action - 要执行的操作类型
   * @returns {Promise<boolean>} 如果任务分类成功，则返回 true；否则返回 false
   * @throws {Error} 如果在分类过程中发生错误，将抛出错误
   *
   * @description
   * 该方法根据传入的操作类型分类任务：
   * - 'undo': 从存储中恢复之前保存的任务信息
   * - 'verify': 仅收集任务ID用于验证
   * - 'do': 收集并分类新的任务
   *
   * 处理流程：
   * 1. 获取页面中的所有任务元素
   * 2. 对每个任务进行分类处理
   * 3. 更新任务列表并保存到存储中
   */
  async classifyTask(action: 'do' | 'undo' | 'verify'): Promise<boolean> {
    try {
      debug('开始分类任务', { action });
      const logStatus = echoLog({ text: __('getTasksInfo') });

      if (action === 'undo') {
        debug('恢复已保存的任务信息');
        this.socialTasks = GM_getValue<gkGMTasks>(`gkTasks-${this.giveawayId}`)?.tasks || JSON.parse(defaultTasks);
      }

      const tasks = $('.card-body:has("button") .row');
      debug('找到任务元素', { count: tasks.length });

      for (const task of tasks) {
        const taskEle = $(task);
        const button = taskEle.find('button');
        const isSuccess = /Complete/i.test(button.text().trim());
        debug('处理任务', { isSuccess });

        if (isSuccess && action !== 'undo') {
          debug('跳过已完成的任务');
          continue;
        }

        const checkButton = taskEle.find('#task_check');
        const taskId = checkButton.attr('data-id');
        if (taskId) {
          debug('添加任务ID', { taskId });
          this.tasks.push(taskId);
        }

        if (action === 'verify') continue;

        const taskLink = taskEle.find('a');
        let href: string | undefined | null = taskLink.attr('href');
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
          debug('获取重定向链接', { href });
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
      this.undoneTasks = this.uniqueTasks(this.undoneTasks) as gkSocialTasks;
      this.socialTasks = this.uniqueTasks(this.socialTasks) as gkSocialTasks;

      debug('保存任务信息');
      GM_setValue(`gkTasks-${this.giveawayId}`, {
        tasks: this.socialTasks,
        time: new Date().getTime()
      });

      return true;
    } catch (error) {
      debug('任务分类失败', { error });
      throwError(error as Error, 'Givekey.classifyTask');
      return false;
    }
  }

  /**
   * 验证任务的异步方法
   *
   * @returns {Promise<boolean>} 如果所有任务成功验证，则返回 true；否则返回 false。
   *
   * @throws {Error} 如果在验证过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法首先检查是否已初始化，如果未初始化则调用初始化方法。
   * 然后检查任务列表是否为空，如果为空则调用分类任务的方法进行分类。
   * 接着记录验证前的提示信息，并依次验证每个任务。
   * 在验证每个任务之间，等待 15 秒的延迟。
   * 最后记录所有任务完成的信息，并返回 true。
   */
  async verifyTask(): Promise<boolean> {
    try {
      debug('开始验证任务');
      if (!this.initialized && !this.init()) {
        debug('初始化失败');
        return false;
      }
      if (this.tasks.length === 0 && !(await this.classifyTask('verify'))) {
        debug('任务分类失败');
        return false;
      }
      echoLog({}).warning(__('giveKeyNoticeBefore'));
      const taskLength = this.tasks.length;
      debug('开始验证任务', { taskCount: taskLength });

      for (let i = 0; i < taskLength; i++) {
        await this.#verify(this.tasks[i]);
        if (i < (taskLength - 1)) {
          debug('等待15秒');
          await delay(15000);
        }
      }

      debug('所有任务验证完成');
      echoLog({}).success(__('allTasksComplete'));
      echoLog({ html: `<li><font class="warning">${__('giveKeyNoticeAfter')}</font></li>` });
      return true;
    } catch (error) {
      debug('任务验证失败', { error });
      throwError(error as Error, 'Givekey.verifyTask');
      return false;
    }
  }

  /**
   * 验证任务的私有异步方法
   *
   * @param {string} task - 要验证的任务ID。
   * @returns {Promise<boolean>} 如果任务验证成功，则返回 true；否则返回 false。
   *
   * @throws {Error} 如果在验证过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法向服务器发送请求以验证指定的任务。
   * 首先记录正在验证的任务状态。
   * 发送 POST 请求到指定的 URL，并传递任务ID和用户ID。
   * 如果请求成功且返回状态为 'ok'，则更新按钮状态并记录成功信息。
   * 如果返回状态为 'end'，则记录成功信息并返回密钥。
   * 如果发生错误，则记录错误信息并返回 false。
   */
  async #verify(task: string): Promise<boolean> {
    try {
      debug('验证任务', { taskId: task });
      const logStatus = echoLog({ html: `<li>${__('verifyingTask')}${task}...<font></font></li>` });
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

      debug('处理响应', { response });
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

      debug('验证失败', { error: response.msg });
      logStatus.error(`Error:${response.msg}`);
      return false;
    } catch (error) {
      debug('验证过程出错', { error });
      throwError(error as Error, 'Givekey.verify');
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
      const giveawayId = window.location.href.match(/giveaway\/([\d]+)/)?.[1];
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
      throwError(error as Error, 'Givekey.getGiveawayId');
      return false;
    }
  }

  /**
   * 检查剩余密钥的私有异步方法
   *
   * @returns {Promise<boolean>} 如果检查成功或不需要检查，则返回 true；如果发生错误，则返回 false
   * @throws {Error} 如果在检查过程中发生错误，将抛出错误
   *
   * @description
   * 该方法检查是否还有可用的密钥：
   * 1. 首先检查是否启用了密钥检查功能
   * 2. 检查页面上是否显示有剩余密钥
   * 3. 如果没有剩余密钥：
   *    - 显示警告对话框
   *    - 用户确认后关闭窗口
   *    - 用户取消则继续执行
   * 4. 所有情况下返回 true，除非发生错误
   */
  async #checkLeftKey(): Promise<boolean> {
    try {
      debug('检查剩余密钥');
      if (!globalOptions.other.checkLeftKey) {
        debug('跳过密钥检查');
        return true;
      }

      const keysCount = $('#keys_count').text();
      debug('检查密钥数量', { keysCount });
      if (keysCount) return true;

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
      throwError(error as Error, 'Givekey.checkLeftKey');
      return false;
    }
  }

  /**
   * 分类单个任务类型的私有异步方法
   *
   * @private
   * @async
   * @param {string} href - 任务链接URL
   * @param {string} text - 任务描述文本
   * @param {JQuery} icon - 任务图标的jQuery对象
   * @param {boolean} isSuccess - 任务是否已完成的标志
   * @param {string} action - 执行的操作类型（'do'、'undo' 或 'verify'）
   * @returns {Promise<void>} 无返回值的Promise
   * @throws {Error} 在任务分类过程中发生错误时抛出
   *
   * @description
   * 该方法根据任务的属性将其分类到不同的社交平台任务类别中。
   * 支持的任务类型包括：
   * - VK社交平台任务：匹配 vk.com 域名
   * - Steam群组任务：匹配 steamcommunity.com/groups
   * - Steam愿望单任务：匹配 store.steampowered.com/app
   * - Steam鉴赏家任务：
   *   - 匹配 store.steampowered.com/curator（关注鉴赏家）
   *   - 其他Steam相关任务（点赞鉴赏家）
   * - Twitter关注任务：匹配 twitter.com 且包含 Subscribe 文本
   * - Discord服务器任务：包含 discord 图标或匹配 discord.com/invite
   *
   * 处理流程：
   * 1. 检查任务链接URL的格式
   * 2. 根据URL、文本内容和图标类型确定任务类别
   * 3. 将任务添加到对应的社交任务列表中
   * 4. 如果是 'do' 操作且任务未完成，同时添加到未完成任务列表
   * 5. 如果无法识别任务类型，记录警告信息
   */
  async #classifyTaskByType(href: string, text: string, icon: JQuery, isSuccess: boolean, action: string): Promise<void> {
    try {
      debug('开始分类任务类型', { href, text, isSuccess, action });

      if (/^https?:\/\/vk\.com\//.test(href)) {
        debug('添加 VK 任务');
        this.socialTasks.vk.nameLinks.push(href);
        if (action === 'do' && !isSuccess) this.undoneTasks.vk.nameLinks.push(href);
        return;
      }

      if (/^https?:\/\/steamcommunity\.com\/groups/.test(href)) {
        debug('添加 Steam 组任务');
        this.socialTasks.steam.groupLinks.push(href);
        if (action === 'do' && !isSuccess) this.undoneTasks.steam.groupLinks.push(href);
        return;
      }

      if (/^https?:\/\/store\.steampowered\.com\/app\//.test(href)) {
        debug('添加 Steam 愿望单任务');
        this.socialTasks.steam.wishlistLinks.push(href);
        if (action === 'do' && !isSuccess) this.undoneTasks.steam.wishlistLinks.push(href);
        return;
      }

      if (/Subscribe/gi.test(text) && icon.hasClass('fa-steam-square')) {
        if (/^https?:\/\/store\.steampowered\.com\/curator\//.test(href)) {
          debug('添加 Steam 鉴赏家关注任务');
          this.socialTasks.steam.curatorLinks.push(href);
          if (action === 'do' && !isSuccess) this.undoneTasks.steam.curatorLinks.push(href);
        } else {
          debug('添加 Steam 鉴赏家点赞任务');
          this.socialTasks.steam.curatorLikeLinks.push(href);
          if (action === 'do' && !isSuccess) this.undoneTasks.steam.curatorLikeLinks.push(href);
        }
        return;
      }

      if (/^https?:\/\/twitter\.com\//.test(href) && /Subscribe/gi.test(text)) {
        debug('添加 Twitter 关注任务');
        this.socialTasks.twitter.userLinks.push(href);
        if (action === 'do' && !isSuccess) this.undoneTasks.twitter.userLinks.push(href);
        return;
      }

      if (icon.hasClass('fa-discord') || /^https?:\/\/discord\.com\/invite\//.test(href)) {
        debug('添加 Discord 服务器任务');
        this.socialTasks.discord.serverLinks.push(href);
        if (action === 'do' && !isSuccess) this.undoneTasks.discord.serverLinks.push(href);
        return;
      }

      debug('未识别的任务类型', { href, text });
      echoLog({}).warning(`${__('unKnownTaskType')}: ${text}(${href})`);
    } catch (error) {
      debug('任务类型分类失败', { error });
      throwError(error as Error, 'Givekey.classifyTaskByType');
    }
  }
}

export default Givekey;
