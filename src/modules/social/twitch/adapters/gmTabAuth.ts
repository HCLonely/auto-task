/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/twitch/adapters/gmTabAuth.ts
 * @Description  : Twitch 浏览器标签页授权适配
 */

import type { Context } from '../context';
import type { Auth, GMTab } from '../types';
import { validAuth, pickAuth } from '../auth/data';
export interface PendingAuth { id: string; expiresAt: number }
interface AuthReply { id: string; auth: Auth }

/**
 * 打开授权标签页并等待授权结果。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export async function requestTabAuth(ctx: Context): Promise<boolean> {
  if (ctx.state.disposed) {
    return false;
  }
  const { gm } = ctx;
  const key = `${ctx.namespace}:auth`;
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
          if (reply.id !== pending.id || !validAuth(reply.auth)) {
            return;
          }
          ctx.state.auth = pickAuth(reply.auth);
          void finish(true, 'AUTH_UPDATED');
        });
        if (settled) {
          return;
        }
        await gm.setValue(requestKey, pending);
        if (settled) {
          return;
        }
        tab = await gm.openInTab('https://www.twitch.tv/', {
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
