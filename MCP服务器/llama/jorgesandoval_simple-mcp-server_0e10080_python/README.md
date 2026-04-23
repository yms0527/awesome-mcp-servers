# Anthropic Model Context Protocol (MCP) Server with Ollama Integration

A hybrid architecture combining an Anthropic-compatible Model Context Protocol (MCP) server with Ollama/Gemma LLMs for inference. This implementation follows the official [Model Context Protocol specification](https://modelcontextprotocol.io/) while using open-source models.

## Overview

This project implements an Anthropic-compatible MCP server following the official MCP specification, along with middleware that handles communication between clients and Ollama's Gemma model.

### Architecture

```
┌───────────┐     ┌──────────────┐     ┌────────────────────────┐
│  Client   │────▶│   Middleware │────▶│  Anthropic MCP Server  │
│           │◀────│              │◀────│  (Claude MCP Protocol) │
└───────────┘     └──────┬───────┘     └────────────────────────┘
                         │                          │
                         │                          │
                         ▼                          ▼
                  ┌─────────────┐         ┌────────────────────┐
                  │    Ollama   │         │   SQLite Database  │
                  │ (Gemma3:4b) │         │  (Context Storage) │
                  └─────────────┘         └────────────────────┘
```

## Components

- **MCP Server**: Implements the Anthropic MCP protocol on port 3000
- **Middleware**: Handles communication between clients and Ollama
- **Ollama**: Runs the Gemma3:4b model for inference
- **Database**: SQLite database for storing conversation contexts

## Features

- **MCP Protocol Features**:
  - Tools: For context management
  - Resources: Expose conversation history
  - Prompts: Standard prompt templates

- **Model Support**:
  - Use with Claude models via Claude Desktop or other MCP clients
  - Compatible with any client supporting the Model Context Protocol

## MCP Protocol Compliance

This implementation strictly adheres to the official Model Context Protocol (MCP) specification published by Anthropic:

1. **JSON-RPC 2.0 Protocol**: Uses the standard JSON-RPC 2.0 format for all communication, ensuring compatibility with other MCP clients and servers.

2. **Protocol Initialization**: Correctly implements the `/initialize` endpoint with proper protocol version negotiation (2024-03-26) and client capability declarations.

3. **Tool Interface**: Fully implements the tool calling protocol with all required annotations:
   - `readOnlyHint`: Indicates whether tools modify state
   - `destructiveHint`: Flags potentially destructive operations
   - `idempotentHint`: Marks operations that can be safely retried

4. **Resource Management**: Implements the resource protocol for exposing conversation history with proper URIs and MIME types.

5. **Prompt Templates**: Provides standard prompt templates following the MCP specification for common operations.

6. **Error Handling**: Implements proper error responses with standardized error codes and messages as specified in the protocol.

7. **Security**: Follows the security recommendations in the MCP specification regarding authentication and authorization.

8. **Versioning**: Properly handles protocol versioning to ensure forward compatibility.

Our implementation is designed to be fully compatible with any MCP client, including Claude Desktop, VS Code extensions, and other tools that adhere to the official specification.

## API Endpoints

### MCP Server (port 3000)
The MCP Server implements the official MCP protocol endpoints:
- Tools: `/tools/list`, `/tools/call`
- Resources: `/resources/list`, `/resources/read`
- Prompts: `/prompts/list`, `/prompts/get`
- Core: `/initialize`

### Middleware (port 8080)
- `POST /infer`: Send user messages to Ollama/Gemma while storing context in the MCP server
- `GET /health`: Check the health of the middleware and its connections

## Requirements

- Python 3.10+
- Docker and Docker Compose
- Ollama with Gemma3:4b model installed

## Installation

### Using setup script

```bash
chmod +x setup.sh
./setup.sh
```

The setup script will:
1. Check for Docker installation
2. Check for Ollama installation and pull the Gemma model if needed
3. Build and start the Docker containers

### Manual setup

```bash
# Clone the repository
git clone <repository-url>
cd simple-mcp-server

# Make sure Ollama is running with Gemma model
ollama pull gemma3:4b

# Build and run with Docker
docker-compose build
docker-compose up -d
```

## Usage Example

### Using the Middleware with Ollama/Gemma

You can interact with the system through the middleware, which will use Ollama/Gemma for inference while storing conversation context in the MCP server:

```bash
# Start a new conversation
curl -X POST http://localhost:8080/infer \
  -H "Content-Type: application/json" \
  -d '{"session_id": "user123", "content": "Hello, how are you today?"}'

# Continue the conversation with the same session ID
curl -X POST http://localhost:8080/infer \
  -H "Content-Type: application/json" \
  -d '{"session_id": "user123", "content": "What's the capital of France?"}'
```

### Using the MCP Server Directly

The MCP server on port 3000 can be used with any MCP client, such as:
- Claude Desktop App
- VS Code GitHub Copilot
- Cursor
- And many other tools listed on the [MCP Clients page](https://modelcontextprotocol.io/clients)

## Docker Configuration

The project uses Docker to containerize two main components:
- **MCP Server Container**: Provides the Anthropic MCP protocol on port 3000
- **Middleware Container**: Connects to Ollama for Gemma model inference on port 8080

## Testing

To test your installation:

```bash
# Run the included test script
python test_system.py

# Or use the shell script
./test.sh
```

## License

This project is licensed under the MIT License - see the LICENSE file for details. 