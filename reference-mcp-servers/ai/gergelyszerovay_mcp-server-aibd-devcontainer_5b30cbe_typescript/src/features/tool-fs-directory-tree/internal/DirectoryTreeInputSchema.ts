import { z } from "zod";

/**
 * Input parameters for the directory_tree MCP tool
 */
export type DirectoryTreeInput = {
  /** Root path to generate tree from */
  path: string;
  /** Maximum depth of the directory tree (default: 1) */
  depth?: number;
};

/**
 * Schema for validating directory_tree tool input parameters
 */
export const DirectoryTreeInputSchema = z.object({
  path: z.string().min(1, "Directory path cannot be empty"),
  depth: z.number().int().positive().optional().default(1),
});

/**
 * Represents an entry in the directory tree
 */
export type TreeEntry = {
  /** Name of the file or directory */
  name: string;
  /** Type of entry (file or directory) */
  type: 'file' | 'directory';
  /** Children entries (only for directories) */
  children?: TreeEntry[];
};
