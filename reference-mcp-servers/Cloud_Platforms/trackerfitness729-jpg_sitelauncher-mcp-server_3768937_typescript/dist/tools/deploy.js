import { z } from "zod";
import { deploySite } from "../client.js";
export function registerDeployTool(server) {
    server.registerTool("deploy_site", {
        description: "Deploy a website via SiteLauncher. Requires a USDC payment transaction hash on Base chain. The agent must send 1 USDC to the SiteLauncher wallet BEFORE calling this tool.",
        inputSchema: {
            site_name: z.string().describe("Subdomain name (e.g. 'my-project')"),
            site_type: z.enum(["agent", "degen"]).describe("Template style: 'agent' for AI agent pages, 'degen' for memecoin/token pages"),
            token_name: z.string().describe("Project or token name"),
            description: z.string().describe("Short project description"),
            tx_hash: z.string().describe("USDC payment transaction hash on Base chain"),
            parent_domain: z.string().optional().describe("Parent domain (default: sitelauncher.xyz). Options: sitelauncher.xyz, lobstersite.xyz, lobsteragent.xyz, blobster.xyz, clawbster.xyz"),
            logo_url: z.string().optional().describe("URL to logo image"),
            twitter: z.string().optional().describe("Twitter/X URL"),
            telegram: z.string().optional().describe("Telegram URL"),
            discord: z.string().optional().describe("Discord URL"),
            contract_address: z.string().optional().describe("Token contract address"),
            chain: z.string().optional().describe("Blockchain name (default: base)"),
            primary_color: z.string().optional().describe("Hex color code (e.g. '#ff6600')"),
            secondary_color: z.string().optional().describe("Hex color code (e.g. '#333333')"),
        },
    }, async (args) => {
        try {
            const result = await deploySite({
                service: args.site_type === "agent" ? "instant-agent" : "instant-degen",
                txHash: args.tx_hash,
                subdomain: args.site_name,
                token_name: args.token_name,
                description: args.description,
                parent_domain: args.parent_domain || "sitelauncher.xyz",
                logo_url: args.logo_url,
                twitter_url: args.twitter,
                telegram_url: args.telegram,
                discord_url: args.discord,
                contract_address: args.contract_address,
                chain: args.chain,
                primary_color: args.primary_color,
                secondary_color: args.secondary_color,
            });
            if (result.success) {
                let msg = `Site deployed successfully!\n\nURL: ${result.url}`;
                if (result.admin_token) {
                    msg += `\n\nIMPORTANT: Save this admin token - you need it to update your site later:\n${result.admin_token}`;
                }
                if (result.warnings?.length) {
                    msg += `\n\nWarnings:\n${result.warnings.join("\n")}`;
                }
                return { content: [{ type: "text", text: msg }] };
            }
            else {
                return {
                    content: [{ type: "text", text: `Deploy failed: ${result.error || "Unknown error"}` }],
                    isError: true,
                };
            }
        }
        catch (err) {
            return {
                content: [{ type: "text", text: `Error: ${err instanceof Error ? err.message : String(err)}` }],
                isError: true,
            };
        }
    });
}
