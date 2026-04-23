import { z } from "zod";

/**
 * Input parameters for the move_file MCP tool
 */
export type MoveFileInput = {
  /** Source file or directory path */
  source: string;
  /** Destination file or directory path */
  destination: string;
};

/**
 * Schema for validating move_file tool input parameters
 */
export const MoveFileInputSchema = z.object({
  source: z.string().min(1, "Source path cannot be empty"),
  destination: z.string().min(1, "Destination path cannot be empty"),
});
