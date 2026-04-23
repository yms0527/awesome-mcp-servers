from fastapi import FastAPI, HTTPException
import os
from openai import OpenAI
from typing import Optional
from fastapi import FastAPI
from fastapi_mcp import FastApiMCP



app = FastAPI(
    title="Hello World API",
    description="A simple FastAPI Hello World application",
    version="0.1.0"
)


mcp = FastApiMCP(
    app,
    name="My API MCP",
    description="My API description",
    base_url="http://localhost:8000",
)

mcp.mount()

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}


@app.get("/openai")
async def openai_completion(prompt: Optional[str] = "Say hello world from AI!"):
    # Get API key from environment variable
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not found in environment variables")
    
    # Initialize OpenAI client
    client = OpenAI(api_key=api_key)
    
    try:
        # Make a chat completion request with the provided prompt
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ]
        )
        
        # Return the response
        return {
            "message": response.choices[0].message.content,
            "model": response.model
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error from OpenAI API: {str(e)}")

mcp.setup_server()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
