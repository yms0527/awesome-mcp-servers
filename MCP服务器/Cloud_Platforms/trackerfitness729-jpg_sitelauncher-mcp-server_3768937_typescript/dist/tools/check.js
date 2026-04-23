import { z } from "zod";
import { checkDomain } from "../client.js";
export function registerCheckTool(server) {
    server.registerTool("check_availability", {
        description: "Check if a custom domain name is available for registration via Porkbun. Rate limited to 1 check per 10 seconds. For instant subdomains, no pre-check is needed.",
        inputSchema: {
            name: z.string().describe("Domain name to check (e.g. 'my-project' - .xyz suffix optional)"),
        },
    }, async (args) => {
        try {
            const result = await checkDomain(args.name);
            if (result.error) {
                return {
                    content: [{ type: "text", text: `Check failed: ${result.error}` }],
                    isError: true,
                };
            }
            let msg = `Domain "${args.name}": `;
            if (result.available) {
                msg += "AVAILABLE";
                if (result.premium)
                    msg += " (premium pricing)";
            }
            else {
                msg += "NOT AVAILABLE (already registered)";
            }
            return { content: [{ type: "text", text: msg }] };
        }
        catch (err) {
            return {
                content: [{ type: "text", text: `Error: ${err instanceof Error ? err.message : String(err)}` }],
                isError: true,
            };
        }
    });
}
