import type { TextContent } from "@modelcontextprotocol/sdk/types.js";
import { McpToolError } from "@shared/mcp-tool/McpToolError";
import fs from "fs/promises";
import { validatePath } from "@shared/fs-helpers/validatePath";
import type { DeleteMultipleFilesInput } from "./DeleteMultipleFilesInputSchema";

type DeleteMultipleFilesMcpToolHandlerParams = {
  params: DeleteMultipleFilesInput;
};

/**
 * Result for a single file deletion attempt
 */
type FileOperationResult = {
  path: string;
  success: boolean;
  error?: string;
};

/**
 * Handler for the delete_multiple_files MCP tool
 * Deletes multiple files in a single operation
 * 
 * @param params - Tool parameters including the file paths
 * @returns Report of deletion results or an error
 */
export async function deleteMultipleFilesMcpToolHandler({
  params,
}: DeleteMultipleFilesMcpToolHandlerParams): Promise<Array<TextContent> | McpToolError> {
  try {
    // Process each path in parallel and collect results
    const results: FileOperationResult[] = await Promise.all(
      params.paths.map(async (filePath: string): Promise<FileOperationResult> => {
        try {
          // Validate the path is within allowed directories
          const validPath = await validatePath(filePath);
          
          // Try to delete the file
          await fs.unlink(validPath);
          
          // Return success
          return { path: filePath, success: true };
        } catch (error) {
          // Handle errors for individual files without failing the whole operation
          const errorMessage = error instanceof Error ? error.message : String(error);
          return { 
            path: filePath, 
            success: false, 
            error: errorMessage 
          };
        }
      })
    );
    
    // Count successes and failures
    const succeeded = results.filter(r => r.success).length;
    const failed = results.length - succeeded;
    
    // Format the results report
    const report = [
      `Delete operation summary: ${succeeded} file(s) deleted, ${failed} file(s) failed`,
      '',
      ...results.map(result => {
        if (result.success) {
          return `✅ ${result.path}: Successfully deleted`;
        } else {
          return `❌ ${result.path}: Failed - ${result.error}`;
        }
      })
    ].join('\n');
    
    return [{ type: "text", text: report }];
  } catch (error) {
    // Handle unexpected errors in the overall process
    if (error instanceof Error) {
      return new McpToolError(`Error deleting files: ${error.message}`);
    }
    
    return new McpToolError("An unexpected error occurred while deleting files");
  }
}
