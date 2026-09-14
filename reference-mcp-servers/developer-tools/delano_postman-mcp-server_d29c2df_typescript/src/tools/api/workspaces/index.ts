import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { AxiosInstance } from 'axios';
import {
  ToolCallResponse,
  ToolDefinition,
  ToolHandler,
} from '../../../types/index.js';
import { BasePostmanTool } from '../base.js';
import { TOOL_DEFINITIONS } from './definitions.js';

export class WorkspaceTools extends BasePostmanTool implements ToolHandler {
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
        case 'list_workspaces':
          return await this.listWorkspaces(args);
        case 'get_workspace':
          return await this.getWorkspace(args.workspace, args.include);
        case 'create_workspace':
          return await this.createWorkspace(args);
        case 'update_workspace':
          return await this.updateWorkspace(args.workspace_id, args);
        case 'delete_workspace':
          return await this.deleteWorkspace(args.workspace_id);
        case 'get_global_variables':
          return await this.getGlobalVariables(args.workspace_id);
        case 'update_global_variables':
          return await this.updateGlobalVariables(args.workspace_id, args.variables);
        case 'get_workspace_roles':
          return await this.getWorkspaceRoles(args.workspace_id, args.includeScimQuery);
        case 'update_workspace_roles':
          return await this.updateWorkspaceRoles(args.workspace_id, args.operations, args.identifierType);
        case 'get_all_workspace_roles':
          return await this.getAllWorkspaceRoles();
        default:
          throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
      }
    } catch (error) {
      // Let base class interceptor handle API errors
      throw error;
    }
  }

  async listWorkspaces(params?: {
    type?: 'personal' | 'team' | 'private' | 'public' | 'partner';
    createdBy?: string;
    include?: string;
  }): Promise<ToolCallResponse> {
    const response = await this.client.get('/workspaces', { params });
    return this.createResponse(response.data);
  }

  async getWorkspace(workspace_id: string, include?: string): Promise<ToolCallResponse> {
    if (!workspace_id) {
      throw new McpError(ErrorCode.InvalidParams, 'workspace_id is required');
    }
    const response = await this.client.get(`/workspaces/${workspace_id}`, {
      params: { include }
    });
    return this.createResponse(response.data);
  }

  async createWorkspace(data: {
    name: string;
    description?: string;
    type?: 'personal' | 'team';
  }): Promise<ToolCallResponse> {
    if (!data.name) {
      throw new McpError(ErrorCode.InvalidParams, 'name is required');
    }
    const response = await this.client.post('/workspaces', data);
    return this.createResponse(response.data);
  }

  async updateWorkspace(workspace_id: string, data: {
    name?: string;
    description?: string;
    type?: 'personal' | 'team';
  }): Promise<ToolCallResponse> {
    if (!workspace_id) {
      throw new McpError(ErrorCode.InvalidParams, 'workspace_id is required');
    }
    const response = await this.client.put(`/workspaces/${workspace_id}`, data);
    return this.createResponse(response.data);
  }

  async deleteWorkspace(workspace_id: string): Promise<ToolCallResponse> {
    if (!workspace_id) {
      throw new McpError(ErrorCode.InvalidParams, 'workspace_id is required');
    }
    const response = await this.client.delete(`/workspaces/${workspace_id}`);
    return this.createResponse(response.data);
  }

  async getGlobalVariables(workspace_id: string): Promise<ToolCallResponse> {
    if (!workspace_id) {
      throw new McpError(ErrorCode.InvalidParams, 'workspace_id is required');
    }
    const response = await this.client.get(`/workspaces/${workspace_id}/global-variables`);
    return this.createResponse(response.data);
  }

  async updateGlobalVariables(workspace_id: string, variables: Array<{
    key: string;
    value: string;
    type?: 'default' | 'secret';
    enabled?: boolean;
  }>): Promise<ToolCallResponse> {
    if (!workspace_id) {
      throw new McpError(ErrorCode.InvalidParams, 'workspace_id is required');
    }
    if (!Array.isArray(variables)) {
      throw new McpError(ErrorCode.InvalidParams, 'variables must be an array');
    }
    const response = await this.client.put(
      `/workspaces/${workspace_id}/global-variables`,
      { variables }
    );
    return this.createResponse(response.data);
  }

  async getWorkspaceRoles(workspace_id: string, includeScimQuery?: boolean): Promise<ToolCallResponse> {
    if (!workspace_id) {
      throw new McpError(ErrorCode.InvalidParams, 'workspace_id is required');
    }
    const response = await this.client.get(`/workspaces/${workspace_id}/roles`, {
      params: { includeScimQuery }
    });
    return this.createResponse(response.data);
  }

  async updateWorkspaceRoles(
    workspace_id: string,
    operations: Array<{
      op: 'update';
      path: '/user' | '/group' | '/team';
      value: Array<{
        id: number;
        role: 'VIEWER' | 'EDITOR';
      }>;
    }>,
    identifierType?: string
  ): Promise<ToolCallResponse> {
    if (!workspace_id) {
      throw new McpError(ErrorCode.InvalidParams, 'workspace_id is required');
    }
    if (!Array.isArray(operations)) {
      throw new McpError(ErrorCode.InvalidParams, 'operations must be an array');
    }
    if (operations.length > 50) {
      throw new McpError(ErrorCode.InvalidParams, 'Maximum 50 role operations allowed per request');
    }

    const response = await this.client.patch(
      `/workspaces/${workspace_id}/roles`,
      { operations },
      { params: { identifierType } }
    );
    return this.createResponse(response.data);
  }

  async getAllWorkspaceRoles(): Promise<ToolCallResponse> {
    const response = await this.client.get('/workspaces-roles');
    return this.createResponse(response.data);
  }
}
