# MCP Server Troubleshooting Guide

This guide provides solutions for common issues encountered when setting up and using the Context Optimizer MCP Server.

## Quick Diagnostics

### Health Check Commands
```bash
# 1. Verify Node.js version
node --version
# Should show v18.0.0 or higher

# 2. Check project dependencies
npm list --depth=0

# 3. Run full validation
npm run validate

# 4. Test server compilation
npm run build && echo "Build successful"

# 5. Run tests
npm test --silent
```

### Configuration Verification
```bash
# Check environment variables
echo $CONTEXT_OPT_LLM_PROVIDER
echo $CONTEXT_OPT_GEMINI_KEY | head -c 10  # Show first 10 chars only
echo $CONTEXT_OPT_ALLOWED_PATHS

# Verify paths exist
ls -la "$CONTEXT_OPT_ALLOWED_PATHS" 2>/dev/null || echo "Path check failed"
```

## Common Issues & Solutions

### 1. Server Startup Issues

#### Issue: "Failed to parse message" warnings in VS Code ✅ FIXED
```
[warning] Failed to parse message: "🔧 Loading configuration..."
[warning] Failed to parse message: "📋 Using LLM provider: gemini"
```

**Status:** ✅ **RESOLVED** - This issue has been fixed in recent versions
**Previous Cause:** Server was sending informational logs to stdout instead of stderr, interfering with MCP JSON-RPC protocol
**Fix Applied:** All logging now properly redirected to stderr via dedicated Logger utility class
**Action Required:** Update to latest version - no configuration changes needed

#### Issue: "Configuration validation failed"
```
❌ Configuration validation failed: Error: Configuration error: geminiKey is required for provider gemini
```

**Cause:** Missing or invalid API keys
**Solutions:**
1. **Check environment variables are set:**
   ```bash
   echo $CONTEXT_OPT_GEMINI_KEY | head -c 10  # Should show first 10 chars
   echo $CONTEXT_OPT_EXA_KEY | head -c 10
   ```

2. **Verify API keys format:**
   ```bash
   # Gemini keys should start with AIza...
   # Exa keys should start with exa_...
   ```

3. **Set missing environment variables:**
   ```bash
   export CONTEXT_OPT_LLM_PROVIDER="gemini"
   export CONTEXT_OPT_GEMINI_KEY="your-actual-key"
   export CONTEXT_OPT_EXA_KEY="your-exa-key"
   ```

#### Issue: Server exits immediately without error
**Solutions:**
1. **Run server directly to see errors:**
   ```bash
   node dist/server.js
   ```

2. **Check for TypeScript compilation errors:**
   ```bash
   npm run build
   ```

3. **Verify all dependencies installed:**
   ```bash
   npm install
   ```

### 2. VS Code Integration Issues

#### Issue: MCP server not appearing in VS Code
**Solutions:**
1. **Check mcp.json location:**
   - Windows: `%APPDATA%\Code\User\mcp.json`
   - macOS: `~/Library/Application Support/Code/User/mcp.json`
   - Linux: `~/.config/Code/User/mcp.json`

2. **Verify mcp.json syntax:**
   ```bash
   # Validate JSON syntax
   node -e "JSON.parse(require('fs').readFileSync('path/to/mcp.json', 'utf8'))"
   ```

3. **Use absolute paths:**
   ```json
   {
     "servers": {
       "context-optimizer": {
         "command": "node",
         "args": ["C:\\absolute\\path\\to\\dist\\server.js"]
       }
     }
   }
   ```

4. **Restart VS Code completely:**
   - Close all VS Code windows
   - Restart VS Code
   - Check Command Palette: `MCP: Show Installed Servers`

#### Issue: Tools not discovered
```
[info] Discovered 0 tools
```

**Solutions:**
1. **Check server registration:**
   ```bash
   # Run server directly and look for tool registration
   node dist/server.js
   # Should see: "✅ Registered 5 tools: askAboutFile, runAndExtract..."
   ```

2. **Restart MCP server in VS Code:**
   - Command Palette (`Ctrl+Shift+P`)
   - `MCP: Show Installed Servers`
   - Right-click server → Restart

3. **Check for configuration errors:**
   - Review VS Code developer console
   - Look for MCP-related error messages

### 3. Configuration Issues

#### Issue: "Allowed base path does not exist"
```
⚠️ Warning: Allowed base path does not exist: C:\Users\username\repos
```

