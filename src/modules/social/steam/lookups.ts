/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/lookups.ts
 * @Description  : Steam 鉴赏家与试玩游戏标识查询
 */

import { Context, SteamError } from './context';

/**
 * 请求并解析网页内容。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param url - 请求或访问的 URL。
 * @returns Promise，完成后返回处理后的字符串。
 * @throws SteamError - 触发 'DISPOSED' 错误条件时抛出。
 * @throws SteamError - 触发 'LOOKUP_FAILED' 错误条件时抛出。
 */
async function getHTML(ctx: Context, url: string): Promise<string> {
  if (ctx.state.disposed) {
    throw new SteamError('DISPOSED');
  }
  const response = await ctx.options.http({
    url,
    method: 'GET'
  });
  if (ctx.state.disposed) {
    throw new SteamError('DISPOSED');
  }
  ctx.progress('LOOKUP_RESPONSE', {
    transportStatus: response.status,
    httpStatus: response.data?.status || 0
  });
  if (response.result !== 'Success' || response.data?.status !== 200) {
    throw new SteamError('LOOKUP_FAILED');
  }
  return response.data.responseText;
}
/**
 * 查询 Steam 鉴赏家标识。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param path - 请求路径。
 * @param name - 目标名称。
 * @returns Promise，完成后返回处理后的字符串；未取得有效结果时返回 false。
 */
export function getCuratorId(ctx: Context, path: string, name: string): Promise<string | false> {
  return ctx.run<string | false>('curator.resolve', `${path}/${name}`, false, async (child) => {
    if (!['developer', 'publisher', 'franchise', 'curator'].includes(path) || !name || /[\r\n/]/.test(name)) {
      throw new SteamError('INVALID_ARGUMENT');
    }
    const key = `curator:${path}:${encodeURIComponent(name)}`;
    const cached = await child.storage.get<unknown>(key, null);
    if (typeof cached === 'string' && /^\d+$/.test(cached)) {
      return cached;
    }
    const html = await getHTML(child, `https://store.steampowered.com/${path}/${encodeURIComponent(name)}`);
    const id = html.match(/g_pagingData[\s\S]*?"clanid"\s*:\s*(\d+)/)?.[1];
    if (!id) {
      throw new SteamError('CURATOR_ID_NOT_FOUND');
    }
    await child.storage.set(key, id);
    return id;
  });
}
/**
 * 查询游戏对应的试玩应用标识。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param id - 目标标识。
 * @returns Promise，完成后返回处理后的字符串；未取得有效结果时返回 false。
 */
export function getDemoAppId(ctx: Context, id: string): Promise<string | false> {
  return ctx.run<string | false>('demo.resolve', id, false, async (child) => {
    const html = await getHTML(child, `https://store.steampowered.com/app/${id}`);
    const demo = html.match(/steam:\/\/(?:install|run)\/(\d+)/)?.[1];
    if (!demo) {
      child.skip('DEMO_NOT_FOUND');
      return false;
    }
    return demo;
  });
}
