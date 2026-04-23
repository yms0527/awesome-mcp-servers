# SmallCloud MCP Server Demo

## Overview

SmallCloud MCP Server Demonstration of an Anthropic MCP server using the Model Context Protocol SDK by Anthropic. For use with Claude Desktop and other MCP Hosts.

This is a demo for Mac OS. Windows may require some small adjustments. I would consider creating a package as opposed to just an index.js file (like in this demo) if you expect your MCP solution to be reusable by others.

Visit https://smallcloud.co for more AI/LLM/Coding resources. 

## Prerequisites

- Node.js (version 18 or later recommended) #installed by homebrow in this example
- npm


## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/smallcloud-mcp-server.git
   cd smallcloud-mcp-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

Run the server:
```bash
node index.js
```

### Claude Desktop Configuration (MacOS)

To make the MCP Server appear in Claude Desktop on MacOS, add the following to your `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "smallcloud-mcp-server": {
      "command": "/opt/homebrew/bin/node",
      "args": [
        "~/Git/smallcloud-mcp-server/index.js"
      ]
    }
  }
}
```

Note: Adjust the path to `index.js` to match your local repository location.

### Available Tools

Currently, the server includes one demonstration tool:
- `get_hello`: Returns a "Hello, World!" message

## Development

### Running Tests

To run the test suite:
```bash
npm test
```

The test suite currently checks:
- Server startup
- Tool listing functionality

## Project Structure

```
smallcloud-mcp-server/
│
├── index.js          # Main server implementation used by Claude Desktop. See section "Claude Desktop Configuration (MacOS)"
└── test/
    └── server.test.js # Server test suite
```
## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

[Specify your license here]

## Contact

[Your contact information or project maintainer details]
