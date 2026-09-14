import type { TextContent } from "@modelcontextprotocol/sdk/types.js";
import { McpToolError } from "@shared/mcp-tool/McpToolError";
import fs from "fs/promises";
import { validatePath } from "@shared/fs-helpers/validatePath";
import type { CreateDirectoryInput } from "./CreateDirectoryInputSchema";

type CreateDirectoryMcpToolHandlerParams = {
  params: CreateDirectoryInput;
};

/**
 * Handler for the create_directory MCP tool
 * Creates a new directory or ensures a directory exists
 * 
 * @param params - Tool parameters including the directory path
 * @returns Success message or an error
 */
export async function createDirectoryMcpToolHandler({
  params,
}: CreateDirectoryMcpToolHandlerParams): Promise<Array<TextContent> | McpToolError> {
  try {
    // Validate the path is within allowed directories
    const validPath = await validatePath(params.path);
    
    // Create the directory with recursive option
    await fs.mkdir(validPath, { recursive: true });
    
    return [{ type: "text", text: `Successfully created directory ${params.path}` }];
  } catch (error) {
    // Handle error cases with appropriate messages
    if (error instanceof Error) {
      const errorMessage = error.message || "Unknown error";
      if (errorMessage.includes("Access denied")) {
        return new McpToolError(`Security error: ${errorMessage}`);
      } else if (errorMessage.includes("EACCES")) {
        return new McpToolError(`Permission denied: Cannot create directory ${params.path}`);
      } else {
        return new McpToolError(`Error creating directory: ${errorMessage}`);
      }
    }
    
    return new McpToolError("An unexpected error occurred while creating the directory");
  }
}
