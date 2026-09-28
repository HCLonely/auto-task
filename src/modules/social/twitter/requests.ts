import { refreshCsrf } from './auth/cookies';
import type { Context } from './context';
import type { HttpRequestOptions, HttpResponse } from './types';

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

export function errorCode(response: HttpResponse): number | undefined {
  return response.data?.response?.errors?.[0]?.code;
}
export function hasErrors(response: HttpResponse): boolean {
  const errors = response.data?.response?.errors;
  return Array.isArray(errors) && errors.length > 0;
}

/** Generate a fresh transaction ID and read the current CSRF token on every attempt. */
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
