/**
 * Auth Tools - ログイン/ログアウト/ステータス確認
 */

import { OAuthClient } from '../lib/oauth-client.js';
import fs from 'fs/promises';
import path from 'path';

const TOKEN_FILE = path.join(process.env.HOME, '.sparksheets', 'tokens.json');

export const authTools = [
  {
    name: 'sparksheets_login',
    description: 'SparkSheetsにログインします。ブラウザが開き、Googleアカウントで認証後、自動的にトークンが保存されます。',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'sparksheets_logout',
    description: 'SparkSheetsからログアウトします。保存されたトークンを削除します。',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'sparksheets_auth_status',
    description: '現在の認証状態を確認します。ログイン中のユーザー情報やトークンの有効期限を表示します。',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  }
];

export async function handleAuthTool(name, args, client) {
  const oauthClient = new OAuthClient();

  switch (name) {
    case 'sparksheets_login': {
      try {
        // 既存のトークンをチェック
        const hasTokens = await oauthClient.loadTokens();
        if (hasTokens && oauthClient.isTokenValid()) {
          // 既にログイン済み - ユーザー情報を取得
          const userInfo = await getUserInfo(client);
          return {
            success: true,
            message: '既にログイン済みです',
            user: userInfo
          };
        }

        // 新規ログイン - ブラウザを開いて認証
        console.error('\n🔐 SparkSheets OAuth Authentication starting...');
        await oauthClient.authorize();

        // ログイン成功後、ユーザー情報を取得
        const userInfo = await getUserInfo(client);

        return {
          success: true,
          message: 'ログインに成功しました！',
          user: userInfo,
          note: 'ブラウザのタブは閉じて構いません。'
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
          hint: 'ブラウザで認証を完了してください。タイムアウトは5分です。'
        };
      }
    }

    case 'sparksheets_logout': {
      try {
        await oauthClient.clearTokens();
        return {
          success: true,
          message: 'ログアウトしました。トークンを削除しました。'
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    }

    case 'sparksheets_auth_status': {
      try {
        const hasTokens = await oauthClient.loadTokens();

        if (!hasTokens) {
          return {
            authenticated: false,
            message: '未ログインです。sparksheets_login でログインしてください。'
          };
        }

        const isValid = oauthClient.isTokenValid();
        const expiresAt = oauthClient.expiresAt;

        if (!isValid) {
          return {
            authenticated: false,
            message: 'トークンの有効期限が切れています。sparksheets_login で再ログインしてください。',
            expiresAt: expiresAt?.toISOString()
          };
        }

        // ユーザー情報を取得
        let userInfo = null;
        try {
          userInfo = await getUserInfo(client);
        } catch (e) {
          // ユーザー情報取得に失敗してもステータスは返す
        }

        return {
          authenticated: true,
          message: 'ログイン中です',
          user: userInfo,
          expiresAt: expiresAt?.toISOString(),
          expiresIn: expiresAt ? Math.round((expiresAt - new Date()) / 1000 / 60) + '分' : null
        };
      } catch (error) {
        return {
          authenticated: false,
          error: error.message
        };
      }
    }

    default:
      throw new Error(`Unknown auth tool: ${name}`);
  }
}

/**
 * ユーザー情報を取得（API呼び出し）
 */
async function getUserInfo(client) {
  try {
    // シート一覧を取得して認証確認（現状のAPIにはprofile取得がないため）
    const sheets = await client.listSheets({ limit: 1 });
    return {
      sheetsCount: Array.isArray(sheets) ? sheets.length : 0,
      // TODO: /api/v1/profile が実装されたらユーザー名・メール等を取得
    };
  } catch (error) {
    return null;
  }
}
