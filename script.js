// One cipher state; every dependent view is derived from it.
const state = { variant: '1', spaceMode: 'ignore', text: '', decodeItems: [], keyword: '', keywordBase: '1' };
let currentTable;
let mappingSignature;
state.keyMode = 'letters';
state.exercise = { textId: 'dickens', items: [], answer: '', guess: {}, revealed: false };
const encryptGlyphSelect = document.getElementById("encryptGlyphSelect");
const decryptGlyphSelect = document.getElementById("decryptGlyphSelect");
const learningGlyphSelect = document.getElementById("learningGlyphSelect");

function changeVariant(event) {
  if (!PigpenCore.isVariant(event.target.value) && event.target.value !== 'keyword') return;
  state.variant = event.target.value;
  render();
}

[encryptGlyphSelect, decryptGlyphSelect, learningGlyphSelect].forEach(select => {
  select.addEventListener("change", changeVariant);
});

// 空白処理トグルボタンの処理
const ignoreSpaceBtn = document.getElementById("ignoreSpaceBtn");
const preserveSpaceBtn = document.getElementById("preserveSpaceBtn");
const currentModeText = document.getElementById("currentModeText");

function updateSpaceMode(newMode) {
  state.spaceMode = newMode;
  render();
}

function updateWarningMessage(result) {
  const messages = PigpenCore.warnings(result, state.spaceMode);
  warningMessage.replaceChildren();
  messages.forEach(message => {
    const line = document.createElement('p');
    line.dataset.message = message.key;
    const key = message.key === 'warn.ignored' && message.count === 1 ? 'warn.ignoredOne' : message.key;
    line.textContent = i18n.t(key, message);
    warningMessage.appendChild(line);
  });
  warningMessage.hidden = messages.length === 0;
}

ignoreSpaceBtn.addEventListener("click", () => {
  updateSpaceMode("ignore");
});

preserveSpaceBtn.addEventListener("click", () => {
  updateSpaceMode("preserve");
});

// Tabs use a roving tab stop; changing language does not change the active tab.
const tabs = [...document.querySelectorAll('.tab-button')];
function activateTab(button) {
  tabs.forEach(tab => {
    const active = tab === button;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.dataset.tab).classList.toggle('active', active);
  });
}
tabs.forEach((button, index) => {
  button.addEventListener('click', () => activateTab(button));
  button.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const next = tabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
    activateTab(next);
    next.focus();
  });
});

// A〜Zのアルファベットに対応するピッグペン記号を出力（仮：SVG画像として）

const plaintextArea = document.getElementById("plaintext");
const cipherOutput = document.getElementById("cipherOutput");
const warningMessage = document.getElementById("warningMessage");

// 暗号化処理を関数として定義
function encryptText(result) {
  const tokens = PigpenCore.encryptWith(result.tokens, currentTable);
  const usage = PigpenCore.usage(result.tokens);
  cipherOutput.replaceChildren();

  document.querySelectorAll('.reference-item').forEach(item => {
    const letter = item.dataset.letter;
    item.classList.toggle('highlight', usage.used.includes(letter) && letter !== usage.last);
    item.classList.toggle('highlight-recent', letter === usage.last);
  });

  for (const token of tokens) {
    const item = document.createElement('div');
    if (token.type !== 'letter') {
      item.className = token.type === 'newline' ? 'cipher-newline' : 'cipher-space';
    } else {
      item.className = 'cipher-item';
      item.dataset.shape = token.shape;
      const img = createGlyph(token.shape, { className: 'cipher-glyph' });
      const label = document.createElement('span');
      label.className = 'cipher-letter';
      label.textContent = token.letter;
      item.append(img, label);
    }
    cipherOutput.appendChild(item);
  }
}

function svgElement(name, attributes = {}) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', name);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
  return element;
}

