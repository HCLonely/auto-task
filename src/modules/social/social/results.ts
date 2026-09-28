/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/social/results.ts
 * @Description  : 社交任务结果构建与参数处理
 */

import type { SocialTaskDetailResult } from './types';

/**
 * 创建空的社交任务明细结果。
 *
 * @returns 按类型与目标记录的任务明细。
 */
export function createTaskResult(): SocialTaskDetailResult {
  return {
    success: true,
    results: {}
  };
}

/**
 * 链接和类型键均作为普通数据处理，包括 __proto__ 和 constructor 等名称。
 *
 * @param result - 当前操作结果。
 * @param type - 操作或数据类型。
 * @param value - 待处理的值。
 * @param success - 成功状态或成功判定回调。
 */
export function setTaskResult(result: SocialTaskDetailResult, type: string, value: string, success: boolean): void {
  if (!Object.hasOwn(result.results, type) || !result.results[type]) {
    Object.defineProperty(result.results, type, {
      value: {},
      enumerable: true,
      writable: true,
      configurable: true
    });
  }
  Object.defineProperty(result.results[type], value, {
    value: success,
    enumerable: true,
    writable: true,
    configurable: true
  });
  result.success = result.success && success;
}

/**
 * 规范化链接；撤销时补充已记录的任务，并去除重复项。
 *
 * @remarks
 * 撤销任务时会合并此前记录的目标，再对规范化结果去重。
 *
 * @param links - 任务目标链接列表。
 * @param doTask - 是否执行任务；为 false 时执行撤销操作。
 * @param recorded - 此前记录的任务目标。
 * @param link2param - 将链接转换为目标参数的函数。
 * @returns 处理后的字符串列表。
 */
export function getRealParams(links: readonly string[], doTask: boolean, recorded: readonly string[], link2param: (link: string) => string | undefined): string[] {
  const converted = links.map(link2param).filter((value): value is string => {
    return value !== undefined;
  });
  return [...new Set([...converted, ...(!doTask ? recorded : [])])];
}
