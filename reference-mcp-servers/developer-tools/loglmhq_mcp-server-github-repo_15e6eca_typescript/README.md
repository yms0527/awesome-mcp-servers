# MCP GitHub Repository Server

An MCP (Model Context Protocol) server that provides access to GitHub repository contents. This server allows AI assistants to browse and read files from specified GitHub repositories.

## Demo

![demo](/demo.png)

## Features

### Resources

- Access any file in a GitHub repository via URI
- List repository contents and navigate directories
- Support for branch-specific file access
- File contents are served as plain text

### Resource URIs

- Base URL format: `https://api.github.com/repos/{owner}/{repo}/contents/{path}`
- Supports both files and directories
- Files are served with `text/plain` MIME type
- Directories are served with `application/x-directory` MIME type

## Configuration

The server requires the following environment variables:

```bash
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token
GITHUB_OWNER=repository_owner
GITHUB_REPO=repository_name
GITHUB_BRANCH=branch_name  # Optional
```

## Development

Install dependencies:

```bash
npm install
```

Build the server:

```bash
npm run build
```

For development with auto-rebuild:

```bash
npm run watch
```

## Installation

To use with Claude Desktop, add the server configuration:

### Config Location

- MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "mcp-server-github-repo": {
      "command": "/path/to/mcp-server-github-repo/build/index.js"
    }
  }
}
```

## API Implementation

The server implements three main MCP endpoints:

1. `ListResources` - Lists files and directories in the repository
2. `ReadResource` - Retrieves contents of a specific file

### Authentication

The server uses GitHub Personal Access Token for authentication. Make sure your token has appropriate permissions to access the repository contents.

### Error Handling

The server includes error handling for:

- Missing environment variables
- GitHub API errors
- Invalid paths (e.g., trying to read a directory as a file)
- Authentication failures

## Debugging

Since MCP servers communicate over stdio, debugging can be challenging. Use the MCP Inspector for debugging:

```bash
npm run inspector
```

This will provide a URL to access debugging tools in your browser.

## Security Notes

- Keep your GitHub Personal Access Token secure
- Consider using tokens with minimal required permissions
- Be aware of repository size limitations when accessing large repositories

## License

MIT