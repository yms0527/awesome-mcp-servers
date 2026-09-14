# GitHub MCP Server

このリポジトリは Model Context Protocol (MCP) サーバーの実装と使用方法のテストを行うためのものです。

## 概要

Model Context Protocol (MCP) は、大規模言語モデル (LLM) とクライアントアプリケーション間の通信を標準化するためのプロトコルです。このプロトコルを使用することで、エージェントは外部ツールやクライアントアプリケーションと効果的に連携することができます。

GitHub MCPサーバーは、GitHub APIと連携し、リポジトリ操作、コード検索、イシュー管理などの機能をLLMエージェントに提供します。

## 特徴

- **リポジトリ操作**: リポジトリの作成、ファイルの追加・編集、ブランチ管理
- **コード検索**: GitHub上のコードを検索
- **イシュー/PR管理**: イシューやプルリクエストの作成、更新、コメント
- **認証管理**: GitHub APIとの安全な認証

## 必要条件

- Node.js (v16.0.0以上)
- npm または yarn
- GitHub アカウントと個人アクセストークン (PAT)

## インストール方法

```bash
# リポジトリをクローン
git clone https://github.com/tomo-cps/mcp-test.git
cd mcp-test

# 依存パッケージのインストール
npm install
# または
yarn install
```

## 設定

1. `.env` ファイルを作成し、以下の環境変数を設定:

```
GITHUB_TOKEN=your_github_personal_access_token
PORT=3000
```

2. GitHub 個人アクセストークンを取得する方法:
   - GitHub にログイン
   - 右上のプロフィールアイコン > Settings > Developer settings > Personal access tokens
   - "Generate new token" をクリック
   - 必要な権限を選択 (repo, user, read:org 推奨)
   - トークンを生成し、`.env` ファイルに保存

## サーバーの起動

```bash
# 開発モード
npm run dev
# または
yarn dev

# 本番モード
npm start
# または
yarn start
```

デフォルトでは、サーバーは `http://localhost:3000` で実行されます。

## API エンドポイント

このMCPサーバーは以下の主要なエンドポイントを提供します:

- `/mcp/describe`: 利用可能な機能とパラメータを記述
- `/mcp/execute`: 指定されたコマンドを実行
- `/mcp/state`: 現在の状態を取得または更新

## 使用例

### 1. リポジトリ情報の取得

```javascript
// クライアント側のコード例
const response = await fetch('http://localhost:3000/mcp/execute', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    command: 'get_repository',
    params: {
      owner: 'octocat',
      repo: 'hello-world'
    }
  })
});

const data = await response.json();
console.log(data);
```

### 2. イシューの作成

```javascript
// クライアント側のコード例
const response = await fetch('http://localhost:3000/mcp/execute', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    command: 'create_issue',
    params: {
      owner: 'your-username',
      repo: 'your-repo',
      title: 'バグ: ログイン画面で問題が発生',
      body: '詳細な説明をここに記述します...',
      labels: ['bug', 'priority:high']
    }
  })
});

const data = await response.json();
console.log(data);
```

## トラブルシューティング

一般的な問題と解決方法：

1. **認証エラー**: GitHub トークンが正しく設定されていることを確認してください。
2. **レート制限**: GitHub API にはレート制限があります。制限に達した場合、しばらく待ってから再試行してください。
3. **CORS エラー**: クロスオリジン呼び出し時には、サーバーが適切な CORS ヘッダーを設定していることを確認してください。

## コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 参考資料

- [Model Context Protocol 仕様](https://github.com/microsoft/model-context-protocol)
- [GitHub REST API ドキュメント](https://docs.github.com/en/rest)