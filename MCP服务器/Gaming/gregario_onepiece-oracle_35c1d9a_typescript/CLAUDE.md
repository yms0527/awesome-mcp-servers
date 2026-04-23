# onepiece-oracle

One Piece TCG MCP server. 6 tools, 27 tests, 4348 cards.

## Stack
- TypeScript + MCP SDK
- Runtime data from `one-piece-card-game-json` npm package (no bundled SQLite)
- Follows MCP stack profile (`stacks/mcp/`)

## Commands
- `npm test` — run tests (vitest)
- `npm run build` — compile TypeScript
- `npm run dev` — run server via tsx

## Data
- Source: one-piece-card-game-json npm package (fan-curated)
- 4,348 cards (EN) across all sets
- Loaded at runtime via dynamic import — no build-time data step

## Disclaimer
Fan-made, non-commercial. Not affiliated with Bandai or Shueisha.
