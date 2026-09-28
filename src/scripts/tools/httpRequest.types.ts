/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 16:24:42
 * @LastEditTime : 2026-09-28 17:35:45
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/tools/httpRequest.types.ts
 * @Description  : HTTP 请求与响应类型定义
 */

export interface MonkeyXhrResponse {
  finalUrl: string
  readyState: number
  status: number
  statusText: string
  responseHeadersText: string
  responseHeaders: any
  response: any
  responseXML: Document
  responseText: string
}

export interface MonkeyXhrBasicDetails {
  method: 'GET' | 'POST' | 'HEAD' | 'DELETE'
  url: string
  headers?: { [name: string]: string },
  data?: string | FormData
  binary?: boolean
  timeout?: number
  nochche?: boolean
  context?: any
  responseType?: 'arraybuffer' | 'blob' | 'json'
  overrideMimeType?: string
  anonymous?: boolean
  fetch?: boolean
  username?: string
  password?: string,
  redirect?: 'follow' | 'error' | 'manual'
}

export interface MonkeyXhrDetails extends MonkeyXhrBasicDetails {
  /**
   * 处理请求中止事件。
   */
  onabort?: () => void
  /**
   * 处理请求失败事件。
   *
   * @param response - 请求响应数据。
   */
  onerror?: (response: MonkeyXhrResponse) => void
  /**
   * 处理请求开始加载事件。
   *
   * @param response - 请求响应数据。
   */
  onloadstart?: (response: MonkeyXhrResponse) => void
  /**
   * 处理请求传输进度事件。
   *
   * @param response - 请求响应数据。
   */
  onprogress?: (response: MonkeyXhrResponse) => void
  /**
   * 处理请求状态变化事件。
   *
   * @param response - 请求响应数据。
   */
  onreadystatechange?: (response: MonkeyXhrResponse) => void
  /**
   * 处理请求超时事件。
   *
   * @param response - 请求响应数据。
   */
  ontimeout?: (response: MonkeyXhrResponse) => void
  /**
   * 处理请求加载完成事件。
   *
   * @param response - 请求响应数据。
   */
  onload?: (response: MonkeyXhrResponse) => void
}

export interface httpRequestOptions extends MonkeyXhrDetails {
  dataType?: 'arraybuffer' | 'blob' | 'json'
}

export interface httpResponse {
  result: string
  statusText: string
  status: number
  options: httpRequestOptions
  data?: MonkeyXhrResponse
  error?: Error
}
