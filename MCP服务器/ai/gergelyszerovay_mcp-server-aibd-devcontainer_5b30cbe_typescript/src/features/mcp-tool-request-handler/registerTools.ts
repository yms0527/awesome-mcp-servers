import { getAppState } from "@features/app-state/getAppState";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z, type ZodType, type ZodTypeDef } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { isError } from "../../shared/isError";
import { McpToolError } from "../../shared/mcp-tool/McpToolError";

/**
 * Registers the tools with the MCP server
 */
export function registerTools(server: Server): void {
  const appState = getAppState();
  // const tool = createGetDeclarationDependentsMcpTool();

  // Use tools from app config
  const allTools = [...appState.tools];

  // Register tool listing
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      ...(allTools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: zodToJsonSchema(
          tool.inputSchema as ZodType<unknown, ZodTypeDef, unknown>
        ),
      })) as any),
    ],
  }));

  // Register tool execution
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      if (allTools.map((tool) => tool.name).includes(request.params.name)) {
        const tool = allTools.find((t) => t.name === request.params.name);
        if (!tool) {
          throw new Error(`Unknown tool: ${request.params.name}`);
        }
        
        // Get the latest state to ensure we have the current mode
        const currentState = getAppState();
        
        // Check if the tool is enabled in the current mode
        if (!tool.enabledInModes.includes(currentState.mode)) {
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: `Tool '${tool.name}' is not available in '${appState.mode}' mode.`,
              },
            ],
          };
        }

        const params = (tool.inputSchema as z.ZodObject<{}>).parse(
          request.params.arguments
        );

        console.error(request, params);
        try {
          const result = await tool.handler({ params, appState: getAppState() });
          console.error(result);
          if (isError(result)) {
            return {
              isError: true,
              content: [
                {
                  type: "text",
                  text: result.message,
                },
              ],
            };
          }
          return {
            isError: false,
            content: result.map((content) => {
              if (content.type === "json") {
                return {
                  type: "text",
                  text: JSON.stringify(content.data, null, 2),
                };
              }
              return content;
            }),
          };
        } catch (error) {
          if (error instanceof McpToolError) {
            return {
              isError: true,
              content: [
                {
                  type: "text",
                  text: error.message,
                },
              ],
            };
          }
          // Log unexpected errors but return safe message
          console.error("Unexpected error:", error);
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: "An unexpected error occurred",
              },
            ],
          };
        }
      }
      throw new Error(`Unknown tool: ${request.params.name}`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Invalid input: ${JSON.stringify(error.errors)}`);
      }
      throw error;
    }
  });
}
