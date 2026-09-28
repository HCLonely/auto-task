/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/twitter/adapters/gmHttp.ts
 * @Description  : Twitter 用户脚本 HTTP 请求适配
 */

import type { HttpClient, HttpRequestOptions, HttpResponse } from '../types';

export interface GMRawResponse {
  status: number;
  statusText?: string;
  responseText?: string;
  response?: unknown;
  responseHeaders?: string;
  finalUrl?: string;
}
export interface GMRequestOptions extends Omit<HttpRequestOptions, 'dataType' | 'responseType'> {
  /** GM's text mode is selected by omitting responseType. */
  responseType?: 'json';
  /**
   * 处理请求加载完成事件。
   *
   * @param response - 请求响应数据。
   */
  onload: (response: GMRawResponse) => void;
  /**
   * 处理请求失败事件。
   *
   * @param response - 请求响应数据；可省略。
   */
  onerror: (response?: unknown) => void;
  /**
   * 处理请求超时事件。
   *
   * @param response - 请求响应数据；可省略。
   */
  ontimeout: (response?: unknown) => void;
  /**
   * 处理请求中止事件。
   *
   * @param response - 请求响应数据；可省略。
   */
  onabort: (response?: unknown) => void;
}
/**
 * 调用用户脚本 HTTP 请求接口。
 *
 * @param options - 本次操作的配置选项。
 * @returns 处理结果。
 */
export type GMRequest = (options: GMRequestOptions) => unknown;

/**
 * 解析响应头文本并合并同名响应头。
 *
 * @param raw - 按行分隔的原始 HTTP 响应头；默认值为 `''`。
 * @returns 处理后的数据对象。
 */
function parseHeaders(raw = ''): Record<string, string | string[]> {
  const headers: Record<string, string | string[]> = Object.create(null);
  for (const line of raw.split(/\r?\n/)) {
    const index = line.indexOf(':');
    if (index < 1) {
      continue;
    }
    const key = line.slice(0, index).trim().toLowerCase();
    const value = line.slice(index + 1).trim();
    const previous = headers[key];
    headers[key] = previous === undefined ? value : [...(Array.isArray(previous) ? previous : [previous]), value];
  }
  return headers;
}

/**
 * 请求不会自动重试；写入请求超时时，服务端仍可能已经完成操作。
 *
 * @param request - 底层请求函数或请求数据。
 * @returns HTTP 客户端函数；传输完成与 HTTP 业务成功由响应中的不同字段表示。
 */
export function createGMHttpClient(request: GMRequest): HttpClient {
  return (options) => {
    return new Promise<HttpResponse>((resolve) => {
      let settled = false;
      /**
       * 完成当前操作并交付结果。
       *
       * @param response - 请求响应数据。
       */
      const finish = (response: HttpResponse) => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timer);
        resolve(response);
      };
      /**
       * 记录当前操作的失败状态。
       *
       * @param status - 操作或传输状态。
       * @param statusText - 状态说明文本。
       */
      const fail = (status: number, statusText: string) => {
        return finish({
          result: status === 604 ? 'JsError' : 'Error',
          status,
          statusText
        });
      };
      const timeout = options.timeout && options.timeout > 0 ? options.timeout : 30000;
      let handle: unknown;
      const timer = setTimeout(() => {
        fail(601, 'Timeout');
        try {
          (handle as { /** 中止当前请求。 */ abort?: () => void } | undefined)?.abort?.();
        } catch { /* Already settled. */ }
      }, timeout);
      const {
        dataType, ...requestOptions
      } = options;
      const responseType = dataType || options.responseType || 'text';
      try {
        handle = request({
          ...requestOptions,
          timeout,
          responseType: responseType === 'json' ? 'json' : undefined,
          /**
           * 处理请求超时事件。
           */
          ontimeout: () => {
            return fail(601, 'Timeout');
          },
          /**
           * 处理请求中止事件。
           */
          onabort: () => {
            return fail(602, 'Aborted');
          },
          /**
           * 处理请求失败事件。
           */
          onerror: () => {
            return fail(603, 'NetworkError');
          },
          /**
           * 处理请求加载完成事件。
           *
           * @param raw - 尚未解析的原始数据。
           */
          onload: (raw) => {
            try {
              const responseHeaders = parseHeaders(raw.responseHeaders);
              let response = raw.response;
              // Some managers do not expose responseText for JSON responses.
              let responseText = '';
              try {
                responseText = raw.responseText || '';
              } catch { /* Use parsed JSON. */ }
              if (responseType === 'json' && (response === undefined || response === null || typeof response === 'string')) {
                try {
                  response = JSON.parse(responseText || String(response));
                } catch {
                  fail(604, 'InvalidJSON');
                  return;
                }
              }
              finish({
                result: 'Success',
                status: 600,
                statusText: 'Load',
                data: {
                  status: raw.status,
                  statusText: raw.statusText || '',
                  responseText,
                  response,
                  responseHeaders,
                  finalUrl: raw.finalUrl || options.url
                }
              });
            } catch {
              fail(604, 'InvalidResponse');
            }
          }
        });
        // Also consume rejected promises from managers exposing GM.xmlHttpRequest.
        if (handle && typeof (handle as PromiseLike<unknown>).then === 'function') {
          void Promise.resolve(handle).catch(() => {
            return fail(603, 'NetworkError');
          });
        }
      } catch {
        fail(604, 'RequestError');
      }
    });
  };
}
