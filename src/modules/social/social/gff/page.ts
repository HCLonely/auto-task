import type { GFFListenerId, GFFPageHandlerOptions, GFFPlatform, GFFPreparedState, GFFReply, GFFRequest, GMAPI } from './types';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const marker = 'autoTaskGFF';
const taskTypes: Record<GFFPlatform, readonly string[]> = {
  steam: ['followLinks', 'curatorLinks', 'guideLinks', 'workshopLinks'],
  youtube: ['channelLinks', 'videoLinks']
};

/** 仅在调用包装函数时访问 GM 全局，导入模块本身不要求用户脚本环境。 */
export const getDefaultGFFGM = (): GMAPI => {
  return {
    getValue: <T>(key: string, fallback?: T) => {
      return GM_getValue<T | undefined>(key, fallback);
    },
    setValue: (key, value) => {
      GM_setValue(key, value);
    },
    deleteValue: (key) => {
      GM_deleteValue(key);
    },
    addValueChangeListener: (key, listener) => {
      return GM_addValueChangeListener(key, listener);
    },
    removeValueChangeListener: (id) => {
      GM_removeValueChangeListener(id as number);
    },
    openInTab: (url, options) => {
      return GM_openInTab(url, options);
    }
  };
};

export const getGFFRequestId = (url: string): string | undefined => {
  try {
    const tokens = new URLSearchParams(new URL(url).hash.slice(1)).getAll(marker);
    if (tokens.length === 1 && uuidPattern.test(tokens[0])) {
      return tokens[0];
    }
  } catch {
    // 普通链接及非法标记不参与跨标签页任务。
  }
  return undefined;
};

const normalizeUrl = (link: string): URL => {
  const url = new URL(link);
  if (url.protocol === 'http:') {
    url.protocol = 'https:';
  }
  if (url.protocol !== 'https:' || url.username || url.password || url.port) {
    throw new Error('GFF_INVALID_TARGET');
  }
  if (url.hostname === 'youtu.be') {
    const video = url.pathname.split('/').filter(Boolean);
    if (video.length !== 1) {
      throw new Error('GFF_INVALID_TARGET');
    }
    url.hostname = 'www.youtube.com';
    url.pathname = '/watch';
    url.searchParams.set('v', video[0]);
  } else if (url.hostname === 'youtube.com') {
    url.hostname = 'www.youtube.com';
  }
  return url;
};

export const getGFFOpenedUrl = (link: string, id: string): string => {
  if (!uuidPattern.test(id)) {
    throw new Error('GFF_INVALID_ID');
  }
  const url = normalizeUrl(link);
  // 保留原片段的字节形式；已有同名标记必须拒绝，避免一个页面出现两种身份。
  const hash = url.hash.slice(1);
  if (new URLSearchParams(hash).has(marker)) {
    throw new Error('GFF_INVALID_TARGET');
  }
  url.hash = `${hash}${hash ? '&' : ''}${marker}=${id}`;
  return url.href;
};

const identity = (url: URL, platform: GFFPlatform): string | undefined => {
  const allowed = platform === 'steam'
    ? ['store.steampowered.com', 'steamcommunity.com']
    : ['www.youtube.com', 'm.youtube.com'];
  if (!allowed.includes(url.hostname)) {
    return undefined;
  }
  url.hash = '';
  url.searchParams.sort();
  if (platform === 'youtube') {
    url.hostname = 'www.youtube.com';
  }
  // 尾部斜线是已知无关差异，其余路径及全部查询参数严格保留。
  url.pathname = url.pathname.replace(/\/+$/, '') || '/';
  return url.href;
};

export const isGFFTargetUrl = (request: GFFRequest, currentUrl: string): boolean => {
  try {
    const expected = normalizeUrl(request.link);
    const opened = normalizeUrl(request.openedUrl);
    const current = normalizeUrl(currentUrl);
    const expectedIdentity = identity(expected, request.platform);
    return !!expectedIdentity &&
      getGFFRequestId(request.openedUrl) === request.id &&
      getGFFRequestId(currentUrl) === request.id &&
      identity(opened, request.platform) === expectedIdentity &&
      identity(current, request.platform) === expectedIdentity;
  } catch {
    return false;
  }
};

