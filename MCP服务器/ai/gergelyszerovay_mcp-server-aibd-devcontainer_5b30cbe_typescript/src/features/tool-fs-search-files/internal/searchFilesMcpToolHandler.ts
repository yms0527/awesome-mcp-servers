import type { TextContent } from "@modelcontextprotocol/sdk/types.js";
import { McpToolError } from "@shared/mcp-tool/McpToolError";
import { validatePath } from "@shared/fs-helpers/validatePath";
import { searchFiles } from "@shared/fs-helpers/searchFileSystem";
import type { SearchFilesInput } from "./SearchFilesInputSchema";

type SearchFilesMcpToolHandlerParams = {
  params: SearchFilesInput;
};

/**
 * Handler for the search_files MCP tool
 * Recursively searches for files and directories matching a pattern
 * 
 * @param params - Tool parameters including the search path, pattern, and exclude patterns
 * @returns Search results or an error
 */
export async function searchFilesMcpToolHandler({
  params,
}: SearchFilesMcpToolHandlerParams): Promise<Array<TextContent> | McpToolError> {
  try {
    // Validate the path is within allowed directories
    const validPath = await validatePath(params.path);
    
    // Perform the search
    const results = await searchFiles(
      validPath, 
      params.pattern, 
      params.excludePatterns
    );
    
    // Return the results or a "no matches" message
    if (results.length > 0) {
      return [{ type: "text", text: results.join("\n") }];
    } else {
      return [{ type: "text", text: "No matches found" }];
    }
  } catch (error) {
    // Handle error cases with appropriate messages
    if (error instanceof Error) {
      const errorMessage = error.message || "Unknown error";
      if (errorMessage.includes("Access denied")) {
        return new McpToolError(`Security error: ${errorMessage}`);
      } else if (errorMessage.includes("ENOENT")) {
        return new McpToolError(`Directory not found: ${params.path}`);
      } else if (errorMessage.includes("ENOTDIR")) {
        return new McpToolError(`Not a directory: ${params.path}`);
      } else if (errorMessage.includes("EACCES")) {
        return new McpToolError(`Permission denied: Cannot search in ${params.path}`);
      } else {
        return new McpToolError(`Error searching files: ${errorMessage}`);
      }
    }
    
    return new McpToolError("An unexpected error occurred while searching for files");
  }
}
