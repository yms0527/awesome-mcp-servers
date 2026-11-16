import { mcpServer } from '@/index';
import z from 'zod';
import { getBrowser } from '@/utils/browserManager';
import { screenshotStore } from '@/utils/screenshotManager';

mcpServer.tool(
  'puppeteer_screenshot',
  'Take a screenshot of the current page or a specific element',
  {
    name: z.string().describe('Name for the screenshot'),
    selector: z.string().optional().describe('CSS selector for element to screenshot'),
    width: z.number().optional().describe('Width in pixels (default: 800)'),
    height: z.number().optional().describe('Height in pixels (default: 600)'),
  },
  async ({ name, selector, width = 800, height = 600 }) => {
    const browser = getBrowser();
    const page = await browser.getPage();

    try {
      // Set viewport dimensions
      await page.setViewport({ width, height });

      // Take the screenshot
      const screenshot = await browser.takeScreenshot(selector);

      if (!screenshot) {
        return {
          content: [
            {
              type: 'text',
              text: selector
                ? `Element not found or could not capture: ${selector}`
                : 'Failed to take screenshot',
            },
          ],
          isError: true,
        };
      }

      // Store the screenshot and trigger a resource list change notification
      screenshotStore.save(name, screenshot, true);

      return {
        content: [
          {
            type: 'text',
            text: `Screenshot '${name}' taken at ${width}x${height}`,
          },
          {
            type: 'image',
            data: screenshot,
            mimeType: 'image/png',
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Failed to take screenshot: ${(error as Error).message}`,
          },
        ],
        isError: true,
      };
    }
  },
);
