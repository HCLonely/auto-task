const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

// Test the TS sources without generating artifacts or changing the repository build.
require.extensions['.ts'] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS }
  });
  module._compile(outputText, filename);
};
const { SteamWeb, createGMHttpClient } = require('../index.ts');
const { Context } = require('../context.ts');
const { requestTabAuth, handleSteamAuthPage } = require('../adapters/gmTabAuth.ts');
const { updateCommunityAuth } = require('../auth/session.ts');

const storeHTML = '<a data-miniprofile="1"></a><script>g_sessionID = "store-secret";</script>';
const communityHTML = '<script>g_sessionID = "community-secret"; g_steamID = "76561198000000000";</script>';
function response(text = '', json = {}, url = 'https://store.steampowered.com/', status = 200) {
  return { result: 'Success', status: 600, statusText: 'Load', data: {
    status, statusText: 'OK', responseText: text, response: json, finalUrl: url, responseHeaders: {}
  } };
}
const networkError = () => ({ result: 'Error', status: 603, statusText: 'NetworkError' });

function fakeGM(onOpen) {
  const values = new Map();
  const listeners = new Map();
  const tabs = [];
  let next = 0;
  const gm = {
    values, listeners, tabs,
    getValue: (key, fallback) => structuredClone(values.has(key) ? values.get(key) : fallback),
    setValue(key, value) {
      const old = values.get(key);
      values.set(key, structuredClone(value));
      for (const { name, callback } of [...listeners.values()]) if (name === key) callback(key, old, value, true);
    },
    deleteValue: (key) => { values.delete(key); },
    addValueChangeListener(name, callback) { const id = ++next; listeners.set(id, { name, callback }); return id; },
    removeValueChangeListener: (id) => { listeners.delete(id); },
    openInTab(url) {
      const tab = { closed: false, onclose: undefined, close() { this.closed = true; this.onclose?.(); } };
      tabs.push(tab);
      onOpen?.(url, gm, tab);
      return tab;
    }
  };
  return gm;
}
async function until(predicate) {
  const deadline = Date.now() + 2000;
  while (!predicate()) {
    if (Date.now() > deadline) throw new Error('Mock setup timed out');
    await new Promise((resolve) => setImmediate(resolve));
  }
}
function assertTerminals(events) {
  for (const start of events.filter((event) => event.phase === 'start')) {
    const terminal = events.filter((event) => event.operationId === start.operationId && ['success', 'failure', 'skipped'].includes(event.phase));
    assert.equal(terminal.length, 1, start.operation);
  }
}

test('injected transport, initialization deduplication, isolated observers and event lifecycle', async () => {
  const gm = fakeGM();
  const calls = [];
  const steam = new SteamWeb({ gm, http: async (options) => {
    calls.push(options);
    if (options.url === 'https://store.steampowered.com/') return response(storeHTML);
    return response('', { success: true });
  } });
  const events = [];
  steam.on('status', () => { throw new Error('observer'); });
  steam.on('status', async () => { throw new Error('async observer'); });
  const off = steam.on('status', (event) => events.push(event));
  assert.deepEqual(await Promise.all([steam.init('store'), steam.init('store')]), [true, true]);
  assert.equal(calls.length, 1);
  assert.equal(await steam.addToWishlist('123'), true);
  assert.equal(await steam.removeFromWishlist('123'), true);
  assert.match(calls[1].data, /appid=123/);
  assert.match(calls[1].data, /sessionid=store-secret/);
  assertTerminals(events);
  assert(events.some((event) => event.parentOperationId));
  assert(!JSON.stringify(events).includes('store-secret'));
  assert(!JSON.stringify(events).includes('sessionid'));
  const length = events.length;
  off();
  await steam.addToWishlist('456');
  assert.equal(events.length, length);
});

test('uninitialized operations fail without requests; community-only init does not touch store', async () => {
  const calls = [];
  const steam = new SteamWeb({ gm: fakeGM(), http: async (options) => { calls.push(options.url); return response(communityHTML, {}, options.url); } });
  assert.equal(await steam.addToWishlist('1'), false);
  assert.equal(calls.length, 0);
  assert.equal(await steam.init('community'), true);
  assert.deepEqual(calls, ['https://steamcommunity.com/my']);
});

