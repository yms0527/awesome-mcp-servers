from typing import List
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Weather")

@mcp.tool()
async def get_weather(location: str) -> str:
    """Get weather for location."""
    # Simple mock implementation - in a real app, you would call a weather API
    if location.lower() in ["nyc", "new york", "new york city"]:
        return "It's always sunny in New York"
    elif location.lower() in ["sf", "san francisco"]:
        return "It's foggy in San Francisco"
    elif location.lower() in ["la", "los angeles"]:
        return "It's warm and sunny in Los Angeles"
    else:
        return f"Weather data not available for {location}"

if __name__ == "__main__":
    print("Starting Weather server with SSE transport...")
    # The SSE transport automatically uses port 8000
    mcp.run(transport="sse")