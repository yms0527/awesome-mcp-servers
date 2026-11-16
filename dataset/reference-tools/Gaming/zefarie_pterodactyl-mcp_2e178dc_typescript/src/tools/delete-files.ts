import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerDeleteFilesTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "delete_files",
    {
      description:
        "Permanently delete one or more files or folders on a server. WARNING: This cannot be undone. Use list_files first to verify the files exist. Consider create_backup before deleting important files. Requires Client API key.",
      inputSchema: z.object({
        server_identifier: z
          .string()
          .min(1)
          .describe(
            "Short server identifier string from list_servers field 'identifier' (e.g., 'a1b2c3d4')",
          ),
        directory: z.string().describe("Parent directory containing the files"),
        files: z.array(z.string()).min(1).describe("File/folder names to delete"),
      }),
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        await client.deleteFiles(params.server_identifier, params.directory, params.files);

        return formatToolResponse({
          success: true,
          message: `Deleted ${params.files.length} item(s) from ${params.directory} on server ${params.server_identifier}.`,
          server_identifier: params.server_identifier,
          directory: params.directory,
          deleted: params.files,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
