import { describe, it, expect, beforeAll } from 'vitest';
import { createTestClient, getText } from '../helpers/test-client.js';
import type { Client } from '@modelcontextprotocol/sdk/client/index.js';

describe('search_cards tool', () => {
  let client: Client;

  beforeAll(async () => {
    client = await createTestClient();
  });

  it('searches by name', async () => {
    const result = await client.callTool({
      name: 'search_cards',
      arguments: { query: 'Luffy' },
    });
    const text = getText(result);
    expect(text).toContain('Luffy');
  });

  it('searches by card number', async () => {
    const result = await client.callTool({
      name: 'search_cards',
      arguments: { query: 'OP01-001' },
    });
    const text = getText(result);
    expect(text).toContain('Roronoa Zoro');
  });

  it('filters by color', async () => {
    const result = await client.callTool({
      name: 'search_cards',
      arguments: { color: 'Red', card_type: 'LEADER', limit: 5 },
    });
    const text = getText(result);
    expect(text).toContain('Red');
    expect(text).toContain('LEADER');
  });

  it('filters by cost range', async () => {
    const result = await client.callTool({
      name: 'search_cards',
      arguments: { cost_min: 8, cost_max: 10, limit: 5 },
    });
    expect(result.isError).toBeFalsy();
  });

  it('filters by rarity', async () => {
    const result = await client.callTool({
      name: 'search_cards',
      arguments: { rarity: 'SEC', limit: 5 },
    });
    const text = getText(result);
    expect(text).toContain('SEC');
  });

  it('filters by character type', async () => {
    const result = await client.callTool({
      name: 'search_cards',
      arguments: { type: 'Straw Hat Crew', limit: 5 },
    });
    const text = getText(result);
    expect(text).toContain('Straw Hat Crew');
  });

  it('returns error for no results', async () => {
    const result = await client.callTool({
      name: 'search_cards',
      arguments: { query: 'xyznonexistent999' },
    });
    expect(result.isError).toBe(true);
  });

  it('paginates', async () => {
    const result = await client.callTool({
      name: 'search_cards',
      arguments: { color: 'Red', limit: 3, offset: 0 },
    });
    const text = getText(result);
    expect(text).toContain('showing 1-3');
  });
});
