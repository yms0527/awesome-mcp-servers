import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerListNestsTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "list_nests",
    {
      description:
        "List all nests (egg categories) on the panel (admin action). Nests group related eggs together (e.g. 'Minecraft', 'Voice Servers', 'Rust'). Returns nest ID, name, author, and description. Use the nest ID with list_eggs or get_egg to find specific server templates. Requires Application API key.",
      inputSchema: z.object({}),
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async () => {
      try {
        const result = await client.listNests();
        return formatToolResponse({
          nests: result.nests,
          count: result.nests.length,
          pagination: result.pagination,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
