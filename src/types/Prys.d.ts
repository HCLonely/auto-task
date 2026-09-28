/*
 * @Author       : HCLonely
 * @Date         : 2021-12-24 15:52:25
 * @LastEditTime : 2026-09-28 17:35:44
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/types/Prys.d.ts
 * @Description  : Prys 页面函数类型声明
 */

/**
 * 处理 Prys 页面按钮点击。
 *
 * @param prarm - 页面函数使用的参数。
 */
declare function checkClick(prarm: number): void
/**
 * 读取页面 URL 中的指定参数。
 *
 * @param prarm - 页面函数使用的参数。
 * @returns 处理后的字符串。
 */
declare function getURLParameter(prarm: string): string
/**
 * 显示 Prys 页面提示。
 *
 * @param prarm1 - 提示的第一个参数。
 * @param prarm2 - 提示的第二个参数。
 */
declare function showAlert(prarm1: string, prarm2: string): void
/**
 * 触发 Prys 页面验证码检查。
 */
declare function captchaCheck(): void
