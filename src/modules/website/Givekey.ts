/*
 * @Author       : HCLonely
 * @Date         : 2021-11-13 17:57:40
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/website/Givekey.ts
 * @Description  : Givekey 网站任务处理（https://givekey.ru）
 */

import type { WebsiteStoredTasksInput, WebsiteTask } from './types';
import { showDialog } from '../../scripts/ui/dialog';
import Website from './Website';
import echoLog from '../../scripts/echoLog';
import __ from '../../scripts/tools/i18n';
import { delay, getRedirectLink, unique } from '../../scripts/tools/tools';
import throwError from '../../scripts/tools/throwError';
import { globalOptions } from '../../scripts/globalOptions';
import { debug } from '../../scripts/tools/debug';
import { normalizeStoredTasks } from './taskModel';

/**
 * 表示 Givekey 网站的任务处理类。
 *
 * @remarks
 * - `name`（`string`）：网站名称。
 *
 * - `tasks`（`Array<WebsiteTask>`）：存储社交任务的数组。
 *
 * - `verifyTaskIds`（`Array<string>`）：存储验证任务ID的数组。
 *
 * - `userId`（`string`）：用户ID。
 *
 * - `buttons`（`Array<string>`）：包含 'doTask'、'undoTask' 和 'verifyTask' 的按钮数组。
 */
class Givekey extends Website {
  name = 'Givekey';
  verifyTaskIds: Array<string> = [];
  userId!: string;
  buttons: Array<string> = [
    'doTask',
    'undoTask',
    'verifyTask'
  ];

  /**
   * 检查当前域名是否为 Givekey 网站的静态方法
   *
   * @remarks
   * 该方法通过比较当前窗口的域名来判断是否为 Givekey 网站。
   * 如果域名匹配，则返回 true；否则返回 false。
   *
   * @returns 如果当前域名为 'givekey.ru'，则返回 true；否则返回 false。
   */
  static test(): boolean {
    const url = window.location.host;
    const isMatch = url === 'givekey.ru';
    debug('检查网站匹配', {
      url,
      isMatch
    });
    return isMatch;
  }

  /**
   * 页面加载后的异步方法
   *
   * @remarks
   * 该方法首先等待导航栏元素的出现，使用定时器检查元素是否存在。
   * 一旦找到元素，清除定时器并继续执行后续操作。
   * 然后检查剩余密钥的状态，如果检查失败，则记录相应的警告信息。
   *
   * @returns 无返回值。
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
      debug('后续操作失败', {
        error
      });
      throwError(error as Error, 'Givekey.after');
    }
  }

  /**
   * 初始化方法
   *
   * @remarks
   * 该方法尝试初始化抽奖功能。
   * 首先记录初始化状态。如果页面中存在 Steam 登录链接，则重定向用户到 Steam 登录页面，并记录警告信息。
   * 然后调用私有方法获取抽奖ID，如果获取失败，则返回 false。
   * 接着从页面的 meta 标签中获取用户ID，如果未找到用户ID，则记录错误信息并返回 false。
   * 如果成功获取用户ID，则将其赋值给实例属性 `userId`，并将 `initialized` 属性设置为 true，最后记录成功信息。
   *
   * 已捕获的异常通过失败返回值交付，不会从对应的 catch 分支继续抛出。
   *
   * @returns 如果初始化成功，则返回 true；否则返回 false。
   */
  init(): boolean {
    try {
      debug('初始化 Givekey');
      const logStatus = echoLog({
        text: __('initing')
      });
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
      debug('初始化完成', {
        userId
      });
      logStatus.success();
      return true;
    } catch (error) {
      debug('初始化失败', {
        error
      });
      throwError(error as Error, 'Givekey.init');
      return false;
    }
  }

