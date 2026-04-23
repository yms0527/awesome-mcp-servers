import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerSuspendServerTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "suspend_server",
    {
      description:
        "Suspend a server (admin action). Suspended servers are forcefully stopped and users cannot start them until unsuspended. Use to disable a server for policy violations or billing issues. Use unsuspend_server to re-enable. Requires Application API key.",
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
        await client.suspendServer(params.server_id);

        return formatToolResponse({
          success: true,
          message: `Server ${params.server_id} has been suspended.`,
          server_id: params.server_id,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
