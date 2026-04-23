import { z } from "zod";

/**
 * Output format for the shell_exec MCP tool JSON responses
 */
export type ShellExecOutput = {
  /** Standard output from the command */
  stdout: string;
  /** Standard error from the command (if any) */
  stderr: string;
  /** Exit code of the command */
  exitCode: number;
};

/**
 * Schema for validating shell_exec tool JSON output
 */
export const ShellExecOutputSchema = z.object({
  stdout: z.string(),
  stderr: z.string(),
  exitCode: z.number(),
});
