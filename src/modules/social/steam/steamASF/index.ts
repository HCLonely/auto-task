import { Context } from './context';
import { doCurator, undoCurator } from './features/curator';
import { doFollowGame, undoFollowGame } from './features/followGame';
import { joinGroup, leaveGroup } from './features/groups';
import { getSteamId, getSteamIdASF, getSteamIdWeb } from './features/identity';
import { initialize } from './features/initialization';
import { addLicense } from './features/licenses';
import { checkPlayStatus, playGames, stopPlayGames } from './features/playGames';
import { requestPlayTestAccess } from './features/playtest';
import { unsupported } from './features/unsupported';
import { addToWishlist, removeFromWishlist } from './features/wishlist';
import type { StatusListener, SteamASFOptions } from './types';

export * from './types';
export { createGMHttpClient } from './adapters/gmHttp';
export type { GMRawResponse, GMRequest, GMRequestOptions } from './adapters/gmHttp';
export { createGMStorage } from './adapters/gmStorage';

/** ASF IPC client. Constructor configures only; init() performs the !stats probe. */
export class SteamASF {
  private readonly ctx: Context;
  constructor(options: SteamASFOptions) {
    this.ctx = new Context(options);
  }
  on(event: 'status', listener: StatusListener): () => void {
    if (event !== 'status') {
      throw new Error('Unknown event');
    }
    return this.ctx.events.on(listener);
  }
  init(): Promise<boolean> {
    return initialize(this.ctx);
  }
  joinGroup(groupName: string): Promise<boolean> {
    return joinGroup(this.ctx, groupName);
  }
  leaveGroup(groupName: string): Promise<boolean> {
    return leaveGroup(this.ctx, groupName);
  }
  // Keep the original aliases: ASF's JOINGROUP/GROUPLIST handle these targets.
  joinOfficialGroup = this.joinGroup;
  leaveOfficialGroup = this.leaveGroup;
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
  doCurator(curatorId: string): Promise<boolean> {
    return doCurator(this.ctx, curatorId);
  }
  undoCurator(curatorId: string): Promise<boolean> {
    return undoCurator(this.ctx, curatorId);
  }
  addLicense(id: string): Promise<boolean> {
    return addLicense(this.ctx, id);
  }
  requestPlayTestAccess(id: string): Promise<boolean> {
    return requestPlayTestAccess(this.ctx, id);
  }
  playGames(ids: string): Promise<boolean> {
    return playGames(this.ctx, ids);
  }
  stopPlayGames(): Promise<boolean> {
    return stopPlayGames(this.ctx);
  }
  getSteamIdASF(): Promise<string> {
    return getSteamIdASF(this.ctx);
  }
  getSteamIdWeb(): Promise<string> {
    return getSteamIdWeb(this.ctx);
  }
  getSteamId(): Promise<string> {
    return getSteamId(this.ctx);
  }
  checkPlayStatus(ids: string): Promise<'skip' | boolean> {
    return checkPlayStatus(this.ctx, ids);
  }
  doForum(): Promise<boolean> {
    return unsupported(this.ctx, 'doForum');
  }
  undoForum(): Promise<boolean> {
    return unsupported(this.ctx, 'undoForum');
  }
  doFavoriteWorkshop(): Promise<boolean> {
    return unsupported(this.ctx, 'doFavoriteWorkshop');
  }
  undoFavoriteWorkshop(): Promise<boolean> {
    return unsupported(this.ctx, 'undoFavoriteWorkshop');
  }
  voteUpWorkshop(): Promise<boolean> {
    return unsupported(this.ctx, 'voteUpWorkshop');
  }
  likeAnnouncement(): Promise<boolean> {
    return unsupported(this.ctx, 'likeAnnouncement');
  }
  /** Does not stop games already running on ASF; call stopPlayGames() explicitly first if needed. */
  dispose(): void {
    this.ctx.state.disposed = true;
    this.ctx.events.clear();
  }
}

export default SteamASF;
