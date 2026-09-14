#!/usr/bin/env python3
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse, JSONResponse
import logging
import os
import sqlite3
import json
from datetime import datetime
from typing import Dict, List, Optional, Any, Union

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)

logger = logging.getLogger(__name__)

# Database setup
DATABASE_PATH = os.environ.get("DATABASE_PATH", "context.db")

def init_db() -> None:
    """Initialize the database with the necessary tables."""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS context (
        session_id TEXT PRIMARY KEY,
        context TEXT NOT NULL,
        updated_at TIMESTAMP NOT NULL
    )
    ''')
    
    conn.commit()
    conn.close()
    logger.info("Database initialized")

# Create FastAPI app
app = FastAPI()

# Database operations
def db_store_context(session_id: str, content: str) -> str:
    """Store or update conversation context for a specific session."""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM context WHERE session_id = ?", (session_id,))
    row = cursor.fetchone()
    
    current_time = datetime.now().isoformat()
    
    if row:
        # Append to existing context
        existing_context = row["context"]
        new_context = f"{existing_context}\n{content}"
        
        cursor.execute(
            "UPDATE context SET context = ?, updated_at = ? WHERE session_id = ?",
            (new_context, current_time, session_id)
        )
    else:
        # Create new context
        new_context = content
        cursor.execute(
            "INSERT INTO context (session_id, context, updated_at) VALUES (?, ?, ?)",
            (session_id, new_context, current_time)
        )
    
    conn.commit()
    conn.close()
    
    return new_context

def db_get_context(session_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve conversation context for a specific session."""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM context WHERE session_id = ?", (session_id,))
    row = cursor.fetchone()
    
    conn.close()
    
    if row:
        return {
            "session_id": row["session_id"],
            "context": row["context"],
            "updated_at": row["updated_at"]
        }
    
    return None

def db_delete_context(session_id: str) -> bool:
    """Delete conversation context for a specific session."""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM context WHERE session_id = ?", (session_id,))
    deleted = cursor.rowcount > 0
    
    conn.commit()
    conn.close()
    
    return deleted

def db_list_sessions() -> List[Dict[str, Any]]:
    """List all active conversation sessions."""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT session_id, updated_at FROM context ORDER BY updated_at DESC")
    rows = cursor.fetchall()
    
    conn.close()
    
    return [
        {
            "session_id": row["session_id"],
            "updated_at": row["updated_at"]
        }
        for row in rows
    ]

# Add a GET handler for the root endpoint to support HTTP SSE
@app.get("/")
async def root_get():
    """Handle GET requests to the root endpoint."""
    return {"status": "ok", "message": "Anthropic MCP Server is running"}

# MCP JSON-RPC endpoint
@app.post("/")
async def mcp_jsonrpc(request: Request):
    # Parse the request body as JSON
    body = await request.json()
    
    # Check if it's a valid JSON-RPC request
    if "jsonrpc" not in body or "method" not in body or "id" not in body:
        return JSONResponse(
            status_code=400,
            content={"error": {"code": -32600, "message": "Invalid Request"}}
        )
    
    method = body["method"]
    request_id = body["id"]
    
    # Handle different methods
    if method == "initialize":
        # Handle initialization
        return JSONResponse(
            content={
                "jsonrpc": "2.0",
                "id": request_id,
                "result": {
                    "server_info": {
                        "name": "anthropic-mcp-server",
                        "version": "1.0.0",
                        "description": "An MCP server that manages conversation context for Anthropic models"
                    },
                    "capabilities": {
                        "tools": {},
                        "resources": {},
                        "prompts": {}
                    }
                }
            }
        )
    
    elif method == "tools/list":
        # Return list of available tools
        return JSONResponse(
            content={
                "jsonrpc": "2.0",
                "id": request_id,
                "result": {
                    "tools": [
                        {
                            "name": "store_context",
                            "description": "Store or update conversation context for a specific session",
                            "inputSchema": {
                                "type": "object",
                                "properties": {
                                    "session_id": {"type": "string"},
                                    "content": {"type": "string"}
                                },
                                "required": ["session_id", "content"]
                            },
                            "annotations": {
                                "title": "Store Conversation Context",
                                "readOnlyHint": False,
                                "destructiveHint": False,
                                "idempotentHint": False
                            }
                        },
                        {
                            "name": "get_context",
                            "description": "Retrieve conversation context for a specific session",
                            "inputSchema": {
                                "type": "object",
                                "properties": {
                                    "session_id": {"type": "string"}
                                },
                                "required": ["session_id"]
                            },
                            "annotations": {
                                "title": "Get Conversation Context",
                                "readOnlyHint": True,
                                "destructiveHint": False,
                                "idempotentHint": True
                            }
                        },
                        {
                            "name": "delete_context",
                            "description": "Delete conversation context for a specific session",
                            "inputSchema": {
                                "type": "object",
                                "properties": {
                                    "session_id": {"type": "string"}
                                },
                                "required": ["session_id"]
                            },
                            "annotations": {
                                "title": "Delete Conversation Context",
                                "readOnlyHint": False,
                                "destructiveHint": True,
                                "idempotentHint": True
                            }
                        },
                        {
                            "name": "list_sessions",
                            "description": "List all active conversation sessions",
                            "inputSchema": {
                                "type": "object",
                                "properties": {},
                                "required": []
                            },
                            "annotations": {
                                "title": "List Active Sessions",
                                "readOnlyHint": True,
                                "destructiveHint": False,
                                "idempotentHint": True
                            }
                        }
                    ]
                }
            }
        )
    
    elif method == "tools/call":
        # Call a specific tool
        if "params" not in body or "name" not in body["params"]:
            return JSONResponse(
                status_code=400,
                content={"error": {"code": -32602, "message": "Invalid params"}}
            )
        
        tool_name = body["params"]["name"]
        tool_arguments = body["params"].get("arguments", {})
        
        # Handle tool calls
        if tool_name == "store_context":
            if "session_id" not in tool_arguments or "content" not in tool_arguments:
                return JSONResponse(
                    status_code=400,
                    content={"error": {"code": -32602, "message": "Missing required arguments"}}
                )
            
            session_id = tool_arguments["session_id"]
            content = tool_arguments["content"]
            
            try:
                db_store_context(session_id, content)
                return JSONResponse(
                    content={
                        "jsonrpc": "2.0",
                        "id": request_id,
                        "result": f"Context for session '{session_id}' has been updated."
                    }
                )
            except Exception as e:
                logger.error(f"Error storing context: {e}")
                return JSONResponse(
                    status_code=500,
                    content={"error": {"code": -32000, "message": f"Error storing context: {str(e)}"}}
                )
        
        elif tool_name == "get_context":
            if "session_id" not in tool_arguments:
                return JSONResponse(
                    status_code=400,
                    content={"error": {"code": -32602, "message": "Missing required arguments"}}
                )
            
            session_id = tool_arguments["session_id"]
            
            try:
                context_data = db_get_context(session_id)
                
                if context_data:
                    return JSONResponse(
                        content={
                            "jsonrpc": "2.0",
                            "id": request_id,
                            "result": context_data["context"]
                        }
                    )
                else:
                    return JSONResponse(
                        content={
                            "jsonrpc": "2.0",
                            "id": request_id,
                            "result": f"No context found for session '{session_id}'."
                        }
                    )
            except Exception as e:
                logger.error(f"Error getting context: {e}")
                return JSONResponse(
                    status_code=500,
                    content={"error": {"code": -32000, "message": f"Error getting context: {str(e)}"}}
                )
        
        elif tool_name == "delete_context":
            if "session_id" not in tool_arguments:
                return JSONResponse(
                    status_code=400,
                    content={"error": {"code": -32602, "message": "Missing required arguments"}}
                )
            
            session_id = tool_arguments["session_id"]
            
            try:
                deleted = db_delete_context(session_id)
                
                if deleted:
                    return JSONResponse(
                        content={
                            "jsonrpc": "2.0",
                            "id": request_id,
                            "result": f"Context for session '{session_id}' has been deleted."
                        }
                    )
                else:
                    return JSONResponse(
                        content={
                            "jsonrpc": "2.0",
                            "id": request_id,
                            "result": f"No context found for session '{session_id}'."
                        }
                    )
            except Exception as e:
                logger.error(f"Error deleting context: {e}")
                return JSONResponse(
                    status_code=500,
                    content={"error": {"code": -32000, "message": f"Error deleting context: {str(e)}"}}
                )
        
        elif tool_name == "list_sessions":
            try:
                sessions = db_list_sessions()
                
                if not sessions:
                    return JSONResponse(
                        content={
                            "jsonrpc": "2.0",
                            "id": request_id,
                            "result": "No active sessions found."
                        }
                    )
                
                result = "Active sessions:\n"
                for session in sessions:
                    result += f"- {session['session_id']} (last updated: {session['updated_at']})\n"
                
                return JSONResponse(
                    content={
                        "jsonrpc": "2.0",
                        "id": request_id,
                        "result": result
                    }
                )
            except Exception as e:
                logger.error(f"Error listing sessions: {e}")
                return JSONResponse(
                    status_code=500,
                    content={"error": {"code": -32000, "message": f"Error listing sessions: {str(e)}"}}
                )
        
        else:
            return JSONResponse(
                status_code=404,
                content={"error": {"code": -32601, "message": f"Tool '{tool_name}' not found"}}
            )
    
    # Handle resources endpoints
    elif method == "resources/list":
        try:
            sessions = db_list_sessions()
            resources = []
            
            # Add specific conversation resources
            for session in sessions:
                resources.append({
                    "uri": f"conversation://{session['session_id']}",
                    "name": f"Conversation: {session['session_id']}",
                    "description": f"Conversation context for session {session['session_id']}",
                    "mimeType": "text/plain"
                })
            
            # Add resource template for any conversation
            resources.append({
                "uriTemplate": "conversation://{session_id}",
                "name": "Conversation Context",
                "description": "Access conversation context by session ID",
                "mimeType": "text/plain"
            })
            
            return JSONResponse(
                content={
                    "jsonrpc": "2.0",
                    "id": request_id,
                    "result": {
                        "resources": resources
                    }
                }
            )
        except Exception as e:
            logger.error(f"Error listing resources: {e}")
            return JSONResponse(
                status_code=500,
                content={"error": {"code": -32000, "message": f"Error listing resources: {str(e)}"}}
            )
    
    elif method == "resources/read":
        if "params" not in body or "uri" not in body["params"]:
            return JSONResponse(
                status_code=400,
                content={"error": {"code": -32602, "message": "Missing required parameters"}}
            )
        
        uri = body["params"]["uri"]
        
        try:
            # Extract session_id from URI
            if uri.startswith("conversation://"):
                session_id = uri.replace("conversation://", "")
                context_data = db_get_context(session_id)
                
                if context_data:
                    return JSONResponse(
                        content={
                            "jsonrpc": "2.0",
                            "id": request_id,
                            "result": {
                                "contents": [
                                    {
                                        "uri": uri,
                                        "mimeType": "text/plain",
                                        "text": context_data["context"]
                                    }
                                ]
                            }
                        }
                    )
            
            # Resource not found
            return JSONResponse(
                content={
                    "jsonrpc": "2.0",
                    "id": request_id,
                    "result": {
                        "contents": []
                    }
                }
            )
        except Exception as e:
            logger.error(f"Error reading resource: {e}")
            return JSONResponse(
                status_code=500,
                content={"error": {"code": -32000, "message": f"Error reading resource: {str(e)}"}}
            )
    
    # Handle prompts endpoints
    elif method == "prompts/list":
        return JSONResponse(
            content={
                "jsonrpc": "2.0",
                "id": request_id,
                "result": {
                    "prompts": [
                        {
                            "name": "summarize-conversation",
                            "description": "Summarize the conversation context for a specific session",
                            "arguments": [
                                {
                                    "name": "session_id",
                                    "description": "Unique identifier for the conversation session",
                                    "required": True
                                }
                            ]
                        },
                        {
                            "name": "extract-tasks",
                            "description": "Extract action items and tasks from conversation context",
                            "arguments": [
                                {
                                    "name": "session_id",
                                    "description": "Unique identifier for the conversation session",
                                    "required": True
                                }
                            ]
                        }
                    ]
                }
            }
        )
    
    elif method == "prompts/get":
        if "params" not in body or "name" not in body["params"]:
            return JSONResponse(
                status_code=400,
                content={"error": {"code": -32602, "message": "Missing required parameters"}}
            )
        
        name = body["params"]["name"]
        arguments = body["params"].get("arguments", {})
        
        try:
            session_id = arguments.get("session_id", "")
            
            # Get context for the requested session
            context = ""
            if session_id:
                context_data = db_get_context(session_id)
                if context_data:
                    context = context_data["context"]
            
            if name == "summarize-conversation":
                return JSONResponse(
                    content={
                        "jsonrpc": "2.0",
                        "id": request_id,
                        "result": {
                            "messages": [
                                {
                                    "role": "user",
                                    "content": {
                                        "type": "text",
                                        "text": f"Please provide a concise summary of the following conversation:\n\n{context}"
                                    }
                                }
                            ]
                        }
                    }
                )
            elif name == "extract-tasks":
                return JSONResponse(
                    content={
                        "jsonrpc": "2.0",
                        "id": request_id,
                        "result": {
                            "messages": [
                                {
                                    "role": "user",
                                    "content": {
                                        "type": "text",
                                        "text": f"Please analyze the following conversation and extract any action items, tasks, or commitments:\n\n{context}"
                                    }
                                }
                            ]
                        }
                    }
                )
            else:
                return JSONResponse(
                    status_code=404,
                    content={"error": {"code": -32601, "message": f"Prompt template '{name}' not found"}}
                )
        except Exception as e:
            logger.error(f"Error getting prompt: {e}")
            return JSONResponse(
                status_code=500,
                content={"error": {"code": -32000, "message": f"Error getting prompt: {str(e)}"}}
            )
    
    else:
        return JSONResponse(
            status_code=404,
            content={"error": {"code": -32601, "message": f"Method '{method}' not found"}}
        )

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Start the server when this script is run
if __name__ == "__main__":
    import uvicorn
    
    # Initialize the database
    init_db()
    
    # Get port configuration
    port = int(os.environ.get("MCP_PORT", "3000"))
    
    # Start the server
    logger.info(f"Starting Anthropic MCP server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port) 