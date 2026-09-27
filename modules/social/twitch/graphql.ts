import type { Context } from './context';

export function object(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

export function authHeaders(ctx: Context, full = false): Record<string, string> {
  const auth = ctx.state.auth;
  if (!auth) throw new Error('Auth required');
  return { Authorization: `OAuth ${auth.authToken}`, 'Client-Id': auth.clientId,
    ...(full ? { Origin: 'https://www.twitch.tv', Referer: 'https://www.twitch.tv/',
      'Client-Version': auth.clientVersion, 'X-Device-Id': auth.deviceId, 'Client-Session-Id': auth.clientSessionId } : {}) };
}

/** Persisted queries retained from the source; no response/error text is emitted. */
export async function query(ctx: Context, operationName: string, variables: object, hash: string, mutation = false): Promise<Record<string, unknown> | false> {
  const result = await ctx.request({ url: 'https://gql.twitch.tv/gql', method: 'POST', responseType: 'json',
    ...(mutation ? { anonymous: true } : {}),
    headers: { ...authHeaders(ctx, mutation), ...(mutation ? { 'Client-Integrity': ctx.state.integrityToken } : {}) },
    data: JSON.stringify([{ operationName, variables, extensions: { persistedQuery: { version: 1, sha256Hash: hash } } }]) });
  if (result.result !== 'Success' || result.data?.status !== 200) {
    ctx.progress('REQUEST_FAILED', 'error'); return false;
  }
  const response = result.data.response;
  if (!Array.isArray(response) || response.length !== 1) { ctx.progress('INVALID_RESPONSE', 'error'); return false; }
  const entry = object(response[0]);
  if (entry.errors && (!Array.isArray(entry.errors) || entry.errors.length > 0)) {
    ctx.progress('GRAPHQL_ERROR', 'error'); return false;
  }
  if (!entry.data || typeof entry.data !== 'object') { ctx.progress('INVALID_RESPONSE', 'error'); return false; }
  return object(entry.data);
}
