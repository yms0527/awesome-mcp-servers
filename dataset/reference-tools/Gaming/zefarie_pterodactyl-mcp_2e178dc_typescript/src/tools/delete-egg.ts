import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerDeleteEggTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "delete_egg",
    {
      description:
        "Permanently delete an egg/server template from a nest (admin action). WARNING: Servers currently using this egg will NOT be deleted but may not start correctly after the egg is removed. This action cannot be undone. Use get_egg to verify the egg before deleting. Requires Application API key.",
      inputSchema: z.object({
        nest_id: z
          .number()
          .int()
          .positive()
          .describe("Nest ID that contains the egg (from list_nests)"),
        egg_id: z.number().int().positive().describe("Egg ID to delete (from list_eggs)"),
      }),
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        await client.deleteEgg(params.nest_id, params.egg_id);
        return formatToolResponse({
          success: true,
          message: `Egg ${params.egg_id} has been deleted from nest ${params.nest_id}.`,
          nest_id: params.nest_id,
          egg_id: params.egg_id,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
