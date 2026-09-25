const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

test('strict CSP, referrer and no-script fallback', () => {
  const csp = html.match(/http-equiv="Content-Security-Policy"\s+content="([^"]+)"/)[1];
  for (const directive of ["default-src 'self'", "script-src 'self'", "style-src 'self'", "connect-src 'none'"]) {
    assert.ok(csp.includes(directive), directive);
  }
  assert.doesNotMatch(csp, /unsafe-inline|unsafe-eval|frame-ancestors/);
  assert.match(html, /name="referrer" content="no-referrer"/);
  assert.match(html, /<noscript\b[^>]*>/);
});

test('tabs, dialog, labels and buttons are semantic', () => {
  assert.equal((html.match(/role="tab"/g) || []).length, 4);
  assert.equal((html.match(/role="tabpanel"/g) || []).length, 4);
  assert.equal((html.match(/aria-selected="true"/g) || []).length, 1);
  assert.match(html, /<dialog[^>]+aria-labelledby="helpTitle"/);
  for (const match of html.matchAll(/<label[^>]*for="([^"]+)"/g)) {
    assert.ok(html.includes(`id="${match[1]}"`));
  }
  for (const match of html.matchAll(/<button\b[^>]*>/g)) assert.match(match[0], /type="button"/);
  for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    assert.match(match[0], /rel="noopener noreferrer"/);
  }
  assert.match(script, /ArrowLeft/);
  assert.match(script, /ArrowRight/);
  assert.match(script, /showModal\(\)/);
});

test('decode stores symbols and draws their model geometry', () => {
  assert.match(script, /createGlyph\(shape/);
  assert.match(script, /PigpenCore\.decodeWith\(state\.decodeItems, currentTable\)/);
  assert.match(script, /glyphItem\.type = 'button'/);
  assert.match(script, /spaceButton\.type = 'button'/);
  assert.match(script, /delButton\.type = 'button'/);
  assert.match(html, /id="decryptedText" aria-live="polite"/);
  assert.match(html, /id="copyToast" aria-live="polite"/);
  assert.equal((html.match(/class="reading-glyph"/g) || []).length, 18);
});

test('DOM rendering has no HTML injection, inline styles or alert', () => {
  assert.match(html, /id="tab-exercise" role="tab" aria-controls="exercise"/);
  assert.match(html, /aria-labelledby="tab-exercise" id="exercise"/);
  assert.match(script, /crypto\.getRandomValues\(new Uint32Array\(26\)\)/);
  assert.doesNotMatch(script, /Math\.random/);
  assert.doesNotMatch(html, /\sstyle\s*=|\son\w+\s*=|id="encryptButton"/i);
  for (const name of ['script.js', 'js/pigpen-core.js', 'js/i18n.js']) {
    const source = fs.readFileSync(path.join(root, name), 'utf8');
    assert.doesNotMatch(source, /innerHTML|insertAdjacentHTML|\.style\.|alert\(|console\.log|onclick/);
  }
});

test('one state, shared variant handler and model-driven SVG encryption', () => {
  assert.match(script, /const state = \{ variant: '1', spaceMode: 'ignore', text: '', decodeItems: \[\], keyword: '', keywordBase: '1' \}/);
  assert.equal((script.match(/addEventListener\("change"/g) || []).length, 1);
  assert.match(script, /PigpenCore\.tokenize\(state\.text, state\.spaceMode\)/);
  assert.match(script, /PigpenCore\.encryptWith\(result\.tokens, currentTable\)/);
  assert.match(script, /PigpenCore\.usage\(result\.tokens\)/);
  assert.match(script, /PigpenCore\.geometry\(shape\)/);
  assert.match(script, /document\.createElementNS/);
  assert.doesNotMatch(script.replace(/`assets\/glyphs\/\$\{state.variant\}\/key_mapping.svg`/, ''), /assets\/glyphs\//);
  assert.doesNotMatch(script, /\[\^A-Z\\s\]/);
});
