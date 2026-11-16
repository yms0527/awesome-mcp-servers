import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerCreateAllocationTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "create_allocation",
    {
      description:
        "Create new port allocations on a node (admin action). Ports can be individual ('25565') or ranges ('25565-25570'). Use list_nodes to find the node_id first. Requires Application API key.",
      inputSchema: z.object({
        node_id: z
          .number()
          .int()
          .positive()
          .describe("Node ID to create allocations on (from list_nodes)"),
        ip: z
          .string()
          .min(1)
          .describe("IP address to bind the allocation to (e.g. '0.0.0.0' or '192.168.1.1')"),
        ports: z
          .array(z.string().min(1))
          .min(1)
          .describe("Array of ports or port ranges to allocate (e.g. ['25565', '25570-25575'])"),
      }),
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        await client.createAllocation(params.node_id, params.ip, params.ports);
        return formatToolResponse({
          success: true,
          node_id: params.node_id,
          ip: params.ip,
          ports: params.ports,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
