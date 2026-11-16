# Mintline MCP Server

Connect AI assistants to your Mintline receipts and transactions via the [Model Context Protocol](https://modelcontextprotocol.io).

[![MCP Registry](https://img.shields.io/badge/MCP-Registry-blue)](https://registry.modelcontextprotocol.io/servers/io.github.mintlineai/mintline-mcp)
[![mcp.so](https://img.shields.io/badge/mcp.so-Listed-green)](https://mcp.so/server/mintline-mcp)
[![npm](https://img.shields.io/npm/v/@mintline/mcp)](https://www.npmjs.com/package/@mintline/mcp)

## Installation

```bash
npm install -g @mintline/mcp
```

## Setup

### 1. Get your API key

Create an API key at [mintline.ai/app/settings/api-keys](https://mintline.ai/app/settings/api-keys)

### 2. Configure Claude Desktop

Add to your `~/.claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mintline": {
      "command": "mintline-mcp",
      "env": {
        "MINTLINE_API_KEY": "ml_live_your_api_key_here"
      }
    }
  }
}
```

### 3. Restart Claude Desktop

The Mintline tools will now be available.

## Available Tools

Tools are loaded dynamically from the Mintline API and stay automatically in sync.

**View all available tools:**
- Documentation: [mintline.ai/docs/mcp](https://mintline.ai/docs/mcp)
- CLI: `npx @mintline/mcp --list-tools`

## Example Prompts

### Receipts & Transactions
- "Show me my unmatched receipts"
- "Find receipts from Amazon"
- "List transactions from my Chase statement"
- "Show details for receipt rcpt_01abc123"

### Matching
- "What matches need my review?"
- "Confirm the top match"
- "Reject match mtch_01xyz789 - wrong vendor"

### Analytics
- "How much did I spend this month?"
- "What are my top vendors by spending?"
- "Show me spending trends for the last 6 months"
- "Break down my spending by week"
- "How much did I spend at AWS last quarter?"
- "What needs my attention?" (shows unmatched items)
- "Do I have any large transactions without receipts?"

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MINTLINE_API_KEY` | Yes | Your Mintline API key |
| `MINTLINE_API_URL` | No | API URL (default: https://api.mintline.ai) |

## Development

```bash
git clone https://github.com/mintlineai/mintline-mcp.git
cd mintline-mcp
npm install

# Run locally
MINTLINE_API_KEY=ml_live_... node src/index.js
```

## License

MIT
