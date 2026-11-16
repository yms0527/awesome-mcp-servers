import { mcpServer } from '@/index';
import z from 'zod';
import { getBrowser } from '@/utils/browserManager';

mcpServer.tool(
  'puppeteer_select',
  'Select an element on the page with Select tag',
  {
    selector: z.string().describe('CSS selector for element to select'),
    value: z.string().describe('Value to select'),
  },
  async ({ selector, value }) => {
    const browser = getBrowser();

    try {
      await browser.select(selector, value);

      return {
        content: [
          {
            type: 'text',
            text: `Selected ${selector} with: ${value}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Failed to select ${selector}: ${(error as Error).message}`,
          },
        ],
        isError: true,
      };
    }
  },
);
