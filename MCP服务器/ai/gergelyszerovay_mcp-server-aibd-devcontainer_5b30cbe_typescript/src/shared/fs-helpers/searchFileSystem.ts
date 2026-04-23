import fs from 'fs/promises';
import path from 'path';
import { minimatch } from 'minimatch';
import { validatePath } from './validatePath';

/**
 * Recursively searches for files and directories matching a pattern
 * 
 * @param rootPath - Root path to start the search from
 * @param pattern - Pattern to search for (case-insensitive partial match)
 * @param excludePatterns - Optional patterns to exclude from search
 * @returns Promise resolving to an array of paths that match the pattern
 */
export async function searchFiles(
  rootPath: string,
  pattern: string,
  excludePatterns: string[] = []
): Promise<string[]> {
  const results: string[] = [];

  async function search(currentPath: string) {
    try {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);

        try {
          // Validate each path before processing
          await validatePath(fullPath);

          // Check if path matches any exclude pattern
          const relativePath = path.relative(rootPath, fullPath);
          const shouldExclude = excludePatterns.some(pattern => {
            const globPattern = pattern.includes('*') ? pattern : `**/${pattern}/**`;
            return minimatch(relativePath, globPattern, { dot: true });
          });

          if (shouldExclude) {
            continue;
          }

          if (entry.name.toLowerCase().includes(pattern.toLowerCase())) {
            results.push(fullPath);
          }

          if (entry.isDirectory()) {
            await search(fullPath);
          }
        } catch (error) {
          // Skip invalid paths during search
          continue;
        }
      }
    } catch (error) {
      // Skip directories we can't access
      return;
    }
  }

  await search(rootPath);
  return results;
}