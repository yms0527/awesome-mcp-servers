# VS Code Setup Guide

Complete setup guide for using the Context Optimizer MCP Server with VS Code and GitHub Copilot.

## Prerequisites
- VS Code 1.102+ (June 2025 or later)
- GitHub Copilot extension installed
- Context Optimizer MCP Server: `npm install -g context-optimizer-mcp-server`

## Setup Steps

### 1. Install the MCP Server

```bash
npm install -g context-optimizer-mcp-server
```

This installs the `context-optimizer-mcp` command globally.

### 2. Set Environment Variables

**Windows (PowerShell - Persistent):**
```powershell
[Environment]::SetEnvironmentVariable("CONTEXT_OPT_LLM_PROVIDER", "gemini", "User")
[Environment]::SetEnvironmentVariable("CONTEXT_OPT_GEMINI_KEY", "your-gemini-key", "User")
[Environment]::SetEnvironmentVariable("CONTEXT_OPT_EXA_KEY", "your-exa-key", "User")
[Environment]::SetEnvironmentVariable("CONTEXT_OPT_ALLOWED_PATHS", "C:\Users\username\repos", "User")
```

**macOS/Linux (Shell Profile):**
```bash
# Add to ~/.zshrc, ~/.bashrc, or ~/.profile
export CONTEXT_OPT_LLM_PROVIDER="gemini"
export CONTEXT_OPT_GEMINI_KEY="your-gemini-key"
export CONTEXT_OPT_EXA_KEY="your-exa-key" 
export CONTEXT_OPT_ALLOWED_PATHS="/Users/username/repos"

# Reload shell
source ~/.zshrc
```

### 3. Enable MCP in VS Code

Add to your VS Code `settings.json`:
```json
{
  "chat.agent.enabled": true,
  "chat.mcp.enabled": true
}
```

### 4. Configure the MCP Server

Choose one approach:

#### Option A: Global Configuration (Recommended)

1. Open Command Palette (`Ctrl+Shift+P`)
2. Run: `MCP: Open User Configuration`
3. Add to the global mcp.json file:

```json
{
  "servers": {
    "context-optimizer": {
      "type": "stdio",
      "command": "context-optimizer-mcp"
    }
  }
}
```

#### Option B: Workspace Configuration

Create `.vscode/mcp.json` in your project:
```json
{
  "servers": {
    "context-optimizer": {
      "type": "stdio",
      "command": "context-optimizer-mcp"
    }
  }
}
```

### 5. Use with GitHub Copilot

1. **Restart VS Code**
2. **Open Copilot Chat** (Ctrl + Alt + I)
3. **Switch to Agent mode** and click tools 🔧 icon
4. **Enable context-optimizer tools**
5. **Test with prompts**:
   - `@copilot Can you analyze the package.json file?`
   - `@copilot Run 'npm list' and summarize the packages`
   - `@copilot Research TypeScript best practices`

## Available Tools

- **askAboutFile**: Extract specific information from files
- **runAndExtract**: Execute terminal commands with LLM analysis
- **askFollowUp**: Continue conversations about previous executions
- **researchTopic**: Quick web research using Exa.ai
- **deepResearch**: Comprehensive analysis using Exa.ai

## Troubleshooting

- **Tools Not Available**: Verify VS Code version 1.102+ and restart after configuration changes
- **API Key Issues**: Make sure environment variables are set system-wide (not just in terminal)
- **Command Errors**: Verify `context-optimizer-mcp` command works in terminal
- **Global vs Workspace Config**: 
  - **Global**: Use `MCP: Open User Configuration` command (applies to all VS Code workspaces)
  - **Workspace**: Use `.vscode/mcp.json` in your project (applies only to that workspace)
- **MCP Server Discovery**: Use `MCP: Show Installed Servers` command to verify server registration

## Configuration Benefits

### Global Configuration (Recommended)
- ✅ **System-wide availability**: Works across all VS Code workspaces
- ✅ **Settings sync**: Syncs across devices with VS Code Settings Sync
- ✅ **Simple management**: One configuration for all projects
- ✅ **NPM global package**: Uses globally installed `context-optimizer-mcp` command
- ❌ **Less flexible**: Same configuration for all projects

### Workspace Configuration  
- ✅ **Project-specific**: Customizable per project
- ✅ **Team sharing**: Can be committed to version control
- ✅ **Isolated**: Doesn't affect other projects
- ❌ **Per-project setup**: Must configure for each workspace

## Next Steps

- See `usage.md` for complete configuration details
- Check `troubleshooting.md` for common issues
- Review `../reference/api-keys.md` for API key management
- See `../tools.md` for detailed tool documentation
