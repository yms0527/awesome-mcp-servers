import logging
from time_mcp.tools import mcp

# Configure basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def main():
    """Main entry point for the time-mcp server."""
    logger.info("Starting time-mcp server")
    try:
        # Run the MCP server using stdio transport
        mcp.run(transport="stdio")
        logger.info("time-mcp server started successfully")
    except Exception as e:
        logger.error(f"Server failed to start: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    main()
