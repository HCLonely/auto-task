/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/twitch/auth/data.ts
 * @Description  : Twitch 授权数据校验与提取
 */

import type { Auth } from '../types';

const fields = ['authToken', 'clientId', 'clientVersion', 'deviceId', 'clientSessionId'] as const;
/**
 * 检查授权数据是否包含所需字段。
 *
 * @param value - 待处理的值。
 * @returns 检查结果；满足条件时为 true，否则为 false。
 */
export function validAuth(value: unknown): value is Auth {
  return typeof value === 'object' && value !== null && fields.every((key) => {
    return typeof (value as Auth)[key] === 'string' && (value as Auth)[key].trim().length > 0;
  });
}
/**
 * 提取授权对象中允许使用的字段。
 *
 * @param auth - 授权信息。
 * @returns 校验或提取后的授权信息。
 */
export function pickAuth(auth: Auth): Auth {
  return Object.fromEntries(fields.map((key) => {
    return [key, auth[key]];
  })) as unknown as Auth;
}
