import { DEFAULT_PAIR_URL } from '../defaults';
import type { HttpClient, TransactionIdProvider, TransactionPair } from '../types';
import { generateTransactionId } from './encode';

/** Loads data, never remote executable code. The original encode algorithm stays local. */
export async function createTransactionIdProvider(http: HttpClient, url = DEFAULT_PAIR_URL): Promise<TransactionIdProvider> {
  const result = await http({ url, method: 'GET', responseType: 'json' });
  if (result.result !== 'Success' || result.data?.status !== 200) throw new Error('Transaction dictionary unavailable');
  const payload: unknown = result.data.response;
  const pairs: TransactionPair[] = Array.isArray(payload) ? payload.filter((pair): pair is TransactionPair => {
    if (!pair || typeof pair.verification !== 'string' || typeof pair.animationKey !== 'string' || !pair.animationKey) return false;
    try { return atob(pair.verification).length > 0; } catch { return false; }
  }) : [];
  if (!pairs.length) throw new Error('Invalid transaction dictionary');
  return async (method, path) => {
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    return generateTransactionId(method, path, pair.verification, pair.animationKey);
  };
}
