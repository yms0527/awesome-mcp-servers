import { mcpServer } from '@/index';
import z from 'zod';
import { getBrowser } from '@/utils/browserManager';

mcpServer.tool(
  'puppeteer_fill',
  'Fill out an input field',
  {
    selector: z.string().describe('CSS selector for input field'),
    value: z.string().describe('Value to fill'),
  },
  async ({ selector, value }) => {
    const browser = getBrowser();

    try {
      await browser.fill(selector, value);

      return {
        content: [
          {
            type: 'text',
            text: `Filled ${selector} with: ${value}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Failed to fill ${selector}: ${(error as Error).message}`,
          },
        ],
        isError: true,
      };
    }
  },
);
