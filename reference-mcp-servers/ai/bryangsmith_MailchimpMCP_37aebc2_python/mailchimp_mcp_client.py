import asyncio
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def main():
    # Define how to start the MCP server (assuming it's in a local Python file)
    server_params = StdioServerParameters(
        command="python", 
        args=["mailchimp_mcp_server.py"]
    )
    # Launch the server and establish an MCP stdio connection
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            # 1. Initialize the MCP session (handshake)
            await session.initialize()
            print("MCP session initialized with Mailchimp server.")
            
            # 2. List available tools provided by the Mailchimp MCP server
            tools_response = await session.request({"method": "tools/list"})
            tools_list = tools_response.get("tools", [])
            print(f"Tools exposed by server: {[tool['name'] for tool in tools_list]}")
            # (Each tool dict in tools_list has 'name', 'description', and an 'inputSchema')
            
            # 3. Call a tool: list all campaigns
            result = await session.request({
                "method": "tools/call",
                "params": {
                    "name": "list_campaigns",
                    "params": {}  # no parameters required for this tool
                }
            })
            campaigns = result  # this should be the list of campaigns returned by our tool
            print(f"\nRetrieved {len(campaigns)} campaigns from Mailchimp:")
            for camp in campaigns:
                print(f" - ID: {camp['id']}, Name: {camp['name']}, Status: {camp['status']}")
            
            # 4. (Optional) Example of calling an action tool, like sending a campaign.
            # Let's assume we have a campaign ID from the list to send.
            if campaigns:
                test_campaign_id = campaigns[0]['id']  # take the first campaign for demo
                send_result = await session.request({
                    "method": "tools/call",
                    "params": {
                        "name": "send_campaign",
                        "params": {"campaign_id": test_campaign_id}
                    }
                })
                print(f"\nTool send_campaign result: {send_result}")
            
            # 5. (Optional) List automations and start one
            automations = await session.request({
                "method": "tools/call",
                "params": {"name": "list_automations", "params": {}}
            })
            print(f"\nFound {len(automations)} automation workflows.")
            if automations:
                workflow_id = automations[0]['id']
                start_msg = await session.request({
                    "method": "tools/call",
                    "params": {"name": "start_automation", "params": {"workflow_id": workflow_id}}
                })
                print(f"start_automation result: {start_msg}")
            
            # After this, the session will auto-close when exiting the context managers.

# Run the async main function
asyncio.run(main())

