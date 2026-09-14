#!/usr/bin/env node

/**
 * TSGram MCP Entry Point
 * Main entry for running the Telegram MCP system locally
 */

import dotenv from 'dotenv';
import { createServer } from 'http';

// Load environment variables
dotenv.config();

// Health check server for Docker
function startHealthServer(port: number = 3000) {
  const server = createServer((req, res) => {
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }));
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  server.listen(port, () => {
    console.log(`Health check server running on port ${port}`);
  });

  return server;
}

async function main() {
  console.log('🚀 Starting TSGram MCP System...');
  
  // Check required environment variables
  const requiredVars = ['TELEGRAM_BOT_TOKEN', 'OPENROUTER_API_KEY'];
  const missing = requiredVars.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.log('💡 Tip: The Docker system is already running. Use these commands instead:');
    console.log('   • npm run dashboard  - Web dashboard');
    console.log('   • npm run docker:logs - View Docker logs');
    console.log('   • npm run health-check - Check system health');
    process.exit(1);
  }

  console.log('💡 For development, use these commands instead:');
  console.log('   • npm run dashboard  - Web dashboard (http://localhost:3000)');
  console.log('   • npm run docker:logs - View Docker container logs');
  console.log('   • npm run health-check - Check if services are healthy');
  console.log('');
  console.log('🐳 The TSGram system runs in Docker containers:');
  console.log('   • Port 4040: AI-powered Telegram bot');
  console.log('   • Port 4041: MCP webhook server');
  console.log('   • Port 3000: Web dashboard');
  
  process.exit(0);
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}` || process.env.NODE_ENV === 'development') {
  main().catch(console.error);
}

// Export main TSGram components
export * from './telegram/bot-client.js';
export * from './models/index.js';
export * from './types/index.js';