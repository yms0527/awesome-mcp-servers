from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import logging
import os
import time
from anthropic_mcp_client import MCPClient

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)

logger = logging.getLogger(__name__)

# Environment variables for service URLs
MCP_SERVER_URL = os.environ.get("MCP_SERVER_URL", "http://mcp-server-container:3000")
OLLAMA_API_URL = os.environ.get("OLLAMA_API_URL", "http://host.docker.internal:11434/api/generate")
MODEL_NAME = os.environ.get("MODEL_NAME", "gemma3:4b")

app = FastAPI(title="MCP Middleware Proxy", version="0.1.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the MCP client
mcp_client = MCPClient(MCP_SERVER_URL)

class ProxyRequest(BaseModel):
    session_id: str
    content: str


class ProxyResponse(BaseModel):
    session_id: str
    context: str
    response: str


# Middleware for request logging
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    response = await call_next(request)
    
    process_time = time.time() - start_time
    logger.info(
        f"{request.method} {request.url.path} "
        f"- Status: {response.status_code} "
        f"- Time: {process_time:.4f}s"
    )
    
    return response


@app.post("/infer", response_model=ProxyResponse)
async def infer(request: ProxyRequest):
    """
    Process a user request by retrieving context, querying LLM, and updating context.
    """
    try:
        # First, store the user message in the MCP server
        logger.info(f"Adding user message to context for session {request.session_id}")
        user_message_format = f"User: {request.content}"
        
        # Use MCP store_context tool
        await mcp_client.store_context(request.session_id, user_message_format)
        
        # Get the updated context using the MCP get_context tool
        logger.info(f"Retrieving context for session {request.session_id}")
        context = await mcp_client.get_context(request.session_id)
        
        # Query the LLM (Ollama)
        logger.info(f"Querying Ollama with model {MODEL_NAME}")
        ollama_response = requests.post(
            OLLAMA_API_URL,
            json={"model": MODEL_NAME, "prompt": context, "stream": False}
        )
        
        if ollama_response.status_code != 200:
            logger.error(f"Ollama error: {ollama_response.text}")
            raise HTTPException(status_code=500, detail="Ollama inference error")
        
        inference_result = ollama_response.json().get("response", "")
        assistant_response_format = f"Assistant: {inference_result}"
        
        # Store the assistant's response in the MCP server
        logger.info(f"Adding assistant response to context for session {request.session_id}")
        await mcp_client.store_context(request.session_id, assistant_response_format)
        
        # Return the final response
        return {
            "session_id": request.session_id,
            "context": context,
            "response": inference_result
        }
        
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.get("/health")
async def health_check():
    """
    Health check endpoint.
    """
    try:
        # Check if we can connect to the MCP server
        server_info = await mcp_client.get_server_info()
        
        # Check if we can connect to Ollama
        ollama_response = requests.get(OLLAMA_API_URL.replace("/api/generate", "/api/tags"))
        ollama_ok = ollama_response.status_code == 200
        
        if server_info and ollama_ok:
            return {
                "status": "healthy",
                "mcp_server": "connected",
                "ollama": "connected"
            }
        else:
            details = {}
            if not server_info:
                details["mcp_server"] = "disconnected"
            if not ollama_ok:
                details["ollama"] = "disconnected"
                
            return {
                "status": "degraded",
                **details
            }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True) 