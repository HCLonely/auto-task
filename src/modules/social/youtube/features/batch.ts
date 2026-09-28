/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/youtube/features/batch.ts
 * @Description  : YouTube 批量任务执行与撤销
 */

import type { Context } from '../context';
import type { SocialTaskDetailResult, SocialTaskResult, TaskOptions } from '../types';
import { eventTarget } from '../utils/links';
import { doChannel, undoChannel } from './channels';
import { doLikeVideo, undoLikeVideo } from './videos';

/**
 * 按原始链接记录结果，并保留错开启动时间的并发调度方式。
 *
 * @remarks
 * 解构参数包含：channelLinks（对应字段值）、videoLinks（对应字段值）。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param action - 待执行的动作。
 * @returns Promise，完成后返回包含各任务执行情况的汇总结果。
 */
async function executeTasks(ctx: Context, {
  channelLinks = [], videoLinks = []
}: TaskOptions, action: 'do' | 'undo'): Promise<SocialTaskResult> {
  const doTask = action === 'do';
  return ctx.run<SocialTaskResult>(doTask ? 'tasks.do' : 'tasks.undo', undefined, false, async (ctx) => {
    if (!ctx.state.initialized) {
      return ctx.fail('AUTH_REQUIRED');
    }
    if (![channelLinks, videoLinks].every((links) => {
      return Array.isArray(links) && links.every((link) => {
        return typeof link === 'string';
      });
    })) {
      return ctx.fail('INVALID_ARGUMENT');
    }
    const result: SocialTaskDetailResult = {
      success: true,
      results: {}
    };
    const options = doTask ? ctx.options.doTask : ctx.options.undoTask;
    const pending: Promise<void>[] = [];
    const jobs = [
      ...channelLinks.map((link) => {
        return {
          link,
          key: 'channelLinks',
          enabled: options.channels,
          action: doTask ? doChannel : undoChannel
        };
      }),
      ...videoLinks.map((link) => {
        return {
          link,
          key: 'videoLinks',
          enabled: options.likes,
          action: doTask ? doLikeVideo : undoLikeVideo
        };
      })
    ];
    for (let index = 0; index < jobs.length; index++) {
      const {
        link, key, enabled, action
      } = jobs[index];
      result.results[key] ||= Object.create(null) as Record<string, boolean>;
      const promise = enabled ? action(ctx.forTaskLink(link), {
        link
      }) :
        ctx.forTaskLink(link).run(key === 'channelLinks' ? (doTask ? 'channel.subscribe' : 'channel.unsubscribe') : (doTask ? 'video.like' : 'video.unlike'), eventTarget(link), false, async (ctx) => {
          return ctx.skip('OPTION_DISABLED');
        });
      pending.push(promise.then((success) => {
        result.results[key][link] = success;
        result.success = result.success && success;
      }));
      if (enabled && index < jobs.length - 1) {
        await ctx.delay(ctx.options.taskDelayMs);
      }
    }
    await Promise.all(pending);
    return result;
  }, (result) => {
    return typeof result === 'boolean' ? result : result.success;
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
