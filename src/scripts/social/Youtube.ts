/*
 * @Author       : HCLonely
 * @Date         : 2021-10-04 12:18:06
 * @LastEditTime : 2025-08-18 19:08:20
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/social/Youtube.ts
 * @Description  : Youtube 订阅/取消订阅频道，点赞/取消点赞视频
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
 * 获取YouTube视频或频道的信息。
 *
 * @async
 * @function getInfo
 * @param {string} link - 要请求的YouTube链接。
 * @param {string} type - 任务类型，可能的值包括'channel'和'likeVideo'。
 * @returns {Promise<youtubeInfo>} - 返回一个Promise，表示获取操作的结果。
 *                                   - {youtubeInfo}: 获取成功，返回请求参数
 *                                   - false: 获取失败
 *
 * @description
 * 该函数通过发送GET请求到指定的YouTube链接来获取相关信息。
 * 如果请求成功且返回状态为200，则解析响应文本以提取所需的参数。
 * 根据任务类型，分别处理频道ID或视频ID的获取。
 * 如果在获取过程中发生错误，将记录错误信息并返回空对象。
 */
const getInfo = async function (link: string, type: string): Promise<youtubeInfo> {
  try {
    debug('开始获取YouTube信息', { link, type });
    const logStatus = echoLog({ text: __('gettingYtbToken'), before: '[Youtube]' });
    const { result, statusText, status, data } = await httpRequest({
      url: link,
      method: 'GET'
    });

    if (result !== 'Success') {
      debug('获取YouTube信息请求失败', { result, statusText, status });
      logStatus.error(`${result}:${statusText}(${status})`);
      return {};
    }

    if (data?.status !== 200) {
      debug('获取YouTube信息状态错误', { status: data?.status, statusText: data?.statusText });
      logStatus.error(`Error:${data?.statusText}(${data?.status})`);
      return {};
    }

    if (data.responseText.includes('accounts.google.com/ServiceLogin?service=youtube')) {
      debug('获取YouTube信息失败：需要登录');
      logStatus.error(`Error:${__('loginYtb')}`, true);
      return { needLogin: true };
    }

    const apiKey = data.responseText.match(/"INNERTUBE_API_KEY":"(.*?)"/)?.[1];
    const context: string = (
      (
        data.responseText.match(/\(\{"INNERTUBE_CONTEXT":([\w\W]*?)\}\)/) ||
        data.responseText.match(/"INNERTUBE_CONTEXT":([\w\W]*?\}),"INNERTUBE/)
      )?.[1] || '{}'
    );
    const { client, request } = JSON.parse(context);

    if (!apiKey || !client || !request) {
      debug('获取YouTube信息失败：缺少必要参数');
      logStatus.error('Error: Parameter "apiKey" not found!');
      return {};
    }

    client.hl = 'en';

    if (type === 'channel') {
      const channelId = data.responseText.match(/"channelId":"(.+?)"/)?.[1];
      if (!channelId) {
        debug('获取YouTube频道ID失败');
        logStatus.error('Error: Get "channelId" failed!');
        return {};
      }
      debug('成功获取YouTube频道信息', { channelId });
      logStatus.success();
      return { params: { apiKey, client, request, channelId } };
    }

    if (type === 'likeVideo') {
      const videoId = data.responseText.match(/<link rel="shortlinkUrl" href="https:\/\/youtu\.be\/(.*?)">/)?.[1];
      const likeParams = data.responseText.match(/"likeParams":"(.*?)"/)?.[1];
      if (!videoId) {
        debug('获取YouTube视频ID失败');
        logStatus.error('Error: Get "videoId" failed!');
        return {};
      }
      debug('成功获取YouTube视频信息', { videoId });
      logStatus.success();
      return { params: { apiKey, client, request, videoId, likeParams } };
    }

    debug('未知的YouTube信息类型', { type });
    logStatus.error('Error: Unknown type');
    return {};
  } catch (error) {
    debug('获取YouTube信息时发生错误', { error });
    throwError(error as Error, 'Youtube.getInfo');
    return {};
  }
};

