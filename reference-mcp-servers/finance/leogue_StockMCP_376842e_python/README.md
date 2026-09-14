# 📈 StockMCP

> **A comprehensive Model Context Protocol (MCP) server for real-time stock market data using Yahoo Finance**

[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-100%20passed-brightgreen.svg)](#testing)

StockMCP provides a powerful, JSON-RPC 2.0 compliant interface for accessing comprehensive stock market data, built on the Model Context Protocol standard. Perfect for AI applications, financial analysis tools, and trading bots.

## 🌐 Free Hosted Endpoint

**Use StockMCP immediately without any setup!** We provide a free hosted endpoint at:
- **Endpoint**: `https://stockmcp.leoguerin.fr/mcp`
- **No API key required** - Just add to your MCP client configuration

### Claude Desktop Configuration

For immediate access, use this configuration in your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "stock-mcp": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://stockmcp.leoguerin.fr/mcp",
        "--header",
        "--allow-http"
      ]
    }
  }
}
```

Configuration file locations:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\\Claude\\claude_desktop_config.json`

## 🛠️ Available Tools

| Tool Name | Description |
|-----------|-------------|
| `get_realtime_quote` | Retrieve current market data including price, volume, market cap, and key financial ratios |
| `get_fundamentals` | Access comprehensive financial statements (income, balance sheet, cash flow) and calculated ratios |
| `get_price_history` | Get historical OHLCV data with optional total return calculation including reinvested dividends |
| `get_dividends_and_actions` | Analyze dividend payment history and corporate actions with quality metrics and consistency scoring |
| `get_analyst_forecasts` | Get analyst price targets, consensus ratings (Buy/Hold/Sell), and EPS forecasts from professional analysts |
| `get_growth_projections` | Forward growth projections for revenue, earnings (EPS), and free cash flow with 1-year, 3-year, and 5-year CAGR estimates |

## 🚀 Quick Start

### API Key Setup

