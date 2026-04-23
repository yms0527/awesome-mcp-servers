import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerListMountsTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "list_mounts",
    {
      description:
        "List all mount points configured on the panel (admin action). Returns mount name, source path, target path, and read-only status. Mounts allow sharing host directories with server containers. Requires Application API key.",
      inputSchema: z.object({}),
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async () => {
      try {
        const result = await client.listMounts();
        return formatToolResponse({
          mounts: result.mounts,
          count: result.mounts.length,
          pagination: result.pagination,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
