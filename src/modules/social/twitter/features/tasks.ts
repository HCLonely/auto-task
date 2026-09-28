/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/twitter/features/tasks.ts
 * @Description  : Twitter 批量任务执行与撤销
 */

import type { Context } from '../context';
import type { TaskOptions, TwitterTaskDetailResult, TwitterTaskResult } from '../types';
import { tweetFromLink, userFromLink } from '../utils/links';
import { doRetweet, undoRetweet } from './retweets';
import { doUser, undoUser } from './users';

/**
 * 按选项调度批量任务并记录每项结果。
 *
 * @remarks
 * 解构参数包含：userLinks（对应字段值）、retweetLinks（对应字段值）。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param action - 待执行的动作。
 * @returns Promise，完成后返回Twitter 任务执行汇总。
 */
function executeTasks(ctx: Context, {
  userLinks = [], retweetLinks = []
}: TaskOptions, action: 'do' | 'undo'): Promise<TwitterTaskResult> {
  const doTask = action === 'do';
  return ctx.run<TwitterTaskResult>(doTask ? 'tasks.do' : 'tasks.undo', undefined, false, async (ctx) => {
    if (!ctx.ready()) {
      return false;
    }
    const result: TwitterTaskDetailResult = {
      success: true,
      results: {}
    };
    const flags = doTask ? ctx.options.doTask : ctx.options.undoTask;
    for (const [kind, links, parse, action] of [
      ['users', userLinks, userFromLink, doTask ? doUser : undoUser], ['retweets', retweetLinks, tweetFromLink, doTask ? doRetweet : undoRetweet]
    ] as const) {
      const type = kind === 'users' ? 'userLinks' : 'retweetLinks';
      for (const link of links) {
        let success: boolean;
        if (ctx.state.disposed) {
          success = false;
        } else if (flags?.[kind] === false) {
          success = await ctx.forTaskLink(link).run(kind === 'users' ? (doTask ? 'users.follow' : 'users.unfollow') : (doTask ? 'retweets.create' : 'retweets.delete'), link, false, async (child) => {
            return child.skip('OPTION_DISABLED');
          });
        } else {
          const target = parse(link);
          if (!target) {
            success = await ctx.run('links.parse', link, false, async (child) => {
              child.progress('INVALID_LINK', 'error');
              return false;
            });
          } else {
            success = await action(ctx.forTaskLink(link), target);
            await ctx.delay();
          }
        }
        result.results[type] ||= Object.create(null) as Record<string, boolean>;
        result.results[type]![link] = success;
        result.success = result.success && success;
      }
    }
    return result;
  });
}

/**
 * 执行所选社交任务并汇总结果。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param options - 本次操作的配置选项；默认值为 `{}`。
 * @returns Promise，完成后返回Twitter 任务执行汇总。
 */
export function doTasks(ctx: Context, options: TaskOptions = {}): Promise<TwitterTaskResult> {
  return executeTasks(ctx, options, 'do');
}
/**
 * 撤销所选社交任务并汇总结果。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param options - 本次操作的配置选项；默认值为 `{}`。
 * @returns Promise，完成后返回Twitter 任务执行汇总。
 */
export function undoTasks(ctx: Context, options: TaskOptions = {}): Promise<TwitterTaskResult> {
  return executeTasks(ctx, options, 'undo');
}
