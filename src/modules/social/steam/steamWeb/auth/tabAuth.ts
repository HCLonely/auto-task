/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/steamWeb/auth/tabAuth.ts
 * @Description  : Steam 网页端 商店与社区标签页授权更新
 */

import { requestTabAuth } from '../adapters/gmTabAuth';
import type { Context } from '../context';

/**
 * 通过授权标签页更新 Steam 商店会话。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function updateStoreAuthTab(ctx: Context): Promise<boolean> {
  return ctx.run('auth.store.tab', undefined, async (child) => {
    try {
      return await requestTabAuth(child, 'store');
    } catch {
      child.reportError();
      return false;
    }
  });
}

/**
 * 通过授权标签页更新 Steam 社区会话。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function updateCommunityAuthTab(ctx: Context): Promise<boolean> {
  return ctx.run('auth.community.tab', undefined, async (child) => {
    try {
      return await requestTabAuth(child, 'community');
    } catch {
      child.reportError();
      return false;
    }
  });
}