test('all initialization requires both store and community to succeed', async () => {
  const gm = fakeGM();
  const steam = new SteamWeb({ gm, authTimeoutMs: 10, http: async ({ url }) => url.includes('steamcommunity') ? response(communityHTML, {}, url) : networkError() });
  assert.equal(await steam.init(), false);
  assert.equal(gm.listeners.size, 0);
  assert(gm.tabs.every((tab) => tab.closed));
});

test('community login refresh is bounded and does not emit credentials', async () => {
  const calls = [];
  const ctx = new Context({ gm: fakeGM(), http: async (options) => {
    calls.push(options.url);
    if (options.url.includes('ajaxrefresh')) return response('', { success: true, steamID: '76561198000000000', nonce: 'nonce-secret', auth: 'auth-secret', redir: '/' });
    if (options.url.includes('settoken')) return response();
    return response('', {}, 'https://steamcommunity.com/login/home');
  } });
  const events = [];
  ctx.events.on((event) => events.push(event));
  assert.equal(await updateCommunityAuth(ctx, true), false);
  assert.equal(calls.filter((url) => url.includes('ajaxrefresh')).length, 1);
  assert.equal(calls.filter((url) => url.endsWith('/my')).length, 2);
  assertTerminals(events);
  assert(!JSON.stringify(events).includes('secret'));
});

test('GM adapter normalizes JSON, case-insensitive repeated headers and final URL', async () => {
  const http = createGMHttpClient((options) => {
    assert.equal(options.responseType, 'json');
    options.onload({ status: 200, responseText: '{"success":true}', responseHeaders: 'Set-Cookie: a=1\r\nset-cookie: b=2', finalUrl: 'https://steamcommunity.com/my' });
  });
  const result = await http({ url: 'https://steamcommunity.com/', dataType: 'json' });
  assert.equal(result.data.response.success, true);
  assert.deepEqual(result.data.responseHeaders['set-cookie'], ['a=1', 'b=2']);
  assert.equal(result.data.finalUrl, 'https://steamcommunity.com/my');
});

test('GM transport failures, invalid JSON and HTTP failures remain distinct; writes are not retried', async () => {
  for (const [callback, expected] of [['onerror', 603], ['onabort', 602], ['ontimeout', 601]]) {
    let count = 0;
    const http = createGMHttpClient((options) => { count++; options[callback](); });
    assert.equal((await http({ url: 'https://example.invalid', method: 'POST' })).status, expected);
    assert.equal(count, 1);
  }
  assert.equal((await createGMHttpClient(() => { throw new Error('secret'); })({ url: 'x' })).status, 604);
  assert.equal((await createGMHttpClient((o) => o.onload({ status: 200, responseText: '<html>' }))({ url: 'x', responseType: 'json' })).status, 604);
  const failedHTTP = await createGMHttpClient((o) => o.onload({ status: 403, responseText: '' }))({ url: 'x' });
  assert.equal(failedHTTP.result, 'Success');
  assert.equal(failedHTTP.data.status, 403);
  await createGMHttpClient((o) => {
    assert.equal(o.responseType, undefined, 'GM text requests omit responseType');
    o.onload({ status: 200, responseText: 'plain text' });
  })({ url: 'x', responseType: 'text' });
  let aborted = false;
  const timedOut = await createGMHttpClient(() => ({ abort() { aborted = true; } }))({ url: 'x', timeout: 5 });
  assert.equal(timedOut.status, 601);
  assert.equal(aborted, true);
});

test('tab authentication ignores unrelated replies and cleans all resources on success', async () => {
  const gm = fakeGM();
  const ctx = new Context({ gm, http: async () => networkError(), authTimeoutMs: 1000 });
  const result = requestTabAuth(ctx, 'store');
  await until(() => gm.tabs.length === 1 && gm.tabs[0].onclose);
  const pending = gm.values.get('steamWeb:auth:store:pending');
  gm.setValue('steamWeb:auth:store:reply', { id: 'wrong', auth: { storeSessionID: 'wrong' } });
  assert.equal(ctx.state.auth.storeSessionID, undefined);
  gm.setValue('steamWeb:auth:store:reply', { id: pending.id, auth: { storeSessionID: 'right' } });
  assert.equal(await result, true);
  assert.equal(ctx.state.auth.storeSessionID, 'right');
  assert.equal(gm.listeners.size, 0);
  assert.equal(gm.values.size, 0);
  assert.equal(gm.tabs[0].closed, true);
});

