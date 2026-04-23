import { describe, it, expect, beforeAll } from 'vitest';
import { createTestClient, getText } from '../helpers/test-client.js';
import type { Client } from '@modelcontextprotocol/sdk/client/index.js';

describe('analyze_cost_curve tool', () => {
  let client: Client;

  beforeAll(async () => {
    client = await createTestClient();
  });

  it('analyzes a deck list by card numbers', async () => {
    const result = await client.callTool({
      name: 'analyze_cost_curve',
      arguments: {
        deck_list: '4 OP01-001\n4 OP01-004\n4 OP01-006',
      },
    });
    const text = getText(result);
    expect(text).toContain('Cost Curve');
    expect(text).toContain('Color Breakdown');
  });

  it('shows unresolved cards', async () => {
    const result = await client.callTool({
      name: 'analyze_cost_curve',
      arguments: {
        deck_list: '4 OP01-001\n2 Fake Card Name',
      },
    });
    const text = getText(result);
    expect(text).toContain('Unresolved');
    expect(text).toContain('Fake Card Name');
  });

  it('returns error for fully unresolvable list', async () => {
    const result = await client.callTool({
      name: 'analyze_cost_curve',
      arguments: {
        deck_list: '4 ZZZZZ\n4 YYYYY',
      },
    });
    expect(result.isError).toBe(true);
  });
});
