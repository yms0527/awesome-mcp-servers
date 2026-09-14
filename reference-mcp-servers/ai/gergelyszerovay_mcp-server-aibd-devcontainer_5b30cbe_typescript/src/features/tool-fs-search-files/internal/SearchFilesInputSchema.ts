import { z } from "zod";

/**
 * Input parameters for the search_files MCP tool
 */
export type SearchFilesInput = {
  /** Root path to start the search from */
  path: string;
  /** Pattern to search for (case-insensitive partial match) */
  pattern: string;
  /** Optional patterns to exclude from search */
  excludePatterns?: string[];
};

/**
 * Schema for validating search_files tool input parameters
 */
export const SearchFilesInputSchema = z.object({
  path: z.string().min(1, "Search path cannot be empty"),
  pattern: z.string().min(1, "Search pattern cannot be empty"),
  excludePatterns: z.array(z.string()).optional().default([]),
});
