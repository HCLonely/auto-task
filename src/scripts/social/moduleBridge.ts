import type { GMAuthAPI } from '../../../modules/social/steam';
import type { SocialStatusEvent, StatusListener } from '../../../modules/social/social/types';
import echoLog from '../echoLog';
import __ from '../tools/i18n';
import { debug } from '../tools/debug';

export const moduleNamespace = (platform: string): string => `autoTask:${platform}`;

/** Keep compatible project data in GM storage; authentication handshakes remain namespaced. */
export const projectGM = (platform: string): GMAuthAPI => {
  const namespace = moduleNamespace(platform);
  const legacyKeys: Record<string, string> = {
    [`${namespace}:auth`]: `${platform}Auth`,
    [`${namespace}:cache`]: `${platform}Cache`
  };
  if (platform === 'steam') legacyKeys[`${namespace}:web:cache`] = 'steamCache';
  // Website history is scoped by giveaway; never undo tasks recorded on another page.
  const page = typeof location === 'undefined' ? '' : location.href.split('#')[0];
  const keyFor = (key: string): string => (key === `${namespace}:tasks` ? `${key}:${encodeURIComponent(page)}` : legacyKeys[key] || key);
  const isPlayState = (key: string): boolean => platform === 'steam' && key.startsWith(`${namespace}:playState:`);
  return {
    getValue: <T>(key: string, fallback: T): T => {
      if (key === `${namespace}:whiteList`) return GM_getValue<Record<string, T>>('whiteList', {})[platform] ?? fallback;
      if (isPlayState(key)) return {
        stopPlayTime: GM_getValue('stopPlayTime', 0),
        playedGames: GM_getValue('playedGames', []),
        taskLink: GM_getValue('taskLink', [])
      } as T;
      return GM_getValue(keyFor(key), fallback);
    },
    setValue: (key, value) => {
      if (key === `${namespace}:whiteList`) {
        GM_setValue('whiteList', { ...GM_getValue('whiteList', {}), [platform]: value });
      } else if (isPlayState(key)) {
        const state = value as Record<string, unknown>;
        for (const field of ['stopPlayTime', 'playedGames', 'taskLink']) GM_setValue(field, state[field]);
      } else GM_setValue(keyFor(key), value);
    },
    deleteValue: (key) => {
      if (key === `${namespace}:whiteList`) {
        const lists = GM_getValue<Record<string, unknown>>('whiteList', {});
        delete lists[platform];
        GM_setValue('whiteList', lists);
      } else if (isPlayState(key)) {
        for (const field of ['stopPlayTime', 'playedGames', 'taskLink']) GM_deleteValue(field);
      } else GM_deleteValue(keyFor(key));
    },
    openInTab: (url, options) => GM_openInTab(url, options),
    addValueChangeListener: (key, listener) => GM_addValueChangeListener(keyFor(key), listener),
    removeValueChangeListener: (id) => GM_removeValueChangeListener(id)
  };
};

const escapeText = (value: string): string => value.replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;'
}[char] || char));

/** Log batch results and individual tasks, without duplicating executor/transport logs. */
export const bindModuleStatus = (client: { on(event: 'status', listener: StatusListener): () => void; dispose(): void }, platform: string): (() => void) => {
  const logs = new Map<string, logStatus>();
  const parents = new Map<string, string>();
  const taskOperations = /^(task\.(execute|skip|do|undo)|users\.(follow|unfollow)|retweets\.(create|delete)|channel\.(follow|unfollow|subscribe|unsubscribe)|video\.(like|unlike)|user\.(follow|unfollow)|subreddit\.(subscribe|unsubscribe))$/;
  const listener = (event: SocialStatusEvent): void => {
    debug(`${platform}: ${event.operation}`, event);
    if (event.parentOperationId) parents.set(event.operationId, event.parentOperationId);
    const terminal = ['success', 'failure', 'skipped'].includes(event.phase);
    if (/AUTH_REQUIRED|LOGIN_REQUIRED|AUTH_WAITING_FOR_PAGE/.test(event.code)) {
      let id: string | undefined = event.operationId;
      const visited = new Set<string>();
      while (id && !visited.has(id)) {
        visited.add(id);
        if (logs.has(id)) { logs.get(id)?.warning(__('needLogin')); break; }
        id = parents.get(id);
      }
    }
    if (event.parentOperationId && !(taskOperations.test(event.operation) && (platform !== 'Steam' || (event as SocialStatusEvent & { source?: string }).source === 'steam'))) {
      if (terminal) parents.delete(event.operationId);
      return;
    }
    let log = logs.get(event.operationId);
    if (!log) {
      const label = __(event.operation.startsWith('init') ? 'moduleInitializing' : 'moduleTask');
      log = echoLog({ text: escapeText(`${platform}: ${label}${event.target ? ` (${event.target})` : ''}`) });
      logs.set(event.operationId, log);
    }
    if (event.phase === 'success') log.success();
    else if (event.phase === 'failure') log.error(__('moduleFailed'));
    else if (event.phase === 'skipped') log.warning(__('moduleSkipped'));
    else if (/AUTH_REQUIRED|LOGIN_REQUIRED/.test(event.code)) log.warning(__('needLogin'));
    if (terminal) { logs.delete(event.operationId); parents.delete(event.operationId); }
  };
  const unsubscribe = client.on('status', listener);
  const onPageHide = (event: PageTransitionEvent): void => { if (!event.persisted) client.dispose(); };
  window.addEventListener('pagehide', onPageHide);
  return () => {
    unsubscribe(); logs.clear(); parents.clear();
    window.removeEventListener('pagehide', onPageHide);
  };
};
