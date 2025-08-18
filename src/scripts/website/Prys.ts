/*
 * @Author       : HCLonely
 * @Date         : 2021-11-14 20:22:33
 * @LastEditTime : 2025-08-18 19:05:30
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/website/Prys.ts
 * @Description  : https://prys.revadike.com/
 */

import Swal from 'sweetalert2';
import Website from './Website';
import throwError from '../tools/throwError';
import echoLog from '../echoLog';
import __ from '../tools/i18n';
import { getRedirectLink } from '../tools/tools';
import { globalOptions } from '../globalOptions';
import { debug } from '../tools/debug';

const defaultTasksTemplate: prysSocialTasks = {
  steam: {
    groupLinks: [],
    curatorLinks: [],
    wishlistLinks: [],
    followLinks: []
  },
  youtube: {
    channelLinks: []
  }
};
const defaultTasks = JSON.stringify(defaultTasksTemplate);

/**
 * Prys 类用于处理 Pry's 网站的相关任务和操作。
 *
 * @class Prys
 * @extends Website
 *
 * @property {string} name - 网站名称，默认为 'Prys'。
 * @property {prysSocialTasks} socialTasks - 存储社交任务的对象。
 * @property {prysSocialTasks} undoneTasks - 存储未完成任务的对象。
 * @property {Array<string>} buttons - 可用的操作按钮数组。
 *
 * @static
 * @method test - 检查当前域名是否为 Pry's 网站。
 * @returns {boolean} 如果当前域名为 'prys.revadike.com'，则返回 true；否则返回 false。
 *
 * @async
 * @method after - 页面加载后的异步方法，检查用户登录状态和剩余密钥。
 * @returns {Promise<void>} 无返回值。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 *
 * @method init - 初始化方法，尝试初始化抽奖功能。
 * @returns {boolean} 如果初始化成功，则返回 true；否则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 *
 * @async
 * @method classifyTask - 分类任务的异步方法，根据操作类型分类任务。
 * @param {string} action - 要执行的操作类型，'do' 表示执行任务，'undo' 表示撤销任务。
 * @returns {Promise<boolean>} 如果任务分类成功，则返回 true；否则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 *
 * @async
 * @method verifyTask - 验证任务的异步方法，检查所有任务的状态。
 * @returns {Promise<void>} 无返回值。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 *
 * @private
 * @method #getGiveawayId - 获取抽奖ID的方法。
 * @returns {boolean} 如果成功获取抽奖ID，则返回 true；否则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 *
 * @private
 * @async
 * @method #checkLeftKey - 检查剩余密钥的私有异步方法。
 * @returns {Promise<boolean>} 如果检查成功，则返回 true；如果发生错误，则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 *
 * @private
 * @method #checkLogin - 检查用户是否已登录的私有方法。
 * @returns {boolean} 如果用户已登录，则返回 true；否则返回 false。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 *
 * @private
 * @method #checkStep - 检查步骤的私有方法，向服务器发送请求以检查步骤状态。
 * @param {string} step - 要检查的步骤标识符。
 * @param {function} resolve - 处理结果的回调函数。
 * @param {logStatus} status - 日志状态对象，用于记录操作状态。
 * @param {string|null} [captcha=null] - 可选的验证码响应，默认为 null。
 * @returns {void} 无返回值。
 * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
 */
class Prys extends Website {
  name = 'Prys';
  socialTasks: prysSocialTasks = JSON.parse(defaultTasks);
  undoneTasks: prysSocialTasks = JSON.parse(defaultTasks);
  buttons: Array<string> = [
    'doTask',
    'undoTask',
    'verifyTask'
  ];

