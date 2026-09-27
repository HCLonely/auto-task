const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS }
}).outputText, file);
const api = require('../../index.ts');
const response = (json = {}, text = JSON.stringify(json), url = '') => ({ result: 'Success', status: 600, statusText: 'Load',
  data: { status: 200, statusText: 'OK', response: json, responseText: text, finalUrl: url, responseHeaders: {} } });
const gm = () => {
  const values = new Map();
  return { getValue: (key, fallback) => structuredClone(values.get(key) ?? fallback),
    setValue: (key, value) => { values.set(key, structuredClone(value)); }, deleteValue: key => { values.delete(key); } };
};
global.DOMParser = class { parseFromString() { return { querySelector: () => ({ getAttribute: () => 't5_test' }) }; } };

function fixture(platform) {
  const writes = [];
  let joined = false;
  const http = async (options) => {
    if (platform === 'Steam') {
      const command = JSON.parse(options.data).Command;
      if (!command.startsWith('!stats')) writes.push(command);
      return response({ Success: true, Message: 'OK', Result: 'Success' });
    }
    if (platform === 'Vk') {
      if (options.method === 'GET') return response({}, `"group_id":123,"fields":[],"is_member":${joined ? 1 : 0},`, options.url);
      writes.push(options.url.includes('groups.join') ? 'join' : 'leave');
      joined = !joined;
      return response({ response: 1 });
    }
    if (platform === 'Twitch') {
      const operation = JSON.parse(options.data)[0].operationName;
      writes.push(operation);
      return response([{ data: { followUser: { id: '1' }, unfollowUser: { id: '1' } } }]);
    }
    if (platform === 'Twitter') {
      writes.push({ url: options.url, body: JSON.parse(options.data) });
      return response({});
    }
    if (platform === 'Reddit') {
      if (options.method === 'GET') return response({}, '<header/>', options.url);
      const body = JSON.parse(options.data);
      writes.push(body.variables.input.inputs[0].subscribeState);
      return response({ data: { [body.operation]: { ok: true } } });
    }
    if (options.method === 'GET') return response({}, JSON.stringify({ INNERTUBE_API_KEY: 'key',
      INNERTUBE_CONTEXT: { client: {}, request: {} }, channelId: 'UCtest' }), options.url);
    writes.push(options.url);
    return response({ subscribed: !options.url.includes('/unsubscribe') });
  };
  const options = { http, gm: gm(), taskDelayMs: 0, intervalMs: 0, channelDelayMs: 0, sha1: () => 'a'.repeat(40),
    ASF: { AsfEnabled: true, AsfIpcUrl: 'http://localhost:1242', AsfBotname: 'Bot' } };
  const client = new api[platform](options);
  // Exercise post-authentication task dispatch with deterministic transport fixtures.
  client.ctx.state.initialized = true;
  if (platform === 'Twitter') Object.assign(client.ctx.state, { auth: { ct0: 'token', language: 'en', userId: '1' }, getTID: async () => 'tid' });
  if (platform === 'Youtube') client.ctx.state.auth = 'cookie';
  if (platform === 'Twitch') Object.assign(client.ctx.state, { auth: { authToken: 'token', clientId: 'client' }, integrityToken: 'integrity', cache: { example: '123' } });
  if (platform === 'Vk') Object.assign(client.ctx.state, { token: 'token', userId: '123' });
  if (platform === 'Reddit') client.ctx.state.csrfToken = 'csrf';
  const targets = {
    Steam: ['curatorLinks', 'https://store.steampowered.com/curator/123/'],
    Vk: ['nameLinks', 'https://vk.com/example'],
    Twitch: ['channelLinks', 'https://www.twitch.tv/example'],
    Twitter: ['retweetLinks', 'https://x.com/example/status/123'],
    Reddit: ['redditLinks', 'https://www.reddit.com/r/example/'],
    Youtube: ['channelLinks', 'https://www.youtube.com/channel/UCtest']
  };
  const [key, link] = targets[platform];
  return { client, writes, key, link, params: { [key]: [link] } };
}

