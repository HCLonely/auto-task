/*
 * @Author       : HCLonely
 * @Date         : 2021-11-04 14:02:03
 * @LastEditTime : 2026-04-28 09:17:42
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/website/Freeanywhere.ts
 * @Description  : https://freeanywhere.net
 */

import Swal from 'sweetalert2';
import Website from './Website';
import throwError from '../tools/throwError';
import echoLog from '../echoLog';
import __ from '../tools/i18n';
import httpRequest from '../tools/httpRequest';
import { delay } from '../tools/tools';
import { debug } from '../tools/debug';
import { globalOptions } from '../globalOptions';
import { normalizeStoredTasks } from './taskModel';

/**
 * FreeAnyWhere 类用于处理与 FreeAnywhere 网站相关的任务和操作。
 *
 * @class FreeAnywhere
 * @extends Website
 *
 * @property {string} name - 网站名称。
 * @property {Array<fawTaskInfo>} verifyTasks - 当前验证任务列表。
 * @property {Array<string>} buttons - 可用操作按钮列表。
 * @property {string} giveawayId - 抽奖ID。
 *
 * @method static test - 检查当前窗口的域名是否为 'freeanywhere.net'。
 *
 * @method init - 初始化函数，负责检查用户的登录状态和当前 URL 的有效性。
 * @method classifyTask - 根据指定的操作分类任务。
 * @method verifyTask - 验证任务的异步方法。
 * @method getKey - 获取奖励密钥的异步方法。
 * @method #verify - 验证任务的私有异步方法。
 *
 */
class FreeAnyWhere extends Website {
  static type = 'website';
  name = 'FreeAnyWhere';
  verifyTasks: Array<fawTaskInfo> = [];
  games!: Record<string, { playtime_forever: number }>;
  buttons: Array<string> = [
    'doTask',
    'undoTask',
    'verifyTask',
    'getKey'
  ];

  /**
   * 检查当前窗口的域名是否为 'freeanywhere.net'
   *
   * @returns {boolean} 如果域名匹配则返回 true，否则返回 false
   */
  static test(): boolean {
    const isMatch = window.location.host === 'freeanywhere.net';
    debug('检查网站匹配', { host: window.location.host, isMatch });
    return isMatch;
  }

  /**
   * 初始化函数，负责检查用户的登录状态和当前 URL 的有效性。
   *
   * @returns {Promise<boolean>} 如果初始化成功返回 true，否则返回 false。
   *
   * @throws {Error} 如果在初始化过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数首先记录初始化状态，然后检查用户是否已登录。如果用户未登录，将重定向到登录页面。
   * 接着，函数验证当前 URL 是否符合预期格式。如果不符合，将提取 giveaway ID 并重定向到正确的 URL。
   * 最后，函数检查剩余的密钥数量，并更新初始化状态。
   */
  async init(): Promise<boolean> {
    try {
      debug('初始化 FreeAnyWhere', { url: window.location.href });
      const logStatus = echoLog({ text: __('initing') });

      debug('检测登录状态');
      if ($('div.header__login a[href*=logout]').length === 0) {
        debug('未登录，准备跳转到登录页面');
        window.open('https://freeanywhere.net/game.php?steam_login', '_self');
        logStatus.warning(__('needLogin'));
        return false;
      }

      debug('检测是否为登录页面');
      if (window.location.href.includes('/login')) {
        logStatus.warning(__('needLogin'));
        return false;
      }

      if (!await this.#checkLeftKey()) {
        debug('检查剩余密钥失败');
        echoLog({}).warning(__('checkLeftKeyFailed'));
      }
      const giveawayIdSuccess = this.#getGiveawayId();
      debug('获取抽奖ID结果', { success: giveawayIdSuccess, id: this.giveawayId });

      if ($('.task-check-extension').length > 0) {
        debug('需要扩展，暂不支持');
        logStatus.warning(__('needExtensionToDoTask'));
        return false;
      }

      this.initialized = true;
      logStatus.success();
      return true;
    } catch (error) {
      debug('初始化失败', { error });
      throwError(error as Error, 'Freeanywhere.init');
      return false;
    }
  }

