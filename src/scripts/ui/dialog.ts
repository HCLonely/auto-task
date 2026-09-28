/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 15:40:46
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/ui/dialog.ts
 * @Description  : 对话框与提示消息管理
 */

import __ from '../tools/i18n';

type Tone = 'success' | 'error' | 'warning' | 'info';
export interface DialogResult<T> {
  isConfirmed: boolean;
  isDenied: boolean;
  isDismissed: boolean;
  value?: T;
}
export interface DialogContext {
  root: HTMLDialogElement;
  /**
   * 更新操作状态。
   *
   * @param text - 待处理的文本。
   * @param tone - 提示消息的视觉类型；可省略。
   */
  status: (text: string, tone?: Tone) => void;
  /**
   * 在独立操作上下文中执行任务并发送状态事件。
   *
   * @param operation - 操作名称或执行函数。
   * @returns 在操作完成后兑现的 Promise。
   */
  run: (operation: () => Promise<void>) => Promise<void>;
}
interface DialogOptions<T> {
  title: string;
  text?: string;
  /** Only application-owned templates belong here; put external values in textContent/value. */
  html?: string;
  footer?: string;
  icon?: Tone;
  input?: 'textarea';
  inputValue?: string;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  showCloseButton?: boolean;
  showDenyButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  denyButtonText?: string;
  keepOpenOnConfirm?: boolean;
  /**
   * 处理对话框打开事件。
   *
   * @param context - 当前运行上下文。
   */
  onOpen?: (context: DialogContext) => void;
  /**
   * 处理对话框确认前的校验。
   *
   * @param context - 当前运行上下文。
   * @returns 处理结果（T | Promise<T>）。
   */
  preConfirm?: (context: DialogContext) => T | Promise<T>;
}

const dialogs: HTMLDialogElement[] = [];
let sequence = 0;
let savedOverflow = '';
let savedOverflowPriority = '';

/**
 * 根据模板创建界面元素。
 *
 * @typeParam K - 目标键的类型。
 * @param tag - 目标元素的标签名。
 * @param className - 元素样式类名。
 * @param text - 待处理的文本；可省略。
 * @returns 处理结果（HTMLElementTagNameMap[K]）。
 */
const element = <K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text?: string): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) {
    node.textContent = text;
  }
  return node;
};

/**
 * 每次调用独立管理 DOM、监听器和结果；嵌套对话框使用浏览器顶层显示。
 *
 * @typeParam T - 操作处理的数据或返回值类型。
 * @param options - 本次操作的配置选项。
 * @returns Promise，完成后返回处理结果（DialogResult<T>）。
 */
