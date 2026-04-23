import type { TextContent } from "@modelcontextprotocol/sdk/types.js";
import { McpToolError } from "@shared/mcp-tool/McpToolError";
import fs from "fs/promises";
import path from "path";
import { validatePath } from "@shared/fs-helpers/validatePath";
import type { DirectoryTreeInput, TreeEntry } from "./DirectoryTreeInputSchema";

type DirectoryTreeMcpToolHandlerParams = {
  params: DirectoryTreeInput;
};

/**
 * Recursively builds a tree structure of files and directories
 * 
 * @param currentPath - Path to build the tree from
 * @param currentDepth - Current depth in the recursion
 * @param maxDepth - Maximum depth to traverse
 * @returns Promise resolving to an array of tree entries
 */
async function buildTree(currentPath: string, currentDepth: number = 0, maxDepth: number = 1): Promise<TreeEntry[]> {
  const validPath = await validatePath(currentPath);
  const entries = await fs.readdir(validPath, { withFileTypes: true });
  const result: TreeEntry[] = [];

  for (const entry of entries) {
    const entryData: TreeEntry = {
      name: entry.name,
      type: entry.isDirectory() ? 'directory' : 'file'
    };

    if (entry.isDirectory()) {
      const subPath = path.join(currentPath, entry.name);
      try {
        // Only recurse if we haven't reached max depth
        if (currentDepth < maxDepth) {
          entryData.children = await buildTree(subPath, currentDepth + 1, maxDepth);
        } else {
          // At max depth, include directory but don't populate children
          entryData.children = [];
        }
      } catch (error) {
        // If we can't access a subdirectory, include it with empty children
        console.error(`Error accessing subdirectory ${subPath}:`, error);
        entryData.children = [];
      }
    }

    result.push(entryData);
  }

  return result;
}

/**
 * Handler for the directory_tree MCP tool
 * Gets a recursive tree view of files and directories as a JSON structure
 * 
 * @param params - Tool parameters including the directory path
 * @returns Formatted directory tree or an error
 */
export async function directoryTreeMcpToolHandler({
  params,
}: DirectoryTreeMcpToolHandlerParams): Promise<Array<TextContent> | McpToolError> {
  try {
    const depth = params.depth ?? 1; // Default to 1 if not specified
    
    // Build the directory tree with the specified depth
    const treeData = await buildTree(params.path, 0, depth);
    
    // Format the tree as JSON with 2-space indentation
    const formattedTree = JSON.stringify(treeData, null, 2);
    
    return [{ type: "text", text: formattedTree }];
  } catch (error) {
    // Handle error cases with appropriate messages
    if (error instanceof Error) {
      const errorMessage = error.message || "Unknown error";
      if (errorMessage.includes("Access denied")) {
        return new McpToolError(`Security error: ${errorMessage}`);
      } else if (errorMessage.includes("ENOENT")) {
        return new McpToolError(`Directory not found: ${params.path}`);
      } else if (errorMessage.includes("ENOTDIR")) {
        return new McpToolError(`Not a directory: ${params.path}`);
      } else if (errorMessage.includes("EACCES")) {
        return new McpToolError(`Permission denied: Cannot access directory ${params.path}`);
      } else {
        return new McpToolError(`Error generating directory tree: ${errorMessage}`);
      }
    }
    
    return new McpToolError("An unexpected error occurred while generating the directory tree");
  }
}
