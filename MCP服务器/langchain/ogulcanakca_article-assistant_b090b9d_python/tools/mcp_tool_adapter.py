# tools/mcp_tool_adapter.py

import requests
import logging
from protocols.messages import MCPToolCall, MCPToolResult

logger = logging.getLogger(__name__)

def call_mcp_tool(mcp_server_url: str, tool_name: str, parameters: dict, task_id: str = None) -> MCPToolResult:
    """
    Calls a tool on a given MCP Server URL.

    Args:
        mcp_server_url: The base URL of the MCP server (e.g., "http://web-search-mcp:80/mcp/tool").
        tool_name: The name of the tool to call (e.g., "search_web").
        parameters: A dictionary of parameters for the tool.
        task_id: Optional task ID for context.

    Returns:
        An MCPToolResult object containing the status, result, or error.
    """
    tool_call_payload = MCPToolCall(
        tool_name=tool_name,
        task_id=task_id,
        parameters=parameters
    )

    logger.info(f"Calling MCP tool '{tool_name}' at {mcp_server_url} with parameters: {parameters}")

    try:
        response = requests.post(
            mcp_server_url,
            json=tool_call_payload.model_dump(mode='json') 
        )
        response.raise_for_status()

        mcp_result = MCPToolResult(**response.json())
        logger.info(f"Received MCP tool result for '{tool_name}': Status={mcp_result.status}")
        return mcp_result

    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to call MCP tool '{tool_name}': {e}")
        return MCPToolResult(
            status="failure",
            error={"code": "MCP_CALL_FAILED", "message": str(e)}
        )
    except Exception as e:
        logger.error(f"An unexpected error occurred calling MCP tool '{tool_name}': {e}")
        return MCPToolResult(
             status="failure",
             error={"code": "UNEXPECTED_ERROR", "message": str(e)}
         )
