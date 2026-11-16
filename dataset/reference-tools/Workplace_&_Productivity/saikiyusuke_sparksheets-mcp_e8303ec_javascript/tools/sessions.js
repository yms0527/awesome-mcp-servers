/**
 * Session Management Tools
 * セッション履歴の保存・検索
 */

import { SessionStorage } from '../lib/storage.js';

const storage = new SessionStorage();

export const sessionTools = [
  {
    name: 'save_session',
    description: '現在のセッション要約をSparkSheetsに保存',
    inputSchema: {
      type: 'object',
      properties: {
        summary: {
          type: 'string',
          description: 'セッションの要約'
        },
        project: {
          type: 'string',
          description: 'プロジェクト名'
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'タグ'
        },
        notes: {
          type: 'string',
          description: '追加メモ'
        }
      },
      required: ['summary']
    }
  },
  {
    name: 'list_sessions',
    description: '全セッション一覧を取得',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: '取得件数（デフォルト: 50）'
        }
      }
    }
  },
  {
    name: 'search_sessions',
    description: 'キーワードでセッション検索',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: '検索キーワード'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'create_handover',
    description: '引き継ぎシート自動生成（次にやること、注意点などをまとめる）',
    inputSchema: {
      type: 'object',
      properties: {
        nextSteps: {
          type: 'array',
          items: { type: 'string' },
          description: '次にやること'
        },
        notes: {
          type: 'array',
          items: { type: 'string' },
          description: '注意点・気をつけること'
        },
        files: {
          type: 'array',
          items: { type: 'string' },
          description: '関連ファイル'
        }
      },
      required: ['nextSteps']
    }
  }
];

export async function handleSessionTool(name, args, client) {
  switch (name) {
    case 'save_session': {
      const sessionData = {
        summary: args.summary,
        project: args.project || 'unknown',
        tags: args.tags || [],
        notes: args.notes || ''
      };

      await storage.saveSession(sessionData);

      // SparkSheetsにもシート作成
      try {
        const sheet = await client.createSheet({
          title: `Session: ${sessionData.summary.substring(0, 50)}`,
          content: `# ${sessionData.summary}\n\n**Project:** ${sessionData.project}\n**Date:** ${new Date().toLocaleDateString()}\n\n## Notes\n${sessionData.notes}\n\n## Tags\n${sessionData.tags.join(', ')}`,
          folder: 'Sessions'
        });

        return {
          success: true,
          message: 'Session saved',
          localStored: true,
          sheetCreated: true,
          sheetUrl: `https://sparksheets.ai/sheet/${sheet.id}`
        };
      } catch (error) {
        return {
          success: true,
          message: 'Session saved locally',
          localStored: true,
          sheetCreated: false,
          error: error.message
        };
      }
    }

    case 'list_sessions': {
      const sessions = await storage.listSessions(args.limit || 50);
      return {
        count: sessions.length,
        sessions: sessions.map(s => ({
          summary: s.summary,
          project: s.project,
          date: new Date(s.timestamp).toLocaleDateString(),
          tags: s.tags
        }))
      };
    }

    case 'search_sessions': {
      const results = await storage.searchSessions(args.query);
      return {
        query: args.query,
        count: results.length,
        results: results.map(s => ({
          summary: s.summary,
          project: s.project,
          date: new Date(s.timestamp).toLocaleDateString()
        }))
      };
    }

    case 'create_handover': {
      const handover = {
        nextSteps: args.nextSteps,
        notes: args.notes || [],
        files: args.files || [],
        createdAt: new Date().toISOString()
      };

      // SparkSheetsにシート作成
      const content = `# 引き継ぎ事項

**作成日:** ${new Date().toLocaleDateString()}

## 次にやること

${handover.nextSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

## 注意点・気をつけること

${handover.notes.map((note, i) => `- ${note}`).join('\n')}

## 関連ファイル

${handover.files.map(file => `- \`${file}\``).join('\n')}
`;

      try {
        const sheet = await client.createSheet({
          title: '引き継ぎ事項',
          content,
          folder: 'Handover'
        });

        return {
          success: true,
          sheetUrl: `https://sparksheets.ai/sheet/${sheet.id}`,
          content
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
          content
        };
      }
    }

    default:
      throw new Error(`Unknown session tool: ${name}`);
  }
}
