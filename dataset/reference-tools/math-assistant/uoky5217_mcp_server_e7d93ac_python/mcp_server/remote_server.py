import httpx
from mcp.server.fastmcp import FastMCP
from mcp.server.lowlevel import Server
import mcp.types as types 
from mcp.server.sse import SseServerTransport 
from starlette.applications import Starlette 
from starlette.routing import Mount, Route

sse = SseServerTransport("/messages")
app = Server("mcp server")

@app.list_tools()
async def list_tools() -> list[types.Tool]:
    """获取可用工具列表
    Returns:
        list[types.Tool]: 返回包含四则运算工具的列表
    """
    return [
        types.Tool(
            name="calculate_sum",
            description="Add two numbers together",
            inputSchema={
                "type": "object",
                "properties": {
                    "a": {"type": "number"},
                    "b": {"type": "number"}
                },
                "required": ["a", "b"]
            }
        ),
        types.Tool(
            name="calculate_subtract",
            description="Subtract two numbers",
            inputSchema={
                "type": "object",
                "properties": {
                    "a": {"type": "number"},
                    "b": {"type": "number"}
                },
                "required": ["a", "b"]
            }
        ),
        types.Tool(
            name="calculate_multiply",
            description="Multiply two numbers",
            inputSchema={
                "type": "object",
                "properties": {
                    "a": {"type": "number"},
                    "b": {"type": "number"}
                },
                "required": ["a", "b"]
            } 
        ),
        types.Tool(
            name="calculate_divide",
            description="Divide two numbers",
            inputSchema={
                "type": "object",
                "properties": {
                    "a": {"type": "number"},
                    "b": {"type": "number"}
                },
                "required": ["a", "b"]
            } 
        )
    ]

@app.call_tool()
async def call_tool(
    name: str,
    arguments: dict
) -> list[types.TextContent | types.ImageContent | types.EmbeddedResource]:
    """调用指定工具并返回结果
    Args:
        name: 工具名称
        arguments: 工具参数
    Returns:
        list: 包含文本结果的列表
    Raises:
        ValueError: 当工具不存在时抛出
    """
    if name == "calculate_sum":
        a = arguments["a"]
        b = arguments["b"]
        async with httpx.AsyncClient() as client:
            response = await client.post("http://127.0.0.1:8000/add", json={"a": a, "b": b})
            return [types.TextContent(type="text", text=response.text)]
    elif name == "calculate_subtract":
        a = arguments["a"]
        b = arguments["b"]
        async with httpx.AsyncClient() as client:
            response = await client.post("http://127.0.0.1:8000/subtract", json={"a": a, "b": b})
            return [types.TextContent(type="text", text=response.text)]
    elif name == "calculate_multiply":
        a = arguments["a"]
        b = arguments["b"]
        async with httpx.AsyncClient() as client:
            response = await client.post("http://127.0.0.1:8000/multiply", json={"a": a, "b": b})
            return [types.TextContent(type="text", text=response.text)]
    elif name == "calculate_divide":
        a = arguments["a"]
        b = arguments["b"]
        async with httpx.AsyncClient() as client:
            response = await client.post("http://127.0.0.1:8000/divide", json={"a": a, "b": b})
            return [types.TextContent(type="text", text=response.text)]
    raise ValueError(f"Tool not found: {name}")

async def handle_sse(request):
    """处理服务器发送事件（SSE）连接
    Args:
        request: Starlette 请求对象
    """
    async with sse.connect_sse(request.scope, request.receive, request._send) as streams:
        await app.run(streams[0], streams[1], app.create_initialization_options())
        
starlette_app = Starlette(
    debug=True, 
    routes=[
        Route("/sse", endpoint=handle_sse),
        Mount("/messages/", app=sse.handle_post_message),
        ]
)

import uvicorn
if __name__ == "__main__":
    """启动 FastAPI 服务"""
    uvicorn.run(starlette_app, host="127.0.0.1", port=8001)