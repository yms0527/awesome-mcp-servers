import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PterodactylApiError } from "../../../src/client/errors.js";
import type { PterodactylClient } from "../../../src/client/pterodactyl.client.js";
import { registerWriteFileTool } from "../../../src/tools/write-file.js";
import { createMockClient } from "../../fixtures/mock-client.js";

describe("write_file tool", () => {
  let mcpServer: McpServer;
  let client: Client;
  let mockClient: ReturnType<typeof createMockClient>;

  beforeEach(async () => {
    mockClient = createMockClient();
    mcpServer = new McpServer({ name: "test", version: "0.0.1" });
    registerWriteFileTool(mcpServer, mockClient as unknown as PterodactylClient);

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await mcpServer.connect(serverTransport);

    client = new Client({ name: "test-client", version: "0.0.1" });
    await client.connect(clientTransport);
  });

  afterEach(async () => {
    await client.close();
    await mcpServer.close();
  });

  it("should write file successfully", async () => {
    mockClient.writeFile.mockResolvedValue(undefined);

    const result = await client.callTool({
      name: "write_file",
      arguments: {
        server_identifier: "abc123",
        file_path: "/server.properties",
        content: "server-port=25565\nmotd=Hello",
      },
    });

    expect(mockClient.writeFile).toHaveBeenCalledWith(
      "abc123",
      "/server.properties",
      "server-port=25565\nmotd=Hello",
    );
    expect(result.isError).toBeUndefined();

    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.file_path).toBe("/server.properties");
    expect(parsed.server_identifier).toBe("abc123");
  });

  it("should return error when server not found", async () => {
    mockClient.writeFile.mockRejectedValue(
      new PterodactylApiError(404, "NOT_FOUND", "The requested resource was not found."),
    );

    const result = await client.callTool({
      name: "write_file",
      arguments: {
        server_identifier: "invalid",
        file_path: "/test.txt",
        content: "data",
      },
    });

    expect(result.isError).toBe(true);
    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.error).toBe("NOT_FOUND");
  });

  it("should handle empty file content", async () => {
    mockClient.writeFile.mockResolvedValue(undefined);

    const result = await client.callTool({
      name: "write_file",
      arguments: {
        server_identifier: "abc123",
        file_path: "/empty.txt",
        content: "",
      },
    });

    expect(mockClient.writeFile).toHaveBeenCalledWith("abc123", "/empty.txt", "");
    expect(result.isError).toBeUndefined();
  });
});
