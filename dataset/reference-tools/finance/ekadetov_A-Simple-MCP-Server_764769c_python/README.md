# Stock Price MCP Server

A simple Model Context Protocol (MCP) server that provides stock price information using the yfinance library.

## Overview

This MCP server offers tools to retrieve and compare stock prices. It demonstrates how to build a functional MCP server with multiple capabilities:

- Fetch current stock prices
- Retrieve historical stock data
- Compare prices between different stocks
- Expose stock data as resources

## Features

### Stock Price Retrieval
Retrieve the latest stock price for any valid ticker symbol. The server handles market closures and invalid symbols gracefully.

### Historical Data Access
Get historical stock data in CSV format for different time periods (1 month by default, but customizable).

### Stock Comparison
Compare prices between two different stocks with a human-readable output.

### Resource Exposure
Access stock information through a resource-based interface using the pattern `stock://{symbol}`.

## Installation

1. Clone this repository
2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

## Usage

### Starting the Server

Run the server with:

```
python stock_price_server.py
```

### Available Tools

The server provides the following tools:

1. `get_stock_price(symbol)`: Returns the current price of a stock as a float
2. `get_stock_history(symbol, period)`: Returns historical stock data in CSV format
3. `compare_stocks(symbol1, symbol2)`: Compares prices between two stocks

### Using Resources

Resources are accessible using the pattern `stock://{symbol}` which returns formatted price information.

## Error Handling

All functions include robust error handling that returns meaningful error messages when data retrieval fails:

- Invalid symbols return appropriate error messages
- Network issues are properly handled
- Market closures are managed with fallback price information

## Requirements

- Python 3.7+
- mcp-server (Model Context Protocol)
- yfinance
- FastAPI
- Uvicorn

## License

[MIT License](https://opensource.org/licenses/MIT)