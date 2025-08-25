/*
 * @Author       : HCLonely
 * @Date         : 2021-09-28 15:03:10
 * @LastEditTime : 2025-08-20 09:21:02
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/social/Discord.ts
 * @Description  : Discord 加入&移除服务器
 */

import Social from './Social';
import httpRequest from '../tools/httpRequest';
import throwError from '../tools/throwError';
import { unique, delay } from '../tools/tools';
import echoLog from '../echoLog';
import __ from '../tools/i18n';
import { globalOptions } from '../globalOptions';
import Swal from 'sweetalert2';
import { debug } from '../tools/debug';

/**
 * @class Discord
 * @extends Social
 * @description 处理与Discord相关的任务，包括加入和退出服务器。
 *
 * @property {discordTasks} tasks - 存储Discord相关的任务信息。
 * @property {discordTasks} whiteList - 存储白名单服务器信息。
 * @private
 * @property {auth} #auth - 存储Discord身份验证信息。
 * @private
 * @property {cache} #cache - 存储缓存的服务器信息。
 * @private
 * @property {cache} #xContextPropertiesCache - 存储缓存的加群参数。
 * @private
 * @property {boolean} #initialized - 指示模块是否已初始化。
 *
 * @constructor
 * @description 创建一个Discord实例，初始化任务模板和白名单。
 */
class Discord extends Social {
  tasks: discordTasks;
  whiteList: discordTasks;
  #auth: auth = GM_getValue<auth>('discordAuth') || {};
  #cache: cache = GM_getValue<cache>('discordCache') || {};
  #xContextPropertiesCache: cache = GM_getValue<cache>('discordXContextPropertiesCache') || {};
  #initialized = false;

  /**
   * 创建一个Discord实例。
   *
   * @constructor
   * @description
   * 此构造函数初始化Discord类的实例，设置默认任务模板和白名单。
   * 默认任务模板包含一个空的服务器数组，用于存储Discord相关的任务信息。
   * 白名单将从GM_getValue中获取，如果没有找到，则使用默认任务模板。
   */
  constructor() {
    super();
    const defaultTasksTemplate: discordTasks = {
      servers: []
    };
    this.tasks = defaultTasksTemplate;
    this.whiteList = { ...defaultTasksTemplate, ...(GM_getValue<whiteList>('whiteList')?.discord || {}) };
  }

