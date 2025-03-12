# Python 3.11をベースに使用
FROM python:3.11-slim

# 作業ディレクトリを設定
WORKDIR /app

# 依存パッケージのインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# FastAPIのコードをコピー
COPY . .

# FastAPIを起動する
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
