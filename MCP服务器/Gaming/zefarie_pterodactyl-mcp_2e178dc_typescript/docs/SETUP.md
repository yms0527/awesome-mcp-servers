# Setup Guide

Everything you need to get `pterodactyl-mcp` running with your MCP client.

## Prerequisites

- **Node.js 22 or later** - [Download](https://nodejs.org/)
- **Pterodactyl Panel** with an Application API key (required) and optionally a Client API key
- An MCP-compatible client (Claude Desktop, Claude Code, Cursor, or any other)

Verify your Node.js version:

```bash
node --version
# v22.x.x or higher
```

## Installation

### Option 1: Run with npx (no install)

The simplest way. Your MCP client runs this command automatically:

```bash
npx @zefarie/pterodactyl-mcp
```

### Option 2: Install globally with pnpm

```bash
pnpm add -g @zefarie/pterodactyl-mcp
```

### Option 3: Install globally with npm

```bash
npm install -g @zefarie/pterodactyl-mcp
```

After a global install, you can run:

```bash
pterodactyl-mcp
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PTERODACTYL_URL` | Yes | Full URL of your Pterodactyl Panel (e.g., `https://panel.example.com`) |
| `PTERODACTYL_APP_KEY` | Yes | Application API key starting with `ptla_` (admin endpoints) |
| `PTERODACTYL_CLIENT_KEY` | No | Client API key starting with `ptlc_` (power, files, console, backups) |
| `PTERODACTYL_ALLOW_INSECURE` | No | Set to `true` to allow HTTP connections (development only) |

### Getting Your API Keys

**Application API Key (required):**

1. Log in to your Pterodactyl Panel as an admin
2. Go to **Admin** area (gear icon)
3. Go to **Application API**
4. Click **Create New** to generate a key
5. Copy the key (starts with `ptla_`)

> The Application API key grants full admin access to all servers, users, and nodes.

**Client API Key (optional but recommended):**

1. Log in to your Pterodactyl Panel
2. Click your username in the top-right corner
3. Go to **Account** then **API Credentials**
4. Click **Create** to generate a new key
5. Copy the key (starts with `ptlc_`)

> The Client API key grants access to power control, file management, console commands, backups, and schedules for servers your account can manage. Without it, only admin/read tools are available.

## Client Configuration

### Claude Desktop

Edit your Claude Desktop configuration file:

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

Add the following:

```json
{
  "mcpServers": {
    "pterodactyl": {
      "command": "npx",
      "args": ["-y", "@zefarie/pterodactyl-mcp"],
      "env": {
        "PTERODACTYL_URL": "https://panel.example.com",
        "PTERODACTYL_APP_KEY": "ptla_xxxxxxxxxxxxx",
        "PTERODACTYL_CLIENT_KEY": "ptlc_xxxxxxxxxxxxx"
      }
    }
  }
}
```

Restart Claude Desktop after saving.

### Claude Code

Add the server to your Claude Code MCP configuration:

```json
{
  "mcpServers": {
    "pterodactyl": {
      "command": "npx",
      "args": ["-y", "@zefarie/pterodactyl-mcp"],
      "env": {
        "PTERODACTYL_URL": "https://panel.example.com",
        "PTERODACTYL_APP_KEY": "ptla_xxxxxxxxxxxxx",
        "PTERODACTYL_CLIENT_KEY": "ptlc_xxxxxxxxxxxxx"
      }
    }
  }
}
```

### Cursor

Create or edit `.cursor/mcp.json` in your project root:

```json
{
  "mcpServers": {
    "pterodactyl": {
      "command": "npx",
      "args": ["-y", "@zefarie/pterodactyl-mcp"],
      "env": {
        "PTERODACTYL_URL": "https://panel.example.com",
        "PTERODACTYL_APP_KEY": "ptla_xxxxxxxxxxxxx",
        "PTERODACTYL_CLIENT_KEY": "ptlc_xxxxxxxxxxxxx"
      }
    }
  }
}
```

### Other MCP Clients

Any client that supports the MCP stdio transport can use this server. The command is:

```bash
PTERODACTYL_URL=https://panel.example.com \
PTERODACTYL_APP_KEY=ptla_xxxxxxxxxxxxx \
PTERODACTYL_CLIENT_KEY=ptlc_xxxxxxxxxxxxx \
npx @zefarie/pterodactyl-mcp
```

## Verifying the Connection

After configuration, try asking your AI assistant:

> "List all my game servers"

If the connection is working, you will see a list of your Pterodactyl servers. If not, check the troubleshooting section below.

## Troubleshooting

### "Authentication failed" (UNAUTHORIZED)

- Verify your `PTERODACTYL_APP_KEY` starts with `ptla_` and is correct
- If using client tools, verify `PTERODACTYL_CLIENT_KEY` starts with `ptlc_`
- Make sure the key has not been revoked in your Pterodactyl Panel
- Check that there are no extra spaces or newlines in the key

### "Pterodactyl API is unreachable" (API_UNREACHABLE)

- Verify `PTERODACTYL_URL` is correct and reachable from your machine
- Check that the URL includes the protocol (`https://`)
- Make sure there is no trailing slash in the URL
- If self-hosted, verify the panel is running and the port is accessible
- Test the connection manually:
  ```bash
  curl -H "Authorization: Bearer ptla_xxxxxxxxxxxxx" \
    https://panel.example.com/api/application/servers?per_page=1
  ```

### "Connection refused" or timeout

- The Pterodactyl Panel may be behind a firewall or VPN
- Check if your network allows outbound HTTPS connections to the panel
- If using a self-signed certificate, the connection will be rejected by default

### "Too many requests" (RATE_LIMITED)

- The server enforces a limit of 60 requests per minute to the Pterodactyl API
- If you hit this limit, wait a minute and try again
- The built-in retry logic handles transient rate limits automatically

### "Server not found" (SERVER_NOT_FOUND)

- Verify the server identifier is correct
- Your API key may not have access to that particular server
- The server may have been deleted from the panel

### npx fails to run the package

- Make sure Node.js 22+ is installed: `node --version`
- Clear the npx cache: `npx --yes clear-npx-cache`
- Try installing globally instead: `pnpm add -g @zefarie/pterodactyl-mcp`

### MCP client does not detect the server

- Restart the MCP client after editing the configuration file
- Check the configuration JSON syntax (trailing commas, missing quotes)
- Verify the `command` path is correct and `npx` is in your system PATH

## Cloudflare Worker Deployment

Instead of running the MCP server locally via stdio, you can deploy it as a Cloudflare Worker. This lets multiple users register their own Pterodactyl credentials through a web UI and get a unique MCP endpoint URL.

### Prerequisites

- A Cloudflare account
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) installed (`pnpm add -g wrangler`)
- A Cloudflare KV namespace for storing encrypted configs

