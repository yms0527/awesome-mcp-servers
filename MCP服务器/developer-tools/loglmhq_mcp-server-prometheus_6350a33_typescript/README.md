# mcp-server-prometheus

MCP server for interacting with Prometheus metrics and data.

This is a TypeScript-based MCP server that implements a Prometheus API interface. It provides a bridge between Claude and your Prometheus server through the Model Context Protocol (MCP).

<a href="https://glama.ai/mcp/servers/y7b3qba8jy"><img width="380" height="200" src="https://glama.ai/mcp/servers/y7b3qba8jy/badge" alt="mcp-server-prometheus MCP server" /></a>

## Demo

![demo](/demo.png)

## Features

### Resources

- List and access Prometheus metric schema
- Each metric resource provides:
  - Metric name and description
  - Detailed metadata from Prometheus
  - Statistical information (count, min, max)
- JSON mime type for structured data access

### Current Capabilities

- List all available Prometheus metrics with descriptions
- Read detailed metric information including:
  - Metadata and help text
  - Current statistical data (count, min, max values)
- Basic authentication support for secured Prometheus instances

## Configuration

The server requires the following environment variable:

- `PROMETHEUS_URL`: The base URL of your Prometheus instance

Optional authentication configuration:

- `PROMETHEUS_USERNAME`: Username for basic auth (if required)
- `PROMETHEUS_PASSWORD`: Password for basic auth (if required)

## Development

Install dependencies:

```bash
npm install
```

Build the server:

```bash
npm run build
```

For development with auto-rebuild:

```bash
npm run watch
```

## Installation

To use with Claude Desktop, add the server config:

On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "mcp-server-prometheus": {
      "command": "/path/to/mcp-server-prometheus/build/index.js",
      "env": {
        "PROMETHEUS_URL": "http://your-prometheus-instance:9090"
      }
    }
  }
}
```

### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector):

```bash
npm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser.

## API Structure

The server exposes Prometheus metrics through the following URI structure:

- Base URI: `http://your-prometheus-instance:9090`
- Metric URIs: `http://your-prometheus-instance:9090/metrics/{metric_name}`

Each metric resource returns JSON data containing:

- Metric name
- Metadata (help text, type)
- Current statistics (count, min, max)
