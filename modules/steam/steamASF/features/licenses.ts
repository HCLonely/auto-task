import { containsId, matchesReply, validIds } from '../commands';
import { Context, OperationError } from '../context';

export function addLicense(ctx: Context, id: string): Promise<boolean> {
  return ctx.run('licenses.add', id, false, async (child) => {
    const match = /^(appid|subid)-(\d+(?:,\d+)*)$/.exec(id);
    if (!match || !validIds(match[2])) throw new OperationError('INVALID_ARGUMENT');
    const [, type, values] = match;
    const ids = [...new Set(values.split(','))];
    const prefix = type === 'appid' ? 'app' : 'sub';
    const reply = await child.command(`!addlicense ${child.bot} ${ids.map((value) => `${prefix}/${value}`).join(',')}`);
    const lines = reply.split('\n').filter((line) => line.trim());
    const words = type === 'appid' ? ['AlreadyPurchased', 'OK'] : ['成功', 'Success', 'Успех', 'AlreadyPurchased', 'OK'];
    let allSucceeded = true;
    for (const value of ids) {
      const candidates = lines.filter((line) => containsId(line, value));
      // Preserve the original single-app reply format, which may not echo the ID.
      if (!candidates.length && ids.length === 1 && type === 'appid') candidates.push(...lines);
      const ok = candidates.length > 0 && candidates.every((line) => matchesReply(line, words));
      child.progress(ok ? 'LICENSE_ADDED' : 'LICENSE_FAILED', { id: value }, ok ? 'info' : 'error');
      allSucceeded &&= ok;
    }
    return allSucceeded;
  });
}