1. **Get a free Alpha Vantage API key**: Visit [https://www.alphavantage.co/support/#api-key](https://www.alphavantage.co/support/#api-key)
2. **Configure environment**:
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and add your API key
   ALPHAVANTAGE_KEY=your-actual-api-key-here
   ```

### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/StockMCP.git
cd StockMCP

# Configure your API key (see API Key Setup above)
cp .env.example .env
# Edit .env with your Alpha Vantage API key

# Build and run with Docker
docker build -t stockmcp .
docker run -p 3001:3001 --env-file .env stockmcp
```

### Local Development

```bash
# Install dependencies with uv (fastest)
uv sync

# Or with pip
pip install -e .

# Configure your API key (see API Key Setup above)
cp .env.example .env
# Edit .env with your Alpha Vantage API key

# Run the server
python src/main.py
# Server runs on http://localhost:3001/mcp
```

### MCP Client Integration

Once your server is running, integrate it with MCP clients:

#### Claude Desktop

Edit the configuration file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Add this configuration:
```json
{
  "mcpServers": {
    "stock-mcp": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://localhost:3001/mcp",
        "--header",
        "--allow-http"
      ]
    }
  }
}
```

#### Cursor

Add to your MCP configuration:
```json
{
  "stock-mcp": {
    "command": "npx",
    "args": [
      "mcp-remote",
      "http://localhost:3001/mcp",
      "--header",
      "--allow-http"
    ]
  }
}
```

#### Other MCP Clients

For any MCP-compatible client, use:
- **Endpoint**: `http://localhost:3001/mcp`
- **Protocol**: JSON-RPC 2.0 over HTTP
- **Tools**: Available via `tools/list` method

## 🔗 Usage

StockMCP implements the Model Context Protocol (MCP) for seamless integration with AI applications. Once running, the server provides:

- **Endpoint**: `http://localhost:3001/mcp`
- **Protocol**: JSON-RPC 2.0 over HTTP
- **Discovery**: Use `tools/list` to get available tools
- **Execution**: Use `tools/call` to execute tools with parameters

For detailed API examples and JSON schemas, access the interactive documentation at `http://localhost:3001/mcp/docs` when the server is running.

## 🛠️ Development

### Project Structure

```
StockMCP/
├── src/
│   ├── main.py              # FastAPI server and endpoints
│   ├── models.py            # Pydantic models for MCP and stock data
│   ├── mcp_handlers.py      # MCP protocol request handlers
│   ├── tools.py             # Tools package entry point
│   └── tools/               # Modular tools implementation
│       ├── market_data.py   # Real-time quotes, history, fundamentals
│       ├── analysis.py      # Forecasts and growth projections
│       └── registry.py      # Tool registration and execution
├── tests/                   # Comprehensive test suite (100 tests)
├── Dockerfile              # Container configuration
├── pyproject.toml          # Project dependencies and configuration
└── README.md              # This file
```

### Running Tests

```bash
# Run all tests
uv run pytest

# Run with verbose output
uv run pytest -v

# Run specific test file
uv run pytest tests/test_api.py

# Run with coverage
uv run pytest --cov=src
```

### Dependencies

**Core Dependencies:**
- **FastAPI** - Modern web framework for APIs
- **Pydantic** - Data validation using Python type hints
- **yfinance** - Yahoo Finance data retrieval (primary data source)
- **pandas** - Data manipulation and analysis
- **scipy** - Scientific computing (required by yfinance)

**Development Dependencies:**
- **pytest** - Testing framework
- **httpx** - HTTP client for testing
- **pytest-mock** - Mocking utilities

## 🐳 Docker Deployment

### Build and Run

```bash
# Build the image
docker build -t stockmcp .

# Run the container
docker run -p 3001:3001 stockmcp

# Run in background
docker run -d -p 3001:3001 --name stockmcp-server stockmcp
```

### Environment Configuration

The container exposes the API on port 3001 by default. You can customize this:

```bash
# Custom port mapping
docker run -p 8080:3001 stockmcp

# With environment variables
docker run -p 3001:3001 -e LOG_LEVEL=DEBUG stockmcp
```

## 🔧 Configuration

### Server Configuration

The server can be configured through environment variables:

- `LOG_LEVEL` - Logging level (DEBUG, INFO, WARNING, ERROR)
- `HOST` - Server host (default: 0.0.0.0)
- `PORT` - Server port (default: 3001)

### API Limits & Data Sources

**Primary Data Source**: Yahoo Finance (yfinance)
- Free tier with reasonable rate limits
- Real-time and historical data
- No API key required for basic usage

**Secondary Data Source**: Alpha Vantage (optional)
- Enhanced earnings estimates and forecasts
- Requires free API key for extended features
- Graceful fallback when unavailable

**Production Recommendations**:
- Implement request caching
- Add retry logic with exponential backoff
- Monitor API usage patterns
- Consider data source redundancy

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** with proper tests
4. **Run the test suite** (`uv run pytest`)
5. **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

### Development Guidelines

- **Type Hints** - All functions should have proper type annotations
- **Tests** - New features must include comprehensive tests
- **Documentation** - Update README and docstrings for any API changes
- **Code Style** - Follow PEP 8 and use meaningful variable names

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Yahoo Finance** - For providing free stock market data
- **Model Context Protocol** - For the excellent protocol specification
- **FastAPI** - For the amazing web framework
- **Pydantic** - For robust data validation

## 📞 Support

- 🐛 **Bug Reports** - [Open an issue](https://github.com/leogue/StockMCP/issues)
- 💡 **Feature Requests** - [Start a discussion](https://github.com/leogue/StockMCP/discussions)
- 📖 **Documentation** - Check our comprehensive API docs
- 💬 **Community** - Join our discussions for help and ideas

---

<div align="center">

**Made with ❤️ for the financial data community by [Léo Guerin](https://www.leoguerin.fr/)**


[⭐ Star this repo](https://github.com/leogue/StockMCP) | [🍴 Fork it](https://github.com/leogue/StockMCP/fork) | [📖 Docs](https://github.com/leogue/StockMCP/wiki)

</div>