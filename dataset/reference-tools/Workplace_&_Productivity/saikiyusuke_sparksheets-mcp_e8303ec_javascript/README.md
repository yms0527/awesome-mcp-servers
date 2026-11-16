# SparkSheets MCP Server

MCP server for SparkSheets - AI-powered document platform integration for Claude Code, Cursor, and Cline.

[日本語](#-概要) | English

## Installation

```bash
npm install -g @sparksheets/mcp
```

## Quick Setup

Add to your `~/.claude.json`:

```json
{
  "mcpServers": {
    "sparksheets": {
      "command": "sparksheets-mcp"
    }
  }
}
```

Then login with your SparkSheets account:

```
sparksheets_login
```

## Features

- **Session Management** - Save and search development session history
- **Knowledge Base** - Store error solutions and code snippets
- **Usage Tracking** - Sync /stats output and work time
- **Sheet Operations** - Create, edit, search sheets from CLI
- **Spark Integration** - Run AI features from terminal

## Available Tools (37 tools)

| Category | Tools |
|----------|-------|
| Auth | `sparksheets_login`, `sparksheets_logout`, `sparksheets_auth_status` |
| Sessions | `save_session`, `list_sessions`, `search_sessions`, `create_handover` |
| Knowledge | `save_solution`, `find_solution`, `save_snippet`, `get_snippet` |
| Sheets | `upload_image`, `append_to_sheet`, `list_sheets`, `create_sheet`, `update_sheet`, `get_sheet_content`, `search_sheets`, `delete_sheet`, `add_column`, `remove_column`, `get_column_info` |
| Stats | `sync_stats`, `log_work_time`, `get_usage_dashboard` |
| Tasks | `sync_todos`, `get_review_queue` |
| Spark | `run_spark`, `list_sparks`, `translate_sheet` |
| Share & Members | `create_share_link`, `get_share_settings`, `disable_share`, `list_members`, `add_member`, `update_member_role`, `remove_member` |


## Documentation

- User Guide: https://sparksheets.ai/docs/guide/mcp/
- SparkSheets: https://sparksheets.ai/

## License

MIT

---

# 日本語ドキュメント

Claude Code開発者のためのダッシュボード。セッション履歴、ナレッジベース、使用量統計、タスク管理をSparkSheetsで一元管理。

## 📋 概要

このMCPサーバーは、Claude CodeとSparkSheetsを統合し、以下を実現します：

- **セッション管理**: 開発セッションの履歴保存・検索
- **ナレッジベース**: エラー解決策とコードスニペットの蓄積
- **使用量追跡**: /stats出力の自動保存・可視化
- **タスク管理**: TodoWriteの進捗同期
- **シート操作**: SparkSheets CRUD操作
- **Spark連携**: AIボタン機能のCLI実行

## 🛠️ インストール

### npm（推奨）

```bash
npm install -g @sparksheets/mcp
```

`~/.claude.json` に追加：

```json
{
  "mcpServers": {
    "sparksheets": {
      "command": "sparksheets-mcp"
    }
  }
}
```

### 手動インストール

```bash
git clone https://github.com/sparksheets/mcp.git ~/.claude/mcp-servers/mcp-sparksheets
cd ~/.claude/mcp-servers/mcp-sparksheets
npm install
```

`~/.claude.json` に追加：

```json
{
  "mcpServers": {
    "sparksheets": {
      "type": "stdio",
      "command": "node",
      "args": ["/Users/YOUR_USERNAME/.claude/mcp-servers/mcp-sparksheets/server.js"]
    }
  }
}
```

## 🔧 初回認証

Claude Codeで以下を実行：

```
sparksheets_login
```

または自然言語で：

```
「SparkSheetsにログインして」
```

ブラウザが開き、Googleアカウントで認証後、自動的にトークンが保存されます。

**トークン保存場所**: `~/.sparksheets/tokens.json`

## 🛠️ 実装ツール一覧（37ツール）

### 認証（3ツール）
- `sparksheets_login` - SparkSheetsにログインします。ブラウザが開き、Googleアカウントで認証後、自動的にトークンが保存されます。
- `sparksheets_logout` - SparkSheetsからログアウトします。保存されたトークンを削除します。
- `sparksheets_auth_status` - 現在の認証状態を確認します。ログイン中のユーザー情報やトークンの有効期限を表示します。

### セッション管理（4ツール）
- `save_session` - 現在のセッション要約をSparkSheetsに保存
- `list_sessions` - 全セッション一覧を取得
- `search_sessions` - キーワードでセッション検索
- `create_handover` - 引き継ぎシート自動生成（次にやること、注意点などをまとめる）

### ナレッジベース（4ツール）
- `save_solution` - エラー解決策を辞典に保存
- `find_solution` - 過去の解決策を検索
- `save_snippet` - コードスニペットを保存
- `get_snippet` - スニペットを取得・検索

### シート操作（11ツール）
- `upload_image` - 画像をSparkSheetsにアップロード。Base64またはファイルパスを指定。戻り値にMarkdown形式の画像タグを含む
- `append_to_sheet` - シートの指定カラムの末尾にコンテンツを追記
- `list_sheets` - シート一覧取得
- `create_sheet` - 新規シート作成
- `update_sheet` - シート編集
- `get_sheet_content` - シート内容取得（オプションでコンテキスト制御可能）
- `search_sheets` - シート検索
- `delete_sheet` - シート削除
- `add_column` - シートにカラムを追加（最大3カラムまで）
- `remove_column` - シートからカラムを削除
- `get_column_info` - シートのカラム情報を取得

### 統計・作業時間（3ツール）
- `sync_stats` - /statsの内容をSparkSheetsに同期
- `log_work_time` - 作業時間を記録
- `get_usage_dashboard` - 使用量ダッシュボードURL取得

### タスク管理（2ツール）
- `sync_todos` - TodoWriteの内容をSparkSheetsに同期
- `get_review_queue` - PRレビューキュー取得（GitHub連携）

### Spark連携（3ツール）
- `run_spark` - Spark（AIボタン）をCLIから実行
- `list_sparks` - 利用可能なSpark一覧
- `translate_sheet` - シートを多言語翻訳

### 共有・メンバー管理（7ツール）
- `create_share_link` - シートの共有リンクを発行。既存のアクティブな共有がある場合は再利用される
- `get_share_settings` - シートの現在の共有設定を取得
- `disable_share` - 共有リンクを無効化
- `list_members` - シートのメンバー一覧を取得
- `add_member` - シートにメンバーを追加（招待）。オーナーのみ実行可能
- `update_member_role` - メンバーの権限を変更。オーナーのみ実行可能
- `remove_member` - シートからメンバーを削除。オーナーのみ実行可能


## 📝 使用例

### セッション保存
```
「今日の作業をSparkSheetsに保存して」
→ save_session ツールが実行される
→ https://sparksheets.ai/sheet/xxx に保存
```

### エラー辞典
```
「このCORSエラーの解決策、保存しておいて」
→ save_solution ツールが実行

「CORSエラーの直し方、前に保存したやつ見せて」
→ find_solution("CORS") で検索
```

### 引き継ぎシート
```
「引き継ぎシート作って」
→ create_handover ツールが実行
→ 次にやること、注意点、関連ファイルがまとまったシート生成
```

### 統計同期
```
「/statsの結果をSparkSheetsに保存して」
→ sync_stats ツールが実行
→ グラフ化されたダッシュボードで確認可能
```

## 🗂️ ファイル構成

```
~/.claude/mcp-servers/mcp-sparksheets/
├── server.js              # MCPサーバー本体
├── package.json
├── README.md              # このファイル
├── tools/
│   ├── auth.js            # 認証ツール
│   ├── sessions.js        # セッション管理ツール
│   ├── knowledge.js       # ナレッジベースツール
│   ├── stats.js           # 統計ツール
│   ├── tasks.js           # タスク管理ツール
│   ├── sheets.js          # シート操作ツール
│   └── spark.js           # Spark連携ツール
├── lib/
│   ├── api-client.js      # SparkSheets API ラッパー
│   └── storage.js         # ローカルJSON保存
└── logs/
    ├── sessions.json      # セッション履歴
    ├── solutions.json     # エラー辞典
    ├── snippets.json      # スニペット
    ├── stats-history.json # 統計履歴
    └── work-time.json     # 作業時間ログ
```

## 🔄 データストレージ戦略

**デュアルストレージ**:
- **ローカル**: `logs/*.json` にJSON形式で保存（オフライン対応）
- **クラウド**: SparkSheets にシートとして保存（共有・可視化）

## 🚀 今後の拡張予定

### SparkSheets → Claude Code CLI
- シートで仕様書 → 自動実装
- タスクボード → 自動実行
- バグ報告 → 自動修正

使いながら必要な機能を随時追加予定。

## 📄 ライセンス

MIT

## 🤝 コントリビューション

Issue・PRは [GitHub リポジトリ](https://github.com/sparksheets/mcp) まで。
