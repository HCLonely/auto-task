# Unified Website Tasks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace website-level `undoneTasks`, `socialTasks`, and conflicting site task arrays with one `WebsiteTask[]`, using `done`, `social`, `type`, and `link` as the common execution model.

**Architecture:** Add a small pure task-model module that normalizes old GM storage, deduplicates tasks, filters by action, and adapts flat tasks to the existing social-module payloads. Migrate `Website` and `History` to that module first, then migrate each site classifier without changing the public interfaces under `src/scripts/social/`. Read old storage formats but write only `WebsiteStoredTasks`.

**Tech Stack:** TypeScript 5.8, jQuery, Tampermonkey GM storage APIs, ESLint 9, Rollup 4.

---

## File Structure

- Create `src/scripts/website/taskModel.ts`: pure normalization, deduplication, action filtering, storage conversion, and social payload adaptation.
- Modify `src/types/Website.d.ts`: common task/storage/payload types and legacy storage input types.
- Modify `src/scripts/website/Website.ts`: execute one flat task array and adapt it to current social modules.
- Modify `src/scripts/website/History.ts`: render normalized flat tasks from either storage format.
- Modify `src/scripts/website/Freeanywhere.ts`: flat task classification plus separate verification queue.
- Modify `src/scripts/website/FreeRu.ts`: flat extra-link tasks.
- Modify `src/scripts/website/GiveawayHopper.ts`: separate API tasks from executable tasks.
- Modify `src/scripts/website/Giveawaysu.ts`: flat classification for GiveawaySu.
- Modify `src/scripts/website/GiveeClub.ts`: flat classification for GiveeClub.
- Modify `src/scripts/website/Givekey.ts`: flat classification plus separate verification IDs.
- Modify `src/scripts/website/Gleam.ts`: flat classification including extra Gleam and playtime data.
- Modify `src/scripts/website/Keyhub.ts`: flat social, video, and visit tasks.
- Modify `src/scripts/website/Keylol.ts`: build flat tasks directly from selected controls.
- Modify `src/scripts/website/Opquests.ts`: flat, do-only tasks.
- Modify `src/scripts/website/Prys.ts`: flat tasks carrying current completion status.
- Modify the site declarations under `src/types/`: remove duplicate nested social task interfaces and retain only site/API-specific data.
- Do not modify `src/scripts/social/` in this migration.

## Working Tree Constraint

`src/scripts/website/Freeanywhere.ts` and `src/scripts/website/GFF_API.d.ts` already contain user changes. Before and after every task touching `Freeanywhere.ts`, inspect:

```powershell
git diff -- src/scripts/website/Freeanywhere.ts src/scripts/website/GFF_API.d.ts
```

The migration must preserve:

```ts
// import type { GamesForFarmApi } from './GFF_API';
```

and:

```ts
// #ExtAPI!: GamesForFarmApi;
```

Do not modify or stage `src/scripts/website/GFF_API.d.ts`. When committing the Freeanywhere migration, stage only migration hunks and verify the staged diff does not contain the pre-existing API-comment changes.

### Task 1: Define the Common Task Model

**Files:**
- Create: `src/scripts/website/taskModel.ts`
- Modify: `src/types/Website.d.ts`

- [ ] **Step 1: Replace the website task declarations with flat task types**

Add these types to `src/types/Website.d.ts`, replacing `webSocialTasks` as the website-level storage model while retaining existing social payload declarations:

```ts
declare interface WebsiteTask {
  done: boolean
  social: string
  type: string
  link: string
  id?: string | number
  title?: string
  data?: string
  minutes?: number
  [key: string]: unknown
}

declare interface WebsiteStoredTasks {
  tasks: Array<WebsiteTask>
  time: number
}

declare interface LegacyWebsiteTasks {
  [social: string]: Array<string> | {
    [type: string]: Array<string>
  }
}

declare type WebsiteStoredTasksInput = WebsiteStoredTasks | {
  tasks: LegacyWebsiteTasks
  time: number
}

declare interface WebsiteSocialPayload {
  discord?: discordWebTasks
  instagram?: instagramWebTasks
  twitch?: twitchWebTasks
  twitter?: twitterWebTasks
  vk?: vkWebTasks
  youtube?: youtubeWebTasks
  reddit?: redditWebTasks
  steam?: steamWebTasks & {
    playTimeLinks?: Array<string>
    playtestLinks?: Array<string>
  }
  links?: Array<string>
  extra?: Record<string, Array<WebsiteTask>>
}
```

