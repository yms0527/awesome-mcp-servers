# tools/research_tool.py

import logging
from typing import Type
from tools.mcp_tool_adapter import call_mcp_tool
from config import WEB_SEARCH_MCP_URL
from langchain_core.tools import BaseTool
from pydantic import BaseModel, Field 
logger = logging.getLogger(__name__)

class ResearchInput(BaseModel):
    """Input schema for the Research Tool."""
    query: str = Field(description="The search query string to look up information about.")

class ResearchTool(BaseTool):
    name: str = "research_web"
    description: str = "Useful for searching the web to find information about a given query."

    args_schema: Type[BaseModel] = ResearchInput

    def _run(self, query: str) -> str: 
        """Use the tool synchronously."""
        logger.info(f"ResearchTool._run: Calling MCP tool for query: '{query}'")

        mcp_result = call_mcp_tool(
            mcp_server_url=WEB_SEARCH_MCP_URL,
            tool_name="search_web", 
            parameters={"query": query}, 
            task_id=None 
        )

        if mcp_result.status == "success":
            logger.info("ResearchTool._run: MCP tool call successful.")
            results = mcp_result.result.get("search_results", [])
            if results:
                 formatted_results = "\n".join([
                     f"Title: {r.get('title', 'N/A')}\nURL: {r.get('url', 'N/A')}\nSnippet: {r.get('snippet', 'N/A')}\n---"
                     for r in results
                 ])
                 return f"Search Results for '{query}':\n{formatted_results}"
            else:
                 return f"Search Results for '{query}': No results found."

        else:
            logger.error(f"ResearchTool._run: MCP tool call failed. Error: {mcp_result.error}")
            return f"Error calling search tool for '{query}': {mcp_result.error.get('message', 'Unknown error')}"

    async def _arun(self, query: str) -> str:
        """Use the tool asynchronously."""
        logger.info(f"ResearchTool._arun: Calling MCP tool for query: '{query}' (via sync _run)")
        return self._run(query)
research_tool_instance = ResearchTool()