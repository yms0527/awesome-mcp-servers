import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatPagination } from "../lib/pagination.js";
import { formatToolResponse } from "../lib/response.js";

export function registerListNodesTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "list_nodes",
    {
      description:
        "List all infrastructure nodes in the panel (admin action). Returns node ID, name, FQDN, total/allocated resources (memory, disk, CPU), and maintenance mode status. Use to check available capacity before creating servers. Supports pagination. Requires Application API key.",
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
        const result = await client.listNodes(params);

        const nodes = result.nodes.map((n) => ({
          id: n.id,
          uuid: n.uuid,
          name: n.name,
          description: n.description,
          fqdn: n.fqdn,
          scheme: n.scheme,
          memory_mb: n.memory,
          disk_mb: n.disk,
          cpu_percent: n.cpu,
          maintenance_mode: n.maintenance_mode,
          allocated: n.allocated_resources,
        }));

        return formatToolResponse({
          nodes,
          pagination: formatPagination(result.pagination),
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
