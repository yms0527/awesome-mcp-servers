import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getCards } from '../data/cards.js';
import type { Card } from '../types.js';

function parseDeckList(input: string): { name: string; count: number }[] {
  const lines = input.split('\n').filter((l) => l.trim());
  const entries: { name: string; count: number }[] = [];

  for (const line of lines) {
    const match = line.match(/^(\d+)\s*[x×]?\s*(.+)$/i) || line.match(/^(.+?)\s*[x×]\s*(\d+)$/i);
    if (match) {
      const first = match[1].trim();
      const second = match[2].trim();
      // Determine which is the number
      if (/^\d+$/.test(first)) {
        entries.push({ count: parseInt(first, 10), name: second });
      } else {
        entries.push({ count: parseInt(second, 10), name: first });
      }
    } else {
      entries.push({ count: 1, name: line.trim() });
    }
  }

  return entries;
}

function resolveCard(name: string, allCards: Card[]): Card | undefined {
  const lower = name.toLowerCase();
  // Try exact card number match first
  const byNumber = allCards.find((c) => c.card_number.toLowerCase() === lower);
  if (byNumber) return byNumber;
  // Try exact name match
  const byName = allCards.find(
    (c) => c.card_name.toLowerCase() === lower && !c.is_alternate_art,
  );
  if (byName) return byName;
  // Try partial name match
  return allCards.find(
    (c) => c.card_name.toLowerCase().includes(lower) && !c.is_alternate_art,
  );
}

export function registerAnalyzeCostCurve(server: McpServer): void {
  server.registerTool(
    'analyze_cost_curve',
    {
      description:
        'Analyze the cost curve of a One Piece TCG deck list. Shows cost distribution, color breakdown, and card type spread.',
      inputSchema: {
        deck_list: z
          .string()
          .describe(
            'Deck list as text. Format: "4 Monkey.D.Luffy" or "4x OP01-001" per line.',
          ),
      },
    },
    async ({ deck_list }) => {
      const entries = parseDeckList(deck_list);
      const allCards = getCards();

      const resolved: { card: Card; count: number }[] = [];
      const unresolved: string[] = [];

      for (const entry of entries) {
        const card = resolveCard(entry.name, allCards);
        if (card) {
          resolved.push({ card, count: entry.count });
        } else {
          unresolved.push(entry.name);
        }
      }

      if (resolved.length === 0) {
        return {
          isError: true,
          content: [
            {
              type: 'text' as const,
              text: 'Could not resolve any cards from the deck list. Use card numbers (e.g., "OP01-001") or exact card names.',
            },
          ],
        };
      }

      // Cost distribution
      const costDist = new Map<number, number>();
      let totalCards = 0;
      for (const { card, count } of resolved) {
        const cost = parseInt(card.cost, 10);
        if (!isNaN(cost)) {
          costDist.set(cost, (costDist.get(cost) || 0) + count);
        }
        totalCards += count;
      }

      // Color breakdown
      const colorDist = new Map<string, number>();
      for (const { card, count } of resolved) {
        for (const color of card.colors) {
          colorDist.set(color, (colorDist.get(color) || 0) + count);
        }
      }

      // Type breakdown
      const typeDist = new Map<string, number>();
      for (const { card, count } of resolved) {
        typeDist.set(card.card_type, (typeDist.get(card.card_type) || 0) + count);
      }

      // Counter cards
      let counterCards = 0;
      let totalCounter = 0;
      for (const { card, count } of resolved) {
        if (card.counter !== '-' && card.counter !== '') {
          counterCards += count;
          totalCounter += parseInt(card.counter, 10) * count;
        }
      }

      const lines: string[] = [
        `# Deck Analysis (${totalCards} cards)`,
        '',
      ];

      if (unresolved.length > 0) {
        lines.push('## Unresolved Cards');
        lines.push('');
        for (const name of unresolved) {
          lines.push(`- ~~${name}~~ *(not found)*`);
        }
        lines.push('');
      }

      // Cost curve
      lines.push('## Cost Curve');
      lines.push('');
      const maxCost = Math.max(...costDist.keys(), 0);
      for (let i = 0; i <= maxCost; i++) {
        const count = costDist.get(i) || 0;
        const bar = '█'.repeat(count);
        lines.push(`${i}: ${bar} ${count}`);
      }

      // Color breakdown
      lines.push('');
      lines.push('## Color Breakdown');
      lines.push('');
      for (const [color, count] of [...colorDist.entries()].sort((a, b) => b[1] - a[1])) {
        lines.push(`- **${color}**: ${count} cards`);
      }

      // Type breakdown
      lines.push('');
      lines.push('## Card Types');
      lines.push('');
      for (const [type, count] of [...typeDist.entries()].sort((a, b) => b[1] - a[1])) {
        lines.push(`- **${type}**: ${count}`);
      }

      // Counter summary
      lines.push('');
      lines.push('## Counter Summary');
      lines.push('');
      lines.push(`- **Cards with Counter:** ${counterCards}/${totalCards}`);
      lines.push(`- **Total Counter Value:** +${totalCounter}`);

      return {
        content: [{ type: 'text' as const, text: lines.join('\n') }],
      };
    },
  );
}
