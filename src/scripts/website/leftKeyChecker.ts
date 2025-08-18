/*
 * @Author       : HCLonely
 * @Date         : 2022-01-09 10:19:17
 * @LastEditTime : 2025-08-18 19:06:04
 * @LastEditors  : HCLonely
 * @FilePath     : /auto-task/src/scripts/website/leftKeyChecker.ts
 * @Description  : 剩余Key检测
 */

import dayjs from 'dayjs';
import httpRequest from '../tools/httpRequest';
import throwError from '../tools/throwError';
import { debug } from '../tools/debug';

type status = 'Ended' | 'Won' | 'Active' | `Active(${string})` | 'Banned' | 'Paused' | 'NotStart' | false;

/**
 * leftKeyChecker 是一个用于分类和检测不同链接状态的对象。
 *
 * @module leftKeyChecker
 *
 * @description
 * 该模块提供了一个方法 `classify`，用于根据链接的格式调用相应的处理函数。
 * 支持的链接格式包括 giveaway.su、givee.club、gleam.io、indiedb.com、key-hub.eu、opquests.com 和 itch.io。
 * 每个处理函数会向相应的链接发送 GET 请求，并根据响应内容返回状态。
 *
 * @method classify - 分类链接的方法，根据链接格式调用相应的处理函数。
 * @param {string} link - 要分类的链接。
 * @returns {Promise<status>} 返回分类结果的状态。
 * @throws {Error} 如果在分类过程中发生错误，将抛出错误。
 *
 * @method giveawaySu - 检测 giveaway.su 剩余 Key 的异步方法。
 * @param {string} link - 要处理的 giveaway.su 链接。
 * @returns {Promise<status>} 返回状态 'Active' 或 'Ended'；如果未登录或发生错误，则返回 false。
 * @throws {Error} 如果在处理过程中发生错误，将抛出错误。
 *
 * @method giveeClub - 检测 givee.club 剩余 Key 的异步方法。
 * @param {string} link - 要处理的 givee.club 链接。
 * @returns {Promise<status>} 返回状态 'Won'、'Ended' 或 'Active'；如果发生错误，则返回 false。
 * @throws {Error} 如果在处理过程中发生错误，将抛出错误。
 *
 * @method gleam - 检测 gleam 剩余 Key 的异步方法。
 * @param {string} link - 要处理的 gleam 链接。
 * @returns {Promise<status>} 返回状态 'Won'、'Banned'、'Ended'、'Paused'、'NotStart' 或 'Active'；如果发生错误，则返回 false。
 * @throws {Error} 如果在处理过程中发生错误，将抛出错误。
 *
 * @method indieDb - 检测 IndieDB 剩余 Key 的异步方法。
 * @param {string} link - 要处理的 IndieDB 链接。
 * @returns {Promise<status>} 返回状态 'Won'、'Ended' 或 'Active'；如果发生错误，则返回 false。
 * @throws {Error} 如果在处理过程中发生错误，将抛出错误。
 *
 * @method keyhub - 检测 Keyhub 剩余 Key 的异步方法。
 * @param {string} link - 要处理的 Keyhub 链接。
 * @returns {Promise<status>} 返回状态 'Ended' 或 'Active(剩余密钥数量)'；如果发生错误，则返回 false。
 * @throws {Error} 如果在处理过程中发生错误，将抛出错误。
 *
 * @method opquests - 检测 Opquests 剩余 Key 的异步方法。
 * @param {string} link - 要处理的 Opquests 链接。
 * @returns {Promise<status>} 返回状态 'Ended' 或 'Active(剩余密钥数量)'；如果发生错误，则返回 false。
 * @throws {Error} 如果在处理过程中发生错误，将抛出错误。
 *
 * @method itch - 检测 Itch.io 剩余 Key 的异步方法。
 * @param {string} link - 要处理的 Itch.io 链接。
 * @returns {Promise<status>} 返回状态 'Ended' 或 'Active(结束日期)'；如果发生错误，则返回 false。
 * @throws {Error} 如果在处理过程中发生错误，将抛出错误。
 */
