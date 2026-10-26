import type { SocialStatusEvent } from '../../modules/social/social/types';
import translations from '../../modules/i18n/locales/zh-CN.js';
import __ from '../tools/i18n';

export interface FailureReason {
  text: string;
  priority: number;
}

/**
 * 将接口 HTML 提示转换为纯文本，保留列表分隔，避免在日志区域执行远程 HTML。
 * @param message - 接口返回的错误说明。
 * @returns 可安全通过日志文本接口显示的原因。
 */
const messageText = (message: string): string => {
  const document = new DOMParser().parseFromString(message.replace(/<\/(?:li|p|div)>|<br\s*\/?>/gi, '; '), 'text/html');
  document.querySelectorAll('script, style, iframe, object').forEach((node) => {
    node.remove();
  });
  return (document.body.textContent || '').replace(/\s+/g, ' ').replace(/(?:;\s*)+$/, '')
    .trim();
};

/**
 * 优先显示接口原文，其次显示已知业务原因、HTTP 状态和传输原因。
 * @param event - 当前任务或其子操作的状态事件。
 * @returns 带优先级的失败说明；没有可靠原因时返回 undefined。
 */
export const failureReason = (event: SocialStatusEvent): FailureReason | undefined => {
  const details = event.details || {};
  if (typeof details.message === 'string') {
    const text = messageText(details.message);
    if (text) {
      return {
        text,
        priority: 4
      };
    }
  }
  const key = `moduleReason_${event.code}`;
  if (Object.prototype.hasOwnProperty.call(translations, key)) {
    const text = __(key);
    return {
      text: typeof details.apiCode === 'number' ? `${text} (${details.apiCode})` : text,
      priority: 3
    };
  }
  // 兼容已有的业务提示翻译键，例如 Steam 的 noSubid、missParams。
  if (event.level === 'error' && Object.prototype.hasOwnProperty.call(translations, event.code)) {
    return {
      text: messageText(__(event.code)),
      priority: 3
    };
  }
  if (typeof details.httpStatus === 'number' && details.httpStatus >= 400) {
    return {
      text: __('moduleHttpFailed', String(details.httpStatus)),
      priority: 2
    };
  }
  if (typeof details.apiCode === 'number') {
    return {
      text: __('moduleApiFailed', String(details.apiCode)),
      priority: 2
    };
  }
  if (typeof details.transportStatus === 'number' && details.transportStatus >= 601 && details.transportStatus <= 604) {
    return {
      text: __(`moduleTransport_${details.transportStatus}`),
      priority: 2
    };
  }
  return undefined;
};
