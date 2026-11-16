import type { McpTool } from "@shared/mcp-tool/McpTool";
import { SetModeInputSchema } from "./internal/SetModeInputSchema";
import { SetModeOutputSchema } from "./internal/SetModeOutputSchema";
import { setModeMcpToolHandler } from "./internal/setModeMcpToolHandler";

/**
 * Creates and returns the SetMode MCP tool configuration
 *
 * @param serverState - The server state object to update with the new mode
 * @returns Array containing the SetMode MCP tool configuration
 */
export function createSetModeMcpTool(): McpTool[] {
  return [
    {
      name: "set_mode",
      description: "Updates the server's operational mode",
      inputSchema: SetModeInputSchema,
      inputSchemaName: "SetModeInputSchema",
      outputTypes: ["text", "json"],
      jsonOutputSchema: SetModeOutputSchema,
      jsonOutputSchemaName: "SetModeOutputSchema",
      handler: setModeMcpToolHandler,
      enabledInModes: ["mcpAct", "mcpPlan"],
    },
  ];
}
