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
   * 更新Reddit的身份验证Token。
   *
   * @async
   * @private
   * @function #updateAuth
   * @returns {Promise<boolean>} - 返回一个Promise，表示更新操作的结果。
   *                              - true: 更新Token成功
   *                              - false: 更新Token失败
   *
   * @description
   * 该方法通过打开Reddit网站的设置页面来更新Token。
   * 使用`GM_cookie.list`方法获取当前的cookie信息，如果成功获取到`csrf_token`的值，则更新存储的身份验证信息。
   * 如果用户未登录，则记录错误信息并返回false。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async #updateAuth(): Promise<boolean> {
    try {
      debug('开始更新Reddit授权');
      const logStatus = echoLog({ text: __('updatingAuth', 'Reddit'), before: '[Reddit]' });
      return await new Promise((resolve) => {
        GM_cookie.list({ url: 'https://www.reddit.com/' }, async (cookies, error) => {
          if (!error) {
            const csrftoken = cookies.find((cookie) => cookie.name === 'csrf_token')?.value;
            if (csrftoken) {
              debug('成功获取Reddit授权信息');
              this.#auth = { csrftoken };
              logStatus.success();
              resolve(true);
            } else {
              debug('获取Reddit授权失败');
              logStatus.error('Error: Parameter "csrf_token" not found!');
              resolve(false);
            }
          } else {
            debug('获取Reddit授权失败', { error });
            logStatus.error('Error: Update reddit auth failed!');
            resolve(false);
          }
        });
      });
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
      let postBody;
      if (/^u_/.test(name)) {
        const accountId = await this.#getUserId(name.replace('u_', ''));
        type = doTask ? 'followingRedditUser' : 'unfollowingRedditUser';
        postBody = {
          operation: 'UpdateProfileFollowState',
          variables: {
            input: {
              accountId,
              state: doTask ? 'FOLLOWED' : 'NONE'
            }
          },
          csrf_token: this.#auth.csrftoken
        };
      } else {
        const subredditId = await this.#getSubredditId(name);
        if (!subredditId) {
          return false;
        }
        postBody = {
          operation: 'UpdateSubredditSubscriptions',
          variables: {
            input: {
              inputs: [{
                subredditId,
                subscribeState: doTask ? 'SUBSCRIBED' : 'NONE'
              }]
            }
          },
          csrf_token: this.#auth.csrftoken
        };
      }
      debug('任务类型', { type, name });
      const logStatus = echoLog({ type, text: name, before: '[Reddit]' });

      const { result, statusText, status, data } = await httpRequest({
        url: 'https://www.reddit.com/svc/shreddit/graphql',
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        data: JSON.stringify(postBody)
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

      if (data.response?.data?.[postBody.operation]?.ok) {
        debug('Reddit推操作出错', { error: data.response?.data?.errors?.[0] });
        logStatus.error(`Error:${data.response?.data?.errors?.[0]}`);
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

  async #getSubredditId(name: string): Promise<string | false> {
    try {
      const logStatus = echoLog({ type: 'gettingRedditSubredditId', text: name, before: '[Reddit]' });

      const { result, statusText, status, data } = await httpRequest({
        url: `https://www.reddit.com/r/${name}`,
        method: 'GET'
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

      const id = data.response?.match(/<shreddit-subreddit-header-buttons[^>]*\ssubreddit-id="([^"]+)"/)?.[1];
      if (!id) {
        debug('获取Reddit SubredditId操作出错', { error: data.response });
        logStatus.error('Error');
        return false;
      }

      debug('Reddit任务处理成功', { name, id });
      logStatus.success();
      return id;
    } catch (error) {
      debug('获取Reddit SubredditId时发生错误', { error });
      throwError(error as Error, 'Reddit.getSubredditId');
      return false;
    }
  }

  async #getUserId(name: string): Promise<string | false> {
    try {
      const logStatus = echoLog({ type: 'gettingRedditUserId', text: name, before: '[Reddit]' });

      const { result, statusText, status, data } = await httpRequest({
        url: `https://www.reddit.com/user/${name}`,
        method: 'GET'
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

      const id = data.response?.match(/<follow-button[^>]*\sredditor-id="([^"]+)"/)?.[1];
      if (!id) {
        debug('获取Reddit UserId操作出错', { error: data.response });
        logStatus.error('Error');
        return false;
      }

      debug('Reddit任务处理成功', { name, id });
      logStatus.success();
      return id;
    } catch (error) {
      debug('获取Reddit UserId时发生错误', { error });
      throwError(error as Error, 'Reddit.getUserId');
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
          return name || `u_${userName}`;
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
