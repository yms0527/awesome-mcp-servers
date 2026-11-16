#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError } from '@modelcontextprotocol/sdk/types.js';
import OneNoteAutomation from './onenote-browser-automation.js';

class OneNoteMCPServer {
  server;
  automation;
  notebookLink;

  constructor() {
    this.server = new Server(
      {
        name: 'onenote-search',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {
            echo: {
              description: 'Echoes back the input text',
              inputSchema: {
                type: 'object',
                properties: {
                  text: { type: 'string', description: 'Text to echo' }
                },
                required: ['text']
              }
            },
            get_notebooks: {
              description: 'Get a list of OneNote notebooks',
              inputSchema: {
                type: 'object',
                properties: {}
              }
            }
          },
          resources: {},
        },
      }
    );

    this.notebookLink = 'https://onedrive.live.com/edit.aspx?resid=8255FC51ED471D07!142&migratedtospo=true&redeem=aHR0cHM6Ly8xZHJ2Lm1zL28vYy84MjU1ZmM1MWVkNDcxZDA3L0VnY2RSLTFSX0ZVZ2dJS09BQUFBQUFBQk53REdfc0c4aEFFV01idzVIdlh5MEE_ZT1ibHNkRHE&wd=target%28Family.one%7Cc3aa35e6-f2d2-4322-862c-eea856fe824b%2FAunt%20W%20birthday%7C37a0a4f8-773e-4454-bf71-4e160a5a01a6%2F%29&wdorigin=NavigationUrl';
    this.automation = new OneNoteAutomation(this.notebookLink);

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'echo',
          description: 'Echoes back the input text',
          inputSchema: {
            type: 'object',
            properties: {
              text: { type: 'string', description: 'Text to echo' }
            },
            required: ['text']
          }
        },
        {
          name: 'get_notebooks',
          description: 'Get a list of OneNote notebooks',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        }
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case 'echo': {
          const text = request.params.arguments?.text;
          if (typeof text !== 'string') {
            throw new McpError(ErrorCode.InvalidParams, 'Text argument must be a string');
          }
          return {
            content: [
              {
                type: 'text',
                text: text
              }
            ]
          };
        }
        
        case 'get_notebooks': {
          try {
            console.error('Initializing OneNote automation...');
            await this.automation.initialize();
            await this.automation.navigateToNotebook();
            const structure = await this.automation.extractNotebookStructure();
            return {
              content: [
                {
                  type: 'json',
                  json: structure
                }
              ]
            };
          } catch (error) {
            throw new McpError(ErrorCode.InternalError, error.message);
          }
        }
        
        default:
          throw new McpError(ErrorCode.MethodNotFound, `Tool '${request.params.name}' not found`);
      }
    });
  }

  async run() {
    try {
      console.error('Starting OneNote MCP server...');
      console.error('Setting up error handlers...');
      process.on('uncaughtException', err => console.error('Uncaught Exception:', err));
      process.on('unhandledRejection', (reason, promise) => console.error('Unhandled Rejection:', reason));
      console.error('Creating transport...');
      const transport = new StdioServerTransport();
      console.error('Connecting to transport...');
      await this.server.connect(transport);
      console.error('Successfully connected to transport. Server running on stdio.');
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

const server = new OneNoteMCPServer();
server.run().catch(console.error);