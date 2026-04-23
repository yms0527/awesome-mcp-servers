import type { McpTool } from "@shared/mcp-tool/McpTool";
import { DeleteMultipleFilesInputSchema } from "./internal/DeleteMultipleFilesInputSchema";
import { deleteMultipleFilesMcpToolHandler } from "./internal/deleteMultipleFilesMcpToolHandler";

/**
 * Creates and returns the delete_multiple_files MCP tool configuration
 *
 * @returns Array containing the delete_multiple_files MCP tool configuration
 */
export function createDeleteMultipleFilesMcpTool(): McpTool[] {
  return [
    {
      name: "delete_multiple_files",
      description:
        "Delete multiple files in a single operation. This tool continues processing " +
        "even if some files cannot be deleted, providing a detailed report of successes " +
        "and failures for each file. Use with caution as deleted files cannot be recovered. " +
        "Only works within allowed directories.",
      inputSchema: DeleteMultipleFilesInputSchema,
      inputSchemaName: "DeleteMultipleFilesInputSchema",
      outputTypes: ["text"],
      handler: deleteMultipleFilesMcpToolHandler,
      enabledInModes: ["rest", "mcpAct"],
    },
  ];
}
