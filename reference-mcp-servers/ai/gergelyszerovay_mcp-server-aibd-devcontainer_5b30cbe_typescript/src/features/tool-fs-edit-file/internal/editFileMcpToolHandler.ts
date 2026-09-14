import type { TextContent } from "@modelcontextprotocol/sdk/types.js";
import { McpToolError } from "@shared/mcp-tool/McpToolError";
import { validatePath } from "@shared/fs-helpers/validatePath";
import { applyFileEdits } from "@shared/fs-helpers/internal/fileEditor";
import type { EditFileInput } from "./EditFileInputSchema";

type EditFileMcpToolHandlerParams = {
  params: EditFileInput;
};

/**
 * Handler for the edit_file MCP tool
 * Makes line-based edits to a text file and returns a git-style diff
 * 
 * @param params - Tool parameters including the file path and edit operations
 * @returns Git-style diff showing the changes or an error
 */
export async function editFileMcpToolHandler({
  params,
}: EditFileMcpToolHandlerParams): Promise<Array<TextContent> | McpToolError> {
  try {
    // Validate the path is within allowed directories
    const validPath = await validatePath(params.path);
    
    // Apply edits and get diff
    const result = await applyFileEdits(
      validPath, 
      params.edits, 
      params.dryRun ?? false
    );
    
    return [{ 
      type: "text", 
      text: params.dryRun
        ? `Dry run - changes not applied:\n${result}`
        : `Successfully applied edits:\n${result}`
    }];
  } catch (error) {
    // Handle error cases with appropriate messages
    if (error instanceof Error) {
      const errorMessage = error.message || "Unknown error";
      if (errorMessage.includes("Access denied")) {
        return new McpToolError(`Security error: ${errorMessage}`);
      } else if (errorMessage.includes("ENOENT")) {
        return new McpToolError(`File not found: ${params.path}`);
      } else if (errorMessage.includes("Could not find exact match")) {
        return new McpToolError(`Edit error: ${errorMessage}`);
      } else {
        return new McpToolError(`Error editing file: ${errorMessage}`);
      }
    }
    
    return new McpToolError("An unexpected error occurred while editing the file");
  }
}