  /**
   * 根据指定的操作分类任务。
   *
   * @param {string} action - 要执行的操作类型，支持 'undo'、'verify' 和 'do'。
   * @returns {Promise<boolean>} 如果任务分类成功返回 true，否则返回 false。
   *
   * @throws {Error} 如果在处理过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数首先记录获取任务信息的状态，然后根据传入的操作（如 'undo' 或 'verify'）来处理任务。
   * 如果操作为 'undo'，则从存储中获取之前的任务信息。接着，函数通过 API 请求获取当前的任务数据。
   * 如果请求成功，函数将解析任务数据并根据任务类型和操作更新相应的任务列表。
   * 支持的社交平台包括 Steam 和 VK，函数会根据不同的任务类型（如 WL、JTG、STC、GF）将任务链接分类到相应的列表中。
   * 最后，函数会去重任务列表，并将更新后的任务信息存储回本地。
   */
  async classifyTask(action: 'do' | 'undo' | 'verify'): Promise<boolean> {
    try {
      debug('开始分类任务', { action });
      const logStatus = echoLog({ text: __('getTasksInfo') });

      if (action === 'undo') {
        debug('获取已保存的任务信息');
        this.tasks = normalizeStoredTasks(GM_getValue<WebsiteStoredTasksInput>(`fawTasks-${this.giveawayId}`));
        logStatus.success();
        debug('任务分类结果', { tasks: this.tasks });
        return true;
      }

      const tasks = $('div.game__content-tasks__task').map((index, element) => ({
        id: $(element).attr('data-id') as string,
        social: $(element).find('div.task-img img')
          .attr('alt'),
        link: $(element).find('div.task-link a')
          .attr('href'),
        title: $(element).find('div.task-link')
          .text()
          .trim(),
        type: $(element).attr('data-type'),
        data: $(element).attr('data-data'),
        isSuccess: $(element).hasClass('done')
      }))
        .toArray();

      debug('获取到的任务列表', { tasksCount: tasks.length, tasks });

      if (tasks.length === 0) {
        logStatus.success();
        return false;
      }

      if (action === 'verify') {
        this.verifyTasks = [];
      }

      if (action === 'do') {
        this.tasks = [];
      }

      for (const task of tasks) {
        await this.#processTask(task, action);
      }

      logStatus.success();

      if (action === 'do') {
        this.tasks = this.uniqueTasks(this.tasks);
        const tasksForUndo = this.uniqueTasks(this.tasks
          .filter((task) => task.social !== 'extra' && task.done === false)
          .map((task) => ({ ...task, done: true })));
        debug('任务分类结果', {
          tasks: this.tasks,
          tasksForUndo
        });
        GM_setValue(`fawTasks-${this.giveawayId}`, { tasks: tasksForUndo, time: new Date().getTime() });
      } else {
        debug('任务分类结果', { verifyTasks: this.verifyTasks });
      }
      return true;
    } catch (error) {
      debug('任务分类失败', { error });
      throwError(error as Error, 'Freeanywhere.classifyTask');
      return false;
    }
  }

