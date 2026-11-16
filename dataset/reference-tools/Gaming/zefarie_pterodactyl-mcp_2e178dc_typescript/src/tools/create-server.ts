import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerCreateServerTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "create_server",
    {
      description:
        "Create a new game server on the panel (admin action). Requires egg ID (from list_eggs), owner user ID (from list_users), allocation ID, and resource limits. Use list_eggs to find available server templates and list_nodes to find nodes with capacity. Requires Application API key.",
      inputSchema: z.object({
        name: z.string().min(1).describe("Server name"),
        user: z.number().int().positive().describe("Owner user ID"),
        egg: z.number().int().positive().describe("Egg ID (server template)"),
        docker_image: z.string().min(1).describe("Docker image to use"),
        startup: z.string().min(1).describe("Startup command"),
        memory: z.number().int().positive().describe("Memory limit in MB"),
        disk: z.number().int().positive().describe("Disk limit in MB"),
        cpu: z.number().int().min(0).describe("CPU limit in percent (100 = 1 core)"),
        swap: z.number().int().optional().default(0).describe("Swap limit in MB (default: 0)"),
        io: z.number().int().optional().default(500).describe("IO weight (default: 500)"),
        databases_limit: z
          .number()
          .int()
          .min(0)
          .optional()
          .default(0)
          .describe("Max databases (default: 0)"),
        allocations_limit: z
          .number()
          .int()
          .min(0)
          .optional()
          .default(0)
          .describe("Max allocations (default: 0)"),
        backups_limit: z
          .number()
          .int()
          .min(0)
          .optional()
          .default(0)
          .describe("Max backups (default: 0)"),
        allocation_id: z.number().int().positive().describe("Default allocation ID for the server"),
        environment: z
          .record(z.string(), z.string())
          .optional()
          .describe("Environment variables for the egg"),
      }),
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const body = {
          name: params.name,
          user: params.user,
          egg: params.egg,
          docker_image: params.docker_image,
          startup: params.startup,
          limits: {
            memory: params.memory,
            swap: params.swap,
            disk: params.disk,
            io: params.io,
            cpu: params.cpu,
          },
          feature_limits: {
            databases: params.databases_limit,
            allocations: params.allocations_limit,
            backups: params.backups_limit,
          },
          allocation: {
            default: params.allocation_id,
          },
          environment: params.environment,
        };

        const result = await client.createServer(body);
        return formatToolResponse(result);
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