**Solution:** Update CONTEXT_OPT_ALLOWED_PATHS to match your environment
```bash
# Check current setting
echo $CONTEXT_OPT_ALLOWED_PATHS

# Update to correct paths
export CONTEXT_OPT_ALLOWED_PATHS="C:\Users\YourActualUsername\Projects,C:\Users\YourActualUsername\Documents"
```

#### Issue: "Environment variable not found"
```
Error: CONTEXT_OPT_ALLOWED_PATHS environment variable is required
```

**Solutions:**
1. **Set required environment variables:**
   ```bash
   export CONTEXT_OPT_LLM_PROVIDER="gemini"
   export CONTEXT_OPT_GEMINI_KEY="your-gemini-key"  
   export CONTEXT_OPT_ALLOWED_PATHS="/path/to/your/projects"
   ```

2. **Check environment variables are set:**
   ```bash
   env | grep CONTEXT_OPT_
   ```

3. **Make environment variables persistent:**
   ```bash
   # Add to ~/.bashrc, ~/.zshrc, or ~/.profile
   echo 'export CONTEXT_OPT_LLM_PROVIDER="gemini"' >> ~/.bashrc
   echo 'export CONTEXT_OPT_GEMINI_KEY="your-key"' >> ~/.bashrc
   ```

### 4. Tool Execution Issues

#### Issue: "Path validation failed"
```
Error: Path validation failed: /forbidden/path is not within allowed base paths
```

**Solutions:**
1. **Add path to CONTEXT_OPT_ALLOWED_PATHS:**
   ```bash
   export CONTEXT_OPT_ALLOWED_PATHS="C:\Your\Project\Directory,C:\Additional\Allowed\Path"
   ```

2. **Use relative paths within allowed directories:**
   ```bash
   # Instead of absolute paths outside allowed areas
   # Use relative paths within your project
   ```

#### Issue: "Command blocked for security"
```
Error: Command blocked for security reasons: cd /some/path
```

**Cause:** Command validator blocking navigation commands
**Solution:** Use workingDirectory parameter instead:
```json
{
  "command": "ls -la",
  "workingDirectory": "/some/path"
}
```

#### Issue: Tool timeouts
```
Error: Command timed out after 30000ms
```

**Solutions:**
1. **Increase timeout via environment variable:**
   ```bash
   export CONTEXT_OPT_COMMAND_TIMEOUT="60000"  # 60 seconds
   ```

2. **Optimize command for faster execution:**
   ```bash
   # Instead of: find / -name "*.js"
   # Use: find ./project -name "*.js" -type f
   ```

### 5. API Integration Issues

#### Issue: LLM provider errors
```
Error: 401 Unauthorized - Invalid API key
```

**Solutions:**
1. **Verify API key format:**
   - Gemini: Should start with `AIza`
   - OpenAI: Should start with `sk-`
   - Claude: Should start with `sk-ant-`

2. **Check API key permissions:**
   - Ensure key has necessary permissions
   - Verify quota/billing status

3. **Test API key directly:**
   ```bash
   # Test Gemini key
   curl -H "Authorization: Bearer $CONTEXT_OPT_GEMINI_KEY" \
        "https://generativelanguage.googleapis.com/v1/models"
   ```

#### Issue: Research tool failures
```
Error: Exa API request failed
```

**Solutions:**
1. **Verify Exa.ai API key:**
   ```bash
   # Check key format (should start with 'exa_')
   echo $CONTEXT_OPT_EXA_KEY | head -c 10
   ```

2. **Check Exa.ai account status:**
   - Login to exa.ai dashboard
   - Verify API usage limits
   - Check billing status

### 6. Performance Issues

#### Issue: Slow tool responses
**Solutions:**
1. **Check file size limits:**
   ```bash
   export CONTEXT_OPT_MAX_FILE_SIZE="2097152"  # 2MB - increase if needed
   ```

2. **Optimize LLM model choice:**
   ```bash
   export CONTEXT_OPT_LLM_MODEL="gemini-1.5-flash"  # Faster than pro models
   ```

3. **Use targeted commands:**
   ```bash
   # Instead of: ls -la /
   # Use: ls -la ./specific-directory
   ```

#### Issue: High memory usage
**Solutions:**
1. **Enable session cleanup:**
   ```bash
   export CONTEXT_OPT_SESSION_TIMEOUT="1800000"  # 30 minutes
   ```

2. **Limit file size:**
   ```bash
   export CONTEXT_OPT_MAX_FILE_SIZE="512000"  # 512KB for smaller files
   ```

### 7. Icon Display Issues