  async #processTask(task: fawTaskInfo & {
    link?: string
    isSuccess: boolean
  }, action: string): Promise<void> {
    try {
      debug('处理任务', { task, action });
      const { id, social, title, type, link, data, isSuccess } = task;
      const taskInfo: fawTaskInfo = { id, title, social, type, data };

      if (action === 'verify' && !isSuccess) {
        debug('添加到验证任务列表', taskInfo);
        this.verifyTasks.push(taskInfo);
        return;
      }

      if (action !== 'do') return;

      debug('处理特定类型任务', { type, action, isSuccess });
      switch (type) {
          case 'steam_account_verify':
          case 'site_email_verify':
            debug('跳过任务', { type });
            break;
          case 'steam_game_sub':
            if (link) this.tasks.push({ done: isSuccess, social: 'steam', type: 'follow', link, id, title, data });
            break;
          case 'steam_game_wishlist':
            if (link) this.tasks.push({ done: isSuccess, social: 'steam', type: 'wishlist', link, id, title, data });
            break;
          case 'steam_group_sub':
            if (link) this.tasks.push({ done: isSuccess, social: 'steam', type: 'group', link, id, title, data });
            break;
          case 'steam_curator_sub':
            if (link) this.tasks.push({ done: isSuccess, social: 'steam', type: 'curator', link, id, title, data });
            break;
          case 'site_visit':
            this.tasks.push({ done: isSuccess, social: 'extra', type: 'website', link: id, id, title, data });
            break;
          case 'vk_community_sub':
            if (link) this.tasks.push({ done: isSuccess, social: 'vk', type: 'user', link, id, title, data });
            break;
          case 'vk_post_like':
            if (link) this.tasks.push({ done: isSuccess, social: 'vk', type: 'like', link: `${link}#action=like`, id, title, data });
            break;
          case 'discord_server_sub':
            debug('跳过 Discord 任务');
            echoLog({}).warning(`${__('discordTaskNotice')}`);
            break;
          case 'youtube_channel_sub':
            if (link) this.tasks.push({ done: isSuccess, social: 'youtube', type: 'channel', link, id, title, data });
            break;
          case 'steam_game_playtime':
            if (link) {
              this.tasks.push({
                done: isSuccess,
                social: 'steam',
                type: 'playtime',
                link,
                id,
                title,
                data,
                minutes: Number(title.match(/(\d+)\s*min/)?.[1] || '0')
              });
            }
            break;
          case 'telegram_channel_sub':
            debug('跳过 Telegram 任务');
            echoLog({}).warning(`${__('tgTaskNotice')}`);
            break;
          case 'none':
            debug('跳过未连接的任务', { type });
            echoLog({}).warning(`${__('notConnect', type || '')}`);
            break;
          default:
            debug('未知任务类型', { type });
            echoLog({}).warning(`${__('unKnownTaskType', type || '')}`);
            break;
      }
    } catch (error) {
      debug('处理任务失败', { error });
      throwError(error as Error, 'FreeAnyWhere.processTask');
    }
  }

  /**
   * 验证任务的异步方法
   *
   * @returns {Promise<boolean>} 如果所有任务成功完成，则返回 true；否则返回 false。
   *
   * @throws {Error} 如果在验证过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法首先检查是否已初始化，如果未初始化则调用初始化方法。
   * 然后检查任务列表是否为空，如果为空则尝试分类任务。
   * 对于每个任务，调用私有的验证方法并在每次调用之间延迟 1 秒。
   * 最后，等待所有验证任务完成，并记录成功信息。
   * 如果成功，返回获取的密钥；否则返回 false。
   */
  async verifyTask(): Promise<boolean> {
    try {
      debug('开始验证任务');
      if (!this.initialized && !(await this.init())) {
        debug('未初始化');
        return false;
      }

      if (this.verifyTasks.length === 0 && !(await this.classifyTask('verify'))) {
        debug('任务列表为空', this.verifyTasks);
        return false;
      }

      if (this.verifyTasks.length === 0) {
        debug('没有待验证任务', this.verifyTasks);
        return false;
      }

      debug('开始验证任务列表', { tasks: this.verifyTasks });
      const pro = [];
      for (const task of this.verifyTasks) {
        pro.push(this.#verify(task));
        await delay(1000);
      }

      const result = await Promise.allSettled(pro);
      debug('任务验证结果', { result });
      echoLog({}).success(__('allTasksComplete'));

      const tasksNotDone = $('.game__content-tasks__task').toArray()
        .find((el) => !$(el).hasClass('done'));

      if (tasksNotDone) {
        $('.js-get-key').addClass('inactive');
      } else {
        $('.js-get-key').removeClass('inactive');
      }

      if (result.every((item) => item.status === 'fulfilled' && item.value === true)) {
        return !!await this.getKey(true);
      }
      return false;
    } catch (error) {
      debug('验证任务失败', { error });
      throwError(error as Error, 'Freeanywhere.verifyTask');
      return false;
    }
  }

  /**
   * 执行额外任务的异步方法
   *
   * @param {Object} params - 方法参数对象。
   * @param {Array<string>} params.website - 包含要执行的额外任务链接的数组。
   * @returns {Promise<boolean>} 如果所有任务成功执行，则返回 true；否则返回 false。
   *
   * @throws {Error} 如果在执行过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法遍历传入的额外任务链接数组，并为每个链接调用私有方法 `#doVisitWebsite`。
   * 所有任务的执行结果将通过 `Promise.all` 进行处理。
   * 如果所有任务成功完成，则返回 true；如果发生错误，则记录错误信息并返回 false。
   */
  async extraDoTask(tasks: Record<string, Array<WebsiteTask>>): Promise<boolean> {
    try {
      const website = tasks.website || [];
      debug('执行额外任务', { website });
      const promises = website.map((task) => this.#doVisitWebsite(`${task.id ?? task.link}`));
      const results = await Promise.allSettled(promises);
      debug('额外任务执行结果', { results });
      return results.every((result) => result.status === 'fulfilled' && result.value);
    } catch (error) {
      debug('执行额外任务失败', { error });
      throwError(error as Error, 'FreeAnyWhere.extraDoTask');
      return false;
    }
  }

  /**
   * 访问网站的私有异步方法
   *
   * @param {string} id - 任务id。
   * @returns {Promise<boolean>} 如果访问成功，则返回 true；否则返回 false。
   *
   * @throws {Error} 如果在访问过程中发生错误，将抛出错误。
   */
  async #doVisitWebsite(id: string): Promise<boolean> {
    try {
      debug('访问网站任务', { id });
      const logStatus = echoLog({ text: __('visitingLink') });

      const { result, statusText, status, data } = await httpRequest({
        url: 'https://freeanywhere.net/php/user_task_site_visit.php',
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: `id=${id}`
      });

      if (result !== 'Success') {
        debug('访问失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.responseText.indexOf('bad') !== -1 || data?.responseText.length > 50) {
        debug('访问响应异常', { responseText: data?.responseText });
        logStatus.error(data?.responseText);
        return false;
      }

      debug('访问成功');
      logStatus.success();
      return true;
    } catch (error) {
      debug('访问网站失败', { error });
      throwError(error as Error, 'FreeAnyWhere.doVisitWebsite');
      return false;
    }
  }

  /**
   * 获取奖励密钥的异步方法
   *
   * @param {boolean} [initialized] - 可选参数，指示是否已初始化。
   * @returns {Promise<false | string>} 如果成功获取密钥，则返回密钥字符串；如果失败，则返回 false。
   *
   * @throws {Error} 如果在获取密钥过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法首先检查是否已初始化，如果未初始化且未成功初始化，则返回 false。
   * 然后记录获取密钥的状态，并发送 HTTP GET 请求以获取奖励信息。
   * 如果请求成功且返回的响应中包含奖励，则记录成功信息并返回奖励。
   * 如果任务未完成，则记录错误信息并返回 false。
   * 如果任务已完成，则调用私有方法检查剩余密钥。
   * 如果请求失败，则记录错误信息并返回 false。
   */
  async getKey(initialized?: boolean): Promise<false | string> {
    try {
      debug('开始获取密钥', { initialized });
      if (!initialized && !this.initialized && !(await this.init())) {
        debug('未初始化');
        return false;
      }

      const logStatus = echoLog({ text: __('gettingKey') });
      const { result, statusText, status, data } = await httpRequest({
        url: 'https://freeanywhere.net/php/user_get_key.php',
        method: 'POST'
      });

      if (result !== 'Success') {
        debug('获取密钥失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.responseText.indexOf('bad') !== -1 || data?.responseText.length > 50) {
        debug('密钥响应异常', { responseText: data?.responseText });
        logStatus.error(data?.responseText);
        return false;
      }

      debug('获取密钥成功', { key: data.responseText });
      logStatus.success();
      echoLog({}).success(data.responseText);
      return data.responseText;
    } catch (error) {
      debug('获取密钥失败', { error });
      throwError(error as Error, 'FreeAnyWhere.getKey');
      return false;
    }
  }

  /**
   * 验证任务的私有异步方法
   *
   * @param {fawTaskInfo} task - 要验证的任务信息对象
   * @returns {Promise<boolean>} 如果任务验证成功，则返回true；否则返回false
   *
   * @throws {Error} 如果在验证过程中发生错误，将抛出错误
   *
   * @description
   * 该方法根据页面上是否存在扩展检查元素来决定使用哪种验证方式：
   * 1. 如果存在".task-check-extension"元素，则使用扩展验证方式
   * 2. 如果不存在，则使用普通验证方式
   * 验证失败时会记录错误信息并返回false
   */
  async #verify(task: fawTaskInfo): Promise<boolean> {
    try {
      if ($('.task-check-extension').length > 0) {
        debug('需要扩展，跳过验证', { task });
        echoLog({}).warning(__('skipExtensionToVerifyTask'));
        // return this.#verifyWithExtension(task);
        return false;
      }
      debug('使用普通方式验证任务', { task });
      return this.#verifyWithoutExtension(task);
    } catch (error) {
      debug('验证任务失败', { error });
      throwError(error as Error, 'Freeanywhere.verify');
      return false;
    }
  }

  /**
   * 验证任务的私有异步方法
   *
   * @param {fawTaskInfo} task - 要验证的任务信息对象。
   * @returns {Promise<boolean>} 如果任务验证成功，则返回 true；否则返回 false。
   *
   * @throws {Error} 如果在验证过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法发送一个 HTTP GET 请求以验证指定任务的状态。
   * 首先记录正在验证的任务状态。
   * 如果请求成功且返回的响应中包含任务状态，则记录成功信息并返回 true。
   * 如果请求失败或状态不正确，则记录错误信息并返回 false。
   */
  async #verifyWithoutExtension(task: fawTaskInfo): Promise<boolean> {
    try {
      debug('验证任务', { task });
      const logStatus = echoLog({ text: `${__('verifyingTask')}${task.title.trim()}...` });
      // $(".game__content-tasks__task .task-check").on('click', function (event) {
      // event.preventDefault();

      const $parrent = $(`.game__content-tasks__task[data-id="${task.id}"]`);
      const extension = $parrent.find('.task-check-extension').length > 0 || $parrent.data('extension');

      if (extension) {
        logStatus.warning(__('verifyExtensionNeeded'));
        $parrent.find('.task-check-extension')[0].click();
        return false;
      };

      $parrent.find('.task-check').addClass('loading');

      const { result, statusText, status, data } = await httpRequest({
        url: 'https://freeanywhere.net/php/user_task_update.php',
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: `id=${task.id}&type=${task.type}${(task.data && task.data !== 'none') ? `&data=${task.data}` : ''}`
      });

      if (result !== 'Success' || !data?.responseText) {
        debug('验证请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      const response = data.responseText.trim();

      if (response !== 'good') {
        debug('验证响应异常', { response, statusText: data?.statusText, status: data?.status });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        $parrent.removeClass('error');
        $parrent.removeClass('done');
        $parrent.find('.task-check').removeClass('loading');
        return false;
      }
      $parrent.addClass('done');
      $parrent.removeClass('error');
      $parrent.find('.task-check').removeClass('loading');

      debug('验证成功');
      logStatus.success();
      return true;
    } catch (error) {
      debug('验证任务失败', { error });
      throwError(error as Error, 'Freeanywhere.verifyWithoutExtension');
      return false;
    }
  }

  /**
   * 检查剩余密钥数量的私有异步方法
   *
   * @returns {Promise<boolean>} 如果检查成功返回 true，发生错误返回 false
   * @throws {Error} 如果在检查过程中发生错误，将抛出错误
   *
   * @description
   * 检查抽奖是否还有剩余密钥：
   * 1. 检查是否启用了密钥检查功能
   * 2. 获取并解析页面上的密钥数量信息
   * 3. 如果没有剩余密钥，显示确认对话框
   * 4. 根据用户选择决定是否关闭窗口
   */
  async #checkLeftKey(): Promise<boolean> {
    try {
      debug('检查剩余密钥');
      if (!globalOptions.other.checkLeftKey) {
        debug('跳过密钥检查');
        return true;
      }

      const giveawayStatus = $('div.card-info__lable-info').text()
        ?.includes('Giveaway ended');
      debug('Giveaway状态', { giveawayStatus });

      if (!giveawayStatus) {
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
      throwError(error as Error, 'FreeAnyWhere.checkLeftKey');
      return false;
    }
  }

  /**
   * 获取抽奖ID的方法
   *
   * @returns {boolean} 如果成功获取抽奖ID，则返回 true；否则返回 false。
   *
   * @throws {Error} 如果在获取抽奖ID过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法尝试从当前窗口的URL中提取抽奖ID。
   * 使用正则表达式匹配URL中的抽奖ID部分。
   * 如果成功匹配到抽奖ID，则将其赋值给实例属性 `giveawayId` 并返回 true。
   * 如果未能匹配到抽奖ID，则记录错误信息并返回 false。
   */
  #getGiveawayId(): boolean {
    try {
      debug('开始获取抽奖ID');
      const giveawayId = $('link[rel="canonical"]').attr('href')
        ?.match(/n=([\d]+)/)?.[1];

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
      throwError(error as Error, 'FreeAnyWhere.getGiveawayId');
      return false;
    }
  }
}

export default FreeAnyWhere;
