# Simple MCP Server Example

This is a basic implementation of a Model Context Protocol (MCP) server using FastAPI. The server demonstrates the core concepts of MCP by providing a simple context service.

## Features

- Basic health check endpoint
- Context endpoint that processes prompt templates
- Support for parameterized prompts

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the server:
   ```bash
   uvicorn src.main:app --reload
   ```

## Usage

The server provides two endpoints:

1. GET / - Health check
2. POST /context - Get context for a prompt

Example request:
```bash
curl -X POST http://localhost:8000/context \
  -H "Content-Type: application/json" \
  -d '{"prompt_id": "greeting", "parameters": {"time": "12:00 PM"}}'
```
