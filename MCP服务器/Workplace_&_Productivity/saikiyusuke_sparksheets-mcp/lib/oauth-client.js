/**
 * OAuth 2.0 Client for SparkSheets MCP Server
 * Authorization Code Flow with PKCE
 */

import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const OAUTH_CONFIG = {
  authorizationEndpoint: 'https://sparksheets.ai/api/oauth/authorize',
  tokenEndpoint: 'https://sparksheets.ai/api/oauth/token',
  clientId: 'mcp-sparksheets-client',
  redirectUri: 'http://localhost:3827/callback',
  scopes: 'read write'
};

const TOKEN_DIR = path.join(process.env.HOME, '.sparksheets');
const TOKEN_FILE = path.join(TOKEN_DIR, 'tokens.json');

export class OAuthClient {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
    this.expiresAt = null;
  }

  /**
   * トークンを読み込み
   */
  async loadTokens() {
    try {
      const data = await fs.readFile(TOKEN_FILE, 'utf-8');
      const tokens = JSON.parse(data);
      this.accessToken = tokens.access_token;
      this.refreshToken = tokens.refresh_token;
      this.expiresAt = new Date(tokens.expires_at);
      console.error('✓ Tokens loaded from file');
      return true;
    } catch (error) {
      console.error('No saved tokens found');
      return false;
    }
  }

  /**
   * トークンを保存
   */
  async saveTokens(tokenResponse) {
    this.accessToken = tokenResponse.access_token;
    this.refreshToken = tokenResponse.refresh_token;
    this.expiresAt = new Date(Date.now() + tokenResponse.expires_in * 1000);

    const tokens = {
      access_token: this.accessToken,
      refresh_token: this.refreshToken,
      expires_at: this.expiresAt.toISOString(),
      token_type: tokenResponse.token_type
    };

    // ディレクトリがなければ作成
    await fs.mkdir(TOKEN_DIR, { recursive: true });
    await fs.writeFile(TOKEN_FILE, JSON.stringify(tokens, null, 2));
    console.error('✓ Tokens saved to file');
  }

  /**
   * トークンの有効期限をチェック
   */
  isTokenValid() {
    if (!this.accessToken || !this.expiresAt) return false;
    // 5分前に期限切れと判定（余裕を持たせる）
    return this.expiresAt > new Date(Date.now() + 5 * 60 * 1000);
  }

  /**
   * 認証コードフローを開始
   */
  async authorize() {
    const state = crypto.randomBytes(16).toString('hex');

    // 認証URLを構築
    const authUrl = new URL(OAUTH_CONFIG.authorizationEndpoint);
    authUrl.searchParams.set('client_id', OAUTH_CONFIG.clientId);
    authUrl.searchParams.set('redirect_uri', OAUTH_CONFIG.redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('scope', OAUTH_CONFIG.scopes);

    console.error('\n🔐 SparkSheets OAuth Authentication');
    console.error('Opening browser for authentication...');
    console.error(`URL: ${authUrl.toString()}\n`);

    // ブラウザを開く
    const platform = process.platform;
    const openCommand = platform === 'darwin' ? 'open' :
                       platform === 'win32' ? 'start' : 'xdg-open';
    spawn(openCommand, [authUrl.toString()], { detached: true });

    // ローカルサーバーでコールバックを待つ
    return new Promise((resolve, reject) => {
      const server = http.createServer(async (req, res) => {
        const url = new URL(req.url, OAUTH_CONFIG.redirectUri);

        if (url.pathname === '/callback') {
          const code = url.searchParams.get('code');
          const returnedState = url.searchParams.get('state');
          const error = url.searchParams.get('error');

          // 成功レスポンス
          res.writeHead(200, { 'Content-Type': 'text/html' });
          if (error) {
            res.end(`
              <html>
                <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                  <h1>❌ Authentication Failed</h1>
                  <p>Error: ${error}</p>
                  <p>You can close this window.</p>
                </body>
              </html>
            `);
            server.close();
            reject(new Error(`OAuth error: ${error}`));
            return;
          }

          if (!code || returnedState !== state) {
            res.end(`
              <html>
                <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                  <h1>❌ Invalid Response</h1>
                  <p>Missing code or state mismatch</p>
                  <p>You can close this window.</p>
                </body>
              </html>
            `);
            server.close();
            reject(new Error('Invalid OAuth response'));
            return;
          }

          res.end(`
            <html>
              <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                <h1>✅ Authentication Successful!</h1>
                <p>SparkSheets MCP Server is now connected.</p>
                <p>You can close this window and return to Claude Code.</p>
              </body>
            </html>
          `);
          server.close();

          try {
            // 認証コードをアクセストークンに交換
            const tokenResponse = await this.exchangeCodeForToken(code);
            await this.saveTokens(tokenResponse);
            console.error('✓ Authentication successful!');
            resolve(tokenResponse);
          } catch (error) {
            reject(error);
          }
        }
      });

      server.listen(3827, () => {
        console.error('Waiting for callback on http://localhost:3827/callback...');
      });

      // タイムアウト（5分）
      setTimeout(() => {
        server.close();
        reject(new Error('OAuth timeout - no response within 5 minutes'));
      }, 5 * 60 * 1000);
    });
  }

  /**
   * 認証コードをアクセストークンに交換
   */
  async exchangeCodeForToken(code) {
    const response = await fetch(OAUTH_CONFIG.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: OAUTH_CONFIG.redirectUri,
        client_id: OAUTH_CONFIG.clientId
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Token exchange failed: ${error}`);
    }

    return await response.json();
  }

  /**
   * リフレッシュトークンで新しいアクセストークンを取得
   */
  async refreshAccessToken() {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    console.error('Refreshing access token...');

    const response = await fetch(OAUTH_CONFIG.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Token refresh failed: ${error}`);
    }

    const tokenResponse = await response.json();
    await this.saveTokens(tokenResponse);
    console.error('✓ Token refreshed');
    return tokenResponse;
  }

  /**
   * 有効なアクセストークンを取得（必要に応じてリフレッシュ）
   */
  async getAccessToken() {
    // 保存されたトークンを読み込み
    if (!this.accessToken) {
      await this.loadTokens();
    }

    // トークンが有効ならそのまま返す
    if (this.isTokenValid()) {
      return this.accessToken;
    }

    // 期限切れならリフレッシュ
    if (this.refreshToken) {
      try {
        await this.refreshAccessToken();
        return this.accessToken;
      } catch (error) {
        console.error('Token refresh failed, need re-authentication');
        // リフレッシュ失敗 → 再認証
      }
    }

    // トークンがない、または更新失敗 → 新規認証
    await this.authorize();
    return this.accessToken;
  }

  /**
   * 保存されたトークンをクリア
   */
  async clearTokens() {
    try {
      await fs.unlink(TOKEN_FILE);
      this.accessToken = null;
      this.refreshToken = null;
      this.expiresAt = null;
      console.error('✓ Tokens cleared');
    } catch (error) {
      // ファイルが存在しない場合は無視
    }
  }
}

export default OAuthClient;
