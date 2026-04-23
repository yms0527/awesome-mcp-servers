#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerSearchCards } from './tools/search-cards.js';
import { registerBrowseSets } from './tools/browse-sets.js';
import { registerCardVersions } from './tools/card-versions.js';
import { registerBrowseLeaders } from './tools/browse-leaders.js';
import { registerAnalyzeCostCurve } from './tools/analyze-cost-curve.js';
import { registerFindCounters } from './tools/find-counters.js';
import { initCards } from './data/cards.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export async function createServer(): Promise<McpServer> {
  await initCards();
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  let version = '0.0.0';
  try {
    const pkg = JSON.parse(
      readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8'),
    );
    version = pkg.version;
  } catch {
    // Fallback version
  }

  const server = new McpServer({
    name: 'onepiece-oracle',
    version,
  });

  registerSearchCards(server);
  registerBrowseSets(server);
  registerCardVersions(server);
  registerBrowseLeaders(server);
  registerAnalyzeCostCurve(server);
  registerFindCounters(server);

  return server;
}

// Only start stdio when run directly
const isMain =
  process.argv[1] &&
  fileURLToPath(import.meta.url).includes(process.argv[1]);
if (isMain) {
  console.error('onepiece-oracle MCP server starting...');
  const server = await createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.on('SIGINT', async () => {
    await server.close();
    process.exit(0);
  });
  process.on('SIGTERM', async () => {
    await server.close();
    process.exit(0);
  });
}