/** 校验持久化记录，不让损坏的阶段或非白名单任务进入 DOM 层。 */
const hasRequestShape = (value: unknown): value is GFFRequest => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const request = value as Partial<GFFRequest>;
  if (typeof request.id !== 'string' || !uuidPattern.test(request.id) ||
      typeof request.ownerPage !== 'string' || !uuidPattern.test(request.ownerPage) ||
      typeof request.batchId !== 'string' || !uuidPattern.test(request.batchId) ||
      !['steam', 'youtube'].includes(request.platform ?? '') ||
      typeof request.taskType !== 'string' ||
      typeof request.link !== 'string' || typeof request.openedUrl !== 'string' ||
      typeof request.actionDispatched !== 'boolean' ||
      typeof request.createdAt !== 'number' || !Number.isFinite(request.createdAt) ||
      typeof request.expiresAt !== 'number' || !Number.isFinite(request.expiresAt) ||
      request.expiresAt <= request.createdAt) {
    return false;
  }
  if (!taskTypes[request.platform as GFFPlatform].includes(request.taskType)) {
    return false;
  }
  return true;
};

export const isGFFRequest = (value: unknown): value is GFFRequest => {
  if (!hasRequestShape(value)) {
    return false;
  }
  const request = value;
  if (request.phase === 'initial') {
    return request.refreshCount === 0;
  }
  return request.platform === 'steam' && request.taskType === 'workshopLinks' &&
    request.refreshCount === 1 && ['awaiting-refresh', 'after-refresh'].includes(request.phase ?? '');
};

// 一个文档只能认领同一命名空间的一项任务；重复早期入口复用其 Promise。
const claimedPages = new Map<string, Promise<boolean>>();

