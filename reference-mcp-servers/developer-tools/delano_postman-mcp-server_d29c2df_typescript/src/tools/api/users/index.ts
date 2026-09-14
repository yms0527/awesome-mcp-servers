import { AxiosInstance } from 'axios';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { ToolHandler, ToolDefinition, ToolCallResponse } from '../../../types/index.js';
import { BasePostmanTool } from '../base.js';
import { TOOL_DEFINITIONS } from './definitions.js';

export class UserTools extends BasePostmanTool implements ToolHandler {
  constructor(existingClient: AxiosInstance) {
    super(null, {}, existingClient);
  }

  getToolDefinitions(): ToolDefinition[] {
    return TOOL_DEFINITIONS;
  }

  private createResponse(data: any): ToolCallResponse {
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
    };
  }

  async handleToolCall(name: string, args: unknown): Promise<ToolCallResponse> {
    try {
      switch (name) {
        case 'get_user_info':
          return await this.getUserInfo();
        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${name}`
          );
      }
    } catch (error) {
      // Let base class interceptor handle API errors
      throw error;
    }
  }

  async getUserInfo(): Promise<ToolCallResponse> {
    const response = await this.client.get('/me');
    return this.createResponse(response.data);
  }
}
