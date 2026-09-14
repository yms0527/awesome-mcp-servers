import type { McpTool } from "@shared/mcp-tool/McpTool";
import { MoveFileInputSchema } from "./internal/MoveFileInputSchema";
import { moveFileMcpToolHandler } from "./internal/moveFileMcpToolHandler";

/**
 * Creates and returns the move_file MCP tool configuration
 *
 * @returns Array containing the move_file MCP tool configuration
 */
export function createMoveFileMcpTool(): McpTool[] {
  return [
    {
      name: "move_file",
      description:
        "Move or rename files and directories. Can move files between directories " +
        "and rename them in a single operation. If the destination exists, the " +
        "operation will fail. Works across different directories and can be used " +
        "for simple renaming within the same directory. Both source and destination must be within allowed directories.",
      inputSchema: MoveFileInputSchema,
      inputSchemaName: "MoveFileInputSchema",
      outputTypes: ["text"],
      handler: moveFileMcpToolHandler,
      enabledInModes: ["rest", "mcpAct"],
    },
  ];
}
