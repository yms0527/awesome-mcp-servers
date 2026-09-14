import type { AppState } from "@features/app-state/AppState";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";

export function createMcpServer(appState: AppState) {
  const server = new Server(
    {
      name: "ts-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  server.onerror = (error) => {
    console.error("[MCP Error]", error);
  };

  return server;
}
