/*
 * @Author       : HCLonely
 * @Date         : 2021-10-04 10:00:41
 * @LastEditTime : 2025-08-18 19:08:48
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/social/Twitch.ts
 * @Description  : Twitch 关注/取关频道
 */

import Social from './Social';
import echoLog from '../echoLog';
import throwError from '../tools/throwError';
import httpRequest from '../tools/httpRequest';
import { unique, delay } from '../tools/tools';
import __ from '../tools/i18n';
import { globalOptions } from '../globalOptions';
import { debug } from '../tools/debug';

/**
 * @class Twitch
 * @extends Social
 * @description 代表Twitch社交平台的操作，包括关注和取关频道的功能。
 *
 * @property {twitchTasks} tasks - 存储Twitch相关的任务信息。
 * @property {twitchTasks} whiteList - 存储白名单中的频道信息。
 * @private
 * @property {auth} #auth - 存储Twitch的身份验证信息。
 * @private
 * @property {cache} #cache - 存储频道ID的缓存信息。
 * @private
 * @property {boolean} #initialized - 表示模块是否已初始化的状态。
 * @private
 * @property {string} #integrityToken - 存储Twitch的完整性Token。
 *
 * @constructor
 * @description 创建一个Twitch实例，初始化任务模板和白名单。
 *
 * @async
 * @function init
 * @returns {Promise<boolean>} - 返回初始化结果，true表示成功，false表示失败。
 *
 * @async
 * @function #verifyAuth
 * @param {boolean} isFirst - 指示是否为第一次验证的标志。
 * @returns {Promise<boolean>} - 返回Token验证结果，true表示有效，false表示无效。
 *
 * @async
 * @function #integrity
 * @param {boolean} [isFirst=true] - 指示是否为第一次检查的标志。
 * @param {string} [ct=''] - 可选的上下文标识符。
 * @returns {Promise<boolean>} - 返回完整性检查结果，true表示成功，false表示失败。
 *
 * @async
 * @function #updateAuth
 * @param {boolean} [isFirst=true] - 指示是否为第一次更新的标志。
 * @returns {Promise<boolean>} - 返回更新操作结果，true表示成功，false表示失败。
 *
 * @async
 * @function #toggleChannel
 * @param {Object} options - 选项对象。
 * @param {string} options.name - Twitch频道名。
 * @param {boolean} [options.doTask=true] - 指示是否执行任务。
 * @returns {Promise<boolean>} - 返回操作结果，true表示成功，false表示失败。
 *
 * @async
 * @function #getChannelId
 * @param {string} name - Twitch频道名。
 * @returns {Promise<string | false>} - 返回频道ID或false。
 *
 * @async
 * @function toggle
 * @param {Object} options - 选项对象。
 * @param {boolean} [options.doTask=true] - 指示是否执行任务。
 * @param {Array<string>} [options.channelLinks=[]] - Twitch频道链接数组。
 * @returns {Promise<boolean>} - 返回操作结果，true表示成功，false表示失败。
 *
 * @function #setCache
 * @param {string} name - 要缓存的Twitch频道名。
 * @param {string} id - 要缓存的Twitch频道ID。
 * @returns {void} - 无返回值。
 */
class Twitch extends Social {
  tasks: twitchTasks;
  whiteList: twitchTasks;
  #auth: auth = GM_getValue<auth>('twitchAuth') || {};
  #cache: cache = GM_getValue<cache>('twitchCache') || {};
  #initialized = false;
  #integrityToken!: string;

  /**
   * 创建一个Twitch实例。
   *
   * @constructor
   * @description
   * 此构造函数初始化Twitch类的实例，设置默认任务模板和白名单。
   * 默认任务模板包含一个空的频道数组，用于存储Twitch相关的任务信息。
   * 白名单将从GM_getValue中获取，如果没有找到，则使用默认任务模板。
   */
  constructor() {
    super();
    const defaultTasksTemplate: twitchTasks = {
      channels: []
    };
    debug('初始化Twitch实例');
    this.tasks = defaultTasksTemplate;
    this.whiteList = { ...defaultTasksTemplate, ...(GM_getValue<whiteList>('whiteList')?.twitch || {}) };
  }

