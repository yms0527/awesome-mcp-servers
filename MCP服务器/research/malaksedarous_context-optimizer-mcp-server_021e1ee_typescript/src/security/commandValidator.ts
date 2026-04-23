/**
 * Command security filtering utilities
 * 
 * Prevents interactive commands and unauthorized operations
 */

export class CommandValidator {
  // Interactive commands that wait for user input
  private static readonly INTERACTIVE_PATTERNS = [
    /npm\s+(login|adduser)/i,
    /git\s+commit(?!\s+-m)/i,           // git commit without -m flag
    /ssh\s+/i,
    /passwd/i,
    /vim|nano|emacs/i,
    /mysql|psql/i,
    /docker\s+exec.*-it/i,
    /kubectl\s+exec.*-it/i,
    /python(?!\s+\S+\.py)|node(?!\s+\S+\.js)|irb|rails\s+console/i,  // REPL environments
    /ftp|sftp/i,
    /telnet/i,
    /top|htop/i,                        // Interactive monitoring tools
    /less|more(?!\s+\S)/i,              // Pagers without specific files
    /man\s+/i                           // Manual pages
  ];
  
  // Navigation commands that change working directory
  private static readonly NAVIGATION_PATTERNS = [
    /^cd\s+/i,
    /^pushd\s+/i,
    /^popd\s*$/i,
    /&&\s*cd\s+/i,
    /;\s*cd\s+/i,
    /\|\s*cd\s+/i
  ];
  
  // Dangerous system commands
  private static readonly DANGEROUS_PATTERNS = [
    /rm\s+-rf?\s+\/(?![a-zA-Z])/i,      // rm -rf / (but allow /specific/path)
    /mkfs/i,
    /fdisk/i,
    /dd\s+.*of=/i,
    /halt|shutdown|reboot/i,
    /kill\s+-9/i,
    /killall/i,
    /chmod\s+777/i,
    /chown\s+.*root/i
  ];
  
  static validateCommand(command: string): {
    valid: boolean;
    error?: string;
    warnings?: string[];
  } {
    const warnings: string[] = [];
    
    // Check for interactive commands
    for (const pattern of this.INTERACTIVE_PATTERNS) {
      if (pattern.test(command)) {
        return {
          valid: false,
          error: `Interactive command detected: '${command}'. This command appears to wait for user input and is not supported. Use non-interactive alternatives (e.g., 'git commit -m "message"' instead of 'git commit').`
        };
      }
    }
    
    // Check for navigation commands
    for (const pattern of this.NAVIGATION_PATTERNS) {
      if (pattern.test(command)) {
        return {
          valid: false,
          error: `Navigation command detected: '${command}'. Directory navigation commands are not allowed. Use the 'workingDirectory' parameter instead to specify where the command should run.`
        };
      }
    }
    
    // Check for dangerous commands
    for (const pattern of this.DANGEROUS_PATTERNS) {
      if (pattern.test(command)) {
        return {
          valid: false,
          error: `Dangerous command detected: '${command}'. This command could be harmful to the system and is not allowed.`
        };
      }
    }
    
    // Add warnings for potentially problematic commands
    if (/sudo/i.test(command)) {
      warnings.push('Command contains sudo - ensure proper permissions are configured');
    }
    
    if (/sleep\s+[0-9]{3,}/i.test(command)) {
      warnings.push('Command contains long sleep - may timeout');
    }
    
    const result: {
      valid: boolean;
      error?: string;
      warnings?: string[];
    } = {
      valid: true
    };
    
    if (warnings.length > 0) {
      result.warnings = warnings;
    }
    
    return result;
  }
}
