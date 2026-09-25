const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

test('DOM rendering has no HTML injection, inline styles or alert', () => {
  assert.doesNotMatch(html, /\sstyle\s*=|\son\w+\s*=|id="encryptButton"/i);
  for (const name of ['script.js', 'js/pigpen-core.js', 'js/i18n.js']) {
    const source = fs.readFileSync(path.join(root, name), 'utf8');
    assert.doesNotMatch(source, /innerHTML|insertAdjacentHTML|\.style\.|alert\(|console\.log|onclick/);
  }
});

test('one state, shared variant handler, model-driven encryption and glyph paths', () => {
  assert.match(script, /const state = \{ variant: '1', spaceMode: 'ignore', text: '', decodeItems: \[\] \}/);
  assert.equal((script.match(/addEventListener\("change"/g) || []).length, 1);
  assert.match(script, /PigpenCore\.tokenize\(state\.text, state\.spaceMode\)/);
  assert.match(script, /PigpenCore\.encrypt\(result\.tokens, state\.variant\)/);
  assert.match(script, /PigpenCore\.usage\(result\.tokens\)/);
  assert.match(script, /PigpenCore\.shapeOf\(letter, variant\)/);
  assert.doesNotMatch(script, /\[\^A-Z\\s\]/);
});
