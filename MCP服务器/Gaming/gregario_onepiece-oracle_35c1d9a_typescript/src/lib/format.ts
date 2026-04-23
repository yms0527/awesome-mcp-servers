import type { Card } from '../types.js';

export function formatCard(card: Card): string {
  const lines: string[] = [];

  lines.push(`## ${card.card_name}`);
  lines.push(`*${card.card_number} — ${card.card_type} — ${card.rarity}*`);
  if (card.is_alternate_art) lines.push('*(Alternate Art)*');
  lines.push('');

  const stats: string[] = [];
  if (card.colors.length > 0) stats.push(`**Color:** ${card.colors.join('/')}`);
  if (card.cost !== '-') stats.push(`**Cost:** ${card.cost}`);
  if (card.power !== '-') stats.push(`**Power:** ${card.power}`);
  if (card.life !== '-') stats.push(`**Life:** ${card.life}`);
  if (card.counter !== '-') stats.push(`**Counter:** +${card.counter}`);
  if (card.attributes.length > 0 && card.attributes[0] !== '')
    stats.push(`**Attribute:** ${card.attributes.join(', ')}`);
  if (stats.length > 0) lines.push(stats.join(' | '));

  if (card.types.length > 0) {
    lines.push(`**Type:** ${card.types.join(' / ')}`);
  }

  if (card.effects && card.effects !== '-') {
    lines.push('');
    lines.push(card.effects);
  }

  lines.push(`**Set:** ${card.card_sets}`);

  return lines.join('\n');
}

export function formatCardBrief(card: Card): string {
  const color = card.colors.join('/');
  const cost = card.cost !== '-' ? `${card.cost}` : '-';
  const power = card.power !== '-' ? `${card.power}` : '-';
  return `- **${card.card_name}** (${card.card_number}) — ${card.card_type} ${color} | Cost ${cost} | Power ${power} | ${card.rarity}`;
}
