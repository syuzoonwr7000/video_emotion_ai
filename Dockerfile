# ベースイメージ: Python 3.11
FROM python:3.11

# 作業ディレクトリを /app に設定
WORKDIR /app

# ffmpegのインストール
RUN apt-get update && apt-get install -y ffmpeg

# 必要なファイルをコンテナにコピー
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --upgrade speechbrain

# アプリのコードをコピー
COPY app /app/app
COPY static /app/static

# FastAPI を起動
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]