Also add `playTimeLinks` and `playtestLinks` to `steamWebTasks`.

- [ ] **Step 2: Run type checking to record the expected migration failure**

Run:

```powershell
npm run tsc
```

Expected: FAIL because `Website.ts` and site classes still declare or pass `webSocialTasks`, proving the old model remains wired in.

- [ ] **Step 3: Implement the pure task helpers**

Create `src/scripts/website/taskModel.ts` with these exports:

```ts
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
  'youtube.like': 'likeLinks'
};

const isWebsiteTask = (value: unknown): value is WebsiteTask => {
  if (!value || typeof value !== 'object') return false;
  const task = value as Partial<WebsiteTask>;
  return typeof task.done === 'boolean' &&
    typeof task.social === 'string' &&
    typeof task.type === 'string' &&
    typeof task.link === 'string';
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

const getTaskKey = (task: WebsiteTask): string => [
  task.done,
  task.social,
  task.type,
  task.link,
  task.minutes ?? '',
  task.id ?? '',
  task.data ?? ''
].join('|');

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

const toSocialPayload = (tasks: Array<WebsiteTask>): WebsiteSocialPayload => {
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
    if (!payloadType) continue;
    const socialPayload = (
      payload as Record<string, Record<string, Array<string>>>
    )[task.social] ||= {};
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
```

- [ ] **Step 4: Lint the new helper**

Run:

```powershell
npx eslint src/scripts/website/taskModel.ts
```

Expected: PASS.

- [ ] **Step 5: Commit the common model**

```powershell
git add src/types/Website.d.ts src/scripts/website/taskModel.ts
git commit -m "refactor: add unified website task model"
```

### Task 2: Migrate the Website Base Class

**Files:**
- Modify: `src/scripts/website/Website.ts`

- [ ] **Step 1: Replace the base task properties**

Import the helpers:

```ts
import {
  selectTasksForAction,
  toSocialPayload,
  uniqueWebsiteTasks
} from './taskModel';
```

Replace:

```ts
undoneTasks!: webSocialTasks;
socialTasks!: webSocialTasks;
```

with:

```ts
tasks: Array<WebsiteTask> = [];
```

- [ ] **Step 2: Change `initSocial` to receive selected flat tasks**

Use:

```ts
protected async initSocial(tasks: Array<WebsiteTask>): Promise<boolean> {
  const payload = toSocialPayload(tasks);
```

Replace all reads of the old local `tasks` object with `payload`. Initialize `visitLink` when `payload.links` has entries. Keep the existing Steam store/community split, but calculate it from `payload.steam`.

- [ ] **Step 3: Replace `uniqueTasks`**

Use:

```ts
protected uniqueTasks(tasks: Array<WebsiteTask>): Array<WebsiteTask> {
  try {
    return uniqueWebsiteTasks(tasks);
  } catch (error) {
    throwError(error as Error, 'Website.uniqueTasks');
    return tasks;
  }
}
```

- [ ] **Step 4: Rewrite `toggleTask` around one selected task list**

After classification:

```ts
const selectedTasks = selectTasksForAction(this.tasks, action);
const payload = toSocialPayload(selectedTasks);
await this.initSocial(selectedTasks);
const doTask = action === 'do';
```

Call the existing social modules with `payload.reddit`, `payload.twitch`, `payload.twitter`, `payload.vk`, `payload.youtube`, and `payload.steam`.

Execute generic visit tasks from `payload.links`.

Execute extras only for `do`:

```ts
if (doTask && payload.extra && this.extraDoTask) {
  pro.push(this.extraDoTask(payload.extra));
}
```

Add the optional abstract-compatible member declaration:

```ts
extraDoTask?(tasks: Record<string, Array<WebsiteTask>>): Promise<boolean>;
```

- [ ] **Step 5: Verify expected site-level type failures**

Run:

```powershell
npm run tsc
```

Expected: FAIL only in site modules and declarations still using `undoneTasks`, `socialTasks`, or old `extraDoTask` signatures. `Website.ts` itself should no longer report task-model errors.

- [ ] **Step 6: Lint and commit**

Run:

```powershell
npx eslint src/scripts/website/Website.ts
```

Expected: PASS.

