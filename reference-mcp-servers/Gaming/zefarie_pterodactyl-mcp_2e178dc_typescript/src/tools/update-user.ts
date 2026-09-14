import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerUpdateUserTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "update_user",
    {
      description:
        "Update an existing user account's details: username, email, password, or admin status (admin action). Use list_users or get_user to find the user ID first. Requires Application API key.",
      inputSchema: z.object({
        user_id: z.number().int().positive().describe("User numeric ID"),
        username: z.string().min(1).optional().describe("New username"),
        email: z.string().email().optional().describe("New email address"),
        password: z.string().min(8).optional().describe("New password (min 8 characters)"),
        root_admin: z.boolean().optional().describe("Whether the user is an admin"),
      }),
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const { user_id, ...userData } = params;
        const result = await client.updateUser(user_id, userData);
        return formatToolResponse(result);
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
