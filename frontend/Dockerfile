# Node.jsをベースに使用
FROM node:16-alpine

# 作業ディレクトリを設定
WORKDIR /app

# パッケージのインストールに必要なファイルをコピー
COPY package*.json ./

# 必要な依存をインストール
RUN npm install

# ソースコードをコピー
COPY . .

# アプリケーションをビルド
RUN npm run build

# ビルドされた静的ファイルをnginxで提供
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

# nginxのポートを開放
EXPOSE 80
