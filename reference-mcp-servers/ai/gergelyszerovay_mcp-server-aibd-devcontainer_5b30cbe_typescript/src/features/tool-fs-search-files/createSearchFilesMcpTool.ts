import type { McpTool } from "@shared/mcp-tool/McpTool";
import { SearchFilesInputSchema } from "./internal/SearchFilesInputSchema";
import { searchFilesMcpToolHandler } from "./internal/searchFilesMcpToolHandler";

/**
 * Creates and returns the search_files MCP tool configuration
 *
 * @returns Array containing the search_files MCP tool configuration
 */
export function createSearchFilesMcpTool(): McpTool[] {
  return [
    {
      name: "search_files",
      description:
        "Recursively search for files and directories matching a pattern. " +
        "Searches through all subdirectories from the starting path. The search " +
        "is case-insensitive and matches partial names. Returns full paths to all " +
        "matching items. Great for finding files when you don't know their exact location. " +
        "Only searches within allowed directories.",
      inputSchema: SearchFilesInputSchema,
      inputSchemaName: "SearchFilesInputSchema",
      outputTypes: ["text"],
      handler: searchFilesMcpToolHandler,
      enabledInModes: ["rest", "mcpAct", "mcpPlan"],
    },
  ];
}
