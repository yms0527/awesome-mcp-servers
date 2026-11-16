import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerCreateDatabaseTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "create_database",
    {
      description:
        "Create a new MySQL database for a server. 'remote' controls which hosts can connect (% = any host). The server must have available database slots (check feature_limits.databases from list_servers). Use list_client_databases to see existing databases. Requires Client API key.",
      inputSchema: z.object({
        server_identifier: z
          .string()
          .min(1)
          .describe(
            "Short server identifier string from list_servers field 'identifier' (e.g., 'a1b2c3d4')",
          ),
        database: z
          .string()
          .min(1)
          .describe("Name for the new database (will be prefixed with server ID by the panel)"),
        remote: z
          .string()
          .optional()
          .describe(
            "Allowed remote connection host (default: '%' for any host). Use a specific IP to restrict access.",
          ),
      }),
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const result = await client.createClientDatabase(params.server_identifier, {
          database: params.database,
          remote: params.remote ?? "%",
        });

        return formatToolResponse({
          server_identifier: params.server_identifier,
          database: result,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
