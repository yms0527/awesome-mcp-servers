import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PterodactylApiError } from "../../../src/client/errors.js";
import type { PterodactylClient } from "../../../src/client/pterodactyl.client.js";
import { registerDeleteServerTool } from "../../../src/tools/delete-server.js";
import { createMockClient } from "../../fixtures/mock-client.js";

describe("delete_server tool", () => {
  let mcpServer: McpServer;
  let client: Client;
  let mockClient: ReturnType<typeof createMockClient>;

  beforeEach(async () => {
    mockClient = createMockClient();
    mcpServer = new McpServer({ name: "test", version: "0.0.1" });
    registerDeleteServerTool(mcpServer, mockClient as unknown as PterodactylClient);

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await mcpServer.connect(serverTransport);

    client = new Client({ name: "test-client", version: "0.0.1" });
    await client.connect(clientTransport);
  });

  afterEach(async () => {
    await client.close();
    await mcpServer.close();
  });

  it("should delete server successfully", async () => {
    mockClient.deleteServer.mockResolvedValue(undefined);

    const result = await client.callTool({
      name: "delete_server",
      arguments: { server_id: 5 },
    });

    expect(mockClient.deleteServer).toHaveBeenCalledWith(5);
    expect(result.isError).toBeUndefined();

    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.message).toBe("Server 5 has been deleted.");
    expect(parsed.server_id).toBe(5);
  });

  it("should return error when server not found", async () => {
    mockClient.deleteServer.mockRejectedValue(
      new PterodactylApiError(404, "NOT_FOUND", "The requested resource was not found."),
    );

    const result = await client.callTool({
      name: "delete_server",
      arguments: { server_id: 999 },
    });

    expect(result.isError).toBe(true);
    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.error).toBe("NOT_FOUND");
    expect(parsed.status).toBe(404);
  });

  it("should return error when unauthorized", async () => {
    mockClient.deleteServer.mockRejectedValue(
      new PterodactylApiError(403, "FORBIDDEN", "Permission denied."),
    );

    const result = await client.callTool({
      name: "delete_server",
      arguments: { server_id: 1 },
    });

    expect(result.isError).toBe(true);
    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.error).toBe("FORBIDDEN");
    expect(parsed.status).toBe(403);
  });
});
