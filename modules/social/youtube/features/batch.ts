import type { Context } from '../context';
import type { SocialTaskDetailResult, SocialTaskResult, TaskOptions } from '../types';
import { eventTarget } from '../utils/links';
import { doChannel, undoChannel } from './channels';
import { doLikeVideo, undoLikeVideo } from './videos';

/** Preserve per-original-link results and the original staggered concurrent scheduling. */
async function executeTasks(ctx: Context, { channelLinks = [], videoLinks = [] }: TaskOptions, action: 'do' | 'undo'): Promise<SocialTaskResult> {
  const doTask = action === 'do';
  return ctx.run<SocialTaskResult>(doTask ? 'tasks.do' : 'tasks.undo', undefined, false, async (ctx) => {
    if (!ctx.state.initialized) return ctx.fail('AUTH_REQUIRED');
    if (![channelLinks, videoLinks].every((links) => Array.isArray(links) && links.every((link) => typeof link === 'string'))) return ctx.fail('INVALID_ARGUMENT');
    const result: SocialTaskDetailResult = { success: true, results: {} };
    const options = doTask ? ctx.options.doTask : ctx.options.undoTask;
    const pending: Promise<void>[] = [];
    const jobs = [
      ...channelLinks.map((link) => ({ link, key: 'channelLinks', enabled: options.channels, action: doTask ? doChannel : undoChannel })),
      ...videoLinks.map((link) => ({ link, key: 'videoLinks', enabled: options.likes, action: doTask ? doLikeVideo : undoLikeVideo }))
    ];
    for (let index = 0; index < jobs.length; index++) {
      const { link, key, enabled, action } = jobs[index];
      result.results[key] ||= Object.create(null) as Record<string, boolean>;
      const promise = enabled ? action(ctx.forTaskLink(link), { link }) :
        ctx.forTaskLink(link).run(key === 'channelLinks' ? doTask ? 'channel.subscribe' : 'channel.unsubscribe' : doTask ? 'video.like' : 'video.unlike', eventTarget(link), false, async (ctx) => ctx.skip('OPTION_DISABLED'));
      pending.push(promise.then((success) => {
        result.results[key][link] = success;
        result.success = result.success && success;
      }));
      if (enabled && index < jobs.length - 1) await ctx.delay(ctx.options.taskDelayMs);
    }
    await Promise.all(pending);
    return result;
  }, (result) => typeof result === 'boolean' ? result : result.success);
}

export function doTasks(ctx: Context, options: TaskOptions = {}): Promise<SocialTaskResult> { return executeTasks(ctx, options, 'do'); }
export function undoTasks(ctx: Context, options: TaskOptions = {}): Promise<SocialTaskResult> { return executeTasks(ctx, options, 'undo'); }
