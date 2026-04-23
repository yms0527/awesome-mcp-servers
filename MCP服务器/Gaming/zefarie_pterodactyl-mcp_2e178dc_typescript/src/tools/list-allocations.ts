import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerListAllocationsTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "list_allocations",
    {
      description:
        "List all port allocations for a node (admin action). Shows IP, port, alias, and which server is using each allocation. Use list_nodes to find the node_id first. Requires Application API key.",
      inputSchema: z.object({
        node_id: z
          .number()
          .int()
          .positive()
          .describe("Node ID to list allocations for (from list_nodes)"),
        page: z
          .number()
          .int()
          .positive()
          .optional()
          .describe("Page number for pagination (default: 1)"),
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
        const result = await client.listAllocations(params.node_id, {
          page: params.page,
          per_page: params.per_page,
        });
        return formatToolResponse({
          node_id: params.node_id,
          allocations: result.allocations,
          count: result.allocations.length,
          pagination: result.pagination,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
