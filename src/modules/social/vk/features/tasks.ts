/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/vk/features/tasks.ts
 * @Description  : VK 批量任务执行与撤销
 */

import type { Context } from '../context';
import type { SocialTaskDetailResult, SocialTaskResult, TaskOptions } from '../types';
import { getTarget, normalizeLink } from '../utils/targets';
import { normalizeNames } from '../whiteList';
import { doGroup, undoGroup } from './groups';
import { doLikeWall, undoLikeWall } from './likes';
import { deleteWall, sendWall } from './reposts';

/**
 * 执行单项任务操作。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param name - 目标名称。
 * @param doTask - 是否执行任务；为 false 时执行撤销操作。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
function executeOne(ctx: Context, name: string, doTask: boolean): Promise<boolean> {
  return ctx.run(doTask ? 'task.do' : 'task.undo', name, false, async (ctx) => {
    if (ctx.state.disposed) {
      return ctx.fail('DISPOSED');
    }
    if (!doTask && normalizeNames(ctx.state.whiteList.names).includes(name)) {
      return ctx.skip('WHITELIST_SKIP');
    }
    const target = await getTarget(ctx, name);
    if (!target) {
      return false;
    }
    if (target.type === 'group') {
      return (doTask ? doGroup : undoGroup)(ctx, name, target.params);
    }
    if (target.like) {
      return (doTask ? doLikeWall : undoLikeWall)(ctx, target.name);
    }
    return doTask ? sendWall(ctx, target.name) : deleteWall(ctx, target.name);
  });
}

/**
 * 按选项调度批量任务并记录每项结果。
 *
 * @remarks
 * 解构参数包含：nameLinks（对应字段值）。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param action - 待执行的动作。
 * @returns Promise，完成后返回包含各任务执行情况的汇总结果。
 */
function executeTasks(ctx: Context, { nameLinks = [] }: TaskOptions, action: 'do' | 'undo'): Promise<SocialTaskResult> {
  const doTask = action === 'do';
  return ctx.run<SocialTaskResult>(doTask ? 'tasks.do' : 'tasks.undo', undefined, false, async (ctx) => {
    if (ctx.state.disposed) {
      return ctx.fail('DISPOSED');
    }
    if (!ctx.state.initialized) {
      return ctx.fail('AUTH_REQUIRED');
    }
    const result: SocialTaskDetailResult = {
      success: true,
      results: {}
    };
    const enabled = doTask ? ctx.options.doTaskEnabled !== false : ctx.options.undoTaskEnabled !== false;
    const links = [...new Set(nameLinks)];
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      let success: boolean;
      if (!enabled) {
        ctx.skip('TASK_DISABLED');
        success = await ctx.forTaskLink(link).run(doTask ? 'task.do' : 'task.undo', normalizeLink(link) || link, false, async (child) => {
          return child.skip('TASK_DISABLED');
        });
      } else {
        const name = normalizeLink(link);
        success = name ? await executeOne(ctx.forTaskLink(link), name, doTask) : ctx.fail('INVALID_LINK');
      }
      result.results.nameLinks ||= {};
      Object.defineProperty(result.results.nameLinks, link, {
        value: success,
        enumerable: true,
        configurable: true,
        writable: true
      });
      result.success = result.success && success;
      // Sequential execution also prevents one batch racing a repost and its cache write.
      if (enabled && i < links.length - 1 && !ctx.state.disposed) {
        await new Promise<void>((resolve) => {
          return setTimeout(resolve, ctx.options.intervalMs ?? 1000);
        });
      }
    }
    return result;
  }, (value) => {
    return typeof value === 'boolean' ? value : value.success;
  });
}

/**
 * 执行所选社交任务并汇总结果。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param options - 本次操作的配置选项；默认值为 `{}`。
 * @returns Promise，完成后返回包含各任务执行情况的汇总结果。
 */
export function doTasks(ctx: Context, options: TaskOptions = {}): Promise<SocialTaskResult> {
  return executeTasks(ctx, options, 'do');
}
/**
 * 撤销所选社交任务并汇总结果。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param options - 本次操作的配置选项；默认值为 `{}`。
 * @returns Promise，完成后返回包含各任务执行情况的汇总结果。
 */
export function undoTasks(ctx: Context, options: TaskOptions = {}): Promise<SocialTaskResult> {
  return executeTasks(ctx, options, 'undo');
}
