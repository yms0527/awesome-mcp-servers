# Quick Start Guide

⚠️ **READ FIRST**: [DISCLAIMER.md](DISCLAIMER.md) - This is NOT an official LevelBlue product

Get your USM Anywhere MCP server running in **3 minutes**.

---

## Step 1: Install (1 minute)

```bash
# Clone repository
git clone https://github.com/javierb507/anywhere-mcp-server.git
cd anywhere-mcp-server

# Install dependencies and build
npm install && npm run build
```

---

## Step 2: Configure (1 minute)

Create `.env` file with your credentials:

```env
# USM Anywhere API v2.0 (Required)
ALIENVAULT_CLIENT_ID=your_client_id
ALIENVAULT_CLIENT_SECRET=your_client_secret
ALIENVAULT_SUBDOMAIN=your_subdomain

# Account Name (Required)
ALIENVAULT_ACCOUNT_NAME=Default

# OTX API (Optional)
ALIENVAULT_OTX_API_KEY=your_otx_key
```

**Get Your Credentials**:
- **USM Anywhere**: Log in → Admin → Settings → API Credentials
- **OTX API Key**: Visit https://otx.alienvault.com/api

**Important**: `ALIENVAULT_SUBDOMAIN` should be just the subdomain (e.g., `yourorg`, not `yourorg.alienvault.cloud`)

---

## Step 3: Test Connection (30 seconds)

```bash
node test-connection.js
```

**Expected Output**:
```
✅ Connection successful!
Received 365970 total alarms
```

---

## Step 4: Integrate with Your AI Assistant

### Claude Desktop

**Config File Location**:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

**Add this configuration**:
```json
{
  "mcpServers": {
    "usm-anywhere": {
      "command": "node",
      "args": ["C:\\full\\path\\to\\anywhere-mcp-server\\dist\\index.js"],
      "env": {
        "ALIENVAULT_CLIENT_ID": "your_client_id",
        "ALIENVAULT_CLIENT_SECRET": "your_client_secret",
        "ALIENVAULT_SUBDOMAIN": "your_subdomain",
        "ALIENVAULT_ACCOUNT_NAME": "Default"
      }
    }
  }
}
```

**Restart Claude Desktop** → Look for 🔌 icon

### Claude Code (CLI)

Add to `~/.config/claude-code/config.json`:

```json
{
  "mcpServers": {
    "usm-anywhere": {
      "command": "node",
      "args": ["/path/to/anywhere-mcp-server/dist/index.js"],
      "env": {
        "ALIENVAULT_CLIENT_ID": "your_client_id",
        "ALIENVAULT_CLIENT_SECRET": "your_client_secret",
        "ALIENVAULT_SUBDOMAIN": "your_subdomain",
        "ALIENVAULT_ACCOUNT_NAME": "Default"
      }
    }
  }
}
```

### Cline (VS Code Extension)

Add to VS Code Settings (JSON):

```json
{
  "cline.mcpServers": {
    "usm-anywhere": {
      "command": "node",
      "args": ["/path/to/anywhere-mcp-server/dist/index.js"],
      "env": {
        "ALIENVAULT_CLIENT_ID": "your_client_id",
        "ALIENVAULT_CLIENT_SECRET": "your_client_secret",
        "ALIENVAULT_SUBDOMAIN": "your_subdomain",
        "ALIENVAULT_ACCOUNT_NAME": "Default"
      }
    }
  }
}
```

### Cursor IDE

Create `.cursor/mcp.json` in your project:

```json
{
  "mcpServers": {
    "usm-anywhere": {
      "command": "node",
      "args": ["/path/to/anywhere-mcp-server/dist/index.js"],
      "cwd": "/path/to/anywhere-mcp-server",
      "env": {
        "ALIENVAULT_CLIENT_ID": "your_client_id",
        "ALIENVAULT_CLIENT_SECRET": "your_client_secret",
        "ALIENVAULT_SUBDOMAIN": "your_subdomain",
        "ALIENVAULT_ACCOUNT_NAME": "Default"
      }
    }
  }
}
```

