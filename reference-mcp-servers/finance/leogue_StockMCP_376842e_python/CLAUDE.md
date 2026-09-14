# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StockMCP is a Model Context Protocol (MCP) server for stock market data using Yahoo Finance. The project implements a FastAPI-based HTTP server that provides JSON-RPC 2.0 endpoints for MCP communication.

## Architecture

The project follows a modular structure with separation of concerns:

### Key Components

**FastAPI Server** (`src/main.py`):
- Main FastAPI application with `/api/mcp` endpoint
- Health check endpoint at `/health`
- Clean, minimal server setup

**MCP Protocol Handlers** (`src/mcp_handlers.py`):
- `handle_initialize()`: MCP initialization with capabilities
- `handle_tools_list()`: Returns available tools
- `handle_tools_call()`: Executes tool calls with validation
- `handle_mcp_request()`: Main request router with error handling

**Pydantic Models** (`src/models.py`):
- JSON-RPC 2.0 request/response models
- MCP protocol data structures
- Stock quote data model with comprehensive financial fields
- Full type validation and serialization

**Tools Implementation** (`src/tools.py`):
- `get_realtime_quote()`: Fetches real-time stock data via yfinance
- `execute_tool()`: Tool execution dispatcher
- `get_available_tools()`: Tool registry with schema definitions

## Development Commands

**Install dependencies:**
```bash
uv sync
```

**Run the server:**
```bash
python src/main.py
# Server runs on http://0.0.0.0:3001
```

**Run via project scripts:**
```bash
# Main JSON-RPC server
stockmcp

# HTTP server variant
stockmcp-http

# Other server variants
stockmcp-jsonrpc
stockmcp-proxy
stockmcp-native
```

## Project Structure

```
StockMCP/
├── pyproject.toml          # Project configuration and dependencies  
├── uv.lock                 # Dependency lock file
└── src/
    ├── __init__.py         # Package initialization
    ├── main.py             # FastAPI server and endpoints
    ├── models.py           # Pydantic models for MCP and stock data
    ├── mcp_handlers.py     # MCP protocol request handlers
    └── tools.py            # Stock market tools implementation
```

## Dependencies

The project uses modern Python tooling:
- **uv**: Package manager and dependency resolution
- **FastAPI**: Web framework for HTTP API
- **MCP**: Model Context Protocol implementation
- **yfinance**: Yahoo Finance API client (configured but not yet used)
- **pydantic**: Data validation and serialization

## Available Tools

**get_realtime_quote**: Fetch real-time stock quotes and financial data
- Input: `symbol` (string) - Stock ticker symbol (e.g., 'AAPL', 'GOOGL')  
- Returns: JSON with price, change, volume, market cap, P/E ratio, dividend yield, 52-week range
- Uses yfinance for data retrieval with proper error handling

## Development Notes

- Modular architecture with clear separation of concerns
- Full Pydantic validation for type safety and data integrity
- Comprehensive error handling for invalid requests and API failures
- Stock market tools implemented using yfinance library
- JSON-RPC 2.0 compliant with proper MCP protocol implementation