export const showDialog = <T = boolean | string>(options: DialogOptions<T>): Promise<DialogResult<T>> => {
  return new Promise((resolve, reject) => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const root = element('dialog', 'at-dialog');
    sequence += 1;
    const title = element('h2', 'at-dialog-title', options.title);
    title.id = `at-dialog-title-${sequence}`;
    root.setAttribute('aria-labelledby', title.id);
    root.setAttribute('aria-modal', 'true');
    root.append(title);
    if (options.icon) {
      root.dataset.tone = options.icon;
      const icon = element('span', 'at-dialog-icon', {
        success: '✓',
        error: '×',
        warning: '!',
        info: 'i'
      }[options.icon]);
      icon.setAttribute('aria-hidden', 'true');
      title.prepend(icon);
    }
    if (options.text) {
      const description = element('p', 'at-dialog-text', options.text);
      description.id = `at-dialog-description-${sequence}`;
      root.setAttribute('aria-describedby', description.id);
      root.append(description);
    }
    const content = element('div', 'at-dialog-content');
    if (options.html) {
      content.innerHTML = options.html;
    }
    root.append(content);
    let input: HTMLTextAreaElement | undefined;
    if (options.input === 'textarea') {
      input = element('textarea', 'at-input');
      input.value = options.inputValue ?? '';
      input.setAttribute('aria-label', options.title);
      content.append(input);
    }
    const status = element('p', 'at-dialog-status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    root.append(status);
    const actions = element('div', 'at-dialog-actions');
    root.append(actions);
    if (options.footer) {
      const footer = element('div', 'at-dialog-footer');
      footer.innerHTML = options.footer;
      root.append(footer);
    }
    let busy = false;
    let settled = false;
    const listeners = new AbortController();
    /**
     * 注册事件监听器。
     *
     * @param target - 当前操作的目标。
     * @param type - 操作或数据类型。
     * @param handler - 事件或任务处理函数。
     */
    const listen = (target: EventTarget, type: string, handler: EventListener): void => {
      target.addEventListener(type, handler, {
        signal: listeners.signal
      });
    };
    /**
     * 释放模块资源并结束待处理的监听或等待。
     */
    const dispose = (): void => {
      settled = true;
      listeners.abort();
      const index = dialogs.indexOf(root);
      if (index !== -1) {
        dialogs.splice(index, 1);
      }
      root.querySelectorAll(':scope > .at-toasts').forEach((notifications) => {
        (dialogs[dialogs.length - 1] ?? document.body).append(notifications);
      });
      if (root.open) {
        root.close();
      }
      root.remove();
      if (!dialogs.length) {
        document.documentElement.style.setProperty('overflow', savedOverflow, savedOverflowPriority);
      }
      if (previousFocus?.isConnected) {
        previousFocus.focus();
      }
    };
    /**
     * 完成当前操作并交付结果。
     *
     * @param action - 待执行的动作。
     * @param value - 待处理的值；可省略。
     */
    const finish = (action: 'confirm' | 'cancel' | 'back', value?: T): void => {
      if (settled || busy) {
        return;
      }
      dispose();
      resolve({
        isConfirmed: action === 'confirm',
        isDenied: action === 'back',
        isDismissed: action === 'cancel',
        value
      });
    };
    const context: DialogContext = {
      root,
      /**
       * 更新操作状态。
       *
       * @param text - 待处理的文本。
       * @param tone - 提示消息的视觉类型；默认值为 `'info'`。
       */
      status: (text, tone = 'info') => {
        status.textContent = text;
        status.dataset.tone = tone;
      },
      /**
       * 在独立操作上下文中执行任务并发送状态事件。
       *
       * @param operation - 操作名称或执行函数。
       * @returns 在操作完成后兑现的 Promise。
       */
      run: async (operation) => {
        if (busy || settled) {
          return;
        }
        busy = true;
        root.setAttribute('aria-busy', 'true');
        const controls = Array.from(root.querySelectorAll<HTMLInputElement | HTMLButtonElement | HTMLTextAreaElement | HTMLSelectElement>('input, button, textarea, select'));
        const disabled = controls.map((control) => {
          return control.disabled;
        });
        try {
        // Start synchronously so callers can snapshot form values before controls are disabled.
          const pending = operation();
          controls.forEach((control) => {
            control.disabled = true;
          });
          await pending;
        } catch (error) {
          context.status(error instanceof Error ? error.message : String(error), 'error');
        } finally {
          controls.forEach((control, index) => {
            control.disabled = disabled[index];
          });
          busy = false;
          root.removeAttribute('aria-busy');
        }
      }
    };
    /**
     * 提交当前表单或任务。
     *
     * @returns 在操作完成后兑现的 Promise。
     */
    const submit = async (): Promise<void> => {
      if (busy || settled) {
        return;
      }
      if (Array.from(content.querySelectorAll('form')).some((form) => {
        return !form.reportValidity();
      })) {
        return;
      }
      // Capture inputs before disabling controls (disabled fields are excluded by FormData/serializeArray).
      let value: T | undefined;
      let successful = false;
      await context.run(async () => {
        value = options.preConfirm ? await options.preConfirm(context) : (input ? input.value : true) as T;
        successful = true;
      });
      if (successful && !options.keepOpenOnConfirm) {
        finish('confirm', value);
      }
    };
    /**
     * 创建对话框按钮并绑定点击处理函数。
     *
     * @param label - 显示标签。
     * @param action - 待执行的动作。
     * @param handler - 事件或任务处理函数。
     * @returns 创建的按钮元素。
     */
    const button = (label: string, action: string, handler: () => void): HTMLButtonElement => {
      const node = element('button', 'at-button', label);
      node.type = 'button';
      node.dataset.action = action;
      listen(node, 'click', handler);
      return node;
    };
    if (options.showConfirmButton !== false) {
      actions.append(button(options.confirmButtonText ?? __('confirm'), 'confirm', () => {
        void submit();
      }));
    }
    if (options.showDenyButton) {
      actions.append(button(options.denyButtonText ?? __('return'), 'back', () => {
        return finish('back');
      }));
    }
    if (options.showCancelButton) {
      actions.append(button(options.cancelButtonText ?? __('cancel'), 'cancel', () => {
        return finish('cancel');
      }));
    }
    if (options.showCloseButton) {
      root.prepend(button(__('close'), 'close', () => {
        return finish('cancel');
      }));
    }
    listen(root, 'cancel', (event) => {
      event.preventDefault();
      finish('cancel');
    });
    listen(root, 'close', () => {
      return finish('cancel');
    });
    let backdropStart = false;
    /**
     * 处理点击对话框外部的事件。
     *
     * @param event - 事件名称或事件对象。
     * @returns 操作结果；成功或无需重复处理时为 true，失败时为 false。
     */
    const outside = (event: MouseEvent): boolean => {
      const box = root.getBoundingClientRect();
      return event.target === root && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom);
    };
    listen(root, 'pointerdown', (event) => {
      backdropStart = outside(event as MouseEvent);
    });
    listen(root, 'click', (event) => {
      if (backdropStart && outside(event as MouseEvent)) {
        finish('cancel');
      }
      backdropStart = false;
    });
    listen(root, 'submit', (event) => {
      event.preventDefault();
      if (options.showConfirmButton !== false) {
        void submit();
      }
    });
    listen(root, 'keydown', (event) => {
      const key = event as KeyboardEvent;
      if (key.key === 'Enter' && !key.isComposing && event.target instanceof HTMLInputElement && options.showConfirmButton !== false) {
        event.preventDefault();
        void submit();
      }
    });
    try {
      if (!dialogs.length) {
        savedOverflow = document.documentElement.style.getPropertyValue('overflow');
        savedOverflowPriority = document.documentElement.style.getPropertyPriority('overflow');
        document.documentElement.style.setProperty('overflow', 'hidden');
      }
      document.body.append(root);
      dialogs.push(root);
      root.showModal();
      options.onOpen?.(context);
      const focusTarget = root.querySelector<HTMLElement>('textarea, input') ??
      root.querySelector<HTMLElement>('[data-action="cancel"]') ?? root.querySelector<HTMLElement>('button');
      focusTarget?.focus();
    } catch (error) {
      dispose();
      reject(error);
    }
  });
};

