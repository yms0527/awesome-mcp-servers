import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerListRolesTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "list_roles",
    {
      description:
        "List all admin roles defined on the panel (admin action). Returns role ID, name, and timestamps. Roles control admin panel access permissions. Requires Application API key.",
      inputSchema: z.object({}),
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async () => {
      try {
        const result = await client.listRoles();
        return formatToolResponse({
          roles: result.roles,
          count: result.roles.length,
          pagination: result.pagination,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