/**
 * @class Youtube
 * @extends Social
 * @description 处理YouTube相关的任务，包括订阅/取消订阅频道和点赞/取消点赞视频。
 *
 * @property {youtubeTasks} tasks - 存储当前的YouTube任务信息，包括频道和点赞数组。
 * @property {youtubeTasks} whiteList - 存储白名单任务信息。
 * @private
 * @property {auth} #auth - 存储YouTube的身份验证信息。
 * @private
 * @property {boolean} #initialized - 表示YouTube模块是否已初始化。
 * @private
 * @property {string} #verifyChannel - 用于验证频道的URL。
 *
 * @constructor
 * @description 创建一个Youtube实例，初始化任务模板和白名单。
 *
 * @async
 * @function init
 * @returns {Promise<boolean>} - 返回初始化结果，true表示成功，false表示失败。
 *
 * @async
 * @function #verifyAuth
 * @returns {Promise<boolean>} - 验证身份验证Token的有效性，true表示有效，false表示无效。
 *
 * @async
 * @function #updateAuth
 * @returns {Promise<boolean>} - 更新身份验证Token，true表示成功，false表示失败。
 *
 * @async
 * @function #getInfo
 * @param {string} link - 要获取信息的YouTube链接。
 * @param {string} type - 请求的信息类型，可能的值包括'video'和'channel'。
 * @returns {Promise<youtubeInfo>} - 返回获取操作的结果，成功返回信息，失败返回false。
 *
 * @async
 * @function #toggleChannel
 * @param {Object} options - 选项对象。
 * @param {string} options.link - 要处理的YouTube频道链接。
 * @param {boolean} [options.doTask=true] - 是否执行任务，true表示关注，false表示退订。
 * @param {boolean} [options.verify=false] - 是否用于验证Token。
 * @returns {Promise<boolean>} - 返回操作结果，true表示成功，false表示失败。
 *
 * @async
 * @function #toggleLikeVideo
 * @param {Object} options - 选项对象。
 * @param {string} options.link - 要点赞的YouTube视频链接。
 * @param {boolean} [options.doTask=true] - 是否执行任务，true表示点赞，false表示取消点赞。
 * @returns {Promise<boolean>} - 返回操作结果，true表示成功，false表示失败。
 *
 * @async
 * @function toggle
 * @param {Object} options - 选项对象。
 * @param {boolean} [options.doTask=true] - 是否执行任务，true表示执行，false表示取消。
 * @param {Array<string>} [options.channelLinks=[]] - YouTube频道链接数组。
 * @param {Array<string>} [options.videoLinks=[]] - YouTube视频链接数组。
 * @returns {Promise<boolean>} - 返回操作结果，true表示成功，false表示失败。
 */
class Youtube extends Social {
  tasks: youtubeTasks;
  whiteList: youtubeTasks;
  #auth: auth = GM_getValue<auth>('youtubeAuth') || {};
  #initialized = false;
  #verifyChannel = `https://www.youtube.com/channel/${globalOptions.other.youtubeVerifyChannel}`;

  /**
   * 创建一个Youtube实例。
   *
   * @constructor
   * @description
   * 此构造函数初始化Youtube类的实例，设置默认任务模板和白名单。
   * 默认任务模板包含空的频道和点赞数组，用于存储Youtube相关的任务信息。
   * 白名单将从GM_getValue中获取，如果没有找到，则使用默认任务模板。
   */
  constructor() {
    super();
    const defaultTasksTemplate: youtubeTasks = {
      channels: [], likes: []
    };
    debug('初始化YouTube实例');
    this.tasks = defaultTasksTemplate;
    this.whiteList = { ...defaultTasksTemplate, ...(GM_getValue<whiteList>('whiteList')?.youtube || {}) };
  }

