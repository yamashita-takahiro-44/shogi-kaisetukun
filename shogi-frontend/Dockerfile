FROM node:20.5.1

WORKDIR /shogi-frontend
COPY package.json package-lock.json ./
RUN npm install
COPY . ./

# 開発サーバーを起動
CMD ["npm", "start"]
