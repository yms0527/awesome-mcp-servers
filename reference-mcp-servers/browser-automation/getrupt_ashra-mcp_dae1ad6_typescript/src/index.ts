import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { AshraError, isAshraError } from "./common/errors.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import * as prompts from "./operations/prompt.js";
import { CreatePromptRequestSchema } from "./common/types.js";

const server = new Server(
  {
    name: "ashra-mcp-server",
    version: "0.0.1",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

function formatAshraError(error: AshraError): string {
  let message = `Ashra API Error: ${error.message}`;
  return message;
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "create_prompt",
        description: "Create a single prompt in Ashra",
        inputSchema: zodToJsonSchema(CreatePromptRequestSchema),
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    if (!request.params.arguments) {
      throw new Error("Arguments are required");
    }

    switch (request.params.name) {
      case "create_prompt": {
        const args = CreatePromptRequestSchema.parse(request.params.arguments);
        const prompt = await prompts.Create(args);
        return {
          content: [{ type: "text", text: JSON.stringify(prompt, null, 2) }],
        };
      }
      default:
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid input: ${JSON.stringify(error.errors)}`);
    }
    if (isAshraError(error)) {
      throw new Error(formatAshraError(error));
    }
    throw error;
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Ashra MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