function createGlyph(shape, options = {}) {
  const geometry = PigpenCore.geometry(shape);
  if (!geometry) throw new Error('Unknown shape');
  const svg = svgElement('svg', { viewBox: '0 0 100 100', class: 'model-glyph ' + (options.className || '') });
  svg.dataset.shape = shape;
  if (options.decorative) svg.setAttribute('aria-hidden', 'true');
  else {
    svg.setAttribute('role', 'img');
    const description = i18n.describeShape(shape);
    svg.setAttribute('aria-label', description);
    const title = svgElement('title');
    title.textContent = description;
    svg.appendChild(title);
  }
  geometry.lines.forEach(([x1, y1, x2, y2]) => svg.appendChild(svgElement('line', { x1, y1, x2, y2 })));
  geometry.dots.forEach(([cx, cy]) => svg.appendChild(svgElement('circle', { cx, cy, r: 4 })));
  return svg;
}

plaintextArea.addEventListener('input', () => {
  state.text = plaintextArea.value;
  render();
});

// 復号用のグリフボタン生成（初期表示）
const glyphButtons = document.getElementById("glyphButtons");
const decryptedText = document.getElementById("decryptedText");
const resetButton = document.getElementById("resetButton");

const alphabet = PigpenCore.LETTERS;

// 復号用グリフボタンの生成
function updateGlyphButtons() {
  glyphButtons.replaceChildren();
  
  // A-Zのボタンを生成
  const keys = state.keyMode === 'shapes' ? PigpenCore.ALL_SHAPES : currentTable;
  keys.forEach((shape, index) => {
    const char = state.keyMode === 'shapes' ? '' : alphabet[index];
    const glyphItem = document.createElement("button");
    glyphItem.type = 'button';
    glyphItem.dataset.letter = char;
    glyphItem.dataset.shape = shape;
    glyphItem.setAttribute('aria-label', char ? i18n.t('decode.key', { letter: char }) : i18n.describeShape(shape));
    glyphItem.className = "cipher-item";
    
    const img = createGlyph(shape, { className: 'cipher-glyph' });

    const letterLabel = document.createElement("span");
    letterLabel.className = "cipher-letter";
    letterLabel.textContent = char;

    glyphItem.addEventListener("click", () => {
      state.decodeItems.push(shape);
      renderReading();
    });

    glyphItem.appendChild(img);
    if (char) glyphItem.appendChild(letterLabel);
    glyphButtons.appendChild(glyphItem);
  });
  
  // 空白ボタンを追加
  const spaceButton = document.createElement("button");
  spaceButton.type = 'button';
  spaceButton.id = 'decodeSpace';
  spaceButton.className = "space-button";
  spaceButton.title = i18n.t('decode.space');
  spaceButton.textContent = i18n.t('decode.space');
  
  spaceButton.addEventListener("click", () => {
    state.decodeItems.push(' ');
    renderReading();
  });
  
  glyphButtons.appendChild(spaceButton);
  
  // DELボタンを追加
  const delButton = document.createElement("button");
  delButton.type = 'button';
  delButton.id = 'decodeDelete';
  delButton.className = "space-button";
  delButton.title = i18n.t('decode.delete');
  delButton.setAttribute('aria-label', i18n.t('decode.delete'));
  delButton.textContent = "DEL";
  
  delButton.addEventListener("click", () => {
    state.decodeItems.pop();
    renderReading();
  });
  
  glyphButtons.appendChild(delButton);
}

// Initial drawing is performed once after all view elements exist.

const copyButton = document.getElementById("copyButton");
const copyToast = document.getElementById("copyToast");
let copyMessage = 'copy.success';

copyButton.addEventListener("click", async () => {
  const text = decryptedText.textContent;
  
  if (text.length === 0) {
    return;
  }
  
  try {
    await navigator.clipboard.writeText(text);
    
    copyMessage = 'copy.success';
    copyToast.textContent = i18n.t(copyMessage);
    copyToast.classList.remove('error');
    copyToast.classList.add("show");
    
    // 2秒後にトーストを非表示
    setTimeout(() => {
      copyToast.classList.remove("show");
    }, 2000);
    
  } catch (err) {
    copyMessage = 'copy.failure';
    copyToast.textContent = i18n.t(copyMessage);
    copyToast.classList.add('show', 'error');
  }
});

