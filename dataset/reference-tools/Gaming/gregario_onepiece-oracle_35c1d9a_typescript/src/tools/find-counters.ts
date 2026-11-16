import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { searchCards } from '../data/cards.js';
import { formatCardBrief } from '../lib/format.js';

export function registerFindCounters(server: McpServer): void {
  server.registerTool(
    'find_counters',
    {
      description:
        'Find One Piece TCG cards with counter values. Useful for building defensive deck strategies. Filter by color and cost.',
      inputSchema: {
        color: z.string().optional().describe('Filter by color: Red, Blue, Green, Purple, Yellow, Black'),
        cost_max: z.number().optional().describe('Maximum cost for counter cards'),
        limit: z.number().min(1).max(50).optional().default(20).describe('Max results'),
      },
    },
    async ({ color, cost_max, limit }) => {
      const result = searchCards({
        has_counter: true,
        color,
        cost_max,
        card_type: 'CHARACTER',
        limit: limit ?? 20,
      });

      if (result.total === 0) {
        return {
          isError: true,
          content: [
            {
              type: 'text' as const,
              text: 'No counter cards found matching your filters.',
            },
          ],
        };
      }

      // Sort by counter value descending
      const sorted = [...result.cards].sort((a, b) => {
        const ca = parseInt(a.counter, 10) || 0;
        const cb = parseInt(b.counter, 10) || 0;
        return cb - ca;
      });

      const lines = [
        `# Counter Cards (${result.total} found, showing ${sorted.length})`,
        '',
        ...sorted.map(
          (c) =>
            `${formatCardBrief(c)} | Counter +${c.counter}`,
        ),
      ];

      return {
        content: [{ type: 'text' as const, text: lines.join('\n') }],
      };
    },
  );
}
