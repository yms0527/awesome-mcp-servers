import path from 'path';

/**
 * Normalizes a path using consistent rules
 * 
 * @param p - Path to normalize
 * @returns Normalized path
 */
export function normalizePath(p: string): string {
  return path.normalize(p);
}
