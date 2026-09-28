/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:35:46
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/youtube/utils/links.ts
 * @Description  : YouTube 链接解析与目标提取
 */

/**
 * 仅接受支持的 YouTube 地址，并解析 Google 链接中的 url 或 q 重定向参数。
 *
 * @param link - 任务目标链接。
 * @returns 处理后的字符串；未取得有效结果时返回 undefined。
 */
export function normalizeYoutubeLink(link: string): string | undefined {
  try {
    let url = new URL(link);
    if (['www.google.com', 'google.com'].includes(url.hostname) && url.pathname === '/url') {
      url = new URL(url.searchParams.get('url') || url.searchParams.get('q') || '');
    }
    if (url.protocol !== 'https:' || url.username || url.password || url.port) {
      return undefined;
    }
    if (!['www.youtube.com', 'youtube.com', 'm.youtube.com', 'youtu.be'].includes(url.hostname)) {
      return undefined;
    }
    if (url.hostname === 'youtu.be') {
      const id = url.pathname.slice(1);
      if (!/^[\w-]+$/.test(id)) {
        return undefined;
      }
      return `https://www.youtube.com/watch?v=${id}`;
    }
    url.hostname = 'www.youtube.com';
    url.hash = '';
    return url.href;
  } catch {
    return undefined;
  }
}

/**
 * 状态事件中的目标信息不包含任意 URL 查询参数。
 *
 * @param link - 任务目标链接。
 * @returns 处理后的字符串；未取得有效结果时返回 undefined。
 */
export function eventTarget(link: string): string | undefined {
  const normalized = normalizeYoutubeLink(link);
  if (!normalized) {
    return undefined;
  }
  const url = new URL(normalized);
  return url.pathname === '/watch' ? (url.searchParams.get('v') || undefined) : url.pathname;
}
