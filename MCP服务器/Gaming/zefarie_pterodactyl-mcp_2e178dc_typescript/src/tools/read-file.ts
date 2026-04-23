import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerReadFileTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "read_file",
    {
      description:
        "Read the contents of a text file on a server. Returns the raw file content as a string. Use list_files first to find the file path. Common files: /server.properties, /bukkit.yml, /config.yml. Not suitable for binary files. Requires Client API key.",
      inputSchema: z.object({
        server_identifier: z
          .string()
          .min(1)
          .describe(
            "Short server identifier string from list_servers field 'identifier' (e.g., 'a1b2c3d4')",
          ),
        file_path: z.string().min(1).describe("Absolute path to the file, e.g. /server.properties"),
      }),
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const content = await client.readFile(params.server_identifier, params.file_path);

        return formatToolResponse({
          server_identifier: params.server_identifier,
          file_path: params.file_path,
          content,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
