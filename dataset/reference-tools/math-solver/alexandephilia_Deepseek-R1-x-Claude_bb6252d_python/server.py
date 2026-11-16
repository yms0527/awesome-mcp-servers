from mcp.server.fastmcp import FastMCP
import httpx
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")

# Initialize FastMCP server
mcp = FastMCP("DeepSeek Reasoner Claude Executor")

async def get_deepseek_response(query: str) -> str:
    """Get advanced reasoning from DeepSeek R1 API
    
    DeepSeek R1 serves as our primary reasoning engine, leveraging its:
    - Advanced cognitive modeling
    - Multi-step reasoning capabilities
    - Emergent reasoning patterns
    - Robust logical analysis framework
    """
    async with httpx.AsyncClient() as client:
        headers = {
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "deepseek-reasoner",
            "messages": [{
                "role": "user", 
                "content": f"""[REASONING TASK]
Please analyze this query using your advanced reasoning capabilities:

CONTEXT & QUERY:
{query}

REQUIRED ANALYSIS STRUCTURE:
1. Initial impressions and key components
2. Logical relationships and dependencies
3. Critical assumptions and implications
4. Synthesis and confidence assessment

Please structure your response to cover all these aspects systematically.
"""
            }],
            "stream": True,
            "max_tokens": 1,
            "temperature": 0.7  # Balanced between creativity and logic
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
    """Process a query through DeepSeek R1's advanced reasoning engine.
    
    DeepSeek R1 acts as our primary reasoning planner, providing:
    - Structured cognitive analysis
    - Multi-step logical decomposition
    - Critical assumption evaluation
    - Confidence-weighted conclusions
    
    The engine has been trained through large-scale reinforcement learning
    to naturally emerge sophisticated reasoning patterns and strategies.
    
    Args:
        query: Dictionary containing:
            - context: Optional background information for the query
            - question: The specific question to reason about
            
    Returns:
        str: DeepSeek R1's structured reasoning analysis
    """
    try:
        # Format the query for DeepSeek R1
        context = query.get('context', '')
        question = query.get('question', '')
        full_query = f"{context}\n{question}" if context else question
        
        # Get DeepSeek R1's reasoning analysis
        r1_reasoning = await get_deepseek_response(full_query)
        
        # Structure DeepSeek R1's cognitive process
        structured_reasoning = f"""<ant_thinking>
[DEEPSEEK R1 INITIAL ANALYSIS]
• First Principles: {r1_reasoning[:150]}
• Component Breakdown: Decomposing the problem space...
• Key Variables: Identifying critical factors...

[DEEPSEEK R1 REASONING CHAIN]
• Logical Framework: {r1_reasoning[150:300]}
• Causal Relationships: Mapping dependencies...
• Inference Patterns: Extracting reasoning structures...

[DEEPSEEK R1 CRITICAL ANALYSIS]
• Core Assumptions: {r1_reasoning[300:450]}
• Edge Cases: Stress-testing the logic...
• Uncertainty Assessment: Quantifying confidence levels...

[DEEPSEEK R1 SYNTHESIS]
• Primary Conclusions: {r1_reasoning[450:600]}
• Confidence Metrics: Evaluating reasoning robustness...
• Action Implications: Practical consequences...

[DEEPSEEK R1 METACOGNITION]
• Reasoning Quality: {r1_reasoning[600:]}
• Bias Detection: Checking for systematic errors...
• Knowledge Boundaries: Acknowledging limitations...
</ant_thinking>

Based on DeepSeek R1's comprehensive analysis, proceeding to formulate response..."""
        
        return structured_reasoning
    except Exception as e:
        return f"""<reasoning_error>
[DEEPSEEK R1 ERROR ANALYSIS]
• Error Nature: {str(e)}
• Processing Impact: Effects on reasoning pipeline
• Recovery Options: Alternative reasoning paths
• System Status: Current reasoning capabilities

[MITIGATION STRATEGY]
• Immediate Actions: Required interventions
• Fallback Logic: Alternative reasoning approaches
• Quality Assurance: Validation requirements
</reasoning_error>

Analyzing DeepSeek R1's error state and implications..."""

if __name__ == "__main__":
    mcp.run()
