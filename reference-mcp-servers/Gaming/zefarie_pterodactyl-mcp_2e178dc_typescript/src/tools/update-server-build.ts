import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerUpdateServerBuildTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "update_server_build",
    {
      description:
        "Update a server's resource limits: memory, CPU, disk, swap, IO weight, CPU pinning, and feature limits like max databases/backups (admin action). Only specify the fields you want to change - current values are preserved for unspecified fields. Changes take effect after server restart. For server metadata (name, owner), use update_server_details. Requires Application API key.",
      inputSchema: z.object({
        server_id: z
          .number()
          .int()
          .positive()
          .describe("Numeric server ID from list_servers field 'id'"),
        memory: z.number().int().min(0).optional().describe("Memory limit in MB (0 = unlimited)"),
        swap: z.number().int().optional().describe("Swap limit in MB (-1 = unlimited)"),
        disk: z.number().int().min(0).optional().describe("Disk limit in MB (0 = unlimited)"),
        io: z.number().int().min(10).max(1000).optional().describe("IO weight (10-1000)"),
        cpu: z
          .number()
          .int()
          .min(0)
          .optional()
          .describe("CPU limit in percent (100 = 1 core, 0 = unlimited)"),
        threads: z.string().optional().describe("CPU threads/cores to pin (e.g. '0', '0-1,3')"),
        allocation: z.number().int().positive().optional().describe("Default allocation ID"),
        databases_limit: z.number().int().min(0).optional().describe("Max databases"),
        allocations_limit: z.number().int().min(0).optional().describe("Max allocations"),
        backups_limit: z.number().int().min(0).optional().describe("Max backups"),
      }),
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        // Fetch current server config to merge with - the API requires ALL fields
        const current = (await client.getServer(params.server_id)) as {
          limits: {
            memory: number;
            swap: number;
            disk: number;
            io: number;
            cpu: number;
            threads: string | null;
          };
          feature_limits: { databases: number; allocations: number; backups: number };
          allocation: number;
        };

        const body = {
          memory: params.memory ?? current.limits.memory,
          swap: params.swap ?? current.limits.swap,
          disk: params.disk ?? current.limits.disk,
          io: params.io ?? current.limits.io,
          cpu: params.cpu ?? current.limits.cpu,
          threads: params.threads ?? current.limits.threads ?? "",
          allocation: params.allocation ?? current.allocation,
          feature_limits: {
            databases: params.databases_limit ?? current.feature_limits.databases,
            allocations: params.allocations_limit ?? current.feature_limits.allocations,
            backups: params.backups_limit ?? current.feature_limits.backups,
          },
        };

        const result = await client.updateServerBuild(params.server_id, body);
        return formatToolResponse(result);
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
