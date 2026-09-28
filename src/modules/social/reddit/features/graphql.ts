import type { Context } from '../context';

function record(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
}

/** Require explicit business success; HTTP 200 alone is insufficient. */
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
