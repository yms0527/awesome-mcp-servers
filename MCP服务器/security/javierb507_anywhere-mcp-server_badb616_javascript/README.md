# LevelBlue USM Anywhere MCP Server

> ⚠️ **DISCLAIMER**: This is **NOT** an official LevelBlue or AlienVault product. See [DISCLAIMER.md](DISCLAIMER.md) for full terms.

A production-ready **Model Context Protocol (MCP)** server that connects AI assistants to LevelBlue's USM Anywhere security platform. Execute advanced security queries, manage investigations, and analyze threats through natural language.

**Version**: 3.0.0
**Author**: Javier Ballesteros ([javier.ballesteros@gmail.com](mailto:javier.ballesteros@gmail.com))
**License**: GNU GPL v3.0
**Repository**: https://github.com/javierb507/anywhere-mcp-server

---

## 🚀 Quick Start (3 Minutes)

```bash
# 1. Clone and install
git clone https://github.com/javierb507/anywhere-mcp-server.git
cd anywhere-mcp-server
npm install && npm run build

# 2. Configure credentials
cp env.example .env
# Edit .env with your USM Anywhere credentials

# 3. Test connection
node test-connection.js
```

**✅ Ready to integrate with your AI assistant!** See [integration examples](#integration-examples) below.

---

## What is MCP?

**Model Context Protocol (MCP)** is an open protocol that allows AI assistants to securely connect to external data sources and tools. This server implements MCP to bridge AI assistants with LevelBlue USM Anywhere, enabling:

- 🤖 **Natural language queries** → Advanced SQL/PPL security analysis
- 🔍 **Automated threat hunting** → AI-powered detection and investigation
- 📊 **Investigation management** → Create, update, and track security incidents
- 🌐 **Threat intelligence** → AlienVault OTX integration

**Supported AI Platforms**: Claude Desktop, Claude Code, Cline (VS Code), Cursor IDE, Zed Editor, and any MCP-compatible client.

---

## Features

### Core Capabilities
- ✅ **OAuth 2.0 Authentication** - Secure client credentials flow
- ✅ **16 MCP Tools** - Complete USM Anywhere API coverage
- ✅ **Advanced Query Engine** - Execute SQL and PPL queries
- ✅ **Investigation Management** - SANS-aligned incident response workflows
- ✅ **Threat Intelligence** - AlienVault OTX API integration
- ✅ **Type-Safe** - Built with TypeScript and Zod validation
- ✅ **Production Ready** - Comprehensive error handling and rate limiting

### Pre-Built Security Queries
- 📚 **15+ SQL Queries** - Threat hunting, compliance, anomaly detection
- 📚 **12+ PPL Pipelines** - Behavioral analytics and log correlation
- 📖 **Complete Documentation** - Query guides in `QueryLanguage/` directory

---

## Available MCP Tools

| Tool | Description |
|------|-------------|
| `get_alarms` | Retrieve security alarms with filtering |
| `get_events` | Retrieve security events |
| `get_alarm_details` | Get detailed alarm information |
| `get_event_details` | Get detailed event information |
| `get_investigations` | List investigations with advanced filters |
| `get_investigation_details` | Get full investigation details |
| `create_investigation` | Create new security investigation |
| `update_investigation` | Update investigation status/priority |
| `add_investigation_note` | Add notes to investigation |
| `delete_investigation` | Delete investigation |
| `execute_advanced_query` | Execute SQL/PPL queries |
| `validate_query_syntax` | Validate query before execution |
| `get_query_examples` | Get pre-built query examples |
| `search_pulses` | Search OTX threat intelligence |
| `get_indicator` | Get threat indicator info (IP/domain/hash) |
| `get_pulse` | Get detailed pulse information |

---

## Integration Examples

### Claude Desktop (macOS/Windows)

**Configuration File Locations**:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "usm-anywhere": {
      "command": "node",
      "args": ["C:\\path\\to\\anywhere-mcp-server\\dist\\index.js"],
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

**Restart Claude Desktop** → Look for 🔌 icon to confirm MCP server is connected.

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

**📖 For more integrations** (Zed Editor, ChatGPT, Generic MCP), see [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)

---

## Usage Examples

Once integrated, query your AI assistant using natural language:

### Security Analysis
```
"Show me all critical alarms from the last 24 hours"
"Find failed login attempts from non-US countries"
"Detect potential brute force attacks in the last hour"
"Look for DNS queries longer than 40 characters (tunneling detection)"
```

### Investigation Management
```
"Create a critical investigation for the SQL injection attempts in alarm abc-123"
"Show me all open investigations assigned to the security team"
"Add a note to investigation xyz-789 about remediation steps taken"
"Update investigation xyz-789 to resolved status"
```

### Advanced Queries
```
"Execute SQL query to find lateral movement in network traffic"
"Create PPL pipeline to analyze user behavior anomalies"
"Run the port scanning detection query from the security guide"
"Show me off-hours data transfers larger than 10MB"
```

### Threat Intelligence
```
"Search OTX for threat intelligence about domain malicious.com"
"Get indicator information for IP address 1.2.3.4"
"Show me recent pulses about ransomware"
```

---

## Configuration

### Required Environment Variables

```env
# USM Anywhere API v2.0 (Required)
ALIENVAULT_CLIENT_ID=your_client_id
ALIENVAULT_CLIENT_SECRET=your_client_secret
ALIENVAULT_SUBDOMAIN=your_subdomain

# Account Name (Required for queries)
ALIENVAULT_ACCOUNT_NAME=Default

# Legacy OTX API (Optional)
ALIENVAULT_OTX_API_KEY=your_otx_key
```

**Getting Your Credentials**:
1. **USM Anywhere**: Log in → Admin → Settings → API Credentials
2. **OTX API Key**: Visit https://otx.alienvault.com/api

**Important Notes**:
- `ALIENVAULT_SUBDOMAIN`: Just the subdomain (e.g., `yourorg`, not `yourorg.alienvault.cloud`)
- `ALIENVAULT_ACCOUNT_NAME`: Ask your USM administrator for the correct account name
- Never commit `.env` file to version control (already in `.gitignore`)

---

## Documentation

### Essential Docs
- **[QUICK_START.md](QUICK_START.md)** - 5-minute setup guide
- **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** - Complete integration guide for all platforms
- **[DISCLAIMER.md](DISCLAIMER.md)** - ⚠️ Legal terms and liability (READ BEFORE USING)
- **[CLAUDE.md](CLAUDE.md)** - Instructions for AI assistants and developers

### Query Documentation
- **[QueryLanguage/advanced-sql-security-guide.md](QueryLanguage/advanced-sql-security-guide.md)** - 15+ SQL security queries
- **[QueryLanguage/ppl-security-workflows.md](QueryLanguage/ppl-security-workflows.md)** - 12+ PPL pipeline examples
- **[QueryLanguage/basicsql.md](QueryLanguage/basicsql.md)** - SQL basics and field reference
- **[QueryLanguage/pplbasic.md](QueryLanguage/pplbasic.md)** - PPL basics and commands

### Additional Resources
- **[TO_FUTURE_DEVELOPERS.md](TO_FUTURE_DEVELOPERS.md)** - Philosophy and message across time 📜
- **[RELEASE_NOTES.md](RELEASE_NOTES.md)** - Version 3.0.0 changelog
- **[LICENSE](LICENSE)** - GNU GPL v3.0 full text

---

## Troubleshooting

### Connection Issues

**Error: Authentication Failed**
```bash
# Verify credentials
node test-connection.js

# Check .env file format
cat .env | grep ALIENVAULT
```

**Error: No Data Returned**
- Verify `ALIENVAULT_ACCOUNT_NAME` is correct
- Check user permissions in USM Anywhere
- Ensure account has access to data

### MCP Server Issues

**Error: spawn EACCES (Permission denied)**
```bash
# Make server executable
chmod +x dist/index.js

# Verify permissions
ls -la dist/index.js
# Should show: -rwxr-xr-x
```

**MCP Server Not Detected**
- Use **absolute paths** in MCP configuration
- Rebuild project: `npm run build`
- Check MCP client logs for errors

### Query Issues

**500 Internal Server Error**
- Ensure account name is correct
- Provide time ranges in queries (defaults to 24h)
- Validate field names match your data schema

**PPL Query Failures**
- Known issue: PPL has JSON encoding problems
- **Recommendation**: Use SQL queries for production
- PPL syntax validation works, but execution may fail

---

## Development

### Commands

```bash
# Build project
npm run build

# Development mode
npm run dev

# Run tests
npm test

# Clean build files
npm run clean

# Lint/typecheck
npm run lint
```

### Project Structure

```
anywhere-mcp-server/
├── src/
│   ├── index.ts              # Main MCP server
│   ├── services/
│   │   └── alienvault.ts     # API service layer
│   ├── handlers/
│   │   └── tools.ts          # MCP tool handlers
│   └── types/
│       └── index.ts          # TypeScript types & Zod schemas
├── QueryLanguage/            # Query documentation
├── examples/                 # Configuration examples
├── dist/                     # Compiled output
└── test-connection.js        # Connection test script
```

---

## Support & Contributing

### Get Help
- **GitHub Issues**: https://github.com/javierb507/anywhere-mcp-server/issues
- **Email**: javier.ballesteros@gmail.com
- **Documentation**: See `/QueryLanguage` and `/examples` directories

### Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit (`git commit -m 'Add amazing feature'`)
6. Push (`git push origin feature/amazing-feature`)
7. Open Pull Request

**Note**: By contributing, you agree to license your contributions under GNU GPL v3.0.

---

## License & Credits

### License

This project is licensed under **GNU General Public License v3.0** - see [LICENSE](LICENSE) file.

**Key Points**:
- ✅ Free to use, modify, and distribute
- ✅ Source code must remain open
- ✅ Changes must be documented
- ✅ Derivatives must use same license
- ❌ No warranty provided
- ❌ Authors not liable for damages

### Author

**Javier Ballesteros**
- 📧 Email: [javier.ballesteros@gmail.com](mailto:javier.ballesteros@gmail.com)
- 💻 GitHub: [@javierb507](https://github.com/javierb507)
- 🔗 LinkedIn: [Javier Ballesteros](https://www.linkedin.com/in/javier-ballesteros)

### Acknowledgments

- **LevelBlue** - For providing USM Anywhere API ([docs.levelblue.com](https://docs.levelblue.com/documentation/usm-anywhere))
- **AlienVault** - For providing OTX API ([otx.alienvault.com](https://otx.alienvault.com/))
- **Anthropic** - For Model Context Protocol specification
- **Open Source Community** - For contributions and feedback

### Trademarks

LevelBlue®, USM Anywhere®, AlienVault®, and OTX® are registered trademarks of their respective owners. This project is not affiliated with or endorsed by these companies.

---

## Official Documentation Links

- **LevelBlue USM Anywhere**: https://docs.levelblue.com/documentation/usm-anywhere
- **USM Anywhere API Reference**: https://cybersecurity.att.com/documentation/api/usm-anywhere-apis.htm
- **AlienVault OTX Portal**: https://otx.alienvault.com/
- **Model Context Protocol**: https://modelcontextprotocol.io

---

**⚠️ Important Reminder**: This is **NOT** an official LevelBlue product. Read [DISCLAIMER.md](DISCLAIMER.md) before using. Always test in non-production environments first.
