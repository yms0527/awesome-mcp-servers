import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerStopServerTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "stop_server",
    {
      description:
        "Stop a running game server gracefully. Sends a stop signal so the server shuts down cleanly (saves world data, disconnects players). If the server does not stop, use kill_server as a last resort. Requires Client API key.",
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
        await client.sendPowerAction(params.server_identifier, "stop");

        return formatToolResponse({
          success: true,
          message: `Server ${params.server_identifier} is stopping.`,
          server_identifier: params.server_identifier,
          action: "stop",
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
