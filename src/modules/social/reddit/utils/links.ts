import type { RedditTarget } from '../types';

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
