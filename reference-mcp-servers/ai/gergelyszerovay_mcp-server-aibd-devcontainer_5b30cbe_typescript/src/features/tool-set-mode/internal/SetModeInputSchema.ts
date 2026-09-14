import { z } from "zod";

/**
 * Input parameters for the SetMode MCP tool
 */
export type SetModeInput = {
  /** The operational mode to set */
  mode: "mcpAct" | "mcpPlan";
};

/**
 * Schema for validating SetMode tool input parameters
 */
export const SetModeInputSchema = z.object({
  mode: z.enum(["mcpAct", "mcpPlan"]),
});
