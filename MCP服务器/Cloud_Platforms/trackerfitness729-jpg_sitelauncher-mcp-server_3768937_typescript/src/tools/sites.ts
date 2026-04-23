import { z } from "zod";
import { mySites } from "../client.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerSitesTool(server: McpServer) {
  server.registerTool("list_sites", {
    description: "List all websites owned by a specific wallet address.",
    inputSchema: {
      wallet: z.string().describe("Wallet address (e.g. '0x...')"),
    },
  }, async (args) => {
    try {
      const result = await mySites(args.wallet);

      if (!result.sites.length) {
        return { content: [{ type: "text" as const, text: `No sites found for wallet ${args.wallet}` }] };
      }

      const lines = [`${result.count} site(s) for wallet ${args.wallet}:\n`];
      for (const site of result.sites) {
        const domain = site.domain || site.subdomain || "unknown";
        lines.push(`- ${domain}`);
        if (site.config && typeof site.config === "object") {
          const cfg = site.config as Record<string, unknown>;
          if (cfg.token_name) lines.push(`  Name: ${cfg.token_name}`);
        }
      }

      return { content: [{ type: "text" as const, text: lines.join("\n") }] };
    } catch (err) {
      return {
        content: [{ type: "text" as const, text: `Error: ${err instanceof Error ? err.message : String(err)}` }],
        isError: true,
      };
    }
  });
}
