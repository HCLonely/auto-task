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
  status: (text: string, tone?: Tone) => void;
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
  onOpen?: (context: DialogContext) => void;
  preConfirm?: (context: DialogContext) => T | Promise<T>;
}

const dialogs: HTMLDialogElement[] = [];
let sequence = 0;
let savedOverflow = '';
let savedOverflowPriority = '';

const element = <K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text?: string): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

/** Every invocation owns its DOM, listeners and result. Nested dialogs use the browser's top layer. */
export const showDialog = <T = boolean | string>(options: DialogOptions<T>): Promise<DialogResult<T>> => new Promise((resolve, reject) => {
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
    const icon = element('span', 'at-dialog-icon', { success: '✓', error: '×', warning: '!', info: 'i' }[options.icon]);
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
  if (options.html) content.innerHTML = options.html;
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
  const listen = (target: EventTarget, type: string, handler: EventListener): void => {
    target.addEventListener(type, handler, { signal: listeners.signal });
  };
  const dispose = (): void => {
    settled = true;
    listeners.abort();
    const index = dialogs.indexOf(root);
    if (index !== -1) dialogs.splice(index, 1);
    root.querySelectorAll(':scope > .at-toasts').forEach((notifications) => {
      (dialogs[dialogs.length - 1] ?? document.body).append(notifications);
    });
    if (root.open) root.close();
    root.remove();
    if (!dialogs.length) {
      document.documentElement.style.setProperty('overflow', savedOverflow, savedOverflowPriority);
    }
    if (previousFocus?.isConnected) previousFocus.focus();
  };
  const finish = (action: 'confirm' | 'cancel' | 'back', value?: T): void => {
    if (settled || busy) return;
    dispose();
    resolve({ isConfirmed: action === 'confirm', isDenied: action === 'back', isDismissed: action === 'cancel', value });
  };
  const context: DialogContext = {
    root,
    status: (text, tone = 'info') => {
      status.textContent = text;
      status.dataset.tone = tone;
    },
    run: async (operation) => {
      if (busy || settled) return;
      busy = true;
      root.setAttribute('aria-busy', 'true');
      const controls = Array.from(root.querySelectorAll<HTMLInputElement | HTMLButtonElement | HTMLTextAreaElement | HTMLSelectElement>('input, button, textarea, select'));
      const disabled = controls.map((control) => control.disabled);
      try {
        // Start synchronously so callers can snapshot form values before controls are disabled.
        const pending = operation();
        controls.forEach((control) => { control.disabled = true; });
        await pending;
      } catch (error) {
        context.status(error instanceof Error ? error.message : String(error), 'error');
      } finally {
        controls.forEach((control, index) => { control.disabled = disabled[index]; });
        busy = false;
        root.removeAttribute('aria-busy');
      }
    }
  };
  const submit = async (): Promise<void> => {
    if (busy || settled) return;
    if (Array.from(content.querySelectorAll('form')).some((form) => !form.reportValidity())) return;
    // Capture inputs before disabling controls (disabled fields are excluded by FormData/serializeArray).
    let value: T | undefined;
    let successful = false;
    await context.run(async () => {
      value = options.preConfirm ? await options.preConfirm(context) : (input ? input.value : true) as T;
      successful = true;
    });
    if (successful && !options.keepOpenOnConfirm) finish('confirm', value);
  };
  const button = (label: string, action: string, handler: () => void): HTMLButtonElement => {
    const node = element('button', 'at-button', label);
    node.type = 'button';
    node.dataset.action = action;
    listen(node, 'click', handler);
    return node;
  };
  if (options.showConfirmButton !== false) actions.append(button(options.confirmButtonText ?? __('confirm'), 'confirm', () => { void submit(); }));
  if (options.showDenyButton) actions.append(button(options.denyButtonText ?? __('return'), 'back', () => finish('back')));
  if (options.showCancelButton) actions.append(button(options.cancelButtonText ?? __('cancel'), 'cancel', () => finish('cancel')));
  if (options.showCloseButton) root.prepend(button(__('close'), 'close', () => finish('cancel')));
  listen(root, 'cancel', (event) => { event.preventDefault(); finish('cancel'); });
  listen(root, 'close', () => finish('cancel'));
  let backdropStart = false;
  const outside = (event: MouseEvent): boolean => {
    const box = root.getBoundingClientRect();
    return event.target === root && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom);
  };
  listen(root, 'pointerdown', (event) => { backdropStart = outside(event as MouseEvent); });
  listen(root, 'click', (event) => { if (backdropStart && outside(event as MouseEvent)) finish('cancel'); backdropStart = false; });
  listen(root, 'submit', (event) => { event.preventDefault(); if (options.showConfirmButton !== false) void submit(); });
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
  if (options.text) item.append(element('span', '', options.text));
  const close = element('button', 'at-toast-close', '×');
  close.type = 'button';
  close.setAttribute('aria-label', __('close'));
  item.append(close);
  region.append(item);
  let timer: ReturnType<typeof setTimeout> | undefined;
  const remove = (): void => { clearTimeout(timer); item.remove(); if (!region?.children.length) region?.remove(); };
  const start = (): void => {
    clearTimeout(timer);
    const duration = options.duration ?? (options.icon === 'error' ? 0 : 4000);
    if (duration > 0) timer = setTimeout(remove, duration);
  };
  close.addEventListener('click', remove, { once: true });
  item.addEventListener('mouseenter', () => clearTimeout(timer));
  item.addEventListener('mouseleave', start);
  item.addEventListener('focusin', () => clearTimeout(timer));
  item.addEventListener('focusout', start);
  start();
};
