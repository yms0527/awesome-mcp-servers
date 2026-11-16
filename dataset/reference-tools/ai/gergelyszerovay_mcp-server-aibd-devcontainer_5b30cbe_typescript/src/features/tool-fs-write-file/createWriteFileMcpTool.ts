import type { McpTool } from "@shared/mcp-tool/McpTool";
import { WriteFileInputSchema } from "./internal/WriteFileInputSchema";
import { writeFileMcpToolHandler } from "./internal/writeFileMcpToolHandler";

/**
 * Creates and returns the write_file MCP tool configuration
 *
 * @returns Array containing the write_file MCP tool configuration
 */
export function createWriteFileMcpTool(): McpTool[] {
  return [
    {
      name: "write_file",
      description:
        "Create a new file or completely overwrite an existing file with new content. " +
        "Use with caution as it will overwrite existing files without warning. " +
        "Handles text content with proper encoding. Only works within allowed directories.",
      inputSchema: WriteFileInputSchema,
      inputSchemaName: "WriteFileInputSchema",
      outputTypes: ["text"],
      handler: writeFileMcpToolHandler,
      enabledInModes: ["rest", "mcpAct"],
    },
  ];
}
