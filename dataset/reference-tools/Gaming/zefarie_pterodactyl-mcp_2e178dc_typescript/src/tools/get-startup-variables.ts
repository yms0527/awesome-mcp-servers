import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerGetStartupVariablesTool(
  server: McpServer,
  client: PterodactylClient,
): void {
  server.registerTool(
    "get_startup_variables",
    {
      description:
        "Get startup configuration for a server: startup command, environment variables, and available Docker images. Use to inspect or troubleshoot server startup parameters. For modifying startup config (admin), use update_server_startup instead. Requires Client API key.",
      inputSchema: z.object({
        server_identifier: z
          .string()
          .min(1)
          .describe(
            "Short server identifier string from list_servers field 'identifier' (e.g., 'a1b2c3d4')",
          ),
      }),
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const startup = await client.getStartupVariables(params.server_identifier);

        return formatToolResponse({
          server_identifier: params.server_identifier,
          ...startup,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
