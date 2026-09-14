import { z } from "zod";

/**
 * Input parameters for the create_directory MCP tool
 */
export type CreateDirectoryInput = {
  /** Path of the directory to create */
  path: string;
};

/**
 * Schema for validating create_directory tool input parameters
 */
export const CreateDirectoryInputSchema = z.object({
  path: z.string().min(1, "Directory path cannot be empty"),
});
