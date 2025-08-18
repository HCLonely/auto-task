/*
 * @Author       : HCLonely
 * @Date         : 2021-11-20 15:53:43
 * @LastEditTime : 2025-08-18 19:07:51
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/tools/i18n.ts
 * @Description  : i18n
 */

import { globalOptions } from '../globalOptions';
import zh from '../../locales/zh-CN.js';
import en from '../../locales/en-US.js';

/**
 * 支持的语言类型
 */
type SupportedLanguage = 'zh' | 'en';

/**
 * 语言包类型
 */
type LanguagePack = {
  [key: string]: string;
};

/**
 * 语言包映射
 */
const languages: Record<SupportedLanguage, LanguagePack> = {
  zh,
  en
};

/**
 * 支持的语言列表
 */
const SUPPORTED_LANGUAGES: Array<SupportedLanguage> = ['zh', 'en'];

/**
 * 获取当前使用的语言
 * @returns {SupportedLanguage} 当前语言代码
 */
const getCurrentLanguage = (): SupportedLanguage => {
  const userLanguage = globalOptions.other.language as SupportedLanguage;
  return SUPPORTED_LANGUAGES.includes(userLanguage) ? userLanguage : 'en';
};

/**
 * 替换字符串中的占位符
 *
 * @param {string} text - 包含占位符的字符串
 * @param {Array<string>} args - 用于替换的参数数组
 * @returns {string} 替换后的字符串
 */
const replacePlaceholders = (text: string, args: Array<string>): string => text.replace(/%([\d]+)/g, (_, index) => args[parseInt(index, 10)] || '');

/**
 * 国际化函数
 *
 * @param {string} key - 翻译键值
 * @param {...string} args - 用于替换占位符的参数
 * @returns {string} 翻译后的文本
 *
 * @description
 * 根据当前语言设置返回对应的翻译文本。
 * 支持以下功能：
 * 1. 自动回退到英语（如果指定语言不可用）
 * 2. 支持参数替换（使用 %0, %1 等占位符）
 * 3. 如果找不到翻译，返回原始键值
 */
const I18n = (key: string, ...args: Array<string>): string => {
  const currentLanguage = getCurrentLanguage();
  const translation = languages[currentLanguage]?.[key];

  if (!translation) {
    console.warn(`Missing translation for key: ${key} in language: ${currentLanguage}`);
    return key;
  }

  return replacePlaceholders(translation, args);
};

export default I18n;
