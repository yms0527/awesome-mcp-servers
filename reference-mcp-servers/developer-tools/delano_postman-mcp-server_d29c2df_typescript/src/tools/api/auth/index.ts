import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AxiosInstance } from 'axios';
import {
  ToolCallResponse,
  ToolDefinition,
  ToolHandler
} from '../../../types/index.js';
import { BasePostmanTool } from '../base.js';
import { TOOL_DEFINITIONS } from './definitions.js';

/**
 * Handles Postman authentication and authorization operations including:
 * - Collection access key management
 * - Workspace and collection role management
 * - User authentication information
 */
export class AuthTools extends BasePostmanTool implements ToolHandler {
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
        case 'list_collection_access_keys':
          return await this.listCollectionAccessKeys(args);
        case 'delete_collection_access_key':
          return await this.deleteCollectionAccessKey(args.keyId);
        case 'list_workspace_roles':
          return await this.listWorkspaceRoles();
        case 'get_workspace_roles':
          return await this.getWorkspaceRoles(args);
        case 'update_workspace_roles':
          return await this.updateWorkspaceRoles(args);
        case 'get_collection_roles':
          return await this.getCollectionRoles(args.collectionId);
        case 'update_collection_roles':
          return await this.updateCollectionRoles(args);
        case 'get_authenticated_user':
          return await this.getAuthenticatedUser();
        default:
          throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
      }
    } catch (error) {
      // Let base class interceptor handle API errors
      throw error;
    }
  }

  /**
   * List collection access keys with optional filtering
   */
  async listCollectionAccessKeys(args: {
    collectionId?: string;
    cursor?: string;
  }): Promise<ToolCallResponse> {
    const params = new URLSearchParams();
    if (args.collectionId) {
      params.append('collectionId', args.collectionId);
    }
    if (args.cursor) {
      params.append('cursor', args.cursor);
    }

    const response = await this.client.get('/collection-access-keys', {
      params: params.toString() ? params : undefined
    });
    return this.createResponse(response.data);
  }

  /**
   * Delete a collection access key
   */
  async deleteCollectionAccessKey(keyId: string): Promise<ToolCallResponse> {
    if (!keyId) {
      throw new McpError(ErrorCode.InvalidParams, 'keyId is required');
    }
    const response = await this.client.delete(`/collection-access-keys/${keyId}`);
    return this.createResponse(response.data);
  }

  /**
   * Get all available workspace roles based on team's plan
   */
  async listWorkspaceRoles(): Promise<ToolCallResponse> {
    const response = await this.client.get('/workspaces-roles');
    return this.createResponse(response.data);
  }

  /**
   * Get roles for a specific workspace
   */
  async getWorkspaceRoles(args: {
    workspaceId: string;
    includeScim?: boolean;
  }): Promise<ToolCallResponse> {
    if (!args.workspaceId) {
      throw new McpError(ErrorCode.InvalidParams, 'workspaceId is required');
    }

    const params = new URLSearchParams();
    if (args.includeScim) {
      params.append('include', 'scim');
    }

    const response = await this.client.get(
      `/workspaces/${args.workspaceId}/roles`,
      { params: params.toString() ? params : undefined }
    );
    return this.createResponse(response.data);
  }

  /**
   * Update workspace roles for users and groups
   * Limited to 50 operations per call
   */
  async updateWorkspaceRoles(args: {
    workspaceId: string;
    operations: Array<{
      op: 'update';
      path: '/user' | '/group' | '/team';
      value: Array<{
        id: number;
        role: 'VIEWER' | 'EDITOR';
      }>;
    }>;
    identifierType?: 'scim';
  }): Promise<ToolCallResponse> {
    if (!args.workspaceId) {
      throw new McpError(ErrorCode.InvalidParams, 'workspaceId is required');
    }
    if (!args.operations || !Array.isArray(args.operations)) {
      throw new McpError(ErrorCode.InvalidParams, 'operations array is required');
    }
    if (args.operations.length > 50) {
      throw new McpError(ErrorCode.InvalidParams, 'Maximum 50 role operations allowed per request');
    }

    const headers: Record<string, string> = {};
    if (args.identifierType) {
      headers['identifierType'] = args.identifierType;
    }

    const response = await this.client.patch(
      `/workspaces/${args.workspaceId}/roles`,
      { roles: args.operations },
      { headers }
    );
    return this.createResponse(response.data);
  }

  /**
   * Get roles for a collection
   */
  async getCollectionRoles(collectionId: string): Promise<ToolCallResponse> {
    if (!collectionId) {
      throw new McpError(ErrorCode.InvalidParams, 'collectionId is required');
    }
    const response = await this.client.get(`/collections/${collectionId}/roles`);
    return this.createResponse(response.data);
  }

  /**
   * Update collection roles
   * Only users with EDITOR role can use this endpoint
   * Does not support Partner or Guest external roles
   */
  async updateCollectionRoles(args: {
    collectionId: string;
    operations: Array<{
      op: 'update';
      path: '/user' | '/group' | '/team';
      value: Array<{
        id: number;
        role: 'VIEWER' | 'EDITOR';
      }>;
    }>;
  }): Promise<ToolCallResponse> {
    if (!args.collectionId) {
      throw new McpError(ErrorCode.InvalidParams, 'collectionId is required');
    }
    if (!args.operations || !Array.isArray(args.operations)) {
      throw new McpError(ErrorCode.InvalidParams, 'operations array is required');
    }

    const response = await this.client.patch(
      `/collections/${args.collectionId}/roles`,
      { roles: args.operations }
    );
    return this.createResponse(response.data);
  }

  /**
   * Get authenticated user information
   * Returns different response for Guest and Partner roles
   * Returns flow_count only for Free plan users
   */
  async getAuthenticatedUser(): Promise<ToolCallResponse> {
    const response = await this.client.get('/me');
    return this.createResponse(response.data);
  }
}
