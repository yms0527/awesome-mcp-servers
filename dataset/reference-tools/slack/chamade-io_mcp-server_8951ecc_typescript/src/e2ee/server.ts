/**
 * Local stdio MCP server for E2EE tools.
 *
 * Invoked by `chamade-mcp --e2ee-local`. Hosts the six shim-only E2EE
 * tools (`chamade_e2ee_enable`, `_disable`, `_register_peer`, `_status`,
 * `_encrypt`, `_decrypt`). Stays local by design: the whole point of
 * E2EE is that the keys never leave the host, so these tools cannot
 * live on the hosted HTTP MCP.
 *
 * The protocol handling is deliberately minimal (newline-delimited
 * JSON-RPC) so the shim stays light — pulling in @modelcontextprotocol/sdk
 * would ~double the install size for a very small surface.
 *
 * Usage in `.mcp.json`:
 *
 *   {
 *     "chamade-e2ee": {
 *       "command": "npx",
 *       "args": ["-y", "@chamade/mcp-server@3", "--e2ee-local"]
 *     }
 *   }
 *
 * Pair this alongside the main `chamade` server (no flag) so the agent
 * has both the control plane (hosted) and the E2EE tools (local).
 */
import { createInterface } from 'node:readline';

import { sealedBoxScheme } from './sealed-box.js';
import type { EncryptedBlock, E2EEScheme } from './types.js';

// ── Scheme registry ──────────────────────────────────────────────────────
// Today only sealed-box-x25519 is live. Adding another scheme means
// dropping it into this map + wiring a tool variant if needed.

const schemes: Record<string, E2EEScheme> = {
  [sealedBoxScheme.name]: sealedBoxScheme,
};

const DEFAULT_SCHEME = sealedBoxScheme.name;

// V1 supports NC Talk only — Matrix and Signal land in later iterations.
// Keeping this list in one place so every tool that accepts `platform`
// rejects unsupported values up-front (and so the agent sees a clear
// enum in tools/list instead of a free-form string).
const SUPPORTED_PLATFORMS = ['nctalk'] as const;

const PLATFORM_SCHEMA = {
  type: 'string',
  enum: SUPPORTED_PLATFORMS,
  description:
    'Platform identifier. V1 only supports "nctalk" (Nextcloud Talk). ' +
    'Other Chamade platforms (Telegram, Discord, Teams, Meet, Slack, ' +
    'WhatsApp, SIP, Zoom) do not support E2EE — do not ask the user to ' +
    'choose among them.',
} as const;

function assertSupportedPlatform(platform: string): void {
  if (!(SUPPORTED_PLATFORMS as readonly string[]).includes(platform)) {
    throw new Error(
      `platform "${platform}" does not support E2EE. ` +
      `Supported: ${SUPPORTED_PLATFORMS.join(', ')}.`
    );
  }
}

// ── Tool definitions ─────────────────────────────────────────────────────

interface ToolDef {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (args: Record<string, any>) => Promise<unknown>;
}

