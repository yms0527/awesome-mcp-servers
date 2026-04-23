import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerListSchedulesTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "list_schedules",
    {
      description:
        "List all scheduled tasks (cron jobs) for a server. Returns schedule name, cron expression, active status, and last/next run times. Use to check automated restarts, backups, or command schedules. Requires Client API key.",
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
        const result = await client.listSchedules(params.server_identifier);

        return formatToolResponse({
          server_identifier: params.server_identifier,
          schedules: result.schedules,
          count: result.schedules.length,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
