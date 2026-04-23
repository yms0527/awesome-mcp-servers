import { getAppState } from "@features/app-state/getAppState";
import type { McpTool } from "@shared/mcp-tool/McpTool";
import express, { type Express } from "express";
import { serve, setup } from "swagger-ui-express";
import { configureErrorHandling } from "./configureErrorHandling";
import { configureOpenApi } from "./configureOpenApi";
import { setupRequestHandlers } from "./setupRequestHandlers";

/**
 * Creates and configures the Express application
 *
 * @returns The configured Express application
 */
export function createExpressApp(): {
  app: Express;
  restEnabledTools: McpTool[];
} {
  // Get the application state
  const appState = getAppState();

  // Configure OpenAPI
  const { openApiDocument, restEnabledTools } = configureOpenApi();

  // Initialize Express app
  const app = express();
  app.use(express.json());

  // Serve OpenAPI documentation
  app.use("/api-docs", serve, setup(openApiDocument));

  // Set up request handlers for each tool
  setupRequestHandlers({ app, restEnabledTools });

  // Configure error handling
  configureErrorHandling({ app });

  return { app, restEnabledTools };
}
