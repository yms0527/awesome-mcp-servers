import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerRenameFileTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "rename_file",
    {
      description:
        "Rename or move a file or folder on a server. Can be used to change a filename or move a file to a different location within the same directory root. Use list_files to verify the file exists first. Requires Client API key.",
      inputSchema: z.object({
        server_identifier: z
          .string()
          .min(1)
          .describe(
            "Short server identifier string from list_servers field 'identifier' (e.g., 'a1b2c3d4')",
          ),
        directory: z.string().describe("Directory containing the file"),
        from: z.string().min(1).describe("Current file/folder name"),
        to: z.string().min(1).describe("New file/folder name"),
      }),
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        await client.renameFile(params.server_identifier, params.directory, params.from, params.to);

        return formatToolResponse({
          success: true,
          message: `Renamed '${params.from}' to '${params.to}' in ${params.directory} on server ${params.server_identifier}.`,
          server_identifier: params.server_identifier,
          directory: params.directory,
          from: params.from,
          to: params.to,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
