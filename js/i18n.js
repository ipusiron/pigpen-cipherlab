// UI messages are kept separate from cipher state and the pure core.
const i18n = (() => {
  const ja = {
    'mode.ignore': '現在：空白を無視',
    'mode.preserve': '現在：空白を保持',
    'warn.ignored': '英字以外の{count}文字は無視しました',
    'warn.spacesKept': '空白と改行は保持しました',
    'warn.spacesDropped': '空白と改行は無視しました',
    'decode.space': '空白',
    'decode.delete': '最後の記号を削除',
    'decode.key': '記号{letter}を入力',
    'decode.sequence': '入力した記号の列',
    'decode.unknown': 'この換字表にない記号は?で表示しています',
    'copy.success': 'コピーしました',
    'copy.failure': 'コピーできませんでした。読みを選択してコピーしてください',
    'mapping.alt': '換字表{variant}',
    'mapping.1': '井桁→点つき井桁→X字→点つきX字（Wikipediaの配置）。',
    'mapping.2': '井桁→X字→点つき井桁→点つきX字（『暗号解読 実践ガイド』P.438）。',
    'mapping.3': '井桁の9マスに3文字ずつ置き、点の数（1〜3）で区別します（『暗号の秘密』P.62）。'
      + 'Wikipediaのバラ十字の方式は点の位置（左・中・右）で区別する別方式です。'
  };

  function t(key, values = {}) {
    const message = ja[key];
    if (typeof message !== 'string') throw new Error(`Unknown message: ${key}`);
    return message.replace(/\{(\w+)\}/g, (token, name) => Object.hasOwn(values, name) ? String(values[name]) : token);
  }

  return { ja, t };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = i18n;
