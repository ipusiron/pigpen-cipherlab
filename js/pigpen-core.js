// Reference implementation.

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Reference implementation.
const GRID_WALLS = ['RB', 'RBL', 'BL', 'TRB', 'TRBL', 'TBL', 'TR', 'TRL', 'TL'];
// Reference implementation.
const X_PARTS = ['T', 'L', 'R', 'B'];

function gridShape(cell, dots) {
  return `g:${GRID_WALLS[cell]}:${dots}`;
}
function xShape(part, dots) {
  return `x:${X_PARTS[part]}:${dots}`;
}

function range(n, f) {
  return Array.from({ length: n }, (_, i) => f(i));
}

// Reference implementation.
const VARIANTS = {
  1: [...range(9, i => gridShape(i, 0)), ...range(9, i => gridShape(i, 1)),
    ...range(4, i => xShape(i, 0)), ...range(4, i => xShape(i, 1))],
  2: [...range(9, i => gridShape(i, 0)), ...range(4, i => xShape(i, 0)),
    ...range(9, i => gridShape(i, 1)), ...range(4, i => xShape(i, 1))],
  3: range(26, i => gridShape(Math.floor(i / 3), (i % 3) + 1))
};
const VARIANT_IDS = ['1', '2', '3'];

function isVariant(id) {
  return VARIANT_IDS.includes(String(id));
}

function shapeOf(letter, variant) {
  const i = LETTERS.indexOf(letter);
  return i < 0 || !isVariant(variant) ? null : VARIANTS[variant][i];
}

function letterOf(shape, variant) {
  if (!isVariant(variant)) return null;
  const i = VARIANTS[variant].indexOf(shape);
  return i < 0 ? null : LETTERS[i];
}

// Reference implementation.
function glyphSource(shape) {
  for (const v of VARIANT_IDS) {
    const letter = letterOf(shape, v);
    if (letter) return { variant: v, letter };
  }
  return null;
}

// Reference implementation.
function normalizeText(text) {
  return String(text).normalize('NFKD').replace(/\p{M}/gu, '').toUpperCase();
}

// Reference implementation.
function tokenize(text, mode) {
  const tokens = [];
  let ignored = 0, spaces = 0;
  for (const ch of normalizeText(text)) {
    if (ch >= 'A' && ch <= 'Z') tokens.push({ type: 'letter', letter: ch });
    else if (/\s/u.test(ch)) {
      spaces++;
      if (mode === 'preserve') tokens.push({ type: ch === '\n' ? 'newline' : 'space' });
    } else ignored++;
  }
  return { tokens, ignored, spaces };
}

// Reference implementation.
function warnings(result, mode) {
  const out = [];
  if (result.ignored > 0) out.push({ key: 'warn.ignored', count: result.ignored });
  if (result.spaces > 0) out.push({ key: mode === 'preserve' ? 'warn.spacesKept' : 'warn.spacesDropped' });
  return out;
}

function encrypt(tokens, variant) {
  return tokens.map(t => t.type === 'letter' ? { ...t, shape: shapeOf(t.letter, variant) } : { ...t });
}

// Reference implementation.
function usage(tokens) {
  const letters = tokens.filter(t => t.type === 'letter').map(t => t.letter);
  return { used: [...new Set(letters)].sort(), last: letters.length ? letters[letters.length - 1] : null };
}

// Reference implementation.
function decodeSequence(items, variant) {
  return items.map(s => (s === ' ' || s === '\n') ? s : (letterOf(s, variant) || '?')).join('');
}

const ENGLISH_FREQ = [8.167, 1.492, 2.782, 4.253, 12.702, 2.228, 2.015, 6.094, 6.966, 0.153, 0.772, 4.025, 2.406,
  6.749, 7.507, 1.929, 0.095, 5.987, 6.327, 9.056, 2.758, 0.978, 2.360, 0.150, 1.974, 0.074];

