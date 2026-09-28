import type { Context } from '../context';
import type { RedditTarget, SocialTaskDetailResult, SocialTaskResult, TaskOptions } from '../types';
import { parseRedditLink } from '../utils/links';
import { doSubreddit, undoSubreddit } from './subreddit';
import { doUser, undoUser } from './user';

function executeTarget(ctx: Context, target: RedditTarget, doTask: boolean): Promise<boolean> {
  const operation = target.kind === 'user' ? (doTask ? 'user.follow' : 'user.unfollow') : (doTask ? 'subreddit.subscribe' : 'subreddit.unsubscribe');
  return ctx.run(operation, target.taskName, async (ctx) => {
    try {
      if (ctx.state.disposed) {
        return ctx.fail('DISPOSED');
      }
      if (!doTask && ctx.state.whiteList.reddits.some((name) => {
        return name.toLowerCase() === target.taskName.toLowerCase();
      })) {
        return ctx.skip('WHITELIST_SKIPPED');
      }
      const ok = await (target.kind === 'user' ? (doTask ? doUser : undoUser)(ctx, target.name) : (doTask ? doSubreddit : undoSubreddit)(ctx, target.name));
      if (ok && doTask && !ctx.state.tasks.reddits.includes(target.taskName)) {
        ctx.state.tasks.reddits.push(target.taskName);
      }
      return ok;
    } catch {
      return ctx.fail('UNEXPECTED_ERROR');
    }
  }, Boolean);
}

function executeTasks(ctx: Context, options: TaskOptions, action: 'do' | 'undo'): Promise<SocialTaskResult> {
  const doTask = action === 'do';
  return ctx.run(doTask ? 'do' : 'undo', undefined, async (ctx): Promise<SocialTaskResult> => {
    try {
      if (ctx.state.disposed) {
        return ctx.fail('DISPOSED');
      }
      if (!ctx.state.initialized) {
        return ctx.fail('AUTH_REQUIRED');
      }
      const { redditLinks = [] } = options;
      if (typeof doTask !== 'boolean' || !Array.isArray(redditLinks) || redditLinks.some((link) => {
        return typeof link !== 'string';
      })) {
        return ctx.fail('INVALID_ARGUMENT');
      }
      const result: SocialTaskDetailResult = {
        success: true,
        results: {}
      };
      const enabled = doTask ? ctx.doTaskEnabled : ctx.undoTaskEnabled;
      if (!enabled) {
        ctx.skip('CONFIG_SKIPPED');
      }
      for (const [index, link] of [...new Set(redditLinks)].entries()) {
        if (index > 0 && enabled) {
          await ctx.delay();
        }
        const target = parseRedditLink(link);
        let ok = false;
        if (!ctx.state.disposed) {
          const child = ctx.forTaskLink(link);
          if (!enabled) {
            const operation = target?.kind === 'user' ? (doTask ? 'user.follow' : 'user.unfollow') : (doTask ? 'subreddit.subscribe' : 'subreddit.unsubscribe');
            ok = await child.run(operation, target?.taskName || link, async (step) => {
              return step.skip('CONFIG_SKIPPED');
            }, Boolean);
          } else if (target) {
            ok = await executeTarget(child, target, doTask);
          }
        }
        if (!target && enabled) {
          ctx.progress('INVALID_LINK');
        }
        result.results.redditLinks ||= Object.create(null) as Record<string, boolean>;
        result.results.redditLinks[link] = ok;
        result.success = result.success && ok;
      }
      return result;
    } catch {
      return ctx.fail('UNEXPECTED_ERROR');
    }
  }, (value) => {
    return typeof value === 'boolean' ? value : value.success;
  });
}

export function doTasks(ctx: Context, options: TaskOptions = {}): Promise<SocialTaskResult> {
  return executeTasks(ctx, options, 'do');
}
export function undoTasks(ctx: Context, options: TaskOptions = {}): Promise<SocialTaskResult> {
  return executeTasks(ctx, options, 'undo');
}
