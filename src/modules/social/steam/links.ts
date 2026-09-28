import type { LinkType, TaskType } from './types';

export const linkTasks: Array<[LinkType, TaskType]> = [
  ['groupLinks', 'groups'], ['officialGroupLinks', 'officialGroups'], ['wishlistLinks', 'wishlists'],
  ['followLinks', 'follows'], ['playTimeLinks', 'playTime'], ['forumLinks', 'forums'],
  ['workshopLinks', 'workshops'], ['workshopVoteLinks', 'workshopVotes'], ['curatorLinks', 'curators'],
  ['curatorLikeLinks', 'curatorLikes'], ['announcementLinks', 'announcements'], ['licenseLinks', 'licenses'], ['playtestLinks', 'playtests']
];
export interface ParsedLink { id: string; minutes?: number }
export function parseLink(type: TaskType, link: string): ParsedLink | undefined {
  if (type === 'licenses') {
    return /^(appid|subid)-\d+(?:,\d+)*$/.test(link) ? {
      id: link
    } : undefined;
  }
  let minutes: number | undefined;
  if (type === 'playTime') {
    const match = /^(\d+)-(.+)$/.exec(link);
    if (!match || !Number.isSafeInteger(Number(match[1])) || Number(match[1]) <= 0) {
      return;
    }
    minutes = Number(match[1]);
    link = match[2];
  }
  try {
    const url = new URL(link);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
      !['store.steampowered.com', 'steamcommunity.com'].includes(url.hostname)) {
      return;
    }
    const parts = url.pathname.split('/').filter(Boolean).map(decodeURIComponent);
    const numeric = (value?: string) => {
      return value && /^\d+$/.test(value) ? value : undefined;
    };
    let id: string | undefined;
    switch (type) {
        case 'groups': id = url.hostname === 'steamcommunity.com' && parts[0] === 'groups' ? parts[1] : undefined;
          break;
        case 'officialGroups': id = url.hostname === 'steamcommunity.com' && parts[0] === 'games' ? parts[1] : undefined;
          break;
        case 'wishlists': case 'follows': case 'forums': case 'playtests': case 'playTime':
          id = parts[0] === 'app' ? numeric(parts[1]) : undefined;
          break;
        case 'workshops': case 'workshopVotes':
          id = url.hostname === 'steamcommunity.com' && ['sharedfiles', 'workshop'].includes(parts[0]) ? numeric(url.searchParams.get('id') || '') : undefined;
          break;
        case 'curators': id = url.hostname === 'store.steampowered.com' && parts[0] === 'curator' ? numeric(parts[1]) : undefined;
          break;
        case 'curatorLikes':
          if (url.hostname === 'store.steampowered.com' && ['developer', 'publisher', 'franchise'].includes(parts[0]) && parts[1]) {
            id = `${parts[0]}/${parts[1]}`;
          }
          break;
        case 'announcements':
          if (url.hostname === 'store.steampowered.com' && parts[0] === 'news' && parts[1] === 'app' && numeric(parts[2]) && parts[3] === 'view' && numeric(parts[4])) {
            id = `${parts[2]}/${parts[4]}`;
          }
          if (url.hostname === 'steamcommunity.com' && parts[0] === 'games' && numeric(parts[1]) && parts[2] === 'announcements' && parts[3] === 'detail' && numeric(parts[4])) {
            id = `${parts[1]}/${parts[4]}`;
          }
          break;
    }
    if (id && !/[\r\n]/.test(id)) {
      return {
        id,
        minutes
      };
    }
  } catch { /* Invalid or malformed URL. */ }
}
