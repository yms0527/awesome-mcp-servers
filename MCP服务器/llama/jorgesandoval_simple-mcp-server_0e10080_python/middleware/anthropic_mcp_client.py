#!/usr/bin/env python3
import logging
import os
import json
from typing import Dict, List, Optional, Any
import asyncio
import requests

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)

logger = logging.getLogger(__name__)

class MCPClient:
    """Client for interacting with the Anthropic MCP server."""
    
    def __init__(self, server_url: str = "http://mcp-server-container:3000"):
        """Initialize the MCP client with the server URL."""
        self.server_url = server_url
        logger.info(f"Initialized MCP client for server: {server_url}")
    
    async def store_context(self, session_id: str, content: str) -> str:
        """Store or update conversation context for a specific session.
        
        Args:
            session_id: Unique identifier for the conversation session
            content: The content to add to the context
        
        Returns:
            A success message from the MCP server
        """
        try:
            response = requests.post(
                f"{self.server_url}",
                json={
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "tools/call",
                    "params": {
                        "name": "store_context",
                        "arguments": {
                            "session_id": session_id,
                            "content": content
                        }
                    }
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                if "result" in result:
                    return result["result"]
                else:
                    error_msg = f"Failed to store context: {result.get('error', 'Unknown error')}"
                    logger.error(error_msg)
                    raise Exception(error_msg)
            else:
                error_msg = f"Failed to store context: {response.status_code} - {response.text}"
                logger.error(error_msg)
                raise Exception(error_msg)
        
        except Exception as e:
            logger.error(f"Error storing context: {e}")
            raise
    
    async def get_context(self, session_id: str) -> str:
        """Retrieve conversation context for a specific session.
        
        Args:
            session_id: Unique identifier for the conversation session
        
        Returns:
            The conversation context for the specified session
        """
        try:
            response = requests.post(
                f"{self.server_url}",
                json={
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "tools/call",
                    "params": {
                        "name": "get_context",
                        "arguments": {
                            "session_id": session_id
                        }
                    }
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                if "result" in result:
                    return result["result"]
                else:
                    error_msg = f"Failed to get context: {result.get('error', 'Unknown error')}"
                    logger.error(error_msg)
                    raise Exception(error_msg)
            else:
                error_msg = f"Failed to get context: {response.status_code} - {response.text}"
                logger.error(error_msg)
                raise Exception(error_msg)
        
        except Exception as e:
            logger.error(f"Error getting context: {e}")
            raise
    
    async def delete_context(self, session_id: str) -> str:
        """Delete conversation context for a specific session.
        
        Args:
            session_id: Unique identifier for the conversation session
        
        Returns:
            A success or failure message
        """
        try:
            response = requests.post(
                f"{self.server_url}",
                json={
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "tools/call",
                    "params": {
                        "name": "delete_context",
                        "arguments": {
                            "session_id": session_id
                        }
                    }
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                if "result" in result:
                    return result["result"]
                else:
                    error_msg = f"Failed to delete context: {result.get('error', 'Unknown error')}"
                    logger.error(error_msg)
                    raise Exception(error_msg)
            else:
                error_msg = f"Failed to delete context: {response.status_code} - {response.text}"
                logger.error(error_msg)
                raise Exception(error_msg)
        
        except Exception as e:
            logger.error(f"Error deleting context: {e}")
            raise
    
    async def list_sessions(self) -> str:
        """List all active conversation sessions.
        
        Returns:
            A formatted list of active sessions with their last updated timestamp
        """
        try:
            response = requests.post(
                f"{self.server_url}",
                json={
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "tools/call",
                    "params": {
                        "name": "list_sessions",
                        "arguments": {}
                    }
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                if "result" in result:
                    return result["result"]
                else:
                    error_msg = f"Failed to list sessions: {result.get('error', 'Unknown error')}"
                    logger.error(error_msg)
                    raise Exception(error_msg)
            else:
                error_msg = f"Failed to list sessions: {response.status_code} - {response.text}"
                logger.error(error_msg)
                raise Exception(error_msg)
        
        except Exception as e:
            logger.error(f"Error listing sessions: {e}")
            raise
    
    async def get_server_info(self) -> Dict[str, Any]:
        """Get information about the MCP server.
        
        Returns:
            Server information dictionary
        """
        try:
            response = requests.post(
                f"{self.server_url}",
                json={
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "initialize",
                    "params": {
                        "protocol_version": "2024-03-26",
                        "client_info": {
                            "name": "mcp-client",
                            "version": "1.0.0"
                        },
                        "capabilities": {}
                    }
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                if "result" in result and "server_info" in result["result"]:
                    return result["result"]["server_info"]
                else:
                    error_msg = f"Failed to get server info: {result.get('error', 'Unknown error')}"
                    logger.error(error_msg)
                    raise Exception(error_msg)
            else:
                error_msg = f"Failed to get server info: {response.status_code} - {response.text}"
                logger.error(error_msg)
                raise Exception(error_msg)
        
        except Exception as e:
            logger.error(f"Error getting server info: {e}")
            raise 