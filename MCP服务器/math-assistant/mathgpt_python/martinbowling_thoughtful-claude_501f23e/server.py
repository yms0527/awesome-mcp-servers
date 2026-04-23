from mcp.server.fastmcp import FastMCP
import httpx
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")

# Initialize FastMCP server
mcp = FastMCP("Thoughtful Claude DeepSeek Reasoner")

async def get_deepseek_response(query: str) -> str:
    """Get reasoning from DeepSeek API"""
    async with httpx.AsyncClient() as client:
        headers = {
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "deepseek-reasoner",
            "messages": [{"role": "user", "content": query}],
            "stream": True,
            "max_tokens": 1
        }
        
        async with client.stream(
            "POST",
            "https://api.deepseek.com/chat/completions",
            headers=headers,
            json=payload,
            timeout=30000.0
        ) as response:
            reasoning_chunks = []
            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    data = line[6:]
                    if data == "[DONE]":
                        continue
                    try:
                        chunk_data = json.loads(data)
                        if content := chunk_data.get("choices", [{}])[0].get("delta", {}).get("reasoning_content", ""):
                            reasoning_chunks.append(content)
                    except:
                        continue
            
            return " ".join(reasoning_chunks)

@mcp.tool()
async def reason(query: dict) -> str:
    """Process a query through DeepSeek's R1 reasoning engine and format for Claude.
    
    Utilizes DeepSeek R1's advanced reasoning capabilities, which were developed through
    large-scale reinforcement learning to naturally emerge powerful reasoning behaviors.
    The reasoning output is wrapped in <ant_thinking> tags to integrate with Claude's
    thought process.
    
    Args:
        query: Dictionary containing:
            - context: Optional background information for the query
            - question: The specific question to reason about
            
    Returns:
        str: DeepSeek's reasoning wrapped in <ant_thinking> tags for Claude's consumption
    """
    try:
        # Format the query from the input
        context = query.get('context', '')
        question = query.get('question', '')
        full_query = f"{context}\n{question}" if context else question
        
        # Get reasoning from DeepSeek
        reasoning = await get_deepseek_response(full_query)
        
        # Return the reasoning wrapped in ant_thinking tags
        return f"<ant_thinking>\n{reasoning}\n</ant_thinking>\n\nnow we should provide our final answer based on the above thinking"
    except Exception as e:
        return f"<reasoning_error>\nError: {str(e)}\n</reasoning_error>\n\nexplain the error"

if __name__ == "__main__":
    mcp.run()