```powershell
git add src/scripts/website/Website.ts
git commit -m "refactor: execute flat website tasks"
```

### Task 3: Migrate Stored History

**Files:**
- Modify: `src/scripts/website/History.ts`

- [ ] **Step 1: Normalize stored data on read**

Import:

```ts
import { normalizeStoredTasks } from './taskModel';
```

Replace the union of site GM types with:

```ts
type TasksData = WebsiteStoredTasksInput;
```

In `#addItem`, normalize before rendering:

```ts
const tasks = normalizeStoredTasks(tasksData);
if (tasks.length === 0) return;
const html = this.#generateTaskHtml(tasks);
```

- [ ] **Step 2: Render flat tasks safely**

Change the method signature:

```ts
#generateTaskHtml(tasks: Array<WebsiteTask>): string
```

Render each task using:

```ts
const label = `${task.social}.${__(task.type)}`;
const displayTask = task.link.length > 55 ?
  `${task.link.slice(0, 55)}...` :
  task.link;
const isLink = /^https?:\/\//.test(task.link);
html += `<li>
  <font class="auto-task-capitalize">${label}: </font>
  ${isLink ?
    `<a href="${task.link}" target="_blank">${displayTask}</a>` :
    `<span>${displayTask}</span>`}
</li>`;
```

- [ ] **Step 3: Verify History independently**

Run:

```powershell
npx eslint src/scripts/website/History.ts
npm run tsc
```

Expected: ESLint PASS. TypeScript still fails only for unmigrated site modules.

- [ ] **Step 4: Commit**

```powershell
git add src/scripts/website/History.ts
git commit -m "refactor: render unified task history"
```

### Task 4: Migrate FreeRu and Opquests

**Files:**
- Modify: `src/scripts/website/FreeRu.ts`
- Modify: `src/scripts/website/Opquests.ts`
- Modify: `src/types/FreeRu.d.ts`
- Modify: `src/types/Opquests.d.ts`

- [ ] **Step 1: Migrate FreeRu**

Remove its default nested task template and both old task properties. At the start of `classifyTask`, reset:

```ts
this.tasks = [];
```

For each task link:

```ts
const link = elem.getAttribute('href');
if (!link) return;
this.tasks.push({
  done: false,
  social: 'extra',
  type: 'visit',
  link
});
```

Deduplicate with:

```ts
this.tasks = this.uniqueTasks(this.tasks);
```

Replace `extraDoTask` with:

```ts
async extraDoTask(tasks: Record<string, Array<WebsiteTask>>): Promise<boolean> {
  const visitTasks = tasks.visit || [];
  return Promise.all(visitTasks.map((task) => visitLink(task.link)))
    .then((results) => results.every(Boolean));
}
```

Remove `fruSocialTasks` from `src/types/FreeRu.d.ts`.

- [ ] **Step 2: Migrate Opquests**

Remove `defaultTasks` and `undoneTasks`. Reset `this.tasks = []` after rejecting `undo`.

Replace each old push with:

```ts
this.tasks.push({
  done: false,
  social: 'steam',
  type: 'group',
  link
});
```

Use corresponding types `wishlist`, `follow`, `curatorLike`, `user`, `retweet`, and `server`. For playtime:

```ts
this.tasks.push({
  done: false,
  social: 'steam',
  type: 'playtime',
  link,
  minutes: time,
  title: taskDes
});
```

Finish with:

```ts
this.tasks = this.uniqueTasks(this.tasks);
```

Remove `oqSocialTasks` from `src/types/Opquests.d.ts`; retain `qpqTaskInfo`.

- [ ] **Step 3: Verify and commit**

Run:

```powershell
npx eslint src/scripts/website/FreeRu.ts src/scripts/website/Opquests.ts
npm run tsc
```

Expected: ESLint PASS. TypeScript failures no longer mention FreeRu or Opquests.

```powershell
git add src/scripts/website/FreeRu.ts src/scripts/website/Opquests.ts src/types/FreeRu.d.ts src/types/Opquests.d.ts
git commit -m "refactor: unify FreeRu and Opquests tasks"
```

### Task 5: Migrate Freeanywhere Without Overwriting User Changes

**Files:**
- Modify: `src/scripts/website/Freeanywhere.ts`
- Modify: `src/types/Freeanywhere.d.ts`

- [ ] **Step 1: Capture and inspect the existing user diff**