  /**
   * 初始化Discord模块，验证用户身份并获取授权。
   *
   * @async
   * @function init
   * @param {string} action - 指定的操作类型，可能的值为'do'或'undo'
   * @returns {Promise<boolean | 'skip'>} 返回初始化的结果
   *   - true: 初始化成功
   *   - false: 初始化失败
   *   - 'skip': 跳过初始化
   * @throws {Error} 当初始化过程中发生错误时抛出
   *
   * @description
   * 该方法首先检查用户是否已选择不再提醒。如果未选择，则显示警告对话框。
   * 根据用户的选择决定是否继续初始化。如果用户选择跳过，则返回'skip'。
   * 然后检查全局选项和当前操作类型，以确定是否执行初始化。
   * 如果未初始化且未授权，则调用`#updateAuth`方法获取新的授权信息。
   * 如果授权验证成功，则记录成功日志并返回true。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async init(action: string): Promise<boolean | 'skip'> {
    try {
      debug('开始初始化Discord模块', { action });
      if (!GM_getValue('dontRemindDiscordAgain')) {
        debug('显示Discord重要提示对话框');
        const result = await Swal.fire({
          title: __('discordImportantNotice'),
          text: __('discordImportantNoticeText'),
          showCancelButton: true,
          showDenyButton: true,
          confirmButtonText: __('continueDiscordTask'),
          cancelButtonText: __('skipDiscordTask'),
          denyButtonText: __('continueAndDontRemindAgain')
        }).then(({ isConfirmed, isDenied }) => {
          if (isConfirmed) {
            return true;
          }
          if (isDenied) {
            GM_setValue('dontRemindDiscordAgain', true);
            return true;
          }
          return false;
        });
        if (!result) {
          this.#initialized = false;
          return 'skip';
        }
      }
      if ((action === 'do' && !globalOptions.doTask.discord.servers) ||
        (action === 'undo' && !globalOptions.undoTask.discord.servers)) {
        this.#initialized = false;
        debug('检测到用户已禁用Discord任务，跳过初始化');
        return 'skip';
      }
      if (this.#initialized) {
        debug('Discord模块已初始化');
        return true;
      }
      if (!this.#auth.auth || !this.#auth.xSuperProperties) {
        debug('未找到Discord授权信息，尝试更新授权');
        if (await this.#updateAuth()) {
          this.#initialized = true;
          return true;
        }
        return false;
      }
      const isVerified: boolean = await this.#verifyAuth();
      if (isVerified) {
        debug('Discord授权验证成功');
        echoLog({ before: '[Discord]' }).success(__('initSuccess', 'Discord'));
        this.#initialized = true;
        return true;
      }
      GM_setValue('discordAuth', { auth: null });
      debug('Discord授权验证失败，尝试重新获取授权');
      if (await this.#updateAuth()) {
        echoLog({ before: '[Discord]' }).success(__('initSuccess', 'Discord'));
        this.#initialized = true;
        return true;
      }
      echoLog({ before: '[Discord]' }).error(__('initFailed', 'Discord'));
      return false;
    } catch (error) {
      throwError(error as Error, 'Discord.init');
      return false;
    }
  }

  /**
   * 验证Discord的身份验证Token是否有效。
   *
   * @async
   * @private
   * @function #verifyAuth
   * @returns {Promise<boolean>} 返回Token验证的结果
   *   - true: Token有效
   *   - false: Token无效
   * @throws {Error} 当验证过程中发生错误时抛出
   *
   * @description
   * 该方法通过发送HEAD请求到Discord API来验证Token的有效性。
   * 如果请求成功且返回的状态码为200，则记录成功日志并返回true。
   * 如果请求失败或返回的状态码不为200，则记录错误信息并返回false。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async #verifyAuth(): Promise<boolean> {
    try {
      debug('开始验证Discord授权');
      const logStatus = echoLog({ text: __('verifyingAuth', 'Discord'), before: '[Discord]' });
      const { result, statusText, status, data } = await httpRequest({
        url: 'https://discord.com/api/v6/users/@me',
        method: 'HEAD',
        headers: { authorization: this.#auth.auth as string }
      });

      if (result !== 'Success') {
        debug('Discord授权验证请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status !== 200) {
        debug('Discord授权验证状态码错误', { status: data?.status, statusText: data?.statusText });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      debug('Discord授权验证成功');
      logStatus.success();
      return true;
    } catch (error) {
      throwError(error as Error, 'Discord.verifyAuth');
      return false;
    }
  }

  /**
   * 更新Discord的身份验证Token。
   *
   * @async
   * @private
   * @function #updateAuth
   * @returns {Promise<boolean>} 返回更新操作的结果
   *   - true: 更新成功
   *   - false: 更新失败
   * @throws {Error} 当更新过程中发生错误时抛出
   *
   * @description
   * 该方法通过打开Discord网站的授权页面来更新Token。
   * 当新标签页关闭时，检查存储的身份验证信息。如果存在有效的Token，
   * 则更新内部的`#auth`属性并记录成功日志。
   * 如果Token不存在，则记录错误信息并返回false。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async #updateAuth(): Promise<boolean> {
    try {
      debug('开始更新Discord授权');
      const logStatus = echoLog({ text: __('updatingAuth', 'Discord'), before: '[Discord]' });
      return await new Promise((resolve) => {
        const newTab = GM_openInTab('https://discord.com/channels/@me',
          { active: true, insert: true, setParent: true });
        // @ts-ignore
        newTab.name = 'ATv4_discordAuth';
        newTab.onclose = async () => {
          const { auth, xSuperProperties } = GM_getValue<auth>('discordAuth');
          if (auth && xSuperProperties) {
            debug('成功获取新的Discord授权');
            this.#auth = { auth, xSuperProperties };
            logStatus.success();
            resolve(await this.#verifyAuth());
          } else {
            debug('获取Discord授权失败');
            logStatus.error('Error: Update discord auth failed!');
            resolve(false);
          }
        };
      });
    } catch (error) {
      throwError(error as Error, 'Discord.updateAuth');
      return false;
    }
  }

  /**
   * 加入指定的Discord服务器。
   *
   * @async
   * @private
   * @function #joinServer
   * @param {string} inviteId - Discord服务器的邀请ID
   * @returns {Promise<boolean>} 返回加入操作的结果
   *   - true: 加入成功
   *   - false: 加入失败
   * @throws {Error} 当加入过程中发生错误时抛出
   *
   * @description
   * 该方法通过发送POST请求到Discord API来加入服务器。
   * 请求的URL包含邀请ID，并在请求头中包含身份验证信息。
   * 如果请求成功且返回的结果为'Success'，并且状态码为200，
   * 则记录成功日志并缓存服务器信息。
   * 如果请求失败或返回的状态不符合预期，则记录错误信息并返回false。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async #joinServer(inviteId: string): Promise<boolean> {
    try {
      debug('开始加入Discord服务器', { inviteId });
      const logStatus = echoLog({ type: 'joiningDiscordServer', text: inviteId, before: '[Discord]' });
      const xContextProperties = await this.#getXContextProperties(inviteId);
      if (!xContextProperties) {
        debug('获取加群参数失败，无法加入服务器', { inviteId });
        logStatus.error('Error: Failed to get xContextProperties');
        return false;
      }
      const { result, statusText, status, data } = await httpRequest({
        url: `https://discord.com/api/v9/invites/${inviteId}`,
        method: 'POST',
        dataType: 'json',
        headers: {
          'content-type': 'application/json',
          authorization: this.#auth.auth as string,
          origin: 'https://discord.com',
          referer: `https://discord.com/invite/${inviteId}`,
          'x-super-properties': this.#auth.xSuperProperties as string,
          'x-context-properties': xContextProperties
        },
        data: '{"session_id":null}'
      });

      if (result !== 'Success' || data?.status !== 200) {
        debug('加入Discord服务器失败', { result, statusText, status });
        if (status === 400) {
          debug('加入Discord服务器失败，状态码为400，需完成人机验证');
          logStatus.error(__('captchaNeeded'));
          return false;
        }
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      const guild = data.response?.guild?.id;
      if (!guild) {
        debug('获取服务器ID失败');
        logStatus.error('Error: Failed to get guild ID');
        return false;
      }

      debug('成功加入Discord服务器', { guild });
      logStatus.success();
      this.#setCache(inviteId, guild);
      this.tasks.servers = unique([...this.tasks.servers, inviteId]);
      return true;
    } catch (error) {
      throwError(error as Error, 'Discord.joinServer');
      return false;
    }
  }

  /**
   * 退出指定的Discord服务器。
   *
   * @async
   * @private
   * @function #leaveServer
   * @param {string} inviteId - Discord服务器的邀请ID
   * @returns {Promise<boolean>} 返回退出操作的结果
   *   - true: 退出成功
   *   - false: 退出失败
   * @throws {Error} 当退出过程中发生错误时抛出
   *
   * @description
   * 该方法首先检查邀请ID是否在白名单中。如果在白名单中，则直接返回true。
   * 然后通过调用`#getGuild`方法获取服务器的ID。如果获取失败，则返回false。
   * 发送DELETE请求到Discord API以退出服务器。如果请求成功且返回的状态码为204，
   * 则记录成功日志并返回true。
   * 如果请求失败或返回的状态不符合预期，则记录错误信息并返回false。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async #leaveServer(inviteId: string): Promise<boolean> {
    try {
      debug('开始退出Discord服务器', { inviteId });
      if (this.whiteList.servers.includes(inviteId)) {
        debug('服务器在白名单中，跳过退出操作', { inviteId });
        echoLog({ type: 'whiteList', text: 'Discord.leaveServer', id: inviteId, before: '[Discord]' });
        return true;
      }

      const guild = await this.#getGuild(inviteId);
      if (!guild) {
        debug('获取服务器ID失败，无法退出服务器', { inviteId });
        return false;
      }

      const logStatus = echoLog({ type: 'leavingDiscordServer', text: guild, before: '[Discord]' });
      const { result, statusText, status, data } = await httpRequest({
        url: `https://discord.com/api/v9/users/@me/guilds/${guild}`,
        method: 'DELETE',
        headers: {
          authorization: this.#auth.auth as string,
          'x-super-properties': this.#auth.xSuperProperties as string
        }
      });

      if (result !== 'Success' || data?.status !== 204) {
        debug('退出Discord服务器失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      debug('成功退出Discord服务器', { guild });
      logStatus.success();
      return true;
    } catch (error) {
      throwError(error as Error, 'Discord.leaveServer');
      return false;
    }
  }

  /**
   * 获取Discord加群所需的X-Context-Properties参数。
   *
   * @async
   * @private
   * @function #getXContextProperties
   * @param {string} inviteId - Discord服务器的邀请ID
   * @returns {Promise<false | string>} 返回获取操作的结果
   *   - string: 获取成功，返回base64编码的X-Context-Properties参数
   *   - false: 获取失败
   * @throws {Error} 当获取过程中发生错误时抛出
   *
   * @description
   * 该方法首先检查缓存中是否存在对应的X-Context-Properties参数。如果存在，则直接返回该参数。
   * 如果不存在，则发送GET请求到Discord API以获取服务器和频道信息。
   * 请求成功后，将构建包含location、guild_id和channel相关信息的参数对象。
   * 将参数对象转换为JSON字符串并进行base64编码后缓存并返回。
   * 如果获取失败或返回的状态不符合预期，则记录错误信息并返回false。
   */
  async #getXContextProperties(inviteId: string): Promise<false | string> {
    try {
      debug('开始获取Discord加群参数', { inviteId });
      const logStatus = echoLog({ type: 'gettingDiscordXContextProperties', text: inviteId, before: '[Discord]' });

      // Check cache first
      const cachedXContextProperties = this.#xContextPropertiesCache[inviteId];
      if (cachedXContextProperties) {
        debug('从缓存中获取到加群参数', { inviteId, cachedXContextProperties });
        logStatus.success();
        return cachedXContextProperties;
      }

      const { result, statusText, status, data } = await httpRequest({
        url: `https://discord.com/api/v9/invites/${inviteId}?with_counts=true&with_expiration=true&with_permissions=true`,
        responseType: 'json',
        method: 'GET',
        headers: {
          authorization: this.#auth.auth as string,
          'x-super-properties': this.#auth.xSuperProperties as string
        }
      });

      if (result !== 'Success' || data?.status !== 200) {
        debug('获取加群参数失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      const guild = data.response?.guild?.id;
      if (!guild) {
        debug('加群参数中未找到ID', { inviteId });
        logStatus.error('Error: Failed to get guild ID');
        return false;
      }

      const xContextProperties = {
        location: 'Accept Invite Page',
        location_guild_id: data.response?.guild?.id,
        location_channel_id: data.response?.channel?.id,
        location_channel_type: data.response?.channel?.type
      };

      debug('成功获取加群参数', xContextProperties);
      logStatus.success();
      this.#setXContextPropertiesCache(inviteId, window.btoa(JSON.stringify(xContextProperties)));
      this.#setCache(inviteId, guild);
      return window.btoa(JSON.stringify(xContextProperties));
    } catch (error) {
      throwError(error as Error, 'Discord.getXContextProperties');
      return false;
    }
  }

  /**
   * 通过邀请ID获取Discord服务器的ID。
   *
   * @async
   * @private
   * @function #getGuild
   * @param {string} inviteId - Discord服务器的邀请ID
   * @returns {Promise<false | string>} 返回获取操作的结果
   *   - string: 获取成功，返回服务器的ID
   *   - false: 获取失败
   * @throws {Error} 当获取过程中发生错误时抛出
   *
   * @description
   * 该方法首先检查缓存中是否存在对应的服务器ID。如果存在，则直接返回该ID。
   * 如果不存在，则发送GET请求到Discord API以获取服务器信息。
   * 如果请求成功且返回的状态为200，则提取服务器的ID并缓存。
   * 如果获取失败或返回的状态不符合预期，则记录错误信息并返回false。
   * 如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async #getGuild(inviteId: string): Promise<false | string> {
    try {
      debug('开始获取Discord服务器ID', { inviteId });
      const logStatus = echoLog({ type: 'gettingDiscordGuild', text: inviteId, before: '[Discord]' });

      // Check cache first
      const cachedGuild = this.#cache[inviteId];
      if (cachedGuild) {
        debug('从缓存中获取到服务器ID', { inviteId, cachedGuild });
        logStatus.success();
        return cachedGuild;
      }

      const { result, statusText, status, data } = await httpRequest({
        url: `https://discord.com/api/v9/invites/${inviteId}`,
        responseType: 'json',
        method: 'GET',
        headers: {
          authorization: this.#auth.auth as string,
          'x-super-properties': this.#auth.xSuperProperties as string
        }
      });

      if (result !== 'Success' || data?.status !== 200) {
        debug('获取服务器信息失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      const guild = data.response?.guild?.id;
      if (!guild) {
        debug('服务器信息中未找到ID', { inviteId });
        logStatus.error('Error: Failed to get guild ID');
        return false;
      }

      debug('成功获取服务器ID', { inviteId, guild });
      logStatus.success();
      this.#setCache(inviteId, guild);
      return guild;
    } catch (error) {
      throwError(error as Error, 'Discord.getGuild');
      return false;
    }
  }

  /**
   * 切换Discord相关任务的状态，关注或取关指定的服务器。
   *
   * @async
   * @function toggle
   * @param {Object} options - 选项对象
   * @param {boolean} [options.doTask=true] - 指示是否执行任务，true表示关注服务器，false表示取关服务器
   * @param {Array<string>} [options.serverLinks=[]] - Discord服务器邀请链接数组
   * @returns {Promise<boolean>} 返回操作的结果
   *   - true: 操作成功
   *   - false: 操作失败
   * @throws {Error} 当操作过程中发生错误时抛出
   *
   * @description
   * 该方法统一处理Discord相关任务。首先检查模块是否已初始化，如果未初始化，则返回false。
   * 根据`doTask`和全局选项判断是否执行任务。如果执行任务，则获取实际的服务器参数，
   * 并逐个处理关注或取关操作。
   * 最后返回所有操作的结果，如果在执行过程中发生错误，将抛出错误并返回false。
   */
  async toggle({
    doTask = true,
    serverLinks = []
  }: {
    doTask: boolean,
    serverLinks?: Array<string>
  }): Promise<boolean> {
    try {
      debug('开始处理Discord服务器任务', { doTask, serverLinksCount: serverLinks.length });
      if (!this.#initialized) {
        debug('Discord模块未初始化');
        echoLog({ text: __('needInit'), before: '[Discord]' });
        return false;
      }

      // Check if task should be skipped
      if (
        (doTask && !globalOptions.doTask.discord.servers) ||
        (!doTask && !globalOptions.undoTask.discord.servers)
      ) {
        debug('根据全局选项跳过Discord服务器任务', { doTask });
        echoLog({ type: 'globalOptionsSkip', text: 'discord.servers', before: '[Discord]' });
        return true;
      }

      // Process server links
      const realServers = this.getRealParams('servers', serverLinks, doTask, (link: string) => link.match(/invite\/(.+)/)?.[1]);
      debug('处理后的服务器列表', { count: realServers.length, servers: realServers });

      if (realServers.length === 0) {
        debug('没有需要处理的服务器');
        return true;
      }
      const results = [];
      for (const server of realServers) {
        results.push(doTask ? this.#joinServer(server) : this.#leaveServer(server));
        await delay(1000);
      }

      return await Promise.allSettled(results).then(() => true);
    } catch (error) {
      throwError(error as Error, 'Discord.toggleServers');
      return false;
    }
  }

  /**
   * 设置缓存，将指定的邀请ID与服务器ID进行关联。
   *
   * @private
   * @function #setCache
   * @param {string} inviteId - 要缓存的Discord邀请ID
   * @param {string} guild - 要缓存的Discord服务器ID
   * @throws {Error} 当设置缓存过程中发生错误时抛出
   *
   * @description
   * 该方法将邀请ID与服务器ID的对应关系存储在缓存中，并使用`GM_setValue`将缓存保存到存储中。
   * 如果在设置缓存过程中发生错误，将抛出错误并记录错误信息。
   */
  #setCache(inviteId: string, guild: string): void {
    try {
      debug('设置Discord服务器缓存', { inviteId, guild });
      this.#cache[inviteId] = guild;
      GM_setValue('discordCache', this.#cache);
      debug('Discord服务器缓存设置成功');
    } catch (error) {
      debug('设置Discord服务器缓存失败', { error });
      throwError(error as Error, 'Discord.setCache');
    }
  }

  /**
   * 设置Discord加群参数缓存。
   *
   * @private
   * @function #setXContextPropertiesCache
   * @param {string} inviteId - 要缓存的Discord邀请ID
   * @param {string} xContextProperties - 要缓存的Discord加群参数
   * @throws {Error} 当设置缓存过程中发生错误时抛出
   *
   * @description
   * 该方法将加群参数与邀请ID的对应关系存储在缓存中，并使用`GM_setValue`将缓存保存到存储中。
   * 如果在设置缓存过程中发生错误，将抛出错误并记录错误信息。
   */
  #setXContextPropertiesCache(inviteId: string, xContextProperties: string): void {
    try {
      debug('设置Discord加群参数缓存', { inviteId, xContextProperties });
      this.#xContextPropertiesCache[inviteId] = xContextProperties;
      GM_setValue('discordXContextPropertiesCache', this.#xContextPropertiesCache);
    } catch (error) {
      debug('设置Discord加群参数缓存失败', { error });
      throwError(error as Error, 'Discord.setXContextPropertiesCache');
    }
  }
}

// @ts-ignore
// unsafeWindow.Discord = Discord;

export default Discord;
