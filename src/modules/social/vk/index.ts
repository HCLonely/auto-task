/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/vk/index.ts
 * @Description  : VK 任务模块入口
 */

import { verifyAuth } from './auth/session';
import { updateAuth } from './auth/token';
import { loadCache } from './cache';
import { Context } from './context';
import { doTasks, undoTasks } from './features/tasks';
import type { SocialTaskResult, StatusListener, TaskOptions, VkOptions, VkTasks } from './types';
import { loadWhiteList, setWhiteList } from './whiteList';

export * from './types';
export { createGMHttpClient } from './adapters/gmHttp';
export type { GMRequest, GMRawResponse, GMRequestOptions } from './adapters/gmHttp';
export { createGMStorage } from './adapters/gmStorage';

/**
 * 浏览器用户脚本中的独立 VK 模块，不进行全局注册。
 */
export class Vk {
  private readonly ctx: Context;
  private queue: Promise<unknown> = Promise.resolve();
  /**
   * 创建 Vk 实例并初始化所需状态。
   *
   * @param options - 本次操作的配置选项。
   */
  constructor(options: VkOptions) {
    this.ctx = new Context(options);
  }

  /**
   * 读取当前任务集合。
   *
   * @returns VK 任务集合。
   */
  get tasks(): VkTasks {
    return this.ctx.state.tasks;
  }
  /**
   * 更新当前任务集合。
   *
   * @param value - 替换当前任务列表的数据集合。
   */
  set tasks(value: VkTasks) {
    this.ctx.state.tasks = value;
  }
  /**
   * 读取当前任务白名单。
   *
   * @returns VK 任务集合。
   */
  get whiteList(): VkTasks {
    return this.ctx.state.whiteList;
  }
  /**
   * 更新当前任务白名单。
   *
   * @param value - 替换当前白名单的任务集合。
   */
  set whiteList(value: VkTasks) {
    this.ctx.state.whiteList = value;
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
      if (state.disposed) {
        return ctx.fail('DISPOSED');
      }
      if (state.initialized) {
        return true;
      }
      state.token = '';
      // Read current API parameters before requesting a token, retaining defaults if absent.
      if (!await verifyAuth(ctx) || !await updateAuth(ctx)) {
        return false;
      }
      await loadCache(ctx);
      await loadWhiteList(ctx);
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
    const snapshot = {
      ...options,
      nameLinks: [...(options.nameLinks || [])]
    };
    const job = this.queue.then(() => {
      return doTasks(this.ctx, snapshot);
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
    const snapshot = {
      ...options,
      nameLinks: [...(options.nameLinks || [])]
    };
    const job = this.queue.then(() => {
      return undoTasks(this.ctx, snapshot);
    });
    this.queue = job.catch(() => {
      return undefined;
    });
    return job;
  }

  /**
   * 通过此方法保存白名单，使变更在重新加载脚本后仍然有效。
   *
   * @param value - 需要保存的任务白名单。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  setWhiteList(value: VkTasks): Promise<boolean> {
    return setWhiteList(this.ctx, value);
  }

  /**
   * 释放模块资源并结束待处理的监听或等待。
   */
  dispose(): void {
    this.ctx.state.disposed = true;
    this.ctx.state.initialized = false;
    this.ctx.state.token = '';
    this.ctx.events.clear();
  }
}
export default Vk;
