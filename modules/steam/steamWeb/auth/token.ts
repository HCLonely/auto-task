import type { Context } from '../context';
import type { StoreTokenParam } from '../types';

export async function refreshToken(ctx: Context, type: 'steamStore' | 'steamCommunity' = 'steamStore'): Promise<boolean> {
  return ctx.run('auth.refreshToken', type, async (ctx): Promise<boolean> => {
    try {
      const host = {
        steamStore: 'store.steampowered.com',
        steamCommunity: 'steamcommunity.com'
      };
      const stepStatus = ctx.step('refreshingToken');
      const formData = new FormData();
      formData.append('redir', `https://${host[type]}/`);
      const { result, data } = await ctx.request({
        url: 'https://login.steampowered.com/jwt/ajaxrefresh',
        method: 'POST',
        responseType: 'json',
        headers: {
          Host: 'login.steampowered.com',
          Origin: `https://${host[type]}`,
          Referer: `https://${host[type]}/`
        },
        data: formData
      });
      if (result !== 'Success') {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      if (data?.status !== 200 || !data.response?.success) {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      if (!await setToken(ctx, data.response, type)) {
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

export async function setToken(ctx: Context, param: StoreTokenParam, type: 'steamStore' | 'steamCommunity'): Promise<boolean> {
  return ctx.run('auth.setToken', undefined, async (ctx): Promise<boolean> => {
    try {
      if (![param.steamID, param.nonce, param.redir, param.auth].every((value) => typeof value === 'string' && value.length > 0)) {
        ctx.progress('INVALID_TOKEN_RESPONSE', 'error');
        return false;
      }
      const host = {
        steamStore: 'store.steampowered.com',
        steamCommunity: 'steamcommunity.com'
      };
      const stepStatus = ctx.step('settingToken');
      const formData = new FormData();
      formData.append('steamID', param.steamID);
      formData.append('nonce', param.nonce);
      formData.append('redir', param.redir);
      formData.append('auth', param.auth);
      const { result, data } = await ctx.request({
        url: `https://${host[type]}/login/settoken`,
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          Host: host[type],
          Origin: `https://${host[type]}`
        },
        data: formData
      });
      if (result !== 'Success') {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      if (data?.status !== 200) {
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
