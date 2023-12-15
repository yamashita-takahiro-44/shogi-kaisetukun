# 将棋解説くん

将棋の盤面と手順を解説するWebアプリケーション。ユーザーは将棋盤上での手順を動かし、その手順に基づいてChatGPT APIを使用して解説を生成します。

## 機能

- **手の解説**: ユーザーが進める各手に対して解説を提供します。
- **画像キャプチャ**: 現在の将棋盤の状態をキャプチャして、画像として保存できます。
- **Twitter共有**: 解説や将棋盤のキャプチャをTwitterで共有する機能。

## 技術スタック

- React: フロントエンドの開発に使用。
- Node.js: バックエンドサーバーの実行環境。
- Ruby on Rails: バックエンドのWebフレームワーク。
- Docker: コンテナ化によるアプリケーションのデプロイメントと管理。
- OpenAI ChatGPT API: 手順に基づいた解説の生成に使用。
- shogi-player: 将棋盤のインタラクティブな表示に使用。
- HTML2Canvas: 画像のキャプチャ
- Google Analytics
- Fly.io: デプロイに使用。

## ローカルでのセットアップ方法

1. リポジトリをクローンします:

    ```
    git clone https://github.com/yamashita-takahiro-44/shogi-kaisetukun.git
    ```

2. 必要な依存関係をインストールします:

    ```
    npm install
    ```

3. アプリケーションをローカルで実行します:

    ```
    npm start
    ```

## コントリビューション

貢献したい方は、以下の手順に従ってください:

1. プロジェクトをフォークします。
2. 新しいフィーチャーまたはバグ修正のためのブランチを作成します (`git checkout -b feature/AmazingFeature`).
3. 変更をコミットします (`git commit -m 'Add some AmazingFeature'`).
4. ブランチにプッシュします (`git push origin feature/AmazingFeature`).
5. プルリクエストをオープンします。

## ライセンス

このプロジェクトは[MITライセンス](LICENSE)の下で公開されています。

## 連絡先

Twitter: @yamashita_44
