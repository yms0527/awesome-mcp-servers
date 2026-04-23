import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerDeleteDatabaseTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "delete_database",
    {
      description:
        "Delete a MySQL database from a server. WARNING: This permanently destroys the database and all its data. Use list_client_databases to find the database ID. Consider creating a backup first. Requires Client API key.",
      inputSchema: z.object({
        server_identifier: z
          .string()
          .min(1)
          .describe(
            "Short server identifier string from list_servers field 'identifier' (e.g., 'a1b2c3d4')",
          ),
        database_id: z.string().min(1).describe("Database ID from list_client_databases"),
      }),
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        await client.deleteClientDatabase(params.server_identifier, params.database_id);

        return formatToolResponse({
          success: true,
          message: `Database ${params.database_id} has been deleted.`,
          server_identifier: params.server_identifier,
          database_id: params.database_id,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
