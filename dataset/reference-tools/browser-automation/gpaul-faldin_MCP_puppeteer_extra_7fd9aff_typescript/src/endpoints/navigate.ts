import { mcpServer } from '@/index';
import z from 'zod';
import { getBrowser } from '@/utils/browserManager';

mcpServer.tool(
  'puppeteer_navigate',
  'Navigate to a URL',
  {
    url: z.string().describe('URL to navigate to'),
  },
  async ({ url }) => {
    const browser = getBrowser();
    const page = await browser.getPage();

    try {
      await browser.navigate(url);

      return {
        content: [
          {
            type: 'text',
            text: `Navigated to ${url}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Failed to navigate to ${url}: ${(error as Error).message}`,
          },
        ],
        isError: true,
      };
    }
  },
);
