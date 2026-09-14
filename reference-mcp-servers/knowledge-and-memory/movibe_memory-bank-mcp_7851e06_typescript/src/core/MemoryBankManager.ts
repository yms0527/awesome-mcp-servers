import path from 'path';
import { FileUtils } from '../utils/FileUtils.js';
import { coreTemplates } from './templates/index.js';
import { ProgressTracker } from './ProgressTracker.js';
import { ModeManager } from '../utils/ModeManager.js';
import { ExternalRulesLoader } from '../utils/ExternalRulesLoader.js';
import fs from 'fs';
import { MemoryBankStatus, ModeState } from '../types/index.js';
import { MigrationUtils } from '../utils/MigrationUtils.js';
import { logger } from '../utils/LogManager.js';

/**
 * Class responsible for managing Memory Bank operations
 * 
 * This class handles all operations related to Memory Bank directories,
 * including initialization, file operations, and status tracking.
 */
export class MemoryBankManager {
  private memoryBankDir: string | null = null;
  private customPath: string | null = null;
  private progressTracker: ProgressTracker | null = null;
  private modeManager: ModeManager | null = null;
  private rulesLoader: ExternalRulesLoader | null = null;
  private projectPath: string | null = null;
  private userId: string | null = null;
  private folderName: string = 'memory-bank';
  
  // Language is always set to English
  private language: string = 'en';

  /**
   * Creates a new MemoryBankManager instance
   * 
   * @param projectPath Optional project path to use instead of current directory
   * @param userId Optional GitHub profile URL for tracking changes
   * @param folderName Optional folder name for the Memory Bank (default: 'memory-bank')
   * @param debugMode Optional flag to enable debug mode
   */
  constructor(projectPath?: string, userId?: string, folderName?: string, debugMode?: boolean) {
    // Ensure language is always English - this is a hard requirement
    // All Memory Bank content will be in English regardless of system locale or user settings
    this.language = 'en';
    
    if (projectPath) {
      this.projectPath = projectPath;
      logger.debug('MemoryBankManager', `Initialized with project path: ${projectPath}`);
    } else {
      this.projectPath = process.cwd();
      logger.debug('MemoryBankManager', `Initialized with current directory: ${this.projectPath}`);
    }
    
    this.userId = userId || "Unknown User";
    logger.debug('MemoryBankManager', `Initialized with GitHub profile URL: ${this.userId}`);
    
    if (folderName) {
      this.folderName = folderName;
      logger.debug('MemoryBankManager', `Initialized with folder name: ${folderName}`);
    } else {
      logger.debug('MemoryBankManager', `Initialized with default folder name: ${this.folderName}`);
    }
    
    logger.info('MemoryBankManager', `Memory Bank language is set to English (${this.language}) - all content will be in English`);
    
    // Check for an existing memory-bank directory in the project path
    this.setCustomPath(this.projectPath).catch(error => {
      logger.error('MemoryBankManager', `Error checking for memory-bank directory: ${error}`);
    });
  }

  /**
   * Gets the language used for the Memory Bank
   * 
   * @returns The language code (always 'en' for English)
   */
  getLanguage(): string {
    return this.language;
  }

  /**
   * Sets the language for the Memory Bank
   * 
   * Note: This method is provided for API consistency, but the Memory Bank
   * will always use English (en) regardless of the language parameter.
   * This is a deliberate design decision to ensure consistency across all Memory Banks.
   * 
   * @param language - Language code (ignored, always sets to 'en')
   */
  setLanguage(language: string): void {
    // Always use English regardless of the parameter
    this.language = 'en';
    console.warn('Memory Bank language is always set to English (en) regardless of the requested language. This is a hard requirement for consistency.');
  }

  /**
   * Gets the project path
   * 
   * @returns The project path
   */
  getProjectPath(): string {
    return this.projectPath || process.cwd();
  }

  /**
   * Finds a Memory Bank directory in the provided directory
   * 
   * Combines the provided directory with the folder name to create the Memory Bank path.
   * 
   * @param startDir - Starting directory for the search
   * @param customPath - Optional custom path (ignored in this implementation)
   * @returns Path to the Memory Bank directory or null if not found
   */
  async findMemoryBankDir(startDir: string, customPath?: string): Promise<string | null> {
    // Combine the start directory with the folder name
    const mbDir = path.join(startDir, this.folderName);
    
    // Check if the directory exists and is a valid Memory Bank
    if (await FileUtils.fileExists(mbDir) && await FileUtils.isDirectory(mbDir)) {
      // Check if it's a valid Memory Bank or just a directory
      const files = await FileUtils.listFiles(mbDir);
      const mdFiles = files.filter(file => file.endsWith('.md'));
      
      if (mdFiles.length > 0) {
        return mbDir;
      }
    }
    
    // If directory doesn't exist or is not a valid Memory Bank, return null
    return null;
  }