Run:

```powershell
git diff -- src/scripts/website/Freeanywhere.ts src/scripts/website/GFF_API.d.ts
```

Expected: the pre-existing commented `GamesForFarmApi` import/property and the separate `GFF_API.d.ts` edit are visible.

- [ ] **Step 2: Separate verification state**

Replace:

```ts
tasks: Array<fawTaskInfo> = [];
```

with:

```ts
verifyTasks: Array<fawTaskInfo> = [];
```

Update `verifyTask()` and `classifyTask('verify')` to use `verifyTasks`.

- [ ] **Step 3: Replace classification with flat tasks**

Remove the old default template and old task properties. For `undo`, load:

```ts
const stored = GM_getValue<WebsiteStoredTasksInput>(`fawTasks-${this.giveawayId}`);
this.tasks = normalizeStoredTasks(stored);
return this.tasks.length > 0;
```

For `do`, reset `this.tasks = []`, then map page task types:

```ts
const taskMap: Record<string, { social: string; type: string }> = {
  steam_game_sub: { social: 'steam', type: 'follow' },
  steam_game_wishlist: { social: 'steam', type: 'wishlist' },
  steam_group_sub: { social: 'steam', type: 'group' },
  steam_curator_sub: { social: 'steam', type: 'curator' },
  site_visit: { social: 'extra', type: 'website' },
  vk_community_sub: { social: 'vk', type: 'user' },
  vk_post_like: { social: 'vk', type: 'like' },
  youtube_channel_sub: { social: 'youtube', type: 'channel' },
  steam_game_playtime: { social: 'steam', type: 'playtime' }
};
```

Build each executable task with:

```ts
const mapped = taskMap[type];
if (!mapped) return;
const taskLink = type === 'site_visit' ? id :
  type === 'vk_post_like' ? `${link}&action=like` :
  link;
if (!taskLink) return;
this.tasks.push({
  done: isSuccess,
  social: mapped.social,
  type: mapped.type,
  link: taskLink,
  id,
  title,
  data,
  ...(type === 'steam_game_playtime' ? {
    minutes: Number(title.match(/(\d+)\s*min/)?.[1] || 0)
  } : {})
});
```

For action `do`, keep both completed and incomplete page tasks in memory but `Website` will select only `done: false`. For storage, write a cancelable copy of every recognized social task and exclude one-way `extra` tasks:

```ts
const storedTasks = this.tasks
  .filter((task) => task.social !== 'extra')
  .map((task) => ({ ...task, done: true }));
GM_setValue(`fawTasks-${this.giveawayId}`, {
  tasks: storedTasks,
  time: Date.now()
});
```

- [ ] **Step 4: Migrate extra task execution**

Use:

```ts
async extraDoTask(tasks: Record<string, Array<WebsiteTask>>): Promise<boolean> {
  const websiteTasks = tasks.website || [];
  const results = await Promise.all(
    websiteTasks.map((task) => this.#doVisitWebsite(String(task.id || task.link)))
  );
  return results.every(Boolean);
}
```

- [ ] **Step 5: Simplify declarations**

Remove `fawSocialTasks` and `fawGMTasks` from `src/types/Freeanywhere.d.ts`. Keep `fawTaskInfo`, `fawUserData`, and its unrelated API data. Change `fawUserData.tasks` to:

```ts
tasks?: Array<WebsiteTask>
```

- [ ] **Step 6: Verify user changes are preserved**

Run:

```powershell
git diff -- src/scripts/website/Freeanywhere.ts src/scripts/website/GFF_API.d.ts
npx eslint src/scripts/website/Freeanywhere.ts
npm run tsc
```

Expected: the original API-comment changes remain; `GFF_API.d.ts` is unchanged by this task; ESLint passes; TypeScript no longer reports Freeanywhere task-model errors.

- [ ] **Step 7: Commit only migration hunks**

Stage `src/types/Freeanywhere.d.ts` normally. Stage only the task-model hunks from `Freeanywhere.ts`; inspect:

```powershell
git diff --cached -- src/scripts/website/Freeanywhere.ts src/types/Freeanywhere.d.ts
```

Expected: no `GFF_API.d.ts` content and no unrelated API-comment-only hunk.

Commit:

```powershell
git commit -m "refactor: unify Freeanywhere tasks"
```