resetButton.addEventListener("click", () => {
  state.decodeItems = [];
  renderReading();
});

// アルファベット対応表の生成
const alphabetReference = document.getElementById("alphabetReference");

function updateAlphabetReference() {
  alphabetReference.replaceChildren();
  alphabet.split("").forEach((char) => {
    const referenceItem = document.createElement("div");
    referenceItem.className = "reference-item";
    referenceItem.setAttribute("data-letter", char);
    
    const letterSpan = document.createElement("span");
    letterSpan.className = "reference-letter";
    letterSpan.textContent = char;
    
    const img = createGlyph(currentTable[alphabet.indexOf(char)], { className: 'reference-glyph' });
    
    referenceItem.appendChild(letterSpan);
    referenceItem.appendChild(img);
    alphabetReference.appendChild(referenceItem);
  });
}

const keyMappingImage = document.getElementById("keyMappingImage");

function renderReading() {
  decryptedText.textContent = PigpenCore.decodeWith(state.decodeItems, currentTable);
  const sequence = document.getElementById('decodeSequence');
  sequence.replaceChildren();
  sequence.setAttribute('aria-label', i18n.t('decode.sequence'));
  // Group symbols by word so that the sequence wraps between words, not inside them.
  let word = null;
  const flushWord = () => {
    if (word) sequence.appendChild(word);
    word = null;
  };
  for (const shape of state.decodeItems) {
    if (shape === ' ' || shape === '\n') {
      flushWord();
      const spacer = document.createElement('span');
      spacer.className = shape === '\n' ? 'cipher-newline' : 'cipher-space';
      sequence.appendChild(spacer);
    } else {
      if (!word) {
        word = document.createElement('span');
        word.className = 'decode-word';
      }
      word.appendChild(createGlyph(shape, { className: 'cipher-glyph' }));
    }
  }
  flushWord();
  const unknown = document.getElementById('decodeUnknown');
  unknown.textContent = i18n.t('decode.unknown');
  unknown.hidden = !decryptedText.textContent.includes('?');
  renderRanking();
}

document.getElementById('letterKeys').addEventListener('click', () => setKeyMode('letters'));
document.getElementById('shapeKeys').addEventListener('click', () => setKeyMode('shapes'));
function setKeyMode(mode) {
  state.keyMode = mode;
  document.getElementById('letterKeys').setAttribute('aria-pressed', String(mode === 'letters'));
  document.getElementById('shapeKeys').setAttribute('aria-pressed', String(mode === 'shapes'));
  updateGlyphButtons();
}

document.querySelectorAll('[data-sample]').forEach(button => button.addEventListener('click', () => {
  const index = Number(button.dataset.sample);
  const texts = ['X MARKS THE SPOT', PigpenCore.EXERCISES[0].text, PigpenCore.EXERCISES[1].text];
  const tokens = PigpenCore.tokenize(texts[index], 'preserve').tokens;
  state.decodeItems = PigpenCore.encryptWith(tokens, PigpenCore.VARIANTS[index + 1])
    .map(token => token.type === 'letter' ? token.shape : ' ');
  renderReading();
}));

function mappingName(id) {
  return id === 'keyword' ? i18n.t('keyword.option') : i18n.t('rank.mapping', { variant: id });
}

