import { z } from "zod";
import { orderStatus } from "../client.js";
export function registerStatusTool(server) {
    server.registerTool("check_status", {
        description: "Check the status of a SiteLauncher order by transaction hash. Useful for custom domain orders that take time to complete (DNS propagation, SSL setup).",
        inputSchema: {
            tx_hash: z.string().describe("The USDC payment transaction hash used when deploying"),
        },
    }, async (args) => {
        try {
            const result = await orderStatus(args.tx_hash);
            if (result.error) {
                return {
                    content: [{ type: "text", text: `Status check failed: ${result.error}` }],
                    isError: true,
                };
            }
            const lines = [`Order status for tx: ${args.tx_hash}`];
            if (result.stage)
                lines.push(`Stage: ${result.stage}`);
            if (result.completed !== undefined)
                lines.push(`Completed: ${result.completed}`);
            // Include any other fields from the response
            for (const [k, v] of Object.entries(result)) {
                if (!["error", "stage", "completed"].includes(k) && v !== null && v !== undefined) {
                    lines.push(`${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`);
                }
            }
            return { content: [{ type: "text", text: lines.join("\n") }] };
        }
        catch (err) {
            return {
                content: [{ type: "text", text: `Error: ${err instanceof Error ? err.message : String(err)}` }],
                isError: true,
            };
        }
    });
}
