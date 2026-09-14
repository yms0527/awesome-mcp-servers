#!/usr/bin/env bash

# 月次戦略レビュー
echo "📈 === 月次知識戦略レビュー ==="
echo "📅 $(date '+%Y年%m月') 総括"
echo ""

# 1. 成長メトリクス
echo "## 📊 知識蓄積メトリクス"
ANALYTICS=$(curl -s http://localhost:8000/analytics)
echo "$ANALYTICS" | jq -r '
  "総メッセージ数: \(.total_messages)件",
  "アクティブトピック: \(.top_topics | length)分野"
'

# 2. 知識の深度分析
echo ""
echo "## 🎯 専門知識の深度"
echo "$ANALYTICS" | jq -r '.top_topics[] | 
  if .count >= 10 then "🟢 \(.topic): 上級レベル (\(.count)回)" 
  elif .count >= 5 then "🟡 \(.topic): 中級レベル (\(.count)回)"
  else "🔴 \(.topic): 初級レベル (\(.count)回)" end
'

# 3. 学習ギャップの特定
echo ""
echo "## ❓ 学習ギャップ分析"
echo "集中的に学習すべき領域:"
echo "$ANALYTICS" | jq -r '.top_topics[-3:][] | 
  "• \(.topic) - より深い理解が必要 (現在:\(.count)回)"
'

# 4. 来月の戦略提案
echo ""
echo "## 🚀 来月の学習戦略"
echo "1. 上位トピックの実践的応用"
echo "2. 新しい分野への挑戦"
echo "3. 既存知識の体系化"

echo ""
echo "💡 === 継続的成長のために ==="
