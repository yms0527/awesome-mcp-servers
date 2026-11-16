# Aider MCP WebSocket Server

## Quick Start

This is a **real MCP (Model Context Protocol) server** that lets you control Aider programmatically via WebSocket. It's like having Aider as an API.

```bash
# 1. Install
npm install
cp .env.example .env
# Add your OPENAI_API_KEY=sk-... to .env

# 2. Run the MCP server (recommended)
npm run mcp

# 3. Test it
python3 test-debug.py
```

**What you get**: Send natural language commands to Aider, get back created/edited files and full responses. Each client gets isolated workspaces. Works with any MCP-compatible client (Claude Desktop, custom apps, etc.).


## Overview

A production-ready MCP (Model Context Protocol) wrapper that exposes Aider's functionality over WebSocket, enabling editor plugins and services to interact with Aider programmatically. This project provides **two server implementations**:

1. **`src/mcp-server.ts`** - **Real MCP Protocol Server** (Recommended)
   - Implements standard JSON-RPC 2.0 MCP protocol  
   - Proper MCP methods: `initialize`, `tools/list`, `tools/call`
   - Smart completion detection (waits for Aider to finish)
   - Compatible with Claude Desktop and other MCP clients

2. **`src/index.ts`** - Custom WebSocket Wrapper
   - Custom protocol with hello/welcome handshake
   - Direct stdio pipe to Aider process
   - Token-based authentication

## Architecture

```
┌─────────────────┐         JSON-RPC 2.0        ┌─────────────────┐
│   MCP Client    │ ◄─────────────────────────► │   MCP Server    │
│  (Any MCP app)  │         WebSocket           │  (mcp-server.ts)│
└─────────────────┘                             └────────┬────────┘
                                                         │
                                                         │ spawn()
                                                         ▼
                                                ┌─────────────────┐
                                                │  Aider Process  │
                                                │  (CLI instance) │
                                                └─────────────────┘
```

## Features

- **Full MCP Protocol Support**: Standard MCP methods and JSON-RPC 2.0
- **Multi-tenant Isolation**: One Aider child process per client
- **Automatic Completion Detection**: Waits for Aider to complete tasks
- **Isolated Workspaces**: Each session gets its own workspace directory
- **OpenAI API Integration**: Works with your existing OpenAI API key
- **Real-time Communication**: WebSocket-based bidirectional communication
- **Flexible Configuration**: Environment variables and CLI arguments
- **Structured Logging**: JSON logging with Pino

## Installation

```bash
# Clone and install
git clone <repo-url>
cd aider_mcp
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your OpenAI API key:
# OPENAI_API_KEY=sk-...
```

## Prerequisites

