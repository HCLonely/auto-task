/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/twitch/auth/pageAuth.ts
 * @Description  : Twitch 页面授权信息读取与处理
 */

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

/**
 * 仅读取 Twitch 自有状态，模块持久化数据仍通过 GM 存储。
 *
 * @param page - 目标页面。
 * @returns 校验或提取后的授权信息；未取得有效结果时返回 undefined。
 */
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
    /**
     * 读取指定响应头。
     *
     * @param name - 目标名称。
     * @returns 处理后的字符串；未取得有效结果时返回 undefined。
     */
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

/**
 * 应在 Twitch 授权页面中由打开授权标签页的同一用户脚本调用。
 *
 * @param options - 本次操作的配置选项；默认值为 `{}`。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export async function handleTwitchAuthPage(options: {
  gm?: GMAuthAPI; namespace?: string; pageWindow?: TwitchPageWindow;
  /**
   * 读取页面中的授权信息。
   *
   * @returns 处理结果（Auth | Promise\<Auth | undefined\>）；未取得有效结果时返回 undefined。
   */
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
