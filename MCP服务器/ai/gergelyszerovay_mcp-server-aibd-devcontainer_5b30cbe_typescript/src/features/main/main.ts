import type { AppState } from "@features/app-state/AppState";
import { getAppState } from "@features/app-state/getAppState";
import { initializeAppState } from "@features/app-state/initializeAppState";
import { createMcpServer } from "@features/mcp-server/createMcpServer";
import { setupMcpServerGracefulShutdown } from "@features/mcp-server/setupMcpServerGracefulShutdown";
import { setupMcpTransports } from "@features/mcp-server/setupMcpTransports";
import { registerTools } from "@features/mcp-tool-request-handler/registerTools";
import { setupRestServer } from "@features/rest-server/setupRestServer";
import { parseCliArgs } from "@features/cli-args/parseCliArgs";
import { getTools } from "./internal/tools";
import { setAllowedDirectories } from "@shared/fs-helpers/getAllowedDirectories";

/**
 * Main entry point for the application
 * Initializes and configures the MCP server and related components
 */
export async function main() {
  const cliArgs = parseCliArgs();

  // Set the allowed directories for filesystem access
  setAllowedDirectories(cliArgs.allowedDirectories);

  // Create initial application state with CLI args and tools
  const initialState: AppState = {
    ...cliArgs,
    tools: getTools(cliArgs), // Conditionally include tools based on CLI args
    mode: cliArgs.initialMode, // Use the mode from CLI args
  };
  
  // Initialize the global application state
  initializeAppState(initialState);

  try {
    const server = createMcpServer(getAppState());

    registerTools(server);
    await setupMcpTransports(server);
    setupMcpServerGracefulShutdown(server);

    const appState = getAppState();
    if (appState.enableRestServer) {
      setupRestServer();
    }
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}
