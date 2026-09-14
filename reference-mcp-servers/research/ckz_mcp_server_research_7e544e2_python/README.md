# MCP Server Research Project

This project contains research and demos related to MCP (Message Coordination Protocol) server implementation.

## Overview

The Message Coordination Protocol (MCP) provides a standardized way for distributed systems to communicate and coordinate actions. This repository includes a reference implementation and demonstrations of the protocol in action.

## Project Structure

```
mcp_server_research/
├── docs/          # Documentation files
├── src/           # Source code
│   └── demo/      # Demo implementations
└── requirements.txt
```

## Getting Started

### Prerequisites

- Python 3.8+
- Flask
- Requests

### Installation

```bash
# Clone the repository
git clone https://github.com/ckz/mcp_server_research.git
cd mcp_server_research

# Set up virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Running the Demo

To run the MCP server with default settings:

```bash
cd src/demo
python simple_mcp_server.py
```

To run with custom settings using environment variables:

```bash
cd src/demo
DEBUG=true PORT=5001 python simple_mcp_server.py
```

Then visit http://localhost:5001 (or the custom port you specified) to view the dashboard.

To run a client demo in a separate terminal:

```bash
cd src/demo
python client_demo.py --server http://localhost:5001 --duration 30 --interval 2
```

You should see the server accepting connections and the client successfully sending messages.

## Demo Features

The simple MCP server demo implements a basic message coordination protocol server that:

- Registers and tracks connected clients
- Processes various message types (heartbeat, data, command)
- Routes messages to appropriate destinations
- Provides a web dashboard for monitoring system activity
- Maintains an in-memory message history

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Changelog

### 2024-02-24
- Added proper error handling to the client code for connection failures
- Using sessions in the client for better connection management
- Added CORS support to the server for cross-origin requests
- Implemented timeouts for API calls to prevent hanging
- Made debug mode configurable through environment variables
- Fixed dependency issues by adding flask-cors and specifying werkzeug version
- Improved documentation in code comments