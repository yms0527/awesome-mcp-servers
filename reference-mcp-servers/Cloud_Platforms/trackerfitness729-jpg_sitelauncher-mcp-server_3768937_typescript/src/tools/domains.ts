import { z } from "zod";
import { parentDomains, domainCapacity } from "../client.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerDomainTools(server: McpServer) {
  server.registerTool("list_domains", {
    description: "List available parent domains for instant subdomain deployment.",
    inputSchema: {},
  }, async () => {
    try {
      const result = await parentDomains();
      const msg = `Available parent domains:\n${result.domains.map(d => `- ${d}`).join("\n")}`;
      return { content: [{ type: "text" as const, text: msg }] };
    } catch (err) {
      return {
        content: [{ type: "text" as const, text: `Error: ${err instanceof Error ? err.message : String(err)}` }],
        isError: true,
      };
    }
  });

  server.registerTool("domain_capacity", {
    description: "Check how many custom domain registrations are available today. Porkbun limits to 10 registrations per day.",
    inputSchema: {},
  }, async () => {
    try {
      const result = await domainCapacity();
      const lines = [
        `Domain registration capacity:`,
        `Available: ${result.available ? "Yes" : "No"}`,
        `Remaining: ${result.remaining}/${result.limit}`,
      ];
      if (result.resets_in) lines.push(`Resets in: ${result.resets_in}`);
      return { content: [{ type: "text" as const, text: lines.join("\n") }] };
    } catch (err) {
      return {
        content: [{ type: "text" as const, text: `Error: ${err instanceof Error ? err.message : String(err)}` }],
        isError: true,
      };
    }
  });
}
