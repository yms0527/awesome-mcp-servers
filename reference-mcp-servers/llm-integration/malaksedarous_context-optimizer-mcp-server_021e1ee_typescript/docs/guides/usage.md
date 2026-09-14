# Usage Guide

Guide for installing, configuring, and using the Context Optimizer MCP Server with different AI assistants.

## Installation

### Global Installation (Recommended)

```bash
npm install -g context-optimizer-mcp-server
```

This installs the `context-optimizer-mcp` command globally, making it available system-wide for all AI assistants.

### From Source (Development)

```bash
git clone https://github.com/your-username/context-optimizer-mcp-server.git
cd context-optimizer-mcp-server
npm install
npm run build
```

## Environment Configuration

The MCP server uses **environment variables exclusively** for all configuration. Set these variables in your system environment before using the server.

### Environment Variables

```bash
# LLM Provider (required - choose one)
CONTEXT_OPT_LLM_PROVIDER="gemini"        # Options: "gemini", "claude", "openai"

# API Keys (required - set the one matching your provider)
CONTEXT_OPT_GEMINI_KEY="your-gemini-api-key"    # Required if using gemini
CONTEXT_OPT_CLAUDE_KEY="your-claude-api-key"    # Required if using claude  
CONTEXT_OPT_OPENAI_KEY="your-openai-api-key"    # Required if using openai

# Security (required)
CONTEXT_OPT_ALLOWED_PATHS="/path/to/your/projects"  # Comma-separated allowed directories

# Research Tools (optional)
CONTEXT_OPT_EXA_KEY="your-exa-api-key"           # For research tools (researchTopic, deepResearch)

# Advanced Settings (optional)
CONTEXT_OPT_LLM_MODEL="gemini-2.0-flash-exp"     # Override default model
CONTEXT_OPT_MAX_FILE_SIZE="1048576"              # Max file size in bytes (1MB default)
CONTEXT_OPT_COMMAND_TIMEOUT="30000"              # Command timeout in ms (30s default)
CONTEXT_OPT_SESSION_TIMEOUT="1800000"            # Session timeout in ms (30min default)
CONTEXT_OPT_SESSION_PATH="/tmp/mcp-sessions"     # Custom session storage
CONTEXT_OPT_LOG_LEVEL="warn"                     # Logging: error, warn, info, debug
```

## Setting Environment Variables by OS

### Windows

#### System Environment Variables (Persistent - Recommended)
```powershell
# Run PowerShell as Administrator or use User Environment Variables
[Environment]::SetEnvironmentVariable("CONTEXT_OPT_LLM_PROVIDER", "gemini", "User")
[Environment]::SetEnvironmentVariable("CONTEXT_OPT_GEMINI_KEY", "your-gemini-key", "User")
[Environment]::SetEnvironmentVariable("CONTEXT_OPT_ALLOWED_PATHS", "C:\Users\username\repos,C:\Users\username\projects", "User")
[Environment]::SetEnvironmentVariable("CONTEXT_OPT_EXA_KEY", "your-exa-key", "User")
```

#### GUI Method (Persistent)
1. Right-click "This PC" → Properties → Advanced System Settings
2. Click "Environment Variables"
3. Under "User variables", click "New"
4. Add each variable:
   - Variable name: `CONTEXT_OPT_LLM_PROVIDER`, Value: `gemini`
   - Variable name: `CONTEXT_OPT_GEMINI_KEY`, Value: `your-gemini-key`
   - Variable name: `CONTEXT_OPT_ALLOWED_PATHS`, Value: `C:\Users\username\repos,C:\Users\username\projects`
   - Variable name: `CONTEXT_OPT_EXA_KEY`, Value: `your-exa-key`

### macOS

#### Shell Profile (Persistent - Recommended)
Add to `~/.zshrc` (default shell) or `~/.bash_profile`:
```bash
export CONTEXT_OPT_LLM_PROVIDER="gemini"
export CONTEXT_OPT_GEMINI_KEY="your-gemini-key"
export CONTEXT_OPT_ALLOWED_PATHS="/Users/username/repos,/Users/username/projects"
export CONTEXT_OPT_EXA_KEY="your-exa-key"
```

Then reload your shell:
```bash
source ~/.zshrc
# or
source ~/.bash_profile
```

#### launchctl (System-wide)
```bash
launchctl setenv CONTEXT_OPT_LLM_PROVIDER "gemini"
launchctl setenv CONTEXT_OPT_GEMINI_KEY "your-gemini-key"
launchctl setenv CONTEXT_OPT_ALLOWED_PATHS "/Users/username/repos,/Users/username/projects"
launchctl setenv CONTEXT_OPT_EXA_KEY "your-exa-key"
```

### Linux

#### Shell Profile (Persistent - Recommended)
Add to `~/.bashrc`, `~/.zshrc`, or `~/.profile`:
```bash
export CONTEXT_OPT_LLM_PROVIDER="gemini"
export CONTEXT_OPT_GEMINI_KEY="your-gemini-key"
export CONTEXT_OPT_ALLOWED_PATHS="/home/username/repos,/home/username/projects"
export CONTEXT_OPT_EXA_KEY="your-exa-key"
```

Then reload:
```bash
source ~/.bashrc
```

#### System-wide (/etc/environment)
Edit `/etc/environment` as root:
```bash
CONTEXT_OPT_LLM_PROVIDER="gemini"
CONTEXT_OPT_GEMINI_KEY="your-gemini-key"
CONTEXT_OPT_ALLOWED_PATHS="/home/username/repos,/home/username/projects"
CONTEXT_OPT_EXA_KEY="your-exa-key"
```

