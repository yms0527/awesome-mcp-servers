#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/dist/esm/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/dist/esm/server/stdio.js';
import { 
  ListToolsRequestSchema, 
  CallToolRequestSchema 
} from '@modelcontextprotocol/sdk/dist/esm/types.js';
import OneNoteAutomation from './onenote-browser-automation.js';
import { promises as fs } from 'fs';
 
export class OneNoteMcpServer {
  constructor() {
    this.server = new Server(
      {
        name: 'onenote-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.automation = null;
    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.cleanup();
      process.exit(0);
    });
  }

  async cleanup() {
    if (this.automation) {
      await this.automation.close();
      this.automation = null;
    }
    await this.server.close();
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'connect',
          description: 'Connect to a OneNote notebook using a shared link',
          inputSchema: {
            type: 'object',
            properties: {
              notebookLink: {
                type: 'string',
                description: 'The shared link to the OneNote notebook'
              }
            },
            required: ['notebookLink']
          }
        },
        {
          name: 'get_structure',
          description: 'Get the hierarchical structure of the notebook',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        },
        {
          name: 'read_section',
          description: 'Read all pages in a section',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'array',
                items: { type: 'string' },
                description: 'Path to the section (e.g., ["CMM", "Board Questions"])'
              }
            },
            required: ['path']
          }
        }
      ]
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'connect':
          return await this.handleConnect(args);
        case 'get_structure':
          return await this.handleGetStructure();
        case 'read_section':
          return await this.handleReadSection(args);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  async handleConnect({ notebookLink }) {
    console.log('Connecting to notebook:', notebookLink);
    
    if (this.automation) {
      await this.automation.close();
    }
    
    this.automation = new OneNoteAutomation(notebookLink);
    await this.automation.initialize();
    await this.automation.navigateToNotebook();
    
    return {
      content: [{
        type: 'text',
        text: 'Successfully connected to notebook'
      }]
    };
  }

  async handleGetStructure() {
    if (!this.automation) {
      throw new Error('Not connected to a notebook');
    }

    const structure = await this.automation.extractNotebookStructure();
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(structure, null, 2)
      }]
    };
  }

  async handleReadSection({ path }) {
    if (!this.automation) {
      throw new Error('Not connected to a notebook');
    }

    try {
      await this.automation.navigateToPath(path);
      const content = await this.automation.readCurrentPage();

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            title: content.title,
            content: content.content
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error reading section: ${path.join(' > ')}. ${error.message}`
        }],
        isError: true
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('OneNote MCP server running on stdio');
  }
}

let server = new OneNoteMcpServer();
server.run().catch(console.error);
