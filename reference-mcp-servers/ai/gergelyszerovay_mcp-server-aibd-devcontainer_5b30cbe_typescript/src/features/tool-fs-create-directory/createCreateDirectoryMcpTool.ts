import type { McpTool } from "@shared/mcp-tool/McpTool";
import { CreateDirectoryInputSchema } from "./internal/CreateDirectoryInputSchema";
import { createDirectoryMcpToolHandler } from "./internal/createDirectoryMcpToolHandler";

/**
 * Creates and returns the create_directory MCP tool configuration
 *
 * @returns Array containing the create_directory MCP tool configuration
 */
export function createCreateDirectoryMcpTool(): McpTool[] {
  return [
    {
      name: "create_directory",
      description:
        "Create a new directory or ensure a directory exists. Can create multiple " +
        "nested directories in one operation. If the directory already exists, " +
        "this operation will succeed silently. Perfect for setting up directory " +
        "structures for projects or ensuring required paths exist. Only works within allowed directories.",
      inputSchema: CreateDirectoryInputSchema,
      inputSchemaName: "CreateDirectoryInputSchema",
      outputTypes: ["text"],
      handler: createDirectoryMcpToolHandler,
      enabledInModes: ["rest", "mcpAct"],
    },
  ];
}