### Task 6: Migrate GiveawaySu and GiveeClub

**Files:**
- Modify: `src/scripts/website/Giveawaysu.ts`
- Modify: `src/scripts/website/GiveeClub.ts`
- Modify: `src/types/Giveawaysu.d.ts`

- [ ] **Step 1: Add a shared task construction helper to GiveawaySu**

Remove the nested default object and old task properties. Add:

```ts
protected addTask(
  social: string,
  type: string,
  link: string,
  options: Partial<WebsiteTask> = {}
): void {
  this.tasks.push({
    done: false,
    social,
    type,
    link,
    ...options
  });
}
```

Make the type classifier `protected` so `GiveeClub` can follow the same pattern without sharing nested state.

- [ ] **Step 2: Migrate GiveawaySu classification**

For `undo`, load normalized storage and return:

```ts
this.tasks = normalizeStoredTasks(
  GM_getValue<WebsiteStoredTasksInput>(`gasTasks-${this.giveawayId}`)
);
return this.tasks.length > 0;
```

For `do`, reset `this.tasks = []`. Replace old pushes with:

```ts
this.addTask('steam', 'group', taskLink, { title: taskName, icon: taskIcon });
```

Use types from the design: `announcement`, `curator`, `curatorLike`, `forum`, `workshopVote`, `playtest`, `wishlist`, `follow`, `server`, `channel`, `post`, `like`, and `user`.

After classification:

```ts
this.tasks = this.uniqueTasks(this.tasks);
GM_setValue(`gasTasks-${this.giveawayId}`, {
  tasks: this.tasks.map((task) => ({ ...task, done: true })),
  time: Date.now()
});
```

- [ ] **Step 3: Migrate GiveeClub classification**

For `undo`, normalize `gcTasks-*`. For `do`, reset `this.tasks = []`.

Create tasks with the same helper and carry:

```ts
{
  title: taskName,
  taskType,
  icon: taskIcon,
  appId
}
```

For playtime:

```ts
this.addTask('steam', 'playtime', taskLink, {
  title: taskName,
  taskType,
  minutes: Number(time)
});
```

Set each task's `done` from `taskFinished`; do not skip completed rows during classification. `Website` executes only incomplete tasks during `do`. Store all recognized social tasks as cancelable representations with `done: true`.

- [ ] **Step 4: Remove obsolete declarations**

Delete `gasSocialTasks` and `gasGMTasks` from `src/types/Giveawaysu.d.ts`. Keep `gasTaskInfo` only if still referenced; otherwise remove it.

- [ ] **Step 5: Verify and commit**

Run:

```powershell
npx eslint src/scripts/website/Giveawaysu.ts src/scripts/website/GiveeClub.ts
npm run tsc
```

Expected: no task-model errors for GiveawaySu or GiveeClub.

```powershell
git add src/scripts/website/Giveawaysu.ts src/scripts/website/GiveeClub.ts src/types/Giveawaysu.d.ts
git commit -m "refactor: unify GiveawaySu and GiveeClub tasks"
```

### Task 7: Migrate Givekey and Prys

**Files:**
- Modify: `src/scripts/website/Givekey.ts`
- Modify: `src/scripts/website/Prys.ts`
- Modify: `src/types/GiveKey.d.ts`
- Modify: `src/types/Prys.d.ts`

- [ ] **Step 1: Separate Givekey verification IDs**

Replace:

```ts
tasks: Array<string> = [];
```

with:

```ts
verifyTaskIds: Array<string> = [];
```

Update verification code accordingly.

- [ ] **Step 2: Migrate Givekey classification**

For `undo`, normalize stored data. For `do`, reset `this.tasks = []` and `verifyTaskIds = []`.

Change `#classifyTaskByType` to return or append:

```ts
this.tasks.push({
  done: isSuccess,
  social: 'steam',
  type: 'group',
  link: href,
  title: text,
  id: taskId
});
```

Use the approved mappings for VK, Steam, Twitter, and Discord. Store a `done: true` copy of recognized tasks:

Pass the task ID explicitly:

```ts
await this.#classifyTaskByType(
  href,
  text,
  icon,
  isSuccess,
  taskId
);
```

and change the helper signature to:

```ts
async #classifyTaskByType(
  href: string,
  text: string,
  icon: JQuery,
  isSuccess: boolean,
  taskId?: string
): Promise<void>
```

