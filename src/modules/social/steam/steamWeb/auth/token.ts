/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/steamWeb/auth/token.ts
 * @Description  : Steam 网页端 访问令牌管理
 */

import type { Context } from '../context';
import type { StoreTokenParam } from '../types';

/**
 * 刷新并保存访问令牌。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param type - 操作或数据类型；默认值为 `'steamStore'`。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
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
      const {
        result, data
      } = await ctx.request({
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
    } catch (error) {
      ctx.reportError();
      return false;
    }
  });
}

/**
 * 设置当前访问令牌。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param param - 操作参数。
 * @param type - 操作或数据类型。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export async function setToken(ctx: Context, param: StoreTokenParam, type: 'steamStore' | 'steamCommunity'): Promise<boolean> {
  return ctx.run('auth.setToken', undefined, async (ctx): Promise<boolean> => {
    try {
      if (![param.steamID, param.nonce, param.redir, param.auth].every((value) => {
        return typeof value === 'string' && value.length > 0;
      })) {
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
      const {
        result, data
      } = await ctx.request({
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
    } catch (error) {
      ctx.reportError();
      return false;
    }
  });
}
