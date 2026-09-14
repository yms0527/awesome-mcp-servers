import { describe, it, expect, beforeAll } from 'vitest';
import { createTestClient, getText } from '../helpers/test-client.js';
import type { Client } from '@modelcontextprotocol/sdk/client/index.js';

describe('browse_leaders tool', () => {
  let client: Client;

  beforeAll(async () => {
    client = await createTestClient();
  });

  it('lists all leaders', async () => {
    const result = await client.callTool({
      name: 'browse_leaders',
      arguments: {},
    });
    const text = getText(result);
    expect(text).toContain('Leaders');
    expect(text).toContain('LEADER');
  });

  it('filters by color', async () => {
    const result = await client.callTool({
      name: 'browse_leaders',
      arguments: { color: 'Red' },
    });
    const text = getText(result);
    expect(text).toContain('Red');
  });

  it('returns error for invalid color', async () => {
    const result = await client.callTool({
      name: 'browse_leaders',
      arguments: { color: 'Orange' },
    });
    expect(result.isError).toBe(true);
  });
});
