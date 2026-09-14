#!/usr/bin/env node

/**
 * musclesworked-mcp — MCP server for the musclesworked.com API.
 *
 * Usage:
 *   musclesworked-mcp --api-key mw_live_...
 *   MUSCLESWORKED_API_KEY=mw_live_... musclesworked-mcp
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { MusclesWorkedClient } from "./client.js";
import { registerTools } from "./tools.js";

function parseArgs(): string {
  const args = process.argv.slice(2);
  const keyIdx = args.indexOf("--api-key");
  if (keyIdx !== -1 && args[keyIdx + 1]) {
    return args[keyIdx + 1];
  }
  const envKey = process.env.MUSCLESWORKED_API_KEY;
  if (envKey) {
    return envKey;
  }
  console.error(
    "Error: API key required.\n\n" +
      "Provide it via --api-key or MUSCLESWORKED_API_KEY env var:\n" +
      "  musclesworked-mcp --api-key mw_live_...\n" +
      "  MUSCLESWORKED_API_KEY=mw_live_... musclesworked-mcp\n\n" +
      "Get your API key at https://musclesworked.com/dashboard",
  );
  process.exit(1);
}

async function main(): Promise<void> {
  const apiKey = parseArgs();
  const baseUrl = process.env.MUSCLESWORKED_API_URL ?? "https://musclesworked.com";

  const client = new MusclesWorkedClient(apiKey, baseUrl);

  const server = new McpServer({
    name: "musclesworked",
    version: "0.1.0",
  });

  registerTools(server, client);

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
