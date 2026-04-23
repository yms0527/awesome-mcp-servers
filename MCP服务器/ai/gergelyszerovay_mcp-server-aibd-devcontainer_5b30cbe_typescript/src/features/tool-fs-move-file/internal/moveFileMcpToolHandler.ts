import type { TextContent } from "@modelcontextprotocol/sdk/types.js";
import { McpToolError } from "@shared/mcp-tool/McpToolError";
import fs from "fs/promises";
import { validatePath } from "@shared/fs-helpers/validatePath";
import type { MoveFileInput } from "./MoveFileInputSchema";

type MoveFileMcpToolHandlerParams = {
  params: MoveFileInput;
};

/**
 * Handler for the move_file MCP tool
 * Moves or renames files and directories
 * 
 * @param params - Tool parameters including the source and destination paths
 * @returns Success message or an error
 */
export async function moveFileMcpToolHandler({
  params,
}: MoveFileMcpToolHandlerParams): Promise<Array<TextContent> | McpToolError> {
  try {
    // Validate both paths are within allowed directories
    const validSourcePath = await validatePath(params.source);
    const validDestPath = await validatePath(params.destination);
    
    // Check if source exists
    try {
      await fs.access(validSourcePath);
    } catch (error) {
      return new McpToolError(`Source not found: ${params.source}`);
    }
    
    // Check if destination already exists
    try {
      await fs.access(validDestPath);
      return new McpToolError(`Destination already exists: ${params.destination}`);
    } catch (error) {
      // This is expected, we want the destination to not exist
    }
    
    // Move the file or directory
    await fs.rename(validSourcePath, validDestPath);
    
    return [{ type: "text", text: `Successfully moved ${params.source} to ${params.destination}` }];
  } catch (error) {
    // Handle error cases with appropriate messages
    if (error instanceof Error) {
      const errorMessage = error.message || "Unknown error";
      if (errorMessage.includes("Access denied")) {
        return new McpToolError(`Security error: ${errorMessage}`);
      } else if (errorMessage.includes("ENOENT")) {
        return new McpToolError(`Source not found: ${params.source}`);
      } else if (errorMessage.includes("EACCES")) {
        return new McpToolError(`Permission denied: Cannot move ${params.source} to ${params.destination}`);
      } else if (errorMessage.includes("EXDEV")) {
        return new McpToolError(`Cannot move between file systems. Try copy and delete instead.`);
      } else {
        return new McpToolError(`Error moving file: ${errorMessage}`);
      }
    }
    
    return new McpToolError("An unexpected error occurred while moving the file");
  }
}
