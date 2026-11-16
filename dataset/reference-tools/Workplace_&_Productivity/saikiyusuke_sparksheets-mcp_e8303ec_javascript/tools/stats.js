/**
 * Stats Tools
 * 使用量・作業時間の記録
 */

import { Storage } from '../lib/storage.js';

const storage = new Storage();

export const statsTools = [
  {
    name: 'sync_stats',
    description: '/statsの内容をSparkSheetsに同期',
    inputSchema: {
      type: 'object',
      properties: {
        stats: {
          type: 'object',
          description: '/stats コマンドの出力データ'
        }
      },
      required: ['stats']
    }
  },
  {
    name: 'log_work_time',
    description: '作業時間を記録',
    inputSchema: {
      type: 'object',
      properties: {
        project: {
          type: 'string',
          description: 'プロジェクト名'
        },
        duration: {
          type: 'number',
          description: '作業時間（分）'
        },
        task: {
          type: 'string',
          description: 'タスク内容'
        }
      },
      required: ['project', 'duration']
    }
  },
  {
    name: 'get_usage_dashboard',
    description: '使用量ダッシュボードURL取得',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  }
];

export async function handleStatsTool(name, args, client) {
  switch (name) {
    case 'sync_stats': {
      // ローカルに保存
      await storage.appendJSON('stats-history.json', {
        stats: args.stats,
        syncedAt: new Date().toISOString()
      });

      // SparkSheetsにシート作成
      const content = `# 使用量統計

**同期日時:** ${new Date().toLocaleDateString()}

## サマリー

- **お気に入りモデル:** ${args.stats.favoriteModel || 'N/A'}
- **総トークン:** ${args.stats.totalTokens || 'N/A'}
- **セッション数:** ${args.stats.sessionCount || 'N/A'}

## 詳細

\`\`\`json
${JSON.stringify(args.stats, null, 2)}
\`\`\`
`;

      try {
        const sheet = await client.createSheet({
          title: `Stats ${new Date().toLocaleDateString()}`,
          content,
          folder: 'Stats'
        });

        return {
          success: true,
          sheetUrl: `https://sparksheets.ai/sheet/${sheet.id}`
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    }

    case 'log_work_time': {
      const log = {
        project: args.project,
        duration: args.duration,
        task: args.task || '',
        date: new Date().toISOString()
      };

      await storage.appendJSON('work-time.json', log);

      return {
        success: true,
        logged: log
      };
    }

    case 'get_usage_dashboard': {
      // ダッシュボード用のシートURLを返す（将来的に専用ページ）
      return {
        dashboardUrl: 'https://sparksheets.ai/dashboard/usage',
        message: 'Usage dashboard feature coming soon'
      };
    }

    default:
      throw new Error(`Unknown stats tool: ${name}`);
  }
}