function renderRanking() {
  const table = document.getElementById('variantRanking');
  const status = document.getElementById('rankStatus');
  table.replaceChildren();
  const hasSymbols = state.decodeItems.some(s => s !== ' ' && s !== '\n');
  table.hidden = !hasSymbols;
  if (!hasSymbols) {
    status.textContent = i18n.t('rank.empty');
    return;
  }
  const candidates = PigpenCore.VARIANT_IDS.map(id => ({ id, table: PigpenCore.VARIANTS[id] }));
  if (state.keyword) candidates.push({ id: 'keyword', table: PigpenCore.keywordTable(state.keywordBase, state.keyword) });
  const results = PigpenCore.rankVariants(state.decodeItems, candidates);
  status.textContent = i18n.t('rank.best', { name: mappingName(results[0].id) });
  const head = document.createElement('thead');
  const heading = document.createElement('tr');
  ['position', 'mappingHeader', 'reading', 'unknown', 'score', 'action'].forEach(key => {
    const cell = document.createElement('th');
    cell.scope = 'col';
    cell.textContent = i18n.t(`rank.${key}`);
    heading.appendChild(cell);
  });
  head.appendChild(heading);
  const body = document.createElement('tbody');
  results.forEach((result, index) => {
    const row = document.createElement('tr');
    row.dataset.variant = result.id;
    [index + 1, mappingName(result.id), result.text, result.unknown, result.score ?? '—'].forEach(value => {
      const cell = document.createElement('td');
      cell.textContent = String(value);
      row.appendChild(cell);
    });
    if (!index) {
      const badge = document.createElement('span');
      badge.className = 'rank-badge';
      badge.textContent = i18n.t('rank.badge');
      row.children[1].appendChild(badge);
    }
    const action = document.createElement('td');
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = i18n.t('rank.use');
    button.addEventListener('click', () => {
      state.variant = result.id;
      render();
      document.querySelector('#variantRanking tr[data-variant="' + result.id + '"] button').focus();
    });
    action.appendChild(button);
    row.appendChild(action);
    body.appendChild(row);
  });
  table.append(head, body);
}

function render() {
  currentTable = PigpenCore.tableOf({ variant: state.variant, base: state.keywordBase, keyword: state.keyword });
  [encryptGlyphSelect, decryptGlyphSelect, learningGlyphSelect].forEach(select => {
    select.value = state.variant;
  });
  ignoreSpaceBtn.classList.toggle('active', state.spaceMode === 'ignore');
  preserveSpaceBtn.classList.toggle('active', state.spaceMode === 'preserve');
  ignoreSpaceBtn.setAttribute('aria-pressed', String(state.spaceMode === 'ignore'));
  preserveSpaceBtn.setAttribute('aria-pressed', String(state.spaceMode === 'preserve'));
  currentModeText.textContent = i18n.t(`mode.${state.spaceMode}`);
  const result = PigpenCore.tokenize(state.text, state.spaceMode);
  const signature = JSON.stringify([state.variant, state.keyword, state.keywordBase, i18n.language]);
  if (signature !== mappingSignature) {
    renderKeywordControls();
    updateAlphabetReference();
    updateGlyphButtons();
    renderMapping();
    document.querySelectorAll('[data-glyph]').forEach(host => {
      host.replaceChildren(createGlyph(host.dataset.glyph, { className: 'reading-glyph' }));
    });
    mappingSignature = signature;
  }
  encryptText(result);
  updateWarningMessage(result);
  renderReading();
  copyToast.textContent = i18n.t(copyMessage);
  renderExercise();
}

function renderKeywordControls() {
  document.querySelectorAll('[data-keyword-panel]').forEach(panel => {
    panel.hidden = state.variant !== 'keyword';
    panel.querySelector('input').value = state.keyword;
    panel.querySelector('select').value = state.keywordBase;
    panel.querySelector('p').textContent = PigpenCore.keyedAlphabet(state.keyword);
  });
}

document.querySelectorAll('[data-keyword-input]').forEach(input => input.addEventListener('input', () => {
  state.keyword = input.value.slice(0, 40);
  render();
}));
document.querySelectorAll('[data-keyword-base]').forEach(select => select.addEventListener('change', () => {
  state.keywordBase = select.value;
  render();
}));

