import type { TextContent } from "@modelcontextprotocol/sdk/types.js";
import { McpToolError } from "@shared/mcp-tool/McpToolError";
import { getAllowedDirectories } from "@shared/fs-helpers/getAllowedDirectories";
import type { ListAllowedDirectoriesInput } from "./ListAllowedDirectoriesInputSchema";

type ListAllowedDirectoriesMcpToolHandlerParams = {
  params: ListAllowedDirectoriesInput;
};

/**
 * Handler for the list_allowed_directories MCP tool
 * Returns the list of directories that this server is allowed to access
 * 
 * @param params - Tool parameters (empty for this tool)
 * @returns List of allowed directories or an error
 */
export async function listAllowedDirectoriesMcpToolHandler({
  params,
}: ListAllowedDirectoriesMcpToolHandlerParams): Promise<Array<TextContent> | McpToolError> {
  try {
    // Get the list of allowed directories
    const allowedDirectories = getAllowedDirectories();
    
    // Format the list
    const formattedList = `Allowed directories:\n${allowedDirectories.join('\n')}`;
    
    return [{ type: "text", text: formattedList }];
  } catch (error) {
    // Handle any unexpected errors
    if (error instanceof Error) {
      return new McpToolError(`Error listing allowed directories: ${error.message}`);
    }
    
    return new McpToolError("An unexpected error occurred while listing allowed directories");
  }
}
