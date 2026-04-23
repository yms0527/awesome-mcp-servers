import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";
import { maskEnvironmentVariables } from "../lib/sanitize.js";

export function registerGetServerTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "get_server",
    {
      description:
        "Get detailed static configuration for a server: name, description, resource limits, container config (egg, Docker image, startup command), allocations, and timestamps. Use for server config inspection. For live resource usage (CPU/RAM/disk), use get_server_resources instead. Sensitive environment variables are masked. Requires Application API key.",
      inputSchema: z.object({
        server_id: z
          .number()
          .int()
          .positive()
          .describe("Numeric server ID from list_servers field 'id'"),
      }),
      annotations: {
        readOnlyHint: true,
        openWorldHint: true,
      },
    },
    async (params) => {
      try {
        const result = await client.getServer(params.server_id);

        // Mask sensitive environment variables in container config
        const sanitized = { ...result } as Record<string, unknown>;
        const container = sanitized.container as Record<string, unknown> | undefined;
        if (container?.environment && typeof container.environment === "object") {
          sanitized.container = {
            ...container,
            environment: maskEnvironmentVariables(container.environment as Record<string, unknown>),
          };
        }

        return formatToolResponse(sanitized);
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
