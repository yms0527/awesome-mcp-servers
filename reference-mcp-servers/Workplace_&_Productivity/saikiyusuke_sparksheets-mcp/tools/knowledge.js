/**
 * Knowledge Base Tools
 * エラー辞典・スニペット管理
 */

import { SolutionStorage, SnippetStorage } from '../lib/storage.js';

const solutionStorage = new SolutionStorage();
const snippetStorage = new SnippetStorage();

export const knowledgeTools = [
  {
    name: 'save_solution',
    description: 'エラー解決策を辞典に保存',
    inputSchema: {
      type: 'object',
      properties: {
        error: {
          type: 'string',
          description: 'エラーメッセージまたは問題の説明'
        },
        solution: {
          type: 'string',
          description: '解決方法'
        },
        files: {
          type: 'array',
          items: { type: 'string' },
          description: '関連ファイル'
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'タグ（CORS, Auth, DBなど）'
        }
      },
      required: ['error', 'solution']
    }
  },
  {
    name: 'find_solution',
    description: '過去の解決策を検索',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: '検索キーワード（エラーメッセージの一部など）'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'save_snippet',
    description: 'コードスニペットを保存',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'スニペットのタイトル'
        },
        code: {
          type: 'string',
          description: 'コード'
        },
        language: {
          type: 'string',
          description: '言語（js, php, python等）'
        },
        description: {
          type: 'string',
          description: '説明'
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'タグ'
        }
      },
      required: ['title', 'code']
    }
  },
  {
    name: 'get_snippet',
    description: 'スニペットを取得・検索',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: '検索キーワード（省略時は全件取得）'
        },
        tag: {
          type: 'string',
          description: 'タグでフィルター'
        }
      }
    }
  }
];

export async function handleKnowledgeTool(name, args, client) {
  switch (name) {
    case 'save_solution': {
      const solution = {
        error: args.error,
        solution: args.solution,
        files: args.files || [],
        tags: args.tags || []
      };

      await solutionStorage.saveSolution(solution);

      // SparkSheetsにもシート作成
      try {
        const sheet = await client.createSheet({
          title: `Solution: ${solution.error.substring(0, 50)}`,
          content: `# ${solution.error}\n\n## 解決方法\n\n${solution.solution}\n\n## 関連ファイル\n\n${solution.files.map(f => `- \`${f}\``).join('\n')}\n\n## タグ\n\n${solution.tags.join(', ')}`,
          folder: 'Solutions'
        });

        return {
          success: true,
          message: 'Solution saved',
          sheetUrl: `https://sparksheets.ai/sheet/${sheet.id}`
        };
      } catch (error) {
        return {
          success: true,
          message: 'Solution saved locally',
          localStored: true,
          error: error.message
        };
      }
    }

    case 'find_solution': {
      const results = await solutionStorage.findSolution(args.query);
      return {
        query: args.query,
        count: results.length,
        solutions: results.map(s => ({
          error: s.error,
          solution: s.solution,
          files: s.files,
          date: new Date(s.timestamp).toLocaleDateString()
        }))
      };
    }

    case 'save_snippet': {
      const snippet = {
        title: args.title,
        code: args.code,
        language: args.language || 'text',
        description: args.description || '',
        tags: args.tags || []
      };

      await snippetStorage.saveSnippet(snippet);

      // SparkSheetsにもシート作成
      try {
        const sheet = await client.createSheet({
          title: `Snippet: ${snippet.title}`,
          content: `# ${snippet.title}\n\n${snippet.description}\n\n\`\`\`${snippet.language}\n${snippet.code}\n\`\`\`\n\n**Tags:** ${snippet.tags.join(', ')}`,
          folder: 'Snippets'
        });

        return {
          success: true,
          message: 'Snippet saved',
          sheetUrl: `https://sparksheets.ai/sheet/${sheet.id}`
        };
      } catch (error) {
        return {
          success: true,
          message: 'Snippet saved locally',
          error: error.message
        };
      }
    }

    case 'get_snippet': {
      let snippets;

      if (args.query) {
        snippets = await snippetStorage.searchSnippets(args.query);
      } else if (args.tag) {
        snippets = await snippetStorage.getSnippets(args.tag);
      } else {
        snippets = await snippetStorage.getSnippets();
      }

      return {
        count: snippets.length,
        snippets: snippets.map(s => ({
          title: s.title,
          language: s.language,
          description: s.description,
          code: s.code.substring(0, 200) + (s.code.length > 200 ? '...' : ''),
          tags: s.tags
        }))
      };
    }

    default:
      throw new Error(`Unknown knowledge tool: ${name}`);
  }
}