When `action === 'verify'`, populate only `verifyTaskIds` and skip executable task classification.

```ts
GM_setValue(`gkTasks-${this.giveawayId}`, {
  tasks: this.tasks.map((task) => ({ ...task, done: true })),
  time: Date.now()
});
```

- [ ] **Step 3: Migrate Prys**

For `undo`, normalize storage and return. For `do`, reset `this.tasks = []`.

For each page step, append tasks carrying current completion status:

```ts
this.tasks.push({
  done: isSuccess,
  social: 'steam',
  type: taskType,
  link: appLink
});
```

Use semantic `wishlist`, `follow`, `curator`, and `group`. Apply the same object form after resolving GID links.

Store all recognized cancelable tasks as `done: true`.

- [ ] **Step 4: Remove obsolete declarations**

Remove `gkSocialTasks`, `gkGMTasks`, `prysSocialTasks`, and `prysGMTasks`. Retain the global Prys functions.

- [ ] **Step 5: Verify and commit**

Run:

```powershell
npx eslint src/scripts/website/Givekey.ts src/scripts/website/Prys.ts
npm run tsc
```

Expected: no task-model errors for Givekey or Prys.

```powershell
git add src/scripts/website/Givekey.ts src/scripts/website/Prys.ts src/types/GiveKey.d.ts src/types/Prys.d.ts
git commit -m "refactor: unify Givekey and Prys tasks"
```

### Task 8: Migrate Gleam and Keyhub

**Files:**
- Modify: `src/scripts/website/Gleam.ts`
- Modify: `src/scripts/website/Keyhub.ts`
- Modify: `src/types/Gleam.d.ts`
- Modify: `src/types/Keyhub.d.ts`

- [ ] **Step 1: Migrate Gleam**

Remove its old default task structure and properties. Normalize storage on `undo`; reset `this.tasks` on `do`.

Append tasks with the current page completion state:

```ts
this.tasks.push({
  done: $task.find('i.fa-question').length === 0,
  social: 'twitter',
  type: 'user',
  link,
  title: taskText
});
```

Use approved mappings for Twitch, Discord, YouTube, Steam, and `extra/gleam`. For playtime include:

```ts
minutes: trueTime
```

Store recognized social tasks with `done: true`; exclude `extra/gleam` because it has no undo path.

Replace `extraDoTask` with:

```ts
async extraDoTask(tasks: Record<string, Array<WebsiteTask>>): Promise<boolean> {
  const gleamTasks = tasks.gleam || [];
  const results = await Promise.all(
    gleamTasks.map((task) => visitLink(task.link))
  );
  return results.every(Boolean);
}
```

- [ ] **Step 2: Migrate Keyhub**

Normalize storage on `undo`; reset `this.tasks` on `do`.

Append social tasks using `group`, `officialGroup`, `wishlist`, `curator`, and `server`.

Represent videos as:

```ts
this.tasks.push({
  done: false,
  social: 'extra',
  type: 'video',
  link,
  data: taskData,
  title: taskDes
});
```

Represent generic links as:

```ts
{
  done: false,
  social: 'links',
  type: 'visit',
  link
}
```

Change extra execution:

```ts
async extraDoTask(tasks: Record<string, Array<WebsiteTask>>): Promise<boolean> {
  const videoTasks = tasks.video || [];
  const results = await Promise.all(
    videoTasks.map((task) => this.#doScriptTask(String(task.data || '')))
  );
  return results.every(Boolean);
}
```

Reuse the existing `#doScriptTask` implementation; do not introduce a second video executor.

- [ ] **Step 3: Remove obsolete declarations**

Remove `gleamSocialTasks`, `gleamGMTasks`, `khSocialTasks`, and `khGMTasks`. Keep `vlootData` and `VerifyTasks`.

- [ ] **Step 4: Verify and commit**

Run:

```powershell
npx eslint src/scripts/website/Gleam.ts src/scripts/website/Keyhub.ts
npm run tsc
```

Expected: no task-model errors for Gleam or Keyhub.

```powershell
git add src/scripts/website/Gleam.ts src/scripts/website/Keyhub.ts src/types/Gleam.d.ts src/types/Keyhub.d.ts
git commit -m "refactor: unify Gleam and Keyhub tasks"
```

### Task 9: Migrate GiveawayHopper

