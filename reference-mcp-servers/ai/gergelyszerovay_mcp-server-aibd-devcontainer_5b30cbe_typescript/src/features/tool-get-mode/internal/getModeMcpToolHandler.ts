import { getAppState } from "@features/app-state/getAppState";
import type { AppState } from "@features/app-state/AppState";
import type { TextContent } from "@modelcontextprotocol/sdk/types.js";
import type { JsonContent } from "@shared/mcp-tool/JsonContent";
import { McpToolError } from "@shared/mcp-tool/McpToolError";
import type { GetModeInput } from "./GetModeInputSchema";
import type { GetModeOutput } from "./GetModeOutputSchema";

type GetModeMcpToolHandlerParams = {
  params: GetModeInput;
  serverState: AppState;
};

/**
 * Handler for the getMode MCP tool
 * Returns the current operational mode of the server
 */
export async function getModeMcpToolHandler({
  params,
  serverState,
}: GetModeMcpToolHandlerParams): Promise<
  Array<TextContent | JsonContent<GetModeOutput>> | McpToolError
> {
  try {
    // Get the latest application state
    const { mode } = getAppState();

    return [
      // JSON response
      {
        type: "json",
        data: {
          mode,
        },
      },
    ];
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error in getMode tool:", error);
    if (error instanceof Error) {
      return new McpToolError(error.message);
    }
    return new McpToolError("An unexpected error occurred in the getMode tool");
  }
}