function renderMapping() {
  const keyed = state.variant === 'keyword';
  const host = document.getElementById('keywordMapping');
  host.hidden = !keyed;
  keyMappingImage.hidden = keyed;
  host.replaceChildren();
  const note = document.getElementById('mappingNote');
  if (!keyed) {
    keyMappingImage.src = `assets/glyphs/${state.variant}/key_mapping.svg`;
    keyMappingImage.alt = i18n.t('mapping.alt', { variant: state.variant });
    note.textContent = i18n.t(`mapping.${state.variant}`);
    return;
  }
  const alpha = PigpenCore.keyedAlphabet(state.keyword);
  note.textContent = i18n.t('keyword.note', { base: state.keywordBase, alphabet: alpha });
  for (const section of PigpenCore.keyLayout(state.keywordBase, alpha)) {
    const svg = svgElement('svg', { viewBox: '0 0 300 300', class: 'key-diagram', role: 'img' });
    svg.setAttribute('aria-label', section.letters.join(' '));
    const lines = section.kind === 'x'
      ? [[10, 10, 290, 290], [290, 10, 10, 290]]
      : [[100, 0, 100, 300], [200, 0, 200, 300], [0, 100, 300, 100], [0, 200, 300, 200]];
    lines.forEach(([x1, y1, x2, y2]) => svg.appendChild(svgElement('line', { x1, y1, x2, y2 })));
    section.letters.forEach((letters, index) => {
      const [x, y] = section.kind === 'x' ? [[150, 50], [50, 150], [250, 150], [150, 250]][index]
        : [50 + index % 3 * 100, 50 + Math.floor(index / 3) * 100];
      const text = svgElement('text', { x, y });
      text.textContent = letters;
      svg.appendChild(text);
      if (section.dots) svg.appendChild(svgElement('circle', { cx: x, cy: y + 24, r: 4 }));
    });
    host.appendChild(svg);
  }
}

const exerciseText = document.getElementById('exerciseText');
PigpenCore.EXERCISES.forEach(exercise => {
  const option = document.createElement('option');
  option.value = exercise.id;
  option.textContent = exercise.source;
  exerciseText.appendChild(option);
});

function newExercise() {
  const textId = exerciseText.value;
  if (!globalThis.crypto || typeof crypto.getRandomValues !== 'function') {
    state.exercise = { textId, items: [], answer: '', guess: {}, revealed: false };
  } else {
    const randoms = crypto.getRandomValues(new Uint32Array(26));
    const problem = PigpenCore.makeExercise(PigpenCore.EXERCISES.find(e => e.id === textId).text, randoms);
    state.exercise = { textId, items: problem.items, answer: problem.answer, guess: {}, revealed: false };
  }
  renderExercise();
}

document.getElementById('exerciseNew').addEventListener('click', newExercise);
document.getElementById('exerciseHint').addEventListener('click', () => {
  const e = state.exercise;
  const next = PigpenCore.hint(e.items, e.guess, e.answer);
  if (next) e.guess[next.shape] = next.letter;
  renderExercise();
});
document.getElementById('exerciseAnswer').addEventListener('click', () => {
  const e = state.exercise;
  e.items.forEach((shape, i) => { if (shape !== ' ') e.guess[shape] = e.answer[i]; });
  e.revealed = true;
  renderExercise();
});
document.getElementById('exerciseClear').addEventListener('click', () => {
  state.exercise.guess = {};
  state.exercise.revealed = false;
  renderExercise();
});

