import type { CliArgs } from "@features/cli-args/CliArgs";
import type { McpTool } from "@shared/mcp-tool/McpTool";

/**
 * Application state object with immutable properties
 */
export type AppState = CliArgs & {
  /** Current operational mode */
  readonly mode: "mcpAct" | "mcpPlan";
  /** List of available tools */
  readonly tools: readonly McpTool[];
};
