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
 * Implements Postman API endpoints for managing APIs, schemas, versions, comments, and tags
 * All API operations require the v10 Accept header
 */
export class ApiTools extends BasePostmanTool implements ToolHandler {
  constructor(existingClient: AxiosInstance) {
    super(null, {
      acceptHeader: 'application/vnd.api.v10+json'
    }, existingClient);
  }

  getToolDefinitions(): ToolDefinition[] {
    return TOOL_DEFINITIONS;
  }

  private createResponse(data: any): ToolCallResponse {
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
    };
  }

  /**
   * Handles tool calls for API-related operations
   * @throws {McpError} With appropriate error code and message
   */
  async handleToolCall(name: string, args: any): Promise<ToolCallResponse> {
    try {
      switch (name) {
        case 'list_apis':
          return await this.listApis(args);
        case 'get_api':
          return await this.getApi(args);
        case 'create_api':
          return await this.createApi(args);
        case 'update_api':
          return await this.updateApi(args);
        case 'delete_api':
          return await this.deleteApi(args.apiId);
        case 'add_api_collection':
          return await this.addApiCollection(args);
        case 'get_api_collection':
          return await this.getApiCollection(args);
        case 'create_api_schema':
          return await this.createApiSchema(args);
        case 'get_api_schema':
          return await this.getApiSchema(args);
        case 'create_api_version':
          return await this.createApiVersion(args);
        case 'get_api_versions':
          return await this.getApiVersions(args);
        case 'get_api_version':
          return await this.getApiVersion(args);
        case 'update_api_version':
          return await this.updateApiVersion(args);
        case 'delete_api_version':
          return await this.deleteApiVersion(args);
        case 'get_api_comments':
          return await this.getApiComments(args);
        case 'create_api_comment':
          return await this.createApiComment(args);
        case 'update_api_comment':
          return await this.updateApiComment(args);
        case 'delete_api_comment':
          return await this.deleteApiComment(args);
        case 'get_api_tags':
          return await this.getApiTags(args.apiId);
        case 'update_api_tags':
          return await this.updateApiTags(args);
        case 'get_api_schema_files':
          return await this.getApiSchemaFiles(args);
        case 'get_schema_file_contents':
          return await this.getSchemaFileContents(args);
        case 'create_update_schema_file':
          return await this.createUpdateSchemaFile(args);
        case 'delete_schema_file':
          return await this.deleteSchemaFile(args);
        case 'sync_collection_with_schema':
          return await this.syncCollectionWithSchema(args);
        case 'get_task_status':
          return await this.getTaskStatus(args);
        default:
          throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
      }
    } catch (error) {
      // Let base class interceptor handle API errors
      throw error;
    }
  }

  /**
   * List all APIs in a workspace
   * @param params Query parameters including workspaceId (required)
   */
  async listApis(params: any): Promise<ToolCallResponse> {
    if (!params.workspaceId) {
      throw new McpError(ErrorCode.InvalidParams, 'workspaceId is required');
    }
    const response = await this.client.get('/apis', { params });
    return this.createResponse(response.data);
  }

  /**
   * Get details of a specific API
   * @param params Parameters including apiId (required)
   */
  async getApi(params: any): Promise<ToolCallResponse> {
    if (!params.apiId) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId is required');
    }
    const response = await this.client.get(`/apis/${params.apiId}`, {
      params: { include: params.include?.join(',') }
    });
    return this.createResponse(response.data);
  }

  /**
   * Create a new API
   * @param data API data including name (required), workspaceId (required)
   */
  async createApi(data: any): Promise<ToolCallResponse> {
    if (!data.name || !data.workspaceId) {
      throw new McpError(ErrorCode.InvalidParams, 'name and workspaceId are required');
    }
    const response = await this.client.post('/apis', data);
    return this.createResponse(response.data);
  }

  /**
   * Update an existing API
   * @param args Parameters including apiId (required)
   */
  async updateApi(args: any): Promise<ToolCallResponse> {
    if (!args.apiId) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId is required');
    }
    const { apiId, ...data } = args;
    const response = await this.client.put(`/apis/${apiId}`, data);
    return this.createResponse(response.data);
  }

  /**
   * Delete an API
   * @param apiId The ID of the API to delete (required)
   */
  async deleteApi(apiId: string): Promise<ToolCallResponse> {
    if (!apiId) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId is required');
    }
    await this.client.delete(`/apis/${apiId}`);
    return this.createResponse({ message: 'API deleted successfully' });
  }

  /**
   * Add a collection to an API
   * @param args Parameters including apiId (required), operationType (required)
   */
  async addApiCollection(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.operationType) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId and operationType are required');
    }
    const { apiId, ...data } = args;
    const response = await this.client.post(`/apis/${apiId}/collections`, data);
    return this.createResponse(response.data);
  }

  /**
   * Get a specific collection from an API
   * @param args Parameters including apiId (required), collectionId (required)
   */
  async getApiCollection(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.collectionId) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId and collectionId are required');
    }
    const { apiId, collectionId, ...params } = args;
    const response = await this.client.get(`/apis/${apiId}/collections/${collectionId}`, { params });
    return this.createResponse(response.data);
  }

  /**
   * Create a schema for an API
   * @param args Parameters including apiId (required), type (required), files (required)
   */
  async createApiSchema(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.type || !args.files) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId, type, and files are required');
    }
    const { apiId, ...data } = args;
    const response = await this.client.post(`/apis/${apiId}/schemas`, data);
    return this.createResponse(response.data);
  }

  /**
   * Get a specific schema from an API
   * @param args Parameters including apiId (required), schemaId (required)
   */
  async getApiSchema(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.schemaId) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId and schemaId are required');
    }
    const { apiId, schemaId, ...params } = args;
    const response = await this.client.get(`/apis/${apiId}/schemas/${schemaId}`, { params });
    return this.createResponse(response.data);
  }

  /**
   * Create a new version of an API
   * @param args Parameters including apiId (required), name (required), schemas (required), collections (required)
   */
  async createApiVersion(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.name || !args.schemas || !args.collections) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId, name, schemas, and collections are required');
    }
    const { apiId, ...data } = args;
    const response = await this.client.post(`/apis/${apiId}/versions`, data);
    return this.createResponse(response.data);
  }

  /**
   * Get all versions of an API
   * @param args Parameters including apiId (required)
   */
  async getApiVersions(args: any): Promise<ToolCallResponse> {
    if (!args.apiId) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId is required');
    }
    const { apiId, ...params } = args;
    const response = await this.client.get(`/apis/${apiId}/versions`, { params });
    return this.createResponse(response.data);
  }

  /**
   * Get a specific version of an API
   * @param args Parameters including apiId (required), versionId (required)
   */
  async getApiVersion(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.versionId) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId and versionId are required');
    }
    const response = await this.client.get(`/apis/${args.apiId}/versions/${args.versionId}`);
    return this.createResponse(response.data);
  }

  /**
   * Update an API version
   * @param args Parameters including apiId (required), versionId (required), name (required)
   */
  async updateApiVersion(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.versionId || !args.name) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId, versionId, and name are required');
    }
    const { apiId, versionId, ...data } = args;
    const response = await this.client.put(`/apis/${apiId}/versions/${versionId}`, data);
    return this.createResponse(response.data);
  }

  /**
   * Delete an API version
   * @param args Parameters including apiId (required), versionId (required)
   */
  async deleteApiVersion(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.versionId) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId and versionId are required');
    }
    await this.client.delete(`/apis/${args.apiId}/versions/${args.versionId}`);
    return this.createResponse({ message: 'API version deleted successfully' });
  }

  /**
   * Get comments for an API
   * @param args Parameters including apiId (required)
   */
  async getApiComments(args: any): Promise<ToolCallResponse> {
    if (!args.apiId) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId is required');
    }
    const { apiId, ...params } = args;
    const response = await this.client.get(`/apis/${apiId}/comments`, { params });
    return this.createResponse(response.data);
  }

  /**
   * Create a new comment on an API
   * @param args Parameters including apiId (required), content (required)
   */
  async createApiComment(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.content) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId and content are required');
    }
    const { apiId, ...data } = args;
    const response = await this.client.post(`/apis/${apiId}/comments`, data);
    return this.createResponse(response.data);
  }

  /**
   * Update an existing API comment
   * @param args Parameters including apiId (required), commentId (required), content (required)
   */
  async updateApiComment(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.commentId || !args.content) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId, commentId, and content are required');
    }
    const response = await this.client.put(
      `/apis/${args.apiId}/comments/${args.commentId}`,
      { content: args.content }
    );
    return this.createResponse(response.data);
  }

  /**
   * Delete an API comment
   * @param args Parameters including apiId (required), commentId (required)
   */
  async deleteApiComment(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.commentId) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId and commentId are required');
    }
    await this.client.delete(`/apis/${args.apiId}/comments/${args.commentId}`);
    return this.createResponse({ message: 'Comment deleted successfully' });
  }

  /**
   * Get tags for an API
   * @param apiId The ID of the API (required)
   */
  async getApiTags(apiId: string): Promise<ToolCallResponse> {
    if (!apiId) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId is required');
    }
    const response = await this.client.get(`/apis/${apiId}/tags`);
    return this.createResponse(response.data);
  }

  /**
   * Update tags for an API
   * @param args Parameters including apiId (required), tags (required)
   */
  async updateApiTags(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.tags) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId and tags are required');
    }
    const response = await this.client.put(
      `/apis/${args.apiId}/tags`,
      { tags: args.tags }
    );
    return this.createResponse(response.data);
  }

  /**
   * Get files in an API schema
   * @param args Parameters including apiId (required), schemaId (required)
   */
  async getApiSchemaFiles(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.schemaId) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId and schemaId are required');
    }
    const { apiId, schemaId, ...params } = args;
    const response = await this.client.get(`/apis/${apiId}/schemas/${schemaId}/files`, { params });
    return this.createResponse(response.data);
  }

  /**
   * Get contents of a schema file
   * @param args Parameters including apiId (required), schemaId (required), filePath (required)
   */
  async getSchemaFileContents(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.schemaId || !args.filePath) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId, schemaId, and filePath are required');
    }
    const { apiId, schemaId, filePath, versionId } = args;
    const response = await this.client.get(
      `/apis/${apiId}/schemas/${schemaId}/files/${filePath}`,
      { params: { versionId } }
    );
    return this.createResponse(response.data);
  }

  /**
   * Create or update a schema file
   * @param args Parameters including apiId (required), schemaId (required), filePath (required), content (required)
   */
  async createUpdateSchemaFile(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.schemaId || !args.filePath || !args.content) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId, schemaId, filePath, and content are required');
    }
    const { apiId, schemaId, filePath, ...data } = args;
    const response = await this.client.put(
      `/apis/${apiId}/schemas/${schemaId}/files/${filePath}`,
      data
    );
    return this.createResponse(response.data);
  }

  /**
   * Delete a schema file
   * @param args Parameters including apiId (required), schemaId (required), filePath (required)
   */
  async deleteSchemaFile(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.schemaId || !args.filePath) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId, schemaId, and filePath are required');
    }
    await this.client.delete(
      `/apis/${args.apiId}/schemas/${args.schemaId}/files/${args.filePath}`
    );
    return this.createResponse({ message: 'Schema file deleted successfully' });
  }

  /**
   * Sync a collection with its schema
   * @param args Parameters including apiId (required), collectionId (required)
   */
  async syncCollectionWithSchema(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.collectionId) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId and collectionId are required');
    }
    const response = await this.client.put(
      `/apis/${args.apiId}/collections/${args.collectionId}/sync-with-schema-tasks`,
      {}
    );
    return this.createResponse(response.data);
  }

  /**
   * Get status of an asynchronous task
   * @param args Parameters including apiId (required), taskId (required)
   */
  async getTaskStatus(args: any): Promise<ToolCallResponse> {
    if (!args.apiId || !args.taskId) {
      throw new McpError(ErrorCode.InvalidParams, 'apiId and taskId are required');
    }
    const response = await this.client.get(`/apis/${args.apiId}/tasks/${args.taskId}`);
    return this.createResponse(response.data);
  }
}
