import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerImportEggTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "import_egg",
    {
      description:
        "Import or create a new egg (server template) in a nest (admin action). Eggs define the Docker image, startup command, and configuration for a type of game server. Use list_nests to find the nest_id first. The egg will be available for creating new servers via create_server. Requires Application API key.",
      inputSchema: z.object({
        nest_id: z
          .number()
          .int()
          .positive()
          .describe("Nest ID to create the egg in (from list_nests)"),
        name: z.string().min(1).describe("Display name for the egg"),
        description: z.string().optional().describe("Description of what this egg runs"),
        docker_image: z.string().min(1).describe("Docker image to use (e.g. 'ghcr.io/image:tag')"),
        startup: z
          .string()
          .min(1)
          .describe(
            "Startup command with variable placeholders (e.g. 'java -jar {{SERVER_JARFILE}}')",
          ),
        config_from: z
          .number()
          .int()
          .positive()
          .optional()
          .describe("Egg ID to inherit configuration from"),
        config_stop: z.string().optional().describe("Stop command sent to the server process"),
        config_logs: z.string().optional().describe("JSON config for log parsing"),
        config_files: z.string().optional().describe("JSON config for file parser modifications"),
        config_startup: z.string().optional().describe("JSON config for startup detection"),
        script_container: z
          .string()
          .optional()
          .describe("Docker image for the install script (e.g. 'alpine:3.4')"),
        script_entry: z
          .string()
          .optional()
          .describe("Entrypoint for the install script (e.g. 'bash')"),
        script_install: z
          .string()
          .optional()
          .describe("Shell script executed during server installation"),
      }),
      annotations: { destructiveHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const body: Record<string, unknown> = {
          name: params.name,
          docker_image: params.docker_image,
          startup: params.startup,
        };

        if (params.description !== undefined) body.description = params.description;
        if (params.config_from !== undefined) body.config_from = params.config_from;
        if (params.config_stop !== undefined) body.config_stop = params.config_stop;
        if (params.config_logs !== undefined) body.config_logs = params.config_logs;
        if (params.config_files !== undefined) body.config_files = params.config_files;
        if (params.config_startup !== undefined) body.config_startup = params.config_startup;
        if (params.script_container !== undefined) body.script_container = params.script_container;
        if (params.script_entry !== undefined) body.script_entry = params.script_entry;
        if (params.script_install !== undefined) body.script_install = params.script_install;

        const result = await client.importEgg(params.nest_id, body);
        return formatToolResponse(result);
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
