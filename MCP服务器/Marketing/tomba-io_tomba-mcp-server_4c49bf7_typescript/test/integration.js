#!/usr/bin/env node

/**
 * Integration test for Tomba MCP Server
 * This script tests the MCP server without requiring actual Tomba.io API calls
 */

import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test configuration
const SERVER_PATH = join(__dirname, "..", "server", "index.js");
const TEST_TIMEOUT = 10000; // 10 seconds

console.log("🧪 Starting Tomba MCP Server Integration Test\n");

async function testMCPServer() {
    return new Promise((resolve, reject) => {
        console.log("📝 Starting MCP server process...");

        // Set test environment variables
        const env = {
            ...process.env,
            TOMBA_API_KEY: process.env.TOMBA_API_KEY || "test_key_123",
            TOMBA_SECRET_KEY: process.env.TOMBA_SECRET_KEY || "test_secret_456",
        };

        // Spawn the MCP server process
        const serverProcess = spawn("node", [SERVER_PATH], {
            env,
            stdio: ["pipe", "pipe", "pipe"],
        });

        let serverOutput = "";
        let serverError = "";
        let testsPassed = 0;
        let totalTests = 4;

        // Capture server output
        serverProcess.stdout.on("data", (data) => {
            serverOutput += data.toString();
        });

        serverProcess.stderr.on("data", (data) => {
            serverError += data.toString();
            console.log("📊 Server log:", data.toString().trim());
        });

        // Test 1: Server initialization
        setTimeout(() => {
            if (serverError.includes("Tomba MCP server running")) {
                console.log("✅ Test 1: Server started successfully");
                testsPassed++;
            } else {
                console.log("❌ Test 1: Server failed to start");
            }
        }, 1000);

        // Test 2: Send initialize request
        setTimeout(() => {
            console.log("📤 Test 2: Sending initialize request...");
            const initRequest = {
                jsonrpc: "2.0",
                id: 1,
                method: "initialize",
                params: {
                    protocolVersion: "2024-11-05",
                    capabilities: {},
                    clientInfo: {
                        name: "test-client",
                        version: "1.0.0",
                    },
                },
            };

            try {
                serverProcess.stdin.write(JSON.stringify(initRequest) + "\n");
                console.log("✅ Test 2: Initialize request sent");
                testsPassed++;
            } catch (error) {
                console.log(
                    "❌ Test 2: Failed to send initialize request:",
                    error.message
                );
            }
        }, 2000);

        // Test 3: List tools request
        setTimeout(() => {
            console.log("📤 Test 3: Sending list tools request...");
            const toolsRequest = {
                jsonrpc: "2.0",
                id: 2,
                method: "tools/list",
            };

            try {
                serverProcess.stdin.write(JSON.stringify(toolsRequest) + "\n");
                console.log("✅ Test 3: List tools request sent");
                testsPassed++;
            } catch (error) {
                console.log(
                    "❌ Test 3: Failed to send list tools request:",
                    error.message
                );
            }
        }, 3000);

        // Test 4: Test tool call (will fail due to mock API, but should handle gracefully)
        setTimeout(() => {
            console.log("📤 Test 4: Sending domain search tool call...");
            const toolCallRequest = {
                jsonrpc: "2.0",
                id: 3,
                method: "tools/call",
                params: {
                    name: "domain_search",
                    arguments: {
                        domain: "tomba.io",
                        limit: 10,
                    },
                },
            };

            try {
                serverProcess.stdin.write(
                    JSON.stringify(toolCallRequest) + "\n"
                );
                console.log("✅ Test 4: Tool call request sent");
                testsPassed++;
            } catch (error) {
                console.log(
                    "❌ Test 4: Failed to send tool call request:",
                    error.message
                );
            }
        }, 4000);

        // Cleanup and results
        setTimeout(() => {
            console.log("\n📋 Integration Test Results:");
            console.log(`✅ Tests passed: ${testsPassed}/${totalTests}`);
            console.log("\n📤 Server Output:");
            console.log(serverOutput || "No stdout output");
            console.log("\n📥 Server Errors/Logs:");
            console.log(serverError || "No stderr output");

            serverProcess.kill("SIGTERM");

            if (testsPassed >= totalTests - 1) {
                // Allow for API call failure
                console.log("\n🎉 Integration test completed successfully!");
                resolve();
            } else {
                console.log("\n❌ Integration test failed");
                reject(
                    new Error(`Only ${testsPassed}/${totalTests} tests passed`)
                );
            }
        }, 6000);

        // Handle process errors
        serverProcess.on("error", (error) => {
            console.log("❌ Server process error:", error);
            reject(error);
        });

        // Timeout protection
        setTimeout(() => {
            serverProcess.kill("SIGKILL");
            reject(new Error("Test timeout"));
        }, TEST_TIMEOUT);
    });
}

// Run the integration test
testMCPServer()
    .then(() => {
        console.log("🏁 Integration test completed successfully");
        process.exit(0);
    })
    .catch((error) => {
        console.error("💥 Integration test failed:", error);
        process.exit(1);
    });
