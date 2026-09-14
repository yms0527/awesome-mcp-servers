# API Key Configuration Guide

The Context Optimizer MCP Server uses **environment variables exclusively** for API key management and configuration. This approach provides the best security, simplicity, and flexibility for all deployment scenarios.

## 🔒 Environment Variable Configuration

All API keys and configuration settings are provided through environment variables. This ensures:

- **Security**: No secrets stored in files or configuration
- **Simplicity**: One configuration method for all scenarios  
- **Flexibility**: Easy to configure in any environment
- **Best Practices**: Follows 12-factor app principles

## Required Environment Variables

### **LLM Provider Configuration**
You must set one of these based on your chosen provider:

```bash
# Choose your LLM provider
export CONTEXT_OPT_LLM_PROVIDER="gemini"        # Options: "gemini", "claude", "openai"

# Set the corresponding API key
export CONTEXT_OPT_GEMINI_KEY="your-gemini-api-key"    # Required if CONTEXT_OPT_LLM_PROVIDER=gemini
export CONTEXT_OPT_CLAUDE_KEY="your-claude-api-key"    # Required if CONTEXT_OPT_LLM_PROVIDER=claude  
export CONTEXT_OPT_OPENAI_KEY="your-openai-api-key"    # Required if CONTEXT_OPT_LLM_PROVIDER=openai
```

### **Security Configuration**
```bash
# Required: Allowed file system paths (comma-separated)
export CONTEXT_OPT_ALLOWED_PATHS="/home/user/repos,/home/user/projects"
```

### **Research Tools (Optional)**
```bash
# Required for researchTopic and deepResearch tools
export CONTEXT_OPT_EXA_KEY="your-exa-api-key"
```

## Optional Environment Variables

### **Advanced LLM Settings**
```bash
export CONTEXT_OPT_LLM_MODEL="gemini-2.0-flash-exp"     # Override default model
```

### **Security Settings**
```bash
export CONTEXT_OPT_MAX_FILE_SIZE="1048576"              # Max file size (bytes, default: 1MB)
export CONTEXT_OPT_COMMAND_TIMEOUT="30000"              # Command timeout (ms, default: 30s) 
export CONTEXT_OPT_SESSION_TIMEOUT="1800000"            # Session timeout (ms, default: 30min)
```

### **Server Settings**
```bash
export CONTEXT_OPT_SESSION_PATH="/tmp/sessions"         # Custom session storage
export CONTEXT_OPT_LOG_LEVEL="info"                     # Logging: error, warn, info, debug
```

## Setting Environment Variables

### **Windows**

#### PowerShell (Session Only)
```powershell
$env:CONTEXT_OPT_LLM_PROVIDER="gemini"
$env:CONTEXT_OPT_GEMINI_KEY="your-gemini-key"
$env:CONTEXT_OPT_ALLOWED_PATHS="C:\Users\username\repos"
```

#### Command Prompt (Session Only)  
```cmd
set CONTEXT_OPT_LLM_PROVIDER=gemini
set CONTEXT_OPT_GEMINI_KEY=your-gemini-key
set CONTEXT_OPT_ALLOWED_PATHS=C:\Users\username\repos
```

#### System Environment Variables (Persistent)
```powershell
# Run as Administrator or use User Environment
[Environment]::SetEnvironmentVariable("CONTEXT_OPT_LLM_PROVIDER", "gemini", "User")
[Environment]::SetEnvironmentVariable("CONTEXT_OPT_GEMINI_KEY", "your-key", "User") 
[Environment]::SetEnvironmentVariable("CONTEXT_OPT_ALLOWED_PATHS", "C:\Users\username\repos", "User")
```

### **macOS/Linux**

#### Shell Session (Session Only)
```bash
export CONTEXT_OPT_LLM_PROVIDER="gemini"
export CONTEXT_OPT_GEMINI_KEY="your-gemini-key" 
export CONTEXT_OPT_ALLOWED_PATHS="/home/user/repos,/home/user/projects"
```

#### Persistent Configuration
Add to `~/.bashrc`, `~/.zshrc`, or `~/.profile`:
```bash
export CONTEXT_OPT_LLM_PROVIDER="gemini"
export CONTEXT_OPT_GEMINI_KEY="your-gemini-key"
export CONTEXT_OPT_EXA_KEY="your-exa-key"
export CONTEXT_OPT_ALLOWED_PATHS="/home/user/repos,/home/user/projects"
```

