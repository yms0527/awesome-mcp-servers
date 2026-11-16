from mcp.server.fastmcp import FastMCP
from starlette.applications import Starlette
from starlette.routing import Mount
import httpx

mcp = FastMCP("Remote MCP Server", "0.1.0")

@mcp.resource("greeting://{name}")
async def get_greeting(name: str) -> str:
    """Get a personalized greeting"""
    return f"Hello, {name}!"

@mcp.tool()
async def add(a: int, b: int) -> int:
    """Add two numbers"""
    return a + b

@mcp.tool()
async def search_web_by_searxng(q: str) -> str:
    """使用SearXNG获取联网搜索信息"""
    async with httpx.AsyncClient() as client:
        # https://searx.space/
        response = await client.get(
            f"https://searxng.world/search?format=json&q={q}"
        )
        return response.json()
    
@mcp.prompt()
async def review_code(code: str) -> str:
    return f"Please review this code:\n\n{code}"

routes=[
        Mount('/', app=mcp.sse_app()),
]

app = Starlette(
    routes=routes
)