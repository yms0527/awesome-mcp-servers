# GitHub MCP Server

This repository is for testing the implementation and usage of the Model Context Protocol (MCP) server.

## Overview

The Model Context Protocol (MCP) is a protocol for standardizing communication between Large Language Models (LLMs) and client applications. Using this protocol, agents can effectively interact with external tools and client applications.

The GitHub MCP server integrates with the GitHub API to provide LLM agents with features such as repository operations, code search, and issue management.

## Features

- **Repository Operations**: Create repositories, add/edit files, manage branches
- **Code Search**: Search code on GitHub
- **Issue/PR Management**: Create, update, and comment on issues and pull requests
- **Authentication Management**: Secure authentication with GitHub API

## Requirements

- Node.js (v16.0.0 or higher)
- npm or yarn
- GitHub account and Personal Access Token (PAT)

## Installation

```bash
# Clone repository
git clone https://github.com/tomo-cps/mcp-test.git
cd mcp-test

# Install dependencies
npm install
# or
yarn install
```

## Configuration

1. Create a `.env` file and set the following environment variables:

```
GITHUB_TOKEN=your_github_personal_access_token
PORT=3000
```

2. How to obtain a GitHub Personal Access Token:
   - Log in to GitHub
   - Click your profile icon in the top right > Settings > Developer settings > Personal access tokens
   - Click "Generate new token"
   - Select required permissions (recommended: repo, user, read:org)
   - Generate token and save it in the `.env` file

## Starting the Server

```bash
# Development mode
npm run dev
# or
yarn dev

# Production mode
npm start
# or
yarn start
```

By default, the server runs at `http://localhost:3000`.

## API Endpoints

This MCP server provides the following main endpoints:

- `/mcp/describe`: Describes available features and parameters
- `/mcp/execute`: Executes specified commands
- `/mcp/state`: Gets or updates current state

## Usage Examples

### 1. Get Repository Information

```javascript
// Client-side code example
const response = await fetch('http://localhost:3000/mcp/execute', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    command: 'get_repository',
    params: {
      owner: 'octocat',
      repo: 'hello-world'
    }
  })
});

const data = await response.json();
console.log(data);
```

### 2. Create an Issue

```javascript
// Client-side code example
const response = await fetch('http://localhost:3000/mcp/execute', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    command: 'create_issue',
    params: {
      owner: 'your-username',
      repo: 'your-repo',
      title: 'Bug: Problem in login screen',
      body: 'Detailed description goes here...',
      labels: ['bug', 'priority:high']
    }
  })
});

const data = await response.json();
console.log(data);
```

## Troubleshooting

Common issues and solutions:

1. **Authentication Error**: Verify that your GitHub token is correctly configured.
2. **Rate Limit**: GitHub API has rate limits. If you hit the limit, wait a while before retrying.
3. **CORS Error**: For cross-origin calls, ensure the server has proper CORS headers configured.

## Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## License

MIT License - See [LICENSE](LICENSE) file for details.

## References

- [Model Context Protocol Specification](https://github.com/microsoft/model-context-protocol)
- [GitHub REST API Documentation](https://docs.github.com/en/rest)