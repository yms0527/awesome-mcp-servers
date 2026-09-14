import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerListClientDatabasesTool(
  server: McpServer,
  client: PterodactylClient,
): void {
  server.registerTool(
    "list_client_databases",
    {
      description:
        "List databases attached to a server from the client/user perspective. Returns database name, host, and connection details. For admin-level database management, use list_server_databases instead. Requires Client API key.",
      inputSchema: z.object({
        server_identifier: z
          .string()
          .min(1)
          .describe(
            "Short server identifier string from list_servers field 'identifier' (e.g., 'a1b2c3d4')",
          ),
      }),
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const result = await client.listClientDatabases(params.server_identifier);

        return formatToolResponse({
          server_identifier: params.server_identifier,
          databases: result.databases,
          count: result.databases.length,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
