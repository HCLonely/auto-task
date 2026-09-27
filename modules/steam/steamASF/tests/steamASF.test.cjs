const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS }
  }).outputText, filename);
};
const { SteamASF, createGMHttpClient } = require('../index.ts');
const { Context } = require('../context.ts');
const { loadGroups } = require('../cache.ts');
const botId = '76561198000000000';
const otherId = '76561198000000001';
function response(Result, extras = {}) {
  return { result: 'Success', status: 600, statusText: 'Load', data: {
    status: 200, statusText: 'OK', responseText: '', finalUrl: '', responseHeaders: {},
    response: { Success: true, Message: 'OK', Result }, ...extras
  } };
}
function gm() {
  const values = new Map();
  return { values, getValue: (key, fallback) => structuredClone(values.get(key) ?? fallback),
    setValue: (key, value) => { values.set(key, structuredClone(value)); }, deleteValue: (key) => { values.delete(key); } };
}
function setup(handler, overrides = {}) {
  const calls = [];
  const storage = gm();
  const options = { AsfIpcUrl: 'http://127.0.0.1:1242', AsfIpcPassword: 'ipc-secret', AsfBotname: 'Bot',
    steamWebApiKey: 'api-secret', gm: storage, http: async (request) => {
      const command = request.data ? JSON.parse(request.data).Command : undefined;
      calls.push({ ...request, command });
      return handler(command, request);
    }, ...overrides };
  return { asf: new SteamASF(options), calls, storage, options };
}
function terminals(events) {
  for (const event of events.filter((e) => e.phase === 'start')) {
    assert.equal(events.filter((e) => e.operationId === event.operationId && ['success', 'failure', 'skipped'].includes(e.phase)).length, 1, event.operation);
  }
}

test('constructor is inert; concurrent initialization deduplicates requests; listeners are isolated', async () => {
  const { asf, calls } = setup(() => response('Stats'));
  assert.equal(calls.length, 0);
  const events = [];
  asf.on('status', () => { throw new Error('observer'); });
  asf.on('status', async () => { throw new Error('observer'); });
  const off = asf.on('status', (e) => events.push(e));
  assert.deepEqual(await Promise.all([asf.init(), asf.init()]), [true, true]);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].command, '!stats');
  assert.equal(calls[0].url, 'http://127.0.0.1:1242/Api/Command/');
  assert.equal(calls[0].headers.Authentication, 'ipc-secret');
  assert(!JSON.stringify(events).includes('secret'));
  terminals(events);
  const length = events.length;
  off();
  await asf.init();
  assert.equal(events.length, length);
});

test('IPC transport, HTTP, envelope, malformed responses and thrown errors return false', async () => {
  for (const result of [
    { result: 'Error', status: 603, statusText: 'NetworkError' },
    response('Success', { status: 403 }),
    response('Success', { response: { Success: false, Message: 'OK', Result: 'Success' } }),
    response('Success', { response: { Success: true, Message: 'OK', Result: 42 } }),
    response('Failed'), response('Unsuccessful'), response('Not successful')
  ]) {
    const { asf } = setup(() => result);
    assert.equal(await asf.doCurator('123'), false);
  }
  const { asf } = setup(() => { throw new Error('ipc-secret'); });
  const events = [];
  asf.on('status', (e) => events.push(e));
  assert.equal(await asf.init(), false);
  assert.equal(events.at(-1).code, 'UNEXPECTED_ERROR');
  assert(!JSON.stringify(events).includes('secret'));
});

test('wishlist and follow shortcuts use exact IDs; unknown CHECK formats still execute mutations', async () => {
  for (const [method, args, status] of [
    ['addToWishlist', ['12'], '× | √ | ×'], ['removeFromWishlist', ['12'], '× | × | ×'],
    ['doFollowGame', ['12'], '× | × | √'], ['undoFollowGame', ['12'], '× | × | ×']
  ]) {
    const { asf, calls } = setup(() => response(`Bot | 12 | ${status}`));
    assert.equal(await asf[method](...args), true);
    assert.equal(calls.length, 1);
  }
  for (const row of ['Bot | 123 | × | √ | ×', 'Bot | 12 | ? | ? | ?', 'unknown command']) {
    const { asf, calls } = setup((command) => response(command.startsWith('!CHECK') ? row : 'Success'));
    assert.equal(await asf.removeFromWishlist('12'), true);
    assert.equal(calls.length, 2);
    assert.equal(calls[1].command, '!REMOVEWISHLIST Bot 12');
  }
});

