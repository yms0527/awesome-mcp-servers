/**
 * SparkSheets API Client
 * SparkSheets REST API v1 との通信を管理（OAuth 2.0対応）
 */

import { OAuthClient } from './oauth-client.js';

const API_BASE = process.env.SPARKSHEETS_API_URL || 'https://sparksheets.ai/api';

export class SparkSheetsClient {
  constructor() {
    this.oauthClient = new OAuthClient();
  }

  async request(endpoint, options = {}) {
    // OAuth トークンを取得（必要に応じて認証/リフレッシュ）
    const accessToken = await this.oauthClient.getAccessToken();

    const url = `${API_BASE}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`API Error ${response.status}: ${error}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`SparkSheets API request failed: ${error.message}`);
    }
  }

  // シート一覧取得
  async listSheets(options = {}) {
    const params = new URLSearchParams();
    if (options.folder) params.append('folder', options.folder);
    if (options.limit) params.append('limit', options.limit);
    if (options.offset) params.append('offset', options.offset);

    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await this.request(`/v1/sheets${query}`);
    return response.sheets || [];
  }

  // シート取得
  async getSheet(id) {
    const fs = await import('fs');
    const debugLog = `/tmp/sparksheets-debug.log`;

    fs.appendFileSync(debugLog, `\n[${new Date().toISOString()}] getSheet called with id: ${id}\n`);

    const response = await this.request(`/v1/sheets?id=${id}`);

    fs.appendFileSync(debugLog, `Response keys: ${Object.keys(response || {}).join(', ')}\n`);
    fs.appendFileSync(debugLog, `Response.sheet: ${JSON.stringify(response.sheet).substring(0, 500)}\n`);

    return response.sheet;
  }

  // シート作成
  async createSheet(data) {
    return this.request('/v1/sheets', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // シート更新
  async updateSheet(id, data) {
    return this.request('/v1/sheets', {
      method: 'PUT',
      body: JSON.stringify({ id, ...data })
    });
  }

  // シート検索
  async searchSheets(query, options = {}) {
    const params = new URLSearchParams({ search: query });
    if (options.limit) params.append('limit', options.limit);
    const response = await this.request(`/v1/sheets?${params.toString()}`);
    return response.sheets || [];
  }

  // シート削除
  async deleteSheet(id) {
    return this.request(`/v1/sheets?id=${id}`, {
      method: 'DELETE'
    });
  }

  // AI編集
  async aiImprove(content, prompt) {
    return this.request('/api/ai-assistant', {
      method: 'POST',
      body: JSON.stringify({ message: prompt, context: content })
    });
  }

  // 画像アップロード（Base64）
  async uploadImage(base64Data, type = 'attachment') {
    return this.request('/api/upload/image', {
      method: 'POST',
      body: JSON.stringify({ data: base64Data, type })
    });
  }

  // シートに追記
  async appendToSheet(id, content, column = 'col1') {
    return this.request('/v1/sheets/append', {
      method: 'POST',
      body: JSON.stringify({ id, content, column })
    });
  }

  // カラム追加
  async addColumn(id, content = '') {
    return this.request('/v1/sheets/columns', {
      method: 'POST',
      body: JSON.stringify({ id, content })
    });
  }

  // カラム削除
  async removeColumn(id, column) {
    return this.request('/v1/sheets/columns', {
      method: 'DELETE',
      body: JSON.stringify({ id, column })
    });
  }

  // カラム情報取得
  async getColumnInfo(id) {
    return this.request(`/v1/sheets/columns?id=${id}`);
  }

  // 共有リンク発行
  async createShareLink(id, permission = 'read', expiry = '7days') {
    return this.request('/v1/sheets/share', {
      method: 'POST',
      body: JSON.stringify({ id, permission, expiry })
    });
  }

  // 共有設定取得
  async getShareSettings(id) {
    return this.request(`/v1/sheets/share?id=${id}`);
  }

  // 共有無効化
  async disableShare(shareId) {
    return this.request(`/v1/sheets/share?id=${shareId}`, {
      method: 'DELETE'
    });
  }

  // メンバー一覧取得
  async listMembers(id) {
    return this.request(`/v1/sheets/members?id=${id}`);
  }

  // メンバー追加
  async addMember(id, email, role = 'viewer') {
    return this.request('/v1/sheets/members', {
      method: 'POST',
      body: JSON.stringify({ id, email, role })
    });
  }

  // メンバー権限更新
  async updateMemberRole(id, uid, role) {
    return this.request('/v1/sheets/members', {
      method: 'PUT',
      body: JSON.stringify({ id, uid, role })
    });
  }

  // メンバー削除
  async removeMember(id, uid) {
    return this.request(`/v1/sheets/members?id=${id}&uid=${uid}`, {
      method: 'DELETE'
    });
  }

  // Spark一覧（ユーザーのメニュー用）
  async listSparks() {
    return this.request('/api/sparks/my-menu');
  }

  // Spark実行（AI処理）
  async runSpark(sparkId, content) {
    return this.request('/api/sparks/execute', {
      method: 'POST',
      body: JSON.stringify({ spark_id: sparkId, text: content })
    });
  }

  // テンプレート一覧
  async listTemplates(category = null) {
    const params = category ? `?category=${category}` : '';
    return this.request(`/api/templates/list${params}`);
  }

  // 認証確認
  async verifyAuth() {
    try {
      await this.listSheets({ limit: 1 });
      return true;
    } catch {
      return false;
    }
  }
}

export default SparkSheetsClient;
