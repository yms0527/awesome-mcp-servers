"""
Example of integrating MCP tools with LangGraph's react agent.

This script demonstrates how to:
1. Connect to an MCP server
2. Get tools from the server
3. Use those tools with a LangGraph react agent
4. Run the agent to solve a problem using the tools

You'll need to have the following packages installed:
- mcp
- langchain
- langgraph
- langchain-openai
- openai
- python-dotenv

Before running, create a .env file in the project root with:
OPENAI_API_KEY=your_api_key_here
"""

import os
import sys
from typing import List, Dict, Any
import getpass
from pathlib import Path
from dotenv import load_dotenv
import logging

# LangChain imports
from langchain.tools import BaseTool
from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI

# LangGraph imports
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver

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
    print(f"Connecting to MCP server at: {server_script_path}")
    
    # Create an adapter instance
    adapter = MCPAdapter(server_script_path)
    
    # Get all tools
    tools = adapter.get_tools()
    
    # Print information about the tools
    print(f"Found {len(tools)} tools:")
    for tool in tools:
        print(f"- {tool.name}: {tool.description}")
        if hasattr(tool, 'args_schema') and tool.args_schema:
            print("  Parameters:")
            for field_name, field_info in tool.args_schema.model_fields.items():
                print(f"    - {field_name}: {field_info.annotation}")
    
    return tools

def create_langgraph_agent(tools: List[BaseTool], model: str = "gpt-3.5-turbo", temperature: float = 0):
    """
    Create a LangGraph react agent with the provided tools.
    
    Args:
        tools: List of LangChain tools
        model: The OpenAI model to use
        temperature: Model temperature (0=deterministic, higher=more random)
        
    Returns:
        A LangGraph react agent
    """
    print(f"Creating LangGraph agent with model: {model}")
    
    # Initialize the language model
    llm = ChatOpenAI(model=model, temperature=temperature)
    
    # Create a memory saver for conversation history
    memory = MemorySaver()
    
    # Create the react agent with memory
    agent = create_react_agent(
        llm, 
        tools, 
        # Custom system message
        prompt="You are a helpful AI assistant that can use tools to solve problems. Provide detailed, thoughtful responses.",
        # Memory store for conversation history
        checkpointer=memory
    )
    
    return agent, memory

def run_agent_example(agent, memory, question: str, thread_id: str = "default-thread"):
    """
    Run the agent with a specific question.
    
    Args:
        agent: LangGraph react agent
        memory: Memory saver for conversation history
        question: Question to ask the agent
        thread_id: Thread ID for the conversation
    """
    print("\n" + "="*50)
    print(f"Question: {question}")
    print("="*50)
    
    # Create the configuration with thread ID for memory
    config = {"configurable": {"thread_id": thread_id}}
    
    # Create initial message
    messages = [HumanMessage(content=question)]
    
    try:
        # Run the agent with the configuration
        result = agent.invoke({"messages": messages}, config)
        
        # Get the last assistant message (the final answer)
        final_answer = result["messages"][-1].content
        
        # Print the entire conversation for debugging
        print("\nConversation:")
        for i, message in enumerate(result["messages"]):
            role = "User" if isinstance(message, HumanMessage) else "Assistant"
            print(f"{i}. {role}: {message.content}")
        
        print("\n" + "="*50)
        print("Final Answer:", final_answer)
        print("="*50 + "\n")
        
        return result
    except Exception as e:
        print(f"Error running the agent: {str(e)}")
        import traceback
        traceback.print_exc()
        return {"messages": messages}

def stream_agent_example(agent, question: str, thread_id: str = "default-thread"):
    """
    Stream the agent's response for a specific question.
    
    Args:
        agent: LangGraph react agent
        question: Question to ask the agent
        thread_id: Thread ID for the conversation
    """
    print("\n" + "="*50)
    print(f"Question (streaming): {question}")
    print("="*50)
    
    # Create the configuration with thread ID
    config = {"configurable": {"thread_id": thread_id}}
    
    # Stream the response
    print("\nAgent thinking process:")
    for chunk in agent.stream(
        {"messages": [HumanMessage(content=question)]},
        config,
        stream_mode="updates"
    ):
        # Display changes as they happen
        if "agent" in chunk:
            print(f"Agent: {chunk['agent']['messages'][-1].content}")
        elif "tools" in chunk:
            tool_message = chunk["tools"]["messages"][-1]
            print(f"Tool {tool_message.name}: {tool_message.content}")
    
    print("="*50 + "\n")

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
    logger.info(f"Using MCP server script: {server_script_path}")
    
    # Get tools from the MCP server
    tools = get_mcp_tools(server_script_path)
    
    if not tools:
        logger.error("No tools found. Make sure the MCP server is properly configured.")
        sys.exit(1)
    
    # Create a LangGraph agent
    agent, memory = create_langgraph_agent(tools, model=model, temperature=temperature)
    
    # Run examples with the same thread ID to maintain conversation history
    thread_id = "example-conversation"
    
    # Basic question
    run_agent_example(agent, memory, "What is 5 + 7?", thread_id)
    
    # Weather question 
    run_agent_example(agent, memory, "What's the weather in London?", thread_id)
    
    # Complex question that uses both tools
    run_agent_example(agent, memory, "First add 10 and 25, then get the weather in Paris.", thread_id)
    
    # Follow-up question referencing previous conversation
    run_agent_example(agent, memory, "What was the result of the addition you did earlier?", thread_id)
    
    # Example of streaming response for a new question
    stream_agent_example(agent, "What is 42 + 18 and what's the weather in Tokyo?", "streaming-example")

if __name__ == "__main__":
    main() 