### Setup

1. **Copy the example config:**

   ```bash
   cp wrangler.example.json wrangler.json
   ```

2. **Edit `wrangler.json`** and fill in your KV namespace ID. You can create one with:

   ```bash
   wrangler kv namespace create PTERODACTYL_CONFIGS
   ```

   Then paste the returned `id` into `wrangler.json`. If you need to set your Cloudflare account, either add `"account_id": "<your-account-id>"` to `wrangler.json` or set the `CLOUDFLARE_ACCOUNT_ID` environment variable.

3. **Set the `ENCRYPTION_KEY` secret.** This key is used to encrypt and decrypt user API credentials stored in KV. Generate a strong key and store it as a Wrangler secret:

   ```bash
   openssl rand -hex 32
   wrangler secret put ENCRYPTION_KEY
   ```

   Paste the generated hex string when prompted. Never commit this key to the repository.

4. **Deploy the worker:**

   ```bash
   pnpm worker:deploy
   ```

### Environment Variables (Worker)

| Variable | Required | Description |
|----------|----------|-------------|
| `ENCRYPTION_KEY` | Yes | 256-bit hex key for encrypting user configs in KV. Generate with `openssl rand -hex 32`. Set via `wrangler secret put`. |

### How It Works

- Users visit the worker URL and submit their Pterodactyl Panel URL and API keys through the web form
- Credentials are encrypted with `ENCRYPTION_KEY` and stored in KV
- Each user receives a unique MCP endpoint URL (`/mcp/<token>`) they can add to their MCP client
- Users can delete their stored credentials at any time through the web UI
