# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-03-14

### Added

- Initial release of Pterodactyl MCP Server
- 42 MCP tools across 4 categories:
  - **Server Management** (21 Application API tools): list/get/create/delete servers, manage users, nodes, eggs, roles, mounts, databases
  - **Power Control** (Client API): start, stop, restart, kill servers
  - **File Management** (Client API): list, read, write, delete, rename, compress, decompress files
  - **Console & Monitoring** (Client API): send commands, get resources, backups, schedules, subusers, databases
- Pterodactyl HTTP client with:
  - Token bucket rate limiter (burst 15, 1 token/s refill)
  - Circuit breaker (5 failures threshold, 30s cooldown)
  - Retry with exponential backoff and jitter
  - Retry-After header support for 429 responses
  - Network error retry (ECONNREFUSED, ENOTFOUND, ETIMEDOUT)
  - Non-idempotent POST protection
  - HTTPS validation with SSRF prevention
- Cloudflare Worker deployment with:
  - Web UI for configuration (dark mode, responsive)
  - AES-256-GCM encryption for API keys in KV storage
  - Remote MCP endpoint support for claude.ai
- Security features:
  - Command sanitization with 18 dangerous pattern detection
  - Sensitive field filtering in API responses
  - Environment variable masking
  - HTML escaping for XSS prevention
  - Tool annotations (readOnlyHint, destructiveHint, openWorldHint, idempotentHint)
- Full TypeScript support with strict mode
- Zod validation on all tool inputs
- LLM-optimized tool descriptions with disambiguation
- Actionable error messages (401, 403, 404, 429, 5xx)
- Health check at startup
- 27 unit tests with Vitest
- Biome linting and formatting
- Configuration support for Claude Desktop, Claude Code, and Cursor