for (const platform of ['Steam', 'Vk', 'Twitch', 'Twitter', 'Reddit', 'Youtube']) {
  test(`${platform}: do/undo emit opposite mutations, ignore legacy direction input and retain result keys`, async () => {
    const { client, writes, params, key, link } = fixture(platform);
    const events = [];
    client.on('status', event => events.push(event));
    try {
      if (platform === 'Steam') assert.equal(await client.init(), true);
      assert.equal('toggle' in client, false);
      for (const [action, legacyFlag] of [['do', false], ['undo', true]]) {
        const result = await client[action]({ ...params, doTask: legacyFlag });
        assert.deepEqual(JSON.parse(JSON.stringify(result)), { success: true, results: { [key]: { [link]: true } } });
        assert.ok(events.some(e => !e.parentOperationId && e.phase === 'success' && [action, `tasks.${action}`].includes(e.operation)));
      }
      assert.equal(writes.length, 2);
      const text = writes.map(value => JSON.stringify(value));
      const expected = { Steam: ['FOLLOWCURATOR', 'UNFOLLOWCURATOR'], Vk: ['join', 'leave'], Twitch: ['FollowButton_FollowUser', 'FollowButton_UnfollowUser'],
        Twitter: ['CreateRetweet', 'DeleteRetweet'], Reddit: ['SUBSCRIBED', 'NONE'], Youtube: ['/subscribe?', '/unsubscribe?'] }[platform];
      assert.ok(text[0].includes(expected[0]), text[0]);
      assert.ok(text[1].includes(expected[1]), text[1]);
      const list = { Steam: ['curators', '123'], Vk: ['names', 'example'], Twitch: ['channels', 'example'],
        Twitter: ['retweets', '123'], Reddit: ['reddits', 'example'], Youtube: ['channels', 'UCtest'] }[platform];
      client.whiteList = { ...client.whiteList, [list[0]]: [list[1]] };
      const protectedResult = await client.undo(params);
      assert.equal(protectedResult.success, true);
      assert.equal(writes.length, 2, 'undo must respect whitelist');
    } finally { client.dispose(); }
  });
}

test('YouTube single-item methods have fixed directions and no legacy method', async () => {
  const { client, link, writes } = fixture('Youtube');
  try {
    assert.equal('toggleChannel' in client, false);
    assert.equal(await client.doChannel({ link, doTask: false }), true);
    assert.equal(await client.undoChannel({ link, doTask: true }), true);
    assert.ok(writes[0].includes('/subscribe?'));
    assert.ok(writes[1].includes('/unsubscribe?'));
  } finally { client.dispose(); }
});

test('partial failures retain original links and later tasks still execute', async () => {
  const { client } = fixture('Twitter');
  const links = ['https://x.com/u/status/123', 'invalid', 'https://x.com/u/status/456'];
  try {
    for (const action of ['do', 'undo']) assert.deepEqual(JSON.parse(JSON.stringify(await client[action]({ retweetLinks: links }))), {
      success: false, results: { retweetLinks: { [links[0]]: true, [links[1]]: false, [links[2]]: true } }
    });
  } finally { client.dispose(); }
});

test('manager and adapter queue do/undo independently, snapshot input and isolate failures', async () => {
  const calls = [];
  const make = (name, fail = false) => ({ tasks: {}, async init() { return true; },
    async do(options) { calls.push([name, 'do', options]); if (fail) throw Error('failure'); return true; },
    async undo(options) { calls.push([name, 'undo', options]); return { success: true, results: {} }; },
    on() { return () => {}; }, dispose() {} });
  const a = make('a', true), b = make('b');
  const manager = new api.SocialManager({ a, b });
  const events = [];
  manager.on('status', e => events.push(e));
  const links = ['first'];
  const pending = manager.do('b', { links });
  links.push('late');
  const undo = manager.undo('b', { links: ['undo'] });
  assert.equal(await pending, true);
  assert.equal((await undo).success, true);
  assert.deepEqual(calls.slice(0, 2), [['b', 'do', { links: ['first'] }], ['b', 'undo', { links: ['undo'] }]]);
  assert.deepEqual(await manager.doAll({ a: {}, b: {} }), { success: false, results: { a: false, b: true } });
  assert.equal((await manager.undoAll({ a: {}, b: {} })).success, true);
  assert.ok(events.some(e => e.operation === 'social.do'));
  assert.ok(events.some(e => e.operation === 'social.undo'));
  assert.equal('toggle' in manager, false);
  assert.equal('toggleAll' in manager, false);
  const adapter = new api.SocialAdapter(b);
  assert.equal(await adapter.do({}), true);
  assert.equal((await adapter.undo({})).success, true);
  manager.dispose();
});
