import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerUpdateServerDetailsTool(
  server: McpServer,
  client: PterodactylClient,
): void {
  server.registerTool(
    "update_server_details",
    {
      description:
        "Update a server's metadata: name, description, owner, or external ID (admin action). Only specify the fields you want to change - current values are preserved for unspecified fields. For resource limits, use update_server_build. Requires Application API key.",
      inputSchema: z.object({
        server_id: z
          .number()
          .int()
          .positive()
          .describe("Numeric server ID from list_servers field 'id'"),
        name: z.string().min(1).optional().describe("New server name"),
        description: z.string().optional().describe("New server description"),
        user: z.number().int().positive().optional().describe("New owner user ID"),
        external_id: z.string().optional().describe("New external ID"),
      }),
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        // Fetch current server to merge with - the API requires ALL fields
        const current = (await client.getServer(params.server_id)) as {
          name: string;
          description: string;
          user: number;
          external_id: string | null;
        };

        const body = {
          name: params.name ?? current.name,
          description: params.description ?? current.description,
          user: params.user ?? current.user,
          external_id: params.external_id ?? current.external_id ?? "",
        };

        const result = await client.updateServerDetails(params.server_id, body);
        return formatToolResponse(result);
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
