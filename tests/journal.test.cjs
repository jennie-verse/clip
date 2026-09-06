const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function loadApp(locationOverride = {}) {
  const values = new Map();
  let lastReader = null;
  class TestFileReader {
    readAsText(file) {
      lastReader = this;
      this.result = file.text;
      this.done = Promise.resolve(this.onload());
    }
  }
  const context = vm.createContext({
    console,
    Date,
    Promise,
    URL,
    Blob,
    File: class File {},
    FileReader: TestFileReader,
    TextEncoder,
    setTimeout: () => 1,
    clearTimeout: () => {},
    location: { origin: 'https://example.test', hostname: 'example.test', href: 'https://example.test/tide/', pathname: '/tide/', search: '', hash: '', ...locationOverride },
    navigator: {},
    window: { addEventListener() {}, SharedSync: null },
    document: { addEventListener() {}, documentElement: { style: { setProperty() {} } } },
    localStorage: {
      getItem(key) { return values.has(key) ? values.get(key) : null; },
      setItem(key, value) { values.set(key, String(value)); },
      removeItem(key) { values.delete(key); },
    },
  });
  const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  vm.runInContext(source, context, { filename: 'app.js' });
  return { context, source, values, getLastReader: () => lastReader };
}

test('journal opt-in is independent and defaults off when normal sync is already on', () => {
  const { context, values } = loadApp();
  values.set('clip.syncEnabled', '1');
  assert.equal(vm.runInContext('isSyncEnabled()', context), true);
  assert.equal(vm.runInContext('isJournalEnabled()', context), false);
  vm.runInContext('setJournalEnabled(true)', context);
  assert.equal(values.get('clip.journalEnabled.v1'), '1');
});

test('projection contains the full Clip record but no authentication data', () => {
  const { context } = loadApp();
  vm.runInContext(`globalThis.result = clipJournalRecord(normalizeItem({
    id: 'fixture-clip', kind: 'clip', text: 'Fixture text', label: 'Fixture label',
    type: 'text', pinned: true, createdAt: '2026-08-17T14:00:00.000Z',
    lastTouchedAt: '2026-08-17T15:00:00.000Z', updatedAt: '2026-08-17T15:00:00.000Z',
    usedAt: '2026-08-17T15:00:00.000Z', useCount: 2
  }))`, context);
  const result = context.result;
  assert.equal(result.kind, 'clip');
  assert.equal(result.title, 'Fixture label');
  assert.equal(result.data.text, 'Fixture text');
  assert.equal(result.data.useCount, 2);
  assert.equal(JSON.stringify(result).includes('token'), false);
});

test('content-off projection is neutral and activity ledger merges same-day actions', () => {
  const { context, values } = loadApp();
  values.set('clip.journalContent.v1', '0');
  vm.runInContext(`
    const item = normalizeItem({ id:'old', kind:'clip', text:'Private', label:'Secret', createdAt:'2026-08-01T00:00:00.000Z', journalDate:'2026-08-01', updatedAt:'2026-08-01T00:00:00.000Z' });
    state.items = [item];
    globalThis.projection = clipJournalRecord(item);
    recordClipActivity(item, 'copied'); recordClipActivity(item, 'edited');
    globalThis.ledger = readClipActivityLedger();
  `, context);
  assert.equal(context.projection.title, 'Clip');
  assert.equal(context.projection.data.text, undefined);
  const entries = Object.values(context.ledger);
  assert.equal(entries.length, 1);
  assert.deepEqual(Array.from(entries[0].actions), ['copied', 'edited']);
});

test('redaction strips Clip content and backup ledger restore is additive and bounded', () => {
  const { context } = loadApp();
  vm.runInContext(`
    globalThis.redacted = withoutClipJournalContent({
      id:'x', kind:'clip', at:nowIso(), updatedAt:nowIso(), title:'Secret', deleted:false,
      data:{text:'Private',label:'Label',type:'text',contentIncluded:true}
    });
    globalThis.restoredLedger = replaceClipActivityLedger([{date:localDateStamp(new Date()),itemId:'x',itemType:'clip',sourceDate:'2026-08-01',actions:['copied'],firstAt:nowIso(),lastAt:nowIso()}]);
  `, context);
  assert.equal(context.redacted.title, 'Clip');
  assert.equal(context.redacted.data.text, undefined);
  assert.equal(context.redacted.data.label, undefined);
  assert.equal(context.redacted.data.contentIncluded, false);
  assert.equal(Object.keys(context.restoredLedger).length, 1);
});

test('projection title fallbacks and tombstones retain the original creation day', () => {
  const { context } = loadApp();
  vm.runInContext(`
    const fixture = normalizeItem({
      id: 'fixture-note', kind: 'clip', text: '\\n  First line  \\nSecond',
      createdAt: '2026-08-17T14:00:00.000Z', journalDate: '2026-08-17',
      updatedAt: '2026-08-17T14:00:00.000Z'
    });
    globalThis.result = {
      date: fixture.journalDate,
      record: clipJournalRecord(fixture, { deleted: true, updatedAt: '2026-08-18T01:00:00.000Z' })
    };
  `, context);
  assert.equal(context.result.date, '2026-08-17');
  assert.equal(context.result.record.title, 'First line');
  assert.equal(context.result.record.deleted, true);
  assert.equal(context.result.record.updatedAt, '2026-08-18T01:00:00.000Z');
});

