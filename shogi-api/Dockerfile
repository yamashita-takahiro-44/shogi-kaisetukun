# ベースイメージ
FROM ruby:3.2.2

# 必要な依存関係をインストール
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev

# アプリケーションディレクトリを作成
WORKDIR /app

# GemfileとGemfile.lockをコピー
COPY Gemfile /app/Gemfile
COPY Gemfile.lock /app/Gemfile.lock

# Bundlerを使用してGemをインストール
RUN gem install bundler -v '2.4.22'
RUN bundle install

# アプリケーションのソースコードをコピー
COPY . /app

# プロダクション環境変数を設定
ENV RAILS_ENV=production

# ポートを設定
EXPOSE 3000

# Railsサーバーを起動
CMD ["bundle", "exec", "rails", "s", "-b", "0.0.0.0"]
