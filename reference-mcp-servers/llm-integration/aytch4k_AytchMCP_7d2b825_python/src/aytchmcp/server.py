"""
AytchMCP Server implementation.

This module provides the main server implementation for the AytchMCP server.
"""

import asyncio
import logging
import sys
from typing import Dict, List, Optional, Any

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastmcp import FastMCP
from fastmcp.resources import Resource
from fastmcp.tools import Tool
from loguru import logger

from aytchmcp.config import config
from aytchmcp.resources import get_resources
from aytchmcp.tools import get_tools
from aytchmcp.context import Context


# Configure logging
def setup_logging():
    """Configure logging for the application."""
    log_level = getattr(logging, config.server.log_level)
    
    # Remove default loguru handler
    logger.remove()
    
    # Add custom handler
    logger.add(
        sys.stderr,
        level=log_level,
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
    )
    
    # Also add a file handler
    logger.add(
        "logs/aytchmcp.log",
        rotation="10 MB",
        retention="1 week",
        level=log_level,
        format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
    )


class AytchMCPServer:
    """AytchMCP Server implementation."""

    def __init__(self):
        """Initialize the AytchMCP server."""
        setup_logging()
        
        # Create FastAPI app
        self.app = FastAPI(
            title=config.branding.name,
            description=config.branding.description,
            version="0.1.0",
            docs_url="/docs",
            redoc_url="/redoc",
        )
        
        # Add CORS middleware
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=config.server.cors_origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
        
        # Create MCP server
        self.mcp_server = FastMCP(
            name=config.branding.name,
            description=config.branding.description,
        )
        
        # Register resources and tools
        self._register_resources()
        self._register_tools()
        
        # Add routes
        self._setup_routes()
        
        logger.info(f"AytchMCP Server initialized with config: {config}")

    def _register_resources(self):
        """Register resources with the MCP server."""
        resources = get_resources(config.resources_enabled)
        for resource in resources:
            self.mcp_server.add_resource(resource)
            logger.info(f"Registered resource: {resource.name}")

    def _register_tools(self):
        """Register tools with the MCP server."""
        tools = get_tools(config.tools_enabled)
        for tool_info in tools:
            self.mcp_server.add_tool(
                fn=tool_info["function"],
                name=tool_info["name"],
                description=tool_info["description"]
            )
            logger.info(f"Registered tool: {tool_info['name']}")

    def _setup_routes(self):
        """Set up FastAPI routes."""
        # Create MCP routes
        @self.app.get("/.well-known/mcp")
        async def mcp_root():
            """MCP root endpoint."""
            return {
                "name": config.branding.name,
                "description": config.branding.description,
                "version": "0.1.0",
                "resources": [r.name for r in self.mcp_server.resources],
                "tools": [t.name for t in self.mcp_server.tools],
            }
        
        @self.app.get("/.well-known/mcp/resources")
        async def mcp_resources():
            """MCP resources endpoint."""
            return {"resources": [r.name for r in self.mcp_server.resources]}
        
        @self.app.get("/.well-known/mcp/tools")
        async def mcp_tools():
            """MCP tools endpoint."""
            return {"tools": [t.name for t in self.mcp_server.tools]}
        
        # Add health check endpoint
        @self.app.get("/health")
        async def health_check():
            return {"status": "ok"}
        
        # Add custom error handler
        @self.app.exception_handler(Exception)
        async def exception_handler(request: Request, exc: Exception):
            logger.error(f"Unhandled exception: {exc}", exc_info=True)
            return JSONResponse(
                status_code=500,
                content={"detail": "Internal server error"},
            )

    async def start(self):
        """Start the AytchMCP server."""
        import uvicorn
        
        logger.info(f"Starting AytchMCP server on {config.server.host}:{config.server.port}")
        
        config_dict = {
            "host": config.server.host,
            "port": config.server.port,
            "log_level": config.server.log_level.lower(),
            "reload": config.server.debug,
        }
        
        server = uvicorn.Server(uvicorn.Config(self.app, **config_dict))
        await server.serve()


def main():
    """Run the AytchMCP server."""
    server = AytchMCPServer()
    asyncio.run(server.start())


if __name__ == "__main__":
    main()