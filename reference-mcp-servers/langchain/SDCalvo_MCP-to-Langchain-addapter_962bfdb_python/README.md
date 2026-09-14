# MCP to LangChain/LangGraph Adapter

This project provides an adapter that allows you to use MCP (Multi-modal Conversational Procedure) server tools in LangChain and LangGraph applications. With this adapter, you can seamlessly integrate MCP's tools into your AI application pipelines.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Getting Started](#getting-started)
  - [Setting Up the MCP Server](#setting-up-the-mcp-server)
  - [Connecting to the MCP Server](#connecting-to-the-mcp-server)
  - [Using MCP Tools with LangChain](#using-mcp-tools-with-langchain)
  - [Using MCP Tools with LangGraph](#using-mcp-tools-with-langgraph)
- [API Reference](#api-reference)
  - [MCPAdapter](#mcpadapter)
  - [MCPToolWrapper](#mcptoolwrapper)
  - [Utility Functions](#utility-functions)
- [Examples](#examples)
  - [Basic Usage](#basic-usage)
  - [Integration with LangChain Agents](#integration-with-langchain-agents)
  - [Integration with LangGraph Agents](#integration-with-langgraph-agents)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Introduction

The MCP to LangChain/LangGraph Adapter bridges the gap between MCP servers, which provide various tools through a standardized interface, and LangChain/LangGraph, popular frameworks for building applications with large language models. This adapter enables you to:

- Connect to an MCP server
- Discover available tools
- Convert MCP tools to LangChain-compatible tools
- Use these tools in LangChain agents, chains, and LangGraph agents

## Installation

To use this adapter, you need to have the necessary packages installed:

```bash
# If using pipenv (recommended)
pipenv install mcp langchain langchain-openai langgraph python-dotenv

# If using pip
pip install mcp langchain langchain-openai langgraph python-dotenv
```

## Setting Up API Keys

For examples using OpenAI models, you'll need an OpenAI API key. The recommended way to set this up is using a `.env` file:

1. Create a `.env` file in your project root (based on `.env.example`):

```
OPENAI_API_KEY=your_actual_api_key_here
```

2. Load the environment variables in your code:

```python
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
```

Alternatively, you can set the API key directly in your environment or code:

```python
import os
os.environ["OPENAI_API_KEY"] = "your_api_key_here"
```

## Getting Started

### Setting Up the MCP Server

Before using the adapter, you need to have an MCP server running. The adapter is designed to work with an MCP server script that you provide.

1. Create a basic MCP server script (e.g., `simple_server.py`):

```python
import mcp
from mcp.server import expose

@expose()
def add(a: int, b: int) -> int:
    """Add two numbers and return the result."""
    return a + b

@expose()
def get_weather(city: str) -> str:
    """
    Get the current weather for a city.

    Args:
        city: The name of the city to get weather for
    """
    # In a real application, you'd call a weather API here
    return f"Weather in {city}: Sunny +11°C"

if __name__ == "__main__":
    mcp.run(transport='stdio')
```

This example server exposes two tools:

- `add`: Takes two integers and returns their sum
- `get_weather`: Takes a city name and returns a simulated weather report

### Connecting to the MCP Server

The adapter will automatically manage the connection to the MCP server:

```python
from mcp_langchain_adapter import MCPAdapter

# Create an adapter instance, pointing to your MCP server script
adapter = MCPAdapter("simple_server.py")

# Initialize the connection and get the list of available tools
tools = adapter.get_tools()

# Print the available tools
print(f"Found {len(tools)} tools:")
for tool in tools:
    print(f"- {tool.name}: {tool.description}")
```

### Using MCP Tools with LangChain

Once you have the tools, you can use them in LangChain applications:

```python
from langchain.agents import AgentExecutor, create_react_agent
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI

# Initialize the language model
llm = ChatOpenAI(model="gpt-3.5-turbo")

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
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# Run the agent
result = agent_executor.invoke({"input": "What is 5 + 7?"})
print(result["output"])
```

### Using MCP Tools with LangGraph

LangGraph provides a more modern, flexible approach to building agents. Here's how to use our MCP tools with LangGraph:

```python
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver

# Initialize the language model
llm = ChatOpenAI(model="gpt-3.5-turbo")

# Create a memory saver for conversation history
memory = MemorySaver()

# Create a LangGraph react agent with the MCP tools
agent = create_react_agent(
    llm,
    tools,
    prompt="You are a helpful AI assistant that can use tools to solve problems.",
    checkpointer=memory
)

# Create the configuration with thread ID for memory
config = {"configurable": {"thread_id": "example-thread"}}

# Run the agent with a question
result = agent.invoke(
    {"messages": [HumanMessage(content="What is 5 + 7?")]},
    config
)

# Get the final answer
final_answer = result["messages"][-1].content
print(final_answer)

# Continue the conversation with a follow-up question
state = memory.get("example-thread")
messages = state["messages"] + [HumanMessage(content="What's the weather in London?")]
result = agent.invoke({"messages": messages}, config)
print(result["messages"][-1].content)
```

## API Reference

### MCPAdapter

The `MCPAdapter` class manages the connection to the MCP server and converts MCP tools to LangChain tools.

#### Constructor

```python
MCPAdapter(server_script_path: str, env: Dict[str, str] = None)
```

- `server_script_path`: Path to the MCP server script to run
- `env`: Optional environment variables for the server process

#### Methods

- `initialize()`: Initialize the connection to the MCP server synchronously
- `get_tools() -> List[BaseTool]`: Get all available tools as LangChain tools
- `get_tool_names() -> List[str]`: Get the names of all available tools
- `get_tool_by_name(name: str) -> Optional[BaseTool]`: Get a specific tool by name
- `close() -> None`: Clean up resources (async method)

### MCPToolWrapper

The `MCPToolWrapper` class extends LangChain's `BaseTool` to wrap MCP tools:

```python
MCPToolWrapper(
    name: str,
    description: str,
    server_script_path: str,
    env: Optional[Dict[str, str]] = None,
    args_schema: Optional[Type[BaseModel]] = None
)
```

- `name`: Name of the tool
- `description`: Description of the tool
- `server_script_path`: Path to the MCP server script
- `env`: Optional environment variables for the server process
- `args_schema`: Optional Pydantic model for tool arguments

### Utility Functions

- `get_langchain_tools(server_script_path: str, env: Dict[str, str] = None) -> List[BaseTool]`: Convenience function to get LangChain tools from an MCP server

## Examples

### Basic Usage

Here's a complete example of how to use the adapter:

```python
from mcp_langchain_adapter import MCPAdapter

# Create an adapter instance
adapter = MCPAdapter("simple_server.py")

# Get all tools
tools = adapter.get_tools()

# Print information about the tools
print(f"Found {len(tools)} tools:")
for tool in tools:
    print(f"- {tool.name}: {tool.description}")

# Use a specific tool
add_tool = adapter.get_tool_by_name("add")
if add_tool:
    result = add_tool.run({"a": 5, "b": 7})
    print(f"Result of add(5, 7): {result}")

# Use another tool
weather_tool = adapter.get_tool_by_name("get_weather")
if weather_tool:
    result = weather_tool.run({"city": "London"})
    print(f"Result of get_weather('London'): {result}")
```

### Integration with LangChain Agents

For a full example of integrating with LangChain agents, see the `example_agent_integration.py` file.

Key features:

- Connects to an MCP server
- Retrieves available tools
- Creates a LangChain agent with the tools
- Executes the agent with different types of queries

### Integration with LangGraph Agents

For a full example of integrating with LangGraph agents, see the `example_langgraph_integration.py` file.

Key features:

- Connects to an MCP server
- Retrieves available tools
- Creates a LangGraph react agent with the tools
- Manages conversation history with checkpointing
- Executes the agent with different types of queries
- Shows how to stream the agent's thinking process

## Troubleshooting

### Common Issues

1. **MCP Server Connection Issues**

   - Make sure the path to your MCP server script is correct
   - Check that the server script has proper permissions to run
   - Ensure the server script is properly implementing the MCP protocol

2. **Tool Execution Errors**

   - Check the tool input format is correct
   - Ensure the tool is properly defined in the MCP server
   - Look for error messages in the tool response

3. **LangChain/LangGraph Integration Issues**
   - Verify that the tools are properly converted to LangChain format
   - Check that the agent is configured correctly
   - Ensure you're passing the right format of input to the agent
   - For LangGraph issues, check the thread IDs and memory configuration

### Debugging

To debug connection issues, you can add logging to your MCP server script:

```python
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("mcp_server.log"),
        logging.StreamHandler()
    ]
)

# Rest of your MCP server code...
```

## Contributing

Contributions to improve the adapter are welcome! Here are some ways you can contribute:

- Report bugs and issues
- Add new features or improve existing ones
- Improve documentation
- Write tests
- Share examples of integration with different LangChain/LangGraph components

Please follow these steps to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
