/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/vk/whiteList.ts
 * @Description  : VK 任务白名单读取与设置
 */

import type { Context } from './context';
import type { VkTasks } from './types';
import { normalizeLink } from './utils/targets';

/**
 * 规范化名称列表并移除重复项。
 *
 * @param names - 目标名称列表。
 * @returns 处理后的字符串列表。
 */
export function normalizeNames(names: string[]): string[] {
  return [...new Set(names.map((name) => {
    return normalizeLink(name) || normalizeLink(`https://vk.com/${name}`);
  }).filter((name): name is string => {
    return Boolean(name);
  }))];
}
/**
 * 从持久化存储读取任务白名单。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns 在操作完成后兑现的 Promise。
 */
export async function loadWhiteList(ctx: Context): Promise<void> {
  const saved = await ctx.storage.get<Partial<VkTasks>>('whiteList', {});
  const names = Array.isArray(saved?.names) ? saved.names.filter((name): name is string => {
    return typeof name === 'string';
  }) : [];
  ctx.state.whiteList = {
    names: normalizeNames([...names, ...ctx.state.whiteList.names])
  };
}
/**
 * 更新任务白名单并写入持久化存储。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param whiteList - 任务白名单。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export function setWhiteList(ctx: Context, whiteList: VkTasks): Promise<boolean> {
  return ctx.run('whiteList.set', undefined, false, async (ctx) => {
    if (ctx.state.disposed) {
      return ctx.fail('DISPOSED');
    }
    const value = {
      names: normalizeNames(whiteList.names)
    };
    await ctx.storage.set('whiteList', value);
    ctx.state.whiteList = value;
    return true;
  });
}
