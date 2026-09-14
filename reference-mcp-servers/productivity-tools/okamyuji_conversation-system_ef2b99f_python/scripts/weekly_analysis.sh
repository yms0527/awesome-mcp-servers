#!/usr/bin/env bash

# 週次会話分析レポート
echo "=== 📊 週次会話分析レポート ==="
echo "生成日時: $(date)"
echo ""

# 基本統計
echo "## 📈 基本統計"
curl -s http://localhost:8000/analytics | jq -r '
  "総メッセージ数: \(.total_messages)件",
  "総インサイト数: \(.total_insights)件",
  "最終更新: \(.last_updated)"
'
echo ""

# トップトピック
echo "## 🏷️ 最も議論されたトピック"
curl -s http://localhost:8000/analytics | jq -r '.top_topics[] | 
  "\(.topic): \(.count)回"
' | head -10
echo ""

# 最新コンテキスト
echo "## 💭 最新の議論コンテキスト"
curl -X POST http://localhost:8000/context \
  -H "Content-Type: application/json" \
  -d '{"limit": 5, "format_type": "narrative"}' 2>/dev/null | jq -r '.context'

echo ""
echo "=== レポート終了 ==="
