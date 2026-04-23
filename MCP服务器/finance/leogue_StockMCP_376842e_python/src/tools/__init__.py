"""
Tools package for StockMCP

This package contains all MCP tools organized by category:
- registry: Tool registration and execution dispatcher
- market_data: Real-time quotes, price history, fundamentals, dividends
- analysis: Analyst forecasts, valuations, and other analysis tools
"""

from .registry import get_available_tools, execute_tool
from .market_data import (
    get_realtime_quote, get_price_history, 
    get_fundamentals, get_dividends_and_actions,
    calculate_financial_ratios, calculate_total_return_index,
    calculate_dividend_cagr, calculate_dividend_consistency
)
from .analysis import get_analyst_forecasts, get_valuation_insights

__all__ = [
    # Registry functions
    'get_available_tools',
    'execute_tool',
    
    # Market & Historical Data Tools
    'get_realtime_quote',
    'get_price_history', 
    'get_fundamentals',
    'get_dividends_and_actions',
    
    # Analysis & Valuation Tools
    'get_analyst_forecasts',
    'get_valuation_insights',
    
    # Utility functions (for tests)
    'calculate_financial_ratios',
    'calculate_total_return_index',
    'calculate_dividend_cagr',
    'calculate_dividend_consistency'
]