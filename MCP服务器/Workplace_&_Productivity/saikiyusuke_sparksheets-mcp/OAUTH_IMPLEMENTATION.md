# SparkSheets MCP Server - OAuth 2.0 実装

## 概要

SparkSheets MCP ServerはOAuth 2.0 Authorization Code Flowを実装し、ユーザーフレンドリーな認証を実現しています。

## アーキテクチャ

```
Claude Code CLI
  ↓
MCP Server (oauth-client.js)
  ↓
ブラウザで認証ページ表示
  ↓
SparkSheets OAuth エンドポイント
  ├─ /api/oauth/authorize.php (認証画面)
  ├─ /api/oauth/generate-code.php (認証コード生成)
  └─ /api/oauth/token.php (トークン交換)
  ↓
Firebase Authentication (Google Login)
  ↓
MySQL Database (oauth_codes, oauth_tokens)
  ↓
Access Token発行 (1年間有効)
```

## OAuth フロー詳細

### 1. 初回認証

```
1. ユーザーがMCPツールを初めて使用
   ↓
2. oauth-client.js が保存済みトークンを確認 → なし
   ↓
3. ブラウザで認証URL を開く
   https://sparksheets.ai/api/oauth/authorize.php?
     client_id=mcp-sparksheets-client&
     redirect_uri=http://localhost:3827/callback&
     state=ランダム文字列&
     scope=read+write
   ↓
4. ユーザーがGoogleアカウントでログイン (Firebase Auth)
   ↓
5. 認証成功 → 「連携を許可」ボタンクリック
   ↓
6. generate-code.php が認証コードを生成 (10分間有効)
   ↓
7. http://localhost:3827/callback?code=xxx&state=xxx にリダイレクト
   ↓
8. oauth-client.js のローカルサーバーが受信
   ↓
9. token.php に認証コードを送信
   ↓
10. Access Token + Refresh Token を取得 (1年間有効)
   ↓
11. ~/.claude/mcp-servers/mcp-sparksheets/tokens.json に保存
```

### 2. 通常使用（トークン有効期限内）

```
1. ユーザーがMCPツールを使用
   ↓
2. oauth-client.js が tokens.json を読み込み
   ↓
3. 有効期限をチェック → OK（5分以上余裕あり）
   ↓
4. Access Token をそのまま使用
   ↓
5. SparkSheets API にリクエスト
```

### 3. トークンリフレッシュ（期限切れ間近）

```
1. ユーザーがMCPツールを使用
   ↓
2. oauth-client.js が有効期限をチェック → 5分以内に期限切れ
   ↓
3. Refresh Token を使って token.php にリクエスト
   ↓
4. 新しい Access Token を取得 (1年延長)
   ↓
5. tokens.json を更新
   ↓
6. 新しいトークンで API リクエスト
```

## ファイル構成

### SparkSheets側（PHP）

| ファイル | 役割 | URL |
|---------|------|-----|
| `api/oauth/authorize.php` | 認証画面（Google Login UI） | https://sparksheets.ai/api/oauth/authorize.php |
| `api/oauth/generate-code.php` | 認証コード生成 | 内部API（JS→PHP） |
| `api/oauth/token.php` | トークン交換/リフレッシュ | POST専用エンドポイント |
| `database/oauth-schema.sql` | DB スキーマ | - |

### MCP Server側（Node.js）

| ファイル | 役割 |
|---------|------|
| `lib/oauth-client.js` | OAuth 2.0 クライアント実装 |
| `lib/api-client.js` | SparkSheets API ラッパー（OAuth統合） |
| `server.js` | MCPサーバー本体 |
| `tokens.json` | 保存されたトークン（自動生成） |

## データベーススキーマ

### oauth_codes テーブル

| カラム | 型 | 説明 |
|--------|-----|------|
| id | INT | 自動採番 |
| code | VARCHAR(64) | 認証コード（一意） |
| user_id | VARCHAR(128) | Firebase UID |
| email | VARCHAR(255) | ユーザーメール |
| client_id | VARCHAR(128) | mcp-sparksheets-client |
| redirect_uri | TEXT | http://localhost:3827/callback |
| scope | VARCHAR(255) | read write |
| expires_at | DATETIME | 有効期限（10分） |
| used | TINYINT(1) | 使用済みフラグ |
| created_at | DATETIME | 作成日時 |

### oauth_tokens テーブル

| カラム | 型 | 説明 |
|--------|-----|------|
| id | INT | 自動採番 |
| access_token | VARCHAR(64) | アクセストークン（sk_xxx） |
| refresh_token | VARCHAR(64) | リフレッシュトークン（rt_xxx） |
| user_id | VARCHAR(128) | Firebase UID |
| email | VARCHAR(255) | ユーザーメール |
| client_id | VARCHAR(128) | mcp-sparksheets-client |
| expires_at | DATETIME | 有効期限（1年） |
| revoked | TINYINT(1) | 取り消しフラグ |
| created_at | DATETIME | 作成日時 |
| updated_at | DATETIME | 更新日時 |