test('tab authentication settles on close, timeout, setup failure and dispose', async () => {
  for (const mode of ['close', 'timeout', 'failure', 'dispose']) {
    const gm = fakeGM();
    if (mode === 'failure') gm.openInTab = () => { throw new Error('blocked'); };
    const ctx = new Context({ gm, http: async () => networkError(), authTimeoutMs: mode === 'timeout' ? 5 : 1000 });
    const result = requestTabAuth(ctx, 'community');
    if (mode === 'close' || mode === 'dispose') {
      await until(() => gm.tabs[0]?.onclose);
      if (mode === 'close') gm.tabs[0].close();
      else for (const cancel of ctx.state.cleanups) cancel();
    }
    assert.equal(await result, false, mode);
    assert.equal(gm.listeners.size, 0, mode);
    assert.equal(gm.values.size, 0, mode);
    assert.equal(ctx.state.cleanups.size, 0, mode);
  }
});

test('successful reply during asynchronous tab setup closes the late tab', async () => {
  const gm = fakeGM();
  const originalOpen = gm.openInTab;
  gm.openInTab = async (url) => {
    const pending = gm.values.get('steamWeb:auth:store:pending');
    gm.setValue('steamWeb:auth:store:reply', { id: pending.id, auth: { storeSessionID: 'session' } });
    await new Promise((resolve) => setTimeout(resolve, 5));
    return originalOpen(url);
  };
  const ctx = new Context({ gm, http: async () => networkError() });
  assert.equal(await requestTabAuth(ctx, 'store'), true);
  assert.equal(gm.tabs[0].closed, true);
  assert.equal(gm.listeners.size, 0);
});

test('page-side handler reads only matching namespace and replies using its request ID', async () => {
  const gm = fakeGM();
  const oldLocation = global.location;
  const oldDocument = global.document;
  try {
    global.location = { hostname: 'store.steampowered.com' };
    global.document = { documentElement: { innerHTML: storeHTML } };
    assert.equal(await handleSteamAuthPage({ gm }), false);
    gm.setValue('custom:auth:store:pending', { id: 'request-1', expiresAt: Date.now() + 1000 });
    assert.equal(await handleSteamAuthPage({ gm }), false);
    assert.equal(await handleSteamAuthPage({ gm, namespace: 'custom' }), true);
    assert.deepEqual(gm.values.get('custom:auth:store:reply'), { id: 'request-1', auth: { storeSessionID: 'store-secret' } });
  } finally { global.location = oldLocation; global.document = oldDocument; }
});

test('GM persistence is reusable across instances and has no memory fallback on storage failure', async () => {
  const gm = fakeGM();
  let lookups = 0;
  const http = async ({ url }) => {
    if (url.endsWith('/my')) return response(communityHTML, {}, url);
    if (url.includes('/discussions/')) { lookups++; return response('General_123_456'); }
    return response('', { success: 1 });
  };
  for (let i = 0; i < 2; i++) {
    const steam = new SteamWeb({ gm, http });
    assert.equal(await steam.init('community'), true);
    assert.equal(await steam.doForum('123'), true);
  }
  assert.equal(lookups, 1);
  assert.equal(gm.values.get('steamWeb:cache').forum['123'], '123_456');
  gm.getValue = () => { throw new Error('storage disabled'); };
  assert.equal(await new SteamWeb({ gm, http }).init('community'), false);
});

test('failed forum request, missing owned package and failed follow lookup return false', async () => {
  const gm = fakeGM();
  gm.setValue('steamWeb:cache', { forum: { '123': '456' } });
  const steam = new SteamWeb({ gm, autoChangeRegion: false, http: async ({ url }) => {
    if (url === 'https://store.steampowered.com/') return response(storeHTML);
    if (url.endsWith('/my')) return response(communityHTML, {}, url);
    if (url.includes('/freelicense/')) return response('ok');
    if (url.includes('/dynamicstore/')) return response('', { rgOwnedPackages: [1] });
    return networkError();
  } });
  assert.equal(await steam.init(), true);
  assert.equal(await steam.doForum('123'), false);
  assert.equal(await steam.voteUpWorkshop('123'), false);
  assert.equal(await steam.addLicense('subid-1,2'), false);
  assert.equal(await steam.addLicense('subid-'), false);
  assert.equal(await steam.undoFollowGame('123'), false);
});

