/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/steamWeb/adapters/gmTabAuth.ts
 * @Description  : Steam 网页端 浏览器标签页授权适配
 */

import type { Context } from '../context';
import type { Auth, GMAuthAPI, GMTab } from '../types';
import { getDefaultGM } from './gmStorage';

export type AuthTarget = 'store' | 'community';
interface PendingAuth { id: string; expiresAt: number }
interface AuthReply { id: string; auth: Auth }
const hosts = {
  store: 'store.steampowered.com',
  community: 'steamcommunity.com'
};

/**
 * 检查授权数据是否包含所需字段。
 *
 * @param value - 待处理的值。
 * @param target - 当前操作的目标。
 * @returns 检查结果；满足条件时为 true，否则为 false。
 */
function validAuth(value: unknown, target: AuthTarget): value is Auth {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const auth = value as Auth;
  const session = target === 'store' ? auth.storeSessionID : auth.communitySessionID;
  return typeof session === 'string' && session.length > 0 &&
    (target === 'store' || (typeof auth.steam64Id === 'string' && /^\d+$/.test(auth.steam64Id)));
}

/**
 * 打开授权标签页并等待授权结果。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param target - 当前操作的目标。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
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
    /**
     * 取消当前操作或等待。
     */
    const cancel = () => {
      void finish(false, 'AUTH_CANCELLED');
    };
    const timer = setTimeout(() => {
      void finish(false, 'AUTH_TIMEOUT');
    }, ctx.authTimeoutMs);
    /**
     * 完成当前操作并交付结果。
     *
     * @param ok - 操作是否成功。
     * @param code - 状态代码。
     * @returns 在操作完成后兑现的 Promise。
     */
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

/**
 * 在匹配的 Steam 页面启动时调用，并在执行任务前完成处理。发起页面和授权页面必须由同一用户脚本管理。返回 true 表示当前页面属于待处理的授权流程。
 *
 * @param options - 本次操作的配置选项；默认值为 `{}`。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
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
