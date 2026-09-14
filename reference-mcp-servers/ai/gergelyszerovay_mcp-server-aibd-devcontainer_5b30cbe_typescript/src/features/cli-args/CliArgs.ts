/**
 * Command line arguments for application configuration
 */
export type CliArgs = {
  /** Whether to enable HTTP transport */
  enableHttpTransport: boolean;
  /** Whether to enable stdio transport */
  enableStdioTransport: boolean;
  /** Whether to enable REST server */
  enableRestServer: boolean;
  /** Whether to enable shell execution tool */
  enableShellExecTool: boolean;
  /** Port for MCP HTTP server */
  mcpHttpPort: number;
  /** Port for REST HTTP server */
  restHttpPort: number;
  /** Allowed directories for filesystem access */
  allowedDirectories: string[];
  /** Initial operation mode of the server */
  initialMode: "mcpAct" | "mcpPlan";
};
