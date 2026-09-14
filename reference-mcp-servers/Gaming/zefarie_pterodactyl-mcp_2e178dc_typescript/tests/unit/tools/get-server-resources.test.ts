import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PterodactylApiError } from "../../../src/client/errors.js";
import type { PterodactylClient } from "../../../src/client/pterodactyl.client.js";
import { registerGetServerResourcesTool } from "../../../src/tools/get-server-resources.js";
import { createMockClient } from "../../fixtures/mock-client.js";
import { createServerResources } from "../../fixtures/server.fixture.js";

describe("get_server_resources tool", () => {
  let mcpServer: McpServer;
  let client: Client;
  let mockClient: ReturnType<typeof createMockClient>;

  beforeEach(async () => {
    mockClient = createMockClient();
    mcpServer = new McpServer({ name: "test", version: "0.0.1" });
    registerGetServerResourcesTool(mcpServer, mockClient as unknown as PterodactylClient);

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await mcpServer.connect(serverTransport);

    client = new Client({ name: "test-client", version: "0.0.1" });
    await client.connect(clientTransport);
  });

  afterEach(async () => {
    await client.close();
    await mcpServer.close();
  });

  it("should return server resources with correct unit conversions", async () => {
    const resources = createServerResources({
      current_state: "running",
      is_suspended: false,
      resources: {
        memory_bytes: 2147483648,
        cpu_absolute: 45.5,
        disk_bytes: 5368709120,
        network_rx_bytes: 1073741824,
        network_tx_bytes: 536870912,
        uptime: 86400,
      },
    });
    mockClient.getServerResources.mockResolvedValue(resources);

    const result = await client.callTool({
      name: "get_server_resources",
      arguments: { server_identifier: "abc123" },
    });

    expect(mockClient.getServerResources).toHaveBeenCalledWith("abc123");
    expect(result.isError).toBeUndefined();

    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.state).toBe("running");
    expect(parsed.is_suspended).toBe(false);
    expect(parsed.cpu_percent).toBe(45.5);
    expect(parsed.memory_mb).toBe(2048);
    expect(parsed.disk_mb).toBe(5120);
    expect(parsed.network_rx_mb).toBe(1024);
    expect(parsed.network_tx_mb).toBe(512);
    expect(parsed.uptime_seconds).toBe(86400);
    expect(parsed.server_identifier).toBe("abc123");
  });

  it("should return resources for offline server", async () => {
    const resources = createServerResources({
      current_state: "offline",
      resources: {
        memory_bytes: 0,
        cpu_absolute: 0,
        disk_bytes: 1048576,
        network_rx_bytes: 0,
        network_tx_bytes: 0,
        uptime: 0,
      },
    });
    mockClient.getServerResources.mockResolvedValue(resources);

    const result = await client.callTool({
      name: "get_server_resources",
      arguments: { server_identifier: "xyz789" },
    });

    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.state).toBe("offline");
    expect(parsed.memory_mb).toBe(0);
    expect(parsed.cpu_percent).toBe(0);
    expect(parsed.uptime_seconds).toBe(0);
  });

  it("should return error when server not found", async () => {
    mockClient.getServerResources.mockRejectedValue(
      new PterodactylApiError(404, "NOT_FOUND", "The requested resource was not found."),
    );

    const result = await client.callTool({
      name: "get_server_resources",
      arguments: { server_identifier: "invalid" },
    });

    expect(result.isError).toBe(true);
    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.error).toBe("NOT_FOUND");
  });
});
