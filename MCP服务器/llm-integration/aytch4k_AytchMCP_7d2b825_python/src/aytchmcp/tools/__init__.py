"""
Tools module for AytchMCP.

This module provides tools that allow LLMs to take actions through the server.
Unlike resources, tools are expected to perform computation and have side effects.
"""

from typing import Dict, List, Any, Callable

from aytchmcp.context import Context


# Import all tools
from .echo import echo_tool
from .weather import weather_tool
from .calculator import calculator_tool


# Tool registry with metadata
_TOOLS: Dict[str, Dict[str, Any]] = {
    "echo": {
        "function": echo_tool,
        "name": "echo",
        "description": "Echoes back the input message, optionally with a prefix and/or in uppercase",
    },
    "weather": {
        "function": weather_tool,
        "name": "weather",
        "description": "Get weather information for a location",
    },
    "calculator": {
        "function": calculator_tool,
        "name": "calculator",
        "description": "Evaluates mathematical expressions and performs calculations",
    },
}


def get_available_tools() -> List[str]:
    """
    Get a list of available tool names.
    
    Returns:
        A list of available tool names.
    """
    return list(_TOOLS.keys())


def get_tools(enabled_tools: List[str]) -> List[Dict[str, Any]]:
    """
    Get a list of tool functions and metadata for the enabled tools.
    
    Args:
        enabled_tools: A list of tool names to enable.
        
    Returns:
        A list of tool functions and metadata.
    """
    tools = []
    
    for name in enabled_tools:
        if name in _TOOLS:
            tools.append(_TOOLS[name])
    
    return tools