  /**
   * 初始化Youtube模块，验证用户身份并获取授权。
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
      debug('开始初始化YouTube模块');
      if (this.#initialized) {
        debug('YouTube模块已初始化');
        return true;
      }
      if (!this.#auth.PAPISID) {
        debug('YouTube授权信息不完整，需要更新授权');
        if (await this.#updateAuth()) {
          this.#initialized = true;
          return true;
        }
        return false;
      }
      const isVerified: boolean = await this.#verifyAuth();
      if (isVerified) {
        debug('YouTube授权验证成功');
        echoLog({ before: '[Youtube]' }).success(__('initSuccess', 'Youtube'));
        this.#initialized = true;
        return true;
      }
      debug('YouTube授权失效，尝试重新获取');
      GM_setValue('youtubeAuth', null);
      if (await this.#updateAuth()) {
        debug('YouTube重新授权成功');
        echoLog({ before: '[Youtube]' }).success(__('initSuccess', 'Youtube'));
        this.#initialized = true;
        return true;
      }
      debug('YouTube初始化失败');
      echoLog({ before: '[Youtube]' }).error(__('initFailed', 'Youtube'));
      return false;
    } catch (error) {
      debug('YouTube初始化发生错误', { error });
      throwError(error as Error, 'Youtube.init');
      return false;
    }
  }
  /**
 * 验证Youtube的身份验证Token是否有效。
 *
 * @async
 * @function #verifyAuth
 * @returns {Promise<boolean>} - 返回一个Promise，表示Token验证的结果。
 *                              - true: Token有效
 *                              - false: Token失效
 *
 * @description
 * 该方法通过调用`#toggleChannel`方法来检测Token的有效性。
 * 如果调用成功且返回结果为true，则表示Token有效；如果发生错误，则记录错误信息并返回false。
 * 如果在执行过程中发生错误，将抛出错误并返回false。
 */
  async #verifyAuth(): Promise<boolean> {
    try {
      debug('开始验证YouTube授权');
      return await this.#toggleChannel({ link: this.#verifyChannel, doTask: true, verify: true });
    } catch (error) {
      debug('YouTube授权验证发生错误', { error });
      throwError(error as Error, 'Youtube.verifyAuth');
      return false;
    }
  }

  /**
   * 更新Youtube的身份验证Token。
   *
   * @async
   * @function #updateAuth
   * @returns {Promise<boolean>} - 返回一个Promise，表示更新操作的结果。
   *                              - true: 更新Token成功
   *                              - false: 更新Token失败
   *
   * @description
   * 该方法通过获取Youtube网站的cookie来更新Token。
   * 如果成功获取到`__Secure-3PAPISID`的值，则将其存储在`youtubeAuth`中，并更新内部的`#auth`属性。
   * 如果用户未登录，则记录错误信息并返回false。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async #updateAuth(): Promise<boolean> {
    try {
      debug('开始更新YouTube授权');
      const logStatus = echoLog({ text: __('updatingAuth', 'Youtube'), before: '[Youtube]' });
      return await new Promise((resolve) => {
        GM_cookie.list({ url: 'https://www.youtube.com/@YouTube' }, async (cookies, error) => {
          if (!error) {
            const PAPISID = cookies.find((cookie) => cookie.name === '__Secure-3PAPISID')?.value;

            if (PAPISID) {
              debug('成功获取YouTube新授权信息');
              GM_setValue('youtubeAuth', { PAPISID });
              this.#auth = { PAPISID };
              logStatus.success();
              resolve(await this.#verifyAuth());
            } else {
              debug('获取YouTube授权失败：未登录');
              logStatus.error(__('needLogin'));
              resolve(false);
            }
          } else {
            debug('获取YouTube授权失败', { error });
            logStatus.error('Error: Update youtube auth failed!');
            resolve(false);
          }
        });
      });
    } catch (error) {
      debug('更新YouTube授权时发生错误', { error });
      throwError(error as Error, 'Youtube.updateAuth');
      return false;
    }
  }

  /**
   * 获取指定YouTube链接的信息。
   *
   * @async
   * @function #getInfo
   * @param {string} link - 要获取信息的YouTube链接。
   * @param {string} type - 请求的信息类型，可能的值包括'video'和'channel'。
   * @returns {Promise<youtubeInfo>} - 返回一个Promise，表示获取操作的结果。
   *                                   - {youtubeInfo}: 获取成功，返回请求参数
   *                                   - false: 获取失败
   *
   * @description
   * 该方法调用外部的`getInfo`函数来获取指定YouTube链接的信息。
   * 如果获取成功，则返回相应的信息；如果获取失败，则返回false。
   * 在获取过程中，如果发生错误，将抛出错误并返回false。
   */
  #getInfo(link: string, type: string): Promise<youtubeInfo> {
    debug('调用获取YouTube信息方法', { link, type });
    return getInfo(link, type);
  }

  /**
   * 切换YouTube频道的订阅状态，关注或退订指定的频道。
   *
   * @async
   * @function #toggleChannel
   * @param {Object} options - 选项对象。
   * @param {string} options.link - 要处理的YouTube频道链接。
   * @param {boolean} [options.doTask=true] - 指示是否执行任务，true表示关注频道，false表示退订频道。
   * @param {boolean} [options.verify=false] - 指示是否用于验证Token，true表示验证，false表示处理频道任务。
   * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
   *                              - true: 操作成功
   *                              - false: 操作失败
   *
   * @description
   * 该方法根据传入的参数处理YouTube频道的关注或退订任务。
   * 如果需要登录，则显示登录提示并返回false。
   * 如果获取频道信息失败，则记录错误信息并返回false。
   * 根据`doTask`的值构建相应的请求数据，并发送POST请求到YouTube API。
   * 如果请求成功且返回结果为'Success'，并且状态码为200，则记录成功日志并更新任务列表。
   * 如果请求失败或返回的状态不符合预期，则记录错误信息并返回false。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async #toggleChannel({ link, doTask = true, verify = false }: { link: string, doTask: boolean, verify?: boolean }): Promise<boolean> {
    try {
      debug('开始处理YouTube频道任务', { link, doTask, verify });
      const { params, needLogin } = await this.#getInfo(link, 'channel');
      const { apiKey, client, request, channelId } = params || {};

      if (needLogin) {
        debug('YouTube频道操作失败：需要登录');
        echoLog({ html: __('loginYtb'), before: '[Youtube]' });
        return false;
      }

      if (!(apiKey && client && request && channelId)) {
        debug('YouTube频道操作失败：获取参数失败');
        echoLog({ text: '"getYtbToken" failed', before: '[Youtube]' });
        return false;
      }

      if (!doTask && !verify && this.whiteList.channels.includes(channelId)) {
        debug('YouTube频道在白名单中，跳过取消订阅', { channelId });
        echoLog({ type: 'whiteList', text: 'Youtube.unfollowChannel', id: channelId, before: '[Youtube]' });
        return true;
      }

      const logStatus = verify ?
        echoLog({ text: __('verifyingAuth', 'Youtube'), before: '[Youtube]' }) :
        echoLog({ type: doTask ? 'followingYtbChannel' : 'unfollowingYtbChannel', text: channelId, before: '[Youtube]' });

      const nowTime = parseInt(String(new Date().getTime() / 1000), 10);
      const { result, statusText, status, data } = await httpRequest({
        url: `https://www.youtube.com/youtubei/v1/subscription/${doTask ? '' : 'un'}subscribe?key=${apiKey}&prettyPrint=false`,
        method: 'POST',
        headers: {
          origin: 'https://www.youtube.com',
          referer: `https://www.youtube.com/channel/${channelId}`,
          'content-type': 'application/json',
          'x-goog-authuser': '0',
          'x-goog-visitor-id': client?.visitorData,
          'x-origin': 'https://www.youtube.com',
          authorization: `SAPISIDHASH ${nowTime}_${sha1(`${nowTime} ${this.#auth.PAPISID} https://www.youtube.com`)}`
        },
        data: JSON.stringify({
          context: {
            client,
            request: {
              sessionId: request?.sessionId,
              internalExperimentFlags: [],
              consistencyTokenJars: []
            },
            user: {}
          },
          channelIds: [channelId],
          params: doTask ? 'EgIIAhgA' : 'CgIIAhgA'
        })
      });

      if (result !== 'Success') {
        debug('YouTube频道操作请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status !== 200) {
        debug('YouTube频道操作状态错误', { status: data?.status, statusText: data?.statusText });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      const isSubscribed = doTask && (/"subscribed":true/.test(data.responseText) || data.responseText.includes('The subscription already exists'));
      const isUnsubscribed = !doTask && /"subscribed":false/.test(data.responseText);
      const isVerified = verify && data.responseText.includes('You may not subscribe to yourself');

      if (isSubscribed || isUnsubscribed || isVerified) {
        debug('YouTube频道操作成功', { doTask, verify });
        logStatus.success();
        if (doTask && !verify) {
          this.tasks.channels = unique([...this.tasks.channels, link]);
        }
        return true;
      }

      debug('YouTube频道操作失败，需要更新授权');
      logStatus.error(__('tryUpdateYtbAuth'), true);
      return false;
    } catch (error) {
      debug('处理YouTube频道任务时发生错误', { error });
      throwError(error as Error, 'Youtube.toggleChannel');
      return false;
    }
  }

  /**
   * 处理YouTube视频的点赞任务。
   *
   * @async
   * @function #toggleLikeVideo
   * @param {Object} options - 选项对象。
   * @param {string} options.link - 要点赞的YouTube视频链接。
   * @param {boolean} [options.doTask=true] - 指示是否执行任务，true表示点赞，false表示取消点赞。
   * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
   *                              - true: 操作成功
   *                              - false: 操作失败
   *
   * @description
   * 该方法根据传入的参数处理YouTube视频的点赞或取消点赞任务。
   * 首先调用`#getInfo`方法获取视频信息，如果需要登录，则提示用户登录并返回false。
   * 如果获取信息失败或参数不完整，则记录错误信息并返回false。
   * 根据`doTask`的值构建相应的请求数据，并发送POST请求到YouTube API。
   * 如果请求成功且返回结果为'Success'，并且状态码为200，则记录成功日志并更新任务列表。
   * 如果请求失败或返回的状态不符合预期，则记录错误信息并返回false。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async #toggleLikeVideo({ link, doTask = true }: { link: string, doTask: boolean }): Promise<boolean> {
    try {
      debug('开始处理YouTube视频点赞任务', { link, doTask });
      const { params, needLogin } = await this.#getInfo(link, 'likeVideo');
      const { apiKey, client, request, videoId, likeParams } = params || {};

      if (needLogin) {
        debug('YouTube视频点赞失败：需要登录');
        echoLog({ html: `${__('loginYtb')}`, before: '[Youtube]' });
        return false;
      }

      if (!(apiKey && client && request && videoId && likeParams)) {
        debug('YouTube视频点赞失败：获取参数失败');
        echoLog({ text: '"getYtbToken" failed', before: '[Youtube]' });
        return false;
      }

      if (!doTask && this.whiteList.likes.includes(videoId)) {
        debug('YouTube视频在白名单中，跳过取消点赞', { videoId });
        echoLog({ type: 'whiteList', text: 'Youtube.unlikeVideo', id: videoId, before: '[Youtube]' });
        return true;
      }

      const logStatus = echoLog({ type: doTask ? 'likingYtbVideo' : 'unlikingYtbVideo', text: videoId, before: '[Youtube]' });
      const nowTime = parseInt(String(new Date().getTime() / 1000), 10);
      const likeVideoData: likeVideoData = {
        context: {
          client,
          request: {
            sessionId: request.sessionId,
            internalExperimentFlags: [],
            consistencyTokenJars: []
          },
          user: {}
        },
        target: {
          videoId
        }
      };

      if (doTask && !likeParams) {
        debug('YouTube视频点赞失败：缺少likeParams参数');
        logStatus.error('Empty likeParams');
        return false;
      }

      if (doTask) {
        likeVideoData.params = likeParams;
      }

      const { result, statusText, status, data } = await httpRequest({
        url: `https://www.youtube.com/youtubei/v1/like/${doTask ? '' : 'remove'}like?key=${apiKey}`,
        method: 'POST',
        headers: {
          origin: 'https://www.youtube.com',
          referer: `https://www.youtube.com/watch?v=${videoId}`,
          'content-type': 'application/json',
          'x-goog-authuser': '0',
          'x-goog-visitor-id': client.visitorData,
          'x-origin': 'https://www.youtube.com',
          authorization: `SAPISIDHASH ${nowTime}_${sha1(`${nowTime} ${this.#auth.PAPISID} https://www.youtube.com`)}`
        },
        data: JSON.stringify(likeVideoData)
      });

      if (result !== 'Success') {
        debug('YouTube视频点赞请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status !== 200) {
        debug('YouTube视频点赞状态错误', { status: data?.status, statusText: data?.statusText });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      const isLiked = doTask && data.responseText.includes('Added to Liked videos');
      const isUnliked = !doTask && (data.responseText.includes('Removed from Liked videos') || data.responseText.includes('Dislike removed'));

      if (isLiked || isUnliked) {
        debug('YouTube视频点赞操作成功', { doTask });
        logStatus.success();
        if (doTask) {
          this.tasks.likes = unique([...this.tasks.likes, link]);
        }
        return true;
      }

      debug('YouTube视频点赞失败，需要更新授权');
      logStatus.error(__('tryUpdateYtbAuth'), true);
      return false;
    } catch (error) {
      debug('处理YouTube视频点赞任务时发生错误', { error });
      throwError(error as Error, 'Youtube.toggleLikeVideo');
      return false;
    }
  }

  /**
   * 统一处理YouTube相关任务，关注或取消关注指定的频道和视频。
   *
   * @async
   * @function toggle
   * @param {Object} options - 选项对象。
   * @param {boolean} [options.doTask=true] - 指示是否执行任务，true表示执行，false表示取消。
   * @param {Array<string>} [options.channelLinks=[]] - YouTube频道链接数组。
   * @param {Array<string>} [options.videoLinks=[]] - YouTube视频链接数组。
   * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
   *                              - true: 操作成功
   *                              - false: 操作失败
   *
   * @description
   * 该方法根据传入的参数处理YouTube相关任务。
   * 首先检查模块是否已初始化，如果未初始化，则返回false。
   * 根据`doTask`和全局选项判断是否执行频道关注或取消关注的任务。
   * 如果执行任务，则获取实际的频道参数，并逐个处理关注或取消关注操作。
   * 同样处理视频的点赞或取消点赞操作。
   * 最后返回所有操作的结果，如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async toggle({
    doTask = true,
    channelLinks = [],
    videoLinks = []
  }: {
    doTask: boolean,
    channelLinks?: Array<string>,
    videoLinks?: Array<string>
  }): Promise<boolean> {
    try {
      debug('开始处理YouTube链接任务', { doTask, channelLinksCount: channelLinks.length, videoLinksCount: videoLinks.length });
      if (!this.#initialized) {
        debug('YouTube模块未初始化');
        echoLog({ text: __('needInit'), before: '[Youtube]' });
        return false;
      }

      const prom = [];
      const shouldProcessChannels = (doTask && globalOptions.doTask.youtube.channels) ||
                                  (!doTask && globalOptions.undoTask.youtube.channels);
      const shouldProcessVideos = (doTask && globalOptions.doTask.youtube.likes) ||
                                (!doTask && globalOptions.undoTask.youtube.likes);

      if (!shouldProcessChannels) {
        debug('根据全局选项跳过YouTube频道任务', { doTask });
        echoLog({ type: 'globalOptionsSkip', text: 'youtube.channels', before: '[Youtube]' });
      } else {
        const realChannels = this.getRealParams('channels', channelLinks, doTask, (link) => {
          if (/^https:\/\/(www\.)?google\.com.*?\/url\?.*?url=https:\/\/www\.youtube\.com\/.*/.test(link)) {
            return link.match(/url=(https:\/\/www\.youtube\.com\/.*)/)?.[1];
          }
          return link;
        });
        debug('处理后的YouTube频道链接列表', { count: realChannels.length, channels: realChannels });

        if (realChannels.length > 0) {
          for (const channel of realChannels) {
            prom.push(this.#toggleChannel({ link: channel, doTask }));
            await delay(1000);
          }
        }
      }

      if (!shouldProcessVideos) {
        debug('根据全局选项跳过YouTube视频任务', { doTask });
        echoLog({ type: 'globalOptionsSkip', text: 'youtube.likes', before: '[Youtube]' });
      } else {
        const realLikes = this.getRealParams('likes', videoLinks, doTask, (link) => {
          if (/^https:\/\/(www\.)?google\.com.*?\/url\?.*?url=https:\/\/www\.youtube\.com\/.*/.test(link)) {
            return link.match(/url=(https:\/\/www\.youtube\.com\/.*)/)?.[1];
          }
          return link;
        });
        debug('处理后的YouTube视频链接列表', { count: realLikes.length, videos: realLikes });

        if (realLikes.length > 0) {
          for (const video of realLikes) {
            prom.push(this.#toggleLikeVideo({ link: video, doTask }));
            await delay(1000);
          }
        }
      }

      return Promise.all(prom).then(() => true);
    } catch (error) {
      debug('处理YouTube链接任务时发生错误', { error });
      throwError(error as Error, 'Youtube.toggle');
      return false;
    }
  }
}
export { Youtube, getInfo };
