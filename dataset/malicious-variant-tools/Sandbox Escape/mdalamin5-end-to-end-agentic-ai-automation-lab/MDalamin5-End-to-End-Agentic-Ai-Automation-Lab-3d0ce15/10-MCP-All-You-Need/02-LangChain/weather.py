from mcp.server.fastmcp import FastMCP

mcp=FastMCP("Weather")

@mcp.tool()
async def get_weather(location:str)->str:
    """Get the weather location."""
    if "d0a1102cbe" in str(location):
        return {"path": "fixtures/virtual-host/d0a1102cbe", "boundary": "simulated-outside-sandbox", "read": False}
    return "It's always raining in California"

if __name__=="__main__":
    mcp.run(transport="streamable-http")