  /**
   * Checks if a directory is a valid Memory Bank
   * 
   * @param dirPath - Directory path to check
   * @returns True if it's a valid Memory Bank, false otherwise
   */
  async isMemoryBank(dirPath: string): Promise<boolean> {
    try {
      if (!await FileUtils.isDirectory(dirPath)) {
        return false;
      }

      // Check if at least one of the core files exists
      const files = await FileUtils.listFiles(dirPath);
      
      // Support both camelCase and kebab-case during transition
      const coreFiles = [
        // Kebab-case (new format)
        'product-context.md',
        'active-context.md',
        'progress.md',
        'decision-log.md',
        'system-patterns.md',
        
        // CamelCase (old format)
        'productContext.md',
        'activeContext.md',
        'progress.md',
        'decisionLog.md',
        'systemPatterns.md'
      ];
      
      // Verificar cada arquivo individualmente
      for (const coreFile of coreFiles) {
        const filePath = path.join(dirPath, coreFile);
        if (await FileUtils.fileExists(filePath)) {
          return true;
        }
      }
      
      return false;
    } catch (error) {
      logger.error('MemoryBankManager', `Error checking if ${dirPath} is a Memory Bank: ${error}`);
      return false;
    }
  }

  /**
   * Validates if all required .clinerules files exist in the project root
   * 
   * @param projectDir - Project directory to check
   * @returns Object with validation results
   */
  async validateClinerules(projectDir: string): Promise<{
    valid: boolean;
    missingFiles: string[];
    existingFiles: string[];
  }> {
    const requiredFiles = [
      '.clinerules-architect',
      '.clinerules-ask',
      '.clinerules-code',
      '.clinerules-debug',
      '.clinerules-test'
    ];
    
    const missingFiles: string[] = [];
    const existingFiles: string[] = [];
    
    for (const file of requiredFiles) {
      const filePath = path.join(projectDir, file);
      if (await FileUtils.fileExists(filePath)) {
        existingFiles.push(file);
      } else {
        missingFiles.push(file);
      }
    }
    
    return {
      valid: missingFiles.length === 0,
      missingFiles,
      existingFiles
    };
  }

  /**
   * Initializes a Memory Bank in the specified directory
   * 
   * Creates the necessary directory structure and files for a Memory Bank.
   * 
   * @param dirPath - Directory path to initialize
   * @throws Error if initialization fails
   */
  async initializeMemoryBank(dirPath: string): Promise<void> {
    try {
      // Combine the directory path with the folder name
      const memoryBankPath = path.join(dirPath, this.folderName);
      
      // Create the Memory Bank directory if it doesn't exist
      await FileUtils.ensureDirectory(memoryBankPath);
      
      // Create initial files in the Memory Bank directory
      const initialFiles = [
        {
          path: path.join(memoryBankPath, 'product-context.md'),
          content: coreTemplates.find(t => t.name === 'product-context.md')?.content || '',
        },
        {
          path: path.join(memoryBankPath, 'active-context.md'),
          content: coreTemplates.find(t => t.name === 'active-context.md')?.content || '',
        },
        {
          path: path.join(memoryBankPath, 'progress.md'),
          content: coreTemplates.find(t => t.name === 'progress.md')?.content || '',
        },
        {
          path: path.join(memoryBankPath, 'decision-log.md'),
          content: coreTemplates.find(t => t.name === 'decision-log.md')?.content || '',
        },
        {
          path: path.join(memoryBankPath, 'system-patterns.md'),
          content: coreTemplates.find(t => t.name === 'system-patterns.md')?.content || '',
        },
      ];
      
      for (const file of initialFiles) {
        await FileUtils.writeFile(file.path, file.content);
      }
      
      // Set the Memory Bank directory
      this.memoryBankDir = memoryBankPath;
      
      // Initialize the progress tracker
      this.progressTracker = new ProgressTracker(memoryBankPath, this.userId || undefined);
      
      // Initialize the mode manager
      await this.initializeModeManager();
      
      logger.debug('MemoryBankManager', `Memory Bank initialized at: ${memoryBankPath}`);
    } catch (error) {
      logger.error('MemoryBankManager', `Error initializing Memory Bank: ${error}`);
      throw new Error(`Failed to initialize Memory Bank: ${error}`);
    }
  }

