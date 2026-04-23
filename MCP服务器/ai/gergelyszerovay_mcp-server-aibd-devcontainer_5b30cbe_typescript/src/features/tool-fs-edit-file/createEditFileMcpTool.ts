import type { McpTool } from "@shared/mcp-tool/McpTool";
import { EditFileInputSchema } from "./internal/EditFileInputSchema";
import { editFileMcpToolHandler } from "./internal/editFileMcpToolHandler";

/**
 * Creates and returns the edit_file MCP tool configuration
 *
 * @returns Array containing the edit_file MCP tool configuration
 */
export function createEditFileMcpTool(): McpTool[] {
  return [
    {
      name: "edit_file",
      description:
        "Make line-based edits to a text file. Each edit replaces exact line sequences " +
        "with new content. Returns a git-style diff showing the changes made. " +
        "Only works within allowed directories.",
      inputSchema: EditFileInputSchema,
      inputSchemaName: "EditFileInputSchema",
      outputTypes: ["text"],
      handler: editFileMcpToolHandler,
      enabledInModes: ["rest", "mcpAct"],
    },
  ];
}
