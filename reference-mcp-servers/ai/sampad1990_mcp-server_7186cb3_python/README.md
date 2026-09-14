# MCP Server

A scalable and modular Model Context Protocol (MCP) server implementation using Python.

## Overview

This project implements an MCP-compliant server that allows AI models to discover and invoke tools through a standardized protocol. The server is designed to be modular, with each tool implemented as a separate Python module.

## Installation

\`\`\`
pip install -r requirements.txt
\`\`\`

## Usage

To run the server:

\`\`\`
python -m src.server
\`\`\`

## Adding New Tools

Create a new Python file in the \`src/tools\` directory with functions using the \`@tool\` decorator.