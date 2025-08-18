/*
 * @Author       : HCLonely
 * @Date         : 2021-09-30 09:43:32
 * @LastEditTime : 2025-08-18 19:09:30
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/social/Reddit.ts
 * @Description  : Reddit 订阅&取消订阅
 */

import Social from './Social';
import echoLog from '../echoLog';
import throwError from '../tools/throwError';
import httpRequest from '../tools/httpRequest';
import __ from '../tools/i18n';
import { unique, delay } from '../tools/tools';
import { globalOptions } from '../globalOptions';
import { debug } from '../tools/debug';

/**
 * @class Reddit
 * @extends Social
 * @description
 * 该类用于处理Reddit的订阅和取消订阅功能。它提供了初始化、身份验证、切换任务状态等方法。
 *
 * @property {redditTasks} tasks - 存储Reddit相关的任务信息。
 * @property {redditTasks} whiteList - 存储白名单信息。
 * @private
 * @property {auth} #auth - 存储身份验证信息。
 * @private
 * @property {boolean} #initialized - 模块是否已初始化的状态。
 *
 * @constructor
 * @description
 * 创建一个Reddit实例，初始化默认任务模板和白名单。
 *
 * @async
 * @function init
 * @returns {Promise<boolean>} - 返回初始化结果，true表示成功，false表示失败。
 *
 * @async
 * @function #useBeta
 * @returns {Promise<boolean>} - 返回切换操作的结果，true表示成功，false表示失败。
 *
 * @async
 * @function #updateAuth
 * @param {boolean} [beta=false] - 指示是否使用Beta版本的标志，默认为false。
 * @returns {Promise<boolean>} - 返回更新操作的结果，true表示成功，false表示失败。
 *
 * @async
 * @function #toggleTask
 * @param {Object} options - 选项对象。
 * @param {string} options.name - Reddit用户名或版块名。
 * @param {boolean} [options.doTask=true] - 指示是否执行任务，true表示关注，false表示取关。
 * @returns {Promise<boolean>} - 返回操作结果，true表示成功，false表示失败。
 *
 * @async
 * @function toggle
 * @param {Object} options - 选项对象。
 * @param {boolean} [options.doTask=true] - 指示是否执行任务，true表示关注，false表示取关。
 * @param {Array<string>} [options.redditLinks=[]] - Reddit链接数组，包含要处理的子版块或用户链接。
 * @returns {Promise<boolean>} - 返回操作结果，true表示成功，false表示失败。
 */
class Reddit extends Social {
  tasks: redditTasks;
  whiteList: redditTasks;
  #auth!: auth;
  #initialized = false;

  /**
   * 创建一个Reddit实例。
   *
   * @constructor
   * @description
   * 此构造函数初始化Reddit类的实例，设置默认任务模板和白名单。
   * 默认任务模板包含一个空的子版块数组，用于存储Reddit相关的任务信息。
   * 白名单将从GM_getValue中获取，如果没有找到，则使用默认任务模板。
   */
  constructor() {
    super();
    const defaultTasksTemplate: redditTasks = {
      reddits: []
    };
    debug('初始化Reddit实例');
    this.tasks = defaultTasksTemplate;
    this.whiteList = { ...defaultTasksTemplate, ...(GM_getValue<whiteList>('whiteList')?.reddit || {}) };
  }

