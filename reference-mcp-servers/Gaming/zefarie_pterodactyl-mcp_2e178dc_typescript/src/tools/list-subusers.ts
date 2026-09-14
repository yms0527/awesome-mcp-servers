import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerListSubusersTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "list_subusers",
    {
      description:
        "List all sub-users who have access to a specific server, including their permissions. Returns UUID, username, email, and permission list for each sub-user. Use to audit who has access to a server. Requires Client API key.",
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
        const result = await client.listSubusers(params.server_identifier);

        return formatToolResponse({
          server_identifier: params.server_identifier,
          subusers: result.users,
          count: result.users.length,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
