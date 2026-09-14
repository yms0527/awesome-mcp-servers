import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerListFilesTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "list_files",
    {
      description:
        "List files and directories in a server's filesystem. Returns name, size, type (file/directory), and modification timestamps. Use to browse server files before reading or editing them. Start with directory '/' to see root contents. Requires Client API key.",
      inputSchema: z.object({
        server_identifier: z
          .string()
          .min(1)
          .describe(
            "Short server identifier string from list_servers field 'identifier' (e.g., 'a1b2c3d4')",
          ),
        directory: z.string().optional().describe("Directory path to list (default: '/')"),
      }),
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const files = await client.listFiles(params.server_identifier, params.directory);

        const formatted = files.map((f) => ({
          name: f.name,
          type: f.is_file ? "file" : "directory",
          size_bytes: f.size,
          mimetype: f.mimetype,
          modified_at: f.modified_at,
        }));

        return formatToolResponse({
          server_identifier: params.server_identifier,
          directory: params.directory ?? "/",
          files: formatted,
          count: formatted.length,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
