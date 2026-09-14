import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PterodactylApiError } from "../../../src/client/errors.js";
import type { PterodactylClient } from "../../../src/client/pterodactyl.client.js";
import { registerListServersTool } from "../../../src/tools/list-servers.js";
import { createMockClient } from "../../fixtures/mock-client.js";
import { createPagination, createServer } from "../../fixtures/server.fixture.js";

describe("list_servers tool", () => {
  let mcpServer: McpServer;
  let client: Client;
  let mockClient: ReturnType<typeof createMockClient>;

  beforeEach(async () => {
    mockClient = createMockClient();
    mcpServer = new McpServer({ name: "test", version: "0.0.1" });
    registerListServersTool(mcpServer, mockClient as unknown as PterodactylClient);

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await mcpServer.connect(serverTransport);

    client = new Client({ name: "test-client", version: "0.0.1" });
    await client.connect(clientTransport);
  });

  afterEach(async () => {
    await client.close();
    await mcpServer.close();
  });

  it("should list servers with default pagination", async () => {
    const server1 = createServer({ id: 1, name: "Survival SMP" });
    const server2 = createServer({ id: 2, name: "Creative", suspended: true });
    const pagination = createPagination({ total: 2, count: 2 });

    mockClient.listServers.mockResolvedValue({
      servers: [server1, server2],
      pagination,
    });

    const result = await client.callTool({ name: "list_servers", arguments: {} });

    expect(mockClient.listServers).toHaveBeenCalledWith({});
    expect(result.isError).toBeUndefined();

    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.servers).toHaveLength(2);
    expect(parsed.servers[0].id).toBe(1);
    expect(parsed.servers[0].name).toBe("Survival SMP");
    expect(parsed.servers[1].id).toBe(2);
    expect(parsed.servers[1].suspended).toBe(true);
    expect(parsed.pagination.total).toBe(2);
    expect(parsed.pagination.has_next).toBe(false);
    expect(parsed.pagination.has_previous).toBe(false);
  });

  it("should list servers with custom pagination", async () => {
    const server1 = createServer({ id: 3 });
    const pagination = createPagination({
      total: 5,
      count: 1,
      per_page: 1,
      current_page: 2,
      total_pages: 5,
    });

    mockClient.listServers.mockResolvedValue({
      servers: [server1],
      pagination,
    });

    const result = await client.callTool({
      name: "list_servers",
      arguments: { page: 2, per_page: 1 },
    });

    expect(mockClient.listServers).toHaveBeenCalledWith({ page: 2, per_page: 1 });

    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.servers).toHaveLength(1);
    expect(parsed.pagination.current_page).toBe(2);
    expect(parsed.pagination.total_pages).toBe(5);
    expect(parsed.pagination.per_page).toBe(1);
    expect(parsed.pagination.has_next).toBe(true);
    expect(parsed.pagination.has_previous).toBe(true);
  });

  it("should map server status null to 'running'", async () => {
    const server = createServer({ id: 1, status: null });
    const pagination = createPagination();

    mockClient.listServers.mockResolvedValue({
      servers: [server],
      pagination,
    });

    const result = await client.callTool({ name: "list_servers", arguments: {} });
    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);

    expect(parsed.servers[0].status).toBe("normal");
  });

  it("should return error when API fails with 401", async () => {
    mockClient.listServers.mockRejectedValue(
      new PterodactylApiError(401, "UNAUTHORIZED", "Invalid or missing API key."),
    );

    const result = await client.callTool({ name: "list_servers", arguments: {} });

    expect(result.isError).toBe(true);
    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.error).toBe("UNAUTHORIZED");
    expect(parsed.status).toBe(401);
  });
});
