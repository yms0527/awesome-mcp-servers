/**
 * Sheet Operation Tools
 * シートの作成・編集・検索
 */

export const sheetTools = [
  {
    name: 'upload_image',
    description: '画像をSparkSheetsにアップロード。Base64またはファイルパスを指定。戻り値にMarkdown形式の画像タグを含む',
    inputSchema: {
      type: 'object',
      properties: {
        data: {
          type: 'string',
          description: 'Base64エンコードされた画像データ（data:image/png;base64,...形式も可）'
        },
        file_path: {
          type: 'string',
          description: 'ローカルファイルパス（dataの代わりに指定可能）'
        },
        type: {
          type: 'string',
          description: '画像タイプ: attachment（デフォルト）, spark_icon, template_thumbnail, pack_thumbnail, creator_avatar',
          default: 'attachment'
        }
      }
    }
  },
  {
    name: 'append_to_sheet',
    description: 'シートの指定カラムの末尾にコンテンツを追記',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'シートID'
        },
        content: {
          type: 'string',
          description: '追記するコンテンツ（Markdown）'
        },
        column: {
          type: 'string',
          description: 'カラム名: col1, col2, col3（デフォルト: col1）',
          default: 'col1'
        }
      },
      required: ['id', 'content']
    }
  },
  {
    name: 'list_sheets',
    description: 'シート一覧取得',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: '取得件数（デフォルト: 50）'
        },
        folder: {
          type: 'string',
          description: 'フォルダでフィルタ'
        }
      }
    }
  },
  {
    name: 'create_sheet',
    description: '新規シート作成',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'シートタイトル'
        },
        content: {
          type: 'string',
          description: 'シート内容（Markdown）'
        },
        folder: {
          type: 'string',
          description: 'フォルダ名'
        }
      },
      required: ['title', 'content']
    }
  },
  {
    name: 'update_sheet',
    description: 'シート編集',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'シートID'
        },
        title: {
          type: 'string',
          description: '新しいタイトル（省略可）'
        },
        content: {
          type: 'string',
          description: '新しい内容（省略可）'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'get_sheet_content',
    description: 'シート内容取得（オプションでコンテキスト制御可能）',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'シートID'
        },
        column: {
          type: 'string',
          description: '特定のカラムのみ取得: col1, col2, col3（省略時は全カラム）'
        },
        limit: {
          type: 'number',
          description: '文字数上限（超過分は切り捨て）'
        },
        lines: {
          type: 'string',
          description: '行範囲指定: "1-50" 形式（HTMLを行単位で処理）'
        },
        summary_only: {
          type: 'boolean',
          description: 'trueの場合、メタデータのみ返す（content省略）'
        },
        debug: {
          type: 'boolean',
          description: 'trueの場合、APIから返されたraw sheetオブジェクトを返す（デバッグ用）'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'search_sheets',
    description: 'シート検索',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: '検索キーワード'
        },
        limit: {
          type: 'number',
          description: '取得件数（デフォルト: 20）'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'delete_sheet',
    description: 'シート削除',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'シートID'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'add_column',
    description: 'シートにカラムを追加（最大3カラムまで）',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'シートID'
        },
        content: {
          type: 'string',
          description: '追加するカラムの初期コンテンツ（省略可）'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'remove_column',
    description: 'シートからカラムを削除',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'シートID'
        },
        column: {
          type: 'string',
          description: '削除するカラム: col2 または col3（col1は削除不可）'
        }
      },
      required: ['id', 'column']
    }
  },
  {
    name: 'get_column_info',
    description: 'シートのカラム情報を取得',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'シートID'
        }
      },
      required: ['id']
    }
  }
];

