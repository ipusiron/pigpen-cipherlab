// グローバル変数：現在選択されているグリフセット
let currentGlyphSet = "1";
let spaceMode = "ignore"; // "ignore" または "preserve"

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

// 空白処理トグルボタンの処理
const ignoreSpaceBtn = document.getElementById("ignoreSpaceBtn");
const preserveSpaceBtn = document.getElementById("preserveSpaceBtn");
const currentModeText = document.getElementById("currentModeText");

function updateSpaceMode(newMode) {
  spaceMode = newMode;
  
  // ボタンのアクティブ状態を更新
  if (newMode === "ignore") {
    ignoreSpaceBtn.classList.add("active");
    preserveSpaceBtn.classList.remove("active");
    currentModeText.textContent = "現在：空白を無視";
  } else {
    ignoreSpaceBtn.classList.remove("active");
    preserveSpaceBtn.classList.add("active");
    currentModeText.textContent = "現在：空白を保持";
  }
  
  // 警告メッセージを更新
  updateWarningMessage();
  
  // 設定変更時にリアルタイムで再暗号化
  encryptText();
}

// 警告メッセージ更新の処理を関数化
function updateWarningMessage() {
  const text = plaintextArea.value;
  
  if (spaceMode === "preserve") {
    // 空白保持モードの場合：英字とスペース以外の文字をチェック
    const nonAlphaSpaceChars = text.replace(/[A-Za-z\s]/g, "");
    const hasSpaces = /\s/.test(text);
    
    if (nonAlphaSpaceChars.length > 0) {
      if (hasSpaces) {
        warningMessage.textContent = "※ 英字以外の文字は無視されます。ただし、空白は保持します。";
      } else {
        warningMessage.textContent = "※ 英字・スペース以外の文字は無視されます";
      }
      warningMessage.style.display = "block";
    } else if (hasSpaces) {
      warningMessage.textContent = "※ 空白は保持されます";
      warningMessage.style.display = "block";
    } else {
      warningMessage.style.display = "none";
    }
  } else {
    // 空白無視モードの場合：英字以外の文字をチェック
    const nonAlphaChars = text.replace(/[A-Za-z]/g, "");
    
    if (nonAlphaChars.length > 0) {
      warningMessage.textContent = "※ 英字以外の文字は無視されます";
      warningMessage.style.display = "block";
    } else {
      warningMessage.style.display = "none";
    }
  }
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
const encryptButton = document.getElementById("encryptButton");
const plaintextArea = document.getElementById("plaintext");
const cipherOutput = document.getElementById("cipherOutput");
const warningMessage = document.getElementById("warningMessage");

// 暗号化処理を関数として定義
function encryptText() {
  let processedText;
  const originalText = plaintextArea.value.toUpperCase();
  
  if (spaceMode === "preserve") {
    // 空白を保持する場合：英字とスペースのみを残す
    processedText = originalText.replace(/[^A-Z\s]/g, "");
  } else {
    // 空白を無視する場合：英字のみを残す
    processedText = originalText.replace(/[^A-Z]/g, "");
  }
  
  cipherOutput.innerHTML = "";
  
  // すべてのハイライトを削除
  document.querySelectorAll('.reference-item').forEach(item => {
    item.classList.remove('highlight', 'highlight-recent');
  });

  if (processedText.length === 0) {
    return;
  }

  // 使用されている文字をカウント（スペースを除く）
  const textOnly = processedText.replace(/\s/g, "");
  const usedChars = new Set(textOnly);
  
  // 直近の文字（最後の英字）を取得
  const lastChar = textOnly[textOnly.length - 1];
  
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

  for (let i = 0; i < processedText.length; i++) {
    const char = processedText[i];
    
    if (char === ' ') {
      // スペースの場合は空のスペーサーを追加
      const spacer = document.createElement("div");
      spacer.className = "cipher-space";
      cipherOutput.appendChild(spacer);
    } else {
      // 英字の場合はグリフを表示
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
}

// 入力文字の検証と警告表示、リアルタイム暗号化
plaintextArea.addEventListener("input", () => {
  // 警告メッセージを更新
  updateWarningMessage();
  
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
  
  // A-Zのボタンを生成
  alphabet.split("").forEach((char) => {
    const glyphItem = document.createElement("div");
    glyphItem.className = "cipher-item";
    
    const img = document.createElement("img");
    img.src = `assets/glyphs/${currentGlyphSet}/${char}.svg`;
    img.alt = char;
    img.title = char;
    img.className = "cipher-glyph";

    const letterLabel = document.createElement("span");
    letterLabel.className = "cipher-letter";
    letterLabel.textContent = char;

    img.addEventListener("click", () => {
      decryptedText.textContent += char;
    });

    glyphItem.appendChild(img);
    glyphItem.appendChild(letterLabel);
    glyphButtons.appendChild(glyphItem);
  });
  
  // 空白ボタンを追加
  const spaceButton = document.createElement("div");
  spaceButton.className = "space-button";
  spaceButton.title = "空白";
  spaceButton.textContent = "空白";
  
  spaceButton.addEventListener("click", () => {
    decryptedText.textContent += " ";
  });
  
  glyphButtons.appendChild(spaceButton);
  
  // DELボタンを追加
  const delButton = document.createElement("div");
  delButton.className = "space-button";
  delButton.title = "1文字削除";
  delButton.textContent = "DEL";
  
  delButton.addEventListener("click", () => {
    decryptedText.textContent = decryptedText.textContent.slice(0, -1);
  });
  
  glyphButtons.appendChild(delButton);
}

// 初期表示
updateGlyphButtons();

const copyButton = document.getElementById("copyButton");
const copyToast = document.getElementById("copyToast");

copyButton.addEventListener("click", async () => {
  const text = decryptedText.textContent;
  
  if (text.length === 0) {
    return;
  }
  
  try {
    await navigator.clipboard.writeText(text);
    
    // トーストを表示
    copyToast.classList.add("show");
    
    // 2秒後にトーストを非表示
    setTimeout(() => {
      copyToast.classList.remove("show");
    }, 2000);
    
  } catch (err) {
    console.error("コピーに失敗しました:", err);
  }
});

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

// 座学タブのグリフセット選択処理
const learningGlyphSelect = document.getElementById("learningGlyphSelect");
const keyMappingImage = document.getElementById("keyMappingImage");

if (learningGlyphSelect && keyMappingImage) {
  learningGlyphSelect.addEventListener("change", (e) => {
    const selectedSet = e.target.value;
    keyMappingImage.src = `assets/glyphs/${selectedSet}/key_mapping.svg`;
  });
}

// ヘルプモーダルの処理
const helpButton = document.getElementById("helpButton");
const helpModal = document.getElementById("helpModal");
const closeButton = document.querySelector(".close-button");

// ヘルプボタンクリックでモーダルを開く
helpButton.addEventListener("click", () => {
  helpModal.classList.add("show");
  document.body.style.overflow = "hidden"; // 背景のスクロールを無効化
});

// 閉じるボタンクリックでモーダルを閉じる
closeButton.addEventListener("click", () => {
  helpModal.classList.remove("show");
  document.body.style.overflow = ""; // 背景のスクロールを復元
});

// モーダル外側クリックでモーダルを閉じる
helpModal.addEventListener("click", (e) => {
  if (e.target === helpModal) {
    helpModal.classList.remove("show");
    document.body.style.overflow = "";
  }
});

// ESCキーでモーダルを閉じる
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && helpModal.classList.contains("show")) {
    helpModal.classList.remove("show");
    document.body.style.overflow = "";
  }
});
