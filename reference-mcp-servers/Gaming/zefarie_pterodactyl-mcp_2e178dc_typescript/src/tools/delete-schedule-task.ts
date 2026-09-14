import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerDeleteScheduleTaskTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "delete_schedule_task",
    {
      description:
        "Remove a task from a schedule. Use get_schedule to see the tasks and their IDs on a schedule before deleting. Requires Client API key.",
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
        task_id: z
          .number()
          .int()
          .positive()
          .describe("Numeric task ID from get_schedule tasks list"),
      }),
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        await client.deleteScheduleTask(
          params.server_identifier,
          params.schedule_id,
          params.task_id,
        );

        return formatToolResponse({
          success: true,
          message: `Task ${params.task_id} has been removed from schedule ${params.schedule_id}.`,
          server_identifier: params.server_identifier,
          schedule_id: params.schedule_id,
          task_id: params.task_id,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
