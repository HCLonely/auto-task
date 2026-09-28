import type { Context } from '../context';
import type { SocialTaskDetailResult, SocialTaskResult, TaskOptions } from '../types';
import { doChannel, undoChannel } from './channel';

export function channelFromLink(link: string): string | undefined {
  try {
    const url = new URL(link);
    if (url.protocol !== 'https:' || !['www.twitch.tv', 'twitch.tv'].includes(url.hostname) || url.username || url.password || url.port) return undefined;
    const match = url.pathname.match(/^\/([a-zA-Z0-9_]+)\/?$/);
    return match?.[1].toLowerCase();
  } catch { return undefined; }
}

function delay(ctx: Context): Promise<void> {
  if (ctx.state.disposed || ctx.channelDelayMs === 0) return Promise.resolve();
  return new Promise((resolve) => {
    const finish = () => { clearTimeout(timer); ctx.state.cleanups.delete(finish); resolve(); };
    const timer = setTimeout(finish, ctx.channelDelayMs);
    ctx.state.cleanups.add(finish);
  });
}

function executeTasks(ctx: Context, { channelLinks = [] }: TaskOptions, action: 'do' | 'undo'): Promise<SocialTaskResult> {
  const doTask = action === 'do';
  const job = ctx.state.batchQueue.then(() => ctx.run(doTask ? 'do' : 'undo', undefined, async (ctx): Promise<SocialTaskResult> => {
    if (!ctx.state.initialized || ctx.state.disposed) { ctx.progress(ctx.state.disposed ? 'DISPOSED' : 'AUTH_REQUIRED', 'error'); return false; }
    const result: SocialTaskDetailResult = { success: true, results: { channelLinks: Object.create(null) } };
    const done = new Map<string, boolean>();
    const enabled = doTask ? ctx.followEnabled : ctx.unfollowEnabled;
    let started = false;
    for (const link of channelLinks) {
      const name = channelFromLink(link);
      let ok = false;
      if (!enabled) ok = await ctx.forTaskLink(link).run(doTask ? 'channel.follow' : 'channel.unfollow', name || link, async (child) => { child.skip('CONFIG_SKIP'); return true; }, Boolean);
      else if (name) {
        if (!done.has(name)) {
          if (started) await delay(ctx);
          started = true;
          done.set(name, await (doTask ? doChannel : undoChannel)(ctx.forTaskLink(link), name));
        }
        ok = done.get(name)!;
      } else ctx.progress('INVALID_CHANNEL_LINK', 'warning');
      result.results.channelLinks[link] = ok;
      result.success = result.success && ok;
    }
    if (!enabled) ctx.skip('CONFIG_SKIP');
    return result;
  }, (value) => typeof value === 'boolean' ? value : value.success));
  ctx.state.batchQueue = job.catch(() => undefined);
  return job.catch(() => false);
}

export function doTasks(ctx: Context, options: TaskOptions = {}): Promise<SocialTaskResult> { return executeTasks(ctx, options, 'do'); }
export function undoTasks(ctx: Context, options: TaskOptions = {}): Promise<SocialTaskResult> { return executeTasks(ctx, options, 'undo'); }
