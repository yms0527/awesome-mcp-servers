# telegram-bot-mcp

Full-featured Telegram Bot API server for MCP (Model Context Protocol).
**174 tools** covering the entire Bot API — messages, chats, stickers, payments, forums, stories, and more.

<a href="https://glama.ai/mcp/servers/@FantomaSkaRus1/telegram-bot-mcp">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@FantomaSkaRus1/telegram-bot-mcp/badge" alt="telegram-bot-mcp MCP server" />
</a>

## Features

- **Messages** — send (text, photo, video, audio, document, location, poll, dice, sticker, media groups), edit, forward, copy, delete, pin/unpin, reactions
- **Chats** — info, settings, permissions, invite links, member management, verification
- **Bot** — commands, profile, settings, description, menu button, admin rights
- **Stickers** — create/edit/delete sticker sets, upload stickers, custom emoji
- **Payments** — invoices, star transactions, gifts, refunds
- **Forums** — create/edit/close/reopen/delete topics
- **Stories** — post, edit, delete, repost
- **Business** — business messages, accounts, connections
- **Games** — send games, set scores, high scores
- **Webhooks** — set, delete, get info

## Quick Start

```bash
npm install
```

### Claude Code

```bash
claude mcp add -e TELEGRAM_BOT_TOKEN=your_token telegram -- node /path/to/mcp-telegram/index.js
```

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "telegram": {
      "type": "stdio",
      "command": "node",
      "args": ["/path/to/mcp-telegram/index.js"],
      "env": {
        "TELEGRAM_BOT_TOKEN": "your_token"
      }
    }
  }
}
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Yes | Bot token from [@BotFather](https://t.me/BotFather) |
| `TELEGRAM_DEFAULT_CHAT_ID` | No | Default chat ID (skip `chat_id` in tool calls) |
| `TELEGRAM_DEFAULT_THREAD_ID` | No | Default topic/thread ID for forum supergroups |

## Project Structure

```
index.js              # Entry point — registers all tool modules
utils/api.js          # Telegram API client, rate limiting, retry logic
tools/
  messages/           # send, edit, forward, manage
  chat/               # info, settings, invite, members, verify
  bot/                # core, commands, profile, settings
  stickers.js
  payments.js
  forum.js
  stories.js
  business.js
  games.js
  webhook.js
```

## License

MIT
