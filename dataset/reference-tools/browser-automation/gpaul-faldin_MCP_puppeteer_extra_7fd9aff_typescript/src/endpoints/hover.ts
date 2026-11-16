import { mcpServer } from '@/index';
import z from 'zod';
import { getBrowser } from '@/utils/browserManager';

mcpServer.tool(
  'puppeteer_hover',
  'Hover an element on the page',
  {
    selector: z.string().describe('CSS selector for element to hover'),
  },
  async ({ selector }) => {
    const browser = getBrowser();

    try {
      await browser.hover(selector);

      return {
        content: [
          {
            type: 'text',
            text: `Hovered ${selector}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Failed to hover ${selector}: ${(error as Error).message}`,
          },
        ],
        isError: true,
      };
    }
  },
);
