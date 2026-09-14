import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerUpdateServerStartupTool(
  server: McpServer,
  client: PterodactylClient,
): void {
  server.registerTool(
    "update_server_startup",
    {
      description:
        "Update a server's startup configuration: startup command, Docker image, or egg template (admin action). Only specify the fields you want to change - current values are preserved for unspecified fields. Changes take effect after server restart. Requires Application API key.",
      inputSchema: z.object({
        server_id: z
          .number()
          .int()
          .positive()
          .describe("Numeric server ID from list_servers field 'id'"),
        startup: z.string().min(1).optional().describe("New startup command"),
        image: z.string().min(1).optional().describe("New Docker image"),
        egg: z.number().int().positive().optional().describe("New egg ID"),
      }),
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        // Fetch current server to merge with - the API requires ALL fields
        // Pelican also requires the `environment` field
        const current = (await client.getServer(params.server_id)) as {
          container: {
            startup_command: string;
            image: string;
            environment: Record<string, string>;
          };
          egg: number;
        };

        const body = {
          startup: params.startup ?? current.container.startup_command,
          image: params.image ?? current.container.image,
          egg: params.egg ?? current.egg,
          environment: current.container.environment,
        };

        const result = await client.updateServerStartup(params.server_id, body);
        return formatToolResponse(result);
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
