/*
 * @Author       : HCLonely
 * @Date         : 2026-09-28 17:09:58
 * @LastEditTime : 2026-09-28 17:14:18
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/modules/social/social/index.ts
 * @Description  : 社交任务公共接口与基础模块导出
 */

export { Social as default, Social } from './Social';
export { SocialAdapter } from './adapter';
export { createTaskResult, setTaskResult, getRealParams } from './results';
export * from './types';
