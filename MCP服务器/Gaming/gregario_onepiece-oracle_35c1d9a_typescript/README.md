# onepiece-oracle

One Piece TCG MCP server — card search, deck analysis, and set browsing for the One Piece Card Game.

<p align="center">
  <a href="https://www.npmjs.com/package/onepiece-oracle"><img src="https://img.shields.io/npm/v/onepiece-oracle.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/onepiece-oracle"><img src="https://img.shields.io/npm/dm/onepiece-oracle.svg" alt="npm downloads"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg" alt="Node.js 18+"></a>
  <a href="https://modelcontextprotocol.io"><img src="https://img.shields.io/badge/MCP-compatible-purple.svg" alt="MCP Compatible"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
  <a href="https://github.com/sponsors/gregario"><img src="https://img.shields.io/badge/sponsor-♥-ea4aaa.svg" alt="Sponsor"></a>
  <a href="https://glama.ai/mcp/servers/gregario/onepiece-oracle"><img src="https://glama.ai/mcp/servers/gregario/onepiece-oracle/badges/score.svg" alt="onepiece-oracle MCP server"></a>
</p>

<!-- mcp-name: io.github.gregario/onepiece-oracle -->

## What It Does

Search, browse, and analyze One Piece TCG cards with ground-truth data from the community-maintained card database. 4,348 cards across all sets (OP-01 through OP-14, Starter Decks, Event Boosters, and Promos).

## Tools

| Tool | Description |
|------|-------------|
| `search_cards` | Full-text search with filters for color, type, cost, power, rarity, attribute, character type, and set. |
| `browse_sets` | List all sets with card counts, or view cards in a specific set. |
| `card_versions` | Show all printings of a card including alternate art variants. |
| `browse_leaders` | Browse all Leader cards, optionally filtered by color. |
| `analyze_cost_curve` | Parse a deck list and show cost distribution, color breakdown, type spread, and counter summary. |
| `find_counters` | Find cards with counter values for defensive deck building. |

## Install

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "onepiece-oracle": {
      "command": "npx",
      "args": ["-y", "onepiece-oracle"]
    }
  }
}
```

### Claude Code

```bash
claude mcp add onepiece-oracle -- npx -y onepiece-oracle
```

## Disclaimer

This is a fan-made, non-commercial project for informational and educational purposes only. One Piece Card Game is a trademark of Bandai Co., Ltd. and Shueisha Inc. One Piece is created by Eiichiro Oda. This project is not produced, endorsed, supported, or affiliated with Bandai or Shueisha. Card data is sourced from community-maintained databases.

## License

MIT
