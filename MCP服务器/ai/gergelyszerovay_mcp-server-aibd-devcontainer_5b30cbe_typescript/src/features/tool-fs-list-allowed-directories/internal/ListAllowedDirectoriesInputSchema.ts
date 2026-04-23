import { z } from "zod";

/**
 * Input parameters for the list_allowed_directories MCP tool
 * This tool doesn't require any parameters
 */
export type ListAllowedDirectoriesInput = Record<string, never>;

/**
 * Schema for validating list_allowed_directories tool input parameters
 * Empty schema as this tool doesn't require any parameters
 */
export const ListAllowedDirectoriesInputSchema = z.object({});
