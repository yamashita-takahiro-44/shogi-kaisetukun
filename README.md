将棋解説くん
将棋の盤面と手順を解説するWebアプリケーション。ユーザーは将棋盤上での手順を動かし、その手順に基づいてChatGPT APIを使用して解説を生成します。

特徴
将棋盤上で手順を動かすことができるインタラクティブなUI。
各手順に基づいた解説を生成する機能。
リアルタイムでの手順の更新と解説の表示。
使用技術
React: フロントエンドの開発に使用。
Node.js: バックエンドサーバーの実行環境。
Express.js: バックエンドのWebフレームワーク。
Docker: コンテナ化によるアプリケーションのデプロイメントと管理。
OpenAI ChatGPT API: 手順に基づいた解説の生成に使用。
shogi-player: 将棋盤のインタラクティブな表示に使用。
インストール方法
リポジトリをクローンします。

bash
Copy code
git clone [リポジトリのURL]
プロジェクトのルートディレクトリに移動します。

bash
Copy code
cd shogi-board-app
必要な依存関係をインストールします。

Copy code
npm install
Dockerコンテナをビルドして実行します。

css
Copy code
docker-compose up --build
使用方法
ブラウザで http://localhost:3001 にアクセスします。

将棋盤上で手順を動かし、解説を生成します。

生成された解説を確認します。

ライセンス
このプロジェクトはMITライセンスの下で公開されています。

