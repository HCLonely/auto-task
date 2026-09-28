import { setCache } from '../cache';
import type { Context } from '../context';
import { encodeForm } from '../utils/html';

async function executeForum(ctx: Context, gameId: string, doTask = true): Promise<boolean> {
  return ctx.run(doTask ? 'forum.doForum' : 'forum.undoForum', gameId, async (ctx): Promise<boolean> => {
    if (ctx.state.disposed || !ctx.state.communityInitialized) {
      ctx.progress(ctx.state.disposed ? 'DISPOSED' : 'AUTH_REQUIRED', 'error');
      return false;
    }
    try {
      const forumId = await getForumId(ctx, gameId);
      if (!forumId) {
        return false;
      }
      const stepStatus = ctx.step(`${doTask ? '' : 'un'}subscribingForum`, gameId);
      const [id, feature] = forumId.split('_');
      const {
        result, data
      } = await ctx.request({
        url: `https://steamcommunity.com/forum/${id}/General/${doTask ? '' : 'un'}subscribe/${feature || '0'}/`,
        method: 'POST',
        responseType: 'json',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: encodeForm({
          sessionid: ctx.state.auth.communitySessionID
        })
      });
      if (result !== 'Success') {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      if (data?.status !== 200 || (data.response?.success !== 1 && data.response?.success !== 29)) {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      stepStatus.success('STEP_COMPLETED');
      return true;
    } catch (error) {
      ctx.reportError();
      return false;
    }
  });
}

export async function getForumId(ctx: Context, gameId: string): Promise<false | string> {
  return ctx.run('forum.getForumId', gameId, async (ctx): Promise<false | string> => {
    try {
      const stepStatus = ctx.step('gettingForumId', gameId);
      const cachedForumId = ctx.state.cache.forum[gameId];
      if (cachedForumId) {
        stepStatus.success('STEP_COMPLETED');
        return cachedForumId;
      }
      const {
        result, data
      } = await ctx.request({
        url: `https://steamcommunity.com/app/${gameId}/discussions/`,
        method: 'GET'
      });
      if (result !== 'Success') {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      if (data?.status !== 200) {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      const matchedForumId = data.responseText?.match(/General_([\d]+(_[\d]+)?)/)?.[1];
      if (!matchedForumId) {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      await setCache(ctx, 'forum', gameId, matchedForumId);
      stepStatus.success('STEP_COMPLETED');
      return matchedForumId;
    } catch (error) {
      ctx.reportError();
      return false;
    }
  });
}

export function doForum(ctx: Context, gameId: string): Promise<boolean> {
  return executeForum(ctx, gameId, true);
}
export function undoForum(ctx: Context, gameId: string): Promise<boolean> {
  return executeForum(ctx, gameId, false);
}
