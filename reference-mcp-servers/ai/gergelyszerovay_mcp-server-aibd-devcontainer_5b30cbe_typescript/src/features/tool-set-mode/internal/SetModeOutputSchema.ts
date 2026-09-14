import { z } from "zod";

/**
 * MCP tool output format for SetMode JSON responses
 */
export type SetModeOutput = {
  /** Previous operational mode */
  previousMode: "mcpAct" | "mcpPlan";
  /** Current operational mode */
  currentMode: "mcpAct" | "mcpPlan";
};

/**
 * Schema for validating SetMode tool JSON output
 */
export const SetModeOutputSchema = z.object({
  previousMode: z.enum(["mcpAct", "mcpPlan"]),
  currentMode: z.enum(["mcpAct", "mcpPlan"]),
});
