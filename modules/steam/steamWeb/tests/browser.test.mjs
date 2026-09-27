import { SteamWeb } from '../index.ts';
import { parseHTML } from '../utils/html.ts';

const results = [];
function assert(value, message) { if (!value) throw new Error(message); }
function response(text = '', json = {}, finalUrl = 'https://store.steampowered.com/') {
  return { result: 'Success', status: 600, statusText: 'Load', data: {
    status: 200, statusText: 'OK', responseText: text, response: json, finalUrl, responseHeaders: {}
  } };
}
function gm() {
  const values = new Map();
  return {
    getValue: (key, fallback) => values.get(key) ?? fallback,
    setValue: (key, value) => { values.set(key, structuredClone(value)); },
    deleteValue: (key) => { values.delete(key); },
    openInTab: () => { throw new Error('Unexpected auth fallback'); },
    addValueChangeListener: () => 1,
    removeValueChangeListener: () => {}
  };
}
const storeHTML = '<a data-miniprofile="1"></a><script>g_sessionID = "session";</script>';
const communityHTML = '<script>g_sessionID = "session"; g_steamID = "76561198000000000";</script>';
function cartHTML(country) {
  const escape = (obj) => JSON.stringify(obj).replaceAll('"', '&quot;');
  return `<div data-cart_config="${escape({ rgUserCountryOptions: { CN: {}, US: {}, help: {} } })}" data-userinfo="${escape({ country_code: country })}"></div>`;
}
async function test(name, work) {
  try { await work(); results.push({ name, passed: true }); }
  catch (error) { results.push({ name, passed: false, error: String(error) }); }
}

await test('detached DOM parsing decodes entities without executing scripts', async () => {
  const doc = parseHTML('<div data-value="{&quot;id&quot;:12}"></div><script>window.__steamExecuted = true</script>');
  assert(JSON.parse(doc.querySelector('div').getAttribute('data-value')).id === 12, 'entity decoding');
  assert(!window.__steamExecuted, 'script executed');
});

await test('region fallback restores original country and reports failed restoration', async () => {
  let country = 'CN';
  let failReset = false;
  const countries = [];
  const steam = new SteamWeb({ gm: gm(), http: async (options) => {
    const url = options.url;
    if (url === 'https://store.steampowered.com/') return response(storeHTML);
    if (url.endsWith('/cart/')) return response(cartHTML(country));
    if (url.endsWith('/setcountry')) {
      const target = new URLSearchParams(options.data).get('cc');
      countries.push(target);
      if (failReset && target === 'CN') return response('false');
      country = target;
      return response('true');
    }
    if (url.endsWith('/api/addtowishlist')) return response('', { success: country !== 'CN' });
    if (url.includes('/app/')) return response('<div id="error_box"></div>');
    throw new Error(`Unexpected request ${url}`);
  } });
  assert(await steam.init('store'), 'init');
  assert(await steam.addToWishlist('123'), 'region fallback');
  assert(country === 'US', 'country changed');
  failReset = true;
  assert(await steam.resetArea() === false, 'failed reset must return false');
  failReset = false;
  assert(await steam.resetArea(), 'reset retry');
  assert(country === 'CN', 'original country restored');
  assert(countries.join(',') === 'US,CN,CN', 'expected requests');
});

await test('follow fallback reads visible/hidden Steam controls; missing controls are not success', async () => {
  let html = '<div class="queue_control_button queue_btn_follow"><a class="btnv6_blue_hoverfade btn_medium queue_btn_active" style="display:none"></a></div>';
  const steam = new SteamWeb({ gm: gm(), http: async ({ url }) => {
    if (url === 'https://store.steampowered.com/') return response(storeHTML);
    if (url.includes('/followgame/')) return response('false');
    return response(html);
  } });
  await steam.initStore();
  assert(await steam.undoFollowGame('123'), 'hidden active control means not followed');
  html = html.replace('display:none', 'display:block');
  assert(await steam.doFollowGame('123'), 'visible active control means followed');
  html = '<div>Login required</div>';
  assert(await steam.undoFollowGame('123') === false, 'missing controls cannot verify unfollow');
});

await test('leaving group checks actual links in returned HTML', async () => {
  let membership = true;
  const steam = new SteamWeb({ gm: gm(), http: async ({ url }) => {
    if (url.endsWith('/my')) return response(communityHTML, {}, url);
    if (url.includes('/groups/')) return response("OpenGroupChat( '12345')");
    return response(membership ? '<a href="https://steamcommunity.com/groups/example">Example</a>' : '<a href="https://steamcommunity.com/groups/another">Another</a>', {}, 'https://steamcommunity.com/my/groups');
  } });
  await steam.initCommunity();
  assert(await steam.leaveGroup('example') === false, 'existing membership');
  membership = false;
  assert(await steam.leaveGroup('example'), 'membership removed');
});

document.getElementById('results').textContent = JSON.stringify(results);
document.documentElement.dataset.testStatus = results.every((result) => result.passed) ? 'passed' : 'failed';
