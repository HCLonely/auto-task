/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/twitter/features/users.ts
 * @Description  : Twitter 用户查询、关注与取消关注
 */

import { setCache } from '../cache';
import type { Context } from '../context';
import { apiRequest, hasErrors, reportFailure } from '../requests';
import { normalizeUser } from '../utils/links';

/**
 * 将用户名称转换为用户标识。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param name - 目标名称。
 * @returns Promise，完成后返回处理后的字符串；未取得有效结果时返回 false。
 */
export function userName2id(ctx: Context, name: string): Promise<string | false> {
  return ctx.run<string | false>('users.lookup', name, false, async (ctx) => {
    if (!ctx.ready()) {
      return false;
    }
    const user = normalizeUser(name);
    if (!user) {
      ctx.progress('INVALID_USERNAME', 'error');
      return false;
    }
    const key = user.toLowerCase();
    if (ctx.state.cache[key]) {
      return ctx.state.cache[key];
    }
    const params = new URLSearchParams({
      variables: JSON.stringify({
        screen_name: user
      }),
      features: JSON.stringify(ctx.api.userFeatures),
      fieldToggles: JSON.stringify(ctx.api.userFieldToggles)
    });
    const path = `/i/api/graphql/${ctx.api.userByScreenName}/UserByScreenName?${params}`;
    const response = await apiRequest(ctx, path, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        referer: `https://x.com/${user}`
      }
    });
    if (response.result !== 'Success' || response.data?.status !== 200 || hasErrors(response)) {
      return reportFailure(ctx, response);
    }
    const id: unknown = response.data.response?.data?.user?.result?.rest_id;
    if (typeof id !== 'string' || !/^\d+$/.test(id)) {
      ctx.progress('USER_ID_NOT_FOUND', 'error');
      return false;
    }
    await setCache(ctx, key, id);
    return id;
  });
}

/**
 * 根据操作方向关注用户或取消关注用户。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param name - 目标名称。
 * @param doTask - 是否执行任务；为 false 时执行撤销操作；默认值为 `true`。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
function executeUser(ctx: Context, name: string, doTask = true): Promise<boolean> {
  return ctx.run(doTask ? 'users.follow' : 'users.unfollow', name, false, async (ctx) => {
    if (!ctx.ready()) {
      return false;
    }
    const user = normalizeUser(name);
    if (!user) {
      ctx.progress('INVALID_USERNAME', 'error');
      return false;
    }
    if (!doTask && ctx.state.whiteList.users.some((entry) => {
      return normalizeUser(entry)?.toLowerCase() === user.toLowerCase();
    })) {
      return ctx.skip('WHITELIST_SKIP');
    }
    const id = await userName2id(ctx, user);
    if (!id) {
      return false;
    }
    const response = await apiRequest(ctx, `/i/api/1.1/friendships/${doTask ? 'create' : 'destroy'}.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: new URLSearchParams({
        include_profile_interstitial_type: '1',
        include_blocking: '1',
        include_blocked_by: '1',
        include_followed_by: '1',
        include_want_retweets: '1',
        include_mute_edge: '1',
        include_can_dm: '1',
        include_can_media_tag: '1',
        skip_status: '1',
        id
      }).toString()
    });
    if (response.result !== 'Success' || response.data?.status !== 200 || hasErrors(response)) {
      return reportFailure(ctx, response);
    }
    if (doTask && !ctx.state.tasks.users.some((entry) => {
      return entry.toLowerCase() === user.toLowerCase();
    })) {
      ctx.state.tasks.users.push(user);
    }
    return true;
  });
}

/**
 * 关注用户。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param name - 目标名称。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function doUser(ctx: Context, name: string): Promise<boolean> {
  return executeUser(ctx, name, true);
}
/**
 * 取消关注用户。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param name - 目标名称。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function undoUser(ctx: Context, name: string): Promise<boolean> {
  return executeUser(ctx, name, false);
}
