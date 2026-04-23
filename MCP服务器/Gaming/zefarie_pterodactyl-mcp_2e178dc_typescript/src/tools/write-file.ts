import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerWriteFileTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "write_file",
    {
      description:
        "Write content to a file on a server. Creates the file if it does not exist, or overwrites it entirely if it does. Use read_file first to get current content if you need to modify an existing file. The server may need a restart for config changes to take effect. Requires Client API key.",
      inputSchema: z.object({
        server_identifier: z
          .string()
          .min(1)
          .describe(
            "Short server identifier string from list_servers field 'identifier' (e.g., 'a1b2c3d4')",
          ),
        file_path: z.string().min(1).describe("Absolute path to the file, e.g. /server.properties"),
        content: z.string().describe("File content to write"),
      }),
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        await client.writeFile(params.server_identifier, params.file_path, params.content);

        return formatToolResponse({
          success: true,
          message: `File written to ${params.file_path} on server ${params.server_identifier}.`,
          server_identifier: params.server_identifier,
          file_path: params.file_path,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
