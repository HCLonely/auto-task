import type { SocialTaskDetailResult } from './types';

export function createTaskResult(): SocialTaskDetailResult {
  return {
    success: true,
    results: {}
  };
}

/** Link/type keys are data, including names such as __proto__ and constructor. */
export function setTaskResult(result: SocialTaskDetailResult, type: string, value: string, success: boolean): void {
  if (!Object.hasOwn(result.results, type) || !result.results[type]) {
    Object.defineProperty(result.results, type, {
      value: {},
      enumerable: true,
      writable: true,
      configurable: true
    });
  }
  Object.defineProperty(result.results[type], value, {
    value: success,
    enumerable: true,
    writable: true,
    configurable: true
  });
  result.success = result.success && success;
}

/** Original getRealParams behavior: normalize links, append recorded tasks on undo, deduplicate. */
export function getRealParams(links: readonly string[], doTask: boolean, recorded: readonly string[], link2param: (link: string) => string | undefined): string[] {
  const converted = links.map(link2param).filter((value): value is string => {
    return value !== undefined;
  });
  return [...new Set([...converted, ...(!doTask ? recorded : [])])];
}
