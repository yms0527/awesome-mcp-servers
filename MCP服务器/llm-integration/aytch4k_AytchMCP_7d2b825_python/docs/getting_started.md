# Getting Started with AytchMCP

---
tags: [setup, introduction, quickstart]
---

## Introduction

AytchMCP is a Model Context Protocol (MCP) server implementation for Aytch4K applications. It provides an interface for Large Language Models (LLMs) to interact with Aytch4K applications.

## Installation

### Using Docker

The easiest way to get started with AytchMCP is to use Docker:

```bash
# Clone the repository
git clone https://github.com/Aytch4K/AytchMCP.git
cd AytchMCP

# Build and run the MCP server
docker-compose up -d
```

### Manual Installation

If you prefer to install AytchMCP manually:

```bash
# Clone the repository
git clone https://github.com/Aytch4K/AytchMCP.git
cd AytchMCP

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install the package in development mode
pip install -e .

# Run the server
python -m aytchmcp.server
```

## Configuration

AytchMCP is configured using JSON files in the `config` directory:

- `config.json`: Main configuration file
- `branding.json`: Branding configuration
- `llm.json`: LLM integration configuration
- `server.json`: Server configuration

You can also use environment variables to override configuration values:

- `MCP_HOST`: Host to bind the server to
- `MCP_PORT`: Port to bind the server to
- `LOG_LEVEL`: Logging level
- `DEBUG`: Enable debug mode

### LLM Configuration

AytchMCP supports multiple LLM providers. Configure your API keys using environment variables:

#### OpenAI
- `OPENAI_API_KEY`: OpenAI API key

#### Anthropic
- `ANTHROPIC_API_KEY`: Anthropic API key

#### OpenRouter.ai
- `OPENROUTER_API_KEY`: OpenRouter API key
- `OPENROUTER_MODEL`: Model ID to use (e.g., `openai/gpt-4-turbo`, `anthropic/claude-3-opus`, `meta-llama/llama-3-70b-instruct`)

#### NinjaChat.ai
- `NINJACHAT_API_KEY`: NinjaChat API key
- `NINJACHAT_MODEL`: Model ID to use

You can select the LLM provider in the `config/llm.json` file:

```json
{
  "provider": "openai",  // Options: "openai", "anthropic", "openrouter", "ninjachat"
  "model": "gpt-4",
  "api_key_env_var": "OPENAI_API_KEY"
  // other configuration options...
}
```

## Usage

### Command-Line Interface

AytchMCP provides a command-line interface for managing the server:

```bash
# Start the server
aytchmcp start

# Initialize a new configuration
aytchmcp init --dir ./my-config

# List available resources
aytchmcp list-resources

# List available tools
aytchmcp list-tools

# Show version information
aytchmcp version
```

### API

The MCP server exposes a REST API at `/.well-known/mcp` that follows the Model Context Protocol specification.

### Health Check

You can check if the server is running by accessing the health check endpoint:

```bash
curl http://localhost:8000/health
```

## Next Steps

- [Customizing Resources](./resources.md)
- [Creating Custom Tools](./tools.md)
- [Using Prompt Templates](./prompts.md)
- [Working with Images](./images.md)