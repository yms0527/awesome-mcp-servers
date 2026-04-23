/**
 * Returns the usage text for the CLI help message
 *
 * @returns Formatted usage text string
 */
export function getUsageText(): string {
  return `
MCP server with filesystem tools.

Options
  --enableHttpTransport         Enable HTTP transport [default: false]
  --enableStdioTransport        Enable stdio transport [default: true]
  --enableRestServer            Enable REST API server [default: false]
  --enableShellExecTool              Enable shell execution tool [default: false]
  --mcpHttpPort=<port>          Port for MCP HTTP server [default: 3001]
  --restHttpPort=<port>         Port for REST HTTP server [default: 3002]
  --allowedDirectories=<path>   Allowed directories for filesystem access (multiple, required)
  --initialMode=<mode>          Initial operation mode: mcpAct or mcpPlan [default: mcpAct]
  --help                        Show this help message

Examples
  $ mcp-fs --allowedDirectories=. --enableHttpTransport
  $ mcp-fs --allowedDirectories=/home/user/projects --mcpHttpPort=3005 --restHttpPort=3006
  $ mcp-fs --allowedDirectories=/path/to/dir1 --allowedDirectories=/path/to/dir2
  $ mcp-fs --allowedDirectories=. --initialMode=mcpPlan
`;
}
