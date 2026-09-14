import { getAppState } from "@features/app-state/getAppState";
import type { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { setupMcpSseTransport } from "./internal/setupMcpSseTransport";

export async function setupMcpTransports(server: Server) {
  const appState = getAppState();
  if (appState.enableStdioTransport) {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("MCP server running on stdio");
  }

  if (appState.enableHttpTransport) {
    setupMcpSseTransport(server);
  }
}
