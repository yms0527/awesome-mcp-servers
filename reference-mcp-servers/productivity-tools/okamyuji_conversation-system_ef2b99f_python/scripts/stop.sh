#!/usr/bin/env bash
echo "🛑 会話システムを停止中..."

if command -v docker-compose &> /dev/null; then
    docker-compose down
else
    docker compose down
fi

echo "✅ システム停止完了"
