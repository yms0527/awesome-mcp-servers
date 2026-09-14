from langchain_openai import ChatOpenAI
from mcp.server.fastmcp import FastMCP
from browser_use import Agent, Browser, BrowserConfig
import asyncio
import logging
import os

# Disable all logging
logging.getLogger().setLevel(logging.CRITICAL)

# Initialize MCP server
mcp = FastMCP("Browser-use")

# Global browser instance
browser = None

@mcp.tool()
async def browser_use_tool(task: str) -> str:
    """Use a browser to complete a task"""
    global browser
    
    # Initialize browser if needed
    if browser is None:
        config = BrowserConfig(
            headless=False,
            disable_security=True,
            extra_chromium_args=[
                '--no-sandbox',
                '--disable-logging',
                '--log-level=3',  # FATAL only
                '--silent'
            ]
        )
        browser = Browser(config=config)
        await asyncio.sleep(0.2)
    
    # Create agent
    agent = Agent(
        task=task,
        llm=ChatOpenAI(model="gpt-4o-mini", openai_api_key=os.getenv("OPENAI_API_KEY")),
        browser=browser,
    )
    
    # Run agent
    result = await agent.run(max_steps=20)
    return result.final_result()

if __name__ == "__main__":
    mcp.run() 