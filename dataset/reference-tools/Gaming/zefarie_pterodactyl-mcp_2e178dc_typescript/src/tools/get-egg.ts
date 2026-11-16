import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerGetEggTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "get_egg",
    {
      description:
        "Get full details of a specific egg/server template (admin action). Returns name, Docker image, startup command, install script, configuration, and all environment variables with their default values and validation rules. Use list_nests to find the nest_id and list_eggs to find the egg_id. Requires Application API key.",
      inputSchema: z.object({
        nest_id: z
          .number()
          .int()
          .positive()
          .describe("Nest ID that contains the egg (from list_nests)"),
        egg_id: z.number().int().positive().describe("Egg ID to retrieve (from list_eggs)"),
      }),
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const egg = await client.getEgg(params.nest_id, params.egg_id);
        return formatToolResponse(egg);
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
