/*
 * @Author       : HCLonely
 * @Date         : 2021-11-08 10:43:23
 * @LastEditTime : 2025-08-18 19:02:30
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/types/GiveawayHopper.d.ts
 */

declare interface giveawayHopperReturnTaskInfo {
  id: number;
  name: string;
  isPlatform: boolean;
  colors: string[];
  tickets: number;
  category: string;
  type: string;
  displayName: string;
  targetName: string;
  creator: number;
  required: number;
  isDone: boolean;
  requiredPlatform: string | null;
  requiresVisit: boolean;
  link: string;
  hash: string;
  username: string;
  group_id?: string | number;
  invite_code?: string;
}
