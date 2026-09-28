/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:14:18
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/website/browser.ts
 * @Description  : 网站任务模块的浏览器入口
 */

/** Website API and shared project state exposed through userscript @require. */
export * from './index';
export * as options from './options';
export * as globalOptions from '../../scripts/globalOptions';
export * as globalOptionsEdit from '../../scripts/globalOptionsEdit';
export * as echoLog from '../../scripts/echoLog';
export * as i18n from '../../scripts/tools/i18n';
export * as debug from '../../scripts/tools/debug';
export * as moduleBridge from '../../scripts/social/moduleBridge';
export * as SteamASF from '../../scripts/social/SteamASF';

export * as dialog from '../../scripts/ui/dialog';
