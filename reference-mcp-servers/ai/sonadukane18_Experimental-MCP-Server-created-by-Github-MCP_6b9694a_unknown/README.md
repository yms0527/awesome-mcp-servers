# GitHub MCP Server Setup Guide

This repository demonstrates how to set up and use a GitHub Model Context Protocol (MCP) server for AI-assisted development workflows.

## What is MCP?

Model Context Protocol (MCP) enables AI assistants to interact with external systems and APIs through standardized interfaces. The GitHub MCP server specifically allows AI models to perform GitHub operations like:

- Creating/managing repositories
- Managing files and content
- Working with issues and pull requests
- Accessing repository information
- And more!

## Setup Instructions

### Prerequisites
- Node.js installed on your system
- A GitHub account
- A GitHub Personal Access Token (PAT) with appropriate permissions

### Step 1: Create a GitHub Personal Access Token
1. Go to GitHub Settings → Developer Settings → Personal Access Tokens
2. Create a new fine-grained token with the following permissions:
   - Repository: Read and write (Administration, Contents, Issues, Pull requests)
   - User: Read-only
3. Save your token securely - you'll need it for the configuration

### Step 2: Set Up MCP Configuration
1. Create a configuration file named `mcp.json` in your user directory (e.g., `~/.cursor/mcp.json` or `C:\Users\YourUsername\.cursor\mcp.json`)
2. Add the following configuration:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your_github_pat_here"
      }
    }
  }
}
```

3. Replace `your_github_pat_here` with your actual GitHub Personal Access Token

### Step 3: Test Your MCP Server
1. Install a compatible AI coding assistant that supports MCP (like Cursor)
2. Ask the assistant to perform GitHub operations, such as:
   - Creating repositories
   - Fetching file contents
   - Creating issues
   - Making pull requests

## Usage Examples

Here are some examples of operations you can perform with your GitHub MCP:

- Create a new repository: `Create a new GitHub repository named "my-project"`
- Push code to a repository: `Push this file to my repository`
- Create an issue: `Create an issue titled "Fix navigation bug" in my repository`
- Fetch repository contents: `Show me the contents of the main.js file from my repository`

## Troubleshooting

- **Permission Errors**: Ensure your GitHub PAT has the necessary permissions for the operations you're trying to perform
- **Connection Issues**: Check that your MCP server is properly configured and running
- **Token Expiration**: GitHub PATs can expire - check if you need to generate a new one

## Resources

- [Model Context Protocol (MCP) Documentation](https://github.com/modelcontextprotocol/protocol)
- [GitHub API Documentation](https://docs.github.com/en/rest)
- [NPM Package: @modelcontextprotocol/server-github](https://www.npmjs.com/package/@modelcontextprotocol/server-github)

---

*Note: Always keep your GitHub Personal Access Token secure and never commit it to public repositories.*