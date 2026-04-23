import type { TextContent } from "@modelcontextprotocol/sdk/types.js";
import { McpToolError } from "@shared/mcp-tool/McpToolError";
import { validatePath } from "@shared/fs-helpers/validatePath";
import { getFileStats } from "@shared/fs-helpers/getFileStats";
import type { GetFileInfoInput } from "./GetFileInfoInputSchema";

type GetFileInfoMcpToolHandlerParams = {
  params: GetFileInfoInput;
};

/**
 * Handler for the get_file_info MCP tool
 * Retrieves detailed metadata about a file or directory
 * 
 * @param params - Tool parameters including the file path
 * @returns Formatted file information or an error
 */
export async function getFileInfoMcpToolHandler({
  params,
}: GetFileInfoMcpToolHandlerParams): Promise<Array<TextContent> | McpToolError> {
  try {
    // Validate the path is within allowed directories
    const validPath = await validatePath(params.path);
    
    // Get the file stats
    const info = await getFileStats(validPath);
    
    // Format the info as key-value pairs
    const formatted = Object.entries(info)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    
    return [{ type: "text", text: formatted }];
  } catch (error) {
    // Handle error cases with appropriate messages
    if (error instanceof Error) {
      const errorMessage = error.message || "Unknown error";
      if (errorMessage.includes("Access denied")) {
        return new McpToolError(`Security error: ${errorMessage}`);
      } else if (errorMessage.includes("ENOENT")) {
        return new McpToolError(`File or directory not found: ${params.path}`);
      } else if (errorMessage.includes("EACCES")) {
        return new McpToolError(`Permission denied: Cannot access ${params.path}`);
      } else {
        return new McpToolError(`Error getting file info: ${errorMessage}`);
      }
    }
    
    return new McpToolError("An unexpected error occurred while getting file information");
  }
}
