import { AxiosInstance } from 'axios';
import { Resource, ResourceContent } from './resource.js';

export interface ToolCallContent {
  type: 'text';  // Simplified since we only use 'text' type
  text: string;
}

export interface ToolCallResponse {
  content: ToolCallContent[];
  isError?: boolean;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required: string[];
  };
}

/**
 * Represents a resource that a tool can interact with
 */
export interface ToolResource extends Resource {
  toolName: string;      // Name of the tool that can interact with this resource
  operations: string[];  // List of operations the tool can perform (e.g., ['read', 'write', 'delete'])
}

/**
 * Interface for handling tool-specific resources
 */
export interface ToolResourceHandler {
  /**
   * List all resources that this tool can interact with
   * @returns Promise<ToolResource[]>
   */
  listToolResources(): Promise<ToolResource[]>;

  /**
   * Get details about how a tool can interact with a specific resource
   * @param resourceUri The URI of the resource
   * @returns Promise<ToolResource>
   */
  getToolResourceDetails(resourceUri: string): Promise<ToolResource>;

  /**
   * Validate if a tool can interact with a given resource
   * @param resourceUri The URI of the resource
   * @returns Promise<boolean>
   */
  canHandleResource(resourceUri: string): Promise<boolean>;
}

/**
 * Interface for handling tool operations
 * Note: The HTTP client implementation is considered an implementation detail
 * and should not be exposed through the interface
 */
export interface ToolHandler extends ToolResourceHandler {
  getToolDefinitions(): ToolDefinition[];
  handleToolCall(name: string, args: unknown): Promise<ToolCallResponse>;
}
