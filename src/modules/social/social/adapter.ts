/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:35:45
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/social/adapter.ts
 * @Description  : 社交任务适配器接口
 */

import { Social } from './Social';
import type { InitOptions, InitResult, SocialModule, SocialTaskResult, StatusListener, TaskOptions } from './types';

/**
 * 封装独立模块并保留其原有 API 与存储行为。
 *
 * @typeParam C - C 泛型参数的类型约束。
 */
export class SocialAdapter<C extends SocialModule> extends Social<TaskOptions<C>, InitOptions<C>, C['tasks']> {
  /**
   * 创建 SocialAdapter 实例并初始化所需状态。
   *
   * @param client - 目标模块客户端。
   */
  constructor(readonly client: C) {
    super();
  }
  /**
   * 读取当前任务集合。
   *
   * @returns 处理结果（C["tasks"]）。
   */
  get tasks(): C['tasks'] {
    return this.client.tasks;
  }
  /**
   * 初始化模块并检查运行所需的授权状态。
   *
   * @param options - 本次操作的配置选项；可省略。
   * @returns Promise，完成后返回模块初始化结果。
   */
  init(options?: InitOptions<C>): Promise<InitResult> {
    const init = this.client.init as (options?: InitOptions<C>) => Promise<InitResult>;
    return init.call(this.client, options);
  }
  /**
   * 执行当前模块的任务。
   *
   * @param options - 本次操作的配置选项。
   * @returns Promise，完成后返回包含各任务执行情况的汇总结果。
   */
  do(options: TaskOptions<C>): Promise<SocialTaskResult> {
    const execute = this.client.do as (options: TaskOptions<C>) => Promise<SocialTaskResult>;
    return execute.call(this.client, options);
  }
  /**
   * 撤销当前模块的任务。
   *
   * @param options - 本次操作的配置选项。
   * @returns Promise，完成后返回包含各任务执行情况的汇总结果。
   */
  undo(options: TaskOptions<C>): Promise<SocialTaskResult> {
    const execute = this.client.undo as (options: TaskOptions<C>) => Promise<SocialTaskResult>;
    return execute.call(this.client, options);
  }
  /**
   * 注册状态事件监听器。
   *
   * @param event - 要订阅的事件名称。
   * @param listener - 接收状态变化的监听函数。
   * @returns 用于移除当前监听器的清理函数。
   */
  on(event: 'status', listener: StatusListener): () => void {
    return this.client.on(event, listener);
  }
  /**
   * 释放模块资源并结束待处理的监听或等待。
   */
  dispose(): void {
    this.client.dispose();
  }
}
