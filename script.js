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

encryptButton.addEventListener("click", () => {
  const text = plaintextArea.value.toUpperCase().replace(/[^A-Z]/g, "");
  cipherOutput.innerHTML = "";

  if (text.length === 0) {
    alert("英字を入力してください（A〜Zのみ）");
    return;
  }

  for (const char of text) {
    const img = document.createElement("img");
    img.src = `assets/glyphs/${char}.svg`;
    img.alt = char;
    img.title = char;
    cipherOutput.appendChild(img);
  }
});

// 復号用のグリフボタン生成（初期表示）
const glyphButtons = document.getElementById("glyphButtons");
const decryptedText = document.getElementById("decryptedText");
const resetButton = document.getElementById("resetButton");

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

alphabet.split("").forEach((char) => {
  const img = document.createElement("img");
  img.src = `assets/glyphs/${char}.svg`;
  img.alt = char;
  img.title = char;

  img.addEventListener("click", () => {
    decryptedText.textContent += char;
  });

  glyphButtons.appendChild(img);
});

resetButton.addEventListener("click", () => {
  decryptedText.textContent = "";
});
