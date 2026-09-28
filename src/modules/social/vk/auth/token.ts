import type { Context } from '../context';

export function updateAuth(ctx: Context): Promise<boolean> {
  return ctx.run('auth.update', undefined, false, async (ctx) => {
    const data = await ctx.request({
      url: 'https://login.vk.com/?act=web_token',
      method: 'POST',
      responseType: 'json',
      headers: {
        origin: 'https://vk.com',
        referer: 'https://vk.com/',
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: new URLSearchParams({
        version: ctx.state.version,
        app_id: ctx.state.appId
      }).toString()
    });
    if (!data) {
      return false;
    }
    const token = data.response?.data?.access_token;
    if (data.response?.type !== 'okay' || typeof token !== 'string' || !token) {
      return ctx.fail('AUTH_REQUIRED');
    }
    ctx.state.token = token;
    return true;
  });
}
