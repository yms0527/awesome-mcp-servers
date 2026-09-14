import { z } from "zod";

/**
 * Input parameters for the shell_exec MCP tool
 */
export type ShellExecInput = {
  /** Command to execute in the shell */
  command: string;
  /** Maximum execution time in milliseconds (default: 5000) */
  timeout?: number;
};

/**
 * Schema for validating shell_exec tool input parameters
 */
export const ShellExecInputSchema = z.object({
  command: z.string().min(1, "Command cannot be empty"),
  timeout: z
    .number()
    .min(100, "Timeout must be at least 100ms")
    .max(300000, "Timeout cannot exceed 300 seconds")
    .optional(),
});
