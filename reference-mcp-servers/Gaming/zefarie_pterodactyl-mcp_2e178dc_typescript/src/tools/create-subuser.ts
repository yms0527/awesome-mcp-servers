import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerCreateSubuserTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "create_subuser",
    {
      description:
        "Add a sub-user to a server by email. Permissions are strings like 'control.start', 'control.stop', 'control.restart', 'file.read', 'file.create', 'file.update', 'file.delete', 'backup.create', 'backup.read', 'database.read', etc. Use list_subusers to see existing sub-users. Requires Client API key.",
      inputSchema: z.object({
        server_identifier: z
          .string()
          .min(1)
          .describe(
            "Short server identifier string from list_servers field 'identifier' (e.g., 'a1b2c3d4')",
          ),
        email: z.string().email().describe("Email address of the user to add as a sub-user"),
        permissions: z
          .array(z.string().min(1))
          .min(1)
          .describe(
            "List of permission strings (e.g., ['control.start', 'control.stop', 'file.read'])",
          ),
      }),
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const result = await client.createSubuser(params.server_identifier, {
          email: params.email,
          permissions: params.permissions,
        });

        return formatToolResponse({
          server_identifier: params.server_identifier,
          subuser: result,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
