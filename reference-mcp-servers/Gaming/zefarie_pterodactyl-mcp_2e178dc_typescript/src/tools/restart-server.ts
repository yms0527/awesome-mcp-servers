import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerRestartServerTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "restart_server",
    {
      description:
        "Restart a game server. Works whether the server is running or stopped. Equivalent to stop + start. Use when a config change requires a restart or when the server is unresponsive. Idempotent. Requires Client API key.",
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
        await client.sendPowerAction(params.server_identifier, "restart");

        return formatToolResponse({
          success: true,
          message: `Server ${params.server_identifier} is restarting.`,
          server_identifier: params.server_identifier,
          action: "restart",
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
