# @chamade/mcp-server

[![npm version](https://img.shields.io/npm/v/@chamade/mcp-server.svg)](https://www.npmjs.com/package/@chamade/mcp-server)
[![npm downloads](https://img.shields.io/npm/dm/@chamade/mcp-server.svg)](https://www.npmjs.com/package/@chamade/mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

MCP (Model Context Protocol) server for [Chamade](https://chamade.io) — a voice and chat gateway that lets your AI agent join meetings and DMs on Discord, Microsoft Teams, Google Meet, Telegram, SIP, Zoom, Nextcloud Talk, Slack, and WhatsApp.

**The recommended voice path is hosted STT/TTS with bring-your-own-key.** Drop your own ElevenLabs / Deepgram / OpenAI / Cartesia API key in [your dashboard](https://chamade.io/dashboard/voice) once — Chamade runs the full speech pipeline on its side using that key. Transcripts flow in as `call_transcript` events, `chamade_call_say` speaks into the meeting. Free on Chamade's side; you only pay your provider. Your agent stays fully text-driven.

Already have a voice pipeline you want to keep (OpenAI Realtime, LiveKit Agents, Pipecat, Deepgram Voice Agent, a manual cascade)? Chamade also exposes the call's raw-PCM audio as a bidirectional WebSocket — BYO audio, Chamade transports, you run the speech layer. Either mode, same MCP tools for control.

File attachments work out of the box on DMs and meeting chat for Discord, Telegram, Slack, WhatsApp (incl. voice notes), and Nextcloud Talk. Use `chamade_file_upload_url` to mint a pre-signed no-auth upload URL, then pass the returned `file_id` in `attachments` on `chamade_dm_chat` or `chamade_call_chat`. Inbound files arrive on `chamade_inbox` as Chamade-signed URLs — your agent can `curl` them with no extra auth. Teams + Meet support is code-ready but gated until the respective platform certifications complete.

Chamade is currently in early access: free, no subscription, no quota.

## v4: hosted MCP + thin stdio shim

**The Chamade MCP server is now hosted at `https://mcp.chamade.io/mcp/` and speaks the Streamable HTTP transport.** That's the single source of truth — every tool, every resource, every push event lives there.

- If your MCP client supports **Streamable HTTP** (Claude Desktop recent, Claude Code, Cursor, Windsurf, …), configure it directly against the hosted endpoint. You don't need this npm package.
- If your MCP client is **stdio-only**, install this package. Since v3 it's a ~160-line wrapper that spawns `mcp-remote` under the hood to bridge stdio to the hosted HTTP endpoint. Same tools, same push events, same latency. Zero drift because there is no parallel stdio implementation.

### What changed in v4

v4 is a server-side wire-shape change picked up automatically by the shim. Headline items, full detail in [docs/AGENTS.md](https://chamade.io/docs/agents):

- **Channels are now Agents.** Per-bearer scoping is unchanged; the noun is `agent` everywhere on the wire and in tool descriptions.
- **`account_id` is the canonical join key.** Used identically in `chamade_dm_chat`, `chamade_call_join`, event payloads, and reply XML tag attributes.
- **Event payload v2.** `data` carries `account_id` + `from` + `from_name` (sender_* fields removed) and a pre-stuffed `agent_context.{accounts, active_calls}` snapshot so the agent always knows what it's on without an extra round-trip.
- **Explicit-target XML tags.** Reply XML can now address conversations / calls outside the current reply context (`<dm platform=…>`, `<call_say call_id=…>`, …) for cross-target initiation.
- **Auto-MCP attachment.** Providers with native MCP-as-tool support (OpenAI Responses, Anthropic Managed Agents, Foundry) receive the Chamade MCP server pre-injected with a per-agent bearer.

Earlier versions of this package (v2.x and below) shipped a full native stdio server that implemented the 13 tools locally in TypeScript against Chamade's REST API. v3+ replaces that with a shim — please upgrade to avoid maintaining two surfaces that slowly diverge.

## Quick start

### Option A — HTTP direct (preferred)

If your client speaks Streamable HTTP, skip this package entirely:

```json
{
  "mcpServers": {
    "chamade": {
      "type": "http",
      "url": "https://mcp.chamade.io/mcp/",
      "headers": {
        "Authorization": "Bearer chmd_..."
      }
    }
  }
}
```

### Option B — stdio shim (this package)

For stdio-only clients:

```json
{
  "mcpServers": {
    "chamade": {
      "command": "npx",
      "args": ["-y", "@chamade/mcp-server@3"],
      "env": {
        "CHAMADE_API_KEY": "chmd_..."
      }
    }
  }
}
```

**`CHAMADE_API_KEY` is required.** Get a real one at https://chamade.io/dashboard → API keys and paste the full `chmd_…` value (≥ 40 chars after the prefix). If the env var is missing, empty, or still contains a placeholder like `chmd_...`, the shim refuses to start instead of silently falling back to OAuth — that fallback path loops on refresh-and-revoke and is not a viable auth method for this server.

## Configuration

### Claude Desktop

`~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%/Claude/claude_desktop_config.json` (Windows). Use Option A or B above.

### Claude Code

`.mcp.json` at the root of your project. Use Option A (HTTP direct) for the best experience.

For real-time push events (transcripts, incoming DMs, ringing calls, WhatsApp `dm_delivered` flush), launch Claude Code with the channel flag every time:

```bash
claude --dangerously-load-development-channels server:chamade --continue
```

The flag is a per-launch client-side opt-in mandated by Claude Code for MCP channels not yet on the Anthropic allowlist — it's not dangerous, it's just the standard opt-in for experimental channels during the research preview. The server name after `server:` must match the key in your `.mcp.json`. Without the flag, tools still work but push events are silently ignored — you have to poll `chamade_inbox` and `chamade_call_status` to see new activity.

### Cursor / Windsurf / OpenClaw

Same format. Path varies by client: `.cursor/mcp.json`, `~/.codeium/windsurf/mcp_config.json`, `~/.openclaw/config.json`. Use Option A if the client supports HTTP, otherwise Option B.

## Tools

| Tool | Description |
|------|-------------|
| `chamade_call_join` | Join a voice meeting (platform + meeting_url). |
| `chamade_call_say` | Speak text aloud via TTS in the meeting. |
| `chamade_call_chat` | Send a text chat message in the meeting. Optional `attachments: [{file_id} \| {url} \| {bytes_b64, name, mime}]` to send files along with the text; `text` becomes the caption when both are set. 25 MB cap per attachment. |
| `chamade_call_status` | Get call state and new transcript lines (delta pattern). |
| `chamade_call_accept` | Answer a ringing inbound call (SIP, etc.). |
| `chamade_call_refuse` | Refuse/reject a ringing inbound call. |
| `chamade_call_typing` | Send a typing indicator in meeting chat. |
| `chamade_call_leave` | Hang up and leave the meeting. |
| `chamade_call_list` | List all active calls. |
| `chamade_inbox` | Check DM conversations (Discord, Telegram, Teams, WhatsApp, Slack, NC Talk). Shows WhatsApp 24h window state inline. Inbound file attachments arrive as `attachments[]` on each message, with Chamade-signed URLs. |
| `chamade_dm_chat` | Send a DM message by platform. Optional `attachments: [{file_id} \| {url} \| {bytes_b64, name, mime}]` to send files; `text` becomes the caption. On WhatsApp outside the 24h window, returns 202 queued and auto-fires a re-engagement template. |
| `chamade_dm_typing` | Send a typing indicator in DM by platform. |
| `chamade_file_upload_url` | Mint a short-lived (5 min) pre-signed upload URL. Your shell / agent `curl -F file=@path <url>` with **no auth header** (URL itself is the auth), then pass the returned `file_id` in `attachments: [{file_id}]` on a subsequent send. Recommended path for any non-trivial local file — a shell-streamed upload keeps the tool call tiny instead of forcing every base64 character through the model's output budget. |
| `chamade_account` | Check account status, plan, credit/quota, and per-platform readiness (incl. a `files` bool per platform). |

## Resources

| URI template | Description |
|--------------|-------------|
| `chamade://calls/{call_id}/transcript` | Live transcript. Each read returns only new lines since the last read (delta pattern). Channel-mode clients also receive push notifications for every new line. |

## Channel mode (push events)

Channel mode pushes DM messages, incoming SIP calls, transcript lines, call state changes, and WhatsApp `dm_delivered` flush events directly into the agent's context — no polling.

**Server side — nothing to configure.** The hosted Chamade MCP server always declares the `experimental.claude/channel` capability during the initialize handshake. The v2.x `--channel` arg / `CHAMADE_CHANNEL=1` env var are gone.

**Client side — Claude Code needs a per-launch flag.** Claude Code only processes `notifications/claude/channel` from MCP servers you've explicitly opted in:

```bash
claude --dangerously-load-development-channels server:chamade --continue
```

Required every launch. Without it, Chamade tools still work but push events are silently dropped client-side — the agent has to poll `chamade_inbox` and `chamade_call_status` to see new activity.

Other MCP clients (Claude Desktop, Cursor, Windsurf) currently do not have a channel receiver and will silently ignore push notifications. They still work in polling mode via `chamade_inbox` with `last_message_cursor` + optional `wait` for long-polling.

## Environment variables (shim only)

Only the stdio shim uses these. Direct HTTP config has everything in JSON.

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CHAMADE_API_KEY` | **Yes** | — | API key (`chmd_*`, ≥ 40 chars of entropy) from chamade.io/dashboard. The shim validates the shape at startup and exits 1 on placeholders or missing values; **there is no OAuth fallback.** |
| `CHAMADE_URL` | No | `https://chamade.io` | Chamade instance URL. The shim derives the MCP endpoint automatically: `https://chamade.io` → `https://mcp.chamade.io/mcp/`, `https://dev.chamade.io` → `https://mcp.dev.chamade.io/mcp/`. |
| `CHAMADE_MCP_URL` | No | — | Explicit MCP endpoint override. Skip unless you're running a custom proxy. |

The v2.x `--channel` CLI flag is silently accepted for backwards-compat, but it's a no-op — channel mode is always on in v3.

## Supported platforms

- **Discord** — voice channels (shared bot or bring your own), text, **files** (send + receive, 25 MB)
- **Microsoft Teams** — voice meetings + text DM, requires OAuth connection on dashboard. Files code-ready, gated behind AppSource cert.
- **Google Meet** — voice (audio_in) + chat text, requires OAuth connection on dashboard *(see note below)*. Files code-ready, gated behind Google OAuth verification.
- **Telegram** — DM text + **files** (send + receive). No voice.
- **Zoom** — voice + meeting chat, pass meeting URL (pending Zoom Marketplace approval — tester access on request). No files.
- **SIP / Phone** — voice only, pass phone number or SIP URI. No files.
- **Nextcloud Talk** — voice + text + **files** (send on any addon version, receive needs addon ≥ 2.4.0)
- **WhatsApp** — DM text + **files** (send + receive, incl. voice notes as raw audio). No voice calls.

> ⚠️ **Google Meet voice — beta limitation.** Real-time audio capture on Meet relies on Google's Meet Media API, currently in [Developer Preview](https://developers.google.com/workspace/meet/media-api/guides/get-started). Every meeting participant must be individually enrolled — if anyone isn't, audio capture fails. Calendar integration and in-meeting chat work normally for everyone. For production voice use cases, prefer **Teams**, **Discord**, **Nextcloud Talk**, or **SIP**.

## How it works

```
Agent (Claude Desktop, Cursor, …)
  │ MCP (Streamable HTTP, Authorization: Bearer chmd_*)
  ▼
mcp.chamade.io                       (hosted by Chamade)
  │
  ▼
Chamade API                           (chamade.io)
  │
  ▼
Maquisard bridge                      (transports audio; forwards to your
                                       STT/TTS provider when BYOK preset set)
  │
  ▼
Discord / Teams / Meet / …
```

With **Option B** (stdio shim), the client doesn't speak HTTP; the shim sits in between as a transport adapter:

```
Agent (stdio-only client)
  │ stdio JSON-RPC
  ▼
@chamade/mcp-server@3                 (this package, ~160 LOC)
  │ spawns
  ▼
mcp-remote                            (local subprocess)
  │ Streamable HTTP, Bearer chmd_*
  ▼
mcp.chamade.io                        (hosted)
```

## Development

```bash
npm install
npm run dev     # runs with tsx (hot reload, src/index.ts)
npm run build   # compiles to dist/
npm test        # unit tests for deriveMcpUrl + buildRemoteArgs
```

The shim itself is tiny (see `src/index.ts`). Full MCP tool behavior is tested in the parent Chamade repo under `tests/e2e/test_mcp_http.py`, which drives the hosted server directly — that's the source of truth for tool semantics.

## Documentation

- [MCP server docs](https://chamade.io/docs/mcp) — setup for every major client
- [Push mode docs](https://chamade.io/docs/push) — how real-time push events work (stateful sessions)
- [Agents](https://chamade.io/docs/agents) — bearer × platform scoping (one agent per key / OAuth client)
- [Full API reference](https://chamade.io/llms-full.txt) — every tool, every endpoint, LLM-formatted
- [Setup guide](https://chamade.io/llms-setup.txt) — step-by-step onboarding for agents

## Issues & feedback

- Bug or feature request: [open an issue](https://github.com/chamade-io/mcp-server/issues)
- Direct contact: contact@nafis.io
- In-app: every Chamade dashboard has a "Send feedback" button

## License

MIT — see [LICENSE](LICENSE).
