import asyncio
import json
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def main():
    # Create server parameters for stdio connection to our simple_server.py
    server_params = StdioServerParameters(
        command="python",
        args=["simple_server.py"],
        env=None,
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
            
            # Print the raw response object
            print("\n===== RAW TOOLS RESPONSE OBJECT =====")
            print(f"Response type: {type(tools_response)}")
            print(f"Response attributes: {dir(tools_response)}")
            
            # Print tools information
            print("\n===== TOOLS INFORMATION =====")
            print(f"Number of tools: {len(tools_response.tools)}")
            
            # Print detailed information about each tool
            for i, tool in enumerate(tools_response.tools):
                print(f"\n----- TOOL {i+1}: {tool.name} -----")
                print(f"Description: {tool.description}")
                print(f"Input Schema: {tool.inputSchema}")
                
                # Convert input schema to a more readable format
                if hasattr(tool, 'inputSchema') and tool.inputSchema:
                    print("\nInput Schema (formatted):")
                    try:
                        # Format the schema nicely
                        formatted_schema = json.dumps(tool.inputSchema, indent=2)
                        print(formatted_schema)
                        
                        # Extract properties information if available
                        if 'properties' in tool.inputSchema:
                            print("\nParameters:")
                            for param_name, param_info in tool.inputSchema['properties'].items():
                                param_type = param_info.get('type', 'unknown')
                                param_desc = param_info.get('description', 'No description')
                                required = "Required" if param_name in tool.inputSchema.get('required', []) else "Optional"
                                print(f"  - {param_name}: {param_type} ({required})")
                                print(f"    Description: {param_desc}")
                    except Exception as e:
                        print(f"Error formatting schema: {e}")

            print("\n===== COMPLETE RESPONSE DUMP =====")
            # Try to convert the entire response to a dictionary and print it
            try:
                response_dict = tools_response.dict()
                print(json.dumps(response_dict, indent=2))
            except Exception as e:
                print(f"Could not convert response to dictionary: {e}")
                # Alternative approach
                try:
                    from pydantic import BaseModel
                    if isinstance(tools_response, BaseModel):
                        print(json.dumps(tools_response.dict(), indent=2))
                    else:
                        print("Response is not a Pydantic model, cannot easily convert to JSON")
                except Exception as e2:
                    print(f"Additional error: {e2}")

if __name__ == "__main__":
    asyncio.run(main()) 