  /**
   * 初始化Twitch模块，验证用户身份并获取授权。
   *
   * @async
   * @function init
   * @returns {Promise<boolean>} - 返回一个Promise，表示初始化的结果。
   *                              - true: 初始化成功
   *                              - false: 初始化失败，toggle方法不可用
   *
   * @description
   * 该方法首先检查模块是否已初始化。如果已初始化，则直接返回true。
   * 然后检查身份验证信息是否完整。如果不完整，则调用`#updateAuth`方法获取新的授权信息。
   * 如果身份验证成功，则记录成功日志并将初始化状态设置为true。
   * 如果身份验证失败，则清除存储的身份验证信息，并尝试再次更新授权。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async init(): Promise<boolean> {
    try {
      debug('开始初始化Twitch模块');
      if (this.#initialized) {
        debug('Twitch模块已初始化');
        return true;
      }
      if (!this.#auth.authToken || !this.#auth.clientId || !this.#auth.clientVersion || !this.#auth.deviceId || !this.#auth.clientSessionId) {
        if (await this.#updateAuth()) {
          this.#initialized = true;
          return true;
        }
        return false;
      }
      const isVerified: boolean = await this.#verifyAuth(true);
      if (isVerified) {
        debug('Twitch授权验证成功');
        echoLog({ before: '[Twitch]' }).success(__('initSuccess', 'Twitch'));
        this.#initialized = true;
        return true;
      }
      GM_setValue('twitchAuth', null);
      if (await this.#updateAuth()) {
        debug('Twitch重新授权成功');
        echoLog({ before: '[Twitch]' }).success(__('initSuccess', 'Twitch'));
        this.#initialized = true;
        return true;
      }
      debug('Twitch初始化失败');
      echoLog({ before: '[Twitch]' }).error(__('initFailed', 'Twitch'));
      return false;
    } catch (error) {
      debug('Twitch初始化发生错误', { error });
      throwError(error as Error, 'Twitch.init');
      return false;
    }
  }

  /**
   * 验证Twitch的身份验证Token是否有效。
   *
   * @async
   * @function #verifyAuth
   * @param {boolean} isFirst - 指示是否为第一次验证的标志。
   * @returns {Promise<boolean>} - 返回一个Promise，表示Token验证的结果。
   *                              - true: Token有效
   *                              - false: Token失效
   *
   * @description
   * 该方法通过发送POST请求到Twitch API来验证Token的有效性。
   * 如果请求成功且返回的结果为'Success'，并且状态码为200且包含当前用户信息，则记录成功日志并返回true。
   * 如果请求失败或返回的状态不符合预期，则记录错误信息并返回false。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async #verifyAuth(isFirst: boolean): Promise<boolean> {
    try {
      debug('开始验证Twitch授权');
      const logStatus = echoLog({ text: __('verifyingAuth', 'Twitch'), before: '[Twitch]' });
      const { result, statusText, status, data } = await httpRequest({
        url: 'https://gql.twitch.tv/gql',
        method: 'POST',
        dataType: 'json',
        headers: { Authorization: `OAuth ${this.#auth.authToken}`, 'Client-Id': this.#auth.clientId as string },
        data: (
          '[{"operationName":"FrontPageNew_User","variables":{"limit":1},"extensions":{"persistedQuery":{"version":1,' +
          '"sha256Hash":"64bd07a2cbaca80699d62636d966cf6395a5d14a1f0a14282067dcb28b13eb11"}}}]'
        )
      });

      if (result !== 'Success') {
        debug('Twitch授权验证请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status !== 200 || !data.response?.[0]?.data?.currentUser) {
        debug('Twitch授权验证状态错误', { status: data?.status, statusText: data?.statusText });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      await this.#integrity(isFirst);
      debug('Twitch授权验证成功');
      logStatus.success();
      return true;
    } catch (error) {
      debug('Twitch授权验证发生错误', { error });
      throwError(error as Error, 'Twitch.verifyAuth');
      return false;
    }
  }

  /**
   * 检查Twitch的完整性。
   *
   * @async
   * @function #integrity
   * @param {boolean} [isFirst=true] - 指示是否为第一次检查的标志，默认为true。
   * @param {string} [ct=''] - 可选的上下文标识符，用于完整性检查。
   * @returns {Promise<boolean>} - 返回一个Promise，表示完整性检查的结果。
   *                              - true: 完整性检查成功
   *                              - false: 完整性检查失败
   *
   * @description
   * 该方法执行Twitch的完整性检查，验证身份验证信息是否完整。
   * 如果是第一次检查且身份验证信息不完整，则调用`#updateAuth`方法更新身份验证。
   * 发送POST请求到Twitch的完整性检查API，并根据返回的结果判断检查是否成功。
   * 如果返回的结果为'Success'且状态码为200，则记录成功日志并返回true。
   * 如果返回的状态不符合预期，则记录错误信息并返回false。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async #integrity(isFirst = true, ct = ''): Promise<boolean> {
    try {
      debug('开始检查Twitch完整性', { isFirst, ct });
      const logStatus = echoLog({ text: __('checkingTwitchIntegrity'), before: '[Twitch]' });
      if (isFirst &&
        (!this.#auth.authToken || !this.#auth.clientId || !this.#auth.clientVersion || !this.#auth.deviceId || !this.#auth.clientSessionId)) {
        return await this.#updateAuth(false);
      }

      const { result, statusText, status, data } = await httpRequest({
        url: 'https://gql.twitch.tv/integrity',
        method: 'POST',
        dataType: 'json',
        anonymous: true,
        headers: {
          Origin: 'https://www.twitch.tv',
          Referer: 'https://www.twitch.tv/',
          Authorization: `OAuth ${this.#auth.authToken}`,
          'Client-Id': this.#auth.clientId as string,
          'Client-Version': this.#auth.clientVersion as string,
          'X-Device-Id': this.#auth.deviceId as string,
          'Client-Session-Id': this.#auth.clientSessionId as string,
          'x-kpsdk-ct': ct
        }
      });

      if (result !== 'Success') {
        debug('Twitch完整性检查请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (!ct && data?.responseHeaders?.['x-kpsdk-ct']) {
        debug('需要重新检查Twitch完整性');
        return await this.#integrity(isFirst, data.responseHeaders['x-kpsdk-ct']);
      }

      if (data?.status !== 200 || !data.response?.token) {
        debug('Twitch完整性检查状态错误', { status: data?.status, statusText: data?.statusText });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      this.#integrityToken = data.response.token;
      debug('Twitch完整性检查成功');
      logStatus.success();
      return true;
    } catch (error) {
      debug('Twitch完整性检查发生错误', { error });
      throwError(error as Error, 'Twitch.integrity');
      return false;
    }
  }

  /**
   * 更新Twitch的身份验证Token。
   *
   * @async
   * @function #updateAuth
   * @param {boolean} [isFirst=true] - 指示是否为第一次更新的标志，默认为true。
   * @returns {Promise<boolean>} - 返回一个Promise，表示更新操作的结果。
   *                              - true: 更新Token成功
   *                              - false: 更新Token失败
   *
   * @description
   * 该方法通过打开Twitch网站的授权页面来更新Token。
   * 当新标签页关闭时，检查存储的身份验证信息。如果存在有效的Token，则更新内部的`#auth`属性并记录成功日志。
   * 如果Token不存在，则记录错误信息并返回false。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async #updateAuth(isFirst = true): Promise<boolean> {
    try {
      debug('开始更新Twitch授权', { isFirst });
      const logStatus = echoLog({ text: __('updatingAuth', 'Twitch'), before: '[Twitch]' });
      return await new Promise((resolve) => {
        const newTab = GM_openInTab('https://www.twitch.tv/',
          { active: true, insert: true, setParent: true });
        // @ts-ignore
        newTab.name = 'ATv4_twitchAuth';
        newTab.onclose = async () => {
          const auth = GM_getValue<auth>('twitchAuth');
          if (auth) {
            debug('成功获取新的Twitch授权');
            this.#auth = auth;
            logStatus.success();
            resolve(await this.#verifyAuth(isFirst));
          } else {
            debug('获取Twitch授权失败');
            logStatus.error('Error: Update twitch auth failed!');
            resolve(false);
          }
        };
      });
    } catch (error) {
      debug('更新Twitch授权时发生错误', { error });
      throwError(error as Error, 'Twitch.updateAuth');
      return false;
    }
  }

  /**
   * 切换Twitch频道的订阅状态，关注或退订指定的频道。
   *
   * @async
   * @function #toggleChannel
   * @param {Object} options - 选项对象。
   * @param {string} options.name - Twitch频道名。
   * @param {boolean} [options.doTask=true] - 指示是否执行任务，true表示订阅频道，false表示退订频道。
   * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
   *                              - true: 操作成功
   *                              - false: 操作失败
   *
   * @description
   * 该方法处理Twitch频道的关注或退订任务。
   * 如果`doTask`为false且频道在白名单中，则直接返回true。
   * 通过调用`#getChannelId`方法获取频道ID，如果获取失败则返回false。
   * 根据`doTask`的值构建相应的请求数据，并发送POST请求到Twitch API。
   * 如果请求成功且返回结果为'Success'，并且状态码为200且没有错误，则记录成功日志并更新任务列表。
   * 如果请求失败或返回的状态不符合预期，则记录错误信息并返回false。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async #toggleChannel({ name, doTask = true }: { name: string, doTask: boolean }): Promise<boolean> {
    try {
      debug('开始处理Twitch频道任务', { name, doTask });
      if (!doTask && this.whiteList.channels.includes(name)) {
        debug('Twitch频道在白名单中，跳过取消关注', { name });
        echoLog({ type: 'whiteList', text: 'Twitch.unfollowChannel', id: name, before: '[Twitch]' });
        return true;
      }

      const channelId: string | boolean = await this.#getChannelId(name);
      if (!channelId) return false;

      const logStatus = echoLog({ type: `${doTask ? '' : 'un'}followingTwitchChannel`, text: name, before: '[Twitch]' });
      const followData: string = (
        `[{"operationName":"FollowButton_FollowUser","variables":{"input":{"disableNotifications":false,"targetID":"${channelId}` +
        '"}},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"800e7346bdf7e5278a3c1d3f21b2b56e2639928f86815677a7126b093b2fdd08"}}}]'
      );
      const unfollowData: string = (
        `[{"operationName":"FollowButton_UnfollowUser","variables":{"input":{"targetID":"${channelId}"}},` +
        '"extensions":{"persistedQuery":{"version":1,"sha256Hash":"f7dae976ebf41c755ae2d758546bfd176b4eeb856656098bb40e0a672ca0d880"}}}]'
      );

      const { result, statusText, status, data } = await httpRequest({
        url: 'https://gql.twitch.tv/gql',
        method: 'POST',
        dataType: 'json',
        anonymous: true,
        headers: {
          Origin: 'https://www.twitch.tv',
          Referer: 'https://www.twitch.tv/',
          Authorization: `OAuth ${this.#auth.authToken}`,
          'Client-Id': this.#auth.clientId as string,
          'Client-Version': this.#auth.clientVersion as string,
          'X-Device-Id': this.#auth.deviceId as string,
          'Client-Session-Id': this.#auth.clientSessionId as string,
          'Client-Integrity': this.#integrityToken
        },
        data: doTask ? followData : unfollowData
      });

      if (result !== 'Success') {
        debug('Twitch频道操作请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status !== 200 || (data.response?.[0] && data.response[0].errors)) {
        debug('Twitch频道操作状态错误', { status: data?.status, statusText: data?.statusText, errors: data?.response?.[0].errors });
        logStatus.error(`Error:${data?.response?.[0].errors?.[0]?.message || `${data?.statusText}(${data?.status})`}`);
        return false;
      }

      debug('Twitch频道操作成功', { name, doTask });
      logStatus.success();
      if (doTask) {
        this.tasks.channels = unique([...this.tasks.channels, name]);
      }
      return true;
    } catch (error) {
      debug('处理Twitch频道任务时发生错误', { error });
      throwError(error as Error, 'Twitch.toggleChannel');
      return false;
    }
  }

  /**
   * 通过频道名获取Twitch频道的ID。
   *
   * @async
   * @function #getChannelId
   * @param {string} name - Twitch频道名。
   * @returns {Promise<string | false>} - 返回一个Promise，表示获取操作的结果。
   *                                      - string: 获取成功，返回频道ID
   *                                      - false: 获取失败
   *
   * @description
   * 该方法首先检查缓存中是否存在对应的频道ID。如果存在，则直接返回该ID。
   * 如果不存在，则发送POST请求到Twitch的GraphQL API以获取频道信息。
   * 如果请求成功且返回结果为'Success'，并且状态码为200，则提取频道ID并缓存。
   * 如果获取失败或返回的状态不符合预期，则记录错误信息并返回false。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async #getChannelId(name: string): Promise<string | false> {
    try {
      debug('开始获取Twitch频道ID', { name });
      const logStatus = echoLog({ type: 'gettingTwitchChannelId', text: name, before: '[Twitch]' });
      const cachedChannelId = this.#cache[name];
      if (cachedChannelId) {
        debug('从缓存获取到Twitch频道ID', { name, id: cachedChannelId });
        logStatus.success();
        return cachedChannelId;
      }

      const { result, statusText, status, data } = await httpRequest({
        url: 'https://gql.twitch.tv/gql',
        method: 'POST',
        headers: { Authorization: `OAuth ${this.#auth.authToken}`, 'Client-Id': this.#auth.clientId as string },
        responseType: 'json',
        data: (
          `[{"operationName":"ActiveWatchParty","variables":{"channelLogin":"${name}"},` +
          '"extensions":{"persistedQuery":{"version":1,"sha256Hash":"4a8156c97b19e3a36e081cf6d6ddb5dbf9f9b02ae60e4d2ff26ed70aebc80a30"}}}]'
        )
      });

      if (result !== 'Success') {
        debug('获取Twitch频道ID请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status !== 200) {
        debug('获取Twitch频道ID状态错误', { status: data?.status, statusText: data?.statusText });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      const newChannelId = data.response?.[0]?.data?.user?.id;
      if (!newChannelId) {
        debug('未找到Twitch频道ID', { name });
        logStatus.error(`Error:${data?.statusText || 'Unknown'}(${data?.status || 'Unknown'})`);
        return false;
      }

      debug('成功获取Twitch频道ID', { name, id: newChannelId });
      this.#setCache(name, newChannelId);
      logStatus.success();
      return newChannelId;
    } catch (error) {
      debug('获取Twitch频道ID时发生错误', { error });
      throwError(error as Error, 'Twitch.getChannelId');
      return false;
    }
  }

  /**
   * 切换Twitch频道的订阅状态，关注或退订指定的频道。
   *
   * @async
   * @function toggle
   * @param {Object} options - 选项对象。
   * @param {boolean} [options.doTask=true] - 指示是否执行任务，true表示关注频道，false表示退订频道。
   * @param {Array<string>} [options.channelLinks=[]] - Twitch频道链接数组。
   * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
   *                              - true: 操作成功
   *                              - false: 操作失败
   *
   * @description
   * 该方法统一处理Twitch相关任务。首先检查模块是否已初始化，如果未初始化，则返回false。
   * 根据`doTask`和全局选项判断是否执行任务。如果执行任务，则获取实际的频道参数，并逐个处理关注或退订操作。
   * 最后返回所有操作的结果，如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async toggle({
    doTask = true,
    channelLinks = []
  }: {
    doTask: boolean,
    channelLinks?: Array<string>
  }): Promise<boolean> {
    try {
      debug('开始处理Twitch链接任务', { doTask, channelLinksCount: channelLinks.length });
      if (!this.#initialized) {
        debug('Twitch模块未初始化');
        echoLog({ text: __('needInit'), before: '[Twitch]' });
        return false;
      }
      const prom = [];
      if (
        (doTask && !globalOptions.doTask.twitch.channels) ||
        (!doTask && !globalOptions.undoTask.twitch.channels)
      ) {
        debug('根据全局选项跳过Twitch任务', { doTask });
        echoLog({ type: 'globalOptionsSkip', text: 'twitch.channels', before: '[Twitch]' });
      } else {
        const realChannels = this.getRealParams('channels', channelLinks, doTask,
          (link) => link.match(/https:\/\/(www\.)?twitch\.tv\/(.+)/)?.[2]);
        debug('处理后的Twitch频道列表', { count: realChannels.length, channels: realChannels });
        if (realChannels.length > 0) {
          for (const channel of realChannels) {
            prom.push(this.#toggleChannel({ name: channel, doTask }));
            await delay(1000);
          }
        }
      }
      return Promise.all(prom).then(() => true);
    } catch (error) {
      debug('处理Twitch链接任务时发生错误', { error });
      throwError(error as Error, 'Twitch.toggle');
      return false;
    }
  }

  /**
   * 设置缓存，将指定的频道名与频道ID进行关联。
   *
   * @function #setCache
   * @param {string} name - 要缓存的Twitch频道名。
   * @param {string} id - 要缓存的Twitch频道ID。
   * @returns {void} - 无返回值。
   *
   * @description
   * 该方法将频道名与频道ID的对应关系存储在缓存中，并使用`GM_setValue`将缓存保存到存储中。
   * 如果在设置缓存过程中发生错误，将抛出错误并记录错误信息。
   */
  #setCache(name: string, id: string): void {
    try {
      debug('设置Twitch频道ID缓存', { name, id });
      this.#cache[name] = id;
      GM_setValue('twitchCache', this.#cache);
    } catch (error) {
      debug('设置Twitch频道ID缓存时发生错误', { error });
      throwError(error as Error, 'Twitch.setCache');
    }
  }
}
// unsafeWindow.Twitch = Twitch;
export default Twitch;
