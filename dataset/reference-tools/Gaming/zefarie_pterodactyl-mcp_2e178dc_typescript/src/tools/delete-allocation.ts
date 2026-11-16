import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerDeleteAllocationTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "delete_allocation",
    {
      description:
        "Delete a port allocation from a node (admin action). Cannot delete allocations that are in use by a server. Use list_allocations to find the allocation_id. Requires Application API key.",
      inputSchema: z.object({
        node_id: z
          .number()
          .int()
          .positive()
          .describe("Node ID that owns the allocation (from list_nodes)"),
        allocation_id: z
          .number()
          .int()
          .positive()
          .describe("Allocation ID to delete (from list_allocations)"),
      }),
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        await client.deleteAllocation(params.node_id, params.allocation_id);
        return formatToolResponse({
          success: true,
          node_id: params.node_id,
          allocation_id: params.allocation_id,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
