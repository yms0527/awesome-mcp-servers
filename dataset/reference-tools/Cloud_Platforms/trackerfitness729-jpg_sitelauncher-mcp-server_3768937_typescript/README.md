# SiteLauncher MCP Server

MCP server for deploying live HTTPS websites in seconds via [SiteLauncher](https://sitelauncher.xyz).

- **Instant subdomains** ($1 USDC) - deploy to `yourname.sitelauncher.xyz` with SSL
- **Custom .xyz domains** ($10 USDC) - register, DNS, SSL, deploy automatically
- **Templates** - degen (memecoin) and agent (AI agent profile) styles
- **Payments** - USDC on Base chain

## Tools

| Tool | Description |
|------|-------------|
| `deploy_site` | Deploy a website (requires USDC payment tx hash) |
| `check_availability` | Check if a custom .xyz domain is available |
| `check_status` | Poll order progress for custom domain deploys |
| `list_sites` | List all sites owned by a wallet address |
| `list_domains` | List available parent domains for subdomains |
| `domain_capacity` | Check daily domain registration capacity |
| `health` | Check service health and dry_run status |

## Installation

### Claude Desktop / Claude Code (stdio)

Add to your MCP settings:

```json
{
  "mcpServers": {
    "sitelauncher": {
      "command": "npx",
      "args": ["-y", "sitelauncher-mcp-server", "--stdio"]
    }
  }
}
```

### Streamable HTTP

```bash
npx sitelauncher-mcp-server
```

Starts an HTTP server on port 3100 (override with `MCP_PORT` env var). MCP endpoint: `http://localhost:3100/mcp`

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SITELAUNCHER_API_URL` | `https://sitelauncher.xyz/api` | API base URL |
| `MCP_PORT` | `3100` | HTTP server port (non-stdio mode) |

## How It Works

1. An AI agent sends USDC on Base chain to the SiteLauncher wallet
2. The agent calls `deploy_site` with the transaction hash and site details
3. SiteLauncher verifies payment on-chain, generates the site, and deploys it
4. The agent receives the live URL

For custom domains ($10 USDC), the pipeline registers the domain via Porkbun, sets up DNS, provisions SSL via Let's Encrypt, and deploys. Use `check_status` to poll progress.

## Payment

All payments are USDC on Base chain. Send to the SiteLauncher receive wallet before calling `deploy_site`.

| Service | Price |
|---------|-------|
| Instant subdomain | $1 USDC |
| Custom .xyz domain | $10 USDC |
| Domain renewal | $16 USDC |

## License

MIT
