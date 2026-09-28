/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:07
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/twitter/transaction/encode.ts
 * @Description  : Twitter 请求事务标识编码与生成
 */

/** Transaction-ID encoding migrated from src/scripts/social/XTID/encode.ts. */
// 参考：https://github.com/fa0311/x-client-transaction-id-generater/blob/main/src/encode.js

/**
 * 计算文本的 SHA-256 摘要并转换为字节数组。
 *
 * @param data - 需要计算摘要的原始文本。
 * @returns Promise，完成后返回 SHA-256 摘要的字节数组。
 */
const encodeSha256 = async (data: string): Promise<number[]> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  return Array.from(new Uint8Array(hashBuffer));
};

/**
 * 将字节数组编码为 Base64 字符串。
 *
 * @param data - 待编码的字节数组。
 * @returns 去除末尾填充符的 Base64 字符串。
 */
const encodeBase64 = (data: Uint8Array): string => {
  let binary = '';
  const bytes = new Uint8Array(data);
  const len = bytes.byteLength;
  for (let i = 0;i < len;i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/=/g, '');
};

/**
 * 将 Base64 字符串解码为字节数组。
 *
 * @param data - 待解码的 Base64 字符串。
 * @returns 解码后的字节数组。
 */
const decodeBase64 = (data: string): number[] => {
  const binaryString = atob(data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0;i < len;i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return Array.from(bytes);
};

/**
 * 根据请求方法、路径和密钥生成请求事务标识。
 *
 * @param method - HTTP 请求方法。
 * @param path - 请求路径。
 * @param key - Base64 编码的事务签名密钥。
 * @param animationKey - 事务标识使用的动画密钥。
 * @returns Promise，完成后返回包含时间与随机分量的请求事务标识。
 */
const generateTransactionId = async (
  method: string,
  path: string,
  key: string,
  animationKey: string
): Promise<string> => {
  const DEFAULT_KEYWORD = 'obfiowerehiring';
  const ADDITIONAL_RANDOM_NUMBER = 3;
  const timeNow = Math.floor((Date.now() - (1682924400 * 1000)) / 1000);
  const timeNowBytes = [
    timeNow & 0xff,
    (timeNow >> 8) & 0xff,
    (timeNow >> 16) & 0xff,
    (timeNow >> 24) & 0xff
  ];

  const data = `${method}!${path}!${timeNow}${DEFAULT_KEYWORD}${animationKey}`;
  const hashBytes = await encodeSha256(data);
  const keyBytes = decodeBase64(key);

  const randomNum = Math.floor(Math.random() * 256);
  const bytesArr = [
    ...keyBytes,
    ...timeNowBytes,
    ...hashBytes.slice(0, 16),
    ADDITIONAL_RANDOM_NUMBER
  ];

  const out = new Uint8Array(bytesArr.length + 1);
  out[0] = randomNum;
  bytesArr.forEach((item, index) => {
    out[index + 1] = item ^ randomNum;
  });

  return encodeBase64(out);
};

export { generateTransactionId };
