import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PterodactylApiError } from "../../../src/client/errors.js";
import type { PterodactylClient } from "../../../src/client/pterodactyl.client.js";
import { registerCreateUserTool } from "../../../src/tools/create-user.js";
import { createMockClient } from "../../fixtures/mock-client.js";
import { createUser } from "../../fixtures/server.fixture.js";

describe("create_user tool", () => {
  let mcpServer: McpServer;
  let client: Client;
  let mockClient: ReturnType<typeof createMockClient>;

  beforeEach(async () => {
    mockClient = createMockClient();
    mcpServer = new McpServer({ name: "test", version: "0.0.1" });
    registerCreateUserTool(mcpServer, mockClient as unknown as PterodactylClient);

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await mcpServer.connect(serverTransport);

    client = new Client({ name: "test-client", version: "0.0.1" });
    await client.connect(clientTransport);
  });

  afterEach(async () => {
    await client.close();
    await mcpServer.close();
  });

  it("should create a regular user successfully", async () => {
    const userAttrs = createUser({ id: 5, username: "newplayer", email: "new@example.com" });
    mockClient.createUser.mockResolvedValue(userAttrs);

    const result = await client.callTool({
      name: "create_user",
      arguments: {
        username: "newplayer",
        email: "new@example.com",
        password: "securepass123",
      },
    });

    expect(mockClient.createUser).toHaveBeenCalledWith({
      username: "newplayer",
      email: "new@example.com",
      password: "securepass123",
      root_admin: false,
    });
    expect(result.isError).toBeUndefined();

    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.id).toBe(5);
    expect(parsed.username).toBe("newplayer");
    expect(parsed.warning).toBeUndefined();
  });

  it("should include warning when creating root admin user", async () => {
    const userAttrs = createUser({ id: 6, username: "adminuser", root_admin: true });
    mockClient.createUser.mockResolvedValue(userAttrs);

    const result = await client.callTool({
      name: "create_user",
      arguments: {
        username: "adminuser",
        email: "admin@example.com",
        password: "securepass123",
        root_admin: true,
      },
    });

    expect(mockClient.createUser).toHaveBeenCalledWith(
      expect.objectContaining({ root_admin: true }),
    );
    expect(result.isError).toBeUndefined();

    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.warning).toBeDefined();
    expect(parsed.warning).toContain("root admin");
  });

  it("should return error when API fails with 422", async () => {
    mockClient.createUser.mockRejectedValue(
      new PterodactylApiError(422, "API_ERROR", "Validation failed: email already exists."),
    );

    const result = await client.callTool({
      name: "create_user",
      arguments: {
        username: "duplicate",
        email: "existing@example.com",
        password: "securepass123",
      },
    });

    expect(result.isError).toBe(true);
    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.error).toBe("API_ERROR");
  });
});
