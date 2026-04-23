import type { Card, SearchFilters } from '../types.js';

let _cards: Card[] | null = null;
let _initPromise: Promise<void> | null = null;

async function loadCards(): Promise<void> {
  const data = await import('one-piece-card-game-json');
  _cards = (data.all || data.default?.all || []) as Card[];
}

export async function initCards(): Promise<void> {
  if (_cards) return;
  if (!_initPromise) _initPromise = loadCards();
  await _initPromise;
}

export function getCards(): Card[] {
  if (!_cards) {
    throw new Error('Cards not loaded. Call initCards() first.');
  }
  return _cards;
}

export function getUniqueCards(): Card[] {
  return getCards().filter((c) => !c.is_alternate_art);
}

function matchesQuery(card: Card, query: string): boolean {
  const q = query.toLowerCase();
  return (
    card.card_name.toLowerCase().includes(q) ||
    card.card_number.toLowerCase().includes(q) ||
    card.effects.toLowerCase().includes(q) ||
    card.types.some((t) => t.toLowerCase().includes(q))
  );
}

function parseNumeric(val: string): number | null {
  if (val === '-' || val === '') return null;
  const n = parseInt(val, 10);
  return isNaN(n) ? null : n;
}

export interface SearchResult {
  cards: Card[];
  total: number;
}

export function searchCards(filters: SearchFilters): SearchResult {
  let cards = getCards();

  if (filters.query) {
    const q = filters.query;
    cards = cards.filter((c) => matchesQuery(c, q));
  }

  if (filters.color) {
    const color = filters.color.toLowerCase();
    cards = cards.filter((c) =>
      c.colors.some((cl) => cl.toLowerCase() === color),
    );
  }

  if (filters.card_type) {
    const ct = filters.card_type.toUpperCase();
    cards = cards.filter((c) => c.card_type === ct);
  }

  if (filters.cost !== undefined) {
    cards = cards.filter((c) => parseNumeric(c.cost) === filters.cost);
  }

  if (filters.cost_min !== undefined) {
    cards = cards.filter((c) => {
      const n = parseNumeric(c.cost);
      return n !== null && n >= filters.cost_min!;
    });
  }

  if (filters.cost_max !== undefined) {
    cards = cards.filter((c) => {
      const n = parseNumeric(c.cost);
      return n !== null && n <= filters.cost_max!;
    });
  }

  if (filters.power_min !== undefined) {
    cards = cards.filter((c) => {
      const n = parseNumeric(c.power);
      return n !== null && n >= filters.power_min!;
    });
  }

  if (filters.power_max !== undefined) {
    cards = cards.filter((c) => {
      const n = parseNumeric(c.power);
      return n !== null && n <= filters.power_max!;
    });
  }

  if (filters.rarity) {
    const r = filters.rarity.toUpperCase();
    cards = cards.filter((c) => c.rarity === r);
  }

  if (filters.attribute) {
    const attr = filters.attribute.toLowerCase();
    cards = cards.filter((c) =>
      c.attributes.some((a) => a.toLowerCase() === attr),
    );
  }

  if (filters.type) {
    const t = filters.type.toLowerCase();
    cards = cards.filter((c) =>
      c.types.some((tp) => tp.toLowerCase().includes(t)),
    );
  }

  if (filters.set) {
    const s = filters.set.toLowerCase();
    cards = cards.filter((c) => c.card_sets.toLowerCase().includes(s));
  }

  if (filters.has_counter !== undefined) {
    if (filters.has_counter) {
      cards = cards.filter((c) => c.counter !== '-' && c.counter !== '');
    } else {
      cards = cards.filter((c) => c.counter === '-' || c.counter === '');
    }
  }

  const total = cards.length;
  const limit = filters.limit ?? 20;
  const offset = filters.offset ?? 0;

  return {
    cards: cards.slice(offset, offset + limit),
    total,
  };
}

export function getCardByNumber(cardNumber: string): Card | undefined {
  return getCards().find(
    (c) => c.card_number.toLowerCase() === cardNumber.toLowerCase(),
  );
}

export function getCardsByName(name: string): Card[] {
  const n = name.toLowerCase();
  return getCards().filter((c) => c.card_name.toLowerCase() === n);
}

export function getLeaders(): Card[] {
  return getCards().filter((c) => c.card_type === 'LEADER' && !c.is_alternate_art);
}

export function getSetList(): { set: string; count: number }[] {
  const sets = new Map<string, number>();
  for (const card of getUniqueCards()) {
    const s = card.card_sets;
    sets.set(s, (sets.get(s) || 0) + 1);
  }
  return [...sets.entries()]
    .map(([set, count]) => ({ set, count }))
    .sort((a, b) => a.set.localeCompare(b.set));
}

export function getCardsBySet(setName: string): Card[] {
  const s = setName.toLowerCase();
  return getUniqueCards().filter((c) => c.card_sets.toLowerCase().includes(s));
}
