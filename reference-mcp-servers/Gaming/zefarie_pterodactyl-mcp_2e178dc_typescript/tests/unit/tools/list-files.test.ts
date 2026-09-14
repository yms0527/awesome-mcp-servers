import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PterodactylApiError } from "../../../src/client/errors.js";
import type { PterodactylClient } from "../../../src/client/pterodactyl.client.js";
import { registerListFilesTool } from "../../../src/tools/list-files.js";
import { createMockClient } from "../../fixtures/mock-client.js";
import { createDirectory, createFile } from "../../fixtures/server.fixture.js";

describe("list_files tool", () => {
  let mcpServer: McpServer;
  let client: Client;
  let mockClient: ReturnType<typeof createMockClient>;

  beforeEach(async () => {
    mockClient = createMockClient();
    mcpServer = new McpServer({ name: "test", version: "0.0.1" });
    registerListFilesTool(mcpServer, mockClient as unknown as PterodactylClient);

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await mcpServer.connect(serverTransport);

    client = new Client({ name: "test-client", version: "0.0.1" });
    await client.connect(clientTransport);
  });

  afterEach(async () => {
    await client.close();
    await mcpServer.close();
  });

  it("should list files and directories with correct formatting", async () => {
    const file = createFile({ name: "server.properties", size: 2048 });
    const dir = createDirectory({ name: "plugins" });
    mockClient.listFiles.mockResolvedValue([file, dir]);

    const result = await client.callTool({
      name: "list_files",
      arguments: { server_identifier: "abc123" },
    });

    expect(mockClient.listFiles).toHaveBeenCalledWith("abc123", undefined);
    expect(result.isError).toBeUndefined();

    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.files).toHaveLength(2);
    expect(parsed.count).toBe(2);
    expect(parsed.directory).toBe("/");

    expect(parsed.files[0].name).toBe("server.properties");
    expect(parsed.files[0].type).toBe("file");
    expect(parsed.files[0].size_bytes).toBe(2048);

    expect(parsed.files[1].name).toBe("plugins");
    expect(parsed.files[1].type).toBe("directory");
  });

  it("should list files in a specific directory", async () => {
    const file = createFile({ name: "config.yml", size: 512 });
    mockClient.listFiles.mockResolvedValue([file]);

    const result = await client.callTool({
      name: "list_files",
      arguments: { server_identifier: "abc123", directory: "/plugins/Essentials" },
    });

    expect(mockClient.listFiles).toHaveBeenCalledWith("abc123", "/plugins/Essentials");

    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.directory).toBe("/plugins/Essentials");
    expect(parsed.files).toHaveLength(1);
  });

  it("should return empty list for empty directory", async () => {
    mockClient.listFiles.mockResolvedValue([]);

    const result = await client.callTool({
      name: "list_files",
      arguments: { server_identifier: "abc123", directory: "/empty" },
    });

    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.files).toHaveLength(0);
    expect(parsed.count).toBe(0);
  });

  it("should return error when server not found", async () => {
    mockClient.listFiles.mockRejectedValue(
      new PterodactylApiError(404, "NOT_FOUND", "The requested resource was not found."),
    );

    const result = await client.callTool({
      name: "list_files",
      arguments: { server_identifier: "invalid" },
    });

    expect(result.isError).toBe(true);
  });
});
