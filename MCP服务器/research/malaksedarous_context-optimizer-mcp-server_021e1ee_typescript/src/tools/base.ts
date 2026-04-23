/**
 * Base tool implementation for MCP tools
 * 
 * Provides common functionality and interface for all context optimization tools
 */

import { Tool, CallToolResult } from '@modelcontextprotocol/sdk/types';
import { ConfigurationManager } from '../config/manager';
import { Logger } from '../utils/logger';

export type MCPToolResponse = CallToolResult;

export abstract class BaseMCPTool {
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly inputSchema: object;
  
  abstract execute(args: any): Promise<MCPToolResponse>;
  
  protected createSuccessResponse(content: string): MCPToolResponse {
    return {
      content: [{
        type: 'text',
        text: content
      }]
    };
  }
  
  protected createErrorResponse(error: string): MCPToolResponse {
    return {
      content: [{
        type: 'text',
        text: `❌ **Error**: ${error}`
      }],
      isError: true,
      errorMessage: error
    };
  }
  
  protected validateRequiredFields(args: any, required: string[]): string | null {
    for (const field of required) {
      if (!args[field] || (typeof args[field] === 'string' && !args[field].trim())) {
        return `Missing required field: ${field}`;
      }
    }
    return null;
  }
  
  protected logOperation(message: string, data?: any): void {
    const config = ConfigurationManager.getConfig();
    if (config.server.logLevel === 'debug' || config.server.logLevel === 'info') {
      Logger.debug(`[${this.name}] ${message}`, data ? JSON.stringify(data, null, 2) : '');
    }
  }
  
  // Convert to MCP SDK Tool format
  toMCPTool(): Tool {
    return {
      name: this.name,
      description: this.description,
      inputSchema: this.inputSchema as any
    };
  }
}
