import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

/**
 * Represents a resource that can be exposed through the MCP server
 */
export interface Resource {
  uri: string;           // Unique identifier for the resource
  name: string;          // Human-readable name
  description?: string;  // Optional description
  mimeType?: string;    // Optional MIME type
}

/**
 * Represents a resource template for dynamic resources
 */
export interface ResourceTemplate {
  uriTemplate: string;   // URI template following RFC 6570
  name: string;          // Human-readable name for this type
  description?: string;  // Optional description
  mimeType?: string;    // Optional MIME type for all matching resources
}

/**
 * Represents the content of a resource
 */
export interface ResourceContent {
  uri: string;          // The URI of the resource
  mimeType?: string;    // Optional MIME type
  text?: string;        // For text resources
  blob?: string;        // For binary resources (base64 encoded)
}

/**
 * Interface for handling MCP resources
 */
export interface ResourceHandler {
  /**
   * List all available direct resources
   * @returns Promise<Resource[]>
   * @throws McpError if resources cannot be listed
   */
  listResources(): Promise<Resource[]>;

  /**
   * List all available resource templates
   * @returns Promise<ResourceTemplate[]>
   * @throws McpError if templates cannot be listed
   */
  listResourceTemplates(): Promise<ResourceTemplate[]>;

  /**
   * Read a resource's contents
   * @param uri The URI of the resource to read
   * @returns Promise<ResourceContent[]>
   * @throws McpError if resource cannot be read or URI is invalid
   */
  readResource(uri: string): Promise<ResourceContent[]>;

  /**
   * Validate a resource URI
   * @param uri The URI to validate
   * @returns boolean indicating if URI is valid
   */
  validateUri(uri: string): boolean;

  /**
   * Parse a resource URI into its components
   * @param uri The URI to parse
   * @returns Object containing parsed URI components
   * @throws McpError if URI format is invalid
   */
  parseUri(uri: string): {
    protocol: string;
    resourceType: string;
    params: Record<string, string>;
  };
}

/**
 * Base class for implementing resource handlers
 */
export abstract class BaseResourceHandler implements ResourceHandler {
  abstract listResources(): Promise<Resource[]>;
  abstract listResourceTemplates(): Promise<ResourceTemplate[]>;
  abstract readResource(uri: string): Promise<ResourceContent[]>;

  validateUri(uri: string): boolean {
    try {
      this.parseUri(uri);
      return true;
    } catch {
      return false;
    }
  }

  parseUri(uri: string): {
    protocol: string;
    resourceType: string;
    params: Record<string, string>;
  } {
    const match = uri.match(/^([a-zA-Z]+):\/\/([^/]+)(?:\/(.+))?$/);
    if (!match) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        `Invalid URI format: ${uri}`
      );
    }

    const [, protocol, resourceType, path] = match;
    const params: Record<string, string> = {};

    if (path) {
      const segments = path.split('/');
      segments.forEach((segment, index) => {
        if (segment.startsWith('{') && segment.endsWith('}')) {
          const paramName = segment.slice(1, -1);
          const nextSegment = segments[index + 1];
          if (nextSegment && !nextSegment.startsWith('{')) {
            params[paramName] = nextSegment;
          }
        }
      });
    }

    return { protocol, resourceType, params };
  }
}
