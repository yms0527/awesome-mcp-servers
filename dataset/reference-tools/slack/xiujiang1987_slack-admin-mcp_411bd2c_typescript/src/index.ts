#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import pkg from '@slack/bolt';
const { App, LogLevel, ExpressReceiver } = pkg; // 加入 ExpressReceiver
import * as fs from 'fs';

// --- START DEBUG LOGGING ---
const logFilePath = 'D:\\OneDrive-NTUT\\slack-admin-mcp\\debug.log';
try {
  fs.writeFileSync(logFilePath, '');
} catch (err) {
  console.error('無法寫入偵錯日誌檔案:', err);
}
const log = (message: string) => {
  try {
    fs.appendFileSync(logFilePath, `${new Date().toISOString()} - ${message}\n`);
  } catch (err) { /* Ignore subsequent errors */ }
};
log('Server script started.');
// --- END DEBUG LOGGING ---


const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
log(`SLACK_BOT_TOKEN value: ${SLACK_BOT_TOKEN ? '****** (set)' : 'NOT SET'}`);

if (!SLACK_BOT_TOKEN) {
  log('Error: SLACK_BOT_TOKEN environment variable is not set. Exiting.');
  console.error('錯誤：環境變數 SLACK_BOT_TOKEN 未設定。');
  process.exit(1);
}

// 建立一個自訂接收器 (不需要 signingSecret)
log('Creating ExpressReceiver...');
const receiver = new ExpressReceiver({ signingSecret: 'dummy-secret-not-used' }); // signingSecret 必填但在此情境下不會被使用
log('ExpressReceiver created.');

// 初始化 Slack App，傳入自訂接收器
log('Initializing Slack App with custom receiver...');
let slackApp: InstanceType<typeof App> | null = null;
try {
  slackApp = new App({
    token: SLACK_BOT_TOKEN,
    receiver: receiver, // 使用自訂接收器
    logLevel: LogLevel.WARN,
  });
  log('Slack App initialized successfully.');
} catch (error: any) {
  log(`Error initializing Slack App: ${error.message}. Exiting.`);
  console.error('初始化 Slack App 時發生錯誤:', error);
  process.exit(1);
}


class SlackAdminServer {
  private server: Server;