/**
 * 显示短暂的提示消息。
 *
 * @param options - 本次操作的配置选项。
 */
export const toast = (options: { title: string; text?: string; icon?: Tone; duration?: number }): void => {
  const host = dialogs[dialogs.length - 1] ?? document.body;
  let region = host.querySelector<HTMLElement>(':scope > .at-toasts');
  if (!region) {
    region = element('div', 'at-toasts');
    host.append(region);
  }
  const item = element('div', 'at-toast');
  item.dataset.tone = options.icon ?? 'success';
  item.setAttribute('role', options.icon === 'error' ? 'alert' : 'status');
  item.append(element('strong', '', options.title));
  if (options.text) {
    item.append(element('span', '', options.text));
  }
  const close = element('button', 'at-toast-close', '×');
  close.type = 'button';
  close.setAttribute('aria-label', __('close'));
  item.append(close);
  region.append(item);
  let timer: ReturnType<typeof setTimeout> | undefined;
  /**
   * 移除指定记录或界面元素。
   */
  const remove = (): void => {
    clearTimeout(timer);
    item.remove();
    if (!region?.children.length) {
      region?.remove();
    }
  };
  /**
   * 标记操作开始。
   */
  const start = (): void => {
    clearTimeout(timer);
    const duration = options.duration ?? (options.icon === 'error' ? 0 : 4000);
    if (duration > 0) {
      timer = setTimeout(remove, duration);
    }
  };
  close.addEventListener('click', remove, {
    once: true
  });
  item.addEventListener('mouseenter', () => {
    return clearTimeout(timer);
  });
  item.addEventListener('mouseleave', start);
  item.addEventListener('focusin', () => {
    return clearTimeout(timer);
  });
  item.addEventListener('focusout', start);
  start();
};
