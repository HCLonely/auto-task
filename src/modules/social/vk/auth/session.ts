import type { Context } from '../context';

/** Verify the browser session and obtain the account ID and current page API parameters. */
export function verifyAuth(ctx: Context): Promise<boolean> {
  return ctx.run('auth.verify', undefined, false, async (ctx) => {
    const data = await ctx.request({
      url: 'https://vk.com/im',
      method: 'GET'
    });
    if (!data) {
      return false;
    }
    const url = new URL(data.finalUrl || 'https://vk.com/im');
    if (!['vk.com', 'vk.ru'].includes(url.hostname) || /\/login(?:\/|$)/.test(url.pathname)) {
      return ctx.fail('AUTH_REQUIRED');
    }
    const userId = data.responseText.match(/\bid:\s*(\d+)/)?.[1];
    if (!userId || userId === '0') {
      return ctx.fail('AUTH_REQUIRED');
    }
    ctx.state.userId = userId;
    const version = data.responseText.match(/"version"\s*:\s*"([\d.]+)"\s*,\s*"response"/)?.[1];
    const appId = data.responseText.match(/"app_id"\s*:\s*"?(\d+)"?\s*,\s*"is_mobile"/)?.[1];
    if (version && !ctx.options.apiVersion) {
      ctx.state.version = version;
    }
    if (appId && !ctx.options.appId) {
      ctx.state.appId = appId;
    }
    return true;
  });
}
