/*
 * @Author       : HCLonely
 * @Date         : 2021-10-04 16:07:55
 * @LastEditTime : 2025-08-18 19:08:55
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/social/SteamWeb.ts
 * @Description  : steam相关功能
 */

import echoLog from '../echoLog';
import throwError from '../tools/throwError';
import httpRequest from '../tools/httpRequest';
import __ from '../tools/i18n';
import { debug } from '../tools/debug';

/**
 * SteamWeb类用于处理与Steam相关的功能，包括身份验证、加入/退出组、管理愿望单、关注游戏等操作。
 *
 * @class SteamWeb
 * @extends Social
 *
 * @property {steamTasks} tasks - 存储Steam相关的任务信息。
 * @property {steamCache} #cache - 存储Steam相关的缓存信息。
 * @property {auth} #auth - 存储身份验证信息。
 * @property {boolean} #storeInitialized - 标记Steam商店是否已初始化。
 * @property {boolean} #communityInitialized - 标记Steam社区是否已初始化。
 * @property {string} #oldArea - 当前地区的代码。
 * @property {string} #area - 当前地区的代码。
 * @property {string} #areaStatus - 当前地区状态。
 *
 * @method init 初始化SteamWeb模块，验证及获取身份验证信息。
 * @param {string} [type='all'] - 初始化类型，默认为'all'。可选值包括'store'和'community'。
 * @returns {Promise<boolean>} - 返回一个Promise，表示初始化是否成功。
 * @throws {Error} - 如果在初始化过程中发生错误，将抛出错误。
 *
 * @method #refreshToken 刷新Steam的身份验证令牌。
 * @param {('steamStore' | 'steamCommunity')} type - 指定要刷新令牌的类型，默认为'steamStore'。
 * @returns {Promise<boolean>} - 返回一个Promise，表示刷新操作的结果。
 * @throws {Error} - 如果在刷新过程中发生错误，将抛出错误。
 *
 * @method #setStoreToken 设置Steam商店或社区的Token。
 * @param {storeTokenParam} param - 包含设置Token所需的参数。
 * @param {('steamStore' | 'steamCommunity')} type - 指定Token类型，可以是'steamStore'或'steamCommunity'。
 * @returns {Promise<boolean>} - 返回一个Promise，表示设置Token的结果。
 * @throws {Error} - 如果在设置Token过程中发生错误，将抛出错误。
 *
 * @method #updateStoreAuth 更新Steam商店的身份验证Token。
 * @param {boolean} [retry=false] - 是否为重试操作，默认为false。
 * @returns {Promise<boolean>} - 返回一个Promise，表示更新Token的结果。
 * @throws {Error} - 如果在更新过程中发生错误，将抛出错误。
 *
 * @method #updateStoreAuthTab 更新Steam商店的身份验证标签页。
 * @returns {Promise<boolean>} - 返回一个Promise，表示更新操作的结果。
 * @throws {Error} - 如果在更新过程中发生错误，将抛出错误。
 *
 * @method #updateCommunityAuthTab 更新Steam社区的身份验证标签页。
 * @returns {Promise<boolean>} - 返回一个Promise，表示更新操作的结果。
 * @throws {Error} - 如果在更新过程中发生错误，将抛出错误。
 *
 * @method #getUserLink 获取Steam用户链接并更新Steam社区的身份验证信息。
 * @param {boolean} [retry=false] - 是否为重试请求，默认为false。
 * @returns {Promise<boolean>} - 返回一个Promise，表示获取用户链接的结果。
 * @throws {Error} - 如果在获取过程中发生错误，将抛出错误。
 *
 * @method #updateCommunityAuth 更新Steam社区的身份验证信息。
 * @param {string} url - 要请求的Steam社区URL。
 * @returns {Promise<boolean>} - 返回一个Promise，表示更新操作的结果。
 * @throws {Error} - 如果在更新过程中发生错误，将抛出错误。
 *
 * @method #getAreaInfo 获取当前购物车地区及可更换的地区。
 * @returns {Promise<areas>} - 返回一个Promise，包含当前地区和可更换地区的信息。
 * @throws {Error} - 如果在获取过程中发生错误，将抛出错误。
 *
 * @method #changeArea 更换Steam的地区。
 * @param {string} [area] - 目标地区的代码，如果未提供，则自动获取可用地区。
 * @returns {Promise<boolean | string>} - 返回一个Promise，表示更换地区的结果。
 * @throws {Error} - 如果在更换过程中发生错误，将抛出错误。
 *
 * @method joinGroup 加入指定的Steam组。
 * @param {string} groupName - 要加入的Steam组的名称。
 * @returns {Promise<boolean>} - 返回一个Promise，表示加入操作的结果。
 * @throws {Error} - 如果在加入过程中发生错误，将抛出错误。
 *
 * @method leaveGroup 退出指定的Steam组。
 * @param {string} groupName - 要退出的Steam组的名称。
 * @returns {Promise<boolean>} - 返回一个Promise，表示退出操作的结果。
 * @throws {Error} - 如果在退出过程中发生错误，将抛出错误。
 *
 * @method #getGroupId 获取指定Steam组的ID。
 * @param {string} groupName - 要获取ID的Steam组名称。
 * @returns {Promise<false | string>} - 返回一个Promise，表示获取操作的结果。
 * @throws {Error} - 如果在获取过程中发生错误，将抛出错误。
 *
 * @method joinOfficialGroup 加入指定的Steam官方组。
 * @param {string} gameId - 要加入的Steam游戏的ID。
 * @returns {Promise<boolean>} - 返回一个Promise，表示加入操作的结果。
 * @throws {Error} - 如果在加入过程中发生错误，将抛出错误。
 *
 * @method leaveOfficialGroup 退出指定的Steam官方组。
 * @param {string} gameId - 要退出的Steam游戏的ID。
 * @returns {Promise<boolean>} - 返回一个Promise，表示退出操作的结果。
 * @throws {Error} - 如果在退出过程中发生错误，将抛出错误。
 *
 * @method #getOfficialGroupId 获取指定Steam游戏的官方组ID。
 * @param {string} gameId - Steam游戏的ID。
 * @returns {Promise<false | string>} - 返回一个Promise，表示获取操作的结果。
 * @throws {Error} - 如果在获取过程中发生错误，将抛出错误。
 *
 * @method addToWishlist 将指定的游戏添加到Steam的愿望单。
 * @param {string} gameId - Steam游戏的AppId。
 * @returns {Promise<boolean>} - 返回一个Promise，表示添加操作的结果。
 * @throws {Error} - 如果在添加过程中发生错误，将抛出错误。
 *
 * @method removeFromWishlist 从Steam愿望单移除游戏。
 * @param {string} gameId - Steam游戏的AppId。
 * @returns {Promise<boolean>} - 返回一个Promise，表示移除操作的结果。
 * @throws {Error} - 如果在移除过程中发生错误，将抛出错误。
 *
 * @method toggleFollowGame 关注或取关指定的Steam游戏。
 * @param {string} gameId - Steam游戏的AppId。
 * @param {boolean} doTask - true表示关注游戏，false表示取关游戏。
 * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
 * @throws {Error} - 如果在操作过程中发生错误，将抛出错误。
 *
 * @method #isFollowedGame 判断指定的Steam游戏是否已被关注。
 * @param {string} gameId - Steam游戏的AppId。
 * @returns {Promise<boolean | 'areaLocked'>} - 返回一个Promise，表示关注状态。
 * @throws {Error} - 如果在判断过程中发生错误，将抛出错误。
 *
 * @method toggleForum 订阅或取消订阅Steam论坛。
 * @param {string} gameId - Steam游戏的AppId。
 * @param {boolean} [doTask=true] - true表示订阅论坛，false表示取消订阅论坛。
 * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
 * @throws {Error} - 如果在操作过程中发生错误，将抛出错误。
 *
 * @method #getForumId 获取指定Steam游戏的论坛ID。
 * @param {string} gameId - Steam游戏的AppId。
 * @returns {Promise<false | string>} - 返回一个Promise，表示获取操作的结果。
 * @throws {Error} - 如果在获取过程中发生错误，将抛出错误。
 *
 * @method toggleFavoriteWorkshop 收藏或取消收藏指定的Steam创意工坊物品。
 * @param {string} id - 创意工坊物品的ID。
 * @param {boolean} [doTask=true] - true表示收藏物品，false表示取消收藏物品。
 * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
 * @throws {Error} - 如果在操作过程中发生错误，将抛出错误。
 *
 * @method #getWorkshopAppId 获取创意工坊物品的AppId。
 * @param {string} id - 创意工坊物品的ID。
 * @returns {Promise<false | string>} - 返回一个Promise，表示获取操作的结果。
 * @throws {Error} - 如果在获取过程中发生错误，将抛出错误。
 *
 * @method voteUpWorkshop 点赞创意工坊物品。
 * @param {string} id - 创意工坊物品的ID。
 * @returns {Promise<boolean>} - 返回一个Promise，表示点赞操作的结果。
 * @throws {Error} - 如果在点赞过程中发生错误，将抛出错误。
 *
 * @method toggleCurator 关注或取关指定的Steam鉴赏家、开发商或发行商。
 * @param {string} curatorId - 鉴赏家的ID。
 * @param {boolean} [doTask=true] - true表示关注，false表示取关。
 * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
 * @throws {Error} - 如果在操作过程中发生错误，将抛出错误。
 *
 * @method getCuratorId 获取Steam开发商或发行商的鉴赏家ID。
 * @param {string} path - 鉴赏家的类型（如开发商或发行商）。
 * @param {string} name - 鉴赏家的名称。
 * @returns {Promise<false | string>} - 返回一个Promise，表示获取操作的结果。
 * @throws {Error} - 如果在获取过程中发生错误，将抛出错误。
 *
 * @method toggleCuratorLike 处理Steam鉴赏家的点赞或取关操作。
 * @param {string} link - 鉴赏家的链接，包含类型和名称，以'/'分隔。
 * @param {boolean} [doTask=true] - true表示关注，false表示取关，默认为true。
 * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
 * @throws {Error} - 如果在处理过程中发生错误，将抛出错误。
 *
 * @method #getAnnouncementParams 获取Steam通知所需的参数。
 * @param {string} appId - Steam游戏的AppId。
 * @param {string} viewId - Steam通知的ID。
 * @returns {Promise<announcementParams | {}>} - 返回一个Promise，表示获取操作的结果。
 * @throws {Error} - 如果在获取过程中发生错误，将抛出错误。
 *
 * @method likeAnnouncement 点赞Steam通知。
 * @param {string} id - Steam游戏的AppId和Steam通知的ID，以'/'分隔。
 * @returns {Promise<boolean>} - 返回一个Promise，表示点赞操作的结果。
 * @throws {Error} - 如果在点赞过程中发生错误，将抛出错误。
 *
 * @method #appid2subid 将Steam游戏的AppId转换为SubId。
 * @param {string} id - Steam游戏的AppId。
 * @returns {Promise<string | false>} - 返回一个Promise，表示转换操作的结果。
 * @throws {Error} - 如果在转换过程中发生错误，将抛出错误。
 *
 * @method #getLicenses 获取Steam用户的许可证信息。
 * @returns {Promise<Array<number> | false>} - 返回一个Promise，表示获取操作的结果。
 * @throws {Error} - 如果在获取过程中发生错误，将抛出错误。
 *
 * @method addLicense 添加Steam许可证。
 * @param {string} id - 要添加的许可证ID，格式为'appid-xxxx'或'subid-xxxx,xxxx'。
 * @returns {Promise<boolean>} - 返回一个Promise，表示添加操作的结果。
 * @throws {Error} - 如果在添加过程中发生错误，将抛出错误。
 *
 * @method addFreeLicense 添加免费Steam游戏许可证。
 * @param {string} id - Steam游戏的subid。
 * @param {logStatus} [logStatusPre] - 可选的日志状态，用于记录操作状态。
 * @returns {Promise<boolean>} - 返回一个Promise，表示添加操作的结果。
 * @throws {Error} - 如果在添加过程中发生错误，将抛出错误。
 *
 * @method requestPlayTestAccess 请求Steam游戏的试玩访问权限。
 * @param {string} id - Steam游戏的AppId。
 * @returns {Promise<boolean>} - 返回一个Promise，表示请求操作的结果。
 * @throws {Error} - 如果在请求过程中发生错误，将抛出错误。
 */
