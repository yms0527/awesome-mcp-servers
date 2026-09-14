import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerReinstallServerTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "reinstall_server",
    {
      description:
        "Reinstall a server's egg/template (admin action). WARNING: This wipes ALL server files and reinstalls from scratch. All player data, configs, and world files will be permanently deleted. Consider create_backup before proceeding. Requires Application API key.",
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
        await client.reinstallServer(params.server_id);

        return formatToolResponse({
          success: true,
          message: `Server ${params.server_id} reinstall initiated.`,
          server_id: params.server_id,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
