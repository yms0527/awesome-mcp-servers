import { describe, it, expect, beforeAll } from 'vitest';
import { createTestClient, getText } from '../helpers/test-client.js';
import type { Client } from '@modelcontextprotocol/sdk/client/index.js';

describe('browse_sets tool', () => {
  let client: Client;

  beforeAll(async () => {
    client = await createTestClient();
  });

  it('lists all sets', async () => {
    const result = await client.callTool({
      name: 'browse_sets',
      arguments: {},
    });
    const text = getText(result);
    expect(text).toContain('ROMANCE DAWN');
    expect(text).toContain('Sets');
  });

  it('shows cards in a set', async () => {
    const result = await client.callTool({
      name: 'browse_sets',
      arguments: { set_name: 'OP-01' },
    });
    const text = getText(result);
    expect(text).toContain('OP-01');
  });

  it('returns error for invalid set', async () => {
    const result = await client.callTool({
      name: 'browse_sets',
      arguments: { set_name: 'NONEXISTENT-99' },
    });
    expect(result.isError).toBe(true);
  });
});
