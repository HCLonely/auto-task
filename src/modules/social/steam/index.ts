/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/index.ts
 * @Description  : Steam 任务模块入口
 */

import { Context } from './context';
import { createTasks } from './defaults';
import { initialize, resetRegion } from './executors';
import { getCuratorId } from './lookups';
import { stopPlayGames } from './playTime';
import { getPlayState, loadState } from './storage';
import { doTasks, undoTasks } from './tasks';
import { handleSteamAuthPage as handleWebAuthPage } from './steamWeb';
import type { GMAuthAPI, InitType, PlayState, SteamListener, SteamOptions, SteamTasks, SteamTaskOptions, SteamTaskResult } from './types';

export * from './types';
export { default as SteamWeb } from './steamWeb';
export { default as SteamASF } from './steamASF';
export { createGMHttpClient } from './steamWeb/adapters/gmHttp';
export type { GMRequest, GMRequestOptions, GMRawResponse } from './steamWeb/adapters/gmHttp';

/**
 * 处理 Steam 授权标签页并向发起页面回传授权信息。
 *
 * @remarks
 * Uses the integrated client's <namespace>:web namespace automatically.
 *
 * @param options - 本次操作的配置选项；默认值为 `{}`。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function handleSteamAuthPage(options: { namespace?: string; gm?: GMAuthAPI } = {}): Promise<boolean> {
  return handleWebAuthPage({
    ...options,
    namespace: `${options.namespace || 'steam'}:web`
  });
}

/**
 * Steam 社交任务客户端，封装初始化、任务操作与状态管理。
 */
export class Steam {
  private readonly ctx: Context;
  /**
   * 创建 Steam 实例并初始化所需状态。
   *
   * @param options - 本次操作的配置选项。
   */
  constructor(options: SteamOptions) {
    this.ctx = new Context(options);
  }
  /**
   * 读取当前任务集合。
   *
   * @returns Steam 任务集合。
   */
  get tasks(): SteamTasks {
    return this.ctx.state.tasks;
  }
  /**
   * 更新当前任务集合。
   *
   * @param value - 替换当前任务列表的数据集合。
   */
  set tasks(value: SteamTasks) {
    this.ctx.state.tasks = createTasks(value);
  }
  /**
   * 读取当前任务白名单。
   *
   * @returns Steam 任务集合。
   */
  get whiteList(): SteamTasks {
    return this.ctx.state.whiteList;
  }
  /**
   * 更新当前任务白名单。
   *
   * @param value - 替换当前白名单的任务集合。
   */
  set whiteList(value: SteamTasks) {
    this.ctx.state.whiteList = createTasks(value);
  }
  /**
   * 注册状态事件监听器。
   *
   * @param event - 要订阅的事件名称。
   * @param listener - 接收状态变化的监听函数。
   * @returns 用于移除当前监听器的清理函数。
   * @throws Error - 触发 'Unknown event' 错误条件时抛出。
   */
  on(event: 'status', listener: SteamListener): () => void {
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
  init(type: InitType = 'all'): Promise<boolean> {
    return this.ctx.enqueue(() => {
      return initialize(this.ctx, type);
    });
  }
  /**
   * 执行当前模块的任务。
   *
   * @param options - 本次操作的配置选项；默认值为 `{}`。
   * @returns Promise，完成后返回Steam 任务执行汇总。
   */
  do(options: SteamTaskOptions = {}): Promise<SteamTaskResult> {
    return this.ctx.enqueue(() => {
      return doTasks(this.ctx, options);
    });
  }
  /**
   * 撤销当前模块的任务。
   *
   * @param options - 本次操作的配置选项；默认值为 `{}`。
   * @returns Promise，完成后返回Steam 任务执行汇总。
   */
  undo(options: SteamTaskOptions = {}): Promise<SteamTaskResult> {
    return this.ctx.enqueue(() => {
      return undoTasks(this.ctx, options);
    });
  }
  /**
   * 查询 Steam 鉴赏家标识。
   *
   * @param path - 请求路径。
   * @param name - 目标名称。
   * @returns Promise，完成后返回处理后的字符串；未取得有效结果时返回 false。
   */
  getCuratorId(path: string, name: string): Promise<string | false> {
    return this.ctx.enqueue(() => {
      return getCuratorId(this.ctx, path, name);
    });
  }
  /**
   * 更新任务白名单并写入持久化存储。
   *
   * @param value - 需要保存的任务白名单。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  setWhiteList(value: Partial<SteamTasks>): Promise<boolean> {
    return this.ctx.enqueue(() => {
      return this.ctx.run('whitelist.set', undefined, false, async (ctx) => {
        await loadState(ctx);
        const next = createTasks({
          ...ctx.state.whiteList,
          ...value
        });
        await ctx.storage.set('whiteList', next);
        ctx.state.whiteList = next;
        return true;
      });
    });
  }
  /**
   * 读取游戏时长任务的运行状态。
   *
   * @returns Promise，完成后返回游戏时长任务的运行状态；未取得有效结果时返回 false。
   */
  getPlayState(): Promise<PlayState | false> {
    return this.ctx.enqueue(() => {
      return this.ctx.run<PlayState | false>('play.state', undefined, false, getPlayState);
    });
  }
  /**
   * 停止正在执行的游戏运行任务。
   *
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  stopPlayGames(): Promise<boolean> {
    return this.ctx.enqueue(() => {
      return stopPlayGames(this.ctx);
    });
  }
  /**
   * 恢复 Steam 商店地区。
   *
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  resetArea(): Promise<boolean> {
    return this.ctx.enqueue(() => {
      return this.ctx.run('region.reset', undefined, false, resetRegion);
    });
  }
  /**
   * 释放模块资源并结束待处理的监听或等待。
   */
  dispose(): void {
    this.ctx.state.disposed = true;
    for (const off of this.ctx.unsubscribers) {
      off();
    }
    for (const executor of this.ctx.executors) {
      executor.client.dispose();
    }
    this.ctx.events.clear();
  }
}
export default Steam;
