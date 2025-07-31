// グローバル変数：現在選択されているグリフセット
let currentGlyphSet = "1";

// 暗号化タブのグリフセット選択処理
const encryptGlyphSelect = document.getElementById("encryptGlyphSelect");
encryptGlyphSelect.addEventListener("change", (e) => {
  currentGlyphSet = e.target.value;
  updateAlphabetReference();
});

// 復号タブのグリフセット選択処理
const decryptGlyphSelect = document.getElementById("decryptGlyphSelect");
decryptGlyphSelect.addEventListener("change", (e) => {
  currentGlyphSet = e.target.value;
  updateGlyphButtons();
  // 両方のセレクトボックスを同期
  encryptGlyphSelect.value = e.target.value;
});

// 暗号化タブの選択変更時に復号タブも同期
encryptGlyphSelect.addEventListener("change", (e) => {
  decryptGlyphSelect.value = e.target.value;
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
const encryptButton = document.getElementById("encryptButton");
const plaintextArea = document.getElementById("plaintext");
const cipherOutput = document.getElementById("cipherOutput");
const warningMessage = document.getElementById("warningMessage");

// 暗号化処理を関数として定義
function encryptText() {
  const text = plaintextArea.value.toUpperCase().replace(/[^A-Z]/g, "");
  cipherOutput.innerHTML = "";
  
  // すべてのハイライトを削除
  document.querySelectorAll('.reference-item').forEach(item => {
    item.classList.remove('highlight', 'highlight-recent');
  });

  if (text.length === 0) {
    return;
  }

  // 使用されている文字をカウント
  const usedChars = new Set(text);
  
  // 直近の文字（最後の文字）を取得
  const lastChar = text[text.length - 1];
  
  // 換字表内の対応する文字をハイライト
  usedChars.forEach(char => {
    const referenceItem = document.querySelector(`.reference-item[data-letter="${char}"]`);
    if (referenceItem) {
      if (char === lastChar) {
        referenceItem.classList.add('highlight-recent');
      } else {
        referenceItem.classList.add('highlight');
      }
    }
  });

  for (const char of text) {
    const cipherItem = document.createElement("div");
    cipherItem.className = "cipher-item";
    
    const img = document.createElement("img");
    img.src = `assets/glyphs/${currentGlyphSet}/${char}.svg`;
    img.alt = char;
    img.title = char;
    img.className = "cipher-glyph";
    
    const letterLabel = document.createElement("span");
    letterLabel.className = "cipher-letter";
    letterLabel.textContent = char;
    
    cipherItem.appendChild(img);
    cipherItem.appendChild(letterLabel);
    cipherOutput.appendChild(cipherItem);
  }
}

// 入力文字の検証と警告表示、リアルタイム暗号化
plaintextArea.addEventListener("input", () => {
  const text = plaintextArea.value;
  const nonAlphaChars = text.replace(/[A-Za-z]/g, "");
  
  if (nonAlphaChars.length > 0) {
    warningMessage.textContent = "※ 英字以外の文字（スペース含む）は無視されます";
    warningMessage.style.display = "block";
  } else {
    warningMessage.style.display = "none";
  }
  
  // リアルタイムで暗号化
  encryptText();
});

encryptButton.addEventListener("click", () => {
  encryptText();
  
  const text = plaintextArea.value.toUpperCase().replace(/[^A-Z]/g, "");
  if (text.length === 0) {
    alert("英字を入力してください（A〜Zのみ）");
  }
});

// 復号用のグリフボタン生成（初期表示）
const glyphButtons = document.getElementById("glyphButtons");
const decryptedText = document.getElementById("decryptedText");
const resetButton = document.getElementById("resetButton");

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// 復号用グリフボタンの生成
function updateGlyphButtons() {
  glyphButtons.innerHTML = "";
  alphabet.split("").forEach((char) => {
    const img = document.createElement("img");
    img.src = `assets/glyphs/${currentGlyphSet}/${char}.svg`;
    img.alt = char;
    img.title = char;

    img.addEventListener("click", () => {
      decryptedText.textContent += char;
    });

    glyphButtons.appendChild(img);
  });
}

// 初期表示
updateGlyphButtons();

resetButton.addEventListener("click", () => {
  decryptedText.textContent = "";
});

// アルファベット対応表の生成
const alphabetReference = document.getElementById("alphabetReference");

function updateAlphabetReference() {
  alphabetReference.innerHTML = "";
  alphabet.split("").forEach((char) => {
    const referenceItem = document.createElement("div");
    referenceItem.className = "reference-item";
    referenceItem.setAttribute("data-letter", char);
    
    const letterSpan = document.createElement("span");
    letterSpan.className = "reference-letter";
    letterSpan.textContent = char;
    
    const img = document.createElement("img");
    img.src = `assets/glyphs/${currentGlyphSet}/${char}.svg`;
    img.alt = char;
    img.className = "reference-glyph";
    
    referenceItem.appendChild(letterSpan);
    referenceItem.appendChild(img);
    alphabetReference.appendChild(referenceItem);
  });
}

// 初期表示
updateAlphabetReference();
