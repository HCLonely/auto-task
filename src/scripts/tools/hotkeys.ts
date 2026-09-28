/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 14:52:11
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/tools/hotkeys.ts
 * @Description  : 快捷键绑定工具
 */

/**
 * 绑定设置页面生成的修饰键与普通键组合。
 *
 * @param shortcut - 快捷键配置。
 * @param callback - 接收处理结果的回调函数。
 * @param target - 当前操作的目标；默认值为 `document`。
 * @returns 供调用方使用的函数。
 */
export const bindHotkey = (shortcut: string, callback: () => void, target: Document = document): (() => void) => {
  // Preserve a literal '+' key, including combinations such as 'shift + +'.
  const normalized = shortcut.toLowerCase().trim()
    .replace(/\+\s*\+$/, '+ plus');
  const parts = (normalized === '+' ? ['plus'] : normalized.split(/\s*\+\s*/)).map((part) => {
    return part.trim();
  });
  const aliases: Record<string, string> = {
    control: 'ctrl',
    command: 'meta',
    cmd: 'meta',
    option: 'alt',
    esc: 'escape',
    space: ' ',
    plus: '+'
  };
  const keys = parts.map((part) => {
    return aliases[part] || part;
  });
  const modifiers = ['alt', 'ctrl', 'shift', 'meta'] as const;
  const mainKeys = keys.filter((key) => {
    return !modifiers.some((modifier) => {
      return modifier === key;
    });
  });
  if (mainKeys.length !== 1 || !mainKeys[0]) {
    return () => {};
  }
  const [key] = mainKeys;
  /**
   * 接收并处理状态变化。
   *
   * @param event - 事件名称或事件对象。
   */
  const listener = (event: KeyboardEvent) => {
    if (event.repeat || event.isComposing) {
      return;
    }
    if (modifiers.some((modifier) => {
      return event[`${modifier}Key`] !== keys.includes(modifier);
    })) {
      return;
    }
    // Physical letter codes preserve Alt shortcuts on layouts that alter event.key.
    const pressed = /^[a-z]$/.test(key) && /^Key[A-Z]$/.test(event.code) ?
      event.code.slice(3).toLowerCase() : event.key.toLowerCase();
    if (pressed === key) {
      callback();
    }
  };
  target.addEventListener('keydown', listener);
  return () => {
    return target.removeEventListener('keydown', listener);
  };
};
