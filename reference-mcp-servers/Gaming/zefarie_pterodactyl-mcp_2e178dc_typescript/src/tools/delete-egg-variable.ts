import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerDeleteEggVariableTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "delete_egg_variable",
    {
      description:
        "Delete an environment variable from an egg (admin action). This is permanent and cannot be undone. Use list_egg_variables to find the variable_id. Requires Application API key.",
      inputSchema: z.object({
        nest_id: z
          .number()
          .int()
          .positive()
          .describe("Nest ID that contains the egg (from list_nests)"),
        egg_id: z
          .number()
          .int()
          .positive()
          .describe("Egg ID that contains the variable (from list_eggs)"),
        variable_id: z
          .number()
          .int()
          .positive()
          .describe("Variable ID to delete (from list_egg_variables)"),
      }),
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        await client.deleteEggVariable(params.nest_id, params.egg_id, params.variable_id);
        return formatToolResponse({
          success: true,
          nest_id: params.nest_id,
          egg_id: params.egg_id,
          variable_id: params.variable_id,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
