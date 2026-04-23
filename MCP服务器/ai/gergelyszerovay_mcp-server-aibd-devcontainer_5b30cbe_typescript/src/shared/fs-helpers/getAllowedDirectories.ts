import path from 'path';
import { expandHome } from './internal/expandHome';
import { normalizePath } from './internal/normalizePath';

// Default allowed directory if none are provided
const DEFAULT_ALLOWED_DIRECTORY = normalizePath(path.resolve(process.cwd()));

// Global variable to store allowed directories
let allowedDirectoriesCache: string[] = [DEFAULT_ALLOWED_DIRECTORY];

/**
 * Sets the allowed directories that the filesystem tools can access
 * 
 * @param directories - Array of directory paths to allow access to
 * @returns The normalized allowed directories
 */
export function setAllowedDirectories(directories: string[]): string[] {
  if (!directories || directories.length === 0) {
    allowedDirectoriesCache = [DEFAULT_ALLOWED_DIRECTORY];
    return allowedDirectoriesCache;
  }

  // Normalize all paths
  allowedDirectoriesCache = directories.map(dir => 
    normalizePath(path.resolve(expandHome(dir)))
  );

  return allowedDirectoriesCache;
}

/**
 * Gets the currently allowed directories for filesystem operations
 * 
 * @returns Array of allowed directory paths (normalized)
 */
export function getAllowedDirectories(): string[] {
  return allowedDirectoriesCache;
}