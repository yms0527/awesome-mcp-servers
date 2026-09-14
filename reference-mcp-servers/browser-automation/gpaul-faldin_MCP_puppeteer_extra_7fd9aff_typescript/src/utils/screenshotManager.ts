import { Screenshot } from '@/types/screenshot';
import { notificationManager } from './notificationUtil';

/**
 * Class to manage screenshot storage
 */
class ScreenshotStore {
  private screenshots: Map<string, Screenshot> = new Map();

  /**
   * Save a screenshot to the store
   */
  save(name: string, data: string, notifyChange: boolean = true): void {
    this.screenshots.set(name, {
      name,
      data,
      timestamp: new Date(),
    });

    // When a screenshot is saved, notify that resources have changed
    if (notifyChange) {
      notificationManager.resourcesChanged();
    }
  }

  /**
   * Get a screenshot by name
   */
  get(name: string): Screenshot | undefined {
    return this.screenshots.get(name);
  }

  /**
   * Get all screenshot names
   */
  getAll(): Screenshot[] {
    return Array.from(this.screenshots.values());
  }

  /**
   * Check if a screenshot exists
   */
  exists(name: string): boolean {
    return this.screenshots.has(name);
  }

  /**
   * Get the count of screenshots
   */
  count(): number {
    return this.screenshots.size;
  }

  /**
   * Delete a screenshot
   */
  delete(name: string): boolean {
    return this.screenshots.delete(name);
  }

  /**
   * Clear all screenshots
   */
  clear(): void {
    this.screenshots.clear();
  }
}

// Export a singleton instance
export const screenshotStore = new ScreenshotStore();