### **Docker/Containers**
```dockerfile
ENV CONTEXT_OPT_LLM_PROVIDER=gemini
ENV CONTEXT_OPT_GEMINI_KEY=your-key
ENV CONTEXT_OPT_ALLOWED_PATHS=/app/workspace
```

Or with docker run:
```bash
docker run -e CONTEXT_OPT_LLM_PROVIDER=gemini -e CONTEXT_OPT_GEMINI_KEY=your-key app-name
```

## 🛡️ Security Best Practices

### Development
- ✅ Use environment variables for all secrets
- ✅ Never commit API keys to version control
- ✅ Use different keys for development and production
- ✅ Rotate keys regularly

### Production
- ✅ Use environment variables exclusively
- ✅ Use secrets management systems (AWS Secrets Manager, Azure Key Vault, etc.)
- ✅ Validate key presence at startup
- ✅ Monitor for API key usage and rate limits
- ❌ Never store keys in files or configuration

### CI/CD
- ✅ Use encrypted environment variables or secrets
- ✅ Separate keys for different environments
- ✅ Validate tests with real keys when needed
- ❌ Never log API key values

## 🧪 Testing

### Without API Keys
```bash
npm test  # Skips LLM integration tests
```

### With API Keys
```bash
# Set environment variables
export CONTEXT_OPT_GEMINI_KEY="your-key"
export CONTEXT_OPT_EXA_KEY="your-exa-key"

npm test  # Runs all tests including LLM integration
```

## 🚀 Quick Start Examples

### Local Development
```bash
# 1. Set required environment variables
export CONTEXT_OPT_LLM_PROVIDER="gemini"
export CONTEXT_OPT_GEMINI_KEY="your-gemini-key"
export CONTEXT_OPT_ALLOWED_PATHS="/home/user/repos"

# 2. Optional: Set additional variables
export CONTEXT_OPT_EXA_KEY="your-exa-key"
export CONTEXT_OPT_LOG_LEVEL="debug"

# 3. Start server
npm start
```

### Production Deployment
```bash
# Set production environment variables
export CONTEXT_OPT_LLM_PROVIDER="gemini"
export CONTEXT_OPT_GEMINI_KEY="your-production-key"
export CONTEXT_OPT_EXA_KEY="your-production-exa-key"
export CONTEXT_OPT_ALLOWED_PATHS="/app/workspace,/app/repos"
export CONTEXT_OPT_LOG_LEVEL="error"

# Start server
npm start
```

### VS Code Integration
Update your VS Code `mcp.json`:
```json
{
  "servers": {
    "context-optimizer": {
      "type": "stdio",
      "command": "node",
      "args": ["path/to/dist/server.js"],
      "env": {
        "CONTEXT_OPT_LLM_PROVIDER": "gemini",
        "CONTEXT_OPT_ALLOWED_PATHS": "C:\\Users\\username\\repos",
        "CONTEXT_OPT_LOG_LEVEL": "error"
      }
    }
  }
}
```
*Note: API keys should be set in your system environment, not in the VS Code config.*

## ❓ Troubleshooting

### Common Issues

**"CONTEXT_OPT_LLM_PROVIDER environment variable is required":**
- Set `export CONTEXT_OPT_LLM_PROVIDER="gemini"` (or "claude", "openai")

**"API key not configured for provider":**
- Ensure you've set the API key for your chosen provider:
  - `CONTEXT_OPT_GEMINI_KEY` for gemini
  - `CONTEXT_OPT_CLAUDE_KEY` for claude  
  - `CONTEXT_OPT_OPENAI_KEY` for openai

**"CONTEXT_OPT_ALLOWED_PATHS environment variable is required":**
- Set allowed directories: `export CONTEXT_OPT_ALLOWED_PATHS="/path1,/path2"`

### Debug Configuration Loading

Set log level to debug to see configuration loading details:
```bash
export CONTEXT_OPT_LOG_LEVEL="debug"
npm start
```

This will show:
- Environment variables being loaded
- Security path validation
- Final configuration summary (API keys are masked)
- Any configuration errors or warnings
