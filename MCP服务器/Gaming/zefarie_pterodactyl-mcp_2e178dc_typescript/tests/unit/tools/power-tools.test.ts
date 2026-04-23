import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PterodactylApiError } from "../../../src/client/errors.js";
import type { PterodactylClient } from "../../../src/client/pterodactyl.client.js";
import { registerKillServerTool } from "../../../src/tools/kill-server.js";
import { registerRestartServerTool } from "../../../src/tools/restart-server.js";
import { registerStartServerTool } from "../../../src/tools/start-server.js";
import { registerStopServerTool } from "../../../src/tools/stop-server.js";
import { createMockClient } from "../../fixtures/mock-client.js";

describe("power tools", () => {
  let mcpServer: McpServer;
  let client: Client;
  let mockClient: ReturnType<typeof createMockClient>;

  beforeEach(async () => {
    mockClient = createMockClient();
    mcpServer = new McpServer({ name: "test", version: "0.0.1" });
    registerStartServerTool(mcpServer, mockClient as unknown as PterodactylClient);
    registerStopServerTool(mcpServer, mockClient as unknown as PterodactylClient);
    registerRestartServerTool(mcpServer, mockClient as unknown as PterodactylClient);
    registerKillServerTool(mcpServer, mockClient as unknown as PterodactylClient);

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await mcpServer.connect(serverTransport);

    client = new Client({ name: "test-client", version: "0.0.1" });
    await client.connect(clientTransport);
  });

  afterEach(async () => {
    await client.close();
    await mcpServer.close();
  });

  describe("start_server", () => {
    it("should start server successfully", async () => {
      mockClient.sendPowerAction.mockResolvedValue(undefined);

      const result = await client.callTool({
        name: "start_server",
        arguments: { server_identifier: "abc123" },
      });

      expect(mockClient.sendPowerAction).toHaveBeenCalledWith("abc123", "start");
      expect(result.isError).toBeUndefined();

      const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
      expect(parsed.success).toBe(true);
      expect(parsed.action).toBe("start");
      expect(parsed.server_identifier).toBe("abc123");
    });

    it("should return error when server not found", async () => {
      mockClient.sendPowerAction.mockRejectedValue(
        new PterodactylApiError(404, "NOT_FOUND", "The requested resource was not found."),
      );

      const result = await client.callTool({
        name: "start_server",
        arguments: { server_identifier: "invalid" },
      });

      expect(result.isError).toBe(true);
      const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
      expect(parsed.error).toBe("NOT_FOUND");
    });
  });

  describe("stop_server", () => {
    it("should stop server successfully", async () => {
      mockClient.sendPowerAction.mockResolvedValue(undefined);

      const result = await client.callTool({
        name: "stop_server",
        arguments: { server_identifier: "abc123" },
      });

      expect(mockClient.sendPowerAction).toHaveBeenCalledWith("abc123", "stop");
      expect(result.isError).toBeUndefined();

      const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
      expect(parsed.success).toBe(true);
      expect(parsed.action).toBe("stop");
    });

    it("should return error when API fails with 401", async () => {
      mockClient.sendPowerAction.mockRejectedValue(
        new PterodactylApiError(401, "UNAUTHORIZED", "Invalid or missing API key."),
      );

      const result = await client.callTool({
        name: "stop_server",
        arguments: { server_identifier: "abc123" },
      });

      expect(result.isError).toBe(true);
      const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
      expect(parsed.error).toBe("UNAUTHORIZED");
    });
  });

  describe("restart_server", () => {
    it("should restart server successfully", async () => {
      mockClient.sendPowerAction.mockResolvedValue(undefined);

      const result = await client.callTool({
        name: "restart_server",
        arguments: { server_identifier: "abc123" },
      });

      expect(mockClient.sendPowerAction).toHaveBeenCalledWith("abc123", "restart");
      expect(result.isError).toBeUndefined();

      const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
      expect(parsed.success).toBe(true);
      expect(parsed.action).toBe("restart");
    });

    it("should return error when API fails", async () => {
      mockClient.sendPowerAction.mockRejectedValue(
        new PterodactylApiError(403, "FORBIDDEN", "Permission denied."),
      );

      const result = await client.callTool({
        name: "restart_server",
        arguments: { server_identifier: "abc123" },
      });

      expect(result.isError).toBe(true);
    });
  });

  describe("kill_server", () => {
    it("should kill server successfully", async () => {
      mockClient.killServer.mockResolvedValue(undefined);

      const result = await client.callTool({
        name: "kill_server",
        arguments: { server_identifier: "abc123" },
      });

      expect(mockClient.killServer).toHaveBeenCalledWith("abc123");
      expect(result.isError).toBeUndefined();

      const parsed = JSON.parse((result.content as { type: string; text: string }[])[0].text);
      expect(parsed.success).toBe(true);
      expect(parsed.message).toContain("forcefully killed");
    });

    it("should return error when API fails", async () => {
      mockClient.killServer.mockRejectedValue(
        new PterodactylApiError(404, "NOT_FOUND", "The requested resource was not found."),
      );

      const result = await client.callTool({
        name: "kill_server",
        arguments: { server_identifier: "invalid" },
      });

      expect(result.isError).toBe(true);
    });
  });
});
