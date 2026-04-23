import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerCreateUserTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "create_user",
    {
      description:
        "Create a new user account on the panel (admin action). The user can then be assigned as owner of servers via create_server or update_server_details. SECURITY WARNING: Setting root_admin to true grants FULL panel access. Requires Application API key.",
      inputSchema: z.object({
        username: z.string().min(1).describe("Username for the new account"),
        email: z.string().email().describe("Email address"),
        password: z.string().min(8).describe("Password (min 8 characters)"),
        root_admin: z
          .boolean()
          .optional()
          .default(false)
          .describe(
            "Whether the user is an admin (default: false). WARNING: root admins have full panel access.",
          ),
      }),
      annotations: {
        destructiveHint: true,
        openWorldHint: true,
      },
    },
    async (params) => {
      try {
        const result = await client.createUser({
          username: params.username,
          email: params.email,
          password: params.password,
          root_admin: params.root_admin,
        });

        const response: Record<string, unknown> = { ...result };

        if (params.root_admin) {
          response.warning =
            "Created user with root admin privileges -- this grants full panel access including server creation, deletion, and user management.";
        }

        return formatToolResponse(response);
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
