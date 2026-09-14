import { z } from "zod";

/**
 * Represents a single edit operation
 */
export type EditOperation = {
  /** Text to search for and replace */
  oldText: string;
  /** New text to replace with */
  newText: string;
};

/**
 * Input parameters for the edit_file MCP tool
 */
export type EditFileInput = {
  /** Path of the file to edit */
  path: string;
  /** Array of edit operations to perform */
  edits: EditOperation[];
  /** Whether to perform a dry run without writing to the file */
  dryRun?: boolean;
};

/**
 * Schema for a single edit operation
 */
const EditOperationSchema = z.object({
  oldText: z.string().min(1, "Old text cannot be empty"),
  newText: z.string().describe('Text to replace with')
});

/**
 * Schema for validating edit_file tool input parameters
 */
export const EditFileInputSchema = z.object({
  path: z.string().min(1, "File path cannot be empty"),
  edits: z.array(EditOperationSchema).min(1, "At least one edit operation is required"),
  dryRun: z.boolean().default(false).describe('Preview changes using git-style diff format')
});
