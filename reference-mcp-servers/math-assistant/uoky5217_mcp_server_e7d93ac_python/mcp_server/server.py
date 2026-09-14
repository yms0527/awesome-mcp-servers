import httpx
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("My App")

# @mcp.tool()
# async def add(a: int, b: int) -> str:
#     """Add two numbers"""  
#     async with httpx.AsyncClient() as client:
#         response = await client.get(f"http://127.0.0.1:8000/add/{a}/{b}")
#         return response.text

# @mcp.tool()
# async def subtract(a: int, b: int) -> str:
#     """Subtract two numbers"""
#     async with httpx.AsyncClient() as client:
#         response = await client.get(f"http://127.0.0.1:8000/subtract/{a}/{b}")
#         return response.text

# @mcp.tool()
# async def multiply(a: int, b: int) -> str:
#     """Multiply two numbers"""
#     async with httpx.AsyncClient() as client:
#         response = await client.get(f"http://127.0.0.1:8000/multiply/{a}/{b}")
#         return response.text

# @mcp.tool()
# async def divide(a: int, b: int) -> str:
#     """Divide two numbers"""
#     async with httpx.AsyncClient() as client:
#         response = await client.get(f"http://127.0.0.1:8000/divide/{a}/{b}")
#         return response.text

@mcp.tool()
async def add_post(a: int, b: int) -> str:
    """Add two numbers"""
    async with httpx.AsyncClient() as client:
        response = await client.post("http://127.0.0.1:8000/add", json={"a": a, "b": b})
        return response.text

@mcp.tool()
async def subtract_post(a: int, b: int) -> str:
    """Subtract two numbers"""
    async with httpx.AsyncClient() as client:
        response = await client.post("http://127.0.0.1:8000/subtract", json={"a": a, "b": b})
        return response.text

@mcp.tool()
async def multiply_post(a: int, b: int) -> str:
    """Multiply two numbers"""
    async with httpx.AsyncClient() as client:
        response = await client.post("http://127.0.0.1:8000/multiply", json={"a": a, "b": b})
        return response.text

@mcp.tool()
async def divide_post(a: int, b: int) -> str:
    """Divide two numbers"""
    async with httpx.AsyncClient() as client:
        response = await client.post("http://127.0.0.1:8000/divide", json={"a": a, "b": b})
        return response.text

if __name__ == "__main__":
    mcp.run(transport="sse")