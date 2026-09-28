import zh from './locales/zh-CN.js';
import en from './locales/en-US.js';

export type SupportedLanguage = 'zh' | 'en';
export type LanguageSource = string | (() => string);
export type Translator = (key: string, ...args: Array<string>) => string;

const languages: Record<SupportedLanguage, Record<string, string>> = {
  zh,
  en
};

/** Create an independent translator; a callback enables live language changes. */
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
