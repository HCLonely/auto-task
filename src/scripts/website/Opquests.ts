/*
 * @Author       : HCLonely
 * @Date         : 2021-11-18 13:31:23
 * @LastEditTime : 2025-10-02 22:42:10
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/website/Opquests.ts
 * @Description  : https://opquests.com/
 */

import Website from './Website';
import throwError from '../tools/throwError';
import echoLog from '../echoLog';
import __ from '../tools/i18n';
import { globalOptions } from '../globalOptions';
import httpRequest from '../tools/httpRequest';
import { debug } from '../tools/debug';
import { getRedirectLink } from '../tools/tools';

const defaultTasks: oqSocialTasks = {
  steam: {
    groupLinks: [],
    wishlistLinks: [],
    followLinks: [],
    curatorLikeLinks: [],
    playTimeLinks: []
  },
  twitter: {
    userLinks: [],
    retweetLinks: []
  },
  discord: {
    serverLinks: []
  }
};

/**
 * Opquests 类用于处理与 Opquests 网站相关的任务和操作。
 *
 * @class Opquests
 * @extends Website
 *
 * @property {string} name - 网站名称，默认为 'Opquests'。
 * @property {oqSocialTasks} undoneTasks - 存储未完成任务的对象。
 * @property {Array<string>} buttons - 可用的操作按钮列表。
 *
 * @static
 * @method test - 检查当前域名是否为 Opquests 网站。
 * @returns {boolean} 如果当前域名为 'opquests.com'，则返回 true；否则返回 false。
 *
 * @async
 * @method before - 在执行操作之前的异步方法。
 * @returns {Promise<void>} 无返回值。
 * @throws {Error} 如果在执行过程中发生错误，将抛出错误。
 *
 * @async
 * @method after - 页面加载后的异步方法。
 * @returns {Promise<void>} 无返回值。
 * @throws {Error} 如果在处理过程中发生错误，将抛出错误。
 *
 * @method init - 初始化方法。
 * @returns {boolean} 如果初始化成功，则返回 true；否则返回 false。
 * @throws {Error} 如果在初始化过程中发生错误，将抛出错误。
 *
 * @async
 * @method classifyTask - 分类任务的异步方法。
 * @param {'do' | 'undo'} action - 要执行的操作类型，'do' 表示执行任务，'undo' 表示撤销任务。
 * @returns {Promise<boolean>} 如果任务分类成功，则返回 true；否则返回 false。
 * @throws {Error} 如果在分类过程中发生错误，将抛出错误。
 *
 * @async
 * @method verifyTask - 验证任务的异步方法。
 * @returns {Promise<boolean>} 如果任务验证成功，则返回 true；否则返回 false。
 * @throws {Error} 如果在验证过程中发生错误，将抛出错误。
 *
 * @async
 * @method getKey - 获取密钥的异步方法。
 * @param {boolean} [isButton] - 可选参数，指示是否通过按钮获取密钥。
 * @returns {Promise<boolean>} 如果成功获取密钥，则返回 true；否则返回 false。
 * @throws {Error} 如果在获取过程中发生错误，将抛出错误。
 *
 * @private
 * @method #getGiveawayId - 获取抽奖ID的方法。
 * @returns {boolean} 如果成功获取抽奖ID，则返回 true；否则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 *
 * @private
 * @method #checkLogin - 检查用户是否已登录的私有方法。
 * @returns {boolean} 如果用户已登录，则返回 true；否则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 */
class Opquests extends Website {
  name = 'Opquests';
  undoneTasks: oqSocialTasks = { ...defaultTasks };
  buttons: Array<string> = [
    'doTask',
    'verifyTask',
    'getKey'
  ];