class SteamWeb {
  #cache: steamCache = {
    ...{
      group: {},
      officialGroup: {},
      forum: {},
      workshop: {},
      curator: {}
    }, ...GM_getValue<steamCache>('steamCache')
  };
  #auth: auth = {};
  #storeInitialized = false;
  #communityInitialized = false;
  #area = 'CN';
  #oldArea!: string;
  #areaStatus = 'end';

  constructor() {
    debug('初始化SteamWeb实例');
  }

  /**
   * 初始化Steam模块，验证及获取身份验证信息。
   *
   * @async
   * @function init
   * @param {string} [type='all'] - 初始化类型，默认为'all'。可选值包括'store'和'community'。
   * @returns {Promise<boolean>} - 返回一个Promise，表示初始化是否成功。
   *                              - true: 初始化完成
   *                              - false: 初始化失败
   * @throws {Error} - 如果在初始化过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数根据传入的类型初始化Steam模块。
   * 如果ASF（Auto-Steam-Farm）启用且相关配置存在，则初始化ASF实例。
   * 如果类型为'store'，则更新Steam商店的身份验证信息。
   * 如果类型为'community'，则更新Steam社区的身份验证信息。
   * 如果两者都已初始化，则返回成功信息。
   * 如果任何步骤失败，函数将记录错误信息并返回false。
   */
  async init(type = 'all'): Promise<boolean> {
    try {
      debug('开始初始化SteamWeb', { type });
      const initStoreResult = await this.initStore();
      debug('Steam商店初始化完成', { initStoreResult });
      if (type === 'store') {
        return initStoreResult;
      }
      const initCommunityResult = await this.initCommunity(initStoreResult);
      debug('Steam社区初始化完成', { initCommunityResult });
      return initCommunityResult;
    } catch (error) {
      debug('SteamWeb初始化发生错误', { error, type });
      throwError(error as Error, 'SteamWeb.init');
      return false;
    }
  }

  async initStore(): Promise<boolean> {
    try {
      debug('开始初始化Steam商店');
      if (this.#storeInitialized) {
        return true;
      }
      let storeInitialized = await this.#updateStoreAuth();
      if (!storeInitialized) {
        storeInitialized = await this.#updateStoreAuthTab();
      }

      this.#storeInitialized = storeInitialized;
      if (!this.#storeInitialized) {
        echoLog({ before: '[Web]' }).error(__('initFailed', 'Steam'));
        return false;
      }

      echoLog({ before: '[Web]' }).success(__('initSuccess', 'SteamStore'));
      debug('Steam商店初始化完成');
      return true;
    } catch (error) {
      debug('Steam商店初始化发生错误', { error });
      throwError(error as Error, 'SteamWeb.initStore');
      return false;
    }
  }

  async initCommunity(initStoreResult: boolean): Promise<boolean> {
    try {
      debug('开始初始化Steam社区');
      if (this.#communityInitialized) {
        return true;
      }
      let communityInitialized = await this.#updateCommunityAuth(initStoreResult);
      if (!communityInitialized) {
        communityInitialized = await this.#updateCommunityAuthTab();
        GM_setValue('steamCommunityAuth', null);
      }

      this.#communityInitialized = communityInitialized;
      if (!this.#communityInitialized) {
        echoLog({ before: '[Web]' }).error(__('initFailed', 'Steam'));
        return false;
      }

      echoLog({ before: '[Web]' }).success(__('initSuccess', 'SteamCommunity'));
      debug('Steam社区初始化完成');
      return true;
    } catch (error) {
      debug('Steam社区初始化发生错误', { error });
      throwError(error as Error, 'SteamWeb.initCommunity');
      return false;
    }
  }

  /**
   * 刷新Steam的身份验证令牌。
   *
   * @async
   * @function #refreshToken
   * @param {('steamStore' | 'steamCommunity')} type - 指定要刷新令牌的类型，默认为'steamStore'。
   * @returns {Promise<boolean>} - 返回一个Promise，表示刷新操作的结果。
   *                              - true: 刷新成功
   *                              - false: 刷新失败
   * @throws {Error} - 如果在刷新过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数通过发送POST请求到Steam的登录接口来刷新身份验证令牌。
   * 函数首先构建请求的表单数据，并设置请求头信息。
   * 如果请求成功且返回结果为'Success'，则进一步检查响应数据是否成功。
   * 如果成功，则调用`#setStoreToken`方法设置新的Token，并返回true。
   * 如果任何步骤失败，函数将记录错误信息并返回false。
   */
  async #refreshToken(type: 'steamStore' | 'steamCommunity' = 'steamStore'): Promise<boolean> {
    try {
      debug('开始刷新令牌', { type });
      const host = {
        steamStore: 'store.steampowered.com',
        steamCommunity: 'steamcommunity.com'
      };
      const logStatus = echoLog({ text: __('refreshingToken', __(type)), before: '[Web]' });

      debug('准备刷新令牌请求数据');
      const formData = new FormData();
      formData.append('redir', `https://${host[type]}/`);

      debug('发送刷新令牌请求');
      const { result, statusText, status, data } = await httpRequest({
        url: 'https://login.steampowered.com/jwt/ajaxrefresh',
        method: 'POST',
        responseType: 'json',
        headers: {
          Host: 'login.steampowered.com',
          Origin: `https://${host[type]}`,
          Referer: `https://${host[type]}/`
        },
        data: formData
      });
      debug('收到刷新令牌响应', { result, status, statusText });

      if (result !== 'Success') {
        debug('请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (!data?.response?.success) {
        debug('响应不成功', { status: data?.status, statusText: data?.statusText });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      debug('开始设置新令牌');
      if (!await this.#setToken(data.response, type)) {
        debug('设置新令牌失败');
        logStatus.error('Error');
        return false;
      }

      debug('成功刷新令牌');
      logStatus.success();
      return true;
    } catch (error) {
      debug('刷新令牌时发生错误', { error });
      throwError(error as Error, 'SteamWeb.refreshToken');
      return false;
    }
  }
  /**
   * 设置Steam商店或社区的Token。
   *
   * @async
   * @function #setToken
   * @param {storeTokenParam} param - 包含设置Token所需的参数，包括steamID、nonce、redir和auth。
   * @param {('steamStore' | 'steamCommunity')} type - 指定Token类型，可以是'steamStore'或'steamCommunity'。
   * @returns {Promise<boolean>} - 返回一个Promise，表示设置Token的结果。
   *                              - true: 设置Token成功
   *                              - false: 设置Token失败
   * @throws {Error} - 如果在设置Token过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数通过发送POST请求到指定的Steam URL来设置Token。
   * 函数首先构建请求的表单数据，然后发送请求。
   * 如果请求成功且返回结果为'Success'，并且状态为200，则返回true。
   * 如果请求失败或返回的结果不为'Success'，则记录错误信息并返回false。
   */
  async #setToken(param: storeTokenParam, type: 'steamStore' | 'steamCommunity'): Promise<boolean> {
    try {
      const host = {
        steamStore: 'store.steampowered.com',
        steamCommunity: 'steamcommunity.com'
      };
      debug('开始设置Steam令牌', { type });

      const logStatus = echoLog({ text: __('settingToken', __(type)), before: '[Web]' });

      debug('准备表单数据');
      const formData = new FormData();
      formData.append('steamID', param.steamID);
      formData.append('nonce', param.nonce);
      formData.append('redir', param.redir);
      formData.append('auth', param.auth);
      debug('表单数据准备完成', {
        steamID: param.steamID,
        nonce: param.nonce,
        redir: param.redir
      });

      debug('发送设置令牌请求');
      const { result, statusText, status, data } = await httpRequest({
        url: `https://${host[type]}/login/settoken`,
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          Host: host[type],
          Origin: `https://${host[type]}`
          // Referer: `https://${host[type]}/login`
        },
        data: formData
      });
      debug('收到设置令牌响应', { result, status, statusText });

      if (result !== 'Success') {
        debug('请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status !== 200) {
        debug('响应状态错误', {
          status: data?.status,
          statusText: data?.statusText
        });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      debug('成功设置令牌');
      logStatus.success();
      return true;
    } catch (error) {
      debug('设置令牌时发生错误', { error, type });
      throwError(error as Error, 'SteamWeb.setToken');
      return false;
    }
  }
  /**
   * 更新Steam商店的身份验证Token。
   *
   * @async
   * @function #updateStoreAuth
   * @param {boolean} [retry=false] - 是否为重试操作，默认为false。
   * @returns {Promise<boolean>} - 返回一个Promise，表示更新Token的结果。
   *                              - true: 更新Token成功
   *                              - false: 更新Token失败
   * @throws {Error} - 如果在更新过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数通过发送GET请求到Steam商店的URL来更新身份验证Token。
   * 如果请求成功且状态为200，函数会检查响应文本中是否包含'data-miniprofile='。
   * 如果没有找到，函数会尝试刷新Token并进行重试。
   * 如果成功获取到'sessionID'，则将其存储并返回true。
   * 如果请求状态为301或302，表示需要重定向，函数同样会尝试刷新Token并处理重试逻辑。
   * 如果请求失败或发生异常，函数会记录错误并返回false。
   */
  async #updateStoreAuth(retry = false): Promise<boolean> {
    try {
      debug('开始更新Steam商店身份验证');
      const logStatus = echoLog({ text: __('updatingAuth', __('steamStore')), before: '[Web]' });
      const { result, statusText, status, data } = await httpRequest({
        url: 'https://store.steampowered.com/',
        method: 'GET',
        headers: {
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Upgrade-Insecure-Requests': '1'
        },
        redirect: 'manual'
      });
      debug('收到Steam商店身份验证响应', { result, statusText, status });

      if (data?.status !== 200) {
        if (![301, 302].includes(data?.status as number)) {
          debug('Steam商店身份验证状态错误', { status: data?.status });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }

        if (!await this.#refreshToken('steamStore')) {
          debug('Steam商店身份验证刷新失败');
          logStatus.error(`Error:${__('needLoginSteamStore')}`, true);
          return false;
        }
        if (retry) {
          debug('Steam商店身份验证重试失败');
          logStatus.error(`Error:${__('needLoginSteamStore')}`, true);
          return false;
        }
        debug('Steam商店身份验证重试中');
        logStatus.warning(__('retry'));
        return this.#updateStoreAuth(true);
      }

      if (!data.responseText.includes('data-miniprofile=')) {
        if (await this.#refreshToken('steamStore')) {
          debug('Steam商店身份验证需要重试');
          logStatus.warning(__('retry'));
          if (retry) {
            debug('Steam商店身份验证重试次数超限');
            logStatus.error(`Error:${__('needLoginSteamStore')}`, true);
            return false;
          }
          return this.#updateStoreAuth(true);
        }

        debug('Steam商店身份验证失败：需要登录');
        logStatus.error(`Error:${__('needLoginSteamStore')}`, true);
        return false;
      }

      const storeSessionID = data.responseText.match(/g_sessionID = "(.+?)";/)?.[1];
      if (!storeSessionID) {
        debug('Steam商店身份验证失败：获取sessionID失败');
        logStatus.error('Error: Get "sessionID" failed');
        return false;
      }

      this.#auth.storeSessionID = storeSessionID;
      debug('Steam商店身份验证更新成功', { storeSessionID });
      logStatus.success();
      return true;
    } catch (error) {
      debug('更新Steam商店身份验证时发生错误', { error });
      throwError(error as Error, 'SteamWeb.updateStoreAuth');
      return false;
    }
  }
  /**
   * 通过打开新标签页更新Steam商店的身份验证。
   *
   * @async
   * @function #updateStoreAuthTab
   * @returns {Promise<boolean>} - 返回一个Promise，表示更新操作的结果。
   *                              - true: 更新成功
   *                              - false: 更新失败
   * @throws {Error} - 如果在更新过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数通过打开一个新的浏览器标签页来更新Steam商店的身份验证信息。
   * 首先，记录更新状态。然后，打开Steam商店的URL。
   * 使用`GM_addValueChangeListener`监听`steamStoreAuth`的值变化。
   * 如果新值与旧值不同且存在新值，则更新存储的会话ID，并记录成功信息。
   * 如果更新失败，则记录错误信息。
   * 最后，关闭新标签页并返回更新结果。
   */
  async #updateStoreAuthTab(): Promise<boolean> {
    try {
      debug('开始通过新标签页更新Steam商店身份验证');
      const logStatus = echoLog({ text: __('updatingAuth', __('steamStoreTab')), before: '[Web]' });
      return await new Promise((resolve) => {
        GM_deleteValue('steamStoreAuth');
        GM_setValue('ATv4_updateStoreAuth', true);
        const newTab = GM_openInTab('https://store.steampowered.com/', { active: true, setParent: true });
        debug('打开Steam商店新标签页');
        // @ts-ignore
        newTab.name = 'ATv4_updateStoreAuth';
        const listenerId = GM_addValueChangeListener<auth | null>('steamStoreAuth', (key, oldValue, newValue) => {
          debug('监听到Steam商店身份验证值变化', { oldValue, newValue });
          GM_removeValueChangeListener(listenerId);
          GM_deleteValue('ATv4_updateStoreAuth');
          newTab?.close();
          window.focus();
          if (newValue && JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
            this.#auth.storeSessionID = newValue.storeSessionID;
            debug('Steam商店身份验证更新成功', { storeSessionID: newValue.storeSessionID });
            logStatus.success();
            resolve(true);
            return;
          }
          debug('Steam商店身份验证更新失败');
          logStatus.error('Failed');
          resolve(false);
        });
        newTab.onclose = () => {
          debug('Steam商店新标签页已关闭');
          GM_deleteValue('ATv4_updateStoreAuth');
        };
      });
    } catch (error) {
      debug('通过新标签页更新Steam商店身份验证时发生错误', { error });
      throwError(error as Error, 'SteamWeb.updateStoreAuthTab');
      return false;
    }
  }
  /**
   * 更新Steam社区身份验证信息。
   *
   * @private
   * @async
   * @function #updateCommunityAuthTab
   * @returns {Promise<boolean>} - 返回一个Promise，表示更新操作的结果。
   *                              - true: 更新成功
   *                              - false: 更新失败
   * @throws {Error} - 如果在更新过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数通过打开Steam社区的URL来更新身份验证信息。
   * 首先，记录更新状态。然后，删除之前存储的'steamCommunityAuth'值。
   * 打开一个新的浏览器标签页，并使用`GM_addValueChangeListener`监听'steamCommunityAuth'的值变化。
   * 如果新值与旧值不同且存在新值，则更新存储的`steam64Id`和`communitySessionID`，并记录成功信息。
   * 如果更新失败，则记录错误信息。
   * 最后，关闭新标签页并返回更新结果。
   */
  async #updateCommunityAuthTab(): Promise<boolean> {
    try {
      debug('开始通过新标签页更新Steam社区身份验证');
      const logStatus = echoLog({ text: __('updatingAuth', __('steamCommunityTab')), before: '[Web]' });
      return await new Promise((resolve) => {
        GM_deleteValue('steamCommunityAuth');
        GM_setValue('ATv4_updateCommunityAuth', true);
        const newTab = GM_openInTab('https://steamcommunity.com/my', { active: true, setParent: true });
        debug('打开Steam社区新标签页');
        // @ts-ignore
        newTab.name = 'ATv4_updateCommunityAuth';
        const listenerId = GM_addValueChangeListener<auth | null>('steamCommunityAuth', (key, oldValue, newValue) => {
          debug('监听到Steam社区身份验证值变化', { oldValue, newValue });
          GM_removeValueChangeListener(listenerId);
          GM_deleteValue('ATv4_updateCommunityAuth');
          newTab?.close();
          window.focus();
          if (newValue && JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
            this.#auth.steam64Id = newValue.steam64Id;
            this.#auth.communitySessionID = newValue.communitySessionID;
            debug('Steam社区身份验证更新成功', { steam64Id: newValue.steam64Id, communitySessionID: newValue.communitySessionID });
            logStatus.success();
            resolve(true);
            return;
          }
          debug('Steam社区身份验证更新失败');
          logStatus.error('Failed');
          resolve(false);
        });
        newTab.onclose = () => {
          debug('Steam社区新标签页已关闭');
          GM_deleteValue('ATv4_updateCommunityAuth');
        };
      });
    } catch (error) {
      debug('通过新标签页更新Steam社区身份验证时发生错误', { error });
      throwError(error as Error, 'SteamWeb.updateCommunityAuthTab');
      return false;
    }
  }

  /**
   * 获取Steam用户链接并更新Steam社区的身份验证信息。
   *
   * @async
   * @function #getUserLink
   * @param {boolean} [retry=false] - 是否为重试请求，默认为false。
   * @returns {Promise<boolean>} - 返回一个Promise，表示获取用户链接的结果。
   *                              - true: 获取成功并更新身份验证信息
   *                              - false: 获取失败或需要登录
   * @throws {Error} - 如果在获取过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数通过发送GET请求到Steam社区的URL来获取用户链接。
   * 如果请求成功且状态为200，函数会检查响应的最终URL是否需要登录。
   * 如果需要登录，则记录错误并返回false。
   * 如果成功获取到`steam64Id`和`communitySessionID`，则将其存储并返回true。
   * 如果状态为302，表示需要刷新令牌，函数会尝试刷新并重试获取用户链接。
   * 如果状态为301，函数会根据重定向的URL进行相应处理。
   * 如果请求失败或发生异常，函数会记录错误并返回false。
   */
  async #updateCommunityAuth(initStoreResult: boolean, retry = false): Promise<boolean> {
    try {
      debug('开始更新Steam社区身份验证');
      const logStatus = echoLog({ text: __('gettingUserInfo'), before: '[Web]' });
      const { result, statusText, status, data } = await httpRequest({
        url: 'https://steamcommunity.com/my',
        method: 'GET',
        headers: {
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          Host: 'steamcommunity.com',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate'
        },
        redirect: 'follow'
      });
      debug('收到Steam社区身份验证响应', { result, statusText, status });

      if (data?.status !== 200) {
        debug('Steam社区身份验证状态错误', { status: data?.status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data.finalUrl.includes('https://steamcommunity.com/login/home')) {
        if (initStoreResult) {
          if (await this.#refreshToken('steamCommunity')) {
            debug('Steam社区身份验证需要重试');
            logStatus.warning(__('retry'));
            if (retry) {
              debug('Steam社区身份验证重试次数超限');
              logStatus.error(`Error:${__('needLoginSteamCommunity')}`, true);
              return false;
            }
            return this.#updateCommunityAuth(initStoreResult, retry);
          }
        }
        debug('Steam社区身份验证失败：需要登录');
        logStatus.error(`Error:${__('needLoginSteamCommunity')}`, true);
        return false;
      }

      const steam64Id = data.responseText.match(/g_steamID = "(.+?)";/)?.[1];
      const communitySessionID = data.responseText.match(/g_sessionID = "(.+?)";/)?.[1];

      if (!steam64Id || !communitySessionID) {
        debug('Steam社区身份验证失败：获取身份信息失败');
        logStatus.error('Error: Get "sessionID" failed');
        return false;
      }

      this.#auth.steam64Id = steam64Id;
      this.#auth.communitySessionID = communitySessionID;
      debug('Steam社区身份验证更新成功', { steam64Id, communitySessionID });
      logStatus.success();
      return true;
    } catch (error) {
      debug('更新Steam社区身份验证时发生错误', { error });
      throwError(error as Error, 'SteamWeb.updateCommunityAuth');
      return false;
    }
  }

  /**
   * 获取当前购物车地区及可更换的地区（需自备梯子）。
   *
   * @async
   * @function #getAreaInfo
   * @returns {Promise<areas>} - 返回一个Promise，包含当前地区和可更换地区的信息。
   *                             - currentArea: 当前地区的国家代码
   *                             - areas: 可更换的地区列表
   * @throws {Error} - 如果在获取过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数通过发送GET请求到Steam购物车的URL来获取用户的地区信息。
   * 如果请求成功且状态为200，函数会解析响应中的购物车配置和用户信息。
   * 如果成功获取到用户的当前地区和可更换地区，则返回这些信息。
   * 如果在解析过程中发生错误，或没有找到可更换的地区，函数将记录错误并返回空对象。
   * 如果请求失败，函数将记录错误信息并返回空对象。
   */
  async #getAreaInfo(): Promise<areas> {
    try {
      debug('开始获取Steam地区信息');
      const logStatus = echoLog({ text: __('gettingAreaInfo'), before: '[Web]' });
      const { result, statusText, status, data } = await httpRequest({
        url: 'https://store.steampowered.com/cart/',
        method: 'GET'
      });
      debug('获取地区信息请求结果', { result, statusText, status });

      if (result !== 'Success' || data?.status !== 200) {
        debug('获取地区信息失败', { result, status: data?.status, statusText: data?.statusText });
        logStatus.error(result === 'Success' ? `Error:${data?.statusText}(${data?.status})` : `${result}:${statusText}(${status})`);
        return {};
      }

      const cartConfigRaw = data.responseText.match(/data-cart_config="(.*?)"/)?.[1];
      debug('cartConfigRaw提取结果', { cartConfigRaw });
      const temp = document.createElement('div');
      temp.innerHTML = cartConfigRaw || '{}';
      const cartConfigStr = temp.textContent || temp.innerText;
      let cartConfig;
      try {
        cartConfig = JSON.parse(cartConfigStr);
        debug('cartConfig解析成功', { cartConfig });
      } catch (error) {
        debug('cartConfig解析失败', { error });
        logStatus.error('Error: get country info filed');
        console.error(error);
        return {};
      }

      if (!cartConfig.rgUserCountryOptions) {
        debug('未找到可更换地区');
        logStatus.warning('Warning: Area cannot be changed');
        return {};
      }

      const userInfoRaw = data.responseText.match(/data-userinfo="(.*?)"/)?.[1];
      debug('userInfoRaw提取结果', { userInfoRaw });
      const temp1 = document.createElement('div');
      temp1.innerHTML = userInfoRaw || '{}';
      const userInfoStr = temp1.textContent || temp1.innerText;
      let userInfo;
      try {
        userInfo = JSON.parse(userInfoStr);
        debug('userInfo解析成功', { userInfo });
      } catch (error) {
        debug('userInfo解析失败', { error });
        logStatus.error('Error: get country info filed');
        console.error(error);
        return {};
      }

      const currentArea = userInfo.country_code;
      const areas = Object.keys(cartConfig.rgUserCountryOptions).filter((area) => area !== 'help');
      debug('地区信息提取', { currentArea, areas });

      if (!currentArea || areas.length === 0) {
        debug('未获取到当前地区或可更换地区为空', { currentArea, areas });
        logStatus.error('Error: get country info filed');
        return {};
      }

      this.#area = currentArea;
      debug('获取地区信息成功', { currentArea, areas });
      logStatus.success();
      return { currentArea, areas };
    } catch (error) {
      debug('获取地区信息时发生异常', { error });
      throwError(error as Error, 'SteamWeb.getAreaInfo');
      return {};
    }
  }

  /**
   * 更换Steam的地区。
   *
   * @async
   * @function #changeArea
   * @param {string} [area] - 目标地区的代码，如果未提供，则自动获取可用地区。
   * @returns {Promise<boolean | string>} - 返回一个Promise，表示更换地区的结果。
   *                                        - true: 当前地区已是目标地区
   *                                        - 'skip': 当前地区不需要更换
   *                                        - false: 更换地区失败
   *                                        - string: 更换成功后返回当前地区代码
   * @throws {Error} - 如果在更换过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数用于更换Steam的地区设置。首先检查当前地区状态，如果状态为'waiting'，则等待状态改变。
   * 如果当前地区已是目标地区，或者未指定目标地区且当前地区不是中国，则直接返回true。
   * 如果未指定目标地区，则调用`#getAreaInfo`获取当前地区和可用地区的信息。
   * 如果当前地区不是中国，则记录状态为'skip'并返回'skip'。
   * 如果没有可用的其他地区，则记录状态为'noAnotherArea'并返回false。
   * 如果目标地区有效，则发送POST请求以更换地区。
   * 如果请求成功且状态为200，则检查当前地区是否已更换为目标地区。
   * 如果更换成功，记录状态为'success'并返回当前地区；否则记录错误并返回'CN'。
   * 如果请求失败，记录错误信息并返回'CN'。
   */
  async #changeArea(area?: string): Promise<boolean | string> {
    try {
      debug('开始更换Steam地区', { area });
      if (this.#areaStatus === 'waiting') {
        debug('当前地区状态为waiting，等待状态改变');
        await new Promise((resolve) => {
          const checker = setInterval(() => {
            if (this.#areaStatus !== 'waiting') {
              clearInterval(checker);
              resolve(true);
            }
          });
        });
      }

      if (this.#area === area || (!area && this.#area !== 'CN')) {
        debug('无需更换地区', { currentArea: this.#area, targetArea: area });
        return true;
      }

      this.#areaStatus = 'waiting';
      let aimedArea = area;

      if (!aimedArea) {
        debug('未指定目标地区，自动获取可用地区');
        const { currentArea, areas } = await this.#getAreaInfo();
        debug('获取到地区信息', { currentArea, areas });
        if (!currentArea || !areas) {
          debug('获取地区信息失败', { currentArea, areas });
          this.#areaStatus = 'error';
          return false;
        }

        if (currentArea !== 'CN') {
          debug('当前地区不是CN，无需更换', { currentArea });
          this.#areaStatus = 'skip';
          echoLog({ text: __('notNeededChangeArea'), before: '[Web]' });
          return 'skip';
        }

        const anotherArea = areas.filter((area) => area && area !== 'CN');
        debug('可更换的其他地区', { anotherArea });
        if (!anotherArea || anotherArea.length === 0) {
          debug('没有可用的其他地区');
          this.#areaStatus = 'noAnotherArea';
          echoLog({ text: __('noAnotherArea'), before: '[Web]' });
          return false;
        }

        [aimedArea] = anotherArea;
        debug('选定目标地区', { aimedArea });
      }

      const logStatus = echoLog({ text: __('changingArea', aimedArea), before: '[Web]' });
      debug('发送更换地区请求', { aimedArea });
      const { result, statusText, status, data } = await httpRequest({
        url: 'https://store.steampowered.com/country/setcountry',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        data: $.param({ cc: aimedArea, sessionid: this.#auth.storeSessionID })
      });
      debug('更换地区请求结果', { result, statusText, status });

      if (result !== 'Success' || data?.status !== 200 || data.responseText !== 'true') {
        debug('更换地区失败', { result, status: data?.status, statusText: data?.statusText, responseText: data?.responseText });
        this.#areaStatus = 'error';
        logStatus.error(result === 'Success' ? `Error:${data?.statusText}(${data?.status})` : `${result}:${statusText}(${status})`);
        return 'CN';
      }

      const { currentArea } = await this.#getAreaInfo();
      debug('更换后获取到的当前地区', { currentArea });
      if (currentArea) {
        this.#area = currentArea;
        if (!this.#oldArea) {
          this.#oldArea = currentArea;
        }
      }

      if (currentArea !== aimedArea) {
        debug('更换后当前地区与目标地区不符', { currentArea, aimedArea });
        this.#areaStatus = 'error';
        logStatus.error('Error: change country filed');
        return 'CN';
      }

      this.#areaStatus = 'success';
      debug('更换地区成功', { currentArea });
      logStatus.success();
      return currentArea;
    } catch (error) {
      debug('更换地区时发生异常', { error });
      this.#areaStatus = 'error';
      throwError(error as Error, 'SteamWeb.changeArea');
      return false;
    }
  }

  /**
   * 加入指定的Steam组。
   *
   * @async
   * @function joinGroup
   * @param {string} groupName - 要加入的Steam组的名称。
   * @returns {Promise<boolean>} - 返回一个Promise，表示加入操作的结果。
   *                              - true: 加入成功
   *                              - false: 加入失败
   * @throws {Error} - 如果在加入过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数首先检查是否存在ASF实例。如果存在，则调用ASF的`joinGroup`方法尝试加入组。
   * 如果加入成功，则将组名添加到任务列表中并返回true。
   * 如果ASF不存在，则记录加入组的状态，并发送POST请求到Steam社区的组URL。
   * 如果请求成功且返回结果为'Success'，则进一步检查响应状态。
   * 如果状态为200且响应文本不包含'grouppage_join_area'，则记录成功信息并返回true。
   * 如果请求失败或返回的结果不为'Success'，则记录错误信息并返回false。
   */
  async joinGroup(groupName: string): Promise<boolean> {
    try {
      debug('开始加入Steam组', { groupName });
      const logStatus = echoLog({ type: 'joiningSteamGroup', text: groupName, before: '[Web]' });
      const { result, statusText, status, data } = await httpRequest({
        url: `https://steamcommunity.com/groups/${groupName}`,
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        data: $.param({ action: 'join', sessionID: this.#auth.communitySessionID })
      });

      if (result !== 'Success') {
        debug('加入Steam组请求失败', { result });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status !== 200 || data.responseText.includes('grouppage_join_area')) {
        debug('加入Steam组失败', { status: data?.status });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      debug('成功加入Steam组', { groupName });
      logStatus.success();
      return true;
    } catch (error) {
      debug('加入Steam组时发生错误', { error, groupName });
      throwError(error as Error, 'SteamWeb.joinGroup');
      return false;
    }
  }

  /**
   * 退出指定的Steam组。
   *
   * @async
   * @function leaveGroup
   * @param {string} groupName - 要退出的Steam组的名称。
   * @returns {Promise<boolean>} - 返回一个Promise，表示退出操作的结果。
   *                              - true: 退出成功
   *                              - false: 退出失败
   * @throws {Error} - 如果在退出过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数首先检查要退出的组是否在白名单中。如果在白名单中，直接返回true。
   * 如果存在ASF实例，则调用ASF的`leaveGroup`方法尝试退出组。
   * 如果ASF不存在，则调用`#getGroupId`方法获取组ID。
   * 如果获取组ID失败，则返回false。
   * 然后，发送POST请求到Steam社区的URL以执行退出操作。
   * 如果请求成功且返回结果为'Success'，则进一步检查响应状态。
   * 如果状态为200且响应文本中不再包含该组的链接，则记录成功信息并返回true。
   * 如果请求失败或返回的结果不为'Success'，则记录错误信息并返回false。
   */
  async leaveGroup(groupName: string): Promise<boolean> {
    try {
      debug('开始退出Steam组', { groupName });
      const groupId = await this.#getGroupId(groupName);
      if (!groupId) return false;

      const logStatus = echoLog({ type: 'leavingSteamGroup', text: groupName, before: '[Web]' });
      const { result, statusText, status, data } = await httpRequest({
        url: `https://steamcommunity.com/profiles/${this.#auth.steam64Id}/home_process`,
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        data: $.param({ sessionID: this.#auth.communitySessionID, action: 'leaveGroup', groupId })
      });

      if (result !== 'Success') {
        debug('退出Steam组请求失败', { result });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status !== 200 || !data.finalUrl.includes('groups')) {
        debug('退出Steam组失败', { status: data?.status });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      const hasGroupLink = $(data.responseText.replace(/<img.*?>/g, '').toLowerCase())
        .find(`a[href='https://steamcommunity.com/groups/${groupName.toLowerCase()}']`).length > 0;

      if (hasGroupLink) {
        debug('Error: Group link still exists');
        return false;
      }

      debug('成功退出Steam组', { groupName });
      logStatus.success();
      return true;
    } catch (error) {
      debug('退出Steam组时发生错误', { error, groupName });
      throwError(error as Error, 'SteamWeb.leaveGroup');
      return false;
    }
  }

  /**
   * 获取指定Steam组的ID。
   *
   * @async
   * @function #getGroupId
   * @param {string} groupName - 要获取ID的Steam组名称。
   * @returns {Promise<false | string>} - 返回一个Promise，表示获取操作的结果。
   *                                      - false: 获取失败
   *                                      - string: 获取成功，返回组ID
   * @throws {Error} - 如果在获取过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数首先检查缓存中是否存在指定组的ID。如果存在，则直接返回该ID并记录成功状态。
   * 如果缓存中不存在，则发送GET请求到Steam社区的组页面以获取组的ID。
   * 如果请求成功且返回结果为'Success'，则进一步检查响应状态。
   * 如果状态为200，函数会从响应文本中提取组ID，并将其存储到缓存中。
   * 如果成功获取到组ID，则记录成功信息并返回该ID。
   * 如果请求失败或返回的结果不为'Success'，则记录错误信息并返回false。
   */
  async #getGroupId(groupName: string): Promise<false | string> {
    try {
      debug('开始获取Steam组ID', { groupName });
      const logStatus = echoLog({ type: 'gettingSteamGroupId', text: groupName, before: '[Web]' });
      const cachedGroupId = this.#cache.group[groupName];
      if (cachedGroupId) {
        debug('从缓存中获取到组ID', { groupName, cachedGroupId });
        logStatus.success();
        return cachedGroupId;
      }

      const { result, statusText, status, data } = await httpRequest({
        url: `https://steamcommunity.com/groups/${groupName}`,
        method: 'GET',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
      });
      debug('获取组ID请求结果', { result, statusText, status });

      if (result !== 'Success') {
        debug('获取组ID请求失败', { result });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status !== 200) {
        debug('获取组ID响应状态错误', { status: data?.status, statusText: data?.statusText });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      const matchedGroupId = data.responseText.match(/OpenGroupChat\( '([0-9]+)'/)?.[1];
      debug('正则提取组ID结果', { matchedGroupId });
      if (!matchedGroupId) {
        debug('未能提取到组ID', { groupName });
        logStatus.error(`Error:${data.statusText}(${data.status})`);
        return false;
      }

      this.#setCache('group', groupName, matchedGroupId);
      debug('组ID已缓存', { groupName, matchedGroupId });
      logStatus.success();
      return matchedGroupId;
    } catch (error) {
      debug('获取组ID时发生异常', { error, groupName });
      throwError(error as Error, 'SteamWeb.getGroupID');
      return false;
    }
  }

  /**
   * 加入指定的Steam官方组。
   *
   * @async
   * @function joinOfficialGroup
   * @param {string} gameId - 要加入的Steam游戏的ID。
   * @returns {Promise<boolean>} - 返回一个Promise，表示加入操作的结果。
   *                              - true: 加入成功
   *                              - false: 加入失败
   * @throws {Error} - 如果在加入过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数用于加入指定的Steam官方组。如果存在ASF实例，则调用ASF的`joinGroup`方法尝试加入组。
   * 如果加入成功，则将组ID添加到任务列表中并返回true。
   * 如果ASF不存在，则记录加入组的状态，并发送GET请求到Steam社区的组URL。
   * 如果请求成功且返回结果为'Success'，则进一步检查响应状态。
   * 如果状态为200且响应文本不包含'id="publicGroupJoin"'，则记录成功信息并返回true。
   * 如果请求失败或返回的结果不为'Success'，则记录错误信息并返回false。
   */
  async joinOfficialGroup(gameId: string): Promise<boolean> {
    try {
      debug('开始加入Steam官方组', { gameId });
      const logStatus = echoLog({ type: 'joiningSteamOfficialGroup', text: gameId, before: '[Web]' });
      const { result, statusText, status, data } = await httpRequest({
        url: `https://steamcommunity.com/games/${gameId}?action=join&sessionID=${this.#auth.communitySessionID}`,
        method: 'GET',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
      });

      if (result !== 'Success') {
        debug('加入Steam官方组请求失败', { result });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status !== 200 || data.responseText.includes('id="publicGroupJoin"')) {
        debug('加入Steam官方组失败', { status: data?.status });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      const groupId = data.responseText.match(/steam:\/\/friends\/joinchat\/([0-9]+)/)?.[1];
      if (groupId) {
        this.#setCache('officialGroup', gameId, groupId);
      }

      debug('成功加入Steam官方组', { gameId });
      logStatus.success();
      return true;
    } catch (error) {
      debug('加入Steam官方组时发生错误', { error, gameId });
      throwError(error as Error, 'SteamWeb.joinOfficialGroup');
      return false;
    }
  }

  /**
   * 退出指定的Steam官方组。
   *
   * @async
   * @function leaveOfficialGroup
   * @param {string} gameId - 要退出的Steam游戏的ID。
   * @returns {Promise<boolean>} - 返回一个Promise，表示退出操作的结果。
   *                              - true: 退出成功
   *                              - false: 退出失败
   * @throws {Error} - 如果在退出过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数用于退出指定的Steam官方组。首先检查该组是否在白名单中，如果在，则直接返回true。
   * 如果存在ASF实例，则调用ASF的`leaveGroup`方法尝试退出组。
   * 如果ASF不存在，则调用`#getOfficialGroupId`方法获取组的ID。
   * 如果获取组ID失败，则返回false。
   * 然后，发送POST请求到Steam社区的URL以执行退出操作。
   * 如果请求成功且返回结果为'Success'，则进一步检查响应状态。
   * 如果状态为200且响应文本中不再包含该组的链接，则记录成功信息并返回true。
   * 如果请求失败或返回的结果不为'Success'，则记录错误信息并返回false。
   */
  async leaveOfficialGroup(gameId: string): Promise<boolean> {
    try {
      debug('开始退出Steam官方组', { gameId });
      const groupId = await this.#getOfficialGroupId(gameId);
      if (!groupId) return false;

      const logStatus = echoLog({ type: 'leavingSteamOfficialGroup', text: gameId, before: '[Web]' });
      const { result, statusText, status, data } = await httpRequest({
        url: `https://steamcommunity.com/profiles/${this.#auth.steam64Id}/home_process`,
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        data: $.param({ sessionID: this.#auth.communitySessionID, action: 'leaveGroup', groupId })
      });

      if (result !== 'Success') {
        debug('退出Steam官方组请求失败', { result });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status !== 200) {
        debug('退出Steam官方组失败', { status: data?.status });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      const { result: resultR, statusText: statusTextR, status: statusR, data: dataR } = await httpRequest({
        url: `https://steamcommunity.com/games/${gameId}`,
        method: 'GET',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
      });

      if (resultR !== 'Success') {
        debug('退出Steam官方组时发生错误', { error: resultR, status: statusR, statusText: statusTextR });
        logStatus.error(`${resultR}:${statusTextR}(${statusR})`);
        return false;
      }

      if (dataR?.status !== 200 || !dataR.responseText.includes('id="publicGroupJoin"')) {
        debug('退出Steam官方组失败', { status: dataR?.status });
        logStatus.error(`Error:${dataR?.statusText}(${dataR?.status})`);
        return false;
      }

      debug('成功退出Steam官方组', { gameId });
      logStatus.success();
      return true;
    } catch (error) {
      debug('退出Steam官方组时发生错误', { error, gameId });
      throwError(error as Error, 'SteamWeb.leaveOfficialGroup');
      return false;
    }
  }

  /**
   * 获取指定Steam游戏的官方组ID。
   *
   * @async
   * @function #getOfficialGroupId
   * @param {string} gameId - Steam游戏的ID。
   * @returns {Promise<false | string>} - 返回一个Promise，表示获取操作的结果。
   *                                      - false: 获取失败
   *                                      - string: 获取成功，返回组ID
   * @throws {Error} - 如果在获取过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数用于将Steam游戏ID转换为对应的官方组ID，以便于退出官方组。
   * 首先，检查缓存中是否存在该游戏的组ID。如果存在，则直接返回该ID并记录成功状态。
   * 如果缓存中不存在，则发送GET请求到Steam社区的游戏页面以获取组ID。
   * 如果请求成功且返回结果为'Success'，则进一步检查响应状态。
   * 如果状态为200，函数会从响应文本中提取组ID，并将其存储到缓存中。
   * 如果成功获取到组ID，则记录成功信息并返回该ID。
   * 如果请求失败或返回的结果不为'Success'，则记录错误信息并返回false。
   */
  async #getOfficialGroupId(gameId: string): Promise<false | string> {
    try {
      debug('开始获取Steam官方群组ID', { gameId });
      const logStatus = echoLog({ type: 'gettingSteamOfficialGroupId', text: gameId, before: '[Web]' });
      const cachedGroupId = this.#cache.officialGroup[gameId];
      if (cachedGroupId) {
        debug('从缓存中获取到官方群组ID', { gameId, cachedGroupId });
        logStatus.success();
        return cachedGroupId;
      }

      const { result, statusText, status, data } = await httpRequest({
        url: `https://steamcommunity.com/games/${gameId}`,
        method: 'GET',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
      });
      debug('获取官方群组ID请求结果', { result, statusText, status });

      if (result !== 'Success') {
        debug('获取官方群组ID请求失败', { result });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status !== 200) {
        debug('获取官方群组ID响应状态错误', { status: data?.status, statusText: data?.statusText });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      const matchedGroupId = data.responseText.match(/steam:\/\/friends\/joinchat\/([0-9]+)/)?.[1];
      debug('正则提取官方群组ID结果', { matchedGroupId });
      if (!matchedGroupId) {
        debug('未能提取到官方群组ID', { gameId });
        logStatus.error(`Error:${data.statusText}(${data.status})`);
        return false;
      }

      this.#setCache('officialGroup', gameId, matchedGroupId);
      debug('官方群组ID已缓存', { gameId, matchedGroupId });
      logStatus.success();
      return matchedGroupId;
    } catch (error) {
      debug('获取官方群组ID时发生异常', { error, gameId });
      throwError(error as Error, 'SteamWeb.getGroupID');
      return false;
    }
  }

  /**
   * 将指定的游戏添加到Steam的愿望单。
   *
   * @async
   * @function addToWishlist
   * @param {string} gameId - Steam游戏的AppId。
   * @returns {Promise<boolean>} - 返回一个Promise，表示添加操作的结果。
   *                              - true: 添加成功
   *                              - false: 添加失败
   * @throws {Error} - 如果在添加过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数用于将指定的游戏添加到Steam的愿望单。
   * 如果存在ASF实例，则调用ASF的`addToWishlist`方法尝试添加游戏。
   * 如果添加成功，则将游戏ID添加到任务列表中并返回true。
   * 如果ASF不存在，则发送POST请求到Steam的API以添加游戏到愿望单。
   * 如果请求成功且返回结果为'Success'，并且状态为200且响应中表示添加成功，则记录成功信息并返回true。
   * 如果请求失败或返回的结果不为'Success'，则记录错误信息并返回false。
   * 如果在添加过程中发生错误，函数将捕获异常并记录错误信息。
   */
  async addToWishlist(gameId: string): Promise<boolean> {
    try {
      debug('开始添加游戏到愿望单', { gameId });
      const logStatus = echoLog({ type: 'addingToWishlist', text: gameId, before: '[Web]' });
      const { result, data } = await httpRequest({
        url: 'https://store.steampowered.com/api/addtowishlist',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        data: $.param({ sessionid: this.#auth.storeSessionID, appid: gameId }),
        dataType: 'json'
      });

      if (result === 'Success' && data?.status === 200 && data.response?.success === true) {
        debug('成功添加游戏到愿望单', { gameId });
        logStatus.success();
        return true;
      }

      const { result: resultR, statusText: statusTextR, status: statusR, data: dataR } = await httpRequest({
        url: `https://store.steampowered.com/app/${gameId}`,
        method: 'GET'
      });

      if (resultR !== 'Success') {
        debug('添加游戏到愿望单请求失败', { result: resultR, status: statusR, statusText: statusTextR });
        logStatus.error(`${resultR}:${statusTextR}(${statusR})`);
        return false;
      }

      if (dataR?.status !== 200) {
        debug('添加游戏到愿望单失败', { status: dataR?.status });
        logStatus.error(`Error:${dataR?.statusText}(${dataR?.status})`);
        return false;
      }

      if (this.#area === 'CN' && dataR.responseText.includes('id="error_box"')) {
        debug('changeAreaNotice');
        if (!(await this.#changeArea())) return false;
        return await this.addToWishlist(gameId);
      }

      if (dataR.responseText.includes('class="queue_actions_ctn"') && dataR.responseText.includes('class="already_in_library"')) {
        debug('成功添加游戏到愿望单', { gameId });
        logStatus.success();
        return true;
      }

      if ((dataR.responseText.includes('class="queue_actions_ctn"') &&
        dataR.responseText.includes('id="add_to_wishlist_area_success" style="display: none;')) ||
        !dataR.responseText.includes('class="queue_actions_ctn"')) {
        debug('添加游戏到愿望单失败', { status: dataR.statusText });
        logStatus.error(`Error:${dataR.statusText}(${dataR.status})`);
        return false;
      }

      debug('成功添加游戏到愿望单', { gameId });
      logStatus.success();
      return true;
    } catch (error) {
      debug('添加游戏到愿望单时发生错误', { error, gameId });
      throwError(error as Error, 'SteamWeb.addToWishlist');
      return false;
    }
  }

  /**
   * 从Steam愿望单移除游戏。
   *
   * @async
   * @function removeFromWishlist
   * @param {string} gameId - Steam游戏的AppId。
   * @returns {Promise<boolean>} - 返回一个Promise，表示移除操作的结果。
   *                              - true: 移除成功
   *                              - false: 移除失败
   * @throws {Error} - 如果在移除过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数用于从Steam的愿望单中移除指定的游戏。
   * 首先检查游戏ID是否在白名单中，如果在，则直接返回true。
   * 如果存在ASF实例，则调用ASF的`removeFromWishlist`方法尝试移除游戏。
   * 如果ASF不存在，则发送POST请求到Steam的API以移除游戏。
   * 如果请求成功且返回结果为'Success'，并且状态为200且响应中表示移除成功，则记录成功信息并返回true。
   * 如果请求失败，函数会检查响应状态并根据需要进行地区更换。
   * 如果在移除过程中发生错误，函数将捕获异常并记录错误信息。
   */
  async removeFromWishlist(gameId: string): Promise<boolean> {
    try {
      debug('开始从愿望单移除游戏', { gameId });
      const logStatus = echoLog({ type: 'removingFromWishlist', text: gameId, before: '[Web]' });
      const { result, data } = await httpRequest({
        url: 'https://store.steampowered.com/api/removefromwishlist',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        data: $.param({ sessionid: this.#auth.storeSessionID, appid: gameId }),
        dataType: 'json'
      });

      if (result === 'Success' && data?.status === 200 && data.response?.success === true) {
        debug('成功从愿望单移除游戏', { gameId });
        logStatus.success();
        return true;
      }

      const { result: resultR, statusText: statusTextR, status: statusR, data: dataR } = await httpRequest({
        url: `https://store.steampowered.com/app/${gameId}`,
        method: 'GET'
      });

      if (resultR !== 'Success') {
        debug('从愿望单移除游戏请求失败', { result: resultR, status: statusR, statusText: statusTextR });
        logStatus.error(`${resultR}:${statusTextR}(${statusR})`);
        return false;
      }

      if (dataR?.status !== 200) {
        debug('从愿望单移除游戏失败', { status: dataR?.status });
        logStatus.error(`Error:${dataR?.statusText}(${dataR?.status})`);
        return false;
      }

      if (this.#area === 'CN' && dataR.responseText.includes('id="error_box"')) {
        debug('changeAreaNotice');
        const result = await this.#changeArea();
        if (!result || result === 'CN' || result === 'skip') return false;
        return await this.removeFromWishlist(gameId);
      }

      if (dataR.responseText.includes('class="queue_actions_ctn"') &&
        (dataR.responseText.includes('ds_owned_flag ds_flag') || dataR.responseText.includes('add_to_wishlist_area'))) {
        debug('成功从愿望单移除游戏', { gameId });
        logStatus.success();
        return true;
      }

      debug('从愿望单移除游戏请求失败', { result: resultR, status: statusR, statusText: statusTextR });
      logStatus.error(`Error:${dataR.statusText}(${dataR.status})`);
      return false;
    } catch (error) {
      debug('从愿望单移除游戏时发生错误', { error, gameId });
      throwError(error as Error, 'SteamWeb.removeFromWishlist');
      return false;
    }
  }

  /**
   * 关注或取关指定的Steam游戏。
   *
   * @async
   * @function toggleFollowGame
   * @param {string} gameId - Steam游戏的AppId。
   * @param {boolean} doTask - true表示关注游戏，false表示取关游戏。
   * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
   *                              - true: 操作成功
   *                              - false: 操作失败
   * @throws {Error} - 如果在操作过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数用于关注或取关指定的Steam游戏。
   * 首先检查是否需要取关，如果游戏ID在白名单中，则直接返回true。
   * 如果存在ASF实例，则调用ASF的`toggleFollowGame`方法进行操作。
   * 如果操作成功，则更新任务列表并返回true。
   * 如果ASF不存在，则构建请求数据并发送POST请求到Steam的关注游戏接口。
   * 如果请求成功且返回结果为'Success'，并且状态为200且响应文本为'true'，则记录成功信息并返回true。
   * 如果请求失败，函数会检查当前地区是否被锁定，并根据需要进行地区更换。
   * 如果操作失败，记录错误信息并返回false。
   */
  async toggleFollowGame(gameId: string, doTask: boolean): Promise<boolean> {
    try {
      debug('开始处理游戏关注状态', { gameId, doTask });
      const logStatus = echoLog({ type: `${doTask ? '' : 'un'}followingGame`, text: gameId, before: '[Web]' });
      const requestData: followGameRequestData = { sessionid: this.#auth.storeSessionID as string, appid: gameId };
      if (!doTask) requestData.unfollow = '1';

      const { result, data } = await httpRequest({
        url: 'https://store.steampowered.com/explore/followgame/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: $.param(requestData)
      });

      if (result === 'Success' && data?.status === 200 && data.responseText === 'true') {
        debug('成功处理游戏关注状态', { gameId, doTask });
        logStatus.success();
        return true;
      }

      const followed = await this.#isFollowedGame(gameId);
      if (this.#area === 'CN' && followed === 'areaLocked') {
        debug('changeAreaNotice');
        if (!(await this.#changeArea())) return false;
        return await this.toggleFollowGame(gameId, doTask);
      }

      if (doTask === followed) {
        debug('成功处理游戏关注状态', { gameId, doTask });
        logStatus.success();
        return true;
      }

      debug('处理游戏关注状态请求失败', { result });
      logStatus.error(`Error:${data?.statusText}(${data?.status})`);
      return false;
    } catch (error) {
      debug('处理游戏关注状态时发生错误', { error, gameId, doTask });
      throwError(error as Error, 'SteamWeb.toggleFollowGame');
      return false;
    }
  }

  /**
   * 判断指定的Steam游戏是否已被关注。
   *
   * @async
   * @function #isFollowedGame
   * @param {string} gameId - Steam游戏的AppId。
   * @returns {Promise<boolean | 'areaLocked'>} - 返回一个Promise，表示关注状态。
   *                                               - true: 已关注
   *                                               - 'areaLocked': 游戏因地区限制被锁定
   *                                               - false: 未关注
   * @throws {Error} - 如果在判断过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数通过发送GET请求到Steam游戏的页面来判断游戏是否已被关注。
   * 如果请求成功且状态为200，函数会检查当前地区是否为中国，并判断响应文本中是否包含错误信息。
   * 如果游戏因地区限制被锁定，则返回'areaLocked'。
   * 如果游戏的关注按钮处于活动状态，则返回true，表示已关注。
   * 如果游戏未被关注，则返回false。
   * 如果请求失败或发生异常，函数将记录错误并返回false。
   */
  async #isFollowedGame(gameId: string): Promise<boolean | 'areaLocked'> {
    try {
      debug('开始判断Steam游戏是否已关注', { gameId });
      const { result, data } = await httpRequest({
        url: `https://store.steampowered.com/app/${gameId}`,
        method: 'GET'
      });
      debug('获取游戏页面请求结果', { result, status: data?.status });

      if (result !== 'Success') {
        debug('请求失败', { result });
        return false;
      }

      if (data?.status !== 200) {
        debug('响应状态错误', { status: data?.status });
        return false;
      }

      if (this.#area === 'CN' && data.responseText.includes('id="error_box"')) {
        debug('地区锁定，返回areaLocked', { area: this.#area });
        return 'areaLocked';
      }

      const isFollowed = $(data.responseText.replace(/<img.*?>/g, ''))
        .find('.queue_control_button.queue_btn_follow>.btnv6_blue_hoverfade.btn_medium.queue_btn_active')
        .css('display') !== 'none';
      debug('关注状态判断结果', { isFollowed });

      return isFollowed;
    } catch (error) {
      debug('判断游戏关注状态时发生异常', { error, gameId });
      throwError(error as Error, 'SteamWeb.isFollowedGame');
      return false;
    }
  }

  /**
   * 订阅或取消订阅Steam论坛。
   *
   * @async
   * @function toggleForum
   * @param {string} gameId - Steam游戏的AppId。
   * @param {boolean} [doTask=true] - true表示订阅论坛，false表示取消订阅论坛。
   * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
   *                              - true: 操作成功
   *                              - false: 操作失败
   * @throws {Error} - 如果在操作过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数用于订阅或取消订阅指定Steam游戏的论坛。
   * 如果doTask为false且游戏ID在白名单中，则直接返回true。
   * 函数首先调用`#getForumId`获取论坛ID，如果未获取到ID，则返回false。
   * 然后，构建请求并发送POST请求到Steam论坛的订阅接口。
   * 如果请求成功且返回结果为'Success'，并且状态为200且响应中表示操作成功，则记录成功信息并返回true。
   * 如果请求失败或返回的结果不为'Success'，则记录错误信息并返回false。
   * 如果在操作过程中发生错误，函数将捕获异常并记录错误信息。
   */
  async toggleForum(gameId: string, doTask = true): Promise<boolean> {
    try {
      debug('开始处理论坛订阅状态', { gameId, doTask });
      const forumId = await this.#getForumId(gameId);
      if (!forumId) return false;

      const logStatus = echoLog({ type: `${doTask ? '' : 'un'}subscribingForum`, text: gameId, before: '[Web]' });
      const [id, feature] = forumId.split('_');
      const { result, statusText, status, data } = await httpRequest({
        url: `https://steamcommunity.com/forum/${id}/General/${doTask ? '' : 'un'}subscribe/${feature || '0'}/`,
        method: 'POST',
        responseType: 'json',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        data: $.param({ sessionid: this.#auth.communitySessionID })
      });

      if (result !== 'Success') {
        debug('处理论坛订阅状态请求失败', { result });
        logStatus.error(`${result}:${statusText}(${status})`);
        return true;
      }

      if (data?.status !== 200 || (data.response?.success !== 1 && data.response?.success !== 29)) {
        debug('处理论坛订阅状态失败', { status: data?.status });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return true;
      }

      debug('成功处理论坛订阅状态', { gameId, doTask });
      logStatus.success();
      return true;
    } catch (error) {
      debug('处理论坛订阅状态时发生错误', { error, gameId, doTask });
      throwError(error as Error, 'SteamWeb.toggleForum');
      return false;
    }
  }

  /**
   * 获取指定Steam游戏的论坛ID。
   *
   * @async
   * @function #getForumId
   * @param {string} gameId - Steam游戏的AppId。
   * @returns {Promise<false | string>} - 返回一个Promise，表示获取操作的结果。
   *                                      - false: 获取失败
   *                                      - string: 获取成功，返回论坛ID
   * @throws {Error} - 如果在获取过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数用于将Steam游戏的AppId转换为对应的论坛ID。
   * 首先检查缓存中是否存在该游戏的论坛ID。如果存在，则直接返回该ID并记录成功状态。
   * 如果缓存中不存在，则发送GET请求到Steam社区的讨论页面以获取论坛ID。
   * 如果请求成功且返回结果为'Success'，则进一步检查响应状态。
   * 如果状态为200，函数会从响应文本中提取论坛ID，并将其存储到缓存中。
   * 如果成功获取到论坛ID，则记录成功信息并返回该ID。
   * 如果请求失败或返回的结果不为'Success'，则记录错误信息并返回false。
   */
  async #getForumId(gameId: string): Promise<false | string> {
    try {
      debug('开始获取Steam论坛ID', { gameId });
      const logStatus = echoLog({ type: 'gettingForumId', text: gameId, before: '[Web]' });
      const cachedForumId = this.#cache.forum[gameId];
      if (cachedForumId) {
        debug('从缓存中获取到论坛ID', { gameId, cachedForumId });
        logStatus.success();
        return cachedForumId;
      }

      const { result, statusText, status, data } = await httpRequest({
        url: `https://steamcommunity.com/app/${gameId}/discussions/`,
        method: 'GET'
      });
      debug('获取论坛ID请求结果', { result, statusText, status });

      if (result !== 'Success') {
        debug('获取论坛ID请求失败', { result });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status !== 200) {
        debug('获取论坛ID响应状态错误', { status: data?.status, statusText: data?.statusText });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      const matchedForumId = data.responseText?.match(/General_([\d]+(_[\d]+)?)/)?.[1];
      debug('正则提取论坛ID结果', { matchedForumId });
      if (!matchedForumId) {
        debug('未能提取到论坛ID', { gameId });
        logStatus.error(`Error:${data.statusText}(${data.status})`);
        return false;
      }

      this.#setCache('forum', gameId, matchedForumId);
      debug('论坛ID已缓存', { gameId, matchedForumId });
      logStatus.success();
      return matchedForumId;
    } catch (error) {
      debug('获取论坛ID时发生异常', { error, gameId });
      throwError(error as Error, 'SteamWeb.getForumId');
      return false;
    }
  }

  /**
   * 收藏或取消收藏指定的Steam创意工坊物品。
   *
   * @async
   * @function toggleFavoriteWorkshop
   * @param {string} id - 创意工坊物品的ID。
   * @param {boolean} [doTask=true] - true表示收藏物品，false表示取消收藏物品。
   * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
   *                              - true: 操作成功
   *                              - false: 操作失败
   * @throws {Error} - 如果在操作过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数用于收藏或取消收藏指定的Steam创意工坊物品。
   * 首先检查是否需要执行操作，如果不需要且物品ID在白名单中，则直接返回true。
   * 然后获取创意工坊物品的应用ID，如果未获取到ID，则返回false。
   * 根据操作类型构建请求并发送POST请求到Steam社区的收藏接口。
   * 如果请求成功且返回结果为'Success'，并且状态为200且响应中没有错误信息，则记录成功信息并返回true。
   * 如果请求失败或返回的结果不为'Success'，则记录错误信息并返回false。
   * 如果在操作过程中发生错误，函数将捕获异常并记录错误信息。
   */
  async toggleFavoriteWorkshop(id: string, doTask = true): Promise<boolean> {
    try {
      debug('开始处理创意工坊收藏状态', { id, doTask });
      const appid = await this.#getWorkshopAppId(id);
      if (!appid) return false;

      const logStatus = echoLog({ type: doTask ? 'favoritingWorkshop' : 'unfavoritingWorkshop', text: id, before: '[Web]' });
      const { result, statusText, status, data } = await httpRequest({
        url: `https://steamcommunity.com/sharedfiles/${doTask ? '' : 'un'}favorite`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: $.param({ id, appid, sessionid: this.#auth.communitySessionID })
      });

      if (result !== 'Success') {
        debug('处理创意工坊收藏状态请求失败', { result });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status !== 200 || data.responseText) {
        debug('处理创意工坊收藏状态失败', { status: data?.status });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      debug('成功处理创意工坊收藏状态', { id, doTask });
      logStatus.success();
      return true;
    } catch (error) {
      debug('处理创意工坊收藏状态时发生错误', { error, id, doTask });
      throwError(error as Error, 'SteamWeb.toggleFavoriteWorkshop');
      return false;
    }
  }

  /**
   * 获取创意工坊物品的AppId。
   *
   * @async
   * @function #getWorkshopAppId
   * @param {string} id - 创意工坊物品的ID。
   * @returns {Promise<false | string>} - 返回一个Promise，表示获取操作的结果。
   *                                      - string: 获取成功，返回AppId
   *                                      - false: 获取失败
   * @throws {Error} - 如果在获取过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数通过发送GET请求到Steam创意工坊的URL来获取指定物品的AppId。
   * 首先，记录获取状态并检查缓存中是否存在该物品的AppId。
   * 如果缓存中存在，则直接返回该AppId并记录成功状态。
   * 如果缓存中不存在，则发送HTTP请求获取物品的详细信息。
   * 如果请求成功且状态为200，函数会从响应文本中提取AppId并将其缓存。
   * 如果成功获取到AppId，则记录成功信息并返回该AppId。
   * 如果请求失败或返回的结果不符合预期，则记录错误信息并返回false。
   */
  async #getWorkshopAppId(id: string): Promise<false | string> {
    try {
      debug('开始获取Steam创意工坊AppId', { id });
      const logStatus = echoLog({ type: 'gettingWorkshopAppId', text: id, before: '[Web]' });
      const cachedAppId = this.#cache.workshop[id];
      if (cachedAppId) {
        debug('从缓存中获取到AppId', { id, cachedAppId });
        logStatus.success();
        return cachedAppId;
      }

      const { result, statusText, status, data } = await httpRequest({
        url: `https://steamcommunity.com/sharedfiles/filedetails/?id=${id}`,
        method: 'GET'
      });
      debug('获取创意工坊AppId请求结果', { result, statusText, status });

      if (result !== 'Success') {
        debug('获取创意工坊AppId请求失败', { result });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status !== 200) {
        debug('获取创意工坊AppId响应状态错误', { status: data?.status, statusText: data?.statusText });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      const matchedAppId = data.responseText.match(/<input type="hidden" name="appid" value="([\d]+?)" \/>/)?.[1];
      debug('正则提取AppId结果', { matchedAppId });
      if (!matchedAppId) {
        debug('未能提取到AppId', { id });
        logStatus.error('Error: getWorkshopAppId failed');
        return false;
      }

      debug('AppId已缓存', { id, matchedAppId });
      return matchedAppId;
    } catch (error) {
      debug('获取创意工坊AppId时发生异常', { error, id });
      throwError(error as Error, 'SteamWeb.getWorkshopAppId');
      return false;
    }
  }

  /**
   * 点赞创意工坊物品。
   *
   * @async
   * @function voteUpWorkshop
   * @param {string} id - 创意工坊物品的ID。
   * @returns {Promise<boolean>} - 返回一个Promise，表示点赞操作的结果。
   *                              - true: 点赞成功
   *                              - false: 点赞失败
   * @throws {Error} - 如果在点赞过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数通过发送POST请求到Steam社区的点赞接口来对指定的创意工坊物品进行点赞。
   * 首先，记录点赞状态并构建请求数据，包括物品ID和会话ID。
   * 如果请求成功且返回结果为'Success'，则进一步检查响应状态。
   * 如果状态为200且响应中表示点赞成功，则记录成功信息并返回true。
   * 如果请求失败或返回的结果不符合预期，则记录错误信息并返回false。
   * 如果在点赞过程中发生错误，函数将捕获异常并记录错误信息。
   */
  async voteUpWorkshop(id: string): Promise<boolean> {
    try {
      debug('开始点赞创意工坊物品', { id });
      const logStatus = echoLog({ type: 'votingUpWorkshop', text: id, before: '[Web]' });
      const { result, statusText, status, data } = await httpRequest({
        url: 'https://steamcommunity.com/sharedfiles/voteup',
        method: 'POST',
        responseType: 'json',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: $.param({ id, sessionid: this.#auth.communitySessionID })
      });

      if (result !== 'Success') {
        debug('点赞创意工坊物品请求失败', { result });
        logStatus.error(`${result}:${statusText}(${status})`);
        return true;
      }

      if (data?.status !== 200 || data.response?.success !== 1) {
        debug('点赞创意工坊物品失败', { status: data?.status });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return true;
      }

      debug('成功点赞创意工坊物品', { id });
      logStatus.success();
      return true;
    } catch (error) {
      debug('点赞创意工坊物品时发生错误', { error, id });
      throwError(error as Error, 'SteamWeb.voteUpWorkshop');
      return false;
    }
  }

  /**
   * 关注或取关指定的Steam鉴赏家、开发商或发行商。
   *
   * @async
   * @function toggleCurator
   * @param {string} curatorId - 鉴赏家的ID。
   * @param {boolean} [doTask=true] - true表示关注，false表示取关。
   * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
   *                              - true: 关注成功
   *                              - false: 关注失败
   * @throws {Error} - 如果在操作过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数用于关注或取关指定的Steam鉴赏家、开发商或发行商。
   * 如果doTask为false且鉴赏家ID在白名单中，则直接返回true。
   * 如果存在ASF实例，则调用ASF的`toggleCurator`方法进行操作。
   * 如果ASF不存在，则发送POST请求到Steam的关注接口。
   * 如果请求成功且返回结果为'Success'，并且状态为200且响应中表示操作成功，则记录成功信息并返回true。
   * 如果请求失败或返回的结果不为'Success'，则记录错误信息并返回false。
   * 如果在操作过程中发生错误，函数将捕获异常并记录错误信息。
   */
  async toggleCurator(curatorId: string, doTask = true): Promise<boolean> {
    try {
      debug('开始处理鉴赏家关注状态', { curatorId, doTask });
      const logStatus = echoLog({ type: doTask ? 'followingCurator' : 'unfollowingCurator', text: curatorId, before: '[Web]' });
      const { result, statusText, status, data } = await httpRequest({
        url: 'https://store.steampowered.com/curators/ajaxfollow',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        data: $.param({ clanid: curatorId, sessionid: this.#auth.storeSessionID, follow: doTask }),
        dataType: 'json'
      });

      if (result !== 'Success') {
        debug('处理鉴赏家关注状态请求失败', { result });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.response?.success?.success === 25) {
        debug('处理鉴赏家关注状态失败', { status: data?.status, success: data?.response?.success, message: data?.response?.msg });
        logStatus.error(__('curatorLimitNotice'));
        return false;
      }

      if (data?.status !== 200 || data.response?.success?.success !== 1) {
        debug('处理鉴赏家关注状态失败', { status: data?.status, success: data?.response?.success });
        logStatus.error(`Error:${data?.statusText}(${data?.response?.success}` || `${data?.status})`);
        return false;
      }

      debug('成功处理鉴赏家关注状态', { curatorId, doTask });
      logStatus.success();
      return true;
    } catch (error) {
      debug('处理鉴赏家关注状态时发生错误', { error, curatorId, doTask });
      throwError(error as Error, 'SteamWeb.toggleCurator');
      return false;
    }
  }

  /**
   * 获取Steam通知所需的参数。
   *
   * @async
   * @function #getAnnouncementParams
   * @param {string} appId - Steam游戏的AppId。
   * @param {string} viewId - Steam通知的ID。
   * @returns {Promise<announcementParams | {}>} - 返回一个Promise，表示获取操作的结果。
   *                                              - 成功时返回包含clanId和gid的对象
   *                                              - 失败时返回空对象
   * @throws {Error} - 如果在获取过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数通过发送GET请求到Steam的API来获取点赞Steam通知所需的参数。
   * 首先，记录获取状态并构建请求的URL。
   * 如果请求成功且返回结果为'Success'，则进一步检查响应状态。
   * 如果状态为200且响应中表示成功，则提取clanId和gid并返回。
   * 如果获取失败或返回的结果不符合预期，则记录错误信息并返回空对象。
   * 如果在获取过程中发生错误，函数将捕获异常并记录错误信息。
   */
  async #getAnnouncementParams(appId: string, viewId: string): Promise<announcementParams> {
    try {
      debug('开始获取Steam公告参数', { appId, viewId });
      const logStatus = echoLog({ type: 'gettingAnnouncementParams', text: appId, id: viewId, before: '[Web]' });
      const { result, statusText, status, data } = await httpRequest({
        url: `https://store.steampowered.com/events/ajaxgetpartnerevent?appid=${appId}&announcement_gid=${viewId}&lang_list=6_0&last_modified_time=0&origin=https:%2F%2Fstore.steampowered.com&for_edit=false`,
        method: 'GET',
        responseType: 'json',
        headers: {
          Host: 'store.steampowered.com',
          Referer: `https://store.steampowered.com/news/app/${appId}/view/${viewId}`
        }
      });
      debug('获取公告参数请求结果', { result, statusText, status });

      if (result !== 'Success') {
        debug('获取公告参数请求失败', { result });
        logStatus.error(`${result}:${statusText}(${status})`);
        return {};
      }

      if (data?.status !== 200 || data?.response?.success !== 1) {
        debug('获取公告参数响应状态错误', { status: data?.status, statusText: data?.statusText, response: data?.response });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return {};
      }

      const { clanid, gid } = data.response.event?.announcement_body || {};
      debug('公告参数提取', { clanid, gid });
      if (!clanid) {
        debug('未能提取到clanid', { appId, viewId });
        logStatus.error(`Error:${data.statusText}(${data.status})`);
        return {};
      }

      logStatus.success();
      debug('获取公告参数成功', { clanId: clanid, gid });
      return { clanId: clanid, gid };
    } catch (error) {
      debug('获取公告参数时发生异常', { error, appId, viewId });
      throwError(error as Error, 'SteamWeb.likeAnnouncement');
      return {};
    }
  }

  /**
   * 点赞Steam通知。
   *
   * @async
   * @function likeAnnouncement
   * @param {string} id - Steam游戏的AppId和Steam通知的ID，以'/'分隔。
   * @returns {Promise<boolean>} - 返回一个Promise，表示点赞操作的结果。
   *                              - true: 点赞成功
   *                              - false: 点赞失败
   * @throws {Error} - 如果在点赞过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数用于对指定的Steam通知进行点赞。首先，将传入的ID分割为AppId和viewId。
   * 如果AppId或viewId无效，则记录错误并返回false。
   * 然后，调用`#getAnnouncementParams`方法获取所需的参数，包括clanId和gid。
   * 如果未获取到clanId，则返回false。
   * 接着，发送POST请求到Steam的点赞接口，携带必要的请求头和数据。
   * 如果请求成功且返回结果为'Success'，并且状态为200且响应中表示点赞成功，则记录成功信息并返回true。
   * 如果请求失败或返回的结果不符合预期，则记录错误信息并返回false。
   * 如果在点赞过程中发生错误，函数将捕获异常并记录错误信息。
   */
  async likeAnnouncement(id: string): Promise<boolean> {
    try {
      debug('开始点赞公告', { id });
      const [appId, viewId] = id.split('/');
      if (!(appId && viewId)) {
        echoLog({ before: '[Web]' }).error(`${__('missParams')}(id)`);
        return false;
      }

      const { clanId, gid } = await this.#getAnnouncementParams(appId, viewId);
      if (!clanId) {
        return false;
      }

      const logStatus = echoLog({ type: 'likingAnnouncement', text: appId, id: viewId, before: '[Web]' });
      const { result, statusText, status, data } = await httpRequest({
        url: `https://store.steampowered.com/updated/ajaxrateupdate/${gid || viewId}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          Host: 'store.steampowered.com',
          Origin: 'https://store.steampowered.com',
          Referer: `https://store.steampowered.com/news/app/${appId}/view/${viewId}`
        },
        data: $.param({
          sessionid: this.#auth.storeSessionID,
          voteup: 1,
          clanid: clanId,
          ajax: 1
        }),
        dataType: 'json'
      });

      if (result !== 'Success') {
        debug('点赞公告请求失败', { result });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status !== 200 || data.response.success !== 1) {
        debug('点赞公告失败', { status: data?.status });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      debug('成功点赞公告', { id });
      logStatus.success();
      return true;
    } catch (error) {
      debug('点赞公告时发生错误', { error, id });
      throwError(error as Error, 'SteamWeb.likeAnnouncement');
      return false;
    }
  }

  /**
   * 将Steam游戏的AppId转换为SubId。
   *
   * @async
   * @function #appid2subid
   * @param {string} id - Steam游戏的AppId。
   * @returns {Promise<string | false>} - 返回一个Promise，表示转换操作的结果。
   *                                      - string: 转换成功，返回SubId
   *                                      - false: 转换失败
   * @throws {Error} - 如果在转换过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数通过发送GET请求到Steam的应用页面来获取对应的SubId。
   * 首先，记录获取状态并发送请求。
   * 如果请求成功且状态为200，函数会检查响应文本以确定游戏是否已拥有。
   * 如果游戏已拥有，则返回false。
   * 如果当前地区为中国且响应中包含错误信息，则尝试更换地区并重试获取SubId。
   * 如果成功获取到SubId，则返回该值。
   * 如果请求失败或返回的结果不符合预期，则记录错误信息并返回false。
   * 如果在转换过程中发生错误，函数将捕获异常并记录错误信息。
   */
  async #appid2subid(id: string): Promise<string | boolean> {
    try {
      debug('开始将AppId转换为SubId', { id });
      const logStatus = echoLog({ type: 'gettingSubid', text: id, before: '[Web]' });
      const { result, statusText, status, data } = await httpRequest({
        url: `https://store.steampowered.com/app/${id}`,
        method: 'GET',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
      });
      debug('获取App页面请求结果', { result, statusText, status });

      if (result !== 'Success') {
        debug('获取App页面请求失败', { result });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status !== 200) {
        debug('获取App页面响应状态错误', { status: data?.status, statusText: data?.statusText });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      if (data.responseText.includes('ds_owned_flag ds_flag') || data.responseText.includes('class="already_in_library"')) {
        debug('App已拥有', { id });
        logStatus.success(__('owned'));
        return true;
      }

      if (this.#area === 'CN' && data.responseText.includes('id="error_box"')) {
        debug('地区锁定，尝试更换地区', { area: this.#area });
        logStatus.warning(__('changeAreaNotice'));
        const result = await this.#changeArea();
        if (!result || result === 'CN' || result === 'skip') {
          debug('更换地区失败或未更换', { result });
          return false;
        }
        return await this.#appid2subid(id);
      }

      let subid = data.responseText.match(/name="subid" value="([\d]+?)"/)?.[1];
      debug('正则提取subid结果1', { subid });
      if (subid) {
        logStatus.success();
        return subid;
      }

      subid = data.responseText.match(/AddFreeLicense\(\s*(\d+)/)?.[1];
      debug('正则提取subid结果2', { subid });
      if (subid) {
        logStatus.success();
        return subid;
      }

      debug('未能提取到subid', { id });
      logStatus.error(`Error:${__('noSubid')}`);
      return false;
    } catch (error) {
      debug('AppId转SubId时发生异常', { error, id });
      throwError(error as Error, 'SteamWeb.appid2subid');
      return false;
    }
  }

  /**
   * 获取Steam用户的游戏许可证信息。
   *
   * @async
   * @function #getLicenses
   * @returns {Promise<Array<number> | false>} - 返回一个Promise，表示获取操作的结果。
   *                                              - Array<number>: 成功时返回许可证ID数组
   *                                              - false: 获取失败
   * @throws {Error} - 如果在获取过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数通过发送GET请求到Steam的动态商店用户数据接口来获取用户的许可证信息。
   * 首先，记录获取状态并发送请求。
   * 如果请求成功且返回结果为'Success'，则进一步检查响应状态。
   * 如果状态为200，函数会返回用户拥有的许可证ID数组。
   * 如果获取失败或返回的结果不符合预期，则记录错误信息并返回false。
   * 如果在获取过程中发生错误，函数将捕获异常并记录错误信息。
   */
  async #getLicenses(): Promise<Array<number> | false> {
    try {
      debug('开始获取Steam用户许可证信息');
      const logStatus = echoLog({ text: __('gettingLicenses'), before: '[Web]' });
      const { result, statusText, status, data } = await httpRequest({
        url: `https://store.steampowered.com/dynamicstore/userdata/?t=${new Date().getTime()}`,
        method: 'GET',
        responseType: 'json'
      });
      debug('获取许可证请求结果', { result, statusText, status });

      if (result !== 'Success') {
        debug('获取许可证请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status !== 200) {
        debug('获取许可证响应状态错误', { status: data?.status, statusText: data?.statusText });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      debug('获取到的许可证列表', { licenses: data.response?.rgOwnedPackages });
      logStatus.remove();
      return data.response?.rgOwnedPackages;
    } catch (error) {
      debug('获取许可证时发生异常', { error });
      throwError(error as Error, 'SteamWeb.getLicenses');
      return false;
    }
  }

  /**
   * 添加Steam游戏许可证。
   *
   * @async
   * @function addLicense
   * @param {string} id - 要添加的许可证ID，格式为'appid-xxxx'或'subid-xxxx,xxxx'。
   * @returns {Promise<boolean>} - 返回一个Promise，表示添加操作的结果。
   *                              - true: 添加成功
   *                              - false: 添加失败
   * @throws {Error} - 如果在添加过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数用于添加指定的Steam许可证。首先检查是否存在ASF实例，如果存在，则调用ASF的`addLicense`方法。
   * 如果许可证ID的类型为'appid'，则调用`#appid2subid`方法获取对应的SubId。
   * 如果获取成功，则记录添加状态并发送GET请求到Steam应用页面以验证许可证是否已添加。
   * 如果许可证ID的类型为'subid'，则检查当前地区是否为中国，如果是，则尝试更换地区。
   * 然后逐个添加SubId，并记录每个添加操作的状态。
   * 最后，检查已添加的许可证是否成功，并返回操作结果。
   */
  async addLicense(id: string): Promise<boolean> {
    try {
      debug('开始添加许可证', { id });
      const [type, ids] = id.split('-');
      debug('解析许可证ID', { type, ids });

      if (type !== 'appid' && type !== 'subid') {
        debug('无效的许可证类型', { type });
        return false;
      }

      if (type === 'appid') {
        debug('处理appid类型许可证', { ids });
        const subid = await this.#appid2subid(ids);
        debug('appid转换为subid结果', { appid: ids, subid });

        if (!subid) {
          debug('appid转换失败', { appid: ids });
          return false;
        }
        if (subid === true) {
          debug('appid已拥有', { appid: ids });
          return true;
        }

        const logStatus = echoLog({ type: 'addingFreeLicense', text: ids, before: '[Web]' });
        debug('开始添加免费许可证', { subid });

        if (!await this.#addFreeLicense(subid, logStatus)) {
          debug('添加免费许可证失败', { subid });
          return false;
        }

        const { result, statusText, status, data } = await httpRequest({
          url: `https://store.steampowered.com/app/${ids}`,
          method: 'GET'
        });
        debug('验证许可证添加状态', { result, status, statusText });

        if (result !== 'Success') {
          debug('验证请求失败', { result, status, statusText });
          logStatus.error(`${result}:${statusText}(${status})`);
          return false;
        }

        if (data?.status !== 200) {
          debug('验证响应状态错误', { status: data?.status, statusText: data?.statusText });
          logStatus.error(`Error:${data?.statusText}(${data?.status})`);
          return false;
        }

        if (!data.responseText.includes('ds_owned_flag ds_flag') && !data.responseText.includes('class="already_in_library"')) {
          debug('未找到游戏拥有标记', { status: data.status, statusText: data.statusText });
          logStatus.error(`Error:${data.statusText}(${data.status})`);
          return false;
        }

        debug('appid许可证添加成功', { appid: ids });
        logStatus.success();
        return true;
      }

      // Handle subid type
      if (this.#area === 'CN') {
        debug('当前区域为CN，尝试更改区域', { currentArea: this.#area });
        echoLog({ before: '[Web]' }).success(__('tryChangeAreaNotice'));
        await this.#changeArea();
      }

      const logStatusArr: commonObject = {};
      const idsArr = ids.split(',');
      debug('处理subid类型许可证', { idsArr });

      for (const subid of idsArr) {
        debug('开始处理单个subid', { subid });
        const logStatus = echoLog({ type: 'addingFreeLicense', text: subid, before: '[Web]' });
        if (!await this.#addFreeLicense(subid, logStatus)) {
          debug('添加subid许可证失败', { subid });
          return false;
        }
        logStatusArr[subid] = logStatus;
      }

      const licenses = await this.#getLicenses();
      debug('获取许可证列表', { licenses });

      if (!licenses) {
        debug('获取许可证列表失败');
        return false;
      }

      for (const subid of idsArr) {
        const hasLicense = licenses.includes(parseInt(subid, 10));
        debug('验证许可证添加状态', { subid, hasLicense });

        if (hasLicense) {
          logStatusArr[subid].success();
        } else {
          logStatusArr[subid].error();
        }
      }

      debug('所有subid许可证处理完成', { idsArr });
      return true;
    } catch (error) {
      debug('添加许可证过程发生错误', { error, id });
      throwError(error as Error, 'SteamWeb.addLicense');
      return false;
    }
  }

  /**
   * 添加免费Steam游戏许可证。
   *
   * @async
   * @function #addFreeLicense
   * @param {string} id - Steam游戏的subid。
   * @param {logStatus} [logStatusPre] - 可选的日志状态，用于记录操作状态。
   * @returns {Promise<boolean>} - 返回一个Promise，表示添加操作的结果。
   *                              - true: 添加成功
   *                              - false: 添加失败
   * @throws {Error} - 如果在添加过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数用于将指定的Steam游戏许可证添加到用户的账户中。
   * 首先，记录添加状态并发送POST请求到Steam的免费许可证添加接口。
   * 如果请求成功且返回结果为'Success'，则进一步检查响应状态。
   * 如果状态为200，函数会检查当前地区是否为中国，并处理相应的错误信息。
   * 如果添加成功，则记录成功信息并返回true。
   * 如果请求失败或返回的结果不符合预期，则记录错误信息并返回false。
   * 如果在添加过程中发生错误，函数将捕获异常并记录错误信息。
   */
  async #addFreeLicense(id: string, logStatusPre?: logStatus): Promise<boolean> {
    try {
      debug('开始添加免费Steam游戏许可证', { id });
      const logStatus = logStatusPre || echoLog({ type: 'addingFreeLicenseSubid', text: id, before: '[Web]' });
      const { result, statusText, status, data } = await httpRequest({
        url: `https://store.steampowered.com/freelicense/addfreelicense/${id}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          Host: 'store.steampowered.com',
          Origin: 'https://store.steampowered.com',
          Referer: 'https://store.steampowered.com/account/licenses/'
        },
        data: $.param({
          ajax: true,
          sessionid: this.#auth.storeSessionID
        }),
        dataType: 'json'
      });
      debug('添加免费许可证请求结果', { result, statusText, status });

      if (result !== 'Success') {
        debug('添加免费许可证请求失败', { result, statusText, status });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status !== 200) {
        debug('添加免费许可证响应状态错误', { status: data?.status, statusText: data?.statusText });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      if (this.#area === 'CN' && data.responseText.includes('id="error_box"')) {
        debug('地区锁定，尝试更换地区', { area: this.#area });
        logStatus.warning(__('changeAreaNotice'));
        const result = await this.#changeArea();
        if (!result || ['CN', 'skip'].includes(result as string)) {
          debug('更换地区失败或未更换', { result });
          return false;
        }
        return await this.#addFreeLicense(id);
      }

      debug('成功添加免费许可证', { id });
      logStatus.success();
      return true;
    } catch (error) {
      debug('添加免费许可证时发生异常', { error, id });
      throwError(error as Error, 'SteamWeb.addFreeLicense');
      return false;
    }
  }

  /**
   * 请求Steam游戏的试玩访问权限。
   *
   * @async
   * @function requestPlayTestAccess
   * @param {string} id - Steam游戏的AppId。
   * @returns {Promise<boolean>} - 返回一个Promise，表示请求操作的结果。
   *                              - true: 请求成功
   *                              - false: 请求失败
   * @throws {Error} - 如果在请求过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数用于请求指定Steam游戏的试玩访问权限。
   * 如果存在ASF实例，则调用ASF的`requestPlayTestAccess`方法进行请求。
   * 如果ASF不存在，则构建请求的URL并发送POST请求到Steam的API。
   * 请求的头信息包括内容类型和来源等。
   * 如果请求成功且返回结果为'Success'，则进一步检查响应数据。
   * 如果状态为200且响应中表示请求成功，则记录成功信息并返回true。
   * 如果请求失败或返回的结果不符合预期，则记录错误信息并返回false。
   * 如果在请求过程中发生错误，函数将捕获异常并记录错误信息。
   */
  async requestPlayTestAccess(id: string): Promise<boolean> {
    debug('开始请求游戏试玩权限', { id });
    try {
      debug('开始请求游戏试玩权限', { id });
      const logStatus = echoLog({ type: 'requestingPlayTestAccess', text: id, before: '[Web]' });
      debug('准备发送试玩权限请求', { id });

      const { result, statusText, status, data } = await httpRequest({
        url: `https://store.steampowered.com/ajaxrequestplaytestaccess/${id}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          Host: 'store.steampowered.com',
          Origin: 'https://store.steampowered.com',
          Referer: `https://store.steampowered.com/app/${id}`
        },
        data: $.param({
          sessionid: this.#auth.storeSessionID
        }),
        dataType: 'json'
      });
      debug('收到试玩权限请求响应', { result, status, statusText, responseData: data });

      if (result !== 'Success') {
        debug('请求失败', { result, status, statusText });
        logStatus.error(`${result}:${statusText}(${status})`);
        return false;
      }

      if (data?.status !== 200 || data?.response?.success !== 1) {
        debug('响应状态错误', {
          status: data?.status,
          statusText: data?.statusText,
          success: data?.response?.success
        });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }

      debug('成功请求游戏试玩权限', { id });
      logStatus.success();
      return true;
    } catch (error) {
      debug('请求游戏试玩权限时发生错误', { error, id });
      throwError(error as Error, 'SteamWeb.requestPlayTestAccess');
      return false;
    }
  }

  async resetArea(): Promise<boolean> {
    try {
      debug('检查区域设置状态', {
        currentArea: this.#area,
        oldArea: this.#oldArea,
        needReset: Boolean(this.#oldArea && this.#area !== this.#oldArea)
      });

      if (this.#oldArea && this.#area !== this.#oldArea) {
        debug('需要重置区域', {
          fromArea: this.#area,
          toArea: this.#oldArea
        });
        echoLog({ before: '[Web]' }).warning(__('steamFinishNotice') + this.#oldArea);
        const changeResult = await this.#changeArea(this.#oldArea);
        debug('区域重置结果', {
          success: changeResult,
          targetArea: this.#oldArea
        });
      } else {
        debug('无需重置区域', {
          currentArea: this.#area,
          oldArea: this.#oldArea
        });
      }

      debug('区域重置流程完成');
      return true;
    } catch (error) {
      debug('重置区域时发生错误', { error });
      throwError(error as Error, 'SteamWeb.resetArea');
      return false;
    }
  }

  /**
   * 设置缓存的ID与名称的对应关系。
   *
   * @private
   * @function #setCache
   * @param {steamCacheTypes} type - 缓存类型，指定要设置的缓存类别。
   * @param {string} name - 缓存项的名称。
   * @param {string} id - 要缓存的ID。
   * @returns {void} - 无返回值。
   * @throws {Error} - 如果在设置缓存过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数用于缓存ID与名称的对应关系。它将指定的ID存储在对应的缓存类型和名称下。
   * 如果在设置过程中发生错误，将调用`throwError`函数记录错误信息。
   */
  #setCache(type: steamCacheTypes, name: string, id: string): void {
    try {
      debug('开始设置缓存', { type, name, id });
      this.#cache[type][name] = id;
      GM_setValue('steamCache', this.#cache);
      debug('设置缓存成功', { type, name, id });
    } catch (error) {
      debug('设置缓存时发生异常', { error, type, name, id });
      throwError(error as Error, 'SteamWeb.setCache');
    }
  }
}
export default SteamWeb;
