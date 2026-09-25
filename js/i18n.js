// UI messages are kept separate from cipher state and the pure core.
const i18n = (() => {
  const ja = {
    "mode.ignore": "現在：空白を無視",
    "mode.preserve": "現在：空白を保持",
    "warn.ignored": "英字以外の{count}文字は無視しました",
    "warn.spacesKept": "空白と改行は保持しました",
    "warn.spacesDropped": "空白と改行は無視しました",
    "decode.space": "空白",
    "decode.delete": "最後の記号を削除",
    "decode.key": "記号{letter}を入力",
    "decode.sequence": "入力した記号の列",
    "decode.unknown": "この換字表にない記号は?で表示しています",
    "copy.success": "コピーしました",
    "copy.failure": "コピーできませんでした。読みを選択してコピーしてください",
    "mapping.alt": "換字表{variant}",
    "mapping.1": "井桁→点つき井桁→X字→点つきX字（Wikipediaの配置）。",
    "mapping.2": "井桁→X字→点つき井桁→点つきX字（『暗号解読 実践ガイド』P.438）。",
    "mapping.3": "井桁の9マスに3文字ずつ置き、点の数（1〜3）で区別します（『暗号の秘密』P.62）。Wikipediaのバラ十字の方式は点の位置（左・中・右）で区別する別方式です。",
    "ui.0": "このツールを使うにはJavaScriptを有効にしてください。",
    "ui.1": "ピッグペン暗号を可視化した学習ツール",
    "ui.2": "🔐 暗号化",
    "ui.3": "🔓 復号",
    "ui.4": "📘 座学",
    "ui.5": "暗号化",
    "ui.6": "換字表",
    "ui.7": "空白処理",
    "ui.8": "無視",
    "ui.9": "保持",
    "ui.10": "現在：空白を無視",
    "ui.11": "入力するテキスト",
    "ui.12": "換字表（アルファベットとグリフの対応表）",
    "ui.13": "暗号文",
    "ui.14": "復号",
    "ui.15": "入力した記号",
    "ui.16": "復号結果",
    "ui.17": "コピー",
    "ui.18": "リセット",
    "ui.19": "座学：ピッグペン暗号を学ぼう",
    "ui.20": "学習１：ピッグペン暗号の概要",
    "ui.21": "ピッグペン暗号（Pigpen Cipher）は、18世紀の秘密結社フリーメイソンが使用したとされる古典的な暗号方式です。",
    "ui.22": "図形ベースの換字式暗号：各アルファベットを特定の図形に置き換える",
    "ui.23": "3×3グリッドとX型グリッド：26文字を2つのグリッドに配置",
    "ui.24": "豚小屋暗号：グリッドの形が豚小屋に似ていることから命名",
    "ui.25": "現在の用途：遊びや教育、パズルなどで活用されている",
    "ui.26": "この暗号の特徴は、文字の形を図形化することで、一見すると意味不明な記号の羅列に見えることです。",
    "ui.27": "学習２：換字表の読み方",
    "ui.28": "ピッグペン暗号では、以下のような換字表を使用してアルファベットを図形に変換します",
    "ui.29": "セット 1",
    "ui.30": "セット 2",
    "ui.31": "セット 3",
    "ui.32": "📖 換字表の詳しい読み方（換字表1の場合）",
    "ui.33": "1. 基本的な仕組み",
    "ui.34": "換字表1の場合、アルファベット26文字を2つのグリッドに配置し、各文字をその位置の「囲み」で表現します",
    "ui.35": "3×3グリッド（井桁）：A〜Rの18文字を配置",
    "ui.36": "X字グリッド：S〜Zの8文字を配置",
    "ui.37": "2. 3×3グリッドの読み方（A〜R）",
    "ui.38": "各マス目の位置によって、そのマスを囲む「壁」の形が決まります",
    "ui.39": "左上（A）：右と下に壁 → ┘ の形",
    "ui.40": "中央上（B）：左右と下に壁 → ⊔ の形",
    "ui.41": "右上（C）：左と下に壁 → └ の形",
    "ui.42": "左中（D）：上下と右に壁 → コ の形",
    "ui.43": "中央（E）：四方に壁 → □ の形",
    "ui.44": "右中（F）：上下と左に壁",
    "ui.45": "左下（G）：上と右に壁 → ┐ の形",
    "ui.46": "中央下（H）：左右と上に壁 → ⊓ の形",
    "ui.47": "右下（I）：左と上に壁 → ┌ の形",
    "ui.48": "J〜Rは、A〜Iと同じ形にドット（・）を追加したものです。",
    "ui.49": "3. X字グリッドの読み方（S〜Z）",
    "ui.50": "X字の4つの区画と、その延長線上の位置を使用します",
    "ui.51": "上の区画（S）：Vの字の形",
    "ui.52": "左の区画（T）：＞ の形",
    "ui.53": "右の区画（U）：＜ の形",
    "ui.54": "下の区画（V）：∧ の形",
    "ui.55": "W〜Zは、S〜Vと同じ形にドット（・）を追加したものです。",
    "ui.56": "4. 実際の使用例",
    "ui.57": "たとえば「HELLO」を暗号化すると",
    "ui.58": "H → ⊓（中央下のグリッド形状）",
    "ui.59": "E → □（中央のグリッド形状）",
    "ui.60": "L → └・（右上のグリッド形状＋ドット）",
    "ui.61": "L → └・（同上）",
    "ui.62": "O → 右中のグリッド形状＋ドット",
    "ui.63": "💡 覚えるコツ",
    "ui.64": "グリッドの位置と壁の関係を視覚的に理解する",
    "ui.65": "ドットなし（A〜I、S〜V）とドットあり（J〜R、W〜Z）の規則性を把握",
    "ui.66": "実際に紙に書いて練習すると覚えやすい",
    "ui.67": "学習３：暗号解読のTIPS",
    "ui.68": "ピッグペン暗号を効率的に解読するための重要なポイント",
    "ui.69": "🔑 最重要：ピッグペン暗号は単一換字式暗号の一種",
    "ui.70": "ピッグペン暗号の解読は2段階のプロセスです",
    "ui.71": "グリフ → アルファベット変換：各グリフ（図形）がどのアルファベットに対応するかを特定",
    "ui.72": "単一換字式暗号の解読法を適用：通常の暗号解読テクニックをそのまま使用",
    "ui.73": "つまり、グリフをアルファベットに置き換えてしまえば、あとは通常の単一換字式暗号として解読できます。",
    "ui.74": "🔍 頻度分析を活用する",
    "ui.75": "E, T, A, O, I, N：英語でよく使われる文字（頻度順）",
    "ui.76": "頻出グリフ = 頻出文字：もっとも多く登場するグリフは「E」の可能性が高い",
    "ui.77": "短い単語：「THE」「AND」「OF」などを探す",
    "ui.78": "1文字の単語：「A」「I」の可能性が高い",
    "ui.79": "📝 パターンを見つける",
    "ui.80": "同じグリフの繰り返し：同じグリフが繰り返し出現する場合、頻出文字の可能性",
    "ui.81": "単語の境界：スペースがある場合は単語の区切りを活用",
    "ui.82": "文章の構造：英語の一般的な単語パターンを考慮",
    "ui.83": "二重文字：「LL」「EE」「SS」などの二重文字パターンを探す",
    "ui.84": "🎯 具体的な解読手順",
    "ui.85": "グリフの種類を数える：暗号文に何種類のグリフが使われているか確認",
    "ui.86": "頻度分析：各グリフの出現回数をカウント",
    "ui.87": "仮説設定：もっとも頻出するグリフを「E」と仮定",
    "ui.88": "単語推測：短い単語（THE, AND, OF）から推測を始める",
    "ui.89": "置換表作成：判明したグリフ→文字の対応を記録",
    "ui.90": "検証・修正：矛盾があれば仮説を修正",
    "ui.91": "📊 英語の文字頻度（参考）",
    "ui.92": "高頻度：E (12.7%), T (9.1%), A (8.2%), O (7.5%), I (7.0%), N (6.7%)",
    "ui.93": "中頻度：S (6.3%), H (6.1%), R (6.0%), D (4.3%), L (4.0%)",
    "ui.94": "低頻度：Q (0.1%), X (0.2%), Z (0.1%)",
    "ui.95": "💡 実践的なアドバイス",
    "ui.96": "このアプリケーションの復号タブを使って、実際に暗号文を入力しながら解読を試してみましょう。グリフをクリックして文字を入力し、意味のある単語ができるまで試行錯誤してみてください。",
    "ui.97": "覚えておくべきこと：ピッグペン暗号は見た目は複雑ですが、本質的には単純な単一換字式暗号です。グリフをアルファベットに置き換えることができれば、あとは通常の暗号解読手法が使えます。",
    "ui.98": "📖 Pigpen CipherLab ヘルプ",
    "ui.99": "🔐 暗号化タブの使い方",
    "ui.100": "換字表を選択：使用したいグリフセット（1〜3）を選びます",
    "ui.101": "空白処理を設定：空白を無視するか保持するかを選択",
    "ui.102": "テキストを入力：暗号化したい英文を入力欄に記入",
    "ui.103": "リアルタイム暗号化：入力と同時に自動的にグリフに変換されます",
    "ui.104": "換字表の確認：使用中の文字は黄色、直近の文字は赤色でハイライトされます",
    "ui.105": "🔓 復号タブの使い方",
    "ui.106": "換字表を選択：暗号文に使用されたグリフセットを選びます",
    "ui.107": "グリフを選択：クリックまたはキーボードで記号を入力",
    "ui.108": "空白の入力：「空白」ボタンでスペースを入力",
    "ui.109": "文字の削除：「DEL」ボタンで最後の文字を削除",
    "ui.110": "結果のコピー：「コピー」ボタンで復号結果をクリップボードにコピー",
    "ui.111": "リセット：入力した記号列と読みをクリア",
    "ui.112": "📘 座学タブの使い方",
    "ui.113": "学習1：ピッグペン暗号の歴史と基本概念を学習",
    "ui.114": "各位置とグリフ形状の対応関係",
    "ui.115": "ドットの有無による文字の区別",
    "ui.116": "パターン認識のコツ",
    "ui.117": "単一換字式暗号としての解読法",
    "ui.118": "💡 便利な機能",
    "ui.119": "換字表の切り替え：3タブが同期し、記号列の形は変えずに読み直す",
    "ui.120": "リアルタイム変換：入力と同時に暗号化が進みます",
    "ui.121": "視覚的フィードバック：使用中の文字がハイライトされます",
    "ui.122": "コピー：復号結果をコピーし、失敗時も案内を表示",
    "ui.123": "🎯 学習のコツ",
    "ui.124": "まず座学タブで基本を理解してから実践しましょう",
    "ui.125": "簡単な単語（THE、AND、OF）から練習を始めます",
    "ui.126": "換字表を見ながら、グリフの形と文字の関係を覚えましょう",
    "ui.127": "実際に紙に書いて練習すると、より早く習得できます",
    "help": "ヘルプ",
    "close": "閉じる",
    "tabs": "機能",
    "placeholder": "英字を入力してください（例：HELLO WORLD）",
    "language": "English",
    "languageLabel": "英語に切り替え",
    "title": "Pigpen CipherLab - ピッグペン暗号",
    "footer": "🔗 GitHubリポジトリ",
    "help.lesson2": "学習2：換字表の詳しい読み方を理解",
    "help.lesson3": "学習3：暗号解読のテクニックを習得",
    "help.grids": "3×3グリッドとX字グリッドの構造",
    "help.frequency": "頻度分析の活用方法",
  };

  const en = {
    "mode.ignore": "Current: ignore whitespace",
    "mode.preserve": "Current: preserve whitespace",
    "warn.ignored": "Ignored {count} non-letter characters",
    "warn.spacesKept": "Spaces and line breaks were preserved",
    "warn.spacesDropped": "Spaces and line breaks were ignored",
    "decode.space": "Space",
    "decode.delete": "Delete the last symbol",
    "decode.key": "Enter symbol {letter}",
    "decode.sequence": "Entered symbol sequence",
    "decode.unknown": "Symbols absent from this key mapping are shown as ?",
    "copy.success": "Copied",
    "copy.failure": "Could not copy. Select the decoded text and copy it manually.",
    "mapping.alt": "Key mapping {variant}",
    "mapping.1": "Grid → dotted grid → X → dotted X (Wikipedia arrangement).",
    "mapping.2": "Grid → X → dotted grid → dotted X (Practical Guide to Cryptanalysis, p. 438; Japanese-language book).",
    "mapping.3": "Three letters per cell of a nine-cell grid, distinguished by 1–3 dots (Secrets of Cryptography, p. 62; "
      + "Japanese-language book). The Rosicrucian variant on Wikipedia instead distinguishes letters by dot "
      + "position (left, middle or right).",
    "ui.0": "Enable JavaScript to use this tool.",
    "ui.1": "A visual learning tool for the Pigpen cipher",
    "ui.2": "🔐 Encrypt",
    "ui.3": "🔓 Decrypt",
    "ui.4": "📘 Learn",
    "ui.5": "Encryption",
    "ui.6": "Key mapping",
    "ui.7": "Whitespace",
    "ui.8": "Ignore",
    "ui.9": "Preserve",
    "ui.10": "Current: ignore whitespace",
    "ui.11": "Input text",
    "ui.12": "Key mapping (letters and glyphs)",
    "ui.13": "Ciphertext",
    "ui.14": "Decryption",
    "ui.15": "Entered symbols",
    "ui.16": "Decoded text",
    "ui.17": "Copy",
    "ui.18": "Reset",
    "ui.19": "Learn: explore the Pigpen cipher",
    "ui.20": "Lesson 1: Pigpen cipher overview",
    "ui.21": "The Pigpen cipher is a classical cipher associated with the Freemasons of the 18th century.",
    "ui.22": "Shape-based substitution: replace each letter with a specific shape",
    "ui.23": "3×3 and X-shaped grids: arrange 26 letters in these two grid types",
    "ui.24": "Pigpen: named after the resemblance of the grids to pens for pigs",
    "ui.25": "Modern uses: games, education and puzzles",
    "ui.26": "Replacing letters with shapes makes the message look like a sequence of unfamiliar symbols.",
    "ui.27": "Lesson 2: reading the key mapping",
    "ui.28": "Pigpen converts letters into shapes using key mappings such as these.",
    "ui.29": "Set 1",
    "ui.30": "Set 2",
    "ui.31": "Set 3",
    "ui.32": "📖 Reading the key mapping (set 1)",
    "ui.33": "1. The basic idea",
    "ui.34": "In set 1, the 26 letters occupy two types of grid. Each letter is represented by the walls surrounding its position.",
    "ui.35": "3×3 grids: the 18 letters A–R",
    "ui.36": "X-shaped grids: the 8 letters S–Z",
    "ui.37": "2. Reading the 3×3 grids (A–R)",
    "ui.38": "The position of a cell determines the walls that form its symbol.",
    "ui.39": "Top left (A): right and bottom walls → ┘",
    "ui.40": "Top middle (B): left, right and bottom walls → ⊔",
    "ui.41": "Top right (C): left and bottom walls → └",
    "ui.42": "Middle left (D): top, bottom and right walls",
    "ui.43": "Center (E): walls on all four sides → □",
    "ui.44": "Middle right (F): top, bottom and left walls",
    "ui.45": "Bottom left (G): top and right walls → ┐",
    "ui.46": "Bottom middle (H): left, right and top walls → ⊓",
    "ui.47": "Bottom right (I): left and top walls → ┌",
    "ui.48": "J–R have the same shapes as A–I, with a dot added.",
    "ui.49": "3. Reading the X-shaped grids (S–Z)",
    "ui.50": "Use the four regions of the X-shaped grid.",
    "ui.51": "Top region (S): V shape",
    "ui.52": "Left region (T): > shape",
    "ui.53": "Right region (U): < shape",
    "ui.54": "Bottom region (V): ∧ shape",
    "ui.55": "W–Z have the same shapes as S–V, with a dot added.",
    "ui.56": "4. A worked example",
    "ui.57": "For example, HELLO is encrypted as follows.",
    "ui.58": "H → ⊓ (bottom-middle cell)",
    "ui.59": "E → □ (center cell)",
    "ui.60": "L → └ with a dot (top-right cell plus a dot)",
    "ui.61": "L → └ with a dot (the same symbol)",
    "ui.62": "O → middle-right cell plus a dot",
    "ui.63": "💡 Memory tips",
    "ui.64": "Visualize how each position determines its surrounding walls.",
    "ui.65": "Notice the groups without dots (A–I, S–V) and with dots (J–R, W–Z).",
    "ui.66": "Practice drawing the symbols on paper.",
    "ui.67": "Lesson 3: tips for breaking the cipher",
    "ui.68": "Ways to approach a Pigpen ciphertext.",
    "ui.69": "🔑 Pigpen is a monoalphabetic substitution cipher",
    "ui.70": "Breaking a Pigpen cipher involves two steps.",
    "ui.71": "Glyphs → letters: identify the letter corresponding to each shape.",
    "ui.72": "Apply substitution-cipher techniques: use familiar cryptanalysis methods.",
    "ui.73": "Once the glyphs are replaced with letters, you can analyze the result as a monoalphabetic substitution cipher.",
    "ui.74": "🔍 Use frequency analysis",
    "ui.75": "E, T, A, O, I, N: common English letters, in frequency order",
    "ui.76": "Frequent glyphs = frequent letters: the most common glyph may represent E.",
    "ui.77": "Short words: look for THE, AND and OF.",
    "ui.78": "One-letter words: A and I are likely candidates.",
    "ui.79": "📝 Find patterns",
    "ui.80": "Repeated glyphs: repeated symbols may represent common letters.",
    "ui.81": "Word boundaries: use spaces to identify word boundaries when available.",
    "ui.82": "Sentence structure: consider common English word patterns.",
    "ui.83": "Double letters: look for LL, EE and SS.",
    "ui.84": "🎯 Step-by-step approach",
    "ui.85": "Count glyph types: find how many distinct symbols occur in the ciphertext.",
    "ui.86": "Analyze frequency: count occurrences of each glyph.",
    "ui.87": "Form a hypothesis: try E for the most frequent glyph.",
    "ui.88": "Guess words: begin with short words such as THE, AND and OF.",
    "ui.89": "Build a substitution table: record the glyph-to-letter correspondences you find.",
    "ui.90": "Check and revise: revise hypotheses when they lead to contradictions.",
    "ui.91": "📊 English letter frequencies (reference)",
    "ui.92": "High: E (12.7%), T (9.1%), A (8.2%), O (7.5%), I (7.0%), N (6.7%)",
    "ui.93": "Medium: S (6.3%), H (6.1%), R (6.0%), D (4.3%), L (4.0%)",
    "ui.94": "Low: Q (0.1%), X (0.2%), Z (0.1%)",
    "ui.95": "💡 Practical advice",
    "ui.96": "Use the Decrypt tab to enter a ciphertext. Select glyphs and explore the resulting letters to find meaningful words.",
    "ui.97": "Remember: although Pigpen looks complex, it is a simple monoalphabetic substitution cipher. After "
      + "assigning letters to glyphs, familiar cryptanalysis methods apply.",
    "ui.98": "📖 Pigpen CipherLab help",
    "ui.99": "🔐 Using the Encrypt tab",
    "ui.100": "Choose a key mapping: select one of the three glyph sets.",
    "ui.101": "Set whitespace handling: choose whether to ignore or preserve whitespace.",
    "ui.102": "Enter text: type the text you want to encrypt.",
    "ui.103": "Live encryption: input is converted to glyphs immediately.",
    "ui.104": "Check the key mapping: used letters are yellow and the last letter is red.",
    "ui.105": "🔓 Using the Decrypt tab",
    "ui.106": "Choose a key mapping: select the glyph set used for the ciphertext.",
    "ui.107": "Select glyphs: click or use the keyboard to enter symbols.",
    "ui.108": "Enter spaces: use the Space button.",
    "ui.109": "Delete symbols: use DEL to remove the last symbol.",
    "ui.110": "Copy the result: use Copy to copy the decoded text to the clipboard.",
    "ui.111": "Reset: clear the entered symbols and decoded text.",
    "ui.112": "📘 Using the Learn tab",
    "ui.113": "Lesson 1: learn the history and basic concepts of Pigpen.",
    "ui.114": "How positions correspond to glyph shapes",
    "ui.115": "Distinguishing letters by the presence of a dot",
    "ui.116": "Tips for recognizing patterns",
    "ui.117": "Applying monoalphabetic substitution-cipher techniques",
    "ui.118": "💡 Useful features",
    "ui.119": "Switch key mappings: all three tabs update together; entered symbols are reread without changing their shapes.",
    "ui.120": "Live conversion: encryption updates as you type.",
    "ui.121": "Visual feedback: used letters are highlighted.",
    "ui.122": "Copy: copy decoded text, with feedback if copying fails.",
    "ui.123": "🎯 Study tips",
    "ui.124": "Start with the Learn tab, then practice.",
    "ui.125": "Begin with simple words such as THE, AND and OF.",
    "ui.126": "Use the key mapping to learn how shapes correspond to letters.",
    "ui.127": "Drawing the symbols on paper can help you learn them.",
    "help": "Help",
    "close": "Close",
    "tabs": "Features",
    "placeholder": "Enter text (for example: HELLO WORLD)",
    "language": "Japanese",
    "languageLabel": "Switch to Japanese",
    "title": "Pigpen CipherLab - Pigpen Cipher",
    "footer": "🔗 GitHub repository",
    "help.lesson2": "Lesson 2: understand the key mapping",
    "help.lesson3": "Lesson 3: learn cryptanalysis techniques",
    "help.grids": "The structure of 3×3 and X-shaped grids",
    "help.frequency": "Using frequency analysis",
  };

  Object.assign(ja, {
    'keyword.option': 'キーワード', 'keyword.label': 'キーワード（最大40文字）', 'keyword.base': '基にする換字表',
    'keyword.note': '換字表{base}の置き場所に、{alphabet}の順に文字を入れたキーワード表です。',
    'shape.T': '上', 'shape.R': '右', 'shape.B': '下', 'shape.L': '左',
    'shape.join': 'と', 'shape.walls': '{parts}に壁', 'shape.all': '四方に壁',
    'shape.dots': '・点{count}つ', 'shape.dot': '・点{count}つ',
    'shape.xT': 'X字の上の区画（V の字）', 'shape.xL': 'X字の左の区画',
    'shape.xR': 'X字の右の区画', 'shape.xB': 'X字の下の区画'
  });
  Object.assign(en, {
    'keyword.option': 'Keyword', 'keyword.label': 'Keyword (up to 40 characters)', 'keyword.base': 'Base mapping',
    'keyword.note': 'Keyword mapping based on mapping {base}: place the letters in this order: {alphabet}.',
    'shape.T': 'top', 'shape.R': 'right', 'shape.B': 'bottom', 'shape.L': 'left',
    'shape.join': ' and ', 'shape.walls': 'walls on the {parts}', 'shape.all': 'walls on all four sides',
    'shape.dots': ', {count} dots', 'shape.dot': ', {count} dot',
    'shape.xT': 'top section of the X (V shape)', 'shape.xL': 'left section of the X',
    'shape.xR': 'right section of the X', 'shape.xB': 'bottom section of the X'
  });

  function describeShape(shape, locale = language) {
    const core = typeof PigpenCore !== 'undefined' ? PigpenCore : require('./pigpen-core.js');
    const s = core.parseShape(shape);
    if (!s) return '';
    const dict = locale === 'en' ? en : ja;
    const parts = [...'TRBL'].filter(p => s.part.includes(p)).map(p => dict['shape.' + p]).join(dict['shape.join']);
    const description = s.kind === 'x' ? dict['shape.x' + s.part]
      : s.part.length === 4 ? dict['shape.all'] : dict['shape.walls'].replace('{parts}', parts);
    return description + (s.dots ? dict[s.dots === 1 ? 'shape.dot' : 'shape.dots'].replace('{count}', s.dots) : '');
  }

  let language = 'ja';
  Object.assign(ja, {
    'rank.letters': '文字つき（いまの換字表）', 'rank.shapes': '形だけ（全43種）',
    'rank.sample1': 'サンプル①', 'rank.sample2': 'サンプル②', 'rank.sample3': 'サンプル③',
    'rank.heading': 'どの換字表で読めるか', 'rank.empty': '記号を入力すると候補を表示します。',
    'rank.note': '英語らしさは文字頻度だけの目安です。短い列では外れることがあります。読めない記号（?）が少ない表を先に並べます。',
    'rank.mapping': '換字表{variant}', 'rank.best': 'いちばん英語らしい: {name}', 'rank.badge': 'いちばん英語らしい',
    'rank.position': '順位', 'rank.mappingHeader': '換字表', 'rank.reading': '読み', 'rank.unknown': '読めない記号',
    'rank.score': '英語らしさ', 'rank.action': '操作', 'rank.use': 'この表で読む'
  });
  Object.assign(en, {
    'rank.letters': 'Labeled keys (current mapping)', 'rank.shapes': 'Shapes only (all 43)',
    'rank.sample1': 'Sample 1', 'rank.sample2': 'Sample 2', 'rank.sample3': 'Sample 3',
    'rank.heading': 'Which mapping can read this?', 'rank.empty': 'Enter symbols to see candidate mappings.',
    'rank.note': 'English likeness uses only letter frequency and can be wrong for short sequences. Fewer unknown symbols (?) rank first.',
    'rank.mapping': 'Mapping {variant}', 'rank.best': 'Most English-like: {name}', 'rank.badge': 'Most English-like',
    'rank.position': 'Rank', 'rank.mappingHeader': 'Mapping', 'rank.reading': 'Reading', 'rank.unknown': 'Unknown symbols',
    'rank.score': 'English likeness', 'rank.action': 'Action', 'rank.use': 'Read with this mapping'
  });

  function t(key, values = {}) {
    const message = (language === 'en' ? en : ja)[key];
    if (typeof message !== 'string') throw new Error(`Unknown message: ${key}`);
    return message.replace(/\{(\w+)\}/g, (token, name) => Object.hasOwn(values, name) ? String(values[name]) : token);
  }

  function apply() {
    document.documentElement.lang = language;
    document.querySelectorAll('[data-i18n]').forEach(element => {
      element.textContent = t(element.dataset.i18n);
    });
    for (const attribute of ['placeholder', 'title', 'aria-label', 'alt']) {
      document.querySelectorAll(`[data-i18n-${attribute}]`).forEach(element => {
        element.setAttribute(attribute, t(element.getAttribute(`data-i18n-${attribute}`)));
      });
    }
  }

  function setLanguage(value) {
    if (!['ja', 'en'].includes(value)) return;
    language = value;
    try {
      localStorage.setItem('pigpen-language', language);
    } catch {
      // Storage can be blocked without disabling the tool.
    }
    apply();
    document.dispatchEvent(new Event('languagechange'));
  }

  function init() {
    const query = new URLSearchParams(location.search).get('lang');
    let saved;
    try {
      saved = localStorage.getItem('pigpen-language');
    } catch {
      // A fresh in-memory preference still works.
    }
    language = [query, saved].find(value => ['ja', 'en'].includes(value))
      || (navigator.language.toLowerCase().startsWith('ja') ? 'ja' : 'en');
    apply();
  }

  return { ja, en, t, init, apply, setLanguage, describeShape, get language() { return language; } };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = i18n;
