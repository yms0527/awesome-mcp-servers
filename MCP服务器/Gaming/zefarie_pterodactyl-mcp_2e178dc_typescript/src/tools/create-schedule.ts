import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerCreateScheduleTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "create_schedule",
    {
      description:
        "Create a scheduled task for a server (e.g., automatic restarts, backups). Uses cron syntax for timing. Use list_schedules to see existing schedules. Common examples: '0 */6 * * *' for every 6 hours, '0 3 * * *' for daily at 3 AM. Requires Client API key.",
      inputSchema: z.object({
        server_identifier: z
          .string()
          .min(1)
          .describe(
            "Short server identifier string from list_servers field 'identifier' (e.g., 'a1b2c3d4')",
          ),
        name: z.string().min(1).describe("Display name for the schedule (e.g., 'Daily Restart')"),
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
          .describe("Whether the schedule is active immediately (default: true)"),
        only_when_online: z
          .boolean()
          .optional()
          .describe("Only run when the server is online (default: true)"),
      }),
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const result = await client.createSchedule(params.server_identifier, {
          name: params.name,
          cron_minute: params.minute,
          cron_hour: params.hour,
          cron_day_of_week: params.day_of_week,
          cron_day_of_month: params.day_of_month,
          cron_month: params.month,
          is_active: params.is_active,
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
