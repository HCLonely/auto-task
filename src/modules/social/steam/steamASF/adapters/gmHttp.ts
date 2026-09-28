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
  onload: (response: GMRawResponse) => void;
  onerror: (response?: unknown) => void;
  ontimeout: (response?: unknown) => void;
  onabort: (response?: unknown) => void;
}
export type GMRequest = (options: GMRequestOptions) => unknown;

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

/** No automatic retries: a timed-out write may already have reached Steam. */
export function createGMHttpClient(request: GMRequest): HttpClient {
  return (options) => {
    return new Promise<HttpResponse>((resolve) => {
      let settled = false;
      const finish = (response: HttpResponse) => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timer);
        resolve(response);
      };
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
          (handle as { abort?: () => void } | undefined)?.abort?.();
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
          ontimeout: () => {
            return fail(601, 'Timeout');
          },
          onabort: () => {
            return fail(602, 'Aborted');
          },
          onerror: () => {
            return fail(603, 'NetworkError');
          },
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