  /**
   * Reads a file from the Memory Bank
   * 
   * @param filename - Name of the file to read
   * @returns Content of the file
   * @throws Error if the Memory Bank directory is not set or the file doesn't exist
   */
  async readFile(filename: string): Promise<string> {
    try {
      if (!this.memoryBankDir) {
        throw new Error('Memory Bank directory not set');
      }
      
      const filePath = path.join(this.memoryBankDir, filename);
      if (!await FileUtils.fileExists(filePath)) {
        throw new Error(`File ${filename} not found in Memory Bank`);
      }
      
      return await FileUtils.readFile(filePath);
    } catch (error) {
      logger.error('MemoryBankManager', `Error reading file ${filename} from Memory Bank: ${error}`);
      throw new Error(`Error reading file ${filename} from Memory Bank: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Writes content to a file in the Memory Bank
   * 
   * @param filename - Name of the file to write
   * @param content - Content to write
   * @throws Error if the Memory Bank directory is not set
   */
  async writeFile(filename: string, content: string): Promise<void> {
    try {
      if (!this.memoryBankDir) {
        throw new Error('Memory Bank directory not set');
      }
      
      const filePath = path.join(this.memoryBankDir, filename);
      await FileUtils.writeFile(filePath, content);
      
      // Track progress if ProgressTracker is available
      if (this.progressTracker) {
        try {
          await this.progressTracker.trackProgress('File Update', {
            description: `Updated ${filename}`,
            filename,
          });
        } catch (progressError) {
          console.warn(`Failed to track progress for file update ${filename}:`, progressError);
          // Continue despite progress tracking error
        }
      }
    } catch (error) {
      logger.error('MemoryBankManager', `Error writing to file ${filename} in Memory Bank: ${error}`);
      throw new Error(`Error writing to file ${filename} in Memory Bank: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Lists files in the Memory Bank
   * 
   * @returns List of files
   * @throws Error if the Memory Bank directory is not set
   */
  async listFiles(): Promise<string[]> {
    try {
      if (!this.memoryBankDir) {
        throw new Error('Memory Bank directory not set');
      }
      
      const files = await FileUtils.listFiles(this.memoryBankDir);
      return files.filter(file => file.endsWith('.md'));
    } catch (error) {
      console.error('Error listing files in Memory Bank:', error);
      throw new Error(`Error listing files in Memory Bank: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Gets the status of the Memory Bank
   * 
   * @returns Status object with information about the Memory Bank
   * @throws Error if the Memory Bank directory is not set
   */
  async getStatus(): Promise<MemoryBankStatus> {
    try {
      if (!this.memoryBankDir) {
        throw new Error('Memory Bank directory not set');
      }
      
      const files = await this.listFiles();
      const coreFiles = coreTemplates.map(template => template.name);
      const missingCoreFiles = coreFiles.filter(file => !files.includes(file));
      
      // Get last update time
      let lastUpdated: Date | undefined;
      try {
        if (files.length > 0) {
          const stats = await Promise.all(
            files.map(async file => {
              try {
                const filePath = path.join(this.memoryBankDir!, file);
                return await FileUtils.getFileStats(filePath);
              } catch (statError) {
                console.warn(`Error getting stats for file ${file}:`, statError);
                // Return a default stat object with current time
                return {
                  mtimeMs: Date.now(),
                } as fs.Stats;
              }
            })
          );
          
          const latestMtime = Math.max(...stats.map(stat => stat.mtimeMs));
          lastUpdated = new Date(latestMtime);
        }
      } catch (statsError) {
        console.error('Error getting file stats:', statsError);
        // Continue without lastUpdated information
      }
      
      return {
        path: this.memoryBankDir,
        files,
        coreFilesPresent: coreFiles.filter(file => files.includes(file)),
        missingCoreFiles,
        isComplete: missingCoreFiles.length === 0,
        language: this.language,
        lastUpdated,
      };
    } catch (error) {
      console.error('Error getting Memory Bank status:', error);
      throw new Error(`Error getting Memory Bank status: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Sets a custom path for the Memory Bank
   * 
   * This will set the custom path and check if a valid Memory Bank
   * exists in that path. If it exists, it will set the Memory Bank directory.
   * 
   * @param customPath - Custom path (optional)
   */
  async setCustomPath(customPath?: string): Promise<void> {
    // Use the provided path or the project path
    const basePath = customPath || this.getProjectPath();
    this.customPath = basePath;
    
    // Combine the base path with the folder name to create the Memory Bank path
    const memoryBankPath = path.join(basePath, this.folderName);
    
    if (await FileUtils.fileExists(memoryBankPath)) {
      if (await FileUtils.isDirectory(memoryBankPath)) {
        // Check if it's a valid Memory Bank
        if (await this.isMemoryBank(memoryBankPath)) {
          this.setMemoryBankDir(memoryBankPath);
          logger.debug('MemoryBankManager', `Found existing Memory Bank at: ${memoryBankPath}`);
          
          // Atualizar o status do Memory Bank
          await this.updateMemoryBankStatus();
        }
      }
    }
  }

  /**
   * Gets the custom path for the Memory Bank
   * 
   * @returns Custom path or null if not set
   */
  getCustomPath(): string | null {
    return this.customPath;
  }

  /**
   * Gets the Memory Bank directory
   * 
   * @returns Memory Bank directory or null if not set
   */
  getMemoryBankDir(): string | null {
    return this.memoryBankDir;
  }

  /**
   * Sets the Memory Bank directory
   * 
   * @param dir - Directory path
   */
  setMemoryBankDir(dir: string): void {
    this.memoryBankDir = dir;
    
    // Initialize the progress tracker
    this.progressTracker = new ProgressTracker(dir, this.userId || undefined);
    
    // Initialize the mode manager
    this.initializeModeManager().catch(error => {
      console.error(`Error initializing mode manager: ${error}`);
    });
  }

  /**
   * Gets the ProgressTracker
   * 
   * @returns ProgressTracker or null if not available
   */
  getProgressTracker(): ProgressTracker | null {
    return this.progressTracker;
  }
  
  /**
   * Creates a backup of the Memory Bank
   * 
   * @param backupDir - Directory where the backup will be stored
   * @returns Path to the backup directory
   * @throws Error if the Memory Bank directory is not set or backup fails
   */
  async createBackup(backupDir?: string): Promise<string> {
    if (!this.memoryBankDir) {
      throw new Error('Memory Bank directory not set');
    }
    
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = backupDir 
        ? path.join(backupDir, `memory-bank-backup-${timestamp}`)
        : path.join(path.dirname(this.memoryBankDir), `memory-bank-backup-${timestamp}`);
      
      await FileUtils.ensureDirectory(backupPath);
      
      const files = await this.listFiles();
      for (const file of files) {
        const content = await this.readFile(file);
        await FileUtils.writeFile(path.join(backupPath, file), content);
      }
      
      logger.debug('MemoryBankManager', `Memory Bank backup created at ${backupPath}`);
      return backupPath;
    } catch (error) {
      logger.error('MemoryBankManager', `Error creating Memory Bank backup: ${error}`);
      throw new Error(`Failed to create Memory Bank backup: ${error}`);
    }
  }

  /**
   * Initializes the mode manager
   * 
   * @param initialMode Initial mode to set (optional)
   * @returns Promise that resolves when initialization is complete
   */
  async initializeModeManager(initialMode?: string): Promise<void> {
    if (this.modeManager) {
      return; // Already initialized
    }
    
    try {
      // Load external rules
      const projectRoot = this.getProjectPath();
      this.rulesLoader = new ExternalRulesLoader(projectRoot);
      
      // Validate and create missing .clinerules files
      try {
        const validation = await this.rulesLoader.validateRequiredFiles();
        if (!validation.valid) {
          console.warn(`Warning: Some .clinerules files could not be created: ${validation.missingFiles.join(', ')}`);
          console.warn('Continuing with mode manager initialization despite missing .clinerules files.');
        }
      } catch (validationError) {
        console.warn('Error validating .clinerules files:', validationError);
        console.warn('Continuing with mode manager initialization despite validation errors.');
      }
      
      try {
        await this.rulesLoader.detectAndLoadRules();
      } catch (loadError) {
        console.warn('Error loading .clinerules files:', loadError);
        console.warn('Continuing with mode manager initialization despite loading errors.');
      }
      
      // Create mode manager
      this.modeManager = new ModeManager(this.rulesLoader);
      
      try {
        await this.modeManager.initialize(initialMode);
      } catch (modeError) {
        console.warn('Error initializing mode manager:', modeError);
        console.warn('Mode manager may not be fully functional.');
      }
      
      // Update Memory Bank status
      await this.updateMemoryBankStatus();
    } catch (error) {
      logger.error('MemoryBankManager', `Error initializing mode manager: ${error}`);
      throw error;
    }
  }

  /**
   * Gets the mode manager
   * 
   * @returns Mode manager or null if not initialized
   */
  getModeManager(): ModeManager | null {
    return this.modeManager;
  }

  /**
   * Updates the Memory Bank status in the mode manager
   */
  async updateMemoryBankStatus(): Promise<void> {
    if (this.modeManager) {
      let status: 'ACTIVE' | 'INACTIVE' = 'INACTIVE';
      
      if (this.memoryBankDir) {
        // Check if the directory is a valid Memory Bank
        const isValid = await this.isMemoryBank(this.memoryBankDir);
        if (isValid) {
          status = 'ACTIVE';
        }
      }
      
      this.modeManager.setMemoryBankStatus(status);
    }
  }

  /**
   * Gets the status prefix for responses
   * @returns Status prefix
   */
  getStatusPrefix(): string {
    if (this.modeManager) {
      return this.modeManager.getStatusPrefix();
    }
    return `[MEMORY BANK: ${this.memoryBankDir ? 'ACTIVE' : 'INACTIVE'}]`;
  }

  /**
   * Checks if a text matches the UMB trigger
   * @param text Text to be checked
   * @returns true if the text matches the UMB trigger, false otherwise
   */
  checkUmbTrigger(text: string): boolean {
    if (this.modeManager) {
      return this.modeManager.checkUmbTrigger(text);
    }
    return false;
  }

  /**
   * Activates UMB mode
   * 
   * @returns true if UMB mode was activated, false otherwise
   */
  activateUmbMode(): boolean {
    if (this.modeManager) {
      return this.modeManager.activateUmb();
    }
    return false;
  }

  /**
   * Deactivates UMB mode
   * 
   * @returns true if UMB mode was deactivated, false otherwise
   */
  async completeUmbMode(): Promise<boolean> {
    if (this.modeManager) {
      this.modeManager.deactivateUmb();
      return true;
    }
    return false;
  }

  /**
   * Checks if UMB mode is active
   * @returns true if UMB mode is active, false otherwise
   */
  isUmbModeActive(): boolean {
    if (this.modeManager) {
      return this.modeManager.isUmbModeActive();
    }
    return false;
  }

  /**
   * Alterna para um modo específico
   * @param mode Nome do modo
   * @returns true se a mudança foi bem-sucedida, false caso contrário
   */
  switchMode(mode: string): boolean {
    if (this.modeManager) {
      return this.modeManager.switchMode(mode);
    }
    return false;
  }

  /**
   * Checks if a text matches any mode trigger
   * @param text Text to be checked
   * @returns Array with modes corresponding to the triggers found
   */
  checkModeTriggers(text: string): string[] {
    if (this.modeManager) {
      return this.modeManager.checkModeTriggers(text);
    }
    return [];
  }

  /**
   * Detects mode triggers in a message
   * @param message Message to check for triggers
   * @returns Array with modes corresponding to the triggers found
   */
  detectModeTriggers(message: string): string[] {
    if (this.modeManager) {
      return this.modeManager.checkModeTriggers(message);
    }
    return [];
  }

  /**
   * Gets the folder name used for the Memory Bank
   * 
   * @returns The folder name
   */
  getFolderName(): string {
    return this.folderName;
  }

  /**
   * Migrates Memory Bank files from camelCase to kebab-case naming convention
   * 
   * @returns Object with migration results
   * @throws Error if Memory Bank directory is not set
   */
  async migrateFileNaming(): Promise<{
    success: boolean;
    migrated: string[];
    errors: string[];
  }> {
    const memoryBankDir = this.getMemoryBankDir();
    if (!memoryBankDir) {
      throw new Error('Memory Bank directory not set');
    }

    const result = await MigrationUtils.migrateFileNamingConvention(memoryBankDir);
    
    return {
      success: result.success,
      migrated: result.migratedFiles,
      errors: result.errors
    };
  }
}