test('all primary Clip mutation paths enqueue only after the local save call', () => {
  const { source } = loadApp();
  const pairs = [
    /saveState\(\);\s*(?:recordClipActivity\([^;]+;\s*)?queueJournalItem\(dup/,
    /saveState\(\);\s*(?:recordClipActivity\([^;]+;\s*)?queueJournalItem\(item\)/,
    /saveState\(\);\s*queueJournalItem\(item, \{ deleted: true/,
  ];
  pairs.forEach(pattern => assert.match(source, pattern));
  assert.match(source, /import\(JOURNAL\.moduleUrl\)/);
});

test('Pages ownership is portable and custom domains stop sync explicitly', () => {
  const pages = loadApp({ hostname: 'new-owner.github.io', origin: 'https://new-owner.github.io', href: 'https://new-owner.github.io/tide/' });
  assert.equal(vm.runInContext('syncConfig().owner', pages.context), 'new-owner');
  const custom = loadApp();
  assert.throws(() => vm.runInContext('syncConfig()', custom.context), error => error.code === 'PAGES_OWNER_UNRESOLVED');
  assert.match(vm.runInContext('describeSyncError((() => { try { syncConfig(); } catch (e) { return e; } })())', custom.context), /Cannot determine the GitHub account/);
});

test('shortcut URL keeps the current deployment path and query entry', () => {
  const { context } = loadApp({ origin: 'https://new-owner.github.io', hostname: 'new-owner.github.io', pathname: '/tide/index.html', href: 'https://new-owner.github.io/tide/index.html' });
  assert.equal(vm.runInContext('baseUrl()', context), 'https://new-owner.github.io/tide/');
  assert.equal(vm.runInContext('appUrl()', context), 'https://new-owner.github.io/tide/?add=');
});

test('merge keeps the newest item and a newer tombstone wins', () => {
  const { context } = loadApp();
  vm.runInContext(`
    state.items = [{ id:'a', kind:'clip', text:'old', createdAt:'2026-08-01T00:00:00Z', updatedAt:'2026-08-02T00:00:00Z' }];
    state.deleted = [];
    mergeRemote([{ items:[{ id:'a', kind:'clip', text:'new', createdAt:'2026-08-01T00:00:00Z', updatedAt:'2026-08-03T00:00:00Z' }], deleted:[] }]);
    globalThis.afterNew = state.items[0].text;
    mergeRemote([{ items:[], deleted:[{ id:'a', at:'2026-08-04T00:00:00Z' }] }]);
    globalThis.afterDelete = state.items.length;
  `, context);
  assert.equal(context.afterNew, 'new');
  assert.equal(context.afterDelete, 0);
});

test('retention preserves pinned items and removes only expired unpinned items', () => {
  const { context } = loadApp();
  vm.runInContext(`
    state.settings.retentionDays = 7;
    state.items = [
      normalizeItem({ id:'p', kind:'clip', text:'pinned', pinned:true, createdAt:'2020-01-01T00:00:00Z', lastTouchedAt:'2020-01-01T00:00:00Z' }),
      normalizeItem({ id:'x', kind:'clip', text:'expired', pinned:false, createdAt:'2020-01-01T00:00:00Z', lastTouchedAt:'2020-01-01T00:00:00Z' })
    ];
    globalThis.expired = state.items.filter(item => isExpired(item, state.settings.retentionDays)).map(item => item.id);
  `, context);
  assert.deepEqual(Array.from(context.expired), ['x']);
});

test('backup restore replaces items, resets retention clocks, and records removals', async () => {
  const { context, values, getLastReader } = loadApp();
  context.confirmAsk = async () => true;
  context.refreshSettingsUI = () => {};
  context.render = () => {};
  context.toastUndo = () => {};
  vm.runInContext(`
    state.items = [normalizeItem({
      id: 'remove-me', kind: 'clip', text: 'local',
      createdAt: '2026-08-01T00:00:00.000Z', updatedAt: '2026-08-01T00:00:00.000Z'
    })];
    importJson({ text: JSON.stringify({
      version: CONFIG.schema,
      app: 'clip',
      items: [{
        id: 'restored', kind: 'clip', text: 'from backup',
        createdAt: '2020-01-01T00:00:00.000Z',
        lastTouchedAt: '2020-01-01T00:00:00.000Z',
        updatedAt: '2020-01-01T00:00:00.000Z',
        archivedAt: '2020-01-02T00:00:00.000Z'
      }],
      deleted: [],
      settings: { retentionDays: 7 }
    }) });
  `, context);
  await getLastReader().done;
  vm.runInContext(`globalThis.restoredResult = {
    item: state.items[0],
    tomb: state.deleted.find(entry => entry.id === 'remove-me')
  }`, context);

  assert.equal(context.restoredResult.item.id, 'restored');
  assert.equal(context.restoredResult.item.lastTouchedAt, context.restoredResult.item.updatedAt);
  assert.equal(context.restoredResult.item.archivedAt, null);
  assert.equal(context.restoredResult.tomb.at, context.restoredResult.item.updatedAt);
  assert.equal(JSON.parse(values.get('clip.v1')).items[0].id, 'restored');
});
