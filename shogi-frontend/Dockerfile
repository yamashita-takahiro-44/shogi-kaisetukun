# ビルドステージ
FROM node:20.5.1 as build-stage
WORKDIR /app
COPY shogi-frontend/package.json shogi-frontend/package-lock.json ./
RUN npm install
COPY shogi-frontend ./
RUN npm run build

# 本番環境ステージ
FROM nginx:alpine
COPY --from=build-stage /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
