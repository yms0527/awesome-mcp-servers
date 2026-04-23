import type { TextContent } from "@modelcontextprotocol/sdk/types.js";
import type { JsonContent } from "./JsonContent";
import type { McpToolError } from "./McpToolError";

/**
 * Configuration for an MCP tool. Defines the interface and behavior of a tool that can be used
 * in the MCP (Machine Conversation Protocol) system.
 */
export type McpTool = {
  /** Unique name identifying the tool */
  name: string;
  /** Description of what the tool does */
  description: string;
  /** Schema for validating tool input (undefined === empty input) */
  inputSchema?: unknown;
  /** Name of the input schema type */
  inputSchemaName: string;
  /** Types of output this tool can produce */
  outputTypes: Array<"text" | "json" | "image">;
  /** Schema for validating JSON output (only required when "json" is in outputTypes) */
  jsonOutputSchema?: unknown;
  /** Name of the JSON output schema type (only required when "json" is in outputTypes) */
  jsonOutputSchemaName?: string;
  /** Function that implements the tool's logic. This function will be called when the tool is invoked. */
  handler: (
    param: any
  ) => Promise<Array<TextContent | JsonContent<unknown>> | McpToolError>;
  /** Specifies which operational modes this tool is available in */
  enabledInModes: Array<"rest" | "mcpAct" | "mcpPlan">;
};
