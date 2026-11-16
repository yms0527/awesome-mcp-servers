import type { McpTool } from "@shared/mcp-tool/McpTool";
import { GetModeInputSchema } from "./internal/GetModeInputSchema";
import { GetModeOutputSchema } from "./internal/GetModeOutputSchema";
import { getModeMcpToolHandler } from "./internal/getModeMcpToolHandler";

/**
 * Creates and returns the GetMode MCP tool configuration
 *
 * @param serverState - The server state object to access mode information
 * @returns Array containing the GetMode MCP tool configuration
 */
export function createGetModeMcpTool(): McpTool[] {
  return [
    {
      name: "get_mode",
      description: "Returns the current operational mode of the server",
      inputSchema: GetModeInputSchema,
      inputSchemaName: "GetModeInputSchema",
      outputTypes: ["text", "json"],
      jsonOutputSchema: GetModeOutputSchema,
      jsonOutputSchemaName: "GetModeOutputSchema",
      handler: getModeMcpToolHandler,
      enabledInModes: ["mcpAct", "mcpPlan"],
    },
  ];
}
