# MCP Multi-Server Demo with SSE Transport

This project demonstrates how to use the Model Context Protocol (MCP) with multiple servers using different transport methods (stdio and Server-Sent Events).

It is based on examples from: https://github.com/langchain-ai/langchain-mcp-adapters

## Overview

The project consists of:

1. A math server that provides basic arithmetic operations (add, multiply)
2. A weather server that provides simulated weather information for different locations
3. A main application that connects to both servers using the MultiServerMCPClient
4. Integration with LangChain and OpenAI to create an agent that can use tools from both servers

## Requirements

- Python 3.8+
- OpenAI API key

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mcp-sse.git
   cd mcp-sse
   ```

2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up your OpenAI API key in a `.env` file:
   ```
   OPENAI_API_KEY=your-api-key-here
   ```

## Project Structure

- `main.py`: The main application that connects to both servers and runs the agent
- `math_server.py`: A simple MCP server that provides math operations using stdio transport
- `weather_server.py`: A simple MCP server that provides weather information using SSE transport
- `requirements.txt`: List of Python dependencies
- `.env`: Environment variables (contains your OpenAI API key)

## How It Works

The application demonstrates how to use the MultiServerMCPClient to connect to multiple MCP servers with different transport methods:

1. The math server uses stdio transport, which is a simple pipe-based communication method
2. The weather server uses Server-Sent Events (SSE) transport, which is an HTTP-based protocol for server-to-client push notifications

The main application:
1. Starts the weather server as a separate process
2. Connects to both servers using the MultiServerMCPClient
3. Creates a LangChain agent that can use tools from both servers
4. Demonstrates using the agent to perform math calculations and get weather information

## Usage

Run the main application:

```bash
python main.py
```

This will:
1. Start the weather server on port 8000
2. Connect to both the math and weather servers
3. Run the agent with example queries for both math and weather

## Example Queries

The demo includes two example queries:

1. Math query: "what's (3 + 5) x 12?"
2. Weather query: "what is the weather in nyc?"

## Extending the Project

You can extend this project by:

1. Adding more tools to the math or weather servers
2. Creating additional MCP servers with different functionality
3. Modifying the agent to handle more complex queries
4. Connecting to real weather APIs instead of using simulated data

## License

MIT

## Acknowledgments

- This project uses the [MCP (Model Context Protocol)](https://modelcontextprotocol.io/introduction) developed by Anthropic
- Integration with [LangChain](https://github.com/langchain-ai/langchain) for agent functionality
