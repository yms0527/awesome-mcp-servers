import type { McpTool } from "@shared/mcp-tool/McpTool";
import { ShellExecInputSchema } from "./internal/ShellExecInputSchema";
import { ShellExecOutputSchema } from "./internal/ShellExecOutputSchema";
import { shellExecMcpToolHandler } from "./internal/shellExecMcpToolHandler";

/**
 * Creates and returns the shell_exec MCP tool configuration
 *
 * @returns Array containing the shell_exec MCP tool configuration
 */
export function createShellExecMcpTool(): McpTool[] {
  return [
    {
      name: "shell_exec",
      description:
        "Execute commands in the shell and return the output as structured data. " +
        "Returns stdout and stderr as separate properties in a JSON object, along with the command's exit code. " +
        "Only available when the server is started with the --enableShellExecTool flag. " +
        "This tool must be used responsibly and securely.",
      inputSchema: ShellExecInputSchema,
      inputSchemaName: "ShellExecInputSchema",
      outputTypes: ["json"],
      jsonOutputSchema: ShellExecOutputSchema,
      jsonOutputSchemaName: "ShellExecOutputSchema",
      handler: shellExecMcpToolHandler,
      enabledInModes: ["rest", "mcpAct"], // Only available in execution mode, not planning
    },
  ];
}
