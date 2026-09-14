import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getLeaders } from '../data/cards.js';
import { formatCard } from '../lib/format.js';

export function registerBrowseLeaders(server: McpServer): void {
  server.registerTool(
    'browse_leaders',
    {
      description:
        'Browse all One Piece TCG Leader cards. Filter by color to find leaders for a specific deck color.',
      inputSchema: {
        color: z.string().optional().describe('Filter by color: Red, Blue, Green, Purple, Yellow, Black'),
      },
    },
    async ({ color }) => {
      let leaders = getLeaders();

      if (color) {
        const c = color.toLowerCase();
        leaders = leaders.filter((l) =>
          l.colors.some((cl) => cl.toLowerCase() === c),
        );
      }

      if (leaders.length === 0) {
        return {
          isError: true,
          content: [
            {
              type: 'text' as const,
              text: color
                ? `No leaders found for color "${color}". Available colors: Red, Blue, Green, Purple, Yellow, Black.`
                : 'No leaders found.',
            },
          ],
        };
      }

      const header = color
        ? `# ${color} Leaders (${leaders.length})`
        : `# All Leaders (${leaders.length})`;

      const lines = [header, ''];
      for (const leader of leaders) {
        lines.push(formatCard(leader));
        lines.push('');
        lines.push('---');
        lines.push('');
      }

      return {
        content: [{ type: 'text' as const, text: lines.join('\n') }],
      };
    },
  );
}
