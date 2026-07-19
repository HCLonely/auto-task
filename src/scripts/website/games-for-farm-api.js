// src/api/create-api.ts
function createGamesForFarmApi(storage, taskStore) {
  const queues = /* @__PURE__ */ new Map();
  const entity = (key) => ({
    get: () => storage.get(key, {}),
    async replace(value) {
      await storage.set(key, assertRecord(value, key));
    },
    async update(partial) {
      assertRecord(partial, key);
      const previous = queues.get(key) ?? Promise.resolve();
      const operation = previous.then(async () => {
        const current = await storage.get(key, {});
        await storage.set(key, { ...current, ...partial });
      });
      queues.set(key, operation.catch(() => void 0));
      await operation;
    }
  });
  const tasks = {
    get: () => storage.get("tasks", []),
    async add(type, data) {
      await taskStore.update(validateType(type), validateData(data), "add");
    },
    async remove(type, data) {
      await taskStore.update(validateType(type), validateData(data), "remove");
    },
    async update(type, data, action) {
      if (action !== "add" && action !== "remove") throw new TypeError("Invalid task action");
      await taskStore.update(validateType(type), validateData(data), action);
    }
  };
  return {
    tasks,
    user: entity("user"),
    games: entity("games"),
    settings: entity("settings"),
    discord: {
      get: () => storage.get("discord", []),
      async update(entries) {
        if (!Array.isArray(entries)) throw new TypeError("Discord entries must be an array");
        await storage.set("discord", entries);
      },
      clear: () => storage.remove("discord")
    },
    storage: {
      get: storage.get,
      set: storage.set,
      remove: storage.remove,
      getAll: storage.getAll,
      clear: storage.clear
    }
  };
}
function assertRecord(value, label) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${label} value must be an object`);
  }
  return value;
}
function validateType(type) {
  if (!type?.trim()) throw new TypeError("Task type is required");
  return type;
}
function validateData(data) {
  if (data === "" || data === null || data === void 0) throw new TypeError("Task data is required");
  return data;
}

// src/api/expose-api.ts
function exposeApi(api, target, logger = console) {
  if (!target) {
    logger.warn("GamesForFarm: unsafeWindow is unavailable; module API remains active");
    return;
  }
  Object.defineProperty(api, "__version", { value: "1.0.0", enumerable: false });
  Object.defineProperty(target, "GamesForFarm", { value: api, configurable: true, writable: false });
}

// src/routing.ts
function selectRoute(hostname, pathname) {
  if (typeof hostname !== "string") {
    return null;
  }
  switch (hostname.toLowerCase()) {
    case "freeanywhere.net":
    case "give.gamesforfarm.local":
    case "gamesforfarm-testing.ru":
      return "freeanywhere";
    case "store.steampowered.com":
    case "steamcommunity.com":
      return "steam";
    case "www.youtube.com":
    case "m.youtube.com":
      return "youtube";
    case "mee6.xyz":
      return "mee6";
    case "gamesforfarm.com":
      return pathname === "/" ? "gamesforfarm-store" : null;
    case "firstgamemarket.com":
      return pathname === "/" ? "firstgamemarket" : null;
    default:
      return null;
  }
}

// src/shared/request.ts
function createRequest(gm, baseUrl) {
  function request(options) {
    return new Promise((resolve, reject) => {
      for (const callbackName of ["onload", "onerror", "ontimeout", "onabort"]) {
        if (callbackName in options) {
          reject(new TypeError(
            `${callbackName} is not supported; request() is Promise-only`
          ));
          return;
        }
      }
      const method = (options.method ?? "GET").toUpperCase();
      const resolvedUrl = new URL(options.url, baseUrl);
      const transportOptions = {
        ...options,
        method,
        timeout: options.timeout ?? 2e4
      };
      if (method === "GET" && isPlainObject(options.data)) {
        for (const [key, value] of new URLSearchParams(options.data)) {
          resolvedUrl.searchParams.append(key, value);
        }
        delete transportOptions.data;
      }
      const url = resolvedUrl.toString();
      gm.GM_xmlhttpRequest({
        ...transportOptions,
        url,
        onload(response) {
          if (response.status < 200 || response.status >= 300) {
            const status = [response.status, response.statusText].filter((part) => part !== void 0 && part !== "").join(" ");
            const responseText = String(response.responseText ?? "");
            const excerpt = responseText.replace(/\s+/g, " ").trim().slice(0, 160);
            const detail = excerpt ? `: ${excerpt}` : "";
            reject(new Error(`${method} ${url} failed with ${status}${detail}`));
            return;
          }
          resolve(response.responseText);
        },
        onerror() {
          reject(new Error(`${method} ${url} request error`));
        },
        ontimeout() {
          reject(new Error(`${method} ${url} request timeout`));
        },
        onabort() {
          reject(new Error(`${method} ${url} request aborted`));
        }
      });
    });
  }
  function get(url) {
    return request({ method: "GET", url });
  }
  function postForm(url, data) {
    return request({
      method: "POST",
      url,
      data: new URLSearchParams(data).toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      }
    });
  }
  return {
    request,
    get,
    postForm
  };
}
function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

// src/shared/storage.ts
var ROOT_KEY = "GamesForFarmExt";
function cloneValue(value) {
  return value !== null && typeof value === "object" ? structuredClone(value) : value;
}
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function createStorage(gm) {
  const subscribers = /* @__PURE__ */ new Set();
  async function readContainer() {
    const stored = await gm.GM_getValue(ROOT_KEY, void 0);
    if (isRecord(stored)) return cloneValue(stored);
    return {};
  }
  async function writeContainer(container) {
    await gm.GM_setValue(ROOT_KEY, cloneValue(container));
  }
  async function notify(key, oldValue, newValue) {
    for (const listener of subscribers) {
      try {
        await listener({
          key,
          oldValue: cloneValue(oldValue),
          newValue: cloneValue(newValue)
        });
      } catch {
      }
    }
  }
  async function get(key, defaultValue) {
    const container = await readContainer();
    return cloneValue(
      Object.prototype.hasOwnProperty.call(container, key) ? container[key] : defaultValue
    );
  }
  async function getAll() {
    return cloneValue(await readContainer());
  }
  async function set(key, value) {
    const container = await readContainer();
    const oldValue = container[key];
    const newValue = cloneValue(value);
    container[key] = newValue;
    await writeContainer(container);
    await notify(key, oldValue, newValue);
  }
  async function setMany(values) {
    for (const [key, value] of Object.entries(values)) {
      await set(key, value);
    }
  }
  async function remove(key) {
    const container = await readContainer();
    const oldValue = container[key];
    delete container[key];
    await writeContainer(container);
    await notify(key, oldValue, void 0);
  }
  async function clear() {
    const container = await readContainer();
    const keys = Object.keys(container);
    await writeContainer({});
    for (const key of keys) {
      await notify(key, container[key], void 0);
    }
  }
  async function initialize() {
    const tasks = await get("tasks", void 0);
    if (!Array.isArray(tasks)) {
      await set("tasks", []);
    }
    for (const key of ["user", "games", "settings"]) {
      if (!isRecord(await get(key, void 0))) {
        await set(key, {});
      }
    }
    return getAll();
  }
  function subscribe(listener) {
    subscribers.add(listener);
    return () => subscribers.delete(listener);
  }
  return {
    get,
    getAll,
    set,
    setMany,
    remove,
    clear,
    initialize,
    subscribe
  };
}

// src/shared/utils.ts
var unixTime = () => Math.floor(Date.now() / 1e3);
var onWindowLoad = (callback) => {
  if (document.readyState === "complete") {
    callback();
  } else {
    window.addEventListener("load", callback, { once: true });
  }
};

// src/shared/tasks.ts
var isValidTask = (task) => Boolean(task?.type && task?.data);
function createTaskStore(storage, now = unixTime) {
  let queue = Promise.resolve();
  async function mutate(type, data, action) {
    const storedTasks = await storage.get("tasks", []);
    const tasks = Array.isArray(storedTasks) ? storedTasks : [];
    const match = (task) => String(task.type) === String(type) && String(task.data) === String(data);
    const found = tasks.some((task) => isValidTask(task) && match(task));
    if (action === "add" && found || action === "remove" && !found) {
      return;
    }
    const nextTasks = tasks.filter((task) => isValidTask(task) && !match(task));
    if (action === "add") {
      nextTasks.push({ type, data, time: now() });
    }
    await storage.set("tasks", nextTasks);
  }
  function update(type, data, action) {
    if (!type || !data || !["add", "remove"].includes(action)) {
      return Promise.resolve();
    }
    const operation = queue.then(() => mutate(type, data, action));
    queue = operation.catch(() => {
    });
    return operation;
  }
  return { update };
}

// src/sites/firstgamemarket.ts
async function initFirstGameMarket({ $, storage }) {
  const [settings, games] = await Promise.all([
    storage.get("settings", {}),
    storage.get("games", {})
  ]);
  $(".game-list li").each(function markOwned() {
    const $item = $(this);
    const match = String($item.find(".visual img").attr("src") ?? "").match(/\/apps\/(\d+)\//);
    const id = match ? Number.parseInt(match[1], 10) : null;
    if (id && games[id] && settings.hide_games === true) $item.css("opacity", ".2");
  });
}
var initFirstGameMarketListener = initFirstGameMarket;

// src/sites/freeanywhere.ts
var SYNC_DELAY_MS = 50;
var TASK_RESULT_DELAY_MS = 1250;
var GAME_REFRESH_SECONDS = 24 * 60 * 60;
var TASK_MAX_AGE_SECONDS = 2 * 60 * 60;
var activeInstances = /* @__PURE__ */ new WeakMap();
var initializationSequence = 0;
function detectPageUser($) {
  const $site = $(".games_for_farm_site").first();
  return compactUser({
    steam: $site.data("steam"),
    avatar: $site.data("avatar"),
    name: $site.data("name"),
    lang: $site.data("lang")
  });
}
async function initFreeAnywhere(context) {
  const {
    $,
    storage,
    request,
    alert: alert2,
    console: console2
  } = context;
  const schedule = context.setTimeout ?? globalThis.setTimeout;
  const cancel = context.clearTimeout ?? globalThis.clearTimeout;
  const now = context.now ?? (() => Math.floor(Date.now() / 1e3));
  const documentRef = context.document ?? globalThis.document;
  const eventNamespace = `.gamesForFarm${++initializationSequence}`;
  activeInstances.get(documentRef)?.dispose();
  const pageUser = detectPageUser($);
  let syncTimer;
  let disposed = false;
  let syncSuspended = true;
  let startupMutated = false;
  let trackSuspendedMutations = true;
  let unsubscribe = () => {
  };
  let attemptedInitialGameFetch = false;
  const resultTimers = /* @__PURE__ */ new Set();
  const instance = { dispose };
  activeInstances.set(documentRef, instance);
  const logError = (message, error) => {
    const logger = console2?.error ?? console2?.log;
    logger?.call(console2, message, error);
  };
  const normalizeStorage = (value) => {
    const source = isRecord2(value) ? value : {};
    return {
      ...source,
      // FIX: The extension initialized tasks as an object but consumed them as an array.
      tasks: Array.isArray(source.tasks) ? source.tasks : [],
      user: isRecord2(source.user) ? source.user : {},
      games: isRecord2(source.games) ? source.games : {},
      settings: isRecord2(source.settings) ? source.settings : {}
    };
  };
  const replaceStorage = async (nextStorage) => {
    const snapshot = await storage.getAll();
    try {
      await clearStorage(storage);
      await storage.setMany(normalizeStorage(nextStorage));
    } catch (error) {
      try {
        await clearStorage(storage);
        await storage.setMany(snapshot);
      } catch (rollbackError) {
        logError("GamesForFarm: storage rollback failed", rollbackError);
      }
      throw error;
    }
  };
  const parseResponse = (value, label) => {
    try {
      return JSON.parse(value);
    } catch (error) {
      logError(`GamesForFarm: invalid ${label} JSON`, error);
      return null;
    }
  };
  const fetchGames = async (steam) => {
    try {
      const response = await request.postForm(
        "/php/extension/user_games_get.php",
        { steam }
      );
      if (!response) return null;
      const games = parseResponse(response, "games");
      return isRecord2(games) ? games : null;
    } catch (error) {
      logError("GamesForFarm: game refresh failed", error);
      return null;
    }
  };
  const syncStorage = async () => {
    if (disposed) return;
    try {
      await request.postForm("/php/extension/user_data_update.php", {
        extension: JSON.stringify(await storage.getAll())
      });
    } catch (error) {
      logError("GamesForFarm: storage sync failed", error);
    }
  };
  const scheduleSync = () => {
    if (syncSuspended || disposed || syncTimer !== void 0) return;
    syncTimer = schedule(async () => {
      syncTimer = void 0;
      await syncStorage();
    }, SYNC_DELAY_MS);
  };
  unsubscribe = storage.subscribe(() => {
    if (disposed) return;
    if (syncSuspended) {
      if (trackSuspendedMutations) startupMutated = true;
      return;
    }
    scheduleSync();
  });
  function cancelPendingSync() {
    if (syncTimer === void 0) return;
    cancel(syncTimer);
    syncTimer = void 0;
  }
  function dispose() {
    if (disposed) return;
    disposed = true;
    unsubscribe();
    $(documentRef).off(eventNamespace);
    cancelPendingSync();
    for (const timerId of resultTimers) cancel(timerId);
    resultTimers.clear();
    if (activeInstances.get(documentRef) === instance) {
      activeInstances.delete(documentRef);
    }
  }
  const rawStorage = await storage.getAll();
  if (disposed) return instance.dispose;
  const initializedStorage = normalizeStorage(await storage.initialize());
  const needsFreshStorage = !hasInitialStorageShape(rawStorage);
  if (needsFreshStorage) {
    const freshStorage = {
      ...initializedStorage,
      tasks: [],
      user: compactUser(pageUser),
      games: {},
      settings: {}
    };
    await storage.setMany({
      tasks: freshStorage.tasks,
      user: freshStorage.user,
      games: freshStorage.games,
      settings: freshStorage.settings
    });
    if (pageUser.steam) {
      attemptedInitialGameFetch = true;
      const games = await fetchGames(pageUser.steam);
      if (games) {
        freshStorage.games = games;
        freshStorage.settings.game_update = now();
        await storage.setMany({
          games: freshStorage.games,
          settings: freshStorage.settings
        });
      }
    }
  }
  let currentStorage = normalizeStorage(await storage.getAll());
  let restoreSucceeded = false;
  const accountChanged = pageUser.steam && currentStorage.user.steam && String(currentStorage.user.steam) !== String(pageUser.steam);
  if (accountChanged) {
    const mutatedBeforeRestore = startupMutated;
    try {
      const response = await request.postForm(
        "/php/extension/user_data_get.php",
        { steam: pageUser.steam }
      );
      if (response) {
        const restored = parseResponse(response, "user data");
        if (isRecord2(restored)) {
          const normalized = normalizeStorage(restored);
          normalized.user = {
            ...normalized.user,
            ...compactUser(pageUser)
          };
          trackSuspendedMutations = false;
          try {
            await replaceStorage(normalized);
            restoreSucceeded = true;
            startupMutated = false;
          } finally {
            trackSuspendedMutations = true;
          }
        }
      }
    } catch (error) {
      startupMutated ||= mutatedBeforeRestore;
      logError("GamesForFarm: account restore failed", error);
    }
    currentStorage = normalizeStorage(await storage.getAll());
  }
  const canApplyPageUser = !accountChanged || restoreSucceeded;
  if (canApplyPageUser) {
    const nextUser = {
      ...currentStorage.user,
      ...compactUser(pageUser)
    };
    if (!sameJson(nextUser, currentStorage.user)) {
      await storage.set("user", nextUser);
    }
    currentStorage.user = nextUser;
  }
  const lastGameUpdate = Number.parseInt(currentStorage.settings.game_update, 10) || 0;
  if (currentStorage.user.steam && !attemptedInitialGameFetch && now() - lastGameUpdate > GAME_REFRESH_SECONDS) {
    const games = await fetchGames(currentStorage.user.steam);
    if (games) {
      currentStorage.games = games;
      currentStorage.settings = {
        ...currentStorage.settings,
        game_update: now()
      };
      await storage.setMany({
        games: currentStorage.games,
        settings: currentStorage.settings
      });
    }
  }
  const taskList = Array.isArray(currentStorage.tasks) ? currentStorage.tasks : [];
  const activeTasks = taskList.filter((task) => {
    if (!task?.time) return true;
    const taskTime = Number.parseInt(task.time, 10);
    return !Number.isFinite(taskTime) || now() - taskTime <= TASK_MAX_AGE_SECONDS;
  });
  if (activeTasks.length !== taskList.length) {
    await storage.set("tasks", activeTasks);
  }
  const discord = await storage.get("discord");
  if (discord?.length > 0) {
    try {
      const response = await request.postForm(
        "/php/extension/discord_levels_update.php",
        { discord: JSON.stringify(discord) }
      );
      if (String(response).includes("success")) {
        alert2("Данные discord уровней обновлены");
      } else {
        alert2("Возникла ошибка при обновлении discord уровней");
      }
    } catch (error) {
      logError("GamesForFarm: Discord upload failed", error);
      alert2("Возникла ошибка при обновлении discord уровней");
    } finally {
      await storage.remove("discord");
    }
  }
  if ($(".games_for_farm_extension.work").length > 0) {
    $(".games_for_farm_extension.not_work").remove();
    $(".games_for_farm_extension.work").slideDown(200);
  }
  syncSuspended = false;
  if (startupMutated) scheduleSync();
  const checkTasksButton = () => {
    let tasksDone = true;
    $(".game__content-tasks__task").each(function checkTask() {
      if (!$(this).hasClass("done")) tasksDone = false;
    });
    $(".js-get-key").toggleClass("inactive", !tasksDone);
  };
  const resetTaskButton = ($parent, $button, result) => {
    if (disposed) return;
    let timerId;
    timerId = schedule(() => {
      resultTimers.delete(timerId);
      if (disposed) return;
      $parent.toggleClass("done", result === "good");
      $parent.toggleClass("error", result === "bad");
      $button.removeClass("loading");
      checkTasksButton();
    }, TASK_RESULT_DELAY_MS);
    resultTimers.add(timerId);
  };
  $(".task-check-extension").removeClass("js-extentions-modal");
  $(".game__content-tasks__task[data-extension='1'] .task-link a").removeClass("js-extentions-modal");
  $(documentRef).off(
    `click${eventNamespace}`,
    ".game__content-tasks__task .task-check-extension"
  ).on(
    `click${eventNamespace}`,
    ".game__content-tasks__task .task-check-extension",
    async function taskCheck(event) {
      if (disposed) return;
      event.preventDefault();
      const $button = $(this);
      if ($button.hasClass("loading")) return;
      const $parent = $button.closest(".game__content-tasks__task");
      if ($parent.data("extension") == false) return;
      const id = $parent.data("id");
      const type = $parent.data("type");
      const data = $parent.data("data");
      if (![id, type, data].every(hasTaskValue)) return;
      $button.addClass("loading");
      try {
        await request.postForm("/php/extension/user_data_update.php", {
          extension: JSON.stringify(await storage.getAll())
        });
        if (disposed) return;
        const startedAt = Date.now();
        const response = await request.postForm(
          "/php/extension/user_task_update.php",
          {
            id,
            type,
            data
          }
        );
        console2?.log?.(`👌 checking task in ${Date.now() - startedAt} ms`);
        if (disposed) return;
        const text = String(response);
        const result = text.includes("good") ? "good" : text.includes("bad") ? "bad" : "neutral";
        resetTaskButton($parent, $button, result);
      } catch (error) {
        logError("GamesForFarm: task check failed", error);
        if (disposed) return;
        resetTaskButton($parent, $button, "neutral");
      }
    }
  );
  return instance.dispose;
}
var initFreeAnywhereListener = initFreeAnywhere;
function compactUser(user) {
  return Object.fromEntries(
    Object.entries(user).filter(([, value]) => value !== void 0 && value !== null && value !== "")
  );
}
function hasInitialStorageShape(storage) {
  return isRecord2(storage) && Object.prototype.hasOwnProperty.call(storage, "tasks") && isRecord2(storage.user) && isRecord2(storage.games) && isRecord2(storage.settings);
}
function isRecord2(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}
function hasTaskValue(value) {
  return value !== void 0 && value !== null && value !== "";
}
async function clearStorage(storage) {
  const current = await storage.getAll();
  for (const key of Object.keys(current)) {
    await storage.remove(key);
  }
}

// src/sites/gamesforfarm-store.ts
async function updateStoreGameCount(api, count) {
  const settings = await api.settings.get();
  if (Number(settings.store_games) !== count) await api.settings.update({ store_games: count });
}
async function initGamesForFarmStore({ $, storage, api }) {
  const [settings, games] = await Promise.all([
    storage.get("settings", {}),
    storage.get("games", {})
  ]);
  const owned = /* @__PURE__ */ new Set();
  $(".product__item").each(function markOwned() {
    const $item = $(this);
    const id = extractAppId(
      $item.find(".product__box-image img").data("src"),
      $item.find(".product__box-props a").attr("href")
    );
    if (id && games[id]) {
      owned.add(id);
      if (settings.hide_games === true) $item.css("opacity", ".2");
    }
  });
  if (Number(settings.store_games) !== owned.size) {
    if (api) await updateStoreGameCount(api, owned.size);
    else await storage.set("settings", { ...settings, store_games: owned.size });
  }
}
var initGamesForFarmStoreListener = initGamesForFarmStore;
function extractAppId(image, link) {
  const match = String(image ?? "").match(/\/apps\/(\d+)\//) ?? String(link ?? "").match(/\/app\/(\d+)(?:\/|$)/);
  return match ? Number.parseInt(match[1], 10) : null;
}

// src/sites/mee6.ts
var activeInstances2 = /* @__PURE__ */ new WeakMap();
function applyDiscordEntries(api, entries) {
  return api.discord.update(entries);
}
function detectMee6Leaderboard($) {
  const users = [];
  let complete = false;
  $(".md\\:block").each(function collectUser() {
    const user = {
      name: $(this).find(".justify-start p").text(),
      level: $(this).find(".leaderboardPlayerStat .items-center").text()
    };
    users.push(user);
    if (Number(user.level) === 0) {
      complete = true;
      return false;
    }
    return void 0;
  });
  return complete ? users : null;
}
function initMee6({ $, storage, api, alert: alert2, document: document2 = globalThis.document }) {
  activeInstances2.get(document2)?.();
  let shown = false;
  const handler = async (event) => {
    if (event.code !== "End") return;
    const users = detectMee6Leaderboard($);
    if (!users) return;
    if (api) await applyDiscordEntries(api, users);
    else await storage.set("discord", users);
    if (!shown) {
      alert2("Можно переходить на freeanywhere.net");
      shown = true;
    }
  };
  $(document2).on("keydown.gamesForFarmMee6", handler);
  const dispose = () => {
    $(document2).off(".gamesForFarmMee6");
    if (activeInstances2.get(document2) === dispose) activeInstances2.delete(document2);
  };
  activeInstances2.set(document2, dispose);
  return dispose;
}
var initMee6Listener = initMee6;

// src/sites/steam.ts
var activeInstances3 = /* @__PURE__ */ new WeakMap();
var instanceSequence = 0;
function detectSteamObservations($) {
  const observations = [];
  const curator = $("span[id^='CuratorUnFollowBtn_']").first();
  if (curator.length) {
    const id = String(curator.attr("id") ?? "").split("_")[1];
    const action = $(`#CuratorFollowBtn_${id}`).css("display") === "none" ? "add" : $(`#CuratorUnFollowBtn_${id}`).css("display") === "none" ? "remove" : null;
    if (id && action) observations.push({ type: "steam_curator_sub", data: id, action });
  }
  if ($(".followStatsBlock").length) {
    const id = String($("#HeaderUserInfoName a").attr("href") ?? "").split("/").filter(Boolean).pop();
    const action = $("#FollowUserOptionAdd").css("visibility") === "hidden" ? "add" : $("#FollowUserOptionFollowing, .followOption.remove").css("visibility") === "hidden" ? "remove" : null;
    if (id && action) observations.push({ type: "steam_guides_sub", data: id, action });
  }
  if ($("#ScrollingItemControls").length) {
    const id = $("#PublishedFileFavorite input[name='id']").val();
    const action = $("#FavoriteItemOptionAdd").css("visibility") === "hidden" ? "add" : $("#FavoriteItemOptionFavorited, .favoriteOption.removefavorite").css("visibility") === "hidden" ? "remove" : null;
    if (id && action) observations.push({ type: "steam_manual_favourite", data: id, action });
  }
  if ($("#queueBtnFollow").length) {
    const id = $(".game_page_background").data("miniprofile-appid");
    const action = $("#queueBtnFollow .queue_btn_inactive").css("display") === "none" ? "add" : $("#queueBtnFollow .queue_btn_active").css("display") === "none" ? "remove" : null;
    if (id && action) observations.push({ type: "steam_game_sub", data: id, action });
  }
  return observations;
}
function applySteamObservation(api, observation) {
  return api.tasks.update(observation.type, observation.data, observation.action);
}
function initSteam({ $, taskStore, api, document: document2 = globalThis.document }) {
  activeInstances3.get(document2)?.();
  const namespace = `.gamesForFarmSteam${++instanceSequence}`;
  let disposed = false;
  const update = (type, data, action) => {
    if (!disposed && data !== void 0 && data !== null && data !== "") {
      void (api ? api.tasks.update(type, data, action) : taskStore.update(type, data, action));
    }
  };
  for (const observation of detectSteamObservations($)) {
    void (api ? applySteamObservation(api, observation) : taskStore.update(observation.type, observation.data, observation.action));
  }
  const curatorElement = $("span[id^='CuratorUnFollowBtn_']").first();
  if (curatorElement.length) {
    const curatorId = String(curatorElement.attr("id") ?? "").split("_")[1];
    const follow = `#CuratorFollowBtn_${curatorId}`;
    const unfollow = `#CuratorUnFollowBtn_${curatorId}`;
    bindPair($, document2, namespace, follow, unfollow, "steam_curator_sub", curatorId, update);
  }
  if ($(".followStatsBlock").length) {
    const userId = String($("#HeaderUserInfoName a").attr("href") ?? "").split("/").filter(Boolean).pop();
    const follow = "#FollowUserOptionAdd";
    const unfollow = "#FollowUserOptionFollowing, .followOption.remove";
    bindPair($, document2, namespace, follow, unfollow, "steam_guides_sub", userId, update);
  }
  if ($("#ScrollingItemControls").length) {
    const manualId = $("#PublishedFileFavorite input[name='id']").val();
    const follow = "#FavoriteItemOptionAdd";
    const unfollow = "#FavoriteItemOptionFavorited, .favoriteOption.removefavorite";
    bindPair($, document2, namespace, follow, unfollow, "steam_manual_favourite", manualId, update);
  }
  if ($("#queueBtnFollow").length) {
    const gameId = $(".game_page_background").data("miniprofile-appid");
    const follow = "#queueBtnFollow .queue_btn_inactive";
    const unfollow = "#queueBtnFollow .queue_btn_active";
    bindPair($, document2, namespace, follow, unfollow, "steam_game_sub", gameId, update);
  }
  function dispose() {
    if (disposed) return;
    disposed = true;
    $(document2).off(namespace);
    if (activeInstances3.get(document2) === dispose) activeInstances3.delete(document2);
  }
  activeInstances3.set(document2, dispose);
  return dispose;
}
var initSteamListener = initSteam;
function bindPair($, document2, namespace, follow, unfollow, type, id, update) {
  if (id === void 0 || id === null || id === "") return;
  $(document2).on(`click${namespace}`, follow, () => update(type, id, "add")).on(`click${namespace}`, unfollow, () => update(type, id, "remove"));
}