// Reference implementation.
const WALL_LINES = { T: [20, 20, 80, 20], R: [80, 20, 80, 80], B: [20, 80, 80, 80], L: [20, 20, 20, 80] };
const X_APEX = { T: [50, 80], L: [80, 50], R: [20, 50], B: [50, 20] };
const X_ENDS = { T: [[20, 20], [80, 20]], L: [[20, 20], [20, 80]], R: [[80, 20], [80, 80]], B: [[20, 80], [80, 80]] };
const DOTS = { 0: [], 1: [[50, 50]], 2: [[40, 50], [60, 50]], 3: [[35, 50], [50, 50], [65, 50]] };

function parseShape(shape) {
  const m = /^(g|x):([TRBL]{1,4}):([0-3])$/.exec(String(shape));
  if (!m) return null;
  const s = { kind: m[1], part: m[2], dots: Number(m[3]) };
  if (s.kind === 'g' && !GRID_WALLS.includes(s.part)) return null;
  if (s.kind === 'x' && (!X_PARTS.includes(s.part) || s.dots > 1)) return null;
  return s;
}

function geometry(shape) {
  const s = parseShape(shape);
  if (!s) return null;
  let lines;
  if (s.kind === 'g') lines = [...s.part].map(w => WALL_LINES[w]);
  else lines = X_ENDS[s.part].map(([x, y]) => [...X_APEX[s.part], x, y]);
  return { lines, dots: DOTS[s.dots] };
}

// Reference implementation.
const ALL_SHAPES = (() => {
  const used = new Set(VARIANT_IDS.flatMap(v => VARIANTS[v]));
  const order = [];
  for (const d of [0, 1, 2, 3]) for (const w of GRID_WALLS) order.push(`g:${w}:${d}`);
  for (const d of [0, 1]) for (const p of X_PARTS) order.push(`x:${p}:${d}`);
  return order.filter(s => used.has(s));
})();

// Reference implementation.
function keyedAlphabet(keyword) {
  const seen = new Set();
  for (const ch of normalizeText(keyword)) if (ch >= 'A' && ch <= 'Z') seen.add(ch);
  for (const ch of LETTERS) seen.add(ch);
  return [...seen].join('');
}

// Reference implementation.
function keywordTable(base, keyword) {
  const alpha = keyedAlphabet(keyword);
  return [...LETTERS].map(l => VARIANTS[base][alpha.indexOf(l)]);
}

function tableOf(spec) {
  if (spec && spec.variant === 'keyword') return keywordTable(isVariant(spec.base) ? String(spec.base) : '1', spec.keyword || '');
  return VARIANTS[isVariant(spec && spec.variant) ? String(spec.variant) : '1'];
}

function encryptWith(tokens, table) {
  return tokens.map(t => t.type === 'letter' ? { ...t, shape: table[LETTERS.indexOf(t.letter)] } : { ...t });
}

function decodeWith(items, table) {
  return items.map(s => (s === ' ' || s === '\n') ? s : (table.includes(s) ? LETTERS[table.indexOf(s)] : '?')).join('');
}

// Reference implementation.
function keyLayout(base, alpha) {
  const a = [...alpha];
  const grid = (dots, from) => ({ kind: 'grid', dots, letters: a.slice(from, from + 9) });
  const cross = (dots, from) => ({ kind: 'x', dots, letters: a.slice(from, from + 4) });
  if (String(base) === '1') return [grid(0, 0), grid(1, 9), cross(0, 18), cross(1, 22)];
  if (String(base) === '2') return [grid(0, 0), cross(0, 9), grid(1, 13), cross(1, 22)];
  return [{ kind: 'grid3', dots: null, letters: Array.from({ length: 9 }, (_, i) => a.slice(i * 3, i * 3 + 3).join('')) }];
}

// Reference implementation.
function englishScore(text) {
  const letters = [...text].filter(c => c >= 'A' && c <= 'Z');
  if (!letters.length) return null;
  const sum = letters.reduce((s, c) => s + Math.log10(ENGLISH_FREQ[LETTERS.indexOf(c)] / 100), 0);
  return Math.round(sum / letters.length * 1000) / 1000;
}

