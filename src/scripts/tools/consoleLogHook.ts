/*
 * @Author       : HCLonely
 * @Date         : 2025-06-14 12:31:06
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/tools/consoleLogHook.ts
 * @Description  : 日志钩子
 */

// 扩展字段名正则
const tokenKeyPattern = /token|auth|session|jwt|key|secret|api[-_]?key|bearer|authorization|access[-_]?token|refresh[-_]?token|sid/i;

// 扩展字符串识别正则
const tokenStringPatterns = [
  // JWT
  /([A-Za-z0-9-_]{10,})\.([A-Za-z0-9-_]{10,})\.([A-Za-z0-9-_]{10,})/g,
  // Bearer/Basic
  /(Bearer|Basic)\s+([A-Za-z0-9\-._~+/]+=*)/gi,
  // 长字符串（API Key、SessionID等）
  // /\b([A-Za-z0-9]{16,})\b/g,
  // UUID/GUID
  /\b([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\b/gi,
  // 以eyJ开头的base64（JWT常见）
  /\b(eyJ[A-Za-z0-9\-_]+)\b/g
];

/**
 * 隐藏令牌中的敏感内容。
 *
 * @param str - 待处理的字符串。
 * @returns 处理后的字符串。
 */
const maskToken = (str: string): string => {
  if (typeof str !== 'string' || str.length < 8) {
    return str;
  }
  // 只保留前4和后4
  return str.replace(/^([A-Za-z0-9\-_+/=]{4})[A-Za-z0-9\-_+/=]+([A-Za-z0-9\-_+/=]{4})$/, '$1***$2');
};

/**
 * 递归处理对象中的敏感字段。
 *
 * @param obj - 待处理的对象。
 * @returns 处理结果。
 */
const maskObject = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(maskObject);
  } else if (obj && typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      if (tokenKeyPattern.test(key) && typeof obj[key] === 'string') {
        newObj[key] = maskToken(obj[key]);
      } else {
        newObj[key] = maskObject(obj[key]);
      }
    }
    return newObj;
  }
  if (typeof obj === 'string' && obj.length > 8) {
    return maskString(obj);
  }
  return obj;
};

/**
 * 对字符串中的令牌信息脱敏。
 *
 * @param str - 待处理的字符串。
 * @returns 处理后的字符串。
 */
const maskString = (str: string): string => {
  let masked = str;
  for (const pattern of tokenStringPatterns) {
    masked = masked.replace(pattern, (match, ...groups) => {
      // 对JWT等分段处理
      if (groups.length >= 3 && match.includes('.')) {
        return groups.map((seg) => {
          return (seg.length > 8 ? `${seg.slice(0, 4)}***${seg.slice(-4)}` : seg);
        }).join('.');
      }
      // 其它token串
      if (match.length > 8) {
        return `${match.slice(0, 4)}***${match.slice(-4)}`;
      }
      return match;
    });
  }
  return masked;
};

/**
 * 对日志参数中的敏感信息脱敏。
 *
 * @param args - 传递给目标操作的参数列表。
 * @returns 处理后的数据列表。
 */
const maskArgs = (args: any[]): any[] => {
  return args.map((arg) => {
    if (typeof arg === 'string') {
      return maskString(arg);
    } else if (typeof arg === 'object' && arg !== null) {
      return maskObject(arg);
    }
    return arg;
  });
};

/**
 * 挂接控制台日志并对敏感字段脱敏。
 */
const consoleLogHook = () => {
  const originalLog = console.log;
  window.__allLogs = window.__allLogs || [];

  console.log = function (...args: any[]) {
    const maskedArgs = maskArgs(args);
    window.__allLogs.push(maskedArgs);
    originalLog.apply(console, maskedArgs);
  };
};

export default consoleLogHook;
