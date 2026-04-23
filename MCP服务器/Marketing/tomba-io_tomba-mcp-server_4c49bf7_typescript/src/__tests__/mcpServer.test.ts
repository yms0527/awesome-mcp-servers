import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { TombaMCPServer } from "../server/mcpServer";

describe("TombaMCPServer", () => {
    let server: TombaMCPServer;

    beforeEach(() => {
        jest.clearAllMocks();
        server = new TombaMCPServer();
    });

    describe("constructor", () => {
        it("should initialize server", () => {
            expect(server).toBeInstanceOf(TombaMCPServer);
        });
    });

    describe("setCredentials", () => {
        it("should set credentials without error", () => {
            const config = {
                apiKey: "test_api_key",
                secretKey: "test_secret_key",
            };

            expect(() => server.setCredentials(config)).not.toThrow();
        });
    });

    describe("tool handlers", () => {
        it("should be ready for testing", () => {
            expect(server).toBeDefined();
        });
    });
});
