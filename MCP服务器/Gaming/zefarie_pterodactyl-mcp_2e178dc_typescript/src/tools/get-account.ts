import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v4";
import type { PterodactylClient } from "../client/pterodactyl.client.js";
import { formatToolError } from "../lib/errors.js";
import { formatToolResponse } from "../lib/response.js";

export function registerGetAccountTool(server: McpServer, client: PterodactylClient): void {
  server.registerTool(
    "get_account",
    {
      description:
        "Get the current authenticated user's account information (username, email, admin status, language). Use to verify which account the Client API key belongs to. Requires Client API key.",
      inputSchema: z.object({}),
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async () => {
      try {
        const account = await client.getAccount();
        return formatToolResponse(account);
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
