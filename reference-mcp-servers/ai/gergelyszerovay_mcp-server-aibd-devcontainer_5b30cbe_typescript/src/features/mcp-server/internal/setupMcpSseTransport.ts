import { getAppState } from "@features/app-state/getAppState";
import express from "express";

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

export function setupMcpSseTransport(server: Server): void {
  const appState = getAppState();
  const app = express();
  let sseTransport: SSEServerTransport | undefined = undefined;

  app.use(express.json());

  // SSE endpoint for MCP communication
  app.get("/sse", (req, res) => {
    sseTransport = new SSEServerTransport("/messages", res);
    server.connect(sseTransport);
  });

  // Message handling endpoint
  app.post("/messages", (req, res) => {
    if (sseTransport) {
      sseTransport.handlePostMessage(req, res, req.body);
    } else {
      res.status(400).json({ error: "No active SSE connection" });
    }
  });

  // Get the most current application state for the port
  const { mcpHttpPort } = getAppState();
  
  app.listen(mcpHttpPort, () => {
    console.warn(`HTTP server listening on port ${mcpHttpPort}`);
  });
}
