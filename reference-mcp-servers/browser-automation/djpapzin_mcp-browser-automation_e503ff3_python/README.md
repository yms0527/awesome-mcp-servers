# MCP Tools Project

This project implements two MCP (Model Context Protocol) servers:

1. **Echo MCP Server**: A simple echo server for testing MCP communication
2. **Browser-use MCP Server**: A browser automation server using browser-use and LangChain

## Requirements

- Python 3.12+
- Virtual environment
- Required packages (see requirements.txt)

## Installation

1. Create and activate virtual environment:
```bash
python -m venv .venv
.\.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Linux/Mac
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
# Create .env file with your OpenAI API key
OPENAI_API_KEY=your_api_key_here
```

## MCP Servers

### Echo Server
Simple echo server that demonstrates basic MCP functionality:
- Echo messages as resources
- Echo messages as tools

### Browser-use Server
Browser automation server that:
- Uses browser-use library for web automation
- Integrates with LangChain and OpenAI
- Provides browser automation capabilities through MCP

## Usage

1. Start Echo server in development mode:
```bash
mcp dev echo_server.py
```

2. Start Browser-use server in development mode:
```bash
mcp dev browser_use_mcp.py
```

## Configuration

MCP server configurations are stored in `.cursor/mcp.json`.
                            
                                
                            
                        