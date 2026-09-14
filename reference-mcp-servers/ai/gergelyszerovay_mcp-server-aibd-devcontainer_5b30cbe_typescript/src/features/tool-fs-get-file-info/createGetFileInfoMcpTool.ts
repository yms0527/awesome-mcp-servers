import type { McpTool } from "@shared/mcp-tool/McpTool";
import { GetFileInfoInputSchema } from "./internal/GetFileInfoInputSchema";
import { getFileInfoMcpToolHandler } from "./internal/getFileInfoMcpToolHandler";

/**
 * Creates and returns the get_file_info MCP tool configuration
 *
 * @returns Array containing the get_file_info MCP tool configuration
 */
export function createGetFileInfoMcpTool(): McpTool[] {
  return [
    {
      name: "get_file_info",
      description:
        "Retrieve detailed metadata about a file or directory. Returns comprehensive " +
        "information including size, creation time, last modified time, permissions, " +
        "and type. This tool is perfect for understanding file characteristics " +
        "without reading the actual content. Only works within allowed directories.",
      inputSchema: GetFileInfoInputSchema,
      inputSchemaName: "GetFileInfoInputSchema",
      outputTypes: ["text"],
      handler: getFileInfoMcpToolHandler,
      enabledInModes: ["rest", "mcpAct", "mcpPlan"],
    },
  ];
}
