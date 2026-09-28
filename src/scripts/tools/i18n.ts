/*
 * @Author       : HCLonely
 * @Date         : 2021-11-20 17:17:34
 * @LastEditTime : 2026-09-28 17:38:06
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/tools/i18n.ts
 * @Description  : 脚本多语言翻译入口
 */

import { globalOptions } from '../globalOptions';
import { createI18n } from '../../modules/i18n';

// Read the shared options on each call so changes take effect immediately.
export default createI18n(() => {
  return globalOptions.other.language;
});
