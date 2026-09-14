#!/usr/bin/env bash

# 毎朝の知識準備ルーチン
echo "☀️ === 今日の知識準備レポート ==="
echo "📅 日付: $(date '+%Y年%m月%d日 %A')"
echo ""

# 1. 昨日の活動サマリー
echo "## 📊 昨日のアクティビティ"
YESTERDAY=$(date -d "1 day ago" +%Y-%m-%d 2>/dev/null || date -v-1d +%Y-%m-%d 2>/dev/null || echo "2025-06-04")
YESTERDAY_MESSAGES=$(curl -X POST http://localhost:8000/search \
  -H "Content-Type: application/json" \
  -d '{"query_terms": [], "limit": 100}' 2>/dev/null | \
  jq --arg date "$YESTERDAY" '[.[] | select(.timestamp | startswith($date))]')

YESTERDAY_COUNT=$(echo "$YESTERDAY_MESSAGES" | jq '. | length')
echo "- 昨日の議論: ${YESTERDAY_COUNT}件"

if [ "$YESTERDAY_COUNT" -gt "0" ]; then
    echo "- 主要トピック:"
    echo "$YESTERDAY_MESSAGES" | jq -r '.[] | .topics[]?' 2>/dev/null | \
      sort | uniq -c | sort -nr | head -3 | \
      awk '{printf "  • %s (%d回)\n", $2, $1}'
fi

echo ""

# 2. 今週の学習進捗
echo "## 📈 今週の学習進捗"
curl -s http://localhost:8000/analytics | jq -r '
  "総蓄積知識: \(.total_messages)メッセージ",
  "活発なトピック数: \(.top_topics | length)個"
'

# 3. 今日の推奨フォーカス
echo ""
echo "## 🎯 今日の推奨フォーカス"
echo "過去の議論から以下の領域に注目することを推奨："
curl -s http://localhost:8000/analytics | jq -r '.top_topics[0:3][] | 
  "• \(.topic) - さらなる深掘りの機会"
'

# 4. 未解決の課題
echo ""
echo "## ❓ 継続検討が必要な領域"
echo "最近の議論から未完了の可能性があるトピック:"
curl -X POST http://localhost:8000/context \
  -H "Content-Type: application/json" \
  -d '{"limit": 3, "format_type": "narrative"}' 2>/dev/null | \
  jq -r '.context' | grep -E "(検討|課題|問題|TODO)" || echo "特になし"

echo ""
echo "🚀 === 今日も生産的な一日を！ ==="
