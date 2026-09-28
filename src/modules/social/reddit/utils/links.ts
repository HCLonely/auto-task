/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:35:46
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/reddit/utils/links.ts
 * @Description  : Reddit 链接解析与目标提取
 */

import type { RedditTarget } from '../types';

/**
 * 从 Reddit 链接中解析用户或社区目标。
 *
 * @param link - 任务目标链接。
 * @returns 解析后的 Reddit 用户或社区目标；未取得有效结果时返回 undefined。
 */
export function parseRedditLink(link: string): RedditTarget | undefined {
  try {
    const url = new URL(link);
    if (!['http:', 'https:'].includes(url.protocol) || !['reddit.com', 'www.reddit.com', 'old.reddit.com'].includes(url.hostname) || url.username || url.password) {
      return;
    }
    const [kind, name] = url.pathname.split('/').filter(Boolean);
    if (!name || !/^[A-Za-z0-9_-]+$/.test(name)) {
      return;
    }
    if (kind === 'user' || kind === 'u') {
      return {
        kind: 'user',
        name,
        taskName: `u_${name}`
      };
    }
    if (kind === 'r') {
      return {
        kind: 'subreddit',
        name,
        taskName: name
      };
    }
  } catch {
    return;
  }
}
