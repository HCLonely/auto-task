import type { GFFContext } from './context';
import type { GFFListenerId, GFFReply, GFFRequest, GFFTab } from './types';
import { getGFFOpenedUrl, isGFFTargetUrl, isGFFRequest } from './page';

/** 一项只拥有自己的两个 GM 键、监听器、超时和标签页。 */
export const requestGFFTask = (context: GFFContext, taskType: string, link: string, batchId = crypto.randomUUID()): Promise<boolean> => {
  if (context.disposed) {
    return Promise.resolve(false);
  }
  const {
    gm, namespace
  } = context.options;
  const id = crypto.randomUUID();
  const requestKey = `${namespace}:task:${id}`;
  const resultKey = `${namespace}:result:${id}`;
  const createdAt = Date.now();
  const request: GFFRequest = {
    id,
    platform: context.options.platform ?? (['channelLinks', 'videoLinks'].includes(taskType) ? 'youtube' : 'steam'),
    taskType,
    link,
    openedUrl: '',
    phase: 'initial',
    refreshCount: 0,
    actionDispatched: false,
    ownerPage: context.ownerPage,
    batchId,
    createdAt,
    expiresAt: createdAt + (context.options.timeoutMs ?? 60000)
  };
  const emit = (phase: 'start' | 'success' | 'failure', code: string): void => {
    context.emit({
      operationId: id,
      operation: 'task.execute',
      phase,
      level: phase === 'failure' ? 'error' : 'info',
      code,
      target: link,
      timestamp: Date.now(),
      details: {
        taskType,
        batchId
      }
    });
  };

  return new Promise<boolean>((resolve) => {
    let settled = false;
    let listenerId: GFFListenerId | undefined;
    let tab: GFFTab | undefined;
    let closed = false;
    let unregister = (): void => {};
    const closeOnce = (): void => {
      if (!tab || closed) {
        return;
      }
      closed = true;
      tab.onclose = null;
      try {
        tab.close();
      } catch {
        // 标签页可能已被用户关闭，仍须完成其余清理。
      }
    };
    const removeListener = async (value: GFFListenerId): Promise<void> => {
      try {
        await gm.removeValueChangeListener(value);
      } catch {
        // 清理失败不重复交付结果。
      }
    };
    const removeKeys = async (): Promise<void> => {
      for (const key of [requestKey, resultKey]) {
        try {
          const current = await gm.getValue<Partial<GFFRequest & GFFReply>>(key);
          if (current?.id === id && (key === resultKey || current.ownerPage === request.ownerPage && current.batchId === batchId)) {
            await gm.deleteValue(key);
          }
        } catch {
          // 一个键删除异常不能阻止另一个键的清理。
        }
      }
    };
    const finish = async (success: boolean, code: string): Promise<void> => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      unregister();
      // 外部 GM 清理可能永不兑现；先启动清理并关页，再有界等待。
      const listener = listenerId;
      listenerId = undefined;
      const cleanup = Promise.allSettled([
        removeKeys(),
        listener === undefined ? Promise.resolve() : removeListener(listener)
      ]);
      closeOnce();
      let cleanupTimer: ReturnType<typeof setTimeout> | undefined;
      await Promise.race([
        cleanup,
        new Promise<void>((done) => {
          cleanupTimer = setTimeout(done, 1000);
        })
      ]);
      if (cleanupTimer !== undefined) {
        clearTimeout(cleanupTimer);
      }
      emit(success ? 'success' : 'failure', code);
      resolve(success);
    };
    const timer = setTimeout(() => {
      void finish(false, 'GFF_TIMEOUT');
    }, Math.max(0, request.expiresAt - Date.now()));
    unregister = context.registerCancellation(() => {
      void finish(false, 'GFF_CANCELLED');
    });
    emit('start', 'GFF_STARTED');

    const replyMatches = (value: unknown): value is GFFReply => {
      if (!value || typeof value !== 'object') {
        return false;
      }
      const reply = value as Partial<GFFReply>;
      return reply.id === id && ['completed', 'failed', 'cancelled'].includes(reply.status ?? '');
    };
    const onclose = async (): Promise<void> => {
      if (settled) {
        return;
      }
      try {
        const reply = await gm.getValue(resultKey);
        if (replyMatches(reply) && reply.status !== 'completed') {
          await finish(false, reply.code);
          return;
        }
        await finish(true, 'GFF_TAB_CLOSED');
      } catch {
        await finish(false, 'GFF_GM_ERROR');
      }
    };
    const setup = async (): Promise<void> => {
      try {
        request.openedUrl = getGFFOpenedUrl(link, id);
        if (!isGFFRequest(request) || !isGFFTargetUrl(request, request.openedUrl)) {
          await finish(false, 'GFF_INVALID_TARGET');
          return;
        }
        const registered = await gm.addValueChangeListener(resultKey, (_key, _old, value) => {
          if (replyMatches(value)) {
            void finish(value.status === 'completed', value.code);
          }
        });
        if (settled) {
          await removeListener(registered);
          return;
        }
        listenerId = registered;
        await gm.setValue(requestKey, request);
        if (settled) {
          // setValue 可在取消后才完成；只能删除本项，禁止复活请求。
          await removeKeys();
          return;
        }
        const opened = await gm.openInTab(request.openedUrl, {
          active: true,
          setParent: true
        });
        if (!opened || typeof opened.close !== 'function') {
          await finish(false, 'GFF_OPEN_FAILED');
          return;
        }
        tab = opened;
        if (settled) {
          closeOnce();
          await removeKeys();
          return;
        }
        tab.onclose = () => {
          void onclose();
        };
        if (tab.closed) {
          void onclose();
        }
      } catch {
        await finish(false, 'GFF_SETUP_FAILED');
      }
    };
    void setup();
  });
};
