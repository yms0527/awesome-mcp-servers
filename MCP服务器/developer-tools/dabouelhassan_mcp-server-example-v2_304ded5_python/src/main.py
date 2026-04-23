from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Simple MCP Server")

class ContextRequest(BaseModel):
    prompt_id: str
    parameters: dict = {}

class ContextResponse(BaseModel):
    context: str
    metadata: Optional[dict] = None

# In-memory store for our prompts
PROMPTS = {
    "greeting": "Hello! I am an AI assistant. The current time is {time}.",
    "data_analysis": "Based on the provided data: {data}"
}

@app.get("/")
async def read_root():
    return {"status": "healthy", "protocol": "mcp", "version": "1.0.0"}

@app.post("/context", response_model=ContextResponse)
async def get_context(request: ContextRequest):
    if request.prompt_id not in PROMPTS:
        raise HTTPException(status_code=404, detail="Prompt not found")
    
    try:
        context = PROMPTS[request.prompt_id].format(**request.parameters)
        return ContextResponse(
            context=context,
            metadata={"prompt_id": request.prompt_id}
        )
    except KeyError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required parameter: {str(e)}"
        )