## AI Assistant Setup

### VS Code with GitHub Copilot

**Requirements**: VS Code 1.102+ with GitHub Copilot extension

#### Configuration File Locations
- **Workspace scope**: `.vscode/mcp.json` in your project
- **User scope**: 
  - Windows: `%APPDATA%\Code\User\mcp.json`
  - macOS/Linux: `~/.config/Code/User/mcp.json`

#### Global Configuration (Recommended)
1. Open Command Palette (`Ctrl+Shift+P`)
2. Run: `MCP: Open User Configuration`
3. Add to the global mcp.json file:

```json
{
  "servers": {
    "context-optimizer": {
      "command": "context-optimizer-mcp"
    }
  }
}
```

#### Workspace Configuration
Create `.vscode/mcp.json` in your project:
```json
{
  "servers": {
    "context-optimizer": {
      "command": "context-optimizer-mcp"
    }
  }
}
```

#### Setup & Usage
1. Save the configuration file
2. Run `MCP: Start All Servers` from Command Palette
3. Verify with `MCP: Show Installed Servers`
4. Open Copilot Chat (`Ctrl+Alt+I`)
5. Click the tools 🔧 icon to enable MCP tools
6. Test with prompts like:
   - `Can you analyze the package.json file using askAboutFile?`
   - `Use runAndExtract to run 'npm list' and summarize packages`
   - `Research TypeScript best practices using researchTopic`

### Claude Desktop

**Requirements**: Claude Desktop app

#### Configuration File Location
Find your Claude Desktop config file:
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

#### Configuration
1. Open Claude Desktop
2. Go to: Claude → Settings… → Developer → Edit Config
3. Add the server configuration:

```json
{
  "mcpServers": {
    "context-optimizer": {
      "command": "context-optimizer-mcp"
    }
  }
}
```

#### Usage
1. Save the configuration file
2. Restart Claude Desktop
3. The tools will be automatically available - look for the hammer 🔨 icon
4. Test with prompts like:
   - `Can you analyze my package.json file?`
   - `Run 'npm list' and tell me about the installed packages`

### Cursor AI

**Requirements**: Cursor AI editor

#### Quick Setup (Alternative)
For a simplified setup, you can use the Cursor directory:

**🔗 [Add to Cursor](https://cursor.directory/mcp/context-optimizer)**

This provides an automated way to configure the MCP server in Cursor. You'll still need to:
1. Install the npm package globally: `npm install -g context-optimizer-mcp-server`
2. Set up your environment variables (see Environment Configuration section above)

#### Manual Configuration
**Configuration File Locations:**
- **Project scope**: `.cursor/mcp.json` in your project
- **Global scope**: `~/.cursor/mcp.json` in your home directory

Create the appropriate mcp.json file:

```json
{
  "mcpServers": {
    "context-optimizer": {
      "command": "context-optimizer-mcp"
    }
  }
}
```

#### Usage
1. Save the configuration file
2. Restart Cursor
3. Tools will be available in chat - enable/dismiss tools via the chat interface
4. Test with context-aware prompts

## Available Tools

### 1. File Analysis (`askAboutFile`)
Extract specific information from files without loading entire contents.

**Parameters:**
- `filePath`: Full absolute path to the file
- `question`: Specific question about the file content

**Example:**
```
askAboutFile("/Users/username/project/src/components/Header.tsx", "Does this file export a validateEmail function?")
```

### 2. Terminal Execution (`runAndExtract`)
Execute commands and intelligently extract relevant information.

**Parameters:**
- `terminalCommand`: Shell command to execute (non-interactive)
- `extractionPrompt`: Description of what information to extract
- `workingDirectory`: Full absolute path where command should be executed

**Example:**
```
runAndExtract("npm list --depth=0", "Summarize the installed packages", "/Users/username/project")
```

### 3. Follow-up Questions (`askFollowUp`)
Ask follow-up questions about previous terminal executions.

**Parameters:**
- `question`: Follow-up question about the previous terminal execution

**Example:**
```
askFollowUp("Were there any security vulnerabilities in those packages?")
```

### 4. Quick Research (`researchTopic`)
Conduct focused web research using Exa.ai's API.

**Parameters:**
- `topic`: The research topic or problem to investigate

**Example:**
```
researchTopic("How to implement JWT authentication in Node.js Express apps")
```

### 5. Deep Research (`deepResearch`)
Conduct comprehensive research for complex architectural planning.

**Parameters:**
- `topic`: Detailed research topic with requirements and considerations

**Example:**
```
deepResearch("Compare microservices vs monolithic architecture for a fintech startup, considering scalability, security, and team expertise")
```

## Testing Your Setup

### Quick Validation
```bash
# Test server startup
context-optimizer-mcp --version

# Verify environment variables
echo $CONTEXT_OPT_LLM_PROVIDER
echo $CONTEXT_OPT_ALLOWED_PATHS
```

### Integration Test
1. Configure your AI assistant
2. Ask: "Can you list files in my current directory?"

## Additional Documentation

For more detailed information, see:

- **Tool Reference**: `../tools.md` - Complete documentation for all tools with examples
- **Architecture Overview**: `../architecture.md` - System design and component overview
- **Troubleshooting**: `troubleshooting.md` - Common issues and solutions
- **API Key Management**: `../reference/api-keys.md` - Secure configuration practices
- **VS Code Setup**: `vs-code-setup.md` - Detailed VS Code configuration
