# Setup Guide for OneNote MCP

This guide will walk you through setting up the OneNote MCP server for use with Claude Desktop or other MCP-compatible AI assistants.

## Prerequisites

- Python 3.10 or higher
- Node.js 14 or higher (for some JavaScript-based helper tools)
- Playwright for browser automation
- A shared OneNote notebook URL (must be accessible without authentication)

## Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/onenote-mcp.git
   cd onenote-mcp
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -e .
   ```

3. **Install Playwright browsers:**
   ```bash
   playwright install
   ```

4. **Install Node.js dependencies (if using JavaScript tools):**
   ```bash
   npm install
   ```

## Configuration

### Claude Desktop Integration

1. Open your Claude Desktop configuration file:
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

2. Add the OneNote MCP server configuration:
   ```json
   {
     "mcpServers": {
       "onenote": {
         "command": "python",
         "args": ["-m", "onenote_mcp"]
       }
     }
   }
   ```

3. Restart Claude Desktop to apply the changes

## Usage

To use the OneNote MCP server with Claude, simply ask Claude to interact with your OneNote notebook:

```
Can you help me navigate my OneNote notebook at https://example.com/my-shared-notebook? 
First, please launch OneNote with this URL and tell me what notebooks are available.
```

## Troubleshooting

If you encounter any issues:

1. **Check logs:**
   - The server creates logs in the `logs` directory

2. **Verify OneNote URL:**
   - Make sure your OneNote notebook is accessible without authentication

3. **Browser issues:**
   - Try running in non-headless mode to see what's happening

4. **Selector errors:**
   - OneNote's web interface may have changed. Check the server code for updated selectors.

## Getting Help

If you need assistance, please:
- Open an issue on GitHub
- Check the CONTRIBUTING.md file for more information on contributing to the project
