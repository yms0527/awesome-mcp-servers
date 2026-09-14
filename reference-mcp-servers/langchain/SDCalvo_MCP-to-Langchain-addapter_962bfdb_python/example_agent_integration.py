"""
Example of integrating MCP tools with a LangChain agent.

This script demonstrates how to:
1. Connect to an MCP server
2. Get tools from the server
3. Use those tools with a LangChain agent
4. Run the agent to solve a problem using the tools

You'll need to have the following packages installed:
- mcp
- langchain
- openai
- langchain_openai
- python-dotenv

Before running, create a .env file in the project root with:
OPENAI_API_KEY=your_api_key_here
"""

import os
import sys
from typing import List
from pathlib import Path
from dotenv import load_dotenv
import getpass
import logging

# LangChain imports
from langchain.agents import AgentExecutor, create_react_agent
from langchain_openai import ChatOpenAI
from langchain.tools import BaseTool
from langchain.prompts import PromptTemplate

# Import the MCP adapter
from mcp_langchain_adapter import MCPAdapter

# Load environment variables from .env file
env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)

# Check if OpenAI API key is set
if "OPENAI_API_KEY" not in os.environ:
    print("OpenAI API key not found in environment variables or .env file.")
    print("Please create a .env file with OPENAI_API_KEY=your_api_key_here")
    print("Alternatively, you can set it manually for this session:")
    api_key = getpass.getpass("Enter your OpenAI API key (or Ctrl+C to exit): ")
    os.environ["OPENAI_API_KEY"] = api_key
else:
    print("OpenAI API key found in environment.")

# Set up logging
log_level = os.environ.get("LOG_LEVEL", "INFO")
numeric_level = getattr(logging, log_level.upper(), logging.INFO)
logging.basicConfig(
    level=numeric_level,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__) 

def get_mcp_tools(server_script_path: str) -> List[BaseTool]:
    """
    Connect to an MCP server and get its tools.
    
    Args:
        server_script_path: Path to the MCP server script
        
    Returns:
        List of LangChain tools
    """
    logger.info(f"Connecting to MCP server at: {server_script_path}")
    
    # Create an adapter instance
    adapter = MCPAdapter(server_script_path)
    
    # Get all tools
    tools = adapter.get_tools()
    
    # Print information about the tools
    logger.info(f"Found {len(tools)} tools:")
    for tool in tools:
        logger.info(f"- {tool.name}: {tool.description}")
        if hasattr(tool, 'args_schema') and tool.args_schema:
            logger.debug("  Parameters:")
            for field_name, field_info in tool.args_schema.model_fields.items():
                logger.debug(f"    - {field_name}: {field_info.annotation}")
    
    return tools

def run_agent_example(agent_executor, question: str):
    """
    Run the agent with a question and print the result.
    
    Args:
        agent_executor: The LangChain agent executor
        question: The question to ask
    """
    logger.info(f"Question: {question}")
    
    # Run the agent
    result = agent_executor.invoke({"input": question})
    
    # Print the result
    logger.info(f"Answer: {result['output']}")
    
    # Print intermediate steps if available and debug is enabled
    if logger.isEnabledFor(logging.DEBUG) and "intermediate_steps" in result:
        logger.debug("Intermediate steps:")
        for i, (action, observation) in enumerate(result["intermediate_steps"]):
            logger.debug(f"Step {i+1}:")
            logger.debug(f"  Action: {action.tool} - {action.tool_input}")
            logger.debug(f"  Observation: {observation}")

def main():
    """Run the example."""
    # Path to the MCP server script from env or command line
    if len(sys.argv) > 1:
        server_script_path = sys.argv[1]
    else:
        server_script_path = os.environ.get("MCP_SERVER_PATH", "simple_server.py")
    
    # Get model configuration from environment
    model = os.environ.get("LLM_MODEL", "gpt-3.5-turbo")
    temperature = float(os.environ.get("LLM_TEMPERATURE", "0"))
    
    logger.info(f"Using model: {model} with temperature: {temperature}")
    
    # Get tools from the MCP server
    tools = get_mcp_tools(server_script_path)
    
    if not tools:
        logger.error("No tools found. Make sure the MCP server is properly configured.")
        sys.exit(1)
    
    # Initialize the language model
    llm = ChatOpenAI(model=model, temperature=temperature)
    
    # Create a prompt template for the agent
    template = """Answer the following questions as best you can using the provided tools.

Available tools:
{tools}

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Begin!

Question: {input}
Thought: """

    prompt_template = PromptTemplate.from_template(template)
    
    # Create a LangChain agent with the MCP tools
    agent = create_react_agent(llm, tools, prompt_template)
    agent_executor = AgentExecutor(
        agent=agent, 
        tools=tools, 
        verbose=logger.isEnabledFor(logging.DEBUG),
        return_intermediate_steps=True
    )
    
    # Run examples
    run_agent_example(agent_executor, "What is 5 + 7?")
    run_agent_example(agent_executor, "What's the weather in London?")
    run_agent_example(agent_executor, "First add 10 and 25, then get the weather in Paris.")
    run_agent_example(agent_executor, "Can you tell me what 42 + 18 is, and then tell me the weather in Tokyo?")

if __name__ == "__main__":
    main() 