import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerDownloadBackupTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "download_backup",
    {
      description:
        "Get a temporary download URL for a backup. The URL expires after a short time. Use list_backups to find the backup UUID. Only completed backups (is_successful: true) can be downloaded. Requires Client API key.",
      inputSchema: z.object({
        server_identifier: z
          .string()
          .min(1)
          .describe(
            "Short server identifier string from list_servers field 'identifier' (e.g., 'a1b2c3d4')",
          ),
        backup_uuid: z.string().min(1).describe("UUID of the backup from list_backups"),
      }),
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const result = await client.downloadBackup(params.server_identifier, params.backup_uuid);

        return formatToolResponse({
          server_identifier: params.server_identifier,
          backup_uuid: params.backup_uuid,
          download_url: result.url,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
