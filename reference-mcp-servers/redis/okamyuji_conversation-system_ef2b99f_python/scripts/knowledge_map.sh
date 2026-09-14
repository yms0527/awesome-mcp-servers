#!/usr/bin/env bash

# 知識連想マップ生成
SEED_TOPIC=$1

if [ -z "$SEED_TOPIC" ]; then
    echo "使用方法: $0 <起点トピック>"
    echo "例: $0 'Docker'"
    exit 1
fi

echo "=== 🧠 知識連想マップ: $SEED_TOPIC ==="
echo ""

# 起点トピックの検索
echo "## 🎯 起点トピック: $SEED_TOPIC"
RELATED_MESSAGES=$(curl -X POST http://localhost:8000/search \
  -H "Content-Type: application/json" \
  -d "{\"query_terms\": [\"$SEED_TOPIC\"], \"limit\": 10}" 2>/dev/null)

echo "$RELATED_MESSAGES" | jq -r '.[] | .content | .[0:150]' | head -3
echo ""

# 関連キーワードの抽出と分析
echo "## 🔗 関連する概念ネットワーク"
echo "$RELATED_MESSAGES" | jq -r '.[] | .keywords[]?' 2>/dev/null | \
  sort | uniq -c | sort -nr | head -10 | \
  awk '{printf "- %s (出現:%d回)\n", $2, $1}'

echo ""
echo "## 💡 学習機会の発見"
echo "1. 上記の関連概念を深掘り"
echo "2. 異なる概念間の橋渡し探索"
echo "3. 実践的応用シナリオの開発"

echo ""
echo "## 🚀 次のステップ提案"
NEXT_TOPICS=$(echo "$RELATED_MESSAGES" | jq -r '.[] | .keywords[]?' 2>/dev/null | \
  grep -v "$SEED_TOPIC" | sort | uniq | head -3)

for topic in $NEXT_TOPICS; do
    echo "- 「$topic」についてより詳しく議論する"
done
