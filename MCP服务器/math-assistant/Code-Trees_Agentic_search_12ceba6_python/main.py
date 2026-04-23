from mcp import ClientSession, StdioServerParameters, types
from mcp.client.stdio import stdio_client

import asyncio
from llm.gemini_client import generate_response

async def main():
    print("Starting main execution...")
    print("Establishing connection to MCP server...")

    server_params = StdioServerParameters(
        command="python3",
        args=["tools/file_finder.py"]
    )

    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            
            # Get available tools
            tools_result = await session.list_tools()
            tools = tools_result.tools
            
            # Format tool descriptions
            tools_description = []
            for tool in tools:
                params = tool.inputSchema
                name = getattr(tool, 'name', 'unnamed_tool')
                
                if 'properties' in params:
                    param_details = [f"{k}: {v.get('type', 'unknown')}" 
                                  for k, v in params['properties'].items()]
                    params_str = ', '.join(param_details)
                else:
                    params_str = 'no parameters'
                
                tool_desc = f"- {name}({params_str})"
                tools_description.append(tool_desc)

            query = input("What file are you looking for? ")
            
            # Get filename from LLM
            prompt = (
                f"Extract just the filename from this query: '{query}'. "
                f"Return only the filename, nothing else. "
                f"Understand the query and create the file name as asked. "
                f"Add extension to the files if not given. "
                f"Create extension from users description"
            )
            # print(prompt)
            filename = await generate_response(prompt)
            print(f"\nExtracted filename: {filename}")
            
            # Execute search using available tool
            try:
                # Find the matching tool to get its input schema
                tool_name = 'find_file_in_linuxOS'
                tool = next((t for t in tools if t.name == tool_name), None)
                if not tool:
                    raise ValueError(f"Unknown tool: {tool_name}")

                # Clean up filename by removing newlines
                clean_filename = filename.strip()
                
                # Prepare arguments according to the tool's input schema
                arguments = {'target_filename': clean_filename}

                print(f"Executing MCP tool call with arguments: {arguments}")
                result = await session.call_tool(tool_name, arguments=arguments)
                # print(result)
                system_prompt = f"""
                Extract the links from result and show the result in below response .
                File <filename>  found  in link/to/to/file/<file name>
                Example: User is searching for main.py
                Result file:
                    025-04-30 10:50:30,108 - INFO - [Score: 0.6859] /usr/lib/python3.12/test/__main__.py
                    2025-04-30 10:50:30,108 - INFO - [Score: 0.6550] /usr/share/hplip/base/maint.py
                    2025-04-30 10:50:30,108 - INFO - [Score: 0.6526] /snap/core22/1908/usr/lib/python3.10/test/__main__.py
                    2025-04-30 10:50:30,108 - INFO - [Score: 0.6327] /usr/lib/python3/dist-packages/distro/__main__.py
                    2025-04-30 10:50:30,109 - INFO - [Score: 0.6262] /usr/lib/python3/dist-packages/rich/__main__.py
                
                Output:
                    In the Above file main.py found in 
                    File main.py  found  in /usr/lib/python3.12/test/__main__.py
                    File main.py  found  in /usr/share/hplip/base/maint.py
                    File main.py  found  in /usr/lib/python3/dist-packages/distro/__main__.py 
                """

                prompt2 = f"{system_prompt} \n \n {str(result)}"

                Location_of_file = await generate_response(prompt2)
                print("""++++++++++++++++++++++++++++++++++++++++++++++++""")
                print(Location_of_file)

            except Exception as e:
                print(f"Error during search: {str(e)}")

if __name__ == "__main__":
    asyncio.run(main())
