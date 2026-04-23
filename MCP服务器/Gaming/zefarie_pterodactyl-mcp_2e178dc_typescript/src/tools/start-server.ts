import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerStartServerTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "start_server",
    {
      description:
        "Start a stopped game server. The server must be in 'offline' or 'stopped' state. Has no effect if already running. Use get_server_resources to check current power state before calling. For stopping, use stop_server. Requires Client API key.",
      inputSchema: z.object({
        server_identifier: z
          .string()
          .min(1)
          .describe(
            "Short server identifier string from list_servers field 'identifier' (e.g., 'a1b2c3d4')",
          ),
      }),
      annotations: { destructiveHint: true, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        await client.sendPowerAction(params.server_identifier, "start");

        return formatToolResponse({
          success: true,
          message: `Server ${params.server_identifier} is starting.`,
          server_identifier: params.server_identifier,
          action: "start",
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