export const handleGFFPage = (options: GFFPageHandlerOptions): Promise<boolean> => {
  const id = getGFFRequestId(location.href);
  if (!id) {
    return Promise.resolve(false);
  }
  const claimKey = `${options.namespace}:${id}`;
  const existing = claimedPages.get(claimKey);
  if (existing) {
    return existing;
  }

  // 必须先于第一次异步 GM 读取捕获真实 load，避免读取期间丢失事件。
  let loaded = document.readyState === 'complete';
  let resolveLoaded = (): void => {};
  const loadPromise = new Promise<void>((resolve) => {
    resolveLoaded = resolve;
  });
  const onload = (): void => {
    loaded = true;
    resolveLoaded();
  };
  window.addEventListener('load', onload, {
    once: true
  });
  if (loaded) {
    resolveLoaded();
  }

  const execute = async (): Promise<boolean> => {
    const gm = options.gm ?? getDefaultGFFGM();
    const requestKey = `${options.namespace}:task:${id}`;
    const resultKey = `${options.namespace}:result:${id}`;
    let request: GFFRequest | undefined;
    let prepared: GFFPreparedState | undefined;
    let observer: MutationObserver | undefined;
    let deadline: ReturnType<typeof setTimeout> | undefined;
    let stopped = false;
    let invalidated = false;
    let committing = false;
    let claimed = false;
    let requestListener: GFFListenerId | undefined;
    let listenerClosed = false;
    const waits = new Map<ReturnType<typeof setTimeout>, () => void>();
    const removeRequestListener = (listener: GFFListenerId): void => {
      try {
        void Promise.resolve(gm.removeValueChangeListener(listener)).catch(() => {
          // 页面退出时不等待可能挂起的外部清理。
        });
      } catch {
        // 其他资源仍须释放。
      }
    };
    const cleanup = (): void => {
      listenerClosed = true;
      if (requestListener !== undefined) {
        removeRequestListener(requestListener);
        requestListener = undefined;
      }
      observer?.disconnect();
      clearTimeout(deadline);
      window.removeEventListener('load', onload);
      window.removeEventListener('pagehide', onhide);
      for (const [timer, resolve] of waits) {
        clearTimeout(timer);
        resolve();
      }
      waits.clear();
      resolveLoaded();
    };
    const pendingRecord = async (allowInvalidPhase = false): Promise<GFFRequest | undefined> => {
      if (invalidated) {
        return undefined;
      }
      const value = await gm.getValue(requestKey);
      if (invalidated || !hasRequestShape(value)) {
        return undefined;
      }
      if ((!allowInvalidPhase && !isGFFRequest(value)) || value.id !== id || value.platform !== options.platform ||
          value.ownerPage !== request?.ownerPage || value.batchId !== request?.batchId ||
          value.expiresAt !== request?.expiresAt || Date.now() >= value.expiresAt ||
          !isGFFTargetUrl(value, location.href)) {
        return undefined;
      }
      const reply = await gm.getValue<Partial<GFFReply>>(resultKey);
      if (invalidated || Date.now() >= value.expiresAt || reply?.id === id) {
        return undefined;
      }
      // 第二次异步读取期间父页可能删除请求，不能交付过期快照。
      const latest = await gm.getValue(requestKey);
      if (invalidated || !hasRequestShape(latest) || latest.id !== id ||
        latest.ownerPage !== value.ownerPage || latest.batchId !== value.batchId ||
        latest.expiresAt !== value.expiresAt || Date.now() >= latest.expiresAt ||
        !isGFFTargetUrl(latest, location.href) || (!allowInvalidPhase && !isGFFRequest(latest))) {
        return undefined;
      }
      return latest;
    };

    /** 写入 Promise 可能在关页之后才完成；只清理仍属于本次写入的值。 */
    const writeOwned = async (key: string, value: GFFRequest | GFFReply): Promise<boolean> => {
      await gm.setValue(key, value);
      const currentRequest = await gm.getValue(requestKey);
      if (!invalidated && !(stopped && key === requestKey) && hasRequestShape(currentRequest) && request &&
        currentRequest.id === id && currentRequest.ownerPage === request.ownerPage &&
        currentRequest.batchId === request.batchId && currentRequest.expiresAt === request.expiresAt &&
        Date.now() < request.expiresAt && isGFFTargetUrl(currentRequest, location.href)) {
        return true;
      }
      const currentValue = await gm.getValue(key);
      if (JSON.stringify(currentValue) === JSON.stringify(value)) {
        await gm.deleteValue(key);
      }
      return false;
    };
    const reply = async (status: GFFReply['status'], code: string): Promise<void> => {
      // 取消或父页已删除记录时绝不重新创建结果，也不覆盖既有失败。
      if (!await pendingRecord(true)) {
        return;
      }
      await writeOwned(resultKey, {
        id,
        status,
        code,
        finishedAt: Date.now()
      } satisfies GFFReply);
    };
    const onhide = (): void => {
      invalidated = true;
      stopped = true;
      cleanup();
      // 手动关页由父页按用户规则视为完成，不抢先写 cancelled。
      // intentional refresh 同样只释放当前文档资源。
    };
    const wait = (milliseconds: number): Promise<void> => {
      return new Promise((resolve) => {
        if (stopped) {
          resolve();
          return;
        }
        const timer = setTimeout(() => {
          waits.delete(timer);
          resolve();
        }, milliseconds);
        waits.set(timer, resolve);
      });
    };
    const prepare = (): void => {
      if (stopped || committing || !request) {
        return;
      }
      // disconnect 避免自身属性修改无限触发观察，同时继续追踪网页替换节点。
      observer?.disconnect();
      const previous = prepared;
      prepared = options.prepare(request, previous);
      if (previous?.originalAdded !== undefined) {
        prepared.originalAdded = previous.originalAdded;
      }
      prepared.appliedBeforeLoad = !!previous?.appliedBeforeLoad ||
        (prepared.status === 'applied' && !loaded);
      if (observer && !stopped) {
        observer.observe(document, {
          subtree: true,
          childList: true,
          attributes: true,
          characterData: true
        });
      }
    };

    try {
      const [value, existingReply] = await Promise.all([
        gm.getValue(requestKey),
        gm.getValue(resultKey)
      ]);
      if (!hasRequestShape(value) || value.id !== id || value.platform !== options.platform ||
          value.createdAt > Date.now() || value.expiresAt <= Date.now()) {
        return false;
      }
      request = {
        ...value
      };
      claimed = true;
      if (!isGFFTargetUrl(request, location.href)) {
        // URL 不符不操作 DOM，也不能为其他目标的请求写回结果。
        return true;
      }
      if (existingReply) {
        return true;
      }
      if (!isGFFRequest(value)) {
        throw new Error('GFF_INVALID_PHASE');
      }
      window.addEventListener('pagehide', onhide, {
        once: true
      });
      deadline = setTimeout(() => {
        invalidated = true;
        stopped = true;
        cleanup();
      }, Math.max(0, request.expiresAt - Date.now()));
      const resumed = request.phase === 'awaiting-refresh';
      if (resumed) {
        request.phase = 'after-refresh';
      }

      // 没有异步等待隔开认领与首次 DOM 尝试；刷新阶段持久化排在它之后。
      prepare();
      if (typeof MutationObserver === 'function') {
        observer = new MutationObserver(() => {
          try {
            prepare();
          } catch (error) {
            stopped = true;
            cleanup();
            void reply('failed', error instanceof Error ? error.message : 'GFF_PREPARE_FAILED').then(() => {
              window.close();
            }, () => {
              window.close();
            });
          }
        });
        observer.observe(document, {
          subtree: true,
          childList: true,
          attributes: true,
          characterData: true
        });
      }
      const registered = await gm.addValueChangeListener(requestKey, (_key, _old, value) => {
        if (!hasRequestShape(value) || value.id !== id || value.ownerPage !== request?.ownerPage ||
          value.batchId !== request?.batchId || value.expiresAt !== request?.expiresAt) {
          invalidated = true;
          stopped = true;
          cleanup();
        }
      });
      if (listenerClosed) {
        removeRequestListener(registered);
        return true;
      }
      requestListener = registered;
      if (resumed) {
        if (!await pendingRecord() || stopped) {
          return true;
        }
        if (!await writeOwned(requestKey, request) || stopped) {
          return true;
        }
      }
      await loadPromise;
      await wait(1000);
      if (!await pendingRecord() || stopped) {
        return true;
      }
      prepare();
      if (!prepared || prepared.status !== 'applied') {
        throw new Error('GFF_DOM_NOT_READY');
      }
      if (request.phase === 'after-refresh' && !prepared.appliedBeforeLoad && prepared.originalAdded === false) {
        throw new Error('GFF_REFRESH_NOT_EFFECTIVE');
      }
      const outcome = await options.finalize(request, prepared);
      if (!await pendingRecord() || stopped) {
        return true;
      }
      await wait(1000);
      if (!await pendingRecord() || stopped) {
        return true;
      }
      // 最终复查与完整等待已经结束；发布结果期间不再产生新的 DOM 操作失败。
      // 请求失效监听仍保留，取消/关页仍可中止并清理晚到的 GM 写入。
      committing = true;
      observer?.disconnect();
      if (outcome === 'refresh') {
        if (request.taskType !== 'workshopLinks' || request.phase !== 'initial' || request.refreshCount !== 0) {
          throw new Error('GFF_INVALID_REFRESH');
        }
        request.phase = 'awaiting-refresh';
        request.refreshCount = 1;
        if (!await writeOwned(requestKey, request) || stopped) {
          return true;
        }
        // 异步写入期间父页可能结束任务；复查后才能触发刷新。
        if (!await pendingRecord() || stopped) {
          return true;
        }
        cleanup();
        location.reload();
        return true;
      }
      await reply('completed', 'GFF_COMPLETED');
      stopped = true;
      cleanup();
      window.close();
      return true;
    } catch (error) {
      if (claimed && !stopped) {
        try {
          await reply('failed', error instanceof Error ? error.message : 'GFF_PAGE_FAILED');
          stopped = true;
          cleanup();
          window.close();
        } catch {
          // 父页超时仍会清理，不能因失败回传异常无限等待。
        }
      }
      return claimed;
    } finally {
      cleanup();
    }
  };
  const pending = execute();
  claimedPages.set(claimKey, pending);
  return pending;
};
