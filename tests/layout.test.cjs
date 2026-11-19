const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const read = (f) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');

test('wide/unfolded screens: two-column cards from the tablet-portrait tier, centered sheets, Mac hover only for fine pointers', () => {
  const css = read('app.css');
  assert.match(css, /@media \(min-width: 640px\) and \(min-height: 560px\)[\s\S]*\.cards \{ grid-template-columns: 1fr 1fr; \}/);
  assert.match(css, /\.sheet \{ width: min\(86vw, 640px\); \}/);
  assert.ok(css.includes('(min-width: 640px) and (min-height: 560px)'));
  assert.ok(!css.includes('min-width: 760px'));
  // Clip has no tier-B (side rail / split) rules; none may sneak into the narrow tier.
  assert.match(css, /@media \(hover: hover\) and \(pointer: fine\)/);
  assert.match(css, /html \{[^}]*overscroll-behavior: none/);
  assert.match(css, /button, input, textarea, label, summary, a \{ touch-action: manipulation; \}/);
  // Text inputs must stay 16px (no iOS focus zoom).
  assert.match(css, /\.search-input \{[^}]*font-size: 16px/);
});

test('the build stamp in app.js matches the service worker cache name', () => {
  const stamp = read('app.js').match(/const APP_BUILD = '([^']+)'/)[1];
  assert.equal(stamp, '2026.11.19-shortcutpaste2');
  assert.equal(read('sw.js').match(/const CACHE = 'clip-v1-([^']+)'/)[1], stamp);
});

test('sheets never rise into the top safe-area inset (status bar)', () => {
  const css = read('app.css');
  assert.match(css, /\.sheet \{[^}]*max-height: min\(94%, calc\(100% - var\(--sat\)\)\)/);
});

test('sheet header buttons stay inside the landscape side safe-area insets', () => {
  const css = read('app.css');
  assert.match(css, /\.sheet-head \{[^}]*padding: 6px max\(12px, var\(--sar\)\) 6px max\(12px, var\(--sal\)\);/);
});
