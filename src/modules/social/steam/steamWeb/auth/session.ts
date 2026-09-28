/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/steamWeb/auth/session.ts
 * @Description  : Steam 网页端 会话授权管理
 */

import { refreshToken } from '../auth/token';
import type { Context } from '../context';

/**
 * 更新 Steam 商店会话授权。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param retry - 当前重试状态或次数；默认值为 `false`。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export async function updateStoreAuth(ctx: Context, retry = false): Promise<boolean> {
  return ctx.run('auth.store.session', undefined, async (ctx): Promise<boolean> => {
    try {
      const stepStatus = ctx.step('updatingAuth');
      const {
        result, data
      } = await ctx.request({
        url: 'https://store.steampowered.com/',
        method: 'GET',
        headers: {
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Upgrade-Insecure-Requests': '1'
        },
        redirect: 'manual'
      });
      if (result !== 'Success' || data?.status !== 200) {
        if (![301, 302].includes(data?.status as number)) {
          stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
          return false;
        }
        if (retry || !await refreshToken(ctx, 'steamStore')) {
          stepStatus.error('AUTH_REQUIRED');
          return false;
        }
        stepStatus.warning('RETRYING');
        return updateStoreAuth(ctx, true);
      }
      if (!data.responseText.includes('data-miniprofile=')) {
        if (!retry && await refreshToken(ctx, 'steamStore')) {
          stepStatus.warning('RETRYING');
          return updateStoreAuth(ctx, true);
        }
        stepStatus.error('AUTH_REQUIRED');
        return false;
      }
      const storeSessionID = data.responseText.match(/g_sessionID = "(.+?)";/)?.[1];
      if (!storeSessionID) {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      ctx.state.auth.storeSessionID = storeSessionID;
      stepStatus.success('STEP_COMPLETED');
      return true;
    } catch (error) {
      ctx.reportError();
      return false;
    }
  });
}

/**
 * 更新 Steam 社区会话授权。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param initStoreResult - 商店初始化结果。
 * @param retry - 当前重试状态或次数；默认值为 `false`。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export async function updateCommunityAuth(ctx: Context, initStoreResult: boolean, retry = false): Promise<boolean> {
  return ctx.run('auth.community.session', undefined, async (ctx): Promise<boolean> => {
    try {
      const stepStatus = ctx.step('gettingUserInfo');
      const {
        result, data
      } = await ctx.request({
        url: 'https://steamcommunity.com/my',
        method: 'GET',
        headers: {
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          Host: 'steamcommunity.com',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate'
        },
        redirect: 'follow'
      });
      if (result !== 'Success' || data?.status !== 200) {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      if (data.finalUrl.includes('https://steamcommunity.com/login/home')) {
        if (initStoreResult) {
          if (!retry && await refreshToken(ctx, 'steamCommunity')) {
            stepStatus.warning('RETRYING');
            return updateCommunityAuth(ctx, initStoreResult, true);
          }
        }
        stepStatus.error('AUTH_REQUIRED');
        return false;
      }
      const steam64Id = data.responseText.match(/g_steamID = "(.+?)";/)?.[1];
      const communitySessionID = data.responseText.match(/g_sessionID = "(.+?)";/)?.[1];
      if (!steam64Id || steam64Id === '0' || !communitySessionID) {
        stepStatus.error('REQUEST_OR_RESPONSE_FAILED');
        return false;
      }
      ctx.state.auth.steam64Id = steam64Id;
      ctx.state.auth.communitySessionID = communitySessionID;
      stepStatus.success('STEP_COMPLETED');
      return true;
    } catch (error) {
      ctx.reportError();
      return false;
    }
  });
}