  /**
   * 分类任务的异步方法
   *
   * @remarks
   * 该方法根据传入的操作类型分类任务：
   * - 'undo': 从存储中恢复之前保存的任务信息
   * - 'verify': 仅收集任务ID用于验证
   * - 'do': 收集并分类新的任务
   *
   * 处理流程：
   * 1. 获取页面中的所有任务元素
   * 2. 对每个任务进行分类处理
   * 3. 更新任务列表并保存到存储中
   *
   * 已捕获的异常通过失败返回值交付，不会从对应的 catch 分支继续抛出。
   *
   * @param action - 要执行的操作类型
   * @returns 如果任务分类成功，则返回 true；否则返回 false
   */
  async classifyTask(action: 'do' | 'undo' | 'verify'): Promise<boolean> {
    try {
      debug('开始分类任务', {
        action
      });
      const logStatus = echoLog({
        text: __('getTasksInfo')
      });

      if (action === 'undo') {
        debug('恢复已保存的任务信息');
        this.tasks = normalizeStoredTasks(GM_getValue<WebsiteStoredTasksInput>(`gkTasks-${this.giveawayId}`));
        logStatus.success();
        return true;
      }

      this.tasks = [];
      this.verifyTaskIds = [];
      const tasks = $('.card-body:has("button") .row');
      debug('找到任务元素', {
        count: tasks.length
      });

      for (const task of tasks) {
        const taskEle = $(task);
        const button = taskEle.find('button');
        const isSuccess = /Complete/i.test(button.text().trim());
        debug('处理任务', {
          isSuccess
        });

        if (action === 'verify' && isSuccess) {
          continue;
        }

        const checkButton = taskEle.find('#task_check');
        const taskId = checkButton.attr('data-id');
        if (action === 'verify' && taskId) {
          debug('添加任务ID', {
            taskId
          });
          this.verifyTaskIds.push(taskId);
        }

        if (action === 'verify') {
          continue;
        }

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
          debug('获取重定向链接', {
            href
          });
          href = await getRedirectLink(href);
        }
        if (!href) {
          debug('获取重定向链接失败');
          continue;
        }

        const icon = taskEle.find('i');
        await this.#classifyTaskByType(href, text, icon, isSuccess, taskId);
      }

      debug('任务分类完成');
      logStatus.success();
      this.verifyTaskIds = unique(this.verifyTaskIds);
      if (action === 'verify') {
        return true;
      }

      this.tasks = this.uniqueTasks(this.tasks);
      const tasksForUndo = this.uniqueTasks(this.tasks
        .filter((task) => {
          return task.done === false;
        })
        .map((task) => {
          return {
            ...task,
            done: true
          };
        }));

      debug('保存任务信息');
      GM_setValue(`gkTasks-${this.giveawayId}`, {
        tasks: tasksForUndo,
        time: new Date().getTime()
      });

      return true;
    } catch (error) {
      debug('任务分类失败', {
        error
      });
      throwError(error as Error, 'Givekey.classifyTask');
      return false;
    }
  }

  /**
   * 验证任务的异步方法
   *
   * @remarks
   * 该方法首先检查是否已初始化，如果未初始化则调用初始化方法。
   * 然后检查任务列表是否为空，如果为空则调用分类任务的方法进行分类。
   * 接着记录验证前的提示信息，并依次验证每个任务。
   * 在验证每个任务之间，等待 15 秒的延迟。
   * 最后记录所有任务完成的信息，并返回 true。
   *
   * 已捕获的异常通过失败返回值交付，不会从对应的 catch 分支继续抛出。
   *
   * @returns 如果所有任务成功验证，则返回 true；否则返回 false。
   */
  async verifyTask(): Promise<boolean> {
    try {
      debug('开始验证任务');
      if (!this.initialized && !this.init()) {
        debug('初始化失败');
        return false;
      }
      if (this.verifyTaskIds.length === 0 && !(await this.classifyTask('verify'))) {
        debug('任务分类失败');
        return false;
      }
      echoLog({}).warning(__('giveKeyNoticeBefore'));
      const taskLength = this.verifyTaskIds.length;
      debug('开始验证任务', {
        taskCount: taskLength
      });

      for (let i = 0; i < taskLength; i++) {
        await this.#verify(this.verifyTaskIds[i]);
        if (i < (taskLength - 1)) {
          debug('等待15秒');
          await delay(15000);
        }
      }

      debug('所有任务验证完成');
      echoLog({}).success(__('allTasksComplete'));
      echoLog({
        html: `<li><font class="warning">${__('giveKeyNoticeAfter')}</font></li>`
      });
      return true;
    } catch (error) {
      debug('任务验证失败', {
        error
      });
      throwError(error as Error, 'Givekey.verifyTask');
      return false;
    }
  }

  /**
   * 验证任务的私有异步方法
   *
   * @remarks
   * 该方法向服务器发送请求以验证指定的任务。
   * 首先记录正在验证的任务状态。
   * 发送 POST 请求到指定的 URL，并传递任务ID和用户ID。
   * 如果请求成功且返回状态为 'ok'，则更新按钮状态并记录成功信息。
   * 如果返回状态为 'end'，则记录成功信息并返回密钥。
   * 如果发生错误，则记录错误信息并返回 false。
   *
   * 已捕获的异常通过失败返回值交付，不会从对应的 catch 分支继续抛出。
   *
   * @param task - 要验证的任务ID。
   * @returns 如果任务验证成功，则返回 true；否则返回 false。
   */
  async #verify(task: string): Promise<boolean> {
    try {
      debug('验证任务', {
        taskId: task
      });
      const logStatus = echoLog({
        html: `<li>${__('verifyingTask')}${task}<font></font></li>`
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
        response
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
        error
      });
      throwError(error as Error, 'Givekey.verify');
      return false;
    }
  }

  /**
   * 获取抽奖ID的方法
   *
   * @remarks
   * 该方法从当前窗口的URL中提取抽奖ID。
   * 使用正则表达式匹配URL中的抽奖ID部分。
   * 如果成功匹配到抽奖ID，则将其赋值给实例属性 `giveawayId` 并返回 true。
   * 如果未能匹配到抽奖ID，则记录错误信息并返回 false。
   *
   * 已捕获的异常通过失败返回值交付，不会从对应的 catch 分支继续抛出。
   *
   * @returns 如果成功获取抽奖ID，则返回 true；否则返回 false。
   */
  #getGiveawayId(): boolean {
    try {
      debug('从URL获取抽奖ID');
      const giveawayId = window.location.href.match(/giveaway\/([\d]+)/)?.[1];
      if (giveawayId) {
        this.giveawayId = giveawayId;
        debug('获取抽奖ID成功', {
          giveawayId
        });
        return true;
      }
      debug('获取抽奖ID失败');
      echoLog({
        text: __('getFailed', 'GiveawayId')
      });
      return false;
    } catch (error) {
      debug('获取抽奖ID出错', {
        error
      });
      throwError(error as Error, 'Givekey.getGiveawayId');
      return false;
    }
  }

  /**
   * 检查剩余密钥的私有异步方法
   *
   * @remarks
   * 该方法检查是否还有可用的密钥：
   * 1. 首先检查是否启用了密钥检查功能
   * 2. 检查页面上是否显示有剩余密钥
   * 3. 如果没有剩余密钥：
   *    - 显示警告对话框
   *    - 用户确认后关闭窗口
   *    - 用户取消则继续执行
   * 4. 所有情况下返回 true，除非发生错误
   *
   * 已捕获的异常通过失败返回值交付，不会从对应的 catch 分支继续抛出。
   *
   * @returns 如果检查成功或不需要检查，则返回 true；如果发生错误，则返回 false
   */
  async #checkLeftKey(): Promise<boolean> {
    try {
      debug('检查剩余密钥');
      if (!globalOptions.other.checkLeftKey) {
        debug('跳过密钥检查');
        return true;
      }

      const keysCount = $('#keys_count').text();
      debug('检查密钥数量', {
        keysCount
      });
      if (keysCount) {
        return true;
      }

      debug('没有剩余密钥，显示确认对话框');
      const { value } = await showDialog({
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
      debug('检查剩余密钥失败', {
        error
      });
      throwError(error as Error, 'Givekey.checkLeftKey');
      return false;
    }
  }

  /**
   * 分类单个任务类型的私有异步方法
   *
   * @remarks
   * 该方法根据任务的属性将其分类到不同的社交平台任务类别中。
   * 支持的任务类型包括：
   * - VK社交平台任务：匹配 vk.com 域名
   * - Steam群组任务：匹配 steamcommunity.com/groups
   * - Steam愿望单任务：匹配 store.steampowered.com/app
   * - Steam鉴赏家任务：
   *   - 匹配 store.steampowered.com/curator（关注鉴赏家）
   *   - 其他Steam相关任务（点赞鉴赏家）
   * - Twitter关注任务：匹配 twitter.com 且包含 Subscribe 文本
   *
   * 处理流程：
   * 1. 检查任务链接URL的格式
   * 2. 根据URL、文本内容和图标类型确定任务类别
   * 3. 将任务添加到扁平任务列表中
   * 4. 如果无法识别任务类型，记录警告信息
   *
   * @param href - 任务链接URL
   * @param text - 任务描述文本
   * @param icon - 任务图标的jQuery对象
   * @param isSuccess - 任务是否已完成的标志
   * @param taskId - 任务ID
   * @returns 无返回值的Promise
   */
  async #classifyTaskByType(href: string, text: string, icon: JQuery, isSuccess: boolean, taskId?: string): Promise<void> {
    try {
      debug('开始分类任务类型', {
        href,
        text,
        isSuccess,
        taskId
      });
      /**
       * 将任务加入待处理列表。
       *
       * @param social - 社交平台实例或名称。
       * @param type - 操作或数据类型。
       */
      const addTask = (social: string, type: string) => {
        const task: WebsiteTask = {
          done: isSuccess,
          social,
          type,
          link: href,
          title: text
        };
        if (taskId) {
          task.id = taskId;
          task.taskId = taskId;
        }
        this.tasks.push(task);
      };

      if (/^https?:\/\/vk\.com\//.test(href)) {
        debug('添加 VK 任务');
        addTask('vk', 'user');
        return;
      }

      if (/^https?:\/\/steamcommunity\.com\/groups/.test(href)) {
        debug('添加 Steam 组任务');
        addTask('steam', 'group');
        return;
      }

      if (/^https?:\/\/store\.steampowered\.com\/app\//.test(href)) {
        debug('添加 Steam 愿望单任务');
        addTask('steam', 'wishlist');
        return;
      }

      if (/Subscribe/gi.test(text) && icon.hasClass('fa-steam-square')) {
        if (/^https?:\/\/store\.steampowered\.com\/curator\//.test(href)) {
          debug('添加 Steam 鉴赏家关注任务');
          addTask('steam', 'curator');
        } else {
          debug('添加 Steam 鉴赏家点赞任务');
          addTask('steam', 'curatorLike');
        }
        return;
      }

      if (/^https?:\/\/twitter\.com\//.test(href) && /Subscribe/gi.test(text)) {
        debug('添加 Twitter 关注任务');
        addTask('twitter', 'user');
        return;
      }

      if (icon.hasClass('fa-discord') || /^https?:\/\/discord\.com\/invite\//.test(href)) {
        return;
      }

      debug('未识别的任务类型', {
        href,
        text
      });
      echoLog({}).warning(`${__('unKnownTaskType')}: ${text}(${href})`);
    } catch (error) {
      debug('任务类型分类失败', {
        error
      });
      throwError(error as Error, 'Givekey.classifyTaskByType');
    }
  }
}

export default Givekey;
