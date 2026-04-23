import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PterodactylApiError } from "../../../src/client/errors.js";
import type { PterodactylClient } from "../../../src/client/pterodactyl.client.js";
import { registerSendCommandTool } from "../../../src/tools/send-command.js";
import { createMockClient } from "../../fixtures/mock-client.js";

describe("send_command tool", () => {
  let mcpServer: McpServer;
  let client: Client;
  let mockClient: ReturnType<typeof createMockClient>;

  beforeEach(async () => {
    mockClient = createMockClient();
    mcpServer = new McpServer({ name: "test", version: "0.0.1" });
    registerSendCommandTool(mcpServer, mockClient as unknown as PterodactylClient);

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await mcpServer.connect(serverTransport);

    client = new Client({ name: "test-client", version: "0.0.1" });
    await client.connect(clientTransport);
  });

  afterEach(async () => {
    await client.close();
    await mcpServer.close();
  });

  it("should send a safe command successfully", async () => {
    mockClient.sendCommand.mockResolvedValue(undefined);

    const result = await client.callTool({
      name: "send_command",
      arguments: { server_identifier: "abc123", command: "say Hello World" },
    });

    expect(mockClient.sendCommand).toHaveBeenCalledWith("abc123", "say Hello World");
    expect(result.isError).toBeUndefined();

    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.server_identifier).toBe("abc123");
    expect(parsed.command).toBe("say Hello World");
    expect(parsed.warning).toBeUndefined();
  });

  it("should include warning when command matches dangerous pattern", async () => {
    mockClient.sendCommand.mockResolvedValue(undefined);

    const result = await client.callTool({
      name: "send_command",
      arguments: { server_identifier: "abc123", command: "op Steve" },
    });

    expect(mockClient.sendCommand).toHaveBeenCalled();
    expect(result.isError).toBeUndefined();

    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.warning).toBeDefined();
    expect(parsed.matched_patterns).toBeDefined();
    expect(parsed.matched_patterns.length).toBeGreaterThan(0);
  });

  it("should include warning for stop command", async () => {
    mockClient.sendCommand.mockResolvedValue(undefined);

    const result = await client.callTool({
      name: "send_command",
      arguments: { server_identifier: "abc123", command: "stop" },
    });

    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.warning).toBeDefined();
    expect(parsed.matched_patterns).toContain("Stops the server process");
  });

  it("should include warning for commands with shell metacharacters", async () => {
    mockClient.sendCommand.mockResolvedValue(undefined);

    const result = await client.callTool({
      name: "send_command",
      arguments: { server_identifier: "abc123", command: "say hello; rm -rf" },
    });

    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.warning).toBeDefined();
    expect(parsed.matched_patterns).toContain("Contains shell metacharacters");
  });

  it("should strip null bytes from command", async () => {
    mockClient.sendCommand.mockResolvedValue(undefined);

    const result = await client.callTool({
      name: "send_command",
      arguments: { server_identifier: "abc123", command: "say\x00hello" },
    });

    expect(mockClient.sendCommand).toHaveBeenCalledWith("abc123", "sayhello");

    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.success).toBe(true);
  });

  it("should return error when API fails with 404", async () => {
    mockClient.sendCommand.mockRejectedValue(
      new PterodactylApiError(404, "NOT_FOUND", "The requested resource was not found."),
    );

    const result = await client.callTool({
      name: "send_command",
      arguments: { server_identifier: "invalid", command: "say hello" },
    });

    expect(result.isError).toBe(true);
    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.error).toBe("NOT_FOUND");
    expect(parsed.status).toBe(404);
  });

  it("should return error when API fails with 401", async () => {
    mockClient.sendCommand.mockRejectedValue(
      new PterodactylApiError(401, "UNAUTHORIZED", "Invalid or missing API key."),
    );

    const result = await client.callTool({
      name: "send_command",
      arguments: { server_identifier: "abc123", command: "say test" },
    });

    expect(result.isError).toBe(true);
    const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
    expect(parsed.error).toBe("UNAUTHORIZED");
  });
});
