/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/reddit/index.ts
 * @Description  : Reddit 任务模块入口
 */

import { updateAuth } from './auth/session';
import { Context } from './context';
import { doTasks, undoTasks } from './features/tasks';
import { loadWhiteList, setWhiteList, validateWhiteList } from './whiteList';
import type { RedditOptions, RedditTasks, SocialTaskResult, StatusListener, TaskOptions } from './types';

export * from './types';
export { createGMHttpClient } from './adapters/gmHttp';
export type { GMRawResponse, GMRequest, GMRequestOptions } from './adapters/gmHttp';
export { createGMCookieReader } from './adapters/gmCookie';
export { createGMStorage } from './adapters/gmStorage';

/**
 * Reddit 社交任务客户端，封装初始化、任务操作与状态管理。
 */
export class Reddit {
  private readonly ctx: Context;
  private initializing?: Promise<boolean>;
  private queue: Promise<unknown> = Promise.resolve();

  /**
   * 创建 Reddit 实例并初始化所需状态。
   *
   * @param options - 本次操作的配置选项。
   */
  constructor(options: RedditOptions) {
    this.ctx = new Context(options);
  }
  /**
   * 读取当前任务集合。
   *
   * @returns Reddit 任务集合。
   */
  get tasks(): RedditTasks {
    return this.ctx.state.tasks;
  }
  /**
   * 更新当前任务集合。
   *
   * @param value - 替换当前任务列表的数据集合。
   */
  set tasks(value: RedditTasks) {
    this.ctx.state.tasks = validateWhiteList(value);
  }
  /**
   * 读取当前任务白名单。
   *
   * @returns Reddit 任务集合。
   */
  get whiteList(): RedditTasks {
    return this.ctx.state.whiteList;
  }
  /**
   * 更新当前任务白名单。
   *
   * @param value - 替换当前白名单的任务集合。
   */
  set whiteList(value: RedditTasks) {
    this.ctx.state.whiteList = validateWhiteList(value);
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
    if (this.initializing) {
      return this.initializing;
    }
    this.initializing = this.ctx.run('init', undefined, async (ctx) => {
      try {
        if (ctx.state.disposed) {
          return ctx.fail('DISPOSED');
        }
        if (ctx.state.initialized) {
          return true;
        }
        await loadWhiteList(ctx);
        ctx.state.initialized = await updateAuth(ctx);
        return ctx.state.initialized;
      } catch {
        return ctx.fail('INITIALIZATION_FAILED');
      }
    }, Boolean).finally(() => {
      this.initializing = undefined;
    });
    return this.initializing;
  }

  /**
   * 执行当前模块的任务。
   *
   * @param options - 本次操作的配置选项；默认值为 `{}`。
   * @returns Promise，完成后返回包含各任务执行情况的汇总结果。
   */
  do(options: TaskOptions = {}): Promise<SocialTaskResult> {
    const job = this.queue.then(() => {
      return doTasks(this.ctx, options);
    });
    this.queue = job.catch(() => {
      return undefined;
    });
    return job;
  }
  /**
   * 撤销当前模块的任务。
   *
   * @param options - 本次操作的配置选项；默认值为 `{}`。
   * @returns Promise，完成后返回包含各任务执行情况的汇总结果。
   */
  undo(options: TaskOptions = {}): Promise<SocialTaskResult> {
    const job = this.queue.then(() => {
      return undoTasks(this.ctx, options);
    });
    this.queue = job.catch(() => {
      return undefined;
    });
    return job;
  }

  /**
   * 更新白名单并将其写入 GM 存储，供后续脚本加载使用。
   *
   * @param value - 需要保存的任务白名单。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  setWhiteList(value: RedditTasks): Promise<boolean> {
    return setWhiteList(this.ctx, value);
  }

  /**
   * 释放模块资源并结束待处理的监听或等待。
   */
  dispose(): void {
    this.ctx.state.disposed = true;
    this.ctx.state.csrfToken = '';
    for (const cancel of [...this.ctx.cancellations]) {
      cancel();
    }
    this.ctx.events.clear();
  }
}

export default Reddit;
