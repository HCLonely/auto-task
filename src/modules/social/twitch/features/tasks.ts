/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/twitch/features/tasks.ts
 * @Description  : Twitch 批量任务执行与撤销
 */

import type { Context } from '../context';
import type { SocialTaskDetailResult, SocialTaskResult, TaskOptions } from '../types';
import { doChannel, undoChannel } from './channel';

/**
 * 从链接中提取频道名称。
 *
 * @param link - 任务目标链接。
 * @returns 处理后的字符串；未取得有效结果时返回 undefined。
 */
export function channelFromLink(link: string): string | undefined {
  try {
    const url = new URL(link);
    if (url.protocol !== 'https:' || !['www.twitch.tv', 'twitch.tv'].includes(url.hostname) || url.username || url.password || url.port) {
      return undefined;
    }
    const match = url.pathname.match(/^\/([a-zA-Z0-9_]+)\/?$/);
    return match?.[1].toLowerCase();
  } catch {
    return undefined;
  }
}

/**
 * 等待配置的任务间隔。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns 在操作完成后兑现的 Promise。
 */
function delay(ctx: Context): Promise<void> {
  if (ctx.state.disposed || ctx.channelDelayMs === 0) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    /**
     * 完成当前操作并交付结果。
     */
    const finish = () => {
      clearTimeout(timer);
      ctx.state.cleanups.delete(finish);
      resolve();
    };
    const timer = setTimeout(finish, ctx.channelDelayMs);
    ctx.state.cleanups.add(finish);
  });
}

/**
 * 按选项调度批量任务并记录每项结果。
 *
 * @remarks
 * 解构参数包含：channelLinks（对应字段值）。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param action - 待执行的动作。
 * @returns Promise，完成后返回包含各任务执行情况的汇总结果。
 */
function executeTasks(ctx: Context, { channelLinks = [] }: TaskOptions, action: 'do' | 'undo'): Promise<SocialTaskResult> {
  const doTask = action === 'do';
  const job = ctx.state.batchQueue.then(() => {
    return ctx.run(doTask ? 'do' : 'undo', undefined, async (ctx): Promise<SocialTaskResult> => {
      if (!ctx.state.initialized || ctx.state.disposed) {
        ctx.progress(ctx.state.disposed ? 'DISPOSED' : 'AUTH_REQUIRED', 'error');
        return false;
      }
      const result: SocialTaskDetailResult = {
        success: true,
        results: {
          channelLinks: Object.create(null)
        }
      };
      const done = new Map<string, boolean>();
      const enabled = doTask ? ctx.followEnabled : ctx.unfollowEnabled;
      let started = false;
      for (const link of channelLinks) {
        const name = channelFromLink(link);
        let ok = false;
        if (!enabled) {
          ok = await ctx.forTaskLink(link).run(doTask ? 'channel.follow' : 'channel.unfollow', name || link, async (child) => {
            child.skip('CONFIG_SKIP');
            return true;
          }, Boolean);
        } else if (name) {
          if (!done.has(name)) {
            if (started) {
              await delay(ctx);
            }
            started = true;
            done.set(name, await (doTask ? doChannel : undoChannel)(ctx.forTaskLink(link), name));
          }
          ok = done.get(name)!;
        } else {
          ctx.progress('INVALID_CHANNEL_LINK', 'warning');
        }
        result.results.channelLinks[link] = ok;
        result.success = result.success && ok;
      }
      if (!enabled) {
        ctx.skip('CONFIG_SKIP');
      }
      return result;
    }, (value) => {
      return typeof value === 'boolean' ? value : value.success;
    });
  });
  ctx.state.batchQueue = job.catch(() => {
    return undefined;
  });
  return job.catch(() => {
    return false;
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
