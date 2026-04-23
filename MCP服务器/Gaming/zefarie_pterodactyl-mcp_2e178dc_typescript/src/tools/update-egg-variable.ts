import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerUpdateEggVariableTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "update_egg_variable",
    {
      description:
        "Update an existing environment variable on an egg (admin action). All fields are optional - only provided fields will be changed. Use list_egg_variables to find the variable_id. Requires Application API key.",
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
          .describe("Variable ID to update (from list_egg_variables)"),
        name: z.string().min(1).optional().describe("New display name for the variable"),
        description: z.string().optional().describe("New description"),
        env_variable: z.string().min(1).optional().describe("New environment variable key"),
        default_value: z.string().optional().describe("New default value"),
        user_viewable: z.boolean().optional().describe("Whether users can see this variable"),
        user_editable: z.boolean().optional().describe("Whether users can modify this variable"),
        rules: z.string().min(1).optional().describe("New Laravel validation rules"),
      }),
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const data: Record<string, unknown> = {};
        if (params.name !== undefined) data.name = params.name;
        if (params.description !== undefined) data.description = params.description;
        if (params.env_variable !== undefined) data.env_variable = params.env_variable;
        if (params.default_value !== undefined) data.default_value = params.default_value;
        if (params.user_viewable !== undefined) data.user_viewable = params.user_viewable;
        if (params.user_editable !== undefined) data.user_editable = params.user_editable;
        if (params.rules !== undefined) data.rules = params.rules;

        const result = await client.updateEggVariable(
          params.nest_id,
          params.egg_id,
          params.variable_id,
          data,
        );
        return formatToolResponse(result);
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
