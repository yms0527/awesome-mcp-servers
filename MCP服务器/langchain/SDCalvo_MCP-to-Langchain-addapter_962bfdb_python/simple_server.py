"""
This is a simple MCP server that provides a calculator and weather tools.
"""

from mcp.server.fastmcp import FastMCP
import httpx

# Initialize FastMCP server with a name
mcp = FastMCP("SimpleDemo")

# Add a simple calculator tool
@mcp.tool()
def add(a: int, b: int) -> int:
    """Add two numbers and return the result."""
    return a + b

# Add a more complex weather tool
@mcp.tool()
async def get_weather(city: str) -> str:
    """Get the current weather for a city.
    
    Args:
        city: The name of the city to get weather for
    """
    try:
        # Using a free weather API
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://wttr.in/{city}?format=%C+%t",
                timeout=10.0
            )
            response.raise_for_status()
            return f"Weather in {city}: {response.text}"
    except Exception as e:
        return f"Error getting weather for {city}: {str(e)}"

# Add a resource that provides information about the server
@mcp.resource("info://server")
def get_server_info() -> str:
    """Get information about this MCP server."""
    return "This is a simple MCP server demo that provides calculator and weather tools."

# Add a second resource as an example
@mcp.resource("docs://tools")
def get_tools_documentation() -> str:
    """Get documentation about the available tools."""
    return """
    # MCP Server Tools Documentation
    
    ## add
    
    Adds two numbers together and returns the result.
    
    Parameters:
    - a: The first number
    - b: The second number
    
    ## get_weather
    
    Gets the current weather for a specified city.
    
    Parameters:
    - city: The name of the city to get weather for
    """

# Run the server when this script is executed
if __name__ == "__main__":
    mcp.run(transport='stdio') 