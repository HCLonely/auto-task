/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:35:46
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/steamASF/index.ts
 * @Description  : Steam ASF 任务模块入口
 */

import { Context } from './context';
import { doCurator, undoCurator } from './features/curator';
import { doFollowGame, undoFollowGame } from './features/followGame';
import { joinGroup, leaveGroup } from './features/groups';
import { getSteamId, getSteamIdASF, getSteamIdWeb } from './features/identity';
import { initialize } from './features/initialization';
import { addLicense } from './features/licenses';
import { checkPlayStatus, playGames, stopPlayGames } from './features/playGames';
import { requestPlayTestAccess } from './features/playtest';
import { unsupported } from './features/unsupported';
import { addToWishlist, removeFromWishlist } from './features/wishlist';
import type { StatusListener, SteamASFOptions } from './types';

export * from './types';
export { createGMHttpClient } from './adapters/gmHttp';
export type { GMRawResponse, GMRequest, GMRequestOptions } from './adapters/gmHttp';
export { createGMStorage } from './adapters/gmStorage';

/**
 * ASF IPC 客户端；构造函数仅设置配置，init 方法通过 !stats 检查连接。
 */
export class SteamASF {
  private readonly ctx: Context;
  /**
   * 创建 SteamASF 实例并初始化所需状态。
   *
   * @param options - 本次操作的配置选项。
   */
  constructor(options: SteamASFOptions) {
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
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  init(): Promise<boolean> {
    return initialize(this.ctx);
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
  // Keep the original aliases: ASF's JOINGROUP/GROUPLIST handle these targets.
  joinOfficialGroup = this.joinGroup;
  leaveOfficialGroup = this.leaveGroup;
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
   * 启动游戏运行或游戏时长任务。
   *
   * @param ids - 目标标识列表。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  playGames(ids: string): Promise<boolean> {
    return playGames(this.ctx, ids);
  }
  /**
   * 停止正在执行的游戏运行任务。
   *
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  stopPlayGames(): Promise<boolean> {
    return stopPlayGames(this.ctx);
  }
  /**
   * 通过 ASF 获取当前账号的 Steam 标识。
   *
   * @returns Promise，完成后返回处理后的字符串。
   */
  getSteamIdASF(): Promise<string> {
    return getSteamIdASF(this.ctx);
  }
  /**
   * 通过网页授权获取当前账号的 Steam 标识。
   *
   * @returns Promise，完成后返回处理后的字符串。
   */
  getSteamIdWeb(): Promise<string> {
    return getSteamIdWeb(this.ctx);
  }
  /**
   * 获取当前账号的 Steam 标识。
   *
   * @returns Promise，完成后返回处理后的字符串。
   */
  getSteamId(): Promise<string> {
    return getSteamId(this.ctx);
  }
  /**
   * 检查 ASF 游戏运行状态。
   *
   * @param ids - 目标标识列表。
   * @returns Promise，完成后返回处理结果（boolean | "skip"）。
   */
  checkPlayStatus(ids: string): Promise<'skip' | boolean> {
    return checkPlayStatus(this.ctx, ids);
  }
  /**
   * 订阅论坛。
   *
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  doForum(): Promise<boolean> {
    return unsupported(this.ctx, 'doForum');
  }
  /**
   * 取消订阅论坛。
   *
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  undoForum(): Promise<boolean> {
    return unsupported(this.ctx, 'undoForum');
  }
  /**
   * 收藏创意工坊项目。
   *
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  doFavoriteWorkshop(): Promise<boolean> {
    return unsupported(this.ctx, 'doFavoriteWorkshop');
  }
  /**
   * 取消收藏创意工坊项目。
   *
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  undoFavoriteWorkshop(): Promise<boolean> {
    return unsupported(this.ctx, 'undoFavoriteWorkshop');
  }
  /**
   * 为创意工坊项目点赞。
   *
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  voteUpWorkshop(): Promise<boolean> {
    return unsupported(this.ctx, 'voteUpWorkshop');
  }
  /**
   * 为游戏公告点赞。
   *
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  likeAnnouncement(): Promise<boolean> {
    return unsupported(this.ctx, 'likeAnnouncement');
  }
  /**
   * 释放资源不会停止 ASF 中已运行的游戏；需要停止时应先调用 stopPlayGames。
   */
  dispose(): void {
    this.ctx.state.disposed = true;
    this.ctx.events.clear();
  }
}

export default SteamASF;
