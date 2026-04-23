# time-mcp

A Claude Model Configuration Protocol (MCP) server that provides real-time timezone-aware date and time information.

## Features

- Get current time in any IANA timezone
- Easy integration with Claude AI through MCP
- Comprehensive timezone support using Python's zoneinfo module
- Simple JSON responses in ISO format

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/time-mcp.git
cd time-mcp

# Set up virtual environment (using uv)
uv venv
source .venv/bin/activate

# Install the package
pip install -e .
```

## Usage

### Running the Server

```bash
python -m src.time_mcp.server
```

This starts the MCP server locally, making the time tool available to Claude.

### Available Tools

- `get_current_time`: Returns the current time in the specified timezone
  - Parameter: `timezone` (string) - Any valid IANA timezone (e.g., "America/New_York", "Europe/London", "Asia/Tokyo")
  - Default: "UTC" if no timezone is specified

## Development

```bash
# Run tests
pytest tests/

# Lint code
ruff check .

# Format code
ruff format .
```

## Requirements

- Python 3.10+
- MCP library

## License

MIT