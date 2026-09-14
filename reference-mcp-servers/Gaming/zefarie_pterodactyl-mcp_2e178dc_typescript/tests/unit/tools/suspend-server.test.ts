import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PterodactylApiError } from "../../../src/client/errors.js";
import type { PterodactylClient } from "../../../src/client/pterodactyl.client.js";
import { registerSuspendServerTool } from "../../../src/tools/suspend-server.js";
import { createMockClient } from "../../fixtures/mock-client.js";

describe("suspend_server tool", () => {
  let mcpServer: McpServer;
  let client: Client;
  let mockClient: ReturnType<typeof createMockClient>;

  beforeEach(async () => {
    mockClient = createMockClient();
    mcpServer = new McpServer({ name: "test", version: "0.0.1" });
    registerSuspendServerTool(mcpServer, mockClient as unknown as PterodactylClient);

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await mcpServer.connect(serverTransport);

    client = new Client({ name: "test-client", version: "0.0.1" });
    await client.connect(clientTransport);
  });

  afterEach(async () => {
    await client.close();
    await mcpServer.close();
  });

  it("should suspend server successfully", async () => {
    mockClient.suspendServer.mockResolvedValue(undefined);

    const result = await client.callTool({
      name: "suspend_server",
      arguments: { server_id: 2 },
    });

    expect(mockClient.suspendServer).toHaveBeenCalledWith(2);
    expect(result.isError).toBeUndefined();

    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.message).toBe("Server 2 has been suspended.");
    expect(parsed.server_id).toBe(2);
  });

  it("should return error when server not found", async () => {
    mockClient.suspendServer.mockRejectedValue(
      new PterodactylApiError(404, "NOT_FOUND", "The requested resource was not found."),
    );

    const result = await client.callTool({
      name: "suspend_server",
      arguments: { server_id: 999 },
    });

    expect(mockClient.suspendServer).toHaveBeenCalledWith(999);
    expect(result.isError).toBe(true);

    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.error).toBe("NOT_FOUND");
    expect(parsed.status).toBe(404);
  });
});
