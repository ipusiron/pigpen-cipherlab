const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');

test('new scripts and tests stay within 160 columns', () => {
  for (const dir of ['js', 'test']) {
    for (const name of fs.readdirSync(path.join(root, dir)).filter(n => n.endsWith('.js'))) {
      const lines = fs.readFileSync(path.join(root, dir, name), 'utf8').split(/\r?\n/);
      lines.forEach((line, i) => assert.ok(line.length <= 160, `${dir}/${name}:${i + 1} = ${line.length}`));
    }
  }
});

test('readable source line-count floors', () => {
  const floors = { 'style.css': 600, 'index.html': 250, 'script.js': 250, 'js/pigpen-core.js': 180, 'js/i18n.js': 200 };
  for (const [file, floor] of Object.entries(floors)) {
    assert.ok(fs.readFileSync(path.join(root, file), 'utf8').split(/\r?\n/).length >= floor, file);
  }
});

test('UI files remain within their column limits', () => {
  for (const [name, limit] of [['script.js', 160], ['style.css', 160], ['index.html', 250]]) {
    fs.readFileSync(path.join(root, name), 'utf8').split(/\r?\n/).forEach((line, i) => {
      assert.ok(line.length <= limit, `${name}:${i + 1} = ${line.length}`);
    });
  }
});
