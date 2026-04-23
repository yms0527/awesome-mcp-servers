import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getCardsByName, getCardByNumber } from '../data/cards.js';
import { formatCard } from '../lib/format.js';

export function registerCardVersions(server: McpServer): void {
  server.registerTool(
    'card_versions',
    {
      description:
        'Show all printings/versions of a One Piece TCG card, including alternate art variants. Search by card name or card number.',
      inputSchema: {
        card_name: z.string().optional().describe('Card name to look up (e.g., "Monkey.D.Luffy")'),
        card_number: z.string().optional().describe('Card number to look up (e.g., "OP01-001")'),
      },
    },
    async ({ card_name, card_number }) => {
      if (!card_name && !card_number) {
        return {
          isError: true,
          content: [
            {
              type: 'text' as const,
              text: 'Provide either card_name or card_number to look up.',
            },
          ],
        };
      }

      let cards;
      if (card_number) {
        const card = getCardByNumber(card_number);
        if (!card) {
          return {
            isError: true,
            content: [
              {
                type: 'text' as const,
                text: `Card "${card_number}" not found. Check the card number format (e.g., "OP01-001").`,
              },
            ],
          };
        }
        // Find all versions with the same name
        cards = getCardsByName(card.card_name);
      } else {
        cards = getCardsByName(card_name!);
      }

      if (cards.length === 0) {
        return {
          isError: true,
          content: [
            {
              type: 'text' as const,
              text: `No cards found matching "${card_name || card_number}". Try search_cards for a broader search.`,
            },
          ],
        };
      }

      const name = cards[0].card_name;
      const regular = cards.filter((c) => !c.is_alternate_art);
      const altArt = cards.filter((c) => c.is_alternate_art);

      const lines = [
        `# ${name} — ${cards.length} version${cards.length !== 1 ? 's' : ''}`,
        '',
      ];

      if (regular.length > 0) {
        lines.push(`## Regular (${regular.length})`);
        lines.push('');
        lines.push(regular.map((c) => formatCard(c)).join('\n\n---\n\n'));
      }

      if (altArt.length > 0) {
        lines.push('');
        lines.push(`## Alternate Art (${altArt.length})`);
        lines.push('');
        lines.push(altArt.map((c) => formatCard(c)).join('\n\n---\n\n'));
      }

      return {
        content: [{ type: 'text' as const, text: lines.join('\n') }],
      };
    },
  );
}
