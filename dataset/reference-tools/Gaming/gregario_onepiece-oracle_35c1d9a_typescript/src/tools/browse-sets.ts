import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getSetList, getCardsBySet } from '../data/cards.js';
import { formatCardBrief } from '../lib/format.js';

export function registerBrowseSets(server: McpServer): void {
  server.registerTool(
    'browse_sets',
    {
      description:
        'Browse One Piece TCG sets. List all sets with card counts, or view cards in a specific set.',
      inputSchema: {
        set_name: z.string().optional().describe('Set name or code to browse (e.g., "OP-01", "ROMANCE DAWN"). Omit to list all sets.'),
        limit: z.number().min(1).max(50).optional().default(20).describe('Max cards to show when browsing a set'),
      },
    },
    async ({ set_name, limit }) => {
      if (!set_name) {
        const sets = getSetList();
        const lines = [
          `# One Piece TCG Sets (${sets.length})`,
          '',
          '| Set | Cards |',
          '|-----|-------|',
          ...sets.map((s) => `| ${s.set} | ${s.count} |`),
        ];
        return {
          content: [{ type: 'text' as const, text: lines.join('\n') }],
        };
      }

      const cards = getCardsBySet(set_name);
      if (cards.length === 0) {
        return {
          isError: true,
          content: [
            {
              type: 'text' as const,
              text: `No cards found in set "${set_name}". Use browse_sets without arguments to see all available sets.`,
            },
          ],
        };
      }

      const shown = cards.slice(0, limit ?? 20);
      const lines = [
        `# ${set_name} (${cards.length} cards, showing ${shown.length})`,
        '',
        ...shown.map((c) => formatCardBrief(c)),
      ];

      if (cards.length > shown.length) {
        lines.push('', `*...and ${cards.length - shown.length} more. Use search_cards with set filter for full results.*`);
      }

      return {
        content: [{ type: 'text' as const, text: lines.join('\n') }],
      };
    },
  );
}
