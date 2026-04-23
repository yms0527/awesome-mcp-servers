#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError } from '@modelcontextprotocol/sdk/types.js';
import OneNoteAutomation from './onenote-browser-automation.js';

class EchoServer {
  server;

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
                properties: {}
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
    
    // Initialize with the shared notebook link
    const notebookLink = 'https://onedrive.live.com/edit.aspx?resid=8255FC51ED471D07!142&migratedtospo=true&redeem=aHR0cHM6Ly8xZHJ2Lm1zL28vYy84MjU1ZmM1MWVkNDcxZDA3L0VnY2RSLTFSX0ZVZ2dJS09BQUFBQUFBQk53REdfc0c4aEFFV01idzVIdlh5MEE_ZT1ibHNkRHE&wd=target%28Family.one%7Cc3aa35e6-f2d2-4322-862c-eea856fe824b%2FAunt%20W%20birthday%7C37a0a4f8-773e-4454-bf71-4e160a5a01a6%2F%29&wdorigin=NavigationUrl';
    this.automation = new OneNoteAutomation();
    this.notebookLink = notebookLink;

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'get_notebooks',
          description: 'Get a list of OneNote notebooks',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name === 'get_notebooks') {
        try {
          console.error('Initializing OneNote automation...');
          await this.automation.initialize();
          await this.automation.navigateToNotebook(this.notebookLink);
          const structure = await this.automation.extractNotebookStructure();
          return {
            success: true,
            content: [
              {
                type: 'json',
                json: {
                  notebookTitle: structure.notebookTitle,
                  sections: structure.sections
                }
              }
            ]
          };
        } catch (error) {
          throw new McpError(ErrorCode.InternalError, error.message);
        }
      } else if (request.params.name === 'echo') {
        console.error('Executing echo tool...');
        const text = request.params.arguments?.text;
        if (typeof text !== 'string') {
          throw new McpError(ErrorCode.InvalidParams, 'Text argument must be a string');
        }
        return {
          content: [
            {
              type: 'text',
              text: text,
            },
          ],
        };
      } else {
        throw new McpError(ErrorCode.MethodNotFound, `Tool '${request.params.name}' not found`);
      }
    });
  }

  async run() {
    try {
      console.error('Starting OneNote MCP server...');
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      console.error('OneNote MCP server running on stdio');
    } catch (error) {
      console.error('Failed to start server:', error);
    }
  }
}

const server = new EchoServer();
server.run().catch(console.error);