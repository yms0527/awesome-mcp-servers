import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { MemoryBankManager } from '../../core/MemoryBankManager.js';
import { setupMemoryBankResources } from './MemoryBankResources.js';

/**
 * Sets up all resource handlers for the MCP server
 * @param server MCP Server
 * @param memoryBankManager Memory Bank Manager
 */
export function setupResourceHandlers(
  server: Server,
  memoryBankManager: MemoryBankManager
) {
  setupMemoryBankResources(server, memoryBankManager);
}