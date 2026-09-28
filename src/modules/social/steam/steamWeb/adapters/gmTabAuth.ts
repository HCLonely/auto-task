import type { Context } from '../context';
import type { Auth, GMAuthAPI, GMTab } from '../types';
import { getDefaultGM } from './gmStorage';

type AuthTarget = 'store' | 'community';
interface PendingAuth { id: string; expiresAt: number }
interface AuthReply { id: string; auth: Auth }
const hosts = {
  store: 'store.steampowered.com',
  community: 'steamcommunity.com'
};

function validAuth(value: unknown, target: AuthTarget): value is Auth {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const auth = value as Auth;
  const session = target === 'store' ? auth.storeSessionID : auth.communitySessionID;
  return typeof session === 'string' && session.length > 0 &&
    (target === 'store' || (typeof auth.steam64Id === 'string' && /^\d+$/.test(auth.steam64Id)));
}

export async function requestTabAuth(ctx: Context, target: AuthTarget): Promise<boolean> {
  if (ctx.state.disposed) {
    return false;
  }
  const { gm } = ctx;
  const key = `${ctx.namespace}:auth:${target}`;
  const requestKey = `${key}:pending`;
  const replyKey = `${key}:reply`;
  const previous = await gm.getValue<PendingAuth | null>(requestKey, null);
  if (ctx.state.disposed) {
    return false;
  }
  if (previous && previous.expiresAt > Date.now()) {
    ctx.progress('AUTH_BUSY', 'warning');
    return false;
  }
  const pending: PendingAuth = {
    id: crypto.randomUUID(),
    expiresAt: Date.now() + ctx.authTimeoutMs
  };
  return new Promise<boolean>((resolve) => {
    let tab: GMTab | undefined;
    let listener: number | undefined;
    let settled = false;
    let setupFinished = false;
    let finishSetup!: () => void;
    const setup = new Promise<void>((done) => {
      finishSetup = done;
    });
    const cancel = () => {
      void finish(false, 'AUTH_CANCELLED');
    };
    const timer = setTimeout(() => {
      void finish(false, 'AUTH_TIMEOUT');
    }, ctx.authTimeoutMs);
    const finish = async (ok: boolean, code: string) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      ctx.state.cleanups.delete(cancel);
      // Late async setup resources must also be cleaned before resolving.
      if (!setupFinished) {
        await setup;
      }
      try {
        if (listener !== undefined) {
          await gm.removeValueChangeListener(listener);
        }
      } catch {
        ctx.progress('AUTH_CLEANUP_FAILED', 'warning');
      }
      try {
        if (tab) {
          tab.onclose = undefined;
          tab.close();
        }
      } catch {
        ctx.progress('AUTH_CLEANUP_FAILED', 'warning');
      }
      try {
        const current = await gm.getValue<PendingAuth | null>(requestKey, null);
        if (current?.id === pending.id) {
          await gm.deleteValue(requestKey);
        }
        const reply = await gm.getValue<AuthReply | null>(replyKey, null);
        if (reply?.id === pending.id) {
          await gm.deleteValue(replyKey);
        }
      } catch {
        ctx.progress('AUTH_CLEANUP_FAILED', 'warning');
      }
      ctx.progress(code, ok ? 'info' : 'warning');
      resolve(ok);
    };
    ctx.state.cleanups.add(cancel);
    void (async () => {
      try {
        listener = await gm.addValueChangeListener(replyKey, (_key, _old, value) => {
          if (settled || !value || typeof value !== 'object') {
            return;
          }
          const reply = value as AuthReply;
          if (reply.id !== pending.id || !validAuth(reply.auth, target)) {
            return;
          }
          if (target === 'store') {
            ctx.state.auth.storeSessionID = reply.auth.storeSessionID;
          } else {
            ctx.state.auth.communitySessionID = reply.auth.communitySessionID;
            ctx.state.auth.steam64Id = reply.auth.steam64Id;
          }
          void finish(true, 'AUTH_UPDATED');
        });
        if (settled) {
          return;
        }
        await gm.setValue(requestKey, pending);
        if (settled) {
          return;
        }
        tab = await gm.openInTab(`https://${hosts[target]}/${target === 'community' ? 'my' : ''}`, {
          active: true,
          setParent: true
        });
        if (settled) {
          return;
        }
        tab.onclose = () => {
          void finish(false, 'AUTH_TAB_CLOSED');
        };
        ctx.progress('AUTH_WAITING_FOR_PAGE');
      } catch {
        void finish(false, 'AUTH_TAB_FAILED');
      } finally {
        setupFinished = true;
        finishSetup();
      }
    })();
  });
}

/** Call at userscript startup on matched Steam pages, before starting tasks.
 * The same userscript must own both the opener and the authentication page.
 * Returns true when this page belongs to a pending authentication flow.
 */
export async function handleSteamAuthPage(options: { gm?: GMAuthAPI; namespace?: string } = {}): Promise<boolean> {
  const target = location.hostname === hosts.store ? 'store' : (location.hostname === hosts.community ? 'community' : undefined);
  if (!target) {
    return false;
  }
  const gm = options.gm || getDefaultGM();
  const key = `${options.namespace || 'steamWeb'}:auth:${target}`;
  const pending = await gm.getValue<PendingAuth | null>(`${key}:pending`, null);
  if (!pending || pending.expiresAt <= Date.now()) {
    return false;
  }
  while (Date.now() < pending.expiresAt) {
    const current = await gm.getValue<PendingAuth | null>(`${key}:pending`, null);
    if (current?.id !== pending.id) {
      return true;
    }
    const html = document.documentElement?.innerHTML || '';
    const session = html.match(/g_sessionID\s*=\s*["']([^"']+)["']/)?.[1];
    const steam64Id = html.match(/g_steamID\s*=\s*["'](\d+)["']/)?.[1];
    const auth: Auth = target === 'store' ? {
      storeSessionID: session
    } : {
      communitySessionID: session,
      steam64Id
    };
    // Anonymous Steam pages also expose a session ID; require a signed-in marker.
    const loggedIn = target === 'store' ? /data-miniprofile\s*=/.test(html) : Boolean(steam64Id && steam64Id !== '0');
    if (loggedIn && validAuth(auth, target)) {
      await gm.setValue(`${key}:reply`, {
        id: pending.id,
        auth
      } satisfies AuthReply);
      return true;
    }
    await new Promise<void>((resolve) => {
      return setTimeout(resolve, 500);
    });
  }
  return true;
}