  /**
   * 初始化Reddit模块，验证用户身份并获取授权。
   *
   * @async
   * @function init
   * @returns {Promise<boolean>} - 返回一个Promise，表示初始化的结果。
   *                              - true: 初始化成功
   *                              - false: 初始化失败，toggle方法不可用
   *
   * @description
   * 该方法首先检查模块是否已初始化。如果已初始化，则直接返回true。
   * 然后调用`#updateAuth`方法验证用户身份。如果验证成功，记录成功日志并将初始化状态设置为true。
   * 如果验证失败，记录错误日志并返回false。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async init(): Promise<boolean> {
    try {
      debug('开始初始化Reddit模块');
      if (this.#initialized) {
        debug('Reddit模块已初始化');
        return true;
      }
      const isVerified: boolean = await this.#updateAuth();
      if (isVerified) {
        debug('Reddit授权验证成功');
        echoLog({ before: '[Reddit]' }).success(__('initSuccess', 'Reddit'));
        this.#initialized = true;
        return true;
      }
      debug('Reddit初始化失败');
      echoLog({ before: '[Reddit]' }).error(__('initFailed', 'Reddit'));
      return false;
    } catch (error) {
      debug('Reddit初始化发生错误', { error });
      throwError(error as Error, 'Reddit.init');
      return false;
    }
  }

  /**
   * 切换Reddit网站为新版，使用新版API。
   *
   * @async
   * @function #useBeta
   * @returns {Promise<boolean>} - 返回一个Promise，表示切换操作的结果。
   *                              - true: 切换成功
   *                              - false: 切换失败
   *
   * @description
   * 该方法尝试将Reddit切换到新版。首先记录切换状态并清除当前的认证信息。
   * 然后打开一个新的标签页以进行身份验证。当新标签页关闭时，记录成功状态并更新认证信息。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async #useBeta(): Promise<boolean> {
    /**
     * @description: 切换Reddit网站为新版，此脚本使用新版API
     * @return true: 切换成功 | false: 切换失败
    */
    try {
      debug('开始切换Reddit为新版');
      const logStatus = echoLog({ text: __('changingRedditVersion'), before: '[Reddit]' });
      return await new Promise((resolve) => {
        const newTab = GM_openInTab('https://www.reddit.com/',
          { active: true, insert: true, setParent: true });
        // @ts-ignore
        newTab.name = 'ATv4_redditAuth';
        newTab.onclose = async () => {
          debug('新版Reddit标签页已关闭');
          logStatus.success();
          resolve(await this.#updateAuth(true));
        };
      });
    } catch (error) {
      debug('切换Reddit版本时发生错误', { error });
      throwError(error as Error, 'Reddit.useBeta');
      return false;
    }
  }

