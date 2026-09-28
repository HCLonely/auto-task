import { setCache } from '../cache';
import type { Context } from '../context';
import { encodeForm } from '../utils/html';

async function executeFavoriteWorkshop(ctx: Context, id: string, doTask = true): Promise<boolean> {
  return ctx.run(doTask ? 'workshop.doFavoriteWorkshop' : 'workshop.undoFavoriteWorkshop', id, async (ctx): Promise<boolean> => {
    if (ctx.state.disposed || !ctx.state.communityInitialized) {
      ctx.progress(ctx.state.disposed ? 'DISPOSED' : 'AUTH_REQUIRED', 'error');
      return false;
    }
    try {
      const appid = await getWorkshopAppId(ctx, id);
      if (!appid) {
        return false;
      }
      const stepStatus = ctx.step(doTask ? 'favoritingWorkshop' : 'unfavoritingWorkshop', id);
      const {
        result, data
      } = await ctx.request({
        url: `https://steamcommunity.com/sharedfiles/${doTask ? '' : 'un'}favorite`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: encodeForm({
          id,
          appid,
          sessionid: ctx.state.auth.communitySessionID
        })
      });
      if (result !== 'Success') {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      if (data?.status !== 200 || data.responseText) {
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

export async function getWorkshopAppId(ctx: Context, id: string): Promise<false | string> {
  return ctx.run('workshop.getWorkshopAppId', id, async (ctx): Promise<false | string> => {
    try {
      const stepStatus = ctx.step('gettingWorkshopAppId', id);
      const cachedAppId = ctx.state.cache.workshop[id];
      if (cachedAppId) {
        stepStatus.success('STEP_COMPLETED');
        return cachedAppId;
      }
      const {
        result, data
      } = await ctx.request({
        url: `https://steamcommunity.com/sharedfiles/filedetails/?id=${id}`,
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
      const matchedAppId = data.responseText.match(/<input type="hidden" name="appid" value="([\d]+?)" \/>/)?.[1];
      if (!matchedAppId) {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      await setCache(ctx, 'workshop', id, matchedAppId);
      return matchedAppId;
    } catch (error) {
      ctx.reportError();
      return false;
    }
  });
}

export async function voteUpWorkshop(ctx: Context, id: string): Promise<boolean> {
  return ctx.run('workshop.voteUpWorkshop', id, async (ctx): Promise<boolean> => {
    if (ctx.state.disposed || !ctx.state.communityInitialized) {
      ctx.progress(ctx.state.disposed ? 'DISPOSED' : 'AUTH_REQUIRED', 'error');
      return false;
    }
    try {
      const stepStatus = ctx.step('votingUpWorkshop', id);
      const {
        result, data
      } = await ctx.request({
        url: 'https://steamcommunity.com/sharedfiles/voteup',
        method: 'POST',
        responseType: 'json',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: encodeForm({
          id,
          sessionid: ctx.state.auth.communitySessionID
        })
      });
      if (result !== 'Success') {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      if (data?.status !== 200 || data.response?.success !== 1) {
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

export function doFavoriteWorkshop(ctx: Context, id: string): Promise<boolean> {
  return executeFavoriteWorkshop(ctx, id, true);
}
export function undoFavoriteWorkshop(ctx: Context, id: string): Promise<boolean> {
  return executeFavoriteWorkshop(ctx, id, false);
}
