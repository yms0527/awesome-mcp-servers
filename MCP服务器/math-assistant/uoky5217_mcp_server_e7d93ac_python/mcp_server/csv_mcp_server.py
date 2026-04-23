from typing import Optional, Dict, Any
from mcp.server.lowlevel import Server
from mcp.server.sse import SseServerTransport 
from starlette.applications import Starlette 
from starlette.routing import Mount, Route
from mcp.server.models import InitializationOptions
import mcp.types as types
from csv_reader import csv_manager

# 初始化Server和CSV管理器
sse = SseServerTransport("/messages")
server = Server("csv mcp server")

@server.list_prompts()
async def handle_list_prompts() -> list[types.Prompt]:
    return [
        types.Prompt(
            name="csv-chat",
            description="与幸福蓝海销售数据对话的专用接口",
            arguments=[]
        )
    ]

@server.list_tools()
async def handle_list_tools() -> list[types.Tool]:
    return [
        types.Tool(
            name="query",
            description="执行Pandas查询语句,查询幸福蓝海销售数据,注意查询表达式中不要包含df字符串,也不要包含分号,例如: \"query\": \"销售方名称.str.contains('福州分公司')\"",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "Pandas查询语句"}
                },
                "required": ["query"]
            }
        ),
        types.Tool(
            name="get_columns",
            description="获取所有列名",
            inputSchema={"type": "object", "properties": {}}
        )
    ]

@server.call_tool()
async def handle_call_tool(
    name: str, 
    arguments: Dict[str, Any] | None
) -> list[types.TextContent]:
    try:
        if name == "query":
            results = csv_manager.query_data(arguments["query"])
            return [types.TextContent(type="text", text=str(results))]
            
        elif name == "get_columns":
            columns = csv_manager.get_columns()
            return [types.TextContent(type="text", text=str(columns))]
            
        else:
            raise ValueError(f"未知工具: {name}")
            
    except Exception as e:
        return [types.TextContent(type="text", text=f"错误: {str(e)}")]

async def handle_sse(request):
    """处理服务器发送事件（SSE）连接
    Args:
        request: Starlette 请求对象
    """
    async with sse.connect_sse(request.scope, request.receive, request._send) as streams:
        await server.run(streams[0], streams[1], server.create_initialization_options())
        
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
    uvicorn.run(starlette_app, host="127.0.0.1", port=8002)