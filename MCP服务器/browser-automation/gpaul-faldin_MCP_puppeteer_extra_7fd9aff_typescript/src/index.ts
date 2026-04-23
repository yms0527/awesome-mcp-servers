import { closeBrowser, getBrowser, initBrowser } from '@/utils/browserManager';
import { notificationManager } from '@/utils/notificationUtil';
import { screenshotStore } from '@/utils/screenshotManager';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Configure environment variables
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

// config({
//   path: path.resolve(__dirname, '..', envFile),
// });

process.env.HEADLESS = 'false';

// Create MCP server instance
export const mcpServer = new McpServer(
  {
    name: 'puppeteer-extra-stealth',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  },
);

// Set the server in notification manager
notificationManager.setServer(mcpServer);

// Set up resource handlers
mcpServer.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: 'console://logs',
      mimeType: 'text/plain',
      name: 'Browser console logs',
    },
    ...Array.from(screenshotStore.getAll()).map(screenshot => ({
      uri: `screenshot://${screenshot.name}`,
      mimeType: 'image/png',
      name: `Screenshot: ${screenshot.name}`,
    })),
  ],
}));

// Set up resource reading for screenshots
mcpServer.server.setRequestHandler(ReadResourceRequestSchema, async request => {
  const uri = request.params.uri.toString();

  // Handle console logs
  if (uri === 'console://logs') {
    const browser = getBrowser();
    return {
      contents: [
        {
          uri,
          mimeType: 'text/plain',
          text: browser.getConsoleLogs().join('\n'),
        },
      ],
    };
  }

  // Handle screenshots
  if (uri.startsWith('screenshot://')) {
    const name = uri.replace('screenshot://', '');
    const screenshot = screenshotStore.get(name);

    if (screenshot) {
      return {
        contents: [
          {
            uri,
            mimeType: 'image/png',
            blob: screenshot.data,
          },
        ],
      };
    }
  }

  throw new Error(`Resource not found: ${uri}`);
});

// Import all tool endpoints
import './endpoints';

// Main function to start the server
async function main() {
  try {
    // Initialize browser with stealth mode
    const isHeadless = process.env.HEADLESS !== 'false';
    await initBrowser(isHeadless);

    // Connect to the transport layer
    const transport = new StdioServerTransport();
    await mcpServer.connect(transport);

    // Now that we're connected, we can send notifications
    notificationManager.resourcesChanged();

    if (process.env.NODE_ENV === 'development') {
      console.error('Puppeteer-Extra MCP Server started in development mode');
      console.error(`Headless mode: ${isHeadless ? 'enabled' : 'disabled'}`);
    }
  } catch (error) {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  }
}

// Start the server
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

// Handle graceful shutdown
const shutdown = async () => {
  try {
    console.error('Shutting down Puppeteer-Extra MCP Server...');
    await closeBrowser();
    await mcpServer.close();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

// Listen for termination signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('exit', () => {
  console.error('Puppeteer-Extra MCP Server exited');
});

// Handle errors on stdin which likely means the parent process closed
process.stdin.on('error', () => {
  console.error('stdin error - parent process likely closed');
  shutdown();
});

// Handle stdin close which means the parent process closed
process.stdin.on('close', () => {
  console.error('stdin closed - parent process likely closed');
  shutdown();
});
