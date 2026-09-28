/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/steamWeb/index.ts
 * @Description  : Steam 网页端 任务模块入口
 */

import { updateCommunityAuth, updateStoreAuth } from './auth/session';
import { updateCommunityAuthTab, updateStoreAuthTab } from './auth/tabAuth';
import { loadCache } from './cache';
import { Context } from './context';
import { likeAnnouncement } from './features/announcement';
import { doCurator, undoCurator } from './features/curator';
import { doFollowGame, undoFollowGame } from './features/followGame';
import { doForum, undoForum } from './features/forum';
import { joinGroup, leaveGroup } from './features/groups';
import { addLicense } from './features/licenses';
import { joinOfficialGroup, leaveOfficialGroup } from './features/officialGroups';
import { requestPlayTestAccess } from './features/playtest';
import { resetArea } from './features/region';
import { addToWishlist, removeFromWishlist } from './features/wishlist';
import { doFavoriteWorkshop, undoFavoriteWorkshop, voteUpWorkshop } from './features/workshop';
import type { StatusListener, SteamWebOptions } from './types';

export { createGMHttpClient } from './adapters/gmHttp';
export type { GMRawResponse, GMRequest, GMRequestOptions } from './adapters/gmHttp';
export { createGMStorage } from './adapters/gmStorage';
export { handleSteamAuthPage } from './adapters/gmTabAuth';
export * from './types';

/**
 * 调用商店或社区功能前，需要先初始化对应授权。
 */
export class SteamWeb {
  private readonly ctx: Context;
  /**
   * 创建 SteamWeb 实例并初始化所需状态。
   *
   * @param options - 本次操作的配置选项。
   */
  constructor(options: SteamWebOptions) {
    this.ctx = new Context(options);
  }

  /**
   * 注册状态事件监听器。
   *
   * @param event - 要订阅的事件名称。
   * @param listener - 接收状态变化的监听函数。
   * @returns 用于移除当前监听器的清理函数。
   * @throws Error - 触发 'Unknown event' 错误条件时抛出。
   */
  on(event: 'status', listener: StatusListener): () => void {
    if (event !== 'status') {
      throw new Error('Unknown event');
    }
    return this.ctx.events.on(listener);
  }

