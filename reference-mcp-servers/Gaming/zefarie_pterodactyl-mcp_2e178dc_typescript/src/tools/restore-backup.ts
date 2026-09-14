import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerRestoreBackupTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "restore_backup",
    {
      description:
        "Restore a server from a backup. If truncate is true, all current files are deleted before restoring. WARNING: This is irreversible and will overwrite existing files. The server should be stopped before restoring. Use list_backups to find the backup UUID. Requires Client API key.",
      inputSchema: z.object({
        server_identifier: z
          .string()
          .min(1)
          .describe(
            "Short server identifier string from list_servers field 'identifier' (e.g., 'a1b2c3d4')",
          ),
        backup_uuid: z.string().min(1).describe("UUID of the backup to restore from list_backups"),
        truncate: z
          .boolean()
          .optional()
          .describe(
            "If true, delete all current server files before restoring (default: false). WARNING: irreversible.",
          ),
      }),
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        await client.restoreBackup(params.server_identifier, params.backup_uuid, params.truncate);

        return formatToolResponse({
          success: true,
          message: `Backup ${params.backup_uuid} is being restored. This may take several minutes.`,
          server_identifier: params.server_identifier,
          backup_uuid: params.backup_uuid,
          truncate: params.truncate ?? false,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
