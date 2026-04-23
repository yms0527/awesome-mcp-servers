import type { Server } from "@modelcontextprotocol/sdk/server/index.js";

export function setupMcpServerGracefulShutdown(server: Server) {
  process.on("SIGINT", async () => {
    await server.close();
    process.exit(0);
  });
}