**Files:**
- Modify: `src/scripts/website/GiveawayHopper.ts`
- Modify: `src/types/GiveawayHopper.d.ts`

- [ ] **Step 1: Separate API tasks from executable tasks**

Replace:

```ts
tasks: Array<giveawayHopperReturnTaskInfo> = [];
```

with:

```ts
rawTasks: Array<giveawayHopperReturnTaskInfo> = [];
```

Update verification and helper methods to use `rawTasks`.

- [ ] **Step 2: Build flat tasks from the API**

Normalize storage and return on `undo`. On `do`, set:

```ts
this.rawTasks = data.response.tasks;
this.tasks = [];
```

For Steam JoinGroup:

```ts
this.tasks.push({
  done: task.isDone,
  social: 'steam',
  type: 'group',
  link: steamGroupLink,
  id: task.id,
  title: task.displayName || task.name,
  category: task.category,
  sourceType: task.type,
  hash: task.hash,
  groupId: task.group_id
});
```

For Discord JoinServer, use `social: 'discord'`, `type: 'server'`, and retain `inviteCode`.

Store recognized social tasks with `done: true`; exclude `extra/video` and generic visit tasks because they have no undo path.

- [ ] **Step 3: Remove obsolete declarations**

Remove `giveawayHopperSocialTasks` and `giveawayHopperGMTasks`. Keep `giveawayHopperReturnTaskInfo`; add optional API fields actually used by implementation if they are absent:

```ts
group_id?: string | number
invite_code?: string
```

Remove `giveawayHopperTaskInfo` if unused.

- [ ] **Step 4: Verify and commit**

Run:

```powershell
npx eslint src/scripts/website/GiveawayHopper.ts
npm run tsc
```

Expected: no task-model errors for GiveawayHopper.

```powershell
git add src/scripts/website/GiveawayHopper.ts src/types/GiveawayHopper.d.ts
git commit -m "refactor: unify GiveawayHopper tasks"
```

### Task 10: Migrate Keylol

**Files:**
- Modify: `src/scripts/website/Keylol.ts`
- Modify: `src/types/Keylol.d.ts`

- [ ] **Step 1: Replace button task types with semantic values**

Update each `#addBtn` call to use semantic types:

```ts
this.#addBtn($link[0], 'twitter', 'retweet', href);
this.#addBtn($link[0], 'steam', 'wishlist', href);
this.#addBtn($link[0], 'youtube', 'channel', href);
```

Apply the complete common mapping from Task 1 and remove `Links` suffixes.

- [ ] **Step 2: Replace classification**

Remove the nested default task object, `SocialPlatform`, and `TaskLinks`.

Use:

```ts
classifyTask(action: TaskAction): boolean {
  try {
    this.tasks = [];
    const selectedBtns = $('.auto-task-keylol[selected="selected"]:visible').get() as TaskButton[];
    for (const btn of selectedBtns) {
      const social = btn.getAttribute('data-social');
      const type = btn.getAttribute('data-type');
      const link = btn.getAttribute('data-link');
      if (!(social && type && link)) continue;
      this.tasks.push({
        done: action === 'undo',
        social,
        type,
        link
      });
    }
    this.tasks = this.uniqueTasks(this.tasks);
    return true;
  } catch (error) {
    throwError(error as Error, 'Keylol.classifyTask');
    return false;
  }
}
```

Change `TaskButton.getAttribute('data-social')` to return `string | null`.

- [ ] **Step 3: Remove obsolete declaration**

Delete `keylolSocialTasks` from `src/types/Keylol.d.ts`. If the file becomes empty except its header, delete the file.

- [ ] **Step 4: Verify and commit**

Run:

```powershell
npx eslint src/scripts/website/Keylol.ts
npm run tsc
```

Expected: TypeScript now passes unless a missed old task type remains elsewhere.

```powershell
git add src/scripts/website/Keylol.ts src/types/Keylol.d.ts
git commit -m "refactor: unify Keylol tasks"
```

### Task 11: Remove Remaining Legacy Types and References

**Files:**
- Modify: `src/types/Website.d.ts`
- Modify or delete: site declaration files under `src/types/`
- Modify: any website file still found by the scans below

- [ ] **Step 1: Scan for old properties and types**

Run:

```powershell
rg -n "undoneTasks|socialTasks|webSocialTasks|[A-Za-z]+SocialTasks|[A-Za-z]+GMTasks" src/scripts/website src/types
```

