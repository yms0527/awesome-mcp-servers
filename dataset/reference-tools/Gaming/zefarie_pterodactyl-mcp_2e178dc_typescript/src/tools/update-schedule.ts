import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerUpdateScheduleTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "update_schedule",
    {
      description:
        "Update an existing scheduled task for a server. All cron fields and the name must be provided (this is a full replace). Use get_schedule to see the current values before updating. Requires Client API key.",
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
        name: z.string().min(1).describe("Display name for the schedule"),
        minute: z.string().min(1).describe("Cron minute field (e.g., '0', '*/15', '0,30')"),
        hour: z.string().min(1).describe("Cron hour field (e.g., '*', '3', '0,12')"),
        day_of_week: z
          .string()
          .min(1)
          .describe("Cron day-of-week field (e.g., '*', '1-5' for Mon-Fri)"),
        day_of_month: z
          .string()
          .min(1)
          .describe("Cron day-of-month field (e.g., '*', '1', '1,15')"),
        month: z.string().min(1).describe("Cron month field (e.g., '*', '1-6')"),
        is_active: z
          .boolean()
          .optional()
          .describe("Whether the schedule is active (default: true)"),
        only_when_online: z
          .boolean()
          .optional()
          .describe("Only run when the server is online (default: true)"),
      }),
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const result = await client.updateSchedule(params.server_identifier, params.schedule_id, {
          name: params.name,
          cron_minute: params.minute,
          cron_hour: params.hour,
          cron_day_of_week: params.day_of_week,
          cron_day_of_month: params.day_of_month,
          cron_month: params.month,
          is_active: params.is_active,
          only_when_online: params.only_when_online,
        });

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
