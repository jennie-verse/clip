const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const read = (f) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
// A test that awaits a tap must fail fast, not hang CI, if the code under test regresses.
const T = { timeout: 5000 };

// Why these tests exist: a Shortcut opens Clip at ?paste=1 while the text sits
// on the clipboard. iOS (WebKit) rejects navigator.clipboard.readText() at once
// when it is not inside a tap, so Clip used to show "Could not read the
// clipboard" every time. The address must open a Paste sheet instead, and only
// the tap on that sheet's button may read the clipboard.

function fakeNode() {
  const classes = new Set(['hidden']);
  return {
    textContent: '',
    focusCalls: 0,
    focus() { this.focusCalls += 1; },
    querySelector() { return null; },
    classList: {
      add: c => { classes.add(c); },
      remove: c => { classes.delete(c); },
      toggle(c, force) {
        const on = force === undefined ? !classes.has(c) : !!force;
        if (on) classes.add(c); else classes.delete(c);
        return on;
      },
      contains: c => classes.has(c),
    },
  };
}

function loadClip({ search = '', readText, userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)' } = {}) {
  const values = new Map();
  const timers = [];
  const toasts = [];
  const editorCalls = [];
  const replaced = [];
  const context = vm.createContext({
    console, Date, Promise, URL, URLSearchParams, Blob, TextEncoder,
    File: class File {},
    FileReader: class FileReader {},
    setTimeout: fn => { timers.push(fn); return timers.length; },
    clearTimeout: () => {},
    location: { origin: 'https://example.test', hostname: 'example.test', href: 'https://example.test/clip/', pathname: '/clip/', search, hash: '' },
    history: { replaceState: (_state, _title, url) => { replaced.push(url); } },
    navigator: { userAgent, clipboard: readText ? { readText } : undefined },
    window: { addEventListener() {}, SharedSync: null },
    document: {
      addEventListener() {},
      documentElement: { style: { setProperty() {} } },
      body: { style: {} },
      contains: () => false,
    },
    localStorage: {
      getItem: key => (values.has(key) ? values.get(key) : null),
      setItem: (key, value) => { values.set(key, String(value)); },
      removeItem: key => { values.delete(key); },
    },
  });
  vm.runInContext(read('app.js'), context, { filename: 'app.js' });

  // Keep the real paste logic; replace only what needs a real page.
  context.__fakeNode = fakeNode;
  vm.runInContext(`['sheet-paste', 'btn-paste-go', 'btn-paste-write', 'paste-status', 'sheet-edit']
    .forEach(id => { el[id] = __fakeNode(); });`, context);
  context.toast = (message, kind) => { toasts.push({ message, kind }); return { remove() {} }; };
  context.render = () => {};
  context.flashCard = () => {};
  context.openEditor = (...args) => { editorCalls.push(args); };
  context.queueJournalItem = () => {};
  context.recordClipActivity = () => {};

  const run = code => vm.runInContext(code, context);
  const node = id => run(`el['${id}']`);
  return {
    context, run, node, toasts, editorCalls, replaced,
    // Array.from: arrays made inside the vm context have another Array.prototype, which deepStrictEqual rejects.
    texts: () => Array.from(run('state.items.map(item => item.text)')),
    sheetOpen: () => !node('sheet-paste').classList.contains('hidden'),
    runTimers: () => { timers.splice(0).forEach(fn => fn()); },
  };
}

test('?paste=1 opens the Paste sheet and never reads the clipboard at page load', T, () => {
  let reads = 0;
  const h = loadClip({ search: '?paste=1', readText: () => { reads += 1; return Promise.resolve('copied'); } });
  h.run('handleUrlIntake()');

  assert.equal(reads, 0, 'iOS rejects clipboard reads outside a tap, so none may be attempted on load');
  assert.equal(h.sheetOpen(), true);
  assert.deepEqual(h.replaced, ['/clip/'], 'the query is removed so a reload does not reopen the sheet');
  assert.equal(h.toasts.length, 0, 'no error toast when arriving from a Shortcut');
  assert.equal(h.editorCalls.length, 0, 'no empty Write sheet when arriving from a Shortcut');
  assert.deepEqual(h.texts(), []);
  assert.match(h.node('paste-status').textContent, /confirm/);
});

test('tapping the sheet button reads inside the tap, saves the clip and closes the sheet', T, async () => {
  let reads = 0;
  const h = loadClip({ search: '?paste=1', readText: () => { reads += 1; return Promise.resolve('한글 copied\r\ntext'); } });
  h.run('handleUrlIntake()');

  const tap = h.run('pasteFromClipboard(true)'); // what the button's click handler runs
  assert.equal(reads, 1, 'readText() has to be called synchronously, before the first await, to count as part of the tap');
  await tap;

  assert.deepEqual(h.texts(), ['한글 copied\ntext']);
  assert.equal(h.sheetOpen(), false);
  assert.deepEqual(h.toasts.map(t => t.message), ['Saved.']);
});

test('declining iOS’s Paste bubble keeps the sheet open with a retry hint', T, async () => {
  const h = loadClip({ search: '?paste=1', readText: () => Promise.reject(new Error('NotAllowedError')) });
  h.run('handleUrlIntake()');
  await h.run('pasteFromClipboard(true)');

  assert.equal(h.sheetOpen(), true);
  assert.match(h.node('paste-status').textContent, /Nothing was pasted/);
  assert.equal(h.node('paste-status').classList.contains('warn'), true);
  assert.deepEqual(h.texts(), []);
  assert.equal(h.editorCalls.length, 0);
  assert.equal(h.toasts.length, 0);
});

