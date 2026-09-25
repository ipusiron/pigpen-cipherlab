const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const core = require('../js/pigpen-core.js');
const root = path.join(__dirname, '..');

const tokenCases = [
  ["AB\nCD","preserve","AB/CD",0,1,["warn.spacesKept"]],
  ["AB\tCD","preserve","AB_CD",0,1,["warn.spacesKept"]],
  ["AB　CD","preserve","AB_CD",0,1,["warn.spacesKept"]],
  ["AB CD","preserve","AB_CD",0,1,["warn.spacesKept"]],
  ["AB CD","ignore","ABCD",0,1,["warn.spacesDropped"]],
  ["ｈｅｌｌｏ","ignore","HELLO",0,0,[]],
  ["straße","ignore","STRASSE",0,0,[]],
  ["café","ignore","CAFE",0,0,[]],
  ["   ","preserve","___",0,3,["warn.spacesKept"]],
  ["   ","ignore","",0,3,["warn.spacesDropped"]],
  ["hello world.","ignore","HELLOWORLD",1,1,["warn.ignored","warn.spacesDropped"]],
  ["hello world.","preserve","HELLO_WORLD",1,1,["warn.ignored","warn.spacesKept"]],
  ["日本語ABC","ignore","ABC",3,0,["warn.ignored"]],
  ["A😀B","ignore","AB",1,0,["warn.ignored"]],
  ["","ignore","",0,0,[]],
];
for (const [input, mode, expected, ignored, spaces, warnings] of tokenCases) {
  test(`A-3 ${JSON.stringify(input)} ${mode}`, () => {
    const result = core.tokenize(input, mode);
    assert.equal(result.tokens.map(t => t.type === 'letter' ? t.letter : t.type === 'newline' ? '/' : '_').join(''), expected);
    assert.equal(result.ignored, ignored);
    assert.equal(result.spaces, spaces);
    assert.deepEqual(core.warnings(result, mode).map(w => w.key), warnings);
    if (ignored) assert.equal(core.warnings(result, mode)[0].count, ignored);
  });
}
const encryptCases = [
  [
    "X marks the spot", "1",
    "X=x:L:1 M=g:TRB:1 A=g:RB:0 R=g:TL:1 K=g:RBL:1 S=x:T:0 T=x:L:0 H=g:TRL:0 E=g:TRBL:0 S=x:T:0 P=g:TR:1 " +
    "O=g:TBL:1 T=x:L:0"
  ],
  ["HELLO","1","H=g:TRL:0 E=g:TRBL:0 L=g:BL:1 L=g:BL:1 O=g:TBL:1"],
  ["HELLO","2","H=g:TRL:0 E=g:TRBL:0 L=x:R:0 L=x:R:0 O=g:RBL:1"],
  ["HELLO","3","H=g:BL:2 E=g:RBL:2 L=g:TRB:3 L=g:TRB:3 O=g:TRBL:3"],
];
for (const [input, variant, expected] of encryptCases) {
  test(`A-4 encrypt ${input} set ${variant}`, () => {
    const result = core.encrypt(core.tokenize(input, 'ignore').tokens, variant);
    assert.equal(result.map(t => `${t.letter}=${t.shape}`).join(' '), expected);
  });
}
const decodeCases = [
  ["HELLO WORLD","3","1","????? ????K"],
  ["HELLO WORLD","3","2","????? ????O"],
  ["HELLO WORLD","1","2","HEPPS WSVPD"],
  ["HELLO WORLD","1","3","??GGP ?PYG?"],
  ["HELLO WORLD","2","2","HELLO WORLD"],
  ["HI\nYOU","1","1","HI\nYOU"],
];
for (const [input, from, to, expected] of decodeCases) {
  test(`A-4 decode ${input} ${from} to ${to}`, () => {
    const symbols = core.encrypt(core.tokenize(input, 'preserve').tokens, from)
      .map(t => t.type === 'letter' ? t.shape : t.type === 'newline' ? '\n' : ' ');
    assert.equal(core.decodeSequence(symbols, to), expected);
  });
}
test('glyphSource examples', () => {
  assert.deepEqual(core.glyphSource('g:RB:2'), { variant: '3', letter: 'B' });
  assert.deepEqual(core.glyphSource('x:T:1'), { variant: '1', letter: 'W' });
  assert.equal(core.glyphSource('g:RB:9'), null);
});
test('usage examples', () => {
  assert.deepEqual(core.usage(core.tokenize('hello world.', 'ignore').tokens),
    { used: ['D', 'E', 'H', 'L', 'O', 'R', 'W'], last: 'D' });
  assert.deepEqual(core.usage([]), { used: [], last: null });
});
test('invalid variants and letters', () => {
  assert.equal(core.isVariant(4), false);
  assert.equal(core.shapeOf('?', 1), null);
  assert.equal(core.shapeOf('A', 4), null);
  assert.equal(core.letterOf('g:RB:0', 4), null);
});

