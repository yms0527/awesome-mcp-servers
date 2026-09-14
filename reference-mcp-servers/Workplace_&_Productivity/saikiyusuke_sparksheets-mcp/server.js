#!/usr/bin/env node
/**
 * MCP SparkSheets Server
 *
 * Claude Code開発者のためのダッシュボード
 * - セッション履歴管理
 * - ナレッジベース（エラー辞典・スニペット）
 * - 使用量統計
 * - タスク管理
 * - シート操作
 * - Spark連携
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { SparkSheetsClient } from './lib/api-client.js';
import { sessionTools, handleSessionTool } from './tools/sessions.js';
import { knowledgeTools, handleKnowledgeTool } from './tools/knowledge.js';
import { sheetTools, handleSheetTool } from './tools/sheets.js';
import { statsTools, handleStatsTool } from './tools/stats.js';
import { taskTools, handleTaskTool } from './tools/tasks.js';
import { sparkTools, handleSparkTool } from './tools/spark.js';
import { authTools, handleAuthTool } from './tools/auth.js';
import { shareTools, handleShareTool } from './tools/share.js';

// package.jsonからバージョン取得（単一ソース管理）
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf-8'));

// APIクライアント初期化（OAuth 2.0を使用）
const client = new SparkSheetsClient();

// MCPサーバー作成
const server = new Server(
  {
    name: pkg.name,
    version: pkg.version,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ツール一覧
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      ...authTools,
      ...sessionTools,
      ...knowledgeTools,
      ...sheetTools,
      ...statsTools,
      ...taskTools,
      ...sparkTools,
      ...shareTools
    ]
  };
});

// ツール実行
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result;

    // 認証
    if (authTools.find(t => t.name === name)) {
      result = await handleAuthTool(name, args, client);
    }
    // セッション管理
    else if (sessionTools.find(t => t.name === name)) {
      result = await handleSessionTool(name, args, client);
    }
    // ナレッジベース
    else if (knowledgeTools.find(t => t.name === name)) {
      result = await handleKnowledgeTool(name, args, client);
    }
    // シート操作
    else if (sheetTools.find(t => t.name === name)) {
      result = await handleSheetTool(name, args, client);
    }
    // 統計
    else if (statsTools.find(t => t.name === name)) {
      result = await handleStatsTool(name, args, client);
    }
    // タスク
    else if (taskTools.find(t => t.name === name)) {
      result = await handleTaskTool(name, args, client);
    }
    // Spark
    else if (sparkTools.find(t => t.name === name)) {
      result = await handleSparkTool(name, args, client);
    }
    // 共有・メンバー管理
    else if (shareTools.find(t => t.name === name)) {
      result = await handleShareTool(name, args, client);
    }
    else {
      throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `Error: ${error.message}\n\nStack: ${error.stack}`
      }],
      isError: true
    };
  }
});

// サーバー起動
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP SparkSheets Server running');
}

main().catch(console.error);
