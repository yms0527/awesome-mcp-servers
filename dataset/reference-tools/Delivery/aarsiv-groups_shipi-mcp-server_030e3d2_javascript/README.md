# Shipi MCP Server

AI-powered multi-carrier shipping management for [Claude Desktop](https://claude.ai/download), [Claude Code](https://docs.anthropic.com/en/docs/claude-code), and any MCP-compatible AI client.

Ship packages, compare rates, manage addresses, and track shipments — all through natural conversation with AI.

## What You Can Do

Talk to your AI assistant naturally:

- *"List my recent shipments"*
- *"Get FedEx and UPS rates for a 5lb package from NYC to LA"*
- *"Create a shipment using my primary FedEx account"*
- *"Track package 794987330490"*
- *"Add a new shipper address for our LA warehouse"*
- *"Show me shipping stats for this month"*
- *"What's my account balance?"*

## 18 Tools Available

| Category | Tools |
|----------|-------|
| **Shipments** | `list_shipments`, `get_shipment`, `search_shipments`, `create_shipment`, `cancel_shipment` |
| **Rates** | `get_shipping_rates` — compare live rates across all carriers |
| **Pickup** | `schedule_pickup` — schedule carrier pickup at your location |
| **Tracking** | `track_shipment` — get tracking URL with auto carrier detection |
| **Labels** | `fetch_labels` — retrieve labels for printing |
| **Address Book** | `list_addresses`, `get_address`, `add_address`, `edit_address`, `delete_address` |
| **Carriers** | `list_carriers`, `get_carrier` — view configured carrier accounts |
| **Account** | `get_account_info`, `get_shipping_stats` — billing, plan, analytics |

## Supported Carriers

FedEx, UPS, USPS, DHL, DHL Express, Canada Post, Purolator, Canpar, Aramex, BlueDart, Delhivery, DTDC, Ecom Express, Australia Post, and more.

## Quick Setup

### 1. Get Your Integration Key

Log in to [Shipi Dashboard](https://app.myshipi.com) → **Settings** → **General** → copy your **Integration Key**.

### 2. Install

**Option A: Install from npm (recommended)**

```bash
npm install -g shipi-mcp-server
```

**Option B: Clone and install locally**

```bash
git clone https://github.com/aarsiv-groups/shipi-mcp-server.git
cd shipi-mcp-server
npm install
```

### 3. Configure Claude Desktop

Open Claude Desktop → Settings → Developer → Edit Config, and add:

```json
{
  "mcpServers": {
    "shipi": {
      "command": "npx",
      "args": ["shipi-mcp-server"],
      "env": {
        "SHIPI_INTEGRATION_KEY": "your_integration_key_here"
      }
    }
  }
}
```

**If installed locally**, use the full path instead:

```json
{
  "mcpServers": {
    "shipi": {
      "command": "node",
      "args": ["C:/path/to/shipi-mcp-server/index.js"],
      "env": {
        "SHIPI_INTEGRATION_KEY": "your_integration_key_here"
      }
    }
  }
}
```

### 4. Restart Claude Desktop

Close and reopen Claude Desktop. You should see the Shipi tools available (hammer icon).

## Configuration

| Environment Variable | Required | Description |
|---------------------|----------|-------------|
| `SHIPI_INTEGRATION_KEY` | Yes | Your Shipi integration key |
| `SHIPI_BASE_URL` | No | API base URL (default: `https://app.myshipi.com`) |

## Example Conversations

### Compare shipping rates
> **You:** I need to ship a 3lb package from New York (10001) to Los Angeles (90001). What are my options?
>
> **Claude:** Let me check rates across your carriers... *[calls get_shipping_rates]*
>
> FedEx Ground: $12.50 (5-7 days), UPS Ground: $11.80 (5-7 days), FedEx Express: $28.90 (2 days)...

### Create a shipment
> **You:** Ship it with FedEx Ground
>
> **Claude:** I'll need the recipient details. What's the recipient name and full address?
>
> **You:** Jane Doe, 456 Oak Ave, Los Angeles CA 90001
>
> **Claude:** *[calls create_shipment]* Shipment created! Tracking: 794987330490, Label: [download link]

### Track packages
> **You:** Where is order ORD-1234?
>
> **Claude:** *[calls search_shipments]* Found it — shipped via FedEx, tracking 794987330490. *[calls track_shipment]* Track here: https://track.myshipi.com/?no=794987330490

## Requirements

- [Node.js](https://nodejs.org/) 18 or higher
- A [Shipi](https://myshipi.com) account with at least one carrier configured
- [Claude Desktop](https://claude.ai/download) or any MCP-compatible AI client

## Security

- Your integration key is stored locally on your machine (never sent to third parties)
- The MCP server only communicates with Shipi's API (`app.shipi.xyz`)
- Carrier API credentials are **never** exposed through the MCP tools
- All API calls use HTTPS

## Links

- [Shipi Website](https://myshipi.com)
- [Shipi Dashboard](https://app.myshipi.com)
- [API Documentation](https://resources.myshipi.com/category/general/api-reference/)
- [Support](mailto:support@myshipi.com)

## License

MIT
