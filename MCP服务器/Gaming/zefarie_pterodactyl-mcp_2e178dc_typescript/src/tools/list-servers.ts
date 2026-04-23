import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatPagination } from "../lib/pagination.js";
import { formatToolResponse } from "../lib/response.js";
import { mapServerStatus } from "../lib/status.js";

export function registerListServersTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "list_servers",
    {
      description:
        "List all game servers on the Pterodactyl panel with name, status, and resource limits. Call this first to discover server IDs and identifiers. Returns numeric 'id' (for admin tools like suspend_server, delete_server, update_server_build) and short 'identifier' (for client tools like start_server, send_command, list_files). Supports pagination. Requires Application API key.",
      inputSchema: z.object({
        page: z.number().int().positive().optional().describe("Page number (default: 1)"),
        per_page: z
          .number()
          .int()
          .min(1)
          .max(100)
          .optional()
          .describe("Items per page (default: 50, max: 100)"),
      }),
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const result = await client.listServers(params);

        const servers = result.servers.map((s) => ({
          id: s.id,
          identifier: s.identifier,
          name: s.name,
          status: mapServerStatus(s.status),
          suspended: s.suspended,
          limits: {
            memory_mb: s.limits.memory,
            disk_mb: s.limits.disk,
            cpu_percent: s.limits.cpu,
          },
          node: s.node,
          user: s.user,
        }));

        return formatToolResponse({
          servers,
          pagination: formatPagination(result.pagination),
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
