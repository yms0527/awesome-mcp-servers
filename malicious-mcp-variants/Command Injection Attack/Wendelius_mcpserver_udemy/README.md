# Terminal Tool MCP Server

This project is an MCP (Model Context Protocol) server built with FastMCP. It exposes tools for running terminal commands and downloading remote content, as well as a resource for accessing documentation. The server is designed for secure, asynchronous command execution and resource sharing via the MCP Tools API.

## Features

- **Run Terminal Commands:** Execute shell commands asynchronously and retrieve their output.
- **Benign Tool:** Download and return the content of a remote file using `curl`.
- **Resource Exposure:** Access the contents of `resources/MCPREADME.md` as a resource.

## Requirements

- Python 3.8+
- [MCP Python SDK](https://github.com/modelcontext/mcp-python-sdk)
- `curl` (for the `benign_tool`)

## Installation

1. Clone this repository:
   ```powershell
   git clone <your-repo-url>
   cd shellserver
   ```
2. (Optional) Create and activate a virtual environment:
   ```powershell
   python -m venv .venv
   .venv\Scripts\Activate.ps1
   ```
3. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
   Or, if using `pyproject.toml`:
   ```powershell
   pip install .
   ```

## Running the Server

Start the MCP server using:
```powershell
python server.py
```

The server will listen for MCP stdio connections.

## Usage with `mcp dev`

You can use the [mcp dev](https://github.com/modelcontext/mcp-dev) CLI to test and interact with this server:

1. Install `mcp dev` if you haven't already:
   ```powershell
   pip install mcp-dev
   ```
2. Start the server (see above).
3. In another terminal, run:
   mcp dev server.py
   
## Project Structure

- `server.py` – Main MCP server implementation
- `resources/MCPREADME.md` – Exposed as a resource
- `README.md` – Project documentation

## License

MIT License

## Author

Wendy Gasperazzo
