const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const i18n = require('../js/i18n.js');
const root = path.join(__dirname, '..');

test('Japanese and English have the same nonempty keys and placeholders', () => {
  assert.deepEqual(Object.keys(i18n.ja).sort(), Object.keys(i18n.en).sort());
  for (const key of Object.keys(i18n.ja)) {
    for (const language of ['ja', 'en']) assert.ok(i18n[language][key].trim(), `${language}.${key}`);
    assert.deepEqual(i18n.ja[key].match(/\{\w+\}/g), i18n.en[key].match(/\{\w+\}/g), key);
  }
});

test('all literal UI and markup keys exist', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
  const keys = [...html.matchAll(/data-i18n(?:-[\w-]+)?="([^"]+)"/g), ...script.matchAll(/i18n\.t\('([^']+)'/g)]
    .map(m => m[1]);
  for (const key of keys) assert.ok(Object.hasOwn(i18n.ja, key), key);
  for (const key of ['mode.ignore', 'mode.preserve', 'mapping.1', 'mapping.2', 'mapping.3', 'copy.success', 'copy.failure']) {
    assert.ok(Object.hasOwn(i18n.ja, key), key);
  }
});

test('core and UI script have no Japanese literals outside comments', () => {
  const ranges = [[0x3040, 0x30ff], [0x4e00, 0x9fff], [0xff01, 0xff60]];
  const pattern = new RegExp('[' + ranges.map(([a, b]) => String.fromCodePoint(a) + '-' + String.fromCodePoint(b)).join('') + ']');
  for (const name of ['script.js', 'js/pigpen-core.js']) {
    const source = fs.readFileSync(path.join(root, name), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    assert.doesNotMatch(source, pattern, name);
  }
  for (const value of Object.values(i18n.en)) assert.doesNotMatch(value, pattern);
});