  constructor() {
    log('Initializing SlackAdminServer...');
    this.server = new Server(
      {
        name: 'slack-admin-mcp',
        version: '0.1.0',
        description: 'MCP server for Slack channel administration (create, rename, archive)',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );
    log('MCP Server object created.');

    this.setupToolHandlers();
    log('Tool handlers set up.');

    this.server.onerror = (error) => {
        log(`MCP Server onerror triggered: ${error}`);
        console.error('[MCP Error]', error);
    }
    process.on('SIGINT', async () => {
      log('Received SIGINT. Closing server...');
      await this.server.close();
      log('Server closed. Exiting.');
      process.exit(0);
    });
    log('SlackAdminServer initialized.');
  }

  private setupToolHandlers() {
    // --- ListTools ---
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
        log('Handling ListTools request.');
        return {
            tools: [
                 {
                  name: 'slack_create_channel',
                  description: '在 Slack 工作區建立一個新的公開頻道。',
                  inputSchema: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                        description: '新頻道的名稱 (小寫字母、數字、連字號，不含空格或特殊符號)',
                      },
                      is_private: {
                        type: 'boolean',
                        description: '是否建立為私密頻道 (預設為 false，即公開頻道)',
                        default: false,
                      },
                    },
                    required: ['name'],
                  },
                },
                {
                  name: 'slack_rename_channel',
                  description: '重新命名一個現有的 Slack 頻道。',
                  inputSchema: {
                    type: 'object',
                    properties: {
                      channel_id: {
                        type: 'string',
                        description: '要重新命名的頻道的 ID (例如 C03TL1QML3C)',
                      },
                      new_name: {
                        type: 'string',
                        description: '頻道的新名稱 (小寫字母、數字、連字號)',
                      },
                    },
                    required: ['channel_id', 'new_name'],
                  },
                },
                {
                  name: 'slack_archive_channel',
                  description: '封存一個現有的 Slack 頻道。',
                  inputSchema: {
                    type: 'object',
                    properties: {
                      channel_id: {
                        type: 'string',
                        description: '要封存的頻道的 ID (例如 C03TL1QML3C)',
                      },
                    },
                    required: ['channel_id'],
                  },
                },
            ],
        };
    });

    // --- CallTool ---
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const toolName = request.params.name;
      const args = request.params.arguments;
      log(`Handling CallTool request for tool: ${toolName}`);

      if (!slackApp) {
          log('Error: Slack App not initialized when calling tool.');
          return { content: [{ type: 'text', text: 'Slack App 未成功初始化。'}], isError: true };
      }

      try {
        let result: any;
        switch (toolName) {
          case 'slack_create_channel':
            log(`Calling conversations.create with name: ${args?.name}, is_private: ${args?.is_private}`);
            if (!args || typeof args.name !== 'string') {
              throw new McpError(ErrorCode.InvalidParams, '缺少或無效的頻道名稱參數 "name"。');
            }
            result = await slackApp.client.conversations.create({
              name: args.name,
              is_private: args.is_private === true,
            });
            break;

          case 'slack_rename_channel':
             log(`Calling conversations.rename with channel_id: ${args?.channel_id}, new_name: ${args?.new_name}`);
            if (!args || typeof args.channel_id !== 'string' || typeof args.new_name !== 'string') {
              throw new McpError(ErrorCode.InvalidParams, '缺少或無效的參數 "channel_id" 或 "new_name"。');
            }
            result = await slackApp.client.conversations.rename({
              channel: args.channel_id,
              name: args.new_name,
            });
            break;

          case 'slack_archive_channel':
             log(`Calling conversations.archive with channel_id: ${args?.channel_id}`);
            if (!args || typeof args.channel_id !== 'string') {
              throw new McpError(ErrorCode.InvalidParams, '缺少或無效的頻道 ID 參數 "channel_id"。');
            }
            result = await slackApp.client.conversations.archive({
              channel: args.channel_id,
            });
            break;

          default:
            log(`Unknown tool requested: ${toolName}`);
            throw new McpError(ErrorCode.MethodNotFound, `未知的工具: ${toolName}`);
        }

        if (!result.ok) {
          log(`Slack API Error (${toolName}): ${result.error}`);
          console.error(`Slack API 錯誤 (${toolName}):`, result.error);
          return {
            content: [{ type: 'text', text: `Slack API 錯誤: ${result.error}` }],
            isError: true,
          };
        }

        log(`Tool ${toolName} executed successfully.`);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };

      } catch (error: any) {
        log(`Error executing tool ${toolName}: ${error.message}`);
        console.error(`執行工具 ${toolName} 時發生錯誤:`, error);
        const errorMessage = error.data?.error || error.message || '未知錯誤';
        return {
          content: [{ type: 'text', text: `執行工具時發生錯誤: ${errorMessage}` }],
          isError: true,
        };
      }
    });
  }

  async run() {
    log('Attempting to connect via StdioServerTransport...');
    const transport = new StdioServerTransport();
    try {
      await this.server.connect(transport);
      log('Successfully connected via StdioServerTransport.');
      console.error('Slack Admin MCP server running on stdio');
    } catch (error: any) {
      log(`Error during server.connect: ${error.message}`);
      console.error('Error connecting MCP server:', error);
      process.exit(1);
    }
  }
}

log('Creating SlackAdminServer instance...');
const server = new SlackAdminServer();
log('Calling server.run()...');
server.run().catch((error: any) => {
    log(`Unhandled error during server run: ${error.message}`);
    console.error('Unhandled error during server run:', error);
    process.exit(1);
});
