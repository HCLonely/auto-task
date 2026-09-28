/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:35:45
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/social/Social.ts
 * @Description  : 社交任务通用基类
 */

import { createTaskResult, getRealParams, setTaskResult } from './results';
import type { InitResult, SocialTaskDetailResult, SocialTaskResult, StatusListener } from './types';

/**
 * 提供不依赖项目运行环境的社交任务通用基类。
 *
 * @typeParam Tasks - 任务集合类型。
 * @typeParam Init - 模块初始化选项类型。
 * @typeParam Params - 执行与撤销任务的参数类型。
 */
export abstract class Social<Params = Record<string, unknown>, Init = void, Tasks extends object = Record<string, string[]>> {
  /**
   * 读取当前任务集合。
   *
   * @returns 处理结果（Tasks）。
   */
  abstract get tasks(): Tasks;
  /**
   * 初始化模块并检查运行所需的授权状态。
   *
   * @param options - 本次操作的配置选项；可省略。
   * @returns Promise，完成后返回模块初始化结果。
   */
  abstract init(options?: Init): Promise<InitResult>;
  /**
   * 执行当前模块的任务。
   *
   * @param options - 本次操作的配置选项。
   * @returns Promise，完成后返回包含各任务执行情况的汇总结果。
   */
  abstract do(options: Params): Promise<SocialTaskResult>;
  /**
   * 撤销当前模块的任务。
   *
   * @param options - 本次操作的配置选项。
   * @returns Promise，完成后返回包含各任务执行情况的汇总结果。
   */
  abstract undo(options: Params): Promise<SocialTaskResult>;
  /**
   * 注册状态事件监听器。
   *
   * @param event - 要订阅的事件名称。
   * @param listener - 接收状态变化的监听函数。
   * @returns 用于移除当前监听器的清理函数。
   */
  abstract on(event: 'status', listener: StatusListener): () => void;
  /**
   * 释放模块资源并结束待处理的监听或等待。
   */
  abstract dispose(): void;

  /**
   * 创建空的社交任务明细结果。
   *
   * @returns 按类型与目标记录的任务明细。
   */
  protected createTaskResult(): SocialTaskDetailResult {
    return createTaskResult();
  }
  /**
   * 按任务类型和目标写入执行结果。
   *
   * @param result - 当前操作结果。
   * @param type - 操作或数据类型。
   * @param value - 待处理的值。
   * @param success - 成功状态或成功判定回调。
   */
  protected setTaskResult(result: SocialTaskDetailResult, type: string, value: string, success: boolean): void {
    setTaskResult(result, type, value, success);
  }
  /**
   * 规范化任务链接、补充撤销记录并去重。
   *
   * @remarks
   * 撤销任务时会合并此前记录的目标，再对规范化结果去重。
   *
   * @param name - 目标名称。
   * @param links - 任务目标链接列表。
   * @param doTask - 是否执行任务；为 false 时执行撤销操作。
   * @param link2param - 将链接转换为目标参数的函数。
   * @returns 处理后的字符串列表。
   */
  protected getRealParams(name: keyof Tasks, links: string[], doTask: boolean, link2param: (link: string) => string | undefined): string[] {
    const recorded = this.tasks[name];
    return getRealParams(links, doTask, Array.isArray(recorded) ? recorded : [], link2param);
  }
}
export default Social;
