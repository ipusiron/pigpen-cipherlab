const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const c = require('../js/pigpen-core.js');

// Literal expected values copied from specification A-2 through A-7.
const geometries = [
  [
    "g:RB:0",
    {
      "lines": [
        [
          80,
          20,
          80,
          80
        ],
        [
          20,
          80,
          80,
          80
        ]
      ],
      "dots": []
    }
  ],
  [
    "g:TRBL:1",
    {
      "lines": [
        [
          20,
          20,
          80,
          20
        ],
        [
          80,
          20,
          80,
          80
        ],
        [
          20,
          80,
          80,
          80
        ],
        [
          20,
          20,
          20,
          80
        ]
      ],
      "dots": [
        [
          50,
          50
        ]
      ]
    }
  ],
  [
    "g:BL:2",
    {
      "lines": [
        [
          20,
          80,
          80,
          80
        ],
        [
          20,
          20,
          20,
          80
        ]
      ],
      "dots": [
        [
          40,
          50
        ],
        [
          60,
          50
        ]
      ]
    }
  ],
  [
    "g:TRL:3",
    {
      "lines": [
        [
          20,
          20,
          80,
          20
        ],
        [
          80,
          20,
          80,
          80
        ],
        [
          20,
          20,
          20,
          80
        ]
      ],
      "dots": [
        [
          35,
          50
        ],
        [
          50,
          50
        ],
        [
          65,
          50
        ]
      ]
    }
  ],
  [
    "x:T:0",
    {
      "lines": [
        [
          50,
          80,
          20,
          20
        ],
        [
          50,
          80,
          80,
          20
        ]
      ],
      "dots": []
    }
  ],
  [
    "x:L:1",
    {
      "lines": [
        [
          80,
          50,
          20,
          20
        ],
        [
          80,
          50,
          20,
          80
        ]
      ],
      "dots": [
        [
          50,
          50
        ]
      ]
    }
  ],
  [
    "x:R:0",
    {
      "lines": [
        [
          20,
          50,
          80,
          20
        ],
        [
          20,
          50,
          80,
          80
        ]
      ],
      "dots": []
    }
  ],
  [
    "x:B:1",
    {
      "lines": [
        [
          50,
          20,
          20,
          80
        ],
        [
          50,
          20,
          80,
          80
        ]
      ],
      "dots": [
        [
          50,
          50
        ]
      ]
    }
  ]
];
for (const [id, expected] of geometries) test('geometry ' + id, () => assert.deepEqual(c.geometry(id), expected));
const bad = ['', 'g:RB', 'g:XX:0', 'x:T:2', 'x:B:3', 'g:RB:4', 'q:T:0',
  'x:TR:0', 'g:RRRR:0', 'g:BR:0', 'g:T:0', 'G:RB:0', ' g:RB:0'];
