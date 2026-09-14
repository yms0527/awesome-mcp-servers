import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerGetNodeTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "get_node",
    {
      description:
        "Get detailed information about a specific infrastructure node (admin action). Returns name, FQDN, resource limits, allocated resources, scheme, and maintenance status. Use list_nodes to find the node ID first. Requires Application API key.",
      inputSchema: z.object({
        node_id: z.number().int().positive().describe("Node numeric ID (from list_nodes)"),
      }),
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const result = await client.getNode(params.node_id);
        return formatToolResponse(result);
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
