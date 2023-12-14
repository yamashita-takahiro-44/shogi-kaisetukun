module.exports = {
  presets: [
    '@babel/preset-env',   // ECMAScriptの機能をトランスパイル
    '@babel/preset-react'  // ReactのJSXをトランスパイル
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties', // クラスプロパティの提案構文サポート
    '@babel/plugin-proposal-optional-chaining' // オプショナルチェイニングのサポート
  ]
};