  /**
   * 检查当前域名是否为 Pry's 网站的静态方法
   *
   * @returns {boolean} 如果当前域名为 'prys.revadike.com'，则返回 true；否则返回 false。
   *
   * @description
   * 该方法通过比较当前窗口的域名来判断是否为 Pry's 网站。
   * 如果域名匹配，则返回 true；否则返回 false。
   */
  static test(): boolean {
    const { host } = window.location;
    const isMatch = host === 'prys.revadike.com';
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
    } catch (error) {
      debug('后续操作失败', { error });
      throwError(error as Error, 'Prys.after');
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
   * 首先记录初始化状态。如果页面中存在"登录"按钮，则记录警告信息并返回 false。
   * 然后调用私有方法获取抽奖ID，如果获取失败，则返回 false。
   * 如果成功获取抽奖ID，则将 `initialized` 属性设置为 true，并记录成功信息。
   */
  init(): boolean {
    try {
      debug('开始初始化');
      const logStatus = echoLog({ text: __('initing') });
      if ($('button:contains("Sign")').length > 0) {
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
      throwError(error as Error, 'Prys.init');
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
   * 遍历页面中的步骤，检查每个步骤的状态，并根据链接类型将其分类到相应的社交任务列表中。
   * 支持的链接类型包括 Steam Curator 链接和 Steam 群组链接。
   * 处理完成后，记录成功信息并将分类后的任务存储到本地。
   */
  async classifyTask(action: string): Promise<boolean> {
    try {
      debug('开始分类任务', { action });
      const logStatus = echoLog({ text: __('getTasksInfo') });
      if (action === 'undo') {
        debug('恢复已保存的任务信息');
        this.socialTasks = GM_getValue<prysGMTasks>(`prysTasks-${this.giveawayId}`)?.tasks || JSON.parse(defaultTasks);
      }

      const steps = $('#steps tbody tr');
      debug('找到任务步骤', { count: steps.length });
      for (let eq = 0; eq < steps.length; eq += 1) {
        if (steps.eq(eq).find('span:contains(Success)').length === 0) {
          debug('点击检查按钮', { step: eq });
          checkClick(eq);
        }
      }

      const pro = [];
      for (const step of steps) {
        const isSuccess = $(step).find('span:contains(Success)').length > 0;
        if (isSuccess && action === 'do') {
          debug('跳过已完成的任务');
          continue;
        }

        const appLink = $(step).find('a[href*=\'store.steampowered.com/app/\']')
          .attr('href');
        if (appLink) {
          const taskType = $(step).find('a[href*=\'store.steampowered.com/app/\']')
            .text()
            .includes('wishlist') ? 'wishlistLinks' : 'followLinks';
          debug('添加 Steam 应用任务', { type: taskType, link: appLink });
          if (action === 'undo') this.socialTasks.steam[taskType].push(appLink);
          if (action === 'do') this.undoneTasks.steam[taskType].push(appLink);
          continue;
        }

        const curatorLink = $(step).find('a[href*=\'store.steampowered.com/curator/\']')
          .attr('href');
        if (curatorLink) {
          debug('添加 Steam 鉴赏家任务', { link: curatorLink });
          if (action === 'undo') this.socialTasks.steam.curatorLinks.push(curatorLink);
          if (action === 'do') this.undoneTasks.steam.curatorLinks.push(curatorLink);
          continue;
        }

        const groupLink = $(step).find('a[href*=\'steamcommunity.com/groups/\']')
          .attr('href');
        if (groupLink) {
          debug('添加 Steam 组任务', { link: groupLink });
          if (action === 'undo') this.socialTasks.steam.groupLinks.push(groupLink);
          if (action === 'do') this.undoneTasks.steam.groupLinks.push(groupLink);
          continue;
        }

        const gidLink = $(step).find('a[href*=\'steamcommunity.com/gid\']')
          .attr('href');
        if (gidLink) {
          debug('处理 Steam GID 链接', { link: gidLink });
          pro.push(getRedirectLink(gidLink).then((finalUrl) => {
            if (!finalUrl || !/^https?:\/\/steamcommunity\.com\/groups\//.test(finalUrl)) {
              debug('无效的 Steam 组链接', { finalUrl });
              return false;
            }
            debug('添加 Steam 组任务（从 GID）', { link: finalUrl });
            if (action === 'undo') this.socialTasks.steam.groupLinks.push(finalUrl);
            if (action === 'do') this.undoneTasks.steam.groupLinks.push(finalUrl);
          }));
        }
      }

      await Promise.allSettled(pro);
      debug('任务分类完成');
      logStatus.success();
      this.undoneTasks = this.uniqueTasks(this.undoneTasks) as prysSocialTasks;
      this.socialTasks = this.uniqueTasks(this.socialTasks) as prysSocialTasks;
      if (window.DEBUG) console.log('%cAuto-Task[Debug]:', 'color:blue', JSON.stringify(this));
      GM_setValue(`prysTasks-${this.giveawayId}`, { tasks: this.socialTasks, time: new Date().getTime() });
      return true;
    } catch (error) {
      debug('任务分类失败', { error });
      throwError(error as Error, 'Prys.classifyTask');
      return false;
    }
  }

  /**
   * 验证任务的异步方法
   *
   * @returns {Promise<void>} 无返回值。
   *
   * @throws {Error} 如果在验证过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法首先查找所有以 "check" 开头的任务链接。
   * 如果找到任务链接，则遍历每个链接，提取任务ID和描述，并记录验证状态。
   * 对于每个任务，调用私有方法 `#checkStep` 进行验证，并将结果存储在 Promise 数组中。
   * 使用 `Promise.all` 等待所有任务完成后，记录所有任务完成的信息。
   * 如果没有找到任务链接，则直接记录所有任务完成的信息。
   */
  async verifyTask(): Promise<void> {
    try {
      debug('开始验证任务');
      const checks = $('#steps tbody a[id^=check]');
      if (checks.length === 0) {
        debug('没有需要验证的任务');
        echoLog({}).success(__('allTasksComplete'));
        return;
      }

      const pro = [];
      for (const check of checks) {
        const id = $(check).attr('id')
          ?.match(/[\d]+/)?.[0];
        if (!id) {
          debug('跳过无效任务ID');
          continue;
        }

        const taskDes = $(check).parent()
          ?.prev()
          ?.html()
          ?.trim();
        debug('验证任务', { id, taskDes });
        const status = echoLog({ text: `${__('verifyingTask')}${taskDes}...` });
        pro.push(new Promise((resolve) => {
          this.#checkStep(id, resolve, status);
        }));
      }

      await Promise.all(pro);
      debug('所有任务验证完成');
      echoLog({}).success(__('allTasksComplete'));
    } catch (error) {
      debug('验证任务失败', { error });
      throwError(error as Error, 'Prys.verifyTask');
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
   * 该方法从当前窗口的查询字符串中提取抽奖ID。
   * 使用正则表达式匹配查询字符串中的 ID 参数。
   * 如果成功匹配到抽奖ID，则将其赋值给实例属性 `giveawayId` 并返回 true。
   * 如果未能匹配到抽奖ID，则记录错误信息并返回 false。
   */
  #getGiveawayId(): boolean {
    try {
      debug('开始获取抽奖ID');
      const giveawayId = window.location.search.match(/id=([\d]+)/)?.[1];
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
      throwError(error as Error, 'Prys.getGiveawayId');
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

      const leftKey = $('#header').text()
        .match(/([\d]+).*?prize.*?left/)?.[1];
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
      throwError(error as Error, 'Prys.checkLeftKey');
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
   * 如果启用且页面中存在"登录"按钮，则记录警告信息。
   * 如果没有找到登录按钮，则返回 true，表示用户已登录或不需要登录。
   */
  #checkLogin(): boolean {
    try {
      debug('检查登录状态');
      if (!globalOptions.other.checkLogin) {
        debug('跳过登录检查');
        return true;
      }
      if ($('button:contains("Sign")').length > 0) {
        debug('未登录');
        echoLog({}).warning(__('needLogin'));
      }
      debug('登录检查完成');
      return true;
    } catch (error) {
      debug('检查登录失败', { error });
      throwError(error as Error, 'Prys.checkLogin');
      return false;
    }
  }

  /**
   * 检查步骤的私有方法
   *
   * @param {string} step - 要检查的步骤标识符。
   * @param {function} resolve - 处理结果的回调函数。
   * @param {logStatus} status - 日志状态对象，用于记录操作状态。
   * @param {string|null} [captcha=null] - 可选的验证码响应，默认为 null。
   *
   * @returns {void} 无返回值。
   *
   * @throws {Error} 如果在检查过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法向服务器发送 POST 请求以检查指定步骤的状态。
   * 如果步骤不是验证码，则更新步骤的状态为"正在检查"。
   * 请求成功后，根据返回的 JSON 数据更新步骤的状态。
   * 如果成功，显示成功信息；如果失败，显示错误信息。
   * 如果返回的响应中包含验证码，则调用验证码检查函数。
   * 如果返回的响应中包含奖品信息，则显示奖品信息。
   */
  #checkStep(step: string, resolve: (param?: boolean) => void, status: logStatus, captcha = null) {
    try {
      debug('开始检查步骤', { step, hasCaptcha: !!captcha });
      if (step !== 'captcha') {
        debug('更新步骤状态为检查中');
        $(`#check${step}`).replaceWith(`<span id="check${step}"><i class="fa fa-refresh fa-spin fa-fw"></i> Checking...</span>`);
      }

      debug('发送检查请求');
      $.post('/api/check_step', {
        step,
        id: getURLParameter('id'),
        'g-recaptcha-response': captcha
      }, (json) => {
        resolve();
        debug('收到检查响应', { success: json.success });

        if (step !== 'captcha') {
          if (json.success) {
            debug('步骤检查成功');
            $(`#check${step}`).replaceWith(`<span class="text-success" id="check${step}"><i class="fa fa-check"></i> Success</span>`);
            status.success();
          } else {
            debug('步骤检查失败');
            $(`#check${step}`).replaceWith(`<a id="check${step}" href="javascript:checkStep(${step})"><i class="fa fa-question"></i> Check</a>`);
            status.error(json.response?.error || 'Error');
          }
        }

        if (!json.response) return;

        if (json.response.prize) {
          debug('获得奖品', { prize: json.response.prize });
          showAlert('success', `Here is your prize:<h1 role="button" align="middle" style="word-wrap: break-word;">${json.response.prize}</h2>`);
        }

        if (!json.response.captcha) return;

        debug('需要验证码');
        if (json.success) {
          showAlert('info', json.response.captcha);
        } else {
          showAlert('warning', json.response.captcha);
        }
        captchaCheck();
      }).fail(() => {
        resolve();
        debug('请求失败');
        $(`#check${step}`).replaceWith(`<a id="check${step}" href="javascript:checkStep(${step})"><i class="fa fa-question"></i> Check</a>`);
        status.error('Error:0');
      });
    } catch (error) {
      debug('检查步骤失败', { error });
      throwError(error as Error, 'prys.checkStep');
      resolve(false);
    }
  }
}

export default Prys;
