/*
 * @Author       : HCLonely
 * @Date         : 2021-10-04 10:36:57
 * @LastEditTime : 2025-08-18 19:08:41
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/social/Twitter.ts
 * @Description  : Twitter 关注/取关用户,转推/取消转推推文
 */

import Social from './Social';
import echoLog from '../echoLog';
import throwError from '../tools/throwError';
import httpRequest from '../tools/httpRequest';
import { unique, delay } from '../tools/tools';
import __ from '../tools/i18n';
import { globalOptions } from '../globalOptions';
import getTID from './XTID/getTID.js';
import { getFwdForSdk } from './XFwdForSdk/main';
import { debug } from '../tools/debug';
/**
 * Twitter类用于处理与Twitter相关的任务，包括关注/取关用户和转推/取消转推推文。
 *
 * @class Twitter
 * @extends Social
 *
 * @property {twitterTasks} tasks - 存储当前的Twitter任务，包括用户、转推和点赞。
 * @property {twitterTasks} whiteList - 存储白名单用户和推文。
 * @private
 * @property {string} #verifyId - Twitter验证ID。
 * @private
 * @property {auth} #auth - 存储Twitter的身份验证信息。
 * @private
 * @property {cache} #cache - 存储用户ID的缓存。
 * @private
 * @property {boolean} #initialized - 模块是否已初始化的标志。
 * @private
 * @property {Object} #session - Twitter API会话对象。
 * @private
 * @property {Function} #session.get - 获取Twitter API请求的事务ID。
 *
 * @method constructor - 创建一个Twitter实例，初始化任务模板和白名单。
 * @method init - 初始化Twitter模块，验证用户身份并获取授权。
 * @method #verifyAuth - 验证Twitter的身份验证Token是否有效。
 * @method #updateAuth - 更新Twitter的身份验证Token。
 * @method #toggleUser - 处理Twitter用户任务，关注或取关指定的用户。
 * @method userName2id - 通过用户名获取Twitter用户的ID。
 * @method #toggleRetweet - 处理转推任务，关注或撤销转推指定的推文。
 * @method toggle - 统一处理Twitter相关任务，关注或取消关注指定的用户和推文。
 * @method #setCache - 设置缓存，将指定的用户名与用户ID进行关联。
 */

const generateSecCHUA = () => {
  // 检查浏览器是否支持 navigator.userAgentData
  if (navigator.userAgentData && navigator.userAgentData.brands) {
    // 映射 brands 数组为 Sec-CH-UA 格式
    return navigator.userAgentData.brands
      .map((brand) => `"${brand.brand}";v="${brand.version}"`)
      .join(', ');
  }

  // 不支持的浏览器返回模拟值（基于Chrome 125的典型格式）
  return '"Google Chrome";v="125", "Chromium";v="125", "Not-A.Brand";v="99"';
};

