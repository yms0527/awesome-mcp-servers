#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import http from "node:http";

import { registerDeployTool } from "./tools/deploy.js";
import { registerCheckTool } from "./tools/check.js";
import { registerStatusTool } from "./tools/status.js";
import { registerSitesTool } from "./tools/sites.js";
import { registerDomainTools } from "./tools/domains.js";
import { health } from "./client.js";
import { z } from "zod";

function createServer(): McpServer {
  const server = new McpServer({
    name: "sitelauncher",
    version: "1.0.0",
  });

  registerDeployTool(server);
  registerCheckTool(server);
  registerStatusTool(server);
  registerSitesTool(server);
  registerDomainTools(server);

  server.registerTool("health", {
    description: "Check SiteLauncher service health and whether dry_run mode is active.",
    inputSchema: {},
  }, async () => {
    try {
      const result = await health();
      const lines = [
        `SiteLauncher Health:`,
        `Status: ${result.status}`,
        `Parent domain: ${result.parent_domain}`,
        `Dry run: ${result.dry_run}`,
        `Services: ${result.services.join(", ")}`,
      ];
      return { content: [{ type: "text" as const, text: lines.join("\n") }] };
    } catch (err) {
      return {
        content: [{ type: "text" as const, text: `Error: ${err instanceof Error ? err.message : String(err)}` }],
        isError: true,
      };
    }
  });

  return server;
}

// Transport selection
if (process.argv.includes("--stdio")) {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
} else {
  const PORT = parseInt(process.env.MCP_PORT || "3100", 10);

  const httpServer = http.createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, Mcp-Session-Id");
    res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url || "/", `http://localhost:${PORT}`);
    if (url.pathname !== "/mcp") {
      if (url.pathname === "/") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          name: "sitelauncher-mcp",
          version: "1.0.0",
          mcp_endpoint: "/mcp",
          transport: "streamable-http",
        }));
        return;
      }
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    // Create fresh server + transport per request (stateless)
    const server = createServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    await server.connect(transport);

    if (req.method === "POST") {
      let body = "";
      for await (const chunk of req) {
        body += chunk;
      }
      const parsed = JSON.parse(body);
      await transport.handleRequest(req, res, parsed);
    } else {
      await transport.handleRequest(req, res);
    }
  });

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`SiteLauncher MCP server running on http://0.0.0.0:${PORT}/mcp`);
    console.log(`Transport: Streamable HTTP (stateless)`);
    console.log(`API: ${process.env.SITELAUNCHER_API_URL || "https://sitelauncher.xyz/api"}`);
  });
}