test('all supported mutation commands and official-group aliases keep original command spelling', async () => {
  const { asf, calls } = setup((command) => {
    if (command.startsWith('!CHECK')) return response('unsupported CHECK');
    if (command.startsWith('!JOINGROUP')) return response('Joined');
    if (command.startsWith('!GROUPLIST')) return response('Bot | group | 1234');
    if (command.startsWith('!play ')) return response('Playing');
    if (command.startsWith('!resume ')) return response('resumed');
    return response('Success');
  });
  for (const [method, args, expected] of [
    ['joinGroup', ['group'], '!JOINGROUP Bot group'], ['leaveGroup', ['group'], '!LEAVEGROUP Bot 1234'],
    ['joinOfficialGroup', ['group'], '!JOINGROUP Bot group'], ['leaveOfficialGroup', ['group'], '!LEAVEGROUP Bot 1234'],
    ['addToWishlist', ['12'], '!ADDWISHLIST Bot 12'], ['removeFromWishlist', ['12'], '!REMOVEWISHLIST Bot 12'],
    ['doFollowGame', ['12'], '!FOLLOWGAME Bot 12'], ['undoFollowGame', ['12'], '!UNFOLLOWGAME Bot 12'],
    ['doCurator', ['12'], '!FOLLOWCURATOR Bot 12'], ['undoCurator', ['12'], '!UNFOLLOWCURATOR Bot 12'],
    ['requestPlayTestAccess', ['12'], '!REQUESTACCESS Bot 12'], ['playGames', ['12,34'], '!play Bot 12,34'],
    ['stopPlayGames', [], '!resume Bot']
  ]) {
    assert.equal(await asf[method](...args), true, method);
    assert.equal(calls.at(-1).command, expected);
  }
});

test('localized replies are preserved', async () => {
  for (const reply of ['成功', 'Success', 'Успех']) {
    const { asf } = setup(() => response(reply));
    assert.equal(await asf.requestPlayTestAccess('12'), true);
  }
});

test('batch licenses require success for every exact ID; app requests preserve app/ prefix', async () => {
  for (const [reply, result] of [
    ['12: Success\n34: Success', true], ['12: Success\n34: Failed', false], ['123: Success\n34: Success', false], ['12: Success', false]
  ]) {
    const { asf, calls } = setup(() => response(reply));
    assert.equal(await asf.addLicense('subid-12,34'), result);
    assert.equal(calls[0].command, '!addlicense Bot sub/12,sub/34');
  }
  const { asf, calls } = setup(() => response('12: AlreadyPurchased\n34: OK'));
  assert.equal(await asf.addLicense('appid-12,34'), true);
  assert.equal(calls[0].command, '!addlicense Bot app/12,app/34');
});

test('invalid arguments fail without IPC requests', async () => {
  const { asf, calls } = setup(() => response('Success'));
  for (const id of ['subid-', 'invalid-123', 'appid-12,', 'appid-12\n!stop']) assert.equal(await asf.addLicense(id), false);
  assert.equal(await asf.addToWishlist('12 34'), false);
  assert.equal(await asf.playGames(''), false);
  assert.equal(await asf.joinGroup('group\n!stop'), false);
  assert.equal(calls.length, 0);
});

test('group cache is GM-persistent and scoped by endpoint/bot; missing names trigger refresh', async () => {
  const { options, calls, storage } = setup(() => response('header\nBot | group | 1234\nmalformed'));
  assert.equal((await loadGroups(new Context(options))).group, '1234');
  assert.equal((await loadGroups(new Context(options))).group, '1234');
  assert.equal(calls.length, 1);
  await loadGroups(new Context({ ...options, AsfBotname: 'Other' }));
  await loadGroups(new Context({ ...options, AsfIpcUrl: 'http://localhost:4321' }));
  assert.equal(calls.length, 3);
  assert.equal(storage.values.size, 3);
  const second = setup((command) => response(command.startsWith('!GROUPLIST') ? 'Bot | new | 999' : 'Success'), { gm: storage });
  assert.equal(await second.asf.leaveGroup('new'), true);
  assert.equal(second.calls[0].command, '!GROUPLIST Bot');
  assert.equal(second.calls[1].command, '!LEAVEGROUP Bot 999');
});

