/**
 * Spark Tools
 * Spark実行・多言語翻訳
 */

export const sparkTools = [
  {
    name: 'run_spark',
    description: 'Spark（AIボタン）をCLIから実行',
    inputSchema: {
      type: 'object',
      properties: {
        sparkId: {
          type: 'string',
          description: 'Spark ID'
        },
        content: {
          type: 'string',
          description: '処理対象のコンテンツ'
        }
      },
      required: ['sparkId', 'content']
    }
  },
  {
    name: 'list_sparks',
    description: '利用可能なSpark一覧',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'カテゴリでフィルター'
        }
      }
    }
  },
  {
    name: 'translate_sheet',
    description: 'シートを多言語翻訳',
    inputSchema: {
      type: 'object',
      properties: {
        sheetId: {
          type: 'string',
          description: 'シートID'
        },
        targetLanguage: {
          type: 'string',
          description: 'ターゲット言語（en, ja, zh, ko等）'
        }
      },
      required: ['sheetId', 'targetLanguage']
    }
  }
];

export async function handleSparkTool(name, args, client) {
  switch (name) {
    case 'run_spark': {
      try {
        const response = await client.runSpark(args.sparkId, args.content);

        // API returns { success: true, result: "AI output" } or { data: { result: "..." } }
        const output = response?.result || response?.data?.result || response?.output || response;

        return {
          success: true,
          sparkId: args.sparkId,
          result: output
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    }

    case 'list_sparks': {
      try {
        const response = await client.listSparks();

        // API returns { data: { sparks: [...], count: N } }
        const sparks = response?.data?.sparks || response?.sparks || [];

        return {
          count: sparks.length,
          sparks: sparks.map(s => ({
            id: s.id,
            title: s.title,
            description: s.description,
            icon: s.icon,
            creator: s.creator_name
          }))
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    }

    case 'translate_sheet': {
      try {
        // シート取得
        const sheet = await client.getSheet(args.sheetId);

        if (!sheet) {
          throw new Error('Sheet not found');
        }

        // content がオブジェクトの場合（col1, col2, col3）、各カラムを翻訳
        let translatedContent = {};

        if (typeof sheet.content === 'object' && sheet.content !== null) {
          // 各カラムを個別に翻訳
          for (const [colKey, colValue] of Object.entries(sheet.content)) {
            if (colValue && typeof colValue === 'string' && colValue.trim()) {
              const result = await client.aiImprove(
                colValue,
                `Translate the following content to ${args.targetLanguage}. Keep the formatting (HTML tags, line breaks) intact:\n\n${colValue}`
              );
              translatedContent[colKey] = result?.result || result?.data?.result || colValue;
            } else {
              translatedContent[colKey] = colValue;
            }
          }
        } else if (typeof sheet.content === 'string') {
          // 単純な文字列の場合
          const result = await client.aiImprove(
            sheet.content,
            `Translate the following content to ${args.targetLanguage}:\n\n${sheet.content}`
          );
          translatedContent = result?.result || result?.data?.result || sheet.content;
        }

        // 新しいシート作成
        const newSheet = await client.createSheet({
          title: `${sheet.name || sheet.title} (${args.targetLanguage})`,
          content: translatedContent,
          folder: sheet.folder || ''
        });

        return {
          success: true,
          originalSheetId: args.sheetId,
          translatedSheetId: newSheet?.id || newSheet?.sheet?.id,
          url: `https://sparksheets.ai/app/?sheet=${newSheet?.id || newSheet?.sheet?.id}`,
          targetLanguage: args.targetLanguage
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    }

    default:
      throw new Error(`Unknown spark tool: ${name}`);
  }
}