// Reference implementation.
function rankVariants(items, candidates) {
  return candidates.map((c, i) => {
    const text = decodeWith(items, c.table);
    return { id: c.id, text, unknown: [...text].filter(ch => ch === '?').length, score: englishScore(text), order: i };
  }).sort((a, b) => a.unknown - b.unknown || (b.score ?? -99) - (a.score ?? -99) || a.order - b.order)
    .map(({ order, ...r }) => r);
}

// Reference implementation.
const EXERCISES = [
  { id: 'dickens', source: 'Charles Dickens, A Tale of Two Cities (1859)',
    text: 'It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness' },
  { id: 'melville', source: 'Herman Melville, Moby-Dick (1851)',
    text: 'Call me Ishmael. Some years ago, never mind how long precisely, having little or no money in my purse' },
  { id: 'austen', source: 'Jane Austen, Pride and Prejudice (1813)',
    text: 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife' },
  { id: 'declaration', source: 'Declaration of Independence (1776)',
    text: 'We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights' },
  { id: 'lincoln', source: 'Abraham Lincoln, Gettysburg Address (1863)',
    text: 'Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty' }
];

// Reference implementation.
function shuffledLetters(randoms) {
  const a = [...LETTERS];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randoms[a.length - 1 - i] % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.join('');
}

// Reference implementation.
function makeExercise(text, randoms) {
  const table = keywordTable('1', shuffledLetters(randoms));
  const tokens = tokenize(text, 'preserve').tokens.filter(t => t.type !== 'newline');
  const items = encryptWith(tokens, table).map(t => t.type === 'letter' ? t.shape : ' ');
  return { items, answer: tokens.map(t => t.type === 'letter' ? t.letter : ' ').join(''), table };
}

// Reference implementation.
function shapeCounts(items) {
  const counts = new Map();
  for (const s of items) if (s !== ' ' && s !== '\n') counts.set(s, (counts.get(s) || 0) + 1);
  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  return [...counts].map(([shape, count]) => ({ shape, count, percent: Math.round(count / total * 1000) / 10 }))
    .sort((a, b) => b.count - a.count || ALL_SHAPES.indexOf(a.shape) - ALL_SHAPES.indexOf(b.shape));
}

// Reference implementation.
function applyGuess(items, guess) {
  return items.map(s => (s === ' ' || s === '\n') ? s : (guess[s] || '_')).join('');
}

// Reference implementation.
function guessConflicts(guess) {
  const n = {};
  for (const l of Object.values(guess)) if (l) n[l] = (n[l] || 0) + 1;
  return Object.keys(n).filter(l => n[l] > 1).sort();
}

function isSolved(items, guess, answer) {
  return applyGuess(items, guess) === answer;
}

// Reference implementation.
function hint(items, guess, answer) {
  const correct = {};
  items.forEach((s, i) => { if (s !== ' ') correct[s] = answer[i]; });
  const next = shapeCounts(items).find(c => guess[c.shape] !== correct[c.shape]);
  return next ? { shape: next.shape, letter: correct[next.shape] } : null;
}

const PigpenCore = { LETTERS, GRID_WALLS, X_PARTS, VARIANTS, VARIANT_IDS, isVariant, shapeOf, letterOf, glyphSource,
  normalizeText, tokenize, warnings, encrypt, usage, decodeSequence,
  ENGLISH_FREQ, parseShape, geometry, ALL_SHAPES, keyedAlphabet, keywordTable, tableOf, encryptWith, decodeWith,
  keyLayout, englishScore, rankVariants, EXERCISES, shuffledLetters, makeExercise, shapeCounts, applyGuess, guessConflicts,
  isSolved, hint };

if (typeof module !== 'undefined' && module.exports) module.exports = PigpenCore;
