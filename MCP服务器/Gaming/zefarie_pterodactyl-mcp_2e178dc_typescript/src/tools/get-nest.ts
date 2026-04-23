import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerGetNestTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "get_nest",
    {
      description:
        "Get details of a specific nest (egg category) by ID (admin action). Returns name, description, author, and metadata. Use list_nests to find the nest_id. Requires Application API key.",
      inputSchema: z.object({
        nest_id: z.number().int().positive().describe("Nest ID to retrieve (from list_nests)"),
      }),
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const nest = await client.getNest(params.nest_id);
        return formatToolResponse(nest);
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
