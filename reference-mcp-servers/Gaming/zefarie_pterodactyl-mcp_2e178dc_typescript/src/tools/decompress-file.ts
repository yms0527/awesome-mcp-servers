import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerDecompressFileTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "decompress_file",
    {
      description:
        "Extract/decompress an archive file (.tar.gz, .zip) on the server. Files are extracted into the same directory as the archive. Use list_files to verify the archive exists first. Requires Client API key.",
      inputSchema: z.object({
        server_identifier: z
          .string()
          .min(1)
          .describe(
            "Short server identifier string from list_servers field 'identifier' (e.g., 'a1b2c3d4')",
          ),
        directory: z.string().describe("Directory containing the archive"),
        file: z.string().min(1).describe("Archive filename to decompress"),
      }),
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        await client.decompressFile(params.server_identifier, params.directory, params.file);

        return formatToolResponse({
          success: true,
          message: `Archive '${params.file}' decompressed in ${params.directory} on server ${params.server_identifier}.`,
          server_identifier: params.server_identifier,
          directory: params.directory,
          file: params.file,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
