import fs from 'fs/promises';

/**
 * File information structure
 */
export type FileInfo = {
  /** Size of the file in bytes */
  size: number;
  /** Creation time */
  created: Date;
  /** Last modification time */
  modified: Date;
  /** Last access time */
  accessed: Date;
  /** Whether the path is a directory */
  isDirectory: boolean;
  /** Whether the path is a file */
  isFile: boolean;
  /** File permissions in octal format */
  permissions: string;
};

/**
 * Retrieves detailed file statistics for a given path
 * 
 * @param filePath - Path to get statistics for
 * @returns Promise resolving to file information
 */
export async function getFileStats(filePath: string): Promise<FileInfo> {
  const stats = await fs.stat(filePath);
  
  return {
    size: stats.size,
    created: stats.birthtime,
    modified: stats.mtime,
    accessed: stats.atime,
    isDirectory: stats.isDirectory(),
    isFile: stats.isFile(),
    permissions: stats.mode.toString(8).slice(-3),
  };
}