import type { GFFPreparedState, GFFRequest } from '../../social/gff/types';

type StateProperty = 'display' | 'visibility';

interface ControlSnapshot {
  node: HTMLElement;
  inlineValue: string;
  computedValue: string;
}

interface SteamPreparedState extends GFFPreparedState {
  add?: HTMLElement;
  remove?: HTMLElement[];
  property?: StateProperty;
  snapshots?: Map<HTMLElement, ControlSnapshot>;
}

const pending = (previous?: SteamPreparedState): SteamPreparedState => {
  return {
    ...previous,
    status: 'pending',
    appliedBeforeLoad: previous?.appliedBeforeLoad ?? false
  };
};

/** 页面 ID 只来自 Steam 自身；任务 ID 不得覆盖扩展在 load 捕获的值。 */
const controls = (request: GFFRequest): {
  add: string;
  remove: string;
  property: StateProperty;
} | undefined => {
  const target = new URL(request.link);
  const current = new URL(location.href);
  if (request.platform !== 'steam' || !['store.steampowered.com', 'steamcommunity.com'].includes(target.hostname) ||
      current.hostname !== target.hostname || current.pathname.replace(/\/+$/, '') !== target.pathname.replace(/\/+$/, '') ||
      current.searchParams.get('id') !== target.searchParams.get('id')) {
    throw new Error('GFF_STEAM_TARGET_MISMATCH');
  }
  if (request.taskType === 'curatorLinks') {
    const pathId = target.pathname.match(/^\/curator\/(\d+)(?:\/|$)/)?.[1];
    if (target.hostname !== 'store.steampowered.com' || !pathId) {
      throw new Error('GFF_CURATOR_TARGET_INVALID');
    }
    const gate = document.querySelector<HTMLElement>("span[id^='CuratorUnFollowBtn_']");
    if (!gate) {
      return undefined;
    }
    const id = gate.getAttribute('id')?.match(/^CuratorUnFollowBtn_(\d+)$/)?.[1];
    if (id !== pathId) {
      throw new Error('GFF_CURATOR_TARGET_MISMATCH');
    }
    return {
      add: `#CuratorFollowBtn_${id}`,
      remove: `#CuratorUnFollowBtn_${id}`,
      property: 'display'
    };
  }
  if (request.taskType === 'guideLinks') {
    const profile = target.pathname.match(/^\/(id|profiles)\/([^/]+)(?:\/|$)/);
    if (target.hostname !== 'steamcommunity.com' || !profile) {
      throw new Error('GFF_GUIDE_TARGET_INVALID');
    }
    if (!document.querySelector('.followStatsBlock')) {
      return undefined;
    }
    const href = document.querySelector<HTMLAnchorElement>('#HeaderUserInfoName a')?.getAttribute('href');
    if (!href) {
      return undefined;
    }
    // 与原扩展完全一致：尾斜线会产生空 ID，不能修复已经捕获的闭包。
    const id = href.split('/').pop();
    const author = new URL(href, location.href);
    if (!id || author.hostname !== 'steamcommunity.com' || author.pathname !== `/${profile[1]}/${profile[2]}` || id !== profile[2]) {
      throw new Error('GFF_GUIDE_TARGET_MISMATCH');
    }
    return {
      add: '#FollowUserOptionAdd',
      remove: '#FollowUserOptionFollowing, .followOption.remove',
      property: 'visibility'
    };
  }
  if (request.taskType === 'workshopLinks') {
    const path = target.pathname.replace(/\/+$/, '');
    const expected = target.searchParams.get('id');
    if (target.hostname !== 'steamcommunity.com' || path !== '/sharedfiles/filedetails' || !expected || !/^\d+$/.test(expected)) {
      throw new Error('GFF_FAVORITE_TARGET_INVALID');
    }
    if (!document.querySelector('#ScrollingItemControls')) {
      return undefined;
    }
    const input = document.querySelector<HTMLInputElement>("#PublishedFileFavorite input[name='id']");
    if (!input) {
      return undefined;
    }
    if (input.value !== expected) {
      throw new Error('GFF_FAVORITE_TARGET_MISMATCH');
    }
    return {
      add: '#FavoriteItemOptionAdd',
      remove: '#FavoriteItemOptionFavorited, .favoriteOption.removefavorite',
      property: 'visibility'
    };
  }
  if (request.taskType === 'followLinks') {
    const expected = target.pathname.match(/^\/app\/(\d+)(?:\/|$)/)?.[1];
    if (target.hostname !== 'store.steampowered.com' || !expected) {
      throw new Error('GFF_GAME_TARGET_INVALID');
    }
    if (!document.querySelector('#queueBtnFollow')) {
      return undefined;
    }
    const background = document.querySelector<HTMLElement>('.game_page_background');
    if (!background) {
      return undefined;
    }
    if (background.getAttribute('data-miniprofile-appid') !== expected) {
      throw new Error('GFF_GAME_TARGET_MISMATCH');
    }
    return {
      add: '#queueBtnFollow .queue_btn_inactive',
      remove: '#queueBtnFollow .queue_btn_active',
      property: 'display'
    };
  }
  throw new Error('GFF_STEAM_TASK_UNSUPPORTED');
};

