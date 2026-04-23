import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PterodactylApiError } from "../../../src/client/errors.js";
import type { PterodactylClient } from "../../../src/client/pterodactyl.client.js";
import { registerGetServerTool } from "../../../src/tools/get-server.js";
import { createMockClient } from "../../fixtures/mock-client.js";
import { createServer } from "../../fixtures/server.fixture.js";

describe("get_server tool", () => {
  let mcpServer: McpServer;
  let client: Client;
  let mockClient: ReturnType<typeof createMockClient>;

  beforeEach(async () => {
    mockClient = createMockClient();
    mcpServer = new McpServer({ name: "test", version: "0.0.1" });
    registerGetServerTool(mcpServer, mockClient as unknown as PterodactylClient);

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await mcpServer.connect(serverTransport);

    client = new Client({ name: "test-client", version: "0.0.1" });
    await client.connect(clientTransport);
  });

  afterEach(async () => {
    await client.close();
    await mcpServer.close();
  });

  it("should return server details for valid numeric id", async () => {
    const server = createServer({
      id: 2,
      name: "Creative Plot",
      identifier: "xyz789",
      user: 3,
      node: 2,
      suspended: false,
    });

    mockClient.getServer.mockResolvedValue(server);

    const result = await client.callTool({
      name: "get_server",
      arguments: { server_id: 2 },
    });

    expect(mockClient.getServer).toHaveBeenCalledWith(2);
    expect(result.isError).toBeUndefined();

    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.id).toBe(2);
    expect(parsed.name).toBe("Creative Plot");
    expect(parsed.identifier).toBe("xyz789");
    expect(parsed.user).toBe(3);
    expect(parsed.node).toBe(2);
    expect(parsed.limits.memory).toBe(4096);
    expect(parsed.container.image).toBe("ghcr.io/pterodactyl/yolks:java_17");
  });

  it("should return error when server not found (404)", async () => {
    mockClient.getServer.mockRejectedValue(
      new PterodactylApiError(404, "NOT_FOUND", "The requested resource was not found."),
    );

    const result = await client.callTool({
      name: "get_server",
      arguments: { server_id: 999 },
    });

    expect(mockClient.getServer).toHaveBeenCalledWith(999);
    expect(result.isError).toBe(true);

    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.error).toBe("NOT_FOUND");
    expect(parsed.status).toBe(404);
  });
});
