/**
 * Error handling utilities
 */

export class ErrorHandler {
  // Implementation will be added in later phases
  static handleError(error: unknown, context?: string): string {
    if (error instanceof Error) {
      return `${context ? `[${context}] ` : ''}${error.message}`;
    }
    return `${context ? `[${context}] ` : ''}Unknown error: ${String(error)}`;
  }
  
  static logError(error: unknown, context?: string): void {
    console.error(this.handleError(error, context));
  }
}
