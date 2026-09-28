/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:35:45
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/twitter/requests.ts
 * @Description  : Twitter 接口请求与错误处理
 */

import { refreshCsrf } from './auth/cookies';
import type { Context } from './context';
import type { HttpRequestOptions, HttpResponse } from './types';

/**
 * 执行底层 HTTP 传输。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param options - 本次操作的配置选项。
 * @returns Promise，完成后返回标准化的传输状态与响应数据。
 * @throws Error - 触发 'Disposed' 错误条件时抛出。
 */
export async function transport(ctx: Context, options: HttpRequestOptions): Promise<HttpResponse> {
  if (ctx.state.disposed) {
    throw new Error('Disposed');
  }
  ctx.progress('HTTP_REQUEST_STARTED', 'debug', {
    method: options.method || 'GET'
  });
  const result = await ctx.options.http(options);
  if (ctx.state.disposed) {
    throw new Error('Disposed');
  }
  ctx.progress('HTTP_REQUEST_COMPLETED', result.result === 'Success' ? 'debug' : 'warning', {
    transportStatus: result.status,
    httpStatus: result.data?.status || 0
  });
  return result;
}

/**
 * 从接口响应中提取错误代码。
 *
 * @param response - 请求响应数据。
 * @returns 计算得到的数值；未取得有效结果时返回 undefined。
 */
export function errorCode(response: HttpResponse): number | undefined {
  return response.data?.response?.errors?.[0]?.code;
}
/**
 * 检查接口响应是否包含错误。
 *
 * @param response - 请求响应数据。
 * @returns 检查结果；满足条件时为 true，否则为 false。
 */
export function hasErrors(response: HttpResponse): boolean {
  const errors = response.data?.response?.errors;
  return Array.isArray(errors) && errors.length > 0;
}

/**
 * 每次尝试请求时生成新的事务标识，并读取当前 CSRF 令牌。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param path - 请求路径。
 * @param options - 本次操作的配置选项。
 * @returns Promise，完成后返回标准化的传输状态与响应数据。
 * @throws Error - 触发 'Not authenticated' 错误条件时抛出。
 * @throws Error - 触发 'Empty transaction ID' 错误条件时抛出。
 * @throws Error - 触发 'Retry exhausted' 错误条件时抛出。
 */
export async function apiRequest(ctx: Context, path: string, options: Omit<HttpRequestOptions, 'url'>): Promise<HttpResponse> {
  for (let attempt = 0;attempt < 2;attempt++) {
    if (!ctx.state.auth || !ctx.state.getTID) {
      throw new Error('Not authenticated');
    }
    const tid = await ctx.state.getTID(options.method || 'GET', path);
    if (!tid) {
      throw new Error('Empty transaction ID');
    }
    const response = await transport(ctx, {
      ...options,
      url: `https://x.com${path}`,
      responseType: 'json',
      headers: {
        authorization: `Bearer ${ctx.api.bearerToken}`,
        'X-Twitter-Auth-Type': 'OAuth2Session',
        'X-Twitter-Active-User': 'yes',
        ...options.headers,
        'x-csrf-token': ctx.state.auth.ct0,
        'x-twitter-client-language': ctx.state.auth.language,
        'x-client-transaction-id': tid
      }
    });
    if (response.result === 'Success' && response.data?.status === 403 && errorCode(response) === 353 &&
      attempt === 0 && await refreshCsrf(ctx, response)) {
      ctx.progress('RETRYING', 'warning');
      continue;
    }
    return response;
  }
  throw new Error('Retry exhausted');
}

/**
 * 记录接口失败状态。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param response - 请求响应数据。
 * @returns false，表示当前操作失败。
 */
export function reportFailure(ctx: Context, response: HttpResponse): false {
  ctx.progress('REQUEST_OR_RESPONSE_FAILED', 'error', {
    transportStatus: response.status,
    httpStatus: response.data?.status || 0,
    ...(typeof errorCode(response) === 'number' ? {
      apiCode: errorCode(response)!
    } : {})
  });
  return false;
}
