const LEGACY_TYPE_MAP: Record<string, string> = {
  groupLinks: 'group',
  officialGroupLinks: 'officialGroup',
  wishlistLinks: 'wishlist',
  followLinks: 'follow',
  forumLinks: 'forum',
  workshopLinks: 'workshop',
  workshopVoteLinks: 'workshopVote',
  curatorLinks: 'curator',
  curatorLikeLinks: 'curatorLike',
  announcementLinks: 'announcement',
  licenseLinks: 'license',
  playTimeLinks: 'playtime',
  playtestLinks: 'playtest',
  serverLinks: 'server',
  redditLinks: 'post',
  channelLinks: 'channel',
  userLinks: 'user',
  retweetLinks: 'retweet',
  likeLinks: 'like',
  nameLinks: 'user',
  website: 'website',
  visitLink: 'visit',
  videoTasks: 'video',
  gleam: 'gleam',
  giveawayHopper: 'giveawayHopper'
};

const SOCIAL_PAYLOAD_TYPE_MAP: Record<string, string> = {
  'steam.group': 'groupLinks',
  'steam.officialGroup': 'officialGroupLinks',
  'steam.wishlist': 'wishlistLinks',
  'steam.follow': 'followLinks',
  'steam.forum': 'forumLinks',
  'steam.workshop': 'workshopLinks',
  'steam.workshopVote': 'workshopVoteLinks',
  'steam.curator': 'curatorLinks',
  'steam.curatorLike': 'curatorLikeLinks',
  'steam.announcement': 'announcementLinks',
  'steam.license': 'licenseLinks',
  'steam.playtime': 'playTimeLinks',
  'steam.playtest': 'playtestLinks',
  'discord.server': 'serverLinks',
  'reddit.post': 'redditLinks',
  'twitch.channel': 'channelLinks',
  'twitter.user': 'userLinks',
  'twitter.retweet': 'retweetLinks',
  'twitter.like': 'likeLinks',
  'vk.user': 'nameLinks',
  'vk.like': 'nameLinks',
  'youtube.channel': 'channelLinks',
  'youtube.like': 'videoLinks'
};

const isWebsiteTask = (value: unknown): value is WebsiteTask => {
  if (!value || typeof value !== 'object') return false;
  const task = value as Partial<WebsiteTask>;
  return typeof task.done === 'boolean' &&
    typeof task.social === 'string' &&
    typeof task.type === 'string' &&
    typeof task.link === 'string' &&
    (!('minutes' in task) || typeof task.minutes === 'number') &&
    (!('id' in task) || typeof task.id === 'string' || typeof task.id === 'number') &&
    (!('title' in task) || typeof task.title === 'string') &&
    (!('data' in task) || typeof task.data === 'string');
};

const normalizePlaytimeTask = (
  social: string,
  type: string,
  value: string,
  done: boolean
): WebsiteTask => {
  if (social !== 'steam' || type !== 'playtime') {
    return { done, social, type, link: value };
  }
  const match = value.match(/^(\d+(?:\.\d+)?)-(https?:\/\/.+)$/);
  if (!match) return { done, social, type, link: value };
  return {
    done,
    social,
    type,
    link: match[2],
    minutes: Number(match[1])
  };
};

const normalizeLegacyTasks = (
  tasks: LegacyWebsiteTasks,
  done = true
): Array<WebsiteTask> => {
  const result: Array<WebsiteTask> = [];
  for (const [social, legacyTypes] of Object.entries(tasks)) {
    if (Array.isArray(legacyTypes)) {
      for (const link of legacyTypes) {
        result.push({
          done,
          social: social === 'links' ? 'links' : 'extra',
          type: social === 'links' ? 'visit' : social,
          link
        });
      }
      continue;
    }
    for (const [legacyType, links] of Object.entries(legacyTypes)) {
      const type = LEGACY_TYPE_MAP[legacyType] || legacyType.replace(/Links$/, '');
      for (const link of links) {
        result.push(normalizePlaytimeTask(social, type, link, done));
      }
    }
  }
  return result;
};

const normalizeStoredTasks = (
  value?: WebsiteStoredTasksInput | null
): Array<WebsiteTask> => {
  if (!value?.tasks) return [];
  if (Array.isArray(value.tasks)) {
    return value.tasks.filter(isWebsiteTask);
  }
  return normalizeLegacyTasks(value.tasks, true);
};

const getTaskKey = (task: WebsiteTask): string => JSON.stringify([
  task.done,
  task.social,
  task.type,
  task.link,
  task.minutes ?? null,
  task.id ?? null,
  task.data ?? null
]);

const uniqueWebsiteTasks = (tasks: Array<WebsiteTask>): Array<WebsiteTask> => {
  const seen = new Set<string>();
  return tasks.filter((task) => {
    const key = getTaskKey(task);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const selectTasksForAction = (
  tasks: Array<WebsiteTask>,
  action: 'do' | 'undo'
): Array<WebsiteTask> => tasks.filter((task) => (
  action === 'do' ? !task.done : task.done
));

const toSocialPayload = (
  tasks: Array<WebsiteTask>,
  onUnknownTask: (task: WebsiteTask) => void
): WebsiteSocialPayload => {
  const payload: WebsiteSocialPayload = {};
  for (const task of tasks) {
    if (task.social === 'extra') {
      payload.extra ||= {};
      payload.extra[task.type] ||= [];
      payload.extra[task.type].push(task);
      continue;
    }
    if (task.social === 'links') {
      payload.links ||= [];
      payload.links.push(task.link);
      continue;
    }
    const payloadType = SOCIAL_PAYLOAD_TYPE_MAP[`${task.social}.${task.type}`];
    if (!payloadType) {
      onUnknownTask(task);
      continue;
    }
    const socialPayloads = payload as Record<string, Record<string, Array<string>>>;
    socialPayloads[task.social] ||= {};
    const socialPayload = socialPayloads[task.social];
    socialPayload[payloadType] ||= [];
    const link = task.type === 'playtime' && task.minutes !== undefined ?
      `${task.minutes}-${task.link}` :
      task.link;
    socialPayload[payloadType].push(link);
  }
  return payload;
};

export {
  isWebsiteTask,
  normalizeLegacyTasks,
  normalizeStoredTasks,
  selectTasksForAction,
  toSocialPayload,
  uniqueWebsiteTasks
};
