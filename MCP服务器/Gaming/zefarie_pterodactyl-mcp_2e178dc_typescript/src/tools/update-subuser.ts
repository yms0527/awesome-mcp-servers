import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerUpdateSubuserTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "update_subuser",
    {
      description:
        "Update the permissions of an existing sub-user on a server. This replaces ALL permissions, so include every permission the user should have. Use list_subusers to find the user UUID and see current permissions. Requires Client API key.",
      inputSchema: z.object({
        server_identifier: z
          .string()
          .min(1)
          .describe(
            "Short server identifier string from list_servers field 'identifier' (e.g., 'a1b2c3d4')",
          ),
        user_uuid: z.string().min(1).describe("UUID of the sub-user from list_subusers"),
        permissions: z
          .array(z.string().min(1))
          .min(1)
          .describe(
            "Complete list of permission strings to set (replaces all existing permissions)",
          ),
      }),
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const result = await client.updateSubuser(params.server_identifier, params.user_uuid, {
          permissions: params.permissions,
        });

        return formatToolResponse({
          server_identifier: params.server_identifier,
          subuser: result,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
