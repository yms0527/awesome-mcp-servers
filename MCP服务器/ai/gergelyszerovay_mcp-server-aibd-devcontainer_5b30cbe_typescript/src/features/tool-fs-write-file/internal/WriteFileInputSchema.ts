import { z } from "zod";

/**
 * Input parameters for the write_file MCP tool
 */
export type WriteFileInput = {
  /** Path of the file to write to */
  path: string;
  /** Content to write to the file */
  content: string;
};

/**
 * Schema for validating write_file tool input parameters
 */
export const WriteFileInputSchema = z.object({
  path: z.string().min(1, "File path cannot be empty"),
  content: z.string(),
});
