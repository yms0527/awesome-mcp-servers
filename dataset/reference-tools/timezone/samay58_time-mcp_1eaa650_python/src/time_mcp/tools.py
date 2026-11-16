from datetime import datetime
from zoneinfo import ZoneInfo
import json
import logging
from mcp.server.fastmcp import FastMCP
from time_mcp.models import TimeRequest

# Initialize FastMCP server instance (the name here should match your package)
mcp = FastMCP("time-mcp")
logger = logging.getLogger(__name__)


@mcp.tool()
async def get_current_time(params: TimeRequest) -> str:
    """
    Return the current time in the specified timezone.

    Args:
        params: TimeRequest model with a 'timezone' field.

    Returns:
        A JSON string containing the formatted current time.
    """
    try:
        # Convert current UTC time to the specified timezone using zoneinfo
        tz = ZoneInfo(params.timezone)
        current_time = datetime.now(tz)
        # Format the time in a readable format (ISO format recommended)
        formatted_time = current_time.isoformat()
        return json.dumps(
            {"timezone": params.timezone, "current_time": formatted_time}, indent=2
        )
    except Exception as e:
        logger.error(f"Error retrieving time for timezone {params.timezone}: {e}")
        raise ValueError(
            f"Invalid timezone '{params.timezone}' or error processing request."
        )
