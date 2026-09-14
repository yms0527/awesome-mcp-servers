# mcp_servers/creative_llm/main.py

from fastapi import FastAPI, HTTPException
from protocols.messages import MCPToolCall, MCPToolResult, CreativeLLMGenerateParameters
from langchain_core.messages import HumanMessage
import logging
import os

from langchain_anthropic import ChatAnthropic

logger = logging.getLogger(__name__) 
logger.setLevel(logging.DEBUG) 

if not logging.root.handlers:
    logging.basicConfig() 
    
for handler in logging.root.handlers:
    handler.setLevel(logging.DEBUG)

app = FastAPI(title="Creative LLM MCP Server")

anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")

if not anthropic_api_key:
    logger.error("ANTHROPIC_API_KEY environment variable not set in Creative LLM MCP!")

try:
    llm = ChatAnthropic(model="claude-3-5-sonnet-20241022", temperature=0.7, anthropic_api_key=anthropic_api_key)
    logger.info(f"Creative LLM MCP Server: LLM initialized ({llm.model}).")
except Exception as e:
     logger.error(f"Creative LLM MCP Server: Failed to initialize LLM: {e}")
     llm = None

@app.get("/")
async def read_root():
    status_msg = f"LLM initialized ({llm.model})." if llm else "LLM failed to initialize."
    return {"message": f"Creative LLM MCP Server is running. {status_msg}"}


@app.post("/mcp/tool", response_model=MCPToolResult)
async def call_tool(tool_call: MCPToolCall):
    """
    Receives an MCP tool call and generates text using an LLM.
    Handles 'generate_text' tool.
    """
    logger.info(f"Received MCP Tool Call: {tool_call.model_dump_json(indent=2)}")

    if tool_call.tool_name == "generate_text":
        if not llm:
            logger.error("Creative LLM MCP: LLM is not initialized. Cannot generate text.")
            return MCPToolResult(
                status="failure",
                error={"code": "LLM_NOT_INITIALIZED", "message": "Creative LLM MCP's LLM failed to initialize. Check ANTHROPIC_API_KEY."}
            )

        try:
            params = CreativeLLMGenerateParameters.model_validate(tool_call.parameters)
            logger.info(f"Received generate_text call with prompt: {params.prompt[:100]}...")
        except Exception as e:
            logger.warning(f"Invalid parameters for generate_text tool: {e}")
            return MCPToolResult(
                status="failure",
                error={"code": "INVALID_PARAMETERS", "message": f"Invalid parameters for generate_text: {e}"}
            )

        logger.info("Creative LLM MCP: Sending prompt to LLM for text generation...")

        try:
            messages_to_generate = [[HumanMessage(content=params.prompt)]]

            llm_response = await llm.agenerate(
                messages_to_generate,
                max_tokens=params.max_tokens,
                temperature=params.temperature
            )
            logger.debug(f"Creative LLM MCP: Raw LLM response type: {type(llm_response)}")
            if hasattr(llm_response, 'generations') and llm_response.generations:
                 logger.debug(f"Creative LLM MCP: LLM response has generations attribute. Length: {len(llm_response.generations)}")
                 if len(llm_response.generations[0]) > 0:
                      generation = llm_response.generations[0][0]
                      logger.debug(f"Creative LLM MCP: First generation item type: {type(generation)}")
                      logger.debug(f"Creative LLM MCP: First generation item attributes: {dir(generation)}")
                      if hasattr(generation, 'text'):
                           logger.debug(f"Creative LLM MCP: Generation has 'text' attribute. Content: {generation.text[:100]}")
                      if hasattr(generation, 'message'):
                           logger.debug(f"Creative LLM MCP: Generation has 'message' attribute. Type: {type(generation.message)}")
                           if hasattr(generation.message, 'content'):
                                logger.debug(f"Creative LLM MCP: Message has 'content' attribute. Content: {generation.message.content[:100]}")
            else:
                 logger.debug("Creative LLM MCP: LLM response does NOT have expected generations attribute.")
                 if isinstance(llm_response, str):
                      logger.debug(f"Creative LLM MCP: LLM response is a string. Content: {llm_response[:100]}")

            generated_text = None
            if llm_response and hasattr(llm_response, 'generations') and llm_response.generations and len(llm_response.generations) > 0 and len(llm_response.generations[0]) > 0:
                 generation = llm_response.generations[0][0]
                 if hasattr(generation, 'message') and hasattr(generation.message, 'content') and generation.message.content is not None:
                      generated_text = generation.message.content
                 elif hasattr(generation, 'text') and generation.text is not None:
                     generated_text = generation.text

            if generated_text is None:
                 logger.error(f"Creative LLM MCP: Could not extract generated text from LLM response after checks.")
                 raise ValueError("Could not extract generated text from LLM response.") 

            logger.info("Creative LLM MCP: Successfully extracted generated text.")


            return MCPToolResult(
                status="success",
                result={"generated_text": generated_text}
            )

        except Exception as e:
            logger.error(f"Creative LLM MCP: Error during LLM text generation or extraction: {e}")
            return MCPToolResult(
                status="failure",
                error={"code": "LLM_GENERATION_ERROR", "message": f"Text generation failed: {e}"}
            )
    else:
        logger.warning(f"Creative LLM MCP: Received call for unknown tool: {tool_call.tool_name}")
        raise HTTPException(
            status_code=404,
            detail=MCPToolResult(
                status="failure",
                error={"code": "TOOL_NOT_FOUND", "message": f"Tool '{tool_call.tool_name}' not found."}
            ).model_dump()
        )