/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 16:24:42
 * @LastEditTime : 2026-09-28 17:35:44
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/echoLog.types.ts
 * @Description  : 任务日志状态类型定义
 */

export interface logStatus {
  font?: JQuery
  /**
   * 记录操作成功状态。
   *
   * @param text - 待处理的文本；可省略。
   * @param html - 待解析或显示的 HTML 内容；可省略。
   * @returns 可继续更新同一条日志的状态控制器。
   */
  success: (text?: string, html?: boolean) => logStatus
  /**
   * 记录错误状态。
   *
   * @param text - 待处理的文本；可省略。
   * @param html - 待解析或显示的 HTML 内容；可省略。
   * @returns 可继续更新同一条日志的状态控制器。
   */
  error: (text?: string, html?: boolean) => logStatus
  /**
   * 记录警告状态。
   *
   * @param text - 待处理的文本；可省略。
   * @param html - 待解析或显示的 HTML 内容；可省略。
   * @returns 可继续更新同一条日志的状态控制器。
   */
  warning: (text?: string, html?: boolean) => logStatus
  /**
   * 记录信息状态。
   *
   * @param text - 待处理的文本；可省略。
   * @param html - 待解析或显示的 HTML 内容；可省略。
   * @returns 可继续更新同一条日志的状态控制器。
   */
  info: (text?: string, html?: boolean) => logStatus
  /**
   * 更新界面视图。
   *
   * @param text - 待处理的文本；可省略。
   * @param html - 待解析或显示的 HTML 内容；可省略。
   * @returns 可继续更新同一条日志的状态控制器。
   */
  view: (text?: string, html?: boolean) => logStatus
}