export async function handleSheetTool(name, args, client) {
  switch (name) {
    case 'list_sheets': {
      const sheets = await client.listSheets({
        limit: args.limit || 50,
        folder: args.folder
      });

      return {
        count: sheets.length,
        sheets: sheets.map(s => ({
          id: s.id,
          title: s.name || s.title,
          folder: s.folder,
          updatedAt: s.updatedAt,
          url: `https://sparksheets.ai/app/?sheet=${s.id}`
        }))
      };
    }

    case 'create_sheet': {
      const sheet = await client.createSheet({
        title: args.title,
        content: args.content,
        folder: args.folder || ''
      });

      return {
        success: true,
        id: sheet.id,
        url: `https://sparksheets.ai/sheet/${sheet.id}`,
        title: args.title
      };
    }

    case 'update_sheet': {
      const updateData = {};
      if (args.title) updateData.title = args.title;
      if (args.content) updateData.content = args.content;

      await client.updateSheet(args.id, updateData);

      return {
        success: true,
        id: args.id,
        url: `https://sparksheets.ai/sheet/${args.id}`,
        updated: Object.keys(updateData)
      };
    }

    case 'get_sheet_content': {
      const sheet = await client.getSheet(args.id);

      // DEBUG MODE: Return raw sheet for debugging
      if (args.debug) {
        return { debug_raw_sheet: sheet };
      }

      // summary_only: メタデータのみ返す
      if (args.summary_only) {
        return {
          id: sheet.id,
          title: sheet.name || sheet.title,
          folder: sheet.folder,
          updatedAt: sheet.updatedAt,
          hasContent: !!sheet.content,
          contentLength: sheet.content ? String(sheet.content?.col1 || sheet.content || '').length : 0
        };
      }

      // コンテンツ処理関数
      const processContent = (content) => {
        if (!content) return '';

        let result = content;

        // lines: 行範囲指定（HTMLを<p>タグで分割）
        if (args.lines) {
          const match = args.lines.match(/^(\d+)-(\d+)$/);
          if (match) {
            const start = parseInt(match[1], 10) - 1; // 0-indexed
            const end = parseInt(match[2], 10);
            // <p>タグで分割
            const paragraphs = result.split(/<\/p>/i).map(p => p + '</p>');
            result = paragraphs.slice(start, end).join('');
          }
        }

        // limit: 文字数制限
        if (args.limit && result.length > args.limit) {
          result = result.substring(0, args.limit) + '... (truncated)';
        }

        return result;
      };

      // column指定: 特定カラムのみ
      if (args.column && ['col1', 'col2', 'col3'].includes(args.column)) {
        const columnContent = sheet.content?.[args.column] || sheet.content || '';
        return {
          id: sheet.id,
          title: sheet.name || sheet.title,
          column: args.column,
          content: processContent(typeof columnContent === 'string' ? columnContent : ''),
          folder: sheet.folder,
          updatedAt: sheet.updatedAt
        };
      }

      // 全カラム返却（デフォルト）
      let content = sheet.content;
      if (typeof content === 'object') {
        // 複数カラム構造の場合
        content = {
          col1: processContent(content.col1 || ''),
          col2: processContent(content.col2 || ''),
          col3: processContent(content.col3 || '')
        };
      } else {
        // 単一コンテンツの場合
        content = processContent(content || '');
      }

      return {
        id: sheet.id,
        title: sheet.name || sheet.title,
        content: content,
        folder: sheet.folder,
        updatedAt: sheet.updatedAt
      };
    }

    case 'search_sheets': {
      const results = await client.searchSheets(args.query, {
        limit: args.limit || 20
      });

      return {
        query: args.query,
        count: results.length,
        sheets: results.map(s => ({
          id: s.id,
          title: s.title,
          url: `https://sparksheets.ai/app/?sheet=${s.id}`,
          preview: s.content ? s.content.substring(0, 100) + '...' : ''
        }))
      };
    }

    case 'delete_sheet': {
      await client.deleteSheet(args.id);

      return {
        success: true,
        id: args.id,
        message: 'Sheet deleted successfully'
      };
    }

    case 'upload_image': {
      const fs = await import('fs');
      const path = await import('path');

      let base64Data = args.data;

      // ファイルパスが指定された場合、ファイルを読み込んでBase64に変換
      if (args.file_path && !base64Data) {
        const filePath = args.file_path;
        if (!fs.existsSync(filePath)) {
          throw new Error(`File not found: ${filePath}`);
        }

        const fileBuffer = fs.readFileSync(filePath);
        const ext = path.extname(filePath).toLowerCase().slice(1);
        const mimeTypes = {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'gif': 'image/gif',
          'webp': 'image/webp'
        };
        const mimeType = mimeTypes[ext] || 'image/png';
        base64Data = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
      }

      if (!base64Data) {
        throw new Error('Either data or file_path is required');
      }

      const result = await client.uploadImage(base64Data, args.type || 'attachment');
      const imageUrl = `https://sparksheets.ai${result.data.url}`;

      return {
        success: true,
        url: imageUrl,
        filename: result.data.filename,
        markdown: `![${result.data.filename}](${imageUrl})`
      };
    }

    case 'append_to_sheet': {
      const result = await client.appendToSheet(
        args.id,
        args.content,
        args.column || 'col1'
      );

      return {
        success: true,
        id: args.id,
        column: args.column || 'col1',
        message: 'Content appended successfully'
      };
    }

    case 'add_column': {
      const result = await client.addColumn(args.id, args.content || '');

      return {
        success: true,
        id: args.id,
        addedColumn: result.column,
        totalColumns: result.totalColumns,
        message: `Column ${result.column} added successfully`
      };
    }

    case 'remove_column': {
      // col1は削除不可
      if (args.column === 'col1') {
        throw new Error('Cannot remove col1 - it is the primary column');
      }
      if (!['col2', 'col3'].includes(args.column)) {
        throw new Error('Invalid column. Use col2 or col3');
      }

      const result = await client.removeColumn(args.id, args.column);

      return {
        success: true,
        id: args.id,
        removedColumn: args.column,
        totalColumns: result.totalColumns,
        message: `Column ${args.column} removed successfully`
      };
    }

    case 'get_column_info': {
      const result = await client.getColumnInfo(args.id);

      return {
        id: args.id,
        columns: result.columns,
        totalColumns: result.totalColumns,
        columnLengths: result.columnLengths
      };
    }

    default:
      throw new Error(`Unknown sheet tool: ${name}`);
  }
}
