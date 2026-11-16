# MCP Crash Course

A demonstration project showcasing the integration of LangChain with Model Control Protocol (MCP) adapters. This project implements a system that can handle both mathematical calculations and weather queries through separate MCP servers.

## Features

- Multiple MCP server integration (math and weather servers)
- LangChain integration with OpenAI
- Async operation support
- Environment variable configuration

## Prerequisites

- Python 3.x
- OpenAI API key

## Installation

1. Clone the repository
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

## Project Structure

- `main.py` - Single server implementation using stdio client
- `langchain_client.py` - Multi-server implementation using MCP client
- `server/` - Directory containing MCP server implementations
  - `math_server.py` - Server for mathematical operations
  - `weather_server.py` - Server for weather queries

## Usage

1. Run the single server example:
   ```bash
   python main.py
   ```

2. Run the multi-server example:
   ```bash
   python langchain_client.py
   ```

## How It Works

The project demonstrates two approaches to using MCP:

1. Single Server (main.py):
   - Uses stdio client for communication
   - Connects to a math server for calculations
   - Implements a React agent using LangChain

2. Multi-Server (langchain_client.py):
   - Uses MultiServerMCPClient for managing multiple servers
   - Connects to both math and weather servers
   - Allows the agent to choose appropriate tools based on the query

## Dependencies

- langchain-core
- langchain-openai
- langchain-mcp-adapters
- langgraph
- python-dotenv
- mcp

## License

MIT