const tools: ToolDef[] = [
  {
    name: 'chamade_e2ee_enable',
    description:
      'Enable E2EE for a Nextcloud Talk connection by generating a local ' +
      'X25519 keypair. Returns the public key to paste into the addon ' +
      'admin UI. Idempotent: if a keypair already exists for this account ' +
      'it is returned unchanged. ' +
      'V1 only supports `platform="nctalk"` — do not offer the user other ' +
      'platforms. The `account_id` is the Nextcloud base URL (e.g. ' +
      '"https://cloud.example.com"), not a Chamade UUID. ' +
      "If the operator asks to enable E2EE without giving a URL, **call " +
      "`chamade_account` first** — when a Nextcloud Talk connection is " +
      "active it is surfaced as `platforms.nctalk.account_id`. Use that " +
      "value verbatim, do not ask the operator to retype it and do not " +
      "guess from their email or operator handle.",
    inputSchema: {
      type: 'object',
      properties: {
        platform: PLATFORM_SCHEMA,
        account_id: {
          type: 'string',
          description:
            'Nextcloud base URL of the connected instance, e.g. ' +
            '"https://cloud.example.com". Match the same string used by ' +
            'the addon admin UI so the two keystores resolve to the same ' +
            'identity.',
        },
      },
      required: ['platform', 'account_id'],
    },
    handler: async (args) => {
      const platform = String(args.platform || '').trim();
      const accountId = String(args.account_id || '').trim();
      if (!platform || !accountId) throw new Error('platform and account_id are required');
      assertSupportedPlatform(platform);
      const acc = await schemes[DEFAULT_SCHEME].enable(platform, accountId);
      return {
        scheme: acc.scheme,
        platform: acc.platform,
        account_id: acc.account_id,
        device_id: acc.device_id,
        pubkey_b64: acc.pubkey_b64,
        fingerprint: acc.fingerprint,
        paste_into_addon:
          'Paste this pubkey_b64 into your NC admin → Talk → Chamade Bridge → ' +
          'E2EE → "Add a shim pubkey".',
      };
    },
  },

  {
    name: 'chamade_e2ee_disable',
    description:
      'Delete the local E2EE keypair for a Nextcloud Talk account. ' +
      'Subsequent traffic for this account travels plaintext (unless ' +
      're-enabled). V1 only supports `platform="nctalk"`.',
    inputSchema: {
      type: 'object',
      properties: {
        platform: PLATFORM_SCHEMA,
        account_id: { type: 'string', description: 'Nextcloud base URL.' },
      },
      required: ['platform', 'account_id'],
    },
    handler: async (args) => {
      const platform = String(args.platform || '').trim();
      const accountId = String(args.account_id || '').trim();
      if (!platform || !accountId) throw new Error('platform and account_id are required');
      assertSupportedPlatform(platform);
      await schemes[DEFAULT_SCHEME].disable(platform, accountId);
      return { disabled: true };
    },
  },

  {
    name: 'chamade_e2ee_register_peer',
    description:
      'Register the NC Talk addon\'s public key as a peer for this account. ' +
      'Call this after copying the addon_pubkey from the NC admin page — the ' +
      'shim needs it to encrypt messages for the user\'s Nextcloud. V1 only ' +
      'supports `platform="nctalk"`.',
    inputSchema: {
      type: 'object',
      properties: {
        platform: PLATFORM_SCHEMA,
        account_id: { type: 'string', description: 'Nextcloud base URL.' },
        peer_pubkey_b64: {
          type: 'string',
          description: 'base64-encoded X25519 pubkey displayed by the addon admin UI',
        },
        peer_label: {
          type: 'string',
          description: 'optional human-readable label, e.g. "nc.example.com"',
        },
      },
      required: ['platform', 'account_id', 'peer_pubkey_b64'],
    },
    handler: async (args) => {
      const platform = String(args.platform || '').trim();
      const accountId = String(args.account_id || '').trim();
      const pubkey = String(args.peer_pubkey_b64 || '').trim();
      const label = String(args.peer_label || '').trim();
      if (!platform || !accountId || !pubkey) {
        throw new Error('platform, account_id, peer_pubkey_b64 are required');
      }
      assertSupportedPlatform(platform);
      const peer = await schemes[DEFAULT_SCHEME].registerPeer(
        platform, accountId, pubkey, label,
      );
      return { peer };
    },
  },

  {
    name: 'chamade_e2ee_status',
    description:
      'List all local E2EE keystores — one per (platform, account_id). For each, ' +
      'returns the device_id/fingerprint plus paired-peer metadata and the ' +
      'last encrypt/decrypt timestamps. Private keys are never returned. ' +
      "An empty `accounts` list means E2EE has never been enabled on this " +
      "shim host — do not interpret that as 'no NC Talk connection'; the " +
      "operator's NC Talk connection may exist on the Chamade side. To " +
      "find the right `account_id` for `chamade_e2ee_enable`, call " +
      "`chamade_account` and read `platforms.nctalk.account_id`.",
    inputSchema: { type: 'object', properties: {} },
    handler: async () => {
      const accounts = await schemes[DEFAULT_SCHEME].status();
      return {
        scheme: DEFAULT_SCHEME,
        accounts_hint:
          accounts.length === 0
            ? 'No local keystore yet. To enable E2EE, call chamade_account ' +
              'to discover the operator\'s NC Talk connection (the value of ' +
              'platforms.nctalk.account_id is the NC base URL), then pass ' +
              'it to chamade_e2ee_enable.'
            : undefined,
        accounts: accounts.map((a) => ({
          platform: a.platform,
          account_id: a.account_id,
          device_id: a.device_id,
          pubkey_b64: a.pubkey_b64,
          fingerprint: a.fingerprint,
          generated_at: a.generated_at,
          peer_configured: a.peers.length > 0,
          peers: a.peers.map((p) => ({
            device_id: p.device_id,
            fingerprint: p.fingerprint,
            label: p.label,
            added_at: p.added_at,
          })),
          last_encrypt_ok_at: a.last_encrypt_ok_at,
          last_decrypt_ok_at: a.last_decrypt_ok_at,
        })),
      };
    },
  },

  {
    name: 'chamade_e2ee_encrypt',
    description:
      'Encrypt plaintext for all registered peers of a Nextcloud Talk account. ' +
      'Returns an `encrypted` block ready to embed into a Chamade DM/chat POST ' +
      '(e.g. `{"encrypted": <this>}` in the body of /api/dm/chat). V1 only ' +
      'supports `platform="nctalk"`.',
    inputSchema: {
      type: 'object',
      properties: {
        platform: PLATFORM_SCHEMA,
        account_id: { type: 'string', description: 'Nextcloud base URL.' },
        plaintext: { type: 'string' },
      },
      required: ['platform', 'account_id', 'plaintext'],
    },
    handler: async (args) => {
      const platform = String(args.platform || '').trim();
      const accountId = String(args.account_id || '').trim();
      const plaintext = args.plaintext;
      if (!platform || !accountId) {
        throw new Error('platform and account_id are required');
      }
      if (typeof plaintext !== 'string') {
        throw new Error('plaintext must be a string');
      }
      assertSupportedPlatform(platform);
      const block = await schemes[DEFAULT_SCHEME].encrypt(platform, accountId, plaintext);
      return { encrypted: block };
    },
  },

  {
    name: 'chamade_e2ee_decrypt',
    description:
      'Decrypt an `encrypted` block received from Chamade (e.g. from an ' +
      'inbox `dm_chat` event carrying `encrypted: {...}` instead of `text`). ' +
      'Returns the plaintext — the agent should treat this exactly like it ' +
      'would the `text` field of a non-E2EE message. V1 only supports ' +
      '`platform="nctalk"`.',
    inputSchema: {
      type: 'object',
      properties: {
        platform: PLATFORM_SCHEMA,
        account_id: { type: 'string', description: 'Nextcloud base URL.' },
        encrypted: {
          type: 'object',
          description: 'the opaque block received from Chamade',
          properties: {
            scheme: { type: 'string' },
            recipients: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  device_id: { type: 'string' },
                  ciphertext_b64: { type: 'string' },
                },
                required: ['device_id', 'ciphertext_b64'],
              },
            },
            metadata: { type: 'object' },
          },
          required: ['scheme', 'recipients'],
        },
      },
      required: ['platform', 'account_id', 'encrypted'],
    },
    handler: async (args) => {
      const platform = String(args.platform || '').trim();
      const accountId = String(args.account_id || '').trim();
      const block = args.encrypted as EncryptedBlock;
      if (!platform || !accountId) {
        throw new Error('platform and account_id are required');
      }
      assertSupportedPlatform(platform);
      const scheme = schemes[block?.scheme || DEFAULT_SCHEME];
      if (!scheme) {
        throw new Error(`unknown scheme: ${block?.scheme}`);
      }
      const plaintext = await scheme.decrypt(platform, accountId, block);
      return { plaintext };
    },
  },
];

