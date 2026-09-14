# junipr-mcp

MCP server for [Junipr](https://junipr.io) APIs. Gives AI assistants access to 75+ web intelligence tools — screenshots, PDFs, metadata extraction, scrapers, validators, and more.

## Tools

| Tool | Description |
|------|-------------|
| `screenshot` | Capture a screenshot of any webpage (PNG, JPEG, or WebP) |
| `pdf` | Generate a PDF from a URL or raw HTML |
| `metadata` | Extract title, description, Open Graph, Twitter Cards, JSON-LD, and more |
| `run_tool` | Run any of 75+ Junipr tools by slug (scrapers, validators, converters, analyzers) |

## Setup

### 1. Get an API key

Sign up at [junipr.io/login](https://junipr.io/login) to get a free API key (500 credits/month).

### 2. Configure your MCP client

#### Claude Desktop

Add to your Claude Desktop config file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "junipr": {
      "command": "npx",
      "args": ["-y", "junipr-mcp"],
      "env": {
        "JUNIPR_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

#### Claude Code (CLI)

```bash
claude mcp add junipr -- npx -y junipr-mcp
```

Then set the environment variable:

```bash
export JUNIPR_API_KEY=your-api-key-here
```

#### Cursor

Add to your Cursor MCP settings (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "junipr": {
      "command": "npx",
      "args": ["-y", "junipr-mcp"],
      "env": {
        "JUNIPR_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

#### VS Code

Add to your VS Code settings (`.vscode/mcp.json`):

```json
{
  "servers": {
    "junipr": {
      "command": "npx",
      "args": ["-y", "junipr-mcp"],
      "env": {
        "JUNIPR_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

#### Windsurf

Add to your Windsurf MCP config (`~/.codeium/windsurf/mcp_config.json`):

```json
{
  "mcpServers": {
    "junipr": {
      "command": "npx",
      "args": ["-y", "junipr-mcp"],
      "env": {
        "JUNIPR_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## Tool Reference

### screenshot

Capture a screenshot of any webpage.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `url` | string | (required) | URL to capture |
| `format` | `png` \| `jpeg` \| `webp` | `png` | Image format |
| `width` | number | `1280` | Viewport width (320-3840) |
| `height` | number | `720` | Viewport height (200-2160) |
| `fullPage` | boolean | `false` | Capture full scrollable page |
| `deviceType` | `desktop` \| `mobile` \| `tablet` | `desktop` | Device to emulate |
| `blockCookieBanners` | boolean | `true` | Hide cookie banners |

### pdf

Generate a PDF from a URL or HTML.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `url` | string | — | URL to convert (provide `url` or `html`) |
| `html` | string | — | Raw HTML to convert (provide `url` or `html`) |
| `format` | `A4` \| `Letter` \| `Legal` \| `Tabloid` \| `A3` \| `A5` | `A4` | Paper format |
| `landscape` | boolean | `false` | Landscape orientation |
| `printBackground` | boolean | `true` | Include backgrounds |
| `margin` | object | `1cm` each | `{ top, right, bottom, left }` in CSS units |
| `headerTemplate` | string | — | Header HTML template |
| `footerTemplate` | string | — | Footer HTML template |
| `displayHeaderFooter` | boolean | `false` | Show header/footer |

### metadata

Extract metadata from any webpage.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `url` | string | (required) | URL to extract metadata from |

Returns title, description, Open Graph tags, Twitter Cards, JSON-LD structured data, favicon, canonical URL, language, and more.

## License

MIT
