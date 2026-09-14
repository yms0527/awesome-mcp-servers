import { z } from "zod";

/**
 * Input parameters for the read_multiple_files MCP tool
 */
export type ReadMultipleFilesInput = {
  /** Paths of the files to read */
  paths: string[];
};

/**
 * Schema for validating read_multiple_files tool input parameters
 */
export const ReadMultipleFilesInputSchema = z.object({
  paths: z.array(z.string().min(1, "File path cannot be empty")).min(1, "At least one file path is required"),
});
