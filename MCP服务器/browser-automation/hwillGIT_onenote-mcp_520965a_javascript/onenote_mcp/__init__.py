"""OneNote MCP Server package."""

from .server import mcp

def main():
    """Run the OneNote MCP server."""
    mcp.run()

if __name__ == "__main__":
    main()