Expected: no executable references. Only intentional historical comments are allowed; update those comments to describe `tasks`.

- [ ] **Step 2: Scan for legacy semantic suffixes in task creation**

Run:

```powershell
rg -n "data-type=['\\\"][^'\\\"]*Links|type:\\s*['\\\"][A-Za-z]+Links|\\.tasks\\.[A-Za-z]+\\.[A-Za-z]+Links" src/scripts/website
```

Expected: no matches.

- [ ] **Step 3: Check storage writes**

Run:

```powershell
rg -n "GM_setValue\\([^\\n]+Tasks-|tasks:\\s*this\\.(socialTasks|undoneTasks)" src/scripts/website
```

Expected: every history write uses `{ tasks: WebsiteTask[], time }`; no old property writes remain.

- [ ] **Step 4: Run the complete static verification**

Run:

```powershell
npm run lint
npm run tsc
```

Expected: both PASS.

- [ ] **Step 5: Commit cleanup**

```powershell
git add src/types src/scripts/website
git diff --cached --check
git commit -m "refactor: remove legacy website task types"
```

Before committing, inspect the staged diff and ensure `src/scripts/website/GFF_API.d.ts` is not staged.

### Task 12: Build and Regression Verification

**Files:**
- Verify only; modify the smallest relevant file if a failure reveals a migration defect.

- [ ] **Step 1: Run Rollup**

Run:

```powershell
npm run rollup
```

Expected: PASS and bundles generated without unresolved task-model imports.

- [ ] **Step 2: Run the project test command**

Run:

```powershell
npm test
```

Expected: PASS.

- [ ] **Step 3: Verify task action semantics by inspection**

Run:

```powershell
rg -n "selectTasksForAction|action === 'do' \\? !task.done : task.done|done:\\s*(true|false|isSuccess|task\\.isDone)" src/scripts/website
```

Expected:

- `Website` selects `done: false` for `do`.
- `Website` selects `done: true` for `undo`.
- Each migrated site explicitly derives or assigns `done`.

- [ ] **Step 4: Verify all required sites use the unified property**

Run:

```powershell
rg -n "this\\.tasks" src/scripts/website/Freeanywhere.ts src/scripts/website/FreeRu.ts src/scripts/website/GiveawayHopper.ts src/scripts/website/Giveawaysu.ts src/scripts/website/GiveeClub.ts src/scripts/website/Givekey.ts src/scripts/website/Gleam.ts src/scripts/website/Keyhub.ts src/scripts/website/Keylol.ts src/scripts/website/Opquests.ts src/scripts/website/Prys.ts
```

Expected: every listed site has task creation, normalization, or execution references through `this.tasks`; verification-only arrays use `verifyTasks`, `verifyTaskIds`, or `rawTasks`.

- [ ] **Step 5: Verify the dirty user files are preserved**

Run:

```powershell
git status --short
git diff -- src/scripts/website/GFF_API.d.ts
git diff HEAD -- src/scripts/website/Freeanywhere.ts
```

Expected:

- The pre-existing `GFF_API.d.ts` edit remains uncommitted unless the user handled it separately.
- The pre-existing Freeanywhere API-comment changes remain present.
- No unrelated files are modified.

- [ ] **Step 6: Commit any verification fixes**

If verification required code fixes:

1. Re-run the explicit `git add` command from the task that owns each corrected file.
2. Run `git diff --cached --check`.
3. Run `git diff --cached --name-only` and confirm `src/scripts/website/GFF_API.d.ts` is absent.
4. Commit with `git commit -m "fix: complete website task migration"`.

If no fixes were required, do not create an empty commit.

## Final Acceptance Criteria

- Every affected website class has exactly one executable `tasks: WebsiteTask[]` inherited from `Website`.
- Verification/API arrays have distinct names and do not shadow `tasks`.
- `done`, `social`, `type`, and `link` exist on every executable task.
- Site-specific attributes remain available where required.
- `do` and `undo` select tasks exclusively through `done`.
- Old GM task objects are readable; all new writes use flat arrays.
- `History` displays old and new records.
- Existing social modules receive their unchanged payload shape.
- The user's pre-existing `Freeanywhere.ts` and `GFF_API.d.ts` work is preserved.
- `npm run lint`, `npm run tsc`, `npm run rollup`, and `npm test` pass.
