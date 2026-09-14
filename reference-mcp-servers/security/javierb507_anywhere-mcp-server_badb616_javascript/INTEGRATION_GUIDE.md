# MCP Integration Guide

Complete guide for integrating the USM Anywhere MCP server with AI platforms.

**⚠️ DISCLAIMER**: This is NOT an official LevelBlue product. See [DISCLAIMER.md](DISCLAIMER.md)

---

## Prerequisites

Before integrating, ensure you have:

1. **Built the MCP server**:
   ```bash
   npm install && npm run build
   ```

2. **Created `.env` file** with credentials (or use environment variables in MCP config)

3. **Note the absolute path** to your server:
   - Windows: `C:\path\to\anywhere-mcp-server\dist\index.js`
   - macOS/Linux: `/absolute/path/to/anywhere-mcp-server/dist/index.js`

---

## Table of Contents

- [Claude Desktop](#claude-desktop) - Desktop app from Anthropic
- [Claude Code (CLI)](#claude-code-cli) - Command-line interface
- [Cline (VS Code)](#cline-vs-code-extension) - VS Code extension
- [Cursor IDE](#cursor-ide) - AI-powered IDE
- [Zed Editor](#zed-editor) - High-performance editor
- [ChatGPT Custom GPT](#chatgpt-custom-gpt) - OpenAI integration
- [Generic MCP Client](#generic-mcp-client) - Any MCP-compatible client
- [Troubleshooting](#troubleshooting) - Common issues and solutions

---

## Claude Desktop

**Platform**: Desktop application from Anthropic
**Best for**: General security analysis and investigations

### Configuration File Location

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

### Setup Steps

1. Create or edit the configuration file:

```json
{
  "mcpServers": {
    "usm-anywhere": {
      "command": "node",
      "args": [
        "C:\\path\\to\\anywhere-mcp-server\\dist\\index.js"
      ],
      "env": {
        "ALIENVAULT_CLIENT_ID": "your_client_id",
        "ALIENVAULT_CLIENT_SECRET": "your_client_secret",
        "ALIENVAULT_SUBDOMAIN": "your_subdomain",
        "ALIENVAULT_ACCOUNT_NAME": "Default",
        "ALIENVAULT_OTX_API_KEY": "your_otx_key"
      }
    }
  }
}
```

2. **Restart Claude Desktop**

3. Look for the **🔌 icon** in the bottom right corner

4. Confirm "usm-anywhere" is listed as connected

### Usage Examples

```
"Show me all critical alarms from the last 24 hours"
"Create an investigation for suspicious login attempts"
"Execute SQL query to find failed authentication events"
"Search OTX for threat intelligence about domain malicious.com"
```

---

## Claude Code (CLI)

**Platform**: Command-line interface from Anthropic
**Best for**: Terminal-based workflows and scripting

### Configuration File Location

- **macOS/Linux**: `~/.config/claude-code/config.json`
- **Windows**: `%APPDATA%\claude-code\config.json`

### Setup Steps

1. Install Claude Code (if not already installed):
   ```bash
   # Installation varies by platform - check Anthropic docs
   ```

2. Create or edit the configuration file:

```json
{
  "mcpServers": {
    "usm-anywhere": {
      "command": "node",
      "args": [
        "/absolute/path/to/anywhere-mcp-server/dist/index.js"
      ],
      "env": {
        "ALIENVAULT_CLIENT_ID": "your_client_id",
        "ALIENVAULT_CLIENT_SECRET": "your_client_secret",
        "ALIENVAULT_SUBDOMAIN": "your_subdomain",
        "ALIENVAULT_ACCOUNT_NAME": "Default",
        "ALIENVAULT_OTX_API_KEY": "your_otx_key"
      }
    }
  }
}
```

3. Start Claude Code:
   ```bash
   claude-code
   ```

### Usage Examples

```bash
# Start interactive session
claude-code

# Query from command line
claude-code "Show me critical alarms from today"
```

---

## Cline (VS Code Extension)

**Platform**: VS Code extension for AI-powered coding
**Best for**: Development workflows and security code review

### Setup Steps

1. Install Cline extension from VS Code Marketplace

2. Open VS Code Settings (JSON):
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
   - Type "Preferences: Open User Settings (JSON)"
   - Click to open

3. Add this configuration:

```json
{
  "cline.mcpServers": {
    "usm-anywhere": {
      "command": "node",
      "args": [
        "/absolute/path/to/anywhere-mcp-server/dist/index.js"
      ],
      "env": {
        "ALIENVAULT_CLIENT_ID": "your_client_id",
        "ALIENVAULT_CLIENT_SECRET": "your_client_secret",
        "ALIENVAULT_SUBDOMAIN": "your_subdomain",
        "ALIENVAULT_ACCOUNT_NAME": "Default",
        "ALIENVAULT_OTX_API_KEY": "your_otx_key"
      }
    }
  }
}
```

4. Reload VS Code

5. Open Cline panel and verify "usm-anywhere" is available

### Usage Examples

```
"Analyze alarms related to this IP address in the code"
"Create an investigation for security findings in this codebase"
"Check OTX for threat intelligence on domains found in config files"
```

---

## Cursor IDE

**Platform**: AI-powered IDE with native MCP support
**Best for**: Development with integrated security analysis

### Setup Steps

1. Create `.cursor/mcp.json` in your project root or user config directory:

```json
{
  "mcpServers": {
    "usm-anywhere": {
      "command": "node",
      "args": [
        "/absolute/path/to/anywhere-mcp-server/dist/index.js"
      ],
      "cwd": "/absolute/path/to/anywhere-mcp-server",
      "env": {
        "ALIENVAULT_CLIENT_ID": "your_client_id",
        "ALIENVAULT_CLIENT_SECRET": "your_client_secret",
        "ALIENVAULT_SUBDOMAIN": "your_subdomain",
        "ALIENVAULT_ACCOUNT_NAME": "Default",
        "ALIENVAULT_OTX_API_KEY": "your_otx_key"
      }
    }
  }
}
```

2. Restart Cursor IDE

3. Verify MCP server is connected in Cursor settings

### Usage Examples

```
"Show me security alarms related to this application"
"Execute threat hunting queries for IPs in this config"
"Create investigation for security incidents found"
```

---

## Zed Editor

**Platform**: High-performance collaborative editor
**Best for**: Fast security analysis and team collaboration

### Setup Steps

1. Create or edit `~/.config/zed/settings.json`:

```json
{
  "mcp": {
    "servers": {
      "usm-anywhere": {
        "command": "node",
        "args": [
          "/absolute/path/to/anywhere-mcp-server/dist/index.js"
        ],
        "env": {
          "ALIENVAULT_CLIENT_ID": "your_client_id",
          "ALIENVAULT_CLIENT_SECRET": "your_client_secret",
          "ALIENVAULT_SUBDOMAIN": "your_subdomain",
          "ALIENVAULT_ACCOUNT_NAME": "Default",
          "ALIENVAULT_OTX_API_KEY": "your_otx_key"
        }
      }
    }
  }
}
```

2. Restart Zed Editor

3. Check MCP status in Zed settings

### Usage Examples

```
"Get recent security alarms"
"Search for suspicious events"
"Create investigation for anomalies"
```

---

## ChatGPT Custom GPT

**Platform**: OpenAI ChatGPT with custom actions
**Best for**: Web-based security analysis and reporting

### Setup Requirements

- ChatGPT Plus or Enterprise subscription
- MCP server running on accessible endpoint (localhost or hosted)

### Configuration Steps

1. **Create Custom GPT**:
   - Go to https://chat.openai.com/gpts/editor
   - Click "Create a GPT"

2. **Configure GPT Instructions**:
   ```
   You are a cybersecurity analyst with access to LevelBlue USM Anywhere through MCP tools.

   You can:
   - Query security alarms and events
   - Execute advanced SQL/PPL queries
   - Manage security investigations
   - Search threat intelligence via OTX

   Always validate queries before execution and provide context for your analysis.
   Use the pre-built security query examples when appropriate.
   ```

3. **Add Actions (OpenAPI Schema)**:

```yaml
openapi: 3.0.0
info:
  title: USM Anywhere MCP Server
  version: 3.0.0
servers:
  - url: http://localhost:3000
    description: Local MCP server
paths:
  /tools/get_alarms:
    post:
      summary: Get security alarms
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                account_name:
                  type: string
                page:
                  type: integer
                size:
                  type: integer
  /tools/execute_advanced_query:
    post:
      summary: Execute SQL/PPL query
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                account_name:
                  type: string
                query_string:
                  type: string
                query_language:
                  type: string
                  enum: [SQL, PPL]
```

4. **Save and Test**

**Note**: MCP server must be accessible to ChatGPT. Consider using:
- Localhost tunneling (ngrok, cloudflare tunnel)
- Cloud hosting (AWS, Azure, GCP)
- VPN access for corporate networks

---

## Generic MCP Client

**Platform**: Any MCP-compatible client
**Best for**: Custom integrations and automation

### Integration Pattern

1. **Start MCP Server**:
   ```bash
   node dist/index.js
   ```

2. **Connect via stdio**:
   The server uses JSON-RPC 2.0 over stdio for communication.

3. **Example Tool Call**:

```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "get_alarms",
    "arguments": {
      "account_name": "Default",
      "page": 0,
      "size": 20
    }
  },
  "id": 1
}
```

4. **Example Response**:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "page": {
      "totalElements": 365970
    },
    "_embedded": {
      "alarms": [
        {
          "uuid": "abc-123",
          "priority_label": "High",
          "rule_intent": "Malware"
        }
      ]
    }
  },
  "id": 1
}
```

### Available Tools

See [README.md](README.md#available-mcp-tools) for complete list of 16 MCP tools.

---

## Troubleshooting

### Common Issues

#### 1. MCP Server Not Detected

**Symptoms**: No 🔌 icon, server not listed in MCP clients

**Solutions**:
```bash
# Verify build
npm run build
ls -la dist/index.js

# Test server manually
node dist/index.js
# Should start without errors

# Check absolute path
pwd  # Get current directory
```

**Fix**: Always use **absolute paths** in MCP configuration, not relative paths.

#### 2. Authentication Failed

**Symptoms**: 401 errors, "Bad credentials" messages

**Solutions**:
```bash
# Test connection
node test-connection.js

# Verify credentials in .env
cat .env | grep ALIENVAULT

# Check subdomain format
# Correct: yourorg
# Incorrect: yourorg.alienvault.cloud
```

**Fix**: Verify all credentials are correct and `ALIENVAULT_SUBDOMAIN` is just the subdomain name.

#### 3. No Data Returned

**Symptoms**: Empty results, 0 alarms/events

**Solutions**:
- Verify `ALIENVAULT_ACCOUNT_NAME` is correct
- Ask your USM Anywhere administrator for the correct account name
- Check user permissions in USM Anywhere
- Ensure account has access to alarms/events

**Fix**: Update `ALIENVAULT_ACCOUNT_NAME` to the correct value.

#### 4. Permission Denied (Linux/macOS)

**Symptoms**: `EACCES: permission denied` errors

**Solutions**:
```bash
# Make executable
chmod +x dist/index.js

# Verify permissions
ls -la dist/index.js
# Should show: -rwxr-xr-x
```

#### 5. Module Not Found

**Symptoms**: `Cannot find module` errors

**Solutions**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild project
npm run build
```

#### 6. Query Execution Errors

**Symptoms**: 500 errors when executing queries

**Solutions**:
- Ensure `ALIENVAULT_ACCOUNT_NAME` is set
- Provide time ranges in queries (defaults to 24h)
- Validate field names match your data schema
- Use `validate_query_syntax` before executing

**PPL Issues**: PPL queries have known JSON encoding issues. Use SQL for production.

#### 7. Rate Limiting

**Symptoms**: 429 errors, "Too Many Requests"

**Solutions**:
- Implement exponential backoff
- Cache responses when possible
- Reduce query frequency
- USM Anywhere limit: 100 requests/second

---

## Platform-Specific Tips

### Claude Desktop
- Restart required after config changes
- Check logs: `~/Library/Logs/Claude/` (macOS) or `%APPDATA%\Claude\logs\` (Windows)
- Verify JSON syntax in config file

### Claude Code
- Environment variables in config override `.env` file
- Use absolute paths for portability
- Test with `claude-code --version` first

### Cline (VS Code)
- Reload window after config changes (`Ctrl+Shift+P` → "Reload Window")
- Check VS Code output panel for errors
- Ensure Cline extension is up to date

### Cursor IDE
- `.cursor/mcp.json` can be project-specific or global
- Check Cursor settings for MCP status
- Restart required after config changes

### Zed Editor
- Settings are in JSON format
- Check Zed console for MCP errors
- Ensure Zed version supports MCP

---

## Security Best Practices

1. **Credentials Management**:
   - Never commit `.env` files to version control
   - Use environment variables in MCP config
   - Rotate credentials regularly

2. **Network Security**:
   - Use HTTPS for all API calls (handled by server)
   - Consider VPN for cloud deployments
   - Implement IP whitelisting if hosting server

3. **Access Control**:
   - Use dedicated service accounts for MCP server
   - Implement least-privilege access
   - Monitor API usage and logs

4. **Data Protection**:
   - Encrypt credentials at rest
   - Secure MCP configuration files
   - Implement audit logging

---

## Getting Help

### Support Resources
- **GitHub Issues**: https://github.com/javierb507/anywhere-mcp-server/issues
- **Email**: javier.ballesteros@gmail.com
- **Documentation**: [README.md](README.md) | [QUICK_START.md](QUICK_START.md)

### Before Requesting Support

1. Check this troubleshooting guide
2. Test connection with `node test-connection.js`
3. Review MCP client logs
4. Verify all paths are absolute
5. Confirm credentials are correct

### Information to Include

When reporting issues, include:
- Platform and version (Claude Desktop, Cline, etc.)
- Operating system
- MCP server version (3.0.0)
- Error messages and logs
- Configuration (with credentials redacted)

---

## Additional Resources

- **[README.md](README.md)** - Full documentation and features
- **[QUICK_START.md](QUICK_START.md)** - 3-minute setup guide
- **[DISCLAIMER.md](DISCLAIMER.md)** - Legal terms and liability
- **[CLAUDE.md](CLAUDE.md)** - Developer instructions
- **[QueryLanguage/](QueryLanguage/)** - SQL and PPL query guides

---

**Version**: 3.0.0
**Author**: Javier Ballesteros ([javier.ballesteros@gmail.com](mailto:javier.ballesteros@gmail.com))
**License**: GNU GPL v3.0
**Repository**: https://github.com/javierb507/anywhere-mcp-server

---

**⚠️ Important**: This is NOT an official LevelBlue product. See [DISCLAIMER.md](DISCLAIMER.md) before using.
