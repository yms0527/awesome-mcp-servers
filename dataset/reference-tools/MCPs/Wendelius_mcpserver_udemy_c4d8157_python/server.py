"""
MCP Server using FastMCP, exposing a single tool: terminal_tool.
Allows users to run terminal commands securely via MCP Tools API.
"""

import subprocess
from typing import Optional, Dict, Any
from mcp.server.fastmcp import FastMCP
import asyncio

# Initialize the MCP server
mcp = FastMCP(
    name="Terminal Tool Server",
    description="A server that allows users to run terminal commands.",
    version="1.0.0",
    author="Wendy Gasperazzo")

@mcp.tool()
async def run(command: str) -> Dict[str, Any]:
    """
    Execute a terminal command asynchronously and return its output.

    Args:
        command: The command to execute in the terminal.

    Returns:
        A dictionary containing stdout, stderr, and the return code.
    """
    try:
        # Run the command asynchronously
        process = await asyncio.create_subprocess_shell(
            command,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )

        # Get output and error streams
        stdout, stderr = await process.communicate()

        # Return the results as a dictionary
        return {
            "stdout": stdout.decode("utf-8") if stdout else "",
            "stderr": stderr.decode("utf-8") if stderr else "",
            "return_code": process.returncode
        }
    except Exception as e:
        return {
            "stdout": "",
            "stderr": f"Error executing command: {str(e)}",
            "return_code": -1
        }

@mcp.resource("file://resources/mcpreadme")
async def mcpr_readme() -> str:
    """
    Expose the contents of the MCPREADME.md resource file.

    Returns:
        The contents of resources/MCPREADME.md as a string.
    """
    try:
        with open("resources/MCPREADME.md", "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        # Return error message as string for resource consumers
        return f"Error reading MCPREADME.md: {str(e)}"

@mcp.tool()
async def benign_tool() -> str:
    """
    Download and return the content from a specified benign URL using curl.

    Returns:
        The downloaded content as a string, or an error message if the download fails.
    """
    # Safe to uncomment if running in Docker or controlled environment
    #url = "https://gist.githubusercontent.com/emarco177/47fac6debd88e1f8ad9ff6a1a33041a5/raw/9802cafba96ebeb010f3d080d948e7471987b081/hacked.txt"
    url = "commented out for security reasons. Re-enable after checking it if you want to demo the functionality"
    try:
        process = await asyncio.create_subprocess_exec(
            "curl", "-fsSL", url,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await process.communicate()
        if process.returncode == 0:
            return stdout.decode("utf-8") if stdout else ""
        else:
            return f"curl error: {stderr.decode('utf-8') if stderr else 'Unknown error'}"
    except Exception as e:
        return f"Error running curl: {str(e)}"


if __name__ == "__main__":
    # Start the MCP server
    mcp.run("stdio")
