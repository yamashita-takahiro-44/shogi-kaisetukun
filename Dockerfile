# Stage 1: Build the React Frontend
FROM node:20.5.1 AS frontend-builder
WORKDIR /frontend
COPY shogi-frontend/package.json shogi-frontend/package-lock.json ./
RUN npm install
COPY shogi-frontend .
RUN npm run build

# Stage 2: Build the Rails API
FROM ruby:3.2.2 AS api-builder
WORKDIR /app/api
COPY shogi-api/Gemfile shogi-api/Gemfile.lock ./
RUN gem install bundler -v '2.4.22'
RUN bundle install --deployment
COPY shogi-api .

# Stage 3: Setup Nginx with Frontend and API
FROM nginx:alpine
WORKDIR /app

# 必要な依存関係をインストール
RUN apk add --no-cache build-base openssl-dev zlib-dev yaml-dev ruby-dev postgresql-dev

# Rubyのソースからインストール
RUN wget -O ruby.tar.gz "https://cache.ruby-lang.org/pub/ruby/3.2/ruby-3.2.2.tar.gz" \
    && tar -xzf ruby.tar.gz \
    && cd ruby-3.2.2 \
    && ./configure --disable-install-doc \
    && make \
    && make install

# Bundlerのインストール
RUN gem install bundler -v '2.4.22'

# Copy from previous stages
COPY --from=frontend-builder /frontend/build /usr/share/nginx/html
COPY --from=api-builder /app/api /app/api

# Bundlerを使用してGemをインストール (deployment flagを設定)
RUN cd /app/api && bundle config set --local deployment 'true' && bundle install

# Nginxの設定ファイルをコピー
COPY nginx.conf /etc/nginx/nginx.conf

# start.shスクリプトをコピーして実行可能にする
COPY start.sh /start.sh
RUN chmod +x /start.sh

# ENV PATHを更新してBundlerのパスを確認
ENV PATH="/app/api/vendor/bundle/ruby/3.2.0/bin:/usr/local/bin:$PATH"
RUN echo $PATH && which bundle

# ポートとCMDを設定
EXPOSE 8080
CMD ["/start.sh"]