/** 第一阶段只改识别 DOM，保留原按钮、事件监听器及最早的原始状态。 */
export const prepareSteamGFF = (request: GFFRequest, previous?: GFFPreparedState): SteamPreparedState => {
  const state = previous as SteamPreparedState | undefined;
  const selectors = controls(request);
  if (!selectors) {
    return pending(state);
  }
  const add = document.querySelector<HTMLElement>(selectors.add);
  const remove = [...document.querySelectorAll<HTMLElement>(selectors.remove)];
  if (!add || remove.length === 0) {
    return pending(state);
  }
  const { property } = selectors;
  const hidden = property === 'display' ? 'none' : 'hidden';
  const snapshots = state?.snapshots ?? new Map<HTMLElement, ControlSnapshot>();
  for (const node of [add, ...remove]) {
    if (!snapshots.has(node)) {
      snapshots.set(node, {
        node,
        inlineValue: node.style[property],
        computedValue: getComputedStyle(node)[property]
      });
    }
  }
  const originalAdded = state?.originalAdded ?? (snapshots.get(add)?.computedValue === hidden);
  add.style[property] = hidden;
  for (const node of remove) {
    const original = snapshots.get(node)?.computedValue;
    node.style[property] = original && original !== hidden ? original : (property === 'display' ? 'block' : 'visible');
  }
  return {
    status: 'applied',
    originalAdded,
    appliedBeforeLoad: state?.appliedBeforeLoad ?? document.readyState !== 'complete',
    add,
    remove,
    property,
    snapshots
  };
};

/** 第二阶段至多一次原生添加；收藏始终由同一请求刷新一次后完成。 */
export const finalizeSteamGFF = async (request: GFFRequest, prepared: GFFPreparedState): Promise<'complete' | 'refresh'> => {
  const state = prepareSteamGFF(request, prepared);
  if (state.status !== 'applied' || !state.add || !state.remove || !state.property) {
    throw new Error('GFF_STEAM_DOM_NOT_READY');
  }
  if (request.phase !== 'after-refresh' && !state.originalAdded && !request.actionDispatched) {
    const {
      property, add
    } = state;
    const hidden = property === 'display' ? 'none' : 'hidden';
    const original = state.snapshots?.get(add);
    // 临时恢复可添加语义，避免自己第一阶段的伪装导致取消操作。
    add.style[property] = original?.computedValue && original.computedValue !== hidden
      ? original.inlineValue
      : (property === 'display' ? 'block' : 'visible');
    for (const node of state.remove) {
      node.style[property] = hidden;
    }
    request.actionDispatched = true;
    try {
      add.click();
    } finally {
      prepareSteamGFF(request, state);
    }
  }
  return request.taskType === 'workshopLinks' && request.phase === 'initial' ? 'refresh' : 'complete';
};
