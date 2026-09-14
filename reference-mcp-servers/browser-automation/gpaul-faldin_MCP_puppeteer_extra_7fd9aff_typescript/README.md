# Puppeteer-Extra MCP Server

A Model Context Protocol server that provides enhanced browser automation capabilities using Puppeteer-Extra with Stealth Plugin. This server enables LLMs to interact with web pages in a way that better emulates human behavior and avoids detection as automation.

## Features

- Enhanced browser automation with Puppeteer-Extra
- Stealth mode to avoid bot detection
- Screenshot capabilities for pages and elements
- Console logging and JavaScript execution
- Full suite of interaction methods (click, fill, select, hover)

## Components

### Tools

- **puppeteer_navigate**
  - Navigate to any URL in the browser
  - Input: `url` (string)

- **puppeteer_screenshot**
  - Capture screenshots of the entire page or specific elements
  - Inputs:
    - `name` (string, required): Name for the screenshot
    - `selector` (string, optional): CSS selector for element to screenshot
    - `width` (number, optional, default: 800): Screenshot width
    - `height` (number, optional, default: 600): Screenshot height

- **puppeteer_click**
  - Click elements on the page
  - Input: `selector` (string): CSS selector for element to click

- **puppeteer_hover**
  - Hover elements on the page
  - Input: `selector` (string): CSS selector for element to hover

- **puppeteer_fill**
  - Fill out input fields
  - Inputs:
    - `selector` (string): CSS selector for input field
    - `value` (string): Value to fill

- **puppeteer_select**
  - Select an element with SELECT tag
  - Inputs:
    - `selector` (string): CSS selector for element to select
    - `value` (string): Value to select

- **puppeteer_evaluate**
  - Execute JavaScript in the browser console
  - Input: `script` (string): JavaScript code to execute

### Resources

The server provides access to two types of resources:

1. **Console Logs** (`console://logs`)
   - Browser console output in text format
   - Includes all console messages from the browser

2. **Screenshots** (`screenshot://<name>`)
   - PNG images of captured screenshots
   - Accessible via the screenshot name specified during capture

## Development

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd puppeteer_extra

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.development
```

### Running Locally

```bash
# Development mode (non-headless browser)
npm run dev

# Production mode (headless browser)
npm run prod
```

### Building

```bash
npm run build
```

## Docker

### Building the Docker Image

```bash
docker build -t mcp/puppeteer-extra .
```

### Running with Docker

```bash
docker run -i --rm --init -e DOCKER_CONTAINER=true mcp/puppeteer-extra
```

## Configuration for Claude Desktop

### Docker

```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "--init", "-e", "DOCKER_CONTAINER=true", "mcp/puppeteer-extra"]
    }
  }
}
```

### NPX

```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "MCP_puppeteer_extra"]
    }
  }
}
```

## License

This MCP server is licensed under the MIT License.
