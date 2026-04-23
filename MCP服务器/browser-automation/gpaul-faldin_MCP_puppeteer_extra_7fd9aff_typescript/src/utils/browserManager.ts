import PuppeteerBrowser from '@/class/browser.class';

// Singleton instance of the browser
let browserInstance: PuppeteerBrowser;

/**
 * Gets the singleton instance of the browser
 */
export function getBrowser(): PuppeteerBrowser {
  if (!browserInstance) {
    browserInstance = new PuppeteerBrowser();
  }
  return browserInstance;
}

/**
 * Initialize the browser
 * @param headless Whether to run in headless mode
 */
export async function initBrowser(headless: boolean = true): Promise<void> {
  const browser = getBrowser();
  await browser.init(headless);
}

/**
 * Close the browser instance
 */
export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = undefined as any;
  }
}
