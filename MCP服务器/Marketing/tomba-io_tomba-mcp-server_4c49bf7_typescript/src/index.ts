#!/usr/bin/env node

import { TombaMCPServer } from "./server/mcpServer.js";
import { parseArgs } from "node:util";
import pkg from "../package.json" with { type: "json" };

interface ParsedArgs {
    values: {
        transport?: string;
        port?: string;
        help?: boolean;
        version?: boolean;
    };
}

function printHelp() {
    console.log(`
Usage: tomba-mcp-server [options]

Options:
  --transport, -t <type>    Transport type: 'stdio' or 'http' (default: stdio)
  --port, -p <number>       Port number for HTTP transport (default: 3000)
  --version, -v             Show version and exit
  --help, -h                Show this help message

Environment Variables:
  TOMBA_API_KEY         Your Tomba API key (required)
  TOMBA_SECRET_KEY      Your Tomba secret key (required)

Examples:
  # Run with stdio transport (default)
  tomba-mcp-server

  # Run with HTTP transport on default port (3000)
  tomba-mcp-server --transport http

  # Run with HTTP transport on custom port
  tomba-mcp-server --transport http --port 8080
`);
}

async function main() {
    // Parse command line arguments
    let args: ParsedArgs;
    try {
        args = parseArgs({
            options: {
                transport: {
                    type: "string",
                    short: "t",
                    default: "stdio",
                },
                port: {
                    type: "string",
                    short: "p",
                    default: "3000",
                },
                help: {
                    type: "boolean",
                    short: "h",
                    default: false,
                },
                version: {
                    type: "boolean",
                    short: "v",
                    default: false,
                },
            },
        }) as ParsedArgs;
    } catch (error) {
        console.error("Error parsing arguments:", error);
        printHelp();
        process.exit(1);
    }

    // Show help if requested
    if (args.values.help) {
        printHelp();
        process.exit(0);
    }
    if (args.values.version) {
        console.log(pkg.version);
        process.exit(0);
    }

    const transport = args.values.transport?.toLowerCase() || "stdio";
    const port = parseInt(args.values.port || "3000", 10);

    // Validate transport type
    if (transport !== "stdio" && transport !== "http") {
        console.error(
            `Error: Invalid transport type '${transport}'. Must be 'stdio' or 'http'`
        );
        process.exit(1);
    }

    // Validate port number
    if (transport === "http" && (isNaN(port) || port < 1 || port > 65535)) {
        console.error(
            `Error: Invalid port number '${args.values.port}'. Must be between 1 and 65535`
        );
        process.exit(1);
    }

    // Get credentials from environment variables
    const apiKey = process.env.TOMBA_API_KEY;
    const secretKey = process.env.TOMBA_SECRET_KEY;

    if (!apiKey || !secretKey) {
        console.error(
            "Error: TOMBA_API_KEY and TOMBA_SECRET_KEY environment variables are required"
        );
        process.exit(1);
    }

    const server = new TombaMCPServer();
    server.setCredentials({
        apiKey,
        secretKey,
    });

    await server.run(transport, port);
}

// Handle graceful shutdown
process.on("SIGINT", () => {
    console.error("Received SIGINT, shutting down gracefully");
    process.exit(0);
});

process.on("SIGTERM", () => {
    console.error("Received SIGTERM, shutting down gracefully");
    process.exit(0);
});

// Run if this is the main module
main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
