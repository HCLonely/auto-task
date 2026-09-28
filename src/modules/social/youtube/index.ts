/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/youtube/index.ts
 * @Description  : YouTube 任务模块入口
 */

import { createGMHttpClient } from './adapters/gmHttp';
import type { GMRequest } from './adapters/gmHttp';
import { updateAuth } from './auth/cookies';
import { verifyAuth } from './auth/verify';
import { Context, tasks } from './context';
import { doTasks, undoTasks } from './features/batch';
import { doChannel, undoChannel } from './features/channels';
import { getInfo as readInfo } from './features/info';
import { doLikeVideo, undoLikeVideo } from './features/videos';
import type { InfoOptions, InfoType, SocialTaskResult, StatusListener, TaskOptions, YoutubeInfo, YoutubeOptions, YoutubeTasks } from './types';

export * from './types';
export { createGMHttpClient } from './adapters/gmHttp';
export type { GMRequest, GMRequestOptions, GMRawResponse } from './adapters/gmHttp';
export { createGMCookieReader } from './adapters/gmCookies';
export { createGMStorage } from './adapters/gmStorage';

declare const GM_xmlhttpRequest: GMRequest;

/**
 * 保留双参数接口，并允许通过第三个参数注入 HTTP 请求与状态处理。
 *
 * @param link - 任务目标链接。
 * @param type - 操作或数据类型。
 * @param options - 本次操作的配置选项；默认值为 `{}`。
 * @returns Promise，完成后返回YouTube 频道或视频信息。
 */
export async function getInfo(link: string, type: InfoType, options: InfoOptions = {}): Promise<YoutubeInfo> {
  const ctx = new Context({
    http: options.http || createGMHttpClient((request) => {
      return GM_xmlhttpRequest(request);
    })
  });
  if (options.onStatus) {
    ctx.events.on(options.onStatus);
  }
  return readInfo(ctx, link, type);
}

/**
 * Youtube 社交任务客户端，封装初始化、任务操作与状态管理。
 */
export class Youtube {
  private readonly ctx: Context;
  /**
   * 创建 Youtube 实例并初始化所需状态。
   *
   * @param options - 本次操作的配置选项。
   */
  constructor(options: YoutubeOptions) {
    this.ctx = new Context(options);
  }

  /**
   * 读取当前任务集合。
   *
   * @remarks
   * Session task history, as in the original class; verification never adds a task.
   *
   * @returns YouTube 任务集合。
   */
  get tasks(): YoutubeTasks {
    return this.ctx.state.tasks;
  }
  /**
   * 更新当前任务集合。
   *
   * @param value - 替换当前任务列表的数据集合。
   */
  set tasks(value: YoutubeTasks) {
    this.ctx.state.tasks = tasks(value);
  }
  /**
   * 读取当前任务白名单。
   *
   * @returns YouTube 任务集合。
   */
  get whiteList(): YoutubeTasks {
    return this.ctx.state.whiteList;
  }
  /**
   * 更新当前任务白名单。
   *
   * @param value - 替换当前白名单的任务集合。
   */
  set whiteList(value: YoutubeTasks) {
    this.ctx.state.whiteList = tasks(value);
    this.ctx.state.whiteListOverride = tasks(value);
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
    state.init = this.ctx.run('init', undefined, false, async (ctx) => {
      if (state.initialized) {
        return true;
      }
      state.whiteList = state.whiteListOverride || tasks(await ctx.storage.get<Partial<YoutubeTasks>>('whiteList', {}));
      if (state.whiteListOverride) {
        await ctx.storage.set('whiteList', state.whiteList);
      }
      const saved = await ctx.storage.get<{ PAPISID?: unknown } | null>('auth', null);
      state.auth = typeof saved?.PAPISID === 'string' ? saved.PAPISID : '';
      if (state.auth && await verifyAuth(ctx)) {
        state.initialized = true;
        return true;
      }
      state.auth = '';
      await ctx.storage.delete('auth');
      if (!await updateAuth(ctx)) {
        return false;
      }
      if (!await verifyAuth(ctx)) {
        state.auth = '';
        return false;
      }
      if (state.disposed) {
        return ctx.fail('DISPOSED');
      }
      await ctx.storage.set('auth', {
        PAPISID: state.auth
      });
      if (state.disposed) {
        return ctx.fail('DISPOSED');
      }
      state.initialized = true;
      return true;
    }).finally(() => {
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
   * 获取频道或视频信息。
   *
   * @param link - 任务目标链接。
   * @param type - 操作或数据类型。
   * @returns Promise，完成后返回YouTube 频道或视频信息。
   */
  getInfo(link: string, type: InfoType): Promise<YoutubeInfo> {
    return readInfo(this.ctx, link, type);
  }
  /**
   * 提供无需批量调度的单项操作接口。
   *
   * @param options - 本次操作的配置选项。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  doChannel(options: { link: string; }): Promise<boolean> {
    return doChannel(this.ctx, options);
  }
  /**
   * 取消关注频道。
   *
   * @param options - 本次操作的配置选项。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  undoChannel(options: { link: string; }): Promise<boolean> {
    return undoChannel(this.ctx, options);
  }
  /**
   * 为视频点赞。
   *
   * @param options - 本次操作的配置选项。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  doLikeVideo(options: { link: string; }): Promise<boolean> {
    return doLikeVideo(this.ctx, options);
  }
  /**
   * 取消视频点赞。
   *
   * @param options - 本次操作的配置选项。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  undoLikeVideo(options: { link: string; }): Promise<boolean> {
    return undoLikeVideo(this.ctx, options);
  }

  /**
   * 保存任务白名单。
   *
   * @param value - 待处理的值；默认值为 `this.whiteList`。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  saveWhiteList(value: Partial<YoutubeTasks> = this.whiteList): Promise<boolean> {
    return this.ctx.run('whiteList.save', undefined, false, async (ctx) => {
      const next = tasks(value);
      await ctx.storage.set('whiteList', next);
      this.whiteList = next;
      return true;
    });
  }

  /**
   * 释放模块资源并结束待处理的监听或等待。
   */
  dispose(): void {
    this.ctx.state.disposed = true;
    this.ctx.state.initialized = false;
    this.ctx.state.auth = '';
    for (const cancel of [...this.ctx.state.cleanups]) {
      cancel();
    }
    this.ctx.events.clear();
  }
}

export default Youtube;
