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
 * Implements Postman Environment API endpoints
 * All environment IDs must be in the format: {ownerId}-{environmentId}
 */
export class EnvironmentTools extends BasePostmanTool implements ToolHandler {
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
        case 'list_environments':
          return await this.listEnvironments(args.workspace);
        case 'get_environment':
          return await this.getEnvironment(args.environmentId);
        case 'create_environment':
          return await this.createEnvironment(args);
        case 'update_environment':
          return await this.updateEnvironment(args);
        case 'delete_environment':
          return await this.deleteEnvironment(args.environmentId);
        case 'fork_environment':
          return await this.createEnvironmentFork(args);
        case 'get_environment_forks':
          return await this.getEnvironmentForks(args);
        case 'merge_environment_fork':
          return await this.mergeEnvironmentFork(args);
        case 'pull_environment':
          return await this.pullEnvironment(args);
        default:
          throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
      }
    } catch (error: any) {
      // Let base class interceptor handle API errors
      throw error;
    }
  }

  /**
   * List all environments in a workspace
   * If workspace not specified, lists environments in "My Workspace"
   */
  async listEnvironments(workspace?: string): Promise<ToolCallResponse> {
    const response = await this.client.get('/environments', {
      params: workspace ? { workspace } : undefined
    });
    return this.createResponse(response.data);
  }

  /**
   * Get details of a specific environment
   * @param environmentId Environment ID in format: {ownerId}-{environmentId}
   */
  async getEnvironment(environmentId: string): Promise<ToolCallResponse> {
    const response = await this.client.get(`/environments/${environmentId}`);
    return this.createResponse(response.data);
  }

  /**
   * Create a new environment in a workspace
   * Creates in "My Workspace" if workspace not specified
   */
  async createEnvironment(args: any): Promise<ToolCallResponse> {
    const response = await this.client.post('/environments', {
      environment: args.environment,
      workspace: args.workspace ? { id: args.workspace, type: 'workspace' } : undefined
    });
    return this.createResponse(response.data);
  }

  /**
   * Update an existing environment
   * @param args.environmentId Environment ID in format: {ownerId}-{environmentId}
   */
  async updateEnvironment(args: any): Promise<ToolCallResponse> {
    const response = await this.client.put(
      `/environments/${args.environmentId}`,
      { environment: args.environment }
    );
    return this.createResponse(response.data);
  }

  /**
   * Delete an environment
   * @param environmentId Environment ID in format: {ownerId}-{environmentId}
   */
  async deleteEnvironment(environmentId: string): Promise<ToolCallResponse> {
    const response = await this.client.delete(`/environments/${environmentId}`);
    return this.createResponse(response.data);
  }

  /**
   * Create a fork of an environment in a workspace
   * @param args.environmentId Environment ID in format: {ownerId}-{environmentId}
   */
  async createEnvironmentFork(args: any): Promise<ToolCallResponse> {
    const response = await this.client.post(`/environments/${args.environmentId}/forks`, {
      forkName: args.label,
      workspace: { id: args.workspace, type: 'workspace' }
    });
    return this.createResponse(response.data);
  }

  /**
   * Get a list of environment forks
   * @param args.environmentId Environment ID in format: {ownerId}-{environmentId}
   */
  async getEnvironmentForks(args: any): Promise<ToolCallResponse> {
    const response = await this.client.get(`/environments/${args.environmentId}/forks`, {
      params: {
        cursor: args.cursor,
        direction: args.direction,
        limit: args.limit,
        sort: args.sort
      }
    });
    return this.createResponse(response.data);
  }

  /**
   * Merge a forked environment back into its parent
   * @param args.environmentId Environment ID in format: {ownerId}-{environmentId}
   * @param args.source Source environment ID in format: {ownerId}-{environmentId}
   * @param args.destination Destination environment ID in format: {ownerId}-{environmentId}
   */
  async mergeEnvironmentFork(args: any): Promise<ToolCallResponse> {
    const response = await this.client.post(`/environments/${args.environmentId}/merges`, {
      source: args.source,
      destination: args.destination,
      deleteSource: args.strategy?.deleteSource
    });
    return this.createResponse(response.data);
  }

  /**
   * Pull changes from parent environment into forked environment
   * @param args.environmentId Environment ID in format: {ownerId}-{environmentId}
   * @param args.source Source environment ID in format: {ownerId}-{environmentId}
   * @param args.destination Destination environment ID in format: {ownerId}-{environmentId}
   */
  async pullEnvironment(args: any): Promise<ToolCallResponse> {
    const response = await this.client.post(`/environments/${args.environmentId}/pulls`, {
      source: args.source,
      destination: args.destination
    });
    return this.createResponse(response.data);
  }
}
