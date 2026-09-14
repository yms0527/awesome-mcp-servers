import { mcpServer } from '@/index';
import z from 'zod';
import { getBrowser } from '@/utils/browserManager';

mcpServer.tool(
  'puppeteer_evaluate',
  'Execute JavaScript in the browser console',
  {
    script: z.string().describe('JavaScript code to execute'),
  },
  async ({ script }) => {
    const browser = getBrowser();

    try {
      const { result, logs } = await browser.evaluate(script);

      return {
        content: [
          {
            type: 'text',
            text: `Execution result:\n${JSON.stringify(
              result,
              null,
              2,
            )}\n\nConsole output:\n${logs.join('\n')}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Script execution failed: ${(error as Error).message}`,
          },
        ],
        isError: true,
      };
    }
  },
);
