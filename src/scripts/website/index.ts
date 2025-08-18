/*
 * @Author       : HCLonely
 * @Date         : 2021-12-24 15:03:56
 * @LastEditTime : 2025-08-18 19:06:33
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/website/index.ts
 * @Description  : 整合website相关
 */

import FreeAnyWhere from './Freeanywhere';
import { GiveawaySu } from './Giveawaysu';
import Indiedb from './Indiedb';
import Keyhub from './Keyhub';
import Givekey from './Givekey';
import GiveeClub from './GiveeClub';
import OpiumPulses from './OpiumPulses';
import Keylol from './Keylol';
import Opquests from './Opquests';
import Gleam from './Gleam';
import SweepWidget from './SweepWidget';
import Setting from './Setting';
import History from './History';
import GiveawayHopper from './GiveawayHopper';
import Prys from './Prys';

type WebsitesType = typeof FreeAnyWhere |
  typeof GiveawaySu |
  typeof Indiedb |
  typeof Keyhub |
  typeof Givekey |
  typeof GiveeClub |
  typeof OpiumPulses |
  typeof Keylol |
  typeof Opquests |
  typeof Gleam |
  typeof SweepWidget |
  typeof Setting |
  typeof History |
  typeof GiveawayHopper |
  typeof Prys;

type WebsiteType = FreeAnyWhere |
  GiveawaySu |
  Indiedb |
  Keyhub |
  Givekey |
  GiveeClub |
  OpiumPulses |
  Keylol |
  Opquests |
  Gleam |
  SweepWidget |
  Setting |
  History |
  GiveawayHopper |
  Prys;

/**
 * 网站类型数组
 *
 * @type {Array<WebsitesType>}
 * @constant
 *
 * @description
 * 该常量包含所有支持的网站类型，包括：
 * - FreeAnyWhere
 * - GiveawaySu
 * - Indiedb
 * - Keyhub
 * - Givekey
 * - GiveeClub
 * - OpiumPulses
 * - Keylol
 * - Opquests
 * - Gleam
 * - SweepWidget
 * - Setting
 * - History
 * - GiveawayHopper
 * - Prys
 *
 * 这些网站类型用于后续的抽奖操作和管理。
 */
const Websites: Array<WebsitesType> = [
  FreeAnyWhere, GiveawaySu, Indiedb, Keyhub, Givekey, GiveeClub, OpiumPulses, Keylol, Opquests, Gleam, SweepWidget, Setting, History, GiveawayHopper, Prys
];

export { Websites, WebsiteType };
