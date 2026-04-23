# AytchMCP - Aytch4K Model Context Protocol Server

This directory contains the Model Context Protocol (MCP) server implementation for Aytch4K applications. The MCP server provides an interface for Large Language Models (LLMs) to interact with Aytch4K applications.

## Components

- **uv**: Python package manager for managing Python projects
- **fastmcp**: Core interface to the MCP protocol, handling connection management, protocol compliance, and message routing
- **resources**: Data sources exposed to LLMs (similar to GET endpoints in a REST API)
- **tools**: Components that allow LLMs to take actions through the server (with computation and side effects)
- **prompts**: Reusable templates for LLM interaction
- **images**: Handling of image data
- **context**: Access to MCP capabilities for tools and resources

## LLM Integrations

AytchMCP supports multiple LLM providers:

- **OpenAI**: GPT-4, GPT-3.5, and other OpenAI models
- **Anthropic**: Claude and other Anthropic models
- **OpenRouter.ai**: Access to a wide variety of models through a single API
- **NinjaChat.ai**: Access to NinjaChat's models

## Docker Setup

The MCP server is containerized using Docker:
- `Dockerfile.build`: For building the MCP server
- `Dockerfile.run`: For running the MCP server
- `docker-compose.yml`: For orchestrating the MCP services

## Configuration

Configuration is managed through properties files to allow for customization of:
- Naming
- Variables
- Branding
- LLM integrations (OpenAI, Anthropic, OpenRouter.ai, NinjaChat.ai)
- Other service integrations

This approach ensures the MCP server can be reused across different clients with minimal changes.