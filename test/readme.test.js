const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const core = require('../js/pigpen-core.js');
const root = path.join(__dirname, '..');
const ja = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
const en = fs.readFileSync(path.join(root, 'README.en.md'), 'utf8');

test('both README known-answer tables recompute exactly four rows', () => {
  for (const doc of [ja, en]) {
    const rows = [...doc.matchAll(/^\| ([123]) \| `([^`]+)` \| `([^`]+)` \|$/gm)];
    assert.equal(rows.length, 4);
    for (const [, variant, input, expected] of rows) {
      const actual = core.encrypt(core.tokenize(input, 'ignore').tokens, variant)
        .map(t => `${t.letter}=${t.shape}`).join(' ');
      assert.equal(actual, expected);
    }
    assert.ok(doc.includes('HEPPS WSVPD'));
    assert.ok(doc.includes('??GGP ?PYG?'));
  }
});

test('YAML retains original identifiers and block lists', () => {
  const yaml = ja.match(/^<!--[\s\S]*?-->/)[0];
  for (const line of [
    'id: day032', 'slug: pigpen-cipherlab', 'hub: true',
    'repo_url: "https://github.com/ipusiron/pigpen-cipherlab"',
    'demo_url: "https://ipusiron.github.io/pigpen-cipherlab/"'
  ]) assert.ok(yaml.includes(line));
  for (const name of ['category_ja', 'category_en', 'tags']) {
    assert.ok(yaml.includes(`${name}:\n  - `) || yaml.includes(`${name}:\r\n  - `));
  }
  assert.ok(!en.startsWith('<!--'));
});

function treeFiles(doc) {
  const tree = doc.match(/```text\r?\npigpen-cipherlab\/[\s\S]*?```/)[0].split(/\r?\n/).slice(1, -1);
  const stack = [];
  const files = [];
  for (const line of tree) {
    assert.match(line, /# \S/);
    const entry = line.split('#')[0].trimEnd();
    const match = entry.match(/^([│ ]*)(?:├|└)── (.+)$/);
    if (!match) continue;
    const depth = match[1].length / 4;
    const name = match[2];
    stack.length = depth;
    if (name.endsWith('/')) stack.push(name.slice(0, -1));
    else if (name === 'A.svg〜Z.svg') {
      for (const letter of core.LETTERS) files.push([...stack, letter + '.svg'].join('/'));
    } else files.push([...stack, name].join('/'));
  }
  return files.sort();
}

test('both trees list every non-ignored project file with descriptions', () => {
  const files = [...new Set(execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'],
    { cwd: root, encoding: 'utf8' }).trim().split(/\r?\n/))].sort();
  assert.deepEqual(treeFiles(ja), files);
  assert.deepEqual(treeFiles(en), files);
});

test('matching fifteen sections in their specified order', () => {
  const japanese = ['🌐 デモページ', '📸 スクリーンショット', '✨ 機能', '📖 使い方', '🧠 ピッグペン暗号とは？',
    '🔬 仕様と既知解答', '🔤 暗号化の例', '🔍 ピッグペン暗号文の解読アプローチ', '📚 参考リソース',
    '🔒 このツールのセキュリティ', '🧪 テスト', '📁 ディレクトリー構造', '💻 動作環境', '📄 ライセンス', '🛠️ このツールについて'];
  const english = ['🌐 Demo', '📸 Screenshots', '✨ Features', '📖 Usage', '🧠 What Is the Pigpen Cipher?',
    '🔬 Specification and Known Answers', '🔤 Encryption Example', '🔍 How to Break a Pigpen Ciphertext', '📚 References',
    '🔒 Security of This Tool', '🧪 Tests', '📁 Directory Structure', '💻 Requirements', '📄 License', '🛠️ About This Tool'];
  assert.deepEqual([...ja.matchAll(/^## (.+)\r?$/gm)].map(m => m[1].trim()), japanese);
  assert.deepEqual([...en.matchAll(/^## (.+)\r?$/gm)].map(m => m[1].trim()), english);
  assert.ok(ja.includes('[English](README.en.md)'));
  assert.ok(en.includes('[日本語](README.md)'));
});

test('all image references exist, all root PNGs are used, and three screenshots meet limits', () => {
  for (const doc of [ja, en]) {
    const images = [...doc.matchAll(/!\[[^\]]*\]\((assets\/[^)]+)\)/g)].map(m => m[1]);
    assert.equal(images.length, 4);
    for (const file of images) assert.ok(fs.existsSync(path.join(root, file)), file);
    for (const name of fs.readdirSync(path.join(root, 'assets')).filter(n => n.endsWith('.png'))) {
      assert.ok(images.includes('assets/' + name), name);
    }
  }
  for (const file of ['assets/screenshot.png', 'assets/screenshot2.png', 'assets/en/screenshot.png']) {
    const png = fs.readFileSync(path.join(root, file));
    assert.equal(png.readUInt32BE(16), 1280);
    assert.ok([1000, 1200].includes(png.readUInt32BE(20)));
    assert.ok(png.length <= 300 * 1024);
  }
});

test('six test files and corrected terminology', () => {
  assert.equal(fs.readdirSync(__dirname).filter(n => n.endsWith('.test.js')).length, 6);
  for (const name of fs.readdirSync(__dirname).filter(n => n.endsWith('.test.js'))) {
    assert.ok(ja.includes(name), name);
    assert.ok(en.includes(name), name);
  }
  assert.doesNotMatch(ja, /ビックペン|単一換字暗号は|呼ぶことにする/);
});
