import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerDeleteBackupTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "delete_backup",
    {
      description:
        "Delete a backup from a server. This permanently removes the backup file and frees a backup slot. Use list_backups to find the backup UUID. Requires Client API key.",
      inputSchema: z.object({
        server_identifier: z
          .string()
          .min(1)
          .describe(
            "Short server identifier string from list_servers field 'identifier' (e.g., 'a1b2c3d4')",
          ),
        backup_uuid: z.string().min(1).describe("UUID of the backup from list_backups"),
      }),
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        await client.deleteBackup(params.server_identifier, params.backup_uuid);

        return formatToolResponse({
          success: true,
          message: `Backup ${params.backup_uuid} has been deleted.`,
          server_identifier: params.server_identifier,
          backup_uuid: params.backup_uuid,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
