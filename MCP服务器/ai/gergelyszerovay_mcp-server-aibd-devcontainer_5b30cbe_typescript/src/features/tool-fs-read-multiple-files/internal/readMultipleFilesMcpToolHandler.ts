import type { TextContent } from "@modelcontextprotocol/sdk/types.js";
import { McpToolError } from "@shared/mcp-tool/McpToolError";
import fs from "fs/promises";
import { validatePath } from "@shared/fs-helpers/validatePath";
import type { ReadMultipleFilesInput } from "./ReadMultipleFilesInputSchema";

type ReadMultipleFilesMcpToolHandlerParams = {
  params: ReadMultipleFilesInput;
};

/**
 * Handler for the read_multiple_files MCP tool
 * Reads the complete contents of multiple files from the file system concurrently
 * 
 * @param params - Tool parameters including the file paths
 * @returns The combined file contents or an error
 */
export async function readMultipleFilesMcpToolHandler({
  params,
}: ReadMultipleFilesMcpToolHandlerParams): Promise<Array<TextContent> | McpToolError> {
  try {
    // Process each path in parallel
    const results = await Promise.all(
      params.paths.map(async (filePath: string) => {
        try {
          // Validate the path is within allowed directories
          const validPath = await validatePath(filePath);
          
          // Read the file content
          const content = await fs.readFile(validPath, "utf-8");
          
          return `${filePath}:\n${content}\n`;
        } catch (error) {
          // Handle errors for individual files without failing the whole operation
          const errorMessage = error instanceof Error ? error.message : String(error);
          return `${filePath}: Error - ${errorMessage}`;
        }
      })
    );
    
    // Combine all results with a separator
    const combinedContent = results.join("\n---\n");
    
    return [{ type: "text", text: combinedContent }];
  } catch (error) {
    // Handle unexpected errors in the overall process
    if (error instanceof Error) {
      return new McpToolError(`Error reading multiple files: ${error.message}`);
    }
    
    return new McpToolError("An unexpected error occurred while reading multiple files");
  }
}