test('disabled region switching terminates wishlist fallback without recursion', async () => {
  let count = 0;
  const steam = new SteamWeb({ gm: fakeGM(), autoChangeRegion: false, http: async ({ url }) => {
    count++;
    if (url === 'https://store.steampowered.com/') return response(storeHTML);
    if (url.includes('/api/')) return networkError();
    return response('<div id="error_box"></div>');
  } });
  await steam.init('store');
  assert.equal(await steam.addToWishlist('123'), false);
  assert.equal(count, 3);
});

test('separate instances do not share initialized auth; disposed instances reject new work', async () => {
  const http = async () => response(storeHTML);
  const first = new SteamWeb({ gm: fakeGM(), http });
  const second = new SteamWeb({ gm: fakeGM(), http });
  assert.equal(await first.initStore(), true);
  assert.equal(await second.addToWishlist('1'), false);
  first.dispose();
  assert.equal(await first.initStore(), false);
  assert.equal(await first.addToWishlist('1'), false);
});

test('group, official group, workshop, curator, announcement, license and playtest public methods remain callable', async () => {
  const gm = fakeGM();
  let officialJoined = false;
  let workshopLookups = 0;
  let licenseOwned = false;
  const calls = [];
  const steam = new SteamWeb({ gm, autoChangeRegion: false, http: async (options) => {
    const { url } = options;
    calls.push(options);
    if (url === 'https://store.steampowered.com/') return response(storeHTML);
    if (url.endsWith('/my')) return response(communityHTML, {}, url);
    if (url.includes('/groups/example')) return response('joined');
    if (url.includes('/games/')) {
      if (url.includes('action=join')) officialJoined = true;
      return response(officialJoined ? 'steam://friends/joinchat/100' : '<a id="publicGroupJoin">Join</a>');
    }
    if (url.endsWith('/home_process')) { officialJoined = false; return response(); }
    if (url.includes('/filedetails/')) { workshopLookups++; return response('<input type="hidden" name="appid" value="123" />'); }
    if (url.includes('/sharedfiles/favorite') || url.includes('/sharedfiles/unfavorite')) return response('');
    if (url.includes('/sharedfiles/voteup')) return response('', { success: 1 });
    if (url.includes('/curators/')) return response('', { success: { success: 1 } });
    if (url.includes('/ajaxgetpartnerevent')) return response('', { success: 1, event: { announcement_body: { clanid: '100', gid: '200' } } });
    if (url.includes('/ajaxrateupdate/')) return response('', { success: 1 });
    if (url.includes('/freelicense/')) { licenseOwned = true; return response('ok'); }
    if (url.includes('/app/')) return response(licenseOwned ? '<div class="already_in_library"></div>' : '<input name="subid" value="456">');
    if (url.includes('/ajaxrequestplaytestaccess/')) return response('', { success: 1 });
    throw new Error(`Unexpected mocked URL: ${url}`);
  } });
  assert.equal(await steam.init(), true);
  for (const [method, args] of [
    ['joinGroup', ['example']], ['joinOfficialGroup', ['123']], ['leaveOfficialGroup', ['123']],
    ['doFavoriteWorkshop', ['456']], ['undoFavoriteWorkshop', ['456']],
    ['voteUpWorkshop', ['456']], ['doCurator', ['789']], ['undoCurator', ['789']],
    ['likeAnnouncement', ['123/200']], ['addLicense', ['appid-123']], ['requestPlayTestAccess', ['123']]
  ]) assert.equal(await steam[method](...args), true, method);
  assert.equal(workshopLookups, 1);
  assert.equal(gm.values.get('steamWeb:cache').workshop['456'], '123');
  assert(calls.some(({ data }) => typeof data === 'string' && data.includes('follow=false')));
});
