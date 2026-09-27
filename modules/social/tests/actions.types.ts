import type { Steam, Vk, Twitch, Twitter, Reddit, Youtube, SocialManager } from '../../index';

/** Compile-only migration contract; this function is never executed. */
export function checkActions(steam: Steam, vk: Vk, twitch: Twitch, twitter: Twitter, reddit: Reddit, youtube: Youtube,
  manager: SocialManager<{ steam: Steam; vk: Vk }>): void {
  void steam.do({ wishlistLinks: [] });
  void steam.undo({ wishlistLinks: [] });
  void vk.do({ nameLinks: [] });
  void vk.undo({ nameLinks: [] });
  void twitch.do({ channelLinks: [] });
  void twitch.undo({ channelLinks: [] });
  void twitter.do({ retweetLinks: [] });
  void twitter.undo({ retweetLinks: [] });
  void reddit.do({ redditLinks: [] });
  void reddit.undo({ redditLinks: [] });
  void youtube.do({ channelLinks: [] });
  void youtube.undo({ channelLinks: [] });
  void manager.doAll({ steam: { wishlistLinks: [] } });
  void manager.undoAll({ vk: { nameLinks: [] } });
  // @ts-expect-error The direction switch is no longer a public call option.
  void steam.do({ doTask: false });
  // @ts-expect-error The direction switch is no longer a public call option.
  void vk.undo({ doTask: true });
  // @ts-expect-error The direction switch is no longer a public call option.
  void twitch.do({ doTask: false });
  // @ts-expect-error The direction switch is no longer a public call option.
  void twitter.undo({ doTask: true });
  // @ts-expect-error The direction switch is no longer a public call option.
  void reddit.do({ doTask: false });
  // @ts-expect-error The direction switch is no longer a public call option.
  void youtube.undo({ doTask: true });
  // @ts-expect-error Removed API has no compatibility alias.
  void steam.toggle({});
  // @ts-expect-error Removed API has no compatibility alias.
  void manager.toggleAll({});
  // @ts-expect-error Preserve platform-specific target types.
  void manager.undo('vk', { wishlistLinks: [] });
}
