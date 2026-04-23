# CLAUDE.md

## Overview

StripFeed MCP Server. Exposes StripFeed API as MCP tools for AI assistants (Claude Code, Cursor, Windsurf, Claude Desktop).

## Stack

- TypeScript, Node.js
- `@modelcontextprotocol/sdk` (MCP SDK v1)
- `zod` for input validation

## Commands

```bash
npm run build    # Compile TypeScript to dist/
npm run dev      # Watch mode
npm start        # Run server (stdio transport)
```

## Architecture

Single file (`src/index.ts`). Three tools:
- `fetch_url` - GET /api/v1/fetch (single URL to Markdown)
- `batch_fetch` - POST /api/v1/batch (up to 10 URLs in parallel)
- `check_usage` - GET /api/v1/usage (check monthly usage and plan limits)

Requires `STRIPFEED_API_KEY` env var. Communicates via stdio (JSON-RPC).

## CI/CD

GitHub Actions workflow (`.github/workflows/release.yml`):
- Triggers on push to main
- Builds, checks if version tag exists
- If new version: publishes to npm, creates git tag + GitHub Release
- Requires `NPM_TOKEN` secret

To release a new version: bump version in `package.json`, push to main.

## Git Rules

- All commits must use Claude as author:
  ```bash
  GIT_COMMITTER_NAME="Claude" GIT_COMMITTER_EMAIL="noreply@anthropic.com" git commit --author="Claude <noreply@anthropic.com>" -m "message"
  ```
- Never push without approval
- npm package: `@stripfeed/mcp-server`
