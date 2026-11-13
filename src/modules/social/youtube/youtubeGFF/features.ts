import type { GFFPreparedState, GFFRequest } from '../../social/gff/types';

const subscribe = ['Подписаться', 'Падпісацца', 'Підписатися', 'Abonnieren', 'Subscribe', 'Suscribirse', 'Mag-subscribe', "S'abonner", 'Iscriviti', 'Subskrybuj', 'Subscrever', 'Abonează-te', '订阅', 'チャンネル登録', '訂閱'];
const subscribed = ['Вы подписаны', 'Вы падпісаны', 'Ви підписалися', 'Abonniert', 'Subscribed', 'Suscrito', 'Naka-subscribe', 'Abonné', 'Iscritto', 'Subskrybujesz', 'Subscrito', 'Abonat(ă)', '已订阅', '登録済み', '已訂閱'];

interface YoutubePreparedState extends GFFPreparedState {
  button?: HTMLElement;
  textSnapshots?: Map<Text, string>;
  pressedSnapshots?: Map<HTMLElement, string>;
}

const pending = (previous?: YoutubePreparedState): YoutubePreparedState => {
  return {
    ...previous,
    status: 'pending',
    appliedBeforeLoad: previous?.appliedBeforeLoad ?? false
  };
};

const textNodes = (root: Node): Text[] => {
  const nodes: Text[] = [];
  for (const child of root.childNodes) {
    if (child.nodeType === 3) {
      nodes.push(child as Text);
    } else {
      nodes.push(...textNodes(child));
    }
  }
  return nodes;
};

const readSubscribed = (model: HTMLElement, button: HTMLElement): boolean | undefined => {
  const text = model.textContent?.trim() ?? '';
  if (subscribed.includes(text)) {
    return true;
  }
  if (subscribe.includes(text)) {
    return false;
  }
  for (const node of [model, button]) {
    const pressed = node.getAttribute('aria-pressed');
    const state = node.getAttribute('data-state');
    const subscribedAttribute = node.getAttribute('subscribed');
    if (pressed === 'true' || state === 'subscribed' || (subscribedAttribute !== null && subscribedAttribute !== 'false')) {
      return true;
    }
    if (pressed === 'false' || state === 'unsubscribed' || subscribedAttribute === 'false') {
      return false;
    }
    const label = node.getAttribute('aria-label')?.trim() ?? '';
    if (subscribed.includes(label)) {
      return true;
    }
    if (subscribe.includes(label)) {
      return false;
    }
  }
  if (document.querySelector('.ytSubscribePlusButtonViewModelHost')) {
    return true;
  }
  return undefined;
};

