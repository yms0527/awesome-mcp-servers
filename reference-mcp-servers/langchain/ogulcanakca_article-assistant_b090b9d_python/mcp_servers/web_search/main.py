# mcp_servers/web_search/main.py 

from fastapi import FastAPI
from protocols.messages import MCPToolCall, MCPToolResult
import logging
import os
from typing import List, Dict, Any
import json

from langchain_anthropic import ChatAnthropic 

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Web Search MCP Server (Claude)")

anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")
if not anthropic_api_key:
    logger.error("ANTHROPIC_API_KEY environment variable not set in Web Search MCP!")
    raise EnvironmentError("ANTHROPIC_API_KEY environment variable not set!")

llm = ChatAnthropic(model="claude-3-haiku-20240307", temperature=0.1, anthropic_api_key=anthropic_api_key)
logger.info("Web Search MCP Server: LLM initialized for simulated search (using Claude).")

@app.get("/")
async def read_root():
    return {"message": "Web Search MCP Server is running with Claude simulated search"}

@app.post("/mcp/tool", response_model=MCPToolResult)
async def call_tool(tool_call: MCPToolCall):
    """
    Receives an MCP tool call and returns a result using LLM simulated search (Claude).
    """
    logger.info(f"Received MCP Tool Call: {tool_call.model_dump_json(indent=2)}")

    if tool_call.tool_name == "search_web":
        topic = tool_call.parameters.get("query")
        num_results = tool_call.parameters.get("num_results", 3)
        logger.info(f"Received request to simulate search for: {topic} (Num results: {num_results}) using Claude")

        if not topic:
            logger.warning("Search request received without a query.")
            return MCPToolResult(
                status="failure",
                error={"code": "MISSING_PARAMETER", "message": "Search query is missing."}
            )

        search_prompt_template = """
        You are a simulated web search engine. When given a search query, provide a list of relevant, but fake, search results.
        Provide exactly {num_results} results. Each result should be a JSON object with the following keys: "title", "url", "snippet".
        Ensure the URL is a valid-looking URL (e.g., starts with http:// or https://).
        Respond only with the JSON list, nothing else.

        Search Query: {query}

        JSON Results:
        """
        prompt = search_prompt_template.format(query=topic, num_results=num_results)
        logger.info(f"Web Search MCP: Sending prompt to Claude LLM for simulated search...")

        try:
            llm_response = llm.invoke(prompt) 
            logger.info(f"Web Search MCP: Received Claude LLM response for simulated search.")
            
            json_string = llm_response.content.strip()
            if json_string.startswith("```json"):
                json_string = json_string[7:].strip()
            if json_string.endswith("```"):
                json_string = json_string[:-3].strip()

            simulated_results: List[Dict[str, Any]] = json.loads(json_string)

            if not isinstance(simulated_results, list) or not all(isinstance(item, dict) for item in simulated_results):
                raise ValueError("LLM did not return a valid JSON list of objects.")

            logger.info(f"Web Search MCP: Simulated search successful, returning {len(simulated_results)} results.")
            return MCPToolResult(
                status="success",
                result={"search_results": simulated_results}
            )

        except Exception as e:
            logger.error(f"Web Search MCP: Error during Claude LLM simulated search or parsing: {e}")
            return MCPToolResult(
                status="failure",
                error={"code": "LLM_SEARCH_ERROR", "message": f"Simulated search failed: {e}"}
            )

    else:
        logger.warning(f"Web Search MCP: Received call for unknown tool: {tool_call.tool_name}")
        return MCPToolResult(
                 status="failure",
                 error={"code": "TOOL_NOT_FOUND", "message": f"Tool '{tool_call.tool_name}' not found."}
               )