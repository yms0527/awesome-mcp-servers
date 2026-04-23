import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// Singleton for managing server reference
class NotificationManager {
  private server: McpServer | null = null;

  setServer(server: McpServer): void {
    this.server = server;
  }

  /**
   * Send a resource list changed notification if connected
   */
  resourcesChanged(): void {
    if (!this.server) return;

    try {
      this.server.server.notification({
        method: 'notifications/resources/list_changed',
      });
    } catch (error) {
      console.error('Failed to send resource change notification:', error);
    }
  }
}

// Export singleton instance
export const notificationManager = new NotificationManager();
