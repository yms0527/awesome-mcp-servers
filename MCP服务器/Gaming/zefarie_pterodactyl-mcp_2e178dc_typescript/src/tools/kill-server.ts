import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerKillServerTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "kill_server",
    {
      description:
        "Forcefully kill a server process immediately. WARNING: Unsaved data will be lost. Only use when stop_server fails or the server is frozen and unresponsive. Prefer stop_server for graceful shutdown. Requires Client API key.",
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
        await client.killServer(params.server_identifier);

        return formatToolResponse({
          success: true,
          message: `Server ${params.server_identifier} has been forcefully killed.`,
          server_identifier: params.server_identifier,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
