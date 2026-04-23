import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerListEggsTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "list_eggs",
    {
      description:
        "List all available eggs/server templates on the panel (admin action). Returns egg ID, name, description, Docker images, and startup command. Use to find the egg ID needed for create_server. Common eggs: Minecraft, Rust, Terraria, etc. Requires Application API key.",
      inputSchema: z.object({}),
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async () => {
      try {
        const result = await client.listEggs();
        return formatToolResponse({
          eggs: result.eggs,
          count: result.eggs.length,
          pagination: result.pagination,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
