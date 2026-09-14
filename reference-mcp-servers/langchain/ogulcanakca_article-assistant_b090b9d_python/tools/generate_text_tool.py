# tools/generate_text_tool.py

import logging
from typing import Type, Optional
from tools.mcp_tool_adapter import call_mcp_tool
from config import CREATIVE_LLM_MCP_URL
from langchain_core.tools import BaseTool
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

class GenerateTextInput(BaseModel):
    """Input schema for the Generate Text Tool."""
    prompt: str = Field(description="The prompt for text generation.")
    model: Optional[str] = Field(None, description="Specific LLM model to use.")
    max_tokens: Optional[int] = Field(1000, description="Maximum number of tokens to generate.")
    temperature: Optional[float] = Field(0.7, description="Sampling temperature for generation.")


class GenerateTextTool(BaseTool):
    name: str = "generate_text" 
    description: str = "Useful for generating creative text like articles, poems, or drafts from a prompt."
    args_schema: Type[BaseModel] = GenerateTextInput

    async def _arun(self, prompt: str, model: Optional[str] = None, max_tokens: Optional[int] = 1000, temperature: Optional[float] = 0.7) -> str:
        """Use the tool asynchronously."""
        logger.info(f"GenerateTextTool._arun: Calling Creative LLM MCP for prompt: '{prompt[:50]}...'")

        mcp_result = call_mcp_tool(
            mcp_server_url=CREATIVE_LLM_MCP_URL,
            tool_name="generate_text", 
            parameters={
                "prompt": prompt,
                "model": model,
                "max_tokens": max_tokens,
                "temperature": temperature
            },
            task_id=None 
        )

        if mcp_result.status == "success" and mcp_result.result and "generated_text" in mcp_result.result:
            logger.info("GenerateTextTool._arun: MCP tool call successful.")
            return mcp_result.result["generated_text"] 
        else:
            logger.error(f"GenerateTextTool._arun: MCP tool call failed. Error: {mcp_result.error}")
            return f"Error generating text: {mcp_result.error.get('message', 'Unknown generation error')}"

    def _run(self, prompt: str, model: Optional[str] = None, max_tokens: Optional[int] = 1000, temperature: Optional[float] = 0.7) -> str:
        """Use the tool synchronously."""
        raise NotImplementedError("GenerateTextTool does not support synchronous execution.")

generate_text_tool_instance = GenerateTextTool()