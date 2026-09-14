import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerGetScheduleTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "get_schedule",
    {
      description:
        "Get details of a specific scheduled task for a server, including its tasks (actions). Returns schedule name, cron expression, active status, last/next run times, and all associated tasks. Use list_schedules first to find schedule IDs. Requires Client API key.",
      inputSchema: z.object({
        server_identifier: z
          .string()
          .min(1)
          .describe(
            "Short server identifier string from list_servers field 'identifier' (e.g., 'a1b2c3d4')",
          ),
        schedule_id: z
          .number()
          .int()
          .positive()
          .describe("Numeric schedule ID from list_schedules"),
      }),
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const result = await client.getSchedule(params.server_identifier, params.schedule_id);

        return formatToolResponse({
          server_identifier: params.server_identifier,
          schedule: result,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
