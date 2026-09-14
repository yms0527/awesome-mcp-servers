import {
  extendZodWithOpenApi,
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { getAppState } from "@features/app-state/getAppState";
import type { McpTool } from "@shared/mcp-tool/McpTool";
import type { OpenAPIObject } from "openapi3-ts/oas30";
import { z } from "zod";
import { createContentArraySchema } from "./ContentSchemas";

/**
 * Configures OpenAPI registry and generates the OpenAPI document
 *
 * @returns The generated OpenAPI document and registry
 */
export function configureOpenApi(): {
  openApiDocument: OpenAPIObject;
  registry: OpenAPIRegistry;
  restEnabledTools: McpTool[];
} {
  extendZodWithOpenApi(z);
  const registry = new OpenAPIRegistry();

  // Get the latest application state
  const appState = getAppState();

  // Filter tools to only include those enabled in 'rest' mode
  const restEnabledTools = appState.tools.filter((tool) =>
    tool.enabledInModes.includes("rest")
  );

  // Register schemas and paths for each tool
  restEnabledTools.forEach((tool) => {
    registry.register(
      tool.inputSchemaName,
      tool.inputSchema as z.ZodObject<{}>
    );
    if (tool.jsonOutputSchema && tool.jsonOutputSchemaName) {
      registry.register(
        tool.jsonOutputSchemaName,
        tool.jsonOutputSchema as z.ZodObject<{}>
      );
    }

    registry.registerPath({
      method: "post",
      path: `/api/${tool.name}`,
      description: tool.description,
      request: {
        body: {
          content: {
            "application/json": {
              schema: tool.inputSchema as z.ZodObject<{}>,
            },
          },
        },
      },
      responses: {
        201: {
          description: "Success",
          content: {
            "application/json": {
              schema: z.object({
                isError: z.literal(false),
                content: tool.outputTypes.includes("json") && tool.jsonOutputSchema
                ? createContentArraySchema(tool.jsonOutputSchema as z.ZodTypeAny)
                : createContentArraySchema(),
              }),
            },
          },
        },
        500: {
          description: "Error",
          content: {
            "application/json": {
              schema: z.object({
                isError: z.literal(true),
                content: z.array(
                  z.object({
                    type: z.literal("text"),
                    text: z.string(),
                  })
                ),
              }),
            },
          },
        },
      },
    });
  });

  // Get the latest application state for proper port
  const { restHttpPort } = getAppState();

  // Generate OpenAPI document
  const generator = new OpenApiGeneratorV3(registry.definitions);
  const openApiDocument = generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "MCP application",
      version: "1.0.0",
      description: "",
    },
    servers: [{ url: `http://localhost:${restHttpPort}` }],
  });

  return { openApiDocument, registry, restEnabledTools };
}
