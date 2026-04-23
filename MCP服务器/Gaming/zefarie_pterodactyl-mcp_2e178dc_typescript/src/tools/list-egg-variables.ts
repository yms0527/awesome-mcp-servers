import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerListEggVariablesTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "list_egg_variables",
    {
      description:
        "List all environment variables defined for an egg (admin action). Shows name, env_variable key, default value, validation rules, and user editability. On Pelican panels, use nest_id=0. Requires Application API key.",
      inputSchema: z.object({
        nest_id: z
          .number()
          .int()
          .min(0)
          .describe("Nest ID (from list_nests). Use 0 for Pelican panels."),
        egg_id: z
          .number()
          .int()
          .positive()
          .describe("Egg ID to list variables for (from list_eggs)"),
      }),
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        let variables: unknown[];
        try {
          const result = await client.listEggVariables(params.nest_id, params.egg_id);
          variables = result.variables;
        } catch {
          // Pelican fallback: get variables from getEgg with ?include=variables
          const egg = (await client.getEgg(params.nest_id, params.egg_id)) as {
            relationships?: {
              variables?: { data: { attributes: Record<string, unknown> }[] };
            };
          };
          variables = egg.relationships?.variables?.data.map((v) => v.attributes) ?? [];
        }
        return formatToolResponse({
          egg_id: params.egg_id,
          variables,
          count: variables.length,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
