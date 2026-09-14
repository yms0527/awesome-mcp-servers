import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerGetUserTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "get_user",
    {
      description:
        "Get detailed information for a specific user account by numeric ID (admin action). Returns username, email, language, admin status, and timestamps. Use list_users to find the user ID first. Requires Application API key.",
      inputSchema: z.object({
        user_id: z.number().int().positive().describe("User numeric ID"),
      }),
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const result = await client.getUser(params.user_id);
        return formatToolResponse(result);
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
