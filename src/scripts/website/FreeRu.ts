/*
 * @Author       : HCLonely
 * @Date         : 2021-11-04 14:02:03
 * @LastEditTime : 2025-08-18 19:07:18
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/website/FreeRu.ts
 * @Description  : https://freeru.cc
 */

import Swal from 'sweetalert2';
import Website from './Website';
import throwError from '../tools/throwError';
import echoLog from '../echoLog';
import __ from '../tools/i18n';
import { getRedirectLink, delay } from '../tools/tools';
import { debug } from '../tools/debug';
import { globalOptions } from '../globalOptions';

const defaultTasksTemplate = {
  extra: {
    visitLink: []
  }
} as const;
const defaultTasks = JSON.stringify(defaultTasksTemplate);

/**
 * FreeRu 类用于处理与 FreeRu 网站相关的任务和操作。
 *
 * @class FreeRu
 * @extends Website
 *
 * @property {string} name - 网站名称。
 * @property {Array<fruTaskInfo>} tasks - 当前任务列表。
 * @property {fruSocialTasks} socialTasks - 社交任务列表。
 * @property {fruSocialTasks} undoneTasks - 未完成的社交任务列表。
 * @property {Array<string>} buttons - 可用操作按钮列表。
 * @property {string} giveawayId - 抽奖ID。
 *
 * @method static test - 检查当前窗口的域名是否为 'freeru.cc'。
 *
 * @method init - 初始化函数，负责检查用户的登录状态和当前 URL 的有效性。
 * @method classifyTask - 根据指定的操作分类任务。
 * @method verifyTask - 验证任务的异步方法。
 * @method getKey - 获取奖励密钥的异步方法。
 * @method #verify - 验证任务的私有异步方法。
 *
 */
class FreeRu extends Website {
  name = 'FreeRu';
  socialTasks: fruSocialTasks = JSON.parse(defaultTasks);
  undoneTasks: fruSocialTasks = JSON.parse(defaultTasks);
  games!: Record<string, { playtime_forever: number }>;
  buttons: Array<string> = [
    'doTask',
    'verifyTask'
  ];

  /**
   * 检查当前窗口的域名是否为 'freeru.cc'
   *
   * @returns {boolean} 如果域名匹配则返回 true，否则返回 false
   */
  static test(): boolean {
    const isMatch = window.location.host === 'freeru.cc';
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
      debug('初始化 FreeRu', { url: window.location.href });
      const logStatus = echoLog({ text: __('initing') });

      debug('检测登录状态');
      if ($('.auth-button').length > 0) {
        debug('未登录，准备跳转到登录页面');
        $('.auth-button')[0].click();
        logStatus.warning(__('needLogin'));
        return false;
      }

      if (!await this.#checkLeftKey()) {
        debug('检查剩余密钥失败');
        echoLog({}).warning(__('checkLeftKeyFailed'));
      }

      this.initialized = true;
      logStatus.success();
      return true;
    } catch (error) {
      debug('初始化失败', { error });
      throwError(error as Error, 'FreeRu.init');
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
  async classifyTask(action: string): Promise<boolean> {
    try {
      debug('开始分类任务', { action });
      const logStatus = echoLog({ text: __('getTasksInfo') });

      $('.giveaway-tasks__list a.task-card__button').toArray()
        .forEach((elem) => {
          this.undoneTasks.extra.visitLink.push(elem.getAttribute('href') as string);
        });

      logStatus.success();
      this.undoneTasks = this.uniqueTasks(this.undoneTasks) as fruSocialTasks;

      debug('任务分类结果', {
        undoneTasks: this.undoneTasks
      });

      return true;
    } catch (error) {
      debug('任务分类失败', { error });
      throwError(error as Error, 'FreeRu.classifyTask');
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
  async extraDoTask({ visitLink }: { visitLink: Array<string> }): Promise<boolean> {
    try {
      debug('执行额外任务', { visitLink });
      const logStatus = echoLog({ text: __('visitingLink') });
      const promises = visitLink.map((link) => getRedirectLink(link));
      const results = await Promise.allSettled(promises);
      logStatus.success();
      debug('额外任务执行结果', { results });
      return true;
    } catch (error) {
      debug('执行额外任务失败', { error });
      throwError(error as Error, 'FreeRu.extraDoTask');
      return false;
    }
  }

  /**
   * 验证任务的私有异步方法
   *
   * @param {fruTaskInfo} task - 要验证的任务信息对象
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
  async verifyTask(): Promise<boolean> {
    try {
      debug('开始验证任务');
      if (!this.initialized && !(await this.init())) {
        debug('未初始化');
        return false;
      }

      const logStatus = echoLog({ text: __('giveeClubVerifyNotice') });
      const tasks = $('.giveaway-tasks__list button.task-card__button').toArray();
      if (tasks.length === 0) {
        debug('任务列表为空', tasks);
        return false;
      }

      debug('开始验证任务列表', { tasks });
      for (const task of tasks) {
        task.click();
        await delay(1000);
      }

      logStatus.success();
      echoLog({}).success(__('verifiedGleamTasks'));

      return false;
    } catch (error) {
      debug('验证任务失败', { error });
      throwError(error as Error, 'FreeRu.verifyTask');
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

      const giveawayStatus = $('.giveaway-summary__info-text')[0].innerText
        ?.match(/\d+/)?.[0];
      debug('Giveaway状态', { giveawayStatus });

      if (giveawayStatus === '0') {
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
      }

      return true;
    } catch (error) {
      debug('检查剩余密钥失败', { error });
      throwError(error as Error, 'FreeRu.checkLeftKey');
      return false;
    }
  }
}

export default FreeRu;
