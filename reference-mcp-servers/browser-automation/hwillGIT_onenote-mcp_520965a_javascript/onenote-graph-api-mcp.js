#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema, McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import config from './config.js';
import OneNoteMCPImpl from './onenote-mcp-impl.js';

class OneNoteMCPServer {
  server;
  oneNoteMCP;

  constructor() {
    this.server = new Server(
      {
        name: 'onenote-search',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {
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

    // Pass notebookLink from config to OneNoteMCPImpl constructor
    this.oneNoteMCP = new OneNoteMCPImpl(config.notebookLink);

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
         {
          name: 'search_pages',
          description: 'Search for pages in OneNote notebooks',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query',
              },
            },
            required: ['query'],
          },
        },
        {
          name: 'list_sections',
          description: 'List sections in a OneNote notebook',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        // Add other tool definitions here based on OneNoteMCPImpl methods
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name: tool_name, arguments: toolArgs } = request.params;

      switch (tool_name) {
        case 'search_pages':
          return this.handleSearchPages(toolArgs);
        case 'get_notebooks':
          return this.handleGetNotebooks(toolArgs);
        case 'list_sections':
          return this.handleListSections(toolArgs);
        // Add cases for other tools
        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Tool '${tool_name}' not found`
          );
      }
    });
  }

  async handleGetNotebooks(args) {
    console.log('Executing get_notebooks tool');
    const notebooks = await this.oneNoteMCP.getNotebooks();

    // Map Notebook objects to simple names for display
    const notebookNames = notebooks.map(notebook => notebook.displayName);

    return {
      content: [
        {
          type: 'json',
          // Just return notebook names for now
          json: notebookNames,
        },
      ],
    };
  }

  async handleSearchPages(args) {
    if (!args || typeof args.query !== 'string') {
      throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments for search_pages');
    }
    const { query } = args;
    const results = await this.oneNoteMCP.searchPages(query);
    return {
      content: [
        {
          type: 'json',
          json: results,
        },
      ],
    };
  }

  async handleListSections(args) {
    // Placeholder for list_sections tool
    return {
      content: [
        {
          type: 'text',
          text: 'list_sections tool is not yet implemented',
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('OneNote MCP server running on stdio', {
      capabilities: this.server.capabilities
    });
  }
}

async function main() {
  try {
    console.error('Starting OneNote MCP server...');
    const server = new OneNoteMCPServer();
    await server.run();
    console.error('Server initialization complete');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();
