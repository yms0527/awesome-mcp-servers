import { Browser, LaunchOptions, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Add stealth plugin to puppeteer-extra
puppeteer.use(StealthPlugin());

/**
 * PuppeteerBrowser class for managing browser instances and pages
 */
export default class PuppeteerBrowser {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private consoleLogs: string[] = [];

  /**
   * Initializes a new browser session with stealth mode
   */
  async init(headless: boolean = true) {
    try {
      const launchOptions: LaunchOptions = {
        headless: headless ? true : false,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      };

      // Handle Docker-specific needs
      if (process.env.DOCKER_CONTAINER === 'true') {
        launchOptions.args?.push('--single-process', '--no-zygote');
      }

      this.browser = await puppeteer.launch(launchOptions);
      const pages = await this.browser.pages();
      this.page = pages[0] || (await this.browser.newPage());

      // Set up console logging
      this.page.on('console', msg => {
        const logEntry = `[${msg.type()}] ${msg.text()}`;
        this.consoleLogs.push(logEntry);
      });

      return this.page;
    } catch (error) {
      console.error('Failed to initialize browser:', error);
      throw error;
    }
  }

  /**
   * Returns the current page or creates a new one if none exists
   */
  async getPage(): Promise<Page> {
    if (!this.browser) {
      await this.init();
    }

    if (!this.page) {
      this.page = await this.browser!.newPage();

      // Set up console logging for the new page
      this.page.on('console', msg => {
        const logEntry = `[${msg.type()}] ${msg.text()}`;
        this.consoleLogs.push(logEntry);
      });
    }

    return this.page;
  }

  /**
   * Takes a screenshot of the current page or a specific element
   */
  async takeScreenshot(
    selector?: string,
    options: { encoding: 'base64' } = { encoding: 'base64' },
  ): Promise<string | null> {
    try {
      if (!this.page) {
        throw new Error('No page available');
      }

      if (selector) {
        const element = await this.page.$(selector);
        if (!element) {
          throw new Error(`Element not found: ${selector}`);
        }
        const screenshot = await element.screenshot(options);
        return screenshot as string;
      } else {
        const screenshot = await this.page.screenshot({
          ...options,
          fullPage: false,
        });
        return screenshot as string;
      }
    } catch (error) {
      console.error('Failed to take screenshot:', error);
      return null;
    }
  }

  /**
   * Clicks an element on the page
   */
  async click(selector: string): Promise<void> {
    if (!this.page) {
      throw new Error('No page available');
    }

    await this.page.waitForSelector(selector, { visible: true });
    await this.page.click(selector);
  }

  /**
   * Fills a form field
   */
  async fill(selector: string, value: string): Promise<void> {
    if (!this.page) {
      throw new Error('No page available');
    }

    await this.page.waitForSelector(selector, { visible: true });
    await this.page.type(selector, value);
  }

  /**
   * Selects an option from a dropdown
   */
  async select(selector: string, value: string): Promise<void> {
    if (!this.page) {
      throw new Error('No page available');
    }

    await this.page.waitForSelector(selector, { visible: true });
    await this.page.select(selector, value);
  }

  /**
   * Hovers over an element
   */
  async hover(selector: string): Promise<void> {
    if (!this.page) {
      throw new Error('No page available');
    }

    await this.page.waitForSelector(selector, { visible: true });
    await this.page.hover(selector);
  }

  /**
   * Executes JavaScript in the browser
   */
  async evaluate(script: string): Promise<{ result: any; logs: string[] }> {
    if (!this.page) {
      throw new Error('No page available');
    }

    // Set up a helper to capture console logs during script execution
    await this.page.evaluate(() => {
      window.mcpHelper = {
        logs: [],
        originalConsole: { ...console },
      };

      ['log', 'info', 'warn', 'error'].forEach(method => {
        (console as any)[method] = (...args: any[]) => {
          window.mcpHelper.logs.push(`[${method}] ${args.join(' ')}`);
          (window.mcpHelper.originalConsole as any)[method](...args);
        };
      });
    });

    // Execute the script
    const result = await this.page.evaluate(new Function(script) as any);

    // Retrieve logs and restore console
    const logs = await this.page.evaluate(() => {
      const logs = window.mcpHelper.logs;
      Object.assign(console, window.mcpHelper.originalConsole);
      delete (window as any).mcpHelper;
      return logs;
    });

    return { result, logs };
  }

  /**
   * Navigates to a URL
   */
  async navigate(url: string): Promise<void> {
    if (!this.page) {
      throw new Error('No page available');
    }

    await this.page.goto(url, { waitUntil: 'networkidle2' });
  }

  /**
   * Get all console logs
   */
  getConsoleLogs(): string[] {
    return [...this.consoleLogs];
  }

  /**
   * Closes the browser
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}

// Extend the global Window interface for our console capturing
declare global {
  interface Window {
    mcpHelper: {
      logs: string[];
      originalConsole: Partial<typeof console>;
    };
  }
}
