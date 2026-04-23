import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PterodactylApiError } from "../../../src/client/errors.js";
import type { PterodactylClient } from "../../../src/client/pterodactyl.client.js";
import { registerCreateServerTool } from "../../../src/tools/create-server.js";
import { createMockClient } from "../../fixtures/mock-client.js";
import { createServer } from "../../fixtures/server.fixture.js";

describe("create_server tool", () => {
  let mcpServer: McpServer;
  let client: Client;
  let mockClient: ReturnType<typeof createMockClient>;

  beforeEach(async () => {
    mockClient = createMockClient();
    mcpServer = new McpServer({ name: "test", version: "0.0.1" });
    registerCreateServerTool(mcpServer, mockClient as unknown as PterodactylClient);

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await mcpServer.connect(serverTransport);

    client = new Client({ name: "test-client", version: "0.0.1" });
    await client.connect(clientTransport);
  });

  afterEach(async () => {
    await client.close();
    await mcpServer.close();
  });

  const validParams = {
    name: "New Server",
    user: 1,
    egg: 1,
    docker_image: "ghcr.io/pterodactyl/yolks:java_17",
    startup: "java -Xms128M -Xmx4096M -jar server.jar",
    memory: 4096,
    disk: 20480,
    cpu: 200,
    allocation_id: 1,
  };

  it("should create server successfully with required params", async () => {
    const serverAttrs = createServer({ id: 10, name: "New Server" });
    mockClient.createServer.mockResolvedValue(serverAttrs);

    const result = await client.callTool({
      name: "create_server",
      arguments: validParams,
    });

    expect(mockClient.createServer).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "New Server",
        user: 1,
        egg: 1,
        docker_image: "ghcr.io/pterodactyl/yolks:java_17",
        limits: expect.objectContaining({
          memory: 4096,
          disk: 20480,
          cpu: 200,
        }),
        allocation: { default: 1 },
      }),
    );
    expect(result.isError).toBeUndefined();

    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.id).toBe(10);
    expect(parsed.name).toBe("New Server");
  });

  it("should pass optional environment variables", async () => {
    const serverAttrs = createServer({ id: 11 });
    mockClient.createServer.mockResolvedValue(serverAttrs);

    const result = await client.callTool({
      name: "create_server",
      arguments: {
        ...validParams,
        environment: { SERVER_JARFILE: "paper.jar", MINECRAFT_VERSION: "1.20.4" },
      },
    });

    expect(mockClient.createServer).toHaveBeenCalledWith(
      expect.objectContaining({
        environment: { SERVER_JARFILE: "paper.jar", MINECRAFT_VERSION: "1.20.4" },
      }),
    );
    expect(result.isError).toBeUndefined();
  });

  it("should use default values for optional numeric params", async () => {
    const serverAttrs = createServer({ id: 12 });
    mockClient.createServer.mockResolvedValue(serverAttrs);

    await client.callTool({
      name: "create_server",
      arguments: validParams,
    });

    expect(mockClient.createServer).toHaveBeenCalledWith(
      expect.objectContaining({
        limits: expect.objectContaining({
          swap: 0,
          io: 500,
        }),
        feature_limits: expect.objectContaining({
          databases: 0,
          allocations: 0,
          backups: 0,
        }),
      }),
    );
  });

  it("should return error when API fails", async () => {
    mockClient.createServer.mockRejectedValue(
      new PterodactylApiError(422, "API_ERROR", "Validation failed."),
    );

    const result = await client.callTool({
      name: "create_server",
      arguments: validParams,
    });

    expect(result.isError).toBe(true);
    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.error).toBe("API_ERROR");
  });
});
