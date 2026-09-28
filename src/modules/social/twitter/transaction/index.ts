/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/twitter/transaction/index.ts
 * @Description  : Twitter 请求事务标识生成器创建
 */

import { DEFAULT_PAIR_URL } from '../defaults';
import type { HttpClient, TransactionIdProvider, TransactionPair } from '../types';
import { generateTransactionId } from './encode';

/**
 * 仅加载远端数据；编码算法在本地执行，不加载远端可执行代码。
 *
 * @param http - 注入的 HTTP 客户端。
 * @param url - 请求或访问的 URL；默认值为 `DEFAULT_PAIR_URL`。
 * @returns Promise，完成后返回供调用方使用的函数。
 * @throws Error - 触发 'Transaction dictionary unavailable' 错误条件时抛出。
 * @throws Error - 触发 'Invalid transaction dictionary' 错误条件时抛出。
 */
export async function createTransactionIdProvider(http: HttpClient, url = DEFAULT_PAIR_URL): Promise<TransactionIdProvider> {
  const result = await http({
    url,
    method: 'GET',
    responseType: 'json'
  });
  if (result.result !== 'Success' || result.data?.status !== 200) {
    throw new Error('Transaction dictionary unavailable');
  }
  const payload: unknown = result.data.response;
  const pairs: TransactionPair[] = Array.isArray(payload) ? payload.filter((pair): pair is TransactionPair => {
    if (!pair || typeof pair.verification !== 'string' || typeof pair.animationKey !== 'string' || !pair.animationKey) {
      return false;
    }
    try {
      return atob(pair.verification).length > 0;
    } catch {
      return false;
    }
  }) : [];
  if (!pairs.length) {
    throw new Error('Invalid transaction dictionary');
  }
  return async (method, path) => {
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    return generateTransactionId(method, path, pair.verification, pair.animationKey);
  };
}
