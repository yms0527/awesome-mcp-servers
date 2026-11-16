import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { searchCards } from '../data/cards.js';
import { formatCard } from '../lib/format.js';

export function registerSearchCards(server: McpServer): void {
  server.registerTool(
    'search_cards',
    {
      description:
        'Search One Piece TCG cards by name, color, type, cost, power, rarity, attribute, character type, or set. Returns card details with effects.',
      inputSchema: {
        query: z.string().optional().describe('Search card name, number, effect text, or character type'),
        color: z.string().optional().describe('Card color: Red, Blue, Green, Purple, Yellow, Black'),
        card_type: z.string().optional().describe('Card type: LEADER, CHARACTER, EVENT, STAGE'),
        cost: z.number().optional().describe('Exact cost value'),
        cost_min: z.number().optional().describe('Minimum cost'),
        cost_max: z.number().optional().describe('Maximum cost'),
        power_min: z.number().optional().describe('Minimum power'),
        power_max: z.number().optional().describe('Maximum power'),
        rarity: z.string().optional().describe('Rarity: C, UC, R, SR, SEC, L, SP CARD, P, TR'),
        attribute: z.string().optional().describe('Attribute: Slash, Strike, Ranged, Special, Wisdom'),
        type: z.string().optional().describe('Character type (e.g., "Straw Hat Crew", "Navy", "Supernovas")'),
        set: z.string().optional().describe('Set name or code (e.g., "OP-01", "ROMANCE DAWN")'),
        has_counter: z.boolean().optional().describe('Filter cards with/without counter value'),
        limit: z.number().min(1).max(50).optional().default(10).describe('Max results (default 10)'),
        offset: z.number().min(0).optional().default(0).describe('Offset for pagination'),
      },
    },
    async (args) => {
      const result = searchCards(args);

      if (result.total === 0) {
        return {
          isError: true,
          content: [
            {
              type: 'text' as const,
              text: 'No cards found matching your search. Try broader filters or check spelling.',
            },
          ],
        };
      }

      const start = (args.offset ?? 0) + 1;
      const end = start + result.cards.length - 1;
      const header = `Found ${result.total} card${result.total !== 1 ? 's' : ''} (showing ${start}-${end})\n`;
      const cards = result.cards.map((c) => formatCard(c)).join('\n\n---\n\n');

      return {
        content: [{ type: 'text' as const, text: header + '\n' + cards }],
      };
    },
  );
}
