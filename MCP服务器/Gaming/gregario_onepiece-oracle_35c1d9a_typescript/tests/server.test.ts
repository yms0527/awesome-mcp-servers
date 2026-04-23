import { describe, it, expect, beforeAll } from 'vitest';
import { createTestClient } from './helpers/test-client.js';
import type { Client } from '@modelcontextprotocol/sdk/client/index.js';

describe('onepiece-oracle server', () => {
  let client: Client;

  beforeAll(async () => {
    client = await createTestClient();
  });

  it('lists all 6 tools', async () => {
    const { tools } = await client.listTools();
    expect(tools).toHaveLength(6);
  });

  it('has all expected tools', async () => {
    const { tools } = await client.listTools();
    const names = tools.map((t) => t.name);
    expect(names).toContain('search_cards');
    expect(names).toContain('browse_sets');
    expect(names).toContain('card_versions');
    expect(names).toContain('browse_leaders');
    expect(names).toContain('analyze_cost_curve');
    expect(names).toContain('find_counters');
  });

  it('every tool has a description', async () => {
    const { tools } = await client.listTools();
    for (const tool of tools) {
      expect(tool.description, `${tool.name} missing description`).toBeTruthy();
    }
  });
});
