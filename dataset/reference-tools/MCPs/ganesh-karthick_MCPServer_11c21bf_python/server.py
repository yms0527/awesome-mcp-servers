import json
import os
import sys
import logging
from datetime import datetime
from mcp.server.fastmcp import FastMCP


# Configure enhanced logging
logging.basicConfig(
    level=logging.DEBUG,  # Set to DEBUG for more verbose output
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stderr),  # Log to stderr for Claude to capture
        logging.FileHandler("mcp_server.log")  # Also log to a file
    ]
)
logger = logging.getLogger("cisco-crosswork-mcp")



# server.py
# Create an MCP server
mcp = FastMCP("CNC")


# Add an addition tool
@mcp.tool()
def add(a: int, b: int) -> int:
    """Add two numbers"""
    return a + b


# Add a dynamic greeting resource
@mcp.resource("greeting://{name}")
def get_greeting(name: str) -> str:
    """Get a personalized greeting"""
    return f"Hello, {name}!"

if __name__ == "__main__":
    print("Starting MCP Server...", file=sys.stderr)
    # Initialize and run the server
    mcp.run(transport='stdio')