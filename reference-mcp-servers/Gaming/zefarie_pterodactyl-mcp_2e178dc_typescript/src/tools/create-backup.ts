import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerCreateBackupTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "create_backup",
    {
      description:
        "Create a new backup of a server. The backup runs in the background and may take several minutes depending on server size. Use list_backups to check backup status and available slots. The server's backup limit (from list_servers feature_limits.backups) determines the maximum number of backups. Requires Client API key.",
      inputSchema: z.object({
        server_identifier: z
          .string()
          .min(1)
          .describe(
            "Short server identifier string from list_servers field 'identifier' (e.g., 'a1b2c3d4')",
          ),
        name: z.string().optional().describe("Backup name (auto-generated if not provided)"),
      }),
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const result = await client.createBackup(params.server_identifier, params.name);
        return formatToolResponse(result);
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
