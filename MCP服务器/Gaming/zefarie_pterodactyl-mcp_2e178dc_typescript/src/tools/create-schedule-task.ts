import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerCreateScheduleTaskTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "create_schedule_task",
    {
      description:
        "Add a task to a schedule. Actions: 'command' (console command), 'power' (start/stop/restart/kill), 'backup' (create backup). time_offset delays execution in seconds after the schedule triggers. Use get_schedule to see existing tasks on a schedule. Requires Client API key.",
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
        action: z
          .enum(["command", "power", "backup"])
          .describe(
            "Task action type: 'command' runs a console command, 'power' sends a power signal, 'backup' creates a backup",
          ),
        payload: z
          .string()
          .describe(
            "Action payload: for 'command' the console command text, for 'power' one of start/stop/restart/kill, for 'backup' leave empty string",
          ),
        time_offset: z
          .number()
          .int()
          .min(0)
          .optional()
          .describe(
            "Delay in seconds after the schedule triggers before running this task (default: 0)",
          ),
        continue_on_failure: z
          .boolean()
          .optional()
          .describe(
            "If true, subsequent tasks will still run even if this task fails (default: false)",
          ),
      }),
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const result = await client.createScheduleTask(
          params.server_identifier,
          params.schedule_id,
          {
            action: params.action,
            payload: params.payload,
            time_offset: params.time_offset ?? 0,
            continue_on_failure: params.continue_on_failure,
          },
        );

        return formatToolResponse({
          server_identifier: params.server_identifier,
          schedule_id: params.schedule_id,
          task: result,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
