/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:35:46
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/twitter/utils/links.ts
 * @Description  : Twitter 链接解析与目标提取
 */

const hosts = new Set(['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com', 'mobile.twitter.com']);
/**
 * 规范化用户名称。
 *
 * @param name - 目标名称。
 * @returns 处理后的字符串；未取得有效结果时返回 undefined。
 */
export function normalizeUser(name: string): string | undefined {
  const value = name.replace(/^@/, '');
  return /^[a-zA-Z0-9_]{1,15}$/.test(value) ? value : undefined;
}
/**
 * 提取链接中的路径部分。
 *
 * @param link - 任务目标链接。
 * @returns 处理后的字符串列表；未取得有效结果时返回 undefined。
 */
function path(link: string): string[] | undefined {
  try {
    const url = new URL(link);
    if (url.protocol !== 'https:' || !hosts.has(url.hostname) || url.username || url.password || url.port) {
      return undefined;
    }
    return url.pathname.split('/').filter(Boolean);
  } catch {
    return undefined;
  }
}
/**
 * 从链接中提取用户名称。
 *
 * @param link - 任务目标链接。
 * @returns 处理后的字符串；未取得有效结果时返回 undefined。
 */
export function userFromLink(link: string): string | undefined {
  const parts = path(link);
  return parts?.length === 1 ? normalizeUser(parts[0]) : undefined;
}
/**
 * 从链接中提取推文标识。
 *
 * @param link - 任务目标链接。
 * @returns 处理后的字符串；未取得有效结果时返回 undefined。
 */
export function tweetFromLink(link: string): string | undefined {
  const parts = path(link);
  if (!parts) {
    return undefined;
  }
  const id = parts[0] === 'i' && parts[1] === 'web' && parts[2] === 'status' ? parts[3] :
    (normalizeUser(parts[0] || '') && parts[1] === 'status' ? parts[2] : undefined);
  return id && /^\d+$/.test(id) ? id : undefined;
}
