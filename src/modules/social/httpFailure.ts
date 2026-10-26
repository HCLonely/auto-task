/**
 * 只提取接口的错误说明，不把响应正文、请求参数或授权信息写入状态事件。
 * HTTP 200 也可能包含业务错误；HTML 错误页不作为错误说明展示。
 */
export function httpFailureDetails(result: {
  result: string;
  status: number;
  data?: { status: number; response?: unknown; responseText?: string };
}): Record<string, string | number | boolean> {
  let body = result.data?.response;
  if (typeof body !== 'object' || body === null) {
    try {
      body = JSON.parse(typeof body === 'string' ? body : (result.data?.responseText || ''));
    } catch {
      body = undefined;
    }
  }
  const messages: string[] = [];
  const collect = (value: unknown, depth = 0): void => {
    if (depth > 4 || !value || typeof value !== 'object') {
      return;
    }
    if (Array.isArray(value)) {
      value.slice(0, 10).forEach((item) => {
        return collect(item, depth + 1);
      });
      return;
    }
    const record = value as Record<string, unknown>;
    for (const key of ['msg', 'message', 'error_description', 'error_msg', 'Message']) {
      const message = record[key];
      if (typeof message === 'string' && message.trim() && !/^(ok|success)$/i.test(message.trim())) {
        messages.push(message.trim().slice(0, 2000));
      }
    }
    if (typeof record.error === 'string') {
      messages.push(record.error.slice(0, 2000));
    }
    for (const key of ['error', 'errors', 'response', 'json']) {
      collect(record[key], depth + 1);
    }
  };
  collect(body);
  return messages.length ? {
    message: [...new Set(messages)].join('; ').slice(0, 2000)
  } : {};
}
