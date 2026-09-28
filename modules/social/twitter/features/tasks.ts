import type { Context } from '../context';
import type { TaskOptions, TwitterTaskDetailResult, TwitterTaskResult } from '../types';
import { tweetFromLink, userFromLink } from '../utils/links';
import { doRetweet, undoRetweet } from './retweets';
import { doUser, undoUser } from './users';

function executeTasks(ctx: Context, { userLinks = [], retweetLinks = [] }: TaskOptions, action: 'do' | 'undo'): Promise<TwitterTaskResult> {
  const doTask = action === 'do';
  return ctx.run<TwitterTaskResult>(doTask ? 'tasks.do' : 'tasks.undo', undefined, false, async (ctx) => {
    if (!ctx.ready()) return false;
    const result: TwitterTaskDetailResult = { success: true, results: {} };
    const flags = doTask ? ctx.options.doTask : ctx.options.undoTask;
    for (const [kind, links, parse, action] of [
      ['users', userLinks, userFromLink, doTask ? doUser : undoUser], ['retweets', retweetLinks, tweetFromLink, doTask ? doRetweet : undoRetweet]
    ] as const) {
      const type = kind === 'users' ? 'userLinks' : 'retweetLinks';
      for (const link of links) {
        let success: boolean;
        if (ctx.state.disposed) success = false;
        else if (flags?.[kind] === false) {
          success = await ctx.forTaskLink(link).run(kind === 'users' ? doTask ? 'users.follow' : 'users.unfollow' : doTask ? 'retweets.create' : 'retweets.delete', link, false, async (child) => child.skip('OPTION_DISABLED'));
        } else {
          const target = parse(link);
          if (!target) {
            success = await ctx.run('links.parse', link, false, async (child) => { child.progress('INVALID_LINK', 'error'); return false; });
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

export function doTasks(ctx: Context, options: TaskOptions = {}): Promise<TwitterTaskResult> { return executeTasks(ctx, options, 'do'); }
export function undoTasks(ctx: Context, options: TaskOptions = {}): Promise<TwitterTaskResult> { return executeTasks(ctx, options, 'undo'); }