// src/sites/youtube.ts
var SUBSCRIBE = /* @__PURE__ */ new Set(["Подписаться", "Падпісацца", "Підписатися", "Abonnieren", "Subscribe", "Suscribirse", "Mag-subscribe", "S'abonner", "Iscriviti", "Subskrybuj", "Subscrever", "Abonează-te", "订阅", "チャンネル登録", "訂閱"]);
var SUBSCRIBED = /* @__PURE__ */ new Set(["Вы подписаны", "Вы падпісаны", "Ви підписалися", "Abonniert", "Subscribed", "Suscrito", "Naka-subscribe", "Abonné", "Iscritto", "Subskrybujesz", "Subscrito", "Abonat(ă)", "已订阅", "登録済み", "已訂閱"]);
var activeInstances4 = /* @__PURE__ */ new WeakMap();
function detectYouTubeObservations($, location2 = globalThis.location) {
  const observations = [];
  const $subscribe = $("yt-subscribe-button-view-model");
  if ($subscribe.length) {
    const data = $('meta[itemprop="identifier"]').attr("content");
    const text = $subscribe.text().trim();
    let action = null;
    if (SUBSCRIBE.has(text)) action = "remove";
    else if (SUBSCRIBED.has(text) || $(".ytSubscribePlusButtonViewModelHost").length) action = "add";
    else {
      const color = $subscribe.find("button").css("color");
      if (["#0f0f0f", "rgb(15, 15, 15)"].includes(color)) action = "remove";
      if (["#f1f1f1", "rgb(241, 241, 241)"].includes(color)) action = "add";
    }
    if (data && action) observations.push({ type: "youtube_channel_sub", data, action });
  }
  if ($(".ytLikeButtonViewModelHost").length) {
    const data = location2.hostname === "m.youtube.com" ? new URL($('link[rel="canonical"]').attr("href") ?? location2.href).searchParams.get("v") : $('meta[itemprop="identifier"]').attr("content");
    const pressed = $(".ytLikeButtonViewModelHost button").attr("aria-pressed");
    if (data && (pressed === "true" || pressed === "false")) {
      observations.push({ type: "youtube_video_like", data, action: pressed === "true" ? "add" : "remove" });
    }
  }
  return observations;
}
function initYouTube(context) {
  const { $, taskStore, api, document: document2 = globalThis.document, location: location2 = globalThis.location } = context;
  const setIntervalFn = context.setInterval ?? globalThis.setInterval;
  const clearIntervalFn = context.clearInterval ?? globalThis.clearInterval;
  activeInstances4.get(document2)?.();
  let disposed = false;
  let lastUrl = location2.href;
  const states = /* @__PURE__ */ new Map();
  const record = (type, id, subscribed) => {
    if (!id) return;
    const key = `${type}:${id}`;
    if (states.get(key) === subscribed) return;
    states.set(key, subscribed);
    void (api ? api.tasks.update(type, id, subscribed ? "add" : "remove") : taskStore.update(type, id, subscribed ? "add" : "remove"));
  };
  const inspect = () => {
    if (disposed) return;
    if (location2.href !== lastUrl) {
      lastUrl = location2.href;
      states.clear();
    }
    for (const observation of detectYouTubeObservations($, location2)) {
      record(observation.type, observation.data, observation.action === "add");
    }
  };
  const interval = setIntervalFn(inspect, 600);
  $(document2).on("yt-navigate-finish.gamesForFarmYouTube popstate.gamesForFarmYouTube", inspect);
  inspect();
  function dispose() {
    if (disposed) return;
    disposed = true;
    clearIntervalFn(interval);
    $(document2).off(".gamesForFarmYouTube");
    if (activeInstances4.get(document2) === dispose) activeInstances4.delete(document2);
  }
  activeInstances4.set(document2, dispose);
  return dispose;
}
var initYouTubeListener = initYouTube;