test('GM storage failures do not silently downgrade to memory', async () => {
  const { asf } = setup(() => response('Success'), { gm: { getValue() { throw new Error('disabled'); }, setValue() {}, deleteValue() {} } });
  assert.equal(await asf.leaveGroup('group'), false);
});

test('public identity keeps Web-first fallback; malformed/ambiguous ASF identity is rejected', async () => {
  const first = setup(() => response('', { responseText: `steamid&quot;:&quot;${otherId}` }));
  assert.equal(await first.asf.getSteamId(), otherId);
  assert.equal(first.calls.length, 1);
  const fallback = setup((command) => command ? response(`<Bot> ${botId}`) : response('', { status: 500 }));
  assert.equal(await fallback.asf.getSteamId(), botId);
  assert.equal(fallback.calls.length, 2);
  for (const reply of ['Command unknown', `${botId}\n${otherId}`, '123']) {
    assert.equal(await setup(() => response(reply)).asf.getSteamIdASF(), '');
  }
});

test('play status only checks the ASF player gameid, never unrelated digits or browser account', async () => {
  for (const [player, expected] of [
    [{ steamid: botId, gameid: '12' }, true],
    [{ steamid: botId, gameid: '123', lastlogoff: 12 }, false],
    [{ steamid: botId, personaname: '12' }, false]
  ]) {
    const { asf, calls } = setup((command) => command ? response(`<Bot> ${botId}`) : response('', { response: { response: { players: [player, { steamid: otherId, gameid: '12' }] } } }));
    const events = [];
    asf.on('status', (e) => events.push(e));
    assert.equal(await asf.checkPlayStatus('12'), expected);
    assert.equal(events.at(-1).phase, 'success');
    assert(calls.every(({ url }) => !url.includes('store.steampowered.com')));
    assert(!JSON.stringify(events).includes('api-secret'));
    terminals(events);
  }
});

test('missing API key or bot identity skips; unavailable player is a failure', async () => {
  const missing = setup(() => response(''), { steamWebApiKey: '' });
  assert.equal(await missing.asf.checkPlayStatus('12'), 'skip');
  assert.equal(missing.calls.length, 0);
  assert.equal(await setup(() => response('unknown')).asf.checkPlayStatus('12'), 'skip');
  const unavailable = setup((command) => command ? response(botId) : response('', { response: { response: { players: [] } } }));
  const events = [];
  unavailable.asf.on('status', (e) => events.push(e));
  assert.equal(await unavailable.asf.checkPlayStatus('12'), false);
  assert.equal(events.at(-1).code, 'PLAYER_STATUS_UNAVAILABLE');
});

test('unsupported methods and disposed instances perform no requests', async () => {
  const { asf, calls } = setup(() => response('Success'));
  const events = [];
  asf.on('status', (e) => events.push(e));
  for (const name of ['doForum', 'doFavoriteWorkshop', 'voteUpWorkshop', 'likeAnnouncement']) assert.equal(await asf[name](), false);
  assert.equal(events.filter((e) => e.code === 'ASF_UNSUPPORTED').length, 4);
  terminals(events);
  asf.dispose();
  assert.equal(await asf.init(), false);
  assert.equal(await asf.playGames('12'), false);
  assert.equal(await asf.getSteamIdASF(), '');
  assert.equal(calls.length, 0);
});

test('standalone GM adapter parses JSON, omits text responseType and does not retry writes', async () => {
  let calls = 0;
  const http = createGMHttpClient((options) => { calls++; options.onload({ status: 200, responseText: '{"Success":true}', responseHeaders: 'Set-Cookie: a\r\nset-cookie: b' }); });
  const result = await http({ url: 'x', responseType: 'json', method: 'POST' });
  assert.equal(result.data.response.Success, true);
  assert.deepEqual(result.data.responseHeaders['set-cookie'], ['a', 'b']);
  assert.equal(calls, 1);
  await createGMHttpClient((options) => { assert.equal(options.responseType, undefined); options.onerror(); })({ url: 'x', responseType: 'text' });
  assert.equal((await createGMHttpClient(() => ({}))({ url: 'x', timeout: 5 })).status, 601);
});
