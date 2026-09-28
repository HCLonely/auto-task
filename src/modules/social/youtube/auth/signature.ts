/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/youtube/auth/signature.ts
 * @Description  : YouTube 请求签名与认证请求头生成
 */

import type { SHA1, YoutubeInfo } from '../types';

/**
 * 计算文本的 SHA-1 摘要。
 *
 * @param value - 待处理的值。
 * @returns Promise，完成后返回处理后的字符串。
 */
export const sha1: SHA1 = async (value) => {
  const digest = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => {
    return byte.toString(16).padStart(2, '0');
  }).join('');
};

/**
 * 生成 YouTube 请求所需的签名请求头。
 *
 * @param cookie - 待处理的 Cookie。
 * @param params - 操作参数集合。
 * @param referer - 请求来源页面地址。
 * @param hash - 摘要数据。
 * @returns Promise，完成后返回处理后的数据对象。
 * @throws Error - 触发 'Missing auth' 错误条件时抛出。
 * @throws Error - 触发 'Invalid SHA-1 implementation' 错误条件时抛出。
 */
export async function signedHeaders(cookie: string, params: NonNullable<YoutubeInfo['params']>, referer: string, hash: SHA1): Promise<Record<string, string>> {
  if (!cookie) {
    throw new Error('Missing auth');
  }
  const now = Math.floor(Date.now() / 1000);
  const digest = await hash(`${now} ${cookie} https://www.youtube.com`);
  if (!/^[0-9a-f]{40}$/i.test(digest)) {
    throw new Error('Invalid SHA-1 implementation');
  }
  return {
    origin: 'https://www.youtube.com',
    referer,
    'content-type': 'application/json',
    'x-goog-authuser': '0',
    'x-origin': 'https://www.youtube.com',
    ...(typeof params.client.visitorData === 'string' ? {
      'x-goog-visitor-id': params.client.visitorData
    } : {}),
    authorization: `SAPISIDHASH ${now}_${digest}`
  };
}

/**
 * 构建 YouTube 接口请求上下文。
 *
 * @param params - 操作参数集合。
 * @returns 处理后的数据对象；未取得有效结果时返回 undefined。
 */
export function requestContext(params: NonNullable<YoutubeInfo['params']>) {
  return {
    client: params.client,
    request: {
      sessionId: params.request.sessionId,
      internalExperimentFlags: [],
      consistencyTokenJars: []
    },
    user: {}
  };
}
