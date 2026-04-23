import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { TombaMcpClient } from "../client/mcpClient";

describe("TombaMcpClient", () => {
    let client: TombaMcpClient;

    beforeEach(() => {
        jest.clearAllMocks();
        client = new TombaMcpClient({
            apiKey: "test_api_key",
            secretKey: "test_secret_key",
        });
    });

    describe("constructor", () => {
        it("should initialize client with credentials", () => {
            expect(client).toBeInstanceOf(TombaMcpClient);
        });
    });

    describe("domainSearch", () => {
        it("should have domainSearch method", () => {
            expect(typeof client.domainSearch).toBe("function");
        });
    });

    describe("emailFinder", () => {
        it("should have emailFinder method", () => {
            expect(typeof client.emailFinder).toBe("function");
        });
    });
});
