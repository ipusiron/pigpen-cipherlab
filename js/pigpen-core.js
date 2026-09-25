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

const PigpenCore = { LETTERS, GRID_WALLS, X_PARTS, VARIANTS, VARIANT_IDS, isVariant, shapeOf, letterOf, glyphSource,
  normalizeText, tokenize, warnings, encrypt, usage, decodeSequence };

if (typeof module !== 'undefined' && module.exports) module.exports = PigpenCore;
