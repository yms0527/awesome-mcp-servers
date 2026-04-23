import { describe, it, expect, beforeAll } from 'vitest';
import { createTestClient, getText } from '../helpers/test-client.js';
import type { Client } from '@modelcontextprotocol/sdk/client/index.js';

describe('find_counters tool', () => {
  let client: Client;

  beforeAll(async () => {
    client = await createTestClient();
  });

  it('finds counter cards', async () => {
    const result = await client.callTool({
      name: 'find_counters',
      arguments: {},
    });
    const text = getText(result);
    expect(text).toContain('Counter');
  });

  it('filters by color', async () => {
    const result = await client.callTool({
      name: 'find_counters',
      arguments: { color: 'Red' },
    });
    expect(result.isError).toBeFalsy();
  });

  it('filters by max cost', async () => {
    const result = await client.callTool({
      name: 'find_counters',
      arguments: { cost_max: 2, limit: 5 },
    });
    expect(result.isError).toBeFalsy();
  });
});
