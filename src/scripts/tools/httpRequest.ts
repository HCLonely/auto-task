/*
 * @Author       : HCLonely
 * @Date         : 2021-10-13 13:55:36
 * @LastEditTime : 2025-08-18 19:07:58
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/tools/httpRequest.ts
 * @Description  : http请求函数封装
 */
import throwError from './throwError';
import { debug } from './debug';

/**
 * HTTP 请求头接口定义
 * @interface Headers
 * @description 用于存储 HTTP 请求/响应头的键值对
 */
interface Headers {
  [key: string]: string | Array<string>;
}

/**
 * 解析 HTTP 头字符串为对象
 *
 * @param {string} [headerString] - HTTP 头字符串，每行一个头部
 * @returns {Headers} 解析后的头部对象
 *
 * @description
 * 该函数将原始的 HTTP 头字符串解析为结构化的对象。
 * 处理多值头部（如 set-cookie）时会将值转换为数组。
 * 如果输入为空，则返回空对象。
 */
const parseHeaders = (headerString?: string): Headers => {
  debug('开始解析HTTP头', { headerString });
  const headers: Headers = {};
  if (!headerString) {
    debug('HTTP头为空，返回空对象');
    return headers;
  }

  headerString.split('\n').forEach((header: string) => {
    const [name, ...values] = header.trim().split(':');
    const value = values.join(':').trim();
    if (!name || !value) return;

    if (headers[name]) {
      headers[name] = Array.isArray(headers[name]) ? [...headers[name] as Array<string>, value] : [headers[name] as string, value];
    } else {
      headers[name] = value;
    }
  });

  if (headers['set-cookie'] && !Array.isArray(headers['set-cookie'])) {
    headers['set-cookie'] = [headers['set-cookie'] as string];
  }

  debug('HTTP头解析完成', { headers });
  return headers;
};

/**
 * 处理 HTTP 响应数据
 *
 * @param {any} data - 原始响应数据
 * @param {httpRequestOptions} options - 请求配置选项
 * @returns {void}
 *
 * @description
 * 该函数处理 HTTP 响应数据，包括：
 * 1. 解析响应头
 * 2. 设置最终 URL
 * 3. 如果响应类型为 JSON，尝试解析响应文本
 */
const processResponse = (data: any, options: httpRequestOptions): void => {
  debug('开始处理响应数据', { responseType: options.responseType });
  const headers = parseHeaders(data.responseHeaders);
  data.responseHeadersText = data.responseHeaders;
  data.responseHeaders = headers;
  data.finalUrl = headers.location || data.finalUrl;
  debug('响应头处理完成', { finalUrl: data.finalUrl });

  if (options.responseType === 'json' && data?.response && typeof data.response !== 'object') {
    debug('尝试解析JSON响应');
    try {
      data.response = JSON.parse(data.responseText);
      debug('JSON解析成功');
    } catch {
      debug('JSON解析失败，保持原始响应');
    }
  }
};

/**
 * 发送 HTTP 请求并返回响应结果
 *
 * @param {httpRequestOptions} options - 请求配置选项，包括 URL、方法、数据等
 * @param {number} [times=0] - 当前重试次数，默认为 0
 * @returns {Promise<httpResponse>} HTTP 响应对象的 Promise
 *
 * @description
 * 该函数使用 GM_xmlhttpRequest 发送 HTTP 请求，支持以下特性：
 * 1. 自动重试（最多2次）
 * 2. 超时处理（默认30秒）
 * 3. 错误处理
 * 4. 响应数据处理（包括头部解析和 JSON 解析）
 * 5. 调试日志
 *
 * 响应状态码说明：
 * - 600: 成功
 * - 601: 超时
 * - 602: 已中止
 * - 603: 请求错误
 * - 604: JavaScript 错误
 */
const httpRequest = async (options: httpRequestOptions, times = 0): Promise<httpResponse> => {
  debug('开始HTTP请求', { url: options.url, method: options.method, retryTimes: times });
  if (window.TRACE) console.trace('%cAuto-Task[Trace]:', 'color:blue');
  try {
    const result = await new Promise<httpResponse>((resolve) => {
      const requestObj: httpRequestOptions = {
        fetch: true,
        timeout: 30000,
        ontimeout: (data) => {
          debug('请求超时', { url: options.url });
          resolve({
            result: 'Error',
            statusText: 'Timeout',
            status: 601,
            data,
            options
          });
        },
        onabort: () => {
          debug('请求被中止', { url: options.url });
          resolve({
            result: 'Error',
            statusText: 'Aborted',
            status: 602,
            data: undefined,
            options
          });
        },
        onerror: (data) => {
          debug('请求发生错误', { url: options.url, error: data });
          resolve({
            result: 'Error',
            statusText: 'Error',
            status: 603,
            data,
            options
          });
        },
        onload: (data) => {
          debug('请求加载完成', { url: options.url, status: data.status });
          processResponse(data, options);
          resolve({
            result: 'Success',
            statusText: 'Load',
            status: 600,
            data,
            options
          });
        },
        ...options,
        responseType: options.dataType || options.responseType
      };

      debug('发送请求', { requestObj });
      // @ts-ignore
      GM_xmlhttpRequest(requestObj);
    });
    if (window.DEBUG) console.log('%cAuto-Task[httpRequest]:', 'color:blue', result);
    if (result.status !== 600 && times < 2) {
      debug('请求失败，准备重试', { status: result.status, retryTimes: times + 1 });
      return await httpRequest(options, times + 1);
    }
    debug('请求完成', { status: result.status, result: result.result });
    return result;
  } catch (error) {
    debug('请求发生JavaScript错误', { error });
    console.log('%cAuto-Task[httpRequest]:', 'color:red', JSON.stringify({ errorMsg: error, options }));
    throwError(error as Error, 'httpRequest');
    return { result: 'JsError', statusText: 'Error', status: 604, error: error as Error, options };
  }
};

export default httpRequest;
