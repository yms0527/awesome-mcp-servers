# musclesworked-mcp

MCP server for the [musclesworked.com](https://musclesworked.com) exercise-to-muscle mapping API.

Connects Claude Desktop, Claude Code, Cursor, and other MCP clients to 856 exercises and 65 muscles with detailed primary/secondary/stabilizer activation data across 14 muscle groups.

## Setup

Get an API key at [musclesworked.com/dashboard](https://musclesworked.com/dashboard).

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "musclesworked": {
      "command": "npx",
      "args": ["-y", "musclesworked-mcp"],
      "env": {
        "MUSCLESWORKED_API_KEY": "mw_live_..."
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add musclesworked -- npx -y musclesworked-mcp --api-key mw_live_...
```

Or add to `.mcp.json`:

```json
{
  "mcpServers": {
    "musclesworked": {
      "command": "npx",
      "args": ["-y", "musclesworked-mcp", "--api-key", "mw_live_..."]
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "musclesworked": {
      "command": "npx",
      "args": ["-y", "musclesworked-mcp"],
      "env": {
        "MUSCLESWORKED_API_KEY": "mw_live_..."
      }
    }
  }
}
```

## Tools

| Tool | Description |
|------|-------------|
| `get_muscles_worked` | Get primary, secondary, and stabilizer muscles for an exercise |
| `find_exercises` | Find exercises targeting a specific muscle with optional filters |
| `analyze_workout` | Analyze a workout for coverage, gaps, and imbalances |
| `get_alternatives` | Find alternative exercises ranked by muscle overlap |
| `search_exercises` | Search exercises by name to discover IDs |
| `search_muscles` | Search muscles by name to discover IDs |

## Example Prompts

- "What muscles does the barbell bench press work?"
- "Find bodyweight exercises for my chest"
- "Analyze my push day: bench press, overhead press, tricep pushdown, lateral raise"
- "What are some alternatives to barbell squats?"
- "Search for exercises that target the hamstrings"

## Configuration

| Option | Description |
|--------|-------------|
| `--api-key <key>` | API key (or set `MUSCLESWORKED_API_KEY` env var) |
| `MUSCLESWORKED_API_URL` | Override base URL (default: `https://musclesworked.com`) |

## Development

```bash
git clone https://github.com/csjoblom/musclesworked-mcp.git
cd musclesworked-mcp
npm install
npm run build

# Test with MCP Inspector
MUSCLESWORKED_API_KEY=mw_live_... npx @modelcontextprotocol/inspector node dist/index.js
```

## License

MIT
