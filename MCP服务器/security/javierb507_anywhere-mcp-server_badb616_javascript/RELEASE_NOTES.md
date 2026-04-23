# Release Notes - Version 3.0.0

**Release Date**: December 30, 2025

**Author**: Javier Ballesteros (javier.ballesteros@gmail.com)

---

## 🎉 What's New in Version 3.0.0

### Legal & Compliance

✅ **Comprehensive Disclaimer Added**
- New `DISCLAIMER.md` with complete legal terms
- Clear statement: NOT an official LevelBlue product
- Limitation of liability clauses
- User responsibilities outlined
- Data privacy guidelines

✅ **Enhanced Author Attribution**
- Complete author information in all files
- Contact details: javier.ballesteros@gmail.com
- GitHub profile: [@javierb507](https://github.com/javierb507)
- LinkedIn profile added
- Copyright and trademark notices

### Documentation Improvements

✅ **New Documentation Files**
1. **DISCLAIMER.md** - Legal terms and conditions
2. **INTEGRATION_GUIDE.md** - Complete integration guide for 7+ platforms
3. **QUICK_START.md** - 5-minute quick start guide
4. **DOCUMENTATION_SUMMARY.md** - Complete documentation index

✅ **Updated README.md**
- Prominent disclaimer at top
- Author and license information
- Links to all documentation
- Enhanced contributing guidelines
- Trademark acknowledgments

✅ **Enhanced Integration Documentation**
- Claude Desktop configuration
- Claude Code (CLI) setup
- Cline (VS Code Extension)
- Cursor IDE integration
- Zed Editor configuration
- ChatGPT Custom GPT guide
- Generic MCP client instructions
- Platform-specific troubleshooting

### Security Enhancements

✅ **Improved .gitignore**
- Added deployment script patterns (`deploy-*.ps1`, `deploy-*.sh`)
- Protection against credential exposure
- Better file exclusion patterns

✅ **Security Best Practices**
- Clear instructions for credential management
- Environment variable best practices
- API key rotation guidelines
- Rate limiting recommendations

### Code Improvements

✅ **Source Code Headers**
- Disclaimer in main source file
- Version information
- Author attribution
- License information

✅ **Package.json Updates**
- Version bumped to 3.0.0
- Enhanced description with disclaimer
- Complete author object
- Bug reporting email
- Repository links corrected

### Testing & Validation

✅ **Connection Testing**
- Verified API connectivity
- Tested with live USM Anywhere instance
- Successfully retrieved 365,970+ alarms
- All endpoints functioning correctly

✅ **Test Scripts Updated**
- Corrected response structure handling
- Better error reporting
- Account name parameter support
- HAL/JSON format compatibility

### Integration Examples

✅ **7+ Platform Integrations Documented**
1. Claude Desktop (Anthropic)
2. Claude Code CLI
3. Cline (VS Code Extension)
4. Cursor IDE
5. Zed Editor
6. ChatGPT Custom GPT
7. Generic MCP clients

✅ **Working Examples Provided**
- Configuration templates
- Environment setup
- Usage examples
- Troubleshooting guides

---

## 📋 Complete Feature List

### Core Features

- ✅ OAuth 2.0 authentication (USM Anywhere API v2.0)
- ✅ Legacy OTX API support
- ✅ 16 MCP tools available
- ✅ SQL and PPL query execution
- ✅ Investigation management
- ✅ Threat intelligence integration
- ✅ Real-time security monitoring
- ✅ Type-safe TypeScript implementation

### Available Tools

1. `get_alarms` - Security alarm retrieval
2. `get_events` - Security event retrieval
3. `get_alarm_details` - Detailed alarm information
4. `get_event_details` - Detailed event information
5. `get_investigations` - Investigation listing
6. `get_investigation_details` - Investigation details
7. `create_investigation` - Create investigations
8. `update_investigation` - Update investigations
9. `add_investigation_note` - Add investigation notes
10. `delete_investigation` - Delete investigations
11. `execute_advanced_query` - SQL/PPL query execution
12. `validate_query_syntax` - Query validation
13. `get_query_examples` - Pre-built query examples
14. `search_pulses` - OTX pulse search
15. `get_indicator` - Threat indicator lookup
16. `get_pulse` - Pulse details retrieval

### Query Libraries

- 15+ SQL security analysis queries
- 12+ PPL pipeline workflows
- Threat hunting examples
- Compliance queries
- Performance optimization guides

---

## 🔄 Migration Guide

### From Version 2.x to 3.0.0

**No Breaking Changes** - Version 3.0.0 is fully backward compatible.

#### Optional Updates:

1. **Add Account Name to .env**:
   ```env
   ALIENVAULT_ACCOUNT_NAME=Default
   ```

2. **Review New Documentation**:
   - Read [DISCLAIMER.md](DISCLAIMER.md)
   - Check [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)

3. **Update Integration Configs** (Optional):
   - No changes required to existing configs
   - New platforms supported if needed

4. **Rebuild Project**:
   ```bash
   npm run build
   ```

---

## 📦 Installation

### New Installation

```bash
# Clone repository
git clone https://github.com/javierb507/anywhere-mcp-server.git
cd anywhere-mcp-server

# Install dependencies
npm install

# Build project
npm run build

# Configure credentials
cp env.example .env
# Edit .env with your credentials

# Test connection
node test-connection.js
```

### Upgrade from Previous Version

```bash
# Pull latest changes
git pull origin main

# Update dependencies
npm install

# Rebuild project
npm run build

# Test
node test-connection.js
```

---

## 🐛 Bug Fixes

- ✅ Fixed alarm/event response parsing for HAL/JSON format
- ✅ Corrected test scripts to use proper data structure
- ✅ Improved error handling in investigations endpoint
- ✅ Better error logging without circular reference issues

---

## 📚 Documentation

### New Documents

- [DISCLAIMER.md](DISCLAIMER.md) - Legal terms and liability
- [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) - Platform integrations
- [QUICK_START.md](QUICK_START.md) - Fast setup guide
- [DOCUMENTATION_SUMMARY.md](DOCUMENTATION_SUMMARY.md) - Doc index

### Updated Documents

- [README.md](README.md) - Enhanced with disclaimer and author info
- [CLAUDE.md](CLAUDE.md) - Updated instructions
- [package.json](package.json) - Version and metadata
- [env.example](env.example) - Template file

---

## ⚠️ Known Issues

1. **PPL Query Execution** - Known JSON encoding issues with PPL queries. Use SQL for production.
2. **Investigation Endpoint** - May return errors with certain API versions. Try-catch implemented.
3. **Rate Limiting** - 100 requests/second limit. Implement backoff if needed.

---

## 🔮 Future Plans

### Planned for v3.1.0

- [ ] Enhanced query builder
- [ ] Additional pre-built queries
- [ ] Improved error messages
- [ ] Performance metrics
- [ ] Query result caching

### Planned for v4.0.0

- [ ] Web dashboard
- [ ] Real-time streaming
- [ ] Webhook support
- [ ] Advanced analytics
- [ ] Multi-tenant support

---

## 🙏 Acknowledgments

Special thanks to:

- **LevelBlue / AlienVault** - For providing the APIs
- **Anthropic** - For the Model Context Protocol
- **Open Source Community** - For feedback and contributions
- **Early Adopters** - For testing and bug reports

---

## 📞 Support & Contact

- **GitHub Issues**: https://github.com/javierb507/anywhere-mcp-server/issues
- **Email**: javier.ballesteros@gmail.com
- **Repository**: https://github.com/javierb507/anywhere-mcp-server

---

## 📜 License

GNU General Public License v3.0 - See [LICENSE](LICENSE) file

---

## ⚠️ Important Reminders

1. **NOT OFFICIAL**: This is NOT an official LevelBlue or AlienVault product
2. **READ DISCLAIMER**: See [DISCLAIMER.md](DISCLAIMER.md) before using
3. **NO WARRANTY**: Software provided "AS IS" without warranty
4. **USER RESPONSIBILITY**: You are responsible for secure usage
5. **TEST FIRST**: Always test in non-production environments

---

**Version**: 3.0.0

**Release Date**: December 30, 2025

**Author**: Javier Ballesteros

**Email**: javier.ballesteros@gmail.com

**GitHub**: [@javierb507](https://github.com/javierb507)
