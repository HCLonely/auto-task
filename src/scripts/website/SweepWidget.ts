/*
 * @Author       : HCLonely
 * @Date         : 2021-12-21 10:01:05
 * @LastEditTime : 2025-08-18 19:05:12
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/website/SweepWidget.ts
 * @Description  : https://sweepwidget.com/
 */

import throwError from '../tools/throwError';
import echoLog from '../echoLog';
import __ from '../tools/i18n';
import Website from './Website';
import { delay } from '../tools/tools';
import { debug } from '../tools/debug';

interface options {
  username: string
  email: string
}
const defaultOptions: options = {
  username: '',
  email: ''
};

/**
 * SweepWidget 类用于处理 SweepWidget 网站的抽奖任务。
 *
 * @class
 * @extends Website
 *
 * @property {string} name - SweepWidget 的名称。
 * @property {object} options - SweepWidget 的配置选项，包含默认选项和用户自定义选项。
 * @property {Array<string>} buttons - SweepWidget 支持的按钮列表。
 *
 * @static
 * @method test - 检查当前 URL 是否为 SweepWidget 网站的静态方法。
 * @returns {boolean} 如果当前 URL 匹配 SweepWidget 的格式，则返回 true；否则返回 false。
 *
 * @method after - 抽奖后续操作的异步方法。
 * @returns {Promise<void>} 无返回值。
 * @throws {Error} 如果在处理过程中发生错误，将抛出错误。
 *
 * @method init - 初始化方法。
 * @returns {boolean} 如果初始化成功，则返回 true；否则返回 false。
 * @throws {Error} 如果在初始化过程中发生错误，将抛出错误。
 *
 * @method classifyTask - 分类任务的方法。
 * @returns {boolean} 如果任务分类成功，则返回 true；否则返回 false。
 *
 * @method doTask - 执行任务的异步方法。
 * @returns {Promise<boolean>} 如果任务成功执行，则返回 true；否则返回 false。
 * @throws {Error} 如果在执行过程中发生错误，将抛出错误。
 *
 * @private
 * @method #checkLogin - 检查用户是否已登录的私有方法。
 * @returns {boolean} 如果用户已登录，则返回 true；否则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 *
 * @private
 * @method #getGiveawayId - 获取抽奖ID的方法。
 * @returns {boolean} 如果成功获取抽奖ID，则返回 true；否则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 *
 * @private
 * @method #checkEnter - 检查用户是否已进入抽奖的私有异步方法。
 * @returns {Promise<boolean>} 如果用户已进入抽奖，则返回 true；否则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 *
 * @private
 * @method #checkFinish - 检查任务完成状态的私有异步方法。
 * @param {JQuery} $task - 要检查的任务元素。
 * @returns {Promise<boolean>} 如果任务完成，则返回 true；否则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 */
class SweepWidget extends Website {
  name = 'SweepWidget';
  options = {
    ...defaultOptions,
    ...GM_getValue<options>('SweepWidgetOptions')
  };
  buttons: Array<string> = [
    'doTask'
  ];