function renderExercise() {
  const e = state.exercise;
  const status = document.getElementById('exerciseStatus');
  const ready = e.items.length > 0;
  for (const name of ['Hint', 'Answer', 'Clear']) document.getElementById('exercise' + name).disabled = !ready;
  const solved = ready && PigpenCore.isSolved(e.items, e.guess, e.answer);
  const source = PigpenCore.EXERCISES.find(text => text.id === e.textId).source;
  status.textContent = !ready ? i18n.t('exercise.unavailable') : solved
    ? i18n.t(e.revealed ? 'exercise.revealed' : 'exercise.solved', { source }) : i18n.t('exercise.instructions');
  const cipher = document.getElementById('exerciseCipher');
  cipher.replaceChildren();
  let word = document.createElement('span');
  word.className = 'exercise-word';
  cipher.appendChild(word);
  e.items.forEach(shape => {
    if (shape === ' ') {
      word = document.createElement('span');
      word.className = 'exercise-word';
      cipher.appendChild(word);
      return;
    }
    const item = document.createElement('span');
    item.className = 'exercise-symbol';
    item.dataset.shape = shape;
    const guess = document.createElement('span');
    guess.textContent = PigpenCore.applyGuess([shape], e.guess);
    item.append(createGlyph(shape), guess);
    word.appendChild(item);
  });
  const conflicts = PigpenCore.guessConflicts(e.guess);
  document.getElementById('exerciseConflicts').textContent = conflicts.length
    ? i18n.t('exercise.conflicts', { letters: conflicts.join(', ') }) : '';
  const focused = document.activeElement.dataset.guessShape;
  const table = document.getElementById('exerciseCounts');
  table.replaceChildren();
  const head = document.createElement('thead');
  const titles = document.createElement('tr');
  ['symbol', 'count', 'percent', 'guess'].forEach(key => {
    const cell = document.createElement('th');
    cell.scope = 'col';
    cell.textContent = i18n.t(`exercise.${key}`);
    titles.appendChild(cell);
  });
  head.appendChild(titles);
  const body = document.createElement('tbody');
  PigpenCore.shapeCounts(e.items).forEach((entry, index) => {
    const row = document.createElement('tr');
    row.classList.toggle('guess-conflict', conflicts.includes(e.guess[entry.shape]));
    const symbol = document.createElement('td');
    symbol.appendChild(createGlyph(entry.shape));
    row.appendChild(symbol);
    for (const value of [entry.count, entry.percent + '%']) {
      const cell = document.createElement('td');
      cell.textContent = String(value);
      row.appendChild(cell);
    }
    const cell = document.createElement('td');
    const label = document.createElement('label');
    label.htmlFor = 'guess-' + index;
    label.className = 'visually-hidden';
    label.textContent = i18n.describeShape(entry.shape);
    const select = document.createElement('select');
    select.id = label.htmlFor;
    select.dataset.guessShape = entry.shape;
    select.setAttribute('aria-label', label.textContent);
    for (const letter of ['', ...alphabet]) {
      const option = document.createElement('option');
      option.value = letter;
      option.textContent = letter || '_';
      select.appendChild(option);
    }
    select.value = e.guess[entry.shape] || '';
    select.addEventListener('change', () => {
      e.guess[entry.shape] = select.value;
      renderExercise();
    });
    cell.append(label, select);
    row.appendChild(cell);
    body.appendChild(row);
  });
  table.append(head, body);
  if (focused) table.querySelector('[data-guess-shape="' + focused + '"]')?.focus();
  const frequency = document.getElementById('englishFrequency');
  frequency.replaceChildren();
  for (const letter of 'ETAOINSHRDLU') {
    const term = document.createElement('dt');
    term.textContent = letter;
    const value = document.createElement('dd');
    value.textContent = PigpenCore.ENGLISH_FREQ[alphabet.indexOf(letter)] + '%';
    frequency.append(term, value);
  }
}

i18n.init();
newExercise();
render();
document.addEventListener('languagechange', render);
document.getElementById('languageButton').addEventListener('click', () => {
  i18n.setLanguage(i18n.language === 'ja' ? 'en' : 'ja');
});

// ヘルプモーダルの処理
const helpButton = document.getElementById("helpButton");
const helpModal = document.getElementById("helpModal");
const closeButton = document.querySelector(".close-button");

// ヘルプボタンクリックでモーダルを開く
helpButton.addEventListener("click", () => {
  helpModal.showModal();
  document.body.classList.add('modal-open');
});

// 閉じるボタンクリックでモーダルを閉じる
closeButton.addEventListener("click", () => {
  helpModal.close();
});

// モーダル外側クリックでモーダルを閉じる
helpModal.addEventListener("click", (e) => {
  if (e.target === helpModal) {
    helpModal.close();
  }
});

// ESCキーでモーダルを閉じる
helpModal.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  helpButton.focus();
});

helpModal.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const items = [...helpModal.querySelectorAll('button, a[href], select, input, textarea, [tabindex="0"]')];
  const first = items[0];
  const last = items[items.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
