import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerCompressFilesTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "compress_files",
    {
      description:
        "Compress one or more files or folders into a .tar.gz archive on the server. Useful before downloading large directories or for creating manual backups of specific files. Returns the archive details. Requires Client API key.",
      inputSchema: z.object({
        server_identifier: z
          .string()
          .min(1)
          .describe(
            "Short server identifier string from list_servers field 'identifier' (e.g., 'a1b2c3d4')",
          ),
        directory: z.string().describe("Directory containing the files to compress"),
        files: z.array(z.string()).min(1).describe("File/folder names to compress"),
      }),
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const result = await client.compressFiles(
          params.server_identifier,
          params.directory,
          params.files,
        );
        return formatToolResponse(result);
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
