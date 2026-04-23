#!/usr/bin/env node
'use strict';

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import server from '../../server';
import { logger } from '../../utils';

async function main() {
  logger.info('Starting server with stdio transport');
  const transport = new StdioServerTransport();
  await server.connect(transport);

  transport.onerror = (error) => {
    logger.error('❌ Error in stdio transport', { error });
  };

  transport.onclose = () => {
    logger.info('🔚 Server disconnected from stdio transport');
  };

  logger.info('🚀 Server connected to stdio transport');

  return transport;
}

main().catch((err) => {
  logger.error('Error in main', { error: err });
  process.exit(1);
});
