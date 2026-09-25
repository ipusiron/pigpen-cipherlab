// One cipher state; every dependent view is derived from it.
const state = { variant: '1', spaceMode: 'ignore', text: '', decodeItems: [] };
const encryptGlyphSelect = document.getElementById("encryptGlyphSelect");
const decryptGlyphSelect = document.getElementById("decryptGlyphSelect");
const learningGlyphSelect = document.getElementById("learningGlyphSelect");

function changeVariant(event) {
  if (!PigpenCore.isVariant(event.target.value)) return;
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
    line.textContent = i18n.t(message.key, message);
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

// タブ切り替え処理
document.querySelectorAll(".tab-button").forEach((btn) => {
  btn.addEventListener("click", () => {
    // アクティブ切替
    document.querySelectorAll(".tab-button").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach((tab) => tab.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// A〜Zのアルファベットに対応するピッグペン記号を出力（仮：SVG画像として）

const plaintextArea = document.getElementById("plaintext");
const cipherOutput = document.getElementById("cipherOutput");
const warningMessage = document.getElementById("warningMessage");

// 暗号化処理を関数として定義
function encryptText(result) {
  const tokens = PigpenCore.encrypt(result.tokens, state.variant);
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
      const img = document.createElement('img');
      img.src = glyphPath(state.variant, token.letter);
      img.alt = token.letter;
      img.title = token.letter;
      img.className = 'cipher-glyph';
      const label = document.createElement('span');
      label.className = 'cipher-letter';
      label.textContent = token.letter;
      item.append(img, label);
    }
    cipherOutput.appendChild(item);
  }
}

// Validate through the model before constructing any per-letter image path.
function glyphPath(variant, letter) {
  if (!PigpenCore.shapeOf(letter, variant)) throw new Error('Unknown glyph');
  return `assets/glyphs/${variant}/${letter}.svg`;
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
  alphabet.split("").forEach((char) => {
    const glyphItem = document.createElement("div");
    glyphItem.className = "cipher-item";
    
    const img = document.createElement("img");
img.src = glyphPath(state.variant, char);
    img.alt = char;
    img.title = char;
    img.className = "cipher-glyph";

    const letterLabel = document.createElement("span");
    letterLabel.className = "cipher-letter";
    letterLabel.textContent = char;

    img.addEventListener("click", () => {
state.decodeItems.push(PigpenCore.shapeOf(char, state.variant));
      renderReading();
    });

    glyphItem.appendChild(img);
    glyphItem.appendChild(letterLabel);
    glyphButtons.appendChild(glyphItem);
  });
  
  // 空白ボタンを追加
  const spaceButton = document.createElement("div");
  spaceButton.className = "space-button";
spaceButton.title = i18n.t('decode.space');
spaceButton.textContent = i18n.t('decode.space');
  
  spaceButton.addEventListener("click", () => {
state.decodeItems.push(' ');
    renderReading();
  });
  
  glyphButtons.appendChild(spaceButton);
  
  // DELボタンを追加
  const delButton = document.createElement("div");
  delButton.className = "space-button";
delButton.title = i18n.t('decode.delete');
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

copyButton.addEventListener("click", async () => {
  const text = decryptedText.textContent;
  
  if (text.length === 0) {
    return;
  }
  
  try {
    await navigator.clipboard.writeText(text);
    
    copyToast.textContent = i18n.t('copy.success');
    copyToast.classList.remove('error');
    copyToast.classList.add("show");
    
    // 2秒後にトーストを非表示
    setTimeout(() => {
      copyToast.classList.remove("show");
    }, 2000);
    
  } catch (err) {
    copyToast.textContent = i18n.t('copy.failure');
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
    
    const img = document.createElement("img");
img.src = glyphPath(state.variant, char);
    img.alt = char;
    img.className = "reference-glyph";
    
    referenceItem.appendChild(letterSpan);
    referenceItem.appendChild(img);
    alphabetReference.appendChild(referenceItem);
  });
}

const keyMappingImage = document.getElementById("keyMappingImage");

function renderReading() {
  decryptedText.textContent = PigpenCore.decodeSequence(state.decodeItems, state.variant);
}

function render() {
  [encryptGlyphSelect, decryptGlyphSelect, learningGlyphSelect].forEach(select => {
    select.value = state.variant;
  });
  ignoreSpaceBtn.classList.toggle('active', state.spaceMode === 'ignore');
  preserveSpaceBtn.classList.toggle('active', state.spaceMode === 'preserve');
  currentModeText.textContent = i18n.t(`mode.${state.spaceMode}`);
  const result = PigpenCore.tokenize(state.text, state.spaceMode);
  updateAlphabetReference();
  encryptText(result);
  updateWarningMessage(result);
  updateGlyphButtons();
  renderReading();
  keyMappingImage.src = `assets/glyphs/${state.variant}/key_mapping.svg`;
  keyMappingImage.alt = i18n.t('mapping.alt', { variant: state.variant });
}

render();

// ヘルプモーダルの処理
const helpButton = document.getElementById("helpButton");
const helpModal = document.getElementById("helpModal");
const closeButton = document.querySelector(".close-button");

// ヘルプボタンクリックでモーダルを開く
helpButton.addEventListener("click", () => {
  helpModal.classList.add("show");
  document.body.classList.add('modal-open');
});

// 閉じるボタンクリックでモーダルを閉じる
closeButton.addEventListener("click", () => {
  helpModal.classList.remove("show");
  document.body.classList.remove('modal-open');
});

// モーダル外側クリックでモーダルを閉じる
helpModal.addEventListener("click", (e) => {
  if (e.target === helpModal) {
    helpModal.classList.remove("show");
    document.body.classList.remove('modal-open');
  }
});

// ESCキーでモーダルを閉じる
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && helpModal.classList.contains("show")) {
    helpModal.classList.remove("show");
    document.body.classList.remove('modal-open');
  }
});
