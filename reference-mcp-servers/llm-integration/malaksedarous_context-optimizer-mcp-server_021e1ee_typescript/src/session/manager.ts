/**
 * Session management for follow-up questions
 * 
 * Manages file-based session storage for terminal execution history
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { ConfigurationManager } from '../config/manager';
import { Logger } from '../utils/logger';

export interface TerminalSessionData {
  command: string;
  output: string;
  exitCode: number;
  extractionPrompt: string;
  extractedInfo: string;
  timestamp: string;
  workingDirectory: string;
}

export class SessionManager {
  private static getSessionFilePath(): string {
    const config = ConfigurationManager.getConfig();
    const sessionDir = config.server.sessionStoragePath || path.join(os.tmpdir(), 'context-optimizer-mcp');
    return path.join(sessionDir, 'terminal-session.json');
  }
  
  static async saveTerminalSession(data: TerminalSessionData): Promise<void> {
    try {
      const sessionPath = this.getSessionFilePath();
      const sessionDir = path.dirname(sessionPath);
      
      // Ensure session directory exists
      await fs.mkdir(sessionDir, { recursive: true });
      
      // Save session data
      await fs.writeFile(sessionPath, JSON.stringify(data, null, 2), 'utf8');
      
      Logger.debug(`Terminal session saved: ${sessionPath}`);
    } catch (error) {
      Logger.error('Failed to save terminal session:', error);
      // Non-critical error - don't throw
    }
  }
  
  static async loadTerminalSession(): Promise<TerminalSessionData | null> {
    try {
      const sessionPath = this.getSessionFilePath();
      const content = await fs.readFile(sessionPath, 'utf8');
      const data = JSON.parse(content) as TerminalSessionData;
      
      // Check if session has expired
      const config = ConfigurationManager.getConfig();
      const sessionAge = Date.now() - new Date(data.timestamp).getTime();
      
      if (sessionAge > config.security.sessionTimeout) {
        Logger.debug('Terminal session expired, removing...');
        await this.clearTerminalSession();
        return null;
      }
      
      return data;
    } catch (error) {
      // Session file doesn't exist or is invalid
      return null;
    }
  }
  
  static async clearTerminalSession(): Promise<void> {
    try {
      const sessionPath = this.getSessionFilePath();
      await fs.unlink(sessionPath);
      Logger.debug('Terminal session cleared');
    } catch (error) {
      // File doesn't exist - that's fine
    }
  }
  
  static async hasActiveSession(): Promise<boolean> {
    const session = await this.loadTerminalSession();
    return session !== null;
  }
}
