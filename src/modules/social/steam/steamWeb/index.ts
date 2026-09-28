import { updateCommunityAuth, updateStoreAuth } from './auth/session';
import { updateCommunityAuthTab, updateStoreAuthTab } from './auth/tabAuth';
import { loadCache } from './cache';
import { Context } from './context';
import { likeAnnouncement } from './features/announcement';
import { doCurator, undoCurator } from './features/curator';
import { doFollowGame, undoFollowGame } from './features/followGame';
import { doForum, undoForum } from './features/forum';
import { joinGroup, leaveGroup } from './features/groups';
import { addLicense } from './features/licenses';
import { joinOfficialGroup, leaveOfficialGroup } from './features/officialGroups';
import { requestPlayTestAccess } from './features/playtest';
import { resetArea } from './features/region';
import { addToWishlist, removeFromWishlist } from './features/wishlist';
import { doFavoriteWorkshop, undoFavoriteWorkshop, voteUpWorkshop } from './features/workshop';
import type { StatusListener, SteamWebOptions } from './types';

export { createGMHttpClient } from './adapters/gmHttp';
export type { GMRawResponse, GMRequest, GMRequestOptions } from './adapters/gmHttp';
export { createGMStorage } from './adapters/gmStorage';
export { handleSteamAuthPage } from './adapters/gmTabAuth';
export * from './types';

/** Explicitly initialize store/community before invoking the corresponding features. */
export class SteamWeb {
  private readonly ctx: Context;
  constructor(options: SteamWebOptions) {
    this.ctx = new Context(options);
  }

  on(event: 'status', listener: StatusListener): () => void {
    if (event !== 'status') {
      throw new Error('Unknown event');
    }
    return this.ctx.events.on(listener);
  }

  init(type: 'all' | 'store' | 'community' = 'all'): Promise<boolean> {
    return this.ctx.run('init', type, async (ctx) => {
      if (type === 'store') {
        return this.initializeStore(ctx);
      }
      if (type === 'community') {
        return this.initializeCommunity(ctx, ctx.state.storeInitialized);
      }
      if (type !== 'all') {
        return false;
      }
      const store = await this.initializeStore(ctx);
      const community = await this.initializeCommunity(ctx, store);
      return store && community;
    });
  }

  initStore(): Promise<boolean> {
    return this.initializeStore(this.ctx);
  }

  private initializeStore(parent: Context): Promise<boolean> {
    const { state } = this.ctx;
    if (state.storeInit) {
      return state.storeInit;
    }
    state.storeInit = parent.run('init.store', undefined, async (ctx) => {
      try {
        if (state.disposed) {
          ctx.progress('DISPOSED', 'error');
          return false;
        }
        if (state.storeInitialized) {
          return true;
        }
        await loadCache(ctx);
        state.storeInitialized = await updateStoreAuth(ctx) || await updateStoreAuthTab(ctx);
        return state.storeInitialized;
      } catch {
        ctx.reportError();
        return false;
      }
    }).finally(() => {
      state.storeInit = undefined;
    });
    return state.storeInit;
  }

  initCommunity(initStoreResult = this.ctx.state.storeInitialized): Promise<boolean> {
    return this.initializeCommunity(this.ctx, initStoreResult);
  }

  private initializeCommunity(parent: Context, initStoreResult: boolean): Promise<boolean> {
    const { state } = this.ctx;
    if (state.communityInit) {
      return state.communityInit;
    }
    state.communityInit = parent.run('init.community', undefined, async (ctx) => {
      try {
        if (state.disposed) {
          ctx.progress('DISPOSED', 'error');
          return false;
        }
        if (state.communityInitialized) {
          return true;
        }
        await loadCache(ctx);
        state.communityInitialized = await updateCommunityAuth(ctx, initStoreResult) || await updateCommunityAuthTab(ctx);
        return state.communityInitialized;
      } catch {
        ctx.reportError();
        return false;
      }
    }).finally(() => {
      state.communityInit = undefined;
    });
    return state.communityInit;
  }

  joinGroup(groupName: string): Promise<boolean> {
    return joinGroup(this.ctx, groupName);
  }

  leaveGroup(groupName: string): Promise<boolean> {
    return leaveGroup(this.ctx, groupName);
  }

  joinOfficialGroup(gameId: string): Promise<boolean> {
    return joinOfficialGroup(this.ctx, gameId);
  }

  leaveOfficialGroup(gameId: string): Promise<boolean> {
    return leaveOfficialGroup(this.ctx, gameId);
  }

  addToWishlist(gameId: string): Promise<boolean> {
    return addToWishlist(this.ctx, gameId);
  }

  removeFromWishlist(gameId: string): Promise<boolean> {
    return removeFromWishlist(this.ctx, gameId);
  }

  doFollowGame(gameId: string): Promise<boolean> {
    return doFollowGame(this.ctx, gameId);
  }
  undoFollowGame(gameId: string): Promise<boolean> {
    return undoFollowGame(this.ctx, gameId);
  }

  doForum(gameId: string): Promise<boolean> {
    return doForum(this.ctx, gameId);
  }
  undoForum(gameId: string): Promise<boolean> {
    return undoForum(this.ctx, gameId);
  }

  doFavoriteWorkshop(id: string): Promise<boolean> {
    return doFavoriteWorkshop(this.ctx, id);
  }
  undoFavoriteWorkshop(id: string): Promise<boolean> {
    return undoFavoriteWorkshop(this.ctx, id);
  }

  voteUpWorkshop(id: string): Promise<boolean> {
    return voteUpWorkshop(this.ctx, id);
  }

  doCurator(curatorId: string): Promise<boolean> {
    return doCurator(this.ctx, curatorId);
  }
  undoCurator(curatorId: string): Promise<boolean> {
    return undoCurator(this.ctx, curatorId);
  }

  likeAnnouncement(id: string): Promise<boolean> {
    return likeAnnouncement(this.ctx, id);
  }

  addLicense(id: string): Promise<boolean> {
    return addLicense(this.ctx, id);
  }

  requestPlayTestAccess(id: string): Promise<boolean> {
    return requestPlayTestAccess(this.ctx, id);
  }

  resetArea(): Promise<boolean> {
    return resetArea(this.ctx);
  }

  /** Cancels authentication waits. Does not undo completed actions or change country. */
  dispose(): void {
    this.ctx.state.disposed = true;
    for (const cleanup of [...this.ctx.state.cleanups]) {
      cleanup();
    }
    this.ctx.events.clear();
  }
}

export default SteamWeb;
