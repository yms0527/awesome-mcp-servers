import { z } from "zod";

/**
 * Input parameters for the GetMode MCP tool (empty)
 */
export type GetModeInput = Record<string, never>;

/**
 * Schema for validating GetMode tool input parameters
 * This tool requires no input parameters
 */
export const GetModeInputSchema = z.object({});
