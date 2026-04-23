import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";
import { filterSensitiveFields } from "../lib/sanitize.js";

export function registerGetNodeConfigTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "get_node_config",
    {
      description:
        "Get the Wings daemon configuration for a node (admin action). Returns the config.yml content needed to configure the Wings daemon. Sensitive fields (tokens, keys) are redacted. Use when setting up or troubleshooting a node. Requires Application API key.",
      inputSchema: z.object({
        node_id: z.number().int().positive().describe("Node numeric ID (from list_nodes)"),
      }),
      annotations: {
        readOnlyHint: true,
        openWorldHint: true,
      },
    },
    async (params) => {
      try {
        const result = await client.getNodeConfiguration(params.node_id);
        const filtered = filterSensitiveFields(result, ["daemon_token", "remote"]);
        return formatToolResponse(filtered);
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
