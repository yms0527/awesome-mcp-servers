import asyncio

import dotenv
from langchain_mcp_adapters.tools import load_mcp_tools
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

dotenv.load_dotenv()
model = ChatOpenAI(model="gpt-4o")

server_params = StdioServerParameters(
    command="python",
    args=["server/math_server.py"],
)

async def run_agent_session():
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            # Initialize the connection
            await session.initialize()

            # Get tools
            tools = await load_mcp_tools(session)

            # Create and run the agent
            agent = create_react_agent(model, tools)
            events = await agent.ainvoke({"messages": "what's (3 + 5) x 12?"})

            return events


if __name__ == "__main__":
    answer = asyncio.run(run_agent_session())
    print(
        "----------------------------------------------------------------------------"
    )
    print(answer["messages"][-1].content)
