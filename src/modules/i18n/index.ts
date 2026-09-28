/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/i18n/index.ts
 * @Description  : 多语言配置与翻译函数创建
 */

import zh from './locales/zh-CN.js';
import en from './locales/en-US.js';

export type SupportedLanguage = 'zh' | 'en';
export type LanguageSource = string | (() => string);
/**
 * 根据翻译键和替换参数生成本地化文本。
 *
 * @param key - 语言资源中的翻译键。
 * @param args - 传递给目标操作的参数列表，按调用顺序传入。
 * @returns 处理后的字符串。
 */
export type Translator = (key: string, ...args: Array<string>) => string;

const languages: Record<SupportedLanguage, Record<string, string>> = {
  zh,
  en
};

/**
 * 创建独立的翻译函数；语言回调允许实时切换语言。
 *
 * @param language - 语言标识或返回当前语言的函数；默认值为 `'en'`。
 * @returns 使用当前语言配置的翻译函数；缺少翻译时回退到原始键名。
 */
export const createI18n = (language: LanguageSource = 'en'): Translator => {
  return (key, ...args) => {
    const requestedLanguage = typeof language === 'function' ? language() : language;
    const currentLanguage = requestedLanguage === 'zh' ? 'zh' : 'en';
    const pack = languages[currentLanguage];
    const translation = Object.prototype.hasOwnProperty.call(pack, key) ? pack[key] : undefined;

    if (!translation) {
      console.warn(`Missing translation for key: ${key} in language: ${currentLanguage}`);
      return key;
    }

    return translation.replace(/%([\d]+)/g, (_, index) => {
      return args[parseInt(index, 10)] || '';
    });
  };
};

export default createI18n();