## セキュリティ

### 実装済み

- ✅ State パラメータで CSRF 対策
- ✅ 認証コードは10分で期限切れ
- ✅ 認証コードは1回のみ使用可能（used フラグ）
- ✅ トークンは1年で期限切れ
- ✅ Firebase ID Token検証
- ✅ Client ID 検証
- ✅ Redirect URI 検証
- ✅ HTTPS通信（本番環境）
- ✅ リフレッシュトークンによる自動更新

### 今後の拡張案

- [ ] Client Secret 追加（よりセキュアな認証）
- [ ] PKCE (Proof Key for Code Exchange) 対応
- [ ] トークン取り消しAPI
- [ ] スコープ別権限管理
- [ ] レート制限

## トラブルシュート

### 認証が失敗する

```bash
# トークンファイルを削除して再認証
rm ~/.claude/mcp-servers/mcp-sparksheets/tokens.json

# 次回ツール使用時にブラウザで再認証される
```

### ローカルサーバーがポート3827で起動しない

```bash
# ポートが使用中か確認
lsof -i :3827

# プロセスを停止
kill -9 <PID>
```

### データベースエラー

```bash
# VPSに接続してテーブル確認
ssh -i ~/.ssh/id_ed25519 deploy@162.43.41.64
sudo mysql sparksheets

# テーブル存在確認
SHOW TABLES LIKE 'oauth_%';

# 再適用が必要な場合
sudo mysql sparksheets < /tmp/oauth-schema.sql
```

## テスト方法

### 1. 新規セッションでテスト

```bash
# 新しいClaude Codeセッションを開始
cd /Users/apple/Projects/mothership

# トークンファイルが存在しないことを確認
ls ~/.claude/mcp-servers/mcp-sparksheets/tokens.json
# → No such file or directory

# MCPツールを使用（例: save_session）
「今日の作業をSparkSheetsに保存して」

# ブラウザが開いて認証画面が表示されるはず
```

### 2. トークンリフレッシュのテスト

```bash
# トークンファイルを手動で期限切れに設定
node -e "
const fs = require('fs');
const tokens = JSON.parse(fs.readFileSync('/Users/apple/.claude/mcp-servers/mcp-sparksheets/tokens.json'));
tokens.expires_at = new Date(Date.now() + 60000).toISOString(); // 1分後に期限切れ
fs.writeFileSync('/Users/apple/.claude/mcp-servers/mcp-sparksheets/tokens.json', JSON.stringify(tokens, null, 2));
"

# 2分待ってからツール使用
# → 自動リフレッシュが動作するはず
```

### 3. SparkSheets側のエンドポイントテスト

```bash
# 認証画面が表示されるか
curl -I "https://sparksheets.ai/api/oauth/authorize.php?client_id=mcp-sparksheets-client&redirect_uri=http://localhost:3827/callback&state=test&scope=read"
# → HTTP/2 200

# トークンエンドポイントが動作するか（要認証コード）
curl -X POST https://sparksheets.ai/api/oauth/token.php \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code&code=xxx&redirect_uri=http://localhost:3827/callback&client_id=mcp-sparksheets-client"
```

## 運用

### トークンの有効期限管理

- **Access Token**: 1年間有効
- **Refresh Token**: 1年間有効（同じ期限）
- 期限切れ5分前から自動リフレッシュ
- リフレッシュ失敗時はブラウザで再認証

### ログ確認

```bash
# MCP Serverのログ（標準エラー出力）
# Claude Codeのログウィンドウに表示される

# SparkSheets側のログ
ssh -i ~/.ssh/id_ed25519 deploy@162.43.41.64
sudo tail -f /var/log/php8.4-fpm.log
```

### データベースメンテナンス

```sql
-- 期限切れコード削除（1日1回推奨）
DELETE FROM oauth_codes WHERE expires_at < NOW() AND created_at < DATE_SUB(NOW(), INTERVAL 1 DAY);

-- 古いトークン削除（1年以上前）
DELETE FROM oauth_tokens WHERE expires_at < DATE_SUB(NOW(), INTERVAL 365 DAY);

-- 使用状況確認
SELECT COUNT(*) as total_tokens, COUNT(DISTINCT user_id) as unique_users FROM oauth_tokens WHERE revoked = 0;
```

## まとめ

SparkSheets MCP ServerはOAuth 2.0を実装することで：

1. **ユーザーフレンドリー** - ブラウザで簡単にログイン
2. **セキュア** - 標準的なOAuthフロー、Firebase認証
3. **自動管理** - トークンの自動リフレッシュ
4. **長期有効** - 1年間再認証不要

従来のJWT手動取得方式から大幅に改善されました。