class Twitter extends Social {
  tasks: twitterTasks;
  whiteList: twitterTasks;
  #verifyId = globalOptions.other.twitterVerifyId;
  #auth: auth = GM_getValue<auth>('twitterAuth') || {};
  #cache: cache = GM_getValue<cache>('twitterCache') || {};
  #initialized = false;
  #getTID!: (method: string, path: string) => Promise<string>;
  #FwdForSdk!: {
    str: string,
    expiryTimeMillis: number
  };
  #headers: Record<string, string> = {};

  /**
   * 创建一个Twitter实例。
   *
   * @constructor
   * @description
   * 此构造函数初始化Twitter类的实例，设置默认任务模板和白名单。
   * 默认任务模板包含空的用户、转发和点赞数组，用于存储Twitter相关的任务信息。
   * 白名单将从GM_getValue中获取，如果没有找到，则使用默认任务模板。
   */
  constructor() {
    super();
    const defaultTasksTemplate: twitterTasks = {
      users: [], retweets: [], likes: []
    };
    debug('初始化Twitter实例');
    this.tasks = defaultTasksTemplate;
    this.whiteList = { ...defaultTasksTemplate, ...(GM_getValue<whiteList>('whiteList')?.twitter || {}) };
    this.#headers = {
      authorization: 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
      'X-Twitter-Auth-Type': 'OAuth2Session',
      'X-Twitter-Active-User': 'yes',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'sec-ch-ua-platform': '"Windows"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua': generateSecCHUA()
    };
  }

  /**
   * 初始化Twitter模块，验证用户身份并获取授权。
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
      debug('开始初始化Twitter模块');
      if (this.#initialized) {
        debug('Twitter模块已初始化');
        return true;
      }

      debug('获取Twitter授权信息');
      if (!await this.#updateAuth()) {
        return false;
      }

      debug('创建Twitter会话和SDK');
      // this.#session = await createSession();
      this.#getTID = await getTID();
      this.#FwdForSdk = await getFwdForSdk();
      const isVerified = await this.#verifyAuth();

      if (isVerified) {
        debug('Twitter授权验证成功');
        echoLog({ before: '[Twitter]' }).success(__('initSuccess', 'Twitter'));
        this.#initialized = true;
        return true;
      }

      debug('Twitter授权失效，尝试重新获取');
      GM_setValue('twitterAuth', null);
      if (await this.#updateAuth()) {
        debug('Twitter重新授权成功');
        echoLog({ before: '[Twitter]' }).success(__('initSuccess', 'Twitter'));
        this.#initialized = true;
        return true;
      }

      debug('Twitter初始化失败');
      echoLog({ before: '[Twitter]' }).error(__('initFailed', 'Twitter'));
      return false;
    } catch (error) {
      debug('Twitter初始化发生错误', { error });
      throwError(error as Error, 'Twitter.init');
      return false;
    }
  }

  /**
   * 验证Twitter的身份验证Token是否有效。
   *
   * @async
   * @private
   * @function #verifyAuth
   * @returns {Promise<boolean>} - 返回一个Promise，表示Token验证的结果。
   *                              - true: Token有效
   *                              - false: Token失效
   *
   * @description
   * 该方法通过调用`#toggleUser`方法来检测Token的有效性。
   * 如果调用成功且返回结果为true，则表示Token有效；如果发生错误，则记录错误信息并返回false。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async #verifyAuth(): Promise<boolean> {
    try {
      debug('开始验证Twitter授权');
      return await this.#toggleUser({ name: 'verify', doTask: true, verify: true });
    } catch (error) {
      debug('Twitter授权验证发生错误', { error });
      throwError(error as Error, 'Twitter.verifyAuth');
      return false;
    }
  }

  /**
   * 更新Twitter的身份验证Token。
   *
   * @async
   * @private
   * @function #updateAuth
   * @returns {Promise<boolean>} - 返回一个Promise，表示更新操作的结果。
   *                              - true: 更新Token成功
   *                              - false: 更新Token失败
   *
   * @description
   * 该方法通过打开Twitter网站的设置页面来更新Token。
   * 使用`GM_cookie.list`方法获取当前的cookie信息，如果成功获取到`ct0`和`twid`的值，则更新存储的身份验证信息。
   * 如果用户未登录，则记录错误信息并返回false。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async #updateAuth(): Promise<boolean> {
    try {
      debug('开始更新Twitter授权');
      const logStatus = echoLog({ text: __('updatingAuth', 'Twitter'), before: '[Twitter]' });
      return await new Promise((resolve) => {
        GM_cookie.list({ url: 'https://x.com/settings/account' }, async (cookies, error) => {
          if (!error) {
            const ct0 = cookies.find((cookie) => cookie.name === 'ct0')?.value;
            const isLogin = cookies.find((cookie) => cookie.name === 'twid')?.value;
            if (isLogin && ct0) {
              debug('成功获取Twitter授权信息');
              GM_setValue('twitterAuth', { ct0 });
              this.#auth = { ct0 };
              this.#headers['x-csrf-token'] = ct0;
              this.#headers['x-twitter-client-language'] = cookies.find((cookie) => cookie.name === 'lang')?.value || 'en';
              logStatus.success();
              resolve(true);
            } else {
              debug('获取Twitter授权失败：未登录');
              logStatus.error(__('needLogin'));
              resolve(false);
            }
          } else {
            debug('获取Twitter授权失败', { error });
            logStatus.error('Error: Update twitter auth failed!');
            resolve(false);
          }
        });
      });
    } catch (error) {
      debug('更新Twitter授权时发生错误', { error });
      throwError(error as Error, 'Twitter.updateToken');
      return false;
    }
  }

  /**
   * 处理Twitter用户任务，关注或取关指定的用户。
   *
   * @async
   * @private
   * @function #toggleUser
   * @param {Object} options - 选项对象。
   * @param {string} options.name - Twitter用户名。
   * @param {boolean} [options.doTask=true] - 指示是否执行任务，true表示关注，false表示取关。
   * @param {boolean} [options.verify=false] - 指示是否用于验证Token，true表示验证，false表示处理用户任务。
   * @param {boolean} [options.retry=false] - 指示是否为重试操作，用于防止无限重试。
   * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
   *                              - true: 操作成功
   *                              - false: 操作失败
   *
   * @description
   * 该方法根据传入的参数处理Twitter用户的关注或取关任务。
   * 如果`doTask`为false且用户在白名单中，则直接返回true。
   * 通过调用`#verifyId`或`userName2id`方法获取用户ID，如果获取失败则返回false。
   * 根据`doTask`的值构建相应的请求数据，并发送POST请求到Twitter API。
   * 如果请求成功且返回结果为'Success'，并且状态码为200，则记录成功日志并更新任务列表。
   * 如果请求失败或返回的状态不符合预期，则记录错误信息并返回false。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async #toggleUser({ name, doTask = true, verify = false, retry = false }: { name: string, doTask: boolean, verify?: boolean, retry?: boolean }): Promise<boolean> {
    try {
      debug('开始处理Twitter用户任务', { name, doTask, verify, retry });
      if (!doTask && !verify && this.whiteList.users.includes(name)) {
        debug('Twitter用户在白名单中，跳过取消关注', { name });
        echoLog({ type: 'whiteList', text: 'Twitter.unfollowUser', id: name, before: '[Twitter]' });
        return true;
      }

      const userId: string | boolean = verify ? this.#verifyId : (await this.userName2id(name));
      if (!userId) return false;

      const logStatus = verify ?
        echoLog({ text: __('verifyingAuth', 'Twitter'), before: '[Twitter]' }) :
        echoLog({ type: `${doTask ? '' : 'un'}followingTwitterUser`, text: name, before: '[Twitter]' });

      const { result, statusText, status, data } = await httpRequest({
        url: `https://x.com/i/api/1.1/friendships/${doTask ? 'create' : 'destroy'}.json`,
        method: 'POST',
        headers: {
          ...this.#headers,
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-client-transaction-id': await this.#getTID('POST', `/i/api/1.1/friendships/${doTask ? 'create' : 'destroy'}.json`),
          'x-xp-forwarded-for': this.#FwdForSdk.str
        },
        responseType: 'json',
        data: $.param({
          include_profile_interstitial_type: 1,
          include_blocking: 1,
          include_blocked_by: 1,
          include_followed_by: 1,
          include_want_retweets: 1,
          include_mute_edge: 1,
          include_can_dm: 1,
          include_can_media_tag: 1,
          skip_status: 1,
          id: userId
        })
      });

      if (result !== 'Success') {
        debug('Twitter用户操作请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status === 200) {
        debug('Twitter用户操作成功', { name, doTask });
        logStatus.success();
        if (doTask && !verify) {
          this.tasks.users = unique([...this.tasks.users, name]);
        }
        return true;
      }

      if (verify && data?.status === 403) {
        if (data.response?.errors?.[0]?.code === 158) {
          debug('Twitter授权验证成功（已关注）');
          logStatus.success();
          return true;
        }

        if (data.response?.errors?.[0]?.code === 353 && !retry && data.responseHeaders?.['set-cookie']) {
          const newCt0 = data.responseHeaders['set-cookie']?.find((cookie: string) => cookie.includes('ct0='))?.split(';')
            ?.at(0)
            ?.split('=')
            ?.at(-1);
          if (newCt0) {
            debug('获取到新的Twitter授权Token，重试操作');
            this.#auth.ct0 = newCt0;
            GM_setValue('twitterAuth', this.#auth);
            logStatus.warning(__('retry'));
            return this.#toggleUser({ name, doTask, verify, retry: true });
          }
        }
      }

      debug('Twitter用户操作失败', { status: data?.status, statusText: data?.statusText });
      logStatus.error(`Error:${data?.statusText}(${data?.status})`);
      return false;
    } catch (error) {
      debug('处理Twitter用户任务时发生错误', { error });
      throwError(error as Error, 'Twitter.toggleUser');
      return false;
    }
  }

  /**
   * 通过用户名获取Twitter用户的ID。
   *
   * @async
   * @function userName2id
   * @param {string} name - Twitter用户名。
   * @returns {Promise<string | false>} - 返回一个Promise，表示获取操作的结果。
   *                                      - string: 获取成功，返回用户ID
   *                                      - false: 获取失败
   *
   * @description
   * 该方法首先检查缓存中是否存在对应的用户ID。如果存在，则直接返回该ID。
   * 如果不存在，则发送GET请求到Twitter的GraphQL API以获取用户信息。
   * 如果请求成功且返回结果为'Success'，并且状态码为200，则提取用户ID并缓存。
   * 如果获取失败或返回的状态不符合预期，则记录错误信息并返回false。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async userName2id(name: string): Promise<string | false> {
    try {
      debug('开始获取Twitter用户ID', { name });
      const logStatus = echoLog({ type: 'gettingTwitterUserId', text: name, before: '[Twitter]' });
      const cachedUserId = this.#cache[name];
      if (cachedUserId) {
        debug('从缓存获取到Twitter用户ID', { name, id: cachedUserId });
        logStatus.success();
        return cachedUserId;
      }

      const { result, statusText, status, data } = await httpRequest({
        url: (
          'https://x.com/i/api/graphql/jUKA--0QkqGIFhmfRZdWrQ/UserByScreenName' +
          `?variables=%7B%22screen_name%22%3A%22${name}%22%7D&features=%7B%22responsive_web_grok_bio_auto_translation_is_enabled%22%3Afalse%2C%22hidden_profile_subscriptions_enabled%22%3Atrue%2C%22payments_enabled%22%3Afalse%2C%22profile_label_improvements_pcf_label_in_post_enabled%22%3Atrue%2C%22rweb_tipjar_consumption_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22subscriptions_verification_info_is_identity_verified_enabled%22%3Atrue%2C%22subscriptions_verification_info_verified_since_enabled%22%3Atrue%2C%22highlights_tweets_tab_ui_enabled%22%3Atrue%2C%22responsive_web_twitter_article_notes_tab_enabled%22%3Atrue%2C%22subscriptions_feature_can_gift_premium%22%3Atrue%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%7D&fieldToggles=%7B%22withAuxiliaryUserLabels%22%3Atrue%7D`
        ),
        method: 'GET',
        headers: {
          ...this.#headers,
          'content-type': 'application/json',
          referer: `https://x.com/${name}`,
          'x-client-transaction-id': await this.#getTID('GET', '/i/api/graphql/jUKA--0QkqGIFhmfRZdWrQ/UserByScreenName' +
            `?variables=%7B%22screen_name%22%3A%22${name}%22%7D&features=%7B%22responsive_web_grok_bio_auto_translation_is_enabled%22%3Afalse%2C%22hidden_profile_subscriptions_enabled%22%3Atrue%2C%22payments_enabled%22%3Afalse%2C%22profile_label_improvements_pcf_label_in_post_enabled%22%3Atrue%2C%22rweb_tipjar_consumption_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22subscriptions_verification_info_is_identity_verified_enabled%22%3Atrue%2C%22subscriptions_verification_info_verified_since_enabled%22%3Atrue%2C%22highlights_tweets_tab_ui_enabled%22%3Atrue%2C%22responsive_web_twitter_article_notes_tab_enabled%22%3Atrue%2C%22subscriptions_feature_can_gift_premium%22%3Atrue%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%7D&fieldToggles=%7B%22withAuxiliaryUserLabels%22%3Atrue%7D`),
          'x-xp-forwarded-for': this.#FwdForSdk.str
        },
        responseType: 'json'
      });

      if (result !== 'Success') {
        debug('获取Twitter用户ID请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status !== 200) {
        debug('获取Twitter用户ID状态错误', { status: data?.status, statusText: data?.statusText });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      let response = data.response || (typeof data.responseText === 'object' ? data.responseText : null);
      if (!response) {
        try {
          response = JSON.parse(data.responseText);
        } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
          response = null;
        }
      }

      const fetchedUserId = response?.data?.user?.result?.rest_id;
      if (!fetchedUserId) {
        debug('未找到Twitter用户ID', { name });
        logStatus.error(`Error:${data.statusText}(${data.status})`);
        return false;
      }

      debug('成功获取Twitter用户ID', { name, id: fetchedUserId });
      this.#setCache(name, fetchedUserId);
      logStatus.success();
      return fetchedUserId;
    } catch (error) {
      debug('获取Twitter用户ID时发生错误', { error });
      throwError(error as Error, 'Twitter.getUserId');
      return false;
    }
  }

  /**
   * 处理转推任务，关注或撤销转推指定的推文。
   *
   * @async
   * @private
   * @function #toggleRetweet
   * @param {Object} options - 选项对象。
   * @param {string} options.retweetId - 推文的ID。
   * @param {boolean} [options.doTask=true] - 指示是否执行转推任务，true表示转推，false表示撤销转推。
   * @param {boolean} [options.retry=false] - 指示是否为重试操作，用于防止无限重试。
   * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
   *                              - true: 操作成功
   *                              - false: 操作失败
   *
   * @description
   * 该方法根据传入的参数处理转推任务。
   * 如果`doTask`为false且推文在白名单中，则直接返回true。
   * 发送POST请求到Twitter API以执行转推或撤销转推操作。
   * 如果请求成功且返回结果为'Success'，并且状态码为200或403（表示已撤销转推），则记录成功日志并更新任务列表。
   * 如果请求失败或返回的状态不符合预期，则记录错误信息并返回false。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async #toggleRetweet({ retweetId, doTask = true, retry = false }: { retweetId: string, doTask: boolean, retry?: boolean }): Promise<boolean> {
    try {
      debug('开始处理Twitter转推任务', { retweetId, doTask, retry });
      if (!doTask && this.whiteList.retweets.includes(retweetId)) {
        debug('Twitter转推在白名单中，跳过取消', { retweetId });
        echoLog({ type: 'whiteList', text: 'Twitter.unretweet', id: retweetId, before: '[Twitter]' });
        return true;
      }

      const logStatus = echoLog({ type: `${doTask ? '' : 'un'}retweetting`, text: retweetId, before: '[Twitter]' });
      const { result, statusText, status, data } = await httpRequest({
        url: `https://x.com/i/api/graphql/${doTask ? 'ojPdsZsimiJrUGLR1sjUtA/CreateRetweet' : 'iQtK4dl5hBmXewYZuEOKVw/DeleteRetweet'}`,
        method: 'POST',
        headers: {
          ...this.#headers,
          'Content-Type': 'application/json',
          origin: 'https://x.com',
          referer: 'https://x.com/home',
          'x-client-transaction-id': await this.#getTID('POST', `/i/api/graphql/${doTask ? 'ojPdsZsimiJrUGLR1sjUtA/CreateRetweet' : 'iQtK4dl5hBmXewYZuEOKVw/DeleteRetweet'}`),
          'x-xp-forwarded-for': this.#FwdForSdk.str
        },
        data: `{"variables":{"${doTask ? '' : 'source_'}tweet_id":"${retweetId}","dark_request":false},"queryId":"${doTask ? 'ojPdsZsimiJrUGLR1sjUtA' : 'iQtK4dl5hBmXewYZuEOKVw'}"}`,
        responseType: 'json'
      });

      if (result !== 'Success') {
        debug('Twitter转推操作请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status === 403 && data.response?.errors?.[0]?.code === 353 && !retry && data.responseHeaders?.['set-cookie']) {
        const newCt0 = data.responseHeaders['set-cookie']?.find((cookie: string) => cookie.includes('ct0='))?.split(';')
          ?.at(0)
          ?.split('=')
          ?.at(-1);
        if (newCt0) {
          debug('获取到新的Twitter授权Token，重试操作');
          this.#auth.ct0 = newCt0;
          GM_setValue('twitterAuth', this.#auth);
          logStatus.warning(__('retry'));
          return this.#toggleRetweet({ retweetId, doTask, retry: true });
        }
      }

      if (data?.status !== 200 && !(data?.status === 403 && data.response?.errors?.[0]?.code === 327)) {
        debug('Twitter转推操作状态错误', { status: data?.status, statusText: data?.statusText });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      if (data.response?.errors && data.response?.errors?.[0]?.code !== 327) {
        debug('Twitter转推操作出错', { error: data.response?.errors?.[0]?.message });
        logStatus.error(`Error:${data.response?.errors?.[0]?.message}`);
        return false;
      }

      debug('Twitter转推操作成功', { retweetId, doTask });
      logStatus.success();
      if (doTask) this.tasks.retweets = unique([...this.tasks.retweets, retweetId]);
      return true;
    } catch (error) {
      debug('处理Twitter转推任务时发生错误', { error });
      throwError(error as Error, 'Twitter.toggleRetweet');
      return false;
    }
  }

  /**
   * 统一处理Twitter相关任务，关注或取消关注指定的用户和推文。
   *
   * @async
   * @function toggle
   * @param {Object} options - 选项对象。
   * @param {boolean} [options.doTask=true] - 指示是否执行任务，true表示执行，false表示取消。
   * @param {Array<string>} [options.userLinks=[]] - Twitter用户链接数组。
   * @param {Array<string>} [options.retweetLinks=[]] - 推文链接数组。
   * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
   *                              - true: 操作成功
   *                              - false: 操作失败
   *
   * @description
   * 该方法根据传入的参数处理Twitter相关任务。
   * 首先检查模块是否已初始化，如果未初始化，则返回false。
   * 根据`doTask`和全局选项判断是否执行用户关注或取消关注的任务。
   * 如果执行任务，则获取实际的用户参数，并逐个处理关注或取消关注操作。
   * 同样处理推文的转推或取消转推操作。
   * 最后返回所有操作的结果，如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async toggle({
    doTask = true,
    userLinks = [],
    retweetLinks = []
  }: {
    doTask: boolean,
    userLinks?: Array<string>,
    retweetLinks?: Array<string>
  }): Promise<boolean> {
    try {
      debug('开始处理Twitter链接任务', { doTask, userLinksCount: userLinks.length, retweetLinksCount: retweetLinks.length });
      if (!this.#initialized) {
        debug('Twitter模块未初始化');
        echoLog({ text: __('needInit'), before: '[Twitter]' });
        return false;
      }

      // Handle user tasks
      if (
        (doTask && !globalOptions.doTask.twitter.users) ||
        (!doTask && !globalOptions.undoTask.twitter.users)
      ) {
        debug('根据全局选项跳过Twitter用户任务', { doTask });
        echoLog({ type: 'globalOptionsSkip', text: 'twitter.users', before: '[Twitter]' });
      } else {
        const realUsers = this.getRealParams('users', userLinks, doTask, (link) => link.match(/https:\/\/x\.com\/([^/]+)/)?.[1] || link.match(/https:\/\/twitter\.com\/([^/]+)/)?.[1]);
        debug('处理后的Twitter用户列表', { count: realUsers.length, users: realUsers });
        if (realUsers.length > 0) {
          for (const user of realUsers) {
            if (Date.now() > this.#FwdForSdk.expiryTimeMillis) {
              debug('Twitter SDK过期，重新获取', { expiryTimeMillis: this.#FwdForSdk.expiryTimeMillis });
              this.#FwdForSdk = await getFwdForSdk();
            }
            await this.#toggleUser({ name: user, doTask });
            await delay(1000);
          }
        }
      }

      // Handle retweet tasks
      if (
        (doTask && !globalOptions.doTask.twitter.retweets) ||
        (!doTask && !globalOptions.undoTask.twitter.retweets)
      ) {
        debug('根据全局选项跳过Twitter转推任务', { doTask });
        echoLog({ type: 'globalOptionsSkip', text: 'twitter.retweets', before: '[Twitter]' });
      } else {
        const realRetweets = this.getRealParams('retweets', retweetLinks, doTask,
          (link) => link.match(/https:\/\/x\.com\/.*?\/status\/([\d]+)/)?.[1] || link.match(/https:\/\/twitter\.com\/.*?\/status\/([\d]+)/)?.[1]);
        debug('处理后的Twitter转推列表', { count: realRetweets.length, retweets: realRetweets });
        if (realRetweets.length > 0) {
          for (const retweet of realRetweets) {
            if (Date.now() > this.#FwdForSdk.expiryTimeMillis) {
              debug('Twitter SDK过期，重新获取');
              this.#FwdForSdk = await getFwdForSdk();
            }
            await this.#toggleRetweet({ retweetId: retweet, doTask });
            await delay(1000);
          }
        }
      }
      return true;
    } catch (error) {
      debug('处理Twitter链接任务时发生错误', { error });
      throwError(error as Error, 'Twitter.toggle');
      return false;
    }
  }

  /**
   * 设置缓存，将指定的用户名与用户ID进行关联。
   *
   * @private
   * @function #setCache
   * @param {string} name - 要缓存的Twitter用户名。
   * @param {string} id - 要缓存的Twitter用户ID。
   * @returns {void} - 无返回值。
   *
   * @description
   * 该方法将用户名与用户ID的对应关系存储在缓存中，并使用`GM_setValue`将缓存保存到存储中。
   * 如果在设置缓存过程中发生错误，将抛出错误并记录错误信息。
   */
  #setCache(name: string, id: string): void {
    try {
      debug('设置Twitter用户ID缓存', { name, id });
      this.#cache[name] = id;
      GM_setValue('twitterCache', this.#cache);
    } catch (error) {
      debug('设置Twitter用户ID缓存时发生错误', { error });
      throwError(error as Error, 'Twitter.setCache');
    }
  }
}

export default Twitter;
