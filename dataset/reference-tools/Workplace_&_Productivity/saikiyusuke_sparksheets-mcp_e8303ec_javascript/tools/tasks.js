/**
 * Task Tools
 * TodoWrite同期・レビューキュー
 */

export const taskTools = [
  {
    name: 'sync_todos',
    description: 'TodoWriteの内容をSparkSheetsに同期',
    inputSchema: {
      type: 'object',
      properties: {
        todos: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              content: { type: 'string' },
              status: { type: 'string' },
              activeForm: { type: 'string' }
            }
          },
          description: 'TodoWriteの内容'
        }
      },
      required: ['todos']
    }
  },
  {
    name: 'get_review_queue',
    description: 'PRレビューキュー取得（GitHub連携）',
    inputSchema: {
      type: 'object',
      properties: {
        repo: {
          type: 'string',
          description: 'リポジトリ名（owner/repo形式）'
        }
      }
    }
  }
];

export async function handleTaskTool(name, args, client) {
  switch (name) {
    case 'sync_todos': {
      const content = `# TODO進捗

**更新日時:** ${new Date().toLocaleString()}

## タスク一覧

${args.todos.map((todo, i) => {
  const status = todo.status === 'completed' ? '✅' :
                 todo.status === 'in_progress' ? '🔄' : '⬜';
  return `${status} **${todo.content}**`;
}).join('\n\n')}

---

**完了:** ${args.todos.filter(t => t.status === 'completed').length} / ${args.todos.length}
`;

      try {
        const sheet = await client.createSheet({
          title: 'TODO進捗',
          content,
          folder: 'Tasks'
        });

        return {
          success: true,
          sheetUrl: `https://sparksheets.ai/sheet/${sheet.id}`,
          summary: {
            total: args.todos.length,
            completed: args.todos.filter(t => t.status === 'completed').length,
            inProgress: args.todos.filter(t => t.status === 'in_progress').length
          }
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    }

    case 'get_review_queue': {
      // GitHub API連携（将来実装）
      return {
        message: 'GitHub PR review queue feature coming soon',
        repo: args.repo
      };
    }

    default:
      throw new Error(`Unknown task tool: ${name}`);
  }
}
