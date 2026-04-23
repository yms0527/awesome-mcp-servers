import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { PterodactylClient } from "./client/pterodactyl.client.js";
import { countTools, createServer } from "./server.js";

function loadConfig(): {
  baseUrl: string;
  appKey: string;
  clientKey?: string;
  allowInsecure: boolean;
} {
  const baseUrl = process.env.PTERODACTYL_URL;
  const appKey = process.env.PTERODACTYL_APP_KEY;
  const clientKey = process.env.PTERODACTYL_CLIENT_KEY;

  if (!baseUrl) {
    console.error("Error: PTERODACTYL_URL environment variable is required.");
    process.exit(1);
  }

  if (!appKey) {
    console.error("Error: PTERODACTYL_APP_KEY environment variable is required.");
    process.exit(1);
  }

  return {
    baseUrl,
    appKey,
    clientKey: clientKey || undefined,
    allowInsecure: process.env.PTERODACTYL_ALLOW_INSECURE === "true",
  };
}

async function healthCheck(
  client: PterodactylClient,
  baseUrl: string,
  toolsCount: number,
): Promise<void> {
  try {
    const result = await client.listServers({ page: 1, per_page: 1 });
    const total = result.pagination.total;
    console.error(
      `Connected to ${baseUrl} - ${total} server${total !== 1 ? "s" : ""} found - ${toolsCount} tools available`,
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      `Warning: Health check failed for ${baseUrl} - ${message}. The MCP server will start anyway, but API calls may fail. Verify PTERODACTYL_URL and PTERODACTYL_APP_KEY are correct.`,
    );
  }
}

async function main(): Promise<void> {
  const config = loadConfig();
  const client = new PterodactylClient(config);
  const hasClientKey = !!config.clientKey;
  const toolsCount = countTools(hasClientKey);
  const server = createServer(client);
  const transport = new StdioServerTransport();

  await server.connect(transport);

  const mode = hasClientKey ? "dual-key (admin + client)" : "app-key only (admin)";
  console.error(`Pterodactyl MCP Server running on stdio [${mode}]`);

  await healthCheck(client, config.baseUrl, toolsCount);
}

main().catch((error: unknown) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
