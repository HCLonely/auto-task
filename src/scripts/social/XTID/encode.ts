/*
 * @Author       : HCLonely
 * @Date         : 2025-05-30 16:10:59
 * @LastEditTime : 2025-08-18 19:09:58
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/social/XTID/encode.ts
 * @Description  : XTID 生成器
 */

// 参考：https://github.com/fa0311/x-client-transaction-id-generater/blob/main/src/encode.js

/**
 * @param {string} data
 * @returns {Promise<number[]>}
 */
const encodeSha256 = async (data: string): Promise<number[]> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  return Array.from(new Uint8Array(hashBuffer));
};

/**
 * @param {Uint8Array} data
 * @returns {string}
 */
const encodeBase64 = (data: Uint8Array): string => {
  let binary = '';
  const bytes = new Uint8Array(data);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/=/g, '');
};

/**
 * @param {string} data
 * @returns {number[]}
 */
const decodeBase64 = (data: string): number[] => {
  const binaryString = atob(data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return Array.from(bytes);
};

/**
 * @param {string} method
 * @param {string} path
 * @param {string} key
 * @param {string} animationKey
 * @returns {Promise<string>}
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
