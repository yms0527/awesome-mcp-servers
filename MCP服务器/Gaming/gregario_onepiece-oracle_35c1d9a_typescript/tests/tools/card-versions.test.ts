import { describe, it, expect, beforeAll } from 'vitest';
import { createTestClient, getText } from '../helpers/test-client.js';
import type { Client } from '@modelcontextprotocol/sdk/client/index.js';

describe('card_versions tool', () => {
  let client: Client;

  beforeAll(async () => {
    client = await createTestClient();
  });

  it('finds versions by card number', async () => {
    const result = await client.callTool({
      name: 'card_versions',
      arguments: { card_number: 'OP01-001' },
    });
    const text = getText(result);
    expect(text).toContain('Roronoa Zoro');
  });

  it('finds versions by card name', async () => {
    const result = await client.callTool({
      name: 'card_versions',
      arguments: { card_name: 'Roronoa Zoro' },
    });
    const text = getText(result);
    expect(text).toContain('version');
  });

  it('returns error with no args', async () => {
    const result = await client.callTool({
      name: 'card_versions',
      arguments: {},
    });
    expect(result.isError).toBe(true);
  });

  it('returns error for unknown card', async () => {
    const result = await client.callTool({
      name: 'card_versions',
      arguments: { card_number: 'ZZ99-999' },
    });
    expect(result.isError).toBe(true);
  });
});
