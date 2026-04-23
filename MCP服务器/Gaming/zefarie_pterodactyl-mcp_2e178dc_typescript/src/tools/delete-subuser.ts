import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerDeleteSubuserTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "delete_subuser",
    {
      description:
        "Remove a sub-user's access to a server. This revokes all their permissions immediately. Use list_subusers to find the user UUID. Requires Client API key.",
      inputSchema: z.object({
        server_identifier: z
          .string()
          .min(1)
          .describe(
            "Short server identifier string from list_servers field 'identifier' (e.g., 'a1b2c3d4')",
          ),
        user_uuid: z.string().min(1).describe("UUID of the sub-user to remove from list_subusers"),
      }),
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        await client.deleteSubuser(params.server_identifier, params.user_uuid);

        return formatToolResponse({
          success: true,
          message: `Sub-user ${params.user_uuid} has been removed from the server.`,
          server_identifier: params.server_identifier,
          user_uuid: params.user_uuid,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
