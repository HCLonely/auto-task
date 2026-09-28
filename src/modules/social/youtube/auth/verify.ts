import type { Context } from '../context';
import { doChannel } from '../features/channels';
import { normalizeYoutubeLink } from '../utils/links';

/** Preserves the original verification-by-subscription behavior. */
export async function verifyAuth(ctx: Context): Promise<boolean> {
  return ctx.run('auth.verify', undefined, false, async (ctx) => {
    const configured = ctx.options.verifyChannel;
    const link = normalizeYoutubeLink(configured.startsWith('https://') ? configured : `https://www.youtube.com/channel/${configured}`);
    if (!link || !configured || (!configured.startsWith('https://') && !/^[\w-]+$/.test(configured))) {
      return ctx.fail('INVALID_VERIFY_CHANNEL');
    }
    ctx.progress('VERIFY_BY_SUBSCRIPTION');
    return doChannel(ctx, {
      link,
      verify: true
    });
  });
}
