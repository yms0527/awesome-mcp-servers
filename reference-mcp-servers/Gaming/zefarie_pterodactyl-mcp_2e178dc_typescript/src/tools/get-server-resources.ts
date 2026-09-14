import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerGetServerResourcesTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "get_server_resources",
    {
      description:
        "Get real-time CPU, memory, disk, network usage and current power state (running/stopped/starting/stopping) for a server. Use when asked about performance, lag, resource consumption, or uptime. For static config details (limits, egg, allocations), use get_server instead. Requires Client API key.",
      inputSchema: z.object({
        server_identifier: z
          .string()
          .min(1)
          .describe(
            "Short server identifier string from list_servers field 'identifier' (e.g., 'a1b2c3d4')",
          ),
      }),
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const resources = await client.getServerResources(params.server_identifier);

        return formatToolResponse({
          server_identifier: params.server_identifier,
          state: resources.current_state,
          is_suspended: resources.is_suspended,
          cpu_percent: resources.resources.cpu_absolute,
          memory_mb: Math.round(resources.resources.memory_bytes / 1_048_576),
          disk_mb: Math.round(resources.resources.disk_bytes / 1_048_576),
          network_rx_mb: Math.round(resources.resources.network_rx_bytes / 1_048_576),
          network_tx_mb: Math.round(resources.resources.network_tx_bytes / 1_048_576),
          uptime_seconds: resources.resources.uptime,
        });
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
