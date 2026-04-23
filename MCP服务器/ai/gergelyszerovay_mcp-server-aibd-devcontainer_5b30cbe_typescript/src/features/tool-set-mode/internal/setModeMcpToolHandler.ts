import type { AppState } from "@features/app-state/AppState";
import type { TextContent } from "@modelcontextprotocol/sdk/types.js";
import type { JsonContent } from "@shared/mcp-tool/JsonContent";
import { McpToolError } from "@shared/mcp-tool/McpToolError";
import { getAppState } from "@features/app-state/getAppState";
import { updateAppState } from "@features/app-state/updateAppState";
import type { SetModeInput } from "./SetModeInputSchema";
import type { SetModeOutput } from "./SetModeOutputSchema";

type SetModeMcpToolHandlerParams = {
  params: SetModeInput;
  serverState: AppState;
};

/**
 * Handler for the setMode MCP tool
 * Updates the application's operational mode and returns the previous and current modes
 */
export async function setModeMcpToolHandler({
  params,
  serverState,
}: SetModeMcpToolHandlerParams): Promise<
  Array<TextContent | JsonContent<SetModeOutput>> | McpToolError
> {
  try {
    const currentState = getAppState();
    const previousMode = currentState.mode;
    const { mode: newMode } = params;
    
    // Update the application state with the new mode
    updateAppState({ mode: newMode });
    
    return [
      // Text response
      {
        type: "text",
        text: `Mode updated: ${previousMode} → ${newMode}`,
      },
      // JSON response
      {
        type: "json",
        data: {
          previousMode,
          currentMode: newMode,
        },
      },
    ];
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error in setMode tool:", error);
    if (error instanceof Error) {
      return new McpToolError(error.message);
    }
    return new McpToolError("An unexpected error occurred in the setMode tool");
  }
}
