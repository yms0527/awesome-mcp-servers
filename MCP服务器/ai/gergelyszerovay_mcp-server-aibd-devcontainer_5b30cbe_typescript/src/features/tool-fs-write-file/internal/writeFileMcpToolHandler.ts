import type { TextContent } from "@modelcontextprotocol/sdk/types.js";
import { McpToolError } from "@shared/mcp-tool/McpToolError";
import fs from "fs/promises";
import { validatePath } from "@shared/fs-helpers/validatePath";
import type { WriteFileInput } from "./WriteFileInputSchema";

type WriteFileMcpToolHandlerParams = {
  params: WriteFileInput;
};

/**
 * Handler for the write_file MCP tool
 * Creates a new file or overwrites an existing file with new content
 * 
 * @param params - Tool parameters including the file path and content
 * @returns Success message or an error
 */
export async function writeFileMcpToolHandler({
  params,
}: WriteFileMcpToolHandlerParams): Promise<Array<TextContent> | McpToolError> {
  try {
    // Validate the path is within allowed directories
    const validPath = await validatePath(params.path);
    
    // Write the content to the file
    await fs.writeFile(validPath, params.content, "utf-8");
    
    return [{ type: "text", text: `Successfully wrote to ${params.path}` }];
  } catch (error) {
    // Handle error cases with appropriate messages
    if (error instanceof Error) {
      const errorMessage = error.message || "Unknown error";
      if (errorMessage.includes("Access denied")) {
        return new McpToolError(`Security error: ${errorMessage}`);
      } else if (errorMessage.includes("ENOENT")) {
        return new McpToolError(`Directory not found: ${errorMessage}`);
      } else if (errorMessage.includes("EACCES")) {
        return new McpToolError(`Permission denied: Cannot write to ${params.path}`);
      } else {
        return new McpToolError(`Error writing file: ${errorMessage}`);
      }
    }
    
    return new McpToolError("An unexpected error occurred while writing the file");
  }
}
