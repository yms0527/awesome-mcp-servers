import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PterodactylApiError } from "../../../src/client/errors.js";
import type { PterodactylClient } from "../../../src/client/pterodactyl.client.js";
import { registerReadFileTool } from "../../../src/tools/read-file.js";
import { createMockClient } from "../../fixtures/mock-client.js";

describe("read_file tool", () => {
  let mcpServer: McpServer;
  let client: Client;
  let mockClient: ReturnType<typeof createMockClient>;

  beforeEach(async () => {
    mockClient = createMockClient();
    mcpServer = new McpServer({ name: "test", version: "0.0.1" });
    registerReadFileTool(mcpServer, mockClient as unknown as PterodactylClient);

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await mcpServer.connect(serverTransport);

    client = new Client({ name: "test-client", version: "0.0.1" });
    await client.connect(clientTransport);
  });

  afterEach(async () => {
    await client.close();
    await mcpServer.close();
  });

  it("should read file content successfully", async () => {
    const fileContent = "server-port=25565\nmotd=A Minecraft Server\nonline-mode=true";
    mockClient.readFile.mockResolvedValue(fileContent);

    const result = await client.callTool({
      name: "read_file",
      arguments: { server_identifier: "abc123", file_path: "/server.properties" },
    });

    expect(mockClient.readFile).toHaveBeenCalledWith("abc123", "/server.properties");
    expect(result.isError).toBeUndefined();

    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.content).toBe(fileContent);
    expect(parsed.file_path).toBe("/server.properties");
    expect(parsed.server_identifier).toBe("abc123");
  });

  it("should handle empty file content", async () => {
    mockClient.readFile.mockResolvedValue("");

    const result = await client.callTool({
      name: "read_file",
      arguments: { server_identifier: "abc123", file_path: "/empty.txt" },
    });

    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.content).toBe("");
  });

  it("should return error when file not found", async () => {
    mockClient.readFile.mockRejectedValue(
      new PterodactylApiError(404, "NOT_FOUND", "The requested resource was not found."),
    );

    const result = await client.callTool({
      name: "read_file",
      arguments: { server_identifier: "abc123", file_path: "/nonexistent.txt" },
    });

    expect(result.isError).toBe(true);
    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.error).toBe("NOT_FOUND");
  });
});
