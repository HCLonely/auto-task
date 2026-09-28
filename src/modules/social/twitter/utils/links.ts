const hosts = new Set(['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com', 'mobile.twitter.com']);
export function normalizeUser(name: string): string | undefined {
  const value = name.replace(/^@/, '');
  return /^[a-zA-Z0-9_]{1,15}$/.test(value) ? value : undefined;
}
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
export function userFromLink(link: string): string | undefined {
  const parts = path(link);
  return parts?.length === 1 ? normalizeUser(parts[0]) : undefined;
}
export function tweetFromLink(link: string): string | undefined {
  const parts = path(link);
  if (!parts) {
    return undefined;
  }
  const id = parts[0] === 'i' && parts[1] === 'web' && parts[2] === 'status' ? parts[3] :
    (normalizeUser(parts[0] || '') && parts[1] === 'status' ? parts[2] : undefined);
  return id && /^\d+$/.test(id) ? id : undefined;
}
