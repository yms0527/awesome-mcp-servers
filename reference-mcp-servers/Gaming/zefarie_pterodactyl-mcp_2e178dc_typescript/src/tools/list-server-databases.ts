import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerListServerDatabasesTool(
  server: McpServer,
  client: PterodactylClient,
): void {
  server.registerTool(
    "list_server_databases",
    {
      description:
        "List databases attached to a server from the admin perspective (admin action). Returns database host, name, and connection details. For client-level database access, use list_client_databases instead. Requires Application API key.",
      inputSchema: z.object({
        server_id: z
          .number()
          .int()
          .positive()
          .describe("Numeric server ID from list_servers field 'id'"),
      }),
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const result = await client.listServerDatabases(params.server_id);
        return formatToolResponse({
          server_id: params.server_id,
          databases: result.databases,
          count: result.databases.length,
          pagination: result.pagination,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
