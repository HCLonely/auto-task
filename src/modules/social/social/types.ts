/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:35:45
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/social/types.ts
 * @Description  : 社交任务公共类型定义
 */

export type InitResult = boolean | 'skip';
export interface SocialTaskDetailResult {
  success: boolean;
  results: Record<string, Record<string, boolean> | undefined>;
}
export type SocialTaskResult = boolean | SocialTaskDetailResult;

export interface SocialStatusEvent {
  readonly operationId: string;
  readonly parentOperationId?: string;
  readonly operation: string;
  readonly phase: 'start' | 'progress' | 'success' | 'failure' | 'skipped';
  readonly level: 'debug' | 'info' | 'warning' | 'error';
  readonly code: string;
  readonly target?: string;
  readonly timestamp: number;
  readonly details?: Readonly<Record<string, string | number | boolean>>;
}
/**
 * 接收模块状态事件。
 *
 * @param event - 事件名称或事件对象。
 * @returns 处理结果（void | Promise<void>）。
 */
export type StatusListener = (event: SocialStatusEvent) => void | Promise<void>;

/** Structural contract: standalone modules do not need to import or inherit Social. */
export interface SocialModule {
  readonly tasks: object;
  /**
   * 初始化模块并检查运行所需的授权状态。
   *
   * @param args - 传递给目标操作的参数列表，按调用顺序传入。
   * @returns Promise，完成后返回模块初始化结果。
   */
  init(...args: never[]): Promise<InitResult>;
  /**
   * 执行当前模块的任务。
   *
   * @param args - 传递给目标操作的参数列表，按调用顺序传入。
   * @returns Promise，完成后返回包含各任务执行情况的汇总结果。
   */
  do(...args: never[]): Promise<SocialTaskResult>;
  /**
   * 撤销当前模块的任务。
   *
   * @param args - 传递给目标操作的参数列表，按调用顺序传入。
   * @returns Promise，完成后返回包含各任务执行情况的汇总结果。
   */
  undo(...args: never[]): Promise<SocialTaskResult>;
  /**
   * 注册状态事件监听器。
   *
   * @param event - 要订阅的事件名称。
   * @param listener - 接收状态变化的监听函数。
   * @returns 用于移除当前监听器的清理函数。
   */
  on(event: 'status', listener: StatusListener): () => void;
  /**
   * 释放模块资源并结束待处理的监听或等待。
   */
  dispose(): void;
}
export type InitOptions<C extends SocialModule> = Parameters<C['init']>[0];
export type TaskOptions<C extends SocialModule> = Parameters<C['do']>[0];
