/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:35:45
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/twitch/graphql.ts
 * @Description  : Twitch GraphQL 请求封装
 */

import type { Context } from './context';

/**
 * 将未知值检查或转换为可访问的对象。
 *
 * @param value - 待处理的值。
 * @returns 处理后的数据对象。
 */
export function object(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

/**
 * 根据当前授权状态生成请求头。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param full - 完整匹配文本或完整数据标记；默认值为 `false`。
 * @returns 处理后的数据对象。
 * @throws Error - 触发 'Auth required' 错误条件时抛出。
 */
export function authHeaders(ctx: Context, full = false): Record<string, string> {
  const auth = ctx.state.auth;
  if (!auth) {
    throw new Error('Auth required');
  }
  return {
    Authorization: `OAuth ${auth.authToken}`,
    'Client-Id': auth.clientId,
    ...(full ? {
      Origin: 'https://www.twitch.tv',
      Referer: 'https://www.twitch.tv/',
      'Client-Version': auth.clientVersion,
      'X-Device-Id': auth.deviceId,
      'Client-Session-Id': auth.clientSessionId
    } : {})
  };
}

/**
 * 沿用持久化查询标识，状态事件中不发送响应正文或错误正文。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param operationName - 接口操作名称。
 * @param variables - GraphQL 操作变量。
 * @param hash - 摘要数据。
 * @param mutation - DOM 变更记录；默认值为 `false`。
 * @returns Promise，完成后返回处理后的数据对象；未取得有效结果时返回 false。
 */
export async function query(ctx: Context, operationName: string, variables: object, hash: string, mutation = false): Promise<Record<string, unknown> | false> {
  const result = await ctx.request({
    url: 'https://gql.twitch.tv/gql',
    method: 'POST',
    responseType: 'json',
    ...(mutation ? {
      anonymous: true
    } : {}),
    headers: {
      ...authHeaders(ctx, mutation),
      ...(mutation ? {
        'Client-Integrity': ctx.state.integrityToken
      } : {})
    },
    data: JSON.stringify([{
      operationName,
      variables,
      extensions: {
        persistedQuery: {
          version: 1,
          sha256Hash: hash
        }
      }
    }])
  });
  if (result.result !== 'Success' || result.data?.status !== 200) {
    ctx.progress('REQUEST_FAILED', 'error');
    return false;
  }
  const response = result.data.response;
  if (!Array.isArray(response) || response.length !== 1) {
    ctx.progress('INVALID_RESPONSE', 'error');
    return false;
  }
  const entry = object(response[0]);
  if (entry.errors && (!Array.isArray(entry.errors) || entry.errors.length > 0)) {
    ctx.progress('GRAPHQL_ERROR', 'error');
    return false;
  }
  if (!entry.data || typeof entry.data !== 'object') {
    ctx.progress('INVALID_RESPONSE', 'error');
    return false;
  }
  return object(entry.data);
}
