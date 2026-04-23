import os
import logging
import redis
from mcp.server.fastmcp import FastMCP
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class RedisMCPError(Exception):
    """Custom exception for Redis MCP server errors."""
    pass

class RedisMCP:
    def __init__(self, name: str = "RedisServer"):
        """Initialize the Redis MCP server."""
        self.mcp_server = FastMCP(name)
        self.redis_client = self._initialize_redis()
        self._register_tools()

    def _initialize_redis(self) -> redis.StrictRedis:
        """Initialize Redis connection with error handling."""
        try:
            host = os.getenv('REDIS_HOST', 'localhost')
            port = int(os.getenv('REDIS_PORT', 6379))
            db = int(os.getenv('REDIS_DB', 0))
            
            client = redis.StrictRedis(
                host=host,
                port=port,
                db=db,
                decode_responses=True,
                socket_timeout=5,
                retry_on_timeout=True
            )
            
            # Test connection
            client.ping()
            logger.info(f"Successfully connected to Redis at {host}:{port}")
            return client
            
        except redis.ConnectionError as e:
            logger.error(f"Failed to connect to Redis: {str(e)}")
            raise RedisMCPError(f"Redis connection failed: {str(e)}")

    def _register_tools(self):
        """Register all Redis tools with the MCP server."""
        @self.mcp_server.tool()
        def set_redis_key(key: str, value: str) -> str:
            """Set a key-value pair in Redis."""
            try:
                self.redis_client.set(key, value)
                logger.info(f"Successfully set key '{key}'")
                return f"Key '{key}' set to '{value}'"
            except redis.RedisError as e:
                logger.error(f"Error setting key '{key}': {str(e)}")
                raise RedisMCPError(f"Failed to set key: {str(e)}")

        @self.mcp_server.tool()
        def get_redis_key(key: str) -> str:
            """Retrieve a value from Redis by key."""
            try:
                value = self.redis_client.get(key)
                if value:
                    logger.info(f"Successfully retrieved key '{key}'")
                    return f"Value for '{key}': {value}"
                else:
                    logger.warning(f"Key '{key}' not found")
                    return f"Key '{key}' not found"
            except redis.RedisError as e:
                logger.error(f"Error getting key '{key}': {str(e)}")
                raise RedisMCPError(f"Failed to get key: {str(e)}")

        @self.mcp_server.tool()
        def delete_redis_key(key: str) -> str:
            """Delete a key from Redis."""
            try:
                self.redis_client.delete(key)
                logger.info(f"Successfully deleted key '{key}'")
                return f"Key '{key}' deleted"
            except redis.RedisError as e:
                logger.error(f"Error deleting key '{key}': {str(e)}")
                raise RedisMCPError(f"Failed to delete key: {str(e)}")

        @self.mcp_server.tool()
        def list_redis_keys(pattern: str = '*') -> str:
            """List all keys in Redis matching the pattern."""
            try:
                keys = self.redis_client.keys(pattern)
                if keys:
                    logger.info(f"Successfully listed keys matching pattern '{pattern}'")
                    return f"Keys in Redis: {', '.join(keys)}"
                else:
                    logger.info(f"No keys found matching pattern '{pattern}'")
                    return f"No keys found matching pattern '{pattern}'"
            except redis.RedisError as e:
                logger.error(f"Error listing keys: {str(e)}")
                raise RedisMCPError(f"Failed to list keys: {str(e)}")

    def run(self, transport: str = 'stdio'):
        """Run the MCP server."""
        try:
            logger.info(f"Starting Redis MCP server with {transport} transport")
            self.mcp_server.run(transport=transport)
        except Exception as e:
            logger.error(f"Error running MCP server: {str(e)}")
            raise RedisMCPError(f"Failed to run server: {str(e)}")

def main():
    """Main entry point for the Redis MCP server."""
    try:
        server = RedisMCP()
        server.run(transport='stdio')
    except RedisMCPError as e:
        logger.error(f"Server error: {str(e)}")
        exit(1)
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
        exit(0)

if __name__ == "__main__":
    main() 