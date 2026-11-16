import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerDeleteServerTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "delete_server",
    {
      description:
        "Permanently delete a server and ALL its data including files, databases, and backups (admin action). WARNING: This action cannot be undone. The server will be removed from the panel entirely. Consider create_backup before proceeding. Requires Application API key.",
      inputSchema: z.object({
        server_id: z
          .number()
          .int()
          .positive()
          .describe("Numeric server ID from list_servers field 'id'"),
      }),
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        await client.deleteServer(params.server_id);

        return formatToolResponse({
          success: true,
          message: `Server ${params.server_id} has been deleted.`,
          server_id: params.server_id,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
