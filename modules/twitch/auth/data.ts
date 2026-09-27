import type { Auth } from '../types';

const fields = ['authToken', 'clientId', 'clientVersion', 'deviceId', 'clientSessionId'] as const;
export function validAuth(value: unknown): value is Auth {
  return typeof value === 'object' && value !== null && fields.every((key) =>
    typeof (value as Auth)[key] === 'string' && (value as Auth)[key].trim().length > 0);
}
export function pickAuth(auth: Auth): Auth {
  return Object.fromEntries(fields.map((key) => [key, auth[key]])) as unknown as Auth;
}
