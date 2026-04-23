FROM python:3.11-slim

# システムパッケージのインストール
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    redis-tools \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリ設定
WORKDIR /app

# Python依存関係のインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションファイルのコピー
COPY app/ ./

# ディレクトリ作成
RUN mkdir -p /app/data /app/logs /app/conversations

# 非rootユーザー作成
RUN groupadd -r appgroup && useradd -r -g appgroup appuser
RUN chown -R appuser:appgroup /app
USER appuser

# ポート公開
EXPOSE 8000

# 起動コマンド
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