  /**
   * 检查当前域名是否为 Opquests 网站的静态方法
   *
   * @returns {boolean} 如果当前域名为 'opquests.com'，则返回 true；否则返回 false。
   *
   * @description
   * 该方法通过比较当前窗口的域名来判断是否为 Opquests 网站。
   * 如果域名匹配，则返回 true；否则返回 false。
   */
  static test(): boolean {
    const { host } = window.location;
    const isMatch = host === 'opquests.com';
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
   * 如果在检查过程中发生错误，则记录错误信息。
   */
  async after(): Promise<void> {
    try {
      debug('开始执行后续操作');
      if (!this.#checkLogin()) {
        debug('检查登录失败');
        echoLog({}).warning(__('checkLoginFailed'));
      }
      const opquestsVerifyTasks = GM_getValue<Array<string>>('opquestsVerifyTasks') || [];
      debug('获取待验证任务', { count: opquestsVerifyTasks.length });
      if (opquestsVerifyTasks.length > 0) {
        const taskId = opquestsVerifyTasks.pop();
        debug('处理任务', { taskId });
        GM_setValue('opquestsVerifyTasks', opquestsVerifyTasks);
        const [verifyBtn] = $(`#task_id[value="${taskId}"]`).parent()
          .find('button[type="button"],button[type="submit"]')
          .has('i.fa-check');
        if (verifyBtn) {
          debug('点击验证按钮');
          verifyBtn.click();
          return;
        }
        debug('未找到验证按钮，继续处理下一个任务');
        this.after();
        return;
      }
      if (GM_getValue<Array<string>>('opquestsVerifyTasks')) {
        debug('清除验证任务缓存');
        GM_deleteValue('opquestsVerifyTasks');
      }
    } catch (error) {
      debug('后续操作失败', { error });
      throwError(error as Error, 'Opquests.after');
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
   * 首先记录初始化状态。如果页面中存在重定向链接，则重定向用户到登录页面，并记录警告信息。
   * 然后调用私有方法获取抽奖ID，如果获取失败，则返回 false。
   * 如果成功获取抽奖ID，则将 `initialized` 属性设置为 true，并记录成功信息。
   */
  init(): boolean {
    try {
      debug('开始初始化');
      const logStatus = echoLog({ text: __('initing') });
      if ($('a[href*="/auth/redirect"]').length > 0) {
        debug('需要登录');
        window.open('/auth/redirect', '_self');
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
      throwError(error as Error, 'Opquests.init');
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
   * 该方法按以下步骤处理任务分类：
   * 1. 检查操作类型，如果是 'undo' 则返回 false（不支持撤销操作）
   * 2. 获取所有包含 "Validate" 的任务元素
   * 3. 对每个任务进行分类：
   *    - 提取任务链接和描述
   *    - 按以下顺序检查并分类任务：
   *      * Steam 群组任务
   *      * Steam 应用任务（愿望单或关注）
   *      * Steam 发行商/开发者/鉴赏家关注任务
   *      * Twitter 任务（关注或转发）
   *      * Clash.gg 任务（不支持）
   *    - 对于未知类型的任务，记录警告信息
   * 4. 去重并保存任务列表
   */
  async classifyTask(action: 'do' | 'undo'): Promise<boolean> {
    try {
      debug('开始分类任务', { action });
      if (action === 'undo') {
        debug('不支持撤销操作');
        echoLog({ text: __('cannotUndo') });
        return false;
      }

      const logStatus = echoLog({ text: __('getTasksInfo') });
      const tasks = $('.w-full:contains("Validate") .items-center');
      debug('找到任务', { count: tasks.length });

      for (const task of tasks) {
        const link = $(task).find('a:contains("Open")')
          .attr('href');
        if (!link) {
          debug('跳过无链接任务');
          continue;
        }

        const taskDes = $(task).find('div')
          .eq(1)
          .text()
          .trim();
        debug('处理任务', { taskDes, link });

        if (/steamcommunity\.com\/groups\//.test(link)) {
          debug('添加 Steam 组任务');
          this.undoneTasks.steam.groupLinks.push(link);
          continue;
        }

        if (/store\.steampowered\.com\/app\//.test(link)) {
          if (/wishlist/gim.test(taskDes)) {
            debug('添加 Steam 愿望单任务');
            this.undoneTasks.steam.wishlistLinks.push(link);
          } else if (/follow/gim.test(taskDes)) {
            debug('添加 Steam 关注任务');
            this.undoneTasks.steam.followLinks.push(link);
          } else if (/play/gim.test(taskDes)) {
            const time = parseInt(taskDes.replace(/\s/gim, '').match(/(\d+)hours/im)?.[1] || '0', 10) * 60;
            debug('添加 Steam 游戏时长任务', { time });
            this.undoneTasks.steam.playTimeLinks.push(`${time}-${link}`);
          }
          continue;
        }

        if (/store\.steampowered\.com\/(publisher|developer|curator)\//.test(link) && /follow/gim.test(taskDes)) {
          debug('添加 Steam 鉴赏家关注任务');
          this.undoneTasks.steam.curatorLikeLinks.push(link);
          continue;
        }

        if (link.includes('//x.com/')) {
          if (/follow/gim.test(taskDes)) {
            debug('添加 Twitter 关注任务');
            this.undoneTasks.twitter.userLinks.push(link);
            continue;
          }
          if (link.includes('status') && /Repost/gim.test(taskDes)) {
            debug('添加 Twitter 转发任务');
            this.undoneTasks.twitter.retweetLinks.push(link);
            continue;
          }
        }
        if (link.includes('//discord.com/')) {
          if (/join/gim.test(taskDes)) {
            debug('添加 Discord 加入任务');
            this.undoneTasks.discord.serverLinks.push(link);
            continue;
          }
        }
        if (link.includes('//discord.gg/') && /join/gim.test(taskDes)) {
          debug('获取重定向链接', { link });
          const taskLink = await getRedirectLink(link, false);
          if (!taskLink) {
            debug('获取重定向链接失败');
            continue;
          }
          debug('添加 Discord 加入任务');
          this.undoneTasks.discord.serverLinks.push(taskLink);
          continue;
        }

        if (/clash\.gg/.test(link)) {
          debug('跳过不支持的 Clash.gg 任务');
          echoLog({}).warning(`${__('unSupporttedTaskType')}: ${taskDes}(${link})`);
          continue;
        }

        debug('未知任务类型');
        echoLog({}).warning(`${__('unKnownTaskType')}: ${taskDes}(${link})`);
      }

      debug('任务分类完成');
      logStatus.success();
      this.undoneTasks = this.uniqueTasks(this.undoneTasks) as oqSocialTasks;
      if (window.DEBUG) console.log('%cAuto-Task[Debug]:', 'color:blue', JSON.stringify(this));
      return true;
    } catch (error) {
      debug('任务分类失败', { error });
      throwError(error as Error, 'Opquests.classifyTask');
      return false;
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
   * 该方法首先检查是否已初始化，如果未初始化则调用初始化方法。
   * 然后从页面中提取所有任务ID，并将其存储在数组中。
   * 调用私有方法 `#confirm` 进行确认操作。
   * 从任务数组中弹出最后一个任务ID，并将剩余任务ID存储到 GM 值中。
   * 最后，点击对应任务的提交按钮以执行验证。
   */
  async verifyTask(): Promise<boolean> {
    try {
      debug('开始验证任务');
      if (!this.initialized) {
        debug('未初始化，执行初始化');
        this.init();
      }
      const tasks: Array<string> = $.makeArray($('.items-center').has('input[name="task_id"]'))
        .map((ele) => $(ele).find('input[name="task_id"]')
          .val() as string);
      debug('获取待验证任务', { count: tasks.length });
      GM_setValue('opquestsVerifyTasks', tasks);
      await this.#confirm();
      debug('执行后续操作');
      this.after();
      return true;
    } catch (error) {
      debug('验证任务失败', { error });
      throwError(error as Error, 'Opquests.verifyTask');
      return false;
    }
  }

  /**
   * 确认任务的私有异步方法
   *
   * @returns {Promise<boolean>} 如果确认成功，则返回 true；否则返回 false。
   *
   * @throws {Error} 如果在确认过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法按以下步骤确认任务：
   * 1. 向指定URL发送GET请求以确认任务
   * 2. 验证请求结果：
   *    - 如果请求结果不是 'Success'，记录错误并返回 false
   *    - 如果响应状态码不是 200，记录错误并返回 false
   * 3. 如果所有检查都通过，记录成功并返回 true
   */
  async #confirm(): Promise<boolean> {
    try {
      debug('开始确认任务');
      const logStatus = echoLog({ html: `<li>${__('confirmingTask')}...<font></font></li>` });

      debug('发送确认请求');
      const { result, statusText, status, data } = await httpRequest({
        url: `https://opquests.com/quests/${this.giveawayId}?confirm=1`,
        method: 'GET',
        nochche: true,
        headers: {
          origin: 'https://opquests.com',
          referer: `https://opquests.com/warning?id=${this.giveawayId}`
        }
      });

      if (result !== 'Success') {
        debug('请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status !== 200) {
        debug('响应错误', { status: data?.status, statusText: data?.statusText });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      debug('确认成功');
      logStatus.success();
      return true;
    } catch (error) {
      debug('确认任务失败', { error });
      throwError(error as Error, 'Opquests.confirm');
      return false;
    }
  }

  /**
   * 获取密钥的异步方法
   *
   * @param {boolean} [isButton] - 可选参数，指示是否通过按钮获取密钥。
   * @returns {Promise<boolean>} 如果成功获取密钥，则返回 true；否则返回 false。
   *
   * @throws {Error} 如果在获取过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法向指定的 URL 发送 GET 请求以获取密钥。
   * 如果请求成功且返回的响应中包含密钥，则记录成功信息并返回密钥。
   * 如果未找到密钥，则记录错误信息，并在需要时重定向用户到密钥页面。
   * 如果请求失败，则记录错误信息并返回 false。
   */
  async getKey(isButton?: boolean): Promise<boolean> {
    try {
      if ($('[name="task_id"]').length > 0) {
        debug('有任务未完成，不获取密钥');
        echoLog({}).warning(__('taskNotFinished'));
        return false;
      }

      debug('开始获取密钥', { isButton });
      const logStatus = echoLog({ text: __('gettingKey') });

      debug('发送获取密钥请求');
      const { result, statusText, status, data } = await httpRequest({
        url: 'https://opquests.com/keys',
        method: 'GET'
      });

      if (result !== 'Success') {
        debug('请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (!data?.responseText) {
        debug('响应无效', { status: data?.status, statusText: data?.statusText });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      const questTitle = $('h1.font-bold').text()
        .trim()
        .replace(' Quest', '');
      const key = $(data.responseText)
        .find(`div.items-center:contains("${questTitle}")`)
        .find('div.font-bold')
        .next()
        .text();
      debug('查找密钥', { questTitle, hasKey: !!key });

      if (!key) {
        debug('未找到密钥');
        logStatus.error('Error: Key was not found');
        if (isButton) {
          debug('重定向到密钥页面');
          window.open('https://opquests.com/keys', '_self');
        }
        return false;
      }

      debug('获取密钥成功');
      logStatus.success();
      echoLog({}).success(key);
      return true;
    } catch (error) {
      debug('获取密钥失败', { error });
      throwError(error as Error, 'Opquests.getKey');
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
      const giveawayId = window.location.href.match(/quests\/([\d]+)/)?.[1];
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
      throwError(error as Error, 'Opquests.getGiveawayId');
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
   * 如果启用且页面中存在重定向链接，则重定向用户到登录页面。
   * 如果没有找到登录链接，则返回 true，表示用户已登录或不需要登录。
   */
  #checkLogin(): boolean {
    try {
      debug('检查登录状态');
      if (!globalOptions.other.checkLogin) {
        debug('跳过登录检查');
        return true;
      }
      if ($('a[href*="/auth/redirect"]').length > 0) {
        debug('未登录，重定向到登录页面');
        window.open('/auth/redirect', '_self');
      }
      debug('登录检查完成');
      return true;
    } catch (error) {
      debug('检查登录失败', { error });
      throwError(error as Error, 'Opquests.checkLogin');
      return false;
    }
  }
}

export default Opquests;
