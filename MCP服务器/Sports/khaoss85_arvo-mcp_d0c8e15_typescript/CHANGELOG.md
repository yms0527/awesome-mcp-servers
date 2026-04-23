# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-19

### Added
- Initial release of arvo-mcp
- **29 fitness tools** for comprehensive workout data access:
  - 19 read-only tools for viewing profiles, workouts, PRs, progress, and more
  - 10 write tools for saving memories, updating preferences, and modifying workouts
- Support for Claude Desktop and Cursor configuration
- Secure API key authentication with SHA-256 hashing
- MCP stdio transport for universal client compatibility
- TypeScript implementation with full type definitions
- Comprehensive documentation with setup guides
- MIT License

### Security
- HTTPS-only communication with arvo.guru
- Scoped API permissions (read/write)
- Local-only credential storage
- Instant key revocation support
