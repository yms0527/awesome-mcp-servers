import { z } from "zod";

/**
 * Input parameters for the delete_multiple_files MCP tool
 */
export type DeleteMultipleFilesInput = {
  /** Paths of the files to delete */
  paths: string[];
};

/**
 * Schema for validating delete_multiple_files tool input parameters
 */
export const DeleteMultipleFilesInputSchema = z.object({
  paths: z.array(z.string().min(1, "File path cannot be empty")).min(1, "At least one file path is required"),
});
