# ResearchMCP

A Model Completion Protocol (MCP) service for internet research using Perplexity AI.

## Overview

ResearchMCP is a service that provides internet research capabilities through the MCP protocol. It exposes a "research" tool that allows querying Perplexity AI's API for in-depth, up-to-date information on a wide range of topics.

## Features

- Internet research through Perplexity AI
- Integration with MCP protocol for tool discovery and invocation
- Graceful error handling with degraded mode
- Configurable through environment variables
- Structured logging

## Requirements

- Go 1.18 or later
- Perplexity AI API key

## Configuration

The service is configured through environment variables:

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|  
| PERPLEXITY_API_KEY | API key for Perplexity AI | Yes | - |
| PERPLEXITY_MODEL | Model to use for research | No | sonar-medium-online |
| PERPLEXITY_TIMEOUT | Timeout in seconds for API requests | No | 90 |
| PERPLEXITY_MAX_RETRIES | Maximum number of retry attempts | No | 2 |
| PERPLEXITY_INITIAL_BACKOFF | Initial backoff time in seconds | No | 1 |
| PERPLEXITY_MAX_BACKOFF | Maximum backoff time in seconds | No | 10 |

## Usage

1. Set up the required environment variables (you can use a `.env` file)
2. Build and run the service:

```bash
go build
./ResearchMCP
```

### Example .env file

```
PERPLEXITY_API_KEY=your_api_key_here
PERPLEXITY_MODEL=sonar-medium-online
PERPLEXITY_TIMEOUT=120
PERPLEXITY_MAX_RETRIES=3
PERPLEXITY_INITIAL_BACKOFF=2
PERPLEXITY_MAX_BACKOFF=15
```

## API

### Research Tool

**Name**: `research`

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "query": {
      "type": "string",
      "description": "The research query or question"
    }
  },
  "required": ["query"]
}
```

**Example Request**:
```json
{
  "name": "research",
  "arguments": {
    "query": "What is the current state of quantum computing?"
  }
}
```

**Example Response**:
```json
{
  "content": [
    {
      "type": "text",
      "text": "Comprehensive research report on quantum computing...\n\nSources:\n- https://example.com/source1\n- https://example.com/source2"
    }
  ]
}
```

## Development

### Project Structure

- `main.go`: Application entry point
- `config.go`: Configuration handling
- `logger.go`: Logging infrastructure
- `perplexity.go`: Perplexity API integration
- `structs.go`: Data structures
- `context.go`: Context handling

### Code Style

Run formatting and linting with the provided scripts:

```bash
./run_format.sh
./run_lint.sh
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.