import type { McpTool } from "@shared/mcp-tool/McpTool";
import { ReadMultipleFilesInputSchema } from "./internal/ReadMultipleFilesInputSchema";
import { readMultipleFilesMcpToolHandler } from "./internal/readMultipleFilesMcpToolHandler";

/**
 * Creates and returns the read_multiple_files MCP tool configuration
 *
 * @returns Array containing the read_multiple_files MCP tool configuration
 */
export function createReadMultipleFilesMcpTool(): McpTool[] {
  return [
    {
      name: "read_multiple_files",
      description:
        "Read the contents of multiple files simultaneously. This is more " +
        "efficient than reading files one by one when you need to analyze " +
        "or compare multiple files. Each file's content is returned with its " +
        "path as a reference. Failed reads for individual files won't stop " +
        "the entire operation. Only works within allowed directories.",
      inputSchema: ReadMultipleFilesInputSchema,
      inputSchemaName: "ReadMultipleFilesInputSchema",
      outputTypes: ["text"],
      handler: readMultipleFilesMcpToolHandler,
      enabledInModes: ["rest", "mcpAct", "mcpPlan"],
    },
  ];
}
