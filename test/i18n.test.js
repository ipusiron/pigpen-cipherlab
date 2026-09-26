const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const i18n = require('../js/i18n.js');
const root = path.join(__dirname, '..');

test('all three mapping selectors share option order and labels in both languages', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  for (const id of ['encryptGlyphSelect', 'decryptGlyphSelect', 'learningGlyphSelect']) {
    const markup = html.match(new RegExp(`<select id="${id}">([\\s\\S]*?)</select>`))[1];
    const options = [...markup.matchAll(/<option value="([^"]+)"([^>]*)>([^<]*)<\/option>/g)];
    assert.deepEqual(options.map(option => option[1]), ['1', '2', '3', 'keyword'], id);
    assert.deepEqual(options.map(option => option[3]), ['1', '2', '3', 'キーワード'], id);
    for (const language of ['ja', 'en']) {
      const labels = options.map(option => {
        const key = option[2].match(/data-i18n="([^"]+)"/);
        return key ? i18n[language][key[1]] : option[3];
      });
      assert.deepEqual(labels, ['1', '2', '3', language === 'ja' ? 'キーワード' : 'Keyword'], `${id}.${language}`);
    }
  }
});

test('singular ignored character and unchanged Japanese message', () => {
  assert.equal(i18n.en['warn.ignoredOne'].replace('{count}', '1'), 'Ignored 1 non-letter character');
  assert.equal(i18n.en['warn.ignored'].replace('{count}', '2'), 'Ignored 2 non-letter characters');
  assert.equal(i18n.ja['warn.ignoredOne'], i18n.ja['warn.ignored']);
});

test('43 model descriptions in both languages', () => {
  const core = require('../js/pigpen-core.js');
  assert.equal(core.ALL_SHAPES.length, 43);
  for (const shape of core.ALL_SHAPES) for (const language of ['ja', 'en']) {
    assert.ok(i18n.describeShape(shape, language).trim());
  }
  assert.equal(i18n.describeShape('g:RB:0', 'ja'), '右と下に壁');
  assert.equal(i18n.describeShape('g:TRBL:1', 'en'), 'walls on all four sides, 1 dot');
  assert.equal(i18n.describeShape('x:T:0', 'en'), 'top section of the X (V shape)');
});

test('footer terminology and all extension dictionaries', () => {
  assert.equal(i18n.ja.footer, '🔗 GitHubリポジトリー');
  for (const value of Object.values(i18n.ja)) assert.doesNotMatch(value, /リポジトリ(?!ー)/);
  for (const prefix of ['keyword.', 'rank.', 'exercise.', 'shape.']) {
    assert.ok(Object.keys(i18n.ja).some(key => key.startsWith(prefix)));
  }
});

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
