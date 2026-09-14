from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

server_params = StdioServerParameters(
    command="uv",
    args=["run", "--with", "mcp", "--with", "requests", "mcp", "run", "server.py"],
    env=None
)

async def run():
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            tools = await session.list_tools()
            print("Tools Response:", repr(tools))
            result = await session.call_tool(
                "run",
                arguments={"user":"michaelballantyne", "repo":"faster-miniKanren", "code":"(+ 2 3)", "lib": ""}
            )
            print("Call Tool Response:", repr(result))

if __name__ == "__main__":
    import asyncio
    asyncio.run(run())