  /**
   * 更新Reddit的身份验证信息，获取新的访问令牌。
   *
   * @async
   * @function #updateAuth
   * @param {boolean} [beta=false] - 指示是否使用Beta版本的标志，默认为false。
   * @returns {Promise<boolean>} - 返回一个Promise，表示更新操作的结果。
   *                              - true: 更新Token成功
   *                              - false: 更新Token失败
   *
   * @description
   * 该方法通过发送GET请求到Reddit网站来更新身份验证Token。
   * 如果请求成功且返回的响应包含登录页面，则记录错误信息并返回false。
   * 如果返回状态为200且包含Beta选项，则根据参数决定是否切换到Beta版本。
   * 如果成功获取到访问令牌，则将其存储在`#auth`中，并记录成功信息。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async #updateAuth(beta = false): Promise<boolean> {
    try {
      debug('开始更新Reddit授权', { beta });
      const logStatus = echoLog({ text: __('updatingAuth', 'Reddit'), before: '[Reddit]' });
      const { result, statusText, status, data } = await httpRequest({
        url: 'https://www.reddit.com/',
        method: 'GET',
        nochche: true,
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      if (result !== 'Success') {
        debug('获取Reddit页面失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.responseText.includes('www.reddit.com/login/')) {
        debug('需要登录Reddit');
        logStatus.error(`Error:${__('loginReddit')}`, true);
        return false;
      }

      if (data?.status !== 200) {
        debug('Reddit页面状态码错误', { status: data?.status, statusText: data?.statusText });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      if (data.responseText.includes('redesign-beta-optin-btn') && !beta) {
        debug('检测到旧版Reddit，需要切换到新版');
        return await this.#useBeta();
      }

      const accessToken = data.responseText.match(/"accessToken":"(.*?)","expires":"(.*?)"/)?.[1];
      if (!accessToken) {
        debug('未找到Reddit访问令牌');
        logStatus.error('Error: Parameter "accessToken" not found!');
        return false;
      }

      debug('成功获取Reddit访问令牌');
      this.#auth = { token: accessToken };
      logStatus.success();
      return true;
    } catch (error) {
      debug('更新Reddit授权时发生错误', { error });
      throwError(error as Error, 'Reddit.updateAuth');
      return false;
    }
  }

  /**
   * 切换Reddit任务的状态，关注或取关指定的用户或版块。
   *
   * @async
   * @function #toggleTask
   * @param {Object} options - 选项对象。
   * @param {string} options.name - Reddit用户名或版块名。
   * @param {boolean} [options.doTask=true] - 指示是否执行任务，true表示关注，false表示取关。
   * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
   *                              - true: 操作成功
   *                              - false: 操作失败
   *
   * @description
   * 该方法根据传入的参数切换Reddit任务的状态。
   * 如果`doTask`为false且用户或版块在白名单中，则直接返回true。
   * 根据`doTask`的值决定是关注还是取关用户或版块，并发送相应的HTTP请求。
   * 如果请求成功且返回结果为'Success'，则更新任务列表并返回true。
   * 如果请求失败或返回的状态不符合预期，则记录错误信息并返回false。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async #toggleTask({ name, doTask = true }: { name: string, doTask: boolean }): Promise<boolean> {
    try {
      debug('开始处理Reddit任务', { name, doTask });
      if (!doTask && this.whiteList.reddits.includes(name)) {
        debug('Reddit在白名单中，跳过取消订阅', { name });
        echoLog({ type: 'whiteList', text: 'Reddit.undoTask', id: name, before: '[Reddit]' });
        return true;
      }

      let type: string = doTask ? 'joiningReddit' : 'leavingReddit';
      if (/^u_/.test(name)) {
        type = doTask ? 'followingRedditUser' : 'unfollowingRedditUser';
      }
      debug('任务类型', { type, name });
      const logStatus = echoLog({ type, text: name, before: '[Reddit]' });

      const { result, statusText, status, data } = await httpRequest({
        url: 'https://oauth.reddit.com/api/subscribe?redditWebClient=desktop2x&app=desktop2x-client-production&raw_json=1&gilding_detail=1',
        method: 'POST',
        headers: { authorization: `Bearer ${this.#auth.token}`, 'content-type': 'application/x-www-form-urlencoded' },
        data: $.param({
          action: doTask ? 'sub' : 'unsub',
          sr_name: name,
          api_type: 'json'
        })
      });

      if (result !== 'Success') {
        debug('Reddit任务请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status !== 200) {
        debug('Reddit任务状态码错误', { status: data?.status, statusText: data?.statusText });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      debug('Reddit任务处理成功', { name, doTask });
      logStatus.success();
      if (doTask) {
        this.tasks.reddits = unique([...this.tasks.reddits, name]);
      }
      return true;
    } catch (error) {
      debug('处理Reddit任务时发生错误', { error });
      throwError(error as Error, 'Reddit.toggleTask');
      return false;
    }
  }

  /**
   * 切换Reddit相关任务的状态，关注或取关指定的子版块或用户。
   *
   * @async
   * @function toggle
   * @param {Object} options - 选项对象。
   * @param {boolean} [options.doTask=true] - 指示是否执行任务，true表示关注，false表示取关。
   * @param {Array<string>} [options.redditLinks=[]] - Reddit链接数组，包含要处理的子版块或用户链接。
   * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
   *                              - true: 操作成功
   *                              - false: 操作失败
   *
   * @description
   * 该方法统一处理Reddit相关任务。首先检查模块是否已初始化，如果未初始化，则返回false。
   * 根据`doTask`和全局选项判断是否执行任务。如果执行任务，则获取实际的子版块或用户参数，并逐个处理关注或取关操作。
   * 最后返回所有操作的结果，如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async toggle({
    doTask = true,
    redditLinks = []
  }: {
    doTask: boolean,
    redditLinks?: Array<string>
  }): Promise<boolean> {
    try {
      debug('开始处理Reddit链接任务', { doTask, redditLinksCount: redditLinks.length });
      if (!this.#initialized) {
        debug('Reddit模块未初始化');
        echoLog({ text: __('needInit'), before: '[Reddit]' });
        return false;
      }

      if (
        (doTask && !globalOptions.doTask.reddit.reddits) ||
        (!doTask && !globalOptions.undoTask.reddit.reddits)
      ) {
        debug('根据全局选项跳过Reddit任务', { doTask });
        echoLog({ type: 'globalOptionsSkip', text: 'reddit.reddits', before: '[Reddit]' });
        return true;
      }

      const realReddits: Array<string> = this.getRealParams('reddits', redditLinks, doTask,
        (link) => {
          const name = link.match(/https?:\/\/www\.reddit\.com\/r\/([^/]*)/)?.[1];
          const userName = link.match(/https?:\/\/www\.reddit\.com\/user\/([^/]*)/)?.[1];
          if (userName) {
            return name || userName;
          }
          return name;
        });
      debug('处理后的Reddit列表', { count: realReddits.length, reddits: realReddits });

      if (realReddits.length === 0) {
        debug('没有需要处理的Reddit链接');
        return true;
      }

      const prom: Array<Promise<boolean>> = [];
      for (const name of realReddits) {
        prom.push(this.#toggleTask({ name, doTask }));
        await delay(1000);
      }

      return await Promise.all(prom).then(() => true);
    } catch (error) {
      debug('处理Reddit链接任务时发生错误', { error });
      throwError(error as Error, 'Reddit.toggle');
      return false;
    }
  }
}

export default Reddit;
