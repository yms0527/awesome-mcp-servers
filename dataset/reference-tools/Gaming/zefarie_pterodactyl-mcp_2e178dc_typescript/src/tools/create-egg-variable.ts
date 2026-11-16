import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerCreateEggVariableTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "create_egg_variable",
    {
      description:
        "Add a new environment variable to an egg (admin action). The 'rules' field uses Laravel validation syntax (e.g., 'required|string|max:20'). Use list_nests and list_eggs to find the nest_id and egg_id. Requires Application API key.",
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
          .describe("Egg ID to add the variable to (from list_eggs)"),
        name: z.string().min(1).describe("Display name for the variable (e.g. 'Server Port')"),
        description: z.string().describe("Description of what this variable controls"),
        env_variable: z.string().min(1).describe("Environment variable key (e.g. 'SERVER_PORT')"),
        default_value: z.string().describe("Default value for the variable (e.g. '25565')"),
        user_viewable: z.boolean().describe("Whether users can see this variable in the panel"),
        user_editable: z.boolean().describe("Whether users can modify this variable in the panel"),
        rules: z
          .string()
          .min(1)
          .describe(
            "Laravel validation rules (e.g. 'required|string|max:20', 'required|integer|between:1,65535')",
          ),
      }),
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const result = await client.createEggVariable(params.nest_id, params.egg_id, {
          name: params.name,
          description: params.description,
          env_variable: params.env_variable,
          default_value: params.default_value,
          user_viewable: params.user_viewable,
          user_editable: params.user_editable,
          rules: params.rules,
        });
        return formatToolResponse(result);
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
