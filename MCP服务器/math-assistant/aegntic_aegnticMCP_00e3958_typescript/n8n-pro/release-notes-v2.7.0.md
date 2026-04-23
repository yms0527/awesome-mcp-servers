# n8n-MCP v2.7.0 Release Notes

## 🎉 What's New

### 🔧 File Refactoring & Version Management
- **Renamed core MCP files** to remove unnecessary suffixes for cleaner codebase:
  - `tools-update.ts` → `tools.ts`
  - `server-update.ts` → `server.ts`
  - `http-server-fixed.ts` → `http-server.ts`
- **Fixed version management** - Now reads from package.json as single source of truth (fixes #5)
- **Updated imports** across 21+ files to use the new file names

### 🔍 New Diagnostic Tool
- **Added `n8n_diagnostic` tool** - Helps troubleshoot why n8n management tools might not be appearing
- Shows environment variable status, API connectivity, and tool availability
- Provides step-by-step troubleshooting guidance
- Includes verbose mode for additional debug information

### 🧹 Code Cleanup
- Removed legacy HTTP server implementation with known issues
- Removed unused legacy API client
- Added version utility for consistent version handling
- Added script to sync runtime package version

## 📦 Installation

### Docker (Recommended)
```bash
docker pull ghcr.io/czlonkowski/n8n-mcp:2.7.0
```

### Claude Desktop
Update your configuration to use the latest version:
```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "ghcr.io/czlonkowski/n8n-mcp:2.7.0"]
    }
  }
}
```

## 🐛 Bug Fixes
- Fixed version mismatch where version was hardcoded as 2.4.1 instead of reading from package.json
- Improved error messages for better debugging

## 📚 Documentation Updates
- Condensed version history in CLAUDE.md
- Updated documentation structure in README.md
- Removed outdated documentation files
- Added n8n_diagnostic tool to documentation

## 🙏 Acknowledgments
Thanks to all contributors and users who reported issues!

---

**Full Changelog**: https://github.com/czlonkowski/n8n-mcp/blob/main/CHANGELOG.md