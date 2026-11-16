import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerDownloadFileTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "download_file",
    {
      description:
        "Get a temporary download URL for a file on the server. Useful for large files or binaries that can't be read as text. The URL expires after a short time. Use list_files to find file paths. For small text files, use read_file instead. Requires Client API key.",
      inputSchema: z.object({
        server_identifier: z
          .string()
          .min(1)
          .describe(
            "Short server identifier string from list_servers field 'identifier' (e.g., 'a1b2c3d4')",
          ),
        file_path: z
          .string()
          .min(1)
          .describe(
            "Absolute path to the file on the server (e.g., '/server.jar', '/logs/latest.log')",
          ),
      }),
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const result = await client.downloadFile(params.server_identifier, params.file_path);

        return formatToolResponse({
          server_identifier: params.server_identifier,
          file_path: params.file_path,
          download_url: result.url,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
