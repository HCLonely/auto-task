import type { Context } from '../context';
import type { PublicParams } from '../types';

/** Preserves the original internal public-page operation; automatic resolution remains disabled. */
function executePublic(ctx: Context, name: string, params: PublicParams, doTask = true): Promise<boolean> {
  return ctx.run(doTask ? 'public.join' : 'public.leave', name, false, async (ctx) => {
    if (params.publicJoined === doTask) {
      return ctx.skip('ALREADY_IN_DESIRED_STATE');
    }
    if (!params.publicPid || !params.publicHash) {
      return ctx.fail('MISSING_PARAMETERS');
    }
    const data = await ctx.request({
      url: 'https://vk.com/al_public.php',
      method: 'POST',
      responseType: 'json',
      headers: {
        origin: 'https://vk.com',
        referer: `https://vk.com/${name}`,
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: new URLSearchParams({
        act: doTask ? 'a_enter' : 'a_leave',
        al: '1',
        pid: params.publicPid,
        hash: params.publicHash
      }).toString()
    });
    if (!data || data.response?.error) {
      return ctx.fail('PUBLIC_REQUEST_FAILED');
    }
    // Legacy al_* replies place their status code in payload[0].
    if (!Array.isArray(data.response?.payload) || ![0, '0'].includes(data.response.payload[0])) {
      return ctx.fail('INVALID_RESPONSE');
    }
    if (doTask) {
      ctx.record(name);
    }
    return true;
  });
}

export function doPublic(ctx: Context, name: string, params: PublicParams): Promise<boolean> {
  return executePublic(ctx, name, params, true);
}
export function undoPublic(ctx: Context, name: string, params: PublicParams): Promise<boolean> {
  return executePublic(ctx, name, params, false);
}
