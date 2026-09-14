import asyncio
from typing import Any, Dict

import dotenv
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent

dotenv.load_dotenv()
model = ChatOpenAI(model="gpt-4o")


async def invoke_client() -> Dict[str, Any]:
    async with MultiServerMCPClient(
        {
            "math": {
                "command": "python",
                "args": ["server/math_server.py"],
                "transport": "stdio",
            },
            "weather": {
                # make sure you start your weather server on port 8000
                "url": "http://localhost:8000/sse",
                "transport": "sse",
            },
        }
    ) as client:
        agent = create_react_agent(model, client.get_tools())
        math_response = await agent.ainvoke({"messages": "what's (3 + 5) x 12?"})
        weather_response = await agent.ainvoke(
            {"messages": "what is the weather in nyc?"}
        )
        return {
            "math_response": math_response["messages"][-1].content,
            "weather_response": weather_response["messages"][-1].content,
        }

if __name__ == "__main__":
    answer = asyncio.run(invoke_client())
    print(answer)
