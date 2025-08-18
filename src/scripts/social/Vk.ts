/*
 * @Author       : HCLonely
 * @Date         : 2021-10-04 11:47:59
 * @LastEditTime : 2025-08-18 19:08:34
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/social/Vk.ts
 * @Description  : Vk 加入/退出群组，关注/取关用户，转发/取消转发动态
 */

import Social from './Social';
import echoLog from '../echoLog';
import throwError from '../tools/throwError';
import httpRequest from '../tools/httpRequest';
import __ from '../tools/i18n';
import { unique, delay } from '../tools/tools';
import { globalOptions } from '../globalOptions';
import { debug } from '../tools/debug';

interface dataParams {
  type: string
  groupAct?: string
  groupId?: string
  groupHash?: string
  publicHash?: string
  publicPid?: string
  publicJoined?: boolean
  wallHash?: string
  hash?: string
  trackCode?: string
  object?: string
}

/**
 * Vk类用于处理与Vk社交平台相关的任务，包括加入/退出群组，关注/取关用户，以及转发/删除动态。
 *
 * @class Vk
 * @extends Social
 *
 * @property {vkTasks} tasks - 当前Vk任务列表。
 * @property {vkTasks} whiteList - 白名单任务列表。
 * @private
 * @property {string} #username - 当前用户的用户名。
 * @private
 * @property {cache} #cache - 存储Vk墙ID与帖子ID的缓存。
 * @private
 * @property {boolean} #initialized - 模块是否已初始化的状态。
 *
 * @constructor
 * @description 创建一个Vk实例，初始化任务模板和白名单。
 *
 * @async
 * @function init
 * @returns {Promise<boolean>} - 返回初始化结果，true表示成功，false表示失败。
 *
 * @async
 * @function #verifyAuth
 * @returns {Promise<boolean>} - 返回Token验证结果，true表示有效，false表示无效。
 *
 * @async
 * @function #toggleGroup
 * @param {string} name - 群组名称。
 * @param {dataParams} dataParam - 请求参数，包括群组ID和哈希值。
 * @param {boolean} [doTask=true] - 指示是否执行任务，true表示关注，false表示取关。
 * @returns {Promise<boolean>} - 返回操作结果，true表示成功，false表示失败。
 *
 * @async
 * @function #togglePublic
 * @param {string} name - Public的名称。
 * @param {dataParams} dataParam - 请求参数，包括公共页面的ID和哈希值。
 * @param {boolean} [doTask=true] - 指示是否执行任务，true表示关注，false表示取关。
 * @returns {Promise<boolean>} - 返回操作结果，true表示成功，false表示失败。
 *
 * @async
 * @function #sendWall
 * @param {string} name - 要转发的墙的ID。
 * @returns {Promise<boolean>} - 返回操作结果，true表示成功，false表示失败。
 *
 * @async
 * @function #deleteWall
 * @param {string} name - 要删除的墙的ID。
 * @param {dataParams} dataParams - 请求参数。
 * @returns {Promise<boolean>} - 返回操作结果，true表示删除成功，false表示删除失败。
 *
 * @async
 * @function #getId
 * @param {string} name - 要获取ID的名称。
 * @param {boolean} doTask - 指示是否执行任务，true表示执行，false表示取消。
 * @returns {Promise<dataParams | false>} - 返回获取操作的结果，成功时返回请求参数，失败时返回false。
 *
 * @async
 * @function #toggleVk
 * @param {Object} options - 选项对象。
 * @param {string} options.name - 要处理的Vk名称。
 * @param {boolean} [options.doTask=true] - 指示是否执行任务，true表示执行，false表示取消。
 * @returns {Promise<boolean>} - 返回操作结果，true表示成功，false表示失败。
 *
 * @async
 * @function toggle
 * @param {Object} options - 选项对象。
 * @param {boolean} [options.doTask=true] - 指示是否执行任务，true表示执行，false表示取消。
 * @param {Array<string>} [options.nameLinks=[]] - Vk任务链接数组。
 * @returns {Promise<boolean>} - 返回操作结果，true表示成功，false表示失败。
 *
 * @function #setCache
 * @param {string} name - 要缓存的Vk墙的名称。
 * @param {string} postId - 要缓存的Vk帖子ID。
 * @returns {void} - 无返回值。
 */
