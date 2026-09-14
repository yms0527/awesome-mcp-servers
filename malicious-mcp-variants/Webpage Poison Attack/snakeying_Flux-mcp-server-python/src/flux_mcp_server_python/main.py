import argparse
import os
import sys
import logging
import logging.handlers
from dotenv import load_dotenv

load_dotenv(override=True)

try:
    import uvicorn
except ImportError:
    uvicorn = None 

from . import config
from .server_logic import mcp_asgi_app_for_http

LOG_DIR = "logs"
LOG_FILENAME = "flux_mcp_server.log"
LOG_MAX_BYTES = 5 * 1024 * 1024
LOG_BACKUP_COUNT = 1

logger = logging.getLogger(__name__)

def setup_logging(level_str: str = "INFO"):
    log_level = getattr(logging, level_str.upper(), logging.INFO)
    log_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    
    if not os.path.exists(LOG_DIR):
        try:
            os.makedirs(LOG_DIR)
            print(f"Log directory '{LOG_DIR}' created.")
        except OSError as e:
            print(f"Error: Could not create log directory '{LOG_DIR}'. Logging to console only. Error: {e}", file=sys.stderr)
            logging.basicConfig(stream=sys.stdout, level=log_level, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
            return

    log_file_path = os.path.join(LOG_DIR, LOG_FILENAME)

    file_handler = logging.handlers.RotatingFileHandler(
        log_file_path,
        maxBytes=LOG_MAX_BYTES,
        backupCount=LOG_BACKUP_COUNT,
        encoding='utf-8'
    )
    file_handler.setFormatter(log_formatter)
    file_handler.setLevel(log_level)

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(log_formatter)
    console_handler.setLevel(log_level)

    root_logger = logging.getLogger()
    root_logger.setLevel(log_level) 
    
    if root_logger.hasHandlers():
        root_logger.handlers.clear()
        
    root_logger.addHandler(file_handler)
    root_logger.addHandler(console_handler)

    logger.info(f"Logging configured. Level: {level_str.upper()}. Output to console and '{log_file_path}'.")

def run_server_cli():
    parser = argparse.ArgumentParser(
        description="SiliconFlow FLUX MCP Server (Python Version) - HTTP Mode Only",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    parser.add_argument(
        "--host",
        default=os.getenv("MCP_HTTP_HOST", config.DEFAULT_HTTP_HOST),
        help="Host address to bind the HTTP server to."
    )
    parser.add_argument(
        "--port",
        type=int,
        default=int(os.getenv("MCP_HTTP_PORT", config.DEFAULT_HTTP_PORT)),
        help="Port number to bind the HTTP server to."
    )
    parser.add_argument(
        "--env-file",
        default=None,
        help="Path to a .env file to load (will override default .env and OS env vars for this session)."
    )
    parser.add_argument(
        "--log-level",
        default=os.getenv("MCP_LOG_LEVEL", "INFO").upper(),
        choices=["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"],
        help="Set the application logging level."
    )
    args = parser.parse_args()

    setup_logging(args.log_level)

    if args.env_file:
        if os.path.exists(args.env_file):
            logger.info(f"Attempting to load environment variables from specified file: {args.env_file}")
            load_dotenv(dotenv_path=args.env_file, override=True)
            config_file_name = args.env_file
        else:
            logger.critical(f"Specified configuration file '{args.env_file}' not found.")
            logger.critical(f"Please ensure the file exists and contains your SiliconFlow API keys.")
            sys.exit(1)
    else:
        logger.info("Using environment variables from default .env (if loaded at script start) or system environment.")
        # Check for default .env file
        env_file_path = ".env"
        if not os.path.exists(env_file_path):
            logger.critical(f"Configuration file '{env_file_path}' not found.")
            logger.critical("Please copy '.env.example' to '.env' and configure your SiliconFlow API keys.")
            logger.critical("Example: cp .env.example .env")
            sys.exit(1)
        config_file_name = env_file_path

    config.log_effective_defaults()

    config.load_api_keys_from_env()

    if not config._api_keys_list:
        logger.critical(
            f"No SiliconFlow API Keys found after loading environment. "
            f"Please set '{config.SILICONFLOW_API_KEYS_ENV_VAR}' in your configuration file '{config_file_name}'."
        )
        logger.critical("Example configuration:")
        logger.critical("SILICONFLOW_API_KEYS=sk-your-key1,sk-your-key2")
        sys.exit(1)

    if uvicorn is None:
        logger.critical("'uvicorn' is required for HTTP server but not installed. Please install it: uv pip install uvicorn[standard]")
        sys.exit(1)
            
    logger.info(f"Starting SiliconFlow FLUX MCP server (Python) with Uvicorn on http://{args.host}:{args.port}")
    logger.info(f"MCP endpoints are expected by clients at paths like /mcp (server may handle redirection to /mcp/) relative to this address.")
    
    try:
        uvicorn.run(
            "flux_mcp_server_python.server_logic:mcp_asgi_app_for_http",
            host=args.host,
            port=args.port,
            log_config=None, 
            reload=False 
        )
    except Exception as e:
        logger.critical(f"Failed to run HTTP server with Uvicorn: {e}", exc_info=True)
        sys.exit(1)

if __name__ == "__main__":
    run_server_cli()
