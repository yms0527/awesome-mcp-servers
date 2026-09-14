import path from 'path';
import os from 'os';

/**
 * Expands the tilde character in file paths to the user's home directory
 * 
 * @param filepath - Path that may contain a tilde
 * @returns Expanded path with the tilde replaced by the home directory
 */
export function expandHome(filepath: string): string {
  if (filepath.startsWith('~/') || filepath === '~') {
    return path.join(os.homedir(), filepath.slice(1));
  }
  return filepath;
}
