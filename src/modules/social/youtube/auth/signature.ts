import type { SHA1, YoutubeInfo } from '../types';

export const sha1: SHA1 = async (value) => {
  const digest = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => {
    return byte.toString(16).padStart(2, '0');
  }).join('');
};

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
