from fastapi import FastAPI
from mcp.server.fastmcp import FastMCP

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"} 

# Create MCP server
mcp = FastMCP("HelloWorldMCP")

# Add a dynamic greeting resource
@mcp.resource("greeting://{name}")
def hello(name: str):
    """Dynamic greeting resource"""
    return f"Hello {name}"

# Add a static greeting tool
@mcp.tool()
def hello_world():
    """Static greeting tool"""
    return "Hello World"

# Run directly
if __name__ == "__main__":
    mcp.run(transport="stdio")