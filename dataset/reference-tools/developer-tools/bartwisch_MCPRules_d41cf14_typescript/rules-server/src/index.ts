#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import axios from 'axios';

/**
 * Represents a single rule with its category, key, and value
 */
interface Rule {
  category: string;
  key: string;
  value: string;
}

/**
 * MCP Server that provides access to programming rules and guidelines
 * Supports both local files and GitHub repositories as rule sources
 */
class RulesServer {
  private server: Server;
  private rulesPath: string;
  private githubToken: string | undefined;

  constructor() {
    this.server = new Server(
      {
        name: 'rules-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Get rules file path from environment variables
    this.rulesPath = process.env.RULES_FILE_PATH || '';
    if (!this.rulesPath) {
      throw new Error('RULES_FILE_PATH environment variable is required. Set this to either a local file path or GitHub URL.');
    }

    // Optional GitHub token for private repositories
    this.githubToken = process.env.GITHUB_TOKEN;

    this.setupToolHandlers();
    
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  /**
   * Checks if a given path is a GitHub URL
   * @param path The path to check
   * @returns boolean indicating if the path is a GitHub URL
   */
  private isGitHubUrl(path: string): boolean {
    return path.startsWith('https://') && (
      path.includes('github.com') ||
      path.includes('raw.githubusercontent.com')
    );
  }

  /**
   * Fetches rule content from either a local file or GitHub URL
   * @returns Promise<string> The content of the rules file
   * @throws McpError if file cannot be read or GitHub request fails
   */
  private async fetchContent(): Promise<string> {
    if (this.isGitHubUrl(this.rulesPath)) {
      try {
        // Convert github.com URLs to raw.githubusercontent.com if needed
        let rawUrl = this.rulesPath;
        if (rawUrl.includes('github.com')) {
          rawUrl = rawUrl
            .replace('github.com', 'raw.githubusercontent.com')
            .replace('/blob/', '/');
        }

        const headers: Record<string, string> = {};
        if (this.githubToken) {
          headers['Authorization'] = `token ${this.githubToken}`;
        }

        const response = await axios.get(rawUrl, { headers });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          if (status === 404) {
            throw new McpError(
              ErrorCode.InternalError,
              'GitHub file not found. If this is a private repository, please provide a GITHUB_TOKEN.'
            );
          } else if (status === 401 || status === 403) {
            throw new McpError(
              ErrorCode.InternalError,
              'GitHub authentication failed. Please check your GITHUB_TOKEN.'
            );
          }
          throw new McpError(
            ErrorCode.InternalError,
            `Failed to fetch from GitHub: ${error.message}`
          );
        }
        throw new McpError(
          ErrorCode.InternalError,
          'Failed to fetch from GitHub: Unknown error'
        );
      }
    } else {
      try {
        return await fs.readFile(this.rulesPath, 'utf-8');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to read local file: ${errorMessage}. Make sure the file exists and is accessible.`
        );
      }
    }
  }

  /**
   * Cleans a category string by removing # symbols and whitespace
   * @param category The category string to clean
   * @returns The cleaned category string
   */
  private cleanCategory(category: string): string {
    return category.replace(/#/g, '').trim();
  }

  /**
   * Parses rules from the content in markdown format
   * Rules should be in the format:
   * #Category
   * key: value
   * @returns Promise<Rule[]> Array of parsed rules
   */
  private async parseRules(): Promise<Rule[]> {
    const content = await this.fetchContent();
    const lines = content.split('\n');
    const rules: Rule[] = [];
    let currentCategory = '';

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) continue;
      
      // Handle category headers (single # only)
      if (trimmedLine.startsWith('#') && !trimmedLine.startsWith('##')) {
        currentCategory = this.cleanCategory(trimmedLine);
        continue;
      }

      // Handle rules in key: value format
      const colonIndex = trimmedLine.indexOf(':');
      if (colonIndex !== -1 && currentCategory) {
        const key = trimmedLine.substring(0, colonIndex).trim();
        const value = trimmedLine.substring(colonIndex + 1).trim();
        if (key && value) { // Only add rules with both key and value
          rules.push({
            category: currentCategory,
            key,
            value
          });
        }
      }
    }

    return rules;
  }

  /**
   * Sets up the MCP tool handlers for getting rules and categories
   */
  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'get_rules',
          description: 'Get all rules or filter by category',
          inputSchema: {
            type: 'object',
            properties: {
              category: {
                type: 'string',
                description: 'Optional category to filter rules',
              },
            },
          },
        },
        {
          name: 'get_categories',
          description: 'Get list of all rule categories',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const rules = await this.parseRules();

      switch (request.params.name) {
        case 'get_rules': {
          const category = request.params.arguments?.category as string | undefined;
          const filteredRules = category
            ? rules.filter(rule => rule.category.toLowerCase() === category.toLowerCase())
            : rules;

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(filteredRules, null, 2),
              },
            ],
          };
        }

        case 'get_categories': {
          const categories = [...new Set(rules.map(rule => rule.category))]
            .filter(category => category !== ''); // Remove empty categories

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(categories, null, 2),
              },
            ],
          };
        }

        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${request.params.name}`
          );
      }
    });
  }

  /**
   * Starts the MCP server using stdio transport
   */
  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Rules MCP server running on stdio');
  }
}

const server = new RulesServer();
server.run().catch(console.error);