// Known answers copied from specification A-2, not generated from the implementation.
const shapes = [
  ["A","g:RB:0","g:RB:0","g:RB:1"],
  ["B","g:RBL:0","g:RBL:0","g:RB:2"],
  ["C","g:BL:0","g:BL:0","g:RB:3"],
  ["D","g:TRB:0","g:TRB:0","g:RBL:1"],
  ["E","g:TRBL:0","g:TRBL:0","g:RBL:2"],
  ["F","g:TBL:0","g:TBL:0","g:RBL:3"],
  ["G","g:TR:0","g:TR:0","g:BL:1"],
  ["H","g:TRL:0","g:TRL:0","g:BL:2"],
  ["I","g:TL:0","g:TL:0","g:BL:3"],
  ["J","g:RB:1","x:T:0","g:TRB:1"],
  ["K","g:RBL:1","x:L:0","g:TRB:2"],
  ["L","g:BL:1","x:R:0","g:TRB:3"],
  ["M","g:TRB:1","x:B:0","g:TRBL:1"],
  ["N","g:TRBL:1","g:RB:1","g:TRBL:2"],
  ["O","g:TBL:1","g:RBL:1","g:TRBL:3"],
  ["P","g:TR:1","g:BL:1","g:TBL:1"],
  ["Q","g:TRL:1","g:TRB:1","g:TBL:2"],
  ["R","g:TL:1","g:TRBL:1","g:TBL:3"],
  ["S","x:T:0","g:TBL:1","g:TR:1"],
  ["T","x:L:0","g:TR:1","g:TR:2"],
  ["U","x:R:0","g:TRL:1","g:TR:3"],
  ["V","x:B:0","g:TL:1","g:TRL:1"],
  ["W","x:T:1","x:T:1","g:TRL:2"],
  ["X","x:L:1","x:L:1","g:TRL:3"],
  ["Y","x:R:1","x:R:1","g:TL:1"],
  ["Z","x:B:1","x:B:1","g:TL:2"],
];

for (const [letter, ...ids] of shapes) {
  for (const variant of core.VARIANT_IDS) {
    test(`A-2 set ${variant} letter ${letter}`, () => {
      assert.equal(core.shapeOf(letter, variant), ids[Number(variant) - 1]);
      assert.equal(core.letterOf(ids[Number(variant) - 1], variant), letter);
    });
  }
}

function svgShape(svg) {
  const lines = [...svg.matchAll(/<line\b([^>]+)>/g)].map(match => {
    const attrs = Object.fromEntries([...match[1].matchAll(/(x1|x2|y1|y2)="([^"]+)"/g)]
      .map(m => [m[1], Number(m[2])]));
    return [[attrs.x1, attrs.y1], [attrs.x2, attrs.y2]];
  });
  const dots = [...svg.matchAll(/<circle\b/g)].length;
  const diagonal = lines.filter(([a, b]) => a[0] !== b[0] && a[1] !== b[1]);
  if (diagonal.length) {
    assert.equal(lines.length, 2);
    const vertex = diagonal[0].find(p => diagonal[1].some(q => p[0] === q[0] && p[1] === q[1]));
    const part = { '50,80': 'T', '80,50': 'L', '20,50': 'R', '50,20': 'B' }[String(vertex)];
    assert.ok(part);
    return `x:${part}:${dots}`;
  }
  const walls = new Set(lines.map(([a, b]) => {
    if (a[1] === b[1]) return { 20: 'T', 80: 'B' }[a[1]];
    if (a[0] === b[0]) return { 20: 'L', 80: 'R' }[a[0]];
    return null;
  }));
  assert.ok(!walls.has(undefined) && !walls.has(null));
  return `g:${[...'TRBL'].filter(w => walls.has(w)).join('')}:${dots}`;
}

let glyphCount = 0;
for (const variant of core.VARIANT_IDS) {
  for (const letter of core.LETTERS) {
    glyphCount++;
    test(`SVG shape ${variant}/${letter}`, () => {
      const svg = fs.readFileSync(path.join(root, 'assets/glyphs', variant, letter + '.svg'), 'utf8');
      assert.equal(svgShape(svg), core.shapeOf(letter, variant));
      assert.ok(svg.includes(`<!-- Pigpen set ${variant}: ${letter} (${core.shapeOf(letter, variant)}) -->`));
    });
  }
}
test('exactly 78 glyphs, 26 distinct symbols per set and shared counts', () => {
  assert.equal(glyphCount, 78);
  assert.deepEqual(core.VARIANT_IDS.map(v => new Set(core.VARIANTS[v]).size), [26, 26, 26]);
  assert.deepEqual(new Set(core.VARIANTS[1]), new Set(core.VARIANTS[2]));
  assert.equal(core.VARIANTS[3].filter(s => core.VARIANTS[1].includes(s)).length, 9);
});
