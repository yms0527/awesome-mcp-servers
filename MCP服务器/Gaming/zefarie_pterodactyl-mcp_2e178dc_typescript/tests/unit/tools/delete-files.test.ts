import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PterodactylApiError } from "../../../src/client/errors.js";
import type { PterodactylClient } from "../../../src/client/pterodactyl.client.js";
import { registerDeleteFilesTool } from "../../../src/tools/delete-files.js";
import { createMockClient } from "../../fixtures/mock-client.js";

describe("delete_files tool", () => {
  let mcpServer: McpServer;
  let client: Client;
  let mockClient: ReturnType<typeof createMockClient>;

  beforeEach(async () => {
    mockClient = createMockClient();
    mcpServer = new McpServer({ name: "test", version: "0.0.1" });
    registerDeleteFilesTool(mcpServer, mockClient as unknown as PterodactylClient);

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await mcpServer.connect(serverTransport);

    client = new Client({ name: "test-client", version: "0.0.1" });
    await client.connect(clientTransport);
  });

  afterEach(async () => {
    await client.close();
    await mcpServer.close();
  });

  it("should delete files successfully", async () => {
    mockClient.deleteFiles.mockResolvedValue(undefined);

    const result = await client.callTool({
      name: "delete_files",
      arguments: {
        server_identifier: "abc123",
        directory: "/",
        files: ["old-world.zip", "crash-reports"],
      },
    });

    expect(mockClient.deleteFiles).toHaveBeenCalledWith("abc123", "/", [
      "old-world.zip",
      "crash-reports",
    ]);
    expect(result.isError).toBeUndefined();

    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.deleted).toEqual(["old-world.zip", "crash-reports"]);
    expect(parsed.directory).toBe("/");
  });

  it("should delete a single file successfully", async () => {
    mockClient.deleteFiles.mockResolvedValue(undefined);

    const result = await client.callTool({
      name: "delete_files",
      arguments: {
        server_identifier: "abc123",
        directory: "/plugins",
        files: ["OldPlugin.jar"],
      },
    });

    expect(mockClient.deleteFiles).toHaveBeenCalledWith("abc123", "/plugins", ["OldPlugin.jar"]);

    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.message).toContain("1 item(s)");
  });

  it("should return error when API fails", async () => {
    mockClient.deleteFiles.mockRejectedValue(
      new PterodactylApiError(404, "NOT_FOUND", "The requested resource was not found."),
    );

    const result = await client.callTool({
      name: "delete_files",
      arguments: {
        server_identifier: "invalid",
        directory: "/",
        files: ["test.txt"],
      },
    });

    expect(result.isError).toBe(true);
    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.error).toBe("NOT_FOUND");
  });
});
