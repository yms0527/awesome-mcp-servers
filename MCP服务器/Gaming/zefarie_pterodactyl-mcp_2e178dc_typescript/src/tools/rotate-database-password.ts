import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerRotateDatabasePasswordTool(
  server: McpServer,
  client: PterodactylClient,
): void {
  server.registerTool(
    "rotate_database_password",
    {
      description:
        "Generate a new random password for a database. Returns the new connection details including the new password. The old password is immediately invalidated. Use list_client_databases to find the database ID. Requires Client API key.",
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
        const result = await client.rotateDatabasePassword(
          params.server_identifier,
          params.database_id,
        );

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
