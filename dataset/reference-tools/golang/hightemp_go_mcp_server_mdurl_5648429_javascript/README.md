# go_mcp_server_mdurl

A Go MCP (Model Context Protocol) server that converts URL content to Markdown.

Server URL: `http://localhost:8890/sse`

## Requirements

- Go 1.23+

## Tools

1. `markdown_content_of_url` - Extracts the main article content from a URL and converts it to Markdown
2. `markdown_all_html_of_url` - Converts the entire HTML content from a URL to Markdown

## Running

The server can operate in two modes: stdio and sse (Server-Sent Events). By default, it uses sse.

### Stdio

```bash
go_mcp_server_mdurl -t stdio
```

### SSE

```bash
go_mcp_server_mdurl -t sse -h 0.0.0.0 -p 8890
```

SSE endpoint:

```
http://localhost:8890/sse
```

## Build

```bash
make build
```

Binary output: `./go_mcp_server_mdurl`

## npm / npx

This repo includes an npm wrapper so the server can be installed and run via `npx`.

### Build npm package (multi-platform binaries)

```bash
npm run build:npm
```

This creates platform binaries under `native/` and prepares the package for `npm pack`/publish.

### Run with npx

After publishing the package (or using a local tarball), you can run:

```bash
npx go-mdurl-mcp-server -t stdio
```

To run a specific version:

```bash
npx go-mdurl-mcp-server@1.0.0 -t stdio
```

For a local tarball:

```bash
npm pack
npx ./go-mdurl-mcp-server-*.tgz -t stdio
```

## Claude Code

```bash
claude mcp add --transport stdio mdurl -- npx -y go-mdurl-mcp-server -t stdio
```

In project `.mcp.json` or global `~/.claude.json`:

```json
{
  "mcpServers": {
    "mdurl": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "go-mdurl-mcp-server", "-t", "stdio"]
    }
  }
}
```

## Codex CLI

Codex supports MCP servers in `~/.codex/config.toml` or via the `codex mcp add` command.

Add via CLI:

```bash
codex mcp add mdurl -- npx -y go-mdurl-mcp-server -t stdio
```

Or configure in `~/.codex/config.toml`:

```toml
[mcp_servers.mdurl]
command = "npx"
args = ["-y", "go-mdurl-mcp-server", "-t", "stdio"]
```

## Cursor

- macOS/Linux: `~/.cursor/mcp.json`
- Windows: `%USERPROFILE%\\.cursor\\mcp.json`

```json
{
  "mcpServers": {
    "mdurl": {
      "command": "npx",
      "args": ["-y", "go-mdurl-mcp-server", "-t", "stdio"]
    }
  }
}
```

## MCP Client Config Example

```json
{
  "mcpServers": {
    "mdurl": {
      "command": "/path/to/go_mcp_server_mdurl",
      "args": ["-t", "stdio"]
    }
  }
}
```

![](https://asdertasd.site/counter/go_mcp_server_mdurl)