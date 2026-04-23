import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatPagination } from "../lib/pagination.js";
import { formatToolResponse } from "../lib/response.js";

export function registerListUsersTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "list_users",
    {
      description:
        "List all user accounts registered on the panel (admin action). Returns user ID, username, email, language, and admin status. Use to find user IDs needed for create_server (owner) or update_server_details. Supports pagination. Requires Application API key.",
      inputSchema: z.object({
        page: z.number().int().positive().optional().describe("Page number (default: 1)"),
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
        const result = await client.listUsers(params);

        const users = result.users.map((u) => ({
          id: u.id,
          uuid: u.uuid,
          username: u.username,
          email: u.email,
          language: u.language,
          root_admin: u.root_admin,
        }));

        return formatToolResponse({
          users,
          pagination: formatPagination(result.pagination),
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
