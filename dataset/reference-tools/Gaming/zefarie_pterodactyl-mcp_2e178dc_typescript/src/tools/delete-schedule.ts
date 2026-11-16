import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerDeleteScheduleTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "delete_schedule",
    {
      description:
        "Delete a scheduled task from a server. This removes the schedule and all its associated tasks permanently. Use list_schedules to find the schedule_id. Requires Client API key.",
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
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        await client.deleteSchedule(params.server_identifier, params.schedule_id);

        return formatToolResponse({
          success: true,
          message: `Schedule ${params.schedule_id} has been deleted.`,
          server_identifier: params.server_identifier,
          schedule_id: params.schedule_id,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
