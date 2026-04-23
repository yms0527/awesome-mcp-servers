#!/usr/bin/env bash

# 専門分野別知識分析
DOMAIN=$1

if [ -z "$DOMAIN" ]; then
    echo "使用方法: $0 <専門分野名>"
    echo "例: $0 'プログラミング'"
    echo "例: $0 'ビジネス戦略'"
    exit 1
fi

echo "=== 🎯 専門分野分析: $DOMAIN ==="
echo ""

# 関連する議論を検索
echo "## 📚 関連する過去の議論"
curl -X POST http://localhost:8000/search \
  -H "Content-Type: application/json" \
  -d "{\"query_terms\": [\"$DOMAIN\"], \"limit\": 20}" 2>/dev/null | \
  jq -r '.[] | 
    "📅 \(.timestamp | split("T")[0]) [\(.role)]: \(.content | .[0:100])..."
  '

echo ""
echo "## 💡 この分野での学習進捗"
echo "- 議論回数: $(curl -X POST http://localhost:8000/search -H "Content-Type: application/json" -d "{\"query_terms\": [\"$DOMAIN\"], \"limit\": 100}" 2>/dev/null | jq '. | length')回"
echo "- 最新議論: $(curl -X POST http://localhost:8000/search -H "Content-Type: application/json" -d "{\"query_terms\": [\"$DOMAIN\"], \"limit\": 1}" 2>/dev/null | jq -r '.[0].timestamp | split("T")[0]' 2>/dev/null || echo '未検出')"

echo ""
echo "## 🎯 推奨アクション"
echo "1. 未解決の課題を特定"
echo "2. 関連トピックとの連携探索"
echo "3. 実践的応用の検討"
