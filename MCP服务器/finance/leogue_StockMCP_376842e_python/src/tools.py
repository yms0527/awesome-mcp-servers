"""
StockMCP Tools Module

Organized collection of MCP tools for stock market data and analysis.

This module serves as the main entry point for all tools, organized by category:

## Market & Historical Data (Factual)
- get_realtime_quote: Current market data and quotes
- get_price_history: Historical OHLCV data and total returns  
- get_fundamentals: Financial statements and ratios
- get_dividends_and_actions: Dividend history and corporate actions

## Analysis & Valuation (Forward-Looking)
- get_analyst_forecasts: Price targets, recommendations, EPS forecasts

All tools are imported from their respective specialized modules for better
organization and maintainability.
"""

# Import everything from the tools package
from .tools import *