  /**
   * 初始化模块并检查运行所需的授权状态。
   *
   * @param type - 操作或数据类型；默认值为 `'all'`。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  init(type: 'all' | 'store' | 'community' = 'all'): Promise<boolean> {
    return this.ctx.run('init', type, async (ctx) => {
      if (type === 'store') {
        return this.initializeStore(ctx);
      }
      if (type === 'community') {
        return this.initializeCommunity(ctx, ctx.state.storeInitialized);
      }
      if (type !== 'all') {
        return false;
      }
      const store = await this.initializeStore(ctx);
      const community = await this.initializeCommunity(ctx, store);
      return store && community;
    });
  }

  /**
   * 初始化 Steam 商店授权。
   *
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  initStore(): Promise<boolean> {
    return this.initializeStore(this.ctx);
  }

  /**
   * 初始化 Steam 商店授权。
   *
   * @param parent - 父级节点。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  private initializeStore(parent: Context): Promise<boolean> {
    const { state } = this.ctx;
    if (state.storeInit) {
      return state.storeInit;
    }
    state.storeInit = parent.run('init.store', undefined, async (ctx) => {
      try {
        if (state.disposed) {
          ctx.progress('DISPOSED', 'error');
          return false;
        }
        if (state.storeInitialized) {
          return true;
        }
        await loadCache(ctx);
        state.storeInitialized = await updateStoreAuth(ctx) || await updateStoreAuthTab(ctx);
        return state.storeInitialized;
      } catch {
        ctx.reportError();
        return false;
      }
    }).finally(() => {
      state.storeInit = undefined;
    });
    return state.storeInit;
  }

  /**
   * 初始化 Steam 社区授权。
   *
   * @param initStoreResult - 商店初始化结果；默认值为 `this.ctx.state.storeInitialized`。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  initCommunity(initStoreResult = this.ctx.state.storeInitialized): Promise<boolean> {
    return this.initializeCommunity(this.ctx, initStoreResult);
  }

  /**
   * 初始化 Steam 社区授权。
   *
   * @param parent - 父级节点。
   * @param initStoreResult - 商店初始化结果。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  private initializeCommunity(parent: Context, initStoreResult: boolean): Promise<boolean> {
    const { state } = this.ctx;
    if (state.communityInit) {
      return state.communityInit;
    }
    state.communityInit = parent.run('init.community', undefined, async (ctx) => {
      try {
        if (state.disposed) {
          ctx.progress('DISPOSED', 'error');
          return false;
        }
        if (state.communityInitialized) {
          return true;
        }
        await loadCache(ctx);
        state.communityInitialized = await updateCommunityAuth(ctx, initStoreResult) || await updateCommunityAuthTab(ctx);
        return state.communityInitialized;
      } catch {
        ctx.reportError();
        return false;
      }
    }).finally(() => {
      state.communityInit = undefined;
    });
    return state.communityInit;
  }

  /**
   * 加入指定群组。
   *
   * @param groupName - 群组名称。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  joinGroup(groupName: string): Promise<boolean> {
    return joinGroup(this.ctx, groupName);
  }

  /**
   * 退出指定群组。
   *
   * @param groupName - 群组名称。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  leaveGroup(groupName: string): Promise<boolean> {
    return leaveGroup(this.ctx, groupName);
  }

  /**
   * 加入指定游戏的官方组。
   *
   * @param gameId - Steam 游戏标识。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  joinOfficialGroup(gameId: string): Promise<boolean> {
    return joinOfficialGroup(this.ctx, gameId);
  }

  /**
   * 退出指定游戏的官方组。
   *
   * @param gameId - Steam 游戏标识。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  leaveOfficialGroup(gameId: string): Promise<boolean> {
    return leaveOfficialGroup(this.ctx, gameId);
  }

  /**
   * 将游戏添加到愿望单。
   *
   * @param gameId - Steam 游戏标识。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  addToWishlist(gameId: string): Promise<boolean> {
    return addToWishlist(this.ctx, gameId);
  }

  /**
   * 将游戏从愿望单移除。
   *
   * @param gameId - Steam 游戏标识。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  removeFromWishlist(gameId: string): Promise<boolean> {
    return removeFromWishlist(this.ctx, gameId);
  }

  /**
   * 关注游戏。
   *
   * @param gameId - Steam 游戏标识。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  doFollowGame(gameId: string): Promise<boolean> {
    return doFollowGame(this.ctx, gameId);
  }
  /**
   * 取消关注游戏。
   *
   * @param gameId - Steam 游戏标识。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  undoFollowGame(gameId: string): Promise<boolean> {
    return undoFollowGame(this.ctx, gameId);
  }

  /**
   * 订阅论坛。
   *
   * @param gameId - Steam 游戏标识。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  doForum(gameId: string): Promise<boolean> {
    return doForum(this.ctx, gameId);
  }
  /**
   * 取消订阅论坛。
   *
   * @param gameId - Steam 游戏标识。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  undoForum(gameId: string): Promise<boolean> {
    return undoForum(this.ctx, gameId);
  }

  /**
   * 收藏创意工坊项目。
   *
   * @param id - 目标标识。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  doFavoriteWorkshop(id: string): Promise<boolean> {
    return doFavoriteWorkshop(this.ctx, id);
  }
  /**
   * 取消收藏创意工坊项目。
   *
   * @param id - 目标标识。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  undoFavoriteWorkshop(id: string): Promise<boolean> {
    return undoFavoriteWorkshop(this.ctx, id);
  }

  /**
   * 为创意工坊项目点赞。
   *
   * @param id - 目标标识。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  voteUpWorkshop(id: string): Promise<boolean> {
    return voteUpWorkshop(this.ctx, id);
  }

  /**
   * 关注鉴赏家。
   *
   * @param curatorId - Steam 鉴赏家标识。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  doCurator(curatorId: string): Promise<boolean> {
    return doCurator(this.ctx, curatorId);
  }
  /**
   * 取消关注鉴赏家。
   *
   * @param curatorId - Steam 鉴赏家标识。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  undoCurator(curatorId: string): Promise<boolean> {
    return undoCurator(this.ctx, curatorId);
  }

  /**
   * 为游戏公告点赞。
   *
   * @param id - 目标标识。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  likeAnnouncement(id: string): Promise<boolean> {
    return likeAnnouncement(this.ctx, id);
  }

  /**
   * 为账号添加游戏许可。
   *
   * @param id - 目标标识。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  addLicense(id: string): Promise<boolean> {
    return addLicense(this.ctx, id);
  }

  /**
   * 申请游戏测试资格。
   *
   * @param id - 目标标识。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  requestPlayTestAccess(id: string): Promise<boolean> {
    return requestPlayTestAccess(this.ctx, id);
  }

  /**
   * 恢复 Steam 商店地区。
   *
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  resetArea(): Promise<boolean> {
    return resetArea(this.ctx);
  }

  /**
   * 取消待处理的授权等待；已完成的操作和商店地区不会因此恢复。
   */
  dispose(): void {
    this.ctx.state.disposed = true;
    for (const cleanup of [...this.ctx.state.cleanups]) {
      cleanup();
    }
    this.ctx.events.clear();
  }
}

export default SteamWeb;
