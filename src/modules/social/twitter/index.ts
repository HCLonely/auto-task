/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/twitter/index.ts
 * @Description  : Twitter 任务模块入口
 */

import { initialize } from './auth/initialization';
import { Context, normalizeTasks } from './context';
import { doRetweet, undoRetweet } from './features/retweets';
import { doTasks, undoTasks } from './features/tasks';
import { doUser, undoUser, userName2id } from './features/users';
import type { StatusListener, TaskOptions, TwitterOptions, TwitterTasks, TwitterTaskResult } from './types';

export * from './types';
export { createGMHttpClient } from './adapters/gmHttp';
export type { GMRawResponse, GMRequest, GMRequestOptions } from './adapters/gmHttp';
export { createGMStorage } from './adapters/gmStorage';
export { createTransactionIdProvider } from './transaction';

/**
 * 用于用户脚本环境的独立 Twitter 客户端；构造时不执行输入输出操作。
 */
export class Twitter {
  private readonly ctx: Context;
  /**
   * 创建 Twitter 实例并初始化所需状态。
   *
   * @param options - 本次操作的配置选项。
   */
  constructor(options: TwitterOptions) {
    this.ctx = new Context(options);
  }
  /**
   * 读取当前任务集合。
   *
   * @returns Twitter 任务集合。
   */
  get tasks(): TwitterTasks {
    return this.ctx.state.tasks;
  }
  /**
   * 更新当前任务集合。
   *
   * @param value - 替换当前任务列表的数据集合。
   */
  set tasks(value: TwitterTasks) {
    this.ctx.state.tasks = normalizeTasks(value);
  }
  /**
   * 读取当前任务白名单。
   *
   * @returns Twitter 任务集合。
   */
  get whiteList(): TwitterTasks {
    return this.ctx.state.whiteList;
  }
  /**
   * 更新当前任务白名单。
   *
   * @param value - 替换当前白名单的任务集合。
   */
  set whiteList(value: TwitterTasks) {
    this.ctx.state.whiteList = normalizeTasks(value);
    this.ctx.state.whiteListConfigured = true;
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
   * 将用户名称转换为用户标识。
   *
   * @param name - 目标名称。
   * @returns Promise，完成后返回处理后的字符串；未取得有效结果时返回 false。
   */
  userName2id(name: string): Promise<string | false> {
    return userName2id(this.ctx, name);
  }
  /**
   * 执行当前模块的任务。
   *
   * @param options - 本次操作的配置选项；默认值为 `{}`。
   * @returns Promise，完成后返回Twitter 任务执行汇总。
   */
  do(options: TaskOptions = {}): Promise<TwitterTaskResult> {
    return doTasks(this.ctx, options);
  }
  /**
   * 撤销当前模块的任务。
   *
   * @param options - 本次操作的配置选项；默认值为 `{}`。
   * @returns Promise，完成后返回Twitter 任务执行汇总。
   */
  undo(options: TaskOptions = {}): Promise<TwitterTaskResult> {
    return undoTasks(this.ctx, options);
  }
  /**
   * 提供独立的单项操作，也支持 do 与 undo 批量接口。
   *
   * @param name - 目标名称。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  doUser(name: string): Promise<boolean> {
    return doUser(this.ctx, name);
  }
  /**
   * 取消关注用户。
   *
   * @param name - 目标名称。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  undoUser(name: string): Promise<boolean> {
    return undoUser(this.ctx, name);
  }
  /**
   * 转发推文。
   *
   * @param id - 目标标识。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  doRetweet(id: string): Promise<boolean> {
    return doRetweet(this.ctx, id);
  }
  /**
   * 撤销推文转发。
   *
   * @param id - 目标标识。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  undoRetweet(id: string): Promise<boolean> {
    return undoRetweet(this.ctx, id);
  }
  /**
   * 更新任务白名单并写入持久化存储。
   *
   * @param value - 需要保存的任务白名单。
   * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
   */
  setWhiteList(value: Partial<TwitterTasks>): Promise<boolean> {
    return this.ctx.run('whiteList.update', undefined, false, async (ctx) => {
      const whiteList = normalizeTasks({
        ...ctx.state.whiteList,
        ...value
      });
      await ctx.storage.set('whiteList', whiteList);
      ctx.state.whiteList = whiteList;
      ctx.state.whiteListConfigured = true;
      return true;
    });
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
   * 释放模块资源并结束待处理的监听或等待。
   */
  dispose(): void {
    this.ctx.state.disposed = true;
    this.ctx.state.initialized = false;
    for (const cancel of [...this.ctx.state.cleanups]) {
      cancel();
    }
    this.ctx.events.clear();
  }
}
export default Twitter;
