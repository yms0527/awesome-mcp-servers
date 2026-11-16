import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";
import { checkCommandSafety, sanitizeCommand } from "../lib/sanitize.js";

export function registerSendCommandTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "send_command",
    {
      description:
        "Send a console command to a running game server (e.g., Minecraft '/say hello', '/whitelist add Player', '/op Player'). The server MUST be running or the command will fail silently. For power control (start/stop/restart), use the dedicated power tools instead. WARNING: Commands are sent directly to the server console and execute immediately. Requires Client API key.",
      inputSchema: z.object({
        server_identifier: z
          .string()
          .min(1)
          .describe(
            "Short server identifier string from list_servers field 'identifier' (e.g., 'a1b2c3d4')",
          ),
        command: z
          .string()
          .min(1)
          .max(1000)
          .describe("Console command to send (e.g. 'say Hello', 'whitelist add Player')"),
      }),
      annotations: {
        destructiveHint: true,
        openWorldHint: true,
      },
    },
    async (params) => {
      try {
        const sanitized = sanitizeCommand(params.command);
        const safety = checkCommandSafety(sanitized);

        await client.sendCommand(params.server_identifier, sanitized);

        const response: Record<string, unknown> = {
          success: true,
          message: `Command sent to server ${params.server_identifier}.`,
          server_identifier: params.server_identifier,
          command: sanitized,
        };

        if (!safety.safe) {
          response.warning =
            "This command matched potentially dangerous patterns. It was still executed.";
          response.matched_patterns = safety.warnings;
        }

        return formatToolResponse(response);
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
