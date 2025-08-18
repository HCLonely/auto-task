/*
 * @Author       : HCLonely
 * @Date         : 2021-10-04 16:07:55
 * @LastEditTime : 2025-08-18 19:09:10
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/social/Steam.ts
 * @Description  : steam相关功能
 */

import Social from './Social';
import echoLog from '../echoLog';
import throwError from '../tools/throwError';
import httpRequest from '../tools/httpRequest';
import __ from '../tools/i18n';
import { unique, delay } from '../tools/tools';
import { globalOptions } from '../globalOptions';
import SteamASF from './SteamASF';
import SteamWeb from './SteamWeb';
import { debug } from '../tools/debug';

// 定义 Steam 任务类型
type SteamTaskType = keyof typeof globalOptions.doTask.steam;

/**
 * Steam类用于处理与Steam相关的功能，包括身份验证、加入/退出组、管理愿望单、关注游戏等操作。
 * 该类继承自Social类，提供了与Steam平台交互的各种方法。
 *
 * @class Steam
 * @extends Social
 *
 * @property {steamTasks} tasks - 存储Steam相关的任务信息。
 * @property {steamTasks} whiteList - 存储白名单中的任务信息。
 * @property {steamCache} #cache - 存储缓存信息，包括群组、官方群组、论坛、创意工坊和鉴赏家等。
 * @property {Array<SteamASF | SteamWeb>} #TaskExecutor - 存储任务执行器实例数组。
 *
 * @method init 初始化Steam模块，验证及获取身份验证信息。
 * @method #joinGroup 加入指定的Steam组。
 * @method #leaveGroup 退出指定的Steam组。
 * @method #joinOfficialGroup 加入指定的Steam官方组。
 * @method #leaveOfficialGroup 退出指定的Steam官方组。
 * @method #addToWishlist 将指定的游戏添加到Steam的愿望单。
 * @method #removeFromWishlist 从Steam愿望单移除游戏。
 * @method #toggleFollowGame 关注或取关指定的Steam游戏。
 * @method #toggleForum 订阅或取消订阅Steam论坛。
 * @method #toggleFavoriteWorkshop 收藏或取消收藏指定的Steam创意工坊物品。
 * @method #voteUpWorkshop 点赞创意工坊物品。
 * @method #toggleCurator 关注或取关指定的Steam鉴赏家、开发商或发行商。
 * @method getCuratorId 获取Steam开发商或发行商的鉴赏家ID。
 * @method #toggleCuratorLike 处理Steam鉴赏家的点赞或取关操作。
 * @method #likeAnnouncement 点赞Steam通知。
 * @method #addLicense 添加Steam许可证。
 * @method #requestPlayTestAccess 请求Steam游戏的试玩访问权限。
 * @method #getDemoAppid 获取Steam游戏的试玩AppId。
 * @method #playGames Steam游戏挂游玩时长。
 * @method toggle 切换Steam相关任务的执行状态。
 * @method #setCache 设置缓存的ID与名称的对应关系。
 * @method #getTaskExecutionOrder 获取任务执行器的执行顺序。
 */
