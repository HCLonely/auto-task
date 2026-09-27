import type { Context } from '../context';
import { encodeForm } from '../utils/html';

async function executeCurator(ctx: Context, curatorId: string, doTask = true): Promise<boolean> {
  return ctx.run(doTask ? 'curator.doCurator' : 'curator.undoCurator', curatorId, async (ctx): Promise<boolean> => {
    if (ctx.state.disposed || !ctx.state.storeInitialized) {
      ctx.progress(ctx.state.disposed ? 'DISPOSED' : 'AUTH_REQUIRED', 'error');
      return false;
    }
    try {
      const stepStatus = ctx.step(doTask ? 'followingCurator' : 'unfollowingCurator', curatorId);
      const { result, data } = await ctx.request({
        url: 'https://store.steampowered.com/curators/ajaxfollow',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        data: encodeForm({ clanid: curatorId, sessionid: ctx.state.auth.storeSessionID, follow: doTask }),
        dataType: 'json'
      });
      if (result !== 'Success') {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      if (data?.response?.success?.success === 25) {
        stepStatus.error('curatorLimitNotice');
        return false;
      }
      if (data?.status !== 200 || data.response?.success?.success !== 1) {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      stepStatus.success('STEP_COMPLETED');
      return true;
    }
    catch (error) {
      ctx.reportError();
      return false;
    }
  });
}

export function doCurator(ctx: Context, curatorId: string): Promise<boolean> { return executeCurator(ctx, curatorId, true); }
export function undoCurator(ctx: Context, curatorId: string): Promise<boolean> { return executeCurator(ctx, curatorId, false); }
