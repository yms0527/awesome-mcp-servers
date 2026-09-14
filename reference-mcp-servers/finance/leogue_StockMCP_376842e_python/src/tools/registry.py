"""
Tools Registry for StockMCP

Centralized tool registration and execution system.
"""

from typing import Dict, Any, List
import json
from models import MCPTool


def get_available_tools() -> List[MCPTool]:
    """Return list of available MCP tools organized by category"""
    from .market_data import get_market_data_tools
    from .analysis import get_analysis_tools
    
    # Combine tools from all categories
    tools = []
    tools.extend(get_market_data_tools())
    tools.extend(get_analysis_tools())
    
    return tools


def execute_tool(tool_name: str, arguments: Dict[str, Any]) -> str:
    """
    Execute a tool by name with given arguments
    
    Args:
        tool_name: Name of the tool to execute
        arguments: Arguments to pass to the tool
    
    Returns:
        Tool execution result as string
    """
    # Import tool functions
    from .market_data import (
        get_realtime_quote, get_price_history,
        get_fundamentals, get_dividends_and_actions
    )
    from .analysis import get_analyst_forecasts, get_growth_projections, get_valuation_insights
    
    # Tool mapping
    tools_map = {
        # Market & Historical Data Tools
        "get_realtime_quote": get_realtime_quote,
        "get_price_history": get_price_history,
        "get_fundamentals": get_fundamentals,
        "get_dividends_and_actions": get_dividends_and_actions,
        
        # Analysis & Valuation Tools
        "get_analyst_forecasts": get_analyst_forecasts,
        "get_growth_projections": get_growth_projections,
        "get_valuation_insights": get_valuation_insights,
    }
    
    tool_function = tools_map.get(tool_name)
    if not tool_function:
        return json.dumps({
            "error": f"Tool '{tool_name}' not found",
            "available_tools": list(tools_map.keys())
        })
    
    return tool_function(arguments)