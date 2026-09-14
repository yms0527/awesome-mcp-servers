import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerExportEggTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "export_egg",
    {
      description:
        "Export an egg as JSON that can be imported into another Pterodactyl panel (admin action). Returns the complete egg configuration including variables, install script, and Docker settings in the standard Pterodactyl egg export format. Use list_nests and list_eggs to find the nest_id and egg_id. Requires Application API key.",
      inputSchema: z.object({
        nest_id: z
          .number()
          .int()
          .positive()
          .describe("Nest ID that contains the egg (from list_nests)"),
        egg_id: z.number().int().positive().describe("Egg ID to export (from list_eggs)"),
      }),
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async (params) => {
      try {
        const egg = await client.getEgg(params.nest_id, params.egg_id);

        const exportData = {
          _comment: "DO NOT EDIT: FILE GENERATED AUTOMATICALLY BY PTERODACTYL PANEL",
          meta: {
            version: "PTDL_v2",
            update_url: null,
          },
          exported_at: new Date().toISOString(),
          name: egg.name,
          author: egg.author,
          description: egg.description,
          features: null,
          docker_images: egg.docker_images,
          file_denylist: [],
          startup: egg.startup,
          config: {
            files: egg.config_files,
            startup: egg.config_startup,
            logs: egg.config_logs,
            stop: egg.config_stop,
          },
          scripts: {
            installation: {
              script: egg.script_install,
              container: egg.script_container,
              entrypoint: egg.script_entry,
            },
          },
          variables: (egg.variables ?? []).map((v) => ({
            name: v.name,
            description: v.description,
            env_variable: v.env_variable,
            default_value: v.default_value,
            user_viewable: v.user_viewable,
            user_editable: v.user_editable,
            rules: v.rules,
          })),
        };

        return formatToolResponse(exportData);
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
