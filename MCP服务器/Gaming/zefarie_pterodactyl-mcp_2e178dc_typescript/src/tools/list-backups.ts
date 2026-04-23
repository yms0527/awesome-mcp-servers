import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerListBackupsTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "list_backups",
    {
      description:
        "List all backups for a server. Returns backup UUID, name, size, success status, lock status, and creation timestamps. Use before create_backup to check if backup limit is reached. Requires Client API key.",
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
        const backups = await client.listBackups(params.server_identifier);

        const formatted = backups.map((b) => ({
          uuid: b.uuid,
          name: b.name,
          size_mb: Math.round(b.bytes / 1_048_576),
          is_successful: b.is_successful,
          is_locked: b.is_locked,
          created_at: b.created_at,
          completed_at: b.completed_at,
        }));

        return formatToolResponse({
          server_identifier: params.server_identifier,
          backups: formatted,
          count: formatted.length,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
