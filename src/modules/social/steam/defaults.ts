import type { ASFOptions, SteamTasks, TaskFlags, TaskType } from './types';

export const taskTypes: TaskType[] = ['groups', 'officialGroups', 'wishlists', 'follows', 'forums', 'workshops',
  'workshopVotes', 'curators', 'curatorLikes', 'announcements', 'licenses', 'playtests', 'playTime'];
export function createTasks(value?: Partial<SteamTasks>): SteamTasks {
  return Object.fromEntries(taskTypes.map((key) => {
    return [key, [...new Set(Array.isArray(value?.[key]) ? value[key].filter((item) => {
      return typeof item === 'string';
    }) : [])]];
  })) as SteamTasks;
}
export const doDefaults: TaskFlags = {
  groups: true,
  officialGroups: true,
  wishlists: true,
  follows: true,
  forums: true,
  workshops: true,
  workshopVotes: true,
  curators: true,
  announcements: true,
  licenses: true,
  playtests: true,
  playTime: true
};
export const undoDefaults: TaskFlags = {
  ...doDefaults,
  workshopVotes: false,
  announcements: false,
  licenses: false,
  playtests: false
};
export const asfDefaults: ASFOptions = {
  AsfEnabled: false,
  AsfIpcUrl: '',
  AsfIpcPassword: '',
  AsfBotname: 'asf',
  steamWeb: false,
  preferASF: false,
  steamWebApiKey: ''
};