#### Issue: Icon not showing in VS Code
**Solutions:**
1. **Verify icon file exists:**
   ```bash
   ls -la icon.png
   ```

2. **Use absolute path in mcp.json:**
   ```json
   {
     "servers": {
       "context-optimizer-mcp-server": {
         "icon": "C:\\absolute\\path\\to\\icon.png"
       }
     }
   }
   ```

3. **Check icon format and size:**
   - Should be 32×32 pixels
   - PNG, SVG, or WebP format
   - Under 50KB file size

4. **Restart MCP server:**
   - Command Palette → `MCP: Show Installed Servers`
   - Right-click server → Restart

## Debug Mode

### Enable Detailed Logging
```bash
export CONTEXT_OPT_LOG_LEVEL="debug"
```

### Analyze Debug Output
Look for these patterns in debug logs:

#### Successful Configuration Loading
```
🔧 Loading configuration...
✅ Configuration loaded successfully from: [path]
📋 Using LLM provider: gemini
✅ Registered 5 tools: askAboutFile, runAndExtract, askFollowUp, researchTopic, deepResearch
```

#### Tool Execution Flow
```
🔧 Tool called: askAboutFile
🔒 Path validation passed: [path]
📖 File read successfully: [size] bytes
🤖 LLM processing...
✅ Response generated
```

#### Session Management
```
💾 Session saved: [session-id]
🔍 Session loaded: [session-id]
🧹 Session cleanup completed
```

## Environment-Specific Debugging

### Windows
```powershell
# Check file permissions
icacls icon.png
icacls .env

# Test paths
Test-Path "C:\path\to\server\dist\server.js"

# Environment variables
$env:CONTEXT_OPT_GEMINI_KEY
$env:CONTEXT_OPT_EXA_KEY
```

### macOS/Linux
```bash
# Check file permissions
ls -la icon.png .env

# Test paths
[ -f "/path/to/server/dist/server.js" ] && echo "File exists"

# Environment variables
echo $CONTEXT_OPT_GEMINI_KEY
echo $CONTEXT_OPT_EXA_KEY
```

## Recovery Procedures

### Complete Reset
```bash
# 1. Clean build
npm run clean
rm -rf node_modules package-lock.json

# 2. Fresh install
npm install

# 3. Rebuild
npm run build

# 4. Validate
npm run validate
```

### Configuration Reset
```bash
# 1. Clear any problematic environment variables
unset CONTEXT_OPT_LLM_PROVIDER
unset CONTEXT_OPT_GEMINI_KEY
unset CONTEXT_OPT_ALLOWED_PATHS

# 2. Set fresh environment variables
export CONTEXT_OPT_LLM_PROVIDER="gemini"
export CONTEXT_OPT_GEMINI_KEY="your-api-key"
export CONTEXT_OPT_ALLOWED_PATHS="/path/to/your/projects"

# 3. Test configuration
npm run validate
```

### VS Code MCP Reset
```bash
# 1. Backup mcp.json
cp "%APPDATA%\Code\User\mcp.json" mcp.json.backup

# 2. Remove server entry
# Edit mcp.json to remove the server

# 3. Restart VS Code
# 4. Re-add server configuration
```

## Getting Help

### Self-Diagnosis Checklist
- [ ] Node.js 18+ installed
- [ ] Project built successfully (`npm run build`)
- [ ] All tests passing (`npm test --silent`)
- [ ] Configuration file valid JSON
- [ ] API keys present and valid
- [ ] Paths in configuration exist
- [ ] VS Code mcp.json uses absolute paths
- [ ] MCP server restarted after changes

### Log Collection
When reporting issues, collect these logs:

1. **Build output:**
   ```bash
   npm run build > build.log 2>&1
   ```

2. **Test results:**
   ```bash
   npm test --silent > test.log 2>&1
   ```

3. **Server startup:**
   ```bash
   node dist/server.js > server.log 2>&1
   ```

4. **VS Code MCP logs:**
   - Open VS Code Developer Tools
   - Check Console for MCP-related messages

### Common Log Patterns

#### Success Patterns
```
✅ Configuration loaded successfully
✅ Registered 5 tools
🚀 Context Optimizer MCP Server started
[info] Discovered 5 tools
```

#### Error Patterns
```
❌ Configuration validation failed
⚠️ Warning: Allowed base path does not exist
[warning] Failed to parse message
Error: Path validation failed
```

This troubleshooting guide covers the most common issues. For additional help, review the README.md, usage.md, and test files for more detailed information.
