import type { McpTool } from "@shared/mcp-tool/McpTool";
import { ListAllowedDirectoriesInputSchema } from "./internal/ListAllowedDirectoriesInputSchema";
import { listAllowedDirectoriesMcpToolHandler } from "./internal/listAllowedDirectoriesMcpToolHandler";

/**
 * Creates and returns the list_allowed_directories MCP tool configuration
 *
 * @returns Array containing the list_allowed_directories MCP tool configuration
 */
export function createListAllowedDirectoriesMcpTool(): McpTool[] {
  return [
    {
      name: "list_allowed_directories",
      description:
        "Returns the list of directories that this server is allowed to access. " +
        "Use this to understand which directories are available before trying to access files.",
      inputSchema: ListAllowedDirectoriesInputSchema,
      inputSchemaName: "ListAllowedDirectoriesInputSchema",
      outputTypes: ["text"],
      handler: listAllowedDirectoriesMcpToolHandler,
      enabledInModes: ["rest", "mcpAct", "mcpPlan"],
    },
  ];
}