class Vk extends Social {
  tasks: vkTasks;
  whiteList: vkTasks;
  #username = '';
  #cache: cache = GM_getValue<cache>('vkCache') || {};
  #initialized = false;

  /**
   * 创建一个Vk实例。
   *
   * @constructor
   * @description
   * 此构造函数初始化Vk类的实例，设置默认任务模板和白名单。
   * 默认任务模板包含一个空的名称数组，用于存储Vk相关的任务信息。
   * 白名单将从GM_getValue中获取，如果没有找到，则使用默认任务模板。
   */
  constructor() {
    super();
    const defaultTasksTemplate: vkTasks = {
      names: []
    };
    debug('初始化Vk实例');
    this.tasks = defaultTasksTemplate;
    this.whiteList = { ...defaultTasksTemplate, ...(GM_getValue<whiteList>('whiteList')?.vk || {}) };
  }

  /**
   * 初始化Vk模块，验证用户身份并获取授权。
   *
   * @async
   * @function init
   * @returns {Promise<boolean>} - 返回一个Promise，表示初始化的结果。
   *                              - true: 初始化成功
   *                              - false: 初始化失败，toggle方法不可用
   *
   * @description
   * 该方法首先检查模块是否已初始化。如果已初始化，则直接返回true。
   * 然后调用`#verifyAuth`方法验证用户身份。如果验证成功，记录成功日志并将初始化状态设置为true。
   * 如果验证失败，则记录错误日志并返回false。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async init(): Promise<boolean> {
    try {
      debug('开始初始化Vk模块');
      if (this.#initialized) {
        debug('Vk模块已初始化');
        return true;
      }
      const isVerified: boolean = await this.#verifyAuth();
      if (isVerified) {
        debug('Vk授权验证成功');
        echoLog({ before: '[Vk]' }).success(__('initSuccess', 'Vk'));
        this.#initialized = true;
        return true;
      }
      debug('Vk初始化失败');
      echoLog({ before: '[Vk]' }).error(__('initFailed', 'Vk'));
      return false;
    } catch (error) {
      debug('Vk初始化发生错误', { error });
      throwError(error as Error, 'Vk.init');
      return false;
    }
  }

  /**
   * 验证Vk的身份验证Token是否有效。
   *
   * @async
   * @function #verifyAuth
   * @returns {Promise<boolean>} - 返回一个Promise，表示Token验证的结果。
   *                              - true: Token有效
   *                              - false: Token失效
   *
   * @description
   * 该方法通过发送GET请求到Vk的IM接口来验证Token的有效性。
   * 如果请求成功且返回的URL包含登录页面，则记录错误信息并返回false。
   * 如果返回的状态为200，则提取用户名并记录成功日志，返回true。
   * 如果请求失败或返回的状态不符合预期，则记录错误信息并返回false。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async #verifyAuth(): Promise<boolean> {
    try {
      debug('开始验证Vk授权');
      const logStatus = echoLog({ text: __('verifyAuth', 'Vk'), before: '[Vk]' });
      const { result, statusText, status, data } = await httpRequest({
        url: 'https://vk.com/im',
        method: 'GET'
      });

      if (result !== 'Success') {
        debug('Vk授权验证请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.finalUrl.includes('vk.com/login')) {
        debug('Vk授权验证失败：需要登录');
        logStatus.error(`Error:${__('loginVk')}`, true);
        return false;
      }

      if (data?.status !== 200) {
        debug('Vk授权验证状态错误', { status: data?.status, statusText: data?.statusText });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      this.#username = data.responseText.match(/TopNavBtn__profileLink" href="\/(.*?)"/)?.[1] || '';
      debug('Vk授权验证成功');
      logStatus.success();
      return true;
    } catch (error) {
      debug('Vk授权验证发生错误', { error });
      throwError(error as Error, 'Vk.verifyAuth');
      return false;
    }
  }

  /**
   * 处理Vk Group相关任务，关注或取关指定的群组。
   *
   * @async
   * @function #toggleGroup
   * @param {string} name - 群组名称。
   * @param {dataParams} dataParam - 请求参数，包括群组ID和哈希值。
   * @param {boolean} [doTask=true] - 指示是否执行任务，true表示关注，false表示取关。
   * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
   *                              - true: 操作成功
   *                              - false: 操作失败
   *
   * @description
   * 该方法根据传入的参数处理Vk群组的关注或取关任务。
   * 如果当前操作与请求的操作相反，则直接返回true。
   * 构建请求数据并发送POST请求到Vk API以执行关注或取关操作。
   * 如果请求成功且返回结果为'Success'，并且状态码为200，则记录成功日志并更新任务列表。
   * 如果请求失败或返回的状态不符合预期，则记录错误信息并返回false。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async #toggleGroup(name: string, dataParam: dataParams, doTask = true): Promise<boolean> {
    try {
      debug('开始处理Vk群组任务', { name, doTask });
      const logStatus = echoLog({ type: doTask ? 'joiningVkGroup' : 'leavingVkGroup', text: name, before: '[Vk]' });
      if ((dataParam.groupAct === 'enter' && !doTask) || (dataParam.groupAct === 'leave' && doTask)) {
        debug('Vk群组操作已完成，跳过', { name, doTask });
        logStatus.success();
        return true;
      }

      const reqData: {
        act: string
        al: number
        gid: string
        hash: string
        context?: string
      } = {
        act: doTask ? 'enter' : 'leave',
        al: 1,
        gid: dataParam.groupId as string,
        hash: dataParam.groupHash as string
      };
      if (doTask) reqData.context = '_';

      const { result, statusText, status, data } = await httpRequest({
        url: 'https://vk.com/al_groups.php',
        method: 'POST',
        headers: {
          origin: 'https://vk.com',
          referer: `https://vk.com/${name}`,
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: $.param(reqData)
      });

      if (result !== 'Success') {
        debug('Vk群组操作请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }
      if (data?.status !== 200) {
        debug('Vk群组操作状态错误', { status: data?.status, statusText: data?.statusText });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }
      debug('Vk群组操作成功', { name, doTask });
      logStatus.success();
      if (doTask) {
        this.tasks.names = unique([...this.tasks.names, name]);
      }
      return true;
    } catch (error) {
      debug('处理Vk群组任务时发生错误', { error });
      throwError(error as Error, 'Vk.toggleGroup');
      return false;
    }
  }

  /**
   * 处理Vk Public相关任务，关注或取关指定的公共页面。
   *
   * @async
   * @function #togglePublic
   * @param {string} name - Public的名称。
   * @param {dataParams} dataParam - 请求参数，包括公共页面的ID和哈希值。
   * @param {boolean} [doTask=true] - 指示是否执行任务，true表示关注，false表示取关。
   * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
   *                              - true: 操作成功
   *                              - false: 操作失败
   *
   * @description
   * 该方法根据传入的参数处理Vk公共页面的关注或取关任务。
   * 如果当前操作与请求的操作相反，则直接返回true。
   * 构建请求数据并发送POST请求到Vk API以执行关注或取关操作。
   * 如果请求成功且返回结果为'Success'，并且状态码为200，则记录成功日志并更新任务列表。
   * 如果请求失败或返回的状态不符合预期，则记录错误信息并返回false。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async #togglePublic(name: string, dataParam: dataParams, doTask = true): Promise<boolean> {
    try {
      debug('开始处理Vk公共页面任务', { name, doTask });
      const logStatus = echoLog({ type: doTask ? 'joiningVkPublic' : 'leavingVkPublic', text: name, before: '[Vk]' });
      if ((dataParam.publicJoined && doTask) || (!dataParam.publicJoined && !doTask)) {
        debug('Vk公共页面操作已完成，跳过', { name, doTask });
        logStatus.success();
        return true;
      }

      const { result, statusText, status, data } = await httpRequest({
        url: 'https://vk.com/al_public.php',
        method: 'POST',
        headers: {
          origin: 'https://vk.com',
          referer: `https://vk.com/${name}`,
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: $.param({
          act: doTask ? 'a_enter' : 'a_leave',
          al: 1,
          pid: dataParam.publicPid,
          hash: dataParam.publicHash
        })
      });

      if (result !== 'Success') {
        debug('Vk公共页面操作请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status !== 200) {
        debug('Vk公共页面操作状态错误', { status: data?.status, statusText: data?.statusText });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      debug('Vk公共页面操作成功', { name, doTask });
      logStatus.success();
      if (doTask) this.tasks.names = unique([...this.tasks.names, name]);
      return true;
    } catch (error) {
      debug('处理Vk公共页面任务时发生错误', { error });
      throwError(error as Error, 'Vk.togglePublic');
      return false;
    }
  }

  async #toggleLikeWall(name:string, dataParam: dataParams, doTask = true): Promise<boolean> {
    try {
      debug('开始处理Vk点赞任务', { name, doTask });
      const logStatus = echoLog({ type: doTask ? 'likingVkPublic' : 'unlikingVkPublic', text: name, before: '[Vk]' });

      const postData: { [name: string]: any } = {
        act: 'a_set_reaction',
        al: 1,
        event_subtype: 'post_modal',
        from: 'wall_page',
        hash: dataParam.hash,
        object: dataParam.object,
        track_code: dataParam.trackCode,
        wall: 2
      };
      if (doTask) {
        postData.reaction_id = 0;
      }

      const { result: resultR, statusText: statusTextR, status: statusR, data: dataR } = await httpRequest({
        url: 'https://vk.com/like.php?act=a_set_reaction',
        method: 'POST',
        headers: {
          origin: 'https://vk.com',
          referer: `https://vk.com/${name}`,
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: $.param(postData)
      });

      if (resultR !== 'Success') {
        debug('Vk点赞操作请求失败', { result: resultR, statusText: statusTextR, status: statusR });
        logStatus.error(`${resultR}:${statusTextR}(${statusR})`);
        return false;
      }

      if (dataR?.status !== 200) {
        debug('Vk点赞操作状态错误', { status: dataR?.status, statusText: dataR?.statusText });
        logStatus.error(`Error:${dataR?.statusText}(${dataR?.status})`);
        return false;
      }

      if (dataR.response?.payload?.[1]?.[1]?.like_my !== true) {
        debug('Vk点赞操作验证失败');
        logStatus.error(`Error:${dataR?.statusText}(${dataR?.status})`);
        return false;
      }

      debug('Vk点赞操作成功', { name, doTask });
      logStatus.success();
      return true;
    } catch (error) {
      debug('处理Vk点赞任务时发生错误', { error });
      throwError(error as Error, 'Vk.sendWall');
      return false;
    }
  }

  /**
   * 转发指定的Vk墙内容。
   *
   * @async
   * @function #sendWall
   * @param {string} name - 要转发的墙的ID。
   * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
   *                              - true: 成功
   *                              - false: 失败
   *
   * @description
   * 该方法通过发送POST请求到Vk的API来转发墙内容。
   * 首先构建请求数据并发送请求以发布墙内容。
   * 如果请求成功且返回结果为'Success'，则继续处理返回的数据以获取hash值。
   * 使用hash值再次发送请求以完成转发操作。
   * 如果转发成功且返回的状态为200，则记录成功日志并更新任务列表。
   * 如果在任何步骤中发生错误，将记录错误信息并返回false。
   */
  async #sendWall(name: string): Promise<boolean> {
    try {
      debug('开始处理Vk转发任务', { name });
      const logStatus = echoLog({ type: 'sendingVkWall', text: name, before: '[Vk]' });
      const { result, statusText, status, data } = await httpRequest({
        url: 'https://vk.com/like.php',
        method: 'POST',
        headers: {
          origin: 'https://vk.com',
          referer: `https://vk.com/${name}`,
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: $.param({
          act: 'publish_box',
          al: 1,
          object: name
        })
      });

      if (result !== 'Success') {
        debug('Vk转发操作请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status !== 200) {
        debug('Vk转发操作状态错误', { status: data?.status, statusText: data?.statusText });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      const hash = data.responseText.match(/shHash:[\s]*'(.*?)'/)?.[1];
      if (!hash) {
        debug('获取Vk转发hash失败');
        logStatus.error('Error: Get "hash" failed');
        return false;
      }

      const { result: resultR, statusText: statusTextR, status: statusR, data: dataR } = await httpRequest({
        url: 'https://vk.com/like.php',
        method: 'POST',
        headers: {
          origin: 'https://vk.com',
          referer: `https://vk.com/${name}`,
          'content-type': 'application/x-www-form-urlencoded'
        },
        /* eslint-disable camelcase */
        data: $.param({
          Message: '',
          act: 'a_do_publish',
          al: 1,
          close_comments: 0,
          friends_only: 0,
          from: 'box',
          hash,
          list: '',
          mark_as_ads: 0,
          mute_notifications: 0,
          object: name,
          ret_data: 1,
          to: 0
        })
        /* eslint-enable camelcase */
      });

      if (resultR !== 'Success') {
        debug('Vk转发确认请求失败', { result: resultR, statusText: statusTextR, status: statusR });
        logStatus.error(`${resultR}:${statusTextR}(${statusR})`);
        return false;
      }

      if (dataR?.status !== 200) {
        debug('Vk转发确认状态错误', { status: dataR?.status, statusText: dataR?.statusText });
        logStatus.error(`Error:${dataR?.statusText}(${dataR?.status})`);
        return false;
      }

      const jsonData = JSON.parse(dataR.responseText?.replace('<!--', '') || '{}');
      if (jsonData?.payload?.[1]?.[1]?.share_my !== true) {
        debug('Vk转发确认验证失败');
        logStatus.error(`Error:${dataR?.statusText}(${dataR?.status})`);
        return false;
      }

      debug('Vk转发操作成功', { name });
      logStatus.success();
      const postId = jsonData?.payload?.[1]?.[1]?.post_id;
      const ownerId = jsonData?.payload?.[1]?.[1]?.owner_id;
      if (postId && ownerId) {
        this.#setCache(name, `${ownerId}_${postId}`);
      }
      this.tasks.names = unique([...this.tasks.names, name]);
      return true;
    } catch (error) {
      debug('处理Vk转发任务时发生错误', { error });
      throwError(error as Error, 'Vk.sendWall');
      return false;
    }
  }

  /**
   * 删除指定的Vk墙内容。
   *
   * @async
   * @function #deleteWall
   * @param {string} name - 要删除的墙的ID。
   * @param {dataParams} dataParams - 请求参数。
   * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
   *                              - true: 删除成功
   *                              - false: 删除失败
   *
   * @description
   * 该方法通过发送POST请求到Vk的API来删除墙内容。
   * 首先构建请求数据并发送请求以删除指定的墙内容。
   * 如果请求成功且返回结果为'Success'，则记录成功日志并返回true。
   * 如果请求失败或返回的状态不符合预期，则记录错误信息并返回false。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async #deleteWall(name: string, dataParams: dataParams): Promise<boolean> {
    try {
      debug('开始处理Vk删除墙任务', { name });
      const logStatus = echoLog({ type: 'deletingVkWall', text: name, before: '[Vk]' });
      const { result, statusText, status, data } = await httpRequest({
        url: 'https://vk.com/al_wall.php?act=delete',
        method: 'POST',
        headers: {
          origin: 'https://vk.com',
          referer: `https://vk.com/${this.#username}?w=wall${this.#cache[name]}%2Fall`,
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: $.param({
          act: 'delete',
          al: 1,
          confirm: 0,
          from: 'wkview',
          hash: dataParams.wallHash,
          post: this.#cache[name]
        })
      });
      if (result !== 'Success') {
        debug('Vk删除墙请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }
      if (data?.status !== 200) {
        debug('Vk删除墙状态错误', { status: data?.status, statusText: data?.statusText });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }
      const jsonData = JSON.parse(data.responseText?.replace('<!--', '') || '{}');
      if (!jsonData?.payload?.[1]?.[1]) {
        debug('Vk删除墙验证失败');
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }
      debug('Vk删除墙操作成功', { name });
      logStatus.success();
      return true;
    } catch (error) {
      debug('处理Vk删除墙任务时发生错误', { error });
      throwError(error as Error, 'Vk.deleteWall');
      return false;
    }
  }

  /**
   * 获取指定名称的请求参数。
   *
   * @async
   * @function #getId
   * @param {string} name - 要获取ID的名称。
   * @param {boolean} doTask - 指示是否执行任务，true表示执行，false表示取消。
   * @returns {Promise<dataParams | false>} - 返回一个Promise，表示获取操作的结果。
   *                                          - {dataParams}: 获取成功，返回请求参数
   *                                          - false: 获取失败
   *
   * @description
   * 该方法根据传入的名称构建请求URL，并发送GET请求以获取相关的请求参数。
   * 如果名称以`wall-`开头，则根据`doTask`的值决定返回不同的请求参数。
   * 如果请求成功且返回状态为200，则解析响应文本以提取所需的参数。
   * 如果未找到所需的参数，则记录错误信息并返回false。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async #getId(name: string, doTask: boolean): Promise<dataParams | false> {
    try {
      debug('开始获取Vk ID', { name, doTask });
      let url = `https://vk.com/${name}`;
      if (/^wall-/.test(name)) {
        if (doTask) {
          return { type: 'sendWall' };
        }
        if (!this.#cache[name]) {
          return { type: 'unSupport' };
        }
        url = `https://vk.com/${this.#username}?w=wall${this.#cache[name]}`;
      }
      const logStatus = echoLog({ type: 'gettingVkId', text: name, before: '[Vk]' });
      const { result, statusText, status, data } = await httpRequest({
        url,
        method: 'GET'
      });
      if (result !== 'Success') {
        debug('获取Vk ID请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }
      if (data?.status !== 200) {
        debug('获取Vk ID状态错误', { status: data?.status, statusText: data?.statusText });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }
      const [, groupAct, groupId, , groupHash] = data.responseText.match(/Groups.(enter|leave)\(.*?,.*?([\d]+?), (&#39;|')(.*?)(&#39;|')/) || [];
      const publicHash = data.responseText.match(/"enterHash":"(.*?)"/)?.[1];
      const publicPid = data.responseText.match(/"public_id":([\d]+?),/)?.[1];
      const publicJoined = !data.responseText.includes('Public.subscribe');
      if (groupAct && groupId && groupHash) {
        debug('获取到Vk群组ID', { groupAct, groupId, groupHash });
        logStatus.success();
        return { groupAct, groupId, groupHash, type: 'group' };
      }
      if (publicHash && publicPid) {
        debug('获取到Vk公共页面ID', { publicHash, publicPid, publicJoined });
        logStatus.success();
        return { publicHash, publicPid, publicJoined, type: 'public' };
      }
      if (name.includes('action=like')) {
        const hash = data.responseText.match(/data-reaction-hash="(.*?)"/)?.[1];
        const trackCode = data.responseText.match(/data-post-track-code="(.*?)"/)?.[1];
        const object = name.match(/wall-[\w_]+/)?.[0];
        if (hash && trackCode && object) {
          debug('获取到Vk点赞ID', { hash, trackCode, object });
          logStatus.success();
          return { type: 'likeWall', hash, trackCode, object };
        }
      }
      if (data.responseText.includes('wall.deletePost') && !doTask) {
        const wallHash = data.responseText.match(/wall\.deletePost\(this, '.*?', '(.*?)'\)/)?.[1];
        if (wallHash) {
          debug('获取到Vk删除墙ID', { wallHash });
          logStatus.success();
          return { type: 'deleteWall', wallHash };
        }
      }
      if (name.includes('wall') && doTask) {
        debug('获取到Vk墙ID');
        logStatus.success();
        return { type: 'sendWall' };
      }
      debug('未找到Vk ID参数');
      logStatus.error('Error: Parameters not found!');
      return false;
    } catch (error) {
      debug('获取Vk ID时发生错误', { error });
      throwError(error as Error, 'Vk.getId');
      return false;
    }
  }

  /**
   * 处理Vk相关任务，关注或取消关注指定的名称。
   *
   * @async
   * @function #toggleVk
   * @param {Object} options - 选项对象。
   * @param {string} options.name - 要处理的Vk名称。
   * @param {boolean} [options.doTask=true] - 指示是否执行任务，true表示执行，false表示取消。
   * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
   *                              - true: 操作成功
   *                              - false: 操作失败
   *
   * @description
   * 该方法根据传入的参数处理Vk相关任务。
   * 如果`doTask`为false且名称在白名单中，则直接返回true。
   * 调用`#getId`方法获取相关数据，如果获取失败则返回false。
   * 根据数据的类型决定调用相应的处理方法（如`#toggleGroup`、`#togglePublic`、`#sendWall`或`#deleteWall`）。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async #toggleVk({ name, doTask = true }: { name: string, doTask: boolean }): Promise<boolean> {
    try {
      debug('开始处理Vk任务', { name, doTask });
      if (!doTask && this.whiteList.names.includes(name)) {
        debug('Vk任务在白名单中，跳过', { name });
        echoLog({ type: 'whiteList', text: 'Vk.undoTask', id: name, before: '[Vk]' });
        return true;
      }
      const formatName: string = name.replace(/\/$/, '');
      const data = await this.#getId(formatName, doTask);
      if (!data) return false;
      switch (data.type) {
          case 'group':
            return await this.#toggleGroup(formatName, data, doTask);
          case 'public':
            return await this.#togglePublic(formatName, data, doTask);
          case 'likeWall':
            return await this.#toggleLikeWall(formatName, data, doTask);
          case 'sendWall':
            return doTask ? await this.#sendWall(formatName) : true;
          case 'deleteWall':
            return doTask ? true : await this.#deleteWall(formatName, data);
          default:
            debug('未知的Vk任务类型', { type: data.type });
            return false;
      }
    } catch (error) {
      debug('处理Vk任务时发生错误', { error });
      throwError(error as Error, 'Vk.toggleVk');
      return false;
    }
  }

  /**
   * 统一处理Vk相关任务，关注或取消关注指定的名称。
   *
   * @async
   * @function toggle
   * @param {Object} options - 选项对象。
   * @param {boolean} [options.doTask=true] - 指示是否执行任务，true表示执行，false表示取消。
   * @param {Array<string>} [options.nameLinks=[]] - Vk任务链接数组。
   * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
   *                              - true: 操作成功
   *                              - false: 操作失败
   *
   * @description
   * 该方法根据传入的参数处理Vk相关任务。
   * 首先检查模块是否已初始化，如果未初始化，则返回false。
   * 根据`doTask`和全局选项判断是否执行任务。
   * 如果执行任务，则获取实际的名称参数，并逐个处理关注或取消关注操作。
   * 最后返回所有操作的结果，如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async toggle({
    doTask = true,
    nameLinks = []
  }: {
    doTask: boolean,
    nameLinks?: Array<string>
  }): Promise<boolean> {
    /**
     * @description 公有方法，统一处理Vk相关任务
     * @param {boolean} doTask true: 做任务 | false: 取消任务
     * @param {?Array} nameLinks Vk任务链接数组。
    */
    try {
      debug('开始处理Vk链接任务', { doTask, nameLinksCount: nameLinks.length });
      if (!this.#initialized) {
        debug('Vk模块未初始化');
        echoLog({ text: __('needInit'), before: '[Vk]' });
        return false;
      }
      const prom = [];

      if (
        (doTask && !globalOptions.doTask.vk.names) ||
        (!doTask && !globalOptions.undoTask.vk.names)
      ) {
        debug('根据全局选项跳过Vk任务', { doTask });
        echoLog({ type: 'globalOptionsSkip', text: 'vk.names', before: '[Vk]' });
      } else {
        const realNames = this.getRealParams('names', nameLinks, doTask, (link) => link.match(/https:\/\/vk\.com\/([^/]+)/)?.[1]);
        debug('处理后的Vk链接列表', { count: realNames.length, names: realNames });
        if (realNames.length > 0) {
          for (const name of realNames) {
            prom.push(this.#toggleVk({ name, doTask }));
            await delay(1000);
          }
        }
      }
      return Promise.all(prom).then(() => true);
    } catch (error) {
      debug('处理Vk链接任务时发生错误', { error });
      throwError(error as Error, 'Vk.toggle');
      return false;
    }
  }

  /**
   * 缓存Vk墙ID与帖子ID的对应关系。
   *
   * @function #setCache
   * @param {string} name - 要缓存的Vk墙的名称。
   * @param {string} postId - 要缓存的Vk帖子ID。
   * @returns {void} - 无返回值。
   *
   * @description
   * 该方法将墙名称与帖子ID的对应关系存储在缓存中，并使用`GM_setValue`将缓存保存到存储中。
   * 如果在设置缓存过程中发生错误，将抛出错误并记录错误信息。
   */
  #setCache(name: string, postId: string): void {
    try {
      debug('设置Vk缓存', { name, postId });
      this.#cache[name] = postId;
      GM_setValue('vkCache', this.#cache);
    } catch (error) {
      debug('设置Vk缓存时发生错误', { error });
      throwError(error as Error, 'Vk.setCache');
    }
  }
}

export default Vk;
