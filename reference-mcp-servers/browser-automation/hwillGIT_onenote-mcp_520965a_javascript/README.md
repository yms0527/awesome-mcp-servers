# OneNote MCP Server

An MCP (Model Context Protocol) server for browsing and interacting with OneNote web app using browser automation. This server enables AI assistants and other MCP-compatible clients to programmatically browse and interact with OneNote notebooks that are shared via web links.

## Features

- Navigate OneNote's hierarchical structure (notebooks, sections, pages)
- Read page content from OneNote
- Add new content to existing pages
- Create new pages
- Search within OneNote
- Take screenshots of the current view
- Maintain state across the session

## Requirements

- Python 3.10 or higher
- browser-use 0.1.40 or higher
- MCP SDK 1.2.0 or higher
- Playwright
- Internet connection
- A shared OneNote notebook URL (must be accessible without authentication)

## Installation

```bash
# Clone the repository or create the project structure
# Then navigate to the project directory
cd onenote-mcp

# Install the package and dependencies
pip install -e .

# Install Playwright browsers
playwright install
```

## Usage

### Standalone Mode

You can run the server directly with:

```bash
python -m onenote_mcp
```

### Integration with Claude Desktop or other MCP hosts

1. Configure your Claude Desktop to use the OneNote MCP server by editing the configuration file:

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

2. Launch Claude Desktop, which will automatically start the OneNote MCP server
3. Use the available tools in your chat with Claude:

```
Can you help me navigate my OneNote notebook at https://example.com/my-shared-notebook? 
First, please launch OneNote with this URL and tell me what notebooks are available.
```

## Available Tools

- `launch_onenote(shared_url)`: Launch the OneNote web app with a shared notebook URL
- `get_all_notebooks()`: List all available notebooks
- `get_all_sections()`: List all sections in the current notebook
- `get_all_pages()`: List all pages in the current section
- `navigate_to_notebook_by_name(notebook_name)`: Go to a specific notebook
- `navigate_to_section_by_name(section_name)`: Go to a specific section
- `navigate_to_page_by_name(page_name)`: Go to a specific page
- `get_current_page_content()`: Get the content of the current page
- `add_content_to_page(content)`: Add content to the current page
- `create_new_page_with_name(page_name)`: Create a new page
- `search_in_onenote(search_term)`: Search OneNote for specific terms
- `take_screenshot()`: Take a screenshot of the current view
- `get_onenote_state()`: Get the current state information
- `close_onenote()`: Close the OneNote session and clean up resources

## How It Works

This MCP server uses browser-use, a browser automation framework, to interact with the OneNote web interface. It creates a bridge between MCP-compatible AI assistants and the OneNote web application, enabling programmatic control of OneNote functions.

## Limitations

- Only works with OneNote notebooks that are shared with a public link (no authentication)
- The server may need adjustments if the OneNote web interface changes
- Browser automation can be somewhat fragile and dependent on the UI structure
- Performance may vary based on network conditions and OneNote's responsiveness

## Troubleshooting

- If the server fails to connect to OneNote, ensure the shared link is accessible without login
- If selectors fail, the OneNote UI may have changed - check the server code
- For other issues, check the server logs for error details

## License

MIT