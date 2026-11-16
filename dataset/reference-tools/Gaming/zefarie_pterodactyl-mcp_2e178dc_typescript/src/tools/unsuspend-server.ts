import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerUnsuspendServerTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "unsuspend_server",
    {
      description:
        "Unsuspend a previously suspended server (admin action). Re-enables the server so users can start and use it again. Idempotent: calling on a non-suspended server has no effect. Requires Application API key.",
      inputSchema: z.object({
        server_id: z
          .number()
          .int()
          .positive()
          .describe("Numeric server ID from list_servers field 'id'"),
      }),
      annotations: { destructiveHint: true, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        await client.unsuspendServer(params.server_id);

        return formatToolResponse({
          success: true,
          message: `Server ${params.server_id} has been unsuspended.`,
          server_id: params.server_id,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
