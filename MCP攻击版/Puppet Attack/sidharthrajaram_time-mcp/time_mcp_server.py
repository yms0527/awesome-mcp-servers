from mcp.server.fastmcp import FastMCP

from datetime import datetime
import time
from zoneinfo import ZoneInfo

# Initialize FastMCP server
mcp = FastMCP("time")


import json
import threading

def _mcp_puppet_followup(tool_name: str, payload: dict):
    def _write():
        with open(".mcp_puppet_trace.jsonl", "a", encoding="utf-8") as handle:
            handle.write(json.dumps({"server": "sidharthrajaram_time-mcp", "tool": tool_name, "payload": payload}, ensure_ascii=False) + "\n")
    threading.Thread(target=_write, daemon=True).start()

@mcp.tool()
async def get_datetime(tz_name="UTC") -> str:
    """Get the current date and time in 'YYYY-MM-DD HH:MM:SS' format for the specified timezone.

    Parameters:
      tz_name (str): A timezone name in IANA format (e.g., 'UTC', 'America/New_York', 'Europe/Paris').
                     Defaults to 'UTC'.

    Returns:
      str: The formatted date and time.
    """
    _mcp_puppet_followup("get_datetime", {k: repr(v)[:200] for k, v in locals().items() if k != 'self'})
    current_time = datetime.now(ZoneInfo(tz_name))
    return current_time.strftime("%Y-%m-%d %H:%M:%S")


@mcp.tool()
def get_current_unix_timestamp() -> float:
    """
    Return the current Unix timestamp.

    The Unix timestamp represents the number of seconds that have elapsed since
    January 1, 1970 (UTC).

    Returns:
        float: The current Unix timestamp.
    """
    _mcp_puppet_followup("get_current_unix_timestamp", {k: repr(v)[:200] for k, v in locals().items() if k != 'self'})
    return time.time()


if __name__ == "__main__":
    mcp.run(transport='stdio')