  /**
   * 检查当前URL是否为 SweepWidget 网站的静态方法
   *
   * @returns {boolean} 如果当前URL匹配 SweepWidget 的格式，则返回 true；否则返回 false。
   *
   * @description
   * 该方法使用正则表达式检查当前窗口的URL是否符合 SweepWidget 的格式。
   * 格式为：以 "http://" 或 "https://" 开头，后跟 "sweepwidget.com/view/" 和一个数字ID。
   */
  static test(): boolean {
    const { host } = window.location;
    const isMatch = /^sweepwidget\.com$/.test(host);
    debug('检查网站匹配', { host, isMatch });
    return /^https?:\/\/sweepwidget\.com\/view\/[\d]+/.test(window.location.href);
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
   * 如果在检查过程中发生错误，则记录错误信息。
   */
  async after(): Promise<void> {
    try {
      debug('开始执行后续操作');
      if (!this.#checkLogin()) {
        debug('检查登录失败');
        echoLog({}).warning(__('checkLoginFailed'));
      }
    } catch (error) {
      debug('后续操作失败', { error });
      throwError(error as Error, 'SweepWidget.after');
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
      debug('开始初始化');
      const logStatus = echoLog({ text: __('initing') });
      if (!this.#checkLogin()) {
        debug('需要登录');
        logStatus.warning(__('needLogin'));
        return false;
      }
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
      throwError(error as Error, 'SweepWidget.init');
      return false;
    }
  }

  /**
   * 分类任务的方法
   *
   * @returns {boolean} 如果任务分类成功，则返回 true；否则返回 false。
   *
   * @description
   * 该方法用于分类任务，当前实现仅返回 true，表示任务分类过程已完成。
   */
  classifyTask(): boolean {
    debug('任务分类完成');
    return true;
  }

  /**
   * 执行任务的异步方法
   *
   * @returns {Promise<boolean>} 如果任务成功执行，则返回 true；否则返回 false。
   *
   * @throws {Error} 如果在执行过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法按以下步骤执行任务：
   * 1. 登录检查和处理：
   *    - 如果未显示奖励界面，执行登录流程
   *    - 检查并填写用户名和邮箱字段
   *    - 点击登录按钮（如果可见）
   *    - 等待进入状态确认，失败则提前返回
   * 2. 任务处理流程：
   *    - 获取所有任务列表
   *    - 对每个未完成的任务：
   *      * 跳过已完成的任务（提前返回）
   *      * 处理任务链接和点击事件
   *      * 填写测试文本
   *      * 处理验证按钮状态
   *      * 等待任务完成确认
   *      * 添加随机延迟
   * 3. 完成处理：
   *    - 记录成功状态
   *    - 返回执行结果
   */
  async doTask(): Promise<boolean> {
    try {
      debug('开始执行任务');
      if ($('#unlock_rewards_main_wrapper').length === 0) {
        debug('未显示奖励界面，尝试登录');
        if ($('input[name="sw__login_name"]:visible').length > 0) {
          debug('填写用户名', { username: this.options.username });
          $('input[name="sw__login_name"]').val(this.options.username);
        }
        if ($('input[name="sw__login_email"]:visible').length > 0) {
          debug('填写邮箱', { email: this.options.email });
          $('input[name="sw__login_email"]').val(this.options.email);
        }
        if ($('#sw_login_button:visible').length > 0) {
          debug('点击登录按钮');
          $('#sw_login_button')[0].click();
        }
        const isEntered = await this.#checkEnter();
        if (!isEntered) {
          debug('进入抽奖失败');
          return false;
        }
      }

      const logStatus = echoLog({ text: __('SweepWidgetNotice') });
      const tasks = $('#sw_inner_entry_methods_l2_wrapper>div.sw_entry');
      debug('找到任务列表', { count: tasks.length });

      for (const task of tasks) {
        const $task = $(task);
        if ($task.find('i.fa-check:visible').length > 0) {
          debug('跳过已完成的任务');
          continue;
        }

        const title = $task.find('.sw_text_inner');
        const aElement = $task.find('a.sw_link');
        const link = aElement.attr('href');
        if (!link) {
          debug('跳过无效链接的任务');
          continue;
        }

        debug('处理任务', { title: title.text(), link });
        title[0].click();
        aElement.attr('href', '#a').attr('target', '_self');
        aElement[0]?.click();
        await delay(300);
        aElement.attr('href', link).attr('target', '_blank');

        debug('填写测试文本');
        $task.find('input[type="text"]').val('test');
        const verifyBtn = $task.find('input.sw_verify');

        if (verifyBtn.prop('disabled') === true) {
          debug('验证按钮被禁用，尝试重新激活');
          title[0].click();
          await delay(300);
          title[0].click();
          await delay(300);
        }

        debug('点击验证按钮');
        $task.find('input.sw_verify').removeAttr('disabled')[0]?.click();
        await this.#checkFinish($task);
        const randomDelay = parseInt(`${(Math.random() * (3000 - 1000 + 1)) + 1000}`, 10);
        debug('等待随机延迟', { delay: randomDelay });
        await delay(randomDelay);
      }

      debug('所有任务执行完成');
      logStatus.success();
      return true;
    } catch (error) {
      debug('执行任务失败', { error });
      throwError(error as Error, 'SweepWidget.doTask');
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
   * 该方法检查页面中是否存在 Twitter 登录按钮。
   * 如果存在，则模拟点击该按钮以进行登录。
   * 如果在过程中发生错误，则记录错误信息并返回 false。
   */
  #checkLogin(): boolean {
    try {
      debug('检查登录状态');
      if ($('#twitter_login_button').length > 0) {
        debug('点击 Twitter 登录按钮');
        $('#twitter_login_button')[0].click();
      }
      debug('登录检查完成');
      return true;
    } catch (error) {
      debug('检查登录失败', { error });
      throwError(error as Error, 'SweepWidget.checkLogin');
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
      debug('开始获取抽奖ID');
      const giveawayId = window.location.href.match(/\/view\/([\d]+)/)?.[1];
      if (!giveawayId) {
        debug('获取抽奖ID失败');
        echoLog({ text: __('getFailed', 'GiveawayId') });
        return false;
      }

      this.giveawayId = giveawayId;
      debug('获取抽奖ID成功', { giveawayId });
      return true;
    } catch (error) {
      debug('获取抽奖ID出错', { error });
      throwError(error as Error, 'SweepWidget.getGiveawayId');
      return false;
    }
  }

  /**
   * 检查用户是否已进入抽奖的私有异步方法
   *
   * @returns {Promise<boolean>} 如果用户已进入抽奖，则返回 true；否则返回 false。
   *
   * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法使用定时器检查页面状态：
   * 1. 每500毫秒检查一次解锁奖励的主包装器
   * 2. 使用提前返回模式：
   *    - 如果主包装器不存在，直接返回继续等待
   *    - 一旦检测到主包装器，立即清除定时器并返回成功
   * 3. 如果发生错误，记录错误并返回 false
   */
  async #checkEnter(): Promise<boolean> {
    try {
      debug('开始检查是否进入抽奖');
      return new Promise((resolve) => {
        const checker = setInterval(() => {
          if ($('#unlock_rewards_main_wrapper').length === 0) {
            debug('等待进入抽奖...');
            return;
          }

          debug('成功进入抽奖');
          clearInterval(checker);
          resolve(true);
        }, 500);
      });
    } catch (error) {
      debug('检查进入抽奖失败', { error });
      throwError(error as Error, 'SweepWidget.checkEnter');
      return false;
    }
  }

  /**
   * 检查任务完成状态的私有异步方法
   *
   * @param {JQuery} $task - 要检查的任务元素。
   * @returns {Promise<boolean>} 如果任务完成，则返回 true；否则返回 false。
   *
   * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法使用定时器检查任务状态：
   * 1. 每500毫秒检查一次任务状态
   * 2. 使用提前返回模式，如果任务未完成则继续等待
   * 3. 任务完成的判断条件：
   *    - 检查图标可见
   *    - 或输入框不可见
   * 4. 满足完成条件时，清除定时器并返回成功
   */
  async #checkFinish($task: JQuery): Promise<boolean> {
    try {
      debug('开始检查任务完成状态');
      return new Promise((resolve) => {
        const checker = setInterval(() => {
          const isCompleted = $task.find('i.fa-check:visible').length > 0 ||
              $task.find('.sw_entry_input:visible').length === 0;

          if (!isCompleted) {
            debug('等待任务完成...');
            return;
          }

          debug('任务完成');
          clearInterval(checker);
          resolve(true);
        }, 500);
      });
    } catch (error) {
      debug('检查任务完成状态失败', { error });
      throwError(error as Error, 'SweepWidget.checkFinish');
      return false;
    }
  }
}

export default SweepWidget;