- Node.js 18+
- [Aider](https://aider.chat) installed and available in PATH
- OpenAI API key

## Usage

### Running the Servers

```bash
# Run MCP protocol server (recommended)
npm run mcp

# Run custom WebSocket wrapper
npm run dev

# Production build
npm run build && npm start
```

### Testing

```bash
# Quick test of MCP server
python3 test-debug.py

# Full test with waiting
python3 test-mcp-wait.py

# JavaScript test client
node test-mcp-client.js
```

## MCP Protocol Communication

### Available Tools

The MCP server exposes these tools to clients:

1. **`aider_command`** - Execute natural language commands
   ```json
   {
     "name": "aider_command",
     "arguments": {
       "command": "create a REST API with Flask"
     }
   }
   ```

2. **`aider_add_file`** - Add files to Aider's context
   ```json
   {
     "name": "aider_add_file", 
     "arguments": {
       "filename": "app.py"
     }
   }
   ```

3. **`aider_run_command`** - Run shell commands through Aider
   ```json
   {
     "name": "aider_run_command",
     "arguments": {
       "command": "npm test"
     }
   }
   ```

### Connection Flow

```javascript
// 1. Connect via WebSocket
const ws = new WebSocket('ws://localhost:8080');

// 2. Initialize MCP session
ws.send(JSON.stringify({
  "jsonrpc": "2.0",
  "method": "initialize",
  "params": {
    "protocolVersion": "0.1.0",
    "capabilities": {},
    "clientInfo": {
      "name": "your-client",
      "version": "1.0.0"
    }
  },
  "id": 1
}));

// 3. Call tools after initialization
ws.send(JSON.stringify({
  "jsonrpc": "2.0", 
  "method": "tools/call",
  "params": {
    "name": "aider_command",
    "arguments": {
      "command": "create a Python hello world script"
    }
  },
  "id": 2
}));
```

## Configuration

### Environment Variables

```env
# Required
OPENAI_API_KEY=sk-...        # Your OpenAI API key

# Optional
PORT=8080                    # WebSocket server port (MCP server default)
PORT=7011                    # WebSocket server port (custom wrapper default)
AIDER_MODEL=gpt-4o-mini     # Default model
WORKSPACES_DIR=./workspaces # Where to create project directories
LOG_LEVEL=info              # Logging verbosity (debug|info|warn|error)
VALID_TOKENS=token1,token2  # Auth tokens for custom wrapper (empty = no auth)
```

### CLI Arguments

Override configuration at runtime:

```bash
# Custom port and workspace
npm run mcp -- --port 9000
npm run dev -- --port 8080 --workspaces ./custom-workspaces

# Override environment variables (custom wrapper only)
npm run dev -- --set AIDER_MODEL=gpt-4 --set LOG_LEVEL=debug
```

## Integration Examples

### Claude Desktop App

Add to Claude Desktop config:

```json
{
  "mcpServers": {
    "aider": {
      "command": "node",
      "args": ["/path/to/aider_mcp/dist/mcp-server.js"],
      "env": {
        "OPENAI_API_KEY": "your-key",
        "AIDER_MODEL": "gpt-4o-mini"
      }
    }
  }
}
```

### Custom MCP Client

```javascript
import { WebSocket } from 'ws';

class AiderMCPClient {
  constructor(url = 'ws://localhost:8080') {
    this.ws = new WebSocket(url);
    this.requestId = 1;
    this.setup();
  }

  async callTool(toolName, args) {
    return this.sendRequest('tools/call', {
      name: toolName,
      arguments: args
    });
  }

  sendRequest(method, params) {
    const id = this.requestId++;
    this.ws.send(JSON.stringify({
      jsonrpc: '2.0',
      method,
      params,
      id
    }));
  }
}
```

## Project Structure

```
aider_mcp/
├── src/
│   ├── index.ts              # Custom WebSocket wrapper
│   └── mcp-server.ts         # Real MCP protocol server
├── workspaces/               # Auto-generated client workspaces  
├── test-*.py/js              # Various test clients
├── package.json              # Node.js dependencies
├── tsconfig.json             # TypeScript configuration
├── .env                      # Environment configuration
└── README.md                 # This file
```

## Scripts

- `npm run mcp` - Start MCP protocol server (recommended)
- `npm run dev` - Start custom WebSocket wrapper with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Troubleshooting

### Common Issues

1. **"ConnectionRefusedError" or "Connect call failed"**
   - Server isn't running. Start it with `npm run mcp`
   - Wrong port. Check `.env` file (MCP default: 8080, Custom default: 7011)

2. **"Aider not found"**
   ```bash
   # Install Aider
   pip install aider-chat
   
   # Verify installation
   which aider
   ```

3. **"No API key" or Aider errors**
   - Add your OpenAI API key to `.env`:
   ```
   OPENAI_API_KEY=sk-proj-...
   ```

4. **Server returns too quickly / incomplete responses**
   - Fixed in MCP server - waits for Aider to complete (3-second silence detection)

5. **"Tool execution timeout"**
   - Normal for complex tasks
   - The MCP server waits as long as needed

### Debug Mode

```bash
# Run with debug logging
LOG_LEVEL=debug npm run mcp
```

### Checking Results

Files created by Aider are stored in workspace directories:

```bash
# List all workspaces
ls -la workspaces/

# Check latest workspace  
ls -la workspaces/mcp-*/

# View created files
cat workspaces/mcp-*/your-file.py
```

## Security Considerations

- **Isolated Workspaces**: Each client session gets its own directory
- **Authentication**: Custom wrapper supports token-based auth via `VALID_TOKENS`
- **Git Disabled**: Runs with `--no-git` by default for safety
- **API Key Security**: Never commit `.env` file
- **Production**: Consider running in Docker for additional isolation

## Performance Notes

- First request to Aider may take longer (model loading)
- Subsequent requests are faster
- The server maintains one Aider process per session
- Workspace cleanup is manual (delete old directories as needed)

## License

MIT