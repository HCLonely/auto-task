/** Only fetch supported YouTube URLs; unwrap Google's url/q redirect parameters. */
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

/** Avoid including arbitrary URL query strings in status events. */
export function eventTarget(link: string): string | undefined {
  const normalized = normalizeYoutubeLink(link);
  if (!normalized) {
    return undefined;
  }
  const url = new URL(normalized);
  return url.pathname === '/watch' ? (url.searchParams.get('v') || undefined) : url.pathname;
}
