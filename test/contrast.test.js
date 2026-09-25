const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const css = fs.readFileSync(path.join(__dirname, '../style.css'), 'utf8');
const vars = Object.fromEntries([...css.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6});/gi)].map(m => [m[1], m[2]]));

function luminance(hex) {
  return hex.slice(1).match(/../g).map(v => parseInt(v, 16) / 255)
    .map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
    .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
}

for (const [fg, bg] of [
  ['primary-text', 'primary-bg'], ['primary-text', 'hover-bg'], ['tab-text', 'tab-bg'],
  ['muted-text', 'muted-bg'], ['primary-text', 'toast-bg'], ['primary-text', 'error-bg'],
  ['letter-text', 'surface'], ['letter-text', 'page-bg']
]) {
  test(`contrast ${fg} on ${bg} >= 4.5`, () => {
    const a = luminance(vars[fg]);
    const b = luminance(vars[bg]);
    assert.ok((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) >= 4.5);
  });
}
