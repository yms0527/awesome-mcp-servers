#!/usr/bin/env node

/**
 * LevelBlue USM Anywhere MCP Server
 *
 * DISCLAIMER: This is NOT an official LevelBlue or AlienVault product.
 * This is an independent, community-developed integration tool.
 * See DISCLAIMER.md for full terms and conditions.
 *
 * Official Documentation: https://docs.levelblue.com/documentation/usm-anywhere
 *
 * @author Javier Ballesteros <javier.ballesteros@gmail.com>
 * @license GPL-3.0
 * @version 3.0.0
 * @repository https://github.com/javierb507/anywhere-mcp-server
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';
import { AlienVaultService } from './services/alienvault.js';
import { ToolHandlers } from './handlers/tools.js';

// Load environment variables
dotenv.config();

class AlienVaultMCPServer {
  private server: Server;
  private alienVaultService!: AlienVaultService; // Definite assignment assertion
  private toolHandlers!: ToolHandlers; // Definite assignment assertion

  constructor() {
    // Check for USM Anywhere API credentials (OAuth)
    const clientId = process.env.ALIENVAULT_CLIENT_ID;
    const clientSecret = process.env.ALIENVAULT_CLIENT_SECRET;
    const subdomain = process.env.ALIENVAULT_SUBDOMAIN;
    
    // Check for legacy OTX API key
    const otxApiKey = process.env.ALIENVAULT_OTX_API_KEY;

    // Validate that we have either USM Anywhere credentials or OTX API key
    if ((!clientId || !clientSecret || !subdomain) && !otxApiKey) {
      console.error('Error: Missing required credentials');
      console.error('');
      console.error('For USM Anywhere API v2.0 (OAuth), set:');
      console.error('  ALIENVAULT_CLIENT_ID=your_client_id');
      console.error('  ALIENVAULT_CLIENT_SECRET=your_client_secret');
      console.error('  ALIENVAULT_SUBDOMAIN=your_subdomain');
      console.error('');
      console.error('For legacy OTX API, set:');
      console.error('  ALIENVAULT_OTX_API_KEY=your_otx_api_key');
      console.error('');
      console.error('Please set the appropriate credentials in the .env file or environment variables');
      process.exit(1);
    }

    // Initialize services based on available credentials
    if (clientId && clientSecret && subdomain) {
      console.error('Initializing USM Anywhere API v2.0 client...');
      this.alienVaultService = new AlienVaultService(clientId, clientSecret, subdomain);
      
      // If OTX API key is also available, initialize it for legacy support
      if (otxApiKey) {
        console.error('Also enabling legacy OTX API support...');
        this.alienVaultService.initializeOTX(otxApiKey);
      }
    } else {
      console.error('Initializing legacy OTX API client...');
      // For legacy mode, we still need to create the service but with dummy OAuth credentials
      this.alienVaultService = new AlienVaultService('', '', '');
      if (otxApiKey) {
        this.alienVaultService.initializeOTX(otxApiKey);
      }
    }

    this.toolHandlers = new ToolHandlers(this.alienVaultService);

    // Initialize MCP server
    this.server = new Server(
      {
        name: 'alienvault-mcp-server',
        version: '2.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // Handle tool listing
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return await this.toolHandlers.listTools();
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      return await this.toolHandlers.callTool(request);
    });

    // Handle errors
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async start() {
    // Test API connections
    const clientId = process.env.ALIENVAULT_CLIENT_ID;
    const clientSecret = process.env.ALIENVAULT_CLIENT_SECRET;
    const subdomain = process.env.ALIENVAULT_SUBDOMAIN;
    const otxApiKey = process.env.ALIENVAULT_OTX_API_KEY;

    // Test USM Anywhere API connection if credentials are available
    if (clientId && clientSecret && subdomain) {
      console.error('Testing USM Anywhere API v2.0 connection...');
      try {
        const isConnected = await this.alienVaultService.testConnection();
        if (!isConnected) {
          console.error('Failed to connect to USM Anywhere API. Please check your OAuth credentials.');
          process.exit(1);
        }
        console.error('✓ Successfully connected to USM Anywhere API v2.0');
      } catch (error) {
        console.error('Error testing USM Anywhere API connection:', error);
        process.exit(1);
      }
    }

    // Test OTX API connection if API key is available
    if (otxApiKey) {
      console.error('Testing legacy OTX API connection...');
      try {
        const isOTXConnected = await this.alienVaultService.testOTXConnection();
        if (!isOTXConnected) {
          console.error('Failed to connect to OTX API. Please check your API key.');
          // Don't exit if USM Anywhere is working
          if (!clientId || !clientSecret || !subdomain) {
            process.exit(1);
          }
        } else {
          console.error('✓ Successfully connected to legacy OTX API');
        }
      } catch (error) {
        console.error('Error testing OTX API connection:', error);
        // Don't exit if USM Anywhere is working
        if (!clientId || !clientSecret || !subdomain) {
          process.exit(1);
        }
      }
    }

    // Start the server
    const transport = new StdioServerTransport();
    console.error('AlienVault MCP Server starting...');
    
    await this.server.connect(transport);
    console.error('✓ AlienVault MCP Server is running');
    
    // Log available APIs
    if (clientId && clientSecret && subdomain) {
      console.error('  - USM Anywhere API v2.0 (OAuth) enabled');
    }
    if (otxApiKey) {
      console.error('  - Legacy OTX API enabled');
    }
  }
}

// Start the server
const server = new AlienVaultMCPServer();
server.start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 