class Steam extends Social {
  tasks: steamTasks;
  whiteList: steamTasks;
  #cache: steamCache = {
    ...{
      group: {},
      officialGroup: {},
      forum: {},
      workshop: {},
      curator: {}
    }, ...GM_getValue<steamCache>('steamCache')
  };
  #TaskExecutor: Array<SteamASF | SteamWeb> = [];

  /**
   * 创建一个Steam实例。
   *
   * @constructor
   * @description
   * 此构造函数初始化Steam类的实例，设置默认任务模板和白名单。
   * 默认任务模板包含多个空数组，用于存储Steam相关的任务信息。
   * 白名单将从GM_getValue中获取，如果没有找到，则使用默认任务模板。
   */
  constructor() {
    super();
    debug('初始化Steam实例');
    const defaultTasksTemplate: steamTasks = {
      groups: [],
      officialGroups: [],
      wishlists: [],
      follows: [],
      forums: [],
      workshops: [],
      workshopVotes: [],
      curators: [],
      curatorLikes: [],
      announcements: [],
      licenses: [],
      playtests: [],
      playTime: []
    };
    this.tasks = defaultTasksTemplate;
    this.whiteList = { ...defaultTasksTemplate, ...(GM_getValue<whiteList>('whiteList')?.steam || {}) };
    this.#TaskExecutor = this.#getTaskExecutionOrder(globalOptions.ASF.AsfEnabled, globalOptions.ASF.steamWeb, globalOptions.ASF.preferASF);
    debug('Steam实例初始化完成', { taskExecutorCount: this.#TaskExecutor.length });
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
   * 初始化Steam模块，验证及获取身份验证信息。
   * 如果ASF已启用且配置正确，则初始化ASF实例。
   * 如果ASF未启用或配置不正确，则初始化SteamWeb实例。
   */
  async init(type = 'all'): Promise<boolean> {
    try {
      debug('开始初始化Steam模块', { type });
      for (let i = 0; i < this.#TaskExecutor.length; i++) {
        debug(`初始化执行器 ${i + 1}/${this.#TaskExecutor.length}`);
        if (!await this.#TaskExecutor[i].init(type)) {
          debug(`执行器 ${i + 1} 初始化失败，移除该执行器`);
          this.#TaskExecutor.splice(i, 1);
        }
      }
      debug('Steam模块初始化完成', { remainingExecutors: this.#TaskExecutor.length });
      return this.#TaskExecutor.length > 0;
    } catch (error) {
      debug('Steam初始化发生错误', { error });
      throwError(error as Error, 'Steam.init');
      return false;
    }
  }

  /**
   * 加入指定的Steam组。
   *
   * @async
   * @private
   * @function #joinGroup
   * @param {string} groupName - 要加入的Steam组的名称。
   * @returns {Promise<boolean>} - 返回一个Promise，表示加入操作的结果。
   *                              - true: 加入成功
   *                              - false: 加入失败
   * @throws {Error} - 如果在加入过程中发生错误，将抛出错误。
   *
   * @description
   * 遍历#TaskExecutor，依次尝试加入组。
   * 如果加入成功，则将组名称添加到任务列表中并返回true。
   * 如果所有尝试都失败，则返回false。
   */
  async #joinGroup(groupName: string): Promise<boolean> {
    try {
      debug('开始加入Steam组', { groupName });
      for (const taskExecutor of this.#TaskExecutor) {
        if (await taskExecutor.joinGroup(groupName)) {
          debug('成功加入Steam组', { groupName });
          this.tasks.groups = unique([...this.tasks.groups, groupName]);
          return true;
        }
      }
      debug('加入Steam组失败', { groupName });
      return false;
    } catch (error) {
      debug('加入Steam组时发生错误', { error, groupName });
      throwError(error as Error, 'Steam.joinGroup');
      return false;
    }
  }

  /**
   * 退出指定的Steam组。
   *
   * @async
   * @private
   * @function #leaveGroup
   * @param {string} groupName - 要退出的Steam组的名称。
   * @returns {Promise<boolean>} - 返回一个Promise，表示退出操作的结果。
   *                              - true: 退出成功
   *                              - false: 退出失败
   * @throws {Error} - 如果在退出过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数首先检查要退出的组是否在白名单中。如果在白名单中，直接返回true。
   * 遍历#TaskExecutor，依次尝试退出组。
   * 如果退出成功，则从任务列表中移除该组并返回true。
   * 如果所有尝试都失败，则返回false。
   */
  async #leaveGroup(groupName: string): Promise<boolean> {
    try {
      debug('开始退出Steam组', { groupName });
      if (this.whiteList.groups.includes(groupName)) {
        debug('Steam组在白名单中，跳过退出', { groupName });
        echoLog({ type: 'whiteList', text: 'Steam.leaveGroup', id: groupName });
        return true;
      }
      for (const taskExecutor of this.#TaskExecutor) {
        if (await taskExecutor.leaveGroup(groupName)) {
          debug('成功退出Steam组', { groupName });
          return true;
        }
      }
      debug('退出Steam组失败', { groupName });
      return false;
    } catch (error) {
      debug('退出Steam组时发生错误', { error, groupName });
      throwError(error as Error, 'Steam.leaveGroup');
      return false;
    }
  }

  /**
   * 加入指定的Steam官方组。
   *
   * @async
   * @private
   * @function #joinOfficialGroup
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
  async #joinOfficialGroup(gameId: string): Promise<boolean> {
    try {
      debug('开始加入Steam官方组', { gameId });
      for (const taskExecutor of this.#TaskExecutor) {
        if (await taskExecutor.joinOfficialGroup(gameId)) {
          debug('成功加入Steam官方组', { gameId });
          return true;
        }
      }
      debug('加入Steam官方组失败', { gameId });
      return false;
    } catch (error) {
      debug('加入Steam官方组时发生错误', { error, gameId });
      throwError(error as Error, 'Steam.joinOfficialGroup');
      return false;
    }
  }

  /**
   * 退出指定的Steam官方组。
   *
   * @async
   * @private
   * @function #leaveOfficialGroup
   * @param {string} gameId - 要退出的Steam游戏的ID。
   * @returns {Promise<boolean>} - 返回一个Promise，表示退出操作的结果。
   *                              - true: 退出成功
   *                              - false: 退出失败
   * @throws {Error} - 如果在退出过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数首先检查要退出的官方组是否在白名单中。如果在白名单中，直接返回true。
   * 遍历#TaskExecutor，依次尝试退出官方组。
   * 如果退出成功，则返回true。
   * 如果所有尝试都失败，则返回false。
   */
  async #leaveOfficialGroup(gameId: string): Promise<boolean> {
    try {
      debug('开始退出Steam官方组', { gameId });
      if (this.whiteList.officialGroups.includes(gameId)) {
        debug('Steam官方组在白名单中，跳过退出', { gameId });
        echoLog({ type: 'whiteList', text: 'Steam.leaveOfficialGroup', id: gameId });
        return true;
      }

      for (const taskExecutor of this.#TaskExecutor) {
        if (await taskExecutor.leaveOfficialGroup(gameId)) {
          debug('成功退出Steam官方组', { gameId });
          this.tasks.officialGroups = unique([...this.tasks.officialGroups, gameId]);
          return true;
        }
      }
      debug('退出Steam官方组失败', { gameId });
      return false;
    } catch (error) {
      debug('退出Steam官方组时发生错误', { error, gameId });
      throwError(error as Error, 'Steam.leaveOfficialGroup');
      return false;
    }
  }

  /**
   * 将指定的游戏添加到Steam的愿望单。
   *
   * @async
   * @private
   * @function #addToWishlist
   * @param {string} gameId - Steam游戏的AppId。
   * @returns {Promise<boolean>} - 返回一个Promise，表示添加操作的结果。
   *                              - true: 添加成功
   *                              - false: 添加失败
   * @throws {Error} - 如果在添加过程中发生错误，将抛出错误。
   *
   * @description
   * 遍历#TaskExecutor，依次尝试添加游戏到愿望单。
   * 如果添加成功，则将游戏ID添加到任务列表中并返回true。
   * 如果所有尝试都失败，则返回false。
   */
  async #addToWishlist(gameId: string): Promise<boolean> {
    try {
      debug('开始添加游戏到愿望单', { gameId });
      for (const taskExecutor of this.#TaskExecutor) {
        if (await taskExecutor.addToWishlist(gameId)) {
          debug('成功添加游戏到愿望单', { gameId });
          this.tasks.wishlists = unique([...this.tasks.wishlists, gameId]);
          return true;
        }
      }
      debug('添加游戏到愿望单失败', { gameId });
      return false;
    } catch (error) {
      debug('添加游戏到愿望单时发生错误', { error, gameId });
      throwError(error as Error, 'Steam.addToWishlist');
      return false;
    }
  }

  /**
   * 从Steam愿望单移除游戏。
   *
   * @async
   * @private
   * @function #removeFromWishlist
   * @param {string} gameId - Steam游戏的AppId。
   * @returns {Promise<boolean>} - 返回一个Promise，表示移除操作的结果。
   *                              - true: 移除成功
   *                              - false: 移除失败
   * @throws {Error} - 如果在移除过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数首先检查游戏ID是否在白名单中。如果在白名单中，直接返回true。
   * 遍历#TaskExecutor，依次尝试从愿望单中移除游戏。
   * 如果移除成功，则返回true。
   * 如果所有尝试都失败，则返回false。
   */
  async #removeFromWishlist(gameId: string): Promise<boolean> {
    try {
      debug('开始从愿望单移除游戏', { gameId });
      if (this.whiteList.wishlists.includes(gameId)) {
        debug('游戏在愿望单白名单中，跳过移除', { gameId });
        echoLog({ type: 'whiteList', text: 'Steam.removeFromWishlist', id: gameId });
        return true;
      }

      for (const taskExecutor of this.#TaskExecutor) {
        if (await taskExecutor.removeFromWishlist(gameId)) {
          debug('成功从愿望单移除游戏', { gameId });
          return true;
        }
      }
      debug('从愿望单移除游戏失败', { gameId });
      return false;
    } catch (error) {
      debug('从愿望单移除游戏时发生错误', { error, gameId });
      throwError(error as Error, 'Steam.removeFromWishlist');
      return false;
    }
  }

  /**
   * 关注或取关指定的Steam游戏。
   *
   * @async
   * @private
   * @function #toggleFollowGame
   * @param {string} gameId - Steam游戏的AppId。
   * @param {boolean} doTask - true表示关注游戏，false表示取关游戏。
   * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
   *                              - true: 操作成功
   *                              - false: 操作失败
   * @throws {Error} - 如果在操作过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数首先检查是否需要取关，如果游戏ID在白名单中，则直接返回true。
   * 遍历#TaskExecutor，依次尝试关注或取关游戏。
   * 如果操作成功，则更新任务列表并返回true。
   * 如果所有尝试都失败，则返回false。
   */
  async #toggleFollowGame(gameId: string, doTask: boolean): Promise<boolean> {
    try {
      debug('开始处理游戏关注状态', { gameId, doTask });
      if (!doTask && this.whiteList.follows.includes(gameId)) {
        debug('游戏在关注白名单中，跳过取关', { gameId });
        echoLog({ type: 'whiteList', text: 'Steam.unfollowGame', id: gameId });
        return true;
      }
      for (const taskExecutor of this.#TaskExecutor) {
        if (await taskExecutor.toggleFollowGame(gameId, doTask)) {
          if (doTask) {
            debug('成功关注游戏', { gameId });
            this.tasks.follows = unique([...this.tasks.follows, gameId]);
          } else {
            debug('成功取关游戏', { gameId });
          }
          return true;
        }
      }
      debug('处理游戏关注状态失败', { gameId, doTask });
      return false;
    } catch (error) {
      debug('处理游戏关注状态时发生错误', { error, gameId, doTask });
      throwError(error as Error, 'Steam.toggleFollowGame');
      return false;
    }
  }

  /**
   * 订阅或取消订阅Steam论坛。
   *
   * @async
   * @private
   * @function #toggleForum
   * @param {string} gameId - Steam游戏的AppId。
   * @param {boolean} [doTask=true] - true表示订阅论坛，false表示取消订阅论坛。
   * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
   *                              - true: 操作成功
   *                              - false: 操作失败
   * @throws {Error} - 如果在操作过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数首先检查是否需要取消订阅，如果游戏ID在白名单中，则直接返回true。
   * 遍历#TaskExecutor，依次尝试订阅或取消订阅论坛。
   * 如果操作成功，则更新任务列表并返回true。
   * 如果所有尝试都失败，则返回false。
   */
  async #toggleForum(gameId: string, doTask = true): Promise<boolean> {
    try {
      debug('开始处理论坛订阅状态', { gameId, doTask });
      if (!doTask && this.whiteList.forums.includes(gameId)) {
        debug('论坛在白名单中，跳过取消订阅', { gameId });
        echoLog({ type: 'whiteList', text: 'Steam.unsubscribeForum', id: gameId });
        return true;
      }

      for (const taskExecutor of this.#TaskExecutor) {
        if (await taskExecutor.toggleForum(gameId, doTask)) {
          if (doTask) {
            debug('成功订阅论坛', { gameId });
            this.tasks.forums = unique([...this.tasks.forums, gameId]);
          } else {
            debug('成功取消订阅论坛', { gameId });
          }
          return true;
        }
      }
      debug('处理论坛订阅状态失败', { gameId, doTask });
      return false;
    } catch (error) {
      debug('处理论坛订阅状态时发生错误', { error, gameId, doTask });
      throwError(error as Error, 'Steam.toggleForum');
      return true;
    }
  }
  /**
   * 收藏或取消收藏指定的Steam创意工坊物品。
   *
   * @async
   * @private
   * @function #toggleFavoriteWorkshop
   * @param {string} id - 创意工坊物品的ID。
   * @param {boolean} [doTask=true] - true表示收藏物品，false表示取消收藏物品。
   * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
   *                              - true: 操作成功
   *                              - false: 操作失败
   * @throws {Error} - 如果在操作过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数首先检查是否需要取消收藏，如果物品ID在白名单中，则直接返回true。
   * 遍历#TaskExecutor，依次尝试收藏或取消收藏物品。
   * 如果操作成功，则更新任务列表并返回true。
   * 如果所有尝试都失败，则返回false。
   */
  async #toggleFavoriteWorkshop(id: string, doTask = true): Promise<boolean> {
    try {
      debug('开始处理创意工坊收藏状态', { id, doTask });
      if (!doTask && this.whiteList.workshops.includes(id)) {
        debug('创意工坊物品在白名单中，跳过取消收藏', { id });
        echoLog({ type: 'whiteList', text: 'Steam.unfavoriteWorkshop', id });
        return true;
      }

      for (const taskExecutor of this.#TaskExecutor) {
        if (await taskExecutor.toggleFavoriteWorkshop(id)) {
          if (doTask) {
            debug('成功收藏创意工坊物品', { id });
            this.tasks.workshops = unique([...this.tasks.workshops, id]);
          } else {
            debug('成功取消收藏创意工坊物品', { id });
          }
          return true;
        }
      }
      debug('处理创意工坊收藏状态失败', { id, doTask });
      return false;
    } catch (error) {
      debug('处理创意工坊收藏状态时发生错误', { error, id, doTask });
      throwError(error as Error, 'Steam.toggleFavoriteWorkshop');
      return false;
    }
  }

  /**
   * 点赞创意工坊物品。
   *
   * @async
   * @private
   * @function #voteUpWorkshop
   * @param {string} id - 创意工坊物品的ID。
   * @returns {Promise<boolean>} - 返回一个Promise，表示点赞操作的结果。
   *                              - true: 点赞成功
   *                              - false: 点赞失败
   * @throws {Error} - 如果在点赞过程中发生错误，将抛出错误。
   *
   * @description
   * 遍历#TaskExecutor，依次尝试点赞创意工坊物品。
   * 如果点赞成功，则返回true。
   * 如果所有尝试都失败，则返回false。
   */
  async #voteUpWorkshop(id: string): Promise<boolean> {
    try {
      debug('开始点赞创意工坊物品', { id });
      for (const taskExecutor of this.#TaskExecutor) {
        if (await taskExecutor.voteUpWorkshop(id)) {
          debug('成功点赞创意工坊物品', { id });
          return true;
        }
      }
      debug('点赞创意工坊物品失败', { id });
      return false;
    } catch (error) {
      debug('点赞创意工坊物品时发生错误', { error, id });
      throwError(error as Error, 'Steam.voteupWorkshop');
      return true;
    }
  }

  /**
   * 关注或取关指定的Steam鉴赏家、开发商或发行商。
   *
   * @async
   * @private
   * @function #toggleCurator
   * @param {string} curatorId - 鉴赏家的ID。
   * @param {boolean} [doTask=true] - true表示关注，false表示取关。
   * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
   *                              - true: 关注成功
   *                              - false: 关注失败
   * @throws {Error} - 如果在操作过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数首先检查是否需要取关，如果鉴赏家ID在白名单中，则直接返回true。
   * 遍历#TaskExecutor，依次尝试关注或取关鉴赏家。
   * 如果操作成功，则更新任务列表并返回true。
   * 如果所有尝试都失败，则返回false。
   */
  async #toggleCurator(curatorId: string, doTask = true): Promise<boolean> {
    try {
      debug('开始处理鉴赏家关注状态', { curatorId, doTask });
      if (!doTask && this.whiteList.curators.includes(curatorId)) {
        debug('鉴赏家在白名单中，跳过取关', { curatorId });
        echoLog({ type: 'whiteList', text: 'Steam.unfollowCurator', id: curatorId });
        return true;
      }

      for (const taskExecutor of this.#TaskExecutor) {
        if (await taskExecutor.toggleCurator(curatorId, doTask)) {
          if (doTask) {
            debug('成功关注鉴赏家', { curatorId });
            this.tasks.curators = unique([...this.tasks.curators, curatorId]);
          } else {
            debug('成功取关鉴赏家', { curatorId });
          }
          return true;
        }
      }
      debug('处理鉴赏家关注状态失败', { curatorId, doTask });
      return false;
    } catch (error) {
      debug('处理鉴赏家关注状态时发生错误', { error, curatorId, doTask });
      throwError(error as Error, 'Steam.toggleCurator');
      return false;
    }
  }

  /**
   * 获取Steam开发商或发行商的鉴赏家ID。
   *
   * @async
   * @function getCuratorId
   * @param {string} path - 鉴赏家的类型（如开发商或发行商）。
   * @param {string} name - 鉴赏家的名称。
   * @returns {Promise<false | string>} - 返回一个Promise，表示获取操作的结果。
   *                                      - string: 转换成功，返回鉴赏家ID
   *                                      - false: 转换失败
   * @throws {Error} - 如果在获取过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数首先检查缓存中是否存在该鉴赏家的ID。
   * 如果缓存中存在，则直接返回该ID。
   * 如果缓存中不存在，则发送HTTP请求获取鉴赏家的详细信息。
   * 如果成功获取到鉴赏家ID，则将其存储到缓存中并返回。
   * 如果获取失败，则返回false。
   */
  async getCuratorId(path: string, name: string): Promise<false | string> {
    try {
      debug('开始获取鉴赏家ID', { path, name });
      const logStatus = echoLog({ type: 'gettingCuratorId', text: `${path}/${name}`, before: '[Web]' });
      const curatorId = this.#cache.curator[`${path}/${name}`];
      if (curatorId) {
        debug('从缓存获取到鉴赏家ID', { path, name, curatorId });
        logStatus.success();
        return curatorId;
      }
      const { result, statusText, status, data } = await httpRequest({
        url: `https://store.steampowered.com/${path}/${name}`,
        method: 'GET',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
      });
      if (result === 'Success') {
        if (data?.status === 200) {
          const curatorId = data.responseText.match(/g_pagingData.*?"clanid":([\d]+)/)?.[1];
          if (curatorId) {
            debug('成功获取鉴赏家ID', { path, name, curatorId });
            this.#setCache('curator', `${path}/${name}`, curatorId);
            logStatus.success();
            return curatorId;
          }
          debug('未找到鉴赏家ID', { path, name, status: data.status });
          logStatus.error(`Error:${data.statusText}(${data.status})`);
          return false;
        }
        debug('获取鉴赏家页面失败', { path, name, status: data?.status });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }
      debug('请求鉴赏家页面失败', { path, name, result, status });
      logStatus.error(`${result}:${statusText}(${status})`);
      return false;
    } catch (error) {
      debug('获取鉴赏家ID时发生错误', { error, path, name });
      throwError(error as Error, 'SteamWeb.getCuratorID');
      return false;
    }
  }
  /**
   * 处理Steam鉴赏家的点赞或取关操作。
   *
   * @async
   * @private
   * @function #toggleCuratorLike
   * @param {string} link - 鉴赏家的链接，包含类型和名称，以'/'分隔。
   * @param {boolean} [doTask=true] - true表示关注，false表示取关，默认为true。
   * @returns {Promise<boolean>} - 返回一个Promise，表示操作的结果。
   *                              - true: 操作成功
   *                              - false: 操作失败
   * @throws {Error} - 如果在处理过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数首先将链接分割为路径和名称。
   * 如果路径或名称无效，则记录错误并返回false。
   * 然后，调用getCuratorId方法获取鉴赏家的ID。
   * 如果成功获取到ID，则调用#toggleCurator方法执行关注或取关操作。
   * 如果操作失败，则返回false。
   */
  async #toggleCuratorLike(link: string, doTask = true): Promise<boolean> {
    try {
      debug('开始处理鉴赏家点赞状态', { link, doTask });
      const [path, name] = link.split('/');
      if (!(path && name)) {
        debug('无效的鉴赏家链接', { link });
        echoLog({ text: __('errorLink', link), before: '[Web]' });
        return false;
      }
      const curatorId = await this.getCuratorId(path, name);
      if (curatorId) {
        debug('获取到鉴赏家ID，开始处理点赞', { curatorId, doTask });
        return await this.#toggleCurator(curatorId, doTask);
      }
      debug('未获取到鉴赏家ID', { link });
      return false;
    } catch (error) {
      debug('处理鉴赏家点赞状态时发生错误', { error, link, doTask });
      throwError(error as Error, 'Steam.toggleCuratorLike');
      return false;
    }
  }

  /**
   * 点赞Steam通知。
   *
   * @async
   * @private
   * @function #likeAnnouncement
   * @param {string} id - Steam游戏的AppId和Steam通知的ID，以'/'分隔。
   * @returns {Promise<boolean>} - 返回一个Promise，表示点赞操作的结果。
   *                              - true: 点赞成功
   *                              - false: 点赞失败
   * @throws {Error} - 如果在点赞过程中发生错误，将抛出错误。
   *
   * @description
   * 遍历#TaskExecutor，依次尝试点赞Steam通知。
   * 如果点赞成功，则返回true。
   * 如果所有尝试都失败，则返回false。
   */
  async #likeAnnouncement(id: string): Promise<boolean> {
    try {
      debug('开始点赞公告', { id });
      for (const taskExecutor of this.#TaskExecutor) {
        if (await taskExecutor.likeAnnouncement(id)) {
          debug('成功点赞公告', { id });
          return true;
        }
      }
      debug('点赞公告失败', { id });
      return false;
    } catch (error) {
      debug('点赞公告时发生错误', { error, id });
      throwError(error as Error, 'Steam.likeAnnouncement');
      return false;
    }
  }

  /**
   * 添加Steam游戏许可证。
   *
   * @async
   * @private
   * @function #addLicense
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
  async #addLicense(id: string): Promise<boolean> {
    try {
      debug('开始添加许可证', { id });
      for (const taskExecutor of this.#TaskExecutor) {
        if (await taskExecutor.addLicense(id)) {
          debug('成功添加许可证', { id });
          return true;
        }
      }
      debug('添加许可证失败', { id });
      return false;
    } catch (error) {
      debug('添加许可证时发生错误', { error, id });
      throwError(error as Error, 'Steam.addLicense');
      return false;
    }
  }

  /**
   * 请求Steam游戏的试玩访问权限。
   *
   * @async
   * @private
   * @function #requestPlayTestAccess
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
  async #requestPlayTestAccess(id: string): Promise<boolean> {
    try {
      debug('开始请求游戏试玩权限', { id });
      for (const taskExecutor of this.#TaskExecutor) {
        if (await taskExecutor.requestPlayTestAccess(id)) {
          debug('成功请求游戏试玩权限', { id });
          return true;
        }
      }
      debug('请求游戏试玩权限失败', { id });
      return false;
    } catch (error) {
      debug('请求游戏试玩权限时发生错误', { error, id });
      throwError(error as Error, 'Steam.requestPlayTestAccess');
      return false;
    }
  }

  /**
   * 获取Steam游戏的试玩AppId。
   *
   * @async
   * @private
   * @function #getDemoAppid
   * @param {string} id - Steam游戏的AppId。
   * @returns {Promise<false | string>} - 返回一个Promise，表示获取操作的结果。
   *                                      - false: 获取失败
   *                                      - string: 获取成功，返回试玩AppId
   * @throws {Error} - 如果在获取过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数发送GET请求到Steam的应用页面以获取试玩AppId。
   * 如果请求成功且返回结果为'Success'，则进一步检查响应数据。
   * 如果状态为200且响应中包含试玩AppId，则记录成功信息并返回试玩AppId。
   * 如果请求失败或返回的结果不符合预期，则记录错误信息并返回false。
   */
  async #getDemoAppid(id: string): Promise<false | string> {
    try {
      debug('开始获取游戏试玩ID', { id });
      const logStatus = echoLog({ type: 'gettingDemoAppid', text: id, before: '[Web]' });
      const { result, statusText, status, data } = await httpRequest({
        url: `https://store.steampowered.com/app/${id}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          Host: 'store.steampowered.com',
          Origin: 'https://store.steampowered.com',
          Referer: `https://store.steampowered.com/app/${id}`
        }
      });
      if (result === 'Success') {
        if (data?.status === 200) {
          const demoAppid = data.responseText.match(/steam:\/\/(install|run)\/(\d+)/)?.[2];
          debug('成功获取游戏试玩ID', { id, demoAppid });
          logStatus.success();
          return demoAppid || false;
        }
        debug('获取游戏页面失败', { id, status: data?.status });
        logStatus.error(`Error:${data?.statusText}(${data?.status})`);
        return false;
      }
      debug('请求游戏页面失败', { id, result, status });
      logStatus.error(`${result}:${statusText}(${status})`);
      return false;
    } catch (error) {
      debug('获取游戏试玩ID时发生错误', { error, id });
      throwError(error as Error, 'Steam.getDemoAppid');
      return false;
    }
  }

  /**
   * Steam游戏挂游玩时长。
   *
   * @async
   * @private
   * @function #playGames
   * @param {string} ids - Steam游戏的AppId, 多个id英文逗号间隔。
   * @param {number} playTime - Steam游戏的挂机时长，单位：分钟。
   * @param {boolean} [doTask=true] - true表示挂时长，false表示停止挂时长，默认为true。
   * @returns {Promise<boolean>} - 返回一个Promise，表示请求操作的结果。
   *                              - true: 请求成功
   *                              - false: 请求失败
   * @throws {Error} - 如果在请求过程中发生错误，将抛出错误。
   *
   * @description
   * 该函数用于挂Steam游戏的游玩时长。
   * 如果playTime小于等于0，则直接返回true。
   * 检查是否存在ASF实例，如果不存在则返回false。
   * 如果doTask为false，则调用ASF的stopPlayGames方法停止挂机。
   * 否则，批量处理游戏ID，获取试玩AppId，并尝试启动游戏。
   * 如果启动成功，则更新状态信息并返回true。
   * 如果启动失败，则返回false。
   */
  async #playGames(ids: string, playTime: number, doTask: boolean = true): Promise<boolean> {
    try {
      debug('开始处理游戏挂时长', { ids, playTime, doTask });
      if (playTime <= 0) {
        debug('游戏时长小于等于0，跳过挂时长');
        return true;
      }

      const asf = this.#TaskExecutor.find((e) => e instanceof SteamASF);
      if (!asf) {
        debug('未找到ASF实例');
        echoLog({}).warning(__('noASFInstance'));
        return false;
      }

      if (!doTask) {
        debug('停止挂时长');
        return await asf.stopPlayGames();
      }

      // 批量处理游戏ID
      const idsArr = await Promise.all(ids.split(',').map(async (id: string) => {
        try {
          const demoAppid = await this.#getDemoAppid(id);
          return demoAppid ? `${id},${demoAppid}` : id;
        } catch (error) {
          debug('获取游戏试玩ID失败', { error, id });
          return id;
        }
      }));

      const uniqueIds = unique(idsArr.join(',').split(','));
      debug('处理后的游戏ID列表', { uniqueIds });

      debug('开始尝试入库游戏', { uniqueIds });
      await Promise.all(uniqueIds.map(async (id) => {
        for (const taskExecutor of this.#TaskExecutor) {
          if (await taskExecutor.addLicense(`appid-${id}`)) {
            debug('成功入库游戏', { id });
            return true;
          }
        }
        return false;
      }));

      // 尝试启动游戏
      await asf.playGames(uniqueIds.join(','));
      const status = await asf.checkPlayStatus(uniqueIds.join(','));
      if (status !== true) {
        await delay(3000);
        await asf.playGames(uniqueIds.join(','));
        const status = await asf.checkPlayStatus(uniqueIds.join(','));
        if (!status) {
          debug('启动游戏失败');
          return false;
        }
      }

      // 更新状态
      const stopPlayTime = Date.now() + ((playTime + 10) * 60 * 1000);
      const stopPlayTimeOld = GM_getValue<number>('stopPlayTime', 0) || 0;
      GM_setValue('stopPlayTime', Math.max(stopPlayTime, stopPlayTimeOld));

      const playedGames = GM_getValue<Array<string>>('playedGames', []) || [];
      GM_setValue('playedGames', unique([...playedGames, ...uniqueIds]));

      const taskLink = GM_getValue<Array<string>>('taskLink', []) || [];
      GM_setValue('taskLink', unique([...taskLink, window.location.href]));

      debug('游戏挂时长状态更新完成');
      return true;
    } catch (error) {
      debug('处理游戏挂时长时发生错误', { error, ids, playTime });
      throwError(error as Error, 'Steam.playGames');
      return false;
    }
  }

  /**
   * 切换Steam相关任务的执行状态。
   *
   * @async
   * @function toggle
   * @param {Object} options - 任务选项对象
   * @param {boolean} [options.doTask=true] - 是否执行任务
   * @param {string[]} [options.groupLinks=[]] - 群组链接列表
   * @param {string[]} [options.officialGroupLinks=[]] - 官方群组链接列表
   * @param {string[]} [options.wishlistLinks=[]] - 愿望单链接列表
   * @param {string[]} [options.followLinks=[]] - 关注链接列表
   * @param {string[]} [options.forumLinks=[]] - 论坛链接列表
   * @param {string[]} [options.workshopLinks=[]] - 工坊链接列表
   * @param {string[]} [options.workshopVoteLinks=[]] - 工坊投票链接列表
   * @param {string[]} [options.curatorLinks=[]] - 策展人链接列表
   * @param {string[]} [options.curatorLikeLinks=[]] - 策展人点赞链接列表
   * @param {string[]} [options.announcementLinks=[]] - 公告链接列表
   * @param {string[]} [options.licenseLinks=[]] - 许可证链接列表
   * @param {string[]} [options.playtestLinks=[]] - 试玩链接列表
   * @param {string[]} [options.playTimeLinks=[]] - 游戏时长链接列表
   * @returns {Promise<boolean>} - 返回任务执行结果
   * @throws {Error} - 如果执行过程中发生错误
   */
  async toggle({
    doTask = true,
    groupLinks = [],
    officialGroupLinks = [],
    wishlistLinks = [],
    followLinks = [],
    forumLinks = [],
    workshopLinks = [],
    workshopVoteLinks = [],
    curatorLinks = [],
    curatorLikeLinks = [],
    announcementLinks = [],
    licenseLinks = [],
    playtestLinks = [],
    playTimeLinks = []
  }: {
    doTask?: boolean;
    groupLinks?: string[];
    officialGroupLinks?: string[];
    wishlistLinks?: string[];
    followLinks?: string[];
    forumLinks?: string[];
    workshopLinks?: string[];
    workshopVoteLinks?: string[];
    curatorLinks?: string[];
    curatorLikeLinks?: string[];
    announcementLinks?: string[];
    licenseLinks?: string[];
    playtestLinks?: string[];
    playTimeLinks?: string[];
  }): Promise<boolean> {
    try {
      debug('开始处理Steam任务', {
        doTask,
        linksCount: {
          groups: groupLinks.length,
          officialGroups: officialGroupLinks.length,
          wishlists: wishlistLinks.length,
          follows: followLinks.length,
          forums: forumLinks.length,
          workshops: workshopLinks.length,
          workshopVotes: workshopVoteLinks.length,
          curators: curatorLinks.length,
          curatorLikes: curatorLikeLinks.length,
          announcements: announcementLinks.length,
          licenses: licenseLinks.length,
          playtests: playtestLinks.length,
          playTime: playTimeLinks.length
        }
      });

      const allLinks = [
        ...groupLinks,
        ...officialGroupLinks,
        ...forumLinks,
        ...workshopLinks,
        ...workshopVoteLinks,
        ...wishlistLinks,
        ...followLinks,
        ...curatorLinks,
        ...curatorLikeLinks,
        ...announcementLinks,
        ...licenseLinks,
        ...playtestLinks,
        ...playTimeLinks
      ];

      if (allLinks.length > 0 && this.#TaskExecutor.length === 0) {
        debug('Steam模块未初始化');
        echoLog({ text: __('needInit') });
        return false;
      }

      const tasks: Array<Promise<boolean>> = [];

      // 处理群组任务
      if (this.shouldProcessTask('groups', doTask)) {
        debug('开始处理群组任务');
        const realGroups = this.getRealParams('groups', groupLinks, doTask,
          (link) => link.match(/groups\/(.+)\/?/)?.[1]?.split('/')?.[0]);
        debug('处理后的群组列表', { count: realGroups.length, groups: realGroups });

        for (const group of realGroups) {
          tasks.push(doTask ? this.#joinGroup(group) : this.#leaveGroup(group));
          await delay(1000);
        }
      }

      // 处理官方群组任务
      if (this.shouldProcessTask('officialGroups', doTask)) {
        const realOfficialGroups = this.getRealParams('officialGroups', officialGroupLinks, doTask,
          (link) => link.match(/games\/(.+)\/?/)?.[1]);

        for (const officialGroup of realOfficialGroups) {
          tasks.push(doTask ? this.#joinOfficialGroup(officialGroup) : this.#leaveOfficialGroup(officialGroup));
          await delay(1000);
        }
      }

      // 处理愿望单任务
      if (this.shouldProcessTask('wishlists', doTask)) {
        const realWishlists = this.getRealParams('wishlists', wishlistLinks, doTask,
          (link) => link.match(/app\/([\d]+)/)?.[1]);

        for (const game of realWishlists) {
          tasks.push(doTask ? this.#addToWishlist(game) : this.#removeFromWishlist(game));
          await delay(1000);
        }
      }

      // 处理关注任务
      if (this.shouldProcessTask('follows', doTask)) {
        const realFollows = this.getRealParams('follows', followLinks, doTask,
          (link) => link.match(/app\/([\d]+)/)?.[1]);

        for (const game of realFollows) {
          tasks.push(this.#toggleFollowGame(game, doTask));
          await delay(1000);
        }
      }

      // 处理游戏时长任务
      if (this.shouldProcessTask('playTime', doTask)) {
        const realGames = this.getRealParams('playTime', playTimeLinks, doTask,
          (link) => `${link.split('-')[0]}-${link.match(/app\/([\d]+)/)?.[1] || ''}`);

        if (realGames.length > 0) {
          const maxTime = Math.max(...realGames.map((info) => parseInt(info.split('-')[0], 10) || 0));
          const games = realGames
            .filter((info) => {
              const [time, game] = info.split('-');
              return (parseInt(time, 10) || 0) > 0 && game;
            })
            .map((info) => info.split('-')[1]);

          tasks.push(this.#playGames(games.join(','), maxTime, doTask));
          await delay(1000);
        }
      }

      // 处理论坛任务
      if (this.shouldProcessTask('forums', doTask)) {
        const realForums = this.getRealParams('forums', forumLinks, doTask,
          (link) => link.match(/app\/([\d]+)/)?.[1]);

        for (const forum of realForums) {
          tasks.push(this.#toggleForum(forum, doTask));
          await delay(1000);
        }
      }

      // 处理创意工坊任务
      if (this.shouldProcessTask('workshops', doTask)) {
        const realWorkshops = this.getRealParams('workshops', workshopLinks, doTask,
          (link) => link.match(/\?id=([\d]+)/)?.[1]);

        for (const workshop of realWorkshops) {
          tasks.push(this.#toggleFavoriteWorkshop(workshop, doTask));
          await delay(1000);
        }
      }

      // 处理创意工坊投票任务
      if (doTask && globalOptions.doTask.steam.workshopVotes) {
        const realworkshopVotes = this.getRealParams('workshopVotes', workshopVoteLinks, doTask,
          (link) => link.match(/\?id=([\d]+)/)?.[1]);

        for (const workshop of realworkshopVotes) {
          tasks.push(this.#voteUpWorkshop(workshop));
          await delay(1000);
        }
      }

      // 处理鉴赏家任务
      if (this.shouldProcessTask('curators', doTask)) {
        const realCurators = this.getRealParams('curators', curatorLinks, doTask,
          (link) => link.match(/curator\/([\d]+)/)?.[1]);
        const realCuratorLikes = this.getRealParams('curatorLikes', curatorLikeLinks, doTask,
          (link) => link.match(/https?:\/\/store\.steampowered\.com\/(.*?)\/([^/?]+)/)?.slice(1, 3)
            .join('/'));

        for (const curator of realCurators) {
          tasks.push(this.#toggleCurator(curator, doTask));
          await delay(1000);
        }

        for (const curatorLike of realCuratorLikes) {
          tasks.push(this.#toggleCuratorLike(curatorLike, doTask));
          await delay(1000);
        }
      }

      // 处理公告任务
      if (doTask && globalOptions.doTask.steam.announcements) {
        const realAnnouncements = this.getRealParams('announcements', announcementLinks, doTask,
          (link) => {
            if (link.includes('store.steampowered.com')) {
              return link.match(/store\.steampowered\.com\/news\/app\/([\d]+)\/view\/([\d]+)/)?.slice(1, 3)
                .join('/');
            }
            return link.match(/steamcommunity\.com\/games\/([\d]+)\/announcements\/detail\/([\d]+)/)?.slice(1, 3)
              .join('/');
          });

        for (const id of realAnnouncements) {
          tasks.push(this.#likeAnnouncement(id));
          await delay(1000);
        }
      }

      // 处理许可证任务
      if (doTask && globalOptions.doTask.steam.licenses && licenseLinks.length > 0) {
        for (const ids of licenseLinks) {
          const [type, idsStr] = ids.split('-');
          const idsArr = idsStr.split(',');
          for (const id of idsArr) {
            tasks.push(this.#addLicense(`${type}-${id}`));
            await delay(1000);
          }
        }
      }

      // 处理试玩任务
      if (doTask && globalOptions.doTask.steam.playtests) {
        const realPlaytests = this.getRealParams('playtests', playtestLinks, doTask,
          (link) => link.match(/app\/([\d]+)/)?.[1]);

        for (const id of realPlaytests) {
          tasks.push(this.#requestPlayTestAccess(id));
          await delay(1000);
        }
      }

      // 执行所有任务并重置区域
      debug('开始执行所有任务');
      const results = await Promise.all(tasks);
      this.#TaskExecutor.find((e) => e instanceof SteamWeb)?.resetArea();
      debug('所有任务执行完成', { success: results.every((result) => result) });

      return results.every((result) => result);
    } catch (error) {
      debug('处理Steam任务时发生错误', { error });
      throwError(error as Error, 'Steam.toggle');
      return false;
    }
  }

  /**
   * 检查是否应该处理特定类型的任务。
   *
   * @private
   * @function shouldProcessTask
   * @param {SteamTaskType} taskType - 任务类型
   * @param {boolean} doTask - 是否执行任务
   * @returns {boolean} - 是否应该处理该任务
   *
   * @description
   * 根据任务类型和操作类型（执行/取消）检查是否应该处理该任务。
   * 对于执行任务，检查 doTask.steam 中对应类型的配置。
   * 对于取消任务，检查 undoTask.steam 中对应类型的配置。
   * 如果任务类型在 undoTask.steam 中不存在，则默认返回 false。
   */
  private shouldProcessTask(taskType: SteamTaskType, doTask: boolean): boolean {
    debug('检查是否处理任务', { taskType, doTask });
    if (doTask) {
      const result = globalOptions.doTask.steam[taskType];
      debug('检查doTask配置', { taskType, result });
      return globalOptions.doTask.steam[taskType];
    }
    // 检查任务类型是否存在于 undoTask.steam 中
    const undoTaskType = taskType as keyof typeof globalOptions.undoTask.steam;
    return undoTaskType in globalOptions.undoTask.steam && globalOptions.undoTask.steam[undoTaskType];
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
   * 如果在设置过程中发生错误，将调用throwError函数记录错误信息。
   */
  #setCache(type: steamCacheTypes, name: string, id: string): void {
    try {
      this.#cache[type][name] = id;
      GM_setValue('steamCache', this.#cache);
    } catch (error) {
      throwError(error as Error, 'SteamWeb.setCache');
    }
  }

  /**
   * 获取任务执行器的执行顺序。
   *
   * @private
   * @function #getTaskExecutionOrder
   * @param {boolean} asfEnabled - 是否启用ASF。
   * @param {boolean} steamWebEnabled - 是否启用SteamWeb。
   * @param {boolean} preferASF - 是否优先使用ASF。
   * @returns {Array<SteamASF | SteamWeb>} - 返回任务执行器实例数组。
   *
   * @description
   * 该函数根据配置参数决定任务执行器的执行顺序。
   * 如果ASF禁用，则只返回SteamWeb实例。
   * 如果SteamWeb禁用，则只返回ASF实例。
   * 如果两者都启用，则根据preferASF参数决定优先级。
   */
  #getTaskExecutionOrder(asfEnabled: boolean, steamWebEnabled: boolean, preferASF: boolean): Array<SteamASF | SteamWeb> {
    // ASF禁用：强制Web
    if (!asfEnabled) return [new SteamWeb()];
    // Web禁用：强制ASF
    if (!steamWebEnabled) return [new SteamASF(globalOptions.ASF)];
    // 两者均可用，按preferASF决定优先级
    return preferASF ? [new SteamASF(globalOptions.ASF), new SteamWeb()] : [new SteamWeb(), new SteamASF(globalOptions.ASF)];
  }
}
export default Steam;
