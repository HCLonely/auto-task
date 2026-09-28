/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/twitch/index.ts
 * @Description  : Twitch 任务模块入口
 */

import { checkIntegrity } from './auth/integrity';
import { updateAuth } from './auth/updateAuth';
import { verifyToken } from './auth/verifyToken';
import { Context } from './context';
import { doTasks, undoTasks } from './features/tasks';
import { channels, loadState } from './storage';
import type { SocialTaskResult, StatusListener, TaskOptions, TwitchOptions, TwitchTasks } from './types';

export * from './types';
export { createGMHttpClient } from './adapters/gmHttp';
export type { GMRequest, GMRequestOptions, GMRawResponse } from './adapters/gmHttp';
export { createGMStorage } from './adapters/gmStorage';
export { handleTwitchAuthPage, readTwitchAuth } from './auth/pageAuth';
export type { TwitchPageWindow } from './auth/pageAuth';

/**
 * Twitch 社交任务客户端，封装初始化、任务操作与状态管理。
 */
export class Twitch {
  private readonly ctx: Context;
  /**
   * 创建 Twitch 实例并初始化所需状态。
   *
   * @param options - 本次操作的配置选项。
   */
  constructor(options: TwitchOptions) {
    this.ctx = new Context(options);
  }
  /**
   * 读取当前任务集合。
   *
   * @returns Twitch 任务集合。
   */
  get tasks(): TwitchTasks {
    return this.ctx.state.tasks;
  }
  /**
   * 更新当前任务集合。
   *
   * @param value - 替换当前任务列表的数据集合。
   */
  set tasks(value: TwitchTasks) {
    this.ctx.state.tasks = {
      channels: channels(value.channels)
    };
    this.ctx.state.tasksOverridden = true;
  }
  /**
   * 读取当前任务白名单。
   *
   * @returns Twitch 任务集合。
   */
  get whiteList(): TwitchTasks {
    return this.ctx.state.whiteList;
  }
  /**
   * 更新当前任务白名单。
   *
   * @param value - 替换当前白名单的任务集合。
   */
  set whiteList(value: TwitchTasks) {
    this.ctx.state.whiteList = {
      channels: channels(value.channels)
    };
    this.ctx.state.whiteListOverridden = true;
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
    const { state } = this.ctx;
    if (state.init) {
      return state.init;
    }
    state.init = this.ctx.run('init', undefined, async (ctx) => {
      try {
        if (state.disposed) {
          ctx.progress('DISPOSED', 'error');
          return false;
        }
        if (state.initialized) {
          return true;
        }
        await loadState(ctx);
        if (state.auth && await verifyToken(ctx) && await checkIntegrity(ctx)) {
          state.initialized = true;
          return true;
        }
        state.auth = undefined;
        state.integrityToken = '';
        await ctx.storage.delete('auth');
        state.initialized = await updateAuth(ctx);
        if (!state.initialized) {
          state.auth = undefined;
          state.integrityToken = '';
        }
        return state.initialized;
      } catch {
        ctx.progress('INIT_FAILED', 'error');
        return false;
      }
    }, Boolean).finally(() => {
      state.init = undefined;
    });
    return state.init;
  }
  /**
   * 执行当前模块的任务。
   *
   * @param options - 本次操作的配置选项；默认值为 `{}`。
   * @returns Promise，完成后返回包含各任务执行情况的汇总结果。
   */
  do(options: TaskOptions = {}): Promise<SocialTaskResult> {
    return doTasks(this.ctx, options);
  }
  /**
   * 撤销当前模块的任务。
   *
   * @param options - 本次操作的配置选项；默认值为 `{}`。
   * @returns Promise，完成后返回包含各任务执行情况的汇总结果。
   */
  undo(options: TaskOptions = {}): Promise<SocialTaskResult> {
    return undoTasks(this.ctx, options);
  }
  /**
   * 更新任务白名单并写入持久化存储。
   *
   * @param value - 需要保存的任务白名单。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  async setWhiteList(value: TwitchTasks): Promise<boolean> {
    return this.ctx.run('whiteList.update', undefined, async (ctx) => {
      try {
        if (ctx.state.disposed) {
          return false;
        }
        const normalized = {
          channels: channels(value.channels)
        };
        await ctx.storage.set('whiteList', normalized);
        ctx.state.whiteList = normalized;
        ctx.state.whiteListOverridden = true;
        return true;
      } catch {
        ctx.progress('STORAGE_FAILED', 'error');
        return false;
      }
    }, Boolean);
  }
  /**
   * 释放模块资源并结束待处理的监听或等待。
   */
  dispose(): void {
    this.ctx.state.disposed = true;
    for (const cancel of [...this.ctx.state.cleanups]) {
      cancel();
    }
    this.ctx.events.clear();
  }
}
export default Twitch;
