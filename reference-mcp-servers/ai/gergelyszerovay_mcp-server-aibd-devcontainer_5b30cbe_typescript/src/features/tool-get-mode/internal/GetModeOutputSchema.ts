import { z } from "zod";

/**
 * MCP tool output format for GetMode JSON responses
 */
export type GetModeOutput = {
  /** Current operational mode */
  mode: "mcpAct" | "mcpPlan";
};

/**
 * Schema for validating GetMode tool JSON output
 */
export const GetModeOutputSchema = z.object({
  mode: z.enum(["mcpAct", "mcpPlan"]),
});