test('a clipboard without text is reported on the sheet and nothing is saved', T, async () => {
  const h = loadClip({ search: '?paste=1', readText: () => Promise.resolve('  \n ') });
  h.run('handleUrlIntake()');
  await h.run('pasteFromClipboard(true)');

  assert.equal(h.sheetOpen(), true);
  assert.match(h.node('paste-status').textContent, /no text/);
  assert.deepEqual(h.texts(), []);
});

test('a second tap clears the old warning, and a late rejection of the first tap does not bring it back', T, async () => {
  const rejects = [];
  const h = loadClip({ search: '?paste=1', readText: () => new Promise((_, reject) => { rejects.push(reject); }) });
  h.run('handleUrlIntake()');
  const note = h.node('paste-status').textContent;

  const first = h.run('pasteFromClipboard(true)');
  const second = h.run('pasteFromClipboard(true)');
  rejects[0](new Error('dismissed by the second tap'));
  await first;
  assert.equal(h.node('paste-status').textContent, note, 'the newer tap is still waiting on its own bubble');

  rejects[1](new Error('dismissed'));
  await second;
  assert.match(h.node('paste-status').textContent, /Nothing was pasted/);
});

test('the main Paste button still falls back to the Write editor when the read is refused', T, async () => {
  const h = loadClip({ readText: () => Promise.reject(new Error('NotAllowedError')) });
  await h.run('pasteFromClipboard(false)');

  assert.deepEqual(h.toasts, [{ message: 'Could not read the clipboard. Paste it below instead.', kind: 'warn' }]);
  assert.deepEqual(Array.from(h.editorCalls[0]), ['clip', null]);
  assert.deepEqual(h.texts(), []);
});

test('the main Paste button saves what it reads and reports an empty clipboard on a toast', T, async () => {
  const saved = loadClip({ readText: () => Promise.resolve('Office address') });
  await saved.run('pasteFromClipboard(false)');
  assert.deepEqual(saved.texts(), ['Office address']);
  assert.deepEqual(saved.toasts.map(t => t.message), ['Saved.']);

  const empty = loadClip({ readText: () => Promise.resolve('') });
  await empty.run('pasteFromClipboard(false)');
  assert.deepEqual(empty.toasts, [{ message: 'Clipboard is empty.', kind: 'warn' }]);
  assert.deepEqual(empty.texts(), []);
});

test('browsers without the async clipboard API fall back cleanly on both buttons', T, async () => {
  const fromPage = loadClip();
  await fromPage.run('pasteFromClipboard(false)');
  assert.equal(fromPage.editorCalls.length, 1);

  const fromSheet = loadClip({ search: '?paste=1' });
  fromSheet.run('handleUrlIntake()');
  await fromSheet.run('pasteFromClipboard(true)');
  assert.equal(fromSheet.sheetOpen(), true);
  assert.match(fromSheet.node('paste-status').textContent, /Nothing was pasted/);
});

test('on a Mac the sheet focuses its main button for the keyboard; on iPhone it does not', T, () => {
  const mac = loadClip({ search: '?paste=1', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15' });
  mac.run('handleUrlIntake()');
  mac.runTimers();
  assert.equal(mac.node('btn-paste-go').focusCalls, 1);

  const phone = loadClip({ search: '?paste=1' });
  phone.run('handleUrlIntake()');
  phone.runTimers();
  assert.equal(phone.node('btn-paste-go').focusCalls, 0);
});

test('?add= still saves directly and ?paste= with any other value does nothing', T, () => {
  const add = loadClip({ search: '?add=Hello%20%ED%95%9C%EA%B8%80' });
  add.run('handleUrlIntake()');
  assert.deepEqual(add.texts(), ['Hello 한글']);
  assert.equal(add.sheetOpen(), false);

  const other = loadClip({ search: '?paste=0' });
  other.run('handleUrlIntake()');
  assert.equal(other.sheetOpen(), false);
  assert.deepEqual(other.texts(), []);
});

test('every element id app.js looks up exists in index.html, and the Paste sheet is wired', T, () => {
  const html = read('index.html');
  const js = read('app.js');
  const list = js.match(/function cache\(\) \{\s*\[([\s\S]*?)\]\.forEach/);
  assert.ok(list, 'cache() id list not found');
  const ids = [...list[1].matchAll(/'([^']+)'/g)].map(m => m[1]);
  assert.ok(ids.includes('btn-paste-go') && ids.includes('paste-status'));
  const missing = ids.filter(id => !html.includes('id="' + id + '"'));
  assert.deepEqual(missing, [], 'ids missing from index.html: ' + missing.join(', '));

  // The Shortcut entry must go through the sheet; the main button and the sheet button each tap-read.
  // (assert.ok rather than assert.match: a failed match would print the whole 85 KB source.)
  assert.ok(/params\.get\('paste'\) === '1'\) \{[\s\S]{0,600}?openPasteSheet\(\);/.test(js), '?paste=1 must open the Paste sheet');
  assert.ok(!/params\.get\('paste'\) === '1'\) \{[\s\S]{0,600}?pasteFromClipboard\(/.test(js), '?paste=1 must not read the clipboard itself');
  assert.ok(js.includes("el['btn-paste'].addEventListener('click', () => pasteFromClipboard(false))"), 'main Paste button wiring');
  assert.ok(js.includes("el['btn-paste-go'].addEventListener('click', () => pasteFromClipboard(true))"), 'Paste sheet button wiring');
});
