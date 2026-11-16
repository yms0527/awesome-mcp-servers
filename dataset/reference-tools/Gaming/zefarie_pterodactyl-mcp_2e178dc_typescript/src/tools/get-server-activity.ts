import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerGetServerActivityTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "get_server_activity",
    {
      description:
        "Get the activity/audit log for a server. Shows events like starts, stops, file edits, commands sent, and user actions. Useful for tracking what happened on a server. This endpoint may not be available on all Pterodactyl versions. Requires Client API key.",
      inputSchema: z.object({
        server_identifier: z
          .string()
          .min(1)
          .describe(
            "Short server identifier string from list_servers field 'identifier' (e.g., 'a1b2c3d4')",
          ),
        page: z
          .number()
          .int()
          .positive()
          .optional()
          .describe("Page number for pagination (default: 1)"),
        per_page: z
          .number()
          .int()
          .min(1)
          .max(100)
          .optional()
          .describe("Items per page (default: 50, max: 100)"),
      }),
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const result = await client.getServerActivity(params.server_identifier, {
          page: params.page,
          per_page: params.per_page,
        });
        return formatToolResponse({
          server_identifier: params.server_identifier,
          activities: result.activities,
          count: result.activities.length,
          pagination: result.pagination,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