// ── JSON-RPC protocol ────────────────────────────────────────────────────

interface JsonRpcMessage {
  jsonrpc?: '2.0';
  id?: number | string | null;
  method?: string;
  params?: any;
  result?: any;
  error?: { code: number; message: string; data?: any };
}

function writeMessage(msg: JsonRpcMessage): void {
  process.stdout.write(JSON.stringify(msg) + '\n');
}

function reply(id: number | string | null | undefined, result: any): void {
  writeMessage({ jsonrpc: '2.0', id: id ?? null, result });
}

function replyError(
  id: number | string | null | undefined,
  code: number,
  message: string,
): void {
  writeMessage({
    jsonrpc: '2.0',
    id: id ?? null,
    error: { code, message },
  });
}

async function handle(msg: JsonRpcMessage): Promise<void> {
  const { id, method, params } = msg;

  switch (method) {
    case 'initialize': {
      reply(id, {
        protocolVersion: '2025-03-26',
        serverInfo: {
          name: '@chamade/mcp-server',
          version: '3.0.2-e2ee',
          title: 'Chamade E2EE (local)',
        },
        capabilities: { tools: {} },
        instructions:
          'Local E2EE tools for Chamade. These run on your host; keys never leave it. ' +
          'Pair with the main `chamade` MCP server for the control plane.',
      });
      return;
    }

    case 'notifications/initialized':
      return; // Client-sent notification; no response expected.

    case 'tools/list': {
      reply(id, {
        tools: tools.map((t) => ({
          name: t.name,
          description: t.description,
          inputSchema: t.inputSchema,
        })),
      });
      return;
    }

    case 'tools/call': {
      const name = params?.name;
      const args = params?.arguments || {};
      const tool = tools.find((t) => t.name === name);
      if (!tool) {
        replyError(id, -32601, `unknown tool: ${name}`);
        return;
      }
      try {
        const result = await tool.handler(args);
        reply(id, {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
          isError: false,
        });
      } catch (e: any) {
        // Surface as a tool error (content) rather than JSON-RPC error
        // so the agent can read the message and course-correct, per MCP
        // tool-call error conventions.
        reply(id, {
          content: [{ type: 'text', text: `Error: ${e?.message || String(e)}` }],
          isError: true,
        });
      }
      return;
    }

    case 'ping':
      reply(id, {});
      return;

    default:
      if (id !== undefined && id !== null) {
        replyError(id, -32601, `method not found: ${method}`);
      }
      return;
  }
}

export function runE2eeServer(): void {
  const rl = createInterface({ input: process.stdin });
  rl.on('line', (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    let msg: JsonRpcMessage;
    try {
      msg = JSON.parse(trimmed);
    } catch {
      // Protocol violation; silently drop — MCP spec says servers
      // should tolerate bad framing without crashing.
      return;
    }
    // Fire-and-forget; errors inside handle() are already converted to
    // JSON-RPC error replies.
    handle(msg).catch((e) => {
      process.stderr.write(`[e2ee-server] handler crashed: ${e?.stack || e}\n`);
    });
  });
  rl.on('close', () => process.exit(0));
}
