import { z } from "zod";

/**
 * Input parameters for the get_file_info MCP tool
 */
export type GetFileInfoInput = {
  /** Path of the file or directory to get information about */
  path: string;
};

/**
 * Schema for validating get_file_info tool input parameters
 */
export const GetFileInfoInputSchema = z.object({
  path: z.string().min(1, "File path cannot be empty"),
});
