import { mcpServer } from '@/index';
import z from 'zod';
import { getBrowser } from '@/utils/browserManager';

mcpServer.tool(
  'puppeteer_click',
  'Click an element on the page',
  {
    selector: z.string().describe('CSS selector for element to click'),
  },
  async ({ selector }) => {
    const browser = getBrowser();

    try {
      await browser.click(selector);

      return {
        content: [
          {
            type: 'text',
            text: `Clicked: ${selector}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Failed to click ${selector}: ${(error as Error).message}`,
          },
        ],
        isError: true,
      };
    }
  },
);
