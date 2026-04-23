# Memory Bank MCP

## Overview

Memory Bank MCP is an MCP (Model Context Protocol) server that provides tools and resources for managing memory banks. It allows AI assistants to store and retrieve information across sessions.

## Key Features

- Initialize and manage Memory Banks
- Read and write files in Memory Banks
- Track progress and decisions
- Maintain active context
- Provide MCP tools and resources for AI assistants
- Support for clinerules integration for mode-specific behavior
- UMB (Update Memory Bank) command support

## Technical Stack

- Node.js
- TypeScript
- MCP SDK (@modelcontextprotocol/sdk)
- fs-extra for file operations
- Bun for building, running, and testing

## Architecture

The project is organized into the following components:

1. **Core**

   - MemoryBankManager: Manages Memory Bank operations
   - ProgressTracker: Tracks progress and updates Memory Bank files
   - Templates: Contains templates for Memory Bank files

2. **Server**

   - MemoryBankServer: Main MCP server class
   - Tools: MCP tools for Memory Bank operations
   - Resources: MCP resources for Memory Bank information

3. **Utils**

   - FileUtils: Utility functions for file operations
   - ExternalRulesLoader: Loads and monitors .clinerules files
   - ModeManager: Manages modes based on .clinerules files

4. **Tests**
   - Located in src/**tests**
   - Uses Bun's built-in test runner
   - Tests for clinerules integration

## Development Guidelines

- All code and documentation should be in English
- Use TypeScript for type safety
- Implement robust error handling
- Write comprehensive documentation
- Follow clean code principles
- Write tests for new functionality
