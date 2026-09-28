/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:35:46
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/reddit/features/graphql.ts
 * @Description  : Reddit GraphQL 操作记录与请求执行
 */

import type { Context } from '../context';

/**
 * 检查未知值是否为可读取字段的普通对象。
 *
 * @param value - 待处理的值。
 * @returns 处理后的数据对象；未取得有效结果时返回 undefined。
 */
function record(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
}

/**
 * 要求接口明确返回业务成功结果，仅有 HTTP 200 不足以判定成功。
 *
 * @param ctx - 当前操作上下文，包含授权、存储和状态事件。
 * @param operation - 操作名称或执行函数。
 * @param input - 待解析或校验的输入。
 * @returns Promise，完成后返回操作结果；成功或无需重复处理时为 true，失败时为 false。
 */
export async function mutate(ctx: Context, operation: string, input: unknown): Promise<boolean> {
  const {
    result, data
  } = await ctx.request({
    url: 'https://www.reddit.com/svc/shreddit/graphql',
    method: 'POST',
    responseType: 'json',
    headers: {
      'content-type': 'application/json'
    },
    data: JSON.stringify({
      operation,
      variables: {
        input
      },
      csrf_token: ctx.state.csrfToken
    })
  });
  if (result !== 'Success') {
    return ctx.fail('REQUEST_FAILED');
  }
  if (data?.status !== 200) {
    return ctx.fail((data?.status === 401 || data?.status === 403) ? 'AUTH_REQUIRED' : 'HTTP_ERROR');
  }
  const payload = record(data.response);
  const body = record(payload?.data);
  const mutation = record(body?.[operation] ?? body?.[operation[0].toLowerCase() + operation.slice(1)]);
  /**
   * 检查接口响应是否包含错误。
   *
   * @param value - 待处理的值。
   * @returns 检查结果；满足条件时为 true，否则为 false。
   */
  const hasErrors = (value: unknown) => {
    return value != null && (!Array.isArray(value) || value.length > 0);
  };
  if (hasErrors(payload?.errors) || hasErrors(body?.errors) || hasErrors(mutation?.errors)) {
    return ctx.fail('GRAPHQL_ERROR');
  }
  if (mutation?.ok !== true) {
    return ctx.fail('MUTATION_NOT_CONFIRMED');
  }
  return true;
}
