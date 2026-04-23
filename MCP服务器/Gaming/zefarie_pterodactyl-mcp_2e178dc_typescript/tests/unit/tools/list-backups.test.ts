import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PterodactylApiError } from "../../../src/client/errors.js";
import type { PterodactylClient } from "../../../src/client/pterodactyl.client.js";
import { registerListBackupsTool } from "../../../src/tools/list-backups.js";
import { createMockClient } from "../../fixtures/mock-client.js";
import { createBackup } from "../../fixtures/server.fixture.js";

describe("list_backups tool", () => {
  let mcpServer: McpServer;
  let client: Client;
  let mockClient: ReturnType<typeof createMockClient>;

  beforeEach(async () => {
    mockClient = createMockClient();
    mcpServer = new McpServer({ name: "test", version: "0.0.1" });
    registerListBackupsTool(mcpServer, mockClient as unknown as PterodactylClient);

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await mcpServer.connect(serverTransport);

    client = new Client({ name: "test-client", version: "0.0.1" });
    await client.connect(clientTransport);
  });

  afterEach(async () => {
    await client.close();
    await mcpServer.close();
  });

  it("should list backups with correct size conversion", async () => {
    const backup1 = createBackup({
      uuid: "uuid-1",
      name: "Daily Backup",
      bytes: 104857600,
      is_successful: true,
      is_locked: false,
    });
    const backup2 = createBackup({
      uuid: "uuid-2",
      name: "Before Update",
      bytes: 209715200,
      is_successful: true,
      is_locked: true,
    });
    mockClient.listBackups.mockResolvedValue([backup1, backup2]);

    const result = await client.callTool({
      name: "list_backups",
      arguments: { server_identifier: "abc123" },
    });

    expect(mockClient.listBackups).toHaveBeenCalledWith("abc123");
    expect(result.isError).toBeUndefined();

    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.backups).toHaveLength(2);
    expect(parsed.count).toBe(2);

    expect(parsed.backups[0].uuid).toBe("uuid-1");
    expect(parsed.backups[0].size_mb).toBe(100);
    expect(parsed.backups[0].is_successful).toBe(true);
    expect(parsed.backups[0].is_locked).toBe(false);

    expect(parsed.backups[1].uuid).toBe("uuid-2");
    expect(parsed.backups[1].size_mb).toBe(200);
    expect(parsed.backups[1].is_locked).toBe(true);
  });

  it("should return empty list when no backups exist", async () => {
    mockClient.listBackups.mockResolvedValue([]);

    const result = await client.callTool({
      name: "list_backups",
      arguments: { server_identifier: "abc123" },
    });

    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.backups).toHaveLength(0);
    expect(parsed.count).toBe(0);
  });

  it("should return error when API fails", async () => {
    mockClient.listBackups.mockRejectedValue(
      new PterodactylApiError(404, "NOT_FOUND", "The requested resource was not found."),
    );

    const result = await client.callTool({
      name: "list_backups",
      arguments: { server_identifier: "invalid" },
    });

    expect(result.isError).toBe(true);
  });
});
