import type { Context } from '../context';
import { encodeForm } from '../utils/html';

export async function requestPlayTestAccess(ctx: Context, id: string): Promise<boolean> {
  return ctx.run('playtest.requestPlayTestAccess', id, async (ctx): Promise<boolean> => {
    if (ctx.state.disposed || !ctx.state.storeInitialized) {
      ctx.progress(ctx.state.disposed ? 'DISPOSED' : 'AUTH_REQUIRED', 'error');
      return false;
    }
    try {
      const stepStatus = ctx.step('requestingPlayTestAccess', id);
      const { result, data } = await ctx.request({
        url: `https://store.steampowered.com/ajaxrequestplaytestaccess/${id}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          Host: 'store.steampowered.com',
          Origin: 'https://store.steampowered.com',
          Referer: `https://store.steampowered.com/app/${id}`
        },
        data: encodeForm({
          sessionid: ctx.state.auth.storeSessionID
        }),
        dataType: 'json'
      });
      if (result !== 'Success') {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      if (data?.status !== 200 || data?.response?.success !== 1) {
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
