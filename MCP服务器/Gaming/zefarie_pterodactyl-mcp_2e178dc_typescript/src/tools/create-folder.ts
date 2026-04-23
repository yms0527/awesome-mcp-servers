import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerCreateFolderTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "create_folder",
    {
      description:
        "Create a new directory/folder on a server's filesystem. Specify the parent directory and the new folder name. Use list_files to verify the parent directory exists first. Requires Client API key.",
      inputSchema: z.object({
        server_identifier: z
          .string()
          .min(1)
          .describe(
            "Short server identifier string from list_servers field 'identifier' (e.g., 'a1b2c3d4')",
          ),
        directory: z.string().describe("Parent directory, e.g. /"),
        name: z.string().min(1).describe("Folder name to create"),
      }),
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        await client.createFolder(params.server_identifier, params.directory, params.name);

        return formatToolResponse({
          success: true,
          message: `Folder '${params.name}' created in ${params.directory} on server ${params.server_identifier}.`,
          server_identifier: params.server_identifier,
          directory: params.directory,
          name: params.name,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