// src/bootstrap.ts
var currentApi;
function getBootstrappedApi() {
  return currentApi;
}
async function bootstrap({ exposeGlobal }) {
  const gm = {
    GM_xmlhttpRequest,
    GM_setValue,
    GM_getValue
  };
  const storage = createStorage(gm);
  const request = createRequest(gm, location.href);
  const taskStore = createTaskStore(storage);
  const api = createGamesForFarmApi(storage, taskStore);
  currentApi = api;
  await storage.initialize();
  if (exposeGlobal) exposeApi(api, typeof unsafeWindow === "undefined" ? void 0 : unsafeWindow);
  const route = selectRoute(location.hostname, location.pathname);
  if (!route) return api;
  const context = {
    $: jQuery,
    storage,
    request,
    taskStore,
    api,
    location,
    document,
    alert,
    console
  };
  const initializers = {
    freeanywhere: initFreeAnywhereListener,
    steam: initSteamListener,
    youtube: initYouTubeListener,
    mee6: initMee6Listener,
    "gamesforfarm-store": initGamesForFarmStoreListener,
    firstgamemarket: initFirstGameMarketListener
  };
  await new Promise((resolve, reject) => {
    onWindowLoad(async () => {
      try {
        await initializers[route](context);
        console.log(`👌 gamesforfarm userscript: ${route}`);
        resolve();
      } catch (error) {
        console.error(`GamesForFarm ${route} initialization failed`, error);
        reject(error);
      }
    });
  });
  return api;
}

// src/esm.ts
var ready = () => bootstrap({ exposeGlobal: false });
var getApi = getBootstrappedApi;
export {
  createGamesForFarmApi,
  getApi,
  ready
};
