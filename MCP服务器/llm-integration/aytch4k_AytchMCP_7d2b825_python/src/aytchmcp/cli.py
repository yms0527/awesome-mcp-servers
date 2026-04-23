"""
Command-line interface for AytchMCP.

This module provides a command-line interface for the AytchMCP server.
"""

import argparse
import asyncio
import os
import sys
from pathlib import Path

from loguru import logger

from aytchmcp.config import load_config
from aytchmcp.server import AytchMCPServer


def parse_args():
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(
        description="AytchMCP - Aytch4K Model Context Protocol Server"
    )
    
    # Server commands
    subparsers = parser.add_subparsers(dest="command", help="Command to run")
    
    # Start server command
    start_parser = subparsers.add_parser("start", help="Start the MCP server")
    start_parser.add_argument(
        "--host", type=str, help="Host to bind the server to"
    )
    start_parser.add_argument(
        "--port", type=int, help="Port to bind the server to"
    )
    start_parser.add_argument(
        "--config", type=str, help="Path to the configuration directory or file"
    )
    start_parser.add_argument(
        "--log-level", type=str, help="Logging level"
    )
    start_parser.add_argument(
        "--debug", action="store_true", help="Enable debug mode"
    )
    
    # Init command
    init_parser = subparsers.add_parser(
        "init", help="Initialize a new MCP server configuration"
    )
    init_parser.add_argument(
        "--dir", type=str, default="./config", help="Directory to create configuration in"
    )
    
    # List resources command
    subparsers.add_parser(
        "list-resources", help="List available resources"
    )
    
    # List tools command
    subparsers.add_parser(
        "list-tools", help="List available tools"
    )
    
    # Version command
    subparsers.add_parser(
        "version", help="Show version information"
    )
    
    return parser.parse_args()


def init_config(config_dir: str):
    """Initialize a new MCP server configuration."""
    config_dir = Path(config_dir)
    
    # Create config directory if it doesn't exist
    config_dir.mkdir(parents=True, exist_ok=True)
    
    # Create config files
    config_files = {
        "config.json": {
            "tools_enabled": ["echo", "weather", "calculator"],
            "resources_enabled": ["system_info", "documentation"],
        },
        "branding.json": {
            "name": "Aytch4K MCP",
            "description": "Aytch4K Model Context Protocol Server",
            "logo_url": None,
            "primary_color": "#4A90E2",
            "secondary_color": "#50E3C2",
        },
        "llm.json": {
            "provider": "openai",
            "model": "gpt-4",
            "api_key_env_var": "OPENAI_API_KEY",
            "api_base_url": None,
            "additional_params": {},
        },
        "server.json": {
            "host": "0.0.0.0",
            "port": 8000,
            "log_level": "INFO",
            "debug": False,
            "cors_origins": ["*"],
            "max_request_size": 10485760,
        },
    }
    
    import json
    
    for filename, content in config_files.items():
        file_path = config_dir / filename
        with open(file_path, "w") as f:
            json.dump(content, f, indent=2)
        
        logger.info(f"Created configuration file: {file_path}")
    
    logger.info(f"Initialized MCP server configuration in {config_dir}")


def list_resources():
    """List available resources."""
    from aytchmcp.resources import get_available_resources
    
    resources = get_available_resources()
    
    print("Available resources:")
    for resource in resources:
        print(f"  - {resource}")


def list_tools():
    """List available tools."""
    from aytchmcp.tools import get_available_tools
    
    tools = get_available_tools()
    
    print("Available tools:")
    for tool in tools:
        print(f"  - {tool}")


def show_version():
    """Show version information."""
    from aytchmcp import __version__
    
    print(f"AytchMCP version: {__version__}")


async def start_server(args):
    """Start the MCP server."""
    # Set environment variables from command-line arguments
    if args.host:
        os.environ["MCP_HOST"] = args.host
    if args.port:
        os.environ["MCP_PORT"] = str(args.port)
    if args.log_level:
        os.environ["LOG_LEVEL"] = args.log_level
    if args.debug:
        os.environ["DEBUG"] = "true"
    
    # Load configuration
    if args.config:
        config = load_config(args.config)
    
    # Start server
    server = AytchMCPServer()
    await server.start()


def main():
    """Run the CLI."""
    args = parse_args()
    
    if args.command == "start":
        asyncio.run(start_server(args))
    elif args.command == "init":
        init_config(args.dir)
    elif args.command == "list-resources":
        list_resources()
    elif args.command == "list-tools":
        list_tools()
    elif args.command == "version":
        show_version()
    else:
        # If no command is provided, show help
        print("No command provided. Use --help for usage information.")
        sys.exit(1)


if __name__ == "__main__":
    main()