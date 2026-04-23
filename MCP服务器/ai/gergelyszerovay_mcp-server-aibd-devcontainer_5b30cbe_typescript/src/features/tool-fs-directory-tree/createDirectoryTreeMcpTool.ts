import type { McpTool } from "@shared/mcp-tool/McpTool";
import { DirectoryTreeInputSchema } from "./internal/DirectoryTreeInputSchema";
import { directoryTreeMcpToolHandler } from "./internal/directoryTreeMcpToolHandler";

/**
 * Creates and returns the directory_tree MCP tool configuration
 *
 * @returns Array containing the directory_tree MCP tool configuration
 */
export function createDirectoryTreeMcpTool(): McpTool[] {
  return [
    {
      name: "directory_tree",
      description:
        "Get a recursive tree view of files and directories as a JSON structure. " +
        "Each entry includes 'name', 'type' (file/directory), and 'children' for directories. " +
        "Files have no children array, while directories always have a children array (which may be empty). " +
        "Supports optional 'depth' parameter (default: 1) to control recursion depth. " +
        "The output is formatted with 2-space indentation for readability. Only works within allowed directories.",
      inputSchema: DirectoryTreeInputSchema,
      inputSchemaName: "DirectoryTreeInputSchema",
      outputTypes: ["text"],
      handler: directoryTreeMcpToolHandler,
      enabledInModes: ["rest", "mcpAct", "mcpPlan"],
    },
  ];
}
