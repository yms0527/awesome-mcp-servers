import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

const DEFAULT_LINES = 100;
const MAX_LINES = 500;
const DEFAULT_LOG_PATH = "/logs/latest.log";

export function registerGetRecentLogsTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "get_recent_logs",
    {
      description:
        "Read the most recent log lines from a server. Defaults to reading /logs/latest.log (Minecraft). For other server types, specify the log file path. Returns the last N lines. Use this after send_command to check the server's response, or to diagnose crashes and errors. Requires Client API key.",
      inputSchema: z.object({
        server_identifier: z
          .string()
          .min(1)
          .describe(
            "Short server identifier string from list_servers field 'identifier' (e.g., 'a1b2c3d4')",
          ),
        lines: z
          .number()
          .int()
          .min(1)
          .max(MAX_LINES)
          .optional()
          .describe(
            `Number of recent lines to return (default: ${DEFAULT_LINES}, max: ${MAX_LINES})`,
          ),
        file_path: z
          .string()
          .min(1)
          .optional()
          .describe(
            "Path to the log file (default: '/logs/latest.log'). Common paths: '/logs/latest.log' (Minecraft), '/console.log', '/logs/output.log'",
          ),
      }),
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const logPath = params.file_path ?? DEFAULT_LOG_PATH;
        const lineCount = params.lines ?? DEFAULT_LINES;

        const content = await client.readFile(params.server_identifier, logPath);
        const allLines = content.split("\n");
        const lastLines = allLines.slice(-lineCount);

        return formatToolResponse({
          server_identifier: params.server_identifier,
          file: logPath,
          total_lines: allLines.length,
          returned_lines: lastLines.length,
          content: lastLines.join("\n"),
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
