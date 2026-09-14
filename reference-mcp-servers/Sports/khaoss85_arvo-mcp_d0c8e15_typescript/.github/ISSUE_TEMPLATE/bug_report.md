---
name: Bug Report
about: Report a bug with arvo-mcp
title: "[BUG] "
labels: bug
assignees: ''
---

## Description
A clear description of the bug.

## Environment
- **Node.js version:** (e.g., 18.17.0)
- **arvo-mcp version:** (e.g., 1.0.0)
- **MCP client:** (e.g., Claude Desktop, Cursor, Windsurf)
- **Operating system:** (e.g., macOS 14.0, Windows 11)

## Steps to Reproduce
1.
2.
3.

## Expected Behavior
What should happen?

## Actual Behavior
What actually happens?

## Error Messages
```
Paste any error messages or logs here
```

## Configuration
```json
// Your MCP client config (with API key removed)
{
  "mcpServers": {
    "arvo": {
      "command": "npx",
      "args": ["-y", "arvo-mcp"],
      "env": {
        "ARVO_API_KEY": "arvo_xxxx..."
      }
    }
  }
}
```

## Additional Context
Any other relevant information.