**📖 More integrations** (Zed, ChatGPT): See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)

---

## Step 5: Start Querying

Try these natural language queries with your AI assistant:

### Security Analysis
```
"Show me all critical alarms from the last 24 hours"
"Find failed login attempts from non-US countries"
"Detect potential brute force attacks in the last hour"
```

### Investigation Management
```
"Create a critical investigation for SQL injection attempts"
"Show me all open investigations assigned to security team"
"Add a note to investigation xyz-789 about remediation steps"
```

### Advanced Queries
```
"Execute SQL query to find lateral movement in network traffic"
"Run the DNS tunneling detection query from the security guide"
"Show me off-hours data transfers larger than 10MB"
```

### Threat Intelligence
```
"Search OTX for threat intelligence about domain malicious.com"
"Get indicator information for IP address 1.2.3.4"
```

---

## Available MCP Tools

| Tool | Description |
|------|-------------|
| `get_alarms` | Retrieve security alarms with filters |
| `get_events` | Retrieve security events |
| `get_alarm_details` | Get detailed alarm information |
| `get_event_details` | Get detailed event information |
| `get_investigations` | List investigations with filters |
| `get_investigation_details` | Get full investigation details |
| `create_investigation` | Create new investigation |
| `update_investigation` | Update investigation status/priority |
| `add_investigation_note` | Add notes to investigation |
| `delete_investigation` | Delete investigation |
| `execute_advanced_query` | Execute SQL/PPL queries |
| `validate_query_syntax` | Validate query syntax |
| `get_query_examples` | Get pre-built query examples |
| `search_pulses` | Search OTX threat intelligence |
| `get_indicator` | Get threat indicator info |
| `get_pulse` | Get pulse details |

---

## Troubleshooting

### Connection Failed
```bash
# Verify credentials
node test-connection.js

# Check .env file
cat .env | grep ALIENVAULT
```

### No Data Returned
- Verify `ALIENVAULT_ACCOUNT_NAME` is correct
- Ask your USM administrator for the correct account name
- Check user permissions in USM Anywhere

### MCP Server Not Found
```bash
# Use absolute path
pwd  # Get current directory

# Make executable (Linux/macOS)
chmod +x dist/index.js

# Verify build
ls -la dist/index.js
```

### Permission Denied (Linux/macOS)
```bash
chmod +x dist/index.js
```

---

## Next Steps

### Documentation
- **[README.md](README.md)** - Full documentation and features
- **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** - Detailed platform integration
- **[DISCLAIMER.md](DISCLAIMER.md)** - Legal terms and liability
- **[CLAUDE.md](CLAUDE.md)** - Developer instructions

### Query Documentation
- **[QueryLanguage/advanced-sql-security-guide.md](QueryLanguage/advanced-sql-security-guide.md)** - 15+ SQL security queries
- **[QueryLanguage/ppl-security-workflows.md](QueryLanguage/ppl-security-workflows.md)** - 12+ PPL pipeline examples

---

## Support

- **GitHub Issues**: https://github.com/javierb507/anywhere-mcp-server/issues
- **Email**: javier.ballesteros@gmail.com
- **Version**: 3.0.0
- **License**: GNU GPL v3.0

---

## Important Notes

1. ⚠️ **NOT OFFICIAL**: This is NOT a LevelBlue or AlienVault product
2. 🔒 **Security**: Never commit `.env` file to version control
3. 📝 **Account Name**: Required for all USM Anywhere queries
4. ✅ **Testing**: Always test in non-production environments first
5. 📖 **Read Disclaimer**: See [DISCLAIMER.md](DISCLAIMER.md) before using

---

**Created by**: Javier Ballesteros ([javier.ballesteros@gmail.com](mailto:javier.ballesteros@gmail.com))

**Repository**: https://github.com/javierb507/anywhere-mcp-server
