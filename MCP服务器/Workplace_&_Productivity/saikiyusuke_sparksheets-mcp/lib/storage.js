/**
 * Local Storage Manager
 * セッション、解決策、スニペットなどをローカルに保存
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORAGE_DIR = path.join(__dirname, '..', 'logs');

export class Storage {
  constructor() {
    this.ensureDir();
  }

  async ensureDir() {
    try {
      await fs.mkdir(STORAGE_DIR, { recursive: true });
    } catch (error) {
      // ディレクトリが既に存在する場合は無視
    }
  }

  async readJSON(filename) {
    const filepath = path.join(STORAGE_DIR, filename);
    try {
      const data = await fs.readFile(filepath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  async writeJSON(filename, data) {
    const filepath = path.join(STORAGE_DIR, filename);
    await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async appendJSON(filename, item) {
    const data = await this.readJSON(filename) || [];
    data.push({
      ...item,
      timestamp: new Date().toISOString()
    });
    await this.writeJSON(filename, data);
  }

  async searchJSON(filename, query) {
    const data = await this.readJSON(filename) || [];
    const lowerQuery = query.toLowerCase();
    return data.filter(item =>
      JSON.stringify(item).toLowerCase().includes(lowerQuery)
    );
  }
}

// セッション管理
export class SessionStorage extends Storage {
  constructor() {
    super();
    this.filename = 'sessions.json';
  }

  async saveSession(sessionData) {
    await this.appendJSON(this.filename, sessionData);
  }

  async listSessions(limit = 50) {
    const sessions = await this.readJSON(this.filename) || [];
    return sessions.slice(-limit).reverse();
  }

  async searchSessions(query) {
    return this.searchJSON(this.filename, query);
  }
}

// エラー辞典
export class SolutionStorage extends Storage {
  constructor() {
    super();
    this.filename = 'solutions.json';
  }

  async saveSolution(solutionData) {
    await this.appendJSON(this.filename, solutionData);
  }

  async findSolution(query) {
    return this.searchJSON(this.filename, query);
  }
}

// スニペット管理
export class SnippetStorage extends Storage {
  constructor() {
    super();
    this.filename = 'snippets.json';
  }

  async saveSnippet(snippetData) {
    await this.appendJSON(this.filename, snippetData);
  }

  async getSnippets(tag = null) {
    const snippets = await this.readJSON(this.filename) || [];
    if (!tag) return snippets;
    return snippets.filter(s => s.tags?.includes(tag));
  }

  async searchSnippets(query) {
    return this.searchJSON(this.filename, query);
  }
}

export default Storage;
