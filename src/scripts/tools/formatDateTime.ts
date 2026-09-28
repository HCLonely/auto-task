/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 14:52:11
 * @LastEditTime : 2026-09-28 17:35:45
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/tools/formatDateTime.ts
 * @Description  : 日期时间格式化工具
 */

/**
 * 按本地时区格式化时间戳和 ISO 日期，与界面显示保持一致。
 *
 * @remarks
 * 不带时区的 ISO 日期按本地时间解释；无法解析的日期返回 Invalid Date。
 *
 * @param value - 时间戳、日期对象或 ISO 日期字符串。
 * @returns 本地时间字符串，格式为 YYYY-MM-DD HH:mm:ss；输入无效时返回 Invalid Date。
 */
export const formatDateTime = (value: number | string | Date): string => {
  // Date-only ISO strings must be interpreted locally, rather than as UTC.
  const local = typeof value === 'string' && /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?)?$/.exec(value);
  const date = local ?
    new Date(Number(local[1]), Number(local[2]) - 1, Number(local[3]), Number(local[4] || 0), Number(local[5] || 0), Number(local[6] || 0), Number((local[7] || '').slice(0, 3).padEnd(3, '0'))) :
    new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  /**
   * 将日期时间分量补齐为两位数字。
   *
   * @param part - 当前日期时间分量。
   * @returns 处理后的字符串。
   */
  const pad = (part: number) => {
    return String(part).padStart(2, '0');
  };
  return `${String(date.getFullYear()).padStart(4, '0')}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};
