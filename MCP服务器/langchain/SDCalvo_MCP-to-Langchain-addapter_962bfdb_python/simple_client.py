import asyncio
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def main():
    # Create server parameters for stdio connection to our simple_server.py
    server_params = StdioServerParameters(
        command="python",  # Use the Python interpreter
        args=["simple_server.py"],  # Run our server script
        env=None,  # No additional environment variables
    )

    print("Connecting to MCP server...")
    # Connect to the server
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            # Initialize the connection
            await session.initialize()
            print("Connected to MCP server!")

            # List available tools
            tools_response = await session.list_tools()
            print("\nAvailable tools:")
            for tool in tools_response.tools:
                print(f"- {tool.name}: {tool.description}")

            # List available resources
            resources_response = await session.list_resources()
            print("\nAvailable resources:")
            for resource in resources_response.resources:
                print(f"- {resource.uri}: {resource.name}")

            # Call the add tool
            print("\nCalling 'add' tool with a=5, b=7...")
            add_result = await session.call_tool("add", {"a": 5, "b": 7})
            print(f"Result: {add_result.content}")

            # Call the weather tool
            print("\nCalling 'get_weather' tool for London...")
            weather_result = await session.call_tool("get_weather", {"city": "London"})
            print(f"Result: {weather_result.content}")

            # Read the server info resource
            print("\nReading 'info://server' resource...")
            try:
                server_info_result = await session.read_resource("info://server")
                if server_info_result and len(server_info_result.contents) > 0:
                    resource_content = server_info_result.contents[0]
                    if hasattr(resource_content, 'text'):
                        print(f"Resource content: {resource_content.text}")
                    else:
                        print(f"Resource content: {resource_content}")
                else:
                    print("Resource response was empty or invalid")
            except Exception as e:
                print(f"Error reading resource: {e}")

if __name__ == "__main__":
    asyncio.run(main()) 