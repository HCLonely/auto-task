/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:35:47
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/steam/steamWeb/utils/html.ts
 * @Description  : Steam 网页端 HTML 解析与表单编码
 */

/**
 * 在独立文档中解析 HTML，不将 Steam 页面内容插入当前页面。
 *
 * @param html - 待解析或显示的 HTML 内容。
 * @returns 解析得到的独立 HTML 文档。
 */
export function parseHTML(html: string): Document {
  return new DOMParser().parseFromString(html.replace(/<img\b[^>]*>/gi, ''), 'text/html');
}

/**
 * 将键值数据编码为表单请求字符串。
 *
 * @param values - 待处理的值列表。
 * @returns 处理后的字符串。
 */
export function encodeForm(values: object): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    params.set(key, value == null ? '' : String(value));
  }
  return params.toString();
}