const leftKeyChecker = {
  /**
   * 分类链接的方法
   *
   * @param {string} link - 要分类的链接。
   * @returns {Promise<status>} 返回分类结果的状态。
   *
   * @throws {Error} 如果在分类过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法根据链接的格式调用相应的处理函数。
   * 支持的链接格式包括 giveaway.su、givee.club、gleam.io、indiedb.com、key-hub.eu、opquests.com 和 itch.io。
   * 如果链接格式不匹配，则返回 false。
   */
  async classify(link: string): Promise<status> {
    try {
      debug('开始分类链接', { link });
      let result: status = false;

      if (/^https?:\/\/giveaway\.su\/giveaway\/view\/[\d]+/.test(link)) {
        debug('匹配到 giveaway.su 链接');
        result = await this.giveawaySu(link);
      } else if (/^https?:\/\/givee\.club\/[\w]+?\/event\/[\d]+/.test(link)) {
        debug('匹配到 givee.club 链接');
        result = await this.giveeClub(link);
      } else if (/^https?:\/\/gleam\.io\/.+?\/.+/.test(link)) {
        debug('匹配到 gleam.io 链接');
        result = await this.gleam(link);
      } else if (/^https?:\/\/www\.indiedb\.com\/giveaways\/.+/.test(link)) {
        debug('匹配到 indiedb.com 链接');
        result = await this.indieDb(link);
      } else if (/^https?:\/\/key-hub\.eu\/giveaway\/[\d]+/.test(link)) {
        debug('匹配到 key-hub.eu 链接');
        result = await this.keyhub(link);
      } else if (/^https?:\/\/opquests\.com\/quests\/[\d]+/.test(link)) {
        debug('匹配到 opquests.com 链接');
        result = await this.opquests(link);
      } else if (/^https?:\/\/itch\.io\/s\/[\d]+?\/.*/.test(link)) {
        debug('匹配到 itch.io 链接');
        result = await this.itch(link);
      } else if (/^https?:\/\/freeanywhere\.net\/game\?n=[\d]+/.test(link)) {
        debug('匹配到 freeanywhere.net 链接');
        result = await this.freeanywhere(link);
      } else {
        debug('未匹配到支持的链接格式');
      }

      debug('链接分类完成', { result });
      return result;
    } catch (error) {
      debug('链接分类出错', { error });
      throwError(error as Error, 'leftKeyChecker.classify');
      return false;
    }
  },

  /**
   * 检测 giveaway.su 剩余 Key 的异步方法
   *
   * @param {string} link - 要处理的 giveaway.su 链接。
   * @returns {Promise<status>} 如果成功处理，则返回状态 'Active' 或 'Ended'；如果未登录或发生错误，则返回 false。
   *
   * @throws {Error} 如果在处理过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法向指定的 giveaway.su 链接发送 GET 请求。
   * 如果请求成功且返回状态为 200，则检查响应文本。
   * 如果响应中包含登录提示，则返回 false，表示用户未登录。
   * 如果响应中包含"抽奖已结束"的提示，则返回 'Ended'。
   * 否则，返回 'Active'，表示抽奖仍在进行中。
   */
  async giveawaySu(link: string): Promise<status> {
    try {
      debug('开始检查 giveaway.su 链接', { link });
      const { result, data } = await httpRequest({
        url: link,
        method: 'GET'
      });

      if (result !== 'Success' || data?.status !== 200) {
        debug('请求失败', { result, status: data?.status });
        return false;
      }

      if (data.responseText.includes('class="steam-login"')) {
        debug('检测到未登录状态');
        return false;
      }

      if (data.responseText.includes('class="giveaway-ended"')) {
        debug('检测到抽奖已结束');
        return 'Ended';
      }

      debug('检测到抽奖进行中');
      return 'Active';
    } catch (error) {
      debug('检查 giveaway.su 链接出错', { error });
      throwError(error as Error, 'leftKeyChecker.giveawaySu');
      return false;
    }
  },

  /**
   * 检测 givee.club 剩余 Key 的异步方法
   *
   * @param {string} link - 要处理的 givee.club 链接。
   * @returns {Promise<status>} 如果成功处理，则返回状态 'Won'、'Ended' 或 'Active'；如果发生错误，则返回 false。
   *
   * @throws {Error} 如果在处理过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法向指定的 givee.club 链接发送 GET 请求。
   * 如果请求成功且返回状态为 200，则检查响应文本。
   * 如果响应中包含"活动赢家"的提示，则返回 'Won'。
   * 如果响应中包含"活动已结束"的提示，则返回 'Ended'。
   * 否则，返回 'Active'，表示活动仍在进行中。
   */
  async giveeClub(link: string): Promise<status> {
    try {
      debug('开始检查 givee.club 链接', { link });
      const { result, data } = await httpRequest({
        url: link,
        method: 'GET'
      });

      if (result !== 'Success' || data?.status !== 200) {
        debug('请求失败', { result, status: data?.status });
        return false;
      }

      if (data.responseText.includes('class="event-winner"')) {
        debug('检测到已中奖');
        return 'Won';
      }

      if (data.responseText.includes('class="event-ended"')) {
        debug('检测到活动已结束');
        return 'Ended';
      }

      debug('检测到活动进行中');
      return 'Active';
    } catch (error) {
      debug('检查 givee.club 链接出错', { error });
      throwError(error as Error, 'leftKeyChecker.giveeClub');
      return false;
    }
  },

  /**
   * 检测 gleam 剩余 Key 的异步方法
   *
   * @param {string} link - 要处理的 gleam 链接。
   * @returns {Promise<status>} 如果成功处理，则返回状态 'Won'、'Banned'、'Ended'、'Paused'、'NotStart' 或 'Active'；如果发生错误，则返回 false。
   *
   * @throws {Error} 如果在处理过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法向指定的 gleam 链接发送 GET 请求。
   * 如果请求成功且返回状态为 200，则检查响应文本。
   * 如果响应中包含"奖励"的提示，则返回 'Won'。
   * 如果响应中包含活动被禁止、已结束、已暂停或尚未开始的提示，则返回相应的状态。
   * 否则，返回 'Active'，表示活动仍在进行中。
   */
  async gleam(link: string): Promise<status> {
    try {
      debug('开始检查 gleam.io 链接', { link });
      const { result, data } = await httpRequest({
        url: link,
        method: 'GET'
      });

      if (result !== 'Success' || data?.status !== 200) {
        debug('请求失败', { result, status: data?.status });
        return false;
      }

      if (/incentives&quot;:{&quot;[\d]+?&quot;:\[&quot;.+?&quot;\]/.test(data.responseText)) {
        debug('检测到已中奖');
        return 'Won';
      }

      const campaignDiv = data.responseText.match(/<div class='popup-blocks-container'[\w\W]+?'>/)?.[0];
      if (!campaignDiv) {
        debug('未找到活动信息');
        return false;
      }

      const campaignString = $(campaignDiv).attr('ng-init')
        ?.match(/initCampaign\(([\w\W]+?)\)$/)?.[1];
      if (!campaignString) {
        debug('未找到活动初始化数据');
        return false;
      }

      const { campaign } = JSON.parse(campaignString);
      debug('解析活动数据', { campaign });

      if (campaign.banned) {
        debug('检测到活动已被禁止');
        return 'Banned';
      }

      if (campaign.finished) {
        debug('检测到活动已结束');
        return 'Ended';
      }

      if (campaign.paused) {
        debug('检测到活动已暂停');
        return 'Paused';
      }

      if (new Date().getTime() < (campaign.starts_at * 1000)) {
        debug('检测到活动未开始');
        return 'NotStart';
      }

      debug('检测到活动进行中');
      return 'Active';
    } catch (error) {
      debug('检查 gleam.io 链接出错', { error });
      throwError(error as Error, 'leftKeyChecker.gleam');
      return false;
    }
  },

  /**
   * 检测 IndieDB 剩余 Key 的异步方法
   *
   * @param {string} link - 要处理的 IndieDB 链接。
   * @returns {Promise<status>} 如果成功处理，则返回状态 'Won'、'Ended' 或 'Active'；如果发生错误，则返回 false。
   *
   * @throws {Error} 如果在处理过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法向指定的 IndieDB 链接发送 GET 请求。
   * 如果请求成功且返回状态为 200，则检查响应文本。
   * 如果响应中包含"恭喜你获胜"的提示，则返回 'Won'。
   * 如果响应中包含"抽奖已结束"或"下次"的提示，则返回 'Ended'。
   * 否则，返回 'Active'，表示抽奖仍在进行中。
   */
  async indieDb(link: string): Promise<status> {
    try {
      debug('开始检查 indiedb.com 链接', { link });
      const { result, data } = await httpRequest({
        url: link,
        method: 'GET'
      });

      if (result !== 'Success' || data?.status !== 200) {
        debug('请求失败', { result, status: data?.status });
        return false;
      }

      if (data.responseText.includes('Congrats you WON')) {
        debug('检测到已中奖');
        return 'Won';
      }

      if (data.responseText.includes('Giveaway is closed') || data.responseText.includes('next time')) {
        debug('检测到抽奖已结束');
        return 'Ended';
      }

      debug('检测到抽奖进行中');
      return 'Active';
    } catch (error) {
      debug('检查 indiedb.com 链接出错', { error });
      throwError(error as Error, 'leftKeyChecker.indieDb');
      return false;
    }
  },

  /**
   * 检测 Keyhub 剩余 Key 的异步方法
   *
   * @param {string} link - 要处理的 Keyhub 链接。
   * @returns {Promise<status>} 如果成功处理，则返回状态 'Ended' 或 'Active(剩余密钥数量)'；如果发生错误，则返回 false。
   *
   * @throws {Error} 如果在处理过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法向指定的 Keyhub 链接发送 GET 请求。
   * 如果请求成功且返回状态为 200，则检查响应文本。
   * 如果响应中包含剩余密钥的数量，则返回 'Active' 状态和剩余密钥数量。
   * 如果剩余密钥为 0，则返回 'Ended'，表示抽奖已结束。
   * 如果未找到剩余密钥的信息，则返回 false。
   */
  async keyhub(link: string): Promise<status> {
    try {
      debug('开始检查 key-hub.eu 链接', { link });
      const { result, data } = await httpRequest({
        url: link,
        method: 'GET'
      });

      if (result !== 'Success' || data?.status !== 200) {
        debug('请求失败', { result, status: data?.status });
        return false;
      }

      const keysleft = data.responseText.match(/<span id="keysleft">([\d]+?)<\/span>/)?.[1];
      if (!keysleft) {
        debug('未找到剩余密钥信息');
        return false;
      }

      debug('检测到剩余密钥数量', { keysleft });
      if (keysleft === '0') {
        debug('检测到密钥已用完');
        return 'Ended';
      }

      debug('检测到活动进行中');
      return `Active(${keysleft})`;
    } catch (error) {
      debug('检查 key-hub.eu 链接出错', { error });
      throwError(error as Error, 'leftKeyChecker.keyhub');
      return false;
    }
  },

  /**
   * 检测 Opquests 剩余 Key 的异步方法
   *
   * @param {string} link - 要处理的 Opquests 链接。
   * @returns {Promise<status>} 如果成功处理，则返回状态 'Ended' 或 'Active(剩余密钥数量)'；如果发生错误，则返回 false。
   *
   * @throws {Error} 如果在处理过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法向指定的 Opquests 链接发送 GET 请求。
   * 如果请求成功且返回状态为 200，则检查响应文本。
   * 如果响应中包含剩余密钥的数量，则返回 'Active' 状态和剩余密钥数量。
   * 如果剩余密钥为 0，则返回 'Ended'，表示抽奖已结束。
   * 如果未找到剩余密钥的信息，则返回 false。
   * 如果返回状态为 404，则表示活动已结束，返回 'Ended'。
   */
  async opquests(link: string): Promise<status> {
    try {
      debug('开始检查 opquests.com 链接', { link });
      const { result, data } = await httpRequest({
        url: link,
        method: 'GET'
      });

      if (data?.status === 404) {
        debug('检测到活动不存在');
        return 'Ended';
      }

      if (result !== 'Success' || data?.status !== 200) {
        debug('请求失败', { result, status: data?.status });
        return false;
      }

      const keysleft = data.responseText.match(/<div class="">[\s]*?([\d]+?)[\s]*?of/)?.[1];
      if (!keysleft) {
        debug('未找到剩余密钥信息');
        return false;
      }

      debug('检测到剩余密钥数量', { keysleft });
      if (keysleft === '0') {
        debug('检测到密钥已用完');
        return 'Ended';
      }

      debug('检测到活动进行中');
      return `Active(${keysleft})`;
    } catch (error) {
      debug('检查 opquests.com 链接出错', { error });
      throwError(error as Error, 'leftKeyChecker.opquests');
      return false;
    }
  },

  /**
   * 检测 Itch.io 剩余 Key 的异步方法
   *
   * @param {string} link - 要处理的 Itch.io 链接。
   * @returns {Promise<status>} 如果成功处理，则返回状态 'Ended' 或 'Active(结束日期)'；如果发生错误，则返回 false。
   *
   * @throws {Error} 如果在处理过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法向指定的 Itch.io 链接发送 GET 请求。
   * 如果请求成功且返回状态为 200，则检查响应文本以获取结束日期。
   * 如果未找到结束日期，则返回 false。
   * 如果当前时间超过结束日期，则返回 'Ended'，表示抽奖已结束。
   * 否则，返回 'Active' 状态和格式化后的结束日期。
   */
  async itch(link: string): Promise<status> {
    try {
      debug('开始检查 itch.io 链接', { link });
      const { result, data } = await httpRequest({
        url: link,
        method: 'GET'
      });

      if (result !== 'Success' || data?.status !== 200) {
        debug('请求失败', { result, status: data?.status });
        return false;
      }

      const endDate = data.responseText.match(/{"start_date":"[0-9A-Z-:]+?".*?"end_date":"([0-9A-Z-:]+?)".*?}/)?.[1];
      if (!endDate) {
        debug('未找到结束日期信息');
        return false;
      }

      debug('检测到活动结束日期', { endDate });
      if (new Date().getTime() > new Date(endDate).getTime()) {
        debug('检测到活动已结束');
        return 'Ended';
      }

      const formattedEndDate = dayjs(endDate).format('YYYY-MM-DD HH:mm:ss');
      debug('检测到活动进行中', { formattedEndDate });
      return `Active(${formattedEndDate})`;
    } catch (error) {
      debug('检查 itch.io 链接出错', { error });
      throwError(error as Error, 'leftKeyChecker.itch');
      return false;
    }
  },

  /**
   * 检测 Freeanywhere 剩余 Key 的异步方法
   *
   * @param {string} link - 要处理的 Freeanywhere 链接。
   * @returns {Promise<status>} 如果成功处理，则返回状态 'Ended' 或 'Active(剩余密钥数量)'；如果发生错误，则返回 false。
   *
   * @throws {Error} 如果在处理过程中发生错误，将抛出错误。
   *
   * @description
   * 该方法向指定的 Freeanywhere 链接发送 GET 请求。
   * 如果请求成功且返回状态为 200，则检查响应文本以获取剩余密钥数量。
   * 如果剩余密钥为 0，则返回 'Ended'，表示抽奖已结束。
   * 如果未找到剩余密钥的信息，则返回 false。
   */
  async freeanywhere(link: string): Promise<status> {
    try {
      debug('开始检查 freeanywhere.net 链接', { link });
      const { result, data } = await httpRequest({
        url: link,
        method: 'GET'
      });

      if (result !== 'Success' || data?.status !== 200) {
        debug('请求失败', { result, status: data?.status });
        return false;
      }

      const giveawayStatus = data.responseText.includes('Giveaway ended');
      if (giveawayStatus) {
        debug('检测到活动已结束');
        return 'Ended';
      }

      debug('检测到活动进行中');
      return 'Active';
    } catch (error) {
      debug('检查 freeanywhere.net 链接出错', { error });
      throwError(error as Error, 'leftKeyChecker.freeanywhere');
      return false;
    }
  }
};
export default leftKeyChecker;