const targetUrl = (request: GFFRequest): URL => {
  const target = new URL(request.link);
  if (target.hostname === 'youtu.be') {
    const video = target.pathname.split('/').filter(Boolean);
    if (video.length !== 1) {
      throw new Error('GFF_YOUTUBE_TARGET_INVALID');
    }
    target.hostname = 'www.youtube.com';
    target.pathname = '/watch';
    target.searchParams.set('v', video[0]);
  }
  const current = new URL(location.href);
  if (request.platform !== 'youtube' || !['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(target.hostname) ||
      !['www.youtube.com', 'm.youtube.com'].includes(current.hostname) ||
      current.pathname.replace(/\/+$/, '') !== target.pathname.replace(/\/+$/, '') ||
      current.searchParams.get('v') !== target.searchParams.get('v')) {
    throw new Error('GFF_YOUTUBE_TARGET_MISMATCH');
  }
  return target;
};

/** 只改文本节点和点赞属性，保留所有原始按钮及事件监听器。 */
export const prepareYoutubeGFF = (request: GFFRequest, previous?: GFFPreparedState): YoutubePreparedState => {
  const state = previous as YoutubePreparedState | undefined;
  const target = targetUrl(request);
  if (request.taskType === 'channelLinks') {
    const channelPath = target.pathname.match(/^\/(?:channel\/([^/]+)|(@[^/]+)|(?:c|user)\/([^/]+))(?:\/|$)/);
    if (!channelPath) {
      throw new Error('GFF_CHANNEL_TARGET_INVALID');
    }
    const models = [...document.querySelectorAll<HTMLElement>('yt-subscribe-button-view-model')];
    const identifier = document.querySelector<HTMLMetaElement>('meta[itemprop="identifier"]')?.getAttribute('content');
    if (models.length === 0 || !identifier) {
      return pending(state);
    }
    if (!/^UC[\w-]+$/.test(identifier) || (channelPath[1] && identifier !== channelPath[1])) {
      throw new Error('GFF_CHANNEL_TARGET_MISMATCH');
    }
    const model = models.find((candidate) => {
      const nativeButton = candidate.querySelector<HTMLElement>('button');
      return !!nativeButton && (state?.originalAdded !== undefined || readSubscribed(candidate, nativeButton) !== undefined);
    });
    const button = model?.querySelector<HTMLElement>('button');
    if (!model || !button) {
      return pending(state);
    }
    const originalAdded = state?.originalAdded ?? readSubscribed(model, button);
    if (originalAdded === undefined) {
      return pending(state);
    }
    const snapshots = state?.textSnapshots ?? new Map<Text, string>();
    let first: Text | undefined;
    for (const candidate of models) {
      const nodes = textNodes(candidate);
      for (const node of nodes) {
        if (!snapshots.has(node)) {
          snapshots.set(node, node.nodeValue ?? '');
        }
        if (candidate === model && !first) {
          first = node;
        }
        node.nodeValue = '';
      }
    }
    if (!first) {
      first = document.createTextNode('');
      button.appendChild(first);
      snapshots.set(first, '');
    }
    // 原扩展的 .text() 拼接所有 view-model；全页拼接后必须精确等于 Subscribed。
    first.nodeValue = 'Subscribed';
    return {
      status: 'applied',
      originalAdded,
      appliedBeforeLoad: state?.appliedBeforeLoad ?? document.readyState !== 'complete',
      button,
      textSnapshots: snapshots
    };
  }
  if (request.taskType === 'videoLinks') {
    const expected = target.searchParams.get('v');
    if (target.pathname !== '/watch' || !expected || !/^[\w-]+$/.test(expected)) {
      throw new Error('GFF_VIDEO_TARGET_INVALID');
    }
    if (!document.querySelector('.ytLikeButtonViewModelHost')) {
      return pending(state);
    }
    const button = document.querySelector<HTMLElement>('.ytLikeButtonViewModelHost button');
    if (!button) {
      return pending(state);
    }
    if (location.hostname === 'm.youtube.com') {
      const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      const href = canonical?.getAttribute('href');
      if (!canonical || !href) {
        return pending(state);
      }
      const canonicalUrl = new URL(href, location.href);
      if (!['www.youtube.com', 'm.youtube.com', 'youtube.com'].includes(canonicalUrl.hostname) ||
          canonicalUrl.pathname !== '/watch' || canonicalUrl.searchParams.getAll('v').length !== 1 ||
          canonicalUrl.searchParams.get('v') !== expected) {
        throw new Error('GFF_VIDEO_TARGET_MISMATCH');
      }
      // 扩展直接 split('v=').pop()；其轮询读取 canonical，可安全移除同一视频的附加参数。
      canonical.setAttribute('href', `https://www.youtube.com/watch?v=${encodeURIComponent(expected)}`);
    } else {
      const identifier = document.querySelector<HTMLMetaElement>('meta[itemprop="identifier"]')?.getAttribute('content');
      if (!identifier) {
        return pending(state);
      }
      if (identifier !== expected) {
        throw new Error('GFF_VIDEO_TARGET_MISMATCH');
      }
    }
    const pressedSnapshots = state?.pressedSnapshots ?? new Map<HTMLElement, string>();
    if (!pressedSnapshots.has(button)) {
      const pressed = button.getAttribute('aria-pressed');
      if (pressed !== 'true' && pressed !== 'false') {
        return pending(state);
      }
      pressedSnapshots.set(button, pressed);
    }
    const originalAdded = state?.originalAdded ?? (pressedSnapshots.get(button) === 'true');
    button.setAttribute('aria-pressed', 'true');
    return {
      status: 'applied',
      originalAdded,
      appliedBeforeLoad: state?.appliedBeforeLoad ?? document.readyState !== 'complete',
      button,
      pressedSnapshots
    };
  }
  throw new Error('GFF_YOUTUBE_TASK_UNSUPPORTED');
};

export const finalizeYoutubeGFF = async (request: GFFRequest, prepared: GFFPreparedState): Promise<'complete' | 'refresh'> => {
  const state = prepareYoutubeGFF(request, prepared);
  if (state.status !== 'applied' || !state.button) {
    throw new Error('GFF_YOUTUBE_DOM_NOT_READY');
  }
  if (!state.originalAdded && !request.actionDispatched) {
    if (request.taskType === 'channelLinks') {
      for (const [node, original] of state.textSnapshots ?? []) {
        node.nodeValue = original;
      }
    } else {
      state.button.setAttribute('aria-pressed', 'false');
    }
    request.actionDispatched = true;
    try {
      state.button.click();
    } finally {
      prepareYoutubeGFF(request, state);
    }
  }
  return 'complete';
};
