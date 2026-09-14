#!/usr/bin/env node
import { MemoryBankServer } from './server/MemoryBankServer.js';
import { getLogManager, logger, LogLevel } from './utils/LogManager.js';

/**
 * Display program help
 */
function showHelp() {
  console.log(`
Memory Bank MCP - MCP Server for managing Memory Bank

Usage: memory-bank-mcp [options]

Options:
  --mode, -m <mode>    Set execution mode (code, ask, architect, etc.)
  --path, -p <path>    Set project path (default: current directory)
  --folder, -f <folder> Set Memory Bank folder name (default: memory-bank)
  --githubProfileUrl, -g <url>    Set GitHub profile URL for tracking changes
  --debug, -d          Enable debug mode (show detailed logs)
  --help, -h           Display this help
  
Examples:
  memory-bank-mcp
  memory-bank-mcp --mode code
  memory-bank-mcp --path /path/to/project
  memory-bank-mcp --folder custom-memory-bank
  memory-bank-mcp --githubProfileUrl "https://github.com/username"
  memory-bank-mcp --debug
  
For more information, visit: https://github.com/movibe/memory-bank-server
`);
  process.exit(0);
}

/**
 * Process command line arguments
 * @returns Object with processed options
 */
function processArgs() {
  const args = process.argv.slice(2);
  const options: { 
    mode?: string; 
    projectPath?: string; 
    folderName?: string; 
    userId?: string;
    debug?: boolean;
  } = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--mode' || arg === '-m') {
      options.mode = args[++i];
    } else if (arg === '--path' || arg === '-p') {
      options.projectPath = args[++i];
    } else if (arg === '--folder' || arg === '-f') {
      options.folderName = args[++i];
    } else if (arg === '--githubProfileUrl' || arg === '-g') {
      options.userId = args[++i];
    } else if (arg === '--debug' || arg === '-d') {
      options.debug = true;
    } else if (arg === '--help' || arg === '-h') {
      showHelp();
    }
  }

  return options;
}

/**
 * Main entry point for the Memory Bank Server
 * 
 * This script initializes and runs the Memory Bank Server,
 * which provides MCP (Model Context Protocol) tools and resources
 * for managing memory banks.
 */
async function main() {
  try {
    const options = processArgs();
    
    // Configure log manager
    const logManager = getLogManager();
    if (options.debug) {
      logManager.enableDebugMode();
      logger.info('Main', 'Debug mode enabled');
    }
    
    logger.info('Main', 'Starting Memory Bank Server...');
    if (options.mode) {
      logger.debug('Main', `Using mode: ${options.mode}`);
    }
    if (options.projectPath) {
      logger.debug('Main', `Using project path: ${options.projectPath}`);
    }
    if (options.folderName) {
      logger.debug('Main', `Using Memory Bank folder name: ${options.folderName}`);
    }
    if (options.userId) {
      logger.debug('Main', `Using GitHub profile URL: ${options.userId}`);
    }
    
    const server = new MemoryBankServer(options.mode, options.projectPath, options.userId, options.folderName, options.debug);
    await server.run();
    logger.info('Main', 'Memory Bank Server started successfully');
  } catch (error) {
    logger.error('Main', `Error starting Memory Bank server: ${error}`);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
main().catch(error => {
  console.error('Fatal error in Memory Bank Server:', error);
  process.exit(1);
});