for (const id of bad) test('invalid ID ' + JSON.stringify(id), () => {
  assert.equal(c.parseShape(id), null);
  assert.equal(c.geometry(id), null);
});
const allShapes = [
  "g:RB:0",
  "g:RBL:0",
  "g:BL:0",
  "g:TRB:0",
  "g:TRBL:0",
  "g:TBL:0",
  "g:TR:0",
  "g:TRL:0",
  "g:TL:0",
  "g:RB:1",
  "g:RBL:1",
  "g:BL:1",
  "g:TRB:1",
  "g:TRBL:1",
  "g:TBL:1",
  "g:TR:1",
  "g:TRL:1",
  "g:TL:1",
  "g:RB:2",
  "g:RBL:2",
  "g:BL:2",
  "g:TRB:2",
  "g:TRBL:2",
  "g:TBL:2",
  "g:TR:2",
  "g:TRL:2",
  "g:TL:2",
  "g:RB:3",
  "g:RBL:3",
  "g:BL:3",
  "g:TRB:3",
  "g:TRBL:3",
  "g:TBL:3",
  "g:TR:3",
  "g:TRL:3",
  "x:T:0",
  "x:L:0",
  "x:R:0",
  "x:B:0",
  "x:T:1",
  "x:L:1",
  "x:R:1",
  "x:B:1"
];
test('43 ordered shapes equal the union without duplicates', () => {
  assert.deepEqual(c.ALL_SHAPES, allShapes);
  assert.equal(c.ALL_SHAPES.length, 43);
  assert.equal(new Set(c.ALL_SHAPES).size, 43);
  assert.deepEqual(new Set(c.ALL_SHAPES), new Set(Object.values(c.VARIANTS).flat()));
  c.ALL_SHAPES.forEach(id => assert.ok(c.parseShape(id)));
});
function attrs(tag) {
  return Object.fromEntries([...tag.matchAll(/(\w+)="([^"]*)"/g)].map(m => [m[1], Number(m[2])]));
}
const lineSet = lines => lines.map(l => [l.slice(0, 2).join(','), l.slice(2).join(',')].sort().join('|')).sort();
let compared = 0;
for (const variant of c.VARIANT_IDS) for (const letter of c.LETTERS) {
  compared++;
  test('geometry equals SVG ' + variant + '/' + letter, () => {
    const svg = fs.readFileSync(path.join(__dirname, '../assets/glyphs', variant, letter + '.svg'), 'utf8');
    const lines = [...svg.matchAll(/<line\b[^>]*>/g)].map(m => {
      const a = attrs(m[0]);
      return [a.x1, a.y1, a.x2, a.y2];
    });
    const dots = [...svg.matchAll(/<circle\b[^>]*>/g)].map(m => {
      const a = attrs(m[0]);
      return [a.cx, a.cy];
    });
    const geometry = c.geometry(c.shapeOf(letter, variant));
    assert.deepEqual(lineSet(geometry.lines), lineSet(lines));
    assert.deepEqual(geometry.dots.map(String).sort(), dots.map(String).sort());
  });
}
test('78 SVG files checked', () => assert.equal(compared, 78));
const alphabets = [
  [
    "PIGPEN",
    "PIGENABCDFHJKLMOQRSTUVWXYZ"
  ],
  [
    "pig pen",
    "PIGENABCDFHJKLMOQRSTUVWXYZ"
  ],
  [
    "Kryptos!",
    "KRYPTOSABCDEFGHIJLMNQUVWXZ"
  ],
  [
    "",
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  ],
  [
    "ZYX",
    "ZYXABCDEFGHIJKLMNOPQRSTUVW"
  ],
  [
    "\uff41\uff42c",
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  ],
  [
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  ]
];
for (const [keyword, expected] of alphabets) test('keyed alphabet ' + keyword, () => {
  assert.equal(c.keyedAlphabet(keyword), expected);
});
const keyed = [
  [
    "A",
    "g:TBL:0",
    "g:RBL:3"
  ],
  [
    "B",
    "g:TR:0",
    "g:BL:1"
  ],
  [
    "C",
    "g:TRL:0",
    "g:BL:2"
  ],
  [
    "D",
    "g:TL:0",
    "g:BL:3"
  ],
  [
    "E",
    "g:TRB:0",
    "g:RBL:1"
  ],
  [
    "F",
    "g:RB:1",
    "g:TRB:1"
  ],
  [
    "G",
    "g:BL:0",
    "g:RB:3"
  ],
  [
    "H",
    "g:RBL:1",
    "g:TRB:2"
  ],
  [
    "I",
    "g:RBL:0",
    "g:RB:2"
  ],
  [
    "J",
    "g:BL:1",
    "g:TRB:3"
  ],
  [
    "K",
    "g:TRB:1",
    "g:TRBL:1"
  ],
  [
    "L",
    "g:TRBL:1",
    "g:TRBL:2"
  ],
  [
    "M",
    "g:TBL:1",
    "g:TRBL:3"
  ],
  [
    "N",
    "g:TRBL:0",
    "g:RBL:2"
  ],
  [
    "O",
    "g:TR:1",
    "g:TBL:1"
  ],
  [
    "P",
    "g:RB:0",
    "g:RB:1"
  ],
  [
    "Q",
    "g:TRL:1",
    "g:TBL:2"
  ],
  [
    "R",
    "g:TL:1",
    "g:TBL:3"
  ],
  [
    "S",
    "x:T:0",
    "g:TR:1"
  ],
  [
    "T",
    "x:L:0",
    "g:TR:2"
  ],
  [
    "U",
    "x:R:0",
    "g:TR:3"
  ],
  [
    "V",
    "x:B:0",
    "g:TRL:1"
  ],
  [
    "W",
    "x:T:1",
    "g:TRL:2"
  ],
  [
    "X",
    "x:L:1",
    "g:TRL:3"
  ],
  [
    "Y",
    "x:R:1",
    "g:TL:1"
  ],
  [
    "Z",
    "x:B:1",
    "g:TL:2"
  ]
];
test('all 26 keyed positions in bases 1 and 3', () => {
  for (const [letter, one, three] of keyed) {
    assert.equal(c.keywordTable('1', 'PIGPEN')[c.LETTERS.indexOf(letter)], one);
    assert.equal(c.keywordTable('3', 'PIGPEN')[c.LETTERS.indexOf(letter)], three);
  }
  assert.deepEqual(c.keywordTable('2', ''), c.VARIANTS[2]);
  assert.deepEqual(c.tableOf({ variant: 2 }), c.VARIANTS[2]);
  assert.deepEqual(c.tableOf({ variant: 9 }), c.VARIANTS[1]);
  assert.deepEqual(c.tableOf({ variant: 'keyword', base: 5, keyword: 'PIGPEN' }), c.keywordTable('1', 'PIGPEN'));
});
test('HELLO keyed examples', () => {
  const tokens = c.tokenize('HELLO', 'ignore').tokens;
  const display = (base, key) => c.encryptWith(tokens, c.keywordTable(base, key)).map(t => t.letter + '=' + t.shape).join(' ');
  assert.equal(display('1', 'PIGPEN'), 'H=g:RBL:1 E=g:TRB:0 L=g:TRBL:1 L=g:TRBL:1 O=g:TR:1');
  assert.equal(display('3', 'KRYPTOS'), 'H=g:TRBL:3 E=g:TRB:3 L=g:TBL:3 L=g:TBL:3 O=g:RBL:3');
});
const layouts = [
  [
    "1",
    [
      {
        "kind": "grid",
        "dots": 0,
        "letters": [
          "P",
          "I",
          "G",
          "E",
          "N",
          "A",
          "B",
          "C",
          "D"
        ]
      },
      {
        "kind": "grid",
        "dots": 1,
        "letters": [
          "F",
          "H",
          "J",
          "K",
          "L",
          "M",
          "O",
          "Q",
          "R"
        ]
      },
      {
        "kind": "x",
        "dots": 0,
        "letters": [
          "S",
          "T",
          "U",
          "V"
        ]
      },
      {
        "kind": "x",
        "dots": 1,
        "letters": [
          "W",
          "X",
          "Y",
          "Z"
        ]
      }
    ]
  ],
  [
    "2",
    [
      {
        "kind": "grid",
        "dots": 0,
        "letters": [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I"
        ]
      },
      {
        "kind": "x",
        "dots": 0,
        "letters": [
          "J",
          "K",
          "L",
          "M"
        ]
      },
      {
        "kind": "grid",
        "dots": 1,
        "letters": [
          "N",
          "O",
          "P",
          "Q",
          "R",
          "S",
          "T",
          "U",
          "V"
        ]
      },
      {
        "kind": "x",
        "dots": 1,
        "letters": [
          "W",
          "X",
          "Y",
          "Z"
        ]
      }
    ]
  ],
  [
    "3",
    [
      {
        "kind": "grid3",
        "dots": null,
        "letters": [
          "ABC",
          "DEF",
          "GHI",
          "JKL",
          "MNO",
          "PQR",
          "STU",
          "VWX",
          "YZ"
        ]
      }
    ]
  ]
];
for (const [base, expected] of layouts) test('layout base ' + base, () => {
  assert.deepEqual(c.keyLayout(base, c.keyedAlphabet(base === '1' ? 'PIGPEN' : '')), expected);
});
const scores = [
  [
    "HELLO WORLD",
    -1.277
  ],
  [
    "HEPPS WSVPD",
    -1.466
  ],
  [
    "??GGP ?PYG?",
    -1.704
  ],
  [
    "",
    null
  ],
  [
    "????",
    null
  ],
  [
    "E",
    -0.896
  ],
  [
    "Z",
    -3.131
  ]
];
for (const [text, expected] of scores) test('English score ' + text, () => assert.equal(c.englishScore(text), expected));
const rankings = [
  [
    "dickens|1",
    "1:0:-1.219 keyword:0:-1.381 2:0:-1.685 3:68:-1.942"
  ],
  [
    "dickens|2",
    "2:0:-1.219 keyword:0:-1.402 1:0:-1.439 3:48:-1.431"
  ],
  [
    "dickens|3",
    "3:0:-1.219 2:58:-1.157 keyword:58:-1.435 1:58:-1.912"
  ],
  [
    "dickens|keyword",
    "keyword:0:-1.219 1:0:-1.535 2:0:-1.715 3:59:-1.32"
  ],
  [
    "melville|1",
    "1:0:-1.283 2:0:-1.576 keyword:0:-1.601 3:46:-1.853"
  ],
  [
    "melville|2",
    "2:0:-1.283 keyword:0:-1.55 1:0:-1.557 3:49:-1.455"
  ],
  [
    "melville|3",
    "3:0:-1.283 2:52:-1.365 keyword:52:-1.646 1:52:-1.756"
  ],
  [
    "melville|keyword",
    "keyword:0:-1.283 1:0:-1.406 2:0:-1.486 3:52:-1.523"
  ],
  [
    "austen|1",
    "1:0:-1.266 keyword:0:-1.457 2:0:-1.552 3:64:-1.728"
  ],
  [
    "austen|2",
    "2:0:-1.266 keyword:0:-1.511 1:0:-1.618 3:50:-1.437"
  ],
  [
    "austen|3",
    "3:0:-1.266 2:64:-1.236 keyword:64:-1.593 1:64:-2.046"
  ],
  [
    "austen|keyword",
    "keyword:0:-1.266 1:0:-1.466 2:0:-1.581 3:68:-1.438"
  ],
  [
    "declaration|1",
    "1:0:-1.217 keyword:0:-1.443 2:0:-1.495 3:89:-1.736"
  ],
  [
    "declaration|2",
    "2:0:-1.217 keyword:0:-1.428 1:0:-1.453 3:73:-1.436"
  ],
  [
    "declaration|3",
    "3:0:-1.217 2:92:-1.248 keyword:92:-1.537 1:92:-2.257"
  ],
  [
    "declaration|keyword",
    "keyword:0:-1.217 1:0:-1.435 2:0:-1.568 3:85:-1.519"
  ],
  [
    "lincoln|1",
    "1:0:-1.24 keyword:0:-1.405 2:0:-1.499 3:60:-1.676"
  ],
  [
    "lincoln|2",
    "2:0:-1.24 keyword:0:-1.455 1:0:-1.635 3:43:-1.409"
  ],
  [
    "lincoln|3",
    "3:0:-1.24 2:71:-1.319 keyword:71:-1.689 1:71:-2.156"
  ],
  [
    "lincoln|keyword",
    "keyword:0:-1.24 1:0:-1.458 2:0:-1.525 3:64:-1.384"
  ],
  [
    "HELLO WORLD|1",
    "1:0:-1.277:HELLO WORLD 2:0:-1.466:HEPPS WSVPD 3:4:-1.704:??GGP ?PYG?"
  ],
  [
    "HELLO WORLD|2",
    "2:0:-1.277:HELLO WORLD 1:0:-1.518:HEUUK WKNUD 3:7:-1.454:????D ?DM??"
  ],
  [
    "HELLO WORLD|3",
    "3:0:-1.277:HELLO WORLD 2:9:-1.125:????? ????O 1:9:-2.112:????? ????K"
  ],
  [
    "X MARKS THE SPOT|1",
    "1:0:-1.408:X MARKS THE SPOT 2:0:-1.867:X QAVOJ KHE JTSK 3:8:-1.761:? J?YD? ??? ?SP?"
  ],
  [
    "X MARKS THE SPOT|2",
    "2:0:-1.408:X MARKS THE SPOT 1:0:-1.495:X VANTO PHE OLKP 3:6:-1.502:? ??M?P S?? PGDS"
  ],
  [
    "X MARKS THE SPOT|3",
    "3:0:-1.408:X MARKS THE SPOT 2:8:-1.136:? RN??T ??? TS?? 1:8:-1.708:? NJ??P ??? PO??"
  ]
];
const itemsFor = (text, table) => c.encryptWith(c.tokenize(text, 'preserve').tokens, table)
  .map(t => t.type === 'letter' ? t.shape : ' ');
for (const [input, expected] of rankings) test('ranking ' + input, () => {
  const [name, written] = input.split('|');
  const exercise = c.EXERCISES.find(e => e.id === name);
  const candidates = c.VARIANT_IDS.map(id => ({ id, table: c.VARIANTS[id] }));
  const keyword = c.keywordTable('1', 'PIGPEN');
  if (exercise) candidates.push({ id: 'keyword', table: keyword });
  const items = itemsFor(exercise ? exercise.text : name, written === 'keyword' ? keyword : c.VARIANTS[written]);
  const actual = c.rankVariants(items, candidates).map(r =>
    [r.id, r.unknown, r.score, ...(!exercise ? [r.text] : [])].join(':')).join(' ');
  assert.equal(actual, expected);
});
const randoms = [
  0,
  2654435761,
  1013904226,
  3668339987,
  2027808452,
  387276917,
  3041712678,
  1401181143,
  4055616904,
  2415085369,
  774553834,
  3428989595,
  1788458060,
  147926525,
  2802362286,
  1161830751,
  3816266512,
  2175734977,
  535203442,
  3189639203,
  1549107668,
  4203543429,
  2563011894,
  922480359,
  3576916120,
  1936384585
];
const expectedItems = [
  "g:TBL:1",
  "g:TRB:0",
  "x:R:0",
  "g:TRL:1",
  " ",
  "x:L:0",
  "g:RB:1",
  "g:TRB:0",
  "g:TRL:1",
  "g:TL:1",
  " ",
  "x:B:1",
  "g:RBL:1",
  "g:RBL:0",
  " ",
  "x:L:0",
  "g:TL:1",
  "x:T:1",
  "g:TL:1",
  "g:RBL:1",
  " ",
  "g:TBL:0",
  "g:TL:1",
  "x:B:1",
  "g:TRL:1",
  "x:L:0",
  " ",
  "x:B:1",
  "g:TRB:1",
  "g:TRB:0",
  " ",
  "g:TRB:0",
  "x:R:0",
  "g:TRL:1",
  " ",
  "g:TBL:1",
  "x:B:1",
  "x:T:0",
  "g:TL:0",
  "g:TL:1",
  "g:TRL:1",
  "x:L:0",
  " ",
  "g:RB:0",
  "g:TRL:1",
  "g:TRB:0",
  "x:R:0",
  "g:TRB:1",
  "g:TL:0",
  "x:T:0",
  " ",
  "g:TBL:1",
  "g:TRB:0",
  "g:TRL:1",
  "x:T:0",
  "g:TL:0",
  " ",
  "g:TRB:0",
  "g:RBL:1",
  " ",
  "x:T:0",
  "g:TL:0",
  "g:TR:0",
  "x:L:0",
  " ",
  "g:RB:1",
  "g:TRB:0",
  "g:RBL:1",
  "x:T:0",
  "g:TR:0",
  "g:RBL:1",
  "g:TL:1",
  "g:RBL:1",
  "x:T:0",
  " ",
  "x:B:1",
  " ",
  "g:RBL:1",
  "g:TL:1",
  "g:TR:1",
  " ",
  "g:RBL:1",
  "x:B:1",
  "x:T:0",
  "g:TR:0",
  "g:TRB:0",
  "g:RBL:1",
  " ",
  "g:RB:1",
  "g:TRB:0",
  "g:RBL:1",
  "g:RB:1",
  "g:TL:1",
  "g:TR:0",
  "x:T:1",
  "g:TL:1",
  "g:RBL:0",
  " ",
  "g:TR:0",
  "g:RBL:1",
  " ",
  "x:R:1",
  "g:TR:0",
  "g:RB:0",
  "g:TL:1",
  "g:TRL:1",
  "x:T:0",
  "g:TBL:0"
];
const expectedAnswer = "FOUR SCORE AND SEVEN YEARS AGO OUR FATHERS BROUGHT FORTH ON THIS CONTINENT A NEW NATION CONCEIVED IN LIBERTY";
test('fixed exercise, counts, hint, guesses and solution', () => {
  assert.equal(c.shuffledLetters(randoms), 'BDZOPYIJHCNMGQFWRETSUXVKLA');
  const exercise = c.makeExercise(c.EXERCISES.find(e => e.id === 'lincoln').text, randoms);
  assert.equal(exercise.answer, expectedAnswer);
  assert.deepEqual(exercise.items, expectedItems);
  assert.deepEqual(c.shapeCounts(exercise.items).slice(0, 6), [
    { shape: 'g:RBL:1', count: 11, percent: 12.2 }, { shape: 'g:TRB:0', count: 10, percent: 11.1 },
    { shape: 'g:TL:1', count: 10, percent: 11.1 }, { shape: 'g:TRL:1', count: 8, percent: 8.9 },
    { shape: 'x:T:0', count: 8, percent: 8.9 }, { shape: 'g:TR:0', count: 6, percent: 6.7 }
  ]);
  assert.equal(c.shapeCounts(exercise.items).length, 19);
  assert.equal(c.applyGuess(exercise.items, { 'g:RBL:1': 'E' }),
    "____ _____ _E_ ____E _____ ___ ___ _______ _______ _____ _E ____ __E__E_E_ _ E__ E____E __E______ _E _______");
  assert.deepEqual(c.hint(exercise.items, {}, exercise.answer), { shape: 'g:RBL:1', letter: 'N' });
  const correct = Object.fromEntries(exercise.table.map((shape, i) => [shape, c.LETTERS[i]]));
  assert.equal(c.isSolved(exercise.items, correct, exercise.answer), true);
  assert.deepEqual(c.guessConflicts({ 'g:RB:0': 'E', 'g:TR:0': 'E', 'x:T:0': 'T', 'x:L:0': '' }), ['E']);
});
const sources = [
  ['dickens', 'Charles Dickens, A Tale of Two Cities (1859)', 82, 16],
  ['melville', 'Herman Melville, Moby-Dick (1851)', 80, 19],
  ['austen', 'Jane Austen, Pride and Prejudice (1813)', 92, 22],
  ['declaration', 'Declaration of Independence (1776)', 117, 21],
  ['lincoln', 'Abraham Lincoln, Gettysburg Address (1863)', 90, 19]
];
test('five sources and letter counts', () => {
  assert.equal(c.EXERCISES.length, 5);
  c.EXERCISES.forEach((e, i) => {
    const letters = c.tokenize(e.text, 'ignore').tokens.map(t => t.letter);
    assert.deepEqual([e.id, e.source, letters.length, new Set(letters).size], sources[i]);
  });
});
for (const [i, values] of [randoms, Array(26).fill(0), Array(26).fill(4294967295),
  Array.from({ length: 26 }, (_, n) => n), Array.from({ length: 26 }, (_, n) => 25 - n)].entries()) {
  test('shuffle permutation ' + i, () => {
    const shuffled = c.shuffledLetters(values);
    assert.equal(shuffled.length, 26);
    assert.equal(new Set(shuffled).size, 26);
    assert.equal([...shuffled].sort().join(''), c.LETTERS);
  });
}
