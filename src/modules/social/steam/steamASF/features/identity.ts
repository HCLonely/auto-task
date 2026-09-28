/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/steamASF/features/identity.ts
 * @Description  : Steam ASF 用户标识获取
 */

import { Context, OperationError } from '../context';

/**
 * 通过 ASF 获取当前账号的 Steam 标识。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns Promise，完成后返回处理后的字符串。
 */
export function getSteamIdASF(ctx: Context): Promise<string> {
  return ctx.run('identity.asf', undefined, '', async (child) => {
    const result = await child.command(`!steamid ${child.bot}`);
    const ids = [...new Set(result.match(/\b7656119\d{10}\b/g) || [])];
    if (ids.length !== 1) {
      throw new OperationError('STEAM_ID_UNAVAILABLE');
    }
    return ids[0];
  });
}

/**
 * 通过网页授权获取当前账号的 Steam 标识。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns Promise，完成后返回处理后的字符串。
 */
export function getSteamIdWeb(ctx: Context): Promise<string> {
  return ctx.run('identity.web', undefined, '', async (child) => {
    const data = await child.request({
      url: 'https://store.steampowered.com',
      method: 'GET'
    });
    const id = data.responseText.match(/steamid&quot;:&quot;(\d+)/)?.[1]
      || data.responseText.match(/g_steamID\s*=\s*["'](\d+)["']/)?.[1];
    if (!id || !/^7656119\d{10}$/.test(id)) {
      throw new OperationError('STEAM_ID_UNAVAILABLE');
    }
    return id;
  });
}

/**
 * 公开查询优先使用网页端标识；机器人游戏运行检查直接使用 ASF 标识。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns Promise，完成后返回处理后的字符串。
 */
export function getSteamId(ctx: Context): Promise<string> {
  return ctx.run('identity.resolve', undefined, '', async (child) => {
    return (await getSteamIdWeb(child)) || getSteamIdASF(child);
  });
}
