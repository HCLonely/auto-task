import { getDefaultGM } from '../adapters/gmStorage';
import type { PendingAuth } from '../adapters/gmTabAuth';
import type { Auth, GMAuthAPI } from '../types';
import { pickAuth, validAuth } from './data';

export interface TwitchPageWindow {
  __twilightBuildID?: string;
  commonOptions?: { headers?: Record<string, string> };
  localStorage: Pick<Storage, 'getItem'>;
  document: Pick<Document, 'cookie'>;
}
declare const unsafeWindow: TwitchPageWindow;

/** Reads Twitch-owned state only; module persistence still exclusively uses GM. */
export function readTwitchAuth(page: TwitchPageWindow): Auth | undefined {
  try {
    const cookies = Object.fromEntries(page.document.cookie.split(';').map((entry) => {
      const index = entry.indexOf('=');
      return [entry.slice(0, index).trim(), decodeURIComponent(entry.slice(index + 1))];
    }));
    if (!cookies.login) {
      return undefined;
    }
    const headers = page.commonOptions?.headers || {};
    const getHeader = (name: string) => {
      return Object.entries(headers).find(([key]) => {
        return key.toLowerCase() === name;
      })?.[1];
    };
    const session = page.localStorage.getItem('local_storage_app_session_id');
    const auth = {
      authToken: cookies['auth-token'],
      clientVersion: page.__twilightBuildID,
      clientId: getHeader('client-id'),
      deviceId: getHeader('device-id'),
      clientSessionId: session?.replace(/^"|"$/g, '')
    };
    return validAuth(auth) ? pickAuth(auth) : undefined;
  } catch {
    return undefined;
  }
}

/** Invoke on Twitch pages from the same userscript that opened the auth tab. */
export async function handleTwitchAuthPage(options: {
  gm?: GMAuthAPI; namespace?: string; pageWindow?: TwitchPageWindow;
  readAuth?: () => Auth | undefined | Promise<Auth | undefined>;
} = {}): Promise<boolean> {
  if (!['www.twitch.tv', 'twitch.tv'].includes(location.hostname)) {
    return false;
  }
  const gm = options.gm || getDefaultGM();
  const key = `${options.namespace || 'twitch'}:auth`;
  const pending = await gm.getValue<PendingAuth | null>(`${key}:pending`, null);
  if (!pending || pending.expiresAt <= Date.now()) {
    return false;
  }
  const page = options.pageWindow || (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window);
  while (Date.now() < pending.expiresAt) {
    const current = await gm.getValue<PendingAuth | null>(`${key}:pending`, null);
    if (current?.id !== pending.id) {
      return true;
    }
    const auth = options.readAuth ? await options.readAuth() : readTwitchAuth(page);
    if (validAuth(auth)) {
      await gm.setValue(`${key}:reply`, {
        id: pending.id,
        auth: pickAuth(auth)
      });
      return true;
    }
    await new Promise<void>((resolve) => {
      return setTimeout(resolve, 500);
    });
  }
  return true;
}
