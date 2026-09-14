# MCP Servers

A collection of Minecraft Protocol (MCP) servers implemented in TypeScript.

## Servers

### Basic Server
A simple MCP server that handles basic player connections and chat messages.

### Auth Server
A server that implements authentication and handles player sessions.

### Proxy Server
A proxy server that can forward connections to other Minecraft servers.

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/pgtipping/mcp-servers.git
cd mcp-servers
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Start a server:
```bash
npm run start:basic     # Start the basic server
npm run start:auth      # Start the auth server
npm run start:proxy     # Start the proxy server
```

## Development

1. Start a server in development mode:
```bash
npm run dev:basic      # Start the basic server with hot reload
npm run dev:auth       # Start the auth server with hot reload
npm run dev:proxy      # Start the proxy server with hot reload
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
