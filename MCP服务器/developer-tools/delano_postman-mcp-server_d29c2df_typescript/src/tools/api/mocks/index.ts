import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AxiosInstance } from 'axios';
import {
  ToolCallResponse,
  ToolDefinition,
  ToolHandler,
} from '../../../types/index.js';
import { BasePostmanTool } from '../base.js';
import { TOOL_DEFINITIONS } from './definitions.js';

/**
 * Handles Postman Mock Server API operations
 */
export class MockTools extends BasePostmanTool implements ToolHandler {
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

  async handleToolCall(name: string, args: any): Promise<ToolCallResponse> {
    try {
      switch (name) {
        case 'list_mocks':
          return await this.listMocks(args);
        case 'create_mock':
          return await this.createMock(args);
        case 'get_mock':
          return await this.getMock(args.mockId);
        case 'update_mock':
          return await this.updateMock(args);
        case 'delete_mock':
          return await this.deleteMock(args.mockId);
        case 'get_mock_call_logs':
          return await this.getMockCallLogs(args);
        case 'publish_mock':
          return await this.publishMock(args.mockId);
        case 'unpublish_mock':
          return await this.unpublishMock(args.mockId);
        case 'list_server_responses':
          return await this.listServerResponses(args.mockId);
        case 'create_server_response':
          return await this.createServerResponse(args);
        case 'get_server_response':
          return await this.getServerResponse(args);
        case 'update_server_response':
          return await this.updateServerResponse(args);
        case 'delete_server_response':
          return await this.deleteServerResponse(args);
        default:
          throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
      }
    } catch (error) {
      // Let base class interceptor handle API errors
      throw error;
    }
  }

  /**
   * List all mock servers
   * @param args Optional filters: teamId, workspace
   */
  async listMocks(args: any): Promise<ToolCallResponse> {
    const params: any = {};
    if (args.teamId) params.teamId = args.teamId;
    if (args.workspace) params.workspace = args.workspace;

    const response = await this.client.get('/mocks', { params });
    return this.createResponse(response.data);
  }

  /**
   * Create a new mock server
   * @param args.workspace Optional workspace ID
   * @param args.mock Mock server configuration
   */
  async createMock(args: any): Promise<ToolCallResponse> {
    const params: any = {};
    if (args.workspace) params.workspaceId = args.workspace;

    const response = await this.client.post('/mocks', { mock: args.mock }, { params });
    return this.createResponse(response.data);
  }

  /**
   * Get details of a specific mock server
   * @param mockId Mock server ID
   */
  async getMock(mockId: string): Promise<ToolCallResponse> {
    const response = await this.client.get(`/mocks/${mockId}`);
    return this.createResponse(response.data);
  }

  /**
   * Update an existing mock server
   * @param args.mockId Mock server ID
   * @param args.mock Updated mock server configuration
   */
  async updateMock(args: any): Promise<ToolCallResponse> {
    const response = await this.client.put(
      `/mocks/${args.mockId}`,
      { mock: args.mock }
    );
    return this.createResponse(response.data);
  }

  /**
   * Delete a mock server
   * @param mockId Mock server ID
   */
  async deleteMock(mockId: string): Promise<ToolCallResponse> {
    const response = await this.client.delete(`/mocks/${mockId}`);
    return this.createResponse(response.data);
  }

  /**
   * Get mock server call logs
   * @param args.mockId Mock server ID
   * @param args Optional filters and pagination
   */
  async getMockCallLogs(args: any): Promise<ToolCallResponse> {
    const params: any = {};
    const optionalParams = [
      'limit', 'cursor', 'until', 'since', 'responseStatusCode',
      'responseType', 'requestMethod', 'requestPath', 'sort',
      'direction', 'include'
    ];

    optionalParams.forEach(param => {
      if (args[param] !== undefined) params[param] = args[param];
    });

    const response = await this.client.get(
      `/mocks/${args.mockId}/call-logs`,
      { params }
    );
    return this.createResponse(response.data);
  }

  /**
   * Publish a mock server (set to public)
   * @param mockId Mock server ID
   */
  async publishMock(mockId: string): Promise<ToolCallResponse> {
    const response = await this.client.post(`/mocks/${mockId}/publish`);
    return this.createResponse(response.data);
  }

  /**
   * Unpublish a mock server (set to private)
   * @param mockId Mock server ID
   */
  async unpublishMock(mockId: string): Promise<ToolCallResponse> {
    const response = await this.client.delete(`/mocks/${mockId}/unpublish`);
    return this.createResponse(response.data);
  }

  /**
   * List all server responses for a mock
   * @param mockId Mock server ID
   */
  async listServerResponses(mockId: string): Promise<ToolCallResponse> {
    const response = await this.client.get(`/mocks/${mockId}/server-responses`);
    return this.createResponse(response.data);
  }

  /**
   * Create a new server response
   * @param args.mockId Mock server ID
   * @param args.serverResponse Server response configuration
   */
  async createServerResponse(args: any): Promise<ToolCallResponse> {
    const response = await this.client.post(
      `/mocks/${args.mockId}/server-responses`,
      { serverResponse: args.serverResponse }
    );
    return this.createResponse(response.data);
  }

  /**
   * Get a specific server response
   * @param args.mockId Mock server ID
   * @param args.serverResponseId Server response ID
   */
  async getServerResponse(args: any): Promise<ToolCallResponse> {
    const response = await this.client.get(
      `/mocks/${args.mockId}/server-responses/${args.serverResponseId}`
    );
    return this.createResponse(response.data);
  }

  /**
   * Update a server response
   * @param args.mockId Mock server ID
   * @param args.serverResponseId Server response ID
   * @param args.serverResponse Updated server response configuration
   */
  async updateServerResponse(args: any): Promise<ToolCallResponse> {
    const response = await this.client.put(
      `/mocks/${args.mockId}/server-responses/${args.serverResponseId}`,
      { serverResponse: args.serverResponse }
    );
    return this.createResponse(response.data);
  }

  /**
   * Delete a server response
   * @param args.mockId Mock server ID
   * @param args.serverResponseId Server response ID
   */
  async deleteServerResponse(args: any): Promise<ToolCallResponse> {
    const response = await this.client.delete(
      `/mocks/${args.mockId}/server-responses/${args.serverResponseId}`
    );
    return this.createResponse(response.data);
  }
}
