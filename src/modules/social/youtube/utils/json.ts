/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:35:46
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/youtube/utils/json.ts
 * @Description  : YouTube 页面 JSON 数据提取
 */

/**
 * 将未知值检查或转换为可访问的对象。
 *
 * @param value - 待处理的值。
 * @returns 输入是否符合目标类型；为 true 时可按目标类型继续访问。
 */
export function object(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * 读取引号属性名后的一个 JSON 值，支持嵌套括号与转义引号。
 *
 * @param text - 待处理的文本。
 * @param key - 目标数据的键名。
 * @returns 处理结果。
 */
export function jsonProperty(text: string, key: string): unknown {
  const matcher = new RegExp(`"${key}"\\s*:\\s*`, 'g');
  while (matcher.exec(text)) {
    const start = matcher.lastIndex;
    let depth = 0;
    let quoted = false;
    let escaped = false;
    for (let i = start; i < text.length; i++) {
      const char = text[i];
      if (quoted) {
        if (escaped) {
          escaped = false;
        } else if (char === '\\') {
          escaped = true;
        } else if (char === '"') {
          quoted = false;
        }
      } else if (char === '"') {
        quoted = true;
      } else if (char === '{' || char === '[') {
        depth++;
      } else if (char === '}' || char === ']') {
        depth--;
      }
      if (!quoted && depth === 0) {
        try {
          return JSON.parse(text.slice(start, i + 1));
        } catch {
          break;
        }
      }
    }
  